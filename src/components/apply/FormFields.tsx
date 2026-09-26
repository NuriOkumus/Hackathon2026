"use client";

import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import React from "react";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string | null;
    optional?: boolean;
}

export function FormInput({ label, error, optional, className, ...props }: FormFieldProps) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-300 ml-1 flex items-center justify-between">
                <span>{label}</span>
                {optional && <span className="text-[10px] uppercase text-gray-500 tracking-wider">Opsiyonel</span>}
            </label>
            <div className="relative">
                <input
                    {...props}
                    className={cn(
                        "w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none transition-all",
                        error
                            ? "border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/50"
                            : "border-white/10 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500",
                        className
                    )}
                />
            </div>
            {/* Realtime Feedback Error Animation */}
            {error && (
                <div className="flex items-center gap-1.5 mt-1 text-red-400 text-xs font-medium ml-1 animate-in fade-in slide-in-from-top-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
}

interface CustomSelectProps {
    label: string;
    options: { value: string; label: string }[];
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    error?: string | null;
}

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function CustomSelect({ label, options, value, onChange, placeholder = "Seçiniz...", error }: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedLabel = options.find((opt) => opt.value === value)?.label || placeholder;

    return (
        <div className="space-y-2" ref={containerRef}>
            <label className="text-sm font-semibold text-gray-300 ml-1">{label}</label>
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "w-full bg-white/5 border rounded-xl px-4 py-3 text-left focus:outline-none transition-all flex items-center justify-between",
                        error
                            ? "border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/50"
                            : isOpen
                                ? "border-cyan-500 ring-1 ring-cyan-500"
                                : "border-white/10 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500",
                        value ? "text-white" : "text-gray-600"
                    )}
                >
                    <span className="block truncate">{selectedLabel}</span>
                    <ChevronDown className={cn("w-5 h-5 text-gray-400 transition-transform", isOpen && "rotate-180 text-cyan-400")} />
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{ duration: 0.15 }}
                            className="absolute z-50 w-full mt-2 rounded-xl border border-cyan-500/20 bg-slate-900/95 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden"
                        >
                            <div className="max-h-60 overflow-y-auto py-1 custom-scrollbar">
                                {options.map((opt) => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        className={cn(
                                            "w-full text-left px-4 py-2.5 text-sm transition-colors",
                                            value === opt.value
                                                ? "bg-cyan-500/20 text-cyan-300 font-semibold"
                                                : "text-gray-300 hover:bg-white/10 hover:text-white"
                                        )}
                                        onClick={() => {
                                            onChange(opt.value);
                                            setIsOpen(false);
                                        }}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            {error && (
                <div className="flex items-center gap-1.5 mt-1 text-red-400 text-xs font-medium ml-1 animate-in fade-in slide-in-from-top-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
}

