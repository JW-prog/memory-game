# Memory - Pruefung vor der Einreichung

Pruefdatum: 6. November 2026.

| Kriterium | Stand |
| --- | --- |
| Homescreen und Button zu Settings | Implementiert; genauer Designabgleich im Browser offen. |
| Positionierter, animierter Controller | In CSS implementiert; visueller Test offen. |
| Zwei Spielerfarben | Blau und Orange waehlbar; bestimmen den Startspieler. |
| Drei Spielfeldgroessen | 16, 24, 36 Karten mit vier bzw. sechs Spalten: 4x4, 4x6, 6x6. |
| Mindestens zwei Themes | Code vibes und Gaming waehlbar. |
| Eigene Farben und Motive | Beide Themes haben eigene Farben, Rueckseiten und 18 Motive. |
| Punkte, aktueller Spieler, Exit | Implementiert; Punkte und Zugwechsel automatisiert geprueft. |
| Fluessige Kartendrehung | CSS-Drehanimation vorhanden; visueller Test offen. |
| Game over mit Punktestand | Implementiert. |
| Gewinner mit meisten Punkten | Automatisiert geprueft; Unentschieden beruecksichtigt. |
| Neue Runde | Home -> Settings -> Start; direkter Neustart zusaetzlich bei Code vibes. |
| HTML-/TypeScript-Kurskonventionen | Konkrete Kursdokumente fehlen; vollstaendiger Abgleich offen. |

## Korrekturen

- Falschen Bildpfad beim Unentschieden im Coding-Theme korrigiert.
- Beschaedigte Umlaute und Beschriftungen korrigiert.
- HTML-Templates aufgeteilt und Settings-Auswahl in eigene Funktionen ausgelagert.
- Bildpfadpruefung fuer beide Themes und alle Ansichten inklusive exakter Dateischreibweise ergaenzt.
- Gaming-Ergebnisse ohne Konfetti und direkten Neustart geprueft; Home bleibt verfuegbar.

Build und alle neun Tests erfolgreich. Vor Einreichung Desktop-/Mobilansichten, Animationen und Tastaturbedienung in einem echten Browser testen und Kurskonventionen abgleichen. Extras fuer Mentoren stehen in README.md.
