// Renders the "My Bangladesh" card to a canvas and exports it as PNG / JPG / PDF.
// No external libraries: the PDF is a tiny hand-built single-page file wrapping the JPEG.

import { layoutLabels } from './labels';

const W = 1200;
const H = 1600;
const SCALE = 2; // output is 2400 x 3200 px for crisp printing/sharing

const FONT = '"Noto Sans Bengali", system-ui, sans-serif';
const DEFAULT_COLORS = { bg: '#F5F1E8', panel: '#FFFFFF', ink: '#1D1F1C', soft: '#837E6F', sand: '#E4DCCB', accent: '#17855F' };

function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// The district shapes only use M / L / Z commands, so a tiny parser is enough.
function tracePath(ctx, d) {
  const tokens = d.match(/[MLZ]|-?\d*\.?\d+/g) || [];
  ctx.beginPath();
  for (let i = 0; i < tokens.length; ) {
    const cmd = tokens[i++];
    if (cmd === 'Z') ctx.closePath();
    else {
      const x = parseFloat(tokens[i++]);
      const y = parseFloat(tokens[i++]);
      if (cmd === 'M') ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
  }
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function ensureFonts(text) {
  try {
    if (document.fonts && document.fonts.load) {
      await Promise.all(['400', '500', '700'].map((w) => document.fonts.load(`${w} 40px "Noto Sans Bengali"`, text)));
      await document.fonts.ready;
    }
  } catch {
    /* fall back to system fonts */
  }
}

function setFont(ctx, weight, size) {
  ctx.font = `${weight} ${size}px ${FONT}`;
}

function fitFontSize(ctx, text, weight, maxSize, minSize, maxWidth) {
  let size = maxSize;
  setFont(ctx, weight, size);
  while (size > minSize && ctx.measureText(text).width > maxWidth) {
    size -= 2;
    setFont(ctx, weight, size);
  }
  return size;
}

function ellipsize(ctx, text, maxWidth) {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let t = text;
  while (t.length > 1 && ctx.measureText(t + '…').width > maxWidth) t = t.slice(0, -1);
  return t + '…';
}

/**
 * labels: { eyebrow, title, count, total, pct, stats }  (already translated/formatted strings)
 * percent: number 0-100, visited: { [name_en]: true }, photo: data URL or ''
 * colors: optional card colours { bg, panel, ink, soft, sand, accent }
 * names: optional [{ key, text, cx, cy }] district names to print on the map (visited districts)
 */
export async function renderCardCanvas({ labels, percent, visited, photo, data, colors, names }) {
  const { bg: BG, panel: PANEL, ink: INK, soft: SOFT, sand: SAND, accent: GREEN } = { ...DEFAULT_COLORS, ...colors };
  await ensureFonts(Object.values(labels).join(' '));

  const canvas = document.createElement('canvas');
  canvas.width = W * SCALE;
  canvas.height = H * SCALE;
  const ctx = canvas.getContext('2d');
  ctx.scale(SCALE, SCALE);
  ctx.textBaseline = 'alphabetic';

  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, W, H);

  const PAD = 70;
  const AV = 170;

  // ---- avatar ----
  roundRectPath(ctx, PAD, PAD, AV, AV, 40);
  ctx.fillStyle = PANEL;
  ctx.fill();
  ctx.save();
  roundRectPath(ctx, PAD, PAD, AV, AV, 40);
  ctx.clip();
  let drewPhoto = false;
  if (photo) {
    try {
      const img = await loadImage(photo);
      ctx.drawImage(img, PAD, PAD, AV, AV);
      drewPhoto = true;
    } catch {
      /* use placeholder */
    }
  }
  if (!drewPhoto) {
    ctx.fillStyle = GREEN;
    ctx.globalAlpha = 0.85;
    ctx.beginPath();
    ctx.arc(PAD + AV / 2, PAD + AV * 0.38, AV * 0.17, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(PAD + AV / 2, PAD + AV * 0.92, AV * 0.32, AV * 0.3, 0, Math.PI, 0);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  ctx.restore();
  roundRectPath(ctx, PAD + 4, PAD + 4, AV - 8, AV - 8, 36);
  ctx.strokeStyle = GREEN;
  ctx.lineWidth = 8;
  ctx.stroke();

  // ---- count (top right) ----
  const baseline = PAD + 140;
  setFont(ctx, 500, 56);
  const totalText = `/${labels.total}`;
  const totalW = ctx.measureText(totalText).width;
  ctx.fillStyle = SOFT;
  ctx.textAlign = 'left';
  ctx.fillText(totalText, W - PAD - totalW, baseline);
  setFont(ctx, 700, 130);
  const numW = ctx.measureText(labels.count).width;
  ctx.fillStyle = GREEN;
  ctx.fillText(labels.count, W - PAD - totalW - numW - 6, baseline);

  // ---- eyebrow + title ----
  const textX = PAD + AV + 40;
  const textMaxW = W - PAD - totalW - numW - 6 - 30 - textX;
  setFont(ctx, 500, 30);
  ctx.fillStyle = SOFT;
  ctx.fillText(ellipsize(ctx, labels.eyebrow, textMaxW), textX, PAD + 66);
  const titleSize = fitFontSize(ctx, labels.title, 700, 64, 30, textMaxW);
  setFont(ctx, 700, titleSize);
  ctx.fillStyle = INK;
  ctx.fillText(ellipsize(ctx, labels.title, textMaxW), textX, PAD + 66 + 20 + titleSize * 0.95);

  // ---- map ----
  const mapTop = PAD + AV + 50;
  const mapBottom = 1395;
  const s = Math.min((W - 2 * PAD) / data.width, (mapBottom - mapTop) / data.height);
  const ox = (W - data.width * s) / 2;
  const oy = mapTop + (mapBottom - mapTop - data.height * s) / 2;
  ctx.save();
  ctx.translate(ox, oy);
  ctx.scale(s, s);
  ctx.lineWidth = 1;
  ctx.strokeStyle = BG;
  ctx.lineJoin = 'round';
  data.districts.forEach((d) => {
    tracePath(ctx, d.d);
    ctx.fillStyle = visited[d.name_en] ? GREEN : SAND;
    ctx.fill();
    ctx.stroke();
  });

  // ---- district names (optional) ----
  if (names && names.length) {
    const fs = 15; // map units (~22px on the card)
    setFont(ctx, 700, fs);
    const placed = layoutLabels(names, {
      fontSize: fs,
      measure: (t) => ctx.measureText(t).width,
      bounds: { width: data.width, height: data.height },
    });
    ctx.lineJoin = 'round';
    placed.forEach((l) => {
      ctx.beginPath();
      ctx.arc(l.dotX, l.dotY, 3.6, 0, Math.PI * 2);
      ctx.fillStyle = '#E0343F';
      ctx.fill();
      ctx.lineWidth = 1.6;
      ctx.strokeStyle = BG;
      ctx.stroke();
      ctx.textAlign = l.anchor === 'middle' ? 'center' : l.anchor;
      ctx.lineWidth = 4.5;
      ctx.strokeStyle = BG;
      ctx.strokeText(l.text, l.x, l.y);
      ctx.fillStyle = INK;
      ctx.fillText(l.text, l.x, l.y);
    });
    ctx.textAlign = 'left';
  }
  ctx.restore();

  // ---- progress bar ----
  const barY = 1445;
  const barH = 28;
  const barW = W - 2 * PAD;
  roundRectPath(ctx, PAD, barY, barW, barH, barH / 2);
  ctx.fillStyle = SAND;
  ctx.fill();
  if (percent > 0) {
    roundRectPath(ctx, PAD, barY, Math.max(barH, (barW * percent) / 100), barH, barH / 2);
    ctx.fillStyle = GREEN;
    ctx.fill();
  }

  // ---- footer text ----
  const rowY = 1526;
  setFont(ctx, 700, 40);
  const leftW = ctx.measureText(labels.pct).width;
  ctx.fillStyle = INK;
  ctx.textAlign = 'left';
  ctx.fillText(labels.pct, PAD, rowY);
  setFont(ctx, 400, 34);
  const rightW = ctx.measureText(labels.stats).width;
  ctx.fillStyle = SOFT;
  if (leftW + rightW + 40 <= barW) {
    ctx.textAlign = 'right';
    ctx.fillText(labels.stats, W - PAD, rowY);
  } else {
    ctx.textAlign = 'left';
    ctx.fillText(labels.stats, PAD, rowY + 56);
  }
  ctx.textAlign = 'left';

  return canvas;
}

export function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), type, quality);
  });
}

/** Wraps a JPEG in a minimal one-page PDF whose page has the same aspect ratio as the image. */
export function buildPdf(jpeg, pxW, pxH) {
  const pw = 595;
  const ph = Math.round((595 * pxH) / pxW);
  const enc = new TextEncoder();
  const chunks = [];
  const offsets = [];
  let offset = 0;
  const push = (x) => {
    const b = typeof x === 'string' ? enc.encode(x) : x;
    chunks.push(b);
    offset += b.length;
  };
  const obj = (n, body) => {
    offsets[n] = offset;
    push(`${n} 0 obj\n${body}\nendobj\n`);
  };

  push('%PDF-1.4\n%\u00E2\u00E3\u00CF\u00D3\n');
  obj(1, '<< /Type /Catalog /Pages 2 0 R >>');
  obj(2, '<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
  obj(3, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pw} ${ph}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>`);

  offsets[4] = offset;
  push(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${pxW} /Height ${pxH} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`);
  push(jpeg);
  push('\nendstream\nendobj\n');

  const content = `q ${pw} 0 0 ${ph} 0 0 cm /Im0 Do Q`;
  obj(5, `<< /Length ${content.length} >>\nstream\n${content}\nendstream`);

  const xrefAt = offset;
  let xref = 'xref\n0 6\n0000000000 65535 f \n';
  for (let i = 1; i <= 5; i++) xref += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  push(xref);
  push(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefAt}\n%%EOF`);

  return new Blob(chunks, { type: 'application/pdf' });
}

/** Default save: a normal browser download. */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
