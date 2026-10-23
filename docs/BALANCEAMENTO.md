# DTD — Balanceamento de heróis e inimigos

Revisão de 23/10/2026 (segunda do dia): elementos, dano em área, habilidades dos inimigos e dos heróis, estrelas das
fases, talentos e o Mundo 2. Os números ficam em `src/engine.js` (`BALANCE`), `src/data.js` (heróis, habilidades dos
inimigos por fase, talentos, missões) e `src/stars.js` (estrelas). O Unity recebe os mesmos números pelo pacote
(`npm run unity` e **DTD → Importar pacote do jogo web**).

## Regras de campo

- **Cada herói defende uma plataforma por fase.** No máximo 5 torres, uma de cada herói do esquadrão. Dispensar a
  torre libera o herói de novo. Por isso recrutar e montar o esquadrão importam desde o começo.
- **Os inimigos entram pela borda do mapa.** As torres só os atingem depois que eles andam 40 unidades pela estrada
  (`enemyEntry`, cerca de 0,7 s para um inimigo comum). Assim nenhum morre antes de aparecer.
- **Nenhum herói custa mais que o Qi inicial (180).** Senão, um esquadrão só de heróis caros não conseguiria pôr nenhuma
  torre antes da primeira onda.

## O que entrou nesta revisão

| Mecânica | Números (`BALANCE` em `src/engine.js`) |
|---|---|
| Físico | crítico a cada 4 golpes, dano ×2 |
| Fogo | queima 30% do golpe ao longo de 2 s |
| Raio | salta para 2 inimigos a até 90 de distância, com 50% do dano |
| Natureza | veneno de 12% do golpe por 4 s, acumula até 3 vezes |
| Gelo | desacelera para 65% da velocidade por 1,5 s (não pega voadores) |
| Vazio | atravessa armadura e escudo |
| Dano em área | 6 heróis, raio de 35 a 70 e de 30% a 60% do golpe (não pega voadores) |
| Armadura | golpes diretos perdem 35% (queimadura e veneno passam inteiros) |
| Escudo | camada extra de 40% da vida, gasta antes dela |
| Curandeiro | a cada 3 s cura 8% da vida de quem está a até 90 |
| Invocador | a cada 6 s chama 2 lacaios com 25% da vida dele (4 de Qi cada) |
| Fúria | abaixo de 50% da vida, fica 40% mais rápido |
| Habilidades | uma por herói; carregam só durante as ondas |
| Desafio | inimigos com 60% mais vida, 10 vidas |
| Talentos | até +50 Qi inicial, +5 vidas, +15% de dano, habilidades 40% mais rápidas, melhorias 20% mais baratas |

As habilidades dos inimigos de cada fase seguem o nome deles (morcegos voam, golems têm armadura, a Rainha dos Insetos
invoca) e ficam em `STAGE_TRAITS`, em `src/data.js`.

## O que o balanceamento quer

- **O começo é tranquilo.** O jogador novo (Faxineiro + 3 invocações com os 300 cristais iniciais) vence a fase 1 com
  folga, e os primeiros recrutas o levam até a fase 6 sem perder vida.
- **Recrutar faz diferença.** O Faxineiro sozinho é uma torre só: vence as primeiras fases perdendo vidas, o que aponta
  para o recrutamento, e perde as fases 3 e 4.
- **Todo jogador chega ao fim de cada mundo.** A coleção que um jogador típico junta vence as 12 fases de cada mundo, com
  folga no começo e apertada no fim (fases 12 e 24). Mesmo o jogador sem sorte vence jogando bem, ou repetindo fases,
  vencendo desafios e cumprindo as missões do dia para juntar mais cristais.
- **Raridade importa.** Cada raridade rende mais dano por Qi que a anterior. Estrelas ajudam muito, mas um herói comum
  cheio de estrelas não passa um lendário novo tão cedo.
- **Talentos ajudam, mas não são obrigatórios.** O jogador mediano que ignora os talentos ainda vence tudo jogando bem.

## Como foi medido

`npm run balanceamento` simula 400 jogadores do começo ao fim dos dois mundos. Cada um:

- gasta todos os cristais em invocações, já com a garantia;
- eleva todas as estrelas possíveis;
- ganha 2 estrelas por fase, a primeira vitória típica;
- gasta as estrelas no talento de nível mais barato.

Em cada fase, um robô joga com o esquadrão desse jogador (os cinco heróis mais fortes, um por plataforma). Ele gasta o Qi
onde rende mais dano, seja colocando herói ou melhorando torre, e usa cada habilidade assim que ela carrega. Os
jogadores são ordenados pela força somada do esquadrão (azarado = 10%, mediano = 50%, sortudo = 90%). Uma coluna extra
mede o jogador mediano sem talentos.

O resultado é a **folga**: quantas vezes mais vida os inimigos poderiam ter antes de o robô perder. Folga 2 quer dizer
"daria para vencer com inimigos duas vezes mais fortes"; abaixo de 1, ele perde. O robô joga melhor que a maioria das
pessoas, então uma folga de 1,3 a 1,5 já é um desafio de verdade para quem joga. O esquadrão é escolhido só pelo dano
por segundo, sem olhar elemento nem área, então um jogador "sortudo" às vezes leva um esquadrão pior para a fase que
o mediano. Por isso a coluna do sortudo oscila.

Os testes (`tests/engine.test.js`) usam uma estratégia mais simples, de pessoa. Os heróis entram em ordem de dano por
Qi, cada um na plataforma livre que vê mais estrada: três torres primeiro, depois o próximo herói sempre que todas
chegam ao nível 3; senão, melhora a mais fraca. O Qi é gasto antes e durante as ondas, e as habilidades são usadas uma
vez por segundo quando estão prontas. Os testes conferem:

- que o Faxineiro sozinho vence as fases 1 e 2 e perde a 4;
- que os três primeiros recrutas passam as fases 1 a 6 sem perder vida;
- que o esquadrão mediano da fase 12 (com os talentos típicos) vence o Mundo Inicial;
- que o esquadrão mediano da fase 24 vence o Reino Tong Xuan, sempre com pelo menos 10 vidas.

## Folga atual

| Fase | Faxineiro sozinho | Azarado (10%) | Mediano | Sortudo (90%) | Mediano sem talentos |
|---:|---|---|---|---|---|
| 1 | 1,7 | 3,1 | 3,3 | 4,1 | 3,3 |
| 3 | perde | 2,6 | 3,6 | 4,0 | 2,9 |
| 6 | 1,0 | 2,5 | 2,7 | 2,9 | 2,6 |
| 9 | perde | 1,5 | 2,5 | 7,0 | 1,9 |
| 12 | perde | 2,3 | 1,4 | 2,9 | 1,2 |
| 13 | perde | 1,8 | 1,9 | 6,2 | 1,5 |
| 16 | perde | 1,5 | 2,8 | 5,1 | 2,0 |
| 19 | perde | 1,9 | 2,8 | 5,2 | 1,9 |
| 22 | perde | 2,1 | 1,5 | 3,5 | 1,0 |
| 24 | perde | 1,0 | 1,8 | 2,6 | 1,4 |

Os esquadrões medianos usados nos testes: na fase 12, Long Chen, Bai Ling, Qing Lian, Mo Yan ★3 e Su Lan ★6; na
fase 24, Yan Tian, Wu Kong, Long Chen ★2, Bai Ling e Qing Lian ★3.

## O que mudou nesta revisão

| Número | Antes | Agora | Por quê |
|---|---|---|---|
| Vida dos inimigos (`baseHp` + `hpPerWave` × onda) | 42 + 15 | **52 + 19** | Críticos, queimaduras, venenos, área, habilidades e talentos deixaram o mediano com folga de 3,2 a 4,6 no Mundo 1 |
| Comuns da fase 9 | com armadura | **sem armadura** | Armadura em todos os inimigos da fase deixava o jogador simples sem saída |
| Fortes da fase 22 | escudo e armadura | **só escudo** | A fase ficava bem mais difícil que as vizinhas |

Antes desta revisão, com as mecânicas novas, a folga do mediano ia de 4,1 (fase 1) a 1,8 (fase 12), e o Mundo 2
ficava entre 1,9 e 3,8.

## Revisão anterior (mesmo dia)

| Número | Antes | Depois | Por quê |
|---|---|---|---|
| Herói por plataforma | o mesmo herói em várias | **um por herói** | O esquadrão não fazia diferença: bastava repetir o melhor herói nas 9 plataformas |
| Entrada dos inimigos (`enemyEntry`) | atingíveis ao nascer | **depois de 40 unidades** | Torres perto do começo matavam o inimigo antes de ele aparecer |
| Vida dos inimigos | 23 + 8 | 42 + 15 | O jogo estava fácil demais em todas as fases |
| Bônus por estrela | +10% dano, +3% ataques/s | **+7% dano, +2% ataques/s** | Com +10%, o Faxineiro com 8★ (comum na fase 12) passava um lendário novo |
| Custos | Aprendiz 65, Lin Yue 75, Han Feng 85, Su Lan 100, Mo Yan 115, Shen Lei 135, Qing Lian 145, Bai Ling 170 | 60, 70, 80, 95, 110, 130, 135, 175 | Degraus iguais de eficiência entre raridades |
| Dano do UR e UR+ | Wu Kong 119, Yan Tian 138, Dao Yuan 187, Xing He 166 | 103, 115, 133, 116 | O UR+ rendia 4,4× um comum pelo mesmo custo de um lendário |

Dano por segundo a cada 100 Qi gastos (dano × ataques/s ÷ custo × 100), sem contar elemento, área e habilidade:

| Raridade | Dano por 100 Qi |
|---|---:|
| Comum | 32–33 |
| Incomum | 36–38 |
| Raro | 39–43 |
| Épico | 48–49 |
| Lendário | 56–59 |
| UR | 75 |
| UR+ | 100 |

O Su Lan e a Bai Ling ficam um pouco abaixo da sua raridade porque desaceleram os inimigos (gelo).

## Economia

- **Cristais:** 300 iniciais; de 150 a 725 na primeira vitória de cada fase (25 a mais por fase); 50 por repetição;
  100 + 10 × fase na primeira vitória de cada desafio; de 30 a 70 por missão do dia, mais 50 por receber as três.
- **Recrutamento:** 100 cristais por invocação, 900 por dez. A cada 50 invocações sem um Lendário ou melhor, a próxima
  traz um. No sorteio garantido, Lendário, UR e UR+ mantêm suas proporções.
- **Estrelas dos heróis e fragmentos:** 50 fragmentos por repetido, estrelas a 25, 25, 25, 50, 50 e o dobro a cada grupo.
- **Estrelas do Dao:** até 3 por fase (3 sem perder vida, 2 perdendo até 30% das vidas, 1 nos outros casos) e uma por
  desafio vencido: até 72 + 24 = 96. Os cinco talentos no máximo custam 75 (o nível N custa N estrelas).
- **Qi dos inimigos** (12, 12, 20 e 70; 4 por lacaio) não cresce com a fase: a força para as fases difíceis vem da coleção.
- **Nove plataformas por fase:** com no máximo 5 torres, a escolha de onde pôr cada herói faz parte da estratégia.

## Para ajustar no futuro

1. Rode `npm run balanceamento` para ver a folga atual (leva alguns minutos).
2. Para testar uma mudança na vida dos inimigos antes de fazê-la: `npm run balanceamento -- 1.2` simula inimigos 20%
   mais fortes.
3. Mude os números, rode `npm test` (os testes de progressão avisam se o jogo ficou fácil ou difícil demais) e
   `npm run unity` para levar os números ao Unity.
