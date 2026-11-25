import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import Aurora from './Aurora';
import NumberTicker from './NumberTicker';

// Viewport (Metroray Mini + REVO Mini + GooeyTabs) hero'nun ALTINDA —
// ilk boyamaya gerekmiyor. Ayrı chunk: ilk bundle küçülür, Preloader
// daha erken boyanır. Perde kalkınca boşta önceden indiriliyor.
const loadViewport = () => import('./Viewport');
const Viewport = lazy(loadViewport);

/* Chunk inene kadar aynı ölçülerde bir kabuk — yükseklik zıplarsa Lenis'in
   scroll konumu kayar (App.jsx'teki Games fallback notuyla aynı). */
function ViewportShell() {
  return (
    <div className="lg overflow-hidden rounded-card" aria-hidden="true">
      <div className="h-10 border-b border-white/8" />
      <div className="h-[260px] sm:h-[320px] lg:h-[360px]" />
      <div className="h-9 border-t border-white/8" />
    </div>
  );
}
import { useLang } from '../lib/i18n';
import { useIntroOpened } from '../lib/intro';

const EASE = [0.16, 1, 0.3, 1];

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
];

// Bir kelimenin ekranda kalma süresi (giriş animasyonu dahil).
const HOLD_MS = 2700;

/* ------------------------------------------------------------------
   KineticWord — eski TypewriterWords'ün yerine (2026-11-25).

   Daktilo iki şeyi bozuyordu:
   1. Satırın genişliği harf harf değiştiği için başlık her karede yeniden
      diziliyordu; uzun kelimeler ("NEXT-GEN EXPERIENCES") ikinci satıra
      kırılıp hero'nun yüksekliğini zıplatıyordu. Mobilde ekran görüntüsü
      çoğu an "BO" gibi yarım bir kelime yakalıyordu.
   2. Effect içinde senkron setState (eslint'in şikâyet ettiği tek gerçek
      hata buydu).

   Şimdi: satır SABİT yükseklikte bir yuva, kelimeler mutlak konumlu ve
   üst üste. Her kelime kendi doğal genişliğinde ölçülüp yuvaya sığacak
   kadar `scale` ile küçültülüyor (layout'a dokunmayan transform) —
   uzun kelime küçülür, kırılmaz; satır hiç zıplamaz. Harfler giderken
   yukarı uçup bulanıklaşıyor, gelirken aşağıdan netleşerek oturuyor.
   Döngü yalnızca hero ekrandayken ve sekme öndeyken dönüyor.

   Blur sadece hassas işaretçide (masaüstü): iOS'ta harf başına filter
   animasyonu ucuz değil (bkz. CLAUDE.md "Görsel bütçesi").
------------------------------------------------------------------- */
function KineticWord({ active }) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const boxRef = useRef(null);
  const [fine] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches,
  );

  const word = WORDS[index];

  useEffect(() => {
    if (!active || reduce) return undefined;
    const box = boxRef.current;
    let onScreen = true;
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
    });
    io.observe(box);
    let timer;
    const tick = () => {
      if (onScreen && document.visibilityState === 'visible') {
        setIndex((i) => (i + 1) % WORDS.length);
      }
      timer = setTimeout(tick, HOLD_MS);
    };
    timer = setTimeout(tick, HOLD_MS + 700);
    return () => {
      clearTimeout(timer);
      io.disconnect();
    };
  }, [active, reduce]);

  // Kelimeyi yuvaya sığdır. Transform ölçülen genişliği etkilemez, yani
  // scrollWidth her zaman kelimenin doğal genişliği.
  const fit = useCallback((el) => {
    const box = boxRef.current;
    if (!el || !box) return;
    // %94: kelime kabın tam kenarına değmesin (sidebar'a yapışık durmasın).
    const s = Math.min(1, (box.clientWidth * 0.94) / Math.max(1, el.scrollWidth));
    el.style.setProperty('--fit', s.toFixed(3));
  }, []);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return undefined;
    const ro = new ResizeObserver(() => {
      box.querySelectorAll('[data-fit]').forEach(fit);
    });
    ro.observe(box);
    return () => ro.disconnect();
  }, [fit]);

  const letter = useMemo(() => {
    const blurIn = fine ? 'blur(12px)' : 'blur(0px)';
    const blurOut = fine ? 'blur(10px)' : 'blur(0px)';
    return {
      enter: { y: '0.5em', opacity: 0, filter: blurIn },
      center: (i) => ({
        y: '0em',
        opacity: 1,
        filter: 'blur(0px)',
        transition: { duration: 0.75, delay: 0.05 + i * 0.032, ease: EASE },
        transitionEnd: { filter: 'none' },
      }),
      exit: (i) => ({
        y: '-0.42em',
        opacity: 0,
        filter: blurOut,
        transition: { duration: 0.34, delay: i * 0.014, ease: [0.7, 0, 0.84, 0] },
      }),
    };
  }, [fine]);

  return (
    <span ref={boxRef} className="relative block h-[1em] w-full" aria-hidden="true">
      <AnimatePresence>
        {(active || reduce) && (
          <motion.span
            key={word}
            className="absolute inset-0 flex items-center justify-center"
            initial={reduce ? false : 'enter'}
            animate="center"
            exit="exit"
          >
            <span
              data-fit
              ref={fit}
              className="inline-flex items-center whitespace-nowrap will-change-transform"
              style={{ transform: 'scale(var(--fit, 1))' }}
            >
              {[...word].map((ch, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={reduce ? undefined : letter}
                  className="inline-block text-indigo-400 [text-shadow:0_0_42px_rgba(99,102,241,0.35)]"
                >
                  {ch === ' ' ? ' ' : ch}
                </motion.span>
              ))}
              <span className="adk-caret ml-[0.08em] inline-block h-[0.74em] w-[0.075em] rounded-[1px] bg-indigo-400" />
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

/* Başlığın ilk satırı harf harf, kendi maskesinin içinden yükselir.
   Dikey gradyan her harfe ayrı ayrı verilse de sonuç tek parça gibi
   görünüyor (gradyan dikey, harflerin hepsi aynı yükseklikte) — yani
   bölmek görüntüyü değiştirmiyor. */
function RiseChars({ text, active, delay = 0 }) {
  const reduce = useReducedMotion();
  return (
    <span className="block overflow-hidden pb-[0.04em]" aria-hidden="true">
      {[...text].map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block bg-gradient-to-b from-white via-gray-100 to-gray-400 bg-clip-text text-transparent"
          initial={reduce ? false : { y: '108%' }}
          animate={active || reduce ? { y: '0%' } : { y: '108%' }}
          transition={{ duration: 1.1, delay: delay + i * 0.045, ease: EASE }}
        >
          {ch === ' ' ? ' ' : ch}
        </motion.span>
      ))}
    </span>
  );
}

/* Eskiden MagneticLink'ti — mıknatıs efekti siteden kaldırıldı (bkz.
   CLAUDE.md). Birincil buton artık sıvı cam bir damla: üstten vuran ışık,
   içten parlayan alt kenar ve hover'da üzerinden geçen bir ışık süpürmesi.
   Hareket eden şey butonun kendisi değil, çocukları (süpürme ve ok) —
   tıklama hedefi imlecin altından kaçmaz. */
function CtaLink({ href, children, primary }) {
  if (primary) {
    return (
      <a
        href={href}
        data-cursor="soft"
        className="lg-primary shine group inline-flex items-center justify-center gap-3 overflow-hidden rounded-control px-8 py-4 text-xs font-black uppercase tracking-widest"
      >
        <span className="relative">{children}</span>
        <ArrowRight
          aria-hidden="true"
          strokeWidth={2.5}
          className="relative h-4 w-4 transition-transform duration-500 ease-out-expo group-hover:translate-x-1"
        />
      </a>
    );
  }

  return (
    <a
      href={href}
      data-cursor="ring"
      className="lg shine inline-flex items-center justify-center overflow-hidden rounded-control px-8 py-4 text-xs font-black uppercase tracking-widest text-gray-200 transition-colors duration-300 hover:text-white"
    >
      {children}
    </a>
  );
}

const block = {
  hidden: { opacity: 0, y: 26 },
  show: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 1, delay: d, ease: EASE } }),
};

export default function Hero() {
  const { t } = useLang();
  const opened = useIntroOpened();
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const state = opened || reduce ? 'show' : 'hidden';

  // Perde kalkar kalkmaz, ana thread boşa çıkınca Viewport chunk'ını indir.
  useEffect(() => {
    if (!opened) return undefined;
    const idle = window.requestIdleCallback;
    if (idle) {
      const id = idle(() => loadViewport(), { timeout: 2000 });
      return () => window.cancelIdleCallback?.(id);
    }
    const tm = setTimeout(loadViewport, 900);
    return () => clearTimeout(tm);
  }, [opened]);

  return (
    <>
      <section
        ref={ref}
        className="adk-vh-screen relative flex flex-col items-center justify-center overflow-hidden px-4 pb-24 pt-28 text-center lg:pb-20 lg:pt-20"
      >
        {/* Zemin katmanı — DOM'da ilk, opak çiziyor; içerik `relative
            z-10` olmak zorunda (bkz. CLAUDE.md, Aurora/Spotlight kuralı). */}
        <Aurora />

        {/* Glow'lar gradient, blur DEĞİL — bkz. eski not: 180px blur iOS'ta
            hero'yu kilitliyordu. Aurora sürükleniyor, bu nefes alıyor. */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.14, 0.26, 0.14],
            x: ['-50%', '-47%', '-53%', '-50%'],
            y: ['-50%', '-53%', '-47%', '-50%'],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] rounded-full md:h-[800px] md:w-[800px]"
          style={{ background: 'radial-gradient(circle, #4f46e5 0%, transparent 70%)' }}
        />

        {/* initial 'hidden': intro oynamasa da (aynı oturumda ikinci
            açılış) giriş bir kez oynar; intro oynuyorsa perde kalkana kadar
            'hidden'da bekler. Reduced-motion'da doğrudan son hâl. */}
        <motion.div
          style={{ y, opacity }}
          initial={reduce ? false : 'hidden'}
          animate={state}
          className="relative z-10 flex w-full max-w-6xl flex-col items-center"
        >
          {/* Rozet — sıvı cam hap. lang="en": belge dili tr iken CSS
              uppercase "INTERACTIVE"i "İNTERACTİVE" yapıyordu. */}
          <motion.div
            variants={block}
            custom={0}
            className="lg mb-7 flex items-center gap-2.5 rounded-full px-4 py-1.5"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="adk-ping absolute inset-0 rounded-full bg-indigo-400" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-indigo-400" />
            </span>
            <span
              lang="en"
              className="text-[10px] font-black uppercase tracking-label-wide text-indigo-300 sm:tracking-label-x"
            >
              {t.hero.badge}
            </span>
          </motion.div>

          {/* h1'in erişilebilir adı sabit: "WE CRAFT BOLD GAMES". Görsel
              olarak dönen kelime aria-hidden — ekran okuyucu her 2.7 sn'de
              başlığı baştan okumasın. */}
          <h1 className="mb-6 w-full text-[12.5vw] font-black uppercase leading-[0.9] tracking-tighter sm:text-7xl md:text-8xl lg:text-[7.5rem] xl:text-9xl">
            <span className="sr-only">
              {t.hero.lead} {WORDS[0]}
            </span>
            <RiseChars text={t.hero.lead} active={opened} delay={0.05} />
            <KineticWord active={opened} />
          </h1>

          <motion.p
            variants={block}
            custom={0.55}
            className="mb-10 max-w-sm px-2 text-base font-light leading-relaxed text-gray-400 sm:max-w-xl md:text-lg"
          >
            {t.hero.desc}
          </motion.p>

          <motion.div variants={block} custom={0.7} className="flex flex-col gap-4 sm:flex-row">
            <CtaLink href="#games" primary>
              {t.hero.primary}
            </CtaLink>
            <CtaLink href="#about">{t.hero.secondary}</CtaLink>
          </motion.div>

          {/* İstatistik şeridi — HUD gibi: tek cam panel, hücreler ince
              çizgiyle ayrık, sayılar perde kalkınca sayarak dolar. */}
          <motion.dl
            variants={block}
            custom={0.85}
            className="lg mt-12 grid grid-cols-3 divide-x divide-white/10 rounded-card"
          >
            {t.hero.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse px-4 py-3 sm:px-8 sm:py-4">
                <dt className="mt-1 text-[9px] font-bold uppercase tracking-widest text-gray-400">{stat.label}</dt>
                <dd className="text-xl font-black tracking-tight text-white sm:text-2xl">
                  <NumberTicker value={stat.value} start={opened} delay={1} />
                </dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        <motion.a
          href="#engine"
          aria-label={t.hero.scroll}
          initial={{ opacity: 0 }}
          animate={{ opacity: opened ? 1 : 0 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex"
        >
          <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">{t.hero.scroll}</span>
          <span className="relative block h-9 w-[1px] overflow-hidden bg-white/10">
            <motion.span
              animate={{ y: ['-100%', '100%'] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-400 to-transparent"
            />
          </span>
        </motion.a>
      </section>

      {/* Motor ekranı — eskiden hero'nun içinde, hero'nun scroll'a bağlı
          solmasıyla birlikte soluyordu: kullanıcı ona doğru kaydırdıkça
          kayboluyordu. Artık kendi sahnesinde; görünür alana ilk girişte
          CRT gibi "açılıyor" (bkz. Viewport.jsx). */}
      <div id="engine" className="relative z-10 px-4 pb-10 sm:pb-16">
        <div className="relative mx-auto w-full max-w-md sm:max-w-2xl lg:max-w-3xl">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-24 -bottom-24 h-56"
            style={{ background: 'radial-gradient(50% 55% at 50% 0%, rgba(99,102,241,0.22), transparent 72%)' }}
          />
          <Suspense fallback={<ViewportShell />}>
            <Viewport />
          </Suspense>
        </div>
      </div>
    </>
  );
}
