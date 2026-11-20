"use client";

import { useEffect, useState } from "react";

const links = [
  { label: "Work", href: "#work", id: "work" },
  { label: "Background", href: "#about", id: "about" },
  { label: "Contact", href: "#contact", id: "contact" },
];

function addisTime() {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Addis_Ababa",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
}

export default function Navbar() {
  const [time, setTime] = useState("--:--");
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);

  // Live Addis Ababa clock
  useEffect(() => {
    const update = () => setTime(addisTime());
    update();
    const interval = setInterval(update, 20000);
    return () => clearInterval(interval);
  }, []);

  // Highlight the section currently in view
  useEffect(() => {
    const sections = links
      .map((link) => document.getElementById(link.id))
      .filter((el): el is HTMLElement => el !== null);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((section) => observer.observe(section));

    const onScroll = () => {
      if (window.scrollY < 200) setActive("");
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Close the mobile menu with Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper">
      <div className="page-shell">
        <div className="flex min-h-16 items-center justify-between md:grid md:min-h-19 md:grid-cols-[1fr_auto_1fr]">
          <a
            href="#"
            aria-label="Eyoab Seifu, back to top"
            className="w-fit text-[17px] font-medium tracking-[-0.04em]"
          >
            EYOAB SEIFU<span className="text-graphite">.</span>
          </a>

          {/* Desktop navigation */}
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-9 md:flex"
          >
            {links.map((link) => {
              const isActive = active === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  aria-current={isActive ? "location" : undefined}
                  className={`mono relative text-[11px] uppercase tracking-[0.12em] transition-colors hover:text-ink ${
                    isActive ? "text-ink" : "text-graphite"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`absolute -left-3 top-1/2 h-1.25 w-1.25 -translate-y-1/2 rounded-full bg-ink transition-opacity ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Clock + mobile menu button */}
          <div className="flex items-center gap-5 md:justify-self-end">
            <div className="flex flex-col items-end leading-tight">
              <span className="mono hidden text-[11px] uppercase tracking-[0.12em] text-graphite sm:block">
                Addis Ababa
              </span>
              <time
                className="mono text-[12px] tabular-nums"
                aria-label={`Current time in Addis Ababa: ${time}`}
              >
                {time}
              </time>
            </div>

            <button
              type="button"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((value) => !value)}
              className="mono -mr-2 h-11 px-2 text-[11px] uppercase tracking-[0.12em] md:hidden"
            >
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div id="mobile-menu" hidden={!open} className="border-t border-line md:hidden">
        <nav aria-label="Mobile navigation" className="page-shell flex flex-col py-4">
          {links.map((link, index) => (
            <a
              key={link.id}
              href={link.href}
              onClick={() => setOpen(false)}
              className="flex items-baseline justify-between border-b border-line py-5 text-[2rem] tracking-[-0.04em] last:border-b-0"
            >
              {link.label}
              <span className="mono text-[11px] text-graphite" aria-hidden="true">
                0{index + 1}
              </span>
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}