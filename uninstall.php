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

	// Leftover /go redirect-resolution + unique-visitor transients.
	// phpcs:ignore WordPress.DB.DirectDatabaseQuery
	$wpdb->query( "DELETE FROM {$wpdb->options} WHERE option_name LIKE '\_transient\_devdaffi\_%' OR option_name LIKE '\_transient\_timeout\_devdaffi\_%'" );
}

if ( is_multisite() ) {
	$devdaffi_site_ids = get_sites( array( 'fields' => 'ids', 'number' => 0 ) );
	foreach ( $devdaffi_site_ids as $devdaffi_site_id ) {
		switch_to_blog( $devdaffi_site_id );
		devdaffi_uninstall_site();
		restore_current_blog();
	}
} else {
	devdaffi_uninstall_site();
}

// Coordinate shared-core cleanup (only if this is the last DevDome plugin installed).
require_once __DIR__ . '/lib/devdome-core/uninstall.php';
devdcorev1_uninstall_cleanup( 'devdome-affiliate-manager/devdome-affiliate-manager.php' );
