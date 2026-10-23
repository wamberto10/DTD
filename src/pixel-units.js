// Small sprites use a two-pixel grid so movement never blurs their contours.
import { enemyArt } from './chibi-art.js';
import { enemyRig, renderRigEnemy } from './enemy-rig.js';

const rect = (x, y, width, height, fill, extra = '') =>
  `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${fill}" ${extra}/>`;

// On-map height of each painted enemy kind, in battle units.
const ART_HEIGHT = { normal: 50, fast: 46, brute: 62, boss: 92 };

function renderPaintedEnemy(enemy, art, showHealth) {
  const height = ART_HEIGHT[enemy.kind] || ART_HEIGHT.normal;
  const width = Math.round(height * art.w / art.h);
  const x = Math.round(enemy.x), feet = Math.round(enemy.y + 12), top = feet - height;
  // The pictures look right; mirror them around their own centre when walking left.
  const flip = enemy.facing < 0 ? ` transform="translate(${2 * x},0) scale(-1,1)"` : '';
  const barWidth = Math.max(28, Math.min(width - 8, enemy.kind === 'boss' ? 84 : 48));
  const health = Math.max(0, Math.round(barWidth * enemy.hp / enemy.maxHp));
  const barX = x - Math.round(barWidth / 2);
  return `<g class="enemy painted-enemy" data-kind="${enemy.kind}">
    <ellipse cx="${x}" cy="${feet - 2}" rx="${Math.round(width * 0.3)}" ry="5" fill="#081210" opacity=".38"/>
    <image href="${art.url}" x="${x - Math.round(width / 2)}" y="${top}" width="${width}" height="${height}"${flip}/>
    ${showHealth ? rect(barX - 1, top - 9, barWidth + 2, 5, '#1b2631') + rect(barX, top - 8, health, 3, enemy.kind === 'boss' ? '#e7a18a' : '#c4d48d') : ''}
  </g>`;
}

function renderPixelEnemy(enemy, showHealth) {
  const boss = enemy.kind === 'boss';
  const brute = enemy.kind === 'brute';
  const fast = enemy.kind === 'fast';
  const width = boss ? 20 : brute ? 16 : 12;
  const height = boss ? 24 : brute ? 18 : 15;
  let sprite;
  if (boss) {
    sprite = `<path d="M2 1H5V4H7V3H13V4H15V1H18V7H20V15H18V21H15V24H11V21H9V24H5V21H2V15H0V7H2Z" fill="#251e36"/>
      <path d="M3 2H5V7H3ZM15 2H17V7H15Z" fill="#deb8a0"/>
      <path d="M4 6H7V5H13V6H16V9H18V16H16V20H13V23H11V19H9V23H7V20H4V16H2V9H4Z" fill="#634059"/>
      <path d="M4 7H7V6H13V7H16V10H4Z" fill="#976073"/>
      ${rect(4, 10, 5, 2, '#ffe4a4')}${rect(11, 10, 5, 2, '#ffe4a4')}
      ${rect(5, 10, 2, 3, '#ed805c')}${rect(13, 10, 2, 3, '#ed805c')}
      <path d="M8 14H12V15H13V18H12V19H8V18H7V15H8Z" fill="#f1a767"/>
      ${rect(9, 15, 2, 3, '#ffe4a4')}${rect(1, 12, 3, 5, '#3f304b')}${rect(16, 12, 3, 5, '#3f304b')}`;
  } else if (brute) {
    sprite = `<path d="M4 1H12V3H14V5H16V14H13V18H10V15H6V18H3V14H0V5H2V3H4Z" fill="#202c39"/>
      <path d="M4 3H12V5H14V12H12V15H10V14H6V15H4V12H2V5H4Z" fill="#687b81"/>
      ${rect(4, 3, 8, 2, '#9caaa0')}${rect(2, 6, 3, 6, '#839291')}
      ${rect(5, 7, 6, 4, '#303d4e')}${rect(5, 8, 2, 1, '#ffcf86')}${rect(9, 8, 2, 1, '#ffcf86')}
      ${rect(6, 12, 4, 2, '#454f60')}${rect(0, 9, 3, 4, '#414b60')}${rect(13, 9, 3, 4, '#414b60')}`;
  } else {
    const light = fast ? '#8bb9b4' : '#a58ab7';
    const mid = fast ? '#4b837e' : '#795a91';
    const dark = fast ? '#244a53' : '#493954';
    sprite = `<path d="M1 0H3V2H9V0H11V5H12V11H10V13H9V15H7V13H5V15H3V13H2V11H0V5H1Z" fill="#252839"/>
      <path d="M2 2H4V3H8V2H10V6H11V10H9V12H8V14H7V12H5V14H4V12H3V10H1V6H2Z" fill="${mid}"/>
      ${rect(3, 3, 6, 2, light)}${rect(2, 5, 2, 5, light)}${rect(8, 7, 3, 4, dark)}
      ${rect(3, 6, 2, 2, '#ffdd96')}${rect(7, 6, 2, 2, '#ffdd96')}
      ${rect(5, 10, 2, 1, '#d4bad4')}${fast ? `<path d="M0 8H2V11H0ZM10 8H12V11H10Z" fill="#b7ddd0"/>` : ''}`;
  }
  const barWidth = width * 2;
  const health = Math.max(0, Math.round(barWidth * enemy.hp / enemy.maxHp));
  return `<g class="enemy pixel-enemy" data-kind="${enemy.kind}" transform="translate(${Math.round(enemy.x - width)},${Math.round(enemy.y - height * 2 + 10)})" shape-rendering="crispEdges">
    ${rect(2, height * 2 - 2, barWidth - 4, 4, '#182b2b', 'opacity=".5"')}
    <g transform="scale(2)">${sprite}</g>
    ${showHealth ? rect(-1, -7, barWidth + 2, 5, '#1b2631') + rect(0, -6, health, 3, boss ? '#e7a18a' : '#c4d48d') : ''}
  </g>`;
}

// Colours of each element's shots and effects.
export const ELEMENT_COLORS = { fire: '#ff9a4a', lightning: '#ffe56b', ice: '#9fd8ff', nature: '#8fd16a', void: '#b993ff', physical: '#f1e6c4' };

// Colours of the enemy traits shown on the map.
export const TRAIT_COLORS = { armor: '#a8adb4', enrage: '#ff6b5a', shield: '#7fc4ff', healer: '#8fe3a0', summoner: '#c79bff' };
// Flying enemies are drawn this high above the road.
const FLIGHT_HEIGHT = 16;

/** Shield bar, then small marks above an enemy: armor, rage, burning, poisoned (with stacks), slowed. */
function renderAfflictions(enemy) {
  const marks = [];
  if (enemy.armor) marks.push({ color: TRAIT_COLORS.armor, label: '' });
  if (enemy.enraged) marks.push({ color: TRAIT_COLORS.enrage, label: '' });
  if (enemy.burnRemaining > 0) marks.push({ color: ELEMENT_COLORS.fire, label: '' });
  if (enemy.poisonRemaining > 0) marks.push({ color: ELEMENT_COLORS.nature, label: enemy.poisonStacks > 1 ? String(enemy.poisonStacks) : '' });
  if (enemy.slowRemaining > 0) marks.push({ color: ELEMENT_COLORS.ice, label: '' });
  const height = ART_HEIGHT[enemy.kind] || ART_HEIGHT.normal;
  const top = Math.round(enemy.y + 12 - height - 16);
  const left = Math.round(enemy.x - (marks.length - 1) * 5);
  const shieldWidth = enemy.kind === 'boss' ? 64 : 32;
  const shield = enemy.maxShield > 0 && enemy.shield > 0
    ? `<rect x="${Math.round(enemy.x - shieldWidth / 2)}" y="${top + 3}" width="${(shieldWidth * enemy.shield / enemy.maxShield).toFixed(1)}" height="2.5" fill="${TRAIT_COLORS.shield}"/>` : '';
  if (!marks.length && !shield) return '';
  return `<g class="enemy-afflictions" pointer-events="none">${shield}${marks.map((mark, i) => `<circle cx="${left + i * 10}" cy="${top - 4}" r="4" fill="${mark.color}" stroke="#14201a" stroke-width="1.2"/>${mark.label ? `<text x="${left + i * 10}" y="${top - 1.5}" font-size="6" text-anchor="middle" fill="#14201a" font-weight="700">${mark.label}</text>` : ''}`).join('')}</g>`;
}

export function renderEnemy(enemy, stage, visual = {}) {
  const rig = stage ? enemyRig(stage, enemy.kind) : null;
  const art = !rig && stage ? enemyArt(stage, enemy.kind) : null;
  let markup = rig ? renderRigEnemy(enemy, rig, ART_HEIGHT[enemy.kind] || ART_HEIGHT.normal, !visual.dying)
    : art ? renderPaintedEnemy(enemy, art, !visual.dying) : renderPixelEnemy(enemy, !visual.dying);
  if (!visual.dying) markup += renderAfflictions(enemy);
  // Flying enemies float above the road, with their shadow left on the ground.
  if (enemy.flying) markup = `<ellipse cx="${Math.round(enemy.x)}" cy="${Math.round(enemy.y + 10)}" rx="9" ry="3" fill="#081210" opacity=".3"/><g transform="translate(0 ${-FLIGHT_HEIGHT})">${markup}</g>`;
  if (!visual.dying && !visual.hit) return markup;
  const progress = Math.max(0, Math.min(1, visual.death || 0));
  const opacity = visual.dying ? 1 - progress : .45;
  const rotation = visual.dying ? 82 * Math.sin(progress * Math.PI / 2) * (enemy.facing < 0 ? -1 : 1) : 0;
  const feet = Math.round(enemy.y + 12), x = Math.round(enemy.x);
  return `<g class="enemy-visual ${visual.dying ? 'dying-enemy' : 'hit-enemy'}" opacity="${opacity.toFixed(3)}" transform="translate(${x} ${feet + progress * 5}) rotate(${rotation.toFixed(3)}) translate(${-x} ${-feet})">${markup}</g>`;
}

export function renderProjectile(projectile) {
  const x = Math.round(projectile.x / 2) * 2;
  const y = Math.round(projectile.y / 2) * 2;
  // Element colour (physical keeps the hero's colour); critical hits and skills are drawn bigger.
  const color = projectile.element && projectile.element !== 'physical' ? ELEMENT_COLORS[projectile.element] : projectile.color || '#d8e8a7';
  const size = projectile.strong ? 2 : 1;
  // Lightning draws the arc from where it came from.
  const arc = projectile.element === 'lightning'
    ? `<line x1="${Math.round(projectile.fromX)}" y1="${Math.round(projectile.fromY)}" x2="${x}" y2="${y}" stroke="${color}" stroke-width="1.5" opacity=".7"/>` : '';
  return `<g class="projectile pixel-projectile" shape-rendering="crispEdges">${arc}
    ${rect(x - 5 * size, y - 1, 10 * size, 2, color, 'opacity=".45"')}
    ${rect(x - 1, y - 5 * size, 2, 10 * size, color, 'opacity=".45"')}
    ${rect(x - 3 * size, y - 3 * size, 6 * size, 6 * size, color)}${rect(x - 1, y - 1, 2, 2, '#fff1c9')}
  </g>`;
}

export function renderPad(pad, tower, selectedHeroName, painted = false) {
  if (painted) {
    // The stone platform is already in the painting: only a light marker, so the art stays visible.
    return `<g class="map-pad painted-pad ${tower ? 'occupied' : ''}" data-action="${tower ? 'select-tower' : 'place'}" data-id="${tower ? tower.id : pad.id}" role="button" tabindex="${tower ? '-1' : '0'}" aria-label="${tower ? `${tower.hero.name}, nível ${tower.level}` : `Posicionar ${selectedHeroName} na posição ${pad.id}`}" transform="translate(${pad.x},${pad.y})">
    ${tower ? '' : '<circle r="19"/><path d="M-5 0H5M0-5V5"/>'}
    <rect x="-27" y="-27" width="54" height="54" fill="transparent" pointer-events="all"/>
  </g>`;
  }
  const face = 'M-10-24H10V-22H18V-18H22V-10H24V10H22V18H18V22H10V24H-10V22H-18V18H-22V10H-24V-10H-22V-18H-18V-22H-10Z';
  return `<g class="map-pad pixel-pad ${tower ? 'occupied' : ''}" data-action="${tower ? 'select-tower' : 'place'}" data-id="${tower ? tower.id : pad.id}" role="button" tabindex="${tower ? '-1' : '0'}" aria-label="${tower ? `${tower.hero.name}, nível ${tower.level}` : `Posicionar ${selectedHeroName} na posição ${pad.id}`}" transform="translate(${pad.x},${pad.y})" shape-rendering="crispEdges">
    <path d="${face}" class="pixel-pad-shadow" transform="translate(0,4)"/>
    <path d="${face}" class="pixel-pad-face"/>
    <path d="M-8-18H8M-18-8V8M18-8V8M-8 18H8" class="pixel-pad-inlay"/>
    ${tower ? '' : '<path d="M-6-2H-2V-6H2V-2H6V2H2V6H-2V2H-6Z" class="pixel-pad-plus"/>'}
    <rect x="-27" y="-27" width="54" height="54" fill="transparent" pointer-events="all"/>
  </g>`;
}
