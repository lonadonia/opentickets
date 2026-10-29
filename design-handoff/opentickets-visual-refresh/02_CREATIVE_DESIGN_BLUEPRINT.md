# 02 · Creative Design Blueprint — Open Tickets Visual Refresh

## 1. Experience thesis

> For South African fans and families who come back to Open Tickets to grab tickets fast, the interface should feel
> **familiar, confident and occasion-worthy**: the same landmarks in the same places, framed with a cinematic stage for
> the organisers' artwork, a gold "golden ticket" action colour and a ticket-stub motif drawn from the logo, so buyers
> find an event and reach checkout without relearning anything.

The core tension is **premium vs. familiar**. It is resolved by changing finish, not structure: every landmark
(rail, top search, banner slider, card grid, footer) stays in place, and type, colour, depth and detail carry the upgrade.

## 2. Direction history

### 2.1 Three territories considered (first pass)

| | A · Stub & Spotlight (chosen) | B · Night Venue | C · Editorial Programme |
|---|---|---|---|
| Proposition | The site becomes the ticket: a navy "stage" spotlights banners; cards and the booking panel take the logo's notched, perforated stub | Fully dark, glowing UI, like a venue at night | A printed festival programme: serif display type, list-led layout, generous white space |
| Layout DNA | Live layout kept 1:1; refined grid and spacing | Live layout, dark everywhere | Moves from a card grid to editorial lists |
| Risk | Low; strongest familiarity | Organiser banners with dark edges disappear; tiring for long scans | Forces returning users to relearn; weaker for image-led listings |

| Criterion (weight) | A | B | C |
|---|---|---|---|
| Brief / brand fidelity (30%) | 5 | 3 | 2 |
| Task clarity & conversion (25%) | 5 | 4 | 3 |
| Originality & craft (20%) | 4 | 4 | 5 |
| Accessibility & responsive (15%) | 5 | 3 | 4 |
| Feasibility & performance (10%) | 5 | 4 | 3 |
| **Weighted** | **4.80** | 3.55 | 3.25 |

### 2.2 Current direction: "Golden Ticket" (third pass, inspired by the client's reference concepts)

The client shared two concept images (a warm gold/ochre design and a navy one) as inspiration, with the instruction
not to copy them literally. Territory A was kept as the structure, and the references shaped its finish:

| Taken from the references (adapted) | Deliberately **not** copied, and why |
|---|---|
| Warm ochre gold as the single action colour, against charcoal navy | Stock photography: the site keeps the organisers' real banners |
| A clean white frame (header + rail) around a dark, cinematic hero | A new or redrawn logo: the current logo is kept, only recoloured to charcoal for the white header |
| A large editorial headline with one italic serif accent word | Prices, countdowns or "selling fast" labels on cards: Open Tickets has no such data on the listing, so none is invented |
| Category labels on every card, and a clear "Get tickets" button | Category filter chips, sorting and pagination: the live Isotope filter is the only filter, in its exact place |
| A "why book with us" band | Moving search into the hero: the Isotope input must stay in the top bar, right of the logo |
| A "My account" button in the header | New flows (wishlists, carts, sign-up walls): the booking flow is out of scope and unchanged |

What goes beyond the references: the stage glow that takes the colours of each event's own artwork; the logo's
ticket notches and perforations on cards, FAQ topics, the ticket panel, the info band, the stage and the footer; a
ticket panel that is itself a ticket (dark stub with the date, perforated tear line, white body); and three working
quick actions on the event page (add to calendar, share, directions) that need no backend.

## 3. Signature motifs

### Stage + canvas
- Every screen opens on a dark **stage** (`.ot-stage`): Home hero, FAQ header, Event banner, Search header, with a
  fine film grain (inline SVG noise, no request).
- **Ambient glow** (`.ot-ambient`): a blurred copy of the event artwork tints the stage in that artwork's own colours.
  On Home it cross-fades with the active slide (1.4 s); on FAQ/Event it uses the page image. A scrim and vignette sit
  above it, so text never depends on the artwork (minimum **5.2:1** over 128 samples, see 04).
  The glow is painted at 1/8 size and scaled up 8× (`blur(10px)` × 8 = an 80 px blur), which keeps slide changes smooth
  on low-end phones.
- **Ticket perforation:** the stage tears off into the light canvas along a row of small holes
  (`--ot-perf-r` / `--ot-perf-gap`), and the footer repeats the edge on top.

### The ticket stub (from the Open Tickets logo: a ticket outline with side notches and a perforated line)
- **Event cards:** notches where artwork meets details; a glass category badge on the artwork; the stub column shows
  day (ink, Barlow Condensed), month (gold) and year behind a perforated line; a tear-off foot with "Mobile ticket"
  and a gold **Get tickets** pill.
- **FAQ topics:** each topic is a ticket: icon, title and "View answers" on the left; the question count, set large
  in gold Barlow Condensed, on a tinted stub.
- **Ticket panel (event page):** a dark stub (weekday, day, month; title, date, venue) torn along a perforated, notched
  line from a white body with the ticket rows, total and checkout.
- **Info band (home):** one wide dark ticket notched on both sides, a perforated divider between title and content.

### Type accents
- **Instrument Serif Italic** for one accent word per headline ("Your next great *event* is waiting.",
  "Upcoming *events*", "Tickets made *simple.*", "Frequently Asked *Questions*", "Still need *help?*", "All *events*"):
  gold-700 on light, gold-300 on dark.
- **Eyebrows:** small spaced capitals in gold with a short gold rule before them.

## 4. Design tokens (`assets/css/ot-tokens.css`)

| Role | Token | Value | Notes |
|---|---|---|---|
| Stage / footer / dark tickets | `--ot-navy-950` … `-600` | `#10141f` `#141a28` `#1f2533` `#2a3142` `#333545` | `#1f2533` = live sidebar |
| Action (buttons, with ink text) | `--ot-gold-500` | `#d6a547` | Ink on gold **7.7:1** |
| Hover / icons on light | `--ot-gold-400` / `-600` | `#e3b75a` / `#b8862a` | Icons 3.2:1 (graphics ≥ 3:1) |
| Gold text on light | `--ot-gold-700` / `-800` | `#8a6417` / `#7d5a12` | 5.4:1 on white, 4.9:1 on canvas; 5.7:1 on gold-50 |
| Gold text on dark | `--ot-gold-300` | `#e7bf63` | 10.0:1 on navy-900 |
| Gold tints | `--ot-gold-50` / `-100` | `#fbf3e0` / `#f5e4bd` | Active rail item, icon tiles, soft badges |
| Ink / text / muted | `--ot-ink` / `--ot-text` / `--ot-muted` | `#141a28` / `#343a4a` / `#5f6676` | Muted 5.3:1 on canvas |
| Canvas / field / tint / surface | `--ot-canvas` / `--ot-field` / `--ot-tint` / `--ot-surface` | `#f7f5f0` / `#f6f3ec` / `#faf6ec` / `#fff` | Warm off-white |
| Lines | `--ot-line` / `--ot-line-strong` | `#e9e5dc` / `#d8d2c4` | Perforations use line-strong |
| Text on the stage | `--ot-on-dark` / `--ot-on-stage-muted` | `#fff` / `#c9d0dc` | 11.2:1 on navy-900 |
| Glows and shadows | `--ot-gold-rgb`, `--ot-gold-deep-rgb`, `--ot-ink-rgb`, `--ot-night-rgb`, `--ot-blue-rgb` | r, g, b lists | Used as `rgba(var(--…), alpha)` so glows retheme with the palette |
| Legacy reference | `--ot-blue-500` / `--ot-red-500` | `#4e73df` / `#e74a3b` | Live blue kept only as a faint cool counter-glow |

**Type:** Be Vietnam Pro 400/500/600/700 (UI), Barlow Condensed 600/700 (stub dates, counters),
Instrument Serif Italic 400 (accent words only). Base 16 px (live 13.6 px).
Scale: 12 · 14 · 16 · 18 · `clamp` 20–24 · `clamp` 26–36 · `clamp` 30–44 · hero `clamp` 34–62.

**Space and shape:** container 84 rem, gutter `clamp(1rem…2rem)`; radii 8 / 16 / 22 px plus pills; ticket notch 11 px;
shadows in ink tints; the gold buttons carry a soft gold shadow and a top highlight.

**Motion:** 160 / 280 / 800 ms with `cubic-bezier(.2,.7,.2,1)`. The 800 ms hero collapse matches the live
`x-collapse.duration.800ms`. Every duration drops to zero under `prefers-reduced-motion`.

## 5. Site map and components

Home · FAQs (→ live category pages) · Event detail (→ booking flow) · Search results.
Shared: fixed white header (logo, search/filter, language, My account), white rail / off-canvas menu, dark footer,
floating actions (back-to-top, gold chat launcher). Components: hero intro, hero slide, badges (gold, glass, soft),
event card, info band, FAQ topic ticket, help band, breadcrumb, search form, empty state, fact strip, quick actions,
toast, venue card, ticket rows + quantity stepper, ticket panel, mobile booking bar, buttons (primary, outline, ghost).

## 6. Page specifications

### Home (REQ-001, 012–015)
1. **Header (fixed, white):** charcoal logo cell aligned over the rail; **search/filter directly right of it (live
   position)** with a gold search button; language and **My account** on the right. Shrinks 76 → 62 px after 16 px of
   scroll and turns translucent with a blur.
2. **Hero stage:** eyebrow "Live events · Real experiences", headline "Your next great *event* is waiting.", one-line
   lead; on the right, glass chips (event count, wallet tickets) and **Browse all events**. Below, the 11 live banners in
   centre mode with neighbours peeking and infinite looping (as Slick did). Under the active banner: gold category
   badge, "Featured", 01/11 counter, title, date · time, venue, **Get tickets**. Arrows on the slide edges (gold on
   hover), dots with an autoplay progress fill, and a pause control. The whole stage collapses (800 ms) while the filter
   query has ≥ 3 characters.
3. **Events:** "What's on" / "Upcoming *events*"; the count pill shows "27 events listed", or "3 of 27 events match
   'sundowns'" while filtering. Isotope `fitRows` grid: 1 column < 768, 2 from 768, 3 from 1200. Empty state when
   nothing matches.
4. **Info band:** "Good to know" / "Tickets made *simple.*" with three points taken from the live Support page copy
   (no printing needed, football to festivals, help when you need it → FAQs).

### FAQs (REQ-002, 016–017)
Split stage: eyebrow, "Frequently Asked *Questions*", one-line lead, "19 answers · 5 topics", and the live FAQ image
(image first on mobile). Five topic tickets in live order linking to the live category pages. Help band: the
"no printed tickets" tip from the live Support page, plus a dark "Still need *help?*" card → Chat with Support.

### Event detail (REQ-003, 018)
Breadcrumb → organiser banner shown whole on the stage → two columns at ≥ 992 px:
- **Left:** soft category badge, title, one Date / Time / Venue strip; quick actions **Get tickets** (→ `#tickets`),
  **Add to calendar** (downloads an `.ics` built in the browser), **Share** (native share sheet, or copies the link and
  confirms with a toast), **Directions** (Google Maps search for the venue); "About this event" (sample, badged);
  Venue card with "Open in Maps"; "Good to know".
- **Right:** the sticky **ticket panel** (`#tickets`): the existing booking component mounts in its body (sample rows,
  badged).
Below 992 px: a single column (panel after the content) plus a fixed bottom bar (title, date, Get tickets) that slides
away while the panel is on screen.

### Search results (REQ-004, 019–020)
Stage: breadcrumb → "Results for 'query'" (or "All *events*") → count → pill search field (GET `?q=`); then the same
event cards → empty state with "Browse all events".

## 7. Responsive behaviour

| Width | Behaviour |
|---|---|
| 1440 | Rail 104 px; hero intro in two columns; hero peeks ≈ 100 px; 3-column cards; info band in two parts; event page 8/4 split with sticky ticket panel |
| 1024 | Rail; hero intro two columns; 2-column cards; event page 7/5 split |
| 768 | Rail; hero intro stacked; 2-column cards; info band 3 columns; event page single column + bottom booking bar |
| 390 / 360 | Rail becomes an off-canvas menu (hamburger, live `#sidebarToggleTop`); top bar shows logo, search icon (→ search page, as the live mobile "Search" item), language; My account moves to the menu; hero caption stacks with a full-width CTA; 1-column cards; facts stack; footer 2 columns |

## 8. Motion storyboard
Hero intro rises in (900 ms, 80 ms stagger) · header condense (280 ms) · hero slide snap (native smooth scroll), 6 s
autoplay paused on hover/focus/hidden tab/off-screen or by the user, progress fill in the active dot · ambient
cross-fade 1.4 s · inactive slides desaturate and recede (scale .955, 450 ms) · hero collapse on filter (800 ms) · card
lift 6 px with a deeper shadow, artwork zoom 1.04, CTA arrow nudge · FAQ ticket lift and icon fill · content entering
from below the fold fades up 24 px over 700 ms (only elements that start off-screen) · mobile booking bar slide ·
toast for 2.6 s. Reduced motion: no autoplay, no transitions, instant scrolling.

## 9. Accessibility and performance rules
Skip link; landmarks (header, nav, main, footer, quick-actions aside); one `h1` per page; visible 3 px focus rings
(gold-700 on light, gold-300 on dark); 44 px touch targets; carousel with `aria-roledescription`, labelled dots
(`aria-current`), pause toggle (`aria-pressed`), inactive slides out of the tab order; live regions for result counts
and the share toast; artwork alt text on banners (card images are decorative because the title follows in the same link).
Performance: self-hosted woff2 with `font-display: swap` and preloading; card images at 720 px with lazy loading;
banners converted from CMYK (≈ 700 KB) to sRGB JPEG (≈ 70 KB); blurred fills reuse the already-loaded image; the stage
glow renders at 1/8 size; no jQuery or Slick.

## 10. Asset inventory

| Asset | Status |
|---|---|
| Logo `logo-icon.png` | Client original, unchanged (footer, favicon) |
| Logo `logo-icon-dark.png` | The same logo, recoloured `#141a28` (alpha kept) for the white header and menu |
| 26 event banners | Client originals, colour-converted and recompressed; 720 px card versions generated |
| FAQ hero | Client original (PNG → JPEG) |
| Fonts | Be Vietnam Pro, Barlow Condensed, Instrument Serif (all OFL), self-hosted |
| Icons | Lucide (ISC) + Simple Icons (CC0) SVG sprite, 51 symbols |
| Event categories | Editorial labels derived from each event's title and banner (`category` in `events.json`); confirm or map to CMS categories |
| Event description, ticket rows | **Sample**, badged; to be replaced by CMS/booking data |

## 11. Handoff decisions
- Live markup hooks kept: `#events-grid`, `.grid-item`, `data-name/venue`, `.e-card`, `.m-card-cover`, `.navbar-search`,
  `#nav-search-input`, `#sidebarToggleTop`, `#accordionSidebar`, `#languageDropdown`, `.scroll-to-top`, `.osahan-slider-item`.
- Partials are Blade-shaped; destinations sit in one data file; copy never lives in JS.
