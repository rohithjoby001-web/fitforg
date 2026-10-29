// This page is never rendered — the next.config.ts rewrite
// serves public/app.html at "/" before Next.js routing runs.
// This file exists only to prevent Next.js build errors.
export default function Page() {
  return null;
}
