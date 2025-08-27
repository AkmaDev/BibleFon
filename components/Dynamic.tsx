"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FlipBookViewer } from "./FlipBookViewer";
import Link from "next/link";

export interface LivrePageProps {
  id: string;
  title: string;
  titleFon: string;
  description: string;
  coverImage: string;
  duration: string;
  pages: number;
  pageContents: Array<
    | { type: "text"; content: React.ReactNode }
    | { type: "image"; src: string; alt?: string }
    | {
        type: "mixed";
        image: string;
        content: React.ReactNode | string;
        overlay?: boolean;
      }
  >;
}

interface LivrePageListProps {
  livres: LivrePageProps[];
}

export const LivrePage: React.FC<LivrePageListProps> = ({ livres }) => {
  console.log(livres.length);
  const [selectedLivre, setSelectedLivre] = useState<LivrePageProps | null>(
    null
  );

  return (
    <section className="py-16 bg-story-bg">
      <div className="container mx-auto px-4">
        {/* Titre section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Nos Histoires
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Découvrez notre collection d&apos;histoires illustrées et
            interactives.
          </p>
        </div>

        {/* Grille */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {livres.map((livre, index) => (
            <Card
              key={livre.id}
              className="group bg-card border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 overflow-hidden rounded-3xl p-0"
            >
              <CardContent className="p-0">
                <div
                  className="relative overflow-hidden cursor-pointer"
                  // onClick={() => setSelectedLivre(livre)}
                >
                  <Link href={`/flipbook/${livre.id}`}>
                    <Image
                      src={livre.coverImage}
                      alt={`Couverture de ${livre.title}`}
                      width={400}
                      height={256}
                      className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-500"
                      priority={index < 3}
                    />
                  </Link>
                  <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium shadow-md">
                    {livre.duration}
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-1">
                      {livre.title}
                    </h3>
                    <p className="text-primary font-medium text-lg">
                      {livre.titleFon}
                    </p>
                  </div>

                  <p className="text-muted-foreground leading-relaxed">
                    {livre.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <span>📄</span>
                      <span>{livre.pages} pages</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>🎧</span>
                      <span>Audio disponible</span>
                    </div>
                  </div>

                  {/* <Button
                    aria-label={`Lire l'histoire ${livre.title}`}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-2xl"
                    onClick={() => setSelectedLivre(livre)}
                  >
                    Lire l&apos;histoire
                  </Button> */}
                  <Link href={`/flipbook/${livre.id}`}>
                    <Button
                      aria-label={`Lire l'histoire ${livre.title}`}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-2xl"
                    >
                      Lire l&apos;histoire
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Modal Flipbook */}
      {selectedLivre && (
        <div
          onClick={() => setSelectedLivre(null)}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-card rounded-3xl max-w-5xl w-full shadow-lg overflow-hidden p-6"
          >
            <FlipBookViewer
              title={selectedLivre.title}
              pages={selectedLivre.pageContents}
            />
          </div>
        </div>
      )}
    </section>
  );
};
