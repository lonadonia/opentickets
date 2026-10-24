# 02 · Creative Design Blueprint — Open Tickets Visual Refresh

## 1. Experience thesis

> For South African fans and families who come back to Open Tickets to grab tickets fast, the interface should feel
> **familiar, confident and occasion-worthy**: the same landmarks in the same places, framed with a cinematic stage for
> the organisers' artwork and a ticket-stub motif drawn from the logo, so buyers find an event and reach checkout without
> relearning anything.

The core tension is **premium vs. familiar**. It is resolved by changing finish, not structure: every landmark
(rail, top search, banner slider, card grid, footer) stays in place, and type, colour, depth and detail carry the upgrade.

## 2. Three territories considered

| | A · Stub & Spotlight (chosen) | B · Night Venue | C · Editorial Programme |
|---|---|---|---|
| Proposition | The site becomes the ticket: a navy "stage" spotlights banners; cards and the booking panel take the logo's notched, perforated stub | Fully dark, glowing UI, like a venue at night | A printed festival programme: serif display type, list-led layout, generous white space |
| Layout DNA | Live layout kept 1:1; refined grid and spacing | Live layout, dark everywhere | Moves from a card grid to editorial lists |
| Type | Be Vietnam Pro (continuation of live "Be Vietnam") + Barlow Condensed for stub dates | Same | Serif display + grotesk |
| Palette | Live navy chrome, live blue, live date red; light canvas for scanning | Navy/black + neon accents | Off-white, ink, one accent |
| Risk | Low; strongest familiarity | Organiser banners with dark edges disappear; tiring for long scans | Forces returning users to relearn; weaker for image-led listings |

| Criterion (weight) | A | B | C |
|---|---|---|---|
| Brief / brand fidelity (30%) | 5 | 3 | 2 |
| Task clarity & conversion (25%) | 5 | 4 | 3 |
| Originality & craft (20%) | 4 | 4 | 5 |
| Accessibility & responsive (15%) | 5 | 3 | 4 |
| Feasibility & performance (10%) | 5 | 4 | 3 |
| **Weighted** | **4.80** | 3.55 | 3.25 |

C fails the "no relearning" gate, and B weakens image legibility, so **A** is selected.

## 3. Signature motif: the ticket stub

Taken from the Open Tickets logo (a ticket outline with side notches and a perforated line):

- **Event cards:** half-circle notches where artwork meets details; the date sits in a stub column behind a perforated line.
- **Booking card (event page):** a dark ticket whose stub shows weekday, day and month, notched top and bottom.
- **Section accent:** a short red bar, the date red, before section titles.

## 4. Design tokens (`assets/css/ot-tokens.css`)

| Role | Token | Value | Origin |
|---|---|---|---|
| Chrome / footer | `--ot-navy-800` | `#1f2533` | Live sidebar |
| Deep stage | `--ot-navy-900` | `#171c28` | Derived |
| Raised chrome | `--ot-navy-700` / `-600` | `#2a3142` / `#333545` | Live topbar |
| Brand blue | `--ot-primary-500` | `#4e73df` | Live primary |
| Action (white text 5.6:1) | `--ot-primary-600` | `#3a5fd4` | Derived |
| Date red (large) / text | `--ot-accent-500` / `-600` | `#e74a3b` / `#d23b2d` (4.8:1) | Live `text-danger` |
| Featured label | `--ot-gold-400` | `#f0b544` (9.2:1 on navy) | New, sparing |
| Ink / text / muted | `--ot-ink` / `--ot-text` / `--ot-muted` | `#1b2130` / `#3b4254` / `#5d6475` (5.9:1) | Refined |
| Canvas / surface / line | `--ot-canvas` / `--ot-surface` / `--ot-line` | `#f5f6fa` / `#fff` / `#e3e6ee` | Refined |
| On dark muted | `--ot-on-dark-muted` | `#aab3c5` (7.3:1 on navy) | Refined |

**Type:** Be Vietnam Pro 400/500/600/700 (UI), Barlow Condensed 600/700 (stub dates, small labels).
Base 16 px (live 13.6 px). Scale: 12 · 14 · 16 · 18 · `clamp` 20–24 · `clamp` 24–32 · `clamp` 28–42.
Headings −0.015 to −0.025em tracking, 1.1–1.25 line height. Body 1.6–1.75.

**Space and shape:** container 84 rem, gutter `clamp(1rem…2rem)`; radii 8 / 14 / 20 px plus pills; shadows sm/md/lg in
navy tints; ticket notch 10 px.

**Motion:** 160 / 280 / 800 ms with `cubic-bezier(.2,.7,.2,1)`. The 800 ms hero collapse matches the live
`x-collapse.duration.800ms`. Every duration drops to zero under `prefers-reduced-motion`.

## 5. Site map and components

Home · FAQs (→ live category pages) · Event detail (→ booking flow) · Search results.
Shared: fixed header (logo, search/filter, language), rail / off-canvas menu, footer, floating actions (back-to-top,
chat). Components: hero slide, event card, FAQ topic card, help band, breadcrumb, search form, empty state, fact tiles,
ticket rows + quantity stepper, booking card, mobile booking bar, buttons (primary, ghost).

## 6. Page specifications

### Home (REQ-001, 012–015)
1. **Header (fixed):** logo cell aligned over the rail; **search/filter directly right of it (live position)**; language
   on the right. Shrinks 72 → 58 px after 16 px of scroll with a blurred translucent background.
2. **Featured hero:** navy stage with a soft blue spotlight; 11 live banners in centre mode with neighbours peeking on
   both sides and infinite looping (as Slick did). Below the active banner: gold "Featured" label, event title,
   date · time, venue, and a "Get tickets" button. Arrows sit on the slide edges, with dots and a pause control below.
   The whole hero collapses (800 ms) while the filter query has ≥ 3 characters.
3. **Events:** "Events" title with red accent; the live count, or "3 of 27 events match 'sundowns'" while filtering.
   Isotope `fitRows` grid: 1 column < 768, 2 from 768, 3 from 1200. Empty state when nothing matches.

### FAQs (REQ-002, 016–017)
Split hero: eyebrow, "Frequently Asked Questions", one-line lead, "19 answers across 5 topics", and the live FAQ
image (image first on mobile). Five topic cards in live order, each with a distinct icon, title, "n questions"
and an arrow, linking to the live category pages. Help band: the "no printed tickets" tip from the live Support page,
plus "Still need help?" → Chat with Support.

### Event detail (REQ-003, 018)
Breadcrumb → organiser banner shown whole → two columns at ≥ 992 px: (left) title, Date/Time/Venue fact tiles,
"About this event" (sample, badged), **Tickets** (styled mount point for the existing booking component; sample rows,
badged), "Good to know"; (right) sticky ticket-shaped booking card with the **Buy tickets** entry point.
Below 992 px: a single column plus a fixed bottom bar (title, date, Buy tickets) that slides away while Tickets is on screen.

### Search results (REQ-004, 019–020)
Breadcrumb → "Results for 'query'" (or "All events") → count → pill search field (GET `?q=`) → the same event cards
→ empty state with "Browse all events".

## 7. Responsive behaviour

| Width | Behaviour |
|---|---|
| 1440 | Rail 104 px; hero peeks ≈ 100 px; 3-column cards; event page 8/4 split with sticky booking card |
| 1024 | Rail; 2-column cards (3 columns truncated titles beside the rail); event page 8/4 split |
| 768 | Rail; 2-column cards; event page single column + bottom booking bar |
| 390 / 360 | Rail becomes an off-canvas menu (hamburger, live `#sidebarToggleTop`); top bar shows logo, search icon (→ search page, as the live mobile "Search" item), language; hero caption stacks with a full-width CTA; 1-column cards; footer 2 columns |

## 8. Motion storyboard
Header condense (280 ms) · hero slide snap (native smooth scroll), 6 s autoplay paused on hover/focus/hidden tab/
off-screen or by the user · hero collapse on filter (800 ms) · card lift 4 px with deeper shadow, artwork zoom 1.03 ·
FAQ card lift and arrow nudge · mobile booking bar slide. Reduced motion: no autoplay, no transitions, instant scrolling.

## 9. Accessibility and performance rules
Skip link; landmarks (header, nav, main, footer, quick-actions aside); one `h1` per page; visible 3 px focus rings;
44 px touch targets; carousel with `aria-roledescription`, labelled dots (`aria-current`), pause toggle
(`aria-pressed`), inactive slides out of the tab order; live regions for result counts; artwork alt text on banners
(card images are decorative because the title follows in the same link).
Performance: self-hosted woff2 with `font-display: swap` and preloading; card images at 720 px with lazy loading; banners
converted from CMYK (≈ 700 KB) to sRGB JPEG (≈ 70 KB); blurred fills reuse the already-loaded image; no jQuery or Slick.

## 10. Asset inventory

| Asset | Status |
|---|---|
| Logo `logo-icon.png` | Client original, unchanged |
| 26 event banners | Client originals, colour-converted and recompressed; 720 px card versions generated |
| FAQ hero | Client original (PNG → JPEG) |
| Fonts | Be Vietnam Pro, Barlow Condensed (OFL), self-hosted |
| Icons | Lucide (ISC) + Simple Icons (CC0) SVG sprite |
| Event description, ticket rows | **Sample**, badged; to be replaced by CMS/booking data |

## 11. Handoff decisions
- Live markup hooks kept: `#events-grid`, `.grid-item`, `data-name/venue`, `.e-card`, `.m-card-cover`, `.navbar-search`,
  `#nav-search-input`, `#sidebarToggleTop`, `#accordionSidebar`, `#languageDropdown`, `.scroll-to-top`, `.osahan-slider-item`.
- Partials are Blade-shaped; destinations sit in one data file; copy never lives in JS.
