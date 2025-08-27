// app/flipbook/[id]/page.tsx
import LivrePageClient from "./LivrePageClient";

interface PageProps {
  params: { id: string };
}

// Page côté serveur (Server Component) – doit être async pour Next.js
export default async function LivrePage({ params }: PageProps) {
  const { id } = params;

  // On peut faire des appels API ici si besoin avant de passer à LivrePageClient
  // Par exemple : const book = await fetchBook(id);

  // On passe juste l'id au composant client
  return <LivrePageClient id={id} />;
}
