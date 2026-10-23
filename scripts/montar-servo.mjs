// Assemble the AI-drawn, complete pieces into the first editable PSD. No pixels are painted here.
// Usage: node scripts/montar-servo.mjs [path-to-transparent-parts-sheet]
import { mkdir, copyFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';
import { writePsdBuffer } from 'ag-psd';

const root = fileURLToPath(new URL('../', import.meta.url));
const out = path.join(root, 'arte/ia/inimigos-pecas');
const source = path.join(out, 'fontes/servo-arrogante-pecas.png');
const torsoSource = path.join(out, 'fontes/servo-arrogante-tronco.png');
await mkdir(path.dirname(source), { recursive: true });
if (process.argv[2] && path.resolve(process.argv[2]) !== source) await copyFile(process.argv[2], source);
if (process.argv[3] && path.resolve(process.argv[3]) !== torsoSource) await copyFile(process.argv[3], torsoSource);

// Crops surround the nine isolated pieces (including their transparent antialiased edges).
// Placement follows docs/moldes/molde-humanoide.png: centre 512, feet 960.
const layout = [
  { name: 'cabelo-tras', crop: [63, 115, 408, 308], x: 160, y: 225, w: 360, h: 400 },
  { name: 'braco-tras', crop: [567, 42, 143, 374], x: 389, y: 490, h: 280 },
  { name: 'perna-tras', crop: [970, 18, 177, 395], x: 435, y: 645, h: 315 },
  { name: 'perna-frente', crop: [138, 431, 186, 395], x: 497, y: 645, h: 315 },
  { name: 'tronco', source: torsoSource, x: 422, y: 470, w: 196, h: 250 },
  { name: 'saia', crop: [842, 498, 396, 307], x: 401, y: 641, w: 270 },
  { name: 'cabeca', crop: [85, 842, 382, 395], x: 328, y: 110, w: 400 },
  { name: 'arma', crop: [566, 825, 186, 414], x: 598, y: 646, h: 310 },
  { name: 'braco-frente', crop: [975, 857, 162, 368], x: 548, y: 490, h: 280 },
];
const layers = [];
for (const piece of layout) {
  const image = sharp(piece.source ?? source);
  if (piece.crop) {
    const [left, top, width, height] = piece.crop;
    image.extract({ left, top, width, height });
  }
  const crop = await image.png().toBuffer();
  const trimmed = await sharp(crop).trim({ threshold: 0 }).png().toBuffer();
  const original = await sharp(trimmed).metadata();
  const w = piece.w ?? Math.round(original.width * piece.h / original.height);
  const h = piece.h ?? Math.round(original.height * piece.w / original.width);
  const png = await sharp(trimmed).resize(w, h, { fit: 'fill', kernel: 'nearest' }).ensureAlpha().png().toBuffer();
  const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
  // Align the visible bottom of each boot with the guide; cropped bounds contain no empty rows.
  const y = piece.name.startsWith('perna-') ? 960 - info.height : piece.y;
  layers.push({ name: piece.name, left: piece.x, top: y,
    imageData: { width: info.width, height: info.height, data: new Uint8ClampedArray(data) }, png });
}
const composite = await sharp({ create: { width: 1024, height: 1024, channels: 4, background: '#00000000' } })
  .composite(layers.map(p => ({ input: p.png, left: p.left, top: p.top }))).png().toBuffer();
const raw = await sharp(composite).raw().toBuffer();
const psd = writePsdBuffer({ width: 1024, height: 1024,
  imageData: { width: 1024, height: 1024, data: new Uint8ClampedArray(raw) },
  // ag-psd uses Photoshop's top-to-bottom order; our layout is bottom-to-top.
  children: layers.map(({ png, ...layer }) => layer).reverse(),
}, { generateThumbnail: false });
await writeFile(path.join(out, 'f01_comum_servo_arrogante.psd'), psd);
await writeFile(path.join(out, 'f01_comum_servo_arrogante.png'), composite);
console.log('Servo: PSD 1024 × 1024 com nove camadas e prévia PNG salvos em arte/ia/inimigos-pecas/.');
