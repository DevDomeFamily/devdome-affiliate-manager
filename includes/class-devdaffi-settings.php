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
				'block_old_browsers' => false, // Outdated Browsers switch (RM 1.5.4 rule), off until the owner turns it on
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

	/** Sanitize + persist. Returns the cleaned settings array; self::$last_saved says whether the row holds it (round 1). */
	public static $last_saved = false;
	public static function save( array $input ) {
		$clean            = self::sanitize( $input );
		self::$last_saved = self::persist( $clean );
		return $clean;
	}

	/** Proved write: true only when the option row holds $clean afterwards (update_option() answers false for "unchanged" too). */
	public static function persist( array $clean ) {
		return devdaffi_option_write( DEVDAFFI_OPTION, $clean ); // not autoloaded (add_option at activation); can grow with exclusion lists
	}

	/** Boolean leaves of the document as dotted paths; the sanitizer treats every other value as "on", so callers check these strictly. */
	public static function bool_paths() {
		return array(
			'geo_enabled', 'woo_button_rewrite', 'scan_auto',
			'link_options.sponsored', 'link_options.new_tab',
			'button.skip_tag',
			'auto_linker.enabled', 'auto_linker.apply.posts', 'auto_linker.apply.pages', 'auto_linker.apply.products',
			'auto_linker.skip.headings', 'auto_linker.skip.links', 'auto_linker.skip.code', 'auto_linker.skip.first_paragraph', 'auto_linker.skip.blockquotes',
			'monitor.oos_to_search', 'monitor.dead_to_search',
			'mobile_app.enabled', 'mobile_app.ios_safari_button',
			'click_protection.block_bots', 'click_protection.block_old_browsers',
		);
	}

	/** Enumerated leaves: the allowed values per dotted path (round 4: an unknown value is refused, never silently defaulted). */
	public static function enum_paths() {
		return array(
			'link_options.rel'                => array( 'nofollow', 'follow' ),
			'button.link_mode'                => array( 'generated', 'custom' ),
			'button.generated_domain'         => self::DOMAINS,
			'scan_frequency_unit'             => array( 'hours', 'days' ),
			'monitor.oos_mode'                => array( 'search', 'replacement' ),
			'monitor.dead_mode'               => array( 'search', 'replacement' ),
			'mobile_app.android_mode'         => array( 'browser', 'intent' ),
			'click_protection.redirect_method' => array( 'js_302', 'js', '302' ),
		);
	}

	/** Lists that replace the stored list as a whole when passed. */
	public static function list_paths() {
		return array( 'tags', 'auto_linker.rules', 'exclusions.posts', 'exclusions.pages', 'exclusions.cats', 'exclusions.except_posts', 'exclusions.except_pages' );
	}

	/** Strict boolean: true/false, 1/0, "1"/"0", "true"/"false", "yes"/"no", "on"/"off"; null for anything else (an empty string too, round 1). */
	public static function to_bool( $v ) {
		if ( is_bool( $v ) ) {
			return $v;
		}
		if ( is_int( $v ) && ( 0 === $v || 1 === $v ) ) {
			return 1 === $v;
		}
		if ( is_string( $v ) ) {
			$s = strtolower( trim( $v ) );
			if ( in_array( $s, array( '1', 'true', 'yes', 'on' ), true ) ) {
				return true;
			}
			if ( in_array( $s, array( '0', 'false', 'no', 'off' ), true ) ) {
				return false;
			}
		}
		return null;
	}

	public static function path_get( array $doc, $path ) {
		$cur = $doc;
		foreach ( explode( '.', $path ) as $k ) {
			if ( ! is_array( $cur ) || ! array_key_exists( $k, $cur ) ) {
				return null;
			}
			$cur = $cur[ $k ];
		}
		return $cur;
	}

	public static function path_set( array &$doc, $path, $value ) {
		$keys = explode( '.', $path );
		$last = array_pop( $keys );
		$cur  = &$doc;
		foreach ( $keys as $k ) {
			if ( ! isset( $cur[ $k ] ) || ! is_array( $cur[ $k ] ) ) {
				$cur[ $k ] = array();
			}
			$cur = &$cur[ $k ];
		}
		$cur[ $last ] = $value;
	}

	/** Flatten a partial document into dotted leaves; a list path is ONE leaf. */
	public static function flatten( array $doc, $prefix = '' ) {
		$lists = self::list_paths();
		$out   = array();
		foreach ( $doc as $k => $v ) {
			$path = '' === $prefix ? (string) $k : $prefix . '.' . $k;
			if ( is_array( $v ) && ! in_array( $path, $lists, true ) ) {
				$out = array_merge( $out, self::flatten( $v, $path ) );
			} else {
				$out[ $path ] = $v;
			}
		}
		return $out;
	}

	/**
	 * The stored document with the passed leaves overlaid (a partial body never wipes what it does not mention,
	 * round 1: {"scan_auto":true} used to drop every tag and rule and prune their clicks). Boolean leaves must be real
	 * booleans (or their documented spellings); a list must be a list. WP_Error on a bad value.
	 * @return array{doc:array|null,leaves:array}|WP_Error
	 */
	public static function merge( array $input ) {
		$allowed = array( 'tags', 'link_options', 'default_tag', 'geo_enabled', 'woo_button_rewrite', 'exclusions', 'button', 'auto_linker', 'scan_auto', 'scan_frequency', 'scan_frequency_unit', 'monitor', 'mobile_app', 'click_protection' );
		$body    = array();
		foreach ( $allowed as $k ) {
			if ( array_key_exists( $k, $input ) ) {
				$body[ $k ] = $input[ $k ];
			}
		}
		if ( ! $body ) {
			return array( 'doc' => null, 'leaves' => array() );
		}
		// A group key must be an object (round 2: {"auto_linker": false} used to wipe the rules); a key with a dot
		// inside an object would forge a path; a tag / rule row must be an object with real booleans.
		foreach ( array( 'link_options', 'exclusions', 'button', 'auto_linker', 'monitor', 'mobile_app', 'click_protection' ) as $g ) {
			if ( array_key_exists( $g, $body ) && ! is_array( $body[ $g ] ) ) {
				/* translators: %s is the setting group. */
				return new WP_Error( 'devdaffi_invalid_input', sprintf( __( '%s must be an object.', 'devdome-affiliate-manager' ), $g ) );
			}
		}
		$dotted = self::dotted_key( $body );
		if ( '' !== $dotted ) {
			/* translators: %s is the offending key. */
			return new WP_Error( 'devdaffi_invalid_input', sprintf( __( 'Key "%s" is not a setting.', 'devdome-affiliate-manager' ), $dotted ) );
		}
		$rows_err = self::rows_valid( $body );
		if ( is_wp_error( $rows_err ) ) {
			return $rows_err;
		}
		$leaves = self::flatten( $body );
		$bools  = self::bool_paths();
		$lists  = self::list_paths();
		$doc    = self::get();
		$enums = self::enum_paths();
		foreach ( $leaves as $path => $v ) {
			if ( isset( $enums[ $path ] ) && ( ! is_string( $v ) || ! in_array( $v, $enums[ $path ], true ) ) ) {
				/* translators: 1: the setting path, 2: the allowed values. */
				return new WP_Error( 'devdaffi_invalid_input', sprintf( __( '%1$s must be one of: %2$s.', 'devdome-affiliate-manager' ), $path, implode( ', ', $enums[ $path ] ) ) );
			}
			if ( 0 === strpos( $path, 'exclusions.' ) && ! self::is_id_list( $v ) ) { // round 3: "bad" or nested values are refused, not silently emptied
				/* translators: %s is the setting path. */
				return new WP_Error( 'devdaffi_invalid_input', sprintf( __( '%s must be a list of positive ids.', 'devdome-affiliate-manager' ), $path ) );
			}
			if ( in_array( $path, $bools, true ) ) {
				$b = self::to_bool( $v );
				if ( null === $b ) {
					/* translators: %s is the setting path. */
					return new WP_Error( 'devdaffi_invalid_input', sprintf( __( '%s must be true or false.', 'devdome-affiliate-manager' ), $path ) );
				}
				$leaves[ $path ] = $b;
			} elseif ( in_array( $path, $lists, true ) && ! is_array( $v ) ) {
				/* translators: %s is the setting path. */
				return new WP_Error( 'devdaffi_invalid_input', sprintf( __( '%s must be a list.', 'devdome-affiliate-manager' ), $path ) );
			}
			self::path_set( $doc, $path, $leaves[ $path ] );
		}
		return array( 'doc' => $doc, 'leaves' => $leaves );
	}

	/** First key holding a dot anywhere in the tree (list rows included), '' when none. */
	public static function dotted_key( $v ) {
		if ( ! is_array( $v ) ) {
			return '';
		}
		foreach ( $v as $k => $x ) {
			if ( is_string( $k ) && false !== strpos( $k, '.' ) ) {
				return $k;
			}
			$d = self::dotted_key( $x );
			if ( '' !== $d ) {
				return $d;
			}
		}
		return '';
	}

	/** Every tag / rule row passed must be an object whose boolean fields are real booleans (round 2). */
	public static function rows_valid( array $body ) {
		$sets = array();
		if ( array_key_exists( 'tags', $body ) ) {
			$sets[] = array( 'tags', $body['tags'], array( 'enabled' ) );
		}
		if ( isset( $body['auto_linker'] ) && is_array( $body['auto_linker'] ) && array_key_exists( 'rules', $body['auto_linker'] ) ) {
			$sets[] = array( 'auto_linker.rules', $body['auto_linker']['rules'], array( 'enabled', 'case_sensitive', 'first_match_only' ) );
		}
		foreach ( $sets as $set ) {
			list( $path, $rows, $fields ) = $set;
			if ( ! is_array( $rows ) ) {
				continue; // merge() reports a non-list
			}
			foreach ( $rows as $i => $row ) {
				if ( ! is_array( $row ) ) {
					/* translators: %s is the setting path. */
					return new WP_Error( 'devdaffi_invalid_input', sprintf( __( '%s must hold objects.', 'devdome-affiliate-manager' ), $path ) );
				}
				foreach ( $fields as $f ) {
					if ( array_key_exists( $f, $row ) && null === self::to_bool( $row[ $f ] ) ) {
						/* translators: 1: the setting path, 2: the row number, 3: the field. */
						return new WP_Error( 'devdaffi_invalid_input', sprintf( __( '%1$s[%2$d].%3$s must be true or false.', 'devdome-affiliate-manager' ), $path, (int) $i, $f ) );
					}
				}
				if ( 'tags' === $path && array_key_exists( 'mode', $row ) && ! in_array( $row['mode'], array( 'sitewide', 'rules' ), true ) ) {
					/* translators: %d is the row number. */
					return new WP_Error( 'devdaffi_invalid_input', sprintf( __( 'tags[%d].mode must be sitewide or rules.', 'devdome-affiliate-manager' ), (int) $i ) );
				}
				if ( 'tags' === $path && array_key_exists( 'domain', $row ) && ! in_array( $row['domain'], self::DOMAINS, true ) ) {
					/* translators: %d is the row number. */
					return new WP_Error( 'devdaffi_invalid_input', sprintf( __( 'tags[%d].domain must be a supported Amazon storefront.', 'devdome-affiliate-manager' ), (int) $i ) );
				}
				if ( 'auto_linker.rules' === $path && array_key_exists( 'match_type', $row ) && ! in_array( $row['match_type'], array( 'exact', 'broad' ), true ) ) {
					/* translators: %d is the row number. */
					return new WP_Error( 'devdaffi_invalid_input', sprintf( __( 'auto_linker.rules[%d].match_type must be exact or broad.', 'devdome-affiliate-manager' ), (int) $i ) );
				}
				if ( 'tags' === $path && array_key_exists( 'rules', $row ) ) {
					if ( ! is_array( $row['rules'] ) ) {
						/* translators: %d is the row number. */
						return new WP_Error( 'devdaffi_invalid_input', sprintf( __( 'tags[%d].rules must be an object with posts, pages and post_cats lists.', 'devdome-affiliate-manager' ), (int) $i ) );
					}
					foreach ( array( 'posts', 'pages', 'post_cats' ) as $l ) {
						if ( array_key_exists( $l, $row['rules'] ) && ! self::is_id_list( $row['rules'][ $l ] ) ) {
							/* translators: 1: the row number, 2: the list name. */
							return new WP_Error( 'devdaffi_invalid_input', sprintf( __( 'tags[%1$d].rules.%2$s must be a list of positive ids.', 'devdome-affiliate-manager' ), (int) $i, $l ) );
						}
					}
				}
			}
		}
		return true;
	}

	/** Sanitize only: the document as save() would store it. Pure, writes nothing. */
	public static function sanitize( array $input ) {
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
					'enabled'      => true === self::to_bool( isset( $t['enabled'] ) ? $t['enabled'] : false ), // "false" is off (round 2)
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
			'sponsored' => true === self::to_bool( isset( $lo['sponsored'] ) ? $lo['sponsored'] : false ),
			'new_tab'   => true === self::to_bool( isset( $lo['new_tab'] ) ? $lo['new_tab'] : false ),
		);

		$clean['default_tag'] = isset( $input['default_tag'] )
			? substr( preg_replace( '/[^a-zA-Z0-9\-_.]/', '', (string) $input['default_tag'] ), 0, 64 )
			: '';

		$clean['geo_enabled'] = true === self::to_bool( isset( $input['geo_enabled'] ) ? $input['geo_enabled'] : false ); // round 7
		$clean['woo_button_rewrite'] = true === self::to_bool( isset( $input['woo_button_rewrite'] ) ? $input['woo_button_rewrite'] : false );

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
			'skip_tag'         => true === self::to_bool( isset( $btn['skip_tag'] ) ? $btn['skip_tag'] : false ),
		);

		$al       = ( isset( $input['auto_linker'] ) && is_array( $input['auto_linker'] ) ) ? $input['auto_linker'] : array();
		$al_apply = ( isset( $al['apply'] ) && is_array( $al['apply'] ) ) ? $al['apply'] : array();
		$al_skip  = ( isset( $al['skip'] ) && is_array( $al['skip'] ) ) ? $al['skip'] : array();
		$clean['auto_linker'] = array(
			'enabled' => true === self::to_bool( isset( $al['enabled'] ) ? $al['enabled'] : false ),
			'limit'   => max( 1, min( 99, isset( $al['limit'] ) ? (int) $al['limit'] : 2 ) ),
			'apply'   => array(
				'posts'    => true === self::to_bool( isset( $al_apply['posts'] ) ? $al_apply['posts'] : false ),
				'pages'    => true === self::to_bool( isset( $al_apply['pages'] ) ? $al_apply['pages'] : false ),
				'products' => true === self::to_bool( isset( $al_apply['products'] ) ? $al_apply['products'] : false ),
			),
			'skip'    => array(
				'headings'        => true === self::to_bool( isset( $al_skip['headings'] ) ? $al_skip['headings'] : false ),
				'links'           => true === self::to_bool( isset( $al_skip['links'] ) ? $al_skip['links'] : false ),
				'code'            => true === self::to_bool( isset( $al_skip['code'] ) ? $al_skip['code'] : false ),
				'first_paragraph' => true === self::to_bool( isset( $al_skip['first_paragraph'] ) ? $al_skip['first_paragraph'] : false ),
				'blockquotes'     => true === self::to_bool( isset( $al_skip['blockquotes'] ) ? $al_skip['blockquotes'] : false ),
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
					'link'             => self::rule_link( $r['link'] ?? '' ), // an http(s) URL or a bare ASIN (round 7: the autolinker builds /dp/ASIN from a bare one)
					'tag'              => substr( sanitize_text_field( (string) ( $r['tag'] ?? '' ) ), 0, 64 ),
					'match_type'       => ( isset( $r['match_type'] ) && 'broad' === $r['match_type'] ) ? 'broad' : 'exact',
					'case_sensitive'   => true === self::to_bool( isset( $r['case_sensitive'] ) ? $r['case_sensitive'] : false ),
					'max_links'        => ( isset( $r['max_links'] ) && '' !== $r['max_links'] ) ? max( 0, min( 99, (int) $r['max_links'] ) ) : 0,
					'first_match_only' => true === self::to_bool( isset( $r['first_match_only'] ) ? $r['first_match_only'] : false ),
					'enabled'          => true === self::to_bool( isset( $r['enabled'] ) ? $r['enabled'] : false ),
				);
			}
		}

		$clean['scan_auto']      = true === self::to_bool( isset( $input['scan_auto'] ) ? $input['scan_auto'] : false );
		$clean['scan_frequency'] = max( 1, min( 365, isset( $input['scan_frequency'] ) ? (int) $input['scan_frequency'] : 7 ) );
		$clean['scan_frequency_unit'] = ( isset( $input['scan_frequency_unit'] ) && 'hours' === $input['scan_frequency_unit'] ) ? 'hours' : 'days';

		$mon = ( isset( $input['monitor'] ) && is_array( $input['monitor'] ) ) ? $input['monitor'] : array();
		$clean['monitor'] = array(
			'oos_to_search'  => true === self::to_bool( isset( $mon['oos_to_search'] ) ? $mon['oos_to_search'] : false ),
			'dead_to_search' => true === self::to_bool( isset( $mon['dead_to_search'] ) ? $mon['dead_to_search'] : false ),
			'oos_mode'       => ( isset( $mon['oos_mode'] ) && 'search' === $mon['oos_mode'] ) ? 'search' : 'replacement',
			'dead_mode'      => ( isset( $mon['dead_mode'] ) && 'search' === $mon['dead_mode'] ) ? 'search' : 'replacement',
		);

		$ma = ( isset( $input['mobile_app'] ) && is_array( $input['mobile_app'] ) ) ? $input['mobile_app'] : array();
		$clean['mobile_app'] = array(
			'enabled'           => true === self::to_bool( isset( $ma['enabled'] ) ? $ma['enabled'] : false ),
			'ios_safari_button' => true === self::to_bool( isset( $ma['ios_safari_button'] ) ? $ma['ios_safari_button'] : false ),
			'android_mode'      => ( isset( $ma['android_mode'] ) && 'intent' === $ma['android_mode'] ) ? 'intent' : 'browser',
		);

		$cp     = ( isset( $input['click_protection'] ) && is_array( $input['click_protection'] ) ) ? $input['click_protection'] : array();
		$method = isset( $cp['redirect_method'] ) ? $cp['redirect_method'] : 'js_302';
		$clean['click_protection'] = array(
			'block_bots'       => true === self::to_bool( isset( $cp['block_bots'] ) ? $cp['block_bots'] : false ),
			'block_old_browsers' => true === self::to_bool( isset( $cp['block_old_browsers'] ) ? $cp['block_old_browsers'] : false ),
			'redirect_method'  => in_array( $method, array( 'js_302', 'js', '302' ), true ) ? $method : 'js_302',
		);

		return $clean;
	}

	private static function int_list( $arr ) {
		if ( ! is_array( $arr ) ) {
			return array();
		}
		$out = array();
		foreach ( $arr as $v ) {
			if ( ( is_int( $v ) || ( is_string( $v ) && ctype_digit( $v ) ) ) && (int) $v > 0 ) { // an id, never a nested value cast to 1 (round 3)
				$out[] = (int) $v;
			}
		}
		return array_values( array_unique( $out ) );
	}

	/** A rule link as stored: an http(s) URL (up to 300 chars) or a bare 10-character ASIN; anything else is '' (round 7). */
	public static function rule_link( $v ) {
		$v = trim( (string) $v );
		if ( preg_match( '#^https?://#i', $v ) ) {
			return substr( sanitize_text_field( $v ), 0, 300 );
		}
		$asin = strtoupper( preg_replace( '/[^A-Za-z0-9]/', '', $v ) );
		return ( 10 === strlen( $asin ) && $asin === strtoupper( $v ) ) ? $asin : '';
	}

	/** True when $v is a list of positive integer ids (strings of digits accepted). */
	public static function is_id_list( $v ) {
		if ( ! is_array( $v ) ) {
			return false;
		}
		foreach ( $v as $x ) {
			if ( ! ( is_int( $x ) || ( is_string( $x ) && ctype_digit( $x ) ) ) || (int) $x <= 0 ) {
				return false;
			}
		}
		return true;
	}
}
