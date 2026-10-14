# Neutorium CMS

[Strapi 5](https://github.com/strapi/strapi) (open-source, JavaScript) running the content, enquiries and team tasks
for neutorium.com. Sign in at the hidden page **`https://neutorium.com/addme`** (locally `http://localhost:1337/addme`).

| Section | What it holds |
| --- | --- |
| **Task** | Team task board. Seeded with the AEO/SEO plan (`data/aeo-plan.json`, readable version in `docs/AEO-SEO-PLAN.md`). |
| **Enquiry** | Briefs sent from the website's project builder. Stage, owner and internal notes are staff-only. |
| **Insight article** | Answer-first articles for `/insights`. Question + 40-60 word Answer + body + FAQs. Draft until published. |
| **Service** | Every service page: copy, includes, outcomes, FAQs, SEO title/description. |
| **FAQ** | Questions shown on Home, Partnership and Services (and as FAQPage structured data). |
| **Industry** | Industries and their real partner-seat counts (15 seats each). |
| **Site settings** | Email, phone, WhatsApp, socials, description. Used in the footer, `llms.txt` and structured data. |

## First login

On first start the CMS creates the admin account from `ADMIN_EMAIL` and `ADMIN_INITIAL_PASSWORD` (set on the
server, never in git: the repository is public). So `/addme` always shows a sign-in page, never an open sign-up form.

1. Open `/addme` and sign in with that email and setup password. You are the Super Admin.
2. Change the password: click your name (bottom left) → Profile.
3. Invite the team: Settings → Administration panel → Users → *Invite new user*, and choose each person's role:
   * **Super Admin**: everything, including users and settings.
   * **Editor**: all content and enquiries (sales, managers).
   * **Team member**: tasks, Insights, FAQs and service copy; no enquiries, settings or users.

On first start the CMS also lets the website read services, industries, FAQs, articles and settings and submit
enquiries (nothing else is public), fills the content from `data/seed.json`, and fills the task board from
`data/aeo-plan.json`.

## Working with tasks

* **Assign:** Content Manager → Task → open a task, pick the person in **Assignee**, set a due date and priority.
* **My tasks:** in the Task list, *Filters* → Assignee → is → your name. Bookmark that page.
* **Progress:** switch **Stage** as you work (`backlog` → `todo` → `in_progress` → `review` → `done`), tick checklist
  items and add a *Comment* (your name, date, note).

## Run it locally

```bash
cd cms
cp .env.example .env      # replace every "change-me" (generate secrets as shown in the file)
npm install
npm run develop           # http://localhost:1337/addme
```

To point the website at it, create `.env.local` in the repository root with `VITE_CMS_URL=http://localhost:1337`
and run `npm run dev` there.

## Content changes and the live site

The website reads the CMS in the browser, so edits show on the next page load. The pre-rendered HTML that search
and answer engines read is regenerated on every site build. To rebuild automatically after edits, set
`GITHUB_DISPATCH_TOKEN` (fine-grained GitHub token, *Actions: read and write* on `neutronos-tech/test`); the CMS then
triggers the deploy workflow one minute after the last change.

## Deploy on the VPS

The CMS runs on the same domain as the site, so no DNS change is needed.

1. Copy this folder and `deploy/cms.compose.yml` to the server and create `.env` from `.env.example` with production
   secrets, `DATABASE_PASSWORD`, `PUBLIC_URL=https://neutorium.com`, `ADMIN_EMAIL` and your `ADMIN_INITIAL_PASSWORD`.
2. `docker compose -f cms.compose.yml up -d --build`, on the same Docker network as the `neutorium-site` container.
3. Deploy the updated `deploy/site.Caddyfile` to the site container (it forwards `/addme`, `/admin`, `/api` and the
   admin plugin routes to the CMS) and reload Caddy.
4. In GitHub, set the repository variable `CMS_URL=https://neutorium.com` so site builds use CMS content.
5. Open `https://neutorium.com/addme` and follow *First login* above.

Back up the `db` and `uploads` volumes; they hold all content, enquiries and tasks.
