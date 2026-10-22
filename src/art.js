const ICONS = {
  swords: '<path d="m4 3 12 12m-1-4 4 4-4 4m-2-2-3 3m-6-3 3 3m-3-6 4-4M17 3l4 4-9 9-4-4zM3 3l4 1 13 13-3 3L4 7z"/>',
  sword: '<path d="m4 20 4-4m-3-3 6 6M8 13 17 4l4-1-1 4-9 9z"/>',
  gem: '<path d="m3 8 4-5h10l4 5-9 13zM3 8h18M7 3l5 18 5-18"/>',
  users: '<circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2m1-15a3 3 0 0 1 0 6m2 3a5 5 0 0 1 3 4v2"/>',
  book: '<path d="M12 5v16m0-16C8 2 4 3 2 4v15c3-2 7-1 10 2 3-3 7-4 10-2V4c-2-1-6-2-10 1z"/>',
  chevronRight: '<path d="m9 5 7 7-7 7"/>', chevronLeft: '<path d="m15 5-7 7 7 7"/>',
  play: '<path d="m8 4 13 8-13 8z"/>', pause: '<path d="M8 5v14M16 5v14"/>',
  heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z"/>',
  qi: '<path d="M13 2c-2 5 5 5 5 11a6 6 0 0 1-12 0c0-3 2-5 4-7-1 4 2 5 3 3 1-2-1-4 0-7z"/><path d="M13 13c-2 2-3 3-2 5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>', close: '<path d="m6 6 12 12M6 18 18 6"/>',
  speed: '<path d="m3 5 8 7-8 7zm10 0 8 7-8 7z"/>',
  volume: '<path d="m11 4-5 4H2v8h4l5 4zM15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>',
  volumeOff: '<path d="m11 4-5 4H2v8h4l5 4zM16 9l6 6m0-6-6 6"/>',
  lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V6a4 4 0 0 1 8 0v4m-4 5v2"/>',
  check: '<path d="m5 12 4 4L20 5"/>',
  refresh: '<path d="M20 7v5h-5M4 17v-5h5M6 6a8 8 0 0 1 14 6M4 12a8 8 0 0 0 14 6"/>',
  arrowUp: '<path d="M12 20V4m-7 7 7-7 7 7"/>',
  arrowRight: '<path d="M4 12h16m-7-7 7 7-7 7"/>',
  coin: '<circle cx="12" cy="12" r="9"/><path d="m12 7 4 5-4 5-4-5z"/>',
  sparkles: '<path d="m12 3 2.6 6.4L21 12l-6.4 2.6L12 21l-2.6-6.4L3 12l6.4-2.6zM20 2v4m-2-2h4M3 18v4m-2-2h4"/>',
  flag: '<path d="M5 22V3m0 1c5-5 9 5 14 0v11c-5 5-9-5-14 0"/>',
  shield: '<path d="m12 2 9 4v6c0 5-6 8-9 10-3-2-9-5-9-10V6zM8 12l3 3 5-6"/>',
  trophy: '<path d="M8 3h8v7a4 4 0 0 1-8 0zM8 5H4v3a4 4 0 0 0 4 4m8-7h4v3a4 4 0 0 1-4 4m-4 2v7m-5 0h10"/>',
  settings: '<path d="m9 3-1 3-3 1-2 3 2 2-1 3 3 3 3-1 2 2 3-2 1-3 3-1 2-3-2-2 1-3-3-3-3 1-2-2z"/><circle cx="12" cy="11" r="3"/>',
  home: '<path d="m2 11 10-9 10 9M5 9v12h14V9M9 21v-8h6v8"/>',
  star: '<path d="m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/>',
};

export function icon(name, size = 20) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ICONS.sparkles}</svg>`;
}

export { portrait } from './pixel-portraits.js';
export { renderTerrain } from './pixel-terrain.js';
