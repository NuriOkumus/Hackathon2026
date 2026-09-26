"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock } from "lucide-react";
import StepTeam from "./StepTeam";
import StepCaptain from "./StepCaptain";
import StepMembers from "./StepMembers";
import StepClosing from "./StepClosing";
import {
    ValidationErrors,
    validateEmail,
    validatePhone,
    validateRequired,
    validateUrl,
    GITHUB_REGEX,
    LINKEDIN_REGEX
} from "@/lib/validations";

// Shared Types
export interface TeamData {
    teamName: string;
    memberCount: number;
    experience: string;
}

export interface MemberData {
    fullName: string;
    email: string;
    phone: string;
    github: string;
    university: string;
    linkedin: string;
    cv: File | null;
}

export interface ClosingData {
    source: string;
    notes: string;
    kvkkAccepted: boolean;
    termsAccepted: boolean;
}

export interface ApplicationFormData {
    team: TeamData;
    captain: MemberData;
    members: MemberData[];
    closing: ClosingData;
}

const STORAGE_KEY = "vbt-apply-form";

function loadSavedForm(): ApplicationFormData {
    try {
        if (typeof window === "undefined") return initialFormData;
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return initialFormData;
        const parsed = JSON.parse(raw);
        return {
            team: { ...initialFormData.team, ...parsed.team },
            captain: { ...initialFormData.captain, ...parsed.captain, cv: null },
            members: Array.isArray(parsed.members)
                ? parsed.members.map((m: Partial<MemberData>) => ({
                    fullName: m.fullName ?? "",
                    email: m.email ?? "",
                    phone: m.phone ?? "",
                    github: m.github ?? "",
                    university: m.university ?? "",
                    linkedin: m.linkedin ?? "",
                    cv: null,
                }))
                : [],
            closing: { ...initialFormData.closing, ...parsed.closing, kvkkAccepted: false, termsAccepted: false },
        };
    } catch {
        return initialFormData;
    }
}

const initialFormData: ApplicationFormData = {
    team: {
        teamName: "",
        memberCount: 3,
        experience: "",
    },
    captain: {
        fullName: "",
        email: "",
        phone: "",
        github: "",
        university: "",
        linkedin: "",
        cv: null,
    },
    members: [],
    closing: {
        source: "",
        notes: "",
        kvkkAccepted: false,
        termsAccepted: false,
    },
};

const steps = [
    { id: 1, title: "Takım Bilgileri" },
    { id: 2, title: "Kaptan" },
    { id: 3, title: "Üyeler" },
    { id: 4, title: "Kapanış" },
];

export default function ApplyForm() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<ApplicationFormData>(loadSavedForm);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    // Persist form data to localStorage (cv files excluded — not serializable)
    useEffect(() => {
        if (isSuccess) return;
        try {
            const toSave = {
                team: formData.team,
                captain: { ...formData.captain, cv: null },
                members: formData.members.map((m) => ({ ...m, cv: null })),
                closing: formData.closing,
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
        } catch {}
    }, [formData, isSuccess]);

    const updateFormData = <K extends keyof ApplicationFormData>(section: K, data: ApplicationFormData[K]) => {
        setFormData((prev) => ({ ...prev, [section]: data }));
        // Clear errors for the section being updated to provide immediate feedback
        const newErrors = { ...errors };
        Object.keys(newErrors).forEach(key => {
            if (key.startsWith(`${section}.`)) {
                delete newErrors[key];
            }
        });
        setErrors(newErrors);
    };

    const validateStep = (step: number): boolean => {
        const newErrors: ValidationErrors = {};
        let isValid = true;

        if (step === 1) {
            const errName = validateRequired(formData.team.teamName);
            if (errName) newErrors["team.teamName"] = errName;

            const errExp = validateRequired(formData.team.experience);
            if (errExp) newErrors["team.experience"] = errExp;

        } else if (step === 2) {
            const c = formData.captain;
            const errName = validateRequired(c.fullName);
            if (errName) newErrors["captain.fullName"] = errName;

            const errEmail = validateEmail(c.email);
            if (errEmail) newErrors["captain.email"] = errEmail;

            const errPhone = validatePhone(c.phone);
            if (errPhone) newErrors["captain.phone"] = errPhone;

            const errUni = validateRequired(c.university);
            if (errUni) newErrors["captain.university"] = errUni;

            const errGit = validateUrl(c.github, GITHUB_REGEX, true, "Geçerli bir GitHub profil linki giriniz");
            if (errGit) newErrors["captain.github"] = errGit;

            const errLink = validateUrl(c.linkedin, LINKEDIN_REGEX, false, "Geçerli bir LinkedIn profil linki giriniz");
            if (errLink) newErrors["captain.linkedin"] = errLink;

        } else if (step === 3) {
            const count = formData.team.memberCount - 1;
            for (let i = 0; i < count; i++) {
                const m = formData.members[i] || {};

                const errName = validateRequired(m.fullName);
                if (errName) newErrors[`members.${i}.fullName`] = errName;

                const errEmail = validateEmail(m.email || "");
                if (errEmail) newErrors[`members.${i}.email`] = errEmail;

                const errPhone = validatePhone(m.phone || "");
                if (errPhone) newErrors[`members.${i}.phone`] = errPhone;

                const errUni = validateRequired(m.university);
                if (errUni) newErrors[`members.${i}.university`] = errUni;

                const errGit = validateUrl(m.github || "", GITHUB_REGEX, true, "Geçerli bir GitHub profil linki giriniz");
                if (errGit) newErrors[`members.${i}.github`] = errGit;

                const errLink = validateUrl(m.linkedin || "", LINKEDIN_REGEX, false, "Geçerli bir LinkedIn profil linki giriniz");
                if (errLink) newErrors[`members.${i}.linkedin`] = errLink;
            }
        } else if (step === 4) {
            const errSource = validateRequired(formData.closing.source);
            if (errSource) newErrors["closing.source"] = errSource;

            if (!formData.closing.kvkkAccepted) newErrors["closing.kvkkAccepted"] = "KVKK metnini onaylamanız gerekiyor";
            if (!formData.closing.termsAccepted) newErrors["closing.termsAccepted"] = "Katılım şartlarını onaylamanız gerekiyor";
        }

        if (Object.keys(newErrors).length > 0) {
            isValid = false;
            setErrors(newErrors);

            // Shake animation or similar could be triggered here
        } else {
            setErrors({});
        }

        return isValid;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            if (currentStep < steps.length) {
                setCurrentStep((prev) => prev + 1);
            }
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setErrors({}); // Clear errors when going back
            setCurrentStep((prev) => prev - 1);
        }
    };

    const handleFieldBlur = () => validateStep(currentStep);

    const handleSubmit = async () => {
        if (!validateStep(4)) return;

        setIsSubmitting(true);
        setSubmitError(null);
        try {
            const fd = new FormData();
            fd.append("teamName", formData.team.teamName);
            fd.append("memberCount", String(formData.team.memberCount));
            fd.append("experience", formData.team.experience);
            fd.append("source", formData.closing.source);
            fd.append("notes", formData.closing.notes || "");

            const memberCount = formData.team.memberCount;
            const allMembers = [
                {
                    name: formData.captain.fullName,
                    email: formData.captain.email,
                    phone: formData.captain.phone,
                    github: formData.captain.github,
                    linkedin: formData.captain.linkedin,
                    universityDept: formData.captain.university,
                },
                ...formData.members.slice(0, memberCount - 1).map((m) => ({
                    name: m.fullName,
                    email: m.email,
                    phone: m.phone,
                    github: m.github,
                    linkedin: m.linkedin,
                    universityDept: m.university,
                })),
            ];
            fd.append("members", JSON.stringify(allMembers));

            if (formData.captain.cv) fd.append("cv_0", formData.captain.cv);
            formData.members.slice(0, memberCount - 1).forEach((m, i) => {
                if (m.cv) fd.append(`cv_${i + 1}`, m.cv);
            });

            const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
            const res = await fetch(`${apiUrl}/api/apply`, { method: "POST", body: fd });
            const json = await res.json();

            if (json.success) {
                localStorage.removeItem(STORAGE_KEY);
                setIsSuccess(true);
            } else {
                setSubmitError(json.message || "Başvuru gönderilemedi. Lütfen tekrar deneyin.");
            }
        } catch {
            setSubmitError("Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edip tekrar deneyin.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-2xl mx-auto p-8 rounded-3xl bg-[#0a0a12]/80 backdrop-blur-xl border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.15)] text-center"
            >
                <div className="w-24 h-24 rounded-full bg-cyan-500/20 flex items-center justify-center mx-auto mb-6 relative">
                    <div className="absolute inset-0 rounded-full animate-ping bg-cyan-500/20" />
                    <CheckCircle2 className="w-12 h-12 text-cyan-400 relative z-10" />
                </div>
                <h2 className="text-3xl font-black text-white mb-4">Başvurunuz Alındı!</h2>
                <p className="text-gray-400 mb-8">
                    Sistemimize başarıyla kaydedildi. Geleceği kodlamaya bir adım daha yaklaştınız.
                    Değerlendirme süreci sonunda e-posta ile bilgilendirileceksiniz.
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
        <div className="w-full max-w-3xl mx-auto">
            {/* Deadline notice */}
            <div className="flex justify-center mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-medium">
                    <Clock className="w-3 h-3" />
                    Son başvuru: 23 Nisan 2026
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-12 relative">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-white/5 -translate-y-1/2 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                        initial={{ width: "0%" }}
                        animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                </div>

                <div className="flex justify-between relative z-10">
                    {steps.map((step) => {
                        const isCompleted = currentStep > step.id;
                        const isCurrent = currentStep === step.id;

                        return (
                            <div
                                key={step.id}
                                className={`flex flex-col items-center gap-3 ${isCompleted ? "cursor-pointer" : ""}`}
                                onClick={isCompleted ? () => { setErrors({}); setCurrentStep(step.id); } : undefined}
                            >
                                <motion.div
                                    animate={{
                                        backgroundColor: isCompleted ? "rgb(6, 182, 212)" : isCurrent ? "rgba(6, 182, 212, 0.2)" : "rgba(255, 255, 255, 0.05)",
                                        borderColor: isCompleted || isCurrent ? "rgba(6, 182, 212, 0.5)" : "rgba(255, 255, 255, 0.1)",
                                        scale: isCurrent ? 1.2 : 1
                                    }}
                                    className="w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm transition-colors duration-300 relative"
                                >
                                    {isCompleted ? (
                                        <CheckCircle2 className="w-5 h-5 text-white" />
                                    ) : (
                                        <span className={isCurrent ? "text-cyan-400" : "text-gray-500"}>{step.id}</span>
                                    )}
                                    {isCurrent && (
                                        <motion.div
                                            layoutId="activeStepGlow"
                                            className="absolute -inset-2 rounded-full bg-cyan-500/20 blur-md pointer-events-none"
                                        />
                                    )}
                                </motion.div>
                                <span className={`text-xs font-semibold tracking-wide uppercase transition-colors duration-300 ${isCurrent ? "text-cyan-400" : isCompleted ? "text-gray-300" : "text-gray-600"}`}>
                                    {step.title}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Form Container */}
            <div className="relative bg-[#05050a]/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                {/* Glow effects — contained separately so dropdown isn't clipped */}
                <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
                </div>

                <div className="relative z-10 min-h-[400px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {currentStep === 1 && (
                                <StepTeam data={formData.team} updateData={(d: TeamData) => updateFormData("team", d)} errors={errors} onBlurField={handleFieldBlur} />
                            )}
                            {currentStep === 2 && (
                                <StepCaptain data={formData.captain} updateData={(d: MemberData) => updateFormData("captain", d)} errors={errors} onBlurField={handleFieldBlur} />
                            )}
                            {currentStep === 3 && (
                                <StepMembers
                                    memberCount={formData.team.memberCount}
                                    members={formData.members}
                                    updateData={(d: MemberData[]) => updateFormData("members", d)}
                                    errors={errors}
                                    onBlurField={handleFieldBlur}
                                />
                            )}
                            {currentStep === 4 && (
                                <StepClosing data={formData.closing} updateData={(d: ClosingData) => updateFormData("closing", d)} errors={errors} onBlurField={handleFieldBlur} />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Submit Error */}
                {submitError && (
                    <div className="mt-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center relative z-10">
                        {submitError}
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/10 relative z-10">
                    <button
                        onClick={handleBack}
                        disabled={currentStep === 1}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${currentStep === 1
                            ? "opacity-0 pointer-events-none"
                            : "text-gray-400 hover:text-white hover:bg-white/5"
                            }`}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Geri
                    </button>

                    {currentStep < steps.length ? (
                        <button
                            onClick={handleNext}
                            className="group flex items-center gap-2 px-8 py-3 rounded-xl bg-white text-black font-bold hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all"
                        >
                            İleri
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="relative group flex items-center gap-2 px-10 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold overflow-hidden transition-all hover:scale-105 disabled:opacity-70 disabled:hover:scale-100"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                            <span className="relative z-10">
                                {isSubmitting ? "Gönderiliyor..." : "Başvuruyu Tamamla"}
                            </span>
                            {!isSubmitting && <CheckCircle2 className="w-5 h-5 relative z-10" />}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

