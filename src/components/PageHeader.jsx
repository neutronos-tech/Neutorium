import { motion } from "motion/react";
import { Lines } from "./Reveal";
import { useReady } from "../lib/ready";

const ease = [0.16, 1, 0.3, 1];

// Opening block for inner pages, in the same type and spacing as the home hero.
export default function PageHeader({ label, lines, text, children }) {
  const ready = useReady();
  const fade = (delay) => ({
    initial: { opacity: 0, y: 16 },
    animate: ready ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 1, ease, delay },
  });

  return (
    <section className="wrap pb-20 pt-32 md:pb-28 md:pt-44">
      <motion.div {...fade(0.1)} className="label flex justify-between text-mute">
        <span>{label}</span>
        <span>Neutorium</span>
      </motion.div>
      <Lines
        as="h1"
        play={ready}
        delay={0.05}
        className="mt-8 text-[clamp(44px,8.4vw,140px)] font-medium leading-[0.92] tracking-[-0.055em]"
        lines={lines}
      />
      {(text || children) && (
        <div className="mt-14 grid gap-10 md:grid-cols-12 md:items-end">
          {text && (
            <motion.p {...fade(0.5)} className="max-w-md text-[15px] leading-relaxed text-ink/70 md:col-span-5">
              {text}
            </motion.p>
          )}
          {children && (
            <motion.div {...fade(0.6)} className="md:col-span-6 md:col-start-7">
              {children}
            </motion.div>
          )}
        </div>
      )}
    </section>
  );
}
