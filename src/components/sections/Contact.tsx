"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";

const EMAIL = "eyoabseifu@gmail.com";

type Profile = { label: string; href: string; display: string };

const profiles: Profile[] = [
  {
    label: "GitHub",
    href: "https://github.com/eyoab-s",
    display: "github.com/eyoab-s",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/eyoab-seifu-2a0211209/",
    display: "linkedin.com/in/eyoab-seifu",
  },
];

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked; the mailto link still works.
    }
  }

  return (
    <section id="contact" className="page-shell pb-24 pt-32 sm:pb-32 sm:pt-48">
      <div className="editorial-grid gap-y-12">
        {/* Section label */}
        <div className="col-span-4">
          <p className="mono text-[11px] uppercase tracking-[0.14em] text-graphite">
            (03) Contact
          </p>

          <h2 className="mt-5 text-[clamp(2rem,4vw,3.25rem)] font-medium leading-none tracking-[-0.045em]">
            Let’s talk<span className="text-graphite">.</span>
          </h2>
        </div>

        {/* Details, aligned with the project and about columns */}
        <div className="col-span-4 min-[821px]:col-span-6 min-[821px]:col-start-7">
          <p className="max-w-[460px] text-[15px] leading-[1.7] text-[#666666]">
            Have a question, a project, or an opportunity in mind? Email is
            the best way to reach me.
          </p>

          <div className="mt-10">
            <a
              href={`mailto:${EMAIL}`}
              className="group inline-block max-w-full break-all text-[clamp(1.4rem,3vw,2.2rem)] font-medium leading-tight tracking-[-0.04em]"
            >
              <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-300 group-hover:bg-[length:100%_1px] group-focus-visible:bg-[length:100%_1px]">
                {EMAIL}
              </span>
            </a>

            <div className="mt-5 flex items-center gap-5">
              <button
                type="button"
                onClick={copyEmail}
                className="mono h-11 border border-ink px-5 text-[11px] uppercase tracking-[0.12em] transition-colors hover:bg-ink hover:text-paper"
              >
                {copied ? "Copied" : "Copy email"}
              </button>
              <span className="sr-only" aria-live="polite">
                {copied ? "Email address copied to clipboard" : ""}
              </span>
            </div>
          </div>

          {profiles.length > 0 && (
            <ul className="mt-16">
              {profiles.map((profile) => (
                <li
                  key={profile.label}
                  className="border-b border-line first:border-t"
                >
                  <a
                    href={profile.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-baseline justify-between gap-6 py-5 transition-[padding] duration-200 hover:pl-3"
                  >
                    <span className="text-[clamp(1.2rem,2vw,1.5rem)] font-medium tracking-[-0.03em]">
                      {profile.label}
                    </span>
                    <span className="mono flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-graphite">
                      {profile.display}
                      <ArrowUpRight size={14} aria-hidden="true" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}