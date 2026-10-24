# DTD — Prompts das folhas de sprites de todos os inimigos

Pedido do dono (2026-10-24): a folha de caminhada **C** do Servo Arrogante (a que veio do ChatGPT) ficou a melhor, e o
mesmo formato vai para **todos os inimigos**. Cada inimigo ganha **uma imagem só com 16 quadros**: 4 direções × 4 passos.
No jogo, o inimigo vira de frente quando a estrada desce, de costas quando sobe e de lado nos trechos retos.

**Total:** 96 folhas = 72 inimigos + 24 chefes, nos dois mundos. A do Servo Arrogante já está pronta.

> Os prompts estão em **inglês** (as IAs entendem melhor); as explicações, em português.
> Cada bloco abaixo é o **prompt completo** daquele inimigo: é só copiar e colar.

---

## Como gerar

| Opção | Valor |
|---|---|
| IA | **ChatGPT** (foi onde a folha C saiu melhor) |
| Tamanho | **quadrado (1:1)**, o maior que a IA deixar |
| Anexo 1 (sempre) | `arte/ia/inimigos-folhas/f01_comum_servo_arrogante.png`: a folha C, como **referência de estilo e de grade** |
| Anexo 2 (quando existir) | a arte atual do inimigo (indicada em cada um), para manter a aparência dele |
| Onde salvar | `arte/ia/inimigos-folhas/` com o nome indicado em cada inimigo (o mesmo nome da arte, sem acento) |

**Regras para tudo combinar:**
1. Confira a ordem das linhas: **frente, esquerda, direita, costas**. Se a IA trocar esquerda e direita (aconteceu na C),
   não precisa gerar de novo: o Claude acerta ao preparar a folha.
2. Confira os quadros 1 e 3 de cada linha: eles devem ter **pernas diferentes à frente**. Se vierem iguais na frente e nas
   costas, o Claude corrige; se vierem iguais de lado, vale gerar de novo.
3. Os 16 quadros precisam ser o **mesmo personagem**, do mesmo tamanho. Se um quadro sair diferente, gere de novo.
4. Gere 2 ou 3 opções e fique com a mais regular.

Quando tiver algumas prontas, diga **"folhas prontas"**. O Claude recorta os quadros, alinha os pés, ajusta o tamanho,
mostra uma prévia de cada uma andando no mapa e coloca no jogo web e no Unity (`npm run unity` leva junto).
Inimigos sem folha continuam com a arte atual.

**Ordem sugerida:** fase 1 (Macaco, Valentão e o Discípulo de Elite), para ver a fase inteira andando no novo formato;
depois uma fase por vez.

---

# Mundo Inicial (fases 1 a 12)

## Fase 1 — Pavilhão Ling Xiao

**Comum — Servo Arrogante**  
Salvar como `arte/ia/inimigos-folhas/f01_comum_servo_arrogante.png` · anexo 2: `arte/ia/inimigos/f01_comum_servo_arrogante.png`

✅ **Pronta** (a folha C).

**Rápido — Macaco Ladrão**  
Salvar como `arte/ia/inimigos-folhas/f01_rapido_macaco_ladrao.png` · anexo 2: `arte/ia/inimigos/f01_rapido_macaco_ladrao.png`
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a small thieving monkey of the bamboo forest: brown fur, a long curled tail, a stolen red sect token in one hand, running on all fours with a mischievous grin.
This is an ENEMY with a hostile expression.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Same character design as the second attached image.
```

**Forte — Valentão dos Alojamentos** · habilidades: armadura  
Salvar como `arte/ia/inimigos-folhas/f01_forte_valentao_alojamentos.png` · anexo 2: `arte/ia/inimigos/f01_forte_valentao_alojamentos.png`
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a big bully of the disciples' dormitory: a huge broad-shouldered young man in a stretched outer-disciple uniform, thick neck, fists like hammers, cracking his knuckles.
This is an ENEMY with a hostile expression.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Same character design as the second attached image.
```

**Chefe — Discípulo Interno de Elite** · habilidades: fúria  
Salvar como `arte/ia/inimigos-folhas/f01_chefe_discipulo_interno_elite.png` · anexo 2: `arte/ia/chefes/f01_chefe_discipulo_interno_elite.png`
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: an elite inner disciple of the sect: a proud young swordsman in a refined white and dark green inner-disciple robe with silver trim, a jade pendant, hair in a neat topknot with a small silver crown, a gleaming long sword raised, cold arrogant gaze, green sword qi around the blade.
This is an ENEMY BOSS: bigger, more detailed and more imposing than a normal enemy, with a menacing expression and a subtle glowing aura that stays inside each cell.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Same character design as the second attached image.
```

## Fase 2 — Montanhas do Pavilhão Ling Xiao

**Comum — Lobo Cinzento**  
Salvar como `arte/ia/inimigos-folhas/f02_comum_lobo_cinzento.png` · anexo 2: `arte/ia/inimigos/f02_comum_lobo_cinzento.png`
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a grey wolf with shaggy fur and glowing yellow eyes, trotting forward, teeth showing.
This is an ENEMY with a hostile expression.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Same character design as the second attached image.
```

**Rápido — Morcego Sanguinário** · habilidades: voa  
Salvar como `arte/ia/inimigos-folhas/f02_rapido_morcego_sanguinario.png` · anexo 2: `arte/ia/inimigos/f02_rapido_morcego_sanguinario.png` · **voa**
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a blood bat: a small dark-red bat with big ears, sharp fangs and wide membranous wings, flying low and fast.
This is an ENEMY with a hostile expression.
Columns: a 4-frame hovering cycle: the creature floats above the ground and never walks. Wings fully up in frame 1, halfway in frames 2 and 4, fully down in frame 3 (without wings: a gentle bob up and down instead). Frames 1 and 3 must be DIFFERENT in every row.
Same character design as the second attached image.
```

**Forte — Javali de Presas de Ferro** · habilidades: armadura  
Salvar como `arte/ia/inimigos-folhas/f02_forte_javali_presas_ferro.png` · anexo 2: `arte/ia/inimigos/f02_forte_javali_presas_ferro.png`
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: an iron-tusk boar: a huge bristly dark boar with long shiny iron-grey metallic tusks, charging with its head lowered.
This is an ENEMY with a hostile expression.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Same character design as the second attached image.
```

**Chefe — Fera Espiritual da Montanha** · habilidades: fúria  
Salvar como `arte/ia/inimigos-folhas/f02_chefe_fera_espiritual_montanha.png` · anexo 2: `arte/ia/chefes/f02_chefe_fera_espiritual_montanha.png`
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: the spirit beast of the mountain: a massive white-and-grey tiger-like beast with stone plates growing on its back and shoulders, glowing jade-green markings, moss and small crystals along its spine, roaring.
This is an ENEMY BOSS: bigger, more detailed and more imposing than a normal enemy, with a menacing expression and a subtle glowing aura that stays inside each cell.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Same character design as the second attached image.
```

## Fase 3 — Cidades da Grande Dinastia Han

**Comum — Bandido de Estrada**  
Salvar como `arte/ia/inimigos-folhas/f03_comum_bandido_estrada.png` · anexo 2: `arte/ia/inimigos/f03_comum_bandido_estrada.png`
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a road bandit: a scruffy man with a cloth mask over his mouth, patched brown clothes, a headband and a rusty saber.
This is an ENEMY with a hostile expression.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Same character design as the second attached image.
```

**Rápido — Batedor de Carteiras**  
Salvar como `arte/ia/inimigos-folhas/f03_rapido_batedor_carteiras.png` · anexo 2: `arte/ia/inimigos/f03_rapido_batedor_carteiras.png`
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a quick pickpocket: a skinny young thief in dark grey clothes with a hood, a stolen coin purse in one hand, sneaky grin, running on tiptoe.
This is an ENEMY with a hostile expression.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Same character design as the second attached image.
```

**Forte — Lutador do Bando da Batalha Sangrenta** · habilidades: armadura  
Salvar como `arte/ia/inimigos-folhas/f03_forte_lutador_batalha_sangrenta.png` · anexo 2: `arte/ia/inimigos/f03_forte_lutador_batalha_sangrenta.png`
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a brutal arena fighter of the Bloody Battle Gang: a muscular bare-chested man with scars, iron knuckle gauntlets, a red sash, hair in a topknot, cocky grin.
This is an ENEMY with a hostile expression.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Same character design as the second attached image.
```

**Chefe — Jovem Mestre da Família** · habilidades: escudo  
Salvar como `arte/ia/inimigos-folhas/f03_chefe_jovem_mestre_familia.png` · anexo 2: `arte/ia/chefes/f03_chefe_jovem_mestre_familia.png`
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a spoiled young master of a rich local family: an elegant young man in luxurious purple and gold silk robes, a jade crown, a folding fan in one hand and a thin sword at the waist, arrogant smile, two floating golden talismans around him.
This is an ENEMY BOSS: bigger, more detailed and more imposing than a normal enemy, with a menacing expression and a subtle glowing aura that stays inside each cell.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Same character design as the second attached image.
```

## Fase 4 — Caminho para a Capital Central

**Comum — Saqueador de Caravanas**  
Salvar como `arte/ia/inimigos-folhas/f04_comum_saqueador_caravanas.png` · anexo 2: `arte/ia/inimigos/f04_comum_saqueador_caravanas.png`
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a caravan raider: a tough man in dusty leather and torn cloth, a sack of loot on his back, a hand axe, a cloth scarf over the nose.
This is an ENEMY with a hostile expression.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Same character design as the second attached image.
```

**Rápido — Assassino Contratado**  
Salvar como `arte/ia/inimigos-folhas/f04_rapido_assassino_contratado.png` · anexo 2: `arte/ia/inimigos/f04_rapido_assassino_contratado.png`
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a hired assassin: a slim figure in tight black clothes and a black face mask, two short daggers, crouched running pose.
This is an ENEMY with a hostile expression.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Same character design as the second attached image.
```

**Forte — Escolta Mercenária** · habilidades: escudo  
Salvar como `arte/ia/inimigos-folhas/f04_forte_escolta_mercenaria.png` · anexo 2: `arte/ia/inimigos/f04_forte_escolta_mercenaria.png`
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a heavy mercenary escort: a big man in lamellar leather armor with a large rectangular wooden shield and a spear, stern face.
This is an ENEMY with a hostile expression.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Same character design as the second attached image.
```

**Chefe — Especialista das Grandes Famílias** · habilidades: invocador  
Salvar como `arte/ia/inimigos-folhas/f04_chefe_especialista_grandes_familias.png` · anexo 2: `arte/ia/chefes/f04_chefe_especialista_grandes_familias.png`
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: an expert of the great families: a stern middle-aged cultivator with a neat beard, dark blue and silver noble robes with a family crest, a long guandao polearm, a strong blue qi aura.
This is an ENEMY BOSS: bigger, more detailed and more imposing than a normal enemy, with a menacing expression and a subtle glowing aura that stays inside each cell.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Same character design as the second attached image.
```

## Fase 5 — Capital Central

**Comum — Arruaceiro da Capital**  
Salvar como `arte/ia/inimigos-folhas/f05_comum_arruaceiro_capital.png` · anexo 2: `arte/ia/inimigos/f05_comum_arruaceiro_capital.png`
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a capital street thug: a rough young man in a loose open jacket, a wooden club on his shoulder, a sneer.
This is an ENEMY with a hostile expression.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Same character design as the second attached image.
```

**Rápido — Sentinela Oculta**  
Salvar como `arte/ia/inimigos-folhas/f05_rapido_sentinela_oculta.png` · anexo 2: `arte/ia/inimigos/f05_rapido_sentinela_oculta.png`
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a hidden sentinel: a masked spy in dark green clothes with a small crossbow strapped to the forearm, light and fast.
This is an ENEMY with a hostile expression.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Same character design as the second attached image.
```

**Forte — Guarda de Família Nobre** · habilidades: armadura  
Salvar como `arte/ia/inimigos-folhas/f05_forte_guarda_familia_nobre.png` · anexo 2: `arte/ia/inimigos/f05_forte_guarda_familia_nobre.png`
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a noble family guard: a tall guard in red and gold armor with a large halberd and a plumed helmet.
This is an ENEMY with a hostile expression.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Same character design as the second attached image.
```

**Chefe — Jovem Especialista das Oito Famílias** · habilidades: escudo, fúria  
Salvar como `arte/ia/inimigos-folhas/f05_chefe_jovem_especialista_oito_familias.png` · anexo 2: `arte/ia/chefes/f05_chefe_jovem_especialista_oito_familias.png`
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a young prodigy of the Eight Great Families: an elegant young man in white and crimson noble robes with golden embroidery, a phoenix hair crown, a red sword wrapped in crimson qi flames, confident proud smile.
This is an ENEMY BOSS: bigger, more detailed and more imposing than a normal enemy, with a menacing expression and a subtle glowing aura that stays inside each cell.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Same character design as the second attached image.
```

## Fase 6 — Vale do Rei da Medicina

**Comum — Ladrão de Ervas**  
Salvar como `arte/ia/inimigos-folhas/f06_comum_ladrao_ervas.png` · anexo 2: `arte/ia/inimigos/f06_comum_ladrao_ervas.png`
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a herb thief: a sneaky man with a big basket of stolen glowing herbs on his back, a small sickle, dirty green clothes.
This is an ENEMY with a hostile expression.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Same character design as the second attached image.
```

**Rápido — Serpente do Lago Medicinal**  
Salvar como `arte/ia/inimigos-folhas/f06_rapido_serpente_lago.png` · anexo 2: `arte/ia/inimigos/f06_rapido_serpente_lago.png`
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a medicinal lake serpent: a slender jade-green snake with turquoise fins and small glowing spots, slithering fast.
This is an ENEMY with a hostile expression.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Same character design as the second attached image.
```

**Forte — Golem de Fornalha** · habilidades: armadura  
Salvar como `arte/ia/inimigos-folhas/f06_forte_golem_fornalha.png` · anexo 2: `arte/ia/inimigos/f06_forte_golem_fornalha.png`
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a furnace golem: a heavy bronze golem shaped like a walking pill furnace, glowing orange fire in its belly grate and eyes, steam rising from the shoulders.
This is an ENEMY with a hostile expression.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Same character design as the second attached image.
```

**Chefe — Guardião do Vale** · habilidades: curandeiro  
Salvar como `arte/ia/inimigos-folhas/f06_chefe_guardiao_vale.png` · anexo 2: `arte/ia/chefes/f06_chefe_guardiao_vale.png`
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: the guardian of the valley: a giant ancient spirit made of living wood, vines and medicinal flowers, a crown of glowing herbs, deep green glowing eyes, a large wooden staff topped with a lotus.
This is an ENEMY BOSS: bigger, more detailed and more imposing than a normal enemy, with a menacing expression and a subtle glowing aura that stays inside each cell.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Same character design as the second attached image.
```

## Fase 7 — Terras Selvagens

**Comum — Hiena Espiritual**  
Salvar como `arte/ia/inimigos-folhas/f07_comum_hiena_espiritual.png` · anexo 2: nenhum (ainda sem arte; só o anexo 1)
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a spirit hyena: a spotted hyena with faint green glowing markings, hunched back, laughing grin.
This is an ENEMY with a hostile expression.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Xianxia chinese fantasy.
```

**Rápido — Aranha Gigante**  
Salvar como `arte/ia/inimigos-folhas/f07_rapido_aranha_gigante.png` · anexo 2: nenhum (ainda sem arte; só o anexo 1)
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a giant forest spider: a big black and dark-green spider with long hairy legs and many red eyes, scuttling fast.
This is an ENEMY with a hostile expression.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Xianxia chinese fantasy.
```

**Forte — Crocodilo de Escamas de Ferro** · habilidades: armadura  
Salvar como `arte/ia/inimigos-folhas/f07_forte_crocodilo_escamas_ferro.png` · anexo 2: nenhum (ainda sem arte; só o anexo 1)
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: an iron-scale crocodile: a huge crocodile with dark metallic iron-grey plates on its back, walking on four legs, jaws open.
This is an ENEMY with a hostile expression.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Xianxia chinese fantasy.
```

**Chefe — Grande Monstro Espiritual** · habilidades: armadura, fúria  
Salvar como `arte/ia/inimigos-folhas/f07_chefe_grande_monstro_espiritual.png` · anexo 2: nenhum (ainda sem arte; só o anexo 1)
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: the great spirit monster: a colossal hulking beast mixing a gorilla and a bull, dark green fur, huge horns, glowing golden eyes, ancient vines and moss on its back, pounding its chest.
This is an ENEMY BOSS: bigger, more detailed and more imposing than a normal enemy, with a menacing expression and a subtle glowing aura that stays inside each cell.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Xianxia chinese fantasy.
```

## Fase 8 — Terras do Vale do Rei Fantasma

**Comum — Cultivador Maligno**  
Salvar como `arte/ia/inimigos-folhas/f08_comum_cultivador_maligno.png` · anexo 2: `arte/ia/inimigos/f08_comum_cultivador_maligno.png`
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: an evil sect cultivator: a pale gaunt man in ragged dark robes, a bone necklace, dark purple qi swirling in his claw-like hand.
This is an ENEMY with a hostile expression.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Same character design as the second attached image.
```

**Rápido — Morcego Demoníaco** · habilidades: voa  
Salvar como `arte/ia/inimigos-folhas/f08_rapido_morcego_demoniaco.png` · anexo 2: `arte/ia/inimigos/f08_rapido_morcego_demoniaco.png` · **voa**
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a demonic bat: a black bat with glowing purple eyes, bony wings and a small horned head, flying low.
This is an ENEMY with a hostile expression.
Columns: a 4-frame hovering cycle: the creature floats above the ground and never walks. Wings fully up in frame 1, halfway in frames 2 and 4, fully down in frame 3 (without wings: a gentle bob up and down instead). Frames 1 and 3 must be DIFFERENT in every row.
Same character design as the second attached image.
```

**Forte — Fera Corrompida** · habilidades: escudo  
Salvar como `arte/ia/inimigos-folhas/f08_forte_fera_corrompida.png` · anexo 2: `arte/ia/inimigos/f08_forte_fera_corrompida.png`
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a corrupted beast: a large wolf-bear creature with black-purple fur, exposed bones, glowing purple veins, dripping dark miasma.
This is an ENEMY with a hostile expression.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Same character design as the second attached image.
```

**Chefe — Mestre do Vale do Rei Fantasma** · habilidades: invocador  
Salvar como `arte/ia/inimigos-folhas/f08_chefe_mestre_rei_fantasma.png` · anexo 2: `arte/ia/chefes/f08_chefe_mestre_rei_fantasma.png`
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: the master of the Ghost King Valley: a tall sinister cultivator in black and dark purple robes with skull ornaments, long white hair, a bone mask over half of the face, holding a black soul banner from which green ghost fire and screaming spirit faces swirl.
This is an ENEMY BOSS: bigger, more detailed and more imposing than a normal enemy, with a menacing expression and a subtle glowing aura that stays inside each cell.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Same character design as the second attached image.
```

## Fase 9 — Guerra contra a Dinastia Tian Lang

**Comum — Soldado de Tian Lang**  
Salvar como `arte/ia/inimigos-folhas/f09_comum_soldado_tian_lang.png` · anexo 2: `arte/ia/inimigos/f09_comum_soldado_tian_lang.png`
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a soldier of the Heavenly Wolf dynasty: lamellar armor, a wolf-head helmet, a grey fur collar, a curved saber and a small round shield with a wolf emblem.
This is an ENEMY with a hostile expression.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Same character design as the second attached image.
```

**Rápido — Batedor de Tian Lang**  
Salvar como `arte/ia/inimigos-folhas/f09_rapido_batedor_tian_lang.png` · anexo 2: `arte/ia/inimigos/f09_rapido_batedor_tian_lang.png`
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a Heavenly Wolf scout: light leather armor, a wolf-fur hood, a short bow, running fast.
This is an ENEMY with a hostile expression.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Same character design as the second attached image.
```

**Forte — Capitão de Tian Lang** · habilidades: armadura, escudo  
Salvar como `arte/ia/inimigos-folhas/f09_forte_capitao_tian_lang.png` · anexo 2: `arte/ia/inimigos/f09_forte_capitao_tian_lang.png`
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a Heavenly Wolf captain: very heavy dark iron armor with a wolf-skull pauldron, a huge two-handed war axe, a red cape.
This is an ENEMY with a hostile expression.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Same character design as the second attached image.
```

**Chefe — General da Dinastia Tian Lang** · habilidades: invocador, armadura  
Salvar como `arte/ia/inimigos-folhas/f09_chefe_general_tian_lang.png` · anexo 2: `arte/ia/chefes/f09_chefe_general_tian_lang.png`
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: the general of the Heavenly Wolf dynasty: an imposing warlord in black and gold armor shaped like a wolf, a great grey wolf pelt mantle, a long glaive, a howling spectral grey wolf aura behind him.
This is an ENEMY BOSS: bigger, more detailed and more imposing than a normal enemy, with a menacing expression and a subtle glowing aura that stays inside each cell.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Same character design as the second attached image.
```

## Fase 10 — Misteriosos Pequenos Mundos

**Comum — Espírito Errante** · habilidades: voa  
Salvar como `arte/ia/inimigos-folhas/f10_comum_espirito_errante.png` · anexo 2: nenhum (ainda sem arte; só o anexo 1) · **voa**
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a wandering spirit: a translucent pale blue ghostly cultivator with a wispy tail instead of legs, empty glowing eyes, floating forward.
This is an ENEMY with a hostile expression.
Columns: a 4-frame hovering cycle: the creature floats above the ground and never walks. Wings fully up in frame 1, halfway in frames 2 and 4, fully down in frame 3 (without wings: a gentle bob up and down instead). Frames 1 and 3 must be DIFFERENT in every row.
Xianxia chinese fantasy.
```

**Rápido — Reflexo Sombrio**  
Salvar como `arte/ia/inimigos-folhas/f10_rapido_reflexo_sombrio.png` · anexo 2: nenhum (ainda sem arte; só o anexo 1)
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a shadow reflection: a dark mirror silhouette of a swordsman made of black glass with cracks of white light, fast and sharp.
This is an ENEMY with a hostile expression.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Xianxia chinese fantasy.
```

**Forte — Besta de Pedra Antiga** · habilidades: armadura  
Salvar como `arte/ia/inimigos-folhas/f10_forte_besta_pedra_antiga.png` · anexo 2: nenhum (ainda sem arte; só o anexo 1)
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: an ancient stone beast: a heavy lion-like guardian statue come to life, grey stone with moss and glowing cyan runes.
This is an ENEMY with a hostile expression.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Xianxia chinese fantasy.
```

**Chefe — Guardião da Antiga Herança** · habilidades: escudo, curandeiro  
Salvar como `arte/ia/inimigos-folhas/f10_chefe_guardiao_antiga_heranca.png` · anexo 2: nenhum (ainda sem arte; só o anexo 1)
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: the guardian of the ancient inheritance: a giant warrior spirit in ancient bronze-gold armor covered in runes, a translucent blue body inside the armor, a huge ancient sword, floating stone fragments around him.
This is an ENEMY BOSS: bigger, more detailed and more imposing than a normal enemy, with a menacing expression and a subtle glowing aura that stays inside each cell.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Xianxia chinese fantasy.
```

## Fase 11 — O Segredo do Mundo

**Comum — Caçador Dimensional**  
Salvar como `arte/ia/inimigos-folhas/f11_comum_cacador_dimensional.png` · anexo 2: `arte/ia/inimigos/f11_comum_cacador_dimensional.png`
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a dimensional hunter: a cloaked hunter from another world with a dark violet hood, a glowing chain-sickle, eyes like tiny portals.
This is an ENEMY with a hostile expression.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Same character design as the second attached image.
```

**Rápido — Fera do Vazio** · habilidades: voa  
Salvar como `arte/ia/inimigos-folhas/f11_rapido_fera_vazio.png` · anexo 2: `arte/ia/inimigos/f11_rapido_fera_vazio.png` · **voa**
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a void beast: a lean black panther-like creature whose body has holes showing stars, glowing purple eyes, leaping forward.
This is an ENEMY with a hostile expression.
Columns: a 4-frame hovering cycle: the creature floats above the ground and never walks. Wings fully up in frame 1, halfway in frames 2 and 4, fully down in frame 3 (without wings: a gentle bob up and down instead). Frames 1 and 3 must be DIFFERENT in every row.
Same character design as the second attached image.
```

**Forte — Sentinela de Pedra** · habilidades: armadura  
Salvar como `arte/ia/inimigos-folhas/f11_forte_sentinela_pedra.png` · anexo 2: `arte/ia/inimigos/f11_forte_sentinela_pedra.png`
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a stone sentinel: a tall bulky stone guardian with a carved square face, golden runes glowing on its body, a stone club.
This is an ENEMY with a hostile expression.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Same character design as the second attached image.
```

**Chefe — Guardião do Corredor do Vazio** · habilidades: escudo, fúria  
Salvar como `arte/ia/inimigos-folhas/f11_chefe_guardiao_corredor_vazio.png` · anexo 2: `arte/ia/chefes/f11_chefe_guardiao_corredor_vazio.png`
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: the guardian of the void corridor: a colossal ancient armored figure made of dark stone and starry void, a faceless helmet with one glowing golden eye, a spear made of light, rings of formation runes orbiting him.
This is an ENEMY BOSS: bigger, more detailed and more imposing than a normal enemy, with a menacing expression and a subtle glowing aura that stays inside each cell.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Same character design as the second attached image.
```

## Fase 12 — Portal para o Reino Tong Xuan

**Comum — Especialista Errante**  
Salvar como `arte/ia/inimigos-folhas/f12_comum_especialista_errante.png` · anexo 2: `arte/ia/inimigos/f12_comum_especialista_errante.png`
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a wandering expert: a lone cultivator in a weathered grey travel cloak, a straw hat and a long sword on his back, calm dangerous eyes.
This is an ENEMY with a hostile expression.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Same character design as the second attached image.
```

**Rápido — Distorção Espacial** · habilidades: voa  
Salvar como `arte/ia/inimigos-folhas/f12_rapido_distorcao_espacial.png` · anexo 2: `arte/ia/inimigos/f12_rapido_distorcao_espacial.png` · **voa**
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a spatial distortion: a small floating creature made of twisted space, like a cracked crystal shard with swirling purple and gold light, flickering.
This is an ENEMY with a hostile expression.
Columns: a 4-frame hovering cycle: the creature floats above the ground and never walks. Wings fully up in frame 1, halfway in frames 2 and 4, fully down in frame 3 (without wings: a gentle bob up and down instead). Frames 1 and 3 must be DIFFERENT in every row.
Same character design as the second attached image.
```

**Forte — Formação Guardiã Desperta** · habilidades: armadura, escudo  
Salvar como `arte/ia/inimigos-folhas/f12_forte_formacao_guardia.png` · anexo 2: `arte/ia/inimigos/f12_forte_formacao_guardia.png`
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: an awakened guardian formation: a heavy walking stone construct shaped like an ancient formation pillar on short legs, covered in glowing golden runes, a rotating ring of runes around its body.
This is an ENEMY with a hostile expression.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Same character design as the second attached image.
```

**Chefe — Senhor Demônio** · habilidades: invocador, fúria  
Salvar como `arte/ia/inimigos-folhas/f12_chefe_senhor_demonio.png` · anexo 2: `arte/ia/chefes/f12_chefe_senhor_demonio.png`
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: the Demon Lord: a towering demonic overlord with dark red skin, large curved black horns, a flowing black and crimson cape, burning red eyes, black armor with gold demonic patterns, a huge black blade, dark red demonic flames around him.
This is an ENEMY BOSS: bigger, more detailed and more imposing than a normal enemy, with a menacing expression and a subtle glowing aura that stays inside each cell.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Same character design as the second attached image.
```

---

# Reino Tong Xuan (fases 13 a 24)

## Fase 13 — Fronteira de Tong Xuan

**Comum — Saqueador de Tong Xuan**  
Salvar como `arte/ia/inimigos-folhas/f13_comum_saqueador_tong_xuan.png` · anexo 2: nenhum (ainda sem arte; só o anexo 1)
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a Tong Xuan highway raider: a rough cultivator in a patched brown leather coat and a red scarf over his mouth, a curved saber, greedy eyes.
This is an ENEMY with a hostile expression.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Xianxia chinese fantasy.
```

**Rápido — Águia Tempestuosa** · habilidades: voa  
Salvar como `arte/ia/inimigos-folhas/f13_rapido_aguia_tempestuosa.png` · anexo 2: nenhum (ainda sem arte; só o anexo 1) · **voa**
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a storm eagle: a fierce blue-grey eagle with wide wings crackling with small white lightning sparks, sharp golden beak, diving fast.
This is an ENEMY with a hostile expression.
Columns: a 4-frame hovering cycle: the creature floats above the ground and never walks. Wings fully up in frame 1, halfway in frames 2 and 4, fully down in frame 3 (without wings: a gentle bob up and down instead). Frames 1 and 3 must be DIFFERENT in every row.
Xianxia chinese fantasy.
```

**Forte — Urso de Ferro Negro** · habilidades: armadura  
Salvar como `arte/ia/inimigos-folhas/f13_forte_urso_ferro_negro.png` · anexo 2: nenhum (ainda sem arte; só o anexo 1)
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a black iron bear: a huge black bear whose shoulders, back and forearms are covered in dark iron plates like natural armor, glowing orange eyes, heavy steps.
This is an ENEMY with a hostile expression.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Xianxia chinese fantasy.
```

**Chefe — Homem do Caixão** · habilidades: invocador  
Salvar como `arte/ia/inimigos-folhas/f13_chefe_homem_do_caixao.png` · anexo 2: nenhum (ainda sem arte; só o anexo 1)
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: the Coffin Man: a gaunt pale man in tattered black funeral robes carrying a huge ancient black coffin on his back with chains and glowing red seals, small shadowy demon wisps escaping from the coffin lid, sinister smile.
This is an ENEMY BOSS: bigger, more detailed and more imposing than a normal enemy, with a menacing expression and a subtle glowing aura that stays inside each cell.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Xianxia chinese fantasy.
```

## Fase 14 — Mundo Selado do Caixão

**Comum — Servo Demoníaco**  
Salvar como `arte/ia/inimigos-folhas/f14_comum_servo_demoniaco.png` · anexo 2: nenhum (ainda sem arte; só o anexo 1)
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a demonic servant: a hunched grey-skinned demon with small horns, ragged dark robes, a rusty chain on one wrist and a crude spear.
This is an ENEMY with a hostile expression.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Xianxia chinese fantasy.
```

**Rápido — Morcego do Caixão** · habilidades: voa  
Salvar como `arte/ia/inimigos-folhas/f14_rapido_morcego_caixao.png` · anexo 2: nenhum (ainda sem arte; só o anexo 1) · **voa**
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a coffin bat: a bony black bat with tattered wings, glowing red eyes and a tiny red seal mark on its forehead, flying in a zig-zag.
This is an ENEMY with a hostile expression.
Columns: a 4-frame hovering cycle: the creature floats above the ground and never walks. Wings fully up in frame 1, halfway in frames 2 and 4, fully down in frame 3 (without wings: a gentle bob up and down instead). Frames 1 and 3 must be DIFFERENT in every row.
Xianxia chinese fantasy.
```

**Forte — Guardião do Selo** · habilidades: escudo  
Salvar como `arte/ia/inimigos-folhas/f14_forte_guardiao_selo.png` · anexo 2: nenhum (ainda sem arte; só o anexo 1)
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a seal guardian: a heavy stone warrior statue with a huge round shield covered in glowing red seal runes, a translucent red barrier around its body.
This is an ENEMY with a hostile expression.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Xianxia chinese fantasy.
```

**Chefe — Líder dos Rebeldes Demoníacos** · habilidades: curandeiro, fúria  
Salvar como `arte/ia/inimigos-folhas/f14_chefe_lider_rebeldes.png` · anexo 2: nenhum (ainda sem arte; só o anexo 1)
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: the leader of the demon rebels: a tall ancient demon warlord with long white hair, two curved horns, a torn crimson battle cloak, black armor with broken chains on his wrists, a green healing aura flowing to his allies and red fury in his eyes.
This is an ENEMY BOSS: bigger, more detailed and more imposing than a normal enemy, with a menacing expression and a subtle glowing aura that stays inside each cell.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Xianxia chinese fantasy.
```

## Fase 15 — Associação dos Mestres de Pílulas

**Comum — Aprendiz Arrogante** · habilidades: escudo  
Salvar como `arte/ia/inimigos-folhas/f15_comum_aprendiz_arrogante.png` · anexo 2: nenhum (ainda sem arte; só o anexo 1)
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: an arrogant alchemy apprentice: a young man in a fine orange and white alchemist robe, nose in the air, holding a glowing pill, a thin golden protective barrier around him.
This is an ENEMY with a hostile expression.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Xianxia chinese fantasy.
```

**Rápido — Comprador Violento**  
Salvar como `arte/ia/inimigos-folhas/f15_rapido_comprador_violento.png` · anexo 2: nenhum (ainda sem arte; só o anexo 1)
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a violent buyer: a wiry man in a dark merchant coat with a money pouch on his belt, running with a dagger, angry face.
This is an ENEMY with a hostile expression.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Xianxia chinese fantasy.
```

**Forte — Fornalha Viva** · habilidades: armadura  
Salvar como `arte/ia/inimigos-folhas/f15_forte_fornalha_viva.png` · anexo 2: nenhum (ainda sem arte; só o anexo 1)
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a living furnace: a squat bronze pill furnace walking on short metal legs, thick bronze plates, fire glowing through its vents and a lid like a helmet.
This is an ENEMY with a hostile expression.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Xianxia chinese fantasy.
```

**Chefe — Grão-Mestre Alquimista Rival** · habilidades: curandeiro, escudo  
Salvar como `arte/ia/inimigos-folhas/f15_chefe_grao_mestre_alquimista.png` · anexo 2: nenhum (ainda sem arte; só o anexo 1)
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a rival grand master alchemist: an old man with a long white beard in an ornate purple and gold alchemist robe, a floating miniature cauldron beside him, green healing pill smoke and a golden pill barrier around him, proud cold gaze.
This is an ENEMY BOSS: bigger, more detailed and more imposing than a normal enemy, with a menacing expression and a subtle glowing aura that stays inside each cell.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Xianxia chinese fantasy.
```

## Fase 16 — Seita do Céu Firmamento

**Comum — Discípulo do Firmamento**  
Salvar como `arte/ia/inimigos-folhas/f16_comum_discipulo_firmamento.png` · anexo 2: nenhum (ainda sem arte; só o anexo 1)
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a disciple of the Firmament Sky sect: a young cultivator in a dark blue robe with a silver cloud pattern, a slim sword, serious face.
This is an ENEMY with a hostile expression.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Xianxia chinese fantasy.
```

**Rápido — Enxame de Insetos** · habilidades: voa  
Salvar como `arte/ia/inimigos-folhas/f16_rapido_enxame_insetos.png` · anexo 2: nenhum (ainda sem arte; só o anexo 1) · **voa**
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a swarm of soul-devouring insects: a compact cloud of small dark purple beetles with glowing violet wings, flying together in one shape.
This is an ENEMY with a hostile expression.
Columns: a 4-frame hovering cycle: the creature floats above the ground and never walks. Wings fully up in frame 1, halfway in frames 2 and 4, fully down in frame 3 (without wings: a gentle bob up and down instead). Frames 1 and 3 must be DIFFERENT in every row.
Xianxia chinese fantasy.
```

**Forte — Inseto Soldado** · habilidades: armadura  
Salvar como `arte/ia/inimigos-folhas/f16_forte_inseto_soldado.png` · anexo 2: nenhum (ainda sem arte; só o anexo 1)
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a soldier insect: a big armoured beetle walking upright, thick dark purple carapace plates, sharp mandibles and scythe-like front legs.
This is an ENEMY with a hostile expression.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Xianxia chinese fantasy.
```

**Chefe — Rainha dos Insetos** · habilidades: invocador, curandeiro  
Salvar como `arte/ia/inimigos-folhas/f16_chefe_rainha_insetos.png` · anexo 2: nenhum (ainda sem arte; só o anexo 1)
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: the insect queen: a giant regal insect with a crown-like crest, a huge glowing violet abdomen full of eggs, translucent wings, small insects hatching around her and a green healing glow.
This is an ENEMY BOSS: bigger, more detailed and more imposing than a normal enemy, with a menacing expression and a subtle glowing aura that stays inside each cell.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Xianxia chinese fantasy.
```

## Fase 17 — Vazio Estelar

**Comum — Fragmento de Meteoro** · habilidades: armadura  
Salvar como `arte/ia/inimigos-folhas/f17_comum_fragmento_meteoro.png` · anexo 2: nenhum (ainda sem arte; só o anexo 1)
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a living meteor fragment: a small rocky creature made of dark meteor stone with glowing orange cracks, short stubby legs, hard rocky shell.
This is an ENEMY with a hostile expression.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Xianxia chinese fantasy.
```

**Rápido — Fera Estelar** · habilidades: voa  
Salvar como `arte/ia/inimigos-folhas/f17_rapido_fera_estelar.png` · anexo 2: nenhum (ainda sem arte; só o anexo 1) · **voa**
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a star beast: a sleek dark blue fox-like beast with a body full of tiny stars, glowing comet tail, flying through the void.
This is an ENEMY with a hostile expression.
Columns: a 4-frame hovering cycle: the creature floats above the ground and never walks. Wings fully up in frame 1, halfway in frames 2 and 4, fully down in frame 3 (without wings: a gentle bob up and down instead). Frames 1 and 3 must be DIFFERENT in every row.
Xianxia chinese fantasy.
```

**Forte — Golem de Meteoro** · habilidades: armadura, escudo  
Salvar como `arte/ia/inimigos-folhas/f17_forte_golem_meteoro.png` · anexo 2: nenhum (ainda sem arte; só o anexo 1)
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a meteor golem: a massive golem built of dark meteor rocks and iron ore, glowing orange core in its chest, a shimmering blue starlight barrier around it.
This is an ENEMY with a hostile expression.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Xianxia chinese fantasy.
```

**Chefe — Fera Ancestral do Vazio** · habilidades: fúria, escudo  
Salvar como `arte/ia/inimigos-folhas/f17_chefe_fera_ancestral_vazio.png` · anexo 2: nenhum (ainda sem arte; só o anexo 1)
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: the ancestral void beast: a colossal dragon-like beast with a body of deep purple void and stars, multiple glowing eyes, crystal horns, a cracked void barrier around it and red fury flames.
This is an ENEMY BOSS: bigger, more detailed and more imposing than a normal enemy, with a menacing expression and a subtle glowing aura that stays inside each cell.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Xianxia chinese fantasy.
```

## Fase 18 — Seita do Gelo

**Comum — Soldado de Osso Despertado**  
Salvar como `arte/ia/inimigos-folhas/f18_comum_soldado_osso_despertado.png` · anexo 2: nenhum (ainda sem arte; só o anexo 1)
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: an awakened bone soldier: a skeleton warrior covered in frost, old broken armour, a cracked spear, cold blue light in its eye sockets.
This is an ENEMY with a hostile expression.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Xianxia chinese fantasy.
```

**Rápido — Águia da Nevasca** · habilidades: voa  
Salvar como `arte/ia/inimigos-folhas/f18_rapido_aguia_nevasca.png` · anexo 2: nenhum (ainda sem arte; só o anexo 1) · **voa**
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a blizzard eagle: a white eagle with ice-crystal feathers, a trail of snowflakes behind its wings, diving.
This is an ENEMY with a hostile expression.
Columns: a 4-frame hovering cycle: the creature floats above the ground and never walks. Wings fully up in frame 1, halfway in frames 2 and 4, fully down in frame 3 (without wings: a gentle bob up and down instead). Frames 1 and 3 must be DIFFERENT in every row.
Xianxia chinese fantasy.
```

**Forte — Golem de Gelo** · habilidades: armadura  
Salvar como `arte/ia/inimigos-folhas/f18_forte_golem_gelo.png` · anexo 2: nenhum (ainda sem arte; só o anexo 1)
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: an ice golem: a hulking golem made of thick blue ice blocks, icicles on its shoulders, frosty breath, very heavy.
This is an ENEMY with a hostile expression.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Xianxia chinese fantasy.
```

**Chefe — Cadáver Ancestral da Raça dos Ossos** · habilidades: invocador, armadura  
Salvar como `arte/ia/inimigos-folhas/f18_chefe_cadaver_ancestral_ossos.png` · anexo 2: nenhum (ainda sem arte; só o anexo 1)
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: the ancestral corpse of the Bone Race: a towering alien skeleton lord with bone armour fused to its body, a cracked ice crown, small skeletons climbing out of the ice around it, cold blue and grey aura.
This is an ENEMY BOSS: bigger, more detailed and more imposing than a normal enemy, with a menacing expression and a subtle glowing aura that stays inside each cell.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Xianxia chinese fantasy.
```

## Fase 19 — Ruínas dos Hegemons

**Comum — Marionete de Pedra** · habilidades: armadura  
Salvar como `arte/ia/inimigos-folhas/f19_comum_marionete_pedra.png` · anexo 2: nenhum (ainda sem arte; só o anexo 1)
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a stone puppet: a jointed stone mannequin with visible hinges, an expressionless carved face and glowing rune lines, stiff walk.
This is an ENEMY with a hostile expression.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Xianxia chinese fantasy.
```

**Rápido — Assassino das Ruínas**  
Salvar como `arte/ia/inimigos-folhas/f19_rapido_assassino_ruinas.png` · anexo 2: nenhum (ainda sem arte; só o anexo 1)
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a ruins assassin: a slim masked figure in dark green wraps, twin daggers, running low and fast.
This is an ENEMY with a hostile expression.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Xianxia chinese fantasy.
```

**Forte — Guardião de Bronze** · habilidades: escudo  
Salvar como `arte/ia/inimigos-folhas/f19_forte_guardiao_bronze.png` · anexo 2: nenhum (ainda sem arte; só o anexo 1)
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a bronze guardian: a large bronze warrior statue with a tower shield, green patina, glowing rune barrier on the shield.
This is an ENEMY with a hostile expression.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Xianxia chinese fantasy.
```

**Chefe — Guardião Ancestral das Ruínas** · habilidades: armadura, curandeiro  
Salvar como `arte/ia/inimigos-folhas/f19_chefe_guardiao_ancestral_ruinas.png` · anexo 2: nenhum (ainda sem arte; só o anexo 1)
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: the ancestral guardian of the ruins: a giant ancient automaton of stone and bronze with a lotus emblem on its chest, thick armour plates, roots and moss growing on it, a green healing light from the lotus.
This is an ENEMY BOSS: bigger, more detailed and more imposing than a normal enemy, with a menacing expression and a subtle glowing aura that stays inside each cell.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Xianxia chinese fantasy.
```

## Fase 20 — Clã Sun e a Árvore Divina

**Comum — Guarda do Clã Sun**  
Salvar como `arte/ia/inimigos-folhas/f20_comum_guarda_cla_sun.png` · anexo 2: nenhum (ainda sem arte; só o anexo 1)
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a Sun clan guard: a soldier in gold and red lamellar armour with a sun emblem, a halberd, stern face.
This is an ENEMY with a hostile expression.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Xianxia chinese fantasy.
```

**Rápido — Fera Solar** · habilidades: voa  
Salvar como `arte/ia/inimigos-folhas/f20_rapido_fera_solar.png` · anexo 2: nenhum (ainda sem arte; só o anexo 1) · **voa**
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a solar beast: a small fiery bird-beast with burning golden feathers and a sun-shaped crest, leaving sparks while flying.
This is an ENEMY with a hostile expression.
Columns: a 4-frame hovering cycle: the creature floats above the ground and never walks. Wings fully up in frame 1, halfway in frames 2 and 4, fully down in frame 3 (without wings: a gentle bob up and down instead). Frames 1 and 3 must be DIFFERENT in every row.
Xianxia chinese fantasy.
```

**Forte — Capitão do Clã Sun** · habilidades: armadura  
Salvar como `arte/ia/inimigos-folhas/f20_forte_capitao_cla_sun.png` · anexo 2: nenhum (ainda sem arte; só o anexo 1)
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a Sun clan captain: a big warrior in heavy golden plate armour with a sun-shaped helmet crest, a great sword, burning orange aura.
This is an ENEMY with a hostile expression.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Xianxia chinese fantasy.
```

**Chefe — Patriarca do Clã Sun** · habilidades: curandeiro, fúria  
Salvar como `arte/ia/inimigos-folhas/f20_chefe_patriarca_cla_sun.png` · anexo 2: nenhum (ainda sem arte; só o anexo 1)
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: the patriarch of the Sun clan: an old powerful man in a magnificent gold and crimson robe with a sun crown, golden leaves of the divine tree swirling around him with a green healing glow, burning furious eyes.
This is an ENEMY BOSS: bigger, more detailed and more imposing than a normal enemy, with a menacing expression and a subtle glowing aura that stays inside each cell.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Xianxia chinese fantasy.
```

## Fase 21 — Território Demoníaco

**Comum — Guarda Demoníaco** · habilidades: escudo  
Salvar como `arte/ia/inimigos-folhas/f21_comum_guarda_demoniaco.png` · anexo 2: nenhum (ainda sem arte; só o anexo 1)
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a demonic guard: a red-skinned demon soldier with small horns, black armour and a spiked round shield with a red barrier.
This is an ENEMY with a hostile expression.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Xianxia chinese fantasy.
```

**Rápido — Fera Demoníaca** · habilidades: voa  
Salvar como `arte/ia/inimigos-folhas/f21_rapido_fera_demoniaca.png` · anexo 2: nenhum (ainda sem arte; só o anexo 1) · **voa**
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a demonic beast: a winged black hound with bat wings, red glowing eyes and smoking fangs, flying low.
This is an ENEMY with a hostile expression.
Columns: a 4-frame hovering cycle: the creature floats above the ground and never walks. Wings fully up in frame 1, halfway in frames 2 and 4, fully down in frame 3 (without wings: a gentle bob up and down instead). Frames 1 and 3 must be DIFFERENT in every row.
Xianxia chinese fantasy.
```

**Forte — Gladiador Demônio** · habilidades: armadura  
Salvar como `arte/ia/inimigos-folhas/f21_forte_gladiador_demonio.png` · anexo 2: nenhum (ainda sem arte; só o anexo 1)
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a demon gladiator: a huge muscular demon with heavy arena armour on one shoulder, a spiked helmet, a giant axe.
This is an ENEMY with a hostile expression.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Xianxia chinese fantasy.
```

**Chefe — Comandante Demoníaco Xue Li** · habilidades: invocador, fúria  
Salvar como `arte/ia/inimigos-folhas/f21_chefe_xue_li.png` · anexo 2: nenhum (ainda sem arte; só o anexo 1)
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: Demon Commander Xue Li: an elegant but terrifying demon commander with long black hair, curved crimson horns, ornate black and red armour, a blood-red spear, small demon soldiers rising from red portals behind him.
This is an ENEMY BOSS: bigger, more detailed and more imposing than a normal enemy, with a menacing expression and a subtle glowing aura that stays inside each cell.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Xianxia chinese fantasy.
```

## Fase 22 — Terra Santa dos Nove Céus

**Comum — Espírito Remanescente** · habilidades: voa  
Salvar como `arte/ia/inimigos-folhas/f22_comum_espirito_remanescente.png` · anexo 2: nenhum (ainda sem arte; só o anexo 1) · **voa**
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a lingering spirit: a translucent pale blue ghost of an ancient cultivator in flowing robes, floating, no legs, sad glowing eyes.
This is an ENEMY with a hostile expression.
Columns: a 4-frame hovering cycle: the creature floats above the ground and never walks. Wings fully up in frame 1, halfway in frames 2 and 4, fully down in frame 3 (without wings: a gentle bob up and down instead). Frames 1 and 3 must be DIFFERENT in every row.
Xianxia chinese fantasy.
```

**Rápido — Cadáver de Santa**  
Salvar como `arte/ia/inimigos-folhas/f22_rapido_cadaver_santa.png` · anexo 2: nenhum (ainda sem arte; só o anexo 1)
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a saint corpse: a pale undead woman in a torn white saint robe, long black hair over her face, moving fast with jerky steps.
This is an ENEMY with a hostile expression.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Xianxia chinese fantasy.
```

**Forte — Guardião da Tumba** · habilidades: escudo  
Salvar como `arte/ia/inimigos-folhas/f22_forte_guardiao_tumba.png` · anexo 2: nenhum (ainda sem arte; só o anexo 1)
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a tomb guardian: a tall armoured stone knight with a holy golden shield and a halberd, glowing white runes and a golden barrier.
This is an ENEMY with a hostile expression.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Xianxia chinese fantasy.
```

**Chefe — Santa Cadáver Ancestral** · habilidades: invocador, escudo  
Salvar como `arte/ia/inimigos-folhas/f22_chefe_santa_cadaver_ancestral.png` · anexo 2: nenhum (ainda sem arte; só o anexo 1) · **voa**
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: the ancestral saint corpse: a towering undead saint in an ornate white and gold funeral robe and crown, floating, long black hair, pale ghosts rising around her and a cold white barrier.
This is an ENEMY BOSS: bigger, more detailed and more imposing than a normal enemy, with a menacing expression and a subtle glowing aura that stays inside each cell.
Columns: a 4-frame hovering cycle: the creature floats above the ground and never walks. Wings fully up in frame 1, halfway in frames 2 and 4, fully down in frame 3 (without wings: a gentle bob up and down instead). Frames 1 and 3 must be DIFFERENT in every row.
Xianxia chinese fantasy.
```

## Fase 23 — Terras da Raça Monstro

**Comum — Guerreiro Monstro** · habilidades: armadura  
Salvar como `arte/ia/inimigos-folhas/f23_comum_guerreiro_monstro.png` · anexo 2: nenhum (ainda sem arte; só o anexo 1)
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a monster race warrior: a tiger-headed humanoid with bone and leather armour, a heavy club, tribal paint.
This is an ENEMY with a hostile expression.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Xianxia chinese fantasy.
```

**Rápido — Batedor Monstro** · habilidades: voa  
Salvar como `arte/ia/inimigos-folhas/f23_rapido_batedor_monstro.png` · anexo 2: nenhum (ainda sem arte; só o anexo 1) · **voa**
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a monster race scout: a hawk-headed humanoid with big brown wings, light leather gear and a short spear, flying.
This is an ENEMY with a hostile expression.
Columns: a 4-frame hovering cycle: the creature floats above the ground and never walks. Wings fully up in frame 1, halfway in frames 2 and 4, fully down in frame 3 (without wings: a gentle bob up and down instead). Frames 1 and 3 must be DIFFERENT in every row.
Xianxia chinese fantasy.
```

**Forte — Golem de Cristal** · habilidades: armadura, escudo  
Salvar como `arte/ia/inimigos-folhas/f23_forte_golem_cristal.png` · anexo 2: nenhum (ainda sem arte; só o anexo 1)
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a crystal golem: a big golem made of rough blue crystal blocks, crystal spikes on its back, a glowing crystal barrier.
This is an ENEMY with a hostile expression.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Xianxia chinese fantasy.
```

**Chefe — Rei da Raça Monstro** · habilidades: fúria, armadura  
Salvar como `arte/ia/inimigos-folhas/f23_chefe_rei_raca_monstro.png` · anexo 2: nenhum (ainda sem arte; só o anexo 1)
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: the king of the Monster Race: a gigantic lion-headed king with a mane like fire, heavy golden bone armour, a crown of horns, a huge war hammer, roaring with red fury.
This is an ENEMY BOSS: bigger, more detailed and more imposing than a normal enemy, with a menacing expression and a subtle glowing aura that stays inside each cell.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Xianxia chinese fantasy.
```

## Fase 24 — Invasão da Raça dos Ossos

**Comum — Soldado de Osso** · habilidades: armadura  
Salvar como `arte/ia/inimigos-folhas/f24_comum_soldado_osso.png` · anexo 2: nenhum (ainda sem arte; só o anexo 1)
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a bone soldier: an alien skeleton warrior with bone plates fused into armour, a bone blade, violet light in its eyes.
This is an ENEMY with a hostile expression.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Xianxia chinese fantasy.
```

**Rápido — Dragão de Ossos** · habilidades: voa  
Salvar como `arte/ia/inimigos-folhas/f24_rapido_dragao_ossos.png` · anexo 2: nenhum (ainda sem arte; só o anexo 1) · **voa**
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a bone dragon: a young skeletal dragon with bare bone wings and a violet glow inside its ribcage, flying fast.
This is an ENEMY with a hostile expression.
Columns: a 4-frame hovering cycle: the creature floats above the ground and never walks. Wings fully up in frame 1, halfway in frames 2 and 4, fully down in frame 3 (without wings: a gentle bob up and down instead). Frames 1 and 3 must be DIFFERENT in every row.
Xianxia chinese fantasy.
```

**Forte — General de Osso** · habilidades: armadura, escudo  
Salvar como `arte/ia/inimigos-folhas/f24_forte_general_osso.png` · anexo 2: nenhum (ainda sem arte; só o anexo 1)
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: a bone general: a huge armoured skeleton general with a bone tower shield, a cape of grey rags and a violet barrier.
This is an ENEMY with a hostile expression.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Xianxia chinese fantasy.
```

**Chefe — Ke Luo, Senhor da Raça dos Ossos** · habilidades: invocador, fúria, escudo  
Salvar como `arte/ia/inimigos-folhas/f24_chefe_ke_luo.png` · anexo 2: nenhum (ainda sem arte; só o anexo 1)
```
Pixel art character sprite sheet for a top-down RPG / tower defense game. Detailed HD pixel art in the SAME style, proportions and layout as the first attached sprite sheet: chibi body with a big head, clean dark outline, rich pixel shading, crisp pixels, no blur.
EXACTLY 4 rows and 4 columns: 16 frames in a perfectly even grid on a square canvas, every cell the same size, the character centered in each cell with the feet on the same baseline in every frame, never touching the cell borders.
Row 1: moving DOWN toward the camera (front view). Row 2: moving LEFT (side view, facing LEFT). Row 3: moving RIGHT (side view, facing RIGHT). Row 4: moving UP away from the camera (back view).
The SAME character in all 16 frames: identical design, colors, size and proportions; only the pose changes.
Real transparent background (not a checkerboard pattern), no grid lines, no text, no labels, no shadow, no ground.
Character: Ke Luo, Lord of the Bone Race: a colossal alien bone lord with a crown of bone spikes, a long skull-like face, armour of fused bones, a giant bone scythe, skeleton soldiers rising around him, a violet bone barrier and red fury.
This is an ENEMY BOSS: bigger, more detailed and more imposing than a normal enemy, with a menacing expression and a subtle glowing aura that stays inside each cell.
Columns: a 4-frame movement cycle that fits this creature's body. Two legs: frame 1 LEFT foot forward, frame 2 feet together, frame 3 RIGHT foot forward, frame 4 feet together. Four legs: a trot with opposite legs forward in frames 1 and 3. Snakes and worms slither in a wave. Frames 1 and 3 must be DIFFERENT in every row, including the front and back views.
Xianxia chinese fantasy.
```
