"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  RefreshCw,
  Search,
  Users,
  Loader2,
  LogOut,
  FileDown,
  Package,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Submission, Deliverable, AdminTab, StatusFilter, API_URL } from "./types";
import { exportCSV } from "./utils";
import SubmissionRow from "./SubmissionRow";
import DeliverableRow from "./DeliverableRow";
import FinalReviewModal from "./FinalReviewModal";

export default function Dashboard({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<AdminTab>("applications");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [showFinalReview, setShowFinalReview] = useState(false);
  const [emailResult, setEmailResult] = useState<{ message: string; isError: boolean } | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [subRes, delRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/submissions`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/api/admin/deliverables`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      if (!subRes.ok || !delRes.ok) {
        setError("Veriler yüklenemedi.");
        return;
      }
      const subData = await subRes.json();
      const delData = await delRes.json();
      setSubmissions(subData.submissions ?? []);
      setDeliverables(delData.deliverables ?? []);
      setLastRefresh(new Date());
    } catch {
      setError("API'ye ulaşılamadı.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredSubmissions = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return submissions;
    return submissions.filter(
      (s) =>
        s.teamName.toLowerCase().includes(q) ||
        s.members.some(
          (m) =>
            m.name.toLowerCase().includes(q) ||
            m.email.toLowerCase().includes(q) ||
            m.universityDept.toLowerCase().includes(q)
        )
    );
  }, [submissions, search]);

  const statusFilteredSubmissions = useMemo(() => {
    if (statusFilter === "all") return filteredSubmissions;
    return filteredSubmissions.filter((s) => (s.status || "pending") === statusFilter);
  }, [filteredSubmissions, statusFilter]);

  const onStatusChange = (id: number, newStatus: string) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
  };

  const decisionSummary = useMemo(() => ({
    accepted: submissions.filter((s) => s.status === "accepted" && !s.acceptanceEmailSentAt).length,
    rejected: submissions.filter((s) => s.status === "rejected" && !s.acceptanceEmailSentAt).length,
    pending: submissions.filter((s) => (s.status || "pending") === "pending").length,
    notified: submissions.filter((s) => !!s.acceptanceEmailSentAt).length,
  }), [submissions]);

  const canSendFinal =
    decisionSummary.accepted > 0 ||
    decisionSummary.rejected > 0 ||
    decisionSummary.pending > 0;

  const filteredDeliverables = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return deliverables;
    return deliverables.filter(
      (d) =>
        d.teamName.toLowerCase().includes(q) ||
        d.teamEmail.toLowerCase().includes(q) ||
        d.repoUrl.toLowerCase().includes(q)
    );
  }, [deliverables, search]);

  return (
    <div className="min-h-screen">
      {showFinalReview && (
        <FinalReviewModal
          submissions={submissions}
          token={token}
          onClose={() => setShowFinalReview(false)}
          onDone={({ message, isError, updated }) => {
            setShowFinalReview(false);
            setEmailResult({ message, isError });
            if (!isError) setSubmissions(updated);
          }}
        />
      )}
      {/* Top bar */}
      <div className="sticky top-0 z-40 border-b border-white/8 bg-[#05050a]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
          <div className="flex-1">
            <h1 className="text-sm font-bold text-white">Admin Paneli</h1>
            <p className="text-[11px] text-gray-600">
              Son güncelleme: {lastRefresh.toLocaleTimeString("tr-TR")}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => exportCSV(submissions)}
              disabled={submissions.length === 0 || activeTab !== "applications"}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-400 hover:text-white hover:bg-white/8 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <FileDown className="w-3.5 h-3.5" />
              CSV İndir
            </button>

            <button
              onClick={fetchData}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-xs text-primary hover:bg-primary/20 transition-all disabled:opacity-40"
            >
              <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
              Yenile
            </button>

            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg text-gray-600 hover:text-white hover:bg-white/5 transition-all"
              title="Çıkış"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/8">
          <button
            onClick={() => { setActiveTab("applications"); setSearch(""); }}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
              activeTab === "applications"
                ? "bg-primary/15 text-primary border border-primary/20"
                : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.03]"
            )}
          >
            <Users className="w-4 h-4" />
            Başvurular
            <span className={cn(
              "px-1.5 py-0.5 rounded-md text-[10px] font-bold",
              activeTab === "applications" ? "bg-primary/20 text-primary" : "bg-white/5 text-gray-600"
            )}>
              {submissions.length}
            </span>
          </button>
          <button
            onClick={() => { setActiveTab("deliverables"); setSearch(""); }}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
              activeTab === "deliverables"
                ? "bg-orange-500/15 text-orange-400 border border-orange-500/20"
                : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.03]"
            )}
          >
            <Package className="w-4 h-4" />
            Teslimler
            <span className={cn(
              "px-1.5 py-0.5 rounded-md text-[10px] font-bold",
              activeTab === "deliverables" ? "bg-orange-500/20 text-orange-400" : "bg-white/5 text-gray-600"
            )}>
              {deliverables.length}
            </span>
          </button>
        </div>

        {/* Stats */}
        {activeTab === "applications" ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Toplam", value: submissions.length, color: "text-white" },
              { label: "Beklemede", value: submissions.filter(s => (s.status || "pending") === "pending").length, color: "text-gray-400" },
              { label: "Kabul", value: submissions.filter(s => s.status === "accepted").length, color: "text-emerald-400" },
              { label: "Red", value: submissions.filter(s => s.status === "rejected").length, color: "text-red-400" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/[0.025] border border-white/8 rounded-xl px-4 py-3">
                <p className={cn("text-xl font-black", stat.color)}>{stat.value}</p>
                <p className="text-xs text-gray-600 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: "Toplam Teslim", value: deliverables.length },
              { label: "Sunum Yüklenen", value: deliverables.filter(d => d.presentationFile).length },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/[0.025] border border-white/8 rounded-xl px-4 py-3">
                <p className="text-xl font-black text-white">{stat.value}</p>
                <p className="text-xs text-gray-600 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Decision summary + final send */}
        {activeTab === "applications" && (
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] px-5 py-4 space-y-3">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white mb-2">Karar Durumu</p>
                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {decisionSummary.accepted} kabul bekliyor
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-red-400">
                    <XCircle className="w-3.5 h-3.5" />
                    {decisionSummary.rejected} red bekliyor
                  </span>
                  {decisionSummary.pending > 0 && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                      <Clock className="w-3.5 h-3.5" />
                      {decisionSummary.pending} kararsız
                    </span>
                  )}
                  {decisionSummary.notified > 0 && (
                    <span className="text-xs text-gray-600">
                      · {decisionSummary.notified} daha önce gönderildi
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => { setEmailResult(null); setShowFinalReview(true); }}
                disabled={!canSendFinal}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-sm font-semibold hover:bg-emerald-500/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
              >
                <Send className="w-4 h-4" />
                Son Kontrol
              </button>
            </div>
            {emailResult && (
              <p className={cn(
                "text-xs px-3 py-2 rounded-lg border",
                emailResult.isError
                  ? "text-red-400 bg-red-500/10 border-red-500/20"
                  : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
              )}>
                {emailResult.message}
              </p>
            )}
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={activeTab === "applications" ? "Takım adı, isim, üniversite ara..." : "Takım adı, e-posta, repo ara..."}
            className="w-full bg-slate-800 border border-slate-600 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-primary/60 focus:bg-slate-700 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 hover:text-white transition-colors"
            >
              ×
            </button>
          )}
        </div>

        {/* Status filter */}
        {activeTab === "applications" && (
          <div className="flex items-center gap-2">
            {(["all", "pending", "accepted", "rejected"] as StatusFilter[]).map((f) => {
              const labels = { all: "Tümü", pending: "Beklemede", accepted: "Kabul", rejected: "Red" };
              return (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                    statusFilter === f
                      ? "bg-white/10 text-white border border-white/15"
                      : "text-gray-600 hover:text-gray-300 hover:bg-white/[0.03]"
                  )}
                >
                  {labels[f]}
                </button>
              );
            })}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-600">
            <Loader2 className="w-6 h-6 animate-spin mr-3" />
            <span className="text-sm">Yükleniyor...</span>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-400 text-sm">{error}</p>
            <button
              onClick={fetchData}
              className="mt-3 text-xs text-gray-600 hover:text-white transition-colors underline"
            >
              Tekrar dene
            </button>
          </div>
        ) : activeTab === "applications" ? (
          statusFilteredSubmissions.length === 0 ? (
            <div className="text-center py-20 text-gray-700">
              <p className="text-sm">
                {search ? "Arama sonucu bulunamadı." : "Henüz başvuru yok."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-gray-700">
                {statusFilteredSubmissions.length} başvuru{search || statusFilter !== "all" ? ` (${submissions.length} içinden)` : ""}
              </p>
              {statusFilteredSubmissions.map((s, i) => (
                <SubmissionRow key={s.id} submission={s} token={token} index={i} onStatusChange={onStatusChange} />
              ))}
            </div>
          )
        ) : (
          filteredDeliverables.length === 0 ? (
            <div className="text-center py-20 text-gray-700">
              <p className="text-sm">
                {search ? "Arama sonucu bulunamadı." : "Henüz teslim yok."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-gray-700">
                {filteredDeliverables.length} teslim{search ? ` (${deliverables.length} içinden)` : ""}
              </p>
              {filteredDeliverables.map((d) => (
                <DeliverableRow key={d.id} deliverable={d} token={token} />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
