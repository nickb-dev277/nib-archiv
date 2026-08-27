// ─────────────────────────────────────
// NiB – Grundfunktionen
// ─────────────────────────────────────

export function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


export function formatDate(value) {
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


export function visibilityLabel(visibility) {
  if (visibility === "public") return "Öffentlich";
  if (visibility === "semi_private") return "Halbprivat";
  return "Privat";
}


export function visibilityClass(visibility) {
  if (visibility === "public") return "visibility-public";
  if (visibility === "semi_private") return "visibility-semi";
  return "visibility-private";
}


export function randomId() {
  return crypto.randomUUID();
}


export function htmlResponse(html, status = 200, extraHeaders = {}) {
  return new Response(html, {
    status,
    headers: {
      "content-type": "text/html; charset=UTF-8",
      ...extraHeaders
    }
  });
}


export function redirect(location, extraHeaders = {}) {
  return new Response(null, {
    status: 303,
    headers: {
      Location: location,
      ...extraHeaders
    }
  });
}


export function getSession(request) {
  const cookie = request.headers.get("Cookie") || "";

  const match = cookie.match(
    /(?:^|;\s*)nib_session=([^;]+)/
  );

  return match ? match[1] : null;
}


export function getVisitorKey(request) {
  const cookie = request.headers.get("Cookie") || "";

  const match = cookie.match(
    /(?:^|;\s*)nib_visitor=([^;]+)/
  );

  return match ? match[1] : null;
}


export function visitorCookie(key) {
  return [
    `nib_visitor=${key}`,
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    "Path=/",
    "Max-Age=31536000"
  ].join("; ");
}


export function adminCookie(session) {
  return [
    `nib_session=${session}`,
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    "Path=/",
    "Max-Age=86400"
  ].join("; ");
}


export function clearAdminCookie() {
  return [
    "nib_session=",
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    "Path=/",
    "Max-Age=0"
  ].join("; ");
}

// ─────────────────────────────────────
// NiB – Lokale Sprache / 24-Stunden-Cookies
// ─────────────────────────────────────

const LANGUAGE_COOKIE_MAX_AGE = 60 * 60 * 24;

export function getCookie(request, name) {
  const cookieHeader = request.headers.get("Cookie") || "";

  const cookies = cookieHeader.split(";");

  for (const cookie of cookies) {
    const separator = cookie.indexOf("=");

    if (separator === -1) continue;

    const key = cookie.slice(0, separator).trim();
    const value = cookie.slice(separator + 1).trim();

    if (key === name) {
      try {
        return decodeURIComponent(value);
      } catch {
        return value;
      }
    }
  }

  return null;
}

export function getPublicLanguage(request) {
  const language = getCookie(request, "nib_public_language");

  return language === "de" ? "de" : "en";
}

export function getAdminLanguage(request) {
  const language = getCookie(request, "nib_admin_language");

  return language === "en" ? "en" : "de";
}

export function languageCookie(name, language) {
  const value = encodeURIComponent(language);

  return `${name}=${value}; Max-Age=${LANGUAGE_COOKIE_MAX_AGE}; Path=/; SameSite=Lax`;
}

export function deleteLanguageCookie(name) {
  return `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
}
