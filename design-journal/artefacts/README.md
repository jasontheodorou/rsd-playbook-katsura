---
id: artefacts-readme
type: glossary
date: 2026-04-19
topic: knowledge-base
tags: [convention, artefacts]
status: accepted
---

# artefacts/

Raw artefacts referenced by the journal — code snippets, prompts, generated outputs, schemas, screenshots. A future scanner pairs these with the logbook or decision that discusses them.

## Naming

`YYYY-MM-DD-slug.ext`

## Metadata

Text artefacts begin with YAML frontmatter:

```yaml
---
id: <stable-slug>
type: artefact
date: YYYY-MM-DD
source: <where-it-came-from>
related: [<logbook-id>, <decision-id>, ...]
tags: [...]
---
```

Binary artefacts use a sibling `<slug>.meta.json` with the same fields.
