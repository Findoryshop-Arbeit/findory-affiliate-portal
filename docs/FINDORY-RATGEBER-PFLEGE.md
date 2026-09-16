# Findory Ratgeber-Pflege

Die klickbare Ratgeberstruktur liegt bewusst als statischer Inhalt in `landingpage-preview/data.js`. Das ist für GitHub Pages sicher und einfach: Es gibt keinen öffentlichen Bearbeitungszugang, keine erfundenen Produktdaten und eine klare Struktur für spätere Produktempfehlungen mit Affiliate-Links.

## Neues Thema ergänzen

1. Im passenden Objekt in `FINDORY_TOPICS` ein neues Unterthema in `subtopics` ergänzen.
2. Für einen Vergleich ein neues Objekt in `FINDORY_GUIDES` anlegen.
3. `topicId` und `itemId` müssen genau zu dem Thema passen, damit der Ratgeber auf der richtigen Unterseite erscheint.
4. Nach Recherche konkrete Marken, Fakten, Testergebnisse und Preise ergänzen. Jedes aufgenommene Vergleichsprodukt erhält dabei seinen eigenen Affiliate-Link.

## Späterer Admin-Bereich

Ein Browser-Editor mit Login ist erst sinnvoll, wenn die Inhalte und der gewünschte Workflow feststehen. Dafür kann Supabase später als abgesichertes Redaktions-Backend ergänzt werden. Bis dahin bleibt die Datenstruktur transparent, versioniert und ohne unnötigen Login-Aufwand.
