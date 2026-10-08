import { Lines, Rise } from "../components/Reveal";
import { Arrow } from "../components/Icons";

const areas = [
  ["Market intelligence", "We map where an industry is heading, who is moving, and why, before the shift becomes obvious."],
  ["Opportunity discovery", "We find the openings worth attracting and filter out the noise that only looks like opportunity."],
  ["Product & technology R&D", "We prototype, test, and validate ideas quickly, so decisions rest on evidence instead of opinion."],
  ["People & behaviour", "We study the customers, operators, and decision makers who decide whether an idea succeeds."],
];

const loop = [
  ["Observe", "Study the industry end to end."],
  ["Attract", "Pull in the opportunities that matter."],
  ["Build", "Turn the best ones into real work."],
];

export default function Research() {
  return (
    <section id="research" className="wrap grid gap-16 py-24 md:grid-cols-12 md:py-40">
      <div className="md:col-span-5">
        <div className="md:sticky md:top-28">
          <p className="label text-mute">(02) Research</p>
          <Lines
            className="mt-6 text-[clamp(40px,5.6vw,92px)] font-medium leading-[0.95] tracking-[-0.05em]"
            lines={["Curiosity,", <span className="text-mute">with a method.</span>]}
          />
          <Rise className="mt-8 max-w-md text-[15px] leading-relaxed text-ink/70">
            Research is where everything starts. We look for what's changing, attract the
            opportunities worth pursuing, and work on them until they become something real.
          </Rise>
          <ol className="mt-12 flex flex-wrap gap-2">
            {loop.map(([t, d], i) => (
              <Rise key={t} delay={i * 0.08}>
                <li title={d} className="rounded-full border border-ink/15 px-4 py-2 text-sm">
                  <span className="mr-2 font-mono text-[11px] text-mute">0{i + 1}</span>
                  {t}
                </li>
              </Rise>
            ))}
          </ol>
        </div>
      </div>

      <ul className="md:col-span-7">
        {areas.map(([title, desc], i) => (
          <li key={title} className="group relative overflow-hidden border-t border-line last:border-b">
            <span className="absolute inset-0 origin-bottom scale-y-0 bg-ink transition-transform duration-700 ease-out-expo group-hover:scale-y-100" />
            <div className="relative grid grid-cols-[2.5rem_1fr_auto] gap-4 px-1 py-8 transition-colors duration-500 group-hover:text-paper md:px-4 md:py-10">
              <span className="pt-2 font-mono text-xs text-mute transition-colors duration-500 group-hover:text-paper/60">0{i + 1}</span>
              <div>
                <h3 className="text-2xl tracking-[-0.03em] md:text-4xl">{title}</h3>
                <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink/60 transition-colors duration-500 group-hover:text-paper/70">{desc}</p>
              </div>
              <Arrow className="mt-2 h-5 w-5 -rotate-45 transition-transform duration-500 ease-out-expo group-hover:rotate-0" />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
