import { useTranslations } from "next-intl";

export default function ContactPage() {
  const t = useTranslations("contact");

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-br from-azul-bebe/30 to-rosa-claro py-12 text-center">
        <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-chocolate">
          {t("title")} 📍
        </h1>
      </section>

      {/* Content */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Map */}
          <div className="rounded-2xl overflow-hidden shadow-xl h-80 md:h-full min-h-[320px]">
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

          {/* Info cards */}
          <div className="flex flex-col gap-5">
            {/* Address */}
            <div className="bg-blanco rounded-2xl p-6 shadow-[0_4px_20px_rgba(61,35,20,0.08)]">
              <h3 className="font-heading text-lg font-bold text-chocolate mb-3 flex items-center gap-2">
                📍 {t("addressLabel")}
              </h3>
              <p className="font-body text-chocolate/70">
                {t("address")}
                <br />
                {t("city")}
              </p>
              <a
                href="https://maps.google.com/?q=1075+Tully+Rd+Suite+24+San+Jose+CA+95122"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 bg-rosa-fuerte text-white font-body font-bold px-5 py-2 rounded-3xl text-sm hover:bg-rosa-hover transition-colors"
              >
                {t("getDirections")} →
              </a>
            </div>

            {/* Phone */}
            <div className="bg-blanco rounded-2xl p-6 shadow-[0_4px_20px_rgba(61,35,20,0.08)]">
              <h3 className="font-heading text-lg font-bold text-chocolate mb-3 flex items-center gap-2">
                📞 {t("phoneLabel")}
              </h3>
              <a
                href="tel:+14087975538"
                className="font-heading text-2xl font-bold text-rosa-fuerte hover:text-rosa-hover transition-colors"
              >
                {t("phone")}
              </a>
            </div>

            {/* Hours */}
            <div className="bg-blanco rounded-2xl p-6 shadow-[0_4px_20px_rgba(61,35,20,0.08)]">
              <h3 className="font-heading text-lg font-bold text-chocolate mb-3 flex items-center gap-2">
                🕐 {t("hoursLabel")}
              </h3>
              <p className="font-body text-chocolate/70">{t("hours")}</p>
            </div>

            {/* Social / Delivery / WhatsApp */}
            <div className="bg-rosa-claro rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="https://wa.me/14087975538"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-[#25D366] text-white font-body font-bold px-5 py-3 rounded-3xl text-sm hover:bg-[#1da851] transition-colors text-center inline-flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  {t("orderWhatsApp")}
                </a>
                <a
                  href="https://www.instagram.com/rancholados/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-blanco text-chocolate font-body font-bold px-5 py-3 rounded-3xl text-sm hover:bg-azul-bebe transition-colors text-center"
                >
                  📸 {t("followUs")}
                </a>
                <a
                  href="https://www.doordash.com/store/35880125"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-chocolate text-crema font-body font-bold px-5 py-3 rounded-3xl text-sm hover:bg-chocolate/80 transition-colors text-center"
                >
                  🚗 {t("orderDelivery")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "IceCreamShop",
            name: "Rancholados",
            description:
              "Colombian fruit and ice cream shop in San José, CA. Cholados, homemade ice cream, fresas con crema, obleas and fresh fruit.",
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
