import { lazy, Suspense, useRef } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { Check, CheckCircle2 } from "lucide-react";
import { useAnnotationReveal, useScrollProgress } from "@/lib/motion";
import { Annotation, Eyebrow } from "./ui";

const FeaCouplingScene = lazy(() => import("@/components/three/scenes").then((m) => ({ default: m.FeaCouplingScene })));

const checks = ["Structural Analysis", "Material Properties", "Load & Stress Calculations", "Compliance & Safety Checks"];
const material = [
  ["Material", "S355 Steel"],
  ["Yield Strength", "305 MPa"],
  ["Tensile Strength", "510 MPa"],
  ["Elastic Modulus", "210 GPa"],
];
const load = [
  ["Max Load", "1,250 kN"],
  ["Deflection", "2.5 mm"],
  ["Safety Factor", "2.7"],
];

export function TechnicalAnalysis() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref, "top 80%", "bottom 30%");
  useAnnotationReveal(ref, "[data-anno]", "top 55%", "top 10%");

  return (
    <section id="why-us" ref={ref} className="relative overflow-hidden border-t border-border bg-background py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-grid opacity-60 [mask-image:linear-gradient(to_left,black,transparent)]" />
      <div className="container-x relative grid items-center gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,5fr)_minmax(0,3fr)]">
        <div>
          <div data-reveal>
            <Eyebrow>Technical Analysis</Eyebrow>
          </div>
          <h2 data-reveal className="mt-4 text-[1.9rem] font-extrabold leading-[1.12] text-navy lg:text-[2.35rem]">
            Detailed engineering calculations and analysis
          </h2>
          <p data-reveal className="mt-6 max-w-sm text-[0.88rem] leading-relaxed text-graphite">
            Our engineering reports provide clear, data-driven insights with validated calculations, material
            specifications and compliance checks.
          </p>
          <ul data-reveal className="mt-8 space-y-4">
            {checks.map((c) => (
              <li key={c} className="flex items-center gap-3 text-[0.84rem] font-medium text-navy">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-success/15 text-success">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                {c}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative aspect-[5/4]">
          <ClientOnly fallback={null}>
            <Suspense fallback={null}>
              <FeaCouplingScene progress={progress} />
            </Suspense>
          </ClientOnly>
          <Annotation k="Max Stress" v="312 MPa" className="left-[30%] top-[4%]" />
          <Annotation k="Safety Factor" v="2.7" className="right-[16%] bottom-[8%]" side="right" />
        </div>

        <aside data-reveal className="border border-border bg-background/90 p-6 shadow-panel">
          <h3 className="text-[0.8rem] font-bold text-navy">Material Properties</h3>
          <dl className="mt-3 divide-y divide-border">
            {material.map(([k, v]) => (
              <div key={k} className="flex items-center justify-between py-2 text-[0.74rem]">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="font-semibold text-navy">{v}</dd>
              </div>
            ))}
          </dl>
          <h3 className="mt-6 text-[0.8rem] font-bold text-navy">Load Analysis</h3>
          <dl className="mt-3 divide-y divide-border">
            {load.map(([k, v]) => (
              <div key={k} className="flex items-center justify-between py-2 text-[0.74rem]">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="font-semibold text-navy">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-5 flex items-center justify-end gap-2 text-[0.8rem] font-bold text-success">
            <CheckCircle2 className="h-4 w-4" /> Compliant
          </div>
        </aside>
      </div>
    </section>
  );
}
