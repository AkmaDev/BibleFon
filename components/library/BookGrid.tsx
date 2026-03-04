import { books } from "@/lib/books"
import { BookCard } from "./BookCard"

export function BookGrid() {
  return (
    <section className="px-4 pb-24">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium tracking-widest uppercase mb-4"
            style={{ background: "rgba(201,146,42,0.12)", color: "var(--gold)", border: "1px solid rgba(201,146,42,0.25)" }}
          >
            Bibliothèque
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] font-[var(--font-serif)]">
            Choisissez une histoire
          </h2>
          <p className="mt-3 text-[var(--muted-foreground)] max-w-md mx-auto">
            Chaque livre peut être lu en silence ou écouté en langue fon grâce à la synthèse vocale.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book, i) => (
            <BookCard key={book.id} book={book} index={i} />
          ))}
        </div>

        {/* More coming soon */}
        <div className="mt-8 text-center">
          <p className="text-sm text-[var(--muted-foreground)]">
            D&apos;autres histoires arrivent bientôt ·
            <span className="ml-1" style={{ color: "var(--gold)" }}>
              Abraham · Ruth · Marie · Jonas
            </span>
          </p>
        </div>
      </div>
    </section>
  )
}
