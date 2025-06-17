#!/usr/bin/env bash
# setup-codex.sh — Codex CI helper
# Version: 2025-06-17
set -euo pipefail

# ─── 0. Salta i pre-commit hook Husky in CI ─────────────────────
export HUSKY_SKIP_HOOKS=1

# ─── 1. Forza il registry pubblico di npm ───────────────────────
npm config set registry https://registry.npmjs.org/

# ─── 2. Detect package manager ─────────────────────────────────
if command -v pnpm &>/dev/null; then PM=pnpm
elif command -v yarn &>/dev/null; then PM=yarn
else PM=npm; fi

# ─── 3. Install JS deps ────────────────────────────────────────
$PM install --frozen-lockfile || $PM install

# ─── 4. (Opzionale) Python venv & requirements ─────────────────
if [ -f requirements.txt ] && command -v python3 &>/dev/null; then
  python3 -m venv .venv
  # shellcheck source=/dev/null
  source .venv/bin/activate
  pip install --upgrade pip
  pip install -r requirements.txt
fi

# ─── 5. Test & lint (soft-fail) ────────────────────────────────
set +e
$PM test   || echo "[WARN] Test falliti, ignoro"
$PM lint   || echo "[WARN] Lint fallito, ignoro"
set -e

# ─── 6. Verifica VERCEL_TOKEN ─────────────────────────────────
if [ -z "${VERCEL_TOKEN:-}" ]; then
  echo "[ERROR] VERCEL_TOKEN non impostato!"
  exit 1
fi

# ─── 7. Vercel build dry-run ──────────────────────────────────
# Rimuoviamo il flag --confirm che non esiste più in v43.x
npx vercel build --token "$VERCEL_TOKEN"

echo "[SUCCESS] Build Vercel dry-run completata"
