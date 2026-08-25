function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function page(content, title = "NiB – Verwaltung") {
  return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>

<style>
body {
  margin: 0;
  background: #f3efe8;
  color: #29251f;
  font-family: Georgia, serif;
}

main {
  max-width: 900px;
  margin: 40px auto;
  padding: 30px 20px;
}

h1 {
  font-size: 42px;
  letter-spacing: .12em;
}

section {
  background: #fbf9f5;
  border: 1px solid #d8d0c5;
  padding: 20px;
  margin-top: 25px;
}

input,
textarea,
select,
button {
  font: inherit;
  padding: 10px;
  margin-top: 8px;
}

input,
textarea,
select {
  width: 100%;
  box-sizing: border-box;
}

textarea {
  min-height: 300px;
  resize: vertical;
}

button {
  cursor: pointer;
}

label {
  display: block;
  margin-top: 15px;
}

.message {
  padding: 12px;
  background: #eee8df;
  margin-top: 20px;
}

.folder {
  border-top: 1px solid #ddd5ca;
  padding: 18px 0;
}

.folder-actions {
  display: grid;
  gap: 8px;
}

.private {
  opacity: .75;
}
</style>
</head>

<body>
<main>
${content}
</main>
</body>
</html>`;
}


function loginPage(message = "") {
  return page(`
    <h1>NiB</h1>

    <section>
      <h2>Verwaltung</h2>

      <form method="POST">
        <input type="hidden" name="action" value="login">

        <input
          type="password"
          name="password"
          placeholder="Admin-Passwort"
          required
        >

        <button type="submit">
          Anmelden
        </button>
      </form>

      ${message ? `<p class="message">${esc(message)}</p>` : ""}
    </section>
  `);
}


function adminPage(message = "", folders = []) {
  const folderHtml = folders.length
    ? folders.map(folder => `
      <div class="folder">

        <strong>
          ${folder.is_private ? "🔒" : "📁"}
          ${esc(folder.name)}
        </strong>

        <p>
          ${folder.is_private ? "Privater Ordner" : "Öffentlicher Ordner"}
        </p>

        <div class="folder-actions">

          <form method="POST">
            <input type="hidden" name="action" value="rename_folder">
            <input type="hidden" name="id" value="${esc(folder.id)}">

            <input
              type="text"
              name="name"
              placeholder="Neuer Name"
              required
            >

            <button type="submit">
              ✏️ Umbenennen
            </button>
          </form>

          <form method="POST">
            <input type="hidden" name="action" value="toggle_folder">
            <input type="hidden" name="id" value="${esc(folder.id)}">

            <button type="submit">
              ${folder.is_private
                ? "🌐 Öffentlich machen"
                : "🔒 Privat machen"}
            </button>
          </form>

          <form method="POST">
            <input type="hidden" name="action" value="delete_folder">
            <input type="hidden" name="id" value="${esc(folder.id)}">

            <button type="submit">
              🗑️ Ordner löschen
            </button>
          </form>

        </div>
      </div>
    `).join("")
    : "<p>Noch keine Ordner vorhanden.</p>";

  const folderOptions = folders.map(folder => `
    <option value="${esc(folder.id)}">
      ${esc(folder.name)}
    </option>
  `).join("");

  return page(`
    <h1>NiB
