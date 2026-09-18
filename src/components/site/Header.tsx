import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { ArrowIcon, Logo, NAV, navHref } from "./ui";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[height,background-color,box-shadow] duration-300 ${
        scrolled ? "header-scrolled" : "bg-transparent"
      }`}
    >
      <div className={`container-x flex items-center justify-between transition-[height] duration-300 ${scrolled ? "h-14" : "h-[4.5rem]"}`}>
        <Logo />
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {NAV.map((n, i) => (
            <a
              key={n}
              href={navHref(n)}
              className={`relative text-[0.78rem] font-semibold tracking-[0.01em] transition-colors hover:text-primary ${
                i === 0 ? "text-navy" : "text-graphite"
              }`}
            >
              {n}
              {i === 0 && <span className="absolute -bottom-2 left-0 h-[2px] w-5 bg-primary" />}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <button type="button" aria-label="Search" className="text-navy transition-colors hover:text-primary">
            <Search className="h-4 w-4" strokeWidth={1.75} />
          </button>
          <a href="#contact" className="btn-pill btn-primary !h-9 !px-4 text-[0.74rem]">
            Get a Quote <ArrowIcon className="h-3 w-3" />
          </a>
        </div>
      </div>
    </header>
  );
}
