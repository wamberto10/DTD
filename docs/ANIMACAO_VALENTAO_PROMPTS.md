# Prompts — Valentão dos Alojamentos

Ferramenta: imagegen integrado, com transparência real. Referência: `arte/ia/inimigos/f01_forte_valentao_alojamentos.png`. A imagem serve como identidade, cores e estilo; os desenhos completos são recortados e montados por `scripts/montar-valentao.mjs`.

## Folha de oito peças

```text
Use case: stylized-concept.
Asset type: transparent cut-out parts sheet for one chibi pixel-art game enemy rig.
Reference image: identity, palette and drawing style only. It is the same huge dormitory bully: thick muscular tan arms and clenched fists, very broad shoulders and thick neck, threatening grin, dark brown long hair tied high with a small gold clasp and pale ribbons, torn sleeveless grey outer-disciple tunic, dark charcoal trousers, grey calf wraps, dark shoes with tan soles, blue waist sash and small gold buckle.
Create exactly EIGHT ISOLATED COMPLETE BODY PARTS on a true alpha-transparent canvas, separated by generous empty gutters in a 3 by 3 grid. No assembled character. Every part is a coherent whole with no holes where other parts would overlap. Side/three-quarter side view facing RIGHT; neutral standing assembly pose, limbs hang straight DOWN. Clean thick dark outlines, crisp pixel-art clusters, matching the reference. No text or labels, no shadows, ground, aura or effects, no checkerboard pixels, no weapon.

Grid order and contents:
TOP LEFT: back hair ONLY: long dark-brown hair hanging behind the back, with two pale cloth ribbons. Hair starts at a narrow attachment cap at the top and widens below. NO bun, NO topknot, NO face, NO neck.
TOP MIDDLE: far arm complete from a rounded muscular shoulder to a large clenched fist, hanging straight down; tiny torn grey sleeveless edge at shoulder, grey and charcoal wrist wraps. Entire hidden shoulder drawn.
TOP RIGHT: far leg complete from a rounded dark trouser thigh cap to a dark shoe pointing right with tan sole; grey calf wraps. Straight vertical rest pose.
MIDDLE LEFT: near leg, similarly complete, straight down, shoe pointing right.
MIDDLE MIDDLE: TORSO ONLY: broad grey torn sleeveless tunic chest and abdomen, tan thick neck rising from collar. Rightward side view. NO head, NO hair, NO shoulders or arms, NO fists, NO detached sleeve fragments, NO waist belt or sash, NO skirt, NO legs. Bare side armholes end cleanly at torso outline.
MIDDLE RIGHT: waist skirt ONLY: the blue wraparound sash with gold buckle and ragged pale-grey waist cloth panels hanging DOWN, shaped as one complete skirt piece. The belt is present HERE ONLY.
BOTTOM LEFT: head ONLY facing right: same threatening grin, tan face, brown eye, dark brown front hair and gold-tied high TOPKNOT/BUN. Head includes full neck extension below chin. NO long rear hair, no ribbons, no chest.
BOTTOM MIDDLE: EMPTY transparent cell.
BOTTOM RIGHT: near arm complete from a rounded muscular shoulder to a large clenched fist, hanging straight down, matching far arm with grey wrist wraps.

Show each of the eight pieces in full within its own cell, each separate from all other cells. Shoulder and hip caps should be rounded and fully filled so they can overlap the torso by 50 pixels in assembly. Neck should extend downward for 40 pixels overlap. All pieces are from the same ONE character and at a consistent detail level. True transparent background.
```

## Correção do tronco e cabelo traseiro

```text
Use case: precise-object-edit.
Asset type: two replacement cut-out pieces for one pixel-art enemy animation rig.
Input reference: the attached huge muscular dormitory bully, for identity, colours and pixel style.
Create exactly TWO separate isolated pieces on a true transparent canvas, with a large empty gutter between them. NO complete character.
LEFT HALF: ONLY THE TORSO, a very broad sleeveless grey torn martial-disciple tunic wrapped around a muscular chest and stomach. Include a thick tan neck extending from the top, with exposed tan sternum in the V-shaped neckline. The vest has clean open armholes on both sides, but NO arm, NO rounded shoulder cap, NO bicep, NO peach skin patch inside either armhole: each outer side terminates at grey fabric edge with transparent air directly beside it. The whole left and right edges belong ONLY to cloth. This piece is a wide trapezoidal chest-abdomen silhouette with small neck on top, waist below. No waist sash, no belt, no skirt, no head, no hands, no arm stumps. Torso faces right.
RIGHT HALF: ONLY THE LONG REAR HAIR AND TWO PALE CLOTH RIBBONS. A dark brown tapered long wavy hair curtain for the back of the same character, from a narrow modest attachment cap at the top widening down to long locks. Top attachment should be small and smooth, with no bun, no ponytail bulb, no upright hair tuft, no gold clasp, no head, no face, no neck. Hair and ribbons hang naturally downward in neutral still pose.
Thick dark pixel outline, crisp shaded pixel-art clusters exactly matching the reference. Show both complete pieces in full, separated. Actual alpha transparency, no text, no labels, no ground, no shadow, no glow. The left piece contains NO LIMB anywhere. The right piece contains NO BUN anywhere.
```

## Tronco definitivo sem abertura circular

```text
Use case: stylized-concept.
Asset type: one isolated torso cutout for a 2D pixel-art game skeleton.
Reference image is identity/palette/style only: same muscular dormitory bully with torn sleeveless grey martial vest, cream V-neck trim, exposed tan sternum, thick tan neck and broad chest.
Draw ONLY a compact SOLID BODY CORE from the top of the neck to the bottom of the waist, a wide trapezoid-shaped grey vest front panel covering the chest and abdomen, matching the reference and facing slightly RIGHT.
CRITICAL SILHOUETTE: the left and right sides of this cutout must be the smoothly descending CLOTH SIDES of the torso. No projecting shoulders, no round openings, no circles, no circular armholes or sleeve rims anywhere. The upper left and right corners are simple grey cloth corner caps and the central neck rises above them. The left torso edge descends smoothly from upper chest to waist. The right torso edge descends smoothly from upper chest to waist. This is a flat torso FRONT PANEL for paper-doll assembly, with no holes or cutout openings. Hidden continuation cloth extends all the way to both outer edges.
Skin appears ONLY in the neck and central V-shaped neckline revealing the muscular chest. No skin patch anywhere along either outer side. No arms, no biceps, no hands, no fists, no head, no hair, no legs. No waist belt, no blue sash, no gold buckle, no skirt. Exactly one torso only, centered and complete.
Crisp pixel-art clusters and thick dark outline matching reference. True alpha transparent background, no text, no labels, no shadow, no ground, no effects.
```

## Arquivos de origem selecionados

- `fontes/valentao-pecas.png`: braços, pernas, cabeça e saia completos.
- `fontes/valentao-tronco-cabelo.png`: somente o cabelo traseiro; o torso desta geração foi substituído.
- `fontes/valentao-tronco.png`: torso definitivo sólido, sem braço ou manga duplicada.

Montagem final: `scripts/montar-valentao.mjs`, oito camadas em tela transparente de 1024 × 1024, topo 113, pés 960 (altura 847 px). O script apenas recorta, escala e posiciona os desenhos completos da IA. O cinto está somente na saia; o coque está somente na cabeça. A prévia composta foi inspecionada e a leitura por `loadEnemyPsd` passou.


