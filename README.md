# Fitforg — React + Vite

A free workout planner that adapts to the gear you have. PWA, installable, works offline.

This is the React/Vite version of the Fitforg app. The vanilla-JS app logic is preserved verbatim in `src/app.js` (it owns `#app`, `#nav`, `#splash` directly). React provides the build system and entry point.

## Develop

```bash
npm install
npm run dev
```

App boots on http://localhost:5173

## Build

```bash
npm run build      # outputs to dist/
npm run preview    # preview the production build locally
```

## Deploy to Cloudflare Pages

1. Push this folder to a GitHub repo
2. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git → pick the repo
3. Build settings:
   - **Framework preset:** None (or Vite)
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node version:** 18 or 20
4. Deploy — you get a `*.pages.dev` URL

## Add exercise videos later

Drop MP4 files in `public/videos/exercises/` named after the exercise ID, e.g.:

```
public/videos/exercises/
├── squat.mp4
├── squat-goblet.mp4
├── db-lunge.mp4
├── pushup.mp4
└── ...
```

The app auto-detects each video on first load. If found, the SVG figure is hidden and the video plays (looped, muted, autoplay). If not found, the SVG stick-figure animation runs as fallback.

Recommended specs: 480×480, MP4/H.264, no audio, ~600 kbps, 6–10 sec loop. Convert with ffmpeg:

```bash
ffmpeg -i input.mov -vf "scale=480:480:force_original_aspect_ratio=increase,crop=480,480" -an -b:v 600k -movflags +faststart squat.mp4
```

## Add PWA icons

The manifest references `icon-192.png` and `icon-512.png` in `public/`. Generate them from your logo:

```bash
magick logo.svg -resize 192x192 public/icon-192.png
magick logo.svg -resize 512x512 public/icon-512.png
```

If you skip this, the install prompt uses a generic icon — the app still works.

## Build an Android APK with Bubblewrap

After deploying to Cloudflare (so you have a public HTTPS URL):

```bash
npm install -g @bubblewrap/cli
bubblewrap init --manifest https://YOUR-PAGES-URL.pages.dev/manifest.webmanifest
bubblewrap build
```

Bubblewrap prints your APK's SHA-256 signing fingerprint. Paste it into `public/.well-known/assetlinks.json` (replacing the placeholder), then `git push` to redeploy. This removes the URL bar from your APK.

Output: `app-release-signed.apk` — sideload to Android, or upload to Play Store.

### Turn on notifications in the APK

The rest-timer notifications need notification delegation switched on in the Android wrapper. In the folder where you ran `bubblewrap init`, open `twa-manifest.json` and set:

```json
"enableNotifications": true,
"monochromeIconUrl": "https://YOUR-PAGES-URL.pages.dev/badge-96.png"
```

Then rebuild and reinstall:

```bash
bubblewrap update
bubblewrap build
```

(Starting fresh with `bubblewrap init`? Answer yes when it asks about notifications.) Without this, notifications still work in Chrome and in the installed web app, but not inside the APK.

## Workout notifications

Fitforg has no server and sends no push messages. Notifications only happen during a workout, and only while you're in another app:

| While you're away from the app | Notification panel shows |
|---|---|
| Rest between sets | `Rest · 0:42` with *Up next: exercise · set*, and **+15s** / **Skip rest** buttons |
| Break after the warm-up | `Warm-up done · 0:42` with **+15s** / **Start now** |
| Timed move (plank, march…) | `Plank · 0:32` countdown |
| Timer reaches zero | `Rest over` / `Time's up`, with sound or vibration |
| On an exercise, no timer | Quiet `Workout in progress` |

Coming back to the app clears it. Tapping the notification opens the app.

How it works:
- `src/notify.js` (app side) sends the current workout state to the service worker when the page goes to the background, and clears it when you come back.
- `public/sw.js` (service worker) ticks the countdown once a second and shows the alert. The worker does the ticking because Chrome slows down timers in background pages. Chrome lets a worker run for up to 5 minutes per message. The longest rest in the app is 90 s plus three +15s, so every rest fits.
- The first time you start a workout, the app asks whether to turn notifications on. You can change this later in **Settings → Notifications**. The choice is saved as `S.nt` (1 on, 0 off, unset = not asked yet).
- `public/badge-96.png` is the white-on-transparent status-bar icon. Android needs one; a full-colour icon shows as a white square.
- The service worker only registers in the production build. To test notifications locally, use `npm run build && npm run preview`, not `npm run dev`.
- Some phones (Xiaomi, Oppo, Vivo, Samsung with strict battery saving) kill background apps aggressively. If the countdown stops updating, set battery usage for Fitforg (and Chrome) to *Unrestricted*.

## Session timing

| Part | Length | Why |
|---|---|---|
| Warm-up | 5 / 5 / 6 / 7 min for 20 / 30 / 45 / 60 min sessions | ACSM: at least 5–10 min of light-to-moderate activity before training |
| ↳ Raise | 2–3 min: march, then a brisker move | Muscle temperature rises over the first 3–5 min of movement |
| ↳ Mobility + activation | the rest, chosen for the day's muscles | Dynamic moves for the joints you'll train |
| ↳ Specific | the light first set of the first exercise | ACSM: a light set of the exercise itself |
| Break before the first work set | 60 s (+15s up to 3×) | Time to catch your breath and set up gear. Short enough that the warm-up doesn't wear off: muscle temperature starts dropping within 15–30 min of stopping |

`PH`, `WARM`, `raiseSec` and `TRANS` in `src/app.js` hold these numbers. `PV` is the plan version: bump it when plan building changes, so today's plan rebuilds if it hasn't been started.

## Project structure

```
fitforg-react-v2/
├── index.html               # Vite entry — head + #app + #splash + SVG symbol
├── package.json             # React 18 + Vite 5
├── vite.config.js           # base: './'
├── .gitignore
├── README.md                # this file
├── public/
│   ├── manifest.webmanifest # PWA manifest
│   ├── sw.js                # service worker (offline cache + workout notifications)
│   ├── badge-96.png         # monochrome status-bar icon for notifications
│   └── .well-known/
│       └── assetlinks.json  # TWA fingerprint (fill in after bubblewrap init)
└── src/
    ├── main.jsx             # React root — imports styles + app.js
    ├── app.js               # vanilla-JS app logic (ported from HTML)
    ├── notify.js            # hands the workout timer to the service worker when you leave the app
    └── styles.css           # all CSS (ported from HTML <style>)
```

## Notes

- **The vanilla JS module owns the DOM.** React is just the build system here. To refactor pieces into proper React components later, you'd extract sections of `app.js` into JSX components one at a time — start with the simplest ones (Toast, Nav) and work up.
- **`localStorage` keys:** `ff4` (app state), `ff_welcome` (splash seen), `ff3` (legacy migration).
- **No router.** Three tabs swap in-place via `data-a="tab"` click handler.
- **Animation engine** runs at 60fps via `requestAnimationFrame` — do NOT try to convert to React state, performance will tank.
