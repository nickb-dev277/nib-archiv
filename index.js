headers: {
                  "content-type": "text/html; charset=UTF-8"
                }
              }
            );
          }

          if (action === "toggle_folder") {

            const id = String(form.get("id") || "");

            await env.DB.prepare(`
              UPDATE folders
              SET is_private =
                CASE
                  WHEN is_private = 1 THEN 0
                  ELSE 1
                END,
                updated_at = ?
              WHERE id = ? AND deleted_at IS NULL
            `)
            .bind(
              new Date().toISOString(),
              id
            )
            .run();

            const folders = await getFolders(env);

            return new Response(
              adminPage("✅ Sichtbarkeit geändert.", folders),
              {
                headers: {
                  "content-type": "text/html; charset=UTF-8"
                }
              }
              );
          }
