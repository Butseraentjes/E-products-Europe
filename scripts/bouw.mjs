#!/usr/bin/env node
// Bouwt de koepelsite: data/ + src/ → public/
//
//   node scripts/bouw.mjs
//
// Ontwerp okt 2026 ("Eén houtgroep", Claude Design-canvas "E-Products Europe herontwerp").
// Per taal vijf pagina's (start · winkels · zakelijk · groep · documenten), plus robots.txt,
// sitemap.xml en een taalkiezer op /. Alles statisch; het formulier praat met de
// Cloudflare Worker uit worker/.

import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { TALEN, TAALNAAM, t, land, houtsoort } from '../src/teksten.mjs';

const HIER = dirname(fileURLToPath(import.meta.url));
const WORTEL = join(HIER, '..');
const UIT = join(WORTEL, 'public');
const SITE = 'https://www.e-productseurope.com';

// Waar het formulier zijn aanvraag naartoe stuurt.
// Op Cloudflare Pages draait de Worker op hetzelfde domein en volstaat '/api/aanvraag'.
// Zolang het domein nog op Render staat (statisch, geen /api), moet dat de volledige
// Worker-URL zijn. De Worker aanvaardt alleen aanvragen van het echte domein (CORS),
// dus een voorbeeldsite op pages.dev kan geen echte aanvragen maken.
const API_BASIS =
  process.env.EPEUROPE_API_BASIS ?? 'https://aanvragen-eproductseurope.peterbutseraen.workers.dev';

const lees = (pad) => JSON.parse(readFileSync(join(WORTEL, pad), 'utf8'));
const groep = lees('data/groep.json');
const producten = lees('data/producten.json');
const beelden = lees('data/beelden.json');
const W = lees('data/winkels.json');
const WINKELS = W.winkels;
const BINNENKORT = W.binnenkort;
const STAND = W._stand.slice(0, 10);
const N = WINKELS.length;

// Shopify levert zelf een modern formaat als je ?width= meegeeft.
const beeld = (sleutel, breedte) => `${beelden._basis}${beelden[sleutel].bestand}?width=${breedte}`;
const beeldAlt = (sleutel, taal) => beelden[sleutel].alt[taal] || beelden[sleutel].alt.en;
const schot = (w, soort) => `/winkels/${w.beeld}-${soort}.webp`;
const MATEN = { desk: [960, 600], muur: [480, 300], gsm: [300, 560] };

const firma = (id) => groep.firmas.find((f) => f.id === id);
const winkel = (naam) => WINKELS.find((w) => w.naam === naam);
const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const stadVan = (f) => f.adres[1].replace(/^\S+\s+/, '');

const LOCALE = { nl: 'nl-BE', fr: 'fr-BE', de: 'de-DE', en: 'en-GB' };
const getal = (n, taal) => new Intl.NumberFormat(LOCALE[taal]).format(n);
const datum = (iso, taal) =>
  new Intl.DateTimeFormat(LOCALE[taal], { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${iso}T12:00:00`));
const F = groep.feiten;

// De pagina's, met per taal hun eigen pad (zodat de URL leesbaar is in elke taal).
const PAGINAS = [
  { id: 'start', pad: { nl: '', fr: '', de: '', en: '' } },
  { id: 'winkels', pad: { nl: 'winkels', fr: 'boutiques', de: 'shops', en: 'shops' } },
  { id: 'zakelijk', pad: { nl: 'zakelijk', fr: 'professionnels', de: 'geschaeftskunden', en: 'business' } },
  { id: 'groep', pad: { nl: 'groep', fr: 'groupe', de: 'gruppe', en: 'group' } },
  { id: 'documenten', pad: { nl: 'documenten', fr: 'documents', de: 'unterlagen', en: 'documents' } },
];

const url = (taal, paginaId) => {
  const p = PAGINAS.find((x) => x.id === paginaId).pad[taal];
  return p ? `/${taal}/${p}/` : `/${taal}/`;
};

// ── kleine bouwstenen ───────────────────────────────────────────────────────

// Het merkteken: jaarringen die net niet in het midden zitten, met een amberkleurig hart.
const logo = (maat = 36, achter = '#1E4A38') =>
  `<svg width="${maat}" height="${maat}" viewBox="0 0 36 36" aria-hidden="true" focusable="false"><circle cx="18" cy="18" r="17" fill="${achter}"/><circle cx="16.5" cy="19" r="11.5" fill="none" stroke="#F0A43A" stroke-width="1.8"/><circle cx="15.5" cy="19.5" r="6.8" fill="none" stroke="#F3F4F0" stroke-width="1.6" opacity=".85"/><circle cx="15" cy="20" r="2.5" fill="#F0A43A"/></svg>`;

const ICOON = {
  pijl: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  extern: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false" style="flex:none;opacity:.6"><path d="M7 17L17 7M9 7h8v8"/></svg>',
  vink: (kleur) => `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${kleur}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 12l5 5L20 7"/></svg>`,
  bus: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2E6B3E" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M2 7h11v9H2zM13 10h5l3 3v3h-8"/><circle cx="6" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/></svg>',
  zoek: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#56625C" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
  menu: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F3F4F0" stroke-width="2.2" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M4 7h16M4 12h16M4 17h10"/></svg>',
  print: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M7 9V3h10v6M7 17H4v-7h16v7h-3M7 14h10v7H7z"/></svg>',
  voorraad: '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2E6B3E" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M3 9l9-5 9 5v10H3z"/><path d="M7 19v-6h10v6M7 16h10"/></svg>',
  bus40: '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2E6B3E" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M2 7h11v9H2zM13 10h5l3 3v3h-8"/><circle cx="6" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/></svg>',
  taal: '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2E6B3E" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M4 5h16v11H8l-4 4z"/><path d="M8 10h8M8 13h5"/></svg>',
};

const balk = (w, groot = false) =>
  `<div class="balk"><span class="stip"></span><span class="stip"></span><span class="stip"></span><span class="${groot ? 'balk__url' : 'balk__dom'}">${esc(w.naam)}</span></div>`;

const img = (src, [b, h], alt, extra = '') =>
  `<img src="${src}" width="${b}" height="${h}" alt="${esc(alt)}" decoding="async"${extra}>`;

function landTekst(w, taal) {
  return w.landen.includes('EU') ? land('EU', taal) : w.landen.join(' · ');
}
const soortTekst = (w, taal) => w.soort.map((s) => t(`soort.${s}`, taal)).join(' · ');
// "BE" naast "NL" las als twee landen; daarom staat de taal er voortaan met naam bij.
function taalTekst(w, taal) {
  const lijst = w.talen.split(' ');
  return lijst.length > 2 ? t('tag.talen', taal, { n: lijst.length }) : t('tag.taal', taal, { x: lijst.join(' · ') });
}

// ── de pagina-omhulling ─────────────────────────────────────────────────────

function pagina({ taal, paginaId, titel, meta, inhoud, extraHoofd = '' }) {
  const hreflang = TALEN.map(
    (l) => `  <link rel="alternate" hreflang="${l}" href="${SITE}${url(l, paginaId)}">`
  ).join('\n');

  const menu = ['winkels', 'zakelijk', 'groep', 'documenten'];
  const navLinks = menu
    .map((p) => `<a href="${url(taal, p)}"${p === paginaId ? ' aria-current="page"' : ''}>${esc(t(`nav.${p === 'groep' ? 'groep' : p}`, taal))}</a>`)
    .join('\n        ');

  const talen = TALEN.map((l) => {
    const huidig = l === taal ? ' aria-current="true"' : '';
    return `<a href="${url(l, paginaId)}" hreflang="${l}" lang="${l}" title="${esc(TAALNAAM[l])}"${huidig}>${l}</a>`;
  }).join('');

  const hoofdwinkels = WINKELS.filter((w) => w.hoofd)
    .map((w) => `<li><a href="${w.url}" rel="noopener">${esc(w.naam)}</a></li>`)
    .join('\n          ');

  const firmas = groep.firmas
    .map((f) => `<li>${esc(f.naam)}<span class="voet__klein">${esc(f.btw_label)} ${esc(f.btw)}</span></li>`)
    .join('\n          ');

  return `<!doctype html>
<html lang="${taal}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(titel)}</title>
  <meta name="description" content="${esc(meta)}">
  <link rel="canonical" href="${SITE}${url(taal, paginaId)}">
${hreflang}
  <link rel="alternate" hreflang="x-default" href="${SITE}${url('en', paginaId)}">
  <meta property="og:title" content="${esc(titel)}">
  <meta property="og:description" content="${esc(meta)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${SITE}${url(taal, paginaId)}">
  <meta property="og:image" content="${beeld('hero', 1200)}">
  <meta property="og:locale" content="${taal}">
  <meta name="theme-color" content="#F3F4F0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preconnect" href="https://cdn.shopify.com">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=IBM+Plex+Mono:wght@400;500;600&display=swap">
  <link rel="stylesheet" href="/stijl.css">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <meta name="msvalidate.01" content="72A0E590C5D434F652C1E4256F2B418C">
  <script>document.documentElement.className += ' js';</script>
${extraHoofd}</head>
<body>
  <header class="kop">
    <div class="kop__in">
      <a class="merk" href="${url(taal, 'start')}">
        ${logo()}
        <span><span class="merk__naam">${esc(t('site.naam', taal))}</span><span class="merk__sub">${esc(t('site.kenmerk', taal))}</span></span>
      </a>
      <nav class="nav" aria-label="${esc(t('nav.hoofd', taal))}">
        ${navLinks}
      </nav>
      <div class="kop__rechts">
        <div class="talen" role="group" aria-label="${esc(t('nav.taal', taal))}">${talen}</div>
        <a class="knop knop--groen knop--klein kop__cta" href="${url(taal, 'zakelijk')}#aanvraag">${esc(t('nav.cta', taal))}</a>
        <details class="gsmmenu">
          <summary aria-label="${esc(t('nav.menu', taal))}">${ICOON.menu}</summary>
          <nav class="gsmmenu__paneel" aria-label="${esc(t('nav.hoofd', taal))}">
            ${navLinks}
            <a class="knop knop--groen" href="${url(taal, 'zakelijk')}#aanvraag">${esc(t('nav.cta', taal))}</a>
            <div class="talen gsmmenu__talen" role="group" aria-label="${esc(t('nav.taal', taal))}">${talen}</div>
          </nav>
        </details>
      </div>
    </div>
  </header>
  <main>
${inhoud}
  </main>
  <footer class="voet">
    <div class="voet__raster">
      <div>
        <div class="voet__merk">${logo(36, '#2E6B3E')}<span>${esc(t('site.naam', taal))}</span></div>
        <p>${esc(t('voet.groep', taal))}</p>
      </div>
      <div>
        <h2>${esc(t('nav.winkels', taal))}</h2>
        <ul>
          ${hoofdwinkels}
          <li><a href="${url(taal, 'winkels')}" style="color:#F0A43A">${esc(t('voet.alle', taal))}</a></li>
        </ul>
      </div>
      <div>
        <h2>${esc(t('voet.firmas', taal))}</h2>
        <ul>
          ${firmas}
        </ul>
      </div>
      <div>
        <h2>${esc(t('voet.contact', taal))}</h2>
        <ul>
          <li><a href="mailto:${groep.koepel.contact}">${esc(groep.koepel.contact)}</a></li>
          <li>${esc(t('voet.afhalen', taal))}</li>
          <li><a href="${url(taal, 'zakelijk')}#aanvraag">${esc(t('nav.cta', taal))}</a></li>
          <li><a href="${url(taal, 'documenten')}">${esc(t('voet.gegevens', taal))}</a></li>
        </ul>
      </div>
    </div>
    <div class="voet__slot">
      <span>© ${new Date().getFullYear()} ${esc(t('site.naam', taal))} · BV · GmbH · SARL</span>
      <span class="mono">e-productseurope.com</span>
    </div>
  </footer>
  <script>
  (function () {
    // De vaste kop is niet overal even hoog; de filterbalk van de winkelpagina hangt eronder.
    var kop = document.querySelector('.kop');
    var zetKop = function () { document.documentElement.style.setProperty('--kop-h', kop.offsetHeight + 'px'); };
    zetKop(); window.addEventListener('resize', zetKop);
    // Blokken komen rustig op. Wie beweging uit heeft staan, ziet ze meteen.
    var op = document.querySelectorAll('.op');
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      op.forEach(function (e) { e.classList.add('zichtbaar'); });
      return;
    }
    var kijker = new IntersectionObserver(function (regels) {
      regels.forEach(function (r) {
        if (r.isIntersecting) { r.target.classList.add('zichtbaar'); kijker.unobserve(r.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    op.forEach(function (e) { kijker.observe(e); });
  })();
  </script>
</body>
</html>
`;
}

// ── gedeelde blokken ────────────────────────────────────────────────────────

function leveringBlok(taal) {
  const L = groep.levering.termijn;
  const bus = groep.levering.eigen_bus.map((c) => `<span>${ICOON.bus}${esc(land(c, taal))}</span>`).join('\n        ');
  return `  <section class="levering">
    <div class="op">
      <p class="opschrift">${esc(t('lev.opschrift', taal))}</p>
      <h2 class="kop-l">${esc(t('lev.kop', taal))}</h2>
      <p class="levering__tekst">${esc(t('levering.tekst', taal))}</p>
      <div class="buslanden">
        ${bus}
      </div>
    </div>
    <div class="tabelkaart op">
      <div class="tabelrol">
        <table>
          <thead><tr>
            <th scope="col">${esc(t('lev.periode', taal))}</th>
            <th scope="col">BE · NL · LU</th>
            <th scope="col">DE · FR</th>
          </tr></thead>
          <tbody>
            <tr><th scope="row">${esc(t('levering.hoogseizoen', taal))}</th><td>${esc(L.hoogseizoen_apr_jul.be_nl_lu[taal])}</td><td>${esc(L.hoogseizoen_apr_jul.de_fr[taal])}</td></tr>
            <tr><th scope="row">${esc(t('levering.buitenseizoen', taal))}</th><td>${esc(L.buitenseizoen_aug_mrt.be_nl_lu[taal])}</td><td>${esc(L.buitenseizoen_aug_mrt.de_fr[taal])}</td></tr>
            <tr><th scope="row">${esc(t('levering.pakket', taal))}</th><td colspan="2">${esc(groep.levering.pakket[taal])}</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>`;
}

function winkelkaart(w, taal, { donker = false } = {}) {
  const f = firma(w.firma);
  const kortFirma = `${f.id.toUpperCase()} · ${land(f.land, taal)}`;
  const lazy = ' loading="lazy"';
  return `<a class="winkelkaart${donker ? ' winkelkaart--donker' : ''}" href="${w.url}" rel="noopener" data-landen="${w.landen.join(' ')}" data-soort="${w.soort.join(' ')}">
          <div class="scherm">
            <div class="browser">${balk(w)}${img(schot(w, 'desk'), MATEN.desk, t('winkels.schot', taal, { naam: w.naam }), lazy)}</div>
            ${img(schot(w, 'gsm'), MATEN.gsm, t('winkels.schot.gsm', taal, { naam: w.naam }), ` class="scherm__gsm"${lazy}`)}
          </div>
          <div class="winkelkaart__body">
            ${donker ? `<span class="winkelkaart__firma">${esc(kortFirma)}</span>` : ''}
            <div class="winkelkaart__rij"><span class="winkelkaart__dom">${esc(w.naam)}</span>${donker ? '' : ICOON.extern}</div>
            <p class="winkelkaart__wat">${esc(w.wat[taal])}</p>
            <div class="tags"><span class="tag tag--mono">${esc(landTekst(w, taal))}</span><span class="tag">${esc(taalTekst(w, taal))}</span>${donker ? '' : `<span class="tag">${esc(soortTekst(w, taal))}</span>`}</div>
          </div>
        </a>`;
}

const ringen = `<svg class="zakband__ringen" viewBox="0 0 520 520" aria-hidden="true" focusable="false"><g fill="none" stroke="#F3F4F0" stroke-width="2"><circle cx="260" cy="260" r="250"/><circle cx="245" cy="270" r="200"/><circle cx="235" cy="278" r="150"/><circle cx="228" cy="284" r="100"/><circle cx="222" cy="290" r="52"/></g></svg>`;

function routekaarten(taal) {
  return groep.firmas
    .map(
      (f) => `<div class="routekaart">
          <span class="routekaart__landen">${f.landen_zakelijk.join(' ')}</span>
          <span><span class="routekaart__naam">${esc(f.naam)}</span><span class="routekaart__btw">${esc(f.btw_label)} ${esc(f.btw)} · ${esc(stadVan(f))}</span></span>
        </div>`
    )
    .join('\n        ');
}

// ── startpagina ─────────────────────────────────────────────────────────────

function startPagina(taal) {
  // De winkelmuur: alle winkels over drie kolommen, elke kolom twee keer na elkaar
  // zodat de beweging naadloos rondloopt.
  const kolommen = [[], [], []];
  WINKELS.forEach((w, i) => kolommen[i % 3].push(w));
  const muur = kolommen
    .map((kol) => {
      const tegels = kol.concat(kol)
        .map((w, i) => `<div class="tegel">${balk(w)}${img(schot(w, 'muur'), MATEN.muur, '', i >= kol.length ? ' loading="lazy"' : '')}</div>`)
        .join('');
      return `<div class="muur__kol"><div class="muur__band">${tegels}</div></div>`;
    })
    .join('\n        ');

  const band = WINKELS.concat(WINKELS)
    .map((w, i) => `<a class="lopend__item" href="${w.url}" rel="noopener"${i >= N ? ' aria-hidden="true" tabindex="-1"' : ''}>${esc(w.naam)}</a>`)
    .join('');

  // Winkelkiezer: per land de winkel waar we naartoe sturen, plus hoeveel gespecialiseerde winkels er nog zijn.
  const com = winkel('e-woodproducts.com');
  const ookVoor = (code, hoofd) => WINKELS.filter((w) => w !== hoofd && w.landen.includes(code));
  const ook = (code, hoofd) => {
    const rest = ookVoor(code, hoofd);
    if (!rest.length) return '';
    return rest.length === 1 ? t('kiezer.meer1', taal, { naam: rest[0].naam }) : t('kiezer.meer', taal, { n: rest.length });
  };
  const de = winkel('picknickbaenke.de');
  const fr = winkel('tablesdepiquenique.fr');
  const landen = [
    { code: 'BE', naam: land('BE', taal), w: com, ook: ook('BE', com) },
    { code: 'NL', naam: land('NL', taal), w: com, ook: ook('NL', com) },
    { code: 'LU', naam: land('LU', taal), w: com, ook: t('kiezer.lu', taal) },
    { code: 'DE', naam: land('DE', taal), w: de, ook: ook('DE', de) },
    { code: 'AT', naam: land('AT', taal), w: de, ook: t('kiezer.at', taal) },
    { code: 'FR', naam: `${land('FR', taal)} · ${land('MC', taal)}`, w: fr, ook: ook('FR', fr) },
    { code: 'EU', naam: t('kiezer.eu', taal), w: com, ook: 'IT · ES · DK · SE · FI · GB' },
  ]
    .map(
      (l) => `<a class="landtegel" href="${l.w.url}" rel="noopener">
          <span class="landtegel__boven"><span class="landtegel__code">${l.code}</span>${ICOON.extern}</span>
          <span class="landtegel__onder">
            <span class="landtegel__naam">${esc(l.naam)}</span>
            <span class="landtegel__winkel">${esc(l.w.naam)}</span>
            ${l.ook ? `<span class="landtegel__ook">${esc(l.ook)}</span>` : ''}
          </span>
        </a>`
    )
    .join('\n        ');

  const chips = (sleutels) => sleutels.map((s) => `<span class="chip-glas">${esc(t(`chip.${s}`, taal))}</span>`).join('');

  const uitgelicht = ['picknicktafel-kopen.be', 'restol-houtolie.be', 'bancsenteck.fr', 'maery.fr']
    .map(winkel)
    .map(
      (w) => `<a class="minikaart" href="${w.url}" rel="noopener">
            ${img(schot(w, 'desk'), MATEN.desk, t('winkels.schot', taal, { naam: w.naam }), ' loading="lazy"')}
            <span class="minikaart__dom">${esc(w.naam)}</span>
            <span class="minikaart__wat">${esc(w.wat[taal])}</span>
          </a>`
    )
    .join('\n          ');

  const punten = ['offerte', 'bestelbon', 'levering', 'aanbesteding']
    .map((p) => `<li>${ICOON.vink('#F0A43A')}<span>${esc(t(`zakelijk.punt.${p}`, taal))}</span></li>`)
    .join('\n          ');

  const inhoud = `  <section class="held">
    <div>
      <p class="live"><span class="puls"></span>${esc(t('home.live', taal, { n: N }))}</p>
      <h1>${esc(t('home.kop1', taal))}<br><span class="markeer">${esc(t('home.kop2', taal, { n: N }))}</span></h1>
      <p class="lood">${esc(t('home.lood', taal))}</p>
      <div class="knoppen">
        <a class="knop knop--inkt" href="${url(taal, 'winkels')}">${esc(t('home.knop.winkel', taal))} ${ICOON.pijl}</a>
        <a class="knop knop--rand" href="${url(taal, 'zakelijk')}">${esc(t('home.knop.zakelijk', taal))}</a>
      </div>
      <dl class="cijfers">
        <div><dt>${N}</dt><dd>${esc(t('cijfer.winkels', taal))}</dd></div>
        <div><dt>${F.actief_sinds}</dt><dd>${esc(t('cijfer.sinds', taal))}</dd></div>
        <div><dt>${getal(F.bestellingen_sinds_2011, taal)}+</dt><dd>${esc(t('cijfer.bestellingen', taal))}</dd></div>
        <div><dt>${getal(F.magazijn_m2, taal)}&nbsp;m²</dt><dd>${esc(t('cijfer.magazijn', taal))}</dd></div>
      </dl>
    </div>
    <div class="muur" role="img" aria-label="${esc(t('home.muur.label', taal))}">
      <div class="muur__rek" aria-hidden="true">
        ${muur}
      </div>
      <p class="muur__label" aria-hidden="true"><span class="puls"></span>${esc(t('home.muur.stand', taal, { datum: datum(STAND, taal) }))}</p>
    </div>
  </section>

  <div class="lopend"><div class="lopend__rij">${band}</div></div>

  <section class="sectie">
    <div class="sectiekop op">
      <div>
        <p class="opschrift">${esc(t('kiezer.opschrift', taal))}</p>
        <h2 class="kop-l">${esc(t('kiezer.kop', taal))}</h2>
        <p class="lood">${esc(t('kiezer.tekst', taal))}</p>
      </div>
      <a class="onderlijnd" href="${url(taal, 'winkels')}">${esc(t('kiezer.alle', taal, { n: N }))}</a>
    </div>
    <div class="landen op">
        ${landen}
    </div>
  </section>

  <section class="werelden">
    <a class="wereld op" href="${com.url}" rel="noopener">
      <img src="${beeld('hero', 1600)}" width="2048" height="2048" alt="${esc(beeldAlt('hero', taal))}" loading="lazy" decoding="async">
      <div class="wereld__in">
        <span class="label">${esc(t('wereld.buiten.label', taal))}</span>
        <h3>${esc(t('wereld.buiten.kop', taal))}</h3>
        <div class="chips">${chips(['picknick', 'bier', 'teak', 'tuinbank', 'olie'])}</div>
      </div>
    </a>
    <a class="wereld op" href="${winkel('maery.fr').url}" rel="noopener">
      <img src="${beeld('binnen', 1200)}" width="2000" height="2000" alt="${esc(beeldAlt('binnen', taal))}" loading="lazy" decoding="async">
      <div class="wereld__in">
        <span class="label label--licht">${esc(t('wereld.binnen.label', taal))}</span>
        <h3>${esc(t('wereld.binnen.kop', taal))}</h3>
        <div class="chips">${chips(['salon', 'kast'])}<span class="chip-glas mono">maery.fr</span></div>
      </div>
    </a>
  </section>

  <section class="sectie">
    <div class="op">
      <p class="opschrift">${esc(t('netwerk.opschrift', taal))}</p>
      <h2 class="kop-l" style="max-width:900px">${esc(t('netwerk.kop', taal))}</h2>
    </div>
    <div class="netwerk op">
      <a class="hoofdkaart" href="${com.url}" rel="noopener">
        <div class="hoofdkaart__boven">
          <div>
            <p class="opschrift" style="color:#F0A43A">${esc(t('netwerk.hoofd', taal))}</p>
            <p class="hoofdkaart__naam">${esc(com.naam)}</p>
            <p class="hoofdkaart__wat">${esc(com.wat[taal])}</p>
          </div>
          <span class="knop knop--amber knop--klein">${esc(t('netwerk.naar', taal))}</span>
        </div>
        <div class="hoofdkaart__scherm">
          <div class="browser">${balk({ naam: 'www.e-woodproducts.com' }, true)}${img(schot(com, 'desk'), MATEN.desk, t('winkels.schot', taal, { naam: com.naam }), ' loading="lazy"')}</div>
          ${img(schot(com, 'gsm'), MATEN.gsm, t('winkels.schot.gsm', taal, { naam: com.naam }), ' class="gsmschot" loading="lazy"')}
        </div>
      </a>
      <div class="minikaarten">
          ${uitgelicht}
      </div>
    </div>
    <div class="midden"><a class="knop knop--inkt" href="${url(taal, 'winkels')}">${esc(t('netwerk.alle', taal, { n: N }))}</a></div>
  </section>

  <section class="zakband">
    <div class="zakband__in op">
      ${ringen}
      <div>
        <p class="opschrift">${esc(t('zakband.opschrift', taal))}</p>
        <h2 class="kop-l">${esc(t('zakband.kop', taal))}</h2>
        <ul class="vinklijst">
          ${punten}
        </ul>
        <div class="knoppen"><a class="knop knop--amber" href="${url(taal, 'zakelijk')}#aanvraag">${esc(t('nav.cta', taal))} ${ICOON.pijl}</a></div>
      </div>
      <div class="routes">
        <p class="routes__titel">${esc(t('zakband.route', taal))}</p>
        ${routekaarten(taal)}
      </div>
    </div>
  </section>

${leveringBlok(taal)}
`;
  return pagina({
    taal,
    paginaId: 'start',
    titel: t('home.titel', taal),
    meta: t('home.meta', taal, { n: N }),
    inhoud,
    extraHoofd: organisatieLd(taal),
  });
}

// Eén organisatie-blok met de drie vennootschappen als afdeling: zo weet Google
// dat deze site over de groep gaat en niet over één webwinkel.
function organisatieLd(taal) {
  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: groep.koepel.naam,
    url: `${SITE}${url(taal, 'start')}`,
    email: groep.koepel.contact,
    foundingDate: String(F.actief_sinds),
    subOrganization: groep.firmas.map((f) => ({
      '@type': 'Organization',
      name: f.naam,
      vatID: f.btw,
      address: {
        '@type': 'PostalAddress',
        streetAddress: f.adres[0],
        addressLocality: f.adres[1],
        addressCountry: f.land,
      },
    })),
  };
  return `  <script type="application/ld+json">${JSON.stringify(jsonld)}</script>\n`;
}

// ── winkels ─────────────────────────────────────────────────────────────────

function winkelsPagina(taal) {
  const hoofd = WINKELS.filter((w) => w.hoofd).map((w) => winkelkaart(w, taal, { donker: true })).join('\n        ');

  const groepen = groep.firmas
    .map((f) => {
      const ws = WINKELS.filter((w) => w.firma === f.id);
      return `<div class="firmagroep" data-firma="${f.id}">
        <div class="firmagroep__kop">
          <span class="landcodes">${f.landen_zakelijk.join(' ')}</span>
          <h2 class="kop-m">${esc(f.naam)}</h2>
          <span class="mono zacht" style="font-size:13px">${esc(f.btw_label)} ${esc(f.btw)}</span>
          <span class="firmagroep__aantal" data-aantal>${esc(t('winkels.aantal', taal, { n: ws.length }))}</span>
        </div>
        <div class="winkelraster">
        ${ws.map((w) => winkelkaart(w, taal)).join('\n        ')}
        </div>
      </div>`;
    })
    .join('\n      ');

  const straks = BINNENKORT.map((b) => {
    const f = firma(b.firma);
    const beeldBlok = b.beeld
      ? `<div class="browser">${balk(b)}${img(`/winkels/${b.beeld}-desk.webp`, MATEN.desk, t('winkels.schot', taal, { naam: b.naam }), ' loading="lazy"')}</div>`
      : `<div class="geenbeeld">[${esc(t('winkels.geenbeeld', taal))}]</div>`;
    return `<div class="winkelkaart winkelkaart--straks">
          <div class="scherm" style="padding-bottom:0">${beeldBlok}</div>
          <div class="winkelkaart__body">
            <div class="winkelkaart__rij"><span class="winkelkaart__dom">${esc(b.naam)}</span><span class="badge${b.beeld ? '' : ' badge--zacht'}">${esc(t(b.beeld ? 'winkels.inopbouw' : 'winkels.gepland', taal))}</span></div>
            <p class="winkelkaart__wat">${esc(b.wat[taal])}</p>
            <div class="tags"><span class="tag tag--mono">${b.landen.join(' · ')}</span><span class="tag">${esc(f.naam)}</span></div>
          </div>
        </div>`;
  }).join('\n        ');

  const landChips = ['alle', 'BE', 'NL', 'DE', 'FR', 'EU']
    .map((c, i) => `<button class="chip" type="button" data-land="${c}" aria-pressed="${i === 0}">${esc(c === 'alle' ? t('filter.alle_landen', taal) : land(c, taal))}</button>`)
    .join('');
  const soortChips = ['alles', ...W.soorten]
    .map((s, i) => `<button class="chip" type="button" data-soort="${s}" aria-pressed="${i === 0}">${esc(s === 'alles' ? t('filter.alles', taal) : t(`soort.${s}`, taal))}</button>`)
    .join('');

  const inhoud = `  <section class="paginakop">
    <div class="paginakop__tekst">
      <p class="opschrift">${esc(t('nav.winkels', taal))}</p>
      <h1 class="kop-xl">${esc(t('winkels.kop', taal))}</h1>
      <p class="lood">${esc(t('winkels.lood', taal))}</p>
    </div>
    <dl class="tellers">
      <div class="teller"><dt>${N}</dt><dd>${esc(t('winkels.online', taal))}</dd></div>
      <div class="teller"><dt>4</dt><dd>${esc(t('winkels.landen', taal))}</dd></div>
      <div class="teller"><dt>${BINNENKORT.length}</dt><dd>${esc(t('winkels.binnenkort', taal))}</dd></div>
    </dl>
  </section>

  <section class="wrap" style="padding-top:40px">
    <h2 class="kop-m" style="font-size:28px">${esc(t('winkels.hoofd.kop', taal))}</h2>
    <div class="hoofdwinkels">
        ${hoofd}
    </div>
  </section>

  <div class="filterbalk" id="filter" hidden>
    <div class="filterbalk__in">
      <div class="chipgroep" role="group" aria-label="${esc(t('filter.land', taal))}">${landChips}</div>
      <div class="chipgroep" role="group" aria-label="${esc(t('filter.soort', taal))}">${soortChips}</div>
      <span class="teltekst" aria-live="polite" id="teller">${esc(t('filter.teller', taal, { z: N, n: N }))}</span>
    </div>
  </div>

  <section class="wrap" style="padding-bottom:40px">
      ${groepen}
      <div class="leegmelding" id="leeg" hidden>${esc(t('filter.leeg', taal))} <button class="chip" type="button" id="wis" style="margin-left:10px">${esc(t('filter.wis', taal))}</button></div>
  </section>

  <section class="wrap" style="padding-top:16px;padding-bottom:96px">
    <div class="firmagroep" style="margin-top:40px">
      <div class="firmagroep__kop gestippeld">
        <h2 class="kop-m">${esc(t('winkels.binnenkort', taal))}</h2>
        <span class="zacht">${esc(t('winkels.binnenkort.tekst', taal))}</span>
      </div>
      <div class="winkelraster">
        ${straks}
      </div>
    </div>
    <p class="mono zacht" style="font-size:12.5px;margin-top:28px">${esc(t('winkels.stand', taal, { datum: datum(STAND, taal) }))}</p>
  </section>

  <section class="donkerband">
    <div class="donkerband__in">
      <div>
        <h2 class="kop-m">${esc(t('winkels.zakband.kop', taal))}</h2>
        <p>${esc(t('winkels.zakband.tekst', taal))}</p>
      </div>
      <a class="knop knop--amber" href="${url(taal, 'zakelijk')}#aanvraag">${esc(t('nav.cta', taal))} ${ICOON.pijl}</a>
    </div>
  </section>
  <script>
  (function () {
    var TEKST = { teller: ${JSON.stringify(t('filter.teller', taal))}, aantal: ${JSON.stringify(t('winkels.aantal', taal))}, aantal1: ${JSON.stringify(t('winkels.aantal1', taal))} };
    var N = ${N};
    var staat = { land: 'alle', soort: 'alles' };
    var balk = document.getElementById('filter');
    balk.hidden = false;
    var groepen = document.querySelectorAll('.firmagroep[data-firma]');
    function vul(s, o) { for (var k in o) s = s.split('{' + k + '}').join(o[k]); return s; }
    function toepassen() {
      var totaal = 0;
      groepen.forEach(function (g) {
        var n = 0;
        g.querySelectorAll('.winkelkaart').forEach(function (k) {
          var l = k.getAttribute('data-landen').split(' '), s = k.getAttribute('data-soort').split(' ');
          var ok = (staat.land === 'alle' || l.indexOf(staat.land) !== -1) && (staat.soort === 'alles' || s.indexOf(staat.soort) !== -1);
          k.hidden = !ok; if (ok) n++;
        });
        g.hidden = n === 0;
        g.querySelector('[data-aantal]').textContent = n === 1 ? TEKST.aantal1 : vul(TEKST.aantal, { n: n });
        totaal += n;
      });
      document.getElementById('teller').textContent = vul(TEKST.teller, { z: totaal, n: N });
      document.getElementById('leeg').hidden = totaal > 0;
      balk.querySelectorAll('[data-land]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-land') === staat.land)); });
      balk.querySelectorAll('[data-soort]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-soort') === staat.soort)); });
    }
    balk.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      if (b.hasAttribute('data-land')) staat.land = b.getAttribute('data-land');
      if (b.hasAttribute('data-soort')) staat.soort = b.getAttribute('data-soort');
      toepassen();
    });
    document.getElementById('wis').addEventListener('click', function () { staat = { land: 'alle', soort: 'alles' }; toepassen(); });
  })();
  </script>
`;
  return pagina({
    taal,
    paginaId: 'winkels',
    titel: t('winkels.titel', taal),
    meta: t('winkels.meta', taal, { n: N }),
    inhoud,
  });
}

// ── zakelijke balie ─────────────────────────────────────────────────────────

function zakelijkPagina(taal) {
  const landen = Object.keys(groep.routering)
    .map((c) => `<label class="vinkje landkeuze"><input type="radio" name="land" value="${c}" required><span class="landknop" title="${esc(land(c, taal))}"><span class="sr">${esc(land(c, taal))} </span>${c}</span></label>`)
    .join('\n            ');

  const soorten = ['gemeente', 'school', 'vereniging', 'camping', 'horeca', 'bedrijf', 'andere']
    .map((s) => `<option value="${s}">${esc(t(`form.soort.${s}`, taal))}</option>`)
    .join('');
  const wanneer = ['zodra', 'datum', 'voorjaar', 'weetniet']
    .map((s) => `<option value="${s}">${esc(t(`form.wanneer.${s}`, taal))}</option>`)
    .join('');
  const nodig = ['offerte', 'bestelbon', 'fiche', 'bestek']
    .map((s) => `<label class="vinkje"><input type="checkbox" name="nodig" value="${s}"${s === 'offerte' ? ' checked' : ''}><span>${esc(t(`form.nodig.${s}`, taal))}</span></label>`)
    .join('\n            ');
  const punten = ['offerte', 'bestelbon', 'levering', 'aanbesteding']
    .map((p) => `<li>${ICOON.vink('#2E6B3E')}<span>${esc(t(`zakelijk.punt.${p}`, taal))}</span></li>`)
    .join('\n          ');
  const wie = ['gemeenten', 'scholen', 'verenigingen', 'campings', 'horeca', 'bedrijven']
    .map((w) => `<span>${esc(t(`wie.${w}`, taal))}</span>`)
    .join('');
  const stappen = [1, 2, 3, 4]
    .map((n) => `<li class="op"><span class="stappen__nr">0${n}</span><span class="stappen__kop">${esc(t(`stap.${n}.kop`, taal))}</span><span class="stappen__tekst">${esc(t(`stap.${n}.tekst`, taal))}</span></li>`)
    .join('\n        ');

  const mail = `<a href="mailto:${groep.koepel.contact}">${esc(groep.koepel.contact)}</a>`;
  const FIRMAS = Object.fromEntries(
    groep.firmas.map((f) => [f.id, { naam: f.naam, detail: `${f.btw_label} ${f.btw} · ${stadVan(f)}` }])
  );

  const inhoud = `  <section class="zakgrid">
    <div>
      <p class="opschrift">${esc(t('zakelijk.opschrift', taal))}</p>
      <h1 class="kop-xl">${esc(t('zakelijk.kop', taal))}</h1>
      <p class="lood">${esc(t('zakelijk.tekst', taal))}</p>
      <div class="kaartvak">
        <h2>${esc(t('zakelijk.punten.kop', taal))}</h2>
        <ul class="vinklijst">
          ${punten}
        </ul>
        <p class="kaartvak__voet">${esc(t('zakelijk.punt.staffel', taal))}</p>
      </div>
      <div class="fotovak">
        <img src="${beeld('buiten', 1200)}" width="3264" height="3264" alt="${esc(beeldAlt('buiten', taal))}" loading="lazy" decoding="async">
        <div class="fotovak__chips">${wie}</div>
      </div>
    </div>

    <div class="aanvraag" id="aanvraag">
      <div class="aanvraag__kop">
        <h2>${esc(t('form.kop', taal))}</h2>
        <p>${esc(t('form.uitleg', taal))}</p>
      </div>
      <form id="aanvraagFormulier" novalidate>
        <fieldset>
          <legend>${esc(t('form.land', taal))} *</legend>
          <div class="landknoppen">
            ${landen}
            <label class="vinkje landkeuze"><input type="radio" name="land" value="XX" required><span class="landknop" title="${esc(t('form.land.anders', taal))}"><span class="sr">${esc(t('form.land.anders', taal))} </span>…</span></label>
          </div>
        </fieldset>

        <div class="route route--leeg" id="route" aria-live="polite">
          <span class="route__code" id="routeCode">…</span>
          <span>
            <span class="route__klein">${esc(t('route.naar', taal))}</span>
            <span class="route__naam" id="routeNaam">${esc(t('route.leeg', taal))}</span>
            <span class="route__detail" id="routeDetail"></span>
          </span>
        </div>

        <div class="velden">
          <div class="veld"><label for="organisatie">${esc(t('form.organisatie', taal))} *</label><input id="organisatie" name="organisatie" required autocomplete="organization"></div>
          <div class="veld"><label for="soort">${esc(t('form.soort', taal))}</label><select id="soort" name="soort"><option value="">${esc(t('form.soort.kies', taal))}</option>${soorten}</select></div>
          <div class="veld"><label for="naam">${esc(t('form.naam', taal))} *</label><input id="naam" name="naam" required autocomplete="name"></div>
          <div class="veld"><label for="btw">${esc(t('form.btw', taal))}</label><input id="btw" name="btw" autocomplete="off"></div>
          <div class="veld"><label for="email">${esc(t('form.email', taal))} *</label><input id="email" name="email" type="email" required autocomplete="email"></div>
          <div class="veld"><label for="telefoon">${esc(t('form.telefoon', taal))}</label><input id="telefoon" name="telefoon" type="tel" autocomplete="tel"></div>
        </div>

        <div class="veld"><label for="producten">${esc(t('form.producten', taal))} *</label><input id="producten" name="producten" required placeholder="${esc(t('form.producten.vb', taal))}"></div>

        <div class="velden">
          <div class="veld"><label for="aantal">${esc(t('form.aantal', taal))}</label><input id="aantal" name="aantal" inputmode="numeric"></div>
          <div class="veld"><label for="wanneer">${esc(t('form.wanneer', taal))}</label><select id="wanneer" name="wanneer">${wanneer}</select></div>
        </div>

        <fieldset>
          <legend>${esc(t('form.nodig', taal))}</legend>
          <div class="vinkjes">
            ${nodig}
          </div>
        </fieldset>

        <div class="veld"><label for="bericht">${esc(t('form.bericht', taal))}</label><textarea id="bericht" name="bericht"></textarea></div>

        <div class="melding--fout" id="foutMelding" role="alert" hidden></div>
        <button class="knop knop--groen knop--breed" type="submit" id="verstuurKnop">${esc(t('form.verstuur', taal))}</button>
        <p class="aanvraag__onder">${t('form.onder', taal, { email: mail })}</p>
      </form>
      <div class="gelukt" id="geluktBlok" hidden tabindex="-1">
        <h3>${esc(t('form.gelukt.kop', taal))}</h3>
        <p id="geluktTekst"></p>
      </div>
    </div>
  </section>

  <section class="stappenband">
    <div class="wrap">
      <p class="opschrift">${esc(t('stap.opschrift', taal))}</p>
      <h2 class="kop-l">${esc(t('stap.kop', taal))}</h2>
      <ol class="stappen">
        ${stappen}
      </ol>
    </div>
  </section>

${leveringBlok(taal)}
  <script>
  (function () {
    var ROUTERING = ${JSON.stringify(groep.routering)};
    var FIRMAS = ${JSON.stringify(FIRMAS)};
    var TEKST = {
      leeg: ${JSON.stringify(t('route.leeg', taal))},
      anders: ${JSON.stringify(t('route.anders', taal))},
      bezig: ${JSON.stringify(t('form.bezig', taal))},
      verstuur: ${JSON.stringify(t('form.verstuur', taal))},
      gelukt: ${JSON.stringify(t('form.gelukt.tekst', taal))},
      mislukt: ${JSON.stringify(t('form.mislukt', taal))}
    };
    var EMAIL = ${JSON.stringify(groep.koepel.contact)};
    var form = document.getElementById('aanvraagFormulier');
    var foutMelding = document.getElementById('foutMelding');
    var knop = document.getElementById('verstuurKnop');
    var route = document.getElementById('route');

    // Het gekozen land toont meteen welke vennootschap de aanvraag behandelt.
    function toonRoute() {
      var gekozen = form.querySelector('input[name="land"]:checked');
      var code = gekozen ? gekozen.value : '';
      var id = ROUTERING[code];
      route.classList.toggle('route--leeg', !id);
      document.getElementById('routeCode').textContent = id ? code : '…';
      document.getElementById('routeNaam').textContent = id ? FIRMAS[id].naam : (code ? TEKST.anders : TEKST.leeg);
      document.getElementById('routeDetail').textContent = id ? FIRMAS[id].detail : '';
    }
    form.querySelectorAll('input[name="land"]').forEach(function (r) { r.addEventListener('change', toonRoute); });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      foutMelding.hidden = true;
      if (!form.checkValidity()) { form.reportValidity(); return; }

      var fd = new FormData(form);
      var gegevens = {
        taal: ${JSON.stringify(taal)},
        land: fd.get('land'),
        soort: fd.get('soort'),
        organisatie: fd.get('organisatie'),
        btw: fd.get('btw'),
        naam: fd.get('naam'),
        email: fd.get('email'),
        telefoon: fd.get('telefoon'),
        producten: fd.get('producten'),
        aantal: fd.get('aantal'),
        wanneer: fd.get('wanneer'),
        nodig: fd.getAll('nodig'),
        bericht: fd.get('bericht')
      };

      knop.disabled = true;
      knop.textContent = TEKST.bezig;

      fetch('${API_BASIS}/api/aanvraag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gegevens)
      })
        .then(function (r) {
          if (!r.ok) throw new Error('status ' + r.status);
          return r.json();
        })
        .then(function (uitslag) {
          if (!uitslag || !uitslag.ok) throw new Error('geweigerd');
          form.hidden = true;
          var blok = document.getElementById('geluktBlok');
          document.getElementById('geluktTekst').textContent =
            TEKST.gelukt.replace('{firma}', uitslag.firma || FIRMAS.bv.naam);
          blok.hidden = false;
          blok.focus();
          blok.scrollIntoView({ behavior: 'smooth', block: 'center' });
        })
        .catch(function () {
          // Geen valse bevestiging: als het misging, zeggen we dat en geven we het e-mailadres.
          foutMelding.hidden = false;
          foutMelding.innerHTML = TEKST.mislukt.replace(
            '{email}',
            '<a href="mailto:' + EMAIL + '">' + EMAIL + '</a>'
          );
          knop.disabled = false;
          knop.textContent = TEKST.verstuur;
        });
    });
  })();
  </script>
`;
  return pagina({
    taal,
    paginaId: 'zakelijk',
    titel: t('zakelijk.titel', taal),
    meta: t('zakelijk.meta', taal),
    inhoud,
  });
}

// ── de groep ────────────────────────────────────────────────────────────────

function groepPagina(taal) {
  const domeinen = (f) =>
    WINKELS.filter((w) => w.firma === f.id)
      .map((w) => `<a href="${w.url}" rel="noopener">${esc(w.naam)}</a>`)
      .join('');
  const bv = firma('bv');
  const dochters = groep.firmas
    .filter((f) => f.rol !== 'holding')
    .map(
      (f) => `<div class="boom__dochter">
        <div class="firmablok firmablok--licht">
          <div class="firmablok__rij"><span class="firmablok__landen">${f.landen_zakelijk.join(' · ')}</span><span class="firmablok__rol">${esc(t('groep.dochter', taal))}</span></div>
          <h2>${esc(f.naam)}</h2>
          <p class="firmablok__gegevens">${esc(f.btw_label)} ${esc(f.btw)}${f.siret ? ` · SIRET ${esc(f.siret)}` : ''}<br>${esc(f.adres.slice(0, 2).join(', '))}</p>
          <div class="domeinen">${domeinen(f)}</div>
        </div>
      </div>`
    )
    .join('\n      ');

  const cijfers = [
    { getal: String(F.actief_sinds), wat: t('c.sinds', taal), bron: t('c.sinds.bron', taal) },
    { getal: `${getal(F.bestellingen_sinds_2011, taal)}+`, wat: t('c.best', taal), bron: t('c.best.bron', taal) },
    { getal: `${getal(F.magazijn_m2, taal)} m²`, wat: t('c.mag', taal), bron: t('c.mag.bron', taal) },
    { getal: String(N), wat: t('c.winkels', taal), bron: t('c.winkels.bron', taal) },
    { getal: String(F.eigen_bus_landen), wat: t('c.bus', taal), bron: groep.levering.eigen_bus.join(' · ') },
    { getal: t('c.antw.getal', taal), wat: t('c.antw', taal), bron: t('c.antw.bron', taal) },
  ]
    .map((c) => `<div><dt>${esc(c.getal)}</dt><dd class="cijferrooster__wat">${esc(c.wat)}</dd><dd class="cijferrooster__bron">${esc(c.bron)}</dd></div>`)
    .join('\n        ');

  const mag = groep.koepel.magazijn;
  const adressen = [
    { land: 'BE', wat: `${t('adres.zetel', taal)} — ${bv.naam}`, adres: bv.adres.slice(0, 2).join(', ') },
    { land: 'BE', wat: t('adres.magazijn', taal), adres: `${mag.adres.slice(0, 2).join(', ')} · ${t('adres.afspraak', taal)}` },
    ...groep.firmas.filter((f) => f.rol !== 'holding').map((f) => ({ land: f.land, wat: f.naam, adres: f.adres.slice(0, 2).join(', ') })),
  ]
    .map((a) => `<div class="adres"><span class="adres__land">${a.land}</span><span><strong>${esc(a.wat)}</strong><span>${esc(a.adres)}</span></span></div>`)
    .join('\n      ');

  const principes = [
    ['voorraad', ICOON.voorraad],
    ['zelf', ICOON.bus40],
    ['taal', ICOON.taal],
  ]
    .map(([k, ic]) => `<div class="principe op">${ic}<h3>${esc(t(`werken.${k}.kop`, taal))}</h3><p>${esc(t(`werken.${k}.tekst`, taal))}</p></div>`)
    .join('\n      ');

  const inhoud = `  <section class="paginakop">
    <div class="paginakop__tekst">
      <p class="opschrift">${esc(t('nav.groep', taal))}</p>
      <h1 class="kop-xl" style="max-width:1100px">${esc(t('groep.kop', taal))}</h1>
      <p class="lood" style="max-width:760px">${esc(t('groep.lood', taal))}</p>
    </div>
  </section>

  <section class="boom" aria-label="${esc(t('groep.structuur', taal))}">
    <div class="boom__top">
      <div class="firmablok op">
        <div class="firmablok__rij"><span class="firmablok__landen">${bv.landen_zakelijk.join(' · ')}</span><span class="firmablok__rol">${esc(t('groep.holding', taal))}</span></div>
        <h2>${esc(bv.naam)}</h2>
        <p class="firmablok__gegevens">${esc(bv.btw_label)} ${esc(bv.btw)} · ${esc(bv.adres.slice(0, 2).join(', '))}</p>
        <div class="domeinen">${domeinen(bv)}</div>
      </div>
    </div>
    <div class="boom__stam" aria-hidden="true"></div>
    <div class="boom__tak" aria-hidden="true"></div>
    <div class="boom__dochters">
      ${dochters}
    </div>
  </section>

  <section class="cijferband">
    <div class="wrap">
      <p class="opschrift">${esc(t('cijfers.opschrift', taal))}</p>
      <dl class="cijferrooster op">
        ${cijfers}
      </dl>
    </div>
  </section>

  <section class="sectie" style="padding-bottom:24px">
    <h2 class="kop-l">${esc(t('werken.kop', taal))}</h2>
    <div class="principes">
      ${principes}
    </div>
  </section>

  <section class="beeldadres">
    <div class="beeldvak op">
      <img src="${beeld('hout', 1400)}" width="3264" height="3264" alt="${esc(beeldAlt('hout', taal))}" loading="lazy" decoding="async">
      <p>${esc(t('groep.beeldzin', taal))}</p>
    </div>
    <div class="adressen op">
      <h2>${esc(t('adres.kop', taal))}</h2>
      ${adressen}
      <p class="adressen__mail">${esc(t('adres.mail', taal))} <a href="mailto:${groep.koepel.contact}">${esc(groep.koepel.contact)}</a></p>
    </div>
  </section>
`;
  return pagina({
    taal,
    paginaId: 'groep',
    titel: t('groep.titel', taal),
    meta: t('groep.meta', taal),
    inhoud,
    extraHoofd: organisatieLd(taal),
  });
}

// ── documentenkast ──────────────────────────────────────────────────────────

function documentenPagina(taal) {
  const komma = (x) => String(x).replace('.', taal === 'en' ? '.' : ',');
  const rijen = Object.entries(producten.lijnen)
    .flatMap(([lijnId, rs]) => rs.map((r) => ({ ...r, lijnId })))
    .map((r) => {
      const onbekend = `<span class="zacht">${esc(t('doc.onbekend', taal))}</span>`;
      const maat = !r.maat ? onbekend : r.maat.b && r.maat.h ? `${r.maat.l} × ${r.maat.b} × ${r.maat.h} cm` : esc(t('doc.lang', taal, { l: r.maat.l }));
      const gew = r.gewicht_kg ? `${esc(t('doc.ca', taal))} ${komma(r.gewicht_kg)} kg` : onbekend;
      const hout = r.houtsoort ? esc(houtsoort(r.houtsoort, taal)) : onbekend;
      const dikte = r.plankdikte_mm ? `${komma(r.plankdikte_mm / 10)} cm` : '<span class="zacht">—</span>';
      const naam = (r.namen && r.namen[taal]) || r.naam;
      const lijn = t(`doc.lijn.${r.lijnId}`, taal);
      return `<tr data-lijn="${r.lijnId}" data-zoek="${esc(`${r.sku} ${naam} ${lijn}`.toLowerCase())}"><td class="doctabel__code">${esc(r.sku)}</td><td><span class="doctabel__naam">${esc(naam)}</span><span class="doctabel__lijn">${esc(lijn)}</span></td><td class="nowrap">${maat}</td><td class="nowrap">${gew}</td><td>${hout}</td><td class="nowrap">${dikte}</td></tr>`;
    });

  const lijnChips = ['alle', ...Object.keys(producten.lijnen).filter((k) => producten.lijnen[k].length)]
    .map((k, i) => `<button class="chip" type="button" data-lijn="${k}" aria-pressed="${i === 0}">${esc(k === 'alle' ? t('doc.alles', taal) : t(`doc.lijn.${k}`, taal))}</button>`)
    .join('');

  const inhoud = `  <section class="paginakop">
    <div class="paginakop__tekst">
      <p class="opschrift">${esc(t('doc.opschrift', taal))}</p>
      <h1 class="kop-xl">${esc(t('doc.kop', taal))}</h1>
      <p class="lood">${esc(t('doc.tekst', taal))}</p>
    </div>
    <div class="uitleg"><strong>${esc(t('doc.ca.kop', taal))}</strong>${esc(t('doc.voetnoot', taal))}</div>
  </section>

  <div class="docbalk" id="docbalk" hidden>
    <div class="zoekveld">
      ${ICOON.zoek}
      <label class="sr" for="doczoek">${esc(t('doc.zoek', taal))}</label>
      <input id="doczoek" type="search" placeholder="${esc(t('doc.zoek', taal))} (${esc(t('doc.zoek.vb', taal))})" autocomplete="off">
    </div>
    <div class="chipgroep" role="group" aria-label="${esc(t('doc.lijnen', taal))}">${lijnChips}</div>
  </div>

  <section class="doctabel-wrap">
    <div class="doctabel-kaart">
      <div class="doctabel-kaart__kop">
        <span id="docteller" aria-live="polite">${esc(t('doc.aantal', taal, { n: rijen.length }))}</span>
        <button class="chip" type="button" onclick="window.print()" style="display:inline-flex;align-items:center;gap:8px">${ICOON.print}${esc(t('doc.print', taal))}</button>
      </div>
      <div class="tabelrol">
        <table class="doctabel">
          <thead><tr>
            <th scope="col">${esc(t('doc.tabel.code', taal))}</th>
            <th scope="col">${esc(t('doc.tabel.artikel', taal))}</th>
            <th scope="col">${esc(t('doc.tabel.maat', taal))}</th>
            <th scope="col">${esc(t('doc.tabel.gewicht', taal))}</th>
            <th scope="col">${esc(t('doc.tabel.hout', taal))}</th>
            <th scope="col">${esc(t('doc.tabel.dikte', taal))}</th>
          </tr></thead>
          <tbody>
            ${rijen.join('\n            ')}
          </tbody>
        </table>
      </div>
      <div class="docniets" id="docniets" hidden>${esc(t('doc.niets', taal))} <a href="${url(taal, 'zakelijk')}#aanvraag">${esc(t('doc.vraag', taal))}</a>.</div>
    </div>
  </section>

  <section class="doctwee">
    <div class="principe"><h2>${esc(t('doc.hout.kop', taal))}</h2><p>${esc(t('doc.hout.tekst', taal))}</p></div>
    <div class="principe"><h2>${esc(t('doc.firma.kop', taal))}</h2><p>${esc(t('doc.firma.tekst', taal))} <a href="${url(taal, 'groep')}">${esc(t('nav.groep', taal))} →</a></p></div>
  </section>

  <section class="donkerband donkerband--bos">
    <div class="donkerband__in">
      <div>
        <h2 class="kop-m">${esc(t('doc.band.kop', taal))}</h2>
        <p>${esc(t('doc.band.tekst', taal))}</p>
      </div>
      <a class="knop knop--amber" href="${url(taal, 'zakelijk')}#aanvraag">${esc(t('nav.cta', taal))} ${ICOON.pijl}</a>
    </div>
  </section>
  <script>
  (function () {
    var TEKST = ${JSON.stringify(t('doc.aantal', taal))};
    var balk = document.getElementById('docbalk');
    balk.hidden = false;
    var zoek = document.getElementById('doczoek');
    var lijn = 'alle';
    var rijen = document.querySelectorAll('.doctabel tbody tr');
    function toepassen() {
      var q = zoek.value.trim().toLowerCase(), n = 0;
      rijen.forEach(function (r) {
        var ok = (lijn === 'alle' || r.getAttribute('data-lijn') === lijn) && (!q || r.getAttribute('data-zoek').indexOf(q) !== -1);
        r.hidden = !ok; if (ok) n++;
      });
      document.getElementById('docteller').textContent = TEKST.replace('{n}', n);
      document.getElementById('docniets').hidden = n > 0;
      balk.querySelectorAll('[data-lijn]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-lijn') === lijn)); });
    }
    zoek.addEventListener('input', toepassen);
    balk.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-lijn]'); if (!b) return;
      lijn = b.getAttribute('data-lijn'); toepassen();
    });
  })();
  </script>
`;
  return pagina({
    taal,
    paginaId: 'documenten',
    titel: t('doc.titel', taal),
    meta: t('doc.meta', taal),
    inhoud,
  });
}

// ── taalkiezer op / ─────────────────────────────────────────────────────────

function taalkiezer() {
  const rijen = TALEN.map(
    (l) => `      <a class="landtegel" href="${url(l, 'start')}" hreflang="${l}" lang="${l}">
        <span class="landtegel__code">${l.toUpperCase()}</span>
        <span class="landtegel__onder"><span class="landtegel__naam">${esc(TAALNAAM[l])}</span><span class="landtegel__ook">${esc(t('home.kop1', l))} ${esc(t('home.kop2', l, { n: N }))}</span></span>
      </a>`
  ).join('\n');
  const hreflang = TALEN.map(
    (l) => `  <link rel="alternate" hreflang="${l}" href="${SITE}${url(l, 'start')}">`
  ).join('\n');
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>E-Products Europe</title>
  <meta name="description" content="${esc(t('home.meta', 'en', { n: N }))}">
  <link rel="canonical" href="${SITE}/en/">
${hreflang}
  <link rel="alternate" hreflang="x-default" href="${SITE}/en/">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=IBM+Plex+Mono:wght@400;500;600&display=swap">
  <link rel="stylesheet" href="/stijl.css">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <script>
    // Stuur de bezoeker meteen naar zijn taal. Werkt JavaScript niet, dan blijft
    // de keuzelijst hieronder gewoon staan — niemand loopt vast.
    (function () {
      var talen = ${JSON.stringify(TALEN)};
      var voorkeur = (navigator.languages || [navigator.language || 'en']);
      for (var i = 0; i < voorkeur.length; i++) {
        var code = String(voorkeur[i]).slice(0, 2).toLowerCase();
        if (talen.indexOf(code) !== -1) { location.replace('/' + code + '/'); return; }
      }
      location.replace('/en/');
    })();
  </script>
</head>
<body>
  <main class="kiezerpagina">
    <div style="display:flex;align-items:center;gap:14px">${logo(44)}<h1 class="kop-m">E-Products Europe</h1></div>
    <div class="landen">
${rijen}
    </div>
  </main>
</body>
</html>
`;
}

// ── schrijven ───────────────────────────────────────────────────────────────

function schrijf(pad, inhoud) {
  const vol = join(UIT, pad);
  mkdirSync(dirname(vol), { recursive: true });
  writeFileSync(vol, inhoud);
}

// Elke winkel moet zijn drie schermafdrukken hebben, anders bouwen we niet.
const BEELDMAP = join(WORTEL, 'src/winkels');
const aanwezig = new Set(readdirSync(BEELDMAP));
const ontbreekt = [...WINKELS, ...BINNENKORT.filter((b) => b.beeld)]
  .flatMap((w) => (w.firma && WINKELS.includes(w) ? ['desk', 'muur', 'gsm'] : ['desk']).map((s) => `${w.beeld}-${s}.webp`))
  .filter((f) => !aanwezig.has(f));
if (ontbreekt.length) {
  console.error(`✗ Schermafdrukken ontbreken in src/winkels/: ${ontbreekt.join(', ')}`);
  process.exit(1);
}

rmSync(UIT, { recursive: true, force: true });
mkdirSync(UIT, { recursive: true });

const bouwers = {
  start: startPagina,
  winkels: winkelsPagina,
  zakelijk: zakelijkPagina,
  groep: groepPagina,
  documenten: documentenPagina,
};

let aantal = 0;
const urls = [];
for (const taal of TALEN) {
  for (const p of PAGINAS) {
    const u = url(taal, p.id);
    schrijf(join(u.slice(1), 'index.html'), bouwers[p.id](taal));
    urls.push({ u, id: p.id });
    aantal++;
  }
}

schrijf('index.html', taalkiezer());
cpSync(join(WORTEL, 'src/stijl.css'), join(UIT, 'stijl.css'));
cpSync(BEELDMAP, join(UIT, 'winkels'), { recursive: true });

// Het merkteken als icoon: dezelfde jaarringen als in de kop.
schrijf(
  'favicon.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><circle cx="18" cy="18" r="17" fill="#1E4A38"/><circle cx="16.5" cy="19" r="11.5" fill="none" stroke="#F0A43A" stroke-width="1.8"/><circle cx="15.5" cy="19.5" r="6.8" fill="none" stroke="#F3F4F0" stroke-width="1.6" opacity=".85"/><circle cx="15" cy="20" r="2.5" fill="#F0A43A"/></svg>\n`
);

// Eigendomsbewijs voor Google Search Console. NIET verwijderen: zonder dit bestand
// verliezen we de toegang tot de meetgegevens van dit domein.
schrijf('googleb0cdacf373743028.html', 'google-site-verification: googleb0cdacf373743028.html\n');
// Idem voor Bing Webmaster Tools (24 okt 2026): Bing toetst de startpagina /, en die taalkiezer
// draagt de msvalidate-tag niet. Zelfde code als op alle andere sites van Peter.
schrijf('BingSiteAuth.xml', '<?xml version="1.0"?>\n<users>\n\t<user>72A0E590C5D434F652C1E4256F2B418C</user>\n</users>\n');

schrijf('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);

const vandaag = new Date().toISOString().slice(0, 10);
schrijf(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls
  .map(({ u, id }) => {
    const alts = TALEN.map(
      (l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${SITE}${url(l, id)}"/>`
    ).join('\n');
    return `  <url>\n    <loc>${SITE}${u}</loc>\n    <lastmod>${vandaag}</lastmod>\n${alts}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${url('en', id)}"/>\n  </url>`;
  })
  .join('\n')}
</urlset>
`
);

console.log(`✓ public/ — ${aantal} pagina's in ${TALEN.length} talen (${N} winkels), plus taalkiezer, robots.txt en sitemap.xml`);
