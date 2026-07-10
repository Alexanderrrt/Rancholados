import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import BentoCard from "@/components/BentoCard";
import CravingQuiz from "@/components/CravingQuiz";
import DripDivider from "@/components/DripDivider";
import ImmersiveHero from "@/components/ImmersiveHero";
import MarqueeBand from "@/components/MarqueeBand";
import OriginStory from "@/components/OriginStory";
import PhotoBreak from "@/components/PhotoBreak";
import ProcessStrip from "@/components/ProcessStrip";
import PromoBanner from "@/components/PromoBanner";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHead from "@/components/SectionHead";
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
  const isEs = locale === "es";

  return (
    <>
      <ImmersiveHero>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16 lg:py-20">
          <div className="max-w-2xl pt-4 md:pt-8 pb-10 md:pb-14">
            <ScrollReveal animation="fade-up" duration={700} threshold={0.05}>
              <div className="inline-flex items-center gap-2 bg-blanco/80 border border-chocolate/10 rounded-full px-4 py-2 shadow-sm backdrop-blur mb-5">
                <span className="h-2 w-2 rounded-full bg-rosa-fuerte" />
                <span className="font-body text-xs font-extrabold text-chocolate/70 tracking-[0.16em] uppercase">
                  {isEs ? "De Cali a San Jose" : "From Cali to San Jose"}
                </span>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={100} duration={700} threshold={0.05}>
              <h1 className="font-heading display-xl font-extrabold text-chocolate mb-5">
                Rancholados
              </h1>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={200} duration={700} threshold={0.05}>
              <p className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold text-rosa-fuerte leading-tight text-balance mb-4">
                {isEs ? (
                  <>
                    <em className="accent-word not-italic">Cholados</em>, helados
                    caseros y fruta fresca
                  </>
                ) : (
                  <>
                    <em className="accent-word not-italic">Cholados</em>, homemade
                    ice cream and fresh fruit
                  </>
                )}
              </p>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={300} duration={700} threshold={0.05}>
              <p className="font-body text-base sm:text-lg md:text-xl text-chocolate/70 max-w-xl text-balance mb-3">
                {t("hero.subtitle")}
              </p>
              <p className="font-heading text-lg sm:text-xl text-chocolate/65 italic mb-7">
                &ldquo;{t("hero.tagline")}&rdquo;
              </p>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={400} duration={700} threshold={0.05}>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/menu"
                  className="btn-shine inline-flex items-center justify-center bg-rosa-fuerte text-white font-body font-extrabold px-7 py-3.5 rounded-full text-base sm:text-lg hover:bg-rosa-hover shadow-lg shadow-rosa-fuerte/20"
                >
                  {t("hero.cta")}
                </Link>
                <a
                  href="https://wa.me/14087975538"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-shine inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-body font-extrabold px-7 py-3.5 rounded-full text-base sm:text-lg hover:bg-[#1da851] shadow-lg shadow-[#25D366]/20"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </a>
              </div>

              <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-2.5 max-w-xl">
                {[
                  {
                    label: isEs ? "Abierto diario" : "Open daily",
                    value: "12 PM - 10 PM",
                  },
                  {
                    label: isEs ? "En Tully Road" : "On Tully Road",
                    value: "San Jose, CA",
                  },
                  {
                    label: isEs ? "Hecho a mano" : "Made by hand",
                    value: isEs ? "Fruta fresca" : "Fresh fruit",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-lg border border-chocolate/10 bg-blanco/75 px-4 py-3 shadow-sm backdrop-blur"
                  >
                    <p className="font-body text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-chocolate/45">
                      {stat.label}
                    </p>
                    <p className="font-heading text-lg font-extrabold leading-tight text-chocolate">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </ImmersiveHero>

      <MarqueeBand />

      <section className="relative bg-crema">
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 md:py-24">
          <ScrollReveal animation="fade-up">
            <SectionHead
              num="01"
              align="center"
              eyebrow={isEs ? "Lo mejor de la casa" : "House favorites"}
              title={t("featured.title")}
              lead={t("featured.subtitle")}
              className="mb-10"
            />
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={150}>
            <div className="grid grid-cols-2 lg:grid-cols-4 auto-rows-[190px] md:auto-rows-[250px] gap-3 md:gap-4">
              {heroItem && <BentoCard item={heroItem} isHero />}
              {supportingItems.map((item) => (
                <BentoCard key={item.id} item={item} />
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={300}>
            <div className="text-center mt-10">
              <Link
                href="/menu"
                className="btn-shine inline-flex items-center justify-center bg-chocolate text-crema font-body font-extrabold px-7 py-3 rounded-full text-base hover:bg-chocolate-light shadow-lg shadow-chocolate/15"
              >
                {t("menu.viewFull")}
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <OriginStory />
      <DripDivider color="crema" />
      <ProcessStrip />

      <div className="py-8 bg-crema">
        <PromoBanner variant="delivery" />
      </div>

      <PhotoBreak />
      <Testimonials />
      <DripDivider color="crema" />

      <CravingQuiz />

      <section className="relative bg-crema">
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-8 items-stretch">
            <ScrollReveal animation="fade-up">
              <div>
                <SectionHead
                  num="06"
                  eyebrow={isEs ? "Visitanos" : "Visit us"}
                  title={t("location.title")}
                  lead={t("location.subtitle")}
                  className="mb-8"
                />

                <div className="grid gap-3 mb-8">
                  {[
                    {
                      label: isEs ? "Direccion" : "Address",
                      value: `${t("contact.address")} - ${t("contact.city")}`,
                    },
                    {
                      label: isEs ? "Horario" : "Hours",
                      value: t("contact.hours"),
                    },
                    {
                      label: isEs ? "Telefono" : "Phone",
                      value: t("contact.phone"),
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-lg border border-chocolate/10 bg-blanco/80 p-4 shadow-sm"
                    >
                      <p className="font-body text-xs font-extrabold uppercase tracking-[0.14em] text-chocolate/45">
                        {item.label}
                      </p>
                      <p className="font-body text-base font-bold text-chocolate">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="https://maps.google.com/?q=1075+Tully+Rd+Suite+24+San+Jose+CA+95122"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-shine inline-flex items-center justify-center bg-rosa-fuerte text-white font-body font-extrabold px-6 py-3 rounded-full text-sm hover:bg-rosa-hover"
                  >
                    {t("contact.getDirections")}
                  </a>
                  <a
                    href="https://www.instagram.com/rancholados/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-shine inline-flex items-center justify-center bg-blanco text-chocolate font-body font-extrabold px-6 py-3 rounded-full text-sm border border-chocolate/10 hover:border-rosa-fuerte/30 hover:text-rosa-fuerte"
                  >
                    Instagram
                  </a>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={150}>
              <div className="relative min-h-[360px] overflow-hidden rounded-lg shadow-xl">
                <Image
                  src="/images/stock/pink-shop.jpg"
                  alt="Rancholados shop"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-chocolate-dark/75 via-chocolate-dark/20 to-transparent" />
                <div className="absolute left-5 right-5 bottom-5 rounded-lg bg-blanco/92 p-5 shadow-lg backdrop-blur">
                  <p className="font-heading text-2xl font-extrabold text-chocolate">
                    1075 Tully Rd, Suite 24
                  </p>
                  <p className="font-body text-sm font-semibold text-chocolate/60">
                    San Jose, CA 95122
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <DripDivider color="rosa-claro" flip />

      <section className="bg-rosa-claro/40 py-14">
        <div className="max-w-6xl mx-auto px-4">
          <ScrollReveal animation="fade-up">
            <SectionHead
              num="07"
              align="center"
              eyebrow={isEs ? "Menu rapido" : "Quick menu"}
              title={isEs ? "Explora por categoria" : "Explore by category"}
              className="mb-8"
            />
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={100}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {categories.map((cat, i) => (
                <Link
                  key={cat.id}
                  href={`/menu#${cat.slug}`}
                  className="card-interactive card-accent group relative min-h-[150px] overflow-hidden rounded-lg bg-chocolate shadow-sm"
                >
                  {cat.image ? (
                    <Image
                      src={cat.image}
                      alt={isEs ? cat.nameEs : cat.nameEn}
                      fill
                      className="card-image object-cover opacity-75"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-arequipe to-chocolate" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-chocolate-dark/90 via-chocolate-dark/25 to-transparent" />
                  <span className="card-wm card-wm-light">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="absolute left-4 right-4 bottom-4">
                    <span className="block h-1 w-10 rounded-full bg-rosa-fuerte mb-3" />
                    <p className="font-heading text-xl font-extrabold leading-tight text-white">
                      {isEs ? cat.nameEs : cat.nameEn}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
