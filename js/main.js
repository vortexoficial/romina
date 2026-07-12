/* ═══════════════════════════════════════════════════════════════
   TEMPLO DA MULHER REAL · Método Voltar a Ti
   Interações — Futura Design
   ═══════════════════════════════════════════════════════════════ */

/* ── CONFIGURAÇÃO (editar aqui, num único sítio) ──────────────
   ✦ SUBSTITUIR: número real da Romina com indicativo do país,
     apenas dígitos (França = 33). Ex.: '33612345678'          */
const CONFIG = {
  whatsapp: '33600000000',
  defaultMsg: 'Olá Romina! 🌸 Vi o site Templo da Mulher Real e gostava de saber mais sobre as mentorias.',
  /* ✦ SUBSTITUIR: link do perfil Google (Google Meu Negócio),
     quando for criado no pacote SEO. Vazio = botão inativo.   */
  googleReviews: ''
};

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Links WhatsApp (todos os [data-wa]) ─────────────────────── */
document.querySelectorAll('[data-wa]').forEach(a => {
  const msg = a.dataset.msg || CONFIG.defaultMsg;
  a.href = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
  a.target = '_blank';
  a.rel = 'noopener';
});

/* ── Links avaliações Google ([data-greview]) ────────────────── */
document.querySelectorAll('[data-greview]').forEach(a => {
  if (CONFIG.googleReviews) {
    a.href = CONFIG.googleReviews;
    a.target = '_blank';
    a.rel = 'noopener';
  } else {
    a.addEventListener('click', e => e.preventDefault());
    a.style.opacity = '.55';
    a.title = 'Brevemente disponível';
  }
});

/* ── Preloader ────────────────────────────────────────────────── */
const ready = () => document.body.classList.add('loaded');
window.addEventListener('load', ready);
setTimeout(ready, 2600); // segurança

/* ── Header + barra de progresso ─────────────────────────────── */
const header = document.querySelector('.site-header');
const progress = document.querySelector('.progress');
let ticking = false;

function onScroll() {
  const y = window.scrollY;
  header.classList.toggle('scrolled', y > 40);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
  ticking = false;
}
window.addEventListener('scroll', () => {
  if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
}, { passive: true });
onScroll();

/* ── Menu mobile ─────────────────────────────────────────────── */
const burger = document.querySelector('.burger');
const mobileMenu = document.getElementById('mobile-menu');
const menuLinks = () => [...mobileMenu.querySelectorAll('a')];

function toggleMenu(force) {
  const wasOpen = document.body.classList.contains('menu-open');
  const open = force !== undefined ? force : !wasOpen;
  document.body.classList.toggle('menu-open', open);
  burger.setAttribute('aria-expanded', open);
  burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  mobileMenu.setAttribute('aria-hidden', !open);
  if (!open && wasOpen) burger.focus({ preventScroll: true });
}
burger.addEventListener('click', () => toggleMenu());
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));
mobileMenu.addEventListener('click', e => { if (e.target === mobileMenu) toggleMenu(false); });

/* Esc fecha; Tab fica preso dentro do menu (burger + links) enquanto aberto */
window.addEventListener('keydown', e => {
  if (e.key === 'Escape') { toggleMenu(false); return; }
  if (e.key !== 'Tab' || !document.body.classList.contains('menu-open')) return;
  const items = [burger, ...menuLinks()];
  const first = items[0], last = items[items.length - 1];
  if (!items.includes(document.activeElement)) { e.preventDefault(); first.focus(); }
  else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});

/* ── Reveal on scroll ────────────────────────────────────────── */
const revealEls = document.querySelectorAll('[data-reveal]');
if (!prefersReduced && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.style.transitionDelay = `${el.dataset.delay || 0}ms`;
        el.classList.add('in-view');
        io.unobserve(el);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('in-view'));
}

/* ── Link ativo na navegação ─────────────────────────────────── */
const navLinks = document.querySelectorAll('.nav a');
const sections = [...navLinks].map(a => document.querySelector(a.hash)).filter(Boolean);
if ('IntersectionObserver' in window && sections.length) {
  const navIO = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => a.classList.toggle('active', a.hash === `#${entry.target.id}`));
      }
    });
  }, { rootMargin: '-42% 0px -52% 0px' });
  sections.forEach(s => navIO.observe(s));
}

/* ── Slider de depoimentos ───────────────────────────────────── */
const track = document.querySelector('.t-track');
if (track) {
  const cards = [...track.children];
  const dotsBox = document.querySelector('.t-dots');
  const prev = document.querySelector('.t-prev');
  const next = document.querySelector('.t-next');
  let idx = 0;
  let timer = null;

  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Ir para o depoimento ${i + 1}`);
    dot.addEventListener('click', () => go(i));
    dotsBox.appendChild(dot);
  });
  const dots = [...dotsBox.children];

  const step = () => cards[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap || 0);

  function paint() {
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === idx);
      if (i === idx) d.setAttribute('aria-current', 'true');
      else d.removeAttribute('aria-current');
    });
  }
  function go(i) {
    idx = Math.max(0, Math.min(i, cards.length - 1));
    track.scrollTo({ left: idx * step(), behavior: prefersReduced ? 'auto' : 'smooth' });
    paint();
  }
  prev.addEventListener('click', () => go(idx - 1));
  next.addEventListener('click', () => go(idx >= cards.length - 1 ? 0 : idx + 1));

  let scrollRaf = null;
  track.addEventListener('scroll', () => {
    if (scrollRaf) return;
    scrollRaf = requestAnimationFrame(() => {
      idx = Math.max(0, Math.min(Math.round(track.scrollLeft / step()), cards.length - 1));
      paint();
      scrollRaf = null;
    });
  }, { passive: true });

  function play() {
    if (prefersReduced || timer) return;
    timer = setInterval(() => next.click(), 6500);
  }
  function pause() { clearInterval(timer); timer = null; }

  const zone = document.querySelector('.t-slider');
  ['pointerenter', 'touchstart', 'focusin'].forEach(ev => zone.addEventListener(ev, pause, { passive: true }));
  ['pointerleave', 'focusout'].forEach(ev => zone.addEventListener(ev, play));
  play();
  paint();
}

/* ── Parallax suave nos brilhos do hero (desktop) ────────────── */
if (!prefersReduced && window.matchMedia('(pointer: fine)').matches) {
  const g1 = document.querySelector('.g1');
  const g2 = document.querySelector('.g2');
  const hero = document.querySelector('.hero');
  if (hero && g1 && g2) {
    hero.addEventListener('pointermove', e => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      g1.style.transform = `translate(${x * -16}px, ${y * -10}px)`;
      g2.style.transform = `translate(${x * 12}px, ${y * 8}px)`;
    });
  }
}

/* ── Ano automático no rodapé ────────────────────────────────── */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
