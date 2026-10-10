import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus } from "./Icons";

export default function Faq({ items, className = "" }) {
  const [open, setOpen] = useState(0);
  return (
    <ul className={className}>
      {items.map(([q, a], i) => {
        const on = open === i;
        return (
          <li key={q} className="border-t border-line last:border-b">
            <button onClick={() => setOpen(on ? -1 : i)} aria-expanded={on} className="group flex w-full items-center gap-4 py-6 text-left">
              <span className="flex-1 text-xl tracking-[-0.02em] transition-transform duration-500 ease-out-expo group-hover:translate-x-2 md:text-2xl">{q}</span>
              <Plus className={"h-5 w-5 shrink-0 transition-transform duration-500 ease-out-expo " + (on ? "rotate-45" : "")} />
            </button>
            <AnimatePresence initial={false}>
              {on && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-xl pb-8 leading-relaxed text-ink/70">{a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
