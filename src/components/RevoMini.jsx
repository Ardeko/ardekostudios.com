import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, AudioLines, Lock, Mic, MicOff, Signal } from 'lucide-react';

/* ------------------------------------------------------------------
   REVO Mini — Viewport'un UYGULAMA sekmesi (2026-11-25).

   Eskiden burada kendini kuran soyut bir arayüz iskeleti vardı. Artık
   stüdyonun yayındaki uygulaması REVO'nun (ardekostudios.xyz — sesli
   sohbet, SignalR + WebRTC) küçük, ETKİLEŞİMLİ bir odası. Gösterilen her
   özellik ürünün gerçek özelliği (i18n `games.items.revo.desc`):
     · bas-konuş → kendi döşemende ses halkası,
     · gürültü engelleme → kapatınca arka plan gürültüsü ölçerde görünür,
     · kişi başı ses → kaydırıcı o kişinin halkasını gerçekten değiştirir,
     · uçtan uca şifre + düşük gecikme rozeti.
   Mikrofon izni İSTENMİYOR — ses seviyeleri benzetim. Diğer üç kişi
   (nova / hermes / rey) açıkça takma ad; gerçek kişi gibi durmasınlar.

   Seviyeler React state'i değil: rAF döngüsü halka/çubuk elemanlarına
   doğrudan stil yazıyor (kare başına render yok). Döngü sadece ekran
   görünürken; reduced-motion'da yalnızca kullanıcı konuşurken döner.
------------------------------------------------------------------- */

const TEAL = '#3ECFC0';
const PEOPLE = [
  { id: 'you', hue: 248 },
  { id: 'nova', name: 'nova', hue: 174 },
  { id: 'hermes', name: 'hermes', hue: 28 },
  { id: 'rey', name: 'rey', hue: 292 },
];

// Yumuşak, tekrarsız görünen gürültü — iki sinüs çarpımı.
const wobble = (t, p) => 0.5 + 0.5 * Math.sin(t * 9.7 + p) * Math.sin(t * 5.3 + p * 1.7);

export default function RevoMini({ labels, observeRef }) {
  const rings = useRef({});
  const bars = useRef({});
  const names = useRef({});
  const pttRef = useRef(false);
  const noiseRef = useRef(true);
  const volRef = useRef({ nova: 1, hermes: 1, rey: 1 });
  const kickRef = useRef(() => {});
  const [ptt, setPtt] = useState(false);
  const [noiseOn, setNoiseOn] = useState(true);
  const [vols, setVols] = useState({ nova: 100, hermes: 100, rey: 100 });
  const [ping, setPing] = useState(18);

  useEffect(() => {
    const id = setInterval(() => setPing(13 + Math.round(Math.random() * 11)), 1700);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const phase = { you: 0.3, nova: 1.9, hermes: 3.1, rey: 4.4 };
    const talk = {
      nova: { on: false, until: 0.6 },
      hermes: { on: false, until: 2.2 },
      rey: { on: false, until: 4.0 },
    };
    const lvl = { you: 0, nova: 0, hermes: 0, rey: 0 };
    let raf = 0;
    let onScreen = true;
    let t = 0;
    let last = 0;

    const paint = () => {
      for (const p of PEOPLE) {
        const v = Math.min(1.2, lvl[p.id]);
        const ring = rings.current[p.id];
        const bar = bars.current[p.id];
        const name = names.current[p.id];
        if (ring) {
          ring.style.opacity = String(Math.min(1, v * 1.5));
          ring.style.transform = `scale(${1 + v * 0.16})`;
        }
        if (bar) bar.style.transform = `scaleX(${Math.min(1, v)})`;
        if (name) name.dataset.speaking = v > 0.18 ? 'true' : 'false';
      }
    };

    const frame = (now) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      t += dt;
      const speaking = Object.values(talk).filter((s) => s.on).length;
      for (const id of ['nova', 'hermes', 'rey']) {
        const s = talk[id];
        if (t >= s.until) {
          // Aynı anda en fazla iki kişi; çoğu zaman tek kişi konuşur.
          if (s.on) {
            s.on = false;
            s.until = t + 0.8 + Math.random() * 2.6;
          } else if (speaking < 1 || Math.random() < 0.18) {
            s.on = true;
            s.until = t + 1.1 + Math.random() * 2.2;
          } else {
            s.until = t + 0.4;
          }
        }
        const target = s.on && !reduce ? (0.35 + 0.65 * wobble(t, phase[id])) * volRef.current[id] : 0;
        lvl[id] += (target - lvl[id]) * Math.min(1, dt * 14);
      }
      const you = pttRef.current
        ? 0.4 + 0.6 * wobble(t, phase.you)
        : noiseRef.current || reduce
          ? 0
          : 0.1 + 0.14 * wobble(t * 1.7, 0.9);
      lvl.you += (you - lvl.you) * Math.min(1, dt * 16);
      paint();
      if (reduce && !pttRef.current && lvl.you < 0.01) {
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (raf || !onScreen || document.visibilityState !== 'visible') return;
      last = 0;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    kickRef.current = start;

    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      if (onScreen && !reduce) start();
      else if (!onScreen) stop();
    });
    io.observe(observeRef?.current || document.body);
    const onVis = () => (document.visibilityState === 'visible' && !reduce ? start() : stop());
    document.addEventListener('visibilitychange', onVis);
    if (!reduce) start();
    paint();
    return () => {
      stop();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [observeRef]);

  const talkOn = () => {
    pttRef.current = true;
    setPtt(true);
    kickRef.current();
  };
  const talkOff = () => {
    pttRef.current = false;
    setPtt(false);
  };
  const toggleNoise = () => {
    noiseRef.current = !noiseRef.current;
    setNoiseOn(noiseRef.current);
    kickRef.current();
  };

  return (
    <div
      className="relative flex h-full w-full flex-col overflow-hidden"
      style={{
        background:
          'radial-gradient(110% 80% at 15% 0%, rgba(62,207,192,0.12), transparent 60%), radial-gradient(80% 70% at 100% 100%, rgba(99,102,241,0.14), transparent 65%), #070B14',
      }}
    >
      {/* Üst çubuk: oda + güvenlik + gecikme */}
      <div className="flex items-center justify-between gap-3 px-4 pt-3.5 sm:px-5 sm:pt-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-chip" style={{ background: 'rgba(62,207,192,0.14)', color: TEAL }}>
            <AudioLines className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />
          </span>
          <span className="text-sm font-black tracking-tight text-white">REVO</span>
          <span className="truncate rounded-full border border-white/10 px-2 py-0.5 text-[10px] font-bold text-gray-300">
            # {labels.room}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-3 text-[10px] font-bold text-gray-300">
          <span className="hidden items-center gap-1.5 sm:inline-flex">
            <Lock className="h-3 w-3" style={{ color: TEAL }} strokeWidth={2.5} aria-hidden="true" />
            {labels.e2e}
          </span>
          <span className="inline-flex items-center gap-1.5 tabular-nums" aria-label={`${labels.latency}: ${ping} ms`}>
            <Signal className="h-3 w-3" style={{ color: TEAL }} strokeWidth={2.5} aria-hidden="true" />
            {ping} ms
          </span>
        </div>
      </div>

      {/* Katılımcılar */}
      <ul className="grid flex-1 grid-cols-4 content-center gap-2 px-3 sm:gap-3 sm:px-5">
        {PEOPLE.map((p) => {
          const isYou = p.id === 'you';
          const name = isYou ? labels.you : p.name;
          return (
            <li
              key={p.id}
              className="card-glass flex flex-col items-center gap-2 rounded-card border border-white/8 px-1.5 py-3 sm:py-4"
            >
              <div className="relative h-11 w-11 sm:h-14 sm:w-14">
                <span
                  ref={(el) => {
                    rings.current[p.id] = el;
                  }}
                  aria-hidden="true"
                  className="absolute -inset-1.5 rounded-full border-2 opacity-0"
                  style={{ borderColor: TEAL, boxShadow: `0 0 18px ${TEAL}66` }}
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `radial-gradient(circle at 32% 28%, hsl(${p.hue} 85% 74%), hsl(${p.hue} 62% 38%) 70%)`,
                    boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.45), inset 0 -2px 6px rgba(0,0,0,0.35)',
                  }}
                />
                <span className="relative flex h-full w-full items-center justify-center text-sm font-black uppercase text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.4)]">
                  {name.slice(0, 1)}
                </span>
                {isYou && (
                  <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-white/15 bg-[#070B14] text-gray-300">
                    {ptt ? (
                      <Mic className="h-3 w-3" style={{ color: TEAL }} strokeWidth={2.5} aria-hidden="true" />
                    ) : (
                      <MicOff className="h-3 w-3" strokeWidth={2.5} aria-hidden="true" />
                    )}
                  </span>
                )}
              </div>
              <span
                ref={(el) => {
                    names.current[p.id] = el;
                  }}
                data-speaking="false"
                className="max-w-full truncate text-[10px] font-bold text-gray-300 transition-colors duration-300 data-[speaking=true]:text-[#3ECFC0]"
              >
                {name}
              </span>
              <span className="h-1 w-9 overflow-hidden rounded-full bg-white/10 sm:w-12" aria-hidden="true">
                <span
                  ref={(el) => {
                    bars.current[p.id] = el;
                  }}
                  className="block h-full w-full origin-left rounded-full"
                  style={{ background: TEAL, transform: 'scaleX(0)' }}
                />
              </span>
              {!isYou && (
                <input
                  type="range"
                  min={0}
                  max={150}
                  step={5}
                  value={vols[p.id]}
                  aria-label={`${p.name} — ${labels.volume}`}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    volRef.current[p.id] = v / 100;
                    setVols((s) => ({ ...s, [p.id]: v }));
                  }}
                  className="hidden h-1 w-[80%] cursor-pointer sm:block"
                  style={{ accentColor: TEAL }}
                />
              )}
            </li>
          );
        })}
      </ul>

      {/* Kontroller */}
      <div className="flex items-center gap-2 px-3 pb-3.5 pt-2 sm:gap-3 sm:px-5 sm:pb-4">
        <button
          type="button"
          aria-pressed={ptt}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture?.(e.pointerId);
            talkOn();
          }}
          onPointerUp={talkOff}
          onPointerCancel={talkOff}
          onKeyDown={(e) => {
            if ((e.code === 'Space' || e.code === 'Enter') && !e.repeat) {
              e.preventDefault();
              talkOn();
            }
          }}
          onKeyUp={(e) => {
            if (e.code === 'Space' || e.code === 'Enter') {
              e.preventDefault();
              talkOff();
            }
          }}
          onContextMenu={(e) => e.preventDefault()}
          data-cursor="soft"
          data-cursor-color="teal"
          className={`lg flex min-w-0 flex-1 touch-none select-none items-center justify-center gap-2 rounded-control px-3 py-2.5 text-[10px] font-black uppercase tracking-widest transition-colors duration-200 ${
            ptt ? 'text-[#07131A]' : 'text-white'
          }`}
          style={ptt ? { background: TEAL } : undefined}
        >
          <Mic className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} aria-hidden="true" />
          <span className="truncate">{ptt ? labels.talking : labels.ptt}</span>
        </button>

        <button
          type="button"
          role="switch"
          aria-checked={noiseOn}
          onClick={toggleNoise}
          data-cursor="ring"
          data-cursor-color="teal"
          className="lg flex shrink-0 items-center gap-2 rounded-control px-3 py-2.5 text-[10px] font-black uppercase tracking-widest text-gray-200"
        >
          <span className="well relative h-4 w-7 rounded-full" aria-hidden="true">
            <span
              className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full transition-[left,background-color] duration-300 ease-out-expo"
              style={{ left: noiseOn ? 14 : 2, background: noiseOn ? TEAL : '#6B7280' }}
            />
          </span>
          <span className="hidden sm:inline">{labels.noise}</span>
        </button>

        <a
          href="https://ardekostudios.xyz"
          target="_blank"
          rel="noreferrer"
          data-cursor="ring"
          data-cursor-color="teal"
          aria-label={labels.openAria}
          className="shine group relative flex shrink-0 items-center gap-1.5 overflow-hidden rounded-control px-3 py-2.5 text-[10px] font-black uppercase tracking-widest"
          style={{ background: TEAL, color: '#07131A', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.45), 0 0 22px rgba(62,207,192,0.25)' }}
        >
          <span className="hidden sm:inline">{labels.open}</span>
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={2.5} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
