# 03 · Claude Code Master Prompt — Open Tickets Visual Refresh

Paste this into a fresh Claude Code session to continue the work. It is self-contained.

---

You are continuing the **Open Tickets visual refresh** (https://opentickets.co.za, a South African ticketing site built
on Laravel + Livewire, Bootstrap 4 "Osahan/SB Admin 2" theme, jQuery, Slick, Alpine, Isotope bundled with Vite).
Your job is to keep the delivered front-end working, extend it within scope, and help integrate it into the theme.
**Write and test real code; do not stop at documentation.** Finish every task with the QA suite passing, the changes
committed and pushed to the working branch, and the static site still deployable (no build step required).

## Source of truth (read first)
1. `README.md`: structure, integration guide, Isotope contract, behaviour changes.
2. `design-handoff/opentickets-visual-refresh/01_CLIENT_BRIEF_ANALYSIS.md`: REQ-001…034 and assumptions A-01…08.
3. `design-handoff/opentickets-visual-refresh/02_CREATIVE_DESIGN_BLUEPRINT.md`: the chosen system ("Stub & Spotlight" structure, "Golden Ticket" finish, §2.2).
4. `src/` (templates, partials, data), `assets/css/ot-tokens.css`, `assets/css/ot-theme.css`, `assets/js/*.js`.
5. `tools/build.mjs` (page generator), `tools/qa.cjs` (Playwright QA), `tools/serve.mjs` (preview server).

## Non-negotiables
- Stack: HTML + **Bootstrap 5** + custom CSS + **vanilla JS**. Keep **Isotope**. Add no other framework or library
  without the client's approval.
- Isotope contract stays exactly: `#events-grid` (`.row`), `.grid-item` with lower-case `data-name` / `data-venue`,
  options `{ itemSelector: '.grid-item', layoutMode: 'fitRows' }`, `#nav-search-input` in the top bar directly right of
  the logo, `keyup` → `window` `CustomEvent('filter-grid', { detail: query })` only when `query.length >= 3 || === 0`,
  matching on name OR venue, hero collapses at ≥ 3 characters, Enter submits `GET search?q=`. Filter functions must
  accept the element argument (Isotope 3 does not bind `this` without jQuery).
- Top navigation stays fixed and shrinks on scroll.
- Colours and other visual values only through `ot-tokens.css` custom properties.
- User-facing copy only in `src/partials`, `src/pages`, `src/data`, never in JS (use `data-label-*` templates).
- Keep the legacy hooks listed in the README so the Livewire theme keeps working.
- Do not fabricate content. Sample content must carry the `.ot-sample-badge`.
- Out of scope: the "Appel – soos net hy kan" seating map and any page beyond the four screens (follow-up project).
- Never change the ticketing flow, backend routes, payments or production configuration.

## Workflow
1. `npm run serve`, then open `http://localhost:8080`. Edit `src/` and `assets/`, then run `npm run build`
   (never hand-edit the generated `*.html` or `events/*.html`).
2. Responsive targets: 1440, 1024, 768, 390, 360 px, with no horizontal overflow, clipping or overlap. Banners are
   always shown whole (`object-fit: contain` with the blurred fill).
3. Accessibility: one `h1` per page, landmarks, visible focus, 44 px targets, reduced-motion support. Run axe if available.
4. `npm run qa` must report all checks passing. Add a check for every new behaviour you build.
5. Commit with a descriptive message and push to the working branch. Report what you tested and the result.

## Likely next tasks
- **When the client sends captures of a live event page and `/search?q=` page:** align `src/pages/event.html` and
  `src/pages/search.html` to their exact information and controls (A-02), keeping the shared card and tokens.
- **Theme integration:** convert partials to Blade includes, swap `{{ value }}` placeholders for model fields and
  `site.json` routes for `route()` helpers, wrap strings in `__()` (the capture was in Portuguese; map the keys), mount the
  existing booking Livewire component inside `#tickets` with the `.ot-ticket-*`/`.ot-qty` classes, and give the Livewire
  chatbot launcher `.ot-fab .ot-chat-launcher` inside `.ot-fab-stack`.
- **FAQ category pages (only if commissioned):** Bootstrap 5 accordion using the same tokens; content from the CMS.

## Done means
All REQ items still pass, `npm run qa` is green, the README is updated for any behaviour change, and the work is
committed and pushed, with any blocker (missing captures, access, licence) reported plainly.
