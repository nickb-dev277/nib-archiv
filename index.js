import {
  htmlResponse,
  redirect,
  adminCookie,
  clearAdminCookie
} from "./helpers.js";
import { page } from "./html.js";
import {
  publicHomePage,
  publicPasswordPage,
  publicTextPage
} from "./public.js";
import {
  loginPage,
  adminDashboardPage,
  adminHeader,
  adminTextsPage,
  adminTextFormPage,
  adminFoldersPage,
  adminCommentsPage,
  adminTrashPage,
  adminPasswordsPage,
  adminSettingsPage
} from "./admin-pages.js";
import {
  getFolders,
  getTexts,
  getTextById,
  getPublicTextById,
  getComments,
  getLikes,
  hasLiked,
  getImages,
  getSetting,
  setSetting,
  getNewCommentCount
} from "./db.js";
import { uploadToCloudinary } from "./cloudinary.js";
import {
  requireAdmin,
  createAdminSession,
  ensureVisitorKey
} from "./session.js";

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
