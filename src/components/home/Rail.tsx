"use client";

import { useRef } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from "motion/react";
import { ART, ProductArt } from "@/components/art/ProductArt";
import { useStore } from "@/components/store/StoreProvider";
import { IconArrow } from "@/components/ui";
import { formatBRL } from "@/lib/format";
import type { Product } from "@/lib/types";

const STRINGS = [30, 64, 40, 84, 50, 72, 34];

/**
 * A "arara" da Névoa: as peças ficam penduradas num varão de latão.
 * Arraste para os lados (elas balançam com o movimento) e clique para abrir.
 */
export function Rail({ products }: { products: Product[] }) {
  const { openQuick } = useStore();
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const dragged = useRef(false);
  const reduce = useReducedMotion();

  const x = useMotionValue(0);
  const velocity = useVelocity(x);
  const sway = useSpring(useTransform(velocity, [-1600, 1600], [11, -11], { clamp: true }), {
    stiffness: 80,
    damping: 6,
    mass: 0.7,
  });

  const minX = () => Math.min(0, (wrap.current?.clientWidth ?? 0) - (track.current?.scrollWidth ?? 0));
  const clamp = (v: number) => Math.max(minX(), Math.min(0, v));
  const glide = (to: number) => animate(x, clamp(to), { type: "spring", stiffness: 60, damping: 16 });

  const reveal = (el: HTMLElement) => {
    const w = wrap.current?.clientWidth ?? 0;
    const left = el.offsetLeft + x.get();
    if (left < 40 || left + el.offsetWidth > w - 40) glide(-(el.offsetLeft - w / 2 + el.offsetWidth / 2));
  };

  return (
    <div className="relative">
      <div
        ref={wrap}
        className="relative overflow-hidden pb-10"
        onWheel={(e) => {
          if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) x.set(clamp(x.get() - e.deltaX));
        }}
      >
        {/* varão */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[5px] bg-gradient-to-b from-cream via-cream to-[#b89f5c] shadow-[0_3px_10px_rgba(0,0,0,.35)]" />

        <motion.div
          ref={track}
          drag="x"
          dragConstraints={wrap}
          dragElastic={0.06}
          dragTransition={{ power: 0.35, timeConstant: 320 }}
          onDragStart={() => (dragged.current = true)}
          onDragEnd={() => setTimeout(() => (dragged.current = false), 60)}
          style={{ x }}
          className="flex w-max cursor-grab touch-pan-y items-start gap-[calc(var(--k)*46px)] px-[9vw] [--k:0.82] active:cursor-grabbing sm:[--k:0.95] xl:[--k:1.2]"
        >
          {products.map((p, i) => (
            <Hanging
              key={p.id}
              product={p}
              index={i}
              sway={sway}
              still={!!reduce}
              onOpen={() => !dragged.current && openQuick(p)}
              onFocus={reveal}
            />
          ))}
        </motion.div>
      </div>

      <div className="mx-auto flex max-w-[1500px] items-center justify-between px-4 sm:px-8">
        <p className="eyebrow text-cream-soft/50">Arraste · clique na peça</p>
        <div className="flex gap-2">
          <button
            className="grid h-11 w-11 place-items-center rounded-full border border-brown-line text-cream transition-colors hover:border-cream"
            onClick={() => glide(x.get() + (wrap.current?.clientWidth ?? 600) * 0.6)}
            aria-label="Peças anteriores"
          >
            <IconArrow className="h-4 w-4 rotate-180" />
          </button>
          <button
            className="grid h-11 w-11 place-items-center rounded-full border border-brown-line text-cream transition-colors hover:border-cream"
            onClick={() => glide(x.get() - (wrap.current?.clientWidth ?? 600) * 0.6)}
            aria-label="Próximas peças"
          >
            <IconArrow className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Hanging({
  product,
  index,
  sway,
  still,
  onOpen,
  onFocus,
}: {
  product: Product;
  index: number;
  sway: MotionValue<number>;
  still: boolean;
  onOpen: () => void;
  onFocus: (el: HTMLElement) => void;
}) {
  const art = ART[product.art];
  const string = STRINGS[index % STRINGS.length];
  // cada peça balança um pouco diferente, as mais compridas menos
  const factor = (0.7 + ((index * 37) % 10) / 16) * (art.h > 250 ? 0.6 : 1);
  const rotate = useTransform(sway, (v) => (still ? 0 : v * factor));

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      onFocus={(e) => onFocus(e.currentTarget)}
      style={{ rotate, transformOrigin: "50% 0%" }}
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.15 + index * 0.045, type: "spring", stiffness: 120, damping: 11 }}
      className="group relative flex shrink-0 flex-col items-center outline-offset-8"
      aria-label={`${product.name}, ${formatBRL(product.price)}. Abrir visualização rápida`}
    >
      {/* gancho + fio */}
      <span className="h-3 w-3 rounded-full border-[1.5px] border-cream/80" />
      <span className="-mt-px w-px bg-cream/55" style={{ height: `calc(var(--k) * ${string}px)` }} />

      {/* etiqueta de preço */}
      <span className="absolute left-1/2 top-3 z-10 origin-top-left rotate-[9deg] transition-transform duration-500 ease-out-soft group-hover:rotate-[-4deg]">
        <span className="ml-1.5 mt-2 block rounded-[3px] bg-cream-soft px-1.5 py-1 text-[0.625rem] font-semibold tabular-nums leading-none text-ink shadow-md">
          {formatBRL(product.price)}
        </span>
      </span>

      <span
        className="block"
        style={{ marginTop: `calc(var(--k) * ${-(art.hang ?? 0) * art.h}px)` }}
      >
      <span className="block transition-transform duration-500 ease-out-soft group-hover:translate-y-2 group-hover:scale-[1.06] group-focus-visible:scale-[1.06]">
        <ProductArt
          kind={product.art}
          tone={product.tone}
          className="block drop-shadow-[0_14px_14px_rgba(0,0,0,.28)]"
          style={{ width: `calc(var(--k) * ${art.w}px)` }}
        />
      </span>
      </span>

      <span className="pointer-events-none mt-4 max-w-[11rem] text-center font-display text-sm italic leading-tight text-cream opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
        {product.name}
      </span>
    </motion.button>
  );
}
