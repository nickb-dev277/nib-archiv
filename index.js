function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function page(content, title = "NiB") {
  return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>

<style>
:root {
  --bg: #f3efe8;
  --paper: #faf8f4;
  --text: #29251f;
  --muted: #81796f;
  --line: #ddd6cc;
  --accent: #4d4943;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.6;
}

main {
  width: min(900px, calc(100% - 40px));
  margin: 0 auto;
  padding: 70px 0 100px;
}

header {
  margin-bottom: 55px;
}

.logo {
  margin: 0;
  font-family: Georgia, serif;
  font-size: 44px;
  font-weight: 400;
  letter-spacing: .18em;
}

.subtitle {
  margin: 8px 0 0;
  color: var(--muted);
  font-size: 14px;
  letter-spacing: .08em;
  text-transform: uppercase;
}

section {
  margin-bottom: 45px;
}

.section-title {
  margin: 0 0 20px;
  font-family: Georgia, serif;
  font-size: 25px;
  font-weight: 400;
}

.card {
  background: var(--paper);
  border: 1px solid var(--line);
  padding: 28px;
}

input,
textarea,
select {
  width: 100%;
  border: 1px solid var(--line);
  background: transparent;
  color: var(--text);
  padding: 12px 13px;
  font: inherit;
  outline: none;
  border-radius: 0;
}

input:focus,
textarea:focus,
select:focus {
  border-color: var(--accent);
}

textarea {
  min-height: 320px;
  resize: vertical;
}

label {
  display: block;
  margin-bottom: 22px;
  font-size: 13px;
  color: var(--muted);
}

label input,
label textarea,
label select {
  margin-top: 7px;
}

button {
  border: 1px solid var(--accent);
  background: var(--accent);
  color: #fff;
  padding: 10px 18px;
  font: inherit;
  cursor: pointer;
  transition: opacity .15s ease;
}

button:hover {
  opacity: .82;
}

button.secondary {
  background: transparent;
  color: var(--text);
  border-color: var(--line);
}

button.danger {
  background: transparent;
  color: #7a4f4f;
  border-color: #c9b4b4;
}

.folder {
  padding: 22px 0;
  border-top: 1px solid var(--line);
}

.folder:first-child {
  border-top: 0;
}

.folder-name {
  font-family: Georgia, serif;
  font-size: 19px;
}

.folder-status {
  margin: 3px 0 16px;
  color: var(--muted);
  font-size: 13px;
}

.folder-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.folder-actions form {
  display: flex;
  gap: 8px;
}

.folder-actions input {
  width: 180px;
  padding: 9px 10px;
}

.create-folder {
  display: flex;
  gap: 10px;
  margin-bottom: 25px;
}

.create-folder input {
  flex: 1;
}

.message {
  border-left: 2px solid var(--accent);
  padding: 10px 15px;
  margin-bottom: 30px;
  color: var(--muted);
}

.login {
  max-width: 420px;
  margin: 90px auto;
}

.login .logo {
  margin-bottom: 5px;
}

@media (max-width: 650px) {
  main {
    width: min(100% - 28px, 900px);
    padding-top: 40px;
  }

  .logo {
    font-size: 36px;
  }

  .card {
    padding: 20px;
  }

  .create-folder {
    flex-direction: column;
  }

  .folder-actions form {
    width: 100%;
    flex-wrap: wrap;
  }

  .folder-actions input {
    width: 100%;
  }
}
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 55px;
}

.dashboard-header .subtitle {
  margin-bottom: 8px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.dashboard-card {
  display: block;
  min-height: 170px;
  padding: 25px;
  background: var(--paper);
  border: 1px solid var(--line);
  color: var(--text);
  text-decoration: none;
  transition:
    transform .15s ease,
    border-color .15s ease,
    background .15s ease;
}

.dashboard-card:hover {
  transform: translateY(-2px);
  border-color: #aaa298;
}

.dashboard-card.featured {
  background: #ebe5dc;
}

.card-number {
  display: block;
  margin-bottom: 25px;
  color: var(--muted);
  font-size: 12px;
  letter-spacing: .12em;
}

.dashboard-card h2 {
  margin: 0 0 8px;
  font-family: Georgia, serif;
  font-size: 24px;
  font-weight: 400;
}

.dashboard-card p {
  margin: 0;
  max-width: 390px;
  color: var(--muted);
  font-size: 14px;
}

.dashboard-placeholder h3 {
  margin: 0 0 8px;
  font-family: Georgia, serif;
  font-size: 20px;
  font-weight: 400;
}

.dashboard-placeholder p {
  margin: 0;
  color: var(--muted);
}

.muted {
  color: var(--muted);
}

@media (max-width: 650px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .dashboard-header {
    align-items: flex-start;
  }
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
    <div class="login">

      <header>
        <h1 class="logo">NiB</h1>
        <p class="subtitle">Verwaltung</p>
      </header>

      <section class="card">

        <form method="POST">
          <input
            type="hidden"
            name="action"
            value="login"
          >

          <label>
            Admin-Passwort

            <input
              type="password"
              name="password"
              autocomplete="current-password"
              required
            >
          </label>

          <button type="submit">
            Anmelden
          </button>
        </form>

        ${message
          ? `<p class="message">${esc(message)}</p>`
          : ""}
      </section>

    </div>
  `);
}

function adminPage(message = "", folders = [], texts = []) {

  const folderOptions = folders.map(folder => `
    <option value="${esc(folder.id)}">
      ${esc(folder.name)}
    </option>
  `).join("");

  return page(`
    <header class="dashboard-header">

      <div>
        <p class="subtitle">Admin-Bereich</p>
        <h1 class="logo">NiB</h1>
      </div>

      <form method="POST">
        <input
          type="hidden"
          name="action"
          value="logout"
        >

        <button
          type="submit"
          class="secondary"
        >
          Abmelden
        </button>
      </form>

    </header>


    ${message
      ? `<p class="message">${esc(message)}</p>`
      : ""}


    <section>

      <div class="dashboard-grid">

        <a class="dashboard-card" href="#texte">
          <span class="card-number">01</span>
          <h2>Texte</h2>
          <p>
            Vorhandene Texte ansehen,
            bearbeiten und verwalten.
          </p>
        </a>


        <a class="dashboard-card featured" href="#neuer-text">
          <span class="card-number">02</span>
          <h2>Neuer Text</h2>
          <p>
            Gedichte, Texte oder Fragmente
            direkt hinzufügen.
          </p>
        </a>


        <a class="dashboard-card" href="#ordner">
          <span class="card-number">03</span>
          <h2>Ordner</h2>
          <p>
            Ordner erstellen, umbenennen
            und ihre Sichtbarkeit ändern.
          </p>
        </a>


        <a class="dashboard-card" href="#kommentare">
          <span class="card-number">04</span>
          <h2>Kommentare</h2>
          <p>
            Kommentare verwalten und
            als Admin antworten.
          </p>
        </a>


        <a class="dashboard-card" href="#papierkorb">
          <span class="card-number">05</span>
          <h2>Papierkorb</h2>
          <p>
            Gelöschte Inhalte innerhalb
            von 30 Tagen wiederherstellen.
          </p>
        </a>


        <a class="dashboard-card" href="#passwoerter">
          <span class="card-number">06</span>
          <h2>Passwörter</h2>
          <p>
            Halbprivate Inhalte und
            spezielle Text-Passwörter.
          </p>
        </a>


        <a class="dashboard-card" href="#einstellungen">
          <span class="card-number">07</span>
          <h2>Einstellungen</h2>
          <p>
            Seitentitel, Künstlername
            und weitere Einstellungen.
          </p>
        </a>


        <a
          class="dashboard-card"
          href="/"
          target="_blank"
        >
          <span class="card-number">08</span>
          <h2>Website</h2>
          <p>
            Die öffentliche Seite
            ansehen.
          </p>
        </a>

      </div>

    </section>


    <section id="neuer-text">

      <h2 class="section-title">
        Neuer Text
      </h2>

      <div class="card">

        <form method="POST">

          <input
            type="hidden"
            name="action"
            value="create_text"
          >

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

              <option value="">
                Ohne Ordner
              </option>

              ${folderOptions}

            </select>
          </label>


          <label>
            Sichtbarkeit

            <select name="visibility">

              <option value="public">
                Öffentlich
              </option>

              <option value="semi_private">
                Halbprivat
              </option>

              <option value="private">
                Privat
              </option>

            </select>
          </label>


          <label>
            Inhalt

            <textarea
              name="content"
              placeholder="Deinen Text schreiben..."
              required
            ></textarea>
          </label>


          <button type="submit">
            Text speichern
          </button>

        </form>

      </div>

    </section>


    <section id="texte">

      <h2 class="section-title">
        Texte
      </h2>

      <div class="card">

  ${
    texts.length
      ? texts.map(text => `
        <div class="folder">

          <div class="folder-name">
            ${esc(text.title)}
          </div>

          <div class="folder-status">
            ${
              text.visibility === "public"
                ? "Öffentlich"
                : text.visibility === "semi_private"
                  ? "Halbprivat"
                  : "Privat"
            }
          </div>

          <div class="folder-actions">

            <form method="POST">

              <input
                type="hidden"
                name="action"
                value="delete_text"
              >

              <input
                type="hidden"
                name="id"
                value="${esc(text.id)}"
              >

              <button
                type="submit"
                class="danger"
              >
                Löschen
              </button>

            </form>

          </div>

        </div>
      `).join("")
      : `
        <p class="muted">
          Noch keine Texte vorhanden.
        </p>
      `
  }

</div>
    </section>


    <section id="ordner">

      <h2 class="section-title">
        Ordner
      </h2>

      <div class="card">

        <form
          method="POST"
          class="create-folder"
        >

          <input
            type="hidden"
            name="action"
            value="create_folder"
          >

          <input
            type="text"
            name="name"
            placeholder="Neuer Ordner"
            required
          >

          <button type="submit">
            Erstellen
          </button>

        </form>


        ${
          folders.length
            ? folders.map(folder => `
              <div class="folder">

                <div class="folder-name">
                  ${esc(folder.name)}
                </div>

                <div class="folder-status">
                  ${
                    folder.is_private
                      ? "Privater Ordner"
                      : "Öffentlicher Ordner"
                  }
                </div>

                <div class="folder-actions">

                  <form method="POST">

                    <input
                      type="hidden"
                      name="action"
                      value="rename_folder"
                    >

                    <input
                      type="hidden"
                      name="id"
                      value="${esc(folder.id)}"
                    >

                    <input
                      type="text"
                      name="name"
                      placeholder="Neuer Name"
                      required
                    >

                    <button
                      type="submit"
                      class="secondary"
                    >
                      Umbenennen
                    </button>

                  </form>


                  <form method="POST">

                    <input
                      type="hidden"
                      name="action"
                      value="toggle_folder"
                    >

                    <input
                      type="hidden"
                      name="id"
                      value="${esc(folder.id)}"
                    >

                    <button
                      type="submit"
                      class="secondary"
                    >
                      ${
                        folder.is_private
                          ? "Öffentlich stellen"
                          : "Privat stellen"
                      }
                    </button>

                  </form>


                  <form method="POST">

                    <input
                      type="hidden"
                      name="action"
                      value="delete_folder"
                    >

                    <input
                      type="hidden"
                      name="id"
                      value="${esc(folder.id)}"
                    >

                    <button
                      type="submit"
                      class="danger"
                    >
                      Löschen
                    </button>

                  </form>

                </div>

              </div>
            `).join("")
            : `
              <p class="muted">
                Noch keine Ordner vorhanden.
              </p>
            `
        }

      </div>

    </section>


    <section id="kommentare">

      <h2 class="section-title">
        Kommentare
      </h2>

      <div class="card dashboard-placeholder">
        <h3>Kommentarverwaltung</h3>
        <p>
          Kommentare löschen und als Admin
          beantworten.
        </p>
      </div>

    </section>


    <section id="papierkorb">

      <h2 class="section-title">
        Papierkorb
      </h2>

      <div class="card dashboard-placeholder">
        <h3>Zuletzt gelöscht</h3>
        <p>
          Gelöschte Texte und Ordner werden
          später 30 Tage lang aufbewahrt.
        </p>
      </div>

    </section>


    <section id="passwoerter">

      <h2 class="section-title">
        Passwörter
      </h2>

      <div class="card dashboard-placeholder">
        <h3>Zugriffsschutz</h3>
        <p>
          Hier verwalten wir später den
          gemeinsamen Halbprivat-Code und
          individuelle Passwörter für einzelne Texte.
        </p>
      </div>

    </section>


    <section id="einstellungen">

      <h2 class="section-title">
        Einstellungen
      </h2>

      <div class="card dashboard-placeholder">
        <h3>Seiteneinstellungen</h3>
        <p>
          NiB-Name, Künstlername, Seitentitel,
          Fußzeile und weitere Einstellungen.
        </p>
      </div>

    </section>

  `);
}



function getSession(request) {

  const cookie =
    request.headers.get("Cookie") || "";

  const match = cookie.match(
    /(?:^|;\s*)nib_session=([^;]+)/
  );

  return match
    ? match[1]
    : null;
}


async function getFolders(env) {

  const result =
    await env.DB.prepare(`
      SELECT
        id,
        name,
        is_private
      FROM folders
      WHERE deleted_at IS NULL
      ORDER BY name COLLATE NOCASE
    `).all();

  return result.results || [];
}

async function getTexts(env) {

  const result =
    await env.DB.prepare(`
      SELECT
        id,
        title,
        Content,
        folder,
        visibility,
        Password,
        updated_at,
        created_at
      FROM texts
      ORDER BY updated_at DESC
    `).all();

  return result.results || [];
}

export default {

  async fetch(request, env) {

    const session =
      getSession(request);


    if (session) {

      const valid =
        await env.SESSIONS.get(session);


      if (valid === "admin") {


        if (request.method === "POST") {

          const form =
            await request.formData();

          const action =
            String(form.get("action") || "");


          if (action === "create_folder") {

            const name =
              String(
                form.get("name") || ""
              ).trim();


            if (!name) {

              const folders =
  await getFolders(env);

const texts =
  await getTexts(env);

return new Response(
  adminPage("", folders, texts),
                {
                  headers: {
                    "content-type":
                      "text/html; charset=UTF-8"
                  }
                }
              );
            }


            const id =
              crypto.randomUUID();

            const now =
              new Date().toISOString();


            await env.DB.prepare(`
              INSERT INTO folders
              (
                id,
                name,
                is_private,
                created_at,
                updated_at,
                deleted_at
              )
              VALUES (?, ?, 0, ?, ?, NULL)
            `)
            .bind(
              id,
              name,
              now,
              now
            )
            .run();


            const folders =
              await getFolders(env);


            return new Response(
              adminPage(
                "Ordner erstellt.",
                folders
              ),
              {
                headers: {
                  "content-type":
                    "text/html; charset=UTF-8"
                }
              }
            );
          }


          if (action === "rename_folder") {

            const id =
              String(
                form.get("id") || ""
              );

            const name =
              String(
                form.get("name") || ""
              ).trim();


            if (id && name) {

              await env.DB.prepare(`
                UPDATE folders
                SET
                  name = ?,
                  updated_at = ?
                WHERE
                  id = ?
                  AND deleted_at IS NULL
              `)
              .bind(
                name,
                new Date().toISOString(),
                id
              )
              .run();
            }


            const folders =
              await getFolders(env);


            return new Response(
              adminPage(
                "Ordner umbenannt.",
                folders
              ),
              {
                headers: {
                  "content-type":
                    "text/html; charset=UTF-8"
                }
              }
            );
          }


          if (action === "toggle_folder") {

            const id =
              String(
                form.get("id") || ""
              );


            await env.DB.prepare(`
              UPDATE folders
              SET
                is_private =
                  CASE
                    WHEN is_private = 1
                    THEN 0
                    ELSE 1
                  END,
                updated_at = ?
              WHERE
                id = ?
                AND deleted_at IS NULL
            `)
            .bind(
              new Date().toISOString(),
              id
            )
            .run();


            const folders =
              await getFolders(env);


            return new Response(
              adminPage(
                "Sichtbarkeit geändert.",
                folders
              ),
              {
                headers: {
                  "content-type":
                    "text/html; charset=UTF-8"
                }
              }
            );
          }


          if (action === "delete_folder") {

            const id =
              String(
                form.get("id") || ""
              );


            const result =
              await env.DB.prepare(`
                SELECT
                  COUNT(*) AS count
                FROM texts
                WHERE
                  folder_id = ?
                  AND deleted_at IS NULL
              `)
              .bind(id)
              .first();


            const count =
              Number(result?.count || 0);


            if (count > 0) {

              const folders =
                await getFolders(env);


              return new Response(
                adminPage(
                  `Dieser Ordner enthält ${count} Text(e). Die Auswahl zum Behalten oder Löschen der Texte bauen wir als Nächstes ein.`,
                  folders
                ),
                {
                  headers: {
                    "content-type":
                      "text/html; charset=UTF-8"
                  }
                }
              );
            }


            await env.DB.prepare(`
              UPDATE folders
              SET
                deleted_at = ?,
                updated_at = ?
              WHERE
                id = ?
                AND deleted_at IS NULL
            `)
            .bind(
              new Date().toISOString(),
              new Date().toISOString(),
              id
            )
            .run();


            const folders =
              await getFolders(env);


            return new Response(
              adminPage(
                "Ordner in den Papierkorb verschoben.",
                folders
              ),
              {
                headers: {
                  "content-type":
                    "text/html; charset=UTF-8"
                }
              }
            );
          }          if (action === "create_text") {

            const title =
              String(
                form.get("title") || ""
              ).trim();


            const content =
              String(
                form.get("content") || ""
              );


            const folderId =
              String(
                form.get("folder_id") || ""
              ) || null;


            const visibility =
              String(
                form.get("visibility") ||
                "private"
              );


            if (
              ![
                "public",
                "semi_private",
                "private"
              ].includes(visibility)
            ) {

              const folders =
                await getFolders(env);


              return new Response(
                adminPage(
                  "Ungültige Sichtbarkeit.",
                  folders
                ),
                {
                  headers: {
                    "content-type":
                      "text/html; charset=UTF-8"
                  }
                }
              );
            }


            const id =
              crypto.randomUUID();

            const now =
              new Date().toISOString();


            await env.DB.prepare(`
  INSERT INTO texts
  (
    id,
    title,
    Content,
    folder,
    visibility,
    Password,
    created_at,
    updated_at
  )
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`)
.bind(
  id,
  title,
  content,
  folderId,
  visibility,
  null,
  now,
  now
)
.run();

            const folders =
              await getFolders(env);


          const texts =
 
            await getTexts(env);


            return new Response(
            adminPage(
            "Text gespeichert.",
            folders,
              texts
  ),
            
              {
                headers: {
                  "content-type":
                    "text/html; charset=UTF-8"
                }
              }
            );
          }
        }


        const folders =
          await getFolders(env);


        return new Response(
          adminPage("", folders),
          {
            headers: {
              "content-type":
                "text/html; charset=UTF-8"
            }
          }
        );
      }
    }


    if (request.method === "POST") {

      const form =
        await request.formData();


      const action =
        String(
          form.get("action") || ""
        );


      if (action === "login") {

        const password =
          String(
            form.get("password") || ""
          );


        if (
          password ===
          env.ADMIN_PASSWORD
        ) {

          const newSession =
            crypto.randomUUID();


          await env.SESSIONS.put(
            newSession,
            "admin",
            {
              expirationTtl:
                60 * 60 * 24 * 7
            }
          );


          return new Response(
            adminPage(),
            {
              headers: {
                "content-type":
                  "text/html; charset=UTF-8",

                "Set-Cookie":
                  `nib_session=${newSession}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800`
              }
            }
          );
        }


        return new Response(
          loginPage(
            "Falsches Passwort."
          ),
          {
            status: 401,

            headers: {
              "content-type":
                "text/html; charset=UTF-8"
            }
          }
        );
      }
    }


    return new Response(
      loginPage(),
      {
        headers: {
          "content-type":
            "text/html; charset=UTF-8"
        }
      }
    );
  }
};
