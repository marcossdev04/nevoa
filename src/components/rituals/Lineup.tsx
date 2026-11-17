"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ART, ProductArt } from "@/components/art/ProductArt";
import { useStore } from "@/components/store/StoreProvider";
import { IconArrow, IconClose, IconPlus } from "@/components/ui";
import { getCategories, getProductById } from "@/lib/api";
import { formatBRL } from "@/lib/format";
import type { Product, Ritual } from "@/lib/types";

type Kit = Ritual & { products: Product[] };

/**
 * "Monte o Ritual": uma fila de composições, uma em foco e as outras desfocadas.
 * Ao escolher uma, ela fica sozinha em cena e o painel lista as peças do ritual.
 */
export function Lineup({ rituals }: { rituals: Ritual[] }) {
  const kits: Kit[] = rituals.map((r) => ({
    ...r,
    products: r.productIds.flatMap((id) => getProductById(id) ?? []),
  }));

  const { add } = useStore();
  const [active, setActive] = useState(Math.min(1, kits.length - 1));
  const [solo, setSolo] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const [stageW, setStageW] = useState(0);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setStageW(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const sceneW = stageW < 640 ? stageW * 0.78 : Math.min(460, stageW * 0.42);
  const kit = kits[active];
  const total = kit.products.reduce((n, p) => n + p.price, 0);
  const go = (i: number) => setActive((i + kits.length) % kits.length);

  return (
    <div
      className="grid min-h-[calc(100svh-4.5rem)] lg:grid-cols-[1fr_22rem]"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(active + 1);
        if (e.key === "ArrowLeft") go(active - 1);
        if (e.key === "Escape") setSolo(false);
      }}
    >
      <section className="relative flex min-h-[40rem] flex-col overflow-hidden" aria-label="Rituais">
        <div className="fog bottom-0 left-[20%] h-[40vh] w-[50vw]" />

        <div className="relative z-10 flex items-start justify-between px-4 pt-8 sm:px-10 sm:pt-12">
          <AnimatePresence mode="wait">
            {solo ? (
              <motion.div key={kit.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <p className="eyebrow text-sky">Ritual {kit.number}</p>
                <h1 className="mt-1 font-display text-3xl text-cream sm:text-4xl">{kit.name}</h1>
              </motion.div>
            ) : (
              <motion.div key="intro" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <h1 className="font-display text-4xl text-cream sm:text-6xl">
                  Monte o <em className="font-script not-italic text-sky">Ritual.</em>
                </h1>
                <p className="mt-3 max-w-sm text-sm text-cream-soft/65">
                  Seis rituais, da peça principal ao último detalhe. Toque em um para ver as peças.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          {solo && (
            <button
              onClick={() => setSolo(false)}
              className="eyebrow flex h-11 items-center gap-2 text-cream hover:text-sky"
            >
              Todos <IconClose className="h-4 w-4" />
            </button>
          )}
        </div>

        <div ref={stage} className="relative flex-1">
          <motion.div
            className="absolute bottom-10 left-0 flex items-end"
            animate={{ x: stageW / 2 - (active + 0.5) * sceneW }}
            transition={{ type: "spring", stiffness: 70, damping: 17 }}
          >
            {kits.map((k, i) => {
              const d = Math.abs(i - active);
              return (
                <motion.button
                  key={k.id}
                  type="button"
                  style={{ width: sceneW }}
                  className="relative shrink-0 origin-bottom outline-offset-4"
                  onClick={() => (i === active ? setSolo((s) => !s) : setActive(i))}
                  animate={{
                    opacity: solo ? (d ? 0 : 1) : Math.max(0.3, 1 - d * 0.28),
                    scale: d ? 0.84 : solo ? 1.14 : 1,
                    filter: `blur(${d ? 2 + d * 2.5 : 0}px)`,
                  }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  aria-label={`Ritual ${k.number}: ${k.name}`}
                  aria-pressed={i === active}
                  tabIndex={solo && d ? -1 : 0}
                >
                  <Scene kit={k} width={sceneW} />
                  <span
                    className={`mt-5 block text-center transition-opacity duration-500 ${d || solo ? "opacity-0" : "opacity-100"}`}
                  >
                    <span className="eyebrow text-sky">{k.number}</span>
                    <span className="mt-1 block font-display text-xl italic text-cream">{k.name}</span>
                  </span>
                </motion.button>
              );
            })}
          </motion.div>
        </div>

        <div className="relative z-10 flex items-center justify-center gap-4 pb-6">
          <button
            onClick={() => go(active - 1)}
            className="grid h-11 w-11 place-items-center rounded-full border border-brown-line text-cream hover:border-cream"
            aria-label="Ritual anterior"
          >
            <IconArrow className="h-4 w-4 rotate-180" />
          </button>
          <span className="eyebrow w-16 text-center tabular-nums text-cream-soft/60">
            {kit.number} / {String(kits.length).padStart(2, "0")}
          </span>
          <button
            onClick={() => go(active + 1)}
            className="grid h-11 w-11 place-items-center rounded-full border border-brown-line text-cream hover:border-cream"
            aria-label="Próximo ritual"
          >
            <IconArrow className="h-4 w-4" />
          </button>
        </div>
      </section>

      <aside className="border-t border-brown-line/60 bg-brown-deep/50 px-6 py-8 lg:border-l lg:border-t-0" aria-live="polite">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-xl text-cream">Neste ritual</h2>
          <span className="eyebrow text-cream-soft/50">{kit.products.length} peças</span>
        </div>
        <p className="mt-1 text-xs text-cream-soft/60">{kit.tagline}</p>

        <AnimatePresence mode="wait">
          <motion.ul
            key={kit.id}
            className="mt-6 divide-y divide-brown-line/50"
            initial="hidden"
            animate="show"
            exit={{ opacity: 0 }}
            variants={{ show: { transition: { staggerChildren: 0.07 } } }}
          >
            {kit.products.map((p) => (
              <motion.li
                key={p.id}
                variants={{ hidden: { opacity: 0, x: 16 }, show: { opacity: 1, x: 0 } }}
                className="flex items-center gap-4 py-4"
              >
                <Link
                  href={`/produto/${p.slug}`}
                  className="relative h-[4.5rem] w-[4.5rem] shrink-0 rounded-lg bg-brown"
                  aria-label={p.name}
                >
                  <ProductArt kind={p.art} tone={p.tone} className="absolute inset-[13%] h-[74%] w-[74%]" />
                </Link>
                <div className="min-w-0 flex-1">
                  <p className="eyebrow !text-[0.56rem] text-sky">
                    {getCategories().find((c) => c.id === p.category)?.name}
                  </p>
                  <Link href={`/produto/${p.slug}`} className="block font-display text-base leading-tight text-cream hover:text-sky">
                    {p.name}
                  </Link>
                  <p className="mt-0.5 text-xs tabular-nums text-cream-soft/70">{formatBRL(p.price)}</p>
                </div>
                <button
                  onClick={(e) => add(p, p.variants[0], 1, e.currentTarget.closest("li")?.querySelector("svg"))}
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-brown-line text-cream transition-colors hover:border-cream hover:bg-cream hover:text-ink"
                  aria-label={`Adicionar ${p.name} ao carrinho`}
                >
                  <IconPlus className="h-4 w-4" />
                </button>
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>

        <p className="mt-4 text-sm leading-relaxed text-cream-soft/65">{kit.description}</p>
        <button
          onClick={(e) => kit.products.forEach((p, i) => add(p, p.variants[0], 1, i === 0 ? e.currentTarget : null))}
          className="btn btn-primary mt-6 w-full"
        >
          Levar tudo · {formatBRL(total)}
        </button>
      </aside>
    </div>
  );
}

/** Composição de natureza-morta: peça principal ao centro, coadjuvantes ao redor, sob um arco. */
function Scene({ kit, width }: { kit: Kit; width: number }) {
  const [hero, ...sides] = kit.products;
  const s = width / 380;
  const fit = (p: Product, maxH: number, maxW: number) => {
    const a = ART[p.art];
    return a.w * Math.min(maxH / a.h, maxW / a.w) * s;
  };
  const left = sides.slice(0, 1);
  const right = sides.slice(1);

  return (
    <span className="relative flex items-end justify-center gap-[3%] px-[4%]" style={{ height: 330 * s }}>
      <span className="absolute bottom-3 left-1/2 h-[92%] w-[66%] -translate-x-1/2 rounded-t-full border border-sky/35" />
      <span className="absolute bottom-3 left-1/2 h-[86%] w-[60%] -translate-x-1/2 rounded-t-full border border-sky/15" />
      <span className="absolute bottom-0 left-1/2 h-5 w-[88%] -translate-x-1/2 rounded-[50%] bg-ink/45 blur-md" />
      {left.map((p) => (
        <ProductArt key={p.id} kind={p.art} tone={p.tone} className="relative mb-3 shrink-0" style={{ width: fit(p, 120, 84) }} />
      ))}
      <ProductArt kind={hero.art} tone={hero.tone} className="relative mb-3 shrink-0" style={{ width: fit(hero, 280, 176) }} />
      <span className="relative mb-3 flex shrink-0 flex-col items-center gap-2">
        {right.map((p) => (
          <ProductArt key={p.id} kind={p.art} tone={p.tone} style={{ width: fit(p, 96, 76) }} />
        ))}
      </span>
    </span>
  );
}
