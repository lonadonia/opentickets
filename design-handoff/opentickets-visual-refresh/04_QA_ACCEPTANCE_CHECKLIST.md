# 04 · QA & Acceptance Checklist — Open Tickets Visual Refresh

**Environment:** headless Chromium (Playwright 1.63.0), Node 22.22.0, pages served over local HTTP by `tools/qa.cjs`.
**Date:** 2026-10-23/24. **Command:** `npm run qa` → **49/49 passed** on two consecutive runs after the final fix.
Statuses: `VERIFIED_PASS`, `FAILED`, `NOT_TESTED`, `BLOCKED_EXTERNAL`, `NOT_APPLICABLE`.

## 1. Layout: every screen at every target width (REQ-001…004, 029, 030)

Check per page and width: `scrollWidth ≤ clientWidth` (no horizontal overflow), no console errors, no failed or 4xx
requests, no broken images, with the whole page scrolled first so lazy images load. A full-page screenshot is saved for each.

| Screen | 1440 | 1024 | 768 | 390 | 360 |
|---|---|---|---|---|---|
| Home `index.html` | VERIFIED_PASS | VERIFIED_PASS | VERIFIED_PASS | VERIFIED_PASS | VERIFIED_PASS |
| FAQs `faq.html` | VERIFIED_PASS | VERIFIED_PASS | VERIFIED_PASS | VERIFIED_PASS | VERIFIED_PASS |
| Event `event.html` | VERIFIED_PASS | VERIFIED_PASS | VERIFIED_PASS | VERIFIED_PASS | VERIFIED_PASS |
| Search `search.html?q=sundowns` | VERIFIED_PASS | VERIFIED_PASS | VERIFIED_PASS | VERIFIED_PASS | VERIFIED_PASS |
| Search empty `?q=zzzz` | VERIFIED_PASS | VERIFIED_PASS | VERIFIED_PASS | VERIFIED_PASS | VERIFIED_PASS |

Visual review of the screenshots (manual) found and fixed: three cramped columns at 1024 px beside the rail (cards are
now 2 columns until 1200 px), the mobile menu close button position, and a missing left peek on the first hero slide
(the hero now loops). Evidence: `screenshots/01…12`.

## 2. Isotope: position, controls, filtering unchanged (REQ-013, 014, 022, 024, 031)

| Test | Scenario | Evidence | Result |
|---|---|---|---|
| ISO-001 | Isotope instance on `#events-grid` with `itemSelector: '.grid-item'`, `layoutMode: 'fitRows'` | Read from `Isotope.data(grid).options` | VERIFIED_PASS |
| ISO-002 | All 27 cards carry `data-name` and `data-venue` (exact live values) | 27/27 | VERIFIED_PASS |
| ISO-003 | `#nav-search-input` is inside the top bar `.navbar-search`, immediately after the logo cell | DOM order check | VERIFIED_PASS |
| ISO-004 | Typing "su" (< 3 chars) dispatches no `filter-grid` | 0 events captured | VERIFIED_PASS |
| ISO-005 | "sundowns" → 3 cards, all matching by name | 3 names listed | VERIFIED_PASS |
| ISO-006 | Hero collapses at ≥ 3 characters | `.is-collapsed` | VERIFIED_PASS |
| ISO-007 | Count updates | "3 of 27 events match 'sundowns'" | VERIFIED_PASS |
| ISO-008 | "fnb stadium" → matches by venue | Kaizer Chiefs vs TS Galaxy | VERIFIED_PASS |
| ISO-009 | "zzzz" → 0 cards + empty state | Empty state visible | VERIFIED_PASS |
| ISO-010 | Clearing the field → all 27 back, hero re-opens | 27 visible | VERIFIED_PASS |
| ISO-011 | Enter submits `GET search.html?q=pirates` | 3 results on search page | VERIFIED_PASS |

## 3. Navigation, hero and interaction checks (REQ-025, 032)

| Test | Scenario | Evidence | Result |
|---|---|---|---|
| NAV-001 | Header stays fixed at top and shrinks on scroll | 72 px → 58 px, `top = 0` | VERIFIED_PASS |
| NAV-002 | Language dropdown opens with the 9 live languages | List matches live | VERIFIED_PASS |
| NAV-003 | 390 px: `#sidebarToggleTop` opens the menu with the live items | Search · Events · FAQs · Support · My account · Pages · Customers | VERIFIED_PASS |
| HERO-001 | Next arrow advances | dot 0 → 1 | VERIFIED_PASS |
| HERO-002 | Rapid "previous" ×2 loops from first to last | active dot 10 (failed once before the target-tracking fix; fixed and re-run twice) | VERIFIED_PASS |
| A11Y-001 | `prefers-reduced-motion: reduce` → autoplay off | `aria-pressed="true"` | VERIFIED_PASS |
| FAQ-001 | 5 topics, counts and order preserved, linking to live category routes | Titles, counts, hrefs | VERIFIED_PASS |
| SRCH-001 | No-match search shows the empty state | "Results for 'zzzz'" + empty state | VERIFIED_PASS |
| SRCH-002 | Venue search ("loftus") → 2 results | 2 | VERIFIED_PASS |
| EVT-001 | Mobile booking bar visible; its Buy tickets scrolls to `#tickets`, then the bar hides | class check | VERIFIED_PASS |
| EVT-002 | Preview stepper: 2 × General Admission → total R 120.00 | Text check | VERIFIED_PASS |
| EVT-003 | Desktop booking card shows Buy tickets → `#tickets` | href | VERIFIED_PASS |
| LINK-001 | Every internal link on the 4 screens returns 200 | 30 links | VERIFIED_PASS |

## 4. Accessibility (REQ-009, 029)

| Check | Method | Result |
|---|---|---|
| axe-core 4.10.2 (WCAG 2 A/AA, 2.1 AA, best practice) on Home 1440/390, FAQ 1440, Event 1440/390, Search 1440 (results) and 390 (empty) | Injected into Playwright pages | **0 violations** after fixes (initial run flagged a colour-only footer link, missing `h1` on Home, chat launcher outside a landmark, and search heading order/landmark name; all fixed) |
| Duplicate ids | DOM scan, same pages | None |
| Colour contrast of tokens | Computed WCAG ratios (see 02 §4) | Text ≥ 4.5:1; large date numerals ≥ 3:1 |
| Keyboard: skip link, focus rings, carousel arrows/dots/pause, dropdowns, off-canvas | Implemented; dropdown/off-canvas/arrow behaviour covered by tests above | Partially automated |
| Screen-reader walkthrough (VoiceOver/NVDA) | — | NOT_TESTED |

## 5. Assets and content (REQ-005, 007, 010, 026, 027, 028)

| Check | Result |
|---|---|
| Logo, 26 banners, FAQ hero from the client capture; nothing replaced or invented | VERIFIED_PASS (file inventory) |
| CMYK banners converted to sRGB (colour check on FNB banner); sizes ≈ 700 KB → ≈ 70 KB | VERIFIED_PASS |
| Asset folders: `images/brand|events|pages`, `icons`, `fonts`, `vendor` | VERIFIED_PASS |
| All colours in `ot-tokens.css`; Bootstrap vars mapped | VERIFIED_PASS (code review) |
| No user-facing copy inside `assets/js` | VERIFIED_PASS (code review) |
| Sample content (event description, ticket rows) visibly badged | VERIFIED_PASS |
| Front-end weight (own code): CSS + JS ≈ 73 KB unminified; fonts 268 KB (only used subsets/weights load) | Measured |

## 6. Not tested / blocked

| Item | Status | Note |
|---|---|---|
| Safari, Firefox, real iOS/Android devices | NOT_TESTED | Only Chromium was available; CSS uses widely supported features, with fallbacks for `cqw`/`backdrop-filter` |
| Live site comparison | BLOCKED_EXTERNAL | Live domain unreachable from the build environment; compared against the supplied captures and the user's screenshot |
| Event detail / search results vs live pages | BLOCKED_EXTERNAL | No captures supplied (A-02) |
| Integration inside the Laravel/Livewire theme | NOT_APPLICABLE (this delivery) | Needs theme source; guide in README |
| Lighthouse / Core Web Vitals | NOT_TESTED | No numbers claimed |

## 7. Release readiness
Static preview: **ready** (no build step, no environment variables). Open P0/P1 defects: **none known**.
Client inputs needed: live event-page and search-page captures, route names, Isotope licence confirmation.
