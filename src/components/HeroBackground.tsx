"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useIsTouchDevice } from "@/lib/useIsTouchDevice";

const PLAYLIST = [
    "https://assets.vbthackathon.com.tr/videos/hero-bg.webm",
    "https://assets.vbthackathon.com.tr/videos/cyberpunk-mugla.webm",
    "https://assets.vbthackathon.com.tr/videos/city-blueprint.webm",
];

const CROSSFADE_S = 1.2;
// Delay before loading video B — lets video A fully buffer first
const VIDEO_B_DEFER_MS = 8000;

function nextIdx(i: number) {
    return (i + 1) % PLAYLIST.length;
}

/** Returns true on slow/data-saver connections where video should be skipped. */
function isSlowConnection(): boolean {
    if (typeof navigator === "undefined") return false;
    const conn = (navigator as { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    if (!conn) return false;
    return !!conn.saveData || ["slow-2g", "2g", "3g"].includes(conn.effectiveType ?? "");
}

/** Ambient gradient shown on mobile / slow connections instead of video. */
function StaticAmbient() {
    return (
        <>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,rgba(34,211,238,0.10)_0%,transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_65%,rgba(99,102,241,0.07)_0%,transparent_55%)]" />
        </>
    );
}

export default function HeroBackground() {
    const containerRef  = useRef<HTMLDivElement>(null);
    const videoARef     = useRef<HTMLVideoElement>(null);
    const videoBRef     = useRef<HTMLVideoElement>(null);

    const slotIdx       = useRef({ A: 0, B: nextIdx(0) });
    const activeSlotRef = useRef<"A" | "B">("A");
    const [activeSlot, setActiveSlot] = useState<"A" | "B">("A");

    const isTouch           = useIsTouchDevice();
    const heroLoadedFired   = useRef(false);
    const mounted           = useRef(true);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });
    const scale           = useTransform(scrollYProgress, [0, 1], isTouch ? [1, 1] : [1.02, 1.1]);
    const parallaxOpacity = useTransform(scrollYProgress, [0, 0.8], isTouch ? [1, 1] : [1, 0]);

    useEffect(() => {
        mounted.current = true;
        return () => { mounted.current = false; };
    }, []);

    // ── Preloader event ───────────────────────────────────────────────────────
    const fireHeroLoaded = useCallback(() => {
        if (heroLoadedFired.current) return;
        heroLoadedFired.current = true;
        (window as any).__heroVideoLoaded = true;
        window.dispatchEvent(new Event("hero-video-loaded"));
    }, []);

    // ── İlk yükleme ───────────────────────────────────────────────────────────
    useEffect(() => {
        // Slow/data-saver connections: skip video, unblock preloader immediately
        if (isSlowConnection()) {
            fireHeroLoaded();
            return;
        }

        const a = videoARef.current;
        if (!a) return;

        // Load only video A — video B is deferred to avoid bandwidth contention
        // Set src early so it buffers during preloader, but don't play until preloader is done
        a.src = PLAYLIST[0];

        const startPlay = () => { a.play().catch(() => {}); };
        if ((window as any).__preloaderDone) {
            startPlay();
        } else {
            window.addEventListener('preloader-done', startPlay, { once: true });
        }

        // Load video B after a delay so A has time to fully buffer first
        const deferTimer = setTimeout(() => {
            if (!mounted.current) return;
            const b = videoBRef.current;
            if (b && !b.src) {
                b.src = PLAYLIST[slotIdx.current.B];
                b.load();
            }
        }, VIDEO_B_DEFER_MS);

        return () => clearTimeout(deferTimer);
    }, [isTouch, fireHeroLoaded]);

    // ── Cross-fade ────────────────────────────────────────────────────────────
    const crossFade = useCallback((fromSlot: "A" | "B") => {
        const a = videoARef.current;
        const b = videoBRef.current;
        if (!a || !b) return;

        const toSlot    = fromSlot === "A" ? "B" : "A";
        const toVideo   = toSlot   === "A" ? a : b;
        const fromVideo = fromSlot === "A" ? a : b;

        toVideo.currentTime = 0;
        toVideo.play().catch(() => {});

        activeSlotRef.current = toSlot;
        setActiveSlot(toSlot);

        const upcoming = nextIdx(slotIdx.current[toSlot]);
        slotIdx.current[fromSlot] = upcoming;

        setTimeout(() => {
            if (!mounted.current) return;
            fromVideo.src = PLAYLIST[upcoming];
            fromVideo.load();
        }, CROSSFADE_S * 1000);
    }, []);

    // ── ended event'leri native DOM'a bağlı ──────────────────────────────────
    useEffect(() => {
        const a = videoARef.current;
        const b = videoBRef.current;
        if (!a || !b) return;

        const onEndedA = () => crossFade("A");
        const onEndedB = () => crossFade("B");

        a.addEventListener("ended", onEndedA);
        b.addEventListener("ended", onEndedB);
        return () => {
            a.removeEventListener("ended", onEndedA);
            b.removeEventListener("ended", onEndedB);
        };
    }, [isTouch, crossFade]);

    // ── Viewport dışında duraklat ─────────────────────────────────────────────
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const observer = new IntersectionObserver(([entry]) => {
            const a = videoARef.current;
            const b = videoBRef.current;
            if (!a || !b) return;
            if (!entry.isIntersecting) {
                a.pause(); b.pause();
            } else {
                const active = activeSlotRef.current === "A" ? a : b;
                active.play().catch(() => {});
            }
        }, { threshold: 0 });

        observer.observe(container);
        return () => observer.disconnect();
    }, [isTouch]);

    // ── Render ────────────────────────────────────────────────────────────────
    const videoStyle: React.CSSProperties = {
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
        userSelect: "none",
    };

    return (
        <div ref={containerRef} className="absolute inset-0 overflow-hidden">
            {/* Always-visible ambient — shows while video loads or on mobile */}
            <StaticAmbient />

            {/* Video layer */}
            <motion.div
                className="absolute inset-0 will-change-transform"
                style={{ scale, opacity: parallaxOpacity }}
            >
                <motion.div
                    className="absolute inset-0"
                    animate={{ opacity: activeSlot === "A" ? 1 : 0 }}
                    transition={{ duration: CROSSFADE_S, ease: "easeInOut" }}
                    initial={{ opacity: 1 }}
                >
                    <video
                        ref={videoARef}
                        muted playsInline disablePictureInPicture
                        disableRemotePlayback preload="auto"
                        onCanPlayThrough={fireHeroLoaded}
                        style={videoStyle}
                    />
                </motion.div>

                <motion.div
                    className="absolute inset-0"
                    animate={{ opacity: activeSlot === "B" ? 1 : 0 }}
                    transition={{ duration: CROSSFADE_S, ease: "easeInOut" }}
                    initial={{ opacity: 0 }}
                >
                    <video
                        ref={videoBRef}
                        muted playsInline disablePictureInPicture
                        disableRemotePlayback preload="none"
                        style={videoStyle}
                    />
                </motion.div>
            </motion.div>

            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/40 z-[1]" />

            <div
                className="absolute inset-0 z-[2] opacity-55 mix-blend-overlay pointer-events-none hidden sm:block"
                style={{
                    backgroundImage: `
                        repeating-linear-gradient(
                            0deg, transparent, transparent 2px,
                            rgba(34, 211, 238, 0.03) 2px, rgba(34, 211, 238, 0.03) 4px
                        ),
                        radial-gradient(circle, rgba(34, 211, 238, 0.08) 1px, transparent 1px)
                    `,
                    backgroundSize: "100% 4px, 16px 16px",
                }}
            />
        </div>
    );
}
