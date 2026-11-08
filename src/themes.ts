import type { Theme, ThemeConfig } from './types';

export const themes: Record<Theme, ThemeConfig> = {
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
    motifs: ['Kreis', 'Quadrat', 'Dreieck', 'Labyrinth', 'Creeper', 'Pilz', 'Würfel', 'Banane', 'Controller', 'Geister', 'Münze', 'Snake', 'Level up', 'Pac-Man', 'Game Boy', 'Puzzleteile', 'Spielkarten', 'Play'].map((name, index) => ({
      name, file: index === 0 ? 'Property 1=Component 2.png' : `Property 1=Component 2 (${index}).png`, standalone: true,
    })),
  },
};

