import type { Metadata } from "next";
import { Inter, Bebas_Neue, Exo_2, Orbitron } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import PageBackground from "@/components/PageBackground";
import GlobalLayoutComponents from "@/components/GlobalLayoutComponents";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const exo2 = Exo_2({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-exo2",
  display: "swap",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["700", "900"],
  variable: "--font-orbitron",
  display: "swap",
});

const SITE_URL = "https://vbthackathon.com.tr";
const SITE_TITLE = "VBT Hackathon 2026 — Akıllı Şehirler";
const SITE_DESCRIPTION =
  "Akıllı Şehirler temalı 24 saatlik hackathon. 13-14 Mayıs 2026, Muğla Sıtkı Koçman Üniversitesi. Başvurular 1 Nisan'da açılıyor.";

export const metadata: Metadata = {
  // ─── Core SEO ─────────────────────────────────────────────
  title: {
    default: SITE_TITLE,
    template: "%s | VBT Hackathon 2026",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "hackathon",
    "VBT",
    "akıllı şehirler",
    "Muğla",
    "yazılım mühendisliği",
    "kodlama maratonu",
    "Muğla Sıtkı Koçman",
    "Veri Bilimi Topluluğu",
  ],
  authors: [{ name: "VBT — Veri Bilimi Topluluğu" }],
  creator: "VBT — Veri Bilimi Topluluğu",
  publisher: "Muğla Sıtkı Koçman Üniversitesi",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
  },

  // ─── Open Graph (Facebook, WhatsApp, LinkedIn) ────────────
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: SITE_URL,
    siteName: "VBT Hackathon 2026",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "VBT Hackathon 2026 — Akıllı Şehirler",
        type: "image/png",
      },
    ],
  },

  // ─── Twitter / X ──────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [`${SITE_URL}/og-image.png`],
    creator: "@vikibi",
  },

  // ─── Icons & Theme ────────────────────────────────────────
  icons: {
    icon: "/og-image.png",
    apple: "/og-image.png",
  },
  other: {
    "theme-color": "#020617",
    "color-scheme": "dark",
    "msapplication-TileColor": "#020617",
  },

  // ─── Category ─────────────────────────────────────────────
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        {/* Preload the first hero video so the browser fetches it before JS runs */}
        <link
          rel="preload"
          as="video"
          href="https://assets.vbthackathon.com.tr/videos/hero-bg.webm"
          type="video/webm"
        />
      </head>
      <body
        className={`${inter.variable} ${bebasNeue.variable} ${exo2.variable} ${orbitron.variable} font-sans antialiased bg-background text-foreground overflow-x-hidden`}
      >
        {/* SSR cover — prevents black flash before React hydrates and Preloader mounts */}
        <div
          id="ssr-cover"
          style={{ position: "fixed", inset: 0, zIndex: 200, background: "#020205", pointerEvents: "none" }}
        />
        <PageBackground />
        <GlobalLayoutComponents />
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
