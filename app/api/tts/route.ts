import { InferenceClient } from "@huggingface/inference"
import { NextRequest } from "next/server"

const MAX_TEXT_LENGTH = 500
const RATE_LIMIT_WINDOW_MS = 60_000   // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function getIP(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  )
}

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return false
  }
  if (entry.count >= MAX_REQUESTS_PER_WINDOW) return true
  entry.count++
  return false
}

export async function POST(req: NextRequest) {
  const ip = getIP(req)
  if (isRateLimited(ip)) {
    return Response.json(
      { error: "Trop de requêtes. Réessayez dans une minute." },
      { status: 429, headers: { "Retry-After": "60" } }
    )
  }

  const body = await req.json().catch(() => null)
  if (!body || typeof body !== "object") {
    return Response.json({ error: "Corps de requête invalide." }, { status: 400 })
  }

  const { text } = body as { text?: unknown }

  if (!text || typeof text !== "string" || text.trim() === "") {
    return Response.json({ error: "Texte requis." }, { status: 400 })
  }

  if (text.length > MAX_TEXT_LENGTH) {
    return Response.json(
      { error: `Texte trop long (max ${MAX_TEXT_LENGTH} caractères).` },
      { status: 400 }
    )
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
