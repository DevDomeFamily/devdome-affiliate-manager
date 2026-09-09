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
		register_rest_route( 'devdaffi/v1', '/settings', array(
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_settings' ),
				'permission_callback' => array( $this, 'can_manage' ),
			),
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'save_settings' ),
				'permission_callback' => array( $this, 'can_manage' ),
			),
		) );

		register_rest_route( 'devdaffi/v1', '/scan', array(
			'methods'             => 'POST',
			'callback'            => array( $this, 'run_scan' ),
			'permission_callback' => array( $this, 'can_manage' ),
		) );

		register_rest_route( 'devdaffi/v1', '/reset-bots', array(
			'methods'             => 'POST',
			'callback'            => array( $this, 'reset_bots' ),
			'permission_callback' => array( $this, 'can_manage' ),
		) );

		register_rest_route( 'devdaffi/v1', '/replace', array(
			'methods'             => 'POST',
			'callback'            => array( $this, 'replace_asin' ),
			'permission_callback' => array( $this, 'can_manage' ),
		) );

		register_rest_route( 'devdaffi/v1', '/monitor', array(
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_monitor' ),
				'permission_callback' => array( $this, 'can_manage' ),
			),
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'run_monitor' ),
				'permission_callback' => array( $this, 'can_manage' ),
			),
		) );

		register_rest_route( 'devdaffi/v1', '/monitor/by-status', array(
			'methods'             => 'GET',
			'callback'            => array( $this, 'get_monitor_by_status' ),
			'permission_callback' => array( $this, 'can_manage' ),
		) );

		register_rest_route( 'devdaffi/v1', '/usage', array(
			'methods'             => 'GET',
			'callback'            => array( $this, 'usage' ),
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
		$connected   = function_exists( 'devdcorev1_account_is_connected' ) && devdcorev1_account_is_connected();
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
			return rest_ensure_response( array( 'connected' => false, 'connect_url' => $connect_url, 'usage' => null, 'state' => 'connect' ) );
		}
		$resp = wp_remote_get( DEVDAFFI_Monitor::API . '/usage?' . http_build_query( array(
			'site'       => (string) get_option( 'devdcorev1_site_id', '' ),
			'site_token' => (string) get_option( 'devdcorev1_site_token', '' ),
		) ), array( 'timeout' => 10 ) );
		$code = is_wp_error( $resp ) ? 0 : (int) wp_remote_retrieve_response_code( $resp );
		$data = is_wp_error( $resp ) ? array() : (array) json_decode( wp_remote_retrieve_body( $resp ), true );
		return rest_ensure_response( array(
			'connected'   => $connected,
			'connect_url' => $connect_url,
			'usage'       => ( 200 === $code && ! empty( $data['ok'] ) ) ? $data : null,
			'state'       => 200 === $code ? 'ok' : ( 401 === $code ? 'connect' : ( 429 === $code ? 'quota' : 'unavailable' ) ),
		) );
	}

	public function run_scan() {
		return rest_ensure_response( DEVDAFFI_Scanner::full_scan() );
	}

	public function reset_bots() {
		DEVDAFFI_Clicks::reset_bots_blocked();
		return rest_ensure_response( array( 'bots_blocked' => 0 ) );
	}

	public function get_monitor() {
		return rest_ensure_response( array(
			'summary'  => DEVDAFFI_Monitor::get_summary(),
			'problems' => DEVDAFFI_Monitor::get_problems( 100 ),
		) );
	}

	public function get_monitor_by_status( WP_REST_Request $req ) {
		$status = $req->get_param( 'status' );
		$limit  = (int) $req->get_param( 'limit' );
		$offset = (int) $req->get_param( 'offset' );
		return rest_ensure_response( DEVDAFFI_Monitor::get_by_status( $status, $limit ?: 50, $offset ) );
	}

	public function run_monitor( WP_REST_Request $req ) {
		// status=oos|dead → re-check only those (fixed ones flip back to Live); else a normal batch.
		$status  = $req->get_param( 'status' );
		$summary = in_array( $status, array( 'oos', 'dead' ), true )
			? DEVDAFFI_Monitor::recheck_status( $status )
			: DEVDAFFI_Monitor::check_batch();
		return rest_ensure_response( array(
			'summary'  => $summary,
			'problems' => DEVDAFFI_Monitor::get_problems( 100 ),
		) );
	}

	public function replace_asin( WP_REST_Request $req ) {
		$r = DEVDAFFI_Scanner::replace_asin( $req->get_param( 'old' ), $req->get_param( 'new' ) );
		if ( empty( $r['ok'] ) ) {
			return new WP_Error( 'bad_request', 'Both ASINs must be 10 characters and different.', array( 'status' => 400 ) );
		}
		DEVDAFFI_Monitor::recheck_asin( $r['new'] ); // so the replacement's status shows right away
		return rest_ensure_response( array(
			'ok'       => true,
			'pages'    => $r['pages'],
			'old'      => $r['old'],
			'new'      => $r['new'],
			'summary'  => DEVDAFFI_Monitor::get_summary(),
			'problems' => DEVDAFFI_Monitor::get_problems(),
		) );
	}

	public function can_manage() {
		return current_user_can( 'manage_options' );
	}

	public function get_settings() {
		$data           = DEVDAFFI_Settings::get();
		$data['clicks']  = DEVDAFFI_Clicks::get_all();    // { affiliate_id: count }
		$data['visitors'] = DEVDAFFI_Clicks::get_visitors(); // { affiliate_id: unique-visitor count }
		$data['bots_blocked'] = DEVDAFFI_Clicks::get_bots_blocked(); // Click Protection counter
		$data['scan']    = DEVDAFFI_Scanner::get_stats(); // { links, pages, last_scan }
		$data['monitor_summary'] = DEVDAFFI_Monitor::get_summary(); // status counts
		return rest_ensure_response( $data );
	}

	public function save_settings( WP_REST_Request $req ) {
		$body = $req->get_json_params();
		if ( ! is_array( $body ) ) {
			return new WP_Error( 'bad_request', 'Invalid payload', array( 'status' => 400 ) );
		}
		$clean = DEVDAFFI_Settings::save( $body );
		$keep  = wp_list_pluck( $clean['tags'], 'affiliate_id' );
		foreach ( $clean['auto_linker']['rules'] as $r ) {
			$keep[] = '__rule__' . $r['id']; // keep auto-linker per-rule click rows too
		}
		$keep[] = DEVDAFFI_Clicks::BOTS_KEY; // keep the bot-block counter
		DEVDAFFI_Clicks::prune( $keep ); // drop orphaned click rows
		return rest_ensure_response( $clean );
	}
}
