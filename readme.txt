=== DevDome Affiliate Manager: Amazon Affiliate Plugin for Amazon Associates ===
Contributors: devdome
Tags: amazon affiliate, amazon associates, amazon affiliate plugin, amazon affiliate links, affiliate links
Requires at least: 6.0
Tested up to: 7.1
Requires PHP: 7.4
Stable tag: 1.1.6
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Amazon Affiliate WordPress Plugin: tag Amazon affiliate links, check Amazon product links, replace dead ASINs, earn commission as an Amazon Associate.

== Description ==

DevDome Affiliate Manager is a WordPress Amazon Affiliate Plugin for site owners who want to earn commission from Amazon product links. Add your Amazon Associates tracking IDs and manage supported Amazon affiliate links across 22 marketplaces.

Tag existing links, turn selected keywords into affiliate links and track clicks by tag or keyword rule. Check product status, recover dead or unavailable product links and route visitors to regional Amazon stores. WooCommerce external products are supported too.

Local tagging, buttons, keyword linking, scanning, click counting and built-in bot detection work without an account or API key. Hosted status checks, replacement searches and geo routing require a connected DevDome account. These tools help Amazon affiliates maintain their links; they do not guarantee earnings.

= Amazon Associates Tagging =

Under Affiliate Tags, apply your Amazon tag sitewide or to selected posts, pages and post categories. Supported links are tagged when individual content pages display, without rewriting stored content.

SEO Attributes offers No Follow, Follow and Sponsored; No Follow and Sponsored default to on. Open in New Tab defaults to off. Click tracking honours it, falling back to the same tab if a new window is blocked.

= Amazon Buy Button =

Create an Amazon button with [devdaffi_button asin="YOUR_ASIN"], using the product's ten-character ASIN.

Under Button Link, Edit selects the marketplace; Regenerate resets it to amazon.com. Don't add tag skips tagging and click interception for generated shortcode buttons.

Use Custom Link accepts a URL with an {ASIN} placeholder. For a fixed URL, use [devdaffi_button]. Non-Amazon destinations receive no affiliate tag.

= Amazon Geo Localization =

OneLink Alternative defaults to off. Regional routing needs a connected account and usable service response. Without a configured tag for the visitor's local store, the original destination remains.

On /go, another owner's tag is replaced with yours or removed. External services lists the visitor IP and other fields sent.

= Amazon Link Checker and Link Radar =

Scan Site For Amazon Links builds a local index; Scan Again refreshes it. Scans read published content and WooCommerce product URLs, indexing full Amazon product URLs containing an ASIN. Shortlinks and generated shortcode buttons are excluded. Supported ASIN paths on your own host can also be indexed from WooCommerce product URLs.

In Stock & 404 Monitor, Check Now checks scanned products in batches, showing progress and usage. Pause stops further batches, Resume continues and Cancel ends the run. An active batch may finish first.

The run can continue after you close the page through WP-Cron and a loopback request, with progress shown when you return. Those requests must work; account, quota or service errors can stop it.

Auto Re-Scan defaults to off. When enabled, it scans content at the Scan every interval and checks up to 20 indexed products hourly through DevDome. Local scans use no service allowance; status checks do.

Results include live, out of stock, dead and unknown. Failed service requests preserve existing statuses. The screen states 500 free checks and searches monthly per account and displays service-reported usage.

= Dead Amazon Link Recovery =

Out of Stock Redirect and 404 ASIN Redirect independently control recovery for stored statuses. Choose Best replacement product or Search page. Replacement mode searches at click time, falling back to Amazon search if no replacement returns. Disabled recovery leaves that destination unchanged.

For bulk replacement, enter your chosen New ASIN. Replace on N pages shows the affected page count, using singular wording for one page. It replaces matching ASINs in indexed content and product URLs, then checks the new ASIN. These content edits persist.

= Affiliate Link Tracking =

Supported Amazon clicks pass through /go. Affiliate Tags and Keyword Rules show Clicks and Unique. Affiliate click tracking totals belong to the affiliate ID or individual rule, not each product.

Unique counts one visitor per tag or rule per 30 minutes using a hash of IP address and browser user agent. Statistics do not store either raw value. Rate limits cap counted clicks from repeatedly requesting addresses. Blocked bots have one global counter.

Destinations are validated; supported shortlinks resolve before tagging. Shortlinks that cannot resolve to an allowed Amazon storefront are refused.

= Keyword Auto-Linker and Blog Monetization =

Keyword Rules supports affiliate marketing by linking selected words and phrases when content displays. It defaults to off.

Choose Exact Match or Broad Match, case sensitivity and link limits. Existing links are always excluded. Optional exclusions cover headings, code, blockquotes and the first paragraph. Add your own affiliate disclosure where you publish links.

= WooCommerce Affiliate Product Links =

WooCommerce Buttons defaults to off. Enable it to tag and count supported external product button clicks through /go.

Generated buttons retain the Amazon store named in the product link. Supported same-site links without a store use the Button Link marketplace. A configured custom button URL applies to matching buttons even with WooCommerce Buttons off. Rewriting happens at display time.

= Click Protection =

Block Bot Clicks defaults to on, stopping detected bots before redirects and click counting. It uses a built-in list, plus shared bot signatures and Spamhaus DROP ranges when cached locally. This build downloads no shared feeds.

Block outdated browsers defaults to off and requires Block Bot Clicks. It treats desktop Chrome, Chromium-based Edge and Firefox below version 125 as bots, except Chrome and Edge 109 and Firefox 115 ESR. Phones and tablets are excluded.

Bots Blocked is a global counter subject to click rate limits; Reset Count clears it. Redirect Method offers JavaScript + 302 (Recommended), JavaScript Only or 302 Redirect Only.

= Amazon Mobile App Opener =

Mobile App defaults to off. Android's Force Amazon App (Intent) attempts to open the app, falling back to the browser. Web Only (Recommended) uses the web destination.

The optional iOS setting provides an Open in Safari link in detected in-app browsers. It opens a new browsing context but cannot guarantee Safari.

= AI and Agent Support =

On WordPress 6.9+, 16 WordPress Abilities let compatible agents work with settings, tags, keyword rules, scans, statuses, quota, ASIN replacement and click counters when your site exposes them. Administrator permissions are required. Agent status checks cover a bounded batch, not the screen's complete Check Now run.

Confirmation is required for ASIN replacement, tag or rule removal, counter resets, remote status checks, enabling geo routing or scheduled checks, disabling bot blocking, and saving lists that remove tags or rules.

Output excludes account email addresses, the site token and server paths. Remote status and replacement checks use the disclosed services.

= Independent Amazon Associates Tool =

Use this affiliate link manager for Amazon affiliation and link maintenance.

DevDome Affiliate Manager is independent. Amazon, Amazon Associates and OneLink are trademarks of Amazon.com, Inc. or its affiliates. This plugin is not endorsed by, sponsored by or otherwise affiliated with Amazon.

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

= 1.1.6 =

* Shared DevDome library 1.7.10: the DevDome dashboard icons are printed through the WordPress escaping functions (WordPress.org review rule).
* Short description rewritten.

= 1.1.5 =
* Shared DevDome library 1.7.9: the DevDome dashboard lists only real problems (a feature that is off, paused or not connected is no longer an issue) and no longer says Not monitored.

* DevDome Account card: the same Connect card as in the other DevDome plugins, with what connecting sends stated before you press Connect. The Link Radar and store routing rows now point to it, and Check Now says that it needs the account.

= 1.1.4 =

* Link Radar: Copy ASINs and the per-row copy now confirm with Copied. The copy runs through the browser's classic copy command first and the clipboard API second, so it works in every browser.
* Link Radar: the Product column explains why a product title can be unavailable.
* Link Radar: the Live list loads when the group was left open and the page is refreshed, and follows the count while a check runs.
* Check Now: 10 products per step instead of 50, so the progress row moves every few seconds.
* Link Radar: Download CSV per group exports every ASIN of that status with its store, product title and the pages it is used on.
* Listing text updated: title, short description, tags and introduction.
* DevDome Dashboard health: a high share of blocked bot clicks no longer counts as an issue. Blocked clicks mean Click Protection is working; the count stays on the tile.
* Shared DevDome library 1.7.8: the first time you open any DevDome plugin screen, a small one-time hint points at the Report a bug button. It is shown once per user across all DevDome plugins and is recorded through a nonce-checked request.

= 1.1.3 =
* Link Radar: a fourth row, No Answer, lists products the status check could not classify, so every checked product is visible. The row has its own Check again button.
* Status checks: Amazon pages that say Currently unavailable are now reported as Out of Stock (they were reported as Live).
* Check Now runs about four times faster: 50 products per step instead of 5, and each step waits longer for the status service when many sites check at the same time.

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
