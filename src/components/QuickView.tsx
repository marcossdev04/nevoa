"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ProductPhoto, units } from "@/components/ProductPhoto";
import { useStore } from "@/components/store/StoreProvider";
import { IconArrow, IconClose } from "@/components/ui";
import { getCategories, getProducts } from "@/lib/api";
import { formatBRL } from "@/lib/format";
import { useOverlay } from "@/lib/useOverlay";
import type { Product } from "@/lib/types";

/** Visualização rápida em tela cheia: a peça pendurada, grande, e o mínimo para comprar. */
export function QuickView() {
  const { quick, closeQuick } = useStore();
  const pathname = usePathname();
  useOverlay(!!quick, closeQuick);
  useEffect(() => closeQuick(), [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  return <AnimatePresence>{quick && <Panel key={quick.id} product={quick} />}</AnimatePresence>;
}

function Panel({ product }: { product: Product }) {
  const { closeQuick, add } = useStore();
  const [variant, setVariant] = useState(product.variants[0]);
  const [added, setAdded] = useState(false);
  const artRef = useRef<HTMLDivElement>(null);
  const all = getProducts();
  const index = all.findIndex((p) => p.id === product.id) + 1;
  const category = getCategories().find((c) => c.id === product.category);
  const art = units(product);
  const wide = art.w / art.h > 1.25;

  const onAdd = () => {
    setAdded(true);
    add(product, variant, 1, artRef.current);
    setTimeout(closeQuick, 380);
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
      className="fixed inset-0 z-50 overflow-y-auto bg-green"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="fog left-[10%] top-[20%] h-[50vh] w-[50vw]" />
      <button
        onClick={closeQuick}
        className="eyebrow fixed right-4 top-4 z-10 flex h-11 items-center gap-2 px-2 text-cream hover:text-cream sm:right-8 sm:top-6"
      >
        Fechar <IconClose className="h-4 w-4" />
      </button>

      <div className="relative mx-auto grid min-h-dvh max-w-6xl grid-rows-[auto_auto] items-center gap-8 px-6 pb-10 md:grid-cols-[1.5fr_1fr] md:grid-rows-1 md:gap-16 md:px-12">
        {/* peça pendurada por um fio, como na arara */}
        <motion.div
          className="flex origin-top flex-col items-center self-start"
          initial={{ y: -60, rotate: -5, opacity: 0 }}
          animate={{ y: 0, rotate: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 70, damping: 9, delay: 0.05 }}
        >
          <span className="h-[14vh] w-px bg-cream/60 md:h-[22vh]" />
          <span className="-mt-px h-2.5 w-2.5 rotate-45 border border-cream/70 bg-green" />
          <div
            ref={artRef}
            className={`relative mt-2 max-w-[78vw] ${wide ? "w-[30rem]" : "h-[min(46vh,26rem)] md:h-[min(56vh,32rem)]"}`}
            style={{ aspectRatio: `${product.w} / ${product.h}`, maxHeight: product.h * 1.4, maxWidth: product.w * 1.4 }}
          >
            <ProductPhoto
              product={product}
              fill
              eager
              alt={product.name}
              sizes="(max-width: 768px) 80vw, 520px"
              className="drop-shadow-[0_24px_24px_rgba(0,0,0,.3)]"
            />
          </div>
        </motion.div>

        <motion.div
          className="w-full max-w-sm justify-self-center md:justify-self-start"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <p className="eyebrow tabular-nums text-cream">
            {String(index).padStart(2, "0")} / {all.length}
          </p>
          <h2 className="mt-3 font-display text-4xl leading-[1.05] text-cream">{product.name}</h2>
          <p className="mt-2 text-sm text-cream/85">{product.short}</p>
          <p className="mt-4 flex items-baseline gap-3 text-xl tabular-nums text-cream">
            {formatBRL(product.price)}
            {product.compareAt && <s className="text-sm text-cream/75">{formatBRL(product.compareAt)}</s>}
          </p>

          <fieldset className="mt-7">
            <legend className="eyebrow text-cream/85">{product.variantLabel}</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <button
                  key={v}
                  onClick={() => setVariant(v)}
                  aria-pressed={v === variant}
                  className={`min-h-10 rounded-full border px-4 text-xs transition-colors ${
                    v === variant ? "border-cream bg-cream text-ink" : "border-green-line text-cream hover:border-cream"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </fieldset>

          <button onClick={onAdd} disabled={added} className="btn btn-primary mt-7 w-full">
            {added ? "Adicionado" : "Adicionar ao carrinho"}
          </button>

          <div className="mt-6 flex items-center justify-between border-t border-green-line/60 pt-4 text-xs text-cream/85">
            <span>{category?.name}</span>
            <Link href={`/produto/${product.slug}`} className="link-underline inline-flex items-center gap-1.5 text-cream">
              Ver página do produto <IconArrow className="h-3.5 w-3.5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
