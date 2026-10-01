// Cloudflare Worker voor de zakelijke aanvragen van e-productseurope.com.
//
// Waarom een worker en niet enkel een mail uit de pagina: de oude site stuurde een
// `mailto:`-link en zei daarna ALTIJD "Request Sent!". In 16.728 tickets staat geen
// enkele aanvraag van dat formulier. Hier is de opslag in KV de waarheid: de pagina
// krijgt pas "ok" als de aanvraag écht bewaard is. De melding per mail mag daarna
// mislukken zonder dat de aanvraag verloren is — `scripts/aanvragen-ophalen.mjs`
// haalt ze op en zet ze in Zendesk.
//
// Uitrollen:  npx wrangler deploy        (vanuit deze map)
// Geheim:     npx wrangler secret put BEHEER_SLEUTEL
//             npx wrangler secret put EMAILJS_PRIVATE   (optioneel, zie meldSupport)

const MAX = { kort: 120, lang: 2000 };

// Welke vennootschap een aanvraag behandelt. Moet gelijk blijven met
// data/groep.json › routering — die van de site is enkel om het de bezoeker te tonen;
// deze hier beslist.
const ROUTERING = {
  BE: 'bv', NL: 'bv', LU: 'bv',
  DE: 'gmbh', AT: 'gmbh',
  FR: 'sarl', MC: 'sarl',
};

const FIRMANAAM = {
  bv: 'E-Products Europe BV',
  gmbh: 'E-Products Deutschland GmbH',
  sarl: 'E-Products France SARL',
};

const SOORTEN = ['gemeente', 'school', 'vereniging', 'camping', 'horeca', 'bedrijf', 'andere'];
const WANNEER = ['zodra', 'datum', 'voorjaar', 'weetniet'];
const NODIG = ['offerte', 'bestelbon', 'fiche', 'bestek', 'bezoek'];
const TALEN = ['nl', 'fr', 'de', 'en'];

function kuis(waarde, max = MAX.kort) {
  if (typeof waarde !== 'string') return '';
  // Stuurtekens eruit (ook de nulbyte), witruimte normaliseren, afkappen.
  return waarde.replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
}

function antwoord(data, status = 200, origin = '') {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'access-control-allow-origin': toegestaneOorsprong(origin),
      'cache-control': 'no-store',
    },
  });
}

// Alleen onze eigen domeinen mogen het formulier gebruiken.
function toegestaneOorsprong(origin) {
  const toegestaan = [
    'https://www.e-productseurope.com',
    'https://e-productseurope.com',
    'http://localhost:8788',
    'http://localhost:3000',
  ];
  return toegestaan.includes(origin) ? origin : toegestaan[0];
}

function aanvraagnummer() {
  // Kort, leesbaar en oplopend in de tijd: EPA-<base36 van de tijd>-<4 willekeurig>.
  const tijd = Date.now().toString(36).toUpperCase();
  const toeval = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `EPA-${tijd}-${toeval}`;
}

async function aanvraag(req, env) {
  const origin = req.headers.get('origin') || '';
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return antwoord({ ok: false, fout: 'geen geldige gegevens' }, 400, origin);
  }

  const a = {
    taal: TALEN.includes(body.taal) ? body.taal : 'nl',
    land: kuis(body.land, 2).toUpperCase(),
    soort: SOORTEN.includes(body.soort) ? body.soort : '',
    organisatie: kuis(body.organisatie),
    btw: kuis(body.btw, 40),
    naam: kuis(body.naam),
    email: kuis(body.email, 160).toLowerCase(),
    telefoon: kuis(body.telefoon, 40),
    producten: kuis(body.producten, 300),
    aantal: kuis(body.aantal, 20),
    wanneer: WANNEER.includes(body.wanneer) ? body.wanneer : '',
    nodig: Array.isArray(body.nodig) ? body.nodig.filter((n) => NODIG.includes(n)) : [],
    bericht: kuis(body.bericht, MAX.lang),
  };

  // Server-side toetsen; de browser mag nooit het laatste woord hebben.
  const ontbreekt = [];
  if (!a.organisatie) ontbreekt.push('organisatie');
  if (!a.naam) ontbreekt.push('naam');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(a.email)) ontbreekt.push('email');
  if (!a.producten) ontbreekt.push('producten');
  if (!/^[A-Z]{2}$/.test(a.land)) ontbreekt.push('land');
  if (ontbreekt.length) {
    return antwoord({ ok: false, fout: 'onvolledig', velden: ontbreekt }, 400, origin);
  }

  const firma = ROUTERING[a.land] || 'bv';
  const dossier = {
    ...a,
    nummer: aanvraagnummer(),
    firma,
    firmanaam: FIRMANAAM[firma],
    buiten_leveringsgebied: !ROUTERING[a.land],
    ontvangen: new Date().toISOString(),
    status: 'nieuw',
  };

  // De opslag is de waarheid. Lukt dit niet, dan zeggen we dat eerlijk,
  // zodat de bezoeker ons gewoon kan mailen in plaats van te denken dat het goed zat.
  if (!env.AANVRAGEN) {
    return antwoord({ ok: false, fout: 'opslag niet ingesteld' }, 503, origin);
  }
  try {
    await env.AANVRAGEN.put(dossier.nummer, JSON.stringify(dossier), {
      expirationTtl: 60 * 60 * 24 * 365 * 2,
      metadata: { firma, land: a.land, status: 'nieuw', ontvangen: dossier.ontvangen },
    });
  } catch {
    return antwoord({ ok: false, fout: 'opslag mislukt' }, 503, origin);
  }

  // Melding per mail is een extraatje: mislukt ze, dan blijft de aanvraag staan
  // en pikt het ophaalscript ze op.
  await meldSupport(dossier, env).catch(() => {});

  return antwoord({ ok: true, nummer: dossier.nummer, firma: dossier.firmanaam }, 200, origin);
}

// Stuurt een melding naar support. Werkt alleen als EMAILJS_PRIVATE is ingesteld
// (EmailJS weigert server-aanroepen zonder private sleutel). Zonder dat geheim
// draait alles gewoon door via het ophaalscript — vandaar de stille terugval.
async function meldSupport(dossier, env) {
  if (!env.EMAILJS_PRIVATE || !env.EMAILJS_SERVICE || !env.EMAILJS_TPL_ADMIN) return;
  const regels = [
    `Aanvraagnummer: ${dossier.nummer}`,
    `Vennootschap:   ${dossier.firmanaam}`,
    `Land:           ${dossier.land}${dossier.buiten_leveringsgebied ? ' (buiten ons leveringsgebied)' : ''}`,
    `Organisatie:    ${dossier.organisatie}${dossier.soort ? ` (${dossier.soort})` : ''}`,
    `Btw-nummer:     ${dossier.btw || '-'}`,
    `Contact:        ${dossier.naam} · ${dossier.email}${dossier.telefoon ? ` · ${dossier.telefoon}` : ''}`,
    `Taal:           ${dossier.taal}`,
    '',
    `Gevraagd:       ${dossier.producten}${dossier.aantal ? ` — ${dossier.aantal} stuks` : ''}`,
    `Levering:       ${dossier.wanneer || '-'}`,
    `Nodig:          ${dossier.nodig.join(', ') || '-'}`,
    '',
    dossier.bericht || '(geen bericht)',
  ].join('\n');

  await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      service_id: env.EMAILJS_SERVICE,
      template_id: env.EMAILJS_TPL_ADMIN,
      user_id: env.EMAILJS_PUBLIC,
      accessToken: env.EMAILJS_PRIVATE,
      template_params: {
        to_email: 'support@e-woodproducts.com',
        subject: `Zakelijke aanvraag ${dossier.nummer} — ${dossier.organisatie} (${dossier.firmanaam})`,
        message: regels,
        reply_to: dossier.email,
      },
    }),
  });
}

// Lijst voor het ophaalscript op Peters Mac. Met ?status=nieuw enkel de onbehandelde.
async function lijst(req, env) {
  const u = new URL(req.url);
  const sleutel = u.searchParams.get('sleutel') || req.headers.get('x-beheer-sleutel');
  if (!env.BEHEER_SLEUTEL || sleutel !== env.BEHEER_SLEUTEL) {
    return new Response('niet toegelaten', { status: 401 });
  }
  const alleenNieuw = u.searchParams.get('status') === 'nieuw';
  const uit = [];
  let cursor;
  do {
    const blad = await env.AANVRAGEN.list({ cursor, limit: 1000 });
    for (const k of blad.keys) {
      if (alleenNieuw && k.metadata?.status && k.metadata.status !== 'nieuw') continue;
      const w = await env.AANVRAGEN.get(k.name, 'json');
      if (w && (!alleenNieuw || w.status === 'nieuw')) uit.push(w);
    }
    cursor = blad.list_complete ? null : blad.cursor;
  } while (cursor);
  uit.sort((a, b) => (a.ontvangen < b.ontvangen ? -1 : 1));
  return Response.json({ ok: true, aantal: uit.length, aanvragen: uit });
}

// Het ophaalscript meldt hier dat een aanvraag in Zendesk staat.
async function afvinken(req, env) {
  const sleutel = req.headers.get('x-beheer-sleutel');
  if (!env.BEHEER_SLEUTEL || sleutel !== env.BEHEER_SLEUTEL) {
    return new Response('niet toegelaten', { status: 401 });
  }
  const b = await req.json().catch(() => ({}));
  const nummer = kuis(b.nummer, 40);
  const ticket = kuis(b.ticket, 40);
  if (!nummer) return Response.json({ ok: false, fout: 'nummer ontbreekt' }, { status: 400 });

  const w = await env.AANVRAGEN.get(nummer, 'json');
  if (!w) return Response.json({ ok: false, fout: 'onbekend nummer' }, { status: 404 });

  const nieuw = { ...w, status: 'in-zendesk', zendesk_ticket: ticket || null, verwerkt: new Date().toISOString() };
  await env.AANVRAGEN.put(nummer, JSON.stringify(nieuw), {
    expirationTtl: 60 * 60 * 24 * 365 * 2,
    metadata: { firma: nieuw.firma, land: nieuw.land, status: 'in-zendesk', ontvangen: nieuw.ontvangen },
  });
  return Response.json({ ok: true, nummer, status: nieuw.status });
}

export default {
  async fetch(req, env) {
    const u = new URL(req.url);
    const origin = req.headers.get('origin') || '';

    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'access-control-allow-origin': toegestaneOorsprong(origin),
          'access-control-allow-methods': 'POST, OPTIONS',
          'access-control-allow-headers': 'content-type',
          'access-control-max-age': '86400',
        },
      });
    }

    if (u.pathname === '/api/aanvraag' && req.method === 'POST') return aanvraag(req, env);
    if (u.pathname === '/api/aanvragen' && req.method === 'GET') return lijst(req, env);
    if (u.pathname === '/api/afvinken' && req.method === 'POST') return afvinken(req, env);

    return new Response('niet gevonden', { status: 404 });
  },
};
