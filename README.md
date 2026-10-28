# fitforg — the grind, systematized

A free, mobile-first workout planner with a strict editorial brutalist design.

**Pick what equipment you have → get a different workout for every day of the week.**

## Quick start

```bash
# 1. Install dependencies
npm install   # or: bun install / pnpm install

# 2. Run dev server
npm run dev   # opens at http://localhost:3000

# 3. Build for production
npm run build && npm start
```

## Tech stack

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Fonts**: Space Grotesk (display), Inter (sans), IBM Plex Mono (data)
- **State**: localStorage (no backend, no database)
- **PWA**: Web manifest + service worker (installable on Android/iOS)

## What's inside

- 60+ exercises hard-coded with equipment tags, muscle groups, sets/reps/rest
- 7-day rotating workout plan generator (Push / Pull / Legs / Upper / Core / Full Body / Mobility)
- Streak tracking (consecutive-day counter)
- Week rotation (regenerate plan with new exercises)
- Offline-first (works without internet after first load)
- 100% client-side — no signup, no tracking, no API keys

## Install as Android app

See [`PWA-INSTALL.md`](./PWA-INSTALL.md) for step-by-step instructions.

TL;DR:
1. Deploy to Vercel (free) → get a public URL
2. Visit [pwabuilder.com](https://www.pwabuilder.com) → paste URL → download .apk
3. Sideload the .apk on your Android phone

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → "Add New Project" → import the repo
3. Vercel auto-detects Next.js → click "Deploy"
4. Done — you get a free `https://your-app.vercel.app` URL

## Project structure

```
src/
├── app/
│   ├── globals.css         # Grayscale theme + editorial utilities
│   ├── layout.tsx          # Fonts + PWA metadata
│   └── page.tsx            # Main UI (Today / Week / Gear tabs)
├── components/
│   ├── fitforg-logo.tsx    # Your F logo
│   ├── pwa-install-banner.tsx
│   └── ui/                 # shadcn/ui components
├── hooks/
│   ├── useLocalStorage.ts  # Offline persistence
│   └── usePWAInstall.ts    # PWA install + service worker
└── lib/
    ├── exercises.ts        # 60+ exercise database
    └── workout-generator.ts # 7-day plan generator

public/
├── fitforg-logo.png        # Your high-res F logo
├── manifest.webmanifest    # PWA manifest
├── sw.js                   # Service worker (offline cache)
└── icon-*.png              # 9 generated PWA icons
```

## Cost

**$0 forever.** No backend, no database, no paid fonts, no API keys, no app store fees.

## License

MIT — do whatever you want with it.
