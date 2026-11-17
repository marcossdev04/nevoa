import type { Metadata } from "next";
import { Orbit } from "@/components/orbit/Orbit";
import { getProducts } from "@/lib/api";

export const metadata: Metadata = {
  title: "Órbita",
  description: "A coleção da Névoa flutuando ao seu redor.",
};

export default function OrbitaPage() {
  // uma seleção enxuta: o anel fica legível e cada peça tem espaço
  const picks = getProducts().filter(
    (p) => p.tone === "creme" && !["hookah", "bong", "churchwarden", "tray", "humidor", "tips", "coal"].includes(p.art),
  );
  return <Orbit products={picks.slice(0, 11)} />;
}
