import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { initSmoothScroll, useReveal } from "@/lib/motion";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Capabilities } from "@/components/site/Capabilities";
import { Services } from "@/components/site/Services";
import { Industries } from "@/components/site/Industries";
import { TechnicalAnalysis } from "@/components/site/TechnicalAnalysis";
import { Process } from "@/components/site/Process";
import { Projects } from "@/components/site/Projects";
import { Stats } from "@/components/site/Stats";
import { CTA } from "@/components/site/CTA";
import { Footer } from "@/components/site/Footer";

const title = "INNOVITA Engineering Solutions | Mining, Energy & Industrial Engineering";
const description =
  "Australian multidisciplinary engineering consultancy: mechanical & structural design, FEA, DEM & CFD analysis, prototyping and certified design for mining, energy and industry.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const page = useRef<HTMLDivElement>(null);
  useReveal(page);
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let cancelled = false;
    initSmoothScroll().then((c) => {
      if (cancelled) c();
      else cleanup = c;
    });
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <div id="top" ref={page} className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Capabilities />
        <Services />
        <Industries />
        <TechnicalAnalysis />
        <Process />
        <Projects />
        <Stats />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
