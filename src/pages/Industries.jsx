import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import IndustryCards from "../components/IndustryCards";
import { Lines, Rise } from "../components/Reveal";
import Ambition from "../sections/Ambition";
import Partnership from "../sections/Partnership";
import Contact from "../sections/Contact";
import { INDUSTRY_PAGES } from "../data/industries";
import { h2 } from "../lib/type";

export default function Industries() {
  return (
    <>
      <PageHeader
        label="Industries"
        lines={["Your industry.", <span className="text-mute">Its real problems.</span>]}
        text="Different industries have different problems, but many share the same sequence: understand the market, make the value clear, earn trust, turn interest into action, measure, then improve."
      >
        <div className="flex flex-wrap gap-2 md:justify-end">
          {INDUSTRY_PAGES.map((i) => (
            <Link key={i.slug} to={`/industries/${i.slug}`} className="rounded-full border border-ink/15 px-4 py-2.5 text-sm transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-paper">
              {i.short}
            </Link>
          ))}
        </div>
      </PageHeader>

      <Ambition n="01" />

      <section className="wrap border-t border-line py-24 md:py-36">
        <div className="grid gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <p className="label text-mute">Where we work</p>
            <Lines className={h2} lines={["Three industries.", <span className="text-mute">One page each.</span>]} />
          </div>
          <Rise className="max-w-md text-[15px] leading-relaxed text-ink/70 md:col-span-4 md:col-start-9">
            Each page starts from what that industry's buyers need first, then shows where we begin and how it
            can grow.
          </Rise>
        </div>

        <div className="mt-14"><IndustryCards /></div>
      </section>

      <Partnership n="03" />
      <Contact n="04" />
    </>
  );
}
