"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <main className="relative z-10 min-h-screen bg-[#05050a] flex items-center justify-center px-4">
            <div className="max-w-md text-center">
                <p className="text-cyan-400 text-sm font-mono mb-4 tracking-widest uppercase">
                    Hata
                </p>
                <h1 className="text-3xl font-black text-white mb-4">
                    Bir şeyler ters gitti
                </h1>
                <p className="text-gray-500 text-sm mb-10 leading-relaxed">
                    Beklenmedik bir hata oluştu. Sayfayı yenilemeyi deneyin ya da ana sayfaya dönün.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={reset}
                        className="px-6 py-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium hover:bg-cyan-500/20 transition-colors"
                    >
                        Tekrar Dene
                    </button>
                    <Link
                        href="/"
                        className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-sm font-medium hover:bg-white/10 transition-colors"
                    >
                        Ana Sayfa
                    </Link>
                </div>
            </div>
        </main>
    );
}
