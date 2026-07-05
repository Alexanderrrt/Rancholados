import { useTranslations } from "next-intl";
import Image from "next/image";

export default function PhotoBreak() {
  const t = useTranslations("hero");

  return (
    <section className="relative h-[40vh] md:h-[50vh] overflow-hidden">
      <Image
        src="/images/stock/pink-shop.jpg"
        alt="Rancholados shop"
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-chocolate-dark/50" />
      <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
        <p className="font-heading text-3xl md:text-5xl lg:text-6xl font-extrabold text-crema italic drop-shadow-2xl max-w-3xl">
          &ldquo;{t("tagline")}&rdquo;
        </p>
      </div>
    </section>
  );
}
