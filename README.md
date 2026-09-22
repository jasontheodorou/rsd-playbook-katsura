# katsura

An immersive, self-paced design manual for Transform UK designers, with an editorial publisher behind it modelled on GOV.UK Whitehall Publisher.

One application: Payload for editing at `/admin`, a frozen read model of published pages, and a server-rendered public site that works without JavaScript. Built to run unchanged on Vercel's free tier now and on company infrastructure later. See `docs/ARCHITECTURE.md` and `docs/PORTABILITY.md`.

## Run it locally

You need Node 22 or newer. No Docker, no admin rights.

```
cp .env.example .env          # edit PAYLOAD_SECRET at least
npm install
npm run db:local              # starts a local Postgres on port 5433 (first run downloads it); keep this terminal open
```

In a second terminal, with `DATABASE_URL=postgres://katsura:katsura@127.0.0.1:5433/katsura` in `.env`:

```
npm run migrate               # apply committed migrations
npm run dev                   # http://localhost:3019 and http://localhost:3019/admin
```

The first visit to `/admin` creates the first account, which becomes the admin.

## Checks

```
npm run check                 # lint, typecheck, build (the build needs no database)
npm run test:int              # unit tests
npm run test:e2e              # browser tests against the running app
```

`docker/compose.yml` is the company-shaped environment (container, Postgres, MinIO). It runs in CI on every push; run it locally only where Docker exists.

## Changing the database schema

Edit the collections, then `npm run migrate:create -- --name what-changed` and commit the file under `migrations/`. Never push schema changes directly.

## Deploying to Vercel

Build command: `npm run migrate && npm run build`. Set every variable in `.env.example` in the Vercel project. Preview deployments off. Commit as the identity the Vercel account knows (`git config user.email`), or Vercel silently keeps the previous build.

## Before pushing

Run `.preship` from this directory to scan for secrets, client data and missing documentation.
