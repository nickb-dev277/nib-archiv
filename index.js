// ─────────────────────────────────────
// NiB – Archiv
// ─────────────────────────────────────

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(value) {
  if (!value) return "–";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

function visibilityName(value) {
  if (value === "public") return "Öffentlich";
  if (value === "semi_private") return "Halbprivat";
  return "Privat";
}


// ─────────────────────────────────────
// HTML-Grundseite
// ─────────────────────────────────────

function page(content, title = "NiB") {
  return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">

<title>${esc(title)} – NiB</title>

<style>

:root {
  --bg: #f3efe8;
  --paper: #faf8f4;
  --text: #29251f;
  --muted: #81796f;
  --line: #ddd6cc;
  --accent: #4d4943;
  --danger: #7a4f4f;
  --success: #596c59;
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
  font-size: 13px;
  letter-spacing: .08em;
  text-transform: uppercase;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 55px;
}

.topbar-right {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

section {
  margin-bottom: 45px;
}

.section-title {
  margin: 0 0 20px;
  font-family: Georgia, serif;
  font-size: 28px;
  font-weight: 400;
}

.card {
  background: var(--paper);
  border: 1px solid var(--line);
  padding: 28px;
}

.card + .card {
  margin-top: 14px;
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

button,
.button {
  display: inline-block;
  border: 1px solid var(--accent);
  background: var(--accent);
  color: #fff;
  padding: 10px 18px;
  font: inherit;
  cursor: pointer;
  text-decoration: none;
}

button:hover,
.button:hover {
  opacity: .82;
}

button.secondary,
.button.secondary {
  background: transparent;
  color: var(--text);
  border-color: var(--line);
}

button.danger,
.button.danger {
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

.message {
  border-left: 2px solid var(--accent);
  padding: 10px 15px;
  margin-bottom: 30px;
  color: var(--muted);
  background: rgba(255,255,255,.25);
}

.message.success {
  border-color: var(--success);
}

.message.error {
  border-color: var(--danger);
}

.muted {
  color: var(--muted);
}

.meta {
  color: var(--muted);
  font-size: 13px;
}

.meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 20px;
  margin-top: 10px;
}

.search-row {
  display: grid;
  grid-template-columns: 1fr 220px auto;
  gap: 10px;
}

.text-list {
  display: grid;
  gap: 12px;
}

.text-card {
  display: block;
  padding: 22px;
  border: 1px solid var(--line);
  background: var(--paper);
  text-decoration: none;
  transition: border-color .15s ease;
}

.text-card:hover {
  border-color: var(--accent);
}

.text-title {
  margin: 0 0 8px;
  font-family: Georgia, serif;
  font-size: 23px;
  font-weight: 400;
}

.text-preview {
  color: var(--muted);
  font-size: 14px;
}

.text-content {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  word-break: break-word;
  font-size: 16px;
}

.text-header {
  margin-bottom: 28px;
}

.text-header h1 {
  margin: 0;
  font-family: Georgia, serif;
  font-size: 38px;
  font-weight: 400;
}

.like-comments {
  margin-top: 35px;
  padding-top: 25px;
  border-top: 1px solid var(--line);
}

.like-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 30px;
}

.comments {
  display: grid;
  gap: 12px;
}

.comment {
  padding: 16px;
  border: 1px solid var(--line);
  background: var(--paper);
}

.comment-head {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 7px;
}

.comment-author {
  font-weight: bold;
}

.comment-date {
  color: var(--muted);
  font-size: 12px;
}

.comment-body {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.comment-form {
  margin-top: 25px;
}

.image-gallery {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 30px;
}

.image-gallery img {
  width: 100%;
  display: block;
  max-height: 500px;
  object-fit: contain;
  background: #eee9e1;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.dashboard-card {
  display: block;
  min-height: 165px;
  padding: 25px;
  background: var(--paper);
  border: 1px solid var(--line);
  color: var(--text);
  text-decoration: none;
}

.dashboard-card:hover {
  border-color: var(--accent);
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

.admin-list {
  display: grid;
  gap: 0;
}

.admin-item {
  padding: 22px 0;
  border-top: 1px solid var(--line);
}

.admin-item:first-child {
  border-top: 0;
}

.admin-item-title {
  font-family: Georgia, serif;
  font-size: 20px;
}

.admin-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}

.admin-actions form {
  display: inline-flex;
  gap: 8px;
  flex-wrap: wrap;
}

.login {
  max-width: 420px;
  margin: 90px auto;
}

.form-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.back {
  display: inline-block;
  margin-bottom: 25px;
  color: var(--muted);
  text-decoration: none;
}

.back:hover {
  color: var(--text);
}

.notification {
  display: inline-flex;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  align-items: center;
  justify-content: center;
  border-radius: 99px;
  background: var(--accent);
  color: #fff;
  font-size: 11px;
}

.password-box {
  padding: 16px;
  background: #eee9e1;
  border: 1px solid var(--line);
  margin-bottom: 25px;
}

.empty {
  padding: 30px 0;
  color: var(--muted);
}

@media (max-width: 700px) {

  main {
    width: min(100% - 28px, 1000px);
    padding-top: 30px;
  }

  .logo {
    font-size: 36px;
  }

  .topbar {
    flex-direction: column;
  }

  .card {
    padding: 20px;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .search-row {
    grid-template-columns: 1fr;
  }

  .image-gallery {
    grid-template-columns: 1fr;
  }

  .text-header h1 {
    font-size: 31px;
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


// ─────────────────────────────────────
// Session
// ─────────────────────────────────────

function getSession(request) {
  const cookie = request.headers.get("Cookie") || "";

  const match = cookie.match(
    /(?:^|;\\s*)nib_session=([^;]+)/
  );

  return match ? match[1] : null;
}

async function isAdmin(request, env) {
  const session = getSession(request);

  if (!session) {
    return false;
  }

  return (await env.SESSIONS.get(session)) === "admin";
}


// ─────────────────────────────────────
// Besucher-ID für Likes
// ─────────────────────────────────────

function getVisitorKey(request) {
  const cookie = request.headers.get("Cookie") || "";

  const match = cookie.match(
    /(?:^|;\\s*)nib_visitor=([^;]+)/
  );

  return match ? match[1] : null;
}

function visitorCookie(key) {
  return `nib_visitor=${key}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=31536000`;
}


// ─────────────────────────────────────
// Datenbank – Ordner
// ─────────────────────────────────────

async function getFolders(env) {
  const result = await env.DB.prepare(`
    SELECT
      id,
      name,
      is_private,
      created_at,
      updated_at
    FROM folders
    WHERE deleted_at IS NULL
    ORDER BY name COLLATE NOCASE
  `).all();

  return result.results || [];
}


// ─────────────────────────────────────
// Datenbank – Texte
// ─────────────────────────────────────

async function getTexts(env, options = {}) {

  let sql = `
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
    WHERE deleted_at IS NULL
  `;

  const values = [];

  if (options.publicOnly) {
    sql += `
      AND visibility IN ('public', 'semi_private')
    `;
  }

  if (options.search) {
    sql += `
      AND title LIKE ?
    `;

    values.push(`%${options.search}%`);
  }

  if (options.folder) {
    sql += `
      AND folder = ?
    `;

    values.push(options.folder);
  }

  sql += `
    ORDER BY updated_at DESC
  `;

  const result =
    await env.DB.prepare(sql)
      .bind(...values)
      .all();

  return result.results || [];
}

async function getText(env, id) {

  return await env.DB.prepare(`
    SELECT
      id,
      title,
      content,
      folder,
      visibility,
      password,
      created_at,
      updated_at
    FROM texts
    WHERE
      id = ?
      AND deleted_at IS NULL
  `)
  .bind(id)
  .first();
}


// ─────────────────────────────────────
// Datenbank – Kommentare
// ─────────────────────────────────────

async function getComments(env, textId) {

  const result =
    await env.DB.prepare(`
      SELECT
        id,
        text_id,
        comment,
        author_name,
        created_at
      FROM comments
      WHERE text_id = ?
      ORDER BY created_at ASC, id ASC
    `)
    .bind(textId)
    .all();

  return result.results || [];
}

async function getAllComments(env) {

  const result =
    await env.DB.prepare(`
      SELECT
        comments.id,
        comments.text_id,
        comments.comment,
        comments.author_name,
        comments.created_at,
        texts.title
      FROM comments
      LEFT JOIN texts
        ON texts.id = comments.text_id
      ORDER BY comments.created_at DESC
    `)
    .all();

  return result.results || [];
}


// ─────────────────────────────────────
// Datenbank – Bilder
// ─────────────────────────────────────

async function getImages(env, textId) {

  const result =
    await env.DB.prepare(`
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

  return result.results || [];
}


// ─────────────────────────────────────
// Datenbank – Likes
// ─────────────────────────────────────

async function getLikeCount(env, textId) {

  const result =
    await env.DB.prepare(`
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
    await env.DB.prepare(`
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


// ─────────────────────────────────────
// Datenbank – Benachrichtigungen
// ─────────────────────────────────────

async function getUnreadCommentCount(env) {

  try {

    const result =
      await env.DB.prepare(`
        SELECT value
        FROM settings
        WHERE key = 'unread_comment_count'
      `)
      .first();

    return Number(result?.value || 0);

  } catch {

    return 0;
  }
}

async function increaseUnreadComments(env) {

  await env.DB.prepare(`
    INSERT INTO settings (key, value)
    VALUES ('unread_comment_count', '1')
    ON CONFLICT(key)
    DO UPDATE SET value =
      CAST(CAST(settings.value AS INTEGER) + 1 AS TEXT)
  `)
  .run();
}

async function clearUnreadComments(env) {

  await env.DB.prepare(`
    INSERT INTO settings (key, value)
    VALUES ('unread_comment_count', '0')
    ON CONFLICT(key)
    DO UPDATE SET value = '0'
  `)
  .run();
}


// ─────────────────────────────────────
// Cloudinary – Signatur
// ─────────────────────────────────────

async function sha1(value) {

  const data =
    new TextEncoder().encode(value);

  const hash =
    await crypto.subtle.digest(
      "SHA-1",
      data
    );

  return Array
    .from(new Uint8Array(hash))
    .map(
      byte =>
        byte
          .toString(16)
          .padStart(2, "0")
    )
    .join("");
}

async function cloudinaryUpload(file, env) {

  if (!file || file.size === 0) {
    throw new Error("Keine Datei.");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Nur Bilder sind erlaubt.");
  }

  const timestamp =
    Math.floor(Date.now() / 1000);

  const signatureBase =
    `timestamp=${timestamp}${env.CLOUDINARY_API_SECRET}`;

  const signature =
    await sha1(signatureBase);

  const body =
    new FormData();

  body.append("file", file);
  body.append("api_key", env.CLOUDINARY_API_KEY);
  body.append("timestamp", String(timestamp));
  body.append("signature", signature);

  const response =
    await fetch(
      `https://api.cloudinary.com/v1_1/${encodeURIComponent(
        env.CLOUDINARY_CLOUD_NAME
      )}/image/upload`,
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

  return await response.json();
}


// ─────────────────────────────────────
// Öffentliche Startseite
// ─────────────────────────────────────

async function publicHomePage(
  env,
  request,
  message = ""
) {

  const url =
    new URL(request.url);

  const search =
    url.searchParams.get("q") || "";

  const folder =
    url.searchParams.get("folder") || "";

  const folders =
    await getFolders(env);

  const texts =
    await getTexts(
      env,
      {
        publicOnly: true,
        search,
        folder
      }
    );

  return page(`

    <header class="topbar">

      <div>
        <p class="subtitle">
          Öffentliches Archiv
        </p>

        <h1 class="logo">
          NiB
        </h1>
      </div>

      <div class="topbar-right">

        <a
          class="button secondary"
          href="/admin"
        >
          Admin
        </a>

      </div>

    </header>

    ${
      message
        ? `<p class="message">${esc(message)}</p>`
        : ""
    }

    <section>

      <h2 class="section-title">
        Archiv
      </h2>

      <div class="card">

        <form
          method="GET"
          class="search-row"
        >

          <input
            type="search"
            name="q"
            value="${esc(search)}"
            placeholder="Nach Überschrift suchen..."
          >

          <select name="folder">

            <option value="">
              Alle Ordner
            </option>

            ${folders
              .filter(folder => !folder.is_private)
              .map(folder => `
                <option
                  value="${esc(folder.name)}"
                  ${
                    folder.name === folder
                      ? "selected"
                      : ""
                  }
                >
                  ${esc(folder.name)}
                </option>
              `)
              .join("")}

          </select>

          <button type="submit">
            Suchen
          </button>

        </form>

      </div>

    </section>


    <section>

      ${
        texts.length
          ? `

            <div class="text-list">

              ${texts.map(text => `

                <a
                  class="text-card"
                  href="/text/${encodeURIComponent(text.id)}"
                >

                  <h2 class="text-title">
                    ${esc(text.title)}
                  </h2>

                  <div class="text-preview">
                    ${esc(
                      String(text.content)
                        .replace(/\s+/g, " ")
                        .slice(0, 180)
                    )}${
                      String(text.content).length > 180
                        ? "…"
                        : ""
                    }
                  </div>

                  <div class="meta-row">

                    <span class="meta">
                      Ordner:
                      ${esc(text.folder)}
                    </span>

                    <span class="meta">
                      Erstellt:
                      ${esc(formatDate(text.created_at))}
                    </span>

                    <span class="meta">
                      Zuletzt bearbeitet:
                      ${esc(formatDate(text.updated_at))}
                    </span>

                  </div>

                </a>

              `).join("")}

            </div>

          `
          : `
            <div class="card empty">
              Keine öffentlichen Texte gefunden.
            </div>
          `
      }

    </section>

  `, "Archiv");
}


// ─────────────────────────────────────
// Einzelner öffentlicher Text
// ─────────────────────────────────────

async function publicTextPage(
  env,
  request,
  text,
  message = ""
) {

  if (!text) {
    return page(`
      <a class="back" href="/">
        ← Zurück zum Archiv
      </a>

      <div class="card">
        Text nicht gefunden.
      </div>
    `, "Nicht gefunden");
  }

  const visitorKey =
    getVisitorKey(request);

  const comments =
    await getComments(env, text.id);

  const images =
    await getImages(env, text.id);

  const likeCount =
    await getLikeCount(env, text.id);

  const liked =
    await hasLiked(
      env,
      text.id,
      visitorKey
    );

  return page(`

    <a
      class="back"
      href="/"
    >
      ← Zurück zum Archiv
    </a>

    ${
      message
        ? `<p class="message">${esc(message)}</p>`
        : ""
    }

    <section>

      <div class="text-header">

        <div class="meta">
          ${esc(text.folder)}
          ·
          ${esc(visibilityName(text.visibility))}
        </div>

        <h1>
          ${esc(text.title)}
        </h1>

        <div class="meta-row">

          <span class="meta">
            Erstellt:
            ${esc(formatDate(text.created_at))}
          </span>

          <span class="meta">
            Zuletzt bearbeitet:
            ${esc(formatDate(text.updated_at))}
          </span>

        </div>

      </div>


      <div class="card">

        ${
          images.length
            ? `
              <div class="image-gallery">

                ${images.map(image => `

                  <img
                    src="${esc(image.r2_key)}"
                    alt="${esc(image.filename || "Bild")}"
                    loading="lazy"
                  >

                `).join("")}

              </div>
            `
            : ""
        }


        <div class="text-content">
          ${esc(text.content)}
        </div>


        <div class="like-comments">

          <div class="like-row">

            <form method="POST">

              <input
                type="hidden"
                name="action"
                value="like"
              >

              <input
                type="hidden"
                name="text_id"
                value="${esc(text.id)}"
              >

              <button
                class="like-button ${
                  liked ? "liked" : ""
                }"
                type="submit"
              >
                ${liked ? "♥" : "♡"}
                ${likeCount}
              </button>

            </form>

            <span class="muted">
              ${comments.length}
              ${
                comments.length === 1
                  ? "Kommentar"
                  : "Kommentare"
              }
            </span>

          </div>


          <h2 class="section-title">
            Kommentare
          </h2>


          <div class="comments">

            ${
              comments.length
                ? comments.map(comment => `

                    <div class="comment">

                      <div class="comment-head">

                        <span class="comment-author">
                          ${esc(
                            comment.author_name?.trim()
                              ? comment.author_name
                              : "Anonym"
                          )}
                        </span>

                        <span class="comment-date">
                          ${esc(
                            formatDate(comment.created_at)
                          )}
                        </span>

                      </div>

                      <div class="comment-body">
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

          </div>


          <form
            method="POST"
            class="comment-form"
          >

            <input
              type="hidden"
              name="action"
              value="comment"
            >

            <input
              type="hidden"
              name="text_id"
              value="${esc(text.id)}"
            >

            <label>
              Name (optional)

              <input
                type="text"
                name="author_name"
                maxlength="100"
                placeholder="Dein Name"
              >
            </label>

            <label>
              Kommentar

              <textarea
                name="comment"
                minlength="1"
                required
                placeholder="Kommentar schreiben..."
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


// ─────────────────────────────────────
// Admin – Login
// ─────────────────────────────────────

function adminLoginPage(message = "") {

  return page(`

    <div class="login">

      <a
        class="back"
        href="/"
      >
        ← Öffentliche Website
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

  `, "Admin-Anmeldung");
}


// ─────────────────────────────────────
// Admin – Dashboard
// ─────────────────────────────────────

async function adminDashboardPage(
  env,
  message = ""
) {

  const unread =
    await getUnreadCommentCount(env);

  return page(`

    <header class="topbar">

      <div>
        <p class="subtitle">
          Admin-Bereich
        </p>

        <h1 class="logo">
          NiB
        </h1>
      </div>

      <div class="topbar-right">

        <a
          class="button secondary"
          href="/"
          target="_blank"
        >
          Website
        </a>

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

      </div>

    </header>


    ${
      message
        ? `<p class="message">${esc(message)}</p>`
        : ""
    }


    <section>

      <div class="dashboard-grid">

        <a
          class="dashboard-card"
          href="/admin/texts"
        >
          <span class="card-number">01</span>

          <h2>Texte</h2>

          <p>
            Texte ansehen, öffnen,
            bearbeiten und löschen.
          </p>
        </a>


        <a
          class="dashboard-card featured"
          href="/admin/text/new"
        >
          <span class="card-number">02</span>

          <h2>Neuer Text</h2>

          <p>
            Einen neuen Text erstellen.
          </p>
        </a>


        <a
          class="dashboard-card"
          href="/admin/folders"
        >
          <span class="card-number">03</span>

          <h2>Ordner</h2>

          <p>
            Ordner erstellen und verwalten.
          </p>
        </a>


        <a
          class="dashboard-card"
          href="/admin/comments"
        >
          <span class="card-number">04</span>

          <h2>
            Kommentare
            ${
              unread > 0
                ? `<span class="notification">${unread}</span>`
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
          <span class="card-number">05</span>

          <h2>Papierkorb</h2>

          <p>
            Gelöschte Inhalte verwalten.
          </p>
        </a>


        <a
          class="dashboard-card"
          href="/admin/settings"
        >
          <span class="card-number">06</span>

          <h2>Passwörter & Einstellungen</h2>

          <p>
            Zugriffsschutz und NiB-Einstellungen.
          </p>
        </a>


        <a
          class="dashboard-card"
          href="/"
          target="_blank"
        >
          <span class="card-number">07</span>

          <h2>Website</h2>

          <p>
            Öffentliche Website öffnen.
          </p>
        </a>

      </div>

    </section>

  `, "Dashboard");
}


// ─────────────────────────────────────
// Admin – Texte
// ─────────────────────────────────────

async function adminTextsPage(
  env,
  message = ""
) {

  const texts =
    await getTexts(env);

  return page(`

    <a
      class="back"
      href="/admin"
    >
      ← Dashboard
    </a>

    <header>

      <p class="subtitle">
        Verwaltung
      </p>

      <h1 class="logo">
        Texte
      </h1>

    </header>

    ${
      message
        ? `<p class="message">${esc(message)}</p>`
        : ""
    }

    <section>

      <div class="card">

        ${
          texts.length
            ? `
              <div class="admin-list">

                ${texts.map(text => `

                  <div class="admin-item">

                    <div class="admin-item-title">
                      ${esc(text.title)}
                    </div>

                    <div class="meta-row">

                      <span class="meta">
                        Ordner:
                        ${esc(text.folder)}
                      </span>

                      <span class="meta">
                        ${esc(
                          visibilityName(text.visibility)
                        )}
                      </span>

                      <span class="meta">
                        Erstellt:
                        ${esc(
                          formatDate(text.created_at)
                        )}
                      </span>

                      <span class="meta">
                        Bearbeitet:
                        ${esc(
                          formatDate(text.updated_at)
                        )}
                      </span>

                    </div>

                    <div class="admin-actions">

                      <a
                        class="button secondary"
                        href="/admin/text/${encodeURIComponent(text.id)}"
                      >
                        Öffnen / Bearbeiten
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
                          class="danger"
                          type="submit"
                        >
                          In Papierkorb
                        </button>

                      </form>

                    </div>

                  </div>

                `).join("")}

              </div>
            `
            : `
              <p class="empty">
                Noch keine Texte vorhanden.
              </p>
            `
        }

      </div>

    </section>

  `, "Texte");
}


// ─────────────────────────────────────
// Admin – Neuer Text
// ─────────────────────────────────────

async function adminNewTextPage(
  env,
  message = ""
) {

  const folders =
    await getFolders(env);

  return page(`

    <a
      class="back"
      href="/admin"
    >
      ← Dashboard
    </a>

    <header>

      <p class="subtitle">
        Verwaltung
      </p>

      <h1 class="logo">
        Neuer Text
      </h1>

    </header>

    ${
      message
        ? `<p class="message">${esc(message)}</p>`
        : ""
    }

    <section>

      <div class="card">

        <form
          method="POST"
          enctype="multipart/form-data"
        >

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
              required
              maxlength="500"
              placeholder="Titel"
            >
          </label>


          <label>
            Ordner

            <select name="folder">

              <option value="">
                Ohne Ordner
              </option>

              ${folders.map(folder => `
                <option value="${esc(folder.name)}">
                  ${esc(folder.name)}
                </option>
              `).join("")}

            </select>

          </label>


          <label>
            Sichtbarkeit

            <select
              name="visibility"
              id="visibility"
            >

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
            Eigenes Passwort für halbprivaten Text
            (optional)

            <input
              type="password"
              name="custom_password"
              autocomplete="new-password"
              placeholder="Leer lassen = allgemeines halbprivates Passwort"
            >
          </label>


          <label>
            Inhalt

            <textarea
              name="content"
              placeholder="Deinen Text schreiben..."
              required
            ></textarea>
          </label>


          <label>
            Bilder

            <input
              type="file"
              name="images"
              accept="image/*"
              multiple
            >
          </label>


          <div class="form-actions">

            <button type="submit">
              Text speichern
            </button>

            <a
              class="button secondary"
              href="/admin"
            >
              Abbrechen
            </a>

          </div>

        </form>

      </div>

    </section>

  `, "Neuer Text");
}


// ─────────────────────────────────────
// Admin – Text bearbeiten
// ─────────────────────────────────────

async function adminEditTextPage(
  env,
  textId,
  message = ""
) {

  const text =
    await getText(env, textId);

  if (!text) {

    return page(`

      <a
        class="back"
        href="/admin/texts"
      >
        ← Texte
      </a>

      <div class="card">
        Text nicht gefunden.
      </div>

    `, "Nicht gefunden");
  }

  const folders =
    await getFolders(env);

  const images =
    await getImages(env, text.id);

  const comments =
    await getComments(env, text.id);

  const likes =
    await getLikeCount(env, text.id);

  return page(`

    <a
      class="back"
      href="/admin/texts"
    >
      ← Texte
    </a>

    <header>

      <p class="subtitle">
        Text bearbeiten
      </p>

      <h1 class="logo">
        ${esc(text.title)}
      </h1>

    </header>

    ${
      message
        ? `<p class="message">${esc(message)}</p>`
        : ""
    }


    <section>

      <div class="card">

        <form
          method="POST"
          enctype="multipart/form-data"
        >

          <input
            type="hidden"
            name="action"
            value="update_text"
          >

          <input
            type="hidden"
            name="id"
            value="${esc(text.id)}"
          >


          <label>
            Titel

            <input
              type="text"
              name="title"
              maxlength="500"
              value="${esc(text.title)}"
              required
            >
          </label>


          <label>
            Ordner

            <select name="folder">

              <option value="">
                Ohne Ordner
              </option>

              ${folders.map(folder => `
                <option
                  value="${esc(folder.name)}"
                  ${
                    folder.name === text.folder
                      ? "selected"
                      : ""
                  }
                >
                  ${esc(folder.name)}
                </option>
              `).join("")}

            </select>

          </label>


          <label>
            Sichtbarkeit

            <select name="visibility">

              <option
                value="public"
                ${
                  text.visibility === "public"
                    ? "selected"
                    : ""
                }
              >
                Öffentlich
              </option>

              <option
                value="semi_private"
                ${
                  text.visibility === "semi_private"
                    ? "selected"
                    : ""
                }
              >
                Halbprivat
              </option>

              <option
                value="private"
                ${
                  text.visibility === "private"
                    ? "selected"
                    : ""
                }
              >
                Privat
              </option>

            </select>

          </label>


          <div class="password-box">

            <strong>
              Passwort dieses Textes
            </strong>

            <p class="muted">

              ${
                text.visibility === "semi_private"
                  ? text.password
                    ? "Für diesen Text wurde ein eigenes Passwort gesetzt."
                    : "Dieser Text verwendet das allgemeine halbprivate Passwort."
                  : "Für diese Sichtbarkeit wird kein Besucherpasswort benötigt."
              }

            </p>

            ${
              text.password
                ? `
                  <p>
                    Eigenes Passwort ist gesetzt.
                  </p>
                `
                : `
                  <p>
                    Allgemeines halbprivates Passwort
                    wird verwendet.
                  </p>
                `
            }

            <label>
              Neues eigenes Passwort
              (leer lassen = bisherige Einstellung)

              <input
                type="password"
                name="custom_password"
                autocomplete="new-password"
              >
            </label>

            <label>
              <input
                type="checkbox"
                name="remove_password"
                value="1"
                style="width:auto;margin-right:8px;"
              >

              Eigenes Passwort entfernen und
              allgemeines Passwort verwenden
            </label>

          </div>


          <label>
            Inhalt

            <textarea
              name="content"
              required
            >${esc(text.content)}</textarea>
          </label>


          <label>
            Weitere Bilder hochladen

            <input
              type="file"
              name="images"
              accept="image/*"
              multiple
            >
          </label>


          <div class="form-actions">

            <button type="submit">
              Änderungen speichern
            </button>

            <a
              class="button secondary"
              href="/text/${encodeURIComponent(text.id)}"
              target="_blank"
            >
              Text ansehen
            </a>

          </div>

        </form>

      </div>

    </section>


    ${
      images.length
        ? `
          <section>

            <h2 class="section-title">
              Bilder
            </h2>

            <div class="card">

              <div class="image-gallery">

                ${images.map(image => `

                  <div>

                    <img
                      src="${esc(image.r2_key)}"
                      alt="${esc(image.filename || "Bild")}"
                    >

                    <form
                      method="POST"
                      style="margin-top:8px;"
                    >

                      <input
                        type="hidden"
                        name="action"
                        value="delete_image"
                      >

                      <input
                        type="hidden"
                        name="id"
                        value="${esc(image.id)}"
                      >

                      <button
                        type="submit"
                        class="danger"
                      >
                        Bild löschen
                      </button>

                    </form>

                  </div>

                `).join("")}

              </div>

            </div>

          </section>
        `
        : ""
    }


    <section>

      <h2 class="section-title">
        Statistik
      </h2>

      <div class="card">

        <div class="meta-row">

          <span class="meta">
            Likes: ${likes}
          </span>

          <span class="meta">
            Kommentare: ${comments.length}
          </span>

          <span class="meta">
            Erstellt:
            ${esc(formatDate(text.created_at))}
          </span>

          <span class="meta">
            Zuletzt bearbeitet:
            ${esc(formatDate(text.updated_at))}
          </span>

        </div>

      </div>

    </section>

  `, text.title);
}


// ─────────────────────────────────────
// Admin – Ordner
// ─────────────────────────────────────

async function adminFoldersPage(
  env,
  message = ""
) {

  const folders =
    await getFolders(env);

  return page(`

    <a
      class="back"
      href="/admin"
    >
      ← Dashboard
    </a>

    <header>

      <p class="subtitle">
        Verwaltung
      </p>

      <h1 class="logo">
        Ordner
      </h1>

    </header>

    ${
      message
        ? `<p class="message">${esc(message)}</p>`
        : ""
    }

    <section>

      <div class="card">

        <form
          method="POST"
          class="form-actions"
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

      </div>

    </section>


    <section>

      <div class="card">

        ${
          folders.length
            ? `
              <div class="admin-list">

                ${folders.map(folder => `

                  <div class="admin-item">

                    <div class="admin-item-title">
                      ${esc(folder.name)}
                    </div>

                    <div class="meta">
                      ${
                        folder.is_private
                          ? "Privater Ordner"
                          : "Öffentlicher Ordner"
                      }
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
                          class="secondary"
                          type="submit"
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
                          class="secondary"
                          type="submit"
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
                          class="danger"
                          type="submit"
                        >
                          Löschen
                        </button>

                      </form>

                    </div>

                  </div>

                `).join("")}

              </div>
            `
            : `
              <p class="empty">
                Noch keine Ordner vorhanden.
              </p>
            `
        }

      </div>

    </section>

  `, "Ordner");
}


// ─────────────────────────────────────
// Admin – Kommentare
// ─────────────────────────────────────

async function adminCommentsPage(
  env,
  message = ""
) {

  const comments =
    await getAllComments(env);

  await clearUnreadComments(env);

  return page(`

    <a
      class="back"
      href="/admin"
    >
      ← Dashboard
    </a>

    <header>

      <p class="subtitle">
        Verwaltung
      </p>

      <h1 class="logo">
        Kommentare
      </h1>

    </header>

    ${
      message
        ? `<p class="message">${esc(message)}</p>`
        : ""
    }


    <section>

      <div class="card">

        ${
          comments.length
            ? `
              <div class="admin-list">

                ${comments.map(comment => `

                  <div class="admin-item">

                    <div class="admin-item-title">
                      ${esc(
                        comment.title ||
                        "Gelöschter Text"
                      )}
                    </div>

                    <div class="meta-row">

                      <span class="meta">
                        ${
                          comment.author_name?.trim()
                            ? comment.author_name
                            : "Anonym"
                        }
                      </span>

                      <span class="meta">
                        ${esc(
                          formatDate(
                            comment.created_at
                          )
                        )}
                      </span>

                    </div>

                    <p>
                      ${esc(comment.comment)}
                    </p>

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
                        class="danger"
                        type="submit"
                      >
                        Kommentar löschen
                      </button>

                    </form>

                  </div>

                `).join("")}

              </div>
            `
            : `
              <p class="empty">
                Keine Kommentare vorhanden.
              </p>
            `
        }

      </div>

    </section>

  `, "Kommentare");
}


// ─────────────────────────────────────
// Admin – Papierkorb
// ─────────────────────────────────────

async function adminTrashPage(
  env,
  message = ""
) {

  const result =
    await env.DB.prepare(`
      SELECT
        id,
        title,
        folder,
        visibility,
        created_at,
        updated_at,
        deleted_at
      FROM texts
      WHERE deleted_at IS NOT NULL
      ORDER BY deleted_at DESC
    `)
    .all();

  const texts =
    result.results || [];

  return page(`

    <a
      class="back"
      href="/admin"
    >
      ← Dashboard
    </a>

    <header>

      <p class="subtitle">
        Verwaltung
      </p>

      <h1 class="logo">
        Papierkorb
      </h1>

    </header>

    ${
      message
        ? `<p class="message">${esc(message)}</p>`
        : ""
    }

    <section>

      <div class="card">

        ${
          texts.length
            ? `
              <div class="admin-list">

                ${texts.map(text => `

                  <div class="admin-item">

                    <div class="admin-item-title">
                      ${esc(text.title)}
                    </div>

                    <div class="meta-row">

                      <span class="meta">
                        ${esc(text.folder)}
                      </span>

                      <span class="meta">
                        Gelöscht:
                        ${esc(
                          formatDate(
                            text.deleted_at
                          )
                        )}
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
                          value="destroy_text"
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

                `).join("")}

              </div>
            `
            : `
              <p class="empty">
                Der Papierkorb ist leer.
              </p>
            `
        }

      </div>

    </section>

  `, "Papierkorb");
}


// ─────────────────────────────────────
// Admin – Passwörter & Einstellungen
// ─────────────────────────────────────

async function adminSettingsPage(
  env,
  message = ""
) {

  return page(`

    <a
      class="back"
      href="/admin"
    >
      ← Dashboard
    </a>

    <header>

      <p class="subtitle">
        Verwaltung
      </p>

      <h1 class="logo">
        Passwörter & Einstellungen
      </h1>

    </header>

    ${
      message
        ? `<p class="message">${esc(message)}</p>`
        : ""
    }


    <section>

      <h2 class="section-title">
        Zugriffsschutz
      </h2>

      <div class="card">

        <p>
          <strong>Admin-Passwort</strong>
        </p>

        <p class="muted">
          Das Admin-Passwort wird als Cloudflare
          Secret gespeichert und nicht in der
          Datenbank abgelegt.
        </p>


        <p>
          <strong>
            Allgemeines halbprivates Passwort
          </strong>
        </p>

        <p class="muted">
          Dieses Passwort wird ebenfalls als
          Cloudflare Secret gespeichert und gilt
          automatisch für neue halbprivate Texte,
          sofern kein eigenes Passwort gesetzt wird.
        </p>

        <div class="password-box">

          <strong>
            Passwortstatus
          </strong>

          <p class="muted">
            Admin-Passwort:
            konfiguriert
          </p>

          <p class="muted">
            Halbprivates Passwort:
            ${
              env.SEMI_PRIVATE_PASSWORD
                ? "konfiguriert"
                : "nicht konfiguriert"
            }
          </p>

        </div>

      </div>

    </section>


    <section>

      <h2 class="section-title">
        Cloudinary
      </h2>

      <div class="card">

        <p class="muted">
          Cloudinary wird für Bilder verwendet.
        </p>

        <p>
          Cloud-Name:
          <strong>
            ${esc(env.CLOUDINARY_CLOUD_NAME || "nicht gesetzt")}
          </strong>
        </p>

        <p class="muted">
          API-Schlüssel und API-Secret bleiben
          ausschließlich als Cloudflare Secrets
          gespeichert.
        </p>

      </div>

    </section>


    <section>

      <h2 class="section-title">
        Kommentare
      </h2>

      <div class="card">

        <p class="muted">
          Kommentare können von Besuchern geschrieben
          werden. Gelöscht werden können sie nur im
          Adminbereich.
        </p>

      </div>

    </section>

  `, "Passwörter & Einstellungen");
}


// ─────────────────────────────────────
// Passwortprüfung
// ─────────────────────────────────────

function textPasswordIsCorrect(
  text,
  password,
  env
) {

  if (text.visibility === "public") {
    return true;
  }

  if (text.visibility === "private") {
    return false;
  }

  const expected =
    text.password ||
    env.SEMI_PRIVATE_PASSWORD;

  return Boolean(
    expected &&
    password === expected
  );
}


// ─────────────────────────────────────
// Worker
// ─────────────────────────────────────

export default {

  async fetch(request, env) {

    const url =
      new URL(request.url);

    const pathname =
      url.pathname;

    const admin =
      await isAdmin(request, env);


    // ─────────────────────────────────
    // Öffentliche Startseite
    // ─────────────────────────────────

    if (
      request.method === "GET" &&
      pathname === "/"
    ) {

      return htmlResponse(
        await publicHomePage(
          env,
          request
        )
      );
    }


    // ─────────────────────────────────
    // Admin Login
    // ─────────────────────────────────

    if (
      pathname === "/admin" &&
      request.method === "GET" &&
      !admin
    ) {

      return htmlResponse(
        adminLoginPage()
      );
    }


    // ─────────────────────────────────
    // Login verarbeiten
    // ─────────────────────────────────

    if (
      pathname === "/admin" &&
      request.method === "POST" &&
      !admin
    ) {

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
          password === env.ADMIN_PASSWORD
        ) {

          const session =
            crypto.randomUUID();

          await env.SESSIONS.put(
            session,
            "admin",
            {
              expirationTtl:
                60 * 60 * 24
            }
          );

          return new Response(null, {
            status: 302,
            headers: {
              Location: "/admin",
              "Set-Cookie":
                `nib_session=${session}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=86400`
            }
          });
        }

        return htmlResponse(
          adminLoginPage(
            "Falsches Passwort."
          ),
          401
        );
      }
    }


    // ─────────────────────────────────
    // Admin-Bereich schützen
    // ─────────────────────────────────

    if (
      pathname.startsWith("/admin") &&
      !admin
    ) {

      return new Response(null, {
        status: 302,
        headers: {
          Location: "/admin"
        }
      });
    }


    // ─────────────────────────────────
    // Admin POST-Aktionen
    // ─────────────────────────────────

    if (
      admin &&
      request.method === "POST"
    ) {

      const form =
        await request.formData();

      const action =
        String(
          form.get("action") || ""
        );


      // ───────────────────────────────
      // Logout
      // ───────────────────────────────

      if (action === "logout") {

        const session =
          getSession(request);

        if (session) {
          await env.SESSIONS.delete(session);
        }

        return new Response(null, {
          status: 302,
          headers: {
            Location: "/admin",
            "Set-Cookie":
              "nib_session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0"
          }
        });
      }


      // ───────────────────────────────
      // Text erstellen
      // ───────────────────────────────

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
          ).trim();

        const visibility =
          String(
            form.get("visibility") || "private"
          );

        const customPassword =
          String(
            form.get("custom_password") || ""
          );


        if (!title) {

          return htmlResponse(
            await adminNewTextPage(
              env,
              "Bitte einen Titel eingeben."
            )
          );
        }


        if (!content) {

          return htmlResponse(
            await adminNewTextPage(
              env,
              "Bitte einen Inhalt eingeben."
            )
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
            await adminNewTextPage(
              env,
              "Ungültige Sichtbarkeit."
            )
          );
        }


        const password =
          visibility === "semi_private" &&
          customPassword
            ? customPassword
            : null;


        const now =
          new Date().toISOString();


        const insert =
          await env.DB.prepare(`
            INSERT INTO texts
            (
              title,
              content,
              folder,
              visibility,
              password,
              updated_at,
              created_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `)
          .bind(
            title,
            content,
            folder || "Fragmente",
            visibility,
            password,
            now,
            now
          )
          .run();


        const textId =
          insert.meta.last_row_id;


        // Bilder zu Cloudinary hochladen

        const imageFiles =
          form.getAll("images");

        for (
          const file of imageFiles
        ) {

          if (
            !file ||
            typeof file !== "object" ||
            !file.size
          ) {
            continue;
          }

          try {

            const uploaded =
              await cloudinaryUpload(
                file,
                env
              );

            await env.DB.prepare(`
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
              crypto.randomUUID(),
              textId,
              uploaded.secure_url,
              file.name || null,
              now
            )
            .run();

          } catch (error) {

            return htmlResponse(
              await adminTextsPage(
                env,
                `Text gespeichert, aber ein Bild konnte nicht hochgeladen werden: ${error.message}`
              )
            );
          }
        }


        return new Response(null, {
          status: 302,
          headers: {
            Location:
              `/admin/text/${encodeURIComponent(textId)}`
          }
        });
      }


      // ───────────────────────────────
      // Text bearbeiten
      // ───────────────────────────────

      if (action === "update_text") {

        const id =
          String(
            form.get("id") || ""
          );

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
            form.get("visibility") || "private"
          );

        const customPassword =
          String(
            form.get("custom_password") || ""
          );

        const removePassword =
          form.get("remove_password") === "1";


        const oldText =
          await getText(env, id);


        if (!oldText) {

          return htmlResponse(
            await adminTextsPage(
              env,
              "Text nicht gefunden."
            )
          );
        }


        let password =
          oldText.password;


        if (
          visibility !== "semi_private"
        ) {

          password = null;

        } else if (removePassword) {

          password = null;

        } else if (customPassword) {

          password = customPassword;

        }


        const now =
          new Date().toISOString();


        await env.DB.prepare(`
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
          folder || "Fragmente",
          visibility,
          password,
          now,
          id
        )
        .run();


        const imageFiles =
          form.getAll("images");

        for (
          const file of imageFiles
        ) {

          if (
            !file ||
            typeof file !== "object" ||
            !file.size
          ) {
            continue;
          }

          try {

            const uploaded =
              await cloudinaryUpload(
                file,
                env
              );

            await env.DB.prepare(`
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
              crypto.randomUUID(),
              id,
              uploaded.secure_url,
              file.name || null,
              now
            )
            .run();

          } catch (error) {

            return htmlResponse(
              await adminEditTextPage(
                env,
                id,
                `Text gespeichert, aber ein Bild konnte nicht hochgeladen werden: ${error.message}`
              )
            );
          }
        }


        return new Response(null, {
          status: 302,
          headers: {
            Location:
              `/admin/text/${encodeURIComponent(id)}?saved=1`
          }
        });
      }


      // ───────────────────────────────
      // Bild löschen
      // ───────────────────────────────

      if (action === "delete_image") {

        const id =
          String(
            form.get("id") || ""
          );

        await env.DB.prepare(`
          DELETE FROM text_images
          WHERE id = ?
        `)
        .bind(id)
        .run();

        return new Response(null, {
          status: 302,
          headers: {
            Location:
              request.headers.get("Referer") ||
              "/admin/texts"
          }
        });
      }


      // ───────────────────────────────
      // Text löschen
      // ───────────────────────────────

      if (action === "delete_text") {

        const id =
          String(
            form.get("id") || ""
          );

        const now =
          new Date().toISOString();

        await env.DB.prepare(`
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

        return new Response(null, {
          status: 302,
          headers: {
            Location: "/admin/texts"
          }
        });
      }


      // ───────────────────────────────
      // Text wiederherstellen
      // ───────────────────────────────

      if (action === "restore_text") {

        const id =
          String(
            form.get("id") || ""
          );

        await env.DB.prepare(`
          UPDATE texts
          SET deleted_at = NULL
          WHERE id = ?
        `)
        .bind(id)
        .run();

        return new Response(null, {
          status: 302,
          headers: {
            Location: "/admin/trash"
          }
        });
      }


      // ───────────────────────────────
      // Text endgültig löschen
      // ───────────────────────────────

      if (action === "destroy_text") {

        const id =
          String(
            form.get("id") || ""
          );

        await env.DB.prepare(`
          DELETE FROM texts
          WHERE id = ?
        `)
        .bind(id)
        .run();

        return new Response(null, {
          status: 302,
          headers: {
            Location: "/admin/trash"
          }
        });
      }


      // ───────────────────────────────
      // Ordner erstellen
      // ───────────────────────────────

      if (action === "create_folder") {

        const name =
          String(
            form.get("name") || ""
          ).trim();

        if (name) {

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
            crypto.randomUUID(),
            name,
            now,
            now
          )
          .run();
        }

        return new Response(null, {
          status: 302,
          headers: {
            Location: "/admin/folders"
          }
        });
      }


      // ───────────────────────────────
      // Ordner umbenennen
      // ───────────────────────────────

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

        return new Response(null, {
          status: 302,
          headers: {
            Location: "/admin/folders"
          }
        });
      }


      // ───────────────────────────────
      // Ordner Sichtbarkeit
      // ───────────────────────────────

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

        return new Response(null, {
          status: 302,
          headers: {
            Location: "/admin/folders"
          }
        });
      }


      // ───────────────────────────────
      // Ordner löschen
      // ───────────────────────────────

      if (action === "delete_folder") {

        const id =
          String(
            form.get("id") || ""
          );

        const now =
          new Date().toISOString();

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
          now,
          now,
          id
        )
        .run();

        return new Response(null, {
          status: 302,
          headers: {
            Location: "/admin/folders"
          }
        });
      }


      // ───────────────────────────────
      // Kommentar löschen
      // ───────────────────────────────

      if (action === "delete_comment") {

        const id =
          String(
            form.get("id") || ""
          );

        await env.DB.prepare(`
          DELETE FROM comments
          WHERE id = ?
        `)
        .bind(id)
        .run();

        return new Response(null, {
          status: 302,
          headers: {
            Location: "/admin/comments"
          }
        });
      }
    }


    // ─────────────────────────────────
    // Admin Unterseiten
    // ─────────────────────────────────

    if (
      admin &&
      pathname === "/admin"
    ) {

      return htmlResponse(
        await adminDashboardPage(env)
      );
    }

    if (
      admin &&
      pathname === "/admin/texts"
    ) {

      return htmlResponse(
        await adminTextsPage(env)
      );
    }

    if (
      admin &&
      pathname === "/admin/text/new"
    ) {

      return htmlResponse(
        await adminNewTextPage(env)
      );
    }

    if (
      admin &&
      pathname === "/admin/folders"
    ) {

      return htmlResponse(
        await adminFoldersPage(env)
      );
    }

    if (
      admin &&
      pathname === "/admin/comments"
    ) {

      return htmlResponse(
        await adminCommentsPage(env)
      );
    }

    if (
      admin &&
      pathname === "/admin/trash"
    ) {

      return htmlResponse(
        await adminTrashPage(env)
      );
    }

    if (
      admin &&
      pathname === "/admin/settings"
    ) {

      return htmlResponse(
        await adminSettingsPage(env)
      );
    }


    // ─────────────────────────────────
    // Admin einzelner Text
    // ─────────────────────────────────

    const adminTextMatch =
      pathname.match(
        /^\/admin\/text\/([^/]+)$/
      );

    if (
      admin &&
      adminTextMatch
    ) {

      const id =
        decodeURIComponent(
          adminTextMatch[1]
        );

      const text =
        await getText(env, id);

      if (!text) {

        return htmlResponse(
          await adminTextsPage(
            env,
            "Text nicht gefunden."
          ),
          404
        );
      }

      const saved =
        url.searchParams.get("saved") === "1";

      return htmlResponse(
        await adminEditTextPage(
          env,
          id,
          saved
            ? "Änderungen gespeichert."
            : ""
        )
      );
    }


    // ─────────────────────────────────
    // Öffentlicher Text
    // ─────────────────────────────────

    const publicTextMatch =
      pathname.match(
        /^\/text\/([^/]+)$/
      );

    if (
      request.method === "GET" &&
      publicTextMatch
    ) {

      const id =
        decodeURIComponent(
          publicTextMatch[1]
        );

      const text =
        await getText(env, id);

      if (!text) {

        return htmlResponse(
          await publicTextPage(
            env,
            request,
            null
          ),
          404
        );
      }


      // Private Texte niemals öffentlich zeigen

      if (
        text.visibility === "private"
      ) {

        return htmlResponse(`
          ${page(`
            <a
              class="back"
              href="/"
            >
              ← Zurück zum Archiv
            </a>

            <div class="card">
              Dieser Text ist privat.
            </div>
          `, "Privater Text")}
        `, 403);
      }


      // Halbprivat

      if (
        text.visibility === "semi_private"
      ) {

        return htmlResponse(
          page(`

            <a
              class="back"
              href="/"
            >
              ← Zurück zum Archiv
            </a>

            <header>

              <p class="subtitle">
                Geschützter Text
              </p>

              <h1 class="logo">
                ${esc(text.title)}
              </h1>

            </header>

            <div class="card">

              <p>
                Dieser Text ist halbprivat.
                Bitte Passwort eingeben.
              </p>

              <form method="POST">

                <input
                  type="hidden"
                  name="action"
                  value="unlock_text"
                >

                <input
                  type="hidden"
                  name="text_id"
                  value="${esc(text.id)}"
                >

                <label>
                  Passwort

                  <input
                    type="password"
                    name="password"
                    required
                    autofocus
                  >
                </label>

                <button type="submit">
                  Öffnen
                </button>

              </form>

            </div>

          `, text.title)
        );
      }


      return htmlResponse(
        await publicTextPage(
          env,
          request,
          text
        )
      );
    }


    // ─────────────────────────────────
    // Öffentliche POST-Aktionen
    // ─────────────────────────────────

    if (
      request.method === "POST"
    ) {

      const form =
        await request.formData();

      const action =
        String(
          form.get("action") || ""
        );


      // ───────────────────────────────
      // Halbprivaten Text öffnen
      // ───────────────────────────────

      if (
        action === "unlock_text"
      ) {

        const id =
          String(
            form.get("text_id") || ""
          );

        const password =
          String(
            form.get("password") || ""
          );

        const text =
          await getText(env, id);


        if (!text) {

          return htmlResponse(
            await publicTextPage(
              env,
              request,
              null
            ),
            404
          );
        }


        if (
          text.visibility === "private"
        ) {

          return htmlResponse(
            await publicTextPage(
              env,
              request,
              null
            ),
            403
          );
        }


        if (
          text.visibility === "semi_private" &&
          !textPasswordIsCorrect(
            text,
            password,
            env
          )
        ) {

          return htmlResponse(
            page(`

              <a
                class="back"
                href="/"
              >
                ← Zurück zum Archiv
              </a>

              <div class="card">

                <p class="message error">
                  Falsches Passwort.
                </p>

                <form method="POST">

                  <input
                    type="hidden"
                    name="action"
                    value="unlock_text"
                  >

                  <input
                    type="hidden"
                    name="text_id"
                    value="${esc(text.id)}"
                  >

                  <label>
                    Passwort

                    <input
                      type="password"
                      name="password"
                      required
                      autofocus
                    >
                  </label>

                  <button type="submit">
                    Erneut versuchen
                  </button>

                </form>

              </div>

            `, text.title),
            401
          );
        }


        return htmlResponse(
          await publicTextPage(
            env,
            request,
            text
          )
        );
      }


      // ───────────────────────────────
      // Kommentar
      // ───────────────────────────────

      if (
        action === "comment"
      ) {

        const textId =
          String(
            form.get("text_id") || ""
          );

        const comment =
          String(
            form.get("comment") || ""
          ).trim();

        const author =
          String(
            form.get("author_name") || ""
          ).trim();


        const text =
          await getText(
            env,
            textId
          );


        if (
          !text ||
          text.visibility === "private"
        ) {

          return new Response(
            "Nicht verfügbar.",
            {
              status: 403
            }
          );
        }


        if (!comment) {

          return htmlResponse(
            await publicTextPage(
              env,
              request,
              text,
              "Bitte einen Kommentar eingeben."
            )
          );
        }


        const finalAuthor =
          author.slice(0, 100);


        await env.DB.prepare(`
          INSERT INTO comments
          (
            text_id,
            comment,
            author_name,
            created_at
          )
          VALUES (?, ?, ?, ?)
        `)
        .bind(
          textId,
          comment,
          finalAuthor || null,
          new Date().toISOString()
        )
        .run();


        await increaseUnreadComments(env);


        return new Response(null, {
          status: 302,
          headers: {
            Location:
              `/text/${encodeURIComponent(textId)}`
          }
        });
      }


      // ───────────────────────────────
      // Like
      // ───────────────────────────────

      if (
        action === "like"
      ) {

        const textId =
          String(
            form.get("text_id") || ""
          );

        const text =
          await getText(
            env,
            textId
          );


        if (
          !text ||
          text.visibility === "private"
        ) {

          return new Response(
            "Nicht verfügbar.",
            {
              status: 403
            }
          );
        }


        let visitorKey =
          getVisitorKey(request);

        if (!visitorKey) {
          visitorKey =
            crypto.randomUUID();
        }


        const alreadyLiked =
          await hasLiked(
            env,
            textId,
            visitorKey
          );


        if (!alreadyLiked) {

          await env.DB.prepare(`
            INSERT INTO text_likes
            (
              text_id,
              visitor_key,
              created_at
            )
            VALUES (?, ?, ?)
          `)
          .bind(
            textId,
            visitorKey,
            new Date().toISOString()
          )
          .run();

        } else {

          await env.DB.prepare(`
            DELETE FROM text_likes
            WHERE
              text_id = ?
              AND visitor_key = ?
          `)
          .bind(
            textId,
            visitorKey
          )
          .run();
        }


        return new Response(null, {
          status: 302,
          headers: {
            Location:
              `/text/${encodeURIComponent(textId)}`,
            "Set-Cookie":
              visitorCookie(visitorKey)
          }
        });
      }
    }


    // ─────────────────────────────────
    // 404
    // ─────────────────────────────────

    return htmlResponse(
      page(`

        <a
          class="back"
          href="/"
        >
          ← Zurück
        </a>

        <div class="card">

          <h1 class="section-title">
            Seite nicht gefunden
          </h1>

          <p class="muted">
            Diese Seite existiert nicht.
          </p>

        </div>

      `, "404"),
      404
    );
  }
};


// ─────────────────────────────────────
// Response-Helfer
// ─────────────────────────────────────

function htmlResponse(
  html,
  status = 200
) {

  return new Response(
    html,
    {
      status,
      headers: {
        "content-type":
          "text/html; charset=UTF-8",
        "cache-control":
          "no-store"
      }
    }
  );
}

