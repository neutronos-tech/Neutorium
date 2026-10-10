export const CATEGORIES = [
  {
    id: "research",
    name: "Research & strategy",
    short: "Know the market before you spend in it.",
    process: [
      ["Brief", "We agree the questions the research must answer and what decision it feeds."],
      ["Gather", "Competitor scans, customer conversations, channel audits and the numbers you already have."],
      ["Synthesise", "Patterns, gaps and a clear point of view, written for decision makers, not for a drawer."],
      ["Hand over", "A walkthrough session and a document your team can act on the same week."],
    ],
  },
  {
    id: "design",
    name: "Design",
    short: "Interfaces and identities that look as good as the work.",
    process: [
      ["Discover", "Goals, audience, references and constraints, gathered in a focused kickoff."],
      ["Structure", "Sitemaps, flows and wireframes so the logic is right before the polish."],
      ["Design", "High-fidelity screens and a reusable system, reviewed in two rounds."],
      ["Hand off", "Developer-ready files, specs and a recorded walkthrough."],
    ],
  },
  {
    id: "development",
    name: "Development",
    short: "Fast, mobile-first builds that are easy to run.",
    process: [
      ["Plan", "Stack, content model and integrations agreed in writing."],
      ["Build", "Weekly previews on a live staging link, never a big reveal at the end."],
      ["Test", "Real phones, slow networks, accessibility and performance checks."],
      ["Launch", "Domain, analytics and handover with a short training session."],
    ],
  },
  {
    id: "content",
    name: "Content & film",
    short: "Premium reels and long-form films that earn trust.",
    process: [
      ["Calendar", "Topics, formats, shoot schedule and posting dates planned up front."],
      ["Shoot", "Planned production days on your completed project sites."],
      ["Edit", "Colour, sound, captions and cover frames, with two rounds of revisions."],
      ["Publish", "Scheduled on agreed channels and measured monthly."],
    ],
  },
  {
    id: "growth",
    name: "Growth & systems",
    short: "Make sure no inquiry is ever lost again.",
    process: [
      ["Baseline", "We measure where inquiries come from today and how fast they are answered."],
      ["Build", "Forms, tracking, automations and agents wired into how your team already works."],
      ["Verify", "Every path tested end to end before it is called live."],
      ["Improve", "Monthly reporting against the baseline, with clear next steps."],
    ],
  },
];

// pkg: which partnership packages already include this service.
export const SERVICES = [
  {
    slug: "market-research-report",
    name: "Market research report",
    category: "research",
    summary: "A focused study of your market, competitors and customers.",
    intro:
      "Before a single pixel or frame, we study the market you compete in: who is winning attention, what buyers actually search for, and where the gaps are. You get a written report and a walkthrough, built to drive decisions.",
    includes: ["Competitor scan", "Customer profile", "Channel audit", "Pricing landscape", "Opportunity map"],
    outcomes: ["A clear picture of where demand is moving", "Five named competitors, benchmarked", "A prioritised list of opportunities"],
    timeline: "2 to 3 weeks",
    pkg: [],
  },
  {
    slug: "research-positioning",
    name: "Research & positioning",
    category: "research",
    summary: "Competitor scan, positioning statement and ideal-customer profile.",
    intro:
      "The first fourteen days of every partnership. We scan five direct competitors, define the position you can own, describe the customer you want more of, and record baseline metrics so every later result can be measured honestly.",
    includes: ["Scan of 5 competitors", "Positioning statement", "Ideal-customer profile", "Baseline metrics"],
    outcomes: ["One sentence that explains why you", "A baseline every result is measured against", "Direction for the website and content"],
    timeline: "Days 1 to 14",
    pkg: ["foundation", "growth"],
  },
  {
    slug: "digital-presence-audit",
    name: "Digital presence audit",
    category: "research",
    summary: "Three things you do well online, three gaps costing you clients.",
    intro:
      "A short, specific review of how your company looks to a buyer who finds you online today: website on a phone, social channels, video, and how easy it is to inquire. Delivered as a one-page snapshot or a two-minute screen recording.",
    includes: ["Website on mobile", "Social channel review", "Video presence", "Inquiry path check"],
    outcomes: ["An honest outside view", "Three concrete gaps, ranked", "Quick wins you can act on yourself"],
    timeline: "3 to 5 days",
    pkg: [],
  },
  {
    slug: "brand-identity",
    name: "Brand identity",
    category: "design",
    summary: "Logo, visual system and guidelines built from research.",
    intro:
      "An identity that holds up next to the quality of your work: wordmark, colour, type and a small set of rules that keep every post, film and page consistent.",
    includes: ["Logo & wordmark", "Colour & typography", "Visual guidelines", "Social templates"],
    outcomes: ["A recognisable, consistent look", "Templates your team can reuse", "A brand that matches your price point"],
    timeline: "3 to 5 weeks",
    pkg: [],
  },
  {
    slug: "web-design",
    name: "Web design",
    category: "design",
    summary: "Portfolio websites designed around your best projects.",
    intro:
      "A website is the place interest turns into an inquiry. We design it around your strongest projects, with clear service pages, fast paths to contact, and a layout that works first on the phone in your client's hand.",
    includes: ["Sitemap & wireframes", "Mobile-first layouts", "Project showcase pages", "Inquiry flow design"],
    outcomes: ["A site that sells the work, not just shows it", "Clear paths from project to inquiry", "Design ready for development"],
    timeline: "2 to 4 weeks",
    pkg: ["foundation", "growth"],
  },
  {
    slug: "product-design",
    name: "Product design",
    category: "design",
    summary: "Apps and platforms, from first idea to tested product.",
    intro:
      "For teams building a digital product: we shape the concept, test it with real users, and design the product end to end, so engineering starts from evidence rather than assumptions.",
    includes: ["Product discovery", "Prototyping", "User testing", "Design system"],
    outcomes: ["A validated product direction", "A clickable prototype", "A scalable design system"],
    timeline: "4 to 8 weeks",
    pkg: [],
  },
  {
    slug: "ux-ui-design",
    name: "UX / UI design",
    category: "design",
    summary: "Flows, wireframes and interfaces that are easy to use.",
    intro:
      "When an existing site or app confuses people, we fix the experience: mapping journeys, removing friction and redesigning the interface screen by screen.",
    includes: ["UX audit", "User flows", "Wireframes", "High-fidelity UI"],
    outcomes: ["Fewer drop-offs", "Interfaces that feel obvious", "Specs developers can build from"],
    timeline: "2 to 6 weeks",
    pkg: [],
  },
  {
    slug: "web-development",
    name: "Website development",
    category: "development",
    summary: "Fast, mobile-first websites engineered end to end.",
    intro:
      "We build what we design: a launch version live by Day 30 of a partnership, with five to seven pages, a working inquiry form and WhatsApp click-to-chat, hosted and handed over properly.",
    includes: ["5 to 7 pages", "CMS for projects", "Inquiry form & WhatsApp", "Analytics & SEO basics"],
    outcomes: ["A live site within 30 days", "Pages you can update yourself", "Performance on real phones"],
    timeline: "3 to 5 weeks",
    pkg: ["foundation", "growth"],
  },
  {
    slug: "animated-website",
    name: "Animated showcase website",
    category: "development",
    summary: "The motion-led flagship version of your site.",
    intro:
      "The upgraded version delivered by Day 90: scroll animation, project transitions and a premium showcase. It becomes the link you send to your own best prospects.",
    includes: ["Scroll animation", "Project transitions", "Premium showcase", "Performance tuning"],
    outcomes: ["A site that feels as crafted as your interiors", "A flagship link for sales", "Smooth on desktop and mobile"],
    timeline: "By Day 90",
    pkg: ["growth"],
  },
  {
    slug: "premium-reels",
    name: "Premium reels",
    category: "content",
    summary: "Short 9:16 films that create attention.",
    intro:
      "Thirty to sixty seconds, vertical, shot on your completed sites. Reels are how new people discover you; we plan them from the content calendar and shape the second set by what the first proves works.",
    includes: ["30 to 60 sec, 9:16", "On-site production", "Captions & cover frames", "2 revision rounds"],
    outcomes: ["Consistent, premium presence", "Formats tested against real numbers", "Footage you own"],
    timeline: "8 per month",
    pkg: ["foundation", "growth"],
  },
  {
    slug: "long-form-films",
    name: "Long-form films",
    category: "content",
    summary: "4 to 8 minute project films that build trust.",
    intro:
      "Reels create attention; long-form films build the trust that closes a high-value project. Full walkthroughs, the story behind the design, and the people who made it.",
    includes: ["4 to 8 min, 16:9", "Project walkthroughs", "Interviews", "YouTube-ready masters"],
    outcomes: ["Proof of quality before the first meeting", "Assets for website and sales", "Content with a long shelf life"],
    timeline: "2 per month",
    pkg: ["foundation", "growth"],
  },
  {
    slug: "content-publishing",
    name: "Content calendar & publishing",
    category: "content",
    summary: "A 90-day plan, then captions, scheduling and posting.",
    intro:
      "Topics, formats, shoot schedule, posting dates and caption plan for every video, approved by Day 30. Then we handle captions, cover frames and scheduling across your agreed channels.",
    includes: ["90-day calendar", "Caption plan", "Scheduling", "Facebook, Instagram, YouTube"],
    outcomes: ["No more irregular posting", "Every video planned with a purpose", "Time back for your team"],
    timeline: "Ongoing",
    pkg: ["foundation", "growth"],
  },
  {
    slug: "inquiry-system",
    name: "Inquiry & follow-up system",
    category: "growth",
    summary: "Forms, WhatsApp, lead tracking and reply templates.",
    intro:
      "Attention is wasted if inquiries go unanswered. We build the inquiry form, WhatsApp click-to-chat, a lead sheet with source tracking, reply templates and a follow-up schedule, live by Day 45.",
    includes: ["Inquiry form", "WhatsApp click-to-chat", "Lead sheet & source tracking", "Reply templates"],
    outcomes: ["Every lead captured and traced", "Faster, consistent replies", "Know which content brings clients"],
    timeline: "Live by Day 45",
    pkg: ["foundation", "growth"],
  },
  {
    slug: "seo",
    name: "SEO",
    category: "growth",
    summary: "Rank for the searches your clients already make.",
    intro:
      "Search engine optimisation for long-term partners: ranking your site for searches like “interior designer near me” so inquiries arrive from people already looking for the service.",
    includes: ["Technical SEO", "Local search", "Content plan", "Monthly ranking report"],
    outcomes: ["Inquiries from active searchers", "Compounding organic traffic", "Less reliance on paid reach"],
    timeline: "After Day 90",
    pkg: ["embedded"],
  },
  {
    slug: "aeo",
    name: "AEO",
    category: "growth",
    summary: "Be the name AI assistants recommend.",
    intro:
      "Answer engine optimisation makes your company visible and cited when buyers ask AI assistants and AI search for recommendations, an increasingly common first step.",
    includes: ["Entity & profile setup", "Structured data", "Citation building", "AI answer monitoring"],
    outcomes: ["Presence in AI answers", "Consistent facts about you everywhere", "Early advantage over competitors"],
    timeline: "After Day 90",
    pkg: ["embedded"],
  },
  {
    slug: "ai-agents",
    name: "Custom AI agents",
    category: "growth",
    summary: "Answer, qualify and book, around the clock.",
    intro:
      "Agents that answer website and WhatsApp inquiries 24/7, ask the right qualifying questions and book consultations, handing warm leads to your team.",
    includes: ["Website chat agent", "WhatsApp agent", "Lead qualification", "Consultation booking"],
    outcomes: ["Replies in seconds, any hour", "Fewer lost leads", "Your team talks only to qualified buyers"],
    timeline: "After Day 90",
    pkg: ["embedded"],
  },
  {
    slug: "ai-sales-management",
    name: "AI sales management",
    category: "growth",
    summary: "Every lead tracked from inquiry to signed project.",
    intro:
      "A lead pipeline with automated follow-ups, lead scoring and reports, so you always know what is in motion and nothing slips between a first message and a signed contract.",
    includes: ["Lead pipeline", "Automated follow-ups", "Lead scoring", "Sales reports"],
    outcomes: ["A clear view of your pipeline", "Consistent follow-up", "Forecasts based on real data"],
    timeline: "After Day 90",
    pkg: ["embedded"],
  },
  {
    slug: "paid-advertising",
    name: "Paid advertising management",
    category: "growth",
    summary: "Scale what already works organically.",
    intro:
      "Ads built on the formats that already performed organically, launched only once the content and inquiry system are proven. Spend goes where the data says it should.",
    includes: ["Campaign strategy", "Creative from proven formats", "Audience testing", "Spend reporting"],
    outcomes: ["Ads that start from evidence", "Predictable cost per inquiry", "Clear reporting"],
    timeline: "After Day 90",
    pkg: ["embedded"],
  },
];

export const serviceBySlug = (slug) => SERVICES.find((s) => s.slug === slug);
export const categoryById = (id) => CATEGORIES.find((c) => c.id === id);
export const servicesIn = (id) => SERVICES.filter((s) => s.category === id);
