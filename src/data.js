export const RARITIES = [
  { id: 'common', name: 'Comum', color: '#9ca8b4', chance: 0.45 },
  { id: 'uncommon', name: 'Incomum', color: '#74be96', chance: 0.25 },
  { id: 'rare', name: 'Raro', color: '#70a9ed', chance: 0.15 },
  { id: 'epic', name: 'Épico', color: '#b995ee', chance: 0.09 },
  { id: 'legendary', name: 'Lendário', color: '#e5bc71', chance: 0.045 },
  { id: 'ur', name: 'UR', color: '#ed8f88', chance: 0.012 },
  { id: 'urplus', name: 'UR+', color: '#e9dae9', chance: 0.003 },
];

// What each element does in combat (numbers in BALANCE.elements, src/engine.js).
export const ELEMENTS = {
  physical: { name: 'Físico', effect: 'A cada 4 golpes, um golpe crítico com dano dobrado.' },
  fire: { name: 'Fogo', effect: 'Queima o alvo por 2 segundos.' },
  lightning: { name: 'Raio', effect: 'O golpe salta para até 2 inimigos próximos com metade do dano.' },
  nature: { name: 'Natureza', effect: 'Envenena o alvo; o veneno acumula até 3 vezes.' },
  ice: { name: 'Gelo', effect: 'Desacelera o alvo por 1,5 segundo.' },
  void: { name: 'Vazio', effect: 'Atravessa armaduras e escudos.' },
};

export const HEROES = [
  { id: 'faxineiro', name: 'Faxineiro', title: 'O primeiro passo', rarity: 'common', element: 'physical', cost: 50, damage: 14, range: 142, attackSpeed: 1.15, skill: { name: 'Varrida Decidida', kind: 'golpe', cooldown: 14, multiplier: 4, description: 'Um golpe com 4× o dano no inimigo mais avançado ao alcance.' }, color: '#c6b18b', portrait: 'broom', description: 'Uma vassoura, um coração decidido e o começo de um longo caminho. Ataques rápidos e acessíveis.' },
  { id: 'aprendiz', name: 'Aprendiz do Pátio', title: 'Discípulo externo', rarity: 'common', element: 'physical', cost: 60, damage: 19, range: 150, attackSpeed: 1.05, skill: { name: 'Primeira Forma da Espada', kind: 'golpe', cooldown: 16, multiplier: 5, description: 'Um corte com 5× o dano no inimigo mais avançado ao alcance.' }, color: '#a0bcb1', portrait: 'sword', description: 'Aprendeu a primeira forma da espada. Um defensor confiável para os primeiros passos da seita.' },
  { id: 'lin-yue', name: 'Lin Yue', title: 'Flor do vale', rarity: 'uncommon', element: 'nature', cost: 70, damage: 23, range: 157, attackSpeed: 1.1, skill: { name: 'Bênção das Flores', kind: 'bencao', cooldown: 22, seconds: 6, attackSpeed: 0.4, description: 'Todas as torres atacam 40% mais rápido por 6 segundos.' }, splash: { radius: 35, fraction: 0.3 }, color: '#78b99d', portrait: 'lotus', description: 'Cultiva Qi entre as flores do vale. Sua energia espiritual alcança os invasores à distância.' },
  { id: 'han-feng', name: 'Han Feng', title: 'Lâmina errante', rarity: 'uncommon', element: 'physical', cost: 80, damage: 25, range: 158, attackSpeed: 1.2, skill: { name: 'Lâmina Errante', kind: 'tempestade', cooldown: 16, targets: 3, multiplier: 2.5, description: 'Três cortes com 2,5× o dano nos inimigos mais avançados ao alcance.' }, color: '#a4bd96', portrait: 'sword', description: 'Um espadachim sem mestre que transforma cada golpe em uma lição de disciplina.' },
  { id: 'su-lan', name: 'Su Lan', title: 'Discípula do gelo', rarity: 'rare', element: 'ice', cost: 95, damage: 35, range: 178, attackSpeed: 1.05, skill: { name: 'Prisão de Gelo', kind: 'congelar', cooldown: 22, seconds: 2.5, description: 'Congela os inimigos ao alcance por 2,5 segundos.' }, color: '#8bbfdc', portrait: 'moon', description: 'Serena como um lago no inverno. Condensa o Qi em lâminas de gelo de longo alcance.' },
  { id: 'mo-yan', name: 'Mo Yan', title: 'Punho da brasa', rarity: 'rare', element: 'fire', cost: 110, damage: 42, range: 148, attackSpeed: 1.12, skill: { name: 'Punho da Brasa', kind: 'explosao', cooldown: 18, multiplier: 3, radius: 70, description: 'Uma explosão de 3× o dano em volta do inimigo mais avançado.' }, splash: { radius: 45, fraction: 0.5 }, color: '#dd9975', portrait: 'flame', description: 'Carrega o calor da forja em suas mãos. Golpes intensos contra qualquer um que ameace a seita.' },
  { id: 'shen-lei', name: 'Shen Lei', title: 'Arauto da tempestade', rarity: 'epic', element: 'lightning', cost: 130, damage: 44, range: 181, attackSpeed: 1.45, skill: { name: 'Arauto da Tempestade', kind: 'tempestade', cooldown: 18, targets: 5, multiplier: 2.5, description: 'Cinco raios com 2,5× o dano nos inimigos mais avançados ao alcance.' }, color: '#b9a2e1', portrait: 'lightning', description: 'Escuta o trovão antes que ele exista. Ataca com a precisão e a velocidade de um relâmpago.' },
  { id: 'qing-lian', name: 'Qing Lian', title: 'Lótus celeste', rarity: 'epic', element: 'nature', cost: 135, damage: 61, range: 195, attackSpeed: 1.06, skill: { name: 'Lótus Celeste', kind: 'explosao', cooldown: 20, multiplier: 3, radius: 85, description: 'Uma lótus explode com 3× o dano em volta do inimigo mais avançado.' }, splash: { radius: 55, fraction: 0.4 }, color: '#94cabb', portrait: 'lotus', description: 'Seu lótus floresce mesmo em meio ao caos. Concentra uma vasta reserva de energia espiritual.' },
  { id: 'long-chen', name: 'Long Chen', title: 'Herdeiro do dragão', rarity: 'legendary', element: 'fire', cost: 165, damage: 85, range: 187, attackSpeed: 1.15, skill: { name: 'Fúria do Dragão', kind: 'explosao', cooldown: 20, multiplier: 5, radius: 95, description: 'O dragão explode com 5× o dano numa área larga.' }, splash: { radius: 60, fraction: 0.5 }, color: '#dfb566', portrait: 'dragon', description: 'O sangue de um dragão ancestral desperta em seu cultivo. Cada ataque carrega o peso de uma era.' },
  { id: 'bai-ling', name: 'Bai Ling', title: 'Imperatriz da lua', rarity: 'legendary', element: 'ice', cost: 175, damage: 74, range: 225, attackSpeed: 1.32, skill: { name: 'Lua Congelante', kind: 'congelar', cooldown: 24, seconds: 3, global: true, description: 'Congela todos os inimigos do mapa por 3 segundos.' }, color: '#bac9e8', portrait: 'moon', description: 'Guardiã do Palácio Lunar. Sua presença serena esconde um poder que atravessa o campo de batalha.' },
  { id: 'wu-kong', name: 'Wu Kong', title: 'Soberano do vazio', rarity: 'ur', element: 'void', cost: 175, damage: 103, range: 217, attackSpeed: 1.27, skill: { name: 'Soberano do Vazio', kind: 'chuva', cooldown: 26, multiplier: 4, global: true, description: 'Atinge todos os inimigos do mapa com 4× o dano.' }, color: '#c5a2da', portrait: 'void', description: 'Entre dois pensamentos, atravessa o vazio. Sua técnica rompe as fronteiras do cultivo mortal.' },
  { id: 'yan-tian', name: 'Yan Tian', title: 'Sol imortal', rarity: 'ur', element: 'fire', cost: 180, damage: 115, range: 201, attackSpeed: 1.17, skill: { name: 'Sol Imortal', kind: 'chuva', cooldown: 26, multiplier: 4, global: true, burn: true, description: 'Atinge todos os inimigos do mapa com 4× o dano e os queima.' }, splash: { radius: 70, fraction: 0.6 }, color: '#ebbf84', portrait: 'sun', description: 'Mil sóis ardem em seu núcleo espiritual. Um imortal cuja chama jamais se apaga.' },
  { id: 'dao-yuan', name: 'Dao Yuan', title: 'Além dos nove céus', rarity: 'urplus', element: 'void', cost: 180, damage: 133, range: 248, attackSpeed: 1.35, skill: { name: 'Além dos Nove Céus', kind: 'chuva', cooldown: 28, multiplier: 7, global: true, description: 'Atinge todos os inimigos do mapa com 7× o dano.' }, splash: { radius: 65, fraction: 0.5 }, color: '#ead5cb', portrait: 'dragon', description: 'Seu nome ecoa além dos nove céus. Um cultivador que compreendeu a própria essência do Dao.' },
  { id: 'xing-he', name: 'Xing He', title: 'Tecelã de estrelas', rarity: 'urplus', element: 'lightning', cost: 180, damage: 116, range: 265, attackSpeed: 1.55, skill: { name: 'Tecelã de Estrelas', kind: 'tempestade', cooldown: 24, targets: 12, multiplier: 5, global: true, description: 'Doze estrelas com 5× o dano nos inimigos mais avançados de todo o mapa.' }, color: '#d8c9f2', portrait: 'star', description: 'Desenha constelações com um gesto. Cada estrela é um fragmento de seu incomensurável poder.' },
];

// Mundo 1 do Black Book Idle: cada mapa vira uma fase, com o mesmo chefe e inimigos da sua lista.
// The worlds of the journey, after the Black Book Idle: each one holds twelve stages.
export const WORLDS = [
  { id: 1, name: 'Mundo Inicial', motto: 'Do servo insignificante ao ápice do Mundo Inicial.', firstStage: 1, lastStage: 12 },
  { id: 2, name: 'Reino Tong Xuan', motto: 'O mundo que você conhecia era apenas um pequeno fragmento.', firstStage: 13, lastStage: 24 },
];
export const WORLD = WORLDS[0];
export const worldOfStage = id => WORLDS.find(world => id >= world.firstStage && id <= world.lastStage) || WORLDS[0];

// What the enemies can do (numbers in BALANCE.traits, src/engine.js).
export const TRAITS = {
  armor: { name: 'Armadura', effect: 'Golpes diretos perdem 35% do dano. Queimadura, veneno e vazio passam inteiros.' },
  shield: { name: 'Escudo', effect: 'Uma camada extra de 40% da vida, perdida antes dela. O vazio atravessa.' },
  flying: { name: 'Voador', effect: 'Não é desacelerado pelo gelo nem atingido por dano em área.' },
  healer: { name: 'Curandeiro', effect: 'A cada 3 segundos cura os inimigos por perto.' },
  summoner: { name: 'Invocador', effect: 'A cada 6 segundos chama dois lacaios atrás de si.' },
  enrage: { name: 'Fúria', effect: 'Abaixo da metade da vida, fica 40% mais rápido.' },
};

// Traits of each kind of enemy, stage by stage, after their names (bats fly, golems wear armor...).
const STAGE_TRAITS = {
  1: { brute: ['armor'], boss: ['enrage'] },
  2: { fast: ['flying'], brute: ['armor'], boss: ['enrage'] },
  3: { brute: ['armor'], boss: ['shield'] },
  4: { brute: ['shield'], boss: ['summoner'] },
  5: { brute: ['armor'], boss: ['shield', 'enrage'] },
  6: { brute: ['armor'], boss: ['healer'] },
  7: { brute: ['armor'], boss: ['armor', 'enrage'] },
  8: { fast: ['flying'], brute: ['shield'], boss: ['summoner'] },
  9: { brute: ['armor', 'shield'], boss: ['summoner', 'armor'] },
  10: { normal: ['flying'], brute: ['armor'], boss: ['shield', 'healer'] },
  11: { fast: ['flying'], brute: ['armor'], boss: ['shield', 'enrage'] },
  12: { fast: ['flying'], brute: ['armor', 'shield'], boss: ['summoner', 'enrage'] },
  13: { fast: ['flying'], brute: ['armor'], boss: ['summoner'] },
  14: { fast: ['flying'], brute: ['shield'], boss: ['healer', 'enrage'] },
  15: { normal: ['shield'], brute: ['armor'], boss: ['healer', 'shield'] },
  16: { fast: ['flying'], brute: ['armor'], boss: ['summoner', 'healer'] },
  17: { normal: ['armor'], fast: ['flying'], brute: ['armor', 'shield'], boss: ['enrage', 'shield'] },
  18: { fast: ['flying'], brute: ['armor'], boss: ['summoner', 'armor'] },
  19: { normal: ['armor'], brute: ['shield'], boss: ['armor', 'healer'] },
  20: { fast: ['flying'], brute: ['armor'], boss: ['healer', 'enrage'] },
  21: { normal: ['shield'], fast: ['flying'], brute: ['armor'], boss: ['summoner', 'enrage'] },
  22: { normal: ['flying'], brute: ['shield'], boss: ['summoner', 'shield'] },
  23: { normal: ['armor'], fast: ['flying'], brute: ['armor', 'shield'], boss: ['enrage', 'armor'] },
  24: { normal: ['armor'], fast: ['flying'], brute: ['armor', 'shield'], boss: ['summoner', 'enrage', 'shield'] },
};

// terrain: the colours of the scenery drawn in code while a stage waits for its painting
// (1 green, 2 forest, 3 blue, 4 ember, 5 frost, 6 gold; see src/pixel-terrain.js).
const stage = (id, name, realm, subtitle, guard, enemies, description, terrain) => ({
  id, name, realm, subtitle, guard, description,
  world: worldOfStage(id).id,
  enemies: { normal: enemies[0], fast: enemies[1], brute: enemies[2], boss: enemies[3] },
  traits: { normal: [], fast: [], brute: [], boss: [], ...STAGE_TRAITS[id] },
  reward: 150 + (id - 1) * 25,
  difficulty: id <= 3 ? 'Iniciante' : id <= 6 ? 'Intermediário' : id <= 9 ? 'Avançado' : id <= 12 ? 'Mestre' : id <= 18 ? 'Grão-Mestre' : 'Supremo',
  terrain: terrain ?? (id === 7 ? 2 : id === 10 ? 3 : Math.min(3, id)),
});

export const STAGES = [
  stage(1, 'Pavilhão Ling Xiao', 'Corpo Temperado', 'Onde o servo começa a jornada', 'Proteja o portão do pátio dos servos',
    ['Servo Arrogante', 'Macaco Ladrão', 'Valentão dos Alojamentos', 'Discípulo Interno de Elite'],
    'O início absoluto. Você é um servo insignificante de uma grande seita, sem talento aparente. Você varre estes pátios todos os dias, e ninguém imagina que este servo um dia vai virar lenda.'),
  stage(2, 'Montanhas do Pavilhão Ling Xiao', 'Elemento Inicial', 'Cavernas, ervas e feras espirituais', 'Proteja a ermida das ervas',
    ['Lobo Cinzento', 'Morcego Sanguinário', 'Javali de Presas de Ferro', 'Fera Espiritual da Montanha'],
    'As montanhas ao redor da seita escondem cavernas, ervas e feras espirituais. Aqui você percebe que o mundo exterior é muito mais perigoso que a seita.'),
  stage(3, 'Cidades da Grande Dinastia Han', 'Transformação do Qi', 'O poder das grandes famílias', 'Proteja o portão da mansão',
    ['Bandido de Estrada', 'Batedor de Carteiras', 'Lutador do Bando da Batalha Sangrenta', 'Jovem Mestre da Família'],
    'Vilas, mercados, casas de leilão e arenas. Você descobre que as grandes famílias controlam quantidades enormes de recursos.'),
  stage(4, 'Caminho para a Capital Central', 'Transformação do Qi', 'Estradas imperiais e emboscadas', 'Proteja a Estalagem Imperial',
    ['Saqueador de Caravanas', 'Assassino Contratado', 'Escolta Mercenária', 'Especialista das Grandes Famílias'],
    'Estradas imperiais, caravanas e grandes cidades. Os conflitos entre famílias aumentam, e você ouve falar das Oito Grandes Famílias da Capital Central.'),
  stage(5, 'Capital Central', 'Separação e Reunião', 'Onde seu nome começa a ser conhecido', 'Proteja o portão do palácio',
    ['Arruaceiro da Capital', 'Sentinela Oculta', 'Guarda de Família Nobre', 'Jovem Especialista das Oito Famílias'],
    'O grande centro político e marcial da Dinastia Han. Palácios, mansões das Oito Grandes Famílias, leilões e áreas proibidas. Aqui seu nome começa a ser conhecido.'),
  stage(6, 'Vale do Rei da Medicina', 'Separação e Reunião', 'A alquimia também decide o destino', 'Proteja o pavilhão das pílulas',
    ['Ladrão de Ervas', 'Serpente do Lago Medicinal', 'Golem de Fornalha', 'Guardião do Vale'],
    'Jardins espirituais, campos medicinais e laboratórios. O caminho marcial não depende só de força: conhecimento e alquimia também decidem o destino de um cultivador.'),
  stage(7, 'Terras Selvagens', 'Elemento Verdadeiro', 'Longe da civilização', 'Proteja o acampamento nas ruínas',
    ['Hiena Espiritual', 'Aranha Gigante', 'Crocodilo de Escamas de Ferro', 'Grande Monstro Espiritual'],
    'Longe da civilização: florestas gigantes, rios, ruínas e tesouros escondidos, guardados por monstros espirituais.'),
  stage(8, 'Terras do Vale do Rei Fantasma', 'Elemento Verdadeiro', 'O domínio das seitas malignas', 'Proteja o santuário da vila',
    ['Cultivador Maligno', 'Morcego Demoníaco', 'Fera Corrompida', 'Mestre do Vale do Rei Fantasma'],
    'Céu escuro, montanhas corrompidas e energia demoníaca. As terras das seitas malignas, lideradas pelo temido Vale do Rei Fantasma e governadas pelos Reis Malignos.'),
  stage(9, 'Guerra contra a Dinastia Tian Lang', 'Ascensão Imortal', 'A invasão da Dinastia Han', 'Proteja a muralha da seita',
    ['Soldado de Tian Lang', 'Batedor de Tian Lang', 'Capitão de Tian Lang', 'General da Dinastia Tian Lang'],
    'A Dinastia Tian Lang, aliada às seitas malignas, invade a Dinastia Han: invasões, emboscadas e cercos a cidades e seitas em uma guerra aberta.'),
  stage(10, 'Misteriosos Pequenos Mundos', 'Ascensão Imortal', 'Ruínas, formações e heranças', 'Proteja o Santuário da Herança',
    ['Espírito Errante', 'Reflexo Sombrio', 'Besta de Pedra Antiga', 'Guardião da Antiga Herança'],
    'Uma passagem leva a um pequeno mundo de ruínas, formações e túmulos antigos. O Mundo Inicial guarda segredos muito maiores do que você imaginava.'),
  stage(11, 'O Segredo do Mundo', 'Transcendente', 'Um fragmento de algo maior', 'Proteja o Mural da Verdade',
    ['Caçador Dimensional', 'Fera do Vazio', 'Sentinela de Pedra', 'Guardião do Corredor do Vazio'],
    'Formações gigantes e corredores espaciais revelam a verdade: o Mundo Inicial é apenas um fragmento de uma realidade muito maior, ligado ao Reino Tong Xuan.'),
  stage(12, 'Portal para o Reino Tong Xuan', 'Transcendente', 'Este mundo era apenas o começo', 'Proteja o portal',
    ['Especialista Errante', 'Distorção Espacial', 'Formação Guardiã Desperta', 'Senhor Demônio'],
    'Diante de um antigo corredor espacial, cercado por ruínas e energia espacial. Este mundo era apenas o começo.'),
  // ---------- World 2: Reino Tong Xuan (maps 13 to 24 of the Black Book) ----------
  stage(13, 'Fronteira de Tong Xuan', 'Santo', 'A chegada pelo portal', 'Proteja a saída do portal',
    ['Saqueador de Tong Xuan', 'Águia Tempestuosa', 'Urso de Ferro Negro', 'Homem do Caixão'],
    'Estradas perigosas, cultivadores independentes e feras de um mundo onde a Energia Mundial é muito mais densa do que você jamais sentiu.', 1),
  stage(14, 'Mundo Selado do Caixão', 'Santo', 'A prisão dos Demônios Antigos', 'Proteja a porta do caixão',
    ['Servo Demoníaco', 'Morcego do Caixão', 'Guardião do Selo', 'Líder dos Rebeldes Demoníacos'],
    'O pequeno mundo dentro do caixão, onde Demônios Antigos estão presos há eras, divididos em facções que lutam pelo domínio da prisão.', 4),
  stage(15, 'Associação dos Mestres de Pílulas', 'Rei Santo', 'Cada pílula vale uma seita', 'Proteja o Salão de Testes',
    ['Aprendiz Arrogante', 'Comprador Violento', 'Fornalha Viva', 'Grão-Mestre Alquimista Rival'],
    'A grande cidade dos alquimistas. Rivais invejosos, fornalhas vivas e jardins de ervas raras: cada pílula aqui vale mais que uma seita inteira do Mundo Inicial.', 6),
  stage(16, 'Seita do Céu Firmamento', 'Rei Santo', 'Os Insetos Devoradores de Alma', 'Proteja a entrada da caverna',
    ['Discípulo do Firmamento', 'Enxame de Insetos', 'Inseto Soldado', 'Rainha dos Insetos'],
    'A seita fundada por quem um dia criou o Pavilhão Ling Xiao. Em suas cavernas profundas vivem os temidos Insetos Devoradores de Alma.', 2),
  stage(17, 'Vazio Estelar', 'Retorno à Origem', 'Além do céu de Tong Xuan', 'Proteja a rocha da Flor Demoníaca',
    ['Fragmento de Meteoro', 'Fera Estelar', 'Golem de Meteoro', 'Fera Ancestral do Vazio'],
    'O espaço além do céu de Tong Xuan: meteoros, tempestades do vazio e, numa rocha flutuante distante, a Flor Demoníaca de Mil Anos.', 3),
  stage(18, 'Seita do Gelo', 'Retorno à Origem', 'O que dorme sob a geleira', 'Proteja o palácio de gelo',
    ['Soldado de Osso Despertado', 'Águia da Nevasca', 'Golem de Gelo', 'Cadáver Ancestral da Raça dos Ossos'],
    'Montanhas eternamente nevadas e palácios de gelo. Foi aqui que Su Yan cultivou, e é aqui que a Raça dos Ossos dorme selada no fundo da geleira.', 5),
  stage(19, 'Ruínas dos Hegemons', 'Rei da Origem', 'Armadilhas, marionetes e a Lótus', 'Proteja o Lago da Lótus',
    ['Marionete de Pedra', 'Assassino das Ruínas', 'Guardião de Bronze', 'Guardião Ancestral das Ruínas'],
    'Ruínas antigas dominadas por senhores locais, cheias de armadilhas e marionetes, escondendo a lendária Lótus da Alma de Seis Cores.', 6),
  stage(20, 'Clã Sun e a Árvore Divina', 'Rei da Origem', 'O calor que queima até o Qi', 'Proteja os prisioneiros do sacrifício',
    ['Guarda do Clã Sun', 'Fera Solar', 'Capitão do Clã Sun', 'Patriarca do Clã Sun'],
    'O rico Clã Sun cultiva uma Árvore Divina de natureza Yang alimentada com sacrifícios. Terras ardentes, telhados dourados e um calor que queima até o Qi.', 4),
  stage(21, 'Território Demoníaco', 'Origem do Dao', 'Sob o céu vermelho', 'Proteja a arena dos gladiadores',
    ['Guarda Demoníaco', 'Fera Demoníaca', 'Gladiador Demônio', 'Comandante Demoníaco Xue Li'],
    'As terras da Raça Demoníaca sob um céu vermelho: cidades negras, mercados de escravos e a grande arena onde até um humano pode lutar como gladiador.', 4),
  stage(22, 'Terra Santa dos Nove Céus', 'Origem do Dao', 'A Tumba dos Santos', 'Proteja o Salão da Sucessão',
    ['Espírito Remanescente', 'Cadáver de Santa', 'Guardião da Tumba', 'Santa Cadáver Ancestral'],
    'A Terra Santa mais poderosa de Tong Xuan. Sob ela fica a Tumba dos Santos, onde vagam santas mortas e os espíritos dos antigos Mestres Sagrados.', 6),
  stage(23, 'Terras da Raça Monstro', 'Imperador', 'As Minas de Cristal tomadas', 'Proteja as Minas de Cristal',
    ['Guerreiro Monstro', 'Batedor Monstro', 'Golem de Cristal', 'Rei da Raça Monstro'],
    'O território selvagem da Raça Monstro e as Minas de Cristal da Terra Santa, que os clãs monstros tomaram à força.', 2),
  stage(24, 'Invasão da Raça dos Ossos', 'Imperador', 'A batalha final de Tong Xuan', 'Proteja a última cidade de Tong Xuan',
    ['Soldado de Osso', 'Dragão de Ossos', 'General de Osso', 'Ke Luo, Senhor da Raça dos Ossos'],
    'A batalha final. A Raça dos Ossos, vinda do espaço, consome Tong Xuan. Humanos, demônios e monstros se unem contra Ke Luo, o Senhor dos Ossos.', 5),
];

// Heroes taken into battle: only the squad can be placed on the map.
export const SQUAD_SIZE = 5;

// Stage stars and challenge mode, after a victory (src/profile.js).
export const PROGRESSION = Object.freeze({
  // Crystals for winning a stage already cleared.
  repeatReward: 50,
  // 3 stars without losing a life; 2 stars losing up to this share of the lives (in %); 1 star otherwise.
  twoStarsMaxLossPercent: 30,
  // Challenge mode opens after 3 stars. The first challenge victory pays base + perStage × stage and counts one extra star.
  challengeReward: Object.freeze({ base: 100, perStage: 10 }),
});

export const GACHA_COST = 100;
export const GACHA_TEN_COST = 900;
// Permanent talents, bought with the stars of the Dao (stage stars plus challenges won).
// Level n costs n stars; the bonus is level × perLevel on the engine modifier, shown as level × perLevel × display.
export const TALENTS = [
  { id: 'reserva', name: 'Reserva de Qi', description: 'Mais Qi para posicionar os primeiros heróis.', modifier: 'startQi', perLevel: 10, display: 1, bonus: '+{} Qi no início da fase', maxLevel: 5 },
  { id: 'muralha', name: 'Muralha do Dao', description: 'O portão aguenta mais invasores.', modifier: 'lives', perLevel: 1, display: 1, bonus: '+{} vidas no início da fase', maxLevel: 5 },
  { id: 'furia', name: 'Fúria Marcial', description: 'Todos os cultivadores golpeiam mais forte.', modifier: 'damage', perLevel: 0.03, display: 100, bonus: '+{}% de dano em todas as torres', maxLevel: 5 },
  { id: 'meditacao', name: 'Meditação Profunda', description: 'As habilidades ficam prontas mais cedo.', modifier: 'skillRate', perLevel: 0.08, display: 100, bonus: 'Habilidades carregam {}% mais rápido', maxLevel: 5 },
  { id: 'economia', name: 'Economia do Qi', description: 'Cultivar os heróis em batalha custa menos.', modifier: 'upgradeDiscount', perLevel: 0.04, display: 100, bonus: 'Melhorias custam {}% menos', maxLevel: 5 },
];

// Daily missions: DAILY.count a day from this list, the same for everyone on the same date (src/profile.js).
export const DAILY_MISSIONS = [
  { id: 'vitorias', text: 'Vença 2 fases', counter: 'victories', goal: 2, reward: 60 },
  { id: 'inimigos', text: 'Derrote 150 inimigos', counter: 'kills', goal: 150, reward: 50 },
  { id: 'habilidades', text: 'Use 6 habilidades', counter: 'skills', goal: 6, reward: 50 },
  { id: 'perfeita', text: 'Vença uma fase sem perder vidas', counter: 'perfect', goal: 1, reward: 70 },
  { id: 'chefes', text: 'Derrote 3 chefes', counter: 'bosses', goal: 3, reward: 50 },
  { id: 'melhorias', text: 'Melhore torres 10 vezes', counter: 'upgrades', goal: 10, reward: 40 },
  { id: 'recrutar', text: 'Recrute 1 herói', counter: 'summons', goal: 1, reward: 30 },
];
export const DAILY = Object.freeze({ count: 3, allDoneBonus: 50 });

// Pity: after every - 1 pulls without a hero of this rarity or better, the next pull is guaranteed to bring one.
export const GACHA_PITY = Object.freeze({ every: 50, rarity: 'legendary' });
