/* ──────────────────────────────────────────────
   Christine Portfolio — script.js
   ────────────────────────────────────────────── */

/* ── Smooth scroll for anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── Project filter tabs ── */
const filterBtns  = document.querySelectorAll('.proj-filter');
const projGroups  = document.querySelectorAll('.proj-group');
const projCards   = document.querySelectorAll('.proj-card[data-tags]');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('proj-filter--active'));
    btn.classList.add('proj-filter--active');

    const filter = btn.dataset.filter;

    projGroups.forEach(group => {
      if (filter === 'all') {
        group.removeAttribute('hidden');
      } else {
        const groupType = group.dataset.group;
        // show group if it matches or contains matching cards
        const hasMatch = Array.from(group.querySelectorAll('[data-tags]'))
          .some(c => c.dataset.tags === filter);
        group.toggleAttribute('hidden', !hasMatch);
      }
    });

    projCards.forEach(card => {
      if (filter === 'all') {
        card.removeAttribute('data-hidden');
        card.style.display = '';
      } else {
        const match = card.dataset.tags === filter;
        if (match) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      }
    });
  });
});

/* ── Active profile tab on scroll ── */
const tabs = Array.from(document.querySelectorAll('.profile-tab[href^="#"]'));
const sections = tabs.map(t => document.querySelector(t.getAttribute('href'))).filter(Boolean);

function updateActivetab() {
  const scrollY = window.scrollY + window.innerHeight * 0.3;
  let active = -1;
  sections.forEach((sec, i) => { if (sec.offsetTop <= scrollY) active = i; });
  tabs.forEach((tab, i) => tab.classList.toggle('profile-tab--active', i === active));
}
window.addEventListener('scroll', updateActivetab, { passive: true });
updateActivetab();

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

/* ── Contact form ── */
const form       = document.getElementById('contactForm');
const submitBtn  = document.getElementById('submitBtn');
const formStatus = document.getElementById('formStatus');

function validateField(field) {
  const val = field.value.trim();
  if (!val) { field.classList.add('invalid'); return false; }
  if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
    field.classList.add('invalid'); return false;
  }
  field.classList.remove('invalid');
  return true;
}

if (form) {
  form.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('input', () => validateField(field));
    field.addEventListener('blur',  () => validateField(field));
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const fields = Array.from(form.querySelectorAll('input, textarea'));
    const allValid = fields.map(validateField).every(Boolean);
    if (!allValid) {
      formStatus.textContent = 'Please fill in all fields correctly.';
      formStatus.className   = 'form-note error';
      return;
    }
    submitBtn.disabled    = true;
    submitBtn.textContent = 'Sending…';
    formStatus.textContent = '';
    setTimeout(() => {
      formStatus.textContent = '✓ Message sent! I\'ll get back to you soon.';
      formStatus.className   = 'form-note success';
      form.reset();
      submitBtn.disabled   = false;
      submitBtn.innerHTML  = `<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Send message`;
    }, 1600);
  });
}
