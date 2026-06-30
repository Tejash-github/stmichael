// ============================================================
// ST. MICHAEL'S HIGH SCHOOL — Main JavaScript
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  // ── Navbar scroll effect ──────────────────────────────────
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
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
    // Close on link click
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

    // Create dots
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

    // Pause on hover
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

  // ── News Ticker ───────────────────────────────────────────
  const newsItems = document.querySelectorAll('.news-item');
  if (newsItems.length > 0) {
    let newsIdx = 0;
    setInterval(() => {
      newsItems[newsIdx].classList.remove('active');
      newsIdx = (newsIdx + 1) % newsItems.length;
      newsItems[newsIdx].classList.add('active');
    }, 4000);
  }

  // ── AOS (Animate on Scroll) ───────────────────────────────
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
  const galleryItems = document.querySelectorAll('.gallery-item');
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (!img) return;
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:9999;
        display:flex;align-items:center;justify-content:center;cursor:pointer;
        animation:fadeIn 0.2s ease;
      `;
      const fullImg = document.createElement('img');
      fullImg.src = img.src;
      fullImg.style.cssText = 'max-width:90vw;max-height:90vh;border-radius:12px;box-shadow:0 25px 50px rgba(0,0,0,0.5);';
      overlay.appendChild(fullImg);
      document.body.appendChild(overlay);
      overlay.addEventListener('click', () => overlay.remove());
    });
  });

  // ── Active nav link (by filename) ─────────────────────────
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
});
