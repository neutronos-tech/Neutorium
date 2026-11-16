import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Lines, Rise } from "../components/Reveal";
import { Arrow, Check } from "../components/Icons";
import { spot } from "../components/Motion";
import { Letters } from "../components/Anime";
import { ENGAGEMENTS, RESPONSIBILITIES, CHOICE, NO_PROMISE, REASSURANCES } from "../data/home";
import { h2 } from "../lib/type";

const ease = [0.16, 1, 0.3, 1];

export default function Engage({ n = "09" }) {
  return (
    <section id="engage" className="wrap py-24 md:py-40">
      <div className="grid gap-10 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <p className="label text-mute">Ways to work together</p>
          <Lines className={h2} lines={["Choose the support", <span className="text-mute">that fits your needs.</span>]} />
        </div>
        <Rise className="max-w-md text-[15px] leading-relaxed text-ink/70 md:col-span-4 md:col-start-9">
          Some needs suit a defined project; others need ongoing guidance. Either way, we agree on priorities and
          scope first.
        </Rise>
      </div>

      <ul className="mt-14 grid gap-4 lg:grid-cols-3 lg:gap-6">
        {ENGAGEMENTS.map((e, i) => (
          <motion.li
            key={e.name}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.9, ease, delay: i * 0.12 }}
          >
            <Link
              to={e.to}
              onMouseMove={spot}
              className={
                "spot group relative flex h-full min-h-[340px] flex-col justify-between overflow-hidden rounded-[28px] border p-8 transition-transform duration-500 ease-out-expo hover:-translate-y-1.5 lg:min-h-[460px] lg:p-10 " +
                (e.featured ? "spot-dark living border-ink text-paper" : "border-ink/10 bg-white")
              }
            >
              <div className="relative">
                <p className={"label " + (e.featured ? "text-paper/50" : "text-mute")}>Option 0{i + 1}</p>
                <h3 className="mt-6 text-[clamp(30px,2.8vw,44px)] font-medium leading-[1] tracking-[-0.04em]">{e.name}</h3>
                <p className="mt-4 font-serif text-xl leading-snug">{e.line}</p>
              </div>
              <div className="relative">
                <p className={"text-[15px] leading-relaxed " + (e.featured ? "text-paper/70" : "text-ink/70")}>{e.text}</p>
                <p className={"mt-8 flex items-center justify-between border-t pt-5 text-sm " + (e.featured ? "border-paper/20" : "border-ink/15")}>
                  {e.cta}
                  <Arrow className="h-5 w-5 -rotate-45 transition-transform duration-500 ease-out-expo group-hover:rotate-0" />
                </p>
              </div>
            </Link>
          </motion.li>
        ))}
      </ul>

      <dl className="mt-14 grid gap-x-8 gap-y-8 sm:grid-cols-2">
        {RESPONSIBILITIES.map(([t, d], i) => (
          <Rise key={t} delay={i * 0.06} className="border-t border-ink/15 pt-4">
            <dt className="font-medium">{t}</dt>
            <dd className="mt-1 max-w-md text-sm leading-relaxed text-mute">{d}</dd>
          </Rise>
        ))}
      </dl>
    </section>
  );
}

// How the section ends: what we put first.
export function Choice() {
  return (
    <section id="choice" className="living-night text-paper">
      <div className="wrap py-28 md:py-44">
        <Letters
          className="text-[clamp(40px,8.6vw,150px)] font-medium leading-[0.92] tracking-[-0.055em]"
          lines={[
            [CHOICE.lines[0]],
            [CHOICE.lines[1], "font-serif font-normal italic tracking-[-0.02em] text-ember"],
            [CHOICE.lines[2], "text-paper/80"],
          ]}
        />
        <div className="mt-14 grid gap-8 border-t border-paper/15 pt-8 md:grid-cols-12">
          <Rise className="max-w-md text-[15px] leading-relaxed text-paper/75 md:col-span-5">{CHOICE.text}</Rise>
          <Rise delay={0.08} className="max-w-md text-[15px] leading-relaxed text-paper/75 md:col-span-5 md:col-start-8">{NO_PROMISE}</Rise>
        </div>
      </div>
    </section>
  );
}

// Why the first step is a small one.
export function StartSmall({ n = "10" }) {
  return (
    <section id="start-small" className="wrap py-24 md:py-40">
      <div className="grid gap-10 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <p className="label text-mute">The first step</p>
          <Lines className={h2} lines={["Start small.", <span className="text-mute">Decide on evidence.</span>]} />
        </div>
        <Rise className="max-w-md text-[15px] leading-relaxed text-ink/70 md:col-span-4 md:col-start-9">
          Start with one service. Build a larger system when the evidence supports it.
        </Rise>
      </div>

      <ul className="mt-14 grid border-l border-t border-line sm:grid-cols-2 lg:grid-cols-4">
        {REASSURANCES.map(([t, d], i) => (
          <motion.li
            key={t}
            onMouseMove={spot}
            className="spot relative flex min-h-[260px] flex-col justify-between border-b border-r border-line bg-white p-6 md:p-7"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.8, ease, delay: i * 0.08 }}
          >
            <span className="relative grid h-9 w-9 place-items-center rounded-full bg-ink text-paper">
              <Check className="h-4 w-4" />
            </span>
            <div className="relative mt-10">
              <h3 className="text-2xl tracking-[-0.03em] md:text-[28px]">{t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/65">{d}</p>
            </div>
          </motion.li>
        ))}
      </ul>

      <div className="mt-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <p className="max-w-md font-serif text-2xl leading-snug">The only thing it costs to find out is a conversation.</p>
        <Link
          to="/start?path=unsure"
          className="group inline-flex h-14 items-center gap-3 self-start rounded-full bg-ink px-8 text-paper transition-transform duration-300 ease-out-expo hover:-translate-y-0.5 active:translate-y-0 md:self-auto"
        >
          Answer a few questions
          <Arrow className="h-4 w-4 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
