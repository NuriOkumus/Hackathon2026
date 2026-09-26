"use client";

import { motion } from "framer-motion";
import { UserPlus, Users as UsersIcon, FileCheck, Rocket, MessageSquare, ArrowRight, Code } from "lucide-react";
import Link from "next/link";

const steps = [
    {
        icon: UserPlus,
        title: "Form ve Github",
        description: "Başvuru formunu doldurun. Kişisel bilgileriniz, yetkinlikleriniz ve Github hesabınızı belirtin (zorunlu).",
        badge: "Adım 1",
    },
    {
        icon: FileCheck,
        title: "Değerlendirme",
        description: "Yüksek başvuru durumunda ön eleme yapılabilir. Github profilleriniz ve yetkinlikleriniz değerlendirilecek.",
        badge: "Adım 2",
    },
    {
        icon: UsersIcon,
        title: "Onay ve Takım",
        description: "Onay alan katılımcılara email gönderilir. Takımlar oluşturulur, her takıma grup numarası atanır.",
        badge: "Adım 3",
    },
    {
        icon: Code,
        title: "Github Repo",
        description: "Hackathon organizasyonu tarafından her takım için private repo oluşturulacak. Tüm geliştirmeler burada yapılacak.",
        badge: "Adım 4",
    },
    {
        icon: Rocket,
        title: "Hackathon Günü",
        description: "Atatürk Kültür Merkezi'nde check-in yapın! Swag pack'inizi alın ve 24 saatlik maratona başlayın.",
        badge: "Final",
    },
];

export default function HowToApply() {
    return (
        <section id="how-to-apply" className="py-16 relative overflow-hidden">
            {/* Background gradient */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-full bg-primary/5 blur-[120px] pointer-events-none hidden sm:block" />

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/30 text-secondary text-sm font-medium mb-6">
                        <FileCheck className="w-4 h-4" />
                        Başvuru Süreci
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4">
                        Nasıl <span className="text-gradient">Başvurulur?</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        VBT Hackathon 2026&apos;ya katılmak için takip etmeniz gereken adımlar
                    </p>
                </motion.div>

                {/* Steps Timeline */}
                <div className="max-w-4xl mx-auto space-y-6">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        const isLast = index === steps.length - 1;

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="relative"
                            >
                                <div className="flex items-start gap-4 md:gap-6">
                                    {/* Icon Circle */}
                                    <div className="relative flex-shrink-0">
                                        {/* Connecting Line */}
                                        {!isLast && (
                                            <div className="absolute left-1/2 -translate-x-1/2 top-[56px] w-0.5 h-[calc(100%+1rem)] bg-gradient-to-b from-primary/50 to-transparent" />
                                        )}

                                        <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full ${isLast ? 'bg-gradient-to-br from-yellow-500 to-orange-500' : 'bg-primary'} flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.3)] z-10 relative`}>
                                            <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                                        </div>
                                    </div>

                                    {/* Content Card */}
                                    <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6 hover:bg-white/[0.07] hover:border-primary/30 transition-all duration-300 group">
                                        <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                                            {step.title}
                                        </h3>
                                        <p className="text-gray-400 leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mt-10 text-center relative"
                >
                    <div className="absolute inset-0 bg-cyan-500/10 blur-[100px] rounded-full -z-10" />

                    <div className="p-px rounded-[2rem] bg-gradient-to-br from-cyan-500/40 via-purple-500/10 to-transparent max-w-4xl mx-auto shadow-2xl shadow-cyan-500/10">
                        <div className="rounded-[2rem] bg-[#05050a]/60 backdrop-blur-2xl p-6 sm:p-10 relative overflow-hidden border border-white/5">
                            {/* Inner Glass Highlights */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px]" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px]" />

                            <h3 className="relative z-10 text-xl sm:text-2xl md:text-4xl font-bold mb-3 text-white tracking-tight">
                                Başvurmaya <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Hazır mısın?</span>
                            </h3>
                            <p className="relative z-10 text-gray-300 mb-6 max-w-2xl mx-auto text-base leading-relaxed">
                                {Date.now() >= new Date("2026-04-01T00:00:00+03:00").getTime()
                                    ? <>Kontenjan sınırlı, hemen başvurunu tamamla. Son başvuru tarihi <strong className="text-white">23 Nisan 2026</strong>.</>
                                    : <>Başvurular <strong className="text-white">1 Nisan</strong>&apos;da açılacak. Tüm süreçten ilk sen haberdar olmak için takipte kal.</>
                                }
                            </p>

                            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-5">
                                <Link
                                    href="/apply"
                                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all transform hover:scale-105"
                                >
                                    Hemen Başvur
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </div>

                        </div>
                    </div>
                </motion.div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8 max-w-5xl mx-auto relative z-10">
                    {[
                        { title: "Takım Büyüklüğü", value: "3-5 Kişi", desc: "15 takım kapasitesi" },
                        { title: "Lokasyon", value: "AKM", desc: "Atatürk Kültür Merkezi, Muğla" },
                        { title: "Swag Pack", value: "Dahil", desc: "Tişört, rozet, sticker, defter..." },
                    ].map((info, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
                            className="group relative p-px rounded-2xl bg-gradient-to-b from-white/10 to-white/5 hover:from-cyan-500/30 hover:to-purple-500/10 transition-colors duration-500"
                        >
                            <div className="h-full rounded-2xl bg-[#05050a]/60 backdrop-blur-xl p-5 sm:p-6 text-center border border-white/5 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <p className="relative z-10 text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2 drop-shadow-sm">{info.value}</p>
                                <p className="relative z-10 text-white font-bold mb-2 text-lg tracking-wide">{info.title}</p>
                                <p className="relative z-10 text-sm text-gray-400 group-hover:text-gray-300 transition-colors">{info.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
