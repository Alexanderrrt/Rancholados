import { useLocale } from "next-intl";
import { getItemById } from "@/data/menu";

const SIGNATURE_IDS = [
  "cholado-sencillo",
  "fresas-dubai",
  "malteada",
  "ranchoblea",
  "ensalada-frutas",
  "maracumango",
  "merengon",
];

export default function MarqueeBand() {
  const locale = useLocale();
  const names = SIGNATURE_IDS.map((id) => {
    const item = getItemById(id);
    if (!item) return null;
    return locale === "es" ? item.nameEs : item.nameEn;
  }).filter(Boolean) as string[];

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {names.map((name, i) => (
          <span key={`a-${i}`}>{name}</span>
        ))}
        {names.map((name, i) => (
          <span key={`b-${i}`}>{name}</span>
        ))}
      </div>
    </div>
  );
}
