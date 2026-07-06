"use client";

import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { MenuItem, formatPrice } from "@/data/menu";

const WHATSAPP_NUMBER = "14087975538";

interface Props {
  item: MenuItem;
  isHero?: boolean;
}

export default function BentoCard({ item, isHero = false }: Props) {
  const t = useTranslations("menu");
  const locale = useLocale();

  const name = locale === "es" ? item.nameEs : item.nameEn;
  const desc = locale === "es" ? item.descEs : item.descEn;

  const whatsappMessage =
    locale === "es"
      ? `Hola! Me gustaría ordenar: ${item.nameEs} (${formatPrice(item.priceCents)})`
      : `Hi! I'd like to order: ${item.nameEn} (${formatPrice(item.priceCents)})`;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

  if (isHero) {
    return (
      <div className="bento-card relative group col-span-2 row-span-2 bg-chocolate-dark shadow-xl cursor-pointer border border-chocolate/10">
        {item.image && (
          <Image
            src={item.image}
            alt={name}
            fill
            className="object-cover object-center bento-image"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-chocolate-dark/90 via-chocolate-dark/30 to-transparent z-10" />

        {/* Best seller badge */}
        <div className="absolute top-4 left-4 z-20 bg-dorado text-white font-body font-bold text-xs px-3 py-1.5 rounded-full shadow-lg">
          ★ Best Seller
        </div>

        {/* Content overlay - always visible on hero */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-8">
          <h3 className="font-heading text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg">
            {name}
          </h3>
          <p className="font-body text-sm md:text-base text-white/80 mb-4 max-w-md">
            {desc}
          </p>
          <div className="flex items-center gap-4">
            <span className="font-heading text-2xl font-bold text-dorado-light">
              {formatPrice(item.priceCents)}
            </span>
            {item.isAvailable && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg font-body font-extrabold text-sm bg-[#25D366] text-white hover:bg-[#1da851] active:scale-[0.98] transition-all duration-200 shadow-lg"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {t("orderWhatsApp")}
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bento-card relative group bg-blanco shadow-[0_4px_20px_rgba(61,35,20,0.08)] cursor-pointer border border-chocolate/10">
      {/* Category color strip */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rosa-fuerte to-arequipe z-20 rounded-t-lg" />

      {/* Image */}
      <div className="relative h-full w-full">
        {item.image ? (
          <Image
            src={item.image}
            alt={name}
            fill
            className="object-cover bento-image"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-rosa-claro to-azul-bebe flex items-center justify-center">
            <span className="text-5xl">🍨</span>
          </div>
        )}

        {/* Inner shadow at bottom for depth */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-chocolate/30 to-transparent z-10" />

        {/* Name + price - always visible */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-3">
          <h3 className="font-heading text-base font-bold text-white drop-shadow-lg leading-tight">
            {name}
          </h3>
          <span className="font-heading text-lg font-bold text-dorado-light drop-shadow-lg">
            {formatPrice(item.priceCents)}
          </span>
        </div>

        {/* Hover overlay - slides up */}
        <div className="bento-overlay absolute inset-0 z-20 bg-chocolate-dark/90 backdrop-blur-sm flex flex-col justify-end p-4">
          <h3 className="font-heading text-lg font-bold text-white mb-1">{name}</h3>
          <p className="font-body text-xs text-white/70 mb-3 line-clamp-3">{desc}</p>
          <div className="flex items-center justify-between">
            <span className="font-heading text-xl font-bold text-dorado-light">
              {formatPrice(item.priceCents)}
            </span>
            {item.isAvailable && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg font-body font-extrabold text-xs bg-[#25D366] text-white hover:bg-[#1da851] transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {t("orderWhatsApp")}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
