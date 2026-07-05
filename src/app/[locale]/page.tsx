import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import DripDivider from "@/components/DripDivider";
import ScrollReveal from "@/components/ScrollReveal";
import ImmersiveHero from "@/components/ImmersiveHero";
import BentoCard from "@/components/BentoCard";
import OriginStory from "@/components/OriginStory";
import ProcessStrip from "@/components/ProcessStrip";
import PhotoBreak from "@/components/PhotoBreak";
import Testimonials from "@/components/Testimonials";
import { categories, featuredItemIds, getAllItems } from "@/data/menu";

export default function HomePage() {
  const t = useTranslations();
  const locale = useLocale();
  const allFeatured = getAllItems().filter((item) =>
    featuredItemIds.includes(item.id)
  );
  const heroItem = allFeatured[0];
  const supportingItems = allFeatured.slice(1);

  return (
    <>
      {/* ===== 1. IMMERSIVE HERO ===== */}
      <ImmersiveHero>
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-0 flex flex-col md:flex-row items-center gap-8 md:gap-16 min-h-[calc(100vh-4rem)]">
          {/* Text content */}
          <div className="flex-1 text-center md:text-left max-w-xl">
            <ScrollReveal animation="fade-up">
              <div className="inline-flex items-center gap-2 bg-dorado/10 border border-dorado/20 rounded-full px-4 py-1.5 mb-6">
                <span className="text-sm">🇨🇴</span>
                <span className="font-body text-xs font-semibold text-dorado tracking-wide uppercase">
                  De Cali, Colombia
                </span>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={100}>
              <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-chocolate leading-[0.95] tracking-tight mb-6">
                <span className="block">Cholados,</span>
                <span className="block font-bold text-chocolate/60">
                  {locale === "es" ? "helados y" : "ice cream &"}
                </span>
                <span className="block text-shimmer">
                  {locale === "es" ? "fruta fresca" : "fresh fruit"}
                </span>
              </h1>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={200}>
              <p className="font-body text-lg md:text-xl text-chocolate/60 mb-3 max-w-lg" style={{ textWrap: "balance" } as React.CSSProperties}>
                {t("hero.subtitle")}
              </p>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={250}>
              <p className="font-heading text-xl md:text-2xl text-shimmer italic mb-8">
                &ldquo;{t("hero.tagline")}&rdquo;
              </p>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={300}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link
                  href="/menu"
                  className="bg-rosa-fuerte text-white font-body font-bold px-8 py-3.5 rounded-3xl text-lg hover:bg-rosa-hover hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg shadow-rosa-fuerte/25 text-center"
                >
                  {t("hero.cta")}
                </Link>
                <a
                  href="https://wa.me/14087975538"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-body font-bold px-8 py-3.5 rounded-3xl text-lg hover:bg-[#1da851] hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg shadow-[#25D366]/25 text-center"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </a>
              </div>
            </ScrollReveal>
          </div>

          {/* Hero image */}
          <div className="flex-1 max-w-lg relative flex items-center justify-center">
            <ScrollReveal animation="zoom-in" delay={200}>
              <div className="relative w-72 h-96 md:w-96 md:h-[32rem] mx-auto">
                <Image
                  src="/Cholado.png"
                  alt="Cholado Rancholados"
                  fill
                  className="object-contain drop-shadow-2xl"
                  style={{ transform: "rotate(2deg)" }}
                  priority
                />
                {/* Logo badge */}
                <div className="absolute -top-4 -left-4 md:-top-6 md:-left-6 animate-float bg-blanco/90 backdrop-blur-sm rounded-2xl px-3 py-2 shadow-lg">
                  <Image
                    src="/LogoHero.png"
                    alt="Rancholados logo"
                    width={140}
                    height={39}
                    className="h-8 md:h-10 w-auto"
                  />
                </div>
                {/* Cali badge */}
                <div className="absolute -bottom-2 -right-2 md:-bottom-4 md:-right-4 animate-float bg-[#FCD116] rounded-full px-4 py-2 shadow-lg" style={{ animationDelay: "1.5s" }}>
                  <span className="font-heading text-xs md:text-sm font-bold text-[#003893]">
                    🇨🇴 De Cali
                  </span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </ImmersiveHero>

      {/* ===== 2. ORIGIN STORY ===== */}
      <OriginStory />

      <DripDivider color="crema" />

      {/* ===== 3. SIGNATURE CREATIONS BENTO GRID ===== */}
      <section className="relative bg-crema texture-noise">
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 md:py-28">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-12">
              <p className="font-body text-rosa-fuerte text-sm tracking-[0.2em] uppercase mb-3">
                {locale === "es" ? "Lo mejor de la casa" : "House favorites"}
              </p>
              <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-chocolate">
                {t("featured.title")}
              </h2>
              <p className="font-body text-chocolate/60 mt-2">
                {t("featured.subtitle")}
              </p>
            </div>
          </ScrollReveal>

          {/* Bento grid */}
          <ScrollReveal animation="fade-up" delay={150}>
            <div className="grid grid-cols-2 lg:grid-cols-4 auto-rows-[200px] md:auto-rows-[260px] gap-3 md:gap-4">
              {/* Hero card - 2x2 */}
              {heroItem && (
                <BentoCard item={heroItem} isHero />
              )}
              {/* Supporting cards */}
              {supportingItems.map((item) => (
                <BentoCard key={item.id} item={item} />
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={400}>
            <div className="text-center mt-12">
              <Link
                href="/menu"
                className="inline-block bg-chocolate text-crema font-body font-bold px-8 py-3.5 rounded-3xl text-lg hover:bg-chocolate-light hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg shadow-chocolate/20"
              >
                {t("menu.viewFull")} →
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== 4. HOW WE MAKE IT ===== */}
      <ProcessStrip />

      {/* ===== 5. FULL-WIDTH PHOTO BREAK ===== */}
      <PhotoBreak />

      {/* ===== 6. TESTIMONIALS + SOCIAL PROOF ===== */}
      <Testimonials />

      <DripDivider color="crema" />

      {/* ===== 7. LOCATION ===== */}
      <section className="relative bg-crema texture-noise">
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 md:py-28">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-10">
              <p className="font-body text-verde-cali text-sm tracking-[0.2em] uppercase mb-3">
                {locale === "es" ? "Encuéntranos" : "Find us"}
              </p>
              <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-chocolate">
                {t("location.title")}
              </h2>
              <p className="font-body text-chocolate/60 mt-2">
                {t("location.subtitle")}
              </p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <ScrollReveal animation="fade-left">
              <div className="rounded-2xl overflow-hidden shadow-lg h-72 md:h-80">
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
            </ScrollReveal>
            <ScrollReveal animation="fade-right">
              <div className="bg-blanco rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(61,35,20,0.08)] card-interactive">
                <div className="flex h-1.5">
                  <div className="flex-[2] bg-[#FCD116]" />
                  <div className="flex-1 bg-[#003893]" />
                  <div className="flex-1 bg-[#CE1126]" />
                </div>
                <div className="p-8">
                  <h3 className="font-heading text-2xl font-bold text-chocolate mb-5">
                    Rancholados 🇨🇴
                  </h3>
                  <div className="space-y-4 font-body text-chocolate/70">
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
                  <div className="flex flex-col sm:flex-row gap-3 mt-8">
                    <a
                      href="https://maps.google.com/?q=1075+Tully+Rd+Suite+24+San+Jose+CA+95122"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-rosa-fuerte text-white font-body font-bold px-6 py-2.5 rounded-3xl text-sm hover:bg-rosa-hover hover:scale-105 active:scale-95 transition-all duration-200 text-center shadow-lg shadow-rosa-fuerte/15"
                    >
                      {t("contact.getDirections")}
                    </a>
                    <a
                      href="https://www.instagram.com/rancholados/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-rosa-claro text-chocolate font-body font-bold px-6 py-2.5 rounded-3xl text-sm hover:bg-azul-bebe hover:scale-105 active:scale-95 transition-all duration-200 text-center"
                    >
                      📸 Instagram
                    </a>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <DripDivider color="rosa-claro" flip />

      {/* ===== 8. CATEGORY QUICK SCROLL ===== */}
      <section className="bg-rosa-claro/40 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-8">
              <h3 className="font-heading text-2xl font-bold text-chocolate">
                {locale === "es" ? "Explora el menú" : "Explore the menu"}
              </h3>
            </div>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={100}>
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((cat) => {
                const emoji =
                  cat.slug === "cholados" ? "🍧" :
                  cat.slug === "helados" ? "🍦" :
                  cat.slug === "fresas" ? "🍓" :
                  cat.slug === "obleas" ? "🧇" :
                  cat.slug === "ensaladas" ? "🥗" :
                  cat.slug === "malteadas" ? "🥤" :
                  cat.slug === "jugos" ? "🧃" : "🍨";
                return (
                  <Link
                    key={cat.id}
                    href={`/menu#${cat.slug}`}
                    className="bg-blanco rounded-2xl px-6 py-4 shadow-sm text-center min-w-[140px] pill-interactive"
                  >
                    <span className="text-3xl block mb-1">{emoji}</span>
                    <span className="font-body font-semibold text-sm text-chocolate">
                      {locale === "es" ? cat.nameEs : cat.nameEn}
                    </span>
                  </Link>
                );
              })}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
