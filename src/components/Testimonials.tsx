"use client";

import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import ScrollReveal from "./ScrollReveal";

const testimonials = {
  en: [
    { name: "Maria G.", text: "The cholado here is the real deal. Reminds me of the ones from Cali. I come every week.", rating: 5 },
    { name: "Carlos R.", text: "Best fresas con crema in San Jose, hands down. The ice cream is homemade and you can taste it.", rating: 5 },
    { name: "Jessica T.", text: "My kids can't stop talking about this place! The Oreo milkshake is insane. Love the Colombian vibes.", rating: 5 },
  ],
  es: [
    { name: "Maria G.", text: "El cholado de aquí es el original. Me recuerda a los de Cali. Vengo cada semana.", rating: 5 },
    { name: "Carlos R.", text: "Las mejores fresas con crema de San José, sin duda. El helado es casero y se nota.", rating: 5 },
    { name: "Jessica T.", text: "Mis hijos no paran de hablar de este lugar! La malteada de Oreo es increíble. Me encanta el ambiente colombiano.", rating: 5 },
  ],
};

const instagramPhotos = [
  "/images/stock/cholado.jpg",
  "/images/stock/fresas-con-crema.jpg",
  "/images/stock/milkshake.jpg",
  "/images/stock/ice-cream-scoops.jpg",
  "/images/stock/fruit-salad.jpg",
  "/images/stock/fresas-con-crema-alt.jpg",
];

export default function Testimonials() {
  const t = useTranslations("testimonials");
  const locale = useLocale();
  const reviews = locale === "es" ? testimonials.es : testimonials.en;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-rosa-claro via-blanco to-azul-bebe/30 texture-noise">
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 md:py-28">
        <ScrollReveal animation="fade-up">
          <div className="text-center mb-14">
            <p className="font-body text-rosa-fuerte text-sm tracking-[0.2em] uppercase mb-3">
              {t("subtitle")}
            </p>
            <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-chocolate">
              {t("title")}
            </h2>
          </div>
        </ScrollReveal>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {reviews.map((review, i) => (
            <ScrollReveal key={i} animation="fade-up" delay={i * 150}>
              <div className="bg-blanco rounded-2xl p-6 shadow-[0_4px_24px_rgba(61,35,20,0.08)] hover:shadow-[0_8px_40px_rgba(61,35,20,0.12)] transition-shadow duration-300 h-full flex flex-col">
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <svg key={j} className="w-5 h-5 text-dorado" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Quote */}
                <p className="font-body text-chocolate/70 text-sm leading-relaxed flex-1 mb-4">
                  &ldquo;{review.text}&rdquo;
                </p>

                {/* Name */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rosa-fuerte to-arequipe flex items-center justify-center">
                    <span className="font-heading text-xs font-bold text-white">
                      {review.name.charAt(0)}
                    </span>
                  </div>
                  <span className="font-body font-semibold text-sm text-chocolate">
                    {review.name}
                  </span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Instagram grid */}
        <ScrollReveal animation="fade-up" delay={200}>
          <div className="text-center mb-6">
            <h3 className="font-heading text-xl font-bold text-chocolate">
              📸 {t("followUs")}
            </h3>
          </div>
        </ScrollReveal>
        <ScrollReveal animation="fade-up" delay={300}>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
            {instagramPhotos.map((photo, i) => (
              <a
                key={i}
                href="https://www.instagram.com/rancholados/"
                target="_blank"
                rel="noopener noreferrer"
                className="relative aspect-square rounded-xl overflow-hidden group"
              >
                <Image
                  src={photo}
                  alt="Rancholados Instagram"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 33vw, 16vw"
                />
                <div className="absolute inset-0 bg-rosa-fuerte/0 group-hover:bg-rosa-fuerte/20 transition-colors duration-300 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
