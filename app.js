// صفحة المقتبس: معرض اللقطات، وصندوق الاقتراحات.
(() => {
  const cfg = window.MQ_SITE || {};

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
