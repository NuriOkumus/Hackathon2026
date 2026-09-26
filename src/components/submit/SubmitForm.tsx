"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EMAIL_REGEX, GITHUB_REGEX } from "@/lib/validations";
import { motion, AnimatePresence } from "framer-motion";
import {
    Upload,
    CheckCircle2,
    Github,
    Presentation,
    Loader2,
    AlertCircle,
    GitCommitHorizontal,
    Mail,
    Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import FileDropZone from "./FileDropZone";

const SUBMIT_DEADLINE = new Date("2026-05-14T12:00:00+03:00");

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormData {
    teamName: string;
    teamEmail: string;
    repoUrl: string;
    commitHash: string;
    projectDescription: string;
    presentation: File | null;
}

type FieldErrors = Partial<Record<keyof FormData, string>>;

const initialForm: FormData = {
    teamName: "",
    teamEmail: "",
    repoUrl: "",
    commitHash: "",
    projectDescription: "",
    presentation: null,
};

// ─── Input field ──────────────────────────────────────────────────────────────

function InputField({
    label,
    placeholder,
    value,
    onChange,
    error,
    icon: Icon,
    type = "text",
}: {
    label: string;
    placeholder: string;
    value: string;
    onChange: (v: string) => void;
    error?: string;
    icon: React.ComponentType<{ className?: string }>;
    type?: string;
}) {
    return (
        <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-300">{label}</label>
            <div className="relative">
                <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={cn(
                        "w-full bg-slate-800 border rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none transition-all",
                        error
                            ? "border-red-500/50 focus:border-red-500"
                            : "border-slate-600 focus:border-cyan-500/60 focus:bg-slate-700"
                    )}
                />
            </div>
            {error && (
                <p className="text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {error}
                </p>
            )}
        </div>
    );
}

// ─── SubmitForm ───────────────────────────────────────────────────────────────

export default function SubmitForm() {
    const router = useRouter();
    const [form, setForm] = useState<FormData>(initialForm);
    const [errors, setErrors] = useState<FieldErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    if (Date.now() > SUBMIT_DEADLINE.getTime()) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-2xl mx-auto p-8 rounded-3xl bg-[#0a0a12]/80 backdrop-blur-xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.3)] text-center"
            >
                <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
                    <Upload className="w-8 h-8 text-gray-500" />
                </div>
                <h2 className="text-2xl font-black text-white mb-3">Teslim Süresi Doldu</h2>
                <p className="text-gray-400 mb-2">Son teslim tarihi <strong className="text-white">14 Mayıs 2026, 12:00</strong> itibarıyla geçmiştir.</p>
                <p className="text-sm text-gray-600">Sorularınız için <a href="mailto:veribilimimsku@gmail.com" className="text-cyan-400 hover:underline">veribilimimsku@gmail.com</a> adresine yazabilirsiniz.</p>
            </motion.div>
        );
    }

    const update = <K extends keyof FormData>(key: K, val: FormData[K]) => {
        setForm((p) => ({ ...p, [key]: val }));
        setErrors((p) => {
            const n = { ...p };
            delete n[key];
            return n;
        });
        setServerError(null);
    };

    const validate = (): boolean => {
        const e: FieldErrors = {};

        if (!form.teamName.trim()) e.teamName = "Takım adı zorunludur";
        if (!form.teamEmail.trim()) e.teamEmail = "E-posta zorunludur";
        else if (!EMAIL_REGEX.test(form.teamEmail))
            e.teamEmail = "Geçerli bir e-posta giriniz";

        if (!form.repoUrl.trim()) e.repoUrl = "Repo URL zorunludur";
        else if (!GITHUB_REGEX.test(form.repoUrl))
            e.repoUrl = "Geçerli bir GitHub repo URL'si giriniz";

        if (!form.commitHash.trim()) e.commitHash = "Commit hash zorunludur";
        if (!form.projectDescription.trim()) e.projectDescription = "Proje açıklaması zorunludur";

        if (!form.presentation) e.presentation = "Sunum dosyası zorunludur";
        else {
            const allowed = [
                "application/pdf",
                "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                "application/vnd.ms-powerpoint",
            ];
            if (!allowed.includes(form.presentation.type)) e.presentation = "PDF veya PPTX olmalıdır";
            else if (form.presentation.size > 200 * 1024 * 1024) e.presentation = "En fazla 200MB olabilir";
        }

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        setIsSubmitting(true);
        setServerError(null);

        try {
            const fd = new window.FormData();
            fd.append("teamName", form.teamName);
            fd.append("teamEmail", form.teamEmail);
            fd.append("repoUrl", form.repoUrl);
            fd.append("commitHash", form.commitHash);
            fd.append("projectDescription", form.projectDescription);
            if (form.presentation) fd.append("presentation", form.presentation);

            const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
            const res = await fetch(`${apiUrl}/api/submit`, { method: "POST", body: fd });
            const json = await res.json();

            if (json.success) {
                setIsSuccess(true);
            } else {
                setServerError(json.message || "Teslim gönderilemedi. Lütfen tekrar deneyin.");
            }
        } catch {
            setServerError("Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-2xl mx-auto p-8 rounded-3xl bg-[#0a0a12]/80 backdrop-blur-xl border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.15)] text-center"
            >
                <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6 relative">
                    <div className="absolute inset-0 rounded-full animate-ping bg-emerald-500/20" />
                    <CheckCircle2 className="w-12 h-12 text-emerald-400 relative z-10" />
                </div>
                <h2 className="text-3xl font-black text-white mb-4">Teslim Tamamlandı!</h2>
                <p className="text-gray-400 mb-2">
                    Projeniz başarıyla yüklendi. Değerlendirme sürecinde jüriler tarafından incelenecektir.
                </p>
                <p className="text-sm text-gray-600 mb-8">
                    Takım: <span className="text-white font-medium">{form.teamName}</span>
                </p>
                <button
                    onClick={() => router.push("/")}
                    className="px-8 py-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors font-semibold"
                >
                    Ana Sayfaya Dön
                </button>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <div className="relative bg-[#05050a]/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-10 shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden">
                {/* Glow effects */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/8 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/8 rounded-full blur-[100px] pointer-events-none translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10 space-y-6">
                    {/* Re-submission notice */}
                    <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-cyan-500/5 border border-cyan-500/15 text-xs text-cyan-400/80 leading-relaxed">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                        Daha önce teslim yaptıysanız aynı e-posta ile tekrar göndermeniz yeterli — önceki tesliminizin üzerine yazılır. Son teslim geçerlidir.
                    </div>

                    {/* Section: Team Info */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5 text-cyan-400" />
                            Takım Bilgileri
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InputField
                                label="Takım Adı"
                                placeholder="Örn: Team Alpha"
                                value={form.teamName}
                                onChange={(v) => update("teamName", v)}
                                error={errors.teamName}
                                icon={Users}
                            />
                            <InputField
                                label="Kaptan E-posta"
                                placeholder="kaptan@email.com"
                                value={form.teamEmail}
                                onChange={(v) => update("teamEmail", v)}
                                error={errors.teamEmail}
                                icon={Mail}
                                type="email"
                            />
                        </div>
                    </div>

                    <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                    {/* Section: GitHub */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Github className="w-5 h-5 text-purple-400" />
                            GitHub Bilgileri
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InputField
                                label="Repo URL"
                                placeholder="https://github.com/org/repo"
                                value={form.repoUrl}
                                onChange={(v) => update("repoUrl", v)}
                                error={errors.repoUrl}
                                icon={Github}
                                type="url"
                            />
                            <InputField
                                label="Son Commit Hash"
                                placeholder="abc1234"
                                value={form.commitHash}
                                onChange={(v) => update("commitHash", v)}
                                error={errors.commitHash}
                                icon={GitCommitHorizontal}
                            />
                        </div>
                    </div>

                    <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                    {/* Section: Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">
                            Proje Açıklaması
                        </label>
                        <textarea
                            value={form.projectDescription}
                            onChange={(e) => update("projectDescription", e.target.value)}
                            placeholder="Projenizin amacını, çözdüğü problemi ve kullandığınız teknolojileri kısaca açıklayın..."
                            rows={4}
                            className={cn(
                                "w-full bg-slate-800 border rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none transition-all resize-none",
                                errors.projectDescription
                                    ? "border-red-500/50 focus:border-red-500"
                                    : "border-slate-600 focus:border-cyan-500/60 focus:bg-slate-700"
                            )}
                        />
                        {errors.projectDescription && (
                            <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                                <AlertCircle className="w-3 h-3" /> {errors.projectDescription}
                            </p>
                        )}
                    </div>

                    <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                    {/* Section: Files */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Upload className="w-5 h-5 text-orange-400" />
                            Dosya Yükleme
                        </h3>
                        <FileDropZone
                            label="Sunum"
                            accept=".pdf,.pptx,.ppt"
                            maxSizeMB={200}
                            file={form.presentation}
                            onFile={(f) => update("presentation", f)}
                            onClear={() => update("presentation", null)}
                            error={errors.presentation}
                            icon={Presentation}
                        />
                    </div>

                    {/* Server error */}
                    <AnimatePresence>
                        {serverError && (
                            <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                            >
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                {serverError}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Submit */}
                    <div className="flex justify-end pt-4 border-t border-white/10">
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="relative group flex items-center gap-2 px-10 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-cyan-500 text-white font-bold overflow-hidden transition-all hover:scale-105 disabled:opacity-70 disabled:hover:scale-100"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                            <span className="relative z-10 flex items-center gap-2">
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Yükleniyor...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-5 h-5" />
                                        Projeyi Teslim Et
                                    </>
                                )}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
