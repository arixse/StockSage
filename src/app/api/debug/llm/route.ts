import { NextResponse } from "next/server";

export async function GET() {
  const key = process.env.LLM_API_KEY;
  const base = process.env.LLM_BASE_URL || "https://api.openai.com/v1";
  const model = process.env.LLM_MODEL || "gpt-4o-mini";

  if (!key || key === "sk-...") {
    return NextResponse.json({ ok: false, error: "LLM_API_KEY not set or is placeholder", hint: "Set a real API key in .env" });
  }

  // Normalize base URL like ai-pipeline does
  let normalizedBase = base.trim().replace(/\/+$/, "");
  if (!normalizedBase.endsWith("/v1")) {
    normalizedBase += "/v1";
  }

  const maskedKey = `${key.slice(0, 8)}...${key.slice(-4)}`;

  try {
    const response = await fetch(`${normalizedBase}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: "Reply with exactly: ok" }],
        max_tokens: 10,
        temperature: 0,
      }),
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      const errBody = await response.text().catch(() => "unreadable");
      return NextResponse.json({
        ok: false,
        error: `HTTP ${response.status} ${response.statusText}`,
        details: errBody.slice(0, 300),
        model,
        baseUrl: normalizedBase,
        keyPreview: maskedKey,
      });
    }

    const json = await response.json();
    const content = json?.choices?.[0]?.message?.content || "";

    return NextResponse.json({
      ok: true,
      model,
      baseUrl: normalizedBase,
      keyPreview: maskedKey,
      response: content.slice(0, 200),
    });
  } catch (e) {
    return NextResponse.json({
      ok: false,
      error: e instanceof Error ? e.message : String(e),
      model,
      baseUrl: normalizedBase,
      keyPreview: maskedKey,
    });
  }
}
