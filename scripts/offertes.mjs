#!/usr/bin/env node
// De opvolglijst: welke offertes staan open, wie heeft ze bekeken, wie niet.
//
//   node --env-file=../SEO-WOOD/.env scripts/offertes.mjs
//   node --env-file=../SEO-WOOD/.env scripts/offertes.mjs --open     (alleen wat nog loopt)
//
// Waarom dit bestaat: 61 % van de winteroffertes van organisaties wordt vandaag nooit
// een order, en 16 % van wie wél bestelt doet dat pas na twee maanden. Niemand volgt
// die op, omdat niemand weet wie zijn offerte nog in het dossier heeft liggen.

const WORKER = process.env.EPEUROPE_WORKER;
const SLEUTEL = process.env.EPEUROPE_BEHEER_SLEUTEL;
const ALLEEN_OPEN = process.argv.includes('--open');

if (!WORKER || !SLEUTEL) {
  console.error('EPEUROPE_WORKER en EPEUROPE_BEHEER_SLEUTEL ontbreken in .env');
  process.exit(1);
}

const r = await fetch(`${WORKER}/api/offertes`, { headers: { 'x-beheer-sleutel': SLEUTEL } });
if (!r.ok) {
  console.error(`Ophalen mislukt: HTTP ${r.status}`);
  process.exit(1);
}
const { offertes } = await r.json();
if (!offertes.length) {
  console.log('Er staan nog geen offertes klaar.');
  process.exit(0);
}

const FIRMA = { bv: 'BE', gmbh: 'DE', sarl: 'FR' };
const vandaag = new Date().toISOString().slice(0, 10);
const dagenTussen = (a, b) => Math.round((new Date(b) - new Date(a)) / 86400000);

function stand(o) {
  if (o.aanvaard_op) return { label: '✓ aanvaard', orde: 0 };
  if (o.geldig_tot < vandaag) return { label: '· vervallen', orde: 3 };
  if (!o.geopend_op) return { label: '… niet geopend', orde: 1 };
  return { label: '👀 bekeken', orde: 2 };
}

const rijen = offertes
  .map((o) => ({ o, s: stand(o) }))
  .filter(({ s }) => !ALLEEN_OPEN || s.orde === 1 || s.orde === 2)
  .sort((a, b) => a.s.orde - b.s.orde || (a.o.gemaakt_op < b.o.gemaakt_op ? 1 : -1));

let open = 0;
let bekeken = 0;
let aanvaard = 0;
let waardeOpen = 0;
let waardeAanvaard = 0;

console.log('');
for (const { o, s } of rijen) {
  const leeftijd = dagenTussen(o.gemaakt_op, new Date().toISOString());
  const bedrag = `€ ${Number(o.incl_btw).toFixed(2)}`;
  console.log(
    `${s.label.padEnd(15)} ${o.nummer}  ${FIRMA[o.firma] || '??'}  ${bedrag.padStart(11)}  ` +
      `${String(o.klant.organisatie).slice(0, 34).padEnd(34)} ${leeftijd}d`
  );
  if (!o.aanvaard_op && o.geldig_tot >= vandaag) {
    open++;
    waardeOpen += Number(o.incl_btw);
    if (o.geopend_op) bekeken++;
    // De aanleiding om te bellen: bekeken maar niet aanvaard, en al even geleden.
    if (o.geopend_op && leeftijd >= 7) {
      console.log(`                ↳ bekeken op ${o.geopend_op.slice(0, 10)}${o.keer_geopend > 1 ? ` (${o.keer_geopend}×)` : ''} — geldig tot ${o.geldig_tot}, de moeite om na te bellen`);
    }
    if (!o.geopend_op && leeftijd >= 3) {
      console.log(`                ↳ nog niet geopend — link wel aangekomen? (${o.klant.email || 'geen e-mail'})`);
    }
  }
  if (o.aanvaard_op) {
    aanvaard++;
    waardeAanvaard += Number(o.incl_btw);
  }
}

console.log('');
console.log(`${offertes.length} offertes · ${open} lopend (€ ${waardeOpen.toFixed(2)}) · ${bekeken} daarvan bekeken · ${aanvaard} aanvaard (€ ${waardeAanvaard.toFixed(2)})`);
if (open) {
  const pct = Math.round((bekeken / open) * 100);
  console.log(`Van de lopende offertes is ${pct} % geopend door de klant.`);
}
