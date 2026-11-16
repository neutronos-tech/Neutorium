import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Arrow } from "./Icons";
import { INDUSTRY_PAGES } from "../data/industries";

// One photograph per industry. It rests in the brand's wine tone and comes into full colour,
// slowly zooming, when the card is hovered or focused (see .photo in index.css).
export default function IndustryCards() {
  return (
    <ul className="grid gap-5 lg:grid-cols-3 lg:gap-6">
      {INDUSTRY_PAGES.map((ind, i) => (
        <motion.li
          key={ind.slug}
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: i * 0.12 }}
        >
          <Link
            to={`/industries/${ind.slug}`}
            className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-ink/10 bg-white transition-[transform,box-shadow] duration-500 ease-out-expo hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-30px_rgba(116,21,22,0.45)]"
          >
            {ind.image ? (
              <div className="photo aspect-[4/3]">
                <img src={ind.image} alt={ind.imageAlt} loading="lazy" />
              </div>
            ) : (
              <div className="glow-soft flex aspect-[4/3] items-end bg-paper p-7" aria-hidden="true">
                <span className="font-serif text-[clamp(64px,7vw,110px)] italic leading-none text-ink/25">{ind.short}</span>
              </div>
            )}
            <div className="flex flex-1 flex-col justify-between p-7 lg:p-8">
              <div>
                <h3 className="text-[clamp(26px,2.2vw,34px)] font-medium leading-[1.04] tracking-[-0.035em]">{ind.short}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink/70">{ind.need}</p>
              </div>
              <p className="mt-8 flex items-center justify-between border-t border-ink/15 pt-5 text-sm">
                {ind.gaps ? "What is going wrong, and why" : "What it needs first"}
                <Arrow className="h-5 w-5 -rotate-45 transition-transform duration-500 ease-out-expo group-hover:rotate-0" />
              </p>
            </div>
          </Link>
        </motion.li>
      ))}
    </ul>
  );
}
