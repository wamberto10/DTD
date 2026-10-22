# DTD — Dao Tower Defense

Protótipo jogável de tower defense para navegador no computador, em português, com temática de cultivo inspirada em *Martial Peak*. Arte vetorial e personagens originais.

Você começa com o **Faxineiro**. Posicione cultivadores para proteger o portal da seita, derrote cinco ondas por território e ganhe **Cristais do Dao** para recrutar novos heróis.

## Jogar no navegador com GitHub Pages

Depois de uma publicação concluída com sucesso, o endereço do jogo será **https://wamberto10.github.io/DTD/**. A presença do código no repositório, por si só, não torna esse endereço disponível.

Para ativar a hospedagem no repositório `wamberto10/DTD`:

1. Envie o código e o workflow `.github/workflows/deploy.yml` para a branch `main`.
2. No GitHub, abra **Settings → Pages → Build and deployment** e selecione **GitHub Actions** em **Source**.
3. Em **Actions**, acompanhe **Deploy DTD to GitHub Pages**. Se necessário, use **Run workflow** para publicar a versão atual.
4. Abra o endereço acima após as etapas de build e deploy terminarem com sucesso.

Novos envios para `main` executam os testes, geram `dist/` e publicam automaticamente. Os recursos usam caminhos relativos para funcionar sob `/DTD/`. O jogo é estático; sua coleção e seu progresso continuam salvos no navegador que você usa para jogar.

## Jogar sem instalar ferramentas

Abra o arquivo `dist/DTD-Dao-Tower-Defense.html` no Chrome, Edge ou Firefox com dois cliques. Essa versão inclui todos os recursos e funciona sem servidor ou conexão com a internet. Mantenha o arquivo no mesmo local e use o mesmo navegador para continuar seu progresso salvo.

Para gerar ou atualizar esse arquivo a partir do código, execute `npm run build:portable` após instalar as dependências.

## Executar

Requer Node.js 20.19+ ou 22.12+ e npm. O ambiente foi validado com Node.js 24.

```bash
cd /workspace/DTD
npm ci --cache /tmp/dtd-npm-cache
npm run dev
```

O Vite informa o endereço local no terminal. Para gerar uma versão estática de produção, execute `npm run build`; os arquivos ficam em `dist/`. `npm run preview` serve essa versão para conferência.

## Como jogar

1. Selecione um herói no esquadrão e clique em um círculo no mapa. Você pode posicionar várias torres do mesmo herói.
2. Clique em **Iniciar onda**. Os cultivadores atacam automaticamente os inimigos em seu alcance.
3. Cada eliminação concede Qi. Clique em uma torre para ver seu alcance e melhorá-la até o nível 5. Dispensar uma torre recupera 70% do Qi investido.
4. Proteja o portal durante as cinco ondas, incluindo o guardião final. Uma vitória libera a próxima fase e concede cristais.
5. Visite **Recrutamento** para invocar heróis e **Meus heróis** para conferir a coleção, atributos e cópias.

**Espaço** inicia ou pausa a onda, **2** alterna a velocidade e **Esc** fecha detalhes. A partida pausa ao sair da defesa ou ocultar a aba.

## Progressão e recrutamento

Há 14 heróis em sete raridades e três fases com dificuldade crescente. Todo jogador recebe 300 cristais iniciais. Uma invocação custa 100 cristais; dez custam 900. Não há garantia acumulada nem monetização.

| Raridade | Chance por invocação |
| --- | ---: |
| Comum | 45% |
| Incomum | 25% |
| Raro | 15% |
| Épico | 9% |
| Lendário | 4,5% |
| UR | 1,2% |
| UR+ | 0,3% |

O sorteio escolhe primeiro a raridade e depois um dos dois heróis dela, com chances iguais. Heróis repetidos aumentam a contagem de cópias, sem bônus de atributos nesta versão. As primeiras vitórias concedem 150, 175 e 200 cristais; repetir uma fase concede 50.

Heróis, cristais e fases concluídas ficam salvos no `localStorage` deste navegador. Qi, torres, melhorias e partidas em andamento são temporários e reiniciam ao trocar de fase, reiniciar ou recarregar. Não há conta, servidor de progressão ou sincronização entre dispositivos.

## Validação

```bash
npm test
npm run build
```

Os testes de lógica verificam combate, Qi, melhorias, vitória e derrota, três fases com os dados reais do Faxineiro, probabilidades, recompensas e persistência.

Há também testes completos de navegador. Com o servidor de desenvolvimento ativo, Python Playwright e Chromium disponíveis:

```bash
python3 tests/battle_smoke.py
python3 tests/recruitment_smoke.py
```

Os scripts usam `/usr/bin/chromium` por padrão; `CHROMIUM_PATH` permite outro caminho, e `DTD_TEST_URL` permite outro endereço do servidor.

## Estrutura

- `src/engine.js`: simulação do combate, independente da interface.
- `src/data.js`: heróis, raridades, atributos e territórios.
- `src/profile.js`: gacha, recompensas e persistência local.
- `src/art.js`: mapa, retratos e ícones SVG.
- `src/app.js` e `src/style.css`: interface e interação.

As fontes são distribuídas junto com o jogo; a aplicação não depende de serviços externos durante a partida. Esta versão roda no navegador, sem instalador nativo para Windows.
