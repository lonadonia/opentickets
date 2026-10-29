/*
 * Open Tickets — featured events hero (home page).
 *
 * Replaces the Slick slider with native scroll-snap, keeping its behaviour: centred slide with the
 * neighbours peeking on both sides, infinite looping, swipe/trackpad scrolling, mouse drag (a drag never
 * opens the slide link), arrows, dots, arrow keys and autoplay with a pause control.
 * Autoplay is off for visitors who prefer reduced motion and pauses on hover, focus, hidden tabs and off-screen.
 *
 * Like the live slider wrapper, the hero collapses while the Isotope filter is active:
 * it listens for the same window `filter-grid` event and collapses when the query has >= 3 characters.
 */
(() => {
  'use strict';

  const hero = document.querySelector('[data-ot-hero]');
  if (!hero) return;

  const track = hero.querySelector('[data-ot-hero-track]');
  const slides = Array.from(track.querySelectorAll('[data-ot-hero-slide]'));
  const dots = Array.from(hero.querySelectorAll('[data-ot-hero-dot]'));
  const prevBtn = hero.querySelector('[data-ot-hero-prev]');
  const nextBtn = hero.querySelector('[data-ot-hero-next]');
  const toggle = hero.querySelector('[data-ot-hero-toggle]');
  const collapse = document.querySelector('[data-ot-hero-collapse]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const INTERVAL = 6000;
  const count = slides.length;
  // The glow layers live on the surrounding stage (the carousel sits inside it, under the headline)
  const stage = hero.closest('.ot-stage') || hero;
  const ambientLayers = Array.from(stage.querySelectorAll('[data-ot-ambient] .ot-ambient__layer'));

  if (!count) return;

  // The active dot's progress bar runs for exactly one autoplay interval
  hero.style.setProperty('--ot-hero-interval', `${INTERVAL}ms`);

  /* Looping: one decorative clone at each end so a neighbour always peeks; landing on a clone jumps to the real slide. */
  const makeClone = (slide) => {
    const clone = slide.cloneNode(true);
    clone.removeAttribute('data-ot-hero-slide');
    clone.setAttribute('data-ot-hero-clone', '');
    clone.setAttribute('aria-hidden', 'true');
    clone.querySelectorAll('a, button').forEach((el) => el.setAttribute('tabindex', '-1'));
    return clone;
  };
  const loop = count > 1;
  if (loop) {
    track.insertBefore(makeClone(slides[count - 1]), slides[0]);
    track.appendChild(makeClone(slides[0]));
  }
  const panels = Array.from(track.children); // [clone of last, ...slides, clone of first]
  const offset = loop ? 1 : 0;
  const realIndex = (pos) => (pos - offset + count) % count;

  let pos = -1;
  let timer = null;
  let userPaused = reduceMotion.matches;
  let hovering = false;
  let focusInside = false;
  let collapsed = false;
  let visible = true;

  /* Stage glow: cross-fade two blurred layers to the colours of the active banner */
  let ambientIndex = -1;
  let ambientTurn = 0;
  const lightAmbient = (i) => {
    if (!ambientLayers.length || i === ambientIndex) return;
    const img = slides[i].querySelector('img');
    if (!img) return;
    ambientIndex = i;
    const next = ambientLayers[ambientTurn % ambientLayers.length];
    const prev = ambientLayers[(ambientTurn + 1) % ambientLayers.length];
    ambientTurn += 1;
    next.style.backgroundImage = `url("${img.currentSrc || img.src}")`;
    next.classList.add('is-on');
    if (prev !== next) prev.classList.remove('is-on');
  };

  const setActive = (p) => {
    if (p === pos) return;
    pos = p;
    const active = realIndex(p);
    lightAmbient(active);
    panels.forEach((panel, n) => panel.classList.toggle('is-active', n === p));
    slides.forEach((slide, n) => {
      const on = n === active;
      slide.setAttribute('aria-hidden', on ? 'false' : 'true');
      slide.querySelectorAll('a, button').forEach((el) => {
        if (el.classList.contains('ot-hero__media')) return; // image link always stays out of the tab order
        if (on) el.removeAttribute('tabindex');
        else el.setAttribute('tabindex', '-1');
      });
    });
    dots.forEach((dot, n) => dot.setAttribute('aria-current', n === active ? 'true' : 'false'));
  };

  const leftFor = (p) => panels[p].offsetLeft - (track.clientWidth - panels[p].offsetWidth) / 2;

  // While a programmatic (animated) scroll runs, `target` holds where it is heading, so quick repeated
  // clicks keep stepping from the intended slide instead of from a mid-animation position.
  let target = null;

  const scrollToPos = (p, smooth = true) => {
    const animate = smooth && !reduceMotion.matches;
    target = animate ? p : null;
    track.scrollTo({ left: leftFor(p), behavior: animate ? 'smooth' : 'auto' });
    setActive(p);
  };

  const goTo = (i, smooth = true) => scrollToPos(((i % count) + count) % count + offset, smooth);
  const step = (dir) => scrollToPos(Math.max(0, Math.min(panels.length - 1, (target ?? pos) + dir)));

  const nearest = () => {
    const center = track.scrollLeft + track.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    panels.forEach((panel, n) => {
      const dist = Math.abs(panel.offsetLeft + panel.offsetWidth / 2 - center);
      if (dist < bestDist) {
        bestDist = dist;
        best = n;
      }
    });
    return best;
  };

  /* After scrolling settles on a clone, jump (without animation) to the matching real slide */
  const settle = () => {
    if (dragging) return;
    target = null;
    const p = nearest();
    setActive(p);
    if (!loop) return;
    if (p === 0 || p === panels.length - 1) {
      const target = p === 0 ? count : 1;
      track.style.scrollSnapType = 'none';
      track.scrollTo({ left: leftFor(target), behavior: 'auto' });
      track.style.scrollSnapType = '';
      setActive(target);
    }
  };

  /* Autoplay */
  const shouldPlay = () => !userPaused && !hovering && !focusInside && !collapsed && visible && !document.hidden;
  const stop = () => {
    clearInterval(timer);
    timer = null;
    hero.classList.remove('is-playing');
  };
  const sync = () => {
    if (shouldPlay()) {
      if (!timer) {
        timer = setInterval(() => step(1), INTERVAL);
        // Restart the progress animation in step with the new interval
        hero.classList.remove('is-playing');
        void hero.offsetWidth;
        hero.classList.add('is-playing');
      }
    } else {
      stop();
    }
  };
  const restart = () => {
    stop();
    sync();
  };

  /* Scroll position → active slide; settle detection */
  let raf = 0;
  let settleTimer = 0;
  track.addEventListener('scroll', () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => { if (target === null) setActive(nearest()); });
    clearTimeout(settleTimer);
    settleTimer = setTimeout(settle, 140);
  }, { passive: true });

  /* Controls */
  if (prevBtn) prevBtn.addEventListener('click', () => { step(-1); restart(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { step(1); restart(); });
  dots.forEach((dot, n) => dot.addEventListener('click', () => { goTo(n); restart(); }));

  if (toggle) {
    toggle.setAttribute('aria-pressed', String(userPaused));
    toggle.addEventListener('click', () => {
      userPaused = !userPaused;
      toggle.setAttribute('aria-pressed', String(userPaused));
      sync();
    });
  }

  hero.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') { step(-1); restart(); }
    if (event.key === 'ArrowRight') { step(1); restart(); }
  });

  hero.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') { hovering = true; sync(); } });
  hero.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') { hovering = false; sync(); } });
  hero.addEventListener('focusin', () => { focusInside = true; sync(); });
  hero.addEventListener('focusout', (e) => {
    if (!hero.contains(e.relatedTarget)) {
      focusInside = false;
      sync();
    }
  });
  document.addEventListener('visibilitychange', sync);
  reduceMotion.addEventListener('change', () => {
    if (reduceMotion.matches) userPaused = true;
    if (toggle) toggle.setAttribute('aria-pressed', String(userPaused));
    sync();
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      sync();
    }, { threshold: 0.25 }).observe(hero);
  }

  /* Mouse drag (touch and trackpads scroll natively). A real drag cancels the click, like the live slider. */
  let dragStartX = 0;
  let dragStartLeft = 0;
  let dragging = false;
  let dragged = false;

  // Any direct user scrolling takes over from an animated scroll
  ['touchstart', 'wheel'].forEach((type) => track.addEventListener(type, () => { target = null; }, { passive: true }));

  track.addEventListener('pointerdown', (e) => {
    target = null;
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    dragging = true;
    dragged = false;
    dragStartX = e.clientX;
    dragStartLeft = track.scrollLeft;
  });

  window.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - dragStartX;
    if (!dragged && Math.abs(dx) > 6) {
      dragged = true;
      track.style.scrollSnapType = 'none';
      track.style.userSelect = 'none';
    }
    if (dragged) track.scrollLeft = dragStartLeft - dx;
  });

  window.addEventListener('pointerup', () => {
    if (!dragging) return;
    dragging = false;
    if (dragged) {
      track.style.scrollSnapType = '';
      track.style.userSelect = '';
      scrollToPos(nearest());
      restart();
    }
  });

  /* Clicks: ignore after a drag; a click on a peeking neighbour brings it to the centre instead of opening it. */
  track.addEventListener('click', (e) => {
    if (dragged) {
      e.preventDefault();
      e.stopPropagation();
      dragged = false;
      return;
    }
    const panel = e.target.closest('.ot-hero__slide');
    const p = panels.indexOf(panel);
    if (p > -1 && p !== pos) {
      e.preventDefault();
      scrollToPos(p);
      restart();
    }
  }, true);

  track.addEventListener('dragstart', (e) => e.preventDefault());

  /* Collapse while the Isotope filter is active (same rule as the live x-on:filter-grid.window) */
  window.addEventListener('filter-grid', (e) => {
    collapsed = String(e.detail).length >= 3;
    if (collapse) {
      collapse.classList.toggle('is-collapsed', collapsed);
      collapse.setAttribute('aria-hidden', String(collapsed));
      collapse.inert = collapsed;
    }
    sync();
  });

  /* Keep the active slide centred when the viewport changes size */
  let resizeRaf = 0;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(() => scrollToPos(pos, false));
  });

  goTo(0, false);
  hero.classList.add('is-ready');
  sync();
})();
