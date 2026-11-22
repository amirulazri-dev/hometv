(function () {
  var hasTizen = typeof tizen !== "undefined";
  var DAYS = ["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"];
  var MONTHS = ["JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE","JULY","AUGUST",
                "SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"];

  var $ = function (id) { return document.getElementById(id); };
  var installed = [];         // [{id, name}] from the TV
  var cards = [];             // DOM nodes for app cards
  var row = 1, col = 0;       // row 0 = top pills, row 1 = app cards
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

  function launch(app) {
    if (!hasTizen) { flash("Preview: would open " + app.name); return; }
    var ids = [];
    var found = findInstalled(app);
    if (found) ids.push(found);
    for (var i = 0; i < app.ids.length; i++) if (ids.indexOf(app.ids[i]) === -1) ids.push(app.ids[i]);
    if (!ids.length) { flash(app.name + " is not installed"); return; }

    (function tryId(k) {
      if (k >= ids.length) { flash("Could not open " + app.name); return; }
      try {
        tizen.application.launch(ids[k], function () {}, function () { tryId(k + 1); });
      } catch (e) { tryId(k + 1); }
    })(0);
  }

  function samsungHome() {
    if (!hasTizen) { flash("Preview: would show Samsung Home"); return; }
    try { tizen.application.getCurrentApplication().hide(); } catch (e) {}
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
    if (row === 0) {
      document.querySelector(".pill").classList.add("focused");
      return;
    }
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
      case 37: if (row === 1 && col > 0) col--; break;                       // left
      case 39: if (row === 1 && col < cards.length - 1) col++; break;        // right
      case 38: row = 0; break;                                               // up
      case 40: row = 1; break;                                               // down
      case 13:                                                               // OK
        if (row === 0) samsungHome(); else launch(CONFIG.APPS[col]);
        break;
      case 10009: e.preventDefault(); return;                                // Back: stay
      default: return;
    }
    e.preventDefault();
    applyFocus();
  }

  function loadInstalled(done) {
    if (!hasTizen) return done();
    try {
      tizen.application.getAppsInfo(function (list) {
        installed = list.map(function (a) { return { id: a.id, name: a.name }; });
        done();
      }, function () { done(); });
    } catch (e) { done(); }
  }

  function init() {
    buildCards();
    applyFocus();
    tick();
    setInterval(tick, 15000);
    document.addEventListener("keydown", onKey);
    loadInstalled(function () {});
    // when we come back from another app, refresh the clock immediately
    document.addEventListener("visibilitychange", function () { if (!document.hidden) tick(); });
  }

  init();
})();
