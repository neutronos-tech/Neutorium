import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { marked } from "marked";
import DOMPurify from "dompurify";
import PageHeader from "../components/PageHeader";
import Faq from "../components/Faq";
import Contact from "../sections/Contact";
import { useContent } from "../lib/content";
import NotFound from "./NotFound";

const fmt = (d) => (d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "");

export default function Article() {
  const { slug } = useParams();
  const { articleBySlug, source } = useContent();
  const a = articleBySlug(slug);
  const html = useMemo(() => (a?.body ? DOMPurify.sanitize(marked.parse(a.body)) : ""), [a?.body]);

  // Articles only exist in the CMS; wait for it before declaring a 404.
  if (!a) return source === "cms" ? <NotFound /> : <section className="wrap min-h-[60vh] pt-44" />;

  return (
    <>
      <PageHeader label={`Insights · ${fmt(a.date)}`} lines={[a.title]}>
        <div className="flex gap-6 text-sm md:justify-end">
          <Link to="/insights" className="nav-link">All insights</Link>
          <span className="text-mute">By {a.author}</span>
        </div>
      </PageHeader>

      <article className="wrap grid gap-16 border-t border-line py-20 md:grid-cols-12 md:py-28">
        <aside className="md:col-span-4">
          {(a.question || a.answer) && (
            <div className="rounded-[28px] border border-ink/15 p-7 md:sticky md:top-28">
              <p className="label text-mute">Short answer</p>
              {a.question && <h2 className="mt-4 text-2xl leading-tight tracking-[-0.03em]">{a.question}</h2>}
              {a.answer && <p className="mt-4 leading-relaxed text-ink/80">{a.answer}</p>}
            </div>
          )}
        </aside>
        <div className="prose-n md:col-span-7 md:col-start-6" dangerouslySetInnerHTML={{ __html: html }} />
      </article>

      {a.faqs.length > 0 && (
        <section className="wrap grid gap-16 border-t border-line py-24 md:grid-cols-12 md:py-32">
          <div className="md:col-span-4">
            <p className="label text-mute">Questions</p>
            <h2 className="mt-6 text-[clamp(32px,4vw,64px)] font-medium leading-[0.95] tracking-[-0.05em]">Related answers.</h2>
          </div>
          <Faq items={a.faqs} className="md:col-span-7 md:col-start-6" />
        </section>
      )}

      <Contact n="" />
    </>
  );
}
