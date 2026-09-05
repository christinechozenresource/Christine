/* ──────────────────────────────────────────────
   Christine Portfolio — script.js
   ────────────────────────────────────────────── */

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
    e.preventDefault();
    const targetId = tab.getAttribute('href').replace('#', '');
    const section  = document.getElementById(targetId);
    if (!section) return;
    setActiveTab(tab);
    const offset = 24;
    const top    = section.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// Init indicator on load
window.addEventListener('load', () => {
  const active = document.querySelector('.profile-tab--active') || tabs[0];
  if (active) moveIndicator(active);
});

// Update active tab on scroll
const tabSections = Array.from(tabs).map(t =>
  document.getElementById(t.getAttribute('href').replace('#', ''))
).filter(Boolean);

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + window.innerHeight * 0.25;
  let current = null;
  tabSections.forEach(sec => { if (sec.offsetTop <= scrollY) current = sec; });
  if (current) {
    const matching = document.querySelector(`.profile-tab[href="#${current.id}"]`);
    if (matching) setActiveTab(matching);
  }
}, { passive: true });

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
