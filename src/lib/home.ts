import type { FilterKey } from "@/lib/catalog";

/** Conteúdo editorial da página: o que aparece no herói, nas categorias e nos atalhos. */

/** Palavra gigante do herói e a peça que acende junto com ela. */
export const HERO: [word: string, productId: string][] = [
  ["enrola", "seda-zomo-perfect-brown"],
  ["acende", "isqueiro-clipper-lion-circus"],
  ["relaxa", "narguile-sultan-rose-gold"],
];

/** Cartões de "Compre por ritual": [filtro, peça da capa, título]. */
export const CATCARDS: [key: FilterKey, productId: string, title: string][] = [
  ["seda", "seda-zomo-perfect-pink", "Sedas"],
  ["piteira", "piteira-vidro-pote-de-mel", "Piteiras"],
  ["tabaco", "tabaco-hi-golden-virginia", "Tabacos"],
  ["setup", "narguile-himalaia-lk", "Narguilés"],
  ["essencia", "essencia-adalya-love-66", "Essências"],
  ["rosh", "rosh-seven-tradicional", "Rosh e mangueiras"],
  ["fogo", "macarico-bullfire-m5", "Isqueiros"],
  ["acessorios", "dichavador-caveira", "Acessórios"],
];

/** Atalhos da busca. */
export const SEARCH_CHIPS: FilterKey[] = ["seda", "piteira", "setup", "essencia", "carvao", "fogo", "acessorios", "ofertas"];

/** Fotos da seção da loja física. */
export const COLLAGE = ["narguile-moscow-lk", "seda-papelito-tradicional"];

export const PROMOS = [
  ["Frete grátis acima de", "R$ 250", ""],
  ["Cupom", "BEMVINDO", ": 10% na primeira compra"],
  ["", "5% de desconto", "no Pix e 3x sem juros no cartão"],
];

export const SAY =
  "A Névoa também é loja física. As sedas, os narguilés e as essências desta página estão no nosso balcão, com gente que entende do assunto para ajudar a escolher.";
