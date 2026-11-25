import { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import GooeyTabs from './GooeyTabs';
import MetrorayMini from './MetrorayMini';
import RevoMini from './RevoMini';
import { useLang } from '../lib/i18n';

/* ------------------------------------------------------------------
   Viewport — "neler yapıyoruz"un canlı örneği (2026-11-25'te yeniden).

   Eskiden iki soyut canvas çizimi vardı: imleçle deforme olan bir
   wireframe mesh (OYUN) ve kendini kuran bir arayüz iskeleti
   (UYGULAMA). Kullanıcı daha iyi örnekler istedi — ve "anlatmak yerine
   gösteriyor" ilkesinin doğru cevabı stüdyonun KENDİ işleri:

     · OYUN      → Metroray Mini (MetrorayMini.jsx): geliştirilmekte olan
                   yük treni oyunu Metroray'ın oynanabilir çekirdek
                   mekaniği. Tek tuş, ~25 sn'lik sefer.
     · UYGULAMA  → REVO Mini (RevoMini.jsx): yayındaki sesli sohbet
                   uygulaması REVO'nun etkileşimli küçük odası.

   Kabuk aynı: sıvı cam monitör, GooeyTabs, ilk görünüşte CRT açılışı,
   altta HUD şeridi. Bu bileşen Hero'da `lazy` yükleniyor (ilk bundle'a
   girmiyor), hero'nun altında kendi sahnesinde duruyor.
------------------------------------------------------------------- */

const COLORS = { game: '#FF8A3D', app: '#3ECFC0' };

export default function Viewport() {
  const { t } = useLang();
  const reduce = useReducedMotion();
  const V = t.viewport;
  const TABS = [
    { key: 'game', label: V.tabs.game, color: COLORS.game },
    { key: 'app', label: V.tabs.app, color: COLORS.app },
  ];
  const [mode, setMode] = useState('game');
  const [fps, setFps] = useState(null);
  const stageRef = useRef(null);

  return (
    // Sıvı cam monitör çerçevesi (`.lg`). backdrop-blur YOK — arkasında
    // bulanıklaştıracak bir şey yok ve GooeyTabs notundaki izole karışım
    // grubu sorununun kaynağı oydu.
    <div className="lg overflow-hidden rounded-card">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-indigo-300/70 to-transparent"
      />
      {/* sekme çubuğu — kayan pill + sekme değişiminde parçacık patlaması,
          bkz. GooeyTabs.jsx. Aktif sekme burada (`mode`) tutuluyor. */}
      <GooeyTabs
        className="border-b border-white/8"
        tabs={TABS}
        value={mode}
        onChange={setMode}
        trailing={
          <span className="ml-auto hidden items-center px-4 text-[10px] font-bold tracking-widest text-gray-400 uppercase sm:flex">
            {V.hint}
          </span>
        }
      />

      {/* CRT açılışı — ekran görünür alana ilk girdiğinde tüplü monitör
          gibi açılır: ortada yatay bir ışık çizgisi uzar, sonra görüntü
          dikeyde açılır. Sadece clip-path + opacity, bir kez.
          ⚠️ Tetikleyici (whileInView) KIRPILMAYAN dış kapta; kırpılan iç
          kap variant ile sürülüyor. Tamamen kırpılmış bir eleman
          IntersectionObserver'a sıfır alanlı görünür ve hiç "görünür"
          sayılmaz — CLAUDE.md'deki SplitWords tuzağının (#7) aynısı.
          İçerikler de döngülerini bu dış kabı (`stageRef`) izleyerek
          durdurup başlatıyor: Chrome atanın clip-path'ini kesişime
          katıyor, kendi elemanlarını izleseler açılıştan önce hiç
          başlamazlardı. */}
      <motion.div
        ref={stageRef}
        className="relative"
        initial={reduce ? false : 'off'}
        whileInView={reduce ? undefined : 'on'}
        viewport={{ once: true, amount: 0.35 }}
      >
        <motion.div
          className="relative h-[260px] sm:h-[320px] lg:h-[360px]"
          variants={
            reduce
              ? undefined
              : {
                  off: { clipPath: 'inset(49.4% 50% 49.4% 50%)' },
                  on: {
                    clipPath: ['inset(49.4% 50% 49.4% 50%)', 'inset(49.4% 0% 49.4% 0%)', 'inset(0% 0% 0% 0%)'],
                    transition: { duration: 1.1, times: [0, 0.42, 1], ease: [0.65, 0, 0.25, 1] },
                    transitionEnd: { clipPath: 'none' },
                  },
                }
          }
        >
          {mode === 'game' ? (
            <MetrorayMini labels={V.game} observeRef={stageRef} onFps={setFps} />
          ) : (
            <RevoMini labels={V.app} observeRef={stageRef} />
          )}
          {/* Tarama çizgileri — sabit, animasyonsuz; ekranın "cam"
              olduğunu söyleyen tek ipucu. Tıklamayı yutmaz. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              background: 'repeating-linear-gradient(to bottom, transparent 0 2px, rgba(5,7,15,0.35) 2px 3px)',
            }}
          />
        </motion.div>
        {!reduce && (
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-1/2 h-[2px] -mt-px origin-center bg-indigo-100"
            style={{ boxShadow: '0 0 22px 6px rgba(165,180,252,0.85)' }}
            variants={{
              off: { opacity: 0, scaleX: 0 },
              on: {
                opacity: [0, 1, 1, 0],
                scaleX: [0, 1, 1, 1],
                transition: { duration: 1.1, times: [0, 0.42, 0.55, 0.95], ease: [0.65, 0, 0.25, 1] },
              },
            }}
          />
        )}
      </motion.div>

      {/* HUD — ne gördüğünü söyleyen künye + motor okuması. */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-white/8 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
        <span className="inline-flex items-center gap-2 text-gray-300">
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: COLORS[mode], boxShadow: `0 0 8px ${COLORS[mode]}` }}
          />
          {mode === 'game' ? V.game.caption : V.app.caption}
        </span>
        <span className="hidden normal-case tracking-normal text-gray-400 md:inline">
          {mode === 'game' ? V.game.note : V.app.note}
        </span>
        {mode === 'game' && fps !== null && (
          <span className="ml-auto tabular-nums">
            fps <span className="text-gray-300">{String(fps).padStart(2, '0')}</span>
          </span>
        )}
      </div>
    </div>
  );
}
