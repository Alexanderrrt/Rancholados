import Image from "next/image";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-chocolate text-crema/80">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="mb-2">
              <Image
                src="/logohero.png"
                alt="Rancholados - Frutería y Heladería"
                width={200}
                height={56}
                className="h-12 w-auto mix-blend-screen"
              />
            </div>
            <p className="font-body text-sm italic text-crema/60">
              &ldquo;{t("tagline")}&rdquo;
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-heading text-lg font-semibold text-blanco mb-3">
              {t("links")}
            </h4>
            <div className="flex flex-col gap-2 text-sm font-body">
              <a
                href="https://www.instagram.com/rancholados/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-rosa-fuerte transition-colors inline-flex items-center gap-2"
              >
                📸 Instagram
              </a>
              <a
                href="https://wa.me/14087975538"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-rosa-fuerte transition-colors inline-flex items-center gap-2"
              >
                💬 WhatsApp
              </a>
              <a
                href="https://www.doordash.com/store/35880125"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-rosa-fuerte transition-colors inline-flex items-center gap-2"
              >
                🚗 DoorDash
              </a>
              <a
                href="tel:+14087975538"
                className="hover:text-rosa-fuerte transition-colors inline-flex items-center gap-2"
              >
                📞 (408) 797-5538
              </a>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-heading text-lg font-semibold text-blanco mb-3">
              {t("hours")}
            </h4>
            <p className="text-sm font-body">
              {t("schedule")}
              <br />
              {t("scheduleTime")}
            </p>
            <p className="text-sm font-body mt-2">
              1075 Tully Rd, Suite 24
              <br />
              San Jose, CA 95122
            </p>
          </div>
        </div>

        <div className="border-t border-crema/10 mt-8 pt-6 text-center text-xs text-crema/40">
          <p>
            &copy; {currentYear} Rancholados. {t("rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
