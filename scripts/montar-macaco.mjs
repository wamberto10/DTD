// Assemble the seven complete AI-drawn monkey pieces, using the quadruped template.
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { assemblePsd } from './lib/montar-psd.mjs';
const root = fileURLToPath(new URL('../', import.meta.url));
const source = path.join(root, 'arte/ia/inimigos-pecas/fontes/macaco-pecas.png');
const p = (name, crop, x, y, w, h, extra = {}) => ({ name, source, crop, x, y, w, h, ...extra });
console.log(await assemblePsd({
  output: path.join(root, 'arte/ia/inimigos-pecas/f01_rapido_macaco_ladrao.psd'),
  parts: [
    p('cauda', [55, 42, 404, 410], 60, 120, 330, 440),
    p('pata-tras-longe', [605, 63, 210, 385], 302, 625, 125, 335, { feet: 960 }),
    p('pata-frente-longe', [958, 73, 275, 385], 594, 625, 145, 335, { feet: 960 }),
    p('corpo', [25, 478, 564, 380], 250, 485, 460, 270),
    p('pata-tras-perto', [612, 480, 188, 373], 352, 625, 125, 335, { feet: 960, flipX: true }),
    p('pata-frente-perto', [937, 472, 246, 393], 648, 625, 145, 335, { feet: 960, flipX: true }),
    p('cabeca', [74, 856, 456, 371], 560, 195, 395, 410),
  ],
}));
