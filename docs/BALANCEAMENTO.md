# DTD — Balanceamento de heróis e inimigos

Revisão de 23/10/2026. Os números ficam em `src/engine.js` (`BALANCE`), `src/data.js` (heróis) e `src/stars.js`
(estrelas). O Unity recebe os mesmos números pelo pacote (`npm run unity` e **DTD → Importar pacote do jogo web**).

## Regras de campo

- **Cada herói defende uma plataforma por fase.** No máximo 5 torres, uma de cada herói do esquadrão. Dispensar a
  torre libera o herói de novo. Por isso recrutar e montar o esquadrão importam desde o começo.
- **Os inimigos entram pela borda do mapa.** As torres só os atingem depois que eles andam 40 unidades pela estrada
  (`enemyEntry`, cerca de 0,7 s para um inimigo comum). Assim nenhum morre antes de aparecer.
- **Nenhum herói custa mais que o Qi inicial (180).** Senão, um esquadrão só de heróis caros não conseguiria pôr nenhuma
  torre antes da primeira onda.

## O que o balanceamento quer

- **O começo é tranquilo.** O jogador novo (Faxineiro + 3 invocações com os 300 cristais iniciais) vence a fase 1 com
  folga, e os primeiros recrutas o levam até a fase 6 sem perder vida.
- **Recrutar faz diferença.** O Faxineiro sozinho é uma torre só: vence as primeiras fases perdendo vidas, o que aponta
  para o recrutamento, e não passa da fase 3.
- **Todo jogador chega ao fim.** A coleção que um jogador típico junta vence as 12 fases, com folga no começo e apertada
  no fim. Mesmo o jogador sem sorte vence jogando bem (ou repetindo fases para juntar cristais).
- **Raridade importa.** Cada raridade rende mais dano por Qi que a anterior. Estrelas ajudam muito, mas um herói comum
  cheio de estrelas não passa um lendário novo tão cedo.

## Como foi medido

`npm run balanceamento` simula 400 jogadores do começo ao fim do mundo: cada um gasta todos os cristais em invocações
e eleva todas as estrelas possíveis. Em cada fase, um robô joga com o esquadrão desse jogador (os cinco heróis mais
fortes, um por plataforma), gastando o Qi onde ele rende mais dano, seja colocando herói ou melhorando torre. Os
jogadores são ordenados pela força somada do esquadrão (azarado = 10%, mediano = 50%, sortudo = 90%).

O resultado é a **folga**: quantas vezes mais vida os inimigos poderiam ter antes de o robô perder. Folga 2 quer dizer
"daria para vencer com inimigos duas vezes mais fortes"; abaixo de 1, ele perde. O robô joga melhor que a maioria das
pessoas, então uma folga de 1,3 a 1,5 já é um desafio de verdade para quem joga.

Os testes (`tests/engine.test.js`) usam uma estratégia mais simples, de pessoa: os heróis entram em ordem de dano por
Qi, cada um na plataforma livre que vê mais estrada; três torres primeiro, depois o próximo herói sempre que todas
chegam ao nível 3, senão melhora a mais fraca; o Qi é gasto antes e durante as ondas. Eles conferem que o Faxineiro
sozinho vence as fases 1 e 2 e perde a 4, que os três primeiros recrutas passam as fases 1 a 6 sem perder vida e que a
coleção típica do fim do mundo vence as 12.

## Folga atual

| Fase | Faxineiro sozinho | Azarado (10%) | Mediano | Sortudo (90%) |
|---:|---|---|---|---|
| 1 | 1,5 | 2,6 | 2,6 | 3,7 |
| 3 | 1,0 | 2,0 | 2,2 | 2,5 |
| 6 | perde | 2,2 | 2,5 | 3,0 |
| 9 | perde | 1,5 | 1,7 | 2,1 |
| 12 | perde | 1,6 | 1,4 | 1,6 |

Antes desta revisão, o Faxineiro sozinho vencia as 12 fases sem perder vida (ocupando todas as plataformas), e o
jogador mediano tinha de 3 a 5 vezes a força necessária em todas as fases.

## O que mudou

| Número | Antes | Agora | Por quê |
|---|---|---|---|
| Herói por plataforma | o mesmo herói em várias | **um por herói** | O esquadrão não fazia diferença: bastava repetir o melhor herói nas 9 plataformas |
| Entrada dos inimigos (`enemyEntry`) | atingíveis ao nascer | **depois de 40 unidades** | Torres perto do começo matavam o inimigo antes de ele aparecer |
| Vida dos inimigos (`baseHp` + `hpPerWave` × onda) | 23 + 8 | **42 + 15** | O jogo estava fácil demais em todas as fases |
| Aumento de vida por fase (`stageStep`) | 18% | 18% | Já acompanhava bem o crescimento da coleção |
| Bônus por estrela | +10% dano, +3% ataques/s | **+7% dano, +2% ataques/s** | Com +10%, o Faxineiro com 8★ (comum na fase 12) passava um lendário novo |
| Custos | Aprendiz 65, Lin Yue 75, Han Feng 85, Su Lan 100, Mo Yan 115, Shen Lei 135, Qing Lian 145, Bai Ling 170 | 60, 70, 80, 95, 110, 130, 135, 175 | Degraus iguais de eficiência entre raridades |
| Dano do UR e UR+ | Wu Kong 119, Yan Tian 138, Dao Yuan 187, Xing He 166 | 103, 115, 133, 116 | O UR+ rendia 4,4× um comum pelo mesmo custo de um lendário |

Dano por segundo a cada 100 Qi gastos (dano × ataques/s ÷ custo × 100):

| Raridade | Antes | Agora |
|---|---:|---:|
| Comum | 31–32 | 32–33 |
| Incomum | 34–35 | 36–38 |
| Raro | 37–41 | 39–43 |
| Épico | 45–47 | 48–49 |
| Lendário | 58–59 | 56–59 |
| UR | 86–90 | 75 |
| UR+ | 140–143 | 100 |

O Su Lan e a Bai Ling ficam um pouco abaixo da sua raridade porque desaceleram os inimigos (gelo).

## O que ficou como estava

- **Economia de cristais:** 300 iniciais, 150 a 425 por primeira vitória, 50 por repetição, 100 por invocação (900 por
  dez). No fim do mundo, 86% dos jogadores têm um lendário e 8% têm um UR+.
- **Custo das estrelas e fragmentos:** 50 fragmentos por repetido, estrelas a 25, 25, 25, 50, 50 e o dobro a cada grupo.
- **Qi dos inimigos** (12, 12, 20 e 70) não cresce com a fase: a força para as fases difíceis vem da coleção.
- **Nove plataformas por fase:** com no máximo 5 torres, a escolha de onde pôr cada herói faz parte da estratégia.

## Para ajustar no futuro

1. Rode `npm run balanceamento` para ver a folga atual (leva alguns minutos).
2. Para testar uma mudança na vida dos inimigos antes de fazê-la: `npm run balanceamento -- 1.2` simula inimigos 20%
   mais fortes.
3. Mude os números, rode `npm test` (os testes de progressão avisam se o jogo ficou fácil ou difícil demais) e
   `npm run unity` para levar os números ao Unity.
