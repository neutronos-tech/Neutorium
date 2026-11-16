import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { animate, stagger } from "animejs";
import { Lines } from "../components/Reveal";
import { useOnView } from "../components/Anime";
import { prefersReduced } from "../lib/smooth";
import { AREAS } from "../data/home";
import { h2 } from "../lib/type";

// Five stairs, climbing left to right. Geometry in SVG units.
const W = 84, H = 48, X0 = 30, BASE = 330, DX = 34, DY = 20;
const sx = (i) => X0 + i * W;
const sy = (i) => BASE - (i + 1) * H;
const front = (i) => `M${sx(i)} ${sy(i)} H${sx(i) + W} V${BASE} H${sx(i)} Z`;
const tread = (i) => `M${sx(i)} ${sy(i)} H${sx(i) + W} L${sx(i) + W + DX} ${sy(i) - DY} H${sx(i) + DX} Z`;
const side = (i) => `M${sx(i) + W} ${sy(i)} L${sx(i) + W + DX} ${sy(i) - DY} V${BASE - DY} L${sx(i) + W} ${BASE} Z`;
// The line a ray of light runs along: up each riser, across each tread.
const profile = "M" + X0 + " " + BASE + AREAS.map((_, i) => ` V${sy(i)} H${sx(i) + W}`).join("");
const HOLD = 3200;

export default function Areas() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [built, setBuilt] = useState(false);
  const still = prefersReduced();
  const svg = useRef(null);

  // The stairs rise one at a time, slowly (anime.js), then the ray starts to run.
  const build = useCallback((el) => {
    animate(el.querySelectorAll(".stair"), {
      translateY: [70, 0],
      opacity: [0, 1],
      delay: stagger(320),
      duration: 1400,
      ease: "outExpo",
      onComplete: () => setBuilt(true),
    });
  }, []);
  useOnView(svg, build, 0.4);

  // Each stair takes its turn. Resting the pointer anywhere on the section holds it there.
  useEffect(() => {
    if (still || !built || paused) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % AREAS.length), HOLD);
    return () => clearTimeout(t);
  }, [active, paused, built, still]);

  const hold = { onMouseEnter: () => setPaused(true), onMouseLeave: () => setPaused(false) };

  return (
    <section id="layers" className="living-night relative overflow-hidden text-paper">
      <div className="wrap relative py-24 md:py-36">
        <Lines className={h2} lines={["The future you imagine", <span className="text-paper/45">may already exist.</span>]} />
        <p className="mt-8 max-w-md text-[15px] leading-relaxed text-paper/70">
          Others have already built what you aspire to, one step at a time. Each step rests on the one before it.
        </p>

        <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-12 md:items-center" {...hold}>
          <div className="md:col-span-7">
            <svg ref={svg} viewBox="0 0 520 380" className="block w-full overflow-visible" role="group" aria-label="Five steps, climbing">
              <defs>
                <filter id="stair-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="14" />
                </filter>
                <filter id="ray-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="b" />
                  <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <linearGradient id="tread-lit" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#fff" />
                  <stop offset="1" stopColor="var(--color-ember)" />
                </linearGradient>
              </defs>

              {AREAS.map((a, i) => {
                const on = i === active;
                return (
                  <g key={a.name} className="stair" style={still ? undefined : { opacity: 0 }}>
                    <g
                      role="button"
                      tabIndex={0}
                      aria-pressed={on}
                      aria-label={a.name}
                      onMouseEnter={() => setActive(i)}
                      onClick={() => setActive(i)}
                      onFocus={() => { setActive(i); setPaused(true); }}
                      onBlur={() => setPaused(false)}
                      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setActive(i)}
                      className="cursor-pointer outline-none"
                    >
                      <rect x={sx(i) - 6} y={sy(i) - 18} width={W + 30} height="40" rx="20" fill="var(--color-ember)" filter="url(#stair-glow)" style={{ opacity: on ? 0.9 : 0, transition: "opacity 1s" }} />
                      {i === AREAS.length - 1 && <path d={side(i)} fill="var(--color-paper)" fillOpacity={on ? 0.55 : 0.05} stroke="var(--color-paper)" strokeOpacity="0.3" style={{ transition: "fill-opacity .8s" }} />}
                      <path d={front(i)} fill="var(--color-paper)" fillOpacity={on ? 0.92 : 0.04} stroke="var(--color-paper)" strokeOpacity={on ? 1 : 0.3} style={{ transition: "fill-opacity .8s, stroke-opacity .8s" }} />
                      <path d={tread(i)} fill={on ? "url(#tread-lit)" : "var(--color-paper)"} fillOpacity={on ? 1 : 0.1} stroke="var(--color-paper)" strokeOpacity={on ? 0.9 : 0.3} style={{ transition: "fill-opacity .8s" }} />
                      <text x={sx(i) + W / 2} y={sy(i) + 28} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="12" fill={on ? "var(--color-night)" : "var(--color-paper)"} fillOpacity={on ? 1 : 0.6} style={{ transition: "fill .8s" }}>
                        0{i + 1}
                      </text>
                    </g>
                  </g>
                );
              })}

              {!still && built && (
                <path d={profile} fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" pathLength="100" strokeDasharray="9 91" filter="url(#ray-glow)" className="pointer-events-none">
                  <animate attributeName="stroke-dashoffset" from="100" to="0" dur="4.5s" repeatCount="indefinite" />
                </path>
              )}
            </svg>
          </div>

          <ul className="border-t border-paper/15 md:col-span-5">
            {AREAS.map((a, i) => {
              const on = i === active;
              return (
                <li key={a.name} className="relative border-b border-paper/15">
                  <button onClick={() => setActive(i)} onMouseEnter={() => setActive(i)} aria-expanded={on} className="flex min-h-[52px] w-full items-center gap-4 py-3 text-left">
                    <span className={"font-mono text-xs transition-colors duration-300 " + (on ? "text-ember" : "text-paper/45")}>0{i + 1}</span>
                    <span className={"flex-1 text-xl tracking-[-0.02em] transition-all duration-500 ease-out-expo md:text-2xl " + (on ? "translate-x-1" : "text-paper/55")}>{a.name}</span>
                  </button>
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="pb-2 pl-9 font-serif text-[clamp(22px,2vw,30px)] leading-[1.15]">{a.problem}</p>
                        <ul className="flex flex-wrap gap-2 pb-6 pl-9 pt-3">
                          {a.work.map((c) => (
                            <li key={c} className="rounded-full border border-paper/25 px-3 py-1 text-[13px] text-paper/85">{c}</li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {/* How long this step has left before the next one takes over. */}
                  {on && !still && built && (
                    <span key={active + "-" + paused} className="hold-line absolute bottom-[-1px] left-0 h-px w-full origin-left bg-ember" style={{ animationDuration: HOLD + "ms", animationPlayState: paused ? "paused" : "running" }} />
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
