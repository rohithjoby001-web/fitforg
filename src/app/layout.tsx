import type { Metadata, Viewport } from "next";
import { Inter_Tight, Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

// ============================================================
// fitforg fonts — premium dashboard typography
//   - Inter Tight: main body + UI text (tighter than Inter)
//   - Space Grotesk: display headings (FITFORG, hero titles)
//   - IBM Plex Mono: numeric data labels, eyebrows, stats
// ============================================================

const interTight = Inter_Tight({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "fitforg — the grind, systematized",
  description: "A daily workout planner for people who don't need cheerleading. Pick your gear. Show up. Repeat.",
  keywords: ["workout", "fitness", "discipline", "training", "minimal", "brutalist", "pwa"],
  authors: [{ name: "fitforg" }],
  applicationName: "fitforg",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon-32x32.png"],
  },
  appleWebApp: {
    capable: true,
    title: "fitforg",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
  openGraph: {
    title: "fitforg",
    description: "the grind, systematized.",
    type: "website",
    images: [{ url: "/icon-512.png", width: 512, height: 512 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "fitforg",
    description: "the grind, systematized.",
    images: ["/icon-512.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="fitforg" />
      </head>
      <body
        className={`${interTight.variable} ${spaceGrotesk.variable} ${plexMono.variable} antialiased bg-background text-foreground min-h-screen`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
