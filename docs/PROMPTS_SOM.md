# DTD — Prompts de som: músicas e efeitos sonoros

Pedido do dono (2026-10-23): gerar o som do jogo em outra IA. Este documento traz **os prompts** e **os nomes dos
arquivos**. Quando os arquivos chegarem, o Claude os coloca no jogo web e no Unity (diga **"sons prontos"**).

Até lá, o jogo web continua com os bipes simples e o Unity ganha os mesmos bipes. O volume de efeitos e de música já
fica nas **Configurações** do jogo, pronto para os arquivos.

**Total:** 6 músicas + 36 efeitos.

> Os prompts estão em **inglês** (as IAs entendem melhor); as explicações, em português.

---

## Que IA usar

| O quê | Sugestão | Observação |
|---|---|---|
| Músicas | **Suno** ou **Udio**, no modo **instrumental** | Peça várias versões e escolha a que dá um bom loop |
| Efeitos | **ElevenLabs Sound Effects** ou **Stable Audio** | Gere 3 ou 4 opções de cada e escolha a mais curta e limpa |

Qualquer outra IA serve, desde que o arquivo saia sem voz cantada e sem marca d'água sonora.

## Formato dos arquivos

| | Músicas | Efeitos |
|---|---|---|
| Formato | **OGG** ou **MP3** (WAV também serve: o Claude converte) | **OGG** ou **WAV** |
| Duração | 1 min 30 s a 2 min 30 s (as vinhetas: 4 a 8 s) | 0,1 a 1,5 s (habilidades e revelações: até 2,5 s) |
| Volume | parecido entre as faixas | sem silêncio no começo; o som começa no primeiro instante |
| Onde salvar | `arte/ia/som/musica/` | `arte/ia/som/efeitos/` |

Use **exatamente os nomes** abaixo (sem acento, com sublinhado). A pasta `arte/ia` fica fora do git, como a arte.

**Regras para tudo combinar:**
1. Sempre cole o **prompt-base** antes do prompt de cada som.
2. Nada de voz cantada nas músicas. Gritos curtos só nos efeitos que pedem (vitória, chefe).
3. Os efeitos tocam muitas vezes por segundo durante a batalha (golpes, mortes): eles precisam ser **curtos, secos e
   discretos**, para não cansar. Os de interface, mais suaves ainda.
4. Quando gostar da primeira música, use-a como **referência** nas outras (se a IA permitir), para manter o mesmo estilo.

---

## Músicas (6)

**Prompt-base das músicas (cole antes de cada uma):**
```
Instrumental only, no vocals. Chinese xianxia fantasy video game soundtrack for a pixel-art tower defense game. Traditional Chinese instruments (guzheng, erhu, dizi bamboo flute, pipa, taiko and Chinese percussion) blended with soft orchestral strings. Clean modern mix, loopable: the ending flows back seamlessly into the beginning, no fade-out, no long intro.
```

**`musica_menu`** — telas fora da batalha (esquadrão, recrutamento, heróis, cultivo)
```
Calm and contemplative theme, 80 BPM, D pentatonic. Gentle guzheng arpeggios, a slow dizi melody over warm strings, light wind chimes. Feeling of a peaceful mountain sect at dawn, hope and the beginning of a long journey.
```

**`musica_batalha_mundo1`** — batalhas das fases 1 a 12
```
Adventurous battle theme, 120 BPM, A minor pentatonic. Driving taiko and frame drums, energetic pipa and erhu melody, rhythmic guzheng ostinato, heroic string swells. Feeling of a young cultivator defending his sect: brave, focused, not too dark.
```

**`musica_batalha_mundo2`** — batalhas das fases 13 a 24 (Reino Tong Xuan)
```
Epic and darker battle theme, 130 BPM, E minor. Heavy war drums, low brass and cellos, intense erhu lead, fast guzheng runs, choir pads without words. Feeling of a vast new continent full of ancient demons and holy lands: grand, dangerous, majestic.
```

**`musica_chefe`** — a última onda, quando o chefe se aproxima
```
Intense boss battle theme, 145 BPM, C minor. Pounding taiko, aggressive low strings, dramatic erhu and suona lead, metallic gong hits, rising tension. Feeling of a powerful enemy master arriving: urgent and thrilling.
```

**`vinheta_vitoria`** — 5 a 8 segundos, toca uma vez (não precisa de loop)
```
Short triumphant victory fanfare, 6 seconds, NOT loopable, clear ending. Bright dizi and suona melody rising, a big gong and taiko hit at the end, shimmering guzheng glissando. Feeling of glory and relief after protecting the sect.
```

**`vinheta_derrota`** — 4 a 6 segundos, toca uma vez
```
Short sad defeat theme, 5 seconds, NOT loopable, clear ending. Slow descending erhu phrase over a soft low drone, one quiet gong at the end. Melancholic but not hopeless: a lesson, not the end of the journey.
```

---

## Efeitos (36)

**Prompt-base dos efeitos (cole antes de cada um):**
```
Short clean video game sound effect for a fantasy pixel-art tower defense game with a Chinese martial arts theme. Starts instantly with no silence, no music, no voice unless asked, no reverb tail longer than half a second.
```

### Interface (6)

| Arquivo | Quando toca | Prompt |
|---|---|---|
| `clique` | qualquer botão | `soft wooden click, like a bamboo bead tapping, very short (0.1 s), gentle` |
| `erro` | ação não permitida (sem Qi, sem cristais) | `soft low muted wooden knock, two quick taps, short (0.3 s), polite, not harsh` |
| `recompensa` | receber cristais (missão, conquista) | `bright crystal chime with a small sparkle shimmer, short (0.8 s), rewarding` |
| `estrela` | elevar estrela de herói, aprender talento | `magical rising chime with a soft golden whoosh, short (1 s), uplifting` |
| `conquista` | conquista desbloqueada | `small triumphant jingle with a gong tap and sparkling bells, 1.5 s` |
| `abrir_janela` | abrir janela ou página | `soft paper scroll unrolling with a light whoosh, short (0.4 s)` |

### Batalha (12)

| Arquivo | Quando toca | Prompt |
|---|---|---|
| `posicionar` | herói colocado numa plataforma | `light footstep landing on stone with a short whoosh of robes, 0.4 s` |
| `melhorar` | torre melhorada | `rising magical power-up with a soft metallic ring, 0.7 s` |
| `dispensar` | torre dispensada | `quick descending whoosh with a soft coin clink, 0.5 s` |
| `onda_inicio` | começo de cada onda | `single deep war drum hit followed by a short horn call, 1.2 s` |
| `chefe_chega` | o chefe aparece na última onda | `ominous deep gong hit with a low rumble and a distant roar, 2 s` |
| `vida_perdida` | um inimigo passa pelo portão | `dull heavy thud with a short crack, like a gate being hit, 0.5 s` |
| `inimigo_morre` | inimigo comum derrotado | `small soft puff of dust with a tiny chime, very short (0.25 s), discreet` |
| `chefe_morre` | chefe derrotado | `big explosive burst of energy with a deep boom and fading sparkles, 1.5 s` |
| `escudo_quebra` | escudo de um inimigo acaba | `glass-like magical barrier shattering, short (0.5 s)` |
| `cura` | inimigo curandeiro cura os outros | `soft rising green magical shimmer, gentle, 0.6 s` |
| `invocacao` | inimigo invocador chama lacaios | `dark swirling portal opening with a low whoosh, 0.8 s` |
| `furia` | inimigo entra em fúria | `short angry beast growl with a burst of fire, 0.6 s` |

### Golpes por elemento (7)

Tocam a cada ataque: precisam ser **bem curtos** (0,1 a 0,3 s) e baixos.

| Arquivo | Prompt |
|---|---|
| `golpe_fisico` | `quick sword slash whoosh with a light impact, 0.15 s` |
| `golpe_critico` | `heavy sword strike with a sharp metallic clang, punchy, 0.3 s` |
| `golpe_fogo` | `small fireball whoosh with a soft burst of flames, 0.25 s` |
| `golpe_raio` | `short electric zap crackle, 0.2 s` |
| `golpe_natureza` | `quick leaf rustle with a soft wet poison splash, 0.2 s` |
| `golpe_gelo` | `crisp ice shard hit with a tiny crystal crack, 0.2 s` |
| `golpe_vazio` | `deep warped whoosh, like space bending, short (0.25 s)` |

### Habilidades dos heróis (6)

| Arquivo | Habilidade | Prompt |
|---|---|---|
| `hab_golpe` | golpe forte em um inimigo | `powerful martial arts strike: sharp inhale, huge impact boom and a metallic ring, 1 s` |
| `hab_tempestade` | raios em vários inimigos | `thunderstorm burst: several fast lightning cracks and a rolling thunder, 1.5 s` |
| `hab_explosao` | explosão em área | `big fiery explosion with a deep boom and crackling embers, 1.5 s` |
| `hab_chuva` | chuva de golpes | `rapid flurry of many blade whooshes and light impacts, 1.5 s` |
| `hab_congelar` | congela os inimigos | `freezing blast: icy wind rush and crystals forming with a final crack, 1.5 s` |
| `hab_bencao` | acelera todas as torres | `holy blessing: warm choir-like pad swell with bright golden bells, 2 s, no words` |

### Recrutamento (5)

| Arquivo | Quando toca | Prompt |
|---|---|---|
| `invocar` | apertar Invocar | `mystical energy gathering, rising whoosh with a soft gong, 1.2 s` |
| `revelar_comum` | aparece um herói Comum ou Incomum | `simple soft chime pop, 0.5 s` |
| `revelar_raro` | aparece um Raro ou Épico | `brighter magical chime with a sparkle, 0.8 s` |
| `revelar_lendario` | aparece um Lendário, UR ou UR+ | `epic reveal: big gong, rising choir pad and golden sparkles, 2.5 s, no words` |
| `fragmentos` | herói repetido vira fragmentos | `small crystals clinking into a pouch, 0.5 s` |

---

## Ordem sugerida

1. **`musica_batalha_mundo1`** primeiro: é a que mais aparece. Quando gostar, use-a como referência.
2. **Batalha e golpes** (19 efeitos): são os que mais mudam a sensação do jogo.
3. O resto das músicas, habilidades, recrutamento e interface.

Diga **"sons prontos"** (ou "músicas prontas", "efeitos prontos"). O Claude então:

- converte os arquivos para o tamanho certo;
- coloca o som no jogo web e no Unity (`npm run unity` leva os sons junto);
- liga cada som ao seu momento e ajusta os volumes.

Os sons que ainda não existirem continuam com os bipes.
