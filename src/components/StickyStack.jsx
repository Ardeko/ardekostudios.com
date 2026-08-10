import { Children, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * Ardeko Studios — üst üste yığılan sticky kartlar.
 *
 * Her kart ekranın üstünde durur, bir sonraki üstüne gelirken hafifçe
 * küçülüp kararır. Oyun kartlarını tek tek "sahneye çıkarmak" için ideal.
 *
 *   <StickyStack top={110}>
 *     <GameCard ... />
 *     <GameCard ... />
 *   </StickyStack>
 *
 * ÖNEMLİ: `position: sticky`, üst elemanlardan birinde `overflow: hidden`
 * varsa çalışmaz. App.jsx'teki kök div'de `overflow-hidden` yerine
 * `overflow-x-clip` kullan (clip scroll konteyneri oluşturmaz).
 */

function StickyCard({ children, index, total, top, offsetStep, scaleStep }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Üstüne kaç kart daha gelecekse o kadar küçülsün
  const remaining = total - 1 - index;
  const minScale = Math.max(0.86, 1 - remaining * scaleStep);
  const scale = useTransform(scrollYProgress, [0, 1], [1, minScale]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, remaining ? 0.55 : 1]);

  return (
    <div
      ref={ref}
      className="sticky"
      style={{ top: top + index * offsetStep }}
    >
      <motion.div style={{ scale, opacity }} className="origin-top will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}

export default function StickyStack({
  children,
  top = 96,          // px — kartın ekranda duracağı üst mesafe
  offsetStep = 14,   // px — her kartın bir öncekinden ne kadar aşağıda duracağı
  scaleStep = 0.045,
  gap = 'mb-[18vh]',
  className = '',
}) {
  const items = Children.toArray(children);

  return (
    <div className={className}>
      {items.map((child, i) => (
        <div key={i} className={i === items.length - 1 ? '' : gap}>
          <StickyCard
            index={i}
            total={items.length}
            top={top}
            offsetStep={offsetStep}
            scaleStep={scaleStep}
          >
            {child}
          </StickyCard>
        </div>
      ))}
    </div>
  );
}
