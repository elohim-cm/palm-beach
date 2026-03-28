/* ============================================
   APP — Reveals, counter animation, init
   ============================================ */

(function () {
  'use strict';

  var revealObserver;
  var counterObserver;

  /* ================================================
     SCROLL REVEAL — IntersectionObserver
     Supports: data-reveal, data-reveal="left|right|scale|none"
     Stagger:  data-reveal-delay="1..8"
     ================================================ */

  function setupRevealAnimations() {
    revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    observeAll();
  }

  function observeAll() {
    var reveals = document.querySelectorAll('[data-reveal]:not(.revealed)');
    reveals.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* Expose for dynamic content (events, menu, etc.) */
  window.reinitReveal = function () {
    if (revealObserver) observeAll();
  };

  /* ================================================
     ANIMATED COUNTERS — Features accent numbers
     Triggers once when the element enters viewport.
     Works with: data-count="40" data-count-prefix="+"
     ================================================ */

  function setupCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(function (el) {
      counterObserver.observe(el);
    });
  }

  function animateCounter(el) {
    var target = parseInt(el.dataset.count, 10);
    var prefix = el.dataset.countPrefix || '';
    var suffix = el.dataset.countSuffix || '';
    var duration = 1200; // ms
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease-out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.round(eased * target);
      el.textContent = prefix + current + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  /* ================================================
     SMOOTH ANCHOR OFFSET
     Handles anchor clicks not managed by navigation.js
     (e.g., footer nav links, CTA links)
     ================================================ */

  function setupSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]:not([data-nav-link])').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = link.getAttribute('href');
        if (href === '#' || href === '#reservation') return; // reservation is external
        var target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        var offset = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue('--header-height'), 10
        ) || 72;
        window.scrollTo({
          top: target.offsetTop - offset,
          behavior: 'smooth'
        });
      });
    });
  }

  /* ================================================
     INIT
     ================================================ */

  function init() {
    setupRevealAnimations();
    setupCounters();
    setupSmoothAnchors();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
