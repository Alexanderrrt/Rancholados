"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";

const DISMISS_KEY = "rancholados-popup-dismissed";
const POPUP_DELAY = 3000;
const DISMISS_HOURS = 24;

export default function LocationPopup() {
  const t = useTranslations("contact");
  const tNav = useTranslations("nav");
  const [show, setShow] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (dismissed) {
      const dismissedAt = parseInt(dismissed, 10);
      if (Date.now() - dismissedAt < DISMISS_HOURS * 60 * 60 * 1000) return;
    }

    const timer = setTimeout(() => setShow(true), POPUP_DELAY);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setClosing(true);
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
    setTimeout(() => setShow(false), 400);
  };

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 ${closing ? "popup-overlay-out" : "popup-overlay-in"}`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-chocolate/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Popup */}
      <div
        className={`relative bg-blanco rounded-3xl shadow-2xl max-w-md w-full overflow-hidden ${closing ? "popup-card-out" : "popup-card-in"}`}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-chocolate/10 hover:bg-chocolate/20 flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <svg className="w-4 h-4 text-chocolate" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Top gradient banner */}
        <div className="hero-gradient py-6 px-6 flex items-center justify-center gap-3">
          <Image
            src="/logo.jpg"
            alt="Rancholados"
            width={56}
            height={56}
            className="h-14 w-14 rounded-full shadow-md"
          />
          <Image
            src="/LogoHero.png"
            alt="Rancholados - Frutería y Heladería"
            width={200}
            height={56}
            className="h-14 w-auto drop-shadow-lg"
          />
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-3 mb-5">
            <div className="flex items-start gap-3">
              <span className="text-xl mt-0.5">📍</span>
              <div className="font-body text-sm text-chocolate/80">
                <p className="font-semibold">{t("address")}</p>
                <p>{t("city")}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl">🕐</span>
              <p className="font-body text-sm text-chocolate/80">{t("hours")}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl">📞</span>
              <a href="tel:+14087975538" className="font-body text-sm font-semibold text-rosa-fuerte hover:text-rosa-hover transition-colors">
                {t("phone")}
              </a>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-2.5">
            <a
              href="https://wa.me/14087975538"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#25D366] text-white font-body font-bold py-3 rounded-2xl text-sm hover:bg-[#1da851] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-md shadow-[#25D366]/20"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {tNav("orderWhatsApp")}
            </a>
            <a
              href="https://maps.google.com/?q=1075+Tully+Rd+Suite+24+San+Jose+CA+95122"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-rosa-fuerte text-white font-body font-bold py-3 rounded-2xl text-sm hover:bg-rosa-hover hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-md shadow-rosa-fuerte/20"
            >
              📍 {t("getDirections")}
            </a>
            <a
              href="https://www.instagram.com/rancholados/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-rosa-claro text-chocolate font-body font-bold py-3 rounded-2xl text-sm hover:bg-azul-bebe hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              📸 {t("followUs")}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
