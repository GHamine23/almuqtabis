// صفحة المقتبس: معرض اللقطات، وصندوق الاقتراحات.
(() => {
  const cfg = window.MQ_SITE || {};

  // المظهر: تلقائي (حسب الجهاز) ← فاتح ← داكن
  const ICONS = {
    auto: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M12 4v16" /><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor" stroke="none"/></svg>',
    light: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/></svg>',
    dark: '<svg viewBox="0 0 24 24"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>',
  };
  const LABEL = { auto: 'المظهر: حسب الجهاز', light: 'المظهر: فاتح', dark: 'المظهر: داكن' };
  const tb = document.getElementById('themeBtn');
  let theme = 'auto';
  try { theme = localStorage.getItem('mqTheme') || 'auto'; } catch (_) {}
  const paintTheme = () => {
    if (theme === 'auto') delete document.documentElement.dataset.theme; else document.documentElement.dataset.theme = theme;
    tb.innerHTML = ICONS[theme]; tb.title = LABEL[theme]; tb.setAttribute('aria-label', LABEL[theme]);
  };
  tb.addEventListener('click', () => {
    theme = { auto: 'light', light: 'dark', dark: 'auto' }[theme];
    try { localStorage.setItem('mqTheme', theme); } catch (_) {}
    paintTheme();
  });
  paintTheme();

  // المعرض
  const img = document.getElementById('galImg');
  document.querySelectorAll('.tabs button').forEach((b) => b.addEventListener('click', () => {
    document.querySelectorAll('.tabs button').forEach((x) => x.classList.toggle('on', x === b));
    img.style.opacity = 0;
    setTimeout(() => { img.src = `assets/shots/${b.dataset.img}.webp`; img.onload = () => { img.style.opacity = 1; }; }, 180);
  }));

  // الاقتراحات
  const form = document.getElementById('fbForm');
  const st = document.getElementById('fbSt');
  const say = (t, k) => { st.textContent = t; st.className = 'fb-st' + (k ? ' ' + k : ''); };
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    if (fd.get('website')) return; // فخّ للبرامج الآلية
    const msg = String(fd.get('msg') || '').trim();
    if (msg.length < 3) { say('اكتب ملاحظتك أولًا.', 'err'); form.msg.focus(); return; }
    const last = Number(localStorage.getItem('mqfb') || 0);
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
      localStorage.setItem('mqfb', String(Date.now()));
      form.reset();
      say('وصلت ملاحظتك — جزاك الله خيرًا 🤍', 'ok');
    } catch (err) {
      say('تعذّر الإرسال الآن. أعد المحاولة بعد قليل.', 'err');
    } finally { btn.disabled = false; }
  });
})();
