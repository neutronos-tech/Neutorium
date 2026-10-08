import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Lines } from "../components/Reveal";
import { Plus } from "../components/Icons";
import { scrollTo } from "../lib/smooth";

const services = [
  ["Brand identity", "Logo, visual system, and guidelines built from research, not guesswork."],
  ["Website design & development", "Fast, modern websites designed and engineered end to end."],
  ["Product design (UI/UX)", "Interfaces for apps and platforms, from flows to final screens."],
  ["Market research report", "A focused study of your market, competitors, and customers."],
  ["Growth & performance marketing", "Campaigns planned, launched, and measured against real numbers."],
  ["Content & social", "Editorial, visual, and video content with a clear point of view."],
  ["Automation & AI integration", "Workflows and AI tools wired into how your team already works."],
  ["Technical audit", "An honest review of your stack with a prioritised list of fixes."],
];

export default function Services() {
  const [open, setOpen] = useState(0);

  return (
    <section id="services" className="wrap grid gap-16 border-t border-line py-24 md:grid-cols-12 md:py-40">
      <div className="md:col-span-5">
        <p className="label text-mute">(05) Single services</p>
        <Lines
          className="mt-6 text-[clamp(40px,5.6vw,92px)] font-medium leading-[0.95] tracking-[-0.05em]"
          lines={["One service.", <span className="text-mute">Done properly.</span>]}
        />
        <p className="mt-8 max-w-md text-[15px] leading-relaxed text-ink/70">
          Not ready for a partnership? Hire us for a single service at a minimal, fixed cost.
          Same research, same standards, one clear outcome.
        </p>
      </div>

      <ul className="md:col-span-7">
        {services.map(([title, desc], i) => {
          const isOpen = open === i;
          return (
            <li key={title} className="border-t border-line last:border-b">
              <button
                onClick={() => setOpen(isOpen ? -1 : i)}
                aria-expanded={isOpen}
                className="group flex w-full items-center gap-4 py-6 text-left"
              >
                <span className="w-8 font-mono text-xs text-mute">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex-1 text-xl tracking-[-0.02em] transition-transform duration-500 ease-out-expo group-hover:translate-x-2 md:text-3xl">
                  {title}
                </span>
                <Plus className={"h-5 w-5 transition-transform duration-500 ease-out-expo " + (isOpen ? "rotate-45" : "")} />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col gap-6 pb-8 pl-12 md:flex-row md:items-end md:justify-between">
                      <div>
                        <p className="max-w-md leading-relaxed text-ink/70">{desc}</p>
                        <p className="label mt-4 text-mute">Fixed scope · Minimal fee · Fast turnaround</p>
                      </div>
                      <button onClick={() => scrollTo("#contact")} className="nav-link shrink-0 text-sm">
                        Request this service
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
