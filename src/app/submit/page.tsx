"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import SubmitForm from "@/components/submit/SubmitForm";

export default function SubmitPage() {
    return (
        <main className="relative z-10 min-h-screen text-foreground overflow-x-hidden selection:bg-primary/30 flex flex-col">
            <Header />

            {/* Page Content */}
            <div className="flex-grow pt-32 pb-24 px-4 sm:px-6">
                <div className="container mx-auto max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <div className="text-center mb-10">
                            <h1 className="text-4xl font-black text-white mb-3">Proje Teslimi</h1>
                            <p className="text-gray-500">Hackathon projenizi aşağıdaki formu doldurarak teslim edin.</p>
                        </div>
                        <SubmitForm />
                    </motion.div>
                </div>
            </div>

            <div className="mt-auto">
                <Footer />
            </div>
        </main>
    );
}
