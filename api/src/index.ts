import "dotenv/config";
import { Hono } from "hono";
import type { Context } from "hono";
import {
  escapeHtml,
  validateMemberFields,
  SERVER_GITHUB_REGEX,
  MAX_TEAM_NAME,
  MAX_NOTES,
  MAX_PROJECT_DESCRIPTION,
  MAX_COMMIT_HASH,
  assertAdminToken,
} from "./validation.js";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// ─── Config ───────────────────────────────────────────────────────────────────

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
assertAdminToken(ADMIN_TOKEN);
const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "";
const PORT = parseInt(process.env.PORT ?? "3001", 10);
const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_CV = process.env.R2_BUCKET_CV ?? "cvs";
const R2_BUCKET_DELIVERABLES = process.env.R2_BUCKET_DELIVERABLES ?? "deliverables";
const FROM = "VBT Hackathon <noreply@vbthackathon.com.tr>";

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("❌  SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY .env dosyasında tanımlı olmalı!");
  process.exit(1);
}
if (!CF_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
  console.warn("⚠️  R2 env vars eksik — dosya upload'ları çalışmayacak.");
}

// ─── Supabase client (DB only) ────────────────────────────────────────────────

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ─── R2 client ────────────────────────────────────────────────────────────────

const r2 = CF_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY
  ? new S3Client({
      region: "auto",
      endpoint: `https://${CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
      },
    })
  : null;

async function r2Upload(bucket: string, key: string, body: Buffer, contentType: string) {
  if (!r2) throw new Error("R2 yapılandırılmamış");
  await r2.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: contentType }));
}

async function r2SignedUrl(bucket: string, key: string, expiresIn = 120): Promise<string> {
  if (!r2) throw new Error("R2 yapılandırılmamış");
  return getSignedUrl(r2, new GetObjectCommand({ Bucket: bucket, Key: key }), { expiresIn });
}

// ─── Resend client ────────────────────────────────────────────────────────────

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

async function sendMail(to: string, subject: string, html: string) {
  if (!resend) return;
  try {
    await resend.emails.send({ from: FROM, to, subject, html });
  } catch (err) {
    console.error("Mail gönderilemedi:", err);
  }
}

// ─── Email templates ──────────────────────────────────────────────────────────

function wrap(content: string) {
  return `<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>VBT Hackathon 2026</title></head>
<body style="margin:0;padding:0;background:#05050a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#e2e8f0">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#05050a;padding:40px 0">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="background:#0a0a14;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;max-width:560px;width:100%">
      <tr><td style="background:linear-gradient(135deg,rgba(34,211,238,0.12),rgba(249,115,22,0.06));padding:28px 32px;border-bottom:1px solid rgba(255,255,255,0.06)">
        <p style="margin:0;font-size:13px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#22d3ee">VBT Hackathon 2026</p>
        <p style="margin:4px 0 0;font-size:11px;color:rgba(255,255,255,0.3)">Akıllı Şehirler · 13–14 Mayıs 2026</p>
      </td></tr>
      <tr><td style="padding:32px">${content}</td></tr>
      <tr><td style="padding:20px 32px;border-top:1px solid rgba(255,255,255,0.05);background:rgba(255,255,255,0.015)">
        <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.25);line-height:1.6">Sorularınız için <a href="mailto:veribilimimsku@gmail.com" style="color:#22d3ee;text-decoration:none">veribilimimsku@gmail.com</a> adresine yazabilirsiniz.<br>VBT — Veri Bilimi Topluluğu, Muğla Sıtkı Koçman Üniversitesi</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

function mailApplicationReceived(captainName: string, teamName: string) {
  return wrap(`
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#fff">Başvurunuz Alındı ✓</h1>
    <p style="margin:0 0 24px;font-size:13px;color:rgba(255,255,255,0.4)">Merhaba ${captainName},</p>
    <p style="margin:0 0 16px;font-size:14px;color:rgba(255,255,255,0.7);line-height:1.7"><strong style="color:#fff">${teamName}</strong> takımının başvurusu başarıyla alındı. Ekibimiz başvuruları inceleyecek ve sonucu bu e-posta adresine bildireceğiz.</p>
    <table cellpadding="0" cellspacing="0" style="width:100%;background:rgba(34,211,238,0.05);border:1px solid rgba(34,211,238,0.15);border-radius:10px;margin:24px 0">
      <tr><td style="padding:16px 20px">
        <p style="margin:0 0 4px;font-size:11px;color:rgba(34,211,238,0.6);text-transform:uppercase;letter-spacing:0.1em">Etkinlik</p>
        <p style="margin:0;font-size:14px;color:#fff;font-weight:600">13–14 Mayıs 2026 · MSKÜ AKM</p>
      </td></tr>
    </table>
    <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.4)">Başarılar dileriz!</p>
  `);
}

function mailApplicationAccepted(captainName: string, teamName: string) {
  return wrap(`
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#fff">Hackathon'a Kabul Edildiniz! 🎉</h1>
    <p style="margin:0 0 24px;font-size:13px;color:rgba(255,255,255,0.4)">Merhaba ${captainName},</p>
    <p style="margin:0 0 16px;font-size:14px;color:rgba(255,255,255,0.7);line-height:1.7">Harika haber! <strong style="color:#fff">${teamName}</strong> takımı VBT Hackathon 2026'ya kabul edildi. Sizi aramızda görmekten büyük mutluluk duyacağız.</p>
    <table cellpadding="0" cellspacing="0" style="width:100%;background:rgba(16,185,129,0.06);border:1px solid rgba(16,185,129,0.2);border-radius:10px;margin:24px 0">
      <tr><td style="padding:16px 20px">
        <p style="margin:0 0 4px;font-size:11px;color:rgba(16,185,129,0.7);text-transform:uppercase;letter-spacing:0.1em">Tarih & Yer</p>
        <p style="margin:0;font-size:14px;color:#fff;font-weight:600">13–14 Mayıs 2026 · MSKÜ Atatürk Kültür Merkezi</p>
      </td></tr>
    </table>
    <p style="margin:0 0 8px;font-size:14px;color:rgba(255,255,255,0.7);line-height:1.7">Etkinlik detayları ve program bilgileri yakında iletilecektir. Aklınıza takılan sorular için bize ulaşabilirsiniz.</p>
    <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.4)">Görüşmek üzere!</p>
  `);
}

function mailApplicationRejected(captainName: string, teamName: string) {
  return wrap(`
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#fff">Başvuru Sonucunuz</h1>
    <p style="margin:0 0 24px;font-size:13px;color:rgba(255,255,255,0.4)">Merhaba ${captainName},</p>
    <p style="margin:0 0 16px;font-size:14px;color:rgba(255,255,255,0.7);line-height:1.7"><strong style="color:#fff">${teamName}</strong> takımının başvurusunu değerlendirdik. Bu yıl kontenjan kısıtlı olduğundan ne yazık ki sizinle birlikte olamayacağız.</p>
    <p style="margin:0 0 16px;font-size:14px;color:rgba(255,255,255,0.7);line-height:1.7">Gösterdiğiniz ilgi ve emek için teşekkür eder, gelecekteki etkinliklerimizde görüşmeyi umut ederiz.</p>
    <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.4)">VBT ekibi olarak başarılar dileriz.</p>
  `);
}

function mailDeliverableReceived(teamName: string, teamEmail: string) {
  return wrap(`
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#fff">Teslim Alındı ✓</h1>
    <p style="margin:0 0 24px;font-size:13px;color:rgba(255,255,255,0.4)">Merhaba ${teamName} ekibi,</p>
    <p style="margin:0 0 16px;font-size:14px;color:rgba(255,255,255,0.7);line-height:1.7">Projeniz başarıyla teslim alındı. Jüri değerlendirme sürecinde sizinle iletişime geçilecektir.</p>
    <table cellpadding="0" cellspacing="0" style="width:100%;background:rgba(249,115,22,0.05);border:1px solid rgba(249,115,22,0.15);border-radius:10px;margin:24px 0">
      <tr><td style="padding:16px 20px">
        <p style="margin:0 0 4px;font-size:11px;color:rgba(249,115,22,0.7);text-transform:uppercase;letter-spacing:0.1em">Teslim e-postası</p>
        <p style="margin:0;font-size:14px;color:#fff;font-weight:600">${teamEmail}</p>
      </td></tr>
    </table>
    <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.4)">Ödül töreninde görüşmek üzere!</p>
  `);
}

// ─── Hono app ─────────────────────────────────────────────────────────────────

const ALLOWED_ORIGINS = [
  ...(process.env.NODE_ENV !== "production" ? ["http://localhost:3000"] : []),
  "https://vbthackathon.com.tr",
];

const app = new Hono();

app.use(
  "*",
  cors({
    origin: ALLOWED_ORIGINS,
    allowMethods: ["GET", "POST", "PATCH", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
);

function isAdmin(authHeader: string | undefined): boolean {
  return authHeader === `Bearer ${ADMIN_TOKEN}`;
}

// ─── Rate limiter (in-memory, per IP) ─────────────────────────────────────────

interface RateEntry { count: number; resetAt: number; }
const rateLimits = new Map<string, RateEntry>();

function checkRateLimit(ip: string, key: string, max: number, windowMs: number): boolean {
  const mapKey = `${key}:${ip}`;
  const now = Date.now();
  const entry = rateLimits.get(mapKey);
  if (!entry || now > entry.resetAt) {
    rateLimits.set(mapKey, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= max) return false;
  entry.count++;
  return true;
}

// Eski kayıtları her 10 dakikada temizle
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimits) {
    if (now > entry.resetAt) rateLimits.delete(key);
  }
}, 10 * 60 * 1000).unref();

function getClientIp(c: Context): string {
  return (
    c.req.header("x-forwarded-for")?.split(",")[0].trim() ||
    c.env?.incoming?.socket?.remoteAddress ||
    "unknown"
  );
}

// ─── Health ───────────────────────────────────────────────────────────────────

app.get("/health", (c) =>
  c.json({ status: "ok", time: new Date().toISOString() })
);

// ─── POST /api/apply ─────────────────────────────────────────────────────────

interface MemberData {
  name: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  universityDept: string;
}

app.post("/api/apply", async (c) => {
  const ip = getClientIp(c);
  if (!checkRateLimit(ip, "apply", 5, 60 * 60 * 1000)) {
    return c.json({ success: false, message: "Çok fazla istek gönderdiniz. Lütfen bir saat sonra tekrar deneyin." }, 429);
  }

  try {
    const formData = await c.req.formData();

    const teamName = formData.get("teamName") as string | null;
    const memberCountRaw = formData.get("memberCount") as string | null;
    const membersRaw = formData.get("members") as string | null;
    const experience = (formData.get("experience") as string | null) ?? "";
    const source = (formData.get("source") as string | null) ?? "";
    const notes = (formData.get("notes") as string | null) ?? "";

    if (!teamName?.trim() || !memberCountRaw || !membersRaw) {
      return c.json({ success: false, message: "Eksik veri gönderildi." }, 400);
    }

    if (teamName.trim().length > MAX_TEAM_NAME) {
      return c.json({ success: false, message: "Takım adı çok uzun." }, 400);
    }
    if (notes && notes.length > MAX_NOTES) {
      return c.json({ success: false, message: "Notlar çok uzun." }, 400);
    }

    const memberCount = parseInt(memberCountRaw, 10);
    if (isNaN(memberCount) || memberCount < 3 || memberCount > 5) {
      return c.json({ success: false, message: "Geçersiz üye sayısı." }, 400);
    }

    let membersData: MemberData[];
    try {
      membersData = JSON.parse(membersRaw);
    } catch {
      return c.json({ success: false, message: "Üye verisi hatalı." }, 400);
    }

    if (!Array.isArray(membersData) || membersData.length !== memberCount) {
      return c.json({ success: false, message: "Üye sayısı uyuşmuyor." }, 400);
    }

    for (const m of membersData) {
      const err = validateMemberFields(m);
      if (err) return c.json({ success: false, message: err }, 400);
    }

    // 1 — Insert submission, get ID back
    const { data: submission, error: subError } = await supabase
      .from("submissions")
      .insert({
        team_name: teamName.trim(),
        member_count: memberCount,
        experience: experience || null,
        source: source || null,
        notes: notes || null,
      })
      .select("id")
      .single();

    if (subError || !submission) {
      console.error("Submission insert hatası:", subError);
      return c.json({ success: false, message: "Veritabanı hatası." }, 500);
    }

    const submissionId = submission.id as number;

    // 2 — Upload CVs to R2
    const cvPaths: Record<number, string> = {};

    for (let i = 0; i < memberCount; i++) {
      const cvFile = formData.get(`cv_${i}`) as File | null;
      if (!cvFile || cvFile.size === 0) continue;
      if (cvFile.type !== "application/pdf") continue;
      if (cvFile.size > 5 * 1024 * 1024) continue;

      const safeName = cvFile.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const storagePath = `${submissionId}/member${i}_${safeName}`;
      const buffer = Buffer.from(await cvFile.arrayBuffer());

      try {
        await r2Upload(R2_BUCKET_CV, storagePath, buffer, "application/pdf");
        cvPaths[i] = storagePath;
      } catch (err) {
        console.error(`CV upload hatası (üye ${i}):`, err);
      }
    }

    // 3 — Insert members
    const membersToInsert = membersData.map((m, i) => ({
      submission_id: submissionId,
      role: i === 0 ? "captain" : "member",
      name: m.name,
      email: m.email,
      phone: m.phone || null,
      github: m.github,
      linkedin: m.linkedin || null,
      university_dept: m.universityDept,
      cv_file: cvPaths[i] ?? null,
    }));

    const { error: membersError } = await supabase
      .from("members")
      .insert(membersToInsert);

    if (membersError) {
      console.error("Members insert hatası:", membersError);
      return c.json({ success: false, message: "Veritabanı hatası." }, 500);
    }

    console.log(
      `✅ Başvuru #${submissionId} — Takım: "${teamName.trim()}" (${memberCount} üye)`
    );

    const captain = membersData[0];
    sendMail(
      captain.email,
      "VBT Hackathon 2026 — Başvurunuz Alındı",
      mailApplicationReceived(escapeHtml(captain.name.split(" ")[0]), escapeHtml(teamName.trim()))
    );

    return c.json({ success: true, message: "Başvurunuz başarıyla alındı." });
  } catch (err) {
    console.error("Beklenmeyen hata:", err);
    return c.json({ success: false, message: "Sunucu hatası oluştu." }, 500);
  }
});

// ─── GET /api/admin/submissions ───────────────────────────────────────────────

app.get("/api/admin/submissions", async (c) => {
  if (!isAdmin(c.req.header("Authorization"))) {
    return c.json({ success: false, message: "Yetkisiz erişim." }, 401);
  }

  const { data, error } = await supabase
    .from("submissions")
    .select(`
      id,
      team_name,
      member_count,
      experience,
      source,
      notes,
      status,
      submitted_at,
      acceptance_email_sent_at,
      members (
        role, name, email, phone, github, linkedin,
        university_dept, cv_file
      )
    `)
    .order("id", { ascending: false });

  if (error) {
    console.error("Admin submissions hatası:", error);
    return c.json({ success: false, message: "Veriler alınamadı." }, 500);
  }

  const submissions = (data ?? []).map((s) => ({
    id: s.id,
    teamName: s.team_name,
    memberCount: s.member_count,
    experience: s.experience,
    source: s.source,
    notes: s.notes,
    status: s.status ?? "pending",
    submittedAt: s.submitted_at,
    acceptanceEmailSentAt: s.acceptance_email_sent_at ?? null,
    members: (s.members as Array<Record<string, unknown>>).map((m) => ({
      role: m.role,
      name: m.name,
      email: m.email,
      phone: m.phone,
      github: m.github,
      linkedin: m.linkedin,
      universityDept: m.university_dept,
      cvFile: m.cv_file,
    })),
  }));

  return c.json({ success: true, total: submissions.length, submissions });
});

// ─── GET /api/admin/cv — returns a short-lived signed URL ────────────────────

app.get("/api/admin/cv", async (c) => {
  if (!isAdmin(c.req.header("Authorization"))) {
    return c.json({ success: false, message: "Yetkisiz erişim." }, 401);
  }

  const filePath = c.req.query("path");
  if (!filePath) {
    return c.json({ success: false, message: "path parametresi gerekli." }, 400);
  }

  // Basic path traversal guard
  if (filePath.includes("..") || filePath.startsWith("/")) {
    return c.json({ success: false, message: "Geçersiz dosya yolu." }, 400);
  }

  try {
    const url = await r2SignedUrl(R2_BUCKET_CV, filePath);
    return c.json({ success: true, url });
  } catch {
    return c.json({ success: false, message: "Dosya bulunamadı." }, 404);
  }
});

// ─── PATCH /api/admin/submissions/:id/status ──────────────────────────────────

app.patch("/api/admin/submissions/:id/status", async (c) => {
  if (!isAdmin(c.req.header("Authorization"))) {
    return c.json({ success: false, message: "Yetkisiz erişim." }, 401);
  }

  const id = Number(c.req.param("id"));
  if (!id || isNaN(id)) {
    return c.json({ success: false, message: "Geçersiz ID." }, 400);
  }

  const body = await c.req.json<{ status: string }>();
  const validStatuses = ["pending", "accepted", "rejected"];

  if (!body.status || !validStatuses.includes(body.status)) {
    return c.json({ success: false, message: "Geçersiz durum. pending, accepted veya rejected olmalı." }, 400);
  }

  const { error } = await supabase
    .from("submissions")
    .update({ status: body.status })
    .eq("id", id);

  if (error) {
    console.error("Status güncelleme hatası:", error);
    return c.json({ success: false, message: "Güncelleme başarısız." }, 500);
  }

  // Kaptanın e-posta ve ismini çek, mail gönder
  const { data: sub } = await supabase
    .from("submissions")
    .select(`team_name, members!inner(name, email, role)`)
    .eq("id", id)
    .eq("members.role", "captain")
    .maybeSingle();

  console.log(`📋 Başvuru #${id} → ${body.status}`);
  return c.json({ success: true, message: `Durum '${body.status}' olarak güncellendi.` });
});

// ─── POST /api/admin/send-acceptance-emails ────────────────────────────────────

app.post("/api/admin/send-acceptance-emails", async (c) => {
  if (!isAdmin(c.req.header("Authorization"))) {
    return c.json({ success: false, message: "Yetkisiz erişim." }, 401);
  }

  // 1. Kabul edilmiş ama henüz mail gönderilmemiş başvurular
  // 2. Önceden reddedilmiş ama henüz mail gönderilmemiş başvurular
  // 3. Hâlâ beklemede olan başvurular (otomatik reddedilecek)
  // Not: acceptance_email_sent_at NULL = henüz hiç karar maili gitmemiş demek
  const [acceptedRes, preRejectedRes, pendingRes] = await Promise.all([
    supabase
      .from("submissions")
      .select(`id, team_name, members!inner(name, email, role)`)
      .eq("status", "accepted")
      .is("acceptance_email_sent_at", null)
      .eq("members.role", "captain"),
    supabase
      .from("submissions")
      .select(`id, team_name, members!inner(name, email, role)`)
      .eq("status", "rejected")
      .is("acceptance_email_sent_at", null)
      .eq("members.role", "captain"),
    supabase
      .from("submissions")
      .select(`id, team_name, members!inner(name, email, role)`)
      .eq("status", "pending")
      .eq("members.role", "captain"),
  ]);

  if (acceptedRes.error || preRejectedRes.error || pendingRes.error) {
    console.error("Toplu mail sorgusu hatası:", acceptedRes.error ?? preRejectedRes.error ?? pendingRes.error);
    return c.json({ success: false, message: "Veriler alınamadı." }, 500);
  }

  const toAccept = acceptedRes.data ?? [];
  const toReject = [...(preRejectedRes.data ?? []), ...(pendingRes.data ?? [])];

  if (toAccept.length === 0 && toReject.length === 0) {
    return c.json({ success: true, sentAccepted: 0, sentRejected: 0, message: "Gönderilecek mail yok." });
  }

  const now = new Date().toISOString();
  const failed: number[] = [];

  type CapMember = { name: string; email: string };

  function collectFailures(
    results: PromiseSettledResult<void>[],
    source: Array<{ id: unknown }>,
    label: string
  ) {
    results.forEach((r, i) => {
      if (r.status === "rejected") {
        console.error(`${label} gönderilemedi #${source[i].id}:`, r.reason);
        failed.push(source[i].id as number);
      }
    });
    return results.filter((r) => r.status === "fulfilled").length;
  }

  // Kabul mailleri — paralel gönder
  const acceptResults = await Promise.allSettled(
    toAccept.map(async (sub) => {
      const captain = (sub.members as CapMember[])[0];
      if (!captain) throw new Error("kaptan yok");
      await Promise.all([
        sendMail(
          captain.email,
          "VBT Hackathon 2026 — Kabul Edildiniz! 🎉",
          mailApplicationAccepted(escapeHtml(captain.name.split(" ")[0]), escapeHtml(sub.team_name))
        ),
        supabase.from("submissions").update({ acceptance_email_sent_at: now }).eq("id", sub.id),
      ]);
    })
  );

  // Red mailleri (pending → rejected) — paralel gönder
  const rejectResults = await Promise.allSettled(
    toReject.map(async (sub) => {
      const captain = (sub.members as CapMember[])[0];
      if (!captain) throw new Error("kaptan yok");
      await Promise.all([
        sendMail(
          captain.email,
          "VBT Hackathon 2026 — Başvuru Sonucunuz",
          mailApplicationRejected(escapeHtml(captain.name.split(" ")[0]), escapeHtml(sub.team_name))
        ),
        supabase.from("submissions").update({ status: "rejected", acceptance_email_sent_at: now }).eq("id", sub.id),
      ]);
    })
  );

  const sentAccepted = collectFailures(acceptResults, toAccept, "Kabul maili");
  const sentRejected = collectFailures(rejectResults, toReject, "Red maili");

  const parts = [];
  if (sentAccepted > 0) parts.push(`${sentAccepted} kabul`);
  if (sentRejected > 0) parts.push(`${sentRejected} red`);
  const summary = parts.length ? `${parts.join(", ")} maili gönderildi` : "Mail gönderilmedi";

  console.log(`📧 Toplu mail: ${sentAccepted} kabul, ${sentRejected} red, ${failed.length} başarısız`);
  return c.json({
    success: true,
    sentAccepted,
    sentRejected,
    failed: failed.length,
    message: `${summary}${failed.length > 0 ? `, ${failed.length} başarısız` : ""}.`,
  });
});

// ─── POST /api/submit ─────────────────────────────────────────────────────────

app.post("/api/submit", async (c) => {
  const ip = getClientIp(c);
  if (!checkRateLimit(ip, "submit", 10, 60 * 60 * 1000)) {
    return c.json({ success: false, message: "Çok fazla istek gönderdiniz. Lütfen bir saat sonra tekrar deneyin." }, 429);
  }

  try {
    const formData = await c.req.formData();

    const teamName = formData.get("teamName") as string | null;
    const teamEmail = formData.get("teamEmail") as string | null;
    const repoUrl = formData.get("repoUrl") as string | null;
    const commitHash = formData.get("commitHash") as string | null;
    const projectDescription = formData.get("projectDescription") as string | null;

    if (!teamName?.trim() || !teamEmail?.trim() || !repoUrl?.trim() || !commitHash?.trim() || !projectDescription?.trim()) {
      return c.json({ success: false, message: "Tüm alanlar zorunludur." }, 400);
    }

    if (teamName.trim().length > MAX_TEAM_NAME) {
      return c.json({ success: false, message: "Takım adı çok uzun." }, 400);
    }
    if (projectDescription.trim().length > MAX_PROJECT_DESCRIPTION) {
      return c.json({ success: false, message: "Proje açıklaması çok uzun." }, 400);
    }
    if (commitHash.trim().length > MAX_COMMIT_HASH) {
      return c.json({ success: false, message: "Commit hash çok uzun." }, 400);
    }

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(teamEmail)) {
      return c.json({ success: false, message: "Geçerli bir e-posta adresi giriniz." }, 400);
    }

    // Validate repo URL
    if (!SERVER_GITHUB_REGEX.test(repoUrl)) {
      return c.json({ success: false, message: "Geçerli bir GitHub repo URL'si giriniz." }, 400);
    }

    // Verify teamEmail belongs to a registered captain
    const { data: captainCheck } = await supabase
      .from("members")
      .select("id")
      .eq("email", teamEmail.trim())
      .eq("role", "captain")
      .maybeSingle();

    if (!captainCheck) {
      return c.json({ success: false, message: "Bu e-posta adresi kayıtlı bir takım kaptanına ait değil." }, 403);
    }

    const presentationFile = formData.get("presentation") as File | null;

    if (!presentationFile || presentationFile.size === 0) {
      return c.json({ success: false, message: "Sunum dosyası zorunludur." }, 400);
    }

    // Validate presentation (max 200MB, PDF/PPTX)
    const presAllowed = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.ms-powerpoint",
    ];
    if (!presAllowed.includes(presentationFile.type)) {
      return c.json({ success: false, message: "Sunum PDF veya PPTX formatında olmalıdır." }, 400);
    }
    if (presentationFile.size > 200 * 1024 * 1024) {
      return c.json({ success: false, message: "Sunum dosyası en fazla 200MB olabilir." }, 400);
    }

    // 1 — Upsert: aynı e-posta ile önceki teslim varsa güncelle (submitted_at dahil), yoksa yeni kayıt
    const { data: upserted, error: upsertError } = await supabase
      .from("deliverables")
      .upsert(
        {
          team_email: teamEmail.trim(),
          team_name: teamName.trim(),
          repo_url: repoUrl.trim(),
          commit_hash: commitHash.trim(),
          project_description: projectDescription.trim(),
          submitted_at: new Date().toISOString(),
        },
        { onConflict: "team_email" }
      )
      .select("id")
      .single();

    if (upsertError || !upserted) {
      console.error("Deliverable upsert hatası:", upsertError);
      return c.json({ success: false, message: "Veritabanı hatası." }, 500);
    }

    const deliverableId = upserted.id as number;
    console.log(`📦 Teslim upsert #${deliverableId} — ${teamEmail.trim()}`);

    // 2 — Upload presentation to R2
    const presExt = presentationFile.name.split(".").pop() ?? "pdf";
    const presPath = `${deliverableId}/presentation.${presExt}`;
    const presBuffer = Buffer.from(await presentationFile.arrayBuffer());
    let presOk = false;
    try {
      await r2Upload(R2_BUCKET_DELIVERABLES, presPath, presBuffer, presentationFile.type);
      presOk = true;
    } catch (err) {
      console.error("Sunum upload hatası:", err);
    }

    // 3 — Update record with file paths
    await supabase
      .from("deliverables")
      .update({
        presentation_file: presOk ? presPath : null,
      })
      .eq("id", deliverableId);

    console.log(
      `📦 Teslim #${deliverableId} — Takım: "${teamName.trim()}" — Repo: ${repoUrl.trim()}`
    );

    sendMail(
      teamEmail.trim(),
      `VBT Hackathon 2026 — Teslim Alındı ✓`,
      mailDeliverableReceived(escapeHtml(teamName.trim()), escapeHtml(teamEmail.trim()))
    );

    return c.json({ success: true, message: "Projeniz başarıyla teslim edildi!" });
  } catch (err) {
    console.error("Beklenmeyen hata:", err);
    return c.json({ success: false, message: "Sunucu hatası oluştu." }, 500);
  }
});

// ─── GET /api/admin/deliverables ──────────────────────────────────────────────

app.get("/api/admin/deliverables", async (c) => {
  if (!isAdmin(c.req.header("Authorization"))) {
    return c.json({ success: false, message: "Yetkisiz erişim." }, 401);
  }

  const { data, error } = await supabase
    .from("deliverables")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error("Admin deliverables hatası:", error);
    return c.json({ success: false, message: "Veriler alınamadı." }, 500);
  }

  const deliverables = (data ?? []).map((d) => ({
    id: d.id,
    teamName: d.team_name,
    teamEmail: d.team_email,
    repoUrl: d.repo_url,
    commitHash: d.commit_hash,
    projectDescription: d.project_description,
    presentationFile: d.presentation_file,
    submittedAt: d.submitted_at,
  }));

  return c.json({ success: true, total: deliverables.length, deliverables });
});

// ─── GET /api/admin/deliverable-file ──────────────────────────────────────────

app.get("/api/admin/deliverable-file", async (c) => {
  if (!isAdmin(c.req.header("Authorization"))) {
    return c.json({ success: false, message: "Yetkisiz erişim." }, 401);
  }

  const filePath = c.req.query("path");
  if (!filePath) {
    return c.json({ success: false, message: "path parametresi gerekli." }, 400);
  }

  if (filePath.includes("..") || filePath.startsWith("/")) {
    return c.json({ success: false, message: "Geçersiz dosya yolu." }, 400);
  }

  try {
    const url = await r2SignedUrl(R2_BUCKET_DELIVERABLES, filePath);
    return c.json({ success: true, url });
  } catch {
    return c.json({ success: false, message: "Dosya bulunamadı." }, 404);
  }
});

// ─── Start ────────────────────────────────────────────────────────────────────

serve({ fetch: app.fetch, port: PORT, hostname: "0.0.0.0" }, () => {
  console.log(`🚀 Hackathon API → http://localhost:${PORT}`);
  console.log(`   Supabase  → ${SUPABASE_URL}`);
  console.log(`   R2        → ${CF_ACCOUNT_ID}.r2.cloudflarestorage.com`);
  console.log(`   Token    → ✓`);
});
