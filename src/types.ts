/** Player indices used consistently by turns and score arrays: blue (0), orange (1). */
export type Player = 0 | 1;

/** Available visual themes, used as keys in the theme registry. */
export type Theme = 'coding' | 'gaming';

/** Supported total card counts; every two cards form one matching pair. */
export type BoardSize = 16 | 24 | 36;

/** Mutable state of one card in the shuffled round deck. */
export interface Card {
  /** Motif name shared by exactly two cards in a newly created deck. */
  value: string;
  /** Whether a player has already found this card's pair. */
  matched: boolean;
}

/** Artwork definition for one distinct matching motif. */
export interface Motif {
  /** Unique motif name within a theme, used for matching and accessible labels. */
  name: string;
  /** Asset filename; omitted motifs use the text fallback. */
  file?: string;
  /** True for a single-card export; false or omitted for a combined export. */
  standalone?: boolean;
}

/** Display metadata and artwork needed to render a complete theme. */
export interface ThemeConfig {
  /** Human-readable name shown in settings and screen headings. */
  name: string;
  /** Short description of the theme's visual style. */
  description: string;
  /** Filename of the common card-back artwork. */
  back: string;
  /** Whether the back asset is a complete card rather than a combined export. */
  standaloneBack?: boolean;
  /** Ordered motif pool; the selected board size determines how many are used. */
  motifs: Motif[];
}
