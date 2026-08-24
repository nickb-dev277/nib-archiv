function adminPage(message = "", folders = []) {
  const folderList = folders.length
    ? folders.map(folder => `
      <div class="folder">
        <div class="folder-name">
          <strong>${html(folder.name)}</strong>
          <div class="small">
            ${folder.is_private ? "🔒 Privat" : "🌐 Öffentlich"}
          </div>
        </div>

        <form method="POST">
          <input type="hidden" name="action" value="rename_folder">
          <input type="hidden" name="id" value="${html(folder.id)}">
          <input
            type="text"
            name="name"
            placeholder="Neuer Name"
            required
          >
          <button type="submit">Umbenennen</button>
        </form>

        <form method="POST">
          <input type="hidden" name="action" value="toggle_folder">
          <input type="hidden" name="id" value="${html(folder.id)}">
          <button type="submit">
            ${folder.is_private ? "Öffentlich machen" : "Privat machen"}
          </button>
        </form>

        <form method="POST">
          <input type="hidden" name="action" value="delete_folder">
          <input type="hidden" name="id" value="${html(folder.id)}">
          <button type="submit">Löschen</button>
        </form>
      </div>
    `).join("")
    : "<p>Noch keine Ordner vorhanden.</p>";

  return layout(`
${message ? `<p class="message">${html(message)}</p>` : ""}

<section>
<h2>📁 Ordner</h2>

<form method="POST">
<input type="hidden" name="action" value="create_folder">

<input
  type="text"
  name="name"
  placeholder="Neuer Ordner"
  required
>

<button type="submit">➕ Ordner erstellen</button>
</form>

<div>
${folderList}
</div>

</section>

<section>
<h2>📝 Neuer Text</h2>

<form method="POST">

<input type="hidden" name="action" value="create_text">

<label>
Titel
<input
  type="text"
  name="title"
  placeholder="Titel"
  required
>
</label>

<label>
Ordner
<select name="folder_id">

<option value="">Ohne Ordner</option>

${folders.map(folder => `
<option value="${html(folder.id)}">
${html(folder.name)}
</option>
`).join("")}

</select>
</label>

<label>
Sichtbarkeit
<select name="visibility">
<option value="public">🌐 Öffentlich</option>
<option value="semi_private">🔑 Halbprivat</option>
<option value="private">🔒 Privat</option>
</select>
</label>

<label>
Inhalt
<textarea
  name="content"
  placeholder="Hier deinen Text schreiben..."
  required
></textarea>
</label>

<button type="submit">💾 Text speichern</button>

</form>
</section>
`);
}
async function getFolders(env) {
  const result = await env.DB.prepare(`
    SELECT id, name, is_private
    FROM folders
    WHERE deleted_at IS NULL
    ORDER BY name COLLATE NOCASE
  `).all();

  return result.results || [];
}

function getSession(request) {
  const cookie = request.headers.get("Cookie") || "";

  const match = cookie.match(
    /(?:^|;\s*)nib_session=([^;]+)/
  );

  return match ? match[1] : null;
}

export default {

  async fetch(request, env) {

    const session = getSession(request);

    if (session) {

      const valid = await env.SESSIONS.get(session);

      if (valid === "admin")
      {if (request.method === "POST") {

          const form = await request.formData();
          const action = String(form.get("action") || "");

          if (action === "create_folder") {

            const name = String(form.get("name") || "").trim();

            if (!name) {
              const folders = await getFolders(env);

              return new Response(
                adminPage("❌ Der Ordner braucht einen Namen.", folders),
                {
                  headers: {
                    "content-type": "text/html; charset=UTF-8"
                  }
                }
              );
            }

            const id = crypto.randomUUID();
            const now = new Date().toISOString();

            await env.DB.prepare(`
              INSERT INTO folders
              (id, name, is_private, created_at, updated_at, deleted_at)
              VALUES (?, ?, 0, ?, ?, NULL)
            `)
            .bind(id, name, now, now)
            .run();

            const folders = await getFolders(env);

            return new Response(
              adminPage("✅ Ordner erstellt.", folders),
              {
                headers: {
                  "content-type": "text/html; charset=UTF-8"
                }
              }
            );
          }

          if (action === "rename_folder") {

            const id = String(form.get("id") || "");
            const name = String(form.get("name") || "").trim();

            if (id && name) {
              await env.DB.prepare(`
                UPDATE folders
                SET name = ?, updated_at = ?
                WHERE id = ? AND deleted_at IS NULL
              `)
              .bind(
                name,
                new Date().toISOString(),
                id
              )
              .run();
            }

            const folders = await getFolders(env);

            return new Response(
              adminPage("✅ Ordner umbenannt.", folders),
              {
                headers: {
                  "content-type": "text/html; charset=UTF-8"
                }
              }
            );
          }

          if (action === "toggle_folder") {

            const id = String(form.get("id") || "");

            await env.DB.prepare(`
              UPDATE folders
              SET is_private =
                CASE
                  WHEN is_private = 1 THEN 0
                  ELSE 1
                END,
                updated_at = ?
              WHERE id = ? AND deleted_at IS NULL
            `)
            .bind(
              new Date().toISOString(),
              id
            )
            .run();

            const folders = await getFolders(env);

return new Response(
  adminPage("✅ Sichtbarkeit geändert.", folders),
  {
    headers: {
      "content-type": "text/html; charset=UTF-8"
    }
  }
);

if (request.method === "POST") {

  const form = await request.formData();
  const action = String(form.get("action") || "");

  if (action === "create_folder") {

    const name = String(form.get("name") || "").trim();

            if (!name) {
              const folders = await getFolders(env);

              return new Response(
                adminPage("❌ Der Ordner braucht einen Namen.", folders),
                {
                  headers: {
                    "content-type": "text/html; charset=UTF-8"
                  }
                }
              );
            }

            const id = crypto.randomUUID();
            const now = new Date().toISOString();

            await env.DB.prepare(`
              INSERT INTO folders
              (id, name, is_private, created_at, updated_at, deleted_at)
              VALUES (?, ?, 0, ?, ?, NULL)
            `)
            .bind(id, name, now, now)
            .run();

            const folders = await getFolders(env);

            return new Response(
              adminPage("✅ Ordner erstellt.", folders),
              {
                headers: {
                  "content-type": "text/html; charset=UTF-8"
                }
              }
            );
          }

          if (action === "rename_folder") {

            const id = String(form.get("id") || "");
            const name = String(form.get("name") || "").trim();

            if (id && name) {
              await env.DB.prepare(`
                UPDATE folders
                SET name = ?, updated_at = ?
                WHERE id = ? AND deleted_at IS NULL
              `)
              .bind(
                name,
                new Date().toISOString(),
                id
              )
              .run();
            }

            const folders = await getFolders(env);

            return new Response(
              adminPage("✅ Ordner umbenannt.", folders),
              {
                headers: {
                  "content-type": "text/html; charset=UTF-8"
                }
              }
            );
          }

          if (action === "toggle_folder") {

            const id = String(form.get("id") || "");

            await env.DB.prepare(`
              UPDATE folders
              SET is_private =
                CASE
                  WHEN is_private = 1 THEN 0
                  ELSE 1
                END,
                updated_at = ?
              WHERE id = ? AND deleted_at IS NULL
            `)
            .bind(
              new Date().toISOString(),
              id
            )
            .run();

            const folders = await getFolders(env);

            return new Response(
              adminPage("✅ Sichtbarkeit geändert.", folders),
              {
                headers: {
                  "content-type": "text/html; charset=UTF-8"
                }
              }
              )
