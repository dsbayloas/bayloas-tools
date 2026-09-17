// Shared header/footer injected on every tool page, so the nav only has
// to be edited in one place. Plain JS, no build step - keeps this whole
// site deployable as-is with zero tooling.
(function () {
  const links = [
    { href: '/tools/', label: 'All Tools' },
    { href: '/tools/fuel-cost-calculator.html', label: 'Fuel Cost' },
    { href: '/tools/cost-per-mile-calculator.html', label: 'Cost Per Mile' },
    { href: '/tools/ifta-guide.html', label: 'IFTA Guide' },
    { href: '/tools/route-planner.html', label: 'Route Planner' },
  ];
  const path = window.location.pathname.replace(/\/$/, '') || '/tools';

  const header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML = `
    <div class="wrap">
      <a class="brand" href="/tools/">
        <img src="/tools/assets/logo.png" alt="Bayloas" />
        BAYLOAS FREE TOOLS
      </a>
      <nav>
        ${links
          .map((l) => {
            const isActive = l.href.replace(/\/$/, '') === path || (l.href === '/tools/' && path === '/tools/index.html'.replace('/index.html', ''));
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
