"use client";

import { useEffect, useState } from "react";

const DOTS = 24;

export default function ProgressRail() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const lit = Math.round(progress * DOTS);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-[9px] min-[1100px]:flex"
    >
      {Array.from({ length: DOTS }, (_, i) => (
        <span
          key={i}
          className={`h-[5px] w-[5px] rounded-full transition-colors duration-300 ${
            i < lit ? "bg-ink" : "bg-faint"
          }`}
        />
      ))}
      <span className="mono mt-3 text-[10px] tabular-nums text-graphite">
        {String(Math.round(progress * 100)).padStart(2, "0")}
      </span>
    </div>
  );
}