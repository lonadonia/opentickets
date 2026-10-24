/*
 * Open Tickets — search results, STATIC PREVIEW ADAPTER ONLY.
 *
 * In the live theme /search renders the matching event cards on the server; drop this file and the
 * data-ot-demo-search attribute there. For the static preview it reads ?q= and shows the cards whose
 * data-name or data-venue contains the query (the same fields the home page filter uses).
 */
(() => {
  'use strict';

  const results = document.querySelector('[data-ot-demo-search]');
  if (!results) return;

  const raw = (new URLSearchParams(window.location.search).get('q') || '').trim();
  const query = raw.toLowerCase();
  const items = Array.from(results.querySelectorAll('.grid-item'));

  let shown = 0;
  items.forEach((item) => {
    const match = !query
      || (item.getAttribute('data-name') || '').includes(query)
      || (item.getAttribute('data-venue') || '').includes(query);
    item.hidden = !match;
    if (match) shown += 1;
  });

  document.querySelectorAll('[data-ot-query]').forEach((node) => { node.textContent = raw; });
  ['nav-search-input', 'search-page-input'].forEach((id) => {
    const input = document.getElementById(id);
    if (input && raw) input.value = raw;
  });

  const titleAll = document.querySelector('[data-ot-search-title-all]');
  const titleQuery = document.querySelector('[data-ot-search-title-query]');
  if (titleAll) titleAll.hidden = Boolean(raw);
  if (titleQuery) titleQuery.hidden = !raw;

  const count = document.querySelector('[data-ot-search-count]');
  if (count) {
    const template = !raw
      ? count.dataset.labelAll
      : shown === 1 ? count.dataset.labelOne : count.dataset.labelMany;
    if (template) count.textContent = template.replace('{n}', String(raw ? shown : items.length));
  }

  const empty = document.querySelector('[data-ot-search-empty]');
  if (empty) empty.hidden = !(raw && shown === 0);

  if (raw) document.title = `${raw} — ${document.title}`;
})();
