import { useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export { gsap, ScrollTrigger };

let registered = false;
export function registerGsap() {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
}

/** Lenis smooth scroll wired to GSAP ScrollTrigger. Returns a cleanup. */
export async function initSmoothScroll() {
  registerGsap();
  const { default: Lenis } = await import("lenis");
  const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  const tick = (t: number) => lenis.raf(t * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return () => {
    gsap.ticker.remove(tick);
    lenis.destroy();
  };
}

/** Reveals every [data-reveal] descendant of `scope` on scroll. */
export function useReveal(scope: RefObject<HTMLElement | null>) {
  useEffect(() => {
    registerGsap();
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 26 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            delay: Number(el.dataset['delay'] ?? 0),
            scrollTrigger: { trigger: el, start: "top 88%" },
          },
        );
      });
    }, scope);
    return () => ctx.revert();
  }, [scope]);
}

/** Writes 0..1 scroll progress of `ref` into a mutable ref (no re-render). */
export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  start = "top 85%",
  end = "bottom 15%",
) {
  const progress = useRef(0);
  useEffect(() => {
    registerGsap();
    if (!ref.current) return;
    const st = ScrollTrigger.create({
      trigger: ref.current,
      start,
      end,
      onUpdate: (s) => {
        progress.current = s.progress;
      },
    });
    return () => st.kill();
  }, [ref, start, end]);
  return progress;
}

/** Staggered annotation reveal scrubbed to a section's scroll. */
export function useAnnotationReveal(
  section: RefObject<HTMLElement | null>,
  selector = "[data-anno]",
  start = "top 60%",
  end = "top 10%",
) {
  useEffect(() => {
    registerGsap();
    if (!section.current) return;
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(selector);
      if (!items.length) return;
      gsap.fromTo(
        items,
        { opacity: 0, x: -8 },
        {
          opacity: 1,
          x: 0,
          stagger: 0.25,
          ease: "none",
          scrollTrigger: { trigger: section.current, start, end, scrub: 0.6 },
        },
      );
    }, section);
    return () => ctx.revert();
  }, [section, selector, start, end]);
}
