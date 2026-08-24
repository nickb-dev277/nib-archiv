function loginPage(message = "") {
  return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>NiB – Verwaltung</title>
<style>
body {
  margin: 0;
  background: #f3efe8;
  color: #29251f;
  font-family: Georgia, serif;
}
main {
  max-width: 600px;
  margin: 80px auto;
  padding: 30px 20px;
}
h1 {
  font-size: 42px;
  letter-spacing: .12em;
}
input, button {
  font: inherit;
  padding: 11px;
  margin-top: 10px;
}
input {
  width: 100%;
  box-sizing: border-box;
}
button {
  cursor: pointer;
}
.message {
  margin-top: 20px;
}
</style>
</head>
<body>
<main>

<h1>NiB</h1>
<p>Verwaltung</p>

<form method="POST">
<input
  type="password"
  name="password"
  placeholder="Admin-Passwort"
  required
>
<button type="submit">Anmelden</button>
</form>

${message ? `<p class="message">${message}</p>` : ""}

</main>
</body>
</html>`;
}


function adminPage(message = "") {
  return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>NiB – Verwaltung</title>
<style>
body {
  margin: 0;
  background: #f3efe8;
  color: #29251f;
  font-family: Georgia, serif;
}
main {
  max-width: 800px;
  margin: 40px auto;
  padding: 30px 20px;
}
h1 {
  font-size: 40px;
  letter-spacing: .12em;
}
input, textarea, select, button {
  font: inherit;
  padding: 11px;
  margin-top: 10px;
}
input, textarea, select {
  width: 100%;
  box-sizing: border-box;
}
textarea {
  min-height: 350px;
  resize: vertical;
}
button {
  cursor: pointer;
}
.message {
  padding: 12px;
  background: #fbf9f5;
  border: 1px solid #d8d0c5;
}
label {
  display: block;
  margin-top: 18px;
}
</style>
</head>

<body>
<main>

<h1>NiB</h1>

<p>Verwaltung</p>

${message ? `<p class="message">${message}</p>` : ""}

<h2>Neuer Text</h2>

<form method="POST">

<input type="hidden" name="action" value="create">

<label>
Titel
<input
  type="text"
  name="title"
  placeholder="Titel des Textes"
  required
>
</label>

<label>
Ordner
<select name="folder">
  <option value="Gedichte">Gedichte</option>
  <option value="Texte">Texte</option>
  <option value="Fragmente">Fragmente</option>
</select>
</label>

<label>
Sichtbarkeit
<select name="visibility">
  <option value="public">Öffentlich</option>
  <option value="private">Privat</option>
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

<button type="submit">Text speichern</button>

</form>

</main>
</body>
</html>`;
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

      if (valid === "admin") {

        if (request.method === "POST") {

          const form = await request.formData();

          if (form.get("action") === "create") {

            const title = String(form.get("title") || "");
            const content = String(form.get("content") || "");
            const folder = String(form.get("folder") || "Fragmente");
            const visibility = String(form.get("visibility") || "private");

            const now = new Date().toISOString();
            const id = crypto.randomUUID();

            await env.DB.prepare(`
              INSERT INTO texts
              (id, title, content, folder, visibility, updated_at, created_at)
              VALUES (?, ?, ?, ?, ?, ?, ?)
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

            return new Response(
              adminPage("✅ Text wurde gespeichert."),
              {
                headers: {
                  "content-type": "text/html; charset=UTF-8"
                }
              }
            );
          }
        }

        return new Response(adminPage(), {
          headers: {
            "content-type": "text/html; charset=UTF-8"
          }
        });
      }
    }


    if (request.method === "POST") {

      const form = await request.formData();
      const password = String(form.get("password") || "");

      if (password === env.ADMIN_PASSWORD) {

        const newSession = crypto.randomUUID();

        await env.SESSIONS.put(
          newSession,
          "admin",
          {
            expirationTtl: 60 * 60 * 24 * 7
          }
        );

        return new Response(adminPage(), {
          headers: {
            "content-type": "text/html; charset=UTF-8",
            "Set-Cookie":
              `nib_session=${newSession}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800`
          }
        });
      }

      return new Response(
        loginPage("❌ Falsches Passwort."),
        {
          status: 401,
          headers: {
            "content-type": "text/html; charset=UTF-8"
          }
        }
      );
    }


    return new Response(loginPage(), {
      headers: {
        "content-type": "text/html; charset=UTF-8"
      }
    });
  }

};
