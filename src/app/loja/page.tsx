import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopClient } from "@/components/shop/ShopClient";
import { getCategories, getProducts } from "@/lib/api";

export const metadata: Metadata = {
  title: "Loja",
  description: "Sedas, isqueiros, cachimbos, narguilés, charutos e acessórios de tabacaria.",
};

export default function LojaPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <ShopClient products={getProducts()} categories={getCategories()} />
    </Suspense>
  );
}
