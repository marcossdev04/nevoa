import type { Metadata } from "next";
import { Orbit } from "@/components/orbit/Orbit";
import { getProductById } from "@/lib/api";

export const metadata: Metadata = {
  title: "Órbita",
  description: "Uma seleção da Névoa girando ao seu redor.",
};

// seleção enxuta e variada: com poucas peças o anel fica legível
const picks = ["p08", "p15", "p01", "p27", "p22", "p09", "p25", "p32", "p16", "p21"];

export default function OrbitaPage() {
  return <Orbit products={picks.flatMap((id) => getProductById(id) ?? [])} />;
}
