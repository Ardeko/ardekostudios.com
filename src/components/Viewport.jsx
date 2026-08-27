import { useEffect, useRef, useState } from 'react';
import GooeyTabs from './GooeyTabs';
import { useLang } from '../lib/i18n';

/* ------------------------------------------------------------------
   Viewport — canlı motor ekranı.

   Stok bir arkaplan videosu yerine (ki lisansımız yok), hero bunun
   yerine canvas üzerinde canlı bir "engine viewport" çiziyor:
     · "oyun"      sekmesi → imleçle deforme olan bir wireframe mesh
     · "uygulama"  sekmesi → kendini kuran bir arayüz iskeleti,
                    elemanlar imlece doğru manyetik şekilde çekiliyor
                    (stüdyonun her yerdeki "magnetic button" diliyle aynı)
   Birkaç KB kod, üçüncü taraf asset yok, ve anlatmak yerine gösteriyor.

   prefers-reduced-motion'a saygı duyar: tek kare çizip durur.
------------------------------------------------------------------- */

const COLORS = { game: '#818CF8', app: '#34D399' };

function drawMesh(ctx, w, h, time, pointer, color) {
  const COLS = 26;
  const ROWS = 18;
  const cx = w / 2;
  const horizon = h * 0.2;

  const project = (x, z, y) => {
    const depth = 0.4 + z * 2.2;
    const k = 1 / depth;
    return {
      px: cx + x * k * w * 0.3,
      py: horizon + k * h * 0.2 - y * k,
      k,
    };
  };

  const amp = h * 0.07;
  const grid = [];
  for (let j = 0; j < ROWS; j++) {
    const row = [];
    const z = j / (ROWS - 1);
    for (let i = 0; i < COLS; i++) {
      const x = -1 + (2 * i) / (COLS - 1);
      let y = amp * Math.sin(x * 2.6 + time * 0.9) * Math.cos(z * 3.2 - time * 0.5);

      // imleç yüzeyi hover ettiği yerde yukarı itiyor
      const dx = x - pointer.x;
      const dz = z - pointer.z;
      const d2 = dx * dx * 1.4 + dz * dz * 3.2;
      y += amp * 1.9 * Math.exp(-d2 * 5) * pointer.strength;

      row.push({ x, z, ...project(x, z, y) });
    }
    grid.push(row);
  }

  ctx.lineWidth = 1;
  ctx.lineJoin = 'round';

  // soldan sağa satırlar
  for (let j = 0; j < ROWS; j++) {
    const z = j / (ROWS - 1);
    ctx.beginPath();
    grid[j].forEach((p, i) => (i ? ctx.lineTo(p.px, p.py) : ctx.moveTo(p.px, p.py)));
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.07 + 0.42 * (1 - z) ** 1.6;
    ctx.stroke();
  }

  // yakından uzağa sütunlar, mesh okunur kalsın diye seyreltilmiş
  for (let i = 0; i < COLS; i += 2) {
    ctx.beginPath();
    for (let j = 0; j < ROWS; j++) {
      const p = grid[j][i];
      j ? ctx.lineTo(p.px, p.py) : ctx.moveTo(p.px, p.py);
    }
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.1;
    ctx.stroke();
  }

  // izleyiciye doğru ilerleyen tek bir sıcak tarama satırı
  const scan = (Math.sin(time * 0.35) * 0.5 + 0.5) * (ROWS - 1);
  const sj = Math.round(scan);
  ctx.beginPath();
  grid[sj].forEach((p, i) => (i ? ctx.lineTo(p.px, p.py) : ctx.moveTo(p.px, p.py)));
  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.85;
  ctx.lineWidth = 1.4;
  ctx.stroke();

  ctx.globalAlpha = 1;
}

function drawSkeleton(ctx, w, h, time, color, pointer) {
  const CYCLE = 7;
  const p = (time % CYCLE) / CYCLE;
  const pad = w * 0.12;
  const inner = w - pad * 2;
  const top = h * 0.16;
  const scale = Math.min(1, (h * 0.62) / 234);

  // imlecin, elemanların çizildiği lokal (translate+scale öncesi) uzaydaki karşılığı
  const localX = (pointer.nx * w - pad) / (scale || 1);
  const localY = (pointer.ny * h - top) / (scale || 1);

  // element = [x, y, width, height, delay]
  const els = [
    [0, 0, inner * 0.42, 10, 0.0],
    [0, 30, inner, 3, 0.05],
    [0, 42, inner * 0.7, 3, 0.08],
    [0, 74, inner * 0.31, 64, 0.16],
    [inner * 0.345, 74, inner * 0.31, 64, 0.21],
    [inner * 0.69, 74, inner * 0.31, 64, 0.26],
    [0, 154, inner * 0.55, 3, 0.34],
    [0, 166, inner * 0.85, 3, 0.37],
    [0, 178, inner * 0.4, 3, 0.4],
    [0, 208, inner * 0.36, 26, 0.48],
  ];

  ctx.save();
  ctx.translate(pad, top);
  ctx.scale(scale, scale);

  els.forEach(([x, y, ew, eh, delay], idx) => {
    const local = Math.max(0, Math.min(1, (p - delay) / 0.16));
    const eased = 1 - (1 - local) ** 3;
    if (eased <= 0) return;

    const fadeOut = p > 0.88 ? 1 - (p - 0.88) / 0.12 : 1;

    // imlece yakınlık — elemanlar stüdyonun her yerdeki manyetik butonları
    // gibi imlece doğru hafifçe çekiliyor ve üzerinden geçerken parlıyor
    const ecx = x + ew / 2;
    const ecy = y + eh / 2;
    const dx = localX - ecx;
    const dy = localY - ecy;
    const dist = Math.hypot(dx, dy);
    const proximity = Math.exp(-(dist * dist) / (85 * 85)) * pointer.strength;
    const pull = 7 * proximity;
    const ux = dist > 0.01 ? dx / dist : 0;
    const uy = dist > 0.01 ? dy / dist : 0;

    ctx.globalAlpha = eased * fadeOut;
    ctx.translate(ux * pull, (1 - eased) * 10 + uy * pull);

    // ana blok ve buton için dolu vurgular, gerisi ince çizgi
    const solid = idx === 0 || idx === 9;
    if (solid) {
      ctx.fillStyle = color;
      ctx.globalAlpha *= 0.85 + proximity * 0.15;
      ctx.fillRect(x, y, ew * eased, eh);
    } else {
      ctx.strokeStyle = color;
      ctx.globalAlpha *= 0.4 + proximity * 0.5;
      ctx.lineWidth = eh <= 3 ? eh : 1;
      if (eh <= 3) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, ew * eased, eh);
      } else {
        ctx.strokeRect(x + 0.5, y + 0.5, ew - 1, eh - 1);
      }
    }
    ctx.translate(-(ux * pull), -((1 - eased) * 10 + uy * pull));
  });

  ctx.restore();
  ctx.globalAlpha = 1;
}

export default function Viewport() {
  const { t } = useLang();
  const TABS = [
    { key: 'game', label: t.viewport.tabs.game, color: COLORS.game },
    { key: 'app', label: t.viewport.tabs.app, color: COLORS.app },
  ];
  const [mode, setMode] = useState('game');
  const [hud, setHud] = useState({ fps: 60, frame: 0, w: 0, h: 0 });
  const canvasRef = useRef(null);
  const modeRef = useRef(mode);
  const pointerRef = useRef({ x: 0.2, z: 0.4, nx: 0.5, ny: 0.5, strength: 0 });

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let raf;
    let frame = 0;
    let lastHud = 0;
    let lastTick = performance.now();
    let fps = 60;
    let w = 0;
    let h = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const render = (now) => {
      const time = now / 1000;
      const dt = now - lastTick;
      lastTick = now;
      if (dt > 0) fps = fps * 0.9 + (1000 / dt) * 0.1;
      frame++;

      ctx.clearRect(0, 0, w, h);
      const color = COLORS[modeRef.current];

      pointerRef.current.strength *= 0.985;
      if (modeRef.current === 'game') {
        drawMesh(ctx, w, h, time, pointerRef.current, color);
      } else {
        drawSkeleton(ctx, w, h, time, color, pointerRef.current);
      }

      if (now - lastHud > 400) {
        lastHud = now;
        setHud({ fps: Math.round(fps), frame, w: Math.round(w), h: Math.round(h) });
      }
      raf = requestAnimationFrame(render);
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, w, h);
      const still = { x: 0.2, z: 0.4, nx: 0.5, ny: 0.5, strength: 0 };
      if (modeRef.current === 'game') {
        drawMesh(ctx, w, h, 0, still, COLORS.game);
      } else {
        drawSkeleton(ctx, w, h, 0, COLORS.app, still);
      }
    };

    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) drawStatic();
    });
    ro.observe(canvas);
    resize();

    if (reduce) {
      drawStatic();
      setHud({ fps: 0, frame: 0, w: Math.round(w), h: Math.round(h) });
    } else {
      raf = requestAnimationFrame(render);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  const onPointer = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    pointerRef.current = {
      x: px * 2 - 1,
      z: 1 - py,
      nx: px,
      ny: py,
      strength: 1,
    };
  };

  return (
    <div
      data-cursor="soft"
      className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden shadow-[0_0_50px_rgba(99,102,241,0.12)] backdrop-blur-sm"
    >
      {/* sekme çubuğu — kayan pill + sekme değişiminde parçacık patlaması,
          bkz. GooeyTabs.jsx. Aktif sekme burada (`mode`) tutuluyor,
          GooeyTabs kontrollü: kendi doğrusunu üretmiyor. */}
      <GooeyTabs
        className="border-b border-white/8"
        tabs={TABS}
        value={mode}
        onChange={setMode}
        trailing={
          <span className="ml-auto hidden items-center px-4 text-[10px] font-bold tracking-widest text-gray-600 uppercase sm:flex">
            {t.viewport.hint}
          </span>
        }
      />

      {/* canvas — touch-pan-y: `touch-none` mobilde burayı scroll tuzağına
          çeviriyordu (canvas üzerinde parmakla kaydırınca sayfa kımıldamıyordu).
          pan-y ile dikey scroll tarayıcıda kalır, pointer efekti korunur. */}
      <canvas
        ref={canvasRef}
        onPointerMove={onPointer}
        className="block h-[260px] w-full touch-pan-y sm:h-[320px]"
        aria-hidden="true"
      />

      {/* HUD */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-white/8 px-4 py-2.5 text-[10px] font-bold tracking-widest text-gray-600 uppercase">
        <span>
          fps <span className="text-gray-400">{String(hud.fps).padStart(2, '0')}</span>
        </span>
        <span>
          frame <span className="text-gray-400">{String(hud.frame).padStart(5, '0')}</span>
        </span>
        <span className="ml-auto hidden sm:inline">
          {hud.w}×{hud.h}
        </span>
      </div>
    </div>
  );
}
