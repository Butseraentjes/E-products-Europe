// Alle teksten van de site, per sleutel in vier talen naast elkaar.
// Zo is in één oogopslag te zien of een vertaling ontbreekt (t() weigert dan te bouwen).
//
// REGELS (uit CLAUDE.md en de geheugennota's) — niet overtreden:
//  · nooit "wij maken/produceren/fabriceren", geen "werkplaats/atelier" — wél "wij leveren zelf, met eigen bestelwagens"
//  · nooit FSC of PEFC, in geen enkele taal
//  · geen levertermijn verzinnen: alleen de cijfers uit data/groep.json › levering
//  · geen prijzen, geen rekeningnummers, geen telefoonnummer
//  · geen toonzaal (sinds 2 okt 2026 niet meer) — wél "afhalen in Lebbeke"
//  · cijfers alleen uit data/groep.json › feiten (door Peter bevestigd)
//
// {n}, {z}, {naam}, {firma}, {email}, {datum} worden bij het bouwen ingevuld.

// Engels is de hoofdtaal (Peter, 1 okt 2026): / stuurt naar /en/ en de taalkiezer
// zet Engels vooraan. Nederlands, Frans en Duits zijn de bijtalen.
export const TALEN = ['en', 'nl', 'fr', 'de'];
export const HOOFDTAAL = 'en';

export const TAALNAAM = { nl: 'Nederlands', fr: 'Français', de: 'Deutsch', en: 'English' };

// Landnamen, voor de winkelkiezer en de keuzelijst in het formulier.
export const LANDEN = {
  BE: { nl: 'België', fr: 'Belgique', de: 'Belgien', en: 'Belgium' },
  NL: { nl: 'Nederland', fr: 'Pays-Bas', de: 'Niederlande', en: 'Netherlands' },
  LU: { nl: 'Luxemburg', fr: 'Luxembourg', de: 'Luxemburg', en: 'Luxembourg' },
  DE: { nl: 'Duitsland', fr: 'Allemagne', de: 'Deutschland', en: 'Germany' },
  AT: { nl: 'Oostenrijk', fr: 'Autriche', de: 'Österreich', en: 'Austria' },
  FR: { nl: 'Frankrijk', fr: 'France', de: 'Frankreich', en: 'France' },
  MC: { nl: 'Monaco', fr: 'Monaco', de: 'Monaco', en: 'Monaco' },
  IT: { nl: 'Italië', fr: 'Italie', de: 'Italien', en: 'Italy' },
  ES: { nl: 'Spanje', fr: 'Espagne', de: 'Spanien', en: 'Spain' },
  DK: { nl: 'Denemarken', fr: 'Danemark', de: 'Dänemark', en: 'Denmark' },
  SE: { nl: 'Zweden', fr: 'Suède', de: 'Schweden', en: 'Sweden' },
  FI: { nl: 'Finland', fr: 'Finlande', de: 'Finnland', en: 'Finland' },
  GB: { nl: 'Verenigd Koninkrijk', fr: 'Royaume-Uni', de: 'Vereinigtes Königreich', en: 'United Kingdom' },
  EU: { nl: 'Heel Europa', fr: 'Toute l’Europe', de: 'Ganz Europa', en: 'All of Europe' },
};

export const T = {
  // ─── algemeen ────────────────────────────────────────────────────────────
  'site.naam': { nl: 'E-Products Europe', fr: 'E-Products Europe', de: 'E-Products Europe', en: 'E-Products Europe' },
  'site.ondertitel': {
    nl: 'Houten tuinmeubelen in Europa',
    fr: 'Mobilier de jardin en bois en Europe',
    de: 'Gartenmöbel aus Holz in Europa',
    en: 'Wooden garden furniture across Europe',
  },
  'site.kenmerk': { nl: 'HOUTGROEP · BE · DE · FR', fr: 'GROUPE BOIS · BE · DE · FR', de: 'HOLZGRUPPE · BE · DE · FR', en: 'WOOD GROUP · BE · DE · FR' },

  'nav.groep': { nl: 'De groep', fr: 'Le groupe', de: 'Die Gruppe', en: 'The group' },
  'nav.winkels': { nl: 'Onze winkels', fr: 'Nos boutiques', de: 'Unsere Shops', en: 'Our shops' },
  'nav.zakelijk': { nl: 'Zakelijk', fr: 'Professionnels', de: 'Geschäftskunden', en: 'Business' },
  'nav.documenten': { nl: 'Documenten', fr: 'Documents', de: 'Unterlagen', en: 'Documents' },
  'nav.taal': { nl: 'Taal', fr: 'Langue', de: 'Sprache', en: 'Language' },
  'nav.hoofd': { nl: 'Hoofdmenu', fr: 'Menu principal', de: 'Hauptmenü', en: 'Main menu' },
  'nav.cta': { nl: 'Offerte aanvragen', fr: 'Demander un devis', de: 'Angebot anfragen', en: 'Request a quote' },
  'nav.menu': { nl: 'Menu', fr: 'Menu', de: 'Menü', en: 'Menu' },

  // ─── startpagina ─────────────────────────────────────────────────────────
  'home.titel': {
    nl: 'E-Products Europe — de groep achter onze webwinkels',
    fr: 'E-Products Europe — le groupe derrière nos boutiques',
    de: 'E-Products Europe — die Gruppe hinter unseren Shops',
    en: 'E-Products Europe — the group behind our web shops',
  },
  'home.meta': {
    nl: 'E-Products Europe is de groep achter {n} webwinkels in België, Nederland, Duitsland en Frankrijk, met e-woodproducts.com als hoofdwinkel. Houten picknicktafels, tuinbanken, biertafels en meubels voor binnen, geleverd met onze eigen bestelwagens.',
    fr: 'E-Products Europe est le groupe derrière {n} boutiques en ligne en Belgique, aux Pays-Bas, en Allemagne et en France, avec e-woodproducts.com comme boutique principale. Tables de pique-nique, bancs, tables de brasserie et meubles d’intérieur en bois, livrés par nos propres camionnettes.',
    de: 'E-Products Europe ist die Gruppe hinter {n} Online-Shops in Belgien, den Niederlanden, Deutschland und Frankreich, mit e-woodproducts.com als Hauptshop. Picknicktische, Gartenbänke, Biertische und Innenmöbel aus Holz, geliefert mit unseren eigenen Lieferwagen.',
    en: 'E-Products Europe is the group behind {n} web shops in Belgium, the Netherlands, Germany and France, with e-woodproducts.com as the main shop. Wooden picnic tables, garden benches, beer tables and indoor furniture, delivered in our own vans.',
  },
  'home.live': { nl: '{n} winkels online', fr: '{n} boutiques en ligne', de: '{n} Shops online', en: '{n} shops online' },
  'home.kop1': { nl: 'Eén houtgroep.', fr: 'Un seul groupe.', de: 'Eine Holzgruppe.', en: 'One wood group.' },
  'home.kop2': { nl: '{n} webwinkels.', fr: '{n} boutiques.', de: '{n} Online-Shops.', en: '{n} web shops.' },
  'home.lood': {
    nl: 'Van picknicktafel tot salontafel. E-Products Europe is de groep achter webwinkels in België, Nederland, Duitsland en Frankrijk — grote stukken brengen we zelf, met onze eigen bestelwagens.',
    fr: 'De la table de pique-nique à la table basse. E-Products Europe est le groupe derrière des boutiques en ligne en Belgique, aux Pays-Bas, en Allemagne et en France — les grandes pièces, nous les livrons nous-mêmes, avec nos propres camionnettes.',
    de: 'Vom Picknicktisch bis zum Couchtisch. E-Products Europe ist die Gruppe hinter Online-Shops in Belgien, den Niederlanden, Deutschland und Frankreich — große Stücke liefern wir selbst, mit unseren eigenen Lieferwagen.',
    en: 'From picnic table to coffee table. E-Products Europe is the group behind web shops in Belgium, the Netherlands, Germany and France — and we deliver the large pieces ourselves, in our own vans.',
  },
  'home.knop.winkel': { nl: 'Vind uw winkel', fr: 'Trouvez votre boutique', de: 'Ihren Shop finden', en: 'Find your shop' },
  'home.knop.zakelijk': {
    nl: 'Offerte voor organisaties',
    fr: 'Devis pour les organisations',
    de: 'Angebot für Organisationen',
    en: 'Quote for organisations',
  },
  'cijfer.winkels': { nl: 'Webwinkels', fr: 'Boutiques', de: 'Online-Shops', en: 'Web shops' },
  'cijfer.sinds': { nl: 'Actief sinds', fr: 'Actifs depuis', de: 'Aktiv seit', en: 'Active since' },
  'cijfer.bestellingen': { nl: 'Bestellingen', fr: 'Commandes', de: 'Bestellungen', en: 'Orders' },
  'cijfer.magazijn': { nl: 'Magazijnen', fr: 'D’entrepôts', de: 'Lagerfläche', en: 'Of warehousing' },
  'home.muur.label': {
    nl: 'Schermafdrukken van onze webwinkels',
    fr: 'Captures d’écran de nos boutiques',
    de: 'Screenshots unserer Online-Shops',
    en: 'Screenshots of our web shops',
  },
  'home.muur.stand': {
    nl: 'echte schermafdrukken · {datum}',
    fr: 'vraies captures · {datum}',
    de: 'echte Screenshots · {datum}',
    en: 'real screenshots · {datum}',
  },

  'kiezer.opschrift': { nl: 'Winkelkiezer', fr: 'Choisir sa boutique', de: 'Shop-Finder', en: 'Shop finder' },
  'kiezer.kop': { nl: 'Waar woont u?', fr: 'Où habitez-vous ?', de: 'Wo wohnen Sie?', en: 'Where do you live?' },
  'kiezer.tekst': {
    nl: 'Elk land heeft zijn eigen winkel, met prijzen en levering voor dat land. Kies het uwe — wij sturen u naar de juiste.',
    fr: 'Chaque pays a sa propre boutique, avec les prix et la livraison de ce pays. Choisissez le vôtre — nous vous guidons vers la bonne.',
    de: 'Jedes Land hat seinen eigenen Shop, mit Preisen und Lieferung für dieses Land. Wählen Sie Ihres — wir leiten Sie zum richtigen.',
    en: 'Each country has its own shop, with prices and delivery for that country. Pick yours — we will send you to the right one.',
  },
  'kiezer.alle': { nl: 'Alle {n} winkels bekijken →', fr: 'Voir les {n} boutiques →', de: 'Alle {n} Shops ansehen →', en: 'See all {n} shops →' },
  'kiezer.meer': { nl: '+ {n} gespecialiseerde winkels', fr: '+ {n} boutiques spécialisées', de: '+ {n} Fachshops', en: '+ {n} specialist shops' },
  'kiezer.meer1': { nl: '+ {naam}', fr: '+ {naam}', de: '+ {naam}', en: '+ {naam}' },
  'kiezer.lu': { nl: 'Levering met onze eigen bus', fr: 'Livré par notre camionnette', de: 'Lieferung mit eigenem Wagen', en: 'Delivered in our own van' },
  'kiezer.at': { nl: 'Via onze Duitse vennootschap', fr: 'Via notre société allemande', de: 'Über unsere deutsche Gesellschaft', en: 'Via our German company' },
  'kiezer.eu': { nl: 'Andere landen', fr: 'Autres pays', de: 'Andere Länder', en: 'Other countries' },

  'wereld.buiten.label': { nl: 'Buiten', fr: 'Extérieur', de: 'Draußen', en: 'Outdoor' },
  'wereld.binnen.label': { nl: 'Binnen', fr: 'Intérieur', de: 'Drinnen', en: 'Indoor' },
  'wereld.buiten.kop': { nl: 'Tuintafels voor twaalf.', fr: 'Des tables de jardin pour douze.', de: 'Gartentische für zwölf.', en: 'Garden tables for twelve.' },
  'wereld.binnen.kop': { nl: 'Meubels voor één rustige hoek.', fr: 'Des meubles pour un coin tranquille.', de: 'Möbel für eine ruhige Ecke.', en: 'Furniture for one quiet corner.' },
  'chip.picknick': { nl: 'Picknicktafels', fr: 'Tables de pique-nique', de: 'Picknicktische', en: 'Picnic tables' },
  'chip.bier': { nl: 'Biertafels', fr: 'Tables de brasserie', de: 'Biertische', en: 'Beer tables' },
  'chip.teak': { nl: 'Teakbanken', fr: 'Bancs en teck', de: 'Teakbänke', en: 'Teak benches' },
  'chip.tuinbank': { nl: 'Tuinbanken', fr: 'Bancs de jardin', de: 'Gartenbänke', en: 'Garden benches' },
  'chip.olie': { nl: 'Houtolie', fr: 'Huile pour bois', de: 'Holzöl', en: 'Wood oil' },
  'chip.salon': { nl: 'Salontafels', fr: 'Tables basses', de: 'Couchtische', en: 'Coffee tables' },
  'chip.kast': { nl: 'Kasten', fr: 'Rangements', de: 'Schränke', en: 'Cabinets' },

  'netwerk.opschrift': { nl: 'Het netwerk', fr: 'Le réseau', de: 'Das Netzwerk', en: 'The network' },
  'netwerk.kop': {
    nl: 'Elke winkel zijn eigen specialiteit. Eén groep erachter.',
    fr: 'Chaque boutique sa spécialité. Un seul groupe derrière.',
    de: 'Jeder Shop mit eigener Spezialität. Eine Gruppe dahinter.',
    en: 'Every shop its own speciality. One group behind them.',
  },
  'netwerk.hoofd': { nl: 'Hoofdwinkel', fr: 'Boutique principale', de: 'Hauptshop', en: 'Main shop' },
  'netwerk.naar': { nl: 'Naar de winkel ↗', fr: 'Vers la boutique ↗', de: 'Zum Shop ↗', en: 'Visit the shop ↗' },
  'netwerk.alle': { nl: 'Bekijk alle {n} winkels →', fr: 'Voir les {n} boutiques →', de: 'Alle {n} Shops ansehen →', en: 'See all {n} shops →' },

  'zakband.opschrift': {
    nl: 'Voor gemeenten, scholen, verenigingen en bedrijven',
    fr: 'Pour communes, écoles, associations et entreprises',
    de: 'Für Gemeinden, Schulen, Vereine und Unternehmen',
    en: 'For councils, schools, associations and businesses',
  },
  'zakband.kop': {
    nl: 'Een offerte op naam. Van de juiste firma.',
    fr: 'Un devis à votre nom. De la bonne société.',
    de: 'Ein Angebot auf Ihren Namen. Von der richtigen Gesellschaft.',
    en: 'A quote in your name. From the right company.',
  },
  'zakband.route': {
    nl: 'Uw land bepaalt wie u antwoordt',
    fr: 'Votre pays décide qui vous répond',
    de: 'Ihr Land bestimmt, wer Ihnen antwortet',
    en: 'Your country decides who answers',
  },

  // ─── levering ────────────────────────────────────────────────────────────
  'lev.opschrift': { nl: 'Levering', fr: 'Livraison', de: 'Lieferung', en: 'Delivery' },
  'lev.kop': {
    nl: 'Grote stukken rijden we zelf.',
    fr: 'Les grandes pièces, nous les livrons nous-mêmes.',
    de: 'Große Stücke fahren wir selbst.',
    en: 'We drive the large pieces ourselves.',
  },
  'levering.kop': { nl: 'Hoe wij leveren', fr: 'Comment nous livrons', de: 'Wie wir liefern', en: 'How we deliver' },
  'levering.tekst': {
    nl: 'Met onze eigen bestelwagens, in België, Nederland, Luxemburg, Duitsland en Frankrijk. Een rit vertrekt zodra hij voor uw streek rendabel is — daarom hangt de wachttijd af van het seizoen. Onze planningsdienst spreekt de leverdag met u af, en op de dag zelf krijgt u een bericht drie stops voor we aankomen. Kleine stukken gaan met GLS.',
    fr: 'Avec nos propres camionnettes, en Belgique, aux Pays-Bas, au Luxembourg, en Allemagne et en France. Une tournée part dès qu’elle est rentable pour votre région — le délai dépend donc de la saison. Notre service planning convient du jour de livraison avec vous, et le jour même vous recevez un message trois arrêts avant notre arrivée. Les petites pièces partent par GLS.',
    de: 'Mit unseren eigenen Lieferwagen, in Belgien, den Niederlanden, Luxemburg, Deutschland und Frankreich. Eine Tour fährt, sobald sie sich für Ihre Region rechnet — die Wartezeit hängt daher von der Jahreszeit ab. Unsere Tourenplanung vereinbart den Liefertag mit Ihnen, und am Tag selbst erhalten Sie drei Stopps vor unserer Ankunft eine Nachricht. Kleine Stücke gehen mit GLS.',
    en: 'In our own vans, to Belgium, the Netherlands, Luxembourg, Germany and France. A round sets off once it is worthwhile for your region — so the waiting time depends on the season. Our planning team agrees the delivery day with you, and on the day itself you get a message three stops before we arrive. Small items go with GLS.',
  },
  'lev.periode': { nl: 'Periode', fr: 'Période', de: 'Zeitraum', en: 'Period' },
  'levering.hoogseizoen': { nl: 'April tot juli', fr: 'D’avril à juillet', de: 'April bis Juli', en: 'April to July' },
  'levering.buitenseizoen': { nl: 'Augustus tot maart', fr: 'D’août à mars', de: 'August bis März', en: 'August to March' },
  'levering.pakket': { nl: 'Kleine stukken, met GLS', fr: 'Petites pièces, par GLS', de: 'Kleine Stücke, mit GLS', en: 'Small items, with GLS' },

  // ─── winkels ─────────────────────────────────────────────────────────────
  'winkels.titel': {
    nl: 'Onze winkels — alle webwinkels van E-Products Europe',
    fr: 'Nos boutiques — toutes les boutiques d’E-Products Europe',
    de: 'Unsere Shops — alle Online-Shops von E-Products Europe',
    en: 'Our shops — every E-Products Europe web shop',
  },
  'winkels.meta': {
    nl: 'Alle {n} webwinkels van E-Products Europe op één pagina, met een schermafdruk van elk: e-woodproducts.com, picknickbaenke.de, tablesdepiquenique.fr en onze gespecialiseerde winkels.',
    fr: 'Les {n} boutiques d’E-Products Europe sur une seule page, avec une capture de chacune : e-woodproducts.com, picknickbaenke.de, tablesdepiquenique.fr et nos boutiques spécialisées.',
    de: 'Alle {n} Online-Shops von E-Products Europe auf einer Seite, mit einem Screenshot von jedem: e-woodproducts.com, picknickbaenke.de, tablesdepiquenique.fr und unsere Fachshops.',
    en: 'All {n} E-Products Europe web shops on one page, with a screenshot of each: e-woodproducts.com, picknickbaenke.de, tablesdepiquenique.fr and our specialist shops.',
  },
  'winkels.kop': { nl: 'Alle winkels van de groep.', fr: 'Toutes les boutiques du groupe.', de: 'Alle Shops der Gruppe.', en: 'Every shop in the group.' },
  'winkels.lood': {
    nl: 'Elke winkel heeft zijn eigen land, taal of specialiteit. Achter elke winkel staat één van onze drie vennootschappen. En alles wat te koop staat, ligt op voorraad in onze magazijnen.',
    fr: 'Chaque boutique a son pays, sa langue ou sa spécialité. Derrière chacune se trouve l’une de nos trois sociétés. Et tout ce qui est en vente est en stock dans nos entrepôts.',
    de: 'Jeder Shop hat sein eigenes Land, seine Sprache oder Spezialität. Hinter jedem steht eine unserer drei Gesellschaften. Und alles, was zum Verkauf steht, liegt auf Lager in unseren Lagerhallen.',
    en: 'Each shop has its own country, language or speciality. Behind each one stands one of our three companies. And everything for sale is in stock in our warehouses.',
  },
  'winkels.online': { nl: 'Online', fr: 'En ligne', de: 'Online', en: 'Online' },
  'winkels.landen': { nl: 'Landen', fr: 'Pays', de: 'Länder', en: 'Countries' },
  'winkels.binnenkort': { nl: 'Binnenkort', fr: 'Bientôt', de: 'Demnächst', en: 'Coming soon' },
  'winkels.hoofd.kop': {
    nl: 'Eén hoofdwinkel per vennootschap',
    fr: 'Une boutique principale par société',
    de: 'Ein Hauptshop pro Gesellschaft',
    en: 'One main shop per company',
  },
  'winkels.aantal': { nl: '{n} winkels', fr: '{n} boutiques', de: '{n} Shops', en: '{n} shops' },
  'winkels.aantal1': { nl: '1 winkel', fr: '1 boutique', de: '1 Shop', en: '1 shop' },
  'winkels.schot': { nl: 'Schermafdruk van {naam}', fr: 'Capture d’écran de {naam}', de: 'Screenshot von {naam}', en: 'Screenshot of {naam}' },
  'winkels.schot.gsm': { nl: '{naam} op een gsm', fr: '{naam} sur un téléphone', de: '{naam} auf dem Handy', en: '{naam} on a phone' },
  'tag.taal': { nl: 'Taal: {x}', fr: 'Langue : {x}', de: 'Sprache: {x}', en: 'Language: {x}' },
  'tag.talen': { nl: '{n} talen', fr: '{n} langues', de: '{n} Sprachen', en: '{n} languages' },
  'winkels.binnenkort.tekst': { nl: 'Winkels die we nu bouwen.', fr: 'Des boutiques en préparation.', de: 'Shops, die wir gerade bauen.', en: 'Shops we are building now.' },
  'winkels.inopbouw': { nl: 'In opbouw', fr: 'En préparation', de: 'Im Aufbau', en: 'In progress' },
  'winkels.gepland': { nl: 'Gepland', fr: 'Prévu', de: 'Geplant', en: 'Planned' },
  'winkels.geenbeeld': { nl: 'Nog geen ontwerp', fr: 'Pas encore de maquette', de: 'Noch kein Entwurf', en: 'No design yet' },
  'winkels.stand': { nl: 'Schermafdrukken van {datum}', fr: 'Captures du {datum}', de: 'Screenshots vom {datum}', en: 'Screenshots taken {datum}' },
  'winkels.zakband.kop': {
    nl: 'Koopt u voor een gemeente, school of bedrijf?',
    fr: 'Vous achetez pour une commune, une école ou une entreprise ?',
    de: 'Kaufen Sie für eine Gemeinde, Schule oder Firma?',
    en: 'Buying for a council, school or business?',
  },
  'winkels.zakband.tekst': {
    nl: 'Eén aanvraag, en de vennootschap van uw land maakt de offerte op naam.',
    fr: 'Une seule demande, et la société de votre pays établit le devis à votre nom.',
    de: 'Eine Anfrage, und die Gesellschaft Ihres Landes erstellt das Angebot auf Ihren Namen.',
    en: 'One request, and the company in your country draws up the quote in your name.',
  },
  'filter.land': { nl: 'Filter op land', fr: 'Filtrer par pays', de: 'Nach Land filtern', en: 'Filter by country' },
  'filter.soort': { nl: 'Filter op soort', fr: 'Filtrer par type', de: 'Nach Art filtern', en: 'Filter by type' },
  'filter.alle_landen': { nl: 'Alle landen', fr: 'Tous les pays', de: 'Alle Länder', en: 'All countries' },
  'filter.alles': { nl: 'Alles', fr: 'Tout', de: 'Alles', en: 'Everything' },
  'filter.teller': { nl: '{z} van {n} winkels', fr: '{z} sur {n} boutiques', de: '{z} von {n} Shops', en: '{z} of {n} shops' },
  'filter.leeg': { nl: 'Geen winkel voor deze combinatie.', fr: 'Aucune boutique pour cette combinaison.', de: 'Kein Shop für diese Kombination.', en: 'No shop for this combination.' },
  'filter.wis': { nl: 'Toon alles', fr: 'Tout afficher', de: 'Alle zeigen', en: 'Show all' },
  'soort.buiten': { nl: 'Buiten', fr: 'Extérieur', de: 'Draußen', en: 'Outdoor' },
  'soort.binnen': { nl: 'Binnen', fr: 'Intérieur', de: 'Drinnen', en: 'Indoor' },
  'soort.olie': { nl: 'Houtolie', fr: 'Huile pour bois', de: 'Holzöl', en: 'Wood oil' },
  'soort.zakelijk': { nl: 'Voor organisaties', fr: 'Pour les organisations', de: 'Für Organisationen', en: 'For organisations' },

  // ─── zakelijke balie ─────────────────────────────────────────────────────
  'zakelijk.titel': {
    nl: 'Offerte voor gemeenten, scholen, verenigingen en bedrijven',
    fr: 'Devis pour communes, écoles, associations et entreprises',
    de: 'Angebot für Gemeinden, Schulen, Vereine und Unternehmen',
    en: 'Quotes for councils, schools, associations and businesses',
  },
  'zakelijk.meta': {
    nl: 'Vraag een offerte op naam van uw organisatie: picknicktafels, tuinbanken en biertafels, met bestelbon, factuur en een leverdag in overleg.',
    fr: 'Demandez un devis au nom de votre organisation : tables de pique-nique, bancs de jardin et tables de brasserie, avec bon de commande, facture et jour de livraison convenu.',
    de: 'Fordern Sie ein Angebot auf den Namen Ihrer Organisation an: Picknicktische, Gartenbänke und Biertische, mit Bestellschein, Rechnung und abgestimmtem Liefertag.',
    en: 'Request a quote in your organisation’s name: picnic tables, garden benches and beer tables, with purchase order, invoice and an agreed delivery day.',
  },
  'zakelijk.opschrift': { nl: 'Zakelijk · offerte', fr: 'Professionnels · devis', de: 'Geschäftskunden · Angebot', en: 'Business · quote' },
  'zakelijk.kop': {
    nl: 'Koopt u voor een organisatie?',
    fr: 'Vous achetez pour une organisation ?',
    de: 'Kaufen Sie für eine Organisation?',
    en: 'Buying for an organisation?',
  },
  'zakelijk.tekst': {
    nl: 'Gemeenten, scholen, verenigingen, campings, horeca en bedrijven kopen bij ons meerdere stuks tegelijk. Daarvoor hebt u vaak papieren nodig die een webwinkel niet geeft. Vraag het hier aan — u krijgt antwoord van de vennootschap van uw land.',
    fr: 'Communes, écoles, associations, campings, cafés-restaurants et entreprises commandent chez nous plusieurs pièces à la fois. Il faut alors souvent des documents qu’une boutique en ligne ne fournit pas. Demandez-les ici — vous recevrez une réponse de la société de votre pays.',
    de: 'Gemeinden, Schulen, Vereine, Campingplätze, Gastronomie und Unternehmen kaufen bei uns mehrere Stücke auf einmal. Dafür brauchen Sie oft Unterlagen, die ein Online-Shop nicht liefert. Fragen Sie sie hier an — Sie erhalten Antwort von der Gesellschaft Ihres Landes.',
    en: 'Councils, schools, associations, campsites, restaurants and businesses order several items at a time. That often calls for paperwork a web shop does not provide. Ask for it here — you will hear from the company in your country.',
  },
  'zakelijk.punten.kop': {
    nl: 'Wat u van ons kunt vragen',
    fr: 'Ce que vous pouvez nous demander',
    de: 'Was Sie von uns anfragen können',
    en: 'What you can ask us for',
  },
  'zakelijk.punt.offerte': {
    nl: 'Een offerte op naam van uw organisatie, met een geldigheidsdatum.',
    fr: 'Un devis au nom de votre organisation, avec une date de validité.',
    de: 'Ein Angebot auf den Namen Ihrer Organisation, mit Gültigkeitsdatum.',
    en: 'A quote in your organisation’s name, with a validity date.',
  },
  'zakelijk.punt.bestelbon': {
    nl: 'Een bestelbon of een factuur met uw btw-nummer en uw interne referentie.',
    fr: 'Un bon de commande ou une facture avec votre numéro de TVA et votre référence interne.',
    de: 'Einen Bestellschein oder eine Rechnung mit Ihrer Umsatzsteuer-Nummer und Ihrer internen Referenz.',
    en: 'A purchase order or an invoice with your VAT number and your internal reference.',
  },
  'zakelijk.punt.levering': {
    nl: 'Een leverdag in overleg met onze planningsdienst.',
    fr: 'Un jour de livraison convenu avec notre service planning.',
    de: 'Einen Liefertag in Absprache mit unserer Tourenplanung.',
    en: 'A delivery day agreed with our planning team.',
  },
  'zakelijk.punt.aanbesteding': {
    nl: 'De gegevens voor een bestek of een overheidsopdracht: maten, gewichten en houtsoort.',
    fr: 'Les données pour un cahier des charges ou un marché public : dimensions, poids et essence de bois.',
    de: 'Die Angaben für eine Ausschreibung oder einen öffentlichen Auftrag: Maße, Gewichte und Holzart.',
    en: 'The details for a tender or public contract: dimensions, weights and timber species.',
  },
  'zakelijk.punt.staffel': {
    nl: 'Bij meerdere stuks geldt onze gewone staffelkorting. Voor een afwijkende prijs maken we een offerte.',
    fr: 'Pour plusieurs pièces, notre remise sur quantité habituelle s’applique. Pour un prix différent, nous établissons un devis.',
    de: 'Bei mehreren Stücken gilt unser üblicher Mengenrabatt. Für einen abweichenden Preis erstellen wir ein Angebot.',
    en: 'For several items our usual quantity discount applies. For a different price we draw up a quote.',
  },
  'wie.gemeenten': { nl: 'Gemeenten', fr: 'Communes', de: 'Gemeinden', en: 'Councils' },
  'wie.scholen': { nl: 'Scholen', fr: 'Écoles', de: 'Schulen', en: 'Schools' },
  'wie.verenigingen': { nl: 'Verenigingen', fr: 'Associations', de: 'Vereine', en: 'Associations' },
  'wie.campings': { nl: 'Campings', fr: 'Campings', de: 'Campingplätze', en: 'Campsites' },
  'wie.horeca': { nl: 'Horeca', fr: 'Restaurants', de: 'Gastronomie', en: 'Hospitality' },
  'wie.bedrijven': { nl: 'Bedrijven', fr: 'Entreprises', de: 'Unternehmen', en: 'Businesses' },

  'route.naar': { nl: 'Uw aanvraag gaat naar', fr: 'Votre demande est traitée par', de: 'Ihre Anfrage geht an', en: 'Your request goes to' },
  'route.leeg': { nl: 'Kies hierboven uw land', fr: 'Choisissez votre pays ci-dessus', de: 'Wählen Sie oben Ihr Land', en: 'Choose your country above' },
  'route.anders': { nl: 'We bekijken samen hoe de levering loopt', fr: 'Nous voyons ensemble comment livrer', de: 'Wir klären gemeinsam die Lieferung', en: 'We will work out delivery together' },

  'form.kop': { nl: 'Uw aanvraag', fr: 'Votre demande', de: 'Ihre Anfrage', en: 'Your request' },
  'form.uitleg': {
    nl: 'Hoe meer u invult, hoe concreter ons antwoord. Velden met * zijn nodig.',
    fr: 'Plus vous remplissez, plus notre réponse sera précise. Les champs avec * sont obligatoires.',
    de: 'Je mehr Sie ausfüllen, desto konkreter unsere Antwort. Felder mit * sind erforderlich.',
    en: 'The more you fill in, the more concrete our answer. Fields marked * are required.',
  },
  'form.land': { nl: 'Land van levering', fr: 'Pays de livraison', de: 'Lieferland', en: 'Delivery country' },
  'form.land.kies': { nl: 'Kies uw land', fr: 'Choisissez votre pays', de: 'Land wählen', en: 'Select your country' },
  'form.land.anders': { nl: 'Een ander land', fr: 'Un autre pays', de: 'Ein anderes Land', en: 'Another country' },
  'form.organisatie': { nl: 'Organisatie', fr: 'Organisation', de: 'Organisation', en: 'Organisation' },
  'form.soort': { nl: 'Soort organisatie', fr: 'Type d’organisation', de: 'Art der Organisation', en: 'Type of organisation' },
  'form.soort.kies': { nl: 'Kies', fr: 'Choisissez', de: 'Wählen', en: 'Select' },
  'form.soort.gemeente': { nl: 'Gemeente of overheid', fr: 'Commune ou administration', de: 'Gemeinde oder Behörde', en: 'Council or public body' },
  'form.soort.school': { nl: 'School of kinderopvang', fr: 'École ou crèche', de: 'Schule oder Kinderbetreuung', en: 'School or childcare' },
  'form.soort.vereniging': { nl: 'Vereniging of vzw', fr: 'Association', de: 'Verein', en: 'Association or non-profit' },
  'form.soort.camping': { nl: 'Camping of recreatiedomein', fr: 'Camping ou domaine de loisirs', de: 'Campingplatz oder Freizeitanlage', en: 'Campsite or holiday park' },
  'form.soort.horeca': { nl: 'Horeca', fr: 'Café, hôtel ou restaurant', de: 'Gastronomie', en: 'Hospitality' },
  'form.soort.bedrijf': { nl: 'Bedrijf', fr: 'Entreprise', de: 'Unternehmen', en: 'Business' },
  'form.soort.andere': { nl: 'Andere', fr: 'Autre', de: 'Andere', en: 'Other' },
  'form.btw': { nl: 'Btw-nummer', fr: 'Numéro de TVA ou SIRET', de: 'Umsatzsteuer-Nummer', en: 'VAT number' },
  'form.naam': { nl: 'Uw naam', fr: 'Votre nom', de: 'Ihr Name', en: 'Your name' },
  'form.email': { nl: 'E-mailadres', fr: 'Adresse e-mail', de: 'E-Mail-Adresse', en: 'Email address' },
  'form.telefoon': { nl: 'Telefoon', fr: 'Téléphone', de: 'Telefon', en: 'Phone' },
  'form.producten': { nl: 'Wat hebt u nodig?', fr: 'De quoi avez-vous besoin ?', de: 'Was brauchen Sie?', en: 'What do you need?' },
  'form.producten.vb': {
    nl: 'bv. 6 picknicktafels van 180 cm voor de speelplaats',
    fr: 'ex. 6 tables de pique-nique de 180 cm pour la cour',
    de: 'z. B. 6 Picknicktische 180 cm für den Schulhof',
    en: 'e.g. 6 picnic tables of 180 cm for the playground',
  },
  'form.aantal': { nl: 'Hoeveel stuks (ongeveer)', fr: 'Combien de pièces (environ)', de: 'Wie viele Stück (etwa)', en: 'How many items (roughly)' },
  'form.wanneer': { nl: 'Wanneer leveren?', fr: 'Quand livrer ?', de: 'Wann liefern?', en: 'When to deliver?' },
  'form.wanneer.zodra': { nl: 'Zo snel mogelijk', fr: 'Dès que possible', de: 'So schnell wie möglich', en: 'As soon as possible' },
  'form.wanneer.datum': { nl: 'Rond een bepaalde datum (zet die in uw bericht)', fr: 'Autour d’une date précise (indiquez-la dans votre message)', de: 'Um einen bestimmten Termin (bitte im Text angeben)', en: 'Around a specific date (say which in your message)' },
  'form.wanneer.voorjaar': { nl: 'In het voorjaar', fr: 'Au printemps', de: 'Im Frühjahr', en: 'In the spring' },
  'form.wanneer.weetniet': { nl: 'Dat weet ik nog niet', fr: 'Je ne sais pas encore', de: 'Weiß ich noch nicht', en: 'I don’t know yet' },
  'form.nodig': { nl: 'Wat hebt u nodig van ons?', fr: 'De quoi avez-vous besoin de notre part ?', de: 'Was brauchen Sie von uns?', en: 'What do you need from us?' },
  'form.nodig.offerte': { nl: 'Een offerte', fr: 'Un devis', de: 'Ein Angebot', en: 'A quote' },
  'form.nodig.bestelbon': { nl: 'Bestelbon of factuur op naam', fr: 'Bon de commande ou facture', de: 'Bestellschein oder Rechnung', en: 'Purchase order or invoice' },
  'form.nodig.fiche': { nl: 'Technische gegevens', fr: 'Données techniques', de: 'Technische Daten', en: 'Technical details' },
  'form.nodig.bestek': { nl: 'Stukken voor een bestek', fr: 'Pièces pour un cahier des charges', de: 'Unterlagen für eine Ausschreibung', en: 'Documents for a tender' },
  'form.bericht': { nl: 'Uw bericht', fr: 'Votre message', de: 'Ihre Nachricht', en: 'Your message' },
  'form.verstuur': { nl: 'Aanvraag versturen →', fr: 'Envoyer la demande →', de: 'Anfrage senden →', en: 'Send request →' },
  'form.bezig': { nl: 'Bezig met versturen…', fr: 'Envoi en cours…', de: 'Wird gesendet…', en: 'Sending…' },
  'form.onder': {
    nl: 'U krijgt een bevestiging per e-mail. Lukt het versturen niet, mail dan gerust naar {email}.',
    fr: 'Vous recevrez une confirmation par e-mail. Si l’envoi échoue, écrivez-nous à {email}.',
    de: 'Sie erhalten eine Bestätigung per E-Mail. Klappt das Senden nicht, schreiben Sie uns an {email}.',
    en: 'You will get a confirmation by email. If sending fails, just write to {email}.',
  },
  'form.gelukt.kop': { nl: 'Uw aanvraag is binnen', fr: 'Votre demande est bien arrivée', de: 'Ihre Anfrage ist angekommen', en: 'Your request has arrived' },
  'form.gelukt.tekst': {
    nl: 'U krijgt een bevestiging per e-mail. Een medewerker van {firma} neemt contact met u op.',
    fr: 'Vous recevrez une confirmation par e-mail. Un collaborateur de {firma} vous contactera.',
    de: 'Sie erhalten eine Bestätigung per E-Mail. Ein Mitarbeiter von {firma} wird sich bei Ihnen melden.',
    en: 'You will receive a confirmation by email. Someone from {firma} will get in touch.',
  },
  'form.mislukt': {
    nl: 'Het versturen is niet gelukt. Mail ons gerust rechtstreeks op {email} — dan pakken we het zo op.',
    fr: 'L’envoi a échoué. Écrivez-nous directement à {email} et nous nous en occupons.',
    de: 'Das Senden hat nicht funktioniert. Schreiben Sie uns direkt an {email}, wir kümmern uns darum.',
    en: 'Sending failed. Just email us directly at {email} and we will pick it up.',
  },

  'stap.opschrift': { nl: 'Na uw aanvraag', fr: 'Après votre demande', de: 'Nach Ihrer Anfrage', en: 'After your request' },
  'stap.kop': {
    nl: 'Van vraag tot levering, in vier stappen.',
    fr: 'De la demande à la livraison, en quatre étapes.',
    de: 'Von der Anfrage bis zur Lieferung, in vier Schritten.',
    en: 'From request to delivery, in four steps.',
  },
  'stap.1.kop': { nl: 'U stuurt uw aanvraag', fr: 'Vous envoyez votre demande', de: 'Sie senden Ihre Anfrage', en: 'You send your request' },
  'stap.1.tekst': {
    nl: 'Ze wordt meteen bewaard en u krijgt een bevestiging per e-mail.',
    fr: 'Elle est enregistrée aussitôt et vous recevez une confirmation par e-mail.',
    de: 'Sie wird sofort gespeichert, und Sie erhalten eine Bestätigung per E-Mail.',
    en: 'It is saved straight away and you get a confirmation by email.',
  },
  'stap.2.kop': { nl: 'U krijgt een offerte als webpagina', fr: 'Vous recevez un devis en ligne', de: 'Sie erhalten ein Angebot als Webseite', en: 'You get your quote as a web page' },
  'stap.2.tekst': {
    nl: 'Op naam van uw organisatie, met een geldigheidsdatum. Printbaar en makkelijk door te sturen.',
    fr: 'À votre nom, avec une date de validité. Imprimable et facile à transmettre.',
    de: 'Auf Ihren Namen, mit Gültigkeitsdatum. Druckbar und leicht weiterzuleiten.',
    en: 'In your organisation’s name, with a validity date. Printable and easy to forward.',
  },
  'stap.3.kop': { nl: 'Akkoord met één klik', fr: 'Accord en un clic', de: 'Zusage mit einem Klick', en: 'Accept with one click' },
  'stap.3.tekst': {
    nl: 'U aanvaardt de offerte online, of vraagt een bestelbon of factuur op naam.',
    fr: 'Vous acceptez le devis en ligne, ou demandez un bon de commande ou une facture à votre nom.',
    de: 'Sie nehmen das Angebot online an oder fordern einen Bestellschein oder eine Rechnung an.',
    en: 'Accept the quote online, or ask for a purchase order or invoice in your name.',
  },
  'stap.4.kop': { nl: 'Wij leveren', fr: 'Nous livrons', de: 'Wir liefern', en: 'We deliver' },
  'stap.4.tekst': {
    nl: 'Met onze eigen bestelwagen. Onze planningsdienst spreekt de leverdag met u af; op de dag zelf krijgt u een bericht drie stops voor we aankomen.',
    fr: 'Avec notre propre camionnette. Notre service planning convient du jour de livraison ; le jour même, vous recevez un message trois arrêts avant notre arrivée.',
    de: 'Mit unserem eigenen Lieferwagen. Unsere Tourenplanung vereinbart den Liefertag; am Tag selbst erhalten Sie drei Stopps vorher eine Nachricht.',
    en: 'In our own van. Our planning team agrees the delivery day with you; on the day you get a message three stops before we arrive.',
  },

  // ─── de groep ────────────────────────────────────────────────────────────
  'groep.titel': {
    nl: 'De groep — E-Products Europe BV, GmbH en SARL',
    fr: 'Le groupe — E-Products Europe BV, GmbH et SARL',
    de: 'Die Gruppe — E-Products Europe BV, GmbH und SARL',
    en: 'The group — E-Products Europe BV, GmbH and SARL',
  },
  'groep.meta': {
    nl: 'Drie vennootschappen, één houtgroep: E-Products Europe BV in België, E-Products Deutschland GmbH en E-Products France SARL. Actief sinds 2011, met eigen bestelwagens in vijf landen.',
    fr: 'Trois sociétés, un seul groupe : E-Products Europe BV en Belgique, E-Products Deutschland GmbH et E-Products France SARL. Actifs depuis 2011, avec nos propres camionnettes dans cinq pays.',
    de: 'Drei Gesellschaften, eine Holzgruppe: E-Products Europe BV in Belgien, E-Products Deutschland GmbH und E-Products France SARL. Aktiv seit 2011, mit eigenen Lieferwagen in fünf Ländern.',
    en: 'Three companies, one wood group: E-Products Europe BV in Belgium, E-Products Deutschland GmbH and E-Products France SARL. Active since 2011, with our own vans in five countries.',
  },
  'groep.kop': { nl: 'Drie vennoot\u00ADschappen. Eén houtgroep.', fr: 'Trois sociétés. Un seul groupe.', de: 'Drei Gesell\u00ADschaften. Eine Holzgruppe.', en: 'Three companies. One wood group.' },
  'groep.lood': {
    nl: 'E-Products Europe BV is de holding én de Belgische werkmaatschappij. Daaronder een Duitse GmbH en een Franse SARL. Elk bedient zijn eigen land — met dezelfde bestelwagens en dezelfde klantendienst.',
    fr: 'E-Products Europe BV est à la fois la holding et la société d’exploitation belge. En dessous : une GmbH allemande et une SARL française. Chacune sert son pays — avec les mêmes camionnettes et le même service client.',
    de: 'Die E-Products Europe BV ist Holding und belgische Betriebsgesellschaft zugleich. Darunter stehen eine deutsche GmbH und eine französische SARL. Jede betreut ihr eigenes Land — mit denselben Lieferwagen und demselben Kundenservice.',
    en: 'E-Products Europe BV is both the holding and the Belgian operating company. Below it sit a German GmbH and a French SARL. Each serves its own country — with the same vans and the same customer service.',
  },
  'groep.holding': { nl: 'Holding + werkmaatschappij', fr: 'Holding + société d’exploitation', de: 'Holding + Betriebsgesellschaft', en: 'Holding + operating company' },
  'groep.dochter': { nl: 'Dochter', fr: 'Filiale', de: 'Tochter', en: 'Subsidiary' },
  'groep.structuur': { nl: 'Structuur van de groep', fr: 'Structure du groupe', de: 'Aufbau der Gruppe', en: 'Group structure' },

  'cijfers.opschrift': { nl: 'In cijfers', fr: 'En chiffres', de: 'In Zahlen', en: 'In numbers' },
  'c.sinds': { nl: 'Actief sinds', fr: 'Actifs depuis', de: 'Aktiv seit', en: 'Active since' },
  'c.sinds.bron': { nl: 'De eerste bestellingen', fr: 'Les premières commandes', de: 'Die ersten Bestellungen', en: 'Our first orders' },
  'c.best': { nl: 'Bestellingen', fr: 'Commandes', de: 'Bestellungen', en: 'Orders' },
  'c.best.bron': {
    nl: 'Sinds 2011, naar schatting — vanaf 2017 geteld in de boekhouding',
    fr: 'Depuis 2011, estimation — comptées en comptabilité depuis 2017',
    de: 'Seit 2011, geschätzt — ab 2017 in der Buchhaltung gezählt',
    en: 'Since 2011, estimated — counted in our books from 2017',
  },
  'c.mag': { nl: 'Magazijnen', fr: 'D’entrepôts', de: 'Lagerfläche', en: 'Of warehousing' },
  'c.mag.bron': { nl: 'In België en in het buitenland', fr: 'En Belgique et à l’étranger', de: 'In Belgien und im Ausland', en: 'In Belgium and abroad' },
  'c.winkels': { nl: 'Webwinkels', fr: 'Boutiques en ligne', de: 'Online-Shops', en: 'Web shops' },
  'c.winkels.bron': {
    nl: 'In België, Nederland, Duitsland en Frankrijk',
    fr: 'En Belgique, aux Pays-Bas, en Allemagne et en France',
    de: 'In Belgien, den Niederlanden, Deutschland und Frankreich',
    en: 'In Belgium, the Netherlands, Germany and France',
  },
  'c.bus': { nl: 'Landen met eigen bestelwagens', fr: 'Pays livrés par nos camionnettes', de: 'Länder mit eigenen Lieferwagen', en: 'Countries served by our own vans' },
  'c.antw': { nl: 'Antwoord, ook in het weekend', fr: 'Pour répondre, même le week-end', de: 'Antwort, auch am Wochenende', en: 'To reply, weekends too' },
  'c.antw.bron': { nl: 'In de taal van de klant', fr: 'Dans la langue du client', de: 'In der Sprache des Kunden', en: 'In the customer’s language' },
  'c.antw.getal': { nl: '24 u', fr: '24 h', de: '24 Std.', en: '24 h' },

  'werken.kop': { nl: 'Hoe wij werken', fr: 'Notre façon de travailler', de: 'So arbeiten wir', en: 'How we work' },
  'werken.voorraad.kop': { nl: 'Op voorraad', fr: 'En stock', de: 'Auf Lager', en: 'In stock' },
  'werken.voorraad.tekst': {
    nl: 'Alles wat in onze winkels te koop staat, ligt in onze magazijnen. Wat nog onderweg is, kunt u reserveren.',
    fr: 'Tout ce qui est en vente dans nos boutiques se trouve dans nos entrepôts. Ce qui est encore en route peut être réservé.',
    de: 'Alles, was in unseren Shops zum Verkauf steht, liegt in unseren Lagern. Was noch unterwegs ist, können Sie reservieren.',
    en: 'Everything for sale in our shops is in our warehouses. Items still on their way can be reserved.',
  },
  'werken.zelf.kop': { nl: 'Zelf geleverd', fr: 'Livré par nous', de: 'Selbst geliefert', en: 'Delivered by us' },
  'werken.zelf.tekst': {
    nl: 'Grote stukken brengen we met onze eigen bestelwagens in België, Nederland, Luxemburg, Duitsland en Frankrijk. Kleine stukken gaan met GLS.',
    fr: 'Nous livrons les grandes pièces avec nos propres camionnettes en Belgique, aux Pays-Bas, au Luxembourg, en Allemagne et en France. Les petites pièces partent par GLS.',
    de: 'Große Stücke bringen wir mit eigenen Lieferwagen nach Belgien, in die Niederlande, nach Luxemburg, Deutschland und Frankreich. Kleine Stücke gehen mit GLS.',
    en: 'We bring large pieces in our own vans to Belgium, the Netherlands, Luxembourg, Germany and France. Small items go with GLS.',
  },
  'werken.taal.kop': { nl: 'In uw taal', fr: 'Dans votre langue', de: 'In Ihrer Sprache', en: 'In your language' },
  'werken.taal.tekst': {
    nl: 'Antwoord binnen 24 uur, ook in het weekend — in de taal waarin u ons schrijft.',
    fr: 'Une réponse sous 24 heures, même le week-end — dans la langue dans laquelle vous nous écrivez.',
    de: 'Antwort innerhalb von 24 Stunden, auch am Wochenende — in der Sprache, in der Sie uns schreiben.',
    en: 'An answer within 24 hours, weekends included — in the language you write to us in.',
  },
  'groep.beeldzin': { nl: 'Hout. Op voorraad. Tot bij u gebracht.', fr: 'Du bois. En stock. Livré chez vous.', de: 'Holz. Auf Lager. Bis zu Ihnen gebracht.', en: 'Wood. In stock. Brought to your door.' },
  'adres.kop': { nl: 'Adressen', fr: 'Adresses', de: 'Adressen', en: 'Addresses' },
  'adres.zetel': { nl: 'Hoofdzetel', fr: 'Siège', de: 'Hauptsitz', en: 'Head office' },
  'adres.magazijn': { nl: 'Magazijn en afhalen', fr: 'Entrepôt et retrait', de: 'Lager und Abholung', en: 'Warehouse and collection' },
  'adres.afspraak': { nl: 'in de winter op afspraak', fr: 'en hiver sur rendez-vous', de: 'im Winter nach Vereinbarung', en: 'by appointment in winter' },
  'adres.mail': { nl: 'Voor alle drie de vennootschappen:', fr: 'Pour les trois sociétés :', de: 'Für alle drei Gesellschaften:', en: 'For all three companies:' },

  // ─── documenten ──────────────────────────────────────────────────────────
  'doc.titel': {
    nl: 'Documentenkast — maten, gewichten en houtsoort',
    fr: 'Armoire à documents — dimensions, poids et essence',
    de: 'Unterlagen — Maße, Gewichte und Holzart',
    en: 'Document cabinet — dimensions, weights and timber',
  },
  'doc.meta': {
    nl: 'Maten, gewichten, houtsoort en plankdikte van onze picknicktafels, tuinbanken en biertafels — voor een bestek of een interne goedkeuring.',
    fr: 'Dimensions, poids, essence de bois et épaisseur des planches de nos tables de pique-nique, bancs et tables de brasserie — pour un cahier des charges ou une approbation interne.',
    de: 'Maße, Gewichte, Holzart und Bohlenstärke unserer Picknicktische, Gartenbänke und Biertische — für eine Ausschreibung oder interne Genehmigung.',
    en: 'Dimensions, weights, timber species and plank thickness of our picnic tables, garden benches and beer tables — for a tender or an internal approval.',
  },
  'doc.opschrift': { nl: 'Documentenkast', fr: 'Armoire à documents', de: 'Unterlagen', en: 'Document cabinet' },
  'doc.kop': { nl: 'Alles voor uw bestek.', fr: 'Tout pour votre cahier des charges.', de: 'Alles für Ihre Ausschreibung.', en: 'Everything for your tender.' },
  'doc.tekst': {
    nl: 'Maten, gewichten, houtsoort en plankdikte per product, rechtstreeks uit onze productgegevens. Staat er iets niet bij, vraag het dan — dan zoeken we het op in plaats van te gokken.',
    fr: 'Dimensions, poids, essence et épaisseur des planches par produit, directement depuis nos données. S’il manque une information, demandez-la : nous la chercherons plutôt que de la deviner.',
    de: 'Maße, Gewichte, Holzart und Bohlenstärke je Produkt, direkt aus unseren Produktdaten. Fehlt etwas, fragen Sie — wir suchen es nach, statt zu raten.',
    en: 'Dimensions, weights, timber species and plank thickness per product, straight from our product data. If something is missing, ask — we will look it up rather than guess.',
  },
  'doc.ca.kop': { nl: 'Waarom “ca.” bij het gewicht?', fr: 'Pourquoi « env. » pour le poids ?', de: 'Warum „ca.“ beim Gewicht?', en: 'Why “approx.” for weight?' },
  'doc.ca': { nl: 'ca.', fr: 'env.', de: 'ca.', en: 'approx.' },
  'doc.voetnoot': {
    nl: 'Het gewicht is onze eigen opgave en staat bewust iets ruimer. Hebt u een exacte waarde nodig voor een bestek, dan meten we na.',
    fr: 'Le poids est notre propre indication et volontairement un peu large. Si vous avez besoin d’une valeur exacte pour un cahier des charges, nous la mesurons.',
    de: 'Das Gewicht ist unsere eigene Angabe und bewusst etwas großzügig. Brauchen Sie einen genauen Wert für eine Ausschreibung, messen wir nach.',
    en: 'The weight is our own figure and deliberately on the generous side. If you need an exact value for a tender, we will measure it.',
  },
  'doc.zoek': { nl: 'Zoek op naam of artikelnummer', fr: 'Chercher par nom ou code article', de: 'Nach Name oder Artikelnummer suchen', en: 'Search by name or item code' },
  'doc.zoek.vb': { nl: 'bv. RK300', fr: 'ex. RK300', de: 'z. B. RK300', en: 'e.g. RK300' },
  'doc.lijnen': { nl: 'Productlijn', fr: 'Gamme', de: 'Produktlinie', en: 'Product line' },
  'doc.alles': { nl: 'Alles', fr: 'Tout', de: 'Alle', en: 'All' },
  'doc.aantal': { nl: '{n} producten', fr: '{n} produits', de: '{n} Produkte', en: '{n} products' },
  'doc.niets': {
    nl: 'Niets gevonden. Staat uw product er niet bij?',
    fr: 'Aucun résultat. Votre produit n’y figure pas ?',
    de: 'Nichts gefunden. Ihr Produkt ist nicht dabei?',
    en: 'Nothing found. Is your product not listed?',
  },
  'doc.vraag': { nl: 'Vraag het ons', fr: 'Demandez-nous', de: 'Fragen Sie uns', en: 'Ask us' },
  'doc.print': { nl: 'Tabel afdrukken', fr: 'Imprimer le tableau', de: 'Tabelle drucken', en: 'Print table' },
  'doc.tabel.code': { nl: 'Artikel', fr: 'Article', de: 'Artikel', en: 'Item' },
  'doc.tabel.artikel': { nl: 'Product', fr: 'Produit', de: 'Produkt', en: 'Product' },
  'doc.tabel.maat': { nl: 'Maat', fr: 'Dimensions', de: 'Maße', en: 'Size' },
  'doc.tabel.gewicht': { nl: 'Gewicht', fr: 'Poids', de: 'Gewicht', en: 'Weight' },
  'doc.tabel.hout': { nl: 'Hout', fr: 'Bois', de: 'Holz', en: 'Timber' },
  'doc.tabel.dikte': { nl: 'Plank', fr: 'Planche', de: 'Bohle', en: 'Plank' },
  'doc.lang': { nl: '{l} cm lang', fr: '{l} cm de long', de: '{l} cm lang', en: '{l} cm long' },
  'doc.onbekend': { nl: 'op aanvraag', fr: 'sur demande', de: 'auf Anfrage', en: 'on request' },
  'doc.hout.kop': { nl: 'Over het hout', fr: 'À propos du bois', de: 'Über das Holz', en: 'About the timber' },
  'doc.hout.tekst': {
    nl: 'De KING-lijn is van vurenhout dat onder druk is verduurzaamd, zodat het jaarrond buiten kan staan. De Dordogne-banken zijn van teak. Wij dragen geen keurmerk; vraagt een bestek er een, zeg het ons dan meteen, dan zijn we daar eerlijk over.',
    fr: 'La ligne KING est en bois d’épicéa traité sous pression, afin de rester dehors toute l’année. Les bancs Dordogne sont en teck. Nous ne portons pas de label ; si un cahier des charges en exige un, dites-le nous d’emblée et nous serons francs à ce sujet.',
    de: 'Die KING-Linie besteht aus Fichtenholz, das unter Druck imprägniert ist, damit es ganzjährig draußen stehen kann. Die Dordogne-Bänke sind aus Teak. Wir führen kein Zertifikat; verlangt eine Ausschreibung eines, sagen Sie es uns gleich, dann sind wir dazu offen.',
    en: 'The KING line is made of pressure-treated spruce, so it can stay outside all year. The Dordogne benches are teak. We hold no certification label; if a tender requires one, tell us up front and we will be straight about it.',
  },
  'doc.firma.kop': { nl: 'Bedrijfsgegevens', fr: 'Données d’entreprise', de: 'Firmendaten', en: 'Company details' },
  'doc.firma.tekst': {
    nl: 'Welke vennootschap uw factuur opmaakt, hangt af van uw land. Adressen en btw-nummers staan op de pagina over de groep; bankgegevens staan op de offerte en de factuur zelf.',
    fr: 'La société qui établit votre facture dépend de votre pays. Adresses et numéros de TVA figurent sur la page du groupe ; les coordonnées bancaires sur le devis et la facture.',
    de: 'Welche Gesellschaft Ihre Rechnung ausstellt, hängt von Ihrem Land ab. Adressen und USt-Nummern stehen auf der Gruppenseite; Bankdaten auf Angebot und Rechnung.',
    en: 'Which company invoices you depends on your country. Addresses and VAT numbers are on the group page; bank details are on the quote and invoice themselves.',
  },
  'doc.band.kop': {
    nl: 'Een bestek of overheidsopdracht?',
    fr: 'Un cahier des charges ou un marché public ?',
    de: 'Eine Ausschreibung oder ein öffentlicher Auftrag?',
    en: 'A tender or public contract?',
  },
  'doc.band.tekst': {
    nl: 'Vraag de gegevens samen met een offerte op naam — de vennootschap van uw land stuurt ze mee.',
    fr: 'Demandez les données avec un devis à votre nom — la société de votre pays les joint.',
    de: 'Fordern Sie die Daten zusammen mit einem Angebot an — die Gesellschaft Ihres Landes schickt sie mit.',
    en: 'Ask for the details together with a quote — the company in your country will send them along.',
  },
  'doc.lijn.king-picknick': { nl: 'KING picknicktafels', fr: 'Tables KING', de: 'KING Picknicktische', en: 'KING picnic tables' },
  'doc.lijn.royal-king': { nl: 'ROYAL KING', fr: 'ROYAL KING', de: 'ROYAL KING', en: 'ROYAL KING' },
  'doc.lijn.vierkant-rond': { nl: 'Vierkant en rond', fr: 'Carrées et rondes', de: 'Quadratisch und rund', en: 'Square and round' },
  'doc.lijn.kinder': { nl: 'Kindertafels', fr: 'Tables enfants', de: 'Kindertische', en: 'Children’s tables' },
  'doc.lijn.teak': { nl: 'Teak tuinbanken', fr: 'Bancs en teck', de: 'Teak-Gartenbänke', en: 'Teak benches' },
  'doc.lijn.bier': { nl: 'Biertafelsets', fr: 'Tables de brasserie', de: 'Biertisch-Garnituren', en: 'Beer table sets' },
  'doc.lijn.tuinbank': { nl: 'Tuinbanken', fr: 'Bancs de jardin', de: 'Gartenbänke', en: 'Garden benches' },

  // ─── voettekst ───────────────────────────────────────────────────────────
  'voet.groep': {
    nl: 'De groep achter onze webwinkels in België, Nederland, Duitsland en Frankrijk.',
    fr: 'Le groupe derrière nos boutiques en Belgique, aux Pays-Bas, en Allemagne et en France.',
    de: 'Die Gruppe hinter unseren Shops in Belgien, den Niederlanden, Deutschland und Frankreich.',
    en: 'The group behind our web shops in Belgium, the Netherlands, Germany and France.',
  },
  'voet.alle': { nl: '+ alle andere winkels', fr: '+ toutes les autres boutiques', de: '+ alle weiteren Shops', en: '+ all other shops' },
  'voet.firmas': { nl: 'Vennootschappen', fr: 'Sociétés', de: 'Gesellschaften', en: 'Companies' },
  'voet.contact': { nl: 'Contact', fr: 'Contact', de: 'Kontakt', en: 'Contact' },
  'voet.afhalen': { nl: 'Magazijn en afhalen: Lebbeke', fr: 'Entrepôt et retrait : Lebbeke', de: 'Lager und Abholung: Lebbeke', en: 'Warehouse and collection: Lebbeke' },
  'voet.gegevens': { nl: 'Technische gegevens', fr: 'Données techniques', de: 'Technische Daten', en: 'Technical details' },
};


// Houtsoorten. Vuren en grenen zijn NIET uitwisselbaar (feedback-materiaalclaims):
// vuren = spruce/Fichte/épicéa · grenen = pine/Kiefer/pin.
export const HOUT = {
  vurenhout: { nl: 'Vurenhout', fr: 'Épicéa', de: 'Fichte', en: 'Spruce' },
  grenen: { nl: 'Grenen', fr: 'Pin', de: 'Kiefer', en: 'Pine' },
  teak: { nl: 'Teak', fr: 'Teck', de: 'Teak', en: 'Teak' },
  acacia: { nl: 'Acacia', fr: 'Acacia', de: 'Akazie', en: 'Acacia' },
  douglas: { nl: 'Douglas', fr: 'Douglas', de: 'Douglasie', en: 'Douglas fir' },
  eiken: { nl: 'Eiken', fr: 'Chêne', de: 'Eiche', en: 'Oak' },
};

export function houtsoort(waarde, taal) {
  if (!waarde) return null;
  const sleutel = String(waarde).toLowerCase().trim();
  return HOUT[sleutel]?.[taal] || waarde;
}

export function t(sleutel, taal, vars) {
  const r = T[sleutel];
  if (!r) throw new Error(`Onbekende tekstsleutel: ${sleutel}`);
  let w = r[taal];
  if (!w) throw new Error(`Tekst "${sleutel}" ontbreekt in het ${taal}`);
  if (vars) for (const [k, v] of Object.entries(vars)) w = w.split(`{${k}}`).join(String(v));
  return w;
}

export function land(code, taal) {
  return LANDEN[code]?.[taal] || code;
}
