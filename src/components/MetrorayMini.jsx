import { useEffect, useRef, useState } from 'react';
import {
  createRun,
  step,
  autopilot,
  deliveredCrates,
  totalCrates,
  TRACK,
} from '../lib/metrorayMini';

/* ------------------------------------------------------------------
   Metroray Mini — Viewport'un OYUN sekmesi (2026-11-25).

   Eskiden burada imleçle deforme olan soyut bir wireframe mesh vardı.
   Kullanıcı "daha iyi bir örnek" istedi: stüdyonun gerçekten yaptığı
   bir şey. Bu, geliştirilmekte olan Metroray'ın (yük treni sürüş oyunu,
   ~/Desktop/projects/metroray) çekirdek mekaniğinin oynanabilir bir
   kesiti — oyunun kendisi değil (Phaser + Matter ≈ 1 MB, hero'ya
   girmez), aynı arazi formülü, aynı kanca eşikleri, aynı palet.
   Fizik: lib/metrorayMini.js (DOM'suz, Node'da ayarlandı).

   Tek tuş: basılı tut = gaz, bırak = regülatör (95 üstünde frenler).
   Kimse oynamazken otopilot dikkatli sürer (gösteri modu).

   Görsel dil Metroray'dan birebir (src/render/Palette.js): akşam
   seferi, her şey silüet, tek sıcak ışık kaynağı lokomotifin ateşi.

   Bütçe (CLAUDE.md "Görsel bütçesi"): tek canvas, görsel/asset yok,
   DPR ≤ 2, döngü yalnızca ekran görünür + sekme öndeyken. Reduced-
   motion'da gösteri modu oynamaz; oyun sadece kullanıcı başlatırsa
   hareket eder.
------------------------------------------------------------------- */

const PAL = {
  skyTop: '#1B1B3A',
  skyMid: '#4E2A54',
  skyLow: '#B5495B',
  skyGlow: '#E8833A',
  ridgeFar: '#3B2E52',
  ridgeMid: '#2A2140',
  ridgeNear: '#1A1530',
  ground: '#120D22',
  groundTop: '#2E2447',
  rail: '#6B5890',
  sleeper: '#241C3A',
  train: '#0A0812',
  trainEdge: '#342A52',
  steam: '201, 187, 216',
  crate: '#6B4A2A',
  crateEdge: '#3A2716',
  calm: '#6B5890',
  warn: '#E8A33A',
  danger: '#E2503F',
  ui: '#E9E2F5',
  uiDim: '#8C7FA8',
};

// Tasarım yüksekliği — fizik ve çizim bu birimde. 300: masaüstünde (360px)
// sahne ×1.2 yakın; 360'ta tren karede küçük, gökyüzü boş kalıyordu.
const VH = 300;
const STEP = 1 / 120;
const SEEDS = [7, 3, 11];
const STOP_X = TRACK.length - TRACK.flatEnd + 95; // trenin peronda durduğu yer (≈)
const FONT = '"Inter Variable", Inter, system-ui, sans-serif';

const stressColor = (s) => (s > 0.85 ? PAL.danger : s > 0.5 ? PAL.warn : PAL.calm);

// Metroray Backdrop._ridge — 720 yüksekliğe göre yazılmış; burada yarı
// ölçek (x frekansı ×2, genlik ×0.5).
function ridge(x, layer) {
  const s = 0.001 + layer * 13.7;
  return (
    Math.sin(x * 0.0012 + s) * 30 +
    Math.sin(x * 0.0034 + s * 2.1) * 17 +
    Math.sin(x * 0.0082 + s * 3.3) * 7
  );
}

const RIDGES = [
  { color: PAL.ridgeFar, par: 0.12, base: 0.47, scale: 1.0 },
  { color: PAL.ridgeMid, par: 0.26, base: 0.56, scale: 1.4 },
  { color: PAL.ridgeNear, par: 0.45, base: 0.64, scale: 1.9 },
];

function wheel(ctx, x, y, r, spin) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = PAL.train;
  ctx.fill();
  ctx.strokeStyle = PAL.trainEdge;
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - Math.cos(spin) * r * 0.75, y - Math.sin(spin) * r * 0.75);
  ctx.lineTo(x + Math.cos(spin) * r * 0.75, y + Math.sin(spin) * r * 0.75);
  ctx.stroke();
}

function silhouette(ctx, draw) {
  ctx.beginPath();
  draw();
  ctx.fillStyle = PAL.train;
  ctx.fill();
  ctx.strokeStyle = PAL.trainEdge;
  ctx.lineWidth = 1;
  ctx.stroke();
}

function drawLoco(ctx, car, throttle, t) {
  const spin = car.x / 6;
  silhouette(ctx, () => {
    ctx.rect(-31, -13, 62, 5); // şasi
    ctx.rect(-10, -25, 33, 13); // kazan
    ctx.rect(21, -27, 7, 16); // duman kutusu
    ctx.rect(16, -35, 6, 9); // baca
    ctx.rect(14.5, -37, 9, 2.5); // baca ağzı
    ctx.rect(-31, -33, 21, 21); // kabin
    ctx.rect(-33, -36, 25, 3.5); // kabin çatısı
    ctx.moveTo(28, -9);
    ctx.lineTo(35, -1.5);
    ctx.lineTo(28, -1.5); // mahmuz
  });
  ctx.beginPath();
  ctx.arc(5, -25, 4, Math.PI, 0);
  ctx.fillStyle = PAL.train;
  ctx.fill();
  // Ateş: tek sıcak ışık kaynağı. Gaz arttıkça parlıyor, hafifçe titriyor.
  const flick = 0.8 + 0.2 * Math.sin(t * 23) * Math.sin(t * 7.3);
  const heat = (0.45 + 0.55 * throttle) * flick;
  const g = ctx.createRadialGradient(-20, -18, 1, -20, -18, 22);
  g.addColorStop(0, `rgba(255, 138, 61, ${0.55 * heat})`);
  g.addColorStop(1, 'rgba(255, 138, 61, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(-44, -42, 48, 40);
  ctx.fillStyle = `rgba(255, ${170 + 50 * heat}, ${110 + 60 * heat}, ${0.55 + 0.45 * heat})`;
  ctx.fillRect(-26, -29, 10, 7); // kabin penceresi — ateşin ışığı
  wheel(ctx, -20, -6, 6, spin);
  wheel(ctx, -4, -6, 6, spin);
  wheel(ctx, 12, -6, 6, spin);
  wheel(ctx, 25, -4, 4, spin * 1.5);
}

function drawWagon(ctx, car) {
  const spin = car.x / 5;
  // Sandıklar vagonun içinde, üstten taşıyor.
  for (let k = 0; k < car.crates; k++) {
    const cx = -17 + k * 12;
    ctx.fillStyle = PAL.crate;
    ctx.fillRect(cx, -30, 10, 10);
    ctx.strokeStyle = PAL.crateEdge;
    ctx.lineWidth = 1;
    ctx.strokeRect(cx + 0.5, -29.5, 9, 9);
  }
  silhouette(ctx, () => {
    ctx.rect(-27, -12, 54, 4); // şasi
    ctx.rect(-25, -24, 50, 12); // kasa (üstü açık)
  });
  wheel(ctx, -15, -5, 5, spin);
  wheel(ctx, 15, -5, 5, spin);
}

// Araç dünyada: ray üstünde, eğime göre dönmüş. Yerel noktayı dünyaya çevir.
function toWorld(x, y, a, lx, ly) {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return [x + lx * c - ly * s, y + lx * s + ly * c];
}

export default function MetrorayMini({ labels, observeRef, onFps }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const inputRef = useRef(0);
  const modeRef = useRef('attract');
  const startRef = useRef(() => {});
  const [overlay, setOverlay] = useState({ mode: 'attract' });
  const labelsRef = useRef(labels);

  useEffect(() => {
    labelsRef.current = labels;
  }, [labels]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let s = 1;
    let vw = 0;
    let sky = null;

    const G = {
      run: createRun(SEEDS[0]),
      seedIdx: 0,
      mode: 'attract',
      camX: 0,
      camY: 0,
      acc: 0,
      last: 0,
      puffs: [],
      bits: [],
      shake: 0,
      restartAt: 0,
      best: null,
    };

    // Lokomotifin ekrandaki yeri: geniş ekranda %36 (önü görmek için),
    // dar ekranda tren BÜTÜN görünsün diye ~230 birime kadar sağa kayar
    // (tren ~250 birim; mobilde son vagon kenardan taşıyordu).
    const anchor = () => Math.max(vw * 0.36, Math.min(vw * 0.5, 230));

    const snapCamera = () => {
      const loco = G.run.cars[0];
      G.camX = Math.max(-10, loco.x - anchor());
      G.camY = G.run.terrain.heightAt(loco.x) - VH * 0.66;
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      s = h / VH || 1;
      vw = w / s;
      sky = ctx.createLinearGradient(0, 0, 0, VH);
      sky.addColorStop(0, PAL.skyTop);
      sky.addColorStop(0.55, PAL.skyMid);
      sky.addColorStop(0.8, PAL.skyLow);
      sky.addColorStop(1, PAL.skyGlow);
      snapCamera();
    };

    const newRun = (mode) => {
      G.seedIdx = (G.seedIdx + 1) % SEEDS.length;
      G.run = createRun(SEEDS[G.seedIdx]);
      G.mode = mode;
      modeRef.current = mode;
      G.puffs.length = 0;
      G.bits.length = 0;
      G.acc = 0;
      snapCamera();
    };

    startRef.current = () => {
      newRun('play');
      setOverlay({ mode: 'play' });
      if (!raf) loop();
    };

    // ---------------- güncelleme ----------------
    const update = (dt, now) => {
      const run = G.run;
      G.acc += dt;
      let n = 0;
      while (G.acc >= STEP && n < 10) {
        const input = G.mode === 'play' ? inputRef.current : G.mode === 'attract' ? autopilot(run) : 0;
        step(run, input, STEP);
        G.acc -= STEP;
        n++;
      }
      if (n === 10) G.acc = 0;

      for (const e of run.events) {
        if (e.type === 'spill') {
          const c = run.cars[e.car];
          const y = run.terrain.heightAt(c.x) - 30;
          G.bits.push({ kind: 'crate', x: c.x, y, vx: c.v * 0.55 + 20, vy: -150 - Math.random() * 70, r: 0, vr: (Math.random() - 0.5) * 12, life: 2.2 });
        } else if (e.type === 'snap') {
          G.shake = 0.35;
          const y = run.terrain.heightAt(e.x) - 10;
          for (let k = 0; k < 10; k++) {
            G.bits.push({ kind: 'spark', x: e.x, y, vx: (Math.random() - 0.5) * 160, vy: -60 - Math.random() * 120, life: 0.5 + Math.random() * 0.3 });
          }
        }
      }
      run.events.length = 0;

      if (run.finished) {
        if (G.mode === 'play') {
          G.mode = 'result';
          modeRef.current = 'result';
          const delivered = deliveredCrates(run);
          const time = run.time;
          const better = !G.best || delivered > G.best.delivered || (delivered === G.best.delivered && time < G.best.time);
          if (better) G.best = { delivered, time };
          setOverlay({ mode: 'result', delivered, total: totalCrates(), time, best: G.best, isBest: better });
        } else if (G.mode === 'attract') {
          if (!G.restartAt) G.restartAt = now + 1400;
          else if (now >= G.restartAt) {
            G.restartAt = 0;
            newRun('attract');
          }
        }
      }

      // Kamera: lokomotifi sol üçte birde tut, dikeyde yumuşak izle.
      const loco = run.cars[0];
      const tx = Math.max(-10, loco.x - anchor());
      const ty = run.terrain.heightAt(loco.x) - VH * 0.66;
      const k = Math.min(1, dt * 3.2);
      G.camX += (tx - G.camX) * k;
      G.camY += (ty - G.camY) * Math.min(1, dt * 2.2);
      G.shake = Math.max(0, G.shake - dt);

      // Buhar: gaz arttıkça sık ve iri.
      const a = Math.atan(run.terrain.slopeAt(loco.x));
      if (Math.random() < dt * (2 + run.throttle * 16)) {
        const [px, py] = toWorld(loco.x, run.terrain.heightAt(loco.x), a, 19, -38);
        G.puffs.push({ x: px, y: py, r: 3 + run.throttle * 2, vx: -12 - Math.random() * 10, vy: -26 - Math.random() * 14, life: 1, max: 1.1 + Math.random() * 0.6 });
      }
      for (const p of G.puffs) {
        p.life -= dt / p.max;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.r += dt * 9;
      }
      G.puffs = G.puffs.filter((p) => p.life > 0).slice(-40);

      for (const b of G.bits) {
        b.life -= dt;
        b.vy += 520 * dt;
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        if (b.kind === 'crate') {
          b.r += b.vr * dt;
          const gy = run.terrain.heightAt(b.x) - 5;
          if (b.y > gy) {
            b.y = gy;
            b.vy *= -0.3;
            b.vx *= 0.6;
            b.vr *= 0.5;
          }
        }
      }
      G.bits = G.bits.filter((b) => b.life > 0);
    };

    // ---------------- çizim ----------------
    const draw = (t) => {
      const run = G.run;
      const T = run.terrain;
      ctx.setTransform(dpr * s, 0, 0, dpr * s, 0, 0);

      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, vw, VH);

      // Güneş — ufka yakın, sabit.
      const sx = vw * 0.74;
      const sy = VH * 0.5;
      ctx.fillStyle = 'rgba(246, 193, 119, 0.16)';
      ctx.beginPath();
      ctx.arc(sx, sy, VH * 0.11, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(246, 193, 119, 0.85)';
      ctx.beginPath();
      ctx.arc(sx, sy, VH * 0.045, 0, Math.PI * 2);
      ctx.fill();

      // Parallax sıradağlar (Metroray Backdrop).
      const camYRel = G.camY - (T.startY - VH * 0.66);
      RIDGES.forEach((L, li) => {
        ctx.fillStyle = L.color;
        ctx.beginPath();
        ctx.moveTo(-10, VH + 10);
        const yb = VH * L.base - camYRel * L.par;
        for (let x = -20; x <= vw + 20; x += 16) {
          ctx.lineTo(x, yb + ridge(x + G.camX * L.par, li) * L.scale);
        }
        ctx.lineTo(vw + 10, VH + 10);
        ctx.closePath();
        ctx.fill();
      });

      const shake = G.shake > 0 ? (Math.random() - 0.5) * 6 * G.shake : 0;
      ctx.save();
      ctx.translate(-G.camX + shake, -G.camY + shake * 0.5);

      // Arazi — çizim ve fizik aynı fonksiyondan (Metroray kuralı #4).
      const x0 = Math.floor((G.camX - 30) / 6) * 6;
      const x1 = G.camX + vw + 30;
      const bottom = G.camY + VH + 30;
      ctx.beginPath();
      ctx.moveTo(x0, bottom);
      for (let x = x0; x <= x1; x += 6) ctx.lineTo(x, T.heightAt(x));
      ctx.lineTo(x1, bottom);
      ctx.closePath();
      ctx.fillStyle = PAL.ground;
      ctx.fill();

      ctx.beginPath();
      for (let x = x0; x <= x1; x += 6) {
        const y = T.heightAt(x) + 2;
        if (x === x0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = PAL.groundTop;
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = PAL.sleeper;
      for (let x = Math.ceil(x0 / 11) * 11; x <= x1; x += 11) {
        ctx.fillRect(x - 3, T.heightAt(x) - 1, 6, 3);
      }
      ctx.beginPath();
      for (let x = x0; x <= x1; x += 6) {
        const y = T.heightAt(x) - 1;
        if (x === x0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = PAL.rail;
      ctx.lineWidth = 1.6;
      ctx.stroke();

      // İstasyon: peron, bina, fener — varış hedefi.
      if (x1 > STOP_X - 260) {
        const py = T.endY;
        ctx.fillStyle = PAL.train;
        ctx.fillRect(STOP_X - 150, py - 7, 210, 7);
        silhouette(ctx, () => {
          ctx.rect(STOP_X + 70, py - 46, 58, 46);
          ctx.moveTo(STOP_X + 64, py - 46);
          ctx.lineTo(STOP_X + 99, py - 66);
          ctx.lineTo(STOP_X + 134, py - 46);
        });
        ctx.fillStyle = 'rgba(255, 196, 120, 0.9)';
        ctx.fillRect(STOP_X + 82, py - 34, 10, 12);
        ctx.fillRect(STOP_X + 106, py - 34, 10, 12);
        ctx.fillStyle = PAL.train;
        ctx.fillRect(STOP_X - 158, py - 58, 3, 51);
        const lg = ctx.createRadialGradient(STOP_X - 156, py - 58, 1, STOP_X - 156, py - 58, 26);
        lg.addColorStop(0, 'rgba(255, 196, 120, 0.7)');
        lg.addColorStop(1, 'rgba(255, 196, 120, 0)');
        ctx.fillStyle = lg;
        ctx.fillRect(STOP_X - 184, py - 86, 56, 56);
      }

      // Buhar (trenin arkasında kalsın diye önce).
      for (const p of G.puffs) {
        ctx.fillStyle = `rgba(${PAL.steam}, ${0.32 * p.life})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Kancalar: araçların arasında, gerginliğe göre renkli.
      const pose = run.cars.map((c) => {
        const y = T.heightAt(c.x);
        return { x: c.x, y, a: Math.atan(T.slopeAt(c.x)) };
      });
      run.couplers.forEach((cp, i) => {
        if (cp.broken) return;
        const A = pose[i];
        const B = pose[i + 1];
        const [ax, ay] = toWorld(A.x, A.y, A.a, -run.cars[i].len / 2, -10);
        const [bx, by] = toWorld(B.x, B.y, B.a, run.cars[i + 1].len / 2, -10);
        ctx.strokeStyle = stressColor(cp.stress);
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();
      });

      for (let i = run.cars.length - 1; i >= 0; i--) {
        const c = run.cars[i];
        const P = pose[i];
        ctx.save();
        ctx.translate(P.x, P.y);
        ctx.rotate(P.a);
        if (c.kind === 'loco') drawLoco(ctx, c, run.throttle, t);
        else drawWagon(ctx, c);
        ctx.restore();
      }

      for (const b of G.bits) {
        if (b.kind === 'crate') {
          ctx.save();
          ctx.translate(b.x, b.y);
          ctx.rotate(b.r);
          ctx.globalAlpha = Math.min(1, b.life);
          ctx.fillStyle = PAL.crate;
          ctx.fillRect(-5, -5, 10, 10);
          ctx.strokeStyle = PAL.crateEdge;
          ctx.strokeRect(-4.5, -4.5, 9, 9);
          ctx.restore();
        } else {
          ctx.fillStyle = `rgba(255, 170, 90, ${Math.min(1, b.life * 2)})`;
          ctx.fillRect(b.x - 1, b.y - 1, 2, 2);
        }
      }
      ctx.globalAlpha = 1;
      ctx.restore();

      // ---------------- HUD — CSS pikselinde (mobilde de okunur) ----------------
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const L = labelsRef.current;
      const pad = 14;
      // Varış çubuğu
      const prog = Math.max(0, Math.min(1, (run.cars[0].x - 250) / (STOP_X - 250)));
      ctx.fillStyle = 'rgba(233, 226, 245, 0.16)';
      ctx.fillRect(pad, pad, w - pad * 2, 2);
      ctx.fillStyle = '#FF8A3D';
      ctx.fillRect(pad, pad, (w - pad * 2) * prog, 2);
      ctx.beginPath();
      ctx.arc(pad + (w - pad * 2) * prog, pad + 1, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = PAL.ui;
      ctx.fillRect(w - pad - 1, pad - 4, 2, 10);

      ctx.font = `800 9px ${FONT}`;
      ctx.textBaseline = 'top';
      ctx.fillStyle = PAL.uiDim;
      ctx.textAlign = 'left';
      ctx.fillText(L.cargo, pad, pad + 12);
      let cx = pad;
      const total = totalCrates();
      let left = 0;
      run.cars.forEach((c) => (left += c.crates));
      for (let k = 0; k < total; k++) {
        const on = k < left;
        ctx.fillStyle = on ? PAL.crate : 'rgba(233, 226, 245, 0.12)';
        ctx.fillRect(cx, pad + 25, 7, 7);
        cx += 9;
      }

      ctx.textAlign = 'right';
      ctx.fillStyle = PAL.uiDim;
      ctx.fillText(L.coupler, w - pad, pad + 12);
      for (let i = 0; i < run.couplers.length; i++) {
        const cp = run.couplers[run.couplers.length - 1 - i];
        const x = w - pad - 14 - i * 17;
        ctx.fillStyle = cp.broken ? 'rgba(226, 80, 63, 0.35)' : stressColor(cp.stress);
        ctx.fillRect(x, pad + 26, 14, 5);
        ctx.fillStyle = 'rgba(10, 8, 18, 0.55)';
        ctx.fillRect(x, pad + 26, 14 * (1 - (cp.broken ? 0 : cp.health)), 5);
      }
      ctx.textAlign = 'left';
    };

    // ---------------- döngü ----------------
    let raf = 0;
    let onScreen = true;
    let fps = 60;
    let fpsT = 0;
    let t = 0;

    const frame = (now) => {
      const dt = Math.min(0.05, (now - (G.last || now)) / 1000);
      G.last = now;
      t += dt;
      if (dt > 0) fps = fps * 0.92 + (1 / dt) * 0.08;
      update(dt, now);
      draw(t);
      if (now - fpsT > 500) {
        fpsT = now;
        onFps?.(Math.round(fps));
      }
      // Reduced-motion: gösteri modu hareket etmez; oyuncunun başlattığı
      // sefer biter bitmez döngü durur.
      if (reduce && G.mode !== 'play') {
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    const loop = () => {
      if (raf || !onScreen || document.visibilityState !== 'visible') return;
      G.last = 0;
      raf = requestAnimationFrame(frame);
    };
    const halt = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const ro = new ResizeObserver(() => {
      resize();
      if (!raf) draw(t);
    });
    ro.observe(canvas);
    resize();
    draw(0);

    const target = observeRef?.current || canvas;
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      if (onScreen && !reduce) loop();
      else if (!onScreen) halt();
    });
    io.observe(target);
    const onVis = () => (document.visibilityState === 'visible' && !reduce ? loop() : halt());
    document.addEventListener('visibilitychange', onVis);

    if (!reduce) loop();

    return () => {
      halt();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [observeRef, onFps]);

  // ---------------- girdi ----------------
  // Oyun dışındayken (gösteri/sonuç) basış hemen başlatmaz: dokunmatikte
  // canvas üzerinden sayfayı kaydırmak isteyen parmak da pointerdown
  // atıyor. 140 ms basılı kalırsa ya da kısa bir dokunuşla bırakılırsa
  // (pointerup) başlar; kaydırma ise pointercancel olur ve hiçbir şey
  // olmaz. Oyun içindeyken gaz gecikmesiz.
  const press = () => {
    let started = modeRef.current === 'play';
    let timer = 0;
    const begin = () => {
      if (!started) {
        startRef.current();
        started = true;
      }
      inputRef.current = 1;
    };
    if (started) begin();
    else timer = setTimeout(begin, 140);
    const end = (ev) => {
      clearTimeout(timer);
      window.removeEventListener('pointerup', end);
      window.removeEventListener('pointercancel', end);
      if (ev.type === 'pointerup' && !started) startRef.current();
      inputRef.current = 0;
    };
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);
  };

  const KEYS = ['Space', 'ArrowRight', 'ArrowUp', 'KeyD', 'KeyW', 'Enter'];
  const onKeyDown = (e) => {
    if (!KEYS.includes(e.code)) return;
    e.preventDefault();
    if (e.repeat) return;
    if (modeRef.current !== 'play') startRef.current();
    inputRef.current = 1;
  };
  const onKeyUp = (e) => {
    if (!KEYS.includes(e.code)) return;
    e.preventDefault();
    inputRef.current = 0;
  };

  const fmtTime = (s) => s.toFixed(1).replace('.', labels.decimal);

  return (
    <div
      ref={wrapRef}
      role="application"
      tabIndex={0}
      aria-label={labels.aria}
      onPointerDown={press}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      onContextMenu={(e) => e.preventDefault()}
      className="relative h-full w-full cursor-pointer touch-pan-y select-none outline-none [-webkit-touch-callout:none] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-400/70"
    >
      <canvas ref={canvasRef} className="block h-full w-full" aria-hidden="true" />

      {/* Katmanlar tıklamayı yutmaz — basılan her yer gaz. */}
      <div className="pointer-events-none absolute inset-0 flex items-end justify-center p-4 sm:p-5">
        {overlay.mode === 'attract' && (
          <div className="lg flex items-center gap-3 rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="adk-ping absolute inset-0 rounded-full bg-orange-400" />
              <span className="relative h-2 w-2 rounded-full bg-orange-400" />
            </span>
            {labels.cta}
          </div>
        )}
        {overlay.mode === 'play' && (
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">{labels.hint}</p>
        )}
        {overlay.mode === 'result' && (
          <div className="lg absolute left-1/2 top-1/2 w-[min(88%,320px)] -translate-x-1/2 -translate-y-1/2 rounded-card bg-[#0A0812]/85 px-6 py-5 text-center">
            <p className="text-[10px] font-black uppercase tracking-label text-orange-300">
              {overlay.delivered === overlay.total ? labels.perfect : labels.arrived}
            </p>
            <p className="mt-2 text-3xl font-black tracking-tight text-white tabular-nums">
              {overlay.delivered}/{overlay.total}
              <span className="ml-2 text-sm font-bold text-gray-400">{labels.crates}</span>
            </p>
            <p className="mt-1 text-xs font-bold tabular-nums text-gray-300">
              {fmtTime(overlay.time)} {labels.seconds}
              {overlay.best && !overlay.isBest && (
                <span className="text-gray-400">
                  {' '}· {labels.best} {overlay.best.delivered}/{overlay.total} — {fmtTime(overlay.best.time)} {labels.seconds}
                </span>
              )}
            </p>
            <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-gray-400">{labels.again}</p>
          </div>
        )}
      </div>
    </div>
  );
}
