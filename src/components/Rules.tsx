"use client";

import { motion } from "framer-motion";
import { Shield, Users, Code, Trophy, AlertCircle, CheckCircle } from "lucide-react";

const rulesData = [
    {
        icon: Users,
        title: "Katılım Şartları",
        color: "cyan",
        rules: [
            "3 ila 5 kişilik takımlardan oluşur (15 takım kapasitesi)",
            "Tüm üniversite öğrencileri katılabilir",
            "Başvuruda Github hesabı zorunludur",
            "Yüksek katılım durumunda ön eleme yapılabilir",
        ],
    },
    {
        icon: Code,
        title: "Teknik Kurallar",
        color: "purple",
        rules: [
            "Private Github reposu organizasyon tarafından sağlanacak",
            "Tüm kod geliştirmeleri hackathon süresince yapılmalı",
            "Son commit zorunludur (proje bitimi)",
            "Herhangi bir teknoloji kullanılabilir",
        ],
    },
    {
        icon: Trophy,
        title: "Değerlendirme Kriterleri",
        color: "yellow",
        rules: [
            "Fikir ve Etki - Probleme uygunluk ve yaratıcılık",
            "Teknik Uygulama - Kod kalitesi ve işlevsellik",
            "Tasarım ve Sunum - UX/UI ve proje sunumu",
            "Her takım 6 dk sunum: 3 dk proje + 1 dk demo + 2 dk soru-cevap",
        ],
    },
    {
        icon: AlertCircle,
        title: "Teslim Gereklilikleri",
        color: "red",
        rules: [
            "Çalışan ürün (live demo)",
            "Sunum dosyası (portala yüklenecek)",
            "Son commit ve Github repo erişimi",
        ],
    },
];

export default function Rules() {
    return (
        <section id="rules" className="py-16 relative overflow-hidden">
            {/* Background decorations */}

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium mb-6">
                        <Shield className="w-4 h-4" />
                        Kurallara Uyun
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        Hackathon <span className="text-gradient">Kuralları</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Adil ve keyifli bir yarışma için tüm katılımcıların uyması gereken kurallar
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-4 sm:gap-6 max-w-6xl mx-auto">
                    {rulesData.map((section, index) => {
                        const Icon = section.icon;
                        const colorMap: Record<string, { bg: string; border: string; text: string; glow: string }> = {
                            cyan: {
                                bg: "bg-cyan-950/30",
                                border: "border-cyan-500/20",
                                text: "text-cyan-400",
                                glow: "hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]",
                            },
                            purple: {
                                bg: "bg-purple-950/30",
                                border: "border-purple-500/20",
                                text: "text-purple-400",
                                glow: "hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]",
                            },
                            yellow: {
                                bg: "bg-yellow-950/30",
                                border: "border-yellow-500/20",
                                text: "text-yellow-400",
                                glow: "hover:shadow-[0_0_30px_rgba(250,204,21,0.15)]",
                            },
                            red: {
                                bg: "bg-red-950/30",
                                border: "border-red-500/20",
                                text: "text-red-400",
                                glow: "hover:shadow-[0_0_30px_rgba(239,68,68,0.15)]",
                            },
                        };

                        const colors = colorMap[section.color];

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className={`${colors.bg} ${colors.border} border rounded-2xl p-4 sm:p-6 ${colors.glow} transition-all duration-300`}
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`${colors.bg} ${colors.border} border-2 p-3 rounded-xl`}>
                                        <Icon className={`w-6 h-6 ${colors.text}`} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">{section.title}</h3>
                                </div>

                                <ul className="space-y-3">
                                    {section.rules.map((rule, ruleIndex) => (
                                        <li key={ruleIndex} className="flex items-start gap-3 text-gray-300">
                                            <CheckCircle className={`w-5 h-5 ${colors.text} flex-shrink-0 mt-0.5`} />
                                            <span className="text-sm leading-relaxed">{rule}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Additional Info Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-12 max-w-4xl mx-auto p-px rounded-2xl bg-gradient-to-r from-primary/35 to-secondary/25"
                >
                    <div className="rounded-2xl bg-background p-6 md:p-8">
                        <div className="flex items-start gap-4">
                            <Shield className="w-8 h-8 text-primary flex-shrink-0" />
                            <div>
                                <h4 className="text-lg font-bold text-white mb-2">Kod Sahipliği ve Lisanslama</h4>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Hackathon süresince geliştirilen tüm projeler katılımcı takımların mülkiyetindedir.
                                    Ancak, proje sunumları organizasyon tarafından tanıtım amaçlı kullanılabilir.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
