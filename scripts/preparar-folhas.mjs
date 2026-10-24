// Enemy walk sheets: arte/ia/inimigos-folhas/fNN_<tipo>_<nome>.png, 16 frames (4 directions × 4 steps), made from the
// prompts in docs/PROMPTS_FOLHAS_INIMIGOS.md. For each sheet this script:
//   - finds the 16 frames by the transparent gaps between them and crops each one;
//   - puts them in even cells with the feet on the same line, in the order down, left, right, up;
//   - fixes front and back walks that repeat the same leg (frame 3 gets the legs of frame 1 mirrored);
//   - writes public/arte/inimigos-folhas/<fase>-<tipo>.webp (web), src/enemy-sheets-manifest.js and, when asked,
//     PNG copies for the Unity package.
// Run: npm run arte:folhas (also part of npm run arte and npm run unity).
import { mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'arte', 'ia', 'inimigos-folhas');
const KIND = { comum: 'normal', rapido: 'fast', forte: 'brute', chefe: 'boss' };
const DIRECTIONS = ['down', 'left', 'right', 'up'];
// The prompts ask for down, left, right, up. Sheets that came in another order are listed here (row of each direction).
const SWAPPED_SIDES = { down: 0, right: 1, left: 2, up: 3 };
const ROW_ORDER = {
  f01_comum_servo_arrogante: SWAPPED_SIDES,
  f02_rapido_morcego_sanguinario: SWAPPED_SIDES,
  f08_rapido_morcego_demoniaco: SWAPPED_SIDES,
};
// On-map height of each kind (battle units, as ART_HEIGHT in src/pixel-units.js). The frames are kept at 2.4 px per
// unit: sharp on a 2560 px wide screen, and light files.
const HEIGHT = { normal: 50, fast: 46, brute: 62, boss: 92 };
const PIXELS_PER_UNIT = 2.4;

async function raw(input) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height };
}
const opaque = (img, x, y) => img.data[(y * img.width + x) * 4 + 3] > 96;

// Stretches of rows (or columns) with something drawn, split by fully transparent gaps.
function bands(length, has, minimum) {
  const found = [];
  let start = -1;
  for (let i = 0; i <= length; i++) {
    const on = i < length && has(i);
    if (on && start < 0) start = i;
    if (!on && start >= 0) { if (i - start >= minimum) found.push([start, i]); start = -1; }
  }
  return found;
}

// The drawing inside one cell of an even grid: the widest run of columns with something drawn, then the tallest run of
// rows inside it. Bits of a neighbour that cross the grid line (a wing tip, a tail) are left out when a gap separates them.
function boxInCell(img, x0, y0, x1, y1) {
  const columns = bands(x1 - x0, i => { for (let y = y0; y < y1; y++) if (opaque(img, x0 + i, y)) return true; return false; }, 1);
  if (!columns.length) return null;
  const [cx0, cx1] = columns.reduce((best, band) => band[1] - band[0] > best[1] - best[0] ? band : best);
  const rows = bands(y1 - y0, i => { for (let x = x0 + cx0; x < x0 + cx1; x++) if (opaque(img, x, y0 + i)) return true; return false; }, 1);
  const [ry0, ry1] = rows.reduce((best, band) => band[1] - band[0] > best[1] - best[0] ? band : best);
  return { left: x0 + cx0, top: y0 + ry0, width: cx1 - cx0, height: ry1 - ry0 };
}

/** The 16 frame boxes of a sheet, row by row, as drawn. */
async function findFrames(file) {
  const img = await raw(file);
  const minimum = Math.round(Math.min(img.width, img.height) / 16);
  const rows = bands(img.height, y => { for (let x = 0; x < img.width; x++) if (opaque(img, x, y)) return true; return false; }, minimum);
  const frames = rows.map(([y0, y1]) => bands(img.width, x => { for (let y = y0; y < y1; y++) if (opaque(img, x, y)) return true; return false; }, minimum)
    .map(([x0, x1]) => {
      let top = y1, bottom = y0;
      for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) if (opaque(img, x, y)) { top = Math.min(top, y); bottom = Math.max(bottom, y); }
      return { left: x0, top, width: x1 - x0, height: bottom - top + 1 };
    }));
  if (frames.length === 4 && frames.every(row => row.length === 4)) return frames;
  // Frames that touch each other (wings, tails) leave no gap: the sheet is cut by its even 4 × 4 grid instead.
  const grid = [0, 1, 2, 3].map(r => [0, 1, 2, 3].map(c => boxInCell(img,
    Math.round(c * img.width / 4), Math.round(r * img.height / 4), Math.round((c + 1) * img.width / 4), Math.round((r + 1) * img.height / 4))));
  if (grid.flat().some(box => !box)) {
    throw new Error(`${path.basename(file)}: não achei 4 linhas de 4 quadros (nem pelos espaços vazios nem pela grade).`);
  }
  return grid;
}

// How different the legs (bottom fifth) of two frames are, from 0 to 1.
async function legDifference(file, a, b) {
  const width = Math.min(a.width, b.width), height = Math.min(a.height, b.height);
  const crop = box => sharp(file).extract({ left: box.left + Math.floor((box.width - width) / 2), top: box.top + box.height - height, width, height }).ensureAlpha().raw().toBuffer();
  const [A, B] = await Promise.all([crop(a), crop(b)]);
  let difference = 0, count = 0;
  for (let y = Math.floor(height * .8); y < height; y++) for (let x = 0; x < width; x++) { const i = (y * width + x) * 4 + 3; difference += Math.abs(A[i] - B[i]); count++; }
  return difference / count / 255;
}

/** A frame cropped to its box, as PNG. With mirrorLegs, its bottom fifth (the legs) is flipped left to right. */
async function framePixels(file, box, mirrorLegs = false) {
  if (!mirrorLegs) return sharp(file).extract(box).png().toBuffer();
  const legsHeight = Math.round(box.height * .2);
  const bodyHeight = box.height - legsHeight;
  const body = await sharp(file).extract({ left: box.left, top: box.top, width: box.width, height: bodyHeight }).png().toBuffer();
  const legs = await sharp(file).extract({ left: box.left, top: box.top + bodyHeight, width: box.width, height: legsHeight }).flop().png().toBuffer();
  return sharp({ create: { width: box.width, height: box.height, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: body, left: 0, top: 0 }, { input: legs, left: 0, top: bodyHeight }]).png().toBuffer();
}

/** Prepares one sheet: an atlas of 4 × 4 even cells (rows down, left, right, up) and its measures. */
async function prepareSheet(file, name) {
  const [, stageNumber, tipo] = name.match(/^f(\d{2})_(comum|rapido|forte|chefe)_/);
  const stage = `f${stageNumber}`, kind = KIND[tipo];
  const drawn = await findFrames(file);
  const order = ROW_ORDER[name] || { down: 0, left: 1, right: 2, up: 3 };
  const rows = DIRECTIONS.map(direction => drawn[order[direction]]);
  // Front and back walks whose frames 1 and 3 have the same leg forward get the other leg by mirroring.
  const fixed = [];
  const mirror = DIRECTIONS.map(() => [false, false, false, false]);
  for (const [r, direction] of DIRECTIONS.entries()) {
    if ((direction === 'down' || direction === 'up') && await legDifference(file, rows[r][0], rows[r][2]) < .025) { mirror[r][2] = true; fixed.push(direction); }
  }
  const tallest = Math.max(...rows.flat().map(box => box.height));
  const widest = Math.max(...rows.flat().map(box => box.width));
  const scale = HEIGHT[kind] * PIXELS_PER_UNIT / tallest;
  const margin = Math.ceil(4 / scale);
  const cellWidth = Math.round((widest + margin * 2) * scale), cellHeight = Math.round((tallest + margin * 2) * scale);
  const feet = Math.round((tallest + margin) * scale);
  const layers = [];
  for (const [r] of DIRECTIONS.entries()) {
    for (let c = 0; c < 4; c++) {
      const box = rows[r][c];
      const width = Math.max(1, Math.round(box.width * scale)), height = Math.max(1, Math.round(box.height * scale));
      const input = await sharp(await framePixels(file, box, mirror[r][c])).resize(width, height, { kernel: 'lanczos3' }).png().toBuffer();
      // Centred in the cell, the bottom of the drawing on the feet line.
      layers.push({ input, left: c * cellWidth + Math.round((cellWidth - width) / 2), top: r * cellHeight + feet - height });
    }
  }
  const atlas = await sharp({ create: { width: cellWidth * 4, height: cellHeight * 4, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite(layers).png().toBuffer();
  return { stage, kind, name, atlas, cellWidth, cellHeight, feet, characterHeight: Math.round(tallest * scale), fixedLegs: fixed };
}

/** Prepares every sheet. Options: unityOut = folder of the Unity package (PNG atlases there too). */
export async function prepareEnemySheets({ unityOut = null, quiet = false } = {}) {
  const files = (await readdir(source).catch(() => [])).filter(file => /^f\d{2}_(comum|rapido|forte|chefe)_.+\.png$/i.test(file)).sort();
  const webOut = path.join(root, 'public', 'arte', 'inimigos-folhas');
  await rm(webOut, { recursive: true, force: true });
  await mkdir(webOut, { recursive: true });
  if (unityOut) await mkdir(path.join(unityOut, 'arte', 'inimigos-folhas'), { recursive: true });
  const sheets = [];
  for (const file of files) {
    const sheet = await prepareSheet(path.join(source, file), file.replace(/\.png$/i, ''));
    const key = `${sheet.stage}-${sheet.kind}`;
    await sharp(sheet.atlas).webp({ quality: 92, alphaQuality: 100 }).toFile(path.join(webOut, `${key}.webp`));
    if (unityOut) await sharp(sheet.atlas).png({ compressionLevel: 9 }).toFile(path.join(unityOut, 'arte', 'inimigos-folhas', `${key}.png`));
    const { atlas, ...measures } = sheet;
    sheets.push({ key, file: `arte/inimigos-folhas/${key}.webp`, ...measures });
    if (!quiet) console.log(`Folha ${key}: ${sheet.cellWidth}×${sheet.cellHeight} por quadro${sheet.fixedLegs.length ? `, pernas corrigidas: ${sheet.fixedLegs.join(' e ')}` : ''}.`);
  }
  const manifest = Object.fromEntries(sheets.map(({ key, file, cellWidth, cellHeight, feet, characterHeight }) => [key, { file, cellWidth, cellHeight, feet, characterHeight }]));
  await writeFile(path.join(root, 'src', 'enemy-sheets-manifest.js'),
    `// Gerado por scripts/preparar-folhas.mjs (npm run arte:folhas). Não edite à mão.\n// Each sheet: 4 columns (walk steps) × 4 rows (down, left, right, up); feet = y of the feet line inside a cell.\nexport const ENEMY_SHEETS = ${JSON.stringify(manifest, null, 2)};\n`);
  return sheets;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const sheets = await prepareEnemySheets();
  console.log(`Folhas prontas: ${sheets.length}.`);
}
