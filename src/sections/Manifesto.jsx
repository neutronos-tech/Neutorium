import { useLayoutEffect, useRef } from "react";
import { gsap, prefersReduced } from "../lib/smooth";

const text =
  "Most firms spread themselves across every market. We do the opposite. We study each industry deeply, choose fifteen companies inside it, and work as their partner until the research turns into results.";

export default function Manifesto() {
  const ref = useRef(null);

  useLayoutEffect(() => {
    if (prefersReduced()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".mw",
        { opacity: 0.12 },
        {
          opacity: 1,
          stagger: 0.05,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top 75%", end: "bottom 55%", scrub: true },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="manifesto" ref={ref} className="wrap py-32 md:py-48">
      <p className="label mb-10 text-mute">(01) Manifesto</p>
      <p className="max-w-[24ch] text-[clamp(30px,4.6vw,76px)] font-light leading-[1.06] tracking-[-0.035em]">
        {text.split(" ").map((w, i) => (
          <span key={i} className="mw mr-[0.25em] inline-block">{w}</span>
        ))}
      </p>
    </section>
  );
}
