// Shared header/footer injected on every tool page, so the nav only has
// to be edited in one place. Plain JS, no build step - keeps this whole
// site deployable as-is with zero tooling.
//
// IMPORTANT: this site has no build step, so on every deploy set the SAME
// new value in three places: CURRENT_BUILD_ID here, version.json, and the
// ?v= on style.css/nav.js in every .html page. The ?v= is what makes
// browsers fetch the new files instead of a cached copy.
const CURRENT_BUILD_ID = '2026-09-30-4';

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
  // Keep the current page's chip in view on a phone.
  const active = header.querySelector('nav a.active');
  if (active) active.scrollIntoView({ block: 'nearest', inline: 'center' });

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

  // The old copies of nav.js / style.css / the page sit in the browser
  // cache, so a plain reload() just brought the same banner back. Re-fetch
  // them past the cache first, then reload.
  async function hardRefresh(btn) {
    btn.textContent = 'Updating…';
    btn.disabled = true;
    const files = [window.location.href, '/version.json'];
    try {
      await Promise.all(files.map((f) => fetch(f, { cache: 'reload' }).catch(() => {})));
    } catch {}
    window.location.reload();
  }

  function showBanner() {
    if (dismissed || document.getElementById('bayloas-update-banner')) return;
    const banner = document.createElement('div');
    banner.id = 'bayloas-update-banner';
    banner.setAttribute('role', 'status');
    banner.style.cssText =
      'position:fixed;bottom:16px;left:50%;transform:translateX(-50%);z-index:9999;display:flex;' +
      'align-items:center;gap:10px;padding:8px 8px 8px 14px;border-radius:999px;background:#0B0F19;' +
      'color:#fff;box-shadow:0 8px 24px rgba(0,0,0,0.25);font-family:inherit;white-space:nowrap;';
    banner.innerHTML =
      '<span style="width:8px;height:8px;border-radius:50%;background:#FF6115;flex-shrink:0;"></span>' +
      '<span style="font-size:13px;font-weight:600;">Update available</span>' +
      '<button id="bayloas-update-refresh" style="padding:6px 14px;border-radius:999px;background:#FF6115;' +
      'color:#fff;font-size:12px;font-weight:700;border:none;cursor:pointer;">Refresh</button>' +
      '<button id="bayloas-update-dismiss" aria-label="Dismiss" style="padding:4px 6px;background:transparent;' +
      'border:none;color:rgba(255,255,255,0.6);cursor:pointer;font-size:14px;line-height:1;">✕</button>';
    document.body.appendChild(banner);
    const refreshBtn = document.getElementById('bayloas-update-refresh');
    refreshBtn.onclick = () => hardRefresh(refreshBtn);
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
