
(function () {
  'use strict';

  const SCROLL_THRESHOLD = 50;

  const header = document.getElementById('header');
  const burgerBtn = document.getElementById('burger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('[data-nav-link]');
  const sections = document.querySelectorAll('section[id]');

  function updateHeaderState() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      header.classList.remove('header--top');
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
      header.classList.add('header--top');
    }
  }
  function openMenu() {
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    burgerBtn.classList.add('active');
    burgerBtn.setAttribute('aria-expanded', 'true');
    burgerBtn.setAttribute('aria-label', 'Fermer le menu');
    document.body.classList.add('menu-open');
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    burgerBtn.classList.remove('active');
    burgerBtn.setAttribute('aria-expanded', 'false');
    burgerBtn.setAttribute('aria-label', 'Ouvrir le menu');
    document.body.classList.remove('menu-open');
  }

  function toggleMenu() {
    const isOpen = mobileMenu.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  }

  function scrollToSection(e) {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute('href');
    const target = document.querySelector(targetId);
    if (!target) return;

    const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height'), 10) || 72;

    window.scrollTo({
      top: target.offsetTop - offset,
      behavior: 'smooth'
    });

    closeMenu();
  }

  function setupActiveLinks() {
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach((link) => {
              link.classList.toggle('active', link.getAttribute('href') === '#' + id);
            });
          }
        });
      },
      {
        rootMargin: '-40% 0px -55% 0px',
        threshold: 0
      }
    );

    sections.forEach((section) => observer.observe(section));
  }

  function handleKeydown(e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMenu();
      burgerBtn.focus();
    }
  }

  function init() {
    updateHeaderState();

    window.addEventListener('scroll', updateHeaderState, { passive: true });

    burgerBtn.addEventListener('click', toggleMenu);

    navLinks.forEach((link) => {
      link.addEventListener('click', scrollToSection);
    });

    document.addEventListener('keydown', handleKeydown);

    setupActiveLinks();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
