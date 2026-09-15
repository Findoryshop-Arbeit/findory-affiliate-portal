# Findory Affiliate Portal

Problemorientiertes Affiliate-Portal für praktische Lösungen im Alltag.

## Ziel

Findory erkennt konkrete Alltagsprobleme, ordnet belastbare Signale ein und zeigt nachvollziehbare Lösungswege. Produkte sind nachgelagerte Lösungskandidaten – kein beliebiger Produktkatalog.

## Dynamisches Konzept

Die vier V1-Kategorien sind nur der Start. Die Startseite erzeugt Kategorien und Problemkarten aus content/categories.json und content/problems.json. Neue Kategorien und Problemarten werden dadurch als Daten ergänzt und benötigen keinen HTML-Umbau.

Aktive Problemseiten erscheinen im Katalog. Ältere oder abgelöste Themen werden nicht gelöscht, sondern mit visibility archived im Problemarchiv weitergeführt. Die Archivseite bleibt durchsuchbar und verlinkt weiterhin auf die jeweilige Lösungsseite.

## Startbestand

- Wohnen & Sparen
- Sicherheit & Vorsorge
- Gesund arbeiten & leben
- Alltag leichter machen

Diese Kategorien sind erweiterbar und nicht als endgültige Informationsarchitektur zu verstehen.

## Aktueller MVP

- Responsive Landingpage mit Hero, Suche, dynamischen Kategorien, Problemkarten, Vertrauensleiste und Footer.
- Dynamische Kategorie- und Problemseiten.
- Durchsuchbares Problemarchiv mit archivbewusster Suche.
- Vier Kategorien und 16 Start-Probleme liegen als JSON unter content/.
- Externe Bildprompts und Asset-Anforderungen liegen unter docs/.
- Impressum, Datenschutz, Kontakt und Affiliate-Hinweis sind als Entwürfe vorbereitet.
- Kein optionales Tracking, kein Newsletterversand und keine öffentliche Auslieferung eingerichtet.

## Struktur

- index.html – semantische Landingpage-Struktur
- app.js – dynamische Kategorien, aktive Probleme und Suche
- category.html und category.js – dynamische Kategorieansichten
- problem.html und problem.js – einzelne, slug-basierte Problemseiten
- archive.html und archive.js – Archiv und Archivsuche
- content/ – strukturierte Kategorien und Problemkarten
- docs/CONTENT_MODEL.md – Redaktionsmodell für Erweiterungen und Archivierung
- docs/ – technische Hinweise, offene Assets und Bildprompts
- public/ – reserviert für geprüfte Web-Assets

## Redaktionsprinzip

Erst Problem und Evidenz, dann Lösung und Affiliate-Angebot. Keine erfundenen Tests, Preise, Bewertungen oder persönlichen Erfahrungen. Affiliate-Hinweise stehen unmittelbar bei relevanten Links. Archivieren statt Löschen, damit alte Lösungen auffindbar bleiben.

## Hosting

Das Repository bleibt bis zur Funktions-, Inhalts- und Rechtsprüfung privat. Cloudflare wird erst nach lokaler End-to-End-Prüfung und Readback als Auslieferung eingerichtet.
