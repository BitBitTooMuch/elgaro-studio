/* Booking demo: day, time and clipper-guard choices, validation, confirmation.
   Times are generated examples and nothing is sent anywhere. */
(() => {
  'use strict';

  const E = window.ELGARO;
  const OPEN = 10 * 60;      // first slot 10:00
  const CLOSE = 20 * 60;     // last slot ends 20:00
  const STEP = 30;           // minutes per haircut
  const LEAD = 30;           // minimum notice for same-day bookings
  const DAY_COUNT = 14;
  const GUARDS = [
    { id: 'ask' },
    { id: '0.5', n: 0.5, mm: 1.5 },
    { id: '1', n: 1, mm: 3 },
    { id: '2', n: 2, mm: 6 },
    { id: '3', n: 3, mm: 9 },
    { id: '4', n: 4, mm: 12 },
  ];

  const $ = (id) => document.getElementById(id);
  const daysEl = $('days');
  const slotsEl = $('slots');
  const guardsEl = $('guards');
  const form = $('booking-form');
  const done = $('done');
  const card = $('booking-card');
  const nameIn = $('f-name');
  const phoneIn = $('f-phone');
  const consentIn = $('f-consent');
  const submitBtn = $('submit');
  const submitSwap = $('submit-swap');
  const summaryWhen = $('summary-when');

  const errs = { time: $('err-time'), name: $('err-name'), phone: $('err-phone'), consent: $('err-consent') };
  const inputs = { name: nameIn, phone: phoneIn, consent: consentIn };

  const state = { day: null, time: null, guard: 'ask', token: 0, busy: false };
  const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const pad = (n) => String(n).padStart(2, '0');
  const dayKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const fmtTime = (min) => `${pad(Math.floor(min / 60))}:${pad(min % 60)}`;
  const cap = (s) => s.charAt(0).toLocaleUpperCase(E.locale()) + s.slice(1);

  // Stable pseudo-random "taken" slots, so the demo looks the same on every open.
  const hash = (str) => {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = Array.from({ length: DAY_COUNT }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });
  const byKey = new Map(days.map((d) => [dayKey(d), d]));

  function slotsFor(date) {
    const k = dayKey(date);
    const now = new Date();
    const isToday = k === dayKey(now);
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const out = [];
    for (let m = OPEN; m < CLOSE; m += STEP) {
      if (isToday && m < nowMin + LEAD) continue;
      out.push({ min: m, open: hash(`${k}@${m}`) % 100 >= 34 });
    }
    return out;
  }

  function choice({ name, value, checked, disabled, html, label, extra }) {
    const wrap = document.createElement('label');
    wrap.className = `choice ${extra || ''}`.trim();
    const input = document.createElement('input');
    input.type = 'radio';
    input.className = 'vh';
    input.name = name;
    input.value = value;
    input.id = `${name}-${value}`.replace(/[^\w-]/g, '_');
    input.checked = Boolean(checked);
    input.disabled = Boolean(disabled);
    if (label) input.setAttribute('aria-label', label);
    const body = document.createElement('span');
    body.className = 'choice-body';
    body.innerHTML = html; // built only from this file's own strings and numbers
    wrap.append(input, body);
    return { wrap, input };
  }

  /* ---------- days ---------- */
  // Intl gives a bare month number for Lithuanian short months, so LT uses the standard abbreviations.
  const LT_MONTHS = ['saus.', 'vas.', 'kov.', 'bal.', 'geg.', 'birž.', 'liep.', 'rugp.', 'rugs.', 'spal.', 'lapkr.', 'gruod.'];

  function renderDays() {
    const loc = E.locale();
    const wd = new Intl.DateTimeFormat(loc, { weekday: 'short' });
    const enMonth = new Intl.DateTimeFormat(loc, { month: 'short' });
    const mo = { format: (d) => (E.lang === 'lt' ? LT_MONTHS[d.getMonth()] : enMonth.format(d)) };
    const long = new Intl.DateTimeFormat(loc, { weekday: 'long', day: 'numeric', month: 'long' });

    daysEl.replaceChildren(...days.map((d, i) => {
      const k = dayKey(d);
      const free = slotsFor(d).some((s) => s.open);
      const top = i === 0 ? E.t('today') : i === 1 ? E.t('tomorrow') : cap(wd.format(d));
      const { wrap, input } = choice({
        name: 'day',
        value: k,
        checked: state.day === k,
        disabled: !free,
        extra: 'day',
        label: cap(long.format(d)) + (free ? '' : `, ${E.t('dayFull')}`),
        html: `<span class="day-top">${top}</span><span class="day-num num">${d.getDate()}</span><span class="day-mon">${mo.format(d)}</span>`,
      });
      input.addEventListener('change', () => selectDay(k, true));
      return wrap;
    }));
  }

  function selectDay(k, fromUser) {
    state.day = k;
    state.time = null;
    hideErr('time');
    updateSummary();

    if (!fromUser) { renderSlots(); return; }

    const chip = $(`day-${k}`);
    if (chip) chip.closest('.choice').scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: reduce() ? 'auto' : 'smooth' });

    // Short loading state, like a real availability lookup.
    const token = ++state.token;
    slotsEl.setAttribute('aria-busy', 'true');
    slotsEl.replaceChildren(...Array.from({ length: 8 }, () => {
      const s = document.createElement('span');
      s.className = 'slot-skel';
      return s;
    }));
    setTimeout(() => { if (token === state.token) renderSlots(); }, 280);
  }

  /* ---------- times ---------- */
  function renderSlots() {
    slotsEl.removeAttribute('aria-busy');
    const d = byKey.get(state.day);
    const list = d ? slotsFor(d) : [];

    if (!list.some((s) => s.open)) {
      const p = document.createElement('p');
      p.className = 'slots-empty';
      p.textContent = E.t('slotsEmpty');
      slotsEl.replaceChildren(p);
      return;
    }

    slotsEl.replaceChildren(...list.map((s) => {
      const { wrap, input } = choice({
        name: 'time',
        value: String(s.min),
        checked: state.time === s.min,
        disabled: !s.open,
        extra: 'slot',
        label: fmtTime(s.min) + (s.open ? '' : `, ${E.t('slotTaken')}`),
        html: `<span class="num">${fmtTime(s.min)}</span>`,
      });
      input.addEventListener('change', () => {
        state.time = s.min;
        hideErr('time');
        updateSummary();
      });
      return wrap;
    }));
  }

  /* ---------- clipper guard ---------- */
  function guardText(g) {
    if (!g || g.id === 'ask') return E.t('sidesAsk');
    const nf = new Intl.NumberFormat(E.locale());
    return `${nf.format(g.mm)} mm (${E.t('guardNo', { n: nf.format(g.n) })})`;
  }

  function renderGuards() {
    const nf = new Intl.NumberFormat(E.locale());
    guardsEl.replaceChildren(...GUARDS.map((g) => {
      const html = g.id === 'ask'
        ? `<span class="guard-ask">${E.t('sidesAsk')}</span>`
        : `<span class="guard-mm num">${nf.format(g.mm)}<small>mm</small></span><span class="guard-no num">${E.t('guardNo', { n: nf.format(g.n) })}</span>`;
      const { wrap, input } = choice({
        name: 'guard',
        value: g.id,
        checked: state.guard === g.id,
        extra: g.id === 'ask' ? 'guard guard-wide' : 'guard',
        label: guardText(g),
        html,
      });
      input.addEventListener('change', () => { state.guard = g.id; });
      return wrap;
    }));
  }

  /* ---------- summary ---------- */
  function whenText() {
    const d = byKey.get(state.day);
    if (!d || state.time == null) return null;
    const long = new Intl.DateTimeFormat(E.locale(), { weekday: 'long', day: 'numeric', month: 'long' });
    return `${cap(long.format(d))}, ${fmtTime(state.time)}`;
  }

  function updateSummary() {
    const w = whenText();
    summaryWhen.textContent = w || E.t('pickTime');
    summaryWhen.classList.toggle('is-empty', !w);
  }

  /* ---------- errors ---------- */
  function showErr(k, key) {
    errs[k].textContent = E.t(key);
    errs[k].dataset.key = key;
    errs[k].hidden = false;
    if (inputs[k]) inputs[k].setAttribute('aria-invalid', 'true');
  }

  function hideErr(k) {
    errs[k].hidden = true;
    errs[k].textContent = '';
    delete errs[k].dataset.key;
    if (inputs[k]) inputs[k].removeAttribute('aria-invalid');
  }

  nameIn.addEventListener('input', () => hideErr('name'));
  phoneIn.addEventListener('input', () => hideErr('phone'));
  consentIn.addEventListener('change', () => hideErr('consent'));

  function validate() {
    const bad = [];
    if (state.time == null) { showErr('time', 'errTime'); bad.push('time'); }
    if (nameIn.value.trim().length < 2) { showErr('name', 'errName'); bad.push('name'); }
    const digits = phoneIn.value.replace(/\D/g, '');
    if (digits.length < 8 || digits.length > 15) { showErr('phone', 'errPhone'); bad.push('phone'); }
    if (!consentIn.checked) { showErr('consent', 'errConsent'); bad.push('consent'); }
    return bad;
  }

  function shake(el) {
    el.classList.remove('shake');
    void el.offsetWidth;
    el.classList.add('shake');
    el.addEventListener('animationend', () => el.classList.remove('shake'), { once: true });
  }

  /* ---------- submit ---------- */
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (state.busy) return;

    const bad = validate();
    if (bad.length) {
      if (bad[0] === 'time') {
        const step = $('time-step');
        step.scrollIntoView({ block: 'center', behavior: reduce() ? 'auto' : 'smooth' });
        shake(slotsEl);
        const first = slotsEl.querySelector('input:not(:disabled)');
        if (first) first.focus({ preventScroll: true });
      } else {
        inputs[bad[0]].focus();
        shake(inputs[bad[0]].closest('.field'));
      }
      return;
    }

    state.busy = true;
    submitBtn.setAttribute('aria-busy', 'true');
    submitSwap.dataset.state = 'b';
    $('submit-status').textContent = E.t('sending');
    setTimeout(showDone, 1100);
  });

  function fillDone() {
    $('done-name').textContent = nameIn.value.trim();
    $('done-when').textContent = whenText() || '';
    $('done-sides').textContent = guardText(GUARDS.find((g) => g.id === state.guard));
  }

  function showDone() {
    state.busy = false;
    submitBtn.removeAttribute('aria-busy');
    submitSwap.dataset.state = 'a';
    $('submit-status').textContent = '';
    fillDone();
    form.hidden = true;
    done.hidden = false;
    card.scrollIntoView({ block: 'start', behavior: reduce() ? 'auto' : 'smooth' });
    done.focus({ preventScroll: true });
  }

  $('again').addEventListener('click', () => {
    done.hidden = true;
    form.hidden = false;
    state.time = null;
    renderDays();
    renderSlots();
    updateSummary();
    card.scrollIntoView({ block: 'start', behavior: reduce() ? 'auto' : 'smooth' });
  });

  /* ---------- language ---------- */
  E.onLang(() => {
    renderDays();
    if (!slotsEl.hasAttribute('aria-busy')) renderSlots();
    renderGuards();
    updateSummary();
    Object.keys(errs).forEach((k) => {
      const key = errs[k].dataset.key;
      if (key) errs[k].textContent = E.t(key);
    });
    if (!done.hidden) fillDone();
  });

  /* ---------- start: first day that still has a free time ---------- */
  const firstFree = days.find((d) => slotsFor(d).some((s) => s.open));
  state.day = dayKey(firstFree || days[0]);
  renderDays();
  selectDay(state.day, false);
  renderGuards();
})();
