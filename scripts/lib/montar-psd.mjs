// Packs complete AI-drawn cutouts into editable PSD layers; it never draws missing artwork.
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { writePsdBuffer } from 'ag-psd';
import { alphaBounds } from './inimigos-psd.mjs';

export async function assemblePsd({ output, parts }) {
  const layers = [];
  for (const part of parts) {
    const input = sharp(part.source).ensureAlpha();
    if (part.crop) {
      const [left, top, width, height] = part.crop;
      input.extract({ left, top, width, height });
    }
    let extracted = await input.raw().toBuffer({ resolveWithObject: true });
    if (part.flipX) extracted = await sharp(extracted.data, { raw: extracted.info }).flop().raw().toBuffer({ resolveWithObject: true });
    const bounds = alphaBounds({ width: extracted.info.width, height: extracted.info.height, data: extracted.data });
    const w = part.w ?? Math.round(bounds.width * part.h / bounds.height);
    const h = part.h ?? Math.round(bounds.height * part.w / bounds.width);
    if (!(w > 0 && h > 0)) throw new Error(`Defina w ou h para ${part.name}.`);
    const png = await sharp(extracted.data, { raw: extracted.info })
      .extract({ left: bounds.left, top: bounds.top, width: bounds.width, height: bounds.height })
      .resize(w, h, { fit: 'fill', kernel: 'nearest' }).png().toBuffer();
    const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
    const y = part.feet === undefined ? part.y : part.feet - info.height;
    if (part.x < 0 || y < 0 || part.x + w > 1024 || y + h > 1024) throw new Error(`${part.name} fora da tela 1024.`);
    layers.push({ name: part.name, left: part.x, top: y, png,
      imageData: { width: w, height: h, data: new Uint8ClampedArray(data) } });
  }
  const composite = await sharp({ create: { width: 1024, height: 1024, channels: 4, background: '#00000000' } })
    .composite(layers.map(p => ({ input: p.png, left: p.left, top: p.top }))).png().toBuffer();
  const data = await sharp(composite).raw().toBuffer();
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, writePsdBuffer({ width: 1024, height: 1024,
    imageData: { width: 1024, height: 1024, data: new Uint8ClampedArray(data) },
    children: layers.map(({ png, ...p }) => p).reverse(),
  }, { generateThumbnail: false }));
  const png = output.replace(/\.psd$/i, '.png');
  await writeFile(png, composite);
  return { output, png, layers: layers.map(({ name, left, top, imageData }) => ({ name, x: left, y: top, w: imageData.width, h: imageData.height })) };
}
