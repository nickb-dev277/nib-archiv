import { page } from "./html.js";
import { esc, formatDate, visibilityLabel } from "./helpers.js";

// ─────────────────────────────────────
// Admin-Login / Dashboard / Menüs
// ─────────────────────────────────────

export function loginPage(message = "") {

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

export function adminDashboardPage(
  message = "",
  commentCount = 0,
  notifications = []
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

    ${notifications.length ? `
      <section class="card" style="margin-bottom:25px;">
        <div class="dashboard-header" style="margin-bottom:15px;">
          <h2 class="section-title" style="margin:0;">Benachrichtigungen ${commentCount ? `<span class="notification">${commentCount} neu</span>` : ""}</h2>
          <a class="back-link" href="/admin/notifications">Alle anzeigen</a>
        </div>
        ${notifications.slice(0,5).map(n => `<div class="admin-list-item"><strong>${esc(n.message)}</strong><div class="meta">${esc(n.title || "")} · ${esc(formatDate(n.created_at))} · ${n.read_at ? "Gelesen" : "Ungelesen"}</div></div>`).join("")}
      </section>
    ` : ""}

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

export function adminHeader(title, commentCount = 0) {

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


export function adminTextsPage(
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


export function adminTextFormPage(
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
                Ordner auswählen
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
          Sprache
          <select name="language">
            <option value="de" ${text?.language !== "en" ? "selected" : ""}>Deutsch</option>
            <option value="en" ${text?.language === "en" ? "selected" : ""}>English</option>
          </select>
        </label>

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

                      <form method="POST" style="margin-top:8px;">
                        <input type="hidden" name="action" value="delete_image">
                        <input type="hidden" name="image_id" value="${esc(image.id)}">
                        <button type="submit" class="danger">Bild entfernen</button>
                      </form>

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


export function adminFoldersPage(
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


export function adminCommentsPage(
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


export function adminTrashPage(texts, folders, commentCount = 0, message = "") {
  return page(`
    ${adminHeader("Papierkorb", commentCount)}
    ${message ? `<p class="message success">${esc(message)}</p>` : ""}
    <section class="card">
      <h2 class="section-title">Texte</h2>
      ${texts.length ? texts.map(text => `<div class="admin-list-item"><div class="admin-list-title">${esc(text.title)}</div><div class="meta"><span>Typ: Text</span><span>Gelöscht: ${esc(formatDate(text.deleted_at))}</span><span>Ablauf: ${esc(formatDate(new Date(new Date(text.deleted_at).getTime()+30*24*60*60*1000).toISOString()))}</span></div><div class="admin-actions"><form method="POST"><input type="hidden" name="action" value="restore_text"><input type="hidden" name="id" value="${esc(text.id)}"><button class="secondary">Wiederherstellen</button></form><form method="POST"><input type="hidden" name="action" value="permanent_delete_text"><input type="hidden" name="id" value="${esc(text.id)}"><button class="danger">Endgültig löschen</button></form></div></div>`).join("") : `<div class="empty">Keine gelöschten Texte.</div>`}
    </section>
    <section class="card" style="margin-top:25px;">
      <h2 class="section-title">Ordner</h2>
      ${folders.length ? folders.map(folder => `<div class="admin-list-item"><div class="admin-list-title">${esc(folder.name)}</div><div class="meta"><span>Typ: Ordner</span><span>Gelöscht: ${esc(formatDate(folder.deleted_at))}</span><span>Ablauf: ${esc(formatDate(new Date(new Date(folder.deleted_at).getTime()+30*24*60*60*1000).toISOString()))}</span></div><div class="admin-actions"><form method="POST"><input type="hidden" name="action" value="restore_folder"><input type="hidden" name="id" value="${esc(folder.id)}"><button class="secondary">Wiederherstellen</button></form><form method="POST"><input type="hidden" name="action" value="permanent_delete_folder"><input type="hidden" name="id" value="${esc(folder.id)}"><button class="danger">Endgültig löschen</button></form></div></div>`).join("") : `<div class="empty">Keine gelöschten Ordner.</div>`}
    </section>
  `, "Papierkorb – NiB");
}

export function adminPasswordsPage(texts, commentCount = 0, message = "", cloudflareConfigured = false) {
  return page(`
    ${adminHeader("Passwörter", commentCount)}
    ${message ? `<p class="message success">${esc(message)}</p>` : ""}
    <section class="card">
      <h2 class="section-title">Admin-Passwort ändern</h2>
      <form method="POST">
        <input type="hidden" name="action" value="change_admin_password">
        <label>Neues Admin-Passwort<input type="password" name="new_password" autocomplete="new-password" required></label>
        <button type="submit">Admin-Passwort ändern</button>
      </form>
    </section>
    <section class="card" style="margin-top:20px;">
      <h2 class="section-title">Allgemeines Halbprivat-Passwort</h2>
      <p class="muted">Neue halbprivate Texte verwenden dieses Cloudflare-Secret automatisch, wenn kein eigenes Passwort gesetzt ist.</p>
      <form method="POST">
        <input type="hidden" name="action" value="change_semi_password">
        <label>Neues halbprivates Passwort<input type="password" name="new_password" autocomplete="new-password" required></label>
        <button type="submit">Halbprivates Passwort ändern</button>
      </form>
      ${!cloudflareConfigured ? `<p class="message danger">Für das Ändern der Cloudflare-Secrets müssen CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID und CLOUDFLARE_SCRIPT_NAME als Secrets hinterlegt sein.</p>` : `<p class="small muted">Die Änderung wird über die Cloudflare Workers Secrets API durchgeführt.</p>`}
    </section>
    <section>
      <h2 class="section-title">Passwörter der einzelnen Texte</h2>
      <div class="card">${texts.length ? texts.map(text => `<div class="admin-list-item"><div class="admin-list-title">${esc(text.title)}</div><div class="meta"><span>${esc(visibilityLabel(text.visibility))}</span></div><div class="password-box"><strong>Passwort:</strong><div class="password-value">${text.visibility === "semi_private" ? (text.password ? esc(text.password) : "Allgemeines Halbprivat-Passwort") : "Kein öffentliches Passwort erforderlich"}</div></div></div>`).join("") : `<div class="empty">Noch keine Texte vorhanden.</div>`}</div>
    </section>
  `, "Passwörter – NiB");
}

export function adminSettingsPage(commentCount = 0, message = "", settings = {}, folders = []) {
  return page(`
    ${adminHeader("Einstellungen", commentCount)}
    ${message ? `<p class="message success">${esc(message)}</p>` : ""}
    <section class="card">
      <form method="POST">
        <input type="hidden" name="action" value="save_settings">
        <label>Künstlername<input type="text" name="artist_name" value="${esc(settings.artist_name || "")}"></label>
        <label>Öffentliche Website-Überschrift<input type="text" name="public_title" value="${esc(settings.public_title || "NiB Archiv")}" required></label>
        <label>Fußzeile<textarea name="footer" style="min-height:140px;">${esc(settings.footer || "")}</textarea></label>
        <label>Website-Sprache<select name="site_language"><option value="de" ${settings.language !== "en" ? "selected" : ""}>Deutsch</option><option value="en" ${settings.language === "en" ? "selected" : ""}>English</option></select></label>
        <label>Standardordner<select name="default_folder"><option value="">Kein Standardordner</option>${folders.map(folder => `<option value="${esc(folder.id)}" ${String(settings.default_folder || "") === String(folder.id) ? "selected" : ""}>${esc(folder.name)}</option>`).join("")}</select></label>
        <button type="submit">Einstellungen speichern</button>
      </form>
    </section>
  `, "Einstellungen – NiB");
}

