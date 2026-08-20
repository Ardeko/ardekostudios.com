/* ------------------------------------------------------------------
   Yolculuk — kilometre taşlarının YAPISAL verisi.

   Buradaki hiçbir alan çevrilmez: yıl, ay, kategori, teknoloji etiketi
   ve linkler iki dilde de aynıdır. Çevrilen metin (başlık açıklaması)
   `i18n-content.js` içinde `about.journeyItems[id]` altında durur —
   `Games.jsx`'in yapı/metin ayrımıyla aynı desen.

   KAYNAKLAR — hepsi doğrulandı, uydurma yok:
   - GitHub `api.github.com/users/Ardeko/repos` (repo oluşturma tarihleri)
   - ardaguner.com proje kataloğu (açıklamalar ve teknoloji yığınları)
   - Eski canlı sitedeki tarihçe (stüdyo kilometre taşları)
   - Yerel repolar: ~/Desktop/projects/{decoy,torpidodan,dny-bilisim}

   Teknofest (2023) ve Renault (2024) tarihleri kullanıcı tarafından
   doğrulandı — bu ikisinin repo kaydı yok.

   EKSİK: "Unichain Blockchain İzleme Zinciri" ardaguner.com'da listeli
   ama ne repo ne de tarih var. Yılı bilinmediği için çizelgeye
   EKLENMEDİ — uydurulmuş bir yıl basmaktansa dışarıda bırakıldı.
   Arda yılı söylerse buraya bir satır eklemek yeterli.
------------------------------------------------------------------- */

export const CATEGORIES = ['studio', 'game', 'app', 'corporate', 'rnd'];

const GH = 'https://github.com/Ardeko';

export const MILESTONES = [
  {
    id: 'studioFounded',
    year: 2023,
    category: 'studio',
    tech: [],
    links: {},
  },
  {
    id: 'protocol',
    year: 2023,
    month: 7,
    category: 'game',
    tech: ['JavaScript', 'HTML5 Canvas'],
    links: { github: `${GH}/protocol` },
  },
  {
    id: 'ardobot',
    year: 2023,
    month: 8,
    category: 'app',
    tech: ['Node.js', 'Discord.js', 'AI'],
    links: { github: `${GH}/ardobot` },
  },
  {
    id: 'teknofest',
    year: 2023,
    category: 'rnd',
    tech: ['Python', 'OpenCV', 'Görüntü İşleme'],
    links: {},
  },
  {
    id: 'wordeko',
    year: 2024,
    month: 4,
    category: 'game',
    tech: ['JavaScript', 'Web'],
    links: { github: `${GH}/wordeko`, live: 'https://ardaguner.com' },
  },
  {
    id: 'legendOfRey',
    year: 2024,
    category: 'game',
    tech: ['Python', 'Pygame'],
    links: { github: `${GH}/Legend-Of-Rey` },
  },
  {
    id: 'renault',
    year: 2024,
    category: 'corporate',
    tech: ['Kurumsal', 'Mobil'],
    links: {},
    restricted: true,
  },
  {
    id: 'ardaguner',
    year: 2024,
    month: 11,
    category: 'web',
    tech: ['React', 'Vite'],
    links: { github: `${GH}/ardaguner.com`, live: 'https://ardaguner.com' },
  },
  {
    id: 'stok',
    year: 2025,
    month: 6,
    category: 'corporate',
    tech: ['C#', 'ASP.NET Core MVC', 'MSSQL'],
    links: { github: `${GH}/StokEkstresiApp` },
  },
  {
    id: 'revo',
    year: 2025,
    month: 7,
    category: 'app',
    tech: ['SignalR', 'WebRTC', 'React'],
    links: { github: `${GH}/Revo`, live: 'https://ardekostudios.xyz' },
  },
  {
    id: 'nebula',
    year: 2025,
    month: 7,
    category: 'game',
    tech: ['React', 'Phaser 3', 'FastAPI', 'MongoDB'],
    links: { github: `${GH}/Nebula`, live: 'https://ardaguner.com' },
  },
  {
    id: 'switchMaster',
    year: 2026,
    category: 'game',
    tech: ['Unity', 'iOS', 'Android'],
    links: {
      appStore:
        'https://apps.apple.com/tr/app/switch-master-railway/id6770972534?l=tr',
      googlePlay:
        'https://play.google.com/store/apps/details?id=com.ardeko.switchmaster&pcampaignid=web_share',
    },
    highlight: true,
  },
  {
    id: 'ardekostudios',
    year: 2026,
    month: 5,
    category: 'web',
    tech: ['React 19', 'Vite 8', 'Tailwind v4'],
    links: { github: `${GH}/ardekostudios.com`, live: 'https://ardekostudios.com' },
  },
  {
    id: 'sarteks',
    year: 2026,
    month: 6,
    category: 'corporate',
    tech: ['Next.js 16', 'TypeScript', 'Tailwind v4', 'Matter.js'],
    links: { live: 'https://sarteks.com.tr' },
  },
  {
    id: 'dny',
    year: 2026,
    month: 8,
    category: 'corporate',
    tech: ['HTML', 'CSS', 'SEO'],
    links: { github: `${GH}/dny-bilisim` },
  },
  {
    id: 'decoy',
    year: 2026,
    month: 8,
    category: 'game',
    tech: ['JavaScript', 'Firebase', 'Firestore'],
    links: {},
    inProgress: true,
  },
  {
    id: 'torpidodan',
    year: 2026,
    month: 8,
    category: 'game',
    tech: ['React', 'TypeScript', 'Capacitor'],
    links: {},
    inProgress: true,
  },
  {
    id: 'growth',
    year: 2026,
    category: 'studio',
    tech: [],
    links: {},
  },
];

// 'web' kategorisi filtre çubuğunda 'app' altında toplanıyor: ziyaretçi için
// "uygulama mı, web sitesi mi" ayrımı çizelgeyi zenginleştirmiyor, sadece
// bir çip daha ekliyor. Rozet metni yine de kendi kategorisini gösterir.
export const FILTER_OF = { studio: 'studio', game: 'game', app: 'app', web: 'app', corporate: 'corporate', rnd: 'rnd' };

export function groupByYear(items) {
  const years = [];
  for (const item of items) {
    const last = years[years.length - 1];
    if (last && last.year === item.year) last.items.push(item);
    else years.push({ year: item.year, items: [item] });
  }
  return years;
}
