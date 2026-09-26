import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
    title: "Katılım Şartları | VBT Hackathon 2026",
};

const sections = [
    {
        title: "1. Genel Koşullar",
        items: [
            "Hackathon'a katılım tamamen ücretsizdir.",
            "Türkiye'deki herhangi bir üniversitede kayıtlı öğrenciler başvurabilir. Mezunlar katılamaz.",
            "Yaş sınırı yoktur.",
            "Başvuru, en az 3, en fazla 5 kişiden oluşan takımlar aracılığıyla yapılır. Bireysel başvuru kabul edilmez.",
            "Her katılımcı yalnızca bir takımda yer alabilir.",
        ],
    },
    {
        title: "2. Başvuru Süreci",
        items: [
            "Başvurular yalnızca vbthackathon.com.tr/apply adresi üzerinden, belirlenen başvuru tarihleri arasında kabul edilir.",
            "Başvuru sırasında takım kaptanı ve tüm üyelerin güncel CV'lerini yüklemesi zorunludur.",
            "Eksik veya yanıltıcı bilgi içeren başvurular değerlendirmeye alınmaz.",
            "Kabul/ret bildirimleri başvuruda belirtilen e-posta adresine iletilir.",
        ],
    },
    {
        title: "3. Etkinlik Kuralları",
        items: [
            "Tüm çalışmalar etkinlik süresince, organizatörlerin belirlediği alan içinde üretilmelidir.",
            "Daha önce geliştirilmiş proje ve ürünlerin kullanımı yasaktır. Açık kaynak kütüphane ve araçlar serbesttir.",
            "Jüri ve organizatörlerin talimatlarına uyulması zorunludur.",
            "Etkinlik kurallarını ihlal eden takımlar diskalifiye edilebilir.",
        ],
    },
    {
        title: "4. Proje ve Fikri Mülkiyet",
        items: [
            "Hackathon süresince geliştirilen projelerin tüm fikri mülkiyet hakları tamamen ilgili takıma aittir.",
            "Organizatörler, takımların izni olmaksızın projeleri ticari amaçla kullanamaz.",
            "Takımlar, projelerini etkinlik sırasında ve sonrasında diledikleri gibi paylaşabilir, geliştirebilir veya kamuoyuna açabilir.",
        ],
    },
    {
        title: "5. Ödüller",
        items: [
            "Ödüller, jürinin değerlendirmesi sonucunda dereceye giren takımlara verilir.",
            "Ödül tutarları organizatör tarafından belirlenir ve önceden duyurulur.",
            "Dereceye giren takımların kazandıkları ödülleri talep etmeleri için organizatörle iletişime geçmeleri gerekir.",
        ],
    },
    {
        title: "6. Sorumluluk Reddi",
        items: [
            "Organizatörler, etkinlik süresince katılımcıların kişisel eşyalarından sorumlu değildir.",
            "Etkinlik programında değişiklik yapma hakkı organizatöre aittir.",
            "Katılımcılar etkinlik fotoğraf ve video çekimlerinde görüntülenebileceğini kabul eder; bu görseller etkinliğin tanıtımında kullanılabilir.",
        ],
    },
];

export default function KatilimSartlari() {
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

                <h1 className="text-3xl md:text-4xl font-black text-white mb-3">Katılım Şartları</h1>
                <p className="text-gray-500 text-sm mb-12">
                    VBT Hackathon 2026 — Son güncelleme: Mart 2026
                </p>

                <div className="space-y-10">
                    {sections.map((section) => (
                        <div key={section.title}>
                            <h2 className="text-lg font-bold text-cyan-400 mb-4">{section.title}</h2>
                            <ul className="space-y-3">
                                {section.items.map((item, i) => (
                                    <li key={i} className="flex gap-3 text-gray-400 text-sm leading-relaxed">
                                        <span className="text-cyan-500/50 mt-0.5 shrink-0">—</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-16 pt-8 border-t border-white/5 text-xs text-gray-600">
                    Sorularınız için:{" "}
                    <a href="mailto:veribilimimsku@gmail.com" className="text-cyan-500/70 hover:text-cyan-400 transition-colors">
                        veribilimimsku@gmail.com
                    </a>
                </div>
            </div>
        </main>
    );
}
