/**
 * generate-illustrations.mjs
 * Pipeline : PDF → scènes → images IA via fal.ai FLUX
 *
 * Usage :
 *   node --env-file=.env.local scripts/generate-illustrations.mjs [pdf] [slug]
 */

import * as fs   from "fs"
import * as path from "path"
import * as rl   from "readline"
import { createRequire } from "module"
import { fal }   from "@fal-ai/client"

const require   = createRequire(import.meta.url)
const pdfParse  = require("pdf-parse")

// ─── Configuration ────────────────────────────────────────────────────────────

const PDF_PATH   = process.argv[2] ?? "./scripts/david.pdf"
const BOOK_SLUG  = process.argv[3] ?? "david"
const OUTPUT_DIR = `./public/illustrations/${BOOK_SLUG}`
const FAL_MODEL  = "fal-ai/flux/schnell"
const CHARACTER_SEED = 2847

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

function ask(question) {
  const iface = rl.createInterface({ input: process.stdin, output: process.stdout })
  return new Promise(r => iface.question(question, ans => { iface.close(); r(ans) }))
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function downloadImage(url, dest) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Download failed: ${res.status}`)
  const buf = await res.arrayBuffer()
  fs.writeFileSync(dest, Buffer.from(buf))
}

// ─── Extraction PDF → scènes ──────────────────────────────────────────────────

function buildScenePrompt(text, idx) {
  const t = text.toLowerCase()
  let scene = ""

  if (idx === 0) {
    scene = `${DAVID_CHAR}, standing in a green hilly landscape with sheep grazing nearby, holding a wooden shepherd's staff, looking at the viewer with a warm smile, title page illustration`
  } else if (t.includes("mouton") || t.includes("brebis") || t.includes("troupeau") || t.includes("berger") || t.includes("paître")) {
    scene = `${DAVID_CHAR}, herding a flock of fluffy white sheep on rolling green hills under a golden sky, staff in hand, happy expression`
  } else if (t.includes("harpe") || t.includes("lyre") || t.includes("chant") || t.includes("musique") || t.includes("joue")) {
    scene = `${DAVID_CHAR}, sitting under an olive tree playing a small wooden harp, sheep resting around him, peaceful countryside`
  } else if (t.includes("lion") || t.includes("ours") || t.includes("danger") || t.includes("attaque") || t.includes("bête")) {
    scene = `${DAVID_CHAR}, bravely standing between a lion and his sheep, staff raised, determined expression, dramatic rocky landscape`
  } else if (t.includes("samuel") || t.includes("prophète") || t.includes("huile") || t.includes("oint") || t.includes("consacr")) {
    scene = `${DAVID_CHAR}, kneeling humbly while an elderly bearded prophet in white robes anoints his head with oil, family watching in the background`
  } else if (t.includes("goliath") || t.includes("géant") || t.includes("philistin") || t.includes("bataille") || t.includes("guerre")) {
    scene = `${DAVID_CHAR}, standing confidently with a sling in hand facing a very tall armored giant soldier in the distance, valley landscape`
  } else if (t.includes("frère") || t.includes("famille") || t.includes("père") || t.includes("isaï") || t.includes("maison")) {
    scene = `${DAVID_CHAR}, standing with his family — father and older brothers — in front of a simple stone house, rolling hills in background`
  } else if (t.includes("roi") || t.includes("palais") || t.includes("saül") || t.includes("couronne") || t.includes("trône")) {
    scene = `${DAVID_CHAR}, playing his harp for a crowned king sitting on a throne in a simple stone palace, servants nearby`
  } else if (t.includes("pierre") || t.includes("fronde") || t.includes("victoire") || t.includes("tomba") || t.includes("lança")) {
    scene = `${DAVID_CHAR}, releasing a stone from his sling with great force, focused expression, blue sky background`
  } else if (t.includes("dieu") || t.includes("prière") || t.includes("seigneur") || t.includes("prie") || t.includes("confian")) {
    scene = `${DAVID_CHAR}, kneeling in prayer under a large tree, hands together, warm golden light streaming from above, peaceful landscape`
  } else if (t.includes("rivière") || t.includes("eau") || t.includes("source") || t.includes("ruisseau")) {
    scene = `${DAVID_CHAR}, sitting by a gentle stream, sheep drinking nearby, lush green surroundings, peaceful afternoon`
  } else if (t.includes("nuit") || t.includes("étoile") || t.includes("ciel") || t.includes("dorm")) {
    scene = `${DAVID_CHAR}, lying under a starry night sky with his sheep gathered around him, peaceful smile, beautiful night landscape`
  } else {
    scene = `${DAVID_CHAR}, in a biblical countryside landscape with sheep and olive trees, warm afternoon light, gentle expression`
  }

  return `${scene}, ${STYLE_SUFFIX}`
}

async function extractScenes(pdfPath) {
  console.log(`\n📖 Lecture du PDF : ${pdfPath}`)
  const buffer = fs.readFileSync(pdfPath)
  const data   = await pdfParse(buffer)

  const rawPages = data.text
    .split(/\f/)
    .map(p => p.replace(/\s+/g, " ").trim())
    .filter(p => p.length > 15)

  console.log(`   → ${rawPages.length} pages de texte détectées`)

  const scenes = rawPages.map((txt, i) => buildScenePrompt(txt, i))
  return scenes
}

// ─── Génération fal.ai ────────────────────────────────────────────────────────

async function generateImage(prompt, index, total) {
  console.log(`\n🎨 [${index + 1}/${total}] Génération...`)
  console.log(`   ${prompt.slice(0, 90)}...`)

  const result = await fal.subscribe(FAL_MODEL, {
    input: {
      prompt,
      image_size:            { width: 768, height: 1024 },
      num_inference_steps:   4,
      seed:                  CHARACTER_SEED,
      enable_safety_checker: false,
    },
    logs: false,
  })

  const url = result?.images?.[0]?.url ?? result?.data?.images?.[0]?.url
  if (!url) {
    console.error("Réponse fal.ai :", JSON.stringify(result).slice(0, 200))
    throw new Error("Pas d'URL dans la réponse fal.ai")
  }
  return url
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const falKey = process.env.FAL_KEY
  if (!falKey) { console.error("❌ FAL_KEY manquante dans .env.local"); process.exit(1) }
  fal.config({ credentials: falKey })
  console.log("✅ fal.ai configuré")

  if (!fs.existsSync(PDF_PATH)) {
    console.error(`❌ PDF introuvable : ${path.resolve(PDF_PATH)}`)
    process.exit(1)
  }

  const scenes = await extractScenes(PDF_PATH)
  console.log(`\n✅ ${scenes.length} scènes extraites`)
  scenes.forEach((s, i) => console.log(`   [${i + 1}] ${s.slice(0, 80)}...`))

  fs.mkdirSync(OUTPUT_DIR, { recursive: true })

  // ── Test 1 image ──
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  console.log("🧪 TEST — génération de l'image 1")
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

  const testUrl  = await generateImage(scenes[0], 0, scenes.length)
  const testPath = path.join(OUTPUT_DIR, "scene-01-test.jpg")
  await downloadImage(testUrl, testPath)

  console.log(`\n✅ Image test : ${path.resolve(testPath)}`)
  console.log("   → Ouvre ce fichier dans ton explorateur de fichiers")

  const answer = await ask("\n❓ Le style te convient ? (oui/non) : ")

  if (!["oui", "o", "yes", "y"].includes(answer.toLowerCase().trim())) {
    console.log("\n⏹️  Annulé. Modifie STYLE_SUFFIX ou DAVID_CHAR dans le script et relance.")
    process.exit(0)
  }

  // ── Batch complet ──
  console.log(`\n🚀 Batch complet — ${scenes.length} images`)
  fs.copyFileSync(testPath, path.join(OUTPUT_DIR, "scene-01.jpg"))

  for (let i = 1; i < scenes.length; i++) {
    try {
      const url     = await generateImage(scenes[i], i, scenes.length)
      const outPath = path.join(OUTPUT_DIR, `scene-${String(i + 1).padStart(2, "0")}.jpg`)
      await downloadImage(url, outPath)
      console.log(`   ✅ ${outPath}`)
      if (i < scenes.length - 1) await sleep(300)
    } catch (err) {
      console.error(`   ❌ Scène ${i + 1} :`, err.message)
    }
  }

  const done = fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith(".jpg") && !f.includes("test"))
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`✅ Terminé ! ${done.length} images dans ${path.resolve(OUTPUT_DIR)}`)
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
}

main().catch(err => { console.error("❌", err); process.exit(1) })
