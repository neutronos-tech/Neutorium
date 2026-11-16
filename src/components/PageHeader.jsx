import { motion } from "motion/react";
import { Lines } from "./Reveal";
import { useReady } from "../lib/ready";

const ease = [0.16, 1, 0.3, 1];

// Opening block for inner pages: a still, spacious title, then one white block that holds the
// summary on the left and the page's own links or chips on the right.
export default function PageHeader({ label, lines, text, children }) {
  const ready = useReady();
  const fade = (delay) => ({
    initial: { opacity: 0, y: 16 },
    animate: ready ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 1, ease, delay },
  });

  return (
    <section className="sunlit relative overflow-hidden">
      <div className="wrap relative pb-14 pt-32 md:pb-20 md:pt-44">
        <div className="mx-auto w-full max-w-[1180px]">
          <motion.p {...fade(0.1)} className="label text-mute">{label}</motion.p>
          <Lines
            as="h1"
            play={ready}
            delay={0.05}
            className="mt-6 text-[clamp(40px,6.6vw,108px)] font-medium leading-[0.95] tracking-[-0.05em]"
            lines={lines}
          />
          {(text || children) && (
            <motion.div {...fade(0.5)} className="mt-12 grid gap-8 rounded-[28px] border border-ink/10 bg-white/80 p-7 backdrop-blur-sm md:mt-16 md:grid-cols-12 md:items-center md:p-10">
              {text && <p className="max-w-lg text-base leading-relaxed text-ink/75 md:col-span-6 md:text-lg">{text}</p>}
              {children && <div className="md:col-span-5 md:col-start-8">{children}</div>}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
