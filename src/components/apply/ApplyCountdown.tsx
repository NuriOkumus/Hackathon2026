"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const OPEN_DATE = new Date("2026-04-01T00:00:00+03:00");

function getTimeLeft() {
    const diff = OPEN_DATE.getTime() - Date.now();
    if (diff <= 0) return null;
    return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
    };
}

function Unit({ value, label }: { value: number; label: string }) {
    const display = String(value).padStart(2, "0");
    return (
        <div className="flex flex-col items-center gap-1.5 sm:gap-3">
            <div className="relative">
                <div className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center">
                    <span className="text-2xl sm:text-4xl md:text-5xl font-black text-white tabular-nums tracking-tight">
                        {display}
                    </span>
                </div>
                <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-cyan-400/5 blur-xl -z-10" />
            </div>
            <span className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest font-medium">{label}</span>
        </div>
    );
}

export default function ApplyCountdown({ onSkip }: { onSkip?: () => void }) {
    const [timeLeft, setTimeLeft] = useState(getTimeLeft);

    useEffect(() => {
        const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
        return () => clearInterval(id);
    }, []);

    if (timeLeft === null) {
        // Past March 30 — this component shouldn't be shown, parent handles it
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-center text-center"
        >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 text-xs font-medium tracking-wider uppercase mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                1 Nisan 2026
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
                Başvurular{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-orange-400">
                    Açılıyor
                </span>
            </h1>
            <p className="text-gray-500 text-sm sm:text-base md:text-lg max-w-md mb-10 sm:mb-14 px-4">
                1 Nisan 2026 gece yarısı başvurular açılacak.
                Takımını hazırla, zamanı gelince ilk sen başvur.
            </p>

            <div className="flex items-start gap-2 sm:gap-4 md:gap-6 mb-10 sm:mb-16">
                <Unit value={timeLeft.days} label="Gün" />
                <div className="text-xl sm:text-3xl md:text-4xl font-black text-white/20 mt-5 sm:mt-8 select-none">:</div>
                <Unit value={timeLeft.hours} label="Saat" />
                <div className="text-xl sm:text-3xl md:text-4xl font-black text-white/20 mt-5 sm:mt-8 select-none">:</div>
                <Unit value={timeLeft.minutes} label="Dakika" />
                <div className="text-xl sm:text-3xl md:text-4xl font-black text-white/20 mt-5 sm:mt-8 select-none">:</div>
                <Unit value={timeLeft.seconds} label="Saniye" />
            </div>

            {onSkip && (
                <button
                    onClick={onSkip}
                    className="mb-4 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-medium hover:bg-cyan-500/20 hover:text-cyan-300 transition-colors"
                >
                    Formu Göster →
                </button>
            )}

            <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-sm font-medium hover:bg-white/10 hover:text-white transition-colors"
            >
                ← Ana Sayfa
            </Link>
        </motion.div>
    );
}
