#!/usr/bin/env node
// Maakt een offerte en zet ze als webpagina klaar. Draait op Peters Mac, met de
// prijzen en kostprijzen uit de productkern — zo staat er nooit een prijs op een
// offerte die niemand gezien heeft.
//
//   node --env-file=../SEO-WOOD/.env scripts/offerte-maken.mjs \
//        --organisatie "Gemeente Lebbeke" --email jan@lebbeke.be --land BE \
//        --regel EP-K180:6 --regel EP-KKD140:2 \
//        [--contact "Jan Peeters"] [--btw BE0207.456.789] [--referentie "bestelbon 2026/114"]
//        [--prijs EP-K180:199.95] [--levering 0] [--dagen 30] [--taal nl]
//        [--btw-verlegd] [--opmerking "..."] [--confirm]
//
// Zonder --confirm toont het script alleen wat het zou doen (droogloop).
//
// De prijs is standaard de winkelprijs van dat land uit de kern. Wijk je ervan af met
// --prijs, dan controleert het script de marge en waarschuwt het als die onder de
// afgesproken vloer van 35 % zakt. Het weigert niets: jij beslist, maar je ziet het.

import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const KERN = join(process.env.HOME, 'Projects/ewood/kern/kern.db');
const WORKER = process.env.EPEUROPE_WORKER;
const SLEUTEL = process.env.EPEUROPE_BEHEER_SLEUTEL;
const ECHT = process.argv.includes('--confirm');

const ROUTERING = { BE: 'bv', NL: 'bv', LU: 'bv', DE: 'gmbh', AT: 'gmbh', FR: 'sarl', MC: 'sarl' };
const BTW = { BE: 21, NL: 21, LU: 17, DE: 19, AT: 20, FR: 20, MC: 20, IT: 22, ES: 21, DK: 25, FI: 25.5, SE: 25, GB: 20 };
const MARGE_VLOER = 35; // Peters regel, 20 sep 2026

function arg(naam, standaard = null) {
  const i = process.argv.indexOf(`--${naam}`);
  return i > -1 && process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[i + 1] : standaard;
}
function argAlle(naam) {
  const uit = [];
  process.argv.forEach((a, i) => {
    if (a === `--${naam}` && process.argv[i + 1]) uit.push(process.argv[i + 1]);
  });
  return uit;
}

function vraag(sql) {
  const uit = execFileSync('sqlite3', ['-json', '-readonly', KERN, sql], { encoding: 'utf8' }).trim();
  return uit ? JSON.parse(uit) : [];
}

const organisatie = arg('organisatie');
const email = arg('email');
const landIn = (arg('land') || '').toUpperCase();
const regelsIn = argAlle('regel');

if (!organisatie || !email || !landIn || !regelsIn.length) {
  console.error('Nodig: --organisatie, --email, --land en minstens één --regel SKU:aantal');
  console.error('Voorbeeld: --organisatie "Gemeente X" --email a@b.be --land BE --regel EP-K180:6');
  process.exit(1);
}
if (!BTW[landIn]) {
  console.error(`Onbekend land "${landIn}". Bekend: ${Object.keys(BTW).join(', ')}`);
  process.exit(1);
}

const firma = ROUTERING[landIn] || 'bv';
const taal = arg('taal') || (landIn === 'FR' || landIn === 'MC' ? 'fr' : landIn === 'DE' || landIn === 'AT' ? 'de' : 'nl');
const btwVerlegd = process.argv.includes('--btw-verlegd');
const btwPct = btwVerlegd ? 0 : BTW[landIn];
const dagen = Number(arg('dagen', '30'));

// Handmatige prijzen: --prijs SKU:bedrag
const handPrijs = Object.fromEntries(
  argAlle('prijs').map((p) => {
    const [sku, bedrag] = p.split(':');
    return [sku.toUpperCase(), Number(String(bedrag).replace(',', '.'))];
  })
);

const regels = [];
const waarschuwingen = [];

for (const r of regelsIn) {
  const [skuRuw, aantalRuw] = r.split(':');
  const sku = skuRuw.toUpperCase();
  const aantal = Number(aantalRuw);
  if (!aantal || aantal < 1) {
    console.error(`Aantal ontbreekt of is ongeldig in --regel ${r}`);
    process.exit(1);
  }

  const [art] = vraag(`
    select a.artikel_id, a.sku, a.naam, a.status,
           (select m.prijs from markt_aanbod m where m.artikel_id = a.artikel_id and m.land = '${landIn}') as marktprijs,
           (select m.prijs from markt_aanbod m where m.artikel_id = a.artikel_id and m.land = 'BE') as beprijs,
           (select k.bedrag from artikel_kost k where k.artikel_id = a.artikel_id) as kost
      from artikel a where upper(a.sku) = '${sku.replace(/'/g, "''")}'
  `);
  if (!art) {
    console.error(`Artikel ${sku} niet gevonden in de productkern.`);
    process.exit(1);
  }
  if (art.status !== 'actief') waarschuwingen.push(`${sku}: status is "${art.status}"`);

  const voorstel = handPrijs[sku] ?? art.marktprijs ?? art.beprijs;
  if (!voorstel) {
    console.error(`Geen prijs bekend voor ${sku} in ${landIn}. Geef er een met --prijs ${sku}:bedrag`);
    process.exit(1);
  }
  if (handPrijs[sku] == null && art.marktprijs == null) {
    waarschuwingen.push(`${sku}: geen ${landIn}-prijs in de kern, Belgische prijs gebruikt (€ ${art.beprijs})`);
  }

  // Marge toetsen: verkoop excl. btw tegenover de gelande kostprijs.
  if (art.kost) {
    const exclBtw = voorstel / (1 + BTW[landIn] / 100);
    const marge = ((exclBtw - art.kost) / exclBtw) * 100;
    if (marge < MARGE_VLOER) {
      waarschuwingen.push(
        `${sku}: marge ${marge.toFixed(0)} % ligt onder de vloer van ${MARGE_VLOER} % ` +
          `(prijs € ${voorstel.toFixed(2)} incl., kost € ${art.kost.toFixed(2)})`
      );
    }
  } else {
    waarschuwingen.push(`${sku}: geen kostprijs bekend, marge niet getoetst`);
  }

  regels.push({
    sku: art.sku,
    naam: art.naam.split('|').map((d) => d.trim()).filter((d) => d && !/^tekora$/i.test(d)).join(' · '),
    aantal,
    stukprijs: Number((voorstel / (1 + btwPct / 100)).toFixed(2)), // offerte rekent excl. btw
  });
}

const leveringIn = arg('levering');
const levering = leveringIn == null ? null : { bedrag: Number(leveringIn) || 0 };

const exclBtw = Number(
  (regels.reduce((s, r) => s + r.aantal * r.stukprijs, 0) + (levering?.bedrag || 0)).toFixed(2)
);
const btwBedrag = Number(((exclBtw * btwPct) / 100).toFixed(2));
const inclBtw = Number((exclBtw + btwBedrag).toFixed(2));

const vandaag = new Date();
const geldigTot = new Date(vandaag.getTime() + dagen * 86400000);
const nummer = `EPO-${vandaag.getFullYear()}${String(vandaag.getMonth() + 1).padStart(2, '0')}${String(
  vandaag.getDate()
).padStart(2, '0')}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
const geheim = [...crypto.getRandomValues(new Uint8Array(12))]
  .map((b) => b.toString(36))
  .join('')
  .slice(0, 16);

const offerte = {
  nummer,
  sleutel: geheim,
  firma,
  taal,
  land: landIn,
  klant: {
    organisatie,
    contact: arg('contact') || '',
    email,
    btw: arg('btw') || '',
    referentie: arg('referentie') || '',
    adres: arg('adres') ? arg('adres').split(';').map((s) => s.trim()) : null,
  },
  regels,
  levering,
  excl_btw: exclBtw,
  btw_pct: btwPct,
  btw_bedrag: btwBedrag,
  btw_verlegd: btwVerlegd,
  incl_btw: inclBtw,
  opmerking: arg('opmerking') || '',
  gemaakt_op: vandaag.toISOString(),
  geldig_tot: geldigTot.toISOString().slice(0, 10),
  status: 'open',
};

// ── tonen ───────────────────────────────────────────────────────────────────
const FIRMANAAM = { bv: 'E-Products Europe BV', gmbh: 'E-Products Deutschland GmbH', sarl: 'E-Products France SARL' };
console.log(`\nOfferte ${nummer}  ·  ${FIRMANAAM[firma]}  ·  ${landIn}  ·  taal ${taal}`);
console.log(`Voor: ${organisatie}${offerte.klant.contact ? ` (${offerte.klant.contact})` : ''} — ${email}`);
console.log(`Geldig tot: ${offerte.geldig_tot} (${dagen} dagen)\n`);
for (const r of regels) {
  console.log(
    `  ${String(r.aantal).padStart(3)} × ${r.naam.padEnd(48).slice(0, 48)} ` +
      `€ ${r.stukprijs.toFixed(2).padStart(8)} excl.  =  € ${(r.aantal * r.stukprijs).toFixed(2).padStart(9)}`
  );
}
if (levering) console.log(`      ${'levering'.padEnd(50)} ${' '.repeat(10)}      € ${levering.bedrag.toFixed(2).padStart(9)}`);
console.log(`\n  Totaal excl. btw: € ${exclBtw.toFixed(2)}`);
console.log(`  Btw ${btwVerlegd ? '(verlegd)' : `${btwPct}%`}: € ${btwBedrag.toFixed(2)}`);
console.log(`  Totaal incl. btw: € ${inclBtw.toFixed(2)}\n`);

if (waarschuwingen.length) {
  console.log('Let op:');
  for (const w of waarschuwingen) console.log(`  ⚠ ${w}`);
  console.log('');
}

if (!ECHT) {
  console.log('DROOGLOOP — er is niets klaargezet. Voeg --confirm toe om de offerte aan te maken.');
  process.exit(0);
}

if (!WORKER || !SLEUTEL) {
  console.error('EPEUROPE_WORKER en EPEUROPE_BEHEER_SLEUTEL ontbreken in .env');
  process.exit(1);
}

const r = await fetch(`${WORKER}/api/offertes`, {
  method: 'POST',
  headers: { 'x-beheer-sleutel': SLEUTEL, 'content-type': 'application/json' },
  body: JSON.stringify(offerte),
});
if (!r.ok) {
  console.error(`Klaarzetten mislukt: HTTP ${r.status} — ${(await r.text()).slice(0, 200)}`);
  process.exit(1);
}
const uit = await r.json();
console.log('✓ De offerte staat klaar. Stuur deze link naar de klant:\n');
console.log(`   ${uit.url}\n`);
console.log('De klant kan ze bekijken, afdrukken en aanvaarden. Je ziet in');
console.log('`node scripts/offertes.mjs` wanneer ze geopend en aanvaard is.');
