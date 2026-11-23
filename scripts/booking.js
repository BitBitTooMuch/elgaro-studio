/* Booking demo: service, day, time, contact details, confirmation.
   Times are generated examples and nothing is sent anywhere. */
(() => {
  'use strict';

  const E = window.ELGARO;
  const OPEN = 10 * 60;   // first slot 10:00
  const CLOSE = 20 * 60;  // last appointment must end by 20:00
  const LEAD = 30;        // minimum notice for same-day bookings
  const DAY_COUNT = 14;
  const SERVICES = [
    { id: 'cut', key: 'svcCut', dur: 45, price: 15 },
    { id: 'beard', key: 'svcBeard', dur: 30, price: null }, // price not known yet
  ];

  const $ = (id) => document.getElementById(id);
  const servicesEl = $('services');
  const daysEl = $('days');
  const slotsEl = $('slots');
  const form = $('booking-form');
  const done = $('done');
  const card = $('booking-card');
  const nameIn = $('f-name');
  const phoneIn = $('f-phone');
  const consentIn = $('f-consent');
  const submitBtn = $('submit');
  const submitSwap = $('submit-swap');
  const submitLabel = $('submit-label');
  const summaryWhen = $('summary-when');
  const summaryPrice = $('summary-price');

  const errs = { time: $('err-time'), name: $('err-name'), phone: $('err-phone'), consent: $('err-consent') };
  const inputs = { name: nameIn, phone: phoneIn, consent: consentIn };

  const state = { service: 'cut', day: null, time: null, token: 0, busy: false };
  const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const pad = (n) => String(n).padStart(2, '0');
  const dayKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const fmtTime = (min) => `${pad(Math.floor(min / 60))}:${pad(min % 60)}`;
  const cap = (s) => s.charAt(0).toLocaleUpperCase(E.locale()) + s.slice(1);
  const svc = () => SERVICES.find((s) => s.id === state.service);
  const fmtPrice = (n) => (E.lang === 'en' ? `€${n}` : `${n} €`);
  const fmtDur = (n) => E.t('mins', { n });

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

  // Start times step by the service length: haircut 10:00, 10:45, 11:30... beard 10:00, 10:30...
  function slotsFor(date) {
    const { id, dur } = svc();
    const k = dayKey(date);
    const now = new Date();
    const isToday = k === dayKey(now);
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const out = [];
    for (let m = OPEN; m + dur <= CLOSE; m += dur) {
      if (isToday && m < nowMin + LEAD) continue;
      out.push({ min: m, open: hash(`${k}@${id}@${m}`) % 100 >= 34 });
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

  /* ---------- service ---------- */
  function renderServices() {
    servicesEl.replaceChildren(...SERVICES.map((s) => {
      const meta = s.price != null ? `${fmtDur(s.dur)} · ${fmtPrice(s.price)}` : fmtDur(s.dur);
      const { wrap, input } = choice({
        name: 'service',
        value: s.id,
        checked: state.service === s.id,
        extra: 'svc',
        label: `${E.t(s.key)}, ${meta}`,
        html: `<span class="svc-title">${E.t(s.key)}</span><span class="svc-meta num">${meta}</span>`,
      });
      input.addEventListener('change', () => {
        state.service = s.id;
        renderDays();
        selectDay(state.day, true);
      });
      return wrap;
    }));
  }

  /* ---------- days ---------- */
  // Intl gives a bare month number for Lithuanian short months, so LT uses the standard abbreviations.
  const LT_MONTHS = ['saus.', 'vas.', 'kov.', 'bal.', 'geg.', 'birž.', 'liep.', 'rugp.', 'rugs.', 'spal.', 'lapkr.', 'gruod.'];

  function renderDays() {
    const loc = E.locale();
    const wd = new Intl.DateTimeFormat(loc, { weekday: 'short' });
    const enMonth = new Intl.DateTimeFormat(loc, { month: 'short' });
    const month = (d) => (E.lang === 'lt' ? LT_MONTHS[d.getMonth()] : enMonth.format(d));
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
        html: `<span class="day-top">${top}</span><span class="day-num num">${d.getDate()}</span><span class="day-mon">${month(d)}</span>`,
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

  /* ---------- summary + button ---------- */
  function whenText() {
    const d = byKey.get(state.day);
    if (!d || state.time == null) return null;
    const long = new Intl.DateTimeFormat(E.locale(), { weekday: 'long', day: 'numeric', month: 'long' });
    return `${cap(long.format(d))}, ${fmtTime(state.time)}`;
  }

  function updateSummary() {
    const s = svc();
    const w = whenText();
    summaryWhen.textContent = w || E.t('pickTime');
    summaryWhen.classList.toggle('is-empty', !w);
    summaryPrice.textContent = s.price != null ? fmtPrice(s.price) : fmtDur(s.dur);
    submitLabel.textContent = s.price != null ? E.t('submitPrice', { price: fmtPrice(s.price) }) : E.t('submitPlain');
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
        $('time-step').scrollIntoView({ block: 'center', behavior: reduce() ? 'auto' : 'smooth' });
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
    const s = svc();
    $('done-service').textContent = `${E.t(s.key)}, ${fmtDur(s.dur)}`;
    $('done-when').textContent = whenText() || '';
    $('done-name').textContent = nameIn.value.trim();
    $('done-price-row').hidden = s.price == null;
    $('done-price').textContent = s.price != null ? fmtPrice(s.price) : '';
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
    renderServices();
    renderDays();
    if (!slotsEl.hasAttribute('aria-busy')) renderSlots();
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
  renderServices();
  renderDays();
  selectDay(state.day, false);
})();
