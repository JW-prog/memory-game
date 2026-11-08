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
