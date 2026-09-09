<?php
/**
 * /go resolver — the click endpoint. Expands Amazon shortlinks, enforces an
 * Amazon-only allowlist (no open redirect), adds the default tag if missing,
 * then 302s out. On Android with the App Opener set to 'intent', emits an intent://
 * bridge instead of the 302. (Geo is a later phase.)
 *
 * Adapted from the v6.4 "Amazon Mobile Deep Linker" reference in the spec.
 */

defined( 'ABSPATH' ) || exit;

class DEVDAFFI_Go {

	/** Geo-resolve service on the DevDome server (holds the MaxMind DB; no key in the plugin). */
	const GEO_API = 'https://api.devdome.com/geo-resolve';

	public function __construct() {
		add_action( 'init', array( __CLASS__, 'add_rewrite_rule' ) );
		add_filter( 'query_vars', function ( $vars ) {
			$vars[] = 'devdaffi_go';
			return $vars;
		} );
		add_action( 'template_redirect', array( $this, 'handle' ) );
	}

	public static function add_rewrite_rule() {
		add_rewrite_rule( '^go/?$', 'index.php?devdaffi_go=1', 'top' );
	}

	public function handle() {
		if ( 1 !== (int) get_query_var( 'devdaffi_go' ) ) {
			return;
		}

		// A redirect endpoint is never a page: crawlers that reach /go must not index it
		// or credit the destination.
		if ( ! headers_sent() ) {
			header( 'X-Robots-Tag: noindex, nofollow' );
		}

		// phpcs:ignore WordPress.Security.NonceVerification.Recommended, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- public redirect endpoint; value is unslashed + esc_url_raw'd here and re-validated against an Amazon allowlist below; no form state.
		$u = isset( $_GET['u'] ) ? esc_url_raw( rawurldecode( wp_unslash( $_GET['u'] ) ) ) : '';
		if ( ! $u || ! preg_match( '#^https?://#i', $u ) ) {
			wp_die( esc_html__( 'Bad URL', 'devdome-affiliate-manager' ), esc_html__( 'DevDome Affiliate Manager', 'devdome-affiliate-manager' ), array( 'response' => 400 ) );
		}

		$host = strtolower( (string) wp_parse_url( $u, PHP_URL_HOST ) );
		if ( '' === DEVDAFFI_Rewriter::storefront_domain( $host ) && ! DEVDAFFI_Rewriter::is_short( $host ) ) {
			wp_die( esc_html__( 'Host not allowed', 'devdome-affiliate-manager' ), esc_html__( 'DevDome Affiliate Manager', 'devdome-affiliate-manager' ), array( 'response' => 403 ) );
		}

		// Click Protection: drop known bots early — before any redirect resolution — so
		// they can't inflate click stats or cost us a lookup. Fail-open. ($cp reused below.)
		$cp = DEVDAFFI_Settings::get()['click_protection'];
		$this->maybe_block_bot( $cp );

		// Expand shortlinks (cached 12h).
		$cache_key = 'devdaffi_resolve_' . md5( $u );
		$final     = get_transient( $cache_key );
		if ( false === $final ) {
			$final = $this->follow_redirects( $u, 7 );
			set_transient( $cache_key, $final, 12 * HOUR_IN_SECONDS );
		}

		// Re-validate the FINAL destination. Shortlinks resolve server-side and the
		// redirect chain is attacker-influenceable, so the input-only check isn't enough.
		$final_host   = strtolower( (string) wp_parse_url( $final, PHP_URL_HOST ) );
		$final_domain = DEVDAFFI_Rewriter::storefront_domain( $final_host );
		if ( '' === $final_domain && ! DEVDAFFI_Rewriter::is_short( $final_host ) ) {
			wp_die( esc_html__( 'Resolved destination not allowed', 'devdome-affiliate-manager' ), esc_html__( 'DevDome Affiliate Manager', 'devdome-affiliate-manager' ), array( 'response' => 403 ) );
		}

		// Geo-redirect (OneLink alternative): if enabled and we resolved to a real storefront,
		// ask the server for the visitor's local store. A non-null target replaces the
		// destination (and its domain); the tag block below then applies the correct
		// per-store tag. Null target → keep the original link (commission stays safe).
		if ( '' !== $final_domain && DEVDAFFI_Settings::get()['geo_enabled'] ) {
			$geo = $this->geo_target( $final, $final_domain );
			if ( $geo ) {
				$final        = $geo;
				$final_host   = strtolower( (string) wp_parse_url( $final, PHP_URL_HOST ) );
				$final_domain = DEVDAFFI_Rewriter::storefront_domain( $final_host );
			}
		}

		// Dead/Out-of-Stock → store search page. If the destination is a product page whose
		// ASIN the monitor flagged dead (404) or out-of-stock, and the matching toggle is on,
		// send the click to the store's search page instead of a dead/unavailable listing.
		if ( '' !== $final_domain ) {
			$final = $this->maybe_dead_to_search( $final, $final_domain );
		}

		// Tag the outbound URL if it lacks one. A shortlink click has no post context,
		// so use the sitewide tag configured for the RESOLVED storefront domain, then
		// fall back to the global default. (Direct links already carry their per-post tag.)
		$q     = array();
		$query = (string) wp_parse_url( $final, PHP_URL_QUERY );
		if ( $query ) {
			parse_str( $query, $q );
		}
		if ( empty( $q['tag'] ) ) {
			$tag = $final_domain ? DEVDAFFI_Resolver::resolve( 0, $final_domain ) : '';
			if ( '' === $tag ) {
				$tag = DEVDAFFI_Settings::get()['default_tag'];
			}
			if ( $tag ) {
				$final = DEVDAFFI_Rewriter::set_tag( $final, $tag );
			}
		}

		// Record the click against whichever affiliate tag the visitor is sent out with.
		$final_query = (string) wp_parse_url( $final, PHP_URL_QUERY );
		if ( $final_query ) {
			$fq = array();
			parse_str( $final_query, $fq );
			if ( ! empty( $fq['tag'] ) ) {
				DEVDAFFI_Clicks::record( $fq['tag'] );
			}
		}

		// Auto-linker click → also attribute to the originating rule (namespaced key).
		if ( isset( $_GET['r'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- public redirect endpoint, no state-changing form
			$rule_id = sanitize_key( wp_unslash( $_GET['r'] ) ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- public redirect endpoint, no state-changing form
			if ( '' !== $rule_id ) {
				DEVDAFFI_Clicks::record( '__rule__' . $rule_id );
			}
		}

		// Mobile App Opener (Android intent). iOS is handled client-side (front.js Safari
		// overlay). Returns silently when not applicable so the redirect below runs.
		$this->maybe_app_open( $final );

		$this->emit_redirect( $final, $cp['redirect_method'] );
	}

	/** Click Protection: when enabled and the visitor is a known bot, count the block and exit (204). Fail-open. */
	private function maybe_block_bot( $cp ) {
		if ( empty( $cp['block_bots'] ) ) {
			return;
		}
		$ua = isset( $_SERVER['HTTP_USER_AGENT'] ) ? sanitize_text_field( wp_unslash( $_SERVER['HTTP_USER_AGENT'] ) ) : '';
		$ip = isset( $_SERVER['HTTP_CF_CONNECTING_IP'] ) ? sanitize_text_field( wp_unslash( $_SERVER['HTTP_CF_CONNECTING_IP'] ) ) : ( isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '' );
		if ( DEVDAFFI_Bots::is_bot( $ua, $ip ) ) {
			DEVDAFFI_Clicks::record( DEVDAFFI_Clicks::BOTS_KEY ); // count the block
			status_header( 204 );
			exit;
		}
	}

	/**
	 * Ask the geo-resolve server for the visitor's local-store URL for $final. Returns the
	 * new (untagged) Amazon URL, or '' to keep the original. Coverage is gated server-side
	 * by covered_domains — the stores we actually have a tag for — so we never send a
	 * visitor somewhere we earn nothing. Fail-soft: any error/empty → '' (keep original).
	 */
	private function geo_target( $final, $source_domain ) {
		// Real visitor IP (behind Cloudflare REMOTE_ADDR is the edge — geo would localize the
		// visitor to the datacenter). Same preference order as maybe_block_bot.
		$ip = isset( $_SERVER['HTTP_CF_CONNECTING_IP'] ) ? sanitize_text_field( wp_unslash( $_SERVER['HTTP_CF_CONNECTING_IP'] ) ) : ( isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '' );
		if ( '' === $ip ) {
			return '';
		}

		// Stores we hold an enabled tag for — the only ones the server may target.
		$covered = array();
		foreach ( DEVDAFFI_Settings::get()['tags'] as $t ) {
			if ( ! empty( $t['enabled'] ) && ! empty( $t['domain'] ) ) {
				$covered[ $t['domain'] ] = true;
			}
		}
		$covered = array_keys( $covered );
		if ( empty( $covered ) ) {
			return ''; // no regional tags → nothing to redirect to
		}

		// ASIN from the destination path (empty for non-/dp/ links; server localizes to the store home).
		$asin = preg_match( '#/(?:dp|gp/product|gp/aw/d|exec/obidos/ASIN|o/ASIN)/([A-Z0-9]{10})#i', $final, $m )
			? strtoupper( $m[1] ) : '';

		$resp = wp_remote_post( self::GEO_API . '/resolve', array(
			'timeout' => 8,
			'headers' => array( 'Content-Type' => 'application/json' ),
			'body'    => wp_json_encode( array(
				'ip'              => $ip,
				'asin'            => $asin,
				'source_domain'   => $source_domain,
				'covered_domains' => $covered,
				// Geo store-routing is account-gated (Pro plan); unentitled sites get the
				// fail-soft "no match" answer and the visitor keeps the original link.
				'site'            => (string) get_option( 'devdcorev1_site_id', '' ),
				'site_token'      => (string) get_option( 'devdcorev1_site_token', '' ),
			) ),
		) );
		if ( is_wp_error( $resp ) ) {
			return '';
		}
		$data = json_decode( wp_remote_retrieve_body( $resp ), true );
		$url  = ( is_array( $data ) && ! empty( $data['target_url'] ) ) ? (string) $data['target_url'] : '';
		if ( '' === $url ) {
			return '';
		}

		// Trust only Amazon storefront targets (defence in depth — never redirect off-Amazon).
		$host = strtolower( (string) wp_parse_url( $url, PHP_URL_HOST ) );
		return '' !== DEVDAFFI_Rewriter::storefront_domain( $host ) ? esc_url_raw( $url ) : '';
	}

	/**
	 * If $final is a product page whose ASIN the monitor flagged dead (404) or out-of-stock,
	 * and the matching "send to search page" toggle is on, return the store's search URL for
	 * that ASIN instead — so the click never lands on a dead/unavailable listing. Otherwise
	 * returns $final unchanged.
	 */
	private function maybe_dead_to_search( $final, $domain ) {
		if ( ! preg_match( '#/(?:dp|gp/product|gp/aw/d|exec/obidos/ASIN|o/ASIN)/([A-Z0-9]{10})#i', $final, $m ) ) {
			return $final; // not a product page (e.g. already a search page) — leave it
		}
		$asin   = strtoupper( $m[1] );
		$mon    = DEVDAFFI_Settings::get()['monitor'];
		$status = DEVDAFFI_Monitor::status_of( $asin );
		$send   = ( 'dead' === $status && ! empty( $mon['dead_to_search'] ) )
			|| ( 'oos' === $status && ! empty( $mon['oos_to_search'] ) );
		if ( ! $send ) {
			return $final;
		}

		// Build a real search keyword from the product title (searching the bare ASIN finds
		// nothing). No title → last-resort ASIN search (old behaviour).
		$keyword = DEVDAFFI_Monitor::keyword_for_asin( $asin );
		if ( '' === $keyword ) {
			return 'https://www.' . $domain . '/s?k=' . rawurlencode( $asin );
		}

		// Per-status mode (OOS vs 404 can differ). Mode B (replacement): server finds the top
		// live equivalent product → /dp/. Falls through to the search page (A) if none found.
		$mode = ( 'oos' === $status ) ? ( $mon['oos_mode'] ?? 'replacement' ) : ( $mon['dead_mode'] ?? 'replacement' );
		if ( 'replacement' === $mode ) {
			$rep = DEVDAFFI_Monitor::search_replacement( $keyword, $domain );
			if ( '' !== $rep ) {
				return 'https://www.' . $domain . '/dp/' . $rep;
			}
		}
		// Mode A (search page) — also the Mode-B fallback.
		return 'https://www.' . $domain . '/s?k=' . rawurlencode( $keyword );
	}

	/**
	 * Send the visitor to $final using the configured Click-Protection redirect method:
	 *   302     — plain HTTP 302 (fastest; relies only on the bot blocklist).
	 *   js      — JS-only client redirect; clients that don't run JS dead-end (max filtering).
	 *   js_302  — JS redirect + a <noscript> meta-refresh fallback (fast, with a safety net).
	 */
	private function emit_redirect( $final, $method ) {
		// Kill the inbound referrer (e.g. reddit) so it can NEVER ride the 302 chain to the next hop
		// (tracking hub / money site). Source attribution travels server-side, not via the browser
		// Referer header. Applies to both the JS and header redirect paths below.
		if ( ! headers_sent() ) {
			header( 'Referrer-Policy: no-referrer' );
		}
		if ( 'js' === $method || 'js_302' === $method ) {
			header( 'Content-Type: text/html; charset=UTF-8' );
			echo '<!doctype html><html><head><meta name="robots" content="noindex"><meta name="referrer" content="no-referrer">';
			wp_print_inline_script_tag( 'location.replace(' . wp_json_encode( $final ) . ');' );
			if ( 'js_302' === $method ) {
				echo '<noscript><meta http-equiv="refresh" content="0;url=' . esc_attr( esc_url( $final ) ) . '"></noscript>';
			}
			echo '</head><body></body></html>';
			exit;
		}

		wp_redirect( $final, 302 ); // phpcs:ignore WordPress.Security.SafeRedirect.wp_redirect_wp_redirect -- destination is validated against the Amazon storefront allowlist above
		exit;
	}

	/**
	 * When the App Opener is enabled with android_mode='intent' and the request is from
	 * an Android device, serve an intent:// bridge page that opens the Amazon app (with a
	 * web fallback) instead of a plain 302. No-ops otherwise so the caller's 302 runs.
	 */
	private function maybe_app_open( $final ) {
		$m = DEVDAFFI_Settings::get()['mobile_app'];
		if ( empty( $m['enabled'] ) || 'intent' !== $m['android_mode'] ) {
			return;
		}
		$ua = isset( $_SERVER['HTTP_USER_AGENT'] ) ? sanitize_text_field( wp_unslash( $_SERVER['HTTP_USER_AGENT'] ) ) : '';
		if ( ! preg_match( '/android/i', $ua ) ) {
			return;
		}

		$web         = esc_url( $final );
		$scheme_free = preg_replace( '#^https?://#i', '', $web );
		$intent      = 'intent://' . $scheme_free
			. '#Intent;scheme=https;package=com.amazon.mShop.android.shopping;'
			. 'S.browser_fallback_url=' . rawurlencode( $web ) . ';end';

		// Same referrer discipline as emit_redirect(): this bridge exits before it runs, so
		// without these the web fallback would send this hop's origin to Amazon as the referrer.
		if ( ! headers_sent() ) {
			header( 'Referrer-Policy: no-referrer' );
		}
		header( 'Content-Type: text/html; charset=UTF-8' );
		echo '<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="referrer" content="no-referrer">';
		echo '<meta http-equiv="refresh" content="2;url=' . esc_attr( $web ) . '"></head><body>';
		wp_print_inline_script_tag(
			'var i=' . wp_json_encode( $intent ) . ',w=' . wp_json_encode( $web ) . ';'
			. 'window.location.href=i;setTimeout(function(){window.location.href=w;},800);'
		);
		echo '</body></html>';
		exit;
	}

	/** Follow the redirect chain up to $max hops; return the final URL. */
	private function follow_redirects( $url, $max ) {
		$current = $url;
		for ( $i = 0; $i < $max; $i++ ) {
			$args = array(
				'timeout'     => 6,
				'redirection' => 0,
				'headers'     => array( 'User-Agent' => 'Mozilla/5.0 (compatible; DevDomeAff/1.0)' ),
			);
			$resp = wp_remote_head( $current, $args );
			if ( is_wp_error( $resp ) || (int) wp_remote_retrieve_response_code( $resp ) < 200 ) {
				$resp = wp_remote_get( $current, $args );
			}
			if ( is_wp_error( $resp ) ) {
				return $current;
			}
			$code = (int) wp_remote_retrieve_response_code( $resp );
			$loc  = wp_remote_retrieve_header( $resp, 'location' );
			if ( $code >= 300 && $code < 400 && $loc ) {
				$next = $this->abs_url( $current, $loc );
				if ( ! $next ) {
					return $current;
				}
				// SSRF guard: only follow redirects that stay within Amazon. A shortlink
				// (amzn.to/a.co) is attacker-influenceable; refuse to fetch off-Amazon hops.
				$next_host = strtolower( (string) wp_parse_url( $next, PHP_URL_HOST ) );
				if ( '' === DEVDAFFI_Rewriter::storefront_domain( $next_host ) && ! DEVDAFFI_Rewriter::is_short( $next_host ) ) {
					return $current;
				}
				$current = $next;
				continue;
			}
			return $current;
		}
		return $current;
	}

	private function abs_url( $base, $rel ) {
		$rel = trim( $rel );
		if ( preg_match( '#^https?://#i', $rel ) ) {
			return $rel;
		}
		$p = wp_parse_url( $base );
		if ( ! $p || empty( $p['scheme'] ) || empty( $p['host'] ) ) {
			return null;
		}
		$origin = $p['scheme'] . '://' . $p['host'] . ( isset( $p['port'] ) ? ':' . $p['port'] : '' );
		if ( 0 === strpos( $rel, '//' ) ) {
			return $p['scheme'] . ':' . $rel;
		}
		if ( 0 === strpos( $rel, '/' ) ) {
			return $origin . $rel;
		}
		$dir = preg_replace( '#/[^/]*$#', '/', $p['path'] ?? '/' );
		return $origin . $dir . $rel;
	}
}
