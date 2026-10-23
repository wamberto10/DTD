import { readFile } from 'node:fs/promises';
import { readPsd, initializeCanvas } from 'ag-psd';

initializeCanvas(() => { throw new Error('Use imageData para ler as peças.'); },
  (width, height) => ({ width, height, data: new Uint8ClampedArray(width * height * 4) }));

export const BODY_LAYERS = {
  humanoide: ['cabelo-tras', 'braco-tras', 'perna-tras', 'perna-frente', 'tronco', 'saia', 'cabeca', 'arma', 'braco-frente'],
  quadrupede: ['cauda', 'pata-tras-longe', 'pata-frente-longe', 'corpo', 'pata-tras-perto', 'pata-frente-perto', 'cabeca'],
  voador: ['asa-longe', 'corpo', 'asa-perto'],
};
const OPTIONAL = new Set(['cabelo-tras', 'saia', 'arma', 'cauda']);

export function alphaBounds(bitmap) {
  const { width, height, data } = bitmap;
  let left = width, top = height, right = -1, bottom = -1;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    if (data[(y * width + x) * 4 + 3] < 8) continue;
    left = Math.min(left, x); top = Math.min(top, y); right = Math.max(right, x); bottom = Math.max(bottom, y);
  }
  if (right < left) throw new Error('Camada vazia.');
  return { left, top, width: right - left + 1, height: bottom - top + 1 };
}

// The attachment is in the top cap of a hanging limb, and in the bottom neck of a head.
// Work in original canvas coordinates, before trimming or resizing the layer.
export function detectPivot(name, bitmap, x, y, body = 'humanoide') {
  const b = alphaBounds(bitmap);
  if (body === 'quadrupede' && name === 'cabeca') {
    // A right-facing animal joins the body at the back of its neck, in the lower-left of the head.
    // Its chin is the lowest point and must not be mistaken for the attachment, as on a humanoid.
    let sx = 0, sy = 0, total = 0;
    for (let row = b.top + Math.floor(b.height * .62); row < b.top + b.height; row++) {
      for (let col = b.left; col < b.left + Math.ceil(b.width * .43); col++) {
        const alpha = bitmap.data[(row * bitmap.width + col) * 4 + 3];
        if (alpha < 32) continue;
        sx += col * alpha; sy += row * alpha; total += alpha;
      }
    }
    if (total) return { pivotX: Math.round(x + sx / total), pivotY: Math.round(y + sy / total) };
  }
  const fromBottom = name === 'cabeca' || name === 'cauda';
  const band = Math.max(4, Math.round(b.height * (fromBottom ? 0.09 : 0.12)));
  const start = fromBottom ? b.top + b.height - band : b.top;
  let sum = 0, weight = 0;
  for (let row = start; row < start + band; row++) for (let col = b.left; col < b.left + b.width; col++) {
    const alpha = bitmap.data[(row * bitmap.width + col) * 4 + 3];
    if (alpha < 32) continue;
    sum += col * alpha; weight += alpha;
  }
  const px = x + (weight ? sum / weight : b.left + b.width / 2);
  const py = y + (fromBottom ? b.top + b.height - band * 0.65 : b.top + band * 0.75);
  if (name === 'tronco' || name === 'corpo') return { pivotX: Math.round(x + b.left + b.width / 2), pivotY: Math.round(y + b.top + b.height - 24) };
  return { pivotX: Math.round(px), pivotY: Math.round(py) };
}

export async function loadEnemyPsd(file) {
  const psd = readPsd(await readFile(file), { useImageData: true, skipCompositeImageData: true, skipThumbnail: true });
  if (psd.width !== 1024 || psd.height !== 1024) throw new Error('A tela deve ser 1024 × 1024.');
  const layers = [...(psd.children ?? [])].reverse();
  const body = layers.some(p => p.name.startsWith('asa-')) ? 'voador'
    : layers.some(p => p.name.startsWith('pata-')) ? 'quadrupede' : 'humanoide';
  const expected = BODY_LAYERS[body];
  const names = layers.map(p => p.name);
  if (new Set(names).size !== names.length || names.some(n => !expected.includes(n))) throw new Error('Camadas repetidas ou nomes fora do molde.');
  if (expected.some(n => !OPTIONAL.has(n) && !names.includes(n))) throw new Error(`Faltam peças obrigatórias do molde ${body}.`);
  if (names.join('|') !== expected.filter(n => names.includes(n)).join('|')) throw new Error('Ordem das camadas diferente do molde.');
  const parts = layers.map(layer => {
    if (layer.children || layer.hidden || layer.mask || layer.vectorMask || layer.clipping || layer.effects || layer.opacity < 1 || !layer.imageData) {
      throw new Error(`A camada ${layer.name} deve ser uma peça raster visível, sem máscaras, efeitos ou transparência de camada.`);
    }
    const x = layer.left ?? 0, y = layer.top ?? 0;
    if (x < 0 || y < 0 || x + layer.imageData.width > 1024 || y + layer.imageData.height > 1024) throw new Error(`Peça ${layer.name} fora da tela.`);
    const b = alphaBounds(layer.imageData);
    return { name: layer.name, x, y, bitmap: layer.imageData, bounds: b, ...detectPivot(layer.name, layer.imageData, x, y, body),
      parent: layer.name === 'arma' ? 'braco-frente' : '' };
  });
  const feet = body === 'voador' ? 525 : 960;
  const top = Math.min(...parts.map(p => p.y + p.bounds.top));
  if (body !== 'voador') {
    const legs = parts.filter(p => /^(perna-|pata-)/.test(p.name));
    if (legs.some(p => Math.abs(p.y + p.bounds.top + p.bounds.height - feet) > 6)) throw new Error('Os pés devem tocar a linha 960 do molde.');
    const maxHeight = /_chefe_/.test(file) ? 900 : 880;
    if (feet - top < 750 || feet - top > maxHeight) throw new Error(`Altura fora de 750–${maxHeight} px.`);
  }
  return { body, size: 1024, center: 512, feet, top, stride: body === 'quadrupede' ? 28 : body === 'voador' ? 20 : 32, parts };
}
