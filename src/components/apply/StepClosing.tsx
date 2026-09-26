"use client";

import Link from "next/link";
import { ClosingData } from "./ApplyForm";
import { CustomSelect } from "./FormFields";
import { ValidationErrors } from "@/lib/validations";

interface Props {
    data: ClosingData;
    updateData: (data: ClosingData) => void;
    errors: ValidationErrors;
    onBlurField?: () => void;
}

export default function StepClosing({ data, updateData, errors, onBlurField }: Props) {
    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-2xl font-bold text-white mb-2">Son Dokunuşlar</h3>
                <p className="text-gray-400 text-sm">Başvurunuzu tamamlamak üzereyiz.</p>
            </div>

            <div className="space-y-6">
                <CustomSelect
                    label="Bizi Nereden Duydunuz?"
                    value={data.source}
                    onChange={(val) => updateData({ ...data, source: val })}
                    error={errors["closing.source"]}
                    options={[
                        { value: "social_media", label: "Sosyal Medya (Instagram, Twitter, vb.)" },
                        { value: "university", label: "Üniversite / Kulüp Duyuruları" },
                        { value: "friends", label: "Arkadaş Tavsiyesi" },
                        { value: "vbt", label: "VBT Duyuruları" },
                        { value: "other", label: "Diğer" }
                    ]}
                />

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-300 ml-1 flex items-center justify-between">
                        Eklemek İstediğiniz Not?
                        <span className="text-[10px] uppercase text-gray-500 tracking-wider">Opsiyonel</span>
                    </label>
                    <textarea
                        value={data.notes}
                        onChange={(e) => updateData({ ...data, notes: e.target.value })}
                        onBlur={onBlurField}
                        rows={4}
                        placeholder="Örn: Hackathon süresince özel bir diyet programına ihtiyacım var..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none"
                    />
                </div>
            </div>

            <div className="space-y-3">
                {/* KVKK */}
                <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${errors["closing.kvkkAccepted"] ? "border-red-500/50 bg-red-500/5" : "border-white/10 bg-white/5 hover:border-white/20"}`}>
                    <input
                        type="checkbox"
                        checked={data.kvkkAccepted}
                        onChange={(e) => updateData({ ...data, kvkkAccepted: e.target.checked })}
                        className="mt-0.5 w-4 h-4 rounded accent-cyan-500 shrink-0"
                    />
                    <span className="text-sm text-gray-300 leading-relaxed">
                        <Link href="/kvkk" target="_blank" className="text-primary hover:underline font-medium">KVKK Aydınlatma Metni</Link>'ni okudum ve kişisel verilerimin işlenmesine onay veriyorum.
                    </span>
                </label>
                {errors["closing.kvkkAccepted"] && (
                    <p className="text-xs text-red-400 ml-1">{errors["closing.kvkkAccepted"]}</p>
                )}

                {/* Katılım Şartları */}
                <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${errors["closing.termsAccepted"] ? "border-red-500/50 bg-red-500/5" : "border-white/10 bg-white/5 hover:border-white/20"}`}>
                    <input
                        type="checkbox"
                        checked={data.termsAccepted}
                        onChange={(e) => updateData({ ...data, termsAccepted: e.target.checked })}
                        className="mt-0.5 w-4 h-4 rounded accent-cyan-500 shrink-0"
                    />
                    <span className="text-sm text-gray-300 leading-relaxed">
                        <Link href="/katilim-sartlari" target="_blank" className="text-primary hover:underline font-medium">Katılım Şartları ve Koşulları</Link>'nı okudum, kabul ediyorum.
                    </span>
                </label>
                {errors["closing.termsAccepted"] && (
                    <p className="text-xs text-red-400 ml-1">{errors["closing.termsAccepted"]}</p>
                )}
            </div>

            <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/30">
                <p className="text-sm text-orange-200/80 leading-relaxed">
                    <strong className="text-orange-400">Not:</strong> Başvurunuzu tamamlamadan önce tüm bilgilerin doğruluğundan emin olun.
                    Verdiğiniz iletişim bilgileri üzerinden tarafınıza ulaşılacaktır.
                </p>
            </div>
        </div>
    );
}
