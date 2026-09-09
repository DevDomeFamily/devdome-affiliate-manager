<?php
/**
 * Admin page — mounts the React (Vite-built) UI inside an isolated <iframe> so
 * WordPress admin CSS cannot bleed into the design (pixel-identical to source).
 * The built bundle lives in assets/admin/ (index.js / index.css). REST root +
 * nonce are handed to the app via window.DEVDAFFI_ADMIN inside the frame.
 */

defined( 'ABSPATH' ) || exit;

class DEVDAFFI_Admin {

	const PAGE = 'devdome-affiliate-manager';

	public function __construct() {
		add_action( 'admin_menu', array( $this, 'add_menu' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'maybe_enqueue_for_suite' ) );
	}

	/**
	 * Suite integration: when the Product Importer plugin is also active and the user is
	 * viewing PI's admin pages, enqueue AM's bundle directly (NOT via iframe) so it can
	 * mount into PI's Link Control host slot. Standalone AM pages keep using the iframe.
	 */
	public function maybe_enqueue_for_suite( $hook ) {
		// Cheap guard — bail before doing any work on unrelated admin screens.
		if ( ! is_string( $hook ) || strpos( $hook, 'devdome-product-importer' ) === false ) {
			return;
		}
		// Verify PI is actually active (defensive — should be true if its page is loading).
		if ( ! function_exists( 'is_plugin_active' ) ) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}
		if ( ! is_plugin_active( 'devdome-product-importer/devdome-product-importer.php' ) ) {
			return;
		}

		$dir  = plugin_dir_path( dirname( __FILE__ ) );
		$css  = $dir . 'assets/admin/index.css';
		$js   = $dir . 'assets/admin/index.js';
		$cssv = file_exists( $css ) ? filemtime( $css ) : DEVDAFFI_VERSION;
		$jsv  = file_exists( $js )  ? filemtime( $js )  : DEVDAFFI_VERSION;

		wp_enqueue_style( 'devdaffi-suite', DEVDAFFI_URL . 'assets/admin/index.css', array(), $cssv );
		wp_enqueue_script( 'devdaffi-suite', DEVDAFFI_URL . 'assets/admin/index.js', array(), $jsv, true );

		$cfg = wp_json_encode( array(
			'rest'      => esc_url_raw( rest_url( 'devdaffi/v1/' ) ),
			'nonce'     => wp_create_nonce( 'wp_rest' ),
			'home'      => esc_url_raw( home_url( '/' ) ),
			'suiteMode' => true,
		) );
		wp_add_inline_script( 'devdaffi-suite', 'window.DEVDAFFI_ADMIN = ' . $cfg . ';', 'before' );

		add_filter( 'wp_script_attributes', array( $this, 'mark_suite_script_as_module' ) );
	}

	/** Core prints enqueued scripts through wp_get_script_tag(), so adding the module type
	 *  via the wp_script_attributes filter needs no tag-string building. */
	public function mark_suite_script_as_module( $attr ) {
		if ( isset( $attr['id'] ) && 'devdaffi-suite-js' === $attr['id'] ) {
			$attr['type'] = 'module';
		}
		return $attr;
	}

	public function add_menu() {
		// Suite integration: when the Product Importer is also active, AM's UI lives inside
		// PI's Link Control tab via the host slot — a standalone menu entry would just duplicate.
		// Skip entirely in that case.
		if ( ! function_exists( 'is_plugin_active' ) ) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}
		if ( is_plugin_active( 'devdome-product-importer/devdome-product-importer.php' ) ) {
			return;
		}

		// Standalone: join the DevDome Tools umbrella (same parent Analytics / Product Importer
		// register, position 3 so it lands after them). The parent menu is bootstrapped by
		// devdome-tools-menu.php (deduped if another DevDome plugin already registered it).
		add_submenu_page(
			defined( 'DEVDCOREV1_TOOLS_MENU_SLUG' ) ? DEVDCOREV1_TOOLS_MENU_SLUG : 'devdcorev1-tools',
			__( 'DevDome Affiliate Manager', 'devdome-affiliate-manager' ),
			__( 'Affiliate Manager', 'devdome-affiliate-manager' ),
			'manage_options',
			self::PAGE,
			array( $this, 'render' ),
			3
		);
	}

	public function render() {
		// Bust browser/CDN cache whenever the built bundle changes (the version constant
		// alone doesn't change on a same-version redeploy, so fixed filenames stay stale).
		$dir   = plugin_dir_path( dirname( __FILE__ ) );
		$cssv  = file_exists( $dir . 'assets/admin/index.css' ) ? filemtime( $dir . 'assets/admin/index.css' ) : DEVDAFFI_VERSION;
		$jsv   = file_exists( $dir . 'assets/admin/index.js' )  ? filemtime( $dir . 'assets/admin/index.js' )  : DEVDAFFI_VERSION;
		$css = DEVDAFFI_URL . 'assets/admin/index.css?v=' . $cssv;
		$js  = DEVDAFFI_URL . 'assets/admin/index.js?v=' . $jsv;
		$cfg = wp_json_encode( array(
			'rest'  => esc_url_raw( rest_url( 'devdaffi/v1/' ) ),
			'nonce' => wp_create_nonce( 'wp_rest' ),
			'home'  => esc_url_raw( home_url( '/' ) ),
			'bug'   => 'https://devdome.com/report-bug?plugin=devdome-affiliate-manager&v=' . DEVDAFFI_VERSION,
		) );
		// Inline page CSS + iframe bootstrap go through registered handles (src = false, the
		// documented core pattern) — no literal style/script markup is emitted from PHP. The
		// stylesheet + module are injected via the DOM inside the isolated iframe (they
		// can't be wp_enqueue'd into a srcdoc).
		wp_register_style( 'devdaffi-admin-frame', false, array(), DEVDAFFI_VERSION );
		wp_enqueue_style( 'devdaffi-admin-frame' );
		wp_add_inline_style( 'devdaffi-admin-frame',
			// No #wpcontent padding override: the page sits in the normal admin content area
			// (same left gutter/edge as Redirect Manager and every other DevDome plugin).
			'#wpbody-content{padding-bottom:0}#wpfooter{display:none}.devdaffi-frame{width:100%;height:calc(100vh - 46px);border:0;display:block}'
		);

		$boot = '( function () {'
			. 'var cfg = ' . $cfg . ';'
			. 'var cssUrl = ' . wp_json_encode( $css ) . ';'
			. 'var jsUrl = ' . wp_json_encode( $js ) . ';'
			. 'var doc = \'<!doctype html><html><head><meta charset="utf-8">\''
			. ' + \'<meta name="viewport" content="width=device-width,initial-scale=1">\''
			. ' + \'</head><body><div id="devdaffi-root"></div>\''
			. ' + \'<scr\' + \'ipt>\''
			. ' + \'window.DEVDAFFI_ADMIN=\' + JSON.stringify( cfg ) + \';\''
			. ' + \'(function(){var l=document.createElement("link");l.rel="stylesheet";l.href=\' + JSON.stringify( cssUrl ) + \';document.head.appendChild(l);\''
			. ' + \'var s=document.createElement("script");s.type="module";s.src=\' + JSON.stringify( jsUrl ) + \';document.body.appendChild(s);})();\''
			. ' + \'</scr\' + \'ipt>\''
			. ' + \'</body></html>\';'
			. 'document.getElementById( "devdaffi-frame" ).srcdoc = doc;'
			. '} )();';
		wp_register_script( 'devdaffi-admin-boot', false, array(), DEVDAFFI_VERSION, true );
		wp_enqueue_script( 'devdaffi-admin-boot' );
		wp_add_inline_script( 'devdaffi-admin-boot', $boot );

		echo '<iframe id="devdaffi-frame" class="devdaffi-frame" title="DevDome Affiliate Manager"></iframe>';
	}
}
