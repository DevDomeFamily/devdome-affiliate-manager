<?php
/**
 * Content rewriter — on the_content, rewrites Amazon links:
 *  - direct storefront links get the resolved affiliate ?tag=
 *  - shortlinks (amzn.to / a.co) keep their href (opaque); /go tags them at click time
 *  - rel (nofollow/sponsored) and optional new-tab applied to all Amazon links
 */

defined( 'ABSPATH' ) || exit;

class DEVDAFFI_Rewriter {

	const SHORTS = array( 'amzn.to', 'a.co', 'amzn.eu', 'amzn.asia' );

	public function __construct() {
		add_filter( 'the_content', array( $this, 'rewrite' ), 20 );
	}

	public function rewrite( $content ) {
		if ( is_admin() || empty( $content ) || ! is_singular() ) {
			return $content;
		}
		$post_id = get_the_ID();
		if ( self::is_excluded( $post_id ) ) {
			return $content; // this post/page is excluded from affiliate tagging
		}

		// Match the opening <a ...> but don't let a literal '>' inside a quoted
		// attribute value (e.g. title="Deals > 50%") terminate the tag early.
		return preg_replace_callback(
			'#<a\b(?:[^>"\']|"[^"]*"|\'[^\']*\')*>#i',
			function ( $m ) use ( $post_id ) {
				return $this->process_anchor( $m[0], $post_id );
			},
			$content
		);
	}

	private function process_anchor( $tag, $post_id ) {
		if ( ! preg_match( '#\shref\s*=\s*(["\'])(.*?)\1#i', $tag, $hm ) ) {
			return $tag;
		}
		$href = html_entity_decode( $hm[2], ENT_QUOTES );
		$host = strtolower( (string) wp_parse_url( $href, PHP_URL_HOST ) );

		$storefront = self::storefront_domain( $host );
		$is_short   = self::is_short( $host );
		if ( '' === $storefront && ! $is_short ) {
			return $tag; // not an Amazon link — leave untouched
		}

		// Direct storefront link: set the resolved tag, unless the anchor was built without one on purpose
		// (a buy button with "omit the affiliate tag", round 2).
		if ( '' !== $storefront && false === stripos( $tag, 'data-devdaffi-notag=' ) ) {
			$aff = DEVDAFFI_Resolver::resolve( $post_id, $storefront );
			if ( '' !== $aff ) {
				$new_href = self::set_tag( $href, $aff );
				$tag      = str_replace( $hm[0], ' href="' . esc_url( $new_href ) . '"', $tag );
			}
		}

		return self::apply_rel_and_target( $tag );
	}

	/**
	 * Is this post/page excluded from affiliate tagging?
	 * Explicit post/page exclusion always wins; otherwise a post is excluded if
	 * one of its categories is excluded, unless the post is an exception.
	 */
	public static function is_excluded( $post_id ) {
		$post_id = (int) $post_id;
		if ( ! $post_id ) {
			return false;
		}
		$ex = DEVDAFFI_Settings::get()['exclusions'] ?? array();
		$type = get_post_type( $post_id );

		if ( 'page' === $type ) {
			return in_array( $post_id, $ex['pages'] ?? array(), true );
		}
		if ( 'post' === $type ) {
			if ( in_array( $post_id, $ex['posts'] ?? array(), true ) ) {
				return true;
			}
			if ( in_array( $post_id, $ex['except_posts'] ?? array(), true ) ) {
				return false;
			}
			$cats = wp_get_post_categories( $post_id );
			if ( $cats && array_intersect( $cats, $ex['cats'] ?? array() ) ) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Tag + rel/target for a freshly-built Amazon link. Used by the
	 * [devdaffi_button] shortcode so the button is correct even where the
	 * the_content rewriter never runs (widgets, excerpts, page builders).
	 * @return array{href:string,attr:string}
	 */
	public static function decorate( $href, $post_id, $skip_tag = false ) {
		$host       = strtolower( (string) wp_parse_url( $href, PHP_URL_HOST ) );
		$storefront = self::storefront_domain( $host );

		if ( ! $skip_tag && '' !== $storefront ) {
			$aff = DEVDAFFI_Resolver::resolve( (int) $post_id, $storefront );
			if ( '' !== $aff ) {
				$href = self::set_tag( $href, $aff );
			}
		}

		// rel/target apply to Amazon links only (matches the_content behaviour).
		if ( '' === $storefront && ! self::is_short( $host ) ) {
			return array( 'href' => $href, 'attr' => '' );
		}

		$opts = DEVDAFFI_Settings::get()['link_options'];
		$rel  = array();
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
		$rel      = array_values( array_unique( $rel ) );
		$rel_attr = $rel ? ' rel="' . esc_attr( implode( ' ', $rel ) ) . '"' : '';
		return array( 'href' => $href, 'attr' => $rel_attr . $target );
	}

	/** Match host to a known storefront domain (handles www. and subdomains). */
	public static function storefront_domain( $host ) {
		foreach ( DEVDAFFI_Settings::DOMAINS as $d ) {
			if ( $host === $d || self::ends_with( $host, '.' . $d ) ) {
				return $d;
			}
		}
		return '';
	}

	public static function is_short( $host ) {
		foreach ( self::SHORTS as $s ) {
			if ( $host === $s || self::ends_with( $host, '.' . $s ) ) {
				return true;
			}
		}
		return false;
	}

	private static function ends_with( $haystack, $needle ) {
		return '' !== $needle && substr( $haystack, -strlen( $needle ) ) === $needle;
	}

	/** Replace/add the tag query param on an Amazon URL. */
	public static function set_tag( $url, $tag ) {
		$parts = wp_parse_url( $url );
		if ( ! $parts || empty( $parts['host'] ) ) {
			return $url;
		}
		$query = array();
		if ( ! empty( $parts['query'] ) ) {
			parse_str( $parts['query'], $query );
		}
		if ( '' === (string) $tag ) {
			unset( $query['tag'] ); // an empty tag = remove the parameter (round 5)
		} else {
			$query['tag'] = $tag;
		}

		$scheme = $parts['scheme'] ?? 'https';
		$port   = isset( $parts['port'] ) ? ':' . $parts['port'] : '';
		$path   = $parts['path'] ?? '/';
		$frag   = isset( $parts['fragment'] ) ? '#' . $parts['fragment'] : '';
		$qs = http_build_query( $query );
		return $scheme . '://' . $parts['host'] . $port . $path . ( '' !== $qs ? '?' . $qs : '' ) . $frag;
	}

	/** Apply rel (nofollow/sponsored) + optional new-tab to an <a> tag. */
	private static function apply_rel_and_target( $tag ) {
		$opts = DEVDAFFI_Settings::get()['link_options'];

		// Collect existing rel tokens, then strip the rel attribute.
		$rel = array();
		if ( preg_match( '#\srel\s*=\s*(["\'])(.*?)\1#i', $tag, $rm ) ) {
			$rel = preg_split( '/\s+/', trim( $rm[2] ) );
			$tag = str_replace( $rm[0], '', $tag );
		}
		$rel = array_filter( $rel, function ( $r ) {
			return ! in_array( $r, array( 'nofollow', 'sponsored', 'noopener', 'noreferrer' ), true );
		} );

		if ( 'nofollow' === $opts['rel'] ) {
			$rel[] = 'nofollow';
		}
		if ( ! empty( $opts['sponsored'] ) ) {
			$rel[] = 'sponsored';
		}

		// Strip any existing target, then re-add if new-tab is on.
		$tag = preg_replace( '#\starget\s*=\s*(["\']).*?\1#i', '', $tag );
		$target_attr = '';
		if ( ! empty( $opts['new_tab'] ) ) {
			$target_attr = ' target="_blank"';
			$rel[]       = 'noopener';
		}

		$rel = array_values( array_unique( $rel ) );
		$rel_attr = $rel ? ' rel="' . esc_attr( implode( ' ', $rel ) ) . '"' : '';

		// Insert attributes right before the closing '>'.
		return preg_replace( '/\s*>$/', $rel_attr . $target_attr . '>', $tag );
	}
}
