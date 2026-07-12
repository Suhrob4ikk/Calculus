// ── Живой отклик на клик: ripple ──────────────────────────
// Глобальный, ненавязчивый эффект волны на любой интерактивный элемент —
// мышь и тач. Чисто визуально, ничего не ломает (capture-фаза, не мешает onclick).
(function () {
  'use strict';
  const SEL = [
    'button', '.android-subject-card', '.android-quick-card', '.android-daily-card',
    '.diff-card', '.diff-btn', '.auth-btn-primary', '.auth-tab', '.test-type-btn',
    '.nav-menu-item', '#bottomNav button', '.dh-nav-btn', '.option-label',
    '[role="button"]', '.duel-tab'
  ].join(',');

  function spawnRipple(el, x, y) {
    if (!el || el.disabled) return;
    const rect = el.getBoundingClientRect();
    if (!rect.width) return;
    const size = Math.max(rect.width, rect.height) * 1.1;
    // Координаты клика внутри элемента; при клавиатуре (нет коорд.) — из центра
    const cx = (x == null ? rect.left + rect.width / 2 : x) - rect.left;
    const cy = (y == null ? rect.top + rect.height / 2 : y) - rect.top;

    // Гарантируем контейнер для абсолютного позиционирования и обрезки
    const cs = getComputedStyle(el);
    if (cs.position === 'static') el.style.position = 'relative';
    if (cs.overflow === 'visible') el.style.overflow = 'hidden';

    const r = document.createElement('span');
    r.className = 'fx-ripple';
    r.style.width = r.style.height = size + 'px';
    r.style.left = (cx - size / 2) + 'px';
    r.style.top = (cy - size / 2) + 'px';
    el.appendChild(r);
    r.addEventListener('animationend', () => r.remove());
    setTimeout(() => r.remove(), 800); // подстраховка
  }

  document.addEventListener('click', (e) => {
    const el = e.target.closest(SEL);
    if (el) spawnRipple(el, e.clientX || null, e.clientY || null);
  }, true);
})();

// ── Плавающие светящиеся орбы (живой фон) ────────────────
(function () {
  'use strict';
  function init() {
    if (document.querySelector('.fx-orbs')) return;
    const wrap = document.createElement('div');
    wrap.className = 'fx-orbs';
    wrap.setAttribute('aria-hidden', 'true');
    const orbs = [
      { x: '12%', y: '20%', s: 360, d: 0 },
      { x: '84%', y: '14%', s: 300, d: -7 },
      { x: '72%', y: '82%', s: 400, d: -13 },
      { x: '22%', y: '76%', s: 260, d: -4 },
      { x: '50%', y: '44%', s: 300, d: -10 },
    ];
    orbs.forEach((o, i) => {
      const el = document.createElement('span');
      el.className = 'fx-orb fx-orb-' + (i + 1);
      el.style.left = o.x; el.style.top = o.y;
      el.style.width = el.style.height = o.s + 'px';
      el.style.animationDelay = o.d + 's';
      wrap.appendChild(el);
    });
    document.body.appendChild(wrap);
  }
  if (document.body) init();
  else document.addEventListener('DOMContentLoaded', init);
})();
