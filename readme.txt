=== DevDome Affiliate Manager – Amazon Affiliate Links, Auto Tagging & Link Monitor ===
Contributors: devdome
Tags: affiliate, amazon, affiliate links, woocommerce, redirect
Requires at least: 6.0
Tested up to: 7.1
Requires PHP: 7.4
Stable tag: 1.0.6
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Amazon affiliate plugin for WordPress. Auto-tag Amazon Associates IDs, localize Amazon stores, monitor dead affiliate links and track clicks.

== Description ==

= Amazon Affiliate Link Manager for WordPress =

DevDome Affiliate Manager helps WordPress publishers manage, optimize and monitor Amazon affiliate links from one dashboard.

Automatically add your Amazon Associates tracking IDs, localize Amazon links for international visitors, find dead or out-of-stock product links, recover broken affiliate links, track clicks and automatically create affiliate links from keywords.

Built for blogs, affiliate websites, product review sites and WooCommerce stores using Amazon Associates.

= Automatically Tag Amazon Affiliate Links =

Add your Amazon Associates tag once and automatically apply it to Amazon links across your WordPress site.

You can:

* Auto-tag existing and new Amazon affiliate links
* Set different Amazon Associates IDs for supported Amazon stores (22 marketplaces)
* Apply tags sitewide or create rules for individual posts, pages and categories
* Automatically add `rel="nofollow sponsored"`
* Open affiliate links in a new tab
* Create tagged Amazon buttons from an ASIN or custom Amazon URL

No need to manually edit every Amazon link when you change or add an affiliate tracking ID.

= Amazon Geo Localization =

Send international visitors to the appropriate Amazon marketplace while keeping your affiliate tracking tag.

Add your affiliate IDs for the Amazon stores you use and DevDome Affiliate Manager can automatically localize qualifying Amazon links based on the visitor's country.

This provides an alternative way to handle Amazon link localization directly from WordPress.

If no affiliate tag is configured for the visitor's local Amazon store, the original Amazon link is preserved.

Geo localization requires a connected DevDome account with geo routing included in its plan. Details are in the External services section below.

= Amazon Link Monitor =

Find broken Amazon affiliate links before they waste clicks and commissions.

Link Radar scans your WordPress content and WooCommerce external products for Amazon links and monitors product availability.

Amazon links can be classified as:

* Live
* Out of stock
* 404 / unavailable

Run link checks manually or enable scheduled monitoring. Link checks run through the hosted DevDome service and require a connected DevDome account, which is free to create.

= Dead Amazon Link Recovery =

Amazon products disappear, go out of stock and change constantly.

DevDome Affiliate Manager can automatically recover dead affiliate traffic instead of sending visitors to useless product pages.

Depending on the link status, you can send visitors to:

* A relevant live replacement product
* An Amazon search results page
* The original destination

A bulk Replace ASIN tool also lets you replace broken Amazon products directly from the WordPress dashboard.

= Amazon Affiliate Click Tracking =

Amazon clicks can route through the plugin's `/go` redirect endpoint so you can measure affiliate-link activity from WordPress.

Track:

* Total affiliate clicks
* Unique clicks
* Link performance
* Amazon product activity

The redirect validates Amazon destinations and prevents the endpoint from becoming an open redirect. Unique-click counts use a temporary pseudonymous fingerprint (a hash of the visitor's IP address and browser user agent, kept for 30 minutes); the raw IP address and user agent are not stored by the click statistics.

= Keyword Auto-Linker =

Automatically turn selected words and phrases into Amazon affiliate links.

Create keyword rules with:

* Exact or flexible matching
* Per-page link limits
* Automatic Amazon tagging
* Existing-link exclusions
* Heading and code exclusions

This can help monetize older WordPress content without manually adding affiliate links to every article.

= WooCommerce Amazon Affiliate Links =

Using WooCommerce external or affiliate products?

DevDome Affiliate Manager can automatically route WooCommerce external product buttons through the affiliate-link system and apply the correct Amazon Associates tag.

= Click Protection =

Prevent known bots and automated crawlers from generating misleading affiliate click statistics.

Click Protection uses a built-in bot list and does not require an external bot-detection service.

= Amazon Mobile App Opener =

Optionally help mobile visitors open Amazon product links in the Amazon app when supported.

Android visitors can use the Amazon app intent, while supported iOS in-app browser situations can offer an Open in Safari option.

= Built for Amazon Associates Publishers =

DevDome Affiliate Manager combines the functions normally handled by several separate WordPress affiliate tools:

* Amazon affiliate link manager with Associates auto tagging
* Amazon geo localization
* Amazon link checker and dead link monitor
* Broken affiliate link recovery
* Affiliate click tracker
* Keyword auto linker and WooCommerce affiliate links

Manage your Amazon affiliate links from one WordPress plugin while keeping control over which features you enable.

DevDome Affiliate Manager is an independent project. Amazon, Amazon Associates and OneLink are trademarks of Amazon.com, Inc. or its affiliates. This plugin is not endorsed by, sponsored by or otherwise affiliated with Amazon.

== External services ==

**Plugin catalog (`devdome.com`).** The DevDome Dashboard inside wp-admin fetches the list of DevDome plugins (names, descriptions, logos, links, WordPress.org slugs) from `https://devdome.com/wp-plugins/catalog.json` at most once every 12 hours, so the list stays current. Only the bundled core version is sent in the request; no site or visitor data. Service provider: DevDome. Terms: https://devdome.com/terms-of-service Privacy policy: https://devdome.com/privacy-policy

This plugin talks to the DevDome server at **https://api.devdome.com** for the features that need data a plugin cannot ship (a geo-IP database, an Amazon status checker). API keys stay on the server; you never paste one.

Terms of service: https://devdome.com/terms-of-service
Privacy policy: https://devdome.com/privacy-policy

= Link Radar status checks, https://api.devdome.com/amazon-404-oos-checker =

**/check-batch** sends the Amazon **ASINs** found by your link scan, with each one's Amazon domain, to classify them as live / out of stock / 404. It runs when you press Check Now, and on the Link Radar schedule only while automatic re-scans are enabled; a fresh install that has never scanned makes no request.

**/search** sends a product **keyword** (built from the product's title or metadata) to find a live replacement product. It is used by the bulk Replace ASIN tool and, when you enable per-status dead-link recovery, at click time. No visitor data is in either request.

Both are part of the hosted Link Radar service and require a **connected DevDome account**. Creating the account costs nothing: each request carries this site's domain and secret token so the service can meter usage. The free plan includes **500 checks + searches per month** per account; paid plans raise the limit (20,000 / 50,000 / 100,000, see devdome.com/pricing). The plugin shows your live usage meter on its settings screen. When the site is not connected or the monthly limit is reached, the service answers with an error and the plugin simply leaves link statuses unchanged, so nothing on your site breaks.

= Geo-localization, https://api.devdome.com/geo-resolve =

Off by default. When you enable it, each `/go` click sends the **visitor's IP address** and the destination ASIN/domain, plus this site's domain and secret token, so the server can pick the visitor's local Amazon store from the stores you have a tag for. The IP is used for the country lookup only and cached briefly. Enable this feature only if you want visitor IPs used for country detection. Geo store-routing is part of the hosted DevDome service and is **free with a connected DevDome account**; without one, visitors simply keep the original link.

= DevDome account, https://api.devdome.com/plugin/account, /plugin/disconnect and https://analytics.devdome.com/api/plugin/connect/* =

Made by the shared DevDome library bundled with every plugin in the suite, and never before you have acted: until you press a Connect button, save an Account ID or complete a connection, no account request is made. The account check is a GET carrying this site's domain and its secret token, answered with the Account ID and account email address the token belongs to. Disconnect is a POST with the same two fields, sent only when you press Disconnect. Pressing Connect registers a short-lived connect request (`/api/plugin/connect/start`, a POST with the site domain and token) and, after you authorize on devdome.com, the plugin collects the resulting Account ID server-to-server (`/api/plugin/connect/claim`, same fields plus the request handle); the Account ID and token never travel in your browser's URL. `https://devdome.com/connect/` is a link you click, not a request the plugin makes: your browser goes there to sign in and comes back.

= Amazon =

At click time the `/go` endpoint expands Amazon shortlinks (amzn.to, a.co, …) by requesting them server-side from Amazon, so the final product URL can be validated and tagged. The result is cached for 12 hours. Only the shortlink URL is requested; no visitor data is sent to Amazon by the plugin.

This service is provided by Amazon.com, Inc.: [Conditions of Use](https://www.amazon.com/gp/help/customer/display.html?nodeId=GLSBYFE9MGKKQXXM), [Privacy Notice](https://www.amazon.com/gp/help/customer/display.html?nodeId=GX7NJQ4ZB8MHFRNJ).

= Not contacted on this WordPress.org build =

The bundled shared library also references endpoints this build never calls: the `https://api.devdome.com/bot-protection/` signature feeds (Click Protection here uses the plugin's built-in bot list; no feed is fetched and no feed cron is scheduled) and `https://api.devdome.com/plugin-updates/` (self-hosted updates, disabled here; updates come only from WordPress.org).

= Never sent, in any request =

* Passwords and password hashes.
* Visitor form input, names or email addresses.
* Post, page, comment or any other WordPress content: the link scanner runs locally, and only the extracted ASINs leave the site.

== Installation ==

1. Upload the plugin ZIP via Plugins → Add New → Upload Plugin, or copy the folder to `wp-content/plugins/`.
2. Activate it.
3. Go to the DevDome Affiliate Manager admin page, add your Amazon affiliate tag(s), and configure the features you want.

== Source & build ==

All PHP and JavaScript in this plugin ship human-readable. The admin screen bundle (`assets/admin/index.js` / `index.css`) is compiled with Vite from the JSX source included in this plugin at `admin-ui-src/src/`, and is deliberately built without minification, so the shipped file is the readable, running code. The stylesheet is likewise unminified.

To rebuild the bundle from source: `cd admin-ui-src`, then `npm install` and `npm run build`. The build writes `index.js` and `index.css` into `assets/admin/`. The bundle inlines its npm dependencies, whose exact versions are pinned in `admin-ui-src/package-lock.json`: [React](https://github.com/facebook/react) and [ReactDOM](https://github.com/facebook/react) (MIT), and [Lucide React](https://github.com/lucide-icons/lucide) (ISC); react-dom's production build contains pre-compressed code from the upstream npm package.

== Frequently Asked Questions ==

= Do I need an account or an API key? =
No. Everything works without a DevDome account; the shared services run on the DevDome backend and need no key on your side.

= Does geo-localization need every regional Amazon tag? =
It only redirects to stores you've added a tag for. Visitors from other countries keep the original link, so you never lose a commission.

= What happens when a product is discontinued? =
The monitor flags it, and (if enabled) clicks are redirected to a live replacement product or the Amazon search page instead of a dead page.

== Screenshots ==

1. DevDome Affiliate Manager link setup: Amazon Associates tags per marketplace (US, UK, Germany, Canada) applied sitewide or per post, with click counts and local store redirect.
2. Keyword auto-linker: keywords in WordPress content become tagged Amazon affiliate links automatically, with per-keyword limits.
3. Link Radar scanner: every Amazon affiliate link in posts and pages found automatically, with scheduled re-scans.
4. Stock and 404 monitor: live, out-of-stock and dead Amazon ASINs, with optional redirects for out-of-stock and 404 products.
5. Click protection: bot clicks on affiliate links blocked and counted.

== Changelog ==

= 1.0.6 =
* Settings: every option now shows a one line hint under the control, with the info icon holding the full explanation, the same layout as DevDome Malware Scanner.
* DevDome Dashboard: installing another DevDome plugin from the dashboard no longer activates it, you activate it yourself from its card. Output escaping tightened.

= 1.0.5 =
* DevDome Dashboard polish: Activate stays on the dashboard, notices dismiss on their own, a Fix button on every issue, clearer counters and connected badge.
* Plugin author link on the Plugins screen.
= 1.0.4 =
* DevDome Dashboard: the plugin list, descriptions, logos and versions now come from devdome.com, so new plugins appear without updating this plugin.
* One-click Install of other DevDome plugins from WordPress.org directly in the dashboard.
* Docs link and a short description on every plugin row; connected-account badge.
= 1.0.3 =
* The plugin logo is now a percent glyph, matching the WordPress.org listing, in the plugin header and the DevDome dashboard.
= 1.0.1 =
* The two redirect pages emit their scripts via `wp_print_inline_script_tag()`.
* The admin bundle's JSX/Vite source is included at `admin-ui-src/`; build steps are in the Source & build section.
* The External services section links Amazon's Conditions of Use and Privacy Notice.

= 1.0.0 =
* WordPress.org release. Every identifier the plugin owns now uses its own `devdaffi_` prefix (options, tables, cron hooks, REST namespace, script handles, shortcode — the button shortcode is now `[devdaffi_button]`). Self-hosted upgrades migrate stored settings, click stats and the link index automatically, and the old button shortcode keeps working via an alias.
* Click Protection now has a built-in bot list, so it works with no external service or feed.
* Link Radar's scheduled auto-scan is off by default; run a scan or enable the schedule to start link monitoring.
* Removed the robots.txt writer and unused legacy settings; `/go` redirects now always send an `X-Robots-Tag: noindex, nofollow` header, the standard behavior for a redirect endpoint.
* The admin bundle ships unminified.

= 0.5.4 =
* Expanded External services disclosure.

= 0.5.3 =
* Readme copy polish.

= 0.5.2 =
* WordPress.org build support: the self-hosted suite updater is excluded from this package (updates come from WordPress.org only), the shared bot-list feed and the suite dashboard's one-click installs are disabled in WordPress.org builds, the bundled devdome-core library was updated, uninstall now removes the remaining plugin options, transients and scheduled events, and the External services disclosure was extended.

= 0.5.1 =
* Click attribution privacy: outbound hops now carry an opaque token instead of the site hostname in the URL; the token is resolved server-side. (Version numbering: 0.4.9 is followed by 0.5.1. No version segment goes above 9.)

= 0.4.9 =
* Fixed: in DevDome Analytics, a `/go` button click is now attributed to the page it was clicked from instead of appearing as a separate page.

= 0.4.8 =
* Click reports to DevDome Analytics now declare the link type explicitly, so click classification keeps working even if the `/go` slug is ever renamed.

= 0.4.7 =
* Fixed: the mobile App Opener bridge page now sends the same no-referrer policy as every other redirect path.

= 0.4.6 =
* `/go` redirects now send a `Referrer-Policy: no-referrer` header so the redirecting page is not exposed to the destination.

= 0.4.5 =
* Fixed: WooCommerce generated buttons now use the Amazon store you selected instead of always amazon.com.
* Fixed: a link scan that fails part-way no longer wipes the link index; the previous index is kept until a full scan completes.
* Fixed: the keyword auto-linker keeps the original text when a regex limit is hit instead of blanking the content.

= 0.4.4 =
* Split into a public edition and an in-house edition; controls that are not part of the public plugin were removed from this build.

= 0.3.8 =
* WordPress.org readiness pass: security and escaping review, Plugin Check fixes.

= 0.3.0 =
* Button Link: choose the Amazon marketplace for generated links via Edit / Regenerate, with an option to omit the affiliate tag.
* Custom button links now support an {ASIN} placeholder that is filled with the product's ASIN at render time.

= 0.2.0 =
* Per-status dead-link routing (replacement product / search page) for Out-of-Stock and 404.
* WooCommerce external-button rewrite; bulk Replace ASIN tool.
* Geo-localization, click protection, mobile app opener, link monitor.

== Upgrade Notice ==

= 1.0.0 =
Identifier rename release. Settings, click stats and the link index migrate automatically on self-hosted upgrades, and the old button shortcode keeps working via an alias. Fresh installs are unaffected.
