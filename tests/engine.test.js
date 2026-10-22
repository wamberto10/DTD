import test from 'node:test';
import assert from 'node:assert/strict';
import { GameEngine, MAP, pointOnPath } from '../src/engine.js';
import { HEROES, STAGES } from '../src/data.js';
import { createProfile, grantVictory } from '../src/profile.js';

const cleaner = HEROES.find(hero => hero.id === 'faxineiro');
function simulateWave(engine, maxSeconds = 180) {
  for (let frame = 0; frame < maxSeconds * 30 && engine.state.status === 'running'; frame++) engine.update(1 / 30);
  assert.notEqual(engine.state.status, 'running', 'The wave must finish within the simulation budget.');
}

test('map positions clamp at endpoints and follow the path', () => {
  assert.deepEqual(pointOnPath(-5), MAP.path[0]);
  assert.deepEqual(pointOnPath(MAP.pathLength + 1), MAP.path.at(-1));
  assert.deepEqual(pointOnPath(255), { x: 205, y: 220 });
});

test('placement spends Qi and refuses invalid, occupied, unaffordable, and unowned towers', () => {
  const game = new GameEngine({ heroes: [cleaner] });
  assert.equal(game.placeTower(cleaner, 'missing').ok, false);
  assert.equal(game.placeTower(cleaner, 'p1').ok, true);
  assert.equal(game.state.qi, 130);
  assert.equal(game.placeTower(cleaner, 'p1').ok, false);
  assert.equal(game.placeTower({ ...cleaner, id: 'unowned' }, 'p2').ok, false);
  assert.equal(game.placeTower({ ...cleaner, cost: 200 }, 'p2').ok, false);
  assert.equal(game.state.towers.length, 1);
  assert.equal(game.state.qi, 130);
});

test('upgrades spend Qi, improve stats, cap at level five, and sell refunds investment', () => {
  const game = new GameEngine();
  game.state.qi = 5000;
  const { tower } = game.placeTower(cleaner, 'p1');
  const before = game.state.qi;
  const cost = game.getNextUpgradeCost(tower);
  assert.equal(game.upgradeTower(tower.id).ok, true);
  assert.equal(game.state.qi, before - cost);
  assert.ok(tower.damage > cleaner.damage && tower.range > cleaner.range && tower.attackSpeed > cleaner.attackSpeed);
  while (tower.level < 5) assert.equal(game.upgradeTower(tower.id).ok, true);
  assert.equal(game.getNextUpgradeCost(tower), null);
  assert.equal(game.upgradeTower(tower.id).ok, false);
  const qi = game.state.qi;
  const spent = tower.spent;
  assert.equal(game.sellTower(tower.id).refund, Math.floor(spent * 0.7));
  assert.equal(game.state.qi, qi + Math.floor(spent * 0.7));
  assert.equal(game.state.towers.length, 0);
});

test('enemy kills award Qi and first wave completes with basic towers', () => {
  const events = [];
  const game = new GameEngine({ onEvent: event => events.push(event) });
  for (const pad of ['p1', 'p2', 'p4']) game.placeTower(cleaner, pad);
  assert.equal(game.state.qi, 30);
  assert.equal(game.startWave().ok, true);
  assert.equal(game.startWave().ok, false);
  simulateWave(game);
  assert.equal(game.state.status, 'preparing');
  assert.equal(game.state.wave, 1);
  assert.equal(game.state.kills, 7);
  assert.equal(game.state.qi, 114);
  assert.equal(game.state.lives, 20);
  assert.equal(events.filter(event => event.type === 'kill').length, 7);
});

test('the actual starter can clear every stage and unlock sequential rewards without recruiting', () => {
  let profile = createProfile();
  for (const stage of STAGES) {
    const events = [];
    assert.equal(profile.unlockedStage, stage.id);
    const initialCrystals = profile.crystals;
    const game = new GameEngine({ stage: stage.id, heroes: [cleaner], onEvent: event => {
      if (event.type === 'victory') {
        assert.equal(game.state.status, 'victory');
        profile = grantVictory(profile, stage.id).profile;
      }
      events.push(event);
    } });
    for (const pad of ['p1', 'p2', 'p4']) assert.equal(game.placeTower(cleaner, pad).ok, true);
    for (let wave = 0; wave < 5; wave++) {
      // A human-friendly strategy: upgrade the weakest tower only between waves.
      while (true) {
        const weakest = [...game.state.towers].filter(tower => tower.level < 5)
          .sort((a, b) => a.level - b.level)[0];
        if (!weakest || game.state.qi < game.getNextUpgradeCost(weakest)) break;
        assert.equal(game.upgradeTower(weakest.id).ok, true);
      }
      assert.equal(game.startWave().ok, true);
      simulateWave(game);
    }
    assert.equal(game.state.status, 'victory');
    assert.equal(game.state.lives, 20);
    assert.equal(game.state.kills, 55);
    assert.equal(game.startWave().ok, false);
    assert.equal(events.filter(event => event.type === 'victory').length, 1);
    assert.ok(events.some(event => event.type === 'kill' && event.enemy.kind === 'boss'));
    assert.equal(profile.crystals, initialCrystals + stage.reward);
    assert.equal(profile.unlockedStage, Math.min(stage.id + 1, STAGES.length));
    assert.deepEqual(profile.completedStages, STAGES.slice(0, stage.id).map(item => item.id));
    // A new stage resets all temporary progress while the profile keeps its rewards.
    game.restart(Math.min(stage.id + 1, STAGES.length));
    assert.equal(game.state.qi, 180);
    assert.equal(game.state.wave, 0);
    assert.equal(game.state.towers.length, 0);
    assert.equal(profile.owned.length, 1);
  }
  assert.equal(profile.crystals, 825);
});

test('undefended enemies cause defeat without granting rewards or unlocking stages', () => {
  const events = [];
  const initialProfile = createProfile();
  let profile = initialProfile;
  const game = new GameEngine({ onEvent: event => {
    if (event.type === 'victory') profile = grantVictory(profile, game.state.stage).profile;
    events.push(event);
  } });
  while (game.state.status === 'preparing') {
    game.startWave();
    simulateWave(game);
  }
  assert.equal(game.state.status, 'defeat');
  assert.equal(game.state.lives, 0);
  assert.equal(events.filter(event => event.type === 'defeat').length, 1);
  assert.equal(game.placeTower(cleaner, 'p1').ok, false);
  assert.deepEqual(profile, initialProfile);
  assert.equal(profile.crystals, 300);
  assert.equal(profile.unlockedStage, 1);
});

test('restart resets temporary Qi, towers, kills, wave, and speed for the next stage', () => {
  const game = new GameEngine({ heroes: [cleaner] });
  game.placeTower(cleaner, 'p1');
  game.upgradeTower(game.state.towers[0].id);
  game.startWave();
  game.setSpeed(2);
  game.update(1);
  game.restart(2);
  assert.deepEqual({ stage: game.state.stage, qi: game.state.qi, wave: game.state.wave,
    speed: game.state.speed, status: game.state.status, towers: game.state.towers.length,
    enemies: game.state.enemies.length, kills: game.state.kills },
  { stage: 2, qi: 180, wave: 0, speed: 1, status: 'preparing', towers: 0, enemies: 0, kills: 0 });
  assert.equal(game.heroes[0].id, 'faxineiro');
});

test('2× speed advances enemies twice as far and invalid time inputs are ignored', () => {
  const normal = new GameEngine();
  const fast = new GameEngine();
  normal.startWave(); fast.startWave(); fast.setSpeed(2);
  normal.update(0.4); fast.update(0.4);
  assert.ok(Math.abs(fast.state.enemies[0].progress / normal.state.enemies[0].progress - 2) < 0.01);
  const progress = normal.state.enemies[0].progress;
  normal.update(NaN); normal.update(-1);
  assert.equal(normal.state.enemies[0].progress, progress);
});
