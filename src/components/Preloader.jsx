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
// ms — sayacın EN GEÇ bitebileceği süre. Intro `window.load` + tüm
// görsellerin inmesini bekliyordu; mobil bağlantıda bu 10+ saniyelik siyah
// ekran demek ("site açılmıyor"). Bu tavan, ağ ne olursa olsun siteyi açar.
const MAX_DURATION = 3200;
// Son güvenlik ağı. requestAnimationFrame durursa (iOS Safari düşük güç modunda,
// arka plana atılan sekmede ya da bellek baskısı altında rAF'ı boğuyor) yukarıdaki
// mantığın tamamı ölür ve perde ekranda kalır. setTimeout bu koşullarda da tetiklenir.
const HARD_STOP = MAX_DURATION + 1500;

// Gizli sekmede / uygulama içi tarayıcıda (Instagram, vb.) sessionStorage'a
// erişmek istisna fırlatabilir. Korumasız erişim render sırasında patlarsa
// React tüm ağacı söker ve geriye siyah ekran kalır — i18n.jsx'teki desenin aynısı.
function readIntroDone() {
  try {
    return sessionStorage.getItem('adk-intro') === 'done';
  } catch {
    return false;
  }
}

function markIntroDone() {
  try {
    sessionStorage.setItem('adk-intro', 'done');
  } catch {
    // sessizce yut — intro bu oturumda bir daha görünmese de sorun değil
  }
}

function useLoadProgress() {
  const [value, setValue] = useState(0);
  const [complete, setComplete] = useState(false);

  // rAF'tan bağımsız kesin çıkış.
  useEffect(() => {
    const t = setTimeout(() => setComplete(true), HARD_STOP);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const start = performance.now();
    let raf;
    let ready = document.readyState === 'complete';
    let current = 0;

    const onLoad = () => { ready = true; };
    if (!ready) window.addEventListener('load', onLoad);

    // lazy görseller sayılmaz: ekranın çok altındalar, hiç yüklenmeyebilirler
    // ve sayılırlarsa oran asla 1'e ulaşmadığı için intro hep tavana dayanır.
    //
    // Bu liste rAF'ın DIŞINDA, bir kez alınıyor. Eskiden her karede
    // Array.from(document.images) + iki filter çalışıyordu; tam da ana thread'in
    // zaten tıkalı olduğu anda saniyede 60 kez tüm DOM'u tarıyorduk.
    let imgs = Array.from(document.images).filter((img) => img.loading !== 'lazy');
    let imgsCounted = imgs.length;
    // Ağaç henüz mount olmadıysa liste boş çıkabilir; ilk birkaç karede bir
    // kez daha bak, sonra sabitle.
    let recheck = 5;

    const tick = () => {
      const elapsed = performance.now() - start;
      const timeFloor = Math.min(1, elapsed / MIN_DURATION);
      const timedOut = elapsed >= MAX_DURATION;

      if (recheck > 0) {
        recheck -= 1;
        imgs = Array.from(document.images).filter((img) => img.loading !== 'lazy');
        imgsCounted = imgs.length;
      }

      const assetRatio = imgsCounted
        ? imgs.filter((img) => img.complete).length / imgsCounted
        : 1;

      // Görseller inerken assetRatio 0'dır; ham haliyle hedef de 0 olur ve sayaç
      // mobil bağlantıda saniyelerce "000"da çakılı kalır (masaüstünde görseller
      // milisaniyede indiği için bu hiç fark edilmiyordu). Varlık oranı sayacı
      // zaman tabanının altına çekemesin — bar her koşulda ilerlemeye devam etsin.
      const assetFloor = Math.max(assetRatio, timeFloor * 0.6);

      // Hem zaman hem varlık koşulu dolmadan 93'ün üstüne çıkma —
      // ama tavana vurulduysa varlıkları beklemeyi bırak.
      const target = (ready && assetRatio === 1) || timedOut
        ? timeFloor * 100
        : Math.min(timeFloor, assetFloor, 0.93) * 100;

      current += (target - current) * 0.12;

      // Üstteki lerp asimptotik; tavandan sonra takılıp kalmasın diye sert kes.
      if (current > 99.4 || elapsed >= MAX_DURATION + 800) {
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
    readIntroDone()
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
      // Perdeyi kaldırmak HER ŞEYDEN önce gelir: storage yazımı istisna
      // fırlatırsa (gizli sekme) setVisible'a hiç sıra gelmiyordu ve
      // perde ekranda kalıyordu.
      setVisible(false);
      onDone?.();
      markIntroDone();
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
            <span lang="en" className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-400/70">
              Ardeko Studios
            </span>

            <div
              className="font-black leading-none tracking-tighter text-white tabular-nums"
              style={{ fontSize: 'clamp(4rem, 16vw, 11rem)' }}
            >
              %{shown}
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
