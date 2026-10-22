# DTD — Prompts dos 14 heróis no estilo chibi

Pedido do dono (2026-10-22): redesenhar os 14 heróis do DTD usando como referência os chibis do **Black Book Idle**.
Este documento traz **só os prompts**. O jogo não muda até a arte chegar; até lá, os heróis seguem com o desenho atual.

**Total:** 14 imagens, uma por herói. A mesma imagem serve para o card, o recrutamento e a torre no mapa (o Claude
reduz para a escala do jogo e limpa as bordas ao integrar).

> Os prompts estão em **inglês** (as IAs entendem melhor); as explicações, em português.

---

## Regras para todas as imagens

**Salvar em:** `arte/ia/herois/<id>.png` (dentro da pasta do DTD), com o nome indicado em cada herói.
Se o nome vier diferente, tudo bem: o Claude confere e renomeia.

**Anexe como referência:** o chibi indicado em cada herói. Eles ficam na pasta do Black Book:
`Desktop\BlackBookIdle\img\ui\mochila_heroi_<sexo>_<classe>.png`.

| Chibi de referência | Arquivo | Usado em |
|---|---|---|
| Espadachim (branco e azul) | `mochila_heroi_masculino_arma.png` | Faxineiro, Aprendiz do Pátio, Han Feng, Wu Kong, Dao Yuan |
| Espadachim (branco e azul) | `mochila_heroi_feminino_arma.png` | Bai Ling |
| Lutador (peito nu, azul e vermelho) | `mochila_heroi_masculino_corpo.png` | Mo Yan |
| Cultivador de fogo (vermelho e branco) | `mochila_heroi_masculino_elemental.png` | Shen Lei, Long Chen, Yan Tian |
| Cultivadora de fogo (vermelho e branco) | `mochila_heroi_feminino_elemental.png` | Lin Yue, Su Lan, Qing Lian, Xing He |

**O que copiar da referência:** só o estilo, a proporção (cabeça grande, cerca de 2,5 cabeças de altura), o rosto e o
acabamento em pixel. **A roupa e as cores vêm do prompt**, não da referência. As cores entre parênteses são as que o
herói já usa hoje no DTD.

**Raridade aparece no visual:** Comum é simples e sem brilho; Incomum e Raro ganham poucos enfeites e um brilho leve;
Épico e Lendário têm bordados e ornamentos dourados; UR e UR+ têm coroa, muitos ornamentos e uma aura forte.

**Final igual em todos (cole depois de cada prompt):**
```
Chibi pixel art game character, full body, standing in a ready idle pose, three-quarter front view facing slightly RIGHT, ONLY ONE character, real transparent background (not a checkerboard pattern), no text, no frame, no ground, no shadow. Big head and small body (about 2.5 heads tall), clean thick dark outline, crisp pixels, no blur, bold silhouette that stays readable when shrunk to 48 pixels tall. Same chibi proportions, face style, pixel-art style and quality as the attached image, but a DIFFERENT outfit and colors as described.
```

---

## Comuns

**1. `faxineiro.png`** — Faxineiro · *O primeiro passo* · Comum · físico
- **Anexe:** `mochila_heroi_masculino_arma.png`
- **Ideia:** é o mesmo herói do Black Book **antes da ascensão**, quando ainda era servo e varria os pátios do Pavilhão Ling Xiao.
```
The SAME young man as the attached image (same face and long black hair), but years before his ascension: a humble sect servant. Hair tied in a simple topknot with a plain cloth band, a few loose strands. Plain patched beige-khaki servant robe (#bba06c) with muted green trim (#567b65), sleeves rolled up, a rope belt, cloth leg wraps and straw sandals. Holding a long bamboo broom upright like a staff, determined calm eyes. No jewelry, no gold, no glow: the simplest hero of the game.
```

**2. `aprendiz.png`** — Aprendiz do Pátio · *Discípulo externo* · Comum · físico
- **Anexe:** `mochila_heroi_masculino_arma.png`
```
An eager young outer disciple of a martial sect: simple sage-teal training uniform (#7fada2) with cream trim (#e5d9aa), a plain cloth belt, black hair in a high ponytail tied with a cream ribbon. Holding a plain iron practice sword in the right hand in a basic guard stance. Simple clothes, no gold, no glow.
```

## Incomuns

**3. `lin-yue.png`** — Lin Yue · *Flor do vale* · Incomum · natureza
- **Anexe:** `mochila_heroi_feminino_elemental.png`
```
A gentle young female cultivator of the valley: soft green robes (#65a67a) with pale gold trim (#e9d999) and wide sleeves, brown hair (#473a36) in two round buns decorated with small white flowers. One hand raised holding a floating, glowing green spirit flower made of qi, small leaves and petals drifting around it. Few ornaments, a faint green glow.
```

**4. `han-feng.png`** — Han Feng · *Lâmina errante* · Incomum · físico
- **Anexe:** `mochila_heroi_masculino_arma.png`
```
A wandering swordsman without a master: messy wild black hair, a long ochre scarf (#d6b56f) blowing in the wind, worn olive-green travel robes (#7b9671) with ochre trim, a conical bamboo hat hanging on his back, leather bracers. Holding a single-edged straight sword low and ready, confident half smile. Few ornaments, no glow.
```

## Raros

**5. `su-lan.png`** — Su Lan · *Discípula do gelo* · Raro · gelo
- **Anexe:** `mochila_heroi_feminino_elemental.png`
```
A serene female ice cultivator: very long straight pale silver hair with a cold mint tint (#d6e5df), steel-blue robes (#6e9fbd) with frosty white trim (#e4f0e1), a thin silver hairpin shaped like a snowflake. One hand raised forming sharp floating crystal blades of ice qi in front of her, small snowflakes around. Calm cold eyes, a light frosty glow.
```

**6. `mo-yan.png`** — Mo Yan · *Punho da brasa* · Raro · fogo
- **Anexe:** `mochila_heroi_masculino_corpo.png`
```
A hot-blooded young martial artist with the same fighter body style as the attached image: spiky dark reddish-brown hair (#4c2d31) with an amber headband (#efac5f), a sleeveless rust-red martial vest (#af593f) with amber trim (#efb762), loose dark trousers, cloth hand wraps. Both fists raised in a boxing guard, burning with bright orange embers and small flames. Fierce grin, warm fire glow only on the fists.
```

## Épicos

**7. `shen-lei.png`** — Shen Lei · *Arauto da tempestade* · Épico · raio
- **Anexe:** `mochila_heroi_masculino_elemental.png`
```
A storm cultivator: indigo hair (#424468) in a high ponytail with a pale silver headband (#d7e8ec), layered violet robes (#8076ad) with silvery white trim (#d2dfeb) and silver embroidery of clouds and thunder. One hand thrust forward crackling with bright white-blue lightning arcs, a few sparks around the sleeves. Sharp focused eyes. Epic rarity: refined silver ornaments.
```

**8. `qing-lian.png`** — Qing Lian · *Lótus celeste* · Épico · natureza
- **Anexe:** `mochila_heroi_feminino_elemental.png`
```
A graceful female cultivator of the celestial lotus: dark teal hair (#29484d) in elegant buns with a small jade lotus crown, flowing jade-green robes (#71af9b) with pale gold trim (#ecdfb2) and lotus embroidery. A large luminous lotus flower floats above her open palm, glowing petals of qi circling her. Serene expression. Epic rarity: refined gold and jade ornaments.
```

## Lendários

**9. `long-chen.png`** — Long Chen · *Herdeiro do dragão* · Lendário · fogo
- **Anexe:** `mochila_heroi_masculino_elemental.png`
```
The heir of an ancient dragon bloodline: wild dark hair (#382e35) with a small golden dragon crown, bronze and gold armored robes (#977344, trim #f4cf75) with dragon-scale shoulder guards and a long red sash. A coiling dragon made of golden-orange fire wraps around his raised arm. Proud intense eyes, a faint golden dragon aura. Legendary rarity: rich gold ornaments.
```

**10. `bai-ling.png`** — Bai Ling · *Imperatriz da lua* · Lendário · gelo
- **Anexe:** `mochila_heroi_feminino_arma.png`
```
The Empress of the Moon Palace: long silver-white hair (#d6e8ec) in an elaborate imperial coiffure with a crescent moon crown and hanging pearl tassels, layered pale blue robes (#b6cbd6) with pale gold trim (#f4e7b7) and silver moon embroidery, a long translucent shawl. A glowing pale-blue crescent moon of qi floats behind her shoulder; she holds a slender silver sword with a moon-shaped guard. Calm and regal. Legendary rarity: rich silver and pale gold ornaments.
```

## UR

**11. `wu-kong.png`** — Wu Kong · *Soberano do vazio* · UR · vazio
- **Anexe:** `mochila_heroi_masculino_arma.png`
```
A sovereign of the void, a human cultivator (NOT a monkey): very long pale lavender-white hair (#d9d2e8), dusky purple robes (#74608d) with lavender trim (#d3b8ed) and star-dust patterns, a dark cloak whose hem dissolves into black void with tiny stars. One hand opens a small swirling purple-black spatial rift; the other holds a long black staff. Mysterious calm eyes. UR rarity: ornate silver and violet ornaments, a strong violet aura.
```

**12. `yan-tian.png`** — Yan Tian · *Sol imortal* · UR · fogo
- **Anexe:** `mochila_heroi_masculino_elemental.png`
```
An immortal of the burning sun: spiky copper-red hair (#ab543c) with a radiant golden sun crown, amber-orange and gold robes (#bf814d, trim #ffe1a0) with sun-ray embroidery, a small blazing sun of qi behind his back like a halo, flames dancing in one raised palm. Confident fiery eyes. UR rarity: ornate gold ornaments and a strong golden aura.
```

## UR+

**13. `dao-yuan.png`** — Dao Yuan · *Além dos nove céus* · UR+ · vazio
- **Anexe:** `mochila_heroi_masculino_arma.png`
```
A cultivator who understood the essence of the Dao: long dark slate hair (#34414b) flowing as if underwater, a tall ornate golden crown, ivory and cream immortal robes (#dac7a2) with gold trim (#e6ae5c) and nine-heavens cloud embroidery, many layers and long floating ribbons. A translucent white-gold dragon of light circles around him, with small floating golden Dao runes. Calm all-knowing eyes. UR+ rarity: the most ornate and divine hero of the game.
```

**14. `xing-he.png`** — Xing He · *Tecelã de estrelas* · UR+ · raio
- **Anexe:** `mochila_heroi_feminino_elemental.png`
```
A star weaver: pale periwinkle hair (#c8d4e7) in long twin tails with a starry tiara, lilac robes (#a18bb9) with pale gold trim (#f2dfac) that look like a night sky full of tiny stars, a long transparent ribbon. With one finger she draws a glowing constellation; small star lights and thin lightning threads connect the stars around her. Playful confident eyes. UR+ rarity: divine and ornate, a strong starlight aura.
```

---

## Ordem sugerida

1. **Faxineiro** primeiro: ele aparece em todas as fases e define o estilo dos outros. Gere 3 ou 4 opções e escolha a melhor.
2. Quando gostar dele, anexe o `faxineiro.png` **junto** com o chibi indicado nos próximos heróis, como segunda
   referência, para todos saírem com a mesma escala e o mesmo acabamento.
3. Faça os outros por raridade (Comuns → UR+).

Quando terminar um lote, diga **"heróis chibi prontos"** com quais heróis. O Claude integra e mostra o resultado no jogo.
