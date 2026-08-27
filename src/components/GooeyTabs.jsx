import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

/* ------------------------------------------------------------------
   GooeyTabs — React Bits'in <GooeyNav /> parçacık patlamasının siteye
   uyarlanmış hâli.

   ⚠️ Bu bileşen NAVBAR İÇİN DEĞİL. Masaüstünde nav dikey bir sidebar
   (`Navbar.jsx`, w-64) ve aktif bölüm scroll-spy'dan geliyor; orijinal
   GooeyNav yatay bir pill nav ve aktif indeksi kendi state'inde tutuyor.
   İkisi birleşince pill scroll'da yerinde donuyor. Buradaki kullanım
   yatay ve gerçekten "iki durumlu seçim" olan yer: Viewport sekmeleri.

   Orijinalden bilerek ayrıldığımız yerler:

   1. **Kontrollü.** `value`/`onChange` dışarıdan gelir. Orijinal
      `useState(initialActiveIndex)` ile kendi doğrusunu üretiyordu;
      Viewport'un `mode`'u zaten canvas'ı sürüyor, ikinci bir kaynak
      olamaz.
   2. **Parçacıklar React'ten çıkıyor.** Orijinal `document.createElement`
      + `setTimeout` ile DOM'a span basıp yine `setTimeout` ile siliyor;
      unmount'ta timer'lar ve span'ler ortada kalıyor. Burada `burst`
      state'i var, React mount/unmount ediyor, tek timer var ve o da
      cleanup'ta iptal ediliyor. Patlama bir effect'ten değil doğrudan
      tıklama handler'ından tetikleniyor — patlama bir senkronizasyon
      değil, kullanıcı olayının karşılığı (dolayısıyla "ilk mount'ta
      patlatma" diye bir korumaya da gerek kalmıyor).
   3. **Goo katmanı sadece patlama SÜRESİNCE mount.** `filter: blur()
      contrast()` kalıcı bir kompozit katman demek ve bu bileşen hero'da,
      ekranın en üstünde duruyor — bkz. CLAUDE.md "Görsel bütçesi".
      Boştayken DOM'da hiçbir şey yok, maliyet sıfır. Eğer ileride iOS'ta
      yine bir şey takılırsa kill switch tek satır: `reduce` kontrolüne
      `(pointer: coarse)` ekle.
   4. **Patlama basık.** Orijinal daire şeklinde saçıyor; sekme çubuğu
      44px yüksekliğinde ve kartın `overflow-hidden`'ı üstten kırpıyor.
      Y ekseni `Y_SCALE` ile eziliyor, patlama çubuğun içinde kalıyor.
   5. **Pill kayıyor, patlamıyor.** Orijinal pill'i yerinde `scale(0→1)`
      yapıyor. Sitenin motion dili kaydırmak (`Navbar` active-bar,
      `LanguageSwitch` glow noktası), o yüzden ölçülüp spring ile
      sürülüyor.
   6. **Renkler tanımlı.** Orijinal `var(--color-1..4, white)` okuyor ve
      bu değişkenler bu projede TANIMSIZ — olduğu gibi alınsa bütün
      parçacıklar beyaz çıkardı. Renk artık `colors` prop'undan geliyor.

   Etiketler hakkında: `uppercase` veriyoruz ama i18n string'leri zaten
   büyük harf (OYUN/UYGULAMA/GAME/APP), yani Türkçe `i → İ` tuzağı
   burada işlemiyor. Küçük harf bir İngilizce etiket eklersen `lang="en"`
   koymayı unutma.
------------------------------------------------------------------- */

const GOOEY_CSS = `
.gt-goo{position:absolute;pointer-events:none;display:grid;place-items:center;z-index:1;filter:blur(7px) contrast(100) blur(0);mix-blend-mode:lighten}
.gt-goo::before{content:'';position:absolute;inset:-48px;z-index:-2;background:#000}
.gt-particle,.gt-point{display:block;width:20px;height:20px;border-radius:100%;transform-origin:center}
.gt-particle{position:absolute;top:calc(50% - 10px);left:calc(50% - 10px);opacity:0;animation:gt-particle var(--t) ease 1 -260ms}
.gt-point{background:var(--c);opacity:1;animation:gt-point var(--t) ease 1 -260ms}
@keyframes gt-particle{
  0%{transform:rotate(0deg) translate(var(--sx),var(--sy));opacity:1;animation-timing-function:cubic-bezier(.55,0,1,.45)}
  70%{transform:rotate(calc(var(--r) * .5)) translate(calc(var(--ex) * 1.2),calc(var(--ey) * 1.2));opacity:1;animation-timing-function:ease}
  85%{transform:rotate(calc(var(--r) * .66)) translate(var(--ex),var(--ey));opacity:1}
  100%{transform:rotate(calc(var(--r) * 1.2)) translate(calc(var(--ex) * .5),calc(var(--ey) * .5));opacity:1}
}
@keyframes gt-point{
  0%{transform:scale(0);opacity:0;animation-timing-function:cubic-bezier(.55,0,1,.45)}
  25%{transform:scale(calc(var(--s) * .25))}
  38%{opacity:1}
  65%{transform:scale(var(--s));opacity:1;animation-timing-function:ease}
  85%{transform:scale(var(--s));opacity:1}
  100%{transform:scale(0);opacity:0}
}
@media (prefers-reduced-motion: reduce){.gt-goo{display:none}}
`;

const PARTICLE_COUNT = 14;
const DISTANCES = [78, 10]; // [dış saçılma, iç toplanma]
const RADIUS = 70; // rastgele dönüş şiddeti
const ANIM_MS = 420;
const VARIANCE_MS = 220;
// Patlamayı sekme çubuğunun yüksekliğine doğru bastır ama tamamen ezme —
// 0.5'te parçacıklar çizgi hâline gelip goo eşiğinin altında kalıyordu.
const Y_SCALE = 0.62;

const noise = (n = 1) => n / 2 - Math.random() * n;

function buildParticles(colors) {
  const out = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const angle =
      ((360 + noise(8)) / PARTICLE_COUNT) * (PARTICLE_COUNT - i) * (Math.PI / 180);
    const inner = DISTANCES[1] + noise(7);
    const rot = noise(RADIUS / 10);
    out.push({
      sx: DISTANCES[0] * Math.cos(angle),
      sy: DISTANCES[0] * Math.sin(angle) * Y_SCALE,
      ex: inner * Math.cos(angle),
      ey: inner * Math.sin(angle) * Y_SCALE,
      t: ANIM_MS * 2 + noise(VARIANCE_MS * 2),
      s: 1 + noise(0.2),
      c: colors[Math.floor(Math.random() * colors.length)],
      r: rot > 0 ? (rot + RADIUS / 20) * 10 : (rot - RADIUS / 20) * 10,
    });
  }
  return out;
}

const BURST_LIFETIME = ANIM_MS * 2 + VARIANCE_MS * 2;

export default function GooeyTabs({ tabs, value, onChange, className = '', trailing }) {
  const barRef = useRef(null);
  const btnRefs = useRef([]);
  const timerRef = useRef(0);

  const [box, setBox] = useState(null); // aktif sekmenin çubuğa göre kutusu
  const [burst, setBurst] = useState(null);

  const index = Math.max(
    0,
    tabs.findIndex((tab) => tab.key === value)
  );
  const activeColor = tabs[index]?.color || '#818CF8';

  const measure = useCallback(
    (at = index) => {
      const bar = barRef.current;
      const el = btnRefs.current[at];
      if (!bar || !el) return null;
      const b = bar.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      return { x: r.left - b.left, y: r.top - b.top, w: r.width, h: r.height };
    },
    [index]
  );

  // Pill'in konumu tek bir kaynaktan geliyor: ResizeObserver. observe()
  // çağrıldığı anda ilk ölçümü de teslim ettiği için ayrı bir "başlangıç
  // ölçümü" effect'ine gerek yok. Hem çubuğu hem aktif butonu izliyoruz —
  // dil değişince (OYUN → GAME) çubuğun genişliği aynı kalabilir ama
  // butonunki değişir, sadece çubuğu izlesek pill kayık kalırdı.
  useEffect(() => {
    const bar = barRef.current;
    const btn = btnRefs.current[index];
    if (!bar || !btn) return undefined;

    if (typeof ResizeObserver === 'undefined') {
      const id = requestAnimationFrame(() => setBox(measure()));
      return () => cancelAnimationFrame(id);
    }
    const ro = new ResizeObserver(() => setBox(measure()));
    ro.observe(bar);
    ro.observe(btn);
    return () => ro.disconnect();
  }, [index, measure]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const handleSelect = (tab, i) => {
    if (tab.key === value) return;
    onChange(tab.key);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = measure(i);
    if (!rect) return;

    // id, patlama span'ini React'e yeniden mount ettiren key. Ardışık iki
    // patlamanın id'si her zaman farklı, çünkü yukarıdaki erken dönüş
    // aktif sekmeyi tekrar seçmeyi engelliyor — yani yeni seçilen sekme
    // bir öncekinden zorunlu olarak başka. Sayaç/zaman damgası gerekmiyor.
    setBurst({
      id: tab.key,
      rect,
      particles: buildParticles([tab.color || '#818CF8', '#FFFFFF']),
    });
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setBurst(null), BURST_LIFETIME);
  };

  return (
    <div ref={barRef} className={`relative flex items-stretch ${className}`}>
      <style>{GOOEY_CSS}</style>

      {box && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 bg-white/[0.06]"
          initial={false}
          animate={{ x: box.x, width: box.w, height: box.h }}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        >
          {/* Aktif sekmenin renginde kayan alt çizgi. Pill'in kendisi
              `bg-white/[0.06]` — eskiden de aynı tondu, sadece anında
              takas oluyordu; hareketin fark edilmesi için renkli bir
              kenar gerekiyor. HUD/motor dilinde bir sekme göstergesi. */}
          <motion.span
            className="absolute bottom-0 left-0 h-[2px] w-full"
            initial={false}
            animate={{ backgroundColor: activeColor }}
            transition={{ duration: 0.3 }}
            style={{ boxShadow: `0 0 12px ${activeColor}` }}
          />
        </motion.span>
      )}

      {burst && (
        <span
          key={burst.id}
          aria-hidden="true"
          className="gt-goo"
          style={{
            left: burst.rect.x,
            top: burst.rect.y,
            width: burst.rect.w,
            height: burst.rect.h,
          }}
        >
          {burst.particles.map((p, i) => (
            <span
              key={i}
              className="gt-particle"
              style={{
                '--sx': `${p.sx}px`,
                '--sy': `${p.sy}px`,
                '--ex': `${p.ex}px`,
                '--ey': `${p.ey}px`,
                '--t': `${p.t}ms`,
                '--s': p.s,
                '--c': p.c,
                '--r': `${p.r}deg`,
              }}
            >
              <span className="gt-point" />
            </span>
          ))}
        </span>
      )}

      {tabs.map((tab, i) => {
        const active = tab.key === value;
        return (
          <button
            key={tab.key}
            ref={(el) => {
              btnRefs.current[i] = el;
            }}
            type="button"
            onClick={() => handleSelect(tab, i)}
            aria-pressed={active}
            data-cursor="ring"
            className={[
              'relative z-[2] cursor-pointer border-r border-white/8 px-4 py-3',
              'text-[10px] font-black uppercase tracking-[0.25em] transition-colors duration-200',
              active ? 'text-white' : 'text-gray-500 hover:text-gray-300',
            ].join(' ')}
          >
            <span
              className="mr-2 inline-block h-1.5 w-1.5 rounded-full align-middle transition-shadow duration-300"
              style={{
                background: active ? tab.color : 'currentColor',
                boxShadow: active ? `0 0 8px ${tab.color}` : 'none',
              }}
              aria-hidden="true"
            />
            {tab.label}
          </button>
        );
      })}

      {trailing}
    </div>
  );
}
