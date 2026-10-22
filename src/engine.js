/** Deterministic, frame-rate-independent tower defense simulation. No DOM access. */
const path = [
  { x: 0, y: 170 }, { x: 205, y: 170 }, { x: 205, y: 410 },
  { x: 475, y: 410 }, { x: 475, y: 235 }, { x: 735, y: 235 },
  { x: 735, y: 445 }, { x: 1000, y: 445 },
];
const segments = path.slice(1).map((point, index) => ({
  from: path[index], to: point,
  length: Math.hypot(point.x - path[index].x, point.y - path[index].y),
}));
export const MAP = Object.freeze({
  width: 1000, height: 600, path,
  pathLength: segments.reduce((total, segment) => total + segment.length, 0),
  pads: [
    { id: 'p1', x: 135, y: 270 }, { id: 'p2', x: 300, y: 260 },
    { id: 'p3', x: 345, y: 495 }, { id: 'p4', x: 385, y: 325 },
    { id: 'p5', x: 565, y: 325 }, { id: 'p6', x: 615, y: 150 },
    { id: 'p7', x: 650, y: 425 }, { id: 'p8', x: 830, y: 325 },
    { id: 'p9', x: 875, y: 520 },
  ],
});

export function pointOnPath(distance) {
  let remaining = Math.max(0, distance);
  for (const segment of segments) {
    if (remaining <= segment.length) {
      const fraction = remaining / segment.length;
      return {
        x: segment.from.x + (segment.to.x - segment.from.x) * fraction,
        y: segment.from.y + (segment.to.y - segment.from.y) * fraction,
      };
    }
    remaining -= segment.length;
  }
  return { ...path[path.length - 1] };
}

const success = (extra = {}) => ({ ok: true, ...extra });
const failure = reason => ({ ok: false, reason });
const playable = state => state.status === 'preparing' || state.status === 'running';

export class GameEngine {
  constructor({ stage = 1, heroes = [], onEvent = () => {} } = {}) {
    this.onEvent = onEvent;
    this.restart(stage, heroes);
  }

  restart(stage = this.state?.stage || 1, heroes = this.heroes || []) {
    this.heroes = heroes;
    this.state = {
      status: 'preparing', stage: Math.max(1, Math.floor(Number(stage) || 1)),
      wave: 0, totalWaves: 5, lives: 20, qi: 180,
      towers: [], enemies: [], projectiles: [], kills: 0, speed: 1,
      spawned: 0, waveEnemyCount: 0,
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
    const level = Math.max(1, tower.level || 1);
    return {
      damage: Math.round(tower.hero.damage * (1 + (level - 1) * 0.62)),
      range: tower.hero.range + (level - 1) * 9,
      attackSpeed: Math.round(tower.hero.attackSpeed * (1 + (level - 1) * 0.12) * 100) / 100,
      level,
    };
  }

  getNextUpgradeCost(tower) {
    return tower.level >= 5 ? null : Math.round(tower.hero.cost * 0.75 * Math.pow(1.55, tower.level - 1));
  }

  placeTower(hero, padId) {
    if (!playable(this.state)) return failure('A fase já terminou.');
    const pad = MAP.pads.find(item => item.id === padId);
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
    const refund = Math.floor(tower.spent * 0.7);
    this.state.qi += refund;
    this._emit('sold', { tower, refund });
    return success({ refund });
  }

  setSpeed(speed) {
    if (speed !== 1 && speed !== 2) return failure('Velocidade inválida.');
    this.state.speed = speed;
    return success();
  }

  startWave() {
    if (this.state.status !== 'preparing' || this.state.wave >= this.state.totalWaves) {
      return failure('Aguarde a conclusão da onda atual.');
    }
    this.state.wave++;
    const wave = this.state.wave;
    const count = 5 + wave * 2;
    const stageScale = 1 + (this.state.stage - 1) * 0.23;
    this._spawnQueue = Array.from({ length: count }, (_, index) => {
      const kind = wave === 5 && index === count - 1 ? 'boss'
        : wave >= 3 && index % 5 === 3 ? 'brute'
        : wave >= 2 && index % 4 === 2 ? 'fast' : 'normal';
      const baseHp = (23 + wave * 8) * stageScale;
      return {
        kind,
        hp: Math.round(baseHp * (kind === 'boss' ? 4.8 : kind === 'brute' ? 1.9 : kind === 'fast' ? 0.7 : 1)),
        speed: (kind === 'boss' ? 40 : kind === 'fast' ? 88 : kind === 'brute' ? 43 : 57) + wave * 1.5,
        reward: kind === 'boss' ? 70 : kind === 'brute' ? 20 : 12,
      };
    });
    this.state.spawned = 0;
    this.state.waveEnemyCount = count;
    this._spawnTimer = 0;
    this.state.status = 'running';
    this._emit('waveStart', { wave, count });
    return success();
  }

  update(dtSeconds) {
    if (this.state.status !== 'running' || !Number.isFinite(dtSeconds) || dtSeconds <= 0) return;
    // Tiny simulation steps keep targeting and movement consistent at any frame rate.
    let remaining = Math.min(dtSeconds, 1) * this.state.speed;
    while (remaining > 0.000001 && this.state.status === 'running') {
      const step = Math.min(remaining, 1 / 30);
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
        x: path[0].x, y: path[0].y, progress: 0, slowRemaining: 0,
      });
      state.spawned++;
      this._spawnTimer += state.wave === 5 ? 0.85 : 1.05;
    }
    for (const enemy of state.enemies) {
      enemy.slowRemaining = Math.max(0, enemy.slowRemaining - dt);
      enemy.progress += enemy.speed * dt * (enemy.slowRemaining > 0 ? 0.65 : 1);
      Object.assign(enemy, pointOnPath(enemy.progress));
    }
    const escaped = state.enemies.filter(enemy => enemy.progress >= MAP.pathLength);
    for (const enemy of escaped) {
      state.lives = Math.max(0, state.lives - (enemy.kind === 'boss' ? 5 : 1));
      this._emit('escaped', { enemy });
    }
    state.enemies = state.enemies.filter(enemy => enemy.progress < MAP.pathLength);
    if (state.lives <= 0) {
      state.status = 'defeat';
      this._emit('defeat', { stage: state.stage, wave: state.wave });
      return;
    }

    for (const tower of state.towers) {
      tower.cooldown = Math.max(0, tower.cooldown - dt);
      if (tower.cooldown > 0) continue;
      const target = state.enemies.filter(enemy => enemy.hp > 0 &&
        Math.hypot(enemy.x - tower.x, enemy.y - tower.y) <= tower.range)
        .sort((a, b) => b.progress - a.progress)[0];
      if (!target) continue;
      tower.cooldown = 1 / tower.attackSpeed;
      const projectile = {
        id: `projectile-${this._nextId++}`, x: tower.x, y: tower.y,
        fromX: tower.x, fromY: tower.y, targetX: target.x, targetY: target.y,
        targetId: target.id, color: tower.hero.color || '#9bd4b6',
        lifetime: 0.22, maxLifetime: 0.22,
      };
      state.projectiles.push(projectile);
      target.hp -= tower.damage;
      if (['ice', 'gelo', 'frost'].includes(String(tower.hero.element).toLowerCase())) target.slowRemaining = 1.5;
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
      this._emit('waveComplete', { wave: state.wave, kills: state.kills });
      if (state.status === 'victory') this._emit('victory', { stage: state.stage, kills: state.kills });
    }
  }
}
