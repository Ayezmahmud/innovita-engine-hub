import { Link } from "@tanstack/react-router";
import { Linkedin, Facebook, Youtube, Mail, MapPin, Phone } from "lucide-react";
import { Logo, NAV } from "./ui";

const services = [
  "Feasibility Studies",
  "Concept Development",
  "Engineering Calculations",
  "Advanced Simulation",
  "Prototyping",
  "Inspection & Certified Design",
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container-x grid gap-10 py-14 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.1fr)]">
        <div>
          <Logo />
          <p className="mt-5 max-w-xs text-[0.8rem] leading-relaxed text-muted-foreground">
            Australian multidisciplinary engineering consultancy delivering mechanical and structural design, advanced
            analysis and certified engineering for mining, energy and industry.
          </p>
        </div>

        <nav aria-label="Footer">
          <h3 className="tech-label">Navigate</h3>
          <ul className="mt-4 space-y-2.5">
            {NAV.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="text-[0.78rem] font-medium text-graphite transition-colors hover:text-primary">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="tech-label">Services</h3>
          <ul className="mt-4 space-y-2.5">
            {services.map((s) => (
              <li key={s}>
                <Link to="/services" className="text-[0.78rem] font-medium text-graphite transition-colors hover:text-primary">
                  {s}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="tech-label">Contact</h3>
          <ul className="mt-4 space-y-3 text-[0.78rem] text-graphite">
            <li className="flex items-start gap-2.5">
              <Mail className="mt-0.5 h-3.5 w-3.5 flex-none text-primary" strokeWidth={2} />
              <a href="mailto:info@innovita.com.au" className="hover:text-primary">info@innovita.com.au</a>
            </li>
            <li className="flex items-start gap-2.5">
              <Phone className="mt-0.5 h-3.5 w-3.5 flex-none text-primary" strokeWidth={2} />
              <span>Enquiries via email or the contact form</span>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-3.5 w-3.5 flex-none text-primary" strokeWidth={2} />
              <span>Australia — projects nationwide</span>
            </li>
          </ul>
          <div className="mt-5 flex items-center gap-4 text-navy">
            <a href="https://www.linkedin.com" aria-label="LinkedIn" className="hover:text-primary"><Linkedin className="h-4 w-4" strokeWidth={1.75} /></a>
            <a href="https://www.facebook.com" aria-label="Facebook" className="hover:text-primary"><Facebook className="h-4 w-4" strokeWidth={1.75} /></a>
            <a href="https://www.youtube.com" aria-label="YouTube" className="hover:text-primary"><Youtube className="h-4 w-4" strokeWidth={1.75} /></a>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-x flex flex-col gap-2 py-4 text-[0.66rem] sm:flex-row sm:items-center sm:justify-between">
          <span className="text-muted-foreground">© 2026 Innovita Engineering Solutions. All rights reserved.</span>
          <span className="font-medium text-primary">Engineering Today. For a Stronger Tomorrow.</span>
        </div>
      </div>
    </footer>
  );
}
