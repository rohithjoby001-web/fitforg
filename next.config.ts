import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Serve the self-contained HTML app at the root URL.
  // The HTML file at public/app.html contains the entire app
  // (splash screen, exercises, workouts, gear, stats — all vanilla JS).
  // This rewrite serves it at "/" before Next.js routing kicks in.
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/", destination: "/app.html" },
      ],
    };
  },
};

export default nextConfig;
