"use client";

import { Instagram, Linkedin, Mail } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { BASE_PATH } from "@/lib/constants";

export default function Footer() {
    return (
        <footer className="py-16 border-t border-white/10 text-gray-400 font-light">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 lg:gap-12 mb-10 md:mb-16">

                    {/* Brand Column */}
                    <div className="col-span-2 md:col-span-1 space-y-6">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                                <Image
                                    src={`${BASE_PATH}/images/vbtlogo.png`}
                                    alt="VBT Logo"
                                    width={24}
                                    height={24}
                                    className="w-6 h-6 object-contain"
                                />
                            </div>
                            <span className="font-bold text-xl tracking-tight text-white group-hover:text-primary transition-colors">
                                VBT<span className="text-secondary">2026</span>
                            </span>
                        </Link>
                        <p className="text-sm leading-relaxed">
                            Muğla için akıllı şehir çözümleri üreten teknoloji maratonu.
                        </p>
                        <div className="space-y-2 text-sm">
                            <a href="mailto:veribilimimsku@gmail.com" className="flex items-center gap-2 hover:text-white transition-colors">
                                <Mail className="w-4 h-4 text-secondary" />
                                veribilimimsku@gmail.com
                            </a>
                        </div>
                    </div>

                    {/* Links Column */}
                    <div>
                        <h4 className="text-white font-semibold mb-6">Bağlantılar</h4>
                        <ul className="space-y-4 text-sm">
                            <li><Link href="#about" className="hover:text-primary transition-colors">Hakkında</Link></li>
                            <li><Link href="#timeline" className="hover:text-primary transition-colors">Süreç</Link></li>
                            <li><Link href="#prizes" className="hover:text-primary transition-colors">Ödüller</Link></li>
                            <li><Link href="#faq" className="hover:text-primary transition-colors">SSS</Link></li>
                        </ul>
                    </div>

                    {/* Legal Column */}
                    <div>
                        <h4 className="text-white font-semibold mb-6">Yasal</h4>
                        <ul className="space-y-4 text-sm">
                            <li><Link href="/katilim-sartlari" className="hover:text-primary transition-colors">Katılım Şartları</Link></li>
                            <li><Link href="/kvkk" className="hover:text-primary transition-colors">KVKK Aydınlatma</Link></li>
                            <li><Link href="/gizlilik" className="hover:text-primary transition-colors">Gizlilik Politikası</Link></li>
                        </ul>
                    </div>

                    {/* Socials Column */}
                    <div>
                        <h4 className="text-white font-semibold mb-6">Sosyal Medya</h4>
                        <p className="text-sm mb-6">Yeniliklerden haberdar olmak için bizi takip edin.</p>
                        <div className="flex gap-4">
                            <Link href="https://www.linkedin.com/company/ds-research-group/" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-lg hover:bg-white/10 hover:text-white transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </Link>
                            <Link href="https://www.instagram.com/veribilimimsku" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-lg hover:bg-white/10 hover:text-white transition-colors">
                                <Instagram className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
                    <p>&copy; 2026 MSKÜ Veri Bilimi Topluluğu. Tüm Hakları Saklıdır.</p>
                    <p className="opacity-50">Designed for Future</p>
                </div>
            </div>
        </footer>
    );
}
