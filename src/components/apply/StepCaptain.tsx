"use client";

import { MemberData } from "./ApplyForm";
import { FormInput } from "./FormFields";
import { Upload, X } from "lucide-react";
import { ValidationErrors } from "@/lib/validations";

interface Props {
    data: MemberData;
    updateData: (data: MemberData) => void;
    errors: ValidationErrors;
    onBlurField?: () => void;
}

export default function StepCaptain({ data, updateData, errors, onBlurField }: Props) {
    // Helper for file upload simulation
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            updateData({ ...data, cv: e.target.files[0] });
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-2xl font-bold text-white mb-2">Takım Kaptanı Bilgileri</h3>
                <p className="text-gray-400 text-sm">Bizimle iletişimi sağlayacak liderin bilgileri.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                    label="Ad Soyad"
                    placeholder="Ahmet Yılmaz"
                    value={data.fullName}
                    onChange={(e) => updateData({ ...data, fullName: e.target.value })}
                    onBlur={onBlurField}
                    error={errors["captain.fullName"]}
                />

                <FormInput
                    label="E-posta"
                    type="email"
                    placeholder="ahmet@example.com"
                    value={data.email}
                    onChange={(e) => updateData({ ...data, email: e.target.value })}
                    onBlur={onBlurField}
                    error={errors["captain.email"]}
                />

                <FormInput
                    label="Telefon"
                    type="tel"
                    placeholder="+90 555 555 5555"
                    value={data.phone}
                    onChange={(e) => updateData({ ...data, phone: e.target.value })}
                    onBlur={onBlurField}
                    error={errors["captain.phone"]}
                />

                <FormInput
                    label="GitHub Profili"
                    type="url"
                    placeholder="https://github.com/ahmetyilmaz"
                    value={data.github}
                    onChange={(e) => updateData({ ...data, github: e.target.value })}
                    onBlur={onBlurField}
                    error={errors["captain.github"]}
                />

                <div className="md:col-span-2">
                    <FormInput
                        label="Üniversite / Bölüm / Sınıf"
                        placeholder="MSKÜ - Yazılım Mühendisliği - 3. Sınıf"
                        value={data.university}
                        onChange={(e) => updateData({ ...data, university: e.target.value })}
                        onBlur={onBlurField}
                        error={errors["captain.university"]}
                    />
                </div>

                <div className="md:col-span-2">
                    <FormInput
                        label="LinkedIn"
                        type="url"
                        placeholder="https://linkedin.com/in/ahmetyilmaz"
                        value={data.linkedin}
                        onChange={(e) => updateData({ ...data, linkedin: e.target.value })}
                        onBlur={onBlurField}
                        error={errors["captain.linkedin"]}
                        optional
                    />
                </div>

                {/* File Upload UI */}
                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-gray-300 ml-1 flex items-center justify-between">
                        CV Ekle <span className="text-[10px] uppercase text-gray-500 tracking-wider">Opsiyonel</span>
                    </label>

                    {!data.cv ? (
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all group">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 text-gray-400 group-hover:text-cyan-400 mb-2 transition-colors" />
                                <p className="mb-1 text-sm text-gray-400 group-hover:text-gray-300"><span className="font-semibold">Yüklemek için tıklayın</span> veya sürükleyip bırakın</p>
                                <p className="text-xs text-gray-500">PDF (Max 5MB)</p>
                            </div>
                            <input type="file" className="hidden" accept=".pdf" onChange={handleFileUpload} />
                        </label>
                    ) : (
                        <div className="flex items-center justify-between p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-cyan-500/20 rounded-lg">
                                    <Upload className="w-5 h-5 text-cyan-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white line-clamp-1">{data.cv.name}</p>
                                    <p className="text-xs text-cyan-400/80">{(data.cv.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>
                            <button
                                onClick={() => updateData({ ...data, cv: null })}
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
}
