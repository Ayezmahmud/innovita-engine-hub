import { lazy, Suspense, useEffect, useRef } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { gsap, registerGsap, useScrollProgress } from "@/lib/motion";
import desk from "@/assets/process-desk.jpg";
import { ArrowIcon, Eyebrow } from "./ui";

const ProcessWireScene = lazy(() => import("@/components/three/scenes").then((m) => ({ default: m.ProcessWireScene })));
const ProcessSolidScene = lazy(() => import("@/components/three/scenes").then((m) => ({ default: m.ProcessSolidScene })));

const steps = [
  { n: "01", t: "Evaluate", d: "Understand your needs and assess feasibility." },
  { n: "02", t: "Develop", d: "Design, analyse and refine the solution." },
  { n: "03", t: "Execute", d: "Prototype, test and deliver with confidence." },
];

function Sketch() {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    registerGsap();
    const paths = ref.current?.querySelectorAll("path, circle, line") ?? [];
    const ctx = gsap.context(() => {
      paths.forEach((p) => {
        const el = p as SVGGeometryElement;
        const len = el.getTotalLength?.() ?? 200;
        gsap.fromTo(
          el,
          { strokeDasharray: len, strokeDashoffset: len },
          { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut", scrollTrigger: { trigger: ref.current, start: "top 85%", end: "top 35%", scrub: 0.8 } },
        );
      });
    });
    return () => ctx.revert();
  }, []);
  return (
    <svg ref={ref} viewBox="0 0 200 160" className="h-full w-full text-navy" fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M40 60h90v55H40z" />
      <path d="M40 60l18-14h90v55l-18 14" />
      <path d="M130 60l18-14" />
      <circle cx="85" cy="88" r="20" />
      <circle cx="85" cy="88" r="9" />
      <circle cx="85" cy="88" r="2.5" />
      <path d="M148 46v55" />
      <path d="M40 125v12M130 125v12M40 134h90" strokeWidth="0.6" />
      <path d="M30 60h-8M30 115h-8M26 60v55" strokeWidth="0.6" />
      <circle cx="58" cy="105" r="2.2" />
      <circle cx="112" cy="105" r="2.2" />
      <circle cx="58" cy="70" r="2.2" />
      <circle cx="112" cy="70" r="2.2" />
      <path d="M8 20l6 4M8 24l6-4" stroke="var(--primary)" />
      <path d="M2 150h196" strokeWidth="0.4" strokeDasharray="4 3" />
    </svg>
  );
}

export function Process() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref, "top 80%", "bottom 40%");

  return (
    <section id="process" ref={ref} className="relative overflow-hidden border-t border-border bg-surface">
      <div className="container-x grid gap-10 py-20 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:py-24">
        <div>
          <div data-reveal>
            <Eyebrow>Our Process</Eyebrow>
          </div>
          <h2 data-reveal className="mt-4 text-[2rem] font-extrabold leading-tight text-navy lg:text-[2.5rem]">
            How we work
          </h2>
          <p data-reveal className="mt-4 max-w-sm text-[0.88rem] leading-relaxed text-graphite">
            A simple, structured approach to turn your ideas into real-world solutions.
          </p>

          <div className="mt-12 grid grid-cols-3 gap-4 sm:gap-8">
            {steps.map((s, i) => (
              <div key={s.n} data-reveal data-delay={String(i * 0.12)} className="relative">
                <div className="aspect-square w-full">
                  {i === 0 && <Sketch />}
                  {i === 1 && (
                    <ClientOnly fallback={null}>
                      <Suspense fallback={null}>
                        <ProcessWireScene />
                      </Suspense>
                    </ClientOnly>
                  )}
                  {i === 2 && (
                    <ClientOnly fallback={null}>
                      <Suspense fallback={null}>
                        <ProcessSolidScene progress={progress} />
                      </Suspense>
                    </ClientOnly>
                  )}
                </div>
                {i < 2 && (
                  <span className="absolute -right-3 top-[42%] hidden text-primary sm:-right-5 sm:block">
                    <ArrowIcon className="h-4 w-4" />
                  </span>
                )}
                <div className="mt-4 flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 flex-none rounded-full bg-primary ring-4 ring-primary/15" />
                  <div>
                    <h3 className="text-[0.95rem] font-bold text-navy">{s.t}</h3>
                    <p className="mt-1 text-[0.74rem] leading-relaxed text-muted-foreground">{s.d}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-6 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-muted-foreground">
            <span>Sketch</span>
            <span className="text-primary">→</span>
            <span>CAD</span>
            <span className="text-primary">→</span>
            <span>FEA</span>
            <span className="text-primary">→</span>
            <span>Delivered</span>
          </div>
        </div>

        <div className="relative -mr-6 hidden lg:-mr-12 lg:block">
          <img src={desk} alt="Engineer reviewing a CAD gearbox model and technical drawings" width={1536} height={768} loading="lazy" className="h-full w-full object-cover object-right" />
          <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/40 to-transparent" />
        </div>
      </div>
    </section>
  );
}
