import { Link, useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import Rows from "../components/Rows";
import Faq from "../components/Faq";
import { Lines, Rise } from "../components/Reveal";
import Contact from "../sections/Contact";
import { categoryById } from "../data/services";
import { useContent } from "../lib/content";
import { packageById } from "../data/packages";
import NotFound from "./NotFound";

export default function ServiceDetail() {
  const { slug } = useParams();
  const { serviceBySlug, servicesIn } = useContent();
  const s = serviceBySlug(slug);
  if (!s) return <NotFound />;
  const cat = categoryById(s.category);
  const related = servicesIn(s.category).filter((x) => x.slug !== s.slug);
  const pkgs = s.pkg.map(packageById).filter(Boolean);

  return (
    <>
      <PageHeader label={`Services / ${cat.name}`} lines={[s.name]} text={s.summary}>
        <div className="flex flex-wrap gap-6 text-sm md:justify-end">
          <Link to="/services" className="nav-link">All services</Link>
          <Link to={`/start?service=${s.slug}`} className="nav-link">Start with this service →</Link>
        </div>
      </PageHeader>

      <section className="wrap grid gap-16 border-t border-line py-24 md:grid-cols-12 md:py-32">
        <div className="md:col-span-6">
          <p className="label text-mute">(01) Overview</p>
          <Rise>
            <p className="mt-8 text-[clamp(22px,2.2vw,34px)] font-light leading-[1.25] tracking-[-0.02em]">{s.intro}</p>
          </Rise>
        </div>
        <div className="md:col-span-5 md:col-start-8">
          <dl className="grid grid-cols-2 gap-6">
            <div className="border-t border-ink/15 pt-4">
              <dt className="label text-mute">Timeline</dt>
              <dd className="mt-2 text-lg">{s.timeline}</dd>
            </div>
            <div className="border-t border-ink/15 pt-4">
              <dt className="label text-mute">Revisions</dt>
              <dd className="mt-2 text-lg">2 rounds per asset</dd>
            </div>
          </dl>
          <p className="label mt-12 text-mute">Included</p>
          <ul className="mt-4">
            {s.includes.map((it) => (
              <li key={it} className="flex items-center gap-3 border-t border-line py-3 last:border-b">
                <span className="h-1.5 w-1.5 rounded-full bg-ink" />
                {it}
              </li>
            ))}
          </ul>
          <p className="label mt-12 text-mute">What you get</p>
          <ul className="mt-4 space-y-2 text-[15px] text-ink/70">
            {s.outcomes.map((o) => <li key={o}>{o}</li>)}
          </ul>
          <p className="mt-10 text-sm text-ink/70">
            {pkgs.length
              ? <>Also included in the <Link to="/partnership#packages" className="nav-link text-ink">{pkgs.map((p) => p.name).join(" and ")}</Link> package{pkgs.length > 1 ? "s" : ""}.</>
              : "Available as a standalone service, or combined with others in your own package."}
          </p>
        </div>
      </section>

      <section className="bg-ink text-paper">
        <div className="wrap py-24 md:py-32">
          <p className="label text-paper/50">(02) How it runs</p>
          <Lines
            className="mt-6 text-[clamp(40px,5.6vw,92px)] font-medium leading-[0.95] tracking-[-0.05em]"
            lines={["Four steps.", <span className="text-paper/40">No surprises.</span>]}
          />
          <ol className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cat.process.map(([t, d], i) => (
              <Rise key={t} delay={i * 0.08}>
                <li className="flex h-full min-h-[260px] flex-col justify-between rounded-[28px] border border-paper/15 p-8">
                  <span className="text-[64px] font-light leading-none tracking-[-0.06em]">0{i + 1}</span>
                  <div>
                    <h3 className="text-2xl tracking-[-0.03em]">{t}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-paper/60">{d}</p>
                  </div>
                </li>
              </Rise>
            ))}
          </ol>
        </div>
      </section>

      {s.faqs?.length > 0 && (
        <section className="wrap grid gap-16 py-24 md:grid-cols-12 md:py-32">
          <div className="md:col-span-5">
            <p className="label text-mute">Questions</p>
            <h2 className="mt-6 text-[clamp(32px,4vw,64px)] font-medium leading-[0.95] tracking-[-0.05em]">
              About <span className="text-mute">{s.name.toLowerCase()}.</span>
            </h2>
          </div>
          <Faq items={s.faqs} className="md:col-span-7" />
        </section>
      )}

      {related.length > 0 && (
        <section className="wrap grid gap-16 py-24 md:grid-cols-12 md:py-32">
          <div className="md:col-span-5">
            <p className="label text-mute">(03) Related</p>
            <h2 className="mt-6 text-[clamp(32px,4vw,64px)] font-medium leading-[0.95] tracking-[-0.05em]">
              More in <span className="text-mute">{cat.name.toLowerCase()}.</span>
            </h2>
          </div>
          <div className="md:col-span-7">
            <Rows items={related.map((r) => ({ title: r.name, text: r.summary, to: `/services/${r.slug}` }))} />
          </div>
        </section>
      )}

      <Contact n="04" />
    </>
  );
}
