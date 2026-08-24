const texts = [
  {
    id: 1,
    title: "Willkommen",
    folder: "Fragmente",
    updated: "2026-08-24",
    content: "Das ist der Anfang des NiB-Archivs.\n\nDeine eigenen Gedichte, Texte und Fragmente werden später hier erscheinen."
  }
];

function page() {
  return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>NiB — Gedichte · Texte · Fragmente</title>

<style>
:root {
  --bg: #f4f0e9;
  --paper: #fbf9f5;
  --text: #29251f;
  --muted: #766e64;
  --line: #d8d0c5;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: Georgia, "Times New Roman", serif;
}

header {
  max-width: 900px;
  margin: auto;
  padding: 60px 22px 30px;
  border-bottom: 1px solid var(--line);
}

.logo {
  font-size: 44px;
  letter-spacing: .12em;
}

.subtitle {
  margin-top: 8px;
  color: var(--muted);
  font-size: 15px;
}

main {
  max-width: 900px;
  margin: auto;
  padding: 30px 22px 80px;
}

.navigation {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 30px;
}

button {
  font: inherit;
  border: 1px solid var(--line);
  background: var(--paper);
  color: var(--text);
  padding: 9px 14px;
  border-radius: 8px;
}

button:hover {
  cursor: pointer;
  background: white;
}

.text {
  display: block;
  width: 100%;
  text-align: left;
  border: 0;
  border-bottom: 1px solid var(--line);
  border-radius: 0;
  background: transparent;
  padding: 18px 4px;
}

.title {
  font-size: 21px;
}

.meta {
  margin-top: 6px;
  color: var(--muted);
  font-size: 12px;
}

.empty {
  color: var(--muted);
  padding: 30px 0;
}

article {
  display: none;
  background: var(--paper);
  padding: 35px;
}

article.active {
  display: block;
}

.article-title {
  font-size: 34px;
  margin: 20px 0 8px;
}

.article-meta {
  color: var(--muted);
  font-size: 13px;
  margin-bottom: 30px;
}

.content {
  white-space: pre-wrap;
  line-height: 1.85;
  font-size: 18px;
}

@media(max-width:600px) {
  header {
    padding-top: 40px;
  }

  .logo {
    font-size: 36px;
  }

  article {
    padding: 24px 18px;
  }
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
  <button onclick="showAll()">Alle Texte</button>
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

let currentFolder = null;

function getTexts() {

  let result = texts;

  if (currentFolder) {
    result = result.filter(
      text => text.folder === currentFolder
    );
  }

  return result.sort(
    (a,b) => b.updated.localeCompare(a.updated)
  );
}

function render() {

  const list = document.getElementById("list");

  list.innerHTML = "";

  const items = getTexts();

  if (items.length === 0) {

    list.innerHTML =
      '<div class="empty">Noch keine Texte in diesem Bereich.</div>';

    return;
  }

  items.forEach(text => {

    const button = document.createElement("button");

    button.className = "text";

    const title = document.createElement("div");
    title.className = "title";
    title.textContent = text.title;

    const meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent =
      text.folder + " · zuletzt bearbeitet " + text.updated;

    button.appendChild(title);
    button.appendChild(meta);

    button.onclick = () => openText(text.id);

    list.appendChild(button);

  });
}

function showAll() {

  currentFolder = null;
  render();

}

function showFolder(folder) {

  currentFolder = folder;
  render();

}

function openText(id) {

  const text = texts.find(
    item => item.id === id
  );

  if (!text) return;

  document.getElementById("overview").style.display = "none";

  document.getElementById("article").classList.add("active");

  document.getElementById("articleTitle").textContent =
    text.title;

  document.getElementById("articleMeta").textContent =
    text.folder + " · zuletzt bearbeitet " + text.updated;

  document.getElementById("articleContent").textContent =
    text.content;

}

function closeText() {

  document.getElementById("article").classList.remove("active");

  document.getElementById("overview").style.display = "block";

}

render();

</script>

</body>
</html>`;
}

export default {
  async fetch(request) {
    return new Response(page(), {
      headers: {
        "content-type": "text/html; charset=UTF-8"
      }
    });
  }
};
