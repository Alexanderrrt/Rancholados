import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import LocationPopup from "@/components/LocationPopup";
import AnnouncementBar from "@/components/AnnouncementBar";
import PromoPopup from "@/components/PromoPopup";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEs = locale === "es";
  return {
    metadataBase: new URL("https://rancholados.vercel.app"),
    title: isEs
      ? "Rancholados | Frutería y Heladería Colombiana en San José"
      : "Rancholados | Colombian Fruit & Ice Cream Shop in San José",
    description: isEs
      ? "Cholados, helados caseros, fresas con crema, obleas y más en San José, CA. Abiertos todos los días de 12 a 10 pm."
      : "Cholados, homemade ice cream, strawberries & cream, obleas and more in San José, CA. Open daily noon to 10 pm.",
    icons: {
      icon: "/logo.jpg",
      apple: "/logo.jpg",
    },
    openGraph: {
      images: ["/logo.jpg"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = (await import(`../../../messages/${locale}.json`)).default;

  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700;800&family=Nunito:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-crema text-chocolate font-body min-h-screen flex flex-col">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AnnouncementBar />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppFloat />
          <LocationPopup />
          <PromoPopup />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
