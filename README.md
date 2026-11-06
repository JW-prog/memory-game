# Memory

Memory fuer zwei Spieler mit Code vibes und Gaming. Beide Themes bieten 18 Motive und 16, 24 oder 36 Karten. DA Projects und Foods sind deaktivierte Zusatzoptionen.

## Start und Pruefung

- `npm.cmd run dev`
- `npm.cmd run build`
- `node --test tests/game.test.cjs` (Node.js ab 22.13)

Startseite -> Settings -> Spielfeld -> Game over mit Punktestand -> Gewinner oder Unentschieden.

Die gewaehlte Farbe bestimmt den Startspieler. Ein Paar gibt einen Punkt und einen weiteren Zug; sonst wechselt der Spieler. Home fuehrt zur Startseite und ermoeglicht eine neue Runde ueber Settings. Code vibes bietet zusaetzlich einen direkten Neustart. Beim Gaming sind Konfetti und direkter Neustart auf Wunsch entfernt.

## Extras fuer Mentoren

- Abbruchdialog mit Rueckkehr zum laufenden Spiel.
- Tastaturbedienung, Fokusfuehrung und Screenreader-Beschriftungen.
- Responsive Layouts und Unterstuetzung reduzierter Animationen.
- Gewinner- und Unentschieden-Ansichten mit PNG-Grafiken.
- Neun automatisierte Tests fuer Spiellogik, Neustart und Bildpfade aller Ansichten inklusive exakter Dateischreibweise.

## Pruefstand

Build, TypeScript-Pruefung und alle neun Tests erfolgreich. Die Tests verwenden eine DOM-Nachbildung. Visueller Browsertest und Abgleich mit den konkreten HTML-/TypeScript-Kursrichtlinien stehen aus; diese Richtlinien liegen im Projekt nicht vor.

Details: [CHECKLISTE.md](CHECKLISTE.md). Das Projekt wurde nicht eingereicht oder veroeffentlicht.
