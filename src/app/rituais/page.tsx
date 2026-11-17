import type { Metadata } from "next";
import { Lineup } from "@/components/rituals/Lineup";
import { getRituals } from "@/lib/api";

export const metadata: Metadata = {
  title: "Rituais",
  description: "Seis rituais montados pela casa, da peça principal ao último detalhe.",
};

export default function RituaisPage() {
  return <Lineup rituals={getRituals()} />;
}
