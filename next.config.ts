import type { NextConfig } from "next";

// STATIC_EXPORT=1  → GitHub Pages (npm run build:static → out/)
// VERCEL=1         → Vercel (set automatically by Vercel platform)
// (unset)          → K8s / Docker   (npm run build → next start)
const isStaticExport = process.env.STATIC_EXPORT === "1";
const isVercel = !!process.env.VERCEL;

const nextConfig: NextConfig = {
  // Static export → GitHub Pages (basePath for subpath hosting)
  // Vercel → default Next.js output (Vercel handles bundling)
  // Docker/K8s → standalone (optimized Docker image)
  ...(isStaticExport
    ? { output: "export", basePath: "/Hackathon2026" }
    : isVercel
      ? {} // Vercel: default output, no basePath, no standalone
      : { output: "standalone" }),
  images: {
    // Static export (GitHub Pages) can't run the image optimizer; Docker/K8s/Vercel can.
    unoptimized: isStaticExport,
    formats: ["image/avif", "image/webp"],
  },
  allowedDevOrigins: ["192.168.1.4"],
  // Server Actions CSRF: allow requests through Cloudflare Tunnel where Host may be localhost
  experimental: {
    serverActions: {
      allowedOrigins: ["vbthackathon.com.tr", "www.vbthackathon.com.tr"],
    },
  },
  // Docker / K8s mode only: proxy /api/* → Hono API on :3001
  // Vercel uses its own API routing, no local Hono server needed
  ...(!isStaticExport && !isVercel && {
    redirects: async () => [
      {
        source: "/sunum",
        destination: "/sunum/index.html",
        permanent: false,
      },
    ],
    rewrites: async () => [
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:3001/api/:path*",
      },
    ],
    headers: async () => [
      {
        source: "/",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=3600, stale-while-revalidate=86400",
          },
        ],
      },
    ],
  }),
};

export default nextConfig;
