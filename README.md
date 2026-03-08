# BibleFon

> **Des histoires bibliques illustrées, lues et écoutées en langue fon.**
> Biblical stories — illustrated, read aloud, and heard in the Fon language.

🌍 **Live** → [biblefon.vercel.app](https://biblefon.vercel.app)

---

## Vision

La langue fon est parlée par plusieurs millions de personnes au Bénin et dans les pays voisins. Pourtant, les ressources numériques dans cette langue — en particulier pour les enfants — sont quasi inexistantes.

**BibleFon** est né d'une conviction simple : chaque enfant mérite d'entendre les histoires fondatrices de la foi dans sa propre langue maternelle. Pas seulement de les lire — mais de les *entendre*, de les *voir* illustrées, de les *vivre*.

Ce projet croise trois champs rarement réunis :
- **Technologie de pointe** — synthèse vocale IA, génération d'images, flipbook interactif
- **Patrimoine linguistique** — la langue fon, orale et vivante
- **Transmission culturelle** — des histoires universelles racontées depuis une perspective ouest-africaine

BibleFon n'est pas une application de lecture. C'est un **livre animé numérique**, pensé pour les familles béninoises et la diaspora africaine.

---

## Ce qui a été développé

### Lecteur flipbook interactif

Un lecteur de livre au format flipbook avec animation CSS 3D de tournage de pages, construit entièrement en React.

- Rendu côté client uniquement (`dynamic import`, `ssr: false`)
- Animation fluide de retournement de page (CSS `rotateY`, 520ms)
- Gestion des spreads (double page) et des pages simples (couverture, 4e de couverture)
- Navigation au clic, adaptée mobile
- Affichage adaptatif desktop / mobile (`MobileCard` vs spread desktop)
- Theming chaud : papier vieilli (#fdf5e6), accents or (#c9922a), fond nuit (#080604)

### Synthèse vocale en langue fon (TTS)

Chaque segment de texte en fon peut être lu à voix haute via l'IA.

- Modèle : **`facebook/mms-tts-fon`** (Meta MMS) via HuggingFace Inference API
- API Route Next.js (`/api/tts`) avec :
  - Rate limiting par IP (5 requêtes/minute)
  - Validation de longueur de texte (max 500 caractères)
  - Retour WAV avec cache HTTP 1h
- Lecture de fichiers audio pré-générés (WAV) pour les segments du livre David
- Lecture live via TTS pour tout texte en fon (mode fallback)

### Pipeline de génération d'illustrations IA

Les illustrations ont été générées avec un personnage consistant, un style défini, et une sensibilité culturelle ouest-africaine.

- Modèle : **fal-ai/FLUX Schnell**
- Seed de cohérence personnage : `2847` (David : garçon africain 8-10 ans, robe crème, cheveux bouclés)
- Style : livre illustré pour enfants, aquarelle, palette chaude
- Pipeline automatisé :
  1. Extraction de scènes depuis un PDF source (`pdf-parse`)
  2. Génération automatique de prompts contextuels (mouton, harpe, lion, Goliath…)
  3. Test sur 1 image → validation humaine → batch complet
  4. Téléchargement et organisation dans `public/illustrations/{slug}/`
- Script CLI : `npm run generate`

### Pipeline de génération audio (TTS batch)

- Génération hors-ligne des segments audio WAV par scène
- Organisation en `public/audio/{livre}/{scene}/`
- Lecture séquentielle dans le lecteur avec contrôle play/pause par segment

### Bibliothèque de livres extensible

Architecture conçue pour accueillir facilement de nouveaux livres :

```ts
type Book = {
  id: string
  title: string
  titleFon: string
  description: string
  cover: string
  pages: PageContent[]      // union type : title | meta | text | image | mixed | quote
  readingTime: number
  ageRange: string
  accentColor: string
  testament: "ancien" | "nouveau"
  comingSoon?: boolean
}
```

Livres actuellement en bibliothèque :

| Livre | Statut | Testament |
|-------|--------|-----------|
| **David le Petit Berger** (1 Samuel 16-17) | ✅ Disponible | Ancien |
| La Fournaise (Shadrach, Meshach, Abednego) | 🔜 À venir | Ancien |
| Noé et l'arche | 🔜 À venir | Ancien |

Prévus : Abraham, Ruth, Marie, Jonas.

---

## Stack technique

### Frontend

| Technologie | Usage |
|-------------|-------|
| **Next.js 16** (App Router) | Framework React, SSR, API Routes |
| **React 19** | UI et gestion d'état |
| **TypeScript 5** (strict) | Typage complet |
| **Tailwind CSS v4** | Styling utilitaire |
| **CSS 3D custom** | Animations flipbook (rotateY, keyframes) |
| **Lucide React** | Icônes |
| **Radix UI** | Composants accessibles |
| **Lora + Inter** | Typographie (Google Fonts, auto-hébergées) |

### Backend / API

| Technologie | Usage |
|-------------|-------|
| **Next.js API Routes** | Endpoint TTS (`POST /api/tts`) |
| **@huggingface/inference** | Client HuggingFace |
| **facebook/mms-tts-fon** | Modèle TTS langue fon (Meta MMS) |

### Génération IA (scripts)

| Technologie | Usage |
|-------------|-------|
| **fal-ai/FLUX Schnell** | Génération d'illustrations |
| **@fal-ai/client** | SDK fal.ai |
| **pdf-parse** | Extraction de texte depuis PDF |
| **HuggingFace TTS** | Génération audio batch hors-ligne |

### Infrastructure

| Technologie | Usage |
|-------------|-------|
| **Vercel** | Hébergement production (Edge Network) |
| **GitHub** | Source control + CI/CD |

### Sécurité

| Mesure | Détail |
|--------|--------|
| **Content Security Policy** | Headers stricts (`next.config.ts`) |
| **X-Frame-Options: DENY** | Anti-clickjacking |
| **X-Content-Type-Options** | Anti-MIME sniffing |
| **Referrer-Policy** | `strict-origin-when-cross-origin` |
| **Permissions-Policy** | Caméra, micro, géoloc désactivés |
| **Rate limiting** | 5 req/min par IP sur l'API TTS |
| **SRI** | Intégrité vérifiée sur les scripts CDN |

---

## Architecture

```
biblefon/
├── app/
│   ├── page.tsx                    # Page d'accueil (hero + bibliothèque)
│   ├── layout.tsx                  # Layout global (fonts, metadata OpenGraph)
│   ├── globals.css                 # Thème, animations CSS 3D
│   ├── flipbook/[id]/
│   │   ├── page.tsx                # Server component (routing par livre)
│   │   └── ReaderClient.tsx        # Boundary client (dynamic import SSR:false)
│   └── api/tts/
│       └── route.ts                # API TTS sécurisée (rate limit, validation)
│
├── components/
│   ├── library/
│   │   ├── BookCard.tsx            # Carte livre (couverture + métadonnées)
│   │   └── BookGrid.tsx            # Grille responsive de livres
│   └── reader/
│       └── StoryReader.tsx         # Lecteur flipbook complet (~1 500 lignes)
│
├── lib/
│   └── books.ts                    # Données + types (PageContent, Book)
│
├── public/
│   ├── illustrations/david/        # ~40 illustrations JPG générées par IA
│   └── audio/david/                # ~30 fichiers WAV TTS par scène
│
└── scripts/
    ├── generate-illustrations.mjs  # Pipeline PDF → FLUX → JPG
    └── generate-david-audio.mjs    # Génération batch audio TTS
```

---

## Démarrage local

### Prérequis

- Node.js 18+
- Compte [HuggingFace](https://huggingface.co) avec token API

### Installation

```bash
git clone https://github.com/AkmaDev/BibleFon.git
cd biblefon
npm install
```

### Configuration

```bash
cp .env.local.example .env.local
# Ajouter votre HF_TOKEN dans .env.local
```

### Développement

```bash
npm run dev
```

### Production locale

```bash
npm run build
npm start
```

### Génération d'illustrations (optionnel)

Nécessite un compte [fal.ai](https://fal.ai) avec `FAL_KEY` dans `.env.local`.

```bash
npm run generate
# ou avec un PDF personnalisé
node --env-file=.env.local scripts/generate-illustrations.mjs mon-livre.pdf mon-slug
```

---

## Variables d'environnement

| Variable | Requis | Description |
|----------|--------|-------------|
| `HF_TOKEN` | ✅ Oui | Token HuggingFace (TTS en ligne) |
| `FAL_KEY` | Pour génération | Clé fal.ai (génération illustrations) |

---

## Travail réalisé

| Domaine | Statut |
|---------|--------|
| Architecture Next.js App Router | ✅ |
| Lecteur flipbook CSS 3D custom | ✅ |
| Intégration TTS fon (live + pré-généré) | ✅ |
| API sécurisée avec rate limiting | ✅ |
| Pipeline génération illustrations IA | ✅ |
| Pipeline génération audio batch | ✅ |
| Livre David complet (20 pages, 13 scènes) | ✅ |
| Système de types extensible pour les livres | ✅ |
| Theming culturel (palette, typographie) | ✅ |
| Security headers (CSP, SRI, X-Frame…) | ✅ |
| Déploiement Vercel production | ✅ |
| Responsive mobile / desktop | ✅ |

---

## Feuille de route

- [ ] Livre : La Fournaise (Daniel 3)
- [ ] Livre : Noé et l'arche
- [ ] Livre : Abraham (Genèse 12-22)
- [ ] Livre : Ruth
- [ ] Mode hors-ligne (PWA / Service Worker)
- [ ] Traduction de l'interface en fon
- [ ] Sous-titres synchronisés avec l'audio
- [ ] Mode nuit / lumière

---

## Contribution

Ce projet est ouvert aux contributions, notamment :
- Traductions et corrections de textes en fon
- Nouvelles histoires bibliques
- Améliorations UI/UX

Ouvrez une issue ou une pull request sur [GitHub](https://github.com/AkmaDev/BibleFon).

---

## Licence

Contenu biblique : domaine public.
Code source : MIT.
Illustrations générées par IA : usage éducatif non-commercial.

---

*Fait avec soin pour les enfants du Bénin et la diaspora africaine.* 🇧🇯
