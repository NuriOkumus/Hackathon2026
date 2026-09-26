"use client";

import { motion } from "framer-motion";
import { Activity, Users, Zap, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
    { value: "24", unit: "Saat", label: "Kesintisiz Kodlama", icon: Activity, color: "text-cyan-400", bg: "bg-cyan-500/10" },
    { value: "75", unit: "", label: "Seçkin Katılımcı", icon: Users, color: "text-purple-400", bg: "bg-purple-500/10" },
    { value: "15", unit: "", label: "İnovatif Takım", icon: Zap, color: "text-amber-400", bg: "bg-amber-500/10" },
];

const lines = [
    { ln: 1,  tokens: [{ t: "const ", c: "text-purple-400" }, { t: "hackathon", c: "text-cyan-300" }, { t: " = {", c: "text-gray-300" }] },
    { ln: 2,  tokens: [{ t: "  ad", c: "text-blue-300" }, { t: ": ", c: "text-gray-400" }, { t: '"VBT Hackathon 2026"', c: "text-orange-400" }, { t: ",", c: "text-gray-400" }] },
    { ln: 3,  tokens: [{ t: "  tema", c: "text-blue-300" }, { t: ": ", c: "text-gray-400" }, { t: '"Akıllı Şehirler"', c: "text-orange-400" }, { t: ",", c: "text-gray-400" }] },
    { ln: 4,  tokens: [{ t: "  süre", c: "text-blue-300" }, { t: ": ", c: "text-gray-400" }, { t: "24", c: "text-cyan-400" }, { t: ",  ", c: "text-gray-400" }, { t: "// saat", c: "text-gray-600" }] },
    { ln: 5,  tokens: [{ t: "  katılımcı", c: "text-blue-300" }, { t: ": ", c: "text-gray-400" }, { t: "75", c: "text-cyan-400" }, { t: ",", c: "text-gray-400" }] },
    { ln: 6,  tokens: [{ t: "  takımlar", c: "text-blue-300" }, { t: ": ", c: "text-gray-400" }, { t: "15", c: "text-cyan-400" }, { t: ",", c: "text-gray-400" }] },
    { ln: 7,  tokens: [{ t: "  ödülHavuzu", c: "text-blue-300" }, { t: ": ", c: "text-gray-400" }, { t: '"₺50.000"', c: "text-orange-400" }, { t: ",", c: "text-gray-400" }] },
    { ln: 8,  tokens: [{ t: "  mekan", c: "text-blue-300" }, { t: ": ", c: "text-gray-400" }, { t: '"AKM, Muğla"', c: "text-orange-400" }, { t: ",", c: "text-gray-400" }] },
    { ln: 9,  tokens: [{ t: "  tarih", c: "text-blue-300" }, { t: ": ", c: "text-gray-400" }, { t: '"13–14 Mayıs 2026"', c: "text-orange-400" }, { t: ",", c: "text-gray-400" }] },
    { ln: 10, tokens: [{ t: "  özellikler", c: "text-blue-300" }, { t: ": [", c: "text-gray-400" }] },
    { ln: 11, tokens: [{ t: '    "Üniversite İşbirliği"', c: "text-orange-400" }, { t: ",", c: "text-gray-400" }] },
    { ln: 12, tokens: [{ t: '    "Gerçek Dünya Problemleri"', c: "text-orange-400" }, { t: ",", c: "text-gray-400" }] },
    { ln: 13, tokens: [{ t: '    "Sektör Bağlantısı"', c: "text-orange-400" }, { t: ",", c: "text-gray-400" }] },
    { ln: 14, tokens: [{ t: "  ],", c: "text-gray-400" }] },
    { ln: 15, tokens: [{ t: "};", c: "text-gray-300" }] },
    { ln: 16, tokens: [] },
    { ln: 17, tokens: [{ t: "export default ", c: "text-purple-400" }, { t: "hackathon", c: "text-cyan-300" }, { t: ";", c: "text-gray-400" }] },
];

export default function About() {
    return (
        <section id="about" className="py-12 md:py-20 relative overflow-hidden">
            <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-cyan-500/[0.03] blur-[150px] -translate-y-1/2 -translate-x-1/2 rounded-full pointer-events-none hidden sm:block" />

            <div className="container mx-auto px-4 relative z-10 w-full max-w-7xl">

                {/* Hackathon Nedir? */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="mb-16 md:mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-gray-300 tracking-widest uppercase mb-6">
                        <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                        Hackathon Nedir?
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 items-start">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-snug tracking-tight">
                                Fikirden Prototipin,{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                                    24 Saatte.
                                </span>
                            </h2>
                            <p className="text-gray-400 text-base leading-relaxed font-light">
                                Hackathon; yazılımcıların, tasarımcıların ve girişimcilerin belirli bir süre içinde
                                bir araya gelip <strong className="text-gray-200 font-medium">gerçek dünyanın problemlerine</strong> hızlı
                                ve yaratıcı çözümler ürettiği yoğun bir inovasyon etkinliğidir. Rekabet değil, iş birliği odaklıdır.
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { emoji: "⏱", title: "Yoğun Tempo", desc: "24 saat kesintisiz üretim" },
                                { emoji: "🤝", title: "Ekip Ruhu", desc: "3–5 kişilik karma takımlar" },
                                { emoji: "🚀", title: "Hızlı Prototip", desc: "Fikirden çalışan ürüne" },
                            ].map((item) => (
                                <div
                                    key={item.title}
                                    className="flex flex-col gap-2 p-4 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:border-cyan-500/20 transition-colors duration-300"
                                >
                                    <span className="text-2xl">{item.emoji}</span>
                                    <p className="text-sm font-semibold text-white">{item.title}</p>
                                    <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">

                    {/* Terminal Block */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative"
                    >
                        {/* Glow backdrop */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-purple-500/10 blur-2xl rounded-2xl scale-105" />

                        <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#0d0d14]">
                            {/* Window chrome */}
                            <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.03] border-b border-white/[0.06]">
                                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                                <div className="w-3 h-3 rounded-full bg-green-500/70" />
                                <span className="ml-3 text-xs text-gray-500 font-mono">hackathon.ts</span>
                            </div>

                            {/* Code body */}
                            <div className="p-4 sm:p-6 overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <tbody>
                                        {lines.map((line, i) => (
                                            <motion.tr
                                                key={line.ln}
                                                initial={{ opacity: 0, x: -8 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: i * 0.04, duration: 0.3 }}
                                            >
                                                <td className="pr-4 text-right text-gray-600 font-mono text-xs select-none w-6 align-top pt-0.5">
                                                    {line.ln}
                                                </td>
                                                <td className="font-mono text-sm leading-6">
                                                    {line.tokens.map((token, j) => (
                                                        <span key={j} className={token.c}>{token.t}</span>
                                                    ))}
                                                    {line.tokens.length === 0 && <span>&nbsp;</span>}
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Status bar */}
                            <div className="flex items-center justify-between px-4 py-2 bg-cyan-500/10 border-t border-cyan-500/20">
                                <span className="text-[10px] font-mono text-cyan-400/70 tracking-wider">TypeScript</span>
                                <span className="text-[10px] font-mono text-gray-600">UTF-8</span>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                                    <span className="text-[10px] font-mono text-cyan-400/70">LIVE</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Content Side */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="flex flex-col justify-center"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-gray-300 tracking-widest uppercase mb-6 w-fit">
                            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                            Misyonumuz
                        </div>

                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
                            Bölgesel Sorunlara <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
                                Gerçek Çözümler
                            </span>
                        </h2>

                        <p className="text-gray-400 text-base sm:text-lg leading-relaxed mb-8 font-light">
                            VBT Hackathon, sıradan bir kodlama yarışması değil; akademi, sektör ve öğrenci
                            etkileşimini maksimum seviyeye çıkaran, Muğla bölgesinin sürdürülebilir geleceği için kod yazılan bir
                            <strong className="text-cyan-400 font-medium"> teknoloji üssüdür.</strong>
                        </p>

                        {/* Konu duyuru uyarısı */}
                        <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-amber-500/5 border border-amber-500/20 mb-8">
                            <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <p className="text-xs text-amber-300/80 leading-relaxed">
                                <span className="font-semibold text-amber-300">Ana tema:</span> Akıllı Şehirler — yarışma konuları etkinlik başlangıcında duyurulacaktır.
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-3 md:gap-4 pt-6 border-t border-white/10">
                            {stats.map((stat, i) => (
                                <div key={i} className="text-center group">
                                    <div className={cn("w-10 h-10 md:w-12 md:h-12 mx-auto rounded-full flex items-center justify-center mb-3 transition-transform duration-500 group-hover:scale-110", stat.bg)}>
                                        <stat.icon className={cn("w-5 h-5 md:w-6 md:h-6", stat.color)} />
                                    </div>
                                    <div className="flex items-baseline justify-center gap-1 mb-1">
                                        <span className="text-xl sm:text-2xl md:text-4xl font-bold text-white tracking-tight">{stat.value}</span>
                                        {stat.unit && <span className="text-xs sm:text-sm md:text-lg text-gray-400 font-medium">{stat.unit}</span>}
                                    </div>
                                    <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 font-medium uppercase tracking-wider">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
