# Memory — Vorlage nach den Designbildern

## Ablauf

1. Startseite: anthrazit, It's play time, Ready to play, gelber Play-Button und animierter Controller unten links.
2. Settings: Theme, Spieler und Kartenanzahl links; Vorschau und Start rechts.
3. Spielfeld: je nach Auswahl 4 × 4, 4 × 6 oder 6 × 6. Punktestand, aktueller Spieler und Exit game stehen oben.
4. Game over mit finalem Punktestand. Weiter führt zur Gewinneranzeige.
5. Gewinner oder Unentschieden, Konfetti, Back to start und Noch eine Runde.

Die Spielfeldgrößen sind wählbare Varianten, keine automatisch aufeinanderfolgenden Level. Code vibes und Gaming sind spielbar. DA Projects und Foods sind als deaktivierte Vorlagenoptionen markiert.

## Noch benötigte Bilder

Code vibes und Gaming haben jeweils 18 eigene Motive und sind bis 36 Karten vollst?ndig bebildert. Gaming verwendet die neuen einzelnen Kartenexporte und eine Match-Grafik f?r das Kreis-Motiv. Der Gaming-Abbruchdialog verwendet die pinken Buttons mit Hover-Zust?nden.

Die Gewinneranzeige verwendet Player.png, bei Unentschieden Scale_Icon.png. Die Vorschau wird aus der Oberfl?che und den vorhandenen Karten zusammengesetzt. Ungenutzte und ersetzte PNG-Exporte wurden aus public/assets entfernt.

## Start und Prüfung

- `npm.cmd run dev`
- `npm.cmd run build`
- `node --test tests/game.test.cjs` (Node.js ab 22.13)

TypeScript und Build erfolgreich. Sieben automatisierte Tests prüfen Themen/Größen, Bildpfade, Kartendrehung über document.getElementById, Paarwertung, Zugwechsel, Klicksperre, Abbruch, Game-over-/Gewinnerabfolge, Unentschieden und Neustart. Die Tests verwenden eine DOM-Nachbildung; ein visueller Browsertest steht aus.

## Extras und offene Abgleiche

Responsive Darstellung, Tastatursteuerung, Screenreader-Beschriftungen, Unterstützung reduzierter Animationen. Die Kursdokumente für HTML-/TypeScript-Konventionen waren nicht abrufbar; der genaue Abgleich bleibt offen. Die Vorlage folgt den gesendeten Screenshots, die exakte Darstellung muss noch im Browser mit den finalen Bildern abgeglichen werden.

Das Projekt ist lokal, nicht eingereicht oder veröffentlicht.


Beim Verlassen des Spiels erscheint eine R?ckfrage. Pop up button.png f?hrt zur laufenden Runde zur?ck; Exit game dialog.png best?tigt den Abbruch. Kartenr?ckseiten verwenden die einzelnen Exporte.
