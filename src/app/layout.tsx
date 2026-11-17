import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";

// Archivo variável com eixo de largura: os títulos usam a versão condensada.
const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], display: "swap", variable: "--font-archivo" });

export const metadata: Metadata = {
  title: "Névoa — Tabacaria",
  description:
    "Sedas, piteiras, isqueiros, narguilés e essências. Frete grátis acima de R$ 250. Venda proibida para menores de 18 anos.",
};

export const viewport: Viewport = { themeColor: "#17110d" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={archivo.variable}>
      <body>{children}</body>
    </html>
  );
}
