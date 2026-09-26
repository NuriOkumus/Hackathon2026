"use client";

import { TeamData } from "./ApplyForm";
import { FormInput, CustomSelect } from "./FormFields";
import { ValidationErrors } from "@/lib/validations";

interface Props {
    data: TeamData;
    updateData: (data: TeamData) => void;
    errors: ValidationErrors;
    onBlurField?: () => void;
}

export default function StepTeam({ data, updateData, errors, onBlurField }: Props) {
    const safeData = data || { teamName: "", memberCount: 2, experience: "" };

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-2xl font-bold text-white mb-2">Takım Genel Bilgileri</h3>
                <p className="text-gray-400 text-sm">Harika bir fikriniz mi var? Önce takımınızı tanıyalım.</p>
            </div>

            <div className="space-y-6">
                <FormInput
                    label="Takım Adı"
                    placeholder="Örn: CyberKnights"
                    value={safeData.teamName}
                    onChange={(e) => updateData({ ...safeData, teamName: e.target.value })}
                    onBlur={onBlurField}
                    error={errors?.["team.teamName"]}
                />

                {/* Member Count */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-300 ml-1">Kişi Sayısı (Siz Dahil)</label>
                    <div className="grid grid-cols-3 gap-3">
                        {[3, 4, 5].map((num) => (
                            <button
                                key={num}
                                onClick={() => updateData({ ...safeData, memberCount: num })}
                                className={`py-3 rounded-xl border text-sm font-bold transition-all ${safeData.memberCount === num
                                    ? "bg-cyan-500/20 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                                    : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-gray-500"
                                    }`}
                            >
                                {num} Kişi
                            </button>
                        ))}
                    </div>
                </div>

                <CustomSelect
                    label="Hackathon Deneyimi"
                    value={safeData.experience}
                    onChange={(val) => updateData({ ...safeData, experience: val })}
                    error={errors?.["team.experience"]}
                    options={[
                        { value: "none", label: "İlk defa katılıyoruz" },
                        { value: "beginner", label: "1-2 kez katıldık" },
                        { value: "intermediate", label: "3-5 kez katıldık" },
                        { value: "advanced", label: "5+ kez katıldık, tecrübeliyiz" }
                    ]}
                />
            </div>
        </div>
    );
}
