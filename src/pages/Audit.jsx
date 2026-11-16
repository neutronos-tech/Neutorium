import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, animate } from "motion/react";
import PageHeader from "../components/PageHeader";
import { Lines } from "../components/Reveal";
import { Arrow, Check, Plus } from "../components/Icons";
import Contact from "../sections/Contact";
import { CMS_URL, WHATSAPP_URL } from "../data/site";
import { h2 } from "../lib/type";

const API = (CMS_URL || "") + "/api/audit/run";
const ease = [0.16, 1, 0.3, 1];
const STEPS = ["Opening your website", "Reading it the way search engines do", "Checking how a customer would reach you", "Scoring what we found", "Writing your summary"];
const FIELD = "h-12 w-full rounded-2xl border border-ink/15 bg-paper/60 px-4 outline-none transition-colors placeholder:text-ink/35 focus:border-ink focus:bg-white";

function Field({ label, hint, ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm">{label}{props.required ? "" : <span className="text-ink/45"> (optional)</span>}</span>
      <input className={FIELD} {...props} />
      {hint && <span className="mt-1.5 block text-xs text-ink/50">{hint}</span>}
    </label>
  );
}

// The score, drawn as a ring that fills while the number counts up.
function Score({ value }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const c = animate(0, value, { duration: 1.8, ease, onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [value]);
  const r = 86, len = 2 * Math.PI * r;
  return (
    <div className="relative mx-auto h-[220px] w-[220px]">
      <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="100" cy="100" r={r} fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="6" />
        <circle cx="100" cy="100" r={r} fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - n / 100)} />
      </svg>
      <p className="absolute inset-0 grid place-items-center text-center">
        <span>
          <span className="block text-7xl font-medium tracking-[-0.05em] tabular-nums">{n}</span>
          <span className="label text-paper/60">out of 100</span>
        </span>
      </p>
    </div>
  );
}

export default function Audit() {
  const [form, setForm] = useState({ business: "", website: "", social: "", maps: "", name: "", phone: "", email: "", website2: "" });
  const [state, setState] = useState("form"); // form | running | done
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  // The progress lines advance on a timer while the request is out.
  useEffect(() => {
    if (state !== "running") return;
    const id = setInterval(() => setStep((s) => Math.min(STEPS.length - 1, s + 1)), 1500);
    return () => clearInterval(id);
  }, [state]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setStep(0);
    setState("running");
    const started = Date.now();
    try {
      const res = await fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json().catch(() => ({}));
      // Let the progress read through at least once, so the result does not feel instant and careless.
      await new Promise((r) => setTimeout(r, Math.max(0, 5200 - (Date.now() - started))));
      if (!res.ok) {
        setState("form");
        return setError(
          data.error === "bad-url" ? "That website address does not look right. Check it and try again."
            : data.error === "unreachable" ? "We could not open that website. Check the address, or message us and we will look at it by hand."
            : res.status === 429 ? "Too many audits from here. Please try again in a few minutes."
            : data.error?.message || "Something went wrong on our side. Please try again in a moment."
        );
      }
      setResult(data);
      setState("done");
    } catch {
      setState("form");
      setError("We could not reach the audit service. Please try again in a moment.");
    }
  };

  const share = result && `Hi Neutorium. I ran the free audit for ${result.site} and scored ${result.score}/100. I'd like a person to look at it.`;

  return (
    <>
      <PageHeader
        label="Services / Free business audit"
        lines={["How does your business", <span className="text-mute">look to a customer?</span>]}
        text="Give us your website. In under a minute you get a score out of 100, what is working, and the gaps that are costing you customers. It is free."
      >
        <ul className="grid gap-3 text-sm text-ink/75">
          {["A score you can check: every point comes from a test we show you", "Three strengths and your three biggest gaps", "A person from our team can go deeper, if you want"].map((t) => (
            <li key={t} className="flex gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0" />{t}</li>
          ))}
        </ul>
      </PageHeader>

      {state !== "done" && (
        <section className="wrap pb-24 md:pb-36">
          <div className="mx-auto grid w-full max-w-[1180px] gap-12 md:grid-cols-12">
            <div className="md:col-span-5">
              <Lines className={h2} lines={["Tell us where", <span className="text-mute">to look.</span>]} />
              <p className="mt-8 max-w-sm text-[15px] leading-relaxed text-ink/70">
                The audit reads your website the way a search engine first sees it. Your social and map links go to our
                team, who look at those by hand.
              </p>
            </div>

            <div className="md:col-span-6 md:col-start-7">
              {state === "form" ? (
                <form onSubmit={submit} className="rounded-[28px] border border-ink/10 bg-white p-6 shadow-[0_40px_90px_-50px_rgba(116,21,22,0.45)] md:p-9">
                  <fieldset className="grid gap-5">
                    <legend className="mb-5 flex items-center gap-3 text-sm">
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-ink font-mono text-xs text-paper">1</span>
                      Your business
                    </legend>
                    <Field label="Business name" required value={form.business} onChange={set("business")} maxLength={120} autoComplete="organization" />
                    <Field label="Website" required value={form.website} onChange={set("website")} maxLength={300} placeholder="yourbusiness.com" inputMode="url" autoCapitalize="none" />
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="Google Maps link" value={form.maps} onChange={set("maps")} maxLength={300} placeholder="maps.app.goo.gl/..." inputMode="url" autoCapitalize="none" hint="Helps our team find your listing." />
                      <Field label="Instagram or Facebook" value={form.social} onChange={set("social")} maxLength={300} placeholder="instagram.com/you" inputMode="url" autoCapitalize="none" />
                    </div>
                  </fieldset>
                  <fieldset className="mt-9 grid gap-5 border-t border-ink/10 pt-8">
                    <legend className="mb-5 flex items-center gap-3 pt-8 text-sm">
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-ink font-mono text-xs text-paper">2</span>
                      Your information
                    </legend>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="Your name" required value={form.name} onChange={set("name")} maxLength={120} autoComplete="name" />
                      <Field label="WhatsApp number" required value={form.phone} onChange={set("phone")} maxLength={40} placeholder="+880..." inputMode="tel" autoComplete="tel" />
                    </div>
                    <Field label="Email" required type="email" value={form.email} onChange={set("email")} maxLength={160} autoComplete="email" hint="Used only to send your result and follow up on it. No newsletters, no sharing." />
                  </fieldset>
                  <input tabIndex={-1} autoComplete="off" value={form.website2} onChange={set("website2")} className="hidden" aria-hidden="true" />
                  {error && <p role="alert" className="mt-6 rounded-2xl border border-ink/20 bg-paper p-4 text-sm">{error}</p>}
                  <button className="group mt-8 flex h-14 w-full items-center justify-center gap-3 rounded-full bg-ink px-8 text-paper transition-transform duration-300 ease-out-expo hover:-translate-y-0.5 active:translate-y-0">
                    Run my free audit
                    <Arrow className="h-4 w-4 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
                  </button>
                  <p className="mt-3 text-center text-xs text-ink/50">Takes about ten seconds.</p>
                </form>
              ) : (
                <div className="living-night rounded-[28px] p-8 text-paper md:p-10" role="status" aria-live="polite">
                  <p className="label text-paper/50">Looking at {form.website}</p>
                  <ol className="mt-6 grid gap-4">
                    {STEPS.map((s, i) => (
                      <li key={s} className={"flex items-center gap-4 text-lg transition-opacity duration-500 " + (i <= step ? "opacity-100" : "opacity-30")}>
                        <span className={"grid h-7 w-7 shrink-0 place-items-center rounded-full border " + (i < step ? "border-paper bg-paper text-ink" : "border-paper/40")}>
                          {i < step ? <Check className="h-3.5 w-3.5" /> : i === step ? <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-paper" /> : null}
                        </span>
                        {s}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {state === "done" && result && (
        <>
          <section className="living-night text-paper">
            <div className="wrap py-20 md:py-28">
              <div className="mx-auto grid w-full max-w-[1180px] gap-12 md:grid-cols-12 md:items-center">
                <motion.div className="md:col-span-4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease }}>
                  <Score value={result.score} />
                  <p className="mt-5 text-center font-serif text-3xl italic">{result.grade}</p>
                </motion.div>
                <div className="md:col-span-7 md:col-start-6">
                  <p className="label text-paper/50">{result.site}</p>
                  <p className="mt-4 text-[clamp(24px,2.6vw,38px)] font-light leading-[1.2] tracking-[-0.02em]">{result.summary}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="wrap py-20 md:py-28">
            <div className="mx-auto grid w-full max-w-[1180px] gap-10 md:grid-cols-2">
              {[["What is working", result.strengths, Check], ["What is costing you customers", result.gaps, Plus]].map(([title, items, Icon]) => (
                <div key={title} className="rounded-[28px] border border-ink/10 bg-white p-8 md:p-10">
                  <h2 className="text-3xl tracking-[-0.03em]">{title}</h2>
                  <ul className="mt-6 grid gap-5">
                    {items.map((t, i) => (
                      <motion.li key={t} className="flex gap-4 leading-relaxed text-ink/80" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease, delay: 0.2 + i * 0.12 }}>
                        <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ink text-paper"><Icon className={"h-3 w-3 " + (Icon === Plus ? "rotate-45" : "")} /></span>
                        {t}
                      </motion.li>
                    ))}
                    {!items.length && <li className="text-ink/60">Nothing to list here.</li>}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mx-auto mt-10 w-full max-w-[1180px] rounded-[28px] border border-ink/10 bg-white p-8 md:p-10">
              <h2 className="text-3xl tracking-[-0.03em]">Every test, and what we found</h2>
              <ul className="mt-6 grid gap-x-10 sm:grid-cols-2">
                {result.checks.map((c) => (
                  <li key={c.id} className="flex gap-4 border-t border-ink/10 py-4">
                    <span className={"mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full " + (c.pass ? "bg-ink text-paper" : "border border-ink/30")}>
                      {c.pass ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3 rotate-45" />}
                    </span>
                    <span>
                      <span className="block">{c.label}</span>
                      <span className="mt-0.5 block text-sm text-ink/60">{c.found}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="living-night mx-auto mt-10 w-full max-w-[1180px] rounded-[28px] p-8 text-paper md:p-12">
              <p className="max-w-3xl font-serif text-[clamp(26px,3vw,44px)] leading-[1.12]">
                A machine can count what is on the page. It cannot tell whether your business is being understood.
              </p>
              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-paper/75">
                This is an automated first look at your website only. Your social pages, your map listing and how your
                customers actually decide need a person. Ask someone on our team to go through it with you.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={WHATSAPP_URL + "?text=" + encodeURIComponent(share)} target="_blank" rel="noopener" className="group inline-flex h-14 items-center gap-3 rounded-full bg-paper px-7 text-ink">
                  Talk to a person on WhatsApp
                  <Arrow className="h-4 w-4 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
                </a>
                <Link to="/start" className="inline-flex h-14 items-center rounded-full border border-paper/40 px-7">Start a project</Link>
                <button onClick={() => { setState("form"); setResult(null); }} className="inline-flex h-14 items-center px-3 text-sm underline underline-offset-4">Audit another site</button>
              </div>
            </div>
          </section>
        </>
      )}

      {state !== "done" && <Contact />}
    </>
  );
}
