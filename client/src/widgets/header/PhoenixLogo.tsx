interface Props {
  className?: string;
  /** Render light (white) variant for dark backgrounds. */
  light?: boolean;
}

/**
 * Phoenix Prime wordmark — abstract spread-wing phoenix mark + two-line
 * "PHOENIX PRIME / ENGINEERING" lockup.
 */
export function PhoenixLogo({ className = "", light = false }: Props) {
  const ink = light ? "#ffffff" : "var(--color-brand-strong)";
  const sub = light ? "rgba(255,255,255,0.65)" : "var(--color-brand)";
  return (
    <span className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <svg
        viewBox="0 0 48 48"
        className="h-9 w-9 flex-shrink-0"
        fill="none"
        aria-hidden
      >
        <path
          d="M24 6 L30 16 L24 13 L18 16 Z"
          fill={ink}
        />
        <path
          d="M24 15 C30 19 38 18 44 12 C40 22 32 27 24 24 C16 27 8 22 4 12 C10 18 18 19 24 15 Z"
          fill={ink}
        />
        <path
          d="M24 24 C28 28 30 34 24 42 C18 34 20 28 24 24 Z"
          fill={sub}
        />
      </svg>
      <span className="flex flex-col leading-none">
        <span
          className="text-[18px] font-extrabold tracking-tight"
          style={{ color: ink }}
        >
          PHOENIX PRIME
        </span>
        <span
          className="text-[9px] font-semibold tracking-[0.32em] mt-0.5"
          style={{ color: sub }}
        >
          ENGINEERING
        </span>
      </span>
    </span>
  );
}
