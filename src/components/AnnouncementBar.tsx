"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

export default function AnnouncementBar() {
  const t = useTranslations("promos");
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  const messages = [
    { text: t("bar1"), icon: "🔥" },
    { text: t("bar2"), icon: "🍧" },
    { text: t("bar3"), icon: "🚗" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [messages.length]);

  if (!visible) return null;

  return (
    <div className="relative bg-gradient-to-r from-chocolate-dark via-chocolate to-chocolate-dark text-crema overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-center gap-2 min-h-[36px]">
        <span className="text-sm">{messages[index].icon}</span>
        <p
          key={index}
          className="font-body text-xs sm:text-sm font-semibold text-center animate-fade-up"
        >
          {messages[index].text}
        </p>
      </div>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-crema/40 hover:text-crema transition-colors"
        aria-label="Close"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
