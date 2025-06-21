# AGENTS.md

## 🚀 Build/Test/Lint/Deploy Commands
- **Install:** `npm install`
- **Build:** `npm run build`
- **Test:** `npm run test`
- **Lint:** `npm run lint`
- **Trunk setup:** `trunk install` (se usato)
- **Deploy:** `vercel --prod` (opzionale)
- **Start Dev:** `npm run dev`

## ⚙️ Environment & Network
- **Node.js version:** >= 20.x
- **Network:** abilitata solo nella fase di setup/installazione (no fetch di rete durante test/build per sicurezza)
- **Trunk:** installato via `trunk install` per supporto linting offline (se usato)
- **OS:** Ubuntu/Linux compatibile

## 🔐 Environment Variables (required)
- `OPENAI_API_KEY`
- `VERCEL_TOKEN`
- `PROJECT_ID`
- *(aggiungi altre chiavi se servono servizi esterni)*

## 🧑‍💻 Pull Request & Branch Policy
- **Branch naming:** usa prefisso `codex/`, `feature/` o `fix/`
- **Commit messages:** chiari e descrittivi, includere issue/reference se presente
- **Pull Request:** il messaggio PR deve includere “Testing done” e (opzionale) log test/screenshot
- **PR Policy:** PR deve superare build/test/lint prima del merge

## 🏗️ CI/CD & Automation
- Tutte le dipendenze (dev/prod) devono essere in `package.json`
- Usa `npm ci` (o `npm install`) nelle pipeline CI/CD
- I test e lint devono passare su tutte le PR prima del merge
- Se usi GitHub Actions, configura jobs:
  - Setup Node version (`actions/setup-node`)
  - Install dependencies
  - Build (`npm run build`)
  - Lint (`npm run lint`)
  - Test (`npm test`)
  - Deploy (se triggerato da main/production)

## 🔒 Security & Best Practice
- Non committare mai chiavi/API/segreti (`.env`)
- Usa solo GitHub/Vercel secrets per variabili d’ambiente

## 🧠 Codex/AI Policy
- Codex può proporre fix automatici solo se test e build passano
- Preferire PR su branch separati (`codex/auto-fix-*`)
- Aggiorna questo file se cambi flusso, script, policy o variabili

## 📚 Documentation & Maintenance
- Aggiorna sempre README.md se modifichi script build/test/start
- Mantieni allineati `AGENTS.md` e documentazione pipeline

---
