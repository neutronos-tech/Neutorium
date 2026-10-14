# Neutorium AEO & SEO plan

Answer engines (ChatGPT search, Perplexity, Google AI Overviews, Gemini, Copilot) recommend companies they can identify with confidence and quote directly. This plan makes neutorium.com easy to crawl, makes Neutorium a clear and consistent entity across the web, and publishes answer-first content that engines can cite. Work through the phases in order; each task is seeded into the CMS task board.

> This document is generated from `cms/data/aeo-plan.json`, which also seeds the CMS task board. Edit the JSON, then run `npm run cms:seed`.

## What is already built into the website

- Every page is pre-rendered to HTML at build time, so crawlers and answer engines that do not run JavaScript read the full content.
- Per-page titles, descriptions, canonical URLs and Open Graph tags.
- JSON-LD structured data: Organization and ProfessionalService with an offer catalog, Service, FAQPage, Article with its main question, BreadcrumbList and WebSite.
- Visible FAQs on Home, Partnership, Services and each service page, matching the FAQPage markup.
- `sitemap.xml`, `robots.txt` (search and AI crawlers allowed), `llms.txt` and `llms-full.txt`, generated on every build.
- Insights articles with a Question and a short Answer field, the format answer engines quote.

## Phase 1: Technical foundations (Week 1)

### 1. Lock the business facts in Site settings

Area: technical · Priority: urgent

Answer engines cross-check facts. Name, email, phone, WhatsApp, service area and social profiles must be identical everywhere.

**How:** fill CMS > Site settings with the final values. Use exactly the same spelling of "Neutorium" and the same contact details on every profile created later.

**Done when:** the website footer, llms.txt and structured data all show the confirmed email and socials.

- [ ] Confirm the business email address
- [ ] Add phone and WhatsApp numbers
- [ ] Add every social profile URL
- [ ] Agree one-sentence company description

### 2. Verify neutorium.com in Google Search Console and Bing Webmaster Tools

Area: seo · Priority: urgent

Bing's index powers ChatGPT search and Copilot, so Bing matters as much as Google for AEO.

**How:** verify the domain with a DNS TXT record in both tools, then submit https://neutorium.com/sitemap.xml. In Bing, also import the site from Search Console.

**Done when:** both tools show the sitemap as processed with no errors.

- [ ] Google Search Console: domain property verified
- [ ] Sitemap submitted to Google
- [ ] Bing Webmaster Tools verified
- [ ] Sitemap submitted to Bing
- [ ] IndexNow enabled in Bing

### 3. Check that crawlers can read every page

Area: technical · Priority: high

Every route is pre-rendered at build time so crawlers that do not run JavaScript still see real content.

**How:** open view-source:https://neutorium.com/services/web-design and confirm the title, description, JSON-LD and page text are in the HTML. Check https://neutorium.com/robots.txt, /llms.txt and /llms-full.txt load.

**Done when:** all five checks pass on the live site.

- [ ] Pre-rendered HTML present on a service page
- [ ] robots.txt allows search and AI crawlers
- [ ] llms.txt and llms-full.txt load
- [ ] 404 page returns noindex
- [ ] Search Console URL Inspection shows the rendered page

### 4. Validate structured data

Area: seo · Priority: high

Organization, Service, FAQPage, Article and BreadcrumbList markup is generated automatically from CMS content.

**How:** test the home page, /partnership, one service page and one article in Google's Rich Results Test and validator.schema.org.

**Done when:** no errors on any of the four pages; warnings noted as follow-up tasks.

- [ ] Home
- [ ] Partnership
- [ ] One service page
- [ ] One Insights article

### 5. Set up analytics with AI referral tracking

Area: analytics · Priority: high

We need to see visits and enquiries that come from answer engines.

**How:** install privacy-friendly analytics (Plausible or GA4). Create a channel or segment for referrers chatgpt.com, perplexity.ai, copilot.microsoft.com, gemini.google.com and claude.ai. Record the source on every enquiry.

**Done when:** a test visit from each AI referrer shows up in its own segment.

- [ ] Analytics installed
- [ ] AI referrer segment created
- [ ] Enquiry source captured
- [ ] Weekly report scheduled

### 6. Pass Core Web Vitals on mobile

Area: technical · Priority: medium

Speed and stability on phones affect rankings and whether a page is used as a source.

**How:** run PageSpeed Insights for the home page and one service page on mobile. Fix the largest contentful paint first (the 3D hero is already lazy-loaded; check fonts and the loader).

**Done when:** LCP under 2.5 s, CLS under 0.1 and INP under 200 ms in the field data or lab tests.

- [ ] Home page tested
- [ ] Service page tested
- [ ] Fixes listed as separate tasks

### 7. Connect the CMS to automatic site rebuilds

Area: technical · Priority: high

Pre-rendered pages update when the site is rebuilt. The CMS triggers a rebuild a minute after content changes.

**How:** create a fine-grained GitHub token with Actions read and write on this repository, set GITHUB_DISPATCH_TOKEN in the CMS environment, and set the CMS_URL repository variable in GitHub.

**Done when:** editing a service in the CMS updates the live page within five minutes.

- [ ] GitHub token created
- [ ] Token set on the CMS server
- [ ] CMS_URL repository variable set
- [ ] Test edit goes live

## Phase 2: Entity and trust (Weeks 1 to 3)

### 8. Create and align official profiles

Area: authority · Priority: high

Engines decide who Neutorium is by matching the website with consistent profiles elsewhere.

**How:** create or update LinkedIn company page, Facebook, Instagram and YouTube with the same name, description, logo, website and contact details. Add every URL to Site settings so it appears in the sameAs structured data.

**Done when:** every profile links back to neutorium.com and is listed in Site settings.

- [ ] LinkedIn company page
- [ ] Facebook page
- [ ] Instagram
- [ ] YouTube channel
- [ ] All URLs added to Site settings

### 9. Google Business Profile

Area: authority · Priority: high

Local and map results feed AI Overviews and Gemini answers for searches like "digital agency for interior designers in Dhaka".

**How:** create a Google Business Profile as a service-area business, pick the most accurate primary category, add the services, logo, real photos and the website.

**Done when:** the profile is verified and shows the same details as the website.

- [ ] Profile created
- [ ] Verified
- [ ] Services and categories added
- [ ] Website and contact match

### 10. Show the real people behind Neutorium

Area: content · Priority: high

Experience and expertise are trust signals for both search and answer engines.

**How:** add short bios for founders and leads (name, role, experience, LinkedIn) to the About page, and use real author names on Insights articles.

**Done when:** About lists the team and every article has a named author.

- [ ] Bios written
- [ ] Photos approved
- [ ] About page updated
- [ ] Authors set on articles

### 11. List Neutorium in reputable directories

Area: authority · Priority: medium

Mentions on trusted directories confirm the entity and often get quoted.

**How:** create listings on Clutch, GoodFirms, DesignRush and relevant Bangladesh business directories, using exactly the same name, description and contact details.

**Done when:** at least five listings are live; record every URL in this task.

- [ ] Clutch
- [ ] GoodFirms
- [ ] DesignRush
- [ ] Two local directories

## Phase 3: Answer-first content (Weeks 2 to 8, then ongoing)

### 12. Build the question bank

Area: aeo · Priority: urgent

AEO starts from the exact questions buyers ask.

**How:** collect at least 50 real questions from sales calls, Digital Presence Snapshots, Google "People also ask", Reddit and Quora, and the questions people type into ChatGPT and Perplexity. Group them by service and industry and mark the 20 most valuable.

**Done when:** the question bank is shared and the top 20 are marked.

- [ ] Sales call questions
- [ ] People also ask
- [ ] Reddit and Quora
- [ ] AI assistant prompts
- [ ] Top 20 marked

### 13. Run the baseline AI visibility audit

Area: aeo · Priority: urgent

Measure whether answer engines mention Neutorium today, so progress is real.

**How:** ask ChatGPT, Perplexity, Gemini, Copilot and Google (AI Overview) the top 20 questions. For each, record whether Neutorium is mentioned, cited with a link, or absent, and which competitors appear. Repeat monthly with the same prompts.

**Done when:** the baseline sheet is complete for all five engines.

- [ ] ChatGPT
- [ ] Perplexity
- [ ] Gemini
- [ ] Copilot
- [ ] Google AI Overview
- [ ] Competitors noted

### 14. Publish two answer-first Insights articles per week

Area: content · Priority: high

Engines quote pages that answer one question clearly near the top.

**How:** for each article in the CMS: put the exact question in "Question", a 40 to 60 word self-contained answer in "Answer", then the detail in the body with H2 subheadings phrased as questions, a short list or table where useful, and 3 to 5 related FAQs. Link to the relevant service page.

**Done when:** two articles are published this week; repeat weekly.

- [ ] Question field matches a real query
- [ ] Answer is 40 to 60 words
- [ ] Body uses question subheadings
- [ ] 3 to 5 FAQs added
- [ ] Links to a service page
- [ ] Named author

### 15. Add FAQs to every service page

Area: content · Priority: high

Service pages are the most likely pages to be cited for buying questions.

**How:** in CMS > Services, add 3 to 5 FAQs to each service using real buyer questions (price drivers, timeline, what is included, who it suits). They render on the page and as FAQPage markup.

**Done when:** every service has at least three FAQs.

- [ ] Research & strategy services
- [ ] Design services
- [ ] Development services
- [ ] Content & film services
- [ ] Growth & systems services

### 16. Write SEO titles and descriptions for every service

Area: seo · Priority: medium

Default titles are generated, but hand-written ones win more clicks.

**How:** in CMS > Services > SEO, write a title under 60 characters and a description under 155 characters for each service, leading with the buyer's need.

**Done when:** all services have custom SEO fields.

- [ ] All services have a meta title
- [ ] All services have a meta description

### 17. Publish original, citable data

Area: aeo · Priority: high

Statistics and first-hand findings are what answer engines quote most.

**How:** aggregate anonymised findings from Digital Presence Snapshots (for example, the share of interior design studios without a mobile-friendly website or without project videos). Publish them as an Insights article with a clear method and date.

**Done when:** one data article is live and shared on LinkedIn.

- [ ] At least 30 snapshots analysed
- [ ] Method written
- [ ] Article published
- [ ] Shared on social profiles

### 18. Plan industry landing pages

Area: content · Priority: medium

Pages such as "Websites and video for interior design studios" match how buyers search.

**How:** draft the structure for /industries/interior-design: the problems we solve, the 90-day system, FAQs specific to the industry. Create a development task once the copy is approved.

**Done when:** copy is approved and a development task exists.

- [ ] Outline
- [ ] Copy draft
- [ ] Industry FAQs
- [ ] Development task created

### 19. Publish films with transcripts and chapters

Area: content · Priority: medium

YouTube is a major source for AI answers, and transcripts make video quotable.

**How:** upload long-form films to YouTube with a keyword-led title, a description that answers the main question, chapters and a corrected transcript. Embed the film on the related page.

**Done when:** every published film has a transcript and chapters.

- [ ] Title and description
- [ ] Chapters
- [ ] Transcript corrected
- [ ] Embedded on the site

## Phase 4: Authority off the site (Ongoing)

### 20. Earn mentions in industry publications

Area: authority · Priority: medium

Independent mentions are strong evidence for answer engines.

**How:** pitch two guest articles or interviews per month to design, architecture and business publications, using our original data as the hook.

**Done when:** two pitches sent this month; log replies and published links here.

- [ ] Target list of 15 publications
- [ ] Two pitches sent
- [ ] Published links recorded

### 21. Collect real case studies and reviews

Area: authority · Priority: medium

Proof must be genuine. Never invent clients or results.

**How:** after each Day-90 review, ask the partner for written consent to publish a short case study and for a Google review.

**Done when:** every completed partner has been asked; consents are stored.

- [ ] Consent template ready
- [ ] Case study template ready
- [ ] Requests sent

### 22. Answer questions where buyers ask them

Area: authority · Priority: low

Helpful answers on Reddit, Quora and LinkedIn are often surfaced by answer engines.

**How:** each week, answer three genuine questions from the question bank with a useful, complete answer. Link to an Insights article only when it truly helps.

**Done when:** three answers posted this week with links logged here.

- [ ] Three answers posted
- [ ] Links logged

## Phase 5: Measure and improve (Monthly)

### 23. Monthly AEO and SEO report

Area: analytics · Priority: high

One page, same format every month.

**How:** report Search Console clicks and top queries, Bing clicks, AI referral visits, enquiries by source, and the AI visibility audit (mentions and citations per engine) against the baseline. Turn every gap into a task.

**Done when:** the report is shared and new tasks are created.

- [ ] Search Console
- [ ] Bing
- [ ] AI referrals
- [ ] Enquiries by source
- [ ] AI visibility audit repeated
- [ ] Follow-up tasks created

### 24. Refresh the top articles every quarter

Area: content · Priority: medium

Engines prefer current sources.

**How:** each quarter, update the ten most visited articles with new facts or data, re-check the short answer, and save so the modified date updates.

**Done when:** ten articles refreshed this quarter.

- [ ] Top ten identified
- [ ] Facts updated
- [ ] Short answers re-checked
