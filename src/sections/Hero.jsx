import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Lines } from "../components/Reveal";
import { Arrow } from "../components/Icons";
import { Ticker } from "../components/Motion";
import { Shapeshifter } from "../components/Art";
import { scrollTo } from "../lib/smooth";
import { useReady } from "../lib/ready";
import { HERO, MARQUEE } from "../data/home";

const ease = [0.16, 1, 0.3, 1];

// One calm screen: a short claim on the left, and on the right a cloud of points that keeps
// becoming something else (a brain, a neuron, a network, DNA, a growth chart). The capabilities
// drift along the bottom edge of the same section.
export default function Hero() {
  const ready = useReady();
  const fade = (delay) => ({
    initial: { opacity: 0, y: 16 },
    animate: ready ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 1, ease, delay },
  });

  return (
    <section id="top" className="sunlit relative flex min-h-[100svh] flex-col overflow-hidden">
      <Shapeshifter className="absolute inset-x-0 top-[30%] h-[34vh] w-full opacity-70 md:inset-y-0 md:left-[40%] md:top-0 md:h-full md:w-[60%] md:opacity-100" />

      <div className="wrap pointer-events-none relative flex flex-1 flex-col justify-center pb-10 pt-28 md:pt-36">
        <div className="mx-auto w-full max-w-[1180px]">
          <Lines
            as="h1"
            play={ready}
            delay={0.05}
            className="text-[clamp(44px,min(8vw,13vh),132px)] font-medium leading-[0.94] tracking-[-0.05em]"
            lines={HERO.lines.map(([text, tone], i) =>
              tone === "serif" ? <span key={i}>{text[0]} <em className="font-serif font-normal tracking-[-0.02em]">{text[1]}</em></span> : text
            )}
          />

          <motion.p {...fade(0.5)} className="mt-[36vh] max-w-xs text-base leading-relaxed text-ink/75 md:mt-10 md:text-lg">
            {HERO.line}
          </motion.p>

          <motion.div {...fade(0.65)} className="pointer-events-auto mt-7 flex flex-wrap items-center gap-x-7 gap-y-3">
            <Link
              to="/start"
              className="group inline-flex h-14 items-center gap-3 rounded-full bg-ink px-7 text-paper transition-transform duration-300 ease-out-expo hover:-translate-y-0.5 active:translate-y-0"
            >
              Start a conversation
              <Arrow className="h-4 w-4 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
            </Link>
            <button onClick={() => scrollTo("#approach")} className="nav-link py-3 text-sm">See how it works</button>
          </motion.div>
        </div>
      </div>

      <motion.div {...fade(0.9)} className="relative border-t border-ink/10 py-5" aria-label="Capabilities">
        <Ticker speed={2.2}>
          <div className="flex items-center gap-10 pr-10">
            {MARQUEE.map((w) => (
              <span key={w} className="flex items-center gap-10 text-[clamp(20px,2.4vw,34px)] font-light tracking-[-0.03em] text-ink/80">
                {w}
                <span className="h-1.5 w-1.5 rounded-full bg-ink/40" />
              </span>
            ))}
          </div>
        </Ticker>
      </motion.div>
    </section>
  );
}
