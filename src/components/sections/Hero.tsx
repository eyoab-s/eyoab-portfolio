import DotMatrix from "@/components/animations/DotMatrix";

export default function Hero() {
  return (
    <section className="page-shell pb-12 pt-16 sm:pb-16 sm:pt-24">
      <div className="editorial-grid items-end gap-y-14">
        {/* Introduction */}
        <div className="col-span-4">
          <p className="mono mb-8 flex items-center gap-3 text-[11px] uppercase tracking-[0.14em] text-graphite">
            <span className="h-px w-6 bg-graphite" aria-hidden="true" />
            Software Engineer · Addis Ababa
          </p>

          <h1 className="max-w-90 text-[clamp(2.4rem,4.4vw,3.4rem)] font-medium leading-[1.05] tracking-[-0.045em]">
            Building software that solves real problems.
          </h1>

          <p className="mt-7 max-w-[320px] text-[15px] leading-[1.7] text-[#666666]">
            I’m Eyoab, a software engineering student and developer. I enjoy
            turning practical ideas into working products, from the interfaces
            people use to the systems behind them.
          </p>

          <a
            href="#work"
            className="mono mt-9 inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.12em] transition-opacity hover:opacity-50"
          >
            Explore selected work
            <span aria-hidden="true">↗</span>
          </a>
        </div>

        {/* Interactive dot matrix */}
        <div className="col-span-4 min-w-0 min-[821px]:col-span-8">
          <DotMatrix />
        </div>
      </div>

      {/* Section introduction */}
      <div className="section-rule mt-16 flex items-center justify-between pt-4 sm:mt-24">
        <span className="mono text-[11px] uppercase tracking-[0.12em] text-graphite">
          Selected work &amp; experiments
        </span>
        <span className="mono text-[11px] uppercase tracking-[0.12em] text-graphite">
          Scroll to explore ↓
        </span>
      </div>
    </section>
  );
}