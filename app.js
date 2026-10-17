// صفحة المقتبس: الأيقونات، والمظهر، والمعرض، ورسوم التثبيت، وصندوق الاقتراحات.
(() => {
  const cfg = window.MQ_SITE || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // أيقونات خطّية بسيطة
  const P = {
    download: '<path d="M12 4v11M7 10.5l5 5 5-5M5 19.5h14"/>',
    scissors: '<circle cx="6" cy="6" r="2.6"/><circle cx="6" cy="18" r="2.6"/><path d="M8.2 7.6 20 18M8.2 16.4 20 6"/>',
    notebook: '<rect x="5" y="3.5" width="14" height="17" rx="2"/><path d="M9 3.5v17M12 8h4M12 11.5h4"/>',
    focus: '<path d="M4 9V5.5A1.5 1.5 0 0 1 5.5 4H9M15 4h3.5A1.5 1.5 0 0 1 20 5.5V9M20 15v3.5a1.5 1.5 0 0 1-1.5 1.5H15M9 20H5.5A1.5 1.5 0 0 1 4 18.5V15"/><circle cx="12" cy="12" r="2.5"/>',
    route: '<circle cx="6" cy="18" r="2.2"/><circle cx="18" cy="6" r="2.2"/><path d="M8.2 18H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.8"/>',
    shuffle: '<path d="M4 7h3.5c4.5 0 4.5 10 9 10H20M4 17h3.5c1.6 0 2.6-1.2 3.4-2.8M13.1 9.8C13.9 8.2 14.9 7 16.5 7H20M17.5 4.5 20 7l-2.5 2.5M17.5 14.5 20 17l-2.5 2.5"/>',
    chart: '<path d="M4 20h16M7 16v-4M12 16V7M17 16v-7"/>',
    film: '<rect x="3.5" y="5" width="17" height="14" rx="2"/><path d="M3.5 9h17M3.5 15h17M8 5v4M8 15v4M16 5v4M16 15v4"/>',
    send: '<path d="M20 4 3.5 11l6.5 2.5L12.5 20 20 4z"/><path d="m10 13.5 4-4"/>',
    cloud: '<path d="M7.5 18.5h10a3.5 3.5 0 0 0 .4-7 5.5 5.5 0 0 0-10.6-1.4A4 4 0 0 0 7.5 18.5z"/>',
    zip: '<path d="M6.5 3.5h7.5l4.5 4.5v12.5h-12z"/><path d="M14 3.5V8h4.5M10.5 6h1M10.5 9h1M10.5 12h1M9.8 15h2.4v2.5H9.8z"/>',
    folder: '<path d="M3.5 7.5A1.5 1.5 0 0 1 5 6h4.2l2 2.2H19a1.5 1.5 0 0 1 1.5 1.5v8.3A1.5 1.5 0 0 1 19 19.5H5A1.5 1.5 0 0 1 3.5 18z"/>',
    check: '<path d="m6 12.5 4 4 8-9"/>',
    puzzle: '<path d="M10 4.5a2 2 0 1 1 4 0V6h3.5a1 1 0 0 1 1 1v3.5h-1.5a2 2 0 1 0 0 4h1.5V18a1 1 0 0 1-1 1H14v-1.5a2 2 0 1 0-4 0V19H6.5a1 1 0 0 1-1-1v-3.5H7a2 2 0 1 0 0-4H5.5V7a1 1 0 0 1 1-1H10z"/>',
    pin: '<path d="M9 4h6l-1 5 3 3v1.5H7V12l3-3zM12 13.5V20"/>',
    refresh: '<path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3M19.5 4.5v4h-4"/>',
    lock: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5M12 14.5v2.5"/>',
  };
  $$('i[data-icon]').forEach((el) => { const p = P[el.dataset.icon]; if (p) el.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${p}</svg>`; });

  if (cfg.version) $('#ver').textContent = `الإصدار ${cfg.version} — ملاحظاتك تصنع الإصدار القادم.`;

  // المظهر: تلقائي (حسب الجهاز) ← فاتح ← داكن
  const ICONS = {
    auto: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor" stroke="none"/></svg>',
    light: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/></svg>',
    dark: '<svg viewBox="0 0 24 24"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>',
  };
  const LABEL = { auto: 'المظهر: حسب الجهاز', light: 'المظهر: فاتح', dark: 'المظهر: داكن' };
  const tb = $('#themeBtn');
  let theme = 'auto';
  try { theme = localStorage.getItem('mqTheme') || 'auto'; } catch (_) {}
  const paintTheme = () => {
    if (theme === 'auto') delete document.documentElement.dataset.theme; else document.documentElement.dataset.theme = theme;
    tb.innerHTML = ICONS[theme]; tb.title = LABEL[theme]; tb.setAttribute('aria-label', LABEL[theme]);
  };
  tb.addEventListener('click', () => {
    theme = { auto: 'light', light: 'dark', dark: 'auto' }[theme] || 'auto';
    try { localStorage.setItem('mqTheme', theme); } catch (_) {}
    paintTheme();
  });
  paintTheme();

  // ---------- الأدوار الأربعة: مسرح يتنقّل بين المشاهد ----------
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const roleEls = $$('.role'), scenes = $$('.sc'), rolesBox = $('.roles');
  const DUR = 7000;
  let cur = 0, timer = 0, visible = true, started = false;
  const show = (n, byUser) => {
    cur = n;
    roleEls.forEach((r, k) => { r.classList.toggle('on', k === n); r.setAttribute('aria-selected', String(k === n)); });
    scenes.forEach((s) => s.classList.remove('on'));
    void scenes[n].offsetWidth; // يعيد تشغيل حركة المشهد من أولها
    scenes[n].classList.add('on');
    clearTimeout(timer);
    rolesBox.classList.remove('run'); void rolesBox.offsetWidth;
    if (reduce || !visible) return;
    const d = byUser ? DUR * 1.5 : DUR;
    rolesBox.style.setProperty('--dur', d + 'ms'); rolesBox.classList.add('run');
    timer = setTimeout(() => show((cur + 1) % scenes.length), d);
  };
  roleEls.forEach((r, k) => r.addEventListener('click', () => show(k, true)));
  rolesBox.addEventListener('keydown', (e) => {
    const step = e.key === 'ArrowDown' || e.key === 'ArrowLeft' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowRight' ? -1 : 0;
    if (!step) return; e.preventDefault();
    const n = (cur + step + roleEls.length) % roleEls.length; show(n, true); roleEls[n].focus();
  });
  const heroIO = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && started) show(cur); else if (!visible) { clearTimeout(timer); rolesBox.classList.remove('run'); }
  }, { threshold: 0.25 });
  heroIO.observe($('#mishkat'));
  document.addEventListener('visibilitychange', () => { if (document.hidden) { clearTimeout(timer); rolesBox.classList.remove('run'); } else if (visible) show(cur); });
  setTimeout(() => { started = true; show(0); }, reduce ? 0 : 1500);

  // ميلان خفيف للمشكاة مع حركة المؤشّر
  const mk = $('#mishkat');
  if (!reduce && matchMedia('(pointer: fine)').matches) {
    $('.hero').addEventListener('pointermove', (e) => {
      const r = mk.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) / r.width, y = (e.clientY - (r.top + r.height / 2)) / r.height;
      mk.style.setProperty('--ry', (x * 5).toFixed(2) + 'deg'); mk.style.setProperty('--rx', (-y * 4).toFixed(2) + 'deg');
    });
    $('.hero').addEventListener('pointerleave', () => { mk.style.setProperty('--ry', '0deg'); mk.style.setProperty('--rx', '0deg'); });
  }

  // ظهور العناصر عند التمرير، متتابعة
  const rv = $$('[data-rv]');
  rv.forEach((el) => { const sib = [...el.parentElement.children].filter((x) => x.hasAttribute('data-rv')); el.style.setProperty('--d', (sib.indexOf(el) * 0.09) + 's'); });
  const rvIO = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); rvIO.unobserve(e.target); } }), { threshold: 0.18, rootMargin: '0px 0px -40px 0px' });
  rv.forEach((el) => rvIO.observe(el));

  // ضوء يتبع المؤشّر على بطاقات المزايا
  $$('.tile').forEach((t) => t.addEventListener('pointermove', (e) => {
    const r = t.getBoundingClientRect();
    t.style.setProperty('--mx', (e.clientX - r.left) + 'px'); t.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }));

  // حدّ الشريط العلوي بعد التمرير
  const top = $('.top');
  const onScroll = () => top.classList.toggle('scrolled', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // المعرض
  const img = $('#galImg');
  const NAMES = { studio: 'الاستوديو', series: 'السلاسل', library: 'المقتبسات', publish: 'النشر', stats: 'الإحصاءات' };
  Object.keys(NAMES).forEach((k) => { const i = new Image(); i.src = `assets/shots/${k}.webp`; });
  $$('.tabs button').forEach((b) => b.addEventListener('click', () => {
    if (b.classList.contains('on')) return;
    $$('.tabs button').forEach((x) => { x.classList.toggle('on', x === b); x.setAttribute('aria-selected', String(x === b)); });
    img.style.opacity = 0;
    setTimeout(() => {
      img.onload = () => { img.style.opacity = 1; };
      img.src = `assets/shots/${b.dataset.img}.webp`; img.alt = `لقطة من ${NAMES[b.dataset.img]} في المقتبس`;
      if (img.complete) img.style.opacity = 1;
    }, 160);
  }));

  // رسوم التثبيت: تتحرّك حين تظهر لتشرح الخطوة
  const steps = $$('.step');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.45 });
    steps.forEach((s) => io.observe(s));
  } else steps.forEach((s) => s.classList.add('in'));

  // نسخ عنوان صفحة الإضافات (المتصفح لا يسمح بفتحه من رابط)
  $$('.copy').forEach((b) => b.addEventListener('click', async () => {
    const lab = b.querySelector('span');
    try { await navigator.clipboard.writeText(b.dataset.copy); lab.textContent = 'نُسخ'; b.classList.add('done'); }
    catch (_) { const r = document.createRange(); r.selectNodeContents(b.querySelector('code')); getSelection().removeAllRanges(); getSelection().addRange(r); lab.textContent = 'انسخه الآن'; }
    setTimeout(() => { lab.textContent = 'انسخ'; b.classList.remove('done'); }, 2200);
  }));

  // الاقتراحات
  const form = $('#fbForm');
  const st = $('#fbSt');
  const say = (t, k) => { st.textContent = t; st.className = 'fb-st' + (k ? ' ' + k : ''); };
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    if (fd.get('website')) return; // فخّ للبرامج الآلية
    const msg = String(fd.get('msg') || '').trim();
    if (msg.length < 3) { say('اكتب ملاحظتك أولًا.', 'err'); form.msg.focus(); return; }
    let last = 0; try { last = Number(localStorage.getItem('mqfb') || 0); } catch (_) {}
    if (Date.now() - last < 30000) { say('أرسلتَ ملاحظة قبل لحظات؛ انتظر نصف دقيقة ثم أعد.', 'err'); return; }
    if (!cfg.feedbackUrl) { say('صندوق الاقتراحات قيد التجهيز، وسيعمل قريبًا.', 'err'); return; }
    const btn = form.querySelector('button[type=submit]');
    btn.disabled = true; say('جارٍ الإرسال…');
    const data = { kind: fd.get('kind'), msg, name: String(fd.get('name') || '').trim(), contact: String(fd.get('contact') || '').trim(), page: location.href, ua: navigator.userAgent, version: cfg.version };
    try {
      // نص عادي حتى لا يحتاج المتصفح إلى طلب استئذان مسبق مع سكربت جوجل
      const r = await fetch(cfg.feedbackUrl, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(data) });
      const j = await r.json().catch(() => ({ ok: r.ok }));
      if (!j.ok) throw new Error(j.error || 'تعذّر الإرسال');
      try { localStorage.setItem('mqfb', String(Date.now())); } catch (_) {}
      form.reset();
      say('وصلت ملاحظتك، جزاك الله خيرًا.', 'ok');
    } catch (err) {
      say('تعذّر الإرسال الآن. أعد المحاولة بعد قليل.', 'err');
    } finally { btn.disabled = false; }
  });
})();
