// ─── UCITAF Research Data — Muhammad Aqeel 2024(s)-MS-SE-07 ─────────────────

const META = {
  title:      "AI-Enabled Framework for Intelligent Test Analysis",
  subtitle:   "Continuous Quality Improvement in CI/CD Pipelines",
  student:    "Muhammad Aqeel",
  regNo:      "2024(s)-MS-SE-07",
  supervisor: "Dr. Tauqir Ahmad",
  dept:       "Department of Computer Science",
  uni:        "University of Engineering & Technology, Lahore",
  year:       "2025–2026"
};

const KEY_METRICS = [
  { label: "Failure Pred. F1",  value: "0.871", sub: "Random Forest",  color: "#4ade80" },
  { label: "Flaky-Test Recall", value: "0.843", sub: "Random Forest",  color: "#2dd4bf" },
  { label: "Log Class. F1",     value: "0.803", sub: "4-Class NLP",    color: "#60a5fa" },
  { label: "CQS Correlation",   value: "0.847", sub: "Spearman ρ",     color: "#fbbf24" },
  { label: "Train Time",        value: "83 min",sub: "No GPU needed",  color: "#f472b6" },
  { label: "Inference",         value: "<500ms",sub: "Per Build",      color: "#a78bfa" }
];

const FAILURE_PREDICTION = {
  classifiers: [
    { name:"Majority Baseline",      accuracy:0.700, precision:0.700, recall:null,  f1:null,  roc:0.500, type:"baseline" },
    { name:"Heuristic Recency Rule", accuracy:0.751, precision:0.732, recall:0.769, f1:0.750, roc:0.762, type:"baseline" },
    { name:"Naive Bayes",            accuracy:0.774, precision:0.761, recall:0.783, f1:0.772, roc:0.803, type:"proposed" },
    { name:"Logistic Regression",    accuracy:0.812, precision:0.798, recall:0.821, f1:0.809, roc:0.841, type:"proposed" },
    { name:"Random Forest ★",        accuracy:0.881, precision:0.869, recall:0.874, f1:0.871, roc:0.901, type:"selected" },
    { name:"XGBoost (comparative)",  accuracy:0.893, precision:0.878, recall:0.886, f1:0.882, roc:0.911, type:"comparative" }
  ],
  featureImportance: [
    { feature:"Historical Failure Rate", importance:0.284 },
    { feature:"Recent Trend (RT)",       importance:0.198 },
    { feature:"Instability Ratio",       importance:0.174 },
    { feature:"Duration Deviation",      importance:0.121 },
    { feature:"Retry Behaviour",         importance:0.089 },
    { feature:"Log TF-IDF Terms",        importance:0.063 },
    { feature:"Commit Change Size",      importance:0.041 },
    { feature:"Author Experience",       importance:0.030 }
  ]
};

const FLAKY_DETECTION = {
  classifiers: [
    { name:"Random Labelling",        precision:0.190, recall:0.190, f1:0.190, roc:0.500, type:"baseline" },
    { name:"Instability Threshold",   precision:0.641, recall:0.720, f1:0.678, roc:0.703, type:"baseline" },
    { name:"FlakeFlagger (Lin et al)",precision:0.730, recall:0.810, f1:0.768, roc:0.792, type:"literature" },
    { name:"Naive Bayes",             precision:0.712, recall:0.801, f1:0.754, roc:0.769, type:"proposed" },
    { name:"Logistic Regression",     precision:0.741, recall:0.793, f1:0.766, roc:0.783, type:"proposed" },
    { name:"Random Forest ★",         precision:0.798, recall:0.843, f1:0.820, roc:0.841, type:"selected" }
  ],
  confusionMatrix: { tn:1482, fp:82, fn:72, tp:385 }
};

const LOG_CLASSIFICATION = {
  classifiers: [
    { name:"Keyword-Rule Baseline",      accuracy:0.701, macroF1:0.706, type:"baseline" },
    { name:"Naive Bayes (Complement)",   accuracy:0.762, macroF1:0.761, type:"proposed" },
    { name:"Logistic Regression ★",     accuracy:0.804, macroF1:0.791, type:"selected" },
    { name:"Random Forest",             accuracy:0.819, macroF1:0.803, type:"proposed" }
  ],
  perClass: [
    { category:"Environment Error", precision:0.832, recall:0.851, f1:0.841, support:712 },
    { category:"Build Error",       precision:0.818, recall:0.806, f1:0.812, support:548 },
    { category:"Test Failure",      precision:0.845, recall:0.829, f1:0.837, support:634 },
    { category:"Dependency Error",  precision:0.741, recall:0.762, f1:0.751, support:306 }
  ]
};

const CQS_ANALYSIS = {
  formula: "CQS = 0.40·PR + 0.25·(1−FPen) + 0.20·(1−LSI) + 0.15·HS",
  components: [
    { name:"Pass Rate (PR)",            weight:0.40, desc:"Proportion of passing runs in window W=20" },
    { name:"Flakiness Penalty (FPen)",  weight:0.25, desc:"Fraction of non-deterministic test outcomes" },
    { name:"Log Severity Index (LSI)",  weight:0.20, desc:"CRITICAL=1.0, ERROR=0.7, WARN=0.3" },
    { name:"Historical Stability (HS)", weight:0.15, desc:"Exponential moving avg of pass rates" }
  ],
  correlations: [
    { pair:"CQS vs Rolling Pass Rate",     rho: 0.847, pVal:"< 0.001" },
    { pair:"CQS vs Flaky-Test Rate",       rho:-0.801, pVal:"< 0.001" },
    { pair:"CQS vs Mean Time to Recovery", rho:-0.782, pVal:"< 0.001" },
    { pair:"CQS vs Log Severity Index",    rho:-0.769, pVal:"< 0.001" },
    { pair:"T-CQS vs Subsequent Failure",  rho:-0.803, pVal:"< 0.001" },
    { pair:"CQS vs Build Frequency",       rho: 0.312, pVal:"0.027" }
  ],
  trend: (function() {
    const pts = [];
    for (let i = 0; i < 50; i++) {
      const base = 0.72 + Math.sin(i * 0.18) * 0.12 + Math.cos(i * 0.09) * 0.08;
      const flaky = (i >= 14 && i <= 16) || (i >= 31 && i <= 33) ? -0.25 : 0;
      const cqs = Math.max(0.35, Math.min(0.97, base + flaky));
      const pr  = Math.max(0.40, Math.min(0.99, cqs + 0.03));
      pts.push({ build: i + 1, cqs: +cqs.toFixed(3), pr: +pr.toFixed(3), isFlaky: flaky !== 0 });
    }
    return pts;
  })()
};

const RESOURCE_EFFICIENCY = [
  { module:"Failure Prediction (RF)",  train:"~45 min", infer:"< 200 ms", ram:"~1.2 GB" },
  { module:"Flaky Detection (RF)",     train:"~18 min", infer:"< 100 ms", ram:"~0.4 GB" },
  { module:"Log Classification (LR)",  train:"~12 min", infer:"< 50 ms",  ram:"~0.6 GB" },
  { module:"CQS Computation",          train:"~8 min",  infer:"< 10 ms",  ram:"~0.2 GB" },
  { module:"TOTAL",                    train:"~83 min", infer:"< 500 ms", ram:"< 2.5 GB" }
];

const DATASETS = [
  { name:"TravisTorrent",    projects:1283, records:"2.6M+",  use:"Failure Prediction, CQS" },
  { name:"iDFlakies/IDoFT", projects:26,   records:"3,296",  use:"Flaky-Test Detection" },
  { name:"FlakeFlagger",    projects:24,   records:"1,921",  use:"Flakiness Features" },
  { name:"Defects4J",       projects:17,   records:"835",    use:"Regression Failures" }
];

const TIMETABLE = [
  { task:"Proposal Submission",            period:"Dec 2025",         phase:"Month 0" },
  { task:"Literature Review",              period:"Dec 2025 – Jan 2026", phase:"Months 0–1" },
  { task:"Data Collection & Preprocessing",period:"Jan – Feb 2026",   phase:"Months 1–2" },
  { task:"Model Training & Implementation",period:"Feb – Apr 2026",   phase:"Months 2–4" },
  { task:"Experimentation & Testing",      period:"Apr – May 2026",   phase:"Months 4–5" },
  { task:"Analysis & Evaluation",          period:"May – Jun 2026",   phase:"Months 5–6" },
  { task:"Final Report Writing",           period:"Jun – Jul 2026",   phase:"Months 6–7" },
  { task:"Final Submission",               period:"Nov 2026",         phase:"Month 11" }
];
