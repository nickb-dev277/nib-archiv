import { page } from "./html.js";
import { esc, formatDate } from "./helpers.js";

// ─────────────────────────────────────
// Öffentliche Website
// ─────────────────────────────────────

export function publicHomePage(
  texts,
  folders,
  search = "",
  folderFilter = "",
  languageFilter = "",
  settings = {},
  language = "en"
) {
  const publicFolders = folders.filter(folder => !Number(folder.is_private));
  const normalizedSearch = search.trim().toLowerCase();
  const filteredTexts = texts.filter(text => {
    if (text.visibility !== "public" && text.visibility !== "semi_private") return false;
    const folder = publicFolders.find(item => String(item.id) === String(text.folder));
    if (text.folder && !folder) return false;
    if (folderFilter && String(text.folder) !== String(folderFilter)) return false;
    if (languageFilter && String(text.language || "de") !== String(languageFilter)) return false;
    if (normalizedSearch && !String(text.title || "").toLowerCase().includes(normalizedSearch)) return false;
    return true;
  });
    const ui = language === "en" ? {
    admin: "Admin", intro: "Texts, notes and fragments.", search: "Search in title...", allFolders: "All folders",
    allLanguages: "All languages", german: "German", english: "English", folder: "Folder", created: "Created",
    edited: "Last edited", privateHint: "For close friends only.", empty: "No matching texts found.", footer: settings.footer || ""
  } : {
    admin: "Admin", intro: "Texte, Notizen und Fragmente.", search: "Text in Überschrift suchen...", allFolders: "Alle Ordner",
    allLanguages: "Alle Sprachen", german: "Deutsch", english: "English", folder: "Ordner", created: "Erstellt",
    edited: "Zuletzt bearbeitet", privateHint: "Dieser Text ist nur für enge Freunde bestimmt.", empty: "Keine passenden Texte gefunden.", footer: settings.footer || ""
  };
  return page(`
  <header class="public-header">
  <div class="public-header-tools">
    <a class="admin-link" href="/admin">${esc(ui.admin)}</a>
    // ─────────────────────────────────────
// Öffentliche Textseite
// ─────────────────────────────────────
const publicTextMatch = path.match(/^\/text\/(\d+)$/);

if (publicTextMatch) {
  const id = publicTextMatch[1];

  // Wichtig: dieselbe Sprache verwenden wie auf der Startseite
  const publicLanguage = getPublicLanguage(request);

  const text = await getPublicTextById(env, id);

  if (!text) {
    return htmlResponse(
      page(
        `<a class="back-link" href="/">← ${publicLanguage === "en" ? "Back" : "Zurück"}</a>
         <h1 class="section-title">${publicLanguage === "en" ? "Text not found" : "Text nicht gefunden"}</h1>
         <p class="muted">${publicLanguage === "en"
           ? "This text does not exist or is not public."
           : "Dieser Text existiert nicht oder ist nicht öffentlich."}</p>`,
        publicLanguage === "en" ? "Not found" : "Nicht gefunden"
      ),
      404
    );
  }

  if (text.visibility === "semi_private") {
    const unlocked = cookieValue(
      request,
      `nib_unlock_${id}`
    ) === "1";

    if (!unlocked) {

      if (request.method === "POST") {
        const form = await request.formData();

        if (String(form.get("action") || "") === "unlock_text") {

          const password = String(
            form.get("password") || ""
          );

          const expected =
            text.password ||
            env.SEMI_PRIVATE_PASSWORD;

          if (password === expected) {

            const visitor = ensureVisitorKey(request);

            const response = htmlResponse(
              publicTextPage(
                text,
                (await getFolders(env)).find(
                  f => String(f.id) === String(text.folder)
                ),
                await getImages(env, id),
                await getComments(env, id),
                await getLikes(env, id),
                await hasLiked(env, id, visitor.key),
                visitor.key,
                settings,
                publicLanguage
              )
            );

            response.headers.append(
              "Set-Cookie",
              unlockedCookie(id)
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
              publicLanguage === "en"
                ? "Wrong password."
                : "Falsches Passwort.",
              settings,
              publicLanguage
            ),
            401
          );
        }
      }

      return htmlResponse(
        publicPasswordPage(
          text,
          "",
          settings,
          publicLanguage
        )
      );
    }
  }

  const visitor = ensureVisitorKey(request);
  const folders = await getFolders(env);

  const response = htmlResponse(
    publicTextPage(
      text,
      folders.find(
        f => String(f.id) === String(text.folder)
      ),
      await getImages(env, id),
      await getComments(env, id),
      await getLikes(env, id),
      await hasLiked(env, id, visitor.key),
      visitor.key,
      settings,
      publicLanguage
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
  </div>
      <p class="subtitle">${esc(settings.artist_name || "NiB Archiv")}</p>
      <h1 class="logo">${esc(settings.public_title || "NiB")}</h1>
      <div class="public-intro"><p class="muted">${esc(ui.intro)}</p></div>
    </header>
    <section class="section">
      <form class="public-tools" method="GET">
        <input type="text" name="q" value="${esc(search)}" placeholder="${esc(ui.search)}">
        <select name="folder" onchange="this.form.submit()">
          <option value="">${esc(ui.allFolders)}</option>
          ${publicFolders.map(folder => `<option value="${esc(folder.id)}" ${String(folderFilter) === String(folder.id) ? "selected" : ""}>${esc(folder.name)}</option>`).join("")}
        </select>
        <select name="language" onchange="this.form.submit()">
          <option value="">${esc(ui.allLanguages)}</option>
          <option value="de" ${languageFilter === "de" ? "selected" : ""}>${esc(ui.german)}</option>
          <option value="en" ${languageFilter === "en" ? "selected" : ""}>${esc(ui.english)}</option>
        </select>
        <button type="submit">Suchen</button>
      </form>
      <div class="card">
        ${filteredTexts.length ? `<div class="public-list">${filteredTexts.map(text => {
          const folder = publicFolders.find(item => String(item.id) === String(text.folder));
          return `<a class="public-item" href="/text/${encodeURIComponent(text.id)}">
            <h2>${esc(text.title)}</h2>
            <div class="public-item-meta">
              <span>${esc(ui.folder)}: ${esc(folder?.name || "")}</span>
              <span>${esc(ui.created)}: ${esc(formatDate(text.created_at))}</span>
              <span>${esc(ui.edited)}: ${esc(formatDate(text.updated_at))}</span>
              <span>${text.language === "en" ? "English" : "Deutsch"}</span>
              ${text.visibility === "semi_private" ? `<span class="visibility-semi">${esc(ui.privateHint)}</span>` : ""}
            </div>
          </a>`;
        }).join("")}</div>` : `<div class="empty">${esc(ui.empty)}</div>`}
      </div>
    </section>
    ${settings.footer ? `<footer class="muted small" style="margin-top:55px;white-space:pre-wrap;">${esc(settings.footer)}</footer>` : ""}
  `, settings.public_title || "NiB Archiv");
}

  export function publicPasswordPage(text, message = "", settings = {}, language = "en") {
  const english = language === "en";
  return page(`
    <a class="back-link" href="/">← ${english ? "Back" : "Zur Übersicht"}</a>
    <header class="text-header">
      <p class="subtitle">${english ? "Private text for close friends" : "Dieser Text ist nur für enge Freunde bestimmt."}</p>
      <h1 class="text-title">${esc(text.title)}</h1>
    </header>
    ${message ? `<p class="message">${esc(message)}</p>` : ""}
    <section class="card"><form method="POST">
      <input type="hidden" name="action" value="unlock_text">
      <input type="hidden" name="id" value="${esc(text.id)}">
      <label>${english ? "Password" : "Passwort"}<input type="password" name="password" autocomplete="off" required></label>
      <button type="submit">${english ? "Open text" : "Text öffnen"}</button>
    </form></section>
  `, text.title);
}

  export function publicTextPage(
    text,
    folder,
    images,
    comments,
    likes,
    liked,
    visitorKey,
    settings = {},
    language = "en"
) {
  const english = language === "en";
  return page(`
    <a class="back-link" href="/">← ${english ? "Back" : "Zur Übersicht"}</a>
    <header class="text-header">
      <p class="subtitle">${esc(folder?.name || "")}</p>
      <h1 class="text-title">${esc(text.title)}</h1>
      <div class="meta">
        <span>${english ? "Created" : "Erstellt"}: ${esc(formatDate(text.created_at))}</span>
        <span>${english ? "Last edited" : "Zuletzt bearbeitet"}: ${esc(formatDate(text.updated_at))}</span>
        <span>${text.language === "en" ? "English" : "Deutsch"}</span>
      </div>
    </header>
    <article class="card">
      <div class="text-content">${esc(text.content)}</div>
      ${images.length ? `<div class="image-gallery">${images.map(image => `<img src="${esc(image.url)}" alt="${esc(image.filename || text.title)}" loading="lazy">`).join("")}</div>` : ""}
      <div class="interaction-bar">
        <form method="POST"><input type="hidden" name="action" value="like"><input type="hidden" name="id" value="${esc(text.id)}"><button type="submit" class="like-button ${liked ? "liked" : ""}">${liked ? "♥" : "♡"} ${english ? "Like" : "Gefällt mir"}</button></form>
        <span class="interaction-count">${likes} ${likes === 1 ? "Like" : "Likes"}</span>
        <span class="interaction-count">${comments.length} ${comments.length === 1 ? (english ? "Comment" : "Kommentar") : (english ? "Comments" : "Kommentare")}</span>
      </div>
    </article>
    <section class="comments"><h2 class="section-title">${english ? "Comments" : "Kommentare"}</h2><div class="card">
      ${comments.length ? comments.map(comment => `<div class="comment"><div><span class="comment-author">${comment.author_name ? esc(comment.author_name) : "Anonym"}</span><span class="comment-date">${esc(formatDate(comment.created_at))}</span></div><div class="comment-text">${esc(comment.comment)}</div></div>`).join("") : `<p class="muted">${english ? "No comments yet." : "Noch keine Kommentare."}</p>`}
      <div class="comment-form"><h3>${english ? "Write a comment" : "Kommentar schreiben"}</h3><form method="POST">
        <input type="hidden" name="action" value="create_comment"><input type="hidden" name="id" value="${esc(text.id)}">
        <label>${english ? "Name" : "Name"} <span class="small">(${english ? "optional" : "optional"})</span><input type="text" name="author_name" maxlength="100" placeholder="Anonym"></label>
        <label>${english ? "Comment" : "Kommentar"}<textarea name="comment" placeholder="${english ? "Your comment..." : "Dein Kommentar..."}" required></textarea></label>
        <button type="submit">${english ? "Publish comment" : "Kommentar veröffentlichen"}</button>
      </form></div>
    </div></section>
    ${settings.footer ? `<footer class="muted small" style="margin-top:55px;white-space:pre-wrap;">${esc(settings.footer)}</footer>` : ""}
  `, text.title);
}
