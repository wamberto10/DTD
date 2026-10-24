// Builds unity-export/: everything the Unity version needs from this game.
//   dados/  JSON with heroes, stages (road + platforms), every balance rule, and reference results
//           from this engine so the C# port can be checked number by number.
//   arte/   PNG pictures (Unity does not import WebP), from the original art in arte/ia when present.
// Run: npm run unity
import { mkdir, readdir, rm, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { HEROES, RARITIES, STAGES, WORLD, WORLDS, SQUAD_SIZE, GACHA_COST, GACHA_TEN_COST, GACHA_PITY, ELEMENTS, TRAITS, PROGRESSION, TALENTS, DAILY_MISSIONS, DAILY, ACHIEVEMENTS } from '../src/data.js';
import { BALANCE, GameEngine, enemyKind, stageDifficulty } from '../src/engine.js';
import { DEFAULT_MAP, hasPaintedMap, mapForStage, pointOnPath, stageKey } from '../src/maps.js';
import { FIRST_TIER_COSTS, FRAGMENTS_PER_COPY, STARS_PER_TIER, STAR_BONUS, STAR_TIERS, nextStarCost, withStars } from '../src/stars.js';
import { ART } from '../src/art-manifest.js';
import { STORAGE_KEY, createProfile, victoryStars, summon, talentModifiers, dailyMissionIds, DAILY_COUNTERS } from '../src/profile.js';
import { prepareEnemyPieces } from './preparar-inimigos-pecas.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'unity-export');
const exists = file => access(file).then(() => true, () => false);
const json = (file, data) => writeFile(path.join(out, 'dados', file), `${JSON.stringify(data, null, 2)}\n`);

// Always read the current PSDs, including additions/removals; never reuse a stale JS import.
const enemyRigs = await prepareEnemyPieces();
await rm(out, { recursive: true, force: true });
for (const dir of ['dados', 'arte/herois', 'arte/inimigos', 'arte/fases']) await mkdir(path.join(out, dir), { recursive: true });

// ---------- Data ----------
const mapData = map => ({
  path: map.path.map(({ x, y }) => [x, y]),
  pads: map.pads.map(({ id, x, y }) => ({ id, x, y })),
  pathLength: Math.round(map.pathLength * 1000) / 1000,
});

await json('raridades.json', RARITIES);
await json('herois.json', HEROES.map(hero => ({ ...hero, art: ART.herois[hero.id] ? `arte/herois/${hero.id}.png` : null })));
await json('fases.json', {
  world: WORLD,
  // Every world: its stages go from firstStage to lastStage (stage.world says which one too).
  worlds: WORLDS,
  defaultMap: mapData(DEFAULT_MAP),
  stages: STAGES.map(stage => {
    const key = stageKey(stage.id);
    const kinds = ART.inimigos[key] || {};
    return {
      ...stage, key,
      difficultyMultiplier: stageDifficulty(stage.id),
      scenery: ART.fases[key] ? `arte/fases/${key}.png` : null,
      enemyArt: Object.fromEntries(['normal', 'fast', 'brute', 'boss'].map(kind => [kind, kinds[kind] ? `arte/inimigos/${key}-${kind}.png` : null])),
      usesDefaultMap: !hasPaintedMap(stage.id),
      map: hasPaintedMap(stage.id) ? mapData(mapForStage(stage.id)) : null,
    };
  }),
});
await json('regras.json', {
  // Battle space: 1000 × 600 units, origin at the top-left corner, y grows downward (as on the web page).
  battleSpace: { width: 1000, height: 600, origin: 'top-left', yAxis: 'down' },
  balance: BALANCE,
  // Names and plain-words effects of the elements (the numbers are in balance.elements).
  elementInfo: ELEMENTS,
  // Names and plain-words effects of the enemy traits (numbers in balance.traits; which ones per stage in fases.json).
  traitInfo: TRAITS,
  stageDifficulty: 'multiplier = 1 + (stage - 1) * balance.stageStep',
  waveFormulas: {
    count: 'baseCount + wave * countPerWave',
    hp: 'round((baseHp + wave * hpPerWave) * stageMultiplier * enemies[kind].hp)',
    speed: 'enemies[kind].speed + wave * speedPerWave',
    kind: 'boss if last enemy of the final wave; brute if wave >= bruteFromWave and index % bruteEvery == bruteSlot; fast if wave >= fastFromWave and index % fastEvery == fastSlot; else normal',
    spawn: 'first enemy at once, then every spawnInterval seconds (finalWaveSpawnInterval in the last wave)',
  },
  towerFormulas: {
    damage: 'round(hero.damage * (1 + (level - 1) * damagePerLevel))',
    range: 'hero.range + (level - 1) * rangePerLevel',
    attackSpeed: 'round(hero.attackSpeed * (1 + (level - 1) * attackSpeedPerLevel) * 100) / 100',
    upgradeCost: 'round(hero.cost * upgradeCostFactor * upgradeCostGrowth ^ (level - 1)), none at maxLevel',
    sellRefund: 'floor(spent * sellRefund)',
    targeting: 'enemy with the largest progress among those within range; damage lands at once',
    cooldown: '1 / attackSpeed seconds',
  },
  stars: {
    fragmentsPerCopy: FRAGMENTS_PER_COPY, starsPerTier: STARS_PER_TIER, firstTierCosts: FIRST_TIER_COSTS,
    costFormula: 'firstTierCosts[stars % 5] * 2 ^ floor(stars / 5)',
    bonusPerStar: STAR_BONUS, tiers: STAR_TIERS,
    heroFormula: 'damage = round(base * (1 + stars * bonus.damage)); attackSpeed = round(base * (1 + stars * bonus.attackSpeed) * 100) / 100',
  },
  gacha: {
    singleCost: GACHA_COST, tenCost: GACHA_TEN_COST,
    pity: {
      every: GACHA_PITY.every, rarity: GACHA_PITY.rarity,
      rule: 'profile.pity counts pulls since the last hero of this rarity or better (0 after one). When pity >= every - 1 the pull is guaranteed: roll = below + roll * from, where below and from are the chances summed in rarity order before that rarity and from it on',
    },
    rule: 'roll rarity by chance, then one hero of that rarity with equal odds',
  },
  squad: { size: SQUAD_SIZE, min: 1, newRecruitsJoinWhileRoom: true },
  // Permanent talents: level n costs n stars of the Dao; engine modifier += level * perLevel; text shows round(level * perLevel * display).
  talents: TALENTS,
  daily: {
    count: DAILY.count, allDoneBonus: DAILY.allDoneBonus, counters: DAILY_COUNTERS, missions: DAILY_MISSIONS,
    pick: 'seed = 7; for each UTF-16 code unit c of the day (YYYY-MM-DD, local time): seed = (seed * 31 + c) % 2147483647; then count times: seed = (seed * 48271) % 2147483647 and take pool[seed % pool.length] out of the pool (the missions in order)',
    claim: 'a finished mission pays its reward once; the last of the day also pays allDoneBonus; progress starts over when the day changes',
  },
  // Achievements: reached when the counter of their type gets to the goal (see the comment above ACHIEVEMENTS in
  // src/data.js); lifetime counters = daily counters plus "missions"; each reward is paid once.
  achievements: ACHIEVEMENTS,
  progression: {
    startingProfile: createProfile(),
    firstClearReward: '150 + (stage - 1) * 25', repeatReward: PROGRESSION.repeatReward, unlock: 'sequential',
    stageStars: {
      twoStarsMaxLossPercent: PROGRESSION.twoStarsMaxLossPercent,
      rule: '3 with no life lost; 2 when lost * 100 <= maxLives * twoStarsMaxLossPercent; else 1. The best mark of each stage is kept.',
    },
    challenge: {
      opensAtStars: 3, reward: PROGRESSION.challengeReward,
      rewardFormula: 'base + perStage * stage on the first challenge victory of a stage, repeatReward after',
      battle: 'balance.challenge: enemy hp multiplied by hpMultiplier, the player starts with challenge.lives lives',
      extraStar: 'each challenge won counts one star of the Dao',
    },
    webSaveKey: STORAGE_KEY,
  },
});

// ---------- Reference results (golden tests for the C# port) ----------
const cleaner = HEROES.find(hero => hero.id === 'faxineiro');
const round = value => Math.round(value * 1e6) / 1e6;
// A scripted match: one hero per platform (each hero defends a single platform per stage), all with the same stars;
// between waves, each tower (in placement order) is upgraded once if affordable.
function scriptedMatch(stage, stars, lineup, { mode = 'normal', modifiers = null } = {}) {
  const heroes = lineup.map(([id]) => withStars(HEROES.find(hero => hero.id === id), stars));
  const game = new GameEngine({ stage, heroes, mode, ...(modifiers ? { modifiers } : {}) });
  lineup.forEach(([, pad], index) => {
    if (!game.placeTower(heroes[index], pad).ok) throw new Error(`Caso de teste inválido: ${lineup[index][0]} em ${pad}`);
  });
  const waves = [];
  for (let wave = 1; wave <= BALANCE.wavesPerStage && ['preparing'].includes(game.state.status); wave++) {
    if (wave > 1) for (const tower of [...game.state.towers]) {
      const cost = game.getNextUpgradeCost(tower);
      if (cost !== null && game.state.qi >= cost) game.upgradeTower(tower.id);
    }
    game.startWave();
    let frames = 0, skills = 0;
    while (game.state.status === 'running' && frames < 30 * 600) {
      game.update(1 / 30); frames++;
      // Skills are cast as soon as they are charged, in placement order.
      for (const tower of [...game.state.towers]) {
        if (game.state.status === 'running' && game.skillReady(tower) && game.useSkill(tower.id).ok) skills++;
      }
    }
    waves.push({ wave, frames, skills, status: game.state.status, kills: game.state.kills, qi: game.state.qi, lives: game.state.lives,
      // Damage and kills of each hero so far, in lineup order (the match summary).
      heroDamage: lineup.map(([id]) => game.state.heroStats[id]?.damage ?? 0),
      heroKills: lineup.map(([id]) => game.state.heroStats[id]?.kills ?? 0),
      towerLevels: game.state.towers.map(tower => tower.level) });
  }
  return { stage, stars, mode, modifiers, lineup: lineup.map(([hero, pad]) => ({ hero, pad })), dt: 1 / 30,
    rule: 'between waves, upgrade each tower once in placement order if Qi allows; start the next wave at once; after every frame, cast each charged skill in placement order', waves };
}
// Every talent at some level, with enough stars (three in each of the first twelve stages).
const TALENT_SAMPLE = (() => {
  const levels = { reserva: 3, muralha: 2, furia: 5, meditacao: 4, economia: 1 };
  const firstTwelve = STAGES.slice(0, 12).map(stage => stage.id);
  const profile = { ...createProfile(), completedStages: firstTwelve, stageStars: Object.fromEntries(firstTwelve.map(id => [id, 3])), talents: levels };
  return { levels, stages: firstTwelve, modifiers: talentModifiers(profile) };
})();
await json('casos-de-teste.json', {
  about: 'Results of the JavaScript engine. The Unity port must give the same numbers for the same inputs.',
  pathSamples: STAGES.map(stage => {
    const map = mapForStage(stage.id);
    return { stage: stage.id, pathLength: round(map.pathLength), points: [0, 150, 500, 1000, map.pathLength + 10].map(d => ({ distance: round(d), ...Object.fromEntries(Object.entries(pointOnPath(d, map)).map(([k, v]) => [k, round(v)])) })) };
  }),
  waveComposition: [1, 12, 24].flatMap(stage => [1, 3, 5].map(wave => {
    const count = BALANCE.waves.baseCount + wave * BALANCE.waves.countPerWave;
    const kinds = Array.from({ length: count }, (_, i) => enemyKind(wave, i, count));
    const probe = new GameEngine({ stage });
    probe.state.wave = wave - 1;
    probe.startWave();
    return { stage, wave, kinds, hp: probe._spawnQueue.map(e => e.hp), speed: probe._spawnQueue.map(e => round(e.speed)), reward: probe._spawnQueue.map(e => e.reward) };
  })),
  towerLevels: HEROES.filter(h => ['faxineiro', 'long-chen'].includes(h.id)).map(hero => {
    const probe = new GameEngine();
    return { hero: hero.id, levels: [1, 2, 3, 4, 5].map(level => ({ level, ...probe.getTowerStats({ hero, level }), nextUpgradeCost: probe.getNextUpgradeCost({ hero, level }) })) };
  }),
  starCosts: Array.from({ length: 15 }, (_, stars) => ({ from: stars, cost: nextStarCost(stars) })),
  starredHeroes: [0, 1, 5, 7, 12].map(stars => ({ hero: 'faxineiro', stars, damage: withStars(cleaner, stars).damage, attackSpeed: withStars(cleaner, stars).attackSpeed })),
  // Ten pulls that cross the pity: the fifth one is guaranteed.
  pitySummon: (() => {
    let seed = 20261023;
    const rolls = [];
    const rng = () => { seed = (seed * 16807) % 2147483647; const value = seed / 2147483647; rolls.push(value); return value; };
    const result = summon({ ...createProfile(), crystals: 2000, pity: GACHA_PITY.every - 5 }, 10, rng);
    return { startPity: GACHA_PITY.every - 5, crystals: 2000, rolls, heroes: result.heroes.map(hero => hero.id), guaranteed: result.guaranteed, pity: result.profile.pity };
  })(),
  // Stage stars for the lives left at the end of a won match.
  victoryStars: [[20, 20], [19, 20], [14, 20], [13, 20], [1, 20], [25, 25], [18, 25], [17, 25]]
    .map(([lives, maxLives]) => ({ lives, maxLives, stars: victoryStars(lives, maxLives) })),
  // Challenge mode: the last wave of a stage, with tougher enemies and fewer lives.
  challengeWaves: [1, 12].map(stage => {
    const probe = new GameEngine({ stage, mode: 'challenge' });
    const lives = probe.state.lives;
    probe.state.wave = BALANCE.wavesPerStage - 1;
    probe.startWave();
    return { stage, wave: BALANCE.wavesPerStage, lives, hp: probe._spawnQueue.map(e => e.hp) };
  }),
  // The last one is a lost match (one tower against stage 12), to check lives and defeat too.
  matches: [
    scriptedMatch(1, 0, [['faxineiro', 'p1'], ['aprendiz', 'p2'], ['lin-yue', 'p4']]),
    scriptedMatch(5, 0, [['faxineiro', 'p2'], ['aprendiz', 'p3'], ['lin-yue', 'p6']]),
    // Su Lan slows enemies (ice): the slow is compared too.
    scriptedMatch(12, 5, [['su-lan', 'p2'], ['faxineiro', 'p4']]),
    scriptedMatch(12, 0, [['faxineiro', 'p1']]),
    // Challenge mode with every talent: more Qi and lives, more damage, faster skills, cheaper upgrades.
    scriptedMatch(3, 2, [['faxineiro', 'p2'], ['lin-yue', 'p4'], ['aprendiz', 'p5']], { mode: 'challenge', modifiers: TALENT_SAMPLE.modifiers }),
  ],
  talentSample: TALENT_SAMPLE,
  dailyPicks: ['2026-10-23', '2026-10-24', '2026-12-31', '2027-01-01', '2028-02-29'].map(day => ({ day, ids: dailyMissionIds(day) })),
});

// ---------- Art (PNG) ----------
const raw = path.join(root, 'arte', 'ia');
const webp = path.join(root, 'public', 'arte');
const pngs = async dir => (await readdir(dir).catch(() => [])).filter(file => file.toLowerCase().endsWith('.png'));
const KIND = { comum: 'normal', rapido: 'fast', forte: 'brute', chefe: 'boss' };
let count = 0;
async function sprite(source, target, maxSize) {
  await sharp(source).ensureAlpha().trim({ threshold: 10 })
    .resize(maxSize, maxSize, { fit: 'inside', withoutEnlargement: true, kernel: 'lanczos3' })
    .png({ compressionLevel: 9 }).toFile(target);
  count++;
}
// Heroes: 512 px; enemies 384 px; bosses 512 px; scenery 2000 × 1200 (the 1000 × 600 battle space at 2×).
for (const id of Object.keys(ART.herois)) {
  const source = (await exists(path.join(raw, 'herois', `${id}.png`))) ? path.join(raw, 'herois', `${id}.png`) : path.join(webp, 'herois', `${id}.webp`);
  await sprite(source, path.join(out, 'arte', 'herois', `${id}.png`), 512);
}
for (const dir of ['inimigos', 'chefes']) {
  for (const file of await pngs(path.join(raw, dir))) {
    const match = file.match(/^(f\d{2})_(comum|rapido|forte|chefe)_/);
    if (match) await sprite(path.join(raw, dir, file), path.join(out, 'arte', 'inimigos', `${match[1]}-${KIND[match[2]]}.png`), match[2] === 'chefe' ? 512 : 384);
  }
}
for (const [key] of Object.entries(ART.fases)) {
  const original = (await pngs(path.join(raw, 'fases'))).find(file => file.startsWith(`${key}_`));
  const source = original ? path.join(raw, 'fases', original) : path.join(webp, 'fases', `${key}.webp`);
  await sharp(source).resize(2000, 1200, { fit: 'fill', kernel: 'lanczos3' }).png({ compressionLevel: 9 }).toFile(path.join(out, 'arte', 'fases', `${key}.png`));
  count++;
}

// Cut-out pieces keep their original canvas offsets/joints. Unity consumes cropped PNGs, never WebP.
// The PNGs are reduced to 37.5 % (a 1024 canvas becomes 384, like the whole enemies) with the same lanczos filter:
// on the map an enemy is about 45 px tall, and full-size pieces looked grainy or blurry there. Unity imports them at
// 37.5 pixels per unit (DtdArtImportRules), so the manifest coordinates stay in drawing pixels.
const UNITY_PART_SCALE = 0.375;
const rigs = [];
for (const rig of enemyRigs.rigs) {
  const parts = [];
  for (const part of rig.parts) {
    const file = part.file.replace(/\.webp$/, '.png');
    const target = path.join(out, file);
    await mkdir(path.dirname(target), { recursive: true });
    await sharp(path.join(webp, part.file.slice('arte/'.length)))
      .resize(Math.max(1, Math.round(part.w * UNITY_PART_SCALE)), Math.max(1, Math.round(part.h * UNITY_PART_SCALE)), { fit: 'fill', kernel: 'lanczos3' })
      .png({ compressionLevel: 9 }).toFile(target);
    parts.push({ ...part, file });
    count++;
  }
  rigs.push({ ...rig, parts });
}
await json('animacoes-inimigos.json', { rigs });

await writeFile(path.join(out, 'LEIA-ME.md'), `# Pacote do DTD para o Unity

Gerado por \`npm run unity\` a partir do jogo web. Não edite à mão: rode o comando de novo.

- \`dados/herois.json\`, \`dados/raridades.json\`: os 14 heróis e as 7 raridades.
- \`dados/fases.json\`: os 2 mundos e as 24 fases, com caminho e plataformas (espaço de batalha 1000 × 600, origem no canto superior esquerdo, y para baixo).
- \`dados/regras.json\`: todos os números e fórmulas (combate, ondas, torres, estrelas, recrutamento, esquadrão, progresso).
- \`dados/casos-de-teste.json\`: resultados do motor atual para conferir a versão em C#.
- \`arte/\`: heróis (512 px), inimigos (384 px), chefes (512 px) e cenários (2000 × 1200), em PNG.
- \`dados/animacoes-inimigos.json\` e \`arte/inimigos-pecas/\`: peças PNG, posições e juntas dos PSDs validados; a imagem estática continua disponível como fallback.

O plano completo está em \`docs/MIGRACAO_UNITY.md\`.
`);

console.log(`Pacote do Unity pronto em unity-export/: ${HEROES.length} heróis, ${STAGES.length} fases, ${count} imagens PNG.`);
