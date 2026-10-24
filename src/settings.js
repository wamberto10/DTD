/** Player settings (sound, volumes, default speed, damage numbers), saved apart from the profile. No DOM access. */
export const SETTINGS_KEY = 'dtd-dao-settings-v1';

export const DEFAULT_SETTINGS = Object.freeze({
  sound: false,
  // Volumes from 0 to 100. The music volume waits for the music files (docs/PROMPTS_SOM.md).
  effectsVolume: 70,
  musicVolume: 60,
  // Speed each stage starts at (1 or 2).
  defaultSpeed: 1,
  damageNumbers: true,
});

const volume = (value, fallback) => Number.isFinite(value) ? Math.min(100, Math.max(0, Math.round(value))) : fallback;

/** Cleans saved settings: unknown fields are dropped and invalid values fall back to the defaults. */
export function normalizeSettings(input) {
  const saved = input && typeof input === 'object' ? input : {};
  return {
    sound: typeof saved.sound === 'boolean' ? saved.sound : DEFAULT_SETTINGS.sound,
    effectsVolume: volume(saved.effectsVolume, DEFAULT_SETTINGS.effectsVolume),
    musicVolume: volume(saved.musicVolume, DEFAULT_SETTINGS.musicVolume),
    defaultSpeed: saved.defaultSpeed === 2 ? 2 : 1,
    damageNumbers: typeof saved.damageNumbers === 'boolean' ? saved.damageNumbers : DEFAULT_SETTINGS.damageNumbers,
  };
}

export function loadSettings(storage) {
  try {
    const available = storage ?? globalThis.localStorage;
    const saved = available?.getItem(SETTINGS_KEY);
    return normalizeSettings(saved ? JSON.parse(saved) : null);
  } catch {
    return normalizeSettings(null);
  }
}

export function saveSettings(settings, storage) {
  try {
    const available = storage ?? globalThis.localStorage;
    if (!available) return false;
    available.setItem(SETTINGS_KEY, JSON.stringify(normalizeSettings(settings)));
    return true;
  } catch {
    return false;
  }
}
