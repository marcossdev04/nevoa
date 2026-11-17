import { CATS, MEGA, STORE, TAGS, brl, countOf, labelOf, products, type CatKey, type FilterKey } from "@/lib/catalog";
import { SEARCH_CHIPS } from "@/lib/home";
import { IcoClose, IcoNext, IcoPrev, IcoSearch, IcoUp, IcoWhats, LogoMark, Price, Shot } from "@/components/parts";

const Chev = () => <IcoNext className="ch" w={9} />;

/** Botões flutuantes, aviso rápido, véu e as camadas: sacola, favoritos, menu, busca e idade. */
export function Layers() {
  const main: FilterKey[] = [...(Object.keys(CATS) as CatKey[]), "ofertas"];
  return (
    <>
      <div className="float">
        <button className="up" id="up" type="button" aria-label="Voltar ao topo">
          <IcoUp />
        </button>
        <a className="wa" href={STORE.whatsapp} target="_blank" rel="noopener" aria-label="Falar com a loja no WhatsApp">
          <IcoWhats />
        </a>
      </div>
      <div className="toast" id="toast" role="status" />
      <div className="veil" id="veil" />

      {/* SACOLA */}
      <aside className="drawer" id="bag" role="dialog" aria-modal="true" aria-labelledby="bagH" inert>
        <header>
          <h2 className="disp" id="bagH">
            Sacola
          </h2>
          <button className="x" type="button" data-close aria-label="Fechar sacola">
            <IcoClose />
          </button>
        </header>
        <div className="ship">
          <span id="shipTxt" />
          <div className="bar">
            <i id="shipBar" />
          </div>
        </div>
        <div className="items" id="items" />
        <div className="sum">
          <form className="coupon" id="coupon">
            <input id="couponIn" type="text" placeholder="Cupom de desconto" aria-label="Cupom de desconto" autoComplete="off" />
            <button type="submit">Aplicar</button>
          </form>
          <dl id="totals" />
          <button className="go" id="go" type="button">
            Finalizar compra
          </button>
          <a className="wa" id="waOrder" href={STORE.whatsapp} target="_blank" rel="noopener">
            Enviar pedido pelo WhatsApp
          </a>
          <p className="msg" id="msg" role="status" />
        </div>
      </aside>

      {/* FAVORITOS */}
      <aside className="drawer" id="favs" role="dialog" aria-modal="true" aria-labelledby="favH" inert>
        <header>
          <h2 className="disp" id="favH">
            Favoritos
          </h2>
          <button className="x" type="button" data-close aria-label="Fechar favoritos">
            <IcoClose />
          </button>
        </header>
        <div className="items" id="favItems" />
      </aside>

      {/* MENU (telas pequenas), com um segundo nível que desliza */}
      <aside className="drawer left menu" id="menu" role="dialog" aria-modal="true" aria-label="Menu" inert>
        <header>
          <span className="logo">
            <LogoMark />
          </span>
          <button className="m-back" id="mBack" type="button">
            <IcoPrev />
            <span className="disp" id="mTitle" />
            <span className="vh">, voltar ao menu</span>
          </button>
          <button className="x" type="button" data-close aria-label="Fechar menu">
            <IcoClose />
          </button>
        </header>
        <div className="m-view" id="mView">
          <nav className="m-pane root" aria-label="Categorias">
            <button className="m-find" type="button" data-act="search">
              <IcoSearch size={17} />O que você procura?
            </button>
            <ul className="m-main" id="mMain">
              {main.map((k, i) => (
                <li key={k} style={{ "--i": i } as React.CSSProperties}>
                  {MEGA[k as CatKey] ? (
                    <button className="m-row disp" type="button" data-sub={k}>
                      <span>
                        {labelOf(k)}
                        <sup>{countOf(k)}</sup>
                      </span>
                      <Chev />
                    </button>
                  ) : (
                    <a className={`m-row disp${k === "ofertas" ? " sale" : ""}`} href="#parede" data-go={k}>
                      <span>
                        {labelOf(k)}
                        <sup>{countOf(k)}</sup>
                      </span>
                      <Chev />
                    </a>
                  )}
                </li>
              ))}
            </ul>
            <ul className="m-sec">
              <li>
                <button className="m-row" type="button" data-act="favs">
                  <span>Favoritos</span>
                  <span className="n" id="mFavN">
                    0
                  </span>
                </button>
              </li>
              <li>
                <button className="m-row" type="button" data-act="bag">
                  <span>Sacola</span>
                  <span className="n" id="mBagN">
                    0
                  </span>
                </button>
              </li>
              <li>
                <a className="m-row" href="#loja" data-jump="#loja">
                  <span>Loja física</span>
                </a>
              </li>
              <li>
                <a className="m-row" href={STORE.whatsapp} target="_blank" rel="noopener">
                  <span>Falar no WhatsApp</span>
                </a>
              </li>
            </ul>
          </nav>

          {(Object.keys(MEGA) as CatKey[]).map((c) => (
            <div key={c} className="m-pane sub" data-pane={c} inert>
              <ul className="m-list">
                {[c, ...MEGA[c]!].map((k) => (
                  <li key={k}>
                    <a className="m-row" href="#parede" data-go={k}>
                      <span>
                        {k === c ? `Tudo de ${CATS[c].toLowerCase()}` : TAGS[k as keyof typeof TAGS][0]}
                        <sup>{countOf(k as FilterKey)}</sup>
                      </span>
                      <Chev />
                    </a>
                  </li>
                ))}
              </ul>
              <div className="m-pics">
                {products
                  .filter((p) => p.cat === c)
                  .slice(0, 2)
                  .map((p) => (
                    <button key={p.id} type="button" data-open={p.id} aria-label={`${p.name}, ${brl(p.price)}`}>
                      <Shot p={p} />
                      <span className="cap">
                        <span className="nm">{p.name}</span>
                        <Price p={p} short />
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>
        <footer>
          <b>{STORE.address}</b>WhatsApp {STORE.phone}
        </footer>
      </aside>

      {/* BUSCA */}
      <div className="search" id="search" role="dialog" aria-modal="true" aria-label="Buscar na loja" inert>
        <div className="in">
          <form id="sForm" role="search">
            <input id="sIn" type="search" placeholder="O que você procura?" aria-label="Buscar produtos" autoComplete="off" />
            <button className="x" type="button" data-close aria-label="Fechar busca">
              <IcoClose />
            </button>
          </form>
          <p className="hint" id="sHint">
            Atalhos
          </p>
          <div className="chips" id="sChips">
            {SEARCH_CHIPS.map((k) => (
              <button key={k} type="button" data-go={k}>
                {labelOf(k)}
              </button>
            ))}
          </div>
          <div className="sres" id="sRes" />
          <button className="pill all" id="sAll" type="button" hidden />
        </div>
      </div>

      {/* VERIFICAÇÃO DE IDADE */}
      <div className="gate" id="gate" role="dialog" aria-modal="true" aria-labelledby="gateH" inert>
        <div className="box">
          <span className="logo">
            <LogoMark />
          </span>
          <h2 className="disp" id="gateH">
            Você tem 18 anos ou mais?
          </h2>
          <span className="shelf is-on" aria-hidden="true" />
          <p id="gateTxt">Esta loja vende artigos de tabacaria, destinados só a adultos.</p>
          <div className="acts">
            <button className="btn solid" id="gateYes" type="button">
              Sim, tenho 18 ou mais
            </button>
            <button className="btn line" id="gateNo" type="button">
              Não
            </button>
          </div>
          <small>Venda proibida para menores de 18 anos.</small>
        </div>
      </div>
    </>
  );
}
