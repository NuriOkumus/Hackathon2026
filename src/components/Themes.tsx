"use client";

import { motion, Variants } from "framer-motion";
import { Lightbulb, Leaf, Bus, Trash2, MapPin, Wheat } from "lucide-react";
import { cn } from "@/lib/utils";

const themes = [
    {
        icon: Lightbulb,
        title: "Akıllı Şehir Çözümleri",
        desc: "Kentsel yaşamı daha verimli, erişilebilir ve yönetilebilir kılan teknolojik altyapılar geliştirin.",
        color: "text-amber-400",
        glow: "rgba(251, 191, 36, 0.15)",
        borderHover: "hover:border-amber-500/50",
    },
    {
        icon: Leaf,
        title: "Yeşil Enerji & Çevre",
        desc: "Yenilenebilir enerji, iklim değişikliğiyle mücadele ve karbon ayak izi azaltma çözümleri.",
        color: "text-emerald-400",
        glow: "rgba(52, 211, 153, 0.15)",
        borderHover: "hover:border-emerald-500/50",
    },
    {
        icon: Bus,
        title: "Ulaşım & Mobilite",
        desc: "Toplu taşıma optimizasyonu, akıllı trafik yönetimi ve intermodal ulaşım çözümleri.",
        color: "text-blue-400",
        glow: "rgba(96, 165, 250, 0.15)",
        borderHover: "hover:border-blue-500/50",
    },
    {
        icon: Trash2,
        title: "Atık Yönetimi & Geri Dönüşüm",
        desc: "Akıllı atık takibi, geri dönüşüm teşvik sistemleri ve sıfır atık şehir modelleri.",
        color: "text-orange-400",
        glow: "rgba(251, 146, 60, 0.15)",
        borderHover: "hover:border-orange-500/50",
    },
    {
        icon: MapPin,
        title: "Turizm Teknolojileri",
        desc: "Muğla'nın turizm potansiyelini dijital araçlarla zenginleştiren yenilikçi deneyimler.",
        color: "text-purple-400",
        glow: "rgba(192, 132, 252, 0.15)",
        borderHover: "hover:border-purple-500/50",
    },
    {
        icon: Wheat,
        title: "Tarım & Üretim",
        desc: "Precision farming, akıllı sulama, tarım veri analitiği ve gıda güvencesi çözümleri.",
        color: "text-teal-400",
        glow: "rgba(45, 212, 191, 0.15)",
        borderHover: "hover:border-teal-500/50",
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

export default function Themes() {
    return (
        <section id="themes" className="py-24 md:py-32 relative overflow-hidden">
            {/* Ambient Background Glow specific to themes section */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_100%,rgba(34,211,238,0.03),transparent)] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center mb-10 sm:mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/[0.03] border border-white/10 text-gray-300 text-xs font-semibold tracking-widest uppercase mb-8 backdrop-blur-md">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                        Odak Noktaları
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-6 tracking-tight text-white">
                        Hackathon <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Temaları</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg md:text-xl font-light">
                        Şehrin gerçek problemlerine yenilikçi, sürdürülebilir ve uygulanabilir teknolojik çözümler üretin.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto"
                >
                    {themes.map((theme, i) => (
                        <motion.div
                            key={i}
                            variants={itemVariants}
                            className={cn(
                                "group relative p-5 sm:p-8 rounded-3xl backdrop-blur-md overflow-hidden transition-all duration-500 cursor-default hover:-translate-y-2",
                                "bg-white/[0.02] border border-white/10",
                                theme.borderHover
                            )}
                            style={{
                                // Use a CSS variable for the dynamic hover glow based on the theme color
                                '--hover-glow': theme.glow,
                            } as React.CSSProperties}
                        >
                            {/* Inner ambient glow that activates on hover */}
                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                style={{
                                    background: `radial-gradient(circle at top right, var(--hover-glow), transparent 70%)`
                                }}
                            />

                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 group-hover:bg-white/[0.08]">
                                    <theme.icon className={cn("w-7 h-7", theme.color)} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all duration-300">
                                    {theme.title}
                                </h3>
                                <p className="text-sm md:text-base text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                                    {theme.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
