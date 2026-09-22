---
id: experiments-readme
type: glossary
date: 2026-04-19
topic: knowledge-base
tags: [convention, experiments, negative-examples]
status: accepted
---

# experiments/

A structured log of what was tried, what happened, and what was concluded. Includes failures and tangents.

## Naming

`YYYY-MM-DD-slug.md`. One experiment per file.

## Entry structure

```yaml
---
id: experiment-YYYY-MM-DD-slug
type: experiment
date: YYYY-MM-DD
topic: ...
tags: [...]
status: tried | succeeded | failed | inconclusive | superseded
related: [decision-NNN, logbook-YYYY-MM-DD, ...]
---

# <title>

**Hypothesis** — what we thought or wanted to test.

**Approach** — what we actually did.

**Result** — what happened.

**Conclusion** — what we learned and what we will do next.
```
