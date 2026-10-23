import test from 'node:test';
import assert from 'node:assert/strict';
import { ENEMY_RIGS } from '../src/enemy-rigs-manifest.js';
import { renderEnemy } from '../src/pixel-units.js';
import {
  isEnemyRig, enemyRig, enemyRigPose, renderRigEnemy, disableEnemyRig,
  emptyEnemyEffects, advanceEnemyEffects, enemyHitEffect, enemyDeathProgress, ENEMY_DEATH_SECONDS,
} from '../src/enemy-rig.js';

const names = ['cabelo-tras', 'braco-tras', 'perna-tras', 'perna-frente', 'tronco', 'saia', 'cabeca', 'arma', 'braco-frente'];
const quadrupedNames = ['cauda', 'pata-tras-longe', 'pata-frente-longe', 'corpo', 'pata-tras-perto', 'pata-frente-perto', 'cabeca'];
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
function quadrupedFixture() {
  return {
    ...fixture(), kind: 'fast', body: 'quadrupede', stride: 25,
    parts: quadrupedNames.map(name => ({
      name, x: 350, y: 128, w: 450, h: 832, pivotX: 512,
      pivotY: name.startsWith('pata-') ? (name.endsWith('-longe') ? 632 : 642) : 512,
      parent: '', file: `arte/inimigos-pecas/f99-fast/${name}.webp`,
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
    { body: 'quadrupede' }, { body: 'toString' }, { top: 960 }, { stride: 0 }, { size: 512 },
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

test('quadruped rigs require all four legs in template order, permit an optional tail, and reject parents', () => {
  const rig = quadrupedFixture();
  assert.equal(isEnemyRig(rig), true);
  assert.equal(enemyRig(99, 'fast', { rigs: [rig] }), rig);
  assert.equal(isEnemyRig({ ...rig, parts: rig.parts.filter(part => part.name !== 'cauda') }), true);
  for (const required of quadrupedNames.filter(name => name !== 'cauda')) {
    assert.equal(isEnemyRig({ ...rig, parts: rig.parts.filter(part => part.name !== required) }), false, required);
  }
  const swapped = [...rig.parts];
  [swapped[1], swapped[2]] = [swapped[2], swapped[1]];
  assert.equal(isEnemyRig({ ...rig, parts: swapped }), false);
  assert.equal(isEnemyRig({ ...rig, parts: rig.parts.map(part => part.name === 'cabeca' ? { ...part, parent: 'corpo' } : part) }), false);
  assert.equal(isEnemyRig({ ...rig, parts: [...rig.parts, rig.parts[0]] }), false);
  assert.equal(isEnemyRig({ ...fixture(), parts: fixture().parts.map(part => part.name === 'tronco' ? { ...part, parent: 'braco-frente' } : part) }), false);
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

test('quadruped gait pairs diagonal legs and compensates their ground contact using travelled distance', () => {
  const rig = quadrupedFixture();
  const step = { ...enemy, kind: 'fast', progress: rig.stride / 4 };
  const pose = enemyRigPose(step, rig);
  near(pose.phase, Math.PI / 2);
  near(pose.angles['pata-tras-longe'], -20);
  near(pose.angles['pata-frente-perto'], -20);
  near(pose.angles['pata-frente-longe'], 20);
  near(pose.angles['pata-tras-perto'], 20);
  near(pose.angles.cauda, 8 * Math.sin(Math.PI / 2 - 1));
  near(pose.angles.corpo, 1.5 * Math.sin(Math.PI));
  near(pose.angles.cabeca, 3 * Math.sin(Math.PI + .8));
  near(pose.drop, (960 - 637) * (1 - Math.cos(20 * Math.PI / 180)));
  assert.deepEqual(enemyRigPose({ ...step, speed: 100, paused: true }, rig), pose);
  assert.deepEqual(enemyRigPose({ ...step, progress: step.progress + rig.stride }, rig), pose);
  near(enemyRigPose({ ...step, progress: 0 }, rig).drop, 0);
  const markup = renderRigEnemy({ ...step, facing: -1 }, rig, 52);
  assert.match(markup, /translate\(100 212\) scale\(-0\.0625 0\.0625\) translate\(-512 -960\)/);
  assert.deepEqual([...markup.matchAll(/data-part="([^"]+)"/g)].map(match => match[1]), quadrupedNames);
  assert.match(markup, /data-part="pata-frente-perto" transform="rotate\(-20 512 642\)"/);
  assert.doesNotMatch(markup, /data-parent=/);
});

test('rigged bosses receive a subtle aura behind their pieces without changing other enemy kinds', () => {
  const markup = renderRigEnemy({ ...enemy, kind: 'boss' }, fixture(), 92);
  assert.match(markup, /class="enemy-boss-aura"/);
  assert.ok(markup.indexOf('enemy-boss-aura') < markup.indexOf('data-part='));
  assert.doesNotMatch(renderRigEnemy(enemy, fixture()), /enemy-boss-aura/);
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
  assert.match(renderEnemy({ ...enemy, kind: 'fast' }, 2), /painted-enemy/);
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
