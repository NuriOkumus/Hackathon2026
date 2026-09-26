"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
    {
        question: "Kimler katılabilir?",
        answer: "Tüm üniversite öğrencileri katılabilir. Başvuru formunda Github hesabınız zorunludur. Yüksek başvuru durumunda ön eleme yapılabilir.",
    },
    {
        question: "Takımlar nasıl oluşturulacak?",
        answer: "Takımlar 3 ila 5 kişi olmalıdır. Toplam 15 takım kapasitesi vardır. Onay alan katılımcılar için takımlar oluşturulur ve her takıma grup numarası atanır.",
    },
    {
        question: "Lokasyon neresi?",
        answer: "Muğla Atatürk Kültür Merkezi'nde düzenlenecektir. Check-in sırasında swag pack (tişört, rozet, sticker, defter, kalem, çanta) verilecektir.",
    },
    {
        question: "Yemek ve ikramlar ne olacak?",
        answer: "Pizza, tantuni, kahvaltı, gece çorbası ve sürekli atıştırmalık/kahve ikramı organizasyon tarafından sağlanacaktır. Tam programı Timeline bölümünden görebilirsiniz.",
    },
    {
        question: "Değerlendirme nasıl yapılacak?",
        answer: "Her takım jüri heyetine 6 dakika sunum yapar: 3 dk proje sunumu + 1 dk canlı demo + 2 dk soru-cevap. Tüm sunumlar tamamlandıktan sonra kümülatif puanlama ile ilk 3 takım belirlenir. Kriterler: Fikir/Etki, Teknik Uygulama, Tasarım/Sunum.",
    },
    {
        question: "Teslim gereklilikleri neler?",
        answer: "Çalışan ürün (live demo), proje afişi, sunum dosyası ve son commit zorunludur. Bunları karşılamayan takımlar değerlendirmeye alınmaz.",
    },
    {
        question: "Jüri ve mentörler kimler?",
        answer: "Jüri üyeleri ve mentörler yarışma günü duyurulacaktır.",
    },
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section id="faq" className="py-16">
            <div className="container mx-auto px-4 max-w-3xl">
                <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">Sıkça Sorulanlar</h2>

                <div className="space-y-3">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={cn(
                                "relative border rounded-xl overflow-hidden transition-all duration-300",
                                openIndex === index
                                    ? "border-primary/40 bg-primary/[0.04] shadow-[0_0_24px_rgba(34,211,238,0.06)]"
                                    : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.07]"
                            )}
                        >
                            {/* Left accent bar */}
                            <div className={cn(
                                "absolute left-0 top-0 bottom-0 w-0.5 transition-opacity duration-300",
                                openIndex === index
                                    ? "bg-gradient-to-b from-primary via-primary/50 to-transparent opacity-100"
                                    : "opacity-0 bg-primary"
                            )} />

                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex items-center justify-between p-4 sm:p-6 text-left hover:bg-white/[0.03] transition-colors"
                            >
                                <span className="font-semibold text-base sm:text-lg text-white pr-3">{faq.question}</span>
                                <ChevronDown
                                    className={`w-5 h-5 transition-transform duration-300 ${openIndex === index ? "rotate-180 text-primary" : "text-gray-400"
                                        }`}
                                />
                            </button>

                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-4 sm:p-6 pt-0 text-gray-400 border-t border-white/5 text-sm sm:text-base">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
