import { motion } from "motion/react";
import { scrollTo } from "../lib/smooth";

const cols = [
  ["Explore", [["Research", "#research"], ["Partnership", "#partnership"], ["Packages", "#packages"], ["Services", "#services"]]],
  ["Social", [["LinkedIn", "#"], ["X", "#"], ["Instagram", "#"]]],
];

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="wrap grid grid-cols-2 gap-8 py-16 text-sm md:grid-cols-12">
        <p className="col-span-2 max-w-xs text-ink/60 md:col-span-6">
          Research-led partnership for fifteen companies, one industry at a time.
        </p>
        {cols.map(([title, links]) => (
          <div key={title} className="md:col-span-3">
            <p className="label mb-4 text-mute">{title}</p>
            <ul className="space-y-2">
              {links.map(([l, h]) => (
                <li key={l}>
                  <a
                    href={h}
                    onClick={h.length > 1 ? (e) => { e.preventDefault(); scrollTo(h); } : undefined}
                    className="nav-link"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="wrap overflow-hidden" aria-hidden="true">
        <p className="flex select-none text-[16.5vw] font-semibold leading-[0.8] tracking-[-0.07em]">
          {"NEUTRONOS".split("").map((c, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ y: "100%" }}
              whileInView={{ y: "0%" }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: i * 0.04 }}
            >
              {c}
            </motion.span>
          ))}
        </p>
      </div>

      <div className="wrap label flex justify-between py-6 text-mute">
        <span>© 2026 Neutronos</span>
        <button onClick={() => scrollTo("#top")} className="nav-link">Back to top ↑</button>
      </div>
    </footer>
  );
}
