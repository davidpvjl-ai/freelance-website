
// ===== SEED DATA =====
const SEED_PROJECTS = [
  {id:'p1',title:'Webshop · Modewinkel',desc:'Shopify redesign met conversie-optimalisatie en nieuwe checkout.',category:'website',status:'published',result:'+42% omzet in 60 dagen',tags:['shopify','e-commerce'],thumb:'',video:'',client:'Modewinkel B.V.',created:'2025-12-14'},
  {id:'p2',title:'Website · Installatiebureau',desc:'Nieuwe zakelijke site + lokale SEO strategie met regio-pagina\'s.',category:'website',status:'published',result:'+80% organisch verkeer',tags:['zakelijk','seo'],thumb:'',video:'',client:'Van der Berg Installaties',created:'2025-11-22'},
  {id:'p3',title:'AI Leadbot · B2B Adviesbureau',desc:'Geautomatiseerde leadkwalificatie via AI-chatbot + n8n naar HubSpot.',category:'automatisering',status:'published',result:'−15u handwerk/week',tags:['ai','n8n','hubspot'],thumb:'',video:'',client:'Strategia Advies',created:'2026-01-08'},
  {id:'p4',title:'E-mailflows · Webshop',desc:'Onboarding, winkelwagenverlating en review-flows in Klaviyo.',category:'automatisering',status:'published',result:'+22% herhaalaankopen',tags:['klaviyo','e-mail'],thumb:'',video:'',client:'Modewinkel B.V.',created:'2025-10-03'},
  {id:'p5',title:'Studentenkaartspel',desc:'Een kaartspel voor studenten, van concept tot productie.',category:'eigen',status:'published',result:'1.200 verkocht',tags:['game','creator'],thumb:'',video:'https://youtube.com/...',client:'',created:'2025-09-15'},
  {id:'p6',title:'SaaS MVP in 30 dagen',desc:'Mijn nieuwste eigen SaaS — volg de bouw op YouTube.',category:'eigen',status:'draft',result:'',tags:['saas','build-in-public'],thumb:'',video:'https://youtube.com/...',client:'',created:'2026-04-01'},
  {id:'p7',title:'Landingspagina · Coach',desc:'Conversiepagina voor online cursus met tracking.',category:'website',status:'draft',result:'',tags:['landing','conversie'],thumb:'',video:'',client:'Coach Academy',created:'2026-03-28'},
];

const SEED_LEADS = [
  {id:'l1',name:'Mark de Vries',email:'mark@bakkerijdvr.nl',company:'Bakkerij De Vries',phone:'+31 6 12345678',service:'website',budget:'€5k-10k',message:'We willen een nieuwe webshop voor onze bakkerij. We hebben 3 vestigingen en willen online bestellen mogelijk maken.',status:'new',source:'homepage',notes:'',date:'2026-04-21'},
  {id:'l2',name:'Lisa Jansen',email:'l.jansen@strategia.nl',company:'Strategia Advies',phone:'',service:'automatisering',budget:'€10k+',message:'Interesse in jullie AI leadbot. Hebben jullie een case study?',status:'contacted',source:'automatisering',notes:'Gebeld di 22/4, stuur voorstel deze week',date:'2026-04-20'},
  {id:'l3',name:'Peter Bakker',email:'peter@bakkersgroep.nl',company:'Bakkers Groep',phone:'+31 6 98765432',service:'website',budget:'€2k-5k',message:'Nieuwe website nodig, huidige site is verouderd.',status:'quoted',source:'websites',notes:'Voorstel verstuurd 18/4',date:'2026-04-17'},
  {id:'l4',name:'Sanne van Dijk',email:'sanne@dijkmodeshop.nl',company:'Dijk Mode',phone:'+31 6 11223344',service:'automatisering',budget:'€5k-10k',message:'Klaviyo flows en review automatisering.',status:'won',source:'automatisering',notes:'Kickoff 5 mei',date:'2026-04-10'},
  {id:'l5',name:'Ruben Smit',email:'ruben@smitadvies.nl',company:'Smit Advies',phone:'',service:'website',budget:'<€2k',message:'Simpele 1-pager voor zzp praktijk.',status:'lost',source:'homepage',notes:'Budget te laag',date:'2026-04-05'},
  {id:'l6',name:'Nina Groot',email:'nina@grootfashion.com',company:'Groot Fashion',phone:'+31 6 55443322',service:'website',budget:'€10k+',message:'Webshop migratie van Magento naar Shopify.',status:'new',source:'websites',notes:'',date:'2026-04-22'},
  {id:'l7',name:'Tom Willems',email:'tom@willemsauto.nl',company:'Willems Auto',phone:'+31 6 77889900',service:'automatisering',budget:'€2k-5k',message:'CRM inrichting Pipedrive.',status:'contacted',source:'automatisering',notes:'Vraag budget-indicatie',date:'2026-04-19'},
  {id:'l8',name:'Emma Visser',email:'emma@visserbistro.nl',company:'Visser Bistro',phone:'',service:'website',budget:'€2k-5k',message:'Reserveringssysteem + menukaart.',status:'quoted',source:'homepage',notes:'Wacht op akkoord',date:'2026-04-15'},
];

const SEED_POSTS = [
  {
    id:'b1',
    title:'Waarom elke MKB\'er moet automatiseren in 2026',
    h1:'Waarom elke MKB\'er moet automatiseren in 2026',
    slug:'mkb-automatiseren-2026',
    excerpt:'5 repetitieve taken die je vandaag kunt automatiseren — met concrete n8n voorbeelden.',
    body:'<p>Automatisering is geen luxe meer, het is een overlevingsvoorwaarde. In 2026 verliezen MKB\'ers die handmatig blijven werken structureel aan concurrenten die hun processen hebben geautomatiseerd.</p><h2>1. Leadopvolging</h2><p>Elke lead die meer dan 5 minuten wacht op een reactie, is 80% minder waard. Met n8n + HubSpot zet je een flow op die automatisch een eerste e-mail stuurt, een taak aanmaakt voor sales en een Slack-melding pusht.</p><h2>2. Factuurverwerking</h2><p>Inkomende PDF-facturen uitlezen met AI (GPT-4 Vision), boeken in Moneybird en archiveren in Google Drive. Bespaart gemiddeld 4 uur per week.</p><h2>3. Rapportage</h2><p>Wekelijkse rapporten uit Shopify, Google Analytics en HubSpot — automatisch samengevat in één Notion-pagina elke maandagochtend.</p><h2>4. Reviews verzamelen</h2><p>7 dagen na elke levering: automatische review-request via Klaviyo, met incentive voor foto\'s.</p><h2>5. Klantonboarding</h2><p>Nieuwe klant tekent? Automatisch: welkoms-e-mail, Slack-channel, Notion-template, Google Drive-folder, kickoff-afspraak voorstel.</p><p>Begin klein. Kies één flow, bouw \'m, meet de tijdwinst. Dan de volgende.</p>',
    category:'automatisering',
    tags:['n8n','productiviteit','mkb','ai'],
    status:'published',
    emoji:'⚡',
    image:'',
    video:'',
    metaTitle:'MKB automatiseren in 2026 — 5 concrete voorbeelden | David Spijker',
    metaDesc:'Ontdek 5 repetitieve taken die je als MKB\'er vandaag kunt automatiseren. Inclusief concrete n8n en AI voorbeelden uit de praktijk.',
    relatedProject:'p3',
    date:'2026-04-12',
    views:1240
  },
  {
    id:'b2',
    title:'Shopify vs. WooCommerce: wat past bij jou?',
    h1:'Shopify vs. WooCommerce — welke past bij jouw webshop?',
    slug:'shopify-vs-woocommerce',
    excerpt:'Een eerlijke vergelijking op basis van 15 webshop-projecten.',
    body:'<p>De keuze tussen Shopify en WooCommerce is geen technische keuze — het is een strategische keuze. Na 15 webshop-projecten voor Nederlandse MKB\'ers, hier mijn eerlijke analyse.</p><h2>Shopify: voor wie?</h2><p>Snelheid. Als je binnen 2 weken live wilt en niet wilt nadenken over hosting, security of updates — Shopify. Maandelijks €29-299, alles inclusief.</p><h2>WooCommerce: voor wie?</h2><p>Controle. Je hebt al een WordPress-site, je wilt custom features, of je verkoopt producten waar Shopify stroef op reageert (downloads, subscripties, B2B).</p><h2>De echte kosten</h2><p>Shopify lijkt duurder op papier, maar WooCommerce eet je tijd op met onderhoud. Reken op €150-300/maand aan plugins, hosting, security en updates.</p><h2>Mijn keuze</h2><p>90% van de MKB-webshops die ik bouw: Shopify. De 10% uitzonderingen: sterk gepersonaliseerde B2B-portalen of sites met >500 SKU\'s met complexe varianten.</p>',
    category:'website',
    tags:['shopify','woocommerce','webshop','vergelijking'],
    status:'published',
    emoji:'🛍️',
    image:'',
    video:'',
    metaTitle:'Shopify vs WooCommerce — eerlijke vergelijking 2026',
    metaDesc:'15 webshop-projecten vergeleken: wanneer kies je Shopify, wanneer WooCommerce? Inclusief echte kosten en use-cases.',
    relatedProject:'p1',
    date:'2026-03-28',
    views:890
  },
  {
    id:'b3',
    title:'Build in public: mijn eerste SaaS maand',
    h1:'Build in public — wat ik leerde in 30 dagen SaaS bouwen',
    slug:'build-in-public-eerste-saas-maand',
    excerpt:'Reality check: wat ik heb geleerd in 30 dagen bouwen.',
    body:'<p>30 dagen geleden startte ik mijn eerste SaaS in het openbaar. Elke dag gefilmd, elke feature op camera, elke bug publiek. Dit zijn de 5 grootste lessen.</p><h2>1. MVP betekent écht minimal</h2><p>Ik had bedacht: login, dashboard, 3 features, betaling. Realiteit: login + 1 feature + handmatige facturering was genoeg voor de eerste 10 betalende gebruikers.</p><h2>2. Publiek bouwen verkoopt zichzelf</h2><p>Via YouTube shorts en TikTok groeide mijn wachtlijst naar 340 mensen vóór launch. Zonder marketing budget.</p><h2>3. Feedback loops zijn alles</h2><p>Een Discord met 50 early users gaf me betere product-input dan 6 maanden user interviews.</p><h2>4. Deploy wekelijks, niet dagelijks</h2><p>Snel itereren is goed — maar dagelijks deployen in week 2 brak continu dingen. Wekelijks met preview-branches = sweet spot.</p><h2>5. Documenteer alles</h2><p>Elke video, elke tweet, elke bug. Het is je marketing-content én je devlog tegelijk.</p>',
    category:'eigen',
    tags:['saas','build-in-public','creator'],
    status:'published',
    emoji:'🚀',
    image:'',
    video:'https://youtube.com/watch?v=example',
    metaTitle:'Build in Public — 5 lessen uit 30 dagen SaaS bouwen',
    metaDesc:'Reality check van mijn eerste SaaS-maand: wat werkte, wat brak, en wat ik de volgende keer anders doe.',
    relatedProject:'p6',
    date:'2026-03-15',
    views:2100
  },
  {
    id:'b4',
    title:'AI in je bedrijf: hype vs. werkelijkheid',
    h1:'AI in je bedrijf — hype vs. werkelijkheid in 2026',
    slug:'ai-bedrijf-hype-vs-werkelijkheid',
    excerpt:'Welke AI-tools écht tijd besparen — en welke niet.',
    body:'<p>Iedereen roept "AI!", maar weinigen zetten het concreet in. Na 8 AI-integraties voor klanten, hier de eerlijke stand van zaken.</p><h2>Wat werkt</h2><ul><li>Leadkwalificatie-chatbots (GPT-4 + eigen context)</li><li>Factuur/bon-uitlezing (Vision models)</li><li>Content-herbruik (transcriptie → blog → social)</li><li>Klantenservice tier 1 (FAQ + smart routing)</li></ul><h2>Wat teleurstelt</h2><ul><li>Volledig autonome agents (nog te brittle)</li><li>AI-gegenereerde blogs zonder editing (Google detecteert het)</li><li>AI-video\'s voor serieuze merken (valt door de mand)</li></ul>',
    category:'automatisering',
    tags:['ai','gpt','automatisering'],
    status:'draft',
    emoji:'🤖',
    image:'',
    video:'',
    metaTitle:'AI voor MKB — wat werkt écht in 2026',
    metaDesc:'Eerlijke evaluatie van AI-tools voor het MKB. Wat werkt, wat niet, en waar je geld mee bespaart.',
    relatedProject:'',
    date:'2026-04-20',
    views:0
  },
];

const SEED_WIZARD_SUBS = [
  {
    id:'w1', date:'2026-04-22', status:'new',
    answers:{
      q1:'Premium evenementenlocatie in een gerestaureerde graanmolen — bruiloften, bedrijfsfeesten en gala\'s.',
      q2:'Stellen tussen 28-40 die een unieke trouwlocatie zoeken buiten de stad, en eventmanagers van middelgrote bedrijven (50-300 medewerkers) die op zoek zijn naar een sfeervolle off-site locatie binnen 1u rijden van de Randstad.',
      q3:'Een gratis kennismakingscall boeken', q3_other:'',
      q4:['Geen website','Social media (Instagram)'],
      q5:'Multi-page service site',
      q6:['Foto-galerij','Boekingsformulier','Testimonials','Over ons','Routebeschrijving'],
      q7:'Bezoekers vinden ons fysiek lastig te bereiken en weten niet of we ook kleine groepen aankunnen. Daarnaast denken ze dat we duur zijn.',
      q8:['Premium & exclusief','Vertrouwen & betrouwbaarheid'],
      q9_mode:'auto', q9_colors:{primary:'#1f2937', accent:'#d4af37', background:'#fafafa'}, q9_logo:null,
      q10:'full', q11:['slide','subtle'], q12:'sharp', q12_bg:'light', q13:'', q14:'Binnen een maand',
      contact:{name:'Femke de Jong', email:'femke@graanmolen-events.nl', phone:'+31 6 23456789', company:'De Graanmolen Events', currentSite:''}
    },
    generated:{ headline:'Trouw in een 17e-eeuwse graanmolen', subHeadline:'Een exclusieve locatie voor onvergetelijke bruiloften en bedrijfsevenementen — op 45 minuten van Amsterdam.', ctaText:'Plan een rondleiding' }
  },
  {
    id:'w2', date:'2026-04-20', status:'contacted',
    answers:{
      q1:'Online cursussen mindset & ondernemen voor vrouwelijke ZZP\'ers die hun bedrijf willen laten groeien.',
      q2:'Vrouwen 30-45 met een eigen onderneming (coach, therapeut, marketeer) die genoeg willen verdienen om écht financieel onafhankelijk te zijn, maar vastlopen op mindset en zichtbaarheid.',
      q3:'Zich inschrijven voor mijn nieuwsbrief', q3_other:'',
      q4:['Bestaande site die ik wil vervangen'],
      q5:'Single landing page',
      q6:['Nieuwsbrief opt-in','Testimonials','Over mij','Blog'],
      q7:'Bezoekers twijfelen of online cursussen wel echt iets opleveren — ze hebben er al meer gekocht en niets afgemaakt.',
      q8:['Toegankelijk & vriendelijk','Energiek & dynamisch'],
      q9_mode:'custom', q9_colors:{primary:'#ea580c', accent:'#fbbf24', background:'#fffbeb'}, q9_logo:null,
      q10:'split', q11:['fade','interactive'], q12:'rounded', q12_bg:'warm', q13:'', q14:'Binnen 3 maanden',
      contact:{name:'Anouk Hendriks', email:'anouk@anoukhendriks.coach', phone:'+31 6 11223344', company:'Anouk Hendriks Coaching', currentSite:'anoukhendriks.nl'}
    },
    generated:{ headline:'Bouw het bedrijf waar je écht van leeft', subHeadline:'Voor vrouwelijke ondernemers die klaar zijn om groter te denken, zichtbaarder te zijn en hun omzet te verdubbelen.', ctaText:'Ja, ik wil starten' }
  },
  {
    id:'w3', date:'2026-04-18', status:'converted',
    answers:{
      q1:'Specialist in zonnepaneel-installaties voor MKB-bedrijven met platte daken vanaf 200m².',
      q2:'MKB-eigenaren met een eigen bedrijfspand — denk groothandel, productie, garage — die hun energierekening willen verlagen en gebruik willen maken van SDE++ subsidie voor 2026.',
      q3:'Een form invullen voor offerte of contact', q3_other:'',
      q4:['Geen website'],
      q5:'Multi-page service site',
      q6:['Offerte-formulier','Cases / portfolio','Testimonials','FAQ','Subsidie-calculator'],
      q7:'Ze denken dat zonnepanelen op een bedrijfspand duur en complex zijn, en weten niet welke subsidies nog gelden.',
      q8:['Vertrouwen & betrouwbaarheid','Autoritair & expert'],
      q9_mode:'auto', q9_colors:{primary:'#1e3a8a', accent:'#3b82f6', background:'#f8fafc'}, q9_logo:null,
      q10:'centered', q11:['subtle'], q12:'sharp', q12_bg:'light', q13:'', q14:'Deze week — urgent',
      contact:{name:'Bart Vermeulen', email:'b.vermeulen@zonnedakpro.nl', phone:'+31 6 55667788', company:'ZonneDak Pro', currentSite:''}
    },
    generated:{ headline:'Verlaag je energierekening met 60% in 2026', subHeadline:'Zonnepaneel-installaties voor MKB-bedrijfspanden — met SDE++ subsidie regelen we voor je.', ctaText:'Vraag gratis offerte aan' }
  },
  {
    id:'w4', date:'2026-04-15', status:'archived',
    answers:{
      q1:'Hondenuitlaatservice in Amsterdam-Zuid.',
      q2:'Drukke professionals tussen 28-45 die overdag werken en geen tijd hebben om hun hond uit te laten. Wonen in De Pijp, Oud-Zuid of Buitenveldert.',
      q3:'Direct iets kopen', q3_other:'',
      q4:['Social media (Instagram)','Mond-tot-mond'],
      q5:'Single landing page',
      q6:['Boekingsformulier','Prijzen','Routebeschrijving','Over ons'],
      q7:'Mensen willen weten of hun hond veilig en met aandacht behandeld wordt — niet zomaar in een groep van 15.',
      q8:['Toegankelijk & vriendelijk','Speels & creatief'],
      q9_mode:'auto', q9_colors:{primary:'#16a34a', accent:'#84cc16', background:'#f7fee7'}, q9_logo:null,
      q10:'split', q11:['slide'], q12:'rounded', q12_bg:'light', q13:'', q14:'Hoeft geen haast bij',
      contact:{name:'Tessa Bakker', email:'tessa@gmail.com', phone:'+31 6 99887766', company:'', currentSite:''}
    },
    generated:{ headline:'Jouw hond, in de beste handen', subHeadline:'Kleine groepen, vaste begeleiders, en elke dag uren beweging in Amsterdam-Zuid.', ctaText:'Boek een wandeling' }
  }
];

const SEED_PRODUCTS = [
  {
    id:'pr1',
    title:'Social Media AI Bot',
    slug:'social-media-ai-bot',
    tagline:'Een AI-agent die jouw social media draait — op autopilot',
    excerpt:'Een AI-agent die jouw merk leert kennen en wekelijks social posts schrijft, plant en publiceert. Jij houdt regie, de AI doet het werk.',
    audience:'evenementlocaties, hotels en MKB met een merkidentiteit',
    emoji:'🤖',
    image:'',
    status:'published',
    relatedPost:'mkb-automatiseren-2026',
    problem:'<p>Consistente social media is belangrijk — maar het schiet erbij in. Personeel heeft geen tijd, een bureau kost €1.500+ per maand en intern pakt niemand het echt op.</p><p>Het resultaat: posts die er soms zijn, soms niet, en die niet de uitstraling hebben die jouw locatie verdient.</p>',
    solution:'<p>Wij bouwen een AI-agent die jouw merk leert kennen en zelfstandig social media content maakt. Hij analyseert je locatie, je toon, je events en je doelgroep — en levert wekelijks kant-en-klare posts aan voor Instagram, LinkedIn en Facebook.</p><p>Jij keurt goed in een dashboard. Of laat hem direct plaatsen. Geen bureau-overhead, geen wachttijd.</p>',
    forWho:[
      'Evenementlocaties met 1+ event per week',
      'Hotels en restaurants met een eigen merkidentiteit',
      'MKB-bedrijven die actief willen zijn op social maar geen tijd hebben',
      'Eigenaren die liever ondernemen dan content schrijven'
    ],
    whatYouGet:[
      'AI-agent op maat getraind op jouw merk en stijl',
      'Wekelijks 5-7 posts (tekst + beeldsuggestie)',
      'Automatische planning naar Instagram, LinkedIn en Facebook',
      'Eigen dashboard om goed te keuren of aan te passen',
      'Maandelijkse evaluatie en bijsturing',
      '30 dagen support na livegang',
      'Onboarding-sessie van 2 uur'
    ],
    results:[
      {label:'Bespaart 8-10 uur per week aan content-werk',icon:'⏱'},
      {label:'Consistente aanwezigheid op je belangrijkste kanalen',icon:'📈'},
      {label:'Posts die passen bij jouw merk — geen generieke AI-praatjes',icon:'🎯'},
      {label:'Meer engagement door regelmaat en kwaliteit',icon:'💬'}
    ],
    process:[
      {title:'Kennismaking',desc:'30 minuten — we kijken of jouw situatie past.',duration:'30 min'},
      {title:'Setup & training',desc:'Ik bouw en train de AI-agent op jouw merk, toon en kanalen.',duration:'1-2 weken'},
      {title:'Livegang',desc:'Eerste posts gaan live. Jij keurt goed of laat ‘m direct plaatsen.',duration:'Week 3'},
      {title:'Optimalisatie',desc:'Maandelijks bijschaven op basis van wat het beste presteert.',duration:'Doorlopend'}
    ],
    tiers:[
      {name:'Basis',desc:'Voor wie net begint',setup:'€ 1.250',monthly:'€ 195/mnd',badge:'',features:['1 platform (Instagram óf LinkedIn)','4 posts per maand','Goedkeuren via dashboard','E-mail support'],cta:'Kies Basis'},
      {name:'Pro',desc:'Voor groeiende bedrijven',setup:'€ 2.450',monthly:'€ 395/mnd',badge:'Aanbevolen',features:['3 platforms (Instagram, LinkedIn, Facebook)','20 posts per maand','Automatische planning + publicatie','Maandelijkse evaluatie','Prioriteit support'],cta:'Kies Pro'},
      {name:'Maatwerk',desc:'Voor complexe situaties',setup:'Vanaf € 4.500',monthly:'Op aanvraag',badge:'',features:['Alles in Pro','Custom integraties (CRM, boekingssysteem)','Meerdere merken of locaties','Persoonlijk contact'],cta:'Plan gesprek'}
    ],
    faqs:[
      {q:'Hoe weet de AI hoe ons merk klinkt?',a:'In de onboarding analyseren we je bestaande content, website en eventueel branding-document. Daarmee trainen we de AI op jouw exacte toon en stijl. In de eerste 2 weken stuur jij bij waar nodig.'},
      {q:'Wat als de posts niet goed zijn?',a:'Jij hebt altijd het laatste woord. In het Basis- en Pro-pakket keur je elke post goed voordat ‘ie live gaat. Niet goed? Eén klik en de AI maakt een nieuwe versie.'},
      {q:'Kan ik op elk moment stoppen?',a:'Ja. Maandelijks opzegbaar. Je houdt de gegenereerde content en de AI-instellingen.'},
      {q:'Wat als ik geen beelden heb?',a:'De AI genereert beeldsuggesties op basis van je events en bibliotheek. Voor het Pro-pakket helpen we ook met simpele AI-beelden of stockfoto-koppelingen.'},
      {q:'Hoe lang duurt het voordat het werkt?',a:'Setup en training duren 1-2 weken. Daarna gaan de eerste posts live. Vanaf maand 2 zie je de eerste merkbare engagement-stijging.'}
    ],
    finalCta:{
      headline:'Klaar voor consistente social media zonder dagelijks werk?',
      sub:'Plan een vrijblijvend gesprek van 30 minuten. We kijken samen of dit pakket bij jou past.',
      primary:'Plan gesprek',
      primaryUrl:'index.html#contact',
      secondary:'Stuur bericht',
      secondaryUrl:'index.html#contact'
    },
    created:'2026-04-28'
  }
];

// ===== STORE =====
const Store = {
  get(key, fallback){
    try{ const v = localStorage.getItem('ds_'+key); return v ? JSON.parse(v) : fallback; }
    catch(e){ return fallback; }
  },
  set(key, val){ localStorage.setItem('ds_'+key, JSON.stringify(val)); },
  init(){
    if(!localStorage.getItem('ds_projects')) this.set('projects', SEED_PROJECTS);
    if(!localStorage.getItem('ds_leads')) this.set('leads', SEED_LEADS);
    if(!localStorage.getItem('ds_posts')) this.set('posts', SEED_POSTS);
    if(!localStorage.getItem('ds_products')) this.set('products', SEED_PRODUCTS);
    if(!localStorage.getItem('ds_wizard_subs')) this.set('wizard_subs', SEED_WIZARD_SUBS);
    // migrate: ensure all posts have new fields
    const posts = this.get('posts', []);
    let migrated = false;
    const keys = ['h1','slug','body','tags','image','video','metaTitle','metaDesc','relatedProject'];
    posts.forEach(p=>{
      keys.forEach(k=>{ if(p[k]===undefined){ p[k] = (k==='tags')?[]:''; migrated = true; } });
      if(!p.slug && p.title){ p.slug = p.title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''); migrated = true; }
      if(!p.h1 && p.title){ p.h1 = p.title; migrated = true; }
    });
    if(migrated) this.set('posts', posts);
  },
  reset(){
    this.set('projects', SEED_PROJECTS);
    this.set('leads', SEED_LEADS);
    this.set('posts', SEED_POSTS);
    this.set('products', SEED_PRODUCTS);
    this.set('wizard_subs', SEED_WIZARD_SUBS);
  }
};
Store.init();

// ===== AUTH GUARD =====
function requireAuth(){
  if(localStorage.getItem('ds_auth') !== '1'){
    location.href = 'login.html';
  }
}
function logout(){
  localStorage.removeItem('ds_auth');
  location.href = 'login.html';
}

// ===== UTILS =====
function uid(){ return 'x'+Math.random().toString(36).slice(2,9); }
function fmtDate(s){
  if(!s) return '—';
  const d = new Date(s);
  return d.toLocaleDateString('nl-NL',{day:'numeric',month:'short',year:'numeric'});
}
function relDate(s){
  if(!s) return '';
  const diff = (Date.now() - new Date(s).getTime()) / 86400000;
  if(diff < 1) return 'Vandaag';
  if(diff < 2) return 'Gisteren';
  if(diff < 7) return Math.floor(diff)+'d geleden';
  if(diff < 30) return Math.floor(diff/7)+'w geleden';
  return fmtDate(s);
}
function escapeHtml(s){ return (s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function toast(msg, kind='success'){
  const t = document.createElement('div');
  t.className = 'toast '+kind;
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(()=>t.classList.add('show'));
  setTimeout(()=>{t.classList.remove('show'); setTimeout(()=>t.remove(),300);}, 2200);
}

// ===== SIDEBAR =====
function renderSidebar(active){
  const leads = Store.get('leads', []);
  const newLeads = leads.filter(l=>l.status==='new').length;
  const projects = Store.get('projects', []);
  const posts = Store.get('posts', []);
  const products = Store.get('products', []);
  const wizardSubs = Store.get('wizard_subs', []);
  const newWizardSubs = wizardSubs.filter(w=>w.status==='new').length;
  return `<aside class="sidebar">
    <div class="sb-logo">
      <div>
        <div style="display:flex;align-items:center;gap:8px"><span class="sb-logo-dot"></span><span class="sb-logo-text">David Spijker</span></div>
        <div class="sb-logo-sub">Admin</div>
      </div>
    </div>
    <div class="sb-section">Overzicht</div>
    <div class="sb-links">
      <a href="dashboard.html" class="sb-link ${active==='dashboard'?'active':''}"><span class="sb-ic">◈</span>Dashboard</a>
    </div>
    <div class="sb-section">Beheer</div>
    <div class="sb-links">
      <a href="projecten.html" class="sb-link ${active==='projects'?'active':''}"><span class="sb-ic">▣</span>Projecten<span class="sb-count">${projects.length}</span></a>
      <a href="crm.html" class="sb-link ${active==='crm'?'active':''}"><span class="sb-ic">◉</span>CRM / Leads<span class="sb-count">${newLeads||''}</span></a>
      <a href="content.html" class="sb-link ${active==='content'?'active':''}"><span class="sb-ic">✎</span>Content<span class="sb-count">${posts.length}</span></a>
      <a href="products.html" class="sb-link ${active==='products'?'active':''}"><span class="sb-ic">⧉</span>Producten<span class="sb-count">${products.length}</span></a>
      <a href="wizard.html" class="sb-link ${active==='wizard'?'active':''}"><span class="sb-ic">✦</span>Website wizard<span class="sb-count">${newWizardSubs||wizardSubs.length}</span></a>
    </div>
    <div class="sb-section">Snel</div>
    <div class="sb-links">
      <a href="../index.html" class="sb-link" target="_blank"><span class="sb-ic">↗</span>Bekijk publieke site</a>
    </div>
    <div class="sb-foot">
      <div class="sb-user" onclick="logout()" title="Uitloggen">
        <div class="sb-avatar">DS</div>
        <div class="sb-user-info">
          <div class="sb-user-name">David Spijker</div>
          <div class="sb-user-email">david.pvjl@gmail.com</div>
        </div>
        <span class="sb-logout">↩</span>
      </div>
    </div>
  </aside>`;
}
