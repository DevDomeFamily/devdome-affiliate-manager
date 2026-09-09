<?php
/**
 * Click Protection — known-bot detection. The verified-bot list, feed-sync and matchers now
 * live in the shared devdome-core library (one feed-sync for the whole DevDome suite), so
 * this class is just a thin wrapper for the click path. Fail-open by design: if core has no
 * list cached yet, is_bot() returns false so real visitors are never blocked.
 */

defined( 'ABSPATH' ) || exit;

class DEVDAFFI_Bots {

	/**
	 * Built-in User-Agent tokens (substring match, lowercase). This baseline works with no
	 * external service, so Click Protection functions on every install; the shared-core feed
	 * (self-hosted builds) only EXTENDS it. 'bot' is matched separately below to keep CUBOT
	 * phone UAs (a known false positive) out.
	 */
	const UA_BASELINE = array(
		'spider', 'crawl', 'scrape', 'slurp', 'curl/', 'wget/', 'python-', 'httpclient',
		'headlesschrome', 'phantomjs', 'lighthouse', 'pingdom', 'gtmetrix',
		'facebookexternalhit', 'bingpreview', 'semrush', 'ahrefs', 'mj12',
	);

	/**
	 * True when the request looks like a bot: its User-Agent matches the built-in baseline
	 * or the shared verified-bot list, OR its IP is in the Spamhaus DROP ranges (IPv4 +
	 * IPv6). An empty User-Agent is NOT treated as a bot (we don't second-guess a real
	 * client that hid its UA). $ip is optional — when supplied, the DROP check runs too.
	 *
	 * @param string $ua Request User-Agent.
	 * @param string $ip Client IP (optional).
	 * @return bool
	 */
	public static function is_bot( $ua, $ip = '' ) {
		$lc = strtolower( trim( (string) $ua ) );
		if ( '' !== $lc ) {
			foreach ( self::UA_BASELINE as $token ) {
				if ( false !== strpos( $lc, $token ) ) {
					return true;
				}
			}
			if ( false !== strpos( $lc, 'bot' ) && false === strpos( $lc, 'cubot' ) ) {
				return true;
			}
		}
		if ( function_exists( 'devdcorev1_ua_is_bot' ) && devdcorev1_ua_is_bot( (string) $ua ) ) {
			return true;
		}
		if ( '' !== (string) $ip && function_exists( 'devdcorev1_ip_in_drop' ) && devdcorev1_ip_in_drop( $ip ) ) {
			return true;
		}
		return false;
	}
}
