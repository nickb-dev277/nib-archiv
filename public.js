import { esc, formatDate, page } from "./helpers.js";

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


export {
  publicHomePage,
  publicPasswordPage,
  publicTextPage
};
