import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Lines, Rise } from "../components/Reveal";
import { Arrow } from "../components/Icons";
import { spot } from "../components/Motion";
import { CAPABILITY_GROUPS } from "../data/home";
import { h2 } from "../lib/type";

const ease = [0.16, 1, 0.3, 1];

// Four parts. Neuromarketing is the one the others are built around, so it gets the room.
export default function Capabilities() {
  return (
    <section id="capabilities" className="wrap py-24 md:py-36">
      <div className="grid gap-10 md:grid-cols-12 md:items-end">
        <div className="md:col-span-8">
          <Lines className={h2} lines={["Four parts.", <span className="text-mute">Take one, or combine.</span>]} />
        </div>
        <Rise className="md:col-span-4 md:text-right">
          <Link to="/services" className="group inline-flex h-12 items-center gap-3 rounded-full border border-ink px-6 text-sm transition-colors duration-500 hover:bg-ink hover:text-paper">
            See every service
            <Arrow className="h-4 w-4 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
          </Link>
        </Rise>
      </div>

      <ul className="mt-14 grid gap-4 lg:grid-cols-12 lg:gap-5">
        {CAPABILITY_GROUPS.map((g, i) => (
          <motion.li
            key={g.name}
            onMouseMove={spot}
            className={
              "spot relative flex flex-col overflow-hidden rounded-[28px] p-7 md:p-8 " +
              (g.featured ? "spot-dark living-night text-paper lg:col-span-6 lg:col-start-1 lg:row-span-3 lg:row-start-1" : "border border-ink/10 bg-white lg:col-span-6 lg:col-start-7")
            }
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8% 0px" }}
            transition={{ duration: 0.9, ease, delay: i * 0.08 }}
          >
            <h3 className={"relative font-medium leading-[1.02] tracking-[-0.04em] " + (g.featured ? "text-[clamp(34px,3.6vw,56px)]" : "text-[26px]")}>{g.name}</h3>
            <p className={"relative mt-3 max-w-md leading-relaxed " + (g.featured ? "text-base text-paper/75" : "text-[15px] text-ink/65")}>{g.line}</p>
            <ul className={"relative flex flex-wrap gap-2 " + (g.featured ? "mt-auto pt-8" : "mt-5")}>
              {g.items.map((s) => (
                <li key={s.name} className={"rounded-full border px-3 py-1 text-[13px] " + (g.featured ? "border-paper/25 text-paper/85" : "border-ink/15 text-ink/75")}>{s.short || s.name}</li>
              ))}
            </ul>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
