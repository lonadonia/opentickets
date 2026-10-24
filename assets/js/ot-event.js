/*
 * Open Tickets — event detail page.
 *
 * 1. Mobile booking bar: visible below 992px, slides away while the Tickets section is on screen.
 * 2. Ticket quantity steppers — PREVIEW ONLY. In the live theme the existing booking component owns
 *    quantities, totals and checkout; keep the .ot-qty markup/classes on it for the refreshed look.
 */
(() => {
  'use strict';

  /* 1. Mobile booking bar */
  const bar = document.querySelector('[data-ot-mobile-cta]');
  const tickets = document.getElementById('tickets');
  if (bar && tickets && 'IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      const hide = entries[0].isIntersecting;
      bar.classList.toggle('is-hidden', hide);
      bar.inert = hide;
    }, { rootMargin: '0px 0px -20% 0px' }).observe(tickets);
  }

  /* 2. Quantity steppers (preview) */
  const total = document.querySelector('[data-ot-total]');
  const rows = Array.from(document.querySelectorAll('[data-ot-ticket]'));
  const MAX = 10;

  const render = () => {
    let sum = 0;
    rows.forEach((row) => {
      const qty = Number(row.dataset.qty || 0);
      sum += qty * Number(row.dataset.price || 0);
    });
    if (total) {
      const prefix = (total.textContent.match(/^[^\d]*/) || [''])[0];
      total.textContent = `${prefix}${sum.toFixed(2)}`;
    }
  };

  rows.forEach((row) => {
    const value = row.querySelector('[data-ot-qty-value]');
    const minus = row.querySelector('[data-ot-qty="-1"]');
    const plus = row.querySelector('[data-ot-qty="1"]');
    row.dataset.qty = '0';

    row.addEventListener('click', (event) => {
      const btn = event.target.closest('[data-ot-qty]');
      if (!btn) return;
      const qty = Math.min(MAX, Math.max(0, Number(row.dataset.qty) + Number(btn.dataset.otQty)));
      row.dataset.qty = String(qty);
      value.textContent = String(qty);
      minus.disabled = qty === 0;
      plus.disabled = qty === MAX;
      render();
    });
  });
})();
