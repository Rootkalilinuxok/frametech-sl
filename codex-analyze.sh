#!/usr/bin/env bash
# codex-analyze.sh — chiede a Codex un refactoring full-repo
set -euo pipefail

FILES=$(find . -type f \( -name "*.ts" -o -name "*.tsx" \) -not -path "./node_modules/*")
openai api chat.completions.create \
  --model gpt-4 \
  --temperature 0 \
  --stream false \
  --messages '[
    {"role":"system","content":"Sei un motore di refactoring: analizza le dipendenze incrociate e uniforma stile/TS per tutto il repo."},
    {"role":"user","content":"Applica refactoring a questi file:\n'"$(echo "$FILES" | sed 's/^/ - /')"'"}
  ]' > codex.diff

git checkout -b codex/refactor-temp
git apply codex.diff
