
export default function About() {
  return (
    <section id="about" className="page-shell py-24 sm:py-32">
      <div className="section-rule grid grid-cols-1 gap-12 pt-6 min-[821px]:grid-cols-12 min-[821px]:gap-10">
        {/* Section label */}
        <div className="min-[821px]:col-span-4">
          <p className="mono text-[9px] tracking-[0.16em] text-[#8a8a8a]">
            02 / BACKGROUND
          </p>

          <h2 className="mt-5 text-[38px] font-medium leading-none tracking-[-0.07em] sm:text-[48px]">
            A little about me<span className="text-[#8a8a8a]">.</span>
          </h2>
        </div>

        {/* Main content */}
        <div className="min-[821px]:col-span-7 min-[821px]:col-start-6">
          <p className="max-w-155 text-[19px] leading-[1.6] tracking-[-0.035em] sm:text-[23px]">
            I'm a software engineering student at HilCoE School of Computer
            Science, based in Addis Ababa, Ethiopia. I enjoy building software
            that solves practical problems and turning ideas into products
            people can actually use.
          </p>

          <p className="mt-6 max-w-140 text-[13px] leading-[1.9] text-[#777777]">
            My experience comes from an internship at Aspen Consulting,
            freelance work, and developing projects independently. I work
            across frontend and backend development, with a particular
            interest in understanding how complete applications are designed
            and built.
          </p>

          {/* Details */}
          <div className="mt-16 grid grid-cols-1 gap-10 border-t border-[#e2e2e0] pt-7 sm:grid-cols-3">
            <div>
              <p className="mono text-[9px] tracking-[0.14em] text-[#999999]">
                STUDYING
              </p>
              <p className="mt-4 text-[13px] leading-[1.8]">
                Software Engineering
                <br />
                HilCoE School of Computer Science
                <br />
                Expected 2027
              </p>
            </div>

            <div>
              <p className="mono text-[9px] tracking-[0.14em] text-[#999999]">
                EXPERIENCE
              </p>
              <p className="mt-4 text-[13px] leading-[1.8]">
                Aspen Consulting
                <br />
                Freelance Development
                <br />
                Independent Projects
              </p>
            </div>

            <div>
              <p className="mono text-[9px] tracking-[0.14em] text-[#999999]">
                FOCUS
              </p>
              <p className="mt-4 text-[13px] leading-[1.8]">
                Frontend Development
                <br />
                Backend Development
                <br />
                Software Engineering
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
