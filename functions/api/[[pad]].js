// Cloudflare Pages Function: laat /api/* op het eigen domein werken.
//
// De logica staat in worker/worker.mjs, zodat er één plaats is waar de aanvragen
// behandeld worden. Hier wordt die enkel aangesloten op Pages, met dezelfde paden.
//
// In het Pages-project instellen (Settings → Functions):
//   · KV-binding   AANVRAGEN        → dezelfde namespace als in worker/wrangler.toml
//   · Secret       BEHEER_SLEUTEL   → zelfde geheim als het ophaalscript gebruikt
//   · Secret       EMAILJS_PRIVATE  → optioneel, voor de mailmelding
//   · Variabelen   EMAILJS_PUBLIC · EMAILJS_SERVICE · EMAILJS_TPL_ADMIN
//
// Zonder deze bindingen antwoordt /api/aanvraag netjes met een foutmelding en zegt
// de pagina eerlijk dat het niet gelukt is — ze doet nooit alsof.

import worker from '../../worker/worker.mjs';

export const onRequest = (context) => worker.fetch(context.request, context.env);
