import type { CSSProperties } from "react";
import DotMatrix from "@/components/animations/DotMatrix";
import SpecLive from "@/components/sections/SpecLive";
import { projects } from "@/data/projects";

const specs = [
  { label: "Location", value: "Addis Ababa, Ethiopia", note: "9°01′N 38°44′E" },
  { label: "Studying", value: "Software Engineering, HilCoE" },
  { label: "Interests", value: "Software engineering, backend, DevOps" },
  { label: "Selected work", value: `${projects.length} projects` },
];

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export default function Hero() {
  return (
    <section className="page-shell pb-16 pt-16 sm:pb-24 sm:pt-24">
      <div className="editorial-grid items-start gap-y-14">
        {/* Introduction */}
        <div className="col-span-4">
          <p
            className="hero-rise mono mb-8 flex items-center gap-3 text-[11px] uppercase tracking-[0.14em] text-graphite"
            style={delay(0)}
          >
            <span className="h-px w-6 bg-graphite" aria-hidden="true" />
            Software Engineer · Addis Ababa
          </p>

          <h1
            className="hero-rise max-w-[360px] text-[clamp(2.4rem,4.4vw,3.4rem)] font-medium leading-[1.05] tracking-[-0.045em]"
            style={delay(120)}
          >
            Building software that solves real problems.
          </h1>

          <p
            className="hero-rise mt-7 max-w-[320px] text-[15px] leading-[1.7] text-[#666666]"
            style={delay(260)}
          >
            I’m Eyoab, a software engineering student and developer. I enjoy
            turning practical ideas into working products, from the interfaces
            people use to the systems behind them.
          </p>

          <a
            href="#work"
            className="hero-rise mono mt-9 inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.12em] transition-opacity hover:opacity-50"
            style={delay(380)}
          >
            Explore selected work
            <span aria-hidden="true">↗</span>
          </a>
        </div>

        {/* Interactive dot matrix above, spec sheet below */}
        <div className="col-span-4 min-w-0 min-[821px]:col-span-8 min-[821px]:pt-16">
          <DotMatrix />

          <dl className="ml-auto mt-14 hidden w-full max-w-[340px] min-[821px]:block">
            {specs.map((spec) => (
              <div
                key={spec.label}
                className="grid grid-cols-[104px_1fr] gap-4 border-t border-line py-3 first:border-ink"
              >
                <dt className="mono pt-[2px] text-[11px] uppercase tracking-[0.12em] text-graphite">
                  {spec.label}
                </dt>
                <dd className="text-right text-[13px] leading-[1.5]">
                  {spec.value}
                  {spec.note && (
                    <span className="mono mt-1 block text-[11px] tracking-[0.08em] text-graphite">
                      {spec.note}
                    </span>
                  )}
                </dd>
              </div>
            ))}
            <SpecLive />
          </dl>
        </div>
      </div>
    </section>
  );
}