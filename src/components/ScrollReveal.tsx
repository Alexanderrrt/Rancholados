"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
  animation?: "fade-up" | "fade-left" | "fade-right" | "zoom-in" | "flip-up";
  delay?: number;
  duration?: number;
  threshold?: number;
  once?: boolean;
}

export default function ScrollReveal({
  children,
  className = "",
  animation = "fade-up",
  delay = 0,
  duration = 600,
  threshold = 0.15,
  once = true,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  const baseStyles: React.CSSProperties = {
    transitionProperty: "opacity, transform",
    transitionDuration: `${duration}ms`,
    transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
    transitionDelay: `${delay}ms`,
  };

  const hiddenStyles: Record<string, React.CSSProperties> = {
    "fade-up": { opacity: 0, transform: "translateY(40px)" },
    "fade-left": { opacity: 0, transform: "translateX(-40px)" },
    "fade-right": { opacity: 0, transform: "translateX(40px)" },
    "zoom-in": { opacity: 0, transform: "scale(0.85)" },
    "flip-up": { opacity: 0, transform: "perspective(800px) rotateX(15deg) translateY(30px)" },
  };

  const visibleStyle: React.CSSProperties = { opacity: 1, transform: "none" };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...baseStyles,
        ...(visible ? visibleStyle : hiddenStyles[animation]),
      }}
    >
      {children}
    </div>
  );
}
