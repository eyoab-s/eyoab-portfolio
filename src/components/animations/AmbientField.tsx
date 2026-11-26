"use client";

import { useEffect, useRef } from "react";

const INK = "17,17,17";
const TAU = Math.PI * 2;

const smooth = (x: number) => {
  const v = Math.max(0, Math.min(1, x));
  return v * v * (3 - 2 * v);
};

export default function AmbientField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    let W = 0;
    let H = 0;
    let S = 40;
    let raf = 0;
    let tx = -9999;
    let ty = -9999;
    let mx = -9999;
    let my = -9999;

    function draw(now: number) {
      ctx!.clearRect(0, 0, W, H);

      // Pointer eases toward the real position, and snaps when it first enters
      if (tx < -1000) {
        mx = my = -9999;
      } else if (mx < -1000) {
        mx = tx;
        my = ty;
      } else {
        mx += (tx - mx) * 0.08;
        my += (ty - my) * 0.08;
      }

      const reveal = (now - start) / 2600;
      const ox = W * 0.7;
      const oy = H * 0.55;
      const maxDist = Math.hypot(W, H);

      for (let y = S / 2; y < H + S; y += S) {
        for (let x = S / 2; x < W + S; x += S) {
          let a = 0.5;
          let fadeIn = 1;

          if (!reduce) {
            a =
              (Math.sin(x * 0.006 + y * 0.004 - now * 0.0006) * 0.5 + 0.5) *
              (Math.sin(x * 0.011 - y * 0.007 + now * 0.0005) * 0.5 + 0.5);
            const d = Math.hypot(x - ox, y - oy) / maxDist;
            fadeIn = smooth((reveal * 1.5 - d) * 3.5);
          }

          const dx = x - mx;
          const dy = y - my;
          const dist = Math.hypot(dx, dy) || 1;
          let near = reduce ? 0 : Math.max(0, 1 - dist / 190);
          near *= near;

          const px = x + (dx / dist) * near * 14;
          const py = y + (dy / dist) * near * 14;
          const alpha = (0.09 + a * 0.18 + near * 0.5) * fadeIn;
          if (alpha < 0.01) continue;

          ctx!.beginPath();
          ctx!.arc(px, py, 1.2 + a * 1.4 + near * 3.2, 0, TAU);
          ctx!.fillStyle = `rgba(${INK},${alpha})`;
          ctx!.fill();
        }
      }
    }

    function loop(now: number) {
      draw(now);
      raf = requestAnimationFrame(loop);
    }

    function size() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      cv!.width = W * dpr;
      cv!.height = H * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      S = W < 600 ? 32 : 40;
      if (reduce) draw(start + 10000);
    }

    const onMove = (event: PointerEvent) => {
      tx = event.clientX;
      ty = event.clientY;
    };
    const onLeave = () => {
      tx = ty = -9999;
    };

    size();
    window.addEventListener("resize", size);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    if (!reduce) raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", size);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const mask =
    "radial-gradient(ellipse 85% 80% at 72% 42%, #000 15%, transparent 92%)";

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
      style={{ maskImage: mask, WebkitMaskImage: mask }}
    />
  );
}