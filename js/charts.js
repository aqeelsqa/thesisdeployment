// ─── Lightweight Chart Engine — pure canvas, zero dependencies ───────────────

const Charts = (() => {

  // ── Shared helpers ──────────────────────────────────────────────────────────
  function clearCanvas(canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return ctx;
  }

  function typeColor(type) {
    const map = {
      baseline:    '#64748b',
      literature:  '#f59e0b',
      proposed:    '#0D7680',
      selected:    '#22c55e',
      comparative: '#818cf8'
    };
    return map[type] || '#94a3b8';
  }

  // ── Bar Chart ───────────────────────────────────────────────────────────────
  function drawBar(canvasId, data, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight || 260;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    const ctx = clearCanvas(canvas);
    ctx.scale(dpr, dpr);

    const {
      keys = ['value'],
      colors = ['#0D7680'],
      labels,
      maxVal = 1,
      minVal = 0,
      yLabel = '',
      showLegend = false,
      legendLabels = keys,
      useTypeColor = false
    } = options;

    const pad = { top: 20, right: 20, bottom: labels ? 70 : 40, left: 44 };
    const cw = W - pad.left - pad.right;
    const ch = H - pad.top - pad.bottom;

    // Grid lines
    const steps = 5;
    ctx.strokeStyle = 'rgba(27,58,107,0.25)';
    ctx.lineWidth = 0.5;
    ctx.fillStyle = '#64748b';
    ctx.font = '10px Courier New';
    ctx.textAlign = 'right';
    for (let i = 0; i <= steps; i++) {
      const v = minVal + (maxVal - minVal) * (i / steps);
      const y = pad.top + ch - (ch * (i / steps));
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(pad.left + cw, y);
      ctx.stroke();
      ctx.fillText(v.toFixed(2), pad.left - 4, y + 4);
    }

    const n = data.length;
    const groupW = cw / n;
    const barPad = 0.15;
    const barW = (groupW / keys.length) * (1 - barPad * 2);

    data.forEach((d, i) => {
      keys.forEach((k, ki) => {
        const val = d[k] ?? 0;
        if (val === null || val === undefined) return;
        const barH = ch * ((val - minVal) / (maxVal - minVal));
        const x = pad.left + i * groupW + ki * (groupW / keys.length) + (groupW * barPad);
        const y = pad.top + ch - barH;
        const col = useTypeColor ? typeColor(d.type) : colors[ki % colors.length];

        // Gradient fill
        const grad = ctx.createLinearGradient(x, y, x, y + barH);
        grad.addColorStop(0, col);
        grad.addColorStop(1, col + '66');
        ctx.fillStyle = grad;
        const r = Math.min(3, barW / 4);
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + barW - r, y);
        ctx.quadraticCurveTo(x + barW, y, x + barW, y + r);
        ctx.lineTo(x + barW, y + barH);
        ctx.lineTo(x, y + barH);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.fill();

        // Value label
        ctx.fillStyle = '#e2e8f0';
        ctx.font = 'bold 10px Courier New';
        ctx.textAlign = 'center';
        if (val > 0.01) ctx.fillText(val.toFixed(3), x + barW / 2, y - 4);
      });

      // X label
      if (labels) {
        ctx.save();
        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px Courier New';
        ctx.textAlign = 'right';
        ctx.translate(pad.left + i * groupW + groupW / 2, pad.top + ch + 8);
        ctx.rotate(-Math.PI / 4);
        ctx.fillText(labels[i] || d.name || '', 0, 0);
        ctx.restore();
      }
    });

    // Legend
    if (showLegend && keys.length > 1) {
      const lx = pad.left;
      const ly = H - 14;
      keys.forEach((k, ki) => {
        const lpad = ki * 120;
        ctx.fillStyle = colors[ki % colors.length];
        ctx.fillRect(lx + lpad, ly, 10, 10);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px Courier New';
        ctx.textAlign = 'left';
        ctx.fillText(legendLabels[ki] || k, lx + lpad + 14, ly + 9);
      });
    }
  }

  // ── Horizontal Bar Chart ────────────────────────────────────────────────────
  function drawHBar(canvasId, data, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth;
    const H = Math.max(data.length * 38 + 20, 180);
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    const ctx = clearCanvas(canvas);
    ctx.scale(dpr, dpr);

    const { maxVal = 1, color = '#0D7680', labelKey = 'feature', valueKey = 'importance' } = options;
    const labelW = 160;
    const pad = { top: 10, right: 60, bottom: 10, left: labelW };
    const cw = W - pad.left - pad.right;
    const rowH = (H - pad.top - pad.bottom) / data.length;

    data.forEach((d, i) => {
      const val = d[valueKey];
      const barW = cw * (val / maxVal);
      const y = pad.top + i * rowH;
      const barY = y + rowH * 0.2;
      const barH = rowH * 0.6;

      // Label
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '11px Courier New';
      ctx.textAlign = 'right';
      ctx.fillText(d[labelKey], labelW - 8, barY + barH / 2 + 4);

      // Bar bg
      ctx.fillStyle = 'rgba(27,58,107,0.2)';
      ctx.beginPath();
      ctx.roundRect(pad.left, barY, cw, barH, 3);
      ctx.fill();

      // Bar fill
      const grad = ctx.createLinearGradient(pad.left, 0, pad.left + barW, 0);
      grad.addColorStop(0, color);
      grad.addColorStop(1, '#22c55e');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(pad.left, barY, barW, barH, 3);
      ctx.fill();

      // Value
      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 11px Courier New';
      ctx.textAlign = 'left';
      ctx.fillText(val.toFixed(3), pad.left + barW + 6, barY + barH / 2 + 4);
    });
  }

  // ── Area / Line Chart ───────────────────────────────────────────────────────
  function drawArea(canvasId, data, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight || 260;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    const ctx = clearCanvas(canvas);
    ctx.scale(dpr, dpr);

    const {
      series = [{ key:'value', color:'#0D7680', label:'Value' }],
      minVal = 0.3,
      maxVal = 1.0,
      xKey = 'x',
      referenceLines = [],
      thresholdY = null
    } = options;

    const pad = { top: 24, right: 20, bottom: 42, left: 44 };
    const cw = W - pad.left - pad.right;
    const ch = H - pad.top - pad.bottom;

    const xPos = (i) => pad.left + (i / (data.length - 1)) * cw;
    const yPos = (v) => pad.top + ch - (ch * ((v - minVal) / (maxVal - minVal)));

    // Grid
    ctx.strokeStyle = 'rgba(27,58,107,0.25)';
    ctx.lineWidth = 0.5;
    ctx.fillStyle = '#64748b';
    ctx.font = '10px Courier New';
    for (let i = 0; i <= 5; i++) {
      const v = minVal + (maxVal - minVal) * (i / 5);
      const y = yPos(v);
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(pad.left + cw, y);
      ctx.stroke();
      ctx.textAlign = 'right';
      ctx.fillText(v.toFixed(2), pad.left - 4, y + 4);
    }

    // Threshold line
    if (thresholdY !== null) {
      const ty = yPos(thresholdY);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.moveTo(pad.left, ty);
      ctx.lineTo(pad.left + cw, ty);
      ctx.stroke();
      ctx.fillStyle = '#f59e0b';
      ctx.font = '10px Courier New';
      ctx.textAlign = 'left';
      ctx.fillText('Alert Threshold', pad.left + 4, ty - 4);
      ctx.setLineDash([]);
    }

    // Reference vertical lines (flaky spikes)
    referenceLines.forEach(({ x, color, label }) => {
      const rx = xPos(x);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(rx, pad.top);
      ctx.lineTo(rx, pad.top + ch);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = color;
      ctx.font = '9px Courier New';
      ctx.textAlign = 'center';
      ctx.fillText(label, rx, pad.top - 6);
    });

    // Series
    series.forEach(({ key, color, label, dashed }) => {
      const pts = data.map((d, i) => ({ x: xPos(i), y: yPos(d[key]) }));

      // Area fill
      const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + ch);
      grad.addColorStop(0, color + '40');
      grad.addColorStop(1, color + '00');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pad.top + ch);
      pts.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.lineTo(pts[pts.length - 1].x, pad.top + ch);
      ctx.closePath();
      ctx.fill();

      // Line
      if (dashed) ctx.setLineDash([6, 3]);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // X axis labels — every 10
    ctx.fillStyle = '#64748b';
    ctx.font = '10px Courier New';
    ctx.textAlign = 'center';
    data.forEach((d, i) => {
      if (i % 10 === 0 || i === data.length - 1) {
        ctx.fillText(d[xKey] || i + 1, xPos(i), pad.top + ch + 16);
      }
    });
    ctx.fillStyle = '#64748b';
    ctx.font = '10px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('Build Cycle', pad.left + cw / 2, pad.top + ch + 30);

    // Legend
    series.forEach(({ color, label, dashed }, i) => {
      const lx = pad.left + i * 140;
      const ly = H - 10;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      if (dashed) ctx.setLineDash([5, 3]);
      ctx.beginPath();
      ctx.moveTo(lx, ly);
      ctx.lineTo(lx + 24, ly);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px Courier New';
      ctx.textAlign = 'left';
      ctx.fillText(label, lx + 28, ly + 4);
    });
  }

  // ── Radar Chart ─────────────────────────────────────────────────────────────
  function drawRadar(canvasId, data, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const size = Math.min(canvas.offsetWidth, 300);
    canvas.width  = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width  = size + 'px';
    canvas.style.height = size + 'px';
    const ctx = clearCanvas(canvas);
    ctx.scale(dpr, dpr);

    const { series = [], labels = [] } = options;
    const cx = size / 2, cy = size / 2;
    const r  = size * 0.36;
    const n  = labels.length;
    const angle = (i) => (Math.PI * 2 * i / n) - Math.PI / 2;

    // Grid rings
    [0.2, 0.4, 0.6, 0.8, 1.0].forEach(pct => {
      ctx.strokeStyle = 'rgba(27,58,107,0.35)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const x = cx + r * pct * Math.cos(angle(i));
        const y = cy + r * pct * Math.sin(angle(i));
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    });

    // Spokes
    for (let i = 0; i < n; i++) {
      ctx.strokeStyle = 'rgba(27,58,107,0.4)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + r * Math.cos(angle(i)), cy + r * Math.sin(angle(i)));
      ctx.stroke();
    }

    // Series
    series.forEach(({ values, color, label }) => {
      ctx.fillStyle = color + '22';
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      values.forEach((v, i) => {
        const x = cx + r * v * Math.cos(angle(i));
        const y = cy + r * v * Math.sin(angle(i));
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });

    // Labels
    labels.forEach((lbl, i) => {
      const lx = cx + (r + 18) * Math.cos(angle(i));
      const ly = cy + (r + 18) * Math.sin(angle(i));
      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px Courier New';
      ctx.textAlign = lx > cx + 5 ? 'left' : lx < cx - 5 ? 'right' : 'center';
      ctx.textBaseline = ly > cy + 5 ? 'top' : ly < cy - 5 ? 'bottom' : 'middle';
      ctx.fillText(lbl, lx, ly);
    });

    // Legend
    series.forEach(({ color, label }, i) => {
      const lx = 10;
      const ly = size - 22 + i * 14;
      ctx.fillStyle = color;
      ctx.fillRect(lx, ly, 10, 3);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px Courier New';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, lx + 14, ly + 1.5);
    });
  }

  // ── Donut Chart ─────────────────────────────────────────────────────────────
  function drawDonut(canvasId, slices, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const size = canvas.offsetWidth || 200;
    canvas.width  = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width  = size + 'px';
    canvas.style.height = size + 'px';
    const ctx = clearCanvas(canvas);
    ctx.scale(dpr, dpr);

    const cx = size / 2, cy = size / 2, r = size * 0.38, inner = r * 0.6;
    const { centerLabel = '', centerSub = '' } = options;
    const total = slices.reduce((s, d) => s + d.value, 0);
    let start = -Math.PI / 2;

    slices.forEach(d => {
      const sweep = (d.value / total) * Math.PI * 2;
      ctx.fillStyle = d.color;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, start, start + sweep);
      ctx.closePath();
      ctx.fill();
      start += sweep;
    });

    // Inner circle
    ctx.fillStyle = '#0a0f1e';
    ctx.beginPath();
    ctx.arc(cx, cy, inner, 0, Math.PI * 2);
    ctx.fill();

    // Centre text
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 18px Courier New';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(centerLabel, cx, cy - 6);
    ctx.fillStyle = '#64748b';
    ctx.font = '10px Courier New';
    ctx.fillText(centerSub, cx, cy + 12);
  }

  return { drawBar, drawHBar, drawArea, drawRadar, drawDonut };
})();
