/**
 * generate-david.mjs
 * Génère les illustrations du livre "David le Petit Berger" via fal.ai FLUX Schnell.
 * Zero dépendances npm — utilise fetch natif Node.js 22 + l'API REST fal.ai.
 *
 * Usage :
 *   node --env-file=.env.local scripts/generate-david.mjs
 */

import * as fs   from "fs"
import * as path from "path"
import * as rl   from "readline"

// ─── Configuration ────────────────────────────────────────────────────────────

const OUTPUT_DIR     = "./public/illustrations/david"
const FAL_MODEL      = "fal-ai/flux/dev"
const CHARACTER_SEED = 2847

const DAVID_CHAR = [
  "a young African shepherd boy",
  "age 8 to 10",
  "dark brown skin",
  "short curly black hair",
  "wearing a simple cream-colored robe",
  "sandals",
  "kind brown eyes",
  "gentle smile",
].join(", ")

const STYLE = [
  "children's book illustration",
  "soft watercolor style",
  "warm earthy colors",
  "simple friendly shapes",
  "West African child characters",
  "bright and cheerful",
  "storybook art",
  "clean lines",
  "suitable for ages 4 to 8",
  "pure illustration only",
  "absolutely no text",
  "no words",
  "no letters",
  "no writing",
  "no captions",
].join(", ")

const NEGATIVE_PROMPT = [
  "text", "words", "letters", "writing", "caption", "watermark",
  "label", "title", "quote", "typography", "font", "inscription",
  "blurry", "ugly", "distorted", "low quality",
].join(", ")

// ─── Scènes (une par page logique du livre) ───────────────────────────────────

const SCENES = [
  // 01 — Couverture
  `${DAVID_CHAR}, standing in green hilly landscape with sheep grazing nearby, holding wooden shepherd's staff, looking at viewer with warm smile, golden sunset sky, ${STYLE}`,

  // 02 — Méta (intro) — page décorative sobre
  `ancient open scroll on wooden table with olive branch, warm candlelight, peaceful atmosphere, ${STYLE}`,

  // 03 — Samuel arrive à Bethléem (mixed)
  `wise elderly African prophet, long white beard, white robe, walking through hills toward a small village, determined expression, golden afternoon light, ${STYLE}`,

  // 04 — La mission de Samuel (text)
  `wise elderly prophet standing before a row of seven tall impressive young African men outside a stone house, looking thoughtful and unsatisfied, ${STYLE}`,

  // 05 — David et sa harpe (mixed)
  `${DAVID_CHAR}, sitting alone in green meadow playing small wooden harp, several fluffy white sheep resting peacefully around him, olive trees in background, warm evening light, ${STYLE}`,

  // 06 — L'Onction Sainte (text)
  `${DAVID_CHAR}, kneeling humbly before elderly white-robed prophet who pours oil from animal horn onto his head, older brothers and father watching in background with surprised expressions, warm golden light from above, ${STYLE}`,

  // 07 — Les frères étonnés (mixed)
  `${DAVID_CHAR}, standing confidently after anointing, surrounded by seven older brothers and a father who look amazed and humble, glow of divine light around David, stone house exterior, ${STYLE}`,

  // 08 — David joue pour Saul (mixed)
  `${DAVID_CHAR}, sitting on small stool playing a small wooden harp before a troubled-looking African king on a simple stone throne, two servants standing nearby, simple palace interior with torch light, ${STYLE}`,

  // 09 — La menace philistine (text)
  `enormous armored giant soldier Goliath in bronze armor carrying a massive spear, shouting a challenge across a rocky valley, two armies visible in the distant background on opposite hillsides, ${STYLE}`,

  // 10 — Goliath défie Israël (mixed)
  `same towering giant Goliath striding boldly through camp, terrified soldiers hiding behind rocks and tents, dramatic rocky valley landscape, fear visible on soldiers' faces, ${STYLE}`,

  // 11 — David au camp (text)
  `${DAVID_CHAR}, arriving at military camp carrying a woven basket of bread and cheese, watching with determined expression as soldiers look afraid in background, ${STYLE}`,

  // 12 — David se prépare (mixed)
  `${DAVID_CHAR}, kneeling by a clear stream carefully selecting five smooth round stones, leather sling in hand, oversized discarded bronze armor lying nearby, focused determined expression, ${STYLE}`,

  // 13 — La victoire (text)
  `${DAVID_CHAR}, releasing stone from spinning sling directly toward towering armored giant in the distance, powerful action pose, bright blue sky, confident fearless expression, ${STYLE}`,

  // 14 — Le roi promis (text)
  `${DAVID_CHAR}, slightly older, joyfully celebrated by crowd of African people in colorful robes, lifted on shoulders, golden crown being gently placed on his head, sun shining brightly, ${STYLE}`,

  // 15 — Verset (quote)
  `open ancient illuminated scroll with ornate golden border, soft warm candlelight, olive branch beside it, peaceful library corner, ${STYLE}`,
]

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

// ─── Appel API fal.ai via REST (pas de npm) ───────────────────────────────────

async function generateImage(prompt, index, total, attempt = 1) {
  console.log(`\n🎨 [${index + 1}/${total}] Génération${attempt > 1 ? ` (tentative ${attempt})` : ""}...`)
  console.log(`   ${prompt.slice(0, 90)}...`)

  const FAL_KEY = process.env.FAL_KEY
  const endpoint = `https://fal.run/${FAL_MODEL}`

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 120_000) // 2 min max

  let res
  try {
    res = await fetch(endpoint, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Authorization": `Key ${FAL_KEY}`,
        "Content-Type":  "application/json",
      },
      body: JSON.stringify({
        prompt,
        negative_prompt:       NEGATIVE_PROMPT,
        image_size:            { width: 768, height: 1024 },
        num_inference_steps:   25,
        seed:                  CHARACTER_SEED,
        enable_safety_checker: false,
      }),
    })
  } catch (err) {
    clearTimeout(timer)
    if (attempt < 4) {
      console.log(`   ⚠️  Erreur réseau, retry dans 8s... (${err.message})`)
      await sleep(8000)
      return generateImage(prompt, index, total, attempt + 1)
    }
    throw err
  }
  clearTimeout(timer)

  if (!res.ok) {
    const txt = await res.text().catch(() => "")
    if ((res.status === 502 || res.status === 503 || res.status === 429) && attempt < 4) {
      console.log(`   ⚠️  fal.ai ${res.status}, retry dans 10s...`)
      await sleep(10_000)
      return generateImage(prompt, index, total, attempt + 1)
    }
    throw new Error(`fal.ai error ${res.status}: ${txt.slice(0, 200)}`)
  }

  const data = await res.json()
  const url  = data?.images?.[0]?.url
  if (!url) {
    console.error("Réponse fal.ai :", JSON.stringify(data).slice(0, 300))
    throw new Error("Pas d'URL dans la réponse fal.ai")
  }
  return url
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const falKey = process.env.FAL_KEY
  if (!falKey) {
    console.error("❌ FAL_KEY manquante dans .env.local")
    process.exit(1)
  }
  console.log("✅ FAL_KEY trouvée")
  console.log(`📚 ${SCENES.length} scènes à générer\n`)

  SCENES.forEach((s, i) => console.log(`   [${i + 1}] ${s.slice(0, 80)}...`))

  fs.mkdirSync(OUTPUT_DIR, { recursive: true })

  // ── Test 1 image ──
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  console.log("🧪 TEST — génération de l'image 1")
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

  const testUrl  = await generateImage(SCENES[0], 0, SCENES.length)
  const testPath = path.join(OUTPUT_DIR, "scene-01-test.jpg")
  await downloadImage(testUrl, testPath)

  console.log(`\n✅ Image test : ${path.resolve(testPath)}`)
  console.log("   → Ouvre ce fichier dans ton explorateur de fichiers pour voir le style")

  const answer = await ask("\n❓ Le style te convient ? (oui/non) : ")

  if (!["oui", "o", "yes", "y"].includes(answer.toLowerCase().trim())) {
    console.log("\n⏹️  Annulé. Modifie STYLE ou DAVID_CHAR dans le script et relance.")
    process.exit(0)
  }

  // ── Batch complet ──
  console.log(`\n🚀 Batch complet — ${SCENES.length} images`)
  fs.copyFileSync(testPath, path.join(OUTPUT_DIR, "scene-01.jpg"))
  console.log("   ✅ scene-01.jpg (copie du test)")

  for (let i = 1; i < SCENES.length; i++) {
    try {
      const url     = await generateImage(SCENES[i], i, SCENES.length)
      const outPath = path.join(OUTPUT_DIR, `scene-${String(i + 1).padStart(2, "0")}.jpg`)
      await downloadImage(url, outPath)
      console.log(`   ✅ ${outPath}`)
      if (i < SCENES.length - 1) await sleep(300)
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
