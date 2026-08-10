import { createContext, useContext } from 'react';

/**
 * Global scroll hızı kanalı.
 *
 * SmoothScroll bu context'i doldurur; Marquee gibi hıza tepki veren
 * bileşenler useScrollVelocity() ile okur.
 *
 * Değer: -1 (yukarı hızlı) ... 0 (durgun) ... 1 (aşağı hızlı) aralığında,
 * yaylandırılmış bir MotionValue. SmoothScroll dışında kullanılırsa null döner.
 */
export const ScrollVelocityContext = createContext(null);

export function useScrollVelocity() {
  return useContext(ScrollVelocityContext);
}
