#!/usr/bin/env node
// Zet een open Europa-geojson om naar vereenvoudigde SVG-paden voor de startpagina.
//
//   node scripts/europakaart.mjs
//
// Bron: leakyMirror/map-of-europe (publieke GeoJSON, landgrenzen — geen auteursrechtelijk
// beschermd werk, enkel geografische feiten). We tekenen er zelf de houtsfeer overheen
// (jaarringen-vulling, gloeiende vestigingen, groeiende levertakken) — dat is ons eigen werk.
//
// Schrijft data/europa-paden.json: één vereenvoudigd pad per land, al geprojecteerd
// naar het SVG-vlak (0..VIEW_W × 0..VIEW_H) zodat bouw.mjs ze zonder rekenwerk neerzet.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const WORTEL = join(dirname(fileURLToPath(import.meta.url)), '..');
const BRON = join(process.env.HOME, '.cache-geo/europe.geojson');
const SCRATCH_BRON = process.argv[2]; // optioneel: pad meegeven

const VIEW_W = 1000;
const VIEW_H = 760;

// Kader: Europa van IJsland/Portugal tot de Oeral/Turkije, Scandinavië tot Kreta.
// Een beetje ruim gekozen zodat Noorwegen en Griekenland niet afgesneden worden.
const LON_MIN = -11, LON_MAX = 42;
const LAT_MIN = 34, LAT_MAX = 71;

// De landen die we tonen. Rusland/Wit-Rusland/Oekraïne/Turkije/Kaukasus laten we weg —
// die vertekenen de kaart (Rusland is enorm) en horen niet bij "waar wij leveren".
const TONEN = new Set([
  'BE','NL','LU','DE','AT','FR','MC','GB','IE','IT','SM','VA','ES','PT','AD',
  'DK','SE','FI','NO','IS','PL','CZ','SK','HU','CH','LI','SI','HR','BA','RS',
  'ME','MK','AL','GR','BG','RO','EE','LV','LT','MT','CY','FO',
]);

function projecteer([lon, lat]) {
  const x = ((lon - LON_MIN) / (LON_MAX - LON_MIN)) * VIEW_W;
  // Lichte Mercator-achtige correctie zodat Scandinavië niet overdreven breed oogt.
  const yLin = ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * VIEW_H;
  return [Number(x.toFixed(1)), Number(yLin.toFixed(1))];
}

// Douglas-Peucker — vereenvoudigt een ring tot rustige, vloeiende lijnen.
// Belangrijk voor bestandsgrootte én omdat een houtsfeer gebaat is bij zachte vormen,
// niet bij elke fjord van de officiële kustlijn.
function afstandTotLijn(p, a, b) {
  const [x, y] = p, [x1, y1] = a, [x2, y2] = b;
  const dx = x2 - x1, dy = y2 - y1;
  const lengte2 = dx * dx + dy * dy;
  if (lengte2 === 0) return Math.hypot(x - x1, y - y1);
  let t = ((x - x1) * dx + (y - y1) * dy) / lengte2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(x - (x1 + t * dx), y - (y1 + t * dy));
}
function vereenvoudig(punten, tolerantie) {
  if (punten.length < 3) return punten;
  let maxD = 0, idx = 0;
  for (let i = 1; i < punten.length - 1; i++) {
    const d = afstandTotLijn(punten[i], punten[0], punten[punten.length - 1]);
    if (d > maxD) { maxD = d; idx = i; }
  }
  if (maxD > tolerantie) {
    const links = vereenvoudig(punten.slice(0, idx + 1), tolerantie);
    const rechts = vereenvoudig(punten.slice(idx), tolerantie);
    return links.slice(0, -1).concat(rechts);
  }
  return [punten[0], punten[punten.length - 1]];
}

// Oppervlakte van een ring (schoenveterformule) — om snipper-eilandjes te filteren
// die bij deze schaal toch maar een paar pixels zijn en enkel bestandsgrootte kosten.
function oppervlakte(punten) {
  let s = 0;
  for (let i = 0; i < punten.length; i++) {
    const [x1, y1] = punten[i], [x2, y2] = punten[(i + 1) % punten.length];
    s += x1 * y2 - x2 * y1;
  }
  return Math.abs(s) / 2;
}

function padUitRing(ring, tolerantie) {
  const punten = ring.map(projecteer);
  if (oppervlakte(punten) < 4) return null; // kleiner dan ~4 vierkante SVG-eenheden: ruis
  const simpel = vereenvoudig(punten, tolerantie);
  if (simpel.length < 3) return null;
  // Decimalen eraf waar het kan — scheelt flink in bestandsgrootte, onzichtbaar op schaal.
  const kort = simpel.map(([x, y]) => `${Math.round(x * 2) / 2} ${Math.round(y * 2) / 2}`);
  return 'M' + kort.join('L') + 'Z';
}

function laadBron() {
  const kandidaten = [SCRATCH_BRON, BRON, join(WORTEL, 'tmp/europe.geojson')].filter(Boolean);
  for (const pad of kandidaten) if (pad && existsSync(pad)) return JSON.parse(readFileSync(pad, 'utf8'));
  console.error('Geen europe.geojson gevonden. Geef het pad mee: node scripts/europakaart.mjs <pad>');
  process.exit(1);
}

const bron = laadBron();
const landen = {};

for (const f of bron.features) {
  const iso = f.properties.ISO2;
  if (!TONEN.has(iso)) continue;
  const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
  const paden = [];
  for (const poly of polys) {
    // Alleen de buitenring (poly[0]) — eilandjes-in-meren negeren we, dat detailniveau
    // dient de houtsfeer niet.
    const pad = padUitRing(poly[0], 2.2);
    if (pad) paden.push(pad);
  }
  if (paden.length) landen[iso] = { naam: f.properties.NAME, pad: paden.join(' ') };
}

writeFileSync(
  join(WORTEL, 'data/europa-paden.json'),
  JSON.stringify(
    { _bron: 'leakyMirror/map-of-europe, vereenvoudigd en geprojecteerd', _view: [VIEW_W, VIEW_H], landen },
    null,
    0
  )
);

const kB = Math.round(JSON.stringify(landen).length / 1024);
console.log(`✓ data/europa-paden.json — ${Object.keys(landen).length} landen, ${kB} KB`);
