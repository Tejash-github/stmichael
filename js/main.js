// ============================================================
// ST. MICHAEL'S HIGH SCHOOL — main.js (Firestore-powered)
// ============================================================

// Using global getData and DEFAULTS from firebase-config.js

document.addEventListener('DOMContentLoaded', async () => {

  // ── Theme Switcher Initializer ────────────────────────────
  const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', currentTheme);

  // Inject the floating theme toggle button
  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'theme-toggle-btn';
  toggleBtn.id = 'themeToggleBtn';
  toggleBtn.setAttribute('aria-label', 'Toggle theme mode');
  toggleBtn.innerHTML = `
    <!-- Moon icon (shows in light mode to switch to dark) -->
    <svg class="moon-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
    <!-- Sun icon (shows in dark mode to switch to light) -->
    <svg class="sun-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
  `;
  document.body.appendChild(toggleBtn);

  toggleBtn.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', activeTheme);
    localStorage.setItem('theme', activeTheme);
  });

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
  const aosObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-animate');
        aosObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
  window.aosObserver = aosObserver;
  document.querySelectorAll('[data-aos]').forEach(el => aosObserver.observe(el));

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
        <div class="news-item" data-index="${i}">
          <div class="news-content">${item.text}</div>
          <div class="news-item-footer">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>Read More</span>
          </div>
        </div>
      `).join('');

      // Add click listeners to open each news item in a modal popup
      newsTicker.querySelectorAll('.news-item').forEach(el => {
        el.addEventListener('click', () => {
          const idx = parseInt(el.getAttribute('data-index'));
          const item = items[idx];
          showNewsModal(item.text);
        });
      });
    }
  }

  // Helper to dynamically show news popup modal
  function showNewsModal(text) {
    // Check if modal container already exists, otherwise create it
    let overlay = document.getElementById('newsPopupModal');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'newsPopupModal';
      overlay.className = 'news-modal-overlay';
      overlay.innerHTML = `
        <div class="news-modal-card">
          <button class="news-modal-close" aria-label="Close modal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <div class="news-modal-header">
            <span class="news-modal-badge">Circular</span>
            <h3 class="news-modal-title">News Update</h3>
          </div>
          <div class="news-modal-body" id="newsModalBody"></div>
        </div>
      `;
      document.body.appendChild(overlay);

      // Event listener to close modal
      const closeBtn = overlay.querySelector('.news-modal-close');
      closeBtn.addEventListener('click', closeNewsModal);
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeNewsModal();
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('open')) closeNewsModal();
      });
    }

    // Set text and open modal
    document.getElementById('newsModalBody').textContent = text;
    overlay.style.display = 'flex'; // Ensure display is flex
    // Trigger transition Reflow
    overlay.offsetHeight;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden'; // Stop scrolling behind modal
  }

  function closeNewsModal() {
    const overlay = document.getElementById('newsPopupModal');
    if (overlay) {
      overlay.classList.remove('open');
      document.body.style.overflow = ''; // Restore scrolling
      setTimeout(() => {
        overlay.style.display = 'none';
      }, 400); // Wait for transition-slow (400ms)
    }
  }

  // ── Load Admission Notice ─────────────────────────────────
  const admissionCard = document.getElementById('admissionCard');
  if (admissionCard) {
    const data = await getData('admission');
    const d = data || DEFAULTS.admission;
    const titleEl = document.getElementById('admissionCard-title') || admissionCard.querySelector('.admission-notice-title');
    if (titleEl) titleEl.textContent = d.title || DEFAULTS.admission.title;
    if (d.documents) {
      admissionCard.innerHTML = `
        <p class="admission-meta-text" style="font-size: 0.875rem; color: var(--gray-600); margin-bottom: 0.75rem;">Required documents for registration:</p>
        <ul class="doc-list" style="padding-left: 1.25rem; font-size: 0.875rem; line-height: 1.6; display: flex; flex-direction: column; gap: 0.25rem;">
          ${d.documents.map(doc => `<li>${doc}</li>`).join('')}
        </ul>
      `;
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
      if (c[key]) {
        el.textContent = c[key];
        const linkEl = el.closest('a');
        if (linkEl) {
          if (key === 'phone' || key === 'principal' || key === 'juniorSection' || key === 'seniorSection') {
            linkEl.href = `tel:${c[key].replace(/\s+/g, '')}`;
          } else if (key === 'email' || key === 'adminEmail') {
            linkEl.href = `mailto:${c[key]}`;
          }
        }
      }
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
      window.aosObserver?.observe(el);
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
    // Re-observe new AOS elements
    facultyGrid.querySelectorAll('[data-aos]').forEach(el => {
      window.aosObserver?.observe(el);
    });
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

  // ── Load Downloads ────────────────────────────────────────
  const downloadGrid = document.getElementById('downloadGrid');
  if (downloadGrid) {
    const data = await getData('downloads');
    const items = (data?.items) || DEFAULTS.downloads;
    
    // Render initially with saved size
    downloadGrid.innerHTML = items.map((d, index) => `
      <a href="${d.url}" class="download-card" aria-label="Download ${d.title}" target="_blank">
        <div class="download-icon-box">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
        </div>
        <div class="download-info">
          <span class="download-title">${d.title}</span>
          <span class="download-meta" id="dl-meta-${index}">PDF File • ${d.size || 'Document'}</span>
        </div>
      </a>
    `).join('');

    // Fetch actual sizes dynamically in the background
    items.forEach(async (d, index) => {
      if (!d.url || d.url === '#' || d.url.startsWith('javascript:')) return;
      try {
        const res = await fetch(d.url, { method: 'HEAD' });
        const size = res.headers.get('content-length');
        if (size) {
          const bytes = parseInt(size, 10);
          let formattedSize = '';
          if (bytes >= 1048576) formattedSize = `${(bytes / 1048576).toFixed(1)} MB`;
          else formattedSize = `${(bytes / 1024).toFixed(0)} KB`;
          
          const metaEl = document.getElementById(`dl-meta-${index}`);
          if (metaEl) {
            metaEl.innerHTML = `PDF File • <span style="color:var(--gold-600); font-weight:600;">${formattedSize}</span>`;
          }
        }
      } catch (e) {
        // Fallback to offline defaults silently
      }
    });
  }

  // ── Multi-Step Admission Inquiry Form Wizard ──────────────
  const form = document.getElementById('admissionInquiryForm');
  if (form) {
    let step = 1;
    const progress = document.getElementById('wizardProgressBar');
    const nodes = document.querySelectorAll('.wizard-step-node');
    const panels = document.querySelectorAll('.wizard-step-panel');
    const prevBtn = document.getElementById('wizardPrevBtn');
    const nextBtn = document.getElementById('wizardNextBtn');
    const successScreen = document.getElementById('wizardSuccessScreen');

    function updateWizard() {
      // Update panels
      panels.forEach(p => p.classList.remove('active'));
      const activePanel = form.querySelector(`.wizard-step-panel[data-step="${step}"]`);
      if (activePanel) activePanel.classList.add('active');

      // Update progress bar & nodes
      progress.style.width = `${((step - 1) / (nodes.length - 1)) * 100}%`;
      nodes.forEach(n => {
        const s = parseInt(n.getAttribute('data-step'));
        n.classList.toggle('active', s === step);
        n.classList.toggle('completed', s < step);
      });

      // Update buttons
      prevBtn.style.visibility = step === 1 ? 'hidden' : 'visible';
      nextBtn.textContent = step === nodes.length ? 'Submit Inquiry' : 'Next';
    }

    function validateStep(s) {
      const activePanel = form.querySelector(`.wizard-step-panel[data-step="${s}"]`);
      if (!activePanel) return true;
      const inputs = activePanel.querySelectorAll('input, select, textarea');
      let valid = true;
      inputs.forEach(input => {
        if (!input.checkValidity()) {
          input.reportValidity();
          valid = false;
        }
      });
      return valid;
    }

    function populateRecap() {
      document.getElementById('recapStudentName').textContent = document.getElementById('studentName').value || '—';
      document.getElementById('recapClassSought').textContent = document.getElementById('classSought').value || '—';
      document.getElementById('recapStudentDob').textContent = document.getElementById('studentDob').value || '—';
      document.getElementById('recapStudentGender').textContent = document.getElementById('studentGender').value || '—';
      document.getElementById('recapParentName').textContent = document.getElementById('parentName').value || '—';
      document.getElementById('recapParentPhone').textContent = document.getElementById('parentPhone').value || '—';
      document.getElementById('recapParentEmail').textContent = document.getElementById('parentEmail').value || '—';
    }

    nextBtn.addEventListener('click', async () => {
      if (!validateStep(step)) return;

      if (step < nodes.length) {
        step++;
        if (step === nodes.length) populateRecap();
        updateWizard();
      } else {
        // Submit details
        nextBtn.disabled = true;
        nextBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="spin"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg> Submitting...`;
        
        const payload = {
          studentName: document.getElementById('studentName').value.trim(),
          studentDob: document.getElementById('studentDob').value,
          studentGender: document.getElementById('studentGender').value,
          classSought: document.getElementById('classSought').value,
          parentName: document.getElementById('parentName').value.trim(),
          parentPhone: document.getElementById('parentPhone').value.trim(),
          parentEmail: document.getElementById('parentEmail').value.trim(),
          parentAddress: document.getElementById('parentAddress').value.trim(),
          inquiryMessage: document.getElementById('inquiryMessage').value.trim(),
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          status: 'Pending'
        };

        try {
          await db.collection('admissionInquiries').add(payload);
          form.style.display = 'none';
          successScreen.style.display = 'block';
        } catch (err) {
          console.warn("Firestore write failed, fallback mock submission", err);
          // Fallback success for local testing/offline mode
          form.style.display = 'none';
          successScreen.style.display = 'block';
        }
      }
    });

    prevBtn.addEventListener('click', () => {
      if (step > 1) {
        step--;
        updateWizard();
      }
    });

    document.getElementById('wizardResetBtn').addEventListener('click', () => {
      form.reset();
      step = 1;
      form.style.display = 'block';
      successScreen.style.display = 'none';
      updateWizard();
    });

    updateWizard();
  }
});
