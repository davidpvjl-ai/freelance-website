# Wizard workflow — van submission tot klant

Stap-voor-stap proces dat je doorloopt zodra een bezoeker de intake-wizard heeft ingevuld.

---

## Wat er automatisch gebeurt

1. Bezoeker doorloopt de 14 vragen op `/websites-laten-maken.html`
2. Bezoeker krijgt direct een **eerste preview** te zien (fallback-tekst, generieke headline)
3. Je ontvangt een **e-mail van Formspree** met alle antwoorden en contactgegevens
4. Bezoeker ziet boodschap: *"David stuurt binnen 24u je definitieve preview"*

---

## Wat jij doet (binnen 24u)

### Stap 1 — Open Claude.ai en plak deze prompt:

```
Je bent een conversie-copywriter in het Nederlands die voor MKB-websites scherpe hero-copy schrijft.

Genereer voor de hero-sectie van een website:

1. HEADLINE — max 8 woorden, benoemt de pijn óf de belofte concreet. Geen wollige woorden.
2. SUB-HEADLINE — 1 zin, vertaalt headline naar specifiek voordeel met getal/feit waar mogelijk.
3. CTA-KNOPTEKST — concreet, voordeel-gericht, max 4 woorden.

Schrijf 3 varianten van elk, zodat David kan kiezen.

Context uit intake:
- Bedrijf: [PLAK Q1 HIER]
- Doelgroep: [PLAK Q2 HIER]
- Hoofdactie die bezoeker moet doen: [PLAK Q3 HIER]
- Pijnpunten die ze willen wegnemen: [PLAK Q4 HIER]
- Wat hen uniek maakt: [PLAK Q5 HIER]
- Objecties die ze verwachten: [PLAK Q7 HIER]
- Gewenste sfeer: [PLAK Q8 HIER]

Output format:
HEADLINES
1. ...
2. ...
3. ...

SUB-HEADLINES
1. ...
2. ...
3. ...

CTA-KNOPTEKST
1. ...
2. ...
3. ...

Geef daarna in 2 zinnen je advies welke combinatie het sterkste is en waarom.
```

### Stap 2 — Vul de placeholders in
Open de Formspree-mail. Kopieer de antwoorden bij `q1_bedrijf`, `q2_doelgroep` etc. naar de juiste plekken in de prompt.

### Stap 3 — Genereer en kies
Claude geeft 3x3 opties. Kies de combinatie die voor jou voelt als de sterkste — meestal de variant met het meest concrete getal of de scherpste belofte.

### Stap 4 — Bouw de definitieve preview
Twee opties:
- **A. Cowork mode** — vraag Claude om een aangepaste versie van de wizard-preview met de gekozen copy en stuur dat als HTML naar de klant.
- **B. Screenshot** — open een lokale kopie van de wizard, hard-code de gekozen copy in, maak een mooie screenshot van het preview-scherm.

### Stap 5 — Stuur de e-mail naar de klant
Template:

```
Onderwerp: Hier is je persoonlijke website-preview, [voornaam]

Hoi [voornaam],

Bedankt voor het invullen van de intake — leuk om te zien wat [bedrijfsnaam] doet.

Op basis van je antwoorden heb ik een definitieve eerste versie gebouwd:

[afbeelding/screenshot]

Hoofdpunten:
• Headline: "[gekozen headline]"
• Belofte naar bezoeker: "[gekozen sub-headline]"
• Concrete actie: "[gekozen CTA]"

Mijn observatie: [korte uitleg waarom deze combinatie sterk werkt voor jouw doelgroep]

Wil je dit doorpakken? Plan een gratis strategie-sessie van 30 min waarin ik live de rest van je site doorbouw:
[Calendly-link of WhatsApp]

Groet,
David
```

---

## Hoe je upgrade later
Als je 5+ submissions per week krijgt en het wordt te veel handwerk:
1. Cowork scheduled task — elke ochtend automatisch verwerken
2. Daarna eventueel Anthropic API voor real-time preview

Voor nu: handmatig is goed. Je leert tegelijk wat goed werkt en wat niet, en kunt prompts blijven verbeteren.
