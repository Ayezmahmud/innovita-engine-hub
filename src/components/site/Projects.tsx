import { ArrowIcon, Eyebrow } from "./ui";
import lifting from "@/assets/proj-lifting.jpg";
import chute from "@/assets/proj-chute.jpg";
import stone from "@/assets/proj-stone.jpg";
import agri from "@/assets/proj-agri.jpg";
import bulk from "@/assets/proj-bulk.jpg";

const projects = [
  { t: "Custom Lifting Frame", c: "Mining Equipment", img: lifting, meta: "Structural design · Lift certification" },
  { t: "Chute / Material Flow System", c: "Bulk Handling", img: chute, meta: "DEM analysis · Wear liners" },
  { t: "Stone Polishing Machinery", c: "Manufacturing", img: stone, meta: "Machine design · Drive systems" },
  { t: "Agricultural Machinery", c: "Industrial Equipment", img: agri, meta: "Product development · Prototyping" },
  { t: "Bulk Material Equipment", c: "Mining & Resources", img: bulk, meta: "Conveyor design · FEA" },
];

export function Projects() {
  return (
    <section id="projects" className="border-t border-border bg-background py-20 lg:py-24">
      <div className="container-x">
        <div className="flex items-end justify-between gap-6">
          <div>
            <div data-reveal>
              <Eyebrow>Featured Projects</Eyebrow>
            </div>
            <h2 data-reveal className="mt-4 text-[2rem] font-extrabold leading-tight text-navy lg:text-[2.5rem]">
              Real solutions. Lasting impact.
            </h2>
          </div>
          <a href="#contact" className="link-arrow mb-2 whitespace-nowrap">
            View All Projects <ArrowIcon />
          </a>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {projects.map((p, i) => (
            <article key={p.t} data-reveal data-delay={String(i * 0.06)} className="card-tech bg-background pb-4">
              <div className="overflow-hidden border border-border">
                <img src={p.img} alt={p.t} width={944} height={704} loading="lazy" className="aspect-[4/3] w-full object-cover" />
              </div>
              <h3 className="mt-4 text-[0.82rem] font-bold text-navy">{p.t}</h3>
              <p className="mt-1 text-[0.68rem] text-muted-foreground">{p.c}</p>
              <p className="card-meta tech-label mt-2 !text-[0.58rem] text-primary">{p.meta}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
