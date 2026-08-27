# NiB Archiv – modulare Worker-Struktur

Diese Version ist aus der bestehenden NiB-`index.js` (4.935 Zeilen) strukturell herausgelöst. `index.js` bleibt der Cloudflare-Worker-Einstiegspunkt.

## Dateien
- `index.js` – Worker / Routing
- `helpers.js` – Grundfunktionen
- `html.js` – `page()` und bestehendes Design/CSS
- `public.js` – öffentliche Website und Textseiten
- `admin-pages.js` – Admin-Oberflächen
- `db.js` – D1, Migrationen, Benachrichtigungen und Papierkorb-Wartung
- `cloudinary.js` – Cloudinary Upload/Löschen
- `session.js` – Admin- und Besuchersession

## Wichtig
Die bestehende `wrangler.jsonc`/`wrangler.toml` bleibt im Hauptprojekt und muss weiterhin `./index.js` als `main` verwenden.

Für die Passwortänderung über die Cloudflare Secrets API benötigt der Worker zusätzlich die Secrets `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` und `CLOUDFLARE_SCRIPT_NAME`. Der API-Token benötigt Workers Scripts Write.
