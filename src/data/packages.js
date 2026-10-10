// Partnership packages. Fees are shared on a call after we understand the business,
// never listed publicly, so the conversation starts from value instead of price.
export const PACKAGES = [
  {
    id: "foundation",
    name: "Foundation",
    tag: "Core system",
    term: "90 days",
    desc: "The essential system for a company that needs a credible presence and a working way to capture inquiries.",
    items: [
      "Research & positioning",
      "Launch website, 5 to 7 pages",
      "90-day content calendar",
      "8 premium reels",
      "2 long-form films",
      "Inquiry & follow-up system",
      "Monthly report",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    tag: "Full system",
    term: "90 days",
    featured: true,
    desc: "The complete Digital Authority & Client Acquisition System: everything working together, measured from day one.",
    items: [
      "Everything in Foundation",
      "16 premium reels in two sets",
      "4 long-form films",
      "Final animated showcase website",
      "Organic publishing on your channels",
      "Day-90 review & next-phase plan",
    ],
  },
  {
    id: "embedded",
    name: "Embedded",
    tag: "Long-term partnership",
    term: "After Day 90",
    desc: "For partners who have completed the first 90 days. Advanced growth services scoped from real results.",
    items: [
      "SEO & AEO",
      "Custom AI agents",
      "AI sales management",
      "Paid advertising, optional",
      "Continued content production",
      "Quarterly strategy reviews",
    ],
  },
];

export const PHASES = [
  {
    when: "Days 1 to 30",
    name: "Foundation",
    gate: "Live website",
    items: ["Research, positioning and baseline metrics by Day 14", "Launch website live by Day 30", "90-day content calendar approved"],
  },
  {
    when: "Days 31 to 60",
    name: "Content set one",
    gate: "Verified inquiry system",
    items: ["8 premium reels and 2 long-form films", "Inquiry & follow-up system live by Day 45", "Organic publishing begins"],
  },
  {
    when: "Days 61 to 90",
    name: "Content set two",
    gate: "Every asset delivered",
    items: ["8 more reels and 2 more films, shaped by what set one proved", "Final animated showcase website", "Day-90 review against the Day-14 baseline"],
  },
];

export const PROVIDES = [
  ["Project access", "Two or three completed project sites we can film, plus existing photos."],
  ["One decision maker", "A single person who approves drafts within three working days."],
  ["Brand & logins", "Logo, brand files, domain and social media access."],
  ["An inquiry owner", "Someone who answers inquiries within the agreed response time."],
];

export const packageById = (id) => PACKAGES.find((p) => p.id === id);
