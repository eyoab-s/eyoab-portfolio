import PortraitDots from "@/components/animations/PortraitDots";

const details = [
  {
    label: "Studying",
    lines: [
      "Software Engineering",
      "HilCoE School of Computer Science",
      "Expected 2027", // TODO: confirm graduation year
    ],
  },
  {
    label: "Experience",
    lines: [
      "Internship, Aspen Consulting",
      "Freelance Development", // TODO: keep only if accurate
      "Independent Projects",
    ],
  },
  {
    label: "Focus",
    lines: [
      "Frontend Development",
      "Backend Development",
      "Software Engineering",
    ],
  },
];

export default function About() {
  return (
    <section id="about" className="page-shell pb-24 pt-32 sm:pb-32 sm:pt-48">
      <div className="editorial-grid gap-y-12">
        {/* Section label and portrait */}
        <div className="col-span-4">
          <p className="mono text-[11px] uppercase tracking-[0.14em] text-graphite">
            02 / Background
          </p>

          <h2 className="mt-5 text-[clamp(2rem,4vw,3.25rem)] font-medium leading-none tracking-[-0.045em]">
            A little about me<span className="text-graphite">.</span>
          </h2>

          <div className="mt-12">
            <PortraitDots alt="Portrait of Eyoab Seifu" />
          </div>
        </div>

        {/* Main content, aligned with the project list above */}
        <div className="col-span-4 min-[821px]:col-span-6 min-[821px]:col-start-7">
          <p className="max-w-[620px] text-[clamp(1.2rem,2vw,1.55rem)] leading-[1.45] tracking-[-0.025em]">
            I’m a software engineering student at HilCoE School of Computer
            Science, based in Addis Ababa, Ethiopia. I enjoy building software
            that solves practical problems and turning ideas into products
            people can actually use.
          </p>

          <p className="mt-6 max-w-[560px] text-[15px] leading-[1.7] text-[#666666]">
            My experience comes from an internship at Aspen Consulting,
            freelance work, and developing projects independently. I work
            across frontend and backend development, with a particular
            interest in understanding how complete applications are designed
            and built.
          </p>

          <dl className="mt-16 grid grid-cols-1 gap-10 border-t border-line pt-7 sm:grid-cols-3">
            {details.map((item) => (
              <div key={item.label}>
                <dt className="mono text-[11px] uppercase tracking-[0.12em] text-graphite">
                  {item.label}
                </dt>
                <dd className="mt-4 text-[14px] leading-[1.7]">
                  {item.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}