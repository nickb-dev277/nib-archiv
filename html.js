import { esc } from "./helpers.js";

// ─────────────────────────────────────
// HTML-Seite / NiB-Design
// ─────────────────────────────────────

export function page(content, title = "NiB") {
  return `<!doctype html>
<html lang="de">
<head>

<meta charset="utf-8">

<meta
  name="viewport"
  content="width=device-width,initial-scale=1"
>

<title>${esc(title)}</title>

<style>

:root {
  --bg: #f3efe8;
  --paper: #faf8f4;
  --paper-2: #ebe5dc;
  --text: #29251f;
  --muted: #81796f;
  --line: #ddd6cc;
  --accent: #4d4943;
  --danger: #7a4f4f;
  --success: #52644e;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.6;
}

a {
  color: inherit;
}

main {
  width: min(1000px, calc(100% - 40px));
  margin: 0 auto;
  padding: 45px 0 100px;
}

button,
input,
textarea,
select {
  font: inherit;
}

button {
  border: 1px solid var(--accent);
  background: var(--accent);
  color: #fff;
  padding: 10px 18px;
  cursor: pointer;
}

button:hover {
  opacity: .82;
}

button.secondary {
  background: transparent;
  color: var(--text);
  border-color: var(--line);
}

button.danger {
  background: transparent;
  color: var(--danger);
  border-color: #c9b4b4;
}

button.like-button {
  background: transparent;
  color: var(--text);
  border-color: var(--line);
}

button.like-button.liked {
  background: var(--accent);
  color: #fff;
}

input,
textarea,
select {
  width: 100%;
  border: 1px solid var(--line);
  background: transparent;
  color: var(--text);
  padding: 12px 13px;
  outline: none;
  border-radius: 0;
}

input:focus,
textarea:focus,
select:focus {
  border-color: var(--accent);
}

textarea {
  min-height: 320px;
  resize: vertical;
}

label {
  display: block;
  margin-bottom: 22px;
  color: var(--muted);
  font-size: 13px;
}

label input,
label textarea,
label select {
  margin-top: 7px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 55px;
}

.logo {
  margin: 0;
  font-family: Georgia, serif;
  font-size: 44px;
  font-weight: 400;
  letter-spacing: .18em;
}

.subtitle {
  margin: 8px 0 0;
  color: var(--muted);
  font-size: 13px;
  letter-spacing: .08em;
  text-transform: uppercase;
}

.card {
  background: var(--paper);
  border: 1px solid var(--line);
  padding: 28px;
}

.section {
  margin-bottom: 45px;
}

.section-title {
  margin: 0 0 20px;
  font-family: Georgia, serif;
  font-size: 27px;
  font-weight: 400;
}

.message {
  border-left: 2px solid var(--accent);
  padding: 10px 15px;
  margin-bottom: 30px;
  color: var(--muted);
}

.message.success {
  border-color: var(--success);
}

.message.danger {
  border-color: var(--danger);
}

.muted {
  color: var(--muted);
}

.small {
  font-size: 13px;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 18px;
  color: var(--muted);
  font-size: 13px;
}

.badge {
  display: inline-block;
  padding: 3px 8px;
  border: 1px solid var(--line);
  font-size: 12px;
}

.visibility-public {
  color: var(--success);
}

.visibility-semi {
  color: #776342;
}

.visibility-private {
  color: var(--danger);
}


/* Öffentliche Website */

.public-header {
  position: relative;
}

.admin-link {
  position: absolute;
  top: 0;
  right: 0;
  text-decoration: none;
  border: 1px solid var(--line);
  padding: 8px 13px;
  font-size: 13px;
  background: var(--paper);
}

/* ─────────────────────────────────────
   Sprachschalter
   ───────────────────────────────────── */
.public-header-tools {
  position: absolute;
  top: -50px;
  left: 0;

  display: flex;
  align-items: center;
  gap: 10px;
}

.language-switch {
  position: relative;

  display: flex;
  align-items: center;

  width: 76px;
  height: 34px;

  padding: 3px;

  background: #e5ebe3;
  border: 1px solid #c8d3c5;
  border-radius: 999px;

  overflow: hidden;
}

.language-option {
  position: relative;
  z-index: 2;

  width: 50%;
  height: 26px;

  display: flex;
  align-items: center;
  justify-content: center;

  text-decoration: none;

  color: var(--muted);
  font-size: 11px;
  font-weight: bold;

  border-radius: 999px;

  transition: color .2s ease;
}

.language-option:hover {
  color: var(--text);
}

.language-option.active {
  color: white;
}

.language-slider {
  position: absolute;
  z-index: 1;

  top: 3px;
  left: 3px;

  width: 34px;
  height: 26px;

  background: #4f9d61;
  border-radius: 999px;

  box-shadow: 0 2px 5px rgba(0, 0, 0, .15);

  transition: transform .2s ease;
}

.language-slider.english {
  transform: translateX(36px);
}

.public-intro {
  margin-bottom: 35px;
}

.public-tools {
  display: grid;
  grid-template-columns: 1fr 220px;
  gap: 10px;
  margin-bottom: 35px;
}

.public-list {
  display: flex;
  flex-direction: column;
}

.public-item {
  display: block;
  padding: 24px 0;
  border-top: 1px solid var(--line);
  text-decoration: none;
}

.public-item:first-child {
  border-top: 0;
}

.public-item h2 {
  margin: 0 0 8px;
  font-family: Georgia, serif;
  font-size: 25px;
  font-weight: 400;
}

.public-item:hover h2 {
  text-decoration: underline;
}

.public-item-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 18px;
  color: var(--muted);
  font-size: 13px;
}


/* Öffentlicher Text */

.text-header {
  margin-bottom: 35px;
}

.back-link {
  display: inline-block;
  margin-bottom: 25px;
  color: var(--muted);
  text-decoration: none;
  font-size: 13px;
}

.back-link:hover {
  text-decoration: underline;
}

.text-title {
  margin: 0 0 12px;
  font-family: Georgia, serif;
  font-size: clamp(32px, 6vw, 54px);
  font-weight: 400;
  line-height: 1.15;
}

.text-content {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  word-break: break-word;
  font-size: 17px;
  line-height: 1.85;
}

.image-gallery {
  display: grid;
  gap: 16px;
  margin-top: 35px;
}

.image-gallery img {
  display: block;
  width: 100%;
  height: auto;
  max-height: 800px;
  object-fit: contain;
  background: var(--bg);
  border: 1px solid var(--line);
}

.interaction-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  padding: 20px 0;
  margin-top: 35px;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}

.interaction-count {
  color: var(--muted);
  font-size: 13px;
}


/* Kommentare */

.comments {
  margin-top: 45px;
}

.comment {
  padding: 20px 0;
  border-top: 1px solid var(--line);
}

.comment:first-child {
  border-top: 0;
}

.comment-author {
  font-weight: bold;
  font-size: 14px;
}

.comment-date {
  color: var(--muted);
  font-size: 12px;
  margin-left: 8px;
}

.comment-text {
  margin-top: 8px;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.comment-form {
  margin-top: 30px;
}

.comment-form textarea {
  min-height: 130px;
}


/* Login */

.login {
  max-width: 420px;
  margin: 80px auto;
}


/* Admin */

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 20px;
  margin-bottom: 40px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.dashboard-card {
  display: block;
  min-height: 155px;
  padding: 25px;
  background: var(--paper);
  border: 1px solid var(--line);
  color: var(--text);
  text-decoration: none;
}

.dashboard-card:hover {
  background: var(--paper-2);
}

.dashboard-card.featured {
  background: var(--paper-2);
}

.card-number {
  display: block;
  margin-bottom: 22px;
  color: var(--muted);
  font-size: 12px;
  letter-spacing: .12em;
}

.dashboard-card h2 {
  margin: 0 0 8px;
  font-family: Georgia, serif;
  font-size: 24px;
  font-weight: 400;
}

.dashboard-card p {
  margin: 0;
  color: var(--muted);
  font-size: 14px;
}

.admin-menu {
  margin-top: 45px;
}

.menu-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 25px;
}

.menu-nav a {
  padding: 8px 12px;
  border: 1px solid var(--line);
  text-decoration: none;
  color: var(--muted);
  font-size: 13px;
}

.menu-nav a:hover {
  color: var(--text);
  border-color: var(--accent);
}

.admin-list-item {
  padding: 22px 0;
  border-top: 1px solid var(--line);
}

.admin-list-item:first-child {
  border-top: 0;
}

.admin-list-title {
  font-family: Georgia, serif;
  font-size: 20px;
  margin-bottom: 5px;
}

.admin-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}

.admin-actions form {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.admin-actions input {
  width: 200px;
  padding: 9px 10px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.password-box {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid var(--line);
  background: var(--bg);
  overflow-wrap: anywhere;
}

.password-value {
  font-family: monospace;
  word-break: break-all;
}

.notification {
  display: inline-block;
  margin-left: 8px;
  padding: 2px 7px;
  background: var(--accent);
  color: white;
  font-size: 11px;
}

.image-admin {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 15px;
}

.image-admin figure {
  margin: 0;
  border: 1px solid var(--line);
  padding: 8px;
}

.image-admin img {
  width: 100%;
  height: 140px;
  object-fit: cover;
}

.empty {
  padding: 25px 0;
  color: var(--muted);
}


/* Responsive */

@media (max-width: 700px) {

  main {
    width: min(100% - 28px, 1000px);
    padding-top: 35px;
  }

  .logo {
    font-size: 36px;
  }

  .header,
  .dashboard-header {
    align-items: flex-start;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .public-tools,
  .form-row {
    grid-template-columns: 1fr;
  }

  .card {
    padding: 20px;
  }

/* Responsive */

@media (max-width: 700px) {

  main {
    width: min(100% - 28px, 1000px);
    padding-top: 35px;
  }

  .logo {
    font-size: 36px;
  }

  .header,
  .dashboard-header {
    align-items: flex-start;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .public-tools,
  .form-row {
    grid-template-columns: 1fr;
  }

  .card {
    padding: 20px;
  }


  /* ─────────────────────────────
     Handy / kleine Bildschirme
     ───────────────────────────── */

  body {
    background: #ebe7e0;
  }

  .public-header {
    padding-top: 45px;
  }

  /* Sprachschalter links */
  .public-header-tools {
    position: absolute;
    top: 8px;
    left: 0;

    display: flex;
    align-items: center;
  }

  /* Admin rechts auf gleicher Höhe */
  .admin-link {
    position: absolute;
    top: 8px;
    right: 0;

    display: inline-block;
    margin: 0;

    padding: 8px 13px;
    background: var(--paper);
  }

  /* NiB Archiv ausblenden */
  .public-header .subtitle {
    display: none;
  }


  /* Sprachschalter */
  .language-switch {
    width: 76px;
    height: 34px;
  }

  .language-option {
    height: 26px;
    min-width: 0;
    padding: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 11px;
  }

  .language-option.active {
    background: transparent;
    color: white;
    box-shadow: none;
  }

  .language-slider {
    width: 34px;
    height: 26px;
  }


  .image-admin {
    grid-template-columns: 1fr;
  }

}
