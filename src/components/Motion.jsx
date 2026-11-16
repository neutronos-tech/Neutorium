import { useLayoutEffect, useRef } from "react";
import { motion, useScroll, useVelocity, useSpring, useTransform, useMotionValue, useAnimationFrame } from "motion/react";
import { gsap, prefersReduced } from "../lib/smooth";

// A row that drifts sideways on its own and speeds up, leans and reverses with the scroll.
export function Ticker({ children, speed = 3, reverse = false, className = "" }) {
  const still = prefersReduced();
  const x = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const boost = useTransform(velocity, [-2000, 0, 2000], [-4, 0, 4], { clamp: false });
  const skew = useTransform(velocity, [-2500, 0, 2500], [6, 0, -6]);
  const dir = useRef(reverse ? 1 : -1);
  const paused = useRef(false);

  useAnimationFrame((_, delta) => {
    if (still || paused.current) return;
    const b = boost.get();
    if (b < -0.2) dir.current = reverse ? -1 : 1;
    else if (b > 0.2) dir.current = reverse ? 1 : -1;
    let next = x.get() + dir.current * (speed + Math.abs(b) * speed) * (delta / 1000);
    // The content is rendered twice, so one copy is 50% of the track.
    if (next <= -50) next += 50;
    if (next >= 0) next -= 50;
    x.set(next);
  });

  const tx = useTransform(x, (v) => v + "%");
  return (
    <div
      className={"overflow-hidden " + className}
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
    >
      <motion.div className="flex w-max will-change-transform" style={{ x: tx, skewX: still ? 0 : skew }}>
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden="true">{children}</div>
      </motion.div>
    </div>
  );
}

// Words that light up one by one as the block scrolls through the screen.
export function Scrub({ text, className = "", dim = 0.14 }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    if (prefersReduced()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".sw",
        { opacity: dim },
        { opacity: 1, stagger: 0.05, ease: "none", scrollTrigger: { trigger: ref.current, start: "top 80%", end: "bottom 55%", scrub: true } }
      );
    }, ref);
    return () => ctx.revert();
  }, [dim]);
  return (
    <p ref={ref} className={className}>
      {text.split(" ").map((w, i) => (
        <span key={i} className="sw mr-[0.25em] inline-block">{w}</span>
      ))}
    </p>
  );
}

// A dark band that rises into place: it starts inset with round corners and opens to full width.
export function Curtain({ children, className = "", id }) {
  const ref = useRef(null);
  const inner = useRef(null);
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        inner.current,
        { scale: 0.9, borderRadius: 56 },
        { scale: 1, borderRadius: 0, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "top 25%", scrub: true } }
      );
    });
    return () => mm.revert();
  }, []);
  return (
    <section id={id} ref={ref} className="overflow-hidden">
      <div ref={inner} className={"origin-top overflow-hidden will-change-transform " + className}>{children}</div>
    </section>
  );
}

// Lets a card show a soft light that follows the pointer (see .spot in index.css).
export const spot = (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", e.clientX - r.left + "px");
  e.currentTarget.style.setProperty("--my", e.clientY - r.top + "px");
};
