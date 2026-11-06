import './styles/style.scss';

type Player = 0 | 1;
type Theme = 'coding' | 'gaming';
type BoardSize = 16 | 24 | 36;
interface Card { value: string; matched: boolean }
interface Motif { name: string; file?: string; standalone?: boolean }
interface ThemeConfig { name: string; description: string; back: string; standaloneBack?: boolean; motifs: Motif[] }

function asset(file: string): string {
  // Vite's public-file middleware needs literal equals signs in these export names.
  const filename = encodeURIComponent(file).replace(/%3D/gi, '=');
  return `${import.meta.env.BASE_URL}assets/${filename}`;
}

const themes: Record<Theme, ThemeConfig> = {
  coding: {
    name: 'Code vibes', description: 'Türkis, Code und kreative Köpfe.',
    back: 'Front (3).png', standaloneBack: true,
    motifs: [
      { name: 'Git', file: 'Front.png', standalone: true },
      { name: 'JavaScript', file: 'Front (1).png', standalone: true },
      { name: 'HTML', file: 'Front (2).png', standalone: true },
      ...['TypeScript', 'Visual Studio Code', 'CSS', 'Django', 'Angular', 'Terminal', 'Python', 'GitHub', 'Node.js', 'Bootstrap', 'Vue', 'React', 'Sass', 'Datenbank', 'Firebase'].map((name, index) => ({
        name, file: index === 0 ? 'Property 1=Component 22.png' : `Property 1=Component 22 (${index}).png`, standalone: true,
      })),
    ],
  },
  gaming: {
    name: 'Gaming', description: 'Pink, Controller und ein neuer Highscore.',
    back: 'Property 1=Component 1.png', standaloneBack: true,
    motifs: ['Kreis', 'Quadrat', 'Dreieck', 'Labyrinth', 'Creeper', 'Pilz', 'W?rfel', 'Banane', 'Controller', 'Geister', 'M?nze', 'Snake', 'Level up', 'Pac-Man', 'Game Boy', 'Puzzleteile', 'Spielkarten', 'Play'].map((name, index) => ({
      name, file: index === 0 ? 'Property 1=Component 2.png' : `Property 1=Component 2 (${index}).png`, standalone: true,
    })),
  },
};

function cardImage(file: string, side: 'front' | 'back', standalone = false): string {
  if (standalone) return `<span class="single-card-image"><img src="${asset(file)}" alt="" draggable="false"></span>`;
  return `<span class="image-window ${theme} ${side}"><img src="${asset(file)}" alt="" draggable="false"></span>`;
}

function motifFace(value: string): string {
  const motif = themes[theme].motifs.find(item => item.name === value);
  return theme === 'gaming' && value === 'Kreis' ? `<span class="gaming-circle">${cardImage('Property 1=Component 2.png', 'front', true)}<img class="matched-circle" src="${asset('Match card.png')}" alt=""></span>` : motif?.file ? cardImage(motif.file, 'front', motif.standalone) : `<span class="placeholder-motif"><strong>${value.replace('Motiv ', '')}</strong><small>Platzhalter</small></span>`;
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
  shell(`<section class="settings"><h1><img class="settings-title" src="${asset('Settings.png')}" alt="Settings"></h1><div class="settings-layout"><div class="settings-options"><fieldset><legend class="theme-legend"><svg class="theme-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a9 9 0 1 0 0 18h1.5a2.5 2.5 0 0 0 1.8-4.2 1.4 1.4 0 0 1 1-2.4H18A3 3 0 0 0 21 11c0-4.4-4-8-9-8Z"/><circle cx="7.5" cy="10" r=".8"/><circle cx="11" cy="6.8" r=".8"/><circle cx="15.5" cy="7.5" r=".8"/><circle cx="6.8" cy="14.5" r=".8"/></svg>Game themes</legend>${(Object.keys(themes) as Theme[]).map(value => `<label class="radio-option"><input type="radio" name="theme" value="${value}" ${theme === value ? 'checked' : ''}><span class="theme-option-art"><img src="${asset(value === 'coding' ? 'Radial buttons.png' : 'Radial buttons (1).png')}" alt="${themes[value].name} theme"></span></label>`).join('')}<label class="radio-option unavailable"><input type="radio" name="theme" disabled><span class="theme-option-art"><img src="${asset('Radial buttons (2).png')}" alt="DA Projects theme"></span><small>folgt</small></label><label class="radio-option unavailable"><input type="radio" name="theme" disabled><span class="theme-option-art"><img src="${asset('Radial buttons (3).png')}" alt="Foods theme"></span><small>folgt</small></label></fieldset><fieldset><legend><span class="player-icon" aria-hidden="true">${playerPawn(firstPlayer)}</span> Choose player</legend>${([0, 1] as const).map(value => `<label class="radio-option"><input type="radio" name="player" value="${value}" ${firstPlayer === value ? 'checked' : ''}>${value === 0 ? 'Blue' : 'Orange'}</label>`).join('')}</fieldset><fieldset><legend class="board-legend"><img class="board-size-icon" src="${asset('style.png')}" alt=""> Board size</legend>${([16, 24, 36] as const).map(value => `<label class="radio-option"><input type="radio" name="size" value="${value}" ${size === value ? 'checked' : ''}><span class="card-count-label">${value} cards</span></label>`).join('')}</fieldset><button class="text-button" id="back">? Home</button></div><div class="settings-visual"><div class="settings-preview" aria-label="Vorschau des gew?hlten Themes"><div class="preview-bar"><span class="mini-scores">${scorePlayerLabel(0)} ${scorePlayerLabel(1)}</span><span class="current-player">${currentPlayerMarkup(firstPlayer)}</span><span class="preview-exit">${exitMarkup()}</span></div><div class="preview-cards"><div class="preview-back exported-preview"><img src="${asset(theme === 'coding' ? 'Cards 5.png' : 'Rectangle 40.png')}" alt="${themes[theme].name} Kartenrückseite"></div><div class="preview-front ${theme === 'gaming' ? 'exported-preview' : ''}">${theme === 'gaming' ? `<img src="${asset('Front (5).png')}" alt="Gaming-Karte mit bunten Würfeln">` : motifFace(themes[theme].motifs[0].name)}</div></div></div><div class="settings-summary"><span>Game theme<strong>${themes[theme].name}</strong></span><i></i><span><span class="summary-label">Player</span><strong>${firstPlayer === 0 ? 'Blue' : 'Orange'}</strong></span><i></i><span><img class="summary-label" src="${asset('Board size.png')}" alt="Board size"><strong>${size} cards</strong></span><button class="primary settings-start" id="play"><img class="start-icon" src="${asset('smart_display.png')}" alt=""><img class="start-label" src="${asset('Start.png')}" alt="Start"></button></div><p class="asset-note">${theme === 'coding' ? 'Alle 18 Coding-Motive sind vorhanden.' : 'Alle 18 Gaming-Motive sind vorhanden.'}</p></div></div></section>`, 'settings');
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
  shell(`<section class="game"><h1 class="sr-only">${themes[theme].name} Memory ? ${size} Karten</h1><div class="game-toolbar"><div class="scoreboard" aria-live="polite"></div><p class="current-player" aria-live="polite"></p><button class="exit-button" id="exit">${exitMarkup()}</button></div><p class="game-status sr-only" role="status"></p><div class="board ${size === 16 ? 'four' : 'six'}" aria-label="Memory-Spielfeld">${cards.map((card, index) => `<button class="card" id="card-${index}" data-card="${index}" aria-label="Karte ${index + 1} aufdecken"><span class="card-inner"><span class="card-back" aria-hidden="true">${cardImage(themes[theme].back, 'back', themes[theme].standaloneBack)}</span><span class="card-front" aria-hidden="true">${motifFace(card.value)}</span></span></button>`).join('')}</div><dialog id="exit-dialog" class="exit-dialog" aria-labelledby="exit-title"><h2 id="exit-title"><img class="exit-question" src="${asset('Are you sure you want to quit the game_.png')}" alt="Are you sure you want to quit the game?"></h2><button class="back-to-game" id="resume-game" aria-label="Back to game"><img class="back-default" src="${asset(theme === 'gaming' ? 'Property 1=default.png' : 'Pop up button.png')}" alt=""><img class="back-hover pink-back-label" src="${asset('No, back to game.png')}" alt=""></button><button class="confirm-exit" id="confirm-exit">${theme === 'gaming' ? `<img class="pink-exit-default" src="${asset('Exit game pink.png')}" alt="Exit game"><img class="pink-exit-hover" src="${asset('Exit game pink hover.png')}" alt="">` : `<img class="dialog-exit-label" src="${asset('Exit game dialog.png')}" alt="Exit game">`}</button></dialog></section>`, 'game');
  document.querySelector('#exit')?.addEventListener('click', showExitDialog);
  root.querySelectorAll<HTMLButtonElement>('[data-card]').forEach(button => button.addEventListener('click', () => flipCard(Number(button.dataset.card))));
  document.getElementById('resume-game')?.addEventListener('click', () => (document.getElementById('exit-dialog') as HTMLDialogElement)?.close());
  document.getElementById('confirm-exit')?.addEventListener('click', () => { settings(); focusHeading(); });
  updateBoard(); focusHeading();
}
function showExitDialog(): void {
  (document.getElementById('exit-dialog') as HTMLDialogElement | null)?.showModal();
}
function playerPawn(value: Player): string {
  return `<img class="player-pawn ${value === 0 ? 'blue' : 'orange'}" src="${asset('Player.png')}" alt="${value === 0 ? 'Blue' : 'Orange'}">`;
}
function currentPlayerMarkup(value: Player): string {
  return `<img class="current-player-label" src="${asset('Current player_ (1).png')}" alt="Current player:"><img class="current-player-marker ${value === 0 ? 'blue' : 'orange'}" src="${asset(theme === 'gaming' ? 'Frame 614.png' : 'Frame 563.png')}" alt="${value === 0 ? 'Blue' : 'Orange'}">`;
}
function exitMarkup(): string {
  return `<img class="exit-button-art" src="${asset('secondary button (1).png')}" alt="Exit game">`;
}
function updateBoard(): void {
  const scoreboard = root.querySelector('.scoreboard');
  if (!scoreboard) return;
  scoreboard.innerHTML = scoreMarkup();
  const currentPlayer = root.querySelector('.current-player');
  if (currentPlayer) currentPlayer.innerHTML = currentPlayerMarkup(player);
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
function scorePlayerLabel(value: Player): string {
  if (theme === 'gaming') return playerPawn(value);
  return `<span class="score-player-art ${value === 0 ? 'blue' : 'orange'}"><img src="${asset(value === 0 ? 'Frame 552.png' : 'Frame 551.png')}" alt="${value === 0 ? 'Blue' : 'Orange'}"></span>`;
}
function scoreMarkup(): string {
  if (theme === 'gaming') return `<span class="gaming-scoreboard">${([0, 1] as const).map(value => `<span class="final-player-score">${playerPawn(value)}<strong class="${value === 0 ? 'blue' : 'orange'}-text" aria-label="${value === 0 ? 'Blue' : 'Orange'}: ${scores[value]} Paare">${scores[value]}</strong></span>`).join('')}</span>`;
  return `<span class="live-score-strip"><img src="${asset('Frame 565 (1).png')}" alt=""><strong class="live-score blue-text" aria-label="Blue: ${scores[0]} Paare">${scores[0]}</strong><strong class="live-score orange-text" aria-label="Orange: ${scores[1]} Paare">${scores[1]}</strong></span>`;
}
function finishGame(): void {
  shell(`<section class="result game-over"><h1><img src="${asset('game over.png')}" alt="Game over"></h1><p><img class="final-score-label" src="${asset('Final score.png')}" alt="Final score"></p><div class="final-score">${theme === 'gaming' ? `<span class="gaming-final-scores"><span class="final-player-score">${playerPawn(0)}<strong class="blue-text" aria-label="Blue: ${scores[0]} Paare">${scores[0]}</strong></span><span class="final-player-score">${playerPawn(1)}<strong class="orange-text" aria-label="Orange: ${scores[1]} Paare">${scores[1]}</strong></span></span>` : scoreMarkup()}</div><button class="result-button" id="show-winner">Weiter &rarr;</button></section>`, 'result');
  document.getElementById('show-winner')?.addEventListener('click', showWinner);
  focusHeading();
}
function showWinner(): void {
  const draw = scores[0] === scores[1];
  const color = scores[0] > scores[1] ? 'blue' : 'orange';
  const winner = draw ? 'Unentschieden!' : `${color === 'blue' ? 'Blau' : 'Orange'} gewinnt!`;
  shell(`<section class="result winner-screen">${theme === 'gaming' ? '' : `<img class="confetti" src="${asset('Confetti (1).png')}" alt="">`}${theme === 'gaming' && draw ? '' : `<p class="winner-kicker"><img src="${asset(draw ? 'It?s a.png' : 'The winner is.png')}" alt="${draw ? "It's a" : 'The winner is'}"></p>`}<h1 class="${draw ? 'draw-text' : color + '-text'}" aria-label="${winner}"><img class="winner-title-art" src="${asset(draw ? 'DRAW.png' : color === 'blue' ? 'Blue Player.png' : 'Orange Player.png')}" alt="${draw ? 'DRAW' : color === 'blue' ? 'Blue Player' : 'Orange Player'}"></h1><span class="winner-symbol ${draw ? 'draw-text' : color + '-text'}" aria-hidden="true">${draw ? `<img class="draw-symbol" src="${asset('Scale_Icon.png')}" alt="">` : `<img class="winner-trophy" src="${asset('pockal 1.png')}" alt="">`}</span><div class="winner-actions"><button class="winner-home-button" id="back-to-start"><img src="${asset('game theme.png')}" alt="Home"></button>${theme === 'gaming' ? '' : '<button class="text-button" id="again">Noch eine Runde</button>'}</div></section>`, 'winner');
  document.getElementById('back-to-start')?.addEventListener('click', () => { home(); focusHeading(); });
  document.getElementById('again')?.addEventListener('click', startGame);
  focusHeading();
}
home();












