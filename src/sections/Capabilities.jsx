import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Lines, Rise } from "../components/Reveal";
import { Arrow } from "../components/Icons";
import { CAPABILITY_GROUPS, PROBLEMS } from "../data/home";
import { WHATSAPP_URL } from "../data/site";
import { h2 } from "../lib/type";

const ease = [0.16, 1, 0.3, 1];
const INPUT = "h-12 w-full rounded-full border border-paper/30 bg-transparent px-5 text-paper outline-none placeholder:text-paper/40 focus:border-paper";

// Three short questions, asked inside the open card. The answers become a ready-written
// WhatsApp message, so the conversation with a person starts with context.
function Ask({ group }) {
  const [step, setStep] = useState(0);
  const [business, setBusiness] = useState("");
  const [problem, setProblem] = useState("");
  const [name, setName] = useState("");
  const message = `Hi Neutorium${name ? ", I'm " + name : ""}. I'm interested in ${group.name}. My business: ${business || "not said"}. Hardest right now: ${problem || "not said"}.`;

  return (
    <div className="relative mt-8 border-t border-paper/20 pt-6">
      <div className="flex items-center gap-4">
        <p className="label text-paper/55">Question {step + 1} of 3</p>
        <div className="flex flex-1 gap-1.5" aria-hidden="true">
          {[0, 1, 2].map((i) => <span key={i} className={"h-px flex-1 transition-colors duration-500 " + (i <= step ? "bg-paper" : "bg-paper/20")} />)}
        </div>
        {step > 0 && <button onClick={() => setStep(step - 1)} className="flex h-11 items-center text-sm text-paper/60 underline underline-offset-4">Back</button>}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3, ease }} className="mt-4">
          {step === 0 && (
            <form onSubmit={(e) => { e.preventDefault(); setStep(1); }}>
              <label htmlFor={"ask-biz-" + group.name} className="block font-serif text-[clamp(24px,2.4vw,34px)] leading-tight">What does your business do?</label>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input id={"ask-biz-" + group.name} required minLength={2} value={business} onChange={(e) => setBusiness(e.target.value)} maxLength={160} placeholder="An interior design studio in Dhaka" className={INPUT} />
                <button className="flex h-12 shrink-0 items-center justify-center gap-3 rounded-full bg-paper px-6 text-ink">Next <Arrow className="h-4 w-4" /></button>
              </div>
            </form>
          )}
          {step === 1 && (
            <>
              <p className="font-serif text-[clamp(24px,2.4vw,34px)] leading-tight">What is hardest right now?</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {PROBLEMS.map(([p]) => (
                  <li key={p}>
                    <button onClick={() => { setProblem(p); setStep(2); }} className="flex min-h-11 items-center rounded-full border border-paper/30 px-4 py-2 text-left text-sm transition-colors duration-300 hover:bg-paper hover:text-ink">{p}</button>
                  </li>
                ))}
              </ul>
            </>
          )}
          {step === 2 && (
            <>
              <label htmlFor={"ask-name-" + group.name} className="block font-serif text-[clamp(24px,2.4vw,34px)] leading-tight">And who are we talking to?</label>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input id={"ask-name-" + group.name} value={name} onChange={(e) => setName(e.target.value)} maxLength={80} placeholder="Your name" className={INPUT} />
                <a href={WHATSAPP_URL + "?text=" + encodeURIComponent(message)} target="_blank" rel="noopener" className="flex h-12 shrink-0 items-center justify-center gap-3 rounded-full bg-paper px-6 text-ink">
                  Send on WhatsApp <Arrow className="h-4 w-4" />
                </a>
              </div>
              <p className="mt-3 text-xs text-paper/50">Opens WhatsApp with your answers written out. Nothing is sent until you press send there.</p>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// What most businesses miss, in four parts. One card is open at a time: it takes the large
// space and asks its three questions right there. Picking another card swaps them over.
export default function Capabilities() {
  const [active, setActive] = useState(() => Math.max(0, CAPABILITY_GROUPS.findIndex((g) => g.featured)));
  return (
    <section id="capabilities" className="wrap py-24 md:py-36">
      <div className="grid gap-10 md:grid-cols-12 md:items-end">
        <div className="md:col-span-8">
          <Lines className={h2} lines={["What most businesses miss.", <span className="text-mute">Take one, or combine.</span>]} />
        </div>
        <Rise className="md:col-span-4 md:text-right">
          <Link to="/services" className="group inline-flex h-12 items-center gap-3 rounded-full border border-ink px-6 text-sm transition-colors duration-500 hover:bg-ink hover:text-paper">
            See every service
            <Arrow className="h-4 w-4 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
          </Link>
        </Rise>
      </div>

      <ul className="mt-14 grid gap-4 lg:grid-cols-12 lg:gap-5">
        {CAPABILITY_GROUPS.map((g, i) => {
          const on = i === active;
          return (
            <motion.li
              key={g.name}
              layout
              transition={{ layout: { duration: 0.7, ease } }}
              className={"relative overflow-hidden rounded-[28px] " + (on ? "living-night text-paper lg:col-span-7 lg:col-start-1 lg:row-span-3 lg:row-start-1" : "border border-ink/10 bg-white lg:col-span-5 lg:col-start-8")}
            >
              {on ? (
                <motion.div layout="position" className="flex h-full flex-col p-7 md:p-9">
                  <h3 className="text-[clamp(34px,3.6vw,56px)] font-medium leading-[1.02] tracking-[-0.04em]">{g.name}</h3>
                  <p className="mt-3 max-w-md text-base leading-relaxed text-paper/75">{g.line}</p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {g.items.map((s) => <li key={s.name} className="rounded-full border border-paper/25 px-3 py-1 text-[13px] text-paper/85">{s.name}</li>)}
                  </ul>
                  <div className="mt-auto"><Ask key={g.name} group={g} /></div>
                </motion.div>
              ) : (
                <motion.button layout="position" onClick={() => setActive(i)} aria-label={"Open " + g.name} className="group flex h-full w-full flex-col p-7 text-left transition-colors duration-300 hover:bg-paper md:p-8">
                  <span className="text-[26px] font-medium leading-[1.05] tracking-[-0.03em]">{g.name}</span>
                  <span className="mt-2 max-w-md text-[15px] leading-relaxed text-ink/65">{g.line}</span>
                  <span className="mt-5 flex items-center justify-between border-t border-ink/10 pt-4 text-sm">
                    Ask about this
                    <Arrow className="h-5 w-5 -rotate-45 transition-transform duration-500 ease-out-expo group-hover:rotate-0" />
                  </span>
                </motion.button>
              )}
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
