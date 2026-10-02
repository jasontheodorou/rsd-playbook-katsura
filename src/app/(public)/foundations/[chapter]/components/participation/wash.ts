// A copy of src/participation/wash.ts in ~/svg/landscape.
// The soft wash behind the model: a loose, hand-cut blob of pale yellow, kept inside the box.
import type { Box } from './scene';

/** A closed, gently uneven loop, fitted so its widest points touch x0 and x1 and its highest and lowest y0 and y1. */
function blob(x0: number, y0: number, x1: number, y1: number): string {
  const raw: [number, number][] = [];
  for (let i = 0; i < 180; i++) {
    const t = (i / 180) * 2 * Math.PI;
    const r = 1 + 0.035 * Math.sin(2 * t + 0.6) + 0.025 * Math.sin(3 * t + 2.1) + 0.015 * Math.sin(5 * t + 4);
    raw.push([r * Math.cos(t), r * Math.sin(t)]);
  }
  const xs = raw.map((p) => p[0]), ys = raw.map((p) => p[1]);
  const ax = Math.min(...xs), bx = Math.max(...xs), ay = Math.min(...ys), by = Math.max(...ys);
  return 'M' + raw.map(([x, y]) => `${(x0 + ((x - ax) / (bx - ax)) * (x1 - x0)).toFixed(1)},${(y0 + ((y - ay) / (by - ay)) * (y1 - y0)).toFixed(1)}`).join('L') + 'Z';
}

/**
 * Draw the wash. Left-aligned to the page grid: its left edge sits on the box's left edge (page
 * column 2, the line the body text starts on) and its right edge on the box's right edge. Up and
 * down it is centred on the model (`all`, at the current tilt, so it follows a tilt) and reaches
 * 1.7 times the model's half-height, inside the box.
 */
export function drawWash(svg: SVGSVGElement, size: { w: number; h: number }, all: Box): void {
  svg.setAttribute('viewBox', `0 0 ${size.w} ${size.h}`);
  const cy = (all.y0 + all.y1) / 2, ry = Math.min(((all.y1 - all.y0) / 2) * 1.7, cy, size.h - cy);
  svg.innerHTML = `<path d="${blob(0, cy - ry, size.w, cy + ry)}" fill="rgb(241 212 110 / 0.3)"/>`;
}
