/* ═══════════════════════════════════════════════════════
   ТЕОРИЯ ВЕРОЯТНОСТЕЙ — БРАУЗЕР ГЛАВ
   Использует глобальный массив CHAPTERS из prob-chapters.js
═══════════════════════════════════════════════════════ */

// Индекс текущей главы
let _probCurChapter = 0;

// Карта CSS-классов тегов (Probability → Calculus)
const TAG_MAP = {
  'tag-blue':   'prob-tag-blue',
  'tag-green':  'prob-tag-green',
  'tag-violet': 'prob-tag-violet',
  'tag-amber':  'prob-tag-amber',
  'tag-red':    'prob-tag-red',
  'tag-cyan':   'prob-tag-cyan',
  'tag-rose':   'prob-tag-rose',
};

/* ── Строим сайдбар и чипсы ── */
function buildProbNav() {
  const sb  = document.getElementById('probSidebar');
  const mob = document.getElementById('probMobNav');
  if (!sb || !mob) return;

  sb.innerHTML  = '<div class="prob-sidebar-group">Главы</div>';
  mob.innerHTML = '';

  CHAPTERS.forEach((ch, i) => {
    // Desktop sidebar button
    const btn = document.createElement('button');
    btn.className = 'prob-ch-btn' + (i === 0 ? ' active' : '');
    btn.innerHTML =
      `<span class="prob-ch-num">${ch.num}</span>${ch.title}`;
    btn.onclick = () => showProbChapter(i);
    sb.appendChild(btn);

    // Mobile chip
    const chip = document.createElement('button');
    chip.className = 'prob-mob-chip' + (i === 0 ? ' active' : '');
    chip.textContent = `${ch.num}. ${ch.title}`;
    chip.onclick = () => showProbChapter(i);
    mob.appendChild(chip);
  });
}

/* ── Строим контент всех глав ── */
function buildProbChapters() {
  const area = document.getElementById('probChapterContent');
  if (!area) return;

  // Сохраняем кнопку «Назад»
  const backBtn = area.querySelector('.prob-back-btn');

  area.innerHTML = '';
  if (backBtn) area.appendChild(backBtn);

  CHAPTERS.forEach((ch, i) => {
    const div = document.createElement('div');
    div.className = 'prob-chapter' + (i === 0 ? ' active' : '');
    div.id = 'prob-ch-' + ch.id;

    const tagCls = TAG_MAP[ch.tagCls] || 'prob-tag-blue';

    div.innerHTML = `
      <div class="prob-ch-header">
        <span class="prob-ch-tag ${tagCls}">${ch.tag}</span>
        <h1 class="prob-ch-title">${ch.num}. ${ch.title}</h1>
        <p class="prob-ch-intro">${ch.intro}</p>
      </div>
      ${ch.html}
    `;
    area.appendChild(div);
  });
}

/* ── Переключить главу ── */
function showProbChapter(i) {
  _probCurChapter = i;

  // Главы (только внутри probabilityTheoryPage)
  document.querySelectorAll('#probabilityTheoryPage .prob-chapter').forEach((el, j) =>
    el.classList.toggle('active', j === i));

  // Кнопки sidebar
  document.querySelectorAll('#probSidebar .prob-ch-btn').forEach((el, j) =>
    el.classList.toggle('active', j === i));

  // Чипсы
  const chips = document.querySelectorAll('#probMobNav .prob-mob-chip');
  chips.forEach((el, j) => el.classList.toggle('active', j === i));

  // Прокручиваем активный чип в видимую зону
  if (chips[i]) {
    chips[i].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }

  // Скролл страницы наверх
  window.scrollTo(0, 0);

  // MathJax
  const chEl = document.getElementById('prob-ch-' + CHAPTERS[i].id);
  if (chEl && window.MathJax && MathJax.typesetPromise) {
    MathJax.typesetPromise([chEl]).catch(() => {});
  }
}

/* ── Открыть браузер теории ── */
window.showProbabilityTheory = function(startChapter) {
  // Ленивая инициализация — строим только один раз
  const area = document.getElementById('probChapterContent');
  if (area && area.querySelectorAll('.prob-chapter').length === 0) {
    buildProbNav();
    buildProbChapters();
  }

  // Показываем страницу через showPage Calculus
  if (window.showPage) {
    showPage('probabilityTheoryPage');
  } else {
    // Fallback
    document.querySelectorAll('.page-content').forEach(el => {
      el.style.display = 'none';
      el.classList.add('hidden');
    });
    const page = document.getElementById('probabilityTheoryPage');
    if (page) { page.style.display = 'block'; page.classList.remove('hidden'); }
  }

  // Переходим к нужной главе
  const idx = (typeof startChapter === 'number') ? startChapter : _probCurChapter;
  showProbChapter(idx);

  window.scrollTo(0, 0);
};

/* ── Вернуться к разделу вероятностей ── */
window.backFromProbTheory = function() {
  if (window.showPage) {
    showPage('probabilitySection');
  }
};

/* ── Typeset при первой загрузке если MathJax готов ── */
window.addEventListener('load', () => {
  // Ничего не делаем пока — typeset происходит при открытии главы
});
