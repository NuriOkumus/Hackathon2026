"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, XCircle, Clock, AlertTriangle, Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Submission, API_URL } from "./types";

interface Props {
  submissions: Submission[];
  token: string;
  onClose: () => void;
  onDone: (result: { message: string; isError: boolean; updated: Submission[] }) => void;
}

export default function FinalReviewModal({ submissions, token, onClose, onDone }: Props) {
  const [sending, setSending] = useState(false);

  const accepted = submissions.filter((s) => s.status === "accepted" && !s.acceptanceEmailSentAt);
  const preRejected = submissions.filter((s) => s.status === "rejected" && !s.acceptanceEmailSentAt);
  const pending = submissions.filter((s) => (s.status || "pending") === "pending");
  const alreadyNotified = submissions.filter((s) => !!s.acceptanceEmailSentAt);

  const totalToSend = accepted.length + preRejected.length + pending.length;

  const handleConfirm = async () => {
    setSending(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/send-acceptance-emails`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const now = new Date().toISOString();
      if (res.ok) {
        const updated = submissions.map((s) => {
          if (s.status === "accepted" && !s.acceptanceEmailSentAt)
            return { ...s, acceptanceEmailSentAt: now };
          if (s.status === "rejected" && !s.acceptanceEmailSentAt)
            return { ...s, acceptanceEmailSentAt: now };
          if ((s.status || "pending") === "pending")
            return { ...s, status: "rejected", acceptanceEmailSentAt: now };
          return s;
        });
        onDone({ message: data.message ?? "Mailler gönderildi.", isError: false, updated });
      } else {
        onDone({ message: `Hata: ${data.message ?? "Bilinmeyen hata."}`, isError: true, updated: submissions });
      }
    } catch {
      onDone({ message: "API'ye ulaşılamadı.", isError: true, updated: submissions });
    } finally {
      setSending(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={!sending ? onClose : undefined}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg max-h-[90vh] flex flex-col bg-[#0a0a14] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/8 flex-shrink-0">
            <div>
              <h2 className="text-base font-bold text-white">Son Kontrol</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {totalToSend > 0
                  ? `${totalToSend} takıma mail gönderilecek`
                  : "Gönderilecek mail yok"}
              </p>
            </div>
            {!sending && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-gray-600 hover:text-white hover:bg-white/8 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 min-h-0">
            {/* Warning */}
            {totalToSend > 0 && (
              <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-amber-500/8 border border-amber-500/20">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-300/80 leading-relaxed">
                  Bu işlem geri alınamaz. Tüm mailler aynı anda gönderilecek.
                </p>
              </div>
            )}

            {/* Accepted */}
            {accepted.length > 0 && (
              <ReviewSection
                icon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                title="Kabul Edildi"
                count={accepted.length}
                note="Tebrik e-postası gönderilecek"
                color="emerald"
                items={accepted}
              />
            )}

            {/* Pre-rejected */}
            {preRejected.length > 0 && (
              <ReviewSection
                icon={<XCircle className="w-3.5 h-3.5 text-red-400" />}
                title="Reddedildi"
                count={preRejected.length}
                note="Red e-postası gönderilecek"
                color="red"
                items={preRejected}
              />
            )}

            {/* Pending → auto-reject */}
            {pending.length > 0 && (
              <ReviewSection
                icon={<Clock className="w-3.5 h-3.5 text-gray-400" />}
                title="Beklemede → Reddedilecek"
                count={pending.length}
                note="Otomatik reddedilip red e-postası gönderilecek"
                color="gray"
                items={pending}
              />
            )}

            {/* Already notified */}
            {alreadyNotified.length > 0 && (
              <p className="text-xs text-gray-600 text-center">
                {alreadyNotified.length} takıma daha önce mail gönderildi — tekrar gönderilmeyecek.
              </p>
            )}

            {totalToSend === 0 && alreadyNotified.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-6">Henüz başvuru yok.</p>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center gap-3 px-5 py-4 border-t border-white/8 flex-shrink-0">
            <button
              onClick={onClose}
              disabled={sending}
              className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all disabled:opacity-40"
            >
              İptal
            </button>
            <button
              onClick={handleConfirm}
              disabled={sending || totalToSend === 0}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-sm font-semibold text-emerald-400 hover:bg-emerald-500/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {sending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Gönderiliyor...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  {totalToSend > 0 ? `Gönder (${totalToSend})` : "Gönderilecek Yok"}
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function ReviewSection({
  icon,
  title,
  count,
  note,
  color,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  count: number;
  note: string;
  color: "emerald" | "red" | "gray";
  items: Submission[];
}) {
  const styles = {
    emerald: {
      wrap: "border-emerald-500/20 bg-emerald-500/[0.04]",
      divider: "divide-emerald-500/10",
      badge: "bg-emerald-500/15 text-emerald-400",
      note: "text-emerald-500/50",
      row: "hover:bg-emerald-500/5",
    },
    red: {
      wrap: "border-red-500/20 bg-red-500/[0.04]",
      divider: "divide-red-500/10",
      badge: "bg-red-500/15 text-red-400",
      note: "text-red-500/50",
      row: "hover:bg-red-500/5",
    },
    gray: {
      wrap: "border-white/8 bg-white/[0.02]",
      divider: "divide-white/5",
      badge: "bg-white/8 text-gray-400",
      note: "text-gray-600",
      row: "hover:bg-white/[0.025]",
    },
  }[color];

  return (
    <div className={cn("rounded-xl border overflow-hidden", styles.wrap)}>
      {/* Section header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-inherit">
        {icon}
        <span className="text-xs font-semibold text-white flex-1">{title}</span>
        <span className={cn("px-2 py-0.5 rounded-md text-[10px] font-bold", styles.badge)}>
          {count}
        </span>
      </div>

      {/* Team list */}
      <div className={cn("divide-y", styles.divider)}>
        {items.map((s) => (
          <div
            key={s.id}
            className={cn("flex items-center gap-3 px-4 py-2 transition-colors", styles.row)}
          >
            <span className="text-[10px] text-gray-700 font-mono w-7 flex-shrink-0">
              #{s.id}
            </span>
            <span className="text-xs text-gray-300 flex-1 truncate">{s.teamName}</span>
            <span className="text-[10px] text-gray-600 flex-shrink-0">{s.memberCount} üye</span>
          </div>
        ))}
      </div>

      {/* Note */}
      <div className="px-4 py-2 border-t border-inherit">
        <p className={cn("text-[10px]", styles.note)}>{note}</p>
      </div>
    </div>
  );
}
