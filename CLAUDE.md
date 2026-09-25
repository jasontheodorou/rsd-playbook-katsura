# Working agreement — katsura

Terse responses. No trailing summaries. Match scope to what was asked.

## Project context

This is the `katsura` project. It runs on `localhost:3019`. The project directory is `/Users/jason.theodorou/projects/katsura`. Its design journal lives at `/Users/jason.theodorou/projects/katsura/design-journal/`.

## Design rules — always loaded

How pages in this build are designed and checked: the shared 12-column grid, the spacing scale, the approved patterns, Jason's taste, and the measure-before-reporting workflow. Follow them on every design task.

@docs/DESIGN-RULES.md

## Live during the session — do these without being asked

- Extend today's logbook at `/Users/jason.theodorou/projects/katsura/design-journal/logbook/YYYY-MM-DD.md` as we work. Prose, chronological, blow-by-blow.
- Create a new `/Users/jason.theodorou/projects/katsura/design-journal/decisions/NNN-slug.md` whenever a real architectural call is made. ADR-style matching the existing files. Number sequentially.
- Add to `/Users/jason.theodorou/projects/katsura/design-journal/training-manual.md` when the discussion produces a durable lesson, insight, technique, or reusable pattern. Bar: "would a designer joining the project in six months thank me for this entry?" Read the existing manual first; reuse topic headings. Most sessions add 0–2 entries; weak filler degrades the manual.
- Add a new `/Users/jason.theodorou/projects/katsura/design-journal/experiments/YYYY-MM-DD-slug.md` whenever we try something with a specific hypothesis and outcome — **including failures and botched attempts**. Use the Hypothesis / Approach / Result / Conclusion structure.
- Save raw artefacts (prompts, code snippets, generated outputs, schemas we discuss) into `/Users/jason.theodorou/projects/katsura/design-journal/artefacts/` with naming `YYYY-MM-DD-slug.ext`.
- Update `/Users/jason.theodorou/projects/katsura/design-journal/glossary.md` with a new `## Term` section whenever a project-specific word or phrase enters our vocabulary.
- Never write to `/Users/jason.theodorou/projects/katsura/design-journal/weekly/` — that file is maintained by a separate scheduled job.

## Knowledge-base conventions (AI-extractable)

Everything we record is shaped for future AI scanning and machine-learning. Follow without being asked:

- **Every markdown file starts with YAML frontmatter**: `id`, `type`, `date`, `topic`, `tags`, `status`, `related`.
- **Cross-reference via `related`** using stable IDs.
- **Capture failures on purpose.** The highest-value experiments are the ones that did not work.

## Memory model (read carefully)

This project's memory is structured to keep the context window lean:

- **Always in context at session start:** the topline `design-journal/overview.md` (one-screen project state) and the single most recent logbook entry. These are injected by the SessionStart hook — you don't read them explicitly.
- **On demand:** everything else — training manual, decisions, experiments, weekly digests, glossary, older logbook entries. The SessionStart injection includes an index of what exists. When the user asks about one of them, `Read` the specific file rather than guessing.
- **Do not auto-summarise the full journal into context.** Only pull what's actually needed for the current question.
- **Keep `overview.md` current.** When the project enters a new phase, a goal changes, or a stakeholder shifts, edit `overview.md` to reflect the new reality. One screen only — detail belongs in decisions/experiments/logbook, not here.

## Automation already in place

- **Per-project SessionStart hook** (`.claude/settings.json` → `.claude/hooks/session-start.sh`): loads the lean memory block described above.
- **Per-project Stop hook** (`.claude/settings.json` → `design-journal/.journal-hook.sh`): after every session, a sub-claude updates the logbook, training manual, and decisions if the live writes missed anything. Keyword-filtered so unrelated sessions no-op cheaply. Recursion-guarded via `CLAUDE_JOURNAL_HOOK=1`.
- **Weekly launchd** (`~/Library/LaunchAgents/com.jasont.design-journal-weekly-katsura.plist`): Mondays 09:00, rolls up the week into `weekly/YYYY-WNN.md` and performs light housekeeping on the training manual.
- **Logs**: `design-journal/.hook.log`, `design-journal/.weekly.log`.

## Before shipping to GitHub

- Run `.preship` from the project root. It checks for secrets, missing README, tracked `.env` files, client data, and the remote org. Fix anything it flags before pushing.

## Never ask the user to

- run hooks, open the `/hooks` menu, restart Claude Code, check logs, or verify settings.
- remember configuration details.
- manually invoke any part of the journal or training-manual automation.

The system is fully self-running. If something needs fixing, fix it silently and move on, or flag the specific issue — but never hand the user a checklist of setup steps.

<!-- scribe-block-begin -->
## Auto-journal (managed by scribe)

This project has a `journal/` directory. **Before any journal write, check whether `journal/.paused` exists. If it does, skip all journal writes for this session.**

Otherwise, as we work, extend these files in plain-English prose:

- `journal/logbook/YYYY-MM-DD.md` — chronological blow-by-blow.
- `journal/decisions/NNN-slug.md` — real architectural decisions (Context / Decision / Why / Consequences). Number sequentially.
- `journal/lessons.md` — durable lessons. Bar: "would someone joining the project in six months thank me for this?"
- `journal/experiments/YYYY-MM-DD-slug.md` — hypothesis + outcome (failures included).
- `journal/glossary.md` — project vocabulary as it emerges.
- Project-specific themed files (`bugs.md`, `ui.md`, etc.) — when a recurring topic warrants its own file.

Every file starts with YAML frontmatter: `id`, `type`, `date`, `topic`, `tags`, `status`, `related`.

Live writes are preferred. The Stop hook only catches misses.

**Reading on the user's behalf.** When the user asks "what did we decide?" / "what have we learned?" / "summarize the journal" / "what did I do yesterday?" — read the relevant journal files and report in chat. The user should never need to open files. When asked recall-style questions ("have we faced this before?"), grep `~/.scribe/library/` (the past-projects archive) too.

**Lifecycle commands the user invokes via plain English.** Run these via Bash:

- "Pause journaling" → `scribe pause`. "Resume journaling" → `scribe resume`.
- "Archive this project" / "give me a summary" / "wrap this up" → `scribe archive`. After it runs, tell the user where the file is on their desktop.
- "Bring in context from project X" → `scribe link X`.
- "Turn off journaling here" → `scribe off` (with explicit confirmation).
<!-- scribe-block-end -->

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
