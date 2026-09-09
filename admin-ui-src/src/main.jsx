import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Mount points:
//   1. #devdaffi-root            — AM standalone admin page (iframe-isolated, default).
//   2. #am-link-control-host-top    — TOP slot in PI's Link Control. AM mounts ONE React tree
//      here via Shadow DOM. App.jsx then uses a React PORTAL to render its remaining sections
//      (Keyword Auto-Linker, Link Radar, Click Protection, Mobile App) into the BOTTOM slot
//      (#am-link-control-host-bottom), with PI's Transit Links + Smart Auto-Import sandwiched
//      between. ONE React tree = shared formData state across both slots.
// The slot may not exist on initial script execution if PI's React tree mounts after this
// module loads — so we poll briefly with MutationObserver, then fall back.
const mount = (el, suiteMode = false) => {
  createRoot(el).render(
    <React.StrictMode>
      <App suiteMode={suiteMode} />
    </React.StrictMode>
  );
};

// Pull the AM CSS <link> from the light DOM so we can re-attach a clone inside the shadow root.
// (Shadow DOM blocks light-DOM stylesheets from cascading in — by design — so we must duplicate.)
const findAmCssLink = () => {
  const links = document.querySelectorAll('link[rel="stylesheet"]');
  for (const l of links) {
    if (l.href && /\/devdome-affiliate-manager\/assets\/admin\/index\.css/.test(l.href)) {
      return l.href;
    }
  }
  return null;
};

const standalone = document.getElementById('devdaffi-root');
if (standalone) {
  mount(standalone, false);
} else if (typeof window !== 'undefined' && window.PI_CONFIG && window.PI_CONFIG.affiliateManagerActive) {
  const trySuiteSlot = () => {
    const slot = document.getElementById('am-link-control-host-top');
    if (!slot || slot.dataset.amMounted) {
      return;
    }
    slot.dataset.amMounted = '1';

    // Style isolation via Shadow DOM: AM's Tailwind preflight + utilities live inside the shadow
    // tree only, and PI's classes outside can't leak in. The price is that React portals must
    // explicitly target the shadow root if they want to stay inside (modals/dropdowns/tooltips).
    let host = slot;
    let reactRoot;
    try {
      const shadow = slot.attachShadow({ mode: 'open' });
      // Re-attach AM's stylesheet inside the shadow root so Tailwind applies inside.
      const cssHref = findAmCssLink();
      if (cssHref) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssHref;
        shadow.appendChild(link);
      }
      reactRoot = document.createElement('div');
      reactRoot.style.minHeight = '100px';
      shadow.appendChild(reactRoot);
    } catch (e) {
      // Browsers that reject attachShadow (very rare in admin context) — fall back to direct mount.
      reactRoot = host;
    }
    mount(reactRoot, true);
  };

  // Initial attempt + persistent observer. The slot can disappear (when the user switches PI tabs
  // → Link Control unmounts) and reappear (when they switch back → PI rebuilds a fresh slot div).
  // We keep the observer alive for the page's lifetime so AM remounts into each fresh slot.
  // rAF throttling so heavy mutations (form inputs, animations) don't make trySuiteSlot run
  // unboundedly — at most once per frame.
  trySuiteSlot();
  let pending = false;
  const observer = new MutationObserver(() => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => { pending = false; trySuiteSlot(); });
  });
  observer.observe(document.body, { childList: true, subtree: true });
}
