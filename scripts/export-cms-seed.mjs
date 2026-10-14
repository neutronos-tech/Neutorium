// Writes cms/data/seed.json (the CMS's first-run content) from the website's built-in data,
// and docs/AEO-SEO-PLAN.md from cms/data/aeo-plan.json. Run: npm run cms:seed
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { SERVICES } from "../src/data/services.js";
import { FAQS } from "../src/data/faqs.js";
import { INDUSTRIES, EMAIL, SOCIALS, DESCRIPTION } from "../src/data/site.js";

const exampleArticle = {
  title: "What is answer engine optimisation (AEO)?",
  slug: "what-is-answer-engine-optimisation",
  question: "What is answer engine optimisation (AEO)?",
  answer:
    "Answer engine optimisation (AEO) is the practice of making a business easy for AI assistants such as ChatGPT, Perplexity and Google AI Overviews to understand, trust and quote. It combines crawlable pages, consistent business facts, structured data and content that answers real questions directly.",
  author: "Neutorium",
  body: [
    "## How is AEO different from SEO?",
    "",
    "SEO aims for a high position in a list of links. AEO aims to be the source an assistant quotes or recommends in its answer. The foundations overlap: a fast, crawlable website and helpful content. AEO adds a stronger focus on clear entities, short direct answers and evidence that other sites mention you.",
    "",
    "## What do answer engines look for?",
    "",
    "- Pages they can read without running JavaScript",
    "- The same business facts on the website and every profile",
    "- A direct answer near the top of the page",
    "- Structured data that labels services, questions and answers",
    "- Independent mentions, reviews and original data",
    "",
    "## Where should a company start?",
    "",
    "Start by checking how assistants answer the questions your buyers ask today, then fix crawlability and business facts before writing new content.",
  ].join("\n"),
  faqs: [
    { question: "Does AEO replace SEO?", answer: "No. AEO builds on SEO. Most answer engines use search indexes, so a site that is not indexed and trusted will rarely be quoted." },
    { question: "How long does AEO take?", answer: "Technical fixes can be done in weeks. Being cited consistently usually takes several months of publishing answer-first content and earning mentions." },
  ],
};

const seed = {
  services: SERVICES,
  industries: INDUSTRIES,
  faqs: FAQS,
  settings: { email: EMAIL, socials: SOCIALS, description: DESCRIPTION },
  exampleArticle,
};
writeFileSync(new URL("../cms/data/seed.json", import.meta.url), JSON.stringify(seed, null, 2) + "\n");

const plan = JSON.parse(readFileSync(new URL("../cms/data/aeo-plan.json", import.meta.url), "utf8"));
const lines = [
  `# ${plan.title}`,
  "",
  plan.intro,
  "",
  "> This document is generated from `cms/data/aeo-plan.json`, which also seeds the CMS task board. Edit the JSON, then run `npm run cms:seed`.",
  "",
  "## What is already built into the website",
  "",
  "- Every page is pre-rendered to HTML at build time, so crawlers and answer engines that do not run JavaScript read the full content.",
  "- Per-page titles, descriptions, canonical URLs and Open Graph tags.",
  "- JSON-LD structured data: Organization and ProfessionalService with an offer catalog, Service, FAQPage, Article with its main question, BreadcrumbList and WebSite.",
  "- Visible FAQs on Home, Partnership, Services and each service page, matching the FAQPage markup.",
  "- `sitemap.xml`, `robots.txt` (search and AI crawlers allowed), `llms.txt` and `llms-full.txt`, generated on every build.",
  "- Insights articles with a Question and a short Answer field, the format answer engines quote.",
  "",
];
let step = 0;
for (const phase of plan.phases) {
  lines.push(`## Phase ${phase.id}: ${phase.name} (${phase.when})`, "");
  for (const t of plan.tasks.filter((x) => x.phase === phase.id)) {
    step += 1;
    lines.push(`### ${step}. ${t.title}`, "", `Area: ${t.area} · Priority: ${t.priority}`, "", t.description, "");
    lines.push(...t.checklist.map((c) => `- [ ] ${c}`), "");
  }
}
mkdirSync(new URL("../docs/", import.meta.url), { recursive: true });
writeFileSync(new URL("../docs/AEO-SEO-PLAN.md", import.meta.url), lines.join("\n"));

console.log(`seed.json: ${SERVICES.length} services, ${INDUSTRIES.length} industries · plan: ${plan.tasks.length} tasks`);
