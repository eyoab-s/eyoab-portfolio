"use client";

import { useEffect, useState } from "react";

const mmss = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

const rowClass =
  "grid grid-cols-[104px_1fr] gap-4 border-t border-line py-3 last:border-b";
const dtClass =
  "mono pt-[2px] text-[11px] uppercase tracking-[0.12em] text-graphite";

export default function SpecLive() {
  const [time, setTime] = useState("");
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const tick = () =>
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          timeZone: "Africa/Addis_Ababa",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(new Date())
      );
    tick();
    const id = window.setInterval(() => {
      tick();
      setSeconds((s) => s + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <>
      <div className={rowClass}>
        <dt className={dtClass}>Local time</dt>
        <dd className="flex items-center justify-end gap-2 text-right text-[13px] tabular-nums">
          <span
            aria-hidden="true"
            className="led-pulse h-[6px] w-[6px] rounded-full bg-ink"
          />
          {time || "--:--:--"} EAT
        </dd>
      </div>
      <div className={rowClass}>
        <dt className={dtClass}>On this page</dt>
        <dd className="text-right text-[13px] tabular-nums">{mmss(seconds)}</dd>
      </div>
    </>
  );
}