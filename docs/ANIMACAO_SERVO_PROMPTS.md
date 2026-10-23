# Prompts usados no primeiro recorte

Ferramenta: `imagegen` integrada, com `transparent_background: true`. Não foi usada API externa por CLI.
Referência inicial: `arte/ia/inimigos/f01_comum_servo_arrogante.png`.
As duas imagens finais de origem ficam em `arte/ia/inimigos-pecas/fontes/`.

## 1. Folha de peças

```text
Use case: stylized-concept. Asset type: production 2D cut-out animation parts sheet for the attached game enemy, Servo Arrogante. Reference image 1 is the character identity, exact grey-brown robe palette, dark ponytail, wrapped wrists and ankles, gold belt buckle, black outline, chibi pixel-art appearance and mocking hostile expression. Produce a square 1536 by 1536 transparent image arranged as an EXACT THREE-COLUMN by THREE-ROW grid of NINE isolated body pieces, one completely separate part in each cell, centered within that cell with ample clear transparent padding. No grid lines, no labels, no text. Each part is drawn fully, including rounded hidden joint extensions, with crisp dark outlines and matching pixel-shaded art. All parts use the neutral standing profile facing RIGHT; arms hang straight down, legs straight down, no mid-step pose. Reading order cells: row 1 column 1 = ONLY back ponytail and trailing grey hair ribbons (no head); row 1 column 2 = ONLY the far/back arm including rolled robe sleeve, complete rounded upper shoulder, wrapped wrist and relaxed closed hand, hanging vertically; row 1 column 3 = ONLY far/back leg, grey-brown pants, complete rounded hip, ankle wraps and boot pointing right, leg straight vertical. Row 2 column 1 = ONLY near/front leg same clothing, rounded complete hip, boot right, straight vertical; row 2 column 2 = ONLY torso and neck, grey brown robe collar, complete chest and waist with the ornate gold belt buckle, no head, no hair, NO arms, NO skirt, NO legs; row 2 column 3 = ONLY lower robe/skirt panels hanging down calmly with white under-robe, waist complete, no torso, legs or arms. Row 3 column 1 = ONLY oversized head, side profile looking right with the same smug raised chin and mocking smile, front hair and the top bun, no long ponytail (it is the first cell), short complete neck extending below jaw; row 3 column 2 = ONLY one wooden staff, held almost vertical, leaning slightly to the right toward its bottom, fully isolated, no hand or body; row 3 column 3 = ONLY the near/front arm including rolled sleeve, complete rounded upper shoulder, wrapped wrist, closed gripping hand positioned to grip staff, hanging straight vertically. Keep exact same style and identity as reference. Nine pieces total, no assembled full character, no duplicated parts within a cell, no shadows, ground, aura, glow or effects. Genuinely transparent alpha background, not checkerboard pixels. Every individual part entirely contained within its own exact third-of-canvas cell.
```

## 2. Correção da folha

Referência: a folha anterior. Resultado preservado em `fontes/servo-arrogante-pecas.png`.

```text
Edit this 3x3 transparent production cutout sheet. Preserve exactly the nine-cell layout, each piece, character identity, palette, pixel shading and crisp dark outer outline. Make just the joint boundaries clean for a rig: remove all drawn circles/ovals that look like joint markers on the upper arms and legs, replacing them with ordinary continuous matching cloth shading while keeping the fully rounded top shape. Remove the topknot/bun and gold tie from the TOP LEFT ponytail piece, leaving only long hanging hair locks and grey ribbons that connect at a small narrow rounded attachment at the upper right of that piece. The full bun already exists on the bottom-left head and must remain there. In the middle-right skirt piece remove the belt and gold buckle, replacing that topmost strip with plain dark brown robe fabric with a rounded complete waist; the belt and buckle remain only on the center torso. Do not change the center torso or any other piece. No text, labels, grid, background pattern, shadow or glow. Keep actual transparent alpha.
```

## 3. Tronco sem mangas duplicadas

Referência: a folha corrigida. Resultado preservado em `fontes/servo-arrogante-tronco.png`.

```text
Production cutout game sprite: generate ONLY ONE isolated TORSO piece matching precisely the middle-center torso in the reference sheet: same grey-brown martial servant robe, cream crossed V collar, warm skin neck, ornate golden belt buckle, crisp dark outline and pixel-shaded chibi illustrated style. Keep a narrow sleeveless torso silhouette from the complete neck down to just below the waist/belt, with full cloth shoulder edges. Remove the projecting rolled sleeves and sleeve openings completely because arms are separate animation parts. No sleeves, no arms, no head, no hair, no legs, no long skirt. Slight profile facing RIGHT as in reference. Vertical torso centered with transparent padding around it. Actual transparent background, no checkerboard drawing, no text, no shadow or aura. ONE torso only, no sheet and no repeated parts.
```

A ferramenta devolveu uma folha de 1254 × 1254; o script usa os limites reais das peças, sem assumir a resolução
solicitada. O PSD final é sempre 1024 × 1024. O recorte conserva o alpha da ferramenta e não pinta novas partes.
