# DTD → Unity: plano de migração

O jogo web continua sendo a referência: ele já tem as 12 fases, a arte chibi, as estrelas, o esquadrão e as ondas
automáticas. A versão Unity reescreve tudo em C#, com **as mesmas regras e os mesmos números**, e ganha o que o
Unity faz melhor: animações, efeitos, partículas e builds para PC, navegador e celular.

## Andamento

- **Etapas 1 e 2 concluídas (2026-10-22).** O projeto Unity está em `Desktop\DTD-Unity` (Unity 6, 2D com URP, git próprio).
  Ele importa o pacote pelo menu *DTD → Importar pacote do jogo web*, e o núcleo do combate em C# passa nos 7 testes de paridade,
  incluindo as 4 partidas completas, quadro a quadro.
- **Etapa 3 concluída (2026-10-22).** A cena `Battle.unity` é jogável: cenário pintado, plataformas, torres chibi, inimigos com
  barra de vida, projéteis, interface (vidas, Qi, contagem, painel, esquadrão), pausa, 2× e ondas automáticas. O build para
  Windows venceu a fase 1 no modo demonstração (55 abates, 20 vidas).
- **Etapas 4 e 5 concluídas (2026-10-22).** O layout inteiro da versão web está no Unity: barra lateral, cristais no topo,
  "O caminho começa aqui." com *Selecionar fase*, Sabedoria do Dao, Recompensa da fase, as telas Esquadrão, Recrutamento e
  Meus heróis (com estrelas) e as janelas de fase, ficha do herói e resultado do recrutamento. O perfil (`PlayerProfile.cs`)
  segue as regras de `src/profile.js` e é salvo com `PlayerPrefs`; 17 testes EditMode passam (7 de paridade e 10 do perfil).
  Próxima: **etapa 6, som e o build WebGL testado no navegador**.

## O que já está pronto

- **Unity 6 (6000.6.4f1)** instalado pelo Unity Hub, com build para **Windows** e **WebGL**.
  Para celular, falta instalar o módulo **Android Build Support** pelo Hub.
- **Pacote de migração**: `npm run unity` gera a pasta `unity-export/` (não vai para o git, porque é gerada):
  - `dados/herois.json` e `dados/raridades.json`: os 14 heróis e as 7 raridades.
  - `dados/fases.json`: as 12 fases com nome, reino, chefe, inimigos, recompensa e o caminho e as 9 plataformas de cada cenário.
  - `dados/regras.json`: todos os números e fórmulas (combate, ondas, torres, estrelas, recrutamento, esquadrão, progresso).
  - `dados/casos-de-teste.json`: resultados do motor atual (caminhos, ondas, níveis das torres, estrelas e 4 partidas
    completas) para conferir, número por número, que a versão em C# joga igual.
  - `arte/`: heróis (512 px), inimigos (384 px), chefes (512 px) e cenários (2000 × 1200) em **PNG**, porque o Unity não importa WebP.
- Os números do combate ficam todos num só lugar no jogo web (`BALANCE`, em `src/engine.js`). Mudou o balanceamento?
  Rode `npm run unity` de novo e o Unity recebe os valores novos.

## Decisões antes de criar o projeto

1. **Plataforma principal**: PC (Windows), navegador (WebGL) ou celular (Android). Ela define o formato da tela
   (deitado ou em pé), o controle (mouse ou toque) e o tamanho das imagens.
2. **Onde fica o projeto**: recomendo uma pasta própria, `Desktop\DTD-Unity`, com um git só dela. Um projeto Unity
   cria pastas enormes (`Library/`) que não combinam com o repositório web.
3. **Interface**: recomendo **UI Toolkit**, porque usa UXML e USS, muito parecidos com o HTML e o CSS de hoje.
   A outra opção, uGUI, é mais antiga e tem mais tutoriais.
4. **Progresso salvo**: recomendo começar do zero no Unity. O progresso do navegador não passa sozinho.
5. **Fases 7 e 10**: recomendo gerar a arte que falta (`docs/PROMPTS_MUNDO1.md`) antes de chegar nelas. O cenário
   desenhado em código (SVG) não vale a pena portar.

## Como cada parte vira Unity

| Hoje (web) | No Unity |
|---|---|
| `src/engine.js`: simulação do combate | `GameSimulation.cs`: classe C# pura (sem `MonoBehaviour`), mesmo passo fixo de 1/30 s |
| `src/maps.js`: caminho e plataformas | `StageDefinition` (ScriptableObject), lido de `fases.json` |
| `src/data.js`: heróis, raridades, fases | `HeroDefinition`, `RarityTable`, `StageDefinition` (ScriptableObjects gerados do JSON) |
| `src/stars.js`: estrelas e fragmentos | `StarRules.cs` |
| `src/profile.js`: perfil, recrutamento, esquadrão | `PlayerProfile.cs` (regras) + `ProfileStore.cs` (JSON salvo com `PlayerPrefs`, que também funciona no WebGL) |
| `src/app.js` + `src/style.css`: telas | UI Toolkit: Defesa, Esquadrão, Recrutamento e Meus heróis, mais as janelas (fase, resultado, ficha do herói, recrutamento) |
| Mapa, torres e inimigos em SVG | `SpriteRenderer` para cenário, heróis e inimigos; barras de vida; projéteis como sprites ou partículas |
| Fontes Pixelify Sans e DM Sans | Font Assets do Unity, a partir dos arquivos TTF do Google Fonts (licença OFL) |
| Testes em Node (`npm test`) | Unity Test Framework (EditMode), usando `casos-de-teste.json` |

## Estrutura proposta do projeto

```
DTD-Unity/
  Assets/_DTD/
    Art/        Heroes, Enemies, Stages        (PNG do unity-export)
    Data/       ScriptableObjects gerados
    Import/     JSON do unity-export
    Scripts/Core/    simulação e regras (C# puro, testável)
    Scripts/Game/    cena de batalha: mapa, torres, inimigos, HUD
    Scripts/UI/      telas e janelas
    Scripts/Editor/  importador do pacote (um botão: "Importar dados do DTD")
    UI/         UXML, USS, fontes
    Scenes/     Main.unity
  Assets/Tests/EditMode/
```

## Coordenadas

- O espaço de batalha mede **1000 × 600**, com origem no canto superior esquerdo e **y para baixo**.
- No Unity, 1 unidade equivale a 100 do espaço de batalha. O mapa ocupa 10 × 6 unidades, com o cenário PNG
  (2000 × 1200) em **Pixels Per Unit = 200**.
- Conversão, com o centro do mapa na origem: `mundo.x = x / 100 − 5` e `mundo.y = 3 − y / 100`.
- Ordem de desenho: quem está mais embaixo na tela fica na frente (`sortingOrder` proporcional a `y`).
- As imagens dos inimigos olham para a direita; vire com `flipX` quando `facing = −1`.

## Regras que precisam ficar idênticas

Todas estão em `dados/regras.json`. Os pontos que mais costumam dar diferença:

- **Passo fixo de 1/30 s**, com no máximo 1 s por quadro. A velocidade 2× dobra o tempo simulado.
- **Intervalo de 5 s entre ondas, em tempo real** (não acelera no 2×). A pausa congela tudo, inclusive essa contagem.
- **Alvo**: o inimigo mais avançado no caminho dentro do alcance. O dano é imediato; o projétil é só visual.
- **Arredondamento**: o `Math.Round` do C# arredonda 2,5 para 2 ("arredondamento bancário"), e o JavaScript arredonda para 3.
  Use `Math.Round(x, MidpointRounding.AwayFromZero)` (todos os valores do jogo são positivos).
- Use **`double`** (não `float`) na simulação, como o JavaScript, para bater com os casos de teste.

## Etapas

Cada etapa termina com algo que dá para jogar ou conferir.

1. **Projeto e importação**: criar o projeto (Unity 6, 2D com URP) e o git; importador que lê o pacote e cria os
   ScriptableObjects; arte importada com Pixels Per Unit e filtros corretos.
2. **Núcleo em C#**: `GameSimulation` e as regras, com os testes EditMode passando em todos os `casos-de-teste.json`.
3. **Batalha jogável (fase 1)**: cenário, plataformas clicáveis, torres chibi, inimigos andando com barra de vida,
   projéteis, HUD (vidas, Qi, contagem), pausa, 2× e ondas automáticas.
4. **As 12 fases**: escolha de fase, vitória e derrota, recompensas, desbloqueio em sequência.
5. **Telas**: Esquadrão, Recrutamento (com a revelação dos heróis), Meus heróis e a ficha com estrelas.
6. **Salvamento, som e build**: tela no formato da plataforma escolhida, build WebGL (pode ir para o GitHub Pages) ou `.exe`.
7. **Polimento**: poses e animações dos chibis, efeitos das técnicas, partículas, transições. Os inimigos serão
   animados por peças (esqueleto): o guia das imagens está em `docs/ANIMACAO_INIMIGOS.md`, com os moldes em `docs/moldes/`.

## Atenção

- O `unity-export/` é gerado: não edite à mão. Rode `npm run unity` sempre que o jogo web mudar.
- A arte original grande fica em `arte/ia/` (fora do git). Ela é a fonte das imagens do pacote, então guarde uma cópia.
- Os nomes de lugares e chefes vêm de *Martial Peak*, pelo Black Book Idle. Um lançamento comercial pediria nomes próprios.
