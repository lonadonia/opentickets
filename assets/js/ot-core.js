/*
 * Open Tickets — core behaviour shared by every page.
 * Vanilla JS, no dependencies. Bootstrap's bundle drives dropdowns, the off-canvas menu and collapses.
 * No user-facing copy lives here: all text stays in the HTML templates.
 */
(() => {
  'use strict';

  const header = document.querySelector('[data-ot-header]');
  const toTop = document.querySelector('[data-ot-to-top]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* Fixed header shrinks once the page scrolls; the back-to-top button appears further down. */
  let ticking = false;
  const onScroll = () => {
    const y = window.scrollY;
    if (header) header.classList.toggle('is-condensed', y > 16);
    if (toTop) toTop.classList.toggle('is-visible', y > 480);
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onScroll);
    }
  }, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', (event) => {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
      const main = document.getElementById('main');
      if (main) main.focus({ preventScroll: true });
    });
  }

  /*
   * Topbar search → Isotope filter. Same contract as the live inline script:
   * on keyup, dispatch window `filter-grid` with the raw query when it has >= 3 characters or is empty.
   * Enter keeps the native form submit to the search page.
   */
  const searchInput = document.getElementById('nav-search-input');
  if (searchInput) {
    searchInput.addEventListener('keyup', (event) => {
      const query = event.target.value;
      if (query.length >= 3 || query.length === 0) {
        window.dispatchEvent(new CustomEvent('filter-grid', { detail: query }));
      }
    });
  }

  /*
   * Artwork frames: once the image has loaded, reuse it as the soft blurred fill behind letterboxed artwork.
   * Set from the image's resolved URL, so lazy-loading stays intact and no URL is duplicated in the markup.
   */
  const FRAMES = '.ot-card__cover, .ot-hero__media, .ot-event-banner';
  const reveal = (img) => {
    const frame = img.parentElement;
    if (!frame || !frame.matches(FRAMES)) return;
    frame.style.setProperty('--ot-cover', `url("${img.currentSrc || img.src}")`);
    frame.classList.add('is-loaded');
  };
  document.querySelectorAll(FRAMES.split(',').map((s) => `${s.trim()} > img`).join(',')).forEach((img) => {
    if (img.complete && img.naturalWidth > 0) reveal(img);
  });
  // Delegated (capture) so images added later, e.g. the hero's looping clones, are covered too
  document.addEventListener('load', (event) => {
    if (event.target instanceof HTMLImageElement) reveal(event.target);
  }, true);
})();
