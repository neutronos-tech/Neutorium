import { useLayoutEffect, useRef } from "react";
import { gsap, prefersReduced } from "../lib/smooth";
import { Lines } from "../components/Reveal";

const points = [
  ["Integrated, not outsourced", "We join your team's rhythm, tools, and goals as a true partner."],
  ["One subscription", "Partners pay a predictable subscription. No surprise invoices."],
  ["Industry-level insight", "Research compounds across the cohort, never your private data."],
  ["Capped by design", "When fifteen seats fill, the cohort closes."],
];

export default function Partnership() {
  const ref = useRef(null);
  const countRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const fills = gsap.utils.toArray(".seat-fill");
      if (prefersReduced()) {
        gsap.set(fills, { scale: 1 });
        countRef.current.textContent = "15";
        return;
      }
      gsap.fromTo(
        fills,
        { scale: 0 },
        {
          scale: 1,
          ease: "power3.out",
          duration: 0.6,
          stagger: 0.12,
          scrollTrigger: {
            trigger: ref.current,
            start: "top 40%",
            end: "bottom bottom",
            scrub: 0.6,
            onUpdate: () => {
              const n = fills.filter((f) => gsap.getProperty(f, "scale") > 0.98).length;
              countRef.current.textContent = String(n).padStart(2, "0");
            },
          },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="partnership" ref={ref} className="relative border-t border-line md:h-[260vh]">
      <div className="py-24 md:sticky md:top-0 md:flex md:h-screen md:items-center md:py-0">
        <div className="wrap grid gap-16 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="label text-mute">(03) Partnership model</p>
            <Lines
              className="mt-6 text-[clamp(40px,5.6vw,92px)] font-medium leading-[0.95] tracking-[-0.05em]"
              lines={["Fifteen partners.", "One industry.", <span className="text-mute">Full attention.</span>]}
            />
            <p className="mt-8 max-w-lg text-[15px] leading-relaxed text-ink/70">
              Each season we commit to a single industry and open exactly fifteen partner seats
              inside it. Fifteen is small enough to know every business deeply and large enough
              for the research to compound.
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
            <div className="grid grid-cols-5 gap-3 md:gap-4">
              {Array.from({ length: 15 }).map((_, i) => (
                <div key={i} className="relative aspect-square rounded-full border border-ink/15">
                  <span className="seat-fill absolute inset-[18%] rounded-full bg-ink" />
                </div>
              ))}
            </div>
            <div className="mt-8 flex items-end justify-between border-t border-ink/15 pt-4">
              <span className="label text-mute">Seats in the current cohort</span>
              <span className="text-5xl font-light tracking-[-0.05em] tabular-nums">
                <span ref={countRef}>00</span>
                <span className="text-mute">/15</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
