"use client";

import { useEffect, useState } from "react";

interface BokehItem {
  className: string;
  color: string;
  size: string;
}

const bokehItems: BokehItem[] = [
  { className: "top-[10%] left-[5%]", color: "bg-rosa-fuerte/10", size: "w-32 h-32 md:w-48 md:h-48" },
  { className: "top-[60%] right-[8%]", color: "bg-azul-bebe/15", size: "w-40 h-40 md:w-56 md:h-56" },
  { className: "bottom-[15%] left-[20%]", color: "bg-dorado/10", size: "w-24 h-24 md:w-36 md:h-36" },
  { className: "top-[25%] right-[25%]", color: "bg-rosa-claro/20", size: "w-28 h-28 md:w-44 md:h-44" },
  { className: "bottom-[40%] left-[60%]", color: "bg-arequipe/8", size: "w-20 h-20 md:w-32 md:h-32" },
];

export default function ImmersiveHero({ children }: { children: React.ReactNode }) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMouse({ x, y });
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden hero-gradient texture-noise">
      {/* Gradient spotlights */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-dorado/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-rosa-fuerte/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Bokeh parallax shapes */}
      {bokehItems.map((item, i) => {
        const depth = 8 + i * 5;
        return (
          <div
            key={i}
            className={`absolute ${item.className} ${item.color} ${item.size} rounded-full blur-2xl pointer-events-none select-none`}
            style={{
              transform: `translate(${mouse.x * depth}px, ${mouse.y * depth}px)`,
              transition: "transform 0.4s ease-out",
            }}
          />
        );
      })}

      {/* Content */}
      <div className="relative z-10 w-full">
        {children}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <span className="font-body text-xs text-chocolate/40 tracking-widest uppercase">Scroll</span>
        <svg className="w-5 h-5 text-chocolate/40 animate-scroll-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7" />
        </svg>
      </div>
    </section>
  );
}
