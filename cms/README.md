# Neutorium CMS

[Strapi 5](https://github.com/strapi/strapi) (open-source, JavaScript) running the content, enquiries and team tasks
for neutorium.com. Admin panel: `https://cms.neutorium.com/admin` (locally `http://localhost:1337/admin`).

| Section | What it holds |
| --- | --- |
| **Task** | Team task board. Seeded with the AEO/SEO plan (`data/aeo-plan.json`, readable version in `docs/AEO-SEO-PLAN.md`). |
| **Enquiry** | Briefs sent from the website's project builder. Status, owner and internal notes are staff-only. |
| **Insight article** | Answer-first articles for `/insights`. Question + 40-60 word Answer + body + FAQs. Draft until published. |
| **Service** | Every service page: copy, includes, outcomes, FAQs, SEO title/description. |
| **FAQ** | Questions shown on Home, Partnership and Services (and as FAQPage structured data). |
| **Industry** | Industries and their real partner-seat counts (15 seats each). |
| **Site settings** | Email, phone, WhatsApp, socials, description. Used in the footer, `llms.txt` and structured data. |

## Run it locally

```bash
cd cms
cp .env.example .env      # then replace every "change-me" with a random secret
npm install
npm run develop
```

Open `http://localhost:1337/admin` and create the first (Super Admin) account. On first start the CMS:

1. lets the website read services, industries, FAQs, articles and settings, and submit enquiries (nothing else is public);
2. fills the content from `data/seed.json` and the task board from `data/aeo-plan.json`;
3. creates the **Team member** role.

To point the website at it, create `.env.local` in the repository root with `VITE_CMS_URL=http://localhost:1337`
and run `npm run dev` there.

## Team logins and tasks

* **Invite people:** Settings → Administration panel → Users → *Invite new user*. Give team members the
  **Team member** role: they can work on tasks and write Insights, FAQs and service copy, but cannot see enquiries,
  settings or users. Give sales/managers the **Editor** role to see enquiries.
* **Assign a task:** open Content Manager → Task, pick the person in **Assignee**, set a due date and priority.
* **See your own tasks:** in the Task list, *Filters* → Assignee → is → your name. Bookmark that page. Sort by
  Priority or Due date; switch Status as you work (`todo` → `in_progress` → `review` → `done`).
* **Progress notes:** add a *Comment* (your name, date, note) and tick checklist items as you go.

## Content changes and the live site

The website reads the CMS in the browser, so edits show up on the next page load. The pre-rendered HTML that
search engines and answer engines read is regenerated on every site build. To rebuild automatically after edits,
set `GITHUB_DISPATCH_TOKEN` (fine-grained GitHub token, *Actions: read and write* on `neutronos-tech/test`).
The CMS then triggers the deploy workflow one minute after the last change. In GitHub, set the repository
variable `CMS_URL=https://cms.neutorium.com` so builds use CMS content.

## Deploy on the VPS

1. DNS: add an `A` record `cms.neutorium.com` → the VPS IP.
2. Copy `deploy/cms.compose.yml` and this folder to the server, create `.env` from `.env.example`
   (production secrets, `DATABASE_PASSWORD`, `CORS_ORIGINS=https://neutorium.com,https://www.neutorium.com`).
3. `docker compose -f cms.compose.yml up -d --build`
4. Add `deploy/cms.Caddyfile` to the shared Caddy and reload it.
5. Open `https://cms.neutorium.com/admin`, create the Super Admin account immediately, then invite the team.

Back up the `db` and `uploads` volumes; they hold all content, enquiries and tasks.
