import { useEffect, useRef, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { initSmoothScroll, useReveal } from "@/lib/motion";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function SiteLayout({ children }: { children: ReactNode }) {
  const page = useRef<HTMLDivElement>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return (
    <div id="top" ref={page} className="min-h-screen bg-background">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
