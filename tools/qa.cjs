#!/usr/bin/env node
/**
 * Open Tickets visual refresh — automated QA (requires Playwright: `npm i -D playwright && npx playwright install chromium`).
 *
 * Serves the repository over a throwaway local HTTP server (web fonts do not load from file://), then checks:
 *   - every screen at 1440 / 1024 / 768 / 390 / 360 px: no horizontal overflow, no console errors,
 *     no failed requests, no broken images; saves a screenshot per screen and width
 *   - Isotope: unchanged selectors/config, keyup → filter-grid contract, filtering by name and venue,
 *     hero collapse, empty state, reset, Enter submits to the search page
 *   - fixed header shrinks on scroll; mobile menu opens; language dropdown opens
 *   - FAQ destinations, search preview states, event page booking interactions, internal links resolve
 *
 * Usage: node tools/qa.cjs [outputDir]   (default: qa-output/)
 */
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

const root = path.join(__dirname, '..');
const outDir = path.resolve(process.argv[2] || path.join(root, 'qa-output'));
fs.mkdirSync(outDir, { recursive: true });

const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.map': 'application/json' };
const server = http.createServer((req, res) => {
  const file = path.join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404).end('not found');
    return;
  }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

const results = [];
const record = (id, name, pass, detail = '') => {
  results.push({ id, name, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${id}  ${name}${detail ? `  — ${detail}` : ''}`);
};

const WIDTHS = [1440, 1024, 768, 390, 360];
const PAGES = [
  ['home', 'index.html'],
  ['faq', 'faq.html'],
  ['event', 'event.html'],
  ['search', 'search.html?q=sundowns'],
  ['search-empty', 'search.html?q=zzzz'],
];

async function openPage(browser, base, url, width, opts = {}) {
  const context = await browser.newContext({ viewport: { width, height: width < 768 ? 844 : 900 }, ...opts });
  const page = await context.newPage();
  const problems = [];
  page.on('console', (m) => { if (m.type() === 'error') problems.push(`console: ${m.text()}`); });
  page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`));
  page.on('requestfailed', (r) => { if (r.url().startsWith(base)) problems.push(`failed: ${r.url()}`); });
  page.on('response', (r) => { if (r.url().startsWith(base) && r.status() >= 400) problems.push(`${r.status()}: ${r.url()}`); });
  await page.goto(`${base}/${url}`, { waitUntil: 'load' });
  await page.waitForTimeout(400);
  return { context, page, problems };
}

(async () => {
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch();

  /* 1. Layout per screen and width */
  for (const [name, url] of PAGES) {
    for (const width of WIDTHS) {
      const { context, page, problems } = await openPage(browser, base, url, width);
      // Scroll through the page so lazy images load, then return to the top
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(500);
      const m = await page.evaluate(() => ({
        sw: document.documentElement.scrollWidth,
        cw: document.documentElement.clientWidth,
        broken: Array.from(document.images).filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src),
      }));
      await page.screenshot({ path: path.join(outDir, `${name}-${width}.png`), fullPage: true });
      record(`LAYOUT-${name}-${width}`, `${name} @${width}px: no overflow, errors or broken images`,
        m.sw <= m.cw && problems.length === 0 && m.broken.length === 0,
        [m.sw > m.cw ? `overflow ${m.sw}>${m.cw}` : '', ...problems, ...m.broken.map((b) => `broken ${b}`)].filter(Boolean).join('; '));
      await context.close();
    }
  }

  /* 2. Isotope contract + filtering (home, desktop) */
  {
    const { context, page } = await openPage(browser, base, 'index.html', 1440);
    const cfg = await page.evaluate(() => {
      const grid = document.getElementById('events-grid');
      const iso = window.Isotope && window.Isotope.data(grid);
      const items = Array.from(grid.querySelectorAll('.grid-item'));
      return {
        hasIso: Boolean(iso),
        itemSelector: iso && iso.options.itemSelector,
        layoutMode: iso && iso.options.layoutMode,
        items: items.length,
        withData: items.filter((i) => i.hasAttribute('data-name') && i.hasAttribute('data-venue')).length,
        searchInHeader: Boolean(document.querySelector('.ot-header .navbar-search #nav-search-input')),
        searchAfterBrand: document.querySelector('.ot-brand').nextElementSibling === document.querySelector('.navbar-search'),
      };
    });
    record('ISO-001', 'Isotope initialised on #events-grid with itemSelector .grid-item and layoutMode fitRows',
      cfg.hasIso && cfg.itemSelector === '.grid-item' && cfg.layoutMode === 'fitRows', JSON.stringify(cfg));
    record('ISO-002', 'Every card keeps data-name and data-venue', cfg.items === 27 && cfg.withData === 27, `${cfg.withData}/${cfg.items}`);
    record('ISO-003', 'Filter control (#nav-search-input) sits in the top bar, directly after the logo', cfg.searchInHeader && cfg.searchAfterBrand);

    const visible = () => page.evaluate(() => {
      const iso = window.Isotope.data(document.getElementById('events-grid'));
      return iso.filteredItems.map((i) => i.element.getAttribute('data-name'));
    });
    const events = [];
    await page.exposeFunction('__otLog', (d) => events.push(d));
    await page.evaluate(() => window.addEventListener('filter-grid', (e) => window.__otLog(e.detail)));

    await page.click('#nav-search-input');
    await page.keyboard.type('su');
    await page.waitForTimeout(200);
    record('ISO-004', 'Fewer than 3 characters dispatches nothing', events.length === 0, JSON.stringify(events));

    await page.keyboard.type('ndowns');
    await page.waitForTimeout(900);
    const byName = await visible();
    const heroCollapsed = await page.evaluate(() => document.querySelector('[data-ot-hero-collapse]').classList.contains('is-collapsed'));
    const countText = await page.textContent('[data-ot-grid-count]');
    record('ISO-005', 'Typing "sundowns" filters by data-name (3 matches)', byName.length === 3 && byName.every((n) => n.includes('sundowns')), byName.join(' | '));
    record('ISO-006', 'Hero collapses while the filter query has >= 3 characters', heroCollapsed);
    record('ISO-007', 'Result count reflects the filter', /3 of 27/.test(countText), countText);

    await page.fill('#nav-search-input', '');
    await page.keyboard.type('fnb stadium');
    await page.waitForTimeout(700);
    const byVenue = await visible();
    record('ISO-008', 'Typing a venue ("fnb stadium") filters by data-venue', byVenue.length === 1 && byVenue[0].includes('kaizer chiefs'), byVenue.join(' | '));

    await page.fill('#nav-search-input', '');
    await page.keyboard.type('zzzz');
    await page.waitForTimeout(700);
    const emptyShown = await page.evaluate(() => !document.querySelector('[data-ot-grid-empty]').hidden);
    record('ISO-009', 'No matches shows the empty state', (await visible()).length === 0 && emptyShown);

    await page.fill('#nav-search-input', 'x');
    await page.keyboard.press('Backspace');
    await page.waitForTimeout(900);
    const reset = await visible();
    const heroBack = await page.evaluate(() => !document.querySelector('[data-ot-hero-collapse]').classList.contains('is-collapsed'));
    record('ISO-010', 'Clearing the field restores all 27 events and the hero', reset.length === 27 && heroBack, `${reset.length} visible`);

    await page.keyboard.type('pirates');
    await Promise.all([page.waitForURL(/search\.html\?q=pirates/), page.keyboard.press('Enter')]);
    const found = await page.evaluate(() => document.querySelectorAll('#search-results .grid-item:not([hidden])').length);
    record('ISO-011', 'Enter submits GET ?q= to the search page', found === 3, `${found} results for "pirates"`);
    await context.close();
  }

  /* 3. Header, hero, menus */
  {
    const { context, page } = await openPage(browser, base, 'index.html', 1440);
    const h0 = await page.evaluate(() => document.querySelector('.ot-header').getBoundingClientRect().height);
    await page.evaluate(() => window.scrollTo(0, 600));
    await page.waitForTimeout(600);
    const h1 = await page.evaluate(() => ({ h: document.querySelector('.ot-header').getBoundingClientRect().height, top: document.querySelector('.ot-header').getBoundingClientRect().top }));
    await page.screenshot({ path: path.join(outDir, 'home-1440-scrolled.png') });
    record('NAV-001', 'Top navigation stays fixed and shrinks on scroll', h1.top === 0 && h1.h < h0, `${h0}px → ${h1.h}px`);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);

    const before = await page.getAttribute('[data-ot-hero-dot][aria-current="true"]', 'data-ot-hero-dot');
    await page.click('[data-ot-hero-next]');
    await page.waitForTimeout(900);
    const after = await page.getAttribute('[data-ot-hero-dot][aria-current="true"]', 'data-ot-hero-dot');
    record('HERO-001', 'Next arrow advances the featured hero', before === '0' && after === '1', `${before} → ${after}`);
    await page.click('[data-ot-hero-prev]');
    await page.click('[data-ot-hero-prev]');
    await page.waitForTimeout(1200);
    const wrapped = await page.getAttribute('[data-ot-hero-dot][aria-current="true"]', 'data-ot-hero-dot');
    record('HERO-002', 'Hero loops backwards from the first slide to the last', wrapped === '10', `active dot ${wrapped}`);

    await page.click('#languageDropdown');
    await page.waitForTimeout(300);
    const langs = await page.evaluate(() => Array.from(document.querySelectorAll('.ot-header .dropdown-menu.show .dropdown-item')).map((a) => a.textContent.trim()));
    record('NAV-002', 'Language dropdown opens with the 9 live languages', langs.length === 9, langs.join(', '));
    await context.close();

    const reduced = await openPage(browser, base, 'index.html', 1440, { reducedMotion: 'reduce' });
    const paused = await reduced.page.getAttribute('[data-ot-hero-toggle]', 'aria-pressed');
    record('A11Y-001', 'Autoplay is off when the visitor prefers reduced motion', paused === 'true');
    await reduced.context.close();

    const mobile = await openPage(browser, base, 'index.html', 390);
    await mobile.page.click('#sidebarToggleTop');
    await mobile.page.waitForTimeout(500);
    const open = await mobile.page.evaluate(() => document.getElementById('accordionSidebar').classList.contains('show'));
    const items = await mobile.page.evaluate(() => Array.from(document.querySelectorAll('#accordionSidebar .ot-rail__link')).filter((a) => a.offsetParent).map((a) => a.textContent.trim()));
    await mobile.page.screenshot({ path: path.join(outDir, 'menu-390.png') });
    record('NAV-003', 'Mobile menu opens from #sidebarToggleTop with the live sidebar items', open && items.join('|') === 'Search|Events|FAQs|Support|My account|Pages|Customers', items.join(' | '));
    await mobile.context.close();
  }

  /* 4. FAQ, search, event */
  {
    const { context, page } = await openPage(browser, base, 'faq.html', 1440);
    const cats = await page.evaluate(() => Array.from(document.querySelectorAll('.ot-faq-card')).map((a) => `${a.querySelector('.ot-faq-card__title').textContent}|${a.querySelector('.ot-faq-card__count').textContent}|${a.getAttribute('href')}`));
    const expected = ['Tickets & Purchasing|2 questions|', 'Ticket Delivery & Downloading Tickets|3 questions|', 'Account & Profile|4 questions|', 'General|6 questions|', 'Football|4 questions|'];
    record('FAQ-001', 'FAQ index keeps the 5 live topics, question counts and order', cats.length === 5 && cats.every((c, i) => c.startsWith(expected[i])), cats.join(' ; '));
    await context.close();
  }
  {
    const { context, page } = await openPage(browser, base, 'search.html?q=zzzz', 1440);
    const state = await page.evaluate(() => ({ empty: !document.querySelector('[data-ot-search-empty]').hidden, shown: document.querySelectorAll('#search-results .grid-item:not([hidden])').length, title: document.querySelector('h1').innerText }));
    record('SRCH-001', 'Search with no matches shows the empty state', state.empty && state.shown === 0, state.title);
    await page.goto(`${base}/search.html?q=loftus`);
    const venue = await page.evaluate(() => document.querySelectorAll('#search-results .grid-item:not([hidden])').length);
    record('SRCH-002', 'Search preview matches venues ("loftus" → 2)', venue === 2, `${venue}`);
    await context.close();
  }
  {
    const { context, page } = await openPage(browser, base, 'event.html', 390);
    const barVisible = await page.evaluate(() => !document.querySelector('[data-ot-mobile-cta]').classList.contains('is-hidden'));
    await page.click('[data-ot-mobile-cta] [data-ot-book]');
    await page.waitForTimeout(1200);
    const barHidden = await page.evaluate(() => document.querySelector('[data-ot-mobile-cta]').classList.contains('is-hidden'));
    record('EVT-001', 'Mobile booking bar is visible and its Buy tickets link scrolls to #tickets', barVisible && barHidden);
    await page.click('[data-ot-ticket] [data-ot-qty="1"]');
    await page.click('[data-ot-ticket] [data-ot-qty="1"]');
    const total = await page.textContent('[data-ot-total]');
    record('EVT-002', 'Preview quantity stepper updates the total', total.trim() === 'R 120.00', total);
    await context.close();
    const desk = await openPage(browser, base, 'event.html', 1440);
    const cta = await desk.page.evaluate(() => {
      const a = document.querySelector('.ot-booking-card [data-ot-book]');
      return a && a.offsetParent !== null ? a.getAttribute('href') : null;
    });
    record('EVT-003', 'Desktop booking card shows the Buy tickets entry point', cta === '#tickets', String(cta));
    await desk.context.close();
  }

  /* 5. Internal links resolve */
  {
    const { context, page } = await openPage(browser, base, 'index.html', 1440);
    const hrefs = new Set();
    for (const url of ['index.html', 'faq.html', 'event.html', 'search.html']) {
      await page.goto(`${base}/${url}`);
      (await page.evaluate(() => Array.from(document.querySelectorAll('a[href]')).map((a) => a.href))).forEach((h) => hrefs.add(h.split('#')[0].split('?')[0]));
    }
    const internal = [...hrefs].filter((h) => h.startsWith(base));
    const bad = [];
    for (const h of internal) {
      const r = await page.request.get(h);
      if (r.status() !== 200) bad.push(`${r.status()} ${h}`);
    }
    const external = [...hrefs].filter((h) => !h.startsWith(base));
    record('LINK-001', `All ${internal.length} internal links resolve`, bad.length === 0, bad.join('; '));
    fs.writeFileSync(path.join(outDir, 'external-links.txt'), external.sort().join('\n') + '\n');
    await context.close();
  }

  await browser.close();
  server.close();
  const failed = results.filter((r) => !r.pass);
  fs.writeFileSync(path.join(outDir, 'qa-results.json'), JSON.stringify(results, null, 2));
  console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
  process.exit(failed.length ? 1 : 0);
})().catch((e) => {
  console.error(e);
  server.close();
  process.exit(1);
});
