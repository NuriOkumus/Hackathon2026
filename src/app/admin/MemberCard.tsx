"use client";

import { useState } from "react";
import { Crown, Mail, Github, Linkedin, Building2, FileText, Users, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Member, API_URL, safeHref } from "./types";

export default function MemberCard({ member, token }: { member: Member; token: string }) {
  const [downloading, setDownloading] = useState(false);

  const downloadCV = async () => {
    if (!member.cvFile) return;
    setDownloading(true);
    try {
      const res = await fetch(
        `${API_URL}/api/admin/cv?path=${encodeURIComponent(member.cvFile)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) return;
      const { url } = await res.json();

      const pdfRes = await fetch(url);
      if (!pdfRes.ok) return;
      const blob = await pdfRes.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = `${member.name.replace(/\s+/g, "_")}_cv.pdf`;
      a.click();
      URL.revokeObjectURL(objectUrl);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div
      className={cn(
        "rounded-xl border p-4 space-y-3 text-sm",
        member.role === "captain"
          ? "border-primary/20 bg-primary/[0.04]"
          : "border-white/8 bg-white/[0.02]"
      )}
    >
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0",
            member.role === "captain"
              ? "bg-primary/20 border border-primary/30"
              : "bg-white/8 border border-white/10"
          )}
        >
          {member.role === "captain" ? (
            <Crown className="w-3 h-3 text-primary" />
          ) : (
            <Users className="w-3 h-3 text-gray-500" />
          )}
        </div>
        <span className="font-semibold text-white truncate">{member.name}</span>
        {member.role === "captain" && (
          <span className="text-[10px] text-primary/60 font-medium ml-auto flex-shrink-0">
            Kaptan
          </span>
        )}
      </div>

      <div className="space-y-1.5">
        <a
          href={`mailto:${member.email}`}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <Mail className="w-3 h-3 flex-shrink-0 text-gray-600" />
          <span className="truncate text-xs">{member.email}</span>
        </a>

        <a
          href={member.github}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <Github className="w-3 h-3 flex-shrink-0 text-gray-600" />
          <span className="truncate text-xs">
            {member.github.replace("https://github.com/", "@")}
          </span>
        </a>

        {member.linkedin && (
          <a
            href={safeHref(member.linkedin)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <Linkedin className="w-3 h-3 flex-shrink-0 text-gray-600" />
            <span className="truncate text-xs">LinkedIn</span>
          </a>
        )}

        <div className="flex items-start gap-2 text-gray-500">
          <Building2 className="w-3 h-3 flex-shrink-0 text-gray-600 mt-0.5" />
          <span className="text-xs leading-tight">{member.universityDept}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap pt-1">
        {member.phone && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[11px] text-gray-400">
            {member.phone}
          </span>
        )}

        {member.cvFile && (
          <button
            onClick={downloadCV}
            disabled={downloading}
            className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-[11px] text-primary hover:bg-primary/20 transition-all disabled:opacity-50"
          >
            {downloading ? (
              <Loader2 className="w-2.5 h-2.5 animate-spin" />
            ) : (
              <FileText className="w-2.5 h-2.5" />
            )}
            CV
          </button>
        )}
      </div>
    </div>
  );
}
