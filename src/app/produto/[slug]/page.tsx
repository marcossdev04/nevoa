import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { ProductDetail } from "@/components/shop/ProductDetail";
import { getCategories, getProduct, getProducts, getRelated } from "@/lib/api";

export function generateStaticParams() {
  return getProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/produto/[slug]">): Promise<Metadata> {
  const product = getProduct((await params).slug);
  return product ? { title: product.name, description: product.description } : {};
}

export default async function ProductPage({ params }: PageProps<"/produto/[slug]">) {
  const product = getProduct((await params).slug);
  if (!product) notFound();
  const category = getCategories().find((c) => c.id === product.category)!;

  return (
    <div className="mx-auto max-w-[1500px] px-4 pt-8 sm:px-8">
      <nav aria-label="Você está em" className="flex flex-wrap items-center gap-2 text-xs text-cream-soft/50">
        <Link href="/loja" className="hover:text-cream">
          Loja
        </Link>
        <span aria-hidden>/</span>
        <Link href={`/loja?categoria=${category.id}`} className="hover:text-cream">
          {category.name}
        </Link>
        <span aria-hidden>/</span>
        <span className="text-cream-soft/80">{product.name}</span>
      </nav>

      <ProductDetail product={product} categoryName={category.name} />

      <section className="mt-28">
        <p className="eyebrow text-sky">Combina com</p>
        <h2 className="mt-3 font-display text-4xl text-cream">Você também pode gostar</h2>
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
          {getRelated(product).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
