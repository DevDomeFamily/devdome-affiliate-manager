<?php
/**
 * Link Scanner — indexes Amazon product links (ASINs) found in site content so
 * the Link Radar can report "X links across Y pages". No external API.
 *
 * Index table {prefix}devdaffi_index keyed UNIQUE(asin, post_id). Kept fresh
 * by live watchers (save/delete) and a frequency-gated daily cron.
 */

defined( 'ABSPATH' ) || exit;

// phpcs:disable WordPress.DB.DirectDatabaseQuery, WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.PreparedSQLPlaceholders.UnfinishedPrepare, PluginCheck.Security.DirectDB.UnescapedDBParameter -- Custom plugin table: name is constant ($wpdb->prefix); user values use $wpdb->prepare(). False positives for dedicated custom-table access.

class DEVDAFFI_Scanner {

	const DB_VERSION = '2';
	const DB_OPTION  = 'devdaffi_index_db';
	const LAST_SCAN  = 'devdaffi_last_scan'; // unix ts of the last full scan
	const CRON_HOOK  = 'devdaffi_scan_cron';
	const MAX_POSTS  = 20000; // safety bound for a single full scan

	public function __construct() {
		add_action( 'save_post', array( __CLASS__, 'on_save' ), 20, 1 );
		add_action( 'before_delete_post', array( __CLASS__, 'delete_by_post' ) );
		add_action( 'wp_trash_post', array( __CLASS__, 'delete_by_post' ) );
		add_action( self::CRON_HOOK, array( __CLASS__, 'maybe_cron_scan' ) );
	}

	public static function table() {
		global $wpdb;
		return $wpdb->prefix . 'devdaffi_index';
	}

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
				id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
				asin varchar(20) NOT NULL,
				domain varchar(20) NOT NULL DEFAULT 'amazon.com',
				post_id bigint(20) unsigned NOT NULL,
				last_seen datetime DEFAULT NULL,
				PRIMARY KEY  (id),
				UNIQUE KEY asin_post (asin, post_id),
				KEY post_id (post_id)
			) $charset;"
		);
		update_option( self::DB_OPTION, self::DB_VERSION );
	}

	public static function schedule_cron() {
		// Hourly tick so sub-24h scan frequencies are actually evaluated; maybe_cron_scan()
		// itself gates on the configured frequency, so the tick is cheap when not due.
		if ( 'hourly' !== wp_get_schedule( self::CRON_HOOK ) ) {
			wp_clear_scheduled_hook( self::CRON_HOOK ); // reschedule if it was the old 'daily' event
			wp_schedule_event( time() + HOUR_IN_SECONDS, 'hourly', 'devdaffi_scan_cron' );
		}
	}

	public static function unschedule_cron() {
		wp_clear_scheduled_hook( self::CRON_HOOK );
	}

	/** ASIN regex across Amazon storefront URL shapes. Group 1 = TLD, group 2 = ASIN. */
	private static function pattern() {
		return '#https?://(?:[a-z0-9-]+\.)?amazon\.([a-z.]{2,7})/(?:[^"\'\s]*?/)?(?:dp|gp/product|gp/aw/d|exec/obidos/ASIN|o/ASIN)/([A-Z0-9]{10})#i';
	}

	/** Pull ASIN => marketplace domain out of a blob of content. */
	private static function extract( $content ) {
		if ( '' === $content || false === stripos( $content, 'amazon.' ) ) {
			return array();
		}
		if ( ! preg_match_all( self::pattern(), $content, $m, PREG_SET_ORDER ) ) {
			return array();
		}
		$out = array();
		foreach ( $m as $match ) {
			$asin = strtoupper( $match[2] );
			if ( ! isset( $out[ $asin ] ) ) {
				$out[ $asin ] = 'amazon.' . strtolower( $match[1] );
			}
		}
		return $out;
	}

	/**
	 * ASIN + Amazon store domain from a single URL. A real amazon.<tld> link keeps its
	 * store (e.g. amazon.co.uk → amazon.co.uk); a redirect/affiliate link that only embeds
	 * the ASIN (e.g. fitnesswares.com/i/ASIN) has no store in it, so it defaults to
	 * amazon.com — where the WooCommerce button rewrite sends those clicks.
	 * @return array{0:string,1:string}|null [asin, domain]
	 */
	private static function asin_from_url( $url ) {
		if ( preg_match( '#https?://(?:[a-z0-9-]+\.)?amazon\.([a-z.]{2,7})/(?:[^"\'\s]*?/)?(?:dp|gp/product|gp/aw/d|exec/obidos/ASIN|o/ASIN)/([A-Z0-9]{10})#i', (string) $url, $m ) ) {
			return array( strtoupper( $m[2] ), 'amazon.' . strtolower( $m[1] ) );
		}
		if ( preg_match( '#/(?:i|dp|gp/product)/([A-Z0-9]{10})#i', (string) $url, $m ) ) {
			return array( strtoupper( $m[1] ), 'amazon.com' );
		}
		return null;
	}

	/** Re-index one post: clear its rows, insert current ASINs. */
	public static function scan_post( $post_id ) {
		$post_id = (int) $post_id;
		$post    = get_post( $post_id );
		if ( ! $post ) {
			return 0;
		}
		self::delete_by_post( $post_id );

		if ( 'publish' !== $post->post_status ) {
			return 0;
		}
		$asins = self::extract( (string) $post->post_content );

		// WooCommerce external/affiliate product: its Amazon link lives in the _product_url
		// meta (the button), not the content. Index the ASIN behind it.
		if ( 'product' === $post->post_type ) {
			$hit = self::asin_from_url( (string) get_post_meta( $post_id, '_product_url', true ) );
			if ( $hit && ! isset( $asins[ $hit[0] ] ) ) {
				$asins[ $hit[0] ] = $hit[1];
			}
		}

		if ( empty( $asins ) ) {
			return 0;
		}

		global $wpdb;
		$table = self::table();
		$now   = current_time( 'mysql', true );
		foreach ( $asins as $asin => $domain ) {
			// phpcs:ignore WordPress.DB.DirectDatabaseQuery, WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- prepared values; constant table.
			$wpdb->query( $wpdb->prepare(
				"INSERT IGNORE INTO $table (asin, domain, post_id, last_seen) VALUES (%s, %s, %d, %s)",
				$asin,
				$domain,
				$post_id,
				$now
			) );
		}
		return count( $asins );
	}

	public static function delete_by_post( $post_id ) {
		global $wpdb;
		$wpdb->delete( self::table(), array( 'post_id' => (int) $post_id ), array( '%d' ) );
	}

	/** save_post watcher (skips autosave/revision). */
	public static function on_save( $post_id ) {
		if ( wp_is_post_autosave( $post_id ) || wp_is_post_revision( $post_id ) ) {
			return;
		}
		self::scan_post( $post_id );
	}

	/** Full rebuild — only touches posts whose content mentions amazon. */
	public static function full_scan() {
		global $wpdb;
		$table      = self::table();
		// Marker to prune rows this scan doesn't refresh. We deliberately do NOT TRUNCATE up front:
		// scan_post() is per-post idempotent (it deletes the post's rows then re-inserts), so a crash
		// mid-scan now leaves the previous index intact instead of wiping it and rebuilding from empty.
		$scan_start = current_time( 'mysql', true );

		$types = array_merge( array( 'post', 'page' ), post_type_exists( 'product' ) ? array( 'product' ) : array() );
		$in    = "'" . implode( "','", array_map( 'esc_sql', $types ) ) . "'";

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery, WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- LIKE is escaped; ids only.
		$ids = $wpdb->get_col( $wpdb->prepare(
			"SELECT ID FROM {$wpdb->posts}
			 WHERE post_status = 'publish' AND post_type IN ($in)
			   AND post_content LIKE %s
			 ORDER BY ID DESC LIMIT %d",
			'%amazon.%',
			self::MAX_POSTS
		) );

		// External/affiliate products carry their Amazon ASIN in the _product_url meta, not
		// the content — so the amazon-in-content filter above skips them. Add them by meta.
		if ( post_type_exists( 'product' ) ) {
			// phpcs:ignore WordPress.DB.DirectDatabaseQuery, WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- core tables; id-only.
			$ext = $wpdb->get_col( $wpdb->prepare(
				"SELECT p.ID FROM {$wpdb->posts} p
				 INNER JOIN {$wpdb->postmeta} m ON m.post_id = p.ID AND m.meta_key = '_product_url'
				 WHERE p.post_status = 'publish' AND p.post_type = 'product' AND m.meta_value != ''
				 ORDER BY p.ID DESC LIMIT %d",
				self::MAX_POSTS
			) );
			$ids = array_unique( array_merge( (array) $ids, (array) $ext ) );
		}

		foreach ( $ids as $id ) {
			self::scan_post( (int) $id );
		}
		// Only AFTER a full pass, drop rows for posts this scan didn't touch (no longer mention
		// Amazon / unpublished / deleted). scan_post refreshes last_seen on every row it re-inserts,
		// so anything older than this run's start marker is stale.
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery, WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- constant table; prepared value.
		$wpdb->query( $wpdb->prepare( "DELETE FROM $table WHERE last_seen < %s", $scan_start ) );
		update_option( self::LAST_SCAN, time(), false );
		return self::get_stats();
	}

	/**
	 * Bulk-replace one ASIN with another everywhere it appears — across every page/product
	 * that links it (content links + WooCommerce _product_url). The swap is SURGICAL: it only
	 * changes the 10-char ASIN that sits inside an Amazon/redirect URL path (…/dp/OLD, …/i/OLD),
	 * never plain text, so nothing else breaks. Re-indexes each touched post. Use case: a dead
	 * ASIN whose product moved to a new ASIN, or pointing all links to a similar replacement —
	 * fix 1 or 100 pages in one click instead of editing each by hand.
	 *
	 * @return array{ok:bool,pages:int,old:string,new:string}
	 */
	public static function replace_asin( $old, $new ) {
		$old = strtoupper( preg_replace( '/[^A-Za-z0-9]/', '', (string) $old ) );
		$new = strtoupper( preg_replace( '/[^A-Za-z0-9]/', '', (string) $new ) );
		if ( 10 !== strlen( $old ) || 10 !== strlen( $new ) || $old === $new ) {
			return array( 'ok' => false, 'pages' => 0, 'old' => $old, 'new' => $new );
		}

		global $wpdb;
		$table = self::table();
		// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery -- constant table; prepared value.
		$post_ids = $wpdb->get_col( $wpdb->prepare( "SELECT DISTINCT post_id FROM $table WHERE asin = %s", $old ) );

		// Only swap the ASIN when it sits in an Amazon/redirect URL path segment.
		$re    = '#(/(?:i|dp|gp/product|gp/aw/d|exec/obidos/ASIN|o/ASIN)/)' . preg_quote( $old, '#' ) . '(?![A-Z0-9])#i';
		$count = 0;
		foreach ( (array) $post_ids as $pid ) {
			$pid     = (int) $pid;
			$changed = false;

			$post = get_post( $pid );
			if ( $post ) {
				$nc = preg_replace( $re, '${1}' . $new, (string) $post->post_content );
				if ( null !== $nc && $nc !== $post->post_content ) {
					wp_update_post( array( 'ID' => $pid, 'post_content' => $nc ) );
					$changed = true;
				}
			}

			$purl = get_post_meta( $pid, '_product_url', true );
			if ( $purl ) {
				$np = preg_replace( $re, '${1}' . $new, (string) $purl );
				if ( null !== $np && $np !== $purl ) {
					update_post_meta( $pid, '_product_url', $np );
					$changed = true;
				}
			}

			if ( $changed ) {
				self::scan_post( $pid ); // re-index: old ASIN rows out for this post, new ASIN in
				++$count;
			}
		}

		// The old ASIN is no longer referenced anywhere → drop its stale monitor status.
		$status = DEVDAFFI_Monitor::table();
		// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery -- constant table; prepared value.
		$wpdb->query( $wpdb->prepare( "DELETE FROM $status WHERE asin = %s", $old ) );

		return array( 'ok' => true, 'pages' => $count, 'old' => $old, 'new' => $new );
	}

	/** Daily cron: full-scan only when auto-scan is on and scan_frequency days elapsed. */
	public static function maybe_cron_scan() {
		$settings = DEVDAFFI_Settings::get();
		if ( empty( $settings['scan_auto'] ) ) {
			return; // auto-scan disabled — manual scans only
		}
		$freq = (int) $settings['scan_frequency'];
		if ( $freq < 1 ) {
			$freq = 7;
		}
		$unit_secs = ( 'hours' === ( $settings['scan_frequency_unit'] ?? 'days' ) ) ? HOUR_IN_SECONDS : DAY_IN_SECONDS;
		$last = (int) get_option( self::LAST_SCAN, 0 );
		if ( time() - $last >= $freq * $unit_secs ) {
			self::full_scan();
		}
	}

	/** @return array{links:int,pages:int,last_scan:int} */
	public static function get_stats() {
		global $wpdb;
		$table = self::table();
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery, WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- constant table, no input.
		$row = $wpdb->get_row( "SELECT COUNT(*) AS links, COUNT(DISTINCT post_id) AS pages FROM $table", ARRAY_A );
		return array(
			'links'     => $row ? (int) $row['links'] : 0,
			'pages'     => $row ? (int) $row['pages'] : 0,
			'last_scan' => (int) get_option( self::LAST_SCAN, 0 ),
		);
	}
}
