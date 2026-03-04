import { InferenceClient } from "@huggingface/inference"
import { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  const { text } = await req.json()

  if (!text || typeof text !== "string" || text.trim() === "") {
    return Response.json({ error: "Texte requis." }, { status: 400 })
  }

  const token = process.env.HF_TOKEN
  if (!token) {
    return Response.json(
      { error: "Clé HF_TOKEN manquante. Ajoutez-la dans .env.local." },
      { status: 503 }
    )
  }

  try {
    const client = new InferenceClient(token)

    const audioBlob = await client.textToSpeech({
      model: "facebook/mms-tts-fon",
      inputs: text.trim(),
    })

    const buffer = await audioBlob.arrayBuffer()

    return new Response(buffer, {
      headers: {
        "Content-Type": "audio/wav",
        "Cache-Control": "public, max-age=3600",
      },
    })
  } catch (err) {
    console.error("[TTS Error]", err)
    return Response.json(
      { error: "Synthèse vocale indisponible. Vérifiez votre token HF." },
      { status: 502 }
    )
  }
}
