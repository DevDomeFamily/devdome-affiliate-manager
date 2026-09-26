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

	/** This request's per-address verdicts (rounds 4-5). */
	private $record_ok  = true;
	private $resolve_ok = true;

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
		$u = ( isset( $_GET['u'] ) && is_string( $_GET['u'] ) ) ? esc_url_raw( rawurldecode( wp_unslash( $_GET['u'] ) ) ) : ''; // ?u[]=x is not a URL (round 1)
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
		$hits             = $this->hit_count(); // one per-address count per request (rounds 4-5)
		$this->record_ok  = $hits <= 60;  // beyond it the click is redirected but not counted
		$this->resolve_ok = $hits <= 200; // beyond it no outbound resolution: a shortlink dies, a direct storefront URL still goes
		$this->maybe_block_bot( $cp );

		// Expand shortlinks (cached 12h).
		$cache_key = 'devdaffi_resolve_' . md5( $u );
		$final     = get_transient( $cache_key );
		if ( false === $final ) {
			$final = $this->resolve_ok ? $this->follow_redirects( $u, 7 ) : ( '' !== DEVDAFFI_Rewriter::storefront_domain( $host ) ? $u : '' ); // round 5: no outbound requests for a hammering address
			if ( '' !== $final ) {
				set_transient( $cache_key, $final, 12 * HOUR_IN_SECONDS );
			}
		}
		if ( '' === $final ) {
			wp_die( esc_html__( 'Resolved destination not allowed', 'devdome-affiliate-manager' ), esc_html__( 'DevDome Affiliate Manager', 'devdome-affiliate-manager' ), array( 'response' => 403 ) ); // a shortlink that leaves Amazon is never handed to the browser (round 1)
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
		if ( '' !== $final_domain && $this->resolve_ok && DEVDAFFI_Settings::get()['geo_enabled'] ) { // round 6: a hammering address gets no geo call either
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
		$settings   = DEVDAFFI_Settings::get();
		$known_tags = array_map( 'strval', wp_list_pluck( $settings['tags'], 'affiliate_id' ) );
		if ( '' !== (string) $settings['default_tag'] ) {
			$known_tags[] = (string) $settings['default_tag'];
		}
		// A tag this site did not configure (a crafted link carrying someone else's Associates tag, or an array) is
		// replaced by the site's own (round 4): /go never relays a foreign tag.
		if ( empty( $q['tag'] ) || ! is_string( $q['tag'] ) || ! in_array( $q['tag'], $known_tags, true ) ) {
			$tag = $final_domain ? DEVDAFFI_Resolver::resolve( 0, $final_domain ) : '';
			if ( '' === $tag ) {
				$tag = DEVDAFFI_Settings::get()['default_tag'];
			}
			if ( $tag ) {
				$final = DEVDAFFI_Rewriter::set_tag( $final, $tag );
			} elseif ( ! empty( $q['tag'] ) ) {
				$final = DEVDAFFI_Rewriter::set_tag( $final, '' ); // no tag of our own applies: the foreign one is removed, never relayed (round 5)
			}
		}

		// Record the click against whichever affiliate tag the visitor is sent out with, but only a tag this site
		// configured (round 1: any ?tag= in a crafted link used to create a click row).
		$may_record  = $this->record_ok;
		$final_query = (string) wp_parse_url( $final, PHP_URL_QUERY );
		if ( $final_query ) {
			$fq = array();
			parse_str( $final_query, $fq );
			if ( ! empty( $fq['tag'] ) && is_string( $fq['tag'] ) && in_array( $fq['tag'], $known_tags, true ) && $may_record ) {
				DEVDAFFI_Clicks::record( $fq['tag'] );
			}
		}

		// Auto-linker click → also attribute to the originating rule (namespaced key), only a rule that exists.
		if ( isset( $_GET['r'] ) && is_string( $_GET['r'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- public redirect endpoint, no state-changing form
			$rule_id = sanitize_key( wp_unslash( $_GET['r'] ) ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- public redirect endpoint, no state-changing form
			if ( '' !== $rule_id && $may_record && in_array( $rule_id, array_map( 'strval', wp_list_pluck( $settings['auto_linker']['rules'], 'id' ) ), true ) ) {
				DEVDAFFI_Clicks::record( '__rule__' . $rule_id );
			}
		}

		// Mobile App Opener (Android intent). iOS is handled client-side (front.js Safari
		// overlay). Returns silently when not applicable so the redirect below runs.
		$this->maybe_app_open( $final );

		$this->emit_redirect( $final, $cp['redirect_method'] );
	}

	/**
	 * At most 60 recorded clicks per address per 10 minutes (round 3): a script hammering /go can still be redirected,
	 * it just stops counting. Fail-open when the transient could not be written.
	 */
	private function hit_count() {
		$ip = self::limiter_ip(); // the transport peer, or the Cloudflare header only when the peer IS Cloudflare (round 4)
		if ( '' === $ip ) {
			return 1;
		}
		$key = 'devdaffi_cl_' . md5( $ip );
		if ( false === get_transient( $key ) ) {
			set_transient( $key, 1, 10 * MINUTE_IN_SECONDS );
			return 1;
		}
		if ( wp_using_ext_object_cache() ) { // the cache backend keeps the transient; read-then-write is what it offers
			$n = (int) get_transient( $key ) + 1;
			set_transient( $key, $n, 10 * MINUTE_IN_SECONDS );
			return $n;
		}
		// Round 9: one atomic UPDATE on the transient row. A burst of parallel requests used to read the same value
		// and all pass the gate; now every request lands its own +1 before it is judged.
		global $wpdb;
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery -- atomic increment
		$wpdb->query( $wpdb->prepare( "UPDATE {$wpdb->options} SET option_value = option_value + 1 WHERE option_name = %s", '_transient_' . $key ) );
		wp_cache_delete( '_transient_' . $key, 'options' );
		wp_cache_delete( 'alloptions', 'options' );
		return max( 1, (int) get_option( '_transient_' . $key, 1 ) );
	}

	/** The address a limit is keyed on: REMOTE_ADDR, or CF-Connecting-IP only when REMOTE_ADDR is a Cloudflare edge (a forged header from anywhere else is ignored). */
	public static function limiter_ip() {
		$remote = isset( $_SERVER['REMOTE_ADDR'] ) ? trim( sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) ) : '';
		if ( self::ip_is_cloudflare( $remote ) && ! empty( $_SERVER['HTTP_CF_CONNECTING_IP'] ) ) {
			$cf = filter_var( trim( sanitize_text_field( wp_unslash( $_SERVER['HTTP_CF_CONNECTING_IP'] ) ) ), FILTER_VALIDATE_IP );
			if ( false !== $cf ) {
				return $cf;
			}
		}
		return $remote;
	}

	/** Published Cloudflare edge ranges (same list as DevDome Analytics). */
	private static function ip_is_cloudflare( $ip ) {
		if ( '' === $ip || false === filter_var( $ip, FILTER_VALIDATE_IP ) ) {
			return false;
		}
		$v4 = array(
			'173.245.48.0/20', '103.21.244.0/22', '103.22.200.0/22', '103.31.4.0/22',
			'141.101.64.0/18', '108.162.192.0/18', '190.93.240.0/20', '188.114.96.0/20',
			'197.234.240.0/22', '198.41.128.0/17', '162.158.0.0/15', '104.16.0.0/13',
			'104.24.0.0/14', '172.64.0.0/13', '131.0.72.0/22',
		);
		$v6 = array(
			'2400:cb00::/32', '2606:4700::/32', '2803:f800::/32', '2405:b500::/32',
			'2405:8100::/32', '2a06:98c0::/29', '2c0f:f248::/32',
		);
		$ranges = ( false !== strpos( $ip, ':' ) ) ? $v6 : $v4;
		foreach ( $ranges as $cidr ) {
			if ( self::ip_in_cidr( $ip, $cidr ) ) {
				return true;
			}
		}
		return false;
	}

	/** Binary CIDR containment for IPv4 and IPv6. */
	private static function ip_in_cidr( $ip, $cidr ) {
		list( $net, $bits ) = explode( '/', $cidr, 2 );
		$ip_bin  = inet_pton( $ip );
		$net_bin = inet_pton( $net );
		if ( false === $ip_bin || false === $net_bin || strlen( $ip_bin ) !== strlen( $net_bin ) ) {
			return false;
		}
		$bits  = (int) $bits;
		$bytes = intdiv( $bits, 8 );
		$rem   = $bits % 8;
		if ( $bytes > 0 && 0 !== substr_compare( $ip_bin, $net_bin, 0, $bytes ) ) {
			return false;
		}
		if ( 0 === $rem ) {
			return true;
		}
		$mask = 0xFF << ( 8 - $rem ) & 0xFF;
		return ( ord( $ip_bin[ $bytes ] ) & $mask ) === ( ord( $net_bin[ $bytes ] ) & $mask );
	}

	/** Click Protection: when enabled and the visitor is a known bot, count the block and exit (204). Fail-open. */
	private function maybe_block_bot( $cp ) {
		if ( empty( $cp['block_bots'] ) ) {
			return;
		}
		$ua = isset( $_SERVER['HTTP_USER_AGENT'] ) ? sanitize_text_field( wp_unslash( $_SERVER['HTTP_USER_AGENT'] ) ) : '';
		$ip = self::limiter_ip(); // CF-Connecting-IP only from a Cloudflare edge (round 7)
		if ( DEVDAFFI_Bots::is_bot( $ua, $ip ) || ( ! empty( $cp['block_old_browsers'] ) && DEVDAFFI_Bots::is_outdated_browser( $ua ) ) ) {
			if ( $this->record_ok ) {
				DEVDAFFI_Clicks::record( DEVDAFFI_Clicks::BOTS_KEY ); // count the block (capped like every counter)
			}
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
		$ip = self::limiter_ip(); // CF-Connecting-IP only from a Cloudflare edge (round 7)
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

		// Trust only Amazon storefront targets (defence in depth — never redirect off-Amazon), and only over http(s) (round 9).
		if ( ! preg_match( '#^https?://#i', $url ) ) {
			return '';
		}
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
		if ( 'replacement' === $mode && $this->resolve_ok ) { // round 6: no replacement search (quota) for a hammering address
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

		$web         = esc_url_raw( $final ); // JS / intent values are not HTML: no &amp; (round 4); the meta attribute below escapes on its own
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
		echo '<meta http-equiv="refresh" content="2;url=' . esc_attr( esc_url( $web ) ) . '"></head><body>';
		wp_print_inline_script_tag(
			'var i=' . wp_json_encode( $intent ) . ',w=' . wp_json_encode( $web ) . ';'
			. 'window.location.href=i;setTimeout(function(){window.location.href=w;},800);'
		);
		echo '</body></html>';
		exit;
	}

	/**
	 * Follow the redirect chain up to $max hops; return the final URL. A shortlink that could not be resolved to a
	 * storefront (transport failure, hop limit) answers '' = no destination (round 2); a direct storefront URL that
	 * did not answer stays what it is.
	 */
	private function follow_redirects( $url, $max ) {
		$current = $url;
		$settled = function ( $u ) {
			return '' !== DEVDAFFI_Rewriter::storefront_domain( strtolower( (string) wp_parse_url( $u, PHP_URL_HOST ) ) ) ? $u : '';
		};
		for ( $i = 0; $i < $max; $i++ ) {
			$args = array(
				'timeout'     => 6,
				'redirection' => 0,
				'headers'     => array( 'User-Agent' => 'Mozilla/5.0 (compatible; DevDomeAff/1.0)' ),
			);
			$resp = wp_remote_head( $current, $args );
			$head_code = is_wp_error( $resp ) ? 0 : (int) wp_remote_retrieve_response_code( $resp );
			if ( $head_code < 200 || 405 === $head_code || 501 === $head_code ) { // no answer, or HEAD refused (405 / 501): ask again with GET
				$resp = wp_remote_get( $current, $args );
			}
			if ( is_wp_error( $resp ) ) {
				return $settled( $current );
			}
			$code = (int) wp_remote_retrieve_response_code( $resp );
			$loc  = wp_remote_retrieve_header( $resp, 'location' );
			if ( $code >= 300 && $code < 400 && $loc ) {
				$next = $this->abs_url( $current, $loc );
				if ( ! $next ) {
					return $settled( $current );
				}
				// SSRF guard: only follow redirects that stay within Amazon. A shortlink
				// (amzn.to/a.co) is attacker-influenceable; refuse to fetch off-Amazon hops.
				$next_host = strtolower( (string) wp_parse_url( $next, PHP_URL_HOST ) );
				if ( '' === DEVDAFFI_Rewriter::storefront_domain( $next_host ) && ! DEVDAFFI_Rewriter::is_short( $next_host ) ) {
					return ''; // the chain leaves Amazon: no destination at all, never the unresolved shortlink (round 1)
				}
				$current = $next;
				continue;
			}
			return $settled( $current );
		}
		return $settled( $current );
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
