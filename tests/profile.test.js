import test from 'node:test';
import assert from 'node:assert/strict';
import { HEROES, RARITIES, STAGES, GACHA_COST, GACHA_TEN_COST } from '../src/data.js';
import { createProfile, loadProfile, saveProfile, summon, grantVictory, STORAGE_KEY } from '../src/profile.js';

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
  assert.equal(result.profile.totalSummons, 1);
  assert.deepEqual(profile, before);
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
  assert.equal(third.profile.unlockedStage, 3);
  assert.deepEqual(third.profile.completedStages, [1, 2, 3]);
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
