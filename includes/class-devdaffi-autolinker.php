<?php
/**
 * Keyword Auto-Linker — turns configured keywords in post content into tagged
 * Amazon affiliate links.
 *
 * Runs on the_content at priority 25 (after the tag rewriter at 20). It only
 * touches real text: an HTML tokenizer + context stack guarantees we never link
 * inside an existing <a> (no nested anchors) or inside headings/code/blockquotes
 * when those skips are on. Inserted links are placeholder-protected so a later
 * rule/keyword can't match inside one.
 */

defined( 'ABSPATH' ) || exit;

class DEVDAFFI_Autolinker {

	private $limit      = 2;   // max links per page (global)
	private $page_count = 0;   // links inserted on the current page
	private $rel_attr   = '';  // ' rel="nofollow sponsored" target="_blank"'
	private $rules      = array();

	public function __construct() {
		add_filter( 'the_content', array( $this, 'process' ), 25 );
	}

	public function process( $content ) {
		if ( is_admin() || empty( $content ) || ! is_singular() ) {
			return $content;
		}

		$s  = DEVDAFFI_Settings::get();
		$al = $s['auto_linker'];
		if ( empty( $al['enabled'] ) || empty( $al['rules'] ) ) {
			return $content;
		}

		$post_id = get_the_ID();
		if ( DEVDAFFI_Rewriter::is_excluded( $post_id ) ) {
			return $content;
		}

		// Apply-to gate.
		$type = get_post_type( $post_id );
		$ok   = ( 'post' === $type && ! empty( $al['apply']['posts'] ) )
			|| ( 'page' === $type && ! empty( $al['apply']['pages'] ) )
			|| ( 'product' === $type && ! empty( $al['apply']['products'] ) );
		if ( ! $ok ) {
			return $content;
		}

		$this->rules = $this->prepare_rules( $al['rules'], $s );
		if ( empty( $this->rules ) ) {
			return $content;
		}

		$this->limit      = (int) $al['limit'];
		$this->page_count = 0;
		$this->rel_attr   = $this->rel_attr( $s['link_options'] );

		return $this->linkify( $content, $al['skip'] );
	}

	/** Resolve each rule's destination URL (tagged) once. */
	private function prepare_rules( $rules, $settings ) {
		$prepared = array();
		foreach ( $rules as $r ) {
			if ( empty( $r['enabled'] ) || '' === trim( (string) $r['keywords'] ) || '' === trim( (string) $r['link'] ) ) {
				continue;
			}
			$keywords = array_values( array_filter( array_map( 'trim', explode( ',', $r['keywords'] ) ) ) );
			if ( empty( $keywords ) ) {
				continue;
			}

			// The rule points at a Link Setup tag (tag-<id>) for its affiliate_id + domain.
			$tag_id = preg_replace( '/^tag-/', '', (string) $r['tag'] );
			$aff    = '';
			$domain = 'amazon.com';
			foreach ( $settings['tags'] as $t ) {
				if ( (string) $t['id'] === (string) $tag_id ) {
					$aff    = $t['affiliate_id'];
					$domain = $t['domain'];
					break;
				}
			}

			// Build the destination from a full URL or a bare ASIN. Shortlinks aren't
			// supported here (the UI flags them), so we skip anything else.
			$link = trim( (string) $r['link'] );
			if ( preg_match( '#^https?://#i', $link ) ) {
				$url = $link;
			} elseif ( preg_match( '/^[A-Za-z0-9]{10}$/', $link ) ) {
				$url = 'https://www.' . $domain . '/dp/' . $link;
			} else {
				continue; // not a usable target
			}
			if ( '' !== $aff ) {
				$url = DEVDAFFI_Rewriter::set_tag( $url, $aff );
			}

			$prepared[] = array(
				'id'       => isset( $r['id'] ) ? (string) $r['id'] : '',
				'keywords' => $keywords,
				'url'      => $url,
				'match'    => $r['match_type'],
				'cs'       => ! empty( $r['case_sensitive'] ),
				'max'      => (int) $r['max_links'], // 0 = unlimited (still bounded by global limit)
				'first'    => ! empty( $r['first_match_only'] ),
				'count'    => 0,
			);
		}
		return $prepared;
	}

	/** Walk tags vs text; only replace inside safe text nodes. */
	private function linkify( $content, $skip ) {
		$parts = preg_split( '#(<!--.*?-->|<(?:[^>"\']|"[^"]*"|\'[^\']*\')*>)#s', $content, -1, PREG_SPLIT_DELIM_CAPTURE | PREG_SPLIT_NO_EMPTY ); // a quoted '>' never ends the tag (round 2); a comment is one opaque token (round 5)
		if ( empty( $parts ) ) {
			return $content;
		}
		$depth = array( 'a' => 0, 'heading' => 0, 'code' => 0, 'pre' => 0, 'blockquote' => 0, 'raw' => 0 );
		$fp    = ! empty( $skip['first_paragraph'] ) ? 'before' : 'off'; // first-paragraph state machine
		$out   = '';

		foreach ( $parts as $part ) {
			if ( '' === $part ) {
				continue;
			}
			if ( '<' === $part[0] ) {
				$this->track( $part, $depth );
				if ( 'off' !== $fp && preg_match( '#^<\s*(/?)\s*p\b#i', $part, $pm ) ) {
					if ( '' === $pm[1] && 'before' === $fp ) {
						$fp = 'inside';
					} elseif ( '/' === $pm[1] && 'inside' === $fp ) {
						$fp = 'after';
					}
				}
				$out .= $part;
				continue;
			}
			if ( $this->page_count >= $this->limit ) {
				$out .= $part;
				continue;
			}
			// Never nest anchors; honour the configured skips.
			$blocked = $depth['a'] > 0
				|| $depth['raw'] > 0 // script / style / textarea / title / button text is never a link (round 1)
				|| ( $skip['headings'] && $depth['heading'] > 0 )
				|| ( $skip['code'] && ( $depth['code'] > 0 || $depth['pre'] > 0 ) )
				|| ( $skip['blockquotes'] && $depth['blockquote'] > 0 )
				|| ( 'inside' === $fp );
			$out .= $blocked ? $part : $this->replace_text( $part );
		}
		return $out;
	}

	/** Maintain open-element depth for the contexts we care about. */
	private function track( $tag, &$depth ) {
		if ( ! preg_match( '#^<\s*(/?)\s*([a-zA-Z0-9]+)#', $tag, $m ) ) {
			return;
		}
		$closing    = '/' === $m[1];
		$name       = strtolower( $m[2] );
		$self_close = '/>' === substr( rtrim( $tag ), -2 );

		$key = null;
		if ( 'a' === $name ) {
			$key = 'a';
		} elseif ( preg_match( '/^h[1-6]$/', $name ) ) {
			$key = 'heading';
		} elseif ( 'code' === $name ) {
			$key = 'code';
		} elseif ( 'pre' === $name ) {
			$key = 'pre';
		} elseif ( 'blockquote' === $name ) {
			$key = 'blockquote';
		} elseif ( in_array( $name, array( 'script', 'style', 'textarea', 'title', 'button', 'select', 'option', 'noscript', 'svg' ), true ) ) {
			$key = 'raw';
		}
		if ( null === $key || $self_close ) {
			return;
		}
		if ( $closing ) {
			$depth[ $key ] = max( 0, $depth[ $key ] - 1 );
		} else {
			$depth[ $key ]++;
		}
	}

	/** Replace keywords in one text node, protecting inserted anchors from re-matching. */
	private function replace_text( $text ) {
		$placeholders = array();
		// Character references stay whole: "&amp;" must never become "&<a>amp</a>;" (round 2).
		$text = preg_replace_callback( '/&(?:#\d+|#x[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);/', function ( $m ) use ( &$placeholders ) {
			$token                  = "\0" . count( $placeholders ) . "\0";
			$placeholders[ $token ] = $m[0];
			return $token;
		}, $text );

		foreach ( $this->rules as $idx => $rule ) {
			if ( $this->page_count >= $this->limit ) {
				break;
			}
			foreach ( $rule['keywords'] as $kw ) {
				if ( '' === $kw ) {
					continue;
				}
				$allowed = $this->allowed( $idx );
				if ( $allowed <= 0 ) {
					break;
				}
				$pattern  = $this->pattern( $kw, $rule['match'], $rule['cs'] );
				$url      = $this->rules[ $idx ]['url'];
				$rid_attr = '' !== $this->rules[ $idx ]['id'] ? ' data-da-rule="' . esc_attr( $this->rules[ $idx ]['id'] ) . '"' : '';
				// Placeholder tokens ("\0<n>\0": protected entities and anchors already inserted) are skipped, so a
				// keyword like "0" never matches inside one (round 3).
				$segments = preg_split( '/(\x00\d+\x00)/', $text, -1, PREG_SPLIT_DELIM_CAPTURE );
				$replaced = 0;
				$out      = '';
				if ( ! is_array( $segments ) ) {
					$out = null;
				} else {
					foreach ( $segments as $seg ) {
						if ( '' !== $seg && "\0" === $seg[0] ) {
							$out .= $seg;
							continue;
						}
						if ( $allowed - $replaced <= 0 ) {
							$out .= $seg;
							continue;
						}
						$n   = 0;
						$rep = preg_replace_callback(
							$pattern,
							function ( $m ) use ( &$placeholders, $url, $rid_attr ) {
								$token                  = "\0" . count( $placeholders ) . "\0";
								$placeholders[ $token ] = '<a href="' . esc_url( $url ) . '"' . $rid_attr . $this->rel_attr . '>' . esc_html( $m[0] ) . '</a>';
								return $token;
							},
							$seg,
							$allowed - $replaced,
							$n
						);
						if ( null === $rep ) {
							$out = null;
							break;
						}
						$out      .= $rep;
						$replaced += (int) $n;
					}
				}
				// preg_replace_callback returns null on a PCRE backtrack/recursion-limit failure;
				// keep the original text for this keyword instead of blanking the whole node.
				if ( null === $out ) {
					continue;
				}
				$text = $out;
				if ( $replaced > 0 ) {
					$this->rules[ $idx ]['count'] += $replaced;
					$this->page_count             += $replaced;
				}
			}
		}

		return '' === $text ? $text : strtr( $text, $placeholders );
	}

	/** How many more links this rule may add right now. */
	private function allowed( $idx ) {
		$rule       = $this->rules[ $idx ];
		$rule_left  = $rule['max'] > 0 ? $rule['max'] - $rule['count'] : PHP_INT_MAX;
		if ( $rule['first'] ) {
			$rule_left = min( $rule_left, 1 - $rule['count'] );
		}
		$page_left = $this->limit - $this->page_count;
		return (int) max( 0, min( $rule_left, $page_left ) );
	}

	/** Build the keyword regex. exact = whole word; broad = word + optional letters (plurals). */
	private function pattern( $keyword, $match, $case_sensitive ) {
		$kw    = preg_quote( $keyword, '#' );
		$flags = 'u';
		if ( 'broad' === $match || ! $case_sensitive ) {
			$flags .= 'i';
		}
		$tail = ( 'broad' === $match ) ? '[\p{L}]*' : '';
		// (?<![\w]) / (?![\w]) word-ish boundaries that also work mid-entity.
		return '#(?<![\p{L}\p{N}_])' . $kw . $tail . '(?![\p{L}\p{N}_])#' . $flags;
	}

	private function rel_attr( $opts ) {
		$rel = array();
		if ( 'nofollow' === $opts['rel'] ) {
			$rel[] = 'nofollow';
		}
		if ( ! empty( $opts['sponsored'] ) ) {
			$rel[] = 'sponsored';
		}
		$target = '';
		if ( ! empty( $opts['new_tab'] ) ) {
			$target = ' target="_blank"';
			$rel[]  = 'noopener';
		}
		$rel = array_values( array_unique( $rel ) );
		return ( $rel ? ' rel="' . esc_attr( implode( ' ', $rel ) ) . '"' : '' ) . $target;
	}
}
