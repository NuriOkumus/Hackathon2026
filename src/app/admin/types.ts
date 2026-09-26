export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Member {
  role: string;
  name: string;
  email: string;
  phone?: string | null;
  github: string;
  linkedin?: string | null;
  universityDept: string;
  cvFile?: string | null;
}

export interface Submission {
  id: number;
  teamName: string;
  memberCount: number;
  experience?: string | null;
  source?: string | null;
  notes?: string | null;
  status: string;
  submittedAt: string;
  acceptanceEmailSentAt?: string | null;
  members: Member[];
}

export interface Deliverable {
  id: number;
  teamName: string;
  teamEmail: string;
  repoUrl: string;
  commitHash: string;
  projectDescription: string;
  presentationFile?: string | null;
  submittedAt: string;
}

export type AdminTab = "applications" | "deliverables";
export type StatusFilter = "all" | "pending" | "accepted" | "rejected";

// ─── Constants ────────────────────────────────────────────────────────────────

export const safeHref = (url: string | null | undefined) =>
  url?.match(/^https?:\/\//) ? url : undefined;

export const STATUS_CONFIG = {
  pending: { label: "Beklemede", color: "text-gray-400", bg: "bg-gray-500/10 border-gray-500/20", dot: "bg-gray-400" },
  accepted: { label: "Kabul", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", dot: "bg-emerald-400" },
  rejected: { label: "Red", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", dot: "bg-red-400" },
} as const;

export const EXPERIENCE_TR: Record<string, string> = {
  none: "İlk defa",
  beginner: "1-2 kez",
  intermediate: "3-5 kez",
  advanced: "5+ kez",
};

export const SOURCE_TR: Record<string, string> = {
  social_media: "Sosyal Medya",
  university: "Üniversite / Kulüp",
  friends: "Arkadaş",
  vbt: "VBT",
  other: "Diğer",
};
