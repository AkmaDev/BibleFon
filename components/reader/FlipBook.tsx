"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import HTMLFlipBook from "react-pageflip"
import Image from "next/image"
import type { Book, PageContent } from "@/lib/books"
import { Toolbar } from "./Toolbar"

/* ─────────────────────────────────────────────
   Page components
───────────────────────────────────────────── */

const TitlePage = React.forwardRef<
  HTMLDivElement,
  { page: Extract<PageContent, { type: "title" }> }
>(({ page }, ref) => (
  <div ref={ref} className="book-page" data-density="hard">
    <div className="relative w-full h-full">
      <Image src={page.image} alt={page.title} fill className="object-cover object-top" priority />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
      <div className="absolute bottom-0 left-0 right-0 px-8 pb-10 text-center">
        <p className="text-[11px] font-semibold tracking-[0.15em] uppercase mb-2"
          style={{ color: "#e0b554" }}>
          {page.titleFon}
        </p>
        <h1 className="text-2xl font-bold text-white leading-snug"
          style={{ fontFamily: "var(--font-serif)" }}>
          {page.title}
        </h1>
      </div>
    </div>
  </div>
))
TitlePage.displayName = "TitlePage"

const MetaPage = React.forwardRef<
  HTMLDivElement,
  { page: Extract<PageContent, { type: "meta" }> }
>(({ page }, ref) => (
  <div ref={ref} className="book-page"
    style={{ background: "linear-gradient(160deg, #fdf5e6 0%, #f0e4c8 100%)" }}>
    <div className="flex flex-col items-center justify-center h-full px-8 text-center gap-5">
      <div className="w-8 h-px bg-amber-800/40" />
      <div className="text-3xl text-amber-800/20" style={{ fontFamily: "var(--font-serif)" }}>✦</div>
      <p className="text-sm font-semibold text-amber-900/80"
        style={{ fontFamily: "var(--font-serif)" }}>
        {page.reference}
      </p>
      <p className="text-[11px] text-stone-500 leading-relaxed max-w-[180px]">{page.note}</p>
      <div className="mt-2 flex items-center gap-2 px-3 py-1.5 rounded-full"
        style={{ background: "rgba(180,120,40,0.1)", border: "1px solid rgba(180,120,40,0.2)" }}>
        <span className="text-[10px] text-amber-800/70">🎧 Audio disponible en langue Fon</span>
      </div>
      <div className="w-8 h-px bg-amber-800/40" />
    </div>
  </div>
))
MetaPage.displayName = "MetaPage"

const TextPage = React.forwardRef<
  HTMLDivElement,
  { page: Extract<PageContent, { type: "text" }>; pageNum: number }
>(({ page, pageNum }, ref) => (
  <div ref={ref} className="book-page"
    style={{ background: "linear-gradient(180deg, #fdf5e6 0%, #f8ecd6 100%)" }}>
    <div className="flex flex-col h-full">
      {/* Top rule */}
      <div className="flex items-center gap-2 px-6 pt-5 pb-3">
        <div className="h-px flex-1 bg-amber-800/20" />
        <span className="text-amber-800/30 text-[10px]">✦</span>
        <div className="h-px flex-1 bg-amber-800/20" />
      </div>

      {/* Heading */}
      {page.heading && (
        <h2 className="px-6 pb-3 text-[12px] font-bold text-amber-900/80 text-center uppercase tracking-widest"
          style={{ fontFamily: "var(--font-serif)" }}>
          {page.heading}
        </h2>
      )}

      {/* Body */}
      <div className="flex-1 px-6 overflow-hidden">
        <p className="text-[12.5px] leading-[2.1] text-stone-700"
          style={{ fontFamily: "var(--font-serif)" }}>
          {page.body}
        </p>
      </div>

      {/* Bottom rule + page num */}
      <div className="flex items-center gap-2 px-6 py-3">
        <div className="h-px flex-1 bg-amber-800/20" />
        <span className="text-[9px] text-stone-400 tabular-nums">{pageNum}</span>
        <div className="h-px flex-1 bg-amber-800/20" />
      </div>
    </div>
  </div>
))
TextPage.displayName = "TextPage"

const ImagePage = React.forwardRef<
  HTMLDivElement,
  { page: Extract<PageContent, { type: "image" }> }
>(({ page }, ref) => (
  <div ref={ref} className="book-page">
    <div className="relative w-full h-full">
      <Image src={page.src} alt={page.alt ?? ""} fill className="object-cover object-top" />
    </div>
  </div>
))
ImagePage.displayName = "ImagePage"

/* MixedPage — split 50/50 : image flush + colonne texte (style livre illustré enfant) */
const MixedPage = React.forwardRef<
  HTMLDivElement,
  {
    page: Extract<PageContent, { type: "mixed" }>
    pageNum: number
    floatRight?: boolean   // true = image à droite, false = image à gauche
  }
>(({ page, pageNum, floatRight = false }, ref) => {
  const imgCol = (
    <div style={{ flex: "0 0 48%", position: "relative", overflow: "hidden" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={page.image}
        alt={page.caption}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "top",
          display: "block",
        }}
      />
      {/* Légende discrète en bas de l'image */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "18px 8px 5px",
          background: "linear-gradient(to top, rgba(0,0,0,0.45), transparent)",
        }}
      >
        <p style={{ fontSize: 8, color: "rgba(255,255,255,0.6)", textAlign: "center", fontStyle: "italic", margin: 0 }}>
          {page.caption}
        </p>
      </div>
    </div>
  )

  const textCol = (
    <div
      style={{
        flex: "0 0 52%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "20px 16px",
        background: "linear-gradient(175deg, #fdf5e6 0%, #f6e8cc 100%)",
        overflow: "hidden",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: 12,
          lineHeight: 2,
          color: "#3a2515",
          margin: 0,
          flex: 1,
        }}
      >
        {page.body}
      </p>
      <p style={{ fontSize: 9, color: "#b09060", textAlign: "center", marginTop: 10 }}>
        {pageNum}
      </p>
    </div>
  )

  return (
    <div
      ref={ref}
      className="book-page"
      style={{ display: "flex", flexDirection: "row", overflow: "hidden" }}
    >
      {floatRight ? (
        <>{textCol}{imgCol}</>
      ) : (
        <>{imgCol}{textCol}</>
      )}
    </div>
  )
})
MixedPage.displayName = "MixedPage"

const QuotePage = React.forwardRef<
  HTMLDivElement,
  { page: Extract<PageContent, { type: "quote" }> }
>(({ page }, ref) => (
  <div ref={ref} className="book-page" data-density="hard">
    <div
      className="flex flex-col items-center justify-center h-full px-10 text-center gap-5"
      style={{ background: "linear-gradient(135deg, #fdf5e6 0%, #f0e0c0 100%)" }}
    >
      <div
        className="text-5xl text-amber-800/15"
        style={{ fontFamily: "var(--font-serif)", lineHeight: 1 }}
      >
        &ldquo;
      </div>
      <blockquote
        className="text-[13px] font-medium leading-relaxed text-stone-700 italic"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {page.verse}
      </blockquote>
      <p className="text-[10px] font-semibold tracking-wider uppercase text-amber-800/70">
        {page.reference}
      </p>
      <div className="w-8 h-px bg-amber-800/30" />
      <p className="text-[9px] text-stone-400">BibleFon</p>
    </div>
  </div>
))
QuotePage.displayName = "QuotePage"

/* ─────────────────────────────────────────────
   Page dispatcher
───────────────────────────────────────────── */

const BookPageRenderer = React.forwardRef<
  HTMLDivElement,
  { page: PageContent; index: number }
>(({ page, index }, ref) => {
  if (page.type === "title")  return <TitlePage  ref={ref} page={page} />
  if (page.type === "meta")   return <MetaPage   ref={ref} page={page} />
  if (page.type === "image")  return <ImagePage  ref={ref} page={page} />
  if (page.type === "text")   return <TextPage   ref={ref} page={page} pageNum={index} />
  if (page.type === "mixed")  return <MixedPage  ref={ref} page={page} pageNum={index} floatRight={index % 2 !== 0} />
  if (page.type === "quote")  return <QuotePage  ref={ref} page={page} />
  return <div ref={ref} className="book-page" />
})
BookPageRenderer.displayName = "BookPageRenderer"

/* ─────────────────────────────────────────────
   Audio hook
───────────────────────────────────────────── */

function useAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    setPlaying(false)
  }, [])

  const speak = useCallback(
    async (text: string) => {
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
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        const a = new Audio(url)
        a.onended = () => setPlaying(false)
        a.play()
        audioRef.current = a
        setPlaying(true)
      } catch (e) {
        setError(e instanceof Error ? e.message : "Audio indisponible")
      } finally {
        setLoading(false)
      }
    },
    [stop]
  )

  const toggle = useCallback(() => {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
      setPlaying(false)
    } else {
      audioRef.current.play()
      setPlaying(true)
    }
  }, [playing])

  useEffect(() => () => stop(), [stop])

  return { playing, loading, error, speak, toggle, stop }
}

/* ─────────────────────────────────────────────
   Dimension hook
───────────────────────────────────────────── */

function useBookDimensions() {
  const [dims, setDims] = useState({ pageW: 400, pageH: 560, portrait: false })

  useEffect(() => {
    const calc = () => {
      const vw = window.innerWidth
      const vh = window.innerHeight - 100

      if (vw < 720) {
        const w = Math.min(Math.round(vw * 0.86), 360)
        const h = Math.min(Math.round(w * 1.45), Math.round(vh * 0.86))
        setDims({ pageW: w, pageH: h, portrait: true })
      } else {
        const totalW = Math.min(Math.round(vw * 0.80), 900)
        const pageW = Math.round(totalW / 2)
        const pageH = Math.min(Math.round(pageW * 1.45), Math.round(vh * 0.88))
        setDims({ pageW, pageH, portrait: false })
      }
    }
    calc()
    window.addEventListener("resize", calc)
    return () => window.removeEventListener("resize", calc)
  }, [])

  return dims
}

/* ─────────────────────────────────────────────
   Main FlipBook
───────────────────────────────────────────── */

export function FlipBook({ book }: { book: Book }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const flipRef = useRef<any>(null)
  const [pageIndex, setPageIndex] = useState(0)
  const dims = useBookDimensions()
  const audio = useAudio()
  const total = book.pages.length

  /* react-pageflip exposes its API via .pageFlip() on the ref */
  const getFlip = useCallback(() => flipRef.current?.pageFlip?.() ?? null, [])
  const goNext  = useCallback(() => getFlip()?.flipNext(), [getFlip])
  const goPrev  = useCallback(() => getFlip()?.flipPrev(), [getFlip])
  const goTo    = useCallback((n: number) => getFlip()?.flip(n), [getFlip])

  /* Keyboard navigation */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext()
      if (e.key === "ArrowLeft")  goPrev()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [goNext, goPrev])

  /* Stop audio when page changes */
  useEffect(() => {
    audio.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex])

  /* Current page TTS text */
  const currentPage = book.pages[pageIndex]
  const currentFon =
    currentPage && "fonText" in currentPage
      ? (currentPage as { fonText?: string }).fonText ?? null
      : null

  const handleSpeak = () => {
    if (!currentFon) return
    if (audio.playing) { audio.toggle(); return }
    audio.speak(currentFon)
  }

  /* Dots */
  const DOT_COUNT = Math.min(total, 12)
  const dots = Array.from({ length: DOT_COUNT }, (_, i) =>
    Math.round((i / Math.max(DOT_COUNT - 1, 1)) * (total - 1))
  )

  const isAtStart = pageIndex === 0
  const isAtEnd   = dims.portrait ? pageIndex >= total - 1 : pageIndex >= total - 2

  return (
    <div className="flex flex-col h-screen reader-bg overflow-hidden select-none">

      {/* Toolbar */}
      <Toolbar
        title={book.title}
        titleFon={book.titleFon}
        pageIndex={pageIndex}
        total={total}
        hasFonText={!!currentFon}
        audioPlaying={audio.playing}
        audioLoading={audio.loading}
        audioError={audio.error}
        onSpeak={handleSpeak}
      />

      {/* Book stage */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">

        {/* Prev */}
        <button
          type="button"
          onClick={goPrev}
          disabled={isAtStart}
          aria-label="Page précédente"
          className="absolute left-2 md:left-5 z-20 w-9 h-9 rounded-full
            flex items-center justify-center
            bg-white/8 border border-white/12 text-white/50
            hover:bg-white/18 hover:text-white hover:border-white/25
            disabled:opacity-20 disabled:cursor-not-allowed
            transition-all duration-200"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
            className="w-4 h-4">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        {/* Book */}
        <div className="book-shadow">
          <HTMLFlipBook
            ref={flipRef}
            width={dims.pageW}
            height={dims.pageH}
            size="fixed"
            minWidth={150}
            maxWidth={900}
            minHeight={200}
            maxHeight={1400}
            maxShadowOpacity={0.45}
            showCover={true}
            usePortrait={dims.portrait}
            mobileScrollSupport={false}
            onFlip={(e) => setPageIndex(e.data)}
            startPage={0}
            drawShadow={true}
            flippingTime={650}
            startZIndex={0}
            autoSize={false}
            clickEventForward={true}
            useMouseEvents={true}
            swipeDistance={30}
            showPageCorners={true}
            disableFlipByClick={false}
            style={{}}
            className=""
          >
            {book.pages.map((page, i) => (
              <BookPageRenderer key={i} page={page} index={i} />
            ))}
          </HTMLFlipBook>
        </div>

        {/* Next */}
        <button
          type="button"
          onClick={goNext}
          disabled={isAtEnd}
          aria-label="Page suivante"
          className="absolute right-2 md:right-5 z-20 w-9 h-9 rounded-full
            flex items-center justify-center
            bg-white/8 border border-white/12 text-white/50
            hover:bg-white/18 hover:text-white hover:border-white/25
            disabled:opacity-20 disabled:cursor-not-allowed
            transition-all duration-200"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
            className="w-4 h-4">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Bottom bar */}
      <div className="shrink-0 px-4 md:px-8 py-2.5 bg-black/50 backdrop-blur-sm border-t border-white/6">
        <div className="max-w-xl mx-auto flex items-center gap-4">

          <span className="text-[11px] text-white/35 tabular-nums min-w-[44px]">
            {pageIndex + 1} / {total}
          </span>

          <div className="flex-1 h-0.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${((pageIndex + 1) / total) * 100}%`,
                background: "linear-gradient(90deg, #9b6e18, #e0b554)",
              }}
            />
          </div>

          {/* Dots navigation */}
          <div className="flex items-center gap-1.5">
            {dots.map((targetPage, i) => {
              const isActive = targetPage === pageIndex
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(targetPage)}
                  aria-label={`Page ${targetPage + 1}`}
                  className="rounded-full transition-all duration-200"
                  style={{
                    width:      isActive ? 16 : 6,
                    height:     6,
                    background: isActive
                      ? "linear-gradient(90deg, #9b6e18, #e0b554)"
                      : "rgba(255,255,255,0.2)",
                    cursor: "pointer",
                  }}
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
