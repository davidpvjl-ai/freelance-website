/* INTAKE WIDGET — state machine + screens + preview generator
   Brand: David Spijker · blauw, Space Grotesk + DM Sans
   Implementatie: vanilla JS, geen framework. Mount op #intake. */

(function(){
  'use strict';

  /* ============== CONFIG ============== */
  // Formspree endpoint — vervang YOUR_FORM_ID door je eigen Formspree ID na account-aanmaak
  const FORMSPREE_URL = 'https://formspree.io/f/mvzljdde';

  /* ============== STATE ============== */
  const TOTAL_QUESTIONS = 14;
  const state = {
    step: 0, // 0 = welcome, 1..14 = Q1..Q14, 15 = contact, 16 = loading, 17 = preview
    answers: {
      q1:'', q2:'', q3:'', q3_other:'',
      q4:[], q5:'', q6:[], q7:'', q8:[],
      q9_mode:'', q9_colors:{primary:'#1759e8', accent:'#3b6ef5', background:'#f7f8fc'}, q9_logo:null,
      q10:'', q11:'', q12:'', q12_bg:'', q13:'', q14:'',
      contact:{name:'', email:'', phone:'', company:'', currentSite:''}
    },
    generated:{ headline:'', subHeadline:'', ctaText:'' }
  };

  /* ============== VIBE → PALETTE ============== */
  const VIBE_PALETTES = {
    'Vertrouwen & betrouwbaarheid': { primary:'#1e3a8a', accent:'#3b82f6', background:'#f8fafc' },
    'Premium & exclusief':           { primary:'#1f2937', accent:'#d4af37', background:'#fafafa' },
    'Energiek & dynamisch':          { primary:'#dc2626', accent:'#fbbf24', background:'#fffbeb' },
    'Toegankelijk & vriendelijk':    { primary:'#16a34a', accent:'#84cc16', background:'#f7fee7' },
    'Speels & creatief':             { primary:'#a855f7', accent:'#ec4899', background:'#faf5ff' },
    'Autoritair & expert':           { primary:'#0f172a', accent:'#475569', background:'#f1f5f9' }
  };
  function paletteFromVibes(vibes){
    if(!vibes || !vibes.length) return VIBE_PALETTES['Vertrouwen & betrouwbaarheid'];
    const a = VIBE_PALETTES[vibes[0]] || VIBE_PALETTES['Vertrouwen & betrouwbaarheid'];
    if(vibes[1] && VIBE_PALETTES[vibes[1]]) return { primary:a.primary, accent:VIBE_PALETTES[vibes[1]].accent, background:a.background };
    return a;
  }

  /* ============== Q3 → CTA mapping ============== */
  const CTA_FALLBACK = {
    'Een gratis kennismakingscall boeken':'Plan een gratis call',
    'Een form invullen voor offerte of contact':'Vraag offerte aan',
    'Direct iets kopen':'Bekijk de shop',
    'Een demo aanvragen':'Vraag demo aan',
    'Zich inschrijven voor mijn nieuwsbrief':'Schrijf je in'
  };

  /* ============== HELPERS ============== */
  function $(sel,root){ return (root||document).querySelector(sel); }
  function el(tag, attrs, children){
    const n = document.createElement(tag);
    if(attrs) for(const k in attrs){
      if(k==='class') n.className = attrs[k];
      else if(k==='html') n.innerHTML = attrs[k];
      else if(k.startsWith('on') && typeof attrs[k]==='function') n.addEventListener(k.slice(2), attrs[k]);
      else n.setAttribute(k, attrs[k]);
    }
    if(children) (Array.isArray(children)?children:[children]).forEach(c=>{
      if(c==null) return;
      n.appendChild(typeof c==='string' ? document.createTextNode(c) : c);
    });
    return n;
  }

  /* ============== PERSISTENCE ============== */
  const STORAGE_KEY = 'intake-state-v1';
  const SCROLL_KEY = 'intake-scroll-v1';
  function saveState(){
    try{
      const { step, answers, generated } = state;
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, answers, generated }));
    }catch(e){}
  }
  function loadState(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      if(!raw) return;
      const saved = JSON.parse(raw);
      if(saved && typeof saved.step === 'number'){
        state.step = Math.min(17, Math.max(0, saved.step));
        // Don't restore loading screen — go to last completed question
        if(state.step===16) state.step = 15;
        if(saved.answers) Object.assign(state.answers, saved.answers);
        if(saved.generated) Object.assign(state.generated, saved.generated);
      }
    }catch(e){}
  }
  // Persist scroll position so refresh keeps the user where they were
  let scrollSaveTimer = null;
  window.addEventListener('scroll', ()=>{
    clearTimeout(scrollSaveTimer);
    scrollSaveTimer = setTimeout(()=>{
      try{ sessionStorage.setItem(SCROLL_KEY, String(window.scrollY)); }catch(e){}
    }, 120);
  }, {passive:true});

  /* ============== ROOT RENDER ============== */
  const root = document.getElementById('intake');
  function setHash(){
    const h = state.step===0 ? 'welkom' : state.step<=14 ? `stap-${state.step}` : state.step===15 ? 'contact' : state.step===16 ? 'preview-laden' : 'preview';
    if(location.hash !== '#'+h) history.replaceState(null,'','#'+h);
  }
  function go(step){
    if(step<0 || step>16) return;
    const html = document.documentElement;
    const prevBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = 'auto';
    // Lock body height so layout shrink can't reposition the viewport
    const lockedHeight = Math.max(document.body.offsetHeight, document.documentElement.offsetHeight);
    document.body.style.minHeight = lockedHeight + 'px';
    // Pin the wizard to its current viewport offset so it doesn't visually jump
    const rootViewportTop = root.getBoundingClientRect().top;
    state.step = step;
    render();
    setHash();
    saveState();
    const repin = ()=>{
      const delta = root.getBoundingClientRect().top - rootViewportTop;
      if(Math.abs(delta) > 0.5) window.scrollTo(0, window.scrollY + delta);
    };
    repin();
    requestAnimationFrame(()=>{
      repin();
      requestAnimationFrame(()=>{
        document.body.style.minHeight = '';
        html.style.scrollBehavior = prevBehavior;
      });
    });
  }

  function render(){
    let stage = root.querySelector('.iw-stage');
    if(!stage){
      stage = el('div',{class:'iw-stage'});
      root.appendChild(stage);
    }
    const oldProgress = stage.querySelector('.iw-progress');
    if(state.step>0 && state.step<=14){
      const newProgress = renderProgress();
      if(oldProgress) oldProgress.replaceWith(newProgress); else stage.insertBefore(newProgress, stage.firstChild);
    } else if(oldProgress){
      oldProgress.remove();
    }
    const oldScreen = stage.querySelector('.iw-screen');
    const newScreen = el('div',{class:'iw-screen'}, getScreen());
    if(oldScreen) oldScreen.replaceWith(newScreen); else stage.appendChild(newScreen);
    requestAnimationFrame(()=> newScreen.classList.add('iw-screen--in'));
  }

  function resetWizard(skipConfirm){
    if(!skipConfirm && !confirm('Wil je opnieuw beginnen? Je antwoorden worden gewist.')) return;
    try{ localStorage.removeItem('intake-state-v1'); }catch(e){}
    state.step = 0;
    state.answers = { q1:'', q2:'', q3:'', q3_other:'', q4:[], q5:'', q6:[], q7:'', q8:[], q9_mode:'', q9_colors:{primary:'#1759e8', accent:'#3b6ef5', background:'#f7f8fc'}, q9_logo:null, q10:'', q11:[], q12:'', q12_bg:'', q13:'', q14:'', contact:{name:'', email:'', phone:'', company:'', currentSite:''} };
    state.generated = {};
    render(); setHash(); saveState();
    window.scrollTo({top:0, behavior:'smooth'});
  }

  function renderProgress(){
    const wrap = el('div',{class:'iw-progress'});
    wrap.appendChild(el('div',{class:'iw-progress-meta'},[
      el('span',{class:'iw-progress-label'}, `Stap ${state.step} van ${TOTAL_QUESTIONS}`),
      el('div',{class:'iw-progress-actions'},[
        el('button',{class:'iw-back iw-back--reset', onclick:()=>resetWizard()}, '↻ Opnieuw'),
        el('button',{class:'iw-back', onclick:()=>go(state.step-1)}, '← Terug')
      ])
    ]));
    const bar = el('div',{class:'iw-progress-bar'});
    bar.appendChild(el('div',{class:'iw-progress-fill', style:`width:${(state.step/TOTAL_QUESTIONS)*100}%`}));
    wrap.appendChild(bar);
    return wrap;
  }

  function getScreen(){
    switch(state.step){
      case 0: return screenWelcome();
      case 1: return screenQ1();
      case 2: return screenQ2();
      case 3: return screenQ3();
      case 4: return screenQ4();
      case 5: return screenQ5();
      case 6: return screenQ6();
      case 7: return screenQ7();
      case 8: return screenQ8();
      case 9: return screenQ9();
      case 10: return screenQ10();
      case 11: return screenQ11();
      case 12: return screenQ12();
      case 13: return screenQ13();
      case 14: return screenQ14();
      case 15: return screenContact();
      case 16: return screenLoading();
      case 17: return screenPreview();
    }
  }

  /* ============== SHARED FOOTER (sticky CTA) ============== */
  function nextBar(opts){
    opts = opts || {};
    const enabled = opts.enabled !== false;
    const btn = el('button',{
      class:'iw-next' + (enabled?'':' iw-next--off'),
      disabled: enabled?null:'disabled',
      onclick: enabled ? (opts.onclick || (()=>go(state.step+1))) : null
    }, opts.label || 'Volgende →');
    return el('div',{class:'iw-footer'}, btn);
  }

  /* ============== SCREEN: WELCOME ============== */
  function screenWelcome(){
    return el('div',{class:'iw-welcome'},[
      el('div',{class:'iw-eyebrow'}, 'Intake — ±5 minuten'),
      el('h1',{class:'iw-h1'},[
        'Krijg in 5 minuten een persoonlijk plan + ',
        el('em',{}, 'voorproef van je website')
      ]),
      el('p',{class:'iw-sub'}, 'Geen algemene tips. Een conversie-advies plus een live mock-up van je hero-sectie en testimonials, in jouw huisstijl en met de animatie die jij kiest.'),
      el('div',{class:'iw-bullets'},[
        el('div',{class:'iw-bullet'},[el('span',{class:'iw-check'},'✓'), '13 korte vragen — geen formulier-marathon']),
        el('div',{class:'iw-bullet'},[el('span',{class:'iw-check'},'✓'), 'Direct een live preview van je site']),
        el('div',{class:'iw-bullet'},[el('span',{class:'iw-check'},'✓'), 'Geen verplichting, geen kosten'])
      ]),
      el('button',{class:'iw-cta-primary', onclick:()=>go(1)}, 'Start de intake →'),
      el('div',{class:'iw-trust'}, '● Vandaag opgestart — wees één van de eersten')
    ]);
  }

  /* ============== Q1 — Aanbod ============== */
  function screenQ1(){
    const ta = el('textarea',{class:'iw-textarea', maxlength:'200', placeholder:'bijv. Google Ads-management voor lokale tandartsen', oninput:e=>{state.answers.q1=e.target.value; updateCounter(ta, counter, 20, 200); validateQ1();}}, state.answers.q1);
    const counter = el('div',{class:'iw-counter'}, '');
    setTimeout(()=>{ta.value = state.answers.q1; updateCounter(ta, counter, 20, 200);},0);
    return el('div',{class:'iw-q'},[
      el('h2',{class:'iw-h2'}, 'Wat verkoop je precies?'),
      el('p',{class:'iw-helper'}, 'Eén zin. Wees specifiek — niet "marketing" maar "Google Ads-management voor lokale tandartsen".'),
      ta, counter,
      nextBarFor('q1', ()=> state.answers.q1.trim().length>=20)
    ]);
  }
  function validateQ1(){
    validate(()=> state.answers.q1.trim().length>=20);
  }

  /* ============== Q2 — Doelgroep ============== */
  function screenQ2(){
    const ta = el('textarea',{class:'iw-textarea iw-textarea--tall', maxlength:'400', oninput:e=>{state.answers.q2=e.target.value; updateCounter(ta, counter, 40, 400); validateMin('q2',40);}}, state.answers.q2);
    const counter = el('div',{class:'iw-counter'}, '');
    setTimeout(()=>updateCounter(ta, counter, 40, 400),0);
    return el('div',{class:'iw-q'},[
      el('h2',{class:'iw-h2'}, 'Voor wie? Beschrijf één ideale klant.'),
      el('p',{class:'iw-helper'}, 'Leeftijd, branche, situatie, en de grootste frustratie waar ze \u2019s nachts wakker van liggen.'),
      el('div',{class:'iw-example'}, '"Tandarts Mark, 47, eigenaar van een eigen praktijk in Utrecht. Worstelt met het vinden van nieuwe patiënten omdat hij geen tijd heeft voor marketing en niet weet welk kanaal werkt."'),
      ta, counter,
      nextBarFor('q2', ()=> state.answers.q2.trim().length>=40)
    ]);
  }

  /* ============== Q3 — Hoofdactie ============== */
  function screenQ3(){
    const opts = [
      ['📞','Een gratis kennismakingscall boeken'],
      ['📝','Een form invullen voor offerte of contact'],
      ['🛒','Direct iets kopen'],
      ['🎬','Een demo aanvragen'],
      ['📩','Zich inschrijven voor mijn nieuwsbrief'],
      ['✏️','Iets anders']
    ];
    const cards = opts.map(([icon,label])=>{
      const card = el('button',{class:'iw-card iw-card--single' + (state.answers.q3===label?' iw-card--on':''), onclick:()=>{
        state.answers.q3 = label;
        $$('.iw-card--single', root).forEach(c=>c.classList.remove('iw-card--on'));
        card.classList.add('iw-card--on');
        validate(()=> !!state.answers.q3 && (label!=='Iets anders' || (state.answers.q3_other||'').trim().length>0));
        if(label==='Iets anders'){ otherInput.style.display='block'; otherInput.focus(); } else { otherInput.style.display='none'; }
      }},[ el('span',{class:'iw-card-icon'},icon), el('span',{class:'iw-card-label'},label) ]);
      return card;
    });
    const otherInput = el('input',{type:'text', class:'iw-input', placeholder:'Beschrijf de hoofdactie...', style:'display:'+(state.answers.q3==='Iets anders'?'block':'none')+';margin-top:12px', oninput:e=>{state.answers.q3_other=e.target.value; validate(()=>!!state.answers.q3 && (state.answers.q3!=='Iets anders' || e.target.value.trim().length>0));}});
    otherInput.value = state.answers.q3_other;
    return el('div',{class:'iw-q'},[
      el('h2',{class:'iw-h2'}, 'Wat moet je bezoeker doen op je site?'),
      el('p',{class:'iw-helper'}, 'Eén actie per pagina werkt het best.'),
      el('div',{class:'iw-cards iw-cards--list'}, cards),
      otherInput,
      nextBarFor('q3', ()=> !!state.answers.q3 && (state.answers.q3!=='Iets anders' || (state.answers.q3_other||'').trim().length>0))
    ]);
  }

  /* ============== Q4 — Type site ============== */
  function screenQ4(){
    const opts = [
      ['📄','Single landing page','1 pagina, 1 doel'],
      ['🗂️','Multi-page service site','meerdere diensten'],
      ['🛍️','Webshop','producten verkopen'],
      ['🎨','Portfolio + lead-gen','werk + blog + contact']
    ];
    const recommendedSet = new Set(['Single landing page','Multi-page service site']);
    if(!Array.isArray(state.answers.q4)) state.answers.q4 = state.answers.q4 ? [state.answers.q4] : [];
    const cards = opts.map(([icon,label,desc])=>{
      const isRec = recommendedSet.has(label);
      const card = el('button',{class:'iw-card iw-card--block' + (state.answers.q4.includes(label)?' iw-card--on':''), onclick:()=>{
        const arr = state.answers.q4;
        const i = arr.indexOf(label);
        if(i>=0) arr.splice(i,1); else arr.push(label);
        card.classList.toggle('iw-card--on', arr.includes(label));
        validate(()=>arr.length>0);
      }},[
        isRec ? el('span',{class:'iw-rec'}, 'Aanbevolen') : null,
        el('span',{class:'iw-card-icon iw-card-icon--lg'}, icon),
        el('span',{class:'iw-card-label iw-card-label--lg'}, label),
        el('span',{class:'iw-card-desc'}, desc)
      ]);
      return card;
    });
    return el('div',{class:'iw-q'},[
      el('h2',{class:'iw-h2'}, 'Wat voor site heb je nodig?'),
      el('p',{class:'iw-helper'}, 'Meerdere opties zijn mogelijk — bij twijfel: een single landing page is de snelste route naar conversie.'),
      el('div',{class:'iw-cards iw-cards--2'}, cards),
      nextBarFor('q4', ()=> state.answers.q4.length>0)
    ]);
  }

  /* ============== Q5 — Track record ============== */
  function screenQ5(){
    const opts = ['0–5','5–25','25–100','100+'];
    const cards = opts.map(label=>{
      const c = el('button',{class:'iw-pill' + (state.answers.q5===label?' iw-pill--on':''), onclick:()=>{
        state.answers.q5=label;
        $$('.iw-pill', root).forEach(p=>p.classList.remove('iw-pill--on'));
        c.classList.add('iw-pill--on');
        validate(()=>!!state.answers.q5);
      }}, label);
      return c;
    });
    return el('div',{class:'iw-q'},[
      el('h2',{class:'iw-h2'}, 'Hoeveel klanten of projecten heb je al gedaan?'),
      el('p',{class:'iw-helper'}, 'Bepaalt hoeveel social proof je site nodig heeft.'),
      el('div',{class:'iw-pills'}, cards),
      nextBarFor('q5', ()=>!!state.answers.q5)
    ]);
  }

  /* ============== Q6 — Bewijslast ============== */
  function screenQ6(){
    const opts = [
      ['🎥','Video testimonials van klanten'],
      ['💬','Geschreven reviews of quotes'],
      ['📊','Case studies / portfolio-werk'],
      ['🏷️','Logos van klanten'],
      ['📈','Resultaten in cijfers'],
      ['⏳','Nog niets — moet nog verzameld worden']
    ];
    const cards = opts.map(([icon,label])=>{
      const isOn = state.answers.q6.includes(label);
      const card = el('button',{class:'iw-card iw-card--multi' + (isOn?' iw-card--on':''), onclick:()=>{
        const i = state.answers.q6.indexOf(label);
        if(i>=0) state.answers.q6.splice(i,1); else state.answers.q6.push(label);
        card.classList.toggle('iw-card--on');
        validate(()=>state.answers.q6.length>=1);
      }},[ el('span',{class:'iw-card-icon'},icon), el('span',{class:'iw-card-label'},label) ]);
      return card;
    });
    const noProofHelper = null;
    return el('div',{class:'iw-q'},[
      el('h2',{class:'iw-h2'}, 'Welke bewijslast heb je liggen?'),
      el('p',{class:'iw-helper'}, 'Aanvinken wat je nu hebt.'),
      noProofHelper,
      el('div',{class:'iw-cards iw-cards--2'}, cards),
      nextBarFor('q6', ()=>state.answers.q6.length>=1)
    ]);
  }

  /* ============== Q7 — Objections ============== */
  function screenQ7(){
    const ta = el('textarea',{class:'iw-textarea', maxlength:'300', placeholder:'bijv. te duur, twijfel over resultaat, geen tijd...', oninput:e=>{state.answers.q7=e.target.value; updateCounter(ta, counter, 0, 300);}}, state.answers.q7);
    const counter = el('div',{class:'iw-counter'}, '');
    setTimeout(()=>updateCounter(ta, counter, 0, 300),0);
    return el('div',{class:'iw-q'},[
      el('h2',{class:'iw-h2'}, 'Wat houdt klanten meestal tegen om \u2019ja\u2019 te zeggen?'),
      el('p',{class:'iw-helper'}, 'Bijvoorbeeld: te duur, twijfel, geen tijd, eerst willen rondkijken. Optioneel — sla over als je geen idee hebt.'),
      ta, counter,
      nextBarFor('q7', ()=> true)
    ]);
  }

  /* ============== Q8 — Sfeer (max 3) ============== */
  function screenQ8(){
    const opts = [
      ['🤝','Vertrouwen & betrouwbaarheid'],
      ['💎','Premium & exclusief'],
      ['⚡','Energiek & dynamisch'],
      ['🌱','Toegankelijk & vriendelijk'],
      ['🎨','Speels & creatief'],
      ['👔','Autoritair & expert']
    ];
    const refresh = ()=>{
      $$('.iw-card--vibe', root).forEach(c=>{
        const lbl = c.dataset.label;
        const on = state.answers.q8.includes(lbl);
        c.classList.toggle('iw-card--on', on);
        c.classList.toggle('iw-card--lock', !on && state.answers.q8.length>=3);
      });
    };
    const cards = opts.map(([icon,label])=>{
      const card = el('button',{class:'iw-card iw-card--multi iw-card--vibe', 'data-label':label, onclick:()=>{
        const i = state.answers.q8.indexOf(label);
        if(i>=0) state.answers.q8.splice(i,1);
        else if(state.answers.q8.length<3) state.answers.q8.push(label);
        refresh();
        validate(()=>state.answers.q8.length>=1);
      }},[ el('span',{class:'iw-card-icon'},icon), el('span',{class:'iw-card-label'},label) ]);
      return card;
    });
    setTimeout(refresh,0);
    return el('div',{class:'iw-q'},[
      el('h2',{class:'iw-h2'}, 'Welk gevoel moet je site uitstralen?'),
      el('p',{class:'iw-helper'}, 'Kies maximaal 3.'),
      el('div',{class:'iw-cards iw-cards--3'}, cards),
      nextBarFor('q8', ()=>state.answers.q8.length>=1)
    ]);
  }

  /* ============== Q9 — Huisstijl ============== */
  function screenQ9(){
    const opts = [
      ['🎨','Ja, hier zijn mijn kleuren','colors'],
      ['🖼️','Ja, en ik heb een logo','logo'],
      ['🤷','Nee, ik heb nog geen huisstijl','auto']
    ];
    const followup = el('div',{class:'iw-followup'});
    const renderFollow = ()=>{
      followup.innerHTML='';
      if(state.answers.q9_mode==='colors' || state.answers.q9_mode==='logo'){
        followup.appendChild(colorsBlock());
      }
      if(state.answers.q9_mode==='logo'){
        followup.insertBefore(logoBlock(), followup.firstChild);
      }
      if(state.answers.q9_mode==='auto'){
        followup.appendChild(el('div',{class:'iw-auto'},[
          el('p',{class:'iw-helper'}, 'Geen probleem — we stellen tijdens het sales-gesprek een passende huisstijl voor op basis van je input.')
        ]));
      }
    };
    const cards = opts.map(([icon,label,mode])=>{
      const card = el('button',{class:'iw-card iw-card--single iw-card--style' + (state.answers.q9_mode===mode?' iw-card--on':''), onclick:()=>{
        state.answers.q9_mode=mode;
        $$('.iw-card--style', root).forEach(c=>c.classList.remove('iw-card--on'));
        card.classList.add('iw-card--on');
        renderFollow();
        validate(()=>!!state.answers.q9_mode);
      }},[ el('span',{class:'iw-card-icon'},icon), el('span',{class:'iw-card-label'},label) ]);
      return card;
    });
    setTimeout(renderFollow,0);
    return el('div',{class:'iw-q'},[
      el('h2',{class:'iw-h2'}, 'Heb je al een huisstijl?'),
      el('div',{class:'iw-cards iw-cards--list'}, cards),
      followup,
      nextBarFor('q9', ()=>!!state.answers.q9_mode)
    ]);
  }
  function paletteSwatch(p){
    return el('div',{class:'iw-swatch'},[
      el('div',{class:'iw-swatch-chip', style:`background:${p.primary}`, title:'primair'}),
      el('div',{class:'iw-swatch-chip', style:`background:${p.accent}`, title:'accent'}),
      el('div',{class:'iw-swatch-chip iw-swatch-chip--bg', style:`background:${p.background}`, title:'achtergrond'})
    ]);
  }
  function colorsBlock(){
    const wrap = el('div',{class:'iw-colors'});
    const preview = el('div',{class:'iw-color-preview'});
    const updatePreview = ()=>{
      preview.innerHTML='';
      preview.appendChild(paletteSwatch(state.answers.q9_colors));
      preview.appendChild(el('span',{class:'iw-color-preview-label'}, 'Live voorvertoning'));
    };
    const colorRow = (label, key)=> el('label',{class:'iw-color-row'},[
      el('span',{}, label),
      el('input',{type:'color', value:state.answers.q9_colors[key], oninput:e=>{state.answers.q9_colors[key]=e.target.value; updatePreview();}})
    ]);
    wrap.appendChild(preview);
    wrap.appendChild(el('div',{class:'iw-color-grid'},[
      colorRow('Primair', 'primary'),
      colorRow('Accent', 'accent'),
      colorRow('Achtergrond', 'background')
    ]));
    updatePreview();
    return wrap;
  }
  function logoBlock(){
    const wrap = el('div',{class:'iw-upload'});
    const input = el('input',{type:'file', accept:'image/png,image/svg+xml,image/jpeg', class:'iw-upload-input', onchange:e=>{
      const f = e.target.files[0];
      if(!f) return;
      if(f.size > 5*1024*1024){ alert('Max 5MB'); return; }
      const reader = new FileReader();
      reader.onload = ()=>{ state.answers.q9_logo = reader.result; preview.style.backgroundImage = `url(${reader.result})`; preview.classList.add('iw-upload-preview--has'); };
      reader.readAsDataURL(f);
    }});
    const preview = el('div',{class:'iw-upload-preview'},[el('span',{class:'iw-upload-hint'}, 'Sleep je logo of klik')]);
    if(state.answers.q9_logo){ preview.style.backgroundImage=`url(${state.answers.q9_logo})`; preview.classList.add('iw-upload-preview--has'); }
    wrap.appendChild(el('label',{class:'iw-upload-wrap'},[preview, input]));
    return wrap;
  }

  /* ============== Q10 — Hero layout ============== */
  function screenQ10(){
    const opts = [
      ['centered','🎯','Centered','Headline + sub + CTA centraal, groot en bold', svgCentered],
      ['split','↔️','Split','Tekst links, beeld rechts', svgSplit],
      ['full','✨','Overig','Animerende hero met scroll-scrub effect', svgFull]
    ];
    const cards = opts.map(([id,icon,label,desc,svgFn])=>{
      const card = el('button',{class:'iw-card iw-card--vis iw-card--layout' + (state.answers.q10===id?' iw-card--on':''), onclick:()=>{
        state.answers.q10=id;
        $$('.iw-card--layout', root).forEach(c=>c.classList.remove('iw-card--on'));
        card.classList.add('iw-card--on');
        validate(()=>!!state.answers.q10);
      }},[
        el('div',{class:'iw-vis-frame', html: svgFn() }),
        el('div',{class:'iw-vis-meta'},[
          el('span',{class:'iw-card-icon'},icon),
          el('div',{},[
            el('div',{class:'iw-card-label'}, label),
            el('div',{class:'iw-card-desc'}, desc)
          ])
        ])
      ]);
      return card;
    });
    return el('div',{class:'iw-q'},[
      el('h2',{class:'iw-h2'}, 'Welke hero-layout spreekt je aan?'),
      el('p',{class:'iw-helper'}, 'De vorm van je belangrijkste blok — daar valt het oog van bezoekers als eerste op.'),
      el('div',{class:'iw-cards iw-cards--3 iw-cards--vis'}, cards),
      nextBarFor('q10', ()=>!!state.answers.q10)
    ]);
  }

  /* ============== Q11 — Animatie ============== */
  function screenQ11(){
    const opts = [
      ['slide','🪄','Slide-in','Elementen schuiven elegant in beeld bij laden.'],
      ['scroll','✨','Scroll-triggered','Reveal-animaties die afspelen terwijl je scrollt.'],
      ['hover','🎯','Hover effect','Subtiele reacties bij over knoppen, cards en links.'],
      ['interactive','🕹️','Interactief','Sleep en herorden elementen — je site reageert mee.']
    ];
    if(!Array.isArray(state.answers.q11)) state.answers.q11 = state.answers.q11 ? [state.answers.q11] : [];
    const cards = opts.map(([id,icon,label,desc])=>{
      const isOn = state.answers.q11.includes(id);
      const card = el('button',{class:'iw-card iw-card--vis iw-card--anim iw-anim-' + id + (isOn?' iw-card--on':''), onclick:()=>{
        const idx = state.answers.q11.indexOf(id);
        if(idx>=0) state.answers.q11.splice(idx,1); else state.answers.q11.push(id);
        card.classList.toggle('iw-card--on');
        validate(()=>state.answers.q11.length>0);
      }},[
        el('div',{class:'iw-anim-preview'},[
          el('div',{class:'iw-anim-blob iw-anim-blob-1'}),
          el('div',{class:'iw-anim-blob iw-anim-blob-2'}),
          el('div',{class:'iw-anim-blob iw-anim-blob-3'})
        ]),
        el('div',{class:'iw-vis-meta'},[
          el('span',{class:'iw-card-icon'},icon),
          el('div',{},[
            el('div',{class:'iw-card-label'}, label),
            el('div',{class:'iw-card-desc'}, desc)
          ])
        ])
      ]);
      return card;
    });
    return el('div',{class:'iw-q'},[
      el('h2',{class:'iw-h2'}, 'Welke beweging wil je toevoegen?'),
      el('p',{class:'iw-helper'}, 'Hover over een optie om de beweging te zien. Je kunt meerdere stijlen kiezen.'),
      el('div',{class:'iw-cards iw-cards--2 iw-cards--vis iw-cards--anim4'}, cards),
      nextBarFor('q11', ()=>state.answers.q11.length>0)
    ]);
  }

  /* ============== Q12 — UI stijl ============== */
  function screenQ12(){
    const opts = [
      ['rounded','🍃','Rounded & soft','12px+ borders, zachte shadows. Toegankelijk en vriendelijk.'],
      ['sharp','🔷','Sharp & modern','4px borders, crisp shadows. Clean en professioneel.'],
      ['playful','🎨','Custom & playful','Asymmetrische vormen, unieke elementen. Creatief.']
    ];
    const cards = opts.map(([id,icon,label,desc])=>{
      const card = el('button',{class:'iw-card iw-card--vis iw-card--ui iw-ui-'+id + (state.answers.q12===id?' iw-card--on':''), onclick:()=>{
        state.answers.q12=id;
        $$('.iw-card--ui', root).forEach(c=>c.classList.remove('iw-card--on'));
        card.classList.add('iw-card--on');
        validate(()=>!!state.answers.q12);
      }},[
        el('div',{class:'iw-ui-preview'},[
          el('div',{class:'iw-ui-btn'}, 'Knop'),
          el('div',{class:'iw-ui-card-mini'},[
            el('div',{class:'iw-ui-card-bar'}),
            el('div',{class:'iw-ui-card-bar iw-ui-card-bar--sm'})
          ]),
          el('div',{class:'iw-ui-input'})
        ]),
        el('div',{class:'iw-vis-meta'},[
          el('span',{class:'iw-card-icon'},icon),
          el('div',{},[
            el('div',{class:'iw-card-label'}, label),
            el('div',{class:'iw-card-desc'}, desc)
          ])
        ])
      ]);
      return card;
    });
    return el('div',{class:'iw-q'},[
      el('h2',{class:'iw-h2'}, 'Welke stijl van knoppen en cards spreekt je aan?'),
      el('p',{class:'iw-helper'}, 'Bepaalt hoe knoppen, cards en form-elementen eruitzien.'),
      el('div',{class:'iw-cards iw-cards--3 iw-cards--vis'}, cards),
      nextBarFor('q12', ()=>!!state.answers.q12)
    ]);
  }

  /* ============== Q13 — Achtergrond ============== */
  function screenQ13(){
    const opts = [
      ['white','⚪','Wit','Strakke witte achtergrond. Maximaal contrast, rust en ruimte.'],
      ['light','🌤️','Licht getint','Zachte off-white of subtiele tint van je hoofdkleur.'],
      ['dark','🌑','Donker','Premium dark mode look. Tekst pop’t, kleuren springen eruit.'],
      ['gradient','🌈','Gradient','Vloeiende kleurenovergang van primair naar accent. Levendig.']
    ];
    const cards = opts.map(([id,icon,label,desc])=>{
      const card = el('button',{class:'iw-card iw-card--vis iw-card--bg iw-bg-'+id + (state.answers.q12_bg===id?' iw-card--on':''), onclick:()=>{
        state.answers.q12_bg=id;
        $$('.iw-card--bg', root).forEach(c=>c.classList.remove('iw-card--on'));
        card.classList.add('iw-card--on');
        validate(()=>!!state.answers.q12_bg);
      }},[
        el('div',{class:'iw-bg-preview'},[
          el('div',{class:'iw-bg-mock'},[
            el('div',{class:'iw-bg-mock-h'}),
            el('div',{class:'iw-bg-mock-sub'}),
            el('div',{class:'iw-bg-mock-btn'})
          ])
        ]),
        el('div',{class:'iw-vis-meta'},[
          el('span',{class:'iw-card-icon'},icon),
          el('div',{},[
            el('div',{class:'iw-card-label'}, label),
            el('div',{class:'iw-card-desc'}, desc)
          ])
        ])
      ]);
      return card;
    });
    return el('div',{class:'iw-q'},[
      el('h2',{class:'iw-h2'}, 'Welk type achtergrond past bij je site?'),
      el('p',{class:'iw-helper'}, 'Bepaalt de basis-sfeer en hoe je content op de pagina valt.'),
      el('div',{class:'iw-cards iw-cards--2 iw-cards--vis iw-cards--anim4'}, cards),
      nextBarFor('q12_bg', ()=>!!state.answers.q12_bg)
    ]);
  }

  /* ============== Q14 — Tijdslijn ============== */
  function screenQ14(){
    const opts = [
      ['🔥','Deze week — urgent'],
      ['📅','Binnen 1 maand'],
      ['🗓️','Binnen 1 kwartaal'],
      ['🤔','Flexibel — eerst goed dan snel']
    ];
    const cards = opts.map(([icon,label])=>{
      const card = el('button',{class:'iw-card iw-card--single' + (state.answers.q14===label?' iw-card--on':''), onclick:()=>{
        state.answers.q14=label;
        $$('.iw-card--single', root).forEach(c=>c.classList.remove('iw-card--on'));
        card.classList.add('iw-card--on');
        validate(()=>!!state.answers.q14);
      }},[ el('span',{class:'iw-card-icon'}, icon), el('span',{class:'iw-card-label'}, label) ]);
      return card;
    });
    return el('div',{class:'iw-q'},[
      el('h2',{class:'iw-h2'}, 'Wanneer wil je live?'),
      el('div',{class:'iw-cards iw-cards--list'}, cards),
      nextBarFor('q14', ()=>!!state.answers.q14)
    ]);
  }

  /* ============== Contact ============== */
  function screenContact(){
    const c = state.answers.contact;
    if(!state.captcha){
      const a = Math.floor(Math.random()*8)+2;
      const b = Math.floor(Math.random()*8)+2;
      state.captcha = { a, b, answer: '', solved: false };
    }
    const cap = state.captcha;
    const fld = (label, key, type, helper, required)=>{
      const inp = el('input',{type:type||'text', class:'iw-input', value:c[key]||'', oninput:e=>{c[key]=e.target.value; validateContact();}});
      return el('label',{class:'iw-fld'},[
        el('span',{class:'iw-fld-label'}, label + (required?' *':'')),
        inp,
        helper ? el('span',{class:'iw-fld-helper'}, helper) : null
      ]);
    };
    const captchaInput = el('input',{type:'text', class:'iw-input iw-captcha-input', inputmode:'numeric', maxlength:'3', placeholder:'?', value:cap.answer||'', oninput:e=>{
      cap.answer = e.target.value.trim();
      cap.solved = parseInt(cap.answer,10) === (cap.a+cap.b);
      const mark = $('.iw-captcha-mark', root);
      if(mark) mark.textContent = cap.solved ? '✓' : (cap.answer ? '✗' : '');
      if(mark) mark.className = 'iw-captcha-mark' + (cap.solved?' iw-captcha-mark--ok':cap.answer?' iw-captcha-mark--bad':'');
      validateContact();
    }});
    return el('div',{class:'iw-q iw-q--contact'},[
      el('h2',{class:'iw-h2'}, 'Bijna klaar — waar mogen we de preview heen sturen?'),
      el('p',{class:'iw-sub'}, 'Je krijgt direct een live preview van je hero in jouw huisstijl, plus de mogelijkheid om een gesprek te boeken.'),
      el('div',{class:'iw-form'},[
        fld('Naam','name','text',null,true),
        fld('E-mailadres','email','email','We sturen hier je preview naartoe',true),
        fld('Telefoon','phone','tel',null,true),
        fld('Bedrijfsnaam','company','text','Optioneel'),
        fld('Huidige site (URL)','currentSite','url','Optioneel')
      ]),
      el('div',{class:'iw-captcha'},[
        el('span',{class:'iw-captcha-label'}, '🤖 Even checken dat je geen robot bent:'),
        el('div',{class:'iw-captcha-row'},[
          el('span',{class:'iw-captcha-q'}, `${cap.a} + ${cap.b} =`),
          captchaInput,
          el('span',{class:'iw-captcha-mark' + (cap.solved?' iw-captcha-mark--ok':'')}, cap.solved?'✓':'')
        ])
      ]),
      el('p',{class:'iw-privacy'}, '🔒 Geen spam, geen derden. Alleen om je preview te sturen.'),
      el('div',{class:'iw-footer'},
        el('button',{class:'iw-next', onclick: submitIntake}, 'Bekijk mijn preview →')
      )
    ]);
  }
  function validateContact(){
    const c = state.answers.contact;
    const captchaOk = state.captcha && state.captcha.solved;
    const ok = c.name.trim() && /^\S+@\S+\.\S+$/.test(c.email) && c.phone.trim() && captchaOk;
    const btn = $('.iw-next', root);
    if(btn){ btn.classList.toggle('iw-next--off', !ok); btn.disabled = !ok; }
  }

  /* ============== Loading ============== */
  function screenLoading(){
    const phases = ['We bouwen je hero…','Testimonials in jouw stijl…','Animaties activeren…','Bijna klaar…'];
    const text = el('div',{class:'iw-load-text'}, phases[0]);
    let i=0;
    const tick = setInterval(()=>{
      i++;
      if(i>=phases.length){ clearInterval(tick); return; }
      text.style.opacity='0';
      setTimeout(()=>{ text.textContent = phases[i]; text.style.opacity='1'; },200);
    }, 1100);
    return el('div',{class:'iw-loading'},[
      el('div',{class:'iw-spinner'}),
      el('div',{class:'iw-load-h'}, 'Een moment…'),
      text
    ]);
  }

  /* ============== Submit + Generate ============== */
  async function submitIntake(){
    if($('.iw-next', root)?.disabled) return;
    go(16); // loading
    const palette = state.answers.q9_mode==='auto' ? paletteFromVibes(state.answers.q8) : state.answers.q9_colors;
    state.answers.q9_colors = palette;

    const fallback = ()=>{
      const snippet = state.answers.q1.split(' ').slice(0,5).join(' ');
      const target = (state.answers.q2.split(/[,.\n]/)[0] || '').trim().slice(0,50) || 'jouw doelgroep';
      state.generated = {
        headline: `${snippet||'Resultaten'} voor ${target}`,
        subHeadline: 'Een website die werkt: helder, snel en gericht op één concrete actie van je bezoeker.',
        ctaText: CTA_FALLBACK[state.answers.q3] || 'Plan een gratis gesprek'
      };
    };

    try {
      if(typeof window.claude !== 'undefined' && window.claude.complete){
        const prompt = `Je bent een conversie-copywriter in het Nederlands. Genereer voor de hero-sectie van een website:

1. HEADLINE — max 8 woorden, benoemt de pijn óf de belofte
2. SUB-HEADLINE — 1 zin, vertaalt headline naar specifiek voordeel
3. CTA-KNOPTEKST — concreet, voordeel-gericht, max 4 woorden

Context:
- Bedrijf: ${state.answers.q1}
- Doelgroep: ${state.answers.q2}
- Hoofdactie: ${state.answers.q3}${state.answers.q3==='Iets anders'?' — '+state.answers.q3_other:''}
- Objections: ${state.answers.q7}
- Sfeer: ${state.answers.q8.join(', ')}

Output ALLEEN als geldig JSON zonder markdown, geen extra tekst:
{"headline":"...","subHeadline":"...","ctaText":"..."}`;
        const result = await Promise.race([
          window.claude.complete(prompt),
          new Promise((_,rej)=>setTimeout(()=>rej('timeout'),9000))
        ]);
        const m = String(result).match(/\{[\s\S]*\}/);
        if(m){
          const parsed = JSON.parse(m[0]);
          state.generated = {
            headline: parsed.headline || '',
            subHeadline: parsed.subHeadline || '',
            ctaText: parsed.ctaText || CTA_FALLBACK[state.answers.q3] || 'Plan een gratis gesprek'
          };
        } else fallback();
      } else fallback();
    } catch(e){ console.warn('Claude generate failed:', e); fallback(); }

    // Persist submission so admin can see it
    try{
      const key = 'ds_wizard_subs';
      const list = JSON.parse(localStorage.getItem(key) || '[]');
      list.unshift({
        id: 'w'+Math.random().toString(36).slice(2,9),
        date: new Date().toISOString().slice(0,10),
        status: 'new',
        answers: JSON.parse(JSON.stringify(state.answers)),
        generated: JSON.parse(JSON.stringify(state.generated))
      });
      localStorage.setItem(key, JSON.stringify(list));
    }catch(e){}

    // Submit naar Formspree zodat David een e-mail krijgt met alle antwoorden
    if(FORMSPREE_URL && !FORMSPREE_URL.includes('YOUR_FORM_ID')){
      try{
        const payload = {
          _subject: `Nieuwe wizard-submission van ${state.answers.contact.name || 'onbekend'}`,
          naam: state.answers.contact.name,
          email: state.answers.contact.email,
          telefoon: state.answers.contact.phone,
          bedrijf: state.answers.contact.company,
          huidige_site: state.answers.contact.currentSite,
          q1_bedrijf: state.answers.q1,
          q2_doelgroep: state.answers.q2,
          q3_hoofdactie: state.answers.q3 + (state.answers.q3_other ? ' — ' + state.answers.q3_other : ''),
          q4_pijn: (state.answers.q4||[]).join(', '),
          q5_uniek: state.answers.q5,
          q6_secties: (state.answers.q6||[]).join(', '),
          q7_objecties: state.answers.q7,
          q8_sfeer: (state.answers.q8||[]).join(', '),
          q9_kleuren: JSON.stringify(state.answers.q9_colors),
          q10_layout: state.answers.q10,
          q11_animatie: state.answers.q11,
          q12_ui: state.answers.q12,
          q12_bg: state.answers.q12_bg,
          q13: state.answers.q13,
          q14: state.answers.q14,
          fallback_headline: state.generated.headline,
          fallback_sub: state.generated.subHeadline,
          fallback_cta: state.generated.ctaText,
          submitted_at: new Date().toISOString()
        };
        await fetch(FORMSPREE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch(e){ console.warn('Formspree submit failed:', e); }
    }

    // Make sure loader gets at least 4.5s so the build-up reads
    await new Promise(r=>setTimeout(r,4500));
    go(17);
  }

  /* ============== Preview screen ============== */
  function screenPreview(){
    const palette = state.answers.q9_colors;
    const layout = state.answers.q10 || 'centered';
    const ui = state.answers.q12 || 'rounded';
    const bg = state.answers.q12_bg || 'light';
    const anim = (Array.isArray(state.answers.q11) ? state.answers.q11[0] : state.answers.q11) || 'subtle';
    const gen = state.generated;

    const previewCSS = buildPreviewCSS(palette, ui, anim, bg);
    const heroHTML = buildHero(layout, ui, gen, palette, state.answers.q9_logo);
    const testiHTML = buildTestimonials(ui);

    const wrap = el('div',{class:'iw-preview'});

    const firstName = state.answers.contact.name.split(' ')[0] || 'ondernemer';
    const userEmail = state.answers.contact.email || 'je inbox';
    wrap.appendChild(el('div',{class:'iw-preview-head'},[
      el('h2',{class:'iw-h2'}, `Bedankt, ${firstName}! Hier is alvast een eerste indruk ✨`),
      el('p',{class:'iw-sub'}, 'Op basis van je antwoorden + design-keuzes hebben we een eerste versie van je hero en testimonials gebouwd in jouw huisstijl. David kijkt hier persoonlijk naar en stuurt binnen 24 uur je definitieve preview met scherpe copy naar ' + userEmail + '.')
    ]));

    const frame = el('div',{class:'iw-preview-frame'});
    frame.appendChild(el('div',{class:'iw-preview-bar'},[
      el('span',{class:'iw-preview-dot iw-preview-dot--r'}),
      el('span',{class:'iw-preview-dot iw-preview-dot--y'}),
      el('span',{class:'iw-preview-dot iw-preview-dot--g'}),
      el('span',{class:'iw-preview-url'}, (state.answers.contact.company||'jouwsite').toLowerCase().replace(/\s+/g,'')+'.nl')
    ]));
    const iframe = el('iframe',{class:'iw-preview-iframe', title:'preview'});
    frame.appendChild(iframe);
    wrap.appendChild(frame);

    setTimeout(()=>{
      const doc = iframe.contentDocument;
      doc.open();
      doc.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><style>${previewCSS}</style></head><body class="anim-${anim}">${heroHTML}${testiHTML}<script>${previewJS()}<\/script></body></html>`);
      doc.close();
    },50);

    // Caveat
    wrap.appendChild(el('div',{class:'iw-preview-caveat'},
      'Voorbeeld — placeholder testimonials worden vervangen door echte klant-quotes in de uiteindelijke site.'
    ));

    // Booking
    wrap.appendChild(el('div',{class:'iw-book'},[
      el('h2',{class:'iw-h2'}, 'Wil je zien hoe de rest van je site eruitziet?'),
      el('p',{class:'iw-sub'}, 'Boek een gratis 30-minuten strategie-sessie. Ik bouw live de complete site door op basis van wat je vandaag hebt ingevuld — alle secties, copy-suggesties, en aanpassingen waar je bij zit.'),
      el('div',{class:'iw-calendly'},[
        el('div',{class:'iw-calendly-inner'},[
          el('div',{class:'iw-calendly-h'}, '📅 Calendly-embed'),
          el('p',{}, 'Hier komt straks de live agenda. Voor nu: klik hieronder om direct een tijd voor te stellen via WhatsApp of mail.'),
          el('div',{class:'iw-calendly-row'},[
            el('a',{class:'iw-cal-cta', href:'https://wa.me/31626135410?text='+encodeURIComponent('Hoi David, ik heb net de intake ingevuld en wil graag een strategie-sessie boeken.'), target:'_blank'}, '💬 WhatsApp David'),
            el('a',{class:'iw-cal-cta iw-cal-cta--ghost', href:'mailto:Contact@DavidSpijker.nl?subject=Strategie-sessie&body='+encodeURIComponent('Hoi David, ik heb de intake ingevuld en wil een strategie-sessie inplannen.')}, '✉️ Mail David')
          ])
        ])
      ]),
      el('a',{class:'iw-back-home', href:'index.html'}, '← Terug naar de homepage'),
      el('button',{class:'iw-back-home iw-back-home--btn', onclick:()=>resetWizard()}, '↻ Opnieuw beginnen')
    ]));

    return wrap;
  }

  /* ============== PREVIEW BUILDERS ============== */
  function buildPreviewCSS(p, ui, anim, bg){
    const radius = ui==='rounded'?'14px':ui==='sharp'?'4px':'18px 4px 18px 4px';
    const btnRadius = ui==='rounded'?'10px':ui==='sharp'?'4px':'999px';
    const cardShadow = ui==='rounded'?'0 8px 28px rgba(0,0,0,0.06)':ui==='sharp'?'0 2px 0 rgba(0,0,0,0.08)':'0 12px 32px rgba(0,0,0,0.08)';
    const bgValue = bg==='white' ? '#ffffff'
      : bg==='dark' ? '#0b1020'
      : bg==='gradient' ? `linear-gradient(135deg, ${p.primary} 0%, #8b5cf6 50%, ${p.accent} 100%)`
      : p.background;
    const textColor = bg==='dark' ? '#f1f5fb' : bg==='gradient' ? '#ffffff' : '#0f172a';
    const subColor = bg==='dark' ? '#9aa6c2' : bg==='gradient' ? 'rgba(255,255,255,0.85)' : '#475569';
    const headingColor = bg==='dark' ? '#ffffff' : bg==='gradient' ? '#ffffff' : p.primary;
    return `
      *{box-sizing:border-box;margin:0;padding:0}
      body{font-family:'Inter','DM Sans',system-ui,sans-serif;background:${bgValue};color:${textColor};line-height:1.6}
      .ph{padding:64px 6%;background:${bgValue}}
      .ph-cta{background:${p.primary};color:#fff;border:0;padding:14px 26px;border-radius:${btnRadius};font-weight:600;font-size:15px;cursor:pointer;display:inline-flex;align-items:center;gap:8px;font-family:inherit;transition:transform .2s, box-shadow .2s;text-decoration:none}
      .ph-cta:hover{transform:translateY(-2px);box-shadow:0 10px 30px ${p.primary}3a}
      .ph-h{font-family:'Space Grotesk','Inter',system-ui,sans-serif;font-weight:800;letter-spacing:-1.4px;line-height:1.05;margin-bottom:18px;color:${headingColor}}
      .ph-sub{font-size:17px;color:${subColor};margin-bottom:28px;max-width:560px;line-height:1.6}
      .ph-logo{height:32px;margin-bottom:24px}

      /* CENTERED */
      .layout-centered{text-align:center;padding:90px 6% 80px;background:${bg==='gradient'?bgValue:bg==='dark'?bgValue:`linear-gradient(180deg, ${bgValue} 0%, ${p.accent}12 100%)`}}
      .layout-centered .ph-h{font-size:54px;max-width:780px;margin-left:auto;margin-right:auto}
      .layout-centered .ph-sub{margin-left:auto;margin-right:auto;text-align:center}
      .layout-centered .ph-hero-img{display:block;max-width:1040px;width:100%;margin:40px auto 0;border-radius:${radius};box-shadow:${cardShadow}}

      /* SPLIT */
      .layout-split{display:grid;grid-template-columns:1.1fr 1fr;gap:40px;align-items:center;padding:80px 6%}
      .layout-split .ph-h{font-size:44px}
      .layout-split-img{height:340px;border-radius:${radius};background:linear-gradient(135deg, ${p.primary}, ${p.accent});position:relative;overflow:hidden}
      .layout-split-img::after{content:'';position:absolute;inset:0;background:repeating-linear-gradient(45deg, rgba(255,255,255,0.06), rgba(255,255,255,0.06) 2px, transparent 2px, transparent 14px)}

      /* OVERIG — scroll-scrub hero contained in its own block */
      .layout-full{position:relative;height:220vh;color:#fff;background:#0a0a0f}
      .layout-full-stage{position:sticky;top:0;height:100vh;width:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;overflow:hidden}
      .layout-full-bg{position:absolute;inset:0;background:linear-gradient(135deg, ${p.primary}, ${p.accent});z-index:0}
      .layout-full-bg::after{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 35%, rgba(255,255,255,.18), transparent 55%), radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.55) 100%)}
      .layout-full-stage > *{position:relative;z-index:1}
      .layout-full-title{font-family:'Space Grotesk',sans-serif;font-weight:900;text-transform:uppercase;letter-spacing:-0.04em;font-size:clamp(56px, 12vw, 160px);line-height:.85;margin:0;text-align:center;color:#fff;will-change:transform,opacity,letter-spacing;transition:none}
      .layout-full-card{position:relative;width:min(82vw, 60vh);aspect-ratio:16/9;border-radius:14px;overflow:hidden;box-shadow:0 20px 80px rgba(0,0,0,.55);ring:1px solid rgba(255,255,255,.1);background:#111;will-change:transform;transform-origin:50% 50%}
      .layout-full-card::after{content:'';position:absolute;inset:0;box-shadow:inset 0 0 120px rgba(0,0,0,.45);pointer-events:none;z-index:2}
      .layout-full-card-img{position:absolute;inset:0;background:linear-gradient(135deg, ${p.primary}, ${p.accent});display:flex;align-items:center;justify-content:center}
      .layout-full-card-img::before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(45deg, rgba(255,255,255,.06), rgba(255,255,255,.06) 2px, transparent 2px, transparent 14px)}
      .layout-full-card-content{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:6%;text-align:center;gap:14px}
      .layout-full-card-content .ph-h{color:#fff;font-size:36px;max-width:90%;margin:0}
      .layout-full-card-content .ph-sub{color:rgba(255,255,255,.85);max-width:80%;margin:0}
      .layout-full-card-content .ph-cta{background:#fff;color:${p.primary};margin:0}

      /* Testimonials */
      .pt{padding:64px 6%;background:${bg==='dark'?'#0b1020':bg==='gradient'?'#ffffff':p.background};color:${bg==='dark'?'#f1f5fb':'#0f172a'}}
      .pt-h{font-family:'Space Grotesk',sans-serif;font-weight:800;font-size:32px;letter-spacing:-0.6px;margin-bottom:32px;color:${bg==='dark'?'#ffffff':p.primary};text-align:center}
      .pt-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
      .pt-card{background:#fff;border:1px solid rgba(15,23,42,0.08);padding:24px;border-radius:${radius};box-shadow:${cardShadow};position:relative}
      .pt-stars{color:#f59e0b;font-size:13px;letter-spacing:2px;margin-bottom:10px}
      .pt-quote{font-size:15px;line-height:1.65;color:#1f2937;margin-bottom:14px}
      .pt-author{display:flex;align-items:center;gap:10px}
      .pt-avatar{width:36px;height:36px;border-radius:50%;background:${p.primary}26;display:flex;align-items:center;justify-content:center;font-weight:700;color:${p.primary};font-size:13px}
      .pt-name{font-size:13px;font-weight:600}
      .pt-tag{position:absolute;right:10px;top:8px;font-size:9px;color:#94a3b8;letter-spacing:.4px}

      @media(max-width:760px){
        .layout-centered .ph-h, .layout-full .ph-h{font-size:36px}
        .layout-split{grid-template-columns:1fr}
        .layout-split-img{height:200px}
        .pt-grid{grid-template-columns:1fr}
      }

      /* ANIMATION PROFILES */
      .reveal-x{opacity:0;transform:translateY(10px);transition:opacity .6s ease, transform .6s ease}
      .reveal-x.in{opacity:1;transform:none}
      body.anim-scroll .reveal-x{transform:translateY(30px);transition-duration:.8s}
      body.anim-bold .reveal-x{transform:translateY(60px) scale(.96);transition:opacity 1s ease, transform 1s cubic-bezier(.2,1.4,.4,1)}
      body.anim-bold .layout-full::before{animation:parallax 12s ease-in-out infinite alternate}
      @keyframes parallax{from{transform:translate(0,0)}to{transform:translate(60px,-30px)}}
    `;
  }
  function buildHero(layout, ui, gen, p, logo){
    const logoHTML = logo ? `<img class="ph-logo reveal-x" src="${logo}" alt="logo">` : '';
    const h = escapeHTML(gen.headline);
    const s = escapeHTML(gen.subHeadline);
    const cta = escapeHTML(gen.ctaText);
    if(layout==='split'){
      return `<section class="ph layout-split">
        <div>${logoHTML}<h1 class="ph-h reveal-x">${h}</h1><p class="ph-sub reveal-x">${s}</p><a class="ph-cta reveal-x" href="#">${cta} →</a></div>
        <div class="layout-split-img reveal-x"></div>
      </section>`;
    }
    if(layout==='full'){
      return `<section class="ph layout-full" data-scrub>
        <div class="layout-full-stage">
          <div class="layout-full-bg"></div>
          <h2 class="layout-full-title" data-title="top">${h}</h2>
          <div class="layout-full-card" data-card>
            <div class="layout-full-card-img"></div>
            <div class="layout-full-card-content">
              ${logoHTML}
              <p class="ph-sub">${s}</p>
              <a class="ph-cta" href="#">${cta} →</a>
            </div>
          </div>
          <h2 class="layout-full-title" data-title="bottom">${escapeHTML(state.answers.contact.company||'preview')}</h2>
        </div>
      </section>`;
    }
    return `<section class="ph layout-centered">
      ${logoHTML}<h1 class="ph-h reveal-x">${h}</h1><p class="ph-sub reveal-x">${s}</p><a class="ph-cta reveal-x" href="#">${cta} →</a>
      <img class="ph-hero-img reveal-x" src="assets/hero-centered-reference.png" alt="Hero voorbeeld">
    </section>`;
  }
  function buildTestimonials(ui){
    const items = [
      {name:'Jan Jansen', quote:'Top ervaring, super service en snel gereageerd.'},
      {name:'Sara de Vries', quote:'Eindelijk een partner die mijn merk begrijpt.'},
      {name:'Mark de Boer', quote:'Aanrader voor elke ondernemer die serieus wil groeien.'}
    ];
    const cards = items.map(t=>{
      const ini = t.name.split(' ').map(s=>s[0]).join('').slice(0,2);
      return `<div class="pt-card reveal-x">
        <div class="pt-tag">Voorbeeld</div>
        <div class="pt-stars">★★★★★</div>
        <p class="pt-quote">"${t.quote}"</p>
        <div class="pt-author"><div class="pt-avatar">${ini}</div><div class="pt-name">${t.name}</div></div>
      </div>`;
    }).join('');
    return `<section class="pt"><h2 class="pt-h reveal-x">Wat klanten zeggen</h2><div class="pt-grid">${cards}</div></section>`;
  }
  function previewJS(){
    return `
      const obs = new IntersectionObserver((es)=>{
        es.forEach((e,i)=>{ if(e.isIntersecting){ setTimeout(()=>e.target.classList.add('in'), i*100); obs.unobserve(e.target); } });
      },{threshold:0.15});
      document.querySelectorAll('.reveal-x').forEach((el,i)=>{ obs.observe(el); });
      setTimeout(()=>document.querySelectorAll('.reveal-x').forEach((el,i)=>{ const r=el.getBoundingClientRect(); if(r.top<innerHeight) setTimeout(()=>el.classList.add('in'), i*120); }), 50);

      // Scroll-scrub for layout-full / Overig
      const scrub = document.querySelector('[data-scrub]');
      if(scrub){
        const card = scrub.querySelector('[data-card]');
        const tTop = scrub.querySelector('[data-title=top]');
        const tBot = scrub.querySelector('[data-title=bottom]');
        const lerp = (a,b,t)=>a+(b-a)*t;
        const clamp = (v,a,b)=>Math.max(a,Math.min(b,v));
        const onScroll = ()=>{
          const rect = scrub.getBoundingClientRect();
          const total = scrub.offsetHeight - innerHeight;
          const p = clamp((-rect.top)/Math.max(1,total), 0, 1);
          // Phases: 0-.15 entry, .15-.78 immerse, .78-1 release
          let cardScale, titleX, titleOpacity;
          if(p < .15){
            const t = p/.15;
            cardScale = lerp(.62, 1, t);
            titleX = 0; titleOpacity = 1;
          } else if(p < .78){
            const t = (p-.15)/.63;
            // immerse the card to fill the viewport
            const target = Math.max(innerWidth/(card.offsetWidth||1), innerHeight/(card.offsetHeight||1)) * 1.04;
            cardScale = lerp(1, target, t);
            titleX = lerp(0, 60, t);
            titleOpacity = lerp(1, 0, Math.min(1, t*1.6));
          } else {
            const t = (p-.78)/.22;
            const target = Math.max(innerWidth/(card.offsetWidth||1), innerHeight/(card.offsetHeight||1)) * 1.04;
            cardScale = lerp(target, .62, t);
            titleX = lerp(60, 0, t);
            titleOpacity = lerp(0, 1, t);
          }
          card.style.transform = 'scale(' + cardScale.toFixed(3) + ')';
          tTop.style.transform = 'translateX(' + (-titleX) + 'vw)';
          tBot.style.transform = 'translateX(' + titleX + 'vw)';
          tTop.style.opacity = titleOpacity.toFixed(2);
          tBot.style.opacity = titleOpacity.toFixed(2);
        };
        onScroll();
        addEventListener('scroll', onScroll, {passive:true});
        addEventListener('resize', onScroll);
      }
    `;
  }
  function escapeHTML(s){ return String(s||'').replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])); }

  /* ============== Mini visuals (Q10 cards) ============== */
  function svgCentered(){
    return `<div class="iw-mini iw-mini-centered">
      <div class="iw-mini-h iw-mini-h--lg"></div>
      <div class="iw-mini-sub"></div>
      <div class="iw-mini-sub iw-mini-sub--short"></div>
      <div class="iw-mini-btn iw-mini-btn--primary"></div>
    </div>`;
  }
  function svgSplit(){
    return `<div class="iw-mini iw-mini-split">
      <div class="iw-mini-col">
        <div class="iw-mini-h"></div>
        <div class="iw-mini-sub"></div>
        <div class="iw-mini-sub iw-mini-sub--short"></div>
        <div class="iw-mini-btn-row">
          <div class="iw-mini-btn iw-mini-btn--primary"></div>
          <div class="iw-mini-btn iw-mini-btn--ghost"></div>
        </div>
      </div>
      <div class="iw-mini-col iw-mini-col--right">
        <div class="iw-mini-h"></div>
        <div class="iw-mini-sub"></div>
      </div>
    </div>`;
  }
  function svgFull(){
    return `<div class="iw-mini iw-mini-full">
      <div class="iw-mini-full-bg"></div>
      <div class="iw-mini-full-title iw-mini-full-title--top">HERO</div>
      <div class="iw-mini-full-card">
        <div class="iw-mini-h iw-mini-h--inv"></div>
        <div class="iw-mini-sub iw-mini-sub--inv"></div>
      </div>
      <div class="iw-mini-full-title iw-mini-full-title--bot">SCROLL</div>
      <div class="iw-mini-full-scrollbar"><div class="iw-mini-full-thumb"></div></div>
    </div>`;
  }

  /* ============== Misc helpers ============== */
  function $$(sel,r){return Array.from((r||document).querySelectorAll(sel));}
  // Each screen stores its current validator so the click handler can re-check at click time.
  let currentValidator = ()=>true;
  function nextBarFor(field, validator){
    currentValidator = validator;
    const ok = validator();
    const btn = el('button',{
      class:'iw-next' + (ok?'':' iw-next--off'),
      onclick: ()=>{
        if(!currentValidator()) return;
        go(state.step+1);
      }
    }, state.step===15 ? 'Bekijk mijn preview →' : 'Volgende →');
    if(!ok) btn.disabled = true;
    return el('div',{class:'iw-footer'}, btn);
  }
  function validate(fn){
    currentValidator = fn;
    const ok = fn();
    const btn = $('.iw-next', root);
    if(btn){ btn.disabled = !ok; btn.classList.toggle('iw-next--off', !ok); }
  }
  function validateMin(field, min){
    validate(()=> (state.answers[field]||'').trim().length>=min);
  }
  function updateCounter(ta, counter, min, max){
    const n = (ta.value||'').length;
    counter.textContent = `${n} / ${max} tekens` + (n<min?` · nog ${min-n} te gaan`:'');
    counter.classList.toggle('iw-counter--ok', n>=min);
  }

  /* ============== INIT ============== */
  // 1. Restore saved progress (answers + current step)
  loadState();
  // 2. Deeplink overrules saved step (only for stap-N)
  const m = location.hash.match(/^#stap-(\d+)/);
  if(m) state.step = Math.min(14, Math.max(1, parseInt(m[1],10)));
  else if(location.hash==='#welkom') state.step = 0;
  render();
  // 3. Restore scroll position from before the refresh
  try{
    const sy = sessionStorage.getItem(SCROLL_KEY);
    if(sy != null){
      // Disable smooth scroll briefly so it lands instantly
      const html = document.documentElement;
      const prev = html.style.scrollBehavior;
      html.style.scrollBehavior = 'auto';
      requestAnimationFrame(()=>{
        window.scrollTo(0, parseInt(sy,10)||0);
        setTimeout(()=>{ html.style.scrollBehavior = prev; }, 50);
      });
    }
  }catch(e){}

  // Persist whenever an answer mutates — light touch via input/change events on the root
  root.addEventListener('input', ()=>saveState());
  root.addEventListener('change', ()=>saveState());
  root.addEventListener('click', ()=>setTimeout(saveState,0));

})();
