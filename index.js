const HTML = (texts) => `
<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>NiB — Gedichte · Texte · Fragmente</title>

<style>
:root {
  --bg:#f3efe8;
  --paper:#fbfaf7;
  --text:#29251f;
  --muted:#81786d;
  --line:#d8d0c5;
}

* { box-sizing:border-box; }

body {
  margin:0;
  background:var(--bg);
  color:var(--text);
  font-family:Georgia,"Times New Roman",serif;
}

header {
  max-width:900px;
  margin:auto;
  padding:58px 22px 28px;
  border-bottom:1px solid var(--line);
}

.logo {
  font-size:44px;
  letter-spacing:.16em;
}

.subtitle {
  margin-top:8px;
  color:var(--muted);
  font-size:15px;
}

main {
  max-width:900px;
  margin:auto;
  padding:28px 22px 80px;
}

.navigation {
  display:flex;
  flex-wrap:wrap;
  gap:8px;
  margin-bottom:28px;
}

button {
  font:inherit;
  border:1px solid var(--line);
  background:var(--paper);
  color:var(--text);
  padding:9px 14px;
  border-radius:7px;
}

button:hover {
  background:white;
  cursor:pointer;
}

.text {
  display:block;
  width:100%;
  text-align:left;
  border:0;
  border-bottom:1px solid var(--line);
  border-radius:0;
  background:transparent;
  padding:18px 4px;
}

.title {
  font-size:21px;
}

.meta {
  margin-top:6px;
  color:var(--muted);
  font-size:12px;
}

article {
  display:none;
  background:var(--paper);
  padding:35px;
}

article.active {
  display:block;
}

.article-title {
  font-size:34px;
  margin:22px 0 8px;
}

.article-meta {
  color:var(--muted);
  font-size:13px;
  margin-bottom:30px;
}

.content {
  white-space:pre-wrap;
  line-height:1.85;
  font-size:18px;
}

.empty {
  color:var(--muted);
  padding:30px 0;
}

@media(max-width:600px) {
  header { padding-top:40px; }
  .logo { font-size:36px; }
  article { padding:24px 18px; }
}
</style>
</head>

<body>

<header>
  <div class="logo">NiB</div>
  <div class="subtitle">Gedichte · Texte · Fragmente</div>
</header>

<main>

<section id="overview">

<div class="navigation">
  <button onclick="showFolder(null)">Alle</button>
  <button onclick="showFolder('Gedichte')">Gedichte</button>
  <button onclick="showFolder('Texte')">Texte</button>
  <button onclick="showFolder('Fragmente')">Fragmente</button>
</div>

<div id="list"></div>

</section>

<article id="article">
  <button onclick="closeText()">← Zurück</button>
  <h1 class="article-title" id="articleTitle"></h1>
  <div class="article-meta" id="articleMeta"></div>
  <div class="content" id="articleContent"></div>
</article>

</main>

<script>
const texts = ${JSON.stringify(texts)};

let currentFolder = null;

function render() {
  const list = document.getElementById("list");
  list.innerHTML = "";

  let items = texts;

  if (currentFolder) {
    items = items.filter(t => t.folder === currentFolder);
  }

  items.sort((a,b) =>
    String(b.updated_at).localeCompare(String(a.updated_at))
  );

  if (!items.length) {
    list.innerHTML =
      '<div class="empty">Noch keine Texte in diesem Bereich.</div>';
    return;
  }

  for (const text of items) {
    const button = document.createElement("button");
    button.className = "text";

    const title = document.createElement("div");
    title.className = "title";
    title.textContent = text.title;

    const meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent =
      text.folder + " · zuletzt bearbeitet " + text.updated_at;

    button.append(title, meta);
    button.onclick = () => openText(text);

    list.appendChild(button);
  }
}

function showFolder(folder) {
  currentFolder = folder;
  document.getElementById("overview").style.display = "block";
  document.getElementById("article").classList.remove("active");
  render();
}

function openText(text) {
  document.getElementById("overview").style.display = "none";
  document.getElementById("article").classList.add("active");

  document.getElementById("articleTitle").textContent = text.title;
  document.getElementById("articleMeta").textContent =
    text.folder + " · zuletzt bearbeitet " + text.updated_at;
  document.getElementById("articleContent").textContent = text.content;
}

function closeText() {
  document.getElementById("article").classList.remove("active");
  document.getElementById("overview").style.display = "block";
}

render();
</script>

</body>
</html>
`;

export default {
  async fetch(request, env) {

    try {
      const result = await env.DB
        .prepare(`
          SELECT
            id,
            title,
            content,
            folder,
            visibility,
            updated_at,
            created_at
          FROM texts
          WHERE visibility = 'public'
          ORDER BY updated_at DESC
        `)
        .all();

      return new Response(HTML(result.results || []), {
        headers: {
          "content-type": "text/html; charset=UTF-8"
        }
      });

    } catch (error) {

      return new Response(
        "NiB konnte die Datenbank gerade nicht laden.",
        {
          status:500,
          headers:{
            "content-type":"text/plain; charset=UTF-8"
          }
        }
      );
    }
  }
};
