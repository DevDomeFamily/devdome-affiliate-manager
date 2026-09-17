<?php
/**
 * WooCommerce external-product button rewrite — RUNTIME ONLY (no product writes).
 *
 * When enabled, the add-to-cart button URL of a product whose link carries an Amazon
 * ASIN (e.g. an external/affiliate product, or a redirect like .../i/ASIN/) is rewritten
 * on render to route through /go, so it inherits the affiliate tag, geo-redirect, click
 * tracking and the mobile app opener. Applied via a filter at display time — it never
 * updates a single product in the database, so it scales to any number of products with
 * zero bulk write. Gated by the `woo_button_rewrite` setting.
 */

defined( 'ABSPATH' ) || exit;

class DEVDAFFI_Woo {

	public function __construct() {
		// Frontend display only — never filter in wp-admin, so the product-edit "Product URL" field keeps
		// showing the real stored value (and a Save there never bakes the custom link into the product).
		if ( is_admin() ) {
			return;
		}
		$s   = DEVDAFFI_Settings::get();
		$btn = ( isset( $s['button'] ) && is_array( $s['button'] ) ) ? $s['button'] : array();
		// Run when EITHER Woo-button rewriting is on (generated → /go: tag/geo/tracking/app-opener) OR a
		// CUSTOM link is set. A custom link must "just apply" to EVERY external buy button (homepage,
		// catalog, single product) — they all read the same add-to-cart URL — so it stays consistent and
		// changes the moment you save it. Display-time only; no product is ever written.
		$custom = ! empty( $btn['link_mode'] ) && 'custom' === $btn['link_mode'] && ! empty( $btn['custom_link'] );
		if ( empty( $s['woo_button_rewrite'] ) && ! $custom ) {
			return;
		}
		add_filter( 'woocommerce_product_add_to_cart_url', array( __CLASS__, 'rewrite_url' ), 20 );
		add_filter( 'woocommerce_product_get_product_url', array( __CLASS__, 'rewrite_url' ), 20 );
	}

	/**
	 * Rewrite an external/affiliate buy URL that embeds an Amazon ASIN (…/dp/, …/gp/product/ or a
	 * redirect like …/i/ASIN/). CUSTOM link mode → return your custom URL (e.g. raifords/p/{ASIN}) so
	 * every button matches the one you set. Otherwise → the /go resolver (affiliate tag + geo + app
	 * opener). Non-ASIN URLs (a simple product's ?add-to-cart= link) don't match and pass through.
	 */
	public static function rewrite_url( $url ) {
		$path = (string) wp_parse_url( (string) $url, PHP_URL_PATH ); // the path only: a query or fragment holding /dp/ASIN is not a product link (round 3)
		if ( ! preg_match( '#/(?:dp|gp/product|i)/([A-Z0-9]{10})(?![A-Z0-9])#i', $path, $m ) ) {
			return $url;
		}
		$asin = strtoupper( $m[1] );
		// The host is judged BEFORE either rewrite mode (round 6): another merchant's /dp/ path is never rewritten.
		$host  = strtolower( (string) wp_parse_url( (string) $url, PHP_URL_HOST ) );
		$store = DEVDAFFI_Rewriter::storefront_domain( $host );
		if ( '' === $store && $host !== DEVDAFFI_Scanner::own_host() ) {
			return $url; // another site's /dp/ path is not an Amazon product link (round 5)
		}
		$btn = DEVDAFFI_Settings::get()['button'];
		if ( ! empty( $btn['link_mode'] ) && 'custom' === $btn['link_mode'] && ! empty( $btn['custom_link'] ) ) {
			return str_ireplace( '{ASIN}', $asin, (string) $btn['custom_link'] );
		}
		// A link that already names an Amazon storefront keeps it (an amazon.co.uk product stays on amazon.co.uk,
		// round 1); only a store-less redirect form (/i/ASIN) uses the marketplace the user selected.
		$gen   = '' !== $store ? $store : ( ! empty( $btn['generated_domain'] ) ? $btn['generated_domain'] : 'amazon.com' );
		$amazon = 'https://www.' . $gen . '/dp/' . $asin;
		return devdaffi_go_url( $amazon ); // plain-permalink sites get the query form
	}
}
