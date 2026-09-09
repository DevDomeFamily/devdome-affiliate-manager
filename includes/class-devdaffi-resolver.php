<?php
/**
 * Resolves which affiliate_id applies to a given post + Amazon domain.
 * Priority: Post/Page rule > Category rule > Sitewide. Disabled tags are ignored.
 */

defined( 'ABSPATH' ) || exit;

class DEVDAFFI_Resolver {

	/** @return string affiliate_id, or '' if no tag applies for this domain. */
	public static function resolve( $post_id, $domain ) {
		$settings = DEVDAFFI_Settings::get();
		$post_id  = (int) $post_id;

		$candidates = array_filter(
			$settings['tags'],
			function ( $t ) use ( $domain ) {
				return ! empty( $t['enabled'] ) && $t['domain'] === $domain && '' !== $t['affiliate_id'];
			}
		);
		if ( empty( $candidates ) ) {
			return '';
		}

		$post_type = $post_id ? get_post_type( $post_id ) : '';
		$cat_ids   = ( $post_id && 'post' === $post_type ) ? wp_get_post_categories( $post_id ) : array();

		// 1) Post/Page rule (highest priority).
		foreach ( $candidates as $t ) {
			if ( 'rules' !== $t['mode'] ) {
				continue;
			}
			$ids = ( 'page' === $post_type ) ? $t['rules']['pages'] : $t['rules']['posts'];
			if ( in_array( $post_id, $ids, true ) ) {
				return $t['affiliate_id'];
			}
		}

		// 2) Category rule.
		if ( $cat_ids ) {
			foreach ( $candidates as $t ) {
				if ( 'rules' !== $t['mode'] ) {
					continue;
				}
				if ( array_intersect( $cat_ids, $t['rules']['post_cats'] ) ) {
					return $t['affiliate_id'];
				}
			}
		}

		// 3) Sitewide (weakest — fills the gaps). First enabled wins.
		foreach ( $candidates as $t ) {
			if ( 'sitewide' === $t['mode'] ) {
				return $t['affiliate_id'];
			}
		}

		return '';
	}
}
