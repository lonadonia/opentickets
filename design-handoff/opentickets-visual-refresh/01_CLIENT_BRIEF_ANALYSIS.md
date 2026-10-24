# 01 · Client Brief Analysis — Open Tickets Visual Refresh

## 1. Project snapshot

| | |
|---|---|
| Client / site | Open Tickets — https://opentickets.co.za (South African ticketing: football, festivals, shows, school events) |
| Project type | Visual refresh of an existing Laravel + Livewire site (theme "bookishow", Osahan / SB Admin 2 base, Bootstrap 4, jQuery, Slick, Alpine, Isotope via Vite) |
| Goal | A premium, elegant look that long-time ticket buyers still recognise |
| Deliverables | Four screens as working responsive front-end files (HTML, Bootstrap 5, custom CSS, vanilla JS) plus every asset, organised for direct theme integration |
| Screens | Home · FAQs · Event detail · Search results |

## 2. Verified sources

| Source | What it contains | Used for |
|---|---|---|
| Upload `92b41230…` (zip) | Saved **Home** page: HTML, the theme's CSS/JS (osahan, app/Vite bundle, Slick, jQuery, Livewire), 26 banner images, logo | Isotope markup and config, slider, cards, navigation, footer, content, brand colours and fonts |
| Upload `943c2e81…` (zip) | Saved **FAQ index** page and `hero-faqs.png` | FAQ topics, counts, destinations, hero image |
| Upload `a7fd8881…` (zip) | Saved **Support** page | Support copy reused on FAQ and Event pages; chatbot component |
| Screenshot sent mid-session | Full-page capture of the live Home page | Confirmed layout, order and the 27 events |
| Live site | **Not reachable** from the build environment (DNS/proxy). All facts come from the captures above | — |

No capture of an **event detail** page or a **search results** page was supplied (see A-02).

## 3. What the client actually wants

- **Premium, elegant visuals with no relearning.** Same structure, navigation and hierarchy, with better typography,
  spacing, colour and polish.
- **Event imagery first.** Large hero banners and featured events dominate above the fold.
- **The Isotope filter is sacred.** Same place, same controls, same behaviour, same integration.
- **Integration-ready code.** Bootstrap 5, vanilla JS, retheming through CSS custom properties, copy kept apart from logic,
  clean asset folders.

## 4. Scope boundary

| Must build | Optional / judgement | Excluded |
|---|---|---|
| Home, FAQs, Event detail, Search results; assets; responsive behaviour; Isotope preserved; fixed shrinking nav | Breadcrumbs, empty states, result counts, sticky booking card, carousel pause control (added; none of them changes an existing flow) | Seating map for "Appel – soos net hy kan"; other pages/components (follow-up project); changes to the ticketing flow, backend or live site |

## 5. Requirements matrix

| ID | Requirement (brief) | Pri | Implementation | Acceptance |
|---|---|---|---|---|
| REQ-001 | Home page | MUST | `index.html` (`src/pages/home.html`) | Renders 1440→360 without overflow (QA LAYOUT-home-*) |
| REQ-002 | FAQs page | MUST | `faq.html` | QA LAYOUT-faq-*, FAQ-001 |
| REQ-003 | Event detail page | MUST | `event.html` + `events/*.html` | QA LAYOUT-event-*, EVT-001..003 |
| REQ-004 | Search-results listing | MUST | `search.html` | QA LAYOUT-search-*, SRCH-001..002 |
| REQ-005 | Production-ready HTML, Bootstrap 5 CSS, light JS, all assets | MUST | Bootstrap 5.3.8, 5 small JS files (≈ 20 KB), `assets/` | Files present, no console errors |
| REQ-006 | Structured for direct integration into the theme | MUST | `src/partials` (Blade-shaped), README integration guide | Review |
| REQ-007 | Use current logo, event images, banners | MUST | `assets/images/brand`, `events`, `pages` (originals, colour-converted only) | Visual check |
| REQ-008 | Keep the structure and hierarchy of event cards and event-detail layouts | MUST | Card: image → date (day/month) → title → venue → date-time, whole card one link | Screenshot comparison |
| REQ-009 | Improve typography, spacing, alignment, colour, polish without relearning | MUST | `ot-tokens.css`, `ot-theme.css` | Visual review |
| REQ-010 | Imagery prominent; consistent styling on all four screens | MUST | Shared header/rail/footer/card partials; artwork never cropped | Screenshots |
| REQ-011 | Inspect site and sources; keep content, navigation destinations, interactions | MUST | Captures analysed; all destinations in `src/data/site.json` | LINK-001, NAV-002/003 |
| REQ-012 | Home: large hero banners and featured events dominant above the fold | MUST | Featured carousel, 11 live slides, ≈ 440 px banner at 1440 | Screenshot 01 |
| REQ-013 | Home: Isotope filter in exactly its current location | MUST | `#nav-search-input` stays first in the top bar, right of the logo/rail | QA ISO-003 |
| REQ-014 | Home: keep Isotope controls, filtering behaviour, integration | MUST | `ot-events-grid.js` + `ot-core.js` reproduce the live contract | QA ISO-001..011 |
| REQ-015 | Home: familiar event cards, refined | MUST | `event-card` partial (ticket-stub refinement) | Screenshot 02 |
| REQ-016 | FAQ: refresh content and organisation | MUST | Split hero, topic cards with icons, help band | Screenshot 05 |
| REQ-017 | FAQ: keep questions, answers, navigation, interactions | MUST | Five topics, counts, order and destinations kept. Question/answer texts live on the category pages, which were not supplied (A-05) | FAQ-001 |
| REQ-018 | Event: keep layout, info, imagery, booking entry points; ticketing flow unchanged | MUST | Banner → title/facts → description → tickets; "Buy tickets" entry points; ticket rows are a styled mount point, flow untouched (A-02, A-06) | EVT-001..003 |
| REQ-019 | Search: same event-card styling as Home | MUST | Same `event-card` partial | Screenshot 09 |
| REQ-020 | Search: keep search behaviour and listing controls | MUST | `GET search?q=`, query echoed, count, search field; preview adapter only | ISO-011, SRCH-001/002 |
| REQ-021 | Responsive HTML + Bootstrap 5 + custom CSS + vanilla JS | MUST | No other runtime frameworks | Review |
| REQ-022 | Retain the existing Isotope dependency | MUST | Isotope 3.0.6 (same library as the live bundle) | ISO-001 |
| REQ-023 | No other external frameworks/libraries without approval | MUST | None added. Fonts and icons are static assets. Slick and jQuery are not needed on these screens | Review |
| REQ-024 | Keep Isotope selectors, data attributes, configuration, event bindings | MUST | `#events-grid`, `.grid-item`, `data-name/venue`, `fitRows`, `filter-grid` | ISO-001/002/004 |
| REQ-025 | Top navigation fixed and shrinking on scroll | MUST | `.ot-header.is-condensed` (72 → 58 px) | NAV-001 |
| REQ-026 | Images, icons, fonts in clearly named asset folders | MUST | `assets/images|icons|fonts|vendor` | Review |
| REQ-027 | Colours re-themeable through CSS custom properties | MUST | `ot-tokens.css` | Review |
| REQ-028 | Editable text separate from interaction logic; fits the content system | MUST | Copy only in templates/data; JS reads `data-label-*` templates | Review |
| REQ-029 | Precise, consistent layouts across desktop and mobile breakpoints | MUST | Tested at 1440/1024/768/390/360 | LAYOUT-* |
| REQ-030 | No clipping, overlap or horizontal overflow | MUST | Banners shown whole; FAB overlap fixed | LAYOUT-* (scrollWidth check) |
| REQ-031 | Verify Isotope position, controls and filtering unchanged | MUST | Automated tests | ISO-001..011 |
| REQ-032 | Verify navigation, FAQ interactions, search controls, booking links | MUST | Automated tests | NAV-*, FAQ-001, SRCH-*, EVT-* |
| REQ-033 | Readable, organised code; complete assets | MUST | Commented CSS/JS, README | Review |
| REQ-034 | Do not build the seating map / extra pages | MUST | Not built | Review |

## 6. Current experience audit (from the captures)

**Keep:** an instantly recognisable layout (dark icon rail, top search bar, big banner slider, three-column cards with red
dates); the search-as-you-type filter; event artwork front and centre.

**Gaps:** body text at 13.6 px on light grey; low-contrast headings (#858796); identical "?" icons on every FAQ topic;
cards that crop to one title line; letterboxed artwork on white; chat button overlapping the back-to-top button; the
topbar search icon button does nothing (`type="button"`); no feedback when the filter finds nothing; a 6.5 rem rail
squeezing three columns at tablet widths; CMYK JPEG banners (≈ 700 KB each).

## 7. Contradictions, assumptions and missing inputs

| ID | Assumption / gap | Impact | How to validate |
|---|---|---|---|
| A-01 | Live site unreachable from the build environment, so the captures are the source of truth | Low (captures are complete for Home/FAQ) | Spot-check the live site |
| A-02 | No capture of the **event detail** or **search results** page. Both were designed from the card data and conventional patterns, using *Mamelodi Sundowns vs Durban City* as the representative event | Medium | Send captures of a live event page and a `/search?q=` page so the layout can be matched exactly |
| A-03 | Routes outside the four screens inferred from capture file names (`https://opentickets.co.za/<segment>`); event URL prefix unknown | Low (replaced by `route()` in Blade) | Developer confirms route names |
| A-04 | The capture is in Portuguese; delivery uses the English default strings | Low | Map to the existing translation keys |
| A-05 | FAQ question/answer texts live on the category pages, which were not captured. Topics, counts and links are preserved; no answers were invented | Medium | Supply category pages if they should also be refreshed (follow-up scope) |
| A-06 | Event description and ticket types/prices are **sample content**, clearly badged | Low | Live theme renders the CMS description and the existing booking component |
| A-07 | Isotope is GPLv3 / commercial; the site already uses it | Low | Confirm licence |
| A-08 | Server search matching is unknown; the preview adapter matches name/venue like the Home filter | Low | Server keeps its own logic |

## 8. Dependencies and risks

- Theme access (Blade/Livewire source) is needed to wire partials, translations and the booking component.
- Removing jQuery from the theme would break the **live** Alpine filter (see README, "Isotope: what must stay as-is").
  The delivered `ot-events-grid.js` is safe either way.
- The seating map and any further pages belong to the follow-up commission.

## 9. Recommendation

Proceed with direction **"Stub & Spotlight"** (see 02): keep every structural landmark, refine the type and colour
system, and add one brand-derived motif, the ticket stub from the Open Tickets logo, across cards and the booking card.
