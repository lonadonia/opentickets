#!/usr/bin/env node
/**
 * Open Tickets visual refresh — static page builder (zero dependencies).
 *
 * Renders the HTML templates in src/pages with the partials in src/partials and
 * the content in src/data, writing plain HTML files to the repository root.
 *
 * Template syntax (deliberately close to Blade so partials port 1:1):
 *   {{ key.path }}    HTML-escaped value
 *   {{{ key.path }}}  raw value (pre-rendered HTML)
 *   {{> partial }}    include src/partials/partial.html with the same context
 *
 * Usage: node tools/build.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');
const site = JSON.parse(read('src/data/site.json'));
const { events, featured } = JSON.parse(read('src/data/events.json'));

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const escape = (v) => String(v).replace(/[&<>"']/g, (c) => ESC[c]);

function lookup(ctx, path, tpl) {
  const value = path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), ctx);
  if (value === undefined) throw new Error(`Missing template value "${path}" in ${tpl}`);
  return value;
}

function render(name, ctx, kind = 'partials') {
  const source = read(`src/${kind}/${name}.html`);
  return source
    .replace(/\{\{>\s*([\w-]+)\s*\}\}/g, (_, p) => render(p, ctx))
    .replace(/\{\{\{\s*([\w.-]+)\s*\}\}\}/g, (_, k) => lookup(ctx, k, name))
    .replace(/\{\{\s*([\w.-]+)\s*\}\}/g, (_, k) => escape(lookup(ctx, k, name)));
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const repId = site.representativeEvent;

function eventCtx(e, base) {
  const d = new Date(`${e.date}T00:00:00Z`);
  const shortDate = `${DAYS[d.getUTCDay()]}, ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
  return {
    ...e,
    shortDate,
    monthLabel: MONTHS[d.getUTCMonth()],
    weekdayShort: DAYS[d.getUTCDay()],
    isoDateTime: `${e.date}T${e.time}`,
    url: e.id === repId ? `${base}event.html` : `${base}events/${e.id}.html`,
    cardImage: `${base}assets/images/events/card/${e.image}`,
    heroImage: `${base}assets/images/events/${e.image}`,
  };
}

function pageCtx({ base, active, title, description, bodyClass, query = '', scripts = [] }) {
  const internal = new Set(['home', 'faq', 'search']);
  const routes = Object.fromEntries(
    Object.entries(site.routes).map(([k, v]) => [k, internal.has(k) ? base + v : v])
  );
  const nav = ['events', 'faq', 'search'];
  const activeClass = Object.fromEntries(nav.map((n) => [n, n === active ? ' active' : '']));
  const current = Object.fromEntries(nav.map((n) => [n, n === active ? 'aria-current="page"' : '']));
  const lang = site.languages.find((l) => l.code === site.currentLanguage);
  const languageItems = site.languages
    .map((l) => {
      const on = l.code === site.currentLanguage;
      return `<li><a class="dropdown-item${on ? ' active' : ''}" href="${escape(l.href)}" hreflang="${l.code}" lang="${l.code}"${on ? ' aria-current="true"' : ''}>${escape(l.label)}</a></li>`;
    })
    .join('\n');
  const socialLinks = site.social
    .map(
      (s) =>
        `<li><a class="ot-social" href="${escape(s.href)}" target="_blank" rel="noopener" aria-label="${escape(s.label)}"><svg class="ot-icon" aria-hidden="true"><use href="#i-${s.icon}"></use></svg></a></li>`
    )
    .join('\n');
  const pageScripts = scripts.map((s) => `<script src="${base}assets/${s}" defer></script>`).join('\n');
  return {
    base, title, description, bodyClass, query, routes, activeClass, current,
    lang: site.lang, siteName: site.siteName, currentLanguageLabel: lang.label,
    languageItems, socialLinks, pageScripts, icons: read('src/partials/icons.html'),
  };
}

const cards = (list, base) => list.map((e) => render('event-card', eventCtx(e, base))).join('\n');

function write(file, html) {
  const out = join(root, file);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html.replace(/\n{3,}/g, '\n\n'));
  console.log('built', file);
}

// ---------- Home ----------
{
  const base = '';
  const byId = Object.fromEntries(events.map((e) => [e.id, e]));
  const slides = featured
    .map((id, i) => render('hero-slide', { ...eventCtx(byId[id], base), index: i + 1, total: featured.length, loading: i < 2 ? 'eager' : 'lazy' }))
    .join('\n');
  const dots = featured
    .map((id, i) => `<li><button class="ot-hero__dot" type="button" data-ot-hero-dot="${i}" aria-label="Show featured event ${i + 1}: ${escape(byId[id].title)}"${i === 0 ? ' aria-current="true"' : ''}></button></li>`)
    .join('\n');
  const ctx = {
    ...pageCtx({ base, active: 'events', title: 'Open Tickets — Events', description: 'Tickets for football, festivals, shows and school events across South Africa.', bodyClass: 'ot-page-home', scripts: ['vendor/isotope/isotope.pkgd.min.js', 'js/ot-hero.js', 'js/ot-events-grid.js'] }),
    slides, dots, cards: cards(events, base), eventCount: events.length,
  };
  write('index.html', render('home', ctx, 'pages'));
}

// ---------- FAQs ----------
{
  const base = '';
  const total = site.faqCategories.reduce((n, c) => n + c.count, 0);
  const categories = site.faqCategories
    .map((c) => render('faq-category', { ...c, href: site.faqCategoryBase + c.slug, countLabel: `${c.count} ${c.count === 1 ? 'question' : 'questions'}` }))
    .join('\n');
  const ctx = {
    ...pageCtx({ base, active: 'faq', title: 'Frequently Asked Questions — Open Tickets', description: 'Answers about buying tickets, ticket delivery, your account and football events on Open Tickets.', bodyClass: 'ot-page-faq' }),
    categories, faqTotal: total, faqTopics: site.faqCategories.length,
  };
  write('faq.html', render('faq', ctx, 'pages'));
}

// ---------- Search results ----------
{
  const base = '';
  const ctx = {
    ...pageCtx({ base, active: 'search', title: 'Search results — Open Tickets', description: 'Search Open Tickets events by event name or venue.', bodyClass: 'ot-page-search', scripts: ['js/ot-search-preview.js'] }),
    cards: cards(events, base), eventCount: events.length,
  };
  write('search.html', render('search', ctx, 'pages'));
}

// ---------- Event detail (representative screen + one page per captured event for the preview) ----------
{
  const eventsDir = join(root, 'events');
  if (existsSync(eventsDir)) for (const f of readdirSync(eventsDir)) if (f.endsWith('.html')) rmSync(join(eventsDir, f));
  const ticketRows = site.sampleTickets.map((t, i) => render('ticket-row', { ...t, index: i, priceLabel: `R ${t.price.toFixed(2)}` })).join('\n');
  for (const e of events) {
    const isRep = e.id === repId;
    const base = isRep ? '' : '../';
    const ev = eventCtx(e, base);
    const ctx = {
      ...pageCtx({ base, active: 'events', title: `${e.title} — Open Tickets`, description: `Tickets for ${e.title} at ${e.venue} on ${ev.shortDate}.`, bodyClass: 'ot-page-event', scripts: ['js/ot-event.js'] }),
      event: ev, ticketRows,
    };
    write(isRep ? 'event.html' : `events/${e.id}.html`, render('event', ctx, 'pages'));
  }
}
