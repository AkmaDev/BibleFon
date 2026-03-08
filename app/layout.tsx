import type { Metadata } from "next"
import { Lora, Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
})

const lora = Lora({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "BibleFon — Histoires Bibliques en Langue Fon",
  description:
    "Des histoires bibliques illustrées, lues et écoutées en langue fon pour les enfants et les familles.",
  keywords: ["Bible", "Fon", "Bénin", "histoires pour enfants", "langue fon", "audio"],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
  },
  openGraph: {
    title: "BibleFon",
    description: "Histoires bibliques illustrées en langue fon",
    type: "website",
    images: [{ url: "/logo.svg", width: 320, height: 80, alt: "BibleFon" }],
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr-BJ" className={`${inter.variable} ${lora.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  )
}
