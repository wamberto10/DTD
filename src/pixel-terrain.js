/** Original pixel scenery, drawn on a 500 × 300 grid and enlarged exactly 2×. */
const PATH = [[0, 85], [102.5, 85], [102.5, 205], [237.5, 205], [237.5, 117.5], [367.5, 117.5], [367.5, 222.5], [500, 222.5]];
const PADS = [[67.5, 135], [150, 130], [172.5, 247.5], [192.5, 162.5], [282.5, 162.5], [307.5, 75], [325, 212.5], [415, 162.5], [437.5, 260]];
const PALETTES = [
  { ground: '#416b49', dark: '#33543d', patch: '#4d7650', grass: '#638455', glint: '#8eaa68', tree: ['#193f35', '#285c43', '#39774d', '#57915a', '#83ad68'], water: ['#244e55', '#316f71', '#479594', '#7cb6a6'], rock: ['#334d42', '#536b55', '#74856a', '#9ca587'], stone: ['#546245', '#7b8057', '#a79d70', '#c1b383', '#d3c493'] },
  { ground: '#355e4c', dark: '#254b3f', patch: '#426d51', grass: '#5c855a', glint: '#90b678', tree: ['#153e37', '#225e49', '#377f5b', '#55a16a', '#88bf7b'], water: ['#1e4e5b', '#286e7d', '#419c9e', '#8bc6b3'], rock: ['#294f49', '#426b5b', '#698879', '#a5b6a1'], stone: ['#45604a', '#768868', '#9ca784', '#bac29b', '#d4d7af'] },
  { ground: '#3c5962', dark: '#2c414e', patch: '#4c6970', grass: '#66818a', glint: '#97b1b0', tree: ['#233f46', '#365c60', '#4d7a75', '#73a097', '#a0c3ad'], water: ['#254663', '#356a8b', '#5c98b2', '#a5cbd0'], rock: ['#2e4656', '#526878', '#82939b', '#c1ccca'], stone: ['#495b61', '#798486', '#a4aca5', '#c1c4b5', '#dedfca'] },
];

const rect = (x, y, w, h, fill) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>`;
const polygon = (d, fill) => `<path d="${d}" fill="${fill}"/>`;

function distanceToPath(x, y) {
  return Math.min(...PATH.slice(1).map(([endX, endY], index) => {
    const [startX, startY] = PATH[index];
    const dx = endX - startX, dy = endY - startY;
    const t = Math.max(0, Math.min(1, ((x - startX) * dx + (y - startY) * dy) / (dx * dx + dy * dy)));
    return Math.hypot(x - startX - dx * t, y - startY - dy * t);
  }));
}

function tree(x, y, colors, variety) {
  const [edge, shade, main, light, highlight] = colors;
  let leaves;
  if (variety === 1) {
    leaves = polygon('M-2-44H3V-38H6V-33H9V-28H12V-24H9V-22H15V-17H19V-11H15V-7H5V-3H-7V-6H-16V-11H-19V-16H-14V-22H-9V-24H-12V-29H-8V-34H-5V-39H-2Z', edge)
      + polygon('M-1-40H2V-34H5V-28H9V-25H5V-23H11V-18H15V-13H11V-10H2V-6H-5V-9H-13V-13H-15V-16H-10V-21H-6V-26H-9V-28H-5V-34H-1Z', main)
      + polygon('M-1-39H1V-34H3V-29H6V-26H1V-23H-4V-27H-6V-29H-3V-35H-1Z', light)
      + polygon('M-2-22H4V-19H9V-16H12V-13H3V-12H-1V-14H-8V-17H-5V-20H-2Z', light)
      + rect(-6, -28, 3, 2, highlight) + rect(-10, -16, 4, 2, highlight)
      + rect(2, -10, 8, 2, shade) + rect(4, -31, 2, 4, shade);
  } else {
    leaves = polygon('M-8-36H2V-39H10V-35H15V-31H18V-25H21V-15H17V-9H11V-5H2V-3H-8V-6H-15V-10H-20V-17H-22V-24H-18V-29H-13V-33H-8Z', edge)
      + polygon('M-7-33H3V-36H9V-32H14V-28H16V-22H18V-16H14V-11H9V-8H1V-6H-7V-9H-13V-13H-17V-19H-19V-23H-15V-27H-10V-30H-7Z', shade)
      + polygon('M-7-33H2V-35H8V-31H13V-27H15V-22H12V-18H4V-16H-2V-18H-9V-16H-15V-20H-17V-23H-13V-27H-8V-30H-7Z', main)
      + polygon('M-5-31H3V-33H7V-29H11V-25H8V-23H1V-25H-6V-23H-12V-26H-8V-28H-5Z', light)
      + polygon('M-7-14H-1V-17H5V-15H11V-12H7V-9H-2V-8H-6V-11H-11V-13H-7Z', main)
      + rect(-5, -30, 5, 2, highlight) + rect(2, -28, 5, 2, highlight)
      + rect(-14, -23, 4, 2, light) + rect(-8, -13, 4, 2, light);
  }
  return `<g transform="translate(${x} ${y})">`
    + rect(-15, -1, 30, 5, '#2d493b') + rect(-10, 3, 22, 3, '#35543f')
    + rect(-3, -12, 7, 17, '#424c32') + rect(-1, -10, 3, 14, '#84764c') + rect(-4, 1, 10, 3, '#625f3e')
    + leaves + '</g>';
}

function bush(x, y, palette) {
  return `<g transform="translate(${x} ${y})">`
    + polygon('M-6-3H-9V-8H-6V-11H0V-13H5V-10H9V-7H11V-2H7V1H-3V-1H-6Z', palette.tree[0])
    + polygon('M-5-4H-7V-7H-4V-9H1V-11H4V-8H7V-5H9V-2H4V-1H-2V-3H-5Z', palette.tree[2])
    + rect(-3, -8, 4, 2, palette.tree[3]) + rect(3, -6, 4, 2, palette.tree[3]) + '</g>';
}

function pool(palette) {
  const [edge, deep, water, light] = palette.water;
  return polygon('M18 194H49V198H61V203H68V211H72V232H67V240H57V246H32V242H21V237H14V230H10V210H14V200H18Z', palette.rock[0])
    + polygon('M20 199H48V202H59V207H64V214H68V230H63V237H54V242H33V238H24V233H18V227H14V212H18V204H20Z', edge)
    + polygon('M24 203H46V206H56V211H61V218H65V229H59V234H52V238H35V234H28V230H22V225H18V214H22V207H24Z', deep)
    + polygon('M22 207H42V209H53V213H59V219H61V225H57V229H48V232H34V229H27V225H23V218H20V212H22Z', water)
    + rect(29, 209, 12, 1, light) + rect(25, 214, 7, 1, light) + rect(44, 216, 11, 1, light)
    + rect(28, 225, 12, 1, light) + rect(42, 228, 7, 1, light) + rect(55, 220, 4, 1, light)
    + polygon('M9 171H21V175H30V184H34V199H29V207H17V202H10V190H6V181H9Z', palette.rock[0])
    + polygon('M11 173H20V178H27V185H31V195H27V201H19V198H13V187H9V181H11Z', palette.rock[1])
    + rect(12, 175, 7, 4, palette.rock[2]) + rect(25, 186, 4, 6, palette.rock[2])
    + rect(18, 181, 9, 23, deep) + rect(19, 182, 7, 21, water)
    + rect(20, 184, 2, 19, light) + rect(24, 190, 1, 11, '#c6d7bc')
    + rect(17, 203, 12, 2, water) + rect(20, 206, 12, 1, light)
    + polygon('M16 232H20V228H26V231H29V238H26V241H18V237H14V234H16Z', palette.rock[1])
    + rect(19, 231, 6, 3, palette.rock[2])
    + polygon('M57 239H63V236H68V241H72V247H68V250H59V246H55V242H57Z', palette.rock[1])
    + rect(61, 240, 6, 3, palette.rock[2]);
}

function mountain(palette, stage) {
  const [shadow, dark, stone, snow] = palette.rock;
  return polygon('M380 0H500V91H488V84H475V77H462V67H447V61H435V49H420V38H405V27H390V16H380Z', shadow)
    + polygon('M391 0H500V76H488V69H475V60H462V55H449V43H435V35H423V25H408V14H399V7H391Z', dark)
    + polygon('M430 0H451V8H460V17H470V29H480V39H487V51H494V63H500V68H488V62H475V52H465V42H454V31H443V22H432V11H425V4H430Z', stone)
    + polygon('M390 0H404V5H413V14H423V25H431V32H438V40H430V35H420V27H410V19H400V12H390Z', stone)
    + polygon('M473 0H487V10H493V18H500V35H493V28H484V19H478V10H470V4H473Z', stone)
    + polygon('M428 0H447V6H452V12H457V17H447V13H441V8H431V5H425V2H428Z', snow)
    + rect(434, 22, 3, 15, shadow) + rect(462, 33, 3, 18, shadow) + rect(484, 49, 4, 13, shadow)
    + rect(415, 19, 4, 12, dark) + rect(477, 10, 3, 9, dark)
    + (stage === 3 ? polygon('M382 0H411V4H417V7H401V5H390V3H382ZM458 0H500V5H493V8H480V5H467V3H458Z', '#d5e0d9') : '');
}

function temple(palette) {
  return `<g transform="translate(479 204)">`
    + rect(-27, 18, 56, 6, palette.dark) + rect(-24, 13, 50, 7, '#5c6b55')
    + rect(-21, 10, 45, 5, '#a2a181') + rect(-18, -15, 36, 27, '#ccb98c')
    + rect(-15, -13, 30, 24, '#8d795a') + rect(-15, -9, 5, 21, '#e1c596')
    + rect(10, -9, 5, 21, '#e1c596') + rect(-8, -11, 16, 23, '#344d45')
    + rect(-6, -9, 12, 20, '#ba9b5f') + rect(-4, -7, 8, 18, '#f1cf78')
    + rect(-2, -5, 4, 16, '#ffe2a1') + rect(-9, -2, 2, 8, '#e0af59')
    + rect(7, -2, 2, 8, '#e0af59') + rect(-19, 9, 39, 3, '#77674c')
    + polygon('M-27-15H-21V-18H-13V-22H-6V-28H-2V-33H2V-28H6V-22H13V-18H21V-15H27V-10H22V-8H-23V-11H-27Z', '#193c39')
    + polygon('M-26-15H-20V-17H-12V-21H-5V-26H-2V-30H1V-26H5V-21H12V-17H20V-15H26V-13H18V-15H10V-17H4V-19H-4V-17H-11V-15H-19V-13H-26Z', '#83a67c')
    + rect(-20, -11, 41, 2, '#c4b67d') + rect(-11, -28, 22, 10, '#a6976c')
    + polygon('M-19-29H-14V-32H-7V-36H-3V-41H2V-36H7V-32H14V-29H19V-25H-19Z', '#204740')
    + polygon('M-19-29H-13V-31H-6V-35H-2V-39H1V-35H6V-31H13V-29H19V-27H11V-29H5V-31H-5V-29H-12V-27H-19Z', '#8da77a')
    + rect(-1, -45, 3, 7, '#d8ba75') + rect(-3, -46, 7, 2, '#efd493')
    + rect(-22, -7, 3, 6, '#e0ba6d') + rect(20, -7, 3, 6, '#e0ba6d')
    + rect(-21, -8, 1, 2, '#f3dfa1') + rect(21, -8, 1, 2, '#f3dfa1')
    + rect(-15, 17, 31, 2, '#b5b28b') + rect(-20, 21, 42, 2, '#b5b28b')
    + '</g>';
}

function gate() {
  return `<g transform="translate(14 72)">`
    + rect(-11, 4, 4, 25, '#454d37') + rect(13, 4, 4, 25, '#454d37')
    + rect(-10, 4, 2, 23, '#a08b5b') + rect(14, 4, 2, 23, '#a08b5b')
    + rect(-15, 0, 36, 4, '#435f43') + rect(-12, -2, 30, 2, '#c4ac6d')
    + rect(-15, 0, 5, 2, '#d5c387') + rect(16, 0, 5, 2, '#d5c387')
    + polygon('M-4 6H10V20H7V23H-1V20H-4Z', '#a87e4c')
    + rect(2, 9, 2, 11, '#eed49a') + rect(-1, 12, 8, 2, '#eed49a')
    + rect(-2, 16, 10, 1, '#eed49a') + '</g>';
}

export function renderTerrain(stage = 1) {
  const palette = PALETTES[Math.min(2, Math.max(0, Number(stage) - 1))] || PALETTES[0];
  let seed = 71839;
  const random = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  const flowers = ['#d5c178', '#b7c68d', '#cc9ca2'];
  let texture = '', details = '', pavers = '';

  // Pixel clusters keep the grass textured without making placement markers hard to read.
  for (let y = 3; y < 300; y += 6) {
    for (let x = 1; x < 500; x += 6) {
      const roll = random();
      const px = x + Math.floor(random() * 4), py = y + Math.floor(random() * 4);
      if (roll < 0.22) texture += rect(px, py, 3, 2, palette.patch);
      else if (roll < 0.3) texture += rect(px, py, 2, 1, palette.dark);
      else if (roll < 0.37) texture += rect(px, py, 1, 2, palette.grass) + rect(px + 2, py + 1, 1, 1, palette.grass);
      if (roll > 0.985 && distanceToPath(px, py) > 18 && !PADS.some(([padX, padY]) => Math.hypot(padX - px, padY - py) < 19)) {
        details += rect(px, py - 2, 1, 4, palette.dark) + rect(px - 1, py - 2, 3, 2, flowers[Math.floor(random() * flowers.length)]);
      }
    }
  }

  for (let y = 0; y < 300; y += 6) {
    for (let x = (y / 6) % 2 ? -5 : 0; x < 500; x += 11) {
      const cx = x + 4, cy = y + 2;
      if (distanceToPath(cx, cy) > 7 || ![[x, y], [x + 8, y], [x, y + 4], [x + 8, y + 4]].every(([px, py]) => distanceToPath(px, py) < 10)) continue;
      const stone = random() < .25 ? palette.stone[2] : palette.stone[3];
      pavers += rect(x, y, 9, 5, palette.stone[2]) + rect(x + 1, y, 7, 4, stone) + rect(x + 1, y, 5, 1, palette.stone[4]);
      if (random() > .8) pavers += rect(x + 5, y + 2, 1, 2, palette.stone[1]);
    }
  }

  const treeSites = [
    [13, 53], [43, 44], [74, 40], [113, 36], [145, 39], [181, 42], [220, 37], [255, 35], [286, 39], [329, 36], [369, 28],
    [25, 134], [48, 121], [121, 110], [128, 168], [157, 183], [177, 123], [204, 101], [215, 142], [271, 117], [345, 102],
    [395, 100], [427, 102], [456, 102], [489, 120], [485, 156], [456, 166], [397, 203], [349, 267], [303, 277],
    [264, 258], [222, 257], [185, 299], [145, 285], [109, 275], [83, 291], [47, 290], [13, 282], [385, 296], [422, 297], [472, 299],
  ];
  const trees = treeSites
    .filter(([x, y]) => {
      const centerY = y - 19;
      return distanceToPath(x, centerY) > 29
        && !PADS.some(([padX, padY]) => Math.hypot(x - padX, centerY - padY) < 37)
        && !(x < 79 && y > 162 && y < 263)
        && !(x > 374 && y < 94);
    })
    .sort((a, b) => a[1] - b[1])
    .map(([x, y], index) => tree(x, y, index % 6 === 2 ? ['#564b30', '#7e703f', '#a08c48', '#c1aa5d', '#dfcc81'] : palette.tree, index % 4 === 0 ? 1 : 0))
    .join('');

  let shrubs = '';
  for (let i = 0; i < 54; i++) {
    const x = Math.floor(random() * 500), y = Math.floor(random() * 300);
    if (distanceToPath(x, y - 5) < 22 || PADS.some(([px, py]) => Math.hypot(px - x, py - y + 5) < 26) || (x < 80 && y > 160 && y < 260) || (x > 375 && y < 90) || (x > 446 && y > 156 && y < 232)) continue;
    shrubs += bush(x, y, palette);
  }

  const road = 'M-15 85H102.5V205H237.5V117.5H367.5V222.5H515';
  return `<g class="pixel-terrain" shape-rendering="crispEdges" transform="scale(2)">`
    + rect(0, 0, 500, 300, palette.ground)
    + polygon('M0 0H149V10H203V20H179V28H102V35H59V49H0ZM271 0H377V13H349V21H303V15H271Z', palette.dark)
    + polygon('M127 100H195V111H216V139H205V165H163V180H126ZM259 137H300V144H336V165H346V183H309V190H267V170H254V149H259Z', palette.patch)
    + polygon('M0 280H42V271H84V282H121V290H177V281H214V293H258V284H299V278H340V292H385V282H442V288H500V300H0Z', palette.dark)
    + texture + mountain(palette, stage) + pool(palette)
    + `<path d="${road}" fill="none" stroke="${palette.dark}" stroke-width="32" stroke-linejoin="miter"/>`
    + `<path d="${road}" fill="none" stroke="${palette.stone[0]}" stroke-width="28" stroke-linejoin="miter"/>`
    + `<path d="${road}" fill="none" stroke="${palette.stone[1]}" stroke-width="25" stroke-linejoin="miter"/>`
    + `<path d="${road}" fill="none" stroke="${palette.stone[2]}" stroke-width="22" stroke-linejoin="miter"/>`
    + `<path d="${road}" fill="none" stroke="${palette.stone[3]}" stroke-width="18" stroke-linejoin="miter"/>`
    + pavers
    + rect(224, 108, 28, 19, palette.stone[1])
    + Array.from({ length: 6 }, (_, i) => rect(225, 108 + i * 3, 25, 1, palette.stone[4]) + rect(225, 109 + i * 3, 25, 1, palette.stone[2])).join('')
    + rect(223, 106, 2, 24, palette.stone[0]) + rect(251, 106, 2, 24, palette.stone[0])
    + details + shrubs + trees + gate() + temple(palette)
    + rect(0, 0, 500, 2, palette.dark) + rect(0, 298, 500, 2, palette.dark)
    + rect(0, 0, 2, 300, palette.dark) + rect(498, 0, 2, 300, palette.dark)
    + '</g>';
}
