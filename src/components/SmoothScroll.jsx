import { ReactLenis, useLenis } from 'lenis/react';
import { useMotionValue, useSpring } from 'framer-motion';
import { ScrollVelocityContext } from '../lib/scrollVelocity';

/**
 * Ardeko Studios — atalet (inertia) scroll + global scroll hızı.
 *
 * Referans sitelerin "pahalı" hissinin %70'i bu: tekerlek girdisi anında
 * değil, yumuşayarak scroll'a dönüşüyor. Lenis gerçek scroll pozisyonunu
 * sürdüğü için framer-motion'ın useScroll'u aynen çalışmaya devam eder.
 *
 * Kurulum:
 *   npm i lenis
 *   main.jsx -> import 'lenis/dist/lenis.css'
 *   App.jsx  -> <SmoothScroll>...</SmoothScroll> ile her şeyi sar
 *
 * index.css'ten `html { scroll-behavior: smooth }` SATIRINI SİL —
 * native smooth scroll Lenis ile kavga eder.
 *
 * prefers-reduced-motion açıksa Lenis kendi kendine sadeleşir
 * (respectReducedMotion varsayılan olarak true).
 */

function VelocityBridge({ children }) {
  const raw = useMotionValue(0);
  const velocity = useSpring(raw, { damping: 42, stiffness: 260, mass: 0.35 });

  useLenis((lenis) => {
    // Lenis px/frame verir; ~45px/frame'i "tam gaz" kabul edip normalize ediyoruz.
    const n = Math.max(-1, Math.min(1, lenis.velocity / 45));
    raw.set(n);
  }, []);

  return (
    <ScrollVelocityContext.Provider value={velocity}>
      {children}
    </ScrollVelocityContext.Provider>
  );
}

export default function SmoothScroll({ children }) {
  return (
    <ReactLenis
      root
      options={{
        // lerp düştükçe scroll ağırlaşır. 0.08–0.12 arası tatlı nokta.
        lerp: 0.085,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.4,
        // #games gibi anchor linkleri Lenis devralsın
        anchors: true,
      }}
    >
      <VelocityBridge>{children}</VelocityBridge>
    </ReactLenis>
  );
}
