import test from 'node:test';
import assert from 'node:assert/strict';
import { ENEMY_RIGS } from '../src/enemy-rigs-manifest.js';
import { renderEnemy } from '../src/pixel-units.js';
import {
  isEnemyRig, enemyRig, enemyRigPose, renderRigEnemy, disableEnemyRig,
  emptyEnemyEffects, advanceEnemyEffects, enemyHitEffect, enemyDeathProgress, ENEMY_DEATH_SECONDS,
} from '../src/enemy-rig.js';

const names = ['cabelo-tras', 'braco-tras', 'perna-tras', 'perna-frente', 'tronco', 'saia', 'cabeca', 'arma', 'braco-frente'];
function fixture() {
  return {
    stage: 'f99', kind: 'normal', body: 'humanoide', size: 1024, center: 512, feet: 960, top: 128, stride: 32,
    parts: names.map(name => ({
      name, x: 400, y: 128, w: 200, h: 832, pivotX: 512,
      pivotY: name.startsWith('perna-') ? 692 : 512,
      parent: name === 'arma' ? 'braco-frente' : '', file: `arte/inimigos-pecas/f99-normal/${name}.webp`,
    })),
  };
}
const enemy = { id: 'enemy-1', kind: 'normal', x: 100, y: 200, facing: 1, progress: 0, hp: 20, maxHp: 20 };
const near = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} should equal ${expected}`);

test('only complete, ordered humanoid rigs are selected for the matching stage and enemy kind', () => {
  const rig = fixture();
  assert.equal(isEnemyRig(rig), true);
  assert.equal(enemyRig(99, 'normal', { rigs: [rig] }), rig);
  assert.equal(enemyRig('f99', 'normal', { rigs: [rig] }), rig);
  assert.equal(enemyRig(99, 'fast', { rigs: [rig] }), null);
  assert.equal(enemyRig(98, 'normal', { rigs: [rig] }), null);
  assert.equal(enemyRig(99, 'normal', { rigs: {} }), null);
  for (const change of [
    { body: 'quadrupede' }, { top: 960 }, { stride: 0 }, { size: 512 },
    { parts: rig.parts.filter(part => part.name !== 'perna-tras') },
    { parts: [...rig.parts].reverse() }, { parts: [...rig.parts, rig.parts[0]] },
    { parts: [...rig.parts, null] },
    { parts: rig.parts.map(part => part.name === 'arma' ? { ...part, parent: '' } : part) },
    { parts: rig.parts.map(part => part.name === 'tronco' ? { ...part, w: 2000 } : part) },
    { parts: rig.parts.map(part => part.name === 'cabeca' ? { ...part, pivotY: NaN } : part) },
  ]) {
    const invalid = { ...rig, ...change };
    assert.equal(isEnemyRig(invalid), false);
    assert.equal(enemyRig(99, 'normal', { rigs: [invalid] }), null);
  }
});

test('gait follows distance, repeats at the stride, and opposes the limbs without using a wall clock', () => {
  const rig = fixture();
  const step = { ...enemy, progress: rig.stride / 4 };
  const pose = enemyRigPose(step, rig);
  near(pose.phase, Math.PI / 2);
  near(pose.angles['perna-tras'], 22);
  near(pose.angles['perna-frente'], -22);
  near(pose.angles['braco-tras'], -18);
  near(pose.angles['braco-frente'], 18);
  near(pose.drop, (960 - 692) * (1 - Math.cos(22 * Math.PI / 180)));
  assert.deepEqual(enemyRigPose({ ...step, speed: 20, slowRemaining: 1 }, rig), pose);
  assert.deepEqual(enemyRigPose({ ...step, speed: 100, paused: true }, rig), pose);
  assert.deepEqual(enemyRigPose({ ...step, progress: step.progress + rig.stride }, rig), pose);
  const still = enemyRigPose(enemy, rig);
  near(still.drop, 0);
  near(still.angles['perna-frente'], 0);
  assert.ok(Math.abs(pose.angles.cabeca) <= 2);
  assert.ok(Math.abs(pose.angles['cabelo-tras']) <= 5);
});

test('rendering anchors the source feet and centre, mirrors the entire rig, and keeps weapon under the hand', () => {
  const rig = fixture();
  const markup = renderRigEnemy({ ...enemy, facing: -1, progress: 8 }, rig, 52);
  assert.match(markup, /translate\(100 212\) scale\(-0\.0625 0\.0625\) translate\(-512 -960\)/);
  assert.deepEqual([...markup.matchAll(/data-part="([^"]+)"/g)].map(match => match[1]), names);
  assert.match(markup, /data-parent="braco-frente" transform="rotate\(18 512 512\)"><g data-part="arma" transform="rotate\(0 512 512\)"/);
  assert.match(markup, /data-part="braco-frente" transform="rotate\(18 512 512\)"/);
  assert.match(markup, /href="arte\/inimigos-pecas\/f99-normal\/cabeca.webp" x="400" y="128" width="200" height="832"/);
  assert.doesNotMatch(renderRigEnemy(enemy, rig, 52, false), /fill="#1b2631"/);
});

test('rig piece URLs resolve embedded portable art', () => {
  const rig = fixture();
  const file = rig.parts.find(part => part.name === 'cabeca').file;
  const old = globalThis.DTD_ART;
  try {
    globalThis.DTD_ART = { [file]: 'data:image/webp;base64,cG9ydGFibGU=' };
    assert.match(renderRigEnemy(enemy, rig), /href="data:image\/webp;base64,cG9ydGFibGU="/);
  } finally {
    if (old === undefined) delete globalThis.DTD_ART;
    else globalThis.DTD_ART = old;
  }
});

test('the first imported enemy uses the rig; missing rigs retain painted and pixel fallbacks', () => {
  assert.ok(ENEMY_RIGS.rigs.some(rig => rig.stage === 'f01' && rig.kind === 'normal' && isEnemyRig(rig)));
  assert.match(renderEnemy(enemy, 1), /rigged-enemy/);
  assert.match(renderEnemy(enemy, 2), /painted-enemy/);
  assert.match(renderEnemy(enemy), /pixel-enemy/);
  assert.match(renderEnemy({ ...enemy, kind: 'fast' }, 1), /painted-enemy/);
});

test('damage blinking is temporary and does not mutate simulation enemies or the previous effect snapshot', () => {
  const fresh = Object.freeze({ ...enemy });
  const initial = emptyEnemyEffects();
  const before = advanceEnemyEffects(initial, [fresh], .1);
  const damaged = Object.freeze({ ...fresh, hp: 15 });
  const hit = advanceEnemyEffects(before, [damaged], .1);
  assert.equal(enemyHitEffect(hit, damaged), true);
  assert.equal(before.health[enemy.id], 20);
  assert.deepEqual(initial, emptyEnemyEffects());
  assert.equal(enemyHitEffect(advanceEnemyEffects(hit, [damaged], .05), damaged), false);
  const paused = advanceEnemyEffects(hit, [damaged], 0);
  assert.deepEqual(paused, hit);
  const done = advanceEnemyEffects(hit, [damaged], .2);
  assert.equal(enemyHitEffect(done, damaged), false);
  assert.deepEqual(done.hits, {});
  assert.equal(damaged.hp, 15);
});

test('death snapshots fall, hide health and expire on the pausable game clock', () => {
  const killed = { ...enemy, hp: -10 };
  const start = advanceEnemyEffects(emptyEnemyEffects(), [], .1, [killed]);
  killed.x = 999;
  assert.equal(start.deaths[0].enemy.x, 100);
  near(enemyDeathProgress(start, start.deaths[0]), 0);
  const paused = advanceEnemyEffects(start, [], 0);
  near(enemyDeathProgress(paused, paused.deaths[0]), 0);
  const middle = advanceEnemyEffects(start, [], ENEMY_DEATH_SECONDS / 2);
  near(enemyDeathProgress(middle, middle.deaths[0]), .5);
  const markup = renderEnemy(middle.deaths[0].enemy, 1, { dying: true, death: .5 });
  assert.match(markup, /dying-enemy/);
  assert.match(markup, /opacity="0\.500"/);
  assert.doesNotMatch(markup, /fill="#1b2631"/);
  assert.equal(advanceEnemyEffects(start, [], ENEMY_DEATH_SECONDS + .001).deaths.length, 0);
});

test('a rig whose images fail is disabled without disabling other enemy kinds or stages', () => {
  const rig = fixture();
  assert.equal(enemyRig(99, 'normal', { rigs: [rig] }), rig);
  disableEnemyRig('f99', 'normal');
  assert.equal(enemyRig(99, 'normal', { rigs: [rig] }), null);
  assert.equal(enemyRig(98, 'normal', { rigs: [{ ...rig, stage: 'f98' }] }).stage, 'f98');
  assert.equal(enemyRig(99, 'brute', { rigs: [{ ...rig, kind: 'brute' }] }).kind, 'brute');
});
