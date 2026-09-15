# Dynamisches Inhalts- und Archivmodell

## Ziel

Die vier V1-Kategorien sind keine Begrenzung. Die Startseite erzeugt sichtbare Kategorien und Problemkarten aus JSON-Daten. Neue Kategorien und neue Problemarten benötigen deshalb keinen HTML-Umbau.

## Kategorien

Neue Einträge kommen in content/categories.json. Benötigte Felder:

- slug: eindeutige URL-Kennung, zum Beispiel neue-wohnbeduerfnisse
- title: sichtbarer Kategoriename
- description: kurze Einordnung
- tone: mint, blue, yellow oder coral; weitere Farbtöne können später ergänzt werden
- icon: kurzer visueller Marker
- order: Reihenfolge auf der Startseite
- status: mvp, active, archived oder hidden

Kategorien mit status archived oder hidden werden nicht im aktiven Katalog ausgegeben.

## Probleme

Neue Einträge kommen in content/problems.json. Benötigte Felder:

- slug: eindeutige URL-Kennung
- category: slug der zugehörigen Kategorie
- title, problem und summary: sichtbarer Inhalt
- tags: Suchbegriffe
- asset: späterer Pfad zum geprüften Bildasset oder null
- visibility: active oder archived; fehlt das Feld, gilt der Eintrag als aktiv
- archivedAt: optionales Archivdatum
- status: redaktioneller Bearbeitungsstand, zum Beispiel content-needed

Die Startseite und Kategorieansichten zeigen nur aktive, nicht ausgeblendete Probleme. Die Archivseite liest dieselben Daten und zeigt alle Einträge mit visibility archived oder status archived. Die einzelne problem.html-Seite bleibt über ihren Slug erreichbar.

## Archivieren statt Löschen

Ein altes Problem wird nicht gelöscht. Es erhält visibility archived und optional archivedAt. Dadurch bleibt die URL und die Lösungsseite auffindbar, während das Thema aus dem aktiven Katalog verschwindet.

## Redaktionsablauf

1. Neues Problem oder neue Kategorie als Datensatz ergänzen.
2. Inhalte, Quellen, Bildlizenz und Status prüfen.
3. visibility auf active setzen und lokal testen.
4. Bei Überarbeitung oder Ablösung visibility auf archived setzen.
5. Erst danach kontrolliert veröffentlichen.

## Technische Grenze der aktuellen V1

Das ist bereits dynamische, datengetriebene Seitenausgabe, aber noch kein Redaktions-CMS. Die Daten liegen zunächst als versionierte JSON-Dateien in GitHub. Später kann dieselbe Struktur an ein CMS, eine Datenbank oder eine Cloudflare-Datenquelle angeschlossen werden, ohne die Seitenlogik grundsätzlich neu zu bauen.
