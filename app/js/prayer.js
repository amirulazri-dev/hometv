/*
 * Prayer times (JAKIM e-Solat data).
 * Source 1: api.waktusolat.app (JAKIM data, monthly)
 * Source 2: www.e-solat.gov.my (JAKIM official, monthly)
 * Results are cached on the TV so the screen still works offline.
 */
var Prayer = (function () {
  var ORDER = [
    { key: "subuh",   label: "Subuh",   prayer: true  },
    { key: "syuruk",  label: "Syuruk",  prayer: false },
    { key: "zohor",   label: "Zohor",   prayer: true  },
    { key: "asar",    label: "Asar",    prayer: true  },
    { key: "maghrib", label: "Maghrib", prayer: true  },
    { key: "isyak",   label: "Isyak",   prayer: true  }
  ];
  var MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  var HIJRI_MONTHS = ["Muharram","Safar","Rabiulawal","Rabiulakhir","Jamadilawal","Jamadilakhir",
                      "Rejab","Syaaban","Ramadan","Syawal","Zulkaedah","Zulhijjah"];

  var months = {};   // "2026-11" -> { day: { hijri, times: {key: Date} } }

  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function monthKey(y, m) { return y + "-" + pad(m); }

  function get(url, ok, fail) {
    var x = new XMLHttpRequest();
    x.open("GET", url, true);
    x.timeout = 15000;
    x.onload = function () {
      if (x.status >= 200 && x.status < 300) {
        try { ok(JSON.parse(x.responseText)); } catch (e) { fail(e); }
      } else { fail(new Error("HTTP " + x.status)); }
    };
    x.onerror = function () { fail(new Error("network")); };
    x.ontimeout = function () { fail(new Error("timeout")); };
    x.send();
  }

  // value can be unix seconds, unix ms, or "HH:MM(:SS)"
  function toDate(v, y, m, d) {
    if (v === null || v === undefined || v === "") return null;
    if (typeof v === "number" || /^\d+$/.test(String(v))) {
      var n = Number(v);
      return new Date(n > 1e12 ? n : n * 1000);
    }
    var p = String(v).split(":");
    if (p.length < 2) return null;
    return new Date(y, m - 1, d, Number(p[0]), Number(p[1]), Number(p[2] || 0));
  }

  function fromWaktuSolat(json, y, m) {
    var out = {};
    var list = json && (json.prayers || json.prayerTime || []);
    for (var i = 0; i < list.length; i++) {
      var p = list[i];
      var d = Number(p.day) || (i + 1);
      out[d] = {
        hijri: p.hijri || "",
        times: {
          subuh: toDate(p.fajr, y, m, d),   syuruk: toDate(p.syuruk, y, m, d),
          zohor: toDate(p.dhuhr, y, m, d),  asar: toDate(p.asr, y, m, d),
          maghrib: toDate(p.maghrib, y, m, d), isyak: toDate(p.isha, y, m, d)
        }
      };
    }
    return out;
  }

  function fromESolat(json, y, m) {
    var out = {};
    var list = (json && json.prayerTime) || [];
    for (var i = 0; i < list.length; i++) {
      var p = list[i];
      // date looks like "23-Nov-2026"
      var parts = String(p.date || "").split("-");
      var d = Number(parts[0]);
      var mon = MONTHS.indexOf(parts[1]) + 1;
      if (!d || mon !== m) continue;
      out[d] = {
        hijri: p.hijri || "",
        times: {
          subuh: toDate(p.fajr, y, m, d),   syuruk: toDate(p.syuruk, y, m, d),
          zohor: toDate(p.dhuhr, y, m, d),  asar: toDate(p.asr, y, m, d),
          maghrib: toDate(p.maghrib, y, m, d), isyak: toDate(p.isha, y, m, d)
        }
      };
    }
    return out;
  }

  function count(o) { var c = 0; for (var k in o) if (o.hasOwnProperty(k)) c++; return c; }

  function save(key, data) {
    try {
      var plain = {};
      for (var d in data) {
        if (!data.hasOwnProperty(d)) continue;
        var t = {};
        for (var k in data[d].times) t[k] = data[d].times[k] ? data[d].times[k].getTime() : null;
        plain[d] = { hijri: data[d].hijri, times: t };
      }
      localStorage.setItem("prayer:" + CONFIG.PRAYER_ZONE + ":" + key, JSON.stringify(plain));
    } catch (e) {}
  }

  function load(key) {
    try {
      var raw = localStorage.getItem("prayer:" + CONFIG.PRAYER_ZONE + ":" + key);
      if (!raw) return null;
      var plain = JSON.parse(raw), out = {};
      for (var d in plain) {
        var t = {};
        for (var k in plain[d].times) t[k] = plain[d].times[k] ? new Date(plain[d].times[k]) : null;
        out[d] = { hijri: plain[d].hijri, times: t };
      }
      return out;
    } catch (e) { return null; }
  }

  function demo(y, m) {
    // Sample data for the PC preview only (index.html?demo)
    var out = {}, base = [[5,49],[7,0],[13,3],[16,25],[19,1],[20,14]];
    for (var d = 1; d <= 31; d++) {
      var t = {};
      for (var i = 0; i < ORDER.length; i++) t[ORDER[i].key] = new Date(y, m - 1, d, base[i][0], base[i][1]);
      out[d] = { hijri: "1448-06-" + pad(Math.min(d, 29)), times: t };
    }
    return out;
  }

  function fetchMonth(y, m, done) {
    var key = monthKey(y, m);
    if (months[key]) return done(months[key]);
    if (/demo/.test(location.search)) { months[key] = demo(y, m); return done(months[key]); }

    var cached = load(key);
    if (cached && count(cached) > 0) { months[key] = cached; done(cached); }

    var zone = CONFIG.PRAYER_ZONE;
    var url1 = "https://api.waktusolat.app/v2/solat/" + zone + "?year=" + y + "&month=" + m;
    var url2 = "https://www.e-solat.gov.my/index.php?r=esolatApi/takwimsolat&period=month&zone=" + zone;

    get(url1, function (json) {
      var data = fromWaktuSolat(json, y, m);
      if (count(data) === 0) return tryOfficial();
      months[key] = data; save(key, data); done(data);
    }, tryOfficial);

    function tryOfficial() {
      var now = new Date();
      if (now.getFullYear() !== y || now.getMonth() + 1 !== m) { if (!cached) done(null); return; }
      get(url2, function (json) {
        var data = fromESolat(json, y, m);
        if (count(data) === 0) { if (!cached) done(null); return; }
        months[key] = data; save(key, data); done(data);
      }, function () { if (!cached) done(null); });
    }
  }

  function dayData(date, cb) {
    var y = date.getFullYear(), m = date.getMonth() + 1, d = date.getDate();
    fetchMonth(y, m, function (data) { cb(data ? data[d] || null : null); });
  }

  function hijriText(h) {
    // "1448-06-02" -> "2 Jamadilakhir 1448H"
    var p = String(h || "").split("-");
    if (p.length !== 3) return "";
    var mi = Number(p[1]) - 1;
    return Number(p[2]) + " " + (HIJRI_MONTHS[mi] || "") + " " + p[0] + "H";
  }

  return { ORDER: ORDER, dayData: dayData, hijriText: hijriText };
})();
