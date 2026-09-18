import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Hero } from "@/components/site/Hero";
import { Capabilities } from "@/components/site/Capabilities";
import { Services } from "@/components/site/Services";
import { Industries } from "@/components/site/Industries";
import { TechnicalAnalysis } from "@/components/site/TechnicalAnalysis";
import { Process } from "@/components/site/Process";
import { Projects } from "@/components/site/Projects";
import { Stats } from "@/components/site/Stats";
import { CTA } from "@/components/site/CTA";

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
  return (
    <SiteLayout>
      <Hero />
      <Capabilities />
      <Services />
      <Industries />
      <TechnicalAnalysis />
      <Process />
      <Projects />
      <Stats />
      <CTA />
    </SiteLayout>
  );
}
