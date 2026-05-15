/* MOBILE NAV — werkt op alle pagina's. Injecteert de overlay én bind klik-handlers. */
(function(){
  function init(){
    if(document.getElementById('mobileMenu')) return;
    const btn = document.querySelector('.nav-mobile-btn');
    if(!btn) return;

    // Lees nav-links uit huidige nav voor consistentie
    const navLinks = document.querySelectorAll('nav .nav-links a');
    const navCta = document.querySelector('nav .nav-cta');

    const overlay = document.createElement('div');
    overlay.id = 'mobileMenu';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = `
      <div class="mm-backdrop"></div>
      <div class="mm-panel" role="dialog" aria-label="Menu">
        <div class="mm-head">
          <span class="mm-logo"><span class="mm-dot"></span>David Spijker</span>
          <button class="mm-close" aria-label="Menu sluiten">×</button>
        </div>
        <ul class="mm-links"></ul>
        <div class="mm-cta-wrap"></div>
      </div>
    `;
    document.body.appendChild(overlay);

    const ul = overlay.querySelector('.mm-links');
    navLinks.forEach(a => {
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.href = a.getAttribute('href');
      link.textContent = a.textContent.trim();
      // Markeer actief als oorspronkelijke link gemarkeerd was
      if(a.style.fontWeight === '600' || a.getAttribute('style')?.includes('font-weight:600')){
        link.classList.add('active');
      }
      li.appendChild(link);
      ul.appendChild(li);
    });

    if(navCta){
      const ctaWrap = overlay.querySelector('.mm-cta-wrap');
      const cta = document.createElement('a');
      cta.href = navCta.getAttribute('href');
      cta.className = 'mm-cta';
      cta.textContent = navCta.textContent.trim();
      ctaWrap.appendChild(cta);
    }

    function open(){
      overlay.classList.add('open');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
    function close(){
      overlay.classList.remove('open');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    btn.addEventListener('click', open);
    overlay.querySelector('.mm-close').addEventListener('click', close);
    overlay.querySelector('.mm-backdrop').addEventListener('click', close);
    overlay.querySelectorAll('.mm-links a, .mm-cta').forEach(a => {
      a.addEventListener('click', () => setTimeout(close, 50));
    });
    document.addEventListener('keydown', e => { if(e.key === 'Escape') close(); });
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
