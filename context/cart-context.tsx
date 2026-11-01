"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CartLine, Product, Variant } from "@/lib/types";

type CartContextValue = {
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  addItem: (product: Product, variant: Variant, quantity?: number) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_KEY = "nova-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setLines(JSON.parse(stored) as CartLine[]);
    } catch { window.localStorage.removeItem(STORAGE_KEY); }
    setReady(true);
  }, []);

  useEffect(() => { if (ready) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines)); }, [lines, ready]);

  const addItem = useCallback((product: Product, variant: Variant, quantity = 1) => {
    if (variant.stock <= 0) return;
    const maximum = Math.min(variant.stock, 20);
    setLines((current) => {
      const existing = current.find((line) => line.variant.id === variant.id);
      if (existing) return current.map((line) => line.variant.id === variant.id ? { product, variant, quantity: Math.min(line.quantity + quantity, maximum) } : line);
      return [...current, { product, variant, quantity: Math.min(Math.max(1, quantity), maximum) }];
    });
  }, []);

  const setQuantity = useCallback((variantId: string, quantity: number) => {
    if (quantity <= 0) { setLines((current) => current.filter((line) => line.variant.id !== variantId)); return; }
    setLines((current) => current.flatMap((line) => {
      if (line.variant.id !== variantId) return [line];
      if (line.variant.stock <= 0) return [];
      return [{ ...line, quantity: Math.min(quantity, Math.min(line.variant.stock, 20)) }];
    }));
  }, []);

  const removeItem = useCallback((variantId: string) => setLines((current) => current.filter((line) => line.variant.id !== variantId)), []);
  const clear = useCallback(() => setLines([]), []);
  const value = useMemo(() => ({
    lines, itemCount: lines.reduce((sum, line) => sum + line.quantity, 0),
    subtotal: lines.reduce((sum, line) => sum + (line.product.price + line.variant.priceDelta) * line.quantity, 0),
    addItem, setQuantity, removeItem, clear,
  }), [lines, addItem, setQuantity, removeItem, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart doit être utilisé dans CartProvider.");
  return context;
}
