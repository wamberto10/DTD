# DTD — Balanceamento de heróis e inimigos

Revisão de 23/10/2026. Os números ficam em `src/engine.js` (`BALANCE`), `src/data.js` (heróis) e `src/stars.js`
(estrelas). O Unity recebe os mesmos números pelo pacote (`npm run unity` e **DTD → Importar pacote do jogo web**).

## O que o balanceamento quer

- **O começo é tranquilo.** O jogador novo (Faxineiro + 3 invocações) vence a fase 1 com folga.
- **Recrutar faz diferença.** O Faxineiro sozinho dá conta das seis primeiras fases; a partir da 7 é preciso recrutar
  e elevar estrelas.
- **Todo jogador chega ao fim.** A coleção que um jogador típico junta vence as 12 fases, com folga no começo e apertada
  no fim. Mesmo o jogador sem sorte vence jogando bem (ou repetindo fases para juntar cristais).
- **Raridade importa.** Cada raridade rende mais dano por Qi que a anterior. Estrelas ajudam muito, mas um herói comum
  cheio de estrelas não passa um lendário novo tão cedo.
- **Nenhum herói custa mais que o Qi inicial (180).** Um esquadrão só de heróis caros não conseguiria pôr nenhuma
  torre antes da primeira onda e perderia a fase.

## Como foi medido

`npm run balanceamento` simula 400 jogadores do começo ao fim do mundo: cada um gasta todos os cristais em invocações
e eleva todas as estrelas possíveis. Em cada fase, um robô joga com o esquadrão desse jogador (os cinco heróis com mais
dano por Qi), gastando o Qi onde ele rende mais dano, seja colocando herói ou melhorando torre.

O resultado é a **folga**: quantas vezes mais vida os inimigos poderiam ter antes de o robô perder. Folga 2 quer dizer
"daria para vencer com inimigos duas vezes mais fortes"; abaixo de 1, ele perde. O robô joga melhor que a maioria das
pessoas, então uma folga de 1,3 a 1,5 já é um desafio de verdade para quem joga.

Os testes (`tests/engine.test.js`) usam uma estratégia mais simples, de pessoa: sempre o herói com mais dano por Qi,
três torres primeiro e depois uma nova sempre que todas chegam ao nível 3, gastando o Qi antes e durante as ondas.

## Antes e depois

| Fase | Faxineiro sozinho | Azarado (10%) | Mediano | Sortudo (90%) |
|---:|---|---|---|---|
| 1 | 4,0 → **2,0** | 4,5 → **2,5** | 5,6 → **2,4** | 7,1 → **3,5** |
| 3 | 3,0 → **1,5** | 4,4 → **2,0** | 5,0 → **2,1** | 6,5 → **3,2** |
| 6 | 2,5 → **1,3** | 3,7 → **1,9** | 4,5 → **2,2** | 6,7 → **2,9** |
| 9 | 1,6 → **perde** | 3,0 → **1,6** | 3,5 → **1,6** | 4,0 → **1,7** |
| 12 | 1,3 → **perde** | 3,3 → **1,3** | 3,4 → **1,4** | 4,6 → **1,9** |

Antes, o Faxineiro sozinho vencia as 12 fases sem perder vida, e o jogador mediano tinha 3 a 5 vezes a força necessária.

## O que mudou

| Número | Antes | Agora | Por quê |
|---|---|---|---|
| Vida dos inimigos (`baseHp` + `hpPerWave` × onda) | 23 + 8 | **46 + 16** | O jogo estava fácil demais em todas as fases |
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
- **O mesmo herói pode ocupar várias plataformas.** Com 5 heróis no esquadrão e 9 plataformas, mudar isso exigiria
  repensar o esquadrão.

## Para ajustar no futuro

1. Rode `npm run balanceamento` para ver a folga atual (leva alguns minutos).
2. Para testar uma mudança na vida dos inimigos antes de fazê-la: `npm run balanceamento -- 1.2` simula inimigos 20%
   mais fortes.
3. Mude os números, rode `npm test` (os testes de progressão avisam se o jogo ficou fácil ou difícil demais) e
   `npm run unity` para levar os números ao Unity.
