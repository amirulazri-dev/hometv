/*
 * World screensaver: signature food & famous places, photo from Wikipedia.
 * Starts after CONFIG.SCREENSAVER.idleMinutes with no remote key press,
 * changes every CONFIG.SCREENSAVER.changeSeconds. Any key closes it.
 * Food list is halal-friendly (no pork / alcohol dishes).
 *
 * To add an item: { t: "Wikipedia article title", k: "food" | "place", c: "Country" }
 */
var WORLD = [
  // ---- Food ----
  { t: "Nasi lemak", k: "food", c: "Malaysia" },
  { t: "Roti canai", k: "food", c: "Malaysia" },
  { t: "Laksa", k: "food", c: "Malaysia" },
  { t: "Satay", k: "food", c: "Malaysia & Indonesia" },
  { t: "Rendang", k: "food", c: "Indonesia" },
  { t: "Nasi goreng", k: "food", c: "Indonesia" },
  { t: "Hainanese chicken rice", k: "food", c: "Singapore" },
  { t: "Chilli crab", k: "food", c: "Singapore" },
  { t: "Halo-halo", k: "food", c: "Philippines" },
  { t: "Tom yum", k: "food", c: "Thailand" },
  { t: "Pad thai", k: "food", c: "Thailand" },
  { t: "Mango sticky rice", k: "food", c: "Thailand" },
  { t: "Pho", k: "food", c: "Vietnam" },
  { t: "Sushi", k: "food", c: "Japan" },
  { t: "Tempura", k: "food", c: "Japan" },
  { t: "Mochi", k: "food", c: "Japan" },
  { t: "Bibimbap", k: "food", c: "South Korea" },
  { t: "Kimchi", k: "food", c: "South Korea" },
  { t: "Peking duck", k: "food", c: "China" },
  { t: "Biryani", k: "food", c: "India" },
  { t: "Masala dosa", k: "food", c: "India" },
  { t: "Butter chicken", k: "food", c: "India" },
  { t: "Kabsa", k: "food", c: "Saudi Arabia" },
  { t: "Mandi (food)", k: "food", c: "Yemen" },
  { t: "Mansaf", k: "food", c: "Jordan" },
  { t: "Hummus", k: "food", c: "Levant" },
  { t: "Baklava", k: "food", c: "Türkiye" },
  { t: "Doner kebab", k: "food", c: "Türkiye" },
  { t: "Tajine", k: "food", c: "Morocco" },
  { t: "Couscous", k: "food", c: "North Africa" },
  { t: "Jollof rice", k: "food", c: "West Africa" },
  { t: "Injera", k: "food", c: "Ethiopia" },
  { t: "Bobotie", k: "food", c: "South Africa" },
  { t: "Paella", k: "food", c: "Spain" },
  { t: "Neapolitan pizza", k: "food", c: "Italy" },
  { t: "Gelato", k: "food", c: "Italy" },
  { t: "Croissant", k: "food", c: "France" },
  { t: "Ratatouille", k: "food", c: "France" },
  { t: "Fish and chips", k: "food", c: "United Kingdom" },
  { t: "Pretzel", k: "food", c: "Germany" },
  { t: "Goulash", k: "food", c: "Hungary" },
  { t: "Borscht", k: "food", c: "Ukraine" },
  { t: "Moussaka", k: "food", c: "Greece" },
  { t: "Taco", k: "food", c: "Mexico" },
  { t: "Ceviche", k: "food", c: "Peru" },
  { t: "Brigadeiro", k: "food", c: "Brazil" },
  { t: "Asado", k: "food", c: "Argentina" },
  { t: "Poutine", k: "food", c: "Canada" },
  { t: "Hamburger", k: "food", c: "United States" },
  { t: "Pavlova (cake)", k: "food", c: "Australia & New Zealand" },

  // ---- Places ----
  { t: "Petronas Towers", k: "place", c: "Malaysia" },
  { t: "Putra Mosque", k: "place", c: "Malaysia" },
  { t: "Mount Kinabalu", k: "place", c: "Malaysia" },
  { t: "Langkawi Sky Bridge", k: "place", c: "Malaysia" },
  { t: "Marina Bay Sands", k: "place", c: "Singapore" },
  { t: "Borobudur", k: "place", c: "Indonesia" },
  { t: "Angkor Wat", k: "place", c: "Cambodia" },
  { t: "Hạ Long Bay", k: "place", c: "Vietnam" },
  { t: "Bagan", k: "place", c: "Myanmar" },
  { t: "Mount Fuji", k: "place", c: "Japan" },
  { t: "Himeji Castle", k: "place", c: "Japan" },
  { t: "Shirakawa-gō", k: "place", c: "Japan" },
  { t: "Great Wall of China", k: "place", c: "China" },
  { t: "Forbidden City", k: "place", c: "China" },
  { t: "Taj Mahal", k: "place", c: "India" },
  { t: "Masjid al-Haram", k: "place", c: "Saudi Arabia" },
  { t: "Al-Masjid an-Nabawi", k: "place", c: "Saudi Arabia" },
  { t: "Sheikh Zayed Grand Mosque", k: "place", c: "UAE" },
  { t: "Burj Khalifa", k: "place", c: "UAE" },
  { t: "Petra", k: "place", c: "Jordan" },
  { t: "Sultan Ahmed Mosque", k: "place", c: "Türkiye" },
  { t: "Cappadocia", k: "place", c: "Türkiye" },
  { t: "Giza pyramid complex", k: "place", c: "Egypt" },
  { t: "Alhambra", k: "place", c: "Spain" },
  { t: "Sagrada Família", k: "place", c: "Spain" },
  { t: "Eiffel Tower", k: "place", c: "France" },
  { t: "Colosseum", k: "place", c: "Italy" },
  { t: "Santorini", k: "place", c: "Greece" },
  { t: "Tower Bridge", k: "place", c: "United Kingdom" },
  { t: "Neuschwanstein Castle", k: "place", c: "Germany" },
  { t: "Matterhorn", k: "place", c: "Switzerland" },
  { t: "Lake Bled", k: "place", c: "Slovenia" },
  { t: "Plitvice Lakes National Park", k: "place", c: "Croatia" },
  { t: "Table Mountain", k: "place", c: "South Africa" },
  { t: "Victoria Falls", k: "place", c: "Zambia & Zimbabwe" },
  { t: "Serengeti National Park", k: "place", c: "Tanzania" },
  { t: "Statue of Liberty", k: "place", c: "United States" },
  { t: "Grand Canyon", k: "place", c: "United States" },
  { t: "Golden Gate Bridge", k: "place", c: "United States" },
  { t: "Niagara Falls", k: "place", c: "Canada & United States" },
  { t: "Banff National Park", k: "place", c: "Canada" },
  { t: "Machu Picchu", k: "place", c: "Peru" },
  { t: "Iguazu Falls", k: "place", c: "Argentina & Brazil" },
  { t: "Salar de Uyuni", k: "place", c: "Bolivia" },
  { t: "Sydney Opera House", k: "place", c: "Australia" },
  { t: "Uluru", k: "place", c: "Australia" },
  { t: "Milford Sound", k: "place", c: "New Zealand" }
];

var Screensaver = (function () {
  var active = false, order = [], pos = 0, timer = null, layer = 0;
  var cache = {};   // title -> { imgs, desc } or false
  var lastError = "";

  function $(id) { return document.getElementById(id); }

  function shuffle() {
    order = [];
    for (var i = 0; i < WORLD.length; i++) order.push(i);
    for (var j = order.length - 1; j > 0; j--) {
      var r = Math.floor(Math.random() * (j + 1)), tmp = order[j];
      order[j] = order[r]; order[r] = tmp;
    }
    pos = 0;
  }

  // Image URLs to try for a Wikipedia summary: big first, smaller as backup
  function pickImages(json) {
    var orig = json.originalimage, thumb = json.thumbnail, out = [];
    if (!orig || !orig.source) return null;
    if (!/\.(jpe?g|webp)$/i.test(orig.source)) return null;      // skip maps/logos (svg/png)
    if (orig.width < orig.height) return null;                   // skip portrait photos
    if (thumb && thumb.source && thumb.source.indexOf("/thumb/") !== -1) {
      var sizes = [1920, 1280, 960];
      for (var i = 0; i < sizes.length; i++) {
        if (orig.width > sizes[i]) out.push(thumb.source.replace(/\/\d+px-/, "/" + sizes[i] + "px-"));
      }
    }
    if (orig.width <= 4000) out.push(orig.source);
    if (thumb && thumb.source) out.push(thumb.source);
    return out.length ? out : null;
  }

  function status(msg) {
    var el = document.getElementById("ss-status");
    if (!el) {
      el = document.createElement("div");
      el.id = "ss-status";
      el.style.cssText = "position:absolute;left:100px;top:70px;font-size:24px;opacity:0.7;text-shadow:0 2px 10px #000";
      document.getElementById("screensaver").appendChild(el);
    }
    el.textContent = msg || "";
  }

  function firstSentence(text) {
    if (!text) return "";
    var m = text.match(/^(.{40,220}?[.!?])(\s|$)/);
    var s = m ? m[1] : text;
    return s.length > 230 ? s.slice(0, 227) + "…" : s;
  }

  function fetchItem(item, done) {
    if (cache[item.t] !== undefined) return done(cache[item.t]);
    var x = new XMLHttpRequest();
    x.open("GET", "https://en.wikipedia.org/api/rest_v1/page/summary/" +
      encodeURIComponent(item.t.replace(/ /g, "_")), true);
    x.timeout = 10000;
    x.onload = function () {
      var info = false;
      if (x.status === 200) {
        try {
          var j = JSON.parse(x.responseText), imgs = pickImages(j);
          if (imgs) info = { imgs: imgs, desc: firstSentence(j.extract) };
        } catch (e) {}
      }
      if (x.status !== 200) lastError = "Wikipedia replied " + x.status;
      cache[item.t] = info;
      done(info);
    };
    x.onerror = function () { lastError = "Can't reach Wikipedia (network)"; done(false); };
    x.ontimeout = function () { lastError = "Wikipedia timed out"; done(false); };
    x.send();
  }

  // find the next item that has a usable photo, preload it, then call show
  function next(tries) {
    if (!active) return;
    if (tries > 12) { status(lastError || "No photo available right now"); scheduleNext(); return; }
    if (pos >= order.length) shuffle();
    var item = WORLD[order[pos++]];
    fetchItem(item, function (info) {
      if (!active) return;
      if (!info) return next(tries + 1);
      (function load(k) {
        if (k >= info.imgs.length) {
          lastError = "Photos are not loading (image blocked?)";
          cache[item.t] = false;
          return next(tries + 1);
        }
        var im = new Image();
        im.onload = function () { info.img = info.imgs[k]; info.imgs = [info.imgs[k]]; show(item, info); scheduleNext(); };
        im.onerror = function () { load(k + 1); };
        im.src = info.imgs[k];
      })(0);
    });
  }

  function scheduleNext() {
    clearTimeout(timer);
    timer = setTimeout(function () { next(0); }, CONFIG.SCREENSAVER.changeSeconds * 1000);
  }

  function show(item, info) {
    layer = 1 - layer;
    var on = $("ss-img" + layer), off = $("ss-img" + (1 - layer));
    on.style.backgroundImage = "url('" + info.img.replace(/'/g, "%27") + "')";
    on.className = "ss-img";
    void on.offsetWidth;                // restart the slow zoom animation
    on.className = "ss-img show zoom";
    off.className = "ss-img";
    $("ss-kind").textContent = (item.k === "food" ? "SIGNATURE FOOD" : "FAMOUS PLACE") + " · " + item.c.toUpperCase();
    $("ss-title").textContent = item.t.replace(/ \((food|cake)\)$/, "");
    $("ss-desc").textContent = info.desc;
    $("ss-caption").className = "show";
    status("");
  }

  function start() {
    if (active) return;
    active = true;
    if (!order.length) shuffle();
    $("screensaver").className = "show";
    status("Loading photo…");
    next(0);
  }

  function stop() {
    if (!active) return;
    active = false;
    clearTimeout(timer);
    $("screensaver").className = "";
    $("ss-caption").className = "";
  }

  return { start: start, stop: stop, isActive: function () { return active; } };
})();
