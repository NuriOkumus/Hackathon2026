"use client";

import { motion } from "framer-motion";
import { MapPin, Building2, Car, Plane } from "lucide-react";

const details = [
    { icon: Building2, label: "Mekan", value: "Atatürk Kültür Merkezi" },
    { icon: MapPin, label: "Adres", value: "Muğla Merkez, 48000" },
    { icon: Car, label: "Araçla", value: "Muğla şehir merkezine ~5 dakika" },
    { icon: Plane, label: "En Yakın Havalimanı", value: "Dalaman (DLM) — ~80 km" },
];

export default function Venue() {
    return (
        <section id="venue" className="py-16 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1/2 h-full bg-secondary/4 blur-[150px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/30 text-secondary text-sm font-medium mb-6">
                        <MapPin className="w-4 h-4" />
                        Etkinlik Mekanı
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        Nerede <span className="text-gradient">Buluşuyoruz?</span>
                    </h2>
                    <p className="text-gray-400 max-w-xl mx-auto">
                        Muğla Sıtkı Koçman Üniversitesi kampüsünün kalbinde, 24 saatlik maratonumuza ev sahipliği yapacak.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-stretch max-w-5xl mx-auto">
                    {/* Map */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl h-[300px] md:h-[400px]"
                    >
                        <iframe
                            src="https://maps.google.com/maps?q=37.164992649754495,28.370143760973345&t=&z=17&ie=UTF8&iwloc=B&output=embed"
                            width="600"
                            height="400"
                            style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)", width: "100%", height: "100%" }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="AKM Harita"
                        />
                    </motion.div>

                    {/* Details */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="flex flex-col justify-center space-y-5"
                    >
                        <div>
                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                Atatürk Kültür Merkezi
                            </h3>
                            <p className="text-gray-400 leading-relaxed">
                                24 saatlik maratonumuz Muğla Atatürk Kültür Merkezi'nde gerçekleşecek.
                            </p>
                        </div>

                        <div className="space-y-3">
                            {details.map((d, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.15 + i * 0.08 }}
                                    className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary/20 hover:bg-white/[0.07] transition-all duration-300"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <d.icon className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">{d.label}</p>
                                        <p className="text-white font-medium text-sm mt-0.5">{d.value}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                    </motion.div>
                </div>
            </div>
        </section>
    );
}
