import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import Aurora from './Aurora';
import Viewport from './Viewport';
import { useLang } from '../lib/i18n';

const WORDS = [
  'BOLD GAMES',
  'WEB EXPERIENCES',
  'CYBER PLAY',
  'VISUAL IDENTITIES',
  'IMMERSIVE WORLDS',
  'CREATIVE CODE',
  'MOBILE ADVENTURES',
  'UNIQUE UI/UX',
  'PIXEL ART',
  'NEXT-GEN EXPERIENCES',
  'INTERACTIVE ART',
  'FUTURE TECH',
  'DIGITAL INNOVATION',
  'SMART SOLUTIONS',
  ''
];
function TypewriterWords() {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const word = WORDS[index];
    if (!deleting && displayed.length < word.length) {
      timeoutRef.current = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 80);
    } else if (!deleting && displayed.length === word.length) {
      timeoutRef.current = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && displayed.length > 0) {
      timeoutRef.current = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 45);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setIndex((i) => (i + 1) % WORDS.length);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [displayed, deleting, index]);

  return (
    <span className="text-indigo-400">
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        className="inline-block w-[3px] h-[0.85em] bg-indigo-400 ml-1 align-middle"
      />
    </span>
  );
}

/* Eskiden MagneticLink'ti: imleç üzerindeyken buton fareye doğru
   kayıyordu. Mıknatıs efekti siteden tamamen kaldırıldı — tıklama hedefi
   tam tıklanacağı anda yer değiştiriyordu, dokunmatikte zaten hiç
   çalışmıyordu ve her hover'da bir layout-dışı transform + glow yazımı
   demekti. Vurgu artık sadece renkte ve glow'da: aynı görünüm, kaçmayan
   hedef. */
function CtaLink({ href, children, primary }) {
  if (primary) {
    return (
      <a
        href={href}
        data-cursor="soft"
        className="relative inline-flex items-center justify-center px-8 py-4 text-xs font-black tracking-widest text-white uppercase bg-indigo-600 rounded-control overflow-hidden group shadow-[0_0_40px_rgba(99,102,241,0.3)] hover:shadow-[0_0_70px_rgba(99,102,241,0.6)] transition-shadow duration-300"
      >
        <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <span className="relative z-10">{children}</span>
      </a>
    );
  }

  return (
    <a
      href={href}
      data-cursor="ring"
      className="inline-flex items-center justify-center px-8 py-4 text-xs font-black tracking-widest text-gray-300 uppercase border border-white/10 rounded-control hover:border-white/30 hover:text-white transition-colors"
    >
      {children}
    </a>
  );
}

export default function Hero() {
  const { t } = useLang();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="adk-vh-screen relative flex flex-col justify-center items-center text-center px-4 pt-28 pb-20 lg:pt-0 lg:pb-0 overflow-hidden"
    >
      {/* Zemin katmanı — DOM'da ilk, yani konumlanmış kardeşlerinin
          hepsinin altında boyanıyor. Opak çiziyor (kenarları zaten
          #05070F'e eriyor), o yüzden içeriğin `relative z-10` olması
          şart; bkz. CLAUDE.md, Spotlight ile aynı kural.

          Aurora geldikten sonra hero'da yedi dekoratif katman üst üste
          binmişti: Aurora + 20 parçacık + iki radial glow + global grid +
          film grain + imleç glow'u. İkisi çıkarıldı:
            · <Particles /> — 20 DOM düğümü, her biri sonsuz döngüde.
              Yaptığı iş (arka planda hafif bir kıpırtı) artık Aurora'nın
              sürüklenen noise alanının içinde zaten var.
            · mor radial glow — 0.07–0.14 opaklıkta, Aurora'nın mor
              bileşeniyle aynı yerde aynı şeyi söylüyordu.
          Kalan indigo glow bilerek duruyor: Aurora sürükleniyor, o ise
          nefes alıyor; ikisi farklı ritimler ve başlığın arkasını
          sabitleyen şey bu. */}
      <Aurora />

      {/* Glow'lar gradient, blur DEĞİL — bilerek.
          Önceden `bg-indigo-600 blur-[180px]` idi: 180px yarıçap devasa bir
          gaussian çekirdeği demek ve `scale` animasyonu blur'lu katmanı her
          karede yeniden rasterize ettiriyor. iOS Safari bunu CPU'da yapıyor,
          hero ilk boyanana kadar ana thread'i kilitliyordu. Radial-gradient
          aynı yumuşak ışıltıyı filtre olmadan verir; scale/opacity animasyonu
          da saf compositor işine döner. Parlaklığı `opacity` dizisinden ayarla. */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.14, 0.26, 0.14],
          x: ['-50%', '-47%', '-53%', '-50%'],
          y: ['-50%', '-53%', '-47%', '-50%'],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/2 w-[500px] h-[500px] md:w-[800px] md:h-[800px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, #4f46e5 0%, transparent 70%)' }}
      />

      <motion.div style={{ y, opacity }} className="relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/5"
        >
          <motion.div
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-indigo-400"
          />
          {/* lang="en": rozet iki dilde de İngilizce bir marka ifadesi. Belge dili
              `tr` olduğunda CSS `uppercase` Türkçe kuralını uygulayıp "INTERACTIVE"i
              "İNTERACTİVE" yapıyordu. Daralan tracking 320px'de tek satırda tutuyor. */}
          <span
            lang="en"
            className="text-[10px] font-black tracking-label-wide sm:tracking-label-x text-indigo-400 uppercase"
          >
            {t.hero.badge}
          </span>
        </motion.div>

        <motion.h1
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-4 uppercase leading-[0.9]"
        >
          <span className="bg-gradient-to-b from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
            {t.hero.lead}
          </span>
          <br />
          <TypewriterWords />
        </motion.h1>

        <motion.p
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-gray-400 max-w-sm sm:max-w-xl text-base md:text-lg font-light mb-12 leading-relaxed px-2"
        >
          {t.hero.desc}
        </motion.p>

        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 mb-14"
        >
          <CtaLink href="#games" primary>{t.hero.primary}</CtaLink>
          <CtaLink href="#about">{t.hero.secondary}</CtaLink>
        </motion.div>

        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.85 }}
          className="w-full max-w-md sm:max-w-xl mb-14"
        >
          <Viewport />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="flex items-center gap-8 sm:gap-12"
        >
          {t.hero.stats.map((stat, i) => (
            <div key={i} className={`text-center ${i !== t.hero.stats.length - 1 ? 'pr-8 sm:pr-12 border-r border-white/10' : ''}`}>
              <div className="text-xl sm:text-2xl font-black text-white tracking-tight">{stat.value}</div>
              <div className="text-[9px] font-bold tracking-widest text-gray-500 uppercase mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[9px] tracking-widest text-gray-400 uppercase font-bold">{t.hero.scroll}</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-[1px] h-8 bg-gradient-to-b from-indigo-500/50 to-transparent"
        />
      </motion.div>
    </section>
  );
}
