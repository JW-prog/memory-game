import './styles/style.scss';

type Player = 0 | 1;
type Theme = 'coding' | 'gaming';
type BoardSize = 16 | 24 | 36;
interface Card { value: string; matched: boolean }
interface Motif { name: string; file?: string }
interface ThemeConfig { name: string; description: string; back: string; motifs: Motif[] }

function asset(file: string): string {
  return `${import.meta.env.BASE_URL}assets/${encodeURIComponent(file)}`;
}

// Replace the numbered placeholders with individual image exports when available.
function placeholders(): Motif[] {
  return Array.from({ length: 16 }, (_, index) => ({ name: `Motiv ${index + 3}` }));
}

const themes: Record<Theme, ThemeConfig> = {
  coding: {
    name: 'Code vibes', description: 'Türkis, Code und kreative Köpfe.',
    back: 'Code vibes card 1.png',
    motifs: [{ name: 'Git', file: 'Code vibes card 1.png' }, { name: 'TypeScript', file: 'Code vibes card 2.png' }, ...placeholders()],
  },
  gaming: {
    name: 'Gaming', description: 'Pink, Controller und ein neuer Highscore.',
    back: 'Game card 2.png',
    motifs: [{ name: 'Quadrat', file: 'Game card 2.png' }, { name: 'Dreieck', file: 'Game card 3.png' }, ...placeholders()],
  },
};

function cardImage(file: string, side: 'front' | 'back'): string {
  return `<span class="image-window ${theme} ${side}"><img src="${asset(file)}" alt="" draggable="false"></span>`;
}

function motifFace(value: string): string {
  const motif = themes[theme].motifs.find(item => item.name === value);
  return motif?.file ? cardImage(motif.file, 'front') : `<span class="placeholder-motif"><strong>${value.replace('Motiv ', '')}</strong><small>Platzhalter</small></span>`;
}
const root = document.querySelector<HTMLDivElement>('#app')!;
let theme: Theme = 'coding';
let size: BoardSize = 16;
let firstPlayer: Player = 0;
let player: Player = 0;
let scores = [0, 0];
let cards: Card[] = [];
let opened: number[] = [];
let locked = false;
let round = 0;
let moves = 0;

function shell(content: string, page: 'home' | 'settings' | 'game' | 'result' | 'winner' = 'settings'): void {
  document.body.dataset.theme = theme;
  document.body.dataset.page = page;
  root.innerHTML = `<header class="brand"><a href="#" aria-label="Memory Startseite">memory ✳</a><span>WENIGER SCROLLEN. MEHR SPIELEN.</span></header><main>${content}</main><footer>Ein Spiel. Zwei Köpfe. Viele gute Momente.<span>MADE FOR PLAY ✳</span></footer>`;
  root.querySelector('.brand a')?.addEventListener('click', (event) => { event.preventDefault(); home(); focusHeading(); });
}
function focusHeading(): void {
  const heading = root.querySelector<HTMLElement>('h1');
  heading?.setAttribute('tabindex', '-1');
  heading?.focus();
}
function home(): void {
  round++;
  shell(`<section class="home-screen"><div class="home-content"><p class="home-kicker"><img src="${asset('It’s play time.png')}" alt="It's play time."></p><h1><img src="${asset('Ready to play_.svg')}" alt="Ready to play?"></h1><button class="primary image-button" id="start"><img src="${asset('Primary button (1).png')}" alt="Play — zu den Einstellungen"></button></div><img class="controller home-controller" src="${asset('stadia_controller.png')}" alt="Spielcontroller"></section>`, 'home');
  document.querySelector('#start')?.addEventListener('click', () => { settings(); focusHeading(); });
}
function settings(): void {
  round++;
  shell(`<section class="settings"><h1>Settings</h1><div class="settings-layout"><div class="settings-options"><fieldset><legend class="theme-legend"><img src="${asset('Frame 566.png')}" alt="Game themes"></legend>${(Object.keys(themes) as Theme[]).map(value => `<label class="radio-option"><input type="radio" name="theme" value="${value}" ${theme === value ? 'checked' : ''}>${themes[value].name} theme</label>`).join('')}<label class="radio-option unavailable"><input type="radio" name="theme" disabled>DA Projects theme <small>folgt</small></label><label class="radio-option unavailable"><input type="radio" name="theme" disabled>Foods theme <small>folgt</small></label></fieldset><fieldset><legend><span class="player-icon">?</span> Choose player</legend>${([0, 1] as const).map(value => `<label class="radio-option"><input type="radio" name="player" value="${value}" ${firstPlayer === value ? 'checked' : ''}>${value === 0 ? 'Blue' : 'Orange'}</label>`).join('')}</fieldset><fieldset><legend><span class="size-icon">?</span> Board size</legend>${([16, 24, 36] as const).map(value => `<label class="radio-option"><input type="radio" name="size" value="${value}" ${size === value ? 'checked' : ''}>${value} cards <small>${value === 16 ? '4 ? 4' : value === 24 ? '4 ? 6' : '6 ? 6'}</small></label>`).join('')}</fieldset><button class="text-button" id="back">? Home</button></div><div class="settings-visual"><div class="settings-preview" aria-label="Vorschau des gew?hlten Themes"><div class="preview-bar"><span class="mini-scores">? Blue 0&nbsp; ? Orange 0</span><span>Current player: <b class="blue-text">?</b></span><span>? Exit game</span></div><div class="preview-cards"><div class="preview-back">${cardImage(themes[theme].back, 'back')}</div><div class="preview-front">${motifFace(themes[theme].motifs[0].name)}</div></div></div><div class="settings-summary"><span>Game theme<strong>${themes[theme].name}</strong></span><i></i><span>Player<strong>${firstPlayer === 0 ? 'Blue' : 'Orange'}</strong></span><i></i><span>Board size<strong>${size} cards</strong></span><button class="primary" id="play">? Start</button></div><p class="asset-note">Weitere Kartenbilder folgen. Fehlende Motive sind vorerst nummerierte Platzhalter.</p></div></div></section>`, 'settings');
  root.querySelectorAll<HTMLInputElement>('input[name="theme"]').forEach(input => input.addEventListener('change', () => { theme = input.value as Theme; settings(); restoreOption('theme', input.value); }));
  root.querySelectorAll<HTMLInputElement>('input[name="player"]').forEach(input => input.addEventListener('change', () => { firstPlayer = Number(input.value) as Player; settings(); restoreOption('player', input.value); }));
  root.querySelectorAll<HTMLInputElement>('input[name="size"]').forEach(input => input.addEventListener('change', () => { size = Number(input.value) as BoardSize; settings(); restoreOption('size', input.value); }));
  document.querySelector('#back')?.addEventListener('click', () => { home(); focusHeading(); });
  document.querySelector('#play')?.addEventListener('click', startGame);
}
function restoreOption(name: string, value: string): void {
  root.querySelector<HTMLInputElement>(`input[name="${name}"][value="${value}"]`)?.focus();
}

function startGame(): void {
  round++;
  scores = [0, 0]; moves = 0; player = firstPlayer; opened = []; locked = false;
  const values = themes[theme].motifs.slice(0, size / 2).map(motif => motif.name);
  cards = [...values, ...values].map(value => ({ value, matched: false }));
  for (let index = cards.length - 1; index > 0; index--) {
    const other = Math.floor(Math.random() * (index + 1));
    [cards[index], cards[other]] = [cards[other], cards[index]];
  }
  shell(`<section class="game"><h1 class="sr-only">${themes[theme].name} Memory ? ${size} Karten</h1><div class="game-toolbar"><div class="scoreboard" aria-live="polite"></div><p class="current-player" aria-live="polite"></p><button class="exit-button" id="exit">? Exit game</button></div><p class="game-status sr-only" role="status"></p><div class="board ${size === 16 ? 'four' : 'six'}" aria-label="Memory-Spielfeld">${cards.map((card, index) => `<button class="card" id="card-${index}" data-card="${index}" aria-label="Karte ${index + 1} aufdecken"><span class="card-inner"><span class="card-back" aria-hidden="true">${cardImage(themes[theme].back, 'back')}</span><span class="card-front" aria-hidden="true">${motifFace(card.value)}</span></span></button>`).join('')}</div></section>`, 'game');
  document.querySelector('#exit')?.addEventListener('click', () => { settings(); focusHeading(); });
  root.querySelectorAll<HTMLButtonElement>('[data-card]').forEach(button => button.addEventListener('click', () => flipCard(Number(button.dataset.card))));
  updateBoard(); focusHeading();
}
function updateBoard(): void {
  const scoreboard = root.querySelector('.scoreboard');
  if (!scoreboard) return;
  scoreboard.innerHTML = scoreMarkup();
  const currentPlayer = root.querySelector('.current-player');
  if (currentPlayer) currentPlayer.innerHTML = `Current player: <span class="${player === 0 ? 'blue' : 'orange'}-text" aria-label="${player === 0 ? 'Blue' : 'Orange'}">?</span>`;
  root.querySelector('.game-status')!.textContent = `${player === 0 ? 'Blau' : 'Orange'} ist am Zug · ${moves} Versuche · ${scores[0] + scores[1]} von ${size / 2} Paaren`;
  cards.forEach((card, index) => {
    const button = document.getElementById(`card-${index}`) as HTMLButtonElement | null;
    if (!button) return;
    const visible = opened.includes(index) || cards[index].matched;
    button.classList.toggle('flipped', visible);
    button.classList.toggle('matched', cards[index].matched);
    button.disabled = cards[index].matched;
    button.setAttribute('aria-label', `Karte ${index + 1}: ${visible ? cards[index].value + (cards[index].matched ? ', gefunden' : ', aufgedeckt') : 'verdeckt'}`);
  });
}
function flipCard(index: number): void {
  if (locked || cards[index].matched || opened.includes(index)) return;
  opened.push(index); updateBoard();
  if (opened.length !== 2) return;
  moves++; locked = true;
  const currentRound = round;
  const [first, second] = opened;
  const match = cards[first].value === cards[second].value;
  window.setTimeout(() => {
    if (round !== currentRound) return;
    if (match) {
      cards[first].matched = cards[second].matched = true;
      scores[player]++;
    } else player = player === 0 ? 1 : 0;
    opened = []; locked = false; updateBoard();
    if (cards.every(card => card.matched)) finishGame();
  }, match ? 450 : 1100);
}
function scoreMarkup(): string {
  return scores.map((score, index) => `<span class="score-chip ${index === 0 ? 'blue' : 'orange'}-text">? ${index === 0 ? 'Blue' : 'Orange'} <strong>${score}</strong></span>`).join('');
}
function finishGame(): void {
  shell(`<section class="result game-over"><h1>Game over</h1><p>Final score</p><div class="final-score">${scoreMarkup()}</div><button class="result-button" id="show-winner">Weiter ?</button></section>`, 'result');
  document.getElementById('show-winner')?.addEventListener('click', showWinner);
  focusHeading();
}
function showWinner(): void {
  const draw = scores[0] === scores[1];
  const color = scores[0] > scores[1] ? 'blue' : 'orange';
  const winner = draw ? 'Unentschieden!' : `${color === 'blue' ? 'Blau' : 'Orange'} gewinnt!`;
  shell(`<section class="result winner-screen"><img class="confetti" src="${asset('Confetti (1).png')}" alt=""><p>${draw ? "It's a" : 'The winner is'}</p><h1 class="${draw ? 'draw-text' : color + '-text'}" aria-label="${winner}">${draw ? 'DRAW' : color.toUpperCase() + ' PLAYER'}</h1><span class="winner-symbol ${draw ? 'draw-text' : color + '-text'}" aria-hidden="true">${draw ? '?' : '?'}</span><div class="winner-actions"><button class="result-button" id="back-to-start">Back to start</button><button class="text-button" id="again">Noch eine Runde</button></div></section>`, 'winner');
  document.getElementById('back-to-start')?.addEventListener('click', () => { home(); focusHeading(); });
  document.getElementById('again')?.addEventListener('click', startGame);
  focusHeading();
}
home();


