import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { categories } from "@/data/menu";
import MenuItemCard from "@/components/MenuItemCard";
import ScrollReveal from "@/components/ScrollReveal";

export default function MenuPage() {
  const t = useTranslations("menu");
  const locale = useLocale();
  const isEs = locale === "es";

  return (
    <>
      <section className="relative overflow-hidden bg-crema border-b border-chocolate/10">
        <div className="absolute inset-0">
          <Image
            src="/Cholado.png"
            alt=""
            fill
            className="object-cover object-[76%_42%] opacity-35"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,248,240,0.98)_0%,rgba(255,248,240,0.86)_48%,rgba(255,248,240,0.45)_100%)]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-10 md:py-14">
          <p className="font-body text-rosa-fuerte text-sm tracking-[0.2em] uppercase mb-3">
            {isEs ? "Hecho a mano" : "Made by hand"}
          </p>
          <h1 className="font-heading text-4xl md:text-6xl font-extrabold text-chocolate leading-tight">
            {t("title")}
          </h1>
          <p className="font-body text-lg text-chocolate/65 max-w-2xl mt-2">
            {t("subtitle")}
          </p>
        </div>
      </section>

      <nav className="sticky top-[4.15rem] z-30 bg-crema/95 backdrop-blur border-b border-chocolate/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`#${cat.slug}`}
                className="shrink-0 rounded-full border border-chocolate/10 bg-blanco px-4 py-2 font-body text-sm font-extrabold text-chocolate/75 shadow-sm hover:border-rosa-fuerte/40 hover:text-rosa-fuerte transition-colors"
              >
                {isEs ? cat.nameEs : cat.nameEn}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <div className="bg-crema">
        {categories.map((cat, idx) => (
          <section
            key={cat.id}
            id={cat.slug}
            className={`scroll-mt-32 py-12 md:py-16 ${
              idx % 2 === 1 ? "bg-rosa-claro/25" : ""
            }`}
          >
            <div className="max-w-6xl mx-auto px-4">
              <ScrollReveal animation="fade-up">
                <div className="flex items-center gap-4 mb-7">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-rosa-claro shadow-sm">
                    {cat.image ? (
                      <Image
                        src={cat.image}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-arequipe to-chocolate" />
                    )}
                  </div>
                  <div>
                    <p className="font-body text-xs font-extrabold uppercase tracking-[0.14em] text-rosa-fuerte">
                      {String(idx + 1).padStart(2, "0")}
                    </p>
                    <h2 className="font-heading text-2xl md:text-4xl font-extrabold text-chocolate leading-tight">
                      {isEs ? cat.nameEs : cat.nameEn}
                    </h2>
                  </div>
                </div>
              </ScrollReveal>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {cat.items
                  .filter((item) => item.isAvailable)
                  .map((item, i) => (
                    <ScrollReveal
                      key={item.id}
                      animation="fade-up"
                      delay={i * 70}
                    >
                      <MenuItemCard item={item} />
                    </ScrollReveal>
                  ))}
              </div>
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
