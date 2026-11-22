# Home TV

A clean home screen for a Samsung Tizen TV (tested target: UA43AU7002, Tizen 6), loaded through TizenBrew as an app module.

- Big clock, greeting, date and Hijri date
- Waktu solat for Senawang (JAKIM zone NGS03) with countdown to the next prayer
- Large app cards: Netflix, YouTube, Prime Video, Apple TV, Spotify, Durioo+, Gallery

## Install on the TV

1. TizenBrew must be installed and working (Host PC IP = 127.0.0.1).
2. In TizenBrew, open the module manager and add: `gh/<your-github-username>/hometv`
3. Open **Home TV** from the TizenBrew list.

## Change settings

Edit `app/js/config.js` (apps, colours, prayer zone), commit, push.
The TV picks up changes from jsDelivr (may take up to 12 hours to refresh).

## Preview on a PC

Open `app/index.html?demo` in Chrome (shows sample prayer times).
