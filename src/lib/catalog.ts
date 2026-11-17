import { CATS, MEGA, TAGS, products, type CatKey, type Product, type TagKey } from "@/data/products";

/**
 * Regras da loja e leitura do catálogo.
 *
 * Único ponto que conhece a origem dos produtos. Para ligar o backend, troque
 * `products` por dados vindos da API (e mova as regras de frete, cupom e
 * parcelamento para o servidor).
 */

export const STORE = {
  name: "Névoa",
  /** frete grátis a partir deste valor (R$) */
  freeShipping: 250,
  /** desconto no Pix */
  pix: 0.05,
  /** parcelas sem juros */
  installments: 3,
  coupon: { code: "BEMVINDO", rate: 0.1 },
  // Dados de contato fictícios: troque pelos da loja.
  whatsapp: "https://wa.me/5500000000000",
  phone: "(00) 00000-0000",
  address: "Rua do Comércio, 000, Centro",
  mapQuery: "Névoa Tabacaria",
};

/** Filtros da parede: uma linha, uma subdivisão, "tudo" ou "ofertas". */
export type FilterKey = "tudo" | "ofertas" | CatKey | TagKey;

export const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const photo = (p: Product, small = false) => `/produtos/${p.id}${small ? "-p" : ""}.webp`;

/** desconto em %, 0 quando não há oferta */
export const pct = (p: Product) => (p.was ? Math.round((1 - p.price / p.was) * 100) : 0);

export const options = (p: Product) =>
  (p.options ?? []).map((o) => ({ v: o.replace("!", ""), ok: !o.endsWith("!") }));

export const match = (p: Product, k: FilterKey) =>
  k === "tudo" || p.cat === k || p.tag === k || (k === "ofertas" && !!p.was);

export const countOf = (k: FilterKey) => products.filter((p) => match(p, k)).length;

export const isTag = (k: string): k is TagKey => k in TAGS;
export const isCat = (k: string): k is CatKey => k in CATS;

export const labelOf = (k: FilterKey) =>
  k === "tudo" ? "Tudo" : k === "ofertas" ? "Ofertas" : isCat(k) ? CATS[k] : TAGS[k][0];

/** linha a que um filtro pertence (a própria chave, se já for uma linha) */
export const parentOf = (k: FilterKey): FilterKey => (isTag(k) ? TAGS[k][1] : k);

export const subsOf = (k: FilterKey) => (isCat(k) ? MEGA[k] : undefined);

export const byId = Object.fromEntries(products.map((p) => [p.id, p])) as Record<string, Product>;

export const crumb = (p: Product) =>
  [CATS[p.cat], p.tag ? TAGS[p.tag][0] : "", p.brand].filter(Boolean).join(" / ");

export const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

/** texto pesquisável de cada peça */
export const haystack = (p: Product) =>
  norm([p.name, p.sub, p.brand, CATS[p.cat], p.tag ? TAGS[p.tag][0] : ""].join(" "));

export { CATS, MEGA, TAGS, products };
export type { CatKey, Product, TagKey };
