import type { Player, Theme, BoardSize, Card } from './types';
import { themes } from './themes';
import {
  homeMarkup, settingsMarkup, gameMarkup, resultMarkup, winnerMarkup,
  cardImage, motifFace, currentPlayerMarkup, scoreMarkup,
  previewScoresMarkup, previewCurrentPlayerMarkup,
} from './templates';

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

/** Render a screen and bind the shared home navigation. */
function shell(content: string, page: 'home' | 'settings' | 'game' | 'result' | 'winner' = 'settings'): void {
  document.body.dataset.theme = theme;
  document.body.dataset.page = page;
  root.innerHTML = `<header class="brand">
      <a href="#" aria-label="Memory Startseite">memory ✳</a>
      <span>WENIGER SCROLLEN. MEHR SPIELEN.</span>
      </header>
      <main>${content}</main>
      <footer>Ein Spiel. Zwei Köpfe. Viele gute Momente.<span>MADE FOR PLAY ✳</span>
      </footer>`;
  root.querySelector('.brand a')?.addEventListener('click', (event) => {
    event.preventDefault();
    home();
    focusHeading();
  });
}
function focusHeading(): void {
  const heading = root.querySelector<HTMLElement>('h1');
  heading?.setAttribute('tabindex', '-1');
  heading?.focus();
}
function home(): void {
  round++;
  shell(homeMarkup(), 'home');
  document.querySelector('#start')?.addEventListener('click', () => {
    settings();
    focusHeading();
  });
}

/** Render settings once; later selections update the existing preview. */
function settings(): void {
  round++;
  shell(settingsMarkup(theme, firstPlayer, size), 'settings');
  root.querySelectorAll<HTMLInputElement>('input[name="theme"]').forEach(input => input.addEventListener('change', () => {
    theme = input.value as Theme;
    refreshSettings();
  }));
  root.querySelectorAll<HTMLInputElement>('input[name="player"]').forEach(input => input.addEventListener('change', () => {
    firstPlayer = Number(input.value) as Player;
    refreshSettings();
  }));
  root.querySelectorAll<HTMLInputElement>('input[name="size"]').forEach(input => input.addEventListener('change', () => {
    size = Number(input.value) as BoardSize;
    refreshSettings();
  }));
  root.querySelectorAll<HTMLInputElement>('input[name="theme"]').forEach(input => {
    const label = input.closest('label');
    label?.addEventListener('pointerenter', () => refreshSettings(input.value as Theme));
    label?.addEventListener('pointerleave', () => refreshSettings());
    input.addEventListener('focus', () => refreshSettings(input.value as Theme));
    input.addEventListener('blur', () => refreshSettings());
  });
  refreshSettings();
  document.querySelector('#settings-exit')?.addEventListener('click', () => {
    home();
    focusHeading();
  });
  document.querySelector('#play')?.addEventListener('click', startGame);
}
/** Update only the preview and summary, preserving controls, focus and layout. */
function refreshSettings(previewTheme: Theme = theme): void {
  document.body.dataset.theme = previewTheme;
  const back = root.querySelector<HTMLElement>('.preview-back');
  const front = root.querySelector<HTMLElement>('.preview-front');
  if (back) back.innerHTML = cardImage(previewTheme, themes[previewTheme].back, 'back', true);
  if (front) front.innerHTML = motifFace(previewTheme, themes[previewTheme].motifs[previewTheme === 'gaming' ? 6 : 0].name);
  const miniScores = root.querySelector<HTMLElement>('.mini-scores');
  if (miniScores) miniScores.innerHTML = previewScoresMarkup(previewTheme);
  const current = root.querySelector<HTMLElement>('.preview-bar .current-player');
  if (current) current.innerHTML = previewCurrentPlayerMarkup(previewTheme, firstPlayer);
  const summary = root.querySelectorAll<HTMLElement>('.settings-summary strong');
  [themes[theme].name, firstPlayer === 0 ? 'Blue' : 'Orange', `${size} cards`].forEach((value, index) => {
    if (summary[index]) summary[index].textContent = value;
  });
}

/** Start a shuffled round using the selected settings. */
function startGame(): void {
  round++;
  scores = [0, 0];
  moves = 0;
  player = firstPlayer;
  opened = [];
  locked = false;
  const values = themes[theme].motifs.slice(0, size / 2).map(motif => motif.name);
  cards = [...values, ...values].map(value => ({ value, matched: false }));
  for (let index = cards.length - 1; index > 0; index--) {
    const other = Math.floor(Math.random() * (index + 1));
    [cards[index], cards[other]] = [cards[other], cards[index]];
  }
  shell(gameMarkup(theme, size, cards), 'game');
  document.querySelector('#exit')?.addEventListener('click', showExitDialog);
  root.querySelectorAll<HTMLButtonElement>('[data-card]').forEach(button => button.addEventListener('click', () => flipCard(Number(button.dataset.card))));
  document.getElementById('resume-game')?.addEventListener('click', () => (document.getElementById('exit-dialog') as HTMLDialogElement)?.close());
  document.getElementById('confirm-exit')?.addEventListener('click', () => {
    settings();
    focusHeading();
  });
  updateBoard();
  focusHeading();
}
function showExitDialog(): void {
  (document.getElementById('exit-dialog') as HTMLDialogElement | null)?.showModal();
}

function updateBoard(): void {
  const scoreboard = root.querySelector('.scoreboard');
  if (!scoreboard) return;
  scoreboard.innerHTML = scoreMarkup(theme, scores);
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
/** Reveal up to two cards and resolve the pair after its animation. */
function flipCard(index: number): void {
  if (locked || cards[index].matched || opened.includes(index)) return;
  opened.push(index);
  updateBoard();
  if (opened.length !== 2) return;
  moves++;
  locked = true;
  const currentRound = round;
  const [first, second] = opened;
  const match = cards[first].value === cards[second].value;
  window.setTimeout(() => {
    if (round !== currentRound) return;
    if (match) {
      cards[first].matched = cards[second].matched = true;
      scores[player]++;
    } else player = player === 0 ? 1 : 0;
    opened = [];
    locked = false;
    updateBoard();
    if (cards.every(card => card.matched)) finishGame();
  }, match ? 650 : 1100);
}

/** Show the final score before advancing to the winner screen. */
function finishGame(): void {
  shell(resultMarkup(theme, scores), 'result');
  const finishedRound = round;
  window.setTimeout(() => {
    if (round === finishedRound && document.body.dataset.page === 'result') {
      showWinner();
    }
  }, 3000);
  focusHeading();
}
function showWinner(): void {
  const draw = scores[0] === scores[1];
  const color = scores[0] > scores[1] ? 'blue' : 'orange';
  const winner = draw ? 'Unentschieden!' : `${color === 'blue' ? 'Blau' : 'Orange'} gewinnt!`;
  shell(winnerMarkup(theme, draw, color, winner), 'winner');
  document.getElementById('back-to-start')?.addEventListener('click', () => {
    home();
    focusHeading();
  });
  focusHeading();
}
export function initialize(): void {
  home();
}
