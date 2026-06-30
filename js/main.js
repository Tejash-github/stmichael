// ============================================================
// ST. MICHAEL'S HIGH SCHOOL — main.js (Firestore-powered)
// ============================================================

// Using global getData and DEFAULTS from firebase-config.js

document.addEventListener('DOMContentLoaded', async () => {

  // ── Navbar scroll effect ──────────────────────────────────
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  // ── Mobile Menu Toggle ────────────────────────────────────
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      menuToggle.classList.toggle('open', isOpen);
      menuToggle.setAttribute('aria-expanded', isOpen);
    });
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', false);
      });
    });
  }

  // ── Hero Slider ───────────────────────────────────────────
  const slides = document.querySelectorAll('.hero-slide');
  const dotsContainer = document.getElementById('sliderDots');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');

  if (slides.length > 0) {
    let current = 0;
    let autoTimer;
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer?.appendChild(dot);
    });
    const dots = dotsContainer?.querySelectorAll('.slider-dot') || [];
    function goTo(index) {
      slides[current].classList.remove('active');
      dots[current]?.classList.remove('active');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current]?.classList.add('active');
    }
    function startAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => goTo(current + 1), 5500);
    }
    prevBtn?.addEventListener('click', () => { goTo(current - 1); startAuto(); });
    nextBtn?.addEventListener('click', () => { goTo(current + 1); startAuto(); });
    startAuto();
    const hero = document.querySelector('.hero');
    hero?.addEventListener('mouseenter', () => clearInterval(autoTimer));
    hero?.addEventListener('mouseleave', startAuto);
  }

  // ── Counter Animation ─────────────────────────────────────
  const counters = document.querySelectorAll('.stat-num[data-target]');
  if (counters.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-target'));
          const duration = 1800;
          const step = Math.ceil(target / (duration / 16));
          let current = 0;
          const timer = setInterval(() => {
            current = Math.min(current + step, target);
            el.textContent = current.toLocaleString();
            if (current >= target) clearInterval(timer);
          }, 16);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => observer.observe(c));
  }

  // ── AOS ───────────────────────────────────────────────────
  const aosElements = document.querySelectorAll('[data-aos]');
  if (aosElements.length > 0) {
    const aosObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('aos-animate');
          aosObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    aosElements.forEach(el => aosObserver.observe(el));
  }

  // ── Footer year ───────────────────────────────────────────
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ── Alumni form ───────────────────────────────────────────
  const alumniForm = document.getElementById('alumniForm');
  if (alumniForm) {
    alumniForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = alumniForm.querySelector('[type="submit"]');
      btn.textContent = '✓ Application Submitted!';
      btn.disabled = true;
      btn.style.background = '#16a34a';
    });
  }

  // ── Gallery lightbox ─────────────────────────────────────
  function initLightbox() {
    document.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (!img) return;
        const overlay = document.createElement('div');
        overlay.style.cssText = `position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:9999;display:flex;align-items:center;justify-content:center;cursor:pointer;`;
        const fullImg = document.createElement('img');
        fullImg.src = img.src;
        fullImg.style.cssText = 'max-width:90vw;max-height:90vh;border-radius:12px;box-shadow:0 25px 50px rgba(0,0,0,0.5);';
        overlay.appendChild(fullImg);
        document.body.appendChild(overlay);
        overlay.addEventListener('click', () => overlay.remove());
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') overlay.remove(); }, { once: true });
      });
    });
  }

  // ── Active nav link ───────────────────────────────────────
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    link.classList.toggle('active', href === currentPage || (currentPage === '' && href === 'index.html'));
  });

  // ═══════════════════════════════════════════════════════════
  // FIRESTORE DATA LOADERS — called per page
  // ═══════════════════════════════════════════════════════════

  // ── Load News Ticker ──────────────────────────────────────
  const newsTicker = document.getElementById('newsTicker');
  if (newsTicker) {
    const data = await getData('news');
    const items = (data?.items) || DEFAULTS.news;
    if (items.length > 0) {
      newsTicker.innerHTML = items.map((item, i) => `
        <div class="news-item ${i === 0 ? 'active' : ''}">
          <span class="news-dot"></span>
          <span>${item.text}</span>
        </div>
      `).join('');
      // Restart ticker
      const newsItems = newsTicker.querySelectorAll('.news-item');
      if (newsItems.length > 1) {
        let newsIdx = 0;
        setInterval(() => {
          newsItems[newsIdx].classList.remove('active');
          newsIdx = (newsIdx + 1) % newsItems.length;
          newsItems[newsIdx].classList.add('active');
        }, 4000);
      }
    }
  }

  // ── Load Admission Notice ─────────────────────────────────
  const admissionCard = document.getElementById('admissionCard');
  if (admissionCard) {
    const data = await getData('admission');
    const d = data || DEFAULTS.admission;
    const titleEl = admissionCard.querySelector('.admission-notice-title');
    const listEl = admissionCard.querySelector('.doc-list');
    if (titleEl) titleEl.textContent = d.title || DEFAULTS.admission.title;
    if (listEl && d.documents) {
      listEl.innerHTML = d.documents.map(doc => `<li>${doc}</li>`).join('');
    }
  }

  // ── Load School Hours ─────────────────────────────────────
  const hoursCards = document.querySelectorAll('[data-hours]');
  if (hoursCards.length > 0) {
    const data = await getData('hours');
    const h = data || DEFAULTS.hours;
    hoursCards.forEach(el => {
      const key = el.getAttribute('data-hours');
      if (h[key]) el.textContent = h[key];
    });
  }

  // ── Load Contact Details ──────────────────────────────────
  const contactEls = document.querySelectorAll('[data-contact]');
  if (contactEls.length > 0) {
    const data = await getData('contact');
    const c = data || DEFAULTS.contact;
    contactEls.forEach(el => {
      const key = el.getAttribute('data-contact');
      if (c[key]) el.textContent = c[key];
    });
  }

  // ── Load School Toppers ───────────────────────────────────
  const toppersGrid = document.getElementById('toppersGrid');
  if (toppersGrid) {
    const data = await getData('toppers');
    const items = (data?.items) || DEFAULTS.toppers;
    toppersGrid.innerHTML = items.map((t, i) => `
      <div class="topper-card" data-aos="fadeUp" ${i > 0 ? `data-aos-delay="${i * 100}"` : ''}>
        <div class="topper-rank">${getRankEmoji(t.rank)}</div>
        <p class="topper-name">${t.name}</p>
        <p class="topper-score">Class ${t.class} — ${t.score}</p>
      </div>
    `).join('');
    // Re-observe new AOS elements
    toppersGrid.querySelectorAll('[data-aos]').forEach(el => {
      if (aosElements.length > 0) aosElements[0].__aosObserver?.observe(el);
    });
  }

  function getRankEmoji(rank) {
    if (rank === '1st' || rank === '1') return '🥇';
    if (rank === '2nd' || rank === '2') return '🥈';
    if (rank === '3rd' || rank === '3') return '🥉';
    return `<span style="font-size:1.5rem;font-weight:800;color:#0f2040;">${rank}</span>`;
  }

  // ── Load Gallery ──────────────────────────────────────────
  const galleryGrid = document.getElementById('galleryGrid');
  if (galleryGrid) {
    const data = await getData('gallery');
    const items = (data?.items) || DEFAULTS.gallery;
    // Preserve existing items or rebuild from Firestore
    galleryGrid.innerHTML = items.map(g => `
      <div class="gallery-item" data-category="${g.category || 'general'}">
        <img src="${g.url}" alt="${g.caption}" loading="lazy" onerror="this.parentElement.style.display='none'">
        <div class="gallery-overlay">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
        </div>
        <span style="position:absolute;bottom:0.5rem;left:0.5rem;background:rgba(0,0,0,0.6);color:white;font-size:0.65rem;padding:0.2rem 0.5rem;border-radius:9999px;text-transform:uppercase;letter-spacing:0.06em;">${g.category || 'general'}</span>
      </div>
    `).join('');
    initLightbox();

    // Re-wire gallery filter buttons
    document.querySelectorAll('.gallery-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.gallery-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        galleryGrid.querySelectorAll('.gallery-item').forEach(item => {
          const show = filter === 'all' || item.getAttribute('data-category') === filter;
          item.style.display = show ? '' : 'none';
        });
      });
    });
  }

  // ── Load Faculty ──────────────────────────────────────────
  const facultyGrid = document.getElementById('facultyGrid');
  if (facultyGrid) {
    const data = await getData('faculty');
    const items = (data?.items) || DEFAULTS.faculty;
    facultyGrid.innerHTML = items.map((f, i) => `
      <div class="faculty-card" data-aos="fadeUp" data-aos-delay="${(i % 4) * 100}">
        <div class="faculty-photo">${(f.name || 'F').charAt(0).toUpperCase()}</div>
        <h3>${f.name}</h3>
        <p class="faculty-dept">${f.department}</p>
        ${f.designation ? `<p style="font-size:0.75rem;color:#9ca3af;margin-top:0.25rem;">${f.designation}</p>` : ''}
      </div>
    `).join('');
  }

  // ── Load Principal Message ────────────────────────────────
  const principalSection = document.getElementById('principalSection');
  if (principalSection) {
    const data = await getData('principal');
    const p = data || DEFAULTS.principal;
    const nameEl = principalSection.querySelector('.principal-name');
    const titleEl = principalSection.querySelector('.principal-title');
    const photoEl = principalSection.querySelector('.principal-photo');
    const msgTitleEl = principalSection.querySelector('.principal-msg-title');
    const msgBodyEl = principalSection.querySelector('.principal-msg-body');
    const signEl = principalSection.querySelector('.message-sign');
    if (nameEl) nameEl.textContent = p.name;
    if (titleEl) titleEl.textContent = p.title;
    if (photoEl && p.photoUrl) { photoEl.src = p.photoUrl; photoEl.alt = p.name; }
    if (msgTitleEl) msgTitleEl.textContent = p.messageTitle;
    if (msgBodyEl && p.message) {
      msgBodyEl.innerHTML = p.message.split('\n').filter(l => l.trim()).map(para => `<p>${para}</p>`).join('');
    }
    if (signEl) signEl.textContent = `Happy Learning! — ${p.name}, ${p.title}`;
  }

  initLightbox();
});
