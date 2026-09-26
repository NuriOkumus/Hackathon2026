"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { BASE_PATH } from "@/lib/constants";

interface Partner {
    name: string;
    logo?: string;
    initials?: string;
}

const partners: Partner[] = [
    { name: "Veri Bilimi Topluluğu", logo: `${BASE_PATH}/images/vbtlogo.png` },
    { name: "Sıtkı Koçman Vakfı", logo: `${BASE_PATH}/images/skv.png` },
    { name: "PAÜ Siber Güvenlik Topluluğu", logo: `${BASE_PATH}/images/pausiber.jpeg` },
    { name: "Arabica", logo: `${BASE_PATH}/images/arabicanew.png` },
    { name: "Little Caesar's", logo: `${BASE_PATH}/images/little-caesars.webp` },
    { name: "CoffeeMin", logo: `${BASE_PATH}/images/coffemin.jpeg` },
    { name: "Nurpen", logo: `${BASE_PATH}/images/nurpen.jpeg` },
    { name: "İnova TTO", logo: `${BASE_PATH}/images/inova_logo.png` },
    { name: "Sanal Ofis", logo: `${BASE_PATH}/images/sanalofis.png` },
];

function PartnerCard({ partner }: { partner: Partner }) {
    return (
        <div className="mx-4 sm:mx-6 lg:mx-8 shrink-0 flex items-center justify-center h-20">
            {partner.logo ? (
                <div className="relative h-20 w-28 sm:w-36">
                    <Image
                        src={partner.logo}
                        alt={partner.name}
                        fill
                        loading="eager"
                        sizes="144px"
                        className="object-contain opacity-50 hover:opacity-90 transition-opacity duration-300"
                    />
                </div>
            ) : (
                <span className="text-sm font-bold text-white/30 hover:text-white/60 transition-colors duration-300 tracking-wide">
                    {partner.initials}
                </span>
            )}
        </div>
    );
}

function MarqueeRow({ duration }: { duration: number }) {
    const firstSetRef = useRef<HTMLDivElement>(null);
    const [trackWidth, setTrackWidth] = useState(0);

    useEffect(() => {
        if (firstSetRef.current) {
            setTrackWidth(firstSetRef.current.scrollWidth);
        }
    }, []);

    return (
        <div className="relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

            <motion.div
                className="flex items-center py-2"
                animate={trackWidth ? { x: [0, -trackWidth] } : undefined}
                transition={{
                    x: {
                        duration,
                        ease: "linear",
                        repeat: Infinity,
                        repeatType: "loop",
                    },
                }}
            >
                <div ref={firstSetRef} className="flex items-stretch shrink-0">
                    {partners.map((partner, i) => (
                        <PartnerCard key={`a-${i}`} partner={partner} />
                    ))}
                </div>
                <div className="flex items-stretch shrink-0" aria-hidden="true">
                    {partners.map((partner, i) => (
                        <PartnerCard key={`b-${i}`} partner={partner} />
                    ))}
                </div>
            </motion.div>
        </div>
    );
}

export default function TrustBar() {
    return (
        <section id="partners" className="py-20 relative">
            {/* Ana Sponsor */}
            <div className="flex flex-col items-center mb-16 px-4">
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-px w-16 bg-gradient-to-r from-transparent to-cyan-500/30" />
                    <span className="text-[11px] font-bold tracking-[0.28em] uppercase text-cyan-500/70">
                        Ana Sponsor
                    </span>
                    <div className="h-px w-16 bg-gradient-to-l from-transparent to-cyan-500/30" />
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="relative h-16 w-64 sm:h-20 sm:w-80"
                >
                    <Image
                        src={`${BASE_PATH}/images/mupa-beyaz.svg`}
                        alt="MUPA - Muğla Planlama Ajansı"
                        fill
                        loading="eager"
                        sizes="320px"
                        className="object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
                    />
                </motion.div>
            </div>

            {/* Destekçiler */}
            <div className="flex items-center justify-center gap-4 mb-10 px-4">
                <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent to-white/[0.08]" />
                <div className="flex items-center gap-2.5">
                    <div className="w-1 h-1 rounded-full bg-cyan-500/50" />
                    <span className="text-[11px] font-bold tracking-[0.28em] uppercase text-gray-500">
                        Destekçilerimiz
                    </span>
                    <div className="w-1 h-1 rounded-full bg-cyan-500/50" />
                </div>
                <div className="h-px flex-1 max-w-[100px] bg-gradient-to-l from-transparent to-white/[0.08]" />
            </div>

            <MarqueeRow duration={26} />
        </section>
    );
}
