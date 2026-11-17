import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[75vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-[9rem] font-semibold leading-none text-cream" aria-hidden>
        404
      </p>
      <p className="eyebrow mt-6 text-cream">Página não encontrada</p>
      <h1 className="mt-3 font-display text-5xl text-cream">
        Sumiu na <span className="font-script text-cream">névoa</span>
      </h1>
      <p className="mt-4 text-sm text-cream/85">Esta página não existe ou foi movida.</p>
      <Link href="/loja" className="btn btn-primary mt-8">
        Voltar para a loja
      </Link>
    </div>
  );
}
