// Place complete AI-drawn pieces. This script only crops, scales and positions artwork.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { assemblePsd } from './lib/montar-psd.mjs';
import { loadEnemyPsd } from './lib/inimigos-psd.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const out = path.join(root, 'arte/ia/inimigos-pecas');
const source = path.join(out, 'fontes/valentao-pecas.png');
const corrected = path.join(out, 'fontes/valentao-tronco-cabelo.png');
const torso = path.join(out, 'fontes/valentao-tronco.png');
const output = path.join(out, 'f01_forte_valentao_alojamentos.psd');
const parts = [
  { name: 'cabelo-tras', source: corrected, crop: [1015, 140, 780, 720], x: 220, y: 245, w: 355, h: 440 },
  { name: 'braco-tras', source, crop: [560, 55, 250, 425], x: 335, y: 454, w: 177, h: 313 },
  { name: 'perna-tras', source, crop: [940, 30, 290, 450], x: 410, y: 650, w: 151, h: 310, feet: 960 },
  { name: 'perna-frente', source, crop: [110, 490, 275, 385], x: 514, y: 650, w: 151, h: 310, feet: 960 },
  { name: 'tronco', source: torso, x: 405, y: 409, w: 275, h: 300 },
  { name: 'saia', source, crop: [850, 570, 425, 295], x: 367, y: 661, w: 343, h: 204 },
  { name: 'cabeca', source, crop: [70, 875, 445, 359], x: 321, y: 113, w: 389, h: 350 },
  { name: 'braco-frente', source, crop: [980, 880, 230, 354], x: 594, y: 454, w: 177, h: 313 },
];
console.log(JSON.stringify(await assemblePsd({ output, parts }), null, 2));
const rig = await loadEnemyPsd(output);
console.log(`Valentão validado: ${rig.body}, ${rig.parts.length} camadas, altura ${rig.feet-rig.top}px.`);
