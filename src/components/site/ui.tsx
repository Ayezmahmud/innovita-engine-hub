import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

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
    <Link to="/" className="flex items-center gap-2.5" aria-label="INNOVITA Engineering Solutions">
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
    </Link>
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

export type NavItem = { label: string; to: string };

export const NAV: NavItem[] = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Industries", to: "/industries" },
  { label: "Projects", to: "/projects" },
  { label: "Why Us", to: "/why-us" },
  { label: "Contact", to: "/contact" },
];

export function PageHero({
  eyebrow,
  title,
  lead,
  meta,
}: {
  eyebrow: string;
  title: ReactNode;
  lead: string;
  meta?: { k: string; v: string }[];
}) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-surface pt-32 pb-14 lg:pt-40 lg:pb-20">
      <div className="bg-grid-fine pointer-events-none absolute inset-0 opacity-70 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="container-x relative">
        <div data-reveal>
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>
        <h1 data-reveal className="mt-4 max-w-3xl text-[2.2rem] font-extrabold leading-[1.06] tracking-tight text-navy lg:text-[3.2rem]">
          {title}
        </h1>
        <p data-reveal data-delay="0.1" className="mt-6 max-w-xl text-[0.95rem] leading-relaxed text-graphite">
          {lead}
        </p>
        {meta && (
          <dl data-reveal data-delay="0.16" className="mt-10 grid max-w-3xl grid-cols-2 gap-px overflow-hidden border border-border bg-border sm:grid-cols-4">
            {meta.map((m) => (
              <div key={m.k} className="bg-background px-4 py-4">
                <dt className="tech-label">{m.k}</dt>
                <dd className="mt-1.5 font-mono text-[0.95rem] font-medium text-navy">{m.v}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}

export function SectionHead({
  eyebrow,
  title,
  lead,
  className = "",
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: string;
  className?: string;
}) {
  return (
    <div className={`max-w-2xl ${className}`}>
      <div data-reveal>
        <Eyebrow>{eyebrow}</Eyebrow>
      </div>
      <h2 data-reveal className="mt-4 text-[1.9rem] font-extrabold leading-[1.1] text-navy lg:text-[2.3rem]">
        {title}
      </h2>
      {lead && (
        <p data-reveal className="mt-5 text-[0.9rem] leading-relaxed text-graphite">
          {lead}
        </p>
      )}
    </div>
  );
}
