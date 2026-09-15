# Supabase – Findory Affiliate Portal

Dieser Ordner enthält die Backend-Vorbereitung für den Findory-Ratgeber und die moderierte Kommentarfunktion.

## Zielarchitektur

- Blogbeiträge bleiben als redaktionelle Inhalte im GitHub-Repository.
- Kommentare werden getrennt in Supabase gespeichert.
- Neue Kommentare starten mit dem Status `pending` und werden erst nach Prüfung öffentlich.
- Öffentlich sichtbare Kommentare enthalten keine privaten Kontaktdaten und werden serverseitig geschützt.
- Der Browser erhält niemals einen Service-Role-Key.

## Projektzuordnung

Die Verbindung zu einem konkreten Supabase-Projekt ist noch bewusst offen. Im Account existiert ein inaktives Projekt `Findory`; alternativ kann ein eigenes Projekt `Findory Affiliate Portal` angelegt werden. Erst nach dieser Entscheidung werden Schema, RLS und Edge Function angewendet.

## Kommentarmodell

Geplant sind die Tabellen `comments` und optional `comment_reports`. Öffentliche Leser dürfen nur freigegebene Kommentare lesen. Das Anlegen erfolgt über eine abgesicherte Edge Function mit Rate-Limit, Honeypot/Spam-Schutz und Moderationsstatus; direkte anonyme INSERT-Rechte auf der Tabelle werden nicht freigeschaltet.

## Datenschutz

Vor der Aktivierung werden Aufbewahrungsdauer, Löschprozess, Moderationsregeln, Kontaktadresse und Datenschutzerklärung festgelegt. Bis dahin bleibt die sichtbare Kommentarfunktion deaktiviert und verweist auf die Kontaktseite.
