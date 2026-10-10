import { Lines, Rise } from "../components/Reveal";
import { Arrow } from "../components/Icons";
import { Link } from "react-router-dom";
import { PACKAGES as tiers } from "../data/packages";

export default function Packages({ n = "04" }) {
  return (
    <section id="packages" className="wrap py-24 md:py-40">
      <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div>
          <p className="label text-mute">({n}) Partner packages</p>
          <Lines
            className="mt-6 text-[clamp(40px,5.6vw,92px)] font-medium leading-[0.95] tracking-[-0.05em]"
            lines={["Choose how deep", <span className="text-mute">we go together.</span>]}
          />
        </div>
        <p className="max-w-sm text-[15px] leading-relaxed text-ink/70">
          Every package is a monthly engagement with a guarantee on every contracted asset. Fees are
          shared on a short call, once we confirm a seat is open in your industry.
        </p>
      </div>

      <div className="mt-16 grid gap-4 md:grid-cols-3">
        {tiers.map((t, i) => {
          const f = t.featured;
          return (
            <Rise key={t.name} delay={i * 0.1}>
              <article
                className={
                  "flex h-full min-h-[520px] flex-col rounded-[28px] border p-8 transition-transform duration-700 ease-out-expo hover:-translate-y-2 " +
                  (f ? "border-ink bg-ink text-paper" : "border-line")
                }
              >
                <div className="flex items-center justify-between">
                  <span className={"label " + (f ? "text-paper/50" : "text-mute")}>{t.tag} · {t.term}</span>
                  <span className={"label " + (f ? "text-paper/50" : "text-mute")}>0{i + 1}</span>
                </div>
                <h3 className="mt-10 text-5xl tracking-[-0.045em]">{t.name}</h3>
                <p className={"mt-4 leading-relaxed " + (f ? "text-paper/70" : "text-ink/60")}>{t.desc}</p>
                <ul className="mt-8 space-y-3 text-sm">
                  {t.items.map((it) => (
                    <li key={it} className={"flex gap-3 border-t pt-3 " + (f ? "border-paper/15" : "border-line")}>
                      <span className={"mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full " + (f ? "bg-paper" : "bg-ink")} />
                      {it}
                    </li>
                  ))}
                </ul>
                <Link
                  to={`/start?package=${t.id}`}
                  className={"group mt-auto flex items-center justify-between pt-10 text-left " + (f ? "text-paper" : "")}
                >
                  <span className="text-lg">{t.id === "embedded" ? "Plan the long term" : "Apply for a seat"}</span>
                  <span
                    className={
                      "grid h-11 w-11 place-items-center rounded-full transition-transform duration-500 ease-out-expo group-hover:rotate-[-45deg] " +
                      (f ? "bg-paper text-ink" : "bg-ink text-paper")
                    }
                  >
                    <Arrow className="h-4 w-4" />
                  </span>
                </Link>
              </article>
            </Rise>
          );
        })}
      </div>
    </section>
  );
}
