// Minimal JS for accessibility, menu toggle, search filter, theme, cookie consent + analytics
(function(){
  const nav = document.querySelector('nav');
  const btn = document.getElementById('menuToggle');
  if(btn){
    btn.addEventListener('click', ()=>{ nav.classList.toggle('open'); });
  }
  // Theme toggle
  const THEME_KEY = 'wt-theme';
  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  const savedTheme = localStorage.getItem(THEME_KEY);
  const current = savedTheme || (prefersLight ? 'light' : 'dark');
  if(current === 'light'){ document.documentElement.setAttribute('data-theme','light'); }
  const updateToggleText = (btn)=>{
    if(!btn) return; const isLight = document.documentElement.getAttribute('data-theme')==='light';
    btn.textContent = isLight ? '☀️ Light' : '🌙 Dark';
  };
  const toggleTheme = ()=>{
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    if(isLight){ document.documentElement.removeAttribute('data-theme'); localStorage.setItem(THEME_KEY,'dark'); }
    else { document.documentElement.setAttribute('data-theme','light'); localStorage.setItem(THEME_KEY,'light'); }
    document.querySelectorAll('.theme-toggle').forEach(updateToggleText);
  };
  document.querySelectorAll('.theme-toggle').forEach(btn=>{ btn.addEventListener('click', toggleTheme); updateToggleText(btn); });

  // Client-side search filter on homepage cards
  const searchInput = document.getElementById('siteSearch');
  if(searchInput){
    searchInput.addEventListener('input', (e)=>{
      const q = e.target.value.toLowerCase();
      document.querySelectorAll('[data-card]')?.forEach(card =>{
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(q) ? '' : 'none';
      });
    });
  }

  // Mark current nav link
  const path = location.pathname.replace(/index\.html$/, '/');
  document.querySelectorAll('.nav-link').forEach(a=>{
    const href = a.getAttribute('href');
    if(href && (href === path || (href !== '/' && path.includes(href)))){
      a.setAttribute('aria-current','page');
    }
  });

  // Outbound link tracking (privacy-friendly simple)
  document.querySelectorAll('a[target="_blank"]').forEach(a=>{
    a.addEventListener('click', ()=>{
      if(window.gtag){ gtag('event','click', {event_category:'outbound', event_label:a.href}); }
    });
  });
})();



// Cookie consent + lightweight analytics (Plausible)
(function(){
  function ensureCookieBanner(){
    if(document.getElementById('cookieBanner')) return;
    const div = document.createElement('div');
    div.className = 'cookie-banner';
    div.id = 'cookieBanner';
    div.innerHTML = '<p>We use privacy-friendly analytics to understand traffic. No invasive tracking. You can allow or decline.</p><div class="cookie-actions"><button id="cookieDecline" class="cookie-btn" type="button">Decline</button><button id="cookieAccept" class="cookie-btn primary" type="button">Allow analytics</button></div>';
    document.body.appendChild(div);
  }
  function loadAnalytics(){
    if(document.getElementById('plausible-js')) return;
    const s = document.createElement('script');
    s.id = 'plausible-js';
    s.defer = true;
    s.setAttribute('data-domain','watchingtrending.site'); // TODO: đổi thành domain thật khi deploy
    s.src = 'https://plausible.io/js/script.js';
    document.head.appendChild(s);
  }
  const KEY='wt-cookie-consent';
  const stored = localStorage.getItem(KEY);
  ensureCookieBanner();
  const banner = document.getElementById('cookieBanner');
  if(!stored && banner){ banner.style.display='block'; }
  if(stored==='granted'){ loadAnalytics(); }
  document.getElementById('cookieAccept')?.addEventListener('click',()=>{localStorage.setItem(KEY,'granted'); banner?.remove(); loadAnalytics();});
  document.getElementById('cookieDecline')?.addEventListener('click',()=>{localStorage.setItem(KEY,'denied'); banner?.remove();});

  // Simple outbound click event (optional)
  document.querySelectorAll('a[target="_blank"]').forEach(a=>{
    a.addEventListener('click', ()=>{ if(window.plausible){ plausible('Outbound Link', {props:{href:a.href}}); } });
  });
})();
