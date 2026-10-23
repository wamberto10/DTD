import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { writePsdBuffer } from 'ag-psd';
import { alphaBounds, detectPivot, loadEnemyPsd } from '../scripts/lib/inimigos-psd.mjs';

function layer(name, left, top, width, height) {
  const data = new Uint8ClampedArray(width * height * 4).fill(255);
  return { name, left, top, imageData: { width, height, data } };
}
const layers = () => [
  layer('braco-tras', 450, 500, 60, 280),
  layer('perna-tras', 455, 655, 70, 305),
  layer('perna-frente', 495, 655, 70, 305),
  layer('tronco', 420, 468, 196, 252),
  layer('cabeca', 350, 120, 360, 420),
  layer('arma', 550, 640, 40, 300),
  layer('braco-frente', 540, 500, 64, 280),
];

async function withPsd(parts, run, size = 1024) {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'dtd-psd-'));
  const file = path.join(dir, 'f01_comum_teste.psd');
  try {
    await writeFile(file, writePsdBuffer({ width: size, height: size, children: [...parts].reverse() }));
    await run(file);
  } finally { await rm(dir, { recursive: true, force: true }); }
}

test('PSD roundtrip preserves layer order, original coordinates and weapon hierarchy', async () => {
  await withPsd(layers(), async file => {
    const rig = await loadEnemyPsd(file);
    assert.equal(rig.body, 'humanoide');
    assert.equal(rig.feet - rig.top, 840);
    assert.deepEqual(rig.parts.map(p => p.name), layers().map(p => p.name));
    const arm = rig.parts.at(-1);
    assert.equal(arm.x, 540);
    assert.equal(arm.y, 500);
    assert.ok(arm.pivotX > 540 && arm.pivotX < 604);
    assert.ok(arm.pivotY > 500 && arm.pivotY < 540);
    assert.equal(rig.parts.find(p => p.name === 'arma').parent, 'braco-frente');
  });
});

test('PSD importer refuses missing, duplicate and incorrectly ordered pieces', async () => {
  await withPsd(layers().slice(1), file => assert.rejects(loadEnemyPsd(file), /Faltam peças/));
  await withPsd([...layers(), layers()[0]], file => assert.rejects(loadEnemyPsd(file), /repetidas/));
  const swapped = layers();
  [swapped[1], swapped[2]] = [swapped[2], swapped[1]];
  await withPsd(swapped, file => assert.rejects(loadEnemyPsd(file), /Ordem/));
});

test('PSD importer refuses incorrect canvas and floating feet', async () => {
  await withPsd(layers(), file => assert.rejects(loadEnemyPsd(file), /1024/), 1000);
  const floating = layers(); floating[1].top -= 50;
  await withPsd(floating, file => assert.rejects(loadEnemyPsd(file), /pés/));
});

test('pivot inference uses the occupied top cap and bottom neck, not empty margins', () => {
  const bitmap = layer('test', 0, 0, 100, 200).imageData;
  bitmap.data.fill(0);
  for (let y = 20; y < 180; y++) for (let x = 30; x < 70; x++) bitmap.data[(y * 100 + x) * 4 + 3] = 255;
  assert.deepEqual(alphaBounds(bitmap), { left: 30, top: 20, width: 40, height: 160 });
  const arm = detectPivot('braco-frente', bitmap, 400, 500);
  const head = detectPivot('cabeca', bitmap, 400, 100);
  assert.equal(arm.pivotX, 450);
  assert.ok(arm.pivotY >= 520 && arm.pivotY < 545);
  assert.ok(head.pivotY > 260 && head.pivotY < 280);
});
