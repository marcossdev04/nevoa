import type { Metadata } from "next";
import Link from "next/link";
import { IconArrow, Ornament } from "@/components/ui";

export const metadata: Metadata = {
  title: "A Casa",
  description: "A Névoa é uma tabacaria fina, feita para quem aprecia o ritual.",
};

const values = [
  { n: "01", title: "Curadoria", text: "Cada peça é testada por nós antes de ir para o balcão. Se não usaríamos, não vendemos." },
  { n: "02", title: "Discrição", text: "Embalagem neutra, sem marca aparente, e nota fiscal em todos os pedidos." },
  { n: "03", title: "Responsabilidade", text: "Vendemos somente para maiores de 18 anos, com verificação na compra e na entrega." },
] as const;

export default function SobrePage() {
  return (
    <div className="mx-auto max-w-[1100px] px-4 pt-16 sm:px-8 sm:pt-24">
      <header className="text-center">
        <p className="eyebrow text-cream">Tabacaria fina · Est. 2026</p>
        <h1 className="mt-4 font-display text-6xl leading-[0.95] text-cream sm:text-8xl">
          A <span className="font-script text-cream">Casa</span>
        </h1>
        <Ornament className="mt-8" />
        <p className="mx-auto mt-8 max-w-2xl font-display text-2xl italic leading-snug text-cream sm:text-3xl">
          Névoa nasceu da ideia de que acender algo é um pequeno ritual, e que rituais merecem bons objetos.
        </p>
      </header>

      <div className="mx-auto mt-16 max-w-2xl space-y-6 leading-relaxed text-cream/90">
        <p>
          Somos uma tabacaria pequena, com um balcão curto e escolhido a dedo. Em vez de mil opções, preferimos ter a seda certa,
          o isqueiro que não falha e o narguilé que rende a sessão inteira.
        </p>
        <p>
          Trabalhamos com as marcas que a gente mesmo usa e confia. Tudo o que está aqui passou pelas nossas mãos antes de chegar às suas.
        </p>
      </div>

      <div className="mt-20 grid gap-5 md:grid-cols-3">
        {values.map((v) => (
          <div key={v.title} className="label-frame flex flex-col items-center px-7 py-10 text-center">
            <p className="font-display text-6xl italic leading-none text-cream">{v.n}</p>
            <h2 className="mt-6 font-display text-2xl text-cream">{v.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-cream/90">{v.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-20 text-center">
        <Link href="/loja" className="btn btn-primary">
          Conhecer o balcão <IconArrow className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
