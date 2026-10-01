#!/usr/bin/env node
// Haalt de zakelijke aanvragen van e-productseurope.com op en zet ze als ticket in
// Zendesk, met een tag per vennootschap. Draait op Peters Mac, zodat het Zendesk-token
// nergens in de cloud staat.
//
//   node --env-file=../SEO-WOOD/.env scripts/aanvragen-ophalen.mjs            (droogloop)
//   node --env-file=../SEO-WOOD/.env scripts/aanvragen-ophalen.mjs --confirm  (echt aanmaken)
//
// Nodig in SEO-WOOD/.env:
//   EPEUROPE_WORKER           bv. https://aanvragen-eproductseurope.<naam>.workers.dev
//   EPEUROPE_BEHEER_SLEUTEL   hetzelfde geheim als `wrangler secret put BEHEER_SLEUTEL`
//   ZENDESK_SUBDOMAIN · ZENDESK_EMAIL · ZENDESK_API_TOKEN   (bestaan al)
//
// Waarom dit bestaat: de aanvraag wordt in de Worker bewaard zodra de bezoeker verstuurt.
// Dit script is de brug naar support. Gaat de mailmelding onderweg verloren, dan staat
// de aanvraag er nog steeds — niets valt tussen de plooien, zoals bij het oude formulier.

const ECHT = process.argv.includes('--confirm');

const WORKER = process.env.EPEUROPE_WORKER;
const SLEUTEL = process.env.EPEUROPE_BEHEER_SLEUTEL;
const ZD = {
  sub: process.env.ZENDESK_SUBDOMAIN,
  email: process.env.ZENDESK_EMAIL,
  token: process.env.ZENDESK_API_TOKEN,
};

const ontbreekt = [
  !WORKER && 'EPEUROPE_WORKER',
  !SLEUTEL && 'EPEUROPE_BEHEER_SLEUTEL',
  !ZD.sub && 'ZENDESK_SUBDOMAIN',
  !ZD.email && 'ZENDESK_EMAIL',
  !ZD.token && 'ZENDESK_API_TOKEN',
].filter(Boolean);
if (ontbreekt.length) {
  console.error(`Ontbreekt in .env: ${ontbreekt.join(', ')}`);
  process.exit(1);
}

const SOORTNAAM = {
  gemeente: 'gemeente of overheid',
  school: 'school of kinderopvang',
  vereniging: 'vereniging',
  camping: 'camping of recreatiedomein',
  horeca: 'horeca',
  bedrijf: 'bedrijf',
  andere: 'andere',
};
const WANNEERNAAM = {
  zodra: 'zo snel mogelijk',
  datum: 'rond een bepaalde datum (zie bericht)',
  voorjaar: 'in het voorjaar',
  weetniet: 'nog niet bekend',
};
const NODIGNAAM = {
  offerte: 'een offerte',
  bestelbon: 'een bestelbon of factuur op naam',
  fiche: 'technische fiches',
  bestek: 'stukken voor een bestek of overheidsopdracht',
  bezoek: 'een bezoek aan de toonzaal',
};

async function haalAanvragen() {
  const r = await fetch(`${WORKER}/api/aanvragen?status=nieuw`, {
    headers: { 'x-beheer-sleutel': SLEUTEL },
  });
  if (!r.ok) throw new Error(`aanvragen ophalen: HTTP ${r.status}`);
  const d = await r.json();
  return d.aanvragen || [];
}

function ticketTekst(a) {
  const r = [];
  r.push(`Zakelijke aanvraag via e-productseurope.com — ${a.nummer}`);
  r.push('');
  r.push(`Behandelende vennootschap: ${a.firmanaam}`);
  if (a.buiten_leveringsgebied) {
    r.push('LET OP: dit land valt buiten ons gewone leveringsgebied — eerst bekijken hoe de levering kan lopen.');
  }
  r.push('');
  r.push(`Organisatie:  ${a.organisatie}${a.soort ? ` (${SOORTNAAM[a.soort] || a.soort})` : ''}`);
  r.push(`Btw-nummer:   ${a.btw || '(niet opgegeven)'}`);
  r.push(`Contact:      ${a.naam}`);
  r.push(`E-mail:       ${a.email}`);
  r.push(`Telefoon:     ${a.telefoon || '(niet opgegeven)'}`);
  r.push(`Land:         ${a.land}`);
  r.push(`Taal:         ${a.taal}`);
  r.push('');
  r.push(`Gevraagd:     ${a.producten}`);
  r.push(`Aantal:       ${a.aantal || '(niet opgegeven)'}`);
  r.push(`Levering:     ${WANNEERNAAM[a.wanneer] || '(niet opgegeven)'}`);
  r.push(`Nodig:        ${(a.nodig || []).map((n) => NODIGNAAM[n] || n).join(', ') || '(niet aangegeven)'}`);
  r.push('');
  r.push('Bericht van de klant:');
  r.push(a.bericht || '(geen bericht)');
  r.push('');
  r.push(`Ontvangen: ${a.ontvangen}`);
  return r.join('\n');
}

async function maakTicket(a) {
  const auth = Buffer.from(`${ZD.email}/token:${ZD.token}`).toString('base64');
  const ticket = {
    ticket: {
      subject: `Zakelijke aanvraag ${a.organisatie} — ${a.nummer}`,
      comment: { body: ticketTekst(a), public: false },
      requester: { name: a.naam, email: a.email },
      tags: ['epeurope-aanvraag', `epeurope-${a.firma}`, a.soort ? `epeurope-${a.soort}` : null].filter(Boolean),
      external_id: a.nummer,
      priority: 'normal',
    },
  };
  const r = await fetch(`https://${ZD.sub}.zendesk.com/api/v2/tickets.json`, {
    method: 'POST',
    headers: { Authorization: `Basic ${auth}`, 'content-type': 'application/json' },
    body: JSON.stringify(ticket),
  });
  if (!r.ok) throw new Error(`ticket aanmaken: HTTP ${r.status} — ${(await r.text()).slice(0, 300)}`);
  const d = await r.json();
  return d.ticket.id;
}

async function afvinken(nummer, ticketId) {
  const r = await fetch(`${WORKER}/api/afvinken`, {
    method: 'POST',
    headers: { 'x-beheer-sleutel': SLEUTEL, 'content-type': 'application/json' },
    body: JSON.stringify({ nummer, ticket: String(ticketId) }),
  });
  if (!r.ok) throw new Error(`afvinken: HTTP ${r.status}`);
}

const aanvragen = await haalAanvragen();
if (!aanvragen.length) {
  console.log('Geen nieuwe aanvragen.');
  process.exit(0);
}

console.log(`${aanvragen.length} nieuwe aanvraag(en)${ECHT ? '' : ' — DROOGLOOP, er wordt niets aangemaakt'}\n`);

for (const a of aanvragen) {
  console.log(`${a.nummer}  ${a.firmanaam}  ${a.land}  ${a.organisatie} — ${a.producten}`);
  if (!ECHT) continue;
  try {
    const id = await maakTicket(a);
    await afvinken(a.nummer, id);
    console.log(`   → Zendesk-ticket ${id} aangemaakt en afgevinkt`);
  } catch (e) {
    // Niet afvinken bij een fout: dan komt de aanvraag de volgende keer opnieuw langs.
    console.error(`   ✗ ${e.message}`);
  }
}

if (!ECHT) console.log('\nMet --confirm worden de tickets echt aangemaakt.');
