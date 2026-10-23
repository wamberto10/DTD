// Draws the templates for cut-out enemies (docs/moldes): one guide per body type, the same size as the PSD
// canvas (1024 × 1024), plus a GIF of the template moving the way the game will animate the pieces.
//   node scripts/moldes-animacao.mjs
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const OUT = new URL('../docs/moldes/', import.meta.url);
const SIZE = 1024;
const FEET = 960; // line where the feet touch the ground
const CENTER = 512;

const rect = (x, y, w, h, r) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/>`;
const ellipse = (cx, cy, rx, ry) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/>`;
const path = (d) => `<path d="${d}"/>`;
const deg = (a) => (a * Math.PI) / 180;

// Each piece: its layer name, its shape at rest, the joint it turns around and its movement over one cycle (p from 0 to 2π).
// Pieces are listed from the bottom layer to the top one; "children" move together with their parent.
const BODIES = {
  humanoide: {
    title: 'HUMANOIDE',
    legLength: FEET - 690,
    pieces: [
      { name: 'cabelo-tras', optional: true, color: '#8a6f4e', joint: [478, 222],
        shape: path('M478 190 C 380 205 330 380 330 610 L 405 615 C 412 470 440 330 505 250 Z'),
        label: [150, 430, 345, 450], move: (p) => ({ rot: 5 * Math.sin(2 * p - 1.2) }) },
      { name: 'braco-tras', color: '#5e7a9c', joint: [482, 528],
        shape: rect(452, 500, 60, 255, 30) + ellipse(482, 760, 34, 34),
        label: [150, 680, 452, 650], move: (p, a) => ({ rot: -a.arm * Math.sin(p) }) },
      { name: 'perna-tras', color: '#6d5f8c', joint: [490, 692], leg: true,
        shape: rect(455, 655, 70, 285, 30) + rect(455, 912, 108, 48, 22),
        label: [150, 900, 455, 880], move: (p, a) => ({ rot: a.leg * Math.sin(p) }) },
      { name: 'perna-frente', color: '#8f7cc0', joint: [530, 692], leg: true,
        shape: rect(495, 655, 70, 285, 30) + rect(495, 912, 112, 48, 22),
        label: [700, 990, 570, 945], move: (p, a) => ({ rot: -a.leg * Math.sin(p) }) },
      { name: 'tronco', color: '#5f9a72', joint: [520, 700],
        shape: rect(422, 468, 196, 252, 52),
        label: [700, 470, 612, 520], move: (p) => ({ rot: 1.5 * Math.sin(2 * p) }) },
      { name: 'saia', optional: true, color: '#9cb36a', joint: [520, 648],
        shape: path('M432 640 L 608 640 L 650 840 L 398 840 Z'),
        label: [700, 790, 640, 800], move: (p) => ({ rot: 2.5 * Math.sin(2 * p + 0.6) }) },
      { name: 'cabeca', color: '#d0a46a', joint: [528, 512],
        shape: ellipse(532, 318, 186, 182) + rect(500, 470, 60, 72, 20),
        label: [720, 200, 690, 250], move: (p) => ({ rot: 2 * Math.sin(2 * p + 0.8) }) },
      { name: 'braco-frente', color: '#7fb0d9', joint: [548, 530],
        shape: rect(516, 500, 64, 262, 32) + ellipse(548, 768, 36, 36),
        label: [700, 630, 580, 640], move: (p, a) => ({ rot: a.arm * Math.sin(p) }),
        children: [
          { name: 'arma', optional: true, follows: true, color: '#c9c3b2', joint: [548, 768],
            shape: '<path d="M520 640 L 542 634 L 640 935 L 618 941 Z"/>',
            label: [700, 880, 628, 900], move: () => ({ rot: 0 }) },
        ] },
    ],
    amounts: { leg: 22, arm: 18 },
  },
  quadrupede: {
    title: 'QUADRÚPEDE',
    legLength: FEET - 640,
    pieces: [
      { name: 'cauda', optional: true, color: '#8a6f4e', joint: [345, 565],
        shape: path('M350 545 C 260 520 190 430 205 290 L 255 285 C 250 400 300 480 365 585 Z'),
        label: [60, 250, 205, 300], move: (p) => ({ rot: 8 * Math.sin(p - 1) }) },
      { name: 'pata-tras-longe', color: '#5e5a7c', joint: [368, 632], leg: true,
        shape: rect(338, 600, 60, 345, 28) + rect(338, 918, 86, 42, 18),
        label: [60, 980, 345, 955], move: (p, a) => ({ rot: -a.leg * Math.sin(p) }) },
      { name: 'pata-frente-longe', color: '#5e7a9c', joint: [628, 632], leg: true,
        shape: rect(598, 600, 60, 345, 28) + rect(598, 918, 86, 42, 18),
        label: [690, 1000, 640, 958], move: (p, a) => ({ rot: a.leg * Math.sin(p) }) },
      { name: 'corpo', color: '#5f9a72', joint: [500, 690],
        shape: ellipse(500, 588, 205, 112),
        label: [460, 430, 500, 480], move: (p) => ({ rot: 1.5 * Math.sin(2 * p) }) },
      { name: 'pata-tras-perto', color: '#8f7cc0', joint: [402, 642], leg: true,
        shape: rect(372, 610, 62, 335, 28) + rect(372, 918, 90, 42, 18),
        label: [60, 800, 372, 790], move: (p, a) => ({ rot: a.leg * Math.sin(p) }) },
      { name: 'pata-frente-perto', color: '#7fb0d9', joint: [664, 642], leg: true,
        shape: rect(634, 610, 62, 335, 28) + rect(634, 918, 90, 42, 18),
        label: [760, 820, 696, 800], move: (p, a) => ({ rot: -a.leg * Math.sin(p) }) },
      { name: 'cabeca', color: '#d0a46a', joint: [676, 548],
        shape: ellipse(770, 462, 140, 122) + rect(640, 470, 110, 120, 40),
        label: [790, 290, 780, 345], move: (p) => ({ rot: 3 * Math.sin(2 * p + 0.8) }) },
    ],
    amounts: { leg: 20 },
  },
  voador: {
    title: 'VOADOR',
    flying: true,
    pieces: [
      { name: 'asa-longe', color: '#5e5a7c', joint: [470, 470],
        shape: path('M478 455 L 250 175 L 170 262 L 212 352 L 140 392 L 216 482 L 322 472 L 455 520 Z'),
        label: [60, 300, 190, 340], move: (p) => ({ rot: 26 * Math.sin(p + 0.35) }) },
      { name: 'corpo', color: '#5f9a72', joint: [520, 520],
        shape: ellipse(520, 525, 118, 150) + ellipse(612, 392, 70, 62),
        label: [700, 600, 630, 560], move: () => ({ rot: 0 }) },
      { name: 'asa-perto', color: '#7fb0d9', joint: [540, 478],
        shape: path('M548 460 L 385 130 L 292 192 L 312 282 L 222 302 L 272 402 L 372 422 L 515 540 Z'),
        label: [700, 230, 440, 200], move: (p) => ({ rot: 30 * Math.sin(p) }) },
    ],
    amounts: {},
  },
};

// Children (the weapon) sit just under their parent: the hand holds the weapon from the front.
const allPieces = (pieces) => pieces.flatMap((p) => [...(p.children ?? []), p]);

function guides(body) {
  const lines = [];
  if (body.flying) {
    lines.push(`<line x1="40" y1="525" x2="984" y2="525" stroke="#e9c46f" stroke-width="3" stroke-dasharray="14 10"/>`,
      `<text x="44" y="556" class="guide">ALTURA DE VOO</text>`);
  } else {
    lines.push(`<line x1="40" y1="${FEET}" x2="984" y2="${FEET}" stroke="#e9c46f" stroke-width="4"/>`,
      `<text x="44" y="${FEET - 12}" class="guide">LINHA DOS PÉS</text>`);
  }
  lines.push(`<line x1="${CENTER}" y1="40" x2="${CENTER}" y2="${SIZE - 20}" stroke="#9fb08f" stroke-width="2" stroke-dasharray="10 10"/>`,
    `<text x="${CENTER + 8}" y="62" class="guide">CENTRO</text>`);
  return lines.join('');
}

/** The template: every piece at rest, see-through so the overlapping (hidden) parts show, with joints and names. */
function template(body) {
  const order = allPieces(body.pieces);
  const shapes = order.map((p) => `<g fill="${p.color}" fill-opacity="0.55" stroke="${p.color}" stroke-width="4">${p.shape}</g>`).join('');
  const joints = order.filter((p) => !p.follows).map((p) => `<circle cx="${p.joint[0]}" cy="${p.joint[1]}" r="10" fill="#e5484d" stroke="#fff" stroke-width="3"/>`).join('');
  const labels = order.map((p) => {
    const [tx, ty, lx, ly] = p.label;
    return `<line x1="${tx + 4}" y1="${ty + 4}" x2="${lx}" y2="${ly}" stroke="#f2ecd2" stroke-width="2"/>` +
      `<text x="${tx}" y="${ty}" class="label">${p.name}${p.follows ? ' (segue o braço)' : p.optional ? ' (opcional)' : ''}</text>`;
  }).join('');
  const list = order.map((p, i) => `<text x="764" y="${74 + i * 26}" class="small">${i + 1}. ${p.name}</text>`).join('');
  const notes = [
    `MOLDE ${body.title} · 1024 × 1024`,
    'Ponto vermelho = junta (onde a peça gira).',
    'Desenhe cada peça INTEIRA, também a parte',
    'que fica escondida atrás das outras.',
    'Apague esta camada antes de salvar.',
  ].map((t, i) => `<text x="44" y="${44 + i * 24}" class="${i ? 'small' : 'label'}">${t}</text>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
    <style>
      .label { font: 700 22px 'Segoe UI', Arial, sans-serif; fill: #f2ecd2; }
      .small { font: 17px 'Segoe UI', Arial, sans-serif; fill: #c9cdb8; }
      .guide { font: 700 17px 'Segoe UI', Arial, sans-serif; fill: #e9c46f; letter-spacing: 1px; }
    </style>
    <rect width="${SIZE}" height="${SIZE}" fill="#20261f"/>
    ${Array.from({ length: 15 }, (_, i) => `<line x1="${(i + 1) * 64}" y1="0" x2="${(i + 1) * 64}" y2="${SIZE}" stroke="#2b3329"/><line x1="0" y1="${(i + 1) * 64}" x2="${SIZE}" y2="${(i + 1) * 64}" stroke="#2b3329"/>`).join('')}
    ${guides(body)}
    ${shapes}${joints}${labels}
    <text x="764" y="46" class="label">ORDEM DAS CAMADAS</text>
    <text x="764" y="${74 + order.length * 26}" class="small">(1 = a de baixo)</text>
    ${list}${notes}
  </svg>`;
}

/** One frame of the preview: the pieces turned around their joints, the body dropping as the legs open. */
function frame(body, p) {
  const a = body.amounts;
  let dx = 0, dy = 0;
  if (body.flying) dy = 16 * Math.sin(p + Math.PI / 2);
  else dy = body.legLength * (1 - Math.cos(deg(a.leg * Math.sin(p)))); // keeps the planted foot on the ground
  const draw = (piece) => {
    const { rot } = piece.move(p, a);
    const children = (piece.children ?? []).map(draw).join('');
    return `<g transform="rotate(${rot.toFixed(2)} ${piece.joint[0]} ${piece.joint[1]})">${children}<g fill="${piece.color}" stroke="#1b1f1a" stroke-width="5">${piece.shape}</g></g>`;
  };
  const pieces = body.pieces.map((piece) => (piece.leg ? `<g>${draw(piece)}</g>` : draw(piece))).join('');
  const shadowWidth = body.flying ? 110 + dy * 2 : 150;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 ${SIZE} ${SIZE}">
    <rect width="${SIZE}" height="${SIZE}" fill="#2a3a2c"/>
    <rect y="${FEET}" width="${SIZE}" height="${SIZE - FEET}" fill="#3d5236"/>
    <ellipse cx="${CENTER + 20}" cy="${FEET}" rx="${shadowWidth}" ry="22" fill="#000" fill-opacity="0.3"/>
    <g transform="translate(${dx} ${dy.toFixed(2)})">${pieces}</g>
  </svg>`;
}

await mkdir(OUT, { recursive: true });
for (const [id, body] of Object.entries(BODIES)) {
  await sharp(Buffer.from(template(body))).png().toFile(fileURLToPath(new URL(`molde-${id}.png`, OUT)));
  const frames = await Promise.all(Array.from({ length: 16 }, (_, i) =>
    sharp(Buffer.from(frame(body, (i / 16) * Math.PI * 2))).png().toBuffer()));
  await sharp(frames, { join: { animated: true } }).gif({ delay: Array(16).fill(body.flying ? 45 : 65), loop: 0 })
    .toFile(fileURLToPath(new URL(`${body.flying ? 'voar' : 'andar'}-${id}.gif`, OUT)));
  console.log(`molde-${id}.png e animação prontos`);
}
