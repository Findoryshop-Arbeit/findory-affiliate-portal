# Findory – Sicherheitsbaseline

Stand: 16.09.2026

## Supabase

Das Projekt nutzt das bestehende Supabase-Projekt **Findory**. Die bestehende Teststruktur bleibt unangetastet; Kommentare liegen in der separaten Tabelle `public.comments`.

- Row Level Security ist aktiviert.
- Öffentlich lesbar sind ausschließlich freigegebene und nicht abgelaufene Kommentare.
- Direkte öffentliche Schreibzugriffe auf `comments` sind gesperrt.
- Das Absenden läuft über die Edge Function `submit-comment` mit JWT-Prüfung.
- Ein Kommentar erfordert ein angemeldetes Konto mit bestätigter E-Mail-Adresse.
- Die eingereichte E-Mail muss serverseitig mit der bestätigten Konto-E-Mail übereinstimmen.
- Die E-Mail-Adresse wird nicht in `comments` gespeichert und nicht öffentlich angezeigt; gespeichert wird nur die interne Auth-Referenz `author_id`.
- Pro Konto sind höchstens fünf neue Kommentare innerhalb von zehn Minuten vorgesehen.
- Freigabe erfolgt zunächst manuell über den Status `pending`.

## Browser und Schlüssel

Der Client verwendet ausschließlich den öffentlichen Supabase-Schlüssel. Der Service-Role-Schlüssel darf nur als serverseitiges Secret in der Edge Function liegen und gehört nicht in HTML, JavaScript oder GitHub.

## CORS und Veröffentlichung

Die Funktion antwortet nur dann browserseitig mit einer Origin-Freigabe, wenn die Umgebungsvariable `FINDORY_ALLOWED_ORIGIN` exakt auf die spätere Findory-Domain gesetzt ist. Bis zur Konfiguration von Auth, Domain und CORS bleibt die öffentliche Kommentarabgabe deaktiviert.

## Offene Sicherheitsaufgabe

Im Supabase-Dashboard sollte vor einer späteren Auth-Aktivierung zusätzlich der Schutz gegen kompromittierte Passwörter aktiviert werden. Das ist eine allgemeine Auth-Einstellung und kein Ersatz für die serverseitige E-Mail-Prüfung.
