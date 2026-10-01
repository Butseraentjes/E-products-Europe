#!/usr/bin/env node
// Maakt de pagina's die de drie oude folders vervangen.
//
// Waarom: op e-productseurope.com, e-productsfrance.fr en e-productsdeutschland.de
// staan onbevestigde claims en — op de Belgische en de Duitse — het rekeningnummer
// openbaar. Deze bestanden sturen de bezoeker naar de nieuwe koepelsite en halen dat
// in één keer weg. Elk bestand is één index.html dat in de repo van die site komt.
//
//   node scripts/vervangers.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const WORTEL = join(dirname(fileURLToPath(import.meta.url)), '..');
const DOEL = 'https://www.e-productseurope.com';

const SITES = [
  {
    bestand: 'e-productsfrance.fr/index.html',
    repo: 'Butseraentjes/E-products-france',
    taal: 'fr',
    naar: `${DOEL}/fr/`,
    titel: 'E-Products France — E-Products Europe',
    kop: 'E-Products France fait partie d’E-Products Europe',
    tekst: 'Toutes nos informations se trouvent désormais sur le site du groupe. Vous y êtes redirigé automatiquement.',
    knop: 'Continuer vers E-Products Europe',
  },
  {
    bestand: 'e-productsdeutschland.de/index.html',
    repo: 'Butseraentjes/e-productsdeutschland',
    taal: 'de',
    naar: `${DOEL}/de/`,
    titel: 'E-Products Deutschland — E-Products Europe',
    kop: 'E-Products Deutschland gehört zu E-Products Europe',
    tekst: 'Alle Informationen finden Sie jetzt auf der Seite der Gruppe. Sie werden automatisch weitergeleitet.',
    knop: 'Weiter zu E-Products Europe',
  },
];

const html = (s) => `<!doctype html>
<html lang="${s.taal}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${s.titel}</title>
<link rel="canonical" href="${s.naar}">
<meta http-equiv="refresh" content="0; url=${s.naar}">
<meta name="robots" content="noindex, follow">
<style>
  body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
       background:#f8f3e8;color:#3c2f1a;display:grid;place-items:center;min-height:100vh;padding:24px;line-height:1.6}
  .kaart{background:#fff;border:1px solid #e8e2d9;border-radius:12px;padding:32px;max-width:520px;text-align:center}
  .teken{width:52px;height:52px;border-radius:12px;background:#ce9766;color:#fff;font-weight:700;
         display:grid;place-items:center;margin:0 auto 18px;font-size:19px}
  h1{font-size:22px;margin:0 0 12px;line-height:1.3}
  p{margin:0 0 22px;color:#6b5d48}
  a{display:inline-block;background:#ce9766;color:#fff;text-decoration:none;font-weight:600;
    padding:13px 22px;border-radius:10px}
  a:hover{background:#b8824d}
</style>
<script>location.replace(${JSON.stringify(s.naar)});</script>
</head>
<body>
  <div class="kaart">
    <div class="teken">EP</div>
    <h1>${s.kop}</h1>
    <p>${s.tekst}</p>
    <a href="${s.naar}">${s.knop}</a>
  </div>
</body>
</html>
`;

for (const s of SITES) {
  const pad = join(WORTEL, 'vervangers', s.bestand);
  mkdirSync(dirname(pad), { recursive: true });
  writeFileSync(pad, html(s));
  console.log(`✓ vervangers/${s.bestand}  →  ${s.naar}   (repo ${s.repo})`);
}
console.log('\nPlaats elk bestand als index.html in de repo van die site; de hosting zet het vanzelf live.');
