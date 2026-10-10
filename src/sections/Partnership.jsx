import { useLayoutEffect, useRef, useState } from "react";
import { gsap, prefersReduced } from "../lib/smooth";
import { Lines } from "../components/Reveal";
import { INDUSTRIES, SEATS_PER_INDUSTRY } from "../data/site";

const points = [
  ["Integrated, not outsourced", "We join your team's rhythm, tools, and goals as a true partner."],
  ["One monthly engagement", "A predictable monthly fee for a defined scope. No surprise invoices."],
  ["Industry-level insight", "Research compounds across the group, never your private data."],
  ["Capped by design", "When fifteen seats fill, new companies join a waiting list."],
];

// Seat counts come from data/site.js and are always the real number, never a countdown.
export default function Partnership({ n = "03" }) {
  const ref = useRef(null);
  const countRef = useRef(null);
  const [active, setActive] = useState(0);
  const industry = INDUSTRIES[active];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const fills = gsap.utils.toArray(".seat-fill");
      const target = industry.filled;
      const pad = (v) => String(Math.round(v)).padStart(2, "0");
      if (prefersReduced() || !fills.length) {
        countRef.current.textContent = pad(target);
        return;
      }
      const o = { v: 0 };
      const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: "top 60%", once: true } });
      tl.fromTo(fills, { scale: 0 }, { scale: 1, ease: "power3.out", duration: 0.6, stagger: 0.08 });
      tl.to(o, { v: target, duration: 0.6 + fills.length * 0.08, ease: "none", onUpdate: () => (countRef.current.textContent = pad(o.v)) }, 0);
    }, ref);
    return () => ctx.revert();
  }, [industry]);

  const open = SEATS_PER_INDUSTRY - industry.filled;

  return (
    <section id="partnership" ref={ref} className="relative border-t border-line py-24 md:py-40">
      <div className="wrap grid gap-16 md:grid-cols-12">
        <div className="md:col-span-6">
          <p className="label text-mute">({n}) Partnership model</p>
          <Lines
            className="mt-6 text-[clamp(40px,5.6vw,92px)] font-medium leading-[0.95] tracking-[-0.05em]"
            lines={["Fifteen partners.", "Per industry.", <span className="text-mute">Full attention.</span>]}
          />
          <p className="mt-8 max-w-lg text-[15px] leading-relaxed text-ink/70">
            For every industry we enter, we open exactly fifteen partner seats. Fifteen is small enough to
            know every business deeply and large enough for the research to compound. We open new industries
            as we grow, never faster than we can serve them.
          </p>
          <dl className="mt-10 grid gap-6 sm:grid-cols-2">
            {points.map(([t, d]) => (
              <div key={t} className="border-t border-ink/15 pt-4">
                <dt className="font-medium">{t}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-mute">{d}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="md:col-span-5 md:col-start-8 md:self-center">
          <div className="mb-6 flex flex-wrap gap-2">
            {INDUSTRIES.map((ind, i) => (
              <button
                key={ind.slug}
                onClick={() => setActive(i)}
                className={
                  "rounded-full border px-4 py-2 text-sm transition-colors duration-500 " +
                  (i === active ? "border-ink bg-ink text-paper" : "border-ink/15 hover:border-ink/40")
                }
              >
                {ind.name}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-5 gap-3 md:gap-4">
            {Array.from({ length: SEATS_PER_INDUSTRY }).map((_, i) => (
              <div key={i} className="relative aspect-square rounded-full border border-ink/15">
                {i < industry.filled && <span className="seat-fill absolute inset-[18%] rounded-full bg-ink" />}
              </div>
            ))}
          </div>
          <div className="mt-8 flex items-end justify-between border-t border-ink/15 pt-4">
            <span className="label text-mute">
              {industry.status === "waitlist" || open <= 0 ? "Waiting list open" : `Seats filled · ${open} open`}
            </span>
            <span className="text-5xl font-light tracking-[-0.05em] tabular-nums">
              <span ref={countRef}>{String(industry.filled).padStart(2, "0")}</span>
              <span className="text-mute">/{SEATS_PER_INDUSTRY}</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
