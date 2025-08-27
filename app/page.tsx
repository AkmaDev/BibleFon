import { LivrePage } from "@/components/Dynamic";
import { HeroSection } from "@/components/HeroSection";
import { books } from "./data/book";

export default function Home() {
  return (
    <>
      <HeroSection />
      <LivrePage livres={books} />
    </>
  );
}
