// Fase 5 — de offerte als webpagina.
//
// Waarom geen PDF in een mailbox: een gemeente of school heeft een document nodig dat
// ze in haar eigen dossier kan stoppen en waar ze op kan terugkomen als het budget er
// is. Een webpagina met een nummer, een geldigheidsdatum en een knop doet dat, en laat
// ons bovendien zien wie zijn offerte geopend heeft — vandaag wordt 61 % van de
// winteroffertes van organisaties nooit een order en belt niemand na.
//
// De offerte wordt gemaakt met scripts/offerte-maken.mjs (op Peters Mac, met de
// prijzen uit de productkern) en hier alleen getoond. Niets wordt hier berekend wat
// support niet zelf heeft goedgekeurd.

const FIRMA = {
  bv: {
    naam: 'E-Products Europe BV',
    adres: ['Patijntjestraat 107', '9000 Gent', 'België'],
    btwLabel: 'BTW',
    btw: 'BE 0500.621.156',
    email: 'support@e-woodproducts.com',
  },
  gmbh: {
    naam: 'E-Products Deutschland GmbH',
    adres: ['Hoffmannallee 41–51', '47533 Kleve', 'Deutschland'],
    btwLabel: 'USt-IdNr.',
    btw: 'DE298706463',
    email: 'support@e-woodproducts.com',
  },
  sarl: {
    naam: 'E-Products France SARL',
    adres: ['7 chemin des Filatiers', '62223 Sainte Catherine', 'France'],
    btwLabel: 'TVA',
    btw: 'FR 25 818931396',
    email: 'support@e-woodproducts.com',
  },
};

const T = {
  nl: {
    offerte: 'Offerte', nummer: 'Offertenummer', uwRef: 'Uw referentie', inbegrepen: 'inbegrepen', datum: 'Datum', geldig: 'Geldig tot',
    voor: 'Voor', artikel: 'Artikel', aantal: 'Aantal', stuk: 'Prijs per stuk',
    totaal: 'Totaal', excl: 'Totaal excl. btw', btwBedrag: 'Btw', incl: 'Totaal incl. btw',
    levering: 'Levering', aanvaarden: 'Deze offerte aanvaarden',
    aanvaardKop: 'Bedankt — uw aanvaarding is genoteerd',
    aanvaardTekst: 'We nemen contact met u op om de levering af te spreken. U krijgt een bevestiging per e-mail.',
    alAanvaard: 'U hebt deze offerte al aanvaard op {datum}.',
    verlopen: 'Deze offerte is vervallen op {datum}. Vraag gerust een nieuwe aan — de prijzen kunnen intussen gewijzigd zijn.',
    vraag: 'Vragen over deze offerte? Antwoord op de e-mail of mail ons op',
    opmerking: 'Opmerking', print: 'Afdrukken', bezig: 'Bezig…',
    mislukt: 'Het is niet gelukt om uw aanvaarding door te geven. Mail ons gerust op',
    btwVerlegd: 'Btw verlegd — intracommunautaire levering',
  },
  fr: {
    offerte: 'Devis', nummer: 'Numéro de devis', uwRef: 'Votre référence', inbegrepen: 'inclus', datum: 'Date', geldig: 'Valable jusqu’au',
    voor: 'Pour', artikel: 'Article', aantal: 'Quantité', stuk: 'Prix unitaire',
    totaal: 'Total', excl: 'Total hors TVA', btwBedrag: 'TVA', incl: 'Total TTC',
    levering: 'Livraison', aanvaarden: 'Accepter ce devis',
    aanvaardKop: 'Merci — votre acceptation est enregistrée',
    aanvaardTekst: 'Nous vous contactons pour convenir de la livraison. Vous recevrez une confirmation par e-mail.',
    alAanvaard: 'Vous avez déjà accepté ce devis le {datum}.',
    verlopen: 'Ce devis a expiré le {datum}. N’hésitez pas à en demander un nouveau — les prix ont pu changer entre-temps.',
    vraag: 'Des questions sur ce devis ? Répondez à l’e-mail ou écrivez-nous à',
    opmerking: 'Remarque', print: 'Imprimer', bezig: 'En cours…',
    mislukt: 'Votre acceptation n’a pas pu être transmise. Écrivez-nous à',
    btwVerlegd: 'Autoliquidation de la TVA — livraison intracommunautaire',
  },
  de: {
    offerte: 'Angebot', nummer: 'Angebotsnummer', uwRef: 'Ihre Referenz', inbegrepen: 'inbegriffen', datum: 'Datum', geldig: 'Gültig bis',
    voor: 'Für', artikel: 'Artikel', aantal: 'Menge', stuk: 'Einzelpreis',
    totaal: 'Gesamt', excl: 'Summe netto', btwBedrag: 'MwSt.', incl: 'Summe brutto',
    levering: 'Lieferung', aanvaarden: 'Dieses Angebot annehmen',
    aanvaardKop: 'Danke — Ihre Annahme ist erfasst',
    aanvaardTekst: 'Wir melden uns, um die Lieferung abzustimmen. Sie erhalten eine Bestätigung per E-Mail.',
    alAanvaard: 'Sie haben dieses Angebot bereits am {datum} angenommen.',
    verlopen: 'Dieses Angebot ist am {datum} abgelaufen. Fragen Sie gerne ein neues an — die Preise können sich geändert haben.',
    vraag: 'Fragen zu diesem Angebot? Antworten Sie auf die E-Mail oder schreiben Sie an',
    opmerking: 'Anmerkung', print: 'Drucken', bezig: 'Läuft…',
    mislukt: 'Ihre Annahme konnte nicht übermittelt werden. Schreiben Sie uns an',
    btwVerlegd: 'Steuerschuldnerschaft des Leistungsempfängers — innergemeinschaftliche Lieferung',
  },
  en: {
    offerte: 'Quote', nummer: 'Quote number', uwRef: 'Your reference', inbegrepen: 'included', datum: 'Date', geldig: 'Valid until',
    voor: 'For', artikel: 'Item', aantal: 'Quantity', stuk: 'Unit price',
    totaal: 'Total', excl: 'Total excl. VAT', btwBedrag: 'VAT', incl: 'Total incl. VAT',
    levering: 'Delivery', aanvaarden: 'Accept this quote',
    aanvaardKop: 'Thank you — your acceptance is recorded',
    aanvaardTekst: 'We will contact you to arrange delivery. You will receive a confirmation by email.',
    alAanvaard: 'You already accepted this quote on {datum}.',
    verlopen: 'This quote expired on {datum}. Feel free to ask for a new one — prices may have changed since.',
    vraag: 'Questions about this quote? Reply to the email or write to us at',
    opmerking: 'Note', print: 'Print', bezig: 'Working…',
    mislukt: 'Your acceptance could not be sent. Please email us at',
    btwVerlegd: 'VAT reverse charge — intra-Community supply',
  },
};

const esc = (s) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function bedrag(n, taal) {
  const s = Number(n).toFixed(2);
  return taal === 'en' ? `€ ${s}` : `€ ${s.replace('.', ',')}`;
}

function datum(iso, taal) {
  const d = new Date(iso);
  const maanden = {
    nl: ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'],
    fr: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
    de: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  };
  return `${d.getUTCDate()} ${maanden[taal][d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

// De pagina die de klant ziet. Bewust één bestand zonder externe verwijzingen:
// een offerte moet ook werken als ze maanden later uit een dossier wordt opengeklikt.
export function offertePagina(o, stand) {
  const taal = T[o.taal] ? o.taal : 'nl';
  const t = T[taal];
  const f = FIRMA[o.firma] || FIRMA.bv;
  const verlopen = stand === 'verlopen';
  const aanvaard = !!o.aanvaard_op;

  const regels = o.regels
    .map(
      (r) => `        <tr>
          <td>${esc(r.naam)}${r.sku ? `<br><span class="klein">${esc(r.sku)}</span>` : ''}</td>
          <td class="rechts">${esc(r.aantal)}</td>
          <td class="rechts">${bedrag(r.stukprijs, taal)}</td>
          <td class="rechts">${bedrag(r.aantal * r.stukprijs, taal)}</td>
        </tr>`
    )
    .join('\n');

  const leverregel = o.levering
    ? `          <tr><td colspan="3">${esc(t.levering)}</td><td class="rechts">${
        o.levering.bedrag
          ? bedrag(o.levering.bedrag, taal)
          : esc(o.levering.tekst || t.inbegrepen)
      }</td></tr>`
    : '';

  const btwRegel = o.btw_verlegd
    ? `        <tr><td colspan="3">${esc(t.btwBedrag)}</td><td class="rechts">${esc(t.btwVerlegd)}</td></tr>`
    : `        <tr><td colspan="3">${esc(t.btwBedrag)} ${o.btw_pct}%</td><td class="rechts">${bedrag(o.btw_bedrag, taal)}</td></tr>`;

  const melding = aanvaard
    ? `<div class="melding melding--goed">${esc(t.alAanvaard.replace('{datum}', datum(o.aanvaard_op, taal)))}</div>`
    : verlopen
    ? `<div class="melding melding--let">${esc(t.verlopen.replace('{datum}', datum(o.geldig_tot, taal)))}</div>`
    : '';

  const knop =
    !aanvaard && !verlopen
      ? `      <div class="knopbalk">
        <button class="knop" id="aanvaardKnop" type="button">${esc(t.aanvaarden)}</button>
        <button class="knop knop--rand" type="button" onclick="window.print()">${esc(t.print)}</button>
      </div>
      <div class="melding melding--fout" id="foutMelding" hidden></div>`
      : `      <div class="knopbalk"><button class="knop knop--rand" type="button" onclick="window.print()">${esc(t.print)}</button></div>`;

  return `<!doctype html>
<html lang="${taal}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(t.offerte)} ${esc(o.nummer)} — ${esc(f.naam)}</title>
<meta name="robots" content="noindex, nofollow">
<style>
  :root{--accent:#ce9766;--accent-donker:#b8824d;--tekst:#3c2f1a;--zacht:#6b5d48;--cream:#f8f3e8;--rand:#e8e2d9}
  *,*::before,*::after{box-sizing:border-box}
  body{margin:0;padding:24px 16px 64px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
       font-size:16px;line-height:1.6;color:var(--tekst);background:var(--cream)}
  .blad{max-width:800px;margin:0 auto;background:#fff;border:1px solid var(--rand);border-radius:12px;padding:32px}
  .kop{display:flex;justify-content:space-between;gap:24px;flex-wrap:wrap;align-items:flex-start;
       border-bottom:2px solid var(--accent);padding-bottom:20px;margin-bottom:24px}
  .teken{width:44px;height:44px;border-radius:10px;background:var(--accent);color:#fff;font-weight:700;
         display:grid;place-items:center;margin-bottom:10px}
  h1{font-size:24px;margin:0 0 4px}
  .nr{font-size:15px;color:var(--zacht)}
  address{font-style:normal;font-size:14px;color:var(--zacht);text-align:right}
  .gegevens{display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));margin-bottom:24px}
  .gegevens h2{font-size:13px;text-transform:uppercase;letter-spacing:.5px;color:var(--accent-donker);margin:0 0 6px}
  .gegevens p{margin:0;font-size:15px}
  table{border-collapse:collapse;width:100%;font-size:15px;margin:8px 0 0}
  th,td{text-align:left;padding:10px 8px;border-bottom:1px solid var(--rand);vertical-align:top}
  thead th{background:var(--accent);color:#fff;font-weight:600}
  .rechts{text-align:right;white-space:nowrap}
  tfoot td{border-bottom:none;padding-top:8px}
  tfoot tr:last-child td{border-top:2px solid var(--accent);font-weight:700;font-size:17px}
  .klein{font-size:12px;color:var(--zacht)}
  .melding{border-radius:9px;padding:12px 14px;margin:20px 0;border:1px solid var(--rand);border-left:4px solid var(--accent);background:var(--cream)}
  .melding--goed{border-left-color:#3f7d4e}
  .melding--let{border-left-color:#b8824d}
  .melding--fout{border-left-color:#b4452f;background:#fff}
  .melding[hidden]{display:none}
  .knopbalk{display:flex;gap:10px;flex-wrap:wrap;margin:24px 0 0}
  .knop{font:inherit;font-size:16px;font-weight:600;padding:13px 22px;border-radius:10px;cursor:pointer;
        border:1px solid var(--accent);background:var(--accent);color:#fff}
  .knop:hover{background:var(--accent-donker);border-color:var(--accent-donker)}
  .knop--rand{background:#fff;color:var(--tekst);border-color:var(--rand)}
  .knop[disabled]{opacity:.6;cursor:default}
  .voet{margin-top:28px;padding-top:18px;border-top:1px solid var(--rand);font-size:14px;color:var(--zacht)}
  .opmerking{background:var(--cream);border-radius:9px;padding:14px;margin-top:20px;font-size:15px}
  @media print{
    body{background:#fff;padding:0}
    .blad{border:none;border-radius:0;padding:0;max-width:none}
    .knopbalk{display:none}
  }
  @media (max-width:560px){
    .blad{padding:20px}
    address{text-align:left}
    .knop{width:100%}
    table{font-size:14px}
    th,td{padding:8px 6px}
  }
</style>
</head>
<body>
<div class="blad">
  <div class="kop">
    <div>
      <div class="teken">EP</div>
      <h1>${esc(t.offerte)}</h1>
      <div class="nr">${esc(t.nummer)}: <strong>${esc(o.nummer)}</strong></div>
      <div class="nr">${esc(t.datum)}: ${esc(datum(o.gemaakt_op, taal))}</div>
      <div class="nr">${esc(t.geldig)}: <strong>${esc(datum(o.geldig_tot, taal))}</strong></div>
    </div>
    <address>
      <strong>${esc(f.naam)}</strong><br>
      ${f.adres.map(esc).join('<br>')}<br>
      ${esc(f.btwLabel)} ${esc(f.btw)}<br>
      <a href="mailto:${esc(f.email)}">${esc(f.email)}</a>
    </address>
  </div>

  <div class="gegevens">
    <div>
      <h2>${esc(t.voor)}</h2>
      <p>
        <strong>${esc(o.klant.organisatie)}</strong><br>
        ${o.klant.contact ? esc(o.klant.contact) + '<br>' : ''}
        ${o.klant.adres ? o.klant.adres.map(esc).join('<br>') + '<br>' : ''}
        ${o.klant.btw ? esc(o.klant.btw) : ''}
      </p>
    </div>
    ${o.klant.referentie ? `<div><h2>${esc(t.uwRef)}</h2><p>${esc(o.klant.referentie)}</p></div>` : ''}
  </div>

  ${melding}

  <table>
    <thead>
      <tr>
        <th>${esc(t.artikel)}</th>
        <th class="rechts">${esc(t.aantal)}</th>
        <th class="rechts">${esc(t.stuk)}</th>
        <th class="rechts">${esc(t.totaal)}</th>
      </tr>
    </thead>
    <tbody>
${regels}
    </tbody>
    <tfoot>
${leverregel}
      <tr><td colspan="3">${esc(t.excl)}</td><td class="rechts">${bedrag(o.excl_btw, taal)}</td></tr>
${btwRegel}
      <tr><td colspan="3">${esc(t.incl)}</td><td class="rechts">${bedrag(o.incl_btw, taal)}</td></tr>
    </tfoot>
  </table>

  ${o.opmerking ? `<div class="opmerking"><strong>${esc(t.opmerking)}:</strong> ${esc(o.opmerking)}</div>` : ''}

${knop}

  <div class="voet">
    ${esc(t.vraag)} <a href="mailto:${esc(f.email)}">${esc(f.email)}</a>
  </div>
</div>
<script>
(function(){
  var knop = document.getElementById('aanvaardKnop');
  if (!knop) return;
  var fout = document.getElementById('foutMelding');
  knop.addEventListener('click', function () {
    knop.disabled = true;
    knop.textContent = ${JSON.stringify(t.bezig)};
    fout.hidden = true;
    fetch('/api/offerte/aanvaarden', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nummer: ${JSON.stringify(o.nummer)}, sleutel: ${JSON.stringify(o.sleutel)} })
    })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (u) {
        if (!u || !u.ok) throw new Error('geweigerd');
        location.reload();
      })
      .catch(function () {
        // Geen valse bevestiging: zeggen dat het misging en het e-mailadres tonen.
        fout.hidden = false;
        fout.innerHTML = ${JSON.stringify(t.mislukt)} + ' <a href="mailto:${f.email}">${f.email}</a>';
        knop.disabled = false;
        knop.textContent = ${JSON.stringify(t.aanvaarden)};
      });
  });
})();
</script>
</body>
</html>
`;
}

export function nietGevonden(taal = 'nl') {
  const t = T[taal] || T.nl;
  return `<!doctype html><html lang="${taal}"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${t.offerte}</title><meta name="robots" content="noindex">
<style>body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
background:#f8f3e8;color:#3c2f1a;display:grid;place-items:center;min-height:100vh;margin:0;padding:24px;text-align:center}
.k{background:#fff;border:1px solid #e8e2d9;border-radius:12px;padding:32px;max-width:460px}
a{color:#b8824d}</style></head><body><div class="k">
<p>Deze link hoort niet bij een offerte die wij kennen.</p>
<p>Mail ons gerust op <a href="mailto:support@e-woodproducts.com">support@e-woodproducts.com</a>.</p>
</div></body></html>`;
}

export { FIRMA, T };
