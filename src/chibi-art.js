/** Painted chibi art (public/arte/) with fallbacks to the pixel drawings when a picture is missing. */
import { ART } from './art-manifest.js';
import { stageKey } from './maps.js';

const FILE_KIND = { normal: 'comum', fast: 'rapido', brute: 'forte', boss: 'chefe' };

// The portable file carries every picture inside the page (window.DTD_ART); the web version loads the files.
export const artUrl = file => globalThis.DTD_ART?.[file] ?? file;

export function heroArt(hero) {
  const size = hero && ART.herois[hero.id];
  return size ? { url: artUrl(`arte/herois/${hero.id}.webp`), ...size } : null;
}

export function enemyArt(stage, kind) {
  const key = stageKey(stage);
  const size = ART.inimigos[key]?.[kind];
  return size ? { url: artUrl(`arte/inimigos/${key}-${FILE_KIND[kind]}.webp`), ...size } : null;
}

export function sceneryArt(stage) {
  const key = stageKey(stage);
  return ART.fases[key] ? artUrl(`arte/fases/${key}.webp`) : null;
}
