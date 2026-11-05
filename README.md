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
│   ├── sw.js                # service worker (offline cache)
│   └── .well-known/
│       └── assetlinks.json  # TWA fingerprint (fill in after bubblewrap init)
└── src/
    ├── main.jsx             # React root — imports styles + app.js
    ├── app.js               # vanilla-JS app logic (ported from HTML)
    └── styles.css           # all CSS (ported from HTML <style>)
```

## Notes

- **The vanilla JS module owns the DOM.** React is just the build system here. To refactor pieces into proper React components later, you'd extract sections of `app.js` into JSX components one at a time — start with the simplest ones (Toast, Nav) and work up.
- **`localStorage` keys:** `ff4` (app state), `ff_welcome` (splash seen), `ff3` (legacy migration).
- **No router.** Three tabs swap in-place via `data-a="tab"` click handler.
- **Animation engine** runs at 60fps via `requestAnimationFrame` — do NOT try to convert to React state, performance will tank.
