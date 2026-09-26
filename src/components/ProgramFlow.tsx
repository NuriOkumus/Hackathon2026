"use client";

import { motion } from "framer-motion";
import { Clock, Coffee, Pizza, Users, Lightbulb, Code, Presentation, Trophy, Soup } from "lucide-react";
import { cn } from "@/lib/utils";

type EventColor = "cyan" | "purple" | "yellow";

interface ProgramEvent {
    time: string;
    title: string;
    description: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: React.ComponentType<any>;
    color: EventColor;
    special?: boolean;
}

interface Phase {
    label: string | null;
    events: ProgramEvent[];
}

const phases: Phase[] = [
    {
        label: "13 Mayıs · Sabah",
        events: [
            { time: "10:00", title: "Açılış & Kahvaltı", description: "Kayıt, yaka kartları ve Swag Pack dağıtımı, kahvaltı ikramı", icon: Coffee, color: "cyan" },
            { time: "11:00", title: "Açılış Konuşmaları", description: "Rektör, Topluluk Başkanı, sponsor konuşmaları, tema lansmanı ve teslim gerekliliklerinin duyurusu", icon: Presentation, color: "purple" },
        ],
    },
    {
        label: null,
        events: [
            { time: "12:00", title: "Hackathon Start! 🚀", description: "Geri sayım bitimi, kodlama resmen başlıyor", icon: Code, color: "yellow", special: true },
        ],
    },
    {
        label: "13 Mayıs · Öğleden Sonra & Akşam",
        events: [
            { time: "13:00", title: "Mentör 1: Fikir Doğrulama", description: "Mentörler masaları gezer, ekiplere geri bildirim verir", icon: Lightbulb, color: "cyan" },
            { time: "14:00", title: "Öğle Yemeği", description: "Pizza + içecek dağıtımı", icon: Pizza, color: "purple" },
            { time: "18:00", title: "Mentör 2: Süreç Doğrulama", description: "Mentörlerin ikinci turu, teknik destek", icon: Users, color: "cyan" },
            { time: "20:00", title: "Akşam Yemeği", description: "Tavuk pilav ikramı", icon: Pizza, color: "purple" },
        ],
    },
    {
        label: "13 Mayıs · Gece",
        events: [
            { time: "23:00", title: "Yarı Yol Kontrolü", description: "VBT ekibi tur atar, sorunlar çözülür", icon: Clock, color: "cyan" },
            { time: "00:00", title: "Gece Yarısı Aktivitesi", description: "Kahoot yarışması, kağıt uçak şampiyonası, müzik & moral etkinlikleri", icon: Coffee, color: "yellow" },
        ],
    },
    {
        label: "14 Mayıs · Sabah",
        events: [
            { time: "08:00", title: "Kahvaltı", description: "Çorba arabası servisi", icon: Soup, color: "cyan" },
            { time: "10:00", title: "Mentör 3 & Sunum Eğitimi", description: "Son mentor turu + profesyonel koç eşliğinde sunum eğitimi. Teslim gereklilikleri hatırlatılır (son 2 saat uyarısı)", icon: Lightbulb, color: "cyan" },
            { time: "11:00", title: "Teslim Portalı — Son 1 Saat", description: "Portal açılışı, afiş/sunum yükleme + son commit atma", icon: Presentation, color: "purple" },
        ],
    },
    {
        label: null,
        events: [
            { time: "12:00", title: "Eller Yukarı! ⏰", description: "Kodlama bitti, gereklilik kontrolü, makarna ikramı + dinlenme & müzik", icon: Trophy, color: "yellow", special: true },
        ],
    },
    {
        label: "14 Mayıs · Değerlendirme",
        events: [
            { time: "13:00", title: "Salona Geçiş", description: "Tüm katılımcılar değerlendirme salonuna geçer", icon: Users, color: "cyan" },
            { time: "13:15", title: "Blok 1 — Takım 1–5", description: "Her takım 6 dk: 3 dk sunum + 1 dk canlı demo + 2 dk soru-cevap", icon: Presentation, color: "purple" },
            { time: "13:45", title: "Değerlendirme Arası", description: "15 dk mola", icon: Clock, color: "cyan" },
            { time: "14:00", title: "Blok 2 — Takım 6–10", description: "Her takım 6 dk: 3 dk sunum + 1 dk canlı demo + 2 dk soru-cevap", icon: Presentation, color: "purple" },
            { time: "14:30", title: "Değerlendirme Arası", description: "15 dk mola", icon: Clock, color: "cyan" },
            { time: "14:45", title: "Blok 3 — Takım 11–15", description: "Her takım 6 dk: 3 dk sunum + 1 dk canlı demo + 2 dk soru-cevap", icon: Presentation, color: "purple" },
            { time: "15:15", title: "Nihai Değerlendirme", description: "Jüri nihai puanlama arası — 15 dk", icon: Clock, color: "cyan" },
        ],
    },
    {
        label: null,
        events: [
            { time: "15:30", title: "Ödül Töreni 🏆", description: "Kazananların açıklanması, ödüllerin takdimi ve kapanış konuşması", icon: Trophy, color: "yellow", special: true },
        ],
    },
];

const colorConfig: Record<EventColor, { text: string; dot: string; card: string; line: string }> = {
    cyan: {
        text: "text-cyan-400",
        dot: "bg-cyan-950 border-cyan-500/50",
        card: "bg-cyan-950/20 border-cyan-500/20 hover:border-cyan-500/40",
        line: "bg-gradient-to-b from-cyan-500/30 to-transparent",
    },
    purple: {
        text: "text-purple-400",
        dot: "bg-purple-950 border-purple-500/50",
        card: "bg-purple-950/20 border-purple-500/20 hover:border-purple-500/40",
        line: "bg-gradient-to-b from-purple-500/30 to-transparent",
    },
    yellow: {
        text: "text-yellow-400",
        dot: "bg-yellow-950 border-yellow-500/50",
        card: "bg-yellow-950/20 border-yellow-500/20 hover:border-yellow-500/40",
        line: "bg-gradient-to-b from-yellow-500/30 to-transparent",
    },
};

const specialBorder: Record<EventColor, string> = {
    cyan: "from-cyan-400/50 via-cyan-600/20 to-transparent",
    purple: "from-purple-400/50 via-purple-600/20 to-transparent",
    yellow: "from-yellow-400/60 via-yellow-600/20 to-orange-900/10",
};

export default function ProgramFlow() {
    return (
        <section id="program" className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:48px_48px]" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium mb-6">
                        <Clock className="w-4 h-4" />
                        24 Saatlik Maraton
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">
                        Program <span className="text-gradient">Akışı</span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        13 Mayıs sabah 10:00&apos;dan 14 Mayıs 15:30&apos;a kadar detaylı program
                    </p>
                </motion.div>

                {/* Timeline */}
                <div className="max-w-2xl mx-auto">
                    {phases.map((phase, phaseIdx) => (
                        <div key={phaseIdx}>
                            {/* Phase separator */}
                            {phase.label && (
                                <div className="flex items-center gap-4 mt-10 mb-6">
                                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/15" />
                                    <span className="text-[11px] font-bold tracking-widest uppercase text-gray-500 px-2 whitespace-nowrap">
                                        {phase.label}
                                    </span>
                                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/15" />
                                </div>
                            )}

                            {/* Events */}
                            {phase.events.map((event, eventIdx) => {
                                const cfg = colorConfig[event.color];
                                const Icon = event.icon;
                                const isLast = eventIdx === phase.events.length - 1;

                                if (event.special) {
                                    return (
                                        <motion.div
                                            key={eventIdx}
                                            initial={{ opacity: 0, scale: 0.97 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            viewport={{ once: true }}
                                            className="my-4"
                                        >
                                            <div className={cn("p-px rounded-2xl bg-gradient-to-r", specialBorder[event.color])}>
                                                <div className="rounded-2xl bg-background p-5 flex items-center gap-5">
                                                    <div className={cn(
                                                        "w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 border-2",
                                                        cfg.dot
                                                    )}>
                                                        <Icon className={cn("w-7 h-7", cfg.text)} />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className={cn("text-base font-mono font-bold", cfg.text)}>
                                                                {event.time}
                                                            </span>
                                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border bg-yellow-500/10 border-yellow-500/30 text-yellow-400">
                                                                ÖNEMLİ
                                                            </span>
                                                        </div>
                                                        <h3 className="text-lg font-bold text-white">{event.title}</h3>
                                                        <p className="text-sm text-gray-400 mt-0.5">{event.description}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                }

                                return (
                                    <motion.div
                                        key={eventIdx}
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: eventIdx * 0.06 }}
                                        className="grid grid-cols-[4.5rem_2.5rem_1fr] items-start"
                                    >
                                        {/* Time */}
                                        <div className="text-right pr-3 pt-2 flex-shrink-0">
                                            <span className={cn("text-xs font-mono font-bold leading-tight block", cfg.text)}>
                                                {event.time}
                                            </span>
                                        </div>

                                        {/* Dot + connecting line */}
                                        <div className="flex flex-col items-center">
                                            <div className={cn(
                                                "w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 z-10",
                                                cfg.dot
                                            )}>
                                                <Icon className={cn("w-3.5 h-3.5", cfg.text)} />
                                            </div>
                                            {!isLast && (
                                                <div className={cn("w-px min-h-[2rem] flex-1", cfg.line)} />
                                            )}
                                        </div>

                                        {/* Content card */}
                                        <div className={cn(
                                            "ml-3 mb-4 rounded-xl border p-3.5 transition-all duration-300",
                                            cfg.card
                                        )}>
                                            <h3 className="font-semibold text-white text-sm mb-0.5">{event.title}</h3>
                                            <p className="text-xs text-gray-400 leading-relaxed">{event.description}</p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    ))}
                </div>

                {/* Footer note */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-12 max-w-2xl mx-auto p-px rounded-xl bg-gradient-to-r from-primary/20 to-transparent"
                >
                    <div className="rounded-xl bg-background p-5">
                        <p className="text-sm text-gray-400 text-center">
                            <span className="text-primary font-semibold">Not:</span> Atıştırmalık ve kahve ikramı kesintisiz devam edecektir.
                            Teknik destek ekibi süresince yardıma hazır olacaktır.
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
