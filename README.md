# Findory Affiliate Portal

Problemorientiertes Affiliate-Portal für praktische Lösungen im Alltag.

## Ziel

Findory erkennt konkrete Alltagsprobleme, ordnet belastbare Signale ein und zeigt nachvollziehbare Lösungswege. Produkte sind nachgelagerte Lösungskandidaten – kein beliebiger Produktkatalog.

## Visuelle Leitidee

Die Landingpage folgt der freigegebenen Referenz: ruhiger weißer Header, wohnlicher Hero-Bereich, klare Suche, vier farblich getrennte Themenbereiche mit Problemkarten, dezente handschriftliche Akzente und ein dunkler Footer.

## V1-Kategorien

- Wohnen & Sparen
- Sicherheit & Vorsorge
- Gesund arbeiten & leben
- Alltag leichter machen

## Aktueller MVP

- Responsive statische Landingpage mit Hero, Suche, vier Themenbereichen, Vertrauensleiste und Footer.
- Kategorien und 16 Problemkarten liegen als JSON unter content/.
- app.js lädt diese Inhalte datengetrieben und filtert sie lokal über die Suche.
- Bildbereiche sind bis zur externen Erstellung bewusst Platzhalter.
- Asset-Anforderungen und Benennungsregeln stehen in docs/ASSETS_NEEDED.md.

## Struktur

- index.html – semantische Landingpage-Struktur
- styles.css – responsives visuelles System
- app.js – Inhaltsladung und Suche
- content/ – strukturierte Kategorien und Problemkarten
- docs/ – technische Hinweise, offene Assets und Prüfhinweise
- public/ – reserviert für geprüfte Web-Assets

## Regeln

- Erst Problem und Evidenz, dann Lösung und Affiliate-Angebot.
- Keine erfundenen Tests, Preise, Bewertungen oder persönlichen Erfahrungen.
- Affiliate-Hinweise unmittelbar bei relevanten Links.
- Keine Secrets, Tokens oder Zugangsdaten im Repository.
- Cloudflare-Deployment erst nach funktionierendem Build, End-to-End-Prüfung und Readback.

## Noch offen

Echte Bildassets mit Lizenznachweis, fünf priorisierte Problemseiten, rechtssichere Stammdaten für Impressum/Datenschutz/Kontakt und eine lokale End-to-End-Prüfung vor jeder Veröffentlichung.

Das bestehende Findory-Shop-Projekt bleibt getrennt und unverändert.
