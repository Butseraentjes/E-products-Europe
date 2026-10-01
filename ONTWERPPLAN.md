# Visueel plan — e-productseurope.com

*1 okt 2026. Peter: "Is dit echt het saaie ontwerp? Als mensen nu op deze site komen denken ze dat we voorhistorisch zijn. Ga voor een flashy design, iets echt modern, in onze houten stijl. En duh, we doen niet alleen meubels voor buiten maar ook voor binnen."*
*Plus: **Engels wordt de hoofdtaal**, Nederlands, Frans en Duits zijn bijtalen.*

---

## 0 · Het concept in één zin

> **Two worlds, one wood.**
> Eén groep, twee werelden: de lange tafel in de zon en de ronde tafel in de kamer.

De site is vandaag een nette folder: witte vlakken, tekst, een tabel. Correct, maar het
toont niet wat we verkopen. **Wij hebben beeld. Heel goed beeld.** Dat moet het werk doen.

---

## 1 · Wat we écht in huis hebben

Ik heb de hele beeldvoorraad doorzocht. De verrassing: de beste beelden zijn de **echte
foto's** die er al staan.

### Buiten — echte foto's, hoge resolutie
| foto | formaat | wat je ziet |
|---|---|---|
| `picknicktafel-k300-gedekte-tafel-op-grind` | 2048² | Gedekte tafel van 3 m, blauw servies, zon, loungehoek op de achtergrond. **De beste foto die we hebben.** |
| `picknicktafel-k180-volledige-tafel-tuin` | 3264² | Volledige tafel in een echte tuin |
| `picknicktafel-k180-planken-detail` | 3264² | Houtnerf van dichtbij — perfect als textuur |
| `picknicktafel-k240-sfeer-met-boomhut` | 1709×960 | Tafel met boomhut, warm licht |
| `picknicktafel-k300-kunstgras-*` | 2592×1600 | Jouw eigen reeks van 1 oktober |
| `bedrijf-K180` | 2816×2112 | Tafel in een bedrijfsomgeving |

### Binnen — professionele beelden, 2000×2000
`liora-8` (organische salontafel in een warme eiken kamer), `lunara-3` (tv-meubel),
`vespera-1`, `luna-drawer-3`, de CURVE-ladekasten. Strak, modern, warm — precies de
"houten stijl" die je bedoelt.

### Wat ik niet ga gebruiken
De beelden van 1024×1024 en 1248×832 (`lente-tuin`, `modern-terras-lounge`,
`tuinset-met-koppel-in-tuin`). Dat zijn **AI-beelden**, en dat is een vaste regel bij
ons: geen AI-beelden. Ze zijn bovendien kleiner en minder scherp dan de echte foto's.

> **Over "beelden genereren":** je vroeg om mijn rekenkracht in te zetten voor
> indrukwekkende beelden. Ik doe dat — maar niet door foto's te verzinnen. Ik genereer
> **vectorkunst**: houtnerfpatronen, een Europakaart, iconen, een jaarringen-motief, de
> beweging. Alles wat een foto moet zijn, is een échte foto van een échte tafel.
> Dat is eerlijker én het ziet er beter uit. Wil je toch AI-beelden, zeg het dan —
> dan is dat jouw beslissing, niet een stilzwijgende van mij.

---

## 2 · De look

**Donker, warm, filmisch.** Niet de witte webshop-look, maar de sfeer van een
meubelmerk: diep bruin-zwart, warm licht, grote foto's die de volle breedte pakken.

| | |
|---|---|
| **Achtergrond** | Diep espresso `#1A1410` → warm houtbruin `#2A211A`, met een zachte gloed |
| **Accent** | Ons brons `#CE9766`, feller voor knoppen: `#E0A878` |
| **Licht vlak** | Crème `#F8F3E8` voor de leesbare blokken (zakelijk, documenten) |
| **Typografie** | **Fraunces** voor de koppen (een serif met karakter, past bij hout — we gebruiken hem al in de app) + **Inter** voor de tekst |
| **Koppen** | Groot. Heel groot. `clamp(44px, 7vw, 104px)`, strak op elkaar |
| **Vorm** | Ronde hoeken 16–24 px, zachte schaduwen, nooit harde kaders |

---

## 3 · De startpagina, scherm per scherm

```
┌──────────────────────────────────────────────────────────┐
│  1 · HERO — volledig scherm                              │
│                                                          │
│     [ echte foto K300, gedekte tafel, donkere gradient ] │
│                                                          │
│     TWO WORLDS,            ← Fraunces, 104px, crème      │
│     ONE WOOD.                                            │
│                                                          │
│     Garden tables that seat twelve.                      │
│     Living-room pieces that seat one.                    │
│                                                          │
│     [ Find your shop ]  [ Request a quote ]              │
│                                                          │
│     ↓ scroll          BE · DE · FR  — three companies    │
└──────────────────────────────────────────────────────────┘
```

**Beweging:** de foto schaalt traag van 1.08 naar 1.00 bij het laden (8 seconden), de
tekst komt per regel op. Bij scrollen schuift de foto langzamer dan de tekst
(parallax). Alles respecteert `prefers-reduced-motion`.

```
┌──────────────────────────────────────────────────────────┐
│  2 · DE TWEE WERELDEN — twee halve schermen naast elkaar │
│                                                          │
│   ┌─────────────────────┐  ┌─────────────────────┐      │
│   │ [foto K180 in tuin] │  │ [foto Liora kamer]  │      │
│   │                     │  │                     │      │
│   │  OUTDOOR            │  │  INDOOR             │      │
│   │  Picnic tables,     │  │  Coffee tables,     │      │
│   │  benches, beer sets │  │  dressers, bedside  │      │
│   │  140 → 300 cm       │  │  Curved, warm, calm │      │
│   └─────────────────────┘  └─────────────────────┘      │
│                                                          │
│   Bij hover: de foto zoomt in, de andere helft dimt.     │
└──────────────────────────────────────────────────────────┘
```

Dit is het antwoord op "we doen ook binnen": het staat **meteen naast buiten**, even
groot, op het tweede scherm. Niet als voetnoot.

```
┌──────────────────────────────────────────────────────────┐
│  3 · DE HOUTNERF — volle breedte, zelf getekend          │
│                                                          │
│   [ SVG-jaarringen die meebewegen met de scroll ]        │
│                                                          │
│   "From spruce to teak."                                 │
│   Pressure-treated spruce for outdoors. Teak for life.   │
└──────────────────────────────────────────────────────────┘
```

Dit is het stuk dat ik **genereer**: een SVG van jaarringen, opgebouwd uit de echte
kleuren van de foto `picknicktafel-k180-planken-detail`. Hij draait traag mee met de
scroll. Met ons logo in de hoek.

```
┌──────────────────────────────────────────────────────────┐
│  4 · DE GROEP — drie kaarten op een Europakaart          │
│                                                          │
│      [ SVG-kaart van Europa, donker, met drie            │
│        gloeiende punten: Gent · Kleve · Sainte Catherine]│
│                                                          │
│   BV (holding + BE)   GmbH (DE/AT)   SARL (FR/MC)        │
│   e-woodproducts.com  picknickbaenke tablesdepiquenique  │
└──────────────────────────────────────────────────────────┘
```

De Europakaart teken ik zelf als SVG (geen externe kaartdienst, geen kosten, geen
tracking). De landen waar we leveren lichten op in brons.

```
┌──────────────────────────────────────────────────────────┐
│  5 · WINKELKIEZER — klik je land                         │
│  6 · ZAKELIJK — brede band, crème, met één knop          │
│  7 · VOET — donker, de drie vennootschappen              │
└──────────────────────────────────────────────────────────┘
```

---

## 4 · De andere pagina's

| pagina | wat verandert |
|---|---|
| **Shops** | Landkaarten worden tegels met een echte foto per winkel |
| **Business** | Blijft rustig en crème — een gemeente moet een formulier kunnen lezen, niet bewonderen. Wel: een brede fotoband bovenaan en nette velden |
| **Documents** | Blijft een tabel. Hier telt duidelijkheid, niet sfeer. Wel in de nieuwe typografie |
| **Offerte** | Ongemoeid. Die moet printen op A4 |

---

## 5 · Taal — Engels wordt de hoofdtaal

| nu | wordt |
|---|---|
| `/` → taal van de browser | `/` → **`/en/`**, met een nette taalkiezer |
| nl · fr · de · en | **en** · nl · fr · de (Engels eerst, overal) |
| x-default = en | blijft en ✓ |

De Engelse teksten worden de brontekst; de andere drie zijn vertalingen daarvan.
Dat betekent ook: de koppen worden Engels geschreven, niet vertaald uit het Nederlands
("Two worlds, one wood" werkt in het Engels, "Twee werelden, één hout" niet).

---

## 6 · Wat ik ga genereren (en wat niet)

| ik maak zelf | hoe |
|---|---|
| Jaarringen-textuur | SVG, kleuren uit onze eigen plankfoto |
| Europakaart met de drie zetels | SVG, handgetekend pad |
| Iconen (levering, offerte, bestek, toonzaal) | SVG, één lijnstijl |
| Korrel- en houtnerf-overlay | SVG-ruis, heel subtiel |
| De beweging (parallax, inzoomen, opkomen) | CSS + een paar regels JS |
| Logo op elke eigen visual | vast, volgens de afspraak |

| ik maak **niet** | waarom |
|---|---|
| AI-foto's van tafels of tuinen | vaste regel: geen AI-beelden — en we hebben betere echte |
| Foto's van mensen | die hebben we niet in eigendom |
| Een nieuwe fotoshoot | dat is jouw werk, niet het mijne |

---

## 7 · Wat het blijft doen

Het ontwerp verandert, de werking niet:
- de zakelijke balie routeert nog steeds per land naar BV, GmbH of SARL;
- de documentenkast blijft uit de productkern komen;
- geen onbevestigde claims, geen FSC/PEFC, geen prijzen, geen rekeningnummers;
- alles moet werken op 390 px breed en zonder JavaScript leesbaar blijven.

**Snelheid:** de hero-foto wordt in moderne formaten geleverd (AVIF/WebP via Shopify's
eigen `?width=`), lui geladen onder de vouw. Doel: onder 400 KB voor het eerste scherm.

---

## 8 · Stand: gebouwd en live (1 okt 2026)

Alles uit dit plan staat op **www.e-productseurope.com**:

| | |
|---|---|
| Hero over het volle scherm | ✓ met de echte foto van de gedekte K300 |
| "Two worlds, one wood" | ✓ buiten en binnen even groot naast elkaar |
| Jaarringen-band | ✓ zelf getekende SVG, met logo in de hoek |
| Drie vennootschappen | ✓ donkere kaarten |
| Engels als hoofdtaal | ✓ `/` → `/en/`, taalkiezer met EN vooraan |
| Alleen echte foto's | ✓ `data/beelden.json` houdt de AI-uploads er bewust buiten |
| Telefoon | ✓ geen overloop op 390 px, geen JS-fouten |

**Twee fouten die ik onderweg vond en herstelde:** de levertabel stond in het
Nederlands op álle talen, en de vinkjeslijst had zijn opmaak verloren.

**Nog niet gedaan uit dit plan:** de Europakaart met de drie zetels (sectie 3, blok 4)
en de fototegels per winkel op de Shops-pagina. Die volgen als je het ontwerp goedkeurt.

---

## 9 · Wat ik van jou nodig heb

1. **Ga ik hiermee door?** Of wil je een andere richting (lichter, strakker, drukker)?
2. **AI-beelden**: akkoord dat ik ze weglaat en alleen echte foto's gebruik?
3. **De hero-foto**: ik kies `picknicktafel-k300-gedekte-tafel-op-grind`. Of heb je een
   favoriet?
4. **Eigen beelden**: heb je nog niet-gepubliceerde foto's van de toonzaal, het magazijn
   of een levering? Die zouden goud zijn voor het stuk over de groep.
