import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { scrollTo } from "../lib/smooth";
import { useContent } from "../lib/content";
import { TAGLINE } from "../data/home";

const cols = [
  ["Explore", [["Home", "/"], ["Industries", "/industries"], ["About", "/about"], ["Research", "/research"], ["Partnership", "/partnership"], ["Services", "/services"], ["Insights", "/insights"]]],
  ["Work with us", [["Start a project", "/start"], ["Packages", "/partnership#packages"], ["Single services", "/services"]]],
];

export default function Footer() {
  const { email: EMAIL, socials: SOCIALS } = useContent();
  return (
    <footer className="border-t border-line">
      <div className="wrap grid grid-cols-2 gap-8 py-16 text-sm md:grid-cols-12">
        <div className="col-span-2 md:col-span-5">
          <p className="label mb-4 text-mute">{TAGLINE}</p>
          <p className="max-w-xs text-ink/60">
            Research-led partnership. Fifteen companies per industry, one industry at a time and growing.
          </p>
          <a href={"mailto:" + EMAIL} className="nav-link mt-4 inline-block">{EMAIL}</a>
        </div>
        {cols.map(([title, links]) => (
          <div key={title} className="md:col-span-2">
            <p className="label mb-4 text-mute">{title}</p>
            <ul className="space-y-2">
              {links.map(([l, h]) => (
                <li key={l}><Link to={h} className="nav-link">{l}</Link></li>
              ))}
            </ul>
          </div>
        ))}
        <div className="md:col-span-2 md:col-start-11">
          <p className="label mb-4 text-mute">Social</p>
          <ul className="space-y-2">
            {SOCIALS.map(([l, h]) => (
              <li key={l}><a href={h} className="nav-link">{l}</a></li>
            ))}
          </ul>
        </div>
      </div>

      <div className="wrap pb-2 pt-6" aria-hidden="true">
        <motion.span
          className="wordmark wordmark-lit block w-full"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      <div className="wrap label flex justify-between py-6 text-mute">
        <span>© {new Date().getFullYear()} Neutorium</span>
        <button onClick={() => scrollTo(0)} className="nav-link">Back to top ↑</button>
      </div>
    </footer>
  );
}
