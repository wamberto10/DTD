// PSD -> cropped WebP pieces + runtime manifest. Invalid files stop the build with a readable error.
import { readdir, mkdir, writeFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';
import { loadEnemyPsd } from './lib/inimigos-psd.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const out = path.join(root, 'public/arte/inimigos-pecas');
const kinds = { comum: 'normal', rapido: 'fast', forte: 'brute', chefe: 'boss' };

export async function loadEnemyRigs() {
  const rigs = [];
  const files = [];
  for (const dir of ['inimigos-pecas', 'chefes-pecas']) {
    const folder = path.join(root, 'arte/ia', dir);
    for (const name of (await readdir(folder).catch(() => [])).filter(n => n.endsWith('.psd')).sort()) files.push({ folder, name });
  }
  // Validate all sources first; an invalid PSD never removes the last usable generated art.
  for (const { folder, name } of files) {
    const match = name.match(/^(f\d{2})_(comum|rapido|forte|chefe)_/);
    if (!match) throw new Error(`Nome de PSD fora do padrão: ${name}`);
    const stage = match[1], kind = kinds[match[2]], key = `${stage}-${kind}`;
    if (rigs.some(r => r.stage === stage && r.kind === kind)) throw new Error(`Dois PSDs para ${key}.`);
    let rig;
    try { rig = await loadEnemyPsd(path.join(folder, name)); }
    catch (e) { throw new Error(`${name}: ${e.message}`); }
    rigs.push({ stage, kind, ...rig });
  }
  return rigs;
}

export async function prepareEnemyPieces(validatedRigs) {
  const rigs = validatedRigs ?? await loadEnemyRigs();
  // The generated directory is inside the repository; never touch the PSD source folders.
  await rm(out, { recursive: true, force: true });
  await mkdir(out, { recursive: true });
  const manifest = { rigs: [] };
  for (const rig of rigs) {
    const { parts, ...meta } = rig;
    const folder = `${rig.stage}-${rig.kind}`;
    await mkdir(path.join(out, folder), { recursive: true });
    const outputParts = [];
    for (const p of parts) {
      const file = `arte/inimigos-pecas/${folder}/${p.name}.webp`;
      const { left, top, width: w, height: h } = p.bounds;
      await sharp(Buffer.from(p.bitmap.data), { raw: { width: p.bitmap.width, height: p.bitmap.height, channels: 4 } })
        .extract({ left, top, width: w, height: h }).webp({ lossless: true, effort: 6 }).toFile(path.join(root, 'public', file));
      outputParts.push({ name: p.name, x: p.x + left, y: p.y + top, w, h, pivotX: p.pivotX, pivotY: p.pivotY, parent: p.parent, file });
    }
    manifest.rigs.push({ ...meta, parts: outputParts });
  }
  await writeFile(path.join(root, 'src/enemy-rigs-manifest.js'), `// Gerado por npm run arte:pecas. Não edite à mão.\nexport const ENEMY_RIGS = ${JSON.stringify(manifest, null, 2)};\n`);
  await writeFile(path.join(out, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`Peças prontas: ${rigs.length} inimigo(s) animado(s).`);
  return manifest;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await prepareEnemyPieces();
