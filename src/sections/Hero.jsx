import { lazy, Suspense } from "react";
import { motion } from "motion/react";
import { Lines } from "../components/Reveal";
import { scrollTo } from "../lib/smooth";

const DotField = lazy(() => import("../components/DotField"));
const SplineScene = lazy(() => import("../components/SplineScene"));
const SPLINE = import.meta.env.VITE_SPLINE_SCENE;
const ease = [0.16, 1, 0.3, 1];

const stats = [
  ["15", "Partners per industry, never more"],
  ["01", "Industry in focus at a time"],
  ["R&D", "Research behind every engagement"],
];

export default function Hero({ ready }) {
  const fade = (delay) => ({
    initial: { opacity: 0, y: 16 },
    animate: ready ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 1, ease, delay },
  });

  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden pt-28 md:pt-36">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%] md:h-[70%]">
        <Suspense fallback={null}>
          {SPLINE ? <SplineScene scene={SPLINE} /> : <DotField />}
        </Suspense>
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-paper to-transparent" />
      </div>

      <div className="wrap relative flex flex-1 flex-col">
        <motion.div {...fade(0.1)} className="label flex justify-between text-mute">
          <span>Research &amp; partnership studio</span>
          <span>(2026)</span>
        </motion.div>

        <Lines
          as="h1"
          play={ready}
          delay={0.05}
          className="mt-8 text-[clamp(44px,8.4vw,140px)] font-medium leading-[0.92] tracking-[-0.055em]"
          lines={[
            "We research",
            <>what's <em className="font-serif font-normal tracking-[-0.02em]">next.</em></>,
            <span className="text-mute">Then we build</span>,
            <span className="text-mute">it with you.</span>,
          ]}
        />

        <div className="mt-auto grid grid-cols-1 gap-10 pb-8 pt-16 md:grid-cols-12 md:items-end">
          <motion.p {...fade(0.5)} className="max-w-sm text-[15px] leading-relaxed text-ink/70 md:col-span-4">
            Neutronos studies industries, finds the opportunities worth chasing, and partners
            with fifteen companies at a time to turn them into results.
          </motion.p>

          <div className="grid grid-cols-3 gap-4 md:col-span-6 md:col-start-6">
            {stats.map(([n, t], i) => (
              <motion.div key={n} {...fade(0.6 + i * 0.08)} className="border-t border-ink/15 pt-3">
                <div className="text-2xl font-medium tracking-[-0.03em] md:text-3xl">{n}</div>
                <div className="mt-1 text-xs leading-snug text-mute md:text-sm">{t}</div>
              </motion.div>
            ))}
          </div>

          <motion.button
            {...fade(0.9)}
            onClick={() => scrollTo("#manifesto")}
            className="label hidden items-center justify-end gap-2 text-mute md:col-span-1 md:col-start-12 md:flex"
          >
            Scroll <span className="scroll-line" />
          </motion.button>
        </div>
      </div>
    </section>
  );
}
