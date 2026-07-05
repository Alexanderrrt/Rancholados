"use client";

import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import ScrollReveal from "./ScrollReveal";

interface Props {
  variant: "cholado" | "delivery" | "fresas";
}

const config = {
  cholado: {
    image: "/images/stock/cholado.jpg",
    gradient: "from-rosa-fuerte/90 to-chocolate-dark/90",
    badge: "🍧",
  },
  delivery: {
    image: "/images/stock/milkshake.jpg",
    gradient: "from-[#25D366]/90 to-chocolate-dark/90",
    badge: "🚗",
  },
  fresas: {
    image: "/images/stock/fresas-con-crema.jpg",
    gradient: "from-rosa-fuerte/90 to-arequipe/90",
    badge: "🍓",
  },
};

export default function PromoBanner({ variant }: Props) {
  const t = useTranslations("promos");
  const locale = useLocale();
  const c = config[variant];

  const whatsappBase = "https://wa.me/14087975538?text=";
  const orderMsg = locale === "es" ? "Hola! Quiero ordenar" : "Hi! I'd like to order";

  return (
    <ScrollReveal animation="fade-up">
      <div className="relative overflow-hidden rounded-2xl mx-4 md:mx-auto max-w-6xl my-2">
        {/* Background image */}
        <Image
          src={c.image}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className={`absolute inset-0 bg-gradient-to-r ${c.gradient}`} />

        <div className="relative z-10 px-6 py-8 md:px-12 md:py-10 flex flex-col md:flex-row items-center gap-6">
          {/* Badge */}
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-blanco/20 backdrop-blur-sm flex items-center justify-center shrink-0">
            <span className="text-3xl md:text-4xl">{c.badge}</span>
          </div>

          {/* Text */}
          <div className="flex-1 text-center md:text-left">
            <h3 className="font-heading text-xl md:text-2xl font-extrabold text-white mb-1">
              {t(`${variant}.title`)}
            </h3>
            <p className="font-body text-sm md:text-base text-white/80">
              {t(`${variant}.desc`)}
            </p>
          </div>

          {/* CTA */}
          <a
            href={`${whatsappBase}${encodeURIComponent(orderMsg)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 bg-blanco text-chocolate font-body font-bold px-6 py-3 rounded-3xl text-sm hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg"
          >
            <svg className="w-4 h-4 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            {t(`${variant}.cta`)}
          </a>
        </div>
      </div>
    </ScrollReveal>
  );
}
