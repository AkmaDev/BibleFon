import Image from "next/image"
import Link from "next/link"
import { BookGrid } from "@/components/library/BookGrid"
import { Volume2, BookOpen, Users } from "lucide-react"

const features = [
  { icon: Volume2, label: "Audio en Fon", desc: "Chaque histoire lue à voix haute en langue fon grâce à l'IA de Meta." },
  { icon: BookOpen, label: "Illustrées", desc: "Des images générées par IA pour donner vie aux récits bibliques." },
  { icon: Users, label: "Pour toute la famille", desc: "Des histoires adaptées aux enfants de 4 à 12 ans." },
]

export default function HomePage() {
  return (
    <main className="min-h-screen" style={{ background: "var(--background)" }}>

      {/* ── Hero ── */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden px-4">

        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <Image
            src="/hero.jpg"
            alt="Enfants sous un baobab"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(8,6,4,0.55) 0%, rgba(8,6,4,0.7) 50%, rgba(8,6,4,0.97) 100%)",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-2xl mx-auto text-center space-y-8">

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase animate-fade-in"
            style={{
              background: "rgba(201,146,42,0.12)",
              border: "1px solid rgba(201,146,42,0.3)",
              color: "var(--gold-light)",
            }}>
            🎧 Audio · Illustré · En Langue Fon
          </div>

          {/* Main title */}
          <div className="space-y-3 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-none tracking-tight"
              style={{ fontFamily: "var(--font-serif)" }}>
              Bible<span className="shimmer-text">Fon</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/70 font-light leading-relaxed">
              Histoires bibliques illustrées,{" "}
              <span className="text-white/90 font-medium">racontées en langue fon</span>
            </p>
          </div>

          {/* Subtext */}
          <p className="text-base text-white/50 max-w-md mx-auto leading-relaxed animate-fade-in"
            style={{ animationDelay: "0.2s" }}>
            Pour les enfants du Bénin et de la diaspora — des récits de foi dans leur langue maternelle.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center animate-fade-in"
            style={{ animationDelay: "0.3s" }}>
            <a
              href="#bibliotheque"
              className="px-8 py-3.5 rounded-full font-semibold text-sm transition-all duration-300
                hover:scale-105 hover:shadow-[0_0_30px_rgba(201,146,42,0.4)]"
              style={{
                background: "linear-gradient(135deg, var(--gold-dark), var(--gold))",
                color: "#0c0804",
              }}
            >
              📖 Commencer à lire
            </a>
            <a
              href="#features"
              className="px-8 py-3.5 rounded-full text-sm font-medium text-white/60
                border border-white/15 hover:border-white/30 hover:text-white/85
                transition-all duration-300"
            >
              En savoir plus
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
          <div className="w-px h-8 bg-white/50" />
        </div>
      </section>

      {/* ── Features strip ── */}
      <section id="features" className="py-16 px-4 border-y border-[var(--border)]">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, label, desc }) => (
            <div key={label}
              className="flex flex-col items-center text-center gap-3 p-6 rounded-xl"
              style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: "rgba(201,146,42,0.12)", border: "1px solid rgba(201,146,42,0.2)" }}>
                <Icon className="w-5 h-5" style={{ color: "var(--gold)" }} />
              </div>
              <h3 className="font-semibold text-white text-sm">{label}</h3>
              <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Book grid ── */}
      <section id="bibliotheque" className="pt-16">
        <BookGrid />
      </section>

      {/* ── Footer ── */}
      <footer className="py-10 px-4 border-t border-[var(--border)]">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-[var(--foreground)] text-sm"
              style={{ fontFamily: "var(--font-serif)" }}>
              BibleFon
            </p>
            <p className="text-xs text-[var(--muted-foreground)]">
              Histoires bibliques en langue fon
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 text-xs text-[var(--muted-foreground)]">
            <span>
              Audio propulsé par{" "}
              <a href="https://huggingface.co/facebook/mms-tts-fon"
                target="_blank" rel="noopener noreferrer"
                className="hover:underline"
                style={{ color: "var(--gold-dark)" }}>
                Meta MMS-TTS-FON
              </a>
              {" "}· Illustrations par IA
            </span>
            <span className="hidden sm:inline" style={{ color: "var(--border)" }}>·</span>
            <Link
              href="/about"
              className="hover:underline transition-colors"
              style={{ color: "var(--gold-dark)" }}
            >
              À propos du projet
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
