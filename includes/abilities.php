<?php
/**
 * WordPress Abilities API layer (WordPress 6.9+): DevDome Affiliate Manager exposed as typed, discoverable
 * abilities for AI agents and MCP clients (through the official WordPress MCP Adapter).
 *
 * Coverage = every action of the plugin's own screen, audited against the code (2026-09-16):
 * class-devdaffi-rest.php (settings read/save incl. tags, auto-linker rules, exclusions, button, monitor,
 * mobile app, click protection; scan; monitor check; replace ASIN; reset bot counter; usage meter),
 * class-devdaffi-scanner.php (full scan, replace), class-devdaffi-monitor.php (batch check, recheck by
 * status, problems, list by status), class-devdaffi-clicks.php (per-tag clicks and visitors, bot counter).
 * Every write goes through the same handler the screen uses (one source of truth, same sanitizers) and
 * is read back from the database before "updated: true" is answered.
 *
 * Actions that rewrite content (replace-asin), drop click rows (remove-affiliate-tag, remove-autolink-rule)
 * or zero a counter (reset-bot-counter) require confirm: true and are annotated destructive. Settings that
 * send visitor data to DevDome (geo-localization), schedule remote checks (auto-scan) or lower click
 * protection require confirm: true too. Agent output never carries e-mail addresses, the site token or
 * absolute server paths. On WordPress older than 6.9 the API does not exist and this file registers nothing.
 */

defined( 'ABSPATH' ) || exit;

function devdaffi_ability_ids() {
	return array(
		'devdome-affiliate-manager/get-settings',
		'devdome-affiliate-manager/get-click-stats',
		'devdome-affiliate-manager/get-link-radar',
		'devdome-affiliate-manager/get-link-problems',
		'devdome-affiliate-manager/list-links-by-status',
		'devdome-affiliate-manager/get-usage',
		'devdome-affiliate-manager/update-settings',
		'devdome-affiliate-manager/add-affiliate-tag',
		'devdome-affiliate-manager/remove-affiliate-tag',
		'devdome-affiliate-manager/add-autolink-rule',
		'devdome-affiliate-manager/remove-autolink-rule',
		'devdome-affiliate-manager/run-link-scan',
		'devdome-affiliate-manager/check-link-status',
		'devdome-affiliate-manager/replace-asin',
		'devdome-affiliate-manager/reset-bot-counter',
		'devdome-affiliate-manager/reset-tag-clicks',
	);
}

add_action( 'wp_abilities_api_categories_init', 'devdaffi_register_ability_category' );
function devdaffi_register_ability_category() {
	if ( ! function_exists( 'wp_register_ability_category' ) ) {
		return;
	}
	wp_register_ability_category( 'devdome-affiliate-manager', array(
		'label'       => __( 'DevDome Affiliate Manager', 'devdome-affiliate-manager' ),
		'description' => __( 'Amazon affiliate links: tags per store, link options, keyword auto-linker, exclusions, buy button, Link Radar (scan, dead and out-of-stock status, replacement), click stats and click protection.', 'devdome-affiliate-manager' ),
	) );
}

function devdaffi_ability_can() {
	return current_user_can( 'manage_options' );
}

/** read / modify / destroy; destructive: false = reads, null = modifies, true = destructive. */
function devdaffi_ability_meta( $kind, $idempotent = null ) {
	$map = array(
		'read'    => array( 'readonly' => true,  'destructive' => false, 'idempotent' => true ),
		'modify'  => array( 'readonly' => false, 'destructive' => false, 'idempotent' => true ),
		'destroy' => array( 'readonly' => false, 'destructive' => true,  'idempotent' => true ),
	);
	$ann = isset( $map[ $kind ] ) ? $map[ $kind ] : $map['modify'];
	if ( null !== $idempotent ) {
		$ann['idempotent'] = (bool) $idempotent;
	}
	return array(
		'public'       => true,
		'show_in_rest' => true,
		'annotations'  => $ann,
		'mcp'          => array( 'type' => 'tool' ),
	);
}

/** confirm: true or a WP_Error the agent must show the user. */
function devdaffi_ability_confirmed( $input, $why = '' ) {
	if ( is_array( $input ) && isset( $input['confirm'] ) && true === $input['confirm'] ) {
		return true;
	}
	if ( '' === $why ) {
		$why = __( 'This cannot be undone by the agent.', 'devdome-affiliate-manager' );
	}
	/* translators: %s says what the action does. */
	return new WP_Error( 'devdaffi_confirm_required', sprintf( __( '%s Pass confirm: true after the user agreed.', 'devdome-affiliate-manager' ), $why ) );
}

/** Strict boolean: true/false, 1/0, "1"/"0", "true"/"false", "yes"/"no", "on"/"off"; null for anything else. */
function devdaffi_ability_to_bool( $v ) {
	return DEVDAFFI_Settings::to_bool( $v ); // one spelling list for the screen, REST and the abilities; '' is not false (round 1)
}

/** Output sanitizer at the ability boundary: no e-mail address, no site token and no absolute server path reach an agent. */
function devdaffi_ability_strip( $v ) {
	if ( $v instanceof WP_Error ) {
		$e = new WP_Error();
		foreach ( $v->get_error_codes() as $code ) {
			$data = $v->get_error_data( $code );
			foreach ( $v->get_error_messages( $code ) as $m ) {
				$e->add( $code, devdaffi_ability_strip( $m ), null === $data ? null : devdaffi_ability_strip( $data ) );
			}
		}
		return $e;
	}
	if ( is_object( $v ) ) {
		return (object) devdaffi_ability_strip( get_object_vars( $v ) );
	}
	if ( is_array( $v ) ) {
		foreach ( $v as $k => $x ) {
			if ( 'site_token' === $k || 'token' === $k ) {
				$v[ $k ] = '<token>';
				continue;
			}
			$v[ $k ] = devdaffi_ability_strip( $x );
		}
		return $v;
	}
	if ( ! is_string( $v ) || '' === $v ) {
		return $v;
	}
	$v     = preg_replace( '/[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}/', '<email>', $v );
	$token = (string) get_option( 'devdcorev1_site_token', '' );
	if ( '' !== $token && false !== strpos( $v, $token ) ) {
		$v = str_replace( $token, '<token>', $v );
	}
	if ( defined( 'ABSPATH' ) && '' !== (string) ABSPATH && false !== strpos( $v, (string) ABSPATH ) ) {
		$v = str_replace( (string) ABSPATH, '<site>/', $v );
	}
	$v = preg_replace( '~(?<![\w:/.])(?:/[A-Za-z0-9._-]+){2,}/?~', '<path>', $v );
	$v = preg_replace( '~(?<![\w])[A-Za-z]:[\\\\/][^\s"\'<>]*~', '<path>', $v );
	return $v;
}

/* ------------------------------ settings helpers ------------------------------ */

/** The document as the sanitizer stores it (DEVDAFFI_Settings::sanitize): what a read-back must find. */
function devdaffi_ability_expected( array $doc ) {
	return DEVDAFFI_Settings::sanitize( $doc );
}

/**
 * Compare one requested leaf with what the database holds. Lists (tags, rules) are compared row by row through
 * the sanitizer: a row that carried an id must be stored with that content under that id, rows without an id are
 * matched by content (the sanitizer assigns their id). Round 1: a count-only compare called a same-sized rewrite
 * "updated" when nothing landed.
 */
function devdaffi_ability_leaf_same( $expected, $now, $path ) {
	if ( 'tags' === $path || 'auto_linker.rules' === $path ) {
		$exp = is_array( $expected ) ? $expected : array();
		$got = is_array( $now ) ? $now : array();
		if ( count( $exp ) !== count( $got ) ) {
			return false;
		}
		$strip = function ( $row ) { unset( $row['id'] ); return json_encode( $row ); };
		$by_id = array();
		foreach ( $got as $g ) {
			if ( isset( $g['id'] ) ) {
				$by_id[ $g['id'] ] = $g;
			}
		}
		$loose_exp = array();
		$loose_got = array_map( $strip, $got );
		foreach ( $exp as $e ) {
			if ( isset( $e['id'] ) && '' !== (string) $e['id'] && ! isset( $by_id[ $e['id'] ] ) ) {
				return false; // a row that carried an id must be stored under that id (round 6)
			}
			if ( isset( $e['id'] ) && isset( $by_id[ $e['id'] ] ) ) {
				if ( $strip( $e ) !== $strip( $by_id[ $e['id'] ] ) ) {
					return false;
				}
				$k = array_search( $strip( $by_id[ $e['id'] ] ), $loose_got, true );
				if ( false !== $k ) {
					unset( $loose_got[ $k ] );
				}
				continue;
			}
			$loose_exp[] = $strip( $e );
		}
		sort( $loose_exp );
		$loose_got = array_values( $loose_got );
		sort( $loose_got );
		return $loose_exp === $loose_got;
	}
	if ( is_array( $expected ) || is_array( $now ) ) {
		$w = is_array( $expected ) ? array_values( array_unique( array_filter( array_map( 'intval', $expected ) ) ) ) : array(); // the sanitizer dedupes id lists and drops 0
		$n = is_array( $now ) ? array_values( array_map( 'intval', $now ) ) : array();
		sort( $w );
		sort( $n );
		return $w === $n;
	}
	if ( is_bool( $now ) ) {
		return (bool) $expected === $now;
	}
	if ( is_int( $now ) ) {
		return (int) $expected === $now;
	}
	return (string) $expected === (string) $now;
}

/**
 * Save through the screen's handler (merge + sanitize + proved write + click-row prune) and read back every
 * passed leaf against the sanitized expectation. A leaf the sanitizer changed (a clamped number, a dropped
 * storefront) lands in not_applied; a write that did not land is an error, never "updated".
 */
function devdaffi_ability_save( array $partial ) {
	$r = DEVDAFFI_Rest::apply_settings( $partial );
	if ( is_wp_error( $r ) ) {
		return $r;
	}
	if ( empty( $r['saved'] ) ) {
		return new WP_Error( 'devdaffi_not_applied', __( 'The settings write did not land (database problem); nothing was changed. Check the database and try again.', 'devdome-affiliate-manager' ) );
	}
	$now         = DEVDAFFI_Settings::get();
	$not_applied = array();
	foreach ( $r['leaves'] as $path => $want ) {
		if ( ! devdaffi_ability_leaf_same( $want, DEVDAFFI_Settings::path_get( $now, $path ), $path ) ) {
			$not_applied[] = $path;
		}
	}
	$out = array( 'updated' => empty( $not_applied ) && ! empty( $r['pruned'] ), 'not_applied' => $not_applied, 'settings' => $now ); // a failed click prune is not "updated" (round 6)
	if ( empty( $r['pruned'] ) ) {
		$out['note'] = __( 'The settings landed, but the click rows of removed tags or rules could not be cleaned up; they are dropped on the next save.', 'devdome-affiliate-manager' );
	}
	return $out;
}

/** Changes that send visitor data out, schedule remote checks or lower protection need the user's yes. */
function devdaffi_ability_needs_confirm( array $leaves, array $now ) {
	$why = array();
	if ( isset( $leaves['geo_enabled'] ) && $leaves['geo_enabled'] && empty( $now['geo_enabled'] ) ) {
		$why[] = 'geo_enabled (every /go click sends the visitor IP address to api.devdome.com)';
	}
	if ( isset( $leaves['scan_auto'] ) && $leaves['scan_auto'] && empty( $now['scan_auto'] ) ) {
		$why[] = 'scan_auto (scheduled status checks contact api.devdome.com and use the account quota)';
	}
	if ( isset( $leaves['click_protection.block_bots'] ) && ! $leaves['click_protection.block_bots'] && ! empty( $now['click_protection']['block_bots'] ) ) {
		$why[] = 'click_protection.block_bots off (known bots are no longer blocked on /go)';
	}
	if ( isset( $leaves['click_protection.block_old_browsers'] ) && ! $leaves['click_protection.block_old_browsers'] && ! empty( $now['click_protection']['block_old_browsers'] ) ) {
		$why[] = 'click_protection.block_old_browsers off (outdated desktop browsers are no longer blocked on /go)';
	}
	// Replacement requests (title keywords sent to api.devdome.com at click time) become active when a status is
	// redirected AND its mode is "replacement": a toggle, a mode change, or both (round 3: the mode alone slipped through).
	$after = $now;
	foreach ( $leaves as $path => $v ) {
		DEVDAFFI_Settings::path_set( $after, $path, $v );
	}
	foreach ( array( 'oos', 'dead' ) as $st ) {
		$was = ! empty( $now['monitor'][ $st . '_to_search' ] ) && 'replacement' === ( isset( $now['monitor'][ $st . '_mode' ] ) ? $now['monitor'][ $st . '_mode' ] : 'replacement' );
		$is  = ! empty( $after['monitor'][ $st . '_to_search' ] ) && 'replacement' === ( isset( $after['monitor'][ $st . '_mode' ] ) ? $after['monitor'][ $st . '_mode' ] : 'replacement' );
		if ( $is && ! $was ) {
			$why[] = 'monitor.' . $st . ' replacement (a click on a flagged product sends its title keywords to api.devdome.com to find a replacement)';
		}
	}
	return $why;
}

/** Tags (by affiliate id) and rules (by id) that a new list would drop; their click rows go with them. */
function devdaffi_ability_dropped( array $leaves, array $now ) {
	$dropped = array();
	if ( isset( $leaves['tags'] ) && is_array( $leaves['tags'] ) ) {
		$doc         = $now;
		$doc['tags'] = $leaves['tags'];
		$keep        = array_map( 'strval', wp_list_pluck( devdaffi_ability_expected( $doc )['tags'], 'affiliate_id' ) );
		foreach ( $now['tags'] as $t ) {
			if ( isset( $t['affiliate_id'] ) && '' !== (string) $t['affiliate_id'] && ! in_array( (string) $t['affiliate_id'], $keep, true ) ) {
				$dropped[] = 'tag ' . $t['affiliate_id'];
			}
		}
	}
	if ( isset( $leaves['default_tag'] ) && '' !== (string) $now['default_tag'] ) {
		$doc                = $now;
		$doc['default_tag'] = $leaves['default_tag'];
		$exp                = devdaffi_ability_expected( $doc );
		$still              = array_map( 'strval', wp_list_pluck( $exp['tags'], 'affiliate_id' ) );
		if ( (string) $exp['default_tag'] !== (string) $now['default_tag'] && ! in_array( (string) $now['default_tag'], $still, true ) ) {
			$dropped[] = 'default tag ' . $now['default_tag']; // its click rows are pruned with it (round 2)
		}
	}
	if ( isset( $leaves['auto_linker.rules'] ) && is_array( $leaves['auto_linker.rules'] ) ) {
		$doc = $now;
		$doc['auto_linker']['rules'] = $leaves['auto_linker.rules'];
		$keep = array_map( 'strval', wp_list_pluck( devdaffi_ability_expected( $doc )['auto_linker']['rules'], 'id' ) );
		foreach ( $now['auto_linker']['rules'] as $r ) {
			if ( isset( $r['id'] ) && ! in_array( (string) $r['id'], $keep, true ) ) {
				$dropped[] = 'rule ' . $r['id'];
			}
		}
	}
	return $dropped;
}

/** An http(s) URL on an Amazon storefront, an Amazon shortlink host, or this site's own host (a /i/ASIN redirect). */
function devdaffi_ability_amazon_link( $url ) {
	$url = trim( (string) $url );
	if ( preg_match( '/^[A-Za-z0-9]{10}$/', $url ) ) {
		return true; // a bare ASIN: the autolinker builds the storefront /dp/ URL (round 7)
	}
	if ( ! preg_match( '#^https?://#i', $url ) ) {
		return false;
	}
	$host = strtolower( (string) wp_parse_url( $url, PHP_URL_HOST ) );
	if ( '' === $host ) {
		return false;
	}
	$own = strtolower( (string) wp_parse_url( home_url(), PHP_URL_HOST ) );
	return '' !== DEVDAFFI_Rewriter::storefront_domain( $host ) || DEVDAFFI_Rewriter::is_short( $host ) || ( '' !== $own && $host === $own );
}

function devdaffi_ability_service_state() {
	$s = (string) get_option( 'devdaffi_svc_state', '' );
	return in_array( $s, array( 'ok', 'connect', 'quota', 'unavailable' ), true ) ? $s : 'unknown';
}

/** Linked to a DevDome account, from the stored verdict only: a read ability never reconciles or calls home (round 1). */
function devdaffi_ability_connected() {
	$state = get_option( 'devdcorev1_conn_state', array() ); // the hub's stored verdict; a read ability never calls home (round 2)
	return is_array( $state ) && ! empty( $state['ok'] );
}

/* ------------------------------ handlers ------------------------------ */

function devdaffi_ability_get_settings( $input = array() ) {
	$s = DEVDAFFI_Settings::get();
	$s['connected']     = devdaffi_ability_connected();
	$s['service_state'] = devdaffi_ability_service_state();
	return $s;
}

function devdaffi_ability_get_click_stats( $input = array() ) {
	$s        = DEVDAFFI_Settings::get();
	$clicks   = DEVDAFFI_Clicks::get_all();
	$visitors = DEVDAFFI_Clicks::get_visitors();
	$bots     = DEVDAFFI_Clicks::get_bots_blocked();
	if ( ! is_array( $clicks ) || ! is_array( $visitors ) || null === $bots ) {
		return new WP_Error( 'devdaffi_db_error', __( 'The click table could not be read; the numbers are unknown, not zero.', 'devdome-affiliate-manager' ) ); // a failed SELECT is not "no clicks" (round 1)
	}
	$bots = (int) $bots;
	$tags     = array();
	foreach ( $s['tags'] as $t ) {
		$t      = is_array( $t ) ? $t : array();
		$aid    = isset( $t['affiliate_id'] ) ? (string) $t['affiliate_id'] : '';
		$tags[] = array(
			'id'           => isset( $t['id'] ) ? (string) $t['id'] : '',
			'nickname'     => isset( $t['nickname'] ) ? (string) $t['nickname'] : '', // rows saved by older versions lack keys (test2, 2026-09-16)
			'affiliate_id' => $aid,
			'domain'       => isset( $t['domain'] ) ? (string) $t['domain'] : '',
			'enabled'      => ! empty( $t['enabled'] ),
			'clicks'       => isset( $clicks[ $aid ] ) ? (int) $clicks[ $aid ] : 0,
			'visitors'     => isset( $visitors[ $aid ] ) ? (int) $visitors[ $aid ] : 0,
		);
	}
	$rules = array();
	foreach ( $s['auto_linker']['rules'] as $r ) {
		$r       = is_array( $r ) ? $r : array();
		$rid     = isset( $r['id'] ) ? (string) $r['id'] : '';
		$key     = '__rule__' . $rid;
		$rules[] = array(
			'id'       => $rid,
			'nickname' => isset( $r['nickname'] ) ? (string) $r['nickname'] : '',
			'enabled'  => ! empty( $r['enabled'] ),
			'clicks'   => isset( $clicks[ $key ] ) ? (int) $clicks[ $key ] : 0,
			'visitors' => isset( $visitors[ $key ] ) ? (int) $visitors[ $key ] : 0,
		);
	}
	$total = 0;
	foreach ( $clicks as $k => $n ) {
		if ( DEVDAFFI_Clicks::BOTS_KEY !== $k && 0 !== strpos( (string) $k, '__rule__' ) ) {
			$total += (int) $n;
		}
	}
	return array( 'tags' => $tags, 'rules' => $rules, 'total_clicks' => $total, 'bots_blocked' => $bots );
}

function devdaffi_ability_get_link_radar( $input = array() ) {
	$stats = DEVDAFFI_Scanner::get_stats();
	if ( null === $stats['links'] || null === $stats['pages'] ) {
		return new WP_Error( 'devdaffi_db_error', __( 'The link index could not be read; the counts are unknown, not zero.', 'devdome-affiliate-manager' ) ); // round 2
	}
	$s     = DEVDAFFI_Settings::get();
	return array(
		'links'               => (int) $stats['links'],
		'pages'               => (int) $stats['pages'],
		'last_scan'           => (int) $stats['last_scan'],
		'summary'             => DEVDAFFI_Monitor::get_summary(),
		'scan_auto'           => ! empty( $s['scan_auto'] ),
		'scan_frequency'      => (int) $s['scan_frequency'],
		'scan_frequency_unit' => (string) $s['scan_frequency_unit'],
		'service_state'       => devdaffi_ability_service_state(),
		'connected'           => devdaffi_ability_connected(),
	);
}

function devdaffi_ability_get_link_problems( $input = array() ) {
	$input = is_array( $input ) ? $input : array();
	$limit = isset( $input['limit'] ) ? (int) $input['limit'] : 100;
	$limit = max( 1, min( 1000, $limit ) );
	$p = DEVDAFFI_Monitor::get_problems( $limit );
	return array( 'problems' => $p['items'], 'has_more' => $p['has_more'], 'summary' => DEVDAFFI_Monitor::get_summary() );
}

function devdaffi_ability_list_links_by_status( $input = array() ) {
	$input  = is_array( $input ) ? $input : array();
	$status = isset( $input['status'] ) ? (string) $input['status'] : '';
	if ( ! in_array( $status, array( 'ok', 'oos', 'dead', 'unknown' ), true ) ) {
		return new WP_Error( 'devdaffi_invalid_input', __( 'status must be one of ok, oos, dead, unknown.', 'devdome-affiliate-manager' ) );
	}
	$limit  = isset( $input['limit'] ) ? max( 1, min( 200, (int) $input['limit'] ) ) : 50;
	$offset = isset( $input['offset'] ) ? max( 0, min( 100000, (int) $input['offset'] ) ) : 0; // bounded (round 6)
	$r      = DEVDAFFI_Monitor::get_by_status( $status, $limit, $offset );
	return array( 'status' => $status, 'items' => $r['items'], 'has_more' => ! empty( $r['has_more'] ), 'limit' => $limit, 'offset' => $offset );
}

function devdaffi_ability_get_usage( $input = array() ) {
	$r = DEVDAFFI_Rest::usage_data( devdaffi_ability_connected() ); // the stored verdict, never the reconciling helper (round 3)
	if ( is_wp_error( $r ) ) {
		return $r;
	}
	$r = is_array( $r ) ? $r : array();
	unset( $r['connect_url'] ); // a nonce link for the browser user, not for an agent
	$r['note'] = empty( $r['connected'] ) ? __( 'Connect the site from the DevDome Tools screen in wp-admin; the agent cannot complete the connect.', 'devdome-affiliate-manager' ) : '';
	return $r;
}

function devdaffi_ability_update_settings( $input = array() ) {
	$input = is_array( $input ) ? $input : array();
	$m     = DEVDAFFI_Settings::merge( $input );
	if ( is_wp_error( $m ) ) {
		return $m;
	}
	if ( null === $m['doc'] ) {
		return array( 'updated' => false, 'not_applied' => array(), 'settings' => DEVDAFFI_Settings::get() );
	}
	$now = DEVDAFFI_Settings::get();
	$why = devdaffi_ability_needs_confirm( $m['leaves'], $now );
	// A tag or rule the new list no longer holds loses its click rows for good (the screen's save does the same
	// prune): compared by identity after the sanitizer, not by length (round 1).
	$dropped = devdaffi_ability_dropped( $m['leaves'], $now );
	if ( $dropped ) {
		$why[] = 'the passed list drops ' . implode( ', ', $dropped ) . ' and their click counts';
	}
	if ( $why ) {
		$ok = devdaffi_ability_confirmed( $input, implode( '; ', $why ) . '.' );
		if ( is_wp_error( $ok ) ) {
			return $ok;
		}
	}
	return devdaffi_ability_save( $input );
}

function devdaffi_ability_add_affiliate_tag( $input = array() ) {
	$input  = is_array( $input ) ? $input : array();
	$domain = isset( $input['domain'] ) ? strtolower( trim( (string) $input['domain'] ) ) : '';
	$aid    = isset( $input['affiliate_id'] ) ? preg_replace( '/[^a-zA-Z0-9\-_.]/', '', (string) $input['affiliate_id'] ) : '';
	if ( ! in_array( $domain, DEVDAFFI_Settings::DOMAINS, true ) ) {
		return new WP_Error( 'devdaffi_invalid_input', __( 'domain must be a supported Amazon storefront, for example amazon.com or amazon.co.uk.', 'devdome-affiliate-manager' ) );
	}
	if ( '' === $aid || strlen( $aid ) > 64 ) {
		return new WP_Error( 'devdaffi_invalid_input', __( 'affiliate_id must be the Amazon Associates tag (letters, digits, - _ .), up to 64 characters.', 'devdome-affiliate-manager' ) );
	}
	$mode = ( isset( $input['mode'] ) && 'rules' === $input['mode'] ) ? 'rules' : 'sitewide';
	$en   = isset( $input['enabled'] ) ? devdaffi_ability_to_bool( $input['enabled'] ) : true;
	if ( null === $en ) {
		return new WP_Error( 'devdaffi_invalid_input', __( 'enabled must be true or false.', 'devdome-affiliate-manager' ) );
	}
	$rules = isset( $input['rules'] ) && is_array( $input['rules'] ) ? $input['rules'] : array();
	$doc   = DEVDAFFI_Settings::get();
	if ( count( $doc['tags'] ) >= 100 ) {
		return new WP_Error( 'devdaffi_invalid_input', __( 'This site already holds 100 tags, the limit the screen enforces too.', 'devdome-affiliate-manager' ) ); // round 5
	}
	$id    = uniqid( 'tag_' );
	$tags  = $doc['tags'];
	$tags[] = array(
		'id'           => $id,
		'nickname'     => isset( $input['nickname'] ) ? (string) $input['nickname'] : '',
		'affiliate_id' => $aid,
		'domain'       => $domain,
		'enabled'      => $en,
		'mode'         => $mode,
		'rules'        => array(
			'posts'     => isset( $rules['posts'] ) ? (array) $rules['posts'] : array(),
			'pages'     => isset( $rules['pages'] ) ? (array) $rules['pages'] : array(),
			'post_cats' => isset( $rules['post_cats'] ) ? (array) $rules['post_cats'] : array(),
		),
	);
	$r = DEVDAFFI_Rest::apply_settings( array( 'tags' => $tags ) );
	if ( is_wp_error( $r ) ) {
		return $r;
	}
	$now   = DEVDAFFI_Settings::get();
	$found = null;
	foreach ( $now['tags'] as $t ) {
		if ( isset( $t['id'] ) && $t['id'] === $id ) {
			$found = $t;
		}
	}
	if ( empty( $r['saved'] ) || null === $found ) {
		return new WP_Error( 'devdaffi_not_applied', __( 'The tag was not stored (the settings write did not land). Check the database and try again.', 'devdome-affiliate-manager' ) );
	}
	return array( 'added' => true, 'tag' => $found, 'tags' => $now['tags'] );
}

function devdaffi_ability_remove_affiliate_tag( $input = array() ) {
	$input = is_array( $input ) ? $input : array();
	$id    = isset( $input['id'] ) ? sanitize_key( (string) $input['id'] ) : '';
	if ( '' === $id ) {
		return new WP_Error( 'devdaffi_invalid_input', __( 'id is required (the tag id from get-settings).', 'devdome-affiliate-manager' ) );
	}
	$ok = devdaffi_ability_confirmed( $input, __( 'Removing a tag stops tagging with it and deletes its click counts.', 'devdome-affiliate-manager' ) );
	if ( is_wp_error( $ok ) ) {
		return $ok;
	}
	$doc  = DEVDAFFI_Settings::get();
	$keep = array();
	$hit  = false;
	foreach ( $doc['tags'] as $t ) {
		if ( $t['id'] === $id ) {
			$hit = true;
			continue;
		}
		$keep[] = $t;
	}
	if ( ! $hit ) {
		return new WP_Error( 'devdaffi_not_found', __( 'No tag with that id.', 'devdome-affiliate-manager' ) );
	}
	$gone = '';
	foreach ( $doc['tags'] as $t ) {
		if ( $t['id'] === $id ) {
			$gone = isset( $t['affiliate_id'] ) ? (string) $t['affiliate_id'] : '';
		}
	}
	$r = DEVDAFFI_Rest::apply_settings( array( 'tags' => $keep ) );
	if ( is_wp_error( $r ) ) {
		return $r;
	}
	$now = DEVDAFFI_Settings::get();
	foreach ( $now['tags'] as $t ) {
		if ( isset( $t['id'] ) && $t['id'] === $id ) {
			return new WP_Error( 'devdaffi_not_applied', __( 'The tag is still stored (the settings write did not land). Check the database and try again.', 'devdome-affiliate-manager' ) );
		}
	}
	$out = array( 'removed' => true, 'tags' => $now['tags'], 'clicks_deleted' => true, 'clicks_retained' => false );
	// The click rows are a second write: read back whether they went (round 1). Another tag or the default tag may
	// legitimately keep the same affiliate id, then the rows stay on purpose.
	$still_used = '' !== $gone && ( in_array( $gone, array_map( 'strval', wp_list_pluck( $now['tags'], 'affiliate_id' ) ), true ) || $gone === (string) $now['default_tag'] );
	$all        = DEVDAFFI_Clicks::get_all();
	if ( $still_used ) {
		$out['clicks_deleted']  = false; // round 3: kept on purpose is not "deleted"
		$out['clicks_retained'] = true;
		$out['note']            = __( 'Another tag or the default tag still uses this affiliate id, so its click rows are kept.', 'devdome-affiliate-manager' );
	} elseif ( '' !== $gone && ( ! is_array( $all ) || isset( $all[ $gone ] ) ) ) {
		$out['clicks_deleted'] = false;
		$out['note']           = __( 'The tag is removed, but its click rows could not be confirmed gone; they are dropped on the next settings save.', 'devdome-affiliate-manager' );
	}
	return $out;
}

function devdaffi_ability_add_autolink_rule( $input = array() ) {
	$input    = is_array( $input ) ? $input : array();
	$keywords = isset( $input['keywords'] ) ? trim( (string) $input['keywords'] ) : '';
	$link     = isset( $input['link'] ) ? trim( (string) $input['link'] ) : '';
	if ( '' === $keywords || '' === $link || array() === array_filter( array_map( 'trim', explode( ',', $keywords ) ) ) ) { // round 9: "," is no keyword
		return new WP_Error( 'devdaffi_invalid_input', __( 'keywords (comma separated) and link (the Amazon URL or ASIN link) are required.', 'devdome-affiliate-manager' ) );
	}
	if ( ! devdaffi_ability_amazon_link( $link ) ) { // round 4: the auto-linker injects this link site-wide, it must be an Amazon link
		return new WP_Error( 'devdaffi_invalid_input', __( 'link must be a bare 10-character ASIN, an https Amazon product URL or shortlink (amazon.<store>/dp/ASIN, amzn.to, a.co), or a link on this site.', 'devdome-affiliate-manager' ) );
	}
	$bools = array();
	foreach ( array( 'case_sensitive' => false, 'first_match_only' => false, 'enabled' => true ) as $k => $d ) {
		$b = isset( $input[ $k ] ) ? devdaffi_ability_to_bool( $input[ $k ] ) : $d;
		if ( null === $b ) {
			/* translators: %s is the field name. */
			return new WP_Error( 'devdaffi_invalid_input', sprintf( __( '%s must be true or false.', 'devdome-affiliate-manager' ), $k ) );
		}
		$bools[ $k ] = $b;
	}
	if ( isset( $input['max_links'] ) && ( ! is_numeric( $input['max_links'] ) || (int) $input['max_links'] < 0 || (int) $input['max_links'] > 99 ) ) {
		return new WP_Error( 'devdaffi_invalid_input', __( 'max_links must be 0 (the global limit) to 99.', 'devdome-affiliate-manager' ) );
	}
	$doc   = DEVDAFFI_Settings::get();
	$id    = uniqid( 'al_' );
	$rules = $doc['auto_linker']['rules'];
	$rules[] = array(
		'id'               => $id,
		'nickname'         => isset( $input['nickname'] ) ? (string) $input['nickname'] : '',
		'keywords'         => $keywords,
		'link'             => $link,
		'tag'              => isset( $input['tag'] ) ? (string) $input['tag'] : '',
		'match_type'       => ( isset( $input['match_type'] ) && 'broad' === $input['match_type'] ) ? 'broad' : 'exact',
		'case_sensitive'   => $bools['case_sensitive'],
		'max_links'        => isset( $input['max_links'] ) ? (int) $input['max_links'] : 0,
		'first_match_only' => $bools['first_match_only'],
		'enabled'          => $bools['enabled'],
	);
	$r = DEVDAFFI_Rest::apply_settings( array( 'auto_linker' => array( 'rules' => $rules ) ) );
	if ( is_wp_error( $r ) ) {
		return $r;
	}
	$now   = DEVDAFFI_Settings::get();
	$found = null;
	foreach ( $now['auto_linker']['rules'] as $r ) {
		if ( isset( $r['id'] ) && $r['id'] === $id ) {
			$found = $r;
		}
	}
	if ( null === $found ) {
		return new WP_Error( 'devdaffi_not_applied', __( 'The rule was not stored (the settings write did not land). Check the database and try again.', 'devdome-affiliate-manager' ) );
	}
	return array( 'added' => true, 'rule' => $found, 'auto_linker_enabled' => ! empty( $now['auto_linker']['enabled'] ), 'rules' => $now['auto_linker']['rules'] );
}

function devdaffi_ability_remove_autolink_rule( $input = array() ) {
	$input = is_array( $input ) ? $input : array();
	$id    = isset( $input['id'] ) ? sanitize_key( (string) $input['id'] ) : '';
	if ( '' === $id ) {
		return new WP_Error( 'devdaffi_invalid_input', __( 'id is required (the rule id from get-settings).', 'devdome-affiliate-manager' ) );
	}
	$ok = devdaffi_ability_confirmed( $input, __( 'Removing a rule stops its auto-links and deletes its click counts.', 'devdome-affiliate-manager' ) );
	if ( is_wp_error( $ok ) ) {
		return $ok;
	}
	$doc  = DEVDAFFI_Settings::get();
	$keep = array();
	$hit  = false;
	foreach ( $doc['auto_linker']['rules'] as $r ) {
		if ( $r['id'] === $id ) {
			$hit = true;
			continue;
		}
		$keep[] = $r;
	}
	if ( ! $hit ) {
		return new WP_Error( 'devdaffi_not_found', __( 'No auto-linker rule with that id.', 'devdome-affiliate-manager' ) );
	}
	$r = DEVDAFFI_Rest::apply_settings( array( 'auto_linker' => array( 'rules' => $keep ) ) );
	if ( is_wp_error( $r ) ) {
		return $r;
	}
	$now = DEVDAFFI_Settings::get();
	foreach ( $now['auto_linker']['rules'] as $r ) {
		if ( isset( $r['id'] ) && $r['id'] === $id ) {
			return new WP_Error( 'devdaffi_not_applied', __( 'The rule is still stored (the settings write did not land). Check the database and try again.', 'devdome-affiliate-manager' ) );
		}
	}
	$out = array( 'removed' => true, 'rules' => $now['auto_linker']['rules'], 'clicks_deleted' => true );
	$all = DEVDAFFI_Clicks::get_all();
	if ( ! is_array( $all ) || isset( $all[ '__rule__' . $id ] ) ) {
		$out['clicks_deleted'] = false;
		$out['note']           = __( 'The rule is removed, but its click rows could not be confirmed gone; they are dropped on the next settings save.', 'devdome-affiliate-manager' );
	}
	return $out;
}

function devdaffi_ability_run_link_scan( $input = array() ) {
	$stats = DEVDAFFI_Scanner::full_scan();
	if ( empty( $stats['ok'] ) ) {
		return new WP_Error( 'devdaffi_scan_failed', isset( $stats['error'] ) ? (string) $stats['error'] : __( 'The scan could not complete; the index was left as it was.', 'devdome-affiliate-manager' ) );
	}
	$out = array( 'links' => (int) $stats['links'], 'pages' => (int) $stats['pages'], 'last_scan' => (int) $stats['last_scan'], 'partial' => ! empty( $stats['partial'] ), 'summary' => DEVDAFFI_Monitor::get_summary() );
	if ( $out['partial'] ) {
		$out['note'] = __( 'The site has more posts mentioning Amazon than one scan covers (20,000); rows of unscanned posts were kept, not pruned.', 'devdome-affiliate-manager' );
	}
	return $out;
}

function devdaffi_ability_check_link_status( $input = array() ) {
	$input  = is_array( $input ) ? $input : array();
	$status = isset( $input['status'] ) ? (string) $input['status'] : '';
	if ( '' !== $status && ! in_array( $status, array( 'oos', 'dead', 'unknown' ), true ) ) {
		return new WP_Error( 'devdaffi_invalid_input', __( 'status must be empty (next batch), oos, dead or unknown (re-check that group).', 'devdome-affiliate-manager' ) );
	}
	$ok = devdaffi_ability_confirmed( $input, __( 'The check sends the scanned ASINs and the site identity to api.devdome.com and uses the monthly quota of the account.', 'devdome-affiliate-manager' ) );
	if ( is_wp_error( $ok ) ) {
		return $ok;
	}
	if ( '' === (string) get_option( 'devdcorev1_site_id', '' ) || '' === (string) get_option( 'devdcorev1_site_token', '' ) ) {
		return new WP_Error( 'devdaffi_not_connected', __( 'This site has no DevDome identity yet, so the status check cannot be authenticated. Connect the site from the DevDome Tools screen first.', 'devdome-affiliate-manager' ) );
	}
	$summary = '' !== $status ? DEVDAFFI_Monitor::recheck_status( $status ) : DEVDAFFI_Monitor::check_batch();
	$state   = devdaffi_ability_service_state();
	$p       = DEVDAFFI_Monitor::get_problems( 100 );
	$out     = array( 'summary' => $summary, 'service_state' => $state, 'problems' => $p['items'], 'has_more' => $p['has_more'] );
	if ( 'connect' === $state ) {
		$out['note'] = __( 'DevDome refused the check: the site is not linked to an account. Connect it from the DevDome Tools screen.', 'devdome-affiliate-manager' );
	} elseif ( 'quota' === $state ) {
		$out['note'] = __( 'The monthly Link Radar quota of the account is used up; the checked links stayed as they were.', 'devdome-affiliate-manager' );
	} elseif ( 'ok' !== $state ) {
		$out['note'] = __( 'DevDome did not answer; unchecked links stay unknown, nothing was flagged.', 'devdome-affiliate-manager' );
	}
	return $out;
}

function devdaffi_ability_replace_asin( $input = array() ) {
	$input = is_array( $input ) ? $input : array();
	$old   = isset( $input['old'] ) ? strtoupper( preg_replace( '/[^A-Za-z0-9]/', '', (string) $input['old'] ) ) : '';
	$new   = isset( $input['new'] ) ? strtoupper( preg_replace( '/[^A-Za-z0-9]/', '', (string) $input['new'] ) ) : '';
	if ( 10 !== strlen( $old ) || 10 !== strlen( $new ) || $old === $new ) {
		return new WP_Error( 'devdaffi_invalid_input', __( 'old and new must be two different 10-character ASINs.', 'devdome-affiliate-manager' ) );
	}
	$ok = devdaffi_ability_confirmed( $input, __( 'This rewrites the ASIN inside every post, page and product link that uses it (the previous content is kept only in a recovery journal until each post is verified) and then checks the new ASIN with api.devdome.com, which uses the account quota.', 'devdome-affiliate-manager' ) );
	if ( is_wp_error( $ok ) ) {
		return $ok;
	}
	$r = DEVDAFFI_Scanner::replace_asin( $old, $new );
	if ( ! empty( $r['invalid'] ) ) {
		return new WP_Error( 'devdaffi_invalid_input', __( 'old and new must be two different 10-character ASINs.', 'devdome-affiliate-manager' ) );
	}
	if ( ! empty( $r['busy'] ) ) {
		return new WP_Error( 'devdaffi_replace_busy', __( 'Another replacement is still running on this site; try again in a minute.', 'devdome-affiliate-manager' ) ); // round 7
	}
	if ( empty( $r['ok'] ) ) {
		$inc = isset( $r['inconsistent'] ) ? $r['inconsistent'] : array();
		/* translators: 1: posts changed, 2: post ids left untouched, 3: post ids changed in part */
		return new WP_Error( 'devdaffi_replace_partial', sprintf( __( '%1$d post(s) changed. Untouched, as they were: %2$s. Changed in part (content or index does not match, open and check): %3$s.', 'devdome-affiliate-manager' ), (int) $r['pages'], $r['failed'] ? implode( ', ', $r['failed'] ) : 'none', $inc ? implode( ', ', $inc ) : 'none' ) );
	}
	$status = DEVDAFFI_Monitor::recheck_asin( $r['new'] );
	$state  = devdaffi_ability_service_state();
	$out    = array( 'replaced' => true, 'pages' => (int) $r['pages'], 'old' => $r['old'], 'new' => $r['new'], 'new_status' => (string) $status, 'new_checked' => 'ok' === $state, 'service_state' => $state, 'summary' => DEVDAFFI_Monitor::get_summary() );
	if ( 'ok' !== $state ) {
		$out['note'] = __( 'The links were replaced, but DevDome did not check the new ASIN (see service_state); new_status is the stored value, not a fresh check.', 'devdome-affiliate-manager' ); // round 4
	}
	if ( ! empty( $r['unfinished'] ) ) {
		$out['unfinished'] = $r['unfinished'];
		$out['note']       = __( 'An earlier replacement stopped before these posts were verified (a timeout or a fatal); their original content is in the recovery journal option devdaffi_replace_journal. Open and check them.', 'devdome-affiliate-manager' );
	}
	return $out;
}

function devdaffi_ability_reset_bot_counter( $input = array() ) {
	$input = is_array( $input ) ? $input : array();
	$ok    = devdaffi_ability_confirmed( $input, __( 'This sets the blocked-bot counter back to zero.', 'devdome-affiliate-manager' ) );
	if ( is_wp_error( $ok ) ) {
		return $ok;
	}
	DEVDAFFI_Clicks::reset_bots_blocked();
	$left = DEVDAFFI_Clicks::get_bots_blocked(); // null = the read failed (round 1)
	if ( null === $left || 0 !== (int) $left ) {
		return new WP_Error( 'devdaffi_not_applied', __( 'The counter is not zero after the reset (the delete did not land). Check the database and try again.', 'devdome-affiliate-manager' ) );
	}
	return array( 'reset' => true, 'bots_blocked' => 0 );
}

function devdaffi_ability_reset_tag_clicks( $input = array() ) {
	$input = is_array( $input ) ? $input : array();
	$key   = DEVDAFFI_Rest::click_key_for( isset( $input['key'] ) ? (string) $input['key'] : '' );
	if ( '' === $key ) {
		return new WP_Error( 'devdaffi_invalid_input', __( 'key must be a configured affiliate id, the default tag, or __rule__<rule id> (see get-click-stats).', 'devdome-affiliate-manager' ) );
	}
	$ok = devdaffi_ability_confirmed( $input, __( 'This deletes the click and visitor counts of that tag or rule.', 'devdome-affiliate-manager' ) );
	if ( is_wp_error( $ok ) ) {
		return $ok;
	}
	if ( ! DEVDAFFI_Clicks::reset_key( $key ) ) {
		return new WP_Error( 'devdaffi_not_applied', __( 'The click row could not be deleted (the write did not land). Check the database and try again.', 'devdome-affiliate-manager' ) );
	}
	return array( 'reset' => true, 'key' => $key );
}

/* ------------------------------ registration ------------------------------ */

add_action( 'wp_abilities_api_init', 'devdaffi_register_abilities' );
function devdaffi_register_abilities() {
	if ( ! function_exists( 'wp_register_ability' ) ) {
		return;
	}
	$empty = array( 'type' => 'object', 'properties' => array(), 'additionalProperties' => false );
	$bool  = function ( $desc ) { return array( 'type' => 'boolean', 'description' => $desc ); };
	$str   = function ( $desc = '' ) { return array( 'type' => 'string', 'description' => $desc ); };
	$int   = function ( $desc = '' ) { return array( 'type' => 'integer', 'description' => $desc ); };
	$ints  = array( 'type' => 'array', 'items' => array( 'type' => 'integer' ) );
	$confirm = function ( $desc ) { return array( 'confirm' => array( 'type' => 'boolean', 'description' => $desc ) ); };

	$tag_props = array(
		'id'           => $str( 'Tag id (assigned on creation).' ),
		'nickname'     => $str( 'Label shown on the screen.' ),
		'affiliate_id' => $str( 'The Amazon Associates tag, for example mysite-20.' ),
		'domain'       => array( 'type' => 'string', 'enum' => DEVDAFFI_Settings::DOMAINS, 'description' => 'The Amazon storefront this tag belongs to.' ),
		'enabled'      => $bool( '' ),
		'mode'         => array( 'type' => 'string', 'enum' => array( 'sitewide', 'rules' ), 'description' => 'sitewide = every link to this store; rules = only the listed posts, pages and post categories.' ),
		'rules'        => array( 'type' => 'object', 'properties' => array( 'posts' => $ints, 'pages' => $ints, 'post_cats' => $ints ) ),
	);
	$rule_props = array(
		'id'               => $str( 'Rule id (assigned on creation).' ),
		'nickname'         => $str( '' ),
		'keywords'         => $str( 'Comma-separated keywords to turn into links.' ),
		'link'             => $str( 'The Amazon link (product URL or shortlink) the keywords point to.' ),
		'tag'              => $str( 'The id of the affiliate tag to use for this rule (from get-settings); empty = the tag resolved for the page.' ),
		'match_type'       => array( 'type' => 'string', 'enum' => array( 'exact', 'broad' ) ),
		'case_sensitive'   => $bool( '' ),
		'max_links'        => $int( 'Max links this rule adds per page, 0 to 99; 0 = the global limit.' ),
		'first_match_only' => $bool( '' ),
		'enabled'          => $bool( '' ),
	);
	$settings_props = array(
		'tags'                => array( 'type' => 'array', 'items' => array( 'type' => 'object', 'properties' => $tag_props ), 'description' => 'The full tags list; when passed it replaces the stored list (unknown storefronts are dropped).' ),
		'link_options'        => array( 'type' => 'object', 'properties' => array( 'rel' => array( 'type' => 'string', 'enum' => array( 'nofollow', 'follow' ) ), 'sponsored' => $bool( 'Add rel="sponsored".' ), 'new_tab' => $bool( 'Open affiliate links in a new tab.' ) ) ),
		'default_tag'         => $str( 'Fallback Associates tag used by /go when a link has no tag.' ),
		'geo_enabled'         => $bool( 'Geo-localization: send /go clicks to the visitor\'s local Amazon store (only stores with a tag). Each click sends the visitor IP address to api.devdome.com; turning it on needs confirm: true.' ),
		'woo_button_rewrite'  => $bool( 'Route WooCommerce external-product buttons that carry an ASIN through /go.' ),
		'exclusions'          => array( 'type' => 'object', 'properties' => array( 'posts' => $ints, 'pages' => $ints, 'cats' => $ints, 'except_posts' => $ints, 'except_pages' => $ints ), 'description' => 'Content where links are not tagged; except_* re-includes single posts or pages inside an excluded category.' ),
		'button'              => array( 'type' => 'object', 'properties' => array( 'text' => $str( 'Buy button label.' ), 'link_mode' => array( 'type' => 'string', 'enum' => array( 'generated', 'custom' ) ), 'custom_link' => $str( 'Custom link with an {ASIN} placeholder.' ), 'generated_domain' => array( 'type' => 'string', 'enum' => DEVDAFFI_Settings::DOMAINS ), 'skip_tag' => $bool( 'Generated mode: omit the affiliate tag.' ) ) ),
		'auto_linker'         => array( 'type' => 'object', 'properties' => array( 'enabled' => $bool( '' ), 'limit' => $int( 'Max auto-links per page, 1 to 99.' ), 'apply' => array( 'type' => 'object', 'properties' => array( 'posts' => $bool( '' ), 'pages' => $bool( '' ), 'products' => $bool( '' ) ) ), 'skip' => array( 'type' => 'object', 'properties' => array( 'headings' => $bool( '' ), 'links' => $bool( '' ), 'code' => $bool( '' ), 'first_paragraph' => $bool( '' ), 'blockquotes' => $bool( '' ) ) ), 'rules' => array( 'type' => 'array', 'items' => array( 'type' => 'object', 'properties' => $rule_props ), 'description' => 'The full rules list; when passed it replaces the stored list.' ) ) ),
		'scan_auto'           => $bool( 'Scheduled Link Radar re-scan and status checks (contact api.devdome.com, use the account quota); turning it on needs confirm: true.' ),
		'scan_frequency'      => $int( '1 to 365, with scan_frequency_unit.' ),
		'scan_frequency_unit' => array( 'type' => 'string', 'enum' => array( 'hours', 'days' ) ),
		'monitor'             => array( 'type' => 'object', 'properties' => array( 'oos_to_search' => $bool( 'Send clicks on out-of-stock products elsewhere.' ), 'dead_to_search' => $bool( 'Send clicks on dead (404) products elsewhere.' ), 'oos_mode' => array( 'type' => 'string', 'enum' => array( 'search', 'replacement' ) ), 'dead_mode' => array( 'type' => 'string', 'enum' => array( 'search', 'replacement' ) ) ) ),
		'mobile_app'          => array( 'type' => 'object', 'properties' => array( 'enabled' => $bool( '' ), 'ios_safari_button' => $bool( '' ), 'android_mode' => array( 'type' => 'string', 'enum' => array( 'browser', 'intent' ) ) ) ),
		'click_protection'    => array( 'type' => 'object', 'properties' => array( 'block_bots' => $bool( 'Block known bots on /go; turning it off needs confirm: true.' ), 'block_old_browsers' => $bool( 'Also treat desktop Chrome, Edge or Firefox that are years behind (below 125; 109 and 115 ESR stay allowed; phones never judged) as bots on /go. Only applies while block_bots is on; turning it off needs confirm: true.' ), 'redirect_method' => array( 'type' => 'string', 'enum' => array( 'js_302', 'js', '302' ) ) ) ),
	);
	$settings_out = array( 'type' => 'object', 'properties' => $settings_props );
	$summary_out  = array( 'type' => 'object', 'properties' => array( 'total' => $int(), 'checked' => $int(), 'ok' => $int(), 'oos' => $int(), 'dead' => $int(), 'unknown' => $int(), 'unchecked' => $int() ) );
	$page_item    = array( 'type' => 'object', 'properties' => array( 'post_id' => $int(), 'title' => $str(), 'permalink' => $str(), 'edit_link' => $str() ) );
	$link_item    = array( 'type' => 'object', 'properties' => array( 'asin' => $str(), 'domain' => $str(), 'status' => $str(), 'amazon_url' => $str(), 'title' => $str(), 'pages' => array( 'type' => 'array', 'items' => $page_item ) ) );

	$guarded = function ( $cb ) {
		return function ( $input = array() ) use ( $cb ) {
			// Guard window (DESIGN.md 24): a query that failed inside the ability makes the answer a database error,
			// whatever the handler made of the empty read (round 1).
			devdaffi_db_guard_begin();
			try {
				$r = call_user_func( $cb, $input );
				if ( devdaffi_db_guard_active() ) {
					$r = new WP_Error( 'devdaffi_db_error', devdaffi_db_guard_message() );
				}
			} finally {
				devdaffi_db_guard_end();
			}
			return devdaffi_ability_strip( $r );
		};
	};
	$reg = function ( $id, $label, $desc, $in, $out, $cb, $kind, $idempotent = null ) use ( $guarded ) {
		wp_register_ability( $id, array(
			'label'               => $label,
			'description'         => $desc,
			'category'            => 'devdome-affiliate-manager',
			'input_schema'        => $in,
			'output_schema'       => $out,
			'execute_callback'    => $guarded( $cb ),
			'permission_callback' => 'devdaffi_ability_can',
			'meta'                => devdaffi_ability_meta( $kind, $idempotent ),
		) );
	};

	$reg( 'devdome-affiliate-manager/get-settings', __( 'Get affiliate settings', 'devdome-affiliate-manager' ),
		__( 'Every setting of DevDome Affiliate Manager as stored: affiliate tags per Amazon store (with their ids), link options, default tag, geo-localization, WooCommerce button rewrite, exclusions, buy button, keyword auto-linker with its rules, Link Radar schedule, dead and out-of-stock handling, mobile app opener, click protection; plus whether the site is linked to a DevDome account and the last answer of the Link Radar service. Read-only.', 'devdome-affiliate-manager' ),
		$empty, array( 'type' => 'object', 'properties' => array_merge( $settings_props, array( 'connected' => $bool( '' ), 'service_state' => array( 'type' => 'string', 'enum' => array( 'ok', 'connect', 'quota', 'unavailable', 'unknown' ) ) ) ) ),
		'devdaffi_ability_get_settings', 'read' );

	$reg( 'devdome-affiliate-manager/get-click-stats', __( 'Get affiliate click stats', 'devdome-affiliate-manager' ),
		__( 'Clicks and unique visitors recorded by the /go endpoint per affiliate tag and per auto-linker rule, the total, and the number of bot clicks blocked by click protection. Same numbers as the screen. Read-only.', 'devdome-affiliate-manager' ),
		$empty, array( 'type' => 'object', 'properties' => array(
			'tags'         => array( 'type' => 'array', 'items' => array( 'type' => 'object', 'properties' => array( 'id' => $str(), 'nickname' => $str(), 'affiliate_id' => $str(), 'domain' => $str(), 'enabled' => $bool( '' ), 'clicks' => $int(), 'visitors' => $int() ) ) ),
			'rules'        => array( 'type' => 'array', 'items' => array( 'type' => 'object', 'properties' => array( 'id' => $str(), 'nickname' => $str(), 'enabled' => $bool( '' ), 'clicks' => $int(), 'visitors' => $int() ) ) ),
			'total_clicks' => $int( 'All tag clicks (bot blocks and rule attributions excluded).' ),
			'bots_blocked' => $int(),
		) ),
		'devdaffi_ability_get_click_stats', 'read' );

	$reg( 'devdome-affiliate-manager/get-link-radar', __( 'Get Link Radar overview', 'devdome-affiliate-manager' ),
		__( 'The Link Radar index: how many Amazon product links across how many pages were found by the last scan and when, the status summary (live, out of stock, dead, unknown, unchecked), the auto-scan schedule, and the last answer of the DevDome status service. Read-only, no request is made.', 'devdome-affiliate-manager' ),
		$empty, array( 'type' => 'object', 'properties' => array( 'links' => $int(), 'pages' => $int(), 'last_scan' => $int( 'Unix time, 0 = never.' ), 'summary' => $summary_out, 'scan_auto' => $bool( '' ), 'scan_frequency' => $int(), 'scan_frequency_unit' => $str(), 'service_state' => $str(), 'connected' => $bool( '' ) ) ),
		'devdaffi_ability_get_link_radar', 'read' );

	$reg( 'devdome-affiliate-manager/get-link-problems', __( 'List dead, out-of-stock and unanswered links', 'devdome-affiliate-manager' ),
		__( 'Every product the monitor flagged dead (404), out of stock, or unknown (the check gave no answer yet), one entry per ASIN with the Amazon URL, the product title when known, and every post, page or product that links it (with edit links). Read-only.', 'devdome-affiliate-manager' ),
		array( 'type' => 'object', 'properties' => array( 'limit' => $int( 'Max products per status (dead, out of stock, unknown), 1 to 1000, default 100; has_more is true when any group has more.' ) ), 'additionalProperties' => false ),
		array( 'type' => 'object', 'properties' => array( 'problems' => array( 'type' => 'array', 'items' => $link_item ), 'has_more' => $bool( 'More flagged products exist than limit; raise limit or use list-links-by-status.' ), 'summary' => $summary_out ) ),
		'devdaffi_ability_get_link_problems', 'read' );

	$reg( 'devdome-affiliate-manager/list-links-by-status', __( 'List links by status', 'devdome-affiliate-manager' ),
		__( 'Paginated list of scanned ASINs with one status (ok, oos, dead, unknown), each with its store, Amazon URL, title when known, and the pages that link it. Read-only.', 'devdome-affiliate-manager' ),
		array( 'type' => 'object', 'properties' => array( 'status' => array( 'type' => 'string', 'enum' => array( 'ok', 'oos', 'dead', 'unknown' ) ), 'limit' => $int( '1 to 200, default 50.' ), 'offset' => $int( 'Default 0.' ) ), 'required' => array( 'status' ), 'additionalProperties' => false ),
		array( 'type' => 'object', 'properties' => array( 'status' => $str(), 'items' => array( 'type' => 'array', 'items' => $link_item ), 'has_more' => $bool( '' ), 'limit' => $int(), 'offset' => $int() ) ),
		'devdaffi_ability_list_links_by_status', 'read' );

	$reg( 'devdome-affiliate-manager/get-usage', __( 'Get Link Radar quota', 'devdome-affiliate-manager' ),
		__( 'Whether the site is linked to a DevDome account and, when it is, the monthly Link Radar quota of the account (plan, limit, used, remaining, geo entitlement) from api.devdome.com. An unconnected site that never pressed Connect makes no request. Read-only.', 'devdome-affiliate-manager' ),
		$empty, array( 'type' => 'object', 'properties' => array( 'connected' => $bool( '' ), 'usage' => array( 'type' => array( 'object', 'null' ) ), 'state' => array( 'type' => 'string', 'enum' => array( 'ok', 'connect', 'quota', 'unavailable' ) ), 'note' => $str() ) ),
		'devdaffi_ability_get_usage', 'read' );

	$reg( 'devdome-affiliate-manager/update-settings', __( 'Update affiliate settings', 'devdome-affiliate-manager' ),
		__( 'Change any settings; only the keys you pass change (nested keys merge, the lists tags, auto_linker.rules and every exclusions list replace the stored list as a whole), through the same handler the screen uses. Every passed value is read back from the database before updated: true; values the sanitizer refused are listed in not_applied by their path. Turning geo_enabled or scan_auto on, turning click_protection.block_bots off, or passing a tags or rules list that drops entries (their click counts go with them) requires confirm: true; ask the user first.', 'devdome-affiliate-manager' ),
		array( 'type' => 'object', 'properties' => array_merge( $settings_props, $confirm( 'Required (true) when geo_enabled or scan_auto is turned on, click_protection.block_bots is turned off, or a passed tags / rules list drops entries. Ask the user first.' ) ), 'additionalProperties' => false ),
		array( 'type' => 'object', 'properties' => array( 'updated' => $bool( 'true only when every passed value holds now' ), 'not_applied' => array( 'type' => 'array', 'items' => array( 'type' => 'string' ) ), 'note' => $str(), 'settings' => $settings_out ) ),
		'devdaffi_ability_update_settings', 'modify', true );

	$reg( 'devdome-affiliate-manager/add-affiliate-tag', __( 'Add an affiliate tag', 'devdome-affiliate-manager' ),
		__( 'Add one Amazon Associates tag for one storefront (the Add tag form): affiliate_id and domain are required; mode sitewide (default) tags every link to that store, mode rules only the listed posts, pages and post categories. Answers the stored tag with its id after a read-back. A second tag for the same store is allowed (the first enabled sitewide one is used).', 'devdome-affiliate-manager' ),
		array( 'type' => 'object', 'properties' => array( 'affiliate_id' => $tag_props['affiliate_id'], 'domain' => $tag_props['domain'], 'nickname' => $tag_props['nickname'], 'enabled' => $bool( 'Default true.' ), 'mode' => $tag_props['mode'], 'rules' => $tag_props['rules'] ), 'required' => array( 'affiliate_id', 'domain' ), 'additionalProperties' => false ),
		array( 'type' => 'object', 'properties' => array( 'added' => $bool( '' ), 'tag' => array( 'type' => 'object', 'properties' => $tag_props ), 'tags' => $settings_props['tags'] ) ),
		'devdaffi_ability_add_affiliate_tag', 'modify', false );

	$reg( 'devdome-affiliate-manager/remove-affiliate-tag', __( 'Remove an affiliate tag', 'devdome-affiliate-manager' ),
		__( 'Remove one tag by id (the Delete action on a tag row). Links stop being tagged with it and its click counts are deleted; cannot be undone: requires confirm: true, ask the user first.', 'devdome-affiliate-manager' ),
		array( 'type' => 'object', 'properties' => array_merge( array( 'id' => $str( 'The tag id from get-settings.' ) ), $confirm( 'Must be true: the tag and its click counts are removed for good.' ) ), 'required' => array( 'id', 'confirm' ), 'additionalProperties' => false ),
		array( 'type' => 'object', 'properties' => array( 'removed' => $bool( '' ), 'tags' => $settings_props['tags'], 'clicks_deleted' => $bool( '' ), 'clicks_retained' => $bool( 'true when another tag or the default tag still uses the same affiliate id, so the rows stay.' ), 'note' => $str() ) ),
		'devdaffi_ability_remove_affiliate_tag', 'destroy', false ); // a second call answers not_found (round 5)

	$reg( 'devdome-affiliate-manager/add-autolink-rule', __( 'Add an auto-linker rule', 'devdome-affiliate-manager' ),
		__( 'Add one keyword auto-linker rule (the Add rule form): keywords (comma separated) and link are required; match_type exact (default) or broad, case_sensitive, max_links (0 = global limit), first_match_only, enabled (default true), an optional tag. The rule only acts while auto_linker.enabled is on (answered as auto_linker_enabled). Answers the stored rule with its id after a read-back.', 'devdome-affiliate-manager' ),
		array( 'type' => 'object', 'properties' => array( 'keywords' => $rule_props['keywords'], 'link' => $rule_props['link'], 'nickname' => $rule_props['nickname'], 'tag' => $rule_props['tag'], 'match_type' => $rule_props['match_type'], 'case_sensitive' => $bool( 'Default false.' ), 'max_links' => $rule_props['max_links'], 'first_match_only' => $bool( 'Default false.' ), 'enabled' => $bool( 'Default true.' ) ), 'required' => array( 'keywords', 'link' ), 'additionalProperties' => false ),
		array( 'type' => 'object', 'properties' => array( 'added' => $bool( '' ), 'rule' => array( 'type' => 'object', 'properties' => $rule_props ), 'auto_linker_enabled' => $bool( '' ), 'rules' => $settings_props['auto_linker']['properties']['rules'] ) ),
		'devdaffi_ability_add_autolink_rule', 'modify', false );

	$reg( 'devdome-affiliate-manager/remove-autolink-rule', __( 'Remove an auto-linker rule', 'devdome-affiliate-manager' ),
		__( 'Remove one auto-linker rule by id (the Delete action on a rule row). Its auto-links stop and its click counts are deleted; cannot be undone: requires confirm: true, ask the user first.', 'devdome-affiliate-manager' ),
		array( 'type' => 'object', 'properties' => array_merge( array( 'id' => $str( 'The rule id from get-settings.' ) ), $confirm( 'Must be true: the rule and its click counts are removed for good.' ) ), 'required' => array( 'id', 'confirm' ), 'additionalProperties' => false ),
		array( 'type' => 'object', 'properties' => array( 'removed' => $bool( '' ), 'rules' => $settings_props['auto_linker']['properties']['rules'], 'clicks_deleted' => $bool( '' ), 'note' => $str() ) ),
		'devdaffi_ability_remove_autolink_rule', 'destroy', false );

	$reg( 'devdome-affiliate-manager/run-link-scan', __( 'Scan the site for Amazon links', 'devdome-affiliate-manager' ),
		__( 'Rebuild the Link Radar index (the Scan button): every published post, page and WooCommerce product whose content or product URL mentions Amazon is re-indexed for ASINs, rows of pages that no longer link a product are dropped. Local only, no request leaves the site. Bounded to 20,000 posts; large sites take a while. Answers the new counts and the status summary.', 'devdome-affiliate-manager' ),
		$empty, array( 'type' => 'object', 'properties' => array( 'links' => $int(), 'pages' => $int(), 'last_scan' => $int(), 'partial' => $bool( 'true when the site exceeds the 20,000-post bound; unscanned rows were kept.' ), 'note' => $str(), 'summary' => $summary_out ) ),
		'devdaffi_ability_run_link_scan', 'modify', false );

	$reg( 'devdome-affiliate-manager/check-link-status', __( 'Check link status with DevDome', 'devdome-affiliate-manager' ),
		__( 'Ask the DevDome Link Radar service (api.devdome.com) whether scanned products are live, out of stock or dead (the Check now button): without status the next batch of up to 20 unchecked or oldest-checked ASINs; with status oos or dead the flagged ones are re-checked (up to 50) so fixed products flip back to live. Sends the ASINs, their stores and the site identity; needs a linked DevDome account and uses its monthly quota, so it requires confirm: true (ask the user first); service_state says whether the service answered, refused (connect), the quota is used up, or it was unavailable (then nothing was written). Not idempotent.', 'devdome-affiliate-manager' ),
		array( 'type' => 'object', 'properties' => array_merge( array( 'status' => array( 'type' => 'string', 'enum' => array( 'oos', 'dead', 'unknown' ), 'description' => 'Omit for the next batch; oos, dead or unknown (no answer yet) to re-check that group.' ) ), $confirm( 'Must be true: ASINs and the site identity are sent to api.devdome.com and the account quota is used.' ) ), 'required' => array( 'confirm' ), 'additionalProperties' => false ),
		array( 'type' => 'object', 'properties' => array( 'summary' => $summary_out, 'service_state' => $str(), 'problems' => array( 'type' => 'array', 'items' => $link_item ), 'has_more' => $bool( '' ), 'note' => $str() ) ),
		'devdaffi_ability_check_link_status', 'modify', false );

	$reg( 'devdome-affiliate-manager/replace-asin', __( 'Replace an ASIN everywhere', 'devdome-affiliate-manager' ),
		__( 'Swap one ASIN for another in every post, page and WooCommerce product that links it (the Replace action on a dead or out-of-stock row): only the ASIN inside Amazon and redirect URL paths is changed, never plain text; each touched post is re-indexed and the new ASIN is checked right away. The original content and product URL of each post are kept in a recovery journal (option devdaffi_replace_journal) only until that post is verified, then dropped (WordPress revisions may hold it longer); a post an earlier interrupted replacement left unverified is answered as unfinished and skipped until checked. Requires confirm: true, ask the user first.', 'devdome-affiliate-manager' ),
		array( 'type' => 'object', 'properties' => array_merge( array( 'old' => $str( 'The ASIN to replace (10 characters).' ), 'new' => $str( 'The replacement ASIN (10 characters).' ) ), $confirm( 'Must be true: content of every linking post is rewritten.' ) ), 'required' => array( 'old', 'new', 'confirm' ), 'additionalProperties' => false ),
		array( 'type' => 'object', 'properties' => array( 'replaced' => $bool( '' ), 'pages' => $int( 'Posts, pages and products changed.' ), 'old' => $str(), 'new' => $str(), 'new_status' => $str(), 'new_checked' => $bool( 'false when DevDome did not answer the check of the new ASIN; new_status is then the stored value.' ), 'service_state' => $str(), 'summary' => $summary_out, 'unfinished' => array( 'type' => 'array', 'items' => array( 'type' => 'integer' ), 'description' => 'Post ids an EARLIER replacement left unverified (recovery journal).' ), 'note' => $str() ) ),
		'devdaffi_ability_replace_asin', 'destroy', false );

	$reg( 'devdome-affiliate-manager/reset-bot-counter', __( 'Reset the blocked-bot counter', 'devdome-affiliate-manager' ),
		__( 'Set the count of bot clicks blocked by click protection back to zero (the Reset link next to the counter). Cannot be undone: requires confirm: true, ask the user first. Reported as done only when the counter reads zero afterwards.', 'devdome-affiliate-manager' ),
		array( 'type' => 'object', 'properties' => $confirm( 'Must be true: the counter is zeroed.' ), 'required' => array( 'confirm' ), 'additionalProperties' => false ),
		array( 'type' => 'object', 'properties' => array( 'reset' => $bool( '' ), 'bots_blocked' => $int() ) ),
		'devdaffi_ability_reset_bot_counter', 'destroy' );

	$reg( 'devdome-affiliate-manager/reset-tag-clicks', __( 'Reset the clicks of one tag or rule', 'devdome-affiliate-manager' ),
		__( 'Delete the click and unique-visitor counts recorded for one affiliate tag (by its affiliate id) or one auto-linker rule (key __rule__<rule id>), the Reset clicks icon on a row. Cannot be undone: requires confirm: true, ask the user first. Reported as done only when the row is gone afterwards.', 'devdome-affiliate-manager' ),
		array( 'type' => 'object', 'properties' => array_merge( array( 'key' => $str( 'The affiliate id of a configured tag (or the default tag), or __rule__<rule id>.' ) ), $confirm( 'Must be true: the counts of that tag or rule are deleted.' ) ), 'required' => array( 'key', 'confirm' ), 'additionalProperties' => false ),
		array( 'type' => 'object', 'properties' => array( 'reset' => $bool( '' ), 'key' => $str() ) ),
		'devdaffi_ability_reset_tag_clicks', 'destroy' );
}

/**
 * Official WordPress MCP Adapter: list our abilities as direct tools on its default server
 * (next to its discover / execute meta-tools). Harmless when the adapter is not installed.
 */
add_filter( 'mcp_adapter_default_server_config', 'devdaffi_mcp_default_server_tools' );
function devdaffi_mcp_default_server_tools( $config ) {
	if ( ! is_array( $config ) ) {
		return $config;
	}
	$tools = isset( $config['tools'] ) && is_array( $config['tools'] ) ? $config['tools'] : array();
	$config['tools'] = array_values( array_unique( array_merge( $tools, devdaffi_ability_ids() ) ) );
	return $config;
}
