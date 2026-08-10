import { useEffect, useRef, useState } from 'react';
import { motion, useAnimationFrame, useMotionValue, useTransform } from 'framer-motion';
import { useScrollVelocity } from '../lib/scrollVelocity';

/**
 * Ardeko Studios — scroll hızına tepki veren sonsuz bant.
 *
 * Duruyorken yavaşça akar; scroll'da hızlanır ve yön değiştirir. Bandın
 * kendisi de hıza göre hafifçe eğilir (skew) — hareket bulanıklığı hissi.
 *
 *   <Marquee>
 *     <span className="mx-8">KAFA KAFAYA</span>
 *     <span className="mx-8">SWITCH MASTER</span>
 *     ...
 *   </Marquee>
 *
 * İçeriği bir ekran genişliğini dolduracak kadar uzun tut (4–8 öğe);
 * bileşen içeriği 4 kez kopyalayıp ölçerek sarma noktasını buluyor.
 */

const COPIES = 4;

function wrapValue(min, max, value) {
  const range = max - min;
  return (((value - min) % range) + range) % range + min;
}

export default function Marquee({
  children,
  speed = 42,          // px/sn, durgunken
  boost = 5,           // scroll hızının çarpanı
  className = '',
  reverse = false,
}) {
  const trackRef = useRef(null);
  const [copyWidth, setCopyWidth] = useState(0);
  const baseX = useMotionValue(0);
  const fallback = useMotionValue(0);
  const velocity = useScrollVelocity() ?? fallback;
  const direction = useRef(reverse ? -1 : 1);

  const [reduced] = useState(
    () => typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return undefined;
    const measure = () => setCopyWidth(el.scrollWidth / COPIES);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [children]);

  useAnimationFrame((_, delta) => {
    if (reduced || !copyWidth) return;
    const v = velocity.get();
    if (Math.abs(v) > 0.02) direction.current = v < 0 ? -1 : 1;
    const step = direction.current * speed * (delta / 1000) * (1 + Math.abs(v) * boost);
    baseX.set(baseX.get() - step);
  });

  const x = useTransform(baseX, (v) =>
    copyWidth ? `${wrapValue(-copyWidth, 0, v)}px` : '0px'
  );

  // Hıza göre hafif eğilme — hareket bulanıklığı hissi, 4 dereceyle sınırlı
  const skewX = useTransform(velocity, (v) => -v * 4);

  return (
    <div className={`relative w-full overflow-hidden ${className}`} aria-hidden="true">
      <motion.div style={{ skewX }} className="will-change-transform">
        <motion.div ref={trackRef} style={{ x }} className="flex w-max flex-nowrap items-center">
          {Array.from({ length: COPIES }).map((_, i) => (
            <div key={i} className="flex flex-nowrap items-center">
              {children}
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
