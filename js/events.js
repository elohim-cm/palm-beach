/* ============================================
   EVENTS — Dynamic rendering from JSON
   ============================================ */

(function () {
  'use strict';

  const EVENTS_URL = 'data/events.json';
  const container  = document.getElementById('events-list');

  if (!container) return;

  const DAYS_SHORT  = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const MONTHS_SHORT = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aout', 'Sep', 'Oct', 'Nov', 'Dec'];

  /* ---- Helpers ---- */

  function isThisWeek(dateStr) {
    const now = new Date();
    const eventDate = new Date(dateStr + 'T00:00:00');
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1)); // Monday
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    return eventDate >= startOfWeek && eventDate <= endOfWeek;
  }

  function isPast(dateStr) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return new Date(dateStr + 'T00:00:00') < now;
  }

  function getBadge(event) {
    if (event.recurrent) {
      return { label: 'Chaque semaine', cls: 'recurrent' };
    }
    if (isPast(event.date)) {
      return { label: 'Termine', cls: 'past' };
    }
    if (isThisWeek(event.date)) {
      return { label: 'Cette semaine', cls: 'thisweek' };
    }
    return { label: 'A venir', cls: 'upcoming' };
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    return {
      day: DAYS_SHORT[d.getDay()],
      num: d.getDate(),
      month: MONTHS_SHORT[d.getMonth()]
    };
  }

  /* ---- Render ---- */

  function renderCard(event) {
    const badge = getBadge(event);

    let dateChip = '';
    if (event.recurrent) {
      dateChip = `
        <div class="events__card-date events__card-date--recurrent">
          <span class="events__card-date-num">${event.recurrentLabel || 'Regulier'}</span>
        </div>`;
    } else {
      const d = formatDate(event.date);
      dateChip = `
        <div class="events__card-date">
          <span class="events__card-date-day">${d.day}</span>
          <span class="events__card-date-num">${d.num}</span>
          <span class="events__card-date-month">${d.month}</span>
        </div>`;
    }

    const ctaHtml = event.cta
      ? `<div class="events__card-cta">
          <a href="${event.cta.url}" class="btn btn-primary">${event.cta.label}</a>
        </div>`
      : '';

    const pastClass = (!event.recurrent && isPast(event.date)) ? ' events__card--past' : '';

    return `
      <article class="events__card${pastClass}" data-reveal>
        <div class="events__card-visual">
          <img
            class="events__card-img"
            src="${event.image}"
            alt="${event.title}"
            loading="lazy"
          >
          <span class="events__card-badge events__card-badge--${badge.cls}">${badge.label}</span>
          ${dateChip}
        </div>
        <div class="events__card-body">
          <span class="events__card-time">${event.time}</span>
          <h3 class="events__card-title">${event.title}</h3>
          <p class="events__card-desc">${event.description}</p>
          ${ctaHtml}
        </div>
      </article>`;
  }

  async function init() {
    try {
      const res = await fetch(EVENTS_URL);
      if (!res.ok) throw new Error('Failed to load events');
      let events = await res.json();

      // Sort: upcoming first, then recurrents, past events last
      events.sort((a, b) => {
        const aPast = !a.recurrent && isPast(a.date);
        const bPast = !b.recurrent && isPast(b.date);
        if (aPast && !bPast) return 1;
        if (!aPast && bPast) return -1;
        if (a.recurrent && !b.recurrent) return 1;
        if (!a.recurrent && b.recurrent) return -1;
        if (a.recurrent && b.recurrent) return 0;
        return new Date(a.date) - new Date(b.date);
      });

      container.innerHTML = events.map(renderCard).join('');

      // Re-init reveal for dynamically added cards
      if (window.reinitReveal) window.reinitReveal();

    } catch (err) {
      container.innerHTML =
        '<p style="text-align:center;color:var(--color-anthracite-soft);grid-column:1/-1;">La programmation est momentanement indisponible.</p>';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
