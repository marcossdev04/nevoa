import { BRANDS } from "@/data/products";
import { CATS, STORE, brl, byId, countOf, labelOf, pct, products, type FilterKey } from "@/lib/catalog";
import { CATCARDS, COLLAGE, HERO, SAY } from "@/lib/home";
import { Card, IcoBag, IcoCheck, IcoHeart, IcoNext, IcoPrev, LogoMark, Price, Shot } from "@/components/parts";

const money = brl(STORE.freeShipping).replace(",00", "");

/** Herói: frase fixa + palavra gigante que troca, e três peças que acendem em sequência. */
export function Hero() {
  return (
    <section className="hero sec" id="hero" aria-label="Destaque">
      <div className="h-copy">
        <h1 className="h-title disp">
          <span className="ln h-l1">
            <span>Feita pra quem</span>
          </span>
          <span className="ln">
            <span className="h-word" id="hword" aria-live="off">
              <span>{HERO[0][0]}</span>
            </span>
          </span>
        </h1>
        <span className="shelf is-on" aria-hidden="true" />
        <p className="h-lede">
          Sedas, piteiras, isqueiros, narguilés e essências de Zomo, Papelito, Clipper e Adalya. Frete grátis acima de {money}.
        </p>
        <div className="h-cta">
          <a className="btn solid" href="#parede" data-go="tudo">
            Ver a loja inteira
          </a>
          <a className="btn line" href="#parede" data-go="ofertas">
            Ver ofertas
          </a>
        </div>
      </div>
      <div className="h-show" id="hshow">
        {HERO.map(([, id], k) => {
          const p = byId[id];
          return (
            <button key={id} className={`h-panel${k ? "" : " is-on"}`} type="button" data-open={id} data-k={k} aria-label={`${p.name}, ${brl(p.price)}`}>
              <span className="h-in">
                <Shot p={p} />
                <span className="cap">
                  <span className="nm">{p.name}</span>
                  <Price p={p} />
                </span>
              </span>
            </button>
          );
        })}
      </div>
      <div className="h-cue" aria-hidden="true">
        <i />
        Role para entrar na loja
      </div>
    </section>
  );
}

/** Letreiro de marcas: anda sozinho e acelera com a rolagem. */
export function Brands() {
  return (
    <section className="brands sec" aria-label="Marcas na loja">
      <div className="mv" id="mv">
        <div className="run" id="run">
          {Array.from({ length: 4 }, (_, k) => BRANDS.map((b) => <span key={`${k}-${b}`}>{b}</span>))}
        </div>
      </div>
    </section>
  );
}

/** Categorias: a seção fica presa na tela e a rolagem vertical move os cartões na horizontal. */
export function Cats() {
  return (
    <section className="cats sec" id="cats" aria-labelledby="catsH">
      <div className="pin">
        <div className="shead">
          <h2 className="disp" id="catsH">
            Compre por ritual
          </h2>
          <div className="bar" aria-hidden="true">
            <i id="cbar" />
          </div>
        </div>
        <div className="track" id="track">
          {CATCARDS.map(([k, id, title]) => {
            const n = countOf(k);
            return (
              <a key={k} className="cat" href="#parede" data-go={k}>
                <span className="cphoto">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/produtos/${id}.webp`} alt="" loading="lazy" draggable={false} />
                  <span className="ct">
                    {n} {n === 1 ? "peça" : "peças"}
                  </span>
                  <span className="cn disp">{title}</span>
                </span>
                <span className="shelf" />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Offers() {
  const offers = products.filter((p) => p.was).sort((a, b) => pct(b) - pct(a));
  return (
    <section className="band sec" id="ofertas" aria-labelledby="ofH">
      <div className="rail-wrap">
        <div className="shead rv">
          <div>
            <h2 className="disp" id="ofH">
              Ofertas
            </h2>
          </div>
          <p>
            {offers.length} peças com preço reduzido, até {pct(offers[0])}% abaixo do valor original.
          </p>
          <div className="arrows">
            <button type="button" data-rail="-1" aria-label="Ofertas anteriores">
              <IcoPrev />
            </button>
            <button type="button" data-rail="1" aria-label="Próximas ofertas">
              <IcoNext />
            </button>
          </div>
        </div>
        <div className="rail" id="ofRail">
          {offers.map((p) => (
            <Card key={p.id} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

/** A parede: todas as peças em prateleiras. Filtros, ordenação e a câmera ficam no runtime. */
export function Wall() {
  return (
    <section className="stage" id="stage" aria-labelledby="wallH">
      <span id="parede" style={{ position: "absolute", top: 36 }} />
      <div className="shead">
        <h2 className="disp" id="wallH">
          A loja inteira numa parede
        </h2>
        <p>
          Toque em uma peça para chegar perto. <span id="count" />
        </p>
      </div>
      <div className="bar2">
        <div className="chips" id="chips" role="group" aria-label="Filtrar por linha" />
        <div className="sortbox">
          <label htmlFor="sort">Ordenar</label>
          <select id="sort" defaultValue="padrao">
            <option value="padrao">Destaques</option>
            <option value="menor">Menor preço</option>
            <option value="maior">Maior preço</option>
            <option value="az">Nome, A a Z</option>
            <option value="off">Maior desconto</option>
          </select>
        </div>
        <div className="chips sub" id="subchips" role="group" aria-label="Refinar" style={{ flexBasis: "100%" }} />
      </div>
      <div className="wall" id="wall">
        {products.map((p) => (
          <div key={p.id} className="tile unlit" data-id={p.id}>
            <button className="open" type="button" aria-label={`${p.name}, ${p.sub}, ${brl(p.price)}`}>
              <Shot p={p} />
              <span className="cap">
                <span className="nm">{p.name}</span>
                <Price p={p} short />
              </span>
            </button>
            <button className="fav" type="button" data-fav={p.id} aria-pressed="false" aria-label={`Favoritar ${p.name}`}>
              <IcoHeart w={17} h={15} />
            </button>
          </div>
        ))}
      </div>
      <div className="none" id="none" hidden>
        <b>Nenhuma peça por aqui</b>
        <span id="noneTxt" />
        <br />
        <button className="pill" type="button" data-go="tudo">
          Ver a loja inteira
        </button>
      </div>
    </section>
  );
}

/** Ficha da peça: aparece por cima da parede depois que a câmera chega perto. */
export function Detail() {
  return (
    <div className="detail" id="detail" aria-live="polite">
      <div className="d-scrim" />
      <div className="d-wire" />
      <div className="d-title">
        <p className="d-crumb" id="dCrumb" />
        <div className="d-clip">
          <h2 className="d-name" id="dName" />
        </div>
        <i className="rule" />
        <p className="d-sub" id="dSub" />
      </div>
      <div className="d-panel" id="dPanel">
        <div className="d-price">
          <span className="was" id="dWas" />
          <strong className="now" id="dNow" />
          <p className="terms" id="dTerms" />
        </div>
        <div className="d-thumbs" id="dThumbs" aria-label="Fotos do produto" />
        <div className="cta-row">
          <div className="cta-wrap">
            <div className="sizes" id="sizes" role="dialog" aria-label="Escolha a opção">
              <p>Escolha a opção</p>
              <ul id="sizeList" />
            </div>
            <button className="cta" id="cta" type="button">
              <span className="lbl" id="ctaLbl">
                Adicionar à sacola
              </span>
              <span className="ic" aria-hidden="true">
                <IcoBag className="bg" />
                <IcoCheck className="ck" />
              </span>
            </button>
          </div>
          <button className="fav" id="dFav" type="button" aria-pressed="false" aria-label="Favoritar">
            <IcoHeart />
          </button>
        </div>
        <p className="d-note" id="dNote" />
        <dl className="d-facts" id="dFacts" />
        <a className="d-wa" id="dWa" href={STORE.whatsapp} target="_blank" rel="noopener">
          Tirar dúvida no WhatsApp
        </a>
      </div>
      <div className="d-pager">
        <button type="button" id="prev" aria-label="Produto anterior">
          <IcoPrev />
        </button>
        <button type="button" id="next" aria-label="Próximo produto">
          <IcoNext />
        </button>
        <span className="ct" id="dCount" />
      </div>
    </div>
  );
}

export function Recent() {
  return (
    <section className="recent sec" id="recent" aria-labelledby="rcH" hidden>
      <div className="rail-wrap">
        <div className="shead">
          <h2 className="disp" id="rcH">
            Você viu há pouco
          </h2>
        </div>
        <div className="rail" id="rcRail" />
      </div>
    </section>
  );
}

/** Loja física: o texto acende palavra por palavra conforme a página rola. */
export function StoreInfo() {
  const words = SAY.split(" ");
  return (
    <section className="store sec" id="loja" aria-label="Loja física">
      <div>
        <p className="say" id="say">
          {words.map((w, i) => (
            <span key={i}>
              <span className="w">{w}</span>
              {i < words.length - 1 ? " " : ""}
            </span>
          ))}
        </p>
        <address>
          <b>{STORE.address}</b>WhatsApp {STORE.phone}
        </address>
        <div className="acts">
          <a className="btn solid" href={STORE.whatsapp} target="_blank" rel="noopener">
            Chamar no WhatsApp
          </a>
          <a
            className="btn line"
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(STORE.mapQuery)}`}
            target="_blank"
            rel="noopener"
          >
            Abrir no mapa
          </a>
        </div>
      </div>
      <div className="collage" id="collage" aria-hidden="true">
        {COLLAGE.map((id) => (
          <figure key={id}>
            <Shot p={byId[id]} />
          </figure>
        ))}
      </div>
    </section>
  );
}

export function Perks() {
  return (
    <section className="perks sec" aria-label="Condições de compra">
      <ul>
        <li>
          <strong className="disp">Frete grátis</strong>
          <span>Em compras acima de {money}.</span>
        </li>
        <li>
          <strong className="disp">{STORE.installments}x sem juros</strong>
          <span>No cartão, em qualquer peça da loja.</span>
        </li>
        <li>
          <strong className="disp">{STORE.pix * 100}% no Pix</strong>
          <span>Desconto aplicado na hora de pagar.</span>
        </li>
        <li>
          <strong className="disp">{STORE.coupon.rate * 100}% na primeira</strong>
          <span>Use o cupom {STORE.coupon.code} na sacola.</span>
          <button className="pill" id="copy" type="button">
            Copiar cupom
          </button>
        </li>
      </ul>
    </section>
  );
}

export function News() {
  return (
    <section className="news sec" aria-labelledby="nwH">
      <div className="in">
        <h2 className="disp" id="nwH">
          Lançamentos e ofertas no seu e-mail
        </h2>
        <form id="news" noValidate>
          <input id="newsIn" type="email" placeholder="Seu e-mail" aria-label="Seu e-mail" autoComplete="email" />
          <button className="btn solid" type="submit">
            Quero receber
          </button>
        </form>
        <p className="msg" id="newsMsg" role="status" />
      </div>
    </section>
  );
}

export function Footer() {
  const keys: FilterKey[] = [...(Object.keys(CATS) as FilterKey[]), "ofertas"];
  return (
    <footer className="foot">
      <div className="in">
        <div className="cols">
          <div>
            <span className="logo">
              <LogoMark />
            </span>
            <p>{STORE.address}</p>
            <p>
              WhatsApp{" "}
              <a href={STORE.whatsapp} target="_blank" rel="noopener">
                {STORE.phone}
              </a>
            </p>
            <span className="age">Venda proibida para menores de 18 anos</span>
          </div>
          <div>
            <h3>Comprar</h3>
            <ul id="footCats">
              {keys.map((c) => (
                <li key={c}>
                  <a href="#parede" data-go={c}>
                    {labelOf(c)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Ajuda</h3>
            <ul>
              {["Contato", "Frete e entrega", "Trocas e devoluções", "Privacidade", "Termos de uso"].map((t) => (
                <li key={t}>
                  <button type="button" data-soon>
                    {t}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Pagamento</h3>
            <ul>
              <li>Pix com {STORE.pix * 100}% de desconto</li>
              <li>Cartão em até {STORE.installments}x sem juros</li>
              <li>Site seguro com SSL</li>
            </ul>
          </div>
        </div>
        <div className="base">
          <span>
            Protótipo de front-end da loja. Produtos, preços e contatos são ilustrativos. Checkout, newsletter e páginas de
            política ainda não estão ligados. Produtos destinados a adultos: fumar é prejudicial à saúde.
          </span>
          <span>Névoa Tabacaria</span>
        </div>
      </div>
    </footer>
  );
}
