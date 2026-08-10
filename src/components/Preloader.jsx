import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLenis } from 'lenis/react';

/**
 * Ardeko Studios — açılış sekansı.
 *
 * Sayaç uydurma değil: gerçek görsel yükleme oranını + window.load'ı takip
 * eder, sadece minimum bir süre tabanı uygular ki tek karede yanıp sönmesin.
 *
 * Çıkış: tek perde yerine dikey panjur panelleri — bir oyun stüdyosuna
 * jenerik fade'den daha çok yakışıyor, arkadaki hero kademeli açılıyor.
 *
 * Oturum başına bir kez çalışır (sessionStorage), reduced-motion'da hiç
 * görünmez. <SmoothScroll> İÇİNDE render edilmeli — scroll'u kilitlemek
 * için Lenis instance'ını kullanıyor.
 */

const PANELS = 6;
const MIN_DURATION = 1600; // ms — sayacın en hızlı bitebileceği süre

function useLoadProgress() {
  const [value, setValue] = useState(0);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    const start = performance.now();
    let raf;
    let ready = document.readyState === 'complete';
    let current = 0;

    const onLoad = () => { ready = true; };
    if (!ready) window.addEventListener('load', onLoad);

    const tick = () => {
      const timeFloor = Math.min(1, (performance.now() - start) / MIN_DURATION);
      const imgs = Array.from(document.images);
      const assetRatio = imgs.length
        ? imgs.filter((img) => img.complete).length / imgs.length
        : 1;

      // Hem zaman hem varlık koşulu dolmadan 93'ün üstüne çıkma
      const target = ready && assetRatio === 1
        ? timeFloor * 100
        : Math.min(timeFloor, assetRatio, 0.93) * 100;

      current += (target - current) * 0.12;

      if (current > 99.4) {
        setValue(100);
        setComplete(true);
        return;
      }
      setValue(current);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('load', onLoad);
    };
  }, []);

  return { value, complete };
}

export default function Preloader({ onDone }) {
  const lenis = useLenis();

  const [skip] = useState(() =>
    typeof window === 'undefined' ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    sessionStorage.getItem('adk-intro') === 'done'
  );

  const [visible, setVisible] = useState(!skip);
  const { value, complete } = useLoadProgress();

  // Intro boyunca scroll kilitli
  useEffect(() => {
    if (skip || !visible) return undefined;
    lenis?.stop();
    document.body.style.overflow = 'hidden';
    return () => {
      lenis?.start();
      document.body.style.overflow = '';
    };
  }, [skip, visible, lenis]);

  useEffect(() => {
    if (skip || !complete) return undefined;
    const t = setTimeout(() => {
      sessionStorage.setItem('adk-intro', 'done');
      setVisible(false);
      onDone?.();
    }, 320);
    return () => clearTimeout(t);
  }, [complete, skip, onDone]);

  if (skip) return null;

  const shown = Math.round(value);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[999]"
          initial={false}
          exit={{ opacity: 1 }}
          transition={{ duration: 1.3 }}
          aria-hidden="true"
        >
          {/* Panjur panelleri — çıkışta sırayla yukarı kayar */}
          <div className="absolute inset-0 flex">
            {Array.from({ length: PANELS }).map((_, i) => (
              <motion.div
                key={i}
                className="h-full flex-1 bg-[#05070F]"
                initial={{ y: '0%' }}
                exit={{ y: '-100%' }}
                transition={{ duration: 0.9, delay: i * 0.06, ease: [0.76, 0, 0.24, 1] }}
              />
            ))}
          </div>

          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center gap-6"
            exit={{ opacity: 0, y: -24, transition: { duration: 0.4, ease: 'easeIn' } }}
          >
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-400/70">
              Ardeko Studios
            </span>

            <div
              className="font-black leading-none tracking-tighter text-white tabular-nums"
              style={{ fontSize: 'clamp(4rem, 16vw, 11rem)' }}
            >
              {String(shown).padStart(3, '0')}
            </div>

            <div className="h-[2px] w-[min(62vw,420px)] overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full origin-left bg-gradient-to-r from-indigo-500 to-purple-600"
                style={{ scaleX: value / 100 }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
