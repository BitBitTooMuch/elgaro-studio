/* Page UI: language buttons, menu, privacy sheet, sticky booking dock, scroller edge fades. */
(() => {
  'use strict';

  const E = window.ELGARO;
  const $ = (id) => document.getElementById(id);
  const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lock = (on) => document.documentElement.classList.toggle('is-locked', on);
  const later = (fn, ms) => setTimeout(fn, reduce() ? 0 : ms);

  /* ---------- language ---------- */
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-lang]');
    if (b && b.dataset.lang !== E.lang) E.setLang(b.dataset.lang);
  });

  /* ---------- menu: the close button sits exactly where the menu button was, then swaps icon ---------- */
  const menu = $('menu');
  const openBtn = $('menu-open');
  const closeBtn = $('menu-close');

  openBtn.addEventListener('click', () => {
    const r = openBtn.getBoundingClientRect();
    menu.style.setProperty('--btn-top', `${r.top}px`);
    menu.style.setProperty('--btn-left', `${r.left}px`);
    closeBtn.dataset.state = 'a';
    menu.showModal();
    lock(true);
    requestAnimationFrame(() => requestAnimationFrame(() => { closeBtn.dataset.state = 'b'; }));
  });

  function closeMenu(after) {
    closeBtn.dataset.state = 'a';
    menu.classList.add('is-closing');
    later(() => {
      menu.classList.remove('is-closing');
      menu.close();
      lock(false);
      if (after) after();
    }, 200);
  }

  closeBtn.addEventListener('click', () => closeMenu());
  menu.addEventListener('cancel', (e) => { e.preventDefault(); closeMenu(); });
  menu.querySelectorAll('.menu-nav a').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      closeMenu(() => target && target.scrollIntoView({ block: 'start', behavior: reduce() ? 'auto' : 'smooth' }));
    });
  });

  /* ---------- bottom sheets ---------- */
  function closeSheet(d) {
    d.classList.add('is-closing');
    later(() => { d.classList.remove('is-closing'); d.close(); }, 200);
  }

  document.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-open]');
    if (opener) {
      const d = $(opener.dataset.open);
      if (d && !d.open) { d.showModal(); lock(true); }
      return;
    }
    const closer = e.target.closest('[data-close]');
    if (closer) closeSheet(closer.closest('dialog'));
  });

  document.querySelectorAll('dialog.sheet').forEach((d) => {
    d.addEventListener('click', (e) => { if (e.target === d) closeSheet(d); });
    d.addEventListener('cancel', (e) => { e.preventDefault(); closeSheet(d); });
    d.addEventListener('close', () => lock(false));
  });

  /* ---------- sticky dock: visible when neither the hero button nor the booking form is on screen ---------- */
  const dock = $('dock');
  const heroCta = $('hero-cta');
  const booking = $('booking');
  const seen = { hero: true, booking: false };

  function setDock() {
    const on = !seen.hero && !seen.booking;
    dock.classList.toggle('is-on', on);
    dock.inert = !on;
    dock.setAttribute('aria-hidden', String(!on));
  }

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.target === heroCta) seen.hero = en.isIntersecting;
        if (en.target === booking) seen.booking = en.isIntersecting;
      });
      setDock();
    });
    io.observe(heroCta);
    io.observe(booking);
  }

  /* ---------- masked scroller edges follow the scroll position ---------- */
  document.querySelectorAll('.scroller').forEach((s) => {
    const fade = s.classList.contains('work') ? '36px' : '28px';
    const update = () => {
      const max = s.scrollWidth - s.clientWidth;
      s.style.setProperty('--fade-l', s.scrollLeft > 4 ? fade : '0px');
      s.style.setProperty('--fade-r', s.scrollLeft < max - 4 ? fade : '0px');
    };
    s.addEventListener('scroll', update, { passive: true });
    if ('ResizeObserver' in window) new ResizeObserver(update).observe(s);
    update();
  });

  /* ---------- start ---------- */
  E.setLang(E.savedLang() || 'lt');
})();
