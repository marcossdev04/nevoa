import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Jost, Yesteryear } from "next/font/google";
import { StoreProvider } from "@/components/store/StoreProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { QuickView } from "@/components/QuickView";
import { AgeGate } from "@/components/AgeGate";
import "./globals.css";

const bodoni = Bodoni_Moda({ variable: "--font-bodoni", subsets: ["latin"], style: ["normal", "italic"] });
const jost = Jost({ variable: "--font-jost", subsets: ["latin"] });
const yesteryear = Yesteryear({ variable: "--font-yesteryear", subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: { default: "Névoa — Tabacaria Fina", template: "%s · Névoa" },
  description:
    "Névoa é uma tabacaria fina: sedas, isqueiros, narguilés, essências, tabacos e acessórios escolhidos a dedo. Venda proibida para menores de 18 anos.",
};

export const viewport: Viewport = { themeColor: "#018D3E" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${bodoni.variable} ${jost.variable} ${yesteryear.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <StoreProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <QuickView />
          <AgeGate />
        </StoreProvider>
      </body>
    </html>
  );
}
