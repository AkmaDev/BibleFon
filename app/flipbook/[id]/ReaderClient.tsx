"use client"

import dynamic from "next/dynamic"
import type { Book } from "@/lib/books"

// Load StoryReader only client-side (uses browser APIs)
const StoryReader = dynamic(
  () => import("@/components/reader/StoryReader").then((m) => ({ default: m.StoryReader })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen items-center justify-center reader-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: "var(--gold) transparent var(--gold) var(--gold)" }} />
          <p className="text-sm" style={{ color: "var(--gold)" }}>
            Ouverture du livre…
          </p>
        </div>
      </div>
    ),
  }
)

export function ReaderClient({ book }: { book: Book }) {
  return <StoryReader book={book} />
}
