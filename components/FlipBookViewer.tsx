"use client";

import React, { useEffect, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  List,
  Printer,
  Volume2,
  ZoomIn,
} from "lucide-react";

export type BookPage =
  | { type: "image"; src: string; alt?: string }
  | { type: "text"; content: React.ReactNode }
  | {
      type: "mixed";
      image: string;
      content: React.ReactNode;
      overlay?: boolean;
    };

interface FlipBookViewerProps {
  title: string;
  coverImage?: string;
  pages: BookPage[];
}

type FlipBookRef = React.ComponentRef<typeof HTMLFlipBook>;

/* ---------- COUVERTURE PREMIUM ---------- */
const PageCover = React.forwardRef<
  HTMLDivElement,
  { image?: string; title?: string }
>(({ image, title }, ref) => (
  <div
    className="page relative h-full w-full"
    ref={ref}
    data-density="hard"
    style={{
      background: "linear-gradient(135deg, #f7f3e9, #e6dac7)",
      // border: "2px solid rgba(0,0,0,0.05)",
      // boxShadow: "0 15px 40px rgba(0,0,0,0.25)",
      fontFamily: "'Playfair Display', serif",
      overflow: "hidden",
    }}
  >
    {image && (
      <Image
        src={image}
        alt={title ?? "Couverture"}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover"
        priority
      />
    )}
    <div className="absolute inset-0 flex items-center justify-center px-6">
      <h1 className="text-5xl font-bold text-white drop-shadow-lg text-center tracking-wide leading-tight">
        {title}
      </h1>
    </div>
  </div>
));
PageCover.displayName = "PageCover";

/* ---------- PAGE PREMIUM ---------- */
const Page = React.forwardRef<
  HTMLDivElement,
  { number: number; pageData: BookPage }
>(({ number, pageData }, ref) => (
  <div
    ref={ref}
    className="page bg-[#fbf8f3] font-serif border border-neutral-200 shadow-inner overflow-hidden"
  >
    {/* Conteneur plein écran */}
    <div className="relative w-full h-full">
      {/* --- Texte seul --- */}
      {pageData.type === "text" && (
        <div className="flex items-center justify-center h-full px-12">
          <div className="prose prose-lg max-w-prose text-gray-800 leading-relaxed text-center">
            {pageData.content}
          </div>
        </div>
      )}

      {/* --- Image seule --- */}
      {pageData.type === "image" && (
        <Image
          src={pageData.src}
          alt={pageData.alt ?? `Page ${number}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          priority
        />
      )}

      {/* --- Mixte (image + texte) --- */}

      {/* {pageData.overlay ? (
              <div className="relative w-full h-80 rounded-xl overflow-hidden shadow-lg">
                <Image
                  src={pageData.image}
                  alt={`Page ${number}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                  <div className="prose prose-sm max-w-none text-white text-center">
                    {pageData.content}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <Image
                  src={pageData.image}
                  alt={`Page ${number}`}
                  width={700}
                  height={900}
                  className="object-scale-down"
                />
                <div className="bg-white rounded-lg px-5 py-4 shadow-md border border-neutral-100">
                  <div className="prose prose-sm max-w-none text-gray-800 text-center">
                    {pageData.content}
                  </div>
                </div>
              </div>
            )} */}

      {pageData.type === "mixed" && (
        <>
          {/* Image en fond */}
          <Image
            src={pageData.image}
            alt={`Page ${number}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
          {/* Overlay texte bas */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end">
            <div className="px-10 pb-12 w-full text-center">
              {typeof pageData.content === "string" ? (
                <p className="text-white text-lg leading-relaxed drop-shadow-lg font-serif">
                  {pageData.content}
                </p>
              ) : (
                <div className="text-white text-lg leading-relaxed drop-shadow-lg font-serif">
                  {pageData.content}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Numéro de page */}
      <div className="absolute bottom-3 inset-x-0 text-center text-xs text-neutral-400">
        Page {number}
      </div>
    </div>
  </div>
));
Page.displayName = "Page";

/* ---------- FLIPBOOK VIEWER PREMIUM ---------- */
export const FlipBookViewer: React.FC<FlipBookViewerProps> = ({
  title,
  pages,
  coverImage,
}) => {
  const flipRef = useRef<FlipBookRef | null>(null);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(pages.length);

  useEffect(() => {
    const timer = setTimeout(() => {
      const instance = flipRef.current?.getPageFlip?.();
      if (instance) setTotal(instance.getPageCount());
    }, 100);
    return () => clearTimeout(timer);
  }, [pages.length]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") flipRef.current?.getPageFlip()?.flipNext();
      if (e.key === "ArrowLeft") flipRef.current?.getPageFlip()?.flipPrev();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
  return (
    <div className="w-full h-screen bg-gray-100 flex flex-col">
      {/* --- Bande du haut --- */}
      <div className="flex items-center justify-between bg-white shadow px-6 py-3 relative z-10">
        {/* Titre */}
        <div className="text-sm font-semibold text-gray-800 truncate max-w-[300px]">
          {title}
        </div>

        {/* Icônes centrées */}
        <div className="flex items-center gap-6 text-gray-700">
          <List className="w-5 h-5 cursor-pointer hover:text-gray-900 transition-colors" />
          <ZoomIn className="w-5 h-5 cursor-pointer hover:text-gray-900 transition-colors" />
          <Volume2 className="w-5 h-5 cursor-pointer hover:text-gray-900 transition-colors" />
          <Printer className="w-5 h-5 cursor-pointer hover:text-gray-900 transition-colors" />
        </div>

        {/* Branding */}
        <div className="text-xs text-gray-400">
          POWERED BY <span className="font-bold">publuu</span>
        </div>
      </div>

      {/* --- Zone principale --- */}
      <div className="flex-1 relative overflow-hidden ">
        {/* Bordures colorées gauche et droite */}
        {/* <div className="absolute top-0 left-0 h-full w-6 flex flex-col z-20">
          {[
            "bg-red-500",
            "bg-orange-400",
            "bg-yellow-300",
            "bg-green-500",
            "bg-blue-500",
            "bg-purple-600",
          ].map((color, i) => (
            <div key={i} className={`${color} flex-1`} />
          ))}
        </div>

        <div className="absolute top-0 right-0 h-full w-6 flex flex-col z-20">
          {[
            "bg-red-500",
            "bg-orange-400",
            "bg-yellow-300",
            "bg-green-500",
            "bg-blue-500",
            "bg-purple-600",
          ].map((color, i) => (
            <div key={i} className={`${color} flex-1`} />
          ))}
        </div> */}

        {/* Container principal centré pour le flipbook */}

        <div className="absolute inset-0 flex items-center justify-center px-4 py-4 ">
          <div className="relative max-w-[1200px] max-h-[600px]  overflow-hidden">
            <HTMLFlipBook
              width={900} // largeur page seule
              height={1000} // hauteur page seule
              size="stretch"
              minWidth={400}
              maxWidth={1600} // tu peux augmenter encore
              minHeight={600}
              maxHeight={1200}
              maxShadowOpacity={0.4}
              showCover={true}
              mobileScrollSupport={false}
              className=" "
              ref={flipRef}
              onFlip={(e) => setPage(e.data)}
              style={{}}
              startPage={0}
              drawShadow={true}
              flippingTime={1000}
              usePortrait={false}
              startZIndex={0}
              autoSize={false}
              clickEventForward={true}
              useMouseEvents={true}
              swipeDistance={30}
              showPageCorners={true}
              disableFlipByClick={false}
            >
              <PageCover image={coverImage} title={title} />
              {pages.map((p, idx) => (
                <Page key={idx} number={idx + 1} pageData={p} />
              ))}
              <PageCover image={coverImage} title="Fin" />
            </HTMLFlipBook>
          </div>
        </div>

        {/* Boutons navigation - positionnés par rapport au flipbook */}
        <button
          onClick={() => flipRef.current?.pageFlip?.()?.flipPrev()}
          className="absolute left-8 top-1/2 -translate-y-1/2 bg-white/90 shadow-lg rounded-full p-3 hover:bg-white hover:scale-110 transition-all duration-200 z-30"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
        <button
          onClick={() => flipRef.current?.pageFlip?.()?.flipNext()}
          className="absolute right-8 top-1/2 -translate-y-1/2 bg-white/90 shadow-lg rounded-full p-3 hover:bg-white hover:scale-110 transition-all duration-200 z-30"
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* --- Barre du bas --- */}
      <div className="flex items-center justify-between px-8 py-4 bg-white shadow-md border-t relative z-10">
        {/* Pagination */}
        <span className="text-sm font-medium text-gray-600 min-w-[60px]">
          {page + 1} / {total}
        </span>

        {/* Slider centré */}
        <div className="flex-1 max-w-lg mx-8">
          <input
            type="range"
            min="1"
            max={total}
            value={page + 1}
            onChange={(e) =>
              flipRef.current?.getPageFlip()?.flip(parseInt(e.target.value) - 1)
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
                ((page + 1) / total) * 100
              }%, #e5e7eb ${((page + 1) / total) * 100}%, #e5e7eb 100%)`,
            }}
          />
        </div>

        {/* Fullscreen */}
        <button className="text-lg text-gray-500 hover:text-gray-800 min-w-[60px] text-right transition-colors">
          ⛶
        </button>
      </div>
    </div>
  );
};
