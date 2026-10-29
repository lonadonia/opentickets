# 05 · GitHub & Vercel Handoff — Open Tickets Visual Refresh

```
Project:            Open Tickets visual refresh (Home, FAQs, Event detail, Search results)
Implementation:     BUILT. Four screens + 26 per-event preview pages, assets, docs, QA tooling
Stack:              Static HTML + Bootstrap 5.3.8 + custom CSS + vanilla JS + Isotope 3.0.6; Node ≥ 18 for tools only
Package manager:    npm (no runtime or build dependencies; Playwright needed only for `npm run qa`)
Local path:         /home/user/opentickets
Local build:        PASS (`node tools/build.mjs`, exit 0)
QA:                 PASS (`node tools/qa.cjs` → 51/51; axe-core 0 violations on 8 page/width combinations;
                    stage text contrast sweep: 128 samples, minimum 5.2:1)
GitHub status:      PUSHED
GitHub repo URL:    https://github.com/lonadonia/opentickets
Visibility:         PUBLIC (verified via GitHub API). The repository was supplied for this session; switch it to
                    private in GitHub settings if the client work should not be public
Branches:           main (holds the newest version at the owner's request; fast-forwarded, never force-pushed) and
                    claude/optimistic-mendel-e0pjrn (working branch); both carry the same history
Commits:            ea2896e (first build) → af79153 (design refinement pass) → 78ef0c1 (presentation) →
                    e33ea1d ("Golden Ticket" redesign) → this file's update (docs only)

Vercel readiness:   VERIFIED_READY (static output at repo root, no env vars, no vercel.json needed)
Vercel project:     opentickets-visual-refresh (team "hakim's projects"), created by this delivery

Main link ("Golden Ticket" design, from main)
  Deployment:       dpl_EC9sz1n8pV7uLDhURS3gthBUVFeK, target PRODUCTION of this demo project,
                    built from main @ e33ea1d (later commits only touch docs)
  URL:              https://opentickets-visual-refresh.vercel.app
  Verified:         DEPLOYED_VERIFIED: state READY; the "Golden Ticket" ot-tokens.css is served (200) at the
                    production URL via Vercel's authenticated fetch (2026-10-29)
  Rollback:         the previous design (dpl_8v3XcTsppighdYapXYZUYboVrkJ7, main @ 16543d7) and the first build
                    (dpl_72eDwetZgrW23NmPa1yxB6M6fwk7) stay available for Instant Rollback

Other links
  main branch:      https://opentickets-visual-refresh-git-main-hakims-projects-8cc34b62.vercel.app
  working branch:   https://opentickets-visual-refresh-git-ebe08e-hakims-projects-8cc34b62.vercel.app
                    (preview links may ask you to sign in to Vercel)
Environment keys:   none
Production (client):UNCHANGED. Nothing was deployed to opentickets.co.za, DNS or any client system
```

## Note on the first Vercel deployment (history)

The deployment was requested without a target (preview by default), but Vercel recorded it as **`target: production`
for the new `opentickets-visual-refresh` project**, most likely because it was the project's first deployment and the
repository has no `main` branch yet. In practice it only means the deployment holds that project's own `*.vercel.app` alias. No
custom domain is attached and the live site is unaffected. To remove it, delete the Vercel project (Settings → Advanced).

## Commands

```bash
npm run serve   # http://localhost:8080
npm run build   # regenerate HTML from src/
npm run qa      # Playwright QA (install playwright first)
```

## Remaining blockers / client inputs

1. Captures of a live **event detail** page and a **/search?q=** results page, to match those two screens exactly (A-02).
2. Route names for destinations outside the four screens (A-03) and translation keys (A-04).
3. FAQ category pages, if they should be refreshed (follow-up scope) (A-05).
4. Isotope commercial licence confirmation (A-07).
5. Theme source access for Blade/Livewire integration.

## Next user action

Review the preview (or run `npm run serve` locally), send the event/search captures, and decide on repository
visibility. Opening a pull request is the next step when you want this merged into `main`.
