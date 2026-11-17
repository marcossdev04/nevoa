"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useAnimationFrame, useReducedMotion } from "motion/react";
import { ProductPhoto, units } from "@/components/ProductPhoto";
import { useStore } from "@/components/store/StoreProvider";
import { IconArrow } from "@/components/ui";
import { formatBRL } from "@/lib/format";
import type { Product } from "@/lib/types";

const AUTO_SPEED = 0.00009; // rad/ms
const TAU = Math.PI * 2;

/**
 * "Órbita": as peças giram num anel inclinado. A que está na frente fica grande,
 * em foco, e dá nome ao título; as outras recuam, menores e desfocadas.
 * Arraste para girar, use as setas ou clique numa peça para trazê-la à frente.
 */
export function Orbit({ products }: { products: Product[] }) {
  const { openQuick, quick, cartOpen } = useStore();
  const reduce = useReducedMotion();
  const stage = useRef<HTMLDivElement>(null);
  const els = useRef<(HTMLButtonElement | null)[]>([]);
  const rot = useRef(0);
  const vel = useRef(0);
  const target = useRef<number | null>(null);
  const drag = useRef<{ x: number } | null>(null);
  const moved = useRef(0);
  const hovering = useRef(false);
  const [front, setFront] = useState(0);
  const frontRef = useRef(0);
  const n = products.length;
  const paused = !!quick || cartOpen;

  useAnimationFrame((t, delta) => {
    const el = stage.current;
    if (!el) return;
    const dt = Math.min(delta, 50);

    if (target.current !== null) {
      // gira suavemente até a peça escolhida
      const diff = target.current - rot.current;
      rot.current += diff * Math.min(1, dt * 0.008);
      if (Math.abs(diff) < 0.002) {
        rot.current = target.current;
        target.current = null;
      }
    } else if (!drag.current && !paused) {
      const auto = reduce || hovering.current ? 0 : AUTO_SPEED;
      rot.current += (vel.current + auto) * dt;
      vel.current *= 0.93;
    }

    const W = el.clientWidth;
    const H = el.clientHeight;
    const desktop = W >= 1024;
    const rx = W * (desktop ? 0.3 : W < 640 ? 0.5 : 0.38);
    const ry = H * 0.11;
    const cx = desktop ? W * 0.14 : 0; // abre espaço para o título à esquerda
    const cy = H * (desktop ? 0.06 : 0.14);
    let best = -2;
    let bestI = 0;

    for (let i = 0; i < n; i++) {
      const node = els.current[i];
      if (!node) continue;
      const a = (i / n) * TAU + rot.current;
      const z = Math.cos(a); // 1 = frente, -1 = fundo
      const depth = (z + 1) / 2;
      const bob = reduce ? 0 : Math.sin(t / 1400 + i * 1.7) * 6;
      const px = cx + Math.sin(a) * rx;
      const py = cy + z * ry + bob;
      const scale = 0.34 + Math.pow(depth, 3) * 0.86;
      node.style.transform = `translate(-50%,-50%) translate3d(${px.toFixed(1)}px,${py.toFixed(1)}px,0) scale(${scale.toFixed(3)})`;
      node.style.opacity = (0.22 + depth * 0.78).toFixed(2);
      node.style.filter = depth < 0.5 ? `blur(${((0.5 - depth) * 7).toFixed(1)}px)` : "none";
      node.style.zIndex = String(Math.round(depth * 100));
      node.style.pointerEvents = depth > 0.3 ? "auto" : "none";
      if (z > best) {
        best = z;
        bestI = i;
      }
    }
    if (bestI !== frontRef.current) {
      frontRef.current = bestI;
      setFront(bestI);
    }
  });

  /** ângulo de rotação que coloca a peça `i` na frente, pelo caminho mais curto */
  const bringToFront = (i: number) => {
    const wanted = -(i / n) * TAU;
    const diff = ((((wanted - rot.current) % TAU) + TAU + Math.PI) % TAU) - Math.PI;
    vel.current = 0;
    target.current = rot.current + diff;
  };
  const step = (dir: number) => bringToFront((frontRef.current + dir + n) % n);

  const p = products[front];

  return (
    <section
      // `isolate` mantém as camadas da órbita abaixo do carrinho e da visualização rápida
      className="relative isolate h-[calc(100svh-4.5rem)] min-h-[36rem] touch-pan-y select-none overflow-hidden [--k:0.66] sm:[--k:1] xl:[--k:1.15]"
      aria-label="Órbita de produtos"
      onPointerDown={(e) => {
        moved.current = 0;
        target.current = null;
        drag.current = { x: e.clientX };
      }}
      onPointerMove={(e) => {
        if (!drag.current) return;
        const dx = e.clientX - drag.current.x;
        drag.current.x = e.clientX;
        moved.current += Math.abs(dx);
        rot.current += dx * 0.003;
        vel.current = (dx * 0.003) / 16;
      }}
      onPointerUp={() => (drag.current = null)}
      onPointerLeave={() => (drag.current = null)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") step(1);
        if (e.key === "ArrowLeft") step(-1);
      }}
    >
      <div className="fog left-[35%] top-[25%] h-[50vh] w-[45vw]" />
      {/* anel */}
      <div className="pointer-events-none absolute left-1/2 top-[64%] h-[22%] w-[76%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-cream/25 lg:left-[64%] lg:top-[56%] lg:w-[60%]" />

      <div className="pointer-events-none absolute left-4 top-8 z-[110] max-w-[85vw] sm:left-10 sm:top-12 lg:max-w-[34vw]">
        <p className="eyebrow tabular-nums text-cream">
          {String(front + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
        </p>
        <AnimatePresence mode="wait">
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <h1 className="mt-3 text-balance font-display text-[clamp(2rem,4.6vw,4.25rem)] font-semibold uppercase leading-[0.95] text-cream">
              {p.name}
            </h1>
            <p className="mt-4 text-lg tabular-nums text-cream">{formatBRL(p.price)}</p>
            <button
              onClick={() => openQuick(p)}
              className="link-underline pointer-events-auto mt-3 inline-flex min-h-11 items-center gap-2 text-sm text-cream"
            >
              Ver detalhes <IconArrow className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        </AnimatePresence>
      </div>

      <div ref={stage} className="absolute inset-0 cursor-grab active:cursor-grabbing">
        {products.map((item, i) => (
          <button
            key={item.id}
            ref={(el) => {
              els.current[i] = el;
            }}
            type="button"
            className="absolute left-1/2 top-1/2 will-change-transform"
            style={{ width: `calc(${units(item).w.toFixed(0)}px * var(--k))`, opacity: 0 }}
            onClick={() => {
              if (moved.current > 8) return;
              if (i === frontRef.current) openQuick(item);
              else bringToFront(i);
            }}
            onPointerEnter={() => (hovering.current = true)}
            onPointerLeave={() => (hovering.current = false)}
            aria-label={`${item.name}, ${formatBRL(item.price)}`}
            tabIndex={i === front ? 0 : -1}
          >
            <ProductPhoto
              product={item}
              sizes="300px"
              eager
              className="w-full drop-shadow-[0_22px_18px_rgba(0,0,0,.3)]"
            />
          </button>
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-6 z-[110] flex items-center justify-center gap-4">
        <button
          onClick={() => step(-1)}
          className="grid h-11 w-11 place-items-center rounded-full border border-cream/60 bg-green/70 text-cream hover:border-cream"
          aria-label="Peça anterior"
        >
          <IconArrow className="h-4 w-4 rotate-180" />
        </button>
        <span className="eyebrow text-cream/85">Arraste para girar</span>
        <button
          onClick={() => step(1)}
          className="grid h-11 w-11 place-items-center rounded-full border border-cream/60 bg-green/70 text-cream hover:border-cream"
          aria-label="Próxima peça"
        >
          <IconArrow className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
