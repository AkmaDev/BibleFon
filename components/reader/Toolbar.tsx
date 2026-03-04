"use client"

import Link from "next/link"
import { ArrowLeft, Volume2, VolumeX, Loader2, AlertCircle } from "lucide-react"

interface ToolbarProps {
  title: string
  titleFon: string
  pageIndex: number
  total: number
  hasFonText: boolean
  audioPlaying: boolean
  audioLoading: boolean
  audioError: string | null
  onSpeak: () => void
}

export function Toolbar({
  title,
  titleFon,
  hasFonText,
  audioPlaying,
  audioLoading,
  audioError,
  onSpeak,
}: ToolbarProps) {
  return (
    <header
      className="shrink-0 flex items-center gap-3 px-4 md:px-6 py-0
        bg-black/60 backdrop-blur-md border-b border-white/8"
      style={{ height: 52 }}
    >
      {/* Back */}
      <Link
        href="/"
        className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white/80
          transition-colors duration-200 shrink-0"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Bibliothèque</span>
      </Link>

      {/* Divider */}
      <div className="w-px h-4 bg-white/10" />

      {/* Title */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white/85 truncate leading-none mb-0.5"
          style={{ fontFamily: "var(--font-serif)" }}>
          {title}
        </p>
        <p className="text-[10px] text-white/35 truncate leading-none">{titleFon}</p>
      </div>

      {/* TTS button */}
      <div className="flex items-center gap-2 shrink-0">
        {audioError && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/15 border border-red-500/30">
            <AlertCircle className="w-3 h-3 text-red-400" />
            <span className="text-[10px] text-red-400 hidden sm:inline">Indisponible</span>
          </div>
        )}

        <button
          onClick={onSpeak}
          disabled={!hasFonText || audioLoading}
          title={
            !hasFonText
              ? "Pas de texte Fon pour cette page"
              : audioPlaying
              ? "Mettre en pause"
              : "Écouter en Fon"
          }
          className="relative flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium
            transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            background: hasFonText && !audioLoading
              ? audioPlaying
                ? "rgba(201,146,42,0.25)"
                : "rgba(201,146,42,0.12)"
              : "rgba(255,255,255,0.06)",
            border: `1px solid ${
              hasFonText && !audioLoading
                ? audioPlaying
                  ? "rgba(201,146,42,0.5)"
                  : "rgba(201,146,42,0.25)"
                : "rgba(255,255,255,0.1)"
            }`,
            color: hasFonText && !audioLoading ? "var(--gold-light)" : "rgba(255,255,255,0.3)",
          }}
        >
          {audioLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : audioPlaying ? (
            <VolumeX className="w-3.5 h-3.5" />
          ) : (
            <Volume2 className="w-3.5 h-3.5" />
          )}
          <span className="hidden sm:inline">
            {audioLoading ? "Chargement…" : audioPlaying ? "Pause" : "Écouter en Fon"}
          </span>

          {/* pulse ring when playing */}
          {audioPlaying && (
            <span className="absolute -inset-0.5 rounded-full animate-ping opacity-20"
              style={{ background: "var(--gold)" }} />
          )}
        </button>
      </div>
    </header>
  )
}
