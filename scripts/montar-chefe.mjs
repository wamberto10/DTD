// Assemble the nine complete imagegen-drawn elite-disciple pieces. No pixels are painted here.
// Usage: node scripts/montar-chefe.mjs
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { assemblePsd } from './lib/montar-psd.mjs';
import { loadEnemyPsd } from './lib/inimigos-psd.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const folder = path.join(root, 'arte/ia/chefes-pecas');
const source = path.join(folder, 'fontes/discipulo-pecas.png');
const output = path.join(folder, 'f01_chefe_discipulo_interno_elite.psd');

// Layout is bottom-to-top. Crops include transparent padding around each complete piece.
const parts = [
  { name: 'cabelo-tras', source: path.join(folder, 'fontes/discipulo-cabelo-tras.png'), x: 195, y: 190, w: 260, h: 450 },
  { name: 'braco-tras', source, crop: [545, 14, 191, 392], x: 375, y: 480, w: 150, h: 300 },
  { name: 'perna-tras', source, crop: [977, 2, 182, 410], x: 437, y: 650, w: 90, h: 310, feet: 960 },
  { name: 'perna-frente', source, crop: [140, 443, 183, 395], x: 509, y: 650, w: 99, h: 310, feet: 960 },
  { name: 'tronco', source, crop: [526, 435, 225, 404], x: 421, y: 453, w: 205, h: 278 },
  { name: 'saia', source, crop: [840, 454, 409, 381], x: 399, y: 635, w: 267, h: 250 },
  { name: 'cabeca', source, crop: [42, 850, 372, 390], x: 327, y: 80, w: 390, h: 410 },
  { name: 'arma', source, crop: [486, 836, 398, 394], x: 540, y: 715, w: 250, h: 247 },
  { name: 'braco-frente', source, crop: [964, 848, 208, 386], x: 510, y: 480, w: 160, h: 300 },
];

await assemblePsd({ output, parts });
const rig = await loadEnemyPsd(output);
console.log(`Discípulo Interno de Elite: ${rig.body}, ${rig.parts.length} camadas, altura ${rig.feet-rig.top}px, pés ${rig.feet}.`);
