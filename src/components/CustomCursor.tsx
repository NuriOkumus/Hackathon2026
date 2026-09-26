"use client";

import { useEffect, useRef, useCallback } from "react";
import { useIsTouchDevice } from "@/lib/useIsTouchDevice";

export default function CustomCursor() {
    const isTouch = useIsTouchDevice();
    const cursorRef = useRef<HTMLDivElement>(null);
    const dotRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);
    const rafId = useRef<number | null>(null);

    const onMove = useCallback((e: MouseEvent) => {
        if (rafId.current !== null) cancelAnimationFrame(rafId.current);
        rafId.current = requestAnimationFrame(() => {
            if (cursorRef.current) {
                cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
                cursorRef.current.style.opacity = "1";
            }
        });
    }, []);

    const setHovering = useCallback((hovering: boolean) => {
        if (ringRef.current) {
            ringRef.current.style.width = hovering ? "32px" : "20px";
            ringRef.current.style.height = hovering ? "32px" : "20px";
            ringRef.current.style.marginLeft = hovering ? "-16px" : "-10px";
            ringRef.current.style.marginTop = hovering ? "-16px" : "-10px";
            ringRef.current.style.borderColor = hovering ? "rgba(249,115,22,0.6)" : "rgba(34,211,238,0.4)";
        }
        if (dotRef.current) {
            dotRef.current.style.backgroundColor = hovering ? "#f97316" : "#22d3ee";
            dotRef.current.style.boxShadow = hovering
                ? "0 0 8px rgba(249,115,22,0.9)"
                : "0 0 6px rgba(34,211,238,0.8)";
        }
    }, []);

    useEffect(() => {
        if (isTouch) return;

        const handleOver = (e: MouseEvent) => {
            const t = e.target as HTMLElement;
            if (t.closest("a") || t.closest("button") || t.closest("[data-cursor-hover]")) {
                setHovering(true);
            }
        };
        const handleOut = (e: MouseEvent) => {
            const t = e.target as HTMLElement;
            if (t.closest("a") || t.closest("button") || t.closest("[data-cursor-hover]")) {
                setHovering(false);
            }
        };

        window.addEventListener("mousemove", onMove, { passive: true });
        document.addEventListener("mouseover", handleOver, { passive: true });
        document.addEventListener("mouseout", handleOut, { passive: true });

        return () => {
            window.removeEventListener("mousemove", onMove);
            document.removeEventListener("mouseover", handleOver);
            document.removeEventListener("mouseout", handleOut);
        };
    }, [isTouch, onMove, setHovering]);

    if (isTouch) return null;

    return (
        <div
            ref={cursorRef}
            className="fixed top-0 left-0 z-[9999] pointer-events-none"
            style={{ willChange: "transform", opacity: 0 }}
        >
            {/* Ring */}
            <div
                ref={ringRef}
                className="absolute rounded-full border"
                style={{
                    width: 20,
                    height: 20,
                    marginLeft: -10,
                    marginTop: -10,
                    borderColor: "rgba(34,211,238,0.4)",
                    transition: "width 0.15s ease, height 0.15s ease, margin 0.15s ease, border-color 0.15s ease",
                }}
            />
            {/* Dot */}
            <div
                ref={dotRef}
                className="absolute rounded-full"
                style={{
                    width: 4,
                    height: 4,
                    marginLeft: -2,
                    marginTop: -2,
                    backgroundColor: "#22d3ee",
                    boxShadow: "0 0 6px rgba(34,211,238,0.8)",
                    transition: "background-color 0.15s ease, box-shadow 0.15s ease",
                }}
            />
        </div>
    );
}
