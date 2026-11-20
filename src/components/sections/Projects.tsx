"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import ProjectDotPreview from "@/components/animations/ProjectDotPreview";
import { projects, type Project } from "@/data/projects";

function initials(name: string) {
  return name
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function LiveLink({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="mono mt-7 inline-flex items-center gap-3 border-b border-ink pb-2 text-[11px] uppercase tracking-[0.12em] transition-opacity hover:opacity-50"
    >
      Visit live project
      <ArrowUpRight size={14} aria-hidden="true" />
    </a>
  );
}

function Technologies({ items }: { items?: string[] }) {
  if (!items?.length) return null;
  return (
    <p className="mono mt-6 text-[11px] uppercase tracking-[0.1em] text-graphite">
      {items.join(" / ")}
    </p>
  );
}

function Details({ project }: { project: Project }) {
  return (
    <>
      <p className="text-[15px] leading-[1.7] text-[#666666]">
        {project.description}
      </p>
      <Technologies items={project.technologies} />
      {project.link && <LiveLink href={project.link} />}
    </>
  );
}

export default function Projects() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = projects[activeIndex];

  return (
    <section id="work" className="page-shell pb-24 pt-32 sm:pb-32 sm:pt-48">
      {/* Heading */}
      <div className="flex items-end justify-between gap-8 pb-10">
        <div>
          <p className="mono text-[11px] uppercase tracking-[0.14em] text-graphite">
            01 / Selected work
          </p>
          <h2 className="mt-5 text-[clamp(2rem,4vw,3.25rem)] font-medium leading-none tracking-[-0.045em]">
            Selected projects<span className="text-graphite">.</span>
          </h2>
        </div>

        <p className="hidden max-w-[220px] text-[13px] leading-[1.7] text-[#666666] md:block">
          A collection of things I’ve built, explored, and continue to develop.
        </p>
      </div>

      <div className="editorial-grid gap-y-12">
        {/* Preview and details (desktop) */}
        <div className="hidden min-[821px]:col-span-5 min-[821px]:block">
          <div className="sticky top-28">
            <div className="max-w-[340px]">
              <ProjectDotPreview text={initials(active.name)} />
            </div>

            <div className="mt-10 max-w-[380px]" aria-live="polite">
              <div className="mono flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] uppercase tracking-[0.12em] text-graphite">
                <span>Project / {active.number}</span>
                {active.status && (
                  <span className="flex items-center gap-2">
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-ink"
                      aria-hidden="true"
                    />
                    {active.status}
                  </span>
                )}
              </div>

              <h3 className="mt-5 text-[clamp(1.8rem,3vw,2.4rem)] font-medium leading-[1.05] tracking-[-0.045em]">
                {active.name}
              </h3>

              <div className="mt-5">
                <Details project={active} />
              </div>
            </div>
          </div>
        </div>

        {/* Project list */}
        <ul className="col-span-4 min-[821px]:col-span-6 min-[821px]:col-start-7">
          {projects.map((project, index) => {
            const isActive = index === activeIndex;

            return (
              <li
                key={project.number}
                className="border-b border-line first:border-t"
              >
                <button
                  type="button"
                  aria-pressed={isActive}
                  onMouseEnter={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                  onClick={() => setActiveIndex(index)}
                  className="flex w-full items-baseline gap-5 py-6 text-left"
                >
                  <span className="mono w-8 shrink-0 text-[11px] tracking-[0.12em] text-graphite">
                    {project.number}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span
                      className={`block text-[clamp(1.4rem,2.6vw,2rem)] font-medium leading-tight tracking-[-0.04em] transition-[color,transform] duration-200 ${
                        isActive ? "translate-x-2 text-ink" : "text-graphite"
                      }`}
                    >
                      {project.name}
                    </span>
                    <span className="mono mt-1 block text-[11px] uppercase tracking-[0.12em] text-graphite">
                      {project.category}
                    </span>
                  </span>

                  {project.year && (
                    <span className="mono shrink-0 text-[11px] tracking-[0.12em] text-graphite">
                      {project.year}
                    </span>
                  )}
                </button>

                {/* Expanded details on small screens, where there is no hover */}
                {isActive && (
                  <div className="pb-8 pl-13 min-[821px]:hidden">
                    <Details project={project} />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}