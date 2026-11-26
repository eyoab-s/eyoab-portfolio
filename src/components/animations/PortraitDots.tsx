"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const COLS = 30;
const ROWS = 38;
const TAU = Math.PI * 2;

export default function PortraitDots({
  src = "/portrait.jpg",
  alt,
}: {
  src?: string;
  alt: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showPhoto, setShowPhoto] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const cv = canvasRef.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;

    const n = COLS * ROWS;
    const a = new Float32Array(n); // current dot size (0-1)
    const t = new Float32Array(n); // target dot size, from photo darkness
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
    let started = 0;
    let ready = false;
    let visible = false;
    let alive = true;
    let px = -9999;
    let py = -9999;

    const frame = (now: number) => {
      raf = 0;
      if (!cell || !ready || !started) return;

      const radius = cell * 3;
      const since = now - started;
      let busy = !reduce && px > -1000;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, COLS * cell, ROWS * cell);

      for (let i = 0; i < n; i++) {
        const col = i % COLS;
        const row = (i / COLS) | 0;
        const hx = (col + 0.5) * cell;
        const hy = (row + 0.5) * cell;

        // Dots grow in as a top-to-bottom wave
        if (reduce) {
          a[i] = t[i];
        } else if (since >= row * 22) {
          const d = t[i] - a[i];
          if (Math.abs(d) > 0.004) {
            a[i] += d * 0.12;
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
        ctx.arc(x, y, cell * 0.06, 0, TAU);
        ctx.fill();

        const level = Math.max(a[i], glow * 0.3);
        if (level > 0.03) {
          ctx.fillStyle = ink;
          ctx.beginPath();
          ctx.arc(x, y, cell * (0.08 + 0.38 * Math.min(1, level)), 0, TAU);
          ctx.fill();
        }
      }

      if (busy) raf = requestAnimationFrame(frame);
    };

    const wake = () => {
      if (!raf && ready && visible && cell) {
        if (!started) started = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };

    // Turn the photo into a grid of dot sizes
    const sample = (img: HTMLImageElement) => {
      const o = document.createElement("canvas");
      o.width = COLS;
      o.height = ROWS;
      const g = o.getContext("2d");
      if (!g) return;

      const target = COLS / ROWS;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      let sw = iw;
      let sh = ih;
      let sx = 0;
      let sy = 0;
      if (iw / ih > target) {
        sw = ih * target;
        sx = (iw - sw) / 2;
      } else {
        sh = iw / target;
        sy = (ih - sh) * 0.2; // bias the crop toward the top, where faces are
      }
      g.drawImage(img, sx, sy, sw, sh, 0, 0, COLS, ROWS);

      const data = g.getImageData(0, 0, COLS, ROWS).data;
      const lum = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        lum[i] =
          (0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2]) / 255;
      }

      // Stretch contrast so the darkest and lightest areas use the full range
      const sorted = Array.from(lum).sort((p, q) => p - q);
      const lo = sorted[Math.floor(n * 0.05)];
      const hi = sorted[Math.floor(n * 0.95)];
      const span = Math.max(0.15, hi - lo);
      for (let i = 0; i < n; i++) {
        const v = Math.min(1, Math.max(0, (lum[i] - lo) / span));
        t[i] = Math.pow(1 - v, 1.1);
      }
      if (reduce) a.set(t);
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

    const img = new window.Image();
    img.onload = () => {
      if (!alive) return;
      sample(img);
      ready = true;
      wake();
    };
    img.onerror = () => {
      if (alive) setFailed(true);
    };
    img.src = src;

    return () => {
      alive = false;
      img.onload = null;
      img.onerror = null;
      cv.removeEventListener("pointermove", move);
      cv.removeEventListener("pointerleave", leave);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [src]);

    // If the photo file is missing, show nothing instead of a broken box
  if (failed) return null;

  const toggle = () => setShowPhoto((value) => !value);

  return (
    <figure className="max-w-[300px]">
      <div
        role="button"
        tabIndex={0}
        aria-pressed={showPhoto}
        aria-label={
          showPhoto
            ? `${alt}. Showing the photo. Press to switch back to dots.`
            : `${alt}, drawn in dots. Press to show the photo.`
        }
        onClick={toggle}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggle();
          }
        }}
        className="relative cursor-pointer"
        style={{ aspectRatio: `${COLS} / ${ROWS}` }}
      >
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full"
        />
        <Image
          src={src}
          alt=""
          fill
          sizes="300px"
          className={`pointer-events-none object-cover object-[50%_20%] grayscale transition-opacity duration-500 ${
            showPhoto ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      <figcaption
        aria-hidden="true"
        className="mono mt-3 flex items-center justify-between text-[11px] uppercase tracking-[0.12em] text-graphite"
      >
        <span>Portrait</span>
        <span>{showPhoto ? "Click for dots" : "Click to reveal"}</span>
      </figcaption>
    </figure>
  );
}