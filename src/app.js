import { GameEngine, MAP, WAVE_BREAK_SECONDS, BALANCE } from './engine.js';
import { HEROES, RARITIES, STAGES, WORLDS, worldOfStage, SQUAD_SIZE, GACHA_COST, GACHA_TEN_COST, GACHA_PITY, ELEMENTS, TRAITS, PROGRESSION, TALENTS, DAILY } from './data.js';
import { loadSettings, saveSettings } from './settings.js';
import { loadProfile, saveProfile, summon, grantVictory, raiseStar, toggleSquad, daoStars, challengeOpen, challengeReward, pullsToPity,
  freeStars, talentBonus, raiseTalent, resetTalents, talentModifiers, dailyMissions, recordDaily, claimDaily, achievements, claimAchievement } from './profile.js';
import { FRAGMENTS_PER_COPY, STARS_PER_TIER, nextStarCost, starBonusPercent, starTier, withStars } from './stars.js';
import { icon, portrait, renderTerrain } from './art.js';
import { renderEnemy, renderProjectile, renderPad, ELEMENT_COLORS, TRAIT_COLORS } from './pixel-units.js';
import { hasPaintedMap } from './maps.js';
import { enemyArt, heroArt } from './chibi-art.js';
import { emptyEnemyEffects, advanceEnemyEffects, enemyHitEffect, enemyDeathProgress, disableEnemyRig } from './enemy-rig.js';

const app = document.querySelector('#app');
const modalRoot = document.querySelector('#modal-root');
let profile = loadProfile();
const settings = loadSettings();
const ui = { view: 'defense', stage: 1, mode: 'normal', selectedHero: 'faxineiro', selectedTower: null, speed: settings.defaultSpeed, paused: false, sound: settings.sound, filter: 'all', reward: null };
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
// Short visual effects on the map (blasts, heals, skills): { x, y, radius, color, age, life }.
let areaEffects = [];
// Damage numbers rising from the enemies: { x, y, text, color, size, age, life }.
let damageNumbers = [];
// Towers that just attacked, to play their short strike animation.
const strikingTowers = new Set();
// What the current match already sent to the daily missions.
let dailySent = { kills: 0, skills: 0, upgrades: 0, bosses: 0 };
// Today's date (YYYY-MM-DD, local time): the daily missions change at midnight.
const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };

const heroById = id => HEROES.find(h => h.id === id);
const rarityOf = hero => RARITIES.find(r => r.id === hero.rarity);
const stageInfo = () => STAGES.find(s => s.id === ui.stage) || STAGES[0];
// Stages of a world already cleared, and how many it has.
const worldDone = world => profile.completedStages.filter(id => id >= world.firstStage && id <= world.lastStage).length;
const worldSize = world => world.lastStage - world.firstStage + 1;
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
  return new GameEngine({ stage: ui.stage, heroes: squadHeroes(), onEvent: onEngineEvent, mode: ui.mode, modifiers: talentModifiers(profile) });
}

/** Sends what the match did since the last time to the daily missions. Returns true when something changed. */
function flushDaily(extra = {}) {
  if (!engine) return false;
  const s = engine.state;
  const counts = { kills: s.kills - dailySent.kills, skills: s.skillsCast - dailySent.skills, upgrades: s.upgrades - dailySent.upgrades, bosses: s.bossKills - dailySent.bosses, ...extra };
  dailySent = { kills: s.kills, skills: s.skillsCast, upgrades: s.upgrades, bosses: s.bossKills };
  if (!Object.values(counts).some(value => value > 0)) return false;
  profile = recordDaily(profile, today(), counts);
  return true;
}

// Something to collect on the Cultivo page: free stars for a talent, a finished mission or an achievement reached.
const cultivationReady = () => TALENTS.some(t => profile.talents?.[t.id] < t.maxLevel && freeStars(profile) > profile.talents[t.id])
  || dailyMissions(profile, today()).some(m => m.done && !m.claimed)
  || achievements(profile).some(a => a.done && !a.claimed);

// Achievements reached but not received yet, to announce the new ones.
const readyAchievements = () => new Set(achievements(profile).filter(a => a.done && !a.claimed).map(a => a.id));
function announceAchievements(before) {
  const fresh = achievements(profile).filter(a => a.done && !a.claimed && !before.has(a.id));
  if (fresh.length) setTimeout(() => toast(`Conquista: ${fresh.map(a => a.name).join(', ')}. Receba a recompensa no Cultivo.`), 900);
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
    gain.gain.setValueAtTime(Math.max(0.0011, 0.036 * settings.effectsVolume / 100), audioContext.currentTime);
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
  if (event.type === 'heal') areaEffects.push({ x: event.x, y: event.y, radius: event.radius, color: TRAIT_COLORS.healer, age: 0, life: .5 });
  if (event.type === 'summon') areaEffects.push({ x: event.x, y: event.y, radius: event.radius, color: TRAIT_COLORS.summoner, age: 0, life: .5 });
  if (event.type === 'attack') strikingTowers.add(event.tower.id);
  if (event.type === 'damage') addDamageNumber(event);
  if (event.type === 'splash') areaEffects.push({ x: event.x, y: event.y, radius: event.radius, color: ELEMENT_COLORS[event.tower?.hero.element] || '#f1e6c4', age: 0, life: .35 });
  if (event.type === 'waveComplete' && engine.state.status === 'preparing') toast(`Onda ${engine.state.wave} concluída. A próxima começa em ${WAVE_BREAK_SECONDS} segundos.`);
  if (event.type === 'victory') {
    const before = readyAchievements();
    setTimeout(() => announceAchievements(before), 0);
    flushDaily({ victories: 1, perfect: engine.state.lives === engine.state.maxLives ? 1 : 0 });
    const result = grantVictory(profile, ui.stage, { lives: engine.state.lives, maxLives: engine.state.maxLives, mode: engine.state.mode });
    profile = result.profile; ui.reward = result; persist(); sound('victory');
    // Let the last enemy finish falling, using the same pausable clock as every other effect.
    victoryPending = true;
  }
  if (event.type === 'defeat') { if (flushDaily()) persist(); setTimeout(() => { render(); showResult(false); }, 80); }
}

// A number rising from the enemy hit: bigger and gold for a critical, small and in the element's colour for burn and
// poison, blue when only a shield was hit.
function addDamageNumber(event) {
  if (!settings.damageNumbers) return;
  const { enemy, amount, crit, overTime, shielded, tower } = event;
  const color = crit ? '#ffd36b' : overTime ? ELEMENT_COLORS[tower?.hero.element] || '#d9c08a' : shielded ? '#9fd0ff' : '#f6f0de';
  damageNumbers.push({
    x: enemy.x + (Math.random() * 14 - 7), y: enemy.y - (enemy.kind === 'boss' ? 58 : 38) - (enemy.flying ? 16 : 0),
    text: crit ? `${amount}!` : String(amount), color, size: crit ? 17 : overTime ? 9 : 12, age: 0, life: crit ? .9 : .7,
  });
  // Many towers hitting at once: the oldest numbers go first.
  if (damageNumbers.length > 60) damageNumbers.splice(0, damageNumbers.length - 60);
}

// Who held the line: damage and kills of each hero in the match just finished.
function matchSummary() {
  const rows = Object.entries(engine.state.heroStats || {})
    .map(([id, stats]) => ({ hero: heroById(id), ...stats }))
    .filter(row => row.hero && row.damage > 0)
    .sort((a, b) => b.damage - a.damage);
  if (!rows.length) return '';
  const top = rows[0].damage;
  const total = rows.reduce((sum, row) => sum + row.damage, 0);
  return `<div class="match-summary"><span class="eyebrow">QUEM SEGUROU A LINHA</span>${rows.map((row, index) => `<div class="summary-row ${index === 0 ? 'mvp' : ''}"><span class="summary-name">${index === 0 ? icon('trophy', 12) : ''}${escapeText(row.hero.name)}</span><span class="summary-bar"><i style="width:${(row.damage / top * 100).toFixed(1)}%;background:${ELEMENT_COLORS[row.hero.element] || row.hero.color}"></i></span><b>${row.damage.toLocaleString('pt-BR')}</b><small>${Math.round(row.damage / total * 100)}% · ${row.kills} ${row.kills === 1 ? 'abate' : 'abates'}</small></div>`).join('')}</div>`;
}

function logo() {
  return `<svg viewBox="0 0 44 44" class="brand-mark" aria-hidden="true"><path d="M22 3 41 35H3Z" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="m22 13 10 23H12Z" fill="currentColor"/><path d="M8 40h28M22 1v5" stroke="currentColor"/></svg>`;
}

function render() {
  const navs = [['defense', 'swords', 'Defesa'], ['squad', 'shield', 'Esquadrão'], ['recruit', 'gem', 'Recrutamento'], ['heroes', 'users', 'Meus heróis'], ['cultivation', 'star', 'Cultivo']];
  app.innerHTML = `<aside class="sidebar">
    <a href="#" class="brand" data-action="navigate" data-view="defense" aria-label="DTD início">${logo()}<span><strong>DTD<span class="brand-dot">.</span></strong><small>DAO TOWER DEFENSE</small></span></a>
    <div class="sidebar-label">SEU CAMINHO</div>
    <nav aria-label="Navegação principal">${navs.map(([id, glyph, text]) => `<button class="nav-item ${ui.view === id ? 'active' : ''}" data-action="navigate" data-view="${id}">${icon(glyph)}<span>${text}</span>${(id === 'recruit' && profile.crystals >= GACHA_COST) || (id === 'cultivation' && cultivationReady()) ? '<span class="nav-dot"></span>' : ''}</button>`).join('')}</nav>
    <div class="sidebar-art"><span class="vertical-script">道法自然</span><div class="mountain mountain-one"></div><div class="mountain mountain-two"></div><div class="mountain mountain-three"></div><div class="little-sun"></div></div>
    <div class="journey-card"><span class="eyebrow">A JORNADA DA ASCENSÃO</span><div><span>${worldOfStage(ui.stage).name}</span><span>${worldDone(worldOfStage(ui.stage))}/${worldSize(worldOfStage(ui.stage))}</span></div><div class="journey-track"><i style="width:${worldDone(worldOfStage(ui.stage)) / worldSize(worldOfStage(ui.stage)) * 100}%"></i></div><div class="journey-stars">${icon('star', 11)} ${daoStars(profile)} estrelas do Dao</div><p>Até o maior mestre deu<br>seu primeiro passo.</p></div>
    <div class="player-card"><div class="player-avatar">${icon('sword', 20)}</div><div><strong>Cultivador</strong><span>Discípulo iniciante</span></div><span class="online-dot" title="Progresso local"></span></div>
  </aside>
  <div class="workspace"><header class="topbar"><div class="breadcrumb">${worldOfStage(ui.stage).name} ${icon('chevronRight', 13)} <span>${{ defense: 'Campo de batalha', recruit: 'Pavilhão de recrutamento', heroes: 'Coleção de heróis', squad: 'Preparação do esquadrão', cultivation: 'Talentos e missões' }[ui.view]}</span></div><div class="topbar-actions"><div class="crystal-balance" title="Cristais do Dao — usados no recrutamento">${icon('gem', 17)}<strong id="crystal-count">${profile.crystals.toLocaleString('pt-BR')}</strong><span>Cristais do Dao</span></div><span class="topbar-divider"></span><button class="icon-button" data-action="sound" aria-label="${ui.sound ? 'Desativar' : 'Ativar'} som" title="${ui.sound ? 'Desativar' : 'Ativar'} som">${icon(ui.sound ? 'volume' : 'volumeOff', 19)}</button><button class="icon-button" data-action="settings" aria-label="Configurações" title="Configurações">${icon('settings', 19)}</button><div class="topbar-avatar">C</div></div></header>
  <main>${ui.view === 'recruit' ? renderRecruit() : ui.view === 'heroes' ? renderHeroes() : ui.view === 'squad' ? renderSquadPage() : ui.view === 'cultivation' ? renderCultivation() : renderDefense()}</main>
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
    <div class="battle-toolbar"><div class="map-title"><span class="map-status-dot"></span><strong>${escapeText(stage.name)}</strong><span class="tiny-tag">${stage.difficulty.toUpperCase()}</span>${ui.mode === 'challenge' ? '<span class="challenge-tag">DESAFIO</span>' : stageStarsRow(profile.stageStars?.[ui.stage] || 0, 12)}</div><div class="toolbar-controls"><button class="icon-button" data-action="restart" title="Reiniciar fase" aria-label="Reiniciar fase">${icon('refresh', 16)}</button><span></span><button class="icon-button pause-button ${ui.paused ? 'active' : ''}" id="pause-button" data-action="pause" title="Pausar (P)" aria-label="Pausar partida" ${inBattle() ? '' : 'disabled'}>${icon(ui.paused ? 'play' : 'pause', 16)}</button><button class="speed-button ${ui.speed === 2 ? 'fast' : ''}" data-action="speed" title="Alternar velocidade (2)">${icon('speed', 16)}<span id="speed-text">${ui.speed}×</span></button></div></div>
    <div class="map-container ${hasPaintedMap(ui.stage) ? 'painted' : ''}"><svg class="battle-map ${hasPaintedMap(ui.stage) ? 'painted-map' : ''}" viewBox="0 0 ${MAP.width} ${MAP.height}" role="group" aria-label="${escapeText(stage.name)}: caminho dos inimigos e nove posições para torres">${renderTerrain(ui.stage)}<g id="range-layer"></g><g id="pad-layer"></g><g id="tower-layer"></g><g id="enemy-layer"></g><g id="projectile-layer"></g><g id="effect-layer" pointer-events="none"></g></svg>
    <div class="map-hud"><span id="wave-countdown" class="hud-pill wave-countdown hidden" aria-live="polite"></span><span class="hud-pill lives">${icon('heart', 16)}<b id="hud-lives">20</b><small>VIDAS</small></span><span class="hud-pill qi">${icon('qi', 17)}<b id="hud-qi">180</b><small>QI</small></span></div>
    <div class="map-level"><span>${worldOfStage(ui.stage).name.toUpperCase()} · ${String(ui.stage).padStart(2, '0')} · ${stage.realm.toUpperCase()}</span><strong>${escapeText(stage.name)}</strong><small>${escapeText(stage.subtitle)}.</small></div>
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
  const cards = heroes.map(hero => { const rarity = rarityOf(hero); const onField = engine.state.towers.some(tower => tower.hero.id === hero.id); const fieldTower = engine.state.towers.find(tower => tower.hero.id === hero.id); const ready = engine.skillReady(fieldTower); const charge = fieldTower && hero.skill ? Math.min(100, Math.round(fieldTower.skillCharge / hero.skill.cooldown * 100)) : 0; return `<button class="hero-card ${ui.selectedHero === hero.id ? 'selected' : ''} ${onField ? 'on-field' : ''}" style="--hero-color:${rarity.color}" data-action="select-hero" data-id="${hero.id}" aria-pressed="${ui.selectedHero === hero.id}"${onField ? ` aria-label="${escapeText(hero.name)}, em campo"` : ''}><div class="hero-portrait">${portrait(hero)}<span class="hero-rarity">${rarity.name}</span>${onField ? `<span class="field-badge ${ready ? 'skill-ready' : ''}">${ready ? 'HABILIDADE PRONTA' : 'EM CAMPO'}</span>${hero.skill ? `<span class="skill-bar"><i style="width:${charge}%"></i></span>` : ''}` : ''}${ui.selectedHero === hero.id && !onField ? `<span class="hero-check">${icon('check', 11)}</span>` : ''}</div><div class="hero-card-info"><strong>${escapeText(hero.name)}</strong><span>${icon('qi', 12)} ${hero.cost} Qi <span class="${hero.stars ? 'card-stars' : ''}">${hero.stars ? `${hero.stars}★` : 'NV. 1'}</span></span></div></button>`; });
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

// What this stage's enemies can do, for the preview: "Javali de Presas de Ferro: Armadura · Chefe: Fúria".
function stageTraitsLine(stage) {
  const parts = ['normal', 'fast', 'brute', 'boss']
    .filter(kind => stage.traits?.[kind]?.length)
    .map(kind => `${kind === 'boss' ? 'Chefe' : escapeText(stage.enemies[kind])}: ${stage.traits[kind].map(id => TRAITS[id]?.name || id).join(', ')}`);
  return parts.length ? `<em class="enemy-traits" title="${parts.join(' · ')}">${parts.join(' · ')}</em>` : '';
}

// What a hero does beyond its numbers (element, area, skill), in plain words.
function heroAbilities(hero) {
  const lines = [];
  const element = ELEMENTS[hero.element];
  if (element) lines.push(`<li><b>${element.name}</b> ${element.effect}</li>`);
  if (hero.skill) lines.push(`<li><b>Habilidade · ${hero.skill.name}</b> ${hero.skill.description} Recarga: ${hero.skill.cooldown} s de onda.</li>`);
  if (hero.splash) lines.push(`<li><b>Área</b> Também atinge os inimigos até ${hero.splash.radius} de distância do alvo, com ${Math.round(hero.splash.fraction * 100)}% do dano (menos os voadores).</li>`);
  return lines.length ? `<ul class="hero-abilities">${lines.join('')}</ul>` : '';
}

function renderCommandPanel() {
  const s = engine.state;
  const tower = s.towers.find(t => t.id === ui.selectedTower);
  if (tower) {
    const hero = tower.hero; const rarity = rarityOf(hero); const stats = engine.getTowerStats(tower); const cost = engine.getNextUpgradeCost(tower);
    return `<div class="command-card"><div class="rail-heading"><span class="eyebrow">CULTIVADOR EM CAMPO</span><button class="icon-button" data-action="deselect-tower" aria-label="Fechar detalhes">${icon('close', 15)}</button></div><div class="tower-detail"><div class="detail-portrait" style="--hero-color:${rarity.color}">${portrait(hero)}</div><span class="rarity-text" style="color:${rarity.color}">${rarity.name}</span><h2>${hero.name}</h2><span class="level-badge">NÍVEL ${tower.level}</span></div>${heroAbilities(hero)}<div class="stat-row"><span>${icon('sword', 15)} Dano</span><b>${Math.round(stats.damage)}</b></div><div class="stat-row"><span>${icon('shield', 15)} Alcance</span><b>${Math.round(stats.range)}</b></div><div class="stat-row"><span>${icon('speed', 15)} Ataques / s</span><b>${Number(stats.attackSpeed).toFixed(1)}</b></div><div class="stat-row match-stat"><span>${icon('trophy', 15)} Nesta fase</span><b>${(s.heroStats?.[hero.id]?.damage || 0).toLocaleString('pt-BR')} de dano · ${s.heroStats?.[hero.id]?.kills || 0} abates</b></div>${hero.skill ? `<button class="skill-button ${engine.skillReady(tower) ? 'ready' : ''}" data-action="use-skill" ${engine.skillReady(tower) && s.status === 'running' ? '' : 'disabled'}>${icon('sparkles', 15)} ${hero.skill.name} · ${engine.skillReady(tower) ? 'usar habilidade' : `${Math.min(100, Math.round(tower.skillCharge / hero.skill.cooldown * 100))}%`}</button>` : ''}<button class="primary-button upgrade-button" data-action="upgrade" ${!Number.isFinite(cost) || s.qi < cost || s.status === 'victory' || s.status === 'defeat' ? 'disabled' : ''}>${icon('arrowUp', 17)} ${Number.isFinite(cost) ? `Melhorar · ${cost} Qi` : 'Nível máximo'}</button><button class="sell-button" data-action="sell">Dispensar · recuperar ${Math.floor(tower.spent * .7)} Qi</button><p class="rail-note">As melhorias duram apenas nesta fase.</p></div>`;
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
  return `<div class="command-card"><div class="rail-heading"><span class="eyebrow">${eyebrow}</span><span class="small-orbit">${icon('swords', 16)}</span></div><h2 class="${cd !== null ? 'countdown-title' : ''}">${title}</h2><p class="command-description">${description}</p><div class="wave-info"><span>Onda <b>${current}</b> de ${s.totalWaves}</span><span>${Math.round(s.wave / s.totalWaves * 100)}%</span></div><div class="wave-track">${Array.from({ length: s.totalWaves }, (_, i) => `<span class="${i < s.wave ? 'completed' : ''} ${i === s.wave - 1 && s.status === 'running' ? 'ongoing' : ''}"></span>`).join('')}</div><div class="enemy-preview"><div class="enemy-face ${preview ? 'painted' : ''}">${preview ? `<img src="${preview.url}" alt="">` : icon(bossNext ? 'shield' : 'sword', 23)}</div><div><strong>${escapeText(bossNext ? stage.enemies.boss : stage.enemies.normal)}</strong><span>${bossNext ? 'O chefe da fase se aproxima' : `Também: ${escapeText(stage.enemies.fast)} e ${escapeText(stage.enemies.brute)}`}</span>${stageTraitsLine(stage)}</div></div><button class="primary-button wave-button" data-action="wave">${icon(s.status === 'running' ? (ui.paused ? 'play' : 'pause') : s.status === 'victory' ? 'flag' : s.status === 'defeat' ? 'refresh' : 'play', 16)}<span>${s.status === 'running' ? (ui.paused ? 'Continuar onda' : 'Pausar onda') : s.status === 'victory' ? 'Próxima fase' : s.status === 'defeat' ? 'Tentar novamente' : cd !== null ? 'Começar agora' : 'Iniciar onda'}</span>${s.status === 'preparing' ? '<kbd>ESPAÇO</kbd>' : ''}</button><p class="rail-note">${icon('qi', 12)} Elimine inimigos para acumular Qi.</p></div><div class="selected-hero-note">${icon('users', 16)}<span>Selecionado: <strong>${heroById(ui.selectedHero)?.name || 'Faxineiro'}</strong></span></div>`;
}

function renderRecruit() {
  return `${pageHeading('O DESTINO REÚNE OS ESCOLHIDOS', 'Pavilhão de recrutamento<span>.</span>', 'Além das montanhas, novos aliados aguardam o seu chamado.')}
  <section class="summon-banner"><div class="summon-copy"><span class="event-badge">${icon('sparkles', 14)} RECRUTAMENTO PERMANENTE</span><h2>Todo encontro<br>muda o destino.</h2><p>Do primeiro discípulo ao mestre supremo.<br>Invoque cultivadores e descubra o seu potencial.</p><div class="summon-highlights"><span>7 raridades</span><i></i><span>14 cultivadores</span><i></i><span>Uma jornada sem limites</span></div></div><div class="summon-art"><div class="summon-ring ring-one"></div><div class="summon-ring ring-two"></div><span class="summon-rune rune-one">道</span><span class="summon-rune rune-two">气</span><div class="banner-hero banner-hero-left">${portrait(HEROES.find(h => h.rarity === 'legendary'), 'banner')}</div><div class="banner-hero banner-hero-right">${portrait(HEROES.find(h => h.rarity === 'ur'), 'banner')}</div><div class="banner-hero banner-hero-main">${portrait(HEROES.find(h => h.rarity === 'urplus'), 'banner')}</div><span class="summon-particle p1"></span><span class="summon-particle p2"></span><span class="summon-particle p3"></span></div></section>
  <div class="recruit-bottom"><section class="summon-controls"><div><span class="eyebrow">CRISTAIS DO DAO</span><h2>Responda ao chamado.</h2><p>Cada invocação garante um herói. Repetidos viram ${FRAGMENTS_PER_COPY} fragmentos para elevar as estrelas dele.</p></div><div class="summon-buttons"><button class="secondary-button summon-single" data-action="summon" data-count="1" ${profile.crystals < GACHA_COST ? 'disabled' : ''}>Invocar 1 herói <span>${icon('gem', 16)} ${GACHA_COST}</span></button><button class="primary-button summon-ten" data-action="summon" data-count="10" ${profile.crystals < GACHA_TEN_COST ? 'disabled' : ''}>${icon('sparkles', 17)} Invocar 10 heróis <span>${icon('gem', 16)} ${GACHA_TEN_COST}</span><small>10% DE DESCONTO</small></button></div><div class="summon-balance">Seu saldo: <b>${profile.crystals} cristais</b><span>Ganhe mais concluindo fases.</span></div></section><section class="probability-card"><div class="section-heading"><h2>O destino em números</h2>${icon('gem', 17)}</div><p>Chances por invocação · ${RARITIES.find(r => r.id === GACHA_PITY.rarity).name} ou melhor garantido a cada ${GACHA_PITY.every} invocações</p>${pityMeter()}<div class="probability-grid">${RARITIES.map(r => `<div><span><i style="background:${r.color}"></i>${r.name}</span><b>${(r.chance * 100).toLocaleString('pt-BR', { maximumFractionDigits: 2 })}%</b></div>`).join('')}</div></section></div>`;
}

// Talents bought with the stars of the Dao, and the missions of the day.
function renderCultivation() {
  const free = freeStars(profile);
  const missions = dailyMissions(profile, today());
  const claimedAll = missions.every(m => m.claimed);
  const talentCards = TALENTS.map(t => {
    const level = profile.talents[t.id];
    const maxed = level >= t.maxLevel;
    const cost = level + 1;
    return `<article class="talent-card ${maxed ? 'maxed' : ''}"><div class="talent-head"><strong>${escapeText(t.name)}</strong><span class="talent-pips">${Array.from({ length: t.maxLevel }, (_, i) => `<i class="${i < level ? 'on' : ''}"></i>`).join('')}</span></div><p>${escapeText(t.description)}</p><div class="talent-bonus"><span>${level ? escapeText(talentBonus(t, level)) : 'Ainda não aprendido'}</span>${maxed ? '' : `<em>${icon('chevronRight', 11)} ${escapeText(talentBonus(t, level + 1))}</em>`}</div><button class="${maxed ? 'secondary-button' : 'primary-button'} talent-button" data-action="talent-up" data-id="${t.id}" ${maxed || free < cost ? 'disabled' : ''}>${maxed ? 'Nível máximo' : `${icon('star', 14)} Aprender · ${cost} ${cost === 1 ? 'estrela' : 'estrelas'}`}</button></article>`;
  }).join('');
  const missionRows = missions.map(m => `<div class="mission ${m.done ? 'done' : ''} ${m.claimed ? 'claimed' : ''}"><div class="mission-text"><strong>${escapeText(m.text)}</strong><div class="mission-track"><i style="width:${m.progress / m.goal * 100}%"></i></div><small>${m.progress}/${m.goal}</small></div><button class="${m.done && !m.claimed ? 'primary-button' : 'secondary-button'} mission-button" data-action="claim-mission" data-id="${m.id}" ${m.done && !m.claimed ? '' : 'disabled'}>${m.claimed ? `${icon('check', 14)} Recebida` : `${icon('gem', 14)} ${m.reward}`}</button></div>`).join('');
  return `${pageHeading('O CAMINHO É LONGO', 'Cultivo<span>.</span>', 'Gaste as estrelas do Dao em talentos permanentes e cumpra as missões do dia por cristais.', `<span class="collection-count">${icon('star', 18)}<b>${free}</b> de ${daoStars(profile)} estrelas livres</span>`)}
  <div class="cultivation-layout"><section class="talent-panel"><div class="section-heading"><h2>Talentos permanentes</h2><button class="text-button" data-action="talent-reset">Redistribuir estrelas</button></div><p class="panel-note">Cada nível custa tantas estrelas quanto o seu número. Ganhe estrelas vencendo fases sem perder vidas e vencendo desafios. Os talentos valem a partir da próxima partida.</p><div class="talent-grid">${talentCards}</div></section>
  <section class="daily-panel"><div class="section-heading"><h2>Missões do dia</h2><span class="panel-note">Renovam à meia-noite</span></div>${missionRows}<p class="panel-note ${claimedAll ? 'done' : ''}">${claimedAll ? `${icon('check', 12)} Todas recebidas hoje. Volte amanhã.` : `Receba as ${DAILY.count} e ganhe mais ${DAILY.allDoneBonus} cristais.`}</p></section></div>
  ${renderAchievements()}`;
}

// Every achievement: progress, and the reward button once it is reached.
function renderAchievements() {
  const list = achievements(profile);
  const received = list.filter(a => a.claimed).length;
  return `<section class="achievement-panel"><div class="section-heading"><h2>Conquistas</h2><span class="panel-note">${received} de ${list.length} recebidas</span></div><div class="achievement-grid">${list.map(a => `<article class="achievement-card ${a.claimed ? 'claimed' : a.done ? 'done' : ''}"><div class="achievement-icon">${icon(a.claimed ? 'check' : a.done ? 'trophy' : 'lock', 16)}</div><div class="achievement-text"><strong>${escapeText(a.name)}</strong><span>${escapeText(a.description)}</span>${a.target > 1 ? `<div class="mission-track"><i style="width:${a.progress / a.target * 100}%"></i></div><small>${a.progress.toLocaleString('pt-BR')}/${a.target.toLocaleString('pt-BR')}</small>` : ''}</div><button class="${a.done && !a.claimed ? 'primary-button' : 'secondary-button'} achievement-button" data-action="claim-achievement" data-id="${a.id}" ${a.done && !a.claimed ? '' : 'disabled'}>${a.claimed ? 'Recebida' : `${icon('gem', 13)} ${a.reward}`}</button></article>`).join('')}</div></section>`;
}

// Sound, volumes, the speed each stage starts at and the damage numbers.
function showSettings() {
  const toggle = (key, on) => `<button class="setting-toggle ${on ? 'on' : ''}" data-action="setting-toggle" data-key="${key}" aria-pressed="${on}">${on ? 'Ligado' : 'Desligado'}</button>`;
  const slider = (key, label, note = '') => `<label class="setting-row"><span>${label}${note ? `<small>${note}</small>` : ''}</span><input type="range" min="0" max="100" step="5" value="${settings[key]}" data-setting="${key}"><b id="setting-${key}">${settings[key]}%</b></label>`;
  showModal(`<span class="eyebrow">AJUSTES</span><h2 id="modal-title">Configurações.</h2><p class="modal-description">Ficam salvas neste navegador.</p><div class="settings-list">
    <div class="setting-row"><span>Som</span>${toggle('sound', ui.sound)}</div>
    ${slider('effectsVolume', 'Volume dos efeitos')}
    ${slider('musicVolume', 'Volume da música', 'A música chega com os arquivos de som.')}
    <div class="setting-row"><span>Velocidade ao começar uma fase</span><div class="setting-choice">${[1, 2].map(speed => `<button class="${settings.defaultSpeed === speed ? 'on' : ''}" data-action="setting-speed" data-value="${speed}">${speed}×</button>`).join('')}</div></div>
    <div class="setting-row"><span>Números de dano</span>${toggle('damageNumbers', settings.damageNumbers)}</div>
  </div><button class="primary-button" data-action="close-modal">Pronto ${icon('check', 16)}</button>`, 'settings-modal');
}

// How close the guaranteed legendary pull is.
function pityMeter() {
  const left = pullsToPity(profile);
  const name = RARITIES.find(r => r.id === GACHA_PITY.rarity).name;
  return `<div class="pity-meter"><div><span>${icon('star', 12)} Garantia</span><b>${left === 1 ? `${name} garantido na próxima invocação` : `${name} garantido em ${left} invocações`}</b></div><div class="pity-track"><i style="width:${(GACHA_PITY.every - left) / GACHA_PITY.every * 100}%"></i></div></div>`;
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
    return `<g class="map-tower ${tower.id === ui.selectedTower ? 'chosen' : ''}" data-action="select-tower" data-id="${tower.id}" role="button" tabindex="0" aria-label="${tower.hero.name}, nível ${tower.level}"><ellipse cx="${tower.x}" cy="${tower.y + 3}" rx="19" ry="10" fill="${tower.hero.color}" opacity=".4"/><g class="tower-body"><svg x="${tower.x - w / 2}" y="${tower.y + 6 - h}" width="${w}" height="${h}" viewBox="0 0 120 140">${portrait(tower.hero, 'tower').replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')}</svg></g><rect x="${tower.x - 13}" y="${tower.y + 10}" width="26" height="13" rx="0" fill="#182820" stroke="#c4cba6" stroke-width=".8"/><text x="${tower.x}" y="${tower.y + 20}" text-anchor="middle">${tower.level}</text><rect x="${tower.x - 25}" y="${tower.y + 6 - h}" width="50" height="${h + 19}" fill="transparent" pointer-events="all"/></g>`;
  }).join('');
  if (towerMarkup !== lastTowerMarkup) { document.querySelector('#tower-layer').innerHTML = towerMarkup; lastTowerMarkup = towerMarkup; }
  // A short hop each time a tower attacks: the class is taken off and put back so the animation starts again.
  for (const id of strikingTowers) {
    const body = document.querySelector(`#tower-layer [data-id="${id}"] .tower-body`);
    if (!body) continue;
    body.classList.remove('striking');
    body.getBoundingClientRect();
    body.classList.add('striking');
  }
  strikingTowers.clear();
  // The squad bar shows who is already on the map; refresh it only when that changes.
  const squadGrid = document.querySelector('.squad-section .squad-grid');
  const squadMarkup = squadGrid ? renderSquad() : '';
  if (squadGrid && squadMarkup !== lastSquadMarkup) { squadGrid.innerHTML = squadMarkup; lastSquadMarkup = squadMarkup; }
  document.querySelector('#enemy-layer').innerHTML = enemyEffects.deaths.map(death => renderEnemy(death.enemy, ui.stage, { dying: true, death: enemyDeathProgress(enemyEffects, death) })).join('')
    + s.enemies.map(enemy => renderEnemy(enemy, ui.stage, { hit: enemyHitEffect(enemyEffects, enemy) })).join('');
  document.querySelector('#projectile-layer').innerHTML = s.projectiles.map(renderProjectile).join('');
  const effects = document.querySelector('#effect-layer');
  if (effects) effects.innerHTML = areaEffects.map(effect => { const t = effect.age / effect.life; return `<circle cx="${effect.x}" cy="${effect.y}" r="${(effect.radius * (.55 + .45 * t)).toFixed(1)}" fill="${effect.color}" fill-opacity="${(.22 * (1 - t)).toFixed(3)}" stroke="${effect.color}" stroke-opacity="${(.8 * (1 - t)).toFixed(3)}" stroke-width="2"/>`; }).join('')
    + damageNumbers.map(number => { const t = number.age / number.life; return `<text class="damage-number" x="${number.x.toFixed(1)}" y="${(number.y - 20 * t).toFixed(1)}" font-size="${number.size}" fill="${number.color}" opacity="${(t < .6 ? 1 : (1 - t) / .4).toFixed(2)}" text-anchor="middle">${number.text}</text>`; }).join('');
}

function updateHud(force = false) {
  if (ui.view !== 'defense') return;
  const s = engine.state;
  const cd = countdown();
  // The selected tower's skill charge (in 5% steps) also refreshes the panel.
  const chosen = s.towers.find(tower => tower.id === ui.selectedTower);
  const charge = chosen?.hero.skill ? Math.floor(chosen.skillCharge / chosen.hero.skill.cooldown * 20) : '';
  const key = `${s.lives}-${s.qi}-${s.wave}-${s.status}-${s.kills}-${ui.selectedTower}-${ui.paused}-${cd}-${charge}`;
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

function resetBattle(stage = ui.stage, mode = ui.mode) {
  if (flushDaily()) persist();
  ui.speed = settings.defaultSpeed;
  dailySent = { kills: 0, skills: 0, upgrades: 0, bosses: 0 };
  ui.stage = stage; ui.mode = mode === 'challenge' && challengeOpen(profile, stage) ? 'challenge' : 'normal'; ui.selectedTower = null; ui.paused = false; ui.reward = null;
  enemyEffects = emptyEnemyEffects(); defeatedEnemies = []; victoryPending = false; damageNumbers = []; areaEffects = [];
  engine = makeEngine(); engine.setSpeed(ui.speed); render();
}

function showModal(content, className = '') {
  modalRoot.innerHTML = `<div class="modal-backdrop"><section class="modal ${className}" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button class="modal-close icon-button" data-action="close-modal" aria-label="Fechar">${icon('close', 20)}</button>${content}</section></div>`;
  document.body.classList.add('modal-open');
  setTimeout(() => modalRoot.querySelector('button:not(.modal-close)')?.focus(), 50);
}

function closeModal() { modalRoot.innerHTML = ''; document.body.classList.remove('modal-open'); }

// Three stars, lit up to the best mark of a stage.
function stageStarsRow(stars, size = 13) {
  return `<span class="stage-stars" aria-label="${stars} de 3 estrelas">${[1, 2, 3].map(i => `<i class="${i <= stars ? 'lit' : ''}">${icon('star', size)}</i>`).join('')}</span>`;
}

const challengeRule = () => `os inimigos têm ${Math.round((BALANCE.challenge.hpMultiplier - 1) * 100)}% mais vida e você tem só ${BALANCE.challenge.lives} vidas`;

// One tab per world; a world opens when its first stage is unlocked.
function worldTabs(selected) {
  return `<div class="world-tabs" role="tablist">${WORLDS.map(world => {
    const open = world.firstStage <= profile.unlockedStage;
    return `<button class="world-tab ${world.id === selected.id ? 'active' : ''}" role="tab" aria-selected="${world.id === selected.id}" data-action="stage-world" data-id="${world.id}" ${open ? '' : `disabled title="Vença a fase ${world.firstStage - 1} para chegar a este mundo"`}>${open ? '' : icon('lock', 12)}<span>${escapeText(world.name)}</span><small>${worldDone(world)}/${worldSize(world)}</small></button>`;
  }).join('')}</div>`;
}

function showStages(worldId = worldOfStage(ui.stage).id) {
  const world = WORLDS.find(candidate => candidate.id === worldId) || WORLDS[0];
  showModal(`<span class="eyebrow">A JORNADA DA ASCENSÃO</span>${worldTabs(world)}<h2 id="modal-title">Escolha seu caminho.</h2><p class="modal-description">${escapeText(world.motto)} Vença sem perder vidas para conquistar 3 estrelas e abrir o desafio da fase.</p><div class="stage-total">${icon('star', 14)} <b>${daoStars(profile)}</b> estrelas do Dao conquistadas</div><div class="stage-list">${STAGES.filter(stage => stage.world === world.id).map(stage => {
    const unlocked = stage.id <= profile.unlockedStage;
    const completed = profile.completedStages.includes(stage.id);
    const stars = profile.stageStars?.[stage.id] || 0;
    const open = challengeOpen(profile, stage.id);
    const won = profile.challenges?.includes(stage.id);
    const challenge = completed ? `<button class="challenge-option ${won ? 'won' : ''} ${ui.stage === stage.id && ui.mode === 'challenge' ? 'current' : ''}" data-action="choose-challenge" data-id="${stage.id}" ${open ? '' : 'disabled'} title="${open ? `No desafio, ${challengeRule()}.` : 'Conquiste 3 estrelas para abrir o desafio'}">${icon(open ? 'swords' : 'lock', 15)}<span>Desafio</span><small>${won ? 'Vencido' : open ? `${icon('gem', 10)} ${challengeReward(stage.id)}` : '3 estrelas'}</small></button>` : '';
    return `<div class="stage-row"><button class="stage-option ${ui.stage === stage.id && ui.mode === 'normal' ? 'current' : ''}" data-action="choose-stage" data-id="${stage.id}" ${unlocked ? '' : 'disabled'}><span class="stage-number">${unlocked ? String(stage.id).padStart(2, '0') : icon('lock', 20)}</span><span><strong>${stage.name}</strong><small>${stage.difficulty} · ${completed ? 'Concluída' : stage.id === 1 ? 'Sua primeira jornada' : 'Novos desafios'}</small>${completed ? stageStarsRow(stars, 11) : ''}</span><span class="stage-reward">${completed ? icon('check', 19) : `${icon('gem', 14)} ${stage.reward}`}</span></button>${challenge}</div>`;
  }).join('')}</div><p class="rail-note">Trocar de fase reinicia a partida atual. No desafio, ${challengeRule()}.</p>`);
}

// The stars (or the challenge) of the victory just won.
function victoryStarsBlock() {
  const r = ui.reward;
  if (!r) return '';
  if (r.challenge) return `<div class="victory-stars challenge"><span class="challenge-tag">DESAFIO VENCIDO</span><small>${r.firstChallenge ? 'Primeira vitória no desafio: +1 estrela do Dao.' : 'Desafio vencido de novo.'}</small></div>`;
  const hint = r.stars === 3 ? 'Defesa perfeita: o desafio desta fase está aberto.'
    : r.stars === 2 ? 'Vença sem perder vidas para conquistar 3 estrelas.'
    : `Perca no máximo ${Math.floor(engine.state.maxLives * PROGRESSION.twoStarsMaxLossPercent / 100)} vidas para conquistar 2 estrelas.`;
  return `<div class="victory-stars">${stageStarsRow(r.stars, 26)}<small>${r.newRecord && !r.firstClear ? 'Nova melhor marca! ' : ''}${hint}</small></div>`;
}

function showResult(victory) {
  showModal(`<div class="result-icon ${victory ? '' : 'defeat'}">${icon(victory ? 'trophy' : 'shield', 38)}</div><span class="eyebrow">${victory ? 'O DAO RECONHECE SUA FORÇA' : 'TODA QUEDA ENSINA'}</span><h2 id="modal-title">${victory ? 'O território está a salvo.' : 'Seu caminho continua.'}</h2><p class="modal-description">${victory ? `${escapeText(stageInfo().name)} foi protegido e ${escapeText(stageInfo().enemies.boss)} caiu. Seus cultivadores conquistaram uma nova vitória.` : 'Os invasores passaram pela sua defesa. Repense as posições e cultive seu poder entre as ondas.'}</p>${victory ? victoryStarsBlock() : ''}${matchSummary()}<div class="result-stats"><span><b>${engine.state.kills}</b>inimigos derrotados</span><span><b>${engine.state.wave}/${engine.state.totalWaves}</b>ondas enfrentadas</span></div>${victory ? `<div class="victory-reward">${icon('gem', 26)}<div><b>+${ui.reward?.reward || 0} Cristais do Dao</b><span>${ui.reward?.firstChallenge ? 'Recompensa do primeiro desafio vencido' : ui.reward?.firstClear ? 'Recompensa de primeira conclusão' : 'Recompensa de nova conclusão'}</span></div></div><button class="primary-button" data-action="result-next">${ui.stage < STAGES.length ? 'Seguir para a próxima fase' : 'Escolher uma nova jornada'} ${icon('arrowRight', 16)}</button><button class="text-button" data-action="result-recruit">Visitar o pavilhão de recrutamento</button>` : `<button class="primary-button" data-action="retry">${icon('refresh', 16)} Tentar novamente</button>`}`, 'result-modal');
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
  showModal(`<div class="hero-detail-art" style="--hero-color:${r.color}">${portrait(hero)}</div><span class="rarity-text" style="color:${r.color}">${r.name} · ${hero.title}</span><h2 id="modal-title">${hero.name}</h2><p class="modal-description">${hero.description}</p>${heroAbilities(hero)}${starPanel(id, owned)}<div class="hero-detail-stats"><span>${icon('sword', 18)}<b>${hero.damage}</b>Dano</span><span>${icon('shield', 18)}<b>${hero.range}</b>Alcance</span><span>${icon('speed', 18)}<b>${hero.attackSpeed.toFixed(1)}</b>Ataques/s</span><span>${icon('qi', 18)}<b>${hero.cost}</b>Qi inicial</span></div>${!owned ? `<button class="primary-button" data-action="result-recruit">Visitar recrutamento ${icon('arrowRight', 16)}</button>`
    : profile.squad.includes(id) ? `<button class="primary-button" data-action="use-hero" data-id="${id}">Selecionar para a defesa ${icon('arrowRight', 16)}</button>`
    : `<button class="primary-button" data-action="squad-toggle" data-id="${id}">${icon('plus', 16)} Colocar no esquadrão</button>`}`, 'hero-modal');
}

function doSummon(count) {
  const result = summon(profile, count);
  if (!result.ok) return toast(result.reason || 'Cristais insuficientes. Conclua fases para ganhar mais.');
  const before = new Set(profile.owned);
  const ready = readyAchievements();
  profile = recordDaily(result.profile, today(), { summons: count }); engine.setHeroes(squadHeroes()); persist(); sound('victory'); render();
  announceAchievements(ready);
  showModal(`<span class="eyebrow">O DESTINO FOI TRAÇADO</span><h2 id="modal-title">${count === 1 ? 'Um novo encontro.' : 'Novos caminhos se abrem.'}</h2><p class="modal-description">${count === 1 ? 'Um cultivador respondeu ao seu chamado.' : 'Dez cultivadores responderam ao seu chamado.'}</p><div class="summon-results ${count > 1 ? 'many' : ''}">${result.heroes.map((hero, i) => { const r = rarityOf(hero); const fresh = !before.has(hero.id); before.add(hero.id); return `<div class="summon-result-card" style="--hero-color:${r.color};--delay:${i * 70}ms"><div>${portrait(hero)}<span class="result-rarity">${r.name}</span><span class="new-badge ${fresh ? '' : 'fragment-badge'}">${fresh ? 'NOVO' : `+${FRAGMENTS_PER_COPY} FRAGMENTOS`}</span>${result.guaranteed?.[i] ? '<span class="pity-badge">GARANTIDO</span>' : ''}</div><h3>${hero.name}</h3><p>${hero.title}</p></div>`; }).join('')}</div><button class="primary-button" data-action="close-modal">Receber cultivadores ${icon('check', 17)}</button><span class="summon-result-note">Heróis novos entram no esquadrão se houver vaga. Repetidos viram fragmentos para elevar estrelas em Meus heróis.</span>`, `summon-modal ${count > 1 ? 'wide-modal' : ''}`);
}

function activate(action, el) {
  sound();
  if (action === 'navigate') {
    const next = el.dataset.view;
    if (ui.view === 'defense' && next !== 'defense' && inBattle()) ui.paused = true;
    // The missions page shows what the match in progress has already done.
    if (next === 'cultivation' && flushDaily()) persist();
    ui.view = next; render();
  }
  if (action === 'talent-up') {
    const result = raiseTalent(profile, el.dataset.id);
    if (!result.ok) return toast(result.reason);
    const ready = readyAchievements();
    profile = result.profile; persist(); sound('victory'); render();
    announceAchievements(ready);
    toast(`${TALENTS.find(t => t.id === el.dataset.id).name} chegou ao nível ${result.level}. Vale a partir da próxima partida.`);
  }
  if (action === 'talent-reset') {
    const result = resetTalents(profile);
    if (!result.refund) return toast('Nenhuma estrela foi gasta em talentos ainda.');
    profile = result.profile; persist(); render();
    toast(`${result.refund} estrelas voltaram para você. Distribua de novo como quiser.`);
  }
  if (action === 'claim-mission') {
    const result = claimDaily(profile, today(), el.dataset.id);
    if (!result.ok) return toast(result.reason);
    const ready = readyAchievements();
    profile = result.profile; persist(); sound('victory'); render();
    toast(result.bonus ? `+${result.reward} cristais, com o bônus de todas as missões do dia!` : `+${result.reward} cristais.`);
    announceAchievements(ready);
  }
  if (action === 'claim-achievement') {
    const result = claimAchievement(profile, el.dataset.id);
    if (!result.ok) return toast(result.reason);
    profile = result.profile; persist(); sound('victory'); render();
    toast(`+${result.reward} cristais pela conquista.`);
  }
  if (action === 'sound') { ui.sound = !ui.sound; settings.sound = ui.sound; saveSettings(settings); render(); if (ui.sound) sound(); }
  if (action === 'settings') showSettings();
  if (action === 'setting-toggle') {
    const key = el.dataset.key;
    if (key === 'sound') { ui.sound = !ui.sound; settings.sound = ui.sound; } else settings[key] = !settings[key];
    if (key === 'damageNumbers' && !settings.damageNumbers) damageNumbers = [];
    saveSettings(settings); render(); showSettings();
    if (key === 'sound' && ui.sound) sound();
  }
  if (action === 'setting-speed') { settings.defaultSpeed = Number(el.dataset.value) === 2 ? 2 : 1; saveSettings(settings); showSettings(); }
  if (action === 'stages') showStages();
  if (action === 'stage-world') showStages(Number(el.dataset.id));
  if (action === 'choose-stage') { closeModal(); ui.view = 'defense'; resetBattle(Number(el.dataset.id), 'normal'); }
  if (action === 'choose-challenge') { closeModal(); ui.view = 'defense'; resetBattle(Number(el.dataset.id), 'challenge'); }
  if (action === 'select-hero') {
    // A hero on the map with its skill charged casts it straight from the card.
    const fieldTower = engine.state.towers.find(tower => tower.hero.id === el.dataset.id);
    if (fieldTower && engine.skillReady(fieldTower) && engine.state.status === 'running') {
      const cast = engine.useSkill(fieldTower.id);
      if (!cast.ok) toast(cast.reason); else sound('upgrade');
      renderDynamic(); return;
    }
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
    const ready = readyAchievements();
    profile = result.profile; engine.setHeroes(squadHeroes()); persist(); sound('victory');
    render(); showHero(id);
    announceAchievements(ready);
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
  if (action === 'use-skill') {
    const cast = engine.useSkill(ui.selectedTower);
    if (!cast.ok) toast(cast.reason); else sound('upgrade');
    updateHud(true); renderDynamic();
  }
  if (action === 'upgrade') { const result = engine.upgradeTower(ui.selectedTower); if (!result.ok) toast(result.reason || 'Qi insuficiente.'); updateHud(true); renderDynamic(); }
  if (action === 'sell') { const result = engine.sellTower(ui.selectedTower); if (result?.ok === false) toast(result.reason); ui.selectedTower = null; updateHud(true); renderDynamic(); }
  if (action === 'speed') { ui.speed = ui.speed === 1 ? 2 : 1; engine.setSpeed(ui.speed); document.querySelector('#speed-text')?.replaceChildren(`${ui.speed}×`); document.querySelector('.speed-button')?.classList.toggle('fast', ui.speed === 2); }
  if (action === 'wave') {
    if (engine.state.status === 'running') ui.paused = !ui.paused;
    else if (engine.state.status === 'victory') { ui.stage < STAGES.length ? resetBattle(ui.stage + 1, 'normal') : showStages(); }
    else if (engine.state.status === 'defeat') resetBattle();
    else { const result = engine.startWave(); if (result?.ok === false) toast(result.reason || 'Posicione uma torre primeiro.'); ui.paused = false; }
    updateHud(true);
  }
  if (action === 'pause') { ui.paused = inBattle() ? !ui.paused : false; updateHud(true); }
  if (action === 'restart') showModal(`<span class="eyebrow">UM NOVO COMEÇO</span><h2 id="modal-title">Recomeçar esta fase?</h2><p class="modal-description">As torres e o Qi desta partida serão reiniciados. Sua coleção e seus cristais continuam com você.</p><button class="primary-button" data-action="retry">${icon('refresh', 16)} Recomeçar fase</button><button class="text-button" data-action="close-modal">Continuar jogando</button>`);
  if (action === 'retry') { closeModal(); resetBattle(); }
  if (action === 'close-modal') closeModal();
  if (action === 'result-next') { closeModal(); if (ui.stage < STAGES.length) resetBattle(ui.stage + 1, 'normal'); else showStages(); }
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
// The volume sliders of the settings window.
document.addEventListener('input', event => {
  const key = event.target.dataset?.setting;
  if (!key) return;
  settings[key] = Number(event.target.value);
  document.querySelector(`#setting-${key}`)?.replaceChildren(`${settings[key]}%`);
  saveSettings(settings);
});
document.addEventListener('change', event => { if (event.target.dataset?.setting === 'effectsVolume') sound(); });
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
    for (const effect of areaEffects) effect.age += dt * engine.state.speed;
    areaEffects = areaEffects.filter(effect => effect.age < effect.life);
    for (const number of damageNumbers) number.age += dt * engine.state.speed;
    damageNumbers = damageNumbers.filter(number => number.age < number.life);
    if (victoryPending && !enemyEffects.deaths.length) { victoryPending = false; render(); showResult(true); }
  }
  if (now - lastPaint > 40 && ui.view === 'defense') { renderDynamic(); updateHud(); lastPaint = now; }
  requestAnimationFrame(frame);
}
render();
requestAnimationFrame(frame);
