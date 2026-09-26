"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Users, CheckCircle2, XCircle, Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Submission, STATUS_CONFIG, API_URL } from "./types";
import { formatDate } from "./utils";
import MemberCard from "./MemberCard";

export default function SubmissionRow({
  submission,
  token,
  index,
  onStatusChange,
}: {
  submission: Submission;
  token: string;
  index: number;
  onStatusChange: (id: number, status: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);
  const statusKey = (submission.status || "pending") as keyof typeof STATUS_CONFIG;
  const statusInfo = STATUS_CONFIG[statusKey] ?? STATUS_CONFIG.pending;

  const changeStatus = async (newStatus: string) => {
    setUpdating(true);
    setStatusError(null);
    try {
      const res = await fetch(`${API_URL}/api/admin/submissions/${submission.id}/status`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        onStatusChange(submission.id, newStatus);
      } else {
        setStatusError(`Durum güncellenemedi (${res.status}). Lütfen tekrar deneyin.`);
      }
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="border border-white/8 rounded-2xl overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-white/[0.025] transition-colors text-left"
      >
        <span className="text-xs text-gray-700 font-mono w-6 flex-shrink-0">
          #{submission.id}
        </span>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">{submission.teamName}</p>
          <p className="text-xs text-gray-600 mt-0.5">{formatDate(submission.submittedAt)}</p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={cn(
            "inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-semibold",
            statusInfo.bg, statusInfo.color
          )}>
            <span className={cn("w-1.5 h-1.5 rounded-full", statusInfo.dot)} />
            {statusInfo.label}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-gray-500">
            <Users className="w-3 h-3" />
            {submission.memberCount}
          </span>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-600" />
          )}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-white/5"
          >
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2 pb-3 border-b border-white/5">
                <button
                  onClick={() => changeStatus("accepted")}
                  disabled={updating || statusKey === "accepted"}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-40",
                    statusKey === "accepted"
                      ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400"
                      : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"
                  )}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {statusKey === "accepted" ? "Kabul Edildi" : "Kabul Et"}
                </button>
                <button
                  onClick={() => changeStatus("rejected")}
                  disabled={updating || statusKey === "rejected"}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-40",
                    statusKey === "rejected"
                      ? "bg-red-500/20 border border-red-500/30 text-red-400"
                      : "bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20"
                  )}
                >
                  <XCircle className="w-3.5 h-3.5" />
                  {statusKey === "rejected" ? "Reddedildi" : "Reddet"}
                </button>
                {statusKey !== "pending" && (
                  <button
                    onClick={() => changeStatus("pending")}
                    disabled={updating}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-400 hover:bg-white/10 transition-all disabled:opacity-40"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    Beklet
                  </button>
                )}
                {updating && <Loader2 className="w-3.5 h-3.5 animate-spin text-gray-500 ml-1" />}
              </div>
              {statusError && (
                <p className="text-xs text-red-400 mt-2">{statusError}</p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {submission.members.map((m, i) => (
                  <MemberCard key={i} member={m} token={token} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
