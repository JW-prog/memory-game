import type { BoardSize, Player, Theme } from './types';
import { themes } from './themes';
import { settingsMarkup, previewCardImage, previewScoresMarkup, previewCurrentPlayerMarkup } from './templates';

interface SettingsDependencies {
  root: HTMLDivElement;
  shell: (content: string, page: 'settings') => void;
  home: () => void;
  focusHeading: () => void;
  startGame: () => void;
  invalidateRound: () => void;
  getTheme: () => Theme;
  setTheme: (value: Theme) => void;
  getFirstPlayer: () => Player | null;
  setFirstPlayer: (value: Player) => void;
  getSize: () => BoardSize | null;
  setSize: (value: BoardSize) => void;
}

export function createSettings({ root, shell, home, focusHeading, startGame, invalidateRound,
  getTheme, setTheme, getFirstPlayer, setFirstPlayer, getSize, setSize }: SettingsDependencies) {
/** Render settings once; later selections update the existing preview. */
function settings(): void {
  invalidateRound();
  shell(settingsMarkup(getTheme(), getFirstPlayer(), getSize()), 'settings');
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
      if (input.name === 'theme') setTheme(input.value as Theme);
      if (input.name === 'player') setFirstPlayer(Number(input.value) as Player);
      if (input.name === 'size') setSize(Number(input.value) as BoardSize);
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
function refreshSettings(previewTheme: Theme = getTheme()): void {
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
  if (back) back.innerHTML = previewCardImage(previewTheme, 'back');
  if (front) front.innerHTML = previewCardImage(previewTheme, 'front');
  const miniScores = root.querySelector<HTMLElement>('.mini-scores');
  if (miniScores) miniScores.innerHTML = previewScoresMarkup(previewTheme);
  const current = root.querySelector<HTMLElement>('.preview-bar .current-player');
  if (current) current.innerHTML = previewCurrentPlayerMarkup(previewTheme, getFirstPlayer() ?? 0);
}

/** Reflect committed choices in the summary and enable Start only when complete. */
function refreshSelectionSummary(): void {
  const start = root.querySelector<HTMLButtonElement>('#play');
  if (start) start.disabled = getFirstPlayer() === null || getSize() === null;
  const values = [
    themes[getTheme()].name,
    getFirstPlayer() === null ? 'Choose player' : getFirstPlayer() === 0 ? 'Blue' : 'Orange',
    getSize() === null ? 'Choose board size' : `${getSize()} cards`,
  ];
  const summary = root.querySelectorAll<HTMLElement>('.settings-summary strong');
  values.forEach((value, index) => {
    if (summary[index]) summary[index].textContent = value;
  });
}

return { settings, refreshSettings };
}
