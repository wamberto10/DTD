# Discípulo Interno de Elite — prompts de produção

Ferramenta: `imagegen` integrada, com fundo transparente real. Referência: `arte/ia/chefes/f01_chefe_discipulo_interno_elite.png`.

Fontes escolhidas: `arte/ia/chefes-pecas/fontes/discipulo-pecas.png` e `arte/ia/chefes-pecas/fontes/discipulo-cabelo-tras.png`. A peça de cabelo da prancha foi substituída pela versão avulsa para garantir que só a cabeça contenha coque. O script `scripts/montar-chefe.mjs` recorta, dimensiona e posiciona as nove peças desenhadas pela ferramenta; não desenha nem completa pixels.

## Prancha de nove peças — prompt exato

```text
Use case: identity-preserve.
Asset type: transparent 2D pixel-art cut-out puppet parts atlas for the elite inner disciple boss in a game.
Input image 1 is the character identity reference. Preserve his proud cold face, green eyes, dark brown hair, tall topknot with small silver crown and green jade stone, refined white and very dark green robe, silver ornament trim, jade pendant, dark boots, and long silver/jade sword.
Create ONE square transparent atlas in an exact 3 by 3 grid of nine entirely DISCONNECTED components; lots of transparent padding between cells, absolutely no grid lines or labels. Every piece fits completely in its own cell. Pixel-art dark outlines, crisp detailed chibi game style matching reference, no smooth painterly effect.
Cell row 1 left: ONLY back hair tail with long dark hair and two green-and-white ribbons hanging straight down; top is rounded attachment cap, NO bun, crown, face, head or torso.
Cell row 1 middle: ONLY far arm, relaxed vertical downward, rounded complete shoulder, a white and dark-green robe sleeve with silver trim, visible hand at bottom, no torso.
Cell row 1 right: ONLY far leg from complete rounded upper thigh to black silver-trimmed boot pointing RIGHT, leg perfectly straight down.
Cell row 2 left: ONLY near leg, complete rounded thigh to black silver-trimmed boot pointing RIGHT, leg perfectly straight down.
Cell row 2 middle: ONLY sleeve-less torso from exposed neck through chest to waist, white underrobe, dark green vest, silver trim and a SINGLE belt with jade pendant. No head, hair, arms, shoulders hanging out, sleeves, hands, skirt, legs or sword. Narrow simple side-facing-right torso, full neck.
Cell row 2 right: ONLY lower robe/skirt dark green and white long panels with silver hem, full rounded top attachment fabric hidden under belt, NO BELT, NO buckle, NO pendant, NO torso, NO feet or legs.
Cell row 3 left: ONLY head looking to RIGHT, cold arrogant green eyes, dark brown front hair and small single topknot with silver/jade crown, full neck extending downward 50px, no long hair tail, body or shoulders.
Cell row 3 middle: ONLY long straight silver sword with dark green grip, silver guard and jade center, held blade downward and a little forward RIGHT, entire sword including tip fits within cell, NO hand or arm.
Cell row 3 right: ONLY near arm relaxed vertically downward with rounded complete shoulder, white/dark green sleeve silver trim and closed hand at bottom ready to grip sword, NO sword or torso.
All limbs and attachment caps are COMPLETE, including extra hidden attachment portions at least 15% of their length, so the assembly has no holes when rotating. Same proportions between left/right limbs. Transparent background real alpha. No text, labels, checkerboard, floor, shadow, aura, glow, effects or extra character. Nothing touching between components.
```

## Cabelo traseiro sem coque — prompt exato

```text
Use case: identity-preserve.
Asset type: single transparent cutout component for the back hair of this game character.
Input reference 1 is the elite disciple identity. Draw ONLY his long dark brown back hair with green-and-white ribbon strips, as a complete detached animation piece. Hair hangs down, flowing very gently toward LEFT at the bottom. Its TOP must be a narrow, plain rounded continuation of loose HAIR STRANDS that can tuck hidden behind the head. NO bun, NO topknot, NO rolled or tied cap, NO crown, NO head, NO face, NO neck, NO body. No ornament or clasp at the top. The head layer already contains the only bun and crown; this asset is ONLY the long trailing hair and ribbon ends. Leave the uppermost quarter as simple continuous hair strands for hidden overlap.
Pixel-art game enemy, same thick dark pixel outlines and clean detailed chibi art as reference. Entire piece visible with transparent padding on all sides. Tall narrow composition, hair tail roughly twice as tall as wide. Real transparent background with alpha, no checkerboard, text, shadow, aura, glow or effects.
```
