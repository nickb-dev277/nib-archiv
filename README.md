# NiB Archiv – modulare Struktur

Diese Version zerlegt die bestehende `index.js` strukturell in mehrere ES-Module.
Die ursprüngliche `index.js` mit 4.935 Zeilen ist die alleinige Code-Grundlage; die Aufteilung ändert keine bestehenden Funktionen absichtlich.

## Dateien

- `index.js` – Cloudflare-Worker-Einstiegspunkt und Routing
- `helpers.js` – Grundfunktionen, Cookies und Responses
- `html.js` – `page()` und globales HTML/CSS
- `public.js` – öffentliche Seiten
- `admin-pages.js` – Login und Admin-Oberflächen
- `db.js` – D1-Zugriffe
- `cloudinary.js` – Cloudinary-Upload
- `session.js` – Admin-Session und Besucher-ID

## Cloudflare / Wrangler

Der Wrangler-Eintrag `main` muss auf `index.js` zeigen, wenn diese Dateien im selben Verzeichnis liegen.

Beispiel:

```jsonc
{
  "name": "nib-archiv",
  "main": "./index.js",
  "compatibility_date": "DEIN-BESTEHENDES-DATUM"
}
```

Nicht das bestehende `wrangler.jsonc` ersetzen, wenn darin bereits D1/KV/Secrets/Variablen konfiguriert sind. Nur prüfen, dass `main` auf den neuen `index.js`-Einstiegspunkt zeigt.

## Lokal prüfen

```bash
npx wrangler dev
```

## Deployment

```bash
npx wrangler deploy
```

Wrangler bündelt statisch importierte Module standardmäßig beim Deployment.
