<?php
/**
 * Settings store — one option holding affiliate tags + link options.
 *
 * Shape:
 * {
 *   tags: [
 *     { id, affiliate_id, domain, enabled, mode: 'sitewide'|'rules',
 *       rules: { posts:[int], pages:[int], post_cats:[int] } }
 *   ],
 *   link_options: { rel: 'nofollow'|'follow', sponsored: bool, new_tab: bool },
 *   default_tag: string   // fallback used by /go when a link has no tag
 * }
 */

defined( 'ABSPATH' ) || exit;

class DEVDAFFI_Settings {

	/** Supported Amazon storefront domains (tag-able). */
	const DOMAINS = array(
		'amazon.com', 'amazon.co.uk', 'amazon.de', 'amazon.fr', 'amazon.it', 'amazon.es',
		'amazon.ca', 'amazon.com.au', 'amazon.co.jp', 'amazon.nl', 'amazon.se', 'amazon.pl',
		'amazon.com.mx', 'amazon.com.br', 'amazon.in', 'amazon.ae', 'amazon.sg',
		'amazon.sa', 'amazon.com.tr', 'amazon.eg', 'amazon.com.be', 'amazon.co.za',
	);

	public static function defaults() {
		return array(
			'tags'         => array(),
			'link_options' => array( 'rel' => 'nofollow', 'sponsored' => true, 'new_tab' => false ),
			'default_tag'  => '',
			'geo_enabled'  => false, // OneLink alternative: auto-redirect to the visitor's local store (only stores you have a tag for)
			'woo_button_rewrite' => false, // route WooCommerce external-product buttons (whose link carries an ASIN) through /go
			'exclusions'   => array(
				'posts'        => array(),
				'pages'        => array(),
				'cats'         => array(),
				'except_posts' => array(),
				'except_pages' => array(),
			),
			'button'       => array(
				'text'        => 'Check Price On Amazon',
				'link_mode'   => 'generated', // 'generated' (from ASIN) | 'custom'
				'custom_link' => '',
				'generated_domain' => 'amazon.com', // marketplace used to build generated /dp/ links
				'skip_tag'    => false,             // generated mode: omit the affiliate ?tag=
			),
			'auto_linker'  => array(
				'enabled' => false,
				'limit'   => 2, // max auto-links per page
				'apply'   => array( 'posts' => true, 'pages' => true, 'products' => true ),
				'skip'    => array(
					'headings'        => true,
					'links'           => true,
					'code'            => true,
					'first_paragraph' => false,
					'blockquotes'     => true,
				),
				'rules'   => array(),
			),
			'scan_auto'           => false, // Link Radar: run the scheduled auto re-scan? OFF until the user opts in — the follow-up status checks contact the DevDome server (G7: no external calls without a user action).
			'scan_frequency'      => 7,    // ...how many time-units between auto re-scans
			'scan_frequency_unit' => 'days', // 'hours' | 'days'
			'monitor'             => array(
				'oos_to_search'  => false, // redirect clicks for out-of-stock ASINs
				'dead_to_search' => false, // redirect clicks for dead (404) ASINs
				'oos_mode'       => 'replacement', // per-status: 'search' (A) | 'replacement' (B)
				'dead_mode'      => 'replacement',
			),
			'mobile_app'     => array(
				'enabled'           => false,
				'ios_safari_button' => true,             // show "Open in Safari" in iOS in-app browsers
				'android_mode'      => 'browser',        // 'browser' | 'intent' (force Amazon app)
			),
			'click_protection' => array(
				'block_bots'       => true,
				'redirect_method'  => 'js_302',          // 'js_302' | 'js' | '302'
			),
		);
	}

	public static function get() {
		$opt = get_option( DEVDAFFI_OPTION, array() );
		if ( ! is_array( $opt ) ) {
			$opt = array();
		}
		$d   = self::defaults();
		$opt = wp_parse_args( $opt, $d );
		// wp_parse_args is shallow — backfill nested shapes so readers never hit a
		// missing key (legacy/partial/hand-edited options).
		$opt['link_options'] = wp_parse_args( is_array( $opt['link_options'] ) ? $opt['link_options'] : array(), $d['link_options'] );
		$opt['exclusions']   = wp_parse_args( is_array( $opt['exclusions'] ) ? $opt['exclusions'] : array(), $d['exclusions'] );
		$opt['button']       = wp_parse_args( is_array( $opt['button'] ) ? $opt['button'] : array(), $d['button'] );
		$opt['auto_linker']  = wp_parse_args( is_array( $opt['auto_linker'] ) ? $opt['auto_linker'] : array(), $d['auto_linker'] );
		$opt['auto_linker']['apply'] = wp_parse_args( is_array( $opt['auto_linker']['apply'] ) ? $opt['auto_linker']['apply'] : array(), $d['auto_linker']['apply'] );
		$opt['auto_linker']['skip']  = wp_parse_args( is_array( $opt['auto_linker']['skip'] ) ? $opt['auto_linker']['skip'] : array(), $d['auto_linker']['skip'] );
		$opt['mobile_app']   = wp_parse_args( is_array( $opt['mobile_app'] ) ? $opt['mobile_app'] : array(), $d['mobile_app'] );
		$opt['click_protection'] = wp_parse_args( is_array( $opt['click_protection'] ) ? $opt['click_protection'] : array(), $d['click_protection'] );
		$opt['monitor']          = wp_parse_args( is_array( $opt['monitor'] ) ? $opt['monitor'] : array(), $d['monitor'] );
		return $opt;
	}

	/** Sanitize + persist. Returns the cleaned settings array. */
	public static function save( array $input ) {
		$clean = self::defaults();

		if ( ! empty( $input['tags'] ) && is_array( $input['tags'] ) ) {
			$seen_ids = array();
			foreach ( $input['tags'] as $t ) {
				$domain = isset( $t['domain'] ) ? strtolower( sanitize_text_field( $t['domain'] ) ) : '';
				if ( ! in_array( $domain, self::DOMAINS, true ) ) {
					continue;
				}
				$id = isset( $t['id'] ) ? sanitize_key( $t['id'] ) : '';
				if ( '' === $id || isset( $seen_ids[ $id ] ) ) {
					$id = uniqid( 'tag_' ); // guarantee unique ids
				}
				$seen_ids[ $id ] = true;
				$clean['tags'][] = array(
					'id'           => $id,
					'nickname'     => isset( $t['nickname'] ) ? substr( sanitize_text_field( (string) $t['nickname'] ), 0, 100 ) : '',
					'affiliate_id' => isset( $t['affiliate_id'] ) ? substr( preg_replace( '/[^a-zA-Z0-9\-_.]/', '', (string) $t['affiliate_id'] ), 0, 64 ) : '',
					'domain'       => $domain,
					'enabled'      => ! empty( $t['enabled'] ),
					'mode'         => ( isset( $t['mode'] ) && 'rules' === $t['mode'] ) ? 'rules' : 'sitewide',
					'rules'        => array(
						'posts'     => self::int_list( $t['rules']['posts'] ?? array() ),
						'pages'     => self::int_list( $t['rules']['pages'] ?? array() ),
						'post_cats' => self::int_list( $t['rules']['post_cats'] ?? array() ),
					),
				);
			}
		}

		$lo = $input['link_options'] ?? array();
		$clean['link_options'] = array(
			'rel'       => ( isset( $lo['rel'] ) && 'follow' === $lo['rel'] ) ? 'follow' : 'nofollow',
			'sponsored' => ! empty( $lo['sponsored'] ),
			'new_tab'   => ! empty( $lo['new_tab'] ),
		);

		$clean['default_tag'] = isset( $input['default_tag'] )
			? substr( preg_replace( '/[^a-zA-Z0-9\-_.]/', '', (string) $input['default_tag'] ), 0, 64 )
			: '';

		$clean['geo_enabled'] = ! empty( $input['geo_enabled'] );
		$clean['woo_button_rewrite'] = ! empty( $input['woo_button_rewrite'] );

		$ex = ( isset( $input['exclusions'] ) && is_array( $input['exclusions'] ) ) ? $input['exclusions'] : array();
		$clean['exclusions'] = array(
			'posts'        => self::int_list( $ex['posts'] ?? array() ),
			'pages'        => self::int_list( $ex['pages'] ?? array() ),
			'cats'         => self::int_list( $ex['cats'] ?? array() ),
			'except_posts' => self::int_list( $ex['except_posts'] ?? array() ),
			'except_pages' => self::int_list( $ex['except_pages'] ?? array() ),
		);

		$btn = ( isset( $input['button'] ) && is_array( $input['button'] ) ) ? $input['button'] : array();

		// esc_url_raw strips the braces from an {ASIN} placeholder, so shield it first.
		$custom_raw   = isset( $btn['custom_link'] ) ? (string) $btn['custom_link'] : '';
		$custom_raw   = str_ireplace( '{ASIN}', 'DEVDOMEASINTOKEN', $custom_raw );
		$custom_clean = str_ireplace( 'DEVDOMEASINTOKEN', '{ASIN}', esc_url_raw( $custom_raw ) );

		$gen_domain = isset( $btn['generated_domain'] ) ? strtolower( sanitize_text_field( (string) $btn['generated_domain'] ) ) : 'amazon.com';
		if ( ! in_array( $gen_domain, self::DOMAINS, true ) ) {
			$gen_domain = 'amazon.com';
		}

		$clean['button'] = array(
			'text'             => isset( $btn['text'] ) ? sanitize_text_field( (string) $btn['text'] ) : 'Check Price On Amazon',
			'link_mode'        => ( isset( $btn['link_mode'] ) && 'custom' === $btn['link_mode'] ) ? 'custom' : 'generated',
			'custom_link'      => $custom_clean,
			'generated_domain' => $gen_domain,
			'skip_tag'         => ! empty( $btn['skip_tag'] ),
		);

		$al       = ( isset( $input['auto_linker'] ) && is_array( $input['auto_linker'] ) ) ? $input['auto_linker'] : array();
		$al_apply = ( isset( $al['apply'] ) && is_array( $al['apply'] ) ) ? $al['apply'] : array();
		$al_skip  = ( isset( $al['skip'] ) && is_array( $al['skip'] ) ) ? $al['skip'] : array();
		$clean['auto_linker'] = array(
			'enabled' => ! empty( $al['enabled'] ),
			'limit'   => max( 1, min( 99, isset( $al['limit'] ) ? (int) $al['limit'] : 2 ) ),
			'apply'   => array(
				'posts'    => ! empty( $al_apply['posts'] ),
				'pages'    => ! empty( $al_apply['pages'] ),
				'products' => ! empty( $al_apply['products'] ),
			),
			'skip'    => array(
				'headings'        => ! empty( $al_skip['headings'] ),
				'links'           => ! empty( $al_skip['links'] ),
				'code'            => ! empty( $al_skip['code'] ),
				'first_paragraph' => ! empty( $al_skip['first_paragraph'] ),
				'blockquotes'     => ! empty( $al_skip['blockquotes'] ),
			),
			'rules'   => array(),
		);
		if ( ! empty( $al['rules'] ) && is_array( $al['rules'] ) ) {
			$al_seen = array();
			foreach ( $al['rules'] as $r ) {
				$rid = isset( $r['id'] ) ? sanitize_key( (string) $r['id'] ) : '';
				if ( '' === $rid || isset( $al_seen[ $rid ] ) ) {
					$rid = uniqid( 'al_' );
				}
				$al_seen[ $rid ] = true;
				$clean['auto_linker']['rules'][] = array(
					'id'               => $rid,
					'nickname'         => substr( sanitize_text_field( (string) ( $r['nickname'] ?? '' ) ), 0, 100 ),
					'keywords'         => substr( sanitize_text_field( (string) ( $r['keywords'] ?? '' ) ), 0, 1000 ),
					'link'             => substr( sanitize_text_field( (string) ( $r['link'] ?? '' ) ), 0, 300 ),
					'tag'              => substr( sanitize_text_field( (string) ( $r['tag'] ?? '' ) ), 0, 64 ),
					'match_type'       => ( isset( $r['match_type'] ) && 'broad' === $r['match_type'] ) ? 'broad' : 'exact',
					'case_sensitive'   => ! empty( $r['case_sensitive'] ),
					'max_links'        => ( isset( $r['max_links'] ) && '' !== $r['max_links'] ) ? max( 0, min( 99, (int) $r['max_links'] ) ) : 0,
					'first_match_only' => ! empty( $r['first_match_only'] ),
					'enabled'          => ! empty( $r['enabled'] ),
				);
			}
		}

		$clean['scan_auto']      = ! empty( $input['scan_auto'] );
		$clean['scan_frequency'] = max( 1, min( 365, isset( $input['scan_frequency'] ) ? (int) $input['scan_frequency'] : 7 ) );
		$clean['scan_frequency_unit'] = ( isset( $input['scan_frequency_unit'] ) && 'hours' === $input['scan_frequency_unit'] ) ? 'hours' : 'days';

		$mon = ( isset( $input['monitor'] ) && is_array( $input['monitor'] ) ) ? $input['monitor'] : array();
		$clean['monitor'] = array(
			'oos_to_search'  => ! empty( $mon['oos_to_search'] ),
			'dead_to_search' => ! empty( $mon['dead_to_search'] ),
			'oos_mode'       => ( isset( $mon['oos_mode'] ) && 'search' === $mon['oos_mode'] ) ? 'search' : 'replacement',
			'dead_mode'      => ( isset( $mon['dead_mode'] ) && 'search' === $mon['dead_mode'] ) ? 'search' : 'replacement',
		);

		$ma = ( isset( $input['mobile_app'] ) && is_array( $input['mobile_app'] ) ) ? $input['mobile_app'] : array();
		$clean['mobile_app'] = array(
			'enabled'           => ! empty( $ma['enabled'] ),
			'ios_safari_button' => ! empty( $ma['ios_safari_button'] ),
			'android_mode'      => ( isset( $ma['android_mode'] ) && 'intent' === $ma['android_mode'] ) ? 'intent' : 'browser',
		);

		$cp     = ( isset( $input['click_protection'] ) && is_array( $input['click_protection'] ) ) ? $input['click_protection'] : array();
		$method = isset( $cp['redirect_method'] ) ? $cp['redirect_method'] : 'js_302';
		$clean['click_protection'] = array(
			'block_bots'       => ! empty( $cp['block_bots'] ),
			'redirect_method'  => in_array( $method, array( 'js_302', 'js', '302' ), true ) ? $method : 'js_302',
		);

		update_option( DEVDAFFI_OPTION, $clean, false ); // not autoloaded — can grow with exclusion lists

		return $clean;
	}

	private static function int_list( $arr ) {
		if ( ! is_array( $arr ) ) {
			return array();
		}
		return array_values( array_unique( array_filter( array_map( 'intval', $arr ) ) ) );
	}
}
