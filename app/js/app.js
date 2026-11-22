(function () {
  var hasTizen = typeof tizen !== "undefined";
  var DAYS = ["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"];
  var MONTHS = ["JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE","JULY","AUGUST",
                "SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"];

  var $ = function (id) { return document.getElementById(id); };
  var installed = [];         // [{id, name}] from the TV
  var cards = [];             // DOM nodes for app cards
  var col = 0;
  var today = null, tomorrow = null, lastDay = -1;

  function pad(n) { return (n < 10 ? "0" : "") + n; }

  /* ---------- clock ---------- */
  function greeting(h) {
    if (h < 12) return "GOOD MORNING";
    if (h < 15) return "GOOD AFTERNOON";
    if (h < 19) return "GOOD EVENING";
    return "GOOD NIGHT";
  }

  function fmtTime(d, withAmpm) {
    var h = d.getHours(), m = d.getMinutes();
    if (CONFIG.USE_24H) return pad(h) + ":" + pad(m);
    var h12 = h % 12 || 12;
    return h12 + ":" + pad(m) + (withAmpm ? (h < 12 ? " AM" : " PM") : "");
  }

  function tick() {
    var now = new Date();
    $("greeting").textContent = greeting(now.getHours());
    $("hhmm").textContent = fmtTime(now, false);
    $("ampm").textContent = CONFIG.USE_24H ? "" : (now.getHours() < 12 ? "AM" : "PM");
    $("date").textContent = DAYS[now.getDay()] + " " + now.getDate() + " " + MONTHS[now.getMonth()];
    if (now.getDate() !== lastDay) { lastDay = now.getDate(); loadPrayer(); }
    renderPrayer(now);
  }

  /* ---------- prayer ---------- */
  function loadPrayer() {
    var now = new Date();
    var tmr = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    Prayer.dayData(now, function (d) { today = d; renderPrayer(new Date()); });
    Prayer.dayData(tmr, function (d) { tomorrow = d; renderPrayer(new Date()); });
  }

  function renderPrayer(now) {
    var list = $("prayer-list");
    $("prayer-title").textContent = "WAKTU SOLAT · " + CONFIG.PRAYER_PLACE;
    if (!today) {
      list.innerHTML = '<div class="p-empty">Loading prayer times…</div>';
      $("next-prayer").textContent = "";
      return;
    }
    $("hijri").textContent = Prayer.hijriText(today.hijri);

    // find next prayer (Syuruk is shown but not counted as a prayer)
    var nextKey = null, nextTime = null;
    for (var i = 0; i < Prayer.ORDER.length; i++) {
      var o = Prayer.ORDER[i], t = today.times[o.key];
      if (o.prayer && t && t > now) { nextKey = o.key; nextTime = t; break; }
    }
    var nextLabel = "";
    if (!nextKey && tomorrow && tomorrow.times.subuh) {
      nextKey = "subuh-tomorrow"; nextTime = tomorrow.times.subuh; nextLabel = "Subuh";
    }

    var html = "";
    for (var j = 0; j < Prayer.ORDER.length; j++) {
      var p = Prayer.ORDER[j], tm = today.times[p.key];
      var cls = "p-item" + (p.key === nextKey ? " next" : "") + (p.prayer ? "" : " minor");
      html += '<div class="' + cls + '"><div class="p-name">' + p.label + '</div>' +
              '<div class="p-time">' + (tm ? fmtTime(tm, true) : "--:--") + '</div></div>';
      if (p.key === nextKey) nextLabel = p.label;
    }
    list.innerHTML = html;

    if (nextTime) {
      var mins = Math.max(0, Math.ceil((nextTime - now) / 60000));
      var h = Math.floor(mins / 60), m = mins % 60;
      $("next-prayer").textContent = nextLabel + " in " + (h ? h + "h " : "") + m + "m";
    } else {
      $("next-prayer").textContent = "";
    }
  }

  /* ---------- apps ---------- */
  function findInstalled(app) {
    for (var i = 0; i < installed.length; i++) {
      var n = (installed[i].name || "").toLowerCase();
      for (var j = 0; j < app.match.length; j++) {
        if (n.indexOf(app.match[j]) !== -1) return installed[i].id;
      }
    }
    return null;
  }

  function buildCards() {
    var wrap = $("apps");
    wrap.innerHTML = "";
    cards = [];
    for (var i = 0; i < CONFIG.APPS.length; i++) {
      var a = CONFIG.APPS[i];
      var el = document.createElement("div");
      el.className = "card focusable" + (a.font === "bold" ? " bold" : "");
      el.style.background = a.card.bg;
      el.style.color = a.card.fg;
      el.textContent = a.label || a.name;
      el.setAttribute("data-index", i);
      wrap.appendChild(el);
      cards.push(el);
    }
  }

  var HELPER = "http://127.0.0.1:8095";

  function xhr(method, url, ok, fail) {
    var x = new XMLHttpRequest();
    x.open(method, url, true);
    x.timeout = 4000;
    x.onload = function () {
      if (x.status >= 200 && x.status < 300) {
        var data = null;
        try { data = JSON.parse(x.responseText); } catch (e) {}
        ok(data);
      } else { fail(x.status); }
    };
    x.onerror = function () { fail(0); };
    x.ontimeout = function () { fail(0); };
    x.send();
  }

  function launchOne(id, ok, fail) {
    // 1) Tizen API (only when running as an installed app)
    if (hasTizen) {
      try { tizen.application.launch(id, ok, function () { viaHelper(); }); return; }
      catch (e) {}
    }
    viaHelper();

    // 2) Home TV helper running inside TizenBrew
    function viaHelper() {
      xhr("GET", HELPER + "/launch?id=" + encodeURIComponent(id), ok, function (status) {
        if (status === 0) viaRemoteApi(); else fail();
      });
    }
    // 3) The TV's own remote-control API (same one phone remote apps use)
    function viaRemoteApi() {
      xhr("POST", "http://127.0.0.1:8001/api/v2/applications/" + encodeURIComponent(id),
        ok, function (status) { if (status === 0) ok(); else fail(); });
    }
  }

  function launch(app) {
    var ids = [];
    var found = findInstalled(app);
    if (found) ids.push(found);
    for (var i = 0; i < app.ids.length; i++) if (ids.indexOf(app.ids[i]) === -1) ids.push(app.ids[i]);
    if (!ids.length) { flash(app.name + " is not installed"); return; }

    flash("Opening " + app.name + "…");
    (function tryId(k) {
      if (k >= ids.length) { flash("Could not open " + app.name); return; }
      launchOne(ids[k], function () {}, function () { tryId(k + 1); });
    })(0);
  }

  var flashTimer = null;
  function flash(msg) {
    var f = $("flash");
    if (!f) { f = document.createElement("div"); f.id = "flash"; document.body.appendChild(f); }
    f.textContent = msg;
    f.className = "show";
    clearTimeout(flashTimer);
    flashTimer = setTimeout(function () { f.className = ""; }, 2500);
  }

  /* ---------- focus & remote ---------- */
  function applyFocus() {
    var all = document.querySelectorAll(".focusable");
    for (var i = 0; i < all.length; i++) all[i].classList.remove("focused");
    var c = cards[col];
    c.classList.add("focused");
    var a = CONFIG.APPS[col];
    $("featured-name").textContent = a.name;
    $("bg").style.background =
      "radial-gradient(ellipse at 30% 45%, " + a.bg + " 0%, #12060c 75%)";
    // keep the focused card visible when there are many apps
    var visible = 1920 - 240;
    var shift = Math.max(0, c.offsetLeft + c.offsetWidth + 80 - visible);
    $("apps").style.transform = "translateX(" + (-shift) + "px)";
  }

  function onKey(e) {
    switch (e.keyCode) {
      case 37: if (col > 0) col--; break;                       // left
      case 39: if (col < cards.length - 1) col++; break;        // right
      case 13: launch(CONFIG.APPS[col]); break;                              // OK
      case 10009: e.preventDefault(); return;                                // Back: stay
      default: return;
    }
    e.preventDefault();
    applyFocus();
  }

  function loadInstalled(tries) {
    if (hasTizen) {
      try {
        tizen.application.getAppsInfo(function (list) {
          installed = list.map(function (a) { return { id: a.id, name: a.name }; });
        }, function () {});
        return;
      } catch (e) {}
    }
    xhr("GET", HELPER + "/apps", function (list) {
      if (list && list.length) installed = list;
    }, function () {
      if (tries > 0) setTimeout(function () { loadInstalled(tries - 1); }, 3000);
    });
  }

  function init() {
    buildCards();
    applyFocus();
    tick();
    setInterval(tick, 15000);
    document.addEventListener("keydown", onKey);
    loadInstalled(10);
    // when we come back from another app, refresh the clock immediately
    document.addEventListener("visibilitychange", function () { if (!document.hidden) tick(); });
  }

  init();
})();
