import { Github, Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "À propos — BibleFon",
  description:
    "BibleFon : qui l'a fait, pourquoi, et ce que ce projet représente pour les langues locales en Afrique.",
}

export default function AboutPage() {
  return (
    <main className="min-h-screen" style={{ background: "var(--background)" }}>

      {/* Nav */}
      <div className="max-w-2xl mx-auto px-6 pt-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm transition-colors duration-200"
          style={{ color: "var(--muted-foreground)" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la bibliothèque
        </Link>
      </div>

      {/* Content */}
      <article className="max-w-2xl mx-auto px-6 pt-14 pb-24 space-y-16">

        {/* Header */}
        <header className="space-y-5">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
            style={{
              background: "rgba(201,146,42,0.10)",
              border: "1px solid rgba(201,146,42,0.25)",
              color: "var(--gold-light)",
            }}
          >
            🇧🇯 À propos du projet
          </div>
          <h1
            className="text-4xl md:text-5xl font-bold leading-tight"
            style={{ fontFamily: "var(--font-serif)", color: "var(--foreground)" }}
          >
            Pourquoi BibleFon existe
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
            Le numérique parle à des gens qui savent lire, qui maîtrisent une langue dominante,
            qui ont une connexion stable. Ce n'est pas tout le monde.
          </p>
        </header>

        <Divider />

        {/* Section 1 — Le constat */}
        <section className="space-y-5">
          <h2 className="text-xl font-semibold" style={{ color: "var(--foreground)" }}>
            Le constat
          </h2>
          <div className="space-y-4 text-base leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
            <p>
              La langue fon est parlée par plusieurs millions de personnes au Bénin et dans les pays
              voisins. C'est une langue orale, vivante, portée par une culture riche. Mais elle est
              presque absente du numérique — en particulier pour les enfants.
            </p>
            <p>
              Selon l'UNESCO, près de{" "}
              <span style={{ color: "var(--foreground)" }}>
                500 millions d'adultes en Afrique subsaharienne
              </span>{" "}
              sont en situation d'analphabétisme fonctionnel. Ces personnes ne sont pas exclues du
              numérique par manque d'intérêt ou de capacité. Elles en sont exclues{" "}
              <span style={{ color: "var(--foreground)" }}>par conception</span>.
            </p>
            <p>
              Une traduction écrite ne suffit pas dans des contextes où l'écrit lui-même est une barrière.
              Ce qu'il faut, c'est de l'oral. Du son. Des images. Des formats qui parlent à des gens
              qui communiquent oralement depuis des générations.
            </p>
          </div>

          {/* Pull quote */}
          <blockquote
            className="my-8 pl-5 py-1 text-base italic leading-relaxed"
            style={{
              borderLeft: "3px solid var(--gold-dark)",
              color: "var(--foreground)",
              fontFamily: "var(--font-serif)",
            }}
          >
            Comment le numérique peut-il prétendre transformer le monde s'il reproduit
            les mêmes inégalités que le monde analogique ?
          </blockquote>
        </section>

        <Divider />

        {/* Section 2 — Ce qu'est BibleFon */}
        <section className="space-y-5">
          <h2 className="text-xl font-semibold" style={{ color: "var(--foreground)" }}>
            Ce qu'est BibleFon
          </h2>
          <div className="space-y-4 text-base leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
            <p>
              BibleFon est un livre numérique animé. On y lit des histoires bibliques — illustrées,
              page par page, dans un format qui se feuillette — et on peut les{" "}
              <span style={{ color: "var(--foreground)" }}>écouter en langue fon</span>.
            </p>
            <p>
              Les illustrations ont été générées par intelligence artificielle, avec un soin particulier
              pour représenter des personnages africains dans un style aquarelle doux et chaleureux.
              La voix qui lit le texte en fon est synthétisée par un modèle développé par Meta
              spécifiquement pour les langues peu dotées.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            {[
              { value: "1 livre", label: "disponible" },
              { value: "20 pages", label: "13 scènes illustrées" },
              { value: "30+ segments", label: "audio en fon" },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="rounded-xl p-4 text-center"
                style={{ background: "var(--card)", border: "1px solid var(--border)" }}
              >
                <p className="text-2xl font-bold mb-1" style={{ color: "var(--gold)" }}>
                  {value}
                </p>
                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </section>

        <Divider />

        {/* Section 3 — Qui */}
        <section className="space-y-5">
          <h2 className="text-xl font-semibold" style={{ color: "var(--foreground)" }}>
            Qui
          </h2>
          <div className="flex gap-6 items-start">
            <Image
              src="/manasse.jpg"
              alt="Manassé A. AKPOVI"
              width={88}
              height={88}
              className="rounded-full shrink-0 object-cover"
              style={{ border: "2px solid var(--border)" }}
            />
            <div className="space-y-4 text-base leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
              <p>
                Je m'appelle{" "}
                <span style={{ color: "var(--foreground)" }}>Manassé A. AKPOVI</span>.
                Je suis béninois. J'ai fait ma licence en génie logiciel à l'IFRI,
                à Cotonou. Puis je suis venu en France, à l'ESGI Paris, pour un bachelor en ingénierie web.
              </p>
              <p>
                BibleFon a démarré lors du hackathon du SENIA, dont le thème était
                «&nbsp;l'IA multimodale au service de nos langues locales&nbsp;». Pour la première fois,
                je ne codais pas pour coder — je travaillais sur quelque chose qui avait du sens
                pour des millions de personnes.
              </p>
            </div>
          </div>
        </section>

        <Divider />

        {/* Section 4 — Ce que je cherche */}
        <section className="space-y-5">
          <h2 className="text-xl font-semibold" style={{ color: "var(--foreground)" }}>
            Ce que je cherche
          </h2>
          <p className="text-base leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
            Des retours de locuteurs fon — si quelque chose sonne faux, je veux le savoir.
            Des partenaires pour distribuer : écoles, associations, organisations travaillant en Afrique de l'Ouest.
            Des collaborateurs pour la suite : traducteurs, développeurs, toute personne qui croit que le numérique
            peut parler à plus de monde qu'il ne le fait aujourd'hui.
          </p>
        </section>

        <Divider />

        {/* Contact */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold" style={{ color: "var(--foreground)" }}>
            Me contacter
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="mailto:akpovimanasse@gmail.com"
              className="inline-flex items-center gap-3 px-5 py-3 rounded-full text-sm font-medium
                transition-all duration-200 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, var(--gold-dark), var(--gold))",
                color: "#0c0804",
              }}
            >
              <Mail className="w-4 h-4" />
              Envoyer un email
            </a>
            <a
              href="https://github.com/AkmaDev"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-5 py-3 rounded-full text-sm font-medium
                border transition-all duration-200 hover:border-white/30 hover:text-white/85"
              style={{
                border: "1px solid var(--border)",
                color: "var(--muted-foreground)",
              }}
            >
              <Github className="w-4 h-4" />
              github.com/AkmaDev
            </a>
          </div>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            Chercheurs, partenaires potentiels, locuteurs fon, curieux — toutes les prises de contact
            sont les bienvenues.
          </p>
        </section>

      </article>

      {/* Footer */}
      <footer className="border-t py-8 px-6" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <Link
            href="/"
            className="font-bold text-sm"
            style={{ fontFamily: "var(--font-serif)", color: "var(--foreground)" }}
          >
            BibleFon
          </Link>
          <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
            Fait avec soin pour les enfants du Bénin et la diaspora africaine 🇧🇯
          </p>
        </div>
      </footer>

    </main>
  )
}

function Divider() {
  return (
    <hr style={{ borderColor: "var(--border)" }} />
  )
}
