import { useState } from 'react';
import './Folder.css';

/* ------------------------------------------------------------------
   Folder — React Bits'in <Folder /> bileşeninin siteye uyarlanmış hâli.

   Tek kullanım yeri: `Games.jsx`'teki **gizli proje** kartı. Orada
   duran 🔒 emojisinin yerini aldı, çünkü klasör metaforu o kartın
   metniyle birebir örtüşüyor: dosya var, açılıyor, ama içindekiler
   hâlâ karartılmış. Dekoratif bir ikon değil, kartın söylediği şeyin
   görselleştirilmiş hâli.

   Sitenin geri kalanına yaymaya çalışma — diğer kartların hepsinde
   elle çizilmiş, projeye özel CSS/SVG sahneler var (TrainScene,
   RevoScene, DecoyScene...). Genel amaçlı bir klasör ikonu onların
   yanında yavan kalır. Gizli projede işe yaramasının sebebi zaten
   projeye ait bir görselin OLMAMASI.

   Orijinalden ayrıldığımız yerler:

   1. **Kâğıtlar beyaz değil.** Orijinal `--paper-1..3`'ü
      `darkenColor('#ffffff', ...)` ile üretiyor; #05070F zeminli bir
      sitede üç beyaz dikdörtgen kartın en parlak öğesi olurdu. Renkler
      artık `paperColors` prop'undan geliyor ve karartılmış belge tonu.
   2. **Ölçek sarmalayıcısı yer kaplıyor.** Orijinal dış div'e
      `transform: scale(size)` veriyor ama kutu hâlâ 100×80 ölçüsünde
      yer tutuyor, yani scale>1'de komşularının üstüne taşıyor. Burada
      sarmalayıcı `width/height` ile gerçek ölçüye çekiliyor.
   3. **`handlePaperMouseLeave`'in kullanılmayan `e` parametresi**
      kaldırıldı (lint).
------------------------------------------------------------------- */

const MAX_ITEMS = 3;

function darkenColor(hex, percent) {
  let color = hex.startsWith('#') ? hex.slice(1) : hex;
  if (color.length === 3) {
    color = color
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const num = parseInt(color.slice(0, 6), 16);
  const clamp = (v) => Math.max(0, Math.min(255, Math.floor(v * (1 - percent))));
  const r = clamp((num >> 16) & 0xff);
  const g = clamp((num >> 8) & 0xff);
  const b = clamp(num & 0xff);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

export default function Folder({
  color = '#4F46E5',
  size = 1,
  items = [],
  paperColors = ['#0E1222', '#141A2E', '#1B2340'],
  label,
  className = '',
}) {
  const [open, setOpen] = useState(false);
  const [offsets, setOffsets] = useState(() =>
    Array.from({ length: MAX_ITEMS }, () => ({ x: 0, y: 0 }))
  );

  const papers = items.slice(0, MAX_ITEMS);
  while (papers.length < MAX_ITEMS) papers.push(null);

  const reset = () => setOffsets(Array.from({ length: MAX_ITEMS }, () => ({ x: 0, y: 0 })));

  const toggle = () => {
    setOpen((prev) => !prev);
    if (open) reset();
  };

  // Açıkken kâğıtlar imlece doğru hafifçe kaçıyor — sitenin her yerindeki
  // MagneticButton/MagneticLink diliyle aynı his.
  const onPaperMove = (e, i) => {
    if (!open) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.15;
    const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.15;
    setOffsets((prev) => {
      const next = [...prev];
      next[i] = { x: dx, y: dy };
      return next;
    });
  };

  const onPaperLeave = (i) => {
    setOffsets((prev) => {
      const next = [...prev];
      next[i] = { x: 0, y: 0 };
      return next;
    });
  };

  return (
    <div
      className={className}
      style={{ width: 100 * size, height: 80 * size }}
      // Orijinal sadece scale ediyor ve kutu 100×80 kalıyordu; scale>1'de
      // klasör komşularının üstüne biniyordu. Kutuyu gerçek ölçüye çekip
      // içeriği sol-üstten ölçekliyoruz.
    >
      <div
        style={{ transform: `scale(${size})`, transformOrigin: 'top left' }}
      >
        <div
          className={`adk-folder${open ? ' is-open' : ''}`}
          style={{
            '--folder-color': color,
            '--folder-back-color': darkenColor(color, 0.28),
            '--paper-1': paperColors[0],
            '--paper-2': paperColors[1],
            '--paper-3': paperColors[2],
          }}
          onClick={toggle}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggle();
            }
          }}
          tabIndex={0}
          role="button"
          data-cursor="ring"
          aria-expanded={open}
          aria-label={label}
        >
          <div className="adk-folder__back">
            {papers.map((item, i) => (
              <div
                key={i}
                className="adk-paper"
                onMouseMove={(e) => onPaperMove(e, i)}
                onMouseLeave={() => onPaperLeave(i)}
                style={
                  open
                    ? {
                        '--magnet-x': `${offsets[i]?.x || 0}px`,
                        '--magnet-y': `${offsets[i]?.y || 0}px`,
                      }
                    : undefined
                }
              >
                {item}
              </div>
            ))}
            <div className="adk-folder__front" />
            <div className="adk-folder__front adk-folder__front--right" />
          </div>
        </div>
      </div>
    </div>
  );
}
