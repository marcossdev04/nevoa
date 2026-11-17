"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ProductPhoto } from "@/components/ProductPhoto";
import { getProductById } from "@/lib/api";
import type { CartLine, Product } from "@/lib/types";

const STORAGE_KEY = "nevoa:cart:v1";

type DetailedLine = CartLine & { product: Product; total: number };

type Store = {
  hydrated: boolean;
  lines: DetailedLine[];
  count: number;
  subtotal: number;
  /** `from`: elemento de origem para a animação de "voar" até o carrinho */
  add: (product: Product, variant: string, qty?: number, from?: Element | null) => void;
  setQty: (productId: string, variant: string, qty: number) => void;
  remove: (productId: string, variant: string) => void;
  clear: () => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  quick: Product | null;
  openQuick: (product: Product) => void;
  closeQuick: () => void;
};

const StoreContext = createContext<Store | null>(null);

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore precisa estar dentro de <StoreProvider>");
  return ctx;
}

type Flight = { key: number; product: Product; from: DOMRect; to: DOMRect };

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [raw, setRaw] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [quick, setQuick] = useState<Product | null>(null);
  const [flights, setFlights] = useState<Flight[]>([]);
  const flightKey = useRef(0);

  // O carrinho mora no localStorage até existir backend/sessão.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hidratação única a partir do storage
      if (saved) setRaw(JSON.parse(saved));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(raw));
    } catch {}
  }, [raw, hydrated]);

  const commit = useCallback((product: Product, variant: string, qty: number) => {
    setRaw((prev) => {
      const i = prev.findIndex((l) => l.productId === product.id && l.variant === variant);
      if (i === -1) return [...prev, { productId: product.id, variant, qty }];
      const next = [...prev];
      next[i] = { ...next[i], qty: next[i].qty + qty };
      return next;
    });
  }, []);

  const add = useCallback<Store["add"]>(
    (product, variant, qty = 1, from) => {
      commit(product, variant, qty);
      const target = document.querySelector("[data-cart-target]");
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (from && target && !reduce) {
        setFlights((f) => [
          ...f,
          {
            key: ++flightKey.current,
            product,
            from: from.getBoundingClientRect(),
            to: target.getBoundingClientRect(),
          },
        ]);
      } else {
        setCartOpen(true);
      }
    },
    [commit],
  );

  const setQty = useCallback<Store["setQty"]>((productId, variant, qty) => {
    setRaw((prev) =>
      qty <= 0
        ? prev.filter((l) => !(l.productId === productId && l.variant === variant))
        : prev.map((l) => (l.productId === productId && l.variant === variant ? { ...l, qty } : l)),
    );
  }, []);

  const remove = useCallback<Store["remove"]>((productId, variant) => setQty(productId, variant, 0), [setQty]);
  const clear = useCallback(() => setRaw([]), []);

  const lines = useMemo<DetailedLine[]>(
    () =>
      raw.flatMap((l) => {
        const product = getProductById(l.productId);
        return product ? [{ ...l, product, total: product.price * l.qty }] : [];
      }),
    [raw],
  );

  const value = useMemo<Store>(
    () => ({
      hydrated,
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      subtotal: lines.reduce((n, l) => n + l.total, 0),
      add,
      setQty,
      remove,
      clear,
      cartOpen,
      setCartOpen,
      quick,
      openQuick: setQuick,
      closeQuick: () => setQuick(null),
    }),
    [hydrated, lines, add, setQty, remove, clear, cartOpen, quick],
  );

  return (
    <StoreContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-0 z-[90]" aria-hidden>
        <AnimatePresence>
          {flights.map((f) => (
            <motion.div
              key={f.key}
              className="absolute left-0 top-0"
              style={{ width: f.from.width, height: f.from.height }}
              initial={{ x: f.from.left, y: f.from.top, scale: 1, opacity: 1, rotate: 0 }}
              animate={{
                x: f.to.left + f.to.width / 2 - f.from.width / 2,
                y: f.to.top + f.to.height / 2 - f.from.height / 2,
                scale: 0.08,
                opacity: 0.6,
                rotate: 18,
              }}
              transition={{ duration: 0.75, ease: [0.5, 0, 0.2, 1] }}
              onAnimationComplete={() => {
                setFlights((all) => all.filter((x) => x.key !== f.key));
                setCartOpen(true);
              }}
            >
              <ProductPhoto product={f.product} fill sizes="320px" eager />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </StoreContext.Provider>
  );
}
