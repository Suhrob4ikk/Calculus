/* ═══════════════════════════════════════════════════════
   БРАУЗЕР ТЕОРИИ ДЛЯ РАЗДЕЛОВ МАТАНАЛИЗА
   Использует CALC_CHAPTERS[key] из calculus-chapters.js
═══════════════════════════════════════════════════════ */

let _calcCurSection  = null;
let _calcCurChapter  = 0;

const SECTION_BACK = {
  integrals:   'integralsSection',
  derivatives: 'derivativesSection',
  series:      'seriesSection',
  limits:      'limitsSection',
  ode:         'odeSection',
};

const CALC_TAG_MAP = {
  'tag-blue':   'prob-tag-blue',
  'tag-green':  'prob-tag-green',
  'tag-violet': 'prob-tag-violet',
  'tag-amber':  'prob-tag-amber',
  'tag-red':    'prob-tag-red',
  'tag-cyan':   'prob-tag-cyan',
  'tag-rose':   'prob-tag-rose',
};

/* ── Строим боковую панель и чипсы ── */
function buildCalcNav(chapters) {
  const sb  = document.getElementById('calcSidebar');
  const mob = document.getElementById('calcMobNav');
  if (!sb || !mob) return;

  sb.innerHTML  = '<div class="prob-sidebar-group">Главы</div>';
  mob.innerHTML = '';

  chapters.forEach((ch, i) => {
    const btn = document.createElement('button');
    btn.className = 'prob-ch-btn' + (i === 0 ? ' active' : '');
    btn.innerHTML = `<span class="prob-ch-num">${ch.num}</span>${ch.title}`;
    btn.onclick   = () => showCalcChapter(i);
    sb.appendChild(btn);

    const chip = document.createElement('button');
    chip.className  = 'prob-mob-chip' + (i === 0 ? ' active' : '');
    chip.textContent = `${ch.num}. ${ch.title}`;
    chip.onclick    = () => showCalcChapter(i);
    mob.appendChild(chip);
  });
}

/* ── Строим контент глав ── */
function buildCalcChapters(chapters) {
  const area = document.getElementById('calcChapterContent');
  if (!area) return;

  const backBtn = area.querySelector('.prob-back-btn');
  area.innerHTML = '';
  if (backBtn) area.appendChild(backBtn);

  chapters.forEach((ch, i) => {
    const div = document.createElement('div');
    div.className = 'prob-chapter' + (i === 0 ? ' active' : '');
    div.id = 'calc-ch-' + ch.id;

    const tagCls = CALC_TAG_MAP[ch.tagCls] || 'prob-tag-blue';

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
function showCalcChapter(i) {
  _calcCurChapter = i;

  const chapters = (window.CALC_CHAPTERS && _calcCurSection)
    ? window.CALC_CHAPTERS[_calcCurSection] : [];

  document.querySelectorAll('#sectionTheoryPage .prob-chapter').forEach((el, j) =>
    el.classList.toggle('active', j === i));

  document.querySelectorAll('#calcSidebar .prob-ch-btn').forEach((el, j) =>
    el.classList.toggle('active', j === i));

  const chips = document.querySelectorAll('#calcMobNav .prob-mob-chip');
  chips.forEach((el, j) => el.classList.toggle('active', j === i));
  if (chips[i]) chips[i].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

  window.scrollTo(0, 0);

  // MathJax
  if (chapters[i]) {
    const chEl = document.getElementById('calc-ch-' + chapters[i].id);
    if (chEl && window.MathJax && MathJax.typesetPromise) {
      MathJax.typesetPromise([chEl]).catch(() => {});
    }
  }
}

/* ── Открыть браузер теории раздела ── */
window.showSectionTheory = function(key, startChapter) {
  if (!window.CALC_CHAPTERS || !window.CALC_CHAPTERS[key]) {
    console.warn('CALC_CHAPTERS not found for key:', key);
    return;
  }

  const chapters = window.CALC_CHAPTERS[key];
  const sectionChanged = _calcCurSection !== key;
  _calcCurSection = key;

  const area = document.getElementById('calcChapterContent');
  if (!area) return;

  // Перестраиваем при смене раздела
  if (sectionChanged || area.querySelectorAll('.prob-chapter').length === 0) {
    buildCalcNav(chapters);
    buildCalcChapters(chapters);
    _calcCurChapter = 0;
  }

  if (window.showPage) showPage('sectionTheoryPage');

  const idx = (typeof startChapter === 'number') ? startChapter : 0;
  showCalcChapter(idx);

  window.scrollTo(0, 0);
};

/* ── Вернуться к разделу ── */
window.backFromSectionTheory = function() {
  const backTo = _calcCurSection ? (SECTION_BACK[_calcCurSection] || 'homePage') : 'homePage';
  if (window.showPage) showPage(backTo);
};
