import { useTranslations, useLocale } from "next-intl";
import { categories } from "@/data/menu";
import MenuItemCard from "@/components/MenuItemCard";
import DripDivider from "@/components/DripDivider";

export default function MenuPage() {
  const t = useTranslations("menu");
  const locale = useLocale();

  const categoryEmojis: Record<string, string> = {
    cholados: "🍧",
    helados: "🍦",
    fresas: "🍓",
    obleas: "🧇",
    ensaladas: "🥗",
    malteadas: "🥤",
    jugos: "🧃",
  };

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-br from-rosa-claro to-azul-bebe/30 py-12 text-center">
        <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-chocolate">
          {t("title")} 🍨
        </h1>
        <p className="font-body text-chocolate/60 mt-2 text-lg">
          Un capricho refrescante a tu antojo
        </p>

        {/* Category pills */}
        <div className="flex gap-3 justify-center flex-wrap mt-6 px-4">
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.slug}`}
              className="bg-blanco/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-body font-semibold text-chocolate hover:bg-rosa-fuerte hover:text-white transition-colors shadow-sm"
            >
              {categoryEmojis[cat.slug] || "🍨"}{" "}
              {locale === "es" ? cat.nameEs : cat.nameEn}
            </a>
          ))}
        </div>
      </section>

      {/* Menu categories */}
      {categories.map((cat, idx) => (
        <div key={cat.id}>
          {idx > 0 && (
            <DripDivider color={idx % 2 === 0 ? "crema" : "rosa-claro"} />
          )}
          <section
            id={cat.slug}
            className={`py-12 ${idx % 2 === 1 ? "bg-rosa-claro/30" : ""}`}
          >
            <div className="max-w-6xl mx-auto px-4">
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-chocolate mb-2 flex items-center gap-3">
                <span className="text-3xl">
                  {categoryEmojis[cat.slug] || "🍨"}
                </span>
                {locale === "es" ? cat.nameEs : cat.nameEn}
              </h2>
              <div className="w-16 h-1 bg-rosa-fuerte rounded-full mb-8" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cat.items
                  .filter((item) => item.isAvailable)
                  .map((item) => (
                    <MenuItemCard key={item.id} item={item} />
                  ))}
              </div>
            </div>
          </section>
        </div>
      ))}
    </>
  );
}
