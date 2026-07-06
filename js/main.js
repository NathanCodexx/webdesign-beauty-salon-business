/**
 * NathanCodexx Beauty Salon — Main JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollSpy();
  initBackToTop();
  initPricingTabs();
  initGallery();
  initBookingForm();
});

/* ---- Navbar scroll effect & mobile menu ---- */
function initNavbar() {
  const navbar = document.querySelector('.navbar-custom');
  const collapse = document.querySelector('#mainNav');
  if (!navbar) return;

  const toggleScrolled = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  };

  window.addEventListener('scroll', toggleScrolled, { passive: true });
  toggleScrolled();

  if (collapse) {
    collapse.addEventListener('show.bs.collapse', () => {
      document.body.classList.add('nav-open');
    });
    collapse.addEventListener('hidden.bs.collapse', () => {
      document.body.classList.remove('nav-open');
    });
  }

  document.querySelectorAll('.navbar-nav .nav-link, .navbar-nav .btn').forEach((link) => {
    link.addEventListener('click', () => {
      const toggler = document.querySelector('.navbar-toggler');
      if (collapse?.classList.contains('show') && toggler) {
        toggler.click();
      }
    });
  });
}

/* ---- Scroll spy for active nav links ---- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

  if (!sections.length || !navLinks.length) return;

  const isMobile = () => window.matchMedia('(max-width: 991px)').matches;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    {
      rootMargin: isMobile() ? '-20% 0px -65% 0px' : '-40% 0px -55% 0px',
    }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ---- Back to top button ---- */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---- Pricing tabs ---- */
function initPricingTabs() {
  const tabs = document.querySelectorAll('.pricing-tab');
  const panels = document.querySelectorAll('.pricing-panel');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach((t) => t.classList.remove('active'));
      panels.forEach((p) => p.classList.remove('active'));

      tab.classList.add('active');
      document.getElementById(target)?.classList.add('active');
    });
  });
}

/* ---- Gallery filter & lightbox ---- */
function initGallery() {
  const filters = document.querySelectorAll('.gallery-filter');
  const items = document.querySelectorAll('.gallery-item');
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = lightbox?.querySelector('img');
  const lightboxCaption = lightbox?.querySelector('.lightbox-caption');
  const closeBtn = lightbox?.querySelector('.lightbox-close');

  filters.forEach((filter) => {
    filter.addEventListener('click', () => {
      const category = filter.dataset.filter;

      filters.forEach((f) => f.classList.remove('active'));
      filter.classList.add('active');

      items.forEach((item) => {
        const match = category === 'all' || item.dataset.category === category;
        item.classList.toggle('hidden', !match);
      });
    });
  });

  if (!lightbox || !lightboxImg) return;

  items.forEach((item) => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.querySelector('.gallery-overlay h5')?.textContent || '';
      const category = item.querySelector('.gallery-overlay span')?.textContent || '';

      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      if (lightboxCaption) {
        lightboxCaption.innerHTML = `<strong>${title}</strong><br><small>${category}</small>`;
      }
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  closeBtn?.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
  });
}

/* ---- Booking form validation ---- */
function initBookingForm() {
  const form = document.getElementById('bookingForm');
  const successEl = document.getElementById('bookingSuccess');
  if (!form) return;

  const setMinDate = () => {
    const dateInput = form.querySelector('#bookingDate');
    if (!dateInput) return;
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    dateInput.min = `${yyyy}-${mm}-${dd}`;
  };

  setMinDate();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();

    form.classList.add('was-validated');

    if (!form.checkValidity()) return;

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    console.log('Booking submitted:', data);

    form.style.display = 'none';
    if (successEl) {
      successEl.classList.add('active');
      const ref = `NC-${Date.now().toString(36).toUpperCase()}`;
      const refEl = successEl.querySelector('.booking-ref');
      if (refEl) refEl.textContent = ref;
    }
  });

  const resetBtn = document.getElementById('bookingReset');
  resetBtn?.addEventListener('click', () => {
    form.reset();
    form.classList.remove('was-validated');
    form.style.display = '';
    successEl?.classList.remove('active');
    setMinDate();
  });
}
