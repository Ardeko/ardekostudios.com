import { useEffect, useRef } from 'react';
import { animate, useReducedMotion } from 'framer-motion';

/* ------------------------------------------------------------------
   NumberTicker — "4,8★" gibi bir istatistik metnini 0'dan sayarak yazar.

   Sayının kendisi i18n'deki metinden ayrıştırılıyor; ayrı bir sayı alanı
   yok, yani içerik tek yerde kalıyor. Ondalık ayırıcı da metinden
   geliyor: TR'de "4,8", EN'de "4.6" — biçimlendirme `Intl`'e değil
   kaynağa sadık.

   · Her karede React render YOK: değer doğrudan span'in textContent'ine
     yazılıyor (framer `animate` + onUpdate).
   · Ekran okuyucu animasyonu değil, son değeri okur (sr-only kopya).
   · Reduced-motion'da ve `start` false iken son değer basılı durur —
     JS çalışmasa da sayfa doğru sayıyı gösterir.
------------------------------------------------------------------- */

function parse(value) {
  const m = String(value).match(/^(\D*)(\d+(?:[.,]\d+)?)(.*)$/);
  if (!m) return null;
  const [, prefix, num, suffix] = m;
  const sep = num.includes(',') ? ',' : '.';
  const decimals = num.includes(sep) ? num.split(sep)[1].length : 0;
  return { prefix, suffix, sep, decimals, target: parseFloat(num.replace(',', '.')) };
}

export default function NumberTicker({ value, start = true, delay = 0, duration = 1.4, className = '' }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const parsed = parse(value);

  useEffect(() => {
    // textContent DEĞİL, React'in kendi metin düğümünün nodeValue'su:
    // textContent düğümü değiştirir, React'in tuttuğu referans kopar ve
    // sonraki güncellemeler (dil değişimi) ekrana yansımaz.
    const node = ref.current?.firstChild;
    if (!node || node.nodeType !== 3 || !parsed || reduce || !start) return undefined;
    const fmt = (v) =>
      `${parsed.prefix}${v.toFixed(parsed.decimals).replace('.', parsed.sep)}${parsed.suffix}`;
    node.nodeValue = fmt(0);
    const controls = animate(0, parsed.target, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        node.nodeValue = fmt(v);
      },
    });
    return () => {
      controls.stop();
      node.nodeValue = String(value);
    };
    // value değişince (dil değişimi) yeniden say; parsed her render'da yeni nesne.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, reduce, start, delay, duration]);

  return (
    <span className={className}>
      <span ref={ref} aria-hidden="true" className="tabular-nums">
        {value}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
