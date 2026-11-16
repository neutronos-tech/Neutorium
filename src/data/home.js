// Home page content, taken from the Neutorium growth proposal. Edit the words here;
// the sections in src/sections only lay them out.

export const TAGLINE = "Research. Strategy. Engineering.";

// Each headline line is [text, tone]. tone "serif" takes [plain, italic]; "mute" is the quieter colour.
export const HERO = {
  lines: [["People decide"], [["before they", "know why."], "serif"]],
  line: "We study how. Then we build your brand around it.",
  // What the cloud of points becomes, in order, and what each shape stands for (shown when clicked).
  shapes: [
    ["Brain", "Every purchase starts here. Most of a decision is made before a person can explain it."],
    ["Neuron", "One signal: a single impression of your brand. A colour, a word, a feeling."],
    ["Network", "Repeated signals link up. That is how a brand becomes familiar, and then trusted."],
    ["DNA", "What makes your business itself. We find it before we design anything."],
    ["Cell", "The smallest living unit. A brand is built the same way: small things, repeated until they are alive."],
  ],
};

export const MARQUEE = ["Research", "Strategy", "Brand", "Content", "Websites", "Search", "Sales systems", "Automation", "Software"];

export const DREAM = {
  lines: ["You started with a dream.", "We help you reach it."],
  text: "Turning it into reality is not impossible. The challenge is knowing how to get there.",
};

export const AMBITIONS = [
  ["Become the recognized choice", "The name people think of first in your market."],
  ["Attract better-fit clients", "People who value your expertise and quality."],
  ["Win better work", "Larger, more profitable work that matches what you can do."],
  ["Build a distinctive brand", "A clear position beyond price."],
  ["Consistent client acquisition", "Less dependence on referrals."],
  ["Financial stability", "Steadier work, profitability and planning."],
  ["Stronger team & organization", "People and processes for more complex work."],
  ["Sustainable business", "Growth that doesn't need the founder in every decision."],
];

// The five layers organizations are built in: the problem each one solves, and the work behind it.
export const AREAS = [
  {
    name: "Research & positioning",
    short: "Research",
    problem: "The company cannot clearly explain why it should be chosen.",
    work: ["Market and competitor research", "Customer interviews", "Positioning and messaging", "Offer architecture"],
  },
  {
    name: "Authority & experience",
    short: "Authority",
    problem: "The real quality is not obvious online or in the buying journey.",
    work: ["Website and portfolio", "Case studies", "Brand systems", "Premium photography and video", "Product demos"],
  },
  {
    name: "Demand & conversion",
    short: "Demand",
    problem: "Attention fails to become qualified conversations.",
    work: ["Landing pages", "Content systems", "SEO and AEO", "Lead capture", "CRM stages and follow-up"],
  },
  {
    name: "Intelligence & automation",
    short: "Intelligence",
    problem: "Leads, operations or performance data are disconnected.",
    work: ["Dashboards and reporting", "Integrations", "Workflow automation", "AI agents where justified"],
  },
  {
    name: "Infrastructure & products",
    short: "Infrastructure",
    problem: "The organization needs a system beyond marketing.",
    work: ["Portals", "Industry software", "Operational systems", "Data platforms", "IoT with specialist partners"],
  },
];

export const CHALLENGES = [
  ["Limited capital", "You can't invest everywhere at once."],
  ["Limited skilled manpower", "Hard to hire and retain talent."],
  ["Founder dependency", "Little time left for strategy."],
  ["Operational overload", "Daily work crowds out improvement."],
  ["Unclear priorities", "It isn't obvious what comes first."],
  ["Disconnected execution", "People and vendors work without a shared plan."],
  ["Inconsistent follow-up", "Inquiries slip under the workload."],
  ["Limited measurement", "It's unclear what drives progress."],
  ["Unpredictable pipeline", "Hiring and planning get harder."],
  ["Limited strategic support", "Capable people lack the broader view."],
];

export const STEPS = [
  ["Understand", "We study your market, your rivals and how your buyers decide."],
  ["Define", "We pin down who you serve and why they should choose you."],
  ["Build", "We make it visible: brand, content, website and the systems behind them."],
  ["Improve", "We measure what happens, keep what works and fix what doesn't."],
];

// Left side: what a business tells us. Right side: where we usually start.
export const PROBLEMS = [
  ["Struggling to communicate value", "Brand positioning & communication"],
  ["Great work, not yet presented", "Strategic portfolio & case studies"],
  ["Inquiries, but weak follow-up", "Sales systems & CRM"],
  ["Unclear market and priorities", "Market research & business strategy"],
  ["Manual work, disconnected processes", "Technology, automation & workflow"],
];

export const CAPABILITY_GROUPS = [
  {
    name: "Strategy & brand",
    line: "Build a clearer direction. Establish a stronger position.",
    items: [
      {
        name: "Business strategy & growth advisory",
        fits: "Businesses seeking clarity on their position, opportunities and decisions.",
        provides: ["Market, competitor and audience insight", "Growth strategy and priorities", "KPIs and decision-support reports", "Guidance and reviews"],
        helps: "A clear, structured direction toward your growth goals.",
      },
      {
        name: "Brand development & communication",
        fits: "Businesses building a distinctive identity and clearer value communication.",
        provides: ["Positioning and value proposition", "Brand identity development", "Messaging strategy", "Corporate profile and guidelines"],
        helps: "Clients see what you stand for, what sets you apart and why to choose you.",
      },
      {
        name: "Business consultancy, hourly",
        fits: "Owners wanting an expert perspective on one challenge or decision, without a monthly commitment.",
        provides: ["One-to-one consultation", "Discussion of challenges and opportunities", "Practical recommendations"],
        helps: "A clearer perspective before important decisions.",
        note: "Hourly. Scope and fees are agreed before the session.",
      },
    ],
  },
  {
    name: "Brand presence & content",
    line: "Make your expertise visible. Present your work with purpose.",
    items: [
      {
        name: "Strategic portfolio, case studies & authority building",
        fits: "Businesses with completed projects not yet presented strategically online.",
        provides: ["Portfolio content plan", "Project selection and story", "Case studies", "On-field photo and video"],
        helps: "Turns project experience into credibility for your website, social media, YouTube and beyond.",
      },
      {
        name: "Premium website development",
        fits: "Businesses needing a professional home for their brand, services and portfolio.",
        provides: ["Strategy and structure", "UI/UX design", "Development", "Inquiry forms and integrations", "Basic analytics setup"],
        helps: "A professional place for clients to explore your business and get in touch.",
      },
      {
        name: "On-field photography & video production",
        fits: "Businesses needing professional visuals of projects, spaces, team or activities.",
        provides: ["Photo and video shooting", "Editing and post-production", "Optional scriptwriting and shoot planning"],
        helps: "Professional visuals for marketing, portfolio and communication.",
        note: "Bring your own script and we shoot and edit, or we script, plan, shoot and edit.",
      },
      {
        name: "Organic social media content production",
        fits: "Businesses wanting a consistent social presence around brand, expertise and projects.",
        provides: ["Monthly plan and topic selection", "Scripts and copy", "Graphic and video production", "Agreed monthly deliverables"],
        helps: "Consistent communication and stronger brand recognition.",
        note: "Organic content only, not paid advertising.",
      },
    ],
  },
  {
    name: "Neuromarketing",
    featured: true,
    line: "How people notice, trust, compare, choose and remember. We build the brand, the offer and the journey around how buyers really decide.",
    items: [
      { name: "Customer behaviour research" },
      { name: "Positioning & offer design" },
      { name: "Content & social tactics" },
      { name: "Search visibility, SEO & AEO" },
    ],
  },
  {
    name: "Sales systems & technology",
    line: "Improve how your business manages inquiries, processes and operations.",
    items: [
      {
        name: "Sales systems & CRM",
        fits: "Businesses that receive inquiries but lack an organized way to manage prospects and follow-up.",
        provides: ["Sales process design", "Lead tracking and pipeline setup", "CRM implementation", "Follow-up systems", "Sales reporting"],
        helps: "A clear view of inquiries, conversations and next steps.",
      },
      {
        name: "Automation & AI",
        fits: "Businesses reducing repetitive work or introducing practical AI-supported processes.",
        provides: ["Workflow analysis", "Process and repetitive-task automation", "AI-supported workflows", "System and tool integrations"],
        helps: "Less manual work, more consistency and efficiency.",
      },
      {
        name: "Software & portals",
        fits: "Businesses with operational or delivery needs that existing tools can't meet.",
        provides: ["Custom software", "Client portals", "Internal management systems", "API and third-party integrations"],
        helps: "Software built around your requirements.",
      },
      {
        name: "IoT & physical systems",
        fits: "Businesses whose physical operations may benefit from connected devices and monitoring.",
        provides: ["IoT solutions", "Sensor-based monitoring", "Connected-device integration", "Physical-system automation"],
        helps: "Practical links between physical operations and technology, where a clear need exists.",
      },
    ],
  },
];

export const ENGAGEMENTS = [
  {
    name: "Individual service",
    line: "Focused support for one business need.",
    text: "One clearly defined need with its own deliverables and scope. For example a brand, a website, case studies, content or a consultation.",
    to: "/services",
    cta: "Browse single services",
  },
  {
    name: "Combined services",
    line: "Combine by the problem, not the number of services.",
    text: "Connected services for one objective, such as positioning, website, ad content, campaigns and follow-up. We can help you find the right combination.",
    to: "/start?path=custom",
    cta: "Build your own package",
  },
  {
    name: "Ongoing growth partnership",
    line: "Long-term support as your business evolves.",
    text: "Strategy and growth advisory with ongoing delivery of selected services. Scope and priorities are agreed between both sides and adapt as your business evolves.",
    to: "/partnership",
    cta: "See the partnership packages",
    featured: true,
  },
];

export const RESPONSIBILITIES = [
  ["We are responsible for", "The agreed work within our scope."],
  ["Your team remains responsible for", "Accurate information, business decisions, approvals, internal coordination and responsibilities under your control."],
];

// The standard we hold ourselves to.
export const DOCTRINE = [
  ["Research", "before claims."],
  ["Scope", "before price."],
  ["Proof", "before promises."],
  ["Delivery", "before expansion."],
  ["Evidence", "before upsell."],
];

export const NO_PROMISE =
  "We do not promise a set number of leads, revenue or results. We work toward agreed objectives through research, strategy, execution and continuous improvement.";

// What each industry needs first. Starting points, replaced by real discovery with every client.
export const INDUSTRY_NEEDS = [
  ["Interior, architecture, construction & real estate", "Show project quality, reduce uncertainty and build trust before the first meeting."],
  ["Healthcare providers & health services", "Accessible service information, patient trust, accurate routing and clear communication."],
  ["Manufacturing, industrial & B2B distribution", "Turn technical capability into qualified opportunities and make complex products easy to evaluate."],
  ["Education, training & institutions", "Make program value, outcomes, credibility and enrollment steps clear."],
  ["Hospitality, premium services & tourism", "Make the experience tangible and increase direct inquiries and bookings."],
  ["Financial, legal & professional services", "Communicate expertise and earn qualified consultations without damaging trust."],
  ["Retail, ecommerce & consumer brands", "Clarify differentiation, improve product presentation and connect demand to sales data."],
  ["Logistics, transport & supply chain", "Increase qualified commercial demand and see requests and operations clearly."],
  ["Agriculture, food processing & distribution", "Build buyer and supplier trust, traceability and operational monitoring."],
  ["Technology, SaaS & innovation", "Explain a complex product and move qualified evaluators toward a demo or trial."],
];

// Why the first step is safe to take. Every line is an existing commitment.
export const REASSURANCES = [
  ["A free first look", "Before any pitch, we review your online presence and send three strengths and three specific gaps. If it is useful on its own, it has done its job."],
  ["One service is enough", "Every service can be hired alone, with a fixed scope and timeline. No bundle required."],
  ["Delivery is guaranteed", "Every asset in the signed scope arrives within 90 days, or we keep working at no additional fee."],
  ["You own the work", "Final videos, website content and your domain are yours after full payment."],
];

// How the "ways to work together" section ends.
export const CHOICE = {
  lines: ["We choose", "research and data", "over everything else."],
  text: "Not opinion, not habit, not what worked for someone else. Every recommendation we make starts from what the evidence says about your business.",
};

