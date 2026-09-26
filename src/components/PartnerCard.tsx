"use client";

import Image from "next/image";

interface PartnerCardProps {
    label: string;
    logo: string;
}

export default function PartnerCard({
    label,
    logo,
}: PartnerCardProps) {
    // Determine card structure cleanly for Marquee. 
    // We remove the initial stagger motion since it's now in a continuous marquee.
    return (
        <div className="group relative flex flex-col items-center justify-center p-6 bg-white/[0.02] border border-white/5 rounded-2xl transition-all duration-500 hover:bg-white/[0.05] hover:border-primary/30 w-[260px] md:w-[320px] h-[130px] md:h-[150px]">
            {/* Logo container */}
            <div className="relative w-36 h-24 flex items-center justify-center">
                <Image
                    src={logo}
                    alt={label}
                    fill
                    className="object-contain p-2 opacity-60 group-hover:opacity-100 transition-all duration-500"
                />
            </div>

            {/* Label */}
            <div className="absolute bottom-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                <span className="text-[10px] md:text-[11px] text-gray-300 font-medium tracking-wide">
                    {label}
                </span>
            </div>

            {/* Elegant glow effect on hover */}
            <div className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/[0.05] to-transparent pointer-events-none" />
        </div>
    );
}
