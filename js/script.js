/* ──────────────────────────────────────────────
   Christine Portfolio — script.js
   ────────────────────────────────────────────── */

/* ── Code Rain — cover photo only ── */
(function() {
  const canvas  = document.getElementById('codeRain');
  if (!canvas) return;
  const ctx     = canvas.getContext('2d');
  const chars   = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF</>{}[]const';
  const fontSize = 13;
  let cols, drops;

  function resize() {
    const cover   = canvas.parentElement;
    canvas.width  = cover.offsetWidth;
    canvas.height = cover.offsetHeight;
    cols  = Math.floor(canvas.width / fontSize);
    drops = Array(cols).fill(1);
  }

  function draw() {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.08)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      if (Math.random() > 0.93) {
        ctx.fillStyle = '#ffffff';
      } else if (Math.random() > 0.5) {
        ctx.fillStyle = '#93c5fd';
      } else {
        ctx.fillStyle = '#3b82f6';
      }
      ctx.fillText(char, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.97) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  resize();
  window.addEventListener('resize', resize);
  setInterval(draw, 40);
})();

/* ── Tab indicator + smooth scroll to section content ── */
const tabs        = document.querySelectorAll('.profile-tab[data-tab]');
const indicator   = document.querySelector('.tab-indicator');

function moveIndicator(tab) {
  if (!indicator || !tab) return;
  const tabsNav = tab.closest('.profile-tabs');
  const navRect = tabsNav.getBoundingClientRect();
  const tabRect = tab.getBoundingClientRect();
  indicator.style.left  = (tabRect.left - navRect.left + tabsNav.scrollLeft) + 'px';
  indicator.style.width = tabRect.width + 'px';
}

function setActiveTab(tab) {
  tabs.forEach(t => t.classList.remove('profile-tab--active'));
  tab.classList.add('profile-tab--active');
  moveIndicator(tab);
}

// On tab click — scroll directly to section content
tabs.forEach(tab => {
  tab.addEventListener('click', e => {
    const href = tab.getAttribute('href');
    // Home tab — scroll to top normally
    if (!href.startsWith('#')) return;
    e.preventDefault();
    const targetId = href.replace('#', '');
    const section  = document.getElementById(targetId);
    if (!section) return;
    setActiveTab(tab);
    const offset = 24;
    const top    = section.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// Init indicator on load — Home is active by default
window.addEventListener('load', () => {
  const homeTab = document.querySelector('.profile-tab[data-tab="home"]');
  if (homeTab) setActiveTab(homeTab);
});

// Update active tab on scroll
const tabSections = Array.from(tabs)
  .filter(t => t.getAttribute('href').startsWith('#'))
  .map(t => document.getElementById(t.getAttribute('href').replace('#', '')))
  .filter(Boolean);

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + window.innerHeight * 0.25;

  // If near the very top, activate Home
  if (window.scrollY < 100) {
    const homeTab = document.querySelector('.profile-tab[data-tab="home"]');
    if (homeTab) { setActiveTab(homeTab); return; }
  }

  let current = null;
  tabSections.forEach(sec => { if (sec.offsetTop <= scrollY) current = sec; });
  if (current) {
    const matching = document.querySelector(`.profile-tab[href="#${current.id}"]`);
    if (matching) setActiveTab(matching);
  }
}, { passive: true });

/* ── Back to top button ── */
const backToTopBtn = document.getElementById('backToTopBtn');
if (backToTopBtn) {
  window.addEventListener('scroll', () => {
    backToTopBtn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── Profile avatar auto-rotate ── */
const avatarEl     = document.getElementById('profileAvatar');
const avatarPhotos = ['Profile/PROFILE 1.png', 'Profile/PROFILE 2.png'];
let avatarIndex    = 0;

if (avatarEl) {
  setInterval(() => {
    avatarIndex = (avatarIndex + 1) % avatarPhotos.length;
    avatarEl.style.opacity = '0';
    setTimeout(() => {
      avatarEl.src = avatarPhotos[avatarIndex];
      avatarEl.style.opacity = '1';
    }, 600);
  }, 5000);
}

/* ── Typed / typewriter effect ── */
const roles = [
  'full stack web apps.',
  'mobile applications.',
  'AR experiences.',
  'real products, for real clients.',
];
const typedEl = document.getElementById('typed');
let roleIndex = 0, charIndex = 0, isDeleting = false;

function typeRole() {
  if (!typedEl) return;
  const current = roles[roleIndex];
  if (!isDeleting) {
    typedEl.textContent = current.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      isDeleting = true;
      setTimeout(typeRole, 2000);
      return;
    }
  } else {
    typedEl.textContent = current.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }
  setTimeout(typeRole, isDeleting ? 55 : 105);
}
typeRole();

/* ── Scroll-reveal ── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Project filter tabs ── */
const filterBtns = document.querySelectorAll('.proj-filter');
const projGroups = document.querySelectorAll('.proj-group');
const projCards  = document.querySelectorAll('.proj-card[data-tags]');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('proj-filter--active'));
    btn.classList.add('proj-filter--active');
    const filter = btn.dataset.filter;
    projGroups.forEach(group => {
      if (filter === 'all') {
        group.removeAttribute('hidden');
      } else {
        const hasMatch = Array.from(group.querySelectorAll('[data-tags]'))
          .some(c => c.dataset.tags === filter);
        group.toggleAttribute('hidden', !hasMatch);
      }
    });
    projCards.forEach(card => {
      card.style.display = (filter === 'all' || card.dataset.tags === filter) ? '' : 'none';
    });
  });
});
