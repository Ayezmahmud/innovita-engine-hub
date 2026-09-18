import globe from "@/assets/globe.png";
import { ArrowIcon, Eyebrow } from "./ui";

export function CTA() {
  return (
    <section id="contact" className="relative overflow-hidden border-t border-border bg-background py-16 lg:py-20">
      <div className="container-x grid items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,4fr)_minmax(0,3fr)]">
        <div>
          <div data-reveal>
            <Eyebrow>Let's Build Together</Eyebrow>
          </div>
          <h2 data-reveal className="mt-4 text-[2rem] font-extrabold leading-tight text-navy lg:text-[2.5rem]">
            Have a project in mind?
          </h2>
          <p data-reveal className="mt-4 text-[0.9rem] text-graphite">Take your projects to new heights with Innovita.</p>
          <div data-reveal className="mt-8 flex items-center gap-6">
            <a href="mailto:info@innovita.com.au" className="btn-pill btn-primary">
              Get a Quote <ArrowIcon />
            </a>
            <a href="mailto:info@innovita.com.au" className="text-[0.82rem] font-semibold text-navy underline-offset-4 hover:text-primary hover:underline">
              Contact Us
            </a>
          </div>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-[22rem]">
          <div className="animate-spin-slow absolute inset-[-6%] rounded-full border border-primary/25 [border-style:dashed]" />
          <div className="animate-spin-slower absolute inset-[6%] rounded-full border border-navy/10" style={{ transform: "rotateX(60deg)" }} />
          <span className="absolute left-1/2 top-[-6%] h-2 w-2 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_0_4px_color-mix(in_oklab,var(--primary)_20%,transparent)]" />
          <img src={globe} alt="Globe centred on Australia" width={1024} height={1024} loading="lazy" className="relative h-full w-full object-contain drop-shadow-[0_30px_40px_oklch(0.24_0.045_262/0.25)]" />
        </div>

        <div data-reveal className="hidden items-start gap-3 lg:flex">
          <ArrowIcon className="mt-1 h-3.5 w-3.5 flex-none text-primary" />
          <p className="text-[0.82rem] font-semibold leading-relaxed text-navy">
            Australian
            <br />
            Engineering Solutions
            <br />
            for a Stronger Tomorrow
          </p>
        </div>
      </div>
    </section>
  );
}
