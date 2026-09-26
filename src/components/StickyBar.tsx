"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function StickyBar() {
    const [visible, setVisible] = useState(false);
    const [dismissed, setDismissed] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setVisible(window.scrollY > 500);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (pathname === "/apply") return null;

    return (
        <AnimatePresence>
            {visible && !dismissed && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed bottom-0 left-0 right-0 z-50 md:bottom-6 md:left-1/2 md:-translate-x-1/2 md:w-max"
                >
                    <div className="bg-slate-900/95 backdrop-blur-md border-t md:border border-primary/30 md:rounded-full px-6 py-3 flex items-center justify-between md:justify-center gap-4 md:gap-8 shadow-[0_0_40px_rgba(34,211,238,0.15)]">
                        <div className="flex flex-col md:flex-row md:items-center gap-0.5 md:gap-3">
                            <span className="text-white font-semibold text-sm">🚀 VBT Hackathon 2026</span>
                            <span className="text-gray-400 text-xs md:text-sm">Hackathon Yarın Başlıyor! · 13–14 Mayıs 2026</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link
                                href="/submit"
                                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-primary to-primary-dark text-white font-bold text-sm hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all transform hover:scale-105 group"
                            >
                                <span>Proje Teslim</span>
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <button
                                onClick={() => setDismissed(true)}
                                className="p-1.5 text-gray-500 hover:text-white transition-colors flex-shrink-0"
                                aria-label="Kapat"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
