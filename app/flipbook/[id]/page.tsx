import LivrePageClient from "./LivrePageClient";

interface PageProps {
  params: { id: string };
}

export default function LivrePage({ params }: PageProps) {
  const { id } = params;
  return <LivrePageClient id={id} />;
}
