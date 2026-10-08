---
id: adr-034
type: decision
date: 2026-10-08
topic: hosting
tags: [vercel, access, password, proxy]
status: accepted
related: [adr-033, log-2026-10-08]
---

# 034: One shared password in front of the preview

## Context

Jason wanted the site on Vercel for the MD, a director and a colleague to click through, with no environment settings and a password on load. The planned reader access seam (`READER_ACCESS=passphrase`) was never built, Vercel's free plan cannot password-protect a production address, and the repository is public.

## Decision

`src/proxy.ts` (Next 16's name for middleware) sends any request without a valid `katsura_gate` cookie to `/gate`, a plain form in its own route group. `/gate/check` checks the password and sets the cookie for 30 days. The code holds only `sha256(sha256('katsura-gate:' + password))`; the cookie holds the inner hash. So neither the password nor a working cookie can be read from the public code. The gate is off under `next dev`.

## Consequences

- One password for everyone, chosen by Jason. Changing it means changing the hash in `src/gate.ts` and redeploying; everyone signs in again.
- Photos and every other page sit behind the gate too.
- It does not replace the reader access seam. When `READER_ACCESS` is built, this file goes.
