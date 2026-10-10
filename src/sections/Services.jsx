import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Lines } from "../components/Reveal";
import { Plus } from "../components/Icons";
import { CATEGORIES, servicesIn } from "../data/services";

export default function Services({ n = "05" }) {
  const [open, setOpen] = useState("web-design");

  return (
    <section id="services" className="wrap grid gap-16 border-t border-line py-24 md:grid-cols-12 md:py-40">
      <div className="md:col-span-5">
        <div className="md:sticky md:top-28">
          <p className="label text-mute">({n}) Single services</p>
          <Lines
            className="mt-6 text-[clamp(40px,5.6vw,92px)] font-medium leading-[0.95] tracking-[-0.05em]"
            lines={["One service.", <span className="text-mute">Done properly.</span>]}
          />
          <p className="mt-8 max-w-md text-[15px] leading-relaxed text-ink/70">
            Not ready for a partnership? Hire a single service with a fixed scope, or combine several into
            your own package. Same research, same standards, one clear outcome.
          </p>
          <Link to="/start?path=custom" className="nav-link mt-8 inline-block text-sm">Build your own package →</Link>
        </div>
      </div>

      <div className="md:col-span-7">
        {CATEGORIES.map((c) => (
          <div key={c.id} className="mb-12 last:mb-0">
            <p className="label mb-2 text-mute">{c.name}</p>
            <ul>
              {servicesIn(c.id).map((s) => {
                const isOpen = open === s.slug;
                return (
                  <li key={s.slug} className="border-t border-line last:border-b">
                    <button
                      onClick={() => setOpen(isOpen ? null : s.slug)}
                      aria-expanded={isOpen}
                      className="group flex w-full items-center gap-4 py-5 text-left"
                    >
                      <span className="flex-1 text-xl tracking-[-0.02em] transition-transform duration-500 ease-out-expo group-hover:translate-x-2 md:text-3xl">
                        {s.name}
                      </span>
                      <Plus className={"h-5 w-5 shrink-0 transition-transform duration-500 ease-out-expo " + (isOpen ? "rotate-45" : "")} />
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
                          <div className="pb-8">
                            <p className="max-w-md leading-relaxed text-ink/70">{s.summary}</p>
                            <ul className="mt-4 flex flex-wrap gap-2">
                              {s.includes.map((it) => (
                                <li key={it} className="rounded-full border border-ink/15 px-3 py-1 text-[13px]">{it}</li>
                              ))}
                            </ul>
                            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                              <p className="label text-mute">{s.timeline}</p>
                              <div className="flex gap-6 text-sm">
                                <Link to={`/services/${s.slug}`} className="nav-link">View details</Link>
                                <Link to={`/start?service=${s.slug}`} className="nav-link">Add to my project</Link>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
