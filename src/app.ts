import type { Player, Theme, BoardSize, Card } from './types';
import { themes } from './themes';
import {
  homeMarkup, settingsMarkup, gameMarkup, resultMarkup, winnerMarkup,
  cardImage, motifFace, currentPlayerMarkup, scoreMarkup,
  previewScoresMarkup, previewCurrentPlayerMarkup,
} from './templates';

/** Application mount element shared by all rendered screens. */
const root = document.querySelector<HTMLDivElement>('#app')!;
/** Committed theme selection; temporary hover previews do not overwrite it. */
let theme: Theme = 'coding';
/** Selected card count; null until the user chooses a board. */
let size: BoardSize | null = null;
/** Selected starting player; null until explicitly chosen. */
let firstPlayer: Player | null = null;
/** Player taking the current turn: 0 for blue, 1 for orange. */
let player: Player = 0;
/** Matched-pair totals indexed by player; reset at the start of each round. */
let scores = [0, 0];
/** Shuffled deck for the active round, including each card's matched state. */
let cards: Card[] = [];
/** Indices of the zero, one or two unmatched cards currently revealed. */
let opened: number[] = [];
/** Prevents further flips while a revealed pair is being resolved. */
let locked = false;
/** Round token used to ignore delayed callbacks after navigation. */
let round = 0;
/** Number of completed two-card attempts in the active round. */
let moves = 0;

/**
 * Replace the active screen and expose its theme and page to the styles.
 *
 * @param content - HTML markup for the requested screen.
 * @param page - Screen identifier used by page-specific styles.
 */
function shell(content: string, page: 'home' | 'settings' | 'game' | 'result' | 'winner' = 'settings'): void {
  document.body.dataset.theme = theme;
  document.body.dataset.page = page;
  root.innerHTML = `<main>${content}</main>`;
}

/** Move keyboard focus to the current screen heading after navigation. */
function focusHeading(): void {
  const heading = root.querySelector<HTMLElement>('h1');
  heading?.setAttribute('tabindex', '-1');
  heading?.focus();
}

/** Render the landing screen and bind the settings entry point. */
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
  bindSettingChoices();
  bindThemePreviews();
  refreshSettings();
  document.querySelector('#settings-exit')?.addEventListener('click', () => {
    home();
    focusHeading();
  });
  document.querySelector('#play')?.addEventListener('click', startGame);
}

/** Bind committed radio choices independently from temporary theme previews. */
function bindSettingChoices(): void {
  root.querySelectorAll<HTMLInputElement>('input[type="radio"]').forEach(input => {
    input.addEventListener('change', () => {
      if (input.name === 'theme') theme = input.value as Theme;
      if (input.name === 'player') firstPlayer = Number(input.value) as Player;
      if (input.name === 'size') size = Number(input.value) as BoardSize;
      refreshSettings();
    });
  });
}

/** Show a temporary theme on hover or focus without committing the choice. */
function bindThemePreviews(): void {
  root.querySelectorAll<HTMLInputElement>('input[name="theme"]').forEach(input => {
    const label = input.closest('label');
    label?.addEventListener('pointerenter', () => refreshSettings(input.value as Theme));
    label?.addEventListener('pointerleave', () => refreshSettings());
    input.addEventListener('focus', () => refreshSettings(input.value as Theme));
    input.addEventListener('blur', () => refreshSettings());
  });
}

/**
 * Update the preview and selection summary without replacing controls.
 *
 * @param previewTheme - Temporary preview theme; defaults to the committed theme.
 */
function refreshSettings(previewTheme: Theme = theme): void {
  document.body.dataset.theme = previewTheme;
  refreshPreview(previewTheme);
  refreshSelectionSummary();
}

/**
 * Update the sample artwork and toolbar without replacing settings controls.
 *
 * @param previewTheme - Committed theme or temporary theme being previewed.
 */
function refreshPreview(previewTheme: Theme): void {
  const back = root.querySelector<HTMLElement>('.preview-back');
  const front = root.querySelector<HTMLElement>('.preview-front');
  const sample = themes[previewTheme].motifs[previewTheme === 'gaming' ? 6 : 0];
  if (back) back.innerHTML = cardImage(previewTheme, themes[previewTheme].back, 'back', true);
  if (front) front.innerHTML = motifFace(previewTheme, sample.name);
  const miniScores = root.querySelector<HTMLElement>('.mini-scores');
  if (miniScores) miniScores.innerHTML = previewScoresMarkup(previewTheme);
  const current = root.querySelector<HTMLElement>('.preview-bar .current-player');
  if (current) current.innerHTML = previewCurrentPlayerMarkup(previewTheme, firstPlayer ?? 0);
}

/** Reflect committed choices in the summary and enable Start only when complete. */
function refreshSelectionSummary(): void {
  const start = root.querySelector<HTMLButtonElement>('#play');
  if (start) start.disabled = firstPlayer === null || size === null;
  const values = [
    themes[theme].name,
    firstPlayer === null ? 'Choose player' : firstPlayer === 0 ? 'Blue' : 'Orange',
    size === null ? 'Choose board size' : `${size} cards`,
  ];
  const summary = root.querySelectorAll<HTMLElement>('.settings-summary strong');
  values.forEach((value, index) => {
    if (summary[index]) summary[index].textContent = value;
  });
}

/** Start a shuffled round using the selected settings. */
function startGame(): void {
  if (firstPlayer === null || size === null) return;
  round++;
  scores = [0, 0];
  moves = 0;
  player = firstPlayer;
  opened = [];
  locked = false;
  cards = createDeck(size);
  renderGame();
}

/**
 * Create two cards per motif and shuffle them with Fisher-Yates.
 *
 * @param count - Total number of cards selected for this round.
 * @returns A shuffled deck containing exactly two cards per motif.
 */
function createDeck(count: BoardSize): Card[] {
  const values = themes[theme].motifs.slice(0, count / 2).map(motif => motif.name);
  const deck = [...values, ...values].map(value => ({ value, matched: false }));
  for (let index = deck.length - 1; index > 0; index--) {
    const other = Math.floor(Math.random() * (index + 1));
    [deck[index], deck[other]] = [deck[other], deck[index]];
  }
  return deck;
}

/** Render the active board and bind its navigation and card controls. */
function renderGame(): void {
  if (size === null) return;
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

/** Ask for confirmation before leaving the active round. */
function showExitDialog(): void {
  (document.getElementById('exit-dialog') as HTMLDialogElement | null)?.showModal();
}

/** Synchronize the toolbar and all card buttons with the current round state. */
function updateBoard(): void {
  const scoreboard = root.querySelector('.scoreboard');
  if (!scoreboard) return;
  scoreboard.innerHTML = scoreMarkup(theme, scores);
  updateTurnStatus();
  cards.forEach(updateCard);
}

/** Update the current-player indicator and accessible round progress announcement. */
function updateTurnStatus(): void {
  const currentPlayer = root.querySelector('.current-player');
  if (currentPlayer) currentPlayer.innerHTML = currentPlayerMarkup(player);
  const status = root.querySelector('.game-status');
  if (status) {
    status.textContent = `${player === 0 ? 'Blau' : 'Orange'} ist am Zug ? ${moves} Versuche ? `
      + `${scores[0] + scores[1]} von ${cards.length / 2} Paaren`;
  }
}

/**
 * Reflect one card's visibility and matched state in its button.
 *
 * @param card - Card data from the active deck.
 * @param index - Zero-based deck position used by the corresponding button ID.
 */
function updateCard(card: Card, index: number): void {
  const button = document.getElementById(`card-${index}`) as HTMLButtonElement | null;
  if (!button) return;
  const visible = opened.includes(index) || card.matched;
  const description = visible ? card.value + (card.matched ? ', gefunden' : ', aufgedeckt') : 'verdeckt';
  button.classList.toggle('flipped', visible);
  button.classList.toggle('matched', card.matched);
  button.disabled = card.matched;
  button.setAttribute('aria-label', `Karte ${index + 1}: ${description}`);
}

/**
 * Reveal a card and resolve a completed pair after its animation.
 *
 * @param index - Zero-based position of the clicked card in the active deck.
 */
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
    if (round === currentRound) resolvePair(first, second, match);
  }, match ? 650 : 1100);
}

/**
 * Award a matched pair or switch turns, then unlock the active round.
 *
 * @param first - Deck index of the first revealed card.
 * @param second - Deck index of the second revealed card.
 * @param match - Whether the two revealed cards have the same motif.
 * @remarks Call only after checking that the scheduled round token is still current.
 */
function resolvePair(first: number, second: number, match: boolean): void {
  if (match) {
    cards[first].matched = cards[second].matched = true;
    scores[player]++;
  } else {
    player = player === 0 ? 1 : 0;
  }
  opened = [];
  locked = false;
  updateBoard();
  if (cards.every(card => card.matched)) finishGame();
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

/** Render the winning player or draw and bind the return to home. */
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

/** Initialize the application on the home screen. */
export function initialize(): void {
  home();
}
