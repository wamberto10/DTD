import { HEROES, RARITIES, STAGES, GACHA_COST, GACHA_TEN_COST } from './data.js';
import { FRAGMENTS_PER_COPY, STAR_SAFETY_CAP, nextStarCost } from './stars.js';

export const STORAGE_KEY = 'dtd-dao-profile-v1';

const knownHeroIds = new Set(HEROES.map(hero => hero.id));
const maxStage = Math.max(...STAGES.map(stage => stage.id));
const validInteger = (value, maximum = 1_000_000_000) => Number.isSafeInteger(value) && value >= 0 && value <= maximum;

export function createProfile() {
  return {
    version: 1,
    crystals: 300,
    owned: ['faxineiro'],
    copies: { faxineiro: 1 },
    fragments: { faxineiro: 0 },
    stars: { faxineiro: 0 },
    unlockedStage: 1,
    completedStages: [],
    totalSummons: 0,
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
  // Progress is sequential: malformed data cannot unlock an inaccessible stage.
  const completedStages = [];
  if (Array.isArray(input.completedStages)) {
    for (let id = 1; id <= maxStage; id += 1) {
      if (!input.completedStages.includes(id)) break;
      completedStages.push(id);
    }
  }
  return {
    version: 1,
    crystals: validInteger(input.crystals) ? input.crystals : fresh.crystals,
    owned,
    copies,
    fragments,
    stars,
    unlockedStage: Math.min(maxStage, completedStages.length + 1),
    completedStages,
    totalSummons: validInteger(input.totalSummons) ? input.totalSummons : 0,
  };
}

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

function drawHero(rng) {
  const roll = randomUnit(rng);
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
    totalSummons: current.totalSummons + count,
  };
  const heroes = [];
  for (let index = 0; index < count; index += 1) {
    const hero = drawHero(rng);
    heroes.push(hero);
    // A hero you already have becomes fragments for its stars.
    if (next.owned.includes(hero.id)) next.fragments[hero.id] += FRAGMENTS_PER_COPY;
    else { next.owned.push(hero.id); next.fragments[hero.id] = 0; next.stars[hero.id] = 0; }
    next.copies[hero.id] = (next.copies[hero.id] ?? 0) + 1;
  }
  return { ok: true, profile: next, heroes };
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

export function grantVictory(profile, stageId) {
  const current = normalizeProfile(profile);
  const stage = STAGES.find(candidate => candidate.id === stageId);
  if (!stage || stageId > current.unlockedStage) {
    return { profile: current, reward: 0, firstClear: false };
  }
  const firstClear = !current.completedStages.includes(stageId);
  const reward = firstClear ? stage.reward : 50;
  return {
    profile: {
      ...current,
      crystals: current.crystals + reward,
      owned: [...current.owned],
      copies: { ...current.copies },
      completedStages: firstClear ? [...current.completedStages, stageId] : [...current.completedStages],
      unlockedStage: Math.max(current.unlockedStage, Math.min(maxStage, stageId + 1)),
    },
    reward,
    firstClear,
  };
}
