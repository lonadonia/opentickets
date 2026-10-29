# Open Tickets — Visual Refresh

A premium refresh of four Open Tickets screens: **Home, FAQs, Event detail and Search results**. It is built as
production-ready **HTML + Bootstrap 5 + custom CSS + vanilla JavaScript**, with the existing **Isotope** filter
preserved, so the client's developers can fold it into the current Laravel / Livewire theme.

| Screen | File | Notes |
|---|---|---|
| Home | `index.html` | Featured hero, then the Isotope events grid (27 live events) |
| FAQs | `faq.html` | Same 5 topics, question counts and destinations as the live index |
| Event detail | `event.html` | Representative event: *Mamelodi Sundowns vs Durban City* |
| Search results | `search.html?q=sundowns` | Same card as Home; `search.html?q=zzzz` shows the empty state |

`events/*.html` are the same event template generated for every other captured event, so every card in the
preview opens a matching detail page.

## Preview

```bash
npm run serve          # http://localhost:8080  (zero-dependency Node server)
# or: python3 -m http.server 8080
```

Preview over HTTP. Browsers block web fonts on `file://`, so pages opened by double-click fall back to system fonts.

## Folder structure

```
index.html  faq.html  event.html  search.html  events/      ← generated pages (committed, no build needed)
assets/
  css/  ot-fonts.css   @font-face for the self-hosted fonts
        ot-tokens.css  ALL colours, type, radii, shadows, motion as CSS custom properties (retheme here)
        ot-theme.css   components, written against Bootstrap 5
  js/   ot-core.js          header shrink, back-to-top, nav search → `filter-grid`, artwork fill
        ot-hero.js          featured carousel (replaces Slick + jQuery)
        ot-events-grid.js   Isotope grid (vanilla port of the live Alpine component)
        ot-event.js         event page: mobile booking bar, add to calendar / share, preview ticket steppers
        ot-search-preview.js  STATIC PREVIEW ONLY: filters cards by ?q= (server does this live)
  fonts/   be-vietnam-pro/  barlow-condensed/  instrument-serif/   (woff2 + OFL licences)
  icons/   ot-icons.svg  (SVG sprite, Lucide + Simple Icons) + LICENSES.md
  images/  brand/   logo-icon.png (current logo, unchanged), logo-icon-dark.png (same logo in charcoal, white header)
           events/  the organisers' banners (CMYK files converted to sRGB, recompressed)
           events/card/  720px-wide versions for the cards
           pages/   hero-faqs.jpg
  vendor/  bootstrap/ 5.3.8 (MIT)   isotope/ 3.0.6 (unmodified)
src/
  partials/  header, sidebar, footer, event-card, hero-slide, faq-category, ticket-row, layout-start/end, icons
  pages/     home, faq, event, search templates
  data/      events.json (captured live events, exact data-name/data-venue, category labels), site.json (copy, routes, languages)
tools/  build.mjs (regenerates the pages), serve.mjs, qa.cjs (Playwright QA)
design-handoff/opentickets-visual-refresh/  analysis, design blueprint, QA evidence, delivery notes
```

Editable text lives only in `src/partials`, `src/pages` and `src/data`. The JavaScript files contain no visible copy;
strings that JS fills in (result counts) are templates in `data-label-*` attributes in the HTML.

## Integrating into the Laravel / Livewire theme

1. **Styles** (replace `osahan.min.css`, Bootstrap 4 and the Slick CSS on these screens):
   `bootstrap.min.css → ot-fonts.css → ot-tokens.css → ot-theme.css`.
2. **Scripts**: `bootstrap.bundle.min.js` and `ot-core.js` on every page, plus the page script(s) listed in each HTML
   file's footer. Isotope can stay in the existing Vite bundle; `ot-events-grid.js` only needs `window.Isotope`.
3. **Partials → Blade**: each `src/partials/*.html` maps to one Blade include. `{{ value }}` placeholders are
   deliberately Blade-shaped: swap them for the model fields (`$event->name`, `route('events.show', $event)`, …).
   `src/data/site.json` lists every destination; replace them with `route()` helpers. The routes outside the four
   screens were inferred from the captured pages, so verify them (see the A-03 assumption in the handoff).
4. **Translations**: the capture was taken in Portuguese. Wrap the English UI strings in `__()` with the existing
   keys (Eventos → Events, Suporte → Support, A minha conta → My account, Conteúdo → Content, Páginas → Pages, …).
5. **Livewire components** keep their markup and bindings. Wrap them in the new containers:
   chatbot launcher → `.ot-fab.ot-chat-launcher` inside `.ot-fab-stack`; the ticket selector goes in
   `.ot-ticket-panel__body` inside `#tickets` on the event page (style hooks: `.ot-ticket-list`, `.ot-ticket-row`,
   `.ot-qty`, `.ot-ticket-panel__total`).

### Isotope: what must stay as-is

| Item | Value (unchanged from live) |
|---|---|
| Container | `<div class="row" id="events-grid">` |
| Items | `.grid-item` with `data-name` / `data-venue` (lower-case name / venue) |
| Options | `{ itemSelector: '.grid-item', layoutMode: 'fitRows' }` |
| Filter input | `#nav-search-input` in the top bar, directly right of the logo (same position as live) |
| Event | `keyup` → `window.dispatchEvent(new CustomEvent('filter-grid', { detail: query }))` when `query.length >= 3 \|\| query.length === 0` |
| Matching | `< 3` characters shows all; otherwise `data-name` **or** `data-venue` contains the query |
| Hero | Collapses while the query has ≥ 3 characters, re-opens when cleared |
| Enter | Submits `GET /search?q=` |

Choose **one** implementation in the theme: keep the Alpine `x-data` on `#events-grid` **or** load `ot-events-grid.js`.
Both use the same options and event. One finding from the live code: Isotope 3 calls filter functions as
`fn(element)` without a `this`. The live filter reads `this`, so it only works because jQuery is loaded before the
Vite bundle (Isotope then filters through jQuery). `ot-events-grid.js` takes the element argument and falls back to
`this`, so it works with or without jQuery. Add the same guard to the Alpine version if jQuery is ever removed.

### Retheming

Change the custom properties in `assets/css/ot-tokens.css`. The stage and dark tickets `--ot-navy-*`, the gold action
colour `--ot-gold-*` (with `--ot-gold-rgb` for glows), neutrals, radii, shadows and motion all live there.
Bootstrap's own variables (`--bs-primary`, links, borders, body colours) are mapped onto the same tokens.

## Design system at a glance

Direction **"Golden Ticket"**, inspired by the client's two reference concepts without copying them (details and
what was deliberately left out: `02_CREATIVE_DESIGN_BLUEPRINT.md` §2.2).

- **Frame + stage.** A clean white header and rail frame a dark, cinematic *stage* (`.ot-stage`) that opens every
  screen. An ambient layer (`.ot-ambient`) takes the colours of the event artwork: on Home it follows the active
  banner, and on FAQ/Event it uses the page image. The stage tears off into the warm canvas along a ticket
  perforation, and the footer repeats that edge. A scrim keeps every stage text at ≥ 5.2:1 contrast, whatever the artwork.
- **Gold for action.** Every action (Get tickets, search, checkout, chat) is ochre gold with ink text (7.7:1).
  One italic serif accent word per headline (Instrument Serif) carries the same gold.
- **Ticket shapes.** Event cards, FAQ topics, the event-page ticket panel and the home info band share the logo's
  notched, perforated stub. The card stub shows day, month and year; the FAQ stub shows the question count; the
  ticket panel stub shows the date above its tear line.
- **Motion.** Header shrink, hero crossfade with an autoplay progress bar, card lift with a booking arrow, and a light
  reveal for content entering from below the fold. Everything is disabled under `prefers-reduced-motion`; content
  that starts on screen is never hidden, and nothing stays hidden if JavaScript fails.

## Behaviour changes worth knowing

- The topbar search icon button now submits the search (live it was `type="button"` and did nothing). Enter still submits.
- Slick + jQuery slider → native scroll-snap carousel: same centre mode, peeks and looping, plus swipe, drag,
  arrows, dots, keyboard and a pause control. Autoplay is off for reduced-motion users.
- Card layout: two columns from 768px and three from 1200px (live: three from 768px, which truncates text next to
  the rail). The whole card is still one link, and images are shown whole on a soft fill instead of cropped.
- Card dates: the stub shows `31 / OCT / 2026` and the meta line `Saturday · 20:15` (live: `2026-10-31, 20:15`
  under a day/month badge). Screen readers still hear the full date.
- The chat launcher and back-to-top button are stacked instead of overlapping; the chat button opens into a
  "Chat with support" label on hover/focus.
- Added: a result count and empty state for the filter, a "no results" state on search, breadcrumbs, and a sticky
  ticket panel plus mobile booking bar on the event page.
- Added in the Golden Ticket pass: a hero headline above the carousel; a "My account" button in the header (≥ 992 px,
  same link as the rail item); a category badge and a "Get tickets" pill on every card; a "Good to know" band on
  Home (copy from the live Support page); and on the event page, quick actions (Add to calendar builds an `.ics` in
  the browser, Share uses the native share sheet or copies the link, Directions opens Google Maps) and a venue card.
  Booking buttons read "Get tickets" throughout.
- Card categories (`category` in `events.json`) are editorial labels derived from each title and banner. Map them to
  the CMS categories, or remove the badge, when integrating.

## Quality checks

```bash
npm i -D playwright && npx playwright install chromium   # once
npm run qa                                               # 51 checks; screenshots in qa-output/
```

Results from this delivery are recorded in `design-handoff/opentickets-visual-refresh/04_QA_ACCEPTANCE_CHECKLIST.md`.

## Rebuilding the pages

`npm run build` regenerates every HTML file from `src/`. No dependencies are needed (Node 18+).

## Hosted preview

https://opentickets-visual-refresh.vercel.app (built from `main`, Vercel project `opentickets-visual-refresh`).
Details, other links and status are in `design-handoff/opentickets-visual-refresh/05_GITHUB_VERCEL_HANDOFF.md`.

The repository root is a static site with no build step, so any static host works. On Vercel: framework preset
**Other**, build command `node tools/build.mjs` (or none), output directory `.`. No environment variables are needed.

## Out of scope

The interactive seating map for *"Appel – soos net hy kan"* and any other pages or components belong to the
separately commissioned follow-up project and are not part of this delivery.
