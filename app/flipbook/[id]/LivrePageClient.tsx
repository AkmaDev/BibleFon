// "use client";

// import { useEffect, useState } from "react";
// import { FlipBookViewer } from "@/components/FlipBookViewer";
// import { Book, books } from "@/app/data/books";

// interface LivrePageClientProps {
//   id: string;
// }

// export default function LivrePageClient({ id }: LivrePageClientProps) {
//   const [book, setBook] = useState<Book | null>(null);

//   useEffect(() => {
//     const found = books.find((b) => b.id === id);
//     setBook(found ?? null);
//   }, [id]);

//   if (!book) return <p className="p-4">Livre non trouvé.</p>;

//   return (
//     <main className="max-w-4xl mx-auto p-4">
//       {/* <h1 className="text-3xl font-bold mb-6">{book.title}</h1> */}
//       <FlipBookViewer title={book.title} pages={book.pageContents} />
//     </main>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { FlipBookViewer } from "@/components/FlipBookViewer";
import { books } from "@/app/data/book";
import { LivrePageProps } from "@/components/Dynamic";

interface LivrePageClientProps {
  id: string; // récupéré depuis l'URL ou le route param
}

export default function LivrePageClient({ id }: LivrePageClientProps) {
  const [book, setBook] = useState<LivrePageProps | null>(null);

  useEffect(() => {
    const found = books.find((b) => b.id === id);
    setBook(found ?? null);
  }, [id]);

  if (!book) return <p className="p-4">Livre non trouvé.</p>;

  return (
    // <main className="max-w-4xl mx-auto p-4">
    <FlipBookViewer
      title={book.title}
      pages={book.pageContents}
      coverImage={book.coverImage}
    />
    // </main>
  );
}
