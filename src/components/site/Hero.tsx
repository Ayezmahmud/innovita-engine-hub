import { lazy, Suspense, useRef } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { useAnnotationReveal, useScrollProgress } from "@/lib/motion";
import heroRobot from "@/assets/hero-robot.jpg";
import { Annotation, ArrowIcon, Eyebrow } from "./ui";

const HeroSceneFrame = lazy(() => import("@/components/three/scenes").then((m) => ({ default: m.HeroSceneFrame })));

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref, "top top", "bottom top");
  useAnnotationReveal(ref, "[data-anno]", "top top", "40% top");

  return (
    <section id="home" ref={ref} className="relative min-h-[100svh] overflow-hidden bg-surface">
      <img
        src={heroRobot}
        alt="Orange industrial robotic welding arm in an engineering workshop"
        width={1920}
        height={1088}
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover object-[68%_center]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent md:via-background/55 md:to-40%" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />

      {/* interactive assembly */}
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[56%] md:block lg:w-[52%]">
        <div className="absolute inset-x-[10%] top-[22%] bottom-[12%]">
          <ClientOnly fallback={null}>
            <Suspense fallback={null}>
              <HeroSceneFrame progress={progress} />
            </Suspense>
          </ClientOnly>
          <Annotation k="Stress" v="245 MPa" className="anno-on-photo left-[6%] top-[12%]" reveal="load" />
          <Annotation k="Material" v="S355 Steel" className="anno-on-photo right-[4%] top-[20%]" side="right" reveal="load" />
          <Annotation k="Load" v="1,250 kN" className="anno-on-photo left-[2%] bottom-[22%]" reveal="load" />
          <Annotation k="Safety Factor" v="2.8" className="anno-on-photo right-[8%] bottom-[14%]" side="right" reveal="load" />
        </div>
        <div className="absolute right-[10%] top-[24%] hidden text-right lg:block">
          <span className="block text-[0.72rem] font-semibold text-navy">Custom Fabrication</span>
          <span className="block text-[0.72rem] font-semibold text-navy">&amp; Assembly</span>
        </div>
      </div>

      <div className="container-x relative flex min-h-[100svh] flex-col justify-center pt-24 pb-24">
        <div className="max-w-2xl">
          <div data-reveal>
            <Eyebrow>25+ Years of Engineering Excellence</Eyebrow>
          </div>
          <h1
            data-reveal
            data-delay="0.08"
            className="mt-5 text-[2.4rem] font-extrabold leading-[1.06] text-navy sm:text-[3rem] lg:text-[3.3rem]"
          >
            Engineering solutions
            <br />
            for mining, energy
            <br />
            and industry
          </h1>
          <p data-reveal data-delay="0.16" className="mt-6 max-w-md text-[0.92rem] leading-relaxed text-graphite">
            INNOVITA provides multidisciplinary engineering solutions for mining, energy and industry, backed by 25+
            years of experience and a commitment to innovation and quality.
          </p>
          <div data-reveal data-delay="0.24" className="mt-8 flex flex-wrap gap-3">
            <a href="#services" className="btn-pill btn-primary">
              Explore Our Services <ArrowIcon />
            </a>
            <a href="#process" className="btn-pill btn-outline">
              <span className="grid h-5 w-5 place-items-center rounded-full border border-current">
                <svg viewBox="0 0 10 10" className="ml-px h-2 w-2 fill-current"><path d="M2 1.5v7l6-3.5z" /></svg>
              </span>
              Watch Our Process
            </a>
          </div>
        </div>

        <div className="absolute bottom-8 left-6 flex items-center gap-3 lg:left-12">
          <span className="flex h-8 w-5 items-start justify-center rounded-full border border-line p-1">
            <span className="animate-scroll-dot block h-1.5 w-1 rounded-full bg-primary" />
          </span>
          <span className="tech-label">Scroll to explore</span>
        </div>
        <div className="absolute bottom-8 right-6 hidden items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-muted-foreground md:flex lg:right-12">
          <span>Home</span>
          <span className="text-primary">/</span>
          <span>Engineering</span>
          <span className="text-primary">/</span>
          <span>Global Standards</span>
        </div>
      </div>
    </section>
  );
}
