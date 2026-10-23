// Preview the real runtime and exported art, rather than a separate approximation of the gait.
import { readFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';
import { ENEMY_RIGS } from '../src/enemy-rigs-manifest.js';
import { renderRigEnemy } from '../src/enemy-rig.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const out = path.join(root, 'docs/moldes');
const specs = [
  { kind: 'fast', title: 'Macaco Ladrão', slug: 'macaco-ladrao', delay: 50, cycles: 2 },
  { kind: 'brute', title: 'Valentão dos Alojamentos', slug: 'valentao-alojamentos', delay: 95, cycles: 1 },
  { kind: 'boss', title: 'Discípulo Interno de Elite', slug: 'discipulo-interno-elite', delay: 110, cycles: 1 },
];
globalThis.DTD_ART = {};
for (const rig of ENEMY_RIGS.rigs) for (const part of rig.parts) {
  // librsvg does not decode embedded WebP; PNG is just a preview transport for the same pixels.
  const png = await sharp(await readFile(path.join(root, 'public', part.file))).png().toBuffer();
  globalThis.DTD_ART[part.file] = `data:image/png;base64,${png.toString('base64')}`;
}
const scene = (spec, frame, cycles = 1) => {
  const rig = ENEMY_RIGS.rigs.find(r => r.stage === 'f01' && r.kind === spec.kind);
  if (!rig) throw new Error(`Falta o recorte ${spec.kind}.`);
  const enemy = { id: 'preview', kind: spec.kind, x: 205, y: 378, facing: 1, hp: 100, maxHp: 100,
    progress: rig.stride * frame / 16 * cycles };
  return `<rect width="410" height="430" fill="#25372d"/><rect y="390" width="410" height="40" fill="#364b39"/>
    <text x="205" y="32" text-anchor="middle" fill="#f2ecd2" font-family="Segoe UI,Arial" font-weight="700" font-size="19">${spec.title}</text>
    ${renderRigEnemy(enemy, rig, 300, false)}`;
};
await mkdir(out, { recursive: true });
for (const spec of specs) {
  const frames = [];
  for (let i = 0; i < 16; i++) frames.push(await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="410" height="430">${scene(spec, i)}</svg>`)).png().toBuffer());
  await sharp(frames, { join: { animated: true } }).gif({ delay: Array(16).fill(spec.delay), loop: 0 })
    .toFile(path.join(out, `andar-${spec.slug}.gif`));
}
const combined = [];
for (let i = 0; i < 16; i++) {
  const panels = specs.map((spec, index) => `<g transform="translate(${index * 410} 0)">${scene(spec, i, spec.cycles)}</g>`).join('');
  combined.push(await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1230" height="430">${panels}</svg>`)).png().toBuffer());
}
await sharp(combined, { join: { animated: true } }).gif({ delay: Array(16).fill(85), loop: 0 })
  .toFile(path.join(out, 'andar-restantes-fase1.gif'));
console.log('Prévias dos três novos recortes salvas em docs/moldes/.');
