
(function () {
  'use strict';

  const MENU_DATA_URL = 'data/menu.json';

  const tabsContainer = document.getElementById('menu-tabs');
  const panelsContainer = document.getElementById('menu-panels');

  if (!tabsContainer || !panelsContainer) return;

  async function init() {
    try {
      const res = await fetch(MENU_DATA_URL);
      if (!res.ok) throw new Error('Failed to load menu');
      const data = await res.json();
      render(data.categories);
    } catch (err) {
      panelsContainer.innerHTML =
        '<p style="text-align:center;color:var(--color-anthracite-soft);">La carte est momentanement indisponible.</p>';
    }
  }

  function render(categories) {
    tabsContainer.innerHTML = categories
      .map((cat, i) =>
        `<button
          class="menu__tab${i === 0 ? ' active' : ''}"
          type="button"
          role="tab"
          aria-selected="${i === 0}"
          aria-controls="menu-panel-${cat.id}"
          data-tab="${cat.id}"
        >${cat.name}</button>`
      )
      .join('');

    panelsContainer.innerHTML = categories
      .map((cat, i) =>
        `<div
          class="menu__panel${i === 0 ? ' active' : ''}"
          id="menu-panel-${cat.id}"
          role="tabpanel"
        >
          <div class="menu__items">
            ${cat.description ? `<p class="menu__category-note">${cat.description}</p>` : ''}
            ${cat.items.map((item) => renderItem(item)).join('')}
          </div>
        </div>`
      )
      .join('');

    tabsContainer.querySelectorAll('.menu__tab').forEach((tab) => {
      tab.addEventListener('click', () => switchTab(tab));
    });
  }

  function renderItem(item) {
    const badge = item.signature
      ? `<span class="menu__item-badge">
          <svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 0l1.76 3.57 3.94.57-2.85 2.78.67 3.93L6 8.88 2.48 10.85l.67-3.93L.3 4.14l3.94-.57z"/>
          </svg>
          Signature
        </span>`
      : '';

    const unit = item.unit
      ? `<span class="menu__item-unit">/ ${item.unit}</span>`
      : '';

    return `
      <div class="menu__item">
        <div class="menu__item-row">
          <span class="menu__item-name">${item.name}${badge}</span>
          <span class="menu__item-dots" aria-hidden="true"></span>
          <span class="menu__item-price">${item.price} FCFA${unit}</span>
        </div>
        <p class="menu__item-desc">${item.description}</p>
      </div>`;
  }

  function switchTab(activeTab) {
    const tabId = activeTab.dataset.tab;

    tabsContainer.querySelectorAll('.menu__tab').forEach((tab) => {
      const isActive = tab === activeTab;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', isActive);
    });

    panelsContainer.querySelectorAll('.menu__panel').forEach((panel) => {
      const isActive = panel.id === `menu-panel-${tabId}`;
      panel.classList.toggle('active', isActive);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
