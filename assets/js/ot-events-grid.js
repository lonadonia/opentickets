/*
 * Open Tickets — Isotope events grid (home page).
 *
 * A vanilla port of the live Alpine component on #events-grid. Unchanged from the live site:
 *   - container #events-grid, itemSelector '.grid-item', layoutMode 'fitRows'
 *   - the window `filter-grid` CustomEvent (detail = query) as the only filter input
 *   - matching: query < 3 characters shows everything, otherwise data-name OR data-venue contains it
 * The keyup → `filter-grid` dispatch from #nav-search-input lives in ot-core.js (it runs on every page, as live).
 *
 * Compatibility notes:
 *   - Isotope 3 calls a filter function as fn(element) without `this`; the live code reads `this`, which only
 *     works because jQuery is loaded and Isotope then filters through jQuery. This port accepts the element
 *     argument and falls back to `this`, so it behaves the same with or without jQuery.
 *   - If the live Alpine x-data/x-init is kept, it may also initialise Isotope: Isotope returns the existing
 *     instance for an already-initialised element, so double initialisation is harmless.
 *
 * Additions (no change to filtering): result count + empty state, relayout after web fonts load,
 * no layout animation when the visitor prefers reduced motion.
 */
(() => {
  'use strict';

  const grid = document.getElementById('events-grid');
  if (!grid) return;

  const count = document.querySelector('[data-ot-grid-count]');
  const empty = document.querySelector('[data-ot-grid-empty]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const total = grid.querySelectorAll('.grid-item').length;
  const options = { itemSelector: '.grid-item', layoutMode: 'fitRows' };
  if (reduceMotion) options.transitionDuration = 0;

  let iso = null;

  const create = () => {
    iso = window.Isotope.data(grid) || new window.Isotope(grid, options);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => iso.layout());
  };

  const initIsotope = () => {
    if (window.Isotope) {
      create();
    } else {
      // Same retry as the live component
      setTimeout(() => {
        if (window.Isotope) create();
      }, 500);
    }
  };

  const fill = (template, values) =>
    template.replace(/\{(\w+)\}/g, (match, key) => (key in values ? values[key] : match));

  const updateStatus = (query) => {
    const active = query.length >= 3;
    const shown = iso ? iso.filteredItems.length : total;
    if (count) {
      const template = active ? count.dataset.labelFiltered : count.dataset.labelAll;
      if (template) count.textContent = fill(template, { n: total, shown, q: query });
    }
    if (empty) {
      empty.hidden = !(active && shown === 0);
      empty.querySelectorAll('[data-ot-query]').forEach((node) => { node.textContent = query; });
    }
  };

  const filter = (query) => {
    if (!iso) return;
    query = query.toLowerCase();
    iso.arrange({
      filter: function (itemElem) {
        const el = itemElem && itemElem.nodeType === 1 ? itemElem : this;
        const queryLower = query.toLowerCase();
        if (queryLower.length < 3) return true;

        const name = el.getAttribute('data-name') || '';
        const venue = el.getAttribute('data-venue') || '';

        return name.includes(queryLower) || venue.includes(queryLower);
      }
    });
    updateStatus(query);
  };

  initIsotope();
  window.addEventListener('filter-grid', (e) => filter(e.detail));
})();
