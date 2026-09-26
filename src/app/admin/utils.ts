import { Submission, EXPERIENCE_TR, SOURCE_TR } from "./types";

export function formatDate(iso: string) {
  return new Date(iso).toLocaleString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function exportCSV(submissions: Submission[]) {
  const header = [
    "Sıra",
    "Takım Adı",
    "Deneyim",
    "Kaynak",
    "Not",
    "Rol",
    "Ad Soyad",
    "E-posta",
    "Telefon",
    "GitHub",
    "LinkedIn",
    "Üniversite / Bölüm",
    "CV",
    "Başvuru Tarihi",
  ];

  const rows: string[][] = [header];

  submissions.forEach((s, si) => {
    s.members.forEach((m) => {
      rows.push([
        String(si + 1),
        s.teamName,
        EXPERIENCE_TR[s.experience ?? ""] ?? (s.experience ?? ""),
        SOURCE_TR[s.source ?? ""] ?? (s.source ?? ""),
        s.notes ?? "",
        m.role === "captain" ? "Kaptan" : "Üye",
        m.name,
        m.email,
        m.phone ?? "",
        m.github,
        m.linkedin ?? "",
        m.universityDept,
        m.cvFile ? "Var" : "Yok",
        formatDate(s.submittedAt),
      ]);
    });
  });

  const csv =
    "\uFEFF" + // BOM for Excel
    rows
      .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
      .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `hackathon-basvurular-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
