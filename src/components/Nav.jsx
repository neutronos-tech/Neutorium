import { useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";
import { scrollTo } from "../lib/smooth";
import { Mark } from "./Icons";

const links = [
  ["Research", "#research"],
  ["Partnership", "#partnership"],
  ["Packages", "#packages"],
  ["Services", "#services"],
];

export default function Nav() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(v > prev && v > 200 && !open);
    setSolid(v > 40);
  });

  const go = (e, href) => {
    e.preventDefault();
    setOpen(false);
    scrollTo(href);
  };

  const headerClass =
    "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-500 " +
    (solid ? "border-line bg-paper/80 backdrop-blur-md" : "border-transparent");

  return (
    <>
      <motion.header
        animate={{ y: hidden ? "-110%" : "0%" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={headerClass}
      >
        <nav className="wrap flex h-16 items-center justify-between">
          <a href="#top" onClick={(e) => go(e, "#top")} className="flex items-center gap-2.5 text-[15px] font-medium tracking-tight">
            <Mark /> Neutronos
          </a>

          <ul className="hidden items-center gap-8 text-sm md:flex">
            {links.map(([label, href]) => (
              <li key={href}>
                <a href={href} onClick={(e) => go(e, href)} className="nav-link">{label}</a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <a
              href="#contact"
              onClick={(e) => go(e, "#contact")}
              className="group relative hidden overflow-hidden rounded-full bg-ink px-4 py-2 text-sm text-paper sm:block"
            >
              <span className="block transition-transform duration-500 ease-out-expo group-hover:-translate-y-full">Start a project</span>
              <span className="absolute inset-0 flex translate-y-full items-center justify-center transition-transform duration-500 ease-out-expo group-hover:translate-y-0">
                Start a project
              </span>
            </a>
            <button onClick={() => setOpen((o) => !o)} className="label md:hidden" aria-expanded={open}>
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-end bg-paper px-5 pb-12 md:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            {[...links, ["Contact", "#contact"]].map(([label, href], i) => (
              <motion.a
                key={href}
                href={href}
                onClick={(e) => go(e, href)}
                className="border-b border-line py-4 text-5xl tracking-[-0.04em]"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 + i * 0.05, duration: 0.6 }}
              >
                {label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
