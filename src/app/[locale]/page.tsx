import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import DripDivider from "@/components/DripDivider";
import MenuItemCard from "@/components/MenuItemCard";
import { categories, featuredItemIds, getAllItems } from "@/data/menu";

export default function HomePage() {
  const t = useTranslations();
  const featuredItems = getAllItems().filter((item) =>
    featuredItemIds.includes(item.id)
  );

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-rosa-claro via-blanco to-azul-bebe">
        {/* Floating fruit accents */}
        <div className="absolute top-8 left-8 text-4xl animate-float opacity-60" style={{ "--rotate": "-12deg" } as React.CSSProperties}>🍓</div>
        <div className="absolute top-20 right-12 text-3xl animate-float opacity-50" style={{ "--rotate": "15deg", animationDelay: "0.5s" } as React.CSSProperties}>🥭</div>
        <div className="absolute bottom-16 left-1/4 text-3xl animate-float opacity-40" style={{ "--rotate": "8deg", animationDelay: "1s" } as React.CSSProperties}>🥥</div>

        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Text */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold text-chocolate leading-tight mb-4">
              {t("hero.title")}
            </h1>
            <p className="font-body text-lg md:text-xl text-chocolate/70 mb-3 max-w-lg">
              {t("hero.subtitle")}
            </p>
            <p className="font-heading text-xl md:text-2xl text-rosa-fuerte italic mb-8">
              &ldquo;{t("hero.tagline")}&rdquo;
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                href="/menu"
                className="bg-rosa-fuerte text-white font-body font-bold px-8 py-3 rounded-3xl text-lg hover:bg-rosa-hover transition-colors shadow-lg shadow-rosa-fuerte/20 text-center"
              >
                {t("hero.cta")}
              </Link>
              <a
                href="https://wa.me/14087975538"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-body font-bold px-8 py-3 rounded-3xl text-lg hover:bg-[#1da851] transition-colors shadow-lg shadow-[#25D366]/20 text-center"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </a>
            </div>
          </div>

          {/* Hero image + logo */}
          <div className="flex-1 max-w-md relative flex items-center justify-center">
            <div className="relative w-72 h-96 md:w-80 md:h-[28rem] mx-auto">
              <Image
                src="/images/brand/oreo-shake-promo.jpg"
                alt="Rancholados"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
              <div className="absolute -top-6 -left-6 w-24 h-24 md:w-28 md:h-28">
                <Image
                  src="/logo.jpg"
                  alt="Rancholados logo"
                  width={112}
                  height={112}
                  className="rounded-full drop-shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <DripDivider color="crema" />

      {/* Featured Items */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-chocolate">
            {t("featured.title")} ✨
          </h2>
          <p className="font-body text-chocolate/60 mt-2">
            {t("featured.subtitle")}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredItems.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/menu"
            className="inline-block bg-rosa-claro text-rosa-fuerte font-body font-bold px-8 py-3 rounded-3xl text-lg hover:bg-rosa-fuerte hover:text-white transition-colors"
          >
            {t("menu.viewFull")} →
          </Link>
        </div>
      </section>

      <DripDivider color="rosa-claro" />

      {/* About Teaser */}
      <section className="bg-rosa-claro">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-chocolate mb-4">
            {t("about.title")} 🇨🇴
          </h2>
          <p className="font-body text-lg text-chocolate/70 max-w-2xl mx-auto mb-6">
            {t("about.content")}
          </p>
          <Link
            href="/about"
            className="inline-block bg-chocolate text-crema font-body font-bold px-8 py-3 rounded-3xl text-lg hover:bg-chocolate/80 transition-colors"
          >
            {t("about.title")} →
          </Link>
        </div>
      </section>

      <DripDivider color="crema" flip />

      {/* Location Teaser */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-chocolate">
            {t("location.title")} 📍
          </h2>
          <p className="font-body text-chocolate/60 mt-2">
            {t("location.subtitle")}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Map */}
          <div className="rounded-xl overflow-hidden shadow-lg h-72 md:h-80">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3174.5!2d-121.845!3d37.312!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808e3345fd3c9c59%3A0x6d7ae05d3843f36f!2s1075%20Tully%20Rd%2C%20San%20Jose%2C%20CA%2095122!5e0!3m2!1sen!2sus!4v1"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Rancholados Location"
            />
          </div>
          {/* Info */}
          <div className="bg-blanco rounded-xl p-8 shadow-[0_4px_20px_rgba(61,35,20,0.08)]">
            <h3 className="font-heading text-2xl font-bold text-chocolate mb-4">
              Rancholados
            </h3>
            <div className="space-y-3 font-body text-chocolate/70">
              <p className="flex items-start gap-3">
                <span className="text-xl">📍</span>
                <span>
                  {t("contact.address")}
                  <br />
                  {t("contact.city")}
                </span>
              </p>
              <p className="flex items-center gap-3">
                <span className="text-xl">📞</span>
                <a href="tel:+14087975538" className="hover:text-rosa-fuerte transition-colors">
                  {t("contact.phone")}
                </a>
              </p>
              <p className="flex items-center gap-3">
                <span className="text-xl">🕐</span>
                <span>{t("contact.hours")}</span>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <a
                href="https://maps.google.com/?q=1075+Tully+Rd+Suite+24+San+Jose+CA+95122"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-rosa-fuerte text-white font-body font-bold px-6 py-2.5 rounded-3xl text-sm hover:bg-rosa-hover transition-colors text-center"
              >
                {t("contact.getDirections")}
              </a>
              <a
                href="https://www.instagram.com/rancholados/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-rosa-claro text-chocolate font-body font-bold px-6 py-2.5 rounded-3xl text-sm hover:bg-azul-bebe transition-colors text-center"
              >
                📸 Instagram
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Category Quick Scroll */}
      <section className="bg-azul-bebe/30 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/menu#${cat.slug}`}
                className="flex-shrink-0 bg-blanco rounded-2xl px-6 py-4 shadow-sm hover:shadow-md transition-shadow text-center min-w-[140px]"
              >
                <span className="text-3xl block mb-1">
                  {cat.slug === "cholados" && "🍧"}
                  {cat.slug === "helados" && "🍦"}
                  {cat.slug === "fresas" && "🍓"}
                  {cat.slug === "obleas" && "🧇"}
                  {cat.slug === "ensaladas" && "🥗"}
                  {cat.slug === "malteadas" && "🥤"}
                  {cat.slug === "jugos" && "🧃"}
                </span>
                <span className="font-body font-semibold text-sm text-chocolate">
                  {cat.nameEs}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
