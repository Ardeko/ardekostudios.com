import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import { useLang } from '../lib/i18n';
import { SplitWords } from './Reveal';
import Spotlight from './Spotlight';
import Journey from './Journey';

/* ------------------------------------------------------------------
   Hakkımızda — Bento (2026-11-25).

   Eski düzen: solda alıntı + iki paragraf, sağda dört emoji'li kart.
   Yeni düzen bir bento ızgarası — "stüdyoya bir bakışta":

     lg (4 sütun)                         mobil/sm (2 sütun)
     ┌──────────────┬──────────────┐      ┌──────────┐
     │ MANİFESTO    │ İSTANBUL     │      │ MANİFESTO│
     │ alıntı + p1  │ piksel sanat │      ├──────────┤
     │ + p2         │ + yerel saat │      │ İSTANBUL │
     ├────┬────┬────┼────┬─────────┘      ├────┬─────┤
     │ ⚡  │ 🎮  │ 🔬  │ 🌍  │                │ ⚡  │ 🎮   │
     └────┴────┴────┴────┘                ├────┼─────┤
                                          │ 🔬  │ 🌍   │

   · Değer ikonları emoji DEĞİL: Codex imagegen ile üretilmiş tek parça
     bir cam ikon seti (assets-src/about/values-icons.png → dört 192px
     webp). Emoji platforma göre farklı çiziliyordu ve sitenin cam/indigo
     dünyasına ait değildi. i18n'deki `icon` alanı yedek olarak duruyor.
   · İstanbul döşemesi de Codex: 1536×1024 üretildi, 4px'lik gerçek
     piksel ızgarasına (384×256, 256 renk, 22 KB) indirildi ve
     `.pixelated` ile BÜYÜTÜLEREK basılıyor — her boyutta keskin piksel.
     Döşemenin en küçük hâli bile görselden büyük (min-h ≥ 256px), yani
     asla küçültülmüyor (küçültmede pixelated piksel atlar, bkz. LORE).
   · "Footer'daki Made in Istanbul"un görsel karşılığı: stüdyonun yeri
     ve 2023'ten beri — ikisi de gerçek (journey.js: studioFounded 2023).
------------------------------------------------------------------- */

const EASE = [0.16, 1, 0.3, 1];

const VALUE_ICONS = {
  speed: '/about/speed.webp',
  player: '/about/player.webp',
  rnd: '/about/rnd.webp',
  global: '/about/global.webp',
};

const grid = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const tileIn = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

/* Bento döşemesi: dış kutu yerinde durur (isabet alanı), cam yüzey
   içeride. Spotlight + kenar halkası oyun kartlarıyla aynı ışık dili. */
function Tile({ className = '', surface = '', spot = 'rgba(129, 140, 248, 0.30)', children }) {
  return (
    <motion.div variants={tileIn} className={`group relative ${className}`}>
      <div
        className={`card-glass relative h-full overflow-hidden rounded-card border border-white/10 transition-colors duration-500 ease-soft group-hover:border-white/20 ${surface}`}
      >
        <Spotlight size={380} color={spot} />
        {children}
      </div>
    </motion.div>
  );
}

// Birkaç yıldız — görseldeki yıldızların üstüne değil, gökyüzü bandına
// serpiştirilmiş; 2px kare (pixel art'ta yuvarlak parçacık sırıtır).
const STARS = [
  { l: '8%', t: '9%', d: 3.4, w: 0 },
  { l: '23%', t: '18%', d: 4.6, w: 1.2 },
  { l: '41%', t: '7%', d: 3.9, w: 2.1 },
  { l: '57%', t: '15%', d: 5.2, w: 0.6 },
  { l: '72%', t: '6%', d: 4.1, w: 2.8 },
  { l: '91%', t: '20%', d: 3.6, w: 1.7 },
];

function useIstanbulClock(lang) {
  const format = () =>
    new Intl.DateTimeFormat(lang === 'tr' ? 'tr-TR' : 'en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Istanbul',
    }).format(new Date());
  const [time, setTime] = useState(format);
  useEffect(() => {
    const id = setInterval(() => setTime(format()), 20000);
    return () => clearInterval(id);
    // format dil değişince yeni locale ile kurulur
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);
  return time;
}

function CityTile({ className }) {
  const { t, lang } = useLang();
  const time = useIstanbulClock(lang);
  const ref = useRef(null);
  const [idle, setIdle] = useState(false);

  // Yıldız/su döngüleri sadece döşeme görünürken (Games'teki
  // useSceneIdle ile aynı kural, `.gc-idle` index.css'te).
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([e]) => setIdle(!e.isIntersecting), { rootMargin: '200px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tile
      className={className}
      surface={`min-h-[300px] sm:min-h-[340px] ${idle ? 'gc-idle' : ''}`}
      spot="rgba(251, 191, 36, 0.22)"
    >
      <div ref={ref} className="absolute inset-0">
        <img
          src="/about/istanbul.png"
          alt={t.about.cityAlt}
          width={384}
          height={256}
          loading="lazy"
          decoding="async"
          className="pixelated absolute inset-0 h-full w-full object-cover object-[50%_55%] transition-transform duration-[1400ms] ease-out-expo group-hover:scale-[1.04]"
        />

        {STARS.map((s, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="absolute h-[2px] w-[2px] bg-indigo-100 shadow-[0_0_6px_rgba(199,210,254,0.9)]"
            style={{ left: s.l, top: s.t, animation: `adk-twinkle ${s.d}s ease-in-out ${s.w}s infinite` }}
          />
        ))}

        {/* Su yüzeyi: yatay piksel şeritleri çok yavaş kayıyor. */}
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[26%] overflow-hidden opacity-50">
          <div
            className="absolute inset-y-0 -left-[12%] w-[124%]"
            style={{
              background:
                'repeating-linear-gradient(to bottom, transparent 0 7px, rgba(165,180,252,0.10) 7px 9px), repeating-linear-gradient(to right, transparent 0 46px, rgba(251,191,36,0.07) 46px 58px, transparent 58px 120px)',
              animation: 'adk-water 10s ease-in-out infinite alternate',
            }}
          />
        </div>

        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#05070F]/90 via-[#05070F]/40 to-transparent" />
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-wrap items-end justify-between gap-3 p-5 sm:p-6">
        <div className="lg flex items-center gap-3 rounded-control px-4 py-2.5">
          <MapPin aria-hidden="true" strokeWidth={2} className="h-4 w-4 text-amber-300" />
          <div className="leading-tight">
            <p className="text-sm font-black tracking-tight text-white">{t.about.place}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{t.about.since}</p>
          </div>
        </div>
        <div className="lg rounded-control px-4 py-2.5 text-right leading-tight">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{t.about.localTime}</p>
          <p className="text-sm font-black tabular-nums tracking-tight text-white">
            <time>{time}</time> <span className="text-[10px] font-bold text-gray-400">GMT+3</span>
          </p>
        </div>
      </div>
    </Tile>
  );
}

export default function About() {
  const { t } = useLang();
  return (
    <section id="about" className="py-32 px-6 overflow-hidden">
      <div className="max-w-[1280px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center lg:text-left"
        >
          <p className="text-[11px] font-black tracking-label-x text-indigo-400 uppercase mb-3">
            {t.about.eyebrow}
          </p>
          <SplitWords
            as="h2"
            className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase"
            text={t.about.title}
          />
        </motion.div>

        <motion.div
          variants={grid}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="mb-24 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5"
        >
          {/* Manifesto */}
          <Tile className="col-span-2" surface="flex flex-col justify-between p-7 sm:p-10">
            <div className="relative z-10">
              <blockquote>
                <p className="text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl xl:text-[2.15rem]">
                  {t.about.quotePre}
                  <span className="bg-gradient-to-r from-indigo-300 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    {t.about.quoteHighlight}
                  </span>
                  {t.about.quotePost}
                </p>
              </blockquote>
              <p className="mt-6 text-base font-light leading-relaxed text-gray-400">{t.about.p1}</p>
              <p className="mt-4 text-sm font-light leading-relaxed text-gray-400">{t.about.p2}</p>
            </div>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.3, ease: EASE }}
              className="relative z-10 mt-10 h-px w-full origin-left bg-gradient-to-r from-indigo-500/60 via-purple-500/30 to-transparent"
            />
          </Tile>

          <CityTile className="col-span-2" />

          {/* Değerler — cam ikonlar hover'da hafifçe yükselip parlıyor;
              hareket eden kart değil, ikon (çocuk). */}
          {t.about.values.map((v) => (
            <Tile key={v.key} surface="flex flex-col p-5 sm:p-6">
              <div className="relative z-10 flex h-full flex-col">
                <div className="relative mb-4 h-14 w-14 sm:mb-5 sm:h-16 sm:w-16">
                  <span
                    aria-hidden="true"
                    className="absolute -inset-3 rounded-full opacity-50 transition-opacity duration-700 group-hover:opacity-100"
                    style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.45), transparent 68%)' }}
                  />
                  {VALUE_ICONS[v.key] ? (
                    <img
                      src={VALUE_ICONS[v.key]}
                      alt=""
                      width={64}
                      height={64}
                      loading="lazy"
                      decoding="async"
                      className="relative h-14 w-14 object-contain sm:h-16 sm:w-16 transition-transform duration-700 ease-out-expo group-hover:-translate-y-1 group-hover:scale-105"
                    />
                  ) : (
                    <span className="relative text-3xl">{v.icon}</span>
                  )}
                </div>
                <h3 className="mb-2 text-sm font-black tracking-tight text-white">{v.title}</h3>
                <p className="text-xs font-light leading-relaxed text-gray-400">{v.desc}</p>
              </div>
            </Tile>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8 }}
        >
          <Journey />
        </motion.div>
      </div>
    </section>
  );
}
