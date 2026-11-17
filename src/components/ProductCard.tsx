"use client";

import Link from "next/link";
import { ProductArt } from "@/components/art/ProductArt";
import { useStore } from "@/components/store/StoreProvider";
import { IconPlus } from "@/components/ui";
import { formatBRL } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const { openQuick } = useStore();

  return (
    <article className="group relative">
      <Link href={`/produto/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-brown-deep transition-colors duration-500 group-hover:bg-brown-soft">
          <span className="absolute inset-x-[18%] bottom-[9%] h-4 rounded-[50%] bg-ink/50 blur-md transition-transform duration-500 group-hover:scale-90" />
          <ProductArt
            kind={product.art}
            tone={product.tone}
            title={product.name}
            className="absolute inset-[19%] h-[62%] w-[62%] transition-transform duration-500 ease-out-soft group-hover:-translate-y-2 group-hover:rotate-[-3deg] group-hover:scale-105"
          />
          {product.badge && (
            <span className="eyebrow absolute left-3 top-3 rounded-full bg-sky px-2.5 py-1 !text-[0.56rem] !tracking-[0.18em] text-ink">
              {product.badge}
            </span>
          )}
        </div>
        <div className="mt-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-display text-lg leading-tight text-cream transition-colors group-hover:text-sky">{product.name}</h3>
            <p className="mt-1 truncate text-xs text-cream-soft/55">{product.short}</p>
          </div>
          <p className="shrink-0 text-right text-sm tabular-nums text-cream">
            {formatBRL(product.price)}
            {product.compareAt && <s className="block text-xs text-cream-soft/40">{formatBRL(product.compareAt)}</s>}
          </p>
        </div>
      </Link>
      <button
        onClick={() => openQuick(product)}
        className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-cream text-ink opacity-100 shadow-lg transition-all duration-300 hover:bg-sky focus-visible:opacity-100 md:translate-y-1 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
        aria-label={`Compra rápida: ${product.name}`}
      >
        <IconPlus className="h-4 w-4" />
      </button>
    </article>
  );
}
