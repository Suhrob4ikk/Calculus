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
