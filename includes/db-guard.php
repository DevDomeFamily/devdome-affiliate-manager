<?php
/**
 * Request-wide database guard + proved option writes (DESIGN.md 24 / 24.5, suite standard since 2026-09-14).
 *
 * $wpdb reports a failed query only through last_error, and the NEXT query clears it. get_option() on a broken
 * table answers the default, so a failed read used to pass as "not connected", "setting off" or "saved". The
 * guard records every failed query as it happens (the 'query' filter at priority 1 runs inside wpdb::query()
 * BEFORE the flush), an ACTION opens a window (REST route, ability, admin page, connect handlers), inside a
 * window the option helpers refuse once a query failed and every boundary answers a database error instead of
 * "done". Outside a window (front-end tracking, cron, other plugins, the test suite) nothing changes.
 *
 * Ported from Analytics 1.1.1 includes/db-guard.php on 2026-09-16 (Affiliate Manager round 1: failed reads read as clean state).
 */

defined( 'ABSPATH' ) || exit;

$GLOBALS['devdaffi_db_guard'] = array( 'errors' => array(), 'count' => 0, 'last' => '', 'mark' => 0, 'open' => 0, 'pending' => false );

/** Clear $wpdb->last_error before a read whose empty answer must be told from a failure; records first. */
function devdaffi_db_reset_error() {
	global $wpdb;
	devdaffi_db_guard_sync();
	$GLOBALS['devdaffi_db_guard']['pending'] = false;
	if ( isset( $wpdb->last_error ) ) {
		$wpdb->last_error = '';
	}
}

/** True when the query run since devdaffi_db_reset_error() failed. */
function devdaffi_db_failed() {
	global $wpdb;
	return isset( $wpdb->last_error ) && '' !== (string) $wpdb->last_error;
}

/** Record the pending $wpdb->last_error once (internal). */
function devdaffi_db_guard_sync() {
	global $wpdb;
	$g = &$GLOBALS['devdaffi_db_guard'];
	if ( isset( $wpdb->last_error ) && '' !== (string) $wpdb->last_error && empty( $g['pending'] ) ) {
		$g['count'] = (int) $g['count'] + 1; // monotonic; the list below is diagnostic and capped
		$g['last']  = (string) $wpdb->last_error;
		if ( count( $g['errors'] ) < 50 ) {
			$g['errors'][] = (string) $wpdb->last_error;
		}
		$g['pending'] = true;
	}
}

/** 'query' filter (priority 1): the previous query's error is recorded before wpdb::query() flushes it. */
function devdaffi_db_guard_record( $query ) {
	devdaffi_db_guard_sync();
	$GLOBALS['devdaffi_db_guard']['pending'] = false;
	return $query;
}

/** Open a guard window. Nested windows share the outer list; only the outermost begin() clears it. */
function devdaffi_db_guard_begin() {
	global $wpdb;
	devdaffi_db_guard_sync();
	$g = &$GLOBALS['devdaffi_db_guard'];
	$g['open'] = (int) $g['open'] + 1;
	if ( 1 === $g['open'] ) {
		$g['errors']  = array();
		$g['count']   = 0;
		$g['last']    = '';
		$g['mark']    = 0;
		$g['pending'] = false;
		if ( isset( $wpdb->last_error ) ) {
			$wpdb->last_error = ''; // an error from before this action is not this action's
		}
	}
}

function devdaffi_db_guard_end() {
	$g = &$GLOBALS['devdaffi_db_guard'];
	$g['open'] = max( 0, (int) $g['open'] - 1 );
}

function devdaffi_db_guard_open() {
	return (int) $GLOBALS['devdaffi_db_guard']['open'] > 0;
}

/** Move the mark to now: errors before it are handled. */
function devdaffi_db_guard_rebase() {
	devdaffi_db_guard_sync();
	$GLOBALS['devdaffi_db_guard']['mark'] = (int) $GLOBALS['devdaffi_db_guard']['count'];
}

/** True when a query failed since the mark. */
function devdaffi_db_guard_failed() {
	devdaffi_db_guard_sync();
	$g = $GLOBALS['devdaffi_db_guard'];
	return (int) $g['count'] > (int) $g['mark'];
}

/** True when a window is open AND a query failed since its mark: writes and boundaries refuse on this. */
function devdaffi_db_guard_active() {
	return devdaffi_db_guard_open() && devdaffi_db_guard_failed();
}

function devdaffi_db_guard_error() {
	devdaffi_db_guard_sync();
	return (string) $GLOBALS['devdaffi_db_guard']['last'];
}

/** Mask this site's secrets in any text that leaves the site (guard messages, error reports). */
function devdaffi_redact( $text ) {
	$text = preg_replace( '/[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}/', '<email>', (string) $text ); // an e-mail inside a failed query never leaves the site (round 4)
	foreach ( array( 'devdcorev1_site_token' ) as $opt ) {
		$v = (string) get_option( $opt, '' );
		if ( strlen( $v ) >= 8 ) {
			$text = str_replace( $v, '[redacted]', $text );
		}
	}
	// Absolute server paths are a fingerprint of the host (round 7); URL paths keep their "://" prefix and stay.
	if ( defined( 'ABSPATH' ) && '' !== (string) ABSPATH && false !== strpos( $text, (string) ABSPATH ) ) {
		$text = str_replace( (string) ABSPATH, '<site>/', $text );
	}
	$text = preg_replace( '~(?<![\w:/.])(?:/[A-Za-z0-9._-]+){2,}/?~', '<path>', $text );
	$text = preg_replace( '~(?<![\w])[A-Za-z]:[\\\\/][^\s"\'<>]*~', '<path>', $text ); // both separators (round 8)
	return $text;
}

/** The one text every boundary uses. */
function devdaffi_db_guard_message() {
	$err = devdaffi_redact( devdaffi_db_guard_error() ); // redact BEFORE the cut: a query inside the error can carry a credential
	return 'A database query failed during this action' . ( '' !== $err ? ' (' . ( function_exists( 'mb_substr' ) ? mb_substr( $err, 0, 160 ) : substr( $err, 0, 160 ) ) . ')' : '' ) . '. The result is not trusted and nothing more was changed: reload the page and check the current state before trying again.';
}

/** REST boundary: the ONE success answer. A failed window answers a 500 WP_Error instead. */
function devdaffi_rest_success( $data ) {
	if ( devdaffi_db_guard_active() ) {
		return new WP_Error( 'devdaffi_db_error', devdaffi_db_guard_message(), array( 'status' => 500 ) );
	}
	return rest_ensure_response( $data );
}

/** Wrap a REST callback in a guard window. */
function devdaffi_rest_guarded( $cb ) {
	return function ( $req ) use ( $cb ) {
		devdaffi_db_guard_begin();
		try {
			$r = call_user_func( $cb, $req );
			if ( devdaffi_db_guard_active() && ( ! is_wp_error( $r ) || 'devdaffi_db_error' !== $r->get_error_code() ) ) { // a failed window is a database error, never a request mistake (rounds 2-3)
				return new WP_Error( 'devdaffi_db_error', devdaffi_db_guard_message(), array( 'status' => 500 ) );
			}
			return $r;
		} finally {
			devdaffi_db_guard_end();
		}
	};
}

/*
 * OPTION WRITES ARE PROVED, NOT ASSUMED (DESIGN.md 24.5). update_option() answers false for "unchanged" and
 * "failed" alike. These write, read the ROW back past the option cache and answer true only when the stored value
 * is the one written (or gone, for a delete). Inside a failed guard window they refuse.
 */

/** @return array{0:bool,1:mixed}|false [found, value] straight from the options table, false when the read failed. */
function devdaffi_option_row( $key ) {
	global $wpdb;
	devdaffi_db_reset_error();
	// get_row(), not get_var(): wpdb::get_var() answers null for an EMPTY value as well as for a missing row
	// (Codex round 1), so a written false / '' would read as "not there" and every such write would fail its proof.
	$row = $wpdb->get_row( $wpdb->prepare( "SELECT option_value FROM {$wpdb->options} WHERE option_name = %s LIMIT 1", (string) $key ), ARRAY_A ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- the point is to read past the option cache
	if ( devdaffi_db_failed() ) {
		return false;
	}
	if ( ! is_array( $row ) || ! array_key_exists( 'option_value', $row ) ) {
		return array( false, null );
	}
	return array( true, maybe_unserialize( $row['option_value'] ) );
}

/** Loose equality across the serialize round trip. */
/**
 * One shape for both sides of a proof: bools become '1' / '', numbers become strings, null STAYS null, arrays recurse.
 * The old loose == compared null with 0 as equal (Admin Cleaner round 2, 2026-09-15: a rejected write whose row still
 * held null "proved" a write of 0), so nothing here is loose.
 */
function devdaffi_option_norm( $v ) {
	if ( is_array( $v ) ) {
		$out = array();
		foreach ( $v as $k => $item ) {
			$out[ (string) $k ] = devdaffi_option_norm( $item );
		}
		return $out;
	}
	if ( is_object( $v ) ) {
		return devdaffi_option_norm( get_object_vars( $v ) );
	}
	if ( null === $v ) {
		return null;
	}
	if ( is_bool( $v ) ) {
		return $v ? '1' : '';
	}
	return (string) $v;
}

/** Equality across the serialize round trip, strict on null vs 0 vs ''. */
function devdaffi_option_same( $stored, $value ) {
	return devdaffi_option_norm( $stored ) === devdaffi_option_norm( $value );
}

/** @return bool true only when the row holds $value afterwards. */
function devdaffi_option_write( $key, $value ) {
	if ( devdaffi_db_guard_active() ) {
		return false;
	}
	update_option( $key, $value );
	$row = devdaffi_option_row( $key );
	return is_array( $row ) && $row[0] && devdaffi_option_same( $row[1], $value );
}

/** @return bool true only when no row for $key exists afterwards (a read that failed is not "gone"). */
function devdaffi_option_delete( $key ) {
	if ( devdaffi_db_guard_active() ) {
		return false;
	}
	delete_option( $key );
	$row = devdaffi_option_row( $key );
	return is_array( $row ) && ! $row[0];
}
