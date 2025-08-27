"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Éléments décoratifs en arrière-plan */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-warm-orange rounded-full animate-float"></div>
        <div
          className="absolute bottom-20 right-10 w-24 h-24 bg-soft-blue rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/4 w-16 h-16 bg-gentle-green rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Texte */}
          <div className="text-center lg:text-left space-y-8 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight">
              Découvre la Bible en fon comme jamais auparavant
            </h1>

            <p className="text-xl md:text-2xl text-primary-foreground/90 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Des histoires bibliques illustrées et racontées en langue fon pour
              les enfants, à lire et écouter en toute simplicité.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                variant="secondary"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 px-8 py-4 text-lg font-semibold shadow-story rounded-2xl transition-all duration-300 hover:scale-105"
              >
                📖 Lire & Écouter
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-2 border-warm-orange bg-warm-orange/10 text-warm-orange hover:bg-warm-orange hover:text-primary-foreground px-8 py-4 text-lg font-semibold rounded-2xl transition-all duration-300 hover:scale-105 shadow-gentle"
              >
                🎵 Explorer les histoires
              </Button>
            </div>

            {/* Points forts */}
            <div className="flex flex-wrap gap-6 justify-center lg:justify-start pt-8">
              {[
                { icon: "🎧", text: "Audio en fon" },
                { icon: "📱", text: "Accessible partout" },
                { icon: "👨‍👩‍👧‍👦", text: "Pour toute la famille" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 text-primary-foreground/90"
                >
                  <div className="w-10 h-10 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Image Hero */}
          <div
            className="relative animate-scale-in"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-story bg-gradient-card">
              <Image
                src="/hero.jpg"
                alt="Enfants africains écoutant des histoires sous un baobab"
                width={800}
                height={600}
                className="w-full h-auto object-cover"
                priority
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>

              {/* Icônes flottantes */}
              <div className="absolute top-4 right-4 w-12 h-12 bg-warm-orange rounded-full flex items-center justify-center animate-float text-white text-xl">
                📖
              </div>
              <div
                className="absolute bottom-4 left-4 w-12 h-12 bg-soft-blue rounded-full flex items-center justify-center animate-float text-white text-xl"
                style={{ animationDelay: "1.5s" }}
              >
                🎵
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
