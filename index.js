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

input,
button {
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

<button type="submit">
  Anmelden
</button>

</form>

${message ? `<p class="message">${message}</p>` : ""}

</main>

</body>
</html>`;
}


export default {

  async fetch(request, env) {

    if (request.method === "POST") {

      const form = await request.formData();

      const password = form.get("password");

      if (password === env.ADMIN_PASSWORD) {

        return new Response(
          loginPage("✅ Anmeldung erfolgreich!"),
          {
            headers: {
              "content-type": "text/html; charset=UTF-8"
            }
          }
        );

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
