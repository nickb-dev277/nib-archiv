const HTML = `
<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>NiB — Verwaltung</title>
<style>
body {
  margin: 0;
  background: #f3efe8;
  color: #29251f;
  font-family: Georgia, serif;
}
main {
  max-width: 700px;
  margin: auto;
  padding: 40px 20px;
}
input, button {
  font: inherit;
  padding: 10px;
  margin: 5px 0;
}
input {
  width: 100%;
  box-sizing: border-box;
}
button {
  cursor: pointer;
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

</main>
</body>
</html>
`;

export default {
  async fetch(request, env) {
    return new Response(HTML, {
      headers: {
        "content-type": "text/html; charset=UTF-8"
      }
    });
  }
};
