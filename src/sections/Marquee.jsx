const words = ["Research", "Strategy", "Product", "Design", "Engineering", "Growth", "Automation", "Partnership"];

export default function Marquee() {
  return (
    <section aria-label="Capabilities" className="overflow-hidden border-y border-line py-6">
      <div className="marquee flex w-max">
        {[0, 1].map((k) => (
          <div key={k} aria-hidden={k === 1} className="flex shrink-0 items-center gap-10 pr-10">
            {words.map((w) => (
              <span key={w} className="flex items-center gap-10 text-[clamp(28px,4vw,56px)] font-light tracking-[-0.03em]">
                {w}
                <span className="h-2 w-2 rounded-full bg-ink" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
