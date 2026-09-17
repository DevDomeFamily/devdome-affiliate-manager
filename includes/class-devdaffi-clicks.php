<?php
/**
 * Click tracking — counts affiliate clicks per tag, recorded by /go on each
 * redirect. Uses a dedicated table with an atomic upsert so concurrent clicks
 * never race/undercount.
 */

defined( 'ABSPATH' ) || exit;

// phpcs:disable WordPress.DB.DirectDatabaseQuery, WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.PreparedSQLPlaceholders.UnfinishedPrepare, PluginCheck.Security.DirectDB.UnescapedDBParameter -- Custom plugin table: name is constant ($wpdb->prefix); user values use $wpdb->prepare(). False positives for dedicated custom-table access.

class DEVDAFFI_Clicks {

	const DB_VERSION = '2';
	const DB_OPTION  = 'devdaffi_clicks_db';

	/** Reserved row key: running count of bot clicks blocked by Click Protection. */
	const BOTS_KEY = '__bots_blocked__';

	public static function table() {
		global $wpdb;
		return $wpdb->prefix . 'devdaffi_clicks';
	}

	/** Create/upgrade the table. Idempotent; cheap no-op once installed. */
	public static function ensure_table() {
		if ( self::DB_VERSION === get_option( self::DB_OPTION ) ) {
			return;
		}
		global $wpdb;
		$table   = self::table();
		$charset = $wpdb->get_charset_collate();
		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta(
			"CREATE TABLE $table (
				tag varchar(64) NOT NULL,
				clicks bigint(20) unsigned NOT NULL DEFAULT 0,
				visitors bigint(20) unsigned NOT NULL DEFAULT 0,
				last_click datetime DEFAULT NULL,
				PRIMARY KEY  (tag)
			) $charset;"
		);
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery -- schema check
		if ( $table === $wpdb->get_var( $wpdb->prepare( 'SHOW TABLES LIKE %s', $table ) ) ) {
			update_option( self::DB_OPTION, self::DB_VERSION ); // only when the table is really there (round 1)
		}
	}

	/** Increment a tag's click counter (atomic), plus its UNIQUE-visitor counter when this
	 *  request is a new visitor for that tag — deduped via an IP+UA fingerprint (no cookie).
	 *  The reserved bot counter is a running total and never dedups. */
	public static function record( $tag ) {
		$tag = preg_replace( '/[^a-zA-Z0-9\-_.]/', '', (string) $tag );
		if ( '' === $tag ) {
			return false;
		}
		$new_visitor = self::is_new_visitor( $tag ) ? 1 : 0;
		global $wpdb;
		$table = self::table();
		// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery -- $table is a prefix-derived constant; values are prepared.
		devdaffi_db_reset_error();
		$wpdb->query( $wpdb->prepare(
			"INSERT INTO $table (tag, clicks, visitors, last_click) VALUES (%s, 1, %d, %s)
			 ON DUPLICATE KEY UPDATE clicks = clicks + 1, visitors = visitors + %d, last_click = VALUES(last_click)",
			$tag,
			$new_visitor,
			current_time( 'mysql', true ), // GMT
			$new_visitor
		) );
		return ! devdaffi_db_failed(); // round 2: a lost click is at least visible to the caller
	}

	/** Is this request a new unique visitor for $tag (within the ~session window)? */
	private static function is_new_visitor( $tag ) {
		if ( self::BOTS_KEY === $tag ) {
			return false;
		}
		$ip  = class_exists( 'DEVDAFFI_Go' ) ? DEVDAFFI_Go::limiter_ip() : ( isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '' ); // CF header only from a Cloudflare edge (round 5)
		$ua  = isset( $_SERVER['HTTP_USER_AGENT'] ) ? sanitize_text_field( wp_unslash( $_SERVER['HTTP_USER_AGENT'] ) ) : '';
		$sid = md5( $ip . '|' . $ua );
		$key = 'devdaffi_uv_' . md5( $tag . '|' . $sid );
		if ( false === get_transient( $key ) ) {
			set_transient( $key, 1, 30 * MINUTE_IN_SECONDS );
			return true;
		}
		return false;
	}

	/** Drop click rows whose tag is no longer used by any configured tag. @return bool false when the delete failed (round 1). */
	public static function prune( array $keep ) {
		global $wpdb;
		$table = self::table();
		$keep[] = self::BOTS_KEY; // the blocked-bot counter is never pruned, whatever the caller passed (round 2)
		$keep   = array_values( array_unique( array_filter( array_map( 'strval', $keep ) ) ) );
		devdaffi_db_reset_error();
		if ( empty( $keep ) ) {
			// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery -- constant table name, no input.
			$r = $wpdb->query( "DELETE FROM $table" );
			return false !== $r && ! devdaffi_db_failed();
		}
		$placeholders = implode( ',', array_fill( 0, count( $keep ), '%s' ) );
		// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery -- placeholders/values are prepared; table is constant.
		$r = $wpdb->query( $wpdb->prepare( "DELETE FROM $table WHERE tag NOT IN ($placeholders)", $keep ) );
		return false !== $r && ! devdaffi_db_failed();
	}

	/** @return int|null total bot clicks blocked by Click Protection; null when the read failed (round 1: a failed SELECT is not 0). */
	public static function get_bots_blocked() {
		global $wpdb;
		$table = self::table();
		devdaffi_db_reset_error();
		// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery -- $table is a prefix-derived constant; value is prepared.
		$v = $wpdb->get_var( $wpdb->prepare( "SELECT clicks FROM $table WHERE tag = %s", self::BOTS_KEY ) );
		if ( devdaffi_db_failed() ) {
			return null;
		}
		return (int) $v;
	}

	/** Delete one click row (a tag's affiliate id or __rule__<id>). @return bool true when the row is gone afterwards (round 1: the screen's Reset clicks was local-only). */
	public static function reset_key( $key ) {
		global $wpdb;
		$key = preg_replace( '/[^a-zA-Z0-9\-_.]/', '', (string) $key );
		if ( '' === $key || self::BOTS_KEY === $key ) {
			return false;
		}
		$table = self::table();
		devdaffi_db_reset_error();
		// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery -- constant table; prepared value.
		$wpdb->query( $wpdb->prepare( "DELETE FROM $table WHERE tag = %s", $key ) );
		if ( devdaffi_db_failed() ) {
			return false;
		}
		devdaffi_db_reset_error();
		// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery -- constant table; prepared value.
		$left = $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(*) FROM $table WHERE tag = %s", $key ) );
		return ! devdaffi_db_failed() && null !== $left && 0 === (int) $left;
	}

	/** Reset the blocked-bot counter to zero. @return bool false when the delete failed (round 4); callers read the counter back too. */
	public static function reset_bots_blocked() {
		global $wpdb;
		$table = self::table();
		devdaffi_db_reset_error();
		// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery -- $table is a prefix-derived constant; value is prepared.
		$r = $wpdb->query( $wpdb->prepare( "DELETE FROM $table WHERE tag = %s", self::BOTS_KEY ) );
		return false !== $r && ! devdaffi_db_failed();
	}

	/** @return array<string,int>|null affiliate_id => click count; null when the read failed (round 1). */
	public static function get_all() {
		global $wpdb;
		$table = self::table();
		devdaffi_db_reset_error();
		// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery -- $table is a prefix-derived constant; no user input.
		$rows = $wpdb->get_results( "SELECT tag, clicks FROM $table", ARRAY_A );
		if ( devdaffi_db_failed() || null === $rows ) {
			return null;
		}
		$out  = array();
		if ( $rows ) {
			foreach ( $rows as $r ) {
				$out[ $r['tag'] ] = (int) $r['clicks'];
			}
		}
		return $out;
	}

	/** @return array<string,int>|null affiliate_id => UNIQUE-visitor count; null when the read failed (round 1). */
	public static function get_visitors() {
		global $wpdb;
		$table = self::table();
		devdaffi_db_reset_error();
		// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery -- $table is a prefix-derived constant; no user input.
		$rows = $wpdb->get_results( "SELECT tag, visitors FROM $table", ARRAY_A );
		if ( devdaffi_db_failed() || null === $rows ) {
			return null;
		}
		$out  = array();
		if ( $rows ) {
			foreach ( $rows as $r ) {
				$out[ $r['tag'] ] = (int) $r['visitors'];
			}
		}
		return $out;
	}
}
