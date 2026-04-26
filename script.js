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

      // Translation logic
      const lang = item.getAttribute('data-lang');
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

      if (typeof translations === 'undefined') return;

      if (!window.originalTexts) {
        window.originalTexts = new Map();
        function walk(node) {
          // Skip script and style tags
          if (node.nodeType === Node.ELEMENT_NODE && (node.tagName === 'SCRIPT' || node.tagName === 'STYLE' || node.tagName === 'CODE')) return;
          if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim().length > 0) {
            window.originalTexts.set(node, node.nodeValue);
          } else {
            node.childNodes.forEach(walk);
          }
        }
        walk(document.body);
      }

      window.originalTexts.forEach((originalText, node) => {
        let text = originalText.trim().replace(/\s+/g, ' ');
        if (translations[lang] && translations[lang][text]) {
          const leadingMatch = originalText.match(/^\s*/);
          const trailingMatch = originalText.match(/\s*$/);
          node.nodeValue = leadingMatch[0] + translations[lang][text] + trailingMatch[0];
        } else {
          node.nodeValue = originalText; // fallback to en
        }
      });
    });
  });
}

// ── Discord OAuth2 Login ──
const CLIENT_ID = '1289557315741159544';
// Static redirect URI as requested
const REDIRECT_URI = 'https://mrieiq.github.io/sld-bot-website/';

const loginBtns = document.querySelectorAll('.login-discord-btn');
loginBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    // Using response_type=token since frontend-only apps cannot securely exchange code for token
    const oauthUrl = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=identify+email+guilds`;
    window.location.href = oauthUrl;
  });
});

window.addEventListener('load', () => {
  const fragment = new URLSearchParams(window.location.hash.slice(1));
  const accessToken = fragment.get('access_token');
  const tokenType = fragment.get('token_type');

  if (accessToken) {
    // Hide login buttons
    loginBtns.forEach(btn => btn.style.display = 'none');

    // Show user profile in navbar
    const userProfile = document.getElementById('user-profile');
    if (userProfile) {
      userProfile.style.display = 'flex';
      
      // Open dashboard on click instead of logout confirm
      userProfile.addEventListener('click', () => {
        openDashboard();
      });
    }

    fetch('https://discord.com/api/users/@me', {
      headers: {
        authorization: `${tokenType} ${accessToken}`
      }
    })
      .then(result => result.json())
      .then(response => {
        const { username, discriminator, avatar, id } = response;
        const displayName = discriminator === '0' ? username : `${username}#${discriminator}`;
        const avatarUrl = avatar ? `https://cdn.discordapp.com/avatars/${id}/${avatar}.png?size=64` : 'https://cdn.discordapp.com/embed/avatars/0.png';

        const navUsername = document.getElementById('nav-username');
        if (navUsername) navUsername.textContent = displayName;
        
        const navAvatar = document.getElementById('nav-avatar');
        if (navAvatar) navAvatar.src = avatarUrl;

        // Store user data for dashboard
        window._dashUser = { username: displayName, avatar: avatarUrl, id };

        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);

        // Pre-fetch guilds in background
        prefetchGuilds(tokenType, accessToken);
      })
      .catch(console.error);
  }

  // ── Floating Action Button (FAB) ──
  const fabMain = document.getElementById('fabMain');
  const fabMenu = document.getElementById('fabMenu');
  if (fabMain && fabMenu) {
    fabMain.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = fabMenu.classList.contains('open');
      fabMenu.classList.toggle('open', !isOpen);
      fabMain.classList.toggle('open', !isOpen);
      fabMain.setAttribute('aria-expanded', String(!isOpen));
    });
    document.addEventListener('click', (e) => {
      if (!fabMain.contains(e.target) && !fabMenu.contains(e.target)) {
        fabMenu.classList.remove('open');
        fabMain.classList.remove('open');
        fabMain.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ── Mobile Nav: inject lang + login inside hamburger panel ──
  injectMobileNavActions();
});

// ── Prefetch & cache guilds ──
let _guildsCache = null;
function prefetchGuilds(tokenType, accessToken) {
  fetch('https://discord.com/api/users/@me/guilds', {
    headers: { authorization: `${tokenType} ${accessToken}` }
  })
    .then(r => r.json())
    .then(guilds => {
      // Filter: user has Manage Server permission (0x20)
      _guildsCache = Array.isArray(guilds)
        ? guilds.filter(g => (parseInt(g.permissions) & 0x20) !== 0)
        : [];
    })
    .catch(() => { _guildsCache = []; });
}

// ── Dashboard Modal ──
const BOT_CLIENT_ID = '1289557315741159544';
const BOT_INVITE_BASE = `https://discord.com/oauth2/authorize?client_id=${BOT_CLIENT_ID}&scope=bot+applications.commands&permissions=37080128`;

function openDashboard() {
  const modal = document.getElementById('dashboardModal');
  if (!modal) return;
  modal.classList.add('visible');
  document.body.style.overflow = 'hidden';

  // Fill user info in dashboard header
  const u = window._dashUser || {};
  const dashAvatar = document.getElementById('dash-avatar');
  const dashUsername = document.getElementById('dash-username');
  const dashUserid = document.getElementById('dash-userid');
  if (dashAvatar) dashAvatar.src = u.avatar || '';
  if (dashUsername) dashUsername.textContent = u.username || '';
  if (dashUserid) dashUserid.textContent = u.id ? `ID: ${u.id}` : '';

  renderServers();
}

function closeDashboard() {
  const modal = document.getElementById('dashboardModal');
  if (!modal) return;
  modal.classList.remove('visible');
  document.body.style.overflow = '';
}

function renderServers() {
  const list = document.getElementById('dash-servers-list');
  if (!list) return;

  if (_guildsCache === null) {
    list.innerHTML = `<div class="dash-loading"><span class="dash-spinner"></span>Loading servers…</div>`;
    // Poll until ready
    const poll = setInterval(() => {
      if (_guildsCache !== null) {
        clearInterval(poll);
        renderServers();
      }
    }, 400);
    return;
  }

  if (_guildsCache.length === 0) {
    list.innerHTML = `<div class="dash-empty">No servers found where you have Manage Server permission.</div>`;
    return;
  }

  list.innerHTML = _guildsCache.map(g => {
    const iconUrl = g.icon
      ? `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png?size=64`
      : null;
    const iconHtml = iconUrl
      ? `<img class="dash-server-icon" src="${iconUrl}" alt="${g.name}" />`
      : `<div class="dash-server-icon-placeholder">${(g.name[0] || '?').toUpperCase()}</div>`;

    const inviteUrl = `${BOT_INVITE_BASE}&guild_id=${g.id}`;

    return `
      <div class="dash-server-item">
        <div class="dash-server-left">
          ${iconHtml}
          <div>
            <div class="dash-server-name">${escapeHtml(g.name)}</div>
            <div class="dash-server-tag">ID: ${g.id}</div>
          </div>
        </div>
        <a href="${inviteUrl}" target="_blank" rel="noopener" class="dash-invite-btn">➕ Invite Bot</a>
      </div>`;
  }).join('');
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// Dashboard close events
document.addEventListener('DOMContentLoaded', () => {
  const dashClose = document.getElementById('dashClose');
  const dashOverlay = document.getElementById('dashboardModal');
  if (dashClose) dashClose.addEventListener('click', closeDashboard);
  if (dashOverlay) {
    dashOverlay.addEventListener('click', (e) => {
      if (e.target === dashOverlay) closeDashboard();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDashboard();
  });
});

// ── Mobile Nav: inject lang selector + login button into hamburger menu ──
function injectMobileNavActions() {
  const navLinks = document.getElementById('navLinks');
  if (!navLinks) return;

  // Only inject on mobile (screen ≤ 600)
  if (window.innerWidth > 600) return;

  // Avoid double inject
  if (document.getElementById('mobileNavActions')) return;

  const currentLang = document.documentElement.lang || 'en';
  const loginBtnVisible = document.querySelector('.login-discord-btn') &&
    document.querySelector('.login-discord-btn').style.display !== 'none';

  const wrapper = document.createElement('div');
  wrapper.id = 'mobileNavActions';

  wrapper.innerHTML = `
    <div class="mobile-nav-divider"></div>
    <div class="mobile-nav-actions">
      <div class="mobile-lang-row">
        <button class="mobile-lang-btn ${currentLang !== 'ar' ? 'active' : ''}" data-lang="en" id="mobile-lang-en">🇺🇸 English</button>
        <button class="mobile-lang-btn ${currentLang === 'ar' ? 'active' : ''}" data-lang="ar" id="mobile-lang-ar">🇸🇦 العربية</button>
      </div>
      ${loginBtnVisible !== false ? `<a href="#" class="mobile-login-btn login-discord-btn">🔗 Login with Discord</a>` : ''}
    </div>
  `;
  navLinks.appendChild(wrapper);

  // Wire up mobile lang buttons to same logic as desktop
  wrapper.querySelectorAll('.mobile-lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      // Sync with desktop lang selector
      const desktopItem = document.querySelector(`.lang-item[data-lang="${lang}"]`);
      if (desktopItem) desktopItem.click();
      // Update active state on mobile buttons
      wrapper.querySelectorAll('.mobile-lang-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

