/*
 * Home TV settings. Edit this file to change apps, colours or prayer zone.
 *
 * PRAYER_ZONE: JAKIM e-Solat zone code. Senawang is in Seremban district,
 * which is zone NGS03 (Port Dickson & Seremban). Change it if you move.
 *
 * APPS: cards shown on the home screen, left to right.
 *   name  - text shown on the card / big title
 *   match - words used to find the installed app by its name on the TV
 *   ids   - fallback Tizen app IDs tried if the name search fails
 *   bg    - background colour of the whole screen when this card is selected
 *   card  - card style: background colour + text colour
 */
var CONFIG = {
  PRAYER_ZONE: "NGS03",
  PRAYER_PLACE: "SENAWANG",
  USE_24H: false,

  // World food & places screensaver
  SCREENSAVER: {
    enabled: true,
    idleMinutes: 1,      // start after this many minutes with no remote button press
    changeSeconds: 5    // change photo every 60 seconds
  },

  APPS: [
    { name: "Netflix",     match: ["netflix"],               ids: ["3201907018807", "11101200001"],
      bg: "#8a0f24", card: { bg: "#ffffff", fg: "#e50914" }, label: "NETFLIX", font: "bold" },
    { name: "YouTube",     match: ["youtube"],               ids: ["111299001912"],
      bg: "#7a1010", card: { bg: "#ffffff", fg: "#212121" }, label: "▶ YouTube" },
    { name: "Prime Video", match: ["prime video", "amazon"], ids: ["3201910019365", "3201512006785"],
      bg: "#0b3a66", card: { bg: "#1aa3ff", fg: "#ffffff" }, label: "prime video" },
    { name: "Apple TV",    match: ["apple tv"],              ids: ["3201807016597"],
      bg: "#1c1c22", card: { bg: "#111114", fg: "#ffffff" }, label: "Apple TV" },
    { name: "Spotify",     match: ["spotify"],               ids: ["3201606009684"],
      bg: "#0d4a26", card: { bg: "#1ed760", fg: "#0b0b0b" }, label: "Spotify" },
    { name: "Durioo+",     match: ["durioo"],                ids: [],
      bg: "#6b3c0a", card: { bg: "#f39a1e", fg: "#ffffff" }, label: "durioo+" },
    { name: "Gallery",     match: ["gallery"],               ids: [],
      bg: "#5a1a5e", card: { bg: "#d63fae", fg: "#ffffff" }, label: "Gallery" }
  ]
};
