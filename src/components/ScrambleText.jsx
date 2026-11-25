import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

/* ------------------------------------------------------------------
   ScrambleText — metin rastgele glifler arasından soldan sağa "çözülür".

   Sitenin HUD/motor dili (LanguageSwitch'in dil kodu, Viewport HUD'u)
   ile aynı aile; şu an gizli projenin kod adında. Görünür alana ilk
   girişte bir kez oynar, `replay` değeri her değiştiğinde (kart hover'ı)
   tekrar oynar.

   · React render'ı yok: kare başına metin düğümünün nodeValue'su yazılır
     (bkz. NumberTicker — textContent React'in düğüm referansını koparır).
   · Boşluk ve noktalama karıştırılmaz, sadece harf/rakam; satır
     genişliği zıplamasın diye glifler büyük harf + rakam.
   · Ekran okuyucu her zaman asıl metni okur (sr-only kopya).
   · Reduced-motion'da hiç oynamaz.
------------------------------------------------------------------- */

const GLYPHS = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&@$';

export default function ScrambleText({ text, replay = 0, duration = 900, className = '', ...rest }) {
  const ref = useRef(null);
  const seen = useRef(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    const node = el?.firstChild;
    if (!el || !node || node.nodeType !== 3 || reduce) return undefined;

    let raf = 0;
    const run = () => {
      cancelAnimationFrame(raf);
      const start = performance.now();
      const chars = [...text];
      const tick = (now) => {
        const p = Math.min(1, (now - start) / duration);
        // Her karakter kendi "çözülme" anına sahip; soldan sağa dalga.
        node.nodeValue = chars
          .map((ch, i) => {
            if (!/[\p{L}\p{N}]/u.test(ch)) return ch;
            const at = (i / chars.length) * 0.7 + 0.3;
            return p >= at ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0];
          })
          .join('');
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    if (!seen.current) {
      const io = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          seen.current = true;
          io.disconnect();
          run();
        },
        { threshold: 0.6 },
      );
      io.observe(el);
      return () => {
        io.disconnect();
        cancelAnimationFrame(raf);
        node.nodeValue = text;
      };
    }

    run();
    return () => {
      cancelAnimationFrame(raf);
      node.nodeValue = text;
    };
  }, [text, replay, duration, reduce]);

  return (
    <span className={className} {...rest}>
      <span ref={ref} aria-hidden="true">
        {text}
      </span>
      <span className="sr-only">{text}</span>
    </span>
  );
}
