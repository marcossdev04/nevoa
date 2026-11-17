/**
 * CATÁLOGO MOCKADO
 *
 * Tudo aqui é provisório e vira resposta de API quando o backend existir.
 * Nomes, preços e fotos são ilustrativos; descontos, opções e estoque são inventados.
 *
 * Fotos: `public/produtos/<id>.webp` (800×1000) e `<id>-p.webp` (miniatura 240×300).
 */

export type CatKey = "enrolar" | "narguile" | "fogo" | "acessorios";
export type TagKey = "seda" | "piteira" | "tabaco" | "setup" | "essencia" | "rosh" | "carvao";

export type Product = {
  id: string;
  name: string;
  /** linha de apoio: material, tamanho, apresentação */
  sub: string;
  brand: string;
  cat: CatKey;
  tag?: TagKey;
  /** preço em reais */
  price: number;
  /** preço antigo, quando a peça está em oferta */
  was?: number;
  /** opções de compra (cor, modelo). Terminar com "!" marca a opção como esgotada. */
  options?: string[];
  /** apresentação única, para peças sem opções (ex.: "Caixa com 25") */
  unit?: string;
};

/** Linhas da loja (menu principal). */
export const CATS: Record<CatKey, string> = {
  enrolar: "Enrolar",
  narguile: "Narguilé",
  fogo: "Isqueiros",
  acessorios: "Acessórios",
};

/** Subdivisões: [nome, linha a que pertence]. */
export const TAGS: Record<TagKey, [string, CatKey]> = {
  seda: ["Sedas", "enrolar"],
  piteira: ["Piteiras", "enrolar"],
  tabaco: ["Tabacos", "enrolar"],
  setup: ["Narguilés", "narguile"],
  essencia: ["Essências", "narguile"],
  rosh: ["Rosh e mangueiras", "narguile"],
  carvao: ["Carvão", "narguile"],
};

/** Linhas que abrem submenu, e em que ordem. */
export const MEGA: Partial<Record<CatKey, TagKey[]>> = {
  enrolar: ["seda", "piteira", "tabaco"],
  narguile: ["setup", "essencia", "rosh", "carvao"],
};

export const BRANDS = ["Zomo", "Papelito", "Clipper", "Adalya", "Ziggy", "Seven"];

/** A ordem desta lista é a ordem "Destaques" da parede. */
export const products: Product[] = [
  { id: "narguile-sultan-rose-gold", name: "Narguilé Miid Sultan", sub: "Setup completo, rose gold", brand: "Sultan", cat: "narguile", tag: "setup", price: 578.9, options: ["Rose Gold", "Silver", "Champagne!", "Midnight Green"] },
  { id: "seda-zomo-perfect-brown", name: "Seda Zomo Perfect Brown", sub: "Natural, caixa com 25 livretos", brand: "Zomo", cat: "enrolar", tag: "seda", price: 19.9, unit: "Caixa com 25" },
  { id: "isqueiro-clipper-lion-circus", name: "Isqueiro Clipper Lion Circus", sub: "Recarregável, estampa colecionável", brand: "Clipper", cat: "fogo", price: 20.95, options: ["Palhaço", "Mágico", "Domadora", "Cartola!"] },
  { id: "essencia-adalya-love-66", name: "Essência Adalya Love 66", sub: "50 g, melancia, maracujá e menta", brand: "Adalya", cat: "narguile", tag: "essencia", price: 13.9, unit: "50 g" },
  { id: "dichavador-caveira", name: "Dichavador Caveira", sub: "Metal, 5,5 cm, três partes", brand: "Ibra", cat: "acessorios", price: 23.9, options: ["Bronze", "Prata", "Cobre"] },
  { id: "rosh-seven-tradicional", name: "Rosh Seven Tradicional", sub: "Cerâmica esmaltada", brand: "Seven", cat: "narguile", tag: "rosh", price: 33.9, options: ["Vermelho", "Preto", "Branco", "Rosa!"] },
  { id: "seda-zomo-perfect-pink", name: "Seda Zomo Perfect Pink", sub: "King size 108 mm, display com 25", brand: "Zomo", cat: "enrolar", tag: "seda", price: 20.9, was: 24.9, unit: "Display com 25" },
  { id: "narguile-himalaia-lk", name: "Narguilé Himalaia", sub: "LK, setup completo com vaso lapidado", brand: "LK", cat: "narguile", tag: "setup", price: 550, was: 619.9, options: ["Roxo", "Preto"] },
  { id: "piteira-vidro-pote-de-mel", name: "Piteira de Vidro Pote de Mel", sub: "Green, feita à mão", brand: "Green", cat: "enrolar", tag: "piteira", price: 12.9, unit: "Unidade" },
  { id: "charuto-phillies-titan", name: "Charuto Phillies Titan", sub: "Chocolate, caixa com 5", brand: "Titan", cat: "acessorios", price: 85.9, was: 94.9, options: ["Chocolate", "Conhaque!"] },
  { id: "macarico-bullfire-m5", name: "Maçarico Bullfire M-5", sub: "Chama ajustável, encaixe em lata", brand: "Bullfire", cat: "fogo", price: 20.9, unit: "Unidade" },
  { id: "tabaco-hi-golden-virginia", name: "Tabaco Hi Golden Virginia", sub: "Para enrolar, pacote de 35 g", brand: "Hi Tobacco", cat: "enrolar", tag: "tabaco", price: 20.95, unit: "35 g" },
  { id: "essencia-zomo-cereja", name: "Essência Zomo Strong Cereja", sub: "50 g, edição limitada", brand: "Zomo", cat: "narguile", tag: "essencia", price: 7.9, unit: "50 g" },
  { id: "carvao-rainbow-coco", name: "Carvão Rainbow Coco Jumbo", sub: "1 kg, casca de coco", brand: "Rainbow", cat: "narguile", tag: "carvao", price: 26.5, options: ["1 kg", "500 g"] },
  { id: "narguile-moscow-lk", name: "Narguilé Moscow", sub: "LK, setup completo com vaso fumê", brand: "LK", cat: "narguile", tag: "setup", price: 526.9, unit: "Setup completo" },
  { id: "seda-papelito-tradicional", name: "Seda Papelito Tradicional", sub: "King size, caixa com 25 livretos", brand: "Papelito", cat: "enrolar", tag: "seda", price: 49.5, unit: "Caixa com 25" },
  { id: "tesoura-vintage-dourada", name: "Tesoura Vintage Dourada", sub: "Aço, 12 cm", brand: "Ibra", cat: "acessorios", price: 11.5, options: ["Dourada", "Rose Gold", "Envelhecida"] },
  { id: "isqueiro-dubai-wahay", name: "Isqueiro Maçarico Dubai Wahay", sub: "Recarregável, cor sortida", brand: "Dubai", cat: "fogo", price: 13, options: ["Rosa", "Verde", "Lilás", "Amarelo!"] },
  { id: "rosh-beta-gold", name: "Rosh Beta Gold", sub: "Cerâmica com detalhe dourado", brand: "Beta", cat: "narguile", tag: "rosh", price: 30.9, unit: "Unidade" },
  { id: "piteira-yellow-finger", name: "Piteira Yellow Finger", sub: "Papel, bloco com 100", brand: "Papelito", cat: "enrolar", tag: "piteira", price: 4.99, unit: "Bloco com 100" },
  { id: "narguile-dubai-burj", name: "Narguilé Dubai Burj", sub: "Kit completo, com case", brand: "Dubai", cat: "narguile", tag: "setup", price: 109.9, was: 129.9, options: ["Azul", "Rosa", "Dourado", "Vermelho!"] },
  { id: "cinzeiro-vidro-londres", name: "Cinzeiro de Vidro Londres", sub: "Vidro grosso, três apoios", brand: "Ibra", cat: "acessorios", price: 17.9, unit: "Unidade" },
  { id: "essencia-ziggy-fresh-lemon", name: "Essência Ziggy Fresh Lemon", sub: "50 g, limão gelado", brand: "Ziggy", cat: "narguile", tag: "essencia", price: 8.5, unit: "50 g" },
  { id: "tabaco-acrema-lata", name: "Tabaco Acrema Blend", sub: "Para enrolar, lata de 80 g", brand: "Acrema", cat: "enrolar", tag: "tabaco", price: 36.9, unit: "Lata 80 g" },
  { id: "mangueira-helix", name: "Mangueira Helix", sub: "Silicone lavável com mola", brand: "Helix", cat: "narguile", tag: "rosh", price: 21.9, options: ["Preta", "Vermelha", "Rosa", "Dourada"] },
  { id: "isqueiro-firestar-planet", name: "Isqueiro Firestar Planet", sub: "Eletrônico, estampa sortida", brand: "Firestar", cat: "fogo", price: 7.25, was: 8.9, unit: "Unidade" },
  { id: "seda-acrema-brown", name: "Seda Acrema Brown", sub: "King size, caixa com 25", brand: "Acrema", cat: "enrolar", tag: "seda", price: 57.9, was: 64.9, options: ["Brown", "White"] },
  { id: "narguile-amazon-future", name: "Narguilé Amazon Future", sub: "Completo, 30 cm, preto", brand: "Amazon", cat: "narguile", tag: "setup", price: 156.9, unit: "Completo" },
  { id: "case-preta-multiuso", name: "Case Preta Multiuso", sub: "Rígida, com zíper", brand: "Ibra", cat: "acessorios", price: 11.5, options: ["P", "G"] },
  { id: "carvao-dark-coco", name: "Carvão Dark Coco Jumbo", sub: "1 kg, coco natural", brand: "Dark Coco", cat: "narguile", tag: "carvao", price: 13.9, was: 16.9, unit: "1 kg" },
  { id: "piteira-vidro-cogumelo", name: "Piteira de Vidro Cogumelo", sub: "Green, vidro borossilicato", brand: "Green", cat: "enrolar", tag: "piteira", price: 6.5, options: ["Verde", "Azul!", "Rosa"] },
  { id: "isqueiro-dubai-harar", name: "Isqueiro Maçarico Dubai Harar", sub: "Recarregável, preto", brand: "Dubai", cat: "fogo", price: 7.9, unit: "Unidade" },
  { id: "kit-cinzeiros-inox", name: "Kit 3 Cinzeiros de Inox", sub: "11, 9,5 e 7 cm", brand: "Ibra", cat: "acessorios", price: 18.9, unit: "Kit com 3" },
  { id: "bong-acrilico", name: "Bong de Acrílico", sub: "15 cm, cor sortida", brand: "Ibra", cat: "acessorios", price: 12.6, options: ["Verde", "Azul", "Vermelho", "Fumê"] },
  { id: "cortador-guilhotina", name: "Cortador de Charuto Guilhotina", sub: "Inox, lâmina dupla, 9 cm", brand: "Ibra", cat: "acessorios", price: 19.9, unit: "Unidade" },
];
