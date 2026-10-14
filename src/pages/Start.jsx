import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useReady } from "../lib/ready";
import { resetScroll } from "../lib/smooth";
import { cn, pad } from "../lib/utils";
import { Arrow, Check, Plus } from "../components/Icons";
import { CATEGORIES } from "../data/services";
import { useContent } from "../lib/content";
import { cmsPost } from "../lib/cms";
import { PACKAGES, packageById } from "../data/packages";
import { SEATS_PER_INDUSTRY, CMS_URL, FORM_ENDPOINT } from "../data/site";

// Content (from the CMS or built-in data) for the helpers below, which live outside the
// component. Start assigns it on every render before any helper runs.
let C = null;
const serviceBySlug = (slug) => C.serviceBySlug(slug);
const servicesIn = (cat) => C.servicesIn(cat);

const ease = [0.16, 1, 0.3, 1];
const STORE = "neutorium-brief-v1";

const PATHS = [
  { id: "partnership", title: "A partnership package", text: "The 90-day system: research, website, films and an inquiry system, delivered together." },
  { id: "custom", title: "Build my own package", text: "Pick individual services, from a market research report to a website or a set of films." },
  { id: "unsure", title: "Not sure yet", text: "Tell us about the business and goals. We will recommend a route and send a free presence snapshot." },
];

const EXTRA_INDUSTRIES = [
  { slug: "other", name: "Another industry", detail: "Tell us which one below" },
];

const GOALS = [
  "More qualified inquiries",
  "A premium online presence",
  "A new or better website",
  "Consistent video content",
  "Never lose a lead again",
  "Understand my market",
  "Launch a digital product",
  "Show up in search and AI answers",
];

const TIMELINES = ["As soon as possible", "Within 1 to 3 months", "In 3 to 6 months", "Just exploring"];
const CONTACT_PREFS = ["Email", "WhatsApp", "Phone call"];

const EMPTY = {
  path: null, pkg: null, services: [],
  industry: null, industryOther: "", company: "", website: "", location: "",
  goals: [], timeline: null, notes: "",
  name: "", role: "", email: "", phone: "", contactPref: "Email",
};

const STEP_META = {
  path: ["Route", "How would you like to work with us?"],
  package: ["Package", "Choose your partnership package."],
  services: ["Services", "Pick the services your project needs."],
  business: ["Business", "Tell us about your company."],
  goals: ["Goals", "What should this project change?"],
  contact: ["Contact", "Who should we talk to?"],
  review: ["Review", "Check your brief, then send it."],
};

const load = () => {
  try { return JSON.parse(localStorage.getItem(STORE)) || null; } catch { return null; }
};
const save = (v) => {
  try { localStorage.setItem(STORE, JSON.stringify(v)); } catch { /* storage unavailable */ }
};
const clear = () => {
  try { localStorage.removeItem(STORE); } catch { /* storage unavailable */ }
};

const validEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

function stepsFor(path) {
  const mid = path === "partnership" ? ["package"] : path === "custom" ? ["services"] : [];
  return ["path", ...mid, "business", "goals", "contact", "review"];
}

function recommend(d) {
  if (d.path === "partnership") return packageById(d.pkg);
  if (d.path === "unsure") {
    const g = d.goals;
    if (g.includes("Show up in search and AI answers")) return packageById("embedded");
    if (g.includes("Launch a digital product") || (g.length === 1 && g[0] === "Understand my market")) return null;
    return packageById(g.length >= 3 ? "growth" : "foundation");
  }
  return null;
}

export default function Start() {
  C = useContent();
  const ready = useReady();
  const [params] = useSearchParams();

  const [data, setData] = useState(() => {
    const base = { ...EMPTY, ...(load() || {}) };
    const p = params.get("path");
    const pk = params.get("package");
    const sv = params.get("service");
    if (pk && packageById(pk)) Object.assign(base, { path: "partnership", pkg: pk });
    else if (p && ["partnership", "custom", "unsure"].includes(p)) base.path = p;
    if (sv && serviceBySlug(sv)) {
      base.path = "custom";
      if (!base.services.includes(sv)) base.services = [...base.services, sv];
    }
    return base;
  });

  const steps = stepsFor(data.path);
  const [idx, setIdx] = useState(() => (params.get("path") || params.get("package") || params.get("service") ? 1 : 0));
  const [dir, setDir] = useState(1);
  const [visited, setVisited] = useState(() => new Set([0, 1].slice(0, idx + 1)));
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [summaryOpen, setSummaryOpen] = useState(false);
  const headRef = useRef(null);

  const step = steps[Math.min(idx, steps.length - 1)];
  const set = (patch) => setData((d) => ({ ...d, ...patch }));
  const toggle = (key, v) => setData((d) => ({ ...d, [key]: d[key].includes(v) ? d[key].filter((x) => x !== v) : [...d[key], v] }));

  useEffect(() => save(data), [data]);

  const errors = useMemo(() => validate(step, data), [step, data]);
  const ok = Object.keys(errors).length === 0;

  const go = (to) => {
    if (to === idx || to < 0 || to >= steps.length) return;
    setDir(to > idx ? 1 : -1);
    setIdx(to);
    setTouched(false);
    setVisited((v) => new Set(v).add(to));
    resetScroll();
    setTimeout(() => headRef.current?.focus({ preventScroll: true }), 450);
  };
  const next = () => {
    if (!ok) return setTouched(true);
    go(idx + 1);
  };
  const back = () => go(idx - 1);

  // The step list changes when the route changes; keep later steps unvisited.
  const choosePath = (id) => {
    if (id !== data.path) setVisited(new Set([0]));
    set({ path: id });
    setTimeout(() => { setDir(1); setIdx(1); setVisited((v) => new Set(v).add(1)); }, 260);
  };

  const submit = async () => {
    setStatus("sending");
    const brief = buildBrief(data);
    try {
      const services = data.services.map((s) => serviceBySlug(s)?.name).filter(Boolean);
      if (CMS_URL) {
        const industry = data.industry === "other" ? data.industryOther : [...C.industries, ...EXTRA_INDUSTRIES].find((i) => i.slug === data.industry)?.name;
        await cmsPost("enquiries", {
          name: data.name, role: data.role, email: data.email, phone: data.phone, contactPref: data.contactPref,
          company: data.company, industry, location: data.location, website: data.website,
          route: data.path, package: data.pkg || null, services, goals: data.goals, timeline: data.timeline,
          notes: data.notes, brief,
        });
      } else if (FORM_ENDPOINT) {
        const res = await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ ...data, services, brief }),
        });
        if (!res.ok) throw new Error("Request failed");
      } else {
        const subject = `Project brief: ${data.company || data.name}`;
        window.location.href = `mailto:${C.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(brief)}`;
      }
      setStatus("sent");
      clear();
    } catch {
      setStatus("error");
    }
  };

  const restart = () => {
    clear();
    setData(EMPTY);
    setStatus("idle");
    setVisited(new Set([0]));
    setDir(-1);
    setIdx(0);
  };

  if (status === "sent") return <Sent data={data} onRestart={restart} />;

  const [stepLabel, stepTitle] = STEP_META[step];
  const progress = (idx + 1) / steps.length;

  return (
    <section className="relative min-h-[100svh] bg-paper pt-24 md:pt-28">
      <div className="wrap grid gap-10 pb-0 lg:grid-cols-12 lg:gap-14 lg:pb-24">
        {/* Navigator */}
        <aside className="lg:col-span-4 xl:col-span-3">
          <div className="lg:sticky lg:top-28">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={ready ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 0.9, ease, delay: 0.3 }}>
              <p className="label text-mute">Project builder</p>
              <h1 className="mt-4 text-[clamp(40px,4vw,60px)] font-medium leading-[0.95] tracking-[-0.05em]">Start a project</h1>

              {/* Mobile progress */}
              <div className="mt-6 lg:hidden">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink">Step {idx + 1} of {steps.length} · {stepLabel}</span>
                  <button onClick={() => setSummaryOpen((o) => !o)} className="label text-mute" aria-expanded={summaryOpen}>
                    {summaryOpen ? "Hide" : "Your project"}
                  </button>
                </div>
                <div className="mt-3 h-[3px] overflow-hidden rounded-full bg-ink/10">
                  <motion.div className="h-full origin-left rounded-full bg-ink" animate={{ scaleX: progress }} transition={{ duration: 0.7, ease }} />
                </div>
                <AnimatePresence initial={false}>
                  {summaryOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.5, ease }} className="overflow-hidden">
                      <div className="pt-5"><Summary data={data} /></div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Desktop step list */}
              <ol className="mt-10 hidden lg:block">
                {steps.map((s, i) => {
                  const done = i < idx;
                  const can = visited.has(i) || i <= idx;
                  return (
                    <li key={s}>
                      <button
                        onClick={() => can && go(i)}
                        disabled={!can}
                        className={cn("group flex w-full items-center gap-4 py-2.5 text-left transition-opacity", !can && "opacity-40")}
                      >
                        <span
                          className={cn(
                            "grid h-8 w-8 shrink-0 place-items-center rounded-full border text-[12px] transition-all duration-500",
                            i === idx ? "border-ink bg-ink text-paper" : done ? "border-ink/30 bg-ink/10 text-ink" : "border-ink/20 text-mute"
                          )}
                        >
                          {done ? <Check className="h-3.5 w-3.5" /> : pad(i + 1)}
                        </span>
                        <span className={cn("text-[15px] transition-colors", i === idx ? "text-ink" : "text-ink/60 group-hover:text-ink")}>{STEP_META[s][0]}</span>
                      </button>
                    </li>
                  );
                })}
              </ol>
              <div className="mt-10 hidden lg:block"><Summary data={data} /></div>
            </motion.div>
          </div>
        </aside>

        {/* Step content */}
        <div className="lg:col-span-8 xl:col-span-8 xl:col-start-5">
          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <motion.div
              key={step}
              custom={dir}
              initial={{ opacity: 0, x: dir * 50 }}
              animate={{ opacity: 1, x: 0, transition: { duration: 0.6, ease } }}
              exit={{ opacity: 0, x: dir * -40, transition: { duration: 0.3, ease: [0.76, 0, 0.24, 1] } }}
            >
              <p className="label text-mute">Step {pad(idx + 1)} / {pad(steps.length)}</p>
              <h2 ref={headRef} tabIndex={-1} className="mt-3 text-[clamp(34px,4.6vw,72px)] font-medium leading-[0.95] tracking-[-0.05em] outline-none">{stepTitle}</h2>

              <div className="mt-10">
                {step === "path" && <PathStep value={data.path} onPick={choosePath} />}
                {step === "package" && <PackageStep value={data.pkg} onPick={(id) => set({ pkg: id })} onCustom={() => choosePath("custom")} />}
                {step === "services" && <ServicesStep data={data} toggle={(s) => toggle("services", s)} onPartnership={() => { set({ path: "partnership", pkg: "growth" }); setVisited(new Set([0, 1])); }} />}
                {step === "business" && <BusinessStep data={data} set={set} errors={touched ? errors : {}} />}
                {step === "goals" && <GoalsStep data={data} set={set} toggle={toggle} errors={touched ? errors : {}} />}
                {step === "contact" && <ContactStep data={data} set={set} errors={touched ? errors : {}} onEnter={next} />}
                {step === "review" && <ReviewStep data={data} steps={steps} go={go} />}
              </div>

              {touched && !ok && (
                <p role="alert" className="mt-6 text-sm text-ink">Please complete the highlighted fields to continue.</p>
              )}
              {status === "error" && (
                <p role="alert" className="mt-6 text-sm text-ink">
                  Something went wrong sending your brief. Please try again, or write to <a className="underline" href={"mailto:" + C.email}>{C.email}</a>.
                </p>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Controls: sticky on phones so the next action is always in reach */}
          {step !== "path" && (
            <div className="sticky bottom-0 z-40 -mx-4 mt-12 border-t border-ink/10 bg-paper/90 px-4 py-3 backdrop-blur-xl sm:-mx-7 sm:px-7 lg:static lg:mx-0 lg:mt-14 lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
              <div className="flex items-center justify-between gap-3">
                <button onClick={back} className="flex h-12 items-center gap-2 rounded-full px-4 text-[15px] text-ink transition-colors hover:bg-ink/5">
                  <Arrow className="h-4 w-4 rotate-180" /> Back
                </button>
                {step === "review" ? (
                  <Pill onClick={submit} disabled={status === "sending"}>
                    {status === "sending" ? "Sending" : CMS_URL || FORM_ENDPOINT ? "Send my brief" : "Send via email"}
                  </Pill>
                ) : (
                  <Pill onClick={next} aria-disabled={!ok} className={cn(!ok && "opacity-60")}>
                    Continue
                  </Pill>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function validate(step, d) {
  const e = {};
  if (step === "path" && !d.path) e.path = true;
  if (step === "package" && !d.pkg) e.pkg = true;
  if (step === "services" && d.services.length === 0) e.services = true;
  if (step === "business") {
    if (!d.industry) e.industry = true;
    if (d.industry === "other" && !d.industryOther.trim()) e.industryOther = true;
    if (!d.company.trim()) e.company = true;
  }
  if (step === "goals") {
    if (d.goals.length === 0) e.goals = true;
    if (!d.timeline) e.timeline = true;
  }
  if (step === "contact") {
    if (!d.name.trim()) e.name = true;
    if (!validEmail(d.email)) e.email = true;
  }
  return e;
}

/* ---------- Steps ---------- */

function PathStep({ value, onPick }) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {PATHS.map((p, i) => {
        const on = value === p.id;
        return (
          <motion.button
            key={p.id}
            onClick={() => onPick(p.id)}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.1 + i * 0.07 }}
            aria-pressed={on}
            className={cn(
              "group relative flex min-h-[240px] flex-col justify-end rounded-[28px] border p-7 text-left transition-[transform,background-color,color] duration-700 ease-out-expo hover:-translate-y-1.5 md:min-h-[360px]",
              on ? "border-ink bg-ink text-paper" : "border-line hover:border-ink/40"
            )}
          >
            <span className={cn("label absolute left-7 top-7", on ? "text-paper/50" : "text-mute")}>{pad(i + 1)}</span>
            <span className={cn("absolute right-6 top-6 grid h-11 w-11 place-items-center rounded-full transition-transform duration-500 ease-out-expo group-hover:rotate-[-45deg]", on ? "bg-paper text-ink" : "bg-ink text-paper")}>
              {on ? <Check className="h-4 w-4" /> : <Arrow className="h-4 w-4" />}
            </span>
            <span className="text-3xl tracking-[-0.04em] md:text-4xl">{p.title}</span>
            <span className={cn("mt-3 text-[15px] leading-relaxed", on ? "text-paper/70" : "text-ink/60")}>{p.text}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

function PackageStep({ value, onPick, onCustom }) {
  return (
    <>
      <div className="grid gap-3 xl:grid-cols-3">
        {PACKAGES.map((p) => {
          const on = value === p.id;
          return (
            <button
              key={p.id}
              onClick={() => onPick(p.id)}
              aria-pressed={on}
              className={cn(
                "flex flex-col rounded-[24px] border p-6 text-left transition-all duration-500 md:p-7",
                on ? "border-ink bg-ink text-paper" : "border-ink/12 bg-paper text-ink hover:border-ink/40"
              )}
            >
              <div className="flex items-center justify-between">
                <span className={cn("label", on ? "text-paper/50" : "text-mute")}>{p.tag} · {p.term}</span>
                <span className={cn("grid h-7 w-7 place-items-center rounded-full border transition-colors", on ? "border-paper bg-paper text-ink" : "border-ink/25")}>
                  {on && <Check className="h-3.5 w-3.5" />}
                </span>
              </div>
              <span className="mt-6 text-5xl leading-none tracking-[-0.045em]">{p.name}</span>
              {p.featured && <span className={cn("label mt-3", on ? "text-paper" : "text-ink")}>Most chosen</span>}
              <span className={cn("mt-4 text-[15px]", on ? "text-paper/70" : "text-ink/75")}>{p.desc}</span>
              <ul className="mt-6 space-y-2 text-sm">
                {p.items.map((it) => (
                  <li key={it} className="flex gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 opacity-70" />
                    {it}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>
      <p className="mt-6 text-sm text-ink/70">
        Fees are discussed on a short call after we review your brief.{" "}
        <button onClick={onCustom} className="link-u text-ink">Prefer to pick individual services?</button>
      </p>
    </>
  );
}

function ServicesStep({ data, toggle, onPartnership }) {
  const [open, setOpen] = useState(() => CATEGORIES.map((c) => c.id));
  const overlap = data.services.filter((s) => serviceBySlug(s)?.pkg.includes("growth")).length;

  return (
    <div>
      <AnimatePresence>
        {overlap >= 4 && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mb-6 flex flex-col gap-4 rounded-[20px] border border-ink/15 p-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[15px] text-ink">Your selection covers most of the <strong className="font-medium">Growth</strong> package, which bundles them with a delivery guarantee.</p>
              <button onClick={onPartnership} className="label shrink-0 rounded-full bg-ink px-4 py-2.5 text-paper">Switch to Growth</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {CATEGORIES.map((c) => {
          const isOpen = open.includes(c.id);
          const count = servicesIn(c.id).filter((s) => data.services.includes(s.slug)).length;
          return (
            <div key={c.id} className="overflow-hidden rounded-[24px] border border-ink/10">
              <button
                onClick={() => setOpen((o) => (isOpen ? o.filter((x) => x !== c.id) : [...o, c.id]))}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-4 p-5 text-left md:p-6"
              >
                <span className="flex-1">
                  <span className="block text-2xl leading-none tracking-[-0.03em]">{c.name}</span>
                  <span className="mt-1 block text-sm text-mute">{c.short}</span>
                </span>
                {count > 0 && <span className="label rounded-full bg-ink px-2.5 py-1 text-paper">{count}</span>}
                <Plus className={cn("h-5 w-5 shrink-0 text-ink transition-transform duration-500 ease-out-expo", isOpen && "rotate-45")} />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.5, ease }} className="overflow-hidden">
                    <div className="grid gap-2 px-3 pb-3 sm:grid-cols-2 md:px-4 md:pb-4">
                      {servicesIn(c.id).map((s) => {
                        const on = data.services.includes(s.slug);
                        return (
                          <button
                            key={s.slug}
                            onClick={() => toggle(s.slug)}
                            aria-pressed={on}
                            className={cn(
                              "flex items-start gap-3 rounded-[18px] border p-4 text-left transition-all duration-300",
                              on ? "border-ink bg-ink text-paper" : "border-ink/10 bg-paper hover:border-ink/35"
                            )}
                          >
                            <span className={cn("mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border transition-colors", on ? "border-paper bg-paper text-ink" : "border-ink/30")}>
                              {on && <Check className="h-3 w-3" />}
                            </span>
                            <span className="flex-1">
                              <span className="block text-[15px] font-medium">{s.name}</span>
                              <span className={cn("mt-0.5 block text-[13px]", on ? "text-paper/70" : "text-mute")}>{s.summary}</span>
                              <span className={cn("label mt-2 block text-[10px]", on ? "text-paper/70" : "text-mute")}>{s.timeline}</span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BusinessStep({ data, set, errors }) {
  const all = [...C.industries, ...EXTRA_INDUSTRIES];
  return (
    <div className="space-y-10">
      <fieldset>
        <legend className={cn("label mb-4", errors.industry ? "text-ink" : "text-mute")}>Industry {errors.industry && "· required"}</legend>
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {all.map((ind) => {
            const on = data.industry === ind.slug;
            const known = C.industries.find((i) => i.slug === ind.slug);
            const note = known
              ? known.status === "research" ? "In research · join the early list" : `${SEATS_PER_INDUSTRY - known.filled} of ${SEATS_PER_INDUSTRY} seats open`
              : ind.detail;
            return (
              <button
                key={ind.slug}
                onClick={() => set({ industry: ind.slug })}
                aria-pressed={on}
                className={cn(
                  "rounded-[18px] border p-4 text-left transition-all duration-300",
                  on ? "border-ink bg-ink text-paper" : "border-ink/12 hover:border-ink/40",
                  errors.industry && !on && "border-ink/40"
                )}
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="text-[15px] font-medium">{ind.name}</span>
                  {known?.status === "open" && <span className={cn("h-2 w-2 rounded-full", on ? "bg-paper" : "bg-ink")} />}
                </span>
                <span className={cn("mt-1 block text-[13px]", on ? "text-paper/70" : "text-mute")}>{note}</span>
              </button>
            );
          })}
        </div>
        {data.industry === "other" && (
          <Field className="mt-4" label="Your industry" value={data.industryOther} onChange={(v) => set({ industryOther: v })} error={errors.industryOther} placeholder="e.g. Education" autoFocus />
        )}
      </fieldset>
      <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2">
        <Field label="Company name" value={data.company} onChange={(v) => set({ company: v })} error={errors.company} autoComplete="organization" />
        <Field label="City or service area" value={data.location} onChange={(v) => set({ location: v })} placeholder="Optional" autoComplete="address-level2" />
        <Field className="sm:col-span-2" label="Website or main social page" value={data.website} onChange={(v) => set({ website: v })} placeholder="Optional, helps us prepare your snapshot" type="url" />
      </div>
    </div>
  );
}

function GoalsStep({ data, set, toggle, errors }) {
  return (
    <div className="space-y-10">
      <fieldset>
        <legend className={cn("label mb-4", errors.goals ? "text-ink" : "text-mute")}>Pick all that apply {errors.goals && "· choose at least one"}</legend>
        <div className="flex flex-wrap gap-2">
          {GOALS.map((g) => {
            const on = data.goals.includes(g);
            return (
              <button
                key={g}
                onClick={() => toggle("goals", g)}
                aria-pressed={on}
                className={cn(
                  "flex items-center gap-2 rounded-full border px-4 py-2.5 text-[15px] transition-all duration-300",
                  on ? "border-ink bg-ink text-paper" : "border-ink/15 text-ink hover:border-ink/40"
                )}
              >
                <span className={cn("transition-transform duration-300", on ? "rotate-45" : "")}><Plus className="h-3.5 w-3.5" /></span>
                {g}
              </button>
            );
          })}
        </div>
      </fieldset>
      <fieldset>
        <legend className={cn("label mb-4", errors.timeline ? "text-ink" : "text-mute")}>When would you like to start? {errors.timeline && "· required"}</legend>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {TIMELINES.map((t) => {
            const on = data.timeline === t;
            return (
              <button
                key={t}
                onClick={() => set({ timeline: t })}
                aria-pressed={on}
                className={cn("rounded-[18px] border p-4 text-left text-[15px] transition-all duration-300", on ? "border-ink bg-ink text-paper" : "border-ink/12 hover:border-ink/40")}
              >
                {t}
              </button>
            );
          })}
        </div>
      </fieldset>
      <Field as="textarea" label="Anything else we should know?" value={data.notes} onChange={(v) => set({ notes: v })} placeholder="Optional: your current situation, a project you are proud of, or a question" />
    </div>
  );
}

function ContactStep({ data, set, errors, onEnter }) {
  const enter = (e) => e.key === "Enter" && onEnter();
  return (
    <div className="space-y-10">
      <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2" onKeyDown={enter}>
        <Field label="Your name" value={data.name} onChange={(v) => set({ name: v })} error={errors.name} autoComplete="name" />
        <Field label="Role" value={data.role} onChange={(v) => set({ role: v })} placeholder="Optional, e.g. Founder" autoComplete="organization-title" />
        <Field label="Email" type="email" value={data.email} onChange={(v) => set({ email: v })} error={errors.email} errorText="Enter a valid email" autoComplete="email" />
        <Field label="Phone or WhatsApp" type="tel" value={data.phone} onChange={(v) => set({ phone: v })} placeholder="Optional" autoComplete="tel" />
      </div>
      <fieldset>
        <legend className="label mb-4 text-mute">Best way to reach you</legend>
        <div className="flex flex-wrap gap-2">
          {CONTACT_PREFS.map((c) => (
            <button
              key={c}
              onClick={() => set({ contactPref: c })}
              aria-pressed={data.contactPref === c}
              className={cn("rounded-full border px-5 py-2.5 text-[15px] transition-all duration-300", data.contactPref === c ? "border-ink bg-ink text-paper" : "border-ink/15 hover:border-ink/40")}
            >
              {c}
            </button>
          ))}
        </div>
      </fieldset>
      <p className="max-w-xl text-sm text-mute">We use these details only to reply to this brief. No newsletters, no sharing.</p>
    </div>
  );
}

function ReviewStep({ data, steps, go }) {
  const rec = recommend(data);
  const ind = [...C.industries, ...EXTRA_INDUSTRIES].find((i) => i.slug === data.industry);
  const rows = [
    ["Route", PATHS.find((p) => p.id === data.path)?.title, "path"],
    data.path === "partnership" && ["Package", packageById(data.pkg)?.name, "package"],
    data.path === "custom" && ["Services", data.services.map((s) => serviceBySlug(s)?.name).join(", "), "services"],
    ["Business", [data.company, data.industry === "other" ? data.industryOther : ind?.name, data.location].filter(Boolean).join(" · "), "business"],
    ["Goals", data.goals.join(", "), "goals"],
    ["Timeline", data.timeline, "goals"],
    data.notes && ["Notes", data.notes, "goals"],
    ["Contact", [data.name, data.role, data.email, data.phone].filter(Boolean).join(" · ") + ` · prefers ${data.contactPref}`, "contact"],
  ].filter(Boolean);

  return (
    <div>
      {data.path === "unsure" && (
        <div className="mb-8 rounded-[24px] bg-ink p-6 text-paper md:p-8">
          <p className="label text-paper/50">Our first suggestion</p>
          <p className="mt-3 text-4xl tracking-[-0.04em] text-paper">{rec ? `${rec.name} package` : "Start with research"}</p>
          <p className="mt-2 max-w-xl text-paper/70">
            {rec ? rec.desc : "A market research report or a presence audit first, then we decide together what to build."} We will confirm after reviewing your snapshot.
          </p>
        </div>
      )}
      <dl className="divide-y divide-line border-y border-line">
        {rows.map(([k, v, s]) => (
          <div key={k} className="grid gap-2 py-5 sm:grid-cols-[9rem_1fr_auto] sm:items-baseline sm:gap-6">
            <dt className="label text-mute">{k}</dt>
            <dd className="text-[15px] text-ink">{v || "Not provided"}</dd>
            <button onClick={() => go(steps.indexOf(s))} className="link-u justify-self-start text-sm text-mute hover:text-ink">Edit</button>
          </div>
        ))}
      </dl>
      <p className="mt-6 max-w-xl text-sm text-mute">
        {CMS_URL || FORM_ENDPOINT
          ? "We reply within two working days."
          : `Sending opens your email app with this brief addressed to ${C.email}. We reply within two working days.`}
      </p>
    </div>
  );
}

/* ---------- Pieces ---------- */

function Field({ label, value, onChange, error, errorText = "Required", as = "input", className = "", ...rest }) {
  const Tag = as;
  return (
    <label className={cn("block", className)}>
      <span className={cn("label", error ? "text-ink" : "text-mute")}>{label}{error && ` · ${errorText}`}</span>
      <Tag
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        rows={as === "textarea" ? 4 : undefined}
        className={cn(
          "mt-2 block w-full resize-none border-b bg-transparent py-3 text-lg text-ink outline-none transition-colors placeholder:text-mute/60 focus:border-ink",
          error ? "border-ink" : "border-ink/20"
        )}
        {...rest}
      />
    </label>
  );
}

function Summary({ data }) {
  const pkg = packageById(data.pkg);
  const services = data.services.map(serviceBySlug).filter(Boolean);
  const ind = [...C.industries, ...EXTRA_INDUSTRIES].find((i) => i.slug === data.industry);
  const empty = !data.path;
  return (
    <div className="rounded-[24px] border border-ink/10 bg-transparent p-5">
      <p className="label text-mute">Your project</p>
      {empty ? (
        <p className="mt-3 text-sm text-ink/70">Your choices will collect here as you go.</p>
      ) : (
        <div className="mt-3 space-y-3 text-sm">
          <p className="text-2xl leading-tight text-ink">
            {data.path === "partnership" ? (pkg ? `${pkg.name} partnership` : "Partnership") : data.path === "custom" ? "Custom package" : "Recommendation"}
          </p>
          {data.path === "custom" && (
            <ul className="space-y-1.5">
              <AnimatePresence initial={false}>
                {services.map((s) => (
                  <motion.li key={s.slug} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} className="flex justify-between gap-3 text-ink/80">
                    <span>{s.name}</span>
                    <span className="label shrink-0 text-[10px] text-mute">{s.timeline}</span>
                  </motion.li>
                ))}
              </AnimatePresence>
              {services.length === 0 && <li className="text-ink/60">No services yet</li>}
            </ul>
          )}
          {(ind || data.company) && (
            <p className="border-t border-ink/10 pt-3 text-ink/80">{[data.company, data.industry === "other" ? data.industryOther : ind?.name].filter(Boolean).join(" · ")}</p>
          )}
          {data.goals.length > 0 && <p className="text-ink/70">{data.goals.length} goal{data.goals.length > 1 ? "s" : ""} · {data.timeline || "timing open"}</p>}
        </div>
      )}
    </div>
  );
}

function Sent({ data, onRestart }) {
  const [copied, setCopied] = useState(false);
  const brief = buildBrief(data);
  const copy = async () => {
    try { await navigator.clipboard.writeText(brief); setCopied(true); } catch { setCopied(false); }
  };
  return (
    <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-ink pt-24 text-paper">
      <div className="wrap py-20">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="label text-paper/50">Brief ready</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease, delay: 0.1 }} className="mt-6 max-w-5xl text-[clamp(44px,8vw,130px)] font-medium leading-[0.92] tracking-[-0.055em]">
          Thank you{data.name ? `, ${data.name.split(" ")[0]}` : ""}. <span className="text-paper/40">We will be in touch.</span>
        </motion.h1>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease, delay: 0.3 }}>
          <p className="mt-8 text-[15px] leading-relaxed max-w-xl text-paper/70">
            {CMS_URL || FORM_ENDPOINT
              ? "Your brief has been sent. We reply within two working days."
              : `Your email app should have opened with the brief addressed to ${C.email}. If it did not, copy the brief and send it to us directly.`}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            {!(CMS_URL || FORM_ENDPOINT) && <Pill onClick={copy} light>{copied ? "Copied" : "Copy my brief"}</Pill>}
            <Link to="/" className="nav-link px-4 text-sm text-paper">Back to home</Link>
            <button onClick={onRestart} className="link-u px-4 text-sm text-paper/60">Start another project</button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function buildBrief(d) {
  const ind = [...C.industries, ...EXTRA_INDUSTRIES].find((i) => i.slug === d.industry);
  const lines = [
    "NEW PROJECT BRIEF",
    "",
    `Route: ${PATHS.find((p) => p.id === d.path)?.title || "-"}`,
    d.path === "partnership" && `Package: ${packageById(d.pkg)?.name || "-"}`,
    d.path === "custom" && `Services: ${d.services.map((s) => serviceBySlug(s)?.name).join(", ")}`,
    d.path === "unsure" && `Suggested: ${recommend(d)?.name || "Research first"}`,
    "",
    `Company: ${d.company}`,
    `Industry: ${d.industry === "other" ? d.industryOther : ind?.name || "-"}`,
    d.location && `Location: ${d.location}`,
    d.website && `Website: ${d.website}`,
    "",
    `Goals: ${d.goals.join(", ")}`,
    `Timeline: ${d.timeline || "-"}`,
    d.notes && `Notes: ${d.notes}`,
    "",
    `Name: ${d.name}${d.role ? ` (${d.role})` : ""}`,
    `Email: ${d.email}`,
    d.phone && `Phone/WhatsApp: ${d.phone}`,
    `Prefers: ${d.contactPref}`,
  ];
  return lines.filter((l) => l !== false && l !== undefined && l !== null && l !== "" ? true : l === "").join("\n");
}


// Same rolling-label pill as the "Start a project" button in the nav.
function Pill({ children, className = "", light = false, ...rest }) {
  return (
    <button
      className={cn(
        "group relative flex h-12 items-center gap-2 overflow-hidden rounded-full px-6 text-[15px] disabled:opacity-50",
        light ? "bg-paper text-ink" : "bg-ink text-paper",
        className
      )}
      {...rest}
    >
      <span className="relative block overflow-hidden">
        <span className="block transition-transform duration-500 ease-out-expo group-hover:-translate-y-full">{children}</span>
        <span aria-hidden="true" className="absolute inset-0 translate-y-full transition-transform duration-500 ease-out-expo group-hover:translate-y-0">{children}</span>
      </span>
      <Arrow className="h-4 w-4" />
    </button>
  );
}
