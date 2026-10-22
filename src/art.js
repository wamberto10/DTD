const ICONS = {
  swords: '<path d="m4 3 12 12m-1-4 4 4-4 4m-2-2-3 3m-6-3 3 3m-3-6 4-4M17 3l4 4-9 9-4-4zM3 3l4 1 13 13-3 3L4 7z"/>',
  sword: '<path d="m4 20 4-4m-3-3 6 6M8 13 17 4l4-1-1 4-9 9z"/>',
  gem: '<path d="m3 8 4-5h10l4 5-9 13zM3 8h18M7 3l5 18 5-18"/>',
  users: '<circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2m1-15a3 3 0 0 1 0 6m2 3a5 5 0 0 1 3 4v2"/>',
  book: '<path d="M12 5v16m0-16C8 2 4 3 2 4v15c3-2 7-1 10 2 3-3 7-4 10-2V4c-2-1-6-2-10 1z"/>',
  chevronRight: '<path d="m9 5 7 7-7 7"/>', chevronLeft: '<path d="m15 5-7 7 7 7"/>',
  play: '<path d="m8 4 13 8-13 8z"/>', pause: '<path d="M8 5v14M16 5v14"/>',
  heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z"/>',
  qi: '<path d="M13 2c-2 5 5 5 5 11a6 6 0 0 1-12 0c0-3 2-5 4-7-1 4 2 5 3 3 1-2-1-4 0-7z"/><path d="M13 13c-2 2-3 3-2 5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>', close: '<path d="m6 6 12 12M6 18 18 6"/>',
  speed: '<path d="m3 5 8 7-8 7zm10 0 8 7-8 7z"/>',
  volume: '<path d="m11 4-5 4H2v8h4l5 4zM15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>',
  volumeOff: '<path d="m11 4-5 4H2v8h4l5 4zM16 9l6 6m0-6-6 6"/>',
  lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V6a4 4 0 0 1 8 0v4m-4 5v2"/>',
  check: '<path d="m5 12 4 4L20 5"/>',
  refresh: '<path d="M20 7v5h-5M4 17v-5h5M6 6a8 8 0 0 1 14 6M4 12a8 8 0 0 0 14 6"/>',
  arrowUp: '<path d="M12 20V4m-7 7 7-7 7 7"/>',
  arrowRight: '<path d="M4 12h16m-7-7 7 7-7 7"/>',
  coin: '<circle cx="12" cy="12" r="9"/><path d="m12 7 4 5-4 5-4-5z"/>',
  sparkles: '<path d="m12 3 2.6 6.4L21 12l-6.4 2.6L12 21l-2.6-6.4L3 12l6.4-2.6zM20 2v4m-2-2h4M3 18v4m-2-2h4"/>',
  flag: '<path d="M5 22V3m0 1c5-5 9 5 14 0v11c-5 5-9-5-14 0"/>',
  shield: '<path d="m12 2 9 4v6c0 5-6 8-9 10-3-2-9-5-9-10V6zM8 12l3 3 5-6"/>',
  trophy: '<path d="M8 3h8v7a4 4 0 0 1-8 0zM8 5H4v3a4 4 0 0 0 4 4m8-7h4v3a4 4 0 0 1-4 4m-4 2v7m-5 0h10"/>',
  settings: '<path d="m9 3-1 3-3 1-2 3 2 2-1 3 3 3 3-1 2 2 3-2 1-3 3-1 2-3-2-2 1-3-3-3-3 1-2-2z"/><circle cx="12" cy="11" r="3"/>',
  home: '<path d="m2 11 10-9 10 9M5 9v12h14V9M9 21v-8h6v8"/>',
  star: '<path d="m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/>',
};

export function icon(name, size = 20) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ICONS.sparkles}</svg>`;
}

const escape = value => String(value ?? '').replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));

export function portrait(hero, variant = 'card') {
  const color = escape(hero.color || '#83ac98');
  const id = escape(`${hero.id || 'cultivator'}-${variant}`.replace(/[^a-z0-9-]/gi, ''));
  const starter = hero.id === 'faxineiro';
  const element = hero.element || 'physical';
  const seed = [...String(hero.id || '')].reduce((value, char) => value + char.charCodeAt(0), 0);
  const feminine = !starter && seed % 3 !== 0;
  const rare = ['legendary', 'ur', 'urplus'].includes(hero.rarity);
  const hair = element === 'ice' ? '#d3e7e3' : element === 'void' ? '#ddd3ee' : '#192b30';
  const aura = element === 'fire' ? '<path d="M12 115Q-4 86 20 54Q17 82 32 87Q30 54 45 34Q43 69 60 73Q85 44 84 24Q113 56 95 77Q121 73 109 112Z"/>' : element === 'ice' ? '<path d="m10 86 15-54 12 31 20-45 13 33 27-22-6 51 22 27H8Z"/>' : element === 'lightning' ? '<path d="m28 16-9 45 18-7-10 37 22-16-6 42 37-53-19 9 29-43-26 13 9-30-26 27 2-28z"/>' : '<ellipse cx="60" cy="75" rx="47" ry="48"/>';
  const weapon = starter ? `<g transform="rotate(18 88 82)"><path d="M88 20v87" stroke="#ae8755" stroke-width="4"/><path d="m81 94-6 34q14 6 27 0l-7-34z" fill="#baa572"/><path d="m82 102-3 23m7-22-1 26m5-26 2 25m1-25 5 23" stroke="#716548" stroke-width="1.1"/><path d="M81 99h15m-16 4h17" stroke="#d0b983" stroke-width="2"/></g>` : element === 'nature' ? '<g stroke="#92c7a1" fill="#a7d8b5"><path d="M92 29v91" stroke-width="3"/><path d="M92 43Q73 27 86 20q9 5 6 23M93 43q17-19 21-5-10 12-21 5"/></g>' : `<g transform="rotate(18 92 70)"><path d="m89 18 5-9 4 9-2 74h-6z" fill="${element === 'fire' ? '#f4d395' : '#c9e2e0'}"/><path d="M84 89h18" stroke="#c7aa76" stroke-width="3"/><path d="M93 91v23" stroke="#384f50" stroke-width="5"/><path d="M93 113v8" stroke="#c7aa76" stroke-width="2"/></g>`;
  return `<svg class="hero-portrait" viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><radialGradient id="aura-${id}"><stop stop-color="${color}" stop-opacity=".28"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient><linearGradient id="robe-${id}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${color}"/><stop offset="1" stop-color="#203b3e"/></linearGradient><linearGradient id="back-${id}" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#29383b"/><stop offset="1" stop-color="#111d23"/></linearGradient></defs><rect width="120" height="140" fill="url(#back-${id})"/><circle cx="60" cy="70" r="65" fill="url(#aura-${id})"/><g fill="${color}" opacity="${rare ? '.23' : '.11'}">${aura}</g><path d="M0 127 23 94 39 102 57 73 81 104l15-13 24 36v13H0Z" fill="#15272b" opacity=".8"/><circle cx="59" cy="51" r="33" fill="none" stroke="${color}" stroke-opacity=".17"/><circle cx="59" cy="51" r="28" fill="none" stroke="${color}" stroke-opacity=".1"/>${weapon}<path d="m40 73-14 21-10 42h37l7-30 10 30h35L92 96 77 73z" fill="url(#robe-${id})"/><path d="m43 74 16 19-14 39H27l12-38-13 8z" fill="#d7dfcc" fill-opacity=".24"/><path d="m77 75-16 18 13 44h15L75 94l15 12z" fill="#0e2931" fill-opacity=".48"/><path d="m45 74 15 19 16-19-6 24H50z" fill="#e5dfc4"/><path d="M46 99h29l3 8-35 1z" fill="${starter ? '#7c664c' : '#b49a67'}"/><path d="m58 106-4 31h8l4-31" fill="#d2bc84" opacity=".65"/><path d="M30 94 20 114l8 6 15-20m38-6 15 19-7 7-17-19" fill="url(#robe-${id})"/><ellipse cx="27" cy="118" rx="5" ry="6" fill="#d6b390"/><ellipse cx="92" cy="116" rx="5" ry="6" fill="#d6b390"/><path d="M39 50q-4-28 21-30 23 2 22 28l-6 34-11-10-15 2-13 12z" fill="${hair}"/><path d="M46 45q1-20 15-19 16 1 17 20l-5 19-12 11-12-11z" fill="#dabb99"/><path d="M48 61q10 10 25 0l-5 9-7 5-9-7z" fill="#b6917c" opacity=".5"/><path d="M44 44q8-5 9-15 15 13 25 13l2 9-5-4-5-11q-2 11-8 14l-2-12-9 11-4 8z" fill="${hair}"/><path d="M51 53h6m9 0h6" stroke="#3a3737" stroke-width="1.4" stroke-linecap="round"/><path d="m60 56-1 6h3m-5 5q4 2 8 0" fill="none" stroke="#a47c6b" stroke-width="1"/>${starter || !feminine ? `<ellipse cx="60" cy="20" rx="10" ry="7" fill="${hair}"/><path d="M52 21h17" stroke="#b99b69" stroke-width="2"/>` : `<path d="M39 39q-13 29 2 63l4-45m34-18q17 28-1 65l-3-48" fill="${hair}"/><path d="M38 33h43" stroke="#bcae7d" stroke-width="2"/><path d="m44 29 4-5 4 5m16 0 4-5 4 5" fill="${color}"/>`}${rare ? '<path d="m59 28 3 4-3 4-3-4z" fill="#e9d59f"/>' : ''}<g fill="${color}" opacity=".6"><circle cx="20" cy="43" r="1.5"/><circle cx="99" cy="64" r="1"/><circle cx="29" cy="77" r="1"/><circle cx="83" cy="20" r="1.3"/></g><path d="M0 139h120" stroke="${color}" stroke-opacity=".5"/></svg>`;
}

export function renderTerrain() {
  const path = 'M-30 170H205V410H475V235H735V445H1030';
  const points = [[0,170],[205,170],[205,410],[475,410],[475,235],[735,235],[735,445],[1000,445]];
  const pads = [[135,270],[300,260],[345,495],[385,325],[565,325],[615,150],[650,425],[830,325],[875,520]];
  const distanceToPath = (x,y) => Math.min(...points.slice(1).map((point,i) => {
    const previous=points[i],dx=point[0]-previous[0],dy=point[1]-previous[1];
    const t=Math.max(0,Math.min(1,((x-previous[0])*dx+(y-previous[1])*dy)/(dx*dx+dy*dy)));
    return Math.hypot(x-previous[0]-dx*t,y-previous[1]-dy*t);
  }));
  let trees = '', grass = '', stones = '';
  let seed = 71839;
  const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  for(let i=0;i<250;i++) {
    const x=rand()*1000,y=rand()*600;
    if(distanceToPath(x,y)<34 || pads.some(p=>Math.hypot(p[0]-x,p[1]-y)<52))continue;
    if(i<78 && !(x>760&&y<160) && !(x<145&&y>350&&y<510)) {
      const s=.55+rand()*.6;
      const gold=rand()>.83;
      trees+=`<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s.toFixed(2)})"><ellipse cy="17" rx="23" ry="10" fill="#152d2b" opacity=".55"/><path d="M0 0v19" stroke="#5a5b3a" stroke-width="5"/><path d="m0 9-10-12M1 4l8-12" stroke="#566044" stroke-width="2"/><path d="M-26 0q-11-14 4-23-2-17 16-19 13-15 27 3 20-1 19 18 14 17-3 25-9 13-25 7-21 9-38-11z" fill="${gold?'#8d8854':'#355e4b'}"/><path d="M-23-13q-3-14 12-14 2-15 16-11 15 0 16 11 17 2 13 15-10 7-22 0-17 10-35-1z" fill="${gold?'#b1a064':'#4c7657'}"/><path d="M-11-28q9-13 22-3m-29 17q8-5 16-2m10 5 9-4" fill="none" stroke="${gold?'#d3be7c':'#709266'}" stroke-width="2" stroke-linecap="round" opacity=".6"/></g>`;
    } else {
      const c=rand()>.5?'#739067':'#426a54';
      grass+=`<path d="m${x.toFixed(1)} ${y.toFixed(1)}-3-5m3 5 1-7m-1 7 4-4" fill="none" stroke="${c}" stroke-width="1.2" opacity=".4"/>`;
    }
  }
  for(let i=0;i<85;i++) {
    const x=rand()*1000,y=rand()*600;
    if(distanceToPath(x,y)>18) continue;
    stones+=`<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${(2+rand()*5).toFixed(1)}" ry="2" fill="${rand()>.5?'#b3a57f':'#746f56'}" opacity=".45"/>`;
  }
  return `<defs><linearGradient id="land" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#3c5943"/><stop offset=".55" stop-color="#4a6348"/><stop offset="1" stop-color="#354e3e"/></linearGradient><radialGradient id="land-light"><stop stop-color="#8f9d68" stop-opacity=".19"/><stop offset="1" stop-color="#729269" stop-opacity="0"/></radialGradient><linearGradient id="water" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#507f78"/><stop offset="1" stop-color="#315756"/></linearGradient><linearGradient id="cliff" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#899183"/><stop offset="1" stop-color="#3b5148"/></linearGradient><pattern id="ground-grain" width="48" height="48" patternUnits="userSpaceOnUse"><circle cx="3" cy="7" r="1" fill="#b5b98e" opacity=".1"/><circle cx="26" cy="32" r="1.5" fill="#152d24" opacity=".11"/><path d="m14 19 4-1m20 25 3-1" stroke="#1e3c2e" stroke-opacity=".13"/></pattern></defs><rect width="1000" height="600" fill="url(#land)"/><rect width="1000" height="600" fill="url(#ground-grain)"/><ellipse cx="490" cy="265" rx="450" ry="340" fill="url(#land-light)"/><path d="M0 585q140-70 270-31t287-3 443 16v33H0z" fill="#2a473a" opacity=".5"/><path d="M0 60q120-65 260-31t280-2 460 10" fill="none" stroke="#749169" stroke-width="40" opacity=".08"/><g opacity=".7"><path d="m790 96 30-48 25 18 31-44 43 38 27-9 54 48v62l-61-6-25 12-59-21-47 12-47-31z" fill="#304b40"/><path d="m785 93 33-50 29 19 29-45 44 39 27-10 53 43v46l-58-10-29 16-60-24-51 15z" fill="url(#cliff)"/><path d="m818 43 8 45-35 9m56-35 17 41-14 14m26-100 6 63 20 24m18-48-8 32 35 20m0-62 8 43 31 14" fill="none" stroke="#9da28d" stroke-opacity=".34" stroke-width="2"/><path d="m875 18-9 23 11-3 14 14z" fill="#b5b9a0" opacity=".55"/></g><path d="M35 397q29-39 75-17t21 83q-33 36-80 7t-16-73z" fill="#263f36"/><path d="M38 392q29-28 66-10t21 63q-30 32-69 6t-18-59z" fill="url(#water)"/><path d="M47 397q31-13 48-4m-37 40q23 9 41-5m-49-16 19 3m24-6h19" fill="none" stroke="#8eb5a3" stroke-opacity=".35" stroke-width="2"/><g fill="#718071"><path d="m24 407 10-13 10 8-4 16-15 1z"/><path d="m101 458 11-13 12 5 1 15-17 4z"/></g>${grass}<path d="${path}" fill="none" stroke="#263c2d" stroke-width="65" stroke-linejoin="round" opacity=".6"/><path d="${path}" fill="none" stroke="#6b7150" stroke-width="57" stroke-linejoin="round"/><path d="${path}" fill="none" stroke="#958d69" stroke-width="47" stroke-linejoin="round"/><path d="${path}" fill="none" stroke="#a49b76" stroke-width="38" stroke-linejoin="round"/><path d="${path}" fill="none" stroke="#b0a57c" stroke-width="23" stroke-linejoin="round" opacity=".35"/>${stones}<g fill="none" stroke="#6d7155" stroke-opacity=".5" stroke-width="1"><path d="m75 154-6 31m41-31 6 29m75 51 28 5m-29 71 28-6m12 90-8 30m66-30 5 30m78-30-7 30m94-72 29-5m-29-63 29 5m86-75 6 31m76-31-6 31m95 63 29-5m-29 81 29 4m60 43 8 30m72-30-3 30"/></g><g opacity=".7"><path d="M449 218h52v36h-52z" fill="#747b62"/><path d="M449 223h52m-52 7h52m-52 7h52m-52 7h52m-52 7h52" stroke="#b5b28c" stroke-width="2"/><path d="M448 214v44m54-44v44" stroke="#515f4e" stroke-width="5"/></g>${trees}<g transform="translate(953 385)"><ellipse cx="10" cy="62" rx="52" ry="19" fill="#18322b" opacity=".5"/><path d="M-27 11h68v48h-68z" fill="#aaa082"/><path d="M-31 50h76v10h-76zM-35 61h84v6h-84z" fill="#777d65"/><path d="M-24 16h62v35h-62z" fill="#615d4a"/><path d="M-18 18h12v33h-12m29-33h12v33H11" fill="#c4ad7c"/><path d="M-36 11q32-7 43-32 11 25 43 32l-3 7H-33z" fill="#354b47"/><path d="M-37 11Q-5 7 7-18 19 7 51 11" fill="none" stroke="#789080" stroke-width="3"/><path d="M-22-10q22-8 29-23 7 15 29 23l-2 5h-54z" fill="#2c4440"/><path d="m-22-10 29-23 29 23" fill="none" stroke="#8c9c7f" stroke-width="2"/><path d="M4-33h6v-7H4z" fill="#c7ac76"/><path d="M-13 27h13v16h-13m28-16h13v16H15" fill="#d9ba6b" opacity=".7"/><path d="M1 33h12v20H1z" fill="#273d35"/></g><g transform="translate(13 146)"><path d="M0 47V-7m43 54V-7" stroke="#5b5843" stroke-width="5"/><path d="M-9-5h61l-6-7H-4z" fill="#9b8055"/><path d="M2-15h40" stroke="#cfb278" stroke-width="3"/><path d="M7 0h27v24L21 31 7 24z" fill="#8c6044"/><path d="M15 7h11m-6-2v15m-7-5h15" stroke="#d6bc81" stroke-width="1.7"/></g><g opacity=".6" fill="#d8d3a1"><circle cx="344" cy="124" r="2"/><circle cx="377" cy="145" r="1.4"/><circle cx="594" cy="502" r="2"/><circle cx="807" cy="217" r="1.7"/><circle cx="66" cy="325" r="1.2"/></g><rect width="1000" height="600" fill="none" stroke="#172f29" stroke-width="3"/>`;
}
