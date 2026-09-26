"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Github,
  GitCommitHorizontal,
  ExternalLink,
  FileDown,
  Loader2,
  Presentation,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Deliverable, API_URL } from "./types";
import { formatDate } from "./utils";

// ─── FilePreview ──────────────────────────────────────────────────────────────

function FilePreview({
  filePath,
  label,
  token,
  teamName,
  height,
  accentClass,
}: {
  filePath: string | null | undefined;
  label: string;
  token: string;
  teamName: string;
  height: number;
  accentClass: string;
}) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(!!filePath);
  const [downloading, setDownloading] = useState(false);
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    if (!filePath) { setLoading(false); return; }
    const controller = new AbortController();
    fetch(`${API_URL}/api/admin/deliverable-file?path=${encodeURIComponent(filePath)}`, {
      signal: controller.signal,
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d?.url) setUrl(d.url); })
      .catch((err) => { if (err.name !== "AbortError") setUrl(null); })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [filePath, token]);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setLightbox(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  const download = async () => {
    if (!url || !filePath) return;
    setDownloading(true);
    try {
      const r = await fetch(url);
      const blob = await r.blob();
      const obj = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = obj;
      a.download = `${teamName.replace(/\s+/g, "_")}_${label}.${filePath.split(".").pop() ?? "pdf"}`;
      a.click();
      URL.revokeObjectURL(obj);
    } finally {
      setDownloading(false);
    }
  };

  const isImage = filePath && /\.(png|jpe?g)$/i.test(filePath);
  const isPptx = filePath && /\.pptx?$/i.test(filePath);
  const canExpand = !!url && !isPptx;

  const FileContent = ({ fullscreen }: { fullscreen: boolean }) => {
    if (!url) return null;
    if (isImage) return (
      <img src={url} alt={label} className={cn("w-full h-full", fullscreen ? "object-contain" : "object-contain")} />
    );
    return <iframe src={url} className="w-full h-full border-0" title={label} />;
  };

  return (
    <>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className={cn("text-[10px] uppercase tracking-widest font-semibold", accentClass)}>{label}</p>
          <div className="flex items-center gap-3">
            {canExpand && (
              <button
                onClick={() => setLightbox(true)}
                className="inline-flex items-center gap-1 text-[10px] text-gray-600 hover:text-white transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                tam ekran
              </button>
            )}
            {url && (
              <button
                onClick={download}
                disabled={downloading}
                className="inline-flex items-center gap-1 text-[10px] text-gray-600 hover:text-white transition-colors disabled:opacity-40"
              >
                {downloading ? <Loader2 className="w-3 h-3 animate-spin" /> : <FileDown className="w-3 h-3" />}
                indir
              </button>
            )}
          </div>
        </div>

        <div
          className={cn(
            "relative bg-white/[0.02] border border-white/8 rounded-xl overflow-hidden flex items-center justify-center",
            canExpand && "cursor-zoom-in"
          )}
          style={{ height }}
          onClick={() => canExpand && setLightbox(true)}
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin text-gray-700" />
          ) : !filePath ? (
            <p className="text-xs text-gray-700">Yüklenmedi</p>
          ) : !url ? (
            <p className="text-xs text-red-500/60">Dosya alınamadı</p>
          ) : isPptx ? (
            <div className="flex flex-col items-center gap-3 text-center px-4">
              <Presentation className="w-8 h-8 text-gray-600" />
              <p className="text-xs text-gray-600">PPTX tarayıcıda önizlenemiyor</p>
              <button
                onClick={(e) => { e.stopPropagation(); download(); }}
                disabled={downloading}
                className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-50", accentClass, "bg-white/5 border border-white/10 hover:bg-white/10")}
              >
                <FileDown className="w-3.5 h-3.5" />
                İndir
              </button>
            </div>
          ) : (
            <FileContent fullscreen={false} />
          )}
        </div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-sm"
            onClick={() => setLightbox(false)}
          >
            <div
              className="flex items-center justify-between px-5 py-3 border-b border-white/8 flex-shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <p className={cn("text-xs uppercase tracking-widest font-semibold", accentClass)}>{label}</p>
                <span className="text-xs text-gray-600">{teamName}</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={download}
                  disabled={downloading}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-40"
                >
                  {downloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileDown className="w-3.5 h-3.5" />}
                  İndir
                </button>
                <button
                  onClick={() => setLightbox(false)}
                  className="p-1.5 rounded-lg text-gray-600 hover:text-white hover:bg-white/10 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div
              className="flex-1 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <FileContent fullscreen={true} />
            </div>

            <p className="text-center text-[10px] text-gray-700 py-2 flex-shrink-0">ESC veya dışarı tıklayarak kapat</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── DeliverableRow ───────────────────────────────────────────────────────────

export default function DeliverableRow({ deliverable, token }: { deliverable: Deliverable; token: string }) {
  return (
    <div className="border border-white/8 rounded-2xl overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/5 bg-white/[0.015]">
        <span className="text-xs text-gray-700 font-mono">#{deliverable.id}</span>
        <p className="text-sm font-bold text-white flex-1 truncate">{deliverable.teamName}</p>
        <a href={`mailto:${deliverable.teamEmail}`} className="text-xs text-gray-600 hover:text-white transition-colors hidden sm:block">
          {deliverable.teamEmail}
        </a>
        <p className="text-xs text-gray-700 flex-shrink-0">{formatDate(deliverable.submittedAt)}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px]">
        <div className="p-5 space-y-4 lg:border-r border-white/5">
          <div className="space-y-2.5">
            <a
              href={deliverable.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group"
            >
              <Github className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
              <span className="truncate">{deliverable.repoUrl.replace("https://github.com/", "")}</span>
              <ExternalLink className="w-3 h-3 flex-shrink-0 text-gray-700" />
            </a>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <GitCommitHorizontal className="w-4 h-4 text-gray-600 flex-shrink-0" />
              <code className="text-xs bg-white/5 px-2 py-0.5 rounded-md font-mono border border-white/8">{deliverable.commitHash}</code>
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
            <p className="text-[10px] text-gray-600 uppercase tracking-widest font-semibold mb-2">Proje Açıklaması</p>
            <p className="text-sm text-gray-300 leading-relaxed">{deliverable.projectDescription}</p>
          </div>
        </div>

        <div className="p-4 space-y-4 border-t lg:border-t-0 border-white/5">
          <FilePreview
            filePath={deliverable.presentationFile}
            label="Sunum"
            token={token}
            teamName={deliverable.teamName}
            height={200}
            accentClass="text-purple-400"
          />
        </div>
      </div>
    </div>
  );
}
