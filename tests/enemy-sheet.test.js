import test from 'node:test';
import assert from 'node:assert/strict';
import { enemySheet, renderEnemy, roadDirection } from '../src/pixel-units.js';
import { ENEMY_SHEETS } from '../src/enemy-sheets-manifest.js';

const servo = progress => ({ x: 100, y: 175, progress, kind: 'normal', hp: 10, maxHp: 20, facing: 1 });

test('the walk sheet turns with the road: right, down, right and up on stage 1', () => {
  // Stage 1 road: right to x 215, down to y 255, right to x 455, then up.
  assert.equal(roadDirection(servo(100), 1), 'right');
  assert.equal(roadDirection(servo(250), 1), 'down');
  assert.equal(roadDirection(servo(400), 1), 'right');
  assert.equal(roadDirection(servo(560), 1), 'up');
});

test('an enemy with a walk sheet is drawn from it, one cell at a time', () => {
  if (!ENEMY_SHEETS['f01-normal']) return;
  const sheet = enemySheet(1, 'normal');
  const at = progress => renderEnemy(servo(progress), 1).match(/viewBox="(\d+) (\d+) /).slice(1).map(Number);
  assert.deepEqual(at(0), [0, 2 * sheet.cellHeight], 'first step, walking right (third row)');
  assert.deepEqual(at(7), [sheet.cellWidth, 2 * sheet.cellHeight], 'a new step every 7 units');
  assert.deepEqual(at(250)[1], 0, 'walking down uses the first row');
  assert.ok(!renderEnemy(servo(0), 1).includes('rig-enemy'), 'the sheet comes before the cut-out animation');
});
