import PageHeader from "../components/PageHeader";
import Rows from "../components/Rows";
import { Lines, Rise } from "../components/Reveal";
import Research from "../sections/Research";
import Contact from "../sections/Contact";
import { servicesIn } from "../data/services";

const snapshot = [
  "Your website, as it looks on a phone",
  "Recent posts and any project video",
  "How easy it is to inquire",
  "Three strengths and three specific gaps",
];

export default function ResearchPage() {
  return (
    <>
      <PageHeader
        label="Research"
        lines={["We research", <>before we <em className="font-serif font-normal tracking-[-0.02em]">build.</em></>]}
        text="Every engagement starts with evidence. In a partnership it is the first fourteen days; on its own, it becomes a report your team can act on."
      />
      <Research n="01" />

      <section className="bg-ink text-paper">
        <div className="wrap grid gap-16 py-24 md:grid-cols-12 md:py-40">
          <div className="md:col-span-6">
            <p className="label text-paper/50">(02) Free, no commitment</p>
            <Lines
              className="mt-6 text-[clamp(40px,5.6vw,92px)] font-medium leading-[0.95] tracking-[-0.05em]"
              lines={["The digital", <span className="text-paper/40">presence snapshot.</span>]}
            />
            <p className="mt-8 max-w-md text-[15px] leading-relaxed text-paper/70">
              Before any pitch, we research your company and send a one-page snapshot or a two-minute screen
              recording. If it is useful on its own, it has done its job.
            </p>
          </div>
          <ul className="md:col-span-5 md:col-start-8 md:self-end">
            {snapshot.map((s, i) => (
              <Rise key={s} delay={i * 0.06}>
                <li className="flex gap-4 border-t border-paper/15 py-5 text-lg">
                  <span className="pt-1.5 font-mono text-xs text-paper/50">0{i + 1}</span>
                  {s}
                </li>
              </Rise>
            ))}
          </ul>
        </div>
      </section>

      <section className="wrap grid gap-16 py-24 md:grid-cols-12 md:py-40">
        <div className="md:col-span-5">
          <p className="label text-mute">(03) Research services</p>
          <Lines
            className="mt-6 text-[clamp(40px,5.6vw,92px)] font-medium leading-[0.95] tracking-[-0.05em]"
            lines={["Hire the", <span className="text-mute">research alone.</span>]}
          />
        </div>
        <div className="md:col-span-7">
          <Rows items={servicesIn("research").map((s) => ({ title: s.name, text: s.summary, to: `/services/${s.slug}` }))} />
        </div>
      </section>

      <Contact n="04" />
    </>
  );
}
