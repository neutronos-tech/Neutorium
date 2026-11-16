import { Link, useSearchParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import Rows from "../components/Rows";
import Contact from "../sections/Contact";
import { useContent } from "../lib/content";

const TYPES = [
  ["articles", "Articles", "Short, direct answers from our team."],
  ["blogs", "Blogs", "Notes on brand, buyers and how decisions get made."],
  ["papers", "Research papers", "Longer studies, with method and sources."],
];

export default function Insights() {
  const { articles, source } = useContent();
  const [params] = useSearchParams();
  const type = TYPES.find(([id]) => id === params.get("type"))?.[0] || "articles";
  // Everything published so far is an article; blogs and papers fill as they are written.
  const items = type === "articles" ? articles : [];

  return (
    <>
      <PageHeader
        label="Research"
        lines={["Straight answers.", <span className="text-mute">No filler.</span>]}
        text="Articles, blogs and research papers from our team on brand, buyer decisions, digital presence and search."
      >
        <div className="flex flex-wrap gap-2 md:justify-end" role="tablist" aria-label="Type">
          {TYPES.map(([id, name]) => (
            <Link
              key={id}
              to={`/insights?type=${id}`}
              role="tab"
              aria-selected={id === type}
              className={"flex h-11 items-center rounded-full border px-5 text-sm transition-colors duration-300 " + (id === type ? "border-ink bg-ink text-paper" : "border-ink/15 hover:border-ink")}
            >
              {name}
            </Link>
          ))}
        </div>
      </PageHeader>
      <section className="wrap py-20 md:py-28">
        <p className="max-w-md text-[15px] leading-relaxed text-ink/60">{TYPES.find(([id]) => id === type)[2]}</p>
        <div className="mt-10">
          {items.length ? (
            <Rows items={items.map((a) => ({ title: a.title, text: a.answer, to: `/insights/${a.slug}` }))} />
          ) : (
            <p className="max-w-md border-t border-line pt-8 font-serif text-2xl leading-snug">
              {type === "articles" && source !== "cms" ? "Articles appear here once they are published in the CMS." : "The first ones are being written."}
            </p>
          )}
        </div>
      </section>
      <Contact />
    </>
  );
}
