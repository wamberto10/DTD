// Balance check: how many times tougher the enemies could get before a careful player loses (the 'margin'),
// for the Faxineiro alone and for real collections (unlucky 10th percentile, median, lucky 90th percentile) at every
// stage. The collections come from 400 simulated players who spend every crystal on recruits and raise every star.
// The player is a bot that spends Qi where it adds the most damage per Qi (placing or upgrading). Takes a few minutes.
//   npm run balanceamento            current numbers
//   npm run balanceamento -- 1.2     the same with enemies 20% tougher (to try a change before making it)
// Method and targets: docs/BALANCEAMENTO.md.
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const extra = Number(process.argv[2] || 1);
const load = f => import(pathToFileURL(path.join(repo, f)).href);
const { GameEngine, pointOnPath } = await load('src/engine.js');
const { HEROES, STAGES } = await load('src/data.js');
const { createProfile, summon, raiseStar, grantVictory } = await load('src/profile.js');
const { withStars } = await load('src/stars.js');
const byId = Object.fromEntries(HEROES.map(h => [h.id, h]));
const eff = h => (h.damage * h.attackSpeed) / h.cost;

let K = 1;
const orig = GameEngine.prototype.startWave;
GameEngine.prototype.startWave = function () { const r = orig.call(this); if (r.ok) for (const e of this._spawnQueue) e.hp = Math.round(e.hp * K * extra); return r; };

function play(stage, squad) {
  const engine = new GameEngine({ stage, heroes: squad });
  const map = engine.map, samples = [];
  for (let d = 0; d < map.pathLength; d += 4) samples.push(pointOnPath(d, map));
  const cover = (pad, range) => samples.filter(p => Math.hypot(p.x - pad.x, p.y - pad.y) <= range).length / samples.length;
  const dps = t => t.damage * t.attackSpeed;
  const decide = () => {
    for (let guard = 0; guard < 40; guard++) {
      const s = engine.state; let best = null, affordable = null;
      const free = map.pads.filter(p => !s.towers.some(t => t.padId === p.id));
      for (const hero of squad) for (const pad of free) {
        const value = dps(hero) * cover(pad, hero.range) / hero.cost;
        const move = { value, cost: hero.cost, act: () => engine.placeTower(hero, pad.id) };
        if (!best || value > best.value) best = move;
        if (hero.cost <= s.qi && (!affordable || value > affordable.value)) affordable = move;
      }
      for (const tower of s.towers) {
        const cost = engine.getNextUpgradeCost(tower); if (cost === null) continue;
        const now = engine.getTowerStats({ hero: tower.hero, level: tower.level }), next = engine.getTowerStats({ hero: tower.hero, level: tower.level + 1 });
        const value = (dps(next) * cover(tower, next.range) - dps(now) * cover(tower, now.range)) / cost;
        const move = { value, cost, act: () => engine.upgradeTower(tower.id) };
        if (!best || value > best.value) best = move;
        if (cost <= s.qi && (!affordable || value > affordable.value)) affordable = move;
      }
      // Save for the best move, unless a good affordable one exists (or there is no tower yet).
      if (best && s.qi < best.cost) best = affordable && (s.towers.length < 2 || affordable.value >= .7 * best.value) ? affordable : null;
      if (!best || !best.act().ok) return;
    }
  };
  decide(); engine.startWave();
  for (let t = 0; (engine.state.status === 'running' || engine.state.status === 'preparing') && t < 900; t += 8 / 30) {
    for (let i = 0; i < 8; i++) engine.update(1 / 30);
    decide();
  }
  return engine.state.status === 'victory';
}
function margin(stage, squad) {
  K = 1; if (!play(stage, squad)) return 0;
  let lo = 1, hi = 16;
  for (let i = 0; i < 8; i++) { const mid = Math.sqrt(lo * hi); K = mid; if (play(stage, squad)) lo = mid; else hi = mid; }
  return lo;
}

// Collections (fixed seed, so runs are comparable): spend every crystal, raise every star, squad = five best by damage per Qi.
let seed = 1;
const rng = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const players = 400, at = {};
for (let p = 0; p < players; p++) {
  let profile = createProfile();
  for (const stage of STAGES) {
    while (profile.crystals >= 100) profile = summon(profile, profile.crystals >= 900 ? 10 : 1, rng).profile;
    for (let changed = true; changed;) { changed = false; for (const id of profile.owned) { const r = raiseStar(profile, id); if (r.ok) { profile = r.profile; changed = true; } } }
    const squad = profile.owned.map(id => withStars(byId[id], profile.stars[id] || 0)).sort((a, b) => eff(b) - eff(a)).slice(0, 5);
    (at[stage.id] ??= []).push({ squad, best: eff(squad[0]) });
    profile = grantVictory(profile, stage.id).profile;
  }
}
console.log(`fator de vida extra: ${extra}`);
console.log('fase |  Faxineiro ★0 | azarado (p10) | mediano | sortudo (p90)');
for (const s of STAGES) {
  const list = at[s.id].sort((a, b) => a.best - b.best);
  const pick = q => list[Math.floor(q * (list.length - 1))].squad;
  const row = [margin(s.id, [withStars(byId.faxineiro, 0)]), margin(s.id, pick(.1)), margin(s.id, pick(.5)), margin(s.id, pick(.9))];
  console.log(`${String(s.id).padStart(4)} | ${row.map(m => m.toFixed(2).padStart(12)).join(' | ')}`);
}
