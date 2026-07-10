interface Props {
  num: string;
  eyebrow: string;
  title: React.ReactNode;
  lead?: string;
  align?: "left" | "center";
  /** Use light text colors on dark backgrounds */
  tone?: "dark" | "light";
  className?: string;
}

export default function SectionHead({
  num,
  eyebrow,
  title,
  lead,
  align = "left",
  tone = "dark",
  className = "",
}: Props) {
  const centered = align === "center";
  const light = tone === "light";

  return (
    <div className={`${centered ? "text-center" : ""} ${className}`}>
      <p
        className={`sec-eyebrow font-body mb-3 ${light ? "sec-eyebrow-light" : ""}`}
        data-num={num}
      >
        {eyebrow}
      </p>
      <h2
        className={`font-heading h2-fluid font-extrabold ${
          light ? "text-crema" : "text-chocolate"
        }`}
      >
        {title}
      </h2>
      {lead && (
        <p
          className={`font-body text-lg mt-3 ${
            light ? "text-crema/60" : "text-chocolate/60"
          } ${centered ? "max-w-2xl mx-auto" : "max-w-2xl"}`}
        >
          {lead}
        </p>
      )}
    </div>
  );
}
