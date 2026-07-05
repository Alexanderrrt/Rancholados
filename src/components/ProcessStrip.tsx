"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ScrollReveal from "./ScrollReveal";

export default function ProcessStrip() {
  const t = useTranslations("process");
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const steps = [
    { icon: "🍓", title: t("step1"), desc: t("desc1") },
    { icon: "🤲", title: t("step2"), desc: t("desc2") },
    { icon: "❤️", title: t("step3"), desc: t("desc3") },
  ];

  return (
    <section className="relative bg-cafe-con-leche overflow-hidden">
      {/* Dot texture */}
      <div className="absolute inset-0 texture-dots opacity-[0.04] pointer-events-none" />

      <div ref={ref} className="relative z-10 max-w-5xl mx-auto px-4 py-20 md:py-28">
        <ScrollReveal animation="fade-up">
          <div className="text-center mb-16">
            <p className="font-body text-dorado text-sm tracking-[0.2em] uppercase mb-3">
              {t("subtitle")}
            </p>
            <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-chocolate">
              {t("title")}
            </h2>
          </div>
        </ScrollReveal>

        {/* Steps - horizontal on desktop, vertical on mobile */}
        <div className="relative">
          {/* Connecting line - desktop */}
          <div className="hidden md:block absolute top-16 left-[16.67%] right-[16.67%] h-0.5 z-0">
            <div
              className="h-full bg-dorado/30 rounded-full origin-left transition-transform duration-1000 ease-out"
              style={{ transform: visible ? "scaleX(1)" : "scaleX(0)" }}
            />
            <div
              className="absolute top-0 h-full rounded-full origin-left transition-transform duration-1000 ease-out delay-300"
              style={{
                transform: visible ? "scaleX(1)" : "scaleX(0)",
                background: "repeating-linear-gradient(90deg, var(--color-dorado) 0, var(--color-dorado) 6px, transparent 6px, transparent 12px)",
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {steps.map((step, i) => (
              <ScrollReveal key={i} animation="fade-up" delay={i * 200}>
                <div className="flex flex-col items-center text-center relative">
                  {/* Circle icon */}
                  <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-blanco shadow-lg flex items-center justify-center mb-6 relative z-10 border-4 border-cafe-con-leche">
                    <span className="text-4xl md:text-5xl">{step.icon}</span>
                  </div>

                  {/* Step number */}
                  <span className="font-heading text-sm font-bold text-dorado mb-2">
                    0{i + 1}
                  </span>

                  <h3 className="font-heading text-xl font-bold text-chocolate mb-2">
                    {step.title}
                  </h3>
                  <p className="font-body text-sm text-chocolate/60 max-w-xs">
                    {step.desc}
                  </p>

                  {/* Mobile connector */}
                  {i < steps.length - 1 && (
                    <div className="md:hidden w-0.5 h-8 bg-dorado/30 mt-6" />
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
