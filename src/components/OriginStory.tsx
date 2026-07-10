import { useTranslations } from "next-intl";
import Image from "next/image";
import ScrollReveal from "./ScrollReveal";
import SectionHead from "./SectionHead";

export default function OriginStory() {
  const t = useTranslations("origin");

  const badges = [
    { icon: "🤲", label: t("badge1") },
    { icon: "🍓", label: t("badge2") },
    { icon: "🇨🇴", label: t("badge3") },
  ];

  return (
    <section className="relative overflow-hidden bg-chocolate-dark">
      {/* Background atmospheric image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/stock/pink-shop.jpg"
          alt=""
          fill
          className="object-cover opacity-15"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-chocolate-dark/60" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-20 md:py-28 text-center">
        <ScrollReveal animation="fade-up">
          <SectionHead
            num="02"
            align="center"
            tone="light"
            eyebrow="Rancholados"
            title={t("headline")}
            lead={t("description")}
            className="mb-12"
          />
        </ScrollReveal>

        {/* Stat badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          {badges.map((badge, i) => (
            <ScrollReveal key={i} animation="zoom-in" delay={300 + i * 100}>
              <div className="border border-crema/15 rounded-2xl px-6 py-6 bg-crema/5 backdrop-blur-sm hover:bg-crema/10 transition-colors duration-300">
                <span className="text-3xl block mb-3">{badge.icon}</span>
                <span className="font-heading text-lg font-bold text-crema">
                  {badge.label}
                </span>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
