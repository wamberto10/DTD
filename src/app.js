import { GameEngine, MAP } from './engine.js';
import { HEROES, RARITIES, STAGES, GACHA_COST, GACHA_TEN_COST } from './data.js';
import { loadProfile, saveProfile, summon, grantVictory } from './profile.js';
import { icon, portrait, renderTerrain } from './art.js';
import { renderEnemy, renderProjectile, renderPad } from './pixel-units.js';

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

const heroById = id => HEROES.find(h => h.id === id);
const rarityOf = hero => RARITIES.find(r => r.id === hero.rarity);
const stageInfo = () => STAGES.find(s => s.id === ui.stage) || STAGES[0];
const ownedHeroes = () => profile.owned.map(heroById).filter(Boolean);
const persist = () => { if (!saveProfile(profile)) toast('O navegador não permitiu salvar. Seu progresso vale nesta sessão.'); };
const escapeText = value => String(value).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
engine = makeEngine();

function makeEngine() {
  return new GameEngine({ stage: ui.stage, heroes: ownedHeroes(), onEvent: onEngineEvent });
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
  if (event.type === 'kill') sound('kill');
  if (event.type === 'waveComplete') toast(`Onda ${engine.state.wave} concluída. Prepare sua defesa.`);
  if (event.type === 'victory') {
    const result = grantVictory(profile, ui.stage);
    profile = result.profile; ui.reward = result; persist(); sound('victory');
    setTimeout(() => { render(); showResult(true); }, 80);
  }
  if (event.type === 'defeat') setTimeout(() => { render(); showResult(false); }, 80);
}

function logo() {
  return `<svg viewBox="0 0 44 44" class="brand-mark" aria-hidden="true"><path d="M22 3 41 35H3Z" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="m22 13 10 23H12Z" fill="currentColor"/><path d="M8 40h28M22 1v5" stroke="currentColor"/></svg>`;
}

function render() {
  const navs = [['defense', 'swords', 'Defesa'], ['recruit', 'gem', 'Recrutamento'], ['heroes', 'users', 'Meus heróis'], ['guide', 'book', 'Manual do Dao']];
  app.innerHTML = `<aside class="sidebar">
    <a href="#" class="brand" data-action="navigate" data-view="defense" aria-label="DTD início">${logo()}<span><strong>DTD<span class="brand-dot">.</span></strong><small>DAO TOWER DEFENSE</small></span></a>
    <div class="sidebar-label">SEU CAMINHO</div>
    <nav aria-label="Navegação principal">${navs.map(([id, glyph, text]) => `<button class="nav-item ${ui.view === id ? 'active' : ''}" data-action="navigate" data-view="${id}">${icon(glyph)}<span>${text}</span>${id === 'recruit' && profile.crystals >= GACHA_COST ? '<span class="nav-dot"></span>' : ''}</button>`).join('')}</nav>
    <div class="sidebar-art"><span class="vertical-script">道法自然</span><div class="mountain mountain-one"></div><div class="mountain mountain-two"></div><div class="mountain mountain-three"></div><div class="little-sun"></div></div>
    <div class="journey-card"><span class="eyebrow">A JORNADA DA ASCENSÃO</span><div><span>Reino Mortal</span><span>${profile.completedStages.length}/3</span></div><div class="journey-track"><i style="width:${profile.completedStages.length / 3 * 100}%"></i></div><p>Até o maior mestre deu<br>seu primeiro passo.</p></div>
    <div class="player-card"><div class="player-avatar">${icon('sword', 20)}</div><div><strong>Cultivador</strong><span>Discípulo iniciante</span></div><span class="online-dot" title="Progresso local"></span></div>
  </aside>
  <div class="workspace"><header class="topbar"><div class="breadcrumb">Domínio Mortal ${icon('chevronRight', 13)} <span>${{ defense: 'Campo de batalha', recruit: 'Pavilhão de recrutamento', heroes: 'Coleção de heróis', guide: 'Manual do Dao' }[ui.view]}</span></div><div class="topbar-actions"><div class="crystal-balance" title="Cristais do Dao — usados no recrutamento">${icon('gem', 17)}<strong id="crystal-count">${profile.crystals.toLocaleString('pt-BR')}</strong><span>Cristais do Dao</span></div><span class="topbar-divider"></span><button class="icon-button" data-action="sound" aria-label="${ui.sound ? 'Desativar' : 'Ativar'} som" title="${ui.sound ? 'Desativar' : 'Ativar'} som">${icon(ui.sound ? 'volume' : 'volumeOff', 19)}</button><div class="topbar-avatar">C</div></div></header>
  <main>${ui.view === 'defense' ? renderDefense() : ui.view === 'recruit' ? renderRecruit() : ui.view === 'heroes' ? renderHeroes() : renderGuide()}</main>
  <footer class="page-footer"><span><i></i> PIXEL ART · PROTÓTIPO JOGÁVEL <b>v0.2</b></span><span>Uma grande jornada. Pixel por pixel.</span></footer></div>`;
  lastHud = ''; lastPadMarkup = ''; lastTowerMarkup = '';
  if (ui.view === 'defense') { renderDynamic(); updateHud(true); }
}

function pageHeading(eyebrow, title, description, extra = '') {
  return `<div class="page-heading"><div><div class="eyebrow heading-eyebrow"><span></span>${eyebrow}</div><h1>${title}</h1><p>${description}</p></div>${extra}</div>`;
}

function renderDefense() {
  const stage = stageInfo();
  return `${pageHeading('PROTEJA O SEU LEGADO', 'O caminho começa aqui<span>.</span>', 'Reúna seus cultivadores. Canalize seu Qi. Defenda o caminho do Dao.', `<button class="subtle-button" data-action="stages">${icon('flag', 16)} Selecionar fase ${icon('chevronRight', 14)}</button>`)}
    <div class="battle-layout"><section class="battle-section" aria-label="Campo de batalha">
    <div class="battle-toolbar"><div class="map-title"><span class="map-status-dot"></span><strong>${escapeText(stage.name)}</strong><span class="tiny-tag">${ui.stage === 1 ? 'INICIANTE' : ui.stage === 2 ? 'INTERMEDIÁRIO' : 'AVANÇADO'}</span></div><div class="toolbar-controls"><button class="icon-button" data-action="restart" title="Reiniciar fase" aria-label="Reiniciar fase">${icon('refresh', 16)}</button><span></span><button class="speed-button ${ui.speed === 2 ? 'fast' : ''}" data-action="speed" title="Alternar velocidade">${icon('speed', 16)}<span id="speed-text">${ui.speed}×</span></button></div></div>
    <div class="map-container"><svg class="battle-map" viewBox="0 0 ${MAP.width} ${MAP.height}" role="group" aria-label="Vale com caminho de inimigos e nove posições para torres">${renderTerrain(ui.stage)}<g id="range-layer"></g><g id="pad-layer"></g><g id="tower-layer"></g><g id="enemy-layer"></g><g id="projectile-layer"></g></svg>
    <div class="map-hud"><span class="hud-pill lives">${icon('heart', 16)}<b id="hud-lives">20</b><small>VIDAS</small></span><span class="hud-pill qi">${icon('qi', 17)}<b id="hud-qi">180</b><small>QI</small></span></div>
    <div class="map-level"><span>DOMÍNIO MORTAL · ${String(ui.stage).padStart(2, '0')}</span><strong>${escapeText(stage.name)}</strong><small>Uma longa jornada começa com um pequeno passo.</small></div>
    <div class="map-compass"><span>N</span><svg viewBox="0 0 32 32"><path d="m16 2 5 14-5 14-5-14Z" fill="#dccba0"/><path d="m16 16 14 0-14 5L2 16Z" fill="#b4b28d" opacity=".4"/></svg></div>
    <div id="pause-overlay" class="pause-overlay ${ui.paused ? '' : 'hidden'}"><span>${icon('pause', 28)}</span><h3>A jornada pode esperar.</h3><button class="primary-button" data-action="pause">Continuar partida</button></div>
    <div class="map-hint">${icon('plus', 12)} Selecione um herói e clique em um círculo para posicionar</div></div>
    <div class="battle-status"><div><span class="live-indicator" id="live-indicator"></span><span id="battle-status-text">Preparação</span><span class="status-divider">/</span><span id="kills-text">0 inimigos derrotados</span></div><span>${icon('shield', 14)} Proteja o portal da seita</span></div>
    <section class="squad-section"><div class="section-heading"><div><h2>Seu esquadrão <span>${profile.owned.length}</span></h2><p>Cada cultivador, um novo caminho.</p></div><button class="text-button" data-action="navigate" data-view="heroes">Ver coleção ${icon('arrowRight', 14)}</button></div><div class="squad-grid">${renderSquad()}</div></section>
    </section><aside class="battle-rail"><div id="command-panel">${renderCommandPanel()}</div><div class="wisdom-card"><span class="wisdom-icon">${icon('sparkles', 19)}</span><span class="eyebrow">SABEDORIA DO DAO</span><p>O poder não está apenas em quem você recruta, mas em onde você o posiciona.</p><span class="wisdom-line"></span></div><div class="reward-preview"><span class="reward-icon">${icon('gem', 22)}</span><div><small>RECOMPENSA DA FASE</small><strong>${profile.completedStages.includes(ui.stage) ? '50' : stage.reward} Cristais do Dao</strong></div>${icon('chevronRight', 15)}</div></aside></div>`;
}

function renderSquad() {
  const heroes = ownedHeroes();
  const cards = heroes.map(hero => { const rarity = rarityOf(hero); return `<button class="hero-card ${ui.selectedHero === hero.id ? 'selected' : ''}" style="--hero-color:${rarity.color}" data-action="select-hero" data-id="${hero.id}" aria-pressed="${ui.selectedHero === hero.id}"><div class="hero-portrait">${portrait(hero)}<span class="hero-rarity">${rarity.name}</span>${ui.selectedHero === hero.id ? `<span class="hero-check">${icon('check', 11)}</span>` : ''}</div><div class="hero-card-info"><strong>${escapeText(hero.name)}</strong><span>${icon('qi', 12)} ${hero.cost} Qi <span>NV. 1</span></span></div></button>`; });
  while (cards.length < 5) cards.push(`<button class="hero-card empty-hero" data-action="navigate" data-view="recruit"><div>${icon('lock', 22)}<span>Um novo destino</span></div><span>Recrute um herói ${icon('plus', 12)}</span></button>`);
  return cards.join('');
}

function renderCommandPanel() {
  const s = engine.state;
  const tower = s.towers.find(t => t.id === ui.selectedTower);
  if (tower) {
    const hero = tower.hero; const rarity = rarityOf(hero); const stats = engine.getTowerStats(tower); const cost = engine.getNextUpgradeCost(tower);
    return `<div class="command-card"><div class="rail-heading"><span class="eyebrow">CULTIVADOR EM CAMPO</span><button class="icon-button" data-action="deselect-tower" aria-label="Fechar detalhes">${icon('close', 15)}</button></div><div class="tower-detail"><div class="detail-portrait" style="--hero-color:${rarity.color}">${portrait(hero)}</div><span class="rarity-text" style="color:${rarity.color}">${rarity.name}</span><h2>${hero.name}</h2><span class="level-badge">NÍVEL ${tower.level}</span></div><div class="stat-row"><span>${icon('sword', 15)} Dano</span><b>${Math.round(stats.damage)}</b></div><div class="stat-row"><span>${icon('shield', 15)} Alcance</span><b>${Math.round(stats.range)}</b></div><div class="stat-row"><span>${icon('speed', 15)} Ataques / s</span><b>${Number(stats.attackSpeed).toFixed(1)}</b></div><button class="primary-button upgrade-button" data-action="upgrade" ${!Number.isFinite(cost) || s.qi < cost || s.status === 'victory' || s.status === 'defeat' ? 'disabled' : ''}>${icon('arrowUp', 17)} ${Number.isFinite(cost) ? `Melhorar · ${cost} Qi` : 'Nível máximo'}</button><button class="sell-button" data-action="sell">Dispensar · recuperar ${Math.floor(tower.spent * .7)} Qi</button><p class="rail-note">As melhorias duram apenas nesta fase.</p></div>`;
  }
  const current = Math.min(s.wave + (s.status === 'preparing' ? 1 : 0), s.totalWaves);
  return `<div class="command-card"><div class="rail-heading"><span class="eyebrow">${s.status === 'running' ? 'DEFESA EM ANDAMENTO' : s.status === 'victory' ? 'TERRITÓRIO PROTEGIDO' : s.status === 'defeat' ? 'PORTAL DESTRUÍDO' : 'ANTES DA BATALHA'}</span><span class="small-orbit">${icon('swords', 16)}</span></div><h2>${s.status === 'victory' ? 'O vale está a salvo.' : s.status === 'defeat' ? 'Um novo começo.' : s.status === 'running' ? 'Mantenha a posição.' : s.wave > 0 ? 'Respire. Evolua.' : 'Prepare sua defesa.'}</h2><p class="command-description">${s.status === 'running' ? 'Seus cultivadores atacam automaticamente. Use o Qi para fortalecer suas torres.' : s.status === 'victory' ? 'Seus cristais já estão na coleção. O próximo caminho espera por você.' : s.status === 'defeat' ? 'Reposicione os heróis e tente uma nova estratégia.' : 'Posicione seus heróis ao longo do caminho antes de iniciar a próxima onda.'}</p><div class="wave-info"><span>Onda <b>${current}</b> de ${s.totalWaves}</span><span>${Math.round(s.wave / s.totalWaves * 100)}%</span></div><div class="wave-track">${Array.from({ length: s.totalWaves }, (_, i) => `<span class="${i < s.wave ? 'completed' : ''} ${i === s.wave - 1 && s.status === 'running' ? 'ongoing' : ''}"></span>`).join('')}</div><div class="enemy-preview"><div class="enemy-face">${icon(s.wave === 4 ? 'shield' : 'sword', 23)}</div><div><strong>${s.wave === 4 ? 'Guardião corrompido' : 'Criaturas da névoa'}</strong><span>${s.wave === 4 ? 'O guardião se aproxima' : 'Proteja o vale da invasão'}</span></div></div><button class="primary-button wave-button" data-action="wave">${icon(s.status === 'running' ? (ui.paused ? 'play' : 'pause') : s.status === 'victory' ? 'flag' : s.status === 'defeat' ? 'refresh' : 'play', 16)}<span>${s.status === 'running' ? (ui.paused ? 'Continuar onda' : 'Pausar onda') : s.status === 'victory' ? 'Próxima fase' : s.status === 'defeat' ? 'Tentar novamente' : 'Iniciar onda'}</span>${s.status === 'preparing' ? '<kbd>ESPAÇO</kbd>' : ''}</button><p class="rail-note">${icon('qi', 12)} Elimine inimigos para acumular Qi.</p></div><div class="selected-hero-note">${icon('users', 16)}<span>Selecionado: <strong>${heroById(ui.selectedHero)?.name || 'Faxineiro'}</strong></span></div>`;
}

function renderRecruit() {
  return `${pageHeading('O DESTINO REÚNE OS ESCOLHIDOS', 'Pavilhão de recrutamento<span>.</span>', 'Além das montanhas, novos aliados aguardam o seu chamado.')}
  <section class="summon-banner"><div class="summon-copy"><span class="event-badge">${icon('sparkles', 14)} RECRUTAMENTO PERMANENTE</span><h2>Todo encontro<br>muda o destino.</h2><p>Do primeiro discípulo ao mestre supremo.<br>Invoque cultivadores e descubra o seu potencial.</p><div class="summon-highlights"><span>7 raridades</span><i></i><span>14 cultivadores</span><i></i><span>Uma jornada sem limites</span></div></div><div class="summon-art"><div class="summon-ring ring-one"></div><div class="summon-ring ring-two"></div><span class="summon-rune rune-one">道</span><span class="summon-rune rune-two">气</span><div class="banner-hero banner-hero-left">${portrait(HEROES.find(h => h.rarity === 'legendary'), 'banner')}</div><div class="banner-hero banner-hero-right">${portrait(HEROES.find(h => h.rarity === 'ur'), 'banner')}</div><div class="banner-hero banner-hero-main">${portrait(HEROES.find(h => h.rarity === 'urplus'), 'banner')}</div><span class="summon-particle p1"></span><span class="summon-particle p2"></span><span class="summon-particle p3"></span></div></section>
  <div class="recruit-bottom"><section class="summon-controls"><div><span class="eyebrow">CRISTAIS DO DAO</span><h2>Responda ao chamado.</h2><p>Cada invocação garante um herói. Repetidos entram na sua contagem de cópias.</p></div><div class="summon-buttons"><button class="secondary-button summon-single" data-action="summon" data-count="1" ${profile.crystals < GACHA_COST ? 'disabled' : ''}>Invocar 1 herói <span>${icon('gem', 16)} ${GACHA_COST}</span></button><button class="primary-button summon-ten" data-action="summon" data-count="10" ${profile.crystals < GACHA_TEN_COST ? 'disabled' : ''}>${icon('sparkles', 17)} Invocar 10 heróis <span>${icon('gem', 16)} ${GACHA_TEN_COST}</span><small>10% DE DESCONTO</small></button></div><div class="summon-balance">Seu saldo: <b>${profile.crystals} cristais</b><span>Ganhe mais concluindo fases.</span></div></section><section class="probability-card"><div class="section-heading"><h2>O destino em números</h2>${icon('gem', 17)}</div><p>Chances por invocação · sem garantia acumulada</p><div class="probability-grid">${RARITIES.map(r => `<div><span><i style="background:${r.color}"></i>${r.name}</span><b>${(r.chance * 100).toLocaleString('pt-BR', { maximumFractionDigits: 2 })}%</b></div>`).join('')}</div></section></div>`;
}

function renderHeroes() {
  const filtered = HEROES.filter(hero => ui.filter === 'all' || ui.filter === 'owned' && profile.owned.includes(hero.id) || ui.filter === hero.rarity);
  return `${pageHeading('ALIADOS PARA A ETERNIDADE', 'Cada herói, uma história<span>.</span>', 'Conheça seus cultivadores e os mestres que ainda cruzarão seu caminho.', `<span class="collection-count">${icon('users', 18)}<b>${profile.owned.length}</b> / ${HEROES.length} descobertos</span>`)}<div class="collection-filters"><button data-action="filter" data-filter="all" class="filter-chip ${ui.filter === 'all' ? 'active' : ''}">Todos</button><button data-action="filter" data-filter="owned" class="filter-chip ${ui.filter === 'owned' ? 'active' : ''}">Meus heróis</button>${RARITIES.map(r => `<button class="filter-chip ${ui.filter === r.id ? 'active' : ''}" data-action="filter" data-filter="${r.id}" style="--rarity-color:${r.color}">${r.name}</button>`).join('')}</div><div class="collection-grid">${filtered.map(hero => { const r = rarityOf(hero); const owned = profile.owned.includes(hero.id); return `<button class="collection-card ${owned ? '' : 'unowned'}" style="--hero-color:${r.color}" data-action="hero-detail" data-id="${hero.id}"><div class="collection-portrait">${portrait(hero)}<span class="collection-rarity">${r.name}</span>${owned ? `<span class="copy-badge">×${profile.copies[hero.id] || 1}</span>` : `<span class="undiscovered">${icon('lock', 16)} NÃO RECRUTADO</span>`}</div><div class="collection-info"><small>${escapeText(hero.title)}</small><h3>${escapeText(hero.name)}</h3><div><span>${icon('sword', 13)} ${hero.damage}</span><span>${icon('qi', 13)} ${hero.cost} Qi</span>${icon('arrowRight', 14)}</div></div></button>`; }).join('') || '<div class="empty-state">Nenhum cultivador nesta categoria. Seu próximo aliado pode estar no pavilhão.</div>'}</div>`;
}

function renderGuide() {
  const guides = [ ['flag', '01', 'Escolha seu caminho', 'Comece no Vale do Despertar. Cada território tem cinco ondas e um guardião na última. Concluir uma fase libera a próxima.'], ['users', '02', 'Posicione os cultivadores', 'Selecione um herói do esquadrão e clique em um círculo do mapa. O posicionamento consome Qi. Você pode posicionar o mesmo herói várias vezes.'], ['qi', '03', 'Cultive seu poder', 'Cada inimigo derrotado gera Qi. Clique em uma torre para melhorar seu dano, alcance e velocidade, ou dispensá-la para recuperar 70% do investimento.'], ['gem', '04', 'Encontre novos aliados', 'Vitórias concedem Cristais do Dao. Gaste-os no recrutamento para ganhar heróis de sete raridades. As chances estão disponíveis no pavilhão.'] ];
  return `${pageHeading('CONHECIMENTO É O PRIMEIRO PODER', 'Manual do Dao<span>.</span>', 'O necessário para transformar um simples faxineiro no defensor de uma seita.')}<div class="guide-grid">${guides.map(([glyph, n, title, text]) => `<article class="guide-card"><div class="guide-top"><span>${icon(glyph, 27)}</span><b>${n}</b></div><h2>${title}</h2><p>${text}</p></article>`).join('')}</div><section class="guide-footnote"><div>${icon('shield', 24)}<div><h3>O que fica. O que recomeça.</h3><p>Heróis e Cristais do Dao ficam salvos neste navegador. Qi, torres e melhorias reiniciam em cada fase. Limpar os dados do navegador remove seu progresso.</p></div></div><div class="keyboard-hints"><span><kbd>ESPAÇO</kbd> Iniciar / pausar</span><span><kbd>ESC</kbd> Fechar detalhes</span><span><kbd>2</kbd> Velocidade</span></div></section><div class="inspiration-note">Um universo de cultivo inspirado em Martial Peak, com personagens e arte originais. Protótipo independente, sem vínculo oficial.</div>`;
}

function renderDynamic() {
  if (ui.view !== 'defense') return;
  const s = engine.state;
  const pads = document.querySelector('#pad-layer');
  if (!pads) return;
  const selected = s.towers.find(t => t.id === ui.selectedTower);
  document.querySelector('#range-layer').innerHTML = selected ? `<circle cx="${selected.x}" cy="${selected.y}" r="${engine.getTowerStats(selected).range}" class="tower-range"/>` : '';
  const padMarkup = MAP.pads.map(pad => renderPad(pad, s.towers.find(tower => tower.padId === pad.id), heroById(ui.selectedHero)?.name || 'Faxineiro')).join('');
  if (padMarkup !== lastPadMarkup) { pads.innerHTML = padMarkup; lastPadMarkup = padMarkup; }
  const towerMarkup = s.towers.map(tower => `<g class="map-tower ${tower.id === ui.selectedTower ? 'chosen' : ''}" data-action="select-tower" data-id="${tower.id}" role="button" tabindex="0" aria-label="${tower.hero.name}, nível ${tower.level}"><ellipse cx="${tower.x}" cy="${tower.y + 3}" rx="19" ry="10" fill="${tower.hero.color}" opacity=".4"/><svg x="${tower.x - 26}" y="${tower.y - 55}" width="52" height="61" viewBox="0 0 120 140">${portrait(tower.hero, 'tower').replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')}</svg><rect x="${tower.x - 13}" y="${tower.y + 10}" width="26" height="13" rx="0" fill="#182820" stroke="#c4cba6" stroke-width=".8"/><text x="${tower.x}" y="${tower.y + 20}" text-anchor="middle">${tower.level}</text><rect x="${tower.x - 25}" y="${tower.y - 55}" width="50" height="80" fill="transparent" pointer-events="all"/></g>`).join('');
  if (towerMarkup !== lastTowerMarkup) { document.querySelector('#tower-layer').innerHTML = towerMarkup; lastTowerMarkup = towerMarkup; }
  document.querySelector('#enemy-layer').innerHTML = s.enemies.map(renderEnemy).join('');
  document.querySelector('#projectile-layer').innerHTML = s.projectiles.map(renderProjectile).join('');
}

function updateHud(force = false) {
  if (ui.view !== 'defense') return;
  const s = engine.state;
  const key = `${s.lives}-${s.qi}-${s.wave}-${s.status}-${s.kills}-${ui.selectedTower}-${ui.paused}`;
  if (key === lastHud && !force) return;
  lastHud = key;
  document.querySelector('#hud-lives').textContent = s.lives;
  document.querySelector('#hud-qi').textContent = Math.floor(s.qi);
  document.querySelector('#kills-text').textContent = `${s.kills} inimigos derrotados`;
  document.querySelector('#battle-status-text').textContent = s.status === 'running' ? ui.paused ? 'Pausado' : `Onda ${s.wave} em andamento` : s.status === 'victory' ? 'Vitória' : s.status === 'defeat' ? 'Derrota' : s.wave ? 'Entre ondas' : 'Preparação';
  document.querySelector('#live-indicator').classList.toggle('running', s.status === 'running' && !ui.paused);
  document.querySelector('#pause-overlay').classList.toggle('hidden', !ui.paused);
  document.querySelector('#command-panel').innerHTML = renderCommandPanel();
}

function resetBattle(stage = ui.stage) {
  ui.stage = stage; ui.selectedTower = null; ui.paused = false; ui.reward = null;
  engine = makeEngine(); engine.setSpeed(ui.speed); render();
}

function showModal(content, className = '') {
  modalRoot.innerHTML = `<div class="modal-backdrop"><section class="modal ${className}" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button class="modal-close icon-button" data-action="close-modal" aria-label="Fechar">${icon('close', 20)}</button>${content}</section></div>`;
  document.body.classList.add('modal-open');
  setTimeout(() => modalRoot.querySelector('button:not(.modal-close)')?.focus(), 50);
}

function closeModal() { modalRoot.innerHTML = ''; document.body.classList.remove('modal-open'); }

function showStages() {
  showModal(`<span class="eyebrow">DOMÍNIO MORTAL</span><h2 id="modal-title">Escolha seu caminho.</h2><p class="modal-description">Cinco ondas. Um território a proteger.</p><div class="stage-list">${STAGES.map(stage => { const unlocked = stage.id <= profile.unlockedStage; const completed = profile.completedStages.includes(stage.id); return `<button class="stage-option ${ui.stage === stage.id ? 'current' : ''}" data-action="choose-stage" data-id="${stage.id}" ${unlocked ? '' : 'disabled'}><span class="stage-number">${unlocked ? String(stage.id).padStart(2, '0') : icon('lock', 20)}</span><span><strong>${stage.name}</strong><small>${stage.difficulty} · ${completed ? 'Concluída' : stage.id === 1 ? 'Sua primeira jornada' : 'Novos desafios'}</small></span><span class="stage-reward">${completed ? icon('check', 19) : `${icon('gem', 14)} ${stage.reward}`}</span></button>`; }).join('')}</div><p class="rail-note">Trocar de fase reinicia a partida atual.</p>`);
}

function showResult(victory) {
  showModal(`<div class="result-icon ${victory ? '' : 'defeat'}">${icon(victory ? 'trophy' : 'shield', 38)}</div><span class="eyebrow">${victory ? 'O DAO RECONHECE SUA FORÇA' : 'TODA QUEDA ENSINA'}</span><h2 id="modal-title">${victory ? 'O vale está a salvo.' : 'Seu caminho continua.'}</h2><p class="modal-description">${victory ? `${stageInfo().name} foi protegido. Seus cultivadores conquistaram uma nova vitória.` : 'Os invasores alcançaram o portal. Repense as posições e cultive seu poder entre as ondas.'}</p><div class="result-stats"><span><b>${engine.state.kills}</b>inimigos derrotados</span><span><b>${engine.state.wave}/${engine.state.totalWaves}</b>ondas enfrentadas</span></div>${victory ? `<div class="victory-reward">${icon('gem', 26)}<div><b>+${ui.reward?.reward || 0} Cristais do Dao</b><span>${ui.reward?.firstClear ? 'Recompensa de primeira conclusão' : 'Recompensa de nova conclusão'}</span></div></div><button class="primary-button" data-action="result-next">${ui.stage < STAGES.length ? 'Seguir para a próxima fase' : 'Escolher uma nova jornada'} ${icon('arrowRight', 16)}</button><button class="text-button" data-action="result-recruit">Visitar o pavilhão de recrutamento</button>` : `<button class="primary-button" data-action="retry">${icon('refresh', 16)} Tentar novamente</button>`}`, 'result-modal');
}

function showHero(id) {
  const hero = heroById(id); if (!hero) return;
  const r = rarityOf(hero); const owned = profile.owned.includes(id);
  showModal(`<div class="hero-detail-art" style="--hero-color:${r.color}">${portrait(hero)}</div><span class="rarity-text" style="color:${r.color}">${r.name} · ${hero.title}</span><h2 id="modal-title">${hero.name}</h2><p class="modal-description">${hero.description}</p><div class="hero-detail-stats"><span>${icon('sword', 18)}<b>${hero.damage}</b>Dano</span><span>${icon('shield', 18)}<b>${hero.range}</b>Alcance</span><span>${icon('speed', 18)}<b>${hero.attackSpeed.toFixed(1)}</b>Ataques/s</span><span>${icon('qi', 18)}<b>${hero.cost}</b>Qi inicial</span></div><button class="primary-button" data-action="${owned ? 'use-hero' : 'result-recruit'}" data-id="${hero.id}">${owned ? 'Selecionar para a defesa' : 'Visitar recrutamento'} ${icon('arrowRight', 16)}</button>`, 'hero-modal');
}

function doSummon(count) {
  const result = summon(profile, count);
  if (!result.ok) return toast(result.reason || 'Cristais insuficientes. Conclua fases para ganhar mais.');
  const before = new Set(profile.owned);
  profile = result.profile; engine.heroes = ownedHeroes(); persist(); sound('victory'); render();
  showModal(`<span class="eyebrow">O DESTINO FOI TRAÇADO</span><h2 id="modal-title">${count === 1 ? 'Um novo encontro.' : 'Novos caminhos se abrem.'}</h2><p class="modal-description">${count === 1 ? 'Um cultivador respondeu ao seu chamado.' : 'Dez cultivadores responderam ao seu chamado.'}</p><div class="summon-results ${count > 1 ? 'many' : ''}">${result.heroes.map((hero, i) => { const r = rarityOf(hero); const fresh = !before.has(hero.id); before.add(hero.id); return `<div class="summon-result-card" style="--hero-color:${r.color};--delay:${i * 70}ms"><div>${portrait(hero)}<span class="result-rarity">${r.name}</span><span class="new-badge">${fresh ? 'NOVO' : '+1 CÓPIA'}</span></div><h3>${hero.name}</h3><p>${hero.title}</p></div>`; }).join('')}</div><button class="primary-button" data-action="close-modal">Receber cultivadores ${icon('check', 17)}</button><span class="summon-result-note">Heróis adicionados à sua coleção.</span>`, `summon-modal ${count > 1 ? 'wide-modal' : ''}`);
}

function activate(action, el) {
  sound();
  if (action === 'navigate') { const next = el.dataset.view; if (ui.view === 'defense' && next !== 'defense' && engine.state.status === 'running') ui.paused = true; ui.view = next; render(); }
  if (action === 'sound') { ui.sound = !ui.sound; render(); if (ui.sound) sound(); }
  if (action === 'stages') showStages();
  if (action === 'choose-stage') { closeModal(); ui.view = 'defense'; resetBattle(Number(el.dataset.id)); }
  if (action === 'select-hero') { ui.selectedHero = el.dataset.id; ui.selectedTower = null; render(); }
  if (action === 'select-tower') { ui.selectedTower = el.dataset.id; const tower = engine.state.towers.find(t => String(t.id) === el.dataset.id); ui.selectedTower = tower?.id ?? el.dataset.id; updateHud(true); renderDynamic(); }
  if (action === 'deselect-tower') { ui.selectedTower = null; updateHud(true); renderDynamic(); }
  if (action === 'place') { const result = engine.placeTower(heroById(ui.selectedHero), el.dataset.id); if (!result.ok) toast(result.reason || 'Não foi possível posicionar o herói.'); else { sound(); ui.selectedTower = null; } updateHud(true); renderDynamic(); }
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
  if (action === 'pause') { ui.paused = !ui.paused; updateHud(true); }
  if (action === 'restart') showModal(`<span class="eyebrow">UM NOVO COMEÇO</span><h2 id="modal-title">Recomeçar esta fase?</h2><p class="modal-description">As torres e o Qi desta partida serão reiniciados. Sua coleção e seus cristais continuam com você.</p><button class="primary-button" data-action="retry">${icon('refresh', 16)} Recomeçar fase</button><button class="text-button" data-action="close-modal">Continuar jogando</button>`);
  if (action === 'retry') { closeModal(); resetBattle(); }
  if (action === 'close-modal') closeModal();
  if (action === 'result-next') { closeModal(); if (ui.stage < STAGES.length) resetBattle(ui.stage + 1); else showStages(); }
  if (action === 'result-recruit') { closeModal(); ui.view = 'recruit'; if (engine.state.status === 'running') ui.paused = true; render(); }
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
  if (event.key === 'Enter' && event.target.matches('[role="button"][data-action]')) activate(event.target.dataset.action, event.target);
});
document.addEventListener('visibilitychange', () => { if (document.hidden && engine.state.status === 'running') { ui.paused = true; updateHud(true); } });

function frame(now) {
  const dt = Math.min((now - lastTime) / 1000, 0.1); lastTime = now;
  if (ui.view === 'defense' && !ui.paused && !modalRoot.children.length) engine.update(dt);
  if (now - lastPaint > 40 && ui.view === 'defense') { renderDynamic(); updateHud(); lastPaint = now; }
  requestAnimationFrame(frame);
}
render();
requestAnimationFrame(frame);
