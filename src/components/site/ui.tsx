import type { ReactNode } from "react";

export function Eyebrow({ children }: { children: ReactNode }) {
  return <span className="eyebrow">{children}</span>;
}

export function ArrowIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <a href="#top" className="flex items-center gap-2.5" aria-label="INNOVITA Engineering Solutions">
      <svg viewBox="0 0 40 40" className="h-9 w-9" aria-hidden>
        <path d="M20 2 36 11v18L20 38 4 29V11z" fill="var(--primary)" />
        <path d="M20 9 30 14.6v10.8L20 31 10 25.4V14.6z" fill="none" stroke="white" strokeWidth="2" />
        <circle cx="20" cy="20" r="3.2" fill="white" />
      </svg>
      {!compact && (
        <span className="leading-none">
          <span className="block text-[1.05rem] font-extrabold tracking-[0.06em] text-navy">INNOVITA</span>
          <span className="mt-0.5 block font-mono text-[0.5rem] tracking-[0.22em] text-muted-foreground">
            ENGINEERING SOLUTIONS
          </span>
        </span>
      )}
    </a>
  );
}

export function Annotation({
  k,
  v,
  className,
  side = "left",
  delay,
  reveal = "scroll",
}: {
  k: string;
  v: string;
  className: string;
  side?: "left" | "right";
  delay?: number | undefined;
  reveal?: "scroll" | "load";
}) {
  return (
    <div className={`anno ${className}`} {...(reveal === "scroll" ? { "data-anno": true } : { "data-reveal": true })} style={{ flexDirection: side === "right" ? "row-reverse" : "row" }} data-delay={delay}>
      <span className="anno-dot" />
      <span className="anno-line" />
      <span className={side === "right" ? "flex flex-col items-end text-right" : "flex flex-col items-start"}>
        <span className="anno-k block">{k}</span>
        <span className="anno-v block">{v}</span>
      </span>
    </div>
  );
}

export const NAV = ["Home", "About", "Services", "Industries", "Projects", "Why Us", "Contact"] as const;
export const navHref = (n: string) => `#${n.toLowerCase().replace(/\s+/g, "-")}`;
