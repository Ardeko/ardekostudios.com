import { useSyncExternalStore } from 'react';

/* ------------------------------------------------------------------
   Açılış koordinasyonu — Preloader ↔ Hero.

   Eskiden Hero'nun giriş animasyonları (başlık, CTA'lar, istatistikler)
   mount anında başlıyordu; ilk ziyarette o an ekranın üstünde Preloader
   perdesi duruyor. Yani sitenin tek "orkestre" anı perdenin ARKASINDA,
   kimse bakmazken oynuyordu ve perde kalktığında her şey çoktan
   yerindeydi.

   Artık Hero `useIntroOpened()` ile bekliyor; Preloader panjurları
   kaldırmaya başladığı anda `markIntroOpened()` çağırıyor ve başlık
   panjurların arasından yükseliyor. Intro oynamıyorsa (aynı oturumda
   ikinci açılış, reduced-motion) Hero hiç beklemez.

   Karar modül seviyesinde BİR kez veriliyor ki Preloader ile Hero aynı
   cevabı görsün; sessionStorage intro bittikten sonra 'done' olduğu için
   sonradan yeniden hesaplamak yanlış cevap verirdi.
------------------------------------------------------------------- */

const STORAGE_KEY = 'adk-intro';

// Gizli sekmede / uygulama içi tarayıcıda (Instagram vb.) sessionStorage
// erişimi istisna fırlatabilir — korumasız erişim render'da patlar.
export function readIntroDone() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === 'done';
  } catch {
    return false;
  }
}

export function markIntroDone() {
  try {
    sessionStorage.setItem(STORAGE_KEY, 'done');
  } catch {
    // sessizce yut — intro bu oturumda bir daha görünmese de sorun değil
  }
}

// Preloader'ın kendi sert tavanı 4.7 sn (MAX_DURATION + 1500). Bu ondan
// sonra çalışan son güvenlik ağı: Preloader herhangi bir sebeple sinyali
// hiç göndermezse Hero sonsuza kadar görünmez kalmasın.
const FAILSAFE_MS = 6000;

let opened = false;
const listeners = new Set();

let plays = null;
export function introPlays() {
  if (plays === null) {
    plays =
      typeof window !== 'undefined' &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
      !readIntroDone();
    if (plays) setTimeout(markIntroOpened, FAILSAFE_MS);
  }
  return plays;
}

export function markIntroOpened() {
  if (opened) return;
  opened = true;
  [...listeners].forEach((fn) => fn());
}

// useSyncExternalStore: effect içinde setState yok (react-hooks lint'i),
// abone olmadan önce perde kalkmışsa da ilk okumada doğru değer gelir.
function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
const getSnapshot = () => opened || !introPlays();
const getServerSnapshot = () => true;

/** Perde kalktı mı (ya da hiç yok mu)? Hero girişini buna bağla. */
export function useIntroOpened() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
