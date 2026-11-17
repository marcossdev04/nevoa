import Image from "next/image";
import type { CSSProperties } from "react";
import type { Product } from "@/lib/types";

type Props = {
  product: Product;
  className?: string;
  style?: CSSProperties;
  /** largura aproximada em tela, para o navegador escolher o arquivo certo */
  sizes?: string;
  /** texto alternativo; deixe vazio quando o nome já aparece ao lado */
  alt?: string;
  /** preenche o elemento pai (que precisa ser `relative`), mantendo a proporção */
  fill?: boolean;
  eager?: boolean;
};

/** Foto recortada do produto (fundo transparente). */
export function ProductPhoto({ product, className = "", style, sizes = "240px", alt = "", fill, eager }: Props) {
  const common = {
    src: product.image,
    sizes,
    loading: eager ? ("eager" as const) : ("lazy" as const),
    draggable: false,
    className: `object-contain ${className}`,
  };
  return fill ? (
    <Image {...common} alt={alt} fill style={style} />
  ) : (
    <Image {...common} alt={alt} width={product.w} height={product.h} style={{ height: "auto", ...style }} />
  );
}

/** Tamanho relativo da peça (unidades de tela) na arara, na órbita e nos rituais. */
export const units = (p: Product) => ({ w: (p.height * p.w) / p.h, h: p.height });
