# DTD — Prompts do Mundo 1 (Mundo Inicial): 12 fases

Pedido do dono (2026-10-22): trazer a história do **Black Book Idle** para as fases do DTD, com a arte no estilo dos
chibis. Cada **mapa** do Mundo 1 do Black Book vira uma **fase** do DTD, com o mesmo nome, o mesmo chefe e inimigos
tirados da lista daquele mapa (`BlackBookIdle\js\dados\mundo1.js` e `BlackBookIdle\docs\LORE.md`).

Este documento traz **só os prompts**. O jogo não muda até a arte chegar.

**Total:** 60 imagens = 12 cenários + 36 inimigos + 12 chefes.

> Os prompts estão em **inglês** (as IAs entendem melhor); as explicações, em português.
> Os heróis chibi estão em `docs/PROMPTS_HEROIS_CHIBI.md`.

---

## As 12 fases

No DTD cada fase tem 5 ondas e **quatro tipos de inimigo**:
- **Comum:** o inimigo básico, presente em todas as ondas.
- **Rápido:** menos vida e muito mais veloz, a partir da onda 2.
- **Forte:** mais vida e mais lento, a partir da onda 3.
- **Chefe:** aparece no fim da onda 5 e tira 5 vidas se passar.

| Fase | Nome | Reino | Comum | Rápido | Forte | Chefe | O que você defende |
|---|---|---|---|---|---|---|---|
| 1 | Pavilhão Ling Xiao | Corpo Temperado | Servo Arrogante | Macaco Ladrão | Valentão dos Alojamentos | Discípulo Interno de Elite | Portão do pátio dos servos |
| 2 | Montanhas do Pavilhão Ling Xiao | Elemento Inicial | Lobo Cinzento | Morcego Sanguinário | Javali de Presas de Ferro | Fera Espiritual da Montanha | Ermida das ervas |
| 3 | Cidades da Grande Dinastia Han | Transformação do Qi | Bandido de Estrada | Batedor de Carteiras | Lutador do Bando da Batalha Sangrenta | Jovem Mestre da Família | Portão da mansão |
| 4 | Caminho para a Capital Central | Transformação do Qi | Saqueador de Caravanas | Assassino Contratado | Escolta Mercenária | Especialista das Grandes Famílias | Estalagem Imperial |
| 5 | Capital Central | Separação e Reunião | Arruaceiro da Capital | Sentinela Oculta | Guarda de Família Nobre | Jovem Especialista das Oito Famílias | Portão do palácio |
| 6 | Vale do Rei da Medicina | Separação e Reunião | Ladrão de Ervas | Serpente do Lago Medicinal | Golem de Fornalha | Guardião do Vale | Pavilhão das pílulas |
| 7 | Terras Selvagens | Elemento Verdadeiro | Hiena Espiritual | Aranha Gigante | Crocodilo de Escamas de Ferro | Grande Monstro Espiritual | Acampamento nas ruínas |
| 8 | Terras do Vale do Rei Fantasma | Elemento Verdadeiro | Cultivador Maligno | Morcego Demoníaco | Fera Corrompida | Mestre do Vale do Rei Fantasma | Santuário da vila cercada |
| 9 | Guerra contra a Dinastia Tian Lang | Ascensão Imortal | Soldado de Tian Lang | Batedor de Tian Lang | Capitão de Tian Lang | General da Dinastia Tian Lang | Muralha da seita |
| 10 | Misteriosos Pequenos Mundos | Ascensão Imortal | Espírito Errante | Reflexo Sombrio | Besta de Pedra Antiga | Guardião da Antiga Herança | Santuário da Herança |
| 11 | O Segredo do Mundo | Transcendente | Caçador Dimensional | Fera do Vazio | Sentinela de Pedra | Guardião do Corredor do Vazio | Mural da Verdade |
| 12 | Portal para o Reino Tong Xuan | Transcendente | Especialista Errante | Distorção Espacial | Formação Guardiã Desperta | Senhor Demônio | O portal |

---

## Regras dos cenários (12 imagens)

| Opção | Valor |
|---|---|
| Tamanho | **1500×900** (deitado, 5:3). Se a IA não deixar, use 16:9: o Claude corta. |
| Câmera | **De cima**, com um leve ângulo, como os mapas de RPG 16-bit (igual ao DTD hoje). |
| Fundo | Com cenário (não transparente). |
| Pessoas e criaturas | **Nenhuma**: heróis e inimigos são do jogo. |
| Onde salvar | `arte/ia/fases/f01_<nome>.png` … `f12_<nome>.png` (nomes abaixo) |

**Regras para todos combinarem:**
1. Sempre cole o **prompt-base** antes do prompt da fase.
2. O caminho entra pela **borda esquerda** e termina na **borda direita**, onde fica o lugar que você defende.
3. Ao lado do caminho, **9 plataformas redondas vazias** de pedra: é onde os heróis ficam.
4. **Não precisa acertar a forma exata do caminho.** O Claude ajusta o caminho e as plataformas do jogo para cada imagem.
5. Quando gostar do cenário da Fase 1, anexe-o como **referência de estilo** nos outros 11.
6. Gere 3 ou 4 opções e escolha a melhor.

**Prompt-base dos cenários (cole antes de cada um):**
```
Pixel art tower defense battle map, seen from above with a slight three-quarter angle like classic 16-bit RPG maps, wide landscape 5:3, xianxia chinese fantasy cultivation world. ONE single continuous road, about two tiles wide and clearly different from the ground, enters at the LEFT edge, winds across the whole map with 4 to 6 right-angle turns, and ends at the RIGHT edge at the place described below. Next to the road, 9 empty round stone platforms (flat circles, all the same size, nothing on them) spread along the whole road, never on the road itself. Trees, rocks and buildings only away from the road and the platforms. No characters, no people, no creatures, no text, no UI, no arrows. Limited color palette, crisp pixels, no anti-aliasing, soft lighting.
```

## Regras dos inimigos e chefes (48 imagens)

**Onde salvar:** inimigos em `arte/ia/inimigos/`, chefes em `arte/ia/chefes/`, com os nomes abaixo.

**Anexe como referência de estilo:** `Desktop\BlackBookIdle\img\ui\mochila_heroi_masculino_corpo.png`.
Quando o primeiro inimigo ficar bom, anexe ele também, como segunda referência, para todos saírem iguais.

**Formato:** corpo inteiro, **de lado olhando para a DIREITA** (o jogo vira quando o inimigo anda para a esquerda),
fundo transparente. Os inimigos ficam **pequenos** no mapa, por isso o desenho precisa de uma silhueta simples e forte.

**Final igual em todos os inimigos (cole depois de cada prompt):**
```
Chibi pixel art game enemy sprite, full body, side view facing RIGHT, walking forward, ONLY ONE creature, real transparent background (not a checkerboard pattern), no text, no frame, no ground, no shadow. Chibi proportions: oversized head, short body and legs. Clean thick dark outline, crisp pixels, no blur, bold simple silhouette that stays readable when shrunk to 40 pixels. Xianxia chinese fantasy. Same chibi pixel-art style as the attached image, but this is an ENEMY with a hostile expression.
```

**Final igual em todos os chefes (cole depois de cada prompt):**
```
Chibi pixel art game BOSS sprite, full body, side view facing RIGHT, imposing combat stance, ONLY ONE character, real transparent background (not a checkerboard pattern), no text, no frame, no ground, no shadow. Bigger and more detailed than a normal enemy but still chibi proportions (oversized head). Clean thick dark outline, crisp pixels, no blur, bold silhouette that stays readable when shrunk to 80 pixels. Xianxia chinese fantasy. Same chibi pixel-art style as the attached image, but this is an ENEMY BOSS with a menacing expression and a glowing aura.
```

---

## Fase 1 — Pavilhão Ling Xiao

*O início absoluto. Você é um servo insignificante de uma grande seita e varre estes pátios todos os dias.*

**Cenário `f01_pavilhao_ling_xiao.png`**
```
The grounds of a modest martial sect on a green hillside: wooden pavilions with curved dark-tile roofs, stone stairs, red lanterns, worn stone courtyard tiles, bamboo groves, pine trees and a small pond. The road is a dirt and stone servants' path. At the RIGHT edge, where the road ends: a small wooden sect gate with a curved roof. Calm morning light, green and warm gold palette (#41604f, #22362a, #f2c27a).
```

**Comum `f01_comum_servo_arrogante.png`** — Servo Arrogante (humano)
```
an arrogant senior servant of a martial sect: a smug young man in a plain grey-brown servant robe with a better belt than the other servants, chin raised, sleeves rolled up, holding a wooden stick, mocking sneer.
```

**Rápido `f01_rapido_macaco_ladrao.png`** — Macaco Ladrão (fera)
```
a small thieving monkey of the bamboo forest: brown fur, a long curled tail, a stolen red sect token in one hand, running on all fours with a mischievous grin.
```

**Forte `f01_forte_valentao_alojamentos.png`** — Valentão dos Alojamentos (humano)
```
a big bully of the disciples' dormitory: a huge broad-shouldered young man in a stretched outer-disciple uniform, thick neck, fists like hammers, cracking his knuckles.
```

**Chefe `f01_chefe_discipulo_interno_elite.png`** — Discípulo Interno de Elite
```
an elite inner disciple of the sect: a proud young swordsman in a refined white and dark green inner-disciple robe with silver trim, a jade pendant, hair in a neat topknot with a small silver crown, a gleaming long sword raised, cold arrogant gaze, green sword qi around the blade.
```

## Fase 2 — Montanhas do Pavilhão Ling Xiao

*As montanhas ao redor da seita escondem cavernas, ervas e feras espirituais.*

**Cenário `f02_montanhas_ling_xiao.png`**
```
Steep forested mountain slopes: pine forests, grey rocks, a waterfall and a cold stream crossing the map with a small wooden bridge where the road crosses it, narrow cliff ledges and patches of mist. The road is a narrow rocky mountain trail. At the RIGHT edge: a small herb hermitage hut with a stone lantern. Cool blue-green dawn light (#3f6a4a, #1f3a26, #8aa5a5).
```

**Comum `f02_comum_lobo_cinzento.png`** — Lobo Cinzento (fera)
```
a grey wolf with shaggy fur and glowing yellow eyes, trotting forward, teeth showing.
```

**Rápido `f02_rapido_morcego_sanguinario.png`** — Morcego Sanguinário (fera)
```
a blood bat: a small dark-red bat with big ears, sharp fangs and wide membranous wings, flying low and fast.
```

**Forte `f02_forte_javali_presas_ferro.png`** — Javali de Presas de Ferro (fera)
```
an iron-tusk boar: a huge bristly dark boar with long shiny iron-grey metallic tusks, charging with its head lowered.
```

**Chefe `f02_chefe_fera_espiritual_montanha.png`** — Fera Espiritual da Montanha
```
the spirit beast of the mountain: a massive white-and-grey tiger-like beast with stone plates growing on its back and shoulders, glowing jade-green markings, moss and small crystals along its spine, roaring.
```

## Fase 3 — Cidades da Grande Dinastia Han

*Vilas, mercados, casas de leilão e arenas: as grandes famílias controlam os recursos.*

**Cenário `f03_cidades_dinastia_han.png`**
```
An ancient chinese town: tiled rooftops, wooden shops with hanging banners and paper lanterns, a canal with a stone bridge, market stalls, small courtyards with trees. The road is a cobblestone street. At the RIGHT edge: the red gate of a local family mansion. Warm golden afternoon light (#6f6a50, #3a3424, #f4d49a).
```

**Comum `f03_comum_bandido_estrada.png`** — Bandido de Estrada (humano)
```
a road bandit: a scruffy man with a cloth mask over his mouth, patched brown clothes, a headband and a rusty saber.
```

**Rápido `f03_rapido_batedor_carteiras.png`** — Batedor de Carteiras (humano)
```
a quick pickpocket: a skinny young thief in dark grey clothes with a hood, a stolen coin purse in one hand, sneaky grin, running on tiptoe.
```

**Forte `f03_forte_lutador_batalha_sangrenta.png`** — Lutador do Bando da Batalha Sangrenta (humano)
```
a brutal arena fighter of the Bloody Battle Gang: a muscular bare-chested man with scars, iron knuckle gauntlets, a red sash, hair in a topknot, cocky grin.
```

**Chefe `f03_chefe_jovem_mestre_familia.png`** — Jovem Mestre da Família
```
a spoiled young master of a rich local family: an elegant young man in luxurious purple and gold silk robes, a jade crown, a folding fan in one hand and a thin sword at the waist, arrogant smile, two floating golden talismans around him.
```

## Fase 4 — Caminho para a Capital Central

*Estradas imperiais, caravanas e grandes cidades. Você ouve falar das Oito Grandes Famílias.*

**Cenário `f04_caminho_capital.png`**
```
A long imperial road through golden grassland and bamboo groves: an old stone milestone, a roadside shrine, a toll post, a wooden bridge over a ravine, autumn trees. The road is a wide packed-earth imperial road with wheel ruts. At the RIGHT edge: the wooden gate of an imperial inn with lanterns. Purple dusk light with an orange glow (#5a4a50, #2a2228, #f0a060).
```

**Comum `f04_comum_saqueador_caravanas.png`** — Saqueador de Caravanas (humano)
```
a caravan raider: a tough man in dusty leather and torn cloth, a sack of loot on his back, a hand axe, a cloth scarf over the nose.
```

**Rápido `f04_rapido_assassino_contratado.png`** — Assassino Contratado (humano)
```
a hired assassin: a slim figure in tight black clothes and a black face mask, two short daggers, crouched running pose.
```

**Forte `f04_forte_escolta_mercenaria.png`** — Escolta Mercenária (humano)
```
a heavy mercenary escort: a big man in lamellar leather armor with a large rectangular wooden shield and a spear, stern face.
```

**Chefe `f04_chefe_especialista_grandes_familias.png`** — Especialista das Grandes Famílias
```
an expert of the great families: a stern middle-aged cultivator with a neat beard, dark blue and silver noble robes with a family crest, a long guandao polearm, a strong blue qi aura.
```

## Fase 5 — Capital Central

*O centro político e marcial da Dinastia Han. Aqui seu nome começa a ser conhecido.*

**Cenário `f05_capital_central.png`**
```
A grand imperial capital: red palace walls with golden roofs, tall pagodas, white marble plazas with dragon carvings, red and gold banners, cherry trees and a moat. The road is a white marble avenue. At the RIGHT edge: a massive red palace gate with golden studs. Dramatic sunset, crimson and gold palette (#5a3a4a, #1a1018, #c0504a).
```

**Comum `f05_comum_arruaceiro_capital.png`** — Arruaceiro da Capital (humano)
```
a capital street thug: a rough young man in a loose open jacket, a wooden club on his shoulder, a sneer.
```

**Rápido `f05_rapido_sentinela_oculta.png`** — Sentinela Oculta (humano)
```
a hidden sentinel: a masked spy in dark green clothes with a small crossbow strapped to the forearm, light and fast.
```

**Forte `f05_forte_guarda_familia_nobre.png`** — Guarda de Família Nobre (humano)
```
a noble family guard: a tall guard in red and gold armor with a large halberd and a plumed helmet.
```

**Chefe `f05_chefe_jovem_especialista_oito_familias.png`** — Jovem Especialista das Oito Famílias
```
a young prodigy of the Eight Great Families: an elegant young man in white and crimson noble robes with golden embroidery, a phoenix hair crown, a red sword wrapped in crimson qi flames, confident proud smile.
```

## Fase 6 — Vale do Rei da Medicina

*Jardins espirituais e laboratórios: conhecimento e alquimia também decidem o destino.*

**Cenário `f06_vale_rei_medicina.png`**
```
A hidden lush valley: terraced herb gardens with glowing spiritual herbs, alchemy pavilions with smoking bronze cauldrons, a clear stream and a lotus pond, jade greenhouses, soft turquoise mist. The road is a mossy flagstone path. At the RIGHT edge: the Medicine King's pill pavilion with a large bronze cauldron at its door. Fresh turquoise and soft green palette (#4a8a6a, #244a38, #5fbfa0).
```

**Comum `f06_comum_ladrao_ervas.png`** — Ladrão de Ervas (humano)
```
a herb thief: a sneaky man with a big basket of stolen glowing herbs on his back, a small sickle, dirty green clothes.
```

**Rápido `f06_rapido_serpente_lago.png`** — Serpente do Lago Medicinal (fera)
```
a medicinal lake serpent: a slender jade-green snake with turquoise fins and small glowing spots, slithering fast.
```

**Forte `f06_forte_golem_fornalha.png`** — Golem de Fornalha (guardião)
```
a furnace golem: a heavy bronze golem shaped like a walking pill furnace, glowing orange fire in its belly grate and eyes, steam rising from the shoulders.
```

**Chefe `f06_chefe_guardiao_vale.png`** — Guardião do Vale
```
the guardian of the valley: a giant ancient spirit made of living wood, vines and medicinal flowers, a crown of glowing herbs, deep green glowing eyes, a large wooden staff topped with a lotus.
```

## Fase 7 — Terras Selvagens

*Longe da civilização: florestas gigantes, rios, ruínas e tesouros guardados por monstros.*

**Cenário `f07_terras_selvagens.png`**
```
A primeval wild jungle: giant ancient trees with huge roots, beast bones, a muddy river, thick vines, rocks with claw marks, beams of light through the canopy. The road is a trampled earth trail. At the RIGHT edge: a small camp with a wooden palisade and a tent, inside old stone ruins. Bright green and earthy palette (#3a6a2a, #1a3a10, #c8e8a8).
```

**Comum `f07_comum_hiena_espiritual.png`** — Hiena Espiritual (fera)
```
a spirit hyena: a spotted hyena with faint green glowing markings, hunched back, laughing grin.
```

**Rápido `f07_rapido_aranha_gigante.png`** — Aranha Gigante (fera)
```
a giant forest spider: a big black and dark-green spider with long hairy legs and many red eyes, scuttling fast.
```

**Forte `f07_forte_crocodilo_escamas_ferro.png`** — Crocodilo de Escamas de Ferro (fera)
```
an iron-scale crocodile: a huge crocodile with dark metallic iron-grey plates on its back, walking on four legs, jaws open.
```

**Chefe `f07_chefe_grande_monstro_espiritual.png`** — Grande Monstro Espiritual
```
the great spirit monster: a colossal hulking beast mixing a gorilla and a bull, dark green fur, huge horns, glowing golden eyes, ancient vines and moss on its back, pounding its chest.
```

## Fase 8 — Terras do Vale do Rei Fantasma

*Céu escuro e energia demoníaca: as terras das seitas malignas e dos Reis Malignos.*

**Cenário `f08_vale_rei_fantasma.png`**
```
A cursed land: cracked dark earth, dead twisted trees, ruins of a desecrated temple, blood-red pools, piles of bones, purple fog and faint green ghost lights. The road is a cracked black stone path. At the RIGHT edge: a small besieged village shrine protected by a glowing talisman barrier. Desaturated grey and violet palette with a red moon glow (#4a3a50, #140e18, #c03030).
```

**Comum `f08_comum_cultivador_maligno.png`** — Cultivador Maligno (maligno)
```
an evil sect cultivator: a pale gaunt man in ragged dark robes, a bone necklace, dark purple qi swirling in his claw-like hand.
```

**Rápido `f08_rapido_morcego_demoniaco.png`** — Morcego Demoníaco (fera)
```
a demonic bat: a black bat with glowing purple eyes, bony wings and a small horned head, flying low.
```

**Forte `f08_forte_fera_corrompida.png`** — Fera Corrompida (fera)
```
a corrupted beast: a large wolf-bear creature with black-purple fur, exposed bones, glowing purple veins, dripping dark miasma.
```

**Chefe `f08_chefe_mestre_rei_fantasma.png`** — Mestre do Vale do Rei Fantasma
```
the master of the Ghost King Valley: a tall sinister cultivator in black and dark purple robes with skull ornaments, long white hair, a bone mask over half of the face, holding a black soul banner from which green ghost fire and screaming spirit faces swirl.
```

## Fase 9 — Guerra contra a Dinastia Tian Lang

*A Dinastia Tian Lang, aliada às seitas malignas, invade a Dinastia Han.*

**Cenário `f09_guerra_tian_lang.png`**
```
A war-torn borderland: burning villages, broken fortress walls, trenches, wooden spike barricades, broken banners and spears stuck in the ground, smoking craters, floating embers. The road is a scorched war road. At the RIGHT edge: the stone gate of the sect's defensive wall with blue sect banners. Red-orange smoky light (#6a2a1a, #1a0a06, #e0602a).
```

**Comum `f09_comum_soldado_tian_lang.png`** — Soldado de Tian Lang (humano)
```
a soldier of the Heavenly Wolf dynasty: lamellar armor, a wolf-head helmet, a grey fur collar, a curved saber and a small round shield with a wolf emblem.
```

**Rápido `f09_rapido_batedor_tian_lang.png`** — Batedor de Tian Lang (humano)
```
a Heavenly Wolf scout: light leather armor, a wolf-fur hood, a short bow, running fast.
```

**Forte `f09_forte_capitao_tian_lang.png`** — Capitão de Tian Lang (humano)
```
a Heavenly Wolf captain: very heavy dark iron armor with a wolf-skull pauldron, a huge two-handed war axe, a red cape.
```

**Chefe `f09_chefe_general_tian_lang.png`** — General da Dinastia Tian Lang
```
the general of the Heavenly Wolf dynasty: an imposing warlord in black and gold armor shaped like a wolf, a great grey wolf pelt mantle, a long glaive, a howling spectral grey wolf aura behind him.
```

## Fase 10 — Misteriosos Pequenos Mundos

*Um pequeno mundo de ruínas, formações e túmulos antigos guarda segredos muito maiores.*

**Cenário `f10_pequenos_mundos.png`**
```
A mysterious small secret realm: floating stone islands linked by stone bridges over a starry void, small waterfalls falling into nothing, crystal formations, glowing blue spatial rifts and a petrified garden. The road is a path of floating stone slabs. At the RIGHT edge: an ancient inheritance sanctuary with a glowing altar. Deep blue and cyan palette (#24305a, #121a38, #3050a0).
```

**Comum `f10_comum_espirito_errante.png`** — Espírito Errante (guardião)
```
a wandering spirit: a translucent pale blue ghostly cultivator with a wispy tail instead of legs, empty glowing eyes, floating forward.
```

**Rápido `f10_rapido_reflexo_sombrio.png`** — Reflexo Sombrio (maligno)
```
a shadow reflection: a dark mirror silhouette of a swordsman made of black glass with cracks of white light, fast and sharp.
```

**Forte `f10_forte_besta_pedra_antiga.png`** — Besta de Pedra Antiga (fera)
```
an ancient stone beast: a heavy lion-like guardian statue come to life, grey stone with moss and glowing cyan runes.
```

**Chefe `f10_chefe_guardiao_antiga_heranca.png`** — Guardião da Antiga Herança
```
the guardian of the ancient inheritance: a giant warrior spirit in ancient bronze-gold armor covered in runes, a translucent blue body inside the armor, a huge ancient sword, floating stone fragments around him.
```

## Fase 11 — O Segredo do Mundo

*O Mundo Inicial é só um fragmento de uma realidade muito maior.*

**Cenário `f11_segredo_do_mundo.png`**
```
Ancient forgotten ruins: giant broken statues of immortals, stone pillars with glowing golden runes, huge formation circles carved into the floor, cracks showing the starry void beneath, floating dust of light. The road is a path of ancient rune tiles. At the RIGHT edge: a great stone mural with a glowing formation array (the Mural of Truth). Mystical indigo night palette (#1a1a40, #0c0c20, #2a1a5a).
```

**Comum `f11_comum_cacador_dimensional.png`** — Caçador Dimensional (maligno)
```
a dimensional hunter: a cloaked hunter from another world with a dark violet hood, a glowing chain-sickle, eyes like tiny portals.
```

**Rápido `f11_rapido_fera_vazio.png`** — Fera do Vazio (fera)
```
a void beast: a lean black panther-like creature whose body has holes showing stars, glowing purple eyes, leaping forward.
```

**Forte `f11_forte_sentinela_pedra.png`** — Sentinela de Pedra (guardião)
```
a stone sentinel: a tall bulky stone guardian with a carved square face, golden runes glowing on its body, a stone club.
```

**Chefe `f11_chefe_guardiao_corredor_vazio.png`** — Guardião do Corredor do Vazio
```
the guardian of the void corridor: a colossal ancient armored figure made of dark stone and starry void, a faceless helmet with one glowing golden eye, a spear made of light, rings of formation runes orbiting him.
```

## Fase 12 — Portal para o Reino Tong Xuan

*Diante de um antigo corredor espacial. Este mundo era apenas o começo.*

**Cenário `f12_portal_tong_xuan.png`**
```
The top of the highest mountain: ancient ruins, broken columns, stone stairs, a sea of clouds around the cliffs, streaks of cosmic energy, stars visible through the thin air. The road is an ancient stone causeway. At the RIGHT edge: a colossal ancient portal gate swirling with golden and cosmic energy. Epic gold and deep purple palette (#4a3a2a, #14100a, #7a5a20).
```

**Comum `f12_comum_especialista_errante.png`** — Especialista Errante (humano)
```
a wandering expert: a lone cultivator in a weathered grey travel cloak, a straw hat and a long sword on his back, calm dangerous eyes.
```

**Rápido `f12_rapido_distorcao_espacial.png`** — Distorção Espacial (guardião)
```
a spatial distortion: a small floating creature made of twisted space, like a cracked crystal shard with swirling purple and gold light, flickering.
```

**Forte `f12_forte_formacao_guardia.png`** — Formação Guardiã Desperta (guardião)
```
an awakened guardian formation: a heavy walking stone construct shaped like an ancient formation pillar on short legs, covered in glowing golden runes, a rotating ring of runes around its body.
```

**Chefe `f12_chefe_senhor_demonio.png`** — Senhor Demônio
```
the Demon Lord: a towering demonic overlord with dark red skin, large curved black horns, a flowing black and crimson cape, burning red eyes, black armor with gold demonic patterns, a huge black blade, dark red demonic flames around him.
```

---

## Ordem sugerida

1. **Heróis primeiro** (`docs/PROMPTS_HEROIS_CHIBI.md`), começando pelo Faxineiro.
2. **Fase 1 inteira:** cenário, 3 inimigos e chefe. Diga **"fase 1 pronta"**: o Claude integra, ajusta o caminho ao
   cenário e mostra a fase funcionando, para você aprovar o estilo antes do resto.
3. **Fases 2 a 12**, uma por vez ou em lotes. Diga **"fases X a Y prontas"**.

**O que o Claude faz ao integrar** (nada disso precisa estar nas imagens): reduz a arte para a escala do DTD, limpa
o fundo, ajusta o caminho e as 9 plataformas a cada cenário, escreve os textos das fases a partir do `LORE.md` e
refaz a curva de dificuldade para 12 fases. Fases sem imagem continuam com o cenário feito por código.
