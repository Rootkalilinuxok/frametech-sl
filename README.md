<div align="center">
  <strong>Next.js Admin Template built with TypeScript & Shadcn UI</strong><br />
  A modern admin dashboard template using Next.js 15, Tailwind CSS v4, App Router, TypeScript, and Shadcn UI.
</div>

<br />

<div align="center">
  <a href="https://next-shadcn-admin-dashboard.vercel.app">View Demo</a>
</div>

<br />

<p align="center">
  <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Farhamkhnz%2Fnext-shadcn-admin-dashboard">
    <img src="https://vercel.com/button" alt="Deploy with Vercel" />
  </a>
</p>

<br />

<div align="center">
  <img src="https://github.com/arhamkhnz/next-shadcn-admin-dashboard/blob/main/media/dashboard.png?version=5" alt="Dashboard Screenshot" width="75%">
</div>

---

## Project Vision

The goal is to create an open-source admin template that includes multiple example screens, prebuilt sections, and thoughtfully designed UI patterns, all supported by a clean architecture and proper project setup.

It aims to serve as a strong starting point for SaaS platforms, internal dashboards, and admin panels, with built-in support for multi-tenancy, RBAC, and feature-based scaling.

---

## Overview

This project uses `Next.js 15 (App Router)`, `TypeScript`, `Tailwind CSS v4`, and `Shadcn UI` as the main stack.  
It also includes `Zod` for validation, `ESLint` and `Prettier` for linting and formatting, and `Husky` for pre-commit hooks.  

It supports `React Hook Form`, `Zustand`, `TanStack Table`, and other related utilities, and will be added with upcoming screens. RBAC (Role-Based Access Control) with config-driven UI and multi-tenant UI support are also planned as part of the feature roadmap.

The current version uses the [Tweakcn Tangerine](https://tweakcn.com/) theme for UI.

> Looking for a **Next 14 + Tailwind CSS v3** version instead?  
> Check out the [`archive/next14-tailwindv3`](https://github.com/arhamkhnz/next-shadcn-admin-dashboard/tree/archive/next14-tailwindv3) branch.  
> This branch uses a different color theme and is not actively maintained, though I'm trying to keep it updated with the latest changes and screens.

---

## AGENTS & Automations

> ℹ️ For build/test/AI/automation policies, see [AGENTS.md](./AGENTS.md).
>
> This project is AI/CI-ready and supports Codex, Copilot, and advanced workflows.

---

> ℹ️ **ATTENZIONE: Tutte le procedure tecniche dettagliate, policy CI/CD, workflow Vercel/Next.js/OpenAI, fix errori, troubleshooting e script sono documentati nella guida [guida-vercel.md](./guida-vercel.md) nella root. Consultare SEMPRE quella guida prima di modificare script, policy o proporre fix automatici.**

---

## 🧠 AI-powered Vercel Deploy Debugger

This project includes an **AI watcher script** (`ai-deploy-watcher.js`) that automatically monitors Vercel deploy errors, analyzes build logs, and provides OpenAI-powered suggestions for fixes.

- All AI logs are saved in `ai-deploy-watcher.log`.
  **Check this log before opening a Pull Request** to quickly identify and resolve build errors.

- The watcher runs automatically in cloud workspaces (Codex, CI) or can be launched locally with:
  ```sh
  node ai-deploy-watcher.js
  ```

  Ensure the environment variables `VERCEL_TOKEN`, `PROJECT_ID`, and `OPENAI_API_KEY` are set before running the script.

---

## Environment Variables

Copy `.env.example` to `.env.local` (or set these values as repository/Vercel secrets) before running the project.

- `DATABASE_URL` – PostgreSQL connection string
- `SUPABASE_URL` – Supabase project URL
- `SUPABASE_KEY` – Supabase service role key
- `GOOGLE_API_KEY` – Google Cloud Vision API key
- `OPENAI_API_KEY` – OpenAI API key
- `VERCEL_TOKEN` – Vercel API token
- `PROJECT_ID` – Vercel project ID
- `NEXT_PUBLIC_SITE_URL` – Base URL used by the frontend
