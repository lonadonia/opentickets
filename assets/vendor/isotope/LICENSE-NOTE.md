# Isotope 3.0.6 (Metafizzy)

`isotope.pkgd.min.js` is the unmodified packaged build of Isotope v3.0.6 from npm (`isotope-layout`).
The live Open Tickets site already ships the same library inside its Vite bundle (`build/assets/app-*.js`),
so this refresh keeps the existing dependency rather than adding a new one.

Isotope is licensed GPLv3 for open-source use, or under the Isotope Commercial License for commercial use
(see https://isotope.metafizzy.co/license.html). Please confirm the client's existing licence covers the site.

In the Laravel theme you can keep loading Isotope from the existing Vite bundle (it sets `window.Isotope`)
instead of this file — `assets/js/ot-events-grid.js` only needs `window.Isotope` to exist.
