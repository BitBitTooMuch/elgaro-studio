/* Translations (LT default, EN) and the language switch.
   Elements opt in with data-i18n="key" (text) or data-i18n-attr="attr:key; attr:key". */
(() => {
  'use strict';

  const strings = {
    lt: {
      concept: 'Svetainės koncepcija',
      langLabel: 'Kalba',
      menuOpen: 'Atidaryti meniu',
      menuClose: 'Uždaryti meniu',
      menuLabel: 'Meniu',
      close: 'Uždaryti',

      heroWord: 'Kirpimas',
      heroPrice: '15 €',
      heroLead: 'Barberio studija PC „Luizė“, Klaipėdoje.',
      heroCta: 'Rezervuoti laiką',
      heroWhere: 'Šiaurės pr. 15, prie Regitros',

      bookTitle: 'Rezervacija',
      stepService: 'Paslauga',
      stepDay: 'Diena',
      stepTime: 'Laikas',
      stepYou: 'Kontaktai',
      svcCut: 'Kirpimas',
      svcBeard: 'Barzda',
      mins: '{n} min',
      today: 'Šiandien',
      tomorrow: 'Rytoj',
      dayFull: 'užimta',
      slotTaken: 'užimta',
      slotsEmpty: 'Laisvų laikų nėra.',
      nameLabel: 'Vardas',
      phoneLabel: 'Telefonas',
      consent: 'Sutinku su',
      privacyLink: 'privatumo taisyklėmis',
      pickTime: 'Pasirinkite laiką',
      submitPrice: 'Rezervuoti už {price}',
      submitPlain: 'Rezervuoti',
      sending: 'Siunčiama',
      errTime: 'Pasirinkite laiką.',
      errName: 'Įrašykite vardą.',
      errPhone: 'Įrašykite telefono numerį.',
      errConsent: 'Pažymėkite sutikimą.',

      doneTitle: 'Iki pasimatymo',
      doneService: 'Paslauga',
      doneWhen: 'Kada',
      doneName: 'Vardas',
      donePrice: 'Kaina',
      doneNote: 'Demonstracinė versija. Rezervacija neišsiųsta.',
      doneAgain: 'Nauja rezervacija',

      workTitle: 'Darbai',
      tileClassic: 'Klasika',

      priceTitle: 'Kainos',
      payCash: 'Grynaisiais',

      addr: 'PC „Luizė“, Šiaurės pr. 15, Klaipėda',
      footPay: 'Grynieji, Apple Pay, PayPal',
      footPrivacy: 'Privatumas',
      footFine: 'Svetainės koncepcija, 2026.',
      dockItem: 'Kirpimas',
      dockCta: 'Rezervuoti',

      navBook: 'Rezervacija',
      navWork: 'Darbai',
      navPrice: 'Kainos',

      privTitle: 'Privatumas',
      priv1: 'Renkame tik vardą ir telefoną, kad patvirtintume vizitą.',
      priv2: 'Praėjus 30 dienų po vizito duomenis ištriname. Niekam jų neperduodame.',
      priv3: 'Sekimo slapukų nenaudojame. Norite ištrinti duomenis anksčiau? Pasakykite barberiui.',
    },

    en: {
      concept: 'Website concept',
      langLabel: 'Language',
      menuOpen: 'Open menu',
      menuClose: 'Close menu',
      menuLabel: 'Menu',
      close: 'Close',

      heroWord: 'Haircut',
      heroPrice: '€15',
      heroLead: 'Barber studio in Luizė mall, Klaipėda.',
      heroCta: 'Book a time',
      heroWhere: 'Šiaurės pr. 15, next to Regitra',

      bookTitle: 'Booking',
      stepService: 'Service',
      stepDay: 'Day',
      stepTime: 'Time',
      stepYou: 'Your details',
      svcCut: 'Haircut',
      svcBeard: 'Beard',
      mins: '{n} min',
      today: 'Today',
      tomorrow: 'Tomorrow',
      dayFull: 'full',
      slotTaken: 'taken',
      slotsEmpty: 'No free times.',
      nameLabel: 'Name',
      phoneLabel: 'Phone',
      consent: 'I agree to the',
      privacyLink: 'privacy terms',
      pickTime: 'Pick a time',
      submitPrice: 'Book for {price}',
      submitPlain: 'Book',
      sending: 'Sending',
      errTime: 'Pick a time.',
      errName: 'Enter your name.',
      errPhone: 'Enter your phone number.',
      errConsent: 'Tick the box to continue.',

      doneTitle: 'See you soon',
      doneService: 'Service',
      doneWhen: 'When',
      doneName: 'Name',
      donePrice: 'Price',
      doneNote: 'Demo version. Nothing was sent.',
      doneAgain: 'New booking',

      workTitle: 'Work',
      tileClassic: 'Classic',

      priceTitle: 'Prices',
      payCash: 'Cash',

      addr: 'Luizė mall, Šiaurės pr. 15, Klaipėda',
      footPay: 'Cash, Apple Pay, PayPal',
      footPrivacy: 'Privacy',
      footFine: 'Website concept, 2026.',
      dockItem: 'Haircut',
      dockCta: 'Book',

      navBook: 'Booking',
      navWork: 'Work',
      navPrice: 'Prices',

      privTitle: 'Privacy',
      priv1: 'We only collect your name and phone number to confirm your visit.',
      priv2: 'We delete them 30 days after your visit and never share them.',
      priv3: 'No tracking cookies. Want your data deleted sooner? Tell the barber.',
    },
  };

  const listeners = [];
  const E = (window.ELGARO = window.ELGARO || {});

  E.lang = 'lt';
  E.locale = () => (E.lang === 'en' ? 'en-GB' : 'lt-LT');

  E.t = (key, vars) => {
    let s = strings[E.lang][key];
    if (s == null) s = strings.lt[key];
    if (s == null) return key;
    if (vars) s = s.replace(/\{(\w+)\}/g, (m, k) => (vars[k] != null ? vars[k] : m));
    return s;
  };

  E.onLang = (fn) => listeners.push(fn);

  E.savedLang = () => {
    try { return localStorage.getItem('elgaro-lang'); } catch (e) { return null; }
  };

  E.setLang = (lang) => {
    if (!strings[lang]) lang = 'lt';
    E.lang = lang;
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      el.textContent = E.t(el.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
      el.dataset.i18nAttr.split(';').forEach((pair) => {
        const [attr, key] = pair.split(':').map((x) => x.trim());
        if (attr && key) el.setAttribute(attr, E.t(key));
      });
    });
    document.querySelectorAll('[data-lang]').forEach((b) => {
      b.setAttribute('aria-pressed', String(b.dataset.lang === lang));
    });

    try { localStorage.setItem('elgaro-lang', lang); } catch (e) { /* storage blocked: fine */ }
    listeners.forEach((fn) => fn(lang));
  };
})();
