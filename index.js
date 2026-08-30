// ─────────────────────────────────────
// Imports
// ─────────────────────────────────────

import {
  esc,
  htmlResponse,
  redirect,
  getSession,
  adminCookie,
  clearAdminCookie,
  randomId,
  getPublicLanguage,
  languageCookie
} from "./helpers.js";

import {
  publicHomePage,
  publicPasswordPage,
  publicTextPage
} from "./public.js";

import { page } from "./html.js";

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
  ensureSchema,
  cleanupTrash,
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
  getSiteSettings,
  getNewNotificationCount,
  getNotifications,
  addNotification,
  markNotificationRead,
  markAllNotificationsRead
} from "./db.js";

import {
  uploadToCloudinary,
  deleteFromCloudinary
} from "./cloudinary.js";

import {
  requireAdmin,
  createAdminSession,
  ensureVisitorKey
} from "./session.js";


// ─────────────────────────────────────
// Hilfsfunktionen
// ─────────────────────────────────────

function cookieValue(request, name) {
  const cookie = request.headers.get("Cookie") || "";

  return cookie.match(
    new RegExp(`(?:^|;\\s*)${name}=([^;]+)`)
  )?.[1] || null;
}


function unlockedCookie(id) {
  return `nib_unlock_${id}=1; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=900`;
}


function isValidLanguage(value) {
  return value === "en" ? "en" : "de";
}


async function cloudflareSecretUpdate(
  env,
  name,
  text
) {
  if (
    !env.CLOUDFLARE_API_TOKEN ||
    !env.CLOUDFLARE_ACCOUNT_ID ||
    !env.CLOUDFLARE_SCRIPT_NAME
  ) {
    throw new Error(
      "Für Passwortänderungen fehlen CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID oder CLOUDFLARE_SCRIPT_NAME."
    );
  }

  const endpoint =
    `https://api.cloudflare.com/client/v4/accounts/` +
    `${encodeURIComponent(env.CLOUDFLARE_ACCOUNT_ID)}` +
    `/workers/scripts/` +
    `${encodeURIComponent(env.CLOUDFLARE_SCRIPT_NAME)}` +
    `/secrets`;

  const response = await fetch(endpoint, {
    method: "PUT",

    headers: {
      "Authorization":
        `Bearer ${env.CLOUDFLARE_API_TOKEN}`,

      "Content-Type":
        "application/json"
    },

    body: JSON.stringify({
      name,
      text,
      type: "secret_text"
    })
  });

  const result =
    await response.json().catch(() => ({}));

  if (
    !response.ok ||
    result.success === false
  ) {
    throw new Error(
      result?.errors?.[0]?.message ||
      `Cloudflare Secret ${name} konnte nicht geändert werden.`
    );
  }

  return true;
}


async function getDefaultFolder(env) {
  const id =
    await getSetting(
      env,
      "default_folder"
    );

  if (!id) return null;

  const folders =
    await getFolders(env);

  return folders.find(
    folder =>
      String(folder.id) === String(id)
  ) || null;
}


async function validFolder(env, id) {
  if (!id) return null;

  const folders =
    await getFolders(env);

  return folders.find(
    folder =>
      String(folder.id) === String(id)
  ) || null;
}


function formTextData(
  form,
  fallback = {}
) {
  return {
    title: String(
      form.get("title") ??
      fallback.title ??
      ""
    ).trim(),

    content: String(
      form.get("content") ??
      fallback.content ??
      ""
    ),

    folder: String(
      form.get("folder") ??
      fallback.folder ??
      ""
    ).trim(),

    visibility: String(
      form.get("visibility") ??
      fallback.visibility ??
      "private"
    ),

    password: String(
      form.get("custom_password") ??
      fallback.password ??
      ""
    ).trim(),

    language: isValidLanguage(
      String(
        form.get("language") ??
        fallback.language ??
        "de"
      )
    )
  };
}


// ─────────────────────────────────────
// Papierkorb endgültig bereinigen
// ─────────────────────────────────────
//
// Nach 30 Tagen werden:
// 1. Cloudinary-Bilder gelöscht
// 2. Datenbankdaten gelöscht
//
// Das normale Verschieben in den Papierkorb
// löscht NICHTS aus Cloudinary.
// ─────────────────────────────────────

async function cleanupTrashWithImages(env) {
  const cutoff = new Date(
    Date.now() -
    30 * 24 * 60 * 60 * 1000
  ).toISOString();

  const result = await env.DB.prepare(`
    SELECT id
    FROM texts
    WHERE deleted_at IS NOT NULL
      AND deleted_at <= ?
  `)
    .bind(cutoff)
    .all();

  for (const row of result.results || []) {

    const images =
      await getImages(env, row.id);

    // Bilder aus Cloudinary löschen
    for (const image of images) {

      if (!image.cloudinary_public_id) {
        continue;
      }

      try {
        await deleteFromCloudinary(
          image.cloudinary_public_id,
          env
        );
      } catch (error) {
        console.error(
          "Cloudinary Delete:",
          error
        );
      }
    }

    // Datenbankdaten löschen
    await env.DB.prepare(`
      DELETE FROM text_images
      WHERE text_id = ?
    `)
      .bind(row.id)
      .run();

    await env.DB.prepare(`
      DELETE FROM comments
      WHERE text_id = ?
    `)
      .bind(row.id)
      .run();

    await env.DB.prepare(`
      DELETE FROM text_likes
      WHERE text_id = ?
    `)
      .bind(row.id)
      .run();

    await env.DB.prepare(`
      DELETE FROM notifications
      WHERE text_id = ?
    `)
      .bind(row.id)
      .run();

   await env.DB.prepare(`
  DELETE FROM texts
  WHERE id=?
    AND deleted_at IS NOT NULL
`)
  .bind(id)
  .run();
  }

  // Alte Ordner endgültig löschen
  await env.DB.prepare(`
    DELETE FROM folders
    WHERE deleted_at IS NOT NULL
      AND deleted_at <= ?
  `)
    .bind(cutoff)
    .run();
}


// ─────────────────────────────────────
// Worker
// ─────────────────────────────────────

export default {

  async fetch(request, env, ctx) {

    console.log(
      "Cloudinary config:",
      {
        cloudName:
          Boolean(
            env.CLOUDINARY_CLOUD_NAME
          ),

        apiKey:
          Boolean(
            env.CLOUDINARY_API_KEY
          ),

        apiSecret:
          Boolean(
            env.CLOUDINARY_API_SECRET
          )
      }
    );

    const url =
      new URL(request.url);

    const path =
      url.pathname;


    // ─────────────────────────────────────
    // Datenbank / automatische Wartung
    // ─────────────────────────────────────

    await ensureSchema(env);

    await cleanupTrashWithImages(env);

    const settings =
      await getSiteSettings(env);

    const isAdmin =
      await requireAdmin(
        request,
        env
      );


    // ─────────────────────────────────────
    // Admin Login / Session
    // ─────────────────────────────────────

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
              await createAdminSession(
                env
              );

            return redirect(
              "/admin",
              {
                "Set-Cookie":
                  adminCookie(
                    session
                  )
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

      const count =
        await getNewNotificationCount(
          env
        );

      const notifications =
        await getNotifications(
          env,
          10
        );

      return htmlResponse(
        adminDashboardPage(
          "",
          count,
          notifications
        )
      );
    }


    // ─────────────────────────────────────
    // Admin – Benachrichtigungen
    // ─────────────────────────────────────

    if (
      path === "/admin/notifications" &&
      isAdmin
    ) {

      if (request.method === "POST") {

        const form =
          await request.formData();

        const action =
          String(
            form.get("action") || ""
          );

        if (action === "read") {

          await markNotificationRead(
            env,
            String(
              form.get("id") || ""
            )
          );
        }

        if (action === "read_all") {
          await markAllNotificationsRead(
            env
          );
        }
      }

      const notifications =
        await getNotifications(
          env,
          200
        );

      const count =
        await getNewNotificationCount(
          env
        );

      const body =
        notifications.length
          ? notifications.map(
              n => `
                <div class="admin-list-item">

                  <div class="admin-list-title">
                    ${esc(n.message)}
                  </div>

                  <div class="meta">

                    <span>
                      ${esc(n.title || "")}
                    </span>

                    <span>
                      ${esc(
                        new Date(
                          n.created_at
                        ).toLocaleString(
                          "de-DE"
                        )
                      )}
                    </span>

                    <span>
                      ${
                        n.read_at
                          ? "Gelesen"
                          : "Ungelesen"
                      }
                    </span>

                  </div>

                  ${
                    !n.read_at
                      ? `
                        <form
                          method="POST"
                          class="admin-actions"
                        >

                          <input
                            type="hidden"
                            name="action"
                            value="read"
                          >

                          <input
                            type="hidden"
                            name="id"
                            value="${esc(n.id)}"
                          >

                          <button
                            class="secondary"
                          >
                            Als gelesen markieren
                          </button>

                        </form>
                      `
                      : ""
                  }

                </div>
              `
            ).join("")
          : `
              <div class="empty">
                Keine Benachrichtigungen.
              </div>
            `;

      return htmlResponse(
        page(
          `
            ${adminHeader(
              "Benachrichtigungen",
              count
            )}

            <section class="card">

              <form
                method="POST"
                style="margin-bottom:20px"
              >

                <input
                  type="hidden"
                  name="action"
                  value="read_all"
                >

                <button>
                  Alle gelesen
                </button>

              </form>

              ${body}

            </section>
          `,
          "Benachrichtigungen – NiB"
        )
      );
    }


    // ─────────────────────────────────────
    // Admin – Texte
    // ─────────────────────────────────────

    if (
      path === "/admin/texts" &&
      isAdmin
    ) {

      let message = "";

      if (request.method === "POST") {

        const form =
          await request.formData();

        if (
          String(
            form.get("action") || ""
          ) === "delete_text"
        ) {

          const id =
            String(
              form.get("id") || ""
            );

          if (id) {

            const now =
              new Date().toISOString();

            // NUR Papierkorb.
            // Cloudinary bleibt erhalten.
            await env.DB.prepare(`
              UPDATE texts
              SET
                deleted_at = ?,
                updated_at = ?
              WHERE id = ?
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

   return htmlResponse(
  adminTextsPage(
    await getTexts(env, false),
    await getFolders(env, false),
    await getNewNotificationCount(env),
    message
  )
);
    }


    // ─────────────────────────────────────
    // Admin – Neuer Text
    // ─────────────────────────────────────

    if (
      path === "/admin/text/new" &&
      isAdmin
    ) {

      const folders =
        await getFolders(env);

      const count =
        await getNewNotificationCount(
          env
        );

      if (request.method === "POST") {

        const form =
          await request.formData();

        const data =
          formTextData(form);

        if (!data.title) {

          return htmlResponse(
            adminTextFormPage(
              data,
              folders,
              [],
              count,
              "Bitte einen Titel eingeben."
            ),
            400
          );
        }

        if (!data.folder) {

          const defaultFolder =
            await getDefaultFolder(
              env
            );

          if (defaultFolder) {
            data.folder =
              String(
                defaultFolder.id
              );
          }
        }

        if (
          !data.folder ||
          !(await validFolder(
            env,
            data.folder
          ))
        ) {

          return htmlResponse(
            adminTextFormPage(
              data,
              folders,
              [],
              count,
              "Ein Text darf nicht ohne Ordner gespeichert werden."
            ),
            400
          );
        }

        if (
          ![
            "public",
            "semi_private",
            "private"
          ].includes(
            data.visibility
          )
        ) {

          return htmlResponse(
            adminTextFormPage(
              data,
              folders,
              [],
              count,
              "Ungültige Sichtbarkeit."
            ),
            400
          );
        }

        const now =
          new Date().toISOString();

        const result =
          await env.DB.prepare(`
            INSERT INTO texts(
              title,
              content,
              folder,
              visibility,
              password,
              language,
              updated_at,
              created_at,
              deleted_at
            )
            VALUES(
              ?,?,?,?,?,?,?,?,NULL
            )
          `)
            .bind(
              data.title,
              data.content,
              data.folder,
              data.visibility,
              data.password ||
                null,
              data.language,
              now,
              now
            )
            .run();

        const textId =
          result.meta?.last_row_id;

        if (textId) {

          for (
            const file of
            form.getAll("images")
          ) {

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

              if (uploaded) {

                await env.DB.prepare(`
                  INSERT INTO text_images(
                    id,
                    text_id,
                    url,
                    filename,
                    created_at,
                    cloudinary_public_id
                  )
                  VALUES(?,?,?,?,?,?)
                `)
                  .bind(
                    randomId(),
                    textId,
                    uploaded.url,
                    uploaded.filename,
                    now,
                    uploaded.public_id ||
                      null
                  )
                  .run();
              }

            } catch (error) {

              console.error(
                "Cloudinary Upload:",
                error
              );

              throw error;
            }
          }
        }

        return redirect(
          `/admin/text/${encodeURIComponent(
            textId
          )}`
        );
      }

      return htmlResponse(
        adminTextFormPage(
          {
            folder:
              (await getDefaultFolder(
                env
              ))?.id || "",

            language: "de",

            visibility: "private"
          },
          folders,
          [],
          count
        )
      );
    }


    // ─────────────────────────────────────
    // Admin – Text bearbeiten
    // ─────────────────────────────────────

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
            await getNewNotificationCount(
              env
            ),
            "Text nicht gefunden."
          ),
          404
        );
      }

      const folders =
        await getFolders(env);

      const count =
        await getNewNotificationCount(
          env
        );

      if (request.method === "POST") {

        const form =
          await request.formData();

        const action =
          String(
            form.get("action") || ""
          );


        // ─────────────────────────────────
        // Text aktualisieren
        // ─────────────────────────────────

        if (
          action === "update_text"
        ) {

          const data =
            formTextData(
              form,
              text
            );

          if (!data.title) {

            return htmlResponse(
              adminTextFormPage(
                {
                  ...text,
                  ...data
                },
                folders,
                await getImages(
                  env,
                  id
                ),
                count,
                "Bitte einen Titel eingeben."
              ),
              400
            );
          }

          if (
            !data.folder ||
            !(await validFolder(
              env,
              data.folder
            ))
          ) {

            return htmlResponse(
              adminTextFormPage(
                {
                  ...text,
                  ...data
                },
                folders,
                await getImages(
                  env,
                  id
                ),
                count,
                "Ein Text darf nicht ohne Ordner gespeichert werden."
              ),
              400
            );
          }

          if (
            ![
              "public",
              "semi_private",
              "private"
            ].includes(
              data.visibility
            )
          ) {

            return htmlResponse(
              adminTextFormPage(
                {
                  ...text,
                  ...data
                },
                folders,
                await getImages(
                  env,
                  id
                ),
                count,
                "Ungültige Sichtbarkeit."
              ),
              400
            );
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
              language = ?,
              updated_at = ?
            WHERE id = ?
          `)
            .bind(
              data.title,
              data.content,
              data.folder,
              data.visibility,
              data.password ||
                null,
              data.language,
              now,
              id
            )
            .run();


          // Neue Bilder hochladen
          for (
            const file of
            form.getAll("images")
          ) {

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

              if (uploaded) {

                await env.DB.prepare(`
                  INSERT INTO text_images(
                    id,
                    text_id,
                    url,
                    filename,
                    created_at,
                    cloudinary_public_id
                  )
                  VALUES(?,?,?,?,?,?)
                `)
                  .bind(
                    randomId(),
                    id,
                    uploaded.url,
                    uploaded.filename,
                    now,
                    uploaded.public_id ||
                      null
                  )
                  .run();
              }

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
        }


        // ─────────────────────────────────
        // Einzelnes Bild löschen
        // ─────────────────────────────────

        if (
          action === "delete_image"
        ) {

          const imageId =
            String(
              form.get("image_id") ||
              ""
            );

          const image =
            (
              await getImages(
                env,
                id
              )
            ).find(
              item =>
                String(item.id) ===
                imageId
            );

          if (image) {

            if (
              image.cloudinary_public_id
            ) {

              try {

                await deleteFromCloudinary(
                  image.cloudinary_public_id,
                  env
                );

              } catch (error) {

                console.error(
                  "Cloudinary Delete:",
                  error
                );
              }
            }

            await env.DB.prepare(`
              DELETE FROM text_images
              WHERE id = ?
                AND text_id = ?
            `)
              .bind(
                imageId,
                id
              )
              .run();
          }

          text =
            await getTextById(
              env,
              id,
              false
            );
        }
      }

      return htmlResponse(
        adminTextFormPage(
          text,
          folders,
          await getImages(
            env,
            id
          ),
          count
        )
      );
    }


    // ─────────────────────────────────────
    // Admin – Ordner
    // ─────────────────────────────────────

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

        const id =
          String(
            form.get("id") || ""
          );

        const now =
          new Date().toISOString();

            
       if (action === "create_folder") {
  const name =
    String(
      form.get("name") || ""
    ).trim();

  if (name) {
    const folderId = randomId();

    await env.DB.prepare(`
      INSERT INTO folders(
        id,
        name,
        is_private,
        created_at,
        updated_at,
        deleted_at
      )
      VALUES(?, ?, 0, ?, ?, NULL)
    `)
      .bind(
        folderId,
        name,
        now,
        now
      )
      .run();

    message = "Ordner erstellt.";
  }
}
      
        if (
          action === "rename_folder" &&
          id
        ) {
          const name =
            String(
              form.get("name") || ""
            ).trim();

          if (name) {
            await env.DB.prepare(`
              UPDATE folders
              SET name=?, updated_at=?
              WHERE id=? AND deleted_at IS NULL
            `)
              .bind(name, now, id)
              .run();

            message = "Ordner umbenannt.";
          }
        }

        if (
          action === "toggle_folder" &&
          id
        ) {
          const folder =
            await env.DB.prepare(`
              SELECT is_private
              FROM folders
              WHERE id=? AND deleted_at IS NULL
            `)
              .bind(id)
              .first();

          if (folder) {
            const next =
              Number(folder.is_private) ? 0 : 1;

            await env.DB.prepare(`
              UPDATE folders
              SET is_private=?, updated_at=?
              WHERE id=?
            `)
              .bind(next, now, id)
              .run();

            message = "Ordner aktualisiert.";
          }
        }

        if (
          action === "delete_folder" &&
          id
        ) {
          await env.DB.prepare(`
            UPDATE folders
            SET deleted_at=?, updated_at=?
            WHERE id=? AND deleted_at IS NULL
          `)
            .bind(now, now, id)
            .run();

          message =
            "Ordner in den Papierkorb verschoben.";
        }
      }

      return htmlResponse(
        adminFoldersPage(
          await getFolders(env),
          await getNewNotificationCount(env),
          message
        )
      );
    }


    // ─────────────────────────────────────
    // Admin – Kommentare
    // ─────────────────────────────────────

    if (
      path === "/admin/comments" &&
      isAdmin
    ) {
      let message = "";

      if (request.method === "POST") {
        const form =
          await request.formData();

        if (
          String(
            form.get("action") || ""
          ) === "delete_comment"
        ) {
          const id =
            String(
              form.get("id") || ""
            );

          if (id) {
            await env.DB.prepare(`
              DELETE FROM comments
              WHERE id=?
            `)
              .bind(id)
              .run();

            message = "Kommentar gelöscht.";
          }
        }
      }

      return htmlResponse(
        adminCommentsPage(
          await getComments(env),
          await getNewNotificationCount(env),
          message
        )
      );
    }


    // ─────────────────────────────────────
    // Admin – Papierkorb
    // ─────────────────────────────────────

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


        // Text wiederherstellen
        if (
          action === "restore_text" &&
          id
        ) {
          await env.DB.prepare(`
            UPDATE texts
            SET deleted_at=NULL,
                updated_at=?
            WHERE id=?
          `)
            .bind(
              new Date().toISOString(),
              id
            )
            .run();

          message =
            "Text wiederhergestellt.";
        }


        // Text endgültig löschen
        if (
          action === "permanent_delete_text" &&
          id
        ) {
          const images =
            await getImages(env, id);

          // Zuerst Cloudinary-Bilder löschen
          for (const image of images) {
            if (!image.cloudinary_public_id) {
              continue;
            }

            try {
              await deleteFromCloudinary(
                image.cloudinary_public_id,
                env
              );
            } catch (error) {
              console.error(
                "Cloudinary Delete:",
                error
              );
            }
          }

          // Danach Datenbank-Einträge löschen
          await env.DB.prepare(`
            DELETE FROM text_images
            WHERE text_id=?
          `)
            .bind(id)
            .run();

          await env.DB.prepare(`
            DELETE FROM comments
            WHERE text_id=?
          `)
            .bind(id)
            .run();

          await env.DB.prepare(`
            DELETE FROM text_likes
            WHERE text_id=?
          `)
            .bind(id)
            .run();

          await env.DB.prepare(`
            DELETE FROM notifications
            WHERE text_id=?
          `)
            .bind(id)
            .run();

          await env.DB.prepare(`
            DELETE FROM texts
            WHERE id=?
          `)
            .bind(id)
            .run();

          message =
            "Text endgültig gelöscht.";
        }


        // Ordner wiederherstellen
        if (
          action === "restore_folder" &&
          id
        ) {
          await env.DB.prepare(`
            UPDATE folders
            SET deleted_at=NULL,
                updated_at=?
            WHERE id=?
          `)
            .bind(
              new Date().toISOString(),
              id
            )
            .run();

          message =
            "Ordner wiederhergestellt.";
        }


        // Ordner endgültig löschen
        if (
          action === "permanent_delete_folder" &&
          id
        ) {
         await env.DB.prepare(`
  DELETE FROM folders
  WHERE id=?
    AND deleted_at IS NOT NULL
`)
  .bind(id)
  .run();
          message =
            "Ordner endgültig gelöscht.";
        }
      }

      const allTexts =
        await getTexts(env, true);

      const allFolders =
        await getFolders(env, true);

      return htmlResponse(
        adminTrashPage(
          allTexts.filter(
            text => text.deleted_at
          ),
          allFolders.filter(
            folder => folder.deleted_at
          ),
          await getNewNotificationCount(env),
          message
        )
      );
    }


    // ─────────────────────────────────────
    // Admin – Passwörter
    // ─────────────────────────────────────

    if (
      path === "/admin/passwords" &&
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

        const newPassword =
          String(
            form.get("new_password") || ""
          );

        if (newPassword.length < 8) {
          return htmlResponse(
            adminPasswordsPage(
              await getTexts(env),
              await getNewNotificationCount(env),
              "Passwort muss mindestens 8 Zeichen lang sein.",
              Boolean(
                env.CLOUDFLARE_API_TOKEN &&
                env.CLOUDFLARE_ACCOUNT_ID &&
                env.CLOUDFLARE_SCRIPT_NAME
              )
            ),
            400
          );
        }

        try {
          if (
            action === "change_admin_password"
          ) {
            await cloudflareSecretUpdate(
              env,
              "ADMIN_PASSWORD",
              newPassword
            );
          }

          if (
            action === "change_semi_password"
          ) {
            await cloudflareSecretUpdate(
              env,
              "SEMI_PRIVATE_PASSWORD",
              newPassword
            );
          }

          message =
            "Cloudflare-Secret wurde geändert.";
        } catch (error) {
          return htmlResponse(
            adminPasswordsPage(
              await getTexts(env),
              await getNewNotificationCount(env),
              String(
                error.message || error
              ),
              Boolean(
                env.CLOUDFLARE_API_TOKEN &&
                env.CLOUDFLARE_ACCOUNT_ID &&
                env.CLOUDFLARE_SCRIPT_NAME
              )
            ),
            500
          );
        }
      }

      return htmlResponse(
        adminPasswordsPage(
          await getTexts(env),
          await getNewNotificationCount(env),
          message,
          Boolean(
            env.CLOUDFLARE_API_TOKEN &&
            env.CLOUDFLARE_ACCOUNT_ID &&
            env.CLOUDFLARE_SCRIPT_NAME
          )
        )
      );
    }


    // ─────────────────────────────────────
    // Admin – Einstellungen
    // ─────────────────────────────────────

    if (
      path === "/admin/settings" &&
      isAdmin
    ) {
      let message = "";

      if (request.method === "POST") {
        const form =
          await request.formData();

        if (
          String(
            form.get("action") || ""
          ) === "save_settings"
        ) {
          await setSetting(
            env,
            "artist_name",
            String(
              form.get("artist_name") || ""
            )
          );

          await setSetting(
            env,
            "public_title",
            String(
              form.get("public_title") ||
              "NiB Archiv"
            ).trim() || "NiB Archiv"
          );

          await setSetting(
            env,
            "footer",
            String(
              form.get("footer") || ""
            )
          );

          await setSetting(
            env,
            "language",
            isValidLanguage(
              String(
                form.get("site_language") ||
                "de"
              )
            )
          );

          const defaultFolder =
            String(
              form.get("default_folder") || ""
            );

          if (
            defaultFolder &&
            await validFolder(
              env,
              defaultFolder
            )
          ) {
            await setSetting(
              env,
              "default_folder",
              defaultFolder
            );
          } else {
            await setSetting(
              env,
              "default_folder",
              ""
            );
          }

          message =
            "Einstellungen gespeichert.";
        }
      }

      return htmlResponse(
        adminSettingsPage(
          await getNewNotificationCount(env),
          message,
          await getSiteSettings(env),
          await getFolders(env)
        )
      );
    }


    // ─────────────────────────────────────
    // Öffentliche Sprachumschaltung
    // ─────────────────────────────────────

    if (path === "/language") {
      const selectedLanguage =
        url.searchParams.get(
          "language"
        );

      if (
        selectedLanguage === "de" ||
        selectedLanguage === "en"
      ) {
        return redirect("/", {
          "Set-Cookie":
            languageCookie(
              "nib_public_language",
              selectedLanguage
            )
        });
      }

      return redirect("/");
    }


    // ─────────────────────────────────────
    // Öffentliche Textseite
    // ─────────────────────────────────────

    const publicTextMatch =
      path.match(
        /^\/text\/(\d+)$/
      );

    if (publicTextMatch) {
      const id =
        publicTextMatch[1];

      const publicLanguage =
        getPublicLanguage(request);

      const text =
        await getPublicTextById(
          env,
          id
        );

      if (!text) {
        return htmlResponse(
          page(
            `
              <a class="back-link" href="/">
                ← ${
                  publicLanguage === "en"
                    ? "Back"
                    : "Zurück"
                }
              </a>

              <h1 class="section-title">
                ${
                  publicLanguage === "en"
                    ? "Text not found"
                    : "Text nicht gefunden"
                }
              </h1>

              <p class="muted">
                ${
                  publicLanguage === "en"
                    ? "This text does not exist or is not public."
                    : "Dieser Text existiert nicht oder ist nicht öffentlich."
                }
              </p>
            `,
            publicLanguage === "en"
              ? "Not found"
              : "Nicht gefunden"
          ),
          404
        );
      }

      if (
        text.visibility === "semi_private"
      ) {
        const unlocked =
          cookieValue(
            request,
            `nib_unlock_${id}`
          ) === "1";

        if (!unlocked) {
          if (
            request.method === "POST"
          ) {
            const form =
              await request.formData();

            if (
              String(
                form.get("action") || ""
              ) === "unlock_text"
            ) {
              const password =
                String(
                  form.get("password") || ""
                );

              const expected =
                text.password ||
                env.SEMI_PRIVATE_PASSWORD;

              if (
                password === expected
              ) {
                const visitor =
                  ensureVisitorKey(
                    request
                  );

                const response =
                  htmlResponse(
                    publicTextPage(
                      text,
                      (
                        await getFolders(
                          env
                        )
                      ).find(
                        f =>
                          String(f.id) ===
                          String(text.folder)
                      ),
                      await getImages(
                        env,
                        id
                      ),
                      await getComments(
                        env,
                        id
                      ),
                      await getLikes(
                        env,
                        id
                      ),
                      await hasLiked(
                        env,
                        id,
                        visitor.key
                      ),
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

      const visitor =
        ensureVisitorKey(request);

      const folders =
        await getFolders(env);

      const response =
        htmlResponse(
          publicTextPage(
            text,
            folders.find(
              f =>
                String(f.id) ===
                String(text.folder)
            ),
            await getImages(
              env,
              id
            ),
            await getComments(
              env,
              id
            ),
            await getLikes(
              env,
              id
            ),
            await hasLiked(
              env,
              id,
              visitor.key
            ),
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


    // ─────────────────────────────────────
    // Öffentliche Likes / Kommentare
    // ─────────────────────────────────────

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

      if (
        action === "like" &&
        path === "/like"
      ) {
        const visitor =
          ensureVisitorKey(request);

        const already =
          await hasLiked(
            env,
            id,
            visitor.key
          );

        if (!already) {
          const result =
            await env.DB.prepare(`
              INSERT OR IGNORE INTO text_likes(
                text_id,
                visitor_key,
                created_at
              )
              VALUES(?,?,?)
            `)
              .bind(
                id,
                visitor.key,
                new Date().toISOString()
              )
              .run();

          if (result.meta?.changes) {
            await addNotification(
              env,
              "like",
              id,
              `Neues Like für „${text.title}”.`
            );
          }
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

      if (
        action === "create_comment" &&
        path === "/comment"
      ) {
        const comment =
          String(
            form.get("comment") || ""
          ).trim();

        const author =
          String(
            form.get("author_name") || ""
          ).trim();

        if (!comment) {
          return redirect(
            `/text/${encodeURIComponent(id)}`
          );
        }

        await env.DB.prepare(`
          INSERT INTO comments(
            text_id,
            comment,
            created_at,
            author_name
          )
          VALUES(?,?,?,?)
        `)
          .bind(
            id,
            comment,
            new Date().toISOString(),
            author || null
          )
          .run();

        await addNotification(
          env,
          "comment",
          id,
          `Neuer Kommentar zu „${text.title}”.`
        );

        return redirect(
          `/text/${encodeURIComponent(id)}`
        );
      }
    }


    // ─────────────────────────────────────
    // Öffentliche Website
    // ─────────────────────────────────────

    if (
      path === "/" ||
      path === ""
    ) {
      const search =
        url.searchParams.get("q") || "";

      const folderFilter =
        url.searchParams.get("folder") || "";

      const languageFilter =
        url.searchParams.get("language") || "";

      const publicLanguage =
        getPublicLanguage(request);

      return htmlResponse(
        publicHomePage(
          await getTexts(env),
          await getFolders(env),
          search,
          folderFilter,
          languageFilter,
          settings,
          publicLanguage
        )
      );
    }

    return htmlResponse(
      page(
        `<h1 class="section-title">404</h1>
         <p class="muted">Seite nicht gefunden.</p>`,
        "404 – NiB"
      ),
      404
    );
  }
};
