import {
  getSession,
  randomId,
  visitorCookie,
  getVisitorKey
} from "./helpers.js";

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


export {
  requireAdmin,
  createAdminSession,
  ensureVisitorKey
};
