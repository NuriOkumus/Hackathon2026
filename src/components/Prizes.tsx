"use client";

import { motion } from "framer-motion";
import { Globe, Users, Trophy, Medal } from "lucide-react";
import { cn } from "@/lib/utils";

const mainPrizes = [
    {
        rank: 2,
        title: "2. Ödül",
        amount: "₺15.000",
        icon: Medal,
        color: "from-gray-300 to-gray-500", // Silver
        border: "border-gray-400",
        shadow: "shadow-gray-400/20",
        mobileOrder: "order-2",
        delay: 0.2
    },
    {
        rank: 1,
        title: "1. Ödül",
        amount: "₺25.000",
        icon: Trophy,
        color: "from-yellow-300 via-yellow-400 to-yellow-600", // Gold
        border: "border-yellow-400",
        shadow: "shadow-yellow-400/40",
        scale: true,
        mobileOrder: "order-1",
        delay: 0
    },
    {
        rank: 3,
        title: "3. Ödül",
        amount: "₺10.000",
        icon: Medal,
        color: "from-orange-700 to-amber-900", // Bronze
        border: "border-amber-700",
        shadow: "shadow-amber-700/20",
        mobileOrder: "order-3",
        delay: 0.4
    },
];

const additionalPrizes = [
    {
        icon: Globe,
        title: "Proje Vitrini",
        text: "Kazanan projeler, sektör profesyonellerine ve akademisyenlere özel sergileme alanında tanıtılır.",
    },
    {
        icon: Users,
        title: "Akademik & Endüstri Ağı",
        text: "500'den fazla akademisyen, araştırmacı ve sektör profesyoneliyle aynı çatı altında buluşma ve ağ kurma fırsatı.",
    },
];

export default function Prizes() {
    return (
        <section id="prizes" className="py-12 md:py-16 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-purple-500/10 blur-[120px] rounded-full pointer-events-none hidden sm:block" />
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none hidden sm:block" />

            <div className="container mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">Büyük Ödüller</h2>
                    <p className="text-gray-400">Geleceği şekillendiren fikirler karşılıksız kalmaz.</p>
                </motion.div>

                {/* Main Cash Prizes */}
                <div className="flex flex-col md:flex-row items-end justify-center gap-6 mb-12 relative z-10">
                    {mainPrizes.map((prize, index) => {
                        const borderGradient =
                            prize.rank === 1
                                ? "from-yellow-400/60 via-yellow-600/20 to-yellow-900/5"
                                : prize.rank === 2
                                    ? "from-gray-300/40 via-gray-500/10 to-transparent"
                                    : "from-amber-600/50 via-amber-800/10 to-transparent";

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ delay: prize.delay, duration: 0.7, ease: "easeOut" }}
                                className={cn("relative w-full md:w-80 group md:order-none", prize.mobileOrder, prize.scale ? "z-10" : "z-0")}
                            >
                                {/* Glowing halo behind the whole card */}
                                <div className={cn(
                                    "absolute inset-0 blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700 bg-gradient-to-br -z-10",
                                    prize.color
                                )} />

                                {/* Gradient border wrapper */}
                                <div className={cn("p-[1px] rounded-[2rem] bg-gradient-to-b backdrop-blur-sm transition-all duration-500 group-hover:scale-[1.02]", borderGradient)}>
                                    <div className={cn(
                                        "relative rounded-[2rem] bg-[#05050a]/40 backdrop-blur-2xl flex flex-col items-center p-5 sm:p-8 overflow-hidden border border-white/5",
                                        prize.scale && "py-8 sm:py-10 bg-[#05050a]/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)]"
                                    )}>
                                        {/* Inner Glass Highlight */}
                                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />

                                        {/* Ambient glow inside card */}
                                        <div className={cn("absolute inset-0 blur-[80px] -z-10 opacity-10 rounded-[2rem] bg-gradient-to-b transition-opacity duration-500 group-hover:opacity-20", prize.color)} />

                                        <div className={cn(
                                            "w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-4 sm:mb-5 bg-gradient-to-b p-[1px] shadow-2xl transition-transform duration-500 group-hover:scale-110",
                                            prize.color.replace('to-', 'to-transparent via-') // creates a subtle ring effect
                                        )}>
                                            <div className="w-full h-full rounded-full bg-[#05050a]/80 backdrop-blur-xl flex items-center justify-center border border-white/10">
                                                <prize.icon className={cn("w-7 h-7 sm:w-10 sm:h-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]", `text-${prize.color.split('-')[1]}-300`)} />
                                            </div>
                                        </div>

                                        <h3 className={cn("text-2xl font-bold mb-3 tracking-wide bg-clip-text text-transparent bg-gradient-to-r", prize.color)}>
                                            {prize.title}
                                        </h3>
                                        <p className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tighter drop-shadow-md">
                                            {prize.amount}
                                        </p>
                                        {prize.rank === 1 && (
                                            <p className="mt-3 text-xs text-yellow-300/80 font-medium leading-snug border-t border-yellow-500/20 pt-3">
                                                + Şirket kurulması halinde<br />Sanal Ofis Desteği
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Additional Benefits */}
                <h3 className="text-xl font-semibold text-gray-400 mb-8 uppercase tracking-widest">Ayrıca</h3>

                <div className="grid md:grid-cols-2 gap-5 max-w-2xl mx-auto">
                    {additionalPrizes.map((prize, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 + (index * 0.1) }}
                            className="p-6 rounded-2xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.06] hover:border-cyan-500/20 transition-all duration-300 group cursor-default text-left"
                        >
                            <div className="p-2.5 bg-cyan-500/10 rounded-xl w-fit mb-4 group-hover:bg-cyan-500/20 transition-colors">
                                <prize.icon className="w-5 h-5 text-cyan-400" />
                            </div>
                            <h4 className="font-semibold text-white mb-2 text-sm">{prize.title}</h4>
                            <p className="text-gray-500 text-xs leading-relaxed">{prize.text}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
