"use client";

import { useEffect, useState } from "react";

interface FloatingItem {
  emoji: string;
  className: string;
}

const items: FloatingItem[] = [
  { emoji: "🍓", className: "top-8 left-8 text-4xl" },
  { emoji: "🥭", className: "top-20 right-12 text-3xl" },
  { emoji: "🥥", className: "bottom-16 left-1/4 text-3xl" },
  { emoji: "🍦", className: "bottom-24 right-1/3 text-2xl" },
  { emoji: "🍨", className: "top-1/3 left-16 text-2xl" },
];

export default function ParallaxHero({ children }: { children: React.ReactNode }) {
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
    <section className="relative overflow-hidden hero-gradient">
      {items.map((item, i) => {
        const depth = 10 + i * 6;
        return (
          <div
            key={i}
            className={`absolute ${item.className} animate-float pointer-events-none select-none`}
            style={{
              opacity: 0.5 + i * 0.05,
              transform: `translate(${mouse.x * depth}px, ${mouse.y * depth}px)`,
              transition: "transform 0.3s ease-out",
              animationDelay: `${i * 0.4}s`,
            }}
          >
            {item.emoji}
          </div>
        );
      })}
      {children}
    </section>
  );
}
