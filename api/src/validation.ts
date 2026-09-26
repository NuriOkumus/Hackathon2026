// ─── Regex patterns ───────────────────────────────────────────────────────────

export const SERVER_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Requires https://, allows /user and /user/repo paths
export const SERVER_GITHUB_REGEX = /^https:\/\/(www\.)?github\.com\/.+$/;

// Requires https://, blocks http:// and javascript: scheme
export const SERVER_LINKEDIN_REGEX = /^https:\/\/(www\.)?linkedin\.com\/.+$/;

// ─── Input length limits ──────────────────────────────────────────────────────

export const MAX_TEAM_NAME = 100;
export const MAX_NOTES = 2000;
export const MAX_PROJECT_DESCRIPTION = 5000;
export const MAX_COMMIT_HASH = 100;

// ─── HTML escape helper ───────────────────────────────────────────────────────

export const escapeHtml = (s: string): string =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");

// ─── Member field validator ────────────────────────────────────────────────────

export function validateMemberFields(m: {
  name?: string;
  email?: string;
  github?: string;
  universityDept?: string;
  linkedin?: string;
}): string | null {
  if (!m.name?.trim()) return "Üye adı eksik.";
  if (!m.email?.trim() || !SERVER_EMAIL_REGEX.test(m.email)) return "Geçersiz üye e-posta adresi.";
  if (!m.github?.trim() || !SERVER_GITHUB_REGEX.test(m.github)) return "Geçersiz GitHub profil linki.";
  if (!m.universityDept?.trim()) return "Üniversite/bölüm bilgisi eksik.";
  if (m.linkedin?.trim() && !SERVER_LINKEDIN_REGEX.test(m.linkedin)) return "Geçersiz LinkedIn URL.";
  return null;
}

// ─── ADMIN_TOKEN startup guard ────────────────────────────────────────────────

export function assertAdminToken(token: string | undefined): void {
  if (!token || token === "change-me") {
    console.error("❌ ADMIN_TOKEN must be set to a strong secret. Exiting.");
    process.exit(1);
  }
}
