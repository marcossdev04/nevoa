"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useStore } from "@/components/store/StoreProvider";
import { IconBag, IconClose, IconMenu, IconSearch, IconUser, Logo } from "@/components/ui";
import { useOverlay } from "@/lib/useOverlay";

const nav = [
  { href: "/", label: "Início" },
  { href: "/loja", label: "Loja" },
  { href: "/rituais", label: "Rituais" },
  { href: "/orbita", label: "Órbita" },
  { href: "/sobre", label: "A Casa" },
];

export function Header() {
  const pathname = usePathname();
  const { count, setCartOpen, hydrated } = useStore();
  const [menu, setMenu] = useState(false);
  useOverlay(menu, () => setMenu(false));

  // eslint-disable-next-line react-hooks/set-state-in-effect -- fecha o menu ao navegar
  useEffect(() => setMenu(false), [pathname]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b border-brown-line/50 bg-brown/85 backdrop-blur-md">
      <div className="mx-auto grid h-[4.5rem] max-w-[1500px] grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-8">
        <div className="flex items-center gap-2">
          <button
            className="-ml-2 grid h-11 w-11 place-items-center text-cream lg:hidden"
            onClick={() => setMenu(true)}
            aria-label="Abrir menu"
          >
            <IconMenu />
          </button>
          <div className="hidden lg:block">
            <Logo />
          </div>
        </div>

        <div className="lg:hidden">
          <Logo />
        </div>
        <nav className="hidden items-center gap-9 lg:flex" aria-label="Principal">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`eyebrow relative py-2 transition-colors hover:text-cream ${
                isActive(item.href) ? "text-cream" : "text-cream-soft/60"
              }`}
            >
              {item.label}
              {isActive(item.href) && (
                <motion.span layoutId="nav-dot" className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rotate-45 bg-sky" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-1 text-cream">
          <Link href="/loja?buscar=1" className="hidden h-11 w-11 place-items-center transition-colors hover:text-sky sm:grid" aria-label="Buscar produtos">
            <IconSearch />
          </Link>
          <Link href="/conta" className="hidden h-11 w-11 place-items-center transition-colors hover:text-sky sm:grid" aria-label="Minha conta">
            <IconUser />
          </Link>
          <button
            data-cart-target
            onClick={() => setCartOpen(true)}
            className="relative grid h-11 w-11 place-items-center transition-colors hover:text-sky"
            aria-label={`Abrir carrinho, ${count} ${count === 1 ? "item" : "itens"}`}
          >
            <IconBag />
            {hydrated && count > 0 && (
              <motion.span
                key={count}
                initial={{ scale: 0.4 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 18 }}
                className="absolute right-0.5 top-1 grid h-[1.15rem] min-w-[1.15rem] place-items-center rounded-full bg-sky px-1 text-[0.65rem] font-semibold tabular-nums text-ink"
              >
                {count}
              </motion.span>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menu && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex h-dvh flex-col bg-brown px-6 pb-10 pt-4 lg:hidden"
          >
            <div className="flex items-center justify-between">
              <Logo />
              <button className="-mr-2 grid h-11 w-11 place-items-center text-cream" onClick={() => setMenu(false)} aria-label="Fechar menu">
                <IconClose />
              </button>
            </div>
            <nav className="mt-10 flex flex-1 flex-col gap-1" aria-label="Menu móvel">
              {[...nav, { href: "/conta", label: "Minha conta" }].map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.4 }}
                >
                  <Link
                    href={item.href}
                    className={`block border-b border-brown-line/60 py-4 font-display text-3xl ${
                      isActive(item.href) ? "italic text-sky" : "text-cream"
                    }`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <p className="eyebrow text-cream-soft/50">Venda proibida para menores de 18 anos</p>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
