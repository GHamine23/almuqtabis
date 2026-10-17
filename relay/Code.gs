/**
 * المقتبس — موصل الاقتراحات: يستقبل ما يُكتب في صندوق الاقتراحات بصفحة المقتبس،
 * ويرسله إليك في تليجرام. رمز البوت يبقى هنا في سكربتك، ولا يظهر في الصفحة.
 *
 * ضع القيمتين في «خصائص السكربت» (إعدادات المشروع ← خصائص السكربت):
 *   BOT_TOKEN : رمز البوت من BotFather
 *   CHAT_ID   : رقم محادثتك مع البوت
 */

function doGet() {
  return json_({ ok: true, service: 'almuqtabis-feedback' });
}

function doPost(e) {
  try {
    var props = PropertiesService.getScriptProperties();
    var token = props.getProperty('BOT_TOKEN');
    var chat = props.getProperty('CHAT_ID');
    if (!token || !chat) return json_({ ok: false, error: 'not configured' });

    var d = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    var msg = String(d.msg || '').trim().slice(0, 3000);
    if (msg.length < 3) return json_({ ok: false, error: 'empty' });

    // حدّ بسيط ضد الإغراق: 30 رسالة في الساعة، ولا تكرار للرسالة نفسها
    var cache = CacheService.getScriptCache();
    var n = Number(cache.get('count') || 0);
    if (n > 30) return json_({ ok: false, error: 'busy' });
    cache.put('count', String(n + 1), 3600);
    var h = Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, msg, Utilities.Charset.UTF_8));
    if (cache.get('m' + h)) return json_({ ok: true, dup: true });
    cache.put('m' + h, '1', 21600);

    var kind = String(d.kind || 'ملاحظة').slice(0, 20);
    var icon = { 'اقتراح': '💡', 'ملاحظة': '📝', 'خطأ': '🐞', 'شكر': '🤍' }[kind] || '📝';
    var lines = [
      icon + ' <b>' + esc_(kind) + ' جديد على المقتبس</b>',
      '',
      esc_(msg),
      '',
      d.name ? '👤 ' + esc_(String(d.name).slice(0, 80)) : '',
      d.contact ? '📮 ' + esc_(String(d.contact).slice(0, 120)) : '',
      '<i>الإصدار ' + esc_(String(d.version || '')) + '</i>'
    ];
    var text = lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();

    var r = UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
      method: 'post', contentType: 'application/json', muteHttpExceptions: true,
      payload: JSON.stringify({ chat_id: chat, text: text, parse_mode: 'HTML', disable_web_page_preview: true })
    });
    var ok = r.getResponseCode() === 200;
    return json_({ ok: ok, error: ok ? '' : 'telegram' });
  } catch (err) {
    return json_({ ok: false, error: 'bad request' });
  }
}

function esc_(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

// شغّل هذه الدالة مرة من المحرّر لتجربة الإرسال إليك
function test() {
  var r = doPost({ postData: { contents: JSON.stringify({ kind: 'شكر', msg: 'تجربة: صندوق الاقتراحات يعمل ✓', version: 'test' }) } });
  Logger.log(r.getContent());
}
