import { useLayoutEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { gsap, ScrollTrigger, prefersReduced } from "../lib/smooth";
import { STEPS, PROBLEMS } from "../data/home";
import { Lines, Rise } from "../components/Reveal";
import { Arrow } from "../components/Icons";
import { Morph } from "../components/Art";
import { h2 } from "../lib/type";

const ease = [0.16, 1, 0.3, 1];

// Four steps. On wide screens the section holds still while one cloud of points reshapes
// itself for each step; on phones the art loops on its own above a plain list.
export default function Approach({ n = "05" }) {
  const sec = useRef(null);
  const bar = useRef(null);
  const progress = useRef(0);
  const [step, setStep] = useState(0);
  const [pinned, setPinned] = useState(false);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      setPinned(true);
      const st = ScrollTrigger.create({
        trigger: sec.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          progress.current = self.progress;
          if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
          setStep(Math.min(STEPS.length - 1, Math.floor(self.progress * STEPS.length)));
        },
      });
      return () => { st.kill(); setPinned(false); };
    });
    return () => mm.revert();
  }, []);

  const [title, text] = STEPS[step];

  return (
    <section id="approach" ref={sec} className="living-night pin-long relative text-paper">
      <div className="pin-inner relative overflow-hidden">
        <Morph progress={progress} auto={!pinned} className={pinned ? "absolute inset-0 h-full w-full" : "absolute inset-x-0 top-0 h-[52vh] w-full md:h-full"} />

        <div className={"wrap relative flex h-full flex-col " + (pinned ? "justify-between pb-8 pt-24 md:pb-12 md:pt-28" : "pb-16 pt-[54vh] md:pb-12 md:pt-28")}>
          <div>
            <p className="label text-paper/50">How it works</p>
            <h2 className="mt-4 text-[clamp(32px,5.6vw,92px)] font-medium leading-[0.95] tracking-[-0.05em] md:mt-6">
              Understand first,
              <br />
              <span className="text-paper/40">then build.</span>
            </h2>
          </div>

          {pinned ? (
            <div>
              <div className="grid items-end gap-8 md:grid-cols-12">
                <div className="min-h-[170px] md:col-span-5 md:min-h-[190px]" aria-live="polite">
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease }}
                    >
                      <p className="font-mono text-xs text-paper/50">Step 0{step + 1} of 0{STEPS.length}</p>
                      <h3 className="mt-3 font-serif text-[clamp(52px,7vw,120px)] italic leading-[0.95] text-ember">{title}</h3>
                      <p className="mt-3 max-w-md text-base leading-relaxed text-paper/80 md:mt-4 md:text-lg">{text}</p>
                    </motion.div>
                </div>
              </div>
              <ol className="mt-6 grid grid-cols-4 gap-2 md:mt-10 md:gap-4" aria-hidden="true">
                {STEPS.map(([t], i) => (
                  <li key={t} className={"border-t pt-3 text-[11px] transition-colors duration-500 sm:text-sm " + (i <= step ? "border-paper text-paper" : "border-paper/20 text-paper/40")}>
                    <span className="mr-2 hidden font-mono text-[11px] sm:inline">0{i + 1}</span>
                    {t}
                  </li>
                ))}
              </ol>
              <div className="mt-4 h-px w-full bg-paper/15" aria-hidden="true">
                <div ref={bar} className="h-px origin-left bg-ember" style={{ transform: "scaleX(0)" }} />
              </div>
            </div>
          ) : (
            <ol className="mt-12 border-t border-paper/15">
              {STEPS.map(([t, d], i) => (
                <li key={t} className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-paper/15 py-6">
                  <span className="pt-2 font-mono text-xs text-paper/50">0{i + 1}</span>
                  <div>
                    <h3 className="font-serif text-4xl italic">{t}</h3>
                    <p className="mt-2 max-w-md leading-relaxed text-paper/70">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </section>
  );
}

// What a business tells us on the left, where the work usually starts on the right.
// On wide screens the rows take their turn as the page scrolls, and the pointer can hold one.
// On phones every pair is simply shown.
export function Matcher() {
  const [active, setActive] = useState(0);
  const list = useRef(null);
  const hovering = useRef(false);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const st = ScrollTrigger.create({
        trigger: list.current,
        start: "top 72%",
        end: "bottom 42%",
        onUpdate: (self) => {
          if (hovering.current) return;
          setActive(Math.min(PROBLEMS.length - 1, Math.floor(self.progress * PROBLEMS.length)));
        },
      });
      return () => st.kill();
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="solutions" className="wrap py-24 md:py-40">
      <div className="grid gap-10 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <Lines className={h2} lines={["Start from the problem,", <span className="text-mute">not the service list.</span>]} />
        </div>
        <Rise className="max-w-md text-[15px] leading-relaxed text-ink/70 md:col-span-4 md:col-start-9">
          Content, websites, ads and software are activities, not outcomes. Their value depends on meeting a real
          need for the right audience.
        </Rise>
      </div>

      <ul
        ref={list}
        className="mt-14 grid gap-3 lg:block lg:border-t lg:border-line"
        onMouseEnter={() => (hovering.current = true)}
        onMouseLeave={() => (hovering.current = false)}
      >
        {PROBLEMS.map(([problem, solution], i) => {
          const on = i === active;
          return (
            <li key={problem} className="rounded-[22px] border border-ink/10 bg-white p-6 lg:rounded-none lg:border-0 lg:border-b lg:border-line lg:bg-transparent lg:p-0">
              <div
                onMouseEnter={() => setActive(i)}
                className="grid items-center gap-3 lg:grid-cols-[1fr_minmax(80px,1fr)_1fr] lg:gap-6 lg:py-9"
              >
                <p className={"text-[22px] leading-[1.15] tracking-[-0.03em] transition-all duration-500 ease-out-expo lg:text-[32px] lg:leading-[1.05] " + (on ? "lg:translate-x-2" : "lg:text-ink/40")}>
                  {problem}
                </p>
                <span className="hidden items-center lg:flex" aria-hidden="true">
                  <span className={"h-px flex-1 origin-left bg-ink transition-transform duration-700 ease-out-expo " + (on ? "scale-x-100" : "scale-x-0")} />
                  <Arrow className={"h-5 w-5 transition-opacity duration-500 " + (on ? "opacity-100 delay-300" : "opacity-0")} />
                </span>
                <p className={"flex items-center gap-3 text-lg tracking-[-0.02em] transition-all duration-500 lg:text-[26px] lg:leading-[1.1] " + (on ? "" : "lg:-translate-x-3 lg:opacity-0")}>
                  <Arrow className="h-4 w-4 shrink-0 text-mute lg:hidden" />
                  <em className="font-serif text-[1.2em] font-normal italic">{solution}</em>
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
