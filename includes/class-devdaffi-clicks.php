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
		update_option( self::DB_OPTION, self::DB_VERSION );
	}

	/** Increment a tag's click counter (atomic), plus its UNIQUE-visitor counter when this
	 *  request is a new visitor for that tag — deduped via an IP+UA fingerprint (no cookie).
	 *  The reserved bot counter is a running total and never dedups. */
	public static function record( $tag ) {
		$tag = preg_replace( '/[^a-zA-Z0-9\-_.]/', '', (string) $tag );
		if ( '' === $tag ) {
			return;
		}
		$new_visitor = self::is_new_visitor( $tag ) ? 1 : 0;
		global $wpdb;
		$table = self::table();
		// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery -- $table is a prefix-derived constant; values are prepared.
		$wpdb->query( $wpdb->prepare(
			"INSERT INTO $table (tag, clicks, visitors, last_click) VALUES (%s, 1, %d, %s)
			 ON DUPLICATE KEY UPDATE clicks = clicks + 1, visitors = visitors + %d, last_click = VALUES(last_click)",
			$tag,
			$new_visitor,
			current_time( 'mysql', true ), // GMT
			$new_visitor
		) );
	}

	/** Is this request a new unique visitor for $tag (within the ~session window)? */
	private static function is_new_visitor( $tag ) {
		if ( self::BOTS_KEY === $tag ) {
			return false;
		}
		$ip  = isset( $_SERVER['HTTP_CF_CONNECTING_IP'] ) ? sanitize_text_field( wp_unslash( $_SERVER['HTTP_CF_CONNECTING_IP'] ) )
			: ( isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '' );
		$ua  = isset( $_SERVER['HTTP_USER_AGENT'] ) ? sanitize_text_field( wp_unslash( $_SERVER['HTTP_USER_AGENT'] ) ) : '';
		$sid = md5( $ip . '|' . $ua );
		$key = 'devdaffi_uv_' . md5( $tag . '|' . $sid );
		if ( false === get_transient( $key ) ) {
			set_transient( $key, 1, 30 * MINUTE_IN_SECONDS );
			return true;
		}
		return false;
	}

	/** Drop click rows whose tag is no longer used by any configured tag. */
	public static function prune( array $keep ) {
		global $wpdb;
		$table = self::table();
		$keep  = array_values( array_unique( array_filter( array_map( 'strval', $keep ) ) ) );

		if ( empty( $keep ) ) {
			// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery -- constant table name, no input.
			$wpdb->query( "DELETE FROM $table" );
			return;
		}
		$placeholders = implode( ',', array_fill( 0, count( $keep ), '%s' ) );
		// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery -- placeholders/values are prepared; table is constant.
		$wpdb->query( $wpdb->prepare( "DELETE FROM $table WHERE tag NOT IN ($placeholders)", $keep ) );
	}

	/** @return int total bot clicks blocked by Click Protection. */
	public static function get_bots_blocked() {
		global $wpdb;
		$table = self::table();
		// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery -- $table is a prefix-derived constant; value is prepared.
		return (int) $wpdb->get_var( $wpdb->prepare( "SELECT clicks FROM $table WHERE tag = %s", self::BOTS_KEY ) );
	}

	/** Reset the blocked-bot counter to zero. */
	public static function reset_bots_blocked() {
		global $wpdb;
		$table = self::table();
		// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery -- $table is a prefix-derived constant; value is prepared.
		$wpdb->query( $wpdb->prepare( "DELETE FROM $table WHERE tag = %s", self::BOTS_KEY ) );
	}

	/** @return array<string,int> affiliate_id => click count. */
	public static function get_all() {
		global $wpdb;
		$table = self::table();
		// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery -- $table is a prefix-derived constant; no user input.
		$rows = $wpdb->get_results( "SELECT tag, clicks FROM $table", ARRAY_A );
		$out  = array();
		if ( $rows ) {
			foreach ( $rows as $r ) {
				$out[ $r['tag'] ] = (int) $r['clicks'];
			}
		}
		return $out;
	}

	/** @return array<string,int> affiliate_id => UNIQUE-visitor count. */
	public static function get_visitors() {
		global $wpdb;
		$table = self::table();
		// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery -- $table is a prefix-derived constant; no user input.
		$rows = $wpdb->get_results( "SELECT tag, visitors FROM $table", ARRAY_A );
		$out  = array();
		if ( $rows ) {
			foreach ( $rows as $r ) {
				$out[ $r['tag'] ] = (int) $r['visitors'];
			}
		}
		return $out;
	}
}
