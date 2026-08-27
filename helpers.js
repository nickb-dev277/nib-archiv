// 06. Admin-Menüs
// 07. Datenbank-Funktionen
// 08. Cloudinary
// 09. Sessions / Besucher
// 10. Worker / Routing
// ═════════════════════════════════════════════════════════════════════


// ─────────────────────────────────────────────────────────────────────
// 01. GRUNDFUNKTIONEN
// ─────────────────────────────────────────────────────────────────────

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}


function visibilityLabel(visibility) {
  if (visibility === "public") return "Öffentlich";
  if (visibility === "semi_private") return "Halbprivat";
  return "Privat";
}


function visibilityClass(visibility) {
  if (visibility === "public") return "visibility-public";
  if (visibility === "semi_private") return "visibility-semi";
  return "visibility-private";
}


function randomId() {
  return crypto.randomUUID();
}


function htmlResponse(html, status = 200, extraHeaders = {}) {
  return new Response(html, {
    status,
    headers: {
      "content-type": "text/html; charset=UTF-8",
      ...extraHeaders
    }
  });
}


function redirect(location, extraHeaders = {}) {
  return new Response(null, {
    status: 303,
    headers: {
      Location: location,
      ...extraHeaders
    }
  });
}


function getSession(request) {
  const cookie = request.headers.get("Cookie") || "";

  const match = cookie.match(
    /(?:^|;\s*)nib_session=([^;]+)/
  );

  return match ? match[1] : null;
}


function getVisitorKey(request) {
  const cookie = request.headers.get("Cookie") || "";

  const match = cookie.match(
    /(?:^|;\s*)nib_visitor=([^;]+)/
  );

  return match ? match[1] : null;
}


function visitorCookie(key) {
  return [
    `nib_visitor=${key}`,
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    "Path=/",
    "Max-Age=31536000"
  ].join("; ");
}


function adminCookie(session) {
  return [
    `nib_session=${session}`,
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    "Path=/",
    "Max-Age=86400"
  ].join("; ");
}


function clearAdminCookie() {
  return [
    "nib_session=",
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    "Path=/",
    "Max-Age=0"
  ].join("; ");
}


// ─────────────────────────────────────────────────────────────────────
// 02. HTML / CSS
// ─────────────────────────────────────────────────────────────────────


export {
  esc,
  formatDate,
  visibilityLabel,
  visibilityClass,
  randomId,
  htmlResponse,
  redirect,
  getSession,
  getVisitorKey,
  visitorCookie,
  adminCookie,
  clearAdminCookie
};
