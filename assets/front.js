/* Intercepts Amazon link clicks and routes them through /go (server expands
 * shortlinks + applies the default tag, then 302s out). Mobile App Opener: on iOS
 * in-app browsers, offers an "Open in Safari" step; Android intent is server-side. */
(function () {
	var BASES = [
		'amazon.com', 'amazon.co.uk', 'amazon.de', 'amazon.fr', 'amazon.it', 'amazon.es',
		'amazon.ca', 'amazon.com.au', 'amazon.co.jp', 'amazon.nl', 'amazon.se', 'amazon.pl',
		'amazon.com.mx', 'amazon.com.br', 'amazon.in', 'amazon.ae', 'amazon.sg'
	];
	var SHORTS = ['amzn.to', 'a.co', 'amzn.eu', 'amzn.asia'];
	var GO = (window.DEVDAFFI && window.DEVDAFFI.go) || '/go';

	// Mobile App Opener settings. wp_localize_script stringifies, so "0" is truthy —
	// always compare loosely against 1.
	var MOBILE = (window.DEVDAFFI && window.DEVDAFFI.mobile) || {};
	var APP_ENABLED = MOBILE.enabled == 1;
	var IOS_SAFARI_BTN = MOBILE.iosSafari == 1;

	// This post/page is excluded from affiliate tagging — don't intercept clicks.
	// (wp_localize_script stringifies, so compare loosely: "1" vs "0".)
	if (window.DEVDAFFI && window.DEVDAFFI.excluded == 1) return;

	function isIOSInAppBrowser(ua) {
		return /(FBAN|FBAV|Instagram|Line|Twitter|TikTok|Snapchat|Reddit|GSA)/i.test(ua);
	}
	function isRealSafariOnIOS(ua) {
		return /Safari/i.test(ua) && !/(CriOS|FxiOS|EdgiOS|OPiOS|GSA)/i.test(ua);
	}

	// iOS in-app browsers (Reddit/Instagram/…) often block Amazon links; offer Safari.
	function showSafariOverlay(webUrl) {
		if (document.getElementById('devdaffi-safari-overlay')) return;
		var overlay = document.createElement('div');
		overlay.id = 'devdaffi-safari-overlay';
		overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:999999;display:flex;align-items:center;justify-content:center;padding:20px;';
		var box = document.createElement('div');
		box.style.cssText = 'max-width:380px;width:100%;background:#fff;border-radius:16px;padding:24px;text-align:center;font-family:-apple-system,system-ui,sans-serif;';
		var title = document.createElement('h3');
		title.style.cssText = 'margin:0 0 8px;font-size:18px;color:#111;';
		title.textContent = 'Open in Safari';
		var msg = document.createElement('p');
		msg.style.cssText = 'margin:0 0 16px;font-size:14px;color:#555;line-height:1.4;';
		msg.textContent = 'This in-app browser can block Amazon links. Safari works best.';
		var btnRow = document.createElement('div');
		btnRow.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:12px;';
		var closeBtn = document.createElement('button');
		closeBtn.type = 'button';
		closeBtn.style.cssText = 'padding:12px;border:1px solid #ddd;border-radius:10px;background:#f5f5f5;font-weight:600;cursor:pointer;';
		closeBtn.textContent = 'Cancel';
		closeBtn.onclick = function () { overlay.remove(); };
		var actionBtn = document.createElement('a');
		actionBtn.style.cssText = 'padding:12px;border-radius:10px;background:#ff9900;color:#111;font-weight:700;text-decoration:none;display:flex;align-items:center;justify-content:center;';
		actionBtn.textContent = 'Open in Safari';
		actionBtn.href = webUrl;
		actionBtn.target = '_blank';
		actionBtn.rel = 'noopener';
		btnRow.appendChild(closeBtn);
		btnRow.appendChild(actionBtn);
		box.appendChild(title); box.appendChild(msg); box.appendChild(btnRow);
		overlay.appendChild(box);
		document.body.appendChild(overlay);
	}

	// Navigate to the /go URL — but on iOS in-app browsers offer Safari first.
	function openDest(goUrl) {
		if (APP_ENABLED && IOS_SAFARI_BTN) {
			var ua = navigator.userAgent || '';
			var isIOS = /iPad|iPhone|iPod/.test(ua) || (/Macintosh/i.test(ua) && 'ontouchend' in document);
			if (isIOS && !isRealSafariOnIOS(ua) && isIOSInAppBrowser(ua)) {
				showSafariOverlay(goUrl);
				return;
			}
		}
		window.location.href = goUrl;
	}

	function isAmazon(host) {
		host = (host || '').toLowerCase();
		return BASES.concat(SHORTS).some(function (d) {
			return host === d || host.endsWith('.' + d);
		});
	}

	document.addEventListener('click', function (e) {
		if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
		var a = e.target && e.target.closest ? e.target.closest('a') : null;
		if (!a || !a.href) return;
		var url;
		try { url = new URL(a.href, window.location.href); } catch (err) { return; }
		if (!/^https?:$/i.test(url.protocol) || !isAmazon(url.hostname)) return;
		e.preventDefault();
		var dest = GO + '?u=' + encodeURIComponent(url.toString());
		var rid = a.getAttribute('data-da-rule'); // auto-linker rule → per-rule click attribution
		if (rid) dest += '&r=' + encodeURIComponent(rid);
		openDest(dest);
	}, true);
})();
