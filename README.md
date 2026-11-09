# Memory

A two-player memory game built with TypeScript, Vite and Sass. Choose between **Code vibes** and **Gaming**, each with 18 motifs and boards of 16, 24 or 36 cards.

## Development

Use Node.js 22.13 or a supported newer version. The tests use Node's experimental TypeScript stripping API.

```sh
npm install
npm run dev
npm run build
npm test
```

On Windows PowerShell, use `npm.cmd` if script execution policies block `npm`.

## How to play

1. Select Play to open the settings.
2. Only the theme is preselected on the first visit. Choose a starting player and board size to enable Start.
3. Find matching pairs on a 4 by 4, 6 by 4 or 6 by 6 board.
4. A match awards one point and another turn. A mismatch passes the turn to the other player.
5. The final score appears after the last pair. Three seconds later, the winner or draw screen appears. Wins show confetti in both themes; draws show the balance symbol without confetti.
6. Return home to start another round. Settings are retained during the current session.

Exit game opens a confirmation dialog. Returning preserves the round; confirming exits to settings. Pending callbacks from abandoned rounds cannot alter a later round.

## Interface and accessibility

- Visible controller decoration on the home screen, without requiring hover.
- PNG favicon using the turquoise memory card (`public/favicon.png`), included in development and production builds.
- Native radio controls, keyboard focus management and screen-reader announcements.
- One main heading per screen (visually hidden on the game board); fieldsets and legends group settings, and the confirmation dialog uses a second-level heading.
- Text sizes of at least 16 pixels, with wrapping for narrow settings previews.
- Temporary theme previews on hover and keyboard focus, without changing the committed choice.
- Reduced-motion preferences respected by animations and transitions.

## Project structure

- `src/main.ts`: application entry point and styles.
- `src/app.ts`: navigation, settings, round state and event handlers.
- `src/templates.ts`: HTML templates with explicit input parameters.
- `src/types.ts`: shared data types.
- `src/themes.ts`: theme definitions and motifs.
- `src/assets.ts`: asset URLs respecting the configured Vite base path.
- `src/styles/`: Sass layers for screens, components and responsive layouts.
- `public/`: static card artwork and favicon.
- `tests/game.test.cjs`: game rules, navigation, settings validation and asset-path regression tests.

## Validation

`npm run build` performs strict TypeScript checking and builds the production site. `npm test` checks game behavior with a lightweight DOM simulation, including incomplete settings, both themes, scores, round timers and asset filename casing.

The tests do not render a browser. Compare all screens and responsive sizes with the original design before submission. The full mockup and course guidelines are not included in this repository, so exact visual agreement cannot be verified here.

## Contribution conventions

Keep documentation and commit messages in English. Make small, regular commits with messages describing the concrete change, for example `Require player and board selection before starting`. Do not commit `node_modules`, `dist`, environment files or logs; `.gitignore` excludes them. Existing history is preserved.

Document function parameters and return values where they clarify the contract, and explain state variables whose purpose is not obvious. Separate functions with a blank line and keep each function focused on one responsibility.
