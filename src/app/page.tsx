import { Header } from "@/components/Header";
import { Layers } from "@/components/Layers";
import { Brands, Cats, Detail, Footer, Hero, News, Offers, Perks, Recent, StoreInfo, Wall } from "@/components/Sections";
import { StoreRuntime } from "@/components/StoreRuntime";

/**
 * A loja é uma página só. A ordem abaixo é a ordem dos blocos na tela;
 * o comportamento (câmera, filtros, sacola, busca) fica em src/lib/runtime.ts.
 */
export default function Home() {
  return (
    <>
      <div className="wallbg" id="wallbg" aria-hidden="true" />
      <Header />
      <main>
        <Hero />
        <Brands />
        <Cats />
        <Offers />
        <Wall />
        <Detail />
        <Recent />
        <StoreInfo />
        <Perks />
        <News />
      </main>
      <Footer />
      <Layers />
      <StoreRuntime />
    </>
  );
}
