import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import PageHeader from "../components/PageHeader";
import { Lines, Rise } from "../components/Reveal";
import { Plus } from "../components/Icons";
import Challenges from "../sections/Challenges";
import Contact from "../sections/Contact";
import NotFound from "./NotFound";
import { industryBySlug } from "../data/industries";
import { h2 } from "../lib/type";

const ease = [0.16, 1, 0.3, 1];

export default function Industry() {
  const { slug } = useParams();
  const ind = industryBySlug(slug);
  const [open, setOpen] = useState(0);
  if (!ind) return <NotFound />;

  const columns = [
    ["Where we start", ind.core],
    ["Where it can grow", ind.expansion],
    [ind.measuresLabel, ind.measures],
  ];

  return (
    <>
      <PageHeader label={`Industries / ${ind.short}`} lines={[ind.short]} text={ind.need}>
        <div className="flex flex-wrap gap-6 text-sm md:justify-end">
          <Link to="/industries" className="nav-link py-2">All industries</Link>
          <Link to="/start" className="nav-link py-2">Start a conversation →</Link>
        </div>
      </PageHeader>

      <div className="wrap pt-6 md:pt-8">
        <motion.div
          className="photo is-live aspect-[16/10] rounded-[24px] md:aspect-[21/9] md:rounded-[28px]"
          initial={{ clipPath: "inset(12% 6% 12% 6% round 28px)" }}
          whileInView={{ clipPath: "inset(0% 0% 0% 0% round 28px)" }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease }}
        >
          <img src={ind.image} alt={ind.imageAlt} />
        </motion.div>
      </div>

      {ind.gaps && (
        <section className="bg-ink text-paper">
          <div className="wrap grid gap-12 py-24 md:grid-cols-12 md:py-36">
            <div className="md:col-span-5">
              <div className="md:sticky md:top-28">
                <p className="label text-paper/50">The gap</p>
                <Lines className={h2} lines={["What is going", "wrong,", <span className="text-paper/40">and why.</span>]} />
                <p className="mt-8 max-w-md text-[15px] leading-relaxed text-paper/70">
                  We look past portfolios and social media to the capabilities behind growth. These are possibilities,
                  not assumptions: every firm's gaps differ, and you don't need to fix everything at once.
                </p>
              </div>
            </div>
            <ul className="border-t border-paper/15 md:col-span-7">
              {ind.gaps.map((g, i) => {
                const on = open === i;
                return (
                  <li key={g.area} className="border-b border-paper/15">
                    <button onClick={() => setOpen(on ? -1 : i)} aria-expanded={on} className="group flex w-full items-center gap-4 py-5 text-left">
                      <span className={"font-mono text-xs " + (on ? "text-ember" : "text-paper/45")}>0{i + 1}</span>
                      <span className="flex-1 text-xl tracking-[-0.02em] transition-transform duration-500 ease-out-expo group-hover:translate-x-2 md:text-[28px] md:leading-[1.1]">{g.area}</span>
                      <Plus className={"h-5 w-5 shrink-0 transition-transform duration-500 ease-out-expo " + (on ? "rotate-45" : "")} />
                    </button>
                    <AnimatePresence initial={false}>
                      {on && (
                        <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.6, ease }} className="overflow-hidden">
                          <dl className="grid gap-5 pb-8 sm:pl-9">
                            <div>
                              <dt className="label text-ember">What is going wrong</dt>
                              <dd className="mt-2 font-serif text-[clamp(22px,2vw,30px)] leading-[1.15]">{g.wrong}</dd>
                            </div>
                            <div>
                              <dt className="label text-paper/50">Why it matters</dt>
                              <dd className="mt-2 max-w-xl leading-relaxed text-paper/75">{g.why}</dd>
                            </div>
                          </dl>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      {ind.challenges && <Challenges />}

      <section className="wrap border-t border-line py-24 md:py-36">
        <p className="label text-mute">The system</p>
        <Lines className={h2} lines={["Built for how", <span className="text-mute">this industry buys.</span>]} />
        <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {columns.map(([title, items], i) => (
            <Rise key={title} delay={i * 0.08} className="border-t border-ink/15 pt-5">
              <h3 className="text-2xl tracking-[-0.03em]">{title}</h3>
              <ul className="mt-5 space-y-3 text-[15px] leading-snug text-ink/75">
                {items.map((x) => (
                  <li key={x} className="flex gap-3">
                    <span className="mt-[0.5em] h-1 w-1 shrink-0 rounded-full bg-ink/50" />
                    {x}
                  </li>
                ))}
              </ul>
            </Rise>
          ))}
        </div>
        {ind.note && <p className="mt-12 max-w-xl font-serif text-2xl leading-snug">{ind.note}</p>}
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-ink/60">
          A starting architecture, not a fixed package. We replace every assumption with what we find in your business.
        </p>
      </section>

      <Contact />
    </>
  );
}
