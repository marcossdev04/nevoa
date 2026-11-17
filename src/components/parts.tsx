import { brl, pct, photo, type Product } from "@/lib/catalog";

/* Ícones em traço fino, usados no cabeçalho, nas gavetas e na ficha. */
type I = { className?: string };
export const IcoMenu = () => (
  <svg width="18" height="12" viewBox="0 0 18 12" aria-hidden="true">
    <path d="M0 1h18M0 6h18M0 11h18" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);
export const IcoBack = () => (
  <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden="true">
    <path d="M6 1 1 6l5 5M1.5 6H18" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);
export const IcoSearch = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.6" />
    <path d="m12 12 5 5" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);
const HEART = "M9.5 15.5S1.5 11 1.5 5.6C1.5 3.3 3.3 1.5 5.5 1.5c1.7 0 3.1 1 4 2.4.9-1.4 2.3-2.4 4-2.4 2.2 0 4 1.8 4 4.1 0 5.4-8 9.9-8 9.9Z";
export const IcoHeartLine = () => (
  <svg width="19" height="17" viewBox="0 0 19 17" fill="none" aria-hidden="true">
    <path d={HEART} stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);
/** Coração preenchível via CSS (.fav) */
export const IcoHeart = ({ w = 19, h = 17 }: { w?: number; h?: number }) => (
  <svg width={w} height={h} viewBox="0 0 19 17" aria-hidden="true">
    <path d={HEART} />
  </svg>
);
export const IcoBag = ({ className, w = 18, h = 20 }: I & { w?: number; h?: number }) => (
  <svg className={className} width={w} height={h} viewBox="0 0 18 20" fill="none" aria-hidden="true">
    <path d="M1.5 6.5h15l-1 12h-13l-1-12Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M5.5 6.5V5a3.5 3.5 0 0 1 7 0v1.5" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);
export const IcoCheck = ({ className }: I) => (
  <svg className={className} width="20" height="16" viewBox="0 0 20 16" fill="none" aria-hidden="true">
    <path d="M2 8.5 7.5 14 18 2.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const IcoPrev = () => (
  <svg width="10" height="16" viewBox="0 0 10 16" fill="none" aria-hidden="true">
    <path d="M8.5 1 1.5 8l7 7" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);
export const IcoNext = ({ className, w = 10 }: I & { w?: number }) => (
  <svg className={className} width={w} height="16" viewBox="0 0 10 16" fill="none" aria-hidden="true">
    <path d="m1.5 1 7 7-7 7" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);
export const IcoClose = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="m1 1 12 12M13 1 1 13" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);
export const IcoUp = () => (
  <svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden="true">
    <path d="m1 9 7-7 7 7" stroke="currentColor" strokeWidth="2" />
  </svg>
);
export const IcoWhats = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3 .79.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.25-.12-1.46-.72-1.69-.8-.23-.09-.39-.13-.56.12-.16.25-.64.8-.78.97-.14.16-.29.18-.54.06a6.7 6.7 0 0 1-3.34-2.92c-.25-.43.25-.4.72-1.34.08-.16.04-.3-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42h-.47c-.16 0-.43.06-.65.3-.23.25-.86.84-.86 2.05s.88 2.38 1 2.54c.12.16 1.73 2.64 4.2 3.7 1.56.67 2.17.73 2.95.61.47-.07 1.46-.6 1.67-1.17.2-.58.2-1.07.14-1.17-.06-.11-.22-.17-.47-.29Z" />
  </svg>
);

/** Marca: NÉVOA // TABACARIA, no mesmo desenho inclinado do modelo. */
export function LogoMark() {
  return (
    <>
      <span className="l">NÉVOA</span>
      <i />
      <i />
      <span className="lt">TABACARIA</span>
    </>
  );
}

export function Price({ p, short }: { p: Product; short?: boolean }) {
  return (
    <span className={`pr${p.was ? " sale" : ""}`}>
      {p.was && !short ? <s>{brl(p.was)}</s> : null}
      {brl(p.price)}
    </span>
  );
}

/** Foto na prateleira: a foto, o selo de desconto e a régua de LED embaixo. */
export function Shot({ p }: { p: Product }) {
  const off = pct(p);
  return (
    <>
      <span className="photo">
        {off ? <span className="off">-{off}%</span> : null}
        {/* eslint-disable-next-line @next/next/no-img-element -- fotos estáticas já no tamanho certo */}
        <img className="a" src={photo(p)} alt="" width={800} height={1000} loading="lazy" decoding="async" draggable={false} />
        <span className="ph">{p.name}</span>
      </span>
      <span className="shelf" />
    </>
  );
}

/** Cartão dos trilhos (ofertas, vistos há pouco). O runtime monta o mesmo HTML para os vistos. */
export function Card({ p }: { p: Product }) {
  return (
    <button className="pcard" type="button" data-open={p.id} aria-label={`${p.name}, ${p.sub}, ${brl(p.price)}`}>
      <Shot p={p} />
      <span className="cap">
        <span className="nm">{p.name}</span>
        <Price p={p} />
      </span>
    </button>
  );
}
