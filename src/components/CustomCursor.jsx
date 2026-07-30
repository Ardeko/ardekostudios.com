import { useEffect, useRef } from 'react';
import './CustomCursor.css';

/**
 * Ardeko Studios — manyetik custom cursor.
 *
 * Kurulum:
 *   1) App.jsx içine bir kere ekle:
 *        import CustomCursor from './components/CustomCursor';
 *        ...
 *        <CustomCursor />
 *
 *   2) Etkileşim vermek istediğin elemente data-cursor ekle:
 *        data-cursor="solid"  -> dolu daire, CTA butonları için (OYUNLARI KEŞFET, SOHBETE BAŞLA)
 *        data-cursor="ring"   -> sadece halka, linkler için (Navbar, "Projeleri Gör")
 *        data-cursor="soft"   -> geniş/yumuşak glow, kartlar için (oyun kartları, RevoScene)
 *
 *      Opsiyonel renk override'ı (varsayılan indigo):
 *        data-cursor-color="teal"   -> REVO gibi teal temalı öğeler için
 *
 *   Elemanın kendisi de fareye doğru hafifçe kayar (manyetik çekim), bunun
 *   için ekstra bir şey yapmana gerek yok — otomatik.
 *
 *   Dokunmatik cihazlarda ve prefers-reduced-motion açıkken otomatik devre dışı / sadeleşir.
 */
export default function CustomCursor() {
  const dotRef = useRef(null);

  useEffect(() => {
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    if (isCoarsePointer) return undefined;

    const dot = dotRef.current;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const follow = reduceMotion ? 1 : 0.2;

    let mouseX = 0;
    let mouseY = 0;
    let curX = 0;
    let curY = 0;
    let currentTarget = null;
    let rafId;

    document.body.classList.add('adk-cursor-active');

    const handleMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.classList.add('visible');

      // Elemanın kendisini de fareye doğru kaydırmak istersen data-cursor-magnet ekle.
      // Sitede zaten kendi transform'unu yöneten butonlar var (Hero/Contact/Games
      // MagneticButton, Games useTilt) — onlarla çakışmaması için bu varsayılan kapalı.
      if (currentTarget && currentTarget.hasAttribute('data-cursor-magnet')) {
        const r = currentTarget.getBoundingClientRect();
        const flavor = currentTarget.getAttribute('data-cursor') || 'solid';
        const strength = flavor === 'ring' ? 0.22 : 0.35;
        const relX = e.clientX - r.left - r.width / 2;
        const relY = e.clientY - r.top - r.height / 2;
        currentTarget.style.transform = `translate(${relX * strength}px, ${relY * strength}px)`;
      }
    };

    // mouseover/mouseout (delegated on document) yerine tek tek listener
    // eklemek yerine kullanılıyor, çünkü Games listesi gibi sonradan
    // mount olan elemanlarda da otomatik çalışsın istiyoruz.
    const handleOver = (e) => {
      const target = e.target.closest('[data-cursor]');
      if (!target || target === currentTarget) return;
      currentTarget = target;

      const flavor = target.getAttribute('data-cursor') || 'solid';
      const color = target.getAttribute('data-cursor-color');
      dot.dataset.flavor = flavor;
      if (color) dot.dataset.color = color;
      else delete dot.dataset.color;
      dot.classList.add('hover');
      target.style.transition = 'transform .1s ease-out';
    };

    const handleOut = (e) => {
      if (!currentTarget) return;
      if (currentTarget.contains(e.relatedTarget)) return;
      dot.classList.remove('hover');
      delete dot.dataset.flavor;
      delete dot.dataset.color;
      if (currentTarget.hasAttribute('data-cursor-magnet')) {
        currentTarget.style.transition = 'transform .5s cubic-bezier(.16,1,.3,1)';
        currentTarget.style.transform = 'translate(0,0)';
      }
      currentTarget = null;
    };

    const handleWindowLeave = () => dot.classList.remove('visible');

    window.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseover', handleOver);
    document.addEventListener('mouseout', handleOut);
    document.documentElement.addEventListener('mouseleave', handleWindowLeave);

    function loop() {
      curX += (mouseX - curX) * follow;
      curY += (mouseY - curY) * follow;
      dot.style.transform = `translate3d(${curX}px, ${curY}px, 0)`;
      rafId = requestAnimationFrame(loop);
    }
    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseover', handleOver);
      document.removeEventListener('mouseout', handleOut);
      document.documentElement.removeEventListener('mouseleave', handleWindowLeave);
      cancelAnimationFrame(rafId);
      document.body.classList.remove('adk-cursor-active');
    };
  }, []);

  return <div ref={dotRef} className="adk-cursor" />;
}
