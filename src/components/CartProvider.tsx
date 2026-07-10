"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartLine } from "@/lib/checkout-types";

const STORAGE_KEY = "rancholados-cart-v1";
const MAX_QUANTITY = 20;

interface CartContextValue {
  lines: CartLine[];
  count: number;
  hydrated: boolean;
  addItem: (itemId: string) => void;
  setQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function readStoredCart(): CartLine[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (line): line is CartLine =>
          typeof line?.itemId === "string" &&
          Number.isInteger(line?.quantity) &&
          line.quantity > 0
      )
      .map((line) => ({
        itemId: line.itemId,
        quantity: Math.min(line.quantity, MAX_QUANTITY),
      }));
  } catch {
    return [];
  }
}

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setLines(readStoredCart());
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [hydrated, lines]);

  const addItem = useCallback((itemId: string) => {
    setLines((current) => {
      const existing = current.find((line) => line.itemId === itemId);
      if (!existing) return [...current, { itemId, quantity: 1 }];
      return current.map((line) =>
        line.itemId === itemId
          ? { ...line, quantity: Math.min(line.quantity + 1, MAX_QUANTITY) }
          : line
      );
    });
  }, []);

  const setQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setLines((current) => current.filter((line) => line.itemId !== itemId));
      return;
    }
    setLines((current) =>
      current.map((line) =>
        line.itemId === itemId
          ? { ...line, quantity: Math.min(Math.floor(quantity), MAX_QUANTITY) }
          : line
      )
    );
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setLines((current) => current.filter((line) => line.itemId !== itemId));
  }, []);

  const clear = useCallback(() => setLines([]), []);
  const count = lines.reduce((sum, line) => sum + line.quantity, 0);
  const value = useMemo(
    () => ({ lines, count, hydrated, addItem, setQuantity, removeItem, clear }),
    [lines, count, hydrated, addItem, setQuantity, removeItem, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used inside CartProvider");
  return value;
}
