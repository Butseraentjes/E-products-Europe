#!/usr/bin/env node
// Bouwt de koepelsite: data/ + src/teksten.mjs → public/
//
//   node scripts/bouw.mjs
//
// Per taal drie pagina's (start · winkels · zakelijk · documenten), plus robots.txt,
// sitemap.xml en een taalkiezer op /. Alles statisch; het formulier praat met de
// Cloudflare Worker uit worker/.

import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync } from 'node:fs';
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
// Worker-URL zijn. Overschakelen zodra de nameservers bij Spinternet verhuisd zijn:
//   API_BASIS = ''  →  de site praat dan met zijn eigen domein.
const API_BASIS =
  process.env.EPEUROPE_API_BASIS ?? 'https://aanvragen-eproductseurope.peterbutseraen.workers.dev';

const groep = JSON.parse(readFileSync(join(WORTEL, 'data/groep.json'), 'utf8'));
const producten = JSON.parse(readFileSync(join(WORTEL, 'data/producten.json'), 'utf8'));
const beelden = JSON.parse(readFileSync(join(WORTEL, 'data/beelden.json'), 'utf8'));
const europa = JSON.parse(readFileSync(join(WORTEL, 'data/europa-paden.json'), 'utf8'));

// Shopify levert zelf een modern formaat als je ?width= meegeeft.
const beeld = (sleutel, breedte) => `${beelden._basis}${beelden[sleutel].bestand}?width=${breedte}`;
const beeldAlt = (sleutel, taal) => beelden[sleutel].alt[taal] || beelden[sleutel].alt.en;

const firma = (id) => groep.firmas.find((f) => f.id === id);
const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// De pagina's, met per taal hun eigen pad (zodat de URL leesbaar is in elke taal).
const PAGINAS = [
  { id: 'start', pad: { nl: '', fr: '', de: '', en: '' } },
  { id: 'winkels', pad: { nl: 'winkels', fr: 'boutiques', de: 'shops', en: 'shops' } },
  { id: 'zakelijk', pad: { nl: 'zakelijk', fr: 'professionnels', de: 'geschaeftskunden', en: 'business' } },
  { id: 'documenten', pad: { nl: 'documenten', fr: 'documents', de: 'unterlagen', en: 'documents' } },
];

const url = (taal, paginaId) => {
  const p = PAGINAS.find((x) => x.id === paginaId).pad[taal];
  return p ? `/${taal}/${p}/` : `/${taal}/`;
};

// ── bouwstenen ──────────────────────────────────────────────────────────────

function pagina({ taal, paginaId, titel, meta, inhoud, extraHoofd = '' }) {
  const hreflang = TALEN.map(
    (l) => `  <link rel="alternate" hreflang="${l}" href="${SITE}${url(l, paginaId)}">`
  ).join('\n');

  const nav = ['winkels', 'zakelijk', 'documenten']
    .map((p) => {
      const huidig = p === paginaId ? ' aria-current="page"' : '';
      return `<a href="${url(taal, p)}"${huidig}>${esc(t(`nav.${p}`, taal))}</a>`;
    })
    .join('\n          ');

  const talen = TALEN.map((l) => {
    const huidig = l === taal ? ' aria-current="true"' : '';
    return `<a href="${url(l, paginaId)}" hreflang="${l}" lang="${l}" title="${esc(TAALNAAM[l])}"${huidig}>${l}</a>`;
  }).join('\n          ');

  const voetWinkels = groep.firmas
    .flatMap((f) => f.winkels.map((w) => `<li><a href="${w.url}" rel="noopener">${esc(w.naam)}</a></li>`))
    .join('\n            ');

  const voetFirmas = groep.firmas
    .map((f) => `<li>${esc(f.naam)} <span class="zacht">· ${esc(f.btw_label)} ${esc(f.btw)}</span></li>`)
    .join('\n            ');

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
  <meta property="og:locale" content="${taal}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preconnect" href="https://cdn.shopify.com">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap">
  <link rel="stylesheet" href="/stijl.css">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <meta name="msvalidate.01" content="72A0E590C5D434F652C1E4256F2B418C">
${extraHoofd}</head>
<body>
  <header class="kop">
    <div class="kop__in">
      <a class="merk" href="${url(taal, 'start')}">
        <span class="merk__teken" aria-hidden="true">EP</span>
        <span>
          <span class="merk__naam">${esc(t('site.naam', taal))}</span><br>
          <span class="merk__sub">${esc(t('site.ondertitel', taal))}</span>
        </span>
      </a>
      <nav class="nav" aria-label="${esc(t('nav.groep', taal))}">
          ${nav}
      </nav>
      <div class="talen" role="group" aria-label="${esc(t('nav.taal', taal))}">
          ${talen}
      </div>
    </div>
  </header>
${inhoud}
  <footer class="voet">
    <div class="wrap">
      <div class="voet__raster">
        <div>
          <h3>${esc(t('site.naam', taal))}</h3>
          <p class="zacht">${esc(t('voet.groep', taal))}</p>
        </div>
        <div>
          <h3>${esc(t('nav.winkels', taal))}</h3>
          <p class="zacht">${esc(t('voet.particulier', taal))}</p>
          <ul>
            ${voetWinkels}
          </ul>
        </div>
        <div>
          <h3>${esc(t('doc.firma.kop', taal))}</h3>
          <ul class="zacht">
            ${voetFirmas}
          </ul>
        </div>
        <div>
          <h3>${esc(t('voet.contact', taal))}</h3>
          <ul>
            <li><a href="mailto:${groep.koepel.contact}">${esc(groep.koepel.contact)}</a></li>
            <li><a href="${url(taal, 'zakelijk')}">${esc(t('nav.zakelijk', taal))}</a></li>
          </ul>
        </div>
      </div>
    </div>
      <p class="voet__slot">© ${new Date().getFullYear()} ${esc(t('site.naam', taal))} · ${groep.firmas
        .map((f) => esc(f.naam))
        .join(' · ')}</p>
    </div>
  </footer>
  <script>
  (function () {
    // Kop wordt vast zodra je scrolt.
    var kop = document.querySelector('.kop');
    var vast = function () { kop.classList.toggle('kop--vast', window.scrollY > 40); };
    vast(); window.addEventListener('scroll', vast, { passive: true });

    // Blokken komen rustig op. Wie beweging uit heeft staan, ziet ze meteen.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.op').forEach(function (e) { e.classList.add('zichtbaar'); });
      return;
    }
    var kijker = new IntersectionObserver(function (regels) {
      regels.forEach(function (r) {
        if (r.isIntersecting) { r.target.classList.add('zichtbaar'); kijker.unobserve(r.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    document.querySelectorAll('.op').forEach(function (e) { kijker.observe(e); });
  })();
  </script>
</body>
</html>
`;
}

// ── startpagina ─────────────────────────────────────────────────────────────

function firmaKaart(f, taal) {
  const rol = f.rol === 'holding' ? t('firma.rol.holding', taal) : t('firma.rol.dochter', taal);
  const landnaam = land(f.land, taal);
  const winkels = f.winkels
    .map((w) => `<li><a href="${w.url}" rel="noopener">${esc(w.naam)}</a></li>`)
    .join('\n          ');
  const magazijn = f.magazijn
    ? `<dt>${esc(t('firma.magazijn', taal))}</dt><dd>${esc(f.magazijn)}</dd>`
    : '';
  const siret = f.siret ? `<dt>SIRET</dt><dd>${esc(f.siret)}</dd>` : '';
  return `        <article class="kaart" id="firma-${f.id}">
          <p class="kaart__rol">${esc(f.rol === 'holding' ? rol : `${rol} · ${landnaam}`)}</p>
          <h3>${esc(f.naam)}</h3>
          <address>${f.adres.map(esc).join('<br>')}</address>
          <dl>
            <dt>${esc(f.btw_label)}</dt><dd>${esc(f.btw)}</dd>
            ${siret}
            ${magazijn}
          </dl>
          <h4 style="font-size:14px;margin:14px 0 4px;">${esc(t('firma.winkels', taal))}</h4>
          <ul>
          ${winkels}
          </ul>
        </article>`;
}

// De jaarringen-band. Zelf getekend uit de kleuren van onze eigen plankfoto —
// geen AI-beeld, geen bestand om te laden. Met het logo in de hoek, zoals afgesproken
// voor elke visual die we zelf maken.
function jaarringen() {
  const ringen = [];
  // Onregelmatige afstanden: echte jaarringen staan nooit even ver uit elkaar.
  let straal = 40;
  const zaad = [37, 23, 51, 19, 44, 28, 61, 33, 25, 47, 21, 55, 31, 42, 26, 58, 35, 49, 23, 40];
  for (let i = 0; i < zaad.length; i++) {
    straal += zaad[i];
    const dikte = 1 + (i % 3) * 0.6;
    const doorzicht = (0.34 - i * 0.012).toFixed(3);
    ringen.push(
      `<circle cx="210" cy="640" r="${straal}" fill="none" stroke="#CE9766" stroke-width="${dikte}" opacity="${doorzicht}"/>`
    );
  }
  return `<svg class="nerf__svg" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="gloed" cx="15%" cy="72%" r="70%">
          <stop offset="0%" stop-color="#3a2a1d"/>
          <stop offset="100%" stop-color="#1a1410"/>
        </radialGradient>
      </defs>
      <rect width="1440" height="900" fill="url(#gloed)"/>
      <g>${ringen.join('')}</g>
      <g opacity=".5" fill="none" stroke="#CE9766" stroke-width="1.1">
        ${Array.from({ length: 7 }, (_, i) => {
          const y = 120 + i * 118;
          return `<path d="M760 ${y} C 940 ${y - 26}, 1120 ${y + 30}, 1440 ${y - 10}" opacity="${(0.3 - i * 0.03).toFixed(2)}"/>`;
        }).join('')}
      </g>
      <g transform="translate(1290 810)" opacity=".55">
        <rect width="34" height="34" rx="9" fill="#CE9766"/>
        <text x="17" y="23" font-family="Inter, Helvetica, Arial, sans-serif" font-size="13" font-weight="700" fill="#241c16" text-anchor="middle">EP</text>
      </g>
    </svg>`;
}

// De Europakaart: het continent als aaneengelegde houtstalen, met drie gloeiende
// werkplaatsen en leverroutes die er als takken uitgroeien. De landvormen komen uit
// open geodata (zie scripts/europakaart.mjs); de houttinten, de gloed, de gloeiende
// vestigingen en de groeiende routes zijn zelf getekend — geen foto, geen kant-en-klare
// kaartendienst, geen tracking.
function stadVan(f) {
  return f.adres[1].replace(/^\S+\s+/, '');
}

// Een lichtjes andere houttint per land, zoals planken in een vloer nooit precies
// dezelfde kleur hebben. Vast per landcode (geen Math.random): herbouwen geeft
// steeds hetzelfde beeld.
function houtTint(iso) {
  let h = 0;
  for (const c of iso) h = (h * 31 + c.charCodeAt(0)) % 997;
  const lichtheid = 55 + (h % 10); // 55–64 %
  return `hsl(30 44% ${lichtheid}%)`;
}

function boogpad(x1, y1, x2, y2) {
  const dx = x2 - x1, dy = y2 - y1;
  const afstand = Math.hypot(dx, dy) || 1;
  const buig = Math.min(afstand * 0.16, 60);
  const cx = (x1 + x2) / 2 + (-dy / afstand) * buig;
  const cy = (y1 + y2) / 2 + (dx / afstand) * buig;
  return `M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}`;
}

function europakaart(taal) {
  const [VW, VH] = europa._view;

  const landen = Object.entries(europa.landen)
    .map(([iso, l]) => `<path class="ekaart__land" d="${l.pad}" fill="${houtTint(iso)}"><title>${esc(l.naam)}</title></path>`)
    .join('');

  const hubVoorFirma = Object.fromEntries(groep.kaart.vestigingen.map((v) => [v.firma, v]));

  const routes = groep.kaart.markten
    .map((m, i) => {
      const firmaId = groep.routering[m.land] || 'bv';
      const hub = hubVoorFirma[firmaId];
      if (!hub) return '';
      return `<path class="ekaart__route" d="${boogpad(hub.x, hub.y, m.x, m.y)}" style="--vertraging:${i * 85}ms"/>`;
    })
    .join('');

  const marktpunten = groep.kaart.markten
    .map(
      (m) => `<g class="ekaart__markt" transform="translate(${m.x} ${m.y})">
        <circle r="4"/>
        <title>${esc(land(m.land, taal))}</title>
        <text x="7" y="4">${esc(m.land)}</text>
      </g>`
    )
    .join('');

  const hubs = groep.kaart.vestigingen
    .map((v) => {
      const f = firma(v.firma);
      const stad = stadVan(f);
      return `<a class="ekaart__hub" href="#firma-${v.firma}" aria-label="${esc(f.naam)} — ${esc(stad)}">
        <g transform="translate(${v.x} ${v.y})">
          <circle class="ekaart__puls" r="7"/>
          <circle class="ekaart__punt" r="4.5"/>
          <text class="ekaart__stad" x="0" y="-13">${esc(stad)}</text>
        </g>
      </a>`;
    })
    .join('');

  return `    <figure class="ekaart__wrap op">
      <svg class="ekaart__svg" viewBox="0 0 ${VW} ${VH}" role="img" aria-label="${esc(t('kaart.kop', taal))}">
        <defs>
          <radialGradient id="ekaartGloed" cx="27%" cy="54%" r="65%">
            <stop offset="0%" stop-color="#4a3826"/>
            <stop offset="100%" stop-color="#1f1810"/>
          </radialGradient>
        </defs>
        <rect class="ekaart__achtergrond" width="${VW}" height="${VH}" fill="url(#ekaartGloed)"/>
        <g class="ekaart__landen">${landen}</g>
        <g class="ekaart__routes">${routes}</g>
        <g class="ekaart__markten">${marktpunten}</g>
        <g class="ekaart__hubs">${hubs}</g>
      </svg>
      <figcaption class="ekaart__legende">
        <span><i class="ekaart__chip ekaart__chip--hub"></i>${esc(t('kaart.legende.vestiging', taal))}</span>
        <span><i class="ekaart__chip ekaart__chip--markt"></i>${esc(t('kaart.legende.markt', taal))}</span>
        <span class="ekaart__hint">${esc(t('kaart.legende.hint', taal))}</span>
      </figcaption>
    </figure>`;
}

function startPagina(taal) {
  const inhoud = `  <div class="hero">
    <img class="hero__beeld" src="${beeld('hero', 2000)}" alt="${esc(beeldAlt('hero', taal))}" fetchpriority="high" width="2048" height="2048">
    <div class="hero__in">
      <h1>${esc(t('hero.kop1', taal))}<br><em>${esc(t('hero.kop2', taal))}</em></h1>
      <p class="hero__lood">${esc(t('hero.lood', taal))}</p>
      <div class="knoppen">
        <a class="knop" href="${url(taal, 'winkels')}">${esc(t('home.hero.knop_winkels', taal))}</a>
        <a class="knop knop--glas" href="${url(taal, 'zakelijk')}">${esc(t('home.hero.knop_zakelijk', taal))}</a>
      </div>
      <p class="hero__merken">
        <span>${esc(t('hero.merken', taal))}</span>
        ${groep.firmas.map((f) => `<span><b>${esc(land(f.land, taal))}</b></span>`).join('\n        ')}
      </p>
    </div>
  </div>

  <div class="werelden">
    <a class="wereld" href="${url(taal, 'winkels')}">
      <img src="${beeld('buiten', 1200)}" alt="${esc(beeldAlt('buiten', taal))}" loading="lazy" width="3264" height="3264">
      <div class="op">
        <span class="wereld__label">${esc(t('wereld.buiten.label', taal))}</span>
        <h2>${esc(t('wereld.buiten.kop', taal))}</h2>
        <p>${esc(t('wereld.buiten.tekst', taal))}</p>
        <span class="wereld__meer">${esc(t('wereld.meer', taal))}</span>
      </div>
    </a>
    <a class="wereld" href="${url(taal, 'winkels')}">
      <img src="${beeld('binnen', 1200)}" alt="${esc(beeldAlt('binnen', taal))}" loading="lazy" width="2000" height="2000">
      <div class="op">
        <span class="wereld__label">${esc(t('wereld.binnen.label', taal))}</span>
        <h2>${esc(t('wereld.binnen.kop', taal))}</h2>
        <p>${esc(t('wereld.binnen.tekst', taal))}</p>
        <span class="wereld__meer">${esc(t('wereld.meer', taal))}</span>
      </div>
    </a>
  </div>

  <section class="nerf">
    ${jaarringen()}
    <div class="wrap">
      <div class="lees op">
        <p class="opschrift">${esc(t('hout.opschrift', taal))}</p>
        <h2 class="band__kop">${esc(t('hout.kop', taal))}</h2>
        <p class="band__lood">${esc(t('hout.tekst', taal))}</p>
      </div>
    </div>
  </section>

  <section class="band band--nacht">
    <div class="wrap">
      <div class="lees op">
        <p class="opschrift">${esc(t('home.wie.kop', taal))}</p>
        <h2 class="band__kop">${esc(t('home.firmas.kop', taal))}</h2>
        <p class="band__lood">${esc(t('home.wie.tekst', taal))}</p>
      </div>
      <div class="lees op">
        <p class="opschrift">${esc(t('kaart.opschrift', taal))}</p>
        <h2 class="band__kop">${esc(t('kaart.kop', taal))}</h2>
        <p class="band__lood">${esc(t('kaart.tekst', taal))}</p>
      </div>
${europakaart(taal)}
      <div class="raster raster--3 op">
${groep.firmas.map((f) => firmaKaart(f, taal)).join('\n')}
      </div>
    </div>
  </section>

  <section class="band band--licht">
    <div class="wrap">
      <div class="lees op">
        <p class="opschrift">${esc(t('nav.zakelijk', taal))}</p>
        <h2 class="band__kop">${esc(t('zakelijk.kop', taal))}</h2>
        <p class="band__lood">${esc(t('zakelijk.tekst', taal))}</p>
        <div class="knoppen">
          <a class="knop knop--donker" href="${url(taal, 'zakelijk')}">${esc(t('home.hero.knop_zakelijk', taal))}</a>
        </div>
      </div>
    </div>
  </section>
`;
  // Eén organisatie-blok met de drie vennootschappen als afdeling: zo weet Google
  // dat deze pagina over de groep gaat en niet over één webwinkel.
  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: groep.koepel.naam,
    url: `${SITE}${url(taal, 'start')}`,
    email: groep.koepel.contact,
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
  const extraHoofd = `  <script type="application/ld+json">${JSON.stringify(jsonld)}</script>\n`;
  return pagina({
    taal,
    paginaId: 'start',
    titel: t('home.titel', taal),
    meta: t('home.meta', taal),
    inhoud,
    extraHoofd,
  });
}

// ── winkelkiezer ────────────────────────────────────────────────────────────

function winkelsPagina(taal) {
  const hoofdwinkel = firma('bv').winkels[0];
  const kaarten = groep.markten_hoofdwinkel
    .map((code) => {
      const fid = groep.routering[code] || 'bv';
      const f = firma(fid);
      // De eigen winkel van de dochter krijgt voorrang; anders de hoofdwinkel.
      const w = fid === 'bv' ? hoofdwinkel : f.winkels[0];
      return `        <a class="landkaart" href="${w.url}" rel="noopener">
          <span class="landkaart__land">${esc(land(code, taal))}</span>
          <span class="landkaart__winkel">${esc(w.naam)}</span>
          <span class="landkaart__firma">${esc(f.naam)}</span>
        </a>`;
    })
    .join('\n');

  const overige = [
    ...groep.zustersites_bv.map((z) => ({ ...z, f: firma('bv') })),
    ...groep.zustersites_gmbh.map((z) => ({ ...z, f: firma('gmbh') })),
    ...groep.zustersites_sarl.map((z) => ({ ...z, f: firma('sarl') })),
  ]
    .map(
      (z) => `        <li><a href="${z.url}" rel="noopener">${esc(z.naam)}</a> <span class="zacht">· ${esc(z.f.naam)}</span></li>`
    )
    .join('\n');

  const inhoud = `  <div class="paginakop">
    <img class="paginakop__beeld" src="${beeld('werk', 1600)}" alt="" aria-hidden="true" loading="eager">
    <div class="wrap">
      <h1>${esc(t('winkels.kop', taal))}</h1>
      <p>${esc(t('winkels.tekst', taal))}</p>
    </div>
  </div>
  <main class="band band--nacht">
    <div class="wrap">
    <section>
      <div class="landen">
${kaarten}
      </div>
      <p class="voetnoot">${esc(hoofdwinkel.naam)} — ${esc(t('winkels.hoofdwinkel', taal))}</p>
    </section>
    <section>
      <h2>${esc(t('winkels.overige.kop', taal))}</h2>
      <p class="lood">${esc(t('winkels.overige.tekst', taal))}</p>
      <ul class="lijst">
${overige}
      </ul>
    </section>
  </main>
`;
  return pagina({
    taal,
    paginaId: 'winkels',
    titel: t('winkels.titel', taal),
    meta: t('winkels.meta', taal),
    inhoud,
  });
}

// ── zakelijke balie ─────────────────────────────────────────────────────────

function zakelijkPagina(taal) {
  const landOpties = Object.keys(groep.routering)
    .map((c) => `<option value="${c}">${esc(land(c, taal))}</option>`)
    .join('\n              ');

  const soorten = ['gemeente', 'school', 'vereniging', 'camping', 'horeca', 'bedrijf', 'andere']
    .map((s) => `<option value="${s}">${esc(t(`form.soort.${s}`, taal))}</option>`)
    .join('\n              ');

  const wanneer = ['zodra', 'datum', 'voorjaar', 'weetniet']
    .map((s) => `<option value="${s}">${esc(t(`form.wanneer.${s}`, taal))}</option>`)
    .join('\n              ');

  const nodig = ['offerte', 'bestelbon', 'fiche', 'bestek', 'bezoek']
    .map(
      (s) => `<label class="vinkje"><input type="checkbox" name="nodig" value="${s}"> <span>${esc(t(`form.nodig.${s}`, taal))}</span></label>`
    )
    .join('\n            ');

  const punten = ['offerte', 'bestelbon', 'levering', 'aanbesteding', 'staffel']
    .map((p) => `        <li>${esc(t(`zakelijk.punt.${p}`, taal))}</li>`)
    .join('\n');

  const L = groep.levering.termijn;
  const inhoud = `  <div class="paginakop">
    <img class="paginakop__beeld" src="${beeld('werk', 1600)}" alt="" aria-hidden="true" loading="eager">
    <div class="wrap">
      <h1>${esc(t('zakelijk.kop', taal))}</h1>
      <p>${esc(t('zakelijk.tekst', taal))}</p>
    </div>
  </div>
  <main class="band band--licht">
    <div class="wrap">
    <section>
      <h2>${esc(t('zakelijk.punten.kop', taal))}</h2>
      <ul class="lijst">
${punten}
      </ul>
    </section>

    <section id="aanvraag">
      <h2>${esc(t('form.kop', taal))}</h2>
      <p class="lood">${esc(t('form.uitleg', taal))}</p>

      <form class="formulier" id="aanvraagFormulier" novalidate>
        <div class="melding" id="firmaMelding" hidden></div>

        <div class="veldrij">
          <div class="veld">
            <label for="land">${esc(t('form.land', taal))} *</label>
            <select id="land" name="land" required>
              <option value="">${esc(t('form.land.kies', taal))}</option>
              ${landOpties}
              <option value="XX">${esc(t('form.land.anders', taal))}</option>
            </select>
          </div>
          <div class="veld">
            <label for="soort">${esc(t('form.soort', taal))}</label>
            <select id="soort" name="soort">
              <option value="">${esc(t('form.soort.kies', taal))}</option>
              ${soorten}
            </select>
          </div>
        </div>

        <div class="veldrij">
          <div class="veld">
            <label for="organisatie">${esc(t('form.organisatie', taal))} *</label>
            <input id="organisatie" name="organisatie" required autocomplete="organization">
          </div>
          <div class="veld">
            <label for="btw">${esc(t('form.btw', taal))}</label>
            <input id="btw" name="btw" autocomplete="off">
          </div>
        </div>

        <div class="veldrij">
          <div class="veld">
            <label for="naam">${esc(t('form.naam', taal))} *</label>
            <input id="naam" name="naam" required autocomplete="name">
          </div>
          <div class="veld">
            <label for="email">${esc(t('form.email', taal))} *</label>
            <input id="email" name="email" type="email" required autocomplete="email">
          </div>
          <div class="veld">
            <label for="telefoon">${esc(t('form.telefoon', taal))}</label>
            <input id="telefoon" name="telefoon" type="tel" autocomplete="tel">
          </div>
        </div>

        <div class="veldrij">
          <div class="veld">
            <label for="producten">${esc(t('form.producten', taal))} *</label>
            <input id="producten" name="producten" required placeholder="${esc(t('doc.lijn.king-picknick', taal))}…">
          </div>
          <div class="veld">
            <label for="aantal">${esc(t('form.aantal', taal))}</label>
            <input id="aantal" name="aantal" inputmode="numeric">
          </div>
          <div class="veld">
            <label for="wanneer">${esc(t('form.wanneer', taal))}</label>
            <select id="wanneer" name="wanneer">
              ${wanneer}
            </select>
          </div>
        </div>

        <fieldset>
          <legend>${esc(t('form.nodig', taal))}</legend>
          <div class="vinkjes">
            ${nodig}
          </div>
        </fieldset>

        <div class="veld">
          <label for="bericht">${esc(t('form.bericht', taal))}</label>
          <textarea id="bericht" name="bericht"></textarea>
        </div>

        <div class="melding melding--fout" id="foutMelding" hidden></div>
        <button class="knop" type="submit" id="verstuurKnop">${esc(t('form.verstuur', taal))}</button>
      </form>

      <div class="gelukt" id="geluktBlok" hidden>
        <h3>${esc(t('form.gelukt.kop', taal))}</h3>
        <p id="geluktTekst"></p>
      </div>
    </section>

    <section>
      <h2>${esc(t('levering.kop', taal))}</h2>
      <p class="lood">${esc(t('levering.tekst', taal))}</p>
      <div class="tabelrol">
        <table>
          <thead>
            <tr>
              <th></th>
              <th>${esc(land('BE', taal))} · ${esc(land('NL', taal))} · ${esc(land('LU', taal))}</th>
              <th>${esc(land('DE', taal))} · ${esc(land('FR', taal))}</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>${esc(t('levering.hoogseizoen', taal))}</td><td>${esc(L.hoogseizoen_apr_jul.be_nl_lu[taal])}</td><td>${esc(L.hoogseizoen_apr_jul.de_fr[taal])}</td></tr>
            <tr><td>${esc(t('levering.buitenseizoen', taal))}</td><td>${esc(L.buitenseizoen_aug_mrt.be_nl_lu[taal])}</td><td>${esc(L.buitenseizoen_aug_mrt.de_fr[taal])}</td></tr>
            <tr><td>${esc(t('levering.pakket', taal))}</td><td colspan="2">${esc(groep.levering.pakket[taal])}</td></tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
  <script>
  (function () {
    var ROUTERING = ${JSON.stringify(groep.routering)};
    var FIRMAS = ${JSON.stringify(
      Object.fromEntries(groep.firmas.map((f) => [f.id, f.naam]))
    )};
    var TEKST = {
      firma: ${JSON.stringify(t('form.firma_melding', taal))},
      anders: ${JSON.stringify(t('form.firma_anders', taal))},
      bezig: ${JSON.stringify(t('form.bezig', taal))},
      verstuur: ${JSON.stringify(t('form.verstuur', taal))},
      gelukt: ${JSON.stringify(t('form.gelukt.tekst', taal))},
      mislukt: ${JSON.stringify(t('form.mislukt', taal))}
    };
    var EMAIL = ${JSON.stringify(groep.koepel.contact)};
    var form = document.getElementById('aanvraagFormulier');
    var landVeld = document.getElementById('land');
    var firmaMelding = document.getElementById('firmaMelding');
    var foutMelding = document.getElementById('foutMelding');
    var knop = document.getElementById('verstuurKnop');

    function firmaVoorLand(code) { return ROUTERING[code] || null; }

    landVeld.addEventListener('change', function () {
      var id = firmaVoorLand(landVeld.value);
      if (!landVeld.value) { firmaMelding.hidden = true; return; }
      firmaMelding.hidden = false;
      firmaMelding.textContent = id
        ? TEKST.firma.replace('{firma}', FIRMAS[id])
        : TEKST.anders;
    });

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
            TEKST.gelukt.replace('{firma}', uitslag.firma || FIRMAS.bv);
          blok.hidden = false;
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

// ── documentenkast ──────────────────────────────────────────────────────────

function documentenPagina(taal) {
  const tabellen = Object.entries(producten.lijnen)
    .filter(([, rijen]) => rijen.length)
    .map(([lijnId, rijen]) => {
      const heeftDikte = rijen.some((r) => r.plankdikte_mm);
      const koppen = [
        t('doc.tabel.artikel', taal),
        t('doc.tabel.code', taal),
        t('doc.tabel.maat', taal),
        t('doc.tabel.gewicht', taal),
        t('doc.tabel.hout', taal),
        ...(heeftDikte ? [t('doc.tabel.dikte', taal)] : []),
      ];
      const body = rijen
        .map((r) => {
          const maat = !r.maat
            ? `<span class="zacht">${esc(t('doc.onbekend', taal))}</span>`
            : r.maat.b && r.maat.h
            ? `${r.maat.l} × ${r.maat.b} × ${r.maat.h} cm`
            : `${r.maat.l} cm`;
          const gew = r.gewicht_kg
            ? `ca. ${String(r.gewicht_kg).replace('.', taal === 'en' ? '.' : ',')} kg`
            : `<span class="zacht">${esc(t('doc.onbekend', taal))}</span>`;
          const hout = r.houtsoort
            ? esc(houtsoort(r.houtsoort, taal))
            : `<span class="zacht">${esc(t('doc.onbekend', taal))}</span>`;
          const dikte = heeftDikte
            ? `<td>${r.plankdikte_mm ? `${r.plankdikte_mm} mm` : `<span class="zacht">—</span>`}</td>`
            : '';
          const naam = (r.namen && r.namen[taal]) || r.naam;
          return `            <tr><td>${esc(naam)}</td><td><code>${esc(r.sku)}</code></td><td>${maat}</td><td>${gew}</td><td>${hout}</td>${dikte}</tr>`;
        })
        .join('\n');
      return `      <div class="tabelrol">
        <table>
          <caption>${esc(t(`doc.lijn.${lijnId}`, taal))}</caption>
          <thead><tr>${koppen.map((k) => `<th>${esc(k)}</th>`).join('')}</tr></thead>
          <tbody>
${body}
          </tbody>
        </table>
      </div>`;
    })
    .join('\n');

  const firmaRijen = groep.firmas
    .map(
      (f) => `            <tr>
              <td>${esc(f.naam)}</td>
              <td>${esc(f.adres.join(', '))}</td>
              <td>${esc(f.btw_label)} ${esc(f.btw)}${f.siret ? `<br><span class="zacht">SIRET ${esc(f.siret)}</span>` : ''}</td>
              <td>${f.landen_zakelijk.map((c) => esc(land(c, taal))).join(', ')}</td>
            </tr>`
    )
    .join('\n');

  const inhoud = `  <div class="paginakop">
    <img class="paginakop__beeld" src="${beeld('hout', 1600)}" alt="" aria-hidden="true" loading="eager">
    <div class="wrap">
      <h1>${esc(t('doc.kop', taal))}</h1>
      <p>${esc(t('doc.tekst', taal))}</p>
    </div>
  </div>
  <main class="band band--licht">
    <div class="wrap">
    <section>
${tabellen}
      <p class="voetnoot">${esc(t('doc.voetnoot', taal))}</p>
    </section>
    <section>
      <h2>${esc(t('doc.hout.kop', taal))}</h2>
      <p class="lood">${esc(t('doc.hout.tekst', taal))}</p>
    </section>
    <section>
      <h2>${esc(t('doc.firma.kop', taal))}</h2>
      <p class="lood">${esc(t('doc.firma.tekst', taal))}</p>
      <div class="tabelrol">
        <table>
          <thead><tr>
            <th>${esc(t('doc.firma.kop', taal))}</th>
            <th>${esc(t('firma.magazijn', taal))}</th>
            <th>${esc(t('form.btw', taal))}</th>
            <th>${esc(t('form.land', taal))}</th>
          </tr></thead>
          <tbody>
${firmaRijen}
          </tbody>
        </table>
      </div>
      <div class="knoppen">
        <a class="knop" href="${url(taal, 'zakelijk')}#aanvraag">${esc(t('home.hero.knop_zakelijk', taal))}</a>
      </div>
    </section>
  </main>
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
    (l) =>
      `      <a class="landkaart" href="${url(l, 'start')}" hreflang="${l}" lang="${l}">
        <span class="landkaart__land">${esc(TAALNAAM[l])}</span>
        <span class="landkaart__winkel">${esc(t('home.hero.kop', l))}</span>
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
  <meta name="description" content="${esc(t('home.meta', 'en'))}">
  <link rel="canonical" href="${SITE}/en/">
${hreflang}
  <link rel="alternate" hreflang="x-default" href="${SITE}/en/">
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
  <main class="wrap" style="padding-top:48px;">
    <h1>E-Products Europe</h1>
    <p class="lood">${esc(t('site.ondertitel', 'en'))}</p>
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

rmSync(UIT, { recursive: true, force: true });
mkdirSync(UIT, { recursive: true });

const bouwers = {
  start: startPagina,
  winkels: winkelsPagina,
  zakelijk: zakelijkPagina,
  documenten: documentenPagina,
};

let aantal = 0;
const urls = [];
for (const taal of TALEN) {
  for (const p of PAGINAS) {
    const u = url(taal, p.id);
    schrijf(join(u.slice(1), 'index.html'), bouwers[p.id](taal));
    urls.push(u);
    aantal++;
  }
}

schrijf('index.html', taalkiezer());
cpSync(join(WORTEL, 'src/stijl.css'), join(UIT, 'stijl.css'));

// Een eenvoudig merkteken; geen fotobestand nodig en schaalt overal mee.
schrijf(
  'favicon.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#CE9766"/><text x="32" y="43" font-family="Helvetica,Arial,sans-serif" font-size="30" font-weight="700" fill="#fff" text-anchor="middle">EP</text></svg>\n`
);

// Eigendomsbewijs voor Google Search Console. NIET verwijderen: zonder dit bestand
// verliezen we de toegang tot de meetgegevens van dit domein.
schrijf('googleb0cdacf373743028.html', 'google-site-verification: googleb0cdacf373743028.html\n');

schrijf('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);

const vandaag = new Date().toISOString().slice(0, 10);
schrijf(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls
  .map((u) => {
    const paginaId = PAGINAS.find((p) => TALEN.some((l) => url(l, p.id) === u)).id;
    const alts = TALEN.map(
      (l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${SITE}${url(l, paginaId)}"/>`
    ).join('\n');
    return `  <url>\n    <loc>${SITE}${u}</loc>\n    <lastmod>${vandaag}</lastmod>\n${alts}\n  </url>`;
  })
  .join('\n')}
</urlset>
`
);

console.log(`✓ public/ — ${aantal} pagina's in ${TALEN.length} talen, plus taalkiezer, robots.txt en sitemap.xml`);
