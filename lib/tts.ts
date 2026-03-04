export async function synthesizeFon(text: string): Promise<ArrayBuffer> {
  const res = await fetch("/api/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error ?? "TTS request failed")
  }

  return res.arrayBuffer()
}
