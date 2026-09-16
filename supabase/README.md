# Supabase – Findory Affiliate Portal

Dieser Ordner enthält die Backend-Vorbereitung für den Findory-Ratgeber und die moderierte Kommentarfunktion.

## Zielarchitektur

- Blogbeiträge bleiben als redaktionelle Inhalte im GitHub-Repository.
- Kommentare werden getrennt in Supabase gespeichert.
- Neue Kommentare starten mit dem Status `pending` und werden erst nach Prüfung öffentlich.
- Öffentlich sichtbare Kommentare enthalten keine privaten Kontaktdaten und werden serverseitig geschützt.
- Der Browser erhält niemals einen Service-Role-Key.

## Projektzuordnung

Das bestehende Supabase-Projekt `Findory` wird verwendet. Der Browser erhält ausschließlich einen veröffentlichten Schlüssel; privilegierte Datenbankzugriffe bleiben in Edge Functions.

## Kommentarmodell

Geplant sind die Tabellen `comments` und optional `comment_reports`. Öffentliche Leser dürfen nur freigegebene Kommentare lesen. Das Anlegen erfolgt über eine abgesicherte Edge Function mit Rate-Limit, Honeypot/Spam-Schutz und Moderationsstatus; direkte anonyme INSERT-Rechte auf der Tabelle werden nicht freigeschaltet.

## Datenschutz

Vor der Aktivierung werden Aufbewahrungsdauer, Löschprozess, Moderationsregeln, Kontaktadresse und Datenschutzerklärung festgelegt. Bis dahin bleibt die sichtbare Kommentarfunktion deaktiviert und verweist auf die Kontaktseite.

## Interner Review-Modus

Der Review-Modus ist eine private Arbeitsoberfläche für die Projektverwaltung und wird nur aktiviert, wenn einer Landingpage-URL `?review=1` angehängt ist. Sie speichert Hinweise in `public.review_notes` ausschließlich über die JWT-geschützte Edge Function `findory-admin`.

- Direkter Tabellenzugriff für `anon` und `authenticated` ist gesperrt; eine explizite RLS-Policy verweigert ihn zusätzlich.
- Die Funktion akzeptiert nur die bestätigte Projektverwaltungs-E-Mail und antwortet browserseitig nur an die GitHub-Pages-Origin.
- `landingpage-preview/review.js` setzt `create_user: false`; ein unbekannter Besucher kann somit kein Auth-Konto anlegen.
- Vor dem ersten Login muss im Supabase-Dashboard unter **Authentication → URL Configuration** die GitHub-Pages-URL `https://findoryshop-arbeit.github.io/findory-affiliate-portal/landingpage-preview/index.html` als zulässige Redirect-URL eingetragen sein. Für interne Links wird `?review=1` automatisch erhalten.
