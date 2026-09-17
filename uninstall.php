<?php
/**
 * Uninstall — remove all plugin data (options, click table, transients).
 */

defined( 'WP_UNINSTALL_PLUGIN' ) || exit;

// phpcs:disable WordPress.DB.DirectDatabaseQuery, WordPress.DB.PreparedSQL.InterpolatedNotPrepared, PluginCheck.Security.DirectDB.UnescapedDBParameter -- Uninstall cleanup of the plugin's own custom tables; names are constant.

function devdaffi_uninstall_site() {
	global $wpdb;

	delete_option( 'devdaffi_settings' );
	delete_option( 'devdaffi_clicks_db' );
	delete_option( 'devdaffi_index_db' );
	delete_option( 'devdaffi_status_db' );
	delete_option( 'devdaffi_last_scan' );
	delete_option( 'devdaffi_rewrite_v' );
	delete_option( 'devdaffi_hub_summary' );
	delete_option( 'devdaffi_migrated_ids' );
	delete_option( 'devdaffi_core_ids_migrated' );
	delete_option( 'devdaffi_svc_state' );
	delete_option( 'devdaffi_usage' );
	delete_option( 'devdaffi_replace_journal' );
	delete_option( 'devdaffi_replace_lock' );
	delete_transient( 'devdaffi_hub_summary_init' );
	wp_clear_scheduled_hook( 'devdaffi_scan_cron' );
	wp_clear_scheduled_hook( 'devdaffi_hub_summary' );

	$clicks = $wpdb->prefix . 'devdaffi_clicks';
	$index  = $wpdb->prefix . 'devdaffi_index';
	$status = $wpdb->prefix . 'devdaffi_status';
	// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery -- constant table names, uninstall cleanup.
	$wpdb->query( "DROP TABLE IF EXISTS {$clicks}" );
	// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery -- constant table names, uninstall cleanup.
	$wpdb->query( "DROP TABLE IF EXISTS {$index}" );
	// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery -- constant table names, uninstall cleanup.
	$wpdb->query( "DROP TABLE IF EXISTS {$status}" );

	// Leftover /go redirect-resolution + unique-visitor transients (esc_like: no reliance on backslash escapes, round 1).
	// phpcs:ignore WordPress.DB.DirectDatabaseQuery
	$wpdb->query( $wpdb->prepare(
		"DELETE FROM {$wpdb->options} WHERE option_name LIKE %s OR option_name LIKE %s",
		$wpdb->esc_like( '_transient_devdaffi_' ) . '%',
		$wpdb->esc_like( '_transient_timeout_devdaffi_' ) . '%'
	) );
}

// Shared-core cleanup runs per blog too: $wpdb->options follows switch_to_blog(), and the shared identity rows
// live in every site's options table (round 1, same as Analytics).
require_once __DIR__ . '/lib/devdome-core/uninstall.php';
if ( is_multisite() ) {
	$devdaffi_site_ids = get_sites( array( 'fields' => 'ids', 'number' => 0 ) );
	foreach ( $devdaffi_site_ids as $devdaffi_site_id ) {
		if ( ! switch_to_blog( (int) $devdaffi_site_id ) ) {
			continue; // never clean the wrong site
		}
		devdaffi_uninstall_site();
		devdcorev1_uninstall_cleanup( 'devdome-affiliate-manager/devdome-affiliate-manager.php' );
		restore_current_blog();
	}
} else {
	devdaffi_uninstall_site();
	devdcorev1_uninstall_cleanup( 'devdome-affiliate-manager/devdome-affiliate-manager.php' );
}
