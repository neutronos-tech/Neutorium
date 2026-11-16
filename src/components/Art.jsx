import { useEffect, useRef } from "react";
import { prefersReduced } from "../lib/smooth";
import { processForms, heroForms } from "../lib/shapes";

// Shared canvas plumbing: sizes to its box, draws only while on screen, one frame if motion is reduced.
function useCanvas(draw, setup) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const still = prefersReduced();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0, raf = 0, visible = false, state = null;
    const mouse = { x: -9999, y: -9999 };

    const size = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      state = setup(w, h);
      draw(ctx, state, w, h, 0, mouse); // always paint a first frame, so the canvas is never empty
    };
    const loop = (t) => {
      if (!visible) return;
      draw(ctx, state, w, h, t / 1000, mouse);
      raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting && !still;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(loop);
    });
    const move = (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const ro = new ResizeObserver(size);
    size();
    ro.observe(canvas);
    io.observe(canvas);
    addEventListener("pointermove", move);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      removeEventListener("pointermove", move);
    };
  }, [draw, setup]);
  return ref;
}

const PAPER = "247, 238, 237";

// Drifting points that link when they come close, and reach for the pointer.
const starsSetup = (w, h) => {
  const n = Math.round(Math.min(110, Math.max(36, (w * h) / 14000)));
  return Array.from({ length: n }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.22,
    vy: (Math.random() - 0.5) * 0.22,
    r: 0.8 + Math.random() * 1.8,
    p: Math.random() * 6.28,
  }));
};
const starsDraw = (ctx, pts, w, h, t, mouse) => {
  ctx.clearRect(0, 0, w, h);
  const link = Math.min(170, w * 0.16);
  for (const p of pts) {
    p.x += p.vx; p.y += p.vy;
    if (p.x < -20) p.x = w + 20; else if (p.x > w + 20) p.x = -20;
    if (p.y < -20) p.y = h + 20; else if (p.y > h + 20) p.y = -20;
  }
  ctx.lineWidth = 1;
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i];
    for (let j = i + 1; j < pts.length; j++) {
      const b = pts[j];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < link) {
        ctx.strokeStyle = `rgba(${PAPER}, ${0.22 * (1 - d / link)})`;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
    }
    const dm = Math.hypot(a.x - mouse.x, a.y - mouse.y);
    if (dm < 240) {
      ctx.strokeStyle = `rgba(${PAPER}, ${0.5 * (1 - dm / 240)})`;
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
    }
    ctx.fillStyle = `rgba(${PAPER}, ${0.45 + 0.4 * Math.sin(t * 1.3 + a.p)})`;
    ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, 6.283); ctx.fill();
  }
};

export function Constellation({ className = "" }) {
  const ref = useCanvas(starsDraw, starsSetup);
  return <canvas ref={ref} aria-hidden="true" className={className} />;
}

// One cloud of points that reshapes itself through four formations:
// a circle (understand), a brain (define), a neuron (build), a network of them (improve).
const N = 900;
const forms = processForms(N);
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function Morph({ progress, auto = false, className = "" }) {
  const setup = useRef(() => null).current;
  const live = useRef(auto);
  live.current = auto;
  const draw = useRef((ctx, _s, w, h, t) => {
    ctx.clearRect(0, 0, w, h);
    // Without a scroll position to follow, cycle through the formations on a timer.
    const p = live.current ? (t % 16) / 16 : progress.current;
    const f = Math.min(3.999, Math.max(0, p * 4));
    const i = Math.floor(f);
    const k = i >= 3 ? 0 : ease(Math.min(1, Math.max(0, (f - i - 0.4) / 0.6)));
    const A = forms[i], B = forms[Math.min(3, i + 1)];
    const wide = w > 767;
    const cx = wide ? w * 0.66 : w * 0.5;
    const cy = wide ? h * 0.5 : h * 0.4;
    const s = wide ? Math.min(w * 0.27, h * 0.4) : Math.min(w * 0.4, h * 0.19);
    for (let n = 0; n < N; n++) {
      const wob = 0.012 + (1 - Math.abs(k - 0.5) * 2) * 0.05;
      const x = A[n][0] + (B[n][0] - A[n][0]) * k + Math.sin(t * 0.9 + n * 1.7) * wob;
      const y = A[n][1] + (B[n][1] - A[n][1]) * k + Math.cos(t * 1.1 + n * 2.3) * wob;
      const size = 0.9 + ((n * 7) % 5) * 0.24;
      ctx.fillStyle = n % 9 === 0 ? `rgba(242, 182, 171, 0.95)` : `rgba(${PAPER}, ${0.35 + ((n * 13) % 10) * 0.06})`;
      ctx.beginPath(); ctx.arc(cx + x * s, cy + y * s, size, 0, 6.283); ctx.fill();
    }
  }).current;
  const ref = useCanvas(draw, setup);
  return <canvas ref={ref} aria-hidden="true" className={className} />;
}

// The hero cloud: one set of points that holds a shape, lets go, and gathers into the next.
// It turns slowly on its own and follows the pointer, so it can be looked at from any side.
const HN = 2600;
let hero = null;
const HOLD = 4.4, MOVE = 2.0;

export function Shapeshifter({ className = "" }) {
  const setup = useRef(() => ({ rx: 0, ry: 0 })).current;
  const draw = useRef((ctx, st, w, h, t, mouse) => {
    if (!hero) hero = heroForms(HN);
    ctx.clearRect(0, 0, w, h);
    const cycle = HOLD + MOVE;
    const i = Math.floor(t / cycle) % hero.length;
    const k = ease(Math.min(1, Math.max(0, ((t % cycle) - HOLD) / MOVE)));
    const A = hero[i], B = hero[(i + 1) % hero.length];
    // Pointer position, -1..1 across the canvas; 0 until the pointer has moved.
    const inside = mouse.x > -9000;
    const mx = inside ? Math.max(-1.5, Math.min(1.5, (mouse.x / w) * 2 - 1)) : 0;
    const my = inside ? Math.max(-1.5, Math.min(1.5, (mouse.y / h) * 2 - 1)) : 0;
    st.ry += (Math.sin(t * 0.3) * 0.5 + mx * 1.1 - st.ry) * 0.05;
    st.rx += (my * 0.6 - st.rx) * 0.05;
    const cy_ = Math.cos(st.ry), sy_ = Math.sin(st.ry), cx_ = Math.cos(st.rx), sx_ = Math.sin(st.rx);
    const s = Math.min(w, h) * 0.36;
    const loose = (1 - Math.abs(k - 0.5) * 2) * 0.22;
    for (let n = 0; n < HN; n++) {
      const a = A[n], b = B[n];
      let x = a[0] + (b[0] - a[0]) * k + Math.sin(t * 0.8 + n * 1.7) * (0.006 + loose * Math.sin(n * 12.9));
      let y = a[1] + (b[1] - a[1]) * k + Math.cos(t * 0.9 + n * 2.3) * (0.006 + loose * Math.cos(n * 7.3));
      let z = a[2] + (b[2] - a[2]) * k + Math.sin(t * 0.7 + n * 3.1) * (0.006 + loose * Math.sin(n * 4.1));
      const x1 = x * cy_ + z * sy_, z1 = -x * sy_ + z * cy_;
      const y1 = y * cx_ - z1 * sx_, z2 = y * sx_ + z1 * cx_;
      const p = 3.2 / (3.2 - z2);
      const depth = Math.max(0, Math.min(1, (z2 + 1.2) / 2.4));
      const rose = n % 11 === 0;
      ctx.fillStyle = rose ? `rgba(226, 110, 98, ${0.5 + depth * 0.5})` : `rgba(116, 21, 22, ${0.16 + depth * 0.62})`;
      ctx.beginPath();
      ctx.arc(w / 2 + x1 * s * p, h / 2 - y1 * s * p, (rose ? 1.5 : 0.8) + depth * 1.1, 0, 6.283);
      ctx.fill();
    }
  }).current;
  const ref = useCanvas(draw, setup);
  return <canvas ref={ref} aria-hidden="true" className={className} />;
}
