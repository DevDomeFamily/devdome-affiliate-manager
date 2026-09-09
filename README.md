# DevDome Affiliate Manager - free Amazon affiliate manager for WordPress

[![WordPress Plugin Version](https://img.shields.io/wordpress/plugin/v/devdome-affiliate-manager?label=wp.org)](https://wordpress.org/plugins/devdome-affiliate-manager/)
[![Active Installs](https://img.shields.io/wordpress/plugin/installs/devdome-affiliate-manager)](https://wordpress.org/plugins/devdome-affiliate-manager/)
[![Rating](https://img.shields.io/wordpress/plugin/rating/devdome-affiliate-manager)](https://wordpress.org/plugins/devdome-affiliate-manager/reviews/)
[![Tested WP](https://img.shields.io/wordpress/plugin/tested/devdome-affiliate-manager)](https://wordpress.org/plugins/devdome-affiliate-manager/)
[![License GPL-2.0+](https://img.shields.io/badge/license-GPL--2.0%2B-blue.svg)](LICENSE)

**The free alternative to AAWP, Lasso, AmaLinks Pro, ThirstyAffiliates Pro and Pretty Links Pro for Amazon Associates publishers.**
Auto-tag every Amazon link on your WordPress site with your Associates ID, one ID per Amazon marketplace (22 stores),
send international visitors to their local Amazon store, turn keywords into affiliate links, track clicks, block bot
clicks, and find dead or out-of-stock Amazon products before they waste your commissions.

[![DevDome Affiliate Manager, free Amazon affiliate plugin for WordPress](https://ps.w.org/devdome-affiliate-manager/assets/banner-1544x500.png)](https://devdome.com)

- **Install from WordPress.org:** https://wordpress.org/plugins/devdome-affiliate-manager/
- **Website:** https://devdome.com
- **Support:** https://wordpress.org/support/plugin/devdome-affiliate-manager/

## Everything is free, with one metered service

Every feature in the plugin is free and unlimited: auto-tagging, per-marketplace IDs, keyword auto-linker, click
tracking, click protection, WooCommerce external product links, the mobile app opener.

Two features run through the hosted DevDome service and need a free DevDome account:

- **Dead and out-of-stock link checks** (Link Radar). The free plan includes **500 checks per month**. Paid plans raise
  that to 20,000, 50,000 or 100,000 for large sites. The plugin shows the usage meter on its settings screen.
- **Geo store routing** (the OneLink alternative). **Free** with a connected account, no quota.

Every competitor below is paid from the first feature.

## Why DevDome Affiliate Manager instead of the paid alternatives

| | DevDome Affiliate Manager | AAWP | Lasso | AmaLinks Pro | ThirstyAffiliates Pro | Pretty Links Pro |
|---|---|---|---|---|---|---|
| Price | **Free** | from EUR 79 / year | from $49 / year | from $67 / year | from $99.60 / year | from $99.60 / year |
| Auto-tag existing Amazon links sitewide | Yes | Product boxes, not retagging | Yes | Yes | Cloaked links only | Cloaked links only |
| One Associates ID per marketplace (22 stores) | Yes | Yes | Yes | Yes | No | No |
| Geo routing to the visitor's Amazon store | Yes, free | Yes | Yes | Yes | Yes | No |
| Keyword auto-linking | Yes | No | Yes | Yes | Yes | Yes |
| Dead and out-of-stock product detection | Yes, 500 checks / month free | Via PA-API | Yes | No | No | No |
| Click tracking | Yes | Yes | Yes | Yes | Yes | Yes |
| Bot click protection | Yes | No | No | No | No | No |
| Needs Amazon PA-API keys | No | Yes | Yes | Yes | No | No |
| Works without any account | Yes, except link checks and geo routing | No | No | No | No | No |

Prices are the vendors' single-site annual plans as published in September 2026. Amazon Auto Links is free but inserts
product boxes through the PA-API; it does not retag the links already in your posts.

## Features

- **Auto-tag Amazon affiliate links.** Add your Associates tag once and it is applied to every Amazon link, existing
  and new, sitewide or per post, page and category. `rel="nofollow sponsored"` and open-in-new-tab handled.
- **22 Amazon marketplaces.** A separate Associates ID for amazon.com, .co.uk, .de, .ca, .fr, .it, .es, .co.jp,
  .com.au, .in and the rest.
- **Geo store routing.** International visitors land on their local Amazon store with your tag for that store. If you
  have no tag for the visitor's store, the original link is kept.
- **Keyword auto-linker.** Keywords in posts, pages and products become tagged Amazon links, with per-keyword limits
  and skip rules for headings, links, code and blockquotes.
- **Link Radar.** Scans your content and WooCommerce external products for Amazon links, then monitors them: live,
  out of stock, 404. Optional redirect of dead links to a replacement or an Amazon search.
- **Click tracking** per tag and per keyword rule.
- **Click protection.** Blocks bot clicks on affiliate links so your click data and Amazon account stay clean.
- **Affiliate buttons** from an ASIN or custom URL.
- **WooCommerce.** Routes external product buttons that carry an ASIN through your tagged link.
- **Amazon mobile app opener** for iOS and Android visitors.

## Screenshots

[![Amazon Associates tags per marketplace in DevDome Affiliate Manager: US, UK, Germany and Canada IDs applied sitewide with click counts](screenshots/devdome-amazon-affiliate-manager-tags-marketplaces.png)](https://devdome.com)
*Link setup: one Associates ID per Amazon marketplace, applied sitewide or per post, with click counts and geo store routing.*

[![Keyword auto-linker turning WordPress keywords into tagged Amazon affiliate links](screenshots/devdome-amazon-affiliate-keyword-auto-linker.png)](https://wordpress.org/plugins/devdome-affiliate-manager/)
*Keyword auto-linker: keywords become tagged Amazon links with per-keyword limits.*

[![Link Radar scanner found 13 Amazon affiliate links across 3 pages with scheduled re-scans](screenshots/devdome-amazon-affiliate-link-scanner.png)](https://devdome.com)
*Link Radar: every Amazon link on the site found automatically, re-scanned on a schedule.*

[![Amazon out-of-stock and 404 product monitor with live, out of stock and dead ASIN counts and redirect options](screenshots/devdome-amazon-affiliate-out-of-stock-404-monitor.png)](https://wordpress.org/plugins/devdome-affiliate-manager/)
*Stock and 404 monitor: live, out-of-stock and dead ASINs, with optional redirects.*

[![Affiliate click protection blocking bot clicks on Amazon links in WordPress](screenshots/devdome-amazon-affiliate-click-protection.png)](https://devdome.com)
*Click protection: bot clicks on affiliate links blocked and counted.*

## Requirements

WordPress 6.0+, PHP 7.4+. No Amazon PA-API keys needed.

## Installation

1. In wp-admin go to **Plugins > Add New**, search for **DevDome Affiliate Manager**, install and activate.
2. Open **DevDome > Affiliate Manager**, add your Associates ID per marketplace, save.
3. Optional: connect a free DevDome account for link checks and geo routing.

## Part of the DevDome plugin family

Free WordPress plugins by [DevDome](https://devdome.com): Analytics (cookieless, bot and AI crawler split, public
API and MCP server), Redirect Manager, Media Cleaner, Link Monitor, Affiliate Manager. Every plugin ships with the
DevDome Dashboard inside wp-admin, so the others install in one click.

## Development

This repository mirrors the release published on WordPress.org. Bug reports and feature requests: open an issue here
or use the [support forum](https://wordpress.org/support/plugin/devdome-affiliate-manager/).

## License

GPL-2.0 or later. See [LICENSE](LICENSE).
