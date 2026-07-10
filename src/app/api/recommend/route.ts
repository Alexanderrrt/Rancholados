import { chatCompletion, isLLMConfigured } from "@/lib/llm";
import {
  MOODS,
  CRAVINGS,
  WEATHERS,
  buildMenuContext,
  fallbackRecommend,
  validateRecommendation,
  type QuizAnswers,
} from "@/lib/recommend";
import { getItemById, type MenuItem } from "@/data/menu";

// Per-instance in-memory rate limit — fine at this site's scale.
const RATE_LIMIT = 10;
const WINDOW_MS = 5 * 60 * 1000;
const hits = new Map<string, { count: number; windowStart: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  if (hits.size > 1000) {
    for (const [key, entry] of hits) {
      if (now - entry.windowStart > WINDOW_MS) hits.delete(key);
    }
  }
  const entry = hits.get(ip);
  if (!entry || now - entry.windowStart > WINDOW_MS) {
    hits.set(ip, { count: 1, windowStart: now });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

function parseBody(body: unknown): QuizAnswers | null {
  if (typeof body !== "object" || body === null) return null;
  const b = body as Record<string, unknown>;
  const locale = b.locale === "en" ? "en" : b.locale === "es" ? "es" : null;
  if (!locale) return null;
  if (!MOODS.includes(b.mood as never)) return null;
  if (!CRAVINGS.includes(b.craving as never)) return null;
  if (!WEATHERS.includes(b.weather as never)) return null;
  const antojo =
    typeof b.antojo === "string" ? b.antojo.trim().slice(0, 120) : undefined;
  return {
    locale,
    mood: b.mood as QuizAnswers["mood"],
    craving: b.craving as QuizAnswers["craving"],
    weather: b.weather as QuizAnswers["weather"],
    antojo: antojo || undefined,
  };
}

function toDisplay(item: MenuItem, locale: "es" | "en") {
  return {
    id: item.id,
    name: locale === "es" ? item.nameEs : item.nameEn,
    desc: locale === "es" ? item.descEs : item.descEn,
    priceCents: item.priceCents,
    image: item.image,
  };
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return Response.json(
      { error: "rate_limited" },
      { status: 429, headers: { "Retry-After": "300" } }
    );
  }

  let answers: QuizAnswers | null = null;
  try {
    answers = parseBody(await request.json());
  } catch {
    answers = null;
  }
  if (!answers) {
    return Response.json({ error: "invalid_body" }, { status: 400 });
  }

  const { locale } = answers;

  const respond = (
    itemId: string,
    altItemId: string,
    pitch: string | null,
    source: "ai" | "fallback"
  ) =>
    Response.json({
      item: toDisplay(getItemById(itemId)!, locale),
      alt: toDisplay(getItemById(altItemId)!, locale),
      pitch,
      source,
    });

  if (!isLLMConfigured) {
    const fb = fallbackRecommend(answers);
    return respond(fb.itemId, fb.altItemId, null, "fallback");
  }

  const language = locale === "es" ? "Spanish" : "English";
  const system = [
    "You are the playful, warm voice of Rancholados, a Colombian fruteria and heladeria in San Jose, CA, with roots in Cali.",
    "Given the menu and a customer's quiz answers, pick EXACTLY ONE itemId and ONE different altItemId FROM THE PROVIDED IDS ONLY.",
    'Respond ONLY with JSON: {"itemId": "...", "altItemId": "...", "pitch": "..."}.',
    `The pitch is 1-2 short sentences in ${language}, warm and fun with a caleno touch, referencing their answers.`,
    "Never mention prices. Never invent menu items.",
  ].join(" ");

  const user = [
    `Menu (id | name | description):\n${buildMenuContext(locale)}`,
    `Customer quiz answers: mood=${answers.mood}, craving=${answers.craving}, weather=${answers.weather}.`,
    answers.antojo ? `They also said they crave: "${answers.antojo}"` : "",
  ]
    .filter(Boolean)
    .join("\n\n");

  try {
    const raw = await chatCompletion([
      { role: "system", content: system },
      { role: "user", content: user },
    ]);
    const validated = validateRecommendation(raw, answers);
    return respond(validated.item.id, validated.alt.id, validated.pitch, "ai");
  } catch {
    const fb = fallbackRecommend(answers);
    return respond(fb.itemId, fb.altItemId, null, "fallback");
  }
}
