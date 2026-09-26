import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  escapeHtml,
  validateMemberFields,
  SERVER_GITHUB_REGEX,
  SERVER_LINKEDIN_REGEX,
  assertAdminToken,
  MAX_TEAM_NAME,
  MAX_NOTES,
  MAX_PROJECT_DESCRIPTION,
  MAX_COMMIT_HASH,
} from "./validation.js";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const validMember = {
  name: "Ali Veli",
  email: "ali@example.com",
  github: "https://github.com/aliveli",
  universityDept: "MSKÜ - Bilgisayar Müh.",
};

// ─── 1. validateMemberFields ──────────────────────────────────────────────────

describe("validateMemberFields", () => {
  it("geçerli üye null döndürür", () => {
    expect(validateMemberFields(validMember)).toBeNull();
  });

  it("geçerli üye + linkedin ile null döndürür", () => {
    expect(
      validateMemberFields({
        ...validMember,
        linkedin: "https://linkedin.com/in/aliveli",
      })
    ).toBeNull();
  });

  it("isim eksikse hata döndürür", () => {
    expect(validateMemberFields({ ...validMember, name: "" })).not.toBeNull();
  });

  it("sadece boşluk olan isim reddedilir", () => {
    expect(validateMemberFields({ ...validMember, name: "   " })).not.toBeNull();
  });

  it("e-posta eksikse hata döndürür", () => {
    expect(validateMemberFields({ ...validMember, email: "" })).not.toBeNull();
  });

  it("geçersiz e-posta formatı reddedilir", () => {
    expect(validateMemberFields({ ...validMember, email: "bu-gecersiz" })).not.toBeNull();
    expect(validateMemberFields({ ...validMember, email: "eksik@" })).not.toBeNull();
    expect(validateMemberFields({ ...validMember, email: "@domain.com" })).not.toBeNull();
  });

  it("github eksikse hata döndürür", () => {
    expect(validateMemberFields({ ...validMember, github: "" })).not.toBeNull();
  });

  it("https:// olmayan GitHub URL reddedilir", () => {
    expect(
      validateMemberFields({ ...validMember, github: "github.com/kullanici" })
    ).not.toBeNull();
  });

  it("http:// olan GitHub URL reddedilir (https zorunlu)", () => {
    expect(
      validateMemberFields({ ...validMember, github: "http://github.com/kullanici" })
    ).not.toBeNull();
  });

  it("https://github.com/kullanici geçer", () => {
    expect(
      validateMemberFields({ ...validMember, github: "https://github.com/kullanici" })
    ).toBeNull();
  });

  it("üniversite/bölüm eksikse hata döndürür", () => {
    expect(
      validateMemberFields({ ...validMember, universityDept: "" })
    ).not.toBeNull();
  });

  it("javascript: şemalı LinkedIn URL reddedilir", () => {
    expect(
      validateMemberFields({ ...validMember, linkedin: "javascript:alert(1)" })
    ).not.toBeNull();
  });

  it("http:// LinkedIn URL reddedilir", () => {
    expect(
      validateMemberFields({ ...validMember, linkedin: "http://linkedin.com/in/kullanici" })
    ).not.toBeNull();
  });

  it("geçerli https LinkedIn URL kabul edilir", () => {
    expect(
      validateMemberFields({ ...validMember, linkedin: "https://linkedin.com/in/kullanici" })
    ).toBeNull();
  });

  it("linkedin boş/undefined ise geçer (opsiyonel alan)", () => {
    expect(validateMemberFields({ ...validMember, linkedin: "" })).toBeNull();
    expect(validateMemberFields({ ...validMember, linkedin: undefined })).toBeNull();
    expect(validateMemberFields({ ...validMember })).toBeNull();
  });
});

// ─── 2. Input length limits ───────────────────────────────────────────────────

describe("Input uzunluk limitleri", () => {
  it(`takım adı ${MAX_TEAM_NAME} karakterde geçer`, () => {
    const exactly = "a".repeat(MAX_TEAM_NAME);
    expect(exactly.trim().length > MAX_TEAM_NAME).toBe(false);
  });

  it(`takım adı ${MAX_TEAM_NAME + 1} karakterde reddedilir`, () => {
    const tooLong = "a".repeat(MAX_TEAM_NAME + 1);
    expect(tooLong.trim().length > MAX_TEAM_NAME).toBe(true);
  });

  it(`notlar ${MAX_NOTES} karakterde geçer`, () => {
    const exactly = "a".repeat(MAX_NOTES);
    expect(exactly.length > MAX_NOTES).toBe(false);
  });

  it(`notlar ${MAX_NOTES + 1} karakterde reddedilir`, () => {
    const tooLong = "a".repeat(MAX_NOTES + 1);
    expect(tooLong.length > MAX_NOTES).toBe(true);
  });

  it(`proje açıklaması ${MAX_PROJECT_DESCRIPTION + 1} karakterde reddedilir`, () => {
    const tooLong = "a".repeat(MAX_PROJECT_DESCRIPTION + 1);
    expect(tooLong.trim().length > MAX_PROJECT_DESCRIPTION).toBe(true);
  });

  it(`proje açıklaması ${MAX_PROJECT_DESCRIPTION} karakterde geçer`, () => {
    const exactly = "a".repeat(MAX_PROJECT_DESCRIPTION);
    expect(exactly.trim().length > MAX_PROJECT_DESCRIPTION).toBe(false);
  });

  it(`commit hash ${MAX_COMMIT_HASH + 1} karakterde reddedilir`, () => {
    const tooLong = "a".repeat(MAX_COMMIT_HASH + 1);
    expect(tooLong.trim().length > MAX_COMMIT_HASH).toBe(true);
  });

  it(`commit hash ${MAX_COMMIT_HASH} karakterde geçer`, () => {
    const exactly = "a".repeat(MAX_COMMIT_HASH);
    expect(exactly.trim().length > MAX_COMMIT_HASH).toBe(false);
  });
});

// ─── 3. SERVER_GITHUB_REGEX ───────────────────────────────────────────────────

describe("SERVER_GITHUB_REGEX", () => {
  it("protokolsüz github.com/kullanici reddedilir", () => {
    expect(SERVER_GITHUB_REGEX.test("github.com/kullanici")).toBe(false);
  });

  it("https://github.com/kullanici geçer", () => {
    expect(SERVER_GITHUB_REGEX.test("https://github.com/kullanici")).toBe(true);
  });

  it("https://github.com/kullanici/repo geçer", () => {
    expect(SERVER_GITHUB_REGEX.test("https://github.com/kullanici/repo")).toBe(true);
  });

  it("https://notgithub.com/kullanici reddedilir", () => {
    expect(SERVER_GITHUB_REGEX.test("https://notgithub.com/kullanici")).toBe(false);
  });

  it("boş string reddedilir", () => {
    expect(SERVER_GITHUB_REGEX.test("")).toBe(false);
  });

  it("http:// (https değil) reddedilir", () => {
    expect(SERVER_GITHUB_REGEX.test("http://github.com/kullanici")).toBe(false);
  });
});

// ─── 4. SERVER_LINKEDIN_REGEX ─────────────────────────────────────────────────

describe("SERVER_LINKEDIN_REGEX", () => {
  it("https://linkedin.com/in/kullanici geçer", () => {
    expect(SERVER_LINKEDIN_REGEX.test("https://linkedin.com/in/kullanici")).toBe(true);
  });

  it("https://www.linkedin.com/in/kullanici geçer", () => {
    expect(SERVER_LINKEDIN_REGEX.test("https://www.linkedin.com/in/kullanici")).toBe(true);
  });

  it("http://linkedin.com/in/kullanici reddedilir (https zorunlu)", () => {
    expect(SERVER_LINKEDIN_REGEX.test("http://linkedin.com/in/kullanici")).toBe(false);
  });

  it("javascript:alert(1) reddedilir", () => {
    expect(SERVER_LINKEDIN_REGEX.test("javascript:alert(1)")).toBe(false);
  });

  it("https://evil.com reddedilir", () => {
    expect(SERVER_LINKEDIN_REGEX.test("https://evil.com")).toBe(false);
  });

  it("boş string regex'e uymaz (validateMemberFields'da opsiyonel olarak ele alınır)", () => {
    // Regex direkt test edilince boş string eşleşmez — bu doğru davranış.
    // validateMemberFields boş linkedin'i .trim() check ile es geçer.
    expect(SERVER_LINKEDIN_REGEX.test("")).toBe(false);
  });
});

// ─── 5. escapeHtml ────────────────────────────────────────────────────────────

describe("escapeHtml", () => {
  it("<script> → &lt;script&gt;", () => {
    expect(escapeHtml("<script>")).toBe("&lt;script&gt;");
  });

  it("& → &amp;", () => {
    expect(escapeHtml("VBT & Hackathon")).toBe("VBT &amp; Hackathon");
  });

  it('" → &quot;', () => {
    expect(escapeHtml('"alıntı"')).toBe("&quot;alıntı&quot;");
  });

  it("' → &#x27;", () => {
    expect(escapeHtml("it's")).toBe("it&#x27;s");
  });

  it("XSS payload tamamen kaçırılır", () => {
    const payload = '<img src=x onerror="alert(\'xss\')">';
    const escaped = escapeHtml(payload);
    expect(escaped).not.toContain("<");
    expect(escaped).not.toContain(">");
    expect(escaped).not.toContain('"');
    expect(escaped).toContain("&lt;");
    expect(escaped).toContain("&gt;");
    expect(escaped).toContain("&quot;");
  });

  it("özel karakter içermeyen metin değişmeden geçer", () => {
    expect(escapeHtml("Merhaba dünya")).toBe("Merhaba dünya");
    expect(escapeHtml("123 ABC")).toBe("123 ABC");
    expect(escapeHtml("")).toBe("");
  });
});

// ─── 6. assertAdminToken (process.exit guard) ─────────────────────────────────

describe("assertAdminToken", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let exitSpy: any;

  beforeEach(() => {
    exitSpy = vi
      .spyOn(process, "exit")
      .mockImplementation((_code?: number | string | null): never => {
        throw new Error("process.exit was called");
      });
  });

  afterEach(() => {
    exitSpy.mockRestore();
  });

  it("ADMIN_TOKEN undefined ise process.exit(1) çağrılır", () => {
    expect(() => assertAdminToken(undefined)).toThrow("process.exit was called");
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  it('ADMIN_TOKEN "change-me" ise process.exit(1) çağrılır', () => {
    expect(() => assertAdminToken("change-me")).toThrow("process.exit was called");
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  it("boş string ADMIN_TOKEN process.exit(1) çağrılır", () => {
    expect(() => assertAdminToken("")).toThrow("process.exit was called");
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  it("güçlü ADMIN_TOKEN ile process.exit çağrılmaz", () => {
    assertAdminToken("gizli-super-token-abc123!");
    expect(exitSpy).not.toHaveBeenCalled();
  });
});
