import { useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useVelocity,
  useTransform,
} from 'framer-motion';

/**
 * Ardeko Studios — imza etkileşim.
 *
 * Oyunlar dev tipografi satırları olarak listelenir; bir satırın üstüne
 * gelince o oyunun key art'ı imleci gecikmeli olarak takip eder ve fare
 * hızına göre hafifçe yatar. Kart görünürken diğer satırlar söner, sadece
 * seçili satır beyaza döner.
 *
 * Dokunmatik cihazda önizleme kartı yerine satır içi küçük görsel gösterilir.
 *
 * items: [{ id, title, meta, image, href }]
 */

const SPRING = { damping: 26, stiffness: 190, mass: 0.6 };

export default function HoverPreviewList({ items = [], className = '' }) {
  const [active, setActive] = useState(null);
  const containerRef = useRef(null);

  const [coarse] = useState(
    () => typeof window !== 'undefined' &&
      window.matchMedia('(pointer: coarse)').matches
  );

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, SPRING);
  const sy = useSpring(y, SPRING);

  // Yatay fare hızından hafif bir yatma açısı üret
  const xVelocity = useVelocity(sx);
  const rotate = useTransform(xVelocity, [-1400, 0, 1400], [-14, 0, 14], { clamp: true });
  const smoothRotate = useSpring(rotate, { damping: 22, stiffness: 130 });

  const handleMove = (e) => {
    if (coarse) return;
    x.set(e.clientX);
    y.set(e.clientY);
  };

  const activeItem = items.find((it) => it.id === active) ?? null;

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      onPointerMove={handleMove}
      onPointerLeave={() => setActive(null)}
    >
      <ul className="border-t border-white/10">
        {items.map((item) => {
          const isActive = active === item.id;
          const dimmed = active !== null && !isActive;

          return (
            <li key={item.id} className="border-b border-white/10">
              <a
                href={item.href ?? '#'}
                data-cursor="soft"
                onPointerEnter={() => !coarse && setActive(item.id)}
                onFocus={() => setActive(item.id)}
                onBlur={() => setActive(null)}
                className="group flex items-center gap-5 py-6 outline-none md:py-9"
              >
                {/* Dokunmatikte önizleme kartı yerine satır içi görsel.
                    lazy: bu görseller sayfanın çok altında ve dosyalar ağır —
                    eager yüklenince mobilde açılışı kilitliyorlardı. */}
                {coarse && item.image && (
                  <img
                    src={item.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-14 w-20 shrink-0 rounded-lg object-cover"
                  />
                )}

                {/* lang: başlıklar CSS ile büyütülüyor, Türkçe belgede `i` -> `İ`
                    oluyor. Ürün adlarının çoğu İngilizce (SKYLINE SWINGER),
                    Türkçe olanlar item'da lang:'tr' ile işaretli (TORPİDODAN). */}
                <motion.span
                  lang={item.lang ?? 'en'}
                  animate={{
                    x: isActive ? 22 : 0,
                    opacity: dimmed ? 0.22 : 1,
                    color: isActive ? '#FFFFFF' : 'rgba(243,244,246,0.55)',
                  }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="block flex-1 font-black uppercase leading-[0.95] tracking-tighter will-change-transform"
                  style={{ fontSize: 'clamp(1.75rem, 6vw, 5rem)' }}
                >
                  {item.title}
                </motion.span>

                {item.meta && (
                  <motion.span
                    animate={{
                      opacity: isActive ? 1 : 0,
                      x: isActive ? 0 : 14,
                    }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="hidden shrink-0 text-[10px] font-bold uppercase tracking-[0.35em] text-indigo-400 md:block"
                  >
                    {item.meta}
                  </motion.span>
                )}

                <motion.span
                  aria-hidden="true"
                  animate={{ opacity: isActive ? 1 : 0.25, rotate: isActive ? 0 : -35 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="shrink-0 text-lg text-indigo-400"
                >
                  ↗
                </motion.span>
              </a>
            </li>
          );
        })}
      </ul>

      {/* İmleci takip eden önizleme */}
      {!coarse && (
        <motion.div
          className="pointer-events-none fixed left-0 top-0 z-40 hidden md:block"
          style={{ x: sx, y: sy }}
        >
          <motion.div style={{ rotate: smoothRotate }} className="-translate-x-1/2 -translate-y-1/2">
            <AnimatePresence mode="wait">
              {activeItem?.image && (
                <motion.div
                  key={activeItem.id}
                  initial={{ opacity: 0, scale: 0.82 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden rounded-2xl border border-white/10 shadow-[0_30px_80px_-20px_rgba(99,102,241,0.45)]"
                >
                  <img
                    src={activeItem.image}
                    alt=""
                    decoding="async"
                    className="h-[220px] w-[320px] object-cover"
                    draggable="false"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
