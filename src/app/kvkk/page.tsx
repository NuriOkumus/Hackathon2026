import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
    title: "KVKK Aydınlatma Metni | VBT Hackathon 2026",
};

export default function Kvkk() {
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

                <h1 className="text-3xl md:text-4xl font-black text-white mb-3">KVKK Aydınlatma Metni</h1>
                <p className="text-gray-500 text-sm mb-12">
                    6698 Sayılı Kişisel Verilerin Korunması Kanunu kapsamında hazırlanmıştır. — Mart 2026
                </p>

                <div className="space-y-10 text-gray-400 text-sm leading-relaxed">

                    <div>
                        <h2 className="text-lg font-bold text-cyan-400 mb-4">1. Veri Sorumlusu</h2>
                        <p>
                            Kişisel verileriniz, <strong className="text-white">Veri Bilimi Topluluğu (VBT)</strong> tarafından,
                            6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca aşağıda açıklanan amaç ve
                            yöntemlerle işlenmektedir.
                        </p>
                        <p className="mt-3">
                            İletişim:{" "}
                            <a href="mailto:veribilimimsku@gmail.com" className="text-cyan-500/70 hover:text-cyan-400 transition-colors">
                                veribilimimsku@gmail.com
                            </a>
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-bold text-cyan-400 mb-4">2. İşlenen Kişisel Veriler</h2>
                        <p className="mb-3">Hackathon başvurusu sırasında aşağıdaki kişisel veriler toplanmaktadır:</p>
                        <ul className="space-y-2">
                            {[
                                "Ad ve soyad",
                                "E-posta adresi",
                                "Telefon numarası",
                                "Üniversite ve bölüm bilgisi",
                                "Özgeçmiş (CV) — yalnızca başvuru değerlendirmesi için",
                                "Takım adı ve proje fikri özeti",
                            ].map((item, i) => (
                                <li key={i} className="flex gap-3">
                                    <span className="text-cyan-500/50 mt-0.5 shrink-0">—</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-lg font-bold text-cyan-400 mb-4">3. Kişisel Verilerin İşlenme Amacı</h2>
                        <ul className="space-y-2">
                            {[
                                "Hackathon başvurularının alınması ve değerlendirilmesi",
                                "Kabul/ret bildirimlerinin iletilmesi",
                                "Etkinlik organizasyonu ve lojistik süreçlerin yürütülmesi",
                                "Katılımcılarla etkinliğe ilişkin iletişimin sağlanması",
                            ].map((item, i) => (
                                <li key={i} className="flex gap-3">
                                    <span className="text-cyan-500/50 mt-0.5 shrink-0">—</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-lg font-bold text-cyan-400 mb-4">4. Kişisel Verilerin Aktarımı</h2>
                        <p>
                            Toplanan kişisel veriler yalnızca VBT organizasyon ekibi tarafından erişilebilir olup
                            <strong className="text-white"> hiçbir üçüncü taraf, sponsor, kurum veya kişiyle paylaşılmaz.</strong>
                        </p>
                        <p className="mt-3">
                            Veriler yurt dışına aktarılmaz.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-bold text-cyan-400 mb-4">5. Saklama Süresi</h2>
                        <p>
                            Kişisel verileriniz, hackathon'un sona ermesinden itibaren <strong className="text-white">1 (bir) hafta</strong> içinde
                            tüm sistemlerimizden kalıcı olarak silinecektir. Bu süre zarfında veriler yalnızca etkinlik
                            yönetimi amacıyla muhafaza edilir.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-bold text-cyan-400 mb-4">6. Hukuki Dayanak</h2>
                        <p>
                            Kişisel verileriniz, KVKK'nın 5. maddesi uyarınca <em>"bir sözleşmenin kurulması veya
                            ifasıyla doğrudan doğruya ilgili olması kaydıyla, sözleşmenin taraflarına ait kişisel
                            verilerin işlenmesinin gerekli olması"</em> hukuki sebebine dayanılarak işlenmektedir.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-bold text-cyan-400 mb-4">7. İlgili Kişi Hakları (KVKK Madde 11)</h2>
                        <p className="mb-3">KVKK'nın 11. maddesi kapsamında aşağıdaki haklara sahipsiniz:</p>
                        <ul className="space-y-2">
                            {[
                                "Kişisel verilerinizin işlenip işlenmediğini öğrenme",
                                "İşlenmişse buna ilişkin bilgi talep etme",
                                "İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme",
                                "Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme",
                                "Eksik veya yanlış işlenmişse düzeltilmesini isteme",
                                "KVKK'nın 7. maddesi çerçevesinde silinmesini veya yok edilmesini isteme",
                                "İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi durumunda aleyhinize bir sonucun ortaya çıkmasına itiraz etme",
                                "Kanuna aykırı işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme",
                            ].map((item, i) => (
                                <li key={i} className="flex gap-3">
                                    <span className="text-cyan-500/50 mt-0.5 shrink-0">—</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <p className="mt-4">
                            Bu haklarınızı kullanmak için{" "}
                            <a href="mailto:veribilimimsku@gmail.com" className="text-cyan-500/70 hover:text-cyan-400 transition-colors">
                                veribilimimsku@gmail.com
                            </a>{" "}
                            adresine yazabilirsiniz.
                        </p>
                    </div>

                </div>

                <div className="mt-16 pt-8 border-t border-white/5 text-xs text-gray-600">
                    Bu metin, 6698 sayılı KVKK'nın 10. maddesi uyarınca hazırlanmıştır.
                </div>
            </div>
        </main>
    );
}
