<?php
/**
 * Stock & 404 Monitor — checks the scanned ASINs for dead links (404).
 *
 *  - 404 check: free HEAD request to the product URL (404 / redirect-away = dead).
 *  - Stock / out-of-stock detection is handled by the DevDome server
 *    (api.devdome.com/amazon-404-oos-checker), which holds the ScrapingDog key —
 *    wired separately so no key lives in the plugin.
 *
 * Status is per-ASIN (table {prefix}devdaffi_status). Checked in bounded
 * batches (manual "Check Now" + the daily scan cron) so big sites never time out.
 */

defined( 'ABSPATH' ) || exit;

// phpcs:disable WordPress.DB.DirectDatabaseQuery, WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.PreparedSQLPlaceholders.UnfinishedPrepare, PluginCheck.Security.DirectDB.UnescapedDBParameter -- Custom plugin tables: names are constant ($wpdb->prefix); user values use $wpdb->prepare(). False positives for dedicated custom-table access.

class DEVDAFFI_Monitor {

	const DB_VERSION = '1';
	const DB_OPTION  = 'devdaffi_status_db';
	const BATCH      = 20;
	const API        = 'https://api.devdome.com/amazon-404-oos-checker';

	public function __construct() {
		// Piggyback the scanner's daily cron to check a batch automatically.
		add_action( DEVDAFFI_Scanner::CRON_HOOK, array( __CLASS__, 'cron_batch' ) );
	}

	public static function table() {
		global $wpdb;
		return $wpdb->prefix . 'devdaffi_status';
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
				asin varchar(20) NOT NULL,
				status varchar(20) NOT NULL DEFAULT 'unknown',
				http_code smallint unsigned DEFAULT 0,
				last_checked datetime DEFAULT NULL,
				PRIMARY KEY  (asin),
				KEY status (status)
			) $charset;"
		);
		update_option( self::DB_OPTION, self::DB_VERSION );
	}

	/** Check up to $limit ASINs (unchecked first, then oldest-checked) via the server. */
	public static function check_batch( $limit = self::BATCH ) {
		global $wpdb;
		$index  = DEVDAFFI_Scanner::table();
		$status = self::table();
		$limit  = max( 1, min( 50, (int) $limit ) );

		// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery -- constant tables; limit is int.
		$rows = $wpdb->get_results( $wpdb->prepare(
			"SELECT i.asin, MIN(i.domain) AS domain
			 FROM (SELECT DISTINCT asin, domain FROM $index) i
			 LEFT JOIN $status s ON s.asin = i.asin
			 GROUP BY i.asin
			 ORDER BY (MAX(s.last_checked) IS NOT NULL), MAX(s.last_checked) ASC
			 LIMIT %d",
			$limit
		), ARRAY_A );

		if ( empty( $rows ) ) {
			return self::get_summary();
		}

		// Build the batch and let the DevDome server (which holds the ScrapingDog key)
		// classify them all in one parallel call — no per-ASIN loop, no PHP timeout.
		$items = array();
		foreach ( $rows as $r ) {
			$domain  = preg_replace( '/[^a-z0-9.]/', '', strtolower( (string) $r['domain'] ) );
			$items[] = array( 'asin' => $r['asin'], 'domain' => $domain ? $domain : 'amazon.com' );
		}
		$results = self::check_via_server( $items );

		$now = current_time( 'mysql', true );
		foreach ( $rows as $r ) {
			$res = isset( $results[ $r['asin'] ] ) ? $results[ $r['asin'] ] : array( 'unknown', 0 );
			// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery -- constant table; prepared values.
			$wpdb->query( $wpdb->prepare(
				"INSERT INTO $status (asin, status, http_code, last_checked) VALUES (%s, %s, %d, %s)
				 ON DUPLICATE KEY UPDATE status = VALUES(status), http_code = VALUES(http_code), last_checked = VALUES(last_checked)",
				$r['asin'],
				$res[0],
				(int) $res[1],
				$now
			) );
		}
		return self::get_summary();
	}

	/**
	 * Ask the DevDome server to classify a batch of ASINs (dead/oos/ok/unknown). No API
	 * key in the plugin — it lives on the server. Fail-soft: a server error leaves every
	 * ASIN 'unknown' (never false-flags a live link as dead).
	 *
	 * @return array<string,array{0:string,1:int}> asin => [status, http_code]
	 */
	private static function check_via_server( $items ) {
		$out  = array();
		$resp = wp_remote_post( self::API . '/check-batch', array(
			'timeout' => 90,
			'headers' => array( 'Content-Type' => 'application/json' ),
			'body'    => wp_json_encode( array(
				'items'      => $items,
				// Account-gated service: the suite site identity authenticates the call and
				// the linked account's plan sets the monthly check quota.
				'site'       => (string) get_option( 'devdcorev1_site_id', '' ),
				'site_token' => (string) get_option( 'devdcorev1_site_token', '' ),
			) ),
		) );
		if ( is_wp_error( $resp ) ) {
			return $out;
		}
		$code = (int) wp_remote_retrieve_response_code( $resp );
		$body = json_decode( wp_remote_retrieve_body( $resp ), true );
		if ( 401 === $code ) {
			update_option( 'devdaffi_svc_state', 'connect', false ); // UI: "Connect your DevDome account"
			return $out;
		}
		if ( 429 === $code ) {
			update_option( 'devdaffi_svc_state', 'quota', false ); // UI: monthly limit reached
			if ( is_array( $body ) && ! empty( $body['usage'] ) ) {
				update_option( 'devdaffi_usage', $body['usage'], false );
			}
			return $out;
		}
		if ( 200 === $code ) {
			update_option( 'devdaffi_svc_state', 'ok', false );
			if ( is_array( $body ) && ! empty( $body['usage'] ) ) {
				update_option( 'devdaffi_usage', $body['usage'], false );
			}
		}
		if ( empty( $body['results'] ) || ! is_array( $body['results'] ) ) {
			return $out;
		}
		foreach ( $body['results'] as $r ) {
			if ( empty( $r['asin'] ) ) {
				continue;
			}
			$st = ( isset( $r['status'] ) && in_array( $r['status'], array( 'ok', 'oos', 'dead', 'unknown' ), true ) ) ? $r['status'] : 'unknown';
			$out[ $r['asin'] ] = array( $st, isset( $r['http_code'] ) ? (int) $r['http_code'] : 0 );
		}
		return $out;
	}

	public static function cron_batch() {
		// Same opt-in as the scheduled scan: no automatic DevDome status checks unless the
		// user enabled auto-scan (G7). The Check Now button still calls check_batch() directly.
		if ( empty( DEVDAFFI_Settings::get()['scan_auto'] ) ) {
			return;
		}
		self::check_batch( self::BATCH );
	}

	/** @return array{total:int,checked:int,ok:int,oos:int,dead:int,unknown:int,unchecked:int} */
	public static function get_summary() {
		global $wpdb;
		$index  = DEVDAFFI_Scanner::table();
		$status = self::table();

		// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery -- constant tables.
		$total = (int) $wpdb->get_var( "SELECT COUNT(DISTINCT asin) FROM $index" );
		// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery -- constant tables.
		$rows  = $wpdb->get_results( "SELECT s.status, COUNT(*) c FROM $status s WHERE s.asin IN (SELECT DISTINCT asin FROM $index) GROUP BY s.status", ARRAY_A );

		$by = array( 'ok' => 0, 'oos' => 0, 'dead' => 0, 'unknown' => 0 );
		foreach ( (array) $rows as $r ) {
			if ( isset( $by[ $r['status'] ] ) ) {
				$by[ $r['status'] ] = (int) $r['c'];
			}
		}
		$checked = array_sum( $by );

		return array(
			'total'     => $total,
			'checked'   => $checked,
			'ok'        => $by['ok'],
			'oos'       => $by['oos'],
			'dead'      => $by['dead'],
			'unknown'   => $by['unknown'],
			'unchecked' => max( 0, $total - $checked ),
		);
	}

	/** Current status of one ASIN ('ok'|'oos'|'dead'|'unknown'), or '' if never checked. */
	public static function status_of( $asin ) {
		global $wpdb;
		$tbl = self::table();
		// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery -- constant table; prepared value.
		$s = $wpdb->get_var( $wpdb->prepare( "SELECT status FROM $tbl WHERE asin = %s", (string) $asin ) );
		return $s ? (string) $s : '';
	}

	/** Check a single ASIN now (its store taken from the index) and store the result. */
	public static function recheck_asin( $asin ) {
		global $wpdb;
		$index = DEVDAFFI_Scanner::table();
		// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery -- constant table; prepared value.
		$domain = $wpdb->get_var( $wpdb->prepare( "SELECT MIN(domain) FROM $index WHERE asin = %s", $asin ) );
		$domain = $domain ? preg_replace( '/[^a-z0-9.]/', '', strtolower( $domain ) ) : 'amazon.com';
		$results = self::check_via_server( array( array( 'asin' => $asin, 'domain' => $domain ? $domain : 'amazon.com' ) ) );
		$res     = isset( $results[ $asin ] ) ? $results[ $asin ] : array( 'unknown', 0 );
		$tbl     = self::table();
		// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery -- constant table; prepared values.
		$wpdb->query( $wpdb->prepare(
			"INSERT INTO $tbl (asin, status, http_code, last_checked) VALUES (%s, %s, %d, %s)
			 ON DUPLICATE KEY UPDATE status = VALUES(status), http_code = VALUES(http_code), last_checked = VALUES(last_checked)",
			$asin,
			$res[0],
			(int) $res[1],
			current_time( 'mysql', true )
		) );
		return $res[0];
	}

	/**
	 * Build an Amazon search keyword for the product behind an ASIN, best → fallback:
	 *   explicit keyword → brand+attr+type → brand+type → attr+type → type → cleaned title.
	 * The product-metadata tiers (post meta `_pd_brand` / `_pd_product_type` / `_pd_key_attribute`
	 * / `_pd_fallback_keyword`) give sharp matches when a site provides them (e.g. ProductDome
	 * imports); a plain site with only a title still works off the cleaned title. '' if unknown.
	 */
	public static function keyword_for_asin( $asin ) {
		global $wpdb;
		$index = DEVDAFFI_Scanner::table();
		// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery -- constant table; prepared value.
		$pid = (int) $wpdb->get_var( $wpdb->prepare( "SELECT post_id FROM $index WHERE asin = %s LIMIT 1", (string) $asin ) );
		if ( ! $pid ) {
			return '';
		}
		$m = function ( $k ) use ( $pid ) {
			return trim( (string) get_post_meta( $pid, $k, true ) );
		};
		$explicit = $m( '_pd_fallback_keyword' );
		if ( '' !== $explicit ) {
			return self::clean_keyword( $explicit );
		}
		$brand = $m( '_pd_brand' );
		$type  = $m( '_pd_product_type' );
		$attr  = $m( '_pd_key_attribute' );
		if ( '' !== $brand && '' !== $type ) {
			return self::clean_keyword( '' !== $attr ? "$brand $attr $type" : "$brand $type" );
		}
		if ( '' !== $attr && '' !== $type ) {
			return self::clean_keyword( "$attr $type" );
		}
		if ( '' !== $type ) {
			return self::clean_keyword( $type );
		}
		$broad = $m( '_pd_broad_keyword' );
		if ( '' !== $broad ) {
			return self::clean_keyword( $broad );
		}
		return self::clean_keyword( get_the_title( $pid ) );
	}

	/** Strip review/Amazon filler from a title → a short product search query (<=6 words). */
	private static function clean_keyword( $title ) {
		$t = ' ' . html_entity_decode( wp_strip_all_tags( (string) $title ), ENT_QUOTES ) . ' ';
		$t = preg_replace( '/\b(review of|reviews?|is it worth (buying|it)|worth buying|discover(ing)?|ultimate|complete|guide|the best|best|premium|honest|in[- ]depth)\b/i', ' ', $t );
		$t = preg_replace( array( '/\bwith\b.*$/i', '/\bfor\b.*$/i', '/\bby\b.*$/i' ), ' ', $t );
		$t = preg_replace( '/\b20\d\d\b/', ' ', $t );
		$t = preg_replace( '/[^\p{L}\p{N}\s\-\+\.&]/u', ' ', $t );
		$t = trim( preg_replace( '/\s+/', ' ', $t ) );
		return $t ? implode( ' ', array_slice( explode( ' ', $t ), 0, 6 ) ) : '';
	}

	/** Ask the server for the top live replacement ASIN for $keyword on $domain. '' if none. */
	public static function search_replacement( $keyword, $domain ) {
		if ( '' === $keyword ) {
			return '';
		}
		$resp = wp_remote_get(
			self::API . '/search?' . http_build_query( array(
				'keyword'    => $keyword,
				'domain'     => $domain,
				'site'       => (string) get_option( 'devdcorev1_site_id', '' ),
				'site_token' => (string) get_option( 'devdcorev1_site_token', '' ),
			) ),
			array( 'timeout' => 8 )
		);
		if ( is_wp_error( $resp ) ) {
			return '';
		}
		$d = json_decode( wp_remote_retrieve_body( $resp ), true );
		return ( is_array( $d ) && ! empty( $d['asin'] ) ) ? strtoupper( preg_replace( '/[^A-Za-z0-9]/', '', $d['asin'] ) ) : '';
	}

	/**
	 * Dead/OOS products, ONE entry per ASIN, each with the full list of pages that link it
	 * (so every place a dead product appears is visible — no orphaned 404s).
	 * @return array<int,array{asin:string,domain:string,status:string,amazon_url:string,pages:array}>
	 */
	public static function get_problems( $limit = 1000 ) {
		global $wpdb;
		$index  = DEVDAFFI_Scanner::table();
		$status = self::table();
		$limit  = max( 1, min( 5000, (int) $limit ) );

		// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery -- constant tables; limit int.
		$rows = $wpdb->get_results( $wpdb->prepare(
			"SELECT i.asin, i.domain, i.post_id, s.status
			 FROM $index i INNER JOIN $status s ON s.asin = i.asin
			 WHERE s.status IN ('dead','oos')
			 ORDER BY s.status, i.asin
			 LIMIT %d",
			$limit
		), ARRAY_A );

		$by_asin = array();
		foreach ( (array) $rows as $r ) {
			$asin = $r['asin'];
			if ( ! isset( $by_asin[ $asin ] ) ) {
				$domain = $r['domain'] ? $r['domain'] : 'amazon.com';
				$by_asin[ $asin ] = array(
					'asin'       => $asin,
					'domain'     => $domain,
					'status'     => $r['status'],
					'amazon_url' => 'https://www.' . $domain . '/dp/' . $asin,
					'pages'      => array(),
				);
			}
			$pid = (int) $r['post_id'];
			$by_asin[ $asin ]['pages'][] = array(
				'post_id'   => $pid,
				'title'     => get_the_title( $pid ),
				'permalink' => get_permalink( $pid ),
				'edit_link' => get_edit_post_link( $pid, 'raw' ),
			);
		}
		$titles = self::titles_for_asins( array_keys( $by_asin ) );
		foreach ( $by_asin as $a => $unused ) {
			$by_asin[ $a ]['title'] = isset( $titles[ strtoupper( $a ) ] ) ? $titles[ strtoupper( $a ) ] : '';
		}
		return array_values( $by_asin );
	}

	/**
	 * Map ASIN => product name, resolved from the Product Importer's imported products
	 * (post meta `_pi_asin`, post_title = the Amazon product name from the downloaded data).
	 * Suite integration: empty map when PI isn't installed / no matching products.
	 * @return array<string,string>  uppercase ASIN => title
	 */
	private static function titles_for_asins( $asins ) {
		global $wpdb;
		$asins = array_values( array_unique( array_filter( array_map( 'strval', (array) $asins ) ) ) );
		if ( empty( $asins ) ) {
			return array();
		}
		$placeholders = implode( ',', array_fill( 0, count( $asins ), '%s' ) );
		// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery -- placeholders generated for prepared values.
		$rows = $wpdb->get_results( $wpdb->prepare(
			"SELECT pm.meta_value AS asin, p.post_title AS title, p.ID AS id
			 FROM {$wpdb->postmeta} pm
			 INNER JOIN {$wpdb->posts} p ON p.ID = pm.post_id
			 WHERE pm.meta_key = '_pi_asin' AND pm.meta_value IN ($placeholders)
			   AND p.post_status NOT IN ('trash','auto-draft')
			 ORDER BY p.ID DESC",
			$asins
		), ARRAY_A );
		$map = array();
		foreach ( (array) $rows as $r ) {
			$a = strtoupper( (string) $r['asin'] );
			if ( ! isset( $map[ $a ] ) ) {
				$map[ $a ] = (string) $r['title']; // most-recent product wins
			}
		}
		return $map;
	}

	/**
	 * Paginated ASIN list for a single status ('ok'|'oos'|'dead'|'unknown'), with pages.
	 * Used by the Live row's expandable list which lazy-loads to avoid pulling 1000s up front.
	 * @return array{items:array,has_more:bool}
	 */
	public static function get_by_status( $status, $limit = 50, $offset = 0 ) {
		global $wpdb;
		if ( ! in_array( $status, array( 'ok', 'oos', 'dead', 'unknown' ), true ) ) {
			return array( 'items' => array(), 'has_more' => false );
		}
		$index  = DEVDAFFI_Scanner::table();
		$stbl   = self::table();
		$limit  = max( 1, min( 200, (int) $limit ) );
		$offset = max( 0, (int) $offset );

		// Fetch limit+1 distinct ASINs to detect has_more without a separate count query.
		// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery -- constant tables; prepared values.
		$asins = $wpdb->get_col( $wpdb->prepare(
			"SELECT DISTINCT i.asin FROM $index i INNER JOIN $stbl s ON s.asin = i.asin
			 WHERE s.status = %s ORDER BY i.asin LIMIT %d OFFSET %d",
			$status, $limit + 1, $offset
		) );
		$has_more = count( $asins ) > $limit;
		if ( $has_more ) {
			array_pop( $asins );
		}
		if ( empty( $asins ) ) {
			return array( 'items' => array(), 'has_more' => false );
		}

		$placeholders = implode( ',', array_fill( 0, count( $asins ), '%s' ) );
		// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery -- constant table; placeholders generated for prepared values.
		$rows = $wpdb->get_results( $wpdb->prepare(
			"SELECT i.asin, i.domain, i.post_id FROM $index i WHERE i.asin IN ($placeholders) ORDER BY i.asin",
			$asins
		), ARRAY_A );

		$by_asin = array();
		foreach ( $asins as $a ) {
			$by_asin[ $a ] = array( 'asin' => $a, 'domain' => 'amazon.com', 'status' => $status, 'amazon_url' => '', 'pages' => array() );
		}
		foreach ( (array) $rows as $r ) {
			$a = $r['asin'];
			if ( ! isset( $by_asin[ $a ] ) ) {
				continue;
			}
			$domain = $r['domain'] ? $r['domain'] : 'amazon.com';
			$by_asin[ $a ]['domain']     = $domain;
			$by_asin[ $a ]['amazon_url'] = 'https://www.' . $domain . '/dp/' . $a;
			$pid = (int) $r['post_id'];
			$by_asin[ $a ]['pages'][] = array(
				'post_id'   => $pid,
				'title'     => get_the_title( $pid ),
				'permalink' => get_permalink( $pid ),
				'edit_link' => get_edit_post_link( $pid, 'raw' ),
			);
		}
		$titles = self::titles_for_asins( array_keys( $by_asin ) );
		foreach ( $by_asin as $a => $unused ) {
			$by_asin[ $a ]['title'] = isset( $titles[ strtoupper( $a ) ] ) ? $titles[ strtoupper( $a ) ] : '';
		}
		return array( 'items' => array_values( $by_asin ), 'has_more' => $has_more );
	}

	/**
	 * Re-check only the ASINs currently flagged with $status ('oos' or 'dead') and update
	 * them, so a restocked/fixed product flips back to 'ok' (Live). Bounded batch.
	 */
	public static function recheck_status( $status, $limit = 50 ) {
		global $wpdb;
		$status = in_array( $status, array( 'oos', 'dead' ), true ) ? $status : 'dead';
		$index  = DEVDAFFI_Scanner::table();
		$tbl    = self::table();
		$limit  = max( 1, min( 100, (int) $limit ) );

		// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery -- constant tables; prepared values.
		$rows = $wpdb->get_results( $wpdb->prepare(
			"SELECT i.asin, MIN(i.domain) AS domain
			 FROM $index i INNER JOIN $tbl s ON s.asin = i.asin
			 WHERE s.status = %s GROUP BY i.asin LIMIT %d",
			$status,
			$limit
		), ARRAY_A );
		if ( empty( $rows ) ) {
			return self::get_summary();
		}

		$items = array();
		foreach ( $rows as $r ) {
			$domain  = preg_replace( '/[^a-z0-9.]/', '', strtolower( (string) $r['domain'] ) );
			$items[] = array( 'asin' => $r['asin'], 'domain' => $domain ? $domain : 'amazon.com' );
		}
		$results = self::check_via_server( $items );

		$now = current_time( 'mysql', true );
		foreach ( $rows as $r ) {
			$res = isset( $results[ $r['asin'] ] ) ? $results[ $r['asin'] ] : array( 'unknown', 0 );
			// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery -- constant table; prepared values.
			$wpdb->query( $wpdb->prepare(
				"INSERT INTO $tbl (asin, status, http_code, last_checked) VALUES (%s, %s, %d, %s)
				 ON DUPLICATE KEY UPDATE status = VALUES(status), http_code = VALUES(http_code), last_checked = VALUES(last_checked)",
				$r['asin'],
				$res[0],
				(int) $res[1],
				$now
			) );
		}
		return self::get_summary();
	}
}
