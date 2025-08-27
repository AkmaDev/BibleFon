import { BookPage } from "@/components/FlipBookViewer";

export const bookPages: BookPage[] = [
  // --- Page 1 : infos auteur
  {
    type: "text",
    content: (
      <div className="prose prose-invert max-w-prose leading-relaxed">
        <h2 className="text-lg font-serif text-yellow-300 border-b border-yellow-500/30 pb-2 mb-4">
          Informations sur l’ouvrage
        </h2>
        <p>
          Écrit par : <span className="font-semibold">Edward Hughes</span>
        </p>
        <p>
          Illustré par : ChatGPT, OpenAI (
          <a
            href="https://openai.com"
            target="_blank"
            className="underline text-blue-400"
          >
            https://openai.com
          </a>
          )
        </p>
        <p>Adapté par : Ruth Klassen, Alastair Patersin</p>
        <p>Traduit en Français par : Yvon l&apos;Hermitte</p>
        <p>
          Traduction Fon par :{" "}
          <a
            href="https://huggingface.co/facebook/mms-tts-fon"
            target="_blank"
            className="underline text-blue-400"
          >
            MMS Fon TTS
          </a>
        </p>
        <p className="mt-4 text-xs text-neutral-400">
          Produit par : [Bible for Children, www.M1914.org, ©2020 Bible for
          Children, Inc.]
          <br />
          Licence : Usage non commercial uniquement.
        </p>
      </div>
    ),
  },

  // --- Pages 2 à n-1 : contenu principal
  {
    type: "mixed",
    image: "/samuel.png",
    overlay: false,
    content: (
      <div className="mt-2 ">
        <p>
          Le jeune David était en fuite. Le Roi Saül voulait le tuer. David
          vivait dans le désert avec ses compagnons fidèles...
        </p>
      </div>
    ),
  },
  {
    type: "mixed",
    image: "/samuel_david.png",
    overlay: false,
    content: (
      <div className="mt-2 ">
        <p>
          Les vents du désert chuchotaient des histoires anciennes. Chaque pas
          marquait une page invisible sur le sable chaud...
        </p>
      </div>
    ),
  },
  // ... répéter le modèle "mixed" pour toutes les pages de contenu
  // L'image en haut, le texte en bas, overlay = false

  // --- Dernière page : infos dynamiques
  {
    type: "text",
    content: (
      <div className="prose text-sm">
        <p>Titre du livre : David le Petit Berger</p>
        <p>Histoire de la Parole de Dieu, la Bible</p>
        <p>Extraite du livre : 1 Samuel 16-20</p>
        <p>&quot;La révélation de tes paroles éclaire.&quot; Psaume 119:130</p>
      </div>
    ),
  },
];
