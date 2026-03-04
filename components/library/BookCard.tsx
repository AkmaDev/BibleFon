"use client"

import Image from "next/image"
import Link from "next/link"
import { Clock, BookOpen, ChevronRight } from "lucide-react"
import type { Book } from "@/lib/books"

interface BookCardProps {
  book: Book
  index: number
}

export function BookCard({ book, index }: BookCardProps) {
  const delay = index * 100

  return (
    <Link
      href={`/flipbook/${book.id}`}
      className="group block"
      style={{ animationDelay: `${delay}ms` }}
    >
      <article
        className="relative flex flex-col overflow-hidden rounded-xl border transition-all duration-500
          bg-[var(--card)] border-[var(--border)]
          hover:border-[var(--gold)]/40 hover:-translate-y-2
          hover:shadow-[0_24px_48px_rgba(0,0,0,0.6),0_0_0_1px_rgba(201,146,42,0.15)]"
      >
        {/* Cover image */}
        <div className="relative aspect-[2/3] w-full overflow-hidden">
          <Image
            src={book.cover}
            alt={book.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={index < 3}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Testament badge */}
          <div
            className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider"
            style={{
              background: `${book.accentColor}22`,
              border: `1px solid ${book.accentColor}55`,
              color: book.accentColor,
            }}
          >
            {book.testament === "ancien" ? "Ancien Testament" : "Nouveau Testament"}
          </div>

          {/* Page count badge */}
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm text-[10px] text-stone-300">
            <BookOpen className="w-3 h-3" />
            {book.pages.length - 1} pages
          </div>

          {/* Bottom title overlay */}
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
            <p
              className="text-xs font-medium mb-1 opacity-80"
              style={{ color: book.accentColor }}
            >
              {book.titleFon}
            </p>
            <h2 className="text-lg font-bold text-white leading-tight font-[var(--font-serif)]">
              {book.title}
            </h2>
          </div>
        </div>

        {/* Card body */}
        <div className="flex flex-col flex-1 px-4 py-4 gap-3">
          <p className="text-sm text-[var(--muted-foreground)] leading-relaxed line-clamp-2">
            {book.description}
          </p>

          <div className="flex items-center justify-between mt-auto pt-2 border-t border-[var(--border)]">
            <div className="flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {book.readingTime}
              </span>
              <span>{book.ageRange}</span>
            </div>

            <div
              className="flex items-center gap-1 text-xs font-semibold transition-all duration-200
                group-hover:gap-2"
              style={{ color: book.accentColor }}
            >
              Lire
              <ChevronRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
