/**
 * Génère les fichiers audio WAV (Fon) pour le livre David via le Space HuggingFace guunk-ttsfon.
 * Usage: node scripts/generate-david-audio.mjs
 */
import { writeFileSync, mkdirSync } from "fs"
import { join } from "path"

const SPACE = "https://guunk-ttsfon.hf.space"
const OUT = "public/audio/david"

async function tts(text) {
  // 1. Soumettre la requête
  const r1 = await fetch(`${SPACE}/gradio_api/call/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: [text] }),
  })
  if (!r1.ok) throw new Error(`submit error ${r1.status}`)
  const { event_id } = await r1.json()

  // 2. Attendre le résultat (SSE)
  const r2 = await fetch(`${SPACE}/gradio_api/call/predict/${event_id}`)
  const raw = await r2.text()
  const match = raw.match(/"url":\s*"([^"]+)"/)
  if (!match) throw new Error("URL introuvable dans la réponse: " + raw.slice(0, 200))
  const url = match[1]

  // 3. Télécharger le WAV
  const r3 = await fetch(url)
  if (!r3.ok) throw new Error(`download error ${r3.status}`)
  return Buffer.from(await r3.arrayBuffer())
}

const segments = [
  // ── onction ──
  {
    folder: "onction", num: 9,
    text: "Jɛsée sɛ́ mɛ dó gbě tɔn mɛ nǔgbó. Nyaví vɔvɔ ɖagbe ɖagbe ɖé wɛ, bó ɖó nukún cɔɔn. Ée é wá ɔ́, Mawu Mavɔmavɔ ɖɔ nú Samuwɛ́li ɖɔ: Sí te bo kɔn ami dó ta n'i bó sɔ́ ɛ axɔ́sú. É wɛ un sɔ́.",
  },
  {
    folder: "onction", num: 10,
    text: "Samuwɛ́li sɔ́ ami ɔ́ bó kɔn dó ta n'i bó sɔ́ ɛ axɔ́sú ɖo nɔví tɔn lɛ́ɛ nukún mɛ. Kpowun ɔ́, yɛ Mawu Mavɔmavɔ tɔn wá Davídi jí gbe énɛ́ gbe, bó nɔ jǐ tɔn káká sɔ́yi.",
  },

  // ── saul-trouble ──
  {
    folder: "saul-trouble", num: 11,
    text: "Yɛ Mawu Mavɔmavɔ tɔn gosín Sawúlu jí, bɔ Mawu Mavɔmavɔ sɛ́ yɛ nyanya ɖé dó e, bɔ é jɛ tagba dó n'i jí.",
  },
  {
    folder: "saul-trouble", num: 12,
    text: "Mɛsɛntɔ́ Sawúlu tɔn lɛ́ɛ ɖɔ n'i ɖɔ: Mǐ mɛsɛntɔ́ mɛtɔn lɛ́ɛ ɖo gbesisɔ mɛ; mǐ nǎ yi ba mɛ e nyɔ́ kanhún xo ɔ́ ɖokpó, bɔ nú yɛ nyanya e Mawu sɛ́ dó ɔ́ wá jǐ mɛtɔn ɔ́, é ná nɔ́ xo kanhún ɔ́ nú mɛ, bɔ mɛ ná nɔ́ mɔ agbɔ̌n.",
  },
  {
    folder: "saul-trouble", num: 13,
    text: "Mɛsɛntɔ́ lɛ́ɛ ɖokpó ká yí xó, bó ɖɔ: Un tunwun Jɛsée Bɛteleyɛ́munu ɔ́ sín vǐ ɖokpó, bɔ é nyɔ́ nǔ xo ganjí. Nyaví ahwanfuntɔ́ ɖé wɛ. É nyɔ́ xó ɖɔ ganjí. É nyɔ́ ɖɛkpɛ. Asúká ɖokpó wɛ. Mawu Mavɔmavɔ ɖo kpɔ́ xá ɛ.",
  },

  // ── david-harpe ──
  {
    folder: "david-harpe", num: 14,
    text: "Ée Sawúlu se mɔ̌ ɔ́, é sɛ́ wɛn dó Jɛsée bo ɖɔ: Sɛ́ vǐ towe Davídi e nɔ kplá lɛ̌ngbɔ́ towe lɛ́ɛ yi amagbo mɛ é dó mì.",
  },
  {
    folder: "david-harpe", num: 15,
    text: "Davídi yi Sawúlu gɔ́n. Nǔ tɔn nyɔ́ Sawúlu nukún mɛ káká, bɔ é sɔ́ ɛ, bɔ é nɔ́ hɛn ahwanfunnú tɔn lɛ́ɛ n'i.",
  },
  {
    folder: "david-harpe", num: 16,
    text: "Sín hwenɛ́nu ɔ́, yɛ nyanya e Mawu sɛ́ dó Sawúlu ɔ́ wá jǐ tɔn hweɖěbǔnu ɔ́, Davídi nɔ sɔ́ kanhún bó nɔ xo. Énɛ́ ɔ́, yɛ nyanya ɔ́ nɔ́ gosín jǐ tɔn, bɔ gbɔjɛ tɔn nɔ yi do, bɔ é nɔ́ mɔ agbɔ̌n kpɛɖé.",
  },

  // ── camp ──
  {
    folder: "camp", num: 17,
    text: "Filisitɛ́ɛn lɛ́ɛ kplé ahwangɔnu yětɔn lɛ́ɛ ɖo Judáa yíkúngban jí, bó ná yi fun ahwan xá Izlayɛ́li ví lɛ́ɛ. Sawúlu kpó ahwangɔnu Izlayɛ́li tɔn lɔ kpó kplé.",
  },
  {
    folder: "camp", num: 18,
    text: "Jɛsée sín vǐ súnnu mɛxó atɔn lɛ́ɛ bǐ ka ɖo ahwangbénu xá Sawúlu. Davídi wɛ nyí yɔkpɔ́vú ɖo yě mɛ. Jɛsée ɖɔ nú vǐ tɔn Davídi gbe ɖokpó ɖɔ: Sɔ́ nǔkún mimɛ ati ɖokpó élɔ́, kpó wɔ̌xúxú wǒ élɔ́ lɛ́ɛ kpó, bó kán wezun bó sɔ́ yi jó nú fofó towe lɛ́ɛ ɖo ahwankpá Izlayɛ́li ví lɛ́ɛ tɔn mɛ.",
  },

  // ── david-camp ──
  {
    folder: "david-camp", num: 19,
    text: "Davídi fɔ́n zǎn bó ɖidó. É yi fofó tɔn lɛ́ɛ gɔ́n, bó kanbyɔ́ ɖɔ nɛ̌ yě ɖe gbɔn a jí.",
  },

  // ── goliath ──
  {
    folder: "goliath", num: 20,
    text: "Ahwanfuntɔ́ Filisitɛ́ɛn lɛ́ɛ tɔn ɖokpó tɔ́n sín ahwankpá yětɔn mɛ, bó wá gblɔ́n adǎn nú Izlayɛ́li ví lɛ́ɛ. Nya ɔ́ nɔ nyí Goliyati; Gati toxomɛnu wɛ. Ga tɔn yi mɛ̌tlukpo atɔn jɛjí.",
  },
  {
    folder: "goliath", num: 21,
    text: "Nya Filisitɛ́ɛn ɔ́ lɛ́ ɖɔ: Mi nyi gbehwán sɛ́ dó wɛ un ɖe égbé. Mi ɖe mɛ ɖokpó sɛ́ dó mì, nú nyi kpó é kpó ná kpé hun.",
  },
  {
    folder: "goliath", num: 22,
    text: "Ényí mɛ ɔ́ kpé wú bó ɖu ɖo jǐ ce bó hu mì ɔ́, mǐdɛɛ lɛ́ɛ ná húzú kannumɔ mitɔn, bó ná nɔ wa azɔ̌ nú mi. Lo ɔ́, ényí nyɛ wɛ kpé wú bó ɖu ɖo jǐ tɔn, bó hu i ɔ́, midɛɛ lɛ́ɛ ná nyí kannumɔ mǐtɔn, bó ná nɔ́ wa azɔ̌ nú mǐ.",
  },

  // ── david-saul ──
  {
    folder: "david-saul", num: 23,
    text: "Davídi yi ɖɔ nú Sawúlu ɖɔ: Mɛ ɖokpó ma ɖi xɛsi nú nya Filisitɛ́ɛn énɛ́ ɔ́ ó. Nyɛ mɛsɛntɔ́ towe ná yi kpé hun xá ɛ.",
  },
  {
    folder: "david-saul", num: 24,
    text: "Sawúlu ka ɖɔ nú Davídi ɖɔ: A sixú kpé hun xá Filisitɛ́ɛn énɛ́ ɔ́ ǎ, ɖó yɔkpɔ́vú wɛ nú we, éyɛ́ ká kó ɖo ahwan mɛ sín vǔ.",
  },

  // ── david-lion ──
  {
    folder: "david-lion", num: 25,
    text: "Ée Sawúlu ɖɔ mɔ̌ ɔ́, Davídi ɖɔ n'i ɖɔ: Mɛsɛntɔ́ towe wɛ nɔ kplá tɔ́ ce sín kanlin lɛ́ɛ yi amagbo mɛ, bɔ nú kinnikínní abǐ lɔnmɔ ɖé wá wlí kanlin lɛ́ɛ ɖokpó ɔ́,",
  },
  {
    folder: "david-lion", num: 26,
    text: "un nɔ bɛ́ wezun ɖo gǔdo tɔn, bó nɔ xo e, bó nɔ yí kanlin ɔ́ sín nu tɔn. Ényí é lílɛ́ kpan nukɔn mì ɔ́, un nɔ hɛn vɛ̌go tɔn, bó nɔ xo káká bɔ é nɔ kú.",
  },
  {
    folder: "david-lion", num: 27,
    text: "Lě e nyɛ mɛsɛntɔ́ towe hu kinnikínní mɔ̌kpán, bó hu lɔnmɔ mɔ̌kpán gbɔn é nɛ́. Nǔ e un nɔ dó sin xá lan énɛ́ lɛ́ɛ ɔ́ wɛ un ná dó sin xá Filisitɛ́ɛn énɛ́ lɔ. Ðó mɛ énɛ́ e ma nɔ sɛn Mawu ǎ ɔ́ gblɔ́n adǎn nú ahwangɔnu Mawu gbɛɖe ɔ́ tɔn.",
  },

  // ── david-argumente ──
  {
    folder: "david-argumente", num: 28,
    text: "Davídi lɛ́ ɖɔ: Mawu e nɔ hwlɛ́n mì sín kinnikínní fɛn mɛ, bó nɔ hwlɛ́n mì sín lɔnmɔ fɛn mɛ ɔ́ ná hwlɛ́n mì ɖo Filisitɛ́ɛn énɛ́ sí.",
  },
  {
    folder: "david-argumente", num: 29,
    text: "Bɔ Sawúlu ɖɔ nú Davídi ɖɔ: Bo yi! Mawu Mavɔmavɔ ní nɔ kpɔ́ xá we.",
  },

  // ── david-pierres ──
  {
    folder: "david-pierres", num: 30,
    text: "É sɔ́ kpo tɔn, bo yi cyán kɛ́n e wǔtu tɔn ɖíɖí ganjí ɔ́ atɔ́ɔ́n ɖo tɔ tó, bó bɛ́ dó lɛ̌ngbɔ́nyitɔ́ gló tɔn mɛ.",
  },
]

async function main() {
  for (const seg of segments) {
    const dir = join(OUT, seg.folder)
    mkdirSync(dir, { recursive: true })
    const outPath = join(dir, `${seg.num}.wav`)

    process.stdout.write(`[${seg.folder}] audio ${seg.num}... `)
    try {
      const buf = await tts(seg.text)
      writeFileSync(outPath, buf)
      console.log(`OK (${buf.length} bytes)`)
    } catch (e) {
      console.error(`ERREUR: ${e.message}`)
    }
  }

  console.log("\nTerminé.")
}

main()
