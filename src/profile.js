import { HEROES, RARITIES, STAGES, SQUAD_SIZE, GACHA_COST, GACHA_TEN_COST, GACHA_PITY, PROGRESSION, TALENTS, DAILY_MISSIONS, DAILY } from './data.js';
import { FRAGMENTS_PER_COPY, STAR_SAFETY_CAP, nextStarCost } from './stars.js';

export const STORAGE_KEY = 'dtd-dao-profile-v1';

const knownHeroIds = new Set(HEROES.map(hero => hero.id));
const maxStage = Math.max(...STAGES.map(stage => stage.id));
// The first rarity covered by the pity, and the chances before it and from it on (summed in rarity order).
const pityIndex = RARITIES.findIndex(rarity => rarity.id === GACHA_PITY.rarity);
let chanceBelowPity = 0;
let chanceFromPity = 0;
RARITIES.forEach((rarity, index) => { if (index < pityIndex) chanceBelowPity += rarity.chance; else chanceFromPity += rarity.chance; });
const validInteger = (value, maximum = 1_000_000_000) => Number.isSafeInteger(value) && value >= 0 && value <= maximum;
// What the daily missions count.
export const DAILY_COUNTERS = ['victories', 'kills', 'skills', 'perfect', 'bosses', 'upgrades', 'summons'];
const emptyProgress = () => Object.fromEntries(DAILY_COUNTERS.map(key => [key, 0]));
const DAY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function createProfile() {
  return {
    version: 1,
    crystals: 300,
    owned: ['faxineiro'],
    copies: { faxineiro: 1 },
    fragments: { faxineiro: 0 },
    stars: { faxineiro: 0 },
    squad: ['faxineiro'],
    unlockedStage: 1,
    completedStages: [],
    // Best stars of each cleared stage (1 to 3) and the challenges won.
    stageStars: {},
    challenges: [],
    totalSummons: 0,
    // Pulls since the last legendary hero or better (the pity counter).
    pity: 0,
    // Level of each permanent talent, paid with the stars of the Dao.
    talents: Object.fromEntries(TALENTS.map(talent => [talent.id, 0])),
    // Progress of the daily missions of one day (YYYY-MM-DD) and the rewards already received.
    daily: { day: '', progress: emptyProgress(), claimed: [] },
  };
}

function normalizeProfile(input) {
  if (!input || typeof input !== 'object' || input.version !== 1) return createProfile();
  const fresh = createProfile();
  const owned = Array.isArray(input.owned)
    ? [...new Set(['faxineiro', ...input.owned.filter(id => typeof id === 'string' && knownHeroIds.has(id))])]
    : fresh.owned;
  const copies = Object.fromEntries(owned.map(id => [id,
    validInteger(input.copies?.[id], 1_000_000) && input.copies[id] > 0 ? input.copies[id] : 1,
  ]));
  // Profiles saved before stars existed turn every repeated recruit into fragments.
  const savedFragments = input.fragments && typeof input.fragments === 'object' ? input.fragments : null;
  const fragments = Object.fromEntries(owned.map(id => [id, savedFragments
    ? (validInteger(savedFragments[id], 1_000_000) ? savedFragments[id] : 0)
    : (copies[id] - 1) * FRAGMENTS_PER_COPY]));
  const stars = Object.fromEntries(owned.map(id => [id, validInteger(input.stars?.[id], STAR_SAFETY_CAP) ? input.stars[id] : 0]));
  // The squad: up to five recruited heroes taken into battle. Saves from before squads start with their first five.
  let squad = Array.isArray(input.squad)
    ? [...new Set(input.squad.filter(id => owned.includes(id)))].slice(0, SQUAD_SIZE)
    : owned.slice(0, SQUAD_SIZE);
  if (!squad.length) squad = [owned[0]];
  // Progress is sequential: malformed data cannot unlock an inaccessible stage.
  const completedStages = [];
  if (Array.isArray(input.completedStages)) {
    for (let id = 1; id <= maxStage; id += 1) {
      if (!input.completedStages.includes(id)) break;
      completedStages.push(id);
    }
  }
  // Saves from before stage stars count one star per cleared stage.
  const stageStars = Object.fromEntries(completedStages.map(id => {
    const saved = input.stageStars?.[id];
    return [id, Number.isSafeInteger(saved) && saved >= 1 && saved <= 3 ? saved : 1];
  }));
  // Only a stage with three stars opens its challenge.
  const challenges = Array.isArray(input.challenges)
    ? [...new Set(input.challenges.filter(id => stageStars[id] === 3))].sort((a, b) => a - b)
    : [];
  // Talents: known ids and valid levels; if they cost more stars than were earned, every star returns.
  const starsEarned = Object.values(stageStars).reduce((sum, stars) => sum + stars, 0) + challenges.length;
  let talents = Object.fromEntries(TALENTS.map(talent => [talent.id, validInteger(input.talents?.[talent.id], talent.maxLevel) ? input.talents[talent.id] : 0]));
  if (Object.values(talents).reduce((sum, level) => sum + level * (level + 1) / 2, 0) > starsEarned) talents = fresh.talents;
  const savedDaily = input.daily && typeof input.daily === 'object' ? input.daily : {};
  const daily = {
    day: typeof savedDaily.day === 'string' && DAY_PATTERN.test(savedDaily.day) ? savedDaily.day : '',
    progress: Object.fromEntries(DAILY_COUNTERS.map(key => [key, validInteger(savedDaily.progress?.[key], 1_000_000) ? savedDaily.progress[key] : 0])),
    claimed: Array.isArray(savedDaily.claimed) ? [...new Set(savedDaily.claimed.filter(id => DAILY_MISSIONS.some(mission => mission.id === id)))] : [],
  };
  return {
    version: 1,
    crystals: validInteger(input.crystals) ? input.crystals : fresh.crystals,
    owned,
    copies,
    fragments,
    stars,
    squad,
    unlockedStage: Math.min(maxStage, completedStages.length + 1),
    completedStages,
    stageStars,
    challenges,
    totalSummons: validInteger(input.totalSummons) ? input.totalSummons : 0,
    pity: validInteger(input.pity, GACHA_PITY.every - 1) ? input.pity : 0,
    talents,
    daily,
  };
}

// ---------- Permanent talents ----------

/** Stars spent on talents: level n costs n stars, so a talent at level L cost L × (L + 1) / 2. */
export function spentStars(profile) {
  const current = normalizeProfile(profile);
  return TALENTS.reduce((sum, talent) => sum + current.talents[talent.id] * (current.talents[talent.id] + 1) / 2, 0);
}

/** Stars of the Dao not yet spent on talents. */
export const freeStars = profile => daoStars(profile) - spentStars(profile);

/** The bonus of a talent at a level, in words. */
export const talentBonus = (talent, level) => talent.bonus.replace('{}', String(Math.round(level * talent.perLevel * talent.display)));

/** Raises a talent one level, paying its stars. */
export function raiseTalent(profile, talentId) {
  const current = normalizeProfile(profile);
  const talent = TALENTS.find(candidate => candidate.id === talentId);
  if (!talent) return { ok: false, reason: 'Talento desconhecido.', profile: current };
  const level = current.talents[talentId];
  if (level >= talent.maxLevel) return { ok: false, reason: 'Este talento chegou ao nível máximo.', profile: current };
  const cost = level + 1;
  const free = freeStars(current);
  if (free < cost) return { ok: false, reason: `Faltam ${cost - free} estrelas do Dao. Conquiste estrelas nas fases e nos desafios.`, profile: current };
  return { ok: true, cost, level: level + 1, profile: { ...current, talents: { ...current.talents, [talentId]: level + 1 } } };
}

/** Returns every star spent on talents, to share them out again. */
export function resetTalents(profile) {
  const current = normalizeProfile(profile);
  return { ok: true, refund: spentStars(current), profile: { ...current, talents: Object.fromEntries(TALENTS.map(talent => [talent.id, 0])) } };
}

/** The talents as engine modifiers (see NO_MODIFIERS in src/engine.js). */
export function talentModifiers(profile) {
  const current = normalizeProfile(profile);
  const modifiers = { startQi: 0, lives: 0, damage: 0, skillRate: 0, upgradeDiscount: 0 };
  for (const talent of TALENTS) modifiers[talent.modifier] += current.talents[talent.id] * talent.perLevel;
  return modifiers;
}

// ---------- Daily missions ----------

/** The missions of a day (YYYY-MM-DD): the same for everyone on that date. */
export function dailyMissionIds(day) {
  let seed = 7;
  for (const ch of String(day)) seed = (seed * 31 + ch.charCodeAt(0)) % 2147483647;
  const pool = DAILY_MISSIONS.map(mission => mission.id);
  const picked = [];
  for (let i = 0; i < DAILY.count && pool.length; i++) {
    seed = (seed * 48271) % 2147483647;
    picked.push(pool.splice(seed % pool.length, 1)[0]);
  }
  return picked;
}

// The saved progress, or a clean one when the day changed.
const dayState = (current, day) => current.daily.day === day ? current.daily : { day, progress: emptyProgress(), claimed: [] };

/** The missions of the day with their progress. */
export function dailyMissions(profile, day) {
  const current = normalizeProfile(profile);
  const state = dayState(current, day);
  return dailyMissionIds(day).map(id => {
    const mission = DAILY_MISSIONS.find(candidate => candidate.id === id);
    const progress = Math.min(mission.goal, state.progress[mission.counter]);
    return { ...mission, progress, done: progress >= mission.goal, claimed: state.claimed.includes(id) };
  });
}

/** Adds what the player did (counts by DAILY_COUNTERS) to the progress of the day. */
export function recordDaily(profile, day, counts) {
  const current = normalizeProfile(profile);
  if (!DAY_PATTERN.test(day)) return current;
  const state = dayState(current, day);
  const progress = { ...state.progress };
  for (const key of DAILY_COUNTERS) {
    const value = counts?.[key];
    if (Number.isSafeInteger(value) && value > 0) progress[key] = Math.min(1_000_000, progress[key] + value);
  }
  return { ...current, daily: { day, progress, claimed: [...state.claimed] } };
}

/** Receives the crystals of a completed mission; the last one of the day also pays the bonus. */
export function claimDaily(profile, day, missionId) {
  const current = normalizeProfile(profile);
  const mission = dailyMissions(current, day).find(candidate => candidate.id === missionId);
  if (!mission) return { ok: false, reason: 'Esta missão não é de hoje.', profile: current };
  if (mission.claimed) return { ok: false, reason: 'Esta recompensa já foi recebida.', profile: current };
  if (!mission.done) return { ok: false, reason: `Faltam ${mission.goal - mission.progress} para completar a missão.`, profile: current };
  const state = dayState(current, day);
  const claimed = [...state.claimed, missionId];
  const bonus = claimed.length === DAILY.count ? DAILY.allDoneBonus : 0;
  const reward = mission.reward + bonus;
  return { ok: true, reward, bonus, profile: { ...current, crystals: current.crystals + reward, daily: { day, progress: { ...state.progress }, claimed } } };
}

/** Pulls left until the guaranteed legendary hero (or better): 1 means the next pull. */
export const pullsToPity = profile => GACHA_PITY.every - normalizeProfile(profile).pity;

export function loadProfile(storage) {
  try {
    const available = storage ?? globalThis.localStorage;
    const saved = available?.getItem(STORAGE_KEY);
    return saved ? normalizeProfile(JSON.parse(saved)) : createProfile();
  } catch {
    return createProfile();
  }
}

export function saveProfile(profile, storage) {
  try {
    const available = storage ?? globalThis.localStorage;
    if (!available) return false;
    available.setItem(STORAGE_KEY, JSON.stringify(normalizeProfile(profile)));
    return true;
  } catch {
    return false;
  }
}

function randomUnit(rng) {
  const value = rng();
  return Number.isFinite(value) ? Math.min(1 - Number.EPSILON, Math.max(0, value)) : 0;
}

function drawHero(rng, guaranteed = false) {
  let roll = randomUnit(rng);
  // The pity pull only lands on the guaranteed rarity or better, keeping their usual proportions.
  if (guaranteed) roll = chanceBelowPity + roll * chanceFromPity;
  let threshold = 0;
  let rarity = RARITIES.at(-1);
  for (const candidate of RARITIES) {
    threshold += candidate.chance;
    if (roll < threshold) {
      rarity = candidate;
      break;
    }
  }
  const pool = HEROES.filter(hero => hero.rarity === rarity.id);
  return pool[Math.floor(randomUnit(rng) * pool.length)];
}

export function summon(profile, count = 1, rng = Math.random) {
  if (count !== 1 && count !== 10) {
    return { ok: false, reason: 'Escolha um recrutamento de 1 ou 10 heróis.', profile, heroes: [] };
  }
  const cost = count === 10 ? GACHA_TEN_COST : GACHA_COST;
  const current = normalizeProfile(profile);
  if (current.crystals < cost) {
    return { ok: false, reason: 'Cristais insuficientes. Conclua fases para conseguir mais.', profile, heroes: [] };
  }
  const next = {
    ...current,
    crystals: current.crystals - cost,
    owned: [...current.owned],
    copies: { ...current.copies },
    fragments: { ...current.fragments },
    stars: { ...current.stars },
    squad: [...current.squad],
    totalSummons: current.totalSummons + count,
  };
  const heroes = [];
  const guaranteed = [];
  for (let index = 0; index < count; index += 1) {
    const pityPull = next.pity >= GACHA_PITY.every - 1;
    const hero = drawHero(rng, pityPull);
    heroes.push(hero);
    guaranteed.push(pityPull);
    next.pity = RARITIES.findIndex(rarity => rarity.id === hero.rarity) >= pityIndex ? 0 : next.pity + 1;
    // A hero you already have becomes fragments for its stars.
    if (next.owned.includes(hero.id)) next.fragments[hero.id] += FRAGMENTS_PER_COPY;
    else {
      next.owned.push(hero.id); next.fragments[hero.id] = 0; next.stars[hero.id] = 0;
      // New heroes join the squad while it has room.
      if (next.squad.length < SQUAD_SIZE) next.squad.push(hero.id);
    }
    next.copies[hero.id] = (next.copies[hero.id] ?? 0) + 1;
  }
  return { ok: true, profile: next, heroes, guaranteed };
}

/** Spends a hero's fragments to raise it one star. */
export function raiseStar(profile, heroId) {
  const current = normalizeProfile(profile);
  if (!current.owned.includes(heroId)) {
    return { ok: false, reason: 'Recrute este herói antes de elevar suas estrelas.', profile: current };
  }
  const stars = current.stars[heroId];
  const cost = nextStarCost(stars);
  if (cost === null) return { ok: false, reason: 'Este herói chegou ao limite de estrelas.', profile: current };
  const owned = current.fragments[heroId];
  if (owned < cost) return { ok: false, reason: `Faltam ${cost - owned} fragmentos para a próxima estrela.`, profile: current };
  return {
    ok: true, cost, stars: stars + 1,
    profile: {
      ...current,
      fragments: { ...current.fragments, [heroId]: owned - cost },
      stars: { ...current.stars, [heroId]: stars + 1 },
    },
  };
}

/** Stars for a victory: 3 without losing a life, 2 losing up to 30% of the lives, 1 otherwise. */
export function victoryStars(lives, maxLives) {
  if (!Number.isFinite(lives) || !Number.isFinite(maxLives) || maxLives <= 0) return 1;
  const lost = Math.max(0, maxLives - lives);
  if (lost === 0) return 3;
  return lost * 100 <= maxLives * PROGRESSION.twoStarsMaxLossPercent ? 2 : 1;
}

/** Stars earned on the journey: the best stars of each stage plus one per challenge won. */
export function daoStars(profile) {
  const current = normalizeProfile(profile);
  return Object.values(current.stageStars).reduce((sum, stars) => sum + stars, 0) + current.challenges.length;
}

/** Challenge mode opens in a stage after three stars. */
export const challengeOpen = (profile, stageId) => normalizeProfile(profile).stageStars[stageId] === 3;

/** The crystals of the first challenge victory in a stage. */
export const challengeReward = stageId => PROGRESSION.challengeReward.base + PROGRESSION.challengeReward.perStage * stageId;

/**
 * Records a victory. result: { lives, maxLives, mode } of the finished match.
 * Normal mode: crystals, the next stage and the best stars. Challenge mode: its own reward and one extra star.
 */
export function grantVictory(profile, stageId, { lives, maxLives, mode = 'normal' } = {}) {
  const current = normalizeProfile(profile);
  const stage = STAGES.find(candidate => candidate.id === stageId);
  const nothing = { profile: current, reward: 0, firstClear: false, stars: 0, bestStars: 0, newRecord: false, challenge: false, firstChallenge: false };
  if (!stage || stageId > current.unlockedStage) return nothing;
  if (mode === 'challenge') {
    if (current.stageStars[stageId] !== 3) return nothing;
    const firstChallenge = !current.challenges.includes(stageId);
    const reward = firstChallenge ? challengeReward(stageId) : PROGRESSION.repeatReward;
    return {
      profile: {
        ...current,
        crystals: current.crystals + reward,
        challenges: firstChallenge ? [...current.challenges, stageId].sort((a, b) => a - b) : [...current.challenges],
      },
      reward, firstClear: false, stars: 3, bestStars: 3, newRecord: false, challenge: true, firstChallenge,
    };
  }
  const firstClear = !current.completedStages.includes(stageId);
  const reward = firstClear ? stage.reward : PROGRESSION.repeatReward;
  const stars = victoryStars(lives, maxLives);
  const previous = current.stageStars[stageId] || 0;
  const bestStars = Math.max(previous, stars);
  return {
    profile: {
      ...current,
      crystals: current.crystals + reward,
      owned: [...current.owned],
      copies: { ...current.copies },
      completedStages: firstClear ? [...current.completedStages, stageId] : [...current.completedStages],
      unlockedStage: Math.max(current.unlockedStage, Math.min(maxStage, stageId + 1)),
      stageStars: { ...current.stageStars, [stageId]: bestStars },
    },
    reward,
    firstClear,
    stars,
    bestStars,
    newRecord: stars > previous,
    challenge: false,
    firstChallenge: false,
  };
}

/** Puts a recruited hero in the squad, or takes it out. The squad keeps between one and five heroes. */
export function toggleSquad(profile, heroId) {
  const current = normalizeProfile(profile);
  if (!current.owned.includes(heroId)) {
    return { ok: false, reason: 'Recrute este herói antes de levá-lo ao esquadrão.', profile: current };
  }
  if (current.squad.includes(heroId)) {
    if (current.squad.length === 1) return { ok: false, reason: 'O esquadrão precisa de pelo menos um herói.', profile: current };
    return { ok: true, added: false, profile: { ...current, squad: current.squad.filter(id => id !== heroId) } };
  }
  if (current.squad.length >= SQUAD_SIZE) {
    return { ok: false, reason: `O esquadrão já tem ${SQUAD_SIZE} heróis. Tire um para abrir vaga.`, profile: current };
  }
  return { ok: true, added: true, profile: { ...current, squad: [...current.squad, heroId] } };
}
