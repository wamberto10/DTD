import { GameEngine, MAP, WAVE_BREAK_SECONDS } from './engine.js';
import { HEROES, RARITIES, STAGES, WORLD, SQUAD_SIZE, GACHA_COST, GACHA_TEN_COST } from './data.js';
import { loadProfile, saveProfile, summon, grantVictory, raiseStar, toggleSquad } from './profile.js';
import { FRAGMENTS_PER_COPY, STARS_PER_TIER, nextStarCost, starBonusPercent, starTier, withStars } from './stars.js';
import { icon, portrait, renderTerrain } from './art.js';
import { renderEnemy, renderProjectile, renderPad } from './pixel-units.js';
import { hasPaintedMap } from './maps.js';
import { enemyArt, heroArt } from './chibi-art.js';
import { emptyEnemyEffects, advanceEnemyEffects, enemyHitEffect, enemyDeathProgress, disableEnemyRig } from './enemy-rig.js';

const app = document.querySelector('#app');
const modalRoot = document.querySelector('#modal-root');
let profile = loadProfile();
const ui = { view: 'defense', stage: 1, selectedHero: 'faxineiro', selectedTower: null, speed: 1, paused: false, sound: false, filter: 'all', reward: null };
let engine;
let toastTimer;
let audioContext;
let lastTime = performance.now();
let lastPaint = 0;
let lastHud = '';
let lastPadMarkup = '';
let lastTowerMarkup = '';
let lastSquadMarkup = '';
let enemyEffects = emptyEnemyEffects();
let defeatedEnemies = [];
let victoryPending = false;

const heroById = id => HEROES.find(h => h.id === id);
const rarityOf = hero => RARITIES.find(r => r.id === hero.rarity);
const stageInfo = () => STAGES.find(s => s.id === ui.stage) || STAGES[0];
const starsOf = id => profile.stars?.[id] || 0;
// The hero as it fights: base attributes plus the bonus of its stars.
const fighter = id => withStars(heroById(id), starsOf(id));
// Only the squad (up to five heroes) goes into battle.
const squadHeroes = () => profile.squad.filter(heroById).map(fighter);
// Keeps the hero selected for placement inside the squad.
const keepSelectionInSquad = () => { if (!profile.squad.includes(ui.selectedHero)) ui.selectedHero = profile.squad[0]; };
const rarityRank = hero => RARITIES.findIndex(r => r.id === hero.rarity);
// Whole seconds left before the next wave starts by itself, or null when no countdown is running.
const countdown = () => engine.state.status === 'preparing' && engine.state.nextWaveIn !== null ? Math.ceil(engine.state.nextWaveIn) : null;
// A battle is under way during a wave and during the countdown between waves: that is when pausing makes sense.
const inBattle = () => engine.state.status === 'running' || countdown() !== null;
// Five slots: stars of the current group in its colour, the rest still showing the previous group's colour.
const starRow = (stars, size = 14, next = false) => {
  const tier = starTier(stars);
  const slots = Array.from({ length: STARS_PER_TIER }, (_, i) => {
    if (next && i === tier.lit) return `<i class="next" style="--star:${tier.color}">${icon('star', size)}</i>`;
    const color = i < tier.lit ? tier.color : tier.previous?.color;
    return `<i class="${color ? 'filled' : ''}" ${color ? `style="--star:${color}"` : ''}>${icon('star', size)}</i>`;
  });
  return `<span class="star-row" aria-label="${stars} estrelas, ${tier.name}">${slots.join('')}</span>`;
};
const canRaiseStar = id => profile.owned.includes(id) && nextStarCost(starsOf(id)) !== null && (profile.fragments?.[id] || 0) >= nextStarCost(starsOf(id));
const persist = () => { if (!saveProfile(profile)) toast('O navegador não permitiu salvar. Seu progresso vale nesta sessão.'); };
const escapeText = value => String(value).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
keepSelectionInSquad();
engine = makeEngine();

function makeEngine() {
  return new GameEngine({ stage: ui.stage, heroes: squadHeroes(), onEvent: onEngineEvent });
}

function sound(kind = 'click') {
  if (!ui.sound) return;
  try {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === 'suspended') audioContext.resume();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(kind === 'victory' ? 660 : kind === 'kill' ? 260 : 440, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(kind === 'victory' ? 880 : 180, audioContext.currentTime + 0.12);
    gain.gain.setValueAtTime(0.025, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.18);
    oscillator.connect(gain); gain.connect(audioContext.destination);
    oscillator.start(); oscillator.stop(audioContext.currentTime + 0.2);
  } catch { /* Gameplay remains available without audio support. */ }
}

function toast(message) {
  const el = document.querySelector('#toast');
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 3300);
}

function onEngineEvent(event) {
  if (event.type === 'kill') { defeatedEnemies.push({ ...event.enemy }); sound('kill'); }
  if (event.type === 'waveComplete' && engine.state.status === 'preparing') toast(`Onda ${engine.state.wave} concluída. A próxima começa em ${WAVE_BREAK_SECONDS} segundos.`);
  if (event.type === 'victory') {
    const result = grantVictory(profile, ui.stage);
    profile = result.profile; ui.reward = result; persist(); sound('victory');
    // Let the last enemy finish falling, using the same pausable clock as every other effect.
    victoryPending = true;
  }
  if (event.type === 'defeat') setTimeout(() => { render(); showResult(false); }, 80);
}

function logo() {
  return `<svg viewBox="0 0 44 44" class="brand-mark" aria-hidden="true"><path d="M22 3 41 35H3Z" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="m22 13 10 23H12Z" fill="currentColor"/><path d="M8 40h28M22 1v5" stroke="currentColor"/></svg>`;
}

function render() {
  const navs = [['defense', 'swords', 'Defesa'], ['squad', 'shield', 'Esquadrão'], ['recruit', 'gem', 'Recrutamento'], ['heroes', 'users', 'Meus heróis']];
  app.innerHTML = `<aside class="sidebar">
    <a href="#" class="brand" data-action="navigate" data-view="defense" aria-label="DTD início">${logo()}<span><strong>DTD<span class="brand-dot">.</span></strong><small>DAO TOWER DEFENSE</small></span></a>
    <div class="sidebar-label">SEU CAMINHO</div>
    <nav aria-label="Navegação principal">${navs.map(([id, glyph, text]) => `<button class="nav-item ${ui.view === id ? 'active' : ''}" data-action="navigate" data-view="${id}">${icon(glyph)}<span>${text}</span>${id === 'recruit' && profile.crystals >= GACHA_COST ? '<span class="nav-dot"></span>' : ''}</button>`).join('')}</nav>
    <div class="sidebar-art"><span class="vertical-script">道法自然</span><div class="mountain mountain-one"></div><div class="mountain mountain-two"></div><div class="mountain mountain-three"></div><div class="little-sun"></div></div>
    <div class="journey-card"><span class="eyebrow">A JORNADA DA ASCENSÃO</span><div><span>${WORLD.name}</span><span>${profile.completedStages.length}/${STAGES.length}</span></div><div class="journey-track"><i style="width:${profile.completedStages.length / STAGES.length * 100}%"></i></div><p>Até o maior mestre deu<br>seu primeiro passo.</p></div>
    <div class="player-card"><div class="player-avatar">${icon('sword', 20)}</div><div><strong>Cultivador</strong><span>Discípulo iniciante</span></div><span class="online-dot" title="Progresso local"></span></div>
  </aside>
  <div class="workspace"><header class="topbar"><div class="breadcrumb">${WORLD.name} ${icon('chevronRight', 13)} <span>${{ defense: 'Campo de batalha', recruit: 'Pavilhão de recrutamento', heroes: 'Coleção de heróis', squad: 'Preparação do esquadrão' }[ui.view]}</span></div><div class="topbar-actions"><div class="crystal-balance" title="Cristais do Dao — usados no recrutamento">${icon('gem', 17)}<strong id="crystal-count">${profile.crystals.toLocaleString('pt-BR')}</strong><span>Cristais do Dao</span></div><span class="topbar-divider"></span><button class="icon-button" data-action="sound" aria-label="${ui.sound ? 'Desativar' : 'Ativar'} som" title="${ui.sound ? 'Desativar' : 'Ativar'} som">${icon(ui.sound ? 'volume' : 'volumeOff', 19)}</button><div class="topbar-avatar">C</div></div></header>
  <main>${ui.view === 'recruit' ? renderRecruit() : ui.view === 'heroes' ? renderHeroes() : ui.view === 'squad' ? renderSquadPage() : renderDefense()}</main>
  <footer class="page-footer"><span><i></i> PIXEL ART · PROTÓTIPO JOGÁVEL <b>v0.2</b></span><span>Inspirado em Martial Peak · protótipo independente, sem vínculo oficial.</span></footer></div>`;
  lastHud = ''; lastPadMarkup = ''; lastTowerMarkup = ''; lastSquadMarkup = '';
  if (ui.view === 'defense') { renderDynamic(); updateHud(true); }
}

function pageHeading(eyebrow, title, description, extra = '') {
  return `<div class="page-heading"><div><div class="eyebrow heading-eyebrow"><span></span>${eyebrow}</div><h1>${title}</h1><p>${description}</p></div>${extra}</div>`;
}

function renderDefense() {
  const stage = stageInfo();
  return `${pageHeading('PROTEJA O SEU LEGADO', 'O caminho começa aqui<span>.</span>', 'Reúna seus cultivadores. Canalize seu Qi. Defenda o caminho do Dao.', `<button class="subtle-button" data-action="stages">${icon('flag', 16)} Selecionar fase ${icon('chevronRight', 14)}</button>`)}
    <div class="battle-layout"><section class="battle-section" aria-label="Campo de batalha">
    <div class="battle-toolbar"><div class="map-title"><span class="map-status-dot"></span><strong>${escapeText(stage.name)}</strong><span class="tiny-tag">${stage.difficulty.toUpperCase()}</span></div><div class="toolbar-controls"><button class="icon-button" data-action="restart" title="Reiniciar fase" aria-label="Reiniciar fase">${icon('refresh', 16)}</button><span></span><button class="icon-button pause-button ${ui.paused ? 'active' : ''}" id="pause-button" data-action="pause" title="Pausar (P)" aria-label="Pausar partida" ${inBattle() ? '' : 'disabled'}>${icon(ui.paused ? 'play' : 'pause', 16)}</button><button class="speed-button ${ui.speed === 2 ? 'fast' : ''}" data-action="speed" title="Alternar velocidade (2)">${icon('speed', 16)}<span id="speed-text">${ui.speed}×</span></button></div></div>
    <div class="map-container ${hasPaintedMap(ui.stage) ? 'painted' : ''}"><svg class="battle-map ${hasPaintedMap(ui.stage) ? 'painted-map' : ''}" viewBox="0 0 ${MAP.width} ${MAP.height}" role="group" aria-label="${escapeText(stage.name)}: caminho dos inimigos e nove posições para torres">${renderTerrain(ui.stage)}<g id="range-layer"></g><g id="pad-layer"></g><g id="tower-layer"></g><g id="enemy-layer"></g><g id="projectile-layer"></g></svg>
    <div class="map-hud"><span id="wave-countdown" class="hud-pill wave-countdown hidden" aria-live="polite"></span><span class="hud-pill lives">${icon('heart', 16)}<b id="hud-lives">20</b><small>VIDAS</small></span><span class="hud-pill qi">${icon('qi', 17)}<b id="hud-qi">180</b><small>QI</small></span></div>
    <div class="map-level"><span>${WORLD.name.toUpperCase()} · ${String(ui.stage).padStart(2, '0')} · ${stage.realm.toUpperCase()}</span><strong>${escapeText(stage.name)}</strong><small>${escapeText(stage.subtitle)}.</small></div>
    <div class="map-compass"><span>N</span><svg viewBox="0 0 32 32"><path d="m16 2 5 14-5 14-5-14Z" fill="#dccba0"/><path d="m16 16 14 0-14 5L2 16Z" fill="#b4b28d" opacity=".4"/></svg></div>
    <div id="pause-overlay" class="pause-overlay ${ui.paused ? '' : 'hidden'}"><span>${icon('pause', 28)}</span><h3>A jornada pode esperar.</h3><button class="primary-button" data-action="pause">Continuar partida</button></div>
    <div class="map-hint">${icon('plus', 12)} Selecione um herói e clique em um círculo para posicionar</div></div>
    <div class="battle-status"><div><span class="live-indicator" id="live-indicator"></span><span id="battle-status-text">Preparação</span><span class="status-divider">/</span><span id="kills-text">0 inimigos derrotados</span></div><span>${icon('shield', 14)} ${escapeText(stage.guard)}</span></div>
    <section class="squad-section"><div class="section-heading"><div><h2>Seu esquadrão <span>${profile.squad.length}/${SQUAD_SIZE}</span></h2><p>Escolha quem posicionar. Monte a formação na aba Esquadrão.</p></div><button class="text-button" data-action="navigate" data-view="squad">Editar esquadrão ${icon('arrowRight', 14)}</button></div><div class="squad-grid">${renderSquad()}</div></section>
    </section><aside class="battle-rail"><div id="command-panel">${renderCommandPanel()}</div><div class="wisdom-card"><span class="wisdom-icon">${icon('sparkles', 19)}</span><span class="eyebrow">SABEDORIA DO DAO</span><p>O poder não está apenas em quem você recruta, mas em onde você o posiciona.</p><span class="wisdom-line"></span></div><div class="reward-preview"><span class="reward-icon">${icon('gem', 22)}</span><div><small>RECOMPENSA DA FASE</small><strong>${profile.completedStages.includes(ui.stage) ? '50' : stage.reward} Cristais do Dao</strong></div>${icon('chevronRight', 15)}</div></aside></div>`;
}

function renderSquad() {
  const heroes = squadHeroes();
  // Each hero defends one platform per stage: a hero already on the map shows "Em campo" and opens its tower.
  const cards = heroes.map(hero => { const rarity = rarityOf(hero); const onField = engine.state.towers.some(tower => tower.hero.id === hero.id); return `<button class="hero-card ${ui.selectedHero === hero.id ? 'selected' : ''} ${onField ? 'on-field' : ''}" style="--hero-color:${rarity.color}" data-action="select-hero" data-id="${hero.id}" aria-pressed="${ui.selectedHero === hero.id}"${onField ? ` aria-label="${escapeText(hero.name)}, em campo"` : ''}><div class="hero-portrait">${portrait(hero)}<span class="hero-rarity">${rarity.name}</span>${onField ? '<span class="field-badge">EM CAMPO</span>' : ''}${ui.selectedHero === hero.id && !onField ? `<span class="hero-check">${icon('check', 11)}</span>` : ''}</div><div class="hero-card-info"><strong>${escapeText(hero.name)}</strong><span>${icon('qi', 12)} ${hero.cost} Qi <span class="${hero.stars ? 'card-stars' : ''}">${hero.stars ? `${hero.stars}★` : 'NV. 1'}</span></span></div></button>`; });
  // Empty slots lead to the squad tab, or to recruitment when every hero is already in the squad.
  const spare = profile.owned.length > profile.squad.length;
  while (cards.length < SQUAD_SIZE) cards.push(`<button class="hero-card empty-hero" data-action="navigate" data-view="${spare ? 'squad' : 'recruit'}"><div>${icon(spare ? 'plus' : 'lock', 22)}<span>Vaga livre</span></div><span>${spare ? 'Montar esquadrão' : 'Recrute um herói'} ${icon('plus', 12)}</span></button>`);
  return cards.join('');
}

function renderSquadPage() {
  const members = squadHeroes();
  const slots = Array.from({ length: SQUAD_SIZE }, (_, i) => {
    const hero = members[i];
    if (!hero) return `<div class="hero-card empty-hero squad-slot"><div>${icon('plus', 22)}<span>Vaga livre</span></div><span>Escolha um herói abaixo</span></div>`;
    const r = rarityOf(hero);
    return `<button class="hero-card squad-slot" style="--hero-color:${r.color}" data-action="squad-toggle" data-id="${hero.id}" aria-label="Tirar ${escapeText(hero.name)} do esquadrão"><div class="hero-portrait">${portrait(hero)}<span class="hero-rarity">${r.name}</span><span class="squad-remove" title="Tirar do esquadrão">${icon('close', 11)}</span></div><div class="hero-card-info"><strong>${escapeText(hero.name)}</strong><span>${icon('qi', 12)} ${hero.cost} Qi <span class="${hero.stars ? 'card-stars' : ''}">${hero.stars ? `${hero.stars}★` : ''}</span></span></div></button>`;
  });
  const roster = profile.owned.filter(heroById).map(fighter)
    .sort((a, b) => rarityRank(b) - rarityRank(a) || a.name.localeCompare(b.name, 'pt-BR'));
  const totalDamage = members.reduce((sum, hero) => sum + hero.damage, 0);
  const cards = roster.map(hero => {
    const r = rarityOf(hero); const inSquad = profile.squad.includes(hero.id);
    return `<button class="collection-card squad-pick ${inSquad ? 'in-squad' : ''}" style="--hero-color:${r.color}" data-action="squad-toggle" data-id="${hero.id}" aria-pressed="${inSquad}"><div class="collection-portrait">${portrait(hero)}<span class="collection-rarity">${r.name}</span>${inSquad ? `<span class="squad-flag">${icon('check', 11)} NO ESQUADRÃO</span>` : ''}</div><div class="collection-info"><small>${escapeText(hero.title)}</small><h3>${escapeText(hero.name)}</h3><div><span>${icon('sword', 13)} ${hero.damage}</span><span>${icon('qi', 13)} ${hero.cost} Qi</span>${hero.stars ? `<span class="card-stars">${hero.stars}★</span>` : ''}</div></div></button>`;
  }).join('');
  return `${pageHeading('PREPARE-SE PARA A BATALHA', 'Seu esquadrão<span>.</span>', `Escolha até ${SQUAD_SIZE} cultivadores para levar à defesa. Só eles aparecem e podem ser posicionados no campo de batalha.`, `<button class="primary-button squad-go" data-action="navigate" data-view="defense">Ir para a defesa ${icon('arrowRight', 16)}</button>`)}
    <section class="squad-lineup"><div class="section-heading"><div><h2>Formação <span>${members.length}/${SQUAD_SIZE}</span></h2><p>Clique em um herói da formação para tirá-lo. Dano somado: <b>${totalDamage}</b>.</p></div></div><div class="squad-grid">${slots.join('')}</div></section>
    <section class="squad-roster"><div class="section-heading"><div><h2>Seus heróis <span>${profile.owned.length}</span></h2><p>Clique em um herói para colocá-lo ou tirá-lo da formação.</p></div><button class="text-button" data-action="navigate" data-view="recruit">Recrutar mais ${icon('arrowRight', 14)}</button></div><div class="collection-grid">${cards}</div></section>`;
}

function renderCommandPanel() {
  const s = engine.state;
  const tower = s.towers.find(t => t.id === ui.selectedTower);
  if (tower) {
    const hero = tower.hero; const rarity = rarityOf(hero); const stats = engine.getTowerStats(tower); const cost = engine.getNextUpgradeCost(tower);
    return `<div class="command-card"><div class="rail-heading"><span class="eyebrow">CULTIVADOR EM CAMPO</span><button class="icon-button" data-action="deselect-tower" aria-label="Fechar detalhes">${icon('close', 15)}</button></div><div class="tower-detail"><div class="detail-portrait" style="--hero-color:${rarity.color}">${portrait(hero)}</div><span class="rarity-text" style="color:${rarity.color}">${rarity.name}</span><h2>${hero.name}</h2><span class="level-badge">NÍVEL ${tower.level}</span></div><div class="stat-row"><span>${icon('sword', 15)} Dano</span><b>${Math.round(stats.damage)}</b></div><div class="stat-row"><span>${icon('shield', 15)} Alcance</span><b>${Math.round(stats.range)}</b></div><div class="stat-row"><span>${icon('speed', 15)} Ataques / s</span><b>${Number(stats.attackSpeed).toFixed(1)}</b></div><button class="primary-button upgrade-button" data-action="upgrade" ${!Number.isFinite(cost) || s.qi < cost || s.status === 'victory' || s.status === 'defeat' ? 'disabled' : ''}>${icon('arrowUp', 17)} ${Number.isFinite(cost) ? `Melhorar · ${cost} Qi` : 'Nível máximo'}</button><button class="sell-button" data-action="sell">Dispensar · recuperar ${Math.floor(tower.spent * .7)} Qi</button><p class="rail-note">As melhorias duram apenas nesta fase.</p></div>`;
  }
  const current = Math.min(s.wave + (s.status === 'preparing' ? 1 : 0), s.totalWaves);
  const stage = stageInfo();
  const bossNext = s.wave === 4;
  const preview = enemyArt(ui.stage, bossNext ? 'boss' : 'normal');
  const cd = countdown();
  const eyebrow = s.status === 'running' ? 'DEFESA EM ANDAMENTO' : s.status === 'victory' ? 'TERRITÓRIO PROTEGIDO' : s.status === 'defeat' ? 'DEFESA ROMPIDA' : cd !== null ? 'PRÓXIMA ONDA' : 'ANTES DA BATALHA';
  const title = s.status === 'victory' ? 'O território está a salvo.' : s.status === 'defeat' ? 'Um novo começo.' : s.status === 'running' ? 'Mantenha a posição.' : cd !== null ? `Onda ${s.wave + 1} em ${cd}s.` : 'Prepare sua defesa.';
  const description = s.status === 'running' ? 'Seus cultivadores atacam automaticamente. Use o Qi para fortalecer suas torres.'
    : s.status === 'victory' ? 'Seus cristais já estão na coleção. O próximo caminho espera por você.'
    : s.status === 'defeat' ? 'Reposicione os heróis e tente uma nova estratégia.'
    : cd !== null ? (ui.paused ? 'Partida pausada. A contagem continua quando você voltar.' : 'As ondas seguem sozinhas. Aproveite para posicionar e melhorar seus heróis.')
    : `Posicione seus heróis e inicie a primeira onda. Depois, cada onda começa sozinha ${WAVE_BREAK_SECONDS} segundos após a anterior.`;
  return `<div class="command-card"><div class="rail-heading"><span class="eyebrow">${eyebrow}</span><span class="small-orbit">${icon('swords', 16)}</span></div><h2 class="${cd !== null ? 'countdown-title' : ''}">${title}</h2><p class="command-description">${description}</p><div class="wave-info"><span>Onda <b>${current}</b> de ${s.totalWaves}</span><span>${Math.round(s.wave / s.totalWaves * 100)}%</span></div><div class="wave-track">${Array.from({ length: s.totalWaves }, (_, i) => `<span class="${i < s.wave ? 'completed' : ''} ${i === s.wave - 1 && s.status === 'running' ? 'ongoing' : ''}"></span>`).join('')}</div><div class="enemy-preview"><div class="enemy-face ${preview ? 'painted' : ''}">${preview ? `<img src="${preview.url}" alt="">` : icon(bossNext ? 'shield' : 'sword', 23)}</div><div><strong>${escapeText(bossNext ? stage.enemies.boss : stage.enemies.normal)}</strong><span>${bossNext ? 'O chefe da fase se aproxima' : `Também: ${escapeText(stage.enemies.fast)} e ${escapeText(stage.enemies.brute)}`}</span></div></div><button class="primary-button wave-button" data-action="wave">${icon(s.status === 'running' ? (ui.paused ? 'play' : 'pause') : s.status === 'victory' ? 'flag' : s.status === 'defeat' ? 'refresh' : 'play', 16)}<span>${s.status === 'running' ? (ui.paused ? 'Continuar onda' : 'Pausar onda') : s.status === 'victory' ? 'Próxima fase' : s.status === 'defeat' ? 'Tentar novamente' : cd !== null ? 'Começar agora' : 'Iniciar onda'}</span>${s.status === 'preparing' ? '<kbd>ESPAÇO</kbd>' : ''}</button><p class="rail-note">${icon('qi', 12)} Elimine inimigos para acumular Qi.</p></div><div class="selected-hero-note">${icon('users', 16)}<span>Selecionado: <strong>${heroById(ui.selectedHero)?.name || 'Faxineiro'}</strong></span></div>`;
}

function renderRecruit() {
  return `${pageHeading('O DESTINO REÚNE OS ESCOLHIDOS', 'Pavilhão de recrutamento<span>.</span>', 'Além das montanhas, novos aliados aguardam o seu chamado.')}
  <section class="summon-banner"><div class="summon-copy"><span class="event-badge">${icon('sparkles', 14)} RECRUTAMENTO PERMANENTE</span><h2>Todo encontro<br>muda o destino.</h2><p>Do primeiro discípulo ao mestre supremo.<br>Invoque cultivadores e descubra o seu potencial.</p><div class="summon-highlights"><span>7 raridades</span><i></i><span>14 cultivadores</span><i></i><span>Uma jornada sem limites</span></div></div><div class="summon-art"><div class="summon-ring ring-one"></div><div class="summon-ring ring-two"></div><span class="summon-rune rune-one">道</span><span class="summon-rune rune-two">气</span><div class="banner-hero banner-hero-left">${portrait(HEROES.find(h => h.rarity === 'legendary'), 'banner')}</div><div class="banner-hero banner-hero-right">${portrait(HEROES.find(h => h.rarity === 'ur'), 'banner')}</div><div class="banner-hero banner-hero-main">${portrait(HEROES.find(h => h.rarity === 'urplus'), 'banner')}</div><span class="summon-particle p1"></span><span class="summon-particle p2"></span><span class="summon-particle p3"></span></div></section>
  <div class="recruit-bottom"><section class="summon-controls"><div><span class="eyebrow">CRISTAIS DO DAO</span><h2>Responda ao chamado.</h2><p>Cada invocação garante um herói. Repetidos viram ${FRAGMENTS_PER_COPY} fragmentos para elevar as estrelas dele.</p></div><div class="summon-buttons"><button class="secondary-button summon-single" data-action="summon" data-count="1" ${profile.crystals < GACHA_COST ? 'disabled' : ''}>Invocar 1 herói <span>${icon('gem', 16)} ${GACHA_COST}</span></button><button class="primary-button summon-ten" data-action="summon" data-count="10" ${profile.crystals < GACHA_TEN_COST ? 'disabled' : ''}>${icon('sparkles', 17)} Invocar 10 heróis <span>${icon('gem', 16)} ${GACHA_TEN_COST}</span><small>10% DE DESCONTO</small></button></div><div class="summon-balance">Seu saldo: <b>${profile.crystals} cristais</b><span>Ganhe mais concluindo fases.</span></div></section><section class="probability-card"><div class="section-heading"><h2>O destino em números</h2>${icon('gem', 17)}</div><p>Chances por invocação · sem garantia acumulada</p><div class="probability-grid">${RARITIES.map(r => `<div><span><i style="background:${r.color}"></i>${r.name}</span><b>${(r.chance * 100).toLocaleString('pt-BR', { maximumFractionDigits: 2 })}%</b></div>`).join('')}</div></section></div>`;
}

function renderHeroes() {
  const filtered = HEROES.filter(hero => ui.filter === 'all' || ui.filter === 'owned' && profile.owned.includes(hero.id) || ui.filter === hero.rarity);
  return `${pageHeading('ALIADOS PARA A ETERNIDADE', 'Cada herói, uma história<span>.</span>', 'Conheça seus cultivadores e os mestres que ainda cruzarão seu caminho.', `<span class="collection-count">${icon('users', 18)}<b>${profile.owned.length}</b> / ${HEROES.length} descobertos</span>`)}<div class="collection-filters"><button data-action="filter" data-filter="all" class="filter-chip ${ui.filter === 'all' ? 'active' : ''}">Todos</button><button data-action="filter" data-filter="owned" class="filter-chip ${ui.filter === 'owned' ? 'active' : ''}">Meus heróis</button>${RARITIES.map(r => `<button class="filter-chip ${ui.filter === r.id ? 'active' : ''}" data-action="filter" data-filter="${r.id}" style="--rarity-color:${r.color}">${r.name}</button>`).join('')}</div><div class="collection-grid">${filtered.map(hero => { const r = rarityOf(hero); const owned = profile.owned.includes(hero.id); const ready = canRaiseStar(hero.id); return `<button class="collection-card ${owned ? '' : 'unowned'}" style="--hero-color:${r.color}" data-action="hero-detail" data-id="${hero.id}"><div class="collection-portrait">${portrait(hero)}<span class="collection-rarity">${r.name}</span>${owned ? `<span class="copy-badge star-badge ${ready ? 'ready' : ''}" title="${ready ? 'Pronto para elevar estrela' : `${profile.fragments?.[hero.id] || 0} fragmentos`}">${starRow(starsOf(hero.id), 9)}${ready ? '<b>↑</b>' : ''}</span>` : `<span class="undiscovered">${icon('lock', 16)} NÃO RECRUTADO</span>`}</div><div class="collection-info"><small>${escapeText(hero.title)}</small><h3>${escapeText(hero.name)}</h3><div><span>${icon('sword', 13)} ${owned ? fighter(hero.id).damage : hero.damage}</span><span>${icon('qi', 13)} ${hero.cost} Qi</span>${icon('arrowRight', 14)}</div></div></button>`; }).join('') || '<div class="empty-state">Nenhum cultivador nesta categoria. Seu próximo aliado pode estar no pavilhão.</div>'}</div>`;
}

function renderDynamic() {
  if (ui.view !== 'defense') return;
  const s = engine.state;
  const pads = document.querySelector('#pad-layer');
  if (!pads) return;
  const selected = s.towers.find(t => t.id === ui.selectedTower);
  document.querySelector('#range-layer').innerHTML = selected ? `<circle cx="${selected.x}" cy="${selected.y}" r="${engine.getTowerStats(selected).range}" class="tower-range"/>` : '';
  const painted = hasPaintedMap(ui.stage);
  const padMarkup = engine.map.pads.map(pad => renderPad(pad, s.towers.find(tower => tower.padId === pad.id), heroById(ui.selectedHero)?.name || 'Faxineiro', painted)).join('');
  if (padMarkup !== lastPadMarkup) { pads.innerHTML = padMarkup; lastPadMarkup = padMarkup; }
  const towerMarkup = s.towers.map(tower => {
    // Chibi heroes are taller than the pixel drawings, so they get a slightly bigger frame.
    const [w, h] = heroArt(tower.hero) ? [64, 75] : [52, 61];
    return `<g class="map-tower ${tower.id === ui.selectedTower ? 'chosen' : ''}" data-action="select-tower" data-id="${tower.id}" role="button" tabindex="0" aria-label="${tower.hero.name}, nível ${tower.level}"><ellipse cx="${tower.x}" cy="${tower.y + 3}" rx="19" ry="10" fill="${tower.hero.color}" opacity=".4"/><svg x="${tower.x - w / 2}" y="${tower.y + 6 - h}" width="${w}" height="${h}" viewBox="0 0 120 140">${portrait(tower.hero, 'tower').replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')}</svg><rect x="${tower.x - 13}" y="${tower.y + 10}" width="26" height="13" rx="0" fill="#182820" stroke="#c4cba6" stroke-width=".8"/><text x="${tower.x}" y="${tower.y + 20}" text-anchor="middle">${tower.level}</text><rect x="${tower.x - 25}" y="${tower.y + 6 - h}" width="50" height="${h + 19}" fill="transparent" pointer-events="all"/></g>`;
  }).join('');
  if (towerMarkup !== lastTowerMarkup) { document.querySelector('#tower-layer').innerHTML = towerMarkup; lastTowerMarkup = towerMarkup; }
  // The squad bar shows who is already on the map; refresh it only when that changes.
  const squadGrid = document.querySelector('.squad-section .squad-grid');
  const squadMarkup = squadGrid ? renderSquad() : '';
  if (squadGrid && squadMarkup !== lastSquadMarkup) { squadGrid.innerHTML = squadMarkup; lastSquadMarkup = squadMarkup; }
  document.querySelector('#enemy-layer').innerHTML = enemyEffects.deaths.map(death => renderEnemy(death.enemy, ui.stage, { dying: true, death: enemyDeathProgress(enemyEffects, death) })).join('')
    + s.enemies.map(enemy => renderEnemy(enemy, ui.stage, { hit: enemyHitEffect(enemyEffects, enemy) })).join('');
  document.querySelector('#projectile-layer').innerHTML = s.projectiles.map(renderProjectile).join('');
}

function updateHud(force = false) {
  if (ui.view !== 'defense') return;
  const s = engine.state;
  const cd = countdown();
  const key = `${s.lives}-${s.qi}-${s.wave}-${s.status}-${s.kills}-${ui.selectedTower}-${ui.paused}-${cd}`;
  if (key === lastHud && !force) return;
  lastHud = key;
  document.querySelector('#hud-lives').textContent = s.lives;
  document.querySelector('#hud-qi').textContent = Math.floor(s.qi);
  document.querySelector('#kills-text').textContent = `${s.kills} inimigos derrotados`;
  document.querySelector('#battle-status-text').textContent = ui.paused && inBattle() ? 'Pausado'
    : s.status === 'running' ? `Onda ${s.wave} em andamento` : s.status === 'victory' ? 'Vitória' : s.status === 'defeat' ? 'Derrota'
    : cd !== null ? `Próxima onda em ${cd}s` : 'Preparação';
  document.querySelector('#live-indicator').classList.toggle('running', s.status === 'running' && !ui.paused);
  document.querySelector('#pause-overlay').classList.toggle('hidden', !ui.paused);
  const banner = document.querySelector('#wave-countdown');
  banner.classList.toggle('hidden', cd === null || ui.paused);
  if (cd !== null) banner.innerHTML = `${icon('speed', 14)}<small>ONDA ${s.wave + 1} EM</small><b>${cd}s</b>`;
  const pause = document.querySelector('#pause-button');
  pause.disabled = !inBattle();
  pause.classList.toggle('active', ui.paused);
  pause.innerHTML = icon(ui.paused ? 'play' : 'pause', 16);
  pause.title = ui.paused ? 'Continuar (P)' : 'Pausar (P)';
  pause.setAttribute('aria-label', ui.paused ? 'Continuar partida' : 'Pausar partida');
  document.querySelector('#command-panel').innerHTML = renderCommandPanel();
}

function resetBattle(stage = ui.stage) {
  ui.stage = stage; ui.selectedTower = null; ui.paused = false; ui.reward = null;
  enemyEffects = emptyEnemyEffects(); defeatedEnemies = []; victoryPending = false;
  engine = makeEngine(); engine.setSpeed(ui.speed); render();
}

function showModal(content, className = '') {
  modalRoot.innerHTML = `<div class="modal-backdrop"><section class="modal ${className}" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button class="modal-close icon-button" data-action="close-modal" aria-label="Fechar">${icon('close', 20)}</button>${content}</section></div>`;
  document.body.classList.add('modal-open');
  setTimeout(() => modalRoot.querySelector('button:not(.modal-close)')?.focus(), 50);
}

function closeModal() { modalRoot.innerHTML = ''; document.body.classList.remove('modal-open'); }

function showStages() {
  showModal(`<span class="eyebrow">${WORLD.name.toUpperCase()}</span><h2 id="modal-title">Escolha seu caminho.</h2><p class="modal-description">Cinco ondas. Um território a proteger.</p><div class="stage-list">${STAGES.map(stage => { const unlocked = stage.id <= profile.unlockedStage; const completed = profile.completedStages.includes(stage.id); return `<button class="stage-option ${ui.stage === stage.id ? 'current' : ''}" data-action="choose-stage" data-id="${stage.id}" ${unlocked ? '' : 'disabled'}><span class="stage-number">${unlocked ? String(stage.id).padStart(2, '0') : icon('lock', 20)}</span><span><strong>${stage.name}</strong><small>${stage.difficulty} · ${completed ? 'Concluída' : stage.id === 1 ? 'Sua primeira jornada' : 'Novos desafios'}</small></span><span class="stage-reward">${completed ? icon('check', 19) : `${icon('gem', 14)} ${stage.reward}`}</span></button>`; }).join('')}</div><p class="rail-note">Trocar de fase reinicia a partida atual.</p>`);
}

function showResult(victory) {
  showModal(`<div class="result-icon ${victory ? '' : 'defeat'}">${icon(victory ? 'trophy' : 'shield', 38)}</div><span class="eyebrow">${victory ? 'O DAO RECONHECE SUA FORÇA' : 'TODA QUEDA ENSINA'}</span><h2 id="modal-title">${victory ? 'O território está a salvo.' : 'Seu caminho continua.'}</h2><p class="modal-description">${victory ? `${escapeText(stageInfo().name)} foi protegido e ${escapeText(stageInfo().enemies.boss)} caiu. Seus cultivadores conquistaram uma nova vitória.` : 'Os invasores passaram pela sua defesa. Repense as posições e cultive seu poder entre as ondas.'}</p><div class="result-stats"><span><b>${engine.state.kills}</b>inimigos derrotados</span><span><b>${engine.state.wave}/${engine.state.totalWaves}</b>ondas enfrentadas</span></div>${victory ? `<div class="victory-reward">${icon('gem', 26)}<div><b>+${ui.reward?.reward || 0} Cristais do Dao</b><span>${ui.reward?.firstClear ? 'Recompensa de primeira conclusão' : 'Recompensa de nova conclusão'}</span></div></div><button class="primary-button" data-action="result-next">${ui.stage < STAGES.length ? 'Seguir para a próxima fase' : 'Escolher uma nova jornada'} ${icon('arrowRight', 16)}</button><button class="text-button" data-action="result-recruit">Visitar o pavilhão de recrutamento</button>` : `<button class="primary-button" data-action="retry">${icon('refresh', 16)} Tentar novamente</button>`}`, 'result-modal');
}

function starPanel(id, owned) {
  if (!owned) return `<section class="star-panel locked">${starRow(0, 18)}<p>Recrute este herói para começar a elevar suas estrelas.</p></section>`;
  const stars = starsOf(id);
  const tier = starTier(stars);
  const cost = nextStarCost(stars);
  const fragments = profile.fragments?.[id] || 0;
  const now = starBonusPercent(stars);
  const next = cost === null ? null : starBonusPercent(stars + 1);
  const bonus = (label, key) => `<div><span>${label}</span><b>+${now[key]}%</b>${next ? `${icon('chevronRight', 12)}<em>+${next[key]}%</em>` : ''}</div>`;
  return `<section class="star-panel"><div class="star-panel-head">${starRow(stars, 20, true)}<span class="star-tier" style="--star:${tier.color}">${tier.name} · ${stars} ${stars === 1 ? 'estrela' : 'estrelas'}</span></div>
    <div class="star-bonus">${bonus('Dano', 'damage')}${bonus('Ataques/s', 'attackSpeed')}</div>
    ${cost === null
      ? `<p class="star-max">${icon('trophy', 15)} Este herói chegou ao limite de estrelas.</p>`
      : `<div class="star-fragments ${fragments >= cost ? 'enough' : ''}">${icon('fragment', 16)}<b>${fragments}</b>/${cost} fragmentos</div><button class="primary-button star-button" data-action="star-up" data-id="${id}" ${fragments >= cost ? '' : 'disabled'}>${icon('star', 16)} Elevar estrela</button><p class="star-hint">Cada herói repetido rende ${FRAGMENTS_PER_COPY} fragmentos. A cada ${STARS_PER_TIER} estrelas, a cor muda e o custo dobra.</p>`}
  </section>`;
}

function showHero(id) {
  const base = heroById(id); if (!base) return;
  const r = rarityOf(base); const owned = profile.owned.includes(id);
  const hero = owned ? fighter(id) : base;
  showModal(`<div class="hero-detail-art" style="--hero-color:${r.color}">${portrait(hero)}</div><span class="rarity-text" style="color:${r.color}">${r.name} · ${hero.title}</span><h2 id="modal-title">${hero.name}</h2><p class="modal-description">${hero.description}</p>${starPanel(id, owned)}<div class="hero-detail-stats"><span>${icon('sword', 18)}<b>${hero.damage}</b>Dano</span><span>${icon('shield', 18)}<b>${hero.range}</b>Alcance</span><span>${icon('speed', 18)}<b>${hero.attackSpeed.toFixed(1)}</b>Ataques/s</span><span>${icon('qi', 18)}<b>${hero.cost}</b>Qi inicial</span></div>${!owned ? `<button class="primary-button" data-action="result-recruit">Visitar recrutamento ${icon('arrowRight', 16)}</button>`
    : profile.squad.includes(id) ? `<button class="primary-button" data-action="use-hero" data-id="${id}">Selecionar para a defesa ${icon('arrowRight', 16)}</button>`
    : `<button class="primary-button" data-action="squad-toggle" data-id="${id}">${icon('plus', 16)} Colocar no esquadrão</button>`}`, 'hero-modal');
}

function doSummon(count) {
  const result = summon(profile, count);
  if (!result.ok) return toast(result.reason || 'Cristais insuficientes. Conclua fases para ganhar mais.');
  const before = new Set(profile.owned);
  profile = result.profile; engine.setHeroes(squadHeroes()); persist(); sound('victory'); render();
  showModal(`<span class="eyebrow">O DESTINO FOI TRAÇADO</span><h2 id="modal-title">${count === 1 ? 'Um novo encontro.' : 'Novos caminhos se abrem.'}</h2><p class="modal-description">${count === 1 ? 'Um cultivador respondeu ao seu chamado.' : 'Dez cultivadores responderam ao seu chamado.'}</p><div class="summon-results ${count > 1 ? 'many' : ''}">${result.heroes.map((hero, i) => { const r = rarityOf(hero); const fresh = !before.has(hero.id); before.add(hero.id); return `<div class="summon-result-card" style="--hero-color:${r.color};--delay:${i * 70}ms"><div>${portrait(hero)}<span class="result-rarity">${r.name}</span><span class="new-badge ${fresh ? '' : 'fragment-badge'}">${fresh ? 'NOVO' : `+${FRAGMENTS_PER_COPY} FRAGMENTOS`}</span></div><h3>${hero.name}</h3><p>${hero.title}</p></div>`; }).join('')}</div><button class="primary-button" data-action="close-modal">Receber cultivadores ${icon('check', 17)}</button><span class="summon-result-note">Heróis novos entram no esquadrão se houver vaga. Repetidos viram fragmentos para elevar estrelas em Meus heróis.</span>`, `summon-modal ${count > 1 ? 'wide-modal' : ''}`);
}

function activate(action, el) {
  sound();
  if (action === 'navigate') { const next = el.dataset.view; if (ui.view === 'defense' && next !== 'defense' && inBattle()) ui.paused = true; ui.view = next; render(); }
  if (action === 'sound') { ui.sound = !ui.sound; render(); if (ui.sound) sound(); }
  if (action === 'stages') showStages();
  if (action === 'choose-stage') { closeModal(); ui.view = 'defense'; resetBattle(Number(el.dataset.id)); }
  if (action === 'select-hero') {
    ui.selectedHero = el.dataset.id;
    // A hero already on the map opens its tower (details, upgrade, dismiss) instead of waiting for a platform.
    ui.selectedTower = engine.state.towers.find(tower => tower.hero.id === el.dataset.id)?.id ?? null;
    render();
  }
  if (action === 'select-tower') { ui.selectedTower = el.dataset.id; const tower = engine.state.towers.find(t => String(t.id) === el.dataset.id); ui.selectedTower = tower?.id ?? el.dataset.id; updateHud(true); renderDynamic(); }
  if (action === 'deselect-tower') { ui.selectedTower = null; updateHud(true); renderDynamic(); }
  if (action === 'squad-toggle') {
    const id = el.dataset.id; const result = toggleSquad(profile, id);
    if (!result.ok) return toast(result.reason);
    if (el.closest('.modal')) closeModal();
    profile = result.profile; persist(); keepSelectionInSquad(); engine.setHeroes(squadHeroes()); render();
    toast(result.added ? `${heroById(id).name} entrou no esquadrão.` : `${heroById(id).name} saiu do esquadrão.`);
  }
  if (action === 'star-up') {
    const id = el.dataset.id; const result = raiseStar(profile, id);
    if (!result.ok) return toast(result.reason);
    profile = result.profile; engine.setHeroes(squadHeroes()); persist(); sound('victory');
    render(); showHero(id);
    const name = heroById(id).name;
    toast(result.stars % STARS_PER_TIER === 0
      ? `${name} completou as estrelas de ${starTier(result.stars - 1).name}! As próximas são de ${starTier(result.stars).name}.`
      : `${name} alcançou ${result.stars} ${result.stars === 1 ? 'estrela' : 'estrelas'}.`);
  }
  if (action === 'place') {
    const result = engine.placeTower(fighter(ui.selectedHero), el.dataset.id);
    if (!result.ok) toast(result.reason || 'Não foi possível posicionar o herói.');
    else {
      sound(); ui.selectedTower = null;
      // The next hero of the squad not yet on the map is ready for the next platform.
      const next = profile.squad.find(id => !engine.state.towers.some(tower => tower.hero.id === id));
      if (next) ui.selectedHero = next;
    }
    updateHud(true); renderDynamic();
  }
  if (action === 'upgrade') { const result = engine.upgradeTower(ui.selectedTower); if (!result.ok) toast(result.reason || 'Qi insuficiente.'); updateHud(true); renderDynamic(); }
  if (action === 'sell') { const result = engine.sellTower(ui.selectedTower); if (result?.ok === false) toast(result.reason); ui.selectedTower = null; updateHud(true); renderDynamic(); }
  if (action === 'speed') { ui.speed = ui.speed === 1 ? 2 : 1; engine.setSpeed(ui.speed); document.querySelector('#speed-text')?.replaceChildren(`${ui.speed}×`); document.querySelector('.speed-button')?.classList.toggle('fast', ui.speed === 2); }
  if (action === 'wave') {
    if (engine.state.status === 'running') ui.paused = !ui.paused;
    else if (engine.state.status === 'victory') { ui.stage < STAGES.length ? resetBattle(ui.stage + 1) : showStages(); }
    else if (engine.state.status === 'defeat') resetBattle();
    else { const result = engine.startWave(); if (result?.ok === false) toast(result.reason || 'Posicione uma torre primeiro.'); ui.paused = false; }
    updateHud(true);
  }
  if (action === 'pause') { ui.paused = inBattle() ? !ui.paused : false; updateHud(true); }
  if (action === 'restart') showModal(`<span class="eyebrow">UM NOVO COMEÇO</span><h2 id="modal-title">Recomeçar esta fase?</h2><p class="modal-description">As torres e o Qi desta partida serão reiniciados. Sua coleção e seus cristais continuam com você.</p><button class="primary-button" data-action="retry">${icon('refresh', 16)} Recomeçar fase</button><button class="text-button" data-action="close-modal">Continuar jogando</button>`);
  if (action === 'retry') { closeModal(); resetBattle(); }
  if (action === 'close-modal') closeModal();
  if (action === 'result-next') { closeModal(); if (ui.stage < STAGES.length) resetBattle(ui.stage + 1); else showStages(); }
  if (action === 'result-recruit') { closeModal(); ui.view = 'recruit'; if (inBattle()) ui.paused = true; render(); }
  if (action === 'summon') doSummon(Number(el.dataset.count));
  if (action === 'filter') { ui.filter = el.dataset.filter; render(); }
  if (action === 'hero-detail') showHero(el.dataset.id);
  if (action === 'use-hero') { ui.selectedHero = el.dataset.id; ui.selectedTower = null; ui.view = 'defense'; closeModal(); render(); }
}

document.addEventListener('click', event => {
  const el = event.target.closest('[data-action]');
  if (el) { event.preventDefault(); activate(el.dataset.action, el); }
  else if (event.target.classList.contains('modal-backdrop')) closeModal();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') { closeModal(); ui.selectedTower = null; updateHud(true); renderDynamic(); }
  if (modalRoot.children.length) {
    if (event.key === 'Tab') {
      const focusable = [...modalRoot.querySelectorAll('button:not([disabled]),[tabindex="0"]')];
      const first = focusable[0], last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) { last?.focus(); event.preventDefault(); }
      else if (!event.shiftKey && document.activeElement === last) { first?.focus(); event.preventDefault(); }
    }
    return;
  }
  if (ui.view !== 'defense' || event.repeat) return;
  if (event.code === 'Space' && !['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(event.target.tagName) && !event.target.closest('[role="button"]')) { event.preventDefault(); activate('wave', document.body); }
  if (event.key === '2') activate('speed', document.body);
  if (event.key === 'p' || event.key === 'P') activate('pause', document.body);
  if (event.key === 'Enter' && event.target.matches('[role="button"][data-action]')) activate(event.target.dataset.action, event.target);
});
document.addEventListener('visibilitychange', () => { if (document.hidden && inBattle()) { ui.paused = true; updateHud(true); } });
document.addEventListener('error', event => {
  if (event.target.classList?.contains('enemy-rig-piece')) {
    disableEnemyRig(event.target.getAttribute('data-stage'), event.target.getAttribute('data-kind'));
    renderDynamic();
  }
}, true);

function frame(now) {
  const dt = Math.min((now - lastTime) / 1000, 0.1); lastTime = now;
  if (ui.view === 'defense' && !ui.paused && !modalRoot.children.length) {
    engine.update(dt);
    enemyEffects = advanceEnemyEffects(enemyEffects, engine.state.enemies, dt * engine.state.speed, defeatedEnemies);
    defeatedEnemies = [];
    if (victoryPending && !enemyEffects.deaths.length) { victoryPending = false; render(); showResult(true); }
  }
  if (now - lastPaint > 40 && ui.view === 'defense') { renderDynamic(); updateHud(); lastPaint = now; }
  requestAnimationFrame(frame);
}
render();
requestAnimationFrame(frame);
