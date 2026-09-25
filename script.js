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
  onScroll();

  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar-nav a[href^="#"]');

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
  requestAnimationFrame(() => {
    setTimeout(() => heroBg.classList.add('loaded'), 100);
  });
})();

/* ──────────────────────────────────────────
   5. GALLERY — loads from gallery.json
   Edit gallery.json to add/remove photos.
   Each entry: { "url": "images/photo.jpg", "caption": "My Caption" }
────────────────────────────────────────── */
(function initGallery() {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

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
           decoding="async">
      <div class="gallery-overlay">
        <span class="gallery-caption">${escHtml(item.caption || '')}</span>
      </div>
      <div class="gallery-zoom-icon" aria-hidden="true">🔍</div>
    `;

    div.addEventListener('click',  () => openLightbox(index));
    div.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(index); }
    });

    return div;
  }

  function renderGallery(items) {
    grid.innerHTML = '';
    window.__galleryItems = items;

    if (!items.length) {
      grid.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:48px 20px;color:var(--text-muted);">
          <div style="font-size:2.5rem;margin-bottom:12px;">📸</div>
          <p style="font-size:.95rem;">Photos coming soon — check back shortly!</p>
        </div>`;
      return;
    }

    items.forEach((item, i) => grid.appendChild(createItem(item, i)));

    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.1 });
    grid.querySelectorAll('.reveal').forEach(el => io.observe(el));
  }

  fetch('gallery.json?v=' + Date.now())
    .then(r => { if (!r.ok) throw new Error(); return r.json(); })
    .then(data => renderGallery(Array.isArray(data) ? data : []))
    .catch(() => renderGallery([]));
})();

/* ──────────────────────────────────────────
   6. LIGHTBOX
────────────────────────────────────────── */
(function initLightbox() {
  const lb       = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lightbox-img');
  const lbCap    = document.getElementById('lightbox-caption');
  const btnClose = document.getElementById('lightbox-close');
  const btnPrev  = document.getElementById('lb-prev');
  const btnNext  = document.getElementById('lb-next');

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
