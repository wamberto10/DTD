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

export const STAGES = [
  { id: 1, name: 'Vale do Despertar', subtitle: 'Onde todo caminho começa', realm: 'Domínio Mortal', reward: 150, difficulty: 'Iniciante', description: 'Proteja o portão da seita contra as criaturas que emergem da floresta. Cinco ondas separam você do primeiro avanço.' },
  { id: 2, name: 'Bosque Espiritual', subtitle: 'Além da névoa de jade', realm: 'Domínio Espiritual', reward: 175, difficulty: 'Intermediário', description: 'O Qi do bosque fortalece as criaturas. Reúna novos discípulos e refine suas defesas antes de enfrentar o guardião.' },
  { id: 3, name: 'Pico dos Nove Céus', subtitle: 'A provação dos ascendentes', realm: 'Domínio Celestial', reward: 200, difficulty: 'Avançado', description: 'No topo do mundo, um antigo soberano desperta. Somente uma formação bem cultivada poderá resistir à última provação.' },
];

export const GACHA_COST = 100;
export const GACHA_TEN_COST = 900;
