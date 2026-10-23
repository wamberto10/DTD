/** Cut-out animation uses travelled distance, so slowing, pausing and 2× speed stay in step. */
import { ENEMY_RIGS } from './enemy-rigs-manifest.js';
import { artUrl } from './chibi-art.js';
import { stageKey } from './maps.js';

const TAU = Math.PI * 2;
const BODIES = {
  humanoide: {
    order: ['cabelo-tras', 'braco-tras', 'perna-tras', 'perna-frente', 'tronco', 'saia', 'cabeca', 'arma', 'braco-frente'],
    required: ['braco-tras', 'perna-tras', 'perna-frente', 'tronco', 'cabeca', 'braco-frente'],
    legPrefix: 'perna-', legSwing: 22,
  },
  quadrupede: {
    order: ['cauda', 'pata-tras-longe', 'pata-frente-longe', 'corpo', 'pata-tras-perto', 'pata-frente-perto', 'cabeca'],
    required: ['pata-tras-longe', 'pata-frente-longe', 'corpo', 'pata-tras-perto', 'pata-frente-perto', 'cabeca'],
    legPrefix: 'pata-', legSwing: 20,
  },
};
const unavailable = new Set();
const keyForStage = stage => /^f\d{2,}$/.test(String(stage)) ? stage : stageKey(stage);
const number = value => Number.isFinite(value);
const fixed = value => Number(value.toFixed(4));
const escape = value => String(value).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

/** Reject partial or malformed exports instead of drawing an invisible or disassembled enemy. */
export function isEnemyRig(rig) {
  const body = rig && Object.hasOwn(BODIES, rig.body) ? BODIES[rig.body] : null;
  if (!body || rig.size !== 1024 ||
      !number(rig.center) || !number(rig.feet) || !number(rig.top) ||
      rig.center < 0 || rig.center > rig.size || rig.top < 0 || rig.feet <= rig.top || rig.feet > rig.size ||
      !number(rig.stride) || rig.stride <= 0 || !Array.isArray(rig.parts)) return false;
  if (rig.parts.some(part => !part || typeof part !== 'object')) return false;
  const names = rig.parts.map(part => part?.name);
  if (new Set(names).size !== names.length || !body.required.every(name => names.includes(name))) return false;
  let previous = -1;
  for (const part of rig.parts) {
    const order = body.order.indexOf(part.name);
    if (order < 0 || order <= previous || !['x', 'y', 'w', 'h', 'pivotX', 'pivotY'].every(key => number(part[key])) ||
        part.w <= 0 || part.h <= 0 || part.x < 0 || part.y < 0 || part.x + part.w > rig.size || part.y + part.h > rig.size ||
        part.pivotX < 0 || part.pivotX > rig.size || part.pivotY < 0 || part.pivotY > rig.size ||
        typeof part.file !== 'string' || !part.file.startsWith('arte/') ||
        (part.parent && !(rig.body === 'humanoide' && part.name === 'arma' && part.parent === 'braco-frente'))) return false;
    if (part.name === 'arma' && part.parent !== 'braco-frente') return false;
    previous = order;
  }
  return true;
}

export function enemyRig(stage, kind, manifest = ENEMY_RIGS) {
  const key = keyForStage(stage);
  if (unavailable.has(`${key}:${kind}`)) return null;
  return Array.isArray(manifest?.rigs) ? manifest.rigs.find(rig => rig?.stage === key && rig.kind === kind && isEnemyRig(rig)) || null : null;
}

// A broken external image must restore the complete painted/pixel fallback on the next render.
export function disableEnemyRig(stage, kind) {
  unavailable.add(`${keyForStage(stage)}:${kind}`);
}

export function enemyRigPose(enemy, rig) {
  const body = BODIES[rig.body];
  const distance = number(enemy.progress) ? enemy.progress : 0;
  const phase = ((distance % rig.stride) / rig.stride) * TAU;
  const swing = Math.sin(phase);
  const angles = rig.body === 'quadrupede' ? {
    cauda: 8 * Math.sin(phase - 1),
    'pata-tras-longe': -20 * swing,
    'pata-frente-longe': 20 * swing,
    corpo: 1.5 * Math.sin(2 * phase),
    'pata-tras-perto': 20 * swing,
    'pata-frente-perto': -20 * swing,
    cabeca: 3 * Math.sin(2 * phase + .8),
  } : {
    'braco-tras': -18 * swing,
    'perna-tras': 22 * swing,
    'perna-frente': -22 * swing,
    tronco: 1.5 * Math.sin(2 * phase),
    saia: 2.5 * Math.sin(2 * phase + .6),
    cabeca: 2 * Math.sin(2 * phase + .8),
    'cabelo-tras': 5 * Math.sin(2 * phase - 1.2),
    'braco-frente': 18 * swing,
    arma: 0,
  };
  const legs = rig.parts.filter(part => part.name.startsWith(body.legPrefix));
  const legLength = rig.feet - legs.reduce((sum, part) => sum + part.pivotY, 0) / legs.length;
  return { phase, drop: legLength * (1 - Math.cos(body.legSwing * swing * Math.PI / 180)), angles };
}

/** Coordinates and pivots remain in source-canvas units; only the root gets scaled or mirrored. */
export function renderRigEnemy(enemy, rig, height = 50, showHealth = true) {
  const pose = enemyRigPose(enemy, rig);
  const x = Math.round(enemy.x), feet = Math.round(enemy.y + 12);
  const scale = height / (rig.feet - rig.top);
  const direction = enemy.facing < 0 ? -1 : 1;
  const byName = new Map(rig.parts.map(part => [part.name, part]));
  const rotation = part => `rotate(${fixed(pose.angles[part.name] || 0)} ${part.pivotX} ${part.pivotY})`;
  const pieces = rig.parts.map(part => {
    const parent = byName.get(part.parent);
    const image = `<g data-part="${part.name}" transform="${rotation(part)}"><image class="enemy-rig-piece" data-stage="${escape(rig.stage)}" data-kind="${escape(enemy.kind)}" href="${escape(artUrl(part.file))}" x="${part.x}" y="${part.y}" width="${part.w}" height="${part.h}"/></g>`;
    // Repeating the parent's transform preserves global layer order: weapon below the front hand.
    return parent ? `<g data-parent="${parent.name}" transform="${rotation(parent)}">${image}</g>` : image;
  }).join('');
  const barWidth = enemy.kind === 'boss' ? 64 : 32;
  const health = Math.max(0, Math.min(barWidth, barWidth * enemy.hp / enemy.maxHp));
  const top = feet - height;
  const aura = enemy.kind === 'boss' ? `<ellipse class="enemy-boss-aura" cx="${x}" cy="${fixed(top + height * .52)}" rx="${fixed(height * .34)}" ry="${fixed(height * .54)}" fill="#8fcdb7" fill-opacity=".07" stroke="#9dd3c3" stroke-opacity=".18" stroke-width="1.5" pointer-events="none"/>` : '';
  return `<g class="enemy rigged-enemy" data-kind="${escape(enemy.kind)}" data-rig="${escape(rig.stage)}">
    <ellipse cx="${x}" cy="${feet - 2}" rx="${Math.round(height * .24)}" ry="4" fill="#081210" opacity=".38"/>
    ${aura}
    <g transform="translate(${x} ${feet}) scale(${fixed(direction * scale)} ${fixed(scale)}) translate(${-rig.center} ${-rig.feet})"><g transform="translate(0 ${fixed(pose.drop)})">${pieces}</g></g>
    ${showHealth ? `<rect x="${x - barWidth / 2 - 1}" y="${top - 9}" width="${barWidth + 2}" height="5" fill="#1b2631"/><rect x="${x - barWidth / 2}" y="${top - 8}" width="${fixed(health)}" height="3" fill="${enemy.kind === 'boss' ? '#e7a18a' : '#c4d48d'}"/>` : ''}
  </g>`;
}

export const ENEMY_DEATH_SECONDS = .6;
const HIT_SECONDS = .18;
export const emptyEnemyEffects = () => ({ time: 0, health: {}, hits: {}, deaths: [] });

/** A new visual snapshot, independent of the combat objects and their balance. elapsed is game seconds. */
export function advanceEnemyEffects(previous, enemies, elapsed, killed = []) {
  const time = previous.time + (number(elapsed) ? Math.max(0, elapsed) : 0);
  const health = {}, hits = {};
  for (const enemy of enemies) {
    health[enemy.id] = enemy.hp;
    if (enemy.hp < (previous.health[enemy.id] ?? enemy.maxHp)) hits[enemy.id] = time + HIT_SECONDS;
    else if (previous.hits[enemy.id] > time) hits[enemy.id] = previous.hits[enemy.id];
  }
  const deaths = previous.deaths.filter(death => time - death.startedAt < ENEMY_DEATH_SECONDS);
  for (const enemy of killed) deaths.push({ enemy: { ...enemy }, startedAt: time });
  return { time, health, hits, deaths };
}

export function enemyHitEffect(effects, enemy) {
  const remaining = effects.hits[enemy.id] - effects.time;
  return remaining > 0 && Math.floor((HIT_SECONDS - remaining + 1e-9) / .045) % 2 === 0;
}

export function enemyDeathProgress(effects, death) {
  return Math.max(0, Math.min(1, (effects.time - death.startedAt) / ENEMY_DEATH_SECONDS));
}
