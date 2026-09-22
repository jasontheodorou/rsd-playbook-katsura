# Portability seams

Each row is one environment variable. Change the value, redeploy, and the app runs on the other side. Nothing else changes.

| Seam | Variable | Vercel free tier, now | Company infrastructure, later |
|---|---|---|---|
| Editorial login | `AUTH_MODE` | `local` (email and password in Payload) | `trusted-header` or `oidc`, once we know what the company gate sends |
| Reader access | `READER_ACCESS` | `passphrase` | `trusted` (the gate is upstream) |
| Database | `DATABASE_URL`, `DATABASE_MIGRATE_URL` | Neon Postgres, pooled and direct strings | the company's Postgres, one string for both |
| Media files | `STORAGE_DRIVER` + `S3_*` | `s3` at Cloudflare R2, browser uploads straight to the bucket | `s3` at MinIO or the company bucket |
| Media URLs | `MEDIA_BASE_URL` | empty (served through the app) | empty or a CDN base |
| Background jobs | `JOBS_TRIGGER`, `JOBS_RUN_SECRET` | `http`, called every 5 minutes by `.github/workflows/scheduled-jobs.yml` | `inprocess` |
| Email | `EMAIL_DRIVER` | `log` (no email service) | `smtp` to the company relay, if wanted |
| Site origin | `SITE_URL` | the Vercel URL | the company URL |
| Learner cookie | `LEARNER_COOKIE_SECRET` | set once | carried across unchanged |

## Things deliberately not used

Vercel cron, Vercel Postgres, Blob, KV, edge middleware, the `next/image` loader, Vercel Analytics, Vercel password protection, preview deployments, incremental static regeneration.

## Free-tier limits that shaped this

- Vercel Hobby cron runs once a day, so scheduling is done by a GitHub Actions timer instead.
- Vercel request bodies cap at 4.5 MB, so uploads go from the browser to the bucket directly.
- Vercel Hobby projects have one member and are for personal use under Vercel's terms. If challenged, a single paid seat or an earlier move to the company fixes it with no code change.
- Neon's free database pauses when idle; the first request after a quiet spell is slower.

## Migration day, in short

Freeze publishing. Dump the database and restore it on the company side. Copy the bucket. Start the container from `docker/Dockerfile` with the right-hand column of values. Check `/api/health`, the page count and the read-model checksum. Switch the URL. Unfreeze. Rollback is pointing the URL back.
