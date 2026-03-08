/**
 * generate-illustrations.ts
 * Pipeline automatique : PDF → scènes → images IA (fal.ai FLUX)
 *
 * Usage :
 *   npx tsx scripts/generate-illustrations.ts [chemin-pdf] [slug-livre]
 *
 * Exemples :
 *   npx tsx scripts/generate-illustrations.ts ./scripts/david.pdf david
 *   npx tsx scripts/generate-illustrations.ts  (utilise les valeurs par défaut)
 */

import * as fs   from "fs"
import * as path from "path"
import * as rl   from "readline"
import { fal }   from "@fal-ai/client"
import pdfParse  from "pdf-parse"
import "dotenv/config"

// ─── Configuration ────────────────────────────────────────────────────────────

const PDF_PATH   = process.argv[2] ?? "./scripts/david.pdf"
const BOOK_SLUG  = process.argv[3] ?? "david"
const OUTPUT_DIR = `./public/illustrations/${BOOK_SLUG}`

// Modèle fal.ai — schnell = rapide & pas cher (~$0.003/img), dev = meilleure qualité (~$0.025/img)
const FAL_MODEL  = "fal-ai/flux/schnell"

// Seed fixe → cohérence visuelle du personnage à travers toutes les images
const CHARACTER_SEED = 2847

// Suffixe de style appliqué à TOUTES les images pour cohérence visuelle
const STYLE_SUFFIX = [
  "children's book illustration",
  "soft watercolor style",
  "warm earthy colors",
  "simple friendly shapes",
  "West African child characters",
  "bright and cheerful",
  "storybook art",
  "clean lines",
  "suitable for ages 4 to 8",
  "no text in image",
].join(", ")

// Description constante de David → même personnage partout
const DAVID_CHAR = [
  "young African shepherd boy named David",
  "age 8 to 10",
  "dark brown skin",
  "short curly black hair",
  "wearing a simple cream-colored robe",
  "sandals",
  "kind brown eyes",
  "gentle smile",
].join(", ")

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ask(question: string): Promise<string> {
  const iface = rl.createInterface({ input: process.stdin, output: process.stdout })
  return new Promise(resolve => iface.question(question, ans => { iface.close(); resolve(ans) }))
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)) }

async function downloadImage(url: string, dest: string) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Download failed: ${res.status}`)
  const buf = await res.arrayBuffer()
  fs.writeFileSync(dest, Buffer.from(buf))
}

// ─── Extraction PDF → liste de scènes ─────────────────────────────────────────

/**
 * Lit le PDF page par page et renvoie une liste de descriptions visuelles.
 * On extrait le texte brut et on en tire des prompts image concis.
 */
async function extractScenes(pdfPath: string): Promise<string[]> {
  console.log(`\n📖 Lecture du PDF : ${pdfPath}`)
  const buffer = fs.readFileSync(pdfPath)
  const data   = await pdfParse(buffer)

  // Séparer par pages (pdf-parse concatène tout, on utilise le marqueur \n\n)
  const rawPages = data.text
    .split(/\f/)                         // form-feed = saut de page PDF
    .map(p => p.replace(/\s+/g, " ").trim())
    .filter(p => p.length > 20)          // ignorer les pages quasi-vides

  console.log(`   → ${rawPages.length} pages détectées`)

  // Convertir chaque bloc de texte en description de scène visuelle
  const scenes: string[] = rawPages.map((pageText, i) => {
    // Nettoyer le texte : supprimer numéros de page, titres répétés
    const clean = pageText
      .replace(/david le petit berger/gi, "")
      .replace(/^\d+\s*/gm, "")
      .replace(/\s{2,}/g, " ")
      .trim()
      .slice(0, 400) // garder max 400 chars pour le contexte

    // On crée un prompt visuel à partir du contexte textuel
    return buildScenePrompt(clean, i)
  })

  return scenes
}

/**
 * Construit un prompt image fal.ai à partir d'un extrait de texte de l'histoire.
 */
function buildScenePrompt(storyText: string, pageIndex: number): string {
  // Mots-clés extraits pour détecter l'action principale
  const text = storyText.toLowerCase()

  let scene = ""

  if (pageIndex === 0 || text.includes("titre") || text.includes("david")) {
    scene = `${DAVID_CHAR}, standing in a green hilly landscape with sheep grazing nearby, holding a wooden shepherd's staff, looking at the viewer with a smile`
  } else if (text.includes("mouton") || text.includes("brebis") || text.includes("troupeau") || text.includes("berger")) {
    scene = `${DAVID_CHAR}, herding a flock of fluffy white sheep on rolling green hills under a golden sky, staff in hand`
  } else if (text.includes("harpe") || text.includes("lyre") || text.includes("chant") || text.includes("musique")) {
    scene = `${DAVID_CHAR}, sitting under an olive tree playing a small wooden harp, sheep resting around him, peaceful countryside`
  } else if (text.includes("lion") || text.includes("ours") || text.includes("danger") || text.includes("attaque")) {
    scene = `${DAVID_CHAR}, bravely standing between a lion and his sheep, staff raised, determined expression, dramatic rocky landscape`
  } else if (text.includes("samuel") || text.includes("prophète") || text.includes("huile") || text.includes("oint")) {
    scene = `${DAVID_CHAR}, kneeling humbly while an elderly bearded prophet in white robes anoints his head with oil, family watching in the background`
  } else if (text.includes("goliath") || text.includes("géant") || text.includes("philistin") || text.includes("bataille")) {
    scene = `${DAVID_CHAR}, standing confidently with a sling in hand facing a very tall armored giant soldier in the distance, valley landscape`
  } else if (text.includes("frère") || text.includes("famille") || text.includes("père") || text.includes("isaï")) {
    scene = `${DAVID_CHAR}, standing with his family — father and older brothers — in front of a simple stone house, rolling hills in background`
  } else if (text.includes("roi") || text.includes("palais") || text.includes("saül") || text.includes("couronne")) {
    scene = `${DAVID_CHAR}, playing his harp for a crowned king sitting on a throne in a simple stone palace, servants nearby`
  } else if (text.includes("pierre") || text.includes("fronde") || text.includes("victoire") || text.includes("victoire")) {
    scene = `${DAVID_CHAR}, releasing a stone from his sling with great force, focused expression, blue sky background`
  } else if (text.includes("dieu") || text.includes("prière") || text.includes("prie") || text.includes("seigneur")) {
    scene = `${DAVID_CHAR}, kneeling in prayer under a large tree, hands together, warm golden light streaming from above, peaceful landscape`
  } else {
    // Scène générique si aucun mot-clé trouvé
    scene = `${DAVID_CHAR}, in a biblical countryside landscape with sheep and olive trees, warm afternoon light`
  }

  return `${scene}, ${STYLE_SUFFIX}`
}

// ─── Génération fal.ai ────────────────────────────────────────────────────────

async function generateImage(prompt: string, index: number, total: number): Promise<string> {
  console.log(`\n🎨 [${index + 1}/${total}] Génération...`)
  console.log(`   Prompt: ${prompt.slice(0, 100)}...`)

  const result = await fal.subscribe(FAL_MODEL, {
    input: {
      prompt,
      image_size:           { width: 768, height: 1024 },
      num_inference_steps:  4,          // schnell = 4 steps
      seed:                 CHARACTER_SEED,
      enable_safety_checker: false,
    },
    logs: false,
  }) as { images: Array<{ url: string }> }

  const imageUrl = result.images?.[0]?.url
  if (!imageUrl) throw new Error("Pas d'URL d'image dans la réponse fal.ai")

  return imageUrl
}

// ─── Pipeline principal ───────────────────────────────────────────────────────

async function main() {
  // 1. Vérifier la clé fal.ai
  const falKey = process.env.FAL_KEY
  if (!falKey) {
    console.error("❌ FAL_KEY manquante dans .env.local")
    process.exit(1)
  }
  fal.config({ credentials: falKey })
  console.log("✅ fal.ai configuré")

  // 2. Vérifier le PDF
  if (!fs.existsSync(PDF_PATH)) {
    console.error(`❌ PDF introuvable : ${PDF_PATH}`)
    console.error(`   Copie le PDF dans : ${path.resolve(PDF_PATH)}`)
    process.exit(1)
  }

  // 3. Extraire les scènes du PDF
  const scenes = await extractScenes(PDF_PATH)
  console.log(`\n✅ ${scenes.length} scènes extraites`)

  // Afficher les scènes pour validation
  console.log("\n📋 Scènes détectées :")
  scenes.forEach((s, i) => console.log(`   [${i + 1}] ${s.slice(0, 80)}...`))

  // 4. Créer le dossier de sortie
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })

  // 5. TEST — générer la 1ère image pour validation
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  console.log("🧪 TEST : génération de l'image 1 pour validation")
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

  const testUrl  = await generateImage(scenes[0], 0, scenes.length)
  const testPath = path.join(OUTPUT_DIR, "scene-01-test.jpg")
  await downloadImage(testUrl, testPath)

  console.log(`\n✅ Image test sauvegardée : ${testPath}`)
  console.log(`   → Ouvre ce fichier pour voir le résultat`)
  console.log(`   → Chemin absolu : ${path.resolve(testPath)}`)

  // 6. Demander validation avant de lancer le batch complet
  const answer = await ask(`\n❓ Le style te convient ? (oui/non) : `)

  if (answer.toLowerCase().trim() !== "oui" && answer.toLowerCase().trim() !== "o") {
    console.log("\n⏹️  Génération annulée. Ajuste le style dans STYLE_SUFFIX ou DAVID_CHAR et relance.")
    process.exit(0)
  }

  // 7. Générer toutes les scènes restantes
  console.log(`\n🚀 Lancement du batch complet — ${scenes.length} images`)
  console.log(`   Modèle : ${FAL_MODEL}`)
  console.log(`   Sortie : ${path.resolve(OUTPUT_DIR)}\n`)

  // Sauvegarder aussi l'image test définitivement
  const img01Path = path.join(OUTPUT_DIR, "scene-01.jpg")
  fs.copyFileSync(testPath, img01Path)

  // Générer les scènes restantes (2 → N)
  for (let i = 1; i < scenes.length; i++) {
    try {
      const url      = await generateImage(scenes[i], i, scenes.length)
      const imgPath  = path.join(OUTPUT_DIR, `scene-${String(i + 1).padStart(2, "0")}.jpg`)
      await downloadImage(url, imgPath)
      console.log(`   ✅ Sauvegardée : ${imgPath}`)

      // Petite pause pour éviter rate-limiting
      if (i < scenes.length - 1) await sleep(300)

    } catch (err) {
      console.error(`   ❌ Erreur scène ${i + 1} :`, err)
    }
  }

  // 8. Résumé
  const files = fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith(".jpg") && !f.includes("test"))
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`✅ Terminé ! ${files.length} images générées`)
  console.log(`   Dossier : ${path.resolve(OUTPUT_DIR)}`)
  console.log(`   Prochaine étape : intégrer dans lib/books.ts`)
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
}

main().catch(err => {
  console.error("❌ Erreur fatale :", err)
  process.exit(1)
})
