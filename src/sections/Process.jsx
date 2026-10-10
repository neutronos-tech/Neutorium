import { useLayoutEffect, useRef } from "react";
import { gsap } from "../lib/smooth";

const steps = [
  ["Snapshot", "Before any pitch, a free review of your online presence: three strengths and three specific gaps."],
  ["Research", "Days 1 to 14. Competitor scan, positioning, ideal-customer profile and baseline metrics."],
  ["Launch", "By Day 30. Your website goes live and the 90-day content calendar is approved."],
  ["Content & capture", "Days 31 to 60. Premium reels and long-form films, plus an inquiry system live by Day 45."],
  ["Final build", "Days 61 to 90. A second content set shaped by the first, and the final animated website."],
  ["Review & renew", "Day 90. Results against the baseline, then advanced services for long-term partners."],
];

export default function Process({ n = "06" }) {
  const sec = useRef(null);
  const track = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.to(track.current, {
        x: () => -(track.current.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: sec.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="process" ref={sec} className="h-scroll relative bg-ink text-paper">
      <div className="h-scroll-inner flex flex-col justify-center py-24 md:py-0">
        <div className="wrap mb-12 flex items-end justify-between">
          <div>
            <p className="label text-paper/50">({n}) Process</p>
            <h2 className="mt-6 text-[clamp(40px,5.6vw,92px)] font-medium leading-[0.95] tracking-[-0.05em]">
              How a partnership
              <br />
              <span className="text-paper/40">runs.</span>
            </h2>
          </div>
          <p className="label hidden items-center gap-2 text-paper/50 md:flex">
            Keep scrolling <span className="scroll-line" />
          </p>
        </div>

        <div ref={track} className="h-scroll-track px-5 md:px-10">
          {steps.map(([title, desc], i) => (
            <article
              key={title}
              className="h-scroll-card flex min-h-[300px] shrink-0 flex-col justify-between rounded-[28px] border border-paper/15 p-8 transition-colors duration-500 hover:bg-paper/5 md:p-10"
            >
              <span className="text-[clamp(64px,8vw,140px)] font-light leading-none tracking-[-0.06em]">0{i + 1}</span>
              <div>
                <h3 className="text-3xl tracking-[-0.03em]">{title}</h3>
                <p className="mt-3 max-w-sm leading-relaxed text-paper/60">{desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
