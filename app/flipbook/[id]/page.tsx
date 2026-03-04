import { notFound } from "next/navigation"
import { getBookById } from "@/lib/books"
import { ReaderClient } from "./ReaderClient"
import type { Metadata } from "next"

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const book = getBookById(id)
  if (!book) return { title: "Livre introuvable" }
  return {
    title: `${book.title} — BibleFon`,
    description: book.description,
  }
}

export default async function ReaderPage({ params }: PageProps) {
  const { id } = await params
  const book = getBookById(id)

  if (!book) notFound()

  return <ReaderClient book={book} />
}
