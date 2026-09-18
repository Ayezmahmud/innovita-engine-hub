import { lazy, Suspense, useRef } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { useAnnotationReveal, useScrollProgress } from "@/lib/motion";
import { Annotation, Eyebrow } from "./ui";

const FeaGearboxScene = lazy(() => import("@/components/three/scenes").then((m) => ({ default: m.FeaGearboxScene })));

const items = ["Mechanical & Structural Design", "FEA, CFD & Thermal Analysis", "Prototyping & Product Development"];
const scale = ["500", "400", "300", "200", "100", "0"];

export function Capabilities() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref, "top 80%", "bottom 30%");
  useAnnotationReveal(ref, "[data-anno]", "top 55%", "top 5%");

  return (
    <section id="about" ref={ref} className="relative border-t border-border bg-background py-20 lg:py-28">
      <div className="container-x grid items-center gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div>
          <div data-reveal>
            <Eyebrow>Our Capabilities</Eyebrow>
          </div>
          <h2 data-reveal className="mt-4 text-[2rem] font-extrabold leading-[1.1] text-navy lg:text-[2.5rem]">
            Delivering real
            <br />
            engineering outcomes
          </h2>
          <p data-reveal className="mt-6 max-w-md text-[0.9rem] leading-relaxed text-graphite">
            We turn complex challenges into practical, efficient and reliable solutions. Combining deep technical
            expertise with advanced tools and real-world experience, we deliver engineering outcomes that perform.
          </p>
          <ul data-reveal className="mt-8 space-y-4">
            {items.map((t) => (
              <li key={t} className="flex items-center gap-3 text-[0.86rem] font-medium text-navy">
                <ChevronRight className="h-3.5 w-3.5 text-primary" strokeWidth={2.5} />
                {t}
              </li>
            ))}
          </ul>
          <a data-reveal href="#services" className="btn-pill btn-outline-orange mt-9">
            Explore All Services
          </a>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/3] w-full bg-grid-fine [mask-image:radial-gradient(closest-side,black_55%,transparent_100%)]" />
          <div className="absolute inset-0 pr-16">
            <ClientOnly fallback={null}>
              <Suspense fallback={null}>
                <FeaGearboxScene progress={progress} />
              </Suspense>
            </ClientOnly>
          </div>
          <Annotation k="Stress" v="245 MPa" className="left-[4%] top-[6%]" />
          <Annotation k="Displacement" v="0.32 mm" className="right-[18%] top-[8%]" side="right" />
          <Annotation k="Safety Factor" v="2.8" className="left-[6%] bottom-[8%]" />
          <Annotation k="Material Flow" v="Optimized" className="right-[16%] bottom-[6%]" side="right" />

          {/* Von Mises scale */}
          <div className="absolute right-0 top-1/2 flex -translate-y-1/2 flex-col items-center gap-2">
            <span className="tech-label !text-[0.55rem] whitespace-nowrap">Von Mises (MPa)</span>
            <div className="flex gap-2">
              <div className="fea-scale h-44 w-2.5 rounded-sm" />
              <div className="flex h-44 flex-col justify-between font-mono text-[0.58rem] text-muted-foreground">
                {scale.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
