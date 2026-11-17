export type ArtKind =
  | "paper"
  | "tips"
  | "glassTip"
  | "grinder"
  | "flipLighter"
  | "torch"
  | "matches"
  | "pipe"
  | "churchwarden"
  | "tin"
  | "hookah"
  | "essence"
  | "coal"
  | "cigar"
  | "cutter"
  | "humidor"
  | "ashtray"
  | "tray"
  | "tube"
  | "bong";

export type Tone = "creme" | "azul";

export type CategoryId =
  | "sedas"
  | "isqueiros"
  | "cachimbos"
  | "narguile"
  | "charutos"
  | "acessorios";

export type Category = { id: CategoryId; name: string; blurb: string };

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: CategoryId;
  /** preço em centavos */
  price: number;
  /** preço "de" em centavos (opcional) */
  compareAt?: number;
  short: string;
  description: string;
  details: string[];
  variantLabel: string;
  variants: string[];
  badge?: string;
  stock: number;
  /** Ilustração placeholder. Trocar por `image` quando houver fotos reais. */
  art: ArtKind;
  tone: Tone;
  image?: string;
};

export type Ritual = {
  id: string;
  number: string;
  name: string;
  tagline: string;
  description: string;
  /** primeiro item é a peça principal */
  productIds: string[];
};

export type CartLine = { productId: string; variant: string; qty: number };

export type ShippingOption = {
  id: string;
  name: string;
  eta: string;
  /** centavos */
  price: number;
};

export type OrderInput = {
  lines: CartLine[];
  customer: { name: string; email: string; cpf: string; phone: string };
  address: {
    cep: string;
    street: string;
    number: string;
    complement?: string;
    district: string;
    city: string;
    state: string;
  };
  shippingId: string;
  payment: "pix" | "cartao" | "boleto";
  coupon?: string;
};

export type Order = { id: string; total: number; payment: OrderInput["payment"] };
