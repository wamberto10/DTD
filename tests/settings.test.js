import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_SETTINGS, SETTINGS_KEY, loadSettings, normalizeSettings, saveSettings } from '../src/settings.js';

function memoryStorage() {
  const values = new Map();
  return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
}

test('settings start with the defaults and survive a storage round trip', () => {
  const storage = memoryStorage();
  assert.deepEqual(loadSettings(storage), { ...DEFAULT_SETTINGS });
  const changed = { ...DEFAULT_SETTINGS, sound: true, effectsVolume: 35, defaultSpeed: 2, damageNumbers: false };
  assert.equal(saveSettings(changed, storage), true);
  assert.deepEqual(loadSettings(storage), changed);
});

test('broken settings fall back to the defaults', () => {
  assert.deepEqual(normalizeSettings({ sound: 'yes', effectsVolume: 250, musicVolume: -4, defaultSpeed: 3, damageNumbers: 1, extra: true }),
    { ...DEFAULT_SETTINGS, effectsVolume: 100, musicVolume: 0 });
  assert.equal(normalizeSettings({ effectsVolume: 42.6 }).effectsVolume, 43);
  const storage = memoryStorage();
  storage.setItem(SETTINGS_KEY, '{not json');
  assert.deepEqual(loadSettings(storage), { ...DEFAULT_SETTINGS });
  assert.deepEqual(loadSettings({ getItem: () => { throw new Error('blocked'); } }), { ...DEFAULT_SETTINGS });
});
