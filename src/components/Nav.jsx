import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";
import { Wordmark, Arrow } from "./Icons";
import { INDUSTRY_PAGES } from "../data/industries";

// Top-level links. An entry with `menu` opens a small panel on hover or focus.
export const links = [
  {
    label: "Industries",
    href: "/industries",
    menu: [...INDUSTRY_PAGES.map((i) => [i.short, `/industries/${i.slug}`, i.need]), ["All industries", "/industries", "How we choose where to work, and the fifteen-seat rule."]],
  },
  { label: "Services", href: "/services" },
  { label: "Partnership", href: "/partnership" },
  {
    label: "Research",
    href: "/research",
    menu: [
      ["How we research", "/research", "Market intelligence, competitor scans and honest baselines."],
      ["Articles", "/insights?type=articles", "Short, direct answers from our team."],
      ["Blogs", "/insights?type=blogs", "Notes on brand, buyers and how decisions get made."],
      ["Research papers", "/insights?type=papers", "Longer studies, with method and sources."],
    ],
  },
  { label: "About", href: "/about" },
];

const MotionLink = motion.create(Link);
const isOn = (href, pathname) => pathname === href || pathname.startsWith(href + "/") || (href === "/research" && pathname.startsWith("/insights"));
const ease = [0.16, 1, 0.3, 1];

// A quiet bar held to the middle of the page. At the top it has no background at all; once the
// page moves it becomes a light glass pill.
export default function Nav() {
  const { scrollY, scrollYProgress } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(null);
  const closing = useRef(0);
  const { pathname, search } = useLocation();
  useEffect(() => { setOpen(false); setMenu(null); }, [pathname, search]);
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  const show = (label) => { clearTimeout(closing.current); setMenu(label); };
  const hide = () => { closing.current = setTimeout(() => setMenu(null), 140); };

  return (
    <>
      <motion.div aria-hidden="true" style={{ scaleX: scrollYProgress }} className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-ink/70" />

      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 md:pt-4">
        <nav
          aria-label="Main"
          className={
            "pointer-events-auto flex h-14 w-full max-w-[1180px] items-center justify-between rounded-full border pl-6 pr-2 transition-[background-color,border-color,box-shadow] duration-500 md:h-16 md:pl-8 md:pr-3 " +
            (scrolled || open
              ? "border-ink/10 bg-white/80 shadow-[0_18px_50px_-24px_rgba(116,21,22,0.35)] backdrop-blur-xl"
              : "border-transparent")
          }
        >
          <Link to="/" aria-label="Neutorium home" className="flex h-11 items-center">
            <Wordmark className="w-[112px] md:w-[124px]" />
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {links.map((l) => {
              const on = isOn(l.href, pathname);
              const expanded = menu === l.label;
              return (
                <li key={l.label} className="relative" onMouseEnter={() => l.menu && show(l.label)} onMouseLeave={() => l.menu && hide()}>
                  <Link
                    to={l.href}
                    aria-current={on ? "page" : undefined}
                    aria-haspopup={l.menu ? "true" : undefined}
                    aria-expanded={l.menu ? expanded : undefined}
                    onFocus={() => (l.menu ? show(l.label) : setMenu(null))}
                    className={"nav-link flex h-11 items-center gap-1.5 px-4 text-sm " + (on ? "" : "text-ink/70 hover:text-ink")}
                  >
                    {l.label}
                    {l.menu && (
                      <svg viewBox="0 0 10 6" className={"h-1.5 w-2.5 transition-transform duration-300 " + (expanded ? "rotate-180" : "")} fill="none" aria-hidden="true">
                        <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.3" />
                      </svg>
                    )}
                  </Link>
                  <AnimatePresence>
                    {expanded && (
                      <motion.ul
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.25, ease }}
                        className="absolute left-1/2 top-full w-[340px] -translate-x-1/2 rounded-[22px] border border-ink/10 bg-white/95 p-2 shadow-[0_30px_70px_-30px_rgba(116,21,22,0.45)] backdrop-blur-xl"
                      >
                        {l.menu.map(([name, to, note]) => (
                          <li key={name}>
                            <Link to={to} onBlur={hide} onFocus={() => show(l.label)} className="group block rounded-2xl px-4 py-3 transition-colors duration-300 hover:bg-paper">
                              <span className="flex items-center justify-between text-[15px]">
                                {name}
                                <Arrow className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                              </span>
                              <span className="mt-0.5 block text-[13px] leading-snug text-ink/55">{note}</span>
                            </Link>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            {pathname !== "/start" && (
              <Link
                to="/start"
                className="group hidden h-10 items-center gap-2 rounded-full bg-ink px-5 text-sm text-paper transition-transform duration-300 ease-out-expo hover:-translate-y-0.5 active:translate-y-0 sm:flex"
              >
                Start a project
                <Arrow className="h-3.5 w-3.5 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
              </Link>
            )}
            <button
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="site-menu"
              className="flex h-11 items-center gap-2 rounded-full border border-ink/20 px-4 text-sm lg:hidden"
            >
              <span className="relative block h-2.5 w-4" aria-hidden="true">
                <span className={"absolute left-0 top-0 h-px w-4 bg-current transition-transform duration-500 ease-out-expo " + (open ? "translate-y-[5px] rotate-45" : "")} />
                <span className={"absolute bottom-0 left-0 h-px w-4 bg-current transition-transform duration-500 ease-out-expo " + (open ? "-translate-y-[4px] -rotate-45" : "")} />
              </span>
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="site-menu"
            className="fixed inset-0 z-40 overflow-y-auto bg-paper px-5 pb-10 pt-24 lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            {[{ label: "Home", href: "/" }, ...links, { label: "Start a project", href: "/start" }].map((l, i) => (
              <motion.div key={l.label} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 + i * 0.05, duration: 0.6 }} className="border-b border-ink/10 py-3">
                <Link to={l.href} className="block py-1 text-[clamp(30px,9vw,46px)] tracking-[-0.04em]">{l.label}</Link>
                {l.menu && (
                  <ul className="flex flex-wrap gap-2 pb-2 pt-1">
                    {l.menu.slice(0, l.label === "Industries" ? -1 : undefined).map(([name, to]) => (
                      <li key={name}>
                        <MotionLink to={to} className="flex h-11 items-center rounded-full border border-ink/15 px-4 text-sm">{name}</MotionLink>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
