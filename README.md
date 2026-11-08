# Memory

Memory für zwei Spieler mit den Themes **Code vibes theme** und **Gaming theme**. Beide Themes bieten 18 Motive sowie 16, 24 oder 36 Karten.

## Lokal starten und prüfen

Voraussetzung: Node.js ab 22.13 für die Tests; die aktuelle Vite-Version benötigt Node.js 22.12+ beziehungsweise einen unterstützten neueren Versionszweig.

```sh
npm.cmd install
npm.cmd run dev
npm.cmd run build
node --test tests/game.test.cjs
```

Unter macOS und Linux kann `npm` statt `npm.cmd` verwendet werden.

## Spielablauf

1. Der Play-Button auf der Startseite öffnet die Einstellungen.
2. Theme, Startspieler (Blau oder Orange) und Kartenzahl auswählen.
3. Start öffnet das Spielfeld: 4 × 4, 6 × 4 oder 6 × 6 Karten.
4. Ein gefundenes Paar gibt einen Punkt und einen weiteren Zug. Bei unterschiedlichen Motiven wechselt der Spieler.
5. Nach dem letzten Paar erscheint „Game over“ mit dem Endpunktestand. Nach drei Sekunden folgt die Gewinner- oder Unentschieden-Ansicht.
6. Der Home-/Back-to-start-Button führt zur Startseite. Eine neue Runde beginnt über die Einstellungen. Es gibt bei beiden Themes keinen direkten „Noch eine Runde“-Link.

„Exit game“ öffnet einen Bestätigungsdialog. Die Rückkehr zum Spiel erhält den Spielstand; der bestätigte Abbruch öffnet die Einstellungen.

## Extras für Mentoren

- Bestätigungsdialog beim Verlassen einer laufenden Runde.
- Eigene Anzeige bei Unentschieden.
- Animierte Icons auf den Startbuttons und Hover-Effekte auf beiden Kartenvorschauen.
- Hover-Vorschau der Radiobuttons; die Auswahl ändert sich erst beim Klicken.
- Konfetti bei Siegen im Code-vibes-Theme.
- Tastaturbedienung, Fokusführung und Screenreader-Beschriftungen.
- Responsive Layouts und Unterstützung reduzierter Bewegung.
- Automatisierte Tests für Spiellogik, Spielende, Neustart und Bildpfade aller Ansichten einschließlich exakter Dateischreibweise.

## Checkliste und Prüfgrenzen

Die funktionalen Anforderungen der fünf User Stories sind im Code umgesetzt: Startseite mit Navigation, zwei Spielerfarben, drei Spielfeldgrößen, zwei Themes mit unterschiedlichen Farben und Motiven, Spielleiste, Kartenanimation, Endpunktestand und Gewinneranzeige. Neue Runden sind über die Startseite möglich.

Der Build enthält die strikte TypeScript-Prüfung. Die automatisierten Tests verwenden eine DOM-Nachbildung; sie prüfen keine tatsächliche Browserdarstellung und keine wahrgenommene Flüssigkeit der Animationen. Ein visueller Abgleich aller Ansichten und Bildschirmgrößen bleibt vor der Abgabe erforderlich.

Die konkreten HTML- und TypeScript-Kursrichtlinien liegen im Projekt nicht vor. Ihre vollständige Einhaltung und eine pixelgenaue Übereinstimmung mit der Original-Designvorgabe sind deshalb nicht bestätigt.

Das Projekt wurde nicht eingereicht oder veröffentlicht.

## Projektstruktur und Anpassungen aus dem Review

- `src/main.ts`: Einstieg und Styles.
- `src/app.ts`: Navigation, Einstellungen, Rundenablauf und Ereignisse.
- `src/templates.ts`: HTML-Vorlagen mit expliziten Parametern.
- `src/types.ts`: gemeinsame Typen.
- `src/themes.ts`: Themes und Kartenmotive.
- `src/assets.ts`: Asset-Pfade unter Beachtung des Vite-Basispfads.
- `src/styles/style.scss`: Einstieg fuer geordnete SCSS-Teilbereiche.
- `tests/game.test.cjs`: Spielregeln, Asset-Pfade und Einstellungsregressionen; `npm test`.

Die Einstellungen aktualisieren Vorschau und Zusammenfassung ohne Neuaufbau der Seite. Theme-Hover und Tastaturfokus zeigen eine temporaere Vorschau; die Auswahl wird erst durch die Radioauswahl gespeichert. Spieler und Kartenzahl stehen sichtbar in den vorgesehenen Zusammenfassungsfeldern. Die Hauptueberschriften sind sichtbarer Text. Bei Kartenflips entfaellt der zusaetzliche zeitversetzte Sichtbarkeitswechsel; Ergebnisanimationen beginnen mit sichtbarem Inhalt.

Offen fuer den Designabgleich: Das Review-Transkript benennt fehlende Shapes, Icons und ein Video durch Ortsverweise im nicht vorliegenden Video. Ohne diese Referenz ist keine verlaessliche Zuordnung moeglich. Es wurde kein Video erfunden oder hinzugefuegt. Die visuelle Darstellung und Animationen muessen noch im Browser mit der Designvorlage verglichen werden.
