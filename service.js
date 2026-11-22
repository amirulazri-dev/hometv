/*
 * Home TV background helper.
 * TizenBrew runs this file in its service, where the Tizen app API works.
 * The home screen page talks to it on http://127.0.0.1:8095
 *   GET /ping            -> { ok: true }
 *   GET /apps            -> list of installed apps [{ id, name }]
 *   GET /launch?id=APPID -> opens that app
 * Written in old-style JavaScript so it also runs on older TVs.
 */
var http = require('http');
var url = require('url');
var PORT = 8095;

function send(res, code, obj) {
  res.writeHead(code, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  });
  res.end(JSON.stringify(obj));
}

function errText(e) {
  return String((e && (e.message || e.name)) || e);
}

var server = http.createServer(function (req, res) {
  var u = url.parse(req.url, true);

  if (u.pathname === '/ping') return send(res, 200, { ok: true });

  if (u.pathname === '/apps') {
    try {
      tizen.application.getAppsInfo(function (list) {
        var out = [];
        for (var i = 0; i < list.length; i++) {
          out.push({ id: list[i].id, name: list[i].name, show: list[i].show });
        }
        send(res, 200, out);
      }, function (e) { send(res, 500, { error: errText(e) }); });
    } catch (e) { send(res, 500, { error: errText(e) }); }
    return;
  }

  if (u.pathname === '/launch') {
    var id = u.query.id;
    if (!id) return send(res, 400, { error: 'missing id' });
    try {
      tizen.application.launch(id,
        function () { send(res, 200, { ok: true }); },
        function (e) { send(res, 500, { error: errText(e) }); });
    } catch (e) { send(res, 500, { error: errText(e) }); }
    return;
  }

  send(res, 404, { error: 'not found' });
});

// If the helper was already started earlier, the port is busy: that's fine.
server.on('error', function () {});
server.listen(PORT, '127.0.0.1');
