#!/bin/bash
# Stop-hook: update the design journal after each Claude Code session.
# Guards against recursion (the sub-claude must not re-trigger this hook).

set -u

PROJECT_DIR=/Users/jason.theodorou/projects/katsura
PROJECT_NAME=katsura
JOURNAL_DIR="$PROJECT_DIR/design-journal"
LOG="$JOURNAL_DIR/.hook.log"

# Recursion guard — if the sub-claude we spawn fires its own Stop hook,
# the sentinel env var is already set and we bail immediately.
if [ "${CLAUDE_JOURNAL_HOOK:-0}" = "1" ]; then
  exit 0
fi
export CLAUDE_JOURNAL_HOOK=1

# Discard hook stdin (Stop event JSON — we don't need its fields).
cat >/dev/null || true

TODAY=$(date +%Y-%m-%d)
NOW=$(date '+%Y-%m-%d %H:%M:%S')

echo "[$NOW] journal hook firing for $PROJECT_NAME" >> "$LOG"

# Cheap pre-filter: only fire the sub-claude if the most recent transcript in
# THIS project's session storage has substantive work. Saves API calls on
# trivial sessions. We look at the sanitised CWD-based transcript path.
SANITISED_CWD=$(echo "$PROJECT_DIR" | sed 's|/|-|g')
TRANSCRIPT_DIR="$HOME/.claude/projects/$SANITISED_CWD"
LATEST_TRANSCRIPT=$(ls -t "$TRANSCRIPT_DIR"/*.jsonl 2>/dev/null | head -1)
if [ -z "$LATEST_TRANSCRIPT" ]; then
  echo "[$NOW] no transcript found at $TRANSCRIPT_DIR; skipping" >> "$LOG"
  exit 0
fi

# Minimum length filter — skip trivial exchanges.
LINES=$(wc -l < "$LATEST_TRANSCRIPT" 2>/dev/null || echo 0)
if [ "$LINES" -lt 10 ]; then
  echo "[$NOW] transcript too short ($LINES lines); skipping" >> "$LOG"
  exit 0
fi

# Locate claude binary.
CLAUDE_BIN="${CLAUDE_BIN:-$(command -v claude 2>/dev/null)}"
if [ -z "$CLAUDE_BIN" ] || [ ! -x "$CLAUDE_BIN" ]; then
  CLAUDE_BIN="$HOME/.local/bin/claude"
fi
if [ ! -x "$CLAUDE_BIN" ]; then
  echo "[$NOW] claude binary not found; aborting" >> "$LOG"
  exit 0
fi

PROMPT=$(cat <<EOF
You are updating the knowledge base for the "$PROJECT_NAME" project. The project directory is $PROJECT_DIR/.

Your job — do all the relevant steps in order, in the same run:

STEP 1. Read the most recently modified conversation transcript under $TRANSCRIPT_DIR/ (files ending in .jsonl). Decide: did that session include substantive work on this project? If NO — for instance, the session was trivial, off-topic, or about another project — exit silently without writing or editing anything.

STEP 2. If YES, update the logbook entry for today at $JOURNAL_DIR/logbook/$TODAY.md:
   - If the file does not exist, create it in the prose blow-by-blow style of existing entries (read one of the files in $JOURNAL_DIR/logbook/ for the pattern, if any exist). Include YAML frontmatter at the top with: id (logbook-YYYY-MM-DD), type (logbook), date, topic, tags, status (accepted), related.
   - If it exists, append a new "## Session NN — HH:MM" section at the bottom. NN increments from the highest existing session number. HH:MM is the current local time. Do not touch existing frontmatter.
   - Do not duplicate content already present earlier in the file.
   - Style: plain English, prose, chronological. What was talked about, what was decided, and why. Be specific — name files, decisions, frameworks where relevant. Mark anything proposed-but-not-confirmed as "proposed".

STEP 3. Scan the same session for material that belongs in the training manual at $JOURNAL_DIR/training-manual.md. The manual is a codified knowledge base for designers joining the project — timeless, distilled, audience-facing. It is NOT a transcript. Read the existing manual first so you understand its structure and quality bar before adding anything.

Only add an entry if a thoughtful designer reading it in six months would thank you for it. The bar is: "this is a durable lesson, insight, technique, or reusable pattern — not just something that happened today."

Each entry must be one of four shapes:
  - Lesson — a principle learned the hard way (or near-miss prevented).
  - Insight — a conceptual framing that unlocks a problem.
  - Technique — a how-to or decision heuristic.
  - Pattern — a reusable structural template.

Place each new entry under the most appropriate existing topic heading. Only create a new topic heading if the material genuinely does not fit an existing one. Phrase every entry so it stands alone — a reader must not need the logbook to understand it. Keep each entry short: ~200 words max for a body; favour signal.

If the session produced nothing worth adding to the manual, leave it untouched. Most sessions will add 0–2 entries. Some will add none. That is correct. Adding weak entries degrades the manual.

STEP 4. If a new architectural decision was locked in during the session, add a new file in $JOURNAL_DIR/decisions/ following the ADR-style format of the existing files (read one first for the pattern, if any exist). Number sequentially — highest existing number plus one. Include YAML frontmatter: id (decision-NNN-slug), type (decision), date, topic, tags, status, related.

STEP 5. Scan the session for auxiliary knowledge-base material. Evaluate each independently of the logbook.

   - EXPERIMENTS: did the session include trying something with a specific hypothesis and outcome — especially failures, botched attempts, dead-ends? If so, add $JOURNAL_DIR/experiments/$TODAY-slug.md using the Hypothesis / Approach / Result / Conclusion structure (see $JOURNAL_DIR/experiments/README.md). Frontmatter: id (experiment-YYYY-MM-DD-slug), type (experiment), status (tried | succeeded | failed | inconclusive | superseded), related.
   - ARTEFACTS: did the session discuss raw content worth preserving (prompts, code snippets, generated outputs, schemas)? If so, save each as $JOURNAL_DIR/artefacts/$TODAY-slug.ext (see $JOURNAL_DIR/artefacts/README.md). Text: include frontmatter. Binary: sibling .meta.json.
   - GLOSSARY: did a project-specific term enter the vocabulary? Add a "## Term" section to $JOURNAL_DIR/glossary.md with a short definition.

Apply a high bar on all three. If none of these apply, leave them untouched.

Do NOT modify files in $JOURNAL_DIR/weekly/ — the weekly digest is updated by a separate scheduled task.

Use plain Markdown throughout. Exit silently when done. Do not print a summary.
EOF
)

if ! "$CLAUDE_BIN" -p --permission-mode acceptEdits "$PROMPT" </dev/null >>"$LOG" 2>&1; then
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] claude -p returned non-zero" >> "$LOG"
fi

echo "[$(date '+%Y-%m-%d %H:%M:%S')] journal hook complete" >> "$LOG"
