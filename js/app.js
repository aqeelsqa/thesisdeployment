// ─── UCITAF Dashboard App — Vanilla JS ───────────────────────────────────────

(function () {
  'use strict';

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const $ = id => document.getElementById(id);
  const html = (tpl) => tpl; // template tag passthrough

  const TYPE_BADGE = {
    baseline:    'bg-slate-700/60 text-slate-300 border border-slate-600',
    literature:  'bg-amber-900/40 text-amber-300 border border-amber-700/50',
    proposed:    'bg-teal-900/40  text-teal-300  border border-teal-700/50',
    selected:    'bg-green-900/40 text-green-300 border border-green-700/50',
    comparative: 'bg-indigo-900/40 text-indigo-300 border border-indigo-700/50'
  };

  function badge(type, label) {
    return `<span class="text-xs px-2 py-0.5 rounded-full font-mono ${TYPE_BADGE[type] || ''}">${label || type}</span>`;
  }

  function fmt(v, dec = 3) {
    if (v === null || v === undefined) return '<span class="text-slate-600">—</span>';
    if (typeof v === 'number') return v.toFixed(dec);
    return v;
  }

  function rhoColor(rho) {
    const abs = Math.abs(rho);
    if (abs > 0.8) return 'text-green-400';
    if (abs > 0.6) return 'text-teal-400';
    return 'text-amber-400';
  }

  function progressBar(val, color = '#0D7680') {
    return `
      <div class="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
        <div class="h-full rounded-full transition-all duration-700"
             style="width:${(val * 100).toFixed(1)}%; background:${color}"></div>
      </div>`;
  }

  // ── Table builder ────────────────────────────────────────────────────────────
  function buildTable(headers, rows, opts = {}) {
    const { striped = true } = opts;
    const ths = headers.map(h => `<th class="px-4 py-2.5 text-left text-xs font-mono uppercase tracking-wider text-blue-300 border-b border-navy/40 bg-navy/40 whitespace-nowrap">${h}</th>`).join('');
    const trs = rows.map((row, ri) => {
      const tds = row.map(cell => `<td class="px-4 py-2 text-sm text-slate-300 border-b border-navy/20 align-middle">${cell}</td>`).join('');
      const bg = striped && ri % 2 === 0 ? 'bg-navy/5' : '';
      return `<tr class="${bg} hover:bg-teal/5 transition-colors">${tds}</tr>`;
    }).join('');
    return `
      <div class="overflow-x-auto rounded-lg border border-navy/40">
        <table class="w-full text-sm">
          <thead><tr>${ths}</tr></thead>
          <tbody>${trs}</tbody>
        </table>
      </div>`;
  }

  // ── Section header ───────────────────────────────────────────────────────────
  function sectionHead(num, title, sub = '') {
    return `
      <div class="mb-6">
        <div class="flex items-center gap-3 mb-1">
          <span class="text-xs font-mono px-2 py-1 rounded bg-teal/20 text-teal-300 border border-teal/30">EXP ${num}</span>
          <h2 class="text-base font-bold text-slate-100" style="font-family:Georgia,serif">${title}</h2>
        </div>
        ${sub ? `<p class="text-xs text-slate-500 ml-16">${sub}</p>` : ''}
      </div>`;
  }

  // ── Canvas wrapper ───────────────────────────────────────────────────────────
  function canvasCard(id, title, height = 260) {
    return `
      <div class="card p-4">
        <p class="text-xs text-teal-400 uppercase tracking-wider mb-3">${title}</p>
        <canvas id="${id}" style="width:100%;height:${height}px;display:block;"></canvas>
      </div>`;
  }

  // ════════════════════════════════════════════════════════════════════════════
  // TAB: OVERVIEW
  // ════════════════════════════════════════════════════════════════════════════
  function renderOverview() {
    return `
      <!-- Central Idea Box -->
      <div class="card p-5 mb-6 border-teal/40">
        <p class="text-xs text-teal-400 uppercase tracking-wider mb-2">Central Research Idea</p>
        <p class="text-slate-300 leading-relaxed" style="font-family:Georgia,serif">
          Transform CI/CD pipelines from
          <strong class="text-teal-300">passive execution systems</strong> into
          <strong class="text-teal-300">intelligent, AI-driven quality monitoring systems</strong> —
          integrating failure prediction, flaky-test detection, log classification, and a
          Continuous Quality Score within a single lightweight framework accessible to
          <strong class="text-amber-400">small teams without enterprise infrastructure</strong>.
        </p>
      </div>

      <!-- Radar + Donut row -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        ${canvasCard('radarChart', 'Performance Radar — Proposed vs Baseline', 280)}
        <div class="card p-4">
          <p class="text-xs text-teal-400 uppercase tracking-wider mb-3">CQS Weight Distribution</p>
          <canvas id="donutChart" style="width:100%;height:220px;display:block;"></canvas>
        </div>
      </div>

      <!-- Framework Architecture -->
      <div class="card p-5 mb-6">
        <p class="text-xs text-teal-400 uppercase tracking-wider mb-4">Framework Architecture — 4 Layers</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          ${[
            { n:'Layer 1', t:'Data Ingestion', i:'📥', d:'CI logs, test outcomes, metadata from Jenkins, GitLab, GitHub Actions, Travis CI', c:'border-blue-700/50 bg-blue-900/10' },
            { n:'Layer 2', t:'Feature Engineering', i:'⚙️', d:'Historical failure rates, instability ratios, retry behaviour, TF-IDF log vectors', c:'border-amber-700/50 bg-amber-900/10' },
            { n:'Layer 3', t:'Analytics Engine', i:'🤖', d:'Failure Prediction · Flaky Detection · Log Classification (LR / RF / NB)', c:'border-teal-700/50 bg-teal-900/10' },
            { n:'Layer 4', t:'CQS & Reporting', i:'📊', d:'Test-Level CQS · Pipeline-Level CQS · Trend Dashboards · Alerts', c:'border-green-700/50 bg-green-900/10' }
          ].map(l => `
            <div class="rounded-lg p-4 border ${l.c}">
              <div class="text-xl mb-2">${l.i}</div>
              <div class="text-xs font-mono text-slate-400 mb-1">${l.n}</div>
              <div class="text-sm font-bold text-slate-200 mb-2">${l.t}</div>
              <p class="text-xs text-slate-500 leading-relaxed">${l.d}</p>
            </div>`).join('')}
        </div>
      </div>

      <!-- Datasets -->
      <div class="card p-5 mb-6">
        <p class="text-xs text-teal-400 uppercase tracking-wider mb-4">Public CI Datasets Used</p>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          ${DATASETS.map(d => `
            <div class="rounded-lg p-3 bg-navy/20 border border-navy/40">
              <div class="text-sm font-bold text-teal-300 font-mono">${d.name}</div>
              <div class="text-xs text-slate-400 mt-1">${d.projects.toLocaleString()} projects</div>
              <div class="text-xs text-slate-400">${d.records} records</div>
              <div class="text-xs text-slate-500 mt-2">${d.use}</div>
            </div>`).join('')}
        </div>
      </div>
    `;
  }

  // ════════════════════════════════════════════════════════════════════════════
  // TAB: FAILURE PREDICTION
  // ════════════════════════════════════════════════════════════════════════════
  function renderFailure() {
    const rows = FAILURE_PREDICTION.classifiers.map(c => [
      `<span class="font-mono text-slate-200">${c.name}</span>`,
      fmt(c.accuracy), fmt(c.precision), fmt(c.recall), fmt(c.f1),
      `<span class="font-mono ${c.roc >= 0.9 ? 'text-green-400 font-bold' : ''}">${fmt(c.roc)}</span>`,
      badge(c.type, c.type)
    ]);

    return `
      ${sectionHead('01', 'Failure Prediction — ML Classifier Comparison',
        'Dataset: TravisTorrent + Defects4J | 5-Fold Stratified CV + SMOTE')}

      <div class="mb-6">
        ${buildTable(['Classifier','Accuracy','Precision','Recall','F1-Score','ROC-AUC','Type'], rows)}
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        ${canvasCard('fp_bar', 'F1-Score & ROC-AUC by Classifier', 260)}
        ${canvasCard('fp_feat', 'Feature Importance — Random Forest (Top 8)', 260)}
      </div>

      <div class="card p-5">
        <p class="text-xs text-teal-400 uppercase tracking-wider mb-3">Key Finding</p>
        <p class="text-sm text-slate-300 leading-relaxed">
          <strong class="text-green-400">Random Forest ★</strong> achieves the best balance of F1 (0.871) and ROC-AUC (0.901),
          selected as the primary production classifier due to lower inference latency vs XGBoost.
          <strong class="text-teal-300">Historical Failure Rate</strong> is the most discriminative feature (importance: 0.284),
          confirming that temporal CI execution history carries strong predictive signal.
          All proposed classifiers significantly outperform baselines (Wilcoxon p &lt; 0.001).
        </p>
      </div>
    `;
  }

  // ════════════════════════════════════════════════════════════════════════════
  // TAB: FLAKY DETECTION
  // ════════════════════════════════════════════════════════════════════════════
  function renderFlaky() {
    const cm = FLAKY_DETECTION.confusionMatrix;
    const precision = (cm.tp / (cm.tp + cm.fp)).toFixed(3);
    const recall    = (cm.tp / (cm.tp + cm.fn)).toFixed(3);
    const f1        = (2 * cm.tp / (2 * cm.tp + cm.fp + cm.fn)).toFixed(3);

    const rows = FLAKY_DETECTION.classifiers.map(c => [
      `<span class="font-mono text-slate-200">${c.name}</span>`,
      fmt(c.precision), fmt(c.recall), fmt(c.f1), fmt(c.roc),
      badge(c.type, c.type)
    ]);

    return `
      ${sectionHead('02', 'Flaky-Test Detection — Benchmark Comparison',
        'Dataset: iDFlakies + FlakeFlagger | 5-Fold CV, Recall-prioritised')}

      <div class="mb-6">
        ${buildTable(['Classifier','Precision','Recall ↑','F1','ROC-AUC','Type'], rows)}
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        ${canvasCard('fd_bar', 'Precision / Recall / F1 Comparison', 250)}

        <div class="card p-5">
          <p class="text-xs text-teal-400 uppercase tracking-wider mb-4">Confusion Matrix — Random Forest (Test Partition)</p>
          <div class="grid grid-cols-2 gap-3 mb-4">
            ${[
              { l:'True Negative',  v:cm.tn, c:'#22c55e', s:'Correctly Not Flaky' },
              { l:'False Positive', v:cm.fp, c:'#f59e0b', s:'Wrongly Flagged Flaky' },
              { l:'False Negative', v:cm.fn, c:'#ef4444', s:'Missed Flaky Tests' },
              { l:'True Positive',  v:cm.tp, c:'#2dd4bf', s:'Correctly Found Flaky' }
            ].map(cell => `
              <div class="rounded-lg p-3 text-center" style="background:rgba(27,58,107,0.2);border:1px solid ${cell.c}44">
                <div class="text-2xl font-bold font-mono" style="color:${cell.c}">${cell.v}</div>
                <div class="text-xs font-bold mt-1" style="color:${cell.c}">${cell.l}</div>
                <div class="text-xs text-slate-500 mt-1">${cell.s}</div>
              </div>`).join('')}
          </div>
          <div class="grid grid-cols-3 gap-2 text-center">
            ${[['Precision', precision, '#2dd4bf'], ['Recall ★', recall, '#22c55e'], ['F1-Score', f1, '#60a5fa']].map(([l,v,c]) => `
              <div class="rounded p-2 bg-navy/20">
                <div class="text-lg font-bold font-mono" style="color:${c}">${v}</div>
                <div class="text-xs text-slate-400">${l}</div>
              </div>`).join('')}
          </div>
        </div>
      </div>

      <div class="card p-5">
        <p class="text-xs text-teal-400 uppercase tracking-wider mb-3">Key Finding</p>
        <p class="text-sm text-slate-300 leading-relaxed">
          <strong class="text-green-400">Random Forest ★</strong> achieves recall of <strong>0.843</strong>,
          identifying 84.3% of all flaky tests — surpassing the published FlakeFlagger baseline (recall 0.810).
          Recall is prioritised over precision because undetected flaky tests impose higher cost
          (continued false positives) than false alarms (one-time investigation).
        </p>
      </div>
    `;
  }

  // ════════════════════════════════════════════════════════════════════════════
  // TAB: LOG CLASSIFICATION
  // ════════════════════════════════════════════════════════════════════════════
  function renderLogs() {
    const rows = LOG_CLASSIFICATION.classifiers.map(c => [
      `<span class="font-mono text-slate-200">${c.name}</span>`,
      fmt(c.accuracy),
      `<strong class="${c.type === 'selected' ? 'text-green-400' : ''}">${fmt(c.macroF1)}</strong>`,
      badge(c.type, c.type)
    ]);

    const barColors = ['#ef4444','#f59e0b','#0D7680','#64748b'];

    return `
      ${sectionHead('03', 'CI Log Classification — 4-Category NLP Pipeline',
        'Dataset: TravisTorrent — 2,000 manually annotated records | TF-IDF + Classical Classifiers')}

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div>
          ${buildTable(['Classifier','Accuracy','Macro F1','Type'], rows)}
        </div>

        <div class="card p-5">
          <p class="text-xs text-teal-400 uppercase tracking-wider mb-4">Per-Class F1 — Random Forest</p>
          ${LOG_CLASSIFICATION.perClass.map((pc, i) => `
            <div class="mb-4">
              <div class="flex justify-between text-xs mb-1">
                <span class="text-slate-300">${pc.category}</span>
                <span class="font-mono ${pc.f1 < 0.78 ? 'text-amber-400' : 'text-green-400'}">
                  F1: ${pc.f1.toFixed(3)} <span class="text-slate-500">(n=${pc.support})</span>
                </span>
              </div>
              <div class="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all duration-700"
                  style="width:${(pc.f1*100).toFixed(1)}%;background:${pc.f1 < 0.78 ? 'linear-gradient(90deg,#b45309,#fbbf24)' : 'linear-gradient(90deg,#0D7680,#22c55e)'}"></div>
              </div>
              <div class="flex gap-4 text-xs text-slate-500 mt-1">
                <span>Precision: ${pc.precision.toFixed(3)}</span>
                <span>Recall: ${pc.recall.toFixed(3)}</span>
              </div>
            </div>`).join('')}
        </div>
      </div>

      ${canvasCard('lc_bar', 'Accuracy & Macro F1 — All Classifiers', 230)}

      <div class="card p-5 mt-5">
        <p class="text-xs text-teal-400 uppercase tracking-wider mb-3">Key Finding</p>
        <p class="text-sm text-slate-300 leading-relaxed">
          <strong class="text-green-400">Logistic Regression ★</strong> (Macro F1: 0.791) is selected as the
          production classifier for its speed vs. Random Forest (0.803), both significantly outperforming the
          keyword-rule baseline (0.706). <strong class="text-amber-400">Dependency Error</strong> is the most
          challenging category (F1: 0.751) due to heterogeneous package-manager log syntax across npm, Maven, pip, and Gradle.
        </p>
      </div>
    `;
  }

  // ════════════════════════════════════════════════════════════════════════════
  // TAB: CQS
  // ════════════════════════════════════════════════════════════════════════════
  function renderCQS() {
    const corrRows = CQS_ANALYSIS.correlations.map(c => [
      c.pair,
      `<span class="font-mono font-bold ${rhoColor(c.rho)}">${c.rho.toFixed(3)}</span>`,
      `<span class="font-mono">${c.pVal}</span>`,
      `<span class="${Math.abs(c.rho) > 0.8 ? 'badge-green' : 'badge-teal'} badge">${c.rho > 0 ? '↑ Positive' : '↓ Negative'}</span>`
    ]);

    return `
      ${sectionHead('04', 'Continuous Quality Score — Validation & Trend Analysis',
        'Dataset: 50 TravisTorrent projects, 200+ build cycles each')}

      <!-- Formula -->
      <div class="card p-5 mb-6 border border-teal/40">
        <p class="text-xs text-teal-400 uppercase tracking-wider mb-3">CQS Formula</p>
        <div class="text-center py-3 rounded-lg font-mono text-base md:text-lg"
          style="background:rgba(13,118,128,0.1);border:1px solid rgba(13,118,128,0.3);color:#5eead4">
          ${CQS_ANALYSIS.formula}
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          ${CQS_ANALYSIS.components.map(c => `
            <div class="rounded-lg p-3 text-center bg-navy/20">
              <div class="text-xl font-bold font-mono text-teal-300">${c.weight}</div>
              <div class="text-xs font-bold text-slate-300 mt-1">${c.name}</div>
              <div class="text-xs text-slate-500 mt-1">${c.desc}</div>
            </div>`).join('')}
        </div>
      </div>

      <!-- Trend chart -->
      ${canvasCard('cqs_trend', 'CQS Longitudinal Trend — 50-Build Illustrative Project', 280)}

      <!-- Correlation table -->
      <div class="mt-6 mb-6">
        <p class="text-xs text-teal-400 uppercase tracking-wider mb-3">Spearman Correlation Analysis — 50 Projects</p>
        ${buildTable(['Correlation Pair','Spearman ρ','p-value','Direction'], corrRows)}
      </div>

      <div class="card p-5">
        <p class="text-xs text-teal-400 uppercase tracking-wider mb-3">Key Finding</p>
        <p class="text-sm text-slate-300 leading-relaxed">
          CQS demonstrates <strong class="text-green-400">Spearman ρ = 0.847</strong> with rolling pass rate and
          strong negative correlations with flaky-test rate (−0.801) and MTTR (−0.782), confirming the composite
          score accurately reflects multi-dimensional pipeline health. CQS values below 0.5 preceded build failure
          events in <strong class="text-teal-300">78% of cases</strong> within the following 5 build cycles.
        </p>
      </div>
    `;
  }

  // ════════════════════════════════════════════════════════════════════════════
  // TAB: SETUP
  // ════════════════════════════════════════════════════════════════════════════
  function renderSetup() {
    const tools = [
      ['Python 3.10+, pandas, NumPy, scikit-learn, XGBoost','Programming & ML','Core pipeline, feature engineering, model training'],
      ['scikit-learn TF-IDF, NLTK, spaCy','NLP & Text Processing','Tokenisation, stop-word removal, log vectorisation'],
      ['Jupyter Notebook, Google Colab','Dev Environment','Interactive EDA, training, result visualisation'],
      ['Git, CSV / JSON','Data Management','Version control, dataset storage'],
      ['Matplotlib, Plotly','Visualisation','CQS trends, ROC curves, confusion matrices'],
      ['Intel i7, 16 GB RAM, Ubuntu 22.04, No GPU','Hardware','All 4 experiments in < 83 min']
    ];

    const resRows = RESOURCE_EFFICIENCY.map(r => [
      `<span class="font-mono ${r.module === 'TOTAL' ? 'text-teal-300 font-bold' : 'text-slate-200'}">${r.module}</span>`,
      r.train,
      `<span class="badge badge-green">${r.infer}</span>`,
      r.ram
    ]);

    const ttRows = TIMETABLE.map(t => [
      `<span class="font-semibold">${t.task}</span>`,
      `<span class="font-mono text-teal-400">${t.period}</span>`,
      `<span class="badge badge-navy">${t.phase}</span>`
    ]);

    return `
      <div class="mb-6">
        <p class="text-xs text-teal-400 uppercase tracking-wider mb-4">Implementation Toolchain</p>
        ${buildTable(['Tool / Library','Category','Role'], tools.map(t => t.map(s => `<span class="text-slate-300">${s}</span>`)))}
      </div>

      <div class="mb-6">
        <p class="text-xs text-teal-400 uppercase tracking-wider mb-4">Resource Efficiency — Standard Laptop, No GPU</p>
        ${buildTable(['Module','Train Time','Inference / Build','Peak RAM'], resRows)}
      </div>

      <div class="mb-6">
        <p class="text-xs text-teal-400 uppercase tracking-wider mb-4">Research Timetable (ORIC Proposal)</p>
        ${buildTable(['Task','Period','Phase'], ttRows)}
      </div>

      ${canvasCard('gantt_bar', 'Gantt — Phase Duration (Months)', 220)}
    `;
  }

  // ════════════════════════════════════════════════════════════════════════════
  // CHART RENDERING PER TAB
  // ════════════════════════════════════════════════════════════════════════════
  function renderCharts(tab) {
    requestAnimationFrame(() => {
      if (tab === 'overview') {
        // Radar
        Charts.drawRadar('radarChart', [], {
          labels: ['Failure F1','Flaky Recall','Log F1','CQS Corr.','ROC-AUC','Resource Eff.'],
          series: [
            { values:[0.871,0.843,0.803,0.847,0.901,0.90], color:'#0D7680', label:'Proposed' },
            { values:[0.750,0.720,0.706,0.600,0.762,0.75], color:'#1B3A6B', label:'Baseline', dashed:true }
          ]
        });
        // Donut
        Charts.drawDonut('donutChart', [
          { label:'Pass Rate',           value:0.40, color:'#0D7680' },
          { label:'Flakiness Penalty',   value:0.25, color:'#1B3A6B' },
          { label:'Log Severity Index',  value:0.20, color:'#f59e0b' },
          { label:'Historical Stability',value:0.15, color:'#22c55e' }
        ], { centerLabel:'CQS', centerSub:'4 Components' });
      }

      if (tab === 'failure') {
        const clf = FAILURE_PREDICTION.classifiers;
        Charts.drawBar('fp_bar', clf, {
          keys: ['f1','roc'],
          colors: ['#0D7680','#1B3A6B'],
          labels: clf.map(c => c.name.replace(' ★','').replace(' (comparative)','')),
          minVal: 0, maxVal: 1,
          showLegend: true,
          legendLabels: ['F1-Score','ROC-AUC']
        });
        Charts.drawHBar('fp_feat', FAILURE_PREDICTION.featureImportance, {
          maxVal: 0.32, color:'#0D7680',
          labelKey:'feature', valueKey:'importance'
        });
      }

      if (tab === 'flaky') {
        const clf = FLAKY_DETECTION.classifiers;
        Charts.drawBar('fd_bar', clf, {
          keys: ['precision','recall','f1'],
          colors: ['#1B3A6B','#0D7680','#22c55e'],
          labels: clf.map(c => c.name.replace(' ★','')),
          minVal: 0, maxVal: 1,
          showLegend: true,
          legendLabels: ['Precision','Recall','F1']
        });
      }

      if (tab === 'logs') {
        const clf = LOG_CLASSIFICATION.classifiers;
        Charts.drawBar('lc_bar', clf, {
          keys: ['accuracy','macroF1'],
          colors: ['#1B3A6B','#0D7680'],
          labels: clf.map(c => c.name.replace(' ★','').replace(' (Complement)','')),
          minVal: 0.55, maxVal: 0.87,
          showLegend: true,
          legendLabels: ['Accuracy','Macro F1']
        });
      }

      if (tab === 'cqs') {
        const t = CQS_ANALYSIS.trend;
        const spikes = t.reduce((acc, d, i) => {
          if (d.isFlaky && (i === 0 || !t[i-1].isFlaky)) acc.push({ x:i, color:'#ef4444', label:'Flaky' });
          return acc;
        }, []);
        Charts.drawArea('cqs_trend', t, {
          xKey: 'build',
          series: [
            { key:'cqs',  color:'#0D7680', label:'CQS Score' },
            { key:'pr',   color:'#1B3A6B', label:'Pass Rate', dashed:true }
          ],
          minVal: 0.3, maxVal: 1.0,
          referenceLines: spikes,
          thresholdY: 0.5
        });
      }

      if (tab === 'setup') {
        // Gantt as horizontal bar
        const ganttData = [
          { feature:'Proposal',          importance:1 },
          { feature:'Lit. Review',       importance:2 },
          { feature:'Data Collection',   importance:2 },
          { feature:'Model Training',    importance:3 },
          { feature:'Experimentation',   importance:2 },
          { feature:'Analysis',          importance:2 },
          { feature:'Report Writing',    importance:2 },
          { feature:'Submission',        importance:1 }
        ];
        Charts.drawHBar('gantt_bar', ganttData, {
          maxVal: 4, color:'#0D7680', labelKey:'feature', valueKey:'importance'
        });
      }
    });
  }

  // ════════════════════════════════════════════════════════════════════════════
  // TAB SYSTEM
  // ════════════════════════════════════════════════════════════════════════════
  const TABS = [
    { id:'overview', label:'Overview' },
    { id:'failure',  label:'Exp 1: Failure Pred.' },
    { id:'flaky',    label:'Exp 2: Flaky Detection' },
    { id:'logs',     label:'Exp 3: Log Classification' },
    { id:'cqs',      label:'Exp 4: CQS Trends' },
    { id:'setup',    label:'Setup & Datasets' }
  ];

  const RENDERERS = {
    overview: renderOverview,
    failure:  renderFailure,
    flaky:    renderFlaky,
    logs:     renderLogs,
    cqs:      renderCQS,
    setup:    renderSetup
  };

  let currentTab = 'overview';

  function activateTab(id) {
    currentTab = id;

    // Update buttons
    TABS.forEach(t => {
      const btn = document.querySelector(`[data-tab="${t.id}"]`);
      if (!btn) return;
      if (t.id === id) {
        btn.classList.add('tab-active');
      } else {
        btn.classList.remove('tab-active');
      }
    });

    // Render content
    const content = $('tab-content');
    content.style.opacity = '0';
    content.innerHTML = RENDERERS[id]();
    requestAnimationFrame(() => {
      content.style.transition = 'opacity 0.25s ease';
      content.style.opacity = '1';
    });
    renderCharts(id);
  }

  // ════════════════════════════════════════════════════════════════════════════
  // INIT
  // ════════════════════════════════════════════════════════════════════════════
  function init() {
    // Key metrics
    const metricsEl = $('key-metrics');
    if (metricsEl) {
      metricsEl.innerHTML = KEY_METRICS.map(m => `
        <div class="card p-4 text-center">
          <div class="text-2xl font-bold font-mono mb-1" style="color:${m.color}">${m.value}</div>
          <div class="text-xs uppercase tracking-widest text-slate-400 mb-1">${m.label}</div>
          <div class="text-xs text-slate-600">${m.sub}</div>
        </div>`).join('');
    }

    // Build tab buttons
    const tabBar = $('tab-bar');
    if (tabBar) {
      tabBar.innerHTML = TABS.map(t => `
        <button data-tab="${t.id}"
          class="tab-btn px-4 py-2 text-xs font-mono rounded border border-navy/30
                 text-slate-400 hover:text-slate-200 hover:border-navy/60 transition-all duration-150"
          onclick="window._ucitaf.activate('${t.id}')">
          ${t.label}
        </button>`).join('');
    }

    // Expose to global for onclick
    window._ucitaf = { activate: activateTab };

    // First tab
    activateTab('overview');
  }

  document.addEventListener('DOMContentLoaded', init);

  // Re-render charts on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => renderCharts(currentTab), 200);
  });

})();
