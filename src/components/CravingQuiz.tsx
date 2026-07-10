"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { formatPrice } from "@/data/menu";
import ScrollReveal from "./ScrollReveal";
import SectionHead from "./SectionHead";

const WHATSAPP_NUMBER = "14087975538";

const MOODS = ["contento", "nostalgico", "aventurero", "relajado"] as const;
const CRAVINGS = ["frio", "cremoso", "fruta", "dulce"] as const;
const WEATHERS = ["calor", "fresco", "frio"] as const;

const EMOJI: Record<string, string> = {
  contento: "😄",
  nostalgico: "🥹",
  aventurero: "🤠",
  relajado: "😌",
  frio: "🧊",
  cremoso: "🍦",
  fruta: "🍓",
  dulce: "🍯",
  calor: "☀️",
  fresco: "⛅",
  "weather-frio": "🌧️",
};

interface DisplayItem {
  id: string;
  name: string;
  desc: string;
  priceCents: number;
  image: string | null;
}

interface RecommendResult {
  item: DisplayItem;
  alt: DisplayItem;
  pitch: string | null;
  source: "ai" | "fallback";
}

function PillGroup({
  label,
  options,
  value,
  onChange,
  emojiPrefix = "",
}: {
  label: string;
  options: readonly string[];
  value: string | null;
  onChange: (v: string) => void;
  emojiPrefix?: string;
}) {
  const t = useTranslations("recommend");
  return (
    <div>
      <p className="font-body text-xs font-extrabold uppercase tracking-[0.14em] text-chocolate/50 mb-2.5">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const selected = value === opt;
          return (
            <button
              key={opt}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(opt)}
              className={`pill-interactive inline-flex items-center gap-1.5 rounded-full border px-4 py-2 font-body text-sm font-extrabold transition-colors ${
                selected
                  ? "border-rosa-fuerte bg-rosa-fuerte text-white shadow-md shadow-rosa-fuerte/25"
                  : "border-chocolate/15 bg-blanco text-chocolate/75 hover:border-rosa-fuerte/40 hover:text-rosa-fuerte"
              }`}
            >
              <span aria-hidden>{EMOJI[emojiPrefix + opt] ?? EMOJI[opt]}</span>
              {t(`options.${emojiPrefix}${opt}`)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function CravingQuiz() {
  const t = useTranslations("recommend");
  const locale = useLocale();

  const [mood, setMood] = useState<string | null>(null);
  const [craving, setCraving] = useState<string | null>(null);
  const [weather, setWeather] = useState<string | null>(null);
  const [antojo, setAntojo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [result, setResult] = useState<RecommendResult | null>(null);

  const ready = mood && craving && weather;

  async function submit() {
    if (!ready || loading) return;
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          mood,
          craving,
          weather,
          antojo: antojo.trim() || undefined,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setResult((await res.json()) as RecommendResult);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setResult(null);
    setError(false);
  }

  const whatsappUrl = result
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        locale === "es"
          ? `Hola! Quiero: ${result.item.name} (${formatPrice(result.item.priceCents)})`
          : `Hi! I'd like: ${result.item.name} (${formatPrice(result.item.priceCents)})`
      )}`
    : "";

  return (
    <section id="antojo" className="scroll-mt-24 bg-rosa-claro/30 py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4">
        <ScrollReveal animation="fade-up">
          <SectionHead
            num="05"
            align="center"
            eyebrow={t("eyebrow")}
            title={t("title")}
            lead={t("intro")}
            className="mb-10"
          />
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={100}>
          <div className="rounded-2xl border border-chocolate/10 bg-blanco p-6 md:p-8 shadow-[0_4px_24px_rgba(61,35,20,0.08)]">
            {!result ? (
              <div className="grid gap-6">
                <PillGroup
                  label={t("moodLabel")}
                  options={MOODS}
                  value={mood}
                  onChange={setMood}
                />
                <PillGroup
                  label={t("cravingLabel")}
                  options={CRAVINGS}
                  value={craving}
                  onChange={setCraving}
                />
                <PillGroup
                  label={t("weatherLabel")}
                  options={WEATHERS}
                  value={weather}
                  onChange={setWeather}
                  emojiPrefix="weather-"
                />

                <div>
                  <label
                    htmlFor="antojo-input"
                    className="font-body text-xs font-extrabold uppercase tracking-[0.14em] text-chocolate/50 mb-2.5 block"
                  >
                    {t("antojoLabel")}
                  </label>
                  <input
                    id="antojo-input"
                    type="text"
                    maxLength={120}
                    value={antojo}
                    onChange={(e) => setAntojo(e.target.value)}
                    placeholder={t("antojoPlaceholder")}
                    className="w-full rounded-full border border-chocolate/15 bg-crema/60 px-5 py-3 font-body text-sm text-chocolate placeholder:text-chocolate/35 focus:border-rosa-fuerte/50 outline-none"
                  />
                </div>

                {error && (
                  <p className="font-body text-sm font-bold text-red-600">
                    {t("errorRetry")}
                  </p>
                )}

                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={submit}
                    disabled={!ready || loading}
                    className="btn-shine inline-flex items-center justify-center gap-2 bg-rosa-fuerte text-white font-body font-extrabold px-8 py-3.5 rounded-full text-base hover:bg-rosa-hover shadow-lg shadow-rosa-fuerte/20 disabled:opacity-40 disabled:pointer-events-none"
                  >
                    {loading ? (
                      <>
                        <span className="inline-flex gap-1" aria-hidden>
                          <span className="typing-dot h-1.5 w-1.5 rounded-full bg-white" />
                          <span className="typing-dot h-1.5 w-1.5 rounded-full bg-white" />
                          <span className="typing-dot h-1.5 w-1.5 rounded-full bg-white" />
                        </span>
                        {t("loading")}
                      </>
                    ) : (
                      <>✨ {t("submit")}</>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr] items-center popup-card-in">
                <div className="relative h-56 md:h-64 overflow-hidden rounded-xl bg-gradient-to-br from-rosa-claro to-azul-bebe">
                  {result.item.image ? (
                    <Image
                      src={result.item.image}
                      alt={result.item.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 40vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="text-6xl">🍨</span>
                    </div>
                  )}
                </div>

                <div>
                  <p className="sec-eyebrow font-body mb-2" data-num="✶">
                    {t("resultTitle")}
                  </p>
                  <h3 className="font-heading text-2xl md:text-3xl font-extrabold text-chocolate leading-tight">
                    {result.item.name}
                  </h3>
                  <p className="font-heading text-xl font-extrabold text-rosa-fuerte mt-1 mb-3">
                    {formatPrice(result.item.priceCents)}
                  </p>

                  <div className="relative rounded-xl bg-rosa-claro/60 p-4 mb-4">
                    <p className="font-body text-sm text-chocolate/80 italic">
                      &ldquo;{result.pitch ?? t("fallbackPitch")}&rdquo;
                    </p>
                  </div>

                  <p className="font-body text-xs font-bold text-chocolate/50 mb-4">
                    {t("altPrefix")}{" "}
                    <span className="text-chocolate">
                      {result.alt.name} ({formatPrice(result.alt.priceCents)})
                    </span>
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-shine inline-flex items-center gap-2 bg-[#25D366] text-white font-body font-extrabold px-6 py-3 rounded-full text-sm hover:bg-[#1da851] shadow-lg shadow-[#25D366]/20"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      {t("orderCta")}
                    </a>
                    <button
                      type="button"
                      onClick={reset}
                      className="btn-shine inline-flex items-center justify-center bg-blanco text-chocolate font-body font-extrabold px-6 py-3 rounded-full text-sm border border-chocolate/15 hover:border-rosa-fuerte/40 hover:text-rosa-fuerte"
                    >
                      {t("tryAgain")}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
