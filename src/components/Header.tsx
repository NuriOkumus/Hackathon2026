"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { BASE_PATH } from "@/lib/constants";

const navItems = [
    { name: "Hakkında", href: "/#about" },
    { name: "Program", href: "/program" },
    { name: "Ödüller", href: "/#prizes" },
    { name: "Mekan", href: "/#venue" },
    { name: "SSS", href: "/#faq" },
];

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={cn(
                "fixed top-0 w-full z-50 transition-all duration-300",
                scrolled ? "bg-background/80 backdrop-blur-md border-b border-primary/20 py-2" : "bg-transparent py-4"
            )}
        >
            <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="relative flex items-center gap-3 group md:ml-[120px] px-4 py-2">
                    {/* Glassmorphism backdrop */}
                    <div className="absolute inset-0 rounded-xl border border-primary/15 bg-primary/[0.04] pointer-events-none" />
                    <Image
                        src={`${BASE_PATH}/images/vbtlogo.png`}
                        alt="VBT Logo"
                        width={44}
                        height={44}
                        className="relative h-[44px] w-[44px] object-contain"
                        style={{ filter: "brightness(1.3) saturate(1.2)" }}
                    />
                    {/* Divider */}
                    <div className="relative w-px h-8 bg-gradient-to-b from-transparent via-primary/50 to-transparent" />
                    {/* Text lockup */}
                    <div className="relative flex flex-col leading-none gap-0.5">
                        <span
                            className="text-[9px] font-semibold tracking-[0.28em] uppercase"
                            style={{ fontFamily: "var(--font-exo2)", color: "rgba(249,115,22,0.65)" }}
                        >
                            VBT PRESENTS
                        </span>
                        <span
                            className="tracking-[0.08em]"
                            style={{ fontFamily: "var(--font-orbitron)", fontSize: "18px", fontWeight: 900, lineHeight: 1 }}
                        >
                            <span style={{ color: "#22d3ee" }}>
                                HACKATHON
                            </span>
                            <span style={{ color: "#f97316" }}>&apos;26</span>
                        </span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="text-sm font-medium text-gray-300 hover:text-primary transition-colors"
                        >
                            {item.name}
                        </Link>
                    ))}
                    <Link
                        href="/submit"
                        className="px-6 py-2 rounded-full bg-gradient-to-r from-primary to-primary-dark text-white font-semibold text-sm hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all transform hover:scale-105"
                    >
                        Proje Teslim
                    </Link>
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 text-gray-300 hover:text-white"
                    style={{ touchAction: "manipulation" }}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.15 }}
                        className="md:hidden bg-background/95 backdrop-blur-lg border-b border-primary/20"
                        style={{ touchAction: "manipulation" }}
                    >
                        <div className="flex flex-col p-6 gap-6">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-300 hover:text-primary py-2 text-lg font-medium border-b border-white/5"
                                    style={{ touchAction: "manipulation" }}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <Link
                                href="/submit"
                                onClick={() => setIsOpen(false)}
                                className="w-full text-center py-3 rounded-lg bg-primary text-background font-bold mt-2"
                                style={{ touchAction: "manipulation" }}
                            >
                                Proje Teslim
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
