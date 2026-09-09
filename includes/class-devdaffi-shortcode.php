<?php
/**
 * [devdaffi_button] — renders an Amazon affiliate button.
 *
 *   [devdaffi_button asin="B08N5WRWNW"]   (generated mode → amazon/dp/ASIN)
 *   [devdaffi_button]                     (custom mode → settings custom_link)
 *   optional: url="…" (explicit href), text="…" (label), domain="amazon.co.uk"
 *
 * We only emit the <a>; the_content rewriter (priority 20, after do_shortcode at
 * 11) adds the resolved ?tag= + rel/target and honours exclusions automatically.
 */

defined( 'ABSPATH' ) || exit;

class DEVDAFFI_Shortcode {

	public function __construct() {
		add_shortcode( 'devdaffi_button', array( $this, 'render' ) );
	}

	public function render( $atts ) {
		$atts = shortcode_atts(
			array( 'asin' => '', 'url' => '', 'text' => '', 'domain' => '' ),
			$atts,
			'devdaffi_button'
		);
		$btn = DEVDAFFI_Settings::get()['button'] ?? array();

		$asin = preg_replace( '/[^A-Za-z0-9]/', '', (string) $atts['asin'] );

		// Marketplace: explicit attribute → saved default → amazon.com.
		$domain = strtolower( trim( (string) $atts['domain'] ) );
		if ( ! in_array( $domain, DEVDAFFI_Settings::DOMAINS, true ) ) {
			$saved  = isset( $btn['generated_domain'] ) ? strtolower( (string) $btn['generated_domain'] ) : '';
			$domain = in_array( $saved, DEVDAFFI_Settings::DOMAINS, true ) ? $saved : 'amazon.com';
		}

		$skip_tag = false;
		$href     = '';
		if ( '' !== trim( (string) $atts['url'] ) ) {
			$href = esc_url_raw( trim( (string) $atts['url'] ) );
		} elseif ( isset( $btn['link_mode'] ) && 'custom' === $btn['link_mode'] ) {
			$href = isset( $btn['custom_link'] ) ? (string) $btn['custom_link'] : '';
			// Custom links may carry an {ASIN} placeholder — fill it from the shortcode's asin.
			$href = str_ireplace( '{ASIN}', $asin, $href );
		} elseif ( '' !== $asin ) {
			$href     = 'https://www.' . $domain . '/dp/' . $asin;
			$skip_tag = ! empty( $btn['skip_tag'] );
		}
		if ( '' === $href ) {
			return ''; // nothing to link to
		}

		$text = '' !== trim( (string) $atts['text'] )
			? $atts['text']
			: ( ! empty( $btn['text'] ) ? $btn['text'] : 'Check Price On Amazon' );

		// Tag + rel/target now (don't rely on the_content — buttons live in widgets,
		// excerpts and page builders too). The_content rewriter is idempotent if it runs.
		$decorated = DEVDAFFI_Rewriter::decorate( $href, get_the_ID(), $skip_tag );

		return sprintf(
			'<a class="devdaffi-button" href="%s"%s>%s</a>',
			esc_url( $decorated['href'] ),
			$decorated['attr'], // safe: rel built from esc_attr, target is a literal
			esc_html( $text )
		);
	}
}
