import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
    title: "Gizlilik Politikası | VBT Hackathon 2026",
};

export default function Gizlilik() {
    return (
        <main className="relative z-10 min-h-screen bg-[#05050a] py-20 px-4">
            <div className="max-w-3xl mx-auto">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-cyan-400 transition-colors mb-12"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Ana Sayfa
                </Link>

                <h1 className="text-3xl md:text-4xl font-black text-white mb-3">Gizlilik Politikası</h1>
                <p className="text-gray-500 text-sm mb-12">
                    VBT Hackathon 2026 — Son güncelleme: Mart 2026
                </p>

                <div className="space-y-10 text-gray-400 text-sm leading-relaxed">

                    <div>
                        <h2 className="text-lg font-bold text-cyan-400 mb-4">1. Kapsam</h2>
                        <p>
                            Bu politika, <strong className="text-white">vbthackathon.com.tr</strong> alan adı üzerinde yayımlanan
                            VBT Hackathon 2026 web sitesini ("Site") kullanan ziyaretçilere ve başvuru sürecine katılan
                            bireylere uygulanır. Siteyi kullanarak bu politikayı kabul etmiş sayılırsınız.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-bold text-cyan-400 mb-4">2. Topladığımız Veriler</h2>
                        <p className="mb-3">
                            <strong className="text-white">Başvuru formu aracılığıyla</strong> (yalnızca başvuru yapanlar için):
                        </p>
                        <ul className="space-y-2 mb-4">
                            {["Ad soyad, e-posta, telefon", "Üniversite ve bölüm bilgisi", "Özgeçmiş (CV) dosyası", "Takım bilgileri ve proje özeti"].map((item, i) => (
                                <li key={i} className="flex gap-3">
                                    <span className="text-cyan-500/50 mt-0.5 shrink-0">—</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <p className="mb-3">
                            <strong className="text-white">Otomatik olarak</strong> (tüm ziyaretçiler için):
                        </p>
                        <ul className="space-y-2">
                            {[
                                "Cloudflare Web Analytics aracılığıyla anonim ziyaretçi istatistikleri (IP adresi işlenmez, çerez kullanılmaz)",
                            ].map((item, i) => (
                                <li key={i} className="flex gap-3">
                                    <span className="text-cyan-500/50 mt-0.5 shrink-0">—</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-lg font-bold text-cyan-400 mb-4">3. Çerez Kullanımı</h2>
                        <p>
                            Site, kullanıcı takibi amacıyla çerez (<em>cookie</em>) kullanmamaktadır. Oturum yönetimi için
                            yalnızca <code className="bg-white/5 px-1.5 py-0.5 rounded text-xs text-cyan-300">sessionStorage</code> kullanılmakta
                            olup bu veri tarayıcı kapatıldığında otomatik olarak silinir.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-bold text-cyan-400 mb-4">4. Verilerin Kullanım Amacı</h2>
                        <ul className="space-y-2">
                            {[
                                "Hackathon başvurularının değerlendirilmesi",
                                "Katılımcılarla etkinlik iletişiminin sağlanması",
                                "Etkinlik organizasyonunun yürütülmesi",
                            ].map((item, i) => (
                                <li key={i} className="flex gap-3">
                                    <span className="text-cyan-500/50 mt-0.5 shrink-0">—</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-lg font-bold text-cyan-400 mb-4">5. Veri Güvenliği</h2>
                        <p>
                            Başvuru verileri, erişim kontrolü sağlanmış güvenli veritabanı altyapısında (Supabase)
                            saklanmaktadır. Verilere yalnızca yetkili VBT organizasyon ekibi erişebilir.
                            Site tüm bağlantılarda HTTPS kullanmaktadır.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-bold text-cyan-400 mb-4">6. Üçüncü Taraflarla Paylaşım</h2>
                        <p>
                            Toplanan kişisel veriler; sponsorlar, iş ortakları veya herhangi bir üçüncü tarafla
                            <strong className="text-white"> kesinlikle paylaşılmaz</strong>. Veriler yalnızca VBT organizasyon
                            ekibi bünyesinde kalır.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-bold text-cyan-400 mb-4">7. Saklama ve Silme</h2>
                        <p>
                            Tüm başvuru verileri, hackathon etkinliğinin sona ermesinin ardından
                            <strong className="text-white"> 1 (bir) hafta içinde</strong> kalıcı olarak silinir.
                            Bu süre öncesinde verinizin silinmesini talep etmek için bizimle iletişime geçebilirsiniz.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-bold text-cyan-400 mb-4">8. Politika Değişiklikleri</h2>
                        <p>
                            Bu politika zaman zaman güncellenebilir. Önemli değişiklikler bu sayfada duyurulacaktır.
                            Siteyi kullanmaya devam etmeniz güncel politikayı kabul ettiğiniz anlamına gelir.
                        </p>
                    </div>

                </div>

                <div className="mt-16 pt-8 border-t border-white/5 text-xs text-gray-600">
                    İletişim:{" "}
                    <a href="mailto:veribilimimsku@gmail.com" className="text-cyan-500/70 hover:text-cyan-400 transition-colors">
                        veribilimimsku@gmail.com
                    </a>
                </div>
            </div>
        </main>
    );
}
