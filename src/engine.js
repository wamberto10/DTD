/** Deterministic, frame-rate-independent tower defense simulation. No DOM access. */
import { DEFAULT_MAP, mapForStage, pointOnPath } from './maps.js';
import { STAGES } from './data.js';

export const MAP = DEFAULT_MAP;
export { mapForStage, pointOnPath };

/**
 * Every combat number in one place. The game reads them here, and scripts/exportar-unity.mjs
 * exports them as-is so the Unity version plays exactly the same.
 */
export const BALANCE = Object.freeze({
  startLives: 20,
  // No hero may cost more than this: a squad of only dearer heroes could not place a tower before the first wave.
  startQi: 180,
  wavesPerStage: 5,
  // Enemy health grows 18% per stage. With one platform per hero and baseHp/hpPerWave below, the Faxineiro alone
  // (one tower) wins the first stages, the first recruits carry the player to stage 6, and a typical collection keeps
  // a comfortable margin early and a tight one at the end of each world, stages 12 and 24 (see docs/BALANCEAMENTO.md).
  stageStep: 0.18,
  // After the player starts the first wave, each next wave starts by itself after this break (real seconds).
  waveBreakSeconds: 5,
  // Enemies come in at the edge of the map. Towers can only hit them after they walk this far along the road
  // (battle units, about 0.7 s for a normal enemy), so none is killed before the player sees it.
  enemyEntry: 40,
  simulationStep: 1 / 30,
  maxFrameSeconds: 1,
  speeds: [1, 2],
  waves: Object.freeze({
    baseCount: 5, countPerWave: 2,
    baseHp: 52, hpPerWave: 19, speedPerWave: 1.5,
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
  // What each element adds to a hit. Burn and poison hurt in ticks of dotTick seconds, so health stays whole.
  elements: Object.freeze({
    // Every critEvery-th hit of a tower is a critical hit.
    physical: Object.freeze({ critEvery: 4, critMultiplier: 2 }),
    // Burns for burnFraction of the hit per second, during burnSeconds (a new burn refreshes it).
    fire: Object.freeze({ burnFraction: 0.3, burnSeconds: 2 }),
    // The hit jumps to the nearest enemies around the target.
    lightning: Object.freeze({ chains: 2, chainRange: 90, chainFraction: 0.5 }),
    // Poison stacks up to maxStacks times; each stack hurts poisonFraction of the hit per second.
    nature: Object.freeze({ poisonFraction: 0.12, poisonSeconds: 4, maxStacks: 3 }),
    ice: Object.freeze({ slowSeconds: 1.5, slowFactor: 0.65 }),
    // Void pierces armor and shields (see traits).
    void: Object.freeze({ pierce: true }),
  }),
  dotTick: 0.5,
  // What enemies can do (which ones, stage by stage: src/data.js).
  traits: Object.freeze({
    // Direct hits lose this share; burn, poison and void ignore armor.
    armor: Object.freeze({ reduction: 0.35 }),
    // An extra layer of this share of the enemy's health, lost before the health; void ignores it.
    shield: Object.freeze({ fraction: 0.4 }),
    // Every few seconds, heals the enemies around (itself included) by a share of their health.
    healer: Object.freeze({ every: 3, fraction: 0.08, radius: 90 }),
    // Every few seconds, calls weak minions just behind it on the road.
    summoner: Object.freeze({ every: 6, count: 2, hpFraction: 0.25, spacing: 18, reward: 4 }),
    // Below this share of its health, it speeds up.
    enrage: Object.freeze({ below: 0.5, speed: 1.4 }),
  }),
  projectileSeconds: 0.22,
  // Challenge mode (after three stars in a stage): tougher enemies and fewer lives.
  challenge: Object.freeze({ hpMultiplier: 1.6, lives: 10 }),
});

/** Permanent bonuses from talents (all zero for a new player). skillRate charges skills faster (0.1 = 10%). */
export const NO_MODIFIERS = Object.freeze({ startQi: 0, lives: 0, damage: 0, skillRate: 0, upgradeDiscount: 0 });

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
  /** mode: 'normal' or 'challenge'; modifiers: talent bonuses (NO_MODIFIERS by default). */
  constructor({ stage = 1, heroes = [], onEvent = () => {}, mode = 'normal', modifiers = NO_MODIFIERS } = {}) {
    this.onEvent = onEvent;
    this.restart(stage, heroes, { mode, modifiers });
  }

  restart(stage = this.state?.stage || 1, heroes = this.heroes || [], { mode = this.mode || 'normal', modifiers = this.modifiers || NO_MODIFIERS } = {}) {
    this.heroes = heroes;
    this.mode = mode === 'challenge' ? 'challenge' : 'normal';
    this.modifiers = { ...NO_MODIFIERS, ...modifiers };
    const stageNumber = Math.max(1, Math.floor(Number(stage) || 1));
    this.map = mapForStage(stageNumber);
    this.state = {
      status: 'preparing', stage: stageNumber, mode: this.mode,
      wave: 0, totalWaves: BALANCE.wavesPerStage,
      lives: (this.mode === 'challenge' ? BALANCE.challenge.lives : BALANCE.startLives) + this.modifiers.lives,
      // Lives at the start, used for the stage stars.
      maxLives: (this.mode === 'challenge' ? BALANCE.challenge.lives : BALANCE.startLives) + this.modifiers.lives,
      qi: BALANCE.startQi + this.modifiers.startQi,
      towers: [], enemies: [], projectiles: [], kills: 0, speed: 1,
      spawned: 0, waveEnemyCount: 0,
      // Counters for the daily missions.
      skillsCast: 0, upgrades: 0, bossKills: 0,
      // Seconds until the next wave starts by itself; null while it waits for the player.
      nextWaveIn: null,
      // Blessing skills: every tower attacks faster for a while.
      buffRemaining: 0, buffAttackSpeed: 0,
      // Damage dealt and enemies defeated by each hero in this match (kept after a tower is dismissed).
      heroStats: {},
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
      damage: Math.round(tower.hero.damage * (1 + (level - 1) * t.damagePerLevel) * (1 + this.modifiers.damage)),
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
    return tower.level >= t.maxLevel ? null
      : Math.round(tower.hero.cost * t.upgradeCostFactor * Math.pow(t.upgradeCostGrowth, tower.level - 1) * (1 - this.modifiers.upgradeDiscount));
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
    // Each hero defends a single platform per stage; selling the tower frees the hero again.
    if (this.state.towers.some(tower => tower.hero.id === hero.id)) {
      return failure(`${hero.name || 'Este herói'} já está em campo. Cada herói defende uma plataforma por fase.`);
    }
    if (this.state.qi < hero.cost) return failure('Qi insuficiente para invocar este herói.');
    const tower = {
      id: `tower-${this._nextId++}`, hero, padId, x: pad.x, y: pad.y,
      level: 1, cooldown: 0, spent: hero.cost, hits: 0,
      // Skill charge in seconds; the skill is ready at hero.skill.cooldown.
      skillCharge: 0,
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
    this.state.upgrades++;
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

  /** True when this tower's skill is charged. */
  skillReady(tower) {
    return Boolean(tower?.hero.skill) && tower.skillCharge >= tower.hero.skill.cooldown;
  }

  /** The player casts a tower's skill (see hero.skill in src/data.js). */
  useSkill(towerId) {
    if (this.state.status !== 'running') return failure('As habilidades só podem ser usadas durante uma onda.');
    const tower = this.state.towers.find(item => item.id === towerId);
    if (!tower) return failure('Selecione uma torre.');
    const skill = tower.hero.skill;
    if (!skill) return failure('Este herói não tem habilidade.');
    if (!this.skillReady(tower)) return failure(`${skill.name} ainda está carregando.`);
    if (!this._castSkill(tower, skill)) return failure('Nenhum inimigo ao alcance da habilidade.');
    tower.skillCharge = 0;
    this.state.skillsCast++;
    this.state.enemies = this.state.enemies.filter(enemy => enemy.hp > 0);
    this._emit('skill', { tower, skill });
    return success({ tower });
  }

  /** What each kind of skill does. Returns false when there was nobody to hit (the charge is kept). */
  _castSkill(tower, skill) {
    const targets = this.state.enemies
      .filter(enemy => enemy.hp > 0 && enemy.progress >= BALANCE.enemyEntry &&
        (skill.global || Math.hypot(enemy.x - tower.x, enemy.y - tower.y) <= tower.range))
      .sort((a, b) => b.progress - a.progress);
    const damage = Math.round(tower.damage * (skill.multiplier || 0));
    if (skill.kind === 'bencao') {
      this.state.buffRemaining = Math.max(this.state.buffRemaining, skill.seconds);
      this.state.buffAttackSpeed = Math.max(this.state.buffAttackSpeed, skill.attackSpeed);
      this._emit('splash', { x: tower.x, y: tower.y, radius: tower.range, tower });
      return true;
    }
    if (!targets.length) return false;
    if (skill.kind === 'golpe') {
      this._shot(tower, tower, targets[0], true);
      this._hit(targets[0], damage, tower, false);
    } else if (skill.kind === 'tempestade') {
      for (const enemy of targets.slice(0, skill.targets)) {
        this._shot(tower, tower, enemy, true);
        this._hit(enemy, damage, tower, false);
      }
    } else if (skill.kind === 'explosao') {
      const center = targets[0], x = center.x, y = center.y;
      for (const enemy of [...this.state.enemies]) {
        if (enemy.hp > 0 && enemy.progress >= BALANCE.enemyEntry && Math.hypot(enemy.x - x, enemy.y - y) <= skill.radius) this._hit(enemy, damage, tower, false);
      }
      this._emit('splash', { x, y, radius: skill.radius, tower });
    } else if (skill.kind === 'chuva') {
      for (const enemy of targets) this._hit(enemy, damage, tower, false);
      if (skill.burn) for (const enemy of targets) if (enemy.hp > 0) this._afflict(enemy, tower);
      for (const enemy of targets) this._emit('splash', { x: enemy.x, y: enemy.y, radius: 26, tower });
    } else if (skill.kind === 'congelar') {
      for (const enemy of targets) enemy.freezeRemaining = Math.max(enemy.freezeRemaining, skill.seconds);
      for (const enemy of targets) this._emit('splash', { x: enemy.x, y: enemy.y, radius: 22, tower });
    } else return false;
    return true;
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
    const stageScale = stageDifficulty(this.state.stage) * (this.mode === 'challenge' ? BALANCE.challenge.hpMultiplier : 1);
    const traits = STAGES.find(item => item.id === this.state.stage)?.traits || {};
    this._spawnQueue = Array.from({ length: count }, (_, index) => {
      const kind = enemyKind(wave, index, count);
      const rules = BALANCE.enemies[kind];
      const baseHp = (w.baseHp + wave * w.hpPerWave) * stageScale;
      return { kind, hp: Math.round(baseHp * rules.hp), speed: rules.speed + wave * w.speedPerWave, reward: rules.reward, traits: traits[kind] || [] };
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

  /** A new enemy on the road, from a spawn blueprint. */
  _newEnemy(blueprint, progress = 0) {
    const point = pointOnPath(progress, this.map);
    const traits = blueprint.traits || [];
    const shield = traits.includes('shield') ? Math.round(blueprint.hp * BALANCE.traits.shield.fraction) : 0;
    return {
      id: `enemy-${this._nextId++}`, ...blueprint, traits, maxHp: blueprint.hp,
      x: point.x, y: point.y, progress, slowRemaining: 0, freezeRemaining: 0, facing: 1,
      // Burn and poison (elements).
      dotTimer: 0, burnDamage: 0, burnRemaining: 0, burnSource: null,
      poisonDamage: 0, poisonStacks: 0, poisonRemaining: 0, poisonSource: null,
      // Traits (BALANCE.traits).
      armor: traits.includes('armor'), flying: traits.includes('flying'), healer: traits.includes('healer'),
      summoner: traits.includes('summoner'), enrage: traits.includes('enrage'), enraged: false,
      shield, maxShield: shield, healTimer: 0, summonTimer: 0,
    };
  }

  /** Healers heal, summoners call minions, enraged enemies speed up. */
  _abilities(enemy, dt) {
    const t = BALANCE.traits;
    if (enemy.hp <= 0) return;
    if (enemy.healer) {
      enemy.healTimer += dt;
      if (enemy.healTimer >= t.healer.every) {
        enemy.healTimer -= t.healer.every;
        for (const other of this.state.enemies) {
          if (other.hp <= 0 || other.hp >= other.maxHp || Math.hypot(other.x - enemy.x, other.y - enemy.y) > t.healer.radius) continue;
          other.hp = Math.min(other.maxHp, other.hp + Math.round(other.maxHp * t.healer.fraction));
        }
        this._emit('heal', { enemy, x: enemy.x, y: enemy.y, radius: t.healer.radius });
      }
    }
    if (enemy.summoner) {
      enemy.summonTimer += dt;
      if (enemy.summonTimer >= t.summoner.every) {
        enemy.summonTimer -= t.summoner.every;
        const speed = BALANCE.enemies.normal.speed + this.state.wave * BALANCE.waves.speedPerWave;
        for (let i = 1; i <= t.summoner.count; i++) {
          const hp = Math.round(enemy.maxHp * t.summoner.hpFraction);
          this.state.enemies.push(this._newEnemy({ kind: 'normal', hp, speed, reward: t.summoner.reward, traits: [] },
            Math.max(0, enemy.progress - i * t.summoner.spacing)));
        }
        this._emit('summon', { enemy, x: enemy.x, y: enemy.y, radius: 40 });
      }
    }
    if (enemy.enrage && !enemy.enraged && enemy.hp <= enemy.maxHp * t.enrage.below) {
      enemy.enraged = true;
      enemy.speed *= t.enrage.speed;
      this._emit('enrage', { enemy });
    }
  }

  _step(dt) {
    const state = this.state;
    this._spawnTimer -= dt;
    if (this._spawnQueue.length && this._spawnTimer <= 0) {
      state.enemies.push(this._newEnemy(this._spawnQueue.shift()));
      state.spawned++;
      this._spawnTimer += state.wave === state.totalWaves ? BALANCE.waves.finalWaveSpawnInterval : BALANCE.waves.spawnInterval;
    }
    for (const enemy of state.enemies) {
      enemy.slowRemaining = Math.max(0, enemy.slowRemaining - dt);
      // Frozen enemies (skills) stand still; slowed ones (ice) walk slower.
      const frozen = enemy.freezeRemaining > 0;
      enemy.freezeRemaining = Math.max(0, enemy.freezeRemaining - dt);
      enemy.progress += enemy.speed * dt * (frozen ? 0 : enemy.slowRemaining > 0 ? BALANCE.elements.ice.slowFactor : 1);
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

    // Burn and poison tick, then the enemies use their abilities, before the towers shoot.
    for (const enemy of state.enemies) this._tickAfflictions(enemy, dt);
    for (const enemy of [...state.enemies]) this._abilities(enemy, dt);

    state.buffRemaining = Math.max(0, state.buffRemaining - dt);
    if (state.buffRemaining === 0) state.buffAttackSpeed = 0;
    for (const tower of state.towers) {
      // Skills charge only during waves (talents make them charge faster).
      if (tower.hero.skill) tower.skillCharge = Math.min(tower.hero.skill.cooldown, tower.skillCharge + dt * (1 + this.modifiers.skillRate));
      tower.cooldown = Math.max(0, tower.cooldown - dt);
      if (tower.cooldown > 0) continue;
      const target = this._target(tower);
      if (!target) continue;
      tower.cooldown = 1 / (tower.attackSpeed * (1 + state.buffAttackSpeed));
      tower.hits = (tower.hits || 0) + 1;
      this._attack(tower, target);
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

  /** The enemy furthest along the road within the tower's range, once it has come into the map (first wins a tie). */
  _target(tower) {
    let target = null;
    for (const enemy of this.state.enemies) {
      if (enemy.hp <= 0 || enemy.progress < BALANCE.enemyEntry || Math.hypot(enemy.x - tower.x, enemy.y - tower.y) > tower.range) continue;
      if (!target || enemy.progress > target.progress) target = enemy;
    }
    return target;
  }

  /** A projectile drawn from one point to an enemy. Visual only: the damage lands at once. */
  _shot(tower, from, to, strong = false) {
    this.state.projectiles.push({
      id: `projectile-${this._nextId++}`, x: from.x, y: from.y,
      fromX: from.x, fromY: from.y, targetX: to.x, targetY: to.y,
      targetId: to.id, color: tower.hero.color || '#9bd4b6', element: tower.hero.element || 'physical', strong,
      lifetime: BALANCE.projectileSeconds, maxLifetime: BALANCE.projectileSeconds,
    });
  }

  /** A tower's regular attack: the hit, then what its element adds. */
  _attack(tower, target) {
    const elements = BALANCE.elements;
    const element = tower.hero.element;
    const crit = element === 'physical' && tower.hits % elements.physical.critEvery === 0;
    const damage = crit ? Math.round(tower.damage * elements.physical.critMultiplier) : tower.damage;
    this._emit('attack', { tower, target });
    this._shot(tower, tower, target, crit);
    this._hit(target, damage, tower, false, crit);
    if (target.hp > 0) this._afflict(target, tower);
    // Area heroes also hurt the enemies around the target (flying enemies are out of reach of the blast).
    const splash = tower.hero.splash;
    if (splash) {
      for (const enemy of this.state.enemies) {
        if (enemy === target || enemy.hp <= 0 || enemy.flying || enemy.progress < BALANCE.enemyEntry) continue;
        if (Math.hypot(enemy.x - target.x, enemy.y - target.y) <= splash.radius) this._hit(enemy, Math.round(damage * splash.fraction), tower, false);
      }
      this._emit('splash', { x: target.x, y: target.y, radius: splash.radius, tower });
    }
    if (element === 'lightning') {
      const near = this.state.enemies
        .filter(enemy => enemy !== target && enemy.hp > 0 && enemy.progress >= BALANCE.enemyEntry &&
          Math.hypot(enemy.x - target.x, enemy.y - target.y) <= elements.lightning.chainRange)
        .map(enemy => ({ enemy, distance: Math.hypot(enemy.x - target.x, enemy.y - target.y) }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, elements.lightning.chains);
      for (const { enemy } of near) {
        this._shot(tower, target, enemy, false);
        this._hit(enemy, Math.round(tower.damage * elements.lightning.chainFraction), tower, false);
      }
    }
  }

  /** Burn (fire), poison (nature) or slow (ice) on an enemy just hit. */
  _afflict(enemy, tower) {
    const elements = BALANCE.elements;
    if (tower.hero.element === 'ice' && !enemy.flying) enemy.slowRemaining = elements.ice.slowSeconds;
    if (tower.hero.element === 'fire') {
      enemy.burnDamage = Math.max(enemy.burnDamage, Math.round(tower.damage * elements.fire.burnFraction * BALANCE.dotTick));
      enemy.burnRemaining = elements.fire.burnSeconds;
      enemy.burnSource = tower;
    }
    if (tower.hero.element === 'nature') {
      enemy.poisonStacks = Math.min(elements.nature.maxStacks, enemy.poisonStacks + 1);
      enemy.poisonDamage = Math.max(enemy.poisonDamage, Math.round(tower.damage * elements.nature.poisonFraction * BALANCE.dotTick));
      enemy.poisonRemaining = elements.nature.poisonSeconds;
      enemy.poisonSource = tower;
    }
  }

  /** Burn and poison hurt every dotTick seconds while they last. */
  _tickAfflictions(enemy, dt) {
    if (enemy.burnRemaining <= 0 && enemy.poisonRemaining <= 0) { enemy.dotTimer = 0; return; }
    enemy.dotTimer += dt;
    while (enemy.dotTimer >= BALANCE.dotTick && enemy.hp > 0) {
      enemy.dotTimer -= BALANCE.dotTick;
      if (enemy.burnRemaining > 0) this._hit(enemy, enemy.burnDamage, enemy.burnSource, true);
      if (enemy.poisonRemaining > 0) this._hit(enemy, enemy.poisonDamage * enemy.poisonStacks, enemy.poisonSource, true);
    }
    enemy.burnRemaining = Math.max(0, enemy.burnRemaining - dt);
    enemy.poisonRemaining = Math.max(0, enemy.poisonRemaining - dt);
    if (enemy.burnRemaining === 0) enemy.burnDamage = 0;
    if (enemy.poisonRemaining === 0) { enemy.poisonStacks = 0; enemy.poisonDamage = 0; }
  }

  /** Every bit of damage goes through here. Returns the damage taken from the enemy's health. */
  _hit(enemy, amount, tower, overTime, crit = false) {
    if (enemy.hp <= 0 || amount <= 0) return 0;
    let absorbed = 0;
    // Void pierces armor and shields; burn and poison are not stopped by armor.
    if (!(tower && tower.hero.element === 'void')) {
      if (enemy.armor && !overTime) amount = Math.round(amount * (1 - BALANCE.traits.armor.reduction));
      if (enemy.shield > 0) {
        absorbed = Math.min(enemy.shield, amount);
        enemy.shield -= absorbed;
        amount -= absorbed;
      }
    }
    // What the hit really took (shield plus health, without the overkill), for the match summary.
    const dealt = absorbed + Math.max(0, Math.min(amount, enemy.hp));
    if (dealt > 0) {
      if (tower) this._credit(tower, dealt, 0);
      this._emit('damage', { enemy, amount: absorbed + Math.max(0, amount), tower, crit, overTime, shielded: amount <= 0 });
    }
    if (amount <= 0) return 0;
    enemy.hp -= amount;
    if (enemy.hp <= 0) {
      this.state.qi += enemy.reward;
      this.state.kills++;
      if (enemy.kind === 'boss') this.state.bossKills++;
      if (tower) this._credit(tower, 0, 1);
      this._emit('kill', { enemy, tower, reward: enemy.reward });
    }
    return amount;
  }

  /** Adds damage and kills to the hero's line of the match summary. */
  _credit(tower, damage, kills) {
    const stats = this.state.heroStats[tower.hero.id] ??= { damage: 0, kills: 0 };
    stats.damage += damage;
    stats.kills += kills;
  }
}
