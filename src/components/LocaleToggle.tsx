"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";

export default function LocaleToggle() {
  const t = useTranslations("locale");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const nextLocale = locale === "es" ? "en" : "es";

  return (
    <button
      onClick={() => router.replace(pathname, { locale: nextLocale })}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold
                 bg-rosa-claro text-chocolate/70 hover:bg-azul-bebe transition-colors"
    >
      <span className="text-base">{locale === "es" ? "🇺🇸" : "🇨🇴"}</span>
      {t("switch")}
    </button>
  );
}
