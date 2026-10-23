// Turns the raw AI art in arte/ia/ into light WebP files the game loads from public/arte/,
// and writes src/art-manifest.js with the size of each picture.
// Run after adding or replacing art: npm run arte
import { readdir, mkdir, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { loadEnemyRigs, prepareEnemyPieces } from './preparar-inimigos-pecas.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const raw = path.join(root, 'arte', 'ia');
const out = path.join(root, 'public', 'arte');
const KINDS = { comum: 'normal', rapido: 'fast', forte: 'brute', chefe: 'boss' };
const transparent = { r: 0, g: 0, b: 0, alpha: 0 };

const pngs = async dir => (await readdir(path.join(raw, dir), { withFileTypes: true }).catch(() => []))
  .filter(entry => entry.isFile() && entry.name.toLowerCase().endsWith('.png')).map(entry => entry.name).sort();

// Cuts the empty border, then fits the figure in a box without enlarging it.
async function sprite(file, box, target) {
  const trimmed = await sharp(file).ensureAlpha().trim({ threshold: 10 }).toBuffer();
  const { data, info } = await sharp(trimmed)
    .resize(box.width, box.height, { fit: 'inside', withoutEnlargement: true, kernel: 'lanczos3' })
    .webp({ quality: 86, alphaQuality: 92, effort: 6 }).toBuffer({ resolveWithObject: true });
  await writeFile(target, data);
  return { w: info.width, h: info.height, kb: Math.round(data.length / 1024) };
}

// An invalid new PSD must leave the last complete generated art untouched.
const enemyRigs = await loadEnemyRigs();
await rm(out, { recursive: true, force: true });
for (const dir of ['herois', 'inimigos', 'fases']) await mkdir(path.join(out, dir), { recursive: true });
const manifest = { herois: {}, inimigos: {}, fases: {} };
let total = 0;

for (const name of await pngs('herois')) {
  const id = name.replace(/\.png$/i, '');
  const info = await sprite(path.join(raw, 'herois', name), { width: 360, height: 360 }, path.join(out, 'herois', `${id}.webp`));
  manifest.herois[id] = { w: info.w, h: info.h };
  total += info.kb;
}

for (const dir of ['inimigos', 'chefes']) {
  for (const name of await pngs(dir)) {
    const match = name.match(/^(f\d{2})_(comum|rapido|forte|chefe)_/);
    if (!match) { console.warn(`Ignorado (nome fora do padrão): ${dir}/${name}`); continue; }
    const [, stage, kind] = match;
    const box = kind === 'chefe' ? { width: 400, height: 320 } : { width: 300, height: 220 };
    const info = await sprite(path.join(raw, dir, name), box, path.join(out, 'inimigos', `${stage}-${kind}.webp`));
    (manifest.inimigos[stage] ||= {})[KINDS[kind]] = { w: info.w, h: info.h };
    total += info.kb;
  }
}

for (const name of await pngs('fases')) {
  const match = name.match(/^(f\d{2})_/);
  if (!match) continue;
  const data = await sharp(path.join(raw, 'fases', name))
    .resize(1250, 750, { fit: 'fill', kernel: 'lanczos3' }).webp({ quality: 78, effort: 6 }).toBuffer();
  await writeFile(path.join(out, 'fases', `${match[1]}.webp`), data);
  manifest.fases[match[1]] = true;
  total += Math.round(data.length / 1024);
}

const block = object => Object.entries(object).map(([key, value]) => `    ${JSON.stringify(key)}: ${JSON.stringify(value)},`).join('\n');
const source = `// Gerado por scripts/preparar-arte.mjs (npm run arte). Não edite à mão.
export const ART = {
  herois: {\n${block(manifest.herois)}\n  },
  inimigos: {\n${block(manifest.inimigos)}\n  },
  fases: {\n${block(manifest.fases)}\n  },
};\n`;
await writeFile(path.join(root, 'src', 'art-manifest.js'), source);
console.log(`Arte pronta: ${Object.keys(manifest.herois).length} heróis, ${Object.values(manifest.inimigos).reduce((n, s) => n + Object.keys(s).length, 0)} inimigos e chefes, ${Object.keys(manifest.fases).length} cenários (${(total / 1024).toFixed(1)} MB).`);
await prepareEnemyPieces(enemyRigs);
