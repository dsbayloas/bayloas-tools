// Shared header/footer injected on every tool page, so the nav only has
// to be edited in one place. Plain JS, no build step - keeps this whole
// site deployable as-is with zero tooling.
//
// IMPORTANT: this site has no build step to auto-stamp a build id, so the
// "update available" check below relies on a value maintained BY HAND -
// bump CURRENT_BUILD_ID here to match version.json's "version" field
// every time a change is deployed to this repo, or visitors will never be
// told to refresh.
const CURRENT_BUILD_ID = '2026-09-23-1';

(function () {
  const links = [
    { href: '/', label: 'All Tools' },
    { href: '/load-profitability-checker.html', label: 'Should I Take This Load?' },
    { href: '/detention-pay-calculator.html', label: 'Detention Pay' },
    { href: '/per-diem-tax-estimator.html', label: 'Tax Savings' },
    { href: '/cost-per-mile-calculator.html', label: 'Cost Per Mile' },
    { href: '/fuel-cost-calculator.html', label: 'Fuel Cost' },
    { href: '/hos-clock-calculator.html', label: 'HOS Clock' },
    { href: '/ifta-guide.html', label: 'IFTA Guide' },
    { href: '/route-planner.html', label: 'Route Planner' },
  ];
  const path = window.location.pathname.replace(/\/index\.html$/, '/').replace(/\/$/, '') || '/';

  const header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML = `
    <div class="wrap">
      <a class="brand" href="/">
        <img src="/assets/logo.png" alt="Bayloas" />
        BAYLOAS FREE TOOLS
      </a>
      <nav>
        ${links
          .map((l) => {
            const linkPath = l.href.replace(/\/$/, '') || '/';
            const isActive = linkPath === path;
            return `<a href="${l.href}" class="${isActive ? 'active' : ''}">${l.label}</a>`;
          })
          .join('')}
      </nav>
    </div>
  `;
  document.body.insertBefore(header, document.body.firstChild);

  const footer = document.createElement('footer');
  footer.className = 'site-footer';
  footer.innerHTML = `
    Free tools for owner-operators &amp; small fleets, brought to you by
    <a href="https://bayloas.com">Bayloas LLC</a> — freight dispatch &amp; carrier services.
    &copy; ${new Date().getFullYear()} Bayloas LLC.
  `;
  document.body.appendChild(footer);
})();

// "New update - please refresh" banner - same pattern as the CRM/exp/
// training apps, adapted for this site's plain-HTML, no-build setup.
(function () {
  const CHECK_INTERVAL_MS = 3 * 60 * 1000;
  let dismissed = false;

  function showBanner() {
    if (dismissed || document.getElementById('bayloas-update-banner')) return;
    const isMac = /mac/i.test(navigator.platform || '');
    const banner = document.createElement('div');
    banner.id = 'bayloas-update-banner';
    banner.style.cssText =
      'position:fixed;bottom:16px;left:16px;right:16px;z-index:9999;display:flex;' +
      'flex-wrap:wrap;align-items:center;gap:10px;padding:10px 14px;border-radius:12px;' +
      'border:1px solid rgba(255,97,21,0.35);background:#fff;box-shadow:0 10px 30px rgba(0,0,0,0.2);' +
      'max-width:420px;margin:0 auto;font-family:inherit;';
    banner.innerHTML =
      `<span style="font-size:12px;font-weight:500;color:#111;flex:1;">` +
      `An update is available. Refresh to get it (${isMac ? 'Cmd+Shift+R' : 'Ctrl+Shift+R'}).</span>` +
      `<button id="bayloas-update-refresh" style="padding:6px 12px;border-radius:8px;background:#FF6115;` +
      `color:#fff;font-size:12px;font-weight:600;border:none;cursor:pointer;">Refresh Now</button>` +
      `<button id="bayloas-update-dismiss" aria-label="Dismiss" style="padding:4px;border-radius:6px;` +
      `background:transparent;border:none;color:#888;cursor:pointer;font-size:14px;">✕</button>`;
    document.body.appendChild(banner);
    document.getElementById('bayloas-update-refresh').onclick = () => window.location.reload();
    document.getElementById('bayloas-update-dismiss').onclick = () => {
      dismissed = true;
      banner.remove();
    };
  }

  function check() {
    fetch('/version.json?_=' + Date.now(), { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.version && data.version !== CURRENT_BUILD_ID) showBanner();
      })
      .catch(() => {});
  }

  check();
  setInterval(check, CHECK_INTERVAL_MS);
  window.addEventListener('focus', check);
  document.addEventListener('visibilitychange', check);
})();
