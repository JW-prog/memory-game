export type Player = 0 | 1;
export type Theme = 'coding' | 'gaming';
export type BoardSize = 16 | 24 | 36;
export interface Card {
  value: string;
  matched: boolean;
}
export interface Motif {
  name: string;
  file?: string;
  standalone?: boolean;
}
export interface ThemeConfig {
  name: string;
  description: string;
  back: string;
  standaloneBack?: boolean;
  motifs: Motif[];
}

