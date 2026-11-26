"use client";

import { useEffect, useRef } from "react";
import { GLYPH_H, buildStrip } from "@/lib/dotFont";
import { projects } from "@/data/projects";

const TAU = Math.PI * 2;
const SPEED = 8; // columns per second
const BASE = ["SOFTWARE ENGINEER", "BACKEND", "DEVOPS", "ADDIS ABABA"];

function sentence() {
  const tools = Array.from(
    new Set(projects.flatMap((p) => p.technologies ?? []))
  ).map((t) => t.toUpperCase());
  return [...BASE, ...tools].join(" + ") + " + ";
}

export default function Ticker() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;

    const { cols: total, mask } = buildStrip(sentence());
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const styles = getComputedStyle(document.documentElement);
    const ink = styles.getPropertyValue("--ink").trim() || "#111111";
    const faint = styles.getPropertyValue("--faint").trim() || "#e6e6e4";

    let cols = 0;
    let cell = 0;
    let dpr = 1;
    let raf = 0;
    let last = 0;
    let pos = 0;
    let drawn = -1;
    let visible = true;
    let paused = false;
    let dirty = true;
    let px = -9999;
    let py = -9999;

    const draw = (off: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cols * cell, GLYPH_H * cell);
      const radius = cell * 3;

      for (let r = 0; r < GLYPH_H; r++) {
        for (let c = 0; c < cols; c++) {
          const x = (c + 0.5) * cell;
          const y = (r + 0.5) * cell;

          // Letters fade out toward both edges of the band
          const lit = mask[r * total + ((c + off) % total)]
            ? Math.min(1, (c + 1) / 6, (cols - c) / 6)
            : 0;
          const d = Math.hypot(x - px, y - py);
          const near = d < radius ? 1 - d / radius : 0;

          ctx.fillStyle = faint;
          ctx.beginPath();
          ctx.arc(x, y, cell * 0.07, 0, TAU);
          ctx.fill();

          const level = Math.max(lit, near * 0.5);
          if (level > 0.03) {
            ctx.globalAlpha = Math.min(1, level);
            ctx.fillStyle = ink;
            ctx.beginPath();
            ctx.arc(x, y, cell * (0.12 + 0.3 * level), 0, TAU);
            ctx.fill();
            ctx.globalAlpha = 1;
          }
        }
      }
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(100, now - last);
      last = now;
      if (!visible || !cell) return;
      if (!paused && !reduce) pos += (dt / 1000) * SPEED;
      const off = Math.floor(pos);
      if (off === drawn && !dirty) return;
      drawn = off;
      dirty = false;
      draw(off);
    };

    const resize = () => {
      const w = cv.clientWidth;
      if (!w) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cols = w < 600 ? 36 : 64;
      cell = w / cols;
      cv.style.aspectRatio = `${cols} / ${GLYPH_H}`;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(cell * GLYPH_H * dpr);
      dirty = true;
    };

    const move = (event: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      px = event.clientX - r.left;
      py = event.clientY - r.top;
      dirty = true;
    };
    const enter = () => {
      paused = true;
    };
    const leave = () => {
      paused = false;
      px = py = -9999;
      dirty = true;
    };

    cv.addEventListener("pointermove", move);
    cv.addEventListener("pointerenter", enter);
    cv.addEventListener("pointerleave", leave);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(cv);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      dirty = true;
    });
    intersectionObserver.observe(cv);

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      cv.removeEventListener("pointermove", move);
      cv.removeEventListener("pointerenter", enter);
      cv.removeEventListener("pointerleave", leave);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, []);

  return (
    <div className="w-full border-y border-line py-6 sm:py-8">
      <canvas
        ref={ref}
        role="img"
        aria-label="Scrolling dot-matrix ticker: software engineer, backend, DevOps, Addis Ababa, and the tools used in my projects."
        style={{ aspectRatio: "64 / 7" }}
        className="block w-full"
      />
    </div>
  );
}