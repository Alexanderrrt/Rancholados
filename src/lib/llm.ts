// Minimal OpenAI-compatible chat client (Groq by default). No SDK, plain fetch.
// Env: GROQ_API_KEY (or LLM_API_KEY), optional LLM_BASE_URL / LLM_MODEL overrides.

const apiKey = process.env.GROQ_API_KEY || process.env.LLM_API_KEY || "";
const baseUrl = process.env.LLM_BASE_URL || "https://api.groq.com/openai/v1";
const model = process.env.LLM_MODEL || "llama-3.3-70b-versatile";

export const isLLMConfigured = Boolean(apiKey);

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

const RETRYABLE = new Set([429, 500, 502, 503, 504]);
const BACKOFF_MS = [500, 1000];

export async function chatCompletion(messages: ChatMessage[]): Promise<string> {
  if (!apiKey) throw new Error("LLM not configured");

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= BACKOFF_MS.length; attempt++) {
    try {
      const res = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.8,
          max_tokens: 400,
          response_format: { type: "json_object" },
        }),
      });

      if (!res.ok) {
        if (RETRYABLE.has(res.status) && attempt < BACKOFF_MS.length) {
          lastError = new Error(`LLM HTTP ${res.status}`);
          await new Promise((r) => setTimeout(r, BACKOFF_MS[attempt]));
          continue;
        }
        throw new Error(`LLM HTTP ${res.status}: ${await res.text()}`);
      }

      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content;
      if (typeof content !== "string" || !content.trim()) {
        throw new Error("LLM returned empty content");
      }
      return content;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt < BACKOFF_MS.length) {
        await new Promise((r) => setTimeout(r, BACKOFF_MS[attempt]));
        continue;
      }
    }
  }

  throw lastError ?? new Error("LLM request failed");
}
