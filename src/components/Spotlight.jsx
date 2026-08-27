import { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

/**
 * Spotlight — imleci takip eden yumuşak ışık lekesi.
 *
 * Konumlanmış (relative/absolute) ve taşanı kırpan herhangi bir kabın
 * DOĞRUDAN çocuğu olarak bırak; kabı kendisi bulur:
 *
 *   <div className="relative overflow-hidden rounded-3xl ...">
 *     <Spotlight />
 *     <div className="relative z-10">...içerik...</div>
 *   </div>
 *
 * İçeriğe `relative z-10` vermeyi UNUTMA. Spotlight konumlanmış bir eleman,
 * içerik sarmalayıcısı değil — boyama sırasında konumlanmış olan üstte kalır
 * ve metnin üstüne ışık bindirir. z-10 metni tekrar öne alır, ışık camsı
 * zeminde kalır.
 *
 * Maliyet notları (bkz. CLAUDE.md "Görsel bütçesi"):
 * - Dokunmatik cihazda ve `prefers-reduced-motion` açıkken hiç render EDİLMEZ
 *   (null döner). Telefonda hover diye bir şey yok, katmanın bedelini ödemeye
 *   gerek yok.
 * - Alfa bilerek yüksek ve geçiş dar. `App.jsx` zaten imleci takip eden
 *   300px'lik bir `bg-indigo-500/10 blur-[100px]` bulutu çiziyor; yumuşak
 *   ve soluk bir kart ışığı onun içinde kayboluyor, fark edilmiyor. Bunun
 *   ayrı bir ışık gibi okunması için sıkı bir sıcak nokta olması gerek.
 * - `filter: blur()` bilerek KULLANILMIYOR. Yumuşaklık radial-gradient'in
 *   kendi geçişinden geliyor; blur ayrı bir kompozit katmanı zorluyor ve
 *   WebKit'te pahalı. Görsel fark yok, maliyet farkı var.
 */

// Modül sabiti: her render'da yeni nesne verilirse useSpring ayarı boşuna
// yeniden kurulur.
//
// ⚠️ Burada `{ bounce: 0 }` YAZMA. framer-motion'ın bounce/duration API'sinde
// duration verilmezse varsayılan 0.8s'tir — ışık imlecin 800ms gerisinden
// gelir ve "ağır/donuyor" hissi verir. stiffness/damping API'siyle sürüyoruz:
// aşırı sönümlü (overshoot yok) ama ~200ms'de yerine oturuyor.
// App.jsx'teki büyük imleç bulutu bilerek daha ağır (damping 40 / stiffness
// 300 / mass 0.5) — o bir atmosfer katmanı, bu ise imlece yapışık olmalı.
const SPRING = { stiffness: 400, damping: 30, mass: 0.28 };

export default function Spotlight({
  size = 300,
  color = 'rgba(99, 102, 241, 0.55)',
  className = '',
}) {
  const ref = useRef(null);
  const [parent, setParent] = useState(null);
  const [visible, setVisible] = useState(false);

  // İlk render'da senkron karar ver: `enabled` sonradan true olsaydı ilk
  // render null dönerdi, ref hiç bağlanmazdı ve kabı asla bulamazdık.
  const [enabled] = useState(
    () =>
      typeof window !== 'undefined' &&
      !window.matchMedia('(pointer: coarse)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  const x = useSpring(0, SPRING);
  const y = useSpring(0, SPRING);
  const left = useTransform(x, (v) => `${v - size / 2}px`);
  const top = useTransform(y, (v) => `${v - size / 2}px`);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current?.parentElement;
    if (!el) return;
    // Kabın sınıfları zaten doğruysa hiçbir şeye dokunma; sadece eksikse
    // tamamla. Inline stille kabın kendi tasarımını ezmek istemiyoruz.
    const cs = getComputedStyle(el);
    if (cs.position === 'static') el.style.position = 'relative';
    if (cs.overflow === 'visible') el.style.overflow = 'hidden';
    setParent(el);
  }, [enabled]);

  useEffect(() => {
    if (!parent) return undefined;

    // Kabın kutusu ÖNBELLEKTE. Upstream her mousemove'da
    // getBoundingClientRect() çağırıyor; kart aynı anda useTilt ile her
    // mousemove'da `style.transform` YAZDIĞI için bu, hareket başına
    // zorlanmış bir reflow demek (klasik layout thrash) — takılmanın
    // kaynağı buydu. Kutu girişte bir kez okunuyor, sonra sadece hover
    // sürerken scroll/resize'da tazeleniyor.
    let rect = null;
    const refresh = () => {
      rect = parent.getBoundingClientRect();
    };

    const onMove = (e) => {
      if (!rect) refresh();
      x.set(e.clientX - rect.left);
      y.set(e.clientY - rect.top);
    };

    const onEnter = (e) => {
      // Yay son bıraktığı yerden animasyona başlarsa kartın bir ucundan
      // diğerine ışıklı bir çizik atıyor. jump() ile ışığı girilen noktaya
      // ışınla, sonra görünür yap.
      refresh();
      x.jump(e.clientX - rect.left);
      y.jump(e.clientY - rect.top);
      setVisible(true);
      // Dinleyiciler SADECE hover sürerken bağlı. Sayfada 11 kart var;
      // hepsi sürekli scroll dinleseydi her scroll olayında 11 zorlanmış
      // layout olurdu — çözdüğümüz problemin daha büyüğü.
      window.addEventListener('scroll', refresh, { passive: true });
      window.addEventListener('resize', refresh);
    };

    const onLeave = () => {
      setVisible(false);
      window.removeEventListener('scroll', refresh);
      window.removeEventListener('resize', refresh);
    };

    parent.addEventListener('mousemove', onMove);
    parent.addEventListener('mouseenter', onEnter);
    parent.addEventListener('mouseleave', onLeave);
    return () => {
      // Not: upstream (ibelick/spotlight) burada removeEventListener'a taze
      // ok fonksiyonları veriyor, yani enter/leave dinleyicileri hiç
      // kaldırılmıyor. Referansları tutuyoruz.
      parent.removeEventListener('mousemove', onMove);
      parent.removeEventListener('mouseenter', onEnter);
      parent.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('scroll', refresh);
      window.removeEventListener('resize', refresh);
    };
  }, [parent, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute rounded-full transition-opacity duration-500 ${
        visible ? 'opacity-100' : 'opacity-0'
      } ${className}`}
      style={{
        width: size,
        height: size,
        left,
        top,
        background: `radial-gradient(circle at center, ${color} 0%, transparent 62%)`,
      }}
    />
  );
}
