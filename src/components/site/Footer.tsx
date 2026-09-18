import { Linkedin, Facebook, Youtube } from "lucide-react";
import { Logo, NAV, navHref } from "./ui";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container-x flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between">
        <Logo />
        <nav className="flex flex-wrap gap-x-7 gap-y-2" aria-label="Footer">
          {NAV.map((n) => (
            <a key={n} href={navHref(n)} className="text-[0.72rem] font-medium text-graphite transition-colors hover:text-primary">
              {n}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4 text-navy">
          <a href="https://www.linkedin.com" aria-label="LinkedIn" className="hover:text-primary"><Linkedin className="h-4 w-4" strokeWidth={1.75} /></a>
          <a href="https://www.facebook.com" aria-label="Facebook" className="hover:text-primary"><Facebook className="h-4 w-4" strokeWidth={1.75} /></a>
          <a href="https://www.youtube.com" aria-label="YouTube" className="hover:text-primary"><Youtube className="h-4 w-4" strokeWidth={1.75} /></a>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-x flex flex-col gap-2 py-4 text-[0.66rem] sm:flex-row sm:items-center sm:justify-between">
          <span className="text-muted-foreground">© 2025 Innovita Engineering Solutions. All rights reserved.</span>
          <span className="font-medium text-primary">Engineering Today. For a Stronger Tomorrow.</span>
        </div>
      </div>
    </footer>
  );
}
