export default function DripDivider({
  color = "rosa-claro",
  flip = false,
}: {
  color?: "rosa-claro" | "azul-bebe" | "crema" | "blanco";
  flip?: boolean;
}) {
  const colors: Record<string, string> = {
    "rosa-claro": "#FDE8F0",
    "azul-bebe": "#B8E4F0",
    crema: "#FFF8F0",
    blanco: "#FFFFFF",
  };

  return (
    <div
      className="drip-divider w-full leading-[0] overflow-hidden"
      style={{ transform: flip ? "rotate(180deg)" : undefined }}
    >
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-[40px] md:h-[60px]"
      >
        <path
          d={`M0,0 C120,0 120,40 180,40 C240,40 240,20 320,20 C400,20 400,50 480,50
              C560,50 560,10 640,10 C720,10 720,45 800,45 C880,45 880,15 960,15
              C1040,15 1040,55 1120,55 C1200,55 1200,25 1280,25 C1360,25 1360,35 1440,35
              L1440,80 L0,80 Z`}
          fill={colors[color]}
        />
        {/* Drip drops */}
        <ellipse cx="280" cy="52" rx="6" ry="8" fill={colors[color]} />
        <ellipse cx="580" cy="18" rx="5" ry="7" fill={colors[color]} />
        <ellipse cx="920" cy="22" rx="4" ry="6" fill={colors[color]} />
        <ellipse cx="1180" cy="58" rx="5" ry="7" fill={colors[color]} />
      </svg>
    </div>
  );
}
