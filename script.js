/**
 * Smart Guest House — Main JavaScript
 * Handles: sticky nav, mobile menu, scroll-reveal, gallery lightbox,
 *          gallery.json loading, floating button interactions.
 *
 * STATIC-SITE NOTE:
 *   This site has NO backend. Gallery images are managed via:
 *   1. upload.html + Cloudinary (image hosting)
 *   2. gallery.json (manually edited after each upload)
 *   3. This script reads gallery.json at page load to render the grid.
 *   No server, database, or secret API key is ever needed here.
 */

'use strict';

/* ──────────────────────────────────────────
   1. STICKY NAVBAR
────────────────────────────────────────── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  // Active link highlighting
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.navbar-nav a[href^="#"]');

  const linkObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
      });
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => linkObserver.observe(s));
})();

/* ──────────────────────────────────────────
   2. MOBILE NAV DRAWER
────────────────────────────────────────── */
(function initMobileNav() {
  const hamburger   = document.getElementById('hamburger');
  const mobileNav   = document.getElementById('mobile-nav');
  const overlay     = document.getElementById('mobile-overlay');
  const mobileLinks = document.querySelectorAll('#mobile-nav a');

  if (!hamburger || !mobileNav || !overlay) return;

  const open  = () => { mobileNav.classList.add('open'); overlay.classList.add('open'); hamburger.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const close = () => { mobileNav.classList.remove('open'); overlay.classList.remove('open'); hamburger.classList.remove('open'); document.body.style.overflow = ''; };

  hamburger.addEventListener('click', () => mobileNav.classList.contains('open') ? close() : open());
  overlay.addEventListener('click', close);
  mobileLinks.forEach(a => a.addEventListener('click', close));

  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

/* ──────────────────────────────────────────
   3. SCROLL REVEAL
────────────────────────────────────────── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => io.observe(el));
})();

/* ──────────────────────────────────────────
   4. HERO IMAGE PAN
────────────────────────────────────────── */
(function initHeroBg() {
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg) return;
  // Trigger CSS zoom-out after a brief delay to ensure paint
  requestAnimationFrame(() => {
    setTimeout(() => heroBg.classList.add('loaded'), 100);
  });
})();

/* ──────────────────────────────────────────
   5. GALLERY — load from gallery.json
────────────────────────────────────────── */
(function initGallery() {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  // Placeholder images used when gallery.json is empty or missing.
  // These are inline SVG data-URIs so the layout works without any extra files.
  const PLACEHOLDERS = [
    { url: 'images/hero.jpg', caption: 'Grand Mandap & Stage Setup' },
    { url: makePlaceholderSVG('Fairy Light Decor',     '#8B1A1A', '#F5D88A'), caption: 'Fairy Light Decor' },
    { url: makePlaceholderSVG('Seating Arrangement',   '#5C0F0F', '#E8B84B'), caption: 'Seating Arrangement' },
    { url: makePlaceholderSVG('Floral Entrance',       '#3D0B0B', '#C9902B'), caption: 'Floral Entrance' },
    { url: makePlaceholderSVG('Reception Setup',       '#8B1A1A', '#F5D88A'), caption: 'Reception Setup' },
    { url: makePlaceholderSVG('Catering Area',         '#5C0F0F', '#E8B84B'), caption: 'Catering Area' },
    { url: makePlaceholderSVG('Venue at Night',        '#1A0505', '#C9902B'), caption: 'Venue at Night' },
    { url: makePlaceholderSVG('Stage Backdrop',        '#3D0B0B', '#F5D88A'), caption: 'Stage Backdrop' },
    { url: makePlaceholderSVG('Garden & Lawn View',    '#8B1A1A', '#E8B84B'), caption: 'Garden & Lawn View' },
  ];

  function makePlaceholderSVG(label, bgColor, textColor) {
    // Returns a data-URI SVG placeholder with Indian-style decoration
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">
      <rect width="400" height="300" fill="${bgColor}"/>
      <rect x="8" y="8" width="384" height="284" fill="none" stroke="${textColor}" stroke-width="2" stroke-dasharray="10,5" rx="6"/>
      <text x="200" y="130" text-anchor="middle" font-family="serif" font-size="36" fill="${textColor}" opacity="0.5">🌸</text>
      <text x="200" y="170" text-anchor="middle" font-family="Georgia,serif" font-size="16" font-weight="bold" fill="${textColor}">${label}</text>
      <text x="200" y="195" text-anchor="middle" font-family="sans-serif" font-size="11" fill="${textColor}" opacity="0.7">Smart Guest House</text>
      <text x="200" y="240" text-anchor="middle" font-family="sans-serif" font-size="10" fill="${textColor}" opacity="0.5">Replace with real photo</text>
    </svg>`;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  // Build a gallery item element
  function createItem(item, index) {
    const div = document.createElement('div');
    div.className = 'gallery-item reveal';
    div.setAttribute('role', 'button');
    div.setAttribute('tabindex', '0');
    div.setAttribute('aria-label', 'View: ' + (item.caption || 'Gallery photo ' + (index + 1)));
    div.dataset.index = index;

    div.innerHTML = `
      <img src="${escHtml(item.url)}"
           alt="${escHtml(item.caption || 'Smart Guest House event photo')}"
           loading="lazy"
           decoding="async"
           onerror="this.src=''">
      <div class="gallery-overlay">
        <span class="gallery-caption">${escHtml(item.caption || '')}</span>
      </div>
      <div class="gallery-zoom-icon" aria-hidden="true">🔍</div>
    `;

    div.addEventListener('click',  () => openLightbox(index));
    div.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(index); } });

    return div;
  }

  function renderGallery(items) {
    grid.innerHTML = '';
    window.__galleryItems = items; // store for lightbox
    items.forEach((item, i) => grid.appendChild(createItem(item, i)));

    // re-observe for scroll-reveal
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.1 });
    grid.querySelectorAll('.reveal').forEach(el => io.observe(el));

    // Update note
    const note = document.getElementById('gallery-note');
    if (note) {
      note.style.display = (items === PLACEHOLDERS) ? 'block' : 'none';
    }
  }

  // Fetch gallery.json; fall back to placeholders on any error or if empty
  fetch('gallery.json?v=' + Date.now())
    .then(r => { if (!r.ok) throw new Error('not found'); return r.json(); })
    .then(data => {
      const items = Array.isArray(data) && data.length > 0 ? data : PLACEHOLDERS;
      renderGallery(items);
    })
    .catch(() => renderGallery(PLACEHOLDERS));
})();

/* ──────────────────────────────────────────
   6. LIGHTBOX
────────────────────────────────────────── */
(function initLightbox() {
  const lb      = document.getElementById('lightbox');
  const lbImg   = document.getElementById('lightbox-img');
  const lbCap   = document.getElementById('lightbox-caption');
  const btnClose = document.getElementById('lightbox-close');
  const btnPrev = document.getElementById('lb-prev');
  const btnNext = document.getElementById('lb-next');

  if (!lb) return;

  let currentIdx = 0;

  window.openLightbox = function(index) {
    const items = window.__galleryItems || [];
    if (!items.length) return;
    currentIdx = ((index % items.length) + items.length) % items.length;
    showItem();
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
    btnClose.focus();
  };

  function showItem() {
    const items = window.__galleryItems || [];
    const item  = items[currentIdx];
    if (!item) return;
    lbImg.src = item.url;
    lbImg.alt = item.caption || 'Smart Guest House event photo';
    lbCap.textContent = item.caption || '';
    const hasMany = items.length > 1;
    btnPrev.style.display = hasMany ? '' : 'none';
    btnNext.style.display = hasMany ? '' : 'none';
  }

  function closeLightbox() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }

  btnClose.addEventListener('click', closeLightbox);
  btnPrev.addEventListener('click', () => {
    currentIdx = (currentIdx - 1 + (window.__galleryItems?.length || 1)) % (window.__galleryItems?.length || 1);
    showItem();
  });
  btnNext.addEventListener('click', () => {
    currentIdx = (currentIdx + 1) % (window.__galleryItems?.length || 1);
    showItem();
  });

  lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  btnPrev.click();
    if (e.key === 'ArrowRight') btnNext.click();
  });
})();

/* ──────────────────────────────────────────
   7. UTILITY
────────────────────────────────────────── */
function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
