# Wat Peter nog moet bevestigen

*1 okt 2026. De site is gebouwd zonder deze punten. Niets hiervan staat erop — want
wat niet bevestigd is, hoort er niet op. Bevestig je iets, dan zet ik het erbij.*

## 1 · Claims die op de oude sites stonden en die ik heb weggelaten

| Claim op de oude site | Waarom weggelaten | Mag het erop? |
|---|---|---|
| "1.500 m² warehouse" | Nergens terug te vinden in het project | ☐ ja, namelijk: ……… m² · ☐ laat weg |
| "Founded in 2011 by Mark and Peter" | Niet te controleren | ☐ ja · ☐ laat weg |
| "Started from a converted classroom" | Niet te controleren | ☐ ja · ☐ laat weg |
| "16 European markets" | De hoofdwinkel heeft 13 markten in `data/groep.json`; het getal 16 telde kleine staten apart | ☐ het zijn er ……… · ☐ geen getal noemen |
| "V-legal certified teak" | Documenten alleen gevonden voor een zending uit 2022 (Aankopen/_INDEX) | ☐ ja, bewijs voor 2026 is: ……… · ☐ laat weg |
| "Kiln-dried to 16 % moisture" | Niet bevestigd | ☐ ja · ☐ laat weg |
| "2-year warranty" | Niet bevestigd voor zakelijke klanten | ☐ ja, ……… jaar · ☐ laat weg |
| "Response within 48 business hours" | Support meet dit niet | ☐ ja · ☐ laat weg |
| "Truck delivery across all of Europe" + "own fleet" | Eigen bus rijdt alleen BE · NL · LU · DE · FR | staat nu correct op de site |
| "Production takes time / up to 3 months" | Wij maken niet zelf, en geen wekencijfers | staat nu niet op de site |

## 2 · Gegevens die ik nodig heb om de site af te maken

| Wat | Waarvoor | Antwoord |
|---|---|---|
| **Telefoonnummer** per vennootschap (of één algemeen) | Nu staat alleen `support@e-woodproducts.com` op de site. Een gemeente belt liever. | BV: ……… · GmbH: ……… · SARL: ……… |
| **Adres op de koepel**: Gent of Lebbeke? | Het maatschappelijk adres is Gent (Patijntjestraat 107), maar magazijn en toonzaal zijn in Lebbeke. Nu staan beide erop. | ☐ zo laten · ☐ anders: ……… |
| **Toonzaal**: op afspraak of vrij toegankelijk, en wanneer? | De site biedt "een bezoek aan de toonzaal" aan als keuze in het formulier | ……… |
| **Afzendernaam** voor de bevestigingsmail | Volgens de afspraak van 16 sep is dat "Customer Service" | ☐ Customer Service · ☐ anders: ……… |
| **Garantie** voor zakelijke klanten | Komt in de documentenkast, nu leeg | ……… |

## 3 · Productgegevens

Zie `TE-BEVESTIGEN-producten.md` — dat bestand wordt automatisch gemaakt bij elke
bouw en somt op wat de productkern niet weet of zichzelf tegenspreekt. De twee die
eruit springen:

- **EP-DORD250** (teak 250 cm): de kern geeft de maat van de 210 cm. Op de site staat
  nu "op aanvraag".
- **EP-KHTB**: heet "Tuinbank 154 cm Henry" maar meet 168 cm. Ook "op aanvraag".

De **gewichten** komen uit Shopify. Dat is jouw eigen opgave en wint van elke paklijst,
maar staat soms bewust hoger. Daarom staat er overal "ca." bij en zegt de voetnoot dat
we nameten als iemand een exacte waarde nodig heeft voor een bestek.

## 4 · Beslissingen over de aanpak

| | |
|---|---|
| **Maery.fr onder de SARL** | Bevestigd op 1 okt. Staat zo op de site. |
| **De twee oude folders** (e-productsfrance.fr, e-productsdeutschland.de) | Worden doorverwijzingen naar `/fr/` en `/de/` van de koepel. De bestanden staan klaar in `vervangers/`. |
| **Wederverkopersprogramma** | Weggelaten: geen vraag gemeten, en de Franse folder eiste een SIRET voor een programma dat niet bestond. |
| **Prijzen** | Staan niet op de koepel. Blijven in de winkels. |

## 5 · Nog niet geregeld (en wie)

| Wat | Wie |
|---|---|
| ⚠ **tablesdepiquenique.fr + tablesdepique-nique.fr vervallen 17 okt 2026** — wacht op Spinternet | Peter |
| Cloudflare Pages-project koppelen aan de nieuwe repo | samen |
| KV-opslag aanmaken + `BEHEER_SLEUTEL` instellen (zie `README.md`) | wij, na jouw go |
| Search Console en Bing instellen voor e-productseurope.com | wij |
| `EPEUROPE_WORKER` en `EPEUROPE_BEHEER_SLEUTEL` in `SEO-WOOD/.env` | wij |
