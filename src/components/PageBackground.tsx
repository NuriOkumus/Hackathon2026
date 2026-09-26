"use client";

import { useEffect, useRef } from "react";
import { useIsTouchDevice } from "@/lib/useIsTouchDevice";

interface NodeParticle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    baseAlpha: number;
    pulseOrigin: number;
}

export default function PageBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isTouch = useIsTouchDevice();

    useEffect(() => {
        if (isTouch) return; // Skip heavy canvas animation on touch devices

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d", { alpha: false });
        if (!ctx) return;

        let particles: NodeParticle[] = [];
        let animationFrameId: number;
        let resizeTimer: ReturnType<typeof setTimeout> | null = null;
        let w = 0;
        let h = 0;
        let time = 0;

        const colors = [
            "34, 211, 238", // cyan-400
            "14, 116, 144", // cyan-700
            "249, 115, 22", // orange-500
        ];

        const initParticles = () => {
            particles = [];
            const density = Math.floor((w * h) / 15000);
            const particleCount = Math.min(Math.max(density, 40), 120);

            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    vx: (Math.random() - 0.5) * 0.4,
                    vy: (Math.random() - 0.5) * 0.4,
                    size: Math.random() * 1.5 + 0.5,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    baseAlpha: Math.random() * 0.4 + 0.1,
                    pulseOrigin: Math.random() * Math.PI * 2,
                });
            }
        };

        // Initial sizing — done immediately, not debounced
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
        initParticles();

        // Subsequent resizes are debounced to avoid thrashing particle init
        const resize = () => {
            if (resizeTimer) clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                w = canvas.width = window.innerWidth;
                h = canvas.height = window.innerHeight;
                initParticles();
            }, 200);
        };

        const mouse = { x: -1000, y: -1000 };
        const onMouseMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
        const onMouseLeave = () => { mouse.x = -1000; mouse.y = -1000; };

        window.addEventListener("resize", resize);
        window.addEventListener("mousemove", onMouseMove, { passive: true });
        window.addEventListener("mouseleave", onMouseLeave);

        const draw = () => {
            time += 0.01;

            ctx.fillStyle = "#05050a";
            ctx.fillRect(0, 0, w, h);

            const connectionDistance = 150;
            const connectionDistanceSq = connectionDistance * connectionDistance;
            const mouseConnectionDistance = 250;
            const mouseConnectionDistanceSq = mouseConnectionDistance * mouseConnectionDistance;

            for (let i = 0; i < particles.length; i++) {
                const p1 = particles[i];

                p1.x += p1.vx;
                p1.y += p1.vy;

                if (p1.x < 0 || p1.x > w) p1.vx *= -1;
                if (p1.y < 0 || p1.y > h) p1.vy *= -1;

                const dxMouse = mouse.x - p1.x;
                const dyMouse = mouse.y - p1.y;
                const distMouseSq = dxMouse * dxMouse + dyMouse * dyMouse;

                const pulse = Math.sin(time * 2 + p1.pulseOrigin) * 0.3;
                let currentAlpha = p1.baseAlpha + pulse;
                let currentSize = p1.size;

                if (distMouseSq < mouseConnectionDistanceSq) {
                    const distMouse = Math.sqrt(distMouseSq);
                    const factor = 1 - Math.pow(distMouse / mouseConnectionDistance, 2);
                    currentAlpha += factor * 0.5;
                    currentSize += factor * 1.5;

                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(${p1.color}, ${factor * 0.3})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }

                currentAlpha = Math.max(0.1, Math.min(currentAlpha, 1));

                ctx.beginPath();
                ctx.arc(p1.x, p1.y, currentSize, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${p1.color}, ${currentAlpha})`;
                ctx.fill();

                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const distSq = dx * dx + dy * dy;

                    if (distSq < connectionDistanceSq) {
                        const dist = Math.sqrt(distSq);
                        const opacity = (1 - dist / connectionDistance) * 0.2;
                        const isOrange = p1.color === colors[2] || p2.color === colors[2];
                        const lineColor = isOrange ? colors[2] : colors[0];

                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(${lineColor}, ${opacity})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }

            const scanSpeed = 150;
            const scanHeight = h * 1.5;
            const scanY = (time * scanSpeed) % scanHeight - (h * 0.25);

            if (scanY > -50 && scanY < h + 50) {
                const grad = ctx.createLinearGradient(0, scanY - 50, 0, scanY);
                grad.addColorStop(0, "rgba(34, 211, 238, 0)");
                grad.addColorStop(1, "rgba(34, 211, 238, 0.04)");
                ctx.fillStyle = grad;
                ctx.fillRect(0, scanY - 50, w, 50);

                ctx.beginPath();
                ctx.moveTo(0, scanY);
                ctx.lineTo(w, scanY);
                ctx.strokeStyle = "rgba(34, 211, 238, 0.15)";
                ctx.lineWidth = 1;
                ctx.stroke();
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseleave", onMouseLeave);
            cancelAnimationFrame(animationFrameId);
            if (resizeTimer) clearTimeout(resizeTimer);
        };
    }, [isTouch]);

    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
            {/* Canvas only renders on non-touch devices */}
            {!isTouch && (
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
            )}

            <div className="absolute inset-x-0 bottom-0 h-[60%] bg-[radial-gradient(ellipse_at_50%_100%,rgba(34,211,238,0.12),transparent_70%)]" />
            <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] bg-[radial-gradient(ellipse_at_80%_20%,rgba(249,115,22,0.06),transparent_60%)]" />

            <div
                className="absolute inset-x-0 bottom-[-20%] h-[60%] opacity-[0.06]"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(34, 211, 238, 1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(34, 211, 238, 1) 1px, transparent 1px)
                    `,
                    backgroundSize: "60px 60px",
                    transform: "perspective(1000px) rotateX(75deg) translateY(100px) scale(2.5)",
                    transformOrigin: "bottom center",
                    WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 80%)",
                    maskImage: "linear-gradient(to top, black 0%, transparent 80%)",
                }}
            />

            <div
                className="absolute inset-0 opacity-[0.025] mix-blend-overlay pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                    backgroundSize: "128px 128px",
                }}
            />
        </div>
    );
}
