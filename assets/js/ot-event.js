/*
 * Open Tickets — event detail page.
 *
 * 1. Mobile booking bar: visible below 992px, slides away while the ticket panel is on screen.
 * 2. Ticket quantity steppers — PREVIEW ONLY. In the live theme the existing booking component owns
 *    quantities, totals and checkout; keep the .ot-qty markup/classes on it for the refreshed look.
 * 3. Quick actions: "Add to calendar" builds an .ics file in the browser from the button's data attributes;
 *    "Share" uses the native share sheet, or copies the page link. Neither needs a backend.
 */
(() => {
  'use strict';

  /* 3. Quick actions */
  const toast = document.querySelector('[data-ot-toast]');
  let toastTimer = 0;
  const notify = (text) => {
    if (!toast || !text) return;
    toast.textContent = text;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.hidden = true; }, 2600);
  };

  const icsText = (value) => String(value).replace(/\\/g, '\\\\').replace(/[,;]/g, (c) => `\\${c}`).replace(/\n/g, '\\n');

  document.querySelectorAll('[data-ot-calendar]').forEach((button) => {
    button.addEventListener('click', () => {
      const { uid, title, start, location, filename } = button.dataset;
      const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
      const lines = [
        'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Open Tickets//Event//EN', 'CALSCALE:GREGORIAN',
        'BEGIN:VEVENT',
        `UID:${uid}@opentickets.co.za`,
        `DTSTAMP:${stamp}`,
        `DTSTART:${start}`,
        `SUMMARY:${icsText(title)}`,
        `LOCATION:${icsText(location)}`,
        `URL:${window.location.href.split('#')[0]}`,
        'END:VEVENT', 'END:VCALENDAR',
      ];
      const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename || 'event.ics';
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    });
  });

  document.querySelectorAll('[data-ot-share]').forEach((button) => {
    button.addEventListener('click', async () => {
      const url = window.location.href.split('#')[0];
      if (navigator.share) {
        try {
          await navigator.share({ title: button.dataset.title, url });
          return;
        } catch (err) {
          if (err && err.name === 'AbortError') return;
        }
      }
      try {
        await navigator.clipboard.writeText(url);
        notify(toast && toast.dataset.labelCopied);
      } catch (err) {
        notify(url); // clipboard unavailable (e.g. insecure context): show the link so it can be copied by hand
      }
    });
  });

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
