function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function html(content, title = "NiB") {
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
  --danger: #7a4f4f;
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
  padding: 60px 0 100px;
}

header {
  margin-bottom: 45px;
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
  color: white;
  padding: 10px 18px;
  font: inherit;
  cursor: pointer;
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
  color: var(--danger);
  border-color: #c9b4b4;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.actions form {
  margin: 0;
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

.message {
  border-left: 2px solid var(--accent);
  padding: 10px 15px;
  margin-bottom: 30px;
  color: var(--muted);
  background: rgba(255,255,255,.25);
}

.error {
  border-left-color: var(--danger);
}

.login {
  max-width: 420px;
  margin: 90px auto;
}

.create-folder {
  display: flex;
  gap: 10px;
  margin-bottom: 25px;
}

.create-folder input {
  flex: 1;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 55px;
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
}

.dashboard-card:hover {
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
  color: var(--muted);
  font-size: 14px;
}

.text-preview {
  white-space: pre-wrap;
  margin: 15px 0;
  color: var(--muted);
  font-size: 14px;
}

.muted {
  color: var(--muted);
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-bottom: 45px;
}

.stat {
  background: var(--paper);
  border: 1px solid var(--line);
  padding: 20px;
}

.stat-number {
  display: block;
  font-family: Georgia, serif;
  font-size: 28px;
}

.stat-label {
  color: var(--muted);
  font-size: 13px;
}

@media (max-width: 650px) {
  main {
    width: min(100% - 28px, 900px);
    padding-top: 40px;
  }

  .logo {
    font-size: 36px;
  }

  .dashboard-grid,
  .stats {
    grid-template-columns: 1fr;
  }

  .dashboard-header {
    align-items: flex-start;
    gap: 20px;
  }

  .create-folder {
    flex-direction: column;
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
  return html(`
    <div class="login">

      <header>
        <h1 class="logo">NiB</h1>
        <p class="subtitle">Verwaltung</p>
      </header>

      <section class="card">

        ${
          message
            ? `<p class="message error">${esc(message)}</p>`
            : ""
        }

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

      </section>

    </div>
  `);
}


function getSession(request) {
  const cookie =
    request.headers.get("Cookie") || "";

  const match =
    cookie.match(
      /(?:^|;\\s*)nib_session=([^;]+)/
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


/*
 * WICHTIG:
 *
 * Deine texts-Tabelle besitzt:
 *
 * id
 * title
 * content
 * folder
 * visibility
 * password
 * updated_at
 * created_at
 *
 * Deshalb verwenden wir hier GENAU diese Spalten.
 */
async function getTexts(env) {
  const result =
    await env.DB.prepare(`
      SELECT
        id,
        title,
        content,
        folder,
        visibility,
        password,
        updated_at,
        created_at
      FROM texts
      ORDER BY updated_at DESC
    `).all();

  return result.results || [];
}


function visibilityName(value) {
  if (value === "public") {
    return "Öffentlich";
  }

  if (value === "semi_private") {
    return "Halbprivat";
  }

  return "Privat";
}


function adminPage(
  message = "",
  folders = [],
  texts = []
) {

  const folderOptions =
    folders.map(folder => `
      <option value="${esc(folder.id)}">
        ${esc(folder.name)}
      </option>
    `).join("");


  const folderMap =
    new Map(
      folders.map(folder => [
        String(folder.id),
        folder.name
      ])
    );


  return html(`

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


    ${
      message
        ? `<p class="message">${esc(message)}</p>`
        : ""
    }


    <section>

      <div class="stats">

        <div class="stat">
          <span class="stat-number">
            ${texts.length}
          </span>
          <span class="stat-label">
            Texte
          </span>
        </div>

        <div class="stat">
          <span class="stat-number">
            ${folders.length}
          </span>
          <span class="stat-label">
            Ordner
          </span>
        </div>

        <div class="stat">
          <span class="stat-number">
            ${
              texts.filter(
                text => text.visibility === "public"
              ).length
            }
          </span>
          <span class="stat-label">
            Öffentliche Texte
          </span>
        </div>

      </div>


      <div class="dashboard-grid">

        <a
          class="dashboard-card"
          href="#texte"
        >
          <span class="card-number">01</span>
          <h2>Texte</h2>
          <p>
            Vorhandene Texte ansehen,
            verwalten und löschen.
          </p>
        </a>


        <a
          class="dashboard-card featured"
          href="#neuer-text"
        >
          <span class="card-number">02</span>
          <h2>Neuer Text</h2>
          <p>
            Einen neuen Text direkt
            in der Datenbank speichern.
          </p>
        </a>


        <a
          class="dashboard-card"
          href="#ordner"
        >
          <span class="card-number">03</span>
          <h2>Ordner</h2>
          <p>
            Ordner erstellen,
            umbenennen und verwalten.
          </p>
        </a>


        <a
          class="dashboard-card"
          href="#einstellungen"
        >
          <span class="card-number">04</span>
          <h2>Einstellungen</h2>
          <p>
            Weitere Funktionen
            kommen hier später dazu.
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

            <select name="folder">

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

            ? texts.map(text => {

                const folderName =
                  text.folder
                    ? folderMap.get(
                        String(text.folder)
                      )
                    : null;

                const preview =
                  String(text.content || "");

                return `

                  <div class="folder">

                    <div class="folder-name">
                      ${esc(text.title)}
                    </div>


                    <div class="folder-status">

                      ${esc(
                        visibilityName(
                          text.visibility
                        )
                      )}

                      ${
                        folderName
                          ? ` · Ordner: ${esc(folderName)}`
                          : ""
                      }

                    </div>


                    <div class="text-preview">
                      ${esc(
                        preview.length > 180
                          ? preview.slice(0, 180) + "…"
                          : preview
                      )}
                    </div>


                    <div class="actions">

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

                `;
              }).join("")

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


                  <div class="actions">

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


    <section id="einstellungen">

      <h2 class="section-title">
        Einstellungen
      </h2>

      <div class="card">

        <p class="muted">
          Die nächsten Funktionen können hier
          ergänzt werden: Text bearbeiten,
          Papierkorb, Kommentare, Passwörter
          und weitere Seiteneinstellungen.
        </p>

      </div>

    </section>

  `, "NiB – Admin");
}


async function respondAdmin(
  env,
  message = ""
) {

  const folders =
    await getFolders(env);

  const texts =
    await getTexts(env);

  return new Response(
    adminPage(
      message,
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


export default {

  async fetch(request, env) {

    try {

      const session =
        getSession(request);


      /*
       * EINGELOGGTER ADMIN
       */

      if (session) {

        const valid =
          await env.SESSIONS.get(session);


        if (valid === "admin") {


          /*
           * POST-AKTIONEN
           */

          if (request.method === "POST") {

            const form =
              await request.formData();

            const action =
              String(
                form.get("action") || ""
              );


            /*
             * LOGOUT
             */

            if (action === "logout") {

              await env.SESSIONS.delete(
                session
              );

              return new Response(
                loginPage(),
                {
                  headers: {
                    "content-type":
                      "text/html; charset=UTF-8",

                    "Set-Cookie":
                      "nib_session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0"
                  }
                }
              );
            }


            /*
             * NEUEN TEXT ERSTELLEN
             */

            if (action === "create_text") {

              const title =
                String(
                  form.get("title") || ""
                ).trim();


              const content =
                String(
                  form.get("content") || ""
                );


              const folder =
                String(
                  form.get("folder") || ""
                ) || null;


              const visibility =
                String(
                  form.get("visibility") ||
                  "private"
                );


              if (!title) {

                return respondAdmin(
                  env,
                  "Bitte einen Titel eingeben."
                );
              }


              if (!content.trim()) {

                return respondAdmin(
                  env,
                  "Bitte einen Inhalt eingeben."
                );
              }


              if (
                ![
                  "public",
                  "semi_private",
                  "private"
                ].includes(visibility)
              ) {

                return respondAdmin(
                  env,
                  "Ungültige Sichtbarkeit."
                );
              }


              /*
               * Nur die Spalten verwenden,
               * die deine texts-Tabelle besitzt.
               */

              const id =
                crypto.randomUUID();

              const now =
                new Date().toISOString();


              await env.DB.prepare(`
                INSERT INTO texts
                (
                  id,
                  title,
                  content,
                  folder,
                  visibility,
                  password,
                  updated_at,
                  created_at
                )
                VALUES (?, ?, ?, ?, ?, NULL, ?, ?)
              `)
              .bind(
                id,
                title,
                content,
                folder,
                visibility,
                now,
                now
              )
              .run();


              return respondAdmin(
                env,
                "Text gespeichert."
              );
            }


            /*
             * TEXT LÖSCHEN
             *
             * Da deine texts-Tabelle kein
             * deleted_at besitzt, löschen wir
             * den Datensatz hier direkt.
             */

            if (action === "delete_text") {

              const id =
                String(
                  form.get("id") || ""
                );


              if (!id) {

                return respondAdmin(
                  env,
                  "Kein Text ausgewählt."
                );
              }


              await env.DB.prepare(`
                DELETE FROM texts
                WHERE id = ?
              `)
              .bind(id)
              .run();


              return respondAdmin(
                env,
                "Text gelöscht."
              );
            }


            /*
             * ORDNER ERSTELLEN
             */

            if (action === "create_folder") {

              const name =
                String(
                  form.get("name") || ""
                ).trim();


              if (!name) {

                return respondAdmin(
                  env,
                  "Bitte einen Ordnernamen eingeben."
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


              return respondAdmin(
                env,
                "Ordner erstellt."
              );
            }


            /*
             * ORDNER UMBENENNEN
             */

            if (action === "rename_folder") {

              const id =
                String(
                  form.get("id") || ""
                );


              const name =
                String(
                  form.get("name") || ""
                ).trim();


              if (!id || !name) {

                return respondAdmin(
                  env,
                  "Ordner und Name müssen vorhanden sein."
                );
              }


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


              return respondAdmin(
                env,
                "Ordner umbenannt."
              );
            }


            /*
             * ORDNER SICHTBARKEIT
             */

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


              return respondAdmin(
                env,
                "Sichtbarkeit geändert."
              );
            }


            /*
             * ORDNER LÖSCHEN
             */

            if (action === "delete_folder") {

              const id =
                String(
                  form.get("id") || ""
                );


              if (!id) {

                return respondAdmin(
                  env,
                  "Kein Ordner ausgewählt."
                );
              }


              /*
               * Prüfen, ob Texte diesen Ordner
               * verwenden.
               */

              const result =
                await env.DB.prepare(`
                  SELECT
                    COUNT(*) AS count
                  FROM texts
                  WHERE folder = ?
                `)
                .bind(id)
                .first();


              const count =
                Number(
                  result?.count || 0
                );


              if (count > 0) {

                return respondAdmin(
                  env,
                  `Der Ordner enthält noch ${count} Text(e). Bitte verschiebe die Texte zuerst.`
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


              return respondAdmin(
                env,
                "Ordner gelöscht."
              );
            }
          }


          /*
           * NORMALE ADMIN-SEITE
           */

          return respondAdmin(env);
        }
      }


      /*
       * LOGIN
       */

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
                  60 * 60 * 24
              }
            );


            return respondAdminWithCookie(
              env,
              newSession
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


      /*
       * NICHT EINGELOGGT
       */

      return new Response(
        loginPage(),
        {
          headers: {
            "content-type":
              "text/html; charset=UTF-8"
          }
        }
      );

    } catch (error) {

      /*
       * Statt eines unverständlichen
       * Error 1101 bekommt man eine
       * lesbare Fehlermeldung.
       */

      console.error(
        "NiB Worker Error:",
        error
      );


      return new Response(
        html(`
          <header>
            <p class="subtitle">
              Fehler
            </p>

            <h1 class="logo">
              NiB
            </h1>
          </header>

          <section class="card">

            <p class="message error">
              Beim Verarbeiten der Anfrage ist
              ein Fehler aufgetreten.
            </p>

            <p class="muted">
              ${esc(
                error?.message ||
                "Unbekannter Fehler"
              )}
            </p>

            <p>
              Bitte gehe zurück und versuche es
              erneut.
            </p>

          </section>
        `, "NiB – Fehler"),
        {
          status: 500,
          headers: {
            "content-type":
              "text/html; charset=UTF-8"
          }
        }
      );
    }
  }
};


/*
 * Login-Antwort mit Session-Cookie.
 */

async function respondAdminWithCookie(
  env,
  session
) {

  const folders =
    await getFolders(env);

  const texts =
    await getTexts(env);


  return new Response(
    adminPage(
      "",
      folders,
      texts
    ),
    {
      headers: {
        "content-type":
          "text/html; charset=UTF-8",

        "Set-Cookie":
          `nib_session=${session}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=86400`
      }
    }
  );
}
