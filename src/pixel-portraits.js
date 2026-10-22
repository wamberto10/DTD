// Original, grid-drawn cultivators. One logical pixel is four SVG units.
// Heroes with painted chibi art (public/arte/herois) use it instead.
import { heroArt } from './chibi-art.js';

const INK = '#10252b';
const SKIN = { skin: '#e9bd8c', light: '#f8d7a1', shade: '#b97962' };
const portraitCache = new Map();
const looks = {
  faxineiro: { robe: '#bba06c', trim: '#567b65', hair: '#20333a', style: 'knot', weapon: 'broom' },
  aprendiz: { robe: '#7fada2', trim: '#e5d9aa', hair: '#243544', style: 'tail', weapon: 'sword' },
  'lin-yue': { robe: '#65a67a', trim: '#e9d999', hair: '#473a36', style: 'buns', weapon: 'flower' },
  'han-feng': { robe: '#7b9671', trim: '#d6b56f', hair: '#242f34', style: 'wild', weapon: 'sword', scarf: '#d6b56f' },
  'su-lan': { robe: '#6e9fbd', trim: '#e4f0e1', hair: '#d6e5df', style: 'long', weapon: 'ice' },
  'mo-yan': { robe: '#af593f', trim: '#efb762', hair: '#4c2d31', style: 'spikes', weapon: 'fist', band: '#efac5f' },
  'shen-lei': { robe: '#8076ad', trim: '#d2dfeb', hair: '#424468', style: 'tail', weapon: 'lightning', band: '#d7e8ec' },
  'qing-lian': { robe: '#71af9b', trim: '#ecdfb2', hair: '#29484d', style: 'buns', weapon: 'lotus', crown: true },
  'long-chen': { robe: '#977344', trim: '#f4cf75', hair: '#382e35', style: 'wild', weapon: 'dragon', crown: true },
  'bai-ling': { robe: '#b6cbd6', trim: '#f4e7b7', hair: '#d6e8ec', style: 'coiffure', weapon: 'moon', crown: true },
  'wu-kong': { robe: '#74608d', trim: '#d3b8ed', hair: '#d9d2e8', style: 'long', weapon: 'void' },
  'yan-tian': { robe: '#bf814d', trim: '#ffe1a0', hair: '#ab543c', style: 'spikes', weapon: 'sun', crown: true },
  'dao-yuan': { robe: '#dac7a2', trim: '#e6ae5c', hair: '#34414b', style: 'long', weapon: 'dragon', crown: true },
  'xing-he': { robe: '#a18bb9', trim: '#f2dfac', hair: '#c8d4e7', style: 'twintail', weapon: 'star', crown: true },
};

function shade(hex, fraction) {
  const rgb = hex.match(/[a-f\d]{2}/gi).map(c => Number.parseInt(c, 16));
  return `#${rgb.map(c => Math.round(fraction > 0 ? c + (255 - c) * fraction : c * (1 + fraction)).toString(16).padStart(2, '0')).join('')}`;
}

function drawPixels(rows, x, y, palette) {
  let out = '';
  rows.forEach((row, yy) => {
    let start = 0;
    for (let xx = 0; xx <= row.length; xx++) {
      if (xx === row.length || row[xx] !== row[start]) {
        const fill = palette[row[start]];
        if (fill) out += `<rect x="${x + start}" y="${y + yy}" width="${xx - start}" height="1" fill="${fill}"/>`;
        start = xx;
      }
    }
  });
  return out;
}

const pixel = (x, y, width, height, fill, opacity) => `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${fill}"${opacity ? ` opacity="${opacity}"` : ''}/>`;
function line(x0, y0, x1, y1, color, width = 1) {
  let out = '';
  const dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
  const dy = -Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
  let error = dx + dy;
  while (true) {
    out += pixel(x0, y0, width, width, color);
    if (x0 === x1 && y0 === y1) break;
    const twice = 2 * error;
    if (twice >= dy) { error += dy; x0 += sx; }
    if (twice <= dx) { error += dx; y0 += sy; }
  }
  return out;
}

function star(x, y, color, large = false) {
  return pixel(x, y - 1, 1, 3, color) + pixel(x - 1, y, 3, 1, color)
    + (large ? pixel(x, y - 2, 1, 5, color) + pixel(x - 2, y, 5, 1, color) : '');
}

function background(color, element) {
  let art = pixel(0, 0, 30, 35, '#172d35') + pixel(0, 0, 30, 16, '#203940');
  // Pixel-stair mountain silhouettes, distant roof, and courtyard paving.
  const mountain = [8, 7, 5, 4, 2, 3, 5, 6, 8, 9, 8, 6, 4, 3, 2, 0, 1, 3, 4, 6, 7, 9, 8, 6, 5, 4, 6, 7, 8, 10];
  mountain.forEach((height, x) => { art += pixel(x, 8 + height, 1, 19 - height, '#2a4547'); });
  art += pixel(0, 23, 30, 12, '#203a3d');
  art += pixel(0, 27, 30, 8, '#2c4141');
  for (let y = 28; y < 35; y += 3) {
    art += pixel(0, y, 30, 1, '#354b48');
    for (let x = y % 2 ? 2 : 6; x < 30; x += 8) art += pixel(x, y, 1, 3, '#1a3035');
  }
  art += pixel(1, 13, 5, 1, '#344f4c') + pixel(2, 12, 3, 1, '#405c54');
  art += pixel(24, 15, 5, 1, '#344f4c') + pixel(25, 14, 3, 1, '#405c54');
  art += pixel(4, 7, 1, 2, color, '.65') + pixel(23, 5, 2, 1, color, '.55');
  art += pixel(1, 32, 2, 1, shade(color, -.25), '.6') + pixel(26, 30, 3, 1, shade(color, -.25), '.5');
  if (element === 'fire') art += pixel(2, 19, 1, 3, '#c37d53', '.5') + pixel(27, 21, 1, 2, '#db9f5e', '.5');
  return `<g data-pixel-backdrop="true">${art}</g>`;
}

function aura(hero, look, tower) {
  const rare = ['epic', 'legendary', 'ur', 'urplus'].includes(hero.rarity);
  if (!rare && hero.element === 'physical') return '';
  const colors = { physical: '#dac697', fire: '#eeb36a', ice: '#a8e0e7', nature: '#b9dca3', lightning: '#dbc3f3', void: '#ba9bd9' };
  const color = colors[hero.element] || '#d9c48e';
  let out = '';
  if (!tower) {
    const edge = [11, 8, 6, 4, 3, 2, 2, 1, 1, 1, 2, 2, 3, 4, 6, 8];
    for (let i = 0; i < edge.length; i++) {
      out += pixel(2 + edge[i], 4 + i, 1, 1, color, '.35');
      out += pixel(27 - edge[i], 4 + i, 1, 1, color, '.35');
    }
  }
  out += star(4, 16, color) + star(26, 12, color) + pixel(5, 25, 1, 1, color);
  if (rare) out += star(8, 4, color) + star(23, 26, color);
  if (hero.rarity === 'urplus') out += star(15, 2, '#f5e9bd', true) + star(3, 7, color);
  return `<g class="pixel-aura">${out}</g>`;
}

function hairBack(look) {
  const dark = shade(look.hair, -.35), light = shade(look.hair, .18);
  let out = '';
  if (['long', 'coiffure', 'twintail'].includes(look.style)) {
    out += drawPixels([
      '..hhhhhhhh....', '.hHHHHHHHHhh..', 'hHHHHHHHHHHHh.',
      'hHHh....hHHHh.', 'hHHh....hHHHh.', 'hHHh....hHHHh.',
      'hHh......hHHh.', 'hHh......hHHh.', 'hHh......hHHh.',
      'hHh......hHHh.', 'hHh......hHHh.', 'hHh......hHHh.',
      'hHh......hHHh.', '.hh......hHh..', '..........h...',
    ], 8, 7, { h: dark, H: look.hair });
    if (look.style === 'twintail') out += pixel(6, 9, 2, 12, look.hair) + pixel(23, 9, 2, 12, look.hair) + pixel(6, 10, 2, 1, '#e8cc8d') + pixel(23, 10, 2, 1, '#e8cc8d');
  }
  if (look.style === 'tail') out += drawPixels(['.hh', 'hHH', 'hHH', 'hHH', '.HH', '.HH', '.Hh', '.Hh', '..h'], 21, 9, { h: dark, H: look.hair });
  if (look.style === 'wild') out += drawPixels(['..hh........hh..', '.hHHh......hHHh.', 'hHHHHh....hHHHHh', '.HHh........hHH.', 'hHh..........hHh', '.h............h.'], 7, 9, { h: dark, H: look.hair });
  if (look.style === 'coiffure') out += pixel(11, 3, 8, 4, dark) + pixel(12, 3, 6, 3, light) + pixel(10, 5, 10, 1, look.trim);
  return out;
}

function weapon(look) {
  const trim = look.trim;
  if (look.weapon === 'broom') return `<g class="pixel-broom">${line(25, 4, 21, 29, INK, 2)}${line(25, 4, 21, 28, '#ab8351')}${line(26, 4, 22, 28, '#e2bd79')}${drawPixels([
    '...oo...', '..oSSo..', '..oSSo..', '.oSssSo.', '.oSssSo.', 'oSsssssO', 'oSsSssSO', '.OOOOOO.',
  ], 17, 26, { o: '#574b35', O: '#574b35', S: '#d6be78', s: '#a58b55' })}${pixel(20, 28, 5, 1, '#e9d393')}</g>`;
  if (look.weapon === 'sword' || look.weapon === 'dragon') {
    let out = line(23, 4, 23, 23, INK, 3) + pixel(24, 3, 1, 2, '#f4e8bc') + pixel(24, 5, 1, 15, '#dbe6d6') + pixel(25, 5, 1, 15, '#84b6b0') + pixel(21, 20, 8, 1, INK) + pixel(22, 20, 6, 1, trim) + pixel(24, 21, 1, 5, '#8f684b') + pixel(23, 26, 3, 1, trim);
    if (look.weapon === 'dragon') out += pixel(23, 3, 1, 6, trim) + pixel(22, 6, 1, 5, trim) + pixel(26, 8, 1, 7, '#e7aa53') + pixel(20, 19, 3, 1, '#ebcf86') + pixel(26, 18, 3, 1, '#ebcf86');
    return out;
  }
  if (['flower', 'lotus', 'moon'].includes(look.weapon)) {
    let out = pixel(24, 8, 2, 22, INK) + pixel(24, 8, 1, 21, '#ad9a60');
    if (look.weapon === 'moon') out += drawPixels(['..GGG..', '.Gg....', 'Gg.....', 'Gg...G.', '.GggG..', '..GG...'], 22, 3, { G: '#f0e6c1', g: '#a9c9d6' });
    else out += drawPixels(['...P...', '..PpP..', 'P.PpP.P', '.PpppP.', '..PGP..', '...G...', '..G.G..'], 21, 4, { P: look.weapon === 'lotus' ? '#f2dacb' : '#e9b5bc', p: '#f9e5b3', G: '#95bd78' });
    return out;
  }
  if (look.weapon === 'lightning') return drawPixels(['....PP', '...PP.', '..PP..', '.PP...', 'PPPP..', '..PP..', '.PP...', '.P....'], 23, 9, { P: '#e5d9fb' }) + pixel(23, 20, 2, 4, '#e7d7aa');
  if (look.weapon === 'ice') return drawPixels(['...P...', '...P...', '.P.P.P.', '..PPP..', 'PPPPPPP', '..PPP..', '.P.P.P.', '...P...', '...P...'], 21, 12, { P: '#c1eced' }) + pixel(24, 15, 1, 3, '#f5f6df');
  if (look.weapon === 'void') return drawPixels(['..PPPP..', '.P....P.', 'P......P', 'P..pp..P', 'P..pp..P', 'P......P', '.P....P.', '..PPPP..'], 20, 12, { P: '#be9de9', p: '#efe0fb' });
  if (look.weapon === 'star') return star(24, 16, '#f7dfaa', true) + star(26, 10, '#d3b3ef') + star(25, 24, '#b8cee8');
  return drawPixels(['...F...', '..FF...', '.FfF.F.', '.FffFF.', 'FfllfF.', 'FlllffF', '.FffFF.', '..FFF..'], 21, 13, { F: '#d66a3f', f: '#f1ac51', l: '#ffdf8e' });
}

function robes(look, hero) {
  const dark = shade(look.robe, -.43), shadow = shade(look.robe, -.25), light = shade(look.robe, .2);
  let out = drawPixels([
    '.....OOOO.....', '...OOLLCCOO...', '..OLLLCLCCCO..',
    '.OLLLLLCLCCCO.', 'OLLLLLLCSSCCCO', 'OLLLCLLSSSCCCO',
    'OLLLOLLSSSCOCO', 'OLLOOLLSSSCOCO', '.OOOOLLSSSCOOO',
    '...OOAAAAAAO..', '...OLTTTCCCO..', '..OOLLTTCCCCO.',
    '..OLLLTTSCCCCO', '..OLLLTTSCCCCO', '.OLLLLTS.SCCCO',
    '.OLLLCTS.SCCCO', '.OLLLCSOOSCCCO', '.OCCCSO..OSCCO',
    '.OOOOO....OOOO',
  ], 7, 16, { O: INK, L: light, C: look.robe, S: shadow, A: look.trim, T: '#e2d8b4' });
  out += pixel(10, 33, 4, 1, '#3b4240') + pixel(17, 33, 4, 1, '#3b4240');
  out += pixel(9, 34, 5, 1, INK) + pixel(17, 34, 5, 1, INK);
  out += pixel(7, 23, 2, 3, SKIN.shade) + pixel(7, 23, 2, 2, SKIN.skin);
  out += pixel(22, 23, 2, 3, SKIN.shade) + pixel(22, 23, 2, 2, SKIN.skin);
  out += pixel(14, 26, 2, 1, '#f4df9f');
  if (hero.id === 'faxineiro') out += pixel(10, 30, 4, 3, '#556e60') + pixel(17, 30, 4, 3, '#425c54') + pixel(10, 31, 4, 1, '#789180');
  if (look.scarf) out += pixel(9, 17, 12, 2, look.scarf) + line(10, 18, 5, 22, look.scarf, 2) + pixel(4, 23, 2, 1, look.scarf);
  if (hero.id === 'mo-yan') out += pixel(8, 19, 3, 4, SKIN.skin) + pixel(20, 19, 3, 4, SKIN.shade) + pixel(7, 22, 4, 2, '#785343') + pixel(20, 22, 4, 2, '#785343');
  if (['legendary', 'ur', 'urplus'].includes(hero.rarity)) out += pixel(8, 18, 4, 2, look.trim) + pixel(20, 18, 4, 2, look.trim) + pixel(10, 19, 2, 1, dark) + pixel(21, 19, 2, 1, dark);
  return out;
}

function head(look, hero) {
  const hairShadow = shade(look.hair, -.3), hairLight = shade(look.hair, .22);
  let out = drawPixels([
    '...OOOOOO...', '..OhHHHHhO..', '.OhHHHHHHhO.', 'OhHHHHHHHHhO',
    'OhHhhHHhHHhO', 'OhhsssssshhO', '.OslsssslsO.', '.OsllssllsO.',
    '.OslsssslsO.', '..OssssssO..', '...OssssO...', '....OOOO....',
  ], 9, 5, { O: INK, h: hairShadow, H: look.hair, s: SKIN.skin, l: SKIN.light });
  out += pixel(11, 11, 2, 1, hairShadow) + pixel(17, 11, 2, 1, hairShadow);
  out += pixel(12, 12, 2, 2, '#23333a') + pixel(17, 12, 2, 2, '#23333a');
  out += pixel(12, 12, 1, 1, '#f9e8c4') + pixel(17, 12, 1, 1, '#f9e8c4');
  out += pixel(15, 13, 1, 1, SKIN.shade) + pixel(14, 15, 3, 1, SKIN.shade);
  out += pixel(11, 14, 1, 1, '#d49375') + pixel(19, 14, 1, 1, '#d49375');
  out += pixel(12, 6, 5, 1, hairLight) + pixel(11, 7, 2, 1, hairLight) + pixel(18, 8, 1, 2, hairLight);
  if (['knot', 'tail', 'buns'].includes(look.style)) out += pixel(13, 2, 5, 3, INK) + pixel(14, 2, 3, 2, look.hair) + pixel(13, 4, 5, 1, look.trim);
  if (look.style === 'buns') out += pixel(7, 6, 4, 3, INK) + pixel(8, 6, 2, 2, look.hair) + pixel(20, 6, 4, 3, INK) + pixel(21, 6, 2, 2, look.hair) + pixel(7, 8, 3, 1, look.trim) + pixel(21, 8, 3, 1, look.trim);
  if (look.style === 'spikes') out += drawPixels(['...H..H....', '.H.HHHH.H..', '..HHHHHHH..', 'HHHHHHHHHHH', '.HHHHHHHH..'], 9, 2, { H: look.hair }) + pixel(13, 4, 2, 1, hairLight);
  if (look.band) out += pixel(10, 9, 10, 1, look.band) + pixel(20, 9, 3, 1, look.band) + pixel(22, 10, 2, 2, look.band);
  if (look.crown) {
    out += pixel(10, 4, 11, 1, look.trim) + pixel(10, 3, 1, 2, look.trim) + pixel(20, 3, 1, 2, look.trim) + pixel(14, 2, 3, 2, look.trim) + pixel(15, 2, 1, 1, '#f8ebc7');
    if (hero.id === 'long-chen') out += pixel(9, 3, 1, 3, '#dfc277') + pixel(8, 2, 1, 2, '#dfc277') + pixel(21, 3, 1, 3, '#dfc277') + pixel(22, 2, 1, 2, '#dfc277');
    if (hero.id === 'xing-he') out += star(15, 2, '#f7e8bc');
  }
  if (hero.id === 'dao-yuan') out += pixel(13, 6, 2, 3, '#cfddd4') + pixel(15, 7, 1, 3, '#cfddd4');
  if (hero.id === 'wu-kong') out += pixel(13, 12, 1, 1, '#caabec') + pixel(18, 12, 1, 1, '#caabec');
  return out;
}

export function portrait(hero, variant = 'card') {
  const cacheKey = `${hero.id}:${hero.rarity}:${hero.element}:${variant}`;
  if (portraitCache.has(cacheKey)) return portraitCache.get(cacheKey);
  const look = looks[hero.id] || looks.faxineiro;
  const transparent = variant === 'tower' || variant === 'banner';
  const chibi = heroArt(hero);
  if (chibi) {
    // Same 120 × 140 frame as the pixel drawing, so every card, banner and tower keeps its layout.
    const backdrop = transparent ? '' : `<g transform="scale(4)" shape-rendering="crispEdges">${background(look.robe, hero.element)}</g>`;
    const svg = `<svg class="hero-portrait chibi-portrait" viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${backdrop}<image href="${chibi.url}" x="-6" y="4" width="132" height="136" preserveAspectRatio="xMidYMax meet"/></svg>`;
    portraitCache.set(cacheKey, svg);
    return svg;
  }
  let art = transparent ? '' : background(look.robe, hero.element);
  art += aura(hero, look, transparent);
  if (look.weapon === 'sun') art += drawPixels(['....GGGG....', '..GG....GG..', '.G........G.', 'G..........G', 'G..........G', 'G..........G', '.G........G.', '..GG....GG..', '....GGGG....'], 9, 3, { G: '#e6bf6b' });
  art += hairBack(look) + weapon(look) + robes(look, hero) + head(look, hero);
  const svg = `<svg class="hero-portrait pixel-portrait" viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" shape-rendering="crispEdges" data-pixel-art="true"><g transform="scale(4)">${art}</g></svg>`;
  portraitCache.set(cacheKey, svg);
  return svg;
}
