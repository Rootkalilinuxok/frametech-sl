# Guida Vercel • Next.js • GitHub • OpenAI SDK

> **Questa guida è pensata come riferimento rapido e consultabile da developer e da AI assistant Codex/GPT, per risolvere errori ricorrenti o blocchi critici in build, deploy, CI/CD, integrazioni AI su Vercel/Next.js.**

---

## 📖 Sommario

- [1. Errori comuni API REST e Deploy](#1-errori-comuni-api-rest-e-deploy)
- [2. Log e Monitoraggio Deploy](#2-log-e-monitoraggio-deploy)
- [3. Vercel AI Agents e SDK](#3-vercel-ai-agents-e-sdk)
- [4. Next.js su Vercel: Best Practice](#4-nextjs-su-vercel-best-practice)
- [5. Framework supportati e build](#5-framework-supportati-e-build)
- [6. Integrazione OpenAI con Vercel](#6-integrazione-openai-con-vercel)
- [7. Integrazione GitHub & Vercel](#7-integrazione-github--vercel)
- [8. Variabili d’ambiente: gestione e limiti](#8-variabili-dambiente-gestione-e-limiti)
- [9. Troubleshooting errori di build](#9-troubleshooting-errori-di-build)
- [10. Gestione build e ottimizzazione](#10-gestione-build-e-ottimizzazione)
- [11. CI/CD: GitHub Actions + Vercel](#11-cicd-github-actions--vercel)
- [12. Prompt Engineering e Fine-tuning GPT](#12-prompt-engineering-e-fine-tuning-gpt)

---

## 1. Errori comuni API REST e Deploy

### 🔴 Errori generici API

- **Forbidden (`403`)**: manca o è errato il token utente.
- **Rate Limited**: superato il limite di richieste.
- **Bad Request**: dati o parametri non validi nella richiesta.
- **Internal Server Error (`500`)**: errore interno, spesso non risolvibile lato client.
- **Resource Not Found**: la risorsa richiesta non esiste o id sbagliato.
- **Method Unknown**: metodo HTTP non supportato dall’endpoint.

### ⚠️ Errori di Deploy

- **Missing Files / No Files**: mancano file nel deployment.
- **Too Many Env Vars**: superato il limite di variabili d’ambiente (100).
- **Invalid Env Key**: nome variabile non valido (usa solo lettere, numeri, `_`).
- **Value troppo lunga**: valore variabile > 65KB (limite).
- **Env Object senza UID**: valore object senza chiave `uid`.
- **Not Allowed to Access Secret**: permessi insufficienti su una secret/env.

### ⚠️ Errori dominio/DNS

- **Domain Forbidden/Not Found/Invalid**: dominio non autorizzato o non trovato.
- **Conflicting Certs/Aliases**: rimuovere certificati/alias prima di agire sul dominio.

---

## 2. Log e Monitoraggio Deploy

### Recupero log deploy con Vercel SDK

import { Vercel } from '@vercel/sdk';
const vercel = new Vercel({ bearerToken: process.env.VERCEL_TOKEN });
const logsResponse = await vercel.deployments.getDeploymentEvents({
  idOrUrl: 'my-app.vercel.app'
});

----------------------------------------------------------------------------------

1. Aggregazione log e alert automatici (esempio)
Analisi errori/warning su più deploy.
Invio mail alert se superata soglia.

import * as nodemailer from 'nodemailer';
// ...
if (totalErrors > 10) {
  await transporter.sendMail({ /* ... */ });
}

----------------------------------------------------------------------------------

2. Vercel AI Agents e SDK
Sistema orchestrato con loop LLM → strumenti → esecuzione → aggiornamento contesto.
SDK AI facilita: chiamata LLM, tool-calling, orchestrazione ciclo agent.

-------------

Esempio chiamata LLM

import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
const { text } = await generateText({
  model: openai('gpt-4.1'),
  prompt: 'Ciao!'
});

--------------

Definizione strumenti

import { tool } from 'ai';
const tools = {
  weather: tool({ /* ... */ })
};

--------------

Esempio deploy API agent

export const POST = async (req: Request) => {
  // ...
  const result = await generateText({ model: openai('gpt-4.1'), prompt, tools, maxSteps: 2 });
  return Response.json({ steps: result.steps, finalAnswer: result.text });
};

---------------------------------------------------------------------------

3. Next.js su Vercel: Best Practice
ISR (Incremental Static Regeneration):

await fetch(url, { next: { revalidate: 10 } });

SSR (Server Side Rendering):
Zero-config, si scala automaticamente, supporta Cache-Control.

Streaming:
Usa Suspense o file loading.js per UI responsive.

Prerendering parziale:
[Solo sperimentale]

Image Optimization:
Usa next/image per immagini ottimizzate automaticamente.

Font Optimization:
Usa next/font per hosting locale dei font.

Edge Middleware:
Esegui codice all’edge prima di processare la richiesta.

4. Framework supportati e build
Next.js, SvelteKit, Nuxt, Astro, Remix, Vite, Gatsby, CRA e molti altri.

Vedi matrice supporto su Vercel Docs.

Rilevamento automatico del framework → comandi build/output preconfigurati.

Supporto monorepo: build multiprogetto, skip progetti non toccati.

5. Integrazione OpenAI con Vercel
Installa AI SDK: pnpm i ai

Ottieni chiave API OpenAI da dashboard.

Salva in variabile ambiente:

ini

OPENAI_API_KEY=sk-...
Mai esporre la chiave lato client.

6. Integrazione GitHub & Vercel
Collega repo GitHub:
Ogni push su un branch crea una Preview Deploy, merge su main aggiorna la produzione.

Permessi richiesti:
Controlla permessi repo/org/user (Administration, Deployments, Pull Requests…).

Autorizzazioni speciali per fork:
Su PR da fork, richiede autorizzazione extra.

Variabili ambiente esposte:

VERCEL_GIT_REPO_SLUG, VERCEL_GIT_COMMIT_SHA, ecc.

Silenzia commenti bot:
Impostazioni progetto > Git > disattiva notifiche.

GitHub Actions:
Possibile deploy via CI/CD con vercel build + vercel deploy --prebuilt.

7. Variabili d’ambiente: gestione e limiti
Dichiarazione:
Dashboard progetto > Settings > Environment Variables.

Ambienti:

Produzione: solo build su main/prod.

Anteprima: build da branch diversi.

Sviluppo: locali via .env.local.

Limiti:

Fino a 64KB totali (Node.js, Python, Go...).

Edge Functions: max 5KB per variabile.

Best Practice:
Non committare mai chiavi sensibili.
Ridistribuire per applicare le modifiche.

8. Troubleshooting errori di build
Usa la dashboard Vercel:
Sezione Deployments > clic su deployment errore > leggi log build.

Log locali:
Prova build in locale (npm run build) prima di pushare.

Build logs non disponibili:
Spesso dovuti a errore config (vercel.json) o permessi contributor/team.

Controlla limiti build:

Memoria: 8GB (default), disco: 13GB.

Timeout: 45 minuti max.

Cache build: 1GB max.

9. Gestione build e ottimizzazione
Concurrency:
Limite build simultanee per piano (se pieno: coda).

Build cache:
Conservata 1 mese, max 1GB. Usa build cache key (account+repo+branch+framework).

Forzare build senza cache:

vercel --force

Variabile: VERCEL_FORCE_NO_BUILD_CACHE=1

Escludi devDependencies:
Personalizza install command in settings (npm install --only=production).

10. CI/CD: GitHub Actions + Vercel
Preview Deploy (branch ≠ main):

name: Vercel Preview Deployment
on: [push]
jobs:
  build:
    steps:
      - uses: actions/checkout@v2
      - run: npm install -g vercel@latest
      - run: vercel pull --yes --environment=preview --token=${{ secrets.VERCEL_TOKEN }}
      - run: vercel build --token=${{ secrets.VERCEL_TOKEN }}
      - run: vercel deploy --prebuilt --token=${{ secrets.VERCEL_TOKEN }}
      
Production Deploy (push su main):

name: Vercel Production Deployment
on:
  push:
    branches: [main]
jobs:
  build:
    steps:
      - uses: actions/checkout@v2
      - run: npm install -g vercel@latest
      - run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
      - run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
      - run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
      
Segreti richiesti:

VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID

11. Prompt Engineering e Fine-tuning GPT
Prompt Engineering:
Migliora le risposte definendo prompt chiari, contestuali, concisi.
Occhio alla latenza: prompt molto lunghi = risposta lenta.

Fine-tuning:
Prepara dataset JSONL con esempi (messages array stile OpenAI Chat API).

{"messages": [{"role":"system","content":"Bot Shakespeare"}, {"role":"user","content":"Domanda?"}, {"role":"assistant","content":"Risposta in stile Shakespeare"}]}

Usa script Node+OpenAI SDK per upload e monitoraggio training.

Usa modello custom:
Nel codice API, sostituisci model: openai('ft:gpt-4o-mini-2024-07-18:your-id')
Il prompt system usato DEVE essere identico a quello del dataset.

🔗 Risorse utili
Documentazione Vercel

Documentazione Next.js

Vercel AI SDK

OpenAI Platform

Esempi di integrazione AI SDK

Ultimo aggiornamento: 2025-06-22
