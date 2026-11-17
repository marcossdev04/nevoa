import Link from "next/link";
import { getCategories } from "@/lib/api";
import { Ornament } from "@/components/ui";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-brown-line/60 bg-brown-deep">
      <div className="mx-auto max-w-[1500px] px-4 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className="font-script text-5xl text-cream">Névoa</p>
            <p className="eyebrow mt-1 text-sky">Tabacaria fina · Est. 2026</p>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-cream-soft/70">
              Artigos de tabacaria escolhidos a dedo, para quem aprecia o ritual tanto quanto a fumaça.
            </p>
          </div>

          <FooterCol title="Loja">
            {getCategories().map((c) => (
              <FooterLink key={c.id} href={`/loja?categoria=${c.id}`}>
                {c.name}
              </FooterLink>
            ))}
          </FooterCol>

          <FooterCol title="Névoa">
            <FooterLink href="/sobre">A Casa</FooterLink>
            <FooterLink href="/rituais">Rituais</FooterLink>
            <FooterLink href="/orbita">Órbita</FooterLink>
            <FooterLink href="/conta">Minha conta</FooterLink>
          </FooterCol>

          <FooterCol title="Atendimento">
            <li className="text-sm text-cream-soft/70">Seg. a sáb., 10h às 20h</li>
            <li className="text-sm text-cream-soft/70">contato@nevoa.com.br</li>
            <li className="text-sm text-cream-soft/70">Frete grátis acima de R$ 250</li>
            <li className="text-sm text-cream-soft/70">Embalagem discreta</li>
          </FooterCol>
        </div>

        <Ornament className="my-12" />

        <div className="label-frame mx-auto max-w-3xl px-6 py-5 text-center">
          <p className="eyebrow text-cream">Venda proibida para menores de 18 anos</p>
          <p className="mt-2 text-xs leading-relaxed text-cream-soft/60">
            Produtos destinados exclusivamente a adultos. Fumar é prejudicial à saúde.
          </p>
        </div>

        <p className="mt-10 text-center text-xs text-cream-soft/40">
          © 2026 Névoa Tabacaria. Loja em versão de demonstração: produtos, preços e pedidos são fictícios.
        </p>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="eyebrow text-sky">{title}</h2>
      <ul className="mt-5 space-y-3">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-sm text-cream-soft/70 transition-colors hover:text-cream">
        {children}
      </Link>
    </li>
  );
}
