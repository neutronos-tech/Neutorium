import { useEffect, useState } from "react";
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
  const [shape, setShape] = useState(0);
  const [note, setNote] = useState(null);
  // The note closes itself after four seconds.
  useEffect(() => {
    if (!note) return;
    const t = setTimeout(() => setNote(null), 4000);
    return () => clearTimeout(t);
  }, [note]);
  // Open the note beside the click, kept inside the section.
  const pick = (e) => {
    const box = e.currentTarget.closest("section").getBoundingClientRect();
    setNote({ i: shape, x: Math.max(16, Math.min(e.clientX - box.left - 140, box.width - 296)), y: Math.max(90, Math.min(e.clientY - box.top + 18, box.height - 220)) });
  };
  const fade = (delay) => ({
    initial: { opacity: 0, y: 16 },
    animate: ready ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 1, ease, delay },
  });

  return (
    <section id="top" className="sunlit relative flex min-h-[100svh] flex-col overflow-hidden">
      <Shapeshifter onShape={(i) => { setShape(i); setNote(null); }} onPick={pick} className="cursor-pointer absolute inset-x-0 top-[30%] h-[34vh] w-full opacity-70 md:inset-y-0 md:left-[40%] md:top-0 md:h-full md:w-[60%] md:opacity-100" />

      {/* Clicking the shape opens a short note on what it stands for. */}
      {note && (
        <motion.button
          key={note.i + "-" + note.x}
          onClick={() => setNote(null)}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease }}
          className="absolute z-10 w-[min(280px,calc(100vw-32px))] rounded-[20px] border border-ink/10 bg-white/95 p-5 text-left shadow-[0_30px_70px_-30px_rgba(116,21,22,0.5)] backdrop-blur-md"
          style={{ left: note.x, top: note.y }}
        >
          <span className="block font-serif text-3xl italic leading-none">{HERO.shapes[note.i][0]}</span>
          <span className="mt-2 block text-sm leading-relaxed text-ink/70">{HERO.shapes[note.i][1]}</span>
        </motion.button>
      )}
      <motion.p {...fade(1.2)} className="label pointer-events-none absolute bottom-24 right-5 hidden text-mute md:right-10 md:block" aria-hidden="true">Click the shape</motion.p>

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
