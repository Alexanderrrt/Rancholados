import { useTranslations } from "next-intl";
import Image from "next/image";
import DripDivider from "@/components/DripDivider";

export default function AboutPage() {
  const t = useTranslations("about");

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-rosa-claro via-blanco to-azul-bebe py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-chocolate mb-3">
            {t("title")} 🇨🇴
          </h1>
          <p className="font-heading text-xl md:text-2xl text-rosa-fuerte">
            {t("subtitle")}
          </p>
        </div>
      </section>

      <DripDivider color="crema" />

      {/* Story */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-rosa-claro to-azul-bebe flex items-center justify-center">
              <Image
                src="/logo.jpg"
                alt="Rancholados"
                width={280}
                height={280}
                className="rounded-full drop-shadow-xl"
              />
            </div>
          </div>
          <div>
            <p className="font-body text-lg text-chocolate/80 leading-relaxed mb-6">
              {t("content")}
            </p>
            <p className="font-body text-lg text-chocolate/80 leading-relaxed mb-6">
              {t("content2")}
            </p>
            <p className="font-heading text-xl text-rosa-fuerte italic">
              {t("cta")}
            </p>
          </div>
        </div>
      </section>

      <DripDivider color="rosa-claro" />

      {/* Values */}
      <section className="bg-rosa-claro/30 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-blanco rounded-2xl p-8 shadow-sm">
              <span className="text-4xl block mb-3">🤲</span>
              <h3 className="font-heading text-xl font-bold text-chocolate mb-2">
                Hecho a Mano
              </h3>
              <p className="font-body text-sm text-chocolate/60">
                Cada helado, cada cholado, cada oblea — preparados con paciencia
                y las recetas de casa.
              </p>
            </div>
            <div className="bg-blanco rounded-2xl p-8 shadow-sm">
              <span className="text-4xl block mb-3">🌿</span>
              <h3 className="font-heading text-xl font-bold text-chocolate mb-2">
                Fruta Fresca
              </h3>
              <p className="font-body text-sm text-chocolate/60">
                La fruta más fresca del barrio, picada al momento. Sin
                conservantes, sin atajos.
              </p>
            </div>
            <div className="bg-blanco rounded-2xl p-8 shadow-sm">
              <span className="text-4xl block mb-3">❤️</span>
              <h3 className="font-heading text-xl font-bold text-chocolate mb-2">
                Sabor Colombiano
              </h3>
              <p className="font-body text-sm text-chocolate/60">
                Guanábana, lulo, maracuyá, arequipe — los sabores de Colombia,
                aquí en San José.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
