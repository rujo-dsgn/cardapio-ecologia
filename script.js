'use strict';

/* ============================================================
   ECOLOGIA CAFÉ ORGÂNICO — script.js
   Intersection Observer · Nav ativa · Smooth scroll
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  const nav     = document.getElementById('category-nav');
  const header  = document.querySelector('.site-header');
  const sections = document.querySelectorAll('.menu-section[id], #como-chegar');
  const navLinks = document.querySelectorAll('.nav-link');

  // ──────────────────────────────────────────
  // 1. ANIMAÇÕES DE ENTRADA (Intersection Observer)
  // ──────────────────────────────────────────
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    // Stagger delay para cards dentro de cada grid
    document.querySelectorAll('.items-grid').forEach(grid => {
      Array.from(grid.querySelectorAll('[data-animate]')).forEach((item, i) => {
        item.style.setProperty('--delay', `${i * 75}ms`);
      });
    });

    const animateObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          animateObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -32px 0px'
    });

    document.querySelectorAll('[data-animate]').forEach(el => animateObserver.observe(el));

  } else {
    // Acessibilidade: mostra tudo imediatamente sem animação
    document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('is-visible'));
  }

  // ──────────────────────────────────────────
  // 2. SOMBRA DO NAV ao sair do header
  // ──────────────────────────────────────────
  if (header && nav) {
    const headerScrollObserver = new IntersectionObserver((entries) => {
      nav.classList.toggle('category-nav--scrolled', !entries[0].isIntersecting);
    }, { threshold: 0 });

    headerScrollObserver.observe(header);
  }

  // ──────────────────────────────────────────
  // 3. LINK ATIVO NA NAVEGAÇÃO por seção visível
  // ──────────────────────────────────────────
  if (sections.length && navLinks.length) {
    const activateLink = (id) => {
      navLinks.forEach(link => {
        const isActive = link.dataset.section === id;
        link.classList.toggle('nav-link--active', isActive);

        // Centraliza o link ativo no scroll horizontal do nav (mobile)
        if (isActive) {
          link.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      });
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          activateLink(entry.target.id);
        }
      });
    }, {
      rootMargin: '-20% 0px -65% 0px',
      threshold: 0
    });

    sections.forEach(section => sectionObserver.observe(section));

    // Ativa o primeiro link por padrão
    if (navLinks[0]) navLinks[0].classList.add('nav-link--active');
  }

  // ──────────────────────────────────────────
  // 4. VOLTAR AO TOPO — aparece após a primeira dobra
  // ──────────────────────────────────────────
  const backToTop = document.getElementById('back-to-top');

  if (backToTop) {
    let shown = false;
    let hideTimer;

    const update = () => {
      const shouldShow = window.scrollY > window.innerHeight;
      if (shouldShow === shown) return;
      shown = shouldShow;
      clearTimeout(hideTimer);

      if (shown) {
        backToTop.hidden = false;
        requestAnimationFrame(() => backToTop.classList.add('is-shown'));
      } else {
        backToTop.classList.remove('is-shown');
        // Espera o fade terminar antes de tirar da árvore de acessibilidade
        hideTimer = setTimeout(() => { backToTop.hidden = true; }, 250);
      }
    };

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      document.querySelector('.site-header__logo-link')?.focus({ preventScroll: true });
    });
  }

  // ──────────────────────────────────────────
  // 5. SMOOTH SCROLL com offset do nav fixo
  // ──────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const navHeight = nav ? nav.offsetHeight : 0;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 8;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });

});
