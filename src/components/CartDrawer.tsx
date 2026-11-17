"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ProductPhoto } from "@/components/ProductPhoto";
import { useStore } from "@/components/store/StoreProvider";
import { IconClose, IconMinus, IconPlus, IconTrash } from "@/components/ui";
import { FREE_SHIPPING_FROM } from "@/lib/api";
import { formatBRL } from "@/lib/format";
import { useOverlay } from "@/lib/useOverlay";

export function CartDrawer() {
  const { cartOpen, setCartOpen, lines, count, subtotal, setQty, remove } = useStore();
  const pathname = usePathname();
  const close = useCallback(() => setCartOpen(false), [setCartOpen]);
  useOverlay(cartOpen, close);
  useEffect(() => close(), [pathname, close]);

  const missing = Math.max(0, FREE_SHIPPING_FROM - subtotal);
  const progress = Math.min(1, subtotal / FREE_SHIPPING_FROM);

  return (
    <AnimatePresence>
      {cartOpen && (
        <div className="fixed inset-0 z-[60]">
          <motion.div
            className="absolute inset-0 bg-ink/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Carrinho"
            className="absolute right-0 top-0 flex h-dvh w-full max-w-[26rem] flex-col border-l border-green-line bg-green shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between border-b border-green-line/60 px-6 py-5">
              <h2 className="font-display text-2xl text-cream">
                Carrinho <span className="align-top font-sans text-xs tabular-nums text-cream">{count}</span>
              </h2>
              <button onClick={close} className="-mr-2 grid h-11 w-11 place-items-center text-cream hover:text-cream" aria-label="Fechar carrinho">
                <IconClose />
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
                <p className="font-display text-2xl italic text-cream">Sua bandeja está vazia</p>
                <p className="text-sm text-cream/85">Escolha suas peças e elas aparecem aqui.</p>
                <Link href="/loja" onClick={close} className="btn btn-primary mt-2">
                  Ver a loja
                </Link>
              </div>
            ) : (
              <>
                <div className="border-b border-green-line/60 px-6 py-4">
                  <p className="text-xs text-cream/90">
                    {missing > 0 ? (
                      <>
                        Faltam <strong className="font-semibold text-cream">{formatBRL(missing)}</strong> para o frete grátis
                      </>
                    ) : (
                      <span className="text-cream">Você ganhou frete grátis no envio econômico</span>
                    )}
                  </p>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-green-deep">
                    <motion.div className="h-full rounded-full bg-red" animate={{ width: `${progress * 100}%` }} />
                  </div>
                </div>

                <ul className="flex-1 divide-y divide-green-line/50 overflow-y-auto px-6">
                  <AnimatePresence initial={false}>
                    {lines.map((l) => (
                      <motion.li
                        key={`${l.productId}-${l.variant}`}
                        layout
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex gap-4 py-5"
                      >
                        <Link
                          href={`/produto/${l.product.slug}`}
                          className="relative h-20 w-20 shrink-0 rounded-lg bg-cream"
                          aria-label={l.product.name}
                        >
                          <ProductPhoto product={l.product} fill sizes="80px" className="p-[10%]" />
                        </Link>
                        <div className="min-w-0 flex-1">
                          <div className="flex justify-between gap-3">
                            <Link href={`/produto/${l.product.slug}`} className="font-display text-lg leading-tight text-cream hover:text-cream">
                              {l.product.name}
                            </Link>
                            <span className="shrink-0 text-sm tabular-nums text-cream">{formatBRL(l.total)}</span>
                          </div>
                          <p className="mt-0.5 text-xs text-cream/80">{l.variant}</p>
                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center rounded-full border border-green-line">
                              <button
                                className="grid h-9 w-9 place-items-center text-cream hover:text-cream"
                                onClick={() => setQty(l.productId, l.variant, l.qty - 1)}
                                aria-label={`Diminuir quantidade de ${l.product.name}`}
                              >
                                <IconMinus className="h-3.5 w-3.5" />
                              </button>
                              <span className="w-6 text-center text-sm tabular-nums text-cream">{l.qty}</span>
                              <button
                                className="grid h-9 w-9 place-items-center text-cream hover:text-cream"
                                onClick={() => setQty(l.productId, l.variant, l.qty + 1)}
                                aria-label={`Aumentar quantidade de ${l.product.name}`}
                              >
                                <IconPlus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <button
                              className="grid h-9 w-9 place-items-center text-cream/80 hover:text-cream"
                              onClick={() => remove(l.productId, l.variant)}
                              aria-label={`Remover ${l.product.name}`}
                            >
                              <IconTrash className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>

                <div className="border-t border-green-line/60 px-6 pb-6 pt-5">
                  <div className="flex items-baseline justify-between">
                    <span className="eyebrow text-cream/90">Subtotal</span>
                    <span className="font-display text-2xl tabular-nums text-cream">{formatBRL(subtotal)}</span>
                  </div>
                  <p className="mt-1 text-xs text-cream/80">Frete e cupom calculados na finalização.</p>
                  <Link href="/checkout" onClick={close} className="btn btn-primary mt-5 w-full">
                    Finalizar compra
                  </Link>
                  <button onClick={close} className="eyebrow mt-4 w-full text-center text-cream/85 hover:text-cream">
                    Continuar comprando
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
