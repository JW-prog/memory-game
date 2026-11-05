# Memory — Vorlage nach den Designbildern

## Ablauf

1. Startseite: anthrazit, It's play time, Ready to play, gelber Play-Button und animierter Controller unten links.
2. Settings: Theme, Spieler und Kartenanzahl links; Vorschau und Start rechts.
3. Spielfeld: je nach Auswahl 4 × 4, 4 × 6 oder 6 × 6. Punktestand, aktueller Spieler und Exit game stehen oben.
4. Game over mit finalem Punktestand. Weiter führt zur Gewinneranzeige.
5. Gewinner oder Unentschieden, Konfetti, Back to start und Noch eine Runde.

Die Spielfeldgrößen sind wählbare Varianten, keine automatisch aufeinanderfolgenden Level. Code vibes und Gaming sind spielbar. DA Projects und Foods sind als deaktivierte Vorlagenoptionen markiert.

## Noch benötigte Bilder

Die gelieferten Kartenkomponenten und Konfetti sind eingebunden. Code vibes hat jetzt 18 eigene Coding-Motive und ist bis 36 Karten vollständig bebildert. Gaming hat zwei Motive; dafür fehlen noch 16. Nummerierte Platzhalter ermöglichen vorerst alle Größen. Ideal: einzelne quadratische Motive als PNG, WebP oder SVG, etwa 256 × 256 Pixel. Kleinere Dateien sind aktuell nicht nötig.

Die Gewinnerfigur verwendet vorläufig ein skalierbares Schachbauern-Zeichen. Eine separate Gewinnerfigur und gegebenenfalls eine Unentschieden-Grafik können nach Lieferung eingebaut werden. Die Vorschau ist aus bedienbarer Oberfläche und den vorhandenen Karten zusammengesetzt. Nicht verwendete PNG-Exporte wurden entfernt; die benötigten Kartenbilder, der Play-Button, Controller und Konfetti bleiben erhalten.

## Start und Prüfung

- `npm.cmd run dev`
- `npm.cmd run build`
- `node --test tests/game.test.cjs` (Node.js ab 22.13)

TypeScript und Build erfolgreich. Sieben automatisierte Tests prüfen Themen/Größen, Bildpfade, Kartendrehung über document.getElementById, Paarwertung, Zugwechsel, Klicksperre, Abbruch, Game-over-/Gewinnerabfolge, Unentschieden und Neustart. Die Tests verwenden eine DOM-Nachbildung; ein visueller Browsertest steht aus.

## Extras und offene Abgleiche

Responsive Darstellung, Tastatursteuerung, Screenreader-Beschriftungen, Unterstützung reduzierter Animationen. Die Kursdokumente für HTML-/TypeScript-Konventionen waren nicht abrufbar; der genaue Abgleich bleibt offen. Die Vorlage folgt den gesendeten Screenshots, die exakte Darstellung muss noch im Browser mit den finalen Bildern abgeglichen werden.

Das Projekt ist lokal, nicht eingereicht oder veröffentlicht.


Beim Verlassen des Spiels erscheint eine Rückfrage. Der gelieferte Back-to-game-Button mit Hover-Grafik führt zur laufenden Runde zurück. Kartenrückseiten verwenden jetzt die einzelnen Exporte. Angular Icon 1.png und Exit game.png sind zusätzliche Einzelexporte bereits enthaltener Motive bzw. Beschriftungen und bleiben als Vorlagen erhalten.

