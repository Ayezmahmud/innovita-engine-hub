import { useRef } from "react";
import heroRobot from "@/assets/hero-robot.jpg";
import { ArrowIcon } from "./ui";


export function Hero() {
  const ref = useRef<HTMLElement>(null);

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
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-transparent md:via-background/60 md:to-45%" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />

      <div className="container-x relative flex min-h-[100svh] flex-col justify-center pt-28 pb-16">
        <div className="max-w-3xl">
          <h1
            data-reveal
            className="text-[2.8rem] font-extrabold leading-[1.04] tracking-tight text-navy sm:text-[3.6rem] lg:text-[4.4rem]"
          >
            Engineering solutions
            <br />
            for <span className="text-primary">mining, energy</span>
            <br />
            and industry
          </h1>
          <p data-reveal data-delay="0.1" className="mt-7 max-w-md text-base leading-relaxed text-graphite">
            INNOVITA provides multidisciplinary engineering solutions for mining, energy and industry — backed by a
            commitment to innovation and quality.
          </p>
          <div data-reveal data-delay="0.2" className="mt-10 flex flex-wrap gap-3">
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

      </div>
    </section>
  );
}
