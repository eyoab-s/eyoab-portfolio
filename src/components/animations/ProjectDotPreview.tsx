"use client";

import { useEffect, useRef } from "react";
import { ROWS, buildMask } from "@/lib/dotFont";

const COLS = 16;
const TAU = Math.PI * 2;

export default function ProjectDotPreview({ text }: { text: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const setTextRef = useRef<(value: string) => void>(() => {});

  useEffect(() => {
    const cv = canvasRef.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;

    const n = COLS * ROWS;
    const a = new Float32Array(n); // current brightness
    const t = new Float32Array(n); // target brightness
    const ox = new Float32Array(n);
    const oy = new Float32Array(n);
    const vx = new Float32Array(n);
    const vy = new Float32Array(n);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const styles = getComputedStyle(document.documentElement);
    const ink = styles.getPropertyValue("--ink").trim() || "#111111";
    const faint = styles.getPropertyValue("--faint").trim() || "#e6e6e4";

    let cell = 0;
    let dpr = 1;
    let raf = 0;
    let changed = 0;
    let visible = true;
    let px = -9999;
    let py = -9999;

    const frame = (now: number) => {
      raf = 0;
      if (!cell) return;

      const radius = cell * 3;
      const since = now - changed;
      let busy = !reduce && px > -1000;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, COLS * cell, ROWS * cell);

      for (let i = 0; i < n; i++) {
        const col = i % COLS;
        const row = (i / COLS) | 0;
        const hx = (col + 0.5) * cell;
        const hy = (row + 0.5) * cell;

        // Brightness eases toward its target as a left-to-right wave
        if (reduce) {
          a[i] = t[i];
        } else if (since >= col * 16) {
          const d = t[i] - a[i];
          if (Math.abs(d) > 0.004) {
            a[i] += d * 0.2;
            busy = true;
          } else {
            a[i] = t[i];
          }
        } else {
          busy = true;
        }

        // Pointer physics: dots are pushed away, then spring back
        let glow = 0;
        if (!reduce) {
          const dx = hx - px;
          const dy = hy - py;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < radius) {
            const f = 1 - dist / radius;
            vx[i] += (dx / dist) * f * cell * 0.2;
            vy[i] += (dy / dist) * f * cell * 0.2;
            glow = f;
          }
          vx[i] = (vx[i] - ox[i] * 0.09) * 0.78;
          vy[i] = (vy[i] - oy[i] * 0.09) * 0.78;
          ox[i] += vx[i];
          oy[i] += vy[i];
          if (Math.abs(ox[i]) + Math.abs(oy[i]) + Math.abs(vx[i]) + Math.abs(vy[i]) > 0.02) {
            busy = true;
          }
        }

        const x = hx + ox[i];
        const y = hy + oy[i];

        ctx.fillStyle = faint;
        ctx.beginPath();
        ctx.arc(x, y, cell * 0.07, 0, TAU);
        ctx.fill();

        const level = Math.max(a[i], glow * 0.5);
        if (level > 0.02) {
          ctx.globalAlpha = Math.min(1, level);
          ctx.fillStyle = ink;
          ctx.beginPath();
          ctx.arc(x, y, cell * (0.1 + 0.27 * level), 0, TAU);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }

      if (busy) raf = requestAnimationFrame(frame);
    };

    const wake = () => {
      if (!raf && visible && cell) raf = requestAnimationFrame(frame);
    };

    setTextRef.current = (value: string) => {
      t.set(buildMask(value, COLS, true));
      changed = performance.now();
      if (reduce) a.set(t);
      wake();
    };

    const resize = () => {
      const w = cv.clientWidth;
      if (!w) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(((w * ROWS) / COLS) * dpr);
      cell = w / COLS;
      wake();
    };

    const move = (event: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      px = event.clientX - r.left;
      py = event.clientY - r.top;
      wake();
    };
    const leave = () => {
      px = -9999;
      py = -9999;
      wake();
    };

    cv.addEventListener("pointermove", move);
    cv.addEventListener("pointerleave", leave);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(cv);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) wake();
    });
    intersectionObserver.observe(cv);

    return () => {
      cv.removeEventListener("pointermove", move);
      cv.removeEventListener("pointerleave", leave);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      if (raf) cancelAnimationFrame(raf);
      setTextRef.current = () => {};
    };
  }, []);

  useEffect(() => {
    setTextRef.current(text);
  }, [text]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={`Dot-matrix initials: ${text}`}
      style={{ aspectRatio: `${COLS} / ${ROWS}` }}
      className="block w-full"
    />
  );
}