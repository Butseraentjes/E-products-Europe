// Alle teksten van de site, per sleutel in vier talen naast elkaar.
// Zo is in één oogopslag te zien of een vertaling ontbreekt.
//
// REGELS (uit CLAUDE.md en de geheugennota's) — niet overtreden:
//  · nooit "wij maken/produceren/fabriceren" — wél "wij leveren zelf, met eigen bestelwagens"
//  · nooit FSC of PEFC, in geen enkele taal
//  · geen levertermijn verzinnen: alleen de cijfers uit data/groep.json › levering
//  · geen prijzen, geen rekeningnummers
//  · geen onbevestigde claims (oppervlakte magazijn, oprichtingsjaar, aantal markten)

export const TALEN = ['nl', 'fr', 'de', 'en'];

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

  'nav.groep': { nl: 'De groep', fr: 'Le groupe', de: 'Die Gruppe', en: 'The group' },
  'nav.winkels': { nl: 'Onze winkels', fr: 'Nos boutiques', de: 'Unsere Shops', en: 'Our shops' },
  'nav.zakelijk': { nl: 'Zakelijk', fr: 'Professionnels', de: 'Geschäftskunden', en: 'Business' },
  'nav.documenten': { nl: 'Documenten', fr: 'Documents', de: 'Unterlagen', en: 'Documents' },
  'nav.taal': { nl: 'Taal', fr: 'Langue', de: 'Sprache', en: 'Language' },

  // ─── startpagina ─────────────────────────────────────────────────────────
  'home.titel': {
    nl: 'E-Products Europe — de groep achter onze webwinkels',
    fr: 'E-Products Europe — le groupe derrière nos boutiques',
    de: 'E-Products Europe — die Gruppe hinter unseren Shops',
    en: 'E-Products Europe — the group behind our web shops',
  },
  'home.meta': {
    nl: 'E-Products Europe is de groep achter e-woodproducts.com, picknickbaenke.de en tablesdepiquenique.fr. Houten picknicktafels, tuinbanken en biertafels, geleverd met onze eigen bestelwagens.',
    fr: 'E-Products Europe est le groupe derrière e-woodproducts.com, picknickbaenke.de et tablesdepiquenique.fr. Tables de pique-nique, bancs de jardin et tables de brasserie en bois, livrés par nos propres camionnettes.',
    de: 'E-Products Europe ist die Gruppe hinter e-woodproducts.com, picknickbaenke.de und tablesdepiquenique.fr. Picknicktische, Gartenbänke und Biertische aus Holz, geliefert mit unseren eigenen Lieferwagen.',
    en: 'E-Products Europe is the group behind e-woodproducts.com, picknickbaenke.de and tablesdepiquenique.fr. Wooden picnic tables, garden benches and beer tables, delivered by our own vans.',
  },
  'home.hero.kop': {
    nl: 'Houten tuinmeubelen, geleverd tot bij u',
    fr: 'Du mobilier de jardin en bois, livré chez vous',
    de: 'Gartenmöbel aus Holz, zu Ihnen geliefert',
    en: 'Wooden garden furniture, delivered to your door',
  },
  'home.hero.tekst': {
    nl: 'E-Products Europe is de groep achter drie webwinkels in België, Duitsland en Frankrijk. Wij verkopen picknicktafels, tuinbanken, biertafels en interieurmeubelen in hout, en leveren de grote stukken zelf met onze eigen bestelwagens.',
    fr: 'E-Products Europe est le groupe derrière trois boutiques en ligne en Belgique, en Allemagne et en France. Nous vendons des tables de pique-nique, des bancs de jardin, des tables de brasserie et du mobilier d’intérieur en bois, et nous livrons les grandes pièces nous-mêmes, avec nos propres camionnettes.',
    de: 'E-Products Europe ist die Gruppe hinter drei Online-Shops in Belgien, Deutschland und Frankreich. Wir verkaufen Picknicktische, Gartenbänke, Biertische und Innenmöbel aus Holz und liefern die großen Stücke selbst, mit unseren eigenen Lieferwagen.',
    en: 'E-Products Europe is the group behind three web shops in Belgium, Germany and France. We sell wooden picnic tables, garden benches, beer tables and indoor furniture, and we deliver the large items ourselves, with our own vans.',
  },
  'home.hero.knop_winkels': {
    nl: 'Naar de juiste winkel',
    fr: 'Vers la bonne boutique',
    de: 'Zum richtigen Shop',
    en: 'Find the right shop',
  },
  'home.hero.knop_zakelijk': {
    nl: 'Offerte voor een organisatie',
    fr: 'Devis pour une organisation',
    de: 'Angebot für eine Organisation',
    en: 'Quote for an organisation',
  },

  'home.wie.kop': { nl: 'Wie we zijn', fr: 'Qui nous sommes', de: 'Wer wir sind', en: 'Who we are' },
  'home.wie.tekst': {
    nl: 'Onze meubelen komen van vaste leveranciers in Europa en Azië en staan in ons magazijn in Lebbeke, waar ook onze toonzaal is. Van daar leveren we zelf, met eigen bestelwagens. De groep bestaat uit drie vennootschappen: één in België, één in Duitsland en één in Frankrijk. Elke vennootschap heeft haar eigen webwinkel en haar eigen facturatie.',
    fr: 'Nos meubles proviennent de fournisseurs fixes en Europe et en Asie et sont stockés dans notre entrepôt de Lebbeke, où se trouve également notre salle d’exposition. C’est de là que nous livrons nous-mêmes, avec nos propres camionnettes. Le groupe compte trois sociétés : une en Belgique, une en Allemagne et une en France. Chaque société a sa propre boutique en ligne et sa propre facturation.',
    de: 'Unsere Möbel kommen von festen Lieferanten in Europa und Asien und lagern in unserem Lager in Lebbeke, wo sich auch unser Ausstellungsraum befindet. Von dort liefern wir selbst, mit eigenen Lieferwagen. Die Gruppe besteht aus drei Gesellschaften: eine in Belgien, eine in Deutschland und eine in Frankreich. Jede Gesellschaft hat ihren eigenen Shop und ihre eigene Rechnungsstellung.',
    en: 'Our furniture comes from regular suppliers in Europe and Asia and is kept in our warehouse in Lebbeke, where our showroom is too. From there we deliver ourselves, with our own vans. The group consists of three companies: one in Belgium, one in Germany and one in France. Each company has its own web shop and its own invoicing.',
  },

  'home.firmas.kop': {
    nl: 'De drie vennootschappen',
    fr: 'Les trois sociétés',
    de: 'Die drei Gesellschaften',
    en: 'The three companies',
  },
  'home.firmas.tekst': {
    nl: 'E-Products Europe BV is de moedervennootschap en tegelijk de Belgische werkmaatschappij. De Duitse en de Franse vennootschap verkopen in hun eigen land, in hun eigen taal en met hun eigen btw-nummer.',
    fr: 'E-Products Europe BV est la société mère et en même temps la société d’exploitation belge. Les sociétés allemande et française vendent dans leur propre pays, dans leur propre langue et avec leur propre numéro de TVA.',
    de: 'Die E-Products Europe BV ist die Muttergesellschaft und gleichzeitig die belgische Betriebsgesellschaft. Die deutsche und die französische Gesellschaft verkaufen im eigenen Land, in der eigenen Sprache und mit der eigenen Umsatzsteuer-Nummer.',
    en: 'E-Products Europe BV is the parent company and at the same time the Belgian operating company. The German and French companies sell in their own country, in their own language and with their own VAT number.',
  },
  'firma.rol.holding': {
    nl: 'Moedervennootschap · België',
    fr: 'Société mère · Belgique',
    de: 'Muttergesellschaft · Belgien',
    en: 'Parent company · Belgium',
  },
  'firma.rol.dochter': {
    nl: 'Dochtervennootschap',
    fr: 'Filiale',
    de: 'Tochtergesellschaft',
    en: 'Subsidiary',
  },
  'firma.magazijn': {
    nl: 'Magazijn en toonzaal',
    fr: 'Entrepôt et salle d’exposition',
    de: 'Lager und Ausstellungsraum',
    en: 'Warehouse and showroom',
  },
  'firma.winkels': { nl: 'Webwinkels', fr: 'Boutiques en ligne', de: 'Online-Shops', en: 'Web shops' },

  // ─── winkelkiezer ────────────────────────────────────────────────────────
  'winkels.titel': {
    nl: 'Onze winkels — waar koopt u wat?',
    fr: 'Nos boutiques — où acheter quoi ?',
    de: 'Unsere Shops — wo kaufen Sie was?',
    en: 'Our shops — where to buy what',
  },
  'winkels.meta': {
    nl: 'Welke webwinkel van E-Products Europe hoort bij uw land: e-woodproducts.com, picknickbaenke.de of tablesdepiquenique.fr.',
    fr: 'Quelle boutique en ligne d’E-Products Europe correspond à votre pays : e-woodproducts.com, picknickbaenke.de ou tablesdepiquenique.fr.',
    de: 'Welcher Online-Shop von E-Products Europe zu Ihrem Land gehört: e-woodproducts.com, picknickbaenke.de oder tablesdepiquenique.fr.',
    en: 'Which E-Products Europe web shop serves your country: e-woodproducts.com, picknickbaenke.de or tablesdepiquenique.fr.',
  },
  'winkels.kop': { nl: 'Kies uw land', fr: 'Choisissez votre pays', de: 'Wählen Sie Ihr Land', en: 'Choose your country' },
  'winkels.tekst': {
    nl: 'Elk land heeft zijn eigen winkel, met prijzen en leveringsvoorwaarden voor dat land.',
    fr: 'Chaque pays a sa propre boutique, avec les prix et les conditions de livraison de ce pays.',
    de: 'Jedes Land hat seinen eigenen Shop, mit den Preisen und Lieferbedingungen dieses Landes.',
    en: 'Each country has its own shop, with the prices and delivery terms for that country.',
  },
  'winkels.hoofdwinkel': {
    nl: 'Onze grootste winkel, in zeven talen',
    fr: 'Notre plus grande boutique, en sept langues',
    de: 'Unser größter Shop, in sieben Sprachen',
    en: 'Our largest shop, in seven languages',
  },
  'winkels.overige.kop': {
    nl: 'Onze andere winkels',
    fr: 'Nos autres boutiques',
    de: 'Unsere weiteren Shops',
    en: 'Our other shops',
  },
  'winkels.overige.tekst': {
    nl: 'Deze winkels zijn ook van onze groep. Ze zijn gespecialiseerd in één soort meubel.',
    fr: 'Ces boutiques appartiennent également à notre groupe. Elles sont spécialisées dans un seul type de meuble.',
    de: 'Diese Shops gehören ebenfalls zu unserer Gruppe. Sie sind auf eine Möbelart spezialisiert.',
    en: 'These shops are also part of our group. Each specialises in one type of furniture.',
  },

  // ─── zakelijke balie ─────────────────────────────────────────────────────
  'zakelijk.titel': {
    nl: 'Offerte voor gemeenten, scholen, verenigingen en bedrijven',
    fr: 'Devis pour communes, écoles, associations et entreprises',
    de: 'Angebot für Gemeinden, Schulen, Vereine und Unternehmen',
    en: 'Quotes for councils, schools, associations and businesses',
  },
  'zakelijk.meta': {
    nl: 'Vraag een offerte op naam van uw organisatie: picknicktafels, tuinbanken en biertafels, met bestelbon, factuur en levering op afspraak.',
    fr: 'Demandez un devis au nom de votre organisation : tables de pique-nique, bancs de jardin et tables de brasserie, avec bon de commande, facture et livraison sur rendez-vous.',
    de: 'Fordern Sie ein Angebot auf den Namen Ihrer Organisation an: Picknicktische, Gartenbänke und Biertische, mit Bestellschein, Rechnung und Lieferung nach Absprache.',
    en: 'Request a quote in your organisation’s name: picnic tables, garden benches and beer tables, with purchase order, invoice and delivery by appointment.',
  },
  'zakelijk.kop': {
    nl: 'Koopt u voor een organisatie?',
    fr: 'Vous achetez pour une organisation ?',
    de: 'Kaufen Sie für eine Organisation?',
    en: 'Buying for an organisation?',
  },
  'zakelijk.tekst': {
    nl: 'Gemeenten, scholen, verenigingen, campings, horeca en bedrijven kopen bij ons meerdere stuks tegelijk. Daarvoor hebt u vaak papieren nodig die een webwinkel niet geeft: een offerte op naam, een bestelbon, een factuur met uw btw-nummer of een leverdatum die past. Vraag het hier aan; u krijgt antwoord van de vennootschap van uw land.',
    fr: 'Communes, écoles, associations, campings, cafés-restaurants et entreprises commandent chez nous plusieurs pièces à la fois. Vous avez alors souvent besoin de documents qu’une boutique en ligne ne fournit pas : un devis à votre nom, un bon de commande, une facture avec votre numéro de TVA ou une date de livraison qui vous convient. Demandez-le ici ; vous recevrez une réponse de la société de votre pays.',
    de: 'Gemeinden, Schulen, Vereine, Campingplätze, Gastronomie und Unternehmen kaufen bei uns mehrere Stücke auf einmal. Dafür brauchen Sie oft Unterlagen, die ein Online-Shop nicht liefert: ein Angebot auf Ihren Namen, einen Bestellschein, eine Rechnung mit Ihrer Umsatzsteuer-Nummer oder einen passenden Liefertermin. Fragen Sie es hier an; Sie erhalten Antwort von der Gesellschaft Ihres Landes.',
    en: 'Councils, schools, associations, campsites, restaurants and businesses order several items at a time. That often calls for paperwork a web shop does not provide: a quote in your name, a purchase order, an invoice with your VAT number or a delivery date that suits you. Ask for it here; you will hear from the company in your country.',
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
    nl: 'Een leverdatum in overleg: wij bellen u zodra de rit gepland is.',
    fr: 'Une date de livraison convenue : nous vous appelons dès que la tournée est planifiée.',
    de: 'Einen Liefertermin in Absprache: wir rufen Sie an, sobald die Tour geplant ist.',
    en: 'A delivery date by arrangement: we call you as soon as the round is planned.',
  },
  'zakelijk.punt.aanbesteding': {
    nl: 'De stukken voor een bestek of een overheidsopdracht: maten, gewichten, houtsoort en garantie.',
    fr: 'Les pièces pour un cahier des charges ou un marché public : dimensions, poids, essence de bois et garantie.',
    de: 'Die Unterlagen für eine Ausschreibung oder einen öffentlichen Auftrag: Maße, Gewichte, Holzart und Garantie.',
    en: 'The documents for a tender or public contract: dimensions, weights, timber species and warranty.',
  },
  'zakelijk.punt.staffel': {
    nl: 'Bij meerdere stuks geldt onze gewone staffelkorting. Voor een afwijkende prijs maken we een offerte.',
    fr: 'Pour plusieurs pièces, notre remise sur quantité habituelle s’applique. Pour un prix différent, nous établissons un devis.',
    de: 'Bei mehreren Stücken gilt unser üblicher Mengenrabatt. Für einen abweichenden Preis erstellen wir ein Angebot.',
    en: 'For several items our usual quantity discount applies. For a different price we draw up a quote.',
  },

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
  'form.aantal': { nl: 'Hoeveel stuks (ongeveer)', fr: 'Combien de pièces (environ)', de: 'Wie viele Stück (etwa)', en: 'How many items (roughly)' },
  'form.wanneer': { nl: 'Wanneer wilt u geleverd worden?', fr: 'Quand souhaitez-vous la livraison ?', de: 'Wann möchten Sie geliefert werden?', en: 'When would you like delivery?' },
  'form.wanneer.zodra': { nl: 'Zo snel mogelijk', fr: 'Dès que possible', de: 'So schnell wie möglich', en: 'As soon as possible' },
  'form.wanneer.datum': { nl: 'Rond een bepaalde datum (zet die in uw bericht)', fr: 'Autour d’une date précise (indiquez-la dans votre message)', de: 'Um einen bestimmten Termin (bitte im Text angeben)', en: 'Around a specific date (say which in your message)' },
  'form.wanneer.voorjaar': { nl: 'In het voorjaar', fr: 'Au printemps', de: 'Im Frühjahr', en: 'In the spring' },
  'form.wanneer.weetniet': { nl: 'Dat weet ik nog niet', fr: 'Je ne sais pas encore', de: 'Weiß ich noch nicht', en: 'I don’t know yet' },
  'form.nodig': { nl: 'Wat hebt u nodig van ons?', fr: 'De quoi avez-vous besoin de notre part ?', de: 'Was brauchen Sie von uns?', en: 'What do you need from us?' },
  'form.nodig.offerte': { nl: 'Een offerte', fr: 'Un devis', de: 'Ein Angebot', en: 'A quote' },
  'form.nodig.bestelbon': { nl: 'Een bestelbon of factuur op naam', fr: 'Un bon de commande ou une facture', de: 'Einen Bestellschein oder eine Rechnung', en: 'A purchase order or invoice' },
  'form.nodig.fiche': { nl: 'Technische fiches', fr: 'Des fiches techniques', de: 'Technische Datenblätter', en: 'Technical data sheets' },
  'form.nodig.bestek': { nl: 'Stukken voor een bestek of overheidsopdracht', fr: 'Des pièces pour un cahier des charges', de: 'Unterlagen für eine Ausschreibung', en: 'Documents for a tender' },
  'form.nodig.bezoek': { nl: 'Een bezoek aan de toonzaal', fr: 'Une visite de la salle d’exposition', de: 'Einen Besuch im Ausstellungsraum', en: 'A showroom visit' },
  'form.bericht': { nl: 'Uw bericht', fr: 'Votre message', de: 'Ihre Nachricht', en: 'Your message' },
  'form.verstuur': { nl: 'Aanvraag versturen', fr: 'Envoyer la demande', de: 'Anfrage senden', en: 'Send request' },
  'form.bezig': { nl: 'Bezig met versturen…', fr: 'Envoi en cours…', de: 'Wird gesendet…', en: 'Sending…' },
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
  'form.firma_melding': {
    nl: 'Uw aanvraag gaat naar {firma}, de vennootschap die uw land bedient.',
    fr: 'Votre demande sera traitée par {firma}, la société qui dessert votre pays.',
    de: 'Ihre Anfrage geht an {firma}, die Gesellschaft, die Ihr Land betreut.',
    en: 'Your request goes to {firma}, the company serving your country.',
  },
  'form.firma_anders': {
    nl: 'Voor landen buiten België, Nederland, Luxemburg, Duitsland, Oostenrijk, Frankrijk en Monaco bekijken we eerst samen hoe de levering kan lopen.',
    fr: 'Pour les pays en dehors de la Belgique, des Pays-Bas, du Luxembourg, de l’Allemagne, de l’Autriche, de la France et de Monaco, nous examinons d’abord ensemble comment organiser la livraison.',
    de: 'Für Länder außerhalb Belgiens, der Niederlande, Luxemburgs, Deutschlands, Österreichs, Frankreichs und Monacos klären wir zuerst gemeinsam, wie die Lieferung laufen kann.',
    en: 'For countries outside Belgium, the Netherlands, Luxembourg, Germany, Austria, France and Monaco, we first look together at how delivery could work.',
  },

  'levering.kop': { nl: 'Hoe wij leveren', fr: 'Comment nous livrons', de: 'Wie wir liefern', en: 'How we deliver' },
  'levering.tekst': {
    nl: 'Grote stukken brengen we zelf, met onze eigen bestelwagens, in België, Nederland, Luxemburg, Duitsland en Frankrijk. Een rit vertrekt zodra hij voor die streek rendabel is; daarom hangt de wachttijd af van het seizoen. Kleine stukken gaan met de pakjesdienst. U wordt gebeld zodra de rit gepland is, meestal een week vooraf.',
    fr: 'Nous livrons les grandes pièces nous-mêmes, avec nos propres camionnettes, en Belgique, aux Pays-Bas, au Luxembourg, en Allemagne et en France. Une tournée part dès qu’elle est rentable pour la région ; le délai dépend donc de la saison. Les petites pièces partent par colis. Nous vous appelons dès que la tournée est planifiée, en général une semaine à l’avance.',
    de: 'Große Stücke bringen wir selbst, mit unseren eigenen Lieferwagen, nach Belgien, in die Niederlande, nach Luxemburg, Deutschland und Frankreich. Eine Tour fährt, sobald sie sich für die Region rechnet; die Wartezeit hängt daher von der Jahreszeit ab. Kleine Stücke gehen per Paketdienst. Wir rufen Sie an, sobald die Tour geplant ist, meist eine Woche vorher.',
    en: 'We bring large items ourselves, with our own vans, to Belgium, the Netherlands, Luxembourg, Germany and France. A round sets off once it is worthwhile for that region, so the waiting time depends on the season. Small items go by parcel service. We call you as soon as the round is planned, usually a week in advance.',
  },
  'levering.hoogseizoen': { nl: 'April tot juli', fr: 'D’avril à juillet', de: 'April bis Juli', en: 'April to July' },
  'levering.buitenseizoen': { nl: 'Augustus tot maart', fr: 'D’août à mars', de: 'August bis März', en: 'August to March' },
  'levering.pakket': { nl: 'Kleine stukken, met de pakjesdienst', fr: 'Petites pièces, par colis', de: 'Kleine Stücke, per Paketdienst', en: 'Small items, by parcel service' },

  // ─── documenten ──────────────────────────────────────────────────────────
  'doc.titel': {
    nl: 'Technische fiches en bedrijfsgegevens',
    fr: 'Fiches techniques et données d’entreprise',
    de: 'Technische Datenblätter und Firmendaten',
    en: 'Technical data sheets and company details',
  },
  'doc.meta': {
    nl: 'Maten, gewichten en houtsoort van onze picknicktafels, tuinbanken en biertafels, plus de bedrijfsgegevens van de drie vennootschappen.',
    fr: 'Dimensions, poids et essence de bois de nos tables de pique-nique, bancs de jardin et tables de brasserie, ainsi que les données des trois sociétés.',
    de: 'Maße, Gewichte und Holzart unserer Picknicktische, Gartenbänke und Biertische sowie die Firmendaten der drei Gesellschaften.',
    en: 'Dimensions, weights and timber species of our picnic tables, garden benches and beer tables, plus the company details of the three companies.',
  },
  'doc.kop': {
    nl: 'Voor een bestek of een interne goedkeuring',
    fr: 'Pour un cahier des charges ou une approbation interne',
    de: 'Für eine Ausschreibung oder eine interne Genehmigung',
    en: 'For a tender or an internal approval',
  },
  'doc.tekst': {
    nl: 'Hieronder staan de gegevens die in een bestek of een aanvraag gevraagd worden. Staat er iets niet bij, vraag het dan via het zakelijke formulier — dan zoeken we het op in plaats van te gokken.',
    fr: 'Vous trouverez ci-dessous les données demandées dans un cahier des charges ou une demande. Si une donnée manque, demandez-la via le formulaire professionnel : nous la chercherons plutôt que de la deviner.',
    de: 'Unten finden Sie die Angaben, die in einer Ausschreibung oder Anfrage verlangt werden. Fehlt etwas, fragen Sie es über das Geschäftsformular an — wir suchen es nach, statt zu raten.',
    en: 'Below are the details a tender or request usually asks for. If something is missing, ask via the business form — we will look it up rather than guess.',
  },
  'doc.tabel.artikel': { nl: 'Artikel', fr: 'Article', de: 'Artikel', en: 'Item' },
  'doc.tabel.code': { nl: 'Artikelcode', fr: 'Code article', de: 'Artikelnummer', en: 'Item code' },
  'doc.tabel.maat': { nl: 'Maten (l × b × h)', fr: 'Dimensions (L × l × h)', de: 'Maße (L × B × H)', en: 'Dimensions (l × w × h)' },
  'doc.tabel.lengte': { nl: 'Lengte', fr: 'Longueur', de: 'Länge', en: 'Length' },
  'doc.tabel.gewicht': { nl: 'Gewicht', fr: 'Poids', de: 'Gewicht', en: 'Weight' },
  'doc.tabel.hout': { nl: 'Houtsoort', fr: 'Essence de bois', de: 'Holzart', en: 'Timber' },
  'doc.tabel.dikte': { nl: 'Plankdikte', fr: 'Épaisseur des planches', de: 'Bohlenstärke', en: 'Plank thickness' },
  'doc.onbekend': { nl: 'op aanvraag', fr: 'sur demande', de: 'auf Anfrage', en: 'on request' },
  'doc.voetnoot': {
    nl: 'Gewichten zijn onze eigen opgave en bij benadering; maten die wij niet zeker weten, staan er niet in. Hebt u een exacte waarde nodig voor een bestek, vraag ze dan op — dan meten we na.',
    fr: 'Les poids sont nos propres indications et approximatifs ; les dimensions dont nous ne sommes pas sûrs ne figurent pas ici. Si vous avez besoin d’une valeur exacte pour un cahier des charges, demandez-la : nous vérifierons par mesure.',
    de: 'Gewichte sind unsere eigene Angabe und ungefähr; Maße, die wir nicht sicher kennen, stehen nicht hier. Brauchen Sie einen genauen Wert für eine Ausschreibung, fragen Sie ihn an — dann messen wir nach.',
    en: 'Weights are our own figures and approximate; dimensions we are not certain of are left out. If you need an exact value for a tender, ask us and we will measure.',
  },
  'doc.hout.kop': { nl: 'Over het hout', fr: 'À propos du bois', de: 'Über das Holz', en: 'About the timber' },
  'doc.hout.tekst': {
    nl: 'De KING-lijn is van vurenhout dat onder druk is verduurzaamd, zodat het jaarrond buiten kan staan. De Dordogne-banken zijn van teak. Wij dragen geen keurmerk; vraagt een bestek er een, zeg het ons dan meteen, dan zijn we daar eerlijk over.',
    fr: 'La ligne KING est en bois d’épicéa traité sous pression, afin de rester dehors toute l’année. Les bancs Dordogne sont en teck. Nous ne portons pas de label ; si un cahier des charges en exige un, dites-le nous d’emblée et nous serons francs à ce sujet.',
    de: 'Die KING-Linie besteht aus Fichtenholz, das unter Druck imprägniert ist, damit es ganzjährig draußen stehen kann. Die Dordogne-Bänke sind aus Teak. Wir führen kein Zertifikat; verlangt eine Ausschreibung eines, sagen Sie es uns gleich, dann sind wir dazu offen.',
    en: 'The KING line is made of pressure-treated spruce, so it can stay outside all year. The Dordogne benches are teak. We hold no certification label; if a tender requires one, tell us up front and we will be straight about it.',
  },
  'doc.firma.kop': {
    nl: 'Bedrijfsgegevens',
    fr: 'Données d’entreprise',
    de: 'Firmendaten',
    en: 'Company details',
  },
  'doc.firma.tekst': {
    nl: 'Welke vennootschap uw factuur opmaakt, hangt af van uw land. Vraagt uw boekhouding een bankrekening of een ondernemingsattest, dan staat dat op de offerte en de factuur zelf — niet op deze pagina.',
    fr: 'La société qui établit votre facture dépend de votre pays. Si votre comptabilité demande un compte bancaire ou une attestation d’entreprise, cela figure sur le devis et la facture — pas sur cette page.',
    de: 'Welche Gesellschaft Ihre Rechnung ausstellt, hängt von Ihrem Land ab. Verlangt Ihre Buchhaltung eine Bankverbindung oder eine Unternehmensbescheinigung, steht das auf dem Angebot und der Rechnung selbst — nicht auf dieser Seite.',
    en: 'Which company issues your invoice depends on your country. If your finance department needs bank details or a company certificate, those are on the quote and the invoice itself — not on this page.',
  },
  'doc.lijn.king-picknick': { nl: 'Picknicktafels KING®', fr: 'Tables de pique-nique KING®', de: 'Picknicktische KING®', en: 'KING® picnic tables' },
  'doc.lijn.royal-king': { nl: 'Picknicktafels ROYAL KING®', fr: 'Tables de pique-nique ROYAL KING®', de: 'Picknicktische ROYAL KING®', en: 'ROYAL KING® picnic tables' },
  'doc.lijn.vierkant-rond': { nl: 'Vierkante en ronde picknicktafels', fr: 'Tables de pique-nique carrées et rondes', de: 'Quadratische und runde Picknicktische', en: 'Square and round picnic tables' },
  'doc.lijn.kinder': { nl: 'Picknicktafels voor kinderen', fr: 'Tables de pique-nique pour enfants', de: 'Picknicktische für Kinder', en: 'Children’s picnic tables' },
  'doc.lijn.teak': { nl: 'Teak tuinbanken Dordogne', fr: 'Bancs de jardin en teck Dordogne', de: 'Teak-Gartenbänke Dordogne', en: 'Dordogne teak garden benches' },
  'doc.lijn.bier': { nl: 'Biertafelsets', fr: 'Ensembles tables de brasserie', de: 'Biertisch-Garnituren', en: 'Beer table sets' },
  'doc.lijn.tuinbank': { nl: 'Tuinbanken', fr: 'Bancs de jardin', de: 'Gartenbänke', en: 'Garden benches' },

  // ─── voettekst ───────────────────────────────────────────────────────────
  'voet.groep': {
    nl: 'E-Products Europe is de groep achter onze webwinkels in België, Duitsland en Frankrijk.',
    fr: 'E-Products Europe est le groupe derrière nos boutiques en Belgique, en Allemagne et en France.',
    de: 'E-Products Europe ist die Gruppe hinter unseren Shops in Belgien, Deutschland und Frankreich.',
    en: 'E-Products Europe is the group behind our web shops in Belgium, Germany and France.',
  },
  'voet.particulier': {
    nl: 'Koopt u als particulier? Ga naar de winkel van uw land.',
    fr: 'Vous achetez en tant que particulier ? Rendez-vous sur la boutique de votre pays.',
    de: 'Kaufen Sie als Privatperson? Gehen Sie zum Shop Ihres Landes.',
    en: 'Buying as a private customer? Go to the shop for your country.',
  },
  'voet.contact': { nl: 'Contact', fr: 'Contact', de: 'Kontakt', en: 'Contact' },
};

export function t(sleutel, taal) {
  const r = T[sleutel];
  if (!r) throw new Error(`Onbekende tekstsleutel: ${sleutel}`);
  const w = r[taal];
  if (!w) throw new Error(`Tekst "${sleutel}" ontbreekt in het ${taal}`);
  return w;
}

export function land(code, taal) {
  return LANDEN[code]?.[taal] || code;
}
