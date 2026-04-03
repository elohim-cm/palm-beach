
(function () {
  'use strict';

  const lightbox    = document.getElementById('lightbox');
  const lbImg       = document.getElementById('lightbox-img');
  const lbCaption   = document.getElementById('lightbox-caption');
  const lbCounter   = document.getElementById('lightbox-counter');
  const btnClose    = document.getElementById('lightbox-close');
  const btnPrev     = document.getElementById('lightbox-prev');
  const btnNext     = document.getElementById('lightbox-next');
  const galleryItems = document.querySelectorAll('.gallery__item[data-gallery]');

  if (!lightbox || !galleryItems.length) return;

  let currentIndex = 0;
  let touchStartX  = 0;

  function open(index) {
    currentIndex = index;
    update();
    lightbox.classList.add('open');
    document.body.classList.add('menu-open'); 
    btnClose.focus();
  }

  function close() {
    lightbox.classList.remove('open');
    document.body.classList.remove('menu-open');
    galleryItems[currentIndex].focus();
  }
  function prev() {
    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    update();
  }

  function next() {
    currentIndex = (currentIndex + 1) % galleryItems.length;
    update();
  }

  function update() {
    const item = galleryItems[currentIndex];
    const img  = item.querySelector('img');
    const src  = item.dataset.full || img.src;
    const alt  = img.alt || '';
    const caption = item.dataset.caption || '';

    lbImg.src = src;
    lbImg.alt = alt;
    lbCaption.textContent = caption;
    lbCounter.textContent = `${currentIndex + 1} / ${galleryItems.length}`;
  }

  galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => open(i));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open(i);
      }
    });
  });

  btnClose.addEventListener('click', close);
  btnPrev.addEventListener('click', prev);
  btnNext.addEventListener('click', next);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')                    close();
    if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   prev();
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown')  next();
  });

  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? prev() : next();
    }
  }, { passive: true });

})();
