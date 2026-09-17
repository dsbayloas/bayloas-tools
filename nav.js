// Shared header/footer injected on every tool page, so the nav only has
// to be edited in one place. Plain JS, no build step - keeps this whole
// site deployable as-is with zero tooling.
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
