import test from 'node:test';
import assert from 'node:assert/strict';
import { HEROES, RARITIES, STAGES, SQUAD_SIZE, GACHA_COST, GACHA_TEN_COST } from '../src/data.js';
import { createProfile, loadProfile, saveProfile, summon, grantVictory, raiseStar, toggleSquad, STORAGE_KEY } from '../src/profile.js';
import { FRAGMENTS_PER_COPY, STAR_BONUS, nextStarCost, starBonusPercent, starTier, withStars } from '../src/stars.js';

function memoryStorage() {
  const values = new Map();
  return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
}

test('a new disciple begins with the Faxineiro and a three-summon welcome gift', () => {
  const profile = createProfile();
  assert.deepEqual(profile.owned, ['faxineiro']);
  assert.equal(profile.crystals, GACHA_COST * 3);
  assert.equal(profile.unlockedStage, 1);
  assert.equal(HEROES.length, 14);
  assert.ok(Math.abs(RARITIES.reduce((sum, rarity) => sum + rarity.chance, 0) - 1) < 1e-12);
  for (const rarity of RARITIES) assert.equal(HEROES.filter(hero => hero.rarity === rarity.id).length, 2);
});

test('all seven rarity intervals and pool selection are reachable', () => {
  let lower = 0;
  for (const rarity of RARITIES) {
    const rarityRoll = lower + rarity.chance / 2;
    let calls = 0;
    const result = summon(createProfile(), 1, () => calls++ % 2 === 0 ? rarityRoll : 0.99);
    assert.equal(result.heroes[0].rarity, rarity.id);
    assert.equal(result.heroes[0].id, HEROES.filter(hero => hero.rarity === rarity.id)[1].id);
    lower += rarity.chance;
  }
  assert.equal(summon(createProfile(), 1, () => 0).heroes[0].id, 'faxineiro');
  assert.equal(summon(createProfile(), 1, () => 1).heroes[0].rarity, 'urplus');
});

test('a roll on a rarity boundary enters the next interval', () => {
  let threshold = 0;
  for (let index = 0; index < RARITIES.length - 1; index += 1) {
    threshold += RARITIES[index].chance;
    let calls = 0;
    const result = summon(createProfile(), 1, () => calls++ === 0 ? threshold : 0);
    assert.equal(result.heroes[0].rarity, RARITIES[index + 1].id);
  }
});

test('a draw spends crystals and duplicate draws count copies without duplicating ownership', () => {
  const profile = createProfile();
  const before = structuredClone(profile);
  const result = summon(profile, 1, () => 0);
  assert.equal(result.ok, true);
  assert.equal(result.profile.crystals, 200);
  assert.deepEqual(result.profile.owned, ['faxineiro']);
  assert.equal(result.profile.copies.faxineiro, 2);
  assert.equal(result.profile.fragments.faxineiro, FRAGMENTS_PER_COPY);
  assert.equal(result.profile.totalSummons, 1);
  assert.deepEqual(profile, before);
  // A new hero starts with no fragments and no stars.
  const fresh = summon(createProfile(), 1, () => 0.99).profile;
  const newcomer = fresh.owned.at(-1);
  assert.equal(fresh.fragments[newcomer], 0);
  assert.equal(fresh.stars[newcomer], 0);
});

test('star costs come in groups of five, and each new group costs double', () => {
  const costs = Array.from({ length: 15 }, (_, stars) => nextStarCost(stars));
  assert.deepEqual(costs, [25, 25, 25, 50, 50, 50, 50, 50, 100, 100, 100, 100, 100, 200, 200]);
  assert.equal(FRAGMENTS_PER_COPY, 50);
  // Every group of five has its own colour; the stars of the group in progress are counted from zero.
  assert.deepEqual([0, 4, 5, 9, 10].map(stars => [starTier(stars).name, starTier(stars).lit]),
    [['Ouro', 0], ['Ouro', 4], ['Rubi', 0], ['Rubi', 4], ['Ametista', 0]]);
  assert.equal(starTier(5).previous.name, 'Ouro');
  assert.notEqual(starTier(4).color, starTier(5).color);
  assert.equal(starTier(60).name, starTier(30).name, 'Past the last colour, the stars keep it.');
});

test('fragments raise stars one at a time, past five and with no fixed limit', () => {
  let profile = { ...createProfile(), fragments: { faxineiro: 24 } };
  const short = raiseStar(profile, 'faxineiro');
  assert.equal(short.ok, false);
  assert.match(short.reason, /Faltam 1 fragmentos/);
  assert.equal(raiseStar(profile, 'su-lan').ok, false);
  // Four repeated recruits (200 fragments) complete the first five stars, with 25 left over.
  profile = { ...profile, fragments: { faxineiro: 4 * FRAGMENTS_PER_COPY } };
  for (let star = 1; star <= 5; star++) {
    const before = profile.fragments.faxineiro;
    const result = raiseStar(profile, 'faxineiro');
    assert.equal(result.ok, true);
    assert.equal(result.stars, star);
    assert.equal(result.profile.fragments.faxineiro, before - result.cost);
    profile = result.profile;
  }
  assert.equal(profile.fragments.faxineiro, 25);
  assert.equal(raiseStar(profile, 'faxineiro').ok, false, 'The sixth star costs 50.');
  profile = { ...profile, fragments: { faxineiro: 50 } };
  const sixth = raiseStar(profile, 'faxineiro');
  assert.equal(sixth.ok, true);
  assert.equal(sixth.stars, 6);
  assert.equal(sixth.cost, 50);
  // Saved star counts above five survive a reload.
  const storage = memoryStorage();
  saveProfile(sixth.profile, storage);
  assert.equal(loadProfile(storage).stars.faxineiro, 6);
});

test('each star adds damage and attack speed on top of the base hero', () => {
  const cleaner = HEROES.find(hero => hero.id === 'faxineiro');
  assert.equal(withStars(cleaner, 0).damage, cleaner.damage);
  const seven = withStars(cleaner, 7);
  assert.equal(seven.stars, 7);
  assert.equal(seven.damage, Math.round(cleaner.damage * (1 + 7 * STAR_BONUS.damage)));
  assert.equal(seven.attackSpeed, Math.round(cleaner.attackSpeed * (1 + 7 * STAR_BONUS.attackSpeed) * 100) / 100);
  assert.equal(seven.range, cleaner.range);
  assert.equal(seven.cost, cleaner.cost);
  assert.ok(withStars(cleaner, 8).damage > seven.damage);
  assert.deepEqual(starBonusPercent(10), { damage: 70, attackSpeed: 20 });
});

test('profiles saved before stars turn repeated copies into fragments', () => {
  const storage = memoryStorage();
  storage.setItem(STORAGE_KEY, JSON.stringify({
    version: 1, crystals: 120, owned: ['faxineiro', 'su-lan'], copies: { faxineiro: 4, 'su-lan': 1 },
    unlockedStage: 2, completedStages: [1], totalSummons: 4,
  }));
  const restored = loadProfile(storage);
  assert.deepEqual(restored.fragments, { faxineiro: 3 * FRAGMENTS_PER_COPY, 'su-lan': 0 });
  assert.deepEqual(restored.stars, { faxineiro: 0, 'su-lan': 0 });
  storage.setItem(STORAGE_KEY, JSON.stringify({ ...restored, fragments: { faxineiro: -3, 'su-lan': 1.5 }, stars: { faxineiro: 999, 'su-lan': 9 } }));
  const cleaned = loadProfile(storage);
  assert.deepEqual(cleaned.fragments, { faxineiro: 0, 'su-lan': 0 });
  assert.deepEqual(cleaned.stars, { faxineiro: 0, 'su-lan': 9 });
});

test('ten draws apply the discount and cannot spend unavailable crystals', () => {
  const poor = createProfile();
  assert.equal(summon(poor, 10).ok, false);
  assert.equal(poor.crystals, 300);
  const funded = { ...createProfile(), crystals: 1000 };
  const result = summon(funded, 10, () => 0.8);
  assert.equal(result.heroes.length, 10);
  assert.equal(result.profile.crystals, 1000 - GACHA_TEN_COST);
  assert.equal(result.profile.totalSummons, 10);
  assert.equal(result.profile.owned.length, 2);
  assert.equal(summon(funded, -1).ok, false);
  assert.equal(summon(funded, 100).ok, false);
});

test('victory grants first-clear rewards, unlocks the next stage, and preserves its input', () => {
  const original = createProfile();
  const first = grantVictory(original, 1);
  assert.equal(first.firstClear, true);
  assert.equal(first.reward, STAGES[0].reward);
  assert.equal(first.profile.crystals, 450);
  assert.equal(first.profile.unlockedStage, 2);
  assert.deepEqual(first.profile.completedStages, [1]);
  assert.deepEqual(original, createProfile());
  const repeat = grantVictory(first.profile, 1);
  assert.equal(repeat.reward, 50);
  assert.equal(repeat.firstClear, false);
  assert.deepEqual(repeat.profile.completedStages, [1]);
  const second = grantVictory(first.profile, 2);
  const third = grantVictory(second.profile, 3);
  assert.equal(third.profile.unlockedStage, 4);
  assert.deepEqual(third.profile.completedStages, [1, 2, 3]);
  // Clearing the last stage keeps it as the furthest unlocked stage.
  let all = createProfile();
  for (const stage of STAGES) all = grantVictory(all, stage.id).profile;
  assert.equal(all.unlockedStage, STAGES.length);
  assert.equal(all.completedStages.length, STAGES.length);
  assert.equal(grantVictory(original, 3).reward, 0);
  assert.equal(grantVictory(original, 999).reward, 0);
});

test('progress survives a storage round trip', () => {
  const storage = memoryStorage();
  const profile = grantVictory(summon(createProfile(), 1, () => 0.9).profile, 1).profile;
  assert.equal(saveProfile(profile, storage), true);
  assert.deepEqual(loadProfile(storage), profile);
});

test('unavailable and corrupt storage fails gracefully', () => {
  const blocked = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('quota'); } };
  assert.deepEqual(loadProfile(blocked), createProfile());
  assert.equal(saveProfile(createProfile(), blocked), false);
  const storage = memoryStorage();
  storage.setItem(STORAGE_KEY, '{invalid json');
  assert.deepEqual(loadProfile(storage), createProfile());
  storage.setItem(STORAGE_KEY, JSON.stringify({ version: 99, crystals: 100 }));
  assert.deepEqual(loadProfile(storage), createProfile());
});

test('malformed profile fields are normalized without unknown heroes or invalid balances', () => {
  const storage = memoryStorage();
  storage.setItem(STORAGE_KEY, JSON.stringify({
    version: 1, crystals: -100, owned: ['unknown', 'su-lan', 'su-lan', null],
    copies: { 'su-lan': -5, unknown: 500 }, unlockedStage: 999,
    completedStages: [2, 3, '1'], totalSummons: 1.5,
  }));
  const restored = loadProfile(storage);
  assert.equal(restored.crystals, 300);
  assert.deepEqual(restored.owned, ['faxineiro', 'su-lan']);
  assert.deepEqual(restored.copies, { faxineiro: 1, 'su-lan': 1 });
  assert.deepEqual(restored.completedStages, []);
  assert.equal(restored.unlockedStage, 1);
  assert.equal(restored.totalSummons, 0);
});

test('new heroes join the squad while it has room for five', () => {
  assert.deepEqual(createProfile().squad, ['faxineiro']);
  // One hero of each rarity pool, then a seventh distinct hero: the first five fill the squad.
  let profile = { ...createProfile(), crystals: 100_000 };
  const ids = HEROES.filter(hero => hero.id !== 'faxineiro').map(hero => hero.id);
  for (const id of ids.slice(0, 6)) {
    const index = HEROES.findIndex(hero => hero.id === id);
    const hero = HEROES[index];
    let lower = 0;
    for (const rarity of RARITIES) { if (rarity.id === hero.rarity) break; lower += rarity.chance; }
    const pool = HEROES.filter(item => item.rarity === hero.rarity);
    let calls = 0;
    profile = summon(profile, 1, () => calls++ === 0 ? lower + 1e-9 : pool.indexOf(hero) / pool.length + 1e-9).profile;
    assert.ok(profile.owned.includes(id));
  }
  assert.equal(profile.squad.length, SQUAD_SIZE);
  assert.deepEqual(profile.squad, ['faxineiro', ...ids.slice(0, 4)]);
  assert.ok(!profile.squad.includes(ids[5]));
});

test('the squad takes heroes in and out, keeping between one and five', () => {
  const owned = ['faxineiro', 'aprendiz', 'lin-yue', 'han-feng', 'su-lan', 'mo-yan'];
  const base = { ...createProfile(), owned, squad: ['faxineiro'] };
  const original = structuredClone(base);
  assert.equal(toggleSquad(base, 'faxineiro').ok, false, 'The last hero cannot leave.');
  assert.equal(toggleSquad(base, 'xing-he').ok, false, 'Unrecruited heroes cannot join.');
  let profile = base;
  for (const id of owned.slice(1, 5)) {
    const result = toggleSquad(profile, id);
    assert.equal(result.ok, true);
    assert.equal(result.added, true);
    profile = result.profile;
  }
  assert.equal(profile.squad.length, SQUAD_SIZE);
  const full = toggleSquad(profile, 'mo-yan');
  assert.equal(full.ok, false);
  assert.match(full.reason, /já tem 5 heróis/);
  const out = toggleSquad(profile, 'lin-yue');
  assert.equal(out.added, false);
  assert.deepEqual(out.profile.squad, ['faxineiro', 'aprendiz', 'han-feng', 'su-lan']);
  assert.equal(toggleSquad(out.profile, 'mo-yan').ok, true);
  assert.deepEqual(base, original, 'The input profile is not changed.');
});

test('saved squads are cleaned, and older saves start with their first five heroes', () => {
  const storage = memoryStorage();
  const owned = ['faxineiro', 'aprendiz', 'lin-yue', 'han-feng', 'su-lan', 'mo-yan', 'shen-lei'];
  storage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, crystals: 0, owned, copies: {}, unlockedStage: 1, completedStages: [], totalSummons: 6 }));
  assert.deepEqual(loadProfile(storage).squad, owned.slice(0, SQUAD_SIZE));
  storage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, crystals: 0, owned, squad: ['shen-lei', 'xing-he', 'shen-lei', 'mo-yan', 'lin-yue', 'aprendiz', 'su-lan', 'han-feng'] }));
  assert.deepEqual(loadProfile(storage).squad, ['shen-lei', 'mo-yan', 'lin-yue', 'aprendiz', 'su-lan']);
  storage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, crystals: 0, owned, squad: ['xing-he'] }));
  assert.deepEqual(loadProfile(storage).squad, ['faxineiro'], 'An empty squad falls back to the Faxineiro.');
});
