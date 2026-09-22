---
id: artefact-2026-09-22-architecture-plan
type: artefact
date: 2026-09-22
topic: architecture
tags: [plan, architecture, publishing, portability]
status: accepted
related: [adr-001, adr-002, adr-003, adr-004, adr-005, adr-006, adr-007]
---

Approved architecture plan for katsura, as agreed on 2026-09-22 and updated the same day for the Vercel free tier. Verbatim copy of the plan-mode file.

# katsura: architecture plan

Architecture only. No code, no application files this session.

## Context

Jason is building an immersive, self-paced design manual for Transform UK designers, with an editorial publisher behind it modelled on GOV.UK Whitehall Publisher. A previous build, the-rsd-playbook (a Vite React single-page app plus a scaffolded, never-live Payload CMS), is the reference. Its content will be carried over later.

Hosting is Vercel now. In about 18 months the app moves to employer-run infrastructure behind one organisation-wide login. Portability outranks convenience.

Confirmed scale (asked 2026-09-22): 2 to 5 editors, under 100 pages, under 1,000 readers a month, staff-only readership once behind the employer gate.

Decisions taken by Jason on 2026-09-22: the employer gate's technology is not yet known; the four-eyes rule bars only the person who submitted the edition; editors, reviewers and admins may all compose page bodies from components; whether the hostname survives migration is not yet known.

A reviewer pass over the first draft of this plan (2026-09-22) produced 19 findings; all are folded in below, chiefly the `page_editions` state table, the draft-leak guard, four-eyes on all three publish paths, direct-to-bucket uploads, and the learner privacy points.

Steer from Jason after approval (2026-09-22): the company's authentication system is entirely unknown to him. Keep the whole stack as light as possible and in languages and systems that integrate fluidly. Vercel free (Hobby) tier initially, then the company's own system. Consequences folded in below: the auth seam trusts an upstream identity and is exercised only through the compose proxy stub until the company can describe its gate; optional weight is cut from the first build; Hobby-tier limits are recorded.

Vercel Hobby tier notes: cron fires once a day (scheduled publishing on Vercel uses a free external pinger such as cron-job.org against the jobs endpoint, or publishes at the next daily run); serverless functions have a short default timeout, fine for Payload admin; projects are single-member, so the personal git identity trap from the reference applies; Vercel's Hobby terms are for personal, non-commercial use, which an internal work tool may not satisfy. Check that before relying on it.

First-build weight cuts: `EMAIL_DRIVER=log` (publish requests show in the admin, no Resend account); no reconciliation job until the snapshot hook has run in anger; Mantine deferred to the brand session, plain CSS until then; GraphQL disabled; no analytics. Total external services in the first build: Vercel, Neon Postgres, one S3-compatible bucket (Cloudflare R2 free tier). All three have free tiers and all three are replaceable by a container, a Postgres database and a bucket on the company side.

Lighter alternative named and set aside: content as files in git, pull requests as review, GitHub as login, static site on Vercel. Removes Payload and Postgres but loses editors composing pages without a deploy, in-app scheduling and withdrawal, and non-technical editing. Revisit only if the editorial requirements are relaxed.

Step 0 done: reference repo cloned shallow into `~/projects/katsura/.reference` (272 files, single commit a8d2667, 2026-08-28). It is not yet gitignored because katsura is not a git repo and plan mode forbids edits. First act after approval: add `.reference/` to `.gitignore`.

---

## 1. Inventory

### 1a. Current folder (`~/projects/katsura`)

Empty project-kit scaffold created 2026-09-22 14:53. Contains CLAUDE.md (journal working agreement, port 3019), README.md (placeholder), .env.example, .gitignore, `.claude/` (session-start hook, settings), and `design-journal/` with an overview that still has fill-in placeholders and no logbook, decisions or experiments. Not a git repo. No code.

### 1b. Reference repo: what was sampled

Three read-only sweeps ran over `.reference`. Read fully: package.json, vercel.json, vite.config.ts, .env.example, CLAUDE.md, README.md, NEXT_STEPS.md, DESIGN_JOURNAL.md, everything under `cms/`, `src/lib/content/*`, `src/lib/auth.ts`, `src/App.tsx`, `src/pathway1/pages.ts`, `src/patterns-library/registry.ts` types, `src/components/AccessGate.tsx`, `PracticeForm.tsx`, `CardView.tsx`, `ModuleView.tsx`, `index.html`. Skimmed: `src/data/modules.ts` (816 lines, head, tail and greps), `Pathway1.tsx` outline, experiments and archived READMEs, all 23 scripts by header. Inferred: interactive-versus-presentational calls from hook and handler counts; the Lexical rich-text mismatch (below) from reading the schema and the fail-open catch, not from running it.

### 1c. Stack, build, deploy (verified from files)

| Concern | Reference | Notes |
|---|---|---|
| Public site | Vite 8, React 19, TypeScript 6, Mantine v7, framer-motion (32 files) plus `motion` (1 file, duplicate engine), zod 4, lucide icons | SPA. `index.html` is an empty root div; nothing renders without JS |
| Routing | Hand-rolled `window.location.pathname` comparisons in App.tsx; only `/patterns` uses pushState | No back button or deep links inside a pathway |
| Package manager | npm (package-lock present) | |
| Lint / test | oxlint. No test runner, no `*.test.*`. 23 Playwright driver scripts, about half dead one-offs pinned to retired experiment routes | `regression-smoke.mjs` is the closest thing to a test; not wired in |
| Deploy | Vercel. `vercel.json` is one SPA rewrite. `vite.config.ts` reads `VERCEL_PROJECT_PRODUCTION_URL` for OG tags | Only real Vercel coupling. No edge, middleware, KV, Blob, cron, `@vercel/*` |
| Operational trap | Commits must be authored as a personal identity or the Vercel team refuses the build and production silently stays stale (CLAUDE.md) | Recorded in memory already |
| CMS (`cms/`) | Payload 3 on Next 15, `@payloadcms/db-postgres`, Lexical rich text, Resend email. Never installed (no lockfile), never deployed | Two collections (Users, Pathways), one global (SiteSettings) |

### 1d. Content types and page structure

Two pathways. Pathway 2 (Practice) is data: `Pathway > Module > Card | Method`, 2 role pathways, 6 modules, 49 items (42 cards, 1 overview, 6 methods). Card body is a block union of exactly four types: paragraph, heading, list, callout (variant tool/involve/best-practice with optional CTA). Block usage: 130 paragraph, 40 list, 27 callout, 6 heading. `Method` is a fixed editorial template (whatItIs, whenToUse, whatYouDo, whatYouProduce, whatGoodLooksLike, resources), not free blocks. All prose is plain strings. No markdown, MDX or HTML anywhere in the SPA.

Pathway 1 (Foundations) is 8 hero records in `pages.ts` (number, section, headline, two lede lines, artwork) and everything below the hero is literal JSX across 7 bespoke page components in an 833-line file. Nine bespoke visual components support it (KenBurns, ImagesReveal, PinnedPhoto, HeadHeartHands, ParticipationModel, GoodDesignCollab and so on).

A separate `/patterns` library (13 registered patterns with live demos, metadata, accessibility notes and where-used) is the best-structured thing in the repo and is the natural seed for a component catalogue.

Assets: 96 files, 63 MB in `public/`, referenced by literal path strings in data. Photos alone are 37 MB. `placeholder.svg` is referenced but missing. `patterns/insitu/*.jpg` is unreferenced.

### 1e. Interactive and learning features

Progress is a flat set of completed card IDs in localStorage, keyed per demo email. No timestamps, no server sync, no rollups. One unlock rule (complete module 1 to unlock the rest). No quizzes or knowledge checks. Intake form: two hard-coded selects (role, account) that drive a crude branch on `role.toLowerCase().includes('service designer')`. The `roles` field on every card is never read by any filter.

Auth is two localStorage layers: a site password hard-coded in `AccessGate.tsx` (stored back as the cookie value in plain text) and two demo accounts hard-coded in `auth.ts`. Both secrets ship in the bundle. DESIGN_JOURNAL.md explicitly says "explicitly fragile by design. Don't copy this pattern forward".

Reduced motion is handled well (28 files use `useReducedMotion`, global kill switch in CSS). Accessibility is uneven: skip links and aria on the main flows, but the gate has no label or landmark, module tabs lack tab roles, and headings have no consistent ladder. The three best learning interactions (HHHOrbs, JoiningDots, VideoHotspots) are all in `src/archived/`.

### 1f. Where the structure creaks

- Content lives in TypeScript literals (modules.ts) and JSX (Pathway1.tsx). Editors cannot touch it. The CMS client exists but the app only ever calls the synchronous local path.
- The scaffolded CMS adds a fifth `richText` (Lexical) block that the SPA's zod schema does not accept, so any Lexical content would fail validation and silently fall back to local data. The two halves were never run together.
- Production code in `src/pathway1/` imports from `src/experiments/pilot-3/` and `src/pages/Layouts.tsx` (1211 lines), so the experiments folder is load-bearing.
- Two archived generations of Pathway 1 with their own token files, backgrounds and interactives.
- Four styling idioms coexist: Mantine props, Mantine style overrides, 27 CSS files (8,308 lines), inline style objects. Brand hexes are retyped throughout rather than read from the theme.
- Nine one-off test pages in `src/pages/`. Half the scripts folder points at routes that no longer exist.
- The reference seed script reaches from `cms/` up into `src/data/modules.ts`, and its illustration-key map is an empty TODO.

### 1g. Verdict on the stack

Keep Payload and Postgres. Keep zod, TypeScript and (provisionally, pending the brand session) Mantine. Keep the pattern library idea as the component catalogue. Keep the hard-won UX lessons in DESIGN_JOURNAL.md (default to native controls, no intermediate screens, cut exit animations, fixed container width).

Change everything about how the halves fit together. Drop the Vite SPA, the hand-rolled router, localStorage auth and progress, content-in-code, the two-app split, the duplicate motion library, the archived and experiment folders, and the one-off scripts. The reference was two applications that never met. Katsura is one application built server-first.

---

## 2. Recommended architecture

### Q1: separation versus one application

Whitehall separates Publisher, Publishing API, Content Store and Frontend because GOV.UK has dozens of publishing apps, thousands of editors, hundreds of thousands of pages and separate frontend teams. None of that applies here.

Recommendation: one deployable application with the Whitehall boundaries kept as code modules and one read-model table, so the split can be made later without a rewrite.

What you lose with one app: independent deploy cadence for publisher and public site; blast-radius isolation (an admin bug can take down the reader site); the option to put the publisher on a different auth gate from the reader site (moot, since both go behind the same gate after migration); a hard guarantee that the public site cannot see drafts (replaced by a soft guarantee: the public renderer imports only from the read model, enforced by a lint rule on import paths).

What you lose with separation: a second deploy, second env set, second auth surface, a sync mechanism between publisher and store that can fail and needs monitoring, cross-origin preview plumbing (the exact thing the reference never finished), and roughly double the operational surface on cutover day. At 2 to 5 editors and under 100 pages, that cost buys nothing.

### Diagram

```
                     ┌──────────────────────────────────────────────────────────┐
                     │   katsura (one Next.js + Payload process, one Postgres)  │
                     │                                                          │
   editors ────────► │  /admin        PUBLISHER                                 │
   reviewers         │   Payload admin UI, collections, workflow hooks,         │
   admins            │   four-eyes rule, audit events, scheduled jobs           │
                     │        │ on publish / withdraw                           │
                     │        ▼                                                 │
                     │   ══ CONTENT STORE (read model) ═══════════════════      │
                     │   published_pages: slug → frozen JSON of the edition     │
                     │   redirects: from → to, status, reason                   │
                     │        │ read only                                       │
                     │        ▼                                                 │
   readers ────────► │  /            PUBLIC SITE                                │
   (anon now,        │   server-rendered pages from published_pages only,       │
    identified       │   component registry renders blocks, HTML-first          │
    later)           │   progressive enhancement for interactive components     │
                     │        │                                                 │
                     │        ▼                                                 │
                     │   LEARNING: learners, progress_events (own tables)       │
                     │                                                          │
   reviewers ──────► │  /preview/<token>   reads DRAFT via Payload local API    │
                     └────────────┬───────────────┬──────────────┬─────────────┘
                                  │               │              │
                          Postgres (any)   S3-compatible   Jobs trigger
                          Neon now,        object store    Vercel cron now,
                          employer PG      R2/S3 now,      in-process later
                          later            MinIO/employer
                                           later
```

The snapshot hook writes `published_pages` inside Payload's request transaction (`req.transactionID`), so a publish that rolls back cannot leave a snapshot behind, and a nightly reconciliation job rebuilds any snapshot whose version id disagrees with the latest published version. The preview route renders draft content straight from Payload, so a Lexical-to-HTML renderer exists at request time regardless; the snapshot just caches its output for the public path.

Editorial tables (Payload collections and their versions tables), `page_editions` and the read model live in the same database but the public renderer is only allowed to query `published_pages`, `redirects`, `learners` and `progress_events`. That import boundary is the Whitehall separation in miniature. If a split is ever needed, `published_pages` becomes the payload of a publishing API and nothing in the public renderer changes.

### Q2: portability seams

| Seam | Now (Vercel) | After migration | Mechanism |
|---|---|---|---|
| Editorial auth | Payload local email + password | Payload custom auth strategy consuming the identity the employer gate already established (forwarded header or OIDC token). Local strategy disabled | `AUTH_MODE=local \| trusted-header \| oidc`. One `getCurrentUser(req)`. Users keyed by lowercase email; role lives in our users table, never derived from email or domain. The header strategy only trusts requests carrying a proxy shared secret or from an allowlisted address, since a bare header is spoofable. Users are pre-provisioned with roles (or auto-created with no role) before local login is disabled. `serverURL`, CSRF origins and secure cookies set explicitly for TLS terminating at the proxy |
| Reader access | Signed-cookie passphrase gate in the public route group's layout (not Next middleware, which is edge-only in Next 15 and only reaches Node runtime with `proxy.ts` in 15.5+) | Gate is upstream; app trusts it | `READER_ACCESS=passphrase \| trusted \| open`. One `getReaderIdentity(req)` returning anonymous learner or identified subject |
| Database | Neon Postgres free tier (0.5 GB, pauses after inactivity so the first request after a quiet spell is slower by under a second) over the standard `pg` driver. Pooled connection string at runtime (`pool.max` 2 to 5 per function); direct string for migrations. Single database; preview deployments are switched off so they cannot write to it | Employer Postgres | `DATABASE_URL` and `DATABASE_MIGRATE_URL`. No Neon HTTP driver, no Vercel Postgres SDK. Payload migrations committed and run by an explicit `migrate` step (Vercel build command now; a migrate entrypoint in the Docker image later). Never `push` in production. Move is `pg_dump` then `pg_restore` |
| Media storage | Payload S3 storage adapter with `clientUploads: true` (direct-to-bucket via presigned URL, because Vercel caps request bodies at 4.5 MB) pointing at Cloudflare R2 free tier (10 GB, no egress charges) | Same adapter at MinIO or employer S3; or Payload's Azure adapter if the employer is Azure-only | `STORAGE_DRIVER` plus endpoint env. Content stores relative media paths; the renderer prefixes `MEDIA_BASE_URL`. Files are served by Payload's own access-controlled file route with long `Cache-Control`, so no custom media route is needed |
| Image derivatives | Payload `imageSizes` with sharp at upload time | Same | No `next/image` loader (`images.unoptimized: true`). Derivatives are files, so they move with the bucket |
| Background jobs | Payload jobs queue (Postgres-backed). Trigger: a free external scheduler (a GitHub Actions scheduled workflow in the same repo, every 5 minutes) calls `/api/jobs/run` with a secret. Vercel cron is not used because the Hobby tier fires it once a day | Same queue. Trigger: in-process `autoRun` in the long-running container, or the same external call | `JOBS_TRIGGER=http \| inprocess`. Nothing Vercel-specific remains. Scheduled publishing resolves to within about 5 minutes |
| Email | None. `EMAIL_DRIVER=log`; publish requests appear as a list in the admin instead of an email | Payload nodemailer adapter to the employer SMTP relay if wanted | `EMAIL_DRIVER=log \| smtp \| resend`. No email account to create or migrate |
| Runtime | Vercel serverless on the Hobby tier (Next build output). Short function timeouts, so publish and snapshot work must finish in a few seconds, and bulk imports run from a laptop against the database rather than through Vercel. `sharp` declared explicitly in the Payload config; function size checked in CI | `next build` with `output: 'standalone'` in a Docker image that also carries the migrate entrypoint | No edge runtime anywhere. Public routes declare `dynamic = 'force-dynamic'` so Next's full-route cache never serves a stale prerender. `next build` must not open a database connection (the reference config threw without `DATABASE_URL` at import; guard that) or Docker builds fail |
| Site URL / OG | `SITE_URL` env, set explicitly | Same | Never read `VERCEL_*` variables in application code |

Vercel-proprietary features touched: none. Avoided outright: Vercel cron, Postgres, Blob, KV, edge middleware, `next/image` default loader, Vercel Analytics, password protection, preview deployments, ISR revalidation semantics.

Free-tier account rules that shape the build: the Vercel Hobby project has one member, so deploys come from Jason's personal GitHub account and every commit must be authored with the identity that account knows (the reference build's silent-stale-deploy trap). Vercel's Hobby terms are for personal, non-commercial use; an internal work tool may not qualify, so either confirm that with Vercel or plan to move to the company's infrastructure before the editorial team relies on it. Bandwidth (100 GB a month) and build minutes are far above what under 1,000 readers need.

The standing rule that makes this real: local development runs the after-migration shape via Docker Compose (Postgres, MinIO, the app container, and a tiny proxy stub that injects the identity header). Vercel is the special case, exercised by CI deploy. If the compose environment works, cutover day is an env swap.

---

## 3. Content model

### Entities

```
Section ──< Page ──< [versions = Editions] ──(publish)──> PublishedPage (read model)
                │
                ├── body: Block[]  (component instances, each with a stable key)
                ├── features: {progressTracking, readingTime, knowledgeCheckGate, ...}  (admin-only)
                └── template  (admin-only)

Page ──< Redirect (created on withdrawal or slug change)
Page ──< AuditEvent (actor, action, edition ref, timestamp, summary)
Media (uploads; alt text required) ──< referenced from blocks
User {email, name, role}
ComponentSettings (global: which component types are enabled, defaults)
SiteSettings (global: navigation labels, footer, notices)

Learner {id, identitySubject?, createdAt, mergedInto?}
  ──< ProgressEvent {learnerId, pageId, componentKey, kind, value, occurredAt}
```

### Editions: two options, one recommended

Option A: Payload-native editions. `pages` has drafts and versions on (`maxPerDoc: 0` for unlimited history). Once a page has been published, the main row holds the last published state and every save writes a version row (`_status` draft or published). A published version is an edition; the current draft version is the draft edition. Editors get Payload's autosave, live preview, version compare and restore for free.

Option B: `editions` as its own collection with a `page` relationship, explicit state column, and Payload versions layered on top for save history. Exact Whitehall vocabulary and clean audit queries. Cost: editors open an edition, not a page; a custom "create new edition" action; live preview and autosave wired per edition; two layers of versioning to explain.

Recommendation: A for content, plus a small `page_editions` state table for workflow metadata. The review of this plan showed that workflow fields cannot live inside the versioned document: Payload only writes the main row on publish, so a `withdrawn` state stamped into the document would itself need a publish (and trip four-eyes), and a `beforeChange` hook cannot tell a first draft save from later ones because `originalDoc` stays at the published row throughout. So:

- `page_editions` (own table): `pageId`, `editionNumber`, `state` (draft, submitted, scheduled, published, withdrawn), `authorId` (set when the row is created on the first draft save after a publish), `submittedBy/At`, `publishedBy/At`, `scheduledFor`, `changeNote` (major or minor), `publishedVersionId`. One open row per page at a time; publish closes it and the snapshot hook records the version id.
- Payload versions remain the save history and the content of each edition.
- Payload's built-in Unpublish button is hidden through `admin.components`, because it flips the main row back to draft and breaks "published immutable until superseded". Withdraw and reinstate are custom endpoints that update `page_editions` and `published_pages` and write audit rows; they never touch versions.

This gets Option B's queryability without its editor cost. Spike it in week 1 with a two-user test of the four-eyes rule before committing.

Draft leakage guard: `pages.access.read` returns a `_status: published` filter for any request without an editorial user, `readVersions` requires a user, GraphQL is disabled, and the public renderer never imports Payload at all (it reads only `published_pages`). A test fetches the REST API anonymously and asserts no draft appears, including never-published pages, whose main row is a draft.

### Workflow states and transitions

```
draft ──submit──► submitted ──publish (not by editionAuthor)──► published
  ▲                  │  reject (note)                               │
  └──────────────────┘                                              │
                                              new draft on edit ◄───┤
published ──schedule──► scheduled (job publishes at time) ─────────►┤
published ──withdraw (reason, optional redirect)──► withdrawn       │
withdrawn ──reinstate──► published (new edition, four-eyes applies) │
```

Withdrawn pages keep their content and show a withdrawal notice (Whitehall behaviour) unless a redirect target is set, in which case they 301. Slug changes create a redirect row inside the publish snapshot step (comparing the previous published slug), and chains are collapsed so a redirect always points at a live slug.

Four-eyes is enforced on every path that publishes, not just the button: the page publish hook, a `payload-jobs` hook for the scheduled-publish task (comparing the scheduling user with the submitter, since the job later runs with no user), and the restore-version path. The scheduler is recorded as `publishedBy`.

### Permission matrix

| Action | Editor | Reviewer | Admin |
|---|---|---|---|
| Create page, edit draft edition, upload media | yes | yes | yes |
| Submit for review | yes | yes | yes |
| Reject back to draft with a note | no | yes | yes |
| Publish or schedule | no | yes, unless they submitted this edition | yes, unless they submitted this edition |
| Withdraw, reinstate, set redirects | no | yes | yes |
| Add, remove, reorder components in body | yes | yes | yes |
| Change page template and features (new pages get a default template so editors can create them) | no | no | yes |
| Manage sections and navigation | no | yes | yes |
| Enable or disable component types, site settings | no | no | yes |
| Manage users and roles | no | no | yes |
| Delete a page (only if never published) | no | no | yes |
| Read audit log (editor scope enforced by a `where` on actor) | own actions | all | all |
| Preview drafts, share preview link | yes | yes | yes |

The four-eyes rule (decided): the person who submitted the edition cannot publish it. There is no admin override; with two admins the second can publish. Known gap, accepted: the edition's creator can publish it if a colleague submitted it. `editionAuthor` is still stamped and shown in the audit log so that pattern is visible if it starts happening. Tightening to "creator or submitter" later is a one-line change in `four-eyes.ts`.

### Component model

A component is a folder with one source of truth:

```
src/components/<type>/
  definition.ts   zod schema for props, Payload block config derived from it,
                  metadata (name, description, category, needsJs, tracksProgress)
  Render.tsx      server component: props → HTML. Must produce meaningful HTML alone
  Enhance.tsx     optional client component that upgrades the HTML when JS is present
```

`registry.ts` collects definitions. The Payload `body` blocks field is generated from the whole registry. `ComponentSettings` lets admins disable a registered type (hidden from the add-block menu, rejected by validation) and set defaults without a deploy. Adding a brand-new component type is code plus a migration, so it is a deploy; the plan does not promise otherwise. The public renderer looks up `block.blockType` in the registry and calls `Render`. Each block instance carries Payload's row id as its stable `key`. Payload keeps row ids across reorder; duplicating a block generates a new id. Because a rewritten question would keep its id and its learners' "completed" state, interactive blocks also carry a `resetProgress` toggle for editors, and progress events store a `contentHash` of the block props so stale completions can be detected.

Interactive components (knowledge check, reveal, sequence, hotspots) follow one rule: `Render` emits a working `<form>` or plain HTML and `Enhance` adds the inline behaviour. A knowledge check without JS posts to `/progress/answer` and comes back re-rendered with feedback at an anchor. That satisfies "core content works without JS" without a separate no-JS build.

Not a fixed list: the reference's 13 patterns and 4 block types are the initial candidates, but the model is the registry, not the catalogue.

### Q3: learner progress, anonymous now, identity later

Progress is server-side from day one, keyed by content identity, never by edition:

- `Learner` is an opaque UUID. Anonymous readers get one in an HttpOnly cookie signed with `LEARNER_COOKIE_SECRET` (separate from `PAYLOAD_SECRET`, carried across cutover), set only when the reader explicitly does something: marks complete, answers a check, or opts in to tracking. Passive page views are not recorded for anonymous readers, so no cookie is set on a first visit.
- `ProgressEvent` is (learnerId, pageId, componentKey, contentHash, kind, value, occurredAt). Page id and component key are stable across republishes, so history survives edits. Kinds: completed, answered, reset.
- Derived state (page complete, section percent) is computed in a query that joins `published_pages`, so withdrawn pages drop out of totals. Not stored, so rules can change later without a migration.
- After migration, `getReaderIdentity` returns an identified subject. Lookup is by `learner.identitySubject` (unique index). If a cookie learner also exists and is under 90 days old, its events are re-pointed in one transaction guarded by `mergedInto IS NULL`, so two tabs or devices cannot double-merge. Older cookie learners prompt "is this your progress?" before merging, which also stops a shared machine's cookie being absorbed silently. Nothing in pages, blocks or the component model changes.
- Privacy: once identity-backed, this is employee learning data. The reader site carries a short notice of purpose, a "clear my progress" action, and a retention period; the DPIA should cite the ICO's worker-monitoring guidance. Design for this now so the anonymous-era schema does not need to change.

What is lost at cutover: anonymous cookies do not survive a domain change. If the app keeps its hostname, they do. Otherwise anonymous progress is lost unless readers link an email beforehand. Given staff-only readers and a manual (not a credential), the recommendation is to accept the loss and announce it, and only build "link your progress to your work email" if the reader base asks.

---

## 4. Stack

- Payload 3 as publisher, keeping the reference's choice. It gives admin UI, drafts, versions, scheduled publish, access control, blocks, uploads, jobs and email adapters on plain Postgres, MIT-licensed, self-hostable. Rejected: a custom publisher (weeks of admin UI, auth and rich text for 2 to 5 editors); Directus (versioning exists but its database-first, generic admin fights a blocks-and-workflow model); Strapi (versioning is enterprise-only); Keystone (no versions); Sanity or Contentful (hosted, fails the self-host constraint).
- Next.js as the single runtime, because Payload 3 is built on it. Used server-first with `output: 'standalone'`, Node runtime only, no edge, no `next/image` loader, no ISR. Rejected: Astro or Remix for the public site with Payload separate (that is the two-app split from Q1); a Vite SPA (the reference; fails no-JS and SEO-less internal linking).
- Postgres 16 via Payload's Drizzle adapter. Neon now over standard `pg`. Rejected: SQLite (fine for scale but Vercel serverless has no disk, and Payload's SQLite adapter is less mature); MongoDB (Payload supports it but the employer is far likelier to run Postgres).
- Learner tables as Drizzle tables added through Payload's `afterSchemaInit`, not Payload collections, so anonymous writes never go through collection access control and migrations stay unified. Rejected: Payload collections for progress (awkward anonymous access rules, admin clutter).
- Object storage through Payload's S3 adapter, R2 or S3 now. Rejected: Vercel Blob (proprietary); local disk (no disk on serverless; fine later as a fallback driver).
- Rich text: Payload's Lexical editor for prose blocks, with HTML rendered into the read model at publish so the public site never parses Lexical JSON at request time and an export always exists. This is the one place content format lock-in is real; keeping prose in many small blocks limits it.
- Mantine v7 kept provisionally for the admin-adjacent and reader UI, with the Valencia theme to be applied in the brand session. It server-renders and the reader site's content markup is plain HTML from block renderers, not Mantine components. Rejected for now: GOV.UK Frontend (wrong brand); Tailwind (no existing investment). Revisit in the brand session.
- Motion: one library, `motion` (the successor package to framer-motion), with the reference's reduced-motion discipline carried forward. Drop the duplicate.
- zod kept for component prop schemas and API validation. TypeScript, npm, oxlint kept. Add Vitest for unit tests and Playwright test runner (not driver scripts) for smoke and no-JS checks.
- Dropped from the reference: Vite SPA, hand routing, localStorage auth and progress, framer-motion, 27 CSS files, archived and experiment folders, 23 scripts (two ideas survive: a route smoke test and OG generation, rewritten as Playwright tests).

---

## 5. Repo structure

```
katsura/
  src/
    app/
      (public)/[[...slug]]/page.tsx     reader site, renders from read model
      (public)/progress/*/route.ts      no-JS form targets for interactive components
      (public)/preview/[token]/         reviewer preview of drafts
      (payload)/                        Payload admin and REST (generated)
      api/jobs/run/route.ts             jobs trigger endpoint
    components/                         component registry (one folder per type)
      registry.ts
      prose/  heading/  list/  callout/  image/  video/  knowledge-check/  ...
    publishing/                         editorial domain (Payload side)
      collections/  pages.ts sections.ts media.ts users.ts redirects.ts audit-events.ts
      globals/      site-settings.ts component-settings.ts
      workflow/     states.ts transitions.ts four-eyes.ts page-editions.ts (state table)
      snapshot/     build-published-page.ts reconcile.ts
    content-store/                      read model queries; the ONLY module the public site imports content from
    learning/                           learner identity, progress events, derived state
    auth/                               getCurrentUser, getReaderIdentity, strategies/{local,trusted-header,oidc}
    platform/                           env-driven seams: db.ts storage.ts email.ts jobs.ts site-url.ts
    theme/                              Mantine provider (Valencia later)
  payload.config.ts
  next.config.ts                        standalone output, images.unoptimized, no experimental Vercel features
  migrations/                           Payload migrations, committed
  docker/  Dockerfile  compose.yml (postgres, minio, app, identity-proxy stub)
  scripts/  import-reference.ts (later)  export-content.ts
  tests/    smoke, no-js, workflow (four-eyes), progress
  docs/     ARCHITECTURE.md  PORTABILITY.md (the seams table)  RUNBOOK-MIGRATION.md
  design-journal/                       exists
  .reference/                           gitignored clone
```

An import-boundary lint rule: files under `src/app/(public)` may import from `content-store`, `learning`, `components`, `auth`, `theme` and nothing under `publishing`.

---

## 6. Build order

1. Foundations (first). Git init, gitignore `.reference/`, Next + Payload skeleton on Postgres, Dockerfile and compose with Postgres and MinIO, one smoke test in CI. Free-tier setup: Vercel Hobby project linked to the GitHub repo with preview deployments off and the build command running migrations; Neon free database with pooled and direct connection strings; Cloudflare R2 bucket; a GitHub Actions scheduled workflow that calls the jobs endpoint every 5 minutes; repo-level git identity set to the account Vercel knows. Risk: Payload and Next version pairing; pin both.
2. Publisher spike. `pages` with drafts and versions, `page_editions` state table, users with three roles, the four-eyes rule on the publish button, the `published_pages` snapshot hook inside the request transaction, one public route rendering from the read model, one preview route, and the anonymous-REST draft-leak test. Test with two users. This is where the hybrid edition model is proven or Option B is chosen.
3. Workflow completion. Submitted state and reject, audit events, scheduled publish via jobs (both triggers), withdraw with notice and redirect, slug-change redirects, change notes.
4. Component model. Registry, five static components (prose, heading, list, callout, image), `ComponentSettings` global, admin composition. Then one interactive component (knowledge check) end to end including the no-JS form path. Risk: proving the enhance pattern works with server components before building more.
5. Learning state. Learner cookie, progress events, derived state, progress UI, `getReaderIdentity` abstraction with the identified branch stubbed.
6. Auth seam. Trusted-header strategy behind `AUTH_MODE`, exercised in compose via the proxy stub. Reader passphrase gate for Vercel.
7. Migration rehearsal. Full dump, restore, media copy and container boot on a clean machine, written up as `RUNBOOK-MIGRATION.md`. Repeat quarterly.
8. Later: content import from the reference (section 8 below), remaining components from the pattern library, brand and visual design (separate session), search if pages approach 100.

Risk concentrates in steps 2 and 4. Do them as spikes with a throwaway branch before polishing.

---

## 7. Risks, and the three hardest-to-reverse decisions

Hardest to reverse:
1. Payload as the publisher. Its schema shape and admin become the editors' daily tool. Leaving later means an export and a new admin. Mitigation: read model plus export script mean content is never trapped, but the editorial workflow would be rebuilt.
2. Content identity: page id plus block key as the stable unit that progress, redirects and the read model hang off. Changing it later orphans learner history. Get it right in step 2.
3. Single application with an in-process read model. Splitting later is feasible only if the import boundary is actually enforced from day one. Add the lint rule in step 1, not later.

Other risks:
- Payload and Next.js release churn (Next has renamed middleware to proxy and shifted caching semantics between majors). Pin versions, upgrade deliberately, keep the compose environment as the truth.
- Vercel serverless versus a long-running container behave differently around jobs, connection pooling and cold starts. The compose environment catches most of it; Neon's pooler handles connections now.
- Lexical JSON as prose format is Payload-specific. Mitigated by rendering HTML into the read model and an export script.
- Anonymous progress loss at cutover if the hostname changes.
- Four-eyes rule with a team of two: one person on leave blocks publishing. Accepted; it is the point of the rule.
- Mantine and no-JS: some Mantine components need JS. Mitigated because content markup is plain HTML; chrome degrading is acceptable.
- Employer gate unknowns (see open questions) could force an OIDC library into the app rather than trusting a header.
- Four-eyes has three publish paths (button, scheduled job, restore). Missing one silently defeats the rule. Covered by tests in step 3.
- Rotating `LEARNER_COOKIE_SECRET` orphans every anonymous learner. Treat it like a database credential.
- Vercel Hobby terms (personal, non-commercial). If Vercel objects, the fix is a Pro plan for one seat or bringing the company migration forward; nothing in the code changes.
- Neon free tier pauses when idle. Readers see a slower first page after a quiet spell. Acceptable for an internal manual; a paid tier removes it.
- The 5-minute scheduler is a GitHub Actions workflow, which GitHub may delay under load. Scheduled publishing is "within a few minutes", not "on the second".

### Q4: migration dry-run

What changes: `DATABASE_URL`, storage endpoint and credentials, `AUTH_MODE` to trusted-header or oidc, `READER_ACCESS` to trusted, `JOBS_TRIGGER` to inprocess (and the GitHub Actions scheduler is switched off), `EMAIL_DRIVER` to smtp if wanted, `SITE_URL`. Build moves from Vercel to the Dockerfile already used locally. Nothing in application code changes if the seams have been respected.

What breaks if the rules above were bent: any `next/image` use without a loader, any edge-runtime file, any `VERCEL_*` env read, any reliance on Vercel cron firing, any ISR revalidation assumptions across multiple container instances, absolute media URLs pointing at a bucket, Payload local-strategy passwords (users need roles pre-assigned so first login through the gate lands them with the right access).

Cutover day (a few hours, mostly waiting): admin freezes publishing via a `SiteSettings` flag; final `pg_dump`; `pg_restore` into employer Postgres; `rclone sync` media; boot the container with the new env; smoke test compares page count and a checksum of `published_pages` against the source; reviewers log in through the gate and confirm roles; switch the internal URL; unfreeze. Rollback is pointing the URL back at Vercel, which still has the frozen state.

Uncomfortable parts changed now: no ISR (so no cache handler problem), media through the app (so no bucket URLs in content), progress server-side (so no localStorage to lose), roles in our table (so no dependence on the identity provider's groups on day one), and the compose environment as the development default.

### Q5: content migration shape (later, no code now)

- Reference `Module` becomes `Section`. Reference `Pathway` (role) becomes an `audience` tag on sections and pages plus a reader preference, not a separate tree. Account-specific cards become pages tagged with an `account` audience.
- Reference `Card` becomes a `Page` whose body is the four block types mapped one to one onto `prose`, `heading`, `list`, `callout` components. Plain strings become minimal Lexical documents.
- Reference `Method` becomes a `Page` composed from generic components plus one `method-summary` component for the fixed fields, rather than a separate page template.
- Pathway 1 (Foundations): 8 hero records import automatically; body copy is JSX and must be transcribed by hand into blocks. Its bespoke visual components are each a decision: register as a component type, or drop.
- The 13 pattern-library entries are the candidate list for interactive components, prioritised by where-used.
- Assets: import into `media` with alt text; compress photos first (37 MB); the missing `placeholder.svg` and unreferenced `insitu` images are dropped.
- Mechanism: a script that imports the typed exports from `.reference/src/data/modules.ts` (as the reference seed did) and creates draft pages through Payload's local API, so everything lands as unpublished editions for review.

---

## 8. Open questions

Answered 2026-09-22: four-eyes bars the submitter; editors may compose bodies; gate technology and hostname are unknown, so the plan carries both branches.

Still open, with the default the plan assumes:
1. Employer gate technology. Find out before step 6. Until then the auth seam accepts either a forwarded identity header or an OIDC token, and the compose proxy stub exercises the header form. Ask the employer's platform team: what identity claims reach the app, and how?
2. Hostname continuity. Find out before step 5. If unknown at cutover, treat anonymous progress as lost and announce it.
3. Withdrawal: keep content with a notice (Whitehall) by default, redirect only when a target is set.
4. Change notes: shown to readers on major changes (Whitehall). Assume yes.
5. Sections: flat. Nesting can be added as a parent relationship later without moving pages.
6. Reader gate on Vercel: shared passphrase cookie for the interim. Assume acceptable.
7. Mantine: keep provisionally; decide in the brand session.

---

## Verification (for the build phases, not this session)

- Compose environment boots from clean with Postgres, MinIO and the app; a page can be created, submitted, published by a second user, and rendered at `/`.
- Playwright test with JavaScript disabled loads a published page and submits a knowledge check successfully.
- A test asserts the user who submitted an edition cannot publish it via the button, via scheduling, or via restore, and a different reviewer can.
- An anonymous request to the pages REST endpoint returns no draft, including a never-published page.
- A publish whose transaction is forced to fail leaves no row in `published_pages`.
- Import-boundary lint fails if `src/app/(public)` imports from `src/publishing`.
- Migration rehearsal: dump from Neon, restore into compose Postgres, `published_pages` checksum matches.
