import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";

export default function ContactPage() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const isEs = locale === "es";

  const detailCards = [
    { label: t("addressLabel"), value: `${t("address")} - ${t("city")}` },
    { label: t("hoursLabel"), value: t("hours") },
    { label: t("phoneLabel"), value: t("phone"), href: "tel:+14087975538" },
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-crema border-b border-chocolate/10">
        <div className="absolute inset-0">
          <Image
            src="/images/stock/pink-shop.jpg"
            alt=""
            fill
            className="object-cover opacity-25"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,248,240,0.98)_0%,rgba(255,248,240,0.78)_100%)]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-12 md:py-16">
          <p className="font-body text-rosa-fuerte text-sm tracking-[0.2em] uppercase mb-3">
            {isEs ? "Tully Road" : "Tully Road"}
          </p>
          <h1 className="font-heading text-4xl md:text-6xl font-extrabold text-chocolate leading-tight">
            {t("title")}
          </h1>
          <p className="font-body text-lg text-chocolate/65 max-w-2xl mt-3">
            {isEs
              ? "Pasa por un cholado, ordena por WhatsApp o pide delivery."
              : "Stop by for a cholado, order on WhatsApp, or get delivery."}
          </p>
        </div>
      </section>

      <section className="bg-crema py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-8 items-stretch">
          <div className="space-y-4">
            {detailCards.map((card) => (
              <div
                key={card.label}
                className="rounded-lg border border-chocolate/10 bg-blanco p-5 shadow-[0_4px_20px_rgba(61,35,20,0.07)]"
              >
                <p className="font-body text-xs font-extrabold uppercase tracking-[0.14em] text-chocolate/45 mb-1">
                  {card.label}
                </p>
                {card.href ? (
                  <a
                    href={card.href}
                    className="font-heading text-2xl font-extrabold text-rosa-fuerte hover:text-rosa-hover transition-colors"
                  >
                    {card.value}
                  </a>
                ) : (
                  <p className="font-body text-base md:text-lg font-bold text-chocolate">
                    {card.value}
                  </p>
                )}
              </div>
            ))}

            <div className="rounded-lg bg-rosa-claro/70 p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href="https://maps.google.com/?q=1075+Tully+Rd+Suite+24+San+Jose+CA+95122"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-rosa-fuerte text-white font-body font-extrabold px-5 py-3 rounded-lg text-sm hover:bg-rosa-hover transition-colors"
                >
                  {t("getDirections")}
                </a>
                <a
                  href="https://wa.me/14087975538"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-[#25D366] text-white font-body font-extrabold px-5 py-3 rounded-lg text-sm hover:bg-[#1da851] transition-colors"
                >
                  {t("orderWhatsApp")}
                </a>
                <a
                  href="https://www.instagram.com/rancholados/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-blanco text-chocolate font-body font-extrabold px-5 py-3 rounded-lg text-sm hover:text-rosa-fuerte transition-colors"
                >
                  {t("followUs")}
                </a>
                <a
                  href="https://www.doordash.com/store/35880125"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-chocolate text-crema font-body font-extrabold px-5 py-3 rounded-lg text-sm hover:bg-chocolate-light transition-colors"
                >
                  {t("orderDelivery")}
                </a>
              </div>
            </div>
          </div>

          <div className="relative min-h-[420px] overflow-hidden rounded-lg shadow-xl">
            <Image
              src="/Cholado.png"
              alt="Rancholados cholado"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-chocolate-dark/80 via-chocolate-dark/20 to-transparent" />
            <div className="absolute left-5 right-5 bottom-5 rounded-lg bg-blanco/92 p-5 shadow-lg backdrop-blur">
              <p className="font-heading text-2xl md:text-3xl font-extrabold text-chocolate">
                Rancholados
              </p>
              <p className="font-body text-sm md:text-base font-semibold text-chocolate/65">
                {t("address")} - {t("city")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "IceCreamShop",
            name: "Rancholados",
            description:
              "Colombian fruit and ice cream shop in San Jose, CA. Cholados, homemade ice cream, fresas con crema, obleas and fresh fruit.",
            address: {
              "@type": "PostalAddress",
              streetAddress: "1075 Tully Rd, Suite 24",
              addressLocality: "San Jose",
              addressRegion: "CA",
              postalCode: "95122",
              addressCountry: "US",
            },
            telephone: "+14087975538",
            openingHours: "Mo-Su 12:00-22:00",
            priceRange: "$$",
            servesCuisine: "Colombian",
            url: "https://rancholados.com",
            sameAs: [
              "https://www.instagram.com/rancholados/",
              "https://www.doordash.com/store/35880125",
            ],
          }),
        }}
      />
    </>
  );
}
