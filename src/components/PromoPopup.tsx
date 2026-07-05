"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";

export default function PromoPopup() {
  const t = useTranslations("promos");
  const locale = useLocale();
  const [show, setShow] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("promo-popup-dismissed");
    if (dismissed) return;

    const timer = setTimeout(() => setShow(true), 8000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setShow(false);
      setClosing(false);
      sessionStorage.setItem("promo-popup-dismissed", "1");
    }, 350);
  };

  if (!show) return null;

  const orderMsg = locale === "es"
    ? "Hola! Vi la promo del Cholado Especial"
    : "Hi! I saw the Special Cholado promo";

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center p-4 ${closing ? "popup-overlay-out" : "popup-overlay-in"}`}
      onClick={handleClose}
    >
      <div className="absolute inset-0 bg-chocolate-dark/60 backdrop-blur-sm" />

      <div
        className={`relative z-10 bg-blanco rounded-3xl overflow-hidden shadow-2xl max-w-sm w-full ${closing ? "popup-card-out" : "popup-card-in"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src="/Cholado.png"
            alt="Cholado Especial"
            fill
            className="object-cover"
            sizes="400px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-chocolate-dark/60 to-transparent" />

          {/* Discount badge */}
          <div className="absolute top-4 right-4 bg-rosa-fuerte text-white font-heading font-extrabold text-lg px-4 py-2 rounded-full shadow-lg animate-float">
            {t("popup.badge")}
          </div>

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 left-4 w-8 h-8 rounded-full bg-blanco/80 backdrop-blur-sm flex items-center justify-center text-chocolate hover:bg-blanco transition-colors"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <h3 className="font-heading text-2xl font-extrabold text-chocolate mb-2">
            {t("popup.title")}
          </h3>
          <p className="font-body text-sm text-chocolate/60 mb-5">
            {t("popup.desc")}
          </p>

          <a
            href={`https://wa.me/14087975538?text=${encodeURIComponent(orderMsg)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full bg-[#25D366] text-white font-body font-bold px-6 py-3.5 rounded-3xl text-base hover:bg-[#1da851] hover:scale-[1.02] active:scale-95 transition-all duration-200 shadow-lg shadow-[#25D366]/25"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            {t("popup.cta")}
          </a>

          <button
            onClick={handleClose}
            className="font-body text-xs text-chocolate/40 mt-3 hover:text-chocolate/60 transition-colors"
          >
            {t("popup.dismiss")}
          </button>
        </div>
      </div>
    </div>
  );
}
