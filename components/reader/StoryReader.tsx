"use client"

import React, { useState, useCallback, useEffect, useRef, useMemo } from "react"
import { createRoot, type Root } from "react-dom/client"
import Link from "next/link"
import {
  ArrowLeft, Volume2, VolumeX, Loader2, AlertCircle, ChevronLeft, ChevronRight,
} from "lucide-react"
import type { Book, PageContent } from "@/lib/books"

/* ─────────────────────────────────────────────
   Turn.js CDN — même moteur que FlipHTML5
   autoCenter:false → on gère le centrage manuellement
   Pas de classe "hard" sur les couvertures → toutes les pages fluides
───────────────────────────────────────────── */
const CDN_JQUERY          = "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"
const CDN_JQUERY_SRI      = "sha512-v2CJ7UaYy4JwqLDIrZUI/4hqeoQieOmAZNXBeQyjo21dadnwR+8ZaIJVT8EE2iyI61OV8e6M8PP2/4hpQINQ/g=="
const CDN_TURNJS          = "https://cdnjs.cloudflare.com/ajax/libs/turn.js/3/turn.min.js"
const CDN_TURNJS_SRI      = "sha512-rFun1mEMg3sNDcSjeGP35cLIycsS+og/QtN6WWnoSviHU9ykMLNQp7D1uuG1AzTV2w0VmyFVpszi2QJwiVW6oQ=="

function loadScript(src: string, integrity?: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return }
    const s = document.createElement("script")
    s.src = src
    if (integrity) {
      s.integrity  = integrity
      s.crossOrigin = "anonymous"
    }
    s.onload  = () => resolve()
    s.onerror = () => reject(new Error(`Script load failed: ${src}`))
    document.head.appendChild(s)
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function turnJs(el: HTMLElement): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (window as any).jQuery?.(el)
}

/* ─────────────────────────────────────────────
   Audio hook
───────────────────────────────────────────── */

function useAudio() {
  const audioRef   = useRef<HTMLAudioElement | null>(null)
  const blobUrlRef = useRef<string | null>(null)
  const [playing,       setPlaying]      = useState(false)
  const [loading,       setLoading]      = useState(false)
  const [error,         setError]        = useState<string | null>(null)
  const [currentSegIdx, setCurrentSegIdx] = useState<number | null>(null)

  const stop = useCallback(() => {
    audioRef.current?.pause()
    audioRef.current = null
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current)
      blobUrlRef.current = null
    }
    setPlaying(false)
    setCurrentSegIdx(null)
  }, [])

  const speak = useCallback(async (text: string) => {
    stop()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })
      if (!res.ok) {
        const e = await res.json().catch(() => ({}))
        throw new Error((e as { error?: string }).error ?? "Erreur TTS")
      }
      const url = URL.createObjectURL(await res.blob())
      blobUrlRef.current = url
      const a   = new Audio(url)
      a.onended = () => setPlaying(false)
      a.play()
      audioRef.current = a
      setPlaying(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Audio indisponible")
    } finally {
      setLoading(false)
    }
  }, [stop])

  const playFiles = useCallback((segments: { src: string }[]) => {
    stop()
    if (segments.length === 0) return
    setError(null)
    let idx = 0
    const playNext = () => {
      if (idx >= segments.length) { setPlaying(false); setCurrentSegIdx(null); return }
      const segIdx = idx
      setCurrentSegIdx(segIdx)
      const a = new Audio(segments[idx++].src)
      a.onended = playNext
      a.onerror = () => { setError("Audio indisponible"); setPlaying(false); setCurrentSegIdx(null) }
      a.play()
      audioRef.current = a
      setPlaying(true)
    }
    playNext()
  }, [stop])

  const toggle = useCallback(() => {
    if (!audioRef.current) return
    if (playing) { audioRef.current.pause(); setPlaying(false) }
    else          { audioRef.current.play();  setPlaying(true)  }
  }, [playing])

  useEffect(() => () => stop(), [stop])
  return { playing, loading, error, currentSegIdx, speak, playFiles, toggle, stop }
}

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */

type AnyPage = PageContent | { type: "back-cover" }

/* ─────────────────────────────────────────────
   Texture papier — SVG fractal noise matte
───────────────────────────────────────────── */

const PAPER_NOISE = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="250" height="250">` +
  `<filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch"/>` +
  `<feColorMatrix type="saturate" values="0"/></filter>` +
  `<rect width="250" height="250" filter="url(#n)" opacity="0.11"/></svg>`
)

const PAPER_BG     = "radial-gradient(ellipse at 42% 44%, #fdf8ee 0%, #f3e5ca 68%, #e9d8b5 100%)"
const PAPER_BG_ALT = "radial-gradient(ellipse at 58% 56%, #f6ead1 0%, #ebd7b5 65%, #e0c9a0 100%)"

function PaperGrain() {
  return (
    <div style={{
      position:        "absolute",
      inset:           0,
      pointerEvents:   "none",
      zIndex:          3,
      backgroundImage: `url("data:image/svg+xml,${PAPER_NOISE}")`,
      backgroundSize:  "250px 250px",
      mixBlendMode:    "multiply",
    }} />
  )
}

/* ─────────────────────────────────────────────
   Utilitaires de pagination du texte
───────────────────────────────────────────── */

const CHUNK_CHARS = 200  // max chars par sous-page (MobileTextBlock)

function splitText(text: string): string[] {
  if (!text || text.length <= CHUNK_CHARS) return [text]
  const chunks: string[] = []
  let remaining = text.trim()
  while (remaining.length > CHUNK_CHARS) {
    // Cherche une limite de phrase après au moins la moitié du chunk
    const searchFrom = Math.floor(CHUNK_CHARS * 0.6)
    const sub = remaining.slice(searchFrom)
    const match = sub.search(/[.!?»]\s/)
    let cutAt: number
    if (match === -1) {
      // Pas de limite de phrase — couper sur un espace
      const wb = remaining.lastIndexOf(" ", CHUNK_CHARS)
      cutAt = wb > 0 ? wb : CHUNK_CHARS
    } else {
      cutAt = searchFrom + match + 1
    }
    chunks.push(remaining.slice(0, cutAt).trim())
    remaining = remaining.slice(cutAt).trim()
  }
  if (remaining) chunks.push(remaining)
  return chunks.length > 1 ? chunks : [text]
}

function SubPageNav({
  total, current, onPrev, onNext,
}: { total: number; current: number; onPrev: () => void; onNext: () => void }) {
  if (total <= 1) return null
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 8, zIndex: 4, flexShrink: 0 }}>
      <button
        onClick={onPrev} disabled={current === 0}
        style={{ width: 22, height: 22, borderRadius: "50%", border: "1px solid rgba(160,100,30,0.35)", background: "rgba(160,100,30,0.10)", cursor: current === 0 ? "default" : "pointer", opacity: current === 0 ? 0.28 : 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 0, fontSize: 10, color: "#9b6e18" }}
      >▲</button>
      <div style={{ display: "flex", gap: 4 }}>
        {Array.from({ length: total }, (_, i) => (
          <div key={i} style={{ width: i === current ? 14 : 5, height: 5, borderRadius: 3, background: i === current ? "#c9922a" : "rgba(160,100,30,0.25)", transition: "all 0.2s" }} />
        ))}
      </div>
      <button
        onClick={onNext} disabled={current >= total - 1}
        style={{ width: 22, height: 22, borderRadius: "50%", border: "1px solid rgba(160,100,30,0.35)", background: "rgba(160,100,30,0.10)", cursor: current >= total - 1 ? "default" : "pointer", opacity: current >= total - 1 ? 0.28 : 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 0, fontSize: 10, color: "#9b6e18" }}
      >▼</button>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Contenu des pages individuelles
───────────────────────────────────────────── */

function CoverPageContent({ page }: { page: Extract<PageContent, { type: "title" }> }) {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={page.image} alt={page.title}
        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }}
      />
      {/* Bande blanche semi-transparente en bas */}
      <div style={{
        position: "absolute", bottom: "8%", left: "6%", right: "6%",
        padding: "clamp(10px,4%,24px) clamp(12px,5%,28px)",
        background: "rgba(255,255,255,0.82)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        borderRadius: "clamp(6px,1.5vw,14px)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
        textAlign: "center",
      }}>
        <p style={{ fontSize: "clamp(7px,1.8vw,11px)", color: "#9a6e1a", letterSpacing: "0.22em", textTransform: "uppercase", margin: "0 0 6px", opacity: 0.9 }}>
          BibleFon
        </p>
        <h1 style={{ fontSize: "clamp(14px,4vw,32px)", fontWeight: 700, color: "#1a1209", fontFamily: "var(--font-serif)", lineHeight: 1.2, margin: "0 0 5px" }}>
          {page.title}
        </h1>
        <p style={{ fontSize: "clamp(7px,1.6vw,11px)", color: "#7a5614", letterSpacing: "0.12em", margin: 0, opacity: 0.85 }}>
          {page.titleFon}
        </p>
      </div>
    </div>
  )
}

function MetaLeftContent({ page }: { page: Extract<PageContent, { type: "meta" }> }) {
  return (
    <div style={{
      width: "100%", height: "100%", background: PAPER_BG,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      gap: "clamp(10px,2.5%,20px)", padding: "clamp(24px,8%,52px)", textAlign: "center", position: "relative",
    }}>
      <PaperGrain />
      <div style={{ fontSize: "clamp(24px,5.5vw,44px)", color: "rgba(160,100,30,0.18)", fontFamily: "var(--font-serif)", lineHeight: 1, zIndex: 4 }}>✦</div>
      <p style={{ fontSize: "clamp(8px,1.6vw,12px)", color: "#b09060", letterSpacing: "0.18em", textTransform: "uppercase", margin: 0, zIndex: 4 }}>Référence biblique</p>
      <p style={{ fontSize: "clamp(14px,3vw,24px)", fontWeight: 700, color: "#5a3010", fontFamily: "var(--font-serif)", lineHeight: 1.3, margin: 0, zIndex: 4 }}>
        {page.reference}
      </p>
      <div style={{ width: 36, height: 1, background: "rgba(160,100,30,0.3)", zIndex: 4 }} />
      <p style={{ fontSize: "clamp(9px,1.9vw,13px)", color: "#8a6a40", lineHeight: 1.75, maxWidth: 320, margin: 0, zIndex: 4 }}>{page.note}</p>
      <div style={{ width: 36, height: 1, background: "rgba(160,100,30,0.3)", zIndex: 4 }} />
      <p style={{ fontSize: "clamp(8px,1.4vw,10px)", color: "#c0a070", letterSpacing: "0.12em", margin: 0, zIndex: 4 }}>BibleFon</p>
    </div>
  )
}

function MetaRightContent({ page }: { page: Extract<PageContent, { type: "meta" }> }) {
  return (
    <div style={{
      width: "100%", height: "100%", background: PAPER_BG_ALT,
      display: "flex", flexDirection: "column", justifyContent: "center",
      gap: "clamp(10px,2.5%,18px)", padding: "clamp(28px,10%,64px) clamp(22px,8%,52px)", position: "relative",
    }}>
      <PaperGrain />
      <p style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(10px,2.2vw,15px)", fontWeight: 700, color: "#5a3010", textTransform: "uppercase", letterSpacing: "0.14em", margin: 0, zIndex: 4 }}>
        Avant de commencer
      </p>
      <div style={{ width: 28, height: 1, background: "rgba(160,100,30,0.35)", zIndex: 4 }} />
      <p style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(10px,2vw,14px)", color: "#3a2010", lineHeight: 1.9, margin: 0, zIndex: 4 }}>
        {page.intro ?? "Dans cette histoire, suis l'aventure page après page. Chaque scène est accompagnée du texte en langue Fon — appuie sur le bouton audio pour l'écouter à tout moment."}
      </p>
      <div style={{ width: 28, height: 1, background: "rgba(160,100,30,0.35)", zIndex: 4 }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4, zIndex: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: "clamp(10px,2vw,14px)" }}>🎧</span>
          <span style={{ fontSize: "clamp(9px,1.7vw,12px)", color: "#7a5a28" }}>Audio disponible en langue Fon</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: "clamp(10px,2vw,14px)" }}>⌨️</span>
          <span style={{ fontSize: "clamp(9px,1.7vw,12px)", color: "#7a5a28" }}>Flèches ← → pour naviguer</span>
        </div>
      </div>
    </div>
  )
}

function ImagePageContent({ src, caption, position = "center" }: { src: string; caption?: string; position?: string }) {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={caption ?? ""} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: position, display: "block" }} />
      {caption && (
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "28px 14px 10px", background: "linear-gradient(to top, rgba(0,0,0,0.48), transparent)" }}>
          <p style={{ fontSize: "clamp(9px,1.6vw,12px)", color: "rgba(255,255,255,0.72)", textAlign: "center", fontStyle: "italic", margin: 0 }}>{caption}</p>
        </div>
      )}
    </div>
  )
}

function DecorativePageContent({ heading }: { heading?: string }) {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: "linear-gradient(160deg, rgba(201,146,42,0.10) 0%, rgba(155,110,24,0.14) 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, padding: "40px 32px",
    }}>
      {heading && (
        <p style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(11px,2.4vw,17px)", fontWeight: 700, color: "#7a4c18", textAlign: "center", textTransform: "uppercase", letterSpacing: "0.1em", lineHeight: 1.4, margin: 0 }}>
          {heading}
        </p>
      )}
      <div style={{ fontSize: "clamp(28px,6vw,48px)", color: "rgba(160,100,30,0.18)", fontFamily: "var(--font-serif)" }}>✦</div>
      <p style={{ fontSize: "clamp(9px,1.6vw,12px)", color: "#b09060", textAlign: "center", letterSpacing: "0.08em" }}>BibleFon</p>
    </div>
  )
}

function TextPageContent({
  body, pageNum, heading,
  lang = "fr",
  fonText,
  fonSegments,
  activeSegIdx,
}: {
  body: string; pageNum: number; heading?: string
  lang?: "fr" | "fon"
  fonText?: string
  fonSegments?: { src: string; fonText: string }[]
  activeSegIdx?: number | null
}) {
  const showFon = lang === "fon"

  const PAD_H = "clamp(14px,4%,28px)"
  const PAD_V = "clamp(14px,4.5%,30px)"

  const headingEl = heading ? (
    <p style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(8px,1.6vw,11px)", fontWeight: 700, color: "#7a4c18", textTransform: "uppercase", letterSpacing: "0.12em", margin: "0 0 10px 0", lineHeight: 1.4, zIndex: 4, flexShrink: 0 }}>
      {heading}
    </p>
  ) : null

  /* Mode Fon avec segments (karaoke) — tous les segments visibles, highlight sur l'actif */
  if (showFon && fonSegments && fonSegments.length > 0) {
    return (
      <div style={{
        width: "100%", height: "100%", background: PAPER_BG,
        display: "flex", flexDirection: "column",
        padding: `${PAD_V} ${PAD_H}`, overflow: "hidden", position: "relative",
      }}>
        <PaperGrain />
        {headingEl}
        <div style={{ display: "flex", flexDirection: "column", gap: "clamp(6px,1.2%,10px)", zIndex: 4 }}>
          {fonSegments.map((seg, idx) =>
            seg.fonText ? (
              <p key={idx} style={{
                fontFamily: "var(--font-serif)", fontSize: "clamp(11px,1.75vw,13px)", lineHeight: 2.05,
                color: "#2a1505", margin: 0,
                padding: "4px 8px 4px 10px", borderRadius: 4,
                background: idx === activeSegIdx ? "rgba(201,146,42,0.28)" : "transparent",
                borderLeft: idx === activeSegIdx ? "3px solid #c9922a" : "3px solid transparent",
                transition: "background 0.35s, border-color 0.35s",
              }}>
                {seg.fonText}
              </p>
            ) : null
          )}
        </div>
      </div>
    )
  }

  /* Mode Fon sans segments (fonText simple) */
  if (showFon && fonText) {
    return (
      <div style={{
        width: "100%", height: "100%", background: PAPER_BG,
        display: "flex", flexDirection: "column",
        padding: `${PAD_V} ${PAD_H}`, overflow: "hidden", position: "relative",
      }}>
        <PaperGrain />
        {headingEl}
        <p style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(11px,1.8vw,13.5px)", lineHeight: 2.05, color: "#2a1505", margin: 0, zIndex: 4 }}>
          {fonText}
        </p>
      </div>
    )
  }

  /* Mode Français (défaut) — texte complet, drop cap si court */
  const isShort = body.length <= 160
  const first = body[0]
  const rest  = body.slice(1)

  return (
    <div style={{
      width: "100%", height: "100%", background: PAPER_BG,
      display: "flex", flexDirection: "column",
      padding: `${PAD_V} ${PAD_H}`, overflow: "hidden", position: "relative",
    }}>
      <PaperGrain />
      {headingEl}
      {isShort ? (
        <p style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(12px,2vw,15px)", lineHeight: 1.95, color: "#2a1505", margin: 0, zIndex: 4 }}>
          <span style={{ float: "left", fontSize: "clamp(3rem,6.5vw,4.8rem)", fontWeight: 700, lineHeight: 0.78, marginRight: "0.06em", marginTop: "0.05em", color: "#1e1005", fontFamily: "var(--font-serif)" }}>
            {first}
          </span>
          {rest}
          <span style={{ clear: "both", display: "table" }} />
        </p>
      ) : (
        <p style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(11px,1.8vw,13.5px)", lineHeight: 2.0, color: "#2a1505", margin: 0, zIndex: 4 }}>
          {body}
        </p>
      )}
    </div>
  )
}

function QuoteLeftContent() {
  return (
    <div style={{
      width: "100%", height: "100%", background: PAPER_BG,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      gap: "clamp(10px,2.5%,20px)", padding: "clamp(24px,8%,52px)", textAlign: "center", position: "relative",
    }}>
      <PaperGrain />
      <div style={{ fontSize: "clamp(64px,13vw,100px)", color: "rgba(160,100,30,0.11)", fontFamily: "var(--font-serif)", lineHeight: 1, zIndex: 4 }}>&ldquo;</div>
      <div style={{ width: 36, height: 1, background: "rgba(160,100,30,0.28)", zIndex: 4 }} />
      <p style={{ fontSize: "clamp(8px,1.5vw,11px)", color: "#b09060", letterSpacing: "0.18em", textTransform: "uppercase", margin: 0, zIndex: 4 }}>La Parole</p>
      <div style={{ width: 36, height: 1, background: "rgba(160,100,30,0.28)", zIndex: 4 }} />
      <p style={{ fontSize: "clamp(8px,1.3vw,10px)", color: "#c0a070", letterSpacing: "0.12em", margin: 0, zIndex: 4 }}>BibleFon</p>
    </div>
  )
}

function QuoteRightContent({ page }: { page: Extract<PageContent, { type: "quote" }> }) {
  return (
    <div style={{
      width: "100%", height: "100%", background: PAPER_BG_ALT,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      gap: "clamp(14px,3%,24px)", padding: "clamp(28px,10%,68px) clamp(24px,8%,52px)", textAlign: "center", position: "relative",
    }}>
      <PaperGrain />
      <blockquote style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(13px,2.6vw,20px)", fontStyle: "italic", color: "#3a2010", lineHeight: 1.9, margin: 0, zIndex: 4 }}>
        {page.verse}
      </blockquote>
      <div style={{ width: 28, height: 1, background: "rgba(160,100,30,0.35)", zIndex: 4 }} />
      <p style={{ fontSize: "clamp(10px,1.9vw,14px)", fontWeight: 600, color: "#9b6e18", letterSpacing: "0.15em", textTransform: "uppercase", margin: 0, zIndex: 4 }}>
        {page.reference}
      </p>
    </div>
  )
}

function BackCoverContent({ book }: { book: Book }) {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: "linear-gradient(175deg, #180c04 0%, #0c0602 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between",
      padding: "clamp(28px,10%,68px) clamp(22px,8%,52px)", textAlign: "center",
    }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <div style={{ fontSize: "clamp(18px,3.8vw,30px)", color: "rgba(201,146,42,0.18)", fontFamily: "var(--font-serif)", lineHeight: 1 }}>✦</div>
        <p style={{ fontSize: "clamp(8px,1.4vw,10px)", color: "#4a3010", letterSpacing: "0.25em", textTransform: "uppercase", margin: 0 }}>BibleFon</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "clamp(14px,3.5%,28px)" }}>
        <div style={{ width: 40, height: 1, background: "rgba(201,146,42,0.2)" }} />
        <p style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(18px,3.8vw,32px)", color: "#e0b554", fontWeight: 700, margin: 0, lineHeight: 1.3 }}>
          {book.title}
        </p>
        <p style={{ fontSize: "clamp(10px,1.9vw,14px)", color: "#6a4a28", lineHeight: 1.85, maxWidth: "90%", margin: 0 }}>
          {book.description}
        </p>
        <div style={{ width: 40, height: 1, background: "rgba(201,146,42,0.2)" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <Link href="/" style={{ fontSize: "clamp(10px,1.7vw,13px)", color: "#9b6e18", textDecoration: "none", letterSpacing: "0.08em", border: "1px solid rgba(160,100,30,0.28)", padding: "8px 24px", borderRadius: 20, display: "inline-block" }}>
          ← Retour à la bibliothèque
        </Link>
        <p style={{ fontSize: "clamp(8px,1.2vw,10px)", color: "#3a2508", letterSpacing: "0.15em", textTransform: "uppercase", margin: 0 }}>
          Histoires bibliques en langue Fon
        </p>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Flat page entries
   Turn.js reçoit des divs individuels (1 page par div),
   on render le contenu React dedans via createRoot.
───────────────────────────────────────────── */

type FlatEntry = {
  content:     React.ReactNode
  allPagesIdx: number
}

function buildFlatPages(
  allPages: AnyPage[], book: Book,
  lang: "fr" | "fon" = "fr",
  hlPageIdx: number | null = null,
  hlSegIdx: number | null = null,
): FlatEntry[] {
  const entries: FlatEntry[] = []
  let pageNum = 1

  for (let i = 0; i < allPages.length; i++) {
    const page = allPages[i]

    if (page.type === "title") {
      entries.push({ content: <CoverPageContent page={page} />, allPagesIdx: i })

    } else if (page.type === "back-cover") {
      entries.push({ content: <BackCoverContent book={book} />, allPagesIdx: i })

    } else if (page.type === "meta") {
      entries.push({ content: <MetaLeftContent  page={page} />, allPagesIdx: i })
      entries.push({ content: <MetaRightContent page={page} />, allPagesIdx: i })

    } else if (page.type === "mixed") {
      entries.push({ content: <ImagePageContent src={page.image} caption={page.caption} position={page.imgPosition} />, allPagesIdx: i })
      entries.push({
        content: <TextPageContent
          body={page.body} pageNum={pageNum++}
          lang={lang} fonText={page.fonText}
          fonSegments={page.audioFiles}
          activeSegIdx={hlPageIdx === i ? hlSegIdx : null}
        />,
        allPagesIdx: i,
      })

    } else if (page.type === "text") {
      entries.push({
        content: page.image
          ? <ImagePageContent src={page.image} position={page.imgPosition} />
          : <div style={{ width: "100%", height: "100%", background: PAPER_BG, position: "relative" }}><PaperGrain /></div>,
        allPagesIdx: i,
      })
      entries.push({
        content: <TextPageContent
          body={page.body} pageNum={pageNum++} heading={page.image ? page.heading : undefined}
          lang={lang} fonText={page.fonText}
          fonSegments={page.audioFiles}
          activeSegIdx={hlPageIdx === i ? hlSegIdx : null}
        />,
        allPagesIdx: i,
      })

    } else if (page.type === "quote") {
      entries.push({ content: <QuoteLeftContent />,              allPagesIdx: i })
      entries.push({ content: <QuoteRightContent page={page} />, allPagesIdx: i })

    } else if (page.type === "image") {
      entries.push({ content: <ImagePageContent src={page.src} />, allPagesIdx: i })
      entries.push({ content: <div style={{ background: PAPER_BG, width: "100%", height: "100%" }} />, allPagesIdx: i })
    }
  }

  return entries
}

/* ─────────────────────────────────────────────
   Mobile detection
───────────────────────────────────────────── */

function useIsMobile(): boolean {
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])
  return mobile
}

/* ─────────────────────────────────────────────
   MobileTextBlock — texte paginé dans une carte mobile
───────────────────────────────────────────── */

function MobileTextBlock({ text, audioEl }: { text: string; audioEl?: React.ReactNode }) {
  const chunks = useMemo(() => splitText(text), [text])
  const [idx, setIdx] = useState(0)
  const hasNav = chunks.length > 1
  return (
    <div>
      <p style={{ fontFamily: "var(--font-serif)", fontSize: 15, color: "#2a1a08", lineHeight: 1.85, margin: 0 }}>
        {chunks[idx]}
      </p>
      {(hasNav || audioEl) && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: hasNav ? "space-between" : "flex-start", marginTop: 8, gap: 8 }}>
          {hasNav ? (
            <SubPageNav
              total={chunks.length} current={idx}
              onPrev={() => setIdx(i => Math.max(0, i - 1))}
              onNext={() => setIdx(i => Math.min(chunks.length - 1, i + 1))}
            />
          ) : <div />}
          {audioEl}
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────
   MobileCard — une page du livre en mode mobile
───────────────────────────────────────────── */

function MobileCard({
  page, book, lang, audio,
}: {
  page: AnyPage; book: Book; lang: "fr" | "fon"; audio: ReturnType<typeof useAudio>
}) {
  const PAD = "20px"
  const CARD_RADIUS = "12px"
  const cardBase: React.CSSProperties = { borderRadius: CARD_RADIUS, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.5)" }

  if (page.type === "back-cover") {
    return (
      <div style={{ ...cardBase, background: "linear-gradient(175deg, #180c04 0%, #0c0602 100%)", padding: PAD, display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center" }}>
        <div style={{ fontSize: 28, color: "rgba(201,146,42,0.25)", fontFamily: "var(--font-serif)" }}>✦</div>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: 22, color: "#e0b554", fontWeight: 700, margin: 0, lineHeight: 1.3 }}>{book.title}</p>
        <p style={{ fontSize: 13, color: "#6a4a28", lineHeight: 1.8, margin: 0 }}>{book.description}</p>
        <div style={{ width: 40, height: 1, background: "rgba(201,146,42,0.2)" }} />
        <Link href="/" style={{ fontSize: 12, color: "#9b6e18", textDecoration: "none", border: "1px solid rgba(160,100,30,0.3)", padding: "8px 20px", borderRadius: 20 }}>
          ← Bibliothèque
        </Link>
      </div>
    )
  }

  if (page.type === "title") {
    return (
      <div style={{ ...cardBase, position: "relative", aspectRatio: "2/3" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={page.image} alt={page.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <div style={{ position: "absolute", bottom: "5%", left: "6%", right: "6%", background: "rgba(255,255,255,0.85)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
          <p style={{ fontSize: 10, color: "#9a6e1a", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 5px" }}>BibleFon</p>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1a1209", fontFamily: "var(--font-serif)", lineHeight: 1.2, margin: "0 0 4px" }}>{page.title}</h1>
          <p style={{ fontSize: 11, color: "#7a5614", letterSpacing: "0.1em", margin: 0 }}>{page.titleFon}</p>
        </div>
      </div>
    )
  }

  if (page.type === "meta") {
    return (
      <div style={{ ...cardBase, background: PAPER_BG, padding: PAD, position: "relative" }}>
        <PaperGrain />
        <div style={{ position: "relative", zIndex: 4, display: "flex", flexDirection: "column", gap: 12 }}>
          <p style={{ fontSize: 10, color: "#9b6e18", letterSpacing: "0.2em", textTransform: "uppercase", margin: 0 }}>{page.reference}</p>
          <div style={{ width: 28, height: 1, background: "rgba(160,100,30,0.35)" }} />
          <p style={{ fontFamily: "var(--font-serif)", fontSize: 14, color: "#3a2010", lineHeight: 1.85, margin: 0 }}>
            {page.intro ?? "Suis l'histoire page après page, avec audio en langue Fon."}
          </p>
          <p style={{ fontSize: 11, color: "#7a5a28", margin: 0, fontStyle: "italic" }}>{page.note}</p>
        </div>
      </div>
    )
  }

  if (page.type === "mixed") {
    const audioFiles = page.audioFiles
    const hasAudio = !!(audioFiles?.length || page.fonText)
    const text = lang === "fon" ? (page.fonText ?? page.body) : page.body
    return (
      <div style={{ ...cardBase, background: PAPER_BG, position: "relative" }}>
        <PaperGrain />
        {/* Image */}
        <div style={{ position: "relative", width: "100%", aspectRatio: "4/3", overflow: "hidden" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={page.image} alt={page.caption} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: page.imgPosition ?? "center", display: "block" }} />
          {page.caption && (
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "24px 14px 10px", background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent)" }}>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", textAlign: "center", fontStyle: "italic", margin: 0 }}>{page.caption}</p>
            </div>
          )}
        </div>
        {/* Text */}
        <div style={{ padding: PAD, position: "relative", zIndex: 4 }}>
          <MobileTextBlock
            text={text}
            audioEl={hasAudio ? (
              <button
                onClick={() => {
                  if (audio.playing) { audio.toggle(); return }
                  if (audioFiles?.length) { audio.playFiles(audioFiles); return }
                  if (page.fonText) audio.speak(page.fonText)
                }}
                style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 20, border: "1px solid rgba(201,146,42,0.4)", background: audio.playing ? "rgba(201,146,42,0.18)" : "rgba(201,146,42,0.08)", color: "#9b6e18", fontSize: 11, cursor: "pointer" }}
              >
                {audio.playing ? <VolumeX size={12} /> : <Volume2 size={12} />}
                <span>{audio.playing ? "Pause" : "Fon"}</span>
              </button>
            ) : undefined}
          />
        </div>
      </div>
    )
  }

  if (page.type === "text") {
    const audioFiles = page.audioFiles
    const hasAudio = !!(audioFiles?.length || page.fonText)
    const text = lang === "fon" ? (page.fonText ?? page.body) : page.body
    return (
      <div style={{ ...cardBase, background: PAPER_BG, position: "relative" }}>
        <PaperGrain />
        {/* Image en haut si disponible */}
        {page.image && (
          <div style={{ position: "relative", width: "100%", aspectRatio: "4/3", overflow: "hidden" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={page.image} alt={page.heading ?? ""} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: page.imgPosition ?? "center", display: "block" }} />
          </div>
        )}
        <div style={{ padding: PAD, position: "relative", zIndex: 4, display: "flex", flexDirection: "column", gap: 10 }}>
          {page.heading && (
            <p style={{ fontFamily: "var(--font-serif)", fontSize: 12, fontWeight: 700, color: "#7a4c18", textTransform: "uppercase", letterSpacing: "0.12em", margin: 0 }}>{page.heading}</p>
          )}
          <MobileTextBlock
            text={text}
            audioEl={hasAudio ? (
              <button
                onClick={() => {
                  if (audio.playing) { audio.toggle(); return }
                  if (audioFiles?.length) { audio.playFiles(audioFiles); return }
                  if (page.fonText) audio.speak(page.fonText)
                }}
                style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 20, border: "1px solid rgba(201,146,42,0.4)", background: audio.playing ? "rgba(201,146,42,0.18)" : "rgba(201,146,42,0.08)", color: "#9b6e18", fontSize: 11, cursor: "pointer" }}
              >
                {audio.playing ? <VolumeX size={12} /> : <Volume2 size={12} />}
                <span>{audio.playing ? "Pause" : "Fon"}</span>
              </button>
            ) : undefined}
          />
        </div>
      </div>
    )
  }

  if (page.type === "quote") {
    const text = lang === "fon" ? (page.fonText ?? page.verse) : page.verse
    return (
      <div style={{ ...cardBase, background: PAPER_BG_ALT, padding: "32px 24px", position: "relative", textAlign: "center" }}>
        <PaperGrain />
        <div style={{ position: "relative", zIndex: 4, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <div style={{ fontSize: 48, color: "rgba(160,100,30,0.14)", fontFamily: "var(--font-serif)", lineHeight: 1 }}>&ldquo;</div>
          <blockquote style={{ fontFamily: "var(--font-serif)", fontSize: 16, fontStyle: "italic", color: "#3a2010", lineHeight: 1.85, margin: 0 }}>{text}</blockquote>
          <div style={{ width: 28, height: 1, background: "rgba(160,100,30,0.35)" }} />
          {page.reference && (
            <p style={{ fontSize: 13, fontWeight: 600, color: "#9b6e18", letterSpacing: "0.12em", textTransform: "uppercase", margin: 0 }}>{page.reference}</p>
          )}
        </div>
      </div>
    )
  }

  return null
}

/* ─────────────────────────────────────────────
   MobileReader — lecteur vertical pour mobile
───────────────────────────────────────────── */

function MobileReader({ book }: { book: Book }) {
  const audio = useAudio()
  const [lang, setLang] = useState<"fr" | "fon">("fr")
  const allPages = [...book.pages, { type: "back-cover" as const }] as AnyPage[]

  return (
    <div className="reader-bg" style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      {/* Toolbar sticky */}
      <header style={{
        position: "sticky", top: 0, zIndex: 10,
        background: "rgba(20,13,6,0.94)", backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(201,146,42,0.15)",
        padding: "10px 16px", display: "flex", alignItems: "center", gap: 10, flexShrink: 0,
      }}>
        <Link
          href="/"
          style={{ display: "flex", alignItems: "center", color: "rgba(255,255,255,0.45)", textDecoration: "none" }}
        >
          <ArrowLeft size={18} />
        </Link>
        <div style={{ width: 1, height: 16, background: "rgba(255,255,255,0.1)" }} />
        <p style={{ flex: 1, margin: 0, fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.85)", fontFamily: "var(--font-serif)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {book.title}
        </p>
        {/* Toggle FR/FON */}
        <button
          onClick={() => setLang(l => l === "fr" ? "fon" : "fr")}
          style={{
            display: "flex", alignItems: "center", gap: 0,
            borderRadius: 20, overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.15)",
            fontSize: 10, fontWeight: 700, letterSpacing: "0.06em",
            cursor: "pointer", flexShrink: 0,
          }}
        >
          <span style={{ padding: "5px 10px", background: lang === "fr" ? "rgba(201,146,42,0.85)" : "rgba(255,255,255,0.06)", color: lang === "fr" ? "#1a0e00" : "rgba(255,255,255,0.35)", transition: "all 0.2s" }}>FR</span>
          <span style={{ padding: "5px 10px", background: lang === "fon" ? "rgba(201,146,42,0.85)" : "rgba(255,255,255,0.06)", color: lang === "fon" ? "#1a0e00" : "rgba(255,255,255,0.35)", transition: "all 0.2s" }}>FON</span>
        </button>
      </header>

      {/* Pages empilées */}
      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 20, maxWidth: 520, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
        {allPages.map((page, i) => (
          <MobileCard key={i} page={page} book={book} lang={lang} audio={audio} />
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Main StoryReader
───────────────────────────────────────────── */

export function StoryReader({ book }: { book: Book }) {
  const isMobile = useIsMobile()

  /* ── State ── */
  const [turnPage,    setTurnPage]    = useState(1)   // page Turn.js (1-indexed)
  const [settledPage, setSettledPage] = useState(1)   // page après fin d'animation (pour le shift)
  const [spreadSize,  setSpreadSize]  = useState({ w: 0, h: 0 })
  const [lang,        setLang]        = useState<"fr" | "fon">("fr")
  const [bookReady,   setBookReady]   = useState(false) // true après init Turn.js (évite le flash)

  /* ── Refs ── */
  const stageRef    = useRef<HTMLDivElement>(null)
  const flipbookRef = useRef<HTMLDivElement>(null)
  const rootsRef    = useRef<Root[]>([])
  const initDone    = useRef(false)

  /* ── Data ── */
  const audio       = useAudio()
  const allPages    = [...book.pages, { type: "back-cover" as const }] as AnyPage[]
  const flatEntries = buildFlatPages(allPages, book)
  const totalFlat   = flatEntries.length

  /* ── Page courante pour l'audio ── */
  const currentAllPagesIdx = flatEntries[turnPage - 1]?.allPagesIdx ?? 0
  const currentPage        = allPages[currentAllPagesIdx]
  const currentFon =
    currentPage && "fonText" in currentPage
      ? (currentPage as { fonText?: string }).fonText ?? null
      : null
  const currentAudioFiles =
    currentPage && "audioFiles" in currentPage
      ? (currentPage as { audioFiles?: { src: string; fonText: string }[] }).audioFiles ?? null
      : null

  /* ── Re-render des pages Turn.js quand lang ou segment actif change ── */
  useEffect(() => {
    if (!initDone.current || rootsRef.current.length === 0) return
    const entries = buildFlatPages(allPages, book, lang, currentAllPagesIdx, audio.currentSegIdx)
    entries.forEach((entry, i) => { rootsRef.current[i]?.render(entry.content) })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, audio.currentSegIdx, currentAllPagesIdx])

  /* ── Calcul des dimensions (ResizeObserver) ── */
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    const update = () => {
      /* Espace disponible : largeur complète moins ~130px pour les boutons */
      const aw = stage.clientWidth  - 130
      const ah = stage.clientHeight - 20
      /* Rapport spread 21:11 */
      const w = Math.min(aw, ah * 21 / 11, 1200)
      const h = w * 11 / 21
      setSpreadSize({ w: Math.max(300, Math.round(w)), h: Math.max(160, Math.round(h)) })
    }

    update()
    const obs = new ResizeObserver(update)
    obs.observe(stage)
    return () => obs.disconnect()
  }, [])

  /* ── Initialisation Turn.js (une seule fois quand les dimensions sont connues) ── */
  useEffect(() => {
    if (spreadSize.w === 0 || initDone.current || !flipbookRef.current) return
    initDone.current = true

    let mounted = true

    ;(async () => {
      try {
        await loadScript(CDN_JQUERY, CDN_JQUERY_SRI)
        await loadScript(CDN_TURNJS, CDN_TURNJS_SRI)
        if (!mounted || !flipbookRef.current) return

        const fb = flipbookRef.current
        const pageW = Math.round(spreadSize.w / 2)
        const pageH = spreadSize.h
        const bookW = pageW * 2

        /* Détruire une instance précédente si nécessaire */
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if ((window as any).jQuery?.(fb).data()?.turn) turnJs(fb).turn("destroy")
        } catch { /* ignore */ }

        /* Vider les roots React précédents */
        rootsRef.current.forEach(r => { try { r.unmount() } catch { /* ignore */ } })
        rootsRef.current = []
        fb.innerHTML = ""

        /* Construire les divs de pages et y rendre le contenu React
           AUCUNE classe "hard" → toutes les pages sont fluides (draggables) */
        flatEntries.forEach(entry => {
          const div = document.createElement("div")
          div.style.cssText = `overflow:hidden;background:transparent;`
          fb.appendChild(div)

          const root = createRoot(div)
          root.render(entry.content)
          rootsRef.current.push(root)
        })

        /* Dimensionner le flipbook */
        fb.style.width  = `${bookW}px`
        fb.style.height = `${pageH}px`

        /* Initialiser Turn.js */
        turnJs(fb).turn({
          width:        bookW,
          height:       pageH,
          display:      "double",
          autoCenter:   false,
          gradients:    true,
          acceleration: true,
          elevation:    50,
          duration:     800,
          when: {
            turned:  (_e: Event, page: number) => {
              if (mounted) { setTurnPage(page); setSettledPage(page); audio.stop() }
            },
            turning: (_e: Event, page: number) => {
              if (mounted) setTurnPage(page)
            },
          },
        })

        /* Révéler le livre après init — évite le flash de pages non positionnées */
        if (mounted) setBookReady(true)

      } catch (err) {
        console.error("Turn.js init error:", err)
      }
    })()

    return () => { mounted = false }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spreadSize.w])

  /* ── Nettoyage au démontage ── */
  useEffect(() => {
    return () => {
      rootsRef.current.forEach(r => { try { r.unmount() } catch { /* ignore */ } })
      try {
        const fb = flipbookRef.current
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (fb && (window as any).jQuery?.(fb).data()?.turn) turnJs(fb).turn("destroy")
      } catch { /* ignore */ }
    }
  }, [])

  /* ── Navigation ── */
  const goNext = useCallback(() => {
    const fb = flipbookRef.current
    if (fb) turnJs(fb).turn("next")
    audio.stop()
  }, [audio])

  const goPrev = useCallback(() => {
    const fb = flipbookRef.current
    if (fb) turnJs(fb).turn("previous")
    audio.stop()
  }, [audio])

  /* ── Clavier ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext()
      if (e.key === "ArrowLeft")  goPrev()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [goNext, goPrev])

  /* ── Audio : fichiers pré-enregistrés ou TTS ── */
  const hasAudio = !!(currentAudioFiles?.length || currentFon)
  const handleSpeak = useCallback(() => {
    if (audio.playing) { audio.toggle(); return }
    if (currentAudioFiles?.length) { audio.playFiles(currentAudioFiles); return }
    if (currentFon) audio.speak(currentFon)
  }, [audio, currentAudioFiles, currentFon])
  const toggleLang = () => setLang(l => l === "fr" ? "fon" : "fr")

  /* ── États des boutons ── */
  const atFirst = turnPage <= 1
  const atLast  = turnPage >= totalFlat

  /* Shift basé sur settledPage (après fin d'animation) :
     la couverture et la 4e se centrent APRÈS le pliage — pas pendant. */
  const pageW      = spreadSize.w > 0 ? Math.round(spreadSize.w / 2) : 0
  const bookShiftX = settledPage === 1        ? -(pageW / 2)
                   : settledPage >= totalFlat ?  (pageW / 2)
                   :                             0

  if (isMobile) return <MobileReader book={book} />

  return (
    <div
      className="reader-bg"
      style={{ height: "100svh", display: "flex", flexDirection: "column", overflow: "hidden" }}
    >

      {/* ── Toolbar ── */}
      <header style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "0 20px", height: 50,
        background: "rgba(0,0,0,0.55)", backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        flexShrink: 0, position: "relative", zIndex: 10,
      }}>
        <Link
          href="/"
          style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.45)", fontSize: 12, textDecoration: "none" }}
          onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
        >
          <ArrowLeft size={15} />
        </Link>

        <div style={{ width: 1, height: 16, background: "rgba(255,255,255,0.1)" }} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.85)", fontFamily: "var(--font-serif)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {book.title}
          </p>
          <p style={{ margin: 0, fontSize: 10, color: "rgba(255,255,255,0.3)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {book.titleFon}
          </p>
        </div>

        {/* Toggle langue FR / FON */}
        <button
          onClick={toggleLang}
          title={lang === "fr" ? "Voir en Fon" : "Voir en Français"}
          style={{
            display: "flex", alignItems: "center", gap: 0,
            borderRadius: 20, overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.15)",
            fontSize: 10, fontWeight: 700, letterSpacing: "0.06em",
            cursor: "pointer",
          }}
        >
          <span style={{ padding: "5px 10px", background: lang === "fr" ? "rgba(201,146,42,0.85)" : "rgba(255,255,255,0.06)", color: lang === "fr" ? "#1a0e00" : "rgba(255,255,255,0.35)", transition: "all 0.2s" }}>FR</span>
          <span style={{ padding: "5px 10px", background: lang === "fon" ? "rgba(201,146,42,0.85)" : "rgba(255,255,255,0.06)", color: lang === "fon" ? "#1a0e00" : "rgba(255,255,255,0.35)", transition: "all 0.2s" }}>FON</span>
        </button>

        {audio.error && (
          <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 20, background: "rgba(220,50,50,0.15)", border: "1px solid rgba(220,50,50,0.3)" }}>
            <AlertCircle size={12} color="#f87171" />
            <span style={{ fontSize: 10, color: "#f87171" }}>Indisponible</span>
          </div>
        )}

        <button
          onClick={handleSpeak}
          disabled={!hasAudio || audio.loading}
          title={audio.playing ? "Pause" : "Écouter en Fon"}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "6px 14px", borderRadius: 20,
            border: `1px solid ${hasAudio ? "rgba(201,146,42,0.4)" : "rgba(255,255,255,0.1)"}`,
            background: hasAudio && audio.playing ? "rgba(201,146,42,0.22)" : "rgba(255,255,255,0.06)",
            color: hasAudio ? "#e0b554" : "rgba(255,255,255,0.25)",
            fontSize: 11, fontWeight: 500,
            cursor: hasAudio ? "pointer" : "not-allowed",
            opacity: audio.loading ? 0.7 : 1, transition: "all 0.2s",
          }}
        >
          {audio.loading ? <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} />
          : audio.playing ? <VolumeX size={13} />
          : <Volume2 size={13} />}
          <span>{audio.loading ? "Chargement…" : audio.playing ? "Pause" : "Écouter en Fon"}</span>
        </button>
      </header>

      {/* ── Book stage ──
          IMPORTANT : pas de overflow:hidden sur le container direct de Turn.js
          (ça couperait l'animation de pliage au-delà du div) */}
      <div
        ref={stageRef}
        style={{
          flex:           1,
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          position:       "relative",
          /* overflow intentionnellement omis — Turn.js en a besoin */
        }}
      >
        {/* Bouton précédent */}
        <button
          onClick={goPrev}
          disabled={atFirst}
          aria-label="Page précédente"
          style={{
            position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", zIndex: 20,
            width: 40, height: 40, borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.55)", display: "flex", alignItems: "center", justifyContent: "center",
            cursor: atFirst ? "not-allowed" : "pointer", opacity: atFirst ? 0.2 : 1, transition: "all 0.2s",
          }}
          onMouseEnter={e => { if (!atFirst) (e.currentTarget.style.background = "rgba(255,255,255,0.16)") }}
          onMouseLeave={e => {               (e.currentTarget.style.background = "rgba(255,255,255,0.08)") }}
        >
          <ChevronLeft size={18} />
        </button>

        {/* ── Turn.js container ──
            Le wrapper gère le shift couverture/4e de couverture.
            opacity:0 jusqu'à bookReady → évite le flash au chargement. */}
        <div style={{
          transform:  `translateX(${bookShiftX}px)`,
          transition: "transform 0.8s ease",
        }}>
          <div
            ref={flipbookRef}
            className="book-shadow"
            style={{
              position:   "relative",
              opacity:    bookReady ? 1 : 0,
              transition: bookReady ? "opacity 0.25s ease" : "none",
            }}
          />
        </div>

        {/* Bouton suivant */}
        <button
          onClick={goNext}
          disabled={atLast}
          aria-label="Page suivante"
          style={{
            position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", zIndex: 20,
            width: 40, height: 40, borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.55)", display: "flex", alignItems: "center", justifyContent: "center",
            cursor: atLast ? "not-allowed" : "pointer", opacity: atLast ? 0.2 : 1, transition: "all 0.2s",
          }}
          onMouseEnter={e => { if (!atLast) (e.currentTarget.style.background = "rgba(255,255,255,0.16)") }}
          onMouseLeave={e => {              (e.currentTarget.style.background = "rgba(255,255,255,0.08)") }}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* ── Bottom bar ── */}
      <div style={{
        flexShrink: 0, padding: "10px 20px",
        background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", gap: 14,
      }}>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", minWidth: 44 } as React.CSSProperties}>
          {currentAllPagesIdx + 1} / {allPages.length}
        </span>

        <div style={{ flex: 1, height: 2, borderRadius: 1, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: 1, transition: "width 0.4s ease",
            width: `${((currentAllPagesIdx + 1) / allPages.length) * 100}%`,
            background: "linear-gradient(90deg, #9b6e18, #e0b554)",
          }} />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {Array.from({ length: Math.min(allPages.length, 12) }, (_, i) => {
            const target   = Math.round((i / Math.max(Math.min(allPages.length, 12) - 1, 1)) * (allPages.length - 1))
            const isActive = target === currentAllPagesIdx
            const targetFlat = flatEntries.findIndex(e => e.allPagesIdx === target)
            return (
              <button
                key={i}
                onClick={() => {
                  if (targetFlat >= 0) {
                    const fb = flipbookRef.current
                    if (fb) turnJs(fb).turn("page", targetFlat + 1)
                    setTurnPage(targetFlat + 1)
                    audio.stop()
                  }
                }}
                aria-label={`Page ${target + 1}`}
                style={{
                  width: isActive ? 18 : 6, height: 6, borderRadius: 3, border: "none",
                  background: isActive ? "linear-gradient(90deg,#9b6e18,#e0b554)" : "rgba(255,255,255,0.2)",
                  cursor: "pointer", transition: "all 0.25s", padding: 0,
                }}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
