# fitforg — Install as Android App (Free, No APK Needed)

fitforg is a **PWA (Progressive Web App)** — installable on Android without an
.apk file, without an app store, and without any build tools.

## Quick install (recommended)

1. **Deploy the app** (one-time, ~5 min):
   - Push this project to a GitHub repo (public or private, both work)
   - Go to [vercel.com](https://vercel.com) → "Add New Project" → import the GitHub repo
   - Vercel auto-detects Next.js → click "Deploy"
   - You'll get a URL like `https://fitforg.vercel.app`

2. **Install on Android** (~1 min):
   - Open Chrome on your Android phone
   - Visit your Vercel URL
   - Chrome will show an "Install app" prompt automatically
   - **OR** tap the 3-dot menu → "Install app" / "Add to Home screen"
   - The fitforg icon (your F logo) appears in your app drawer
   - Launches full-screen, works offline, no browser chrome

## What makes it installable

This app already has everything PWA needs:

- **Manifest** (`/public/manifest.webmanifest`) — defines name, icons, theme color,
  display mode ("standalone"), and 3 shortcuts (Today / Week / Gear) for long-press
- **Service worker** (`/public/sw.js`) — caches the app shell so it works offline
  after first load
- **Icons** — 9 sizes generated from your F logo (16/32/180/192/256/384/512 px +
  maskable versions for Android adaptive icons)
- **Theme color** — `#000000` (pure black, matches the design)
- **Apple touch icon** — for iOS "Add to Home Screen" support too

## If you really want an .apk file

After deploying to Vercel:

1. Visit [pwabuilder.com](https://www.pwabuilder.com)
2. Paste your Vercel URL (`https://fitforg.vercel.app`)
3. Click "Start" → "Package For Stores" → "Android"
4. Download the generated `.apk` (~2 min)
5. Sideload onto your phone (Settings → Install unknown apps → Chrome → Allow)

## Verify it's installed correctly

- App should appear in your **app drawer** (not just as a bookmark)
- Launching it should open **full-screen** (no Chrome URL bar)
- The "Install fitforg" banner in the app should disappear once installed
- Switch your phone to airplane mode and reload — app should still work fully offline

## Updating the app

When you push changes to GitHub → Vercel auto-deploys → next time the user opens
fitforg (with internet), the service worker downloads the new version in the
background → "New version ready" banner appears → tap "Update" to reload.
