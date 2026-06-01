import { motion } from 'framer-motion';

const VALUES = [
  {
    icon: '⚡',
    title: 'Hız & Yalınlık',
    desc: 'Her mekanik sezgisel, her piksel kasıtlı. Gürültüyü çıkar, özü bırak.',
  },
  {
    icon: '🎮',
    title: 'Oyuncu Odaklı',
    desc: 'Her kararı gerçek oyuncularla test ederiz. Eğlence asla pazarlamaya kurban edilmez.',
  },
  {
    icon: '🔬',
    title: 'AR-GE Kültürü',
    desc: 'Kanıtlanmış kalıpları kırarız. Her proje bir deney, her hata bir ders.',
  },
  {
    icon: '🌍',
    title: 'Küresel Vizyon',
    desc: 'İstanbul\'dan dünyanın her köşesine ulaşan oyunlar yapıyoruz.',
  },
];

const TIMELINE = [
  { year: '2023', event: 'Ardeko Studios kuruldu', sub: '1 geliştirici, 0 ödün.' },
  { year: '2024', event: 'Legend of Rey', sub: 'Itchi.io da ilk oyunumuz yayınlandı.' },
  { year: '2025', event: 'Wordeko, Protocol ve Nebula - Bubble Shooter', sub: '3 farklı mini mobil oyun ardaguner.com da yayınlandı.' },
  { year: '2026', event: 'Switch Master: Railway', sub: 'İlk oyun App Store\'da yayına girdi.' },
  { year: '2026', event: 'Yeni Proje başladı', sub: 'Yeni nesil mekanikler geliştiriliyor.' },
  { year: '2026', event: 'Büyüme dönemi', sub: 'Ekip genişliyor, vizyon büyüyor.' },
];

const valuesContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const valueItem = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const timelineContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const timelineItemLeft = {
  hidden: { opacity: 0, x: -40 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const timelineItemRight = {
  hidden: { opacity: 0, x: 40 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function About() {
  return (
    <section id="about" className="py-32 px-6 overflow-hidden">
      <div className="max-w-[1280px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
          className="mb-24 text-center lg:text-left"
        >
          <p className="text-[11px] font-black tracking-[0.4em] text-indigo-400 uppercase mb-3">
            Kim Olduğumuz
          </p>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            Hakkımızda
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9 }}
            className="flex flex-col justify-center"
          >
            <p className="text-2xl sm:text-3xl font-black text-white leading-tight mb-6 tracking-tight">
              "Mobil oyun yapmak değil,{' '}
              <span className="text-indigo-400">deneyim tasarlamak</span>{' '}
              için buradayız."
            </p>
            <p className="text-gray-400 text-base font-light leading-relaxed mb-6">
              Ardeko Studios, İstanbul merkezli bağımsız bir mobil oyun stüdyosudur. Fizik tabanlı
              mekanikler, minimalist estetik ve bağımlılık yaratan döngüler üzerine uzmanlaşıyoruz.
            </p>
            <p className="text-gray-500 text-sm font-light leading-relaxed">
              Küçük ama odaklıyız. Her projede "bu gerçekten gerekli mi?" sorusunu soruyoruz ve
              cevap hayır ise çıkarıyoruz. Geri kalan her şeyi mükemmelleştiriyoruz.
            </p>

            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
              className="mt-10 h-px w-full bg-gradient-to-r from-indigo-500/50 via-purple-500/30 to-transparent origin-left"
            />
          </motion.div>

          <motion.div
            variants={valuesContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-40px' }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {VALUES.map((v, i) => (
              <motion.div
                key={i}
                variants={valueItem}
                whileHover={{ y: -4, borderColor: 'rgba(99,102,241,0.3)' }}
                className="bg-white/[0.02] border border-white/8 rounded-2xl p-5 flex flex-col gap-3 cursor-default transition-colors"
              >
                <span className="text-2xl">{v.icon}</span>
                <h4 className="text-sm font-black text-white tracking-tight">{v.title}</h4>
                <p className="text-xs text-gray-500 font-light leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-[11px] font-black tracking-[0.4em] text-gray-500 uppercase mb-10 text-center">
            Yolculuğumuz
          </p>

          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/5 hidden sm:block" />
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/40 to-transparent origin-top hidden sm:block"
            />

            <motion.div
              variants={timelineContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-40px' }}
              className="flex flex-col gap-8"
            >
              {TIMELINE.map((item, i) => (
                <motion.div
                  key={i}
                  variants={i % 2 === 0 ? timelineItemLeft : timelineItemRight}
                  className={`flex items-center gap-6 ${
                    i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'
                  } flex-row`}
                >
                  <div className={`flex-1 ${i % 2 === 0 ? 'sm:text-right text-left' : 'text-left'}`}>
                    <span className="text-[10px] font-black tracking-widest text-indigo-400 uppercase">
                      {item.year}
                    </span>
                    <h4 className="text-base font-black text-white mt-1">{item.event}</h4>
                    <p className="text-xs text-gray-500 font-light mt-0.5">{item.sub}</p>
                  </div>

                  <motion.div
                    whileInView={{ scale: [0, 1.3, 1] }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 + 0.2 }}
                    className="w-3 h-3 rounded-full bg-indigo-500 border-2 border-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.5)] flex-shrink-0 z-10"
                  />

                  <div className="flex-1 hidden sm:block" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
