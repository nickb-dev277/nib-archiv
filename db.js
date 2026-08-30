// ─────────────────────────────────────
// Datenbank
// ─────────────────────────────────────

export async function columnExists(env, table, column) {
  const result = await env.DB.prepare(`PRAGMA table_info(${table})`).all();
  return (result.results || []).some(row => row.name === column);
}

export async function ensureSchema(env) {
  const migrations = [];

  // Texte: Sprache hinzufügen
  if (!(await columnExists(env, "texts", "language"))) {
    migrations.push(
      `ALTER TABLE texts ADD COLUMN language TEXT NOT NULL DEFAULT 'de'`
    );
  }

  // Alte R2-Spalte entfernen, falls sie noch vorhanden ist
  const hasR2Key = await columnExists(env, "text_images", "r2_key");

  if (hasR2Key) {
    await env.DB.prepare(`
      CREATE TABLE text_images_new (
        id TEXT PRIMARY KEY,
        text_id TEXT NOT NULL,
        filename TEXT,
        created_at TEXT NOT NULL,
        cloudinary_public_id TEXT,
        url TEXT,
        cloudinary_url TEXT
      )
    `).run();

    await env.DB.prepare(`
      INSERT INTO text_images_new (
        id,
        text_id,
        filename,
        created_at,
        cloudinary_public_id,
        url,
        cloudinary_url
      )
      SELECT
        id,
        text_id,
        filename,
        created_at,
        cloudinary_public_id,
        url,
        cloudinary_url
      FROM text_images
    `).run();

    await env.DB.prepare(`
      DROP TABLE text_images
    `).run();

    await env.DB.prepare(`
      ALTER TABLE text_images_new
      RENAME TO text_images
    `).run();

  } else {

    // Fehlende Cloudinary-Spalten ergänzen
    if (!(await columnExists(env, "text_images", "cloudinary_public_id"))) {
      migrations.push(
        `ALTER TABLE text_images ADD COLUMN cloudinary_public_id TEXT`
      );
    }

    if (!(await columnExists(env, "text_images", "url"))) {
      migrations.push(
        `ALTER TABLE text_images ADD COLUMN url TEXT`
      );
    }

    if (!(await columnExists(env, "text_images", "cloudinary_url"))) {
      migrations.push(
        `ALTER TABLE text_images ADD COLUMN cloudinary_url TEXT`
      );
    }
  }

  // Migrationen ausführen
  for (const sql of migrations) {
    try {
      await env.DB.prepare(sql).run();
    } catch (e) {
      if (!String(e?.message || e).includes("duplicate column")) {
        throw e;
      }
    }
  }

  // Benachrichtigungen
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      text_id INTEGER,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL,
      read_at TEXT
    )
  `).run();
}

export async function cleanupTrash(env) {
  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const texts = await env.DB.prepare(`SELECT id FROM texts WHERE deleted_at IS NOT NULL AND deleted_at <= ?`).bind(cutoff).all();
  for (const row of texts.results || []) {
    await env.DB.prepare(`DELETE FROM text_images WHERE text_id = ?`).bind(row.id).run();
    await env.DB.prepare(`DELETE FROM comments WHERE text_id = ?`).bind(row.id).run();
    await env.DB.prepare(`DELETE FROM text_likes WHERE text_id = ?`).bind(row.id).run();
    await env.DB.prepare(`DELETE FROM notifications WHERE text_id = ?`).bind(row.id).run();
    await env.DB.prepare(`DELETE FROM texts WHERE id = ?`).bind(row.id).run();
  }
  await env.DB.prepare(`DELETE FROM folders WHERE deleted_at IS NOT NULL AND deleted_at <= ?`).bind(cutoff).run();
}

export async function getFolders(env, includeDeleted = false) {
  const query = includeDeleted ? `SELECT id,name,is_private,created_at,updated_at,deleted_at FROM folders ORDER BY name COLLATE NOCASE` : `SELECT id,name,is_private,created_at,updated_at,deleted_at FROM folders WHERE deleted_at IS NULL ORDER BY name COLLATE NOCASE`;
  const result = await env.DB.prepare(query).all();
  return result.results || [];
}

export async function getTexts(env, includeDeleted = false) {
  const query = includeDeleted ? `SELECT id,title,content,folder,visibility,password,language,updated_at,created_at,deleted_at FROM texts ORDER BY updated_at DESC` : `SELECT id,title,content,folder,visibility,password,language,updated_at,created_at,deleted_at FROM texts WHERE deleted_at IS NULL ORDER BY updated_at DESC`;
  const result = await env.DB.prepare(query).all();
  return result.results || [];
}

export async function getTextById(env, id, includeDeleted = false) {
  const query = includeDeleted ? `SELECT id,title,content,folder,visibility,password,language,updated_at,created_at,deleted_at FROM texts WHERE id = ?` : `SELECT id,title,content,folder,visibility,password,language,updated_at,created_at,deleted_at FROM texts WHERE id = ? AND deleted_at IS NULL`;
  return await env.DB.prepare(query).bind(id).first();
}

export async function getPublicTextById(env, id) {
  return await env.DB.prepare(`SELECT t.id,t.title,t.content,t.folder,t.visibility,t.password,t.language,t.updated_at,t.created_at FROM texts t LEFT JOIN folders f ON f.id=t.folder WHERE t.id=? AND t.deleted_at IS NULL AND (t.visibility='public' OR t.visibility='semi_private') AND (t.folder IS NULL OR t.folder='' OR (f.id IS NOT NULL AND f.deleted_at IS NULL AND f.is_private=0))`).bind(id).first();
}

export async function getComments(env, textId = null) {
  if (textId !== null) {
    const result = await env.DB.prepare(`SELECT id,text_id,comment,created_at,author_name FROM comments WHERE text_id=? ORDER BY created_at ASC,id ASC`).bind(textId).all();
    return result.results || [];
  }
  const result = await env.DB.prepare(`SELECT c.id,c.text_id,c.comment,c.created_at,c.author_name,t.title FROM comments c LEFT JOIN texts t ON t.id=c.text_id ORDER BY c.created_at DESC,c.id DESC`).all();
  return result.results || [];
}

export async function getLikes(env, textId) {
  const result = await env.DB.prepare(`SELECT COUNT(*) AS count FROM text_likes WHERE text_id=?`).bind(textId).first();
  return Number(result?.count || 0);
}

export async function hasLiked(env, textId, visitorKey) {
  if (!visitorKey) return false;
  const result = await env.DB.prepare(`SELECT id FROM text_likes WHERE text_id=? AND visitor_key=? LIMIT 1`).bind(textId, visitorKey).first();
  return Boolean(result);
}

export async function getImages(env, textId) {
  const result = await env.DB.prepare(
    `SELECT
       id,
       text_id,
       url,
       filename,
       created_at,
       cloudinary_public_id
     FROM text_images
     WHERE text_id=?
     ORDER BY created_at ASC`
  ).bind(textId).all();

  return result.results || [];
}

export async function getSetting(env,key) {
  const result = await env.DB.prepare(`SELECT value FROM settings WHERE key=?`).bind(key).first();
  return result?.value || "";
}

export async function setSetting(env,key,value) {
  await env.DB.prepare(`INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value`).bind(key,String(value ?? "")).run();
}

export async function getSiteSettings(env) {
  const keys = ["artist_name","public_title","footer","language","default_folder"];
  const out = {};
  for (const key of keys) out[key] = await getSetting(env,key);
  if (!out.public_title) out.public_title = "NiB Archiv";
  if (!out.language) out.language = "de";
  return out;
}

export async function getNewNotificationCount(env) {
  const result = await env.DB.prepare(`SELECT COUNT(*) AS count FROM notifications WHERE read_at IS NULL`).first();
  return Number(result?.count || 0);
}

export async function getNotifications(env, limit = 50) {
  const result = await env.DB.prepare(`SELECT n.id,n.type,n.text_id,n.message,n.created_at,n.read_at,t.title FROM notifications n LEFT JOIN texts t ON t.id=n.text_id ORDER BY n.created_at DESC,n.id DESC LIMIT ?`).bind(limit).all();
  return result.results || [];
}

export async function addNotification(env,type,textId,message) {
  await env.DB.prepare(`INSERT INTO notifications(type,text_id,message,created_at,read_at) VALUES(?,?,?,?,NULL)`).bind(type,textId || null,message,new Date().toISOString()).run();
}

export async function markNotificationRead(env,id) { await env.DB.prepare(`UPDATE notifications SET read_at=? WHERE id=?`).bind(new Date().toISOString(),id).run(); }
export async function markAllNotificationsRead(env) { await env.DB.prepare(`UPDATE notifications SET read_at=? WHERE read_at IS NULL`).bind(new Date().toISOString()).run(); }
export async function getNewCommentCount(env) { return getNewNotificationCount(env); }
