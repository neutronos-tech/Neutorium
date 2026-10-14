import PageHeader from "../components/PageHeader";
import Rows from "../components/Rows";
import Contact from "../sections/Contact";
import { useContent } from "../lib/content";

export default function Insights() {
  const { articles, source } = useContent();

  return (
    <>
      <PageHeader
        label="Insights"
        lines={["Straight answers.", <span className="text-mute">No filler.</span>]}
        text="Short, direct answers from our team on digital presence, client acquisition, SEO and answer engine optimisation."
      />
      <section className="wrap border-t border-line py-24 md:py-32">
        {articles.length ? (
          <Rows items={articles.map((a) => ({ title: a.title, text: a.answer, to: `/insights/${a.slug}` }))} />
        ) : (
          <p className="max-w-md text-[15px] leading-relaxed text-ink/70">
            {source === "cms" ? "The first answers are being written." : "Articles appear here once they are published in the CMS."}
          </p>
        )}
      </section>
      <Contact n="02" />
    </>
  );
}
