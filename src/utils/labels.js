// Places district-name labels next to a dot at each district's label point and nudges
// them so they don't sit on top of each other. Works in map (SVG viewBox) units and is
// shared by the on-screen map and the PNG / JPG / PDF export.
//
// items:    [{ key, text, cx, cy }]
// fontSize: label font size in map units
// measure:  (text) => width in map units
// bounds:   { width, height } of the map viewBox
// returns:  [{ key, text, dotX, dotY, x, y, anchor }]   (y is the text baseline)
export function layoutLabels(items, { fontSize, measure, bounds }) {
  const h = fontSize * 1.15; // box height
  const gap = 4; // distance between dot and label
  const placed = [];
  const out = [];

  const overlaps = (a) =>
    placed.some((b) => a.x1 < b.x2 && a.x2 > b.x1 && a.y1 < b.y2 && a.y2 > b.y1);

  // top-to-bottom, left-to-right gives stable results
  const sorted = [...items].sort((a, b) => a.cy - b.cy || a.cx - b.cx);

  sorted.forEach((it) => {
    const w = measure(it.text);
    const candidates = [
      { anchor: 'middle', dx: 0, dy: -gap },
      { anchor: 'middle', dx: 0, dy: gap + fontSize * 0.85 },
      { anchor: 'start', dx: gap + 2, dy: fontSize * 0.3 },
      { anchor: 'end', dx: -(gap + 2), dy: fontSize * 0.3 },
      { anchor: 'middle', dx: 0, dy: -gap - h },
      { anchor: 'middle', dx: 0, dy: gap + fontSize * 0.85 + h },
      { anchor: 'start', dx: gap + 2, dy: fontSize * 0.3 - h },
      { anchor: 'end', dx: -(gap + 2), dy: fontSize * 0.3 + h },
    ];

    let chosen = null;
    for (const c of candidates) {
      let x = it.cx + c.dx;
      const y = it.cy + c.dy;
      let x1 = c.anchor === 'middle' ? x - w / 2 : c.anchor === 'start' ? x : x - w;
      // keep inside the map area
      const shift = Math.max(0, 2 - x1) - Math.max(0, x1 + w - (bounds.width - 2));
      x += shift;
      x1 += shift;
      const box = { x1, x2: x1 + w, y1: y - fontSize * 0.85, y2: y + fontSize * 0.3 };
      chosen = { c, x, y, box };
      if (!overlaps(box)) break;
    }
    placed.push(chosen.box);
    out.push({ key: it.key, text: it.text, dotX: it.cx, dotY: it.cy, x: chosen.x, y: chosen.y, anchor: chosen.c.anchor });
  });
  return out;
}
