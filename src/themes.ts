import type { Theme, ThemeConfig } from './types';

/** Theme registry with 18 distinct motifs per theme, enough for the largest board. */
export const themes: Record<Theme, ThemeConfig> = {
  coding: {
    name: 'Code vibes', description: 'Türkis, Code und kreative Köpfe.',
    back: 'vector-code-back.svg', standaloneBack: true,
    motifs: [
      { name: 'Git', file: 'Front.svg', standalone: true },
      { name: 'JavaScript', file: 'Front (1).svg', standalone: true },
      { name: 'HTML', file: 'Front (2).svg', standalone: true },
      ...['TypeScript', 'Visual Studio Code', 'CSS', 'Django', 'Angular', 'Terminal', 'Python', 'GitHub', 'Node.js', 'Bootstrap', 'Vue', 'React', 'Sass', 'Datenbank', 'Firebase'].map((name, index) => ({
        name, file: index === 0 ? 'vector-Property 1=Component 22.svg' : `vector-Property 1=Component 22 (${index}).svg`, standalone: true,
      })),
    ],
  },
  gaming: {
    name: 'Gaming', description: 'Pink, Controller und ein neuer Highscore.',
    back: 'vector-Property 1=Component 1.svg', standaloneBack: true,
    motifs: ['Kreis', 'Quadrat', 'Dreieck', 'Labyrinth', 'Creeper', 'Pilz', 'Würfel', 'Banane', 'Controller', 'Geister', 'Münze', 'Snake', 'Level up', 'Pac-Man', 'Game Boy', 'Puzzleteile', 'Spielkarten', 'Play'].map((name, index) => ({
      name, file: index === 0 ? 'vector-Property 1=Component 2.svg' : `vector-Property 1=Component 2 (${index}).svg`, standalone: true,
    })),
  },
};

