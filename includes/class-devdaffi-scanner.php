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
	const JOURNAL    = 'devdaffi_replace_journal'; // originals of posts a replacement is rewriting (round 3)
	const LOCK       = 'devdaffi_replace_lock';    // one replacement at a time (round 7)
	private static $lock_owner   = '';             // this run's lock owner while a replacement runs (round 8)
	private static $lock_touched = 0;              // when the lease was last renewed (round 9)

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
		if ( self::table_exists() ) {
			update_option( self::DB_OPTION, self::DB_VERSION ); // the version marker only when the table is really there (round 1)
		}
	}

	public static function table_exists() {
		global $wpdb;
		$t = self::table();
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery -- schema check
		return $t === $wpdb->get_var( $wpdb->prepare( 'SHOW TABLES LIKE %s', $t ) );
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
		return '#https?://(' . self::storefront_alt() . ')/(?:[^"\'\s<?\#]*?/)?(?:dp|gp/product|gp/aw/d|exec/obidos/ASIN|o/ASIN)/([A-Z0-9]{10})(?![A-Z0-9])#i'; // supported storefronts only (round 7)
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
				$out[ $asin ] = DEVDAFFI_Rewriter::storefront_domain( strtolower( $match[1] ) );
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
		if ( preg_match( '#https?://(' . self::storefront_alt() . ')/(?:[^"\'\s<?\#]*?/)?(?:dp|gp/product|gp/aw/d|exec/obidos/ASIN|o/ASIN)/([A-Z0-9]{10})(?![A-Z0-9])#i', (string) $url, $m ) ) {
			return array( strtoupper( $m[2] ), DEVDAFFI_Rewriter::storefront_domain( strtolower( $m[1] ) ) ); // supported storefronts only (round 7)
		}
		// A store-less redirect form (/i/ASIN, /dp/ASIN) counts only on THIS site's host (round 5: any other host with a
		// /dp/ path is not an Amazon link and must never be indexed or rewritten).
		$own  = self::own_host();
		$host = strtolower( (string) wp_parse_url( (string) $url, PHP_URL_HOST ) );
		if ( '' !== $own && $host === $own && preg_match( '#/(?:i|dp|gp/product)/([A-Z0-9]{10})(?![A-Z0-9])#i', (string) wp_parse_url( (string) $url, PHP_URL_PATH ), $m ) ) {
			return array( strtoupper( $m[1] ), 'amazon.com' );
		}
		return null;
	}

	/** Regex alternation of the supported storefront hosts (with optional subdomain), e.g. (?:[a-z0-9-]+\\.)?(?:amazon\\.com|amazon\\.co\\.uk|...) (round 7). */
	public static function storefront_alt() {
		$q = array();
		foreach ( DEVDAFFI_Settings::DOMAINS as $d ) {
			$q[] = preg_quote( $d, '#' );
		}
		return '(?:[a-z0-9-]+\\.)?(?:' . implode( '|', $q ) . ')';
	}

	/** This site's own host, lowercased ('' when unknown). */
	public static function own_host() {
		return strtolower( (string) wp_parse_url( home_url(), PHP_URL_HOST ) );
	}

	/** Re-index one post: clear its rows, insert current ASINs. */
	/** @return int|false the number of ASINs indexed, or false when a delete or insert did not land (round 5: every query is checked, not the last one). */
	public static function scan_post( $post_id ) {
		$post_id = (int) $post_id;
		$post    = get_post( $post_id );
		if ( ! $post ) {
			return 0;
		}
		if ( ! self::delete_by_post( $post_id ) ) {
			return false;
		}

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
		$ok = true;
		foreach ( $asins as $asin => $domain ) {
			devdaffi_db_reset_error();
			// phpcs:ignore WordPress.DB.DirectDatabaseQuery, WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- prepared values; constant table.
			$r = $wpdb->query( $wpdb->prepare(
				"INSERT IGNORE INTO $table (asin, domain, post_id, last_seen) VALUES (%s, %s, %d, %s)",
				$asin,
				$domain,
				$post_id,
				$now
			) );
			if ( false === $r || devdaffi_db_failed() ) {
				$ok = false;
			}
		}
		return $ok ? count( $asins ) : false;
	}

	/** @return bool false when the delete did not land (round 5). */
	public static function delete_by_post( $post_id ) {
		global $wpdb;
		devdaffi_db_reset_error();
		$r = $wpdb->delete( self::table(), array( 'post_id' => (int) $post_id ), array( '%d' ) );
		return false !== $r && ! devdaffi_db_failed();
	}

	/** save_post watcher (skips autosave/revision). */
	public static function on_save( $post_id ) {
		if ( wp_is_post_autosave( $post_id ) || wp_is_post_revision( $post_id ) ) {
			return;
		}
		self::scan_post( $post_id );
	}

	/**
	 * Full rebuild — only touches posts whose content mentions amazon. Honest about its own limits (round 1): a
	 * failed source read or a failed insert aborts BEFORE the prune (the previous index stays), and a site with more
	 * matching posts than MAX_POSTS is scanned in part and never pruned.
	 * @return array{links:int,pages:int,last_scan:int,ok:bool,partial:bool,error?:string}
	 */
	public static function full_scan() {
		global $wpdb;
		$table      = self::table();
		devdaffi_db_reset_error();
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
		if ( devdaffi_db_failed() || null === $ids ) {
			return array_merge( self::get_stats(), array( 'ok' => false, 'partial' => false, 'error' => 'The post list could not be read; the index was left as it was.' ) );
		}

		// External/affiliate products carry their Amazon ASIN in the _product_url meta, not
		// the content — so the amazon-in-content filter above skips them. Add them by meta.
		if ( post_type_exists( 'product' ) ) {
			devdaffi_db_reset_error();
			// phpcs:ignore WordPress.DB.DirectDatabaseQuery, WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- core tables; id-only.
			$ext = $wpdb->get_col( $wpdb->prepare(
				"SELECT p.ID FROM {$wpdb->posts} p
				 INNER JOIN {$wpdb->postmeta} m ON m.post_id = p.ID AND m.meta_key = '_product_url'
				 WHERE p.post_status = 'publish' AND p.post_type = 'product' AND m.meta_value != ''
				 ORDER BY p.ID DESC LIMIT %d",
				self::MAX_POSTS
			) );
			if ( devdaffi_db_failed() || null === $ext ) {
				return array_merge( self::get_stats(), array( 'ok' => false, 'partial' => false, 'error' => 'The product list could not be read; the index was left as it was.' ) );
			}
			$ids = array_unique( array_merge( (array) $ids, (array) $ext ) );
		}
		if ( devdaffi_db_failed() || null === $ids ) {
			return array_merge( self::get_stats(), array( 'ok' => false, 'partial' => false, 'error' => 'The post list could not be read; the index was left as it was.' ) );
		}
		$partial = count( $ids ) >= self::MAX_POSTS;

		foreach ( $ids as $id ) {
			devdaffi_db_reset_error();
			if ( false === self::scan_post( (int) $id ) || devdaffi_db_failed() ) {
				return array_merge( self::get_stats(), array( 'ok' => false, 'partial' => false, 'error' => 'A post could not be re-indexed (post ' . (int) $id . '); the scan stopped there and nothing was pruned.' ) );
			}
		}
		// Only AFTER a COMPLETE pass, drop rows for posts this scan didn't touch (no longer mention
		// Amazon / unpublished / deleted). scan_post refreshes last_seen on every row it re-inserts,
		// so anything older than this run's start marker is stale. A capped pass keeps them.
		if ( ! $partial ) {
			devdaffi_db_reset_error();
			// phpcs:ignore WordPress.DB.DirectDatabaseQuery, WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- constant table; prepared value.
			$pruned = $wpdb->query( $wpdb->prepare( "DELETE FROM $table WHERE last_seen < %s", $scan_start ) );
			if ( false === $pruned || devdaffi_db_failed() ) { // checked before get_stats() clears the error (round 2)
				return array_merge( self::get_stats(), array( 'ok' => false, 'partial' => false, 'error' => 'The stale rows could not be pruned; the index holds the fresh rows plus the old ones, the scan time was not advanced.' ) );
			}
		}
		$now = time();
		update_option( self::LAST_SCAN, $now, false );
		if ( (int) get_option( self::LAST_SCAN, 0 ) !== $now ) { // proved (round 2): the cron would otherwise re-scan too early
			return array_merge( self::get_stats(), array( 'ok' => false, 'partial' => $partial, 'error' => 'The index was rebuilt but the scan time could not be stored.' ) );
		}
		$stats = self::get_stats();
		if ( null === $stats['links'] || null === $stats['pages'] ) { // the counts could not be read: not a success (round 4)
			return array_merge( $stats, array( 'ok' => false, 'partial' => $partial, 'error' => 'The index was rebuilt but its counts could not be read.' ) );
		}
		return array_merge( $stats, array( 'ok' => true, 'partial' => $partial ) );
	}

	/**
	 * Bulk-replace one ASIN with another everywhere it appears — across every page/product
	 * that links it (content links + WooCommerce _product_url). The swap is SURGICAL: it only
	 * changes the 10-char ASIN that sits inside an Amazon/redirect URL path (…/dp/OLD, …/i/OLD),
	 * never plain text, so nothing else breaks. Re-indexes each touched post. Use case: a dead
	 * ASIN whose product moved to a new ASIN, or pointing all links to a similar replacement —
	 * fix 1 or 100 pages in one click instead of editing each by hand.
	 *
	 * Round 1: only URLs on an Amazon storefront (or the /i/ASIN form behind a real host) are touched, never plain
	 * text or another site's paths; every write is checked; a post whose product URL could not be written gets its
	 * content put back; the old status row goes only when no page links the old ASIN any more; ok is false when any
	 * post failed and the failed ids are named.
	 * @return array{ok:bool,invalid?:bool,pages:int,failed:array<int>,inconsistent:array<int>,old:string,new:string}
	 */
	public static function replace_asin( $old, $new ) {
		$old = strtoupper( preg_replace( '/[^A-Za-z0-9]/', '', (string) $old ) );
		$new = strtoupper( preg_replace( '/[^A-Za-z0-9]/', '', (string) $new ) );
		if ( 10 !== strlen( $old ) || 10 !== strlen( $new ) || $old === $new ) {
			return array( 'ok' => false, 'invalid' => true, 'pages' => 0, 'failed' => array(), 'inconsistent' => array(), 'old' => $old, 'new' => $new );
		}
		// One replacement at a time (round 7): two concurrent runs used to overwrite each other's recovery journal.
		// add_option() is the atomic claim (a second call answers false while the row exists); a claim older than
		// 10 minutes is a dead run and is taken over.
		// Round 8: the lock row holds "<timestamp>:<owner token>"; a dead claim is removed with ONE conditional DELETE on the
		// exact stored value (two takers cannot both win), the claim is add_option() (atomic), and the release deletes the row
		// only while it still holds this run's token.
		global $wpdb;
		$stale_value = (string) get_option( self::LOCK, '' );
		if ( '' !== $stale_value && (int) $stale_value < time() - 10 * MINUTE_IN_SECONDS ) {
			// phpcs:ignore WordPress.DB.DirectDatabaseQuery -- conditional delete of the exact stale row is the atomic takeover
			$wpdb->query( $wpdb->prepare( "DELETE FROM {$wpdb->options} WHERE option_name = %s AND option_value = %s", self::LOCK, $stale_value ) );
			wp_cache_delete( self::LOCK, 'options' );
			wp_cache_delete( 'alloptions', 'options' );
		}
		$owner = wp_generate_password( 12, false );
		// Round 9: add_option() checks then upserts (two callers can both "succeed"); INSERT IGNORE on the UNIQUE
		// option_name is the one atomic claim: exactly one caller gets rows_affected = 1.
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery -- the atomic claim
		$claimed = $wpdb->query( $wpdb->prepare( "INSERT IGNORE INTO {$wpdb->options} (option_name, option_value, autoload) VALUES (%s, %s, 'no')", self::LOCK, time() . ':' . $owner ) );
		wp_cache_delete( self::LOCK, 'options' );
		wp_cache_delete( 'alloptions', 'options' );
		if ( 1 !== (int) $claimed ) {
			return array( 'ok' => false, 'busy' => true, 'pages' => 0, 'failed' => array(), 'inconsistent' => array(), 'unfinished' => array(), 'old' => $old, 'new' => $new, 'error' => 'Another replacement is still running; try again in a minute.' );
		}
		self::$lock_owner   = $owner;
		self::$lock_touched = time();
		try {
			return self::replace_asin_locked( $old, $new );
		} finally {
			self::$lock_owner = '';
			// phpcs:ignore WordPress.DB.DirectDatabaseQuery -- release only the row this run owns (the timestamp may have been refreshed)
			$wpdb->query( $wpdb->prepare( "DELETE FROM {$wpdb->options} WHERE option_name = %s AND option_value LIKE %s", self::LOCK, '%:' . $wpdb->esc_like( $owner ) ) );
			wp_cache_delete( self::LOCK, 'options' );
			wp_cache_delete( 'alloptions', 'options' );
		}
	}

	/**
	 * A live run stamps its lock again while it is still its own (round 8), at most once a minute (round 9: by elapsed
	 * time, not by post count). @return bool false when the row no longer carries this run's owner = the lease was taken
	 * over; the caller must stop touching posts.
	 */
	private static function lock_touch() {
		global $wpdb;
		if ( '' === self::$lock_owner ) {
			return true;
		}
		if ( time() - self::$lock_touched < MINUTE_IN_SECONDS ) {
			return true;
		}
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery -- refresh only the row this run owns
		$n = $wpdb->query( $wpdb->prepare( "UPDATE {$wpdb->options} SET option_value = %s WHERE option_name = %s AND option_value LIKE %s", time() . ':' . self::$lock_owner, self::LOCK, '%:' . $wpdb->esc_like( self::$lock_owner ) ) );
		wp_cache_delete( self::LOCK, 'options' );
		wp_cache_delete( 'alloptions', 'options' );
		if ( 1 !== (int) $n ) {
			return false; // the row is gone or belongs to another run now
		}
		self::$lock_touched = time();
		return true;
	}

	/** The replacement itself; the caller holds the lock. */
	private static function replace_asin_locked( $old, $new ) {

		global $wpdb;
		$table = self::table();
		devdaffi_db_reset_error();
		// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery -- constant table; prepared value.
		$post_ids = $wpdb->get_col( $wpdb->prepare( "SELECT DISTINCT post_id FROM $table WHERE asin = %s", $old ) );
		if ( devdaffi_db_failed() || null === $post_ids ) {
			return array( 'ok' => false, 'pages' => 0, 'failed' => array(), 'inconsistent' => array(), 'old' => $old, 'new' => $new, 'error' => 'The link index could not be read.' );
		}

		// Only swap the ASIN when it sits in the path of an Amazon storefront URL, or in the /i/ASIN redirect form
		// right behind a host (a transit link): a bare "/dp/OLD" in prose or under another site stays.
		$q   = preg_quote( $old, '#' );
		$own = self::own_host();
		$re  = '#(https?://' . self::storefront_alt() . '/(?:[^"\'\s<?\#]*?/)?(?:dp|gp/product|gp/aw/d|exec/obidos/ASIN|o/ASIN)/'
			. ( '' !== $own ? '|https?://' . preg_quote( $own, '#' ) . '/(?:i|dp|gp/product)/' : '' )
			. ')' . $q . '(?![A-Z0-9])#i'; // Amazon storefront paths, or this site's own redirect form; never another host (rounds 4-5); the prefix never crosses ? or #
		$count        = 0;
		$failed       = array(); // untouched, as they were
		$inconsistent = array(); // changed in part: content or index does not match the button
		// Recovery journal (round 3): the original content and product URL of a post are stored BEFORE its first write
		// and removed once the post is verified, so a timeout or a fatal mid-run leaves the originals on record.
		$journal    = get_option( self::JOURNAL, array() );
		$journal    = is_array( $journal ) ? $journal : array();
		// An earlier entry whose post no longer carries its old ASIN anywhere (content, product URL, index) was
		// finished after all: its entry goes (round 4). The rest stays unfinished and untouched.
		foreach ( $journal as $jpid => $entry ) {
			$jpid = (int) $jpid;
			$jold = isset( $entry['old'] ) ? strtoupper( preg_replace( '/[^A-Za-z0-9]/', '', (string) $entry['old'] ) ) : '';
			if ( 10 !== strlen( $jold ) ) {
				continue;
			}
			$jre  = '#/(?:i|dp|gp/product|gp/aw/d|exec/obidos/ASIN|o/ASIN)/' . preg_quote( $jold, '#' ) . '(?![A-Z0-9])#i';
			$jp   = get_post( $jpid );
			$jurl = (string) get_post_meta( $jpid, '_product_url', true );
			devdaffi_db_reset_error();
			// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery -- constant table; prepared values.
			$jrows = $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(*) FROM $table WHERE asin = %s AND post_id = %d", $jold, $jpid ) );
			if ( devdaffi_db_failed() || null === $jrows ) {
				continue;
			}
			// Round 5: an entry goes only when the post holds the INTENDED completed state: the old ASIN nowhere, and the new
			// ASIN in every place the original held the old one (content, product URL), with its index row present.
			$jnew  = isset( $entry['new'] ) ? strtoupper( preg_replace( '/[^A-Za-z0-9]/', '', (string) $entry['new'] ) ) : '';
			$jren  = '#/(?:i|dp|gp/product|gp/aw/d|exec/obidos/ASIN|o/ASIN)/' . preg_quote( $jnew, '#' ) . '(?![A-Z0-9])#i';
			$oc    = isset( $entry['content'] ) ? (string) $entry['content'] : '';
			$ou    = isset( $entry['url'] ) ? (string) $entry['url'] : '';
			$had_c = '' !== $oc && preg_match( $jre, $oc );
			$had_u = '' !== $ou && preg_match( $jre, $ou );
			$old_gone = ( ! $jp || ! preg_match( $jre, (string) $jp->post_content ) ) && ( '' === $jurl || ! preg_match( $jre, $jurl ) ) && 0 === (int) $jrows;
			// Round 6: "new somewhere" is not enough; the post must hold EXACTLY the replacement derived from its originals
			// (every old link swapped, nothing else changed), so a damaged post keeps its backup.
			$own_j    = self::own_host();
			$jre_full = '#(https?://' . self::storefront_alt() . '/(?:[^"\'\s<?\#]*?/)?(?:dp|gp/product|gp/aw/d|exec/obidos/ASIN|o/ASIN)/'
				. ( '' !== $own_j ? '|https?://' . preg_quote( $own_j, '#' ) . '/(?:i|dp|gp/product)/' : '' )
				. ')' . preg_quote( $jold, '#' ) . '(?![A-Z0-9])#i';
			$exp_c    = $had_c ? preg_replace( $jre_full, '${1}' . $jnew, $oc ) : $oc;
			$exp_u    = $had_u ? preg_replace( $jre_full, '${1}' . $jnew, $ou ) : $ou;
			$new_ok   = 10 === strlen( $jnew ) && null !== $exp_c && null !== $exp_u
				&& ( ! $had_c || ( $jp && (string) $jp->post_content === (string) $exp_c ) )
				&& ( ! $had_u || $jurl === (string) $exp_u );
			$new_rows = 0;
			if ( $new_ok && ( $had_c || $had_u ) ) {
				devdaffi_db_reset_error();
				// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery -- constant table; prepared values.
				$new_rows = $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(*) FROM $table WHERE asin = %s AND post_id = %d", $jnew, $jpid ) );
				if ( devdaffi_db_failed() || null === $new_rows ) {
					continue;
				}
			}
			$done = $old_gone && $new_ok && ( ( ! $had_c && ! $had_u ) || (int) $new_rows > 0 );
			if ( $done ) {
				unset( $journal[ $jpid ] );
				update_option( self::JOURNAL, $journal, false );
				$now_j = get_option( self::JOURNAL, array() );
				if ( is_array( $now_j ) && isset( $now_j[ $jpid ] ) ) {
					$journal = $now_j; // the delete did not land: it stays
				}
			}
		}
		$unfinished = array_map( 'intval', array_keys( $journal ) ); // posts an EARLIER run left unverified
		$lost = false;
		foreach ( (array) $post_ids as $pid ) {
			$pid = (int) $pid;
			if ( ! self::lock_touch() ) { // round 9: a run that lost its lease stops before its next write
				$lost = true;
				break;
			}
			if ( in_array( $pid, $unfinished, true ) ) {
				continue; // round 4: never write over a post whose earlier replacement was never reconciled; it stays in the journal and is answered
			}
			$changed = false;
			$post    = get_post( $pid );
			$orig    = $post ? (string) $post->post_content : null;
			$content_written = false;
			$purl0   = (string) get_post_meta( $pid, '_product_url', true );
			$touch   = ( $post && preg_match( $re, $orig ) ) || ( '' !== $purl0 && preg_match( $re, $purl0 ) );
			if ( $touch && ! isset( $journal[ $pid ] ) ) {
				$journal[ $pid ] = array( 'content' => $orig, 'url' => $purl0, 'old' => $old, 'new' => $new, 'at' => time() );
				update_option( self::JOURNAL, $journal, false );
				if ( get_option( self::JOURNAL, array() ) !== $journal ) { // the journal must land before the post is touched
					$failed[] = $pid;
					unset( $journal[ $pid ] );
					continue;
				}
			}

			if ( $post ) {
				$nc = preg_replace( $re, '${1}' . $new, $orig );
				if ( null !== $nc && $nc !== $orig ) {
					$w = wp_update_post( array( 'ID' => $pid, 'post_content' => wp_slash( $nc ) ), true ); // wp_update_post() unslashes: slashed in, exact bytes stored (round 2)
					if ( is_wp_error( $w ) || 0 === (int) $w ) {
						$failed[] = $pid;
						if ( ! self::journal_clear( $journal, $pid ) ) { $unfinished[] = $pid; } // untouched: its recovery entry goes (round 5) (round 6: a delete that did not land is answered)
						continue;
					}
					$fresh = get_post( $pid );
					if ( ! $fresh || (string) $fresh->post_content !== $nc ) { // proved, not assumed
						// The store transformed the content (a filter, a sanitizer): put the original back and say which it is (round 3)
						wp_update_post( array( 'ID' => $pid, 'post_content' => wp_slash( $orig ) ) );
						$back = get_post( $pid );
						if ( $back && (string) $back->post_content === $orig ) {
							$failed[] = $pid; // untouched again
							if ( ! self::journal_clear( $journal, $pid ) ) { $unfinished[] = $pid; } // round 5 (round 6: a delete that did not land is answered)
						} else {
							$inconsistent[] = $pid;
						}
						continue;
					}
					$changed         = true;
					$content_written = true;
				}
			}

			$purl = get_post_meta( $pid, '_product_url', true );
			if ( $purl ) {
				$np = preg_replace( $re, '${1}' . $new, (string) $purl );
				if ( null !== $np && $np !== $purl ) {
					update_post_meta( $pid, '_product_url', wp_slash( $np ) );
					if ( (string) get_post_meta( $pid, '_product_url', true ) !== $np ) {
						// The post goes back whole so content and button agree again: the product URL AND the content are
						// restored and read back; anything that did not come back is inconsistent (rounds 2 and 4).
						$whole = true;
						if ( (string) get_post_meta( $pid, '_product_url', true ) !== (string) $purl ) {
							update_post_meta( $pid, '_product_url', wp_slash( (string) $purl ) );
							$whole = (string) get_post_meta( $pid, '_product_url', true ) === (string) $purl;
						}
						if ( $content_written ) {
							wp_update_post( array( 'ID' => $pid, 'post_content' => wp_slash( $orig ) ) );
							$back  = get_post( $pid );
							$whole = $whole && $back && (string) $back->post_content === $orig;
						}
						if ( ! $whole ) {
							$inconsistent[] = $pid;
							continue;
						}
						$failed[] = $pid;
						if ( ! self::journal_clear( $journal, $pid ) ) { $unfinished[] = $pid; } // restored whole: its recovery entry goes (round 5) (round 6: a delete that did not land is answered)
						continue;
					}
					$changed = true;
				}
			}

			if ( $changed ) {
				devdaffi_db_reset_error();
				if ( false === self::scan_post( $pid ) || devdaffi_db_failed() ) { // the content changed but the index did not follow (rounds 2, 5)
					$inconsistent[] = $pid;
					continue;
				}
				++$count;
			}
			if ( isset( $journal[ $pid ] ) && ! in_array( $pid, $inconsistent, true ) ) { // verified or untouched: its journal entry goes, proved (round 4)
				unset( $journal[ $pid ] );
				update_option( self::JOURNAL, $journal, false );
				$now_j = get_option( self::JOURNAL, array() );
				if ( is_array( $now_j ) && isset( $now_j[ $pid ] ) ) {
					$journal = $now_j; // the delete did not land: the entry stays and the post is answered as unfinished
					$unfinished[] = $pid;
				}
			}
		}
		$unfinished = array_values( array_unique( array_map( 'intval', $unfinished ) ) ); // earlier leftovers (skipped above) + entries that could not be cleared

		// The old ASIN's status row goes only when nothing links it any more (a failed post still does).
		devdaffi_db_reset_error();
		// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery -- constant table; prepared value.
		$left = $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(*) FROM $table WHERE asin = %s", $old ) );
		$status_dropped = null; // null = nothing to drop (old ASIN still linked), true/false = the stale row went / did not (round 7)
		if ( ! devdaffi_db_failed() && null !== $left && 0 === (int) $left ) {
			$status = DEVDAFFI_Monitor::table();
			devdaffi_db_reset_error();
			// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery -- constant table; prepared value.
			$d = $wpdb->query( $wpdb->prepare( "DELETE FROM $status WHERE asin = %s", $old ) );
			$status_dropped = false !== $d && ! devdaffi_db_failed();
		}

		$out = array( 'ok' => empty( $failed ) && empty( $inconsistent ) && ! $lost, 'pages' => $count, 'failed' => $failed, 'inconsistent' => $inconsistent, 'unfinished' => $unfinished, 'old_status_dropped' => $status_dropped, 'old' => $old, 'new' => $new );
		if ( $lost ) {
			$out['error'] = 'The replacement stopped: its lock was taken over by another run. Posts already changed are verified; the rest were not touched. Run it again.';
		}
		return $out;
	}

	/** Drop one post's recovery entry, proved: a delete that did not land keeps the entry (round 5). */
	private static function journal_clear( array &$journal, $pid ) {
		if ( ! isset( $journal[ $pid ] ) ) {
			return true;
		}
		unset( $journal[ $pid ] );
		update_option( self::JOURNAL, $journal, false );
		$now_j = get_option( self::JOURNAL, array() );
		if ( is_array( $now_j ) && isset( $now_j[ $pid ] ) ) {
			$journal = $now_j;
			return false;
		}
		return true;
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

	/** @return array{links:int|null,pages:int|null,last_scan:int} null counts = the read failed (round 1) */
	public static function get_stats() {
		global $wpdb;
		$table = self::table();
		devdaffi_db_reset_error();
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery, WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- constant table, no input.
		$row = $wpdb->get_row( "SELECT COUNT(*) AS links, COUNT(DISTINCT post_id) AS pages FROM $table", ARRAY_A );
		$bad = devdaffi_db_failed() || ! $row;
		return array(
			'links'     => $bad ? null : (int) $row['links'],
			'pages'     => $bad ? null : (int) $row['pages'],
			'last_scan' => (int) get_option( self::LAST_SCAN, 0 ),
		);
	}
}
