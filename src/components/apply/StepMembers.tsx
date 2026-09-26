"use client";

import { MemberData } from "./ApplyForm";
import { FormInput } from "./FormFields";
import { Upload, X } from "lucide-react";
import { ValidationErrors } from "@/lib/validations";

interface Props {
    memberCount: number;
    members: MemberData[];
    updateData: (data: MemberData[]) => void;
    errors: ValidationErrors;
    onBlurField?: () => void;
}

export default function StepMembers({ memberCount, members, updateData, errors, onBlurField }: Props) {
    // If the team has only 1 member, this step shouldn't really be rendered or is empty
    if (memberCount <= 1) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center bg-cyan-500/5 border border-cyan-500/20 rounded-2xl">
                <h3 className="text-xl font-bold text-white mb-2">Bireysel Katılım</h3>
                <p className="text-gray-400">Takımınız sadece sizden oluşuyor. Bu adımı geçebilirsiniz.</p>
            </div>
        );
    }

    // Number of additional members (total - captain)
    const additionalMemberCount = memberCount - 1;

    // Ensure our members array matches the expected count
    // Keep this logic inside the current component lifecycle via handlers or simple derived state,
    // but typically we'd just map up to `additionalMemberCount`

    const getMember = (index: number): MemberData => {
        return members[index] || {
            fullName: "",
            email: "",
            phone: "",
            github: "",
            university: "",
            linkedin: "",
            cv: null
        };
    };

    const updateMember = (index: number, updatedItem: MemberData) => {
        const newMembers = [...members];
        newMembers[index] = updatedItem;
        updateData(newMembers);
    };

    const handleFileUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            updateMember(index, { ...getMember(index), cv: e.target.files[0] });
        }
    };

    return (
        <div className="space-y-12">
            <div>
                <h3 className="text-2xl font-bold text-white mb-2">Takım Üyeleri Bilgileri</h3>
                <p className="text-gray-400 text-sm">Diğer {additionalMemberCount} takım arkadaşınızın bilgilerini girin.</p>
            </div>

            {Array.from({ length: additionalMemberCount }).map((_, i) => {
                const member = getMember(i);
                return (
                    <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-2xl relative">
                        {/* Member index badge */}
                        <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-slate-900 border border-cyan-500 flex items-center justify-center text-cyan-400 font-bold text-sm">
                            {i + 2}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                            <FormInput
                                label="Ad Soyad"
                                placeholder="Ayşe Demir"
                                value={member.fullName}
                                onChange={(e) => updateMember(i, { ...member, fullName: e.target.value })}
                                onBlur={onBlurField}
                                error={errors[`members.${i}.fullName`]}
                            />

                            <FormInput
                                label="E-posta"
                                type="email"
                                placeholder="ayse@example.com"
                                value={member.email}
                                onChange={(e) => updateMember(i, { ...member, email: e.target.value })}
                                onBlur={onBlurField}
                                error={errors[`members.${i}.email`]}
                            />

                            <FormInput
                                label="Telefon"
                                type="tel"
                                placeholder="+90 555 555 5555"
                                value={member.phone}
                                onChange={(e) => updateMember(i, { ...member, phone: e.target.value })}
                                onBlur={onBlurField}
                                error={errors[`members.${i}.phone`]}
                            />

                            <FormInput
                                label="GitHub Profili"
                                type="url"
                                placeholder="https://github.com/aysedemir"
                                value={member.github}
                                onChange={(e) => updateMember(i, { ...member, github: e.target.value })}
                                onBlur={onBlurField}
                                error={errors[`members.${i}.github`]}
                            />

                            <div className="md:col-span-2">
                                <FormInput
                                    label="Üniversite / Bölüm / Sınıf"
                                    placeholder="MSKÜ - Yazılım Mühendisliği - 3. Sınıf"
                                    value={member.university}
                                    onChange={(e) => updateMember(i, { ...member, university: e.target.value })}
                                    onBlur={onBlurField}
                                    error={errors[`members.${i}.university`]}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <FormInput
                                    label="LinkedIn"
                                    type="url"
                                    placeholder="https://linkedin.com/in/aysedemir"
                                    value={member.linkedin}
                                    onChange={(e) => updateMember(i, { ...member, linkedin: e.target.value })}
                                    onBlur={onBlurField}
                                    error={errors[`members.${i}.linkedin`]}
                                    optional
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-semibold text-gray-300 ml-1 flex items-center justify-between">
                                    CV Ekle <span className="text-[10px] uppercase text-gray-500 tracking-wider">Opsiyonel</span>
                                </label>

                                {!member.cv ? (
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all group">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Upload className="w-8 h-8 text-gray-400 group-hover:text-cyan-400 mb-2 transition-colors" />
                                            <p className="mb-1 text-sm text-gray-400 group-hover:text-gray-300"><span className="font-semibold">Yüklemek için tıklayın</span> veya sürükleyip bırakın</p>
                                            <p className="text-xs text-gray-500">PDF (Max 5MB)</p>
                                        </div>
                                        <input type="file" className="hidden" accept=".pdf" onChange={(e) => handleFileUpload(i, e)} />
                                    </label>
                                ) : (
                                    <div className="flex items-center justify-between p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-cyan-500/20 rounded-lg">
                                                <Upload className="w-5 h-5 text-cyan-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-white line-clamp-1">{member.cv.name}</p>
                                                <p className="text-xs text-cyan-400/80">{(member.cv.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => updateMember(i, { ...member, cv: null })}
                                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
