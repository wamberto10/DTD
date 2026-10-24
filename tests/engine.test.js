import test from 'node:test';
import assert from 'node:assert/strict';
import { BALANCE, GameEngine, MAP, WAVE_BREAK_SECONDS, mapForStage, pointOnPath } from '../src/engine.js';
import { HEROES, STAGES, WORLDS, TALENTS } from '../src/data.js';
import { createProfile, grantVictory, raiseTalent, talentModifiers } from '../src/profile.js';
import { withStars } from '../src/stars.js';

const cleaner = HEROES.find(hero => hero.id === 'faxineiro');
const longestRange = Math.max(...HEROES.map(hero => hero.range));
// Length of road (in battle units) that a Faxineiro on this platform can reach.
function roadInRange(map, pad, range = cleaner.range) {
  let covered = 0;
  for (let distance = 0; distance < map.pathLength; distance += 5) {
    const point = pointOnPath(distance, map);
    if (Math.hypot(point.x - pad.x, point.y - pad.y) <= range) covered += 5;
  }
  return covered;
}
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

test('each hero defends a single platform per stage; selling the tower frees the hero again', () => {
  const apprentice = HEROES.find(hero => hero.id === 'aprendiz');
  const game = new GameEngine({ heroes: [cleaner, apprentice] });
  const first = game.placeTower(cleaner, 'p1');
  assert.equal(first.ok, true);
  const again = game.placeTower(cleaner, 'p2');
  assert.equal(again.ok, false);
  assert.match(again.reason, /já está em campo/);
  assert.equal(game.placeTower(apprentice, 'p2').ok, true);
  assert.equal(game.sellTower(first.tower.id).ok, true);
  assert.equal(game.placeTower(cleaner, 'p3').ok, true);
  assert.deepEqual(game.state.towers.map(tower => tower.hero.id).sort(), ['aprendiz', 'faxineiro']);
});

test('towers only hit enemies after they come into the map', () => {
  // A tower that reaches the whole start of the road and kills with one hit.
  const sharpshooter = { ...cleaner, range: 400, damage: 10000, attackSpeed: 10 };
  const kills = [];
  const game = new GameEngine({ heroes: [sharpshooter], onEvent: event => { if (event.type === 'kill') kills.push(event.enemy.progress); } });
  assert.equal(game.placeTower(sharpshooter, 'p1').ok, true);
  game.startWave();
  for (let frame = 0; frame < 30 * 5 && !kills.length; frame++) game.update(1 / 30);
  assert.ok(kills.length, 'The tower must hit the first enemy soon after it comes in.');
  assert.ok(kills[0] >= BALANCE.enemyEntry, `Hit at ${kills[0]} units, before the enemy came into the map.`);
  assert.ok(kills[0] < BALANCE.enemyEntry + 5, 'Once inside, the enemy can be hit at once.');
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
  // Three different heroes: each hero defends a single platform.
  for (const [id, pad] of [['faxineiro', 'p1'], ['aprendiz', 'p2'], ['lin-yue', 'p4']]) game.placeTower(HEROES.find(hero => hero.id === id), pad);
  assert.equal(game.state.qi, 0);
  assert.equal(game.startWave().ok, true);
  assert.equal(game.startWave().ok, false);
  simulateWave(game);
  assert.equal(game.state.status, 'preparing');
  assert.equal(game.state.wave, 1);
  assert.equal(game.state.kills, 7);
  assert.equal(game.state.qi, 7 * 12);
  assert.equal(game.state.lives, 20);
  assert.equal(events.filter(event => event.type === 'kill').length, 7);
});

// A careful but simple player. Heroes go out in order of damage per Qi, each on its own platform (the free one that
// sees the most road for that hero): three towers first, then the next hero whenever every tower reached level 3,
// otherwise upgrade the weakest tower. Qi is spent before each wave and once a second during it, as it comes in,
// and each skill is cast in that same second check once it is charged.
function playStage(stageId, squad, onEvent = () => {}, modifiers = undefined) {
  const order = [...squad].sort((a, b) => b.damage * b.attackSpeed / b.cost - a.damage * a.attackSpeed / a.cost);
  const game = new GameEngine({ stage: stageId, heroes: squad, onEvent: event => onEvent(event), ...(modifiers ? { modifiers } : {}) });
  const seen = new Map();
  const road = (pad, range) => seen.get(`${pad.id}:${range}`) ?? seen.set(`${pad.id}:${range}`, roadInRange(game.map, pad, range)).get(`${pad.id}:${range}`);
  const spend = () => {
    while (true) {
      const towers = game.state.towers;
      const weakest = [...towers].filter(tower => tower.level < 5).sort((a, b) => a.level - b.level)[0];
      const hero = order.find(item => !towers.some(tower => tower.hero.id === item.id));
      const free = hero && game.map.pads.filter(pad => !towers.some(tower => tower.padId === pad.id))
        .sort((a, b) => road(b, hero.range) - road(a, hero.range))[0];
      if (free && (towers.length < 3 || !weakest || weakest.level >= 3)) {
        if (game.state.qi < hero.cost || !game.placeTower(hero, free.id).ok) return;
        continue;
      }
      if (!weakest || game.state.qi < game.getNextUpgradeCost(weakest) || !game.upgradeTower(weakest.id).ok) return;
    }
  };
  for (let wave = 0; wave < 5 && game.state.status === 'preparing'; wave++) {
    spend();
    assert.equal(game.startWave().ok, true);
    for (let frame = 1; frame <= 180 * 30 && game.state.status === 'running'; frame++) {
      game.update(1 / 30);
      if (frame % 30 === 0 && game.state.status === 'running') {
        spend();
        for (const tower of [...game.state.towers]) if (game.state.status === 'running' && game.skillReady(tower)) game.useSkill(tower.id);
      }
    }
    assert.notEqual(game.state.status, 'running', 'The wave must finish within the simulation budget.');
  }
  return game;
}

test('the starter alone, a single tower, still wins the first two stages', () => {
  // Each hero defends one platform, so a player who has not recruited yet has one tower: enough for the first two
  // stages, losing some lives, which points at the recruitment pavilion.
  let profile = createProfile();
  for (const stage of STAGES.slice(0, 2)) {
    assert.equal(profile.unlockedStage, stage.id);
    const events = [];
    const game = playStage(stage.id, [cleaner], event => events.push(event));
    assert.equal(game.state.status, 'victory', `Stage ${stage.id} must be beatable with the Faxineiro alone.`);
    assert.equal(game.state.towers.length, 1);
    assert.equal(game.startWave().ok, false);
    assert.equal(events.filter(event => event.type === 'victory').length, 1);
    const before = profile.crystals;
    profile = grantVictory(profile, stage.id).profile;
    assert.equal(profile.crystals, before + stage.reward);
    assert.equal(profile.unlockedStage, stage.id + 1);
    assert.deepEqual(profile.completedStages, STAGES.slice(0, stage.id).map(item => item.id));
    // A new stage resets all temporary progress while the profile keeps its rewards.
    game.restart(stage.id + 1);
    assert.equal(game.state.qi, 180);
    assert.equal(game.state.wave, 0);
    assert.equal(game.state.towers.length, 0);
    assert.equal(profile.owned.length, 1);
  }
});

test('from stage 4 the Faxineiro alone is not enough: recruiting is part of the journey', () => {
  assert.equal(playStage(4, [cleaner]).state.status, 'defeat');
});

test('the first recruits carry the first six stages without losing lives', () => {
  // What 300 starting crystals usually bring: the Faxineiro (with the stars of a repeat) and two more common heroes.
  const squad = [['faxineiro', 2], ['aprendiz', 0], ['lin-yue', 0]]
    .map(([id, stars]) => withStars(HEROES.find(hero => hero.id === id), stars));
  for (const stage of STAGES.slice(0, 6)) {
    const events = [];
    const game = playStage(stage.id, squad, event => events.push(event));
    assert.equal(game.state.status, 'victory', `The first recruits must clear stage ${stage.id}.`);
    assert.equal(game.state.lives, 20, `Stage ${stage.id} should not cost lives with three heroes.`);
    // 55 enemies in five waves, plus the minions of bosses that summon.
    assert.ok(game.state.kills >= 55);
    assert.ok(events.some(event => event.type === 'kill' && event.enemy.kind === 'boss'));
  }
});

// The talents of a typical player who reached a stage: two stars per stage cleared, spent on the cheapest next level.
function typicalTalents(stagesCleared) {
  let profile = createProfile();
  for (let id = 1; id <= stagesCleared; id++) profile = grantVictory(profile, id, { lives: 17, maxLives: 20 }).profile;
  for (let changed = true; changed;) {
    changed = false;
    const next = TALENTS.map(t => t.id).sort((a, b) => profile.talents[a] - profile.talents[b])[0];
    const result = raiseTalent(profile, next);
    if (result.ok) { profile = result.profile; changed = true; }
  }
  return talentModifiers(profile);
}

test('the collection a typical player has by the end of the first world clears all of it', () => {
  // The median player at stage 12 after spending every crystal on recruits and raising every star (npm run balanceamento).
  const squad = [['long-chen', 0], ['bai-ling', 0], ['qing-lian', 0], ['mo-yan', 3], ['su-lan', 6]]
    .map(([id, stars]) => withStars(HEROES.find(hero => hero.id === id), stars));
  const world = WORLDS[0];
  let profile = createProfile();
  for (const stage of STAGES.filter(item => item.world === world.id)) {
    const game = playStage(stage.id, squad, () => {}, typicalTalents(stage.id - 1));
    assert.equal(game.state.status, 'victory', `A typical collection must clear stage ${stage.id}.`);
    assert.ok(game.state.lives >= 10, `Stage ${stage.id} should leave a typical collection with spare lives.`);
    profile = grantVictory(profile, stage.id).profile;
  }
  assert.equal(profile.unlockedStage, world.lastStage + 1, 'The first world opens the second.');
  assert.equal(profile.crystals, 300 + STAGES.filter(item => item.world === world.id).reduce((total, stage) => total + stage.reward, 0));
});

test('the collection a typical player has by the end of Tong Xuan clears the second world', () => {
  // The median player at stage 24 (npm run balanceamento): more legendary and UR heroes, and the talents of the journey.
  const squad = [['yan-tian', 0], ['wu-kong', 0], ['long-chen', 2], ['bai-ling', 0], ['qing-lian', 3]]
    .map(([id, stars]) => withStars(HEROES.find(hero => hero.id === id), stars));
  for (const stage of STAGES.filter(item => item.world === WORLDS[1].id)) {
    const game = playStage(stage.id, squad, () => {}, typicalTalents(stage.id - 1));
    assert.equal(game.state.status, 'victory', `A typical collection must clear stage ${stage.id}.`);
    assert.ok(game.state.lives >= 10, `Stage ${stage.id} should leave a typical collection with spare lives.`);
  }
});

test('every stage has nine platforms off the road and a road that crosses the whole map', () => {
  for (const stage of STAGES) {
    const map = mapForStage(stage.id);
    assert.equal(map.pads.length, 9, `Stage ${stage.id}`);
    assert.equal(map.path[0].x, 0);
    assert.equal(map.path.at(-1).x, 1000);
    for (const pad of map.pads) {
      let nearest = Infinity;
      for (let distance = 0; distance <= map.pathLength; distance += 2) {
        const point = pointOnPath(distance, map);
        nearest = Math.min(nearest, Math.hypot(point.x - pad.x, point.y - pad.y));
      }
      assert.ok(nearest >= 24, `Stage ${stage.id} platform ${pad.id} sits on the road.`);
      // A few painted platforms are far from the road: they are spots for long-range heroes.
      assert.ok(roadInRange(map, pad, longestRange) > 0, `Stage ${stage.id} platform ${pad.id} cannot reach the road.`);
    }
  }
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

test('a new star upgrades the towers already on the map', () => {
  const game = new GameEngine({ heroes: [cleaner] });
  game.state.qi = 5000;
  const { tower } = game.placeTower(cleaner, 'p1');
  game.upgradeTower(tower.id);
  const before = tower.damage;
  game.setHeroes([withStars(cleaner, 3)]);
  assert.equal(tower.hero.stars, 3);
  assert.equal(tower.level, 2);
  assert.equal(tower.damage, Math.round(withStars(cleaner, 3).damage * 1.62));
  assert.ok(tower.damage > before);
  assert.equal(game.getNextUpgradeCost(tower), Math.round(cleaner.cost * 0.75 * 1.55));
});

test('after the first wave, each next wave starts by itself after a five-second break', () => {
  // Towers strong enough for every wave: this test is about the timing between waves, not about difficulty.
  const sturdy = { ...cleaner, damage: 150 };
  const game = new GameEngine({ heroes: [sturdy] });
  for (const pad of ['p1', 'p2', 'p4']) game.placeTower(sturdy, pad);
  // Nothing happens until the player starts the first wave.
  game.update(30);
  assert.equal(game.state.wave, 0);
  assert.equal(game.state.nextWaveIn, null);
  game.startWave();
  simulateWave(game);
  assert.equal(game.state.status, 'preparing');
  assert.equal(game.state.nextWaveIn, WAVE_BREAK_SECONDS);
  // The break counts real seconds: at 2× speed it still lasts five seconds.
  game.setSpeed(2);
  game.update(1); game.update(1); game.update(0.5);
  assert.equal(game.state.status, 'preparing');
  assert.equal(game.state.nextWaveIn, 2.5);
  game.update(1); game.update(1); game.update(0.5);
  assert.equal(game.state.status, 'running');
  assert.equal(game.state.wave, 2);
  assert.equal(game.state.nextWaveIn, null);
  // The player can skip the wait.
  simulateWave(game);
  assert.equal(game.state.nextWaveIn, WAVE_BREAK_SECONDS);
  assert.equal(game.startWave().ok, true);
  assert.equal(game.state.wave, 3);
  assert.equal(game.state.nextWaveIn, null);
  // Waves keep chaining on their own until the stage ends, with no break after the last one.
  for (let second = 0; second < 600 && game.state.status !== 'victory'; second++) for (let f = 0; f < 30; f++) game.update(1 / 30);
  assert.equal(game.state.status, 'victory');
  assert.equal(game.state.wave, 5);
  assert.equal(game.state.nextWaveIn, null);
  game.restart();
  assert.equal(game.state.nextWaveIn, null);
});

test('the match summary credits the damage and the kills of each hero', () => {
  const squad = [['faxineiro', 2], ['aprendiz', 0], ['lin-yue', 0]].map(([id, stars]) => withStars(HEROES.find(hero => hero.id === id), stars));
  const events = [];
  const game = playStage(1, squad, event => events.push(event));
  const stats = Object.values(game.state.heroStats);
  assert.equal(stats.reduce((sum, item) => sum + item.kills, 0), game.state.kills, 'every kill belongs to a hero');
  assert.ok(stats.every(item => item.damage > 0));
  const damage = events.filter(event => event.type === 'damage');
  assert.equal(damage.reduce((sum, event) => sum + (event.tower ? 0 : 1), 0), 0);
  assert.ok(events.some(event => event.type === 'attack'));
  assert.ok(damage.some(event => event.crit), 'the Faxineiro lands critical hits');
  // Dismissing a tower keeps its line in the summary.
  const fresh = new GameEngine({ stage: 1, heroes: squad });
  fresh.placeTower(squad[0], 'p1');
  fresh.state.heroStats.faxineiro = { damage: 10, kills: 1 };
  fresh.sellTower(fresh.state.towers[0].id);
  assert.deepEqual(fresh.state.heroStats.faxineiro, { damage: 10, kills: 1 });
});
