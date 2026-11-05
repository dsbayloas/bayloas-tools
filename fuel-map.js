// Diesel-by-state map for the Fuel Cost Calculator. Move the mouse over a
// state (or tap it) to see this week's diesel price there, how it compares
// with the US average, and the fuel cost per mile at your MPG.
// Prices: ops.bayloas.com/api/public/diesel (EIA weekly regional prices).
// Shapes: /assets/us-map.json (pre-projected, ~40 KB). Plain JS, no build.
(function () {
  const root = document.getElementById('fuel-map');
  if (!root) return;
  const NAMES = {AL:'Alabama',AK:'Alaska',AZ:'Arizona',AR:'Arkansas',CA:'California',CO:'Colorado',CT:'Connecticut',DE:'Delaware',DC:'Washington, DC',FL:'Florida',GA:'Georgia',HI:'Hawaii',ID:'Idaho',IL:'Illinois',IN:'Indiana',IA:'Iowa',KS:'Kansas',KY:'Kentucky',LA:'Louisiana',ME:'Maine',MD:'Maryland',MA:'Massachusetts',MI:'Michigan',MN:'Minnesota',MS:'Mississippi',MO:'Missouri',MT:'Montana',NE:'Nebraska',NV:'Nevada',NH:'New Hampshire',NJ:'New Jersey',NM:'New Mexico',NY:'New York',NC:'North Carolina',ND:'North Dakota',OH:'Ohio',OK:'Oklahoma',OR:'Oregon',PA:'Pennsylvania',RI:'Rhode Island',SC:'South Carolina',SD:'South Dakota',TN:'Tennessee',TX:'Texas',UT:'Utah',VT:'Vermont',VA:'Virginia',WA:'Washington',WV:'West Virginia',WI:'Wisconsin',WY:'Wyoming'};
  const TINY = ['DC','RI','DE','CT','NJ','MD','MA','VT','NH'];
  const SCALE = ['#16a34a','#65a30d','#ca8a04','#ea580c','#dc2626'];
  const TANK = 150;
  const $ = (id) => document.getElementById(id);
  const money = (n) => '$' + n.toFixed(2);
  const num = (id) => Math.max(0, parseFloat(($(id) || {}).value) || 0);

  let diesel = null, sel = null, picked = null, range = null;

  root.innerHTML = `
    <div class="fm-grid">
      <div>
        <div class="fm-head"><strong>Diesel by state</strong><span id="fm-week"></span></div>
        <div id="fm-svg" class="fm-svg"><div class="fm-loading"></div></div>
        <div id="fm-legend" class="fm-legend"></div>
      </div>
      <div id="fm-panel" class="fm-panel"><p class="fm-muted">Loading this week's prices...</p></div>
    </div>`;

  function colorOf(code) {
    const p = diesel && diesel.states[code] && diesel.states[code].price;
    if (!p || !range) return '#cbd5e1';
    const t = range.max > range.min ? (p - range.min) / (range.max - range.min) : 0;
    return SCALE[Math.min(SCALE.length - 1, Math.floor(t * SCALE.length))];
  }

  function panel() {
    const box = $('fm-panel');
    if (!diesel) {
      box.innerHTML = '<p class="fm-muted">This week\'s diesel prices aren\'t available right now - enter your own price in the calculator below.</p>';
      return;
    }
    const s = sel || picked;
    const info = s ? diesel.states[s] : null;
    const us = diesel.us;
    const price = info ? info.price : us;
    const mpg = num('mpg'), miles = num('miles');
    const diff = info ? info.price - us : 0;
    const cpm = mpg > 0 ? price / mpg : 0;
    box.innerHTML = `
      <p class="fm-region">${s ? (info && info.region !== NAMES[s] ? info.region : '&nbsp;') : 'United States'}</p>
      <p class="fm-name">${s ? NAMES[s] || s : 'US average'}</p>
      <p class="fm-price">${money(price)} <span>/ gal</span></p>
      ${info ? `<p class="fm-diff ${diff > 0.005 ? 'up' : diff < -0.005 ? 'down' : ''}">${Math.abs(diff) < 0.005 ? 'Same as the US average' : money(Math.abs(diff)) + (diff > 0 ? ' above' : ' below') + ' the US average (' + money(us) + ')'}</p>` : ''}
      <div class="fm-stats">
        <div><small>Fuel cost / mile</small><b>${cpm ? '$' + cpm.toFixed(3) : '—'}</b><small>${mpg > 0 ? 'at ' + mpg + ' MPG' : 'enter MPG below'}</small></div>
        <div><small>${miles > 0 && mpg > 0 ? 'Trip (' + Math.round(miles) + ' mi)' : 'Fill-up (' + TANK + ' gal)'}</small><b>${miles > 0 && mpg > 0 ? money((miles / mpg) * price) : money(TANK * price)}</b><small>at this price</small></div>
      </div>
      ${info && Math.abs(diff) >= 0.05 ? `<p class="fm-tip">${diff > 0 ? 'Tip: fill up before entering ' + NAMES[s] + ' - about ' + money(diff * TANK) + ' more per ' + TANK + '-gallon fill-up here.' : 'Good place to fill up - about ' + money(-diff * TANK) + ' saved per ' + TANK + '-gallon fill-up vs the US average.'}</p>` : ''}
      <button type="button" class="fm-use" id="fm-use">Use ${money(price)} in the calculator</button>
      <p class="fm-muted">${s ? 'Tap another state, or move the mouse over the map.' : 'Move the mouse over a state (or tap it) to see its price.'} Weekly EIA averages for each region; truck stops can differ by a few cents.</p>`;
    $('fm-use').onclick = () => {
      $('price').value = (Math.round(price * 100) / 100).toFixed(2);
      $('price').dispatchEvent(new Event('input'));
    };
  }

  function draw(map) {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', map.viewBox);
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'US map of diesel prices by state');
    const paths = {};
    Object.entries(map.states).forEach(([code, s]) => {
      const p = document.createElementNS(ns, 'path');
      p.setAttribute('d', s.d);
      p.setAttribute('fill', colorOf(code));
      p.setAttribute('stroke', '#ffffff');
      p.setAttribute('stroke-width', '0.8');
      p.style.cursor = 'pointer';
      const t = document.createElementNS(ns, 'title');
      t.textContent = NAMES[code] || code;
      p.appendChild(t);
      p.addEventListener('mouseenter', () => { sel = code; refresh(); });
      p.addEventListener('click', () => { picked = code; sel = code; refresh(); });
      svg.appendChild(p);
      paths[code] = p;
    });
    Object.entries(map.states).forEach(([code, s]) => {
      if (TINY.includes(code)) return;
      const t = document.createElementNS(ns, 'text');
      t.setAttribute('x', s.x); t.setAttribute('y', s.y + 3);
      t.setAttribute('text-anchor', 'middle'); t.setAttribute('font-size', '15');
      t.setAttribute('font-weight', '700'); t.setAttribute('fill', '#ffffff');
      t.setAttribute('pointer-events', 'none');
      t.textContent = code;
      svg.appendChild(t);
    });
    svg.addEventListener('mouseleave', () => { sel = null; refresh(); });
    $('fm-svg').innerHTML = '';
    $('fm-svg').appendChild(svg);
    function refresh() {
      const s = sel || picked;
      Object.entries(paths).forEach(([code, p]) => {
        p.setAttribute('fill', colorOf(code));
        p.setAttribute('stroke', s === code ? '#0f172a' : '#ffffff');
        p.setAttribute('stroke-width', s === code ? '2' : '0.8');
        p.style.opacity = s && s !== code ? '0.75' : '1';
      });
      panel();
    }
    window.__fmRefresh = refresh;
    refresh();
  }

  Promise.all([
    fetch('/assets/us-map.json').then((r) => r.json()),
    fetch('https://ops.bayloas.com/api/public/diesel').then((r) => r.json()).catch(() => null),
  ]).then(([map, d]) => {
    if (d && d.ok) {
      diesel = d;
      const v = Object.values(d.states).map((s) => s.price);
      range = { min: Math.min(...v), max: Math.max(...v) };
      $('fm-week').textContent = 'Week of ' + new Date(d.period + 'T00:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }) + ' · EIA';
      $('fm-legend').innerHTML = `<span>Cheaper ${money(range.min)}</span><i style="background:linear-gradient(to right,${SCALE.join(',')})"></i><span>${money(range.max)} Pricier</span>`;
    }
    draw(map);
  }).catch(() => {
    $('fm-svg').innerHTML = '<p class="fm-muted">The map could not load.</p>';
    panel();
  });

  ['mpg', 'miles'].forEach((id) => $(id) && $(id).addEventListener('input', () => window.__fmRefresh && window.__fmRefresh()));
})();
