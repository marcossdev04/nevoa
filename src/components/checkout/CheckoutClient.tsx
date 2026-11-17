"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ProductPhoto } from "@/components/ProductPhoto";
import { useStore } from "@/components/store/StoreProvider";
import { IconCheck, Ornament } from "@/components/ui";
import { PIX_DISCOUNT, createOrder, quoteShipping, validateCoupon } from "@/lib/api";
import { formatBRL, installments, maskCard, maskCep, maskCpf, maskExpiry, maskPhone } from "@/lib/format";
import type { Order, OrderInput, ShippingOption } from "@/lib/types";

type Payment = OrderInput["payment"];

const payments: { id: Payment; name: string; note: string }[] = [
  { id: "pix", name: "Pix", note: "5% de desconto, aprovação na hora" },
  { id: "cartao", name: "Cartão de crédito", note: "Em até 3× sem juros" },
  { id: "boleto", name: "Boleto", note: "Compensação em até 2 dias úteis" },
];

const UFS = "AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO".split(" ");

export function CheckoutClient() {
  const { lines, subtotal, hydrated, clear } = useStore();
  const [form, setForm] = useState({
    name: "", email: "", cpf: "", phone: "",
    cep: "", street: "", number: "", complement: "", district: "", city: "", state: "",
    card: "", cardName: "", expiry: "", cvv: "", parcels: "1",
  });
  const [payment, setPayment] = useState<Payment>("pix");
  const [shipping, setShipping] = useState<ShippingOption[] | null>(null);
  const [shippingId, setShippingId] = useState("");
  const [shippingState, setShippingState] = useState<"idle" | "loading" | "error">("idle");
  const [coupon, setCoupon] = useState<{ code: string; rate: number } | null>(null);
  const [couponInput, setCouponInput] = useState("");
  const [couponState, setCouponState] = useState<"idle" | "loading" | "error">("idle");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<Order | null>(null);

  const set = (k: keyof typeof form, mask?: (v: string) => string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: mask ? mask(e.target.value) : e.target.value }));

  // cota o frete quando o CEP fica completo
  const cepDigits = form.cep.replace(/\D/g, "");
  useEffect(() => {
    if (cepDigits.length !== 8 || !subtotal) return;
    let stale = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- estado de carregamento da cotação
    setShippingState("loading");
    quoteShipping(cepDigits, subtotal)
      .then((opts) => {
        if (stale) return;
        setShipping(opts);
        setShippingId((id) => (opts.some((o) => o.id === id) ? id : opts[0].id));
        setShippingState("idle");
      })
      .catch(() => !stale && setShippingState("error"));
    return () => {
      stale = true;
    };
  }, [cepDigits, subtotal]);

  const chosen = shipping?.find((o) => o.id === shippingId);
  const couponOff = coupon ? Math.round(subtotal * coupon.rate) : 0;
  const pixOff = payment === "pix" ? Math.round((subtotal - couponOff) * PIX_DISCOUNT) : 0;
  const total = subtotal - couponOff - pixOff + (chosen?.price ?? 0);
  const inst = installments(total);

  const applyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponState("loading");
    try {
      setCoupon(await validateCoupon(couponInput));
      setCouponInput("");
      setCouponState("idle");
    } catch {
      setCouponState("error");
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chosen) {
      setError("Informe um CEP válido para escolher a forma de envio.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const result = await createOrder(
        {
          lines: lines.map(({ productId, variant, qty }) => ({ productId, variant, qty })),
          customer: { name: form.name, email: form.email, cpf: form.cpf, phone: form.phone },
          address: {
            cep: form.cep, street: form.street, number: form.number, complement: form.complement,
            district: form.district, city: form.city, state: form.state,
          },
          shippingId,
          payment,
          coupon: coupon?.code,
        },
        total,
      );
      setOrder(result);
      clear();
      window.scrollTo({ top: 0 });
    } catch {
      setError("Não foi possível concluir o pedido. Tente novamente em instantes.");
    } finally {
      setSubmitting(false);
    }
  };

  if (order) return <Success order={order} email={form.email} />;

  if (hydrated && lines.length === 0) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 text-center">
        <h1 className="font-display text-4xl text-cream">Seu carrinho está vazio</h1>
        <p className="mt-3 text-sm text-cream/85">Adicione algumas peças antes de finalizar a compra.</p>
        <Link href="/loja" className="btn btn-primary mt-8">
          Ir para a loja
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1300px] px-4 pt-10 sm:px-8 sm:pt-14">
      <p className="eyebrow text-cream">Finalizar compra</p>
      <h1 className="mt-3 font-display text-5xl text-cream sm:text-6xl">Checkout</h1>
      <p className="mt-4 inline-block rounded-full border border-cream/60 px-4 py-1.5 text-xs text-cream">
        Ambiente de demonstração: nenhum pagamento é processado.
      </p>

      <form onSubmit={submit} className="mt-10 grid gap-12 lg:grid-cols-[1fr_24rem] lg:gap-16">
        <div className="space-y-12">
          <Section n="1" title="Seus dados">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nome completo" className="sm:col-span-2">
                <input className="field" required autoComplete="name" value={form.name} onChange={set("name")} />
              </Field>
              <Field label="E-mail">
                <input className="field" required type="email" autoComplete="email" value={form.email} onChange={set("email")} />
              </Field>
              <Field label="Celular">
                <input className="field" required inputMode="tel" autoComplete="tel" placeholder="(11) 90000-0000" minLength={14} value={form.phone} onChange={set("phone", maskPhone)} />
              </Field>
              <Field label="CPF" hint="Usado na nota fiscal e para confirmar a maioridade.">
                <input className="field" required inputMode="numeric" placeholder="000.000.000-00" minLength={14} value={form.cpf} onChange={set("cpf", maskCpf)} />
              </Field>
            </div>
          </Section>

          <Section n="2" title="Entrega">
            <div className="grid gap-4 sm:grid-cols-6">
              <Field label="CEP" className="sm:col-span-2">
                <input className="field" required inputMode="numeric" autoComplete="postal-code" placeholder="00000-000" minLength={9} value={form.cep} onChange={set("cep", maskCep)} />
              </Field>
              <Field label="Rua" className="sm:col-span-4">
                <input className="field" required autoComplete="address-line1" value={form.street} onChange={set("street")} />
              </Field>
              <Field label="Número" className="sm:col-span-2">
                <input className="field" required inputMode="numeric" value={form.number} onChange={set("number")} />
              </Field>
              <Field label="Complemento (opcional)" className="sm:col-span-4">
                <input className="field" autoComplete="address-line2" value={form.complement} onChange={set("complement")} />
              </Field>
              <Field label="Bairro" className="sm:col-span-2">
                <input className="field" required value={form.district} onChange={set("district")} />
              </Field>
              <Field label="Cidade" className="sm:col-span-3">
                <input className="field" required autoComplete="address-level2" value={form.city} onChange={set("city")} />
              </Field>
              <Field label="UF" className="sm:col-span-1">
                <select className="field" required autoComplete="address-level1" value={form.state} onChange={set("state")}>
                  <option value="" />
                  {UFS.map((uf) => (
                    <option key={uf}>{uf}</option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="mt-6" aria-live="polite">
              {shippingState === "loading" && <p className="text-sm text-cream/85">Calculando o frete…</p>}
              {shippingState === "error" && <p className="text-sm text-cream">Não conseguimos calcular o frete para esse CEP.</p>}
              {!shipping && shippingState === "idle" && (
                <p className="text-sm text-cream/80">Informe o CEP para ver as opções de envio.</p>
              )}
              {shipping && shippingState !== "loading" && (
                <div role="radiogroup" aria-label="Forma de envio" className="grid gap-3 sm:grid-cols-2">
                  {shipping.map((o) => (
                    <Choice key={o.id} name="shipping" checked={o.id === shippingId} onChange={() => setShippingId(o.id)} title={o.name} note={o.eta} right={o.price ? formatBRL(o.price) : "Grátis"} />
                  ))}
                </div>
              )}
            </div>
          </Section>

          <Section n="3" title="Pagamento">
            <div role="radiogroup" aria-label="Forma de pagamento" className="grid gap-3">
              {payments.map((p) => (
                <Choice key={p.id} name="payment" checked={p.id === payment} onChange={() => setPayment(p.id)} title={p.name} note={p.note} />
              ))}
            </div>

            {payment === "cartao" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-5 grid gap-4 sm:grid-cols-4">
                <Field label="Número do cartão" className="sm:col-span-4">
                  <input className="field" required inputMode="numeric" autoComplete="cc-number" placeholder="0000 0000 0000 0000" minLength={19} value={form.card} onChange={set("card", maskCard)} />
                </Field>
                <Field label="Nome impresso" className="sm:col-span-4">
                  <input className="field" required autoComplete="cc-name" value={form.cardName} onChange={set("cardName")} />
                </Field>
                <Field label="Validade" className="sm:col-span-1">
                  <input className="field" required inputMode="numeric" autoComplete="cc-exp" placeholder="MM/AA" minLength={5} value={form.expiry} onChange={set("expiry", maskExpiry)} />
                </Field>
                <Field label="CVV" className="sm:col-span-1">
                  <input className="field" required inputMode="numeric" autoComplete="cc-csc" placeholder="000" minLength={3} maxLength={4} value={form.cvv} onChange={set("cvv", (v) => v.replace(/\D/g, ""))} />
                </Field>
                <Field label="Parcelas" className="sm:col-span-2">
                  <select className="field" value={form.parcels} onChange={set("parcels")}>
                    {Array.from({ length: inst.n }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n}× de {formatBRL(Math.ceil(total / n))} sem juros
                      </option>
                    ))}
                  </select>
                </Field>
              </motion.div>
            )}
            {payment === "pix" && <p className="mt-4 text-sm text-cream/85">O código Pix aparece na próxima tela, logo após confirmar o pedido.</p>}
            {payment === "boleto" && <p className="mt-4 text-sm text-cream/85">O boleto é gerado na próxima tela e enviado para o seu e-mail.</p>}
          </Section>
        </div>

        <aside className="h-fit rounded-2xl border border-green-line/60 bg-green-deep/60 p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-2xl text-cream">Resumo</h2>
          <ul className="mt-5 divide-y divide-green-line/50">
            {lines.map((l) => (
              <li key={`${l.productId}-${l.variant}`} className="flex items-center gap-4 py-3.5">
                <span className="relative h-14 w-14 shrink-0 rounded-lg bg-cream">
                  <ProductPhoto product={l.product} fill sizes="56px" className="p-[10%]" />
                  <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-red px-1 text-[0.65rem] font-semibold tabular-nums text-cream">
                    {l.qty}
                  </span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display text-base text-cream">{l.product.name}</span>
                  <span className="block text-xs text-cream/80">{l.variant}</span>
                </span>
                <span className="text-sm tabular-nums text-cream">{formatBRL(l.total)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 border-t border-green-line/50 pt-5">
            {coupon ? (
              <p className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-cream">
                  <IconCheck className="h-4 w-4" /> Cupom {coupon.code}
                </span>
                <button type="button" className="text-xs text-cream/85 underline hover:text-cream" onClick={() => setCoupon(null)}>
                  Remover
                </button>
              </p>
            ) : (
              <div>
                <div className="flex gap-2">
                  <label className="flex-1">
                    <span className="sr-only">Cupom de desconto</span>
                    <input
                      className="field uppercase"
                      placeholder="Cupom"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value);
                        setCouponState("idle");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          applyCoupon();
                        }
                      }}
                      aria-invalid={couponState === "error"}
                    />
                  </label>
                  <button type="button" className="btn btn-ghost !px-5" onClick={applyCoupon} disabled={couponState === "loading"}>
                    {couponState === "loading" ? "…" : "Aplicar"}
                  </button>
                </div>
                <p className="mt-2 text-xs text-cream/80" aria-live="polite">
                  {couponState === "error" ? <span className="text-cream">Cupom inválido ou expirado.</span> : "Experimente NEVOA10."}
                </p>
              </div>
            )}
          </div>

          <dl className="mt-5 space-y-2.5 border-t border-green-line/50 pt-5 text-sm">
            <Row label="Subtotal" value={formatBRL(subtotal)} />
            {couponOff > 0 && <Row label="Cupom" value={`− ${formatBRL(couponOff)}`} accent />}
            {pixOff > 0 && <Row label="Desconto Pix" value={`− ${formatBRL(pixOff)}`} accent />}
            <Row label="Frete" value={chosen ? (chosen.price ? formatBRL(chosen.price) : "Grátis") : "A calcular"} />
            <div className="flex items-baseline justify-between border-t border-green-line/50 pt-4">
              <dt className="eyebrow text-cream/90">Total</dt>
              <dd className="font-display text-3xl tabular-nums text-cream">{formatBRL(total)}</dd>
            </div>
          </dl>

          {error && (
            <p role="alert" className="mt-4 rounded-lg border border-cream/60 px-4 py-3 text-sm text-cream">
              {error}
            </p>
          )}
          <button className="btn btn-primary mt-6 w-full" disabled={submitting || !hydrated}>
            {submitting ? "Confirmando…" : "Confirmar pedido"}
          </button>
          <p className="mt-4 text-center text-xs leading-relaxed text-cream/75">
            Ao confirmar, você declara ter 18 anos ou mais.
          </p>
        </aside>
      </form>
    </div>
  );
}

function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="flex items-baseline gap-3 border-b border-green-line/60 pb-4 font-display text-2xl text-cream">
        <span className="font-sans text-xs tabular-nums text-cream">0{n}</span>
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Field({ label, hint, className = "", children }: { label: string; hint?: string; className?: string; children: React.ReactNode }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-xs text-cream/90">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-cream/75">{hint}</span>}
    </label>
  );
}

function Choice({ name, checked, onChange, title, note, right }: { name: string; checked: boolean; onChange: () => void; title: string; note: string; right?: string }) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-4 rounded-xl border px-4 py-3.5 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-cream ${
        checked ? "border-cream bg-green-soft/50" : "border-green-line hover:border-cream/60"
      }`}
    >
      <input type="radio" name={name} checked={checked} onChange={onChange} className="sr-only" />
      <span className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border ${checked ? "border-cream" : "border-green-line"}`}>
        {checked && <span className="h-2 w-2 rounded-full bg-cream" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm text-cream">{title}</span>
        <span className="block text-xs text-cream/80">{note}</span>
      </span>
      {right && <span className="text-sm tabular-nums text-cream">{right}</span>}
    </label>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between">
      <dt className="text-cream/85">{label}</dt>
      <dd className={`tabular-nums ${accent ? "text-cream" : "text-cream"}`}>{value}</dd>
    </div>
  );
}

function Success({ order, email }: { order: Order; email: string }) {
  const [copied, setCopied] = useState(false);
  const pixCode = `00020126580014br.gov.bcb.pix0136nevoa-demo-${order.id.toLowerCase()}5204000053039865802BR5905NEVOA6009SAO PAULO6304DEMO`;

  return (
    <div className="mx-auto flex min-h-[75vh] max-w-xl flex-col items-center justify-center px-4 py-16 text-center">
      <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 160, damping: 12 }} className="grid h-16 w-16 place-items-center rounded-full bg-red text-cream">
        <IconCheck className="h-7 w-7" />
      </motion.div>
      <p className="eyebrow mt-8 text-cream">Pedido {order.id}</p>
      <h1 className="mt-3 font-display text-5xl text-cream">
        Pedido <span className="font-script text-cream">recebido</span>
      </h1>
      <p className="mt-4 text-cream/90">
        Enviamos os detalhes para <strong className="font-medium text-cream">{email}</strong>. Total de{" "}
        <strong className="font-medium tabular-nums text-cream">{formatBRL(order.total)}</strong>.
      </p>
      <Ornament className="my-8" />

      {order.payment === "pix" && (
        <div className="label-frame w-full p-7">
          <p className="eyebrow text-cream">Pague com Pix</p>
          <p className="mt-2 text-xs text-cream/85">Código de demonstração, sem valor real.</p>
          <p className="mt-4 break-all rounded-lg bg-green-deep p-4 text-left font-mono text-xs leading-relaxed text-cream/95">{pixCode}</p>
          <button
            className="btn btn-primary mt-5"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(pixCode);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              } catch {}
            }}
          >
            {copied ? "Copiado" : "Copiar código"}
          </button>
        </div>
      )}
      {order.payment === "boleto" && <p className="text-sm text-cream/90">O boleto foi enviado para o seu e-mail e vence em 3 dias úteis.</p>}
      {order.payment === "cartao" && <p className="text-sm text-cream/90">Pagamento aprovado. Seu pedido já está sendo separado.</p>}

      <Link href="/loja" className="btn btn-ghost mt-10">
        Continuar comprando
      </Link>
    </div>
  );
}
