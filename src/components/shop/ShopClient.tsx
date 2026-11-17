"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ProductCard } from "@/components/ProductCard";
import { IconSearch } from "@/components/ui";
import type { Category, Product } from "@/lib/types";

const sorts = {
  destaque: "Destaques",
  menor: "Menor preço",
  maior: "Maior preço",
  nome: "Nome A–Z",
} as const;
type Sort = keyof typeof sorts;

export function ShopClient({ products, categories }: { products: Product[]; categories: Category[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const category = categories.find((c) => c.id === params.get("categoria"))?.id ?? "todos";
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("destaque");
  const search = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (params.get("buscar")) search.current?.focus();
  }, [params]);

  const setCategory = (id: string) => router.replace(id === "todos" ? "/loja" : `/loja?categoria=${id}`, { scroll: false });

  const list = useMemo(() => {
    const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
    const q = norm(query.trim());
    const out = products.filter(
      (p) => (category === "todos" || p.category === category) && (!q || norm(`${p.name} ${p.short}`).includes(q)),
    );
    if (sort === "menor") out.sort((a, b) => a.price - b.price);
    if (sort === "maior") out.sort((a, b) => b.price - a.price);
    if (sort === "nome") out.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
    return out;
  }, [products, category, query, sort]);

  const current = categories.find((c) => c.id === category);

  return (
    <div className="mx-auto max-w-[1500px] px-4 pt-12 sm:px-8 sm:pt-16">
      <header className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="eyebrow text-cream">{current ? current.blurb : "Coleção completa"}</p>
          <h1 className="mt-3 font-display text-5xl text-cream sm:text-7xl">{current ? current.name : "A Loja"}</h1>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative block sm:w-72">
            <span className="sr-only">Buscar produtos</span>
            <IconSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-cream/80" />
            <input
              ref={search}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar seda, isqueiro, narguilé…"
              className="field !rounded-full !pl-11"
            />
          </label>
          <label className="block">
            <span className="sr-only">Ordenar por</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="field !rounded-full sm:w-48">
              {Object.entries(sorts).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </label>
        </div>
      </header>

      <nav className="no-scrollbar -mx-4 mt-10 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0" aria-label="Categorias">
        {[{ id: "todos", name: "Tudo" }, ...categories].map((c) => {
          const on = c.id === category;
          const n = c.id === "todos" ? products.length : products.filter((p) => p.category === c.id).length;
          return (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              aria-pressed={on}
              className={`flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-5 text-sm transition-colors ${
                on ? "border-cream bg-cream text-ink" : "border-green-line text-cream hover:border-cream"
              }`}
            >
              {c.name}
              <span className={`text-[0.65rem] tabular-nums ${on ? "text-ink/60" : "text-cream/75"}`}>{n}</span>
            </button>
          );
        })}
      </nav>

      <p className="mt-8 text-xs text-cream/80" role="status">
        {list.length} {list.length === 1 ? "produto" : "produtos"}
      </p>

      {list.length ? (
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:gap-x-6 xl:grid-cols-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {list.map((p) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="mt-16 text-center">
          <p className="font-display text-3xl italic text-cream">Nada por aqui</p>
          <p className="mt-2 text-sm text-cream/85">Não encontramos nada para “{query}”. Tente outro termo.</p>
          <button
            className="btn btn-ghost mt-6"
            onClick={() => {
              setQuery("");
              setCategory("todos");
            }}
          >
            Limpar filtros
          </button>
        </div>
      )}
    </div>
  );
}
