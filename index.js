// ═════════════════════════════════════════════════════════════════════
// NiB – Archiv
// Cloudflare Worker
//
// Bereiche:
// 01. Grundfunktionen
// 02. HTML / CSS
// 03. Öffentliche Website
// 04. Admin-Login
// 05. Admin-Dashboard
// 06. Admin-Menüs
// 07. Datenbank-Funktionen
// 08. Cloudinary
// 09. Sessions / Besucher
// 10. Worker / Routing
// ═════════════════════════════════════════════════════════════════════


// ─────────────────────────────────────────────────────────────────────
// 01. GRUNDFUNKTIONEN
// ─────────────────────────────────────────────────────────────────────

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}


function visibilityLabel(visibility) {
  if (visibility === "public") return "Öffentlich";
  if (visibility === "semi_private") return "Halbprivat";
  return "Privat";
}


function visibilityClass(visibility) {
  if (visibility === "public") return "visibility-public";
  if (visibility === "semi_private") return "visibility-semi";
  return "visibility-private";
}


function randomId() {
  return crypto.randomUUID();
}


function htmlResponse(html, status = 200, extraHeaders = {}) {
  return new Response(html, {
    status,
    headers: {
      "content-type": "text/html; charset=UTF-8",
      ...extraHeaders
    }
  });
}


function redirect(location, extraHeaders = {}) {
  return new Response(null, {
    status: 303,
    headers: {
      Location: location,
      ...extraHeaders
    }
  });
}


function getSession(request) {
  const cookie = request.headers.get("Cookie") || "";

  const match = cookie.match(
    /(?:^|;\s*)nib_session=([^;]+)/
  );

  return match ? match[1] : null;
}


function getVisitorKey(request) {
  const cookie = request.headers.get("Cookie") || "";

  const match = cookie.match(
    /(?:^|;\s*)nib_visitor=([^;]+)/
  );

  return match ? match[1] : null;
}


function visitorCookie(key) {
  return [
    `nib_visitor=${key}`,
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    "Path=/",
    "Max-Age=31536000"
  ].join("; ");
}


function adminCookie(session) {
  return [
    `nib_session=${session}`,
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    "Path=/",
    "Max-Age=86400"
  ].join("; ");
}


function clearAdminCookie() {
  return [
    "nib_session=",
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    "Path=/",
    "Max-Age=0"
  ].join("; ");
}


// ─────────────────────────────────────────────────────────────────────
// 02. HTML / CSS
// ─────────────────────────────────────────────────────────────────────

function page(content, title = "NiB") {
  return `<!doctype html>
<html lang="de">
<head>

<meta charset="utf-8">

<meta
  name="viewport"
  content="width=device-width,initial-scale=1"
>

<title>${esc(title)}</title>

<style>

:root {
  --bg: #f3efe8;
  --paper: #faf8f4;
  --paper-2: #ebe5dc;
  --text: #29251f;
  --muted: #81796f;
  --line: #ddd6cc;
  --accent: #4d4943;
  --danger: #7a4f4f;
  --success: #52644e;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.6;
}

a {
  color: inherit;
}

main {
  width: min(1000px, calc(100% - 40px));
  margin: 0 auto;
  padding: 45px 0 100px;
}

button,
input,
textarea,
select {
  font: inherit;
}

button {
  border: 1px solid var(--accent);
  background: var(--accent);
  color: #fff;
  padding: 10px 18px;
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

button.like-button {
  background: transparent;
  color: var(--text);
  border-color: var(--line);
}

button.like-button.liked {
  background: var(--accent);
  color: #fff;
}

input,
textarea,
select {
  width: 100%;
  border: 1px solid var(--line);
  background: transparent;
  color: var(--text);
  padding: 12px 13px;
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
  color: var(--muted);
  font-size: 13px;
}

label input,
label textarea,
label select {
  margin-top: 7px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
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
  font-size: 13px;
  letter-spacing: .08em;
  text-transform: uppercase;
}

.card {
  background: var(--paper);
  border: 1px solid var(--line);
  padding: 28px;
}

.section {
  margin-bottom: 45px;
}

.section-title {
  margin: 0 0 20px;
  font-family: Georgia, serif;
  font-size: 27px;
  font-weight: 400;
}

.message {
  border-left: 2px solid var(--accent);
  padding: 10px 15px;
  margin-bottom: 30px;
  color: var(--muted);
}

.message.success {
  border-color: var(--success);
}

.message.danger {
  border-color: var(--danger);
}

.muted {
  color: var(--muted);
}

.small {
  font-size: 13px;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 18px;
  color: var(--muted);
  font-size: 13px;
}

.badge {
  display: inline-block;
  padding: 3px 8px;
  border: 1px solid var(--line);
  font-size: 12px;
}

.visibility-public {
  color: var(--success);
}

.visibility-semi {
  color: #776342;
}

.visibility-private {
  color: var(--danger);
}


/* Öffentliche Website */

.public-header {
  position: relative;
}

.admin-link {
  position: absolute;
  top: 0;
  right: 0;
  text-decoration: none;
  border: 1px solid var(--line);
  padding: 8px 13px;
  font-size: 13px;
  background: var(--paper);
}

.public-intro {
  margin-bottom: 35px;
}

.public-tools {
  display: grid;
  grid-template-columns: 1fr 220px;
  gap: 10px;
  margin-bottom: 35px;
}

.public-list {
  display: flex;
  flex-direction: column;
}

.public-item {
  display: block;
  padding: 24px 0;
  border-top: 1px solid var(--line);
  text-decoration: none;
}

.public-item:first-child {
  border-top: 0;
}

.public-item h2 {
  margin: 0 0 8px;
  font-family: Georgia, serif;
  font-size: 25px;
  font-weight: 400;
}

.public-item:hover h2 {
  text-decoration: underline;
}

.public-item-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 18px;
  color: var(--muted);
  font-size: 13px;
}


/* Öffentlicher Text */

.text-header {
  margin-bottom: 35px;
}

.back-link {
  display: inline-block;
  margin-bottom: 25px;
  color: var(--muted);
  text-decoration: none;
  font-size: 13px;
}

.back-link:hover {
  text-decoration: underline;
}

.text-title {
  margin: 0 0 12px;
  font-family: Georgia, serif;
  font-size: clamp(32px, 6vw, 54px);
  font-weight: 400;
  line-height: 1.15;
}

.text-content {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  word-break: break-word;
  font-size: 17px;
  line-height: 1.85;
}

.image-gallery {
  display: grid;
  gap: 16px;
  margin-top: 35px;
}

.image-gallery img {
  display: block;
  width: 100%;
  height: auto;
  max-height: 800px;
  object-fit: contain;
  background: var(--bg);
  border: 1px solid var(--line);
}

.interaction-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  padding: 20px 0;
  margin-top: 35px;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}

.interaction-count {
  color: var(--muted);
  font-size: 13px;
}


/* Kommentare */

.comments {
  margin-top: 45px;
}

.comment {
  padding: 20px 0;
  border-top: 1px solid var(--line);
}

.comment:first-child {
  border-top: 0;
}

.comment-author {
  font-weight: bold;
  font-size: 14px;
}

.comment-date {
  color: var(--muted);
  font-size: 12px;
  margin-left: 8px;
}

.comment-text {
  margin-top: 8px;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.comment-form {
  margin-top: 30px;
}

.comment-form textarea {
  min-height: 130px;
}


/* Login */

.login {
  max-width: 420px;
  margin: 80px auto;
}


/* Admin */

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 20px;
  margin-bottom: 40px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.dashboard-card {
  display: block;
  min-height: 155px;
  padding: 25px;
  background: var(--paper);
  border: 1px solid var(--line);
  color: var(--text);
  text-decoration: none;
}

.dashboard-card:hover {
  background: var(--paper-2);
}

.dashboard-card.featured {
  background: var(--paper-2);
}

.card-number {
  display: block;
  margin-bottom: 22px;
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

.admin-menu {
  margin-top: 45px;
}

.menu-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 25px;
}

.menu-nav a {
  padding: 8px 12px;
  border: 1px solid var(--line);
  text-decoration: none;
  color: var(--muted);
  font-size: 13px;
}

.menu-nav a:hover {
  color: var(--text);
  border-color: var(--accent);
}

.admin-list-item {
  padding: 22px 0;
  border-top: 1px solid var(--line);
}

.admin-list-item:first-child {
  border-top: 0;
}

.admin-list-title {
  font-family: Georgia, serif;
  font-size: 20px;
  margin-bottom: 5px;
}

.admin-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}

.admin-actions form {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.admin-actions input {
  width: 200px;
  padding: 9px 10px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.password-box {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid var(--line);
  background: var(--bg);
  overflow-wrap: anywhere;
}

.password-value {
  font-family: monospace;
  word-break: break-all;
}

.notification {
  display: inline-block;
  margin-left: 8px;
  padding: 2px 7px;
  background: var(--accent);
  color: white;
  font-size: 11px;
}

.image-admin {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 15px;
}

.image-admin figure {
  margin: 0;
  border: 1px solid var(--line);
  padding: 8px;
}

.image-admin img {
  width: 100%;
  height: 140px;
  object-fit: cover;
}

.empty {
  padding: 25px 0;
  color: var(--muted);
}


/* Responsive */

@media (max-width: 700px) {

  main {
    width: min(100% - 28px, 1000px);
    padding-top: 35px;
  }

  .logo {
    font-size: 36px;
  }

  .header,
  .dashboard-header {
    align-items: flex-start;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .public-tools,
  .form-row {
    grid-template-columns: 1fr;
  }

  .card {
    padding: 20px;
  }

  .admin-link {
    position: static;
    display: inline-block;
    margin-bottom: 25px;
  }

  .image-admin {
    grid-template-columns: 1fr;
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


// ─────────────────────────────────────────────────────────────────────
// 03. ÖFFENTLICHE WEBSITE
// ─────────────────────────────────────────────────────────────────────

function publicHomePage(texts, folders, search = "", folderFilter = "") {

  const publicFolders = folders.filter(
    folder => !Number(folder.is_private)
  );

  const normalizedSearch = search.trim().toLowerCase();

  const filteredTexts = texts.filter(text => {

    const isVisible =
      text.visibility === "public" ||
      text.visibility === "semi_private";

    if (!isVisible) {
      return false;
    }

    const folder =
      publicFolders.find(
        item => item.id === text.folder
      );

    if (text.folder && folder === undefined) {
      return false;
    }

    if (
      folderFilter &&
      String(text.folder) !== String(folderFilter)
    ) {
      return false;
    }

    if (
      normalizedSearch &&
      !String(text.title)
        .toLowerCase()
        .includes(normalizedSearch)
    ) {
      return false;
    }

    return true;
  });


  return page(`

    <header class="public-header">

      <a
        class="admin-link"
        href="/admin"
      >
        Admin-Anmeldung
      </a>

      <p class="subtitle">
        NiB Archiv
      </p>

      <h1 class="logo">
        NiB
      </h1>

      <div class="public-intro">

        <p class="muted">
          Texte, Notizen und Fragmente.
        </p>

      </div>

    </header>


    <section class="section">

      <div class="public-tools">

        <form method="GET">

          <input
            type="text"
            name="q"
            value="${esc(search)}"
            placeholder="Text in Überschrift suchen..."
          >

        </form>


        <form method="GET">

          ${
            search
              ? `
                <input
                  type="hidden"
                  name="q"
                  value="${esc(search)}"
                >
              `
              : ""
          }

          <select
            name="folder"
            onchange="this.form.submit()"
          >

            <option value="">
              Alle Ordner
            </option>

            ${
              publicFolders.map(folder => `
                <option
                  value="${esc(folder.id)}"
                  ${
                    String(folderFilter) === String(folder.id)
                      ? "selected"
                      : ""
                  }
                >
                  ${esc(folder.name)}
                </option>
              `).join("")
            }

          </select>

        </form>

      </div>


      <div class="card">

        ${
          filteredTexts.length

            ? `
              <div class="public-list">

                ${
                  filteredTexts.map(text => {

                    const folder =
                      publicFolders.find(
                        item =>
                          String(item.id) === String(text.folder)
                      );

                    return `

                      <a
                        class="public-item"
                        href="/text/${encodeURIComponent(text.id)}"
                      >

                        <h2>
                          ${esc(text.title)}
                        </h2>

                        <div class="public-item-meta">

                          <span>
                            Ordner:
                            ${esc(folder?.name || text.folder || "Ohne Ordner")}
                          </span>

                          <span>
                            Erstellt:
                            ${esc(formatDate(text.created_at))}
                          </span>

                          <span>
                            Zuletzt bearbeitet:
                            ${esc(formatDate(text.updated_at))}
                          </span>

                          ${
                            text.visibility === "semi_private"
                              ? `
                                <span class="visibility-semi">
                                  Halbprivat
                                </span>
                              `
                              : ""
                          }

                        </div>

                      </a>

                    `;
                  }).join("")
                }

              </div>
            `

            : `
              <div class="empty">
                Keine passenden Texte gefunden.
              </div>
            `
        }

      </div>

    </section>

  `, "NiB Archiv");
}


function publicPasswordPage(text, message = "") {

  return page(`

    <a
      class="back-link"
      href="/"
    >
      ← Zur Übersicht
    </a>


    <header class="text-header">

      <p class="subtitle">
        Halbprivater Text
      </p>

      <h1 class="text-title">
        ${esc(text.title)}
      </h1>

    </header>


    ${
      message
        ? `<p class="message">${esc(message)}</p>`
        : ""
    }


    <section class="card">

      <form method="POST">

        <input
          type="hidden"
          name="action"
          value="unlock_text"
        >

        <input
          type="hidden"
          name="id"
          value="${esc(text.id)}"
        >

        <label>

          Passwort

          <input
            type="password"
            name="password"
            autocomplete="off"
            required
          >

        </label>

        <button type="submit">
          Text öffnen
        </button>

      </form>

    </section>

  `, text.title);
}


function publicTextPage(
  text,
  folder,
  images,
  comments,
  likes,
  liked,
  visitorKey
) {

  return page(`

    <a
      class="back-link"
      href="/"
    >
      ← Zur Übersicht
    </a>


    <header class="text-header">

      <p class="subtitle">
        ${esc(folder?.name || text.folder || "Ohne Ordner")}
      </p>

      <h1 class="text-title">
        ${esc(text.title)}
      </h1>

      <div class="meta">

        <span>
          Erstellt:
          ${esc(formatDate(text.created_at))}
        </span>

        <span>
          Zuletzt bearbeitet:
          ${esc(formatDate(text.updated_at))}
        </span>

      </div>

    </header>


    <article class="card">

      <div class="text-content">
        ${esc(text.content)}
      </div>


      ${
        images.length

          ? `
            <div class="image-gallery">

              ${
                images.map(image => `
                  <img
                    src="${esc(image.url)}"
                    alt="${esc(image.filename || text.title)}"
                    loading="lazy"
                  >
                `).join("")
              }

            </div>
          `

          : ""
      }


      <div class="interaction-bar">

        <form method="POST">

          <input
            type="hidden"
            name="action"
            value="like"
          >

          <input
            type="hidden"
            name="id"
            value="${esc(text.id)}"
          >

          <button
            type="submit"
            class="like-button ${liked ? "liked" : ""}"
          >
            ${liked ? "♥ Gefällt mir" : "♡ Gefällt mir"}
          </button>

        </form>


        <span class="interaction-count">
          ${likes} Like${likes === 1 ? "" : "s"}
        </span>


        <span class="interaction-count">
          ${comments.length}
          Kommentar${comments.length === 1 ? "" : "e"}
        </span>

      </div>

    </article>


    <!-- Kommentare -->

    <section class="comments">

      <h2 class="section-title">
        Kommentare
      </h2>


      <div class="card">

        ${
          comments.length

            ? comments.map(comment => `

              <div class="comment">

                <div>

                  <span class="comment-author">
                    ${
                      comment.author_name
                        ? esc(comment.author_name)
                        : "Anonym"
                    }
                  </span>

                  <span class="comment-date">
                    ${esc(formatDate(comment.created_at))}
                  </span>

                </div>


                <div class="comment-text">
                  ${esc(comment.comment)}
                </div>

              </div>

            `).join("")

            : `
              <p class="muted">
                Noch keine Kommentare.
              </p>
            `
        }


        <div class="comment-form">

          <h3>
            Kommentar schreiben
          </h3>

          <form method="POST">

            <input
              type="hidden"
              name="action"
              value="create_comment"
            >

            <input
              type="hidden"
              name="id"
              value="${esc(text.id)}"
            >


            <label>

              Name
              <span class="small">
                (optional)
              </span>

              <input
                type="text"
                name="author_name"
                maxlength="100"
                placeholder="Anonym"
              >

            </label>


            <label>

              Kommentar

              <textarea
                name="comment"
                maxlength="10000"
                placeholder="Dein Kommentar..."
                required
              ></textarea>

            </label>


            <button type="submit">
              Kommentar veröffentlichen
            </button>

          </form>

        </div>

      </div>

    </section>

  `, text.title);
}


// ─────────────────────────────────────────────────────────────────────
// 04. ADMIN-LOGIN
// ─────────────────────────────────────────────────────────────────────

function loginPage(message = "") {

  return page(`

    <div class="login">

      <a
        class="back-link"
        href="/"
      >
        ← Zur Website
      </a>


      <header>

        <p class="subtitle">
          Verwaltung
        </p>

        <h1 class="logo">
          NiB
        </h1>

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


        ${
          message
            ? `
              <p class="message danger">
                ${esc(message)}
              </p>
            `
            : ""
        }

      </section>

    </div>

  `, "Admin-Anmeldung");
}


// ─────────────────────────────────────────────────────────────────────
// 05. ADMIN-DASHBOARD
// ─────────────────────────────────────────────────────────────────────

function adminDashboardPage(
  message = "",
  commentCount = 0
) {

  return page(`

    <header class="dashboard-header">

      <div>

        <p class="subtitle">
          Admin-Bereich
        </p>

        <h1 class="logo">
          NiB
        </h1>

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
        ? `<p class="message success">${esc(message)}</p>`
        : ""
    }


    <section>

      <div class="dashboard-grid">


        <a
          class="dashboard-card"
          href="/admin/texts"
        >

          <span class="card-number">
            01
          </span>

          <h2>
            Texte
          </h2>

          <p>
            Vorhandene Texte ansehen,
            öffnen und bearbeiten.
          </p>

        </a>


        <a
          class="dashboard-card featured"
          href="/admin/text/new"
        >

          <span class="card-number">
            02
          </span>

          <h2>
            Neuer Text
          </h2>

          <p>
            Einen neuen Text erstellen.
          </p>

        </a>


        <a
          class="dashboard-card"
          href="/admin/folders"
        >

          <span class="card-number">
            03
          </span>

          <h2>
            Ordner
          </h2>

          <p>
            Ordner erstellen und verwalten.
          </p>

        </a>


        <a
          class="dashboard-card"
          href="/admin/comments"
        >

          <span class="card-number">
            04
          </span>

          <h2>
            Kommentare
            ${
              commentCount
                ? `<span class="notification">${commentCount} neu</span>`
                : ""
            }
          </h2>

          <p>
            Kommentare ansehen und löschen.
          </p>

        </a>


        <a
          class="dashboard-card"
          href="/admin/trash"
        >

          <span class="card-number">
            05
          </span>

          <h2>
            Papierkorb
          </h2>

          <p>
            Gelöschte Inhalte verwalten.
          </p>

        </a>


        <a
          class="dashboard-card"
          href="/admin/passwords"
        >

          <span class="card-number">
            06
          </span>

          <h2>
            Passwörter
          </h2>

          <p>
            Halbprivates Passwort und
            Textpasswörter.
          </p>

        </a>


        <a
          class="dashboard-card"
          href="/admin/settings"
        >

          <span class="card-number">
            07
          </span>

          <h2>
            Einstellungen
          </h2>

          <p>
            Weitere NiB-Einstellungen.
          </p>

        </a>


        <a
          class="dashboard-card"
          href="/"
          target="_blank"
          rel="noopener"
        >

          <span class="card-number">
            08
          </span>

          <h2>
            Website
          </h2>

          <p>
            Öffentliche Website öffnen.
          </p>

        </a>

      </div>

    </section>

  `, "NiB Admin");
}


// ─────────────────────────────────────────────────────────────────────
// 06. ADMIN-MENÜS
// ─────────────────────────────────────────────────────────────────────

function adminHeader(title, commentCount = 0) {

  return `

    <header class="dashboard-header">

      <div>

        <a
          class="back-link"
          href="/admin"
        >
          ← Dashboard
        </a>

        <p class="subtitle">
          Admin-Bereich
        </p>

        <h1 class="section-title">
          ${esc(title)}
        </h1>

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


    <nav class="menu-nav">

      <a href="/admin/texts">
        Texte
      </a>

      <a href="/admin/text/new">
        Neuer Text
      </a>

      <a href="/admin/folders">
        Ordner
      </a>

      <a href="/admin/comments">
        Kommentare
        ${
          commentCount
            ? `<span class="notification">${commentCount}</span>`
            : ""
        }
      </a>

      <a href="/admin/trash">
        Papierkorb
      </a>

      <a href="/admin/passwords">
        Passwörter
      </a>

      <a href="/admin/settings">
        Einstellungen
      </a>

      <a href="/">
        Website
      </a>

    </nav>
  `;
}


function adminTextsPage(
  texts,
  folders,
  commentCount = 0,
  message = ""
) {

  return page(`

    ${adminHeader("Texte", commentCount)}


    ${
      message
        ? `<p class="message success">${esc(message)}</p>`
        : ""
    }


    <section class="card">

      ${
        texts.length

          ? texts.map(text => {

              const folder =
                folders.find(
                  item =>
                    String(item.id) === String(text.folder)
                );

              return `

                <div class="admin-list-item">

                  <div class="admin-list-title">
                    ${esc(text.title)}
                  </div>


                  <div class="meta">

                    <span>
                      ${esc(
                        visibilityLabel(text.visibility)
                      )}
                    </span>

                    <span>
                      Ordner:
                      ${esc(folder?.name || text.folder || "Ohne Ordner")}
                    </span>

                    <span>
                      Erstellt:
                      ${esc(formatDate(text.created_at))}
                    </span>

                    <span>
                      Bearbeitet:
                      ${esc(formatDate(text.updated_at))}
                    </span>

                  </div>


                  <div class="admin-actions">

                    <a href="/admin/text/${encodeURIComponent(text.id)}">
                      <button
                        type="button"
                        class="secondary"
                      >
                        Öffnen / Bearbeiten
                      </button>
                    </a>


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
                        In Papierkorb
                      </button>

                    </form>

                  </div>

                </div>

              `;
            }).join("")

          : `
            <div class="empty">
              Noch keine Texte vorhanden.
            </div>
          `
      }

    </section>

  `, "Texte – NiB");
}


function adminTextFormPage(
  text,
  folders,
  images,
  commentCount = 0,
  message = ""
) {

  const isNew = !text;

  return page(`

    ${adminHeader(
      isNew
        ? "Neuer Text"
        : "Text bearbeiten",
      commentCount
    )}


    ${
      message
        ? `<p class="message success">${esc(message)}</p>`
        : ""
    }


    <section class="card">

      <form
        method="POST"
        enctype="multipart/form-data"
      >

        <input
          type="hidden"
          name="action"
          value="${isNew ? "create_text" : "update_text"}"
        >


        ${
          isNew
            ? ""
            : `
              <input
                type="hidden"
                name="id"
                value="${esc(text.id)}"
              >
            `
        }


        <label>

          Titel

          <input
            type="text"
            name="title"
            value="${esc(text?.title || "")}"
            required
          >

        </label>


        <div class="form-row">

          <label>

            Ordner

            <select name="folder">

              <option value="">
                Ohne Ordner
              </option>

              ${
                folders.map(folder => `

                  <option
                    value="${esc(folder.id)}"
                    ${
                      String(text?.folder || "") ===
                      String(folder.id)
                        ? "selected"
                        : ""
                    }
                  >
                    ${esc(folder.name)}
                  </option>

                `).join("")
              }

            </select>

          </label>


          <label>

            Sichtbarkeit

            <select name="visibility">

              <option
                value="public"
                ${
                  text?.visibility === "public"
                    ? "selected"
                    : ""
                }
              >
                Öffentlich
              </option>

              <option
                value="semi_private"
                ${
                  text?.visibility === "semi_private"
                    ? "selected"
                    : ""
                }
              >
                Halbprivat
              </option>

              <option
                value="private"
                ${
                  text?.visibility === "private"
                    ? "selected"
                    : ""
                }
              >
                Privat
              </option>

            </select>

          </label>

        </div>


        <label>

          Inhalt

          <textarea
            name="content"
            placeholder="Deinen Text schreiben..."
            required
          >${esc(text?.content || "")}</textarea>

        </label>


        <label>

          Eigenes Halbprivat-Passwort
          <span class="small">
            Leer lassen = allgemeines Halbprivat-Passwort verwenden.
          </span>

          <input
            type="text"
            name="custom_password"
            value="${esc(text?.password || "")}"
            autocomplete="off"
            placeholder="Optionales eigenes Passwort"
          >

        </label>


        <label>

          Bilder

          <input
            type="file"
            name="images"
            accept="image/*"
            multiple
          >

          <span class="small">
            Bilder werden kostenlos über Cloudinary gespeichert.
          </span>

        </label>


        <button type="submit">
          ${isNew ? "Text speichern" : "Änderungen speichern"}
        </button>

      </form>


      ${
        !isNew
          ? `

            <div class="password-box">

              <strong>
                Passwort für diesen Text
              </strong>

              <div class="small muted">
                Nur relevant, wenn der Text halbprivat ist.
              </div>

              <div class="password-value">

                ${
                  text.password
                    ? esc(text.password)
                    : "Allgemeines Halbprivat-Passwort"
                }

              </div>

            </div>

          `
          : ""
      }


      ${
        images.length
          ? `

            <div class="section">

              <h2 class="section-title">
                Bilder
              </h2>

              <div class="image-admin">

                ${
                  images.map(image => `

                    <figure>

                      <img
                        src="${esc(image.url)}"
                        alt="${esc(image.filename || "")}"
                      >

                      <figcaption class="small muted">
                        ${esc(image.filename || "Bild")}
                      </figcaption>

                    </figure>

                  `).join("")
                }

              </div>

            </div>

          `
          : ""
      }

    </section>

  `, isNew ? "Neuer Text – NiB" : text.title);
}


function adminFoldersPage(
  folders,
  commentCount = 0,
  message = ""
) {

  return page(`

    ${adminHeader("Ordner", commentCount)}


    ${
      message
        ? `<p class="message success">${esc(message)}</p>`
        : ""
    }


    <section class="card">

      <form method="POST">

        <input
          type="hidden"
          name="action"
          value="create_folder"
        >


        <label>

          Neuer Ordner

          <input
            type="text"
            name="name"
            placeholder="Ordnername"
            required
          >

        </label>


        <button type="submit">
          Ordner erstellen
        </button>

      </form>


      <div style="margin-top:30px">

        ${
          folders.length

            ? folders.map(folder => `

              <div class="admin-list-item">

                <div class="admin-list-title">
                  ${esc(folder.name)}
                </div>


                <div class="meta">

                  <span>
                    ${
                      Number(folder.is_private)
                        ? "Privater Ordner"
                        : "Öffentlicher Ordner"
                    }
                  </span>

                  <span>
                    Erstellt:
                    ${esc(formatDate(folder.created_at))}
                  </span>

                </div>


                <div class="admin-actions">

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
                        Number(folder.is_private)
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
              <div class="empty">
                Noch keine Ordner vorhanden.
              </div>
            `
        }

      </div>

    </section>

  `, "Ordner – NiB");
}


function adminCommentsPage(
  comments,
  commentCount = 0,
  message = ""
) {

  return page(`

    ${adminHeader("Kommentare", commentCount)}


    ${
      message
        ? `<p class="message success">${esc(message)}</p>`
        : ""
    }


    <section class="card">

      ${
        comments.length

          ? comments.map(comment => `

            <div class="admin-list-item">

              <div class="admin-list-title">

                ${
                  comment.author_name
                    ? esc(comment.author_name)
                    : "Anonym"
                }

              </div>


              <div class="meta">

                <span>
                  Text:
                  ${esc(comment.title)}
                </span>

                <span>
                  ${esc(formatDate(comment.created_at))}
                </span>

              </div>


              <div
                style="
                  margin-top:10px;
                  white-space:pre-wrap;
                  overflow-wrap:anywhere;
                "
              >
                ${esc(comment.comment)}
              </div>


              <div class="admin-actions">

                <form method="POST">

                  <input
                    type="hidden"
                    name="action"
                    value="delete_comment"
                  >

                  <input
                    type="hidden"
                    name="id"
                    value="${esc(comment.id)}"
                  >

                  <button
                    type="submit"
                    class="danger"
                  >
                    Kommentar löschen
                  </button>

                </form>

              </div>

            </div>

          `).join("")

          : `
            <div class="empty">
              Keine Kommentare vorhanden.
            </div>
          `
      }

    </section>

  `, "Kommentare – NiB");
}


function adminTrashPage(
  texts,
  folders,
  commentCount = 0,
  message = ""
) {

  return page(`

    ${adminHeader("Papierkorb", commentCount)}


    ${
      message
        ? `<p class="message success">${esc(message)}</p>`
        : ""
    }


    <section class="card">

      ${
        texts.length

          ? texts.map(text => {

              const folder =
                folders.find(
                  item =>
                    String(item.id) === String(text.folder)
                );

              return `

                <div class="admin-list-item">

                  <div class="admin-list-title">
                    ${esc(text.title)}
                  </div>

                  <div class="meta">

                    <span>
                      Ordner:
                      ${esc(folder?.name || text.folder || "Ohne Ordner")}
                    </span>

                    <span>
                      Gelöscht:
                      ${esc(formatDate(text.deleted_at))}
                    </span>

                  </div>


                  <div class="admin-actions">

                    <form method="POST">

                      <input
                        type="hidden"
                        name="action"
                        value="restore_text"
                      >

                      <input
                        type="hidden"
                        name="id"
                        value="${esc(text.id)}"
                      >

                      <button
                        type="submit"
                        class="secondary"
                      >
                        Wiederherstellen
                      </button>

                    </form>


                    <form method="POST">

                      <input
                        type="hidden"
                        name="action"
                        value="permanent_delete_text"
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
                        Endgültig löschen
                      </button>

                    </form>

                  </div>

                </div>

              `;
            }).join("")

          : `
            <div class="empty">
              Der Papierkorb ist leer.
            </div>
          `
      }

    </section>

  `, "Papierkorb – NiB");
}


function adminPasswordsPage(
  texts,
  commentCount = 0,
  message = ""
) {

  return page(`

    ${adminHeader("Passwörter", commentCount)}


    ${
      message
        ? `<p class="message success">${esc(message)}</p>`
        : ""
    }


    <section class="card">

      <h2 class="section-title">
        Allgemeines Halbprivat-Passwort
      </h2>

      <p class="muted">

        Das allgemeine Passwort wird als
        Cloudflare-Secret
        <strong>SEMI_PRIVATE_PASSWORD</strong>
        gespeichert.

      </p>

      <p class="small muted">

        Neue halbprivate Texte verwenden automatisch
        dieses Passwort, solange kein eigenes Passwort
        für den jeweiligen Text eingetragen wurde.

      </p>

    </section>


    <section>

      <h2 class="section-title">
        Passwörter der einzelnen Texte
      </h2>


      <div class="card">

        ${
          texts.length

            ? texts.map(text => `

              <div class="admin-list-item">

                <div class="admin-list-title">
                  ${esc(text.title)}
                </div>


                <div class="meta">

                  <span>
                    ${esc(
                      visibilityLabel(text.visibility)
                    )}
                  </span>

                </div>


                <div class="password-box">

                  ${
                    text.visibility === "semi_private"

                      ? (
                          text.password
                            ? `
                              <strong>
                                Aktuelles Passwort:
                              </strong>

                              <div class="password-value">
                                ${esc(text.password)}
                              </div>
                            `
                            : `
                              <strong>
                                Aktuelles Passwort:
                              </strong>

                              <div class="password-value">
                                Allgemeines Halbprivat-Passwort
                              </div>
                            `
                        )

                      : `
                        <span class="muted">
                          Für diesen Text ist kein öffentliches
                          Passwort erforderlich.
                        </span>
                      `
                  }

                </div>

              </div>

            `).join("")

            : `
              <div class="empty">
                Noch keine Texte vorhanden.
              </div>
            `
        }

      </div>

    </section>

  `, "Passwörter – NiB");
}


function adminSettingsPage(
  commentCount = 0,
  message = ""
) {

  return page(`

    ${adminHeader("Einstellungen", commentCount)}


    ${
      message
        ? `<p class="message success">${esc(message)}</p>`
        : ""
    }


    <section class="card">

      <h2 class="section-title">
        NiB
      </h2>

      <p class="muted">
        Die wichtigsten Bereiche des Archivs sind
        über das Dashboard getrennt erreichbar.
      </p>

      <p class="small muted">
        Das Admin-Passwort und die Cloudinary-Zugangsdaten
        bleiben als Cloudflare-Secrets gespeichert.
      </p>

    </section>

  `, "Einstellungen – NiB");
}


// ─────────────────────────────────────────────────────────────────────
// 07. DATENBANK-FUNKTIONEN
// ─────────────────────────────────────────────────────────────────────

async function getFolders(env, includeDeleted = false) {

  const query = includeDeleted
    ? `
      SELECT
        id,
        name,
        is_private,
        created_at,
        updated_at,
        deleted_at
      FROM folders
      ORDER BY name COLLATE NOCASE
    `
    : `
      SELECT
        id,
        name,
        is_private,
        created_at,
        updated_at,
        deleted_at
      FROM folders
      WHERE deleted_at IS NULL
      ORDER BY name COLLATE NOCASE
    `;

  const result =
    await env.DB.prepare(query).all();

  return result.results || [];
}


async function getTexts(
  env,
  includeDeleted = false
) {

  const query = includeDeleted
    ? `
      SELECT
        id,
        title,
        content,
        folder,
        visibility,
        password,
        updated_at,
        created_at,
        deleted_at
      FROM texts
      ORDER BY updated_at DESC
    `
    : `
      SELECT
        id,
        title,
        content,
        folder,
        visibility,
        password,
        updated_at,
        created_at,
        deleted_at
      FROM texts
      WHERE deleted_at IS NULL
      ORDER BY updated_at DESC
    `;

  const result =
    await env.DB.prepare(query).all();

  return result.results || [];
}


async function getTextById(
  env,
  id,
  includeDeleted = false
) {

  const query = includeDeleted
    ? `
      SELECT
        id,
        title,
        content,
        folder,
        visibility,
        password,
        updated_at,
        created_at,
        deleted_at
      FROM texts
      WHERE id = ?
    `
    : `
      SELECT
        id,
        title,
        content,
        folder,
        visibility,
        password,
        updated_at,
        created_at,
        deleted_at
      FROM texts
      WHERE
        id = ?
        AND deleted_at IS NULL
    `;

  return await env.DB
    .prepare(query)
    .bind(id)
    .first();
}


async function getPublicTextById(env, id) {

  return await env.DB
    .prepare(`
      SELECT
        t.id,
        t.title,
        t.content,
        t.folder,
        t.visibility,
        t.password,
        t.updated_at,
        t.created_at
      FROM texts t
      LEFT JOIN folders f
        ON f.id = t.folder
      WHERE
        t.id = ?
        AND t.deleted_at IS NULL
        AND (
          t.visibility = 'public'
          OR t.visibility = 'semi_private'
        )
        AND (
          t.folder IS NULL
          OR t.folder = ''
          OR f.id IS NOT NULL AND f.deleted_at IS NULL AND f.is_private = 0
        )
    `)
    .bind(id)
    .first();
}


async function getComments(env, textId = null) {

  if (textId !== null) {

    const result =
      await env.DB
        .prepare(`
          SELECT
            id,
            text_id,
            comment,
            created_at,
            author_name
          FROM comments
          WHERE text_id = ?
          ORDER BY created_at ASC, id ASC
        `)
        .bind(textId)
        .all();

    return result.results || [];
  }


  const result =
    await env.DB
      .prepare(`
        SELECT
          c.id,
          c.text_id,
          c.comment,
          c.created_at,
          c.author_name,
          t.title
        FROM comments c
        LEFT JOIN texts t
          ON t.id = c.text_id
        ORDER BY c.created_at DESC, c.id DESC
      `)
      .all();

  return result.results || [];
}


async function getLikes(env, textId) {

  const result =
    await env.DB
      .prepare(`
        SELECT COUNT(*) AS count
        FROM text_likes
        WHERE text_id = ?
      `)
      .bind(textId)
      .first();

  return Number(result?.count || 0);
}


async function hasLiked(env, textId, visitorKey) {

  if (!visitorKey) {
    return false;
  }

  const result =
    await env.DB
      .prepare(`
        SELECT id
        FROM text_likes
        WHERE
          text_id = ?
          AND visitor_key = ?
        LIMIT 1
      `)
      .bind(textId, visitorKey)
      .first();

  return Boolean(result);
}


async function getImages(env, textId) {

  const result =
    await env.DB
      .prepare(`
        SELECT
          id,
          text_id,
          r2_key,
          filename,
          created_at
        FROM text_images
        WHERE text_id = ?
        ORDER BY created_at ASC
      `)
      .bind(textId)
      .all();

  return (result.results || []).map(image => ({
    ...image,

    // Für bestehende Einträge wird r2_key als URL
    // verwendet. Neue Cloudinary-Bilder speichern
    // ihre URL dort ebenfalls.
    url: image.r2_key
  }));
}


async function getSetting(env, key) {

  const result =
    await env.DB
      .prepare(`
        SELECT value
        FROM settings
        WHERE key = ?
      `)
      .bind(key)
      .first();

  return result?.value || "";
}


async function setSetting(env, key, value) {

  await env.DB
    .prepare(`
      INSERT INTO settings
      (
        key,
        value
      )
      VALUES (?, ?)

      ON CONFLICT(key)
      DO UPDATE SET
        value = excluded.value
    `)
    .bind(key, value)
    .run();
}


async function getNewCommentCount(env) {

  const lastSeen =
    await getSetting(
      env,
      "comments_last_seen"
    );

  if (!lastSeen) {

    const result =
      await env.DB
        .prepare(`
          SELECT COUNT(*) AS count
          FROM comments
        `)
        .first();

    return Number(result?.count || 0);
  }


  const result =
    await env.DB
      .prepare(`
        SELECT COUNT(*) AS count
        FROM comments
        WHERE created_at > ?
      `)
      .bind(lastSeen)
      .first();

  return Number(result?.count || 0);
}


// ─────────────────────────────────────────────────────────────────────
// 08. CLOUDINARY
// ─────────────────────────────────────────────────────────────────────

async function sha1Hex(text) {

  const data =
    new TextEncoder().encode(text);

  const hash =
    await crypto.subtle.digest(
      "SHA-1",
      data
    );

  return [...new Uint8Array(hash)]
    .map(byte =>
      byte.toString(16).padStart(2, "0")
    )
    .join("");
}


async function uploadToCloudinary(
  file,
  env
) {

  if (!file || !file.size) {
    return null;
  }


  if (!env.CLOUDINARY_CLOUD_NAME) {
    throw new Error(
      "CLOUDINARY_CLOUD_NAME fehlt."
    );
  }


  if (!env.CLOUDINARY_API_KEY) {
    throw new Error(
      "CLOUDINARY_API_KEY fehlt."
    );
  }


  if (!env.CLOUDINARY_API_SECRET) {
    throw new Error(
      "CLOUDINARY_API_SECRET fehlt."
    );
  }


  const timestamp =
    Math.floor(Date.now() / 1000);


  const folder =
    "nib-archiv";


  const paramsToSign =
    `folder=${folder}&timestamp=${timestamp}`;


  const signature =
    await sha1Hex(
      paramsToSign +
      env.CLOUDINARY_API_SECRET
    );


  const uploadUrl =
    `https://api.cloudinary.com/v1_1/${encodeURIComponent(
      env.CLOUDINARY_CLOUD_NAME
    )}/image/upload`;


  const body =
    new FormData();

  body.append(
    "file",
    file,
    file.name || "image"
  );

  body.append(
    "api_key",
    env.CLOUDINARY_API_KEY
  );

  body.append(
    "timestamp",
    String(timestamp)
  );

  body.append(
    "signature",
    signature
  );

  body.append(
    "folder",
    folder
  );


  const response =
    await fetch(
      uploadUrl,
      {
        method: "POST",
        body
      }
    );


  if (!response.ok) {

    const errorText =
      await response.text();

    throw new Error(
      `Cloudinary-Upload fehlgeschlagen: ${errorText}`
    );
  }


  const result =
    await response.json();


  return {
    url: result.secure_url,
    public_id: result.public_id,
    filename: file.name || "image"
  };
}


// ─────────────────────────────────────────────────────────────────────
// 09. SESSIONS / BESUCHER
// ─────────────────────────────────────────────────────────────────────

async function requireAdmin(
  request,
  env
) {

  const session =
    getSession(request);

  if (!session) {
    return false;
  }

  const value =
    await env.SESSIONS.get(session);

  return value === "admin";
}


async function createAdminSession(env) {

  const session =
    randomId();

  await env.SESSIONS.put(
    session,
    "admin",
    {
      expirationTtl:
        60 * 60 * 24
    }
  );

  return session;
}


function ensureVisitorKey(request) {

  const existing =
    getVisitorKey(request);

  if (existing) {
    return {
      key: existing,
      cookie: null
    };
  }

  const key =
    randomId();

  return {
    key,
    cookie: visitorCookie(key)
  };
}


// ─────────────────────────────────────────────────────────────────────
// 10. WORKER / ROUTING
// ─────────────────────────────────────────────────────────────────────

export default {

  async fetch(request, env) {

    const url =
      new URL(request.url);

    const path =
      url.pathname;


    // ═══════════════════════════════════════════════════════════════
    // ADMIN-LOGIN / ADMIN-BEREICH
    // ═══════════════════════════════════════════════════════════════

    const isAdmin =
      await requireAdmin(
        request,
        env
      );


    // ───────────────────────────────────────────────────────────────
    // ADMIN-LOGIN
    // ───────────────────────────────────────────────────────────────

    if (
      path === "/admin" ||
      path === "/admin/"
    ) {

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

            const session =
              await createAdminSession(env);


            return redirect(
              "/admin",
              {
                "Set-Cookie":
                  adminCookie(session)
              }
            );
          }


          return htmlResponse(
            loginPage(
              "Falsches Passwort."
            ),
            401
          );
        }


        if (
          action === "logout" &&
          isAdmin
        ) {

          const session =
            getSession(request);

          if (session) {
            await env.SESSIONS.delete(
              session
            );
          }

          return redirect(
            "/admin",
            {
              "Set-Cookie":
                clearAdminCookie()
            }
          );
        }

      }


      if (!isAdmin) {
        return htmlResponse(
          loginPage()
        );
      }


      const commentCount =
        await getNewCommentCount(env);


      return htmlResponse(
        adminDashboardPage(
          "",
          commentCount
        )
      );
    }


    // ───────────────────────────────────────────────────────────────
    // ADMIN: TEXTE
    // ───────────────────────────────────────────────────────────────

    if (
      path === "/admin/texts" &&
      isAdmin
    ) {

      let message = "";


      if (request.method === "POST") {

        const form =
          await request.formData();

        const action =
          String(
            form.get("action") || ""
          );


        if (action === "delete_text") {

          const id =
            String(
              form.get("id") || ""
            );


          if (id) {

            const now =
              new Date().toISOString();

            await env.DB
              .prepare(`
                UPDATE texts
                SET
                  deleted_at = ?,
                  updated_at = ?
                WHERE
                  id = ?
                  AND deleted_at IS NULL
              `)
              .bind(
                now,
                now,
                id
              )
              .run();

            message =
              "Text in den Papierkorb verschoben.";
          }
        }

      }


      const texts =
        await getTexts(env);

      const folders =
        await getFolders(env);

      const commentCount =
        await getNewCommentCount(env);


      return htmlResponse(
        adminTextsPage(
          texts,
          folders,
          commentCount,
          message
        )
      );
    }


    // ───────────────────────────────────────────────────────────────
    // ADMIN: NEUER TEXT
    // ───────────────────────────────────────────────────────────────

    if (
      path === "/admin/text/new" &&
      isAdmin
    ) {

      const folders =
        await getFolders(env);

      const commentCount =
        await getNewCommentCount(env);


      if (request.method === "POST") {

        const form =
          await request.formData();


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
          ).trim();


        const visibility =
          String(
            form.get("visibility") ||
            "private"
          );


        const customPassword =
          String(
            form.get("custom_password") ||
            ""
          ).trim();


        if (!title) {

          return htmlResponse(
            adminTextFormPage(
              {
                title,
                content,
                folder,
                visibility,
                password: customPassword
              },
              folders,
              [],
              commentCount,
              "Bitte einen Titel eingeben."
            ),
            400
          );
        }


        if (
          ![
            "public",
            "semi_private",
            "private"
          ].includes(visibility)
        ) {

          return htmlResponse(
            adminTextFormPage(
              {
                title,
                content,
                folder,
                visibility,
                password: customPassword
              },
              folders,
              [],
              commentCount,
              "Ungültige Sichtbarkeit."
            ),
            400
          );
        }


        const now =
          new Date().toISOString();


        const result =
          await env.DB
            .prepare(`
              INSERT INTO texts
              (
                title,
                content,
                folder,
                visibility,
                password,
                updated_at,
                created_at,
                deleted_at
              )
              VALUES (?, ?, ?, ?, ?, ?, ?, NULL)
            `)
            .bind(
              title,
              content,
              folder,
              visibility,
              customPassword || null,
              now,
              now
            )
            .run();


        const textId =
          result.meta?.last_row_id;


        if (textId) {

          const files =
            form.getAll("images");


          for (const file of files) {

            if (
              !(file instanceof File) ||
              !file.size
            ) {
              continue;
            }


            try {

              const uploaded =
                await uploadToCloudinary(
                  file,
                  env
                );


              if (!uploaded) {
                continue;
              }


              await env.DB
                .prepare(`
                  INSERT INTO text_images
                  (
                    id,
                    text_id,
                    r2_key,
                    filename,
                    created_at
                  )
                  VALUES (?, ?, ?, ?, ?)
                `)
                .bind(
                  randomId(),
                  textId,
                  uploaded.url,
                  uploaded.filename,
                  now
                )
                .run();

            } catch (error) {

              console.error(
                "Cloudinary Upload:",
                error
              );

            }

          }

        }


        return redirect(
          `/admin/text/${encodeURIComponent(textId)}`
        );
      }


      return htmlResponse(
        adminTextFormPage(
          null,
          folders,
          [],
          commentCount
        )
      );
    }


    // ───────────────────────────────────────────────────────────────
    // ADMIN: TEXT ÖFFNEN / BEARBEITEN
    // ───────────────────────────────────────────────────────────────

    const adminTextMatch =
      path.match(
        /^\/admin\/text\/(\d+)$/
      );


    if (
      adminTextMatch &&
      isAdmin
    ) {

      const id =
        adminTextMatch[1];


      let text =
        await getTextById(
          env,
          id,
          false
        );


      if (!text) {

        return htmlResponse(
          adminTextsPage(
            await getTexts(env),
            await getFolders(env),
            await getNewCommentCount(env),
            "Text nicht gefunden."
          ),
          404
        );
      }


      const folders =
        await getFolders(env);

      const commentCount =
        await getNewCommentCount(env);


      if (request.method === "POST") {

        const form =
          await request.formData();


        const action =
          String(
            form.get("action") || ""
          );


        if (action === "update_text") {

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
            ).trim();


          const visibility =
            String(
              form.get("visibility") ||
              "private"
            );


          const customPassword =
            String(
              form.get("custom_password") ||
              ""
            ).trim();


          if (!title) {

            return htmlResponse(
              adminTextFormPage(
                {
                  ...text,
                  title,
                  content,
                  folder,
                  visibility,
                  password: customPassword
                },
                folders,
                await getImages(env, id),
                commentCount,
                "Bitte einen Titel eingeben."
              ),
              400
            );
          }


          if (
            ![
              "public",
              "semi_private",
              "private"
            ].includes(visibility)
          ) {

            return htmlResponse(
              adminTextFormPage(
                {
                  ...text,
                  title,
                  content,
                  folder,
                  visibility,
                  password: customPassword
                },
                folders,
                await getImages(env, id),
                commentCount,
                "Ungültige Sichtbarkeit."
              ),
              400
            );
          }


          const now =
            new Date().toISOString();


          await env.DB
            .prepare(`
              UPDATE texts
              SET
                title = ?,
                content = ?,
                folder = ?,
                visibility = ?,
                password = ?,
                updated_at = ?
              WHERE
                id = ?
                AND deleted_at IS NULL
            `)
            .bind(
              title,
              content,
              folder,
              visibility,
              customPassword || null,
              now,
              id
            )
            .run();


          const files =
            form.getAll("images");


          for (const file of files) {

            if (
              !(file instanceof File) ||
              !file.size
            ) {
              continue;
            }


            try {

              const uploaded =
                await uploadToCloudinary(
                  file,
                  env
                );


              if (!uploaded) {
                continue;
              }


              await env.DB
                .prepare(`
                  INSERT INTO text_images
                  (
                    id,
                    text_id,
                    r2_key,
                    filename,
                    created_at
                  )
                  VALUES (?, ?, ?, ?, ?)
                `)
                .bind(
                  randomId(),
                  id,
                  uploaded.url,
                  uploaded.filename,
                  now
                )
                .run();

            } catch (error) {

              console.error(
                "Cloudinary Upload:",
                error
              );

            }

          }


          text =
            await getTextById(
              env,
              id,
              false
            );


          return htmlResponse(
            adminTextFormPage(
              text,
              folders,
              await getImages(env, id),
              commentCount,
              "Text gespeichert."
            )
          );
        }

      }


      return htmlResponse(
        adminTextFormPage(
          text,
          folders,
          await getImages(env, id),
          commentCount
        )
      );
    }


    // ───────────────────────────────────────────────────────────────
    // ADMIN: ORDNER
    // ───────────────────────────────────────────────────────────────

    if (
      path === "/admin/folders" &&
      isAdmin
    ) {

      let message = "";


      if (request.method === "POST") {

        const form =
          await request.formData();


        const action =
          String(
            form.get("action") || ""
          );


        if (action === "create_folder") {

          const name =
            String(
              form.get("name") || ""
            ).trim();


          if (name) {

            const now =
              new Date().toISOString();


            await env.DB
              .prepare(`
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
                randomId(),
                name,
                now,
                now
              )
              .run();


            message =
              "Ordner erstellt.";

          }

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

            await env.DB
              .prepare(`
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


            message =
              "Ordner umbenannt.";
          }

        }


        if (action === "toggle_folder") {

          const id =
            String(
              form.get("id") || ""
            );


          if (id) {

            await env.DB
              .prepare(`
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


            message =
              "Sichtbarkeit des Ordners geändert.";
          }

        }


        if (action === "delete_folder") {

          const id =
            String(
              form.get("id") || ""
            );


          if (id) {

            const now =
              new Date().toISOString();


            await env.DB
              .prepare(`
                UPDATE folders
                SET
                  deleted_at = ?,
                  updated_at = ?
                WHERE
                  id = ?
                  AND deleted_at IS NULL
              `)
              .bind(
                now,
                now,
                id
              )
              .run();


            message =
              "Ordner in den Papierkorb verschoben.";
          }

        }

      }


      return htmlResponse(
        adminFoldersPage(
          await getFolders(env),
          await getNewCommentCount(env),
          message
        )
      );
    }


    // ───────────────────────────────────────────────────────────────
    // ADMIN: KOMMENTARE
    // ───────────────────────────────────────────────────────────────

    if (
      path === "/admin/comments" &&
      isAdmin
    ) {

      let message = "";


      if (request.method === "POST") {

        const form =
          await request.formData();


        const action =
          String(
            form.get("action") || ""
          );


        if (action === "delete_comment") {

          const id =
            String(
              form.get("id") || ""
            );


          if (id) {

            await env.DB
              .prepare(`
                DELETE FROM comments
                WHERE id = ?
              `)
              .bind(id)
              .run();


            message =
              "Kommentar gelöscht.";
          }

        }


        await setSetting(
          env,
          "comments_last_seen",
          new Date().toISOString()
        );

      }


      const comments =
        await getComments(env);


      await setSetting(
        env,
        "comments_last_seen",
        new Date().toISOString()
      );


      return htmlResponse(
        adminCommentsPage(
          comments,
          0,
          message
        )
      );
    }


    // ───────────────────────────────────────────────────────────────
    // ADMIN: PAPIERKORB
    // ───────────────────────────────────────────────────────────────

    if (
      path === "/admin/trash" &&
      isAdmin
    ) {

      let message = "";


      if (request.method === "POST") {

        const form =
          await request.formData();


        const action =
          String(
            form.get("action") || ""
          );


        const id =
          String(
            form.get("id") || ""
          );


        if (
          id &&
          action === "restore_text"
        ) {

          await env.DB
            .prepare(`
              UPDATE texts
              SET
                deleted_at = NULL,
                updated_at = ?
              WHERE id = ?
            `)
            .bind(
              new Date().toISOString(),
              id
            )
            .run();


          message =
            "Text wiederhergestellt.";
        }


        if (
          id &&
          action === "permanent_delete_text"
        ) {

          await env.DB
            .prepare(`
              DELETE FROM text_images
              WHERE text_id = ?
            `)
            .bind(id)
            .run();


          await env.DB
            .prepare(`
              DELETE FROM comments
              WHERE text_id = ?
            `)
            .bind(id)
            .run();


          await env.DB
            .prepare(`
              DELETE FROM text_likes
              WHERE text_id = ?
            `)
            .bind(id)
            .run();


          await env.DB
            .prepare(`
              DELETE FROM texts
              WHERE id = ?
            `)
            .bind(id)
            .run();


          message =
            "Text endgültig gelöscht.";
        }

      }


      return htmlResponse(
        adminTrashPage(
          await getTexts(env, true)
            .then(
              items =>
                items.filter(
                  item => item.deleted_at
                )
            ),
          await getFolders(env),
          await getNewCommentCount(env),
          message
        )
      );
    }


    // ───────────────────────────────────────────────────────────────
    // ADMIN: PASSWÖRTER
    // ───────────────────────────────────────────────────────────────

    if (
      path === "/admin/passwords" &&
      isAdmin
    ) {

      return htmlResponse(
        adminPasswordsPage(
          await getTexts(env),
          await getNewCommentCount(env)
        )
      );
    }


    // ───────────────────────────────────────────────────────────────
    // ADMIN: EINSTELLUNGEN
    // ───────────────────────────────────────────────────────────────

    if (
      path === "/admin/settings" &&
      isAdmin
    ) {

      return htmlResponse(
        adminSettingsPage(
          await getNewCommentCount(env)
        )
      );
    }


    // ═══════════════════════════════════════════════════════════════
    // ÖFFENTLICHE TEXTSEITE
    // ═══════════════════════════════════════════════════════════════

    const publicTextMatch =
      path.match(
        /^\/text\/(\d+)$/
      );


    if (publicTextMatch) {

      const id =
        publicTextMatch[1];


      const text =
        await getPublicTextById(
          env,
          id
        );


      if (!text) {

        return htmlResponse(
          page(`
            <a class="back-link" href="/">
              ← Zurück
            </a>

            <h1 class="section-title">
              Text nicht gefunden
            </h1>

            <p class="muted">
              Dieser Text existiert nicht oder ist nicht öffentlich.
            </p>
          `, "Nicht gefunden")
        , 404);
      }


      // Halbprivate Texte benötigen Passwort.
      if (
        text.visibility === "semi_private"
      ) {

        if (request.method === "POST") {

          const form =
            await request.formData();


          const action =
            String(
              form.get("action") || ""
            );


          if (
            action === "unlock_text"
          ) {

            const password =
              String(
                form.get("password") || ""
              );


            const expectedPassword =
              text.password ||
              env.SEMI_PRIVATE_PASSWORD;


            if (
              password ===
              expectedPassword
            ) {

              const unlocked =
                new Headers();

              unlocked.append(
                "Set-Cookie",
                [
                  `nib_unlock_${id}=1`,
                  "HttpOnly",
                  "Secure",
                  "SameSite=Lax",
                  "Path=/",
                  "Max-Age=86400"
                ].join("; ")
              );


              const visitor =
                ensureVisitorKey(request);


              if (visitor.cookie) {
                unlocked.append(
                  "Set-Cookie",
                  visitor.cookie
                );
              }


              const comments =
                await getComments(
                  env,
                  id
                );


              const images =
                await getImages(
                  env,
                  id
                );


              const likes =
                await getLikes(
                  env,
                  id
                );


              const liked =
                await hasLiked(
                  env,
                  id,
                  visitor.key
                );


              const folders =
                await getFolders(env);


              const folder =
                folders.find(
                  item =>
                    String(item.id) ===
                    String(text.folder)
                );


              const response =
                htmlResponse(
                  publicTextPage(
                    text,
                    folder,
                    images,
                    comments,
                    likes,
                    liked,
                    visitor.key
                  )
                );


              response.headers.append(
                "Set-Cookie",
                unlocked.get(
                  "Set-Cookie"
                )
              );


              if (visitor.cookie) {
                response.headers.append(
                  "Set-Cookie",
                  visitor.cookie
                );
              }


              return response;
            }


            return htmlResponse(
              publicPasswordPage(
                text,
                "Falsches Passwort."
              ),
              401
            );
          }

        }


        const cookies =
          request.headers.get("Cookie") || "";


        const unlocked =
          new RegExp(
            `(?:^|;\\s*)nib_unlock_${id}=1(?:;|$)`
          ).test(cookies);


        if (!unlocked) {

          return htmlResponse(
            publicPasswordPage(text)
          );
        }

      }


      // ─────────────────────────────────────────────────────────────
      // Öffentlicher Text
      // ─────────────────────────────────────────────────────────────

      const visitor =
        ensureVisitorKey(request);


      const comments =
        await getComments(
          env,
          id
        );


      const images =
        await getImages(
          env,
          id
        );


      const likes =
        await getLikes(
          env,
          id
        );


      const liked =
        await hasLiked(
          env,
          id,
          visitor.key
        );


      const folders =
        await getFolders(env);


      const folder =
        folders.find(
          item =>
            String(item.id) ===
            String(text.folder)
        );


      const response =
        htmlResponse(
          publicTextPage(
            text,
            folder,
            images,
            comments,
            likes,
            liked,
            visitor.key
          )
        );


      if (visitor.cookie) {

        response.headers.append(
          "Set-Cookie",
          visitor.cookie
        );

      }


      return response;
    }


    // ═══════════════════════════════════════════════════════════════
    // ÖFFENTLICHE POST-AKTIONEN
    // ═══════════════════════════════════════════════════════════════

    if (
      request.method === "POST" &&
      (
        path === "/like" ||
        path === "/comment"
      )
    ) {

      const form =
        await request.formData();


      const action =
        String(
          form.get("action") || ""
        );


      const id =
        String(
          form.get("id") || ""
        );


      const text =
        await getPublicTextById(
          env,
          id
        );


      if (!text) {

        return htmlResponse(
          "Text nicht gefunden.",
          404
        );
      }


      // ─────────────────────────────────────────────────────────────
      // Like
      // ─────────────────────────────────────────────────────────────

      if (
        action === "like" &&
        path === "/like"
      ) {

        const visitor =
          ensureVisitorKey(request);


        const alreadyLiked =
          await hasLiked(
            env,
            id,
            visitor.key
          );


        if (alreadyLiked) {

          await env.DB
            .prepare(`
              DELETE FROM text_likes
              WHERE
                text_id = ?
                AND visitor_key = ?
            `)
            .bind(
              id,
              visitor.key
            )
            .run();

        } else {

          await env.DB
            .prepare(`
              INSERT OR IGNORE INTO text_likes
              (
                text_id,
                visitor_key,
                created_at
              )
              VALUES (?, ?, ?)
            `)
            .bind(
              id,
              visitor.key,
              new Date().toISOString()
            )
            .run();

        }


        const headers = {};


        if (visitor.cookie) {
          headers["Set-Cookie"] =
            visitor.cookie;
        }


        return redirect(
          `/text/${encodeURIComponent(id)}`,
          headers
        );
      }


      // ─────────────────────────────────────────────────────────────
      // Kommentar
      // ─────────────────────────────────────────────────────────────

      if (
        action === "create_comment" &&
        path === "/comment"
      ) {

        const comment =
          String(
            form.get("comment") || ""
          ).trim();


        const authorName =
          String(
            form.get("author_name") || ""
          ).trim();


        if (!comment) {

          return redirect(
            `/text/${encodeURIComponent(id)}`
          );
        }


        const safeAuthor =
          authorName
            ? authorName.slice(0, 100)
            : null;


        await env.DB
          .prepare(`
            INSERT INTO comments
            (
              text_id,
              comment,
              created_at,
              author_name
            )
            VALUES (?, ?, ?, ?)
          `)
          .bind(
            id,
            comment.slice(0, 10000),
            new Date().toISOString(),
            safeAuthor
          )
          .run();


        return redirect(
          `/text/${encodeURIComponent(id)}`
        );
      }

    }


    // ═══════════════════════════════════════════════════════════════
    // ÖFFENTLICHE STARTSEITE
    // ═══════════════════════════════════════════════════════════════

    if (
      path === "/" ||
      path === ""
    ) {

      const search =
        url.searchParams.get("q") || "";


      const folderFilter =
        url.searchParams.get("folder") || "";


      const texts =
        await getTexts(env);


      const folders =
        await getFolders(env);


      return htmlResponse(
        publicHomePage(
          texts,
          folders,
          search,
          folderFilter
        )
      );
    }


    // ═══════════════════════════════════════════════════════════════
    // FALLBACK
    // ═══════════════════════════════════════════════════════════════

    return htmlResponse(
      page(`

        <a
          class="back-link"
          href="/"
        >
          ← Zur Startseite
        </a>

        <h1 class="section-title">
          Seite nicht gefunden
        </h1>

        <p class="muted">
          Die angeforderte Seite existiert nicht.
        </p>

      `, "404 – NiB"),
      404
    );

  }

};

