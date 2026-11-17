import { CATS, MEGA, TAGS, brl, countOf, photo, products, type CatKey } from "@/lib/catalog";
import { PROMOS } from "@/lib/home";
import { IcoBack, IcoBag, IcoHeartLine, IcoMenu, IcoSearch, LogoMark } from "@/components/parts";

/** Faixa de avisos que troca sozinha + cabeçalho fixo com o menu de linhas. */
export function Header() {
  return (
    <>
      <div className="promo" aria-label="Avisos da loja">
        <ul id="promo">
          {PROMOS.map(([a, b, c], i) => (
            <li key={b} className={i === 0 ? "on" : undefined}>
              {a ? <>{a}&nbsp;</> : null}
              <b>{b}</b>
              {c ? (c.startsWith(":") ? c : <>&nbsp;{c}</>) : null}
            </li>
          ))}
        </ul>
      </div>

      <header className="top" id="top">
        <i className="prog" id="prog" aria-hidden="true" />
        <button className="ibtn burger" id="menuBtn" type="button" aria-label="Abrir menu">
          <IcoMenu />
        </button>
        <a className="logo" href="#" id="home" aria-label="Névoa Tabacaria, voltar ao início">
          <LogoMark />
        </a>

        <nav className="nav" id="nav" aria-label="Linhas da loja">
          {(Object.keys(CATS) as CatKey[]).map((c) => {
            const sub = MEGA[c];
            const pics = products.filter((p) => p.cat === c).slice(0, 2);
            return (
              <div key={c}>
                <a href="#parede" data-go={c}>
                  {CATS[c]}
                </a>
                {sub ? (
                  <div className="mega">
                    <div className="in">
                      <ul>
                        {sub.map((t) => (
                          <li key={t}>
                            <a href="#parede" data-go={t}>
                              {TAGS[t][0]}
                              <sup>{countOf(t)}</sup>
                            </a>
                          </li>
                        ))}
                        <li>
                          <a href="#parede" data-go={c}>
                            Tudo de {CATS[c].toLowerCase()}
                            <sup>{countOf(c)}</sup>
                          </a>
                        </li>
                      </ul>
                      <div className="pics">
                        {pics.map((p) => (
                          <button key={p.id} type="button" data-open={p.id} aria-label={`${p.name}, ${brl(p.price)}`}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={photo(p, true)} alt="" loading="lazy" />
                            {p.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
          <div>
            <a className="sale" href="#parede" data-go="ofertas">
              Ofertas
            </a>
          </div>
        </nav>

        <button className="back" id="back" type="button">
          <IcoBack />
          <span>Voltar</span>
          <span className="vh">Fechar produto</span>
        </button>

        <div className="tools">
          <button className="ibtn" id="searchBtn" type="button" aria-label="Buscar">
            <IcoSearch />
          </button>
          <button className="ibtn" id="favBtn" type="button" aria-label="Favoritos">
            <IcoHeartLine />
            <span className="n" id="favn">
              0
            </span>
          </button>
          <button className="bagbtn" id="bagbtn" type="button" aria-haspopup="dialog">
            <span className="t">Sacola</span>
            <IcoBag className="bi" w={16} h={18} />{" "}
            <span className="n" id="bagn">
              0
            </span>
          </button>
        </div>
      </header>
    </>
  );
}
