import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import Faq from "../components/Faq";
import { Lines } from "../components/Reveal";
import Services from "../sections/Services";
import Contact from "../sections/Contact";
import { CATEGORIES } from "../data/services";

const faq = [
  ["Can I hire a single service without a partnership?", "Yes. Every service can be hired on its own with a fixed scope and timeline. If it later grows into a partnership, the work carries over."],
  ["Can I combine services into my own package?", "Yes. Pick what you need in the project builder and we come back with a scope, timeline and fee for that combination."],
  ["Do single services get the same research?", "Every project starts with a short research brief, scaled to its size. The standard of work does not change with scope."],
  ["How many revisions are included?", "Two rounds per asset as standard. Further rounds are agreed in writing before they start."],
];

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        label="Services"
        lines={["Everything", <span className="text-mute">the system needs.</span>]}
        text="Research, design, development, film and growth systems. Hire one with a clear scope, build your own package, or take them together as a partnership."
      >
        <ul className="flex flex-wrap gap-2 md:justify-end">
          {CATEGORIES.map((c) => (
            <li key={c.id} className="rounded-full border border-ink/15 px-4 py-2 text-sm">{c.name}</li>
          ))}
        </ul>
      </PageHeader>

      <Services n="01" />

      <section className="wrap grid gap-16 border-t border-line py-24 md:grid-cols-12 md:py-40">
        <div className="md:col-span-5">
          <p className="label text-mute">(02) Questions</p>
          <Lines
            className="mt-6 text-[clamp(40px,5.6vw,92px)] font-medium leading-[0.95] tracking-[-0.05em]"
            lines={["Before", <span className="text-mute">you ask.</span>]}
          />
          <p className="mt-8 max-w-md text-[15px] leading-relaxed text-ink/70">
            Prefer everything working together? See the <Link to="/partnership#packages" className="nav-link text-ink">partnership packages</Link>.
          </p>
        </div>
        <Faq items={faq} className="md:col-span-7" />
      </section>

      <Contact n="03" />
    </>
  );
}
