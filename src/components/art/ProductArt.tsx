import type { CSSProperties, ReactNode } from "react";
import type { ArtKind, Tone } from "@/lib/types";

/**
 * Ilustrações dos produtos no estilo de rótulo vintage da marca.
 * São placeholders: quando houver fotos reais, basta trocar o <ProductArt />
 * por <Image /> usando o campo `image` do produto.
 */

const INK = "#2B1D21";
const CREAM = "#F9DF8E";
const CREAM_L = "#FCEFC4";
const SKY = "#9CB7D3";
const SKY_L = "#C6D6E8";

type P = { a: string; al: string; b: string; bl: string };

const palette = (tone: Tone): P =>
  tone === "creme"
    ? { a: CREAM, al: CREAM_L, b: SKY, bl: SKY_L }
    : { a: SKY, al: SKY_L, b: CREAM, bl: CREAM_L };

const label = {
  fontFamily: "var(--font-bodoni), serif",
  fontWeight: 700,
  fill: INK,
  stroke: "none",
  textAnchor: "middle" as const,
};

/** Traço duplo: contorno escuro + cor por cima (mangueiras, hastes) */
function Tube({ d, color, w = 6 }: { d: string; color: string; w?: number }) {
  return (
    <>
      <path d={d} fill="none" stroke={INK} strokeWidth={w + 4.4} />
      <path d={d} fill="none" stroke={color} strokeWidth={w} />
    </>
  );
}

/** `hang`: fração da altura onde a peça começa no eixo central (para o fio encostar nela) */
type Art = { w: number; h: number; hang?: number; draw: (p: P) => ReactNode };

export const ART: Record<ArtKind, Art> = {
  paper: {
    w: 170,
    h: 100,
    draw: (p) => (
      <>
        <rect x="22" y="4" width="126" height="30" rx="3" fill={p.al} />
        <rect x="6" y="16" width="158" height="78" rx="8" fill={p.a} />
        <rect x="14" y="24" width="142" height="62" rx="4" fill="none" strokeWidth="1.2" />
        <rect x="14" y="43" width="142" height="26" fill={p.b} strokeWidth="1.2" />
        <text x="85" y="62" fontSize="17" letterSpacing="5" {...label}>NÉVOA</text>
        <text x="85" y="37" fontSize="7" letterSpacing="3" {...label}>SEDA FINA</text>
        <text x="85" y="81" fontSize="7" letterSpacing="3" {...label}>50 FOLHAS</text>
      </>
    ),
  },
  tips: {
    w: 110,
    h: 150,
    draw: (p) => (
      <>
        <rect x="6" y="6" width="98" height="138" rx="6" fill={p.a} />
        <rect x="6" y="6" width="98" height="44" rx="6" fill={p.b} />
        <path d="M6 50H104" />
        <text x="55" y="27" fontSize="10" letterSpacing="2.5" {...label}>PITEIRAS</text>
        <text x="55" y="40" fontSize="6.5" letterSpacing="2" {...label}>DE PAPEL</text>
        {[66, 82, 98, 114, 130].map((y) => (
          <path key={y} d={`M16 ${y}H94`} strokeWidth="1.4" strokeDasharray="2 5" />
        ))}
      </>
    ),
  },
  glassTip: {
    w: 64,
    h: 180,
    draw: (p) => (
      <>
        <path d="M16 8h32q5 0 5 6l-6 150q-1 10-15 10t-15-10L11 14q0-6 5-6z" fill={p.bl} />
        <path d="M12 34h40M13 44h38" strokeWidth="1.6" />
        <path d="M23 58l3 96" stroke={CREAM_L} strokeWidth="4" opacity=".9" />
        <path d="M18 150q14 8 28 0" strokeWidth="1.4" />
        <ellipse cx="32" cy="12" rx="13" ry="3" fill={p.a} strokeWidth="1.4" />
      </>
    ),
  },
  grinder: {
    w: 160,
    h: 140,
    draw: (p) => (
      <>
        <rect x="14" y="86" width="132" height="44" rx="7" fill={p.a} />
        <rect x="9" y="50" width="142" height="40" rx="5" fill={p.b} />
        <rect x="14" y="12" width="132" height="42" rx="9" fill={p.a} />
        {Array.from({ length: 16 }, (_, i) => (
          <path key={i} d={`M${20 + i * 8} 57v26`} strokeWidth="1.3" />
        ))}
        <path d="M26 24h108M26 32h60" strokeWidth="1.3" opacity=".7" />
        <path d="M24 104h112" strokeWidth="1.3" strokeDasharray="1 6" />
        <path d="M24 116h112" strokeWidth="1.3" opacity=".6" />
      </>
    ),
  },
  flipLighter: {
    w: 172,
    h: 182,
    draw: (p) => (
      <>
        <path d="M52 6C63 22 67 31 52 44 37 31 41 22 52 6z" fill={p.b} />
        <path d="M52 22c5 8 6 12 0 18-6-6-5-10 0-18z" fill={CREAM_L} strokeWidth="1.2" />
        <rect x="20" y="38" width="76" height="40" rx="6" fill={p.a} transform="rotate(115 96 78)" />
        <rect x="30" y="46" width="44" height="34" rx="3" fill={p.al} />
        {[38, 48, 58, 66].map((x) =>
          [56, 68].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="2.3" fill={INK} stroke="none" />),
        )}
        <circle cx="85" cy="64" r="10" fill={p.b} />
        <path d="M85 54v20M75 64h20M78 57l14 14M92 57L78 71" strokeWidth="1" />
        <rect x="20" y="78" width="76" height="98" rx="6" fill={p.a} />
        <rect x="28" y="88" width="60" height="80" rx="3" fill="none" strokeWidth="1.2" />
        <text x="58" y="140" fontSize="34" {...label} fontFamily="var(--font-yesteryear), cursive" fontWeight={400}>N</text>
        <circle cx="96" cy="80" r="3.4" fill={p.b} strokeWidth="1.4" />
      </>
    ),
  },
  torch: {
    w: 100,
    h: 192,
    draw: (p) => (
      <>
        <path d="M47 36C39 22 43 10 47 2c4 8 8 20 0 34z" fill={SKY_L} />
        <rect x="40" y="34" width="14" height="18" fill={p.al} />
        <rect x="70" y="56" width="16" height="12" rx="2" fill={p.b} />
        <rect x="24" y="50" width="50" height="26" rx="4" fill={p.b} />
        <rect x="20" y="72" width="58" height="112" rx="10" fill={p.a} />
        <rect x="43" y="96" width="12" height="62" rx="6" fill={CREAM_L} strokeWidth="1.4" />
        <path d="M43 132h12" strokeWidth="1.2" />
        <path d="M28 168h42" strokeWidth="1.3" opacity=".7" />
        <path d="M30 58h38" strokeWidth="1.2" opacity=".7" />
      </>
    ),
  },
  matches: {
    w: 172,
    h: 110,
    draw: (p) => (
      <>
        <rect x="62" y="24" width="104" height="62" rx="3" fill={p.al} />
        {[35, 45, 55, 65, 75].map((y) => (
          <g key={y}>
            <path d={`M118 ${y}H150`} strokeWidth="2.4" />
            <circle cx="153" cy={y} r="4.2" fill={p.b} strokeWidth="1.3" />
          </g>
        ))}
        <rect x="6" y="14" width="112" height="82" rx="4" fill={p.a} />
        <rect x="6" y="84" width="112" height="12" rx="3" fill={INK} opacity=".28" stroke="none" />
        <rect x="14" y="22" width="96" height="56" rx="2" fill="none" strokeWidth="1.2" />
        <ellipse cx="62" cy="50" rx="36" ry="20" fill={p.b} strokeWidth="1.4" />
        <text x="62" y="54" fontSize="10" letterSpacing="2" {...label}>FÓSFOROS</text>
      </>
    ),
  },
  pipe: {
    w: 230,
    h: 140,
    hang: 0.5,
    draw: (p) => (
      <>
        <path d="M114 96L32 72Q10 66 8 60q4-7 24-2l82 18z" fill={p.b} />
        <path d="M108 70l42 6V32q0-12 10-12h46q10 0 10 12v56q0 38-34 38h-30q-32-2-44-30z" fill={p.a} />
        <path d="M106 69l11 2v27l-11-3z" fill={CREAM_L} strokeWidth="1.6" />
        <ellipse cx="183" cy="22" rx="30" ry="6.5" fill={INK} stroke="none" />
        <path d="M204 44v44q0 22-18 26" strokeWidth="1.3" opacity=".65" />
        <path d="M196 50v36q0 14-10 20" strokeWidth="1.3" opacity=".45" />
        <path d="M160 34v30" strokeWidth="1.3" opacity=".45" />
      </>
    ),
  },
  churchwarden: {
    w: 284,
    h: 170,
    hang: 0.56,
    draw: (p) => (
      <>
        <Tube d="M196 124C140 122 84 86 12 24" color={p.b} w={7} />
        <path d="M198 96V62q0-9 9-9h40q9 0 9 9v48q0 34-30 34h-14q-20-4-24-22z" fill={p.a} />
        <ellipse cx="227" cy="55" rx="26" ry="5.5" fill={INK} stroke="none" />
        <path d="M190 112l10 2v20l-10-4z" fill={CREAM_L} strokeWidth="1.6" />
        <path d="M246 72v38q0 18-14 22" strokeWidth="1.3" opacity=".6" />
      </>
    ),
  },
  tin: {
    w: 150,
    h: 122,
    draw: (p) => (
      <>
        <rect x="8" y="30" width="134" height="84" rx="8" fill={p.a} />
        <rect x="4" y="10" width="142" height="28" rx="8" fill={p.b} />
        <path d="M14 22h122" strokeWidth="1.2" opacity=".6" />
        <ellipse cx="75" cy="76" rx="48" ry="27" fill={CREAM_L} strokeWidth="1.5" />
        <ellipse cx="75" cy="76" rx="42" ry="22" fill="none" strokeWidth="1" />
        <text x="75" y="76" fontSize="12" letterSpacing="2.5" {...label}>TABACO</text>
        <text x="75" y="88" fontSize="6.5" letterSpacing="2" {...label}>BLEND DA CASA</text>
      </>
    ),
  },
  hookah: {
    w: 164,
    h: 340,
    draw: (p) => (
      <>
        <Tube d="M84 180c58-8 70 52 50 98-12 30 6 50 16 22" color={p.a} w={5} />
        <rect x="64" y="6" width="22" height="9" rx="2" fill={p.b} strokeWidth="1.6" />
        <path d="M54 14h42l-7 24H61z" fill={p.a} />
        <rect x="68" y="38" width="14" height="150" fill={p.a} />
        <ellipse cx="75" cy="60" rx="44" ry="8" fill={p.b} />
        <ellipse cx="75" cy="96" rx="14" ry="7" fill={p.b} />
        <ellipse cx="75" cy="134" rx="19" ry="9" fill={p.a} />
        <ellipse cx="75" cy="172" rx="13" ry="7" fill={p.b} />
        <path d="M62 188h26v22c32 16 44 52 38 86q-4 30-51 30t-51-30c-6-34 6-70 38-86z" fill={p.b} />
        <path d="M27 268q48 14 96 0" strokeWidth="1.4" />
        <path d="M62 210h26" strokeWidth="1.6" />
        <path d="M40 240c-8 14-10 30-8 44" stroke={CREAM_L} strokeWidth="3.5" opacity=".85" />
        <path d="M32 300q43 12 86 0" strokeWidth="1.2" opacity=".6" />
      </>
    ),
  },
  essence: {
    w: 120,
    h: 152,
    draw: (p) => (
      <>
        <path d="M8 20L20 6h80l12 14z" fill={p.bl} />
        <rect x="8" y="20" width="104" height="124" rx="5" fill={p.b} />
        <circle cx="60" cy="80" r="38" fill={CREAM_L} strokeWidth="1.5" />
        <circle cx="60" cy="80" r="32" fill="none" strokeWidth="1" />
        <path d="M60 56c14 8 16 22 0 32-16-10-14-24 0-32z" fill={p.a} strokeWidth="1.5" />
        <path d="M60 60v26M60 70l7-5M60 76l-7-5" strokeWidth="1.1" />
        <text x="60" y="101" fontSize="8" letterSpacing="2" {...label}>ESSÊNCIA</text>
        <text x="60" y="134" fontSize="7" letterSpacing="3" {...label}>50 G</text>
      </>
    ),
  },
  coal: {
    w: 160,
    h: 132,
    draw: (p) => (
      <>
        <rect x="6" y="12" width="148" height="112" rx="5" fill={p.a} />
        <rect x="6" y="40" width="148" height="42" fill={INK} stroke="none" />
        <text x="80" y="68" fontSize="19" letterSpacing="5" {...label} fill={p.a}>CARVÃO</text>
        <text x="80" y="31" fontSize="8" letterSpacing="3" {...label}>DE COCO · 1 KG</text>
        {[42, 70, 98].map((x) => (
          <rect key={x} x={x} y="92" width="20" height="20" rx="2" fill={p.b} strokeWidth="1.5" />
        ))}
      </>
    ),
  },
  cigar: {
    w: 262,
    h: 64,
    draw: (p) => (
      <>
        <rect x="6" y="14" width="244" height="36" rx="18" fill={p.a} />
        <path d="M226 14h6q18 0 18 18t-18 18h-6z" fill={CREAM_L} strokeWidth="1.6" />
        <path d="M234 24h6M232 34h10M236 42h4" strokeWidth="1.2" strokeDasharray="1 3" />
        {[112, 136, 160, 184, 208].map((x) => (
          <path key={x} d={`M${x} 15q-12 17 0 34`} strokeWidth="1.1" opacity=".5" />
        ))}
        <rect x="54" y="11" width="40" height="42" fill={p.b} />
        <ellipse cx="74" cy="32" rx="12" ry="14" fill={CREAM_L} strokeWidth="1.3" />
        <text x="74" y="38" fontSize="16" {...label} fontFamily="var(--font-yesteryear), cursive" fontWeight={400}>N</text>
      </>
    ),
  },
  cutter: {
    w: 190,
    h: 100,
    draw: (p) => (
      <>
        <circle cx="34" cy="50" r="21" fill="none" stroke={INK} strokeWidth="16.5" />
        <circle cx="34" cy="50" r="21" fill="none" stroke={p.a} strokeWidth="12" />
        <circle cx="156" cy="50" r="21" fill="none" stroke={INK} strokeWidth="16.5" />
        <circle cx="156" cy="50" r="21" fill="none" stroke={p.a} strokeWidth="12" />
        <rect x="58" y="12" width="74" height="76" rx="12" fill={p.b} />
        <circle cx="95" cy="50" r="22" fill={INK} stroke="none" />
        <path d="M73 50a22 22 0 0 1 44 0z" fill={CREAM_L} strokeWidth="1.4" />
        <path d="M66 22h58M66 78h58" strokeWidth="1.2" opacity=".6" />
      </>
    ),
  },
  humidor: {
    w: 200,
    h: 152,
    draw: (p) => (
      <>
        <path d="M10 64L26 14h148l16 50z" fill={p.b} />
        <path d="M34 24h132M30 36h140" strokeWidth="1.1" opacity=".55" />
        {Array.from({ length: 11 }, (_, i) => (
          <circle key={i} cx={30 + i * 14} cy="60" r="6.5" fill={CREAM_L} strokeWidth="1.4" />
        ))}
        <rect x="10" y="64" width="180" height="80" rx="6" fill={p.a} />
        <path d="M18 78h164M18 130h164" strokeWidth="1.1" opacity=".55" />
        <circle cx="100" cy="104" r="17" fill={CREAM_L} strokeWidth="1.6" />
        <circle cx="100" cy="104" r="12" fill="none" strokeWidth="1" />
        <path d="M100 104l7-8" strokeWidth="1.6" />
        <rect x="26" y="96" width="22" height="16" rx="2" fill={p.b} strokeWidth="1.4" />
        <rect x="152" y="96" width="22" height="16" rx="2" fill={p.b} strokeWidth="1.4" />
      </>
    ),
  },
  ashtray: {
    w: 190,
    h: 92,
    draw: (p) => (
      <>
        <path d="M12 30h166l-16 48q-2 8-10 8H38q-8 0-10-8z" fill={p.b} />
        <rect x="4" y="18" width="182" height="16" rx="8" fill={p.a} />
        <rect x="48" y="16" width="16" height="9" rx="2" fill={INK} stroke="none" />
        <rect x="126" y="16" width="16" height="9" rx="2" fill={INK} stroke="none" />
        <path d="M34 52h122" strokeWidth="1.2" opacity=".6" />
        <path d="M40 66h110" strokeWidth="1.2" strokeDasharray="1 6" />
      </>
    ),
  },
  tray: {
    w: 220,
    h: 140,
    draw: (p) => (
      <>
        <rect x="6" y="6" width="208" height="128" rx="20" fill={p.a} />
        <rect x="20" y="20" width="180" height="100" rx="10" fill={p.b} />
        <rect x="28" y="28" width="164" height="84" rx="6" fill="none" strokeWidth="1.1" />
        <text x="110" y="82" fontSize="38" {...label} fontFamily="var(--font-yesteryear), cursive" fontWeight={400}>Névoa</text>
        <path d="M86 96h48" strokeWidth="1.2" />
      </>
    ),
  },
  tube: {
    w: 56,
    h: 182,
    draw: (p) => (
      <>
        <path d="M11 40h34v118q0 16-17 16t-17-16z" fill={p.b} />
        <rect x="6" y="8" width="44" height="38" rx="6" fill={p.a} />
        <path d="M12 18h32M12 26h32M12 34h32" strokeWidth="1.2" opacity=".7" />
        <rect x="11" y="78" width="34" height="46" fill={CREAM_L} strokeWidth="1.4" />
        <text x="28" y="108" fontSize="20" {...label} fontFamily="var(--font-yesteryear), cursive" fontWeight={400}>N</text>
      </>
    ),
  },
  bong: {
    w: 150,
    h: 282,
    draw: (p) => (
      <>
        <path d="M52 16h36v136l36 98q4 22-16 22H32q-20 0-16-22l36-98z" fill={SKY_L} />
        <path d="M27 220h86l11 30q4 22-16 22H32q-20 0-16-22z" fill={p.a === CREAM ? SKY : CREAM} strokeWidth="1.5" />
        <rect x="44" y="6" width="52" height="13" rx="6.5" fill={p.a} />
        <path d="M54 96l8 6M88 96l-8 6" strokeWidth="1.6" />
        <Tube d="M112 176L66 250" color={p.a} w={5} />
        <path d="M104 160h26l-6 20h-14z" fill={p.a} />
        <path d="M60 30v96" stroke={CREAM_L} strokeWidth="4" opacity=".9" />
        <path d="M40 232l-6 22" stroke={CREAM_L} strokeWidth="3.5" opacity=".8" />
      </>
    ),
  },
};

type Props = {
  kind: ArtKind;
  tone?: Tone;
  className?: string;
  title?: string;
  style?: CSSProperties;
};

export function ProductArt({ kind, tone = "creme", className, title, style }: Props) {
  const art = ART[kind];
  return (
    <svg
      viewBox={`0 0 ${art.w} ${art.h}`}
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      style={{ overflow: "visible", ...style }}
    >
      <g fill="none" stroke={INK} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round">
        {art.draw(palette(tone))}
      </g>
    </svg>
  );
}
