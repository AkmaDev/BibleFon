// next.config.ts
/** @type {import('next').NextConfig} */

const cspHeader = [
  "default-src 'self'",
  // CDN scripts (jQuery + Turn.js) — integrity checked via SRI
  "script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com",
  // Inline styles nécessaires (nombreux objets style JSX)
  "style-src 'self' 'unsafe-inline'",
  // Images locales + Pexels/Unsplash + blobs SVG
  "img-src 'self' data: blob: https://images.pexels.com https://images.unsplash.com",
  // Blobs audio (TTS)
  "media-src 'self' blob:",
  // API HuggingFace pour TTS
  "connect-src 'self' https://api-inference.huggingface.co",
  // Polices Google Fonts chargées localement par Next.js
  "font-src 'self' data:",
  // Pas d'embedding dans une iframe externe
  "frame-ancestors 'none'",
  // Empêche les injections de base URL
  "base-uri 'self'",
  // Limit form submissions to same origin
  "form-action 'self'",
].join("; ")

const nextConfig: import('next').NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy",   value: cspHeader },
          { key: "X-Frame-Options",           value: "DENY" },
          { key: "X-Content-Type-Options",    value: "nosniff" },
          { key: "Referrer-Policy",           value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy",        value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ]
  },
}

module.exports = nextConfig
