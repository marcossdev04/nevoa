import { categories, products, rituals } from "@/data/products";
import type { Order, OrderInput, Product, ShippingOption } from "@/lib/types";

/**
 * CAMADA DE ACESSO A DADOS (MOCK)
 *
 * Único ponto do front que conhece a origem dos dados. Para ligar o backend,
 * troque o corpo destas funções por chamadas `fetch` — as assinaturas já são
 * assíncronas onde o backend será necessário (frete, cupom, pedido).
 */

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const FREE_SHIPPING_FROM = 25000; // R$ 250,00
export const PIX_DISCOUNT = 0.05;

// ---- Catálogo (síncrono enquanto é local; vira fetch no backend) ----

export const getCategories = () => categories;
export const getProducts = () => products;
export const getRituals = () => rituals;
export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getProductById = (id: string) => products.find((p) => p.id === id);
export const getRelated = (product: Product, n = 4) =>
  [
    ...products.filter((p) => p.category === product.category && p.id !== product.id),
    ...products.filter((p) => p.category !== product.category),
  ].slice(0, n);

// ---- Frete ----

export async function quoteShipping(cep: string, subtotal: number): Promise<ShippingOption[]> {
  await wait(700);
  const digits = cep.replace(/\D/g, "");
  if (digits.length !== 8) throw new Error("CEP inválido");
  const far = Number(digits[0]) >= 5 ? 1.4 : 1;
  const free = subtotal >= FREE_SHIPPING_FROM;
  return [
    { id: "economico", name: "Econômico", eta: "6 a 9 dias úteis", price: free ? 0 : Math.round(1890 * far) },
    { id: "expresso", name: "Expresso", eta: "2 a 4 dias úteis", price: Math.round(3290 * far) },
  ];
}

// ---- Cupom ----

const coupons: Record<string, number> = { NEVOA10: 0.1, BEMVINDO: 0.05 };

export async function validateCoupon(code: string): Promise<{ code: string; rate: number }> {
  await wait(500);
  const key = code.trim().toUpperCase();
  const rate = coupons[key];
  if (!rate) throw new Error("Cupom inválido ou expirado");
  return { code: key, rate };
}

// ---- Pedido / pagamento ----
// Aqui entra o gateway de pagamento. Hoje apenas simula a criação do pedido.

export async function createOrder(input: OrderInput, total: number): Promise<Order> {
  await wait(1400);
  const id = `NV-${Math.floor(100000 + Math.random() * 900000)}`;
  return { id, total, payment: input.payment };
}
