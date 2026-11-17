"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useAnimationFrame, useReducedMotion } from "motion/react";
import { ART, ProductArt } from "@/components/art/ProductArt";
import { useStore } from "@/components/store/StoreProvider";
import { IconArrow } from "@/components/ui";
import { formatBRL } from "@/lib/format";
import type { Product } from "@/lib/types";

const AUTO_SPEED = 0.00011; // rad/ms

/**
 * "Órbita": as peças flutuam num anel inclinado ao redor do centro.
 * A que passa pela frente dá nome ao título; arraste para girar, clique para abrir.
 */
export function Orbit({ products }: { products: Product[] }) {
  const { openQuick, quick } = useStore();
  const reduce = useReducedMotion();
  const stage = useRef<HTMLDivElement>(null);
  const els = useRef<(HTMLButtonElement | null)[]>([]);
  const rot = useRef(0.4);
  const vel = useRef(0);
  const drag = useRef<{ x: number; moved: number } | null>(null);
  const hovering = useRef(false);
  const lastMoved = useRef(0);
  const [front, setFront] = useState(0);
  const frontRef = useRef(0);
  const n = products.length;

  useAnimationFrame((t, delta) => {
    const el = stage.current;
    if (!el) return;
    const dt = Math.min(delta, 50);
    if (!drag.current) {
      const auto = reduce || hovering.current || quick ? 0 : AUTO_SPEED;
      rot.current += (vel.current + auto) * dt;
      vel.current *= 0.94;
    }
    const W = el.clientWidth;
    const H = el.clientHeight;
    const wide = W >= 1024;
    const rx = W * (W < 640 ? 0.62 : wide ? 0.33 : 0.4);
    const cx = wide ? W * 0.13 : 0; // abre espaço para o título à esquerda
    const cy = H * (wide ? 0.09 : 0.12);
    let best = -2;
    let bestI = 0;

    for (let i = 0; i < n; i++) {
      const node = els.current[i];
      if (!node) continue;
      const a = (i / n) * Math.PI * 2 + rot.current;
      const z = Math.cos(a); // 1 = frente
      const depth = (z + 1) / 2;
      const lane = Math.sin(i * 2.399) * H * 0.2; // altura fixa de cada peça
      const bob = reduce ? 0 : Math.sin(t / 1300 + i * 1.7) * 7;
      const px = Math.sin(a) * rx + cx;
      const py = lane * (0.55 + depth * 0.6) - z * H * 0.07 + bob + cy;
      const scale = 0.28 + depth * depth * 0.98;
      const tilt = reduce ? 0 : Math.sin(t / 2100 + i) * 5 + Math.sin(a) * -10;
      node.style.transform = `translate(-50%,-50%) translate3d(${px}px,${py}px,0) rotate(${tilt}deg) scale(${scale})`;
      node.style.opacity = String(0.18 + depth * 0.82);
      node.style.filter = depth < 0.45 ? `blur(${(0.45 - depth) * 9}px)` : "none";
      node.style.zIndex = String(Math.round(depth * 100));
      node.style.pointerEvents = depth > 0.35 ? "auto" : "none";
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

  const step = (dir: number) => {
    // gira exatamente uma peça
    vel.current = 0;
    const target = rot.current - dir * ((Math.PI * 2) / n);
    const from = rot.current;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 600);
      rot.current = from + (target - from) * (1 - Math.pow(1 - p, 3));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const p = products[front];

  return (
    <section
      className="relative h-[calc(100svh-4.5rem)] min-h-[36rem] touch-pan-y select-none overflow-hidden [--k:0.62] sm:[--k:0.9]"
      aria-label="Órbita de produtos"
      onPointerDown={(e) => {
        lastMoved.current = 0;
        drag.current = { x: e.clientX, moved: 0 };
      }}
      onPointerMove={(e) => {
        if (!drag.current) return;
        const dx = e.clientX - drag.current.x;
        drag.current.x = e.clientX;
        drag.current.moved += Math.abs(dx);
        lastMoved.current = drag.current.moved;
        rot.current += dx * 0.0032;
        vel.current = (dx * 0.0032) / 16;
      }}
      onPointerUp={() => (drag.current = null)}
      onPointerLeave={() => (drag.current = null)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") step(1);
        if (e.key === "ArrowLeft") step(-1);
      }}
    >
      <div className="fog left-[30%] top-[25%] h-[50vh] w-[45vw]" />
      {/* anel */}
      <div className="pointer-events-none absolute left-1/2 top-[60%] h-[26%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-sky/15 lg:left-[63%] lg:w-[66%]" />

      <div className="pointer-events-none absolute left-4 top-8 z-[120] max-w-[80vw] sm:left-10 sm:top-12">
        <p className="eyebrow tabular-nums text-sky">
          {String(front + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
        </p>
        <AnimatePresence mode="wait">
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28 }}
          >
            <h1 className="mt-3 max-w-[12ch] font-display text-[clamp(2.4rem,6.5vw,5.5rem)] font-semibold uppercase leading-[0.92] text-cream">
              {p.name}
            </h1>
            <p className="mt-4 text-lg tabular-nums text-cream-soft">{formatBRL(p.price)}</p>
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
            style={{ width: `calc(${ART[item.art].w}px * var(--k))`, opacity: 0 }}
            onClick={() => lastMoved.current < 8 && openQuick(item)}
            onPointerEnter={() => (hovering.current = true)}
            onPointerLeave={() => (hovering.current = false)}
            aria-label={`${item.name}, ${formatBRL(item.price)}`}
            tabIndex={i === front ? 0 : -1}
          >
            <ProductArt kind={item.art} tone={item.tone} className="w-full drop-shadow-[0_18px_16px_rgba(0,0,0,.3)]" />
          </button>
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-6 z-[120] flex items-center justify-center gap-4">
        <button
          onClick={() => step(-1)}
          className="grid h-11 w-11 place-items-center rounded-full border border-brown-line bg-brown/60 text-cream hover:border-cream"
          aria-label="Peça anterior"
        >
          <IconArrow className="h-4 w-4 rotate-180" />
        </button>
        <span className="eyebrow text-cream-soft/50">Arraste para girar</span>
        <button
          onClick={() => step(1)}
          className="grid h-11 w-11 place-items-center rounded-full border border-brown-line bg-brown/60 text-cream hover:border-cream"
          aria-label="Próxima peça"
        >
          <IconArrow className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
