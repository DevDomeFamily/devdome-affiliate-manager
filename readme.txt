=== DevDome Affiliate Manager: Amazon Affiliate Links & Amazon Associates ===
Contributors: devdome
Tags: amazon affiliate, amazon associates, amazon affiliate links, amazon buy button, affiliate links
Requires at least: 6.0
Tested up to: 7.1
Requires PHP: 7.4
Stable tag: 1.1.2
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Amazon affiliates: auto-tag affiliate links, track Amazon clicks and add an Amazon buy button. Supports WooCommerce external product links.

== Description ==

DevDome Affiliate Manager is an affiliate link manager for WordPress. It applies Amazon tracking IDs, creates buttons and keyword links, counts clicks and indexes product links. Optional hosted services check product status, find replacements at click time and route visitors to regional stores.

= Amazon Associates Tagging =

Add tracking IDs under Affiliate Tags. Choose from 22 Amazon marketplaces and apply tags sitewide or to selected posts, pages and post categories. Supported Amazon links in individual content pages are tagged when displayed, without rewriting stored content.

SEO Attributes offers No Follow, Follow and Sponsored. No Follow and Sponsored are enabled by default. Open in New Tab is off by default. The click tracker honours it, with a same-tab fallback if the browser blocks the new window.

= Amazon Buy Button =

Use `[devdaffi_button asin="YOUR_ASIN"]` for a generated product button. Replace YOUR_ASIN with the product's ten-character ASIN.

Under Button Link, Edit selects the generated marketplace. Regenerate resets it to amazon.com. Don't add tag omits tagging and click interception for generated shortcode buttons.

Use Custom Link accepts a custom URL. An `{ASIN}` placeholder is filled from the shortcode's ASIN. A fixed custom URL needs only `[devdaffi_button]`. Non-Amazon custom destinations do not receive an affiliate tag.

= Amazon Geo Localization =

OneLink Alternative enables regional routing and is off by default. Hosted geo routing requires a connected DevDome account and a usable service response.

If you have not configured a tag for the visitor's local store, the original destination stays in use. On `/go`, a tag that is not yours is replaced with a configured tag or removed. See External services for the visitor IP and other fields sent.

= Amazon Link Checker and Link Radar =

Use Scan Site For Amazon Links to build the local index and Scan Again to refresh it. The scanner reads published content and WooCommerce product URLs. It indexes full Amazon product URLs containing an ASIN, not shortlinks or generated shortcode buttons. WooCommerce product URLs can also contain supported ASIN paths on your own site's host.

Stock & 404 Monitor contains Check Now. It checks every scanned product in batches of up to 20, with a live progress row and an updating usage meter. Pause stops further batches, Resume continues them and Cancel ends the run. A running batch may finish first.

The run continues on the server through WP-Cron and a loopback request when the page closes. Its progress appears when you return. Background continuation depends on those requests being able to run. Account, quota or service errors can stop the run.

Auto Re-Scan is off by default. While enabled, it re-reads content at the interval set by Scan every and checks up to 20 indexed products every hour through DevDome. Content scans are local; status checks use the account's monthly allowance.

Status results include live, out of stock, dead and unknown. A failed service request leaves existing statuses unchanged. The screen describes the free allowance as 500 checks and searches per month per account and displays usage returned by the service.

= Dead Amazon Link Recovery =

Out of Stock Redirect and 404 ASIN Redirect independently enable recovery for products with those stored statuses. Each offers Best replacement product or Search page. Replacement mode asks for a live replacement at click time and falls back to Amazon search when none is returned. With recovery disabled for that status, it leaves the destination unchanged.

For bulk replacement, type the replacement into New ASIN. The button reads Replace on N pages, with the actual page count and singular wording for one page. It replaces matching ASINs in indexed content and product URLs, then checks the new ASIN. It does not choose the ASIN for you. These content edits persist.

= Affiliate Link Tracking =

The plugin routes supported Amazon clicks through `/go` for affiliate link tracking. Each Affiliate Tags and Keyword Rules row shows Clicks and Unique. Tag totals belong to the affiliate ID; rule totals belong to the rule.

Unique means one visitor per tag or rule per 30 minutes, identified by a hash of IP address and browser user agent. Click statistics do not store those raw values. Blocked bots have one global counter, not a counter per tag. Rate limits cap counted clicks from a repeatedly requesting address.

The endpoint validates Amazon destinations and resolves supported shortlinks before tagging. A shortlink that cannot resolve to an allowed storefront is refused.

= Keyword Auto-Linker and Blog Monetization =

Keyword Rules can turn selected words and phrases into Amazon affiliate links when content is displayed. This supports affiliate marketing without manually inserting each link.

Rules offer Exact Match and Broad Match, case sensitivity and link limits. Existing links are always excluded. Configurable exclusions cover headings, code, blockquotes and the first paragraph. The auto-linker is off by default.

= WooCommerce Affiliate Product Links =

WooCommerce Buttons is off by default. Enable it to route supported external product buttons through `/go` for tagging and click counting.

Generated buttons keep the Amazon store their product link already names. Supported same-site links without a store use the marketplace selected under Button Link. A configured custom button URL applies to matching product buttons even when WooCommerce Buttons is off. Button rewriting happens at display time.

= Click Protection =

Under Bot Protection, Block Bot Clicks is on by default. It stops detected bots before redirecting and counting affiliate clicks. Detection uses the built-in bot list plus shared bot signatures and Spamhaus DROP ranges when those are available in the shared cache. This WordPress.org build does not download the shared feeds.

Outdated Browsers contains Block outdated browsers. It is off by default and applies only while Block Bot Clicks is on. It treats desktop Chrome, Chromium-based Edge and Firefox below version 125 as bots. Chrome and Edge 109 and Firefox 115 ESR are allowed. Phones and tablets are excluded from this version rule.

Bots Blocked shows the global blocked-click count, subject to the click rate limit. Reset Count clears it. Redirect Method selects JavaScript + 302 (Recommended), JavaScript Only or 302 Redirect Only.

= Amazon Mobile App Opener =

Mobile App is off by default. On Android, Force Amazon App (Intent) attempts to open the Amazon app and falls back to the browser. Web Only (Recommended) uses the normal web destination.

The optional iOS setting offers an Open in Safari link in detected in-app browsers. The link opens a new browsing context; the plugin cannot guarantee that the device chooses Safari.

= AI and Agent Support =

On WordPress 6.9 and newer, the plugin registers 16 WordPress Abilities. Compatible agents can use them when your site exposes them.

They cover settings, tags, keyword rules, scans, product statuses, quota, ASIN replacement and click counters. They require administrator permissions. The status-check ability checks a bounded batch; it does not start the screen's complete Check Now run.

ASIN replacement, tag or rule removal, counter resets and remote status checks require confirmation. Enabling geo routing or scheduled checks, disabling bot blocking, or saving lists that remove tags or rules also requires confirmation.

Ability output excludes account email addresses, the site token and server paths. Remote checks and replacement checks use the services disclosed below.

= Independent Amazon Associates Tool =

Choose the features you need for amazon affiliation and link maintenance.

DevDome Affiliate Manager is an independent project. Amazon, Amazon Associates and OneLink are trademarks of Amazon.com, Inc. or its affiliates. This plugin is not endorsed by, sponsored by or otherwise affiliated with Amazon.

== External services ==

DevDome provides the services below. Terms: https://devdome.com/terms-of-service Privacy policy: https://devdome.com/privacy-policy

**Plugin catalog:** `https://devdome.com/wp-plugins/catalog.json`. After account connection, the shared DevDome Tools dashboard fetches plugin names, descriptions, logos and links. The request identifies the bundled core version through its user agent, with no site or visitor fields. Successful results are cached for 12 hours; failures for one hour. Before connection, the dashboard uses its bundled catalog.

= Link Radar status checks, https://api.devdome.com/amazon-404-oos-checker =

**/check-batch** receives a POST containing ASINs, their Amazon domains, this site's domain and secret site token. Calls occur during Check Now, status rechecks, checks following bulk replacement, confirmed agent checks and hourly checks while Auto Re-Scan is enabled. Hourly checks process up to 20 products. An empty index gives them nothing to check.

**/search** receives a GET containing a keyword, Amazon domain, site domain and site token. The keyword contains up to six words derived from the linking post's title or product metadata. It runs at click time when recovery is enabled for the stored status and Best replacement product is selected. Results are cached for one hour, or ten minutes when no replacement is returned. No visitor IP or browser data is included in these two service payloads.

**/usage** receives a GET containing the site domain and site token when the screen or an agent requests account usage. The caller must have a connected account state or a recorded connection attempt. The screen also updates its meter from batch responses.

Checks and searches require a connected account and consume its allowance. The screen states a free allowance of 500 checks and searches per month. The service supplies the current plan, limit and usage. Failed or refused checks leave stored statuses unchanged.

= Geo-localization, https://api.devdome.com/geo-resolve =

The actual endpoint is **https://api.devdome.com/geo-resolve/resolve**. When OneLink Alternative is enabled, eligible `/go` clicks send a JSON POST containing the visitor's IP, destination ASIN and Amazon domain, domains with enabled regional tags, site domain and site token.

The service uses these fields to choose a regional destination. No request is made without a visitor IP or configured regional coverage. An unusable response leaves the original destination in place. The plugin subsequently replaces or removes tags that are not yours.

= DevDome account, https://api.devdome.com/plugin/account, /plugin/disconnect and https://analytics.devdome.com/api/plugin/connect/* =

The shared account library makes no account-status request before a connection action has been recorded.

* `https://api.devdome.com/plugin/account`: POST with the site domain and the site token in an Authorization header. It verifies account status after connection actions and on later status reads. Successful responses are cached for 15 minutes. The response includes account identity, email and plan.
* `https://analytics.devdome.com/api/plugin/connect/start`: POST when you press Connect. It sends the site domain as site_id and site_domain, the site token and the wp-admin return URL.
* `https://analytics.devdome.com/api/plugin/connect/claim`: POST when completing the connection. It sends site_id, site_domain, site_token, request_token and the handshake nonce.
* `https://api.devdome.com/plugin/disconnect`: POST when you press Disconnect, carrying the site domain and authenticated site token.

The browser visits `https://devdome.com/connect/` to authorize the connection. Its URL carries an opaque request handle, not the Account ID or site token.

Connecting through the disclosed DevDome Tools card also authorizes an inventory in recurring account-status requests: active DevDome plugin slugs and versions, plus DevDome library, WordPress and PHP versions. It excludes other plugins, users, email addresses, content and visitors. Existing connections and connection buttons without this disclosure do not grant that inventory permission. Disconnecting stops inventory sharing.

= Amazon =

At click time, `/go` resolves Amazon URLs server-side, including amzn.to, a.co, amzn.eu and amzn.asia. It requests HEAD first and retries with GET if HEAD fails, returns below 200, or returns 405 or 501. It follows only allowed Amazon hosts, with a seven-request-hop limit. Successful resolution is cached for 12 hours.

Requests contain the destination URL and a generic plugin user agent, not the visitor's IP or browser user agent. The visitor's browser separately contacts Amazon when it follows the resulting link.

This service is provided by Amazon.com, Inc.: [Conditions of Use](https://www.amazon.com/gp/help/customer/display.html?nodeId=GLSBYFE9MGKKQXXM), [Privacy Notice](https://www.amazon.com/gp/help/customer/display.html?nodeId=GX7NJQ4ZB8MHFRNJ).

= No error reports =

This plugin sends no error reports. The "Report a bug" link on its screen opens the bug form on devdome.com in your browser; the plugin itself sends nothing.

= Not contacted on this WordPress.org build =

This build does not fetch `https://api.devdome.com/bot-protection/list`, `/bot-protection/asns` or `/bot-protection/drop`, and does not schedule feed downloads. Local matching can still use shared data already cached on the site.

It does not contact `https://api.devdome.com/plugin-updates/`. The self-hosted updater and installer are excluded. Updates come from WordPress.org. Dashboard installation of listed WordPress.org plugins uses WordPress's plugin-information API and validated packages from `downloads.wordpress.org`, only after an authorized installation request.

= Never sent, in any request =

The plugin's generated service payloads do not include passwords, password hashes, visitor form input, visitor names or visitor email addresses.

The scanner runs locally. It does not upload posts, pages or comments. Status checks send extracted ASINs and domains. The content-derived exception is the replacement keyword described above, which contains up to six words from a title or product metadata.

== Installation ==

1. Upload the plugin ZIP through the WordPress plugin uploader, or copy its folder to `wp-content/plugins/`.
2. Activate it.
3. Open Affiliate Manager under DevDome Tools and add your tracking IDs under Affiliate Tags.
4. Configure and save the features you want. Connect a DevDome account for hosted services.

== Source & build ==

The React admin source is included in `admin-ui-src/src/`. Vite builds `assets/admin/index.js` and its stylesheet with minification disabled in the build configuration.

To rebuild, run `cd admin-ui-src`, then `npm install` and `npm run build`. Dependency versions are recorded in `admin-ui-src/package-lock.json`: [React](https://github.com/facebook/react) and [ReactDOM](https://github.com/facebook/react) (MIT), and [Lucide React](https://github.com/lucide-icons/lucide) (ISC). Bundled upstream production dependencies can contain compressed code.

== Frequently Asked Questions ==

= Do I need an account or an API key? =

No API key is needed. Local tagging, buttons, keyword linking, scanning, click counting and built-in bot detection work without an account. Hosted status checks, replacement searches and geo routing require a connected DevDome account. Without a usable service response, checks preserve existing statuses and geo routing keeps the original destination.

= Does geo-localization need every regional Amazon tag? =

It only redirects to stores you have added a tag for. Visitors from other countries keep the original link. Any tag in it that is not one of yours is replaced with your own tag or removed; the plugin never relays someone else's tag.

= What happens when a product is discontinued? =

A status check may flag it as dead. If 404 ASIN Redirect is enabled, subsequent clicks use the selected recovery mode. Replacement mode falls back to Amazon search if no replacement is returned. A content scan alone does not check availability.

= How can I monetize blog posts with Amazon links? =

Add your Associates tracking IDs to tag existing links, then create keyword rules to turn selected words and phrases into tagged Amazon links. Set per-page limits and exclusions to control where links appear.

= Can this help me make money blogging with Amazon Associates? =

It provides link management for Amazon Associates monetization: tagging, buy buttons, keyword links, availability checks and click tracking. These tools help you maintain the links on your blog; they do not guarantee earnings.

= Can I use WooCommerce affiliate products linked to Amazon? =

Yes. Enable WooCommerce Buttons to route supported Amazon product buttons through your tags. Generated buttons retain the store already named in the product URL. Link Radar can index their product URLs.

= How do I manage Amazon affiliation links for different countries? =

Add your Associates IDs for the supported marketplaces you use. With geo-localization enabled and a connected DevDome account, qualifying links can route visitors to their local Amazon marketplace. If no tag is configured for that store, the original link stays in use, with your own tag or with no tag, never with a tag that is not yours.

= What is removed when I delete the plugin? =

Deleting removes plugin settings, click and unique-visitor counters, the link index, product statuses, the recovery journal, scheduled events and plugin transients. Bulk ASIN content changes are not reversed. Deactivation keeps stored data and content changes, but clears the scheduled scan and dashboard-summary events.

= What does affiliate link tracking record? =

It records total clicks and unique visitors for configured tags and keyword rules. Unique visitors use a hash of IP and browser user agent for a 30-minute window. Bots Blocked is a separate global counter. These are not per-product performance reports.

= Can I add an Amazon buy button without a keyword rule? =

Yes. Use `[devdaffi_button asin="YOUR_ASIN"]`, or `[devdaffi_button]` with a fixed custom URL. Under Button Link, Edit selects the generated marketplace, Regenerate resets it to amazon.com and Don't add tag omits tagging for generated shortcode buttons.

== Screenshots ==

1. Affiliate Tags: marketplace tracking IDs, scope, Clicks and Unique.
2. Keyword Rules: keyword destinations, matching options and link limits.
3. Link Radar: Scan Site For Amazon Links, scan results and Auto Re-Scan.
4. Stock & 404 Monitor: product statuses, Check Now and per-status recovery settings.
5. Click Protection: Bot Protection and the global Bots Blocked counter.

== Changelog ==

= 1.1.2 =

Link Radar: the Check Now button is back in the Stock & 404 Monitor section (it was described in the readme but missing from the screen). It now runs through every scanned product in small batches with a live progress row and usage meter, Pause, Resume and Cancel; the run continues on the server when you leave the page and shows again when you come back. New WooCommerce Buttons switch on the screen (routing external product buttons through your tags; the option existed but could not be turned on). Open in New Tab is honoured by the click tracker. Shortlink resolution asks again with GET when Amazon refuses HEAD. Readme corrected: bulk Replace ASIN takes an ASIN you enter, the plugin sends no error reports, geo-localization never relays a foreign tag, the scanner indexes full Amazon product URLs, WooCommerce buttons keep their store, and Auto Re-Scan's hourly status checks are stated on the screen and here. New FAQ on what deleting the plugin removes. After a manual check the Live list reloads and the usage meter updates; Check Now waits for the account state. Each tag and rule row now shows its unique visitors next to its clicks. Click Protection: new Outdated Browsers switch (off by default), the Redirect Manager rule for desktop browsers years behind.

= 1.1.1 =
* Bundled DevDome library 1.7.6: if you connect a DevDome account from the DevDome Tools dashboard, the Connect card now says exactly what is shared, including the list of active DevDome plugins and their versions. Sites that were already connected, and sites that never connect, send nothing new. See External services.
* Listing text rewritten: new title, short description, tags and a restructured description. No change to how the plugin works.

= 1.1.0 =
* WordPress Abilities (6.9+): 16 abilities so AI agents and MCP clients can read and change settings, manage tags and auto-linker rules, run the Link Radar scan and status check, replace an ASIN and read click stats, with confirmations on every destructive action.
* Shared DevDome core 1.7.4: plugin updates succeed on hosts where a previous update left the plugin folder owned by another system user.
* Sites with plain permalinks: the /go links use the query form the site can route (clicks are tagged and counted there too), and the content picker's REST call no longer answers 404.
* Honest answers everywhere: a failed database read is reported as such instead of "no clicks" or "nothing to fix"; settings saves are read back before "Saved"; a partial settings request never wipes tags or rules; the ASIN replacement checks every write and names the posts it could not change; a Link Radar outage never overwrites a known status; the Reset clicks icon now really resets; /go records clicks only for your own tags and refuses a shortlink that leaves Amazon.

= 1.0.7 =
* Connect fix (shared DevDome core 1.6.6): the connect claim now waits up to 30 seconds and keeps the handshake for 20 minutes so a refresh retries it, the DevDome hub shows why a connect failed with a Try again link, and the verify file is served through a query form for hosts that answer /.well-known/ before WordPress.

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
* WordPress.org release. Every identifier the plugin owns now uses its own `devdaffi_` prefix (options, tables, cron hooks, REST namespace, script handles, shortcode; the button shortcode is now `[devdaffi_button]`). Self-hosted upgrades migrate stored settings, click stats and the link index automatically, and the old button shortcode keeps working via an alias.
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
This WordPress.org build uses the `devdaffi_` identifiers and `[devdaffi_button]` shortcode. Legacy self-hosted migration files are excluded from the package.
