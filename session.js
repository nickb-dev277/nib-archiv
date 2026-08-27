import { getSession, randomId, visitorCookie } from "./helpers.js";

// ─────────────────────────────────────
// Session
// ─────────────────────────────────────

export async function requireAdmin(request, env) {
  const session = getSession(request);
  if (!session) return false;
  return (await env.SESSIONS.get(session)) === "admin";
}

export async function createAdminSession(env) {
  const session = randomId();
  await env.SESSIONS.put(session,"admin",{expirationTtl:60*60*24});
  return session;
}

export function ensureVisitorKey(request) {
  const existing = request.headers.get("Cookie")?.match(/(?:^|;\s*)nib_visitor=([^;]+)/)?.[1] || null;
  if (existing) return {key:existing,cookie:null};
  const key=randomId();
  return {key,cookie:visitorCookie(key)};
}
