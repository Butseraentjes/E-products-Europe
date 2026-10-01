#!/usr/bin/env node
// Haalt de productfiches uit de productkern (ewood/kern/kern.db, ALLEEN LEZEN)
// → data/producten.json  en  TE-BEVESTIGEN-producten.md
//
// Regel: we tonen alleen wat de kern echt weet. Spreken naam en maat elkaar tegen,
// dan laten we de maat weg en zetten de rij in de nakijklijst. Nooit aanvullen of raden.
//
//   node scripts/productdata.mjs

import { execFileSync } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HIER = dirname(fileURLToPath(import.meta.url));
const WORTEL = join(HIER, '..');
const KERN = join(process.env.HOME, 'Projects/ewood/kern/kern.db');

// De lijnen die zakelijke klanten kopen, in de volgorde waarin ze op de site komen.
// 'skus' = precies de artikelen die we tonen; geen jokers, zodat er nooit
// een tweede keuze of een montage-artikel binnensluipt.
const LIJNEN = [
  {
    id: 'king-picknick',
    skus: ['EP-K140', 'EP-K180', 'EP-K240', 'EP-K300', 'EP-K180SMART', 'EP-KCOM240'],
  },
  {
    id: 'royal-king',
    skus: ['EP-RK200', 'EP-RK240', 'EP-RK300'],
  },
  {
    id: 'vierkant-rond',
    skus: ['EP-KVKXXL', 'EP-KVK', 'EP-RKRONDXXL'],
  },
  {
    id: 'kinder',
    skus: ['EP-KKD140', 'EP-KKD90', 'EP-KKVKDECO', 'EP-KRDKD'],
  },
  {
    id: 'teak',
    skus: ['EP-DORD120', 'EP-DORD150', 'EP-DORD180', 'EP-DORD210', 'EP-DORD250'],
  },
  {
    id: 'bier',
    skus: ['EP-KBT220S80', 'EP-KBT220S70', 'EP-KBT220S60', 'EP-KBT160S70', 'EP-KBT110S60'],
  },
  {
    id: 'tuinbank',
    skus: ['EP-KCTB140', 'EP-KGTB140', 'EP-KGTB200', 'EP-KHTB', 'EP-B-LUX', 'EP-KTBVW180'],
  },
];

function vraag(sql) {
  const uit = execFileSync('sqlite3', ['-json', '-readonly', KERN, sql], {
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
  }).trim();
  return uit ? JSON.parse(uit) : [];
}

const alleSkus = LIJNEN.flatMap((l) => l.skus);
const inLijst = alleSkus.map((s) => `'${s.replace(/'/g, "''")}'`).join(',');

// Per artikel: de maat en het gewicht met de meest betrouwbare bron.
// Bij meerdere rijen per artikel nemen we de rij met de meeste gegevens.
const rijen = vraag(`
  select a.sku, a.naam, a.status,
         m.l_cm, m.b_cm, m.h_cm, m.tekst as maat_tekst, m.bron as maat_bron, m.zekerheid as maat_zekerheid,
         g.kg, g.bron as gewicht_bron, g.zekerheid as gewicht_zekerheid,
         (select group_concat(s.sleutel || '=' || s.waarde, '|')
            from specificatie s where s.artikel_id = a.artikel_id) as specs
    from artikel a
    left join artikel_maat m on m.artikel_id = a.artikel_id
    left join gewicht   g on g.artikel_id = a.artikel_id
   where a.sku in (${inLijst})
`);

// Lengte uit de artikelnaam (bv. "Picknicktafel 240 cm KING") om de maat te toetsen.
function lengteUitNaam(naam) {
  const m = naam.match(/(\d{2,3})\s*cm/i);
  return m ? Number(m[1]) : null;
}

// De artikelnaam zoals die op de site mag staan.
// "Tekora" is als merk verboden (Peters beslissing bij bancsenteck): het merk is
// E-woodproducts. Ook de interne staartjes achter de pijpjes halen we eraf.
function schoneNaam(naam) {
  return naam
    .split('|')
    .map((d) => d.trim())
    .filter((d) => d && !/^tekora$/i.test(d))
    .join(' · ')
    .replace(/\s*®/g, '®')
    .replace(/\s+/g, ' ')
    .trim();
}

// Het variantgewicht uit Shopify is Peters eigen meting en wint van elke paklijst
// (reference-opgeblazen-gewichten), maar het staat soms bewust hoger als prijshendel.
// Daarom nooit als exact cijfer: op de fiche staat "ca.".
function gewichtZekerheid(bron) {
  if (!bron) return null;
  if (/paklijst/i.test(bron)) return 'fabrieksopgave';
  if (/GLS-appje|handmatig/i.test(bron)) return 'gewogen';
  return 'eigen opgave'; // Shopify-variantgewicht
}

const perSku = new Map();
for (const r of rijen) {
  const vorig = perSku.get(r.sku);
  const score = (x) => (x.l_cm ? 1 : 0) + (x.b_cm ? 1 : 0) + (x.h_cm ? 1 : 0) + (x.kg ? 1 : 0);
  if (!vorig || score(r) > score(vorig)) perSku.set(r.sku, r);
}

const nakijken = [];
const producten = {};

for (const lijn of LIJNEN) {
  producten[lijn.id] = [];
  for (const sku of lijn.skus) {
    const r = perSku.get(sku);
    if (!r) {
      nakijken.push({ sku, wat: 'staat niet in de productkern', gevolg: 'niet op de site' });
      continue;
    }
    if (r.status !== 'actief') {
      nakijken.push({ sku, wat: `status is "${r.status}"`, gevolg: 'niet op de site' });
      continue;
    }

    const specs = Object.fromEntries(
      (r.specs || '').split('|').filter(Boolean).map((s) => {
        const i = s.indexOf('=');
        return [s.slice(0, i), s.slice(i + 1)];
      })
    );

    // Toets: spreekt de lengte in de naam de gemeten lengte tegen?
    const naamLengte = lengteUitNaam(r.naam);
    let maat = null;
    if (r.l_cm && r.b_cm && r.h_cm) {
      if (naamLengte && Math.abs(naamLengte - r.l_cm) > 1) {
        nakijken.push({
          sku,
          wat: `naam zegt ${naamLengte} cm, de kern meet ${r.l_cm} cm (${r.maat_tekst})`,
          gevolg: 'maat weggelaten op de site',
        });
      } else {
        maat = { l: r.l_cm, b: r.b_cm, h: r.h_cm, bron: r.maat_bron, zekerheid: r.maat_zekerheid };
      }
    } else if (naamLengte) {
      // Alleen de lengte is gekend. Die tonen we, maar als lengte — niet als volledige maat.
      maat = { l: naamLengte, bron: r.maat_bron || 'naam', zekerheid: 'onvolledig' };
      nakijken.push({
        sku,
        wat: 'alleen de lengte is gekend (breedte en hoogte ontbreken in de kern)',
        gevolg: 'fiche toont alleen de lengte',
      });
    }

    producten[lijn.id].push({
      sku,
      naam: schoneNaam(r.naam),
      maat,
      gewicht_kg: r.kg ?? null,
      gewicht_zekerheid: r.kg ? gewichtZekerheid(r.gewicht_bron) : null,
      houtsoort: specs.houtsoort || null,
      plankdikte_mm: (() => {
        const m = r.naam.match(/(\d)[,.](\d)\s*cm\s*(dikte|plankdikte)/i);
        if (m) return Number(`${m[1]}.${m[2]}`) * 10;
        const m2 = r.naam.match(/(\d)\s*cm\s*(dikte|plankdikte)/i);
        return m2 ? Number(m2[1]) * 10 : null;
      })(),
    });
  }
}

mkdirSync(join(WORTEL, 'data'), { recursive: true });
writeFileSync(
  join(WORTEL, 'data/producten.json'),
  JSON.stringify(
    {
      _bron: 'ewood/kern/kern.db (alleen gelezen) via scripts/productdata.mjs',
      _gemaakt: new Date().toISOString().slice(0, 10),
      _regel: 'Alleen wat de kern weet. Geen aangevulde of geraden maten.',
      lijnen: producten,
    },
    null,
    2
  ) + '\n'
);

const aantal = Object.values(producten).reduce((n, l) => n + l.length, 0);
let md = `# Productgegevens die nagekeken moeten worden\n\n`;
md += `*Gemaakt door \`scripts/productdata.mjs\` op ${new Date().toISOString().slice(0, 10)}.*\n`;
md += `*${aantal} artikelen op de site; ${nakijken.length} punten hieronder.*\n\n`;
md += `De site laat weg wat niet zeker is. Elke regel hier is een gegeven dat in de productkern\n`;
md += `ontbreekt of zichzelf tegenspreekt — niet iets dat op de site fout staat.\n\n`;
md += `| artikel | wat er aan de hand is | gevolg |\n|---|---|---|\n`;
for (const n of nakijken) md += `| ${n.sku} | ${n.wat} | ${n.gevolg} |\n`;
writeFileSync(join(WORTEL, 'TE-BEVESTIGEN-producten.md'), md);

console.log(`✓ data/producten.json — ${aantal} artikelen in ${LIJNEN.length} lijnen`);
console.log(`✓ TE-BEVESTIGEN-producten.md — ${nakijken.length} punten voor Peter`);
