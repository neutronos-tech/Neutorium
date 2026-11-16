import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import { prefersReduced } from "../lib/smooth";

// Runs `play` once, the first time the element is properly on screen.
export function useOnView(ref, play, amount = 0.3) {
  useEffect(() => {
    if (prefersReduced()) return;
    const el = ref.current;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        play(el);
      },
      { threshold: amount }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, play, amount]);
}

const rise = (el) =>
  animate(el.querySelectorAll(".ch"), {
    translateY: ["110%", "0%"],
    rotate: [8, 0],
    delay: stagger(24),
    duration: 1100,
    ease: "outExpo",
  });

// Heading whose letters rise into place one after another (anime.js).
// `lines` is an array of [text, className] pairs.
export function Letters({ as: Tag = "h2", lines, className = "" }) {
  const ref = useRef(null);
  const still = prefersReduced();
  useOnView(ref, rise);
  return (
    <Tag ref={ref} className={className} aria-label={lines.map(([t]) => t).join(" ")}>
      {lines.map(([text, cls = ""], i) => (
        <span key={i} aria-hidden="true" className={"block overflow-hidden pb-[0.12em] " + cls}>
          {text.split(" ").map((word, w) => (
            <span key={w} className="mr-[0.24em] inline-block whitespace-nowrap">
              {[...word].map((c, k) => (
                <span key={k} className="ch inline-block origin-bottom-left" style={still ? undefined : { transform: "translateY(110%)" }}>
                  {c}
                </span>
              ))}
            </span>
          ))}
        </span>
      ))}
    </Tag>
  );
}
