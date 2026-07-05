import { useTranslations } from "next-intl";
import Image from "next/image";
import ScrollReveal from "./ScrollReveal";

export default function OriginStory() {
  const t = useTranslations("origin");

  const badges = [
    { icon: "🤲", label: t("badge1") },
    { icon: "🍓", label: t("badge2") },
    { icon: "🇨🇴", label: t("badge3") },
  ];

  return (
    <section className="relative overflow-hidden bg-chocolate-dark texture-noise">
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
          <p className="font-body text-dorado text-sm tracking-[0.2em] uppercase mb-4">
            Rancholados
          </p>
        </ScrollReveal>
        <ScrollReveal animation="fade-up" delay={100}>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-extrabold text-crema leading-tight mb-6">
            {t("headline")}
          </h2>
        </ScrollReveal>
        <ScrollReveal animation="fade-up" delay={200}>
          <p className="font-body text-lg text-crema/60 max-w-2xl mx-auto mb-12">
            {t("description")}
          </p>
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
