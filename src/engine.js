/** Deterministic, frame-rate-independent tower defense simulation. No DOM access. */
import { DEFAULT_MAP, mapForStage, pointOnPath } from './maps.js';

export const MAP = DEFAULT_MAP;
export { mapForStage, pointOnPath };

/**
 * Every combat number in one place. The game reads them here, and scripts/exportar-unity.mjs
 * exports them as-is so the Unity version plays exactly the same.
 */
export const BALANCE = Object.freeze({
  startLives: 20,
  startQi: 180,
  wavesPerStage: 5,
  // Enemy health grows 18% per stage: the Faxineiro alone can still clear stage 12 with good play.
  stageStep: 0.18,
  // After the player starts the first wave, each next wave starts by itself after this break (real seconds).
  waveBreakSeconds: 5,
  simulationStep: 1 / 30,
  maxFrameSeconds: 1,
  speeds: [1, 2],
  waves: Object.freeze({
    baseCount: 5, countPerWave: 2,
    baseHp: 23, hpPerWave: 8, speedPerWave: 1.5,
    spawnInterval: 1.05, finalWaveSpawnInterval: 0.85,
    // From wave 2, every 4th enemy (slot 2) is fast; from wave 3, every 5th (slot 3) is a brute; the last enemy of the final wave is the boss.
    fastFromWave: 2, fastEvery: 4, fastSlot: 2,
    bruteFromWave: 3, bruteEvery: 5, bruteSlot: 3,
  }),
  enemies: Object.freeze({
    normal: Object.freeze({ hp: 1, speed: 57, reward: 12, livesLost: 1 }),
    fast: Object.freeze({ hp: 0.7, speed: 88, reward: 12, livesLost: 1 }),
    brute: Object.freeze({ hp: 1.9, speed: 43, reward: 20, livesLost: 1 }),
    boss: Object.freeze({ hp: 4.8, speed: 40, reward: 70, livesLost: 5 }),
  }),
  towers: Object.freeze({
    maxLevel: 5, damagePerLevel: 0.62, rangePerLevel: 9, attackSpeedPerLevel: 0.12,
    upgradeCostFactor: 0.75, upgradeCostGrowth: 1.55, sellRefund: 0.7,
  }),
  slow: Object.freeze({ elements: Object.freeze(['ice', 'gelo', 'frost']), seconds: 1.5, factor: 0.65 }),
  projectileSeconds: 0.22,
});

export const WAVE_BREAK_SECONDS = BALANCE.waveBreakSeconds;
export const STAGE_STEP = BALANCE.stageStep;
export const stageDifficulty = stage => 1 + (stage - 1) * STAGE_STEP;

const success = (extra = {}) => ({ ok: true, ...extra });
const failure = reason => ({ ok: false, reason });
const playable = state => state.status === 'preparing' || state.status === 'running';

/** Which enemy fills a slot of a wave. */
export function enemyKind(wave, index, count) {
  const w = BALANCE.waves;
  if (wave === BALANCE.wavesPerStage && index === count - 1) return 'boss';
  if (wave >= w.bruteFromWave && index % w.bruteEvery === w.bruteSlot) return 'brute';
  if (wave >= w.fastFromWave && index % w.fastEvery === w.fastSlot) return 'fast';
  return 'normal';
}

export class GameEngine {
  constructor({ stage = 1, heroes = [], onEvent = () => {} } = {}) {
    this.onEvent = onEvent;
    this.restart(stage, heroes);
  }

  restart(stage = this.state?.stage || 1, heroes = this.heroes || []) {
    this.heroes = heroes;
    const stageNumber = Math.max(1, Math.floor(Number(stage) || 1));
    this.map = mapForStage(stageNumber);
    this.state = {
      status: 'preparing', stage: stageNumber,
      wave: 0, totalWaves: BALANCE.wavesPerStage, lives: BALANCE.startLives, qi: BALANCE.startQi,
      towers: [], enemies: [], projectiles: [], kills: 0, speed: 1,
      spawned: 0, waveEnemyCount: 0,
      // Seconds until the next wave starts by itself; null while it waits for the player.
      nextWaveIn: null,
    };
    this._nextId = 1;
    this._spawnQueue = [];
    this._spawnTimer = 0;
    return this.state;
  }

  _emit(type, details = {}) {
    this.onEvent({ type, ...details });
  }

  getTowerStats(tower) {
    const t = BALANCE.towers;
    const level = Math.max(1, tower.level || 1);
    return {
      damage: Math.round(tower.hero.damage * (1 + (level - 1) * t.damagePerLevel)),
      range: tower.hero.range + (level - 1) * t.rangePerLevel,
      attackSpeed: Math.round(tower.hero.attackSpeed * (1 + (level - 1) * t.attackSpeedPerLevel) * 100) / 100,
      level,
    };
  }

  /** Updates the recruited heroes (for example after a new star); towers already placed get the new attributes. */
  setHeroes(heroes = []) {
    this.heroes = heroes;
    for (const tower of this.state.towers) {
      const hero = heroes.find(item => item.id === tower.hero.id);
      if (hero) Object.assign(tower, { hero }, this.getTowerStats({ ...tower, hero }));
    }
  }

  getNextUpgradeCost(tower) {
    const t = BALANCE.towers;
    return tower.level >= t.maxLevel ? null : Math.round(tower.hero.cost * t.upgradeCostFactor * Math.pow(t.upgradeCostGrowth, tower.level - 1));
  }

  placeTower(hero, padId) {
    if (!playable(this.state)) return failure('A fase já terminou.');
    const pad = this.map.pads.find(item => item.id === padId);
    if (!pad) return failure('Escolha uma plataforma de defesa.');
    if (this.state.towers.some(tower => tower.padId === padId)) return failure('Esta plataforma já está ocupada.');
    if (!hero || !hero.id || !Number.isFinite(hero.cost) || hero.cost <= 0 ||
      !Number.isFinite(hero.damage) || hero.damage <= 0 || !Number.isFinite(hero.range) ||
      hero.range <= 0 || !Number.isFinite(hero.attackSpeed) || hero.attackSpeed <= 0) {
      return failure('Selecione um herói válido.');
    }
    if (this.heroes.length && !this.heroes.some(item => item.id === hero.id)) {
      return failure('Este herói ainda não foi recrutado.');
    }
    if (this.state.qi < hero.cost) return failure('Qi insuficiente para invocar este herói.');
    const tower = {
      id: `tower-${this._nextId++}`, hero, padId, x: pad.x, y: pad.y,
      level: 1, cooldown: 0, spent: hero.cost,
    };
    Object.assign(tower, this.getTowerStats(tower));
    this.state.qi -= hero.cost;
    this.state.towers.push(tower);
    this._emit('placed', { tower });
    return success({ tower });
  }

  upgradeTower(towerId) {
    if (!playable(this.state)) return failure('A fase já terminou.');
    const tower = this.state.towers.find(item => item.id === towerId);
    if (!tower) return failure('Selecione uma torre.');
    const cost = this.getNextUpgradeCost(tower);
    if (cost === null) return failure('Este herói atingiu o nível máximo.');
    if (this.state.qi < cost) return failure('Qi insuficiente para melhorar este herói.');
    this.state.qi -= cost;
    tower.spent += cost;
    tower.level++;
    Object.assign(tower, this.getTowerStats(tower));
    this._emit('upgrade', { tower, cost });
    return success({ tower, cost });
  }

  sellTower(towerId) {
    if (!playable(this.state)) return failure('A fase já terminou.');
    const index = this.state.towers.findIndex(item => item.id === towerId);
    if (index < 0) return failure('Selecione uma torre.');
    const [tower] = this.state.towers.splice(index, 1);
    const refund = Math.floor(tower.spent * BALANCE.towers.sellRefund);
    this.state.qi += refund;
    this._emit('sold', { tower, refund });
    return success({ refund });
  }

  setSpeed(speed) {
    if (!BALANCE.speeds.includes(speed)) return failure('Velocidade inválida.');
    this.state.speed = speed;
    return success();
  }

  startWave() {
    if (this.state.status !== 'preparing' || this.state.wave >= this.state.totalWaves) {
      return failure('Aguarde a conclusão da onda atual.');
    }
    const w = BALANCE.waves;
    this.state.nextWaveIn = null;
    this.state.wave++;
    const wave = this.state.wave;
    const count = w.baseCount + wave * w.countPerWave;
    const stageScale = stageDifficulty(this.state.stage);
    this._spawnQueue = Array.from({ length: count }, (_, index) => {
      const kind = enemyKind(wave, index, count);
      const rules = BALANCE.enemies[kind];
      const baseHp = (w.baseHp + wave * w.hpPerWave) * stageScale;
      return { kind, hp: Math.round(baseHp * rules.hp), speed: rules.speed + wave * w.speedPerWave, reward: rules.reward };
    });
    this.state.spawned = 0;
    this.state.waveEnemyCount = count;
    this._spawnTimer = 0;
    this.state.status = 'running';
    this._emit('waveStart', { wave, count });
    return success();
  }

  update(dtSeconds) {
    if (!Number.isFinite(dtSeconds) || dtSeconds <= 0) return;
    // The break between waves counts real seconds, whatever the game speed, so there is always time to prepare.
    if (this.state.status === 'preparing' && this.state.nextWaveIn !== null) {
      this.state.nextWaveIn = Math.max(0, this.state.nextWaveIn - Math.min(dtSeconds, BALANCE.maxFrameSeconds));
      if (this.state.nextWaveIn === 0) this.startWave();
      return;
    }
    if (this.state.status !== 'running') return;
    // Tiny simulation steps keep targeting and movement consistent at any frame rate.
    let remaining = Math.min(dtSeconds, BALANCE.maxFrameSeconds) * this.state.speed;
    while (remaining > 0.000001 && this.state.status === 'running') {
      const step = Math.min(remaining, BALANCE.simulationStep);
      this._step(step);
      remaining -= step;
    }
  }

  _step(dt) {
    const state = this.state;
    this._spawnTimer -= dt;
    if (this._spawnQueue.length && this._spawnTimer <= 0) {
      const blueprint = this._spawnQueue.shift();
      state.enemies.push({
        id: `enemy-${this._nextId++}`, ...blueprint, maxHp: blueprint.hp,
        x: this.map.path[0].x, y: this.map.path[0].y, progress: 0, slowRemaining: 0, facing: 1,
      });
      state.spawned++;
      this._spawnTimer += state.wave === state.totalWaves ? BALANCE.waves.finalWaveSpawnInterval : BALANCE.waves.spawnInterval;
    }
    for (const enemy of state.enemies) {
      enemy.slowRemaining = Math.max(0, enemy.slowRemaining - dt);
      enemy.progress += enemy.speed * dt * (enemy.slowRemaining > 0 ? BALANCE.slow.factor : 1);
      const previousX = enemy.x;
      Object.assign(enemy, pointOnPath(enemy.progress, this.map));
      // Sprites look right; they turn only on horizontal stretches of the road.
      if (enemy.x < previousX - 0.01) enemy.facing = -1;
      else if (enemy.x > previousX + 0.01) enemy.facing = 1;
    }
    const escaped = state.enemies.filter(enemy => enemy.progress >= this.map.pathLength);
    for (const enemy of escaped) {
      state.lives = Math.max(0, state.lives - BALANCE.enemies[enemy.kind].livesLost);
      this._emit('escaped', { enemy });
    }
    state.enemies = state.enemies.filter(enemy => enemy.progress < this.map.pathLength);
    if (state.lives <= 0) {
      state.status = 'defeat';
      this._emit('defeat', { stage: state.stage, wave: state.wave });
      return;
    }

    for (const tower of state.towers) {
      tower.cooldown = Math.max(0, tower.cooldown - dt);
      if (tower.cooldown > 0) continue;
      // Each tower hits the enemy furthest along the road within its range.
      const target = state.enemies.filter(enemy => enemy.hp > 0 &&
        Math.hypot(enemy.x - tower.x, enemy.y - tower.y) <= tower.range)
        .sort((a, b) => b.progress - a.progress)[0];
      if (!target) continue;
      tower.cooldown = 1 / tower.attackSpeed;
      const projectile = {
        id: `projectile-${this._nextId++}`, x: tower.x, y: tower.y,
        fromX: tower.x, fromY: tower.y, targetX: target.x, targetY: target.y,
        targetId: target.id, color: tower.hero.color || '#9bd4b6',
        lifetime: BALANCE.projectileSeconds, maxLifetime: BALANCE.projectileSeconds,
      };
      state.projectiles.push(projectile);
      // Damage lands at once; the projectile is only the visual.
      target.hp -= tower.damage;
      if (BALANCE.slow.elements.includes(String(tower.hero.element).toLowerCase())) target.slowRemaining = BALANCE.slow.seconds;
      if (target.hp <= 0) {
        state.qi += target.reward;
        state.kills++;
        this._emit('kill', { enemy: target, tower, reward: target.reward });
      }
    }
    state.enemies = state.enemies.filter(enemy => enemy.hp > 0);
    for (const projectile of state.projectiles) {
      projectile.lifetime -= dt;
      const fraction = Math.min(1, 1 - projectile.lifetime / projectile.maxLifetime);
      projectile.x = projectile.fromX + (projectile.targetX - projectile.fromX) * fraction;
      projectile.y = projectile.fromY + (projectile.targetY - projectile.fromY) * fraction;
    }
    state.projectiles = state.projectiles.filter(projectile => projectile.lifetime > 0);
    if (!this._spawnQueue.length && !state.enemies.length) {
      state.projectiles = [];
      state.status = state.wave === state.totalWaves ? 'victory' : 'preparing';
      if (state.status === 'preparing') state.nextWaveIn = WAVE_BREAK_SECONDS;
      this._emit('waveComplete', { wave: state.wave, kills: state.kills });
      if (state.status === 'victory') this._emit('victory', { stage: state.stage, kills: state.kills });
    }
  }
}
