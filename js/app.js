
(function () {
  'use strict';

  var revealObserver;
  var counterObserver;

 
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

  window.reinitReveal = function () {
    if (revealObserver) observeAll();
  };


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
    var duration = 1200;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.round(eased * target);
      el.textContent = prefix + current + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }


  function setupSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]:not([data-nav-link])').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = link.getAttribute('href');
        if (href === '#' || href === '#reservation') return;
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

  function setupFormSubmit() {
    var form = document.getElementById('privatisation-form');
    if (!form) return;

    var toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      })
        .then(function (res) {
          if (res.ok) {
            showToast(toast, 'Demande envoyée avec succès');
            form.reset();
          } else {
            showToast(toast, 'Une erreur est survenue, réessayez.');
          }
          btn.disabled = false;
        })
        .catch(function () {
          showToast(toast, 'Une erreur est survenue, réessayez.');
          btn.disabled = false;
        });
    });
  }

  function showToast(toast, message) {
    toast.textContent = message;
    toast.classList.add('toast--visible');
    setTimeout(function () {
      toast.classList.remove('toast--visible');
    }, 3500);
  }
  function init() {
    setupRevealAnimations();
    setupCounters();
    setupSmoothAnchors();
    setupFormSubmit();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
