# Client message — Open Tickets visual refresh

Attach the three images in this folder:
`01-open-tickets-refresh-overview.jpg`, `02-open-tickets-four-screens.jpg`, `03-open-tickets-mobile-and-details.jpg`.
Replace `[Your name]` before sending.

---

## Full message

**Subject:** Open Tickets: your refreshed Home, FAQs, Event and Search pages are ready to review

Hi Open Tickets team,

Thank you for the opportunity. The visual refresh of your four screens is ready for you to review:

- **Live preview:** https://opentickets-visual-refresh.vercel.app
- **Source files:** https://github.com/lonadonia/opentickets

Three overview images are attached.

**The approach**
Your regular buyers know exactly where everything is, so every landmark stays in place: the icon sidebar, the search
bar at the top, the banner slider, the events grid and the footer. All of the upgrade goes into the finish:

- Each page opens on a cinematic "stage", softly lit by the colours of the event's own artwork, which then tears
  into the page content like a ticket stub.
- The ticket shape from your logo carries through to the event cards, the FAQ topics and the booking panel.
- Cleaner typography in your existing type family (Be Vietnam Pro), with Barlow Condensed for dates.
- Lighter pages. Your banners are converted from print colours (CMYK) and recompressed, so the largest drop from about
  700 KB to about 70 KB. Fonts and icons are self-hosted.

**What stays exactly the same**
- **The Isotope filter:** same place in the top bar, same `#events-grid` / `.grid-item` / `data-name` / `data-venue`
  hooks, same `fitRows` configuration and same `filter-grid` event. Typing three or more letters filters by event or
  venue, and Enter still opens the search page.
- Navigation destinations, the language menu, footer links and the booking entry points. The ticketing flow itself is
  untouched.
- The top navigation stays fixed and shrinks as you scroll.

**Built for your developers**
- HTML, Bootstrap 5.3, custom CSS and plain JavaScript. No new frameworks were added, and Isotope is kept.
- Colours, corners and motion all live in one file of CSS variables, so retheming is quick.
- Page text lives in Blade-style templates, never in the JavaScript. A README gives step-by-step integration notes for
  your theme.
- One finding from your current code: today's Isotope filter only works because jQuery loads first. The new script
  works with or without jQuery.

**Quality**
- Checked at 1440, 1024, 768, 390 and 360 px wide, with no sideways scrolling or clipped content.
- 49 automated checks pass, covering filter behaviour, navigation, search, booking links and layout.
- An automated accessibility scan found no issues, and text on the dark stages measures above 6.5:1 contrast.

**Two things to confirm**
1. I didn't have access to a live event page or a search-results page, so those two screens follow your event data
   and standard patterns. The event description and ticket prices are clearly marked as sample content. Send me a link
   or screenshot of each and I'll match them exactly.
2. The FAQ answers sit on your category pages, so the five topics keep their current question counts and links.

As agreed, the interactive seating map for "Appel – soos net hy kan" isn't part of this delivery. I'm happy to take it
on in the follow-up project.

I look forward to your feedback, and I'm glad to help your developers integrate the new design into the theme.

Kind regards,
[Your name]

---

## Short version (for a contest entry or chat)

Hi! Here's my refresh of your Home, FAQs, Event and Search pages:
https://opentickets-visual-refresh.vercel.app

Everything your regular buyers know stays where it is: the sidebar, top search, banner slider and event grid. On top
of that comes a premium layer: a cinematic stage lit by each event's own artwork, ticket-stub cards inspired by your
logo, cleaner typography and faster pages. It's built with Bootstrap 5 and plain JavaScript, and the Isotope filter
keeps the same position, hooks, configuration and behaviour. It's tested from 360 to 1440 px with 49/49 automated
checks and an accessibility scan with no issues. The full source and an integration guide are ready to hand over.
If you share a live event page and a search page, I'll match those two screens to them exactly.
