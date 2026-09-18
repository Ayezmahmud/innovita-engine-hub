import { ArrowIcon, Eyebrow } from "./ui";
import feas from "@/assets/svc-feasibility.jpg";
import concept from "@/assets/svc-concept.jpg";
import calc from "@/assets/svc-calculations.jpg";
import sim from "@/assets/svc-simulation.jpg";
import proto from "@/assets/svc-prototyping.jpg";
import insp from "@/assets/svc-inspection.jpg";

const services = [
  { n: "01", t: "Feasibility Studies", d: "Evaluate technical, economic and operational viability to de-risk your project.", img: feas, meta: "Site assessment · Costing · Risk" },
  { n: "02", t: "Concept Development", d: "Turn ideas into practical, scalable solutions with detailed engineering and early-stage analysis.", img: concept, meta: "3D CAD · Layouts · Options study" },
  { n: "03", t: "Engineering Calculations", d: "Accurate, reliable calculations to guide design, compliance and performance.", img: calc, meta: "AS/NZS standards · Load cases" },
  { n: "04", t: "Advanced Engineering Simulation", d: "FEA, DEM and advanced analysis to predict performance, reduce risk and optimise design.", img: sim, meta: "FEA · DEM · CFD · Thermal" },
  { n: "05", t: "Prototyping & Product Development", d: "Validate designs with prototypes and testing for real-world performance.", img: proto, meta: "Machining · Fabrication · Testing" },
  { n: "06", t: "Inspection & Certified Design", d: "Ensure quality, compliance and certification for safe and reliable operation.", img: insp, meta: "RPEQ · Certification · QA" },
];

export function Services() {
  return (
    <section id="services" className="border-t border-border bg-surface py-20 lg:py-28">
      <div className="container-x">
        <div className="flex items-end justify-between gap-6">
          <div>
            <div data-reveal>
              <Eyebrow>Our Services</Eyebrow>
            </div>
            <h2 data-reveal className="mt-4 text-[2rem] font-extrabold leading-tight text-navy lg:text-[2.5rem]">
              Comprehensive engineering services
            </h2>
          </div>
          <a href="#projects" className="link-arrow mb-2 whitespace-nowrap">
            View All Services <ArrowIcon />
          </a>
        </div>

        <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <article key={s.n} data-reveal data-delay={String((i % 3) * 0.08)} className="card-tech group bg-surface pb-5">
              <div className="overflow-hidden border border-border bg-background">
                <img src={s.img} alt={s.t} width={1024} height={640} loading="lazy" className="aspect-[16/10] w-full object-cover" />
              </div>
              <div className="pt-5">
                <span className="font-mono text-[0.72rem] font-medium text-primary">{s.n}</span>
                <h3 className="mt-2 text-[0.98rem] font-bold text-navy">{s.t}</h3>
                <p className="mt-2 max-w-xs text-[0.8rem] leading-relaxed text-muted-foreground">{s.d}</p>
                <p className="card-meta tech-label mt-3">{s.meta}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
