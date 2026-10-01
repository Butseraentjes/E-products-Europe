# e-productseurope.com — de koepelsite van de groep

De site van **E-Products Europe BV** (holding én Belgische werkmaatschappij) met de twee
dochters eronder: **E-Products Deutschland GmbH** en **E-Products France SARL**.

Het plan staat in `SEO-WOOD/PLAN-EPRODUCTSEUROPE.md`. Wat Peter nog moet bevestigen,
staat in `TE-BEVESTIGEN.md`.

## Waarvoor deze site dient

1. **Het gezicht van de groep** — wie we zijn, de drie vennootschappen, hun echte gegevens.
2. **De zakelijke balie** — één aanvraagformulier dat op het land van de klant naar de
   juiste vennootschap routeert. Dit is de enige laag met directe omzet: de Duitse en
   Franse winkels hebben vandaag geen offerte, geen bestelbon en geen btw-veld.
3. **De winkelkiezer** — welke winkel hoort bij welk land.
4. **De documentenkast** — maten, gewichten en houtsoort voor een bestek of een
   interne goedkeuring, uit de productkern.

Wat er bewust **niet** op staat: prijzen, productpagina's, een wederverkopersprogramma
en verkoop-zoekwoorden. Die horen in de webwinkels.

## Bouwen

```bash
node scripts/productdata.mjs   # productkern → data/producten.json + nakijklijst
node scripts/bouw.mjs          # data + teksten → public/
node scripts/vervangers.mjs    # de pagina's die de twee oude folders vervangen
```

`public/` is het resultaat: 16 pagina's (4 talen × 4 pagina's), een taalkiezer,
`robots.txt` en `sitemap.xml`. Alles statisch, geen bouwstap nodig bij het uitrollen.

Lokaal bekijken:

```bash
cd public && python3 -m http.server 8799
node tools/foto.mjs http://localhost:8799/nl/ /tmp/x.jpg --breed 390   # meldt overloop + JS-fouten
```

## Hoe een aanvraag verloopt

```
  bezoeker vult in
        │
        ▼
  POST /api/aanvraag        ← Pages Function (functions/api/[[pad]].js)
        │                     die worker/worker.mjs draait
        ├── valideert server-side (de browser krijgt nooit het laatste woord)
        ├── bepaalt de vennootschap uit het land
        ├── bewaart in KV  ← DIT is de waarheid
        └── probeert een mail naar support (mag mislukken)
        │
        ▼
  pagina zegt pas "gelukt" als de opslag gelukt is;
  anders toont ze het e-mailadres. Nooit een valse bevestiging.
        │
        ▼
  node scripts/aanvragen-ophalen.mjs --confirm   (op Peters Mac, met het Zendesk-token)
        └── maakt een Zendesk-ticket met tag epeurope-aanvraag + epeurope-<firma>
            en vinkt de aanvraag af in KV
```

Waarom zo: het oude formulier opende een `mailto:`-venster en meldde daarna **altijd**
"Request Sent!". In 16.728 Zendesk-tickets staat geen enkele aanvraag van dat formulier.
Hier kan een aanvraag niet verloren gaan, en het Zendesk-token blijft op Peters Mac.

## Uitrollen

**Cloudflare Pages** (gratis, geen slaapstand — zoals de andere zustersites):

1. Pages-project koppelen aan deze repo.
   Build command: `node scripts/productdata.mjs && node scripts/bouw.mjs`
   Output directory: `public`
   *(Draait de bouw op Cloudflare, dan is `kern.db` daar niet beschikbaar. Commit
   daarom `data/producten.json` mee en gebruik als build command alleen
   `node scripts/bouw.mjs`.)*
2. Settings → Functions:
   - KV-binding **AANVRAGEN** → een namespace (`npx wrangler kv namespace create AANVRAGEN`)
   - Secret **BEHEER_SLEUTEL** → een lang wachtwoord
   - Secret **EMAILJS_PRIVATE** → optioneel, voor de mailmelding
   - Variabelen **EMAILJS_PUBLIC**, **EMAILJS_SERVICE**, **EMAILJS_TPL_ADMIN**
3. Custom domain: `www.e-productseurope.com` (het Pages-project staat al klaar uit de
   Render-verhuizing; zie het geheugen `project-render-naar-pages`).
4. In `SEO-WOOD/.env`: `EPEUROPE_WORKER` en `EPEUROPE_BEHEER_SLEUTEL` voor het ophaalscript.

De aparte Worker in `worker/` is er voor wie liever los van Pages uitrolt
(`npx wrangler deploy`); de logica is dezelfde.

## Regels die in de code zitten

- Geen FSC of PEFC, in geen enkele taal.
- Nooit "wij maken/produceren" — wél "wij leveren zelf, met eigen bestelwagens".
- Levertermijnen alleen uit `data/groep.json › levering`; nooit een nieuw cijfer.
- Geen rekeningnummers (die stonden openbaar op de oude Belgische én Duitse pagina).
- Geen prijzen.
- Gewichten altijd met "ca." — het Shopify-gewicht is Peters eigen opgave en staat
  soms bewust hoger.
- Spreekt de productnaam de gemeten maat tegen, dan komt er "op aanvraag" te staan en
  gaat de rij naar `TE-BEVESTIGEN-producten.md`.
- Merknaam "Tekora" wordt uit de artikelnamen gehaald; het merk is E-woodproducts.

## Mappen

| map | wat |
|---|---|
| `data/` | `groep.json` (met de hand, bevestigde feiten) · `producten.json` (gegenereerd) |
| `src/` | `teksten.mjs` (alle vier de talen naast elkaar) · `stijl.css` |
| `scripts/` | bouwen, productdata, vervangers, aanvragen ophalen |
| `worker/` | de aanvraagverwerking (ook als losse Worker uit te rollen) |
| `functions/` | koppelt `/api/*` aan de Worker op Cloudflare Pages |
| `vervangers/` | index.html voor de twee oude folders → doorverwijzing naar de koepel |
| `public/` | het resultaat (niet in git) |
