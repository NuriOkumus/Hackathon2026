"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function Preloader() {
    const [isLoading, setIsLoading] = useState(true);
    const [hasChecked, setHasChecked] = useState(false);
    const [progress, setProgress] = useState(0);
    const [loadingText, setLoadingText] = useState("SİSTEM BAŞLATILIYOR...");

    const [isVideoLoaded, setIsVideoLoaded] = useState(false);

    // Check sessionStorage on mount - skip preloader if already shown this session
    useEffect(() => {
        // Hide the SSR cover div — don't .remove() or React's reconciler breaks
        const cover = document.getElementById("ssr-cover");
        if (cover) cover.style.display = "none";

        if (typeof window !== "undefined" && sessionStorage.getItem('vbt-preloader-shown')) {
            (window as any).__preloaderDone = true;
            window.dispatchEvent(new Event('preloader-done'));
            // Need to wrap in setTimeout to avoid React dev mode cascading render warnings
            setTimeout(() => {
                setIsLoading(false);
                setHasChecked(true);
            }, 0);
            return;
        }
        setTimeout(() => {
            setHasChecked(true);
        }, 0);

        // Prevent scrolling while loading
        document.body.style.overflow = "hidden";

        // Listen for video load — check global flag first to handle race condition
        const handleVideoLoaded = () => setIsVideoLoaded(true);
        if ((window as any).__heroVideoLoaded) {
            setIsVideoLoaded(true);
        } else {
            window.addEventListener('hero-video-loaded', handleVideoLoaded);
        }

        // Fallback: eğer video 12 saniyede canplaythrough vermezse geç
        const fallbackTimeout = setTimeout(() => {
            setIsVideoLoaded(true);
        }, 12000);

        return () => {
            window.removeEventListener('hero-video-loaded', handleVideoLoaded);
            clearTimeout(fallbackTimeout);
            document.body.style.overflow = ""; // Cleanup if unmounted early
        };
    }, []);

    // 2. Timeout Fallback (Max Wait) - 5 seconds max
    useEffect(() => {
        const globalTimeout = setTimeout(() => {
            if (isLoading) {
                setIsLoading(false);
                document.body.style.overflow = "";
            }
        }, 18000); // 18 seconds max wait

        return () => clearTimeout(globalTimeout);
    }, [isLoading]);


    // Progress and Text Animation
    useEffect(() => {
        if (!isLoading) return;

        const texts = [
            "Gelecek Yükleniyor...",
            "Akıllı Şehir Mimarisi Oluşturuluyor...",
            "Ufuk Çizgisi Genişliyor...",
            "Yenilikçi Fikirler Senkronize Ediliyor...",
            "Deneyim Hazırlanıyor..."
        ];

        let currentTextIndex = 0;

        // Progress climbs to 100% over ~8 seconds.
        // 8000ms total / 50ms interval = 160 steps.
        // 100% / 160 steps = 0.625 per step
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) return 100;
                return prev + 0.625;
            });
        }, 50);

        const textInterval = setInterval(() => {
            currentTextIndex = (currentTextIndex + 1) % texts.length;
            setLoadingText(texts[currentTextIndex]);
        }, 1200);

        return () => {
            clearInterval(progressInterval);
            clearInterval(textInterval);
        };
    }, [isLoading]);

    // Finish loading: progress hit 100% AND video loaded → wait 600ms then dismiss
    useEffect(() => {
        if (progress >= 100 && isVideoLoaded && isLoading) {
            const timeoutId = setTimeout(() => {
                setLoadingText("VBT 2026'ya Hoş Geldiniz.");
                sessionStorage.setItem('vbt-preloader-shown', 'true');
                (window as any).__preloaderDone = true;
                window.dispatchEvent(new Event('preloader-done'));
                setIsLoading(false);
                document.body.style.overflow = "";
            }, 600);

            return () => clearTimeout(timeoutId);
        }
    }, [progress, isVideoLoaded, isLoading]);

    const cubes = [
        { x: 300, y: 120, size: 18 }, { x: 400, y: 90, size: 22 }, { x: 500, y: 130, size: 16 },
        { x: 240, y: 180, size: 18 }, { x: 560, y: 200, size: 20 }, { x: 210, y: 260, size: 16 },
        { x: 310, y: 320, size: 20 }, { x: 430, y: 310, size: 24 }, { x: 530, y: 290, size: 18 },
        { x: 380, y: 180, size: 12 }, { x: 450, y: 230, size: 14 },
        // More cubes to increase density
        { x: 260, y: 100, size: 14 }, { x: 350, y: 60, size: 16 }, { x: 460, y: 70, size: 12 },
        { x: 600, y: 150, size: 18 }, { x: 640, y: 230, size: 14 }, { x: 590, y: 340, size: 16 },
        { x: 480, y: 360, size: 18 }, { x: 360, y: 390, size: 14 }, { x: 260, y: 350, size: 18 },
        { x: 160, y: 310, size: 16 }, { x: 130, y: 200, size: 12 }, { x: 170, y: 130, size: 14 }
    ];

    const dots = [
        { x: 180, y: 130, r: 5 }, { x: 250, y: 80, r: 4 }, { x: 360, y: 65, r: 6 },
        { x: 480, y: 70, r: 5 }, { x: 600, y: 100, r: 6 }, { x: 640, y: 170, r: 4 },
        { x: 660, y: 250, r: 6 }, { x: 590, y: 340, r: 5 }, { x: 480, y: 370, r: 6 },
        { x: 380, y: 380, r: 4 }, { x: 260, y: 360, r: 6 }, { x: 160, y: 310, r: 5 },
        { x: 140, y: 220, r: 6 }, { x: 210, y: 160, r: 4 }, { x: 280, y: 230, r: 4 },
        { x: 490, y: 170, r: 4 }, { x: 500, y: 250, r: 5 },
    ];

    const lines = [
        // Cube to Cube
        "M 300 120 L 400 90", "M 400 90 L 500 130", "M 300 120 L 240 180",
        "M 500 130 L 560 200", "M 240 180 L 210 260", "M 560 200 L 530 290",
        "M 210 260 L 310 320", "M 530 290 L 430 310", "M 310 320 L 430 310",
        "M 400 90 L 380 180", "M 380 180 L 300 120", "M 500 130 L 450 230",
        "M 450 230 L 560 200", "M 310 320 L 380 180", "M 430 310 L 450 230",
        // Dot to Cube
        "M 180 130 L 240 180", "M 180 130 L 300 120", "M 250 80 L 300 120",
        "M 360 65 L 400 90", "M 480 70 L 400 90", "M 480 70 L 500 130",
        "M 600 100 L 500 130", "M 640 170 L 560 200", "M 660 250 L 560 200",
        "M 660 250 L 530 290", "M 590 340 L 530 290", "M 480 370 L 430 310",
        "M 380 380 L 430 310", "M 380 380 L 310 320", "M 260 360 L 310 320",
        "M 160 310 L 210 260", "M 140 220 L 210 260", "M 210 160 L 240 180",
        // Additional Links for density
        "M 260 100 L 300 120", "M 260 100 L 180 130", "M 350 60 L 400 90",
        "M 350 60 L 250 80", "M 460 70 L 500 130", "M 460 70 L 480 70",
        "M 600 150 L 600 100", "M 600 150 L 560 200", "M 640 230 L 660 250",
        "M 590 340 L 560 200", "M 480 360 L 430 310", "M 360 390 L 310 320",
        "M 260 350 L 210 260", "M 160 310 L 210 260", "M 130 200 L 140 220",
        "M 170 130 L 240 180",
        // Dot to Dot
        "M 180 130 L 250 80", "M 600 100 L 640 170", "M 160 310 L 140 220",
        "M 590 340 L 660 250", "M 260 360 L 160 310",
        // Inner Dots
        "M 280 230 L 240 180", "M 280 230 L 210 260", "M 280 230 L 310 320",
        "M 490 170 L 500 130", "M 490 170 L 450 230", "M 500 250 L 560 200",
        "M 500 250 L 530 290", "M 500 250 L 450 230"
    ];

    const generateCube = (x: number, y: number, size: number, index: number) => {
        const dx = size * 0.866;
        const dy = size / 2;
        const hex = `${x},${y - size} ${x + dx},${y - dy} ${x + dx},${y + dy} ${x},${y + size} ${x - dx},${y + dy} ${x - dx},${y - dy}`;

        // Stagger delays across ~8 seconds so they finish around 10s mark
        const delay = index * 0.35;

        return (
            <motion.g
                key={`cube-${x}-${y}`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={progress > 0 ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 1.2, delay: delay, ease: "easeOut" }}
            >
                <polygon points={hex} fill="rgba(6, 182, 212, 0.05)" />
                <motion.polygon
                    points={hex}
                    fill="none"
                    stroke="url(#network-grad)"
                    strokeWidth="1.5"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={progress > 0 ? { pathLength: 1, opacity: 1 } : {}}
                    transition={{ duration: 2.0, delay: delay, ease: "easeInOut" }}
                />
                <polyline points={`${x},${y} ${x},${y - size}`} stroke="rgba(34,211,238,0.3)" strokeWidth="1" />
                <polyline points={`${x},${y} ${x + dx},${y + dy}`} stroke="rgba(34,211,238,0.3)" strokeWidth="1" />
                <polyline points={`${x},${y} ${x - dx},${y + dy}`} stroke="rgba(34,211,238,0.3)" strokeWidth="1" />
            </motion.g>
        );
    };

    // While checking sessionStorage, show a black screen to prevent page flash
    if (!hasChecked) return <div className="fixed inset-0 z-[100] bg-[#020205]" />;
    // If already shown this session, render nothing
    if (!isLoading && progress === 0) return null;

    const fillHeight = (Math.min(progress, 100) / 100) * 450;
    const currentY = 450 - fillHeight;

    return (
        <AnimatePresence>
            {isLoading && (
                <div className="fixed inset-0 z-[100] pointer-events-none">
                    {/* Top Split Door */}
                    <motion.div
                        key="top-door"
                        initial={{ height: "50vh" }}
                        exit={{
                            height: "0vh",
                            transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.3 }
                        }}
                        className={`absolute top-0 w-full bg-[#020205] origin-top border-b overflow-hidden pointer-events-auto transition-[border-color,box-shadow] duration-1000 ${progress >= 100
                            ? 'border-cyan-500/50 shadow-[0_10px_30px_rgba(34,211,238,0.3)]'
                            : 'border-transparent shadow-none'
                            }`}
                    >
                        <div className="absolute bottom-0 w-full h-[100vh] bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.1)_0%,transparent_60%)]" />
                    </motion.div>

                    {/* Bottom Split Door */}
                    <motion.div
                        key="bottom-door"
                        initial={{ height: "50vh" }}
                        exit={{
                            height: "0vh",
                            transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.3 }
                        }}
                        className={`absolute bottom-0 w-full bg-[#020205] origin-bottom border-t overflow-hidden pointer-events-auto transition-[border-color,box-shadow] duration-1000 ${progress >= 100
                            ? 'border-cyan-500/50 shadow-[0_-10px_30px_rgba(34,211,238,0.3)]'
                            : 'border-transparent shadow-none'
                            }`}
                    >
                        <div className="absolute top-0 w-full h-[100vh] bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.1)_0%,transparent_60%)]" />
                    </motion.div>

                    {/* Content Layer (Fades and zooms out simultaneously with the doors) */}
                    <motion.div
                        key="preloader-content"
                        initial={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{
                            opacity: 0,
                            scale: 1.4,
                            filter: "blur(15px)",
                            transition: { duration: 1.0, ease: "easeIn" }
                        }}
                        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-auto"
                    >
                        {/* --- ADVANCED CYBER / SMART CITY BACKGROUND --- */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden bg-[#020205]">
                            {/* Deep Cinematic Ambient Glow */}
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(34,211,238,0.1)_0%,transparent_80%)]" />

                            {/* Concentric Radar Rings */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200vw] sm:w-[120vw] sm:h-[120vw] opacity-30">
                                <div className="absolute inset-[10%] rounded-full border border-cyan-500/5" />
                                <div className="absolute inset-[25%] rounded-full border border-cyan-500/5" />
                                <div className="absolute inset-[40%] rounded-full border border-cyan-500/5" />
                                <div className="absolute inset-[55%] rounded-full border border-cyan-500/5" />
                                <div className="absolute inset-[70%] rounded-full border border-dashed border-cyan-500/10" />

                                {/* Spinning Radar Sweep */}
                                <motion.div
                                    className="absolute inset-0 rounded-full"
                                    style={{
                                        background: 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(34, 211, 238, 0.01) 280deg, rgba(34, 211, 238, 0.08) 360deg)',
                                    }}
                                    initial={{ rotate: 0 }}
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                />
                            </div>

                            {/* Tech Grid & Intersection Coordinates */}
                            <div className="absolute inset-0"
                                style={{
                                    backgroundImage: `
                                        linear-gradient(rgba(34, 211, 238, 0.04) 1px, transparent 1px),
                                        linear-gradient(90deg, rgba(34, 211, 238, 0.04) 1px, transparent 1px)
                                    `,
                                    backgroundSize: '60px 60px',
                                    backgroundPosition: 'center center',
                                    maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, transparent 80%)',
                                    WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, transparent 80%)'
                                }}
                            >
                                {/* Crosshair / Dot Intersections */}
                                <div className="absolute inset-0"
                                    style={{
                                        backgroundImage: 'radial-gradient(circle at center, rgba(34,211,238,0.3) 1.5px, transparent 1.5px)',
                                        backgroundSize: '60px 60px',
                                        backgroundPosition: '-0.5px -0.5px'
                                    }}
                                />
                            </div>

                            {/* Vertical Data Streams (Matrix-lite effect) using motion.div */}
                            <motion.div
                                className="absolute left-[15%] w-[1px] h-[100px] bg-gradient-to-b from-transparent via-cyan-400 to-transparent opacity-20"
                                animate={{ top: ["-10%", "110%"] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "linear", delay: 0 }}
                            />
                            <motion.div
                                className="absolute left-[45%] w-[1px] h-[150px] bg-gradient-to-b from-transparent via-cyan-400 to-transparent opacity-25"
                                animate={{ top: ["-10%", "110%"] }}
                                transition={{ duration: 7, repeat: Infinity, ease: "linear", delay: 2 }}
                            />
                            <motion.div
                                className="absolute left-[75%] w-[1px] h-[80px] bg-gradient-to-b from-transparent via-purple-400 to-transparent opacity-20"
                                animate={{ top: ["-10%", "110%"] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 1 }}
                            />
                            <motion.div
                                className="absolute left-[88%] w-[1px] h-[120px] bg-gradient-to-b from-transparent via-cyan-500 to-transparent opacity-15"
                                animate={{ top: ["-10%", "110%"] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "linear", delay: 3.5 }}
                            />

                            {/* Ambient Vignette to soften edges deeply */}
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#020205_100%)]" />
                        </div>

                        {/* SVG Network Graph mapping to progress */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden pb-16">
                            <svg viewBox="0 0 800 450" className="w-[800px] max-w-[150vw] h-auto drop-shadow-[0_0_15px_rgba(34,211,238,0.5)] z-10 relative">
                                <defs>
                                    <linearGradient id="network-grad" x1="0" y1="1" x2="0" y2="0">
                                        <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
                                        <stop offset="50%" stopColor="#818cf8" stopOpacity="0.8" />
                                        <stop offset="100%" stopColor="#a855f7" stopOpacity="1" />
                                    </linearGradient>

                                    <clipPath id="network-clip">
                                        <motion.rect
                                            x="0"
                                            width="800"
                                            initial={{ y: 450, height: 0 }}
                                            animate={{ y: currentY, height: fillHeight }}
                                            transition={{ ease: "easeOut", duration: 0.3 }}
                                        />
                                    </clipPath>
                                </defs>

                                {/* VBT Text Center - Always visible faintly */}
                                <text
                                    x="400"
                                    y="255"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    className="font-sans font-black tracking-widest fill-white/5 text-[110px]"
                                >
                                    VBT
                                </text>

                                {/* Faint Background Skeleton */}
                                <g stroke="rgba(255,255,255,0.03)" strokeWidth="1" fill="none">
                                    {lines.map((d, i) => <path key={`bg-${i}`} d={d} />)}
                                    {dots.map((n, i) => <circle key={`bg-n-${i}`} cx={n.x} cy={n.y} r={n.r} fill="rgba(255,255,255,0.03)" />)}
                                </g>

                                {/* Sequential Tracer Lines */}
                                <g stroke="url(#network-grad)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    {lines.map((d, i) => (
                                        <motion.path
                                            key={`fg-line-${i}`}
                                            d={d}
                                            initial={{ pathLength: 0, opacity: 0 }}
                                            animate={progress > 0 ? { pathLength: 1, opacity: 1 } : {}}
                                            transition={{
                                                duration: 2.0,
                                                ease: "easeInOut",
                                                delay: i * 0.2 // Stagger delays across ~8s max window so they end precisely before 10s
                                            }}
                                        />
                                    ))}
                                </g>

                                {/* Sequential Active Dots */}
                                <g fill="#22d3ee">
                                    {dots.map((n, i) => (
                                        <motion.circle
                                            key={`fg-dot-${i}`}
                                            cx={n.x}
                                            cy={n.y}
                                            r={n.r}
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={progress > 0 ? { scale: 1, opacity: 1 } : {}}
                                            transition={{
                                                type: "spring",
                                                stiffness: 260,
                                                damping: 20,
                                                delay: (i * 0.5) + 0.5 // Spread across ~9s
                                            }}
                                            style={{ filter: "drop-shadow(0 0 6px rgba(34,211,238,0.8))" }}
                                        />
                                    ))}
                                </g>

                                {/* Sequential Cubes */}
                                <g>
                                    {cubes.map((c, i) => generateCube(c.x, c.y, c.size, i))}
                                </g>

                                {/* Illuminated Foreground masked by progress (Only Center VBT Text) */}
                                <g fill="none">
                                    {/* Revealed VBT Center Text - Animated cohesively with the rest */}
                                    <motion.text
                                        x="400"
                                        y="255"
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        stroke="none"
                                        fill="#22d3ee"
                                        className="font-sans font-black tracking-widest text-[110px]"
                                        initial={{ opacity: 0, scale: 0.95, filter: "drop-shadow(0 0 0px rgba(34,211,238,0))" }}
                                        animate={{
                                            opacity: progress > 5 ? Math.min((progress - 5) / 80, 1) : 0,
                                            scale: progress > 5 ? 0.95 + (Math.min((progress - 5) / 80, 1) * 0.05) : 0.95,
                                            filter: `drop-shadow(0 0 ${Math.min(progress / 4, 35)}px rgba(34,211,238,${Math.min(progress / 100, 0.8)}))`
                                        }}
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                    >
                                        VBT
                                    </motion.text>
                                </g>

                                {/* Scanning horizontal laser mapping to current Y */}
                                <motion.line
                                    x1="0"
                                    x2="800"
                                    stroke="url(#network-grad)"
                                    strokeWidth="2"
                                    initial={{ y1: 450, y2: 450, opacity: 0 }}
                                    animate={{
                                        y1: currentY,
                                        y2: currentY,
                                        opacity: progress > 0 && progress < 100 ? 0.5 : 0 // Dimmer laser line
                                    }}
                                    transition={{ ease: "easeOut", duration: 0.3 }}
                                    style={{ filter: "drop-shadow(0 0 10px #22d3ee)" }}
                                />
                            </svg>
                        </div>

                        {/* Centered Premium Content */}
                        <div className="absolute bottom-8 left-4 right-4 mx-auto max-w-xl flex flex-col items-center gap-12 z-10">
                            <div className="w-full sm:w-[500px] flex flex-col gap-6 items-center bg-black/40 px-8 py-6 rounded-3xl backdrop-blur-xl border border-white/10 shadow-2xl">
                                {/* Cinematic Loading Text */}
                                <div className="h-12 flex items-center justify-center">
                                    <AnimatePresence mode="wait">
                                        <motion.span
                                            key={loadingText}
                                            initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                            exit={{ opacity: 0, y: -10, filter: "blur(8px)" }}
                                            transition={{ duration: 1.2, ease: "easeInOut" }}
                                            className="text-gray-200 font-light text-base sm:text-lg tracking-wider text-center drop-shadow-lg"
                                        >
                                            {loadingText}
                                        </motion.span>
                                    </AnimatePresence>
                                </div>

                                {/* Percentage (subtle & elegant) */}
                                <motion.div
                                    className="flex items-center gap-4 w-full"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5, duration: 1 }}
                                >
                                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                                    <div className="text-cyan-400 text-sm font-mono tracking-[0.3em] font-medium">
                                        {Math.floor(Math.min(progress, 100))}%
                                    </div>
                                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
