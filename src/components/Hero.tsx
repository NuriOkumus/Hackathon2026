"use client";

import { motion } from "framer-motion";
import { ChevronDown, MapPin } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import HeroBackground from "./HeroBackground";

function useCountdown(target: Date) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const update = () => {
            const diff = target.getTime() - Date.now();
            if (diff <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }
            setTimeLeft({
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((diff % (1000 * 60)) / 1000),
            });
        };
        update();
        const id = setInterval(update, 1000);
        return () => clearInterval(id);
    }, [target]);

    return timeLeft;
}

const HACKATHON_START = new Date("2026-05-13T12:00:00+03:00");
const SUBMIT_DEADLINE = new Date("2026-05-14T12:00:00+03:00");

function getPhase(): "before" | "during" | "after" {
    const now = Date.now();
    if (now < HACKATHON_START.getTime()) return "before";
    if (now < SUBMIT_DEADLINE.getTime()) return "during";
    return "after";
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
    return (
        <div className="flex flex-col items-center group">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-24 md:h-24 rounded-2xl bg-[#05050a]/40 backdrop-blur-md border border-white/10 flex items-center justify-center overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] group-hover:border-cyan-500/30 transition-colors duration-500">
                {/* Inner ambient glow */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                <span className="text-2xl sm:text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 tabular-nums tracking-tighter">
                    {String(value).padStart(2, "0")}
                </span>
            </div>
            <span className="text-[10px] md:text-xs text-cyan-400/80 font-bold uppercase tracking-[0.2em] mt-2 sm:mt-3 group-hover:text-cyan-400 transition-colors">
                {label}
            </span>
        </div>
    );
}

function Countdown({ targetDate }: { targetDate: Date }) {
    const countdown = useCountdown(targetDate);
    return (
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-4">
            <CountdownUnit value={countdown.days} label="Gün" />
            <span className="text-2xl sm:text-3xl md:text-5xl font-light text-white/20 pb-7 sm:pb-8">:</span>
            <CountdownUnit value={countdown.hours} label="Saat" />
            <span className="text-2xl sm:text-3xl md:text-5xl font-light text-white/20 pb-7 sm:pb-8">:</span>
            <CountdownUnit value={countdown.minutes} label="Dakika" />
            <span className="text-2xl sm:text-3xl md:text-5xl font-light text-white/20 pb-7 sm:pb-8">:</span>
            <CountdownUnit value={countdown.seconds} label="Saniye" />
        </div>
    );
}

export default function Hero() {
    const [phase, setPhase] = useState<"before" | "during" | "after">(getPhase);

    useEffect(() => {
        const id = setInterval(() => setPhase(getPhase()), 1000);
        return () => clearInterval(id);
    }, []);

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-20">
            {/* Holographic Video Background */}
            <HeroBackground />

            {/* Extra darkened overlay specifically for text contrast on Hero */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#05050a]/40 via-transparent to-[#05050a] pointer-events-none" />

            <div className="container mx-auto px-4 text-center z-10 w-full max-w-5xl">

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="inline-flex items-center justify-center mb-8"
                >
                    <div className="px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-md flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-cyan-50 text-xs font-semibold tracking-wide">Muğla</span>
                    </div>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 1, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-black mb-4 tracking-tighter leading-[0.9]"
                    style={{ textShadow: '0 10px 40px rgba(0,0,0,0.8)' }}
                >
                    <span className="text-white">Akıllı Şehirler</span> <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 drop-shadow-lg">
                        Hackathonu
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
                    className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto mb-6 px-4 font-light leading-relaxed"
                    style={{ textShadow: '0 4px 12px rgba(0,0,0,0.9)' }}
                >
                    Muğla Sıtkı Koçman Üniversitesi&apos;nde geleceği kodlayın.
                </motion.p>

                {/* Premium Glass Countdown */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                    className="mt-4 mb-8 flex flex-col items-center gap-4"
                >
                    {phase === "before" && (
                        <>
                            <p className="text-xs uppercase tracking-[0.2em] text-cyan-400/60 font-bold">Hackathona Kalan Süre</p>
                            <Countdown targetDate={HACKATHON_START} />
                        </>
                    )}
                    {phase === "during" && (
                        <>
                            <p className="text-xs uppercase tracking-[0.2em] text-orange-400/80 font-bold">Teslim'e Kalan Süre</p>
                            <Countdown targetDate={SUBMIT_DEADLINE} />
                        </>
                    )}
                    {phase === "after" && (
                        <div className="flex flex-col items-center gap-2">
                            <p className="text-xs uppercase tracking-[0.2em] text-cyan-400/60 font-bold">Hackathon Tamamlandı</p>
                            <p className="text-gray-400 text-sm">13–14 Mayıs 2026 · Muğla</p>
                        </div>
                    )}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.8, ease: "easeOut" }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-5 px-4"
                >
                    <Link
                        href="/submit"
                        className="group relative w-full sm:w-auto px-8 sm:px-10 h-12 sm:h-14 md:h-16 rounded-full border border-cyan-500/50 bg-cyan-500/10 backdrop-blur-md text-white font-bold text-sm sm:text-base md:text-lg flex flex-col items-center justify-center overflow-hidden transition-all hover:bg-cyan-500/20 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(6,182,212,0.4)]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <span className="relative z-10 drop-shadow-md">Proje Teslim</span>
                        <span className="relative z-10 text-[9px] md:text-[10px] font-bold text-cyan-200 opacity-90 leading-none mt-1 uppercase tracking-widest transition-colors duration-300">14 Mayıs 12:00</span>
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-purple-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 -z-10" />
                    </Link>
                </motion.div>

            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.4 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
            >
                <Link
                    href="#partners"
                    className="flex flex-col items-center gap-2 group"
                >
                    <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold group-hover:text-cyan-400 transition-colors">Keşfet</span>
                    <motion.div
                        animate={{ y: [0, 6, 0] }}
                        transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
                        className="w-8 h-8 rounded-full border border-cyan-500/40 bg-cyan-500/10 flex items-center justify-center group-hover:border-cyan-400/70 group-hover:bg-cyan-500/20 transition-colors"
                    >
                        <ChevronDown className="w-4 h-4 text-cyan-400" />
                    </motion.div>
                </Link>
            </motion.div>
        </section>
    );
}
