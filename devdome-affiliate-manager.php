<?php
/**
 * Plugin Name: DevDome Affiliate Manager
 * Description: Amazon affiliate link management: auto-tagging, geo-localization, dead-link recovery, link-health monitoring, keyword auto-linking, click protection, and WooCommerce support.
 * Version: 1.1.6
 * Author: DevDome
 * Author URI: https://devdome.com
 * Text Domain: devdome-affiliate-manager
 * Requires at least: 6.0
 * Requires PHP: 7.4
 * License: GPLv2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 */

defined( 'ABSPATH' ) || exit;

// The WordPress.org zip ships this marker file (defines DEVDCOREV1_WPORG_BUILD) so the
// same codebase can switch off self-hosted updates and other non-wp.org behavior.
if ( file_exists( __DIR__ . '/wporg-build.php' ) ) {
	require __DIR__ . '/wporg-build.php';
}

define( 'DEVDAFFI_VERSION', '1.1.6' );
define( 'DEVDAFFI_FILE', __FILE__ );
define( 'DEVDAFFI_DIR', plugin_dir_path( __FILE__ ) );
define( 'DEVDAFFI_URL', plugin_dir_url( __FILE__ ) );
define( 'DEVDAFFI_OPTION', 'devdaffi_settings' );

// Shared bot-detection core (vendored, version-guarded — only the highest copy across all
// installed DevDome plugins loads). Provides the unified UA/ASN/DROP feed + matchers.
require_once DEVDAFFI_DIR . 'lib/devdome-core/loader.php';

// Legacy shared-state copy (old generic names -> devdcorev1_*) ships only in self-hosted
// builds: wp.org installs are fresh and have no old rows to move.
if (file_exists(DEVDAFFI_DIR . 'includes/aff-core-ids.php')) {
    require_once DEVDAFFI_DIR . 'includes/aff-core-ids.php';
}

// One-time legacy-identifier migration (pre-rename installs). Self-hosted builds only —
// stripped from the wp.org zip, where installs are fresh (.wporg-strip).
if ( file_exists( DEVDAFFI_DIR . 'includes/migrate.php' ) ) {
	require_once DEVDAFFI_DIR . 'includes/migrate.php';
}

require_once DEVDAFFI_DIR . 'includes/db-guard.php'; // DESIGN.md 24 / 24.5: failed-query guard + proved option writes (round 1)
add_filter( 'query', 'devdaffi_db_guard_record', 1 );
require_once DEVDAFFI_DIR . 'includes/class-devdaffi-settings.php';
require_once DEVDAFFI_DIR . 'includes/class-devdaffi-bots.php';
require_once DEVDAFFI_DIR . 'includes/class-devdaffi-clicks.php';
require_once DEVDAFFI_DIR . 'includes/class-devdaffi-scanner.php';
require_once DEVDAFFI_DIR . 'includes/class-devdaffi-monitor.php';
require_once DEVDAFFI_DIR . 'includes/class-devdaffi-resolver.php';
require_once DEVDAFFI_DIR . 'includes/class-devdaffi-rewriter.php';
require_once DEVDAFFI_DIR . 'includes/class-devdaffi-autolinker.php';
require_once DEVDAFFI_DIR . 'includes/class-devdaffi-go.php';
require_once DEVDAFFI_DIR . 'includes/class-devdaffi-rest.php';
require_once DEVDAFFI_DIR . 'includes/class-devdaffi-content.php';
require_once DEVDAFFI_DIR . 'includes/class-devdaffi-shortcode.php';
require_once DEVDAFFI_DIR . 'includes/class-devdaffi-woo.php';
require_once DEVDAFFI_DIR . 'includes/devdome-tools-menu.php';
require_once DEVDAFFI_DIR . 'includes/class-devdaffi-admin.php';
require_once DEVDAFFI_DIR . 'includes/abilities.php'; // WordPress Abilities API (6.9+): registers nothing on older cores

// Click-Fraud Filter: contribute this plugin's blocked bot-click count to DevDome Bot
// Protection's aggregate dashboard (decoupled — Bot Protection applies the filter).
add_filter( 'devdome_click_fraud_sources', function ( $sources ) {
	if ( class_exists( 'DEVDAFFI_Clicks' ) ) {
		$blocked = DEVDAFFI_Clicks::get_bots_blocked();
		if ( null !== $blocked ) {
			$sources[] = array(
				'key'     => 'affiliate',
				'label'   => 'Affiliate link clicks',
				'blocked' => (int) $blocked,
			);
		}
	}
	return $sources;
} );

// DevDome Tools hub: register this plugin in the suite dashboard.
add_filter( 'devdcorev1_suite_register', function ( $r ) {
	$r['devdome-affiliate-manager'] = array(
		'slug'     => 'devdome-affiliate-manager',
		'name'     => 'Affiliate Manager',
		'desc'     => 'Sitewide affiliate tags, geo-routing, link scanning &amp; click stats.',
		'icon'     => 'dashicons-admin-links',
		'version'  => defined( 'DEVDAFFI_VERSION' ) ? DEVDAFFI_VERSION : '',
		'page'     => 'devdome-affiliate-manager',
		'position' => 60,
		'schema'   => 1,
		'tiles'    => function () {
			// Read-only: served from the daily-cached summary (the getters are DB queries).
			$href   = 'admin.php?page=devdome-affiliate-manager';
			$sum    = get_option( 'devdaffi_hub_summary', array() );
			$clicks = ( is_array( $sum ) && isset( $sum['clicks'] ) ) ? (int) $sum['clicks'] : null;
			$bots   = ( is_array( $sum ) && isset( $sum['bots'] ) ) ? (int) $sum['bots'] : null;
			return array(
				array( 'label' => 'Total clicks',       'value' => $clicks, 'fmt' => 'int', 'state' => 'idle',                  'href' => $href ),
				array( 'label' => 'Bot clicks blocked', 'value' => $bots,   'fmt' => 'int', 'state' => $bots ? 'good' : 'idle', 'href' => $href ),
			);
		},
		'health'   => function () {
			$href   = admin_url( 'admin.php?page=devdome-affiliate-manager' );
			$sum    = get_option( 'devdaffi_hub_summary', array() );
			$clicks = ( is_array( $sum ) && isset( $sum['clicks'] ) ) ? (int) $sum['clicks'] : 0;
			$bots   = ( is_array( $sum ) && isset( $sum['bots'] ) ) ? (int) $sum['bots'] : 0;
			$total  = $clicks + $bots;
			$score  = $total > 0 ? (int) round( $clicks / $total * 100 ) : null; // % human (clean) clicks
			$issues = array(); // blocked bot clicks are Click Protection working, never an issue (owner, 29 Sep 2026)
			return array( 'score' => $score, 'status' => ( null === $score ? 'idle' : 'good' ), 'scope_label' => 'Affiliate', 'summary' => '', 'issues' => $issues );
		},
	);
	return $r;
} );

// S3: contribute a Recent-activity digest section (read-only, from the cached summary).
add_filter( 'devdcorev1_suite_report_sections', function ( $s ) {
	$sum    = get_option( 'devdaffi_hub_summary', array() );
	$clicks = ( is_array( $sum ) && isset( $sum['clicks'] ) ) ? (int) $sum['clicks'] : 0;
	$bots   = ( is_array( $sum ) && isset( $sum['bots'] ) ) ? (int) $sum['bots'] : 0;
	$s[]    = array( 'title' => 'Affiliate Manager', 'lines' => array( $clicks . ' affiliate clicks', $bots . ' bot clicks blocked' ) );
	return $s;
} );

// S4: cache the heavy click totals once a day (DEVDAFFI_Clicks getters are DB queries —
// never run on the hub render). The tiles above read the cached option.
add_action( 'devdaffi_hub_summary', 'devdaffi_compute_hub_summary' );
function devdaffi_compute_hub_summary() {
	if ( ! class_exists( 'DEVDAFFI_Clicks' ) ) {
		return;
	}
	$all  = DEVDAFFI_Clicks::get_all();          // tag => clicks (includes the bots row)
	$bots = DEVDAFFI_Clicks::get_bots_blocked();
	$vis  = DEVDAFFI_Clicks::get_visitors();
	if ( ! is_array( $all ) || null === $bots || ! is_array( $vis ) ) {
		return; // a failed read keeps the last good summary instead of caching zeros (round 1)
	}
	$clicks = 0;
	$visitors = 0;
	foreach ( $all as $k => $n ) { // a rule attribution row is the same click counted under its tag (round 2)
		if ( DEVDAFFI_Clicks::BOTS_KEY !== $k && 0 !== strpos( (string) $k, '__rule__' ) ) {
			$clicks += (int) $n;
		}
	}
	foreach ( $vis as $k => $n ) {
		if ( DEVDAFFI_Clicks::BOTS_KEY !== $k && 0 !== strpos( (string) $k, '__rule__' ) ) {
			$visitors += (int) $n;
		}
	}
	$sum = array( 'clicks' => $clicks, 'bots' => (int) $bots, 'visitors' => $visitors );
	update_option( 'devdaffi_hub_summary', $sum, false );
	if ( get_option( 'devdaffi_hub_summary' ) !== $sum ) {
		return; // the write did not land: the tiles keep the last good numbers, the next run retries (round 5)
	}
}
add_action( 'admin_init', function () {
	if ( ! wp_next_scheduled( 'devdaffi_hub_summary' ) ) {
		wp_schedule_event( time() + 300, 'daily', 'devdaffi_hub_summary' );
	}
	if ( false === get_option( 'devdaffi_hub_summary', false ) && false === get_transient( 'devdaffi_hub_summary_init' ) ) {
		set_transient( 'devdaffi_hub_summary_init', 1, HOUR_IN_SECONDS );
		wp_schedule_single_event( time() + 20, 'devdaffi_hub_summary' ); // populate soon after install/update
	}
} );

// Rewrite rule for /go must exist before flush on activation.
register_activation_hook( __FILE__, function () {
	add_option( DEVDAFFI_OPTION, DEVDAFFI_Settings::defaults(), '', 'no' ); // create non-autoloaded
	DEVDAFFI_Go::add_rewrite_rule();
	flush_rewrite_rules();
	update_option( 'devdaffi_rewrite_v', DEVDAFFI_VERSION, false );
	DEVDAFFI_Clicks::ensure_table();
	DEVDAFFI_Scanner::ensure_table();
	DEVDAFFI_Monitor::ensure_table();
	DEVDAFFI_Scanner::schedule_cron();
	// Click Protection must work from the first click: fetch the shared bot feed
	// synchronously now instead of waiting for the cron (which may be disabled).
	if ( function_exists( 'devdcorev1_refresh_feeds' ) ) {
		devdcorev1_refresh_feeds();
	}
} );
register_deactivation_hook( __FILE__, function () {
	flush_rewrite_rules();
	DEVDAFFI_Scanner::unschedule_cron();
	wp_clear_scheduled_hook( 'devdaffi_hub_summary' ); // scheduled without args on admin_init (round 3)
} );

add_action( 'plugins_loaded', function () {
	DEVDAFFI_Clicks::ensure_table();  // lazy create for sites updated without reactivation
	DEVDAFFI_Scanner::ensure_table();
	DEVDAFFI_Monitor::ensure_table();
	DEVDAFFI_Scanner::schedule_cron();
	new DEVDAFFI_Scanner();
	new DEVDAFFI_Monitor();
	new DEVDAFFI_Rewriter();
	new DEVDAFFI_Autolinker();
	new DEVDAFFI_Go();
	new DEVDAFFI_Rest();
	new DEVDAFFI_Content();
	new DEVDAFFI_Shortcode();
	new DEVDAFFI_Woo();
	if ( is_admin() ) {
		new DEVDAFFI_Admin();
	}
} );

// Flush rewrite rules once per version — covers drop-in/junctioned installs where
// the activation hook never ran, so /go always resolves. Runs after the rule is added (init:10).
add_action( 'init', function () {
	if ( get_option( 'devdaffi_rewrite_v' ) !== DEVDAFFI_VERSION ) {
		flush_rewrite_rules();
		update_option( 'devdaffi_rewrite_v', DEVDAFFI_VERSION, false );
	}
}, 11 );

// Front-end click interceptor → routes Amazon clicks through /go.
/**
 * The /go endpoint for THIS site. Plain permalinks (no rewrite rules) cannot route /go/, so such a site gets the
 * query form the same handler answers: /?devdaffi_go=1 (live click-through on test2, 2026-09-17: every /go link
 * landed on the home page). $u appended as the destination when given.
 */
function devdaffi_go_url( $u = '' ) {
	$base = '' === (string) get_option( 'permalink_structure' ) ? home_url( '/?devdaffi_go=1' ) : home_url( '/go/' );
	return '' === $u ? $base : add_query_arg( array( 'u' => $u ), $base );
}

add_action( 'wp_enqueue_scripts', function () {
	wp_register_script( 'devdaffi-front', DEVDAFFI_URL . 'assets/front.js', array(), DEVDAFFI_VERSION, true );
	$excluded = is_singular() && DEVDAFFI_Rewriter::is_excluded( get_the_ID() );
	$mobile   = DEVDAFFI_Settings::get()['mobile_app'];
	wp_localize_script( 'devdaffi-front', 'DEVDAFFI', array(
		'go'       => devdaffi_go_url(),
		'excluded' => $excluded ? 1 : 0,
		'mobile'   => array(
			'enabled'   => ! empty( $mobile['enabled'] ) ? 1 : 0,
			'iosSafari' => ! empty( $mobile['ios_safari_button'] ) ? 1 : 0,
		),
	) );
	wp_enqueue_script( 'devdaffi-front' );

	// Inline style for the [devdaffi_button] shortcode.
	wp_register_style( 'devdaffi-inline', false, array(), DEVDAFFI_VERSION );
	wp_enqueue_style( 'devdaffi-inline' );
	wp_add_inline_style( 'devdaffi-inline',
		'.devdaffi-button{display:inline-block;background:#ff9900;color:#111;font-weight:700;padding:10px 18px;border-radius:8px;text-decoration:none;border:1px solid #e0850b;box-shadow:0 1px 2px rgba(0,0,0,.1);transition:background .15s}.devdaffi-button:hover{background:#f08804;color:#111}'
	);
} );

/* DevDome suite self-hosted updates (admin/cron only — never on the front end).
   Omitted from the public WordPress.org build (updates come from wp.org there); the file_exists
   guard means its absence never fatals. The in-house "Fleet" build ships the updater file. */
if ( ! defined( 'DEVDCOREV1_WPORG_BUILD' ) ) {
	$devdaffi_updater_file = __DIR__ . '/includes/class-devdome-suite-updater.php';
	if ( file_exists( $devdaffi_updater_file ) && ( is_admin() || ( defined( 'DOING_CRON' ) && DOING_CRON ) ) ) {
		require_once $devdaffi_updater_file;
		new DEVDAFFI_Suite_Updater( __FILE__, 'devdome-affiliate-manager', 'https://api.devdome.com/plugin-updates/devdome-affiliate-manager.json' );
	}
}
