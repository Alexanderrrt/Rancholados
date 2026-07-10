import { getAllItems, getItemById, type MenuItem } from "@/data/menu";

export const MOODS = ["contento", "nostalgico", "aventurero", "relajado"] as const;
export const CRAVINGS = ["frio", "cremoso", "fruta", "dulce"] as const;
export const WEATHERS = ["calor", "fresco", "frio"] as const;

export type Mood = (typeof MOODS)[number];
export type Craving = (typeof CRAVINGS)[number];
export type Weather = (typeof WEATHERS)[number];

export interface QuizAnswers {
  locale: "es" | "en";
  mood: Mood;
  craving: Craving;
  weather: Weather;
  antojo?: string;
}

export function buildMenuContext(locale: "es" | "en"): string {
  return getAllItems()
    .filter((item) => item.isAvailable)
    .map((item) =>
      locale === "es"
        ? `${item.id} | ${item.nameEs} | ${item.descEs}`
        : `${item.id} | ${item.nameEn} | ${item.descEn}`
    )
    .join("\n");
}

// Deterministic pick when the LLM is unavailable or returns garbage.
export function fallbackRecommend(answers: {
  craving: Craving;
  weather: Weather;
}): { itemId: string; altItemId: string } {
  if (answers.weather === "frio") {
    return answers.craving === "cremoso"
      ? { itemId: "malteada-arequipe", altItemId: "oblea-clasica" }
      : { itemId: "oblea-especial", altItemId: "malteada-arequipe" };
  }
  switch (answers.craving) {
    case "frio":
      return { itemId: "cholado-clasico", altItemId: "lulada" };
    case "cremoso":
      return { itemId: "malteada-oreo", altItemId: "fresas-con-crema" };
    case "fruta":
      return { itemId: "ensalada-frutas", altItemId: "salpicon" };
    case "dulce":
      return { itemId: "oblea-especial", altItemId: "fresas-helado" };
    default:
      return { itemId: "cholado-clasico", altItemId: "fresas-con-crema" };
  }
}

const MAX_PITCH_LENGTH = 280;

export interface ValidatedRecommendation {
  item: MenuItem;
  alt: MenuItem;
  pitch: string | null;
}

// The model only ever contributes ids + pitch text; everything the user sees
// (names, prices, images) is resolved here from the real menu.
export function validateRecommendation(
  raw: string,
  answers: { craving: Craving; weather: Weather }
): ValidatedRecommendation {
  const fallback = fallbackRecommend(answers);
  let itemId = fallback.itemId;
  let altItemId = fallback.altItemId;
  let pitch: string | null = null;

  try {
    const cleaned = raw.replace(/```(?:json)?/g, "").trim();
    const parsed = JSON.parse(cleaned);

    const candidate = getItemById(String(parsed.itemId ?? ""));
    if (candidate?.isAvailable) itemId = candidate.id;

    const altCandidate = getItemById(String(parsed.altItemId ?? ""));
    if (altCandidate?.isAvailable && altCandidate.id !== itemId) {
      altItemId = altCandidate.id;
    }

    if (typeof parsed.pitch === "string" && parsed.pitch.trim()) {
      pitch = parsed.pitch.trim().slice(0, MAX_PITCH_LENGTH);
    }
  } catch {
    // keep fallback values
  }

  if (altItemId === itemId) altItemId = fallback.itemId === itemId ? fallback.altItemId : fallback.itemId;

  return {
    item: getItemById(itemId)!,
    alt: getItemById(altItemId)!,
    pitch,
  };
}
