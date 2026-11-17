import Link from "next/link";
import { ProductArt } from "@/components/art/ProductArt";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[75vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <ProductArt kind="matches" className="w-40 rotate-[-8deg]" />
      <p className="eyebrow mt-10 text-sky">Erro 404</p>
      <h1 className="mt-3 font-display text-5xl text-cream">
        Sumiu na <span className="font-script text-sky">névoa</span>
      </h1>
      <p className="mt-4 text-sm text-cream-soft/65">Esta página não existe ou foi movida.</p>
      <Link href="/loja" className="btn btn-primary mt-8">
        Voltar para a loja
      </Link>
    </div>
  );
}
