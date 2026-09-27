<?php
/**
 * REST API for the admin UI: read + save settings. Admin-only (manage_options).
 * Routes: GET/POST  /wp-json/devdaffi/v1/settings
 */

defined( 'ABSPATH' ) || exit;

class DEVDAFFI_Rest {

	public function __construct() {
		add_action( 'rest_api_init', array( $this, 'register' ) );
	}

	public function register() {
		// Every route runs inside a guard window (DESIGN.md 24): a query that failed during the request turns the
		// answer into a database error instead of "saved" / "no clicks" / "nothing to fix" (round 1).
		register_rest_route( 'devdaffi/v1', '/settings', array(
			array(
				'methods'             => 'GET',
				'callback'            => devdaffi_rest_guarded( array( $this, 'get_settings' ) ),
				'permission_callback' => array( $this, 'can_manage' ),
			),
			array(
				'methods'             => 'POST',
				'callback'            => devdaffi_rest_guarded( array( $this, 'save_settings' ) ),
				'permission_callback' => array( $this, 'can_manage' ),
			),
		) );

		register_rest_route( 'devdaffi/v1', '/scan', array(
			'methods'             => 'POST',
			'callback'            => devdaffi_rest_guarded( array( $this, 'run_scan' ) ),
			'permission_callback' => array( $this, 'can_manage' ),
		) );

		register_rest_route( 'devdaffi/v1', '/reset-bots', array(
			'methods'             => 'POST',
			'callback'            => devdaffi_rest_guarded( array( $this, 'reset_bots' ) ),
			'permission_callback' => array( $this, 'can_manage' ),
		) );

		register_rest_route( 'devdaffi/v1', '/reset-clicks', array(
			'methods'             => 'POST',
			'callback'            => devdaffi_rest_guarded( array( $this, 'reset_clicks' ) ),
			'permission_callback' => array( $this, 'can_manage' ),
		) );

		register_rest_route( 'devdaffi/v1', '/replace', array(
			'methods'             => 'POST',
			'callback'            => devdaffi_rest_guarded( array( $this, 'replace_asin' ) ),
			'permission_callback' => array( $this, 'can_manage' ),
		) );

		register_rest_route( 'devdaffi/v1', '/monitor', array(
			array(
				'methods'             => 'GET',
				'callback'            => devdaffi_rest_guarded( array( $this, 'get_monitor' ) ),
				'permission_callback' => array( $this, 'can_manage' ),
			),
			array(
				'methods'             => 'POST',
				'callback'            => devdaffi_rest_guarded( array( $this, 'run_monitor' ) ),
				'permission_callback' => array( $this, 'can_manage' ),
			),
		) );

		// Check Now run (Link Monitor job pattern): start / progress / tick / control.
		register_rest_route( 'devdaffi/v1', '/check-start', array(
			'methods'             => 'POST',
			'callback'            => devdaffi_rest_guarded( array( $this, 'check_start' ) ),
			'permission_callback' => array( $this, 'can_manage' ),
		) );
		register_rest_route( 'devdaffi/v1', '/check-progress', array(
			'methods'             => 'GET',
			'callback'            => devdaffi_rest_guarded( array( $this, 'check_progress' ) ),
			'permission_callback' => array( $this, 'can_manage' ),
		) );
		register_rest_route( 'devdaffi/v1', '/check-tick', array(
			'methods'             => 'POST',
			'callback'            => array( $this, 'check_tick' ), // the loopback path answers 202 and detaches; the guard wraps the page path inside
			'permission_callback' => array( $this, 'can_tick' ),
		) );
		register_rest_route( 'devdaffi/v1', '/check-control', array(
			'methods'             => 'POST',
			'callback'            => devdaffi_rest_guarded( array( $this, 'check_control' ) ),
			'permission_callback' => array( $this, 'can_manage' ),
			'args'                => array(
				'action' => array( 'required' => true, 'type' => 'string', 'enum' => array( 'pause', 'resume', 'cancel', 'dismiss' ) ),
			),
		) );

		register_rest_route( 'devdaffi/v1', '/monitor/by-status', array(
			'methods'             => 'GET',
			'callback'            => devdaffi_rest_guarded( array( $this, 'get_monitor_by_status' ) ),
			'permission_callback' => array( $this, 'can_manage' ),
		) );

		register_rest_route( 'devdaffi/v1', '/usage', array(
			'methods'             => 'GET',
			'callback'            => devdaffi_rest_guarded( array( $this, 'usage' ) ),
			'permission_callback' => array( $this, 'can_manage' ),
		) );
	}

	/**
	 * The admin meter: connection state + the account's monthly Link Radar quota
	 * (plan, limit, used, remaining, geo entitlement) proxied from the DevDome server —
	 * the site token never reaches the browser. No remote call before the user's first
	 * explicit connect action (G7), so a fresh install renders "Connect" with zero requests.
	 */
	public function usage() {
		return devdaffi_rest_success( self::usage_data( function_exists( 'devdcorev1_account_is_connected' ) && devdcorev1_account_is_connected() ) );
	}

	/** The meter as an array; $connected comes from the caller (the screen reconciles, an ability reads the stored verdict, round 3). */
	public static function usage_data( $connected ) {
		// NOT wp_nonce_url(): that entity-encodes the ampersand (&amp;) for HTML context, and
		// this URL travels through JSON into a React href — the browser would literally send
		// "amp;_wpnonce" and WordPress answers "The link you followed has expired."
		$connect_url = add_query_arg(
			array(
				'action'   => 'devdcorev1_connect_go',
				'_wpnonce' => wp_create_nonce( 'devdcorev1_connect_go' ),
			),
			admin_url( 'admin-post.php' )
		);
		if ( ! $connected && ! get_option( 'devdcorev1_connect_started', 0 ) ) {
			return array( 'connected' => false, 'connect_url' => $connect_url, 'usage' => null, 'state' => 'connect' );
		}
		$resp = wp_remote_get( DEVDAFFI_Monitor::API . '/usage?' . http_build_query( array(
			'site'       => (string) get_option( 'devdcorev1_site_id', '' ),
			'site_token' => (string) get_option( 'devdcorev1_site_token', '' ),
		) ), array( 'timeout' => 10 ) );
		$code = is_wp_error( $resp ) ? 0 : (int) wp_remote_retrieve_response_code( $resp );
		$data = is_wp_error( $resp ) ? array() : (array) json_decode( wp_remote_retrieve_body( $resp ), true );
		return array(
			'connected'   => (bool) $connected,
			'connect_url' => $connect_url,
			'usage'       => ( 200 === $code && ! empty( $data['ok'] ) ) ? $data : null,
			'state'       => ( 200 === $code && ! empty( $data['ok'] ) ) ? 'ok' : ( 401 === $code ? 'connect' : ( 429 === $code ? 'quota' : 'unavailable' ) ), // a 200 without ok is not "ok" (round 3)
		);
	}

	public function run_scan() {
		$r = DEVDAFFI_Scanner::full_scan();
		if ( empty( $r['ok'] ) ) {
			return new WP_Error( 'devdaffi_scan_failed', isset( $r['error'] ) ? (string) $r['error'] : __( 'The scan could not complete.', 'devdome-affiliate-manager' ), array( 'status' => 500, 'stats' => $r ) );
		}
		return devdaffi_rest_success( $r );
	}

	public function reset_bots() {
		DEVDAFFI_Clicks::reset_bots_blocked();
		$left = DEVDAFFI_Clicks::get_bots_blocked(); // read back: null = the read failed, an int = what the row holds (round 1)
		if ( null === $left || 0 !== (int) $left ) {
			return new WP_Error( 'devdaffi_reset_failed', __( 'The counter could not be reset (the delete did not land).', 'devdome-affiliate-manager' ), array( 'status' => 500 ) );
		}
		return devdaffi_rest_success( array( 'bots_blocked' => 0 ) );
	}

	/** The Reset clicks icon on a tag or rule row: one click row goes, read back gone (round 1: it used to change the screen only). */
	public function reset_clicks( WP_REST_Request $req ) {
		$key = self::click_key_for( (string) $req->get_param( 'key' ) );
		if ( '' === $key ) {
			return new WP_Error( 'bad_request', 'key must be a configured affiliate id, the default tag, or __rule__<rule id>.', array( 'status' => 400 ) );
		}
		if ( ! DEVDAFFI_Clicks::reset_key( $key ) ) {
			return new WP_Error( 'devdaffi_reset_failed', __( 'The click counter could not be reset (the delete did not land).', 'devdome-affiliate-manager' ), array( 'status' => 500 ) );
		}
		return devdaffi_rest_success( array( 'key' => $key, 'clicks' => 0, 'visitors' => 0 ) );
	}

	/** '' unless $key is a configured tag's affiliate id, the default tag, or a configured rule's __rule__ key. */
	public static function click_key_for( $key ) {
		$key = preg_replace( '/[^a-zA-Z0-9\-_.]/', '', (string) $key );
		if ( '' === $key ) {
			return '';
		}
		$s    = DEVDAFFI_Settings::get();
		$keys = array_map( 'strval', wp_list_pluck( $s['tags'], 'affiliate_id' ) );
		if ( '' !== (string) $s['default_tag'] ) {
			$keys[] = (string) $s['default_tag'];
		}
		foreach ( $s['auto_linker']['rules'] as $r ) {
			if ( isset( $r['id'] ) ) {
				$keys[] = '__rule__' . $r['id'];
			}
		}
		return in_array( $key, $keys, true ) ? $key : '';
	}

	public function get_monitor() {
		$p = DEVDAFFI_Monitor::get_problems( 100 );
		return devdaffi_rest_success( array(
			'summary'  => DEVDAFFI_Monitor::get_summary(),
			'problems' => $p['items'],
			'has_more' => $p['has_more'],
		) );
	}

	public function check_start( WP_REST_Request $req ) {
		$r = DEVDAFFI_Monitor::job_start();
		return is_wp_error( $r ) ? $r : devdaffi_rest_success( $r );
	}

	public function check_progress( WP_REST_Request $req ) {
		return devdaffi_rest_success( DEVDAFFI_Monitor::job_progress() );
	}

	/** The loopback request carries the internal key; anyone else needs manage_options. */
	public static function is_internal_tick() {
		$hdr = isset( $_SERVER['HTTP_X_DEVDAFFI_TICK'] ) ? sanitize_text_field( wp_unslash( $_SERVER['HTTP_X_DEVDAFFI_TICK'] ) ) : '';
		return '' !== $hdr && hash_equals( DEVDAFFI_Monitor::tick_key(), $hdr );
	}

	public function can_tick( WP_REST_Request $req ) {
		return self::is_internal_tick() ? true : $this->can_manage( $req );
	}

	/**
	 * POST /check-tick. From the screen: one batch, fresh progress back (guarded). From the loopback: nobody waits for
	 * the answer, so reply 202 at once, keep working after the caller hangs up, run one tick and arm the next one.
	 */
	public function check_tick( WP_REST_Request $req ) {
		if ( ! self::is_internal_tick() ) {
			$guarded = devdaffi_rest_guarded( function () {
				return devdaffi_rest_success( DEVDAFFI_Monitor::job_tick() ); // the loopback chain armed at start / resume keeps running beside the page
			} );
			return $guarded( $req );
		}
		ignore_user_abort( true );
		$detached = false;
		if ( function_exists( 'fastcgi_finish_request' ) && ! headers_sent() ) {
			status_header( 202 );
			header( 'Content-Type: application/json; charset=utf-8' );
			echo wp_json_encode( array( 'accepted' => true ) );
			fastcgi_finish_request();
			$detached = true;
		}
		DEVDAFFI_Monitor::job_internal_tick();
		if ( $detached ) {
			exit;
		}
		return rest_ensure_response( array( 'accepted' => true ) );
	}

	public function check_control( WP_REST_Request $req ) {
		$r = DEVDAFFI_Monitor::job_control( sanitize_key( (string) $req->get_param( 'action' ) ) );
		return is_wp_error( $r ) ? $r : devdaffi_rest_success( $r );
	}

	public function get_monitor_by_status( WP_REST_Request $req ) {
		$status = $req->get_param( 'status' );
		$limit  = (int) $req->get_param( 'limit' );
		$offset = (int) $req->get_param( 'offset' );
		return devdaffi_rest_success( DEVDAFFI_Monitor::get_by_status( $status, $limit ?: 50, $offset ) );
	}

	public function run_monitor( WP_REST_Request $req ) {
		// status=oos|dead → re-check only those (fixed ones flip back to Live); else a normal batch.
		$status  = $req->get_param( 'status' );
		$summary = in_array( $status, array( 'oos', 'dead', 'unknown' ), true )
			? DEVDAFFI_Monitor::recheck_status( $status )
			: DEVDAFFI_Monitor::check_batch();
		$p = DEVDAFFI_Monitor::get_problems( 100 );
		$read_failed = ! empty( $summary['error'] ); // round 9: a failed read is not a check that ran
		return devdaffi_rest_success( array(
			'ok'            => ! $read_failed, // round 4: the screen requires it, a partial or error body never passes as a check
			'message'       => $read_failed ? __( 'The check could not run: the database read failed. Nothing was changed.', 'devdome-affiliate-manager' ) : '',
			'summary'       => $summary,
			'problems'      => $p['items'],
			'has_more'      => $p['has_more'],
			'service_state' => (string) get_option( 'devdaffi_svc_state', '' ), // ok | connect | quota | unavailable: the screen tells the user when nothing was checked (round 1)
		) );
	}

	public function replace_asin( WP_REST_Request $req ) {
		$r = DEVDAFFI_Scanner::replace_asin( $req->get_param( 'old' ), $req->get_param( 'new' ) );
		if ( ! empty( $r['invalid'] ) ) {
			return new WP_Error( 'bad_request', 'Both ASINs must be 10 characters and different.', array( 'status' => 400 ) );
		}
		if ( ! empty( $r['busy'] ) ) {
			return new WP_Error( 'devdaffi_replace_busy', $r['error'], array( 'status' => 409 ) ); // round 7
		}
		if ( empty( $r['ok'] ) ) {
			// Some or all writes did not land: say which posts, never "replaced" (round 1); a post changed in part is named apart (round 2)
			$inc = isset( $r['inconsistent'] ) ? $r['inconsistent'] : array();
			$msg = sprintf( '%d post(s) changed. Untouched, as they were: %s. Changed in part (open and check them): %s.', (int) $r['pages'], $r['failed'] ? implode( ', ', $r['failed'] ) : 'none', $inc ? implode( ', ', $inc ) : 'none' );
			return new WP_Error( 'devdaffi_replace_partial', $msg, array( 'status' => 500, 'pages' => $r['pages'], 'failed' => $r['failed'], 'inconsistent' => $inc, 'unfinished' => isset( $r['unfinished'] ) ? $r['unfinished'] : array() ) );
		}
		DEVDAFFI_Monitor::recheck_asin( $r['new'] ); // so the replacement's status shows right away
		$p = DEVDAFFI_Monitor::get_problems( 100 );
		return devdaffi_rest_success( array(
			'ok'            => true,
			'service_state' => (string) get_option( 'devdaffi_svc_state', '' ), // round 4: the screen says when the new ASIN was not checked
			'pages'    => $r['pages'],
			'old'      => $r['old'],
			'new'        => $r['new'],
			'summary'    => DEVDAFFI_Monitor::get_summary(),
			'problems'   => $p['items'],
			'has_more'   => $p['has_more'],
			'unfinished' => isset( $r['unfinished'] ) ? $r['unfinished'] : array(), // round 4: an earlier interrupted replacement stays visible
		) );
	}

	public function can_manage() {
		return current_user_can( 'manage_options' );
	}

	public function get_settings() {
		$data           = DEVDAFFI_Settings::get();
		$data['clicks']  = (array) DEVDAFFI_Clicks::get_all();    // { affiliate_id: count }
		$data['visitors'] = (array) DEVDAFFI_Clicks::get_visitors(); // { affiliate_id: unique-visitor count }
		$data['bots_blocked'] = (int) DEVDAFFI_Clicks::get_bots_blocked(); // Click Protection counter
		$data['scan']    = DEVDAFFI_Scanner::get_stats(); // { links, pages, last_scan }
		$data['monitor_summary'] = DEVDAFFI_Monitor::get_summary(); // status counts
		$journal = get_option( DEVDAFFI_Scanner::JOURNAL, array() );
		$data['replace_unfinished'] = is_array( $journal ) ? array_map( 'intval', array_keys( $journal ) ) : array(); // round 6: an interrupted replacement is visible on load
		return devdaffi_rest_success( $data ); // a failed read behind any of these answers a database error, not zeros
	}

	public function save_settings( WP_REST_Request $req ) {
		$body = $req->get_json_params();
		if ( ! is_array( $body ) ) {
			return new WP_Error( 'bad_request', 'Invalid payload', array( 'status' => 400 ) );
		}
		$r = self::apply_settings( $body );
		if ( is_wp_error( $r ) ) {
			$r->add_data( array( 'status' => 400 ) );
			return $r;
		}
		if ( empty( $r['saved'] ) ) {
			return new WP_Error( 'devdaffi_save_failed', __( 'The settings could not be saved (the database write did not land). Nothing was changed.', 'devdome-affiliate-manager' ), array( 'status' => 500 ) );
		}
		$out           = $r['settings'];
		$out['saved']  = true;
		$out['pruned'] = ! empty( $r['pruned'] ); // round 9: false = the settings landed but old click rows are still there
		return devdaffi_rest_success( $out );
	}

	/**
	 * The one save path (screen and abilities): the body is MERGED onto the stored document (a partial body never
	 * wipes tags or rules), sanitized, persisted with a read-back, and only when the row holds it are the click rows
	 * of tags and rules that no longer exist dropped (round 1: the prune used to run on a failed write too).
	 * @return array{settings:array,saved:bool,leaves:array,pruned:bool}|WP_Error
	 */
	public static function apply_settings( array $body ) {
		$m = DEVDAFFI_Settings::merge( $body );
		if ( is_wp_error( $m ) ) {
			return $m;
		}
		$doc    = null === $m['doc'] ? DEVDAFFI_Settings::get() : $m['doc'];
		$clean  = DEVDAFFI_Settings::save( $doc );
		$saved  = (bool) DEVDAFFI_Settings::$last_saved;
		$pruned = false;
		if ( $saved ) {
			$keep = wp_list_pluck( $clean['tags'], 'affiliate_id' );
			foreach ( $clean['auto_linker']['rules'] as $r ) {
				$keep[] = '__rule__' . $r['id']; // keep auto-linker per-rule click rows too
			}
			if ( '' !== (string) $clean['default_tag'] ) {
				$keep[] = (string) $clean['default_tag']; // /go records clicks against the fallback tag too (round 1)
			}
			$keep[] = DEVDAFFI_Clicks::BOTS_KEY; // keep the bot-block counter
			$pruned = DEVDAFFI_Clicks::prune( $keep ); // drop orphaned click rows
		}
		return array( 'settings' => $clean, 'saved' => $saved, 'leaves' => $m['leaves'], 'pruned' => $pruned );
	}
}
