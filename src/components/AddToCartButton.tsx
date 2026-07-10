"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useCart } from "./CartProvider";

export default function AddToCartButton({
  itemId,
  compact = false,
}: {
  itemId: string;
  compact?: boolean;
}) {
  const locale = useLocale();
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        addItem(itemId);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1200);
      }}
      className={`btn-shine inline-flex items-center justify-center rounded-full bg-rosa-fuerte font-body font-extrabold text-white hover:bg-rosa-hover ${
        compact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"
      }`}
      aria-live="polite"
    >
      {added
        ? locale === "es"
          ? "Agregado ✓"
          : "Added ✓"
        : locale === "es"
          ? "Agregar"
          : "Add to cart"}
    </button>
  );
}
