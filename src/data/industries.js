// Industry pages. Each entry is a starting architecture, replaced by real discovery with every
// client. `gaps` (what is going wrong, and why) is only filled where we have studied the industry
// in depth; add it to an industry when that research exists, never before.

export const INDUSTRY_PAGES = [
  {
    slug: "interior-design",
    image: "/images/industry-interior.webp",
    imageAlt: "A bright living room with tan leather chairs around a low table",
    name: "Interior design, architecture & real estate",
    short: "Interior & real estate",
    need: "Show project quality, reduce uncertainty and build trust before the first meeting.",
    core: ["Project-led portfolio", "Conversion-oriented website", "Project films and reels", "Case studies", "Inquiry capture", "Lead tracking"],
    expansion: ["Project microsites", "Location-specific SEO and AEO", "CRM and consultation booking", "Paid campaigns, after organic learning", "Investor or partner portal, when justified"],
    measuresLabel: "How we measure",
    measures: ["Qualified inquiries", "Site and consultation bookings", "Response time", "Inquiry-to-meeting rate", "Meeting-to-proposal rate"],
    note: "Views are not the business outcome.",
    challenges: true,
    gaps: [
      {
        area: "Design & project excellence",
        wrong: "Expertise and problem-solving aren't visible to clients; quality and coordination strain as volume grows.",
        why: "Leading firms don't keep their expertise behind the scenes. They show their thinking and make their planning, coordination and execution standards visible to clients.",
      },
      {
        area: "Brand & market positioning",
        wrong: "Clients can't see what makes you different; philosophy and value are communicated inconsistently.",
        why: "Leading firms know what makes them different and who they want to serve. They build a recognizable position in their target market.",
      },
      {
        area: "Digital presence & client acquisition",
        wrong: "Social, website, ads, inquiries and follow-up don't work as one process that turns interest into conversations.",
        why: "Leading firms don't rely solely on referrals and offline networking. They use digital platforms to reach wider audiences, build trust and create more ways to be found.",
      },
      {
        area: "Operations & client experience",
        wrong: "Decisions concentrate on the founder; roles, workflows, client communication and after-sales lack structure.",
        why: "Leading firms build structured workflows that don't depend on the founder for every decision, so every client gets a consistent experience.",
      },
      {
        area: "Business strategy & sustainable growth",
        wrong: "Projects arrive, but profitability, cash flow and resource planning stay unclear.",
        why: "Leading firms think beyond their next project. They plan finances, resources and capabilities to build a stronger, more sustainable business.",
      },
    ],
  },
  {
    slug: "healthcare",
    image: "/images/industry-healthcare.webp",
    imageAlt: "A clean, bright hospital corridor with seating",
    name: "Healthcare providers & health services",
    short: "Healthcare",
    need: "Accessible service information, patient trust, accurate routing and clear patient communication.",
    core: ["Service-line website", "Doctor and department profiles", "Location and contact experience", "Health content governance", "Appointment or inquiry flow", "Analytics"],
    expansion: ["Patient communication workflows", "Referral and call tracking", "Internal dashboards", "Staff workflows", "Carefully scoped integrations"],
    measuresLabel: "What we never compromise",
    measures: ["Privacy", "Consent", "Security", "Clinical accuracy", "Applicable health-sector rules"],
    note: "No unsupported medical claims, diagnosis promises or unapproved handling of identifiable patient data.",
  },
  {
    slug: "product-brands",
    name: "Product businesses, retail & consumer brands",
    short: "Product brands",
    need: "Clarify what makes the product different, present it better and connect demand to sales data.",
    core: ["Product and brand content", "Conversion-oriented landing and product pages", "Campaign creatives", "Measurement", "Customer inquiry handling"],
    expansion: ["Catalogue operations", "Customer support automation", "Retention flows", "Merchandising analytics", "Integrations"],
    measuresLabel: "How we measure",
    measures: ["Conversion rate", "Qualified traffic", "Average order value", "Repeat purchase", "Contribution margin"],
    note: "Reach alone is not the result.",
  },
];

export const industryBySlug = (slug) => INDUSTRY_PAGES.find((i) => i.slug === slug);
