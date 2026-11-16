import { Lines, Rise } from "../components/Reveal";
import { Ticker } from "../components/Motion";
import { CHALLENGES } from "../data/home";
import { h2 } from "../lib/type";

const Row = ({ items, start }) =>
  items.map(([title, text], i) => (
    <div key={title} className="mr-4 flex w-[300px] shrink-0 flex-col justify-between rounded-[24px] border border-ink/10 bg-white p-6 transition-colors duration-500 hover:border-ink hover:bg-ink hover:text-paper md:w-[380px] md:p-7">
      <span className="font-mono text-xs opacity-60">{String(start + i + 1).padStart(2, "0")}</span>
      <div className="mt-10">
        <h3 className="text-2xl tracking-[-0.03em] md:text-[28px]">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed opacity-70">{text}</p>
      </div>
    </div>
  ));

// The ten things that make change hard, drifting past in two rows. Hover a row to hold it still.
export default function Challenges({ n = "04" }) {
  const half = Math.ceil(CHALLENGES.length / 2);
  return (
    <section id="challenges" className="overflow-hidden py-24 md:py-40">
      <div className="wrap grid gap-10 md:grid-cols-12 md:items-end">
        <div className="md:col-span-8">
          <p className="label text-mute">Why it is hard</p>
          <Lines className={h2} lines={["You shouldn't have to", <span className="text-mute">carry all of it alone.</span>]} />
        </div>
        <Rise className="max-w-md text-[15px] leading-relaxed text-ink/70 md:col-span-4 md:col-start-9">
          Knowing what needs to change doesn't make change easy. It is rarely a lack of ambition or expertise. It is
          running a business while building its next stage.
        </Rise>
      </div>

      <div className="mt-14 space-y-4">
        <Ticker speed={2.2}><Row items={CHALLENGES.slice(0, half)} start={0} /></Ticker>
        <Ticker speed={2.2} reverse><Row items={CHALLENGES.slice(half)} start={half} /></Ticker>
      </div>
    </section>
  );
}
