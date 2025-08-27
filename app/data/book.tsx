// src/app/data/books.ts
import { bookPages } from "./bookPages";
import { LivrePageProps } from "@/components/Dynamic";

export const books: LivrePageProps[] = [
  {
    id: "mon-livre",
    title: "Mon Livre",
    titleFon: "Le Livre de David", // nouveau champ
    description: "Une histoire captivante...", // nouveau champ
    coverImage: "/david_saul.png", // nouveau champ
    duration: "15 min", // nouveau champ
    pages: 20, // nombre de pages
    pageContents: bookPages, // tes 20 pages BookPage[]
  },
  {
    id: "troisieme-histoire",
    title: "Une autre histoire",
    titleFon: "Histoire du Dro",
    description: "Introduction à une autre histoire",
    coverImage: "/david_goliath.png",
    duration: "10 min",
    pages: 3,
    pageContents: [
      { type: "text", content: <p>Introduction à une autre histoire...</p> },
      { type: "image", src: "/book/page1.jpg" },
      {
        type: "mixed",
        image: "/book/page2.jpg",
        overlay: true,
        content: <p>Texte sur image</p>,
      },
    ],
  },

  {
    id: "my_book",
    title: "Mon Livre",
    titleFon: "Le Livre de David", // nouveau champ
    description: "Une histoire captivante...", // nouveau champ
    coverImage: "/coverDavid.png", // nouveau champ
    duration: "15 min", // nouveau champ
    pages: 20, // nombre de pages
    pageContents: bookPages, // tes 20 pages BookPage[]
  },
];
