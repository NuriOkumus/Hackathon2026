"use client";

import { motion } from "framer-motion";
import ApplyCountdown from "@/components/apply/ApplyCountdown";
import ApplyForm from "@/components/apply/ApplyForm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const OPEN_DATE = new Date("2026-04-01T00:00:00+03:00");
const CLOSE_DATE = new Date("2026-04-23T23:59:59+03:00");

export default function ApplyPage() {
    const now = Date.now();
    const isClosed = now >= CLOSE_DATE.getTime();
    const isOpen = now >= OPEN_DATE.getTime();

    return (
        <main className="relative z-10 min-h-screen text-foreground overflow-x-hidden selection:bg-primary/30 flex flex-col">
            <Header />

            <div className="flex-grow pt-32 pb-24 px-4 sm:px-6">
                <div className="container mx-auto max-w-4xl">
                    {isClosed ? (
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7 }}
                            className="flex flex-col items-center text-center"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-500/20 bg-red-500/5 text-red-400 text-xs font-medium tracking-wider uppercase mb-8">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                                Başvurular Kapandı
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
                                Başvuru Süreci{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
                                    Sona Erdi
                                </span>
                            </h1>
                            <p className="text-gray-500 text-base md:text-lg max-w-md mb-10">
                                23 Nisan 2026 itibarıyla başvurular kapanmıştır.
                                Gelecek etkinlikler için bizi takip etmeye devam edin.
                            </p>
                            <a
                                href="/"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-sm font-medium hover:bg-white/10 hover:text-white transition-colors"
                            >
                                ← Ana Sayfa
                            </a>
                        </motion.div>
                    ) : isOpen ? (
                        <ApplyForm />
                    ) : (
                        <ApplyCountdown />
                    )}
                </div>
            </div>

            <div className="mt-auto">
                <Footer />
            </div>
        </main>
    );
}
