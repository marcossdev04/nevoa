import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" aria-label="Névoa, página inicial" className={`group inline-flex flex-col items-center leading-none ${className}`}>
      <span className="font-script text-[2rem] text-cream transition-colors group-hover:text-sky">Névoa</span>
      <span className="eyebrow -mt-0.5 !text-[0.5rem] !tracking-[0.42em] text-sky">Tabacaria</span>
    </Link>
  );
}

/** Divisor ornamental: — ◆ — */
export function Ornament({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 text-sky ${className}`} aria-hidden>
      <span className="h-px w-10 bg-current opacity-60" />
      <svg width="18" height="10" viewBox="0 0 18 10">
        <path d="M9 0l4 5-4 5-4-5zM1.5 5L3 3.2 4.5 5 3 6.8zM13.5 5L15 3.2 16.500 5 15 6.800z" fill="currentColor" />
      </svg>
      <span className="h-px w-10 bg-current opacity-60" />
    </div>
  );
}

type IconProps = { className?: string };
const base = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const IconBag = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M5 8h14l-1 12H6zM9 8V6a3 3 0 0 1 6 0v2" />
  </svg>
);
export const IconSearch = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M16 16l4.5 4.500" />
  </svg>
);
export const IconUser = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M5 20c1-4 4-5.500 7-5.500s6 1.500 7 5.500" />
  </svg>
);
export const IconClose = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);
export const IconPlus = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);
export const IconMinus = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M5 12h14" />
  </svg>
);
export const IconTrash = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12M10 11v5M14 11v5" />
  </svg>
);
export const IconArrow = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M4 12h16M14 6l6 6-6 6" />
  </svg>
);
export const IconMenu = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M4 8h16M4 16h16" />
  </svg>
);
export const IconCheck = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M5 12.500l4.500 4.500L19 7.500" />
  </svg>
);
