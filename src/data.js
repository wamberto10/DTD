export const RARITIES = [
  { id: 'common', name: 'Comum', color: '#9ca8b4', chance: 0.45 },
  { id: 'uncommon', name: 'Incomum', color: '#74be96', chance: 0.25 },
  { id: 'rare', name: 'Raro', color: '#70a9ed', chance: 0.15 },
  { id: 'epic', name: 'Épico', color: '#b995ee', chance: 0.09 },
  { id: 'legendary', name: 'Lendário', color: '#e5bc71', chance: 0.045 },
  { id: 'ur', name: 'UR', color: '#ed8f88', chance: 0.012 },
  { id: 'urplus', name: 'UR+', color: '#e9dae9', chance: 0.003 },
];

export const HEROES = [
  { id: 'faxineiro', name: 'Faxineiro', title: 'O primeiro passo', rarity: 'common', element: 'physical', cost: 50, damage: 14, range: 142, attackSpeed: 1.15, color: '#c6b18b', portrait: 'broom', description: 'Uma vassoura, um coração decidido e o começo de um longo caminho. Ataques rápidos e acessíveis.' },
  { id: 'aprendiz', name: 'Aprendiz do Pátio', title: 'Discípulo externo', rarity: 'common', element: 'physical', cost: 65, damage: 19, range: 150, attackSpeed: 1.05, color: '#a0bcb1', portrait: 'sword', description: 'Aprendeu a primeira forma da espada. Um defensor confiável para os primeiros passos da seita.' },
  { id: 'lin-yue', name: 'Lin Yue', title: 'Flor do vale', rarity: 'uncommon', element: 'nature', cost: 75, damage: 23, range: 157, attackSpeed: 1.1, color: '#78b99d', portrait: 'lotus', description: 'Cultiva Qi entre as flores do vale. Sua energia espiritual alcança os invasores à distância.' },
  { id: 'han-feng', name: 'Han Feng', title: 'Lâmina errante', rarity: 'uncommon', element: 'physical', cost: 85, damage: 25, range: 158, attackSpeed: 1.2, color: '#a4bd96', portrait: 'sword', description: 'Um espadachim sem mestre que transforma cada golpe em uma lição de disciplina.' },
  { id: 'su-lan', name: 'Su Lan', title: 'Discípula do gelo', rarity: 'rare', element: 'ice', cost: 100, damage: 35, range: 178, attackSpeed: 1.05, color: '#8bbfdc', portrait: 'moon', description: 'Serena como um lago no inverno. Condensa o Qi em lâminas de gelo de longo alcance.' },
  { id: 'mo-yan', name: 'Mo Yan', title: 'Punho da brasa', rarity: 'rare', element: 'fire', cost: 115, damage: 42, range: 148, attackSpeed: 1.12, color: '#dd9975', portrait: 'flame', description: 'Carrega o calor da forja em suas mãos. Golpes intensos contra qualquer um que ameace a seita.' },
  { id: 'shen-lei', name: 'Shen Lei', title: 'Arauto da tempestade', rarity: 'epic', element: 'lightning', cost: 135, damage: 44, range: 181, attackSpeed: 1.45, color: '#b9a2e1', portrait: 'lightning', description: 'Escuta o trovão antes que ele exista. Ataca com a precisão e a velocidade de um relâmpago.' },
  { id: 'qing-lian', name: 'Qing Lian', title: 'Lótus celeste', rarity: 'epic', element: 'nature', cost: 145, damage: 61, range: 195, attackSpeed: 1.06, color: '#94cabb', portrait: 'lotus', description: 'Seu lótus floresce mesmo em meio ao caos. Concentra uma vasta reserva de energia espiritual.' },
  { id: 'long-chen', name: 'Long Chen', title: 'Herdeiro do dragão', rarity: 'legendary', element: 'fire', cost: 165, damage: 85, range: 187, attackSpeed: 1.15, color: '#dfb566', portrait: 'dragon', description: 'O sangue de um dragão ancestral desperta em seu cultivo. Cada ataque carrega o peso de uma era.' },
  { id: 'bai-ling', name: 'Bai Ling', title: 'Imperatriz da lua', rarity: 'legendary', element: 'ice', cost: 170, damage: 74, range: 225, attackSpeed: 1.32, color: '#bac9e8', portrait: 'moon', description: 'Guardiã do Palácio Lunar. Sua presença serena esconde um poder que atravessa o campo de batalha.' },
  { id: 'wu-kong', name: 'Wu Kong', title: 'Soberano do vazio', rarity: 'ur', element: 'void', cost: 175, damage: 119, range: 217, attackSpeed: 1.27, color: '#c5a2da', portrait: 'void', description: 'Entre dois pensamentos, atravessa o vazio. Sua técnica rompe as fronteiras do cultivo mortal.' },
  { id: 'yan-tian', name: 'Yan Tian', title: 'Sol imortal', rarity: 'ur', element: 'fire', cost: 180, damage: 138, range: 201, attackSpeed: 1.17, color: '#ebbf84', portrait: 'sun', description: 'Mil sóis ardem em seu núcleo espiritual. Um imortal cuja chama jamais se apaga.' },
  { id: 'dao-yuan', name: 'Dao Yuan', title: 'Além dos nove céus', rarity: 'urplus', element: 'void', cost: 180, damage: 187, range: 248, attackSpeed: 1.35, color: '#ead5cb', portrait: 'dragon', description: 'Seu nome ecoa além dos nove céus. Um cultivador que compreendeu a própria essência do Dao.' },
  { id: 'xing-he', name: 'Xing He', title: 'Tecelã de estrelas', rarity: 'urplus', element: 'lightning', cost: 180, damage: 166, range: 265, attackSpeed: 1.55, color: '#d8c9f2', portrait: 'star', description: 'Desenha constelações com um gesto. Cada estrela é um fragmento de seu incomensurável poder.' },
];

// Mundo 1 do Black Book Idle: cada mapa vira uma fase, com o mesmo chefe e inimigos da sua lista.
export const WORLD = { name: 'Mundo Inicial', motto: 'Do servo insignificante ao ápice do Mundo Inicial.' };

const stage = (id, name, realm, subtitle, guard, enemies, description) => ({
  id, name, realm, subtitle, guard, description,
  enemies: { normal: enemies[0], fast: enemies[1], brute: enemies[2], boss: enemies[3] },
  reward: 150 + (id - 1) * 25,
  difficulty: id <= 3 ? 'Iniciante' : id <= 6 ? 'Intermediário' : id <= 9 ? 'Avançado' : 'Mestre',
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
];

export const GACHA_COST = 100;
export const GACHA_TEN_COST = 900;
