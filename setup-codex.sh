#!/usr/bin/env bash
# setup-codex.sh — Codex CI helper
# Version: 2025-06-17
set -euo pipefail

# ─── Logging utilities ─────────────────────────────────
info()    { printf "\033[1;34m[INFO]\033[0m  %s\n" "$*"; }
warn()    { printf "\033[1;33m[WARN]\033[0m  %s\n" "$*"; }
error()   { printf "\033[1;31m[ERROR]\033[0m %s\n" "$*"; exit 1; }
success() { printf "\033[1;32m[SUCCESS]\033[0m %s\n" "$*"; }

# ─── 1. Detect package manager ────────────────────────
info "Rilevo package manager..."
if command -v pnpm  &>/dev/null; then PM="pnpm"
elif command -v yarn  &>/dev/null; then PM="yarn"
else PM="npm"; fi
info "Usando \`$PM\` per JS/TS"

# ─── 2. Install JS/TS dependencies ────────────────────
if [ -f package.json ]; then
  info "Installo dipendenze front-end"
  case "$PM" in
    pnpm) pnpm install ;;
    yarn) yarn install ;;
    npm)  npm install ;;
  esac
else
  warn "Nessun package.json rilevato, skip JS deps"
fi

# ─── 3. Copy .env example ─────────────────────────────
if [ -f .env.example ] && [ ! -f .env ]; then
  info "Creo .env da .env.example"
  cp .env.example .env
fi

# ─── 4. (Opzionale) Python virtualenv + requirements ──
if [ -f requirements.txt ] && command -v python3 &>/dev/null; then
  info "Setup Python venv e requirements"
  [ ! -d .venv ] && python3 -m venv .venv
  # shellcheck source=/dev/null
  source .venv/bin/activate
  pip install --upgrade pip
  pip install -r requirements.txt
else
  warn "requirements.txt mancante o python3 non trovato, skip Python"
fi

# ─── 5. (Opzionale) Migrazioni DB ─────────────────────
if command -v alembic &>/dev/null && [ -d alembic ]; then
  info "Eseguo Alembic migrations"
  alembic upgrade head
elif [ -f prisma/schema.prisma ]; then
  info "Eseguo Prisma migrate deploy"
  npx prisma migrate deploy
else
  warn "Nessuna migrazione DB rilevata (alembic/prisma)"
fi

# ─── 6. Test & lint (soft-fail) ───────────────────────
info "Eseguo test e lint (non bloccheranno lo script)"
set +e
$PM test   || warn "Test fallito"
$PM lint   || warn "Lint fallito"
set -e

# ─── 7. Verifica VERCEL_TOKEN ────────────────────────
if [ -z "${VERCEL_TOKEN:-}" ]; then
  error "La variabile VERCEL_TOKEN non è impostata! Aggiungila come secret in GitHub."
fi

# ─── 8. Vercel build reale ────────────────────────────
info "Eseguo \`vercel build\` (CI dry-run)"
# usa npx per non dipendere da global install
if ! npx vercel build --confirm --token "$VERCEL_TOKEN"; then
  error "La verifica \`vercel build\` è fallita. Controlla i log e la configurazione."
fi

# ─── Fine ─────────────────────────────────────────────
success "Setup completato e build Vercel passata!"
