import { useTranslations } from "next-intl";
import Image from "next/image";
import DripDivider from "@/components/DripDivider";
import ScrollReveal from "@/components/ScrollReveal";

export default function AboutPage() {
  const t = useTranslations("about");

  return (
    <>
      {/* Hero */}
      <section className="hero-gradient py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-chocolate mb-3">
            {t("title")} 🇨🇴
          </h1>
          <p className="font-heading text-xl md:text-2xl text-shimmer">
            {t("subtitle")}
          </p>
        </div>
      </section>

      <DripDivider color="crema" />

      {/* Story */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <ScrollReveal animation="fade-left">
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-rosa-claro to-azul-bebe flex items-center justify-center">
              <Image
                src="/logo.jpg"
                alt="Rancholados"
                width={280}
                height={280}
                className="rounded-full drop-shadow-xl"
              />
            </div>
          </ScrollReveal>
          <div>
            <ScrollReveal animation="fade-right">
              <p className="font-body text-lg text-chocolate/80 leading-relaxed mb-6">
                {t("content")}
              </p>
            </ScrollReveal>
            <ScrollReveal animation="fade-right" delay={150}>
              <p className="font-body text-lg text-chocolate/80 leading-relaxed mb-6">
                {t("content2")}
              </p>
            </ScrollReveal>
            <ScrollReveal animation="fade-right" delay={300}>
              <p className="font-heading text-xl text-rosa-fuerte italic">
                {t("cta")}
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <DripDivider color="rosa-claro" />

      {/* Values */}
      <section className="bg-rosa-claro/30 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { emoji: "🤲", title: "Hecho a Mano", desc: "Cada helado, cada cholado, cada oblea — preparados con paciencia y las recetas de casa." },
              { emoji: "🌿", title: "Fruta Fresca", desc: "La fruta más fresca del barrio, picada al momento. Sin conservantes, sin atajos." },
              { emoji: "❤️", title: "Sabor Colombiano", desc: "Guanábana, lulo, maracuyá, arequipe — los sabores de Colombia, aquí en San José." },
            ].map((v, i) => (
              <ScrollReveal key={v.title} animation="flip-up" delay={i * 150}>
                <div className="bg-blanco rounded-2xl p-8 shadow-sm card-interactive">
                  <span className="text-4xl block mb-3">{v.emoji}</span>
                  <h3 className="font-heading text-xl font-bold text-chocolate mb-2">
                    {v.title}
                  </h3>
                  <p className="font-body text-sm text-chocolate/60">{v.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
