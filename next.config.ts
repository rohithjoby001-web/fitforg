import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/", destination: "/app.html" },
      ],
    };
  },
};

export default nextConfig;