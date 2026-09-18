import { useEffect, useRef } from "react";
import { gsap, registerGsap } from "@/lib/motion";

const stats = [
  { v: 25, l: "Years Experience", icon: "gear" },
  { v: 100, l: "Projects Delivered", icon: "frame" },
  { v: 50, l: "Happy Clients", icon: "shield" },
];

function Icon({ k }: { k: string }) {
  const c = "h-9 w-9 text-primary";
  if (k === "gear")
    return (
      <svg viewBox="0 0 40 40" className={c} fill="none" stroke="currentColor" strokeWidth="1.4">
        <circle cx="20" cy="20" r="6" />
        <circle cx="20" cy="20" r="12" strokeDasharray="3 3" />
        <path d="M20 2v6M20 32v6M2 20h6M32 20h6M7.3 7.3l4.2 4.2M28.5 28.5l4.2 4.2M7.3 32.7l4.2-4.2M28.5 11.5l4.2-4.2" />
      </svg>
    );
  if (k === "frame")
    return (
      <svg viewBox="0 0 40 40" className={c} fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M6 30V12l14-8 14 8v18" />
        <path d="M6 30h28M12 30V16M28 30V16M12 16h16M20 4v12" />
      </svg>
    );
  return (
    <svg viewBox="0 0 40 40" className={c} fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M20 3l14 5v10c0 9-6 15-14 19C12 33 6 27 6 18V8z" />
      <path d="M13 20l5 5 10-11" />
    </svg>
  );
}

export function Stats() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    registerGsap();
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const end = Number(el.dataset.count);
        const o = { v: 0 };
        gsap.to(o, {
          v: end,
          duration: 1.8,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
          onUpdate: () => {
            el.textContent = `${Math.round(o.v)}+`;
          },
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative overflow-hidden border-t border-border bg-surface">
      {/* engineering line drawing */}
      <svg
        viewBox="0 0 600 220"
        className="pointer-events-none absolute right-0 top-1/2 h-[140%] -translate-y-1/2 text-navy/[0.09]"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
        aria-hidden
      >
        <circle cx="470" cy="110" r="90" />
        <circle cx="470" cy="110" r="62" strokeDasharray="4 4" />
        <circle cx="470" cy="110" r="30" />
        <path d="M470 0v220M360 110h220" strokeDasharray="6 4" />
        <circle cx="300" cy="140" r="46" />
        <circle cx="300" cy="140" r="14" />
        <path d="M300 80v120M240 140h120" strokeDasharray="6 4" />
        <path d="M420 30h140M420 30v8M560 30v8" />
      </svg>

      <div className="container-x relative grid divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {stats.map((s) => (
          <div key={s.l} className="flex items-center gap-5 py-10 sm:pl-8 sm:first:pl-0">
            <Icon k={s.icon} />
            <div>
              <div data-count={s.v} className="text-[1.75rem] font-extrabold leading-none text-navy">
                0+
              </div>
              <div className="mt-1.5 text-[0.76rem] text-muted-foreground">{s.l}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
