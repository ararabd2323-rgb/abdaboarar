/* ===== إعداداتك (عدّل هون) ===== */
const CONFIG = {
  channelUrl: '',   // رابط قناتك، مثال: https://www.youtube.com/@اسم_قناتك
  email: '',        // إيميلك لاستقبال الرسائل
  subsNow: 0,       // عدد المشتركين الحالي
  subsGoal: 1000    // الهدف
};

// id = الجزء اللي بعد v= برابط الفيديو. مثال: youtube.com/watch?v=AbC123xyz  ->  id: 'AbC123xyz'
const VIDEOS = [
  { id: '', title: 'شرح HTML من الصفر وبناء أول موقع', dur: '35 دقيقة', tag: 'full',
    desc: 'شرح كامل من البداية: الوسوم الأساسية وبناء صفحة موقع كاملة.' },
  { id: '', title: 'أساسيات HTML بسرعة', dur: '3 دقائق ونص', tag: 'quick',
    desc: 'ملخص سريع لأهم أساسيات HTML.' }
];

const TAGS = { all: 'الكل', full: 'شرح كامل', quick: 'سريع' };

const PATH = [
  { t: 'HTML', d: 'هيكل الصفحة والوسوم الأساسية', ok: true },
  { t: 'CSS', d: 'الألوان والتنسيق والتصميم', ok: false },
  { t: 'JavaScript', d: 'التفاعل والحركة', ok: false },
  { t: 'انشر موقعك', d: 'ارفعه على الإنترنت مجاناً', ok: false }
];

const QUIZ = [
  { q: 'أي وسم بنستخدمه للعنوان الرئيسي بالصفحة؟', o: ['<h1>', '<p>', '<a>'], a: 0 },
  { q: 'أي وسم بيعمل رابط؟', o: ['<img>', '<a>', '<div>'], a: 1 },
  { q: 'شو هي HTML؟', o: ['لغة ترميز بتبني هيكل صفحات الويب', 'لغة لإدارة قواعد البيانات', 'برنامج لتعديل الصور'], a: 0 }
];

const STARTER = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<style>
  body{font-family:sans-serif;text-align:center;padding:30px;background:#fff7f0}
  h1{color:#ff6a2b}
  button{padding:10px 22px;border:0;border-radius:10px;background:#ff6a2b;color:#fff;font-size:1rem;cursor:pointer}
</style>
</head>
<body>
  <h1>أهلاً يا عالم!</h1>
  <p>هذا أول موقع إلي بـ HTML</p>
  <button onclick="alert('برافو!')">اضغط هنا</button>
</body>
</html>`;

/* ===== أدوات ===== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

function toast(msg) {
  const el = $('#toast'); el.textContent = msg; el.classList.add('show');
  clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove('show'), 2600);
}

/* ===== الوضع الفاتح والداكن ===== */
function setTheme(mode) {
  document.documentElement.dataset.theme = mode;
  $('#theme').textContent = mode === 'light' ? '☀️' : '🌙';
  try { localStorage.setItem('abd-theme', mode); } catch (e) {}
}
let saved = 'dark';
try { saved = localStorage.getItem('abd-theme') || 'dark'; } catch (e) {}
setTheme(saved);
$('#theme').addEventListener('click', () =>
  setTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light'));

/* ===== القائمة ===== */
$('#burger').addEventListener('click', () => $('#nav').classList.toggle('open'));
$$('#nav a').forEach(a => a.addEventListener('click', () => $('#nav').classList.remove('open')));

const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      $$('#nav a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + en.target.id));
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
$$('main section[id]').forEach(s => io.observe(s));

/* ===== روابط القناة ===== */
const channelLink = CONFIG.channelUrl
  ? CONFIG.channelUrl + (CONFIG.channelUrl.includes('?') ? '&' : '?') + 'sub_confirmation=1' : '';
$$('[data-channel]').forEach(a => {
  if (channelLink) { a.href = channelLink; a.target = '_blank'; a.rel = 'noopener'; }
  else a.addEventListener('click', e => { e.preventDefault(); toast('حط رابط قناتك بأول ملف script.js'); });
});

/* ===== الهدف ===== */
const pct = Math.min(100, CONFIG.subsNow / CONFIG.subsGoal * 100);
$('#goalTxt').textContent = CONFIG.subsNow + ' / ' + CONFIG.subsGoal + ' مشترك';
requestAnimationFrame(() => { $('#goalBar').style.width = Math.max(3, pct) + '%'; });

/* ===== الكود اللي بينكتب ===== */
const TYPED = `<!DOCTYPE html>
<html>
<body>
  <h1>موقعي الأول</h1>
  <p>تعلّمت HTML!</p>
  <a href="#">اضغط هنا</a>
</body>
</html>`;
const hl = s => esc(s).replace(/(&lt;\/?[a-z0-9!]+)/gi, '<span class="t">$1</span>');
const CUR = '<span class="cur"></span>';
if (reduced) $('#typed').innerHTML = hl(TYPED);
else {
  let i = 0;
  const timer = setInterval(() => {
    i++;
    $('#typed').innerHTML = hl(TYPED.slice(0, i)) + CUR;
    if (i >= TYPED.length) clearInterval(timer);
  }, 38);
}

/* ===== الفيديوهات ===== */
let tag = 'all';
function renderChips() {
  $('#chips').innerHTML = Object.entries(TAGS).map(([k, v]) =>
    `<button class="chip ${k === tag ? 'on' : ''}" data-tag="${k}" type="button">${v}</button>`).join('');
}
function renderVideos() {
  $('#vgrid').innerHTML = VIDEOS.map((v, i) => ({ v, i })).filter(x => tag === 'all' || x.v.tag === tag).map(({ v, i }) => `
    <button class="vcard" data-v="${i}" type="button">
      <div class="thumb">${v.id
        ? `<img src="https://i.ytimg.com/vi/${esc(v.id)}/hqdefault.jpg" alt="" loading="lazy">`
        : `<span class="ph">&lt;/&gt;</span>`}
        <span class="play-b">▶</span><em>${esc(v.dur)}</em>
      </div>
      <div class="vinfo"><h3>${esc(v.title)}</h3><p>${esc(v.desc)}</p></div>
    </button>`).join('');
}
renderChips(); renderVideos();
$('#chips').addEventListener('click', e => {
  const c = e.target.closest('[data-tag]'); if (!c) return;
  tag = c.dataset.tag; renderChips(); renderVideos();
});
$('#vgrid').addEventListener('click', e => {
  const c = e.target.closest('[data-v]'); if (c) openVideo(+c.dataset.v);
});
$('#watchFirst').addEventListener('click', () => openVideo(0));

function openVideo(i) {
  const v = VIDEOS[i]; if (!v) return;
  $('#mt').textContent = v.title;
  $('#md').textContent = v.desc;
  $('#mplayer').innerHTML = v.id
    ? `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(v.id)}?autoplay=1&rel=0" title="${esc(v.title)}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`
    : `<div class="noid">حط رقم الفيديو (id) بملف script.js ليشتغل هون.</div>`;
  $('#ml').innerHTML = v.id
    ? `<a class="btn small" href="https://www.youtube.com/watch?v=${encodeURIComponent(v.id)}" target="_blank" rel="noopener">افتح على يوتيوب</a>` : '';
  $('#modal').hidden = false;
  document.body.style.overflow = 'hidden';
}
function closeVideo() {
  $('#modal').hidden = true;
  $('#mplayer').innerHTML = '';
  document.body.style.overflow = '';
}
$('#mclose').addEventListener('click', closeVideo);
$('#modal').addEventListener('click', e => { if (e.target.id === 'modal') closeVideo(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeVideo(); $('#nav').classList.remove('open'); }
});

/* ===== المحرر الحي ===== */
const code = $('#code'), prev = $('#preview');
code.value = STARTER;
let pt;
const run = () => { prev.srcdoc = code.value; };
code.addEventListener('input', () => { clearTimeout(pt); pt = setTimeout(run, 250); });
$('#reset').addEventListener('click', () => { code.value = STARTER; run(); toast('رجع الكود الأصلي'); });
$('#copy').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(code.value); }
  catch (e) { code.select(); document.execCommand('copy'); }
  toast('تم نسخ الكود');
});
run();

/* ===== مسار التعلّم ===== */
$('#pathList').innerHTML = PATH.map((p, i) => `
  <li class="step ${p.ok ? 'done' : ''}">
    <b class="n">${i + 1}</b>
    <div><h3>${esc(p.t)}</h3><p>${esc(p.d)}</p></div>
    <span class="state">${p.ok ? 'متوفر' : 'قريباً'}</span>
  </li>`).join('');

/* ===== الاختبار ===== */
let qi = 0, score = 0, locked = false;
function renderQuiz() {
  const box = $('#quizBox');
  if (qi >= QUIZ.length) {
    const msg = score === QUIZ.length ? 'ممتاز! أنت جاهز للدرس الجاي 🔥'
      : score >= 2 ? 'قريب جداً. راجع الفيديو وجرّب تاني.' : 'ولا يهمك، ابدأ من أول فيديو وبتتعلّم.';
    box.innerHTML = `<div class="result"><div class="big">${score}/${QUIZ.length}</div><p>${msg}</p>
      <button class="btn" id="qre" type="button">أعد الاختبار</button></div>`;
    return;
  }
  const q = QUIZ[qi]; locked = false;
  box.innerHTML = `<div class="qmeta">سؤال ${qi + 1} من ${QUIZ.length}</div><h3>${esc(q.q)}</h3>
    <div class="opts">${q.o.map((o, i) => `<button class="opt" data-i="${i}" type="button" dir="auto">${esc(o)}</button>`).join('')}</div>
    <div class="qfoot"><button class="btn small" id="qnext" type="button" hidden>${qi === QUIZ.length - 1 ? 'شوف النتيجة' : 'السؤال التالي'}</button></div>`;
}
$('#quizBox').addEventListener('click', e => {
  const opt = e.target.closest('.opt');
  if (opt && !locked) {
    locked = true;
    const pick = +opt.dataset.i, right = QUIZ[qi].a;
    if (pick === right) score++;
    $$('.opt').forEach((b, i) => { if (i === right) b.classList.add('ok'); else if (i === pick) b.classList.add('bad'); });
    $('#qnext').hidden = false;
    return;
  }
  if (e.target.id === 'qnext') { qi++; renderQuiz(); }
  if (e.target.id === 'qre') { qi = 0; score = 0; renderQuiz(); }
});
renderQuiz();

/* ===== نموذج التواصل ===== */
$('#cform').addEventListener('submit', e => {
  e.preventDefault();
  const name = $('#cname').value.trim(), msg = $('#cmsg').value.trim();
  if (!name || !msg) { toast('اكتب اسمك ورسالتك أول'); return; }
  if (!CONFIG.email) { toast('حط إيميلك بأول ملف script.js'); return; }
  location.href = 'mailto:' + CONFIG.email + '?subject=' + encodeURIComponent('رسالة من ' + name) +
    '&body=' + encodeURIComponent(msg);
});