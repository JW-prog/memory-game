import type { Theme, Player, BoardSize, Card } from './types';
import { themes } from './themes';
import { asset } from './assets';

/** Reusable HTML templates. All changing values are passed by the caller. */
export function cardImage(theme: Theme, file: string, side: 'front' | 'back', standalone = false): string {
  if (standalone) return `<span class="single-card-image">
      <img src="${asset(file)}" alt="" draggable="false">
      </span>`;
  return `<span class="image-window ${theme} ${side}">
      <img src="${asset(file)}" alt="" draggable="false">
      </span>`;
}

export function motifFace(theme: Theme, value: string): string {
  const motif = themes[theme].motifs.find(item => item.name === value);
  return theme === 'gaming' && value === 'Kreis' ? `<span class="gaming-circle">${cardImage(theme, 'Property 1=Component 2.png', 'front', true)}<img class="matched-circle" src="${asset('Match card.png')}" alt="">
      </span>` : motif?.file ? cardImage(theme, motif.file, 'front', motif.standalone) : `<span class="placeholder-motif">
      <strong>${value.replace('Motiv ', '')}</strong>
      <small>Platzhalter</small>
      </span>`;
}

export function themeOptionsMarkup(theme: Theme): string {
  return `<fieldset>
      <legend class="theme-legend">
      <svg class="theme-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M12 3a9 9 0 1 0 0 18h1.5a2.5 2.5 0 0 0 1.8-4.2 1.4 1.4 0 0 1 1-2.4H18A3 3 0 0 0 21 11c0-4.4-4-8-9-8Z"/>
      <circle cx="7.5" cy="10" r=".8"/>
      <circle cx="11" cy="6.8" r=".8"/>
      <circle cx="15.5" cy="7.5" r=".8"/>
      <circle cx="6.8" cy="14.5" r=".8"/>
      </svg>Game themes</legend>${(Object.keys(themes) as Theme[]).map(value => `<label class="radio-option">
      <input type="radio" name="theme" value="${value}" ${theme === value ? 'checked' : ''}>
      <span class="theme-name">${themes[value].name} theme</span>
      <img class="selected-theme-line" src="${asset('Line 3.png')}" alt="">
      </label>`).join('')}
      </fieldset>`;
}

export function playerOptionsMarkup(firstPlayer: Player): string {
  return `<fieldset>
      <legend>
      <span class="player-icon" aria-hidden="true">${playerPawn(firstPlayer)}</span> Choose player</legend>${([0, 1] as const).map(value => `<label class="radio-option">
      <input type="radio" name="player" value="${value}" ${firstPlayer === value ? 'checked' : ''}>${value === 0 ? 'Blue' : 'Orange'}</label>`).join('')}</fieldset>`;
}

export function boardOptionsMarkup(size: BoardSize): string {
  return `<fieldset>
      <legend class="board-legend">
      <img class="board-size-icon" src="${asset('style.png')}" alt=""> Board size</legend>${([16, 24, 36] as const).map(value => `<label class="radio-option">
      <input type="radio" name="size" value="${value}" ${size === value ? 'checked' : ''}>
      <span class="card-count-label">${value} cards</span>
      </label>`).join('')}</fieldset>`;
}

export function playerPawn(value: Player): string {
  return `<img class="player-pawn ${value === 0 ? 'blue' : 'orange'}" src="${asset('Player.png')}" alt="${value === 0 ? 'Blue' : 'Orange'}">`;
}

export function currentPlayerMarkup(value: Player): string {
  return `<span class="game-current-player-label">Current player:</span><img class="game-player-label" src="${asset(value === 0 ? 'label.png' : 'label (1).png')}" alt="${value === 0 ? 'Blue' : 'Orange'}">`;
}

export function exitMarkup(): string {
  return `<img class="game-exit-icon" src="${asset('move_item.png')}" alt=""><span class="game-exit-label">Exit game</span>`;
}

export function scorePlayerLabel(value: Player): string {
  return `<span class="score-name ${value === 0 ? 'blue' : 'orange'}-text">${value === 0 ? 'Blue' : 'Orange'}</span>`;
}

export function scoreMarkup(theme: Theme, scores: number[]): string {
  if (theme === 'coding') return `<span class="png-scoreboard">
      ${([0, 1] as const).map(value => `<span class="score-entry ${value === 0 ? 'blue' : 'orange'}-text"><img src="${asset(value === 0 ? 'label.png' : 'label (1).png')}" alt=""><span>${value === 0 ? 'Blue' : 'Orange'}</span><strong aria-label="${value === 0 ? 'Blue' : 'Orange'}: ${scores[value]} Paare">${scores[value]}</strong></span>`).join('')}
      </span>`;
  return `<span class="text-scoreboard">${([0, 1] as const).map(value => `<span class="final-player-score">${scorePlayerLabel(value)}<strong class="${value === 0 ? 'blue' : 'orange'}-text" aria-label="${value === 0 ? 'Blue' : 'Orange'}: ${scores[value]} Paare">${scores[value]}</strong></span>`).join('')}</span>`;
}

/** Compact settings toolbar, separate from the full game toolbar. */
export function previewScoresMarkup(theme: Theme): string {
  if (theme !== 'gaming') return scoreMarkup(theme, [0, 0]);
  return ([1, 0] as const).map(value => `<span class="preview-player-score ${value === 0 ? 'blue' : 'orange'}-text">${playerPawn(value)}<strong>${value === 0 ? 2 : 6}</strong></span>`).join('');
}

export function previewCurrentPlayerMarkup(theme: Theme, value: Player): string {
  if (theme !== 'gaming') return currentPlayerMarkup(value);
  return `<span class="settings-current-player-label">Current player:</span><span class="gaming-current-pawn ${value === 0 ? 'blue' : 'orange'}">${playerPawn(value)}</span>`;
}

/** Markup for the home screen. */
export function homeMarkup(): string {
  return `<section class="home-screen">
      <div class="home-content">
      <p class="home-kicker">It’s play time.</p>
      <h1>Ready to play?</h1>
      <button class="primary image-button" id="start" aria-label="Play — zu den Einstellungen">
      <svg class="home-play-controller" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M7.5 5h9c2 0 3.1 1.2 3.6 3.2l1.5 7.6c.5 2.5-1.9 3.7-3.5 1.8L15.5 15h-7l-2.6 2.6c-1.6 1.9-4 .7-3.5-1.8l1.5-7.6C4.4 6.2 5.5 5 7.5 5Z"/>
        <path d="M7.5 8v5M5 10.5h5"/>
        <circle cx="16" cy="9" r=".6" fill="currentColor" stroke="none"/>
        <circle cx="18" cy="11.5" r=".6" fill="currentColor" stroke="none"/>
      </svg>
      <span class="home-play-label">Play</span>
      <img class="home-play-arrow" src="${asset('Arrow 1.png')}" alt="" draggable="false">
      </button>
      </div>
      <img class="controller home-controller" src="${asset('stadia_controller.png')}" alt="Spielcontroller" draggable="false">
      </section>`;
}

/** Markup for the settings screen. */
export function settingsMarkup(theme: Theme, firstPlayer: Player, size: BoardSize): string {
  return `<section class="settings">
      <h1>
      Settings
      </h1>
      <div class="settings-layout">
      <section class="settings-options" aria-label="Spieleinstellungen">
      ${themeOptionsMarkup(theme)}
      ${playerOptionsMarkup(firstPlayer)}
      ${boardOptionsMarkup(size)}
      </section>
      <div class="settings-visual">
      <section class="settings-preview" aria-label="Vorschau des gewählten Themes">
      <div class="preview-bar">
      <span class="mini-scores">${previewScoresMarkup(theme)}</span>
      <span class="current-player">${previewCurrentPlayerMarkup(theme, firstPlayer)}</span>
      <button type="button" class="preview-exit" id="settings-exit"><img class="settings-exit-icon" src="${asset('move_item.png')}" alt=""><span class="settings-exit-label">Exit game</span></button>
      </div>
      <div class="preview-cards">
      <div class="preview-back">${cardImage(theme, themes[theme].back, 'back', true)}</div>
      <div class="preview-front">${motifFace(theme, themes[theme].motifs[theme === 'gaming' ? 6 : 0].name)}</div>
      </div>
      </section>
      <section class="settings-summary" aria-label="Gewaehlte Einstellungen" aria-live="polite">
      <span>Game theme<strong>${themes[theme].name}</strong>
      </span>
      <i>
      </i>
      <span>
      <span class="summary-label">Player</span>
      <strong>${firstPlayer === 0 ? 'Blue' : 'Orange'}</strong>
      </span>
      <i>
      </i>
      <span>
      <span class="summary-label">Board size</span>
      <strong>${size} cards</strong>
      </span>
      <button class="primary settings-start" id="play" aria-label="Start">
      <img class="start-icon" src="${asset('smart_display.png')}" alt="" draggable="false">
      <img class="start-label" src="${asset('Start.png')}" alt="" draggable="false">
      </button>
      </section>
      
      </div>
      </div>
      </section>`;
}

/** Markup for the game screen. */
export function gameMarkup(theme: Theme, size: BoardSize, cards: Card[]): string {
  return `<section class="game">
      <h1 class="game-title">${themes[theme].name} Memory – ${size} Karten</h1>
      <header class="game-toolbar" aria-label="Spielstand und Spielsteuerung">
      <div class="scoreboard" aria-live="polite">
      </div>
      <p class="current-player" aria-live="polite">
      </p>
      <button class="exit-button" id="exit">${exitMarkup()}</button>
      </header>
      <p class="game-status sr-only" role="status">
      </p>
      <div role="group" class="board ${size === 16 ? 'four' : 'six'}" aria-label="Memory-Spielfeld">${cards.map((card, index) => `<button class="card" id="card-${index}" data-card="${index}" aria-label="Karte ${index + 1} aufdecken">
      <span class="card-inner">
      <span class="card-back" aria-hidden="true">${cardImage(theme, themes[theme].back, 'back', themes[theme].standaloneBack)}</span>
      <span class="card-front" aria-hidden="true">${motifFace(theme, card.value)}</span>
      </span>
      </button>`).join('')}</div>
      <dialog id="exit-dialog" class="exit-dialog" aria-labelledby="exit-title">
      <h2 id="exit-title">
      Are you sure you want to quit the game?
      </h2>
      <div class="exit-dialog-actions">
      <button class="back-to-game" id="resume-game">${theme === 'gaming' ? 'No, back to game' : 'Back to game'}</button>
      <button class="confirm-exit" id="confirm-exit">${theme === 'gaming' ? 'Yes, quit game' : 'Exit game'}</button>
      </div>
      </dialog>
      </section>`;
}

/** Markup for the result screen. */
export function resultMarkup(theme: Theme, scores: number[]): string {
  return `<section class="result game-over">
      <h1>
      Game over
      </h1>
      <p>
      <span class="final-score-label">Final score</span>
      </p>
      <div class="final-score">${theme === 'gaming' ? `<span class="gaming-final-scores">
      <span class="final-player-score">${playerPawn(0)}<strong class="blue-text" aria-label="Blue: ${scores[0]} Paare">${scores[0]}</strong>
      </span>
      <span class="final-player-score">${playerPawn(1)}<strong class="orange-text" aria-label="Orange: ${scores[1]} Paare">${scores[1]}</strong>
      </span>
      </span>` : scoreMarkup(theme, scores)}</div>
      </section>`;
}

/** Markup for the winner screen. */
export function winnerMarkup(theme: Theme, draw: boolean, color: string, winner: string): string {
  return `<section class="result winner-screen">${theme === 'gaming' || draw ? '' : `<img class="confetti" src="${asset('Confetti (1).png')}" alt="">`}<p class="winner-kicker">
      <img src="${asset(draw ? 'It’s a.png' : 'The winner is.png')}" alt="${draw ? "It's a" : 'The winner is'}">
      </p><h1 class="${draw ? 'draw-text' : color + '-text'}" aria-label="${winner}">
      ${draw ? 'DRAW' : color === 'blue' ? 'Blue Player' : 'Orange Player'}
      </h1>
      <span class="winner-symbol ${draw ? 'draw-text' : color + '-text'}" aria-hidden="true">${draw ? `<span class="coding-draw-art" style="mask-image: url('${asset('Scale_Icon.png')}')"><img class="draw-symbol" src="${asset('Scale_Icon.png')}" alt=""></span>` : theme === 'gaming' ? `<img class="winner-trophy" src="${asset('pockal 1.png')}" alt="">` : playerPawn(color === 'blue' ? 0 : 1)}</span>
      <div class="winner-actions">
      <button class="winner-home-button result-home" id="back-to-start">
      <img src="${asset(theme === 'gaming' ? 'result-home.png' : 'secondary button (2).png')}" alt="${theme === 'gaming' ? 'Home' : 'Back to start'}">
      </button></div>
      </section>`;
}
