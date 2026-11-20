"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const WORDS = ["EYOAB", "ENGINEER", "BACKEND", "DEVOPS", "ADDIS"];

const ROWS = 11; // grid rows; the 7-row glyphs sit vertically centred
const GLYPH_W = 5;
const GLYPH_H = 7;
const ADVANCE = GLYPH_W + 1; // glyph width + 1 column of spacing
const TAU = Math.PI * 2;

// 5x7 bitmap font: each number is one row, bit 4 = leftmost dot.
const FONT: Record<string, number[]> = {
  " ": [0, 0, 0, 0, 0, 0, 0],
  ".": [0, 0, 0, 0, 0, 0x0c, 0x0c],
  "-": [0, 0, 0, 0x1f, 0, 0, 0],
  A: [0x0e, 0x11, 0x11, 0x1f, 0x11, 0x11, 0x11],
  B: [0x1e, 0x11, 0x11, 0x1e, 0x11, 0x11, 0x1e],
  C: [0x0e, 0x11, 0x10, 0x10, 0x10, 0x11, 0x0e],
  D: [0x1e, 0x11, 0x11, 0x11, 0x11, 0x11, 0x1e],
  E: [0x1f, 0x10, 0x10, 0x1e, 0x10, 0x10, 0x1f],
  F: [0x1f, 0x10, 0x10, 0x1e, 0x10, 0x10, 0x10],
  G: [0x0e, 0x11, 0x10, 0x17, 0x11, 0x11, 0x0f],
  H: [0x11, 0x11, 0x11, 0x1f, 0x11, 0x11, 0x11],
  I: [0x0e, 0x04, 0x04, 0x04, 0x04, 0x04, 0x0e],
  J: [0x07, 0x02, 0x02, 0x02, 0x02, 0x12, 0x0c],
  K: [0x11, 0x12, 0x14, 0x18, 0x14, 0x12, 0x11],
  L: [0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x1f],
  M: [0x11, 0x1b, 0x15, 0x15, 0x11, 0x11, 0x11],
  N: [0x11, 0x19, 0x15, 0x13, 0x11, 0x11, 0x11],
  O: [0x0e, 0x11, 0x11, 0x11, 0x11, 0x11, 0x0e],
  P: [0x1e, 0x11, 0x11, 0x1e, 0x10, 0x10, 0x10],
  Q: [0x0e, 0x11, 0x11, 0x11, 0x15, 0x12, 0x0d],
  R: [0x1e, 0x11, 0x11, 0x1e, 0x14, 0x12, 0x11],
  S: [0x0f, 0x10, 0x10, 0x0e, 0x01, 0x01, 0x1e],
  T: [0x1f, 0x04, 0x04, 0x04, 0x04, 0x04, 0x04],
  U: [0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x0e],
  V: [0x11, 0x11, 0x11, 0x11, 0x11, 0x0a, 0x04],
  W: [0x11, 0x11, 0x11, 0x15, 0x15, 0x15, 0x0a],
  X: [0x11, 0x11, 0x0a, 0x04, 0x0a, 0x11, 0x11],
  Y: [0x11, 0x11, 0x0a, 0x04, 0x04, 0x04, 0x04],
  Z: [0x1f, 0x01, 0x02, 0x04, 0x08, 0x10, 0x1f],
  "0": [0x0e, 0x11, 0x13, 0x15, 0x19, 0x11, 0x0e],
  "1": [0x04, 0x0c, 0x04, 0x04, 0x04, 0x04, 0x0e],
  "2": [0x0e, 0x11, 0x01, 0x02, 0x04, 0x08, 0x1f],
  "3": [0x1f, 0x02, 0x04, 0x02, 0x01, 0x11, 0x0e],
  "4": [0x02, 0x06, 0x0a, 0x12, 0x1f, 0x02, 0x02],
  "5": [0x1f, 0x10, 0x1e, 0x01, 0x01, 0x11, 0x0e],
  "6": [0x06, 0x08, 0x10, 0x1e, 0x11, 0x11, 0x0e],
  "7": [0x1f, 0x01, 0x02, 0x04, 0x08, 0x08, 0x08],
  "8": [0x0e, 0x11, 0x11, 0x0e, 0x11, 0x11, 0x0e],
  "9": [0x0e, 0x11, 0x11, 0x0f, 0x01, 0x02, 0x0c],
};

function buildMask(text: string, cols: number): Uint8Array {
  const mask = new Uint8Array(cols * ROWS);
  const top = Math.floor((ROWS - GLYPH_H) / 2);
  let x = 1;
  for (const ch of text) {
    if (x + GLYPH_W > cols) break;
    const glyph = FONT[ch] ?? FONT[" "];
    for (let r = 0; r < GLYPH_H; r++) {
      for (let c = 0; c < GLYPH_W; c++) {
        if (glyph[r] & (1 << (GLYPH_W - 1 - c))) {
          mask[(top + r) * cols + x + c] = 1;
        }
      }
    }
    x += ADVANCE;
  }
  return mask;
}

type Engine = {
  cols: number;
  cell: number;
  dpr: number;
  a: Float32Array; // current brightness of each dot (0-1)
  t: Float32Array; // target brightness
  ox: Float32Array; // displacement from the pointer
  oy: Float32Array;
  vx: Float32Array;
  vy: Float32Array;
  changedAt: number;
  px: number;
  py: number;
  raf: number;
  visible: boolean;
  ink: string;
  faint: string;
};

function createEngine(): Engine {
  const empty = () => new Float32Array(0);
  return {
    cols: 0,
    cell: 0,
    dpr: 1,
    a: empty(),
    t: empty(),
    ox: empty(),
    oy: empty(),
    vx: empty(),
    vy: empty(),
    changedAt: 0,
    px: -9999,
    py: -9999,
    raf: 0,
    visible: true,
    ink: "#111111",
    faint: "#e6e6e4",
  };
}

export default function DotMatrix() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const eng = useRef<Engine>(createEngine());
  const api = useRef({
    wake: () => {},
    relayout: () => {},
    setMask: () => {},
  });
  const colsRef = useRef(48);
  const textRef = useRef("EYOAB");
  const reducedRef = useRef(false);
  const interacting = useRef(false);

  const [cols, setCols] = useState(48);
  const [wordIndex, setWordIndex] = useState(0);
  const [custom, setCustom] = useState("");
  const [reduced, setReduced] = useState(false);

  const maxChars = Math.floor(cols / ADVANCE);
  const words = useMemo(
    () => WORDS.filter((w) => w.length <= maxChars),
    [maxChars]
  );
  const text = custom || words[wordIndex % words.length] || "EYOAB";

  // 1. Engine: sizing, drawing loop, observers
  useEffect(() => {
    const cv = canvasRef.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;
    const e = eng.current;

    const styles = getComputedStyle(document.documentElement);
    e.ink = styles.getPropertyValue("--ink").trim() || "#111111";
    e.faint = styles.getPropertyValue("--faint").trim() || "#e6e6e4";

    const frame = (now: number) => {
      e.raf = 0;
      const { cols: c, cell, dpr } = e;
      if (!c) return;

      const reduce = reducedRef.current;
      const radius = cell * 3.4;
      const total = c * ROWS;
      const since = now - e.changedAt;
      let busy = e.px > -1000;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, c * cell, ROWS * cell);

      for (let i = 0; i < total; i++) {
        const col = i % c;
        const row = (i / c) | 0;
        const hx = (col + 0.5) * cell;
        const hy = (row + 0.5) * cell;

        // Brightness eases toward its target, as a left-to-right wave
        if (reduce) {
          e.a[i] = e.t[i];
        } else if (since >= col * 14) {
          const d = e.t[i] - e.a[i];
          if (Math.abs(d) > 0.004) {
            e.a[i] += d * 0.2;
            busy = true;
          } else {
            e.a[i] = e.t[i];
          }
        } else {
          busy = true;
        }

        // Pointer physics: dots are pushed away, then spring back
        let glow = 0;
        if (!reduce) {
          const dx = hx - e.px;
          const dy = hy - e.py;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < radius) {
            const f = 1 - dist / radius;
            e.vx[i] += (dx / dist) * f * cell * 0.22;
            e.vy[i] += (dy / dist) * f * cell * 0.22;
            glow = f;
          }
          e.vx[i] = (e.vx[i] - e.ox[i] * 0.09) * 0.78;
          e.vy[i] = (e.vy[i] - e.oy[i] * 0.09) * 0.78;
          e.ox[i] += e.vx[i];
          e.oy[i] += e.vy[i];
          if (
            Math.abs(e.ox[i]) + Math.abs(e.oy[i]) +
              Math.abs(e.vx[i]) + Math.abs(e.vy[i]) > 0.02
          ) {
            busy = true;
          }
        }

        const x = hx + e.ox[i];
        const y = hy + e.oy[i];

        // Faint resting dot, always present
        ctx.fillStyle = e.faint;
        ctx.beginPath();
        ctx.arc(x, y, cell * 0.07, 0, TAU);
        ctx.fill();

        // Lit dot
        const level = Math.max(e.a[i], glow * 0.5);
        if (level > 0.02) {
          ctx.globalAlpha = Math.min(1, level);
          ctx.fillStyle = e.ink;
          ctx.beginPath();
          ctx.arc(x, y, cell * (0.1 + 0.27 * level), 0, TAU);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }

      if (busy) e.raf = requestAnimationFrame(frame);
    };

    const wake = () => {
      if (!e.raf && e.visible) e.raf = requestAnimationFrame(frame);
    };

    const setMask = () => {
      if (!e.cols) return;
      e.t.set(buildMask(textRef.current, e.cols));
      e.changedAt = performance.now();
      if (reducedRef.current) e.a.set(e.t);
      wake();
    };

    const relayout = () => {
      const w = cv.clientWidth;
      if (!w) return;
      const c = colsRef.current;
      const n = c * ROWS;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      cv.width = Math.round(w * dpr);
      cv.height = Math.round(((w * ROWS) / c) * dpr);
      e.cols = c;
      e.cell = w / c;
      e.dpr = dpr;

      if (e.a.length !== n) {
        e.a = new Float32Array(n);
        e.t = new Float32Array(n);
        e.ox = new Float32Array(n);
        e.oy = new Float32Array(n);
        e.vx = new Float32Array(n);
        e.vy = new Float32Array(n);
      }
      setMask();
    };

    api.current = { wake, relayout, setMask };

    const resizeObserver = new ResizeObserver(() => {
      const next = cv.clientWidth < 560 ? 36 : 48;
      if (next !== colsRef.current) setCols(next);
      else relayout();
    });
    resizeObserver.observe(cv);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      e.visible = entry.isIntersecting;
      if (e.visible) wake();
    });
    intersectionObserver.observe(cv);

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      if (e.raf) cancelAnimationFrame(e.raf);
      e.raf = 0;
      api.current = { wake() {}, relayout() {}, setMask() {} };
    };
  }, []);

  // 2. Keep the engine in sync with React state
  useEffect(() => {
    colsRef.current = cols;
    api.current.relayout();
  }, [cols]);

  useEffect(() => {
    textRef.current = text;
    api.current.setMask();
  }, [text]);

  useEffect(() => {
    reducedRef.current = reduced;
    api.current.setMask();
  }, [reduced]);

  // 3. Respect reduced-motion preference
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  // 4. Cycle through the words, pausing while the person is interacting
  useEffect(() => {
    if (reduced || custom) return;
    const id = window.setInterval(() => {
      if (interacting.current || document.hidden) return;
      setWordIndex((i) => (i + 1) % words.length);
    }, 4200);
    return () => window.clearInterval(id);
  }, [reduced, custom, words.length]);

  const next = () => {
    setCustom("");
    setWordIndex((i) => (i + 1) % words.length);
  };

  const trackPointer = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    eng.current.px = event.clientX - bounds.left;
    eng.current.py = event.clientY - bounds.top;
    api.current.wake();
  };

  const clearPointer = () => {
    eng.current.px = -9999;
    eng.current.py = -9999;
    api.current.wake();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLCanvasElement>) => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      next();
    } else if (event.key === "Escape") {
      setCustom("");
      setWordIndex(0);
    } else if (event.key === "Backspace") {
      event.preventDefault();
      setCustom((current) => current.slice(0, -1));
    } else if (/^[a-z0-9.-]$/i.test(event.key)) {
      event.preventDefault();
      setCustom((current) =>
        (current + event.key.toUpperCase()).slice(0, maxChars)
      );
    }
  };

  return (
    <div className="w-full">
      <canvas
        ref={canvasRef}
        role="button"
        tabIndex={0}
        aria-label={`Interactive dot matrix displaying ${text}. Press Enter for the next word, or type to write your own.`}
        style={{ aspectRatio: `${cols} / ${ROWS}` }}
        className="block w-full cursor-pointer touch-pan-y"
        onClick={next}
        onKeyDown={onKeyDown}
        onPointerMove={trackPointer}
        onPointerDown={trackPointer}
        onPointerUp={(event) => {
          if (event.pointerType !== "mouse") clearPointer();
        }}
        onPointerCancel={clearPointer}
        onPointerEnter={() => {
          interacting.current = true;
        }}
        onPointerLeave={() => {
          interacting.current = false;
          clearPointer();
        }}
        onFocus={(event) => {
          if (event.currentTarget.matches(":focus-visible")) {
            interacting.current = true;
          }
        }}
        onBlur={() => {
          interacting.current = false;
        }}
      />

      <span className="sr-only" aria-live="polite">
        {text}
      </span>

      <div className="mt-3 flex items-center justify-between">
        <span className="mono text-[11px] uppercase tracking-[0.12em] text-graphite">
          Interactive dot typography
        </span>
        <span className="mono text-[11px] uppercase tracking-[0.12em] text-graphite">
          Click / Type
        </span>
      </div>
    </div>
  );
}