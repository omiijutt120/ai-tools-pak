#!/bin/bash
# ============================================================================
# AI Tools Pak daily SEO/GEO/AEO research — one-shot agent runner
# Fired by systemd timer aitoolspak-daily.timer at 08:00 PKT.
# Captures the agent's final response (the report) to daily-run.log and
# leaves report writing + git push to the agent (see daily-prompt.md).
# ============================================================================
set -uo pipefail
export PATH="$HOME/.local/bin:$PATH"
export HERMES_HOME="$HOME/.hermes"

LOG="$HOME/logs/daily-run.log"
mkdir -p "$(dirname "$LOG")"

echo "=== $(date -Is) start ===" >> "$LOG"

# Refresh the repo + prompt before each run (self-updating setup)
cd "$HOME/ai-tools-pak" && git pull --ff-only -q >>"$LOG" 2>&1 || true
ln -sf "$HOME/ai-tools-pak/oracle/daily-prompt.md" "$HOME/daily-prompt.md"

cd "$HOME"
if command -v hermes >/dev/null 2>&1; then
  hermes -z "$(cat "$HOME/daily-prompt.md")" \
    -m deepseek-v4-flash-free --provider opencode-zen \
    -t terminal,file >> "$LOG" 2>&1
  RC=$?
else
  echo "hermes binary not found on PATH" >> "$LOG"
  RC=127
fi

echo "=== $(date -Is) exit=$RC ===" >> "$LOG"
exit $RC
