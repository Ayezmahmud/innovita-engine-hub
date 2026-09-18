import { useEffect, useRef, useState } from "react";
import { gsap, registerGsap } from "@/lib/motion";
import mining from "@/assets/industries-mining.jpg";
import { ArrowIcon, Eyebrow } from "./ui";

const tabs = [
  { k: "Mining", pos: "50% 50%" },
  { k: "Energy", pos: "62% 40%" },
  { k: "Industrial", pos: "40% 60%" },
];

export function Industries() {
  const ref = useRef<HTMLElement>(null);
  const bg = useRef<HTMLImageElement>(null);
  const fg = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    registerGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(bg.current, { yPercent: -10, scale: 1.12 }, { yPercent: 8, scale: 1.12, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true } });
      gsap.fromTo(fg.current, { y: 40 }, { y: -40, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true } });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="industries" ref={ref} className="relative min-h-[82vh] overflow-hidden">
      <img
        ref={bg}
        src={mining}
        alt="Bucket-wheel excavator operating in an Australian open-cut mine at sunset"
        width={1920}
        height={960}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-[object-position] duration-700"
        style={{ objectPosition: tabs[active]?.pos ?? "50% 50%" }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-transparent md:to-55%" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background/70 to-transparent" />

      <div className="container-x relative flex min-h-[82vh] items-center py-24">
        <div ref={fg} className="max-w-lg">
          <div data-reveal>
            <Eyebrow>Industries</Eyebrow>
          </div>
          <h2 data-reveal className="mt-4 text-[1.9rem] font-extrabold leading-[1.1] text-navy lg:text-[2.3rem]">
            Engineering for demanding
            <br />
            operating environments
          </h2>
          <p data-reveal className="mt-6 text-[0.9rem] leading-relaxed text-graphite">
            From mining and energy to heavy industry, we deliver robust, practical engineering solutions built to perform
            in the real world.
          </p>
          <a data-reveal href="#projects" className="btn-pill btn-outline-orange mt-9 bg-background/70">
            Explore Our Industries <ArrowIcon />
          </a>
        </div>

        <ul className="absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col md:flex lg:right-12" aria-label="Industry sectors">
          <span className="absolute left-[5px] top-3 bottom-3 w-px bg-navy-foreground/50" />
          {tabs.map((t, i) => (
            <li key={t.k}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className="group relative flex items-center gap-4 py-3 text-left"
              >
                <span
                  className={`relative z-10 h-[11px] w-[11px] rounded-full border-2 transition-colors ${
                    active === i ? "border-primary bg-primary" : "border-navy-foreground bg-navy/60"
                  }`}
                />
                <span
                  className={`text-[0.82rem] font-semibold drop-shadow-sm transition-colors ${
                    active === i ? "text-navy-foreground" : "text-navy-foreground/80 group-hover:text-navy-foreground"
                  }`}
                >
                  {t.k}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
