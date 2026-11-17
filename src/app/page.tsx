import Link from "next/link";
import { ProductArt } from "@/components/art/ProductArt";
import { Rail } from "@/components/home/Rail";
import { ProductCard } from "@/components/ProductCard";
import { IconArrow, Ornament } from "@/components/ui";
import { getCategories, getProductById, getProducts, getRituals } from "@/lib/api";
import type { ArtKind, CategoryId } from "@/lib/types";

const categoryArt: Record<CategoryId, ArtKind> = {
  sedas: "paper",
  isqueiros: "flipLighter",
  cachimbos: "pipe",
  narguile: "hookah",
  charutos: "cigar",
  acessorios: "grinder",
};

// ordem pensada para dar ritmo de alturas na arara
const railOrder = ["p06", "p01", "p12", "p09", "p05", "p15", "p21", "p08", "p17", "p03", "p11", "p07", "p19", "p13", "p10", "p20", "p16", "p22", "p14", "p18", "p04", "p02"];

export default function Home() {
  const products = getProducts();
  const rail = railOrder.flatMap((id) => getProductById(id) ?? []);
  const featured = ["p06", "p12", "p09", "p17"].flatMap((id) => getProductById(id) ?? []);
  const rituals = getRituals().slice(0, 3);

  return (
    <>
      {/* ARARA */}
      <section className="relative flex min-h-[calc(100svh-4.5rem)] flex-col overflow-hidden">
        <div className="fog left-[5%] top-[30%] h-[45vh] w-[45vw]" />
        <div className="fog right-0 top-[10%] h-[35vh] w-[35vw] [animation-delay:-9s]" />

        <div className="relative px-4 pb-8 pt-8 text-center sm:pb-10 sm:pt-10">
          <p className="eyebrow flex items-center justify-center gap-4">
            <span className="text-cream">Nova coleção</span>
            <span className="h-3 w-px bg-brown-line" />
            <span className="text-cream-soft/50">Tabacaria fina</span>
          </p>
          <h1 className="sr-only">Névoa — tabacaria fina</h1>
        </div>

        <div className="relative flex-1">
          <Rail products={rail} />
        </div>

        <div className="relative mx-auto flex w-full max-w-[1500px] flex-col gap-6 px-4 pb-10 pt-8 sm:flex-row sm:items-end sm:justify-between sm:px-8">
          <p className="max-w-md font-display text-3xl leading-[1.1] text-cream sm:text-4xl">
            Para quem aprecia o ritual <em className="font-script text-[1.15em] not-italic text-sky">tanto quanto</em> a fumaça.
          </p>
          <Link href="/loja" className="btn btn-primary self-start sm:self-auto">
            Ver a loja toda <IconArrow className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* FAIXA DE RÓTULO */}
      <div className="border-y border-cream/70 py-1">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 border-y border-cream/30 px-4 py-3">
          {["Seleção artesanal", "Embalagem discreta", "5% off no Pix", "Frete grátis acima de R$ 250"].map((t, i) => (
            <span key={t} className="eyebrow flex items-center gap-8 text-cream">
              {i > 0 && <span className="hidden h-1.5 w-1.5 rotate-45 bg-sky sm:block" />}
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* CATEGORIAS */}
      <section className="mx-auto max-w-[1500px] px-4 pt-24 sm:px-8">
        <SectionTitle eyebrow="Por categoria" title="O balcão da casa" />
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
          {getCategories().map((c) => (
            <Link
              key={c.id}
              href={`/loja?categoria=${c.id}`}
              className="group flex flex-col items-center rounded-xl border border-brown-line/60 px-4 pb-6 pt-8 text-center transition-colors duration-500 hover:border-cream/70 hover:bg-brown-soft/40"
            >
              <span className="grid h-28 place-items-center">
                <ProductArt
                  kind={categoryArt[c.id]}
                  className="max-h-28 w-auto max-w-[7.5rem] transition-transform duration-500 ease-out-soft group-hover:-translate-y-1.5 group-hover:rotate-[-4deg]"
                />
              </span>
              <span className="mt-6 font-display text-lg leading-tight text-cream">{c.name}</span>
              <span className="mt-1 text-xs text-cream-soft/55">{c.blurb}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* RITUAIS */}
      <section className="mx-auto mt-28 grid max-w-[1500px] items-center gap-12 px-4 sm:px-8 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <p className="eyebrow text-sky">Kits da casa</p>
          <h2 className="mt-4 font-display text-5xl leading-[1.02] text-cream sm:text-6xl">
            Monte o <span className="font-script text-sky">Ritual.</span>
          </h2>
          <p className="mt-6 max-w-md leading-relaxed text-cream-soft/70">
            Reunimos as peças que combinam entre si em seis rituais, da peça principal ao último detalhe. Escolha um e leve só o
            que faltar.
          </p>
          <Link href="/rituais" className="btn btn-ghost mt-8">
            Ver os rituais <IconArrow className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:gap-5">
          {rituals.map((r, i) => {
            const hero = getProductById(r.productIds[0])!;
            return (
              <Link
                key={r.id}
                href="/rituais"
                className={`group relative flex aspect-[3/5] flex-col items-center justify-end overflow-hidden rounded-t-full border border-sky/35 px-3 pb-6 transition-colors duration-500 hover:border-cream ${i === 1 ? "sm:-translate-y-8" : ""}`}
              >
                <ProductArt
                  kind={hero.art}
                  tone={hero.tone}
                  className="max-h-[58%] w-auto max-w-[72%] transition-transform duration-700 ease-out-soft group-hover:-translate-y-2 group-hover:scale-105"
                />
                <span className="eyebrow mt-5 text-sky">{r.number}</span>
                <span className="mt-1 text-center font-display text-base italic leading-tight text-cream sm:text-xl">{r.name}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* DESTAQUES */}
      <section className="mx-auto mt-28 max-w-[1500px] px-4 sm:px-8">
        <div className="flex items-end justify-between gap-6">
          <SectionTitle eyebrow="Destaques" title="Peças da temporada" align="left" />
          <Link href="/loja" className="link-underline hidden shrink-0 text-sm text-cream sm:inline">
            Ver todos os {products.length} produtos
          </Link>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* ÓRBITA */}
      <section className="mx-auto mt-28 max-w-[1500px] px-4 sm:px-8">
        <Link
          href="/orbita"
          className="label-frame group relative flex min-h-[22rem] flex-col items-center justify-center overflow-hidden px-6 py-16 text-center"
        >
          <ProductArt kind="flipLighter" className="absolute left-[6%] top-[14%] w-20 rotate-[-18deg] opacity-80 transition-transform duration-700 ease-out-soft group-hover:-translate-y-3 sm:w-28" />
          <ProductArt kind="grinder" tone="azul" className="absolute bottom-[12%] left-[20%] hidden w-24 rotate-[10deg] opacity-60 blur-[1.5px] transition-transform duration-700 ease-out-soft group-hover:translate-y-2 md:block" />
          <ProductArt kind="cutter" className="absolute right-[8%] top-[18%] w-24 rotate-[14deg] opacity-70 transition-transform duration-700 ease-out-soft group-hover:translate-x-2 sm:w-36" />
          <ProductArt kind="tube" tone="azul" className="absolute bottom-[10%] right-[22%] hidden w-9 rotate-[-24deg] opacity-60 blur-[1px] transition-transform duration-700 ease-out-soft group-hover:-translate-y-2 md:block" />
          <p className="eyebrow relative text-sky">Experiência</p>
          <h2 className="relative mt-4 font-display text-6xl font-semibold uppercase leading-[0.9] text-cream sm:text-8xl">Órbita</h2>
          <p className="relative mt-5 max-w-sm text-sm text-cream-soft/70">
            A coleção inteira flutuando ao seu redor. Gire, encontre e abra a peça que passar pela frente.
          </p>
          <span className="btn btn-primary relative mt-8">
            Entrar em órbita <IconArrow className="h-4 w-4" />
          </span>
        </Link>
      </section>
    </>
  );
}

function SectionTitle({ eyebrow, title, align = "center" }: { eyebrow: string; title: string; align?: "center" | "left" }) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      <p className="eyebrow text-sky">{eyebrow}</p>
      <h2 className="mt-3 font-display text-4xl text-cream sm:text-5xl">{title}</h2>
      {align === "center" && <Ornament className="mt-5" />}
    </div>
  );
}
