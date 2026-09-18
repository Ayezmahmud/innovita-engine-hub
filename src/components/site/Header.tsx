import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, Search, X } from "lucide-react";
import { ArrowIcon, Logo, NAV } from "./ui";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[height,background-color,box-shadow] duration-300 ${
        scrolled || open ? "header-scrolled" : "bg-transparent"
      }`}
    >
      <div className={`container-x flex items-center justify-between transition-[height] duration-300 ${scrolled ? "h-14" : "h-[4.5rem]"}`}>
        <Logo />
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className="relative text-[0.78rem] font-semibold tracking-[0.01em] text-graphite transition-colors hover:text-primary data-[status=active]:text-navy"
            >
              {n.label}
              <span className="absolute -bottom-2 left-0 h-[2px] w-0 bg-primary transition-[width] duration-300 group-hover:w-5 data-[status=active]:w-5" />
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <button type="button" aria-label="Search" className="text-navy transition-colors hover:text-primary">
            <Search className="h-4 w-4" strokeWidth={1.75} />
          </button>
          <Link to="/contact" className="btn-pill btn-primary !h-9 !px-4 text-[0.74rem]">
            Get a Quote <ArrowIcon className="h-3 w-3" />
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="text-navy transition-colors hover:text-primary lg:hidden"
          >
            {open ? <X className="h-5 w-5" strokeWidth={1.75} /> : <Menu className="h-5 w-5" strokeWidth={1.75} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border bg-background lg:hidden" aria-label="Mobile">
          <div className="container-x flex flex-col py-2">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.to === "/" }}
                onClick={() => setOpen(false)}
                className="border-b border-border/70 py-3 text-[0.85rem] font-semibold text-graphite last:border-0 data-[status=active]:text-primary"
              >
                {n.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
