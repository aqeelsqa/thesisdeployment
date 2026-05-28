# UCITAF — CI/CD Research Dashboard (Pure HTML/CSS/JS)

> **AI-Enabled Framework for Intelligent Test Analysis and Continuous Quality Improvement in CI/CD Pipelines**  
> Muhammad Aqeel · 2024(s)-MS-SE-07 · Supervisor: Dr. Tauqir Ahmad  
> Department of Computer Science · University of Engineering & Technology, Lahore · 2025–2026

---

## 🌐 Live Demo
After deploying → your Vercel URL will appear here e.g. **`https://ucitaf-dashboard.vercel.app`**

---

## ✅ No Build Step Required

This is **pure HTML + CSS + JavaScript**. No Node.js, no npm, no bundler.

- `index.html` — complete dashboard shell
- `js/data.js` — all experimental results as JS constants
- `js/charts.js` — lightweight canvas chart engine (zero dependencies)
- `js/app.js` — tab system, table builder, chart wiring
- Tailwind CSS loaded from **CDN** (no install needed)

---

## 📂 Folder Structure

```
ucitaf-html/
├── index.html          ← Open this in any browser — it just works
├── js/
│   ├── data.js         ← All 4 experiments' result data
│   ├── charts.js       ← Canvas bar/area/radar/donut charts
│   └── app.js          ← Tab rendering, tables, chart wiring
├── vercel.json         ← Vercel static deployment config
├── .gitignore
└── README.md
```

---

## 🚀 Run Locally (Zero Install)

Just open `index.html` in any browser:

```bash
# Option A — double-click index.html in file explorer

# Option B — quick local server (Python)
python3 -m http.server 8080
# then open http://localhost:8080

# Option C — quick local server (Node)
npx serve .
# then open the printed URL
```

---

## 📤 Push to GitHub

```bash
# 1. Create repo at github.com/new
#    Name: ucitaf-dashboard
#    Do NOT initialise with README

# 2. Inside this folder:
git init
git add .
git commit -m "feat: UCITAF research dashboard — pure HTML/CSS/JS"

# 3. Link & push
git remote add origin https://github.com/YOUR_USERNAME/ucitaf-dashboard.git
git branch -M main
git push -u origin main
```

---

## 🌐 Deploy to Vercel (Recommended)

### Option A — Import from GitHub (easiest)
1. Go to **[vercel.com/new](https://vercel.com/new)**
2. Click **"Import Git Repository"**
3. Select `ucitaf-dashboard`
4. Under **Framework Preset** → choose **"Other"**
5. Leave all settings as default → click **Deploy**
6. ✅ Every `git push` to `main` auto-redeploys

### Option B — Vercel CLI
```bash
# Install CLI once
npm install -g vercel

# Inside project folder
vercel

# Prompts:
# Set up and deploy? → Y
# Which scope? → your account
# Link to existing project? → N
# Project name → ucitaf-dashboard
# In which directory? → ./  (press Enter)
# Override settings? → N

# Production deploy
vercel --prod
```

---

## 📊 Dashboard Tabs

| Tab | What You See |
|-----|-------------|
| **Overview** | Central idea, performance radar, CQS donut, architecture diagram, datasets |
| **Exp 1: Failure Pred.** | Results table, F1/ROC-AUC bar chart, feature importance chart |
| **Exp 2: Flaky Detection** | Classifier comparison, confusion matrix (TP/TN/FP/FN) |
| **Exp 3: Log Classification** | Per-class F1 progress bars, macro metrics table |
| **Exp 4: CQS Trends** | CQS formula, 50-build area chart with flaky spikes, Spearman correlation table |
| **Setup & Datasets** | Toolchain, resource efficiency, research timetable, Gantt chart |

---

## 🔑 Key Results

| Experiment | Best Model | Best Metric |
|---|---|---|
| Failure Prediction | Random Forest | F1 = **0.871**, ROC-AUC = **0.901** |
| Flaky-Test Detection | Random Forest | Recall = **0.843**, F1 = **0.820** |
| Log Classification (4-class) | Random Forest | Macro F1 = **0.803** |
| CQS Correlation | — | Spearman ρ = **0.847** |
| Total Training Time | All 4 experiments | **< 83 min, 16 GB RAM, No GPU** |

---

## 🛠️ Customise

To update results, edit **`js/data.js`** — all chart data is defined there as plain JS objects. No recompile needed — just refresh the browser.

---

## 📄 License

Academic research project. All rights reserved — Muhammad Aqeel, 2025.
