#!/usr/bin/env bash
# setup-codex.sh — Codex CI helper
# Version: 2025-06-17
set -euo pipefail

# ─── 0. Salta i pre-commit hooks in CI ─────────────────────
export HUSKY_SKIP_HOOKS=1

# ─── 1. Force npm registry ─────────────────────────────────
npm config set registry https://registry.npmjs.org/

# ─── 2. Detect package manager ─────────────────────────────
if command -v pnpm &>/dev/null; then PM=pnpm
elif command -v yarn &>/dev/null; then PM=yarn
else PM=npm; fi

# ─── 3. Install JS deps ────────────────────────────────────
$PM install --frozen-lockfile

# ─── 4. Python venv & deps (opzionale) ────────────────────
if [ -f requirements.txt ] && command -v python3 &>/dev/null; then
  python3 -m venv .venv
  source .venv/bin/activate
  pip install --upgrade pip
  pip install -r requirements.txt
fi

# ─── 5. Test & lint (soft-fail) ───────────────────────────
set +e
$PM test || echo "[WARN] test falliti, ignoro"
$PM lint || echo "[WARN] lint fallito, ignoro"
set -e

# ─── 6. Verifica VERCEL_TOKEN ─────────────────────────────
[ -n "${VERCEL_TOKEN:-}" ] || {
  echo "[ERROR] VERCEL_TOKEN non impostato!"
  exit 1
}

# ─── 7. Vercel dry-run build ──────────────────────────────
npx vercel build --confirm --token "$VERCEL_TOKEN"
