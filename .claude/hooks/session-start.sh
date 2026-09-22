#!/bin/bash
# SessionStart hook — lean memory loader.
# Injects a minimal, token-efficient context block at session start:
#   1. overview.md (topline project state — always)
#   2. The most recent logbook entry (most recent session — always)
#   3. An index of everything else (pointers only — on-demand via Read tool)
#
# Output: single JSON object on stdout per Claude Code SessionStart hook spec:
#   { "hookSpecificOutput": { "hookEventName": "SessionStart", "additionalContext": "..." } }

set -u

# Ensure the kit's bundled bin dir (portable jq) is on PATH.
export PATH="$HOME/.claude-project-kit/bin:$PATH"

PROJECT_DIR="/Users/jason.theodorou/projects/katsura"
JOURNAL="$PROJECT_DIR/design-journal"

if [ ! -d "$JOURNAL" ]; then
  exit 0
fi

CONTEXT=""
append() { CONTEXT="${CONTEXT}${1}"$'\n'; }

append "# Project memory (session start)"
append ""
append "This block is injected automatically. It contains only the topline overview and the most recent session. Everything else is indexed below — use the \`Read\` tool to pull specific files when the user asks about them. Do not attempt to summarise the whole journal into context unless asked."
append ""

# ---- 1. Overview (always) ----
if [ -f "$JOURNAL/overview.md" ]; then
  append "## Overview"
  append ""
  append "$(cat "$JOURNAL/overview.md")"
  append ""
fi

# ---- 2. Most recent logbook entry (always) ----
LATEST_LOG=$(/bin/ls -1 "$JOURNAL/logbook"/*.md 2>/dev/null | sort -r | head -1)
if [ -n "$LATEST_LOG" ]; then
  LATEST_DATE=$(basename "$LATEST_LOG" .md)
  append "## Most recent session — $LATEST_DATE"
  append ""
  append "$(cat "$LATEST_LOG")"
  append ""
fi

# ---- 3. Index of on-demand resources (pointers only) ----
append "## Available on demand (read via the Read tool when relevant)"
append ""

# Training manual
if [ -f "$JOURNAL/training-manual.md" ]; then
  TM_LINES=$(wc -l < "$JOURNAL/training-manual.md" 2>/dev/null | tr -d ' ')
  append "- **Training manual** (\`$JOURNAL/training-manual.md\`) — timeless lessons and patterns, $TM_LINES lines."
fi

# Glossary
if [ -f "$JOURNAL/glossary.md" ]; then
  GL_LINES=$(wc -l < "$JOURNAL/glossary.md" 2>/dev/null | tr -d ' ')
  append "- **Glossary** (\`$JOURNAL/glossary.md\`) — project vocabulary, $GL_LINES lines."
fi

# Decisions — list titles + status
if [ -d "$JOURNAL/decisions" ]; then
  DEC_COUNT=$(/bin/ls -1 "$JOURNAL/decisions"/*.md 2>/dev/null | wc -l | tr -d ' ')
  if [ "$DEC_COUNT" -gt 0 ]; then
    append "- **Decisions** (\`$JOURNAL/decisions/\`) — $DEC_COUNT files:"
    for dfile in "$JOURNAL/decisions"/*.md; do
      [ -f "$dfile" ] || continue
      STATUS=$(awk '/^---$/{f=!f;next} f && /^status:/{sub(/^status: */,""); print; exit}' "$dfile")
      TITLE=$(grep -m1 '^# ' "$dfile" | sed 's/^# //')
      append "    - [${STATUS:-?}] $TITLE — \`$(basename "$dfile")\`"
    done
  fi
fi

# Experiments — list titles (skip README.md)
if [ -d "$JOURNAL/experiments" ]; then
  EXP_COUNT=$(/bin/ls -1 "$JOURNAL/experiments"/*.md 2>/dev/null | grep -v '/README\.md$' | wc -l | tr -d ' ')
  if [ "$EXP_COUNT" -gt 0 ]; then
    append "- **Experiments** (\`$JOURNAL/experiments/\`) — $EXP_COUNT files:"
    for efile in "$JOURNAL/experiments"/*.md; do
      [ -f "$efile" ] || continue
      [ "$(basename "$efile")" = "README.md" ] && continue
      TITLE=$(grep -m1 '^# ' "$efile" | sed 's/^# //')
      append "    - $TITLE — \`$(basename "$efile")\`"
    done
  fi
fi

# Weekly digests — list the most recent 3 + count
if [ -d "$JOURNAL/weekly" ]; then
  WK_COUNT=$(/bin/ls -1 "$JOURNAL/weekly"/*.md 2>/dev/null | wc -l | tr -d ' ')
  if [ "$WK_COUNT" -gt 0 ]; then
    append "- **Weekly digests** (\`$JOURNAL/weekly/\`) — $WK_COUNT total. Most recent:"
    while IFS= read -r wf; do
      [ -z "$wf" ] && continue
      append "    - \`$(basename "$wf")\`"
    done < <(/bin/ls -1 "$JOURNAL/weekly"/*.md 2>/dev/null | sort -r | head -3)
  fi
fi

# Older logbook entries — count only (most recent already included in full above)
if [ -d "$JOURNAL/logbook" ]; then
  LB_COUNT=$(/bin/ls -1 "$JOURNAL/logbook"/*.md 2>/dev/null | wc -l | tr -d ' ')
  OLDER=$((LB_COUNT - 1))
  if [ "$OLDER" -gt 0 ]; then
    append "- **Older logbook entries** (\`$JOURNAL/logbook/\`) — $OLDER additional entries beyond the most recent one included above. List with \`ls $JOURNAL/logbook/\`."
  fi
fi

# Artefacts
if [ -d "$JOURNAL/artefacts" ]; then
  AR_COUNT=$(/bin/ls -1 "$JOURNAL/artefacts"/ 2>/dev/null | grep -v '^\.' | wc -l | tr -d ' ')
  if [ "$AR_COUNT" -gt 0 ]; then
    append "- **Artefacts** (\`$JOURNAL/artefacts/\`) — $AR_COUNT saved prompts/snippets/outputs."
  fi
fi

append ""
append "**Rule of thumb:** if the user asks about a specific decision, experiment, older session, or term, \`Read\` that file directly rather than guessing from the index title."

# ---- Emit JSON ----
if command -v jq >/dev/null 2>&1; then
  printf '%s' "$CONTEXT" | jq -Rs '{
    hookSpecificOutput: {
      hookEventName: "SessionStart",
      additionalContext: .
    }
  }'
else
  ESCAPED=$(printf '%s' "$CONTEXT" | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read()))' 2>/dev/null)
  if [ -n "$ESCAPED" ]; then
    printf '{"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":%s}}\n' "$ESCAPED"
  else
    exit 0
  fi
fi

exit 0
