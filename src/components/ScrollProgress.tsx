"use client";

import { useEffect, useRef } from "react";

export default function ScrollProgress() {
    const barRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
            if (barRef.current) {
                barRef.current.style.width = `${progress}%`;
            }
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="fixed top-0 left-0 w-full h-0.5 z-[100] bg-white/5">
            <div
                ref={barRef}
                className="h-full bg-gradient-to-r from-primary to-secondary"
                style={{ width: "0%", transition: "width 0.05s linear" }}
            />
        </div>
    );
}
