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


export {
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
};
