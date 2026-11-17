import type { BoardSize, Card, Theme } from './types';
import { themes } from './themes';

/**
 * Create two cards per motif and shuffle them with Fisher-Yates.
 *
 * @param count - Total number of cards selected for this round.
 * @returns A shuffled deck containing exactly two cards per motif.
 */
export function createDeck(count: BoardSize, theme: Theme): Card[] {
  const values = themes[theme].motifs.slice(0, count / 2).map(motif => motif.name);
  const deck = [...values, ...values].map(value => ({ value, matched: false }));
  for (let index = deck.length - 1; index > 0; index--) {
    const other = Math.floor(Math.random() * (index + 1));
    [deck[index], deck[other]] = [deck[other], deck[index]];
  }
  return deck;
}

