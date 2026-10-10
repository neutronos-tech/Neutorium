import PageHeader from "../components/PageHeader";
import Rows from "../components/Rows";
import { Lines, Rise } from "../components/Reveal";
import Contact from "../sections/Contact";

const principles = [
  { title: "Research before we speak", text: "We study every company before the first conversation, and never claim research we have not done." },
  { title: "Promise delivery, not miracles", text: "We guarantee every contracted asset. We never promise a number of clients, leads or revenue." },
  { title: "Scarcity that is real", text: "Fifteen seats per industry is a capacity limit, not a sales tactic. The count you see is the count we have." },
  { title: "Proof over claims", text: "We show real work and real numbers, and never invent past clients or results." },
  { title: "One standard, any scope", text: "A smaller budget means a smaller scope, never lower quality or a discounted version of the same work." },
];

const team = [
  ["Research", "Market studies, competitor scans, positioning and baselines."],
  ["Design", "Brand identity, web design, product design and UX/UI."],
  ["Engineering", "Websites, web apps, automations and custom AI agents."],
  ["Film", "Premium reels and long-form project films."],
];

export default function About() {
  return (
    <>
      <PageHeader
        label="About"
        lines={["A studio for", "companies whose", <span className="text-mute">work deserves more.</span>]}
        text="Neutorium is a research-led digital studio. We build the presence and the systems that let great companies be found, trusted and chosen online."
      />

      <section className="wrap border-t border-line py-24 md:py-40">
        <p className="label mb-10 text-mute">(01) Our view</p>
        <Rise>
          <p className="max-w-[26ch] text-[clamp(30px,4.6vw,76px)] font-light leading-[1.06] tracking-[-0.035em]">
            Most companies do remarkable work and present it as an afterthought. We close the distance between
            how good the work is and how good it <em className="font-serif font-normal">looks.</em>
          </p>
        </Rise>
      </section>

      <section className="wrap grid gap-16 border-t border-line py-24 md:grid-cols-12 md:py-40">
        <div className="md:col-span-5">
          <div className="md:sticky md:top-28">
            <p className="label text-mute">(02) Principles</p>
            <Lines
              className="mt-6 text-[clamp(40px,5.6vw,92px)] font-medium leading-[0.95] tracking-[-0.05em]"
              lines={["Rules we", <span className="text-mute">do not bend.</span>]}
            />
            <p className="mt-8 max-w-md text-[15px] leading-relaxed text-ink/70">
              They shape how we sell, deliver and report. Every partner gets the same rules, whatever the package.
            </p>
          </div>
        </div>
        <div className="md:col-span-7"><Rows items={principles} /></div>
      </section>

      <section className="wrap grid gap-16 border-t border-line py-24 md:grid-cols-12 md:py-40">
        <div className="md:col-span-5">
          <p className="label text-mute">(03) Industries</p>
          <Lines
            className="mt-6 text-[clamp(40px,5.6vw,92px)] font-medium leading-[0.95] tracking-[-0.05em]"
            lines={["Not one industry.", <span className="text-mute">One at a time.</span>]}
          />
        </div>
        <div className="space-y-5 text-[15px] leading-relaxed text-ink/70 md:col-span-6 md:col-start-7 md:self-end">
          <p>
            We open an industry only after we have studied it, and we give each one fifteen partner seats. As the
            team grows, we open the next, sometimes two or three in parallel.
          </p>
          <p>
            What stays constant: research before delivery, a guarantee on every contracted asset, and a team small
            enough to know every partner by name.
          </p>
        </div>
      </section>

      <section className="wrap border-t border-line py-24 md:py-40">
        <p className="label text-mute">(04) How we are built</p>
        <dl className="mt-12 grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {team.map(([t, d], i) => (
            <Rise key={t} delay={i * 0.08} className="border-t border-ink/15 pt-4">
              <dt className="text-3xl tracking-[-0.03em]">{t}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-mute">{d}</dd>
            </Rise>
          ))}
        </dl>
      </section>

      <Contact n="05" />
    </>
  );
}
