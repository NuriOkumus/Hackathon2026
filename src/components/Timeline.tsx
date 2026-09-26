"use client";

import { motion } from "framer-motion";
import { Rocket, Clock, Code, Trophy, ArrowRight } from "lucide-react";
import Link from "next/link";

const steps = [
    {
        date: "1 Nisan",
        title: "Başvurular Açılıyor",
        icon: Rocket,
        color: "text-cyan-400",
        ring: "ring-cyan-500/30",
        bg: "bg-cyan-500/10",
    },
    {
        date: "23 Nisan",
        title: "Son Başvuru",
        icon: Clock,
        color: "text-purple-400",
        ring: "ring-purple-500/30",
        bg: "bg-purple-500/10",
    },
    {
        date: "13 Mayıs",
        title: "Hackathon Başlıyor",
        icon: Code,
        color: "text-orange-400",
        ring: "ring-orange-500/30",
        bg: "bg-orange-500/10",
    },
    {
        date: "14 Mayıs",
        title: "Ödül Töreni",
        icon: Trophy,
        color: "text-yellow-400",
        ring: "ring-yellow-500/30",
        bg: "bg-yellow-500/10",
    },
];

export default function Timeline() {
    return (
        <section id="timeline" className="py-16 md:py-24 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-cyan-500/5 blur-[120px] pointer-events-none rounded-full hidden sm:block" />

            <div className="container mx-auto px-4 relative z-10 max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16 md:mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-gray-300 tracking-widest uppercase mb-6">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                        Takvim
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                        Önemli Tarihler
                    </h2>
                </motion.div>

                {/* Desktop: horizontal steps */}
                <div className="hidden md:grid grid-cols-4 gap-0 relative">
                    {/* connecting line */}
                    <div className="absolute top-10 left-[12.5%] right-[12.5%] h-[2px] bg-gradient-to-r from-cyan-500/20 via-white/10 to-yellow-500/20" />

                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.6 }}
                            className="flex flex-col items-center text-center px-4"
                        >
                            <div className={`w-20 h-20 rounded-2xl ${step.bg} ring-1 ${step.ring} flex items-center justify-center mb-5 relative z-10`}>
                                <step.icon className={`w-8 h-8 ${step.color}`} />
                            </div>
                            <p className={`text-sm font-bold tracking-wide mb-1 ${step.color}`}>{step.date}</p>
                            <p className="text-sm text-gray-300 font-medium leading-snug">{step.title}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Mobile: vertical list */}
                <div className="md:hidden flex flex-col gap-6">
                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -16 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08, duration: 0.5 }}
                            className="flex items-center gap-5"
                        >
                            <div className={`w-14 h-14 rounded-xl ${step.bg} ring-1 ${step.ring} flex items-center justify-center flex-shrink-0`}>
                                <step.icon className={`w-6 h-6 ${step.color}`} />
                            </div>
                            <div>
                                <p className={`text-xs font-bold tracking-wider uppercase mb-0.5 ${step.color}`}>{step.date}</p>
                                <p className="text-sm text-gray-200 font-semibold">{step.title}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-14 text-center"
                >
                    <Link
                        href="/program"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/[0.03] border border-white/10 text-sm text-white font-medium hover:bg-white/[0.08] hover:border-cyan-500/40 transition-all duration-300 group"
                    >
                        <span>24 Saatlik Detaylı Program Akışı</span>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
