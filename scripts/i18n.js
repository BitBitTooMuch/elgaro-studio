/* Translations (LT default, EN) and the language switch.
   Elements opt in with data-i18n="key" (text) or data-i18n-attr="attr:key; attr:key". */
(() => {
  'use strict';

  const strings = {
    lt: {
      concept: 'Svetainės koncepcija ELGARO Studio',
      langLabel: 'Kalba',
      menuOpen: 'Atidaryti meniu',
      menuClose: 'Uždaryti meniu',
      menuLabel: 'Meniu',
      close: 'Uždaryti',

      heroWord: 'Kirpimas',
      heroPrice: '15 €',
      heroLead: 'Barberio studija prekybos centre „Luizė“, Klaipėdoje.',
      heroCta: 'Rezervuoti laiką',
      heroWhere: 'Šiaurės pr. 15, prie Regitros',

      bookTitle: 'Rezervuokite kirpimą',
      bookSub: 'Pasirinkite dieną ir laiką. Sumokėsite studijoje.',
      stepDay: 'Diena',
      stepTime: 'Laikas',
      stepSides: 'Šonų ilgis',
      stepYou: 'Kontaktai',
      sidesHint: 'Nebūtina. Jei nežinote, barberis patars vietoje.',
      sidesAsk: 'Patars barberis',
      guardNo: 'Nr. {n}',
      today: 'Šiandien',
      tomorrow: 'Rytoj',
      dayFull: 'laisvų laikų nėra',
      slotTaken: 'užimta',
      slotsEmpty: 'Šią dieną laisvų laikų nebeliko. Pasirinkite kitą dieną.',
      nameLabel: 'Vardas',
      phoneLabel: 'Telefonas',
      consent: 'Sutinku, kad vardas ir telefonas būtų naudojami tik šiai rezervacijai.',
      privacyLink: 'Kaip saugome duomenis',
      pickTime: 'Laikas dar nepasirinktas',
      submit: 'Rezervuoti už 15 €',
      sending: 'Siunčiama',
      errTime: 'Pasirinkite laiką.',
      errName: 'Įrašykite vardą.',
      errPhone: 'Įrašykite telefono numerį, pvz. +370 612 34567.',
      errConsent: 'Pažymėkite sutikimą, kad galėtume patvirtinti vizitą.',

      doneTitle: 'Iki pasimatymo studijoje',
      doneName: 'Vardas',
      doneWhen: 'Kada',
      doneSides: 'Šonai',
      doneWhere: 'Kur',
      doneWhereVal: 'PC „Luizė“, Šiaurės pr. 15',
      donePrice: 'Kaina',
      doneNote: 'Tai demonstracinė versija, todėl rezervacija niekur neišsiųsta. Tikroje svetainėje barberis iškart gautų pranešimą, o jūs SMS priminimą.',
      doneAgain: 'Rinktis kitą laiką',

      workTitle: 'Darbai',
      workSub: 'Studijos kirpimų nuotraukos atsiras čia netrukus.',
      photoSoon: 'Foto netrukus',
      tileClassic: 'Klasika',
      tileFadeAria: 'Fade kirpimas, nuotrauka netrukus',
      tileTaperAria: 'Taper kirpimas, nuotrauka netrukus',
      tileCropAria: 'Crop kirpimas, nuotrauka netrukus',
      tileClassicAria: 'Klasikinis kirpimas, nuotrauka netrukus',

      priceTitle: 'Kaina ir atsiskaitymas',
      priceItem: 'Kirpimas',
      payCash: 'Grynaisiais',
      priceNote: 'Atsiskaitote studijoje.',

      findTitle: 'Rasite šalia Regitros',
      findSub: 'Prekybos centras „Luizė“, Šiaurės pr. 15, Klaipėda.',
      mapCap: 'Schema',
      mapTitle: 'Schema: ELGARO Studio prekybos centre „Luizė“, Šiaurės prospekte, netoli Regitros.',
      addr: 'PC „Luizė“, Šiaurės pr. 15, 92312 Klaipėda',
      copyAddr: 'Kopijuoti adresą',
      copied: 'Adresas nukopijuotas',

      footPay: 'Grynieji, Apple Pay, PayPal',
      footPrivacy: 'Privatumas ir slapukai',
      footFine: 'Svetainės koncepcija, 2026. Rezervacijos šioje versijoje niekur nesiunčiamos.',
      dockItem: 'Kirpimas',
      dockCta: 'Rezervuoti',

      navBook: 'Rezervacija',
      navWork: 'Darbai',
      navPrice: 'Kaina',
      navFind: 'Kaip rasti',

      privTitle: 'Privatumas ir slapukai',
      priv1: 'Rezervuodami nurodote tik vardą ir telefono numerį. Juos naudojame vizitui patvirtinti ir pranešti, jei laikas keičiasi.',
      priv2: 'Duomenis saugome iki vizito ir 30 dienų po jo, tada ištriname. Niekam jų neperduodame ir nenaudojame reklamai.',
      priv3: 'Svetainė nenaudoja reklaminių ar sekimo slapukų. Įsimenama tik pasirinkta kalba, ir tik jūsų naršyklėje.',
      priv4: 'Norite, kad duomenys būtų ištrinti anksčiau? Pasakykite barberiui arba parašykite studijai.',
      priv5: 'Tai koncepcijos juodraštis. Galutinė politika bus parengta kartu su studija ir nurodys įmonės rekvizitus.',
    },

    en: {
      concept: 'Website concept for ELGARO Studio',
      langLabel: 'Language',
      menuOpen: 'Open menu',
      menuClose: 'Close menu',
      menuLabel: 'Menu',
      close: 'Close',

      heroWord: 'Haircut',
      heroPrice: '€15',
      heroLead: 'A barber studio in Luizė shopping centre, Klaipėda.',
      heroCta: 'Book a time',
      heroWhere: 'Šiaurės pr. 15, next to Regitra',

      bookTitle: 'Book your haircut',
      bookSub: 'Pick a day and a time. You pay at the studio.',
      stepDay: 'Day',
      stepTime: 'Time',
      stepSides: 'Length on the sides',
      stepYou: 'Your details',
      sidesHint: 'Optional. If you are not sure, the barber will help you choose.',
      sidesAsk: 'Barber’s advice',
      guardNo: '#{n}',
      today: 'Today',
      tomorrow: 'Tomorrow',
      dayFull: 'fully booked',
      slotTaken: 'taken',
      slotsEmpty: 'No free times left on this day. Pick another day.',
      nameLabel: 'Name',
      phoneLabel: 'Phone',
      consent: 'I agree that my name and phone number are used only for this booking.',
      privacyLink: 'How we handle data',
      pickTime: 'No time picked yet',
      submit: 'Book for €15',
      sending: 'Sending',
      errTime: 'Pick a time.',
      errName: 'Enter your name.',
      errPhone: 'Enter a phone number, for example +370 612 34567.',
      errConsent: 'Tick the box so we can confirm your visit.',

      doneTitle: 'See you at the studio',
      doneName: 'Name',
      doneWhen: 'When',
      doneSides: 'Sides',
      doneWhere: 'Where',
      doneWhereVal: 'Luizė shopping centre, Šiaurės pr. 15',
      donePrice: 'Price',
      doneNote: 'This is a demo, so the booking was not sent anywhere. On the real site the barber would get a notification right away, and you would get an SMS reminder.',
      doneAgain: 'Pick another time',

      workTitle: 'Work',
      workSub: 'Photos of haircuts from the studio will appear here soon.',
      photoSoon: 'Photo soon',
      tileClassic: 'Classic',
      tileFadeAria: 'Fade haircut, photo coming soon',
      tileTaperAria: 'Taper haircut, photo coming soon',
      tileCropAria: 'Crop haircut, photo coming soon',
      tileClassicAria: 'Classic haircut, photo coming soon',

      priceTitle: 'Price and payment',
      priceItem: 'Haircut',
      payCash: 'Cash',
      priceNote: 'You pay at the studio.',

      findTitle: 'Find us next to Regitra',
      findSub: 'Luizė shopping centre, Šiaurės pr. 15, Klaipėda.',
      mapCap: 'Sketch map',
      mapTitle: 'Sketch map: ELGARO Studio in Luizė shopping centre on Šiaurės avenue, near Regitra.',
      addr: 'Luizė shopping centre, Šiaurės pr. 15, 92312 Klaipėda',
      copyAddr: 'Copy address',
      copied: 'Address copied',

      footPay: 'Cash, Apple Pay, PayPal',
      footPrivacy: 'Privacy and cookies',
      footFine: 'Website concept, 2026. Bookings on this version are not sent anywhere.',
      dockItem: 'Haircut',
      dockCta: 'Book',

      navBook: 'Booking',
      navWork: 'Work',
      navPrice: 'Price',
      navFind: 'Find us',

      privTitle: 'Privacy and cookies',
      priv1: 'To book, you give only your name and phone number. We use them to confirm your visit and to tell you if the time changes.',
      priv2: 'We keep this data until your visit and for 30 days after, then delete it. We never share it or use it for advertising.',
      priv3: 'The site uses no advertising or tracking cookies. It remembers only your chosen language, and only in your browser.',
      priv4: 'Want your data deleted sooner? Tell the barber or message the studio.',
      priv5: 'This is a concept draft. The final policy will be written with the studio and will list the company details.',
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
