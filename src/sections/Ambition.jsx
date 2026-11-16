import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Lines, Rise } from "../components/Reveal";
import { spot } from "../components/Motion";
import { Arrow, Check } from "../components/Icons";
import { AMBITIONS } from "../data/home";
import { h2 } from "../lib/type";

// Visitors pick the ambitions that sound like them; the choice is carried into the first conversation.
export default function Ambition({ n = "02" }) {
  const [picked, setPicked] = useState([]);
  const toggle = (i) => setPicked((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i].sort((a, b) => a - b)));
  const count = picked.length;

  return (
    <section id="ambition" className="wrap border-t border-line py-24 md:py-40">
      <div className="grid gap-10 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <p className="label text-mute">Your ambition</p>
          <Lines className={h2} lines={["Where do you see", "your business in", <span className="text-mute">five to ten years?</span>]} />
        </div>
        <Rise className="max-w-md text-[15px] leading-relaxed text-ink/70 md:col-span-4 md:col-start-9">
          Every business defines growth differently. Pick the ambitions that sound like yours. They overlap, and
          few weigh them equally.
        </Rise>
      </div>

      <ul className="mt-14 grid border-l border-t border-line sm:grid-cols-2 lg:grid-cols-4">
        {AMBITIONS.map(([title, text], i) => {
          const on = picked.includes(i);
          return (
            <motion.li
              key={title}
              className="border-b border-r border-line"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: (i % 4) * 0.07 }}
            >
              <button
                onClick={() => toggle(i)}
                onMouseMove={spot}
                aria-pressed={on}
                className={
                  "spot group relative isolate flex h-full min-h-[190px] w-full flex-col justify-between overflow-hidden p-6 text-left transition-colors duration-500 md:min-h-[240px] md:p-7 " +
                  (on ? "spot-dark text-paper" : "")
                }
              >
                <span
                  className={
                    "absolute inset-0 -z-10 origin-bottom bg-ink transition-transform duration-700 ease-out-expo " +
                    (on ? "scale-y-100" : "scale-y-0")
                  }
                />
                <span className="relative flex items-center justify-between">
                  <span className={"font-mono text-xs " + (on ? "text-paper/60" : "text-mute")}>{String(i + 1).padStart(2, "0")}</span>
                  <span
                    className={
                      "grid h-7 w-7 place-items-center rounded-full border transition-colors duration-500 " +
                      (on ? "border-paper bg-paper text-ink" : "border-ink/25 text-transparent group-hover:border-ink")
                    }
                  >
                    <Check className="h-3.5 w-3.5" />
                  </span>
                </span>
                <span className="relative">
                  <span className="block text-2xl leading-[1.05] tracking-[-0.03em] md:text-[28px]">{title}</span>
                  <span className={"mt-3 block text-sm leading-relaxed " + (on ? "text-paper/70" : "text-ink/60")}>{text}</span>
                </span>
              </button>
            </motion.li>
          );
        })}
      </ul>

      <div aria-live="polite" className="mt-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <p className="flex items-baseline gap-4">
          <span className="text-5xl font-light tracking-[-0.05em] tabular-nums">
            {String(count).padStart(2, "0")}
            <span className="text-mute">/{String(AMBITIONS.length).padStart(2, "0")}</span>
          </span>
          <span className="max-w-md text-sm leading-relaxed text-ink/60">
            {count ? picked.map((i) => AMBITIONS[i][0]).join(" · ") : "Nothing chosen yet. Tap an ambition to add it."}
          </span>
        </p>
        <Link
          to="/start"
          state={{ ambitions: picked.map((i) => AMBITIONS[i][0]) }}
          className={
            "group inline-flex h-12 items-center gap-3 self-start rounded-full border border-ink px-6 text-sm transition-colors duration-500 md:self-auto " +
            (count ? "bg-ink text-paper" : "hover:bg-ink hover:text-paper")
          }
        >
          {count ? "Start a conversation about these" : "Start a conversation"}
          <Arrow className="h-4 w-4 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
