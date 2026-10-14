import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import Faq from "../components/Faq";
import Rows from "../components/Rows";
import { Lines, Rise } from "../components/Reveal";
import Partnership from "../sections/Partnership";
import Packages from "../sections/Packages";
import Process from "../sections/Process";
import Contact from "../sections/Contact";
import { PROVIDES } from "../data/packages";
import { useContent } from "../lib/content";

export default function PartnershipPage() {
  const { services, faqs } = useContent();
  return (
    <>
      <PageHeader
        label="Partnership"
        lines={["A partnership,", "not a project.", <span className="text-mute">Ninety days to prove it.</span>]}
        text="A partnership is our Digital Authority & Client Acquisition System: research, a website, premium films and an inquiry system, built together and measured from day one."
      >
        <div className="flex flex-wrap gap-6 text-sm md:justify-end">
          <Link to="/partnership#packages" className="nav-link">Compare packages</Link>
          <Link to="/start?path=partnership" className="nav-link">Apply for a seat →</Link>
        </div>
      </PageHeader>

      <Partnership n="01" />
      <Packages n="02" />
      <Process n="03" />

      <section className="wrap grid gap-16 py-24 md:grid-cols-12 md:py-40">
        <div className="md:col-span-5">
          <p className="label text-mute">(04) What you bring</p>
          <Lines
            className="mt-6 text-[clamp(40px,5.6vw,92px)] font-medium leading-[0.95] tracking-[-0.05em]"
            lines={["A partnership", <span className="text-mute">runs both ways.</span>]}
          />
        </div>
        <dl className="grid gap-x-8 gap-y-10 sm:grid-cols-2 md:col-span-7">
          {PROVIDES.map(([t, d], i) => (
            <Rise key={t} delay={i * 0.06} className="border-t border-ink/15 pt-4">
              <dt className="font-medium">{t}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-mute">{d}</dd>
            </Rise>
          ))}
        </dl>
      </section>

      <section className="wrap grid gap-16 border-t border-line py-24 md:grid-cols-12 md:py-40">
        <div className="md:col-span-5">
          <p className="label text-mute">(05) Delivery guarantee</p>
          <Lines
            className="mt-6 text-[clamp(40px,5.6vw,92px)] font-medium leading-[0.95] tracking-[-0.05em]"
            lines={["Every asset,", <span className="text-mute">or we keep working.</span>]}
          />
        </div>
        <div className="space-y-5 text-[15px] leading-relaxed text-ink/70 md:col-span-6 md:col-start-7 md:self-end">
          <p>Every asset listed in the signed scope is delivered within 90 days. If one is late for reasons on our side, work continues at no additional fee until it is delivered.</p>
          <p>Delays caused by late approvals or site access extend the timeline by the same number of days. We never guarantee a number of clients or revenue; results depend on demand, pricing and follow-up, and are tracked against your baseline.</p>
        </div>
      </section>

      <section className="wrap grid gap-16 border-t border-line py-24 md:grid-cols-12 md:py-40">
        <div className="md:col-span-5">
          <p className="label text-mute">(06) After Day 90</p>
          <Lines
            className="mt-6 text-[clamp(40px,5.6vw,92px)] font-medium leading-[0.95] tracking-[-0.05em]"
            lines={["Embedded", <span className="text-mute">growth services.</span>]}
          />
          <p className="mt-8 max-w-md text-[15px] leading-relaxed text-ink/70">
            Long-term partners can add advanced services after the Day-90 review, each scoped from real results.
          </p>
        </div>
        <div className="md:col-span-7">
          <Rows items={services.filter((s) => s.pkg.includes("embedded")).map((s) => ({ title: s.name, text: s.summary, to: `/services/${s.slug}` }))} />
        </div>
      </section>

      <section className="wrap grid gap-16 border-t border-line py-24 md:grid-cols-12 md:py-40">
        <div className="md:col-span-5">
          <p className="label text-mute">(07) Questions</p>
          <Lines
            className="mt-6 text-[clamp(40px,5.6vw,92px)] font-medium leading-[0.95] tracking-[-0.05em]"
            lines={["Asked often,", <span className="text-mute">answered plainly.</span>]}
          />
        </div>
        <Faq items={faqs.partnership} className="md:col-span-7" />
      </section>

      <Contact n="08" />
    </>
  );
}
