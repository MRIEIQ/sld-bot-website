// ================================================
// script.js — SLD Bot Website
// ================================================


// ── Navbar scroll effect ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ── Mobile hamburger ──
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ── Smooth active nav link ──
const sections = document.querySelectorAll('section[id]');
const allNavLinks = document.querySelectorAll('.nav-link');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      allNavLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.35 });
sections.forEach(s => observer.observe(s));

// ── Counter animation ──
function animateCounter(el, targetOverride) {
  const target = targetOverride !== undefined ? targetOverride : parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}
const statEls = document.querySelectorAll('.stat-num[data-target]');
setTimeout(() => {
  statEls.forEach(el => animateCounter(el));
}, 100);

// ── Command tabs ──
const tabs = document.querySelectorAll('.cmd-tab');
const panels = document.querySelectorAll('.cmd-panel');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    const panel = document.getElementById('panel-' + tab.dataset.tab);
    if (panel) panel.classList.add('active');
  });
});

// ── FAQ accordion ──
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

// ── Floating particles ──
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 25; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (8 + Math.random() * 14) + 's';
    p.style.animationDelay = (Math.random() * 10) + 's';
    const size = (2 + Math.random() * 3) + 'px';
    p.style.width = size;
    p.style.height = size;
    p.style.opacity = (0.2 + Math.random() * 0.5).toString();
    container.appendChild(p);
  }
}
createParticles();

// ── Reveal on scroll animation ──
const revealEls = document.querySelectorAll(
  '.about-card, .feature-card, .rule-card, .support-card, .cmd-item, .cta-content'
);
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, i * 40);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  revealObserver.observe(el);
});

// ── Interactive UI Upgrades ──

// Mouse Glow Effect
const glow = document.createElement('div');
glow.className = 'cursor-glow';
document.body.appendChild(glow);

let isMouseMoving = false;
let mouseTimeout;

document.addEventListener('mousemove', (e) => {
  glow.style.left = `${e.clientX}px`;
  glow.style.top = `${e.clientY}px`;
  
  if (!isMouseMoving) {
    glow.style.opacity = '1';
    isMouseMoving = true;
  }
  
  clearTimeout(mouseTimeout);
  mouseTimeout = setTimeout(() => {
    glow.style.opacity = '0';
    isMouseMoving = false;
  }, 1000);
});

document.addEventListener('mouseleave', () => {
  glow.style.opacity = '0';
});

// Button Ripple Effect
const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-outlined, .btn-nav');
buttons.forEach(btn => {
  btn.addEventListener('mousedown', function (e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    this.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  });
});

// Language Selector Toggle
const langBtn = document.getElementById('langBtn');
const langSelector = document.querySelector('.lang-selector');

if (langBtn && langSelector) {
  langBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    langSelector.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (!langSelector.contains(e.target)) {
      langSelector.classList.remove('open');
    }
  });

  // Handle lang item click
  const langItems = document.querySelectorAll('.lang-item');
  langItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      // Update active state visually
      langItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      
      // Update button flag
      const flag = item.querySelector('.lang-flag').textContent;
      langBtn.querySelector('.lang-flag').textContent = flag;
      
      langSelector.classList.remove('open');
      
      // Add actual language change logic here if needed
      // e.g. set cookie, reload page with ?lang=ar
    });
  });
}
