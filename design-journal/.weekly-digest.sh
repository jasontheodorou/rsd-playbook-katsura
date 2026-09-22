#!/bin/bash
# Weekly digest — invoked by launchd every Monday morning.
# Rolls up the week's logbook entries into a weekly digest file and performs
# light housekeeping on the training manual.

set -u

PROJECT_DIR=/Users/jason.theodorou/projects/katsura
PROJECT_NAME=katsura
JOURNAL_DIR="$PROJECT_DIR/design-journal"
LOG="$JOURNAL_DIR/.weekly.log"
NOW=$(date '+%Y-%m-%d %H:%M:%S')

export CLAUDE_JOURNAL_HOOK=1

echo "[$NOW] weekly digest firing for $PROJECT_NAME" >> "$LOG"

CLAUDE_BIN="${CLAUDE_BIN:-$(command -v claude 2>/dev/null)}"
if [ -z "$CLAUDE_BIN" ] || [ ! -x "$CLAUDE_BIN" ]; then
  CLAUDE_BIN="$HOME/.local/bin/claude"
fi
if [ ! -x "$CLAUDE_BIN" ]; then
  echo "[$NOW] claude binary not found; aborting" >> "$LOG"
  exit 0
fi

# ISO year + week number for the week that JUST ENDED.
YEAR_WEEK=$(date -v-1d '+%G-W%V')

PROMPT=$(cat <<EOF
You are rolling up the past week into a weekly digest for the "$PROJECT_NAME" project. The journal lives at $JOURNAL_DIR/.

Your job:

1. Read all logbook entries at $JOURNAL_DIR/logbook/ that were modified or created in the past 7 days. Read any new decision files in $JOURNAL_DIR/decisions/ added in the same window.

2. Read one existing file in $JOURNAL_DIR/weekly/ to learn the format (headings, bullet style, section order). If none exist, use this template:

   # Week YYYY-WNN — <Mon date>–<Sun date>

   ## Core insights
   - ...

   ## Decisions made this week
   - [NNN] ...

   ## Improvements to process
   - ...

   ## Open threads going into next week
   - ...

3. Write a new weekly digest file at $JOURNAL_DIR/weekly/$YEAR_WEEK.md covering the week that just ended. Follow that format.

4. Be terse and bullet-driven. A reader should be able to skim the file in 60 seconds and understand where the project stands. Prefer signal over completeness.

5. Do NOT modify logbook or decision files. Do NOT overwrite an existing weekly digest — if $JOURNAL_DIR/weekly/$YEAR_WEEK.md already exists, append a " - revised" note and a short diff explaining what you updated.

6. Then, once the weekly digest is written, perform light housekeeping on $JOURNAL_DIR/training-manual.md:
   - Read the whole file.
   - If multiple entries in the same topic cover the same idea, merge them into one cleaner entry. If two topic headings are near-duplicates, consolidate under the better name.
   - If any entry has drifted into transcript-style prose (e.g. starting with "this week we decided"), rewrite it into timeless form.
   - Do NOT add new entries here. New entries are added by the per-session Stop hook, not by this weekly tidy pass. Your job is housekeeping, not authorship.
   - Keep all changes conservative: preserve wording unless you have a clear reason to change it.

7. Use plain Markdown. Exit silently when done.
EOF
)

if ! "$CLAUDE_BIN" -p --permission-mode acceptEdits "$PROMPT" </dev/null >>"$LOG" 2>&1; then
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] claude -p returned non-zero" >> "$LOG"
fi

echo "[$(date '+%Y-%m-%d %H:%M:%S')] weekly digest complete" >> "$LOG"
