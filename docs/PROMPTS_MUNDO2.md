# DTD — Prompts do Mundo 2 (Reino Tong Xuan): fases 13 a 24

O Mundo 2 já está no jogo: 12 fases novas, com nomes, chefes e inimigos dos Mapas 13 a 24 do **Black Book Idle**
(`BlackBookIdle\js\dados\mundo2.js`). Enquanto a arte não chega, cada fase usa o cenário feito por código, com as cores
do lugar (brasa, gelo ou ouro), e os inimigos em pixel art genérico.

Este documento traz **os prompts** para a arte. O mundo libera ao vencer a Fase 12.

**Total:** 60 imagens = 12 cenários + 36 inimigos + 12 chefes.

> Os prompts estão em **inglês** (as IAs entendem melhor); as explicações, em português.
> As regras e os prompts-base são **os mesmos do Mundo 1** (`docs/PROMPTS_MUNDO1.md`), repetidos aqui por conveniência.

---

## As 12 fases

Cada fase tem 5 ondas e **quatro tipos de inimigo**: **Comum** (todas as ondas), **Rápido** (menos vida, mais veloz,
a partir da onda 2), **Forte** (mais vida, mais lento, a partir da onda 3) e **Chefe** (fim da onda 5, tira 5 vidas).

As **habilidades** já estão no jogo e ajudam a desenhar: um inimigo **voador** precisa estar voando no desenho, um
com **armadura** ou **escudo** deve mostrar isso, um **curandeiro** pode ter um brilho verde, um **invocador** pode ter
lacaios ou um portal pequeno atrás de si.

| Fase | Nome | Reino | Comum | Rápido | Forte | Chefe | O que você defende |
|---|---|---|---|---|---|---|---|
| 13 | Fronteira de Tong Xuan | Santo | Saqueador de Tong Xuan | Águia Tempestuosa *(voa)* | Urso de Ferro Negro *(armadura)* | Homem do Caixão *(invocador)* | Saída do portal |
| 14 | Mundo Selado do Caixão | Santo | Servo Demoníaco | Morcego do Caixão *(voa)* | Guardião do Selo *(escudo)* | Líder dos Rebeldes Demoníacos *(curandeiro, fúria)* | Porta do caixão |
| 15 | Associação dos Mestres de Pílulas | Rei Santo | Aprendiz Arrogante *(escudo)* | Comprador Violento | Fornalha Viva *(armadura)* | Grão-Mestre Alquimista Rival *(curandeiro, escudo)* | Salão de Testes |
| 16 | Seita do Céu Firmamento | Rei Santo | Discípulo do Firmamento | Enxame de Insetos *(voa)* | Inseto Soldado *(armadura)* | Rainha dos Insetos *(invocador, curandeiro)* | Entrada da caverna |
| 17 | Vazio Estelar | Retorno à Origem | Fragmento de Meteoro *(armadura)* | Fera Estelar *(voa)* | Golem de Meteoro *(armadura, escudo)* | Fera Ancestral do Vazio *(fúria, escudo)* | Rocha da Flor Demoníaca |
| 18 | Seita do Gelo | Retorno à Origem | Soldado de Osso Despertado | Águia da Nevasca *(voa)* | Golem de Gelo *(armadura)* | Cadáver Ancestral da Raça dos Ossos *(invocador, armadura)* | Palácio de gelo |
| 19 | Ruínas dos Hegemons | Rei da Origem | Marionete de Pedra *(armadura)* | Assassino das Ruínas | Guardião de Bronze *(escudo)* | Guardião Ancestral das Ruínas *(armadura, curandeiro)* | Lago da Lótus |
| 20 | Clã Sun e a Árvore Divina | Rei da Origem | Guarda do Clã Sun | Fera Solar *(voa)* | Capitão do Clã Sun *(armadura)* | Patriarca do Clã Sun *(curandeiro, fúria)* | Prisioneiros do sacrifício |
| 21 | Território Demoníaco | Origem do Dao | Guarda Demoníaco *(escudo)* | Fera Demoníaca *(voa)* | Gladiador Demônio *(armadura)* | Comandante Demoníaco Xue Li *(invocador, fúria)* | Arena dos gladiadores |
| 22 | Terra Santa dos Nove Céus | Origem do Dao | Espírito Remanescente *(voa)* | Cadáver de Santa | Guardião da Tumba *(escudo, armadura)* | Santa Cadáver Ancestral *(invocador, escudo)* | Salão da Sucessão |
| 23 | Terras da Raça Monstro | Imperador | Guerreiro Monstro *(armadura)* | Batedor Monstro *(voa)* | Golem de Cristal *(armadura, escudo)* | Rei da Raça Monstro *(fúria, armadura)* | Minas de Cristal |
| 24 | Invasão da Raça dos Ossos | Imperador | Soldado de Osso *(armadura)* | Dragão de Ossos *(voa)* | General de Osso *(armadura, escudo)* | Ke Luo, Senhor da Raça dos Ossos *(invocador, fúria, escudo)* | Última cidade de Tong Xuan |

---

## Regras dos cenários (12 imagens)

| Opção | Valor |
|---|---|
| Tamanho | **1500×900** (deitado, 5:3). Se a IA não deixar, use 16:9: o Claude corta. |
| Câmera | **De cima**, com um leve ângulo, como os mapas de RPG 16-bit (igual ao Mundo 1). |
| Fundo | Com cenário (não transparente). |
| Pessoas e criaturas | **Nenhuma**: heróis e inimigos são do jogo. |
| Onde salvar | `arte/ia/fases/f13_<nome>.png` … `f24_<nome>.png` (nomes abaixo) |

**Regras para todos combinarem:**
1. Sempre cole o **prompt-base** antes do prompt da fase.
2. O caminho entra pela **borda esquerda** e termina na **borda direita**, onde fica o lugar que você defende.
3. Ao lado do caminho, **9 plataformas redondas vazias** de pedra: é onde os heróis ficam.
4. **Não precisa acertar a forma exata do caminho.** O Claude ajusta o caminho e as plataformas do jogo para cada imagem.
5. Anexe um cenário aprovado do Mundo 1 como **referência de estilo**, para os dois mundos combinarem.
6. Gere 3 ou 4 opções e escolha a melhor.

**Prompt-base dos cenários (cole antes de cada um):**
```
Pixel art tower defense battle map, seen from above with a slight three-quarter angle like classic 16-bit RPG maps, wide landscape 5:3, xianxia chinese fantasy cultivation world. ONE single continuous road, about two tiles wide and clearly different from the ground, enters at the LEFT edge, winds across the whole map with 4 to 6 right-angle turns, and ends at the RIGHT edge at the place described below. Next to the road, 9 empty round stone platforms (flat circles, all the same size, nothing on them) spread along the whole road, never on the road itself. Trees, rocks and buildings only away from the road and the platforms. No characters, no people, no creatures, no text, no UI, no arrows. Limited color palette, crisp pixels, no anti-aliasing, soft lighting.
```

## Regras dos inimigos e chefes (48 imagens)

**Onde salvar:** inimigos em `arte/ia/inimigos/`, chefes em `arte/ia/chefes/`, com os nomes abaixo.

**Anexe como referência de estilo** um inimigo aprovado do Mundo 1 (por exemplo o Servo Arrogante), para todos saírem
no mesmo traço. **Formato:** corpo inteiro, **de lado olhando para a DIREITA**, fundo transparente, silhueta simples e forte.

**Final igual em todos os inimigos (cole depois de cada prompt):**
```
Chibi pixel art game enemy sprite, full body, side view facing RIGHT, walking forward, ONLY ONE creature, real transparent background (not a checkerboard pattern), no text, no frame, no ground, no shadow. Chibi proportions: oversized head, short body and legs. Clean thick dark outline, crisp pixels, no blur, bold simple silhouette that stays readable when shrunk to 40 pixels. Xianxia chinese fantasy. Same chibi pixel-art style as the attached image, but this is an ENEMY with a hostile expression.
```

**Final igual em todos os chefes (cole depois de cada prompt):**
```
Chibi pixel art game BOSS sprite, full body, side view facing RIGHT, imposing combat stance, ONLY ONE character, real transparent background (not a checkerboard pattern), no text, no frame, no ground, no shadow. Bigger and more detailed than a normal enemy but still chibi proportions (oversized head). Clean thick dark outline, crisp pixels, no blur, bold silhouette that stays readable when shrunk to 80 pixels. Xianxia chinese fantasy. Same chibi pixel-art style as the attached image, but this is an ENEMY BOSS with a menacing expression and a glowing aura.
```

Para inimigos **voadores**, troque `walking forward` por `flying forward, wings spread` no final.

---

## Fase 13 — Fronteira de Tong Xuan

*A chegada pelo portal. A Energia Mundial aqui é muito mais densa do que no Mundo Inicial.*

**Cenário `f13_fronteira_tong_xuan.png`**
```
A vast frontier land just beyond a spatial portal: dusty roads, ancient pine forests with huge trees, wind-swept hills, a jade-green stream, a wooden frontier village with watchtowers, glowing motes of dense world energy floating in the air. The road is a wide dusty frontier road. At the RIGHT edge: the swirling exit of the spatial portal framed by ancient stone pillars. Bright blue sky and warm dusk light (#4a7ac0, #f0c890, #4a6a4a).
```

**Comum `f13_comum_saqueador_tong_xuan.png`** — Saqueador de Tong Xuan (humano)
```
a Tong Xuan highway raider: a rough cultivator in a patched brown leather coat and a red scarf over his mouth, a curved saber, greedy eyes.
```

**Rápido `f13_rapido_aguia_tempestuosa.png`** — Águia Tempestuosa (fera, voa)
```
a storm eagle: a fierce blue-grey eagle with wide wings crackling with small white lightning sparks, sharp golden beak, diving fast.
```

**Forte `f13_forte_urso_ferro_negro.png`** — Urso de Ferro Negro (fera, armadura)
```
a black iron bear: a huge black bear whose shoulders, back and forearms are covered in dark iron plates like natural armor, glowing orange eyes, heavy steps.
```

**Chefe `f13_chefe_homem_do_caixao.png`** — Homem do Caixão (invocador)
```
the Coffin Man: a gaunt pale man in tattered black funeral robes carrying a huge ancient black coffin on his back with chains and glowing red seals, small shadowy demon wisps escaping from the coffin lid, sinister smile.
```

## Fase 14 — Mundo Selado do Caixão

*O pequeno mundo dentro do caixão, onde Demônios Antigos estão presos há eras.*

**Cenário `f14_mundo_selado_caixao.png`**
```
A sealed prison world inside a giant coffin: a grey ash plain under a dark red sky with no sun, rivers of green acid, towers made of giant bones, the tents and banners of rival demon factions, cracked red seal runes floating in the air. The road is cracked black stone. At the RIGHT edge: the huge carved door of the coffin, chained and sealed with glowing red talismans. Dark crimson and ash palette (#1a0a0a, #6a1a1a, #4a3a3a).
```

**Comum `f14_comum_servo_demoniaco.png`** — Servo Demoníaco (humano)
```
a demonic servant: a hunched grey-skinned demon with small horns, ragged dark robes, a rusty chain on one wrist and a crude spear.
```

**Rápido `f14_rapido_morcego_caixao.png`** — Morcego do Caixão (fera, voa)
```
a coffin bat: a bony black bat with tattered wings, glowing red eyes and a tiny red seal mark on its forehead, flying in a zig-zag.
```

**Forte `f14_forte_guardiao_selo.png`** — Guardião do Selo (guardião, escudo)
```
a seal guardian: a heavy stone warrior statue with a huge round shield covered in glowing red seal runes, a translucent red barrier around its body.
```

**Chefe `f14_chefe_lider_rebeldes.png`** — Líder dos Rebeldes Demoníacos (curandeiro, fúria)
```
the leader of the demon rebels: a tall ancient demon warlord with long white hair, two curved horns, a torn crimson battle cloak, black armor with broken chains on his wrists, a green healing aura flowing to his allies and red fury in his eyes.
```

## Fase 15 — Associação dos Mestres de Pílulas

*A grande cidade dos alquimistas: cada pílula aqui vale mais que uma seita inteira.*

**Cenário `f15_associacao_mestres_pilulas.png`**
```
A grand city of alchemists: elegant golden-roofed halls, streets lined with bronze pill furnaces breathing coloured smoke, rare herb gardens in walled courtyards, an auction house with banners, glowing pills displayed on stands. The road is polished stone tiles. At the RIGHT edge: the testing hall, a round building with a giant bronze cauldron in front. Warm golden afternoon palette (#6a9ad0, #f8e0b0, #6a6a5a).
```

**Comum `f15_comum_aprendiz_arrogante.png`** — Aprendiz Arrogante (humano, escudo)
```
an arrogant alchemy apprentice: a young man in a fine orange and white alchemist robe, nose in the air, holding a glowing pill, a thin golden protective barrier around him.
```

**Rápido `f15_rapido_comprador_violento.png`** — Comprador Violento (humano)
```
a violent buyer: a wiry man in a dark merchant coat with a money pouch on his belt, running with a dagger, angry face.
```

**Forte `f15_forte_fornalha_viva.png`** — Fornalha Viva (guardião, armadura)
```
a living furnace: a squat bronze pill furnace walking on short metal legs, thick bronze plates, fire glowing through its vents and a lid like a helmet.
```

**Chefe `f15_chefe_grao_mestre_alquimista.png`** — Grão-Mestre Alquimista Rival (curandeiro, escudo)
```
a rival grand master alchemist: an old man with a long white beard in an ornate purple and gold alchemist robe, a floating miniature cauldron beside him, green healing pill smoke and a golden pill barrier around him, proud cold gaze.
```

## Fase 16 — Seita do Céu Firmamento

*A seita fundada por quem criou o Pavilhão Ling Xiao, com cavernas cheias de Insetos Devoradores de Alma.*

**Cenário `f16_seita_ceu_firmamento.png`**
```
A sect of floating pagodas among clouds at dusk, with the dark mouth of deep caves below: cloud bridges, blue tiled roofs, glowing purple crystals inside the caves, sticky insect nests on the rocks. The road goes from a cloud bridge down into a cave tunnel. At the RIGHT edge: the cave entrance with a carved stone arch. Deep blue and violet palette (#2a3a6a, #8a9ad0, #3a4a6a).
```

**Comum `f16_comum_discipulo_firmamento.png`** — Discípulo do Firmamento (humano)
```
a disciple of the Firmament Sky sect: a young cultivator in a dark blue robe with a silver cloud pattern, a slim sword, serious face.
```

**Rápido `f16_rapido_enxame_insetos.png`** — Enxame de Insetos (fera, voa)
```
a swarm of soul-devouring insects: a compact cloud of small dark purple beetles with glowing violet wings, flying together in one shape.
```

**Forte `f16_forte_inseto_soldado.png`** — Inseto Soldado (fera, armadura)
```
a soldier insect: a big armoured beetle walking upright, thick dark purple carapace plates, sharp mandibles and scythe-like front legs.
```

**Chefe `f16_chefe_rainha_insetos.png`** — Rainha dos Insetos (invocador, curandeiro)
```
the insect queen: a giant regal insect with a crown-like crest, a huge glowing violet abdomen full of eggs, translucent wings, small insects hatching around her and a green healing glow.
```

## Fase 17 — Vazio Estelar

*O espaço além do céu de Tong Xuan e a Flor Demoníaca de Mil Anos.*

**Cenário `f17_vazio_estelar.png`**
```
Outer space beyond the sky: floating rocks and meteor fragments connected as one path, a purple nebula, distant stars, the ruins of an ancient battle platform drifting in the void. The road is a chain of flat floating stone slabs. At the RIGHT edge: a floating rock with a huge glowing crimson thousand-year demonic flower. Deep black and violet palette (#05030f, #3a1a6a, #241a3a).
```

**Comum `f17_comum_fragmento_meteoro.png`** — Fragmento de Meteoro (guardião, armadura)
```
a living meteor fragment: a small rocky creature made of dark meteor stone with glowing orange cracks, short stubby legs, hard rocky shell.
```

**Rápido `f17_rapido_fera_estelar.png`** — Fera Estelar (fera, voa)
```
a star beast: a sleek dark blue fox-like beast with a body full of tiny stars, glowing comet tail, flying through the void.
```

**Forte `f17_forte_golem_meteoro.png`** — Golem de Meteoro (guardião, armadura, escudo)
```
a meteor golem: a massive golem built of dark meteor rocks and iron ore, glowing orange core in its chest, a shimmering blue starlight barrier around it.
```

**Chefe `f17_chefe_fera_ancestral_vazio.png`** — Fera Ancestral do Vazio (fúria, escudo)
```
the ancestral void beast: a colossal dragon-like beast with a body of deep purple void and stars, multiple glowing eyes, crystal horns, a cracked void barrier around it and red fury flames.
```

## Fase 18 — Seita do Gelo

*Montanhas eternamente nevadas, palácios de gelo e a Raça dos Ossos selada na geleira.*

**Cenário `f18_seita_gelo.png`**
```
Eternal snowy mountains: palaces of blue ice, frozen lakes, crystal caves, pine trees under heavy snow, a huge glacier with a dark crack where something sleeps. The road is packed snow with ice tiles. At the RIGHT edge: the gate of an ice palace with slender spires. Pale blue and white palette (#8ab0d0, #e8f0f8, #4a6070).
```

**Comum `f18_comum_soldado_osso_despertado.png`** — Soldado de Osso Despertado (humano)
```
an awakened bone soldier: a skeleton warrior covered in frost, old broken armour, a cracked spear, cold blue light in its eye sockets.
```

**Rápido `f18_rapido_aguia_nevasca.png`** — Águia da Nevasca (fera, voa)
```
a blizzard eagle: a white eagle with ice-crystal feathers, a trail of snowflakes behind its wings, diving.
```

**Forte `f18_forte_golem_gelo.png`** — Golem de Gelo (guardião, armadura)
```
an ice golem: a hulking golem made of thick blue ice blocks, icicles on its shoulders, frosty breath, very heavy.
```

**Chefe `f18_chefe_cadaver_ancestral_ossos.png`** — Cadáver Ancestral da Raça dos Ossos (invocador, armadura)
```
the ancestral corpse of the Bone Race: a towering alien skeleton lord with bone armour fused to its body, a cracked ice crown, small skeletons climbing out of the ice around it, cold blue and grey aura.
```

## Fase 19 — Ruínas dos Hegemons

*Ruínas cheias de armadilhas e marionetes, escondendo a Lótus da Alma de Seis Cores.*

**Cenário `f19_ruinas_hegemons.png`**
```
Overgrown ancient ruins: broken pillars, flooded chambers, collapsed libraries, bronze statues covered in moss, glowing formation circles on the floor, vines everywhere. The road is cracked ancient flagstones. At the RIGHT edge: a calm lake with a huge glowing lotus of six colours. Moss green and old gold palette (#2a3a24, #6a6a4a, #b0a27a).
```

**Comum `f19_comum_marionete_pedra.png`** — Marionete de Pedra (guardião, armadura)
```
a stone puppet: a jointed stone mannequin with visible hinges, an expressionless carved face and glowing rune lines, stiff walk.
```

**Rápido `f19_rapido_assassino_ruinas.png`** — Assassino das Ruínas (humano)
```
a ruins assassin: a slim masked figure in dark green wraps, twin daggers, running low and fast.
```

**Forte `f19_forte_guardiao_bronze.png`** — Guardião de Bronze (guardião, escudo)
```
a bronze guardian: a large bronze warrior statue with a tower shield, green patina, glowing rune barrier on the shield.
```

**Chefe `f19_chefe_guardiao_ancestral_ruinas.png`** — Guardião Ancestral das Ruínas (armadura, curandeiro)
```
the ancestral guardian of the ruins: a giant ancient automaton of stone and bronze with a lotus emblem on its chest, thick armour plates, roots and moss growing on it, a green healing light from the lotus.
```

## Fase 20 — Clã Sun e a Árvore Divina

*Terras ardentes e uma Árvore Divina Yang alimentada com sacrifícios.*

**Cenário `f20_cla_sun_arvore_divina.png`**
```
Burning golden lands: fields of golden grass, a rich clan village with gilded roofs, a magma lake, a gigantic divine tree with burning golden leaves whose roots spread across the map, heat haze. The road is red stone. At the RIGHT edge: a prison of bars built into the tree roots, where the sacrifices are kept. Gold, orange and deep red palette (#5a3a10, #f0a040, #8a2a10).
```

**Comum `f20_comum_guarda_cla_sun.png`** — Guarda do Clã Sun (humano)
```
a Sun clan guard: a soldier in gold and red lamellar armour with a sun emblem, a halberd, stern face.
```

**Rápido `f20_rapido_fera_solar.png`** — Fera Solar (fera, voa)
```
a solar beast: a small fiery bird-beast with burning golden feathers and a sun-shaped crest, leaving sparks while flying.
```

**Forte `f20_forte_capitao_cla_sun.png`** — Capitão do Clã Sun (humano, armadura)
```
a Sun clan captain: a big warrior in heavy golden plate armour with a sun-shaped helmet crest, a great sword, burning orange aura.
```

**Chefe `f20_chefe_patriarca_cla_sun.png`** — Patriarca do Clã Sun (curandeiro, fúria)
```
the patriarch of the Sun clan: an old powerful man in a magnificent gold and crimson robe with a sun crown, golden leaves of the divine tree swirling around him with a green healing glow, burning furious eyes.
```

## Fase 21 — Território Demoníaco

*As terras da Raça Demoníaca sob um céu vermelho.*

**Cenário `f21_territorio_demoniaco.png`**
```
Demon lands under a red sky: black stone cities with spiked towers, a black swamp, a slave market with cages, the huge round gladiator arena in the distance, red banners. The road is black basalt. At the RIGHT edge: the gate of the gladiator arena. Crimson and black palette (#4a0a0a, #a02020, #1a0a0a).
```

**Comum `f21_comum_guarda_demoniaco.png`** — Guarda Demoníaco (escudo)
```
a demonic guard: a red-skinned demon soldier with small horns, black armour and a spiked round shield with a red barrier.
```

**Rápido `f21_rapido_fera_demoniaca.png`** — Fera Demoníaca (fera, voa)
```
a demonic beast: a winged black hound with bat wings, red glowing eyes and smoking fangs, flying low.
```

**Forte `f21_forte_gladiador_demonio.png`** — Gladiador Demônio (armadura)
```
a demon gladiator: a huge muscular demon with heavy arena armour on one shoulder, a spiked helmet, a giant axe.
```

**Chefe `f21_chefe_xue_li.png`** — Comandante Demoníaco Xue Li (invocador, fúria)
```
Demon Commander Xue Li: an elegant but terrifying demon commander with long black hair, curved crimson horns, ornate black and red armour, a blood-red spear, small demon soldiers rising from red portals behind him.
```

## Fase 22 — Terra Santa dos Nove Céus

*A Terra Santa mais poderosa de Tong Xuan e a Tumba dos Santos sob ela.*

**Cenário `f22_terra_santa_nove_ceus.png`**
```
A holy land of white marble and gold: long celestial staircases, gardens with white trees, halls with golden roofs, and below them the entrance to a vast tomb with rows of ancient statues and floating spirit lanterns. The road goes from the gardens down into the tomb corridors. At the RIGHT edge: the Hall of Succession, a tall white hall with a golden door. White, gold and pale blue palette (#4a4020, #f0e0b0, #8090b0).
```

**Comum `f22_comum_espirito_remanescente.png`** — Espírito Remanescente (guardião, voa)
```
a lingering spirit: a translucent pale blue ghost of an ancient cultivator in flowing robes, floating, no legs, sad glowing eyes.
```

**Rápido `f22_rapido_cadaver_santa.png`** — Cadáver de Santa (maligno)
```
a saint corpse: a pale undead woman in a torn white saint robe, long black hair over her face, moving fast with jerky steps.
```

**Forte `f22_forte_guardiao_tumba.png`** — Guardião da Tumba (guardião, escudo, armadura)
```
a tomb guardian: a tall armoured stone knight with a holy golden shield and a halberd, glowing white runes and a golden barrier.
```

**Chefe `f22_chefe_santa_cadaver_ancestral.png`** — Santa Cadáver Ancestral (invocador, escudo)
```
the ancestral saint corpse: a towering undead saint in an ornate white and gold funeral robe and crown, floating, long black hair, pale ghosts rising around her and a cold white barrier.
```

## Fase 23 — Terras da Raça Monstro

*O território selvagem da Raça Monstro e as Minas de Cristal tomadas à força.*

**Cenário `f23_terras_raca_monstro.png`**
```
Wild monster lands: savanna plains, a huge forest of thick trees, a river with claw marks on the banks, a tribal village with totems, and the entrance of crystal mines with glowing blue crystals. The road is a beaten earth trail. At the RIGHT edge: the crystal mine entrance with wooden supports and big blue crystals. Earthy brown and crystal blue palette (#3a2a10, #8a6a30, #4a90c0).
```

**Comum `f23_comum_guerreiro_monstro.png`** — Guerreiro Monstro (armadura)
```
a monster race warrior: a tiger-headed humanoid with bone and leather armour, a heavy club, tribal paint.
```

**Rápido `f23_rapido_batedor_monstro.png`** — Batedor Monstro (voa)
```
a monster race scout: a hawk-headed humanoid with big brown wings, light leather gear and a short spear, flying.
```

**Forte `f23_forte_golem_cristal.png`** — Golem de Cristal (guardião, armadura, escudo)
```
a crystal golem: a big golem made of rough blue crystal blocks, crystal spikes on its back, a glowing crystal barrier.
```

**Chefe `f23_chefe_rei_raca_monstro.png`** — Rei da Raça Monstro (fúria, armadura)
```
the king of the Monster Race: a gigantic lion-headed king with a mane like fire, heavy golden bone armour, a crown of horns, a huge war hammer, roaring with red fury.
```

## Fase 24 — Invasão da Raça dos Ossos

*A batalha final: humanos, demônios e monstros contra Ke Luo, o Senhor dos Ossos.*

**Cenário `f24_invasao_raca_ossos.png`**
```
A land being consumed by an alien bone invasion: abandoned cities, devastated fields, giant bone spikes erupting from the ground, a darkened sky with a huge bone portal, banners of humans, demons and monsters side by side on the last defence line. The road is cracked stone covered in bone dust. At the RIGHT edge: the last standing city gate of Tong Xuan. Grey bone and dark violet palette (#2a2a24, #6a6a60, #3a2040).
```

**Comum `f24_comum_soldado_osso.png`** — Soldado de Osso (armadura)
```
a bone soldier: an alien skeleton warrior with bone plates fused into armour, a bone blade, violet light in its eyes.
```

**Rápido `f24_rapido_dragao_ossos.png`** — Dragão de Ossos (fera, voa)
```
a bone dragon: a young skeletal dragon with bare bone wings and a violet glow inside its ribcage, flying fast.
```

**Forte `f24_forte_general_osso.png`** — General de Osso (armadura, escudo)
```
a bone general: a huge armoured skeleton general with a bone tower shield, a cape of grey rags and a violet barrier.
```

**Chefe `f24_chefe_ke_luo.png`** — Ke Luo, Senhor da Raça dos Ossos (invocador, fúria, escudo)
```
Ke Luo, Lord of the Bone Race: a colossal alien bone lord with a crown of bone spikes, a long skull-like face, armour of fused bones, a giant bone scythe, skeleton soldiers rising around him, a violet bone barrier and red fury.
```

---

## Ordem sugerida

1. **Fase 13 inteira:** cenário, 3 inimigos e chefe. Diga **"fase 13 pronta"**: o Claude integra, ajusta o caminho ao
   cenário e mostra a fase funcionando, para você aprovar o estilo do novo mundo.
2. **Fases 14 a 24**, uma por vez ou em lotes. Diga **"fases X a Y prontas"**.

**O que o Claude faz ao integrar** (nada disso precisa estar nas imagens): reduz a arte para a escala do DTD, limpa
o fundo, ajusta o caminho e as 9 plataformas a cada cenário e exporta tudo para o Unity (`npm run unity`).
Fases sem imagem continuam com o cenário feito por código.
