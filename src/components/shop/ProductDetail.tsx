"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import { ART, ProductArt } from "@/components/art/ProductArt";
import { useStore } from "@/components/store/StoreProvider";
import { IconCheck, IconMinus, IconPlus } from "@/components/ui";
import { PIX_DISCOUNT, quoteShipping } from "@/lib/api";
import { formatBRL, installments, maskCep } from "@/lib/format";
import type { Product, ShippingOption } from "@/lib/types";

export function ProductDetail({ product, categoryName }: { product: Product; categoryName: string }) {
  const { add } = useStore();
  const [variant, setVariant] = useState(product.variants[0]);
  const [qty, setQty] = useState(1);
  const artRef = useRef<HTMLDivElement>(null);
  const art = ART[product.art];
  const wide = art.w / art.h > 1.25;
  const inst = installments(product.price);
  const low = product.stock <= 10;

  return (
    <div className="mt-6 grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
      <div className="relative grid min-h-[22rem] place-items-center overflow-hidden rounded-2xl bg-brown-deep px-8 py-14 sm:min-h-[34rem] lg:sticky lg:top-24 lg:h-[calc(100svh-8rem)] lg:min-h-0">
        <div className="fog left-[15%] top-[20%] h-[60%] w-[70%]" />
        <span className="absolute bottom-0 left-1/2 h-[82%] w-[min(70%,26rem)] -translate-x-1/2 rounded-t-full border border-sky/30" />
        <span className="absolute bottom-0 left-1/2 h-[76%] w-[min(62%,23rem)] -translate-x-1/2 rounded-t-full border border-sky/15" />
        <span className="absolute bottom-[9%] left-1/2 h-6 w-[45%] -translate-x-1/2 rounded-[50%] bg-ink/60 blur-lg" />
        {product.badge && (
          <span className="eyebrow absolute left-5 top-5 rounded-full bg-sky px-3 py-1.5 !text-[0.6rem] text-ink">{product.badge}</span>
        )}
        <motion.div
          ref={artRef}
          initial={{ opacity: 0, y: 30, rotate: -4 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ type: "spring", stiffness: 60, damping: 12 }}
          className="relative"
        >
          <ProductArt
            kind={product.art}
            tone={product.tone}
            title={product.name}
            className={wide ? "h-auto w-[min(72vw,28rem)]" : "h-[min(46vh,26rem)] w-auto max-w-[62vw] lg:h-[min(58vh,32rem)]"}
          />
        </motion.div>
      </div>

      <div className="lg:py-6">
        <p className="eyebrow text-sky">{categoryName}</p>
        <h1 className="mt-3 font-display text-5xl leading-[1.02] text-cream sm:text-6xl">{product.name}</h1>
        <p className="mt-3 text-cream-soft/65">{product.short}</p>

        <div className="mt-7">
          <p className="flex items-baseline gap-3">
            <span className="font-display text-4xl tabular-nums text-cream">{formatBRL(product.price)}</span>
            {product.compareAt && <s className="tabular-nums text-cream-soft/45">{formatBRL(product.compareAt)}</s>}
          </p>
          <p className="mt-2 text-sm text-cream-soft/70">
            <span className="text-sky">{formatBRL(Math.round(product.price * (1 - PIX_DISCOUNT)))} no Pix</span>
            {inst.n > 1 && (
              <>
                {" "}
                · ou {inst.n}× de {formatBRL(inst.value)} sem juros
              </>
            )}
          </p>
        </div>

        <fieldset className="mt-9">
          <legend className="eyebrow text-cream-soft/60">
            {product.variantLabel}: <span className="text-cream">{variant}</span>
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.variants.map((v) => (
              <button
                key={v}
                onClick={() => setVariant(v)}
                aria-pressed={v === variant}
                className={`min-h-11 rounded-full border px-5 text-sm transition-colors ${
                  v === variant ? "border-cream bg-cream text-ink" : "border-brown-line text-cream-soft hover:border-cream"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="mt-8 flex gap-3">
          <div className="flex items-center rounded-full border border-brown-line">
            <button className="grid h-12 w-11 place-items-center text-cream hover:text-sky disabled:opacity-30" onClick={() => setQty((q) => q - 1)} disabled={qty <= 1} aria-label="Diminuir quantidade">
              <IconMinus className="h-3.5 w-3.5" />
            </button>
            <span className="w-7 text-center tabular-nums text-cream" aria-live="polite" aria-label={`Quantidade: ${qty}`}>
              {qty}
            </span>
            <button className="grid h-12 w-11 place-items-center text-cream hover:text-sky disabled:opacity-30" onClick={() => setQty((q) => q + 1)} disabled={qty >= product.stock} aria-label="Aumentar quantidade">
              <IconPlus className="h-3.5 w-3.5" />
            </button>
          </div>
          <button className="btn btn-primary flex-1" onClick={() => add(product, variant, qty, artRef.current)}>
            Adicionar ao carrinho
          </button>
        </div>

        <p className={`mt-4 flex items-center gap-2 text-xs ${low ? "text-cream" : "text-cream-soft/60"}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${low ? "bg-cream" : "bg-sky"}`} />
          {low ? `Últimas ${product.stock} unidades` : "Em estoque, envio em 1 dia útil"}
        </p>

        <ShippingQuote price={product.price * qty} />

        <div className="mt-10 border-t border-brown-line/60 pt-8">
          <h2 className="eyebrow text-sky">Sobre a peça</h2>
          <p className="mt-4 leading-relaxed text-cream-soft/80">{product.description}</p>
          <ul className="mt-6 grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {product.details.map((d) => (
              <li key={d} className="flex items-start gap-2.5 text-sm text-cream-soft/75">
                <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-sky" />
                {d}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function ShippingQuote({ price }: { price: number }) {
  const [cep, setCep] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [options, setOptions] = useState<ShippingOption[] | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("loading");
    setOptions(null);
    try {
      setOptions(await quoteShipping(cep, price));
      setState("idle");
    } catch {
      setState("error");
    }
  };

  return (
    <div className="mt-8 rounded-xl border border-brown-line/60 p-5">
      <form onSubmit={submit} className="flex items-end gap-3">
        <label className="flex-1">
          <span className="eyebrow text-cream-soft/60">Calcular frete</span>
          <input
            className="field mt-2"
            inputMode="numeric"
            autoComplete="postal-code"
            placeholder="00000-000"
            value={cep}
            onChange={(e) => setCep(maskCep(e.target.value))}
            aria-invalid={state === "error"}
            aria-describedby="cep-msg"
          />
        </label>
        <button className="btn btn-ghost" disabled={state === "loading"}>
          {state === "loading" ? "Calculando…" : "Calcular"}
        </button>
      </form>
      <div id="cep-msg" aria-live="polite">
        {state === "error" && <p className="mt-3 text-sm text-cream">Digite um CEP válido, com 8 números.</p>}
        {options && (
          <ul className="mt-4 divide-y divide-brown-line/50 text-sm">
            {options.map((o) => (
              <li key={o.id} className="flex justify-between gap-4 py-2.5">
                <span className="text-cream-soft/80">
                  {o.name} <span className="text-cream-soft/50">· {o.eta}</span>
                </span>
                <span className="tabular-nums text-cream">{o.price ? formatBRL(o.price) : "Grátis"}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
