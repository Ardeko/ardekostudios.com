/* ------------------------------------------------------------------
   Metroray Mini — fizik çekirdeği (DOM yok, saf; Node'da test edilir).

   Metroray (~/Desktop/projects/metroray) stüdyonun geliştirmekte olduğu
   yük treni oyunu: Phaser 3 + Matter.js. Bu dosya onun ÇEKİRDEK
   mekaniğinin hero'ya sığan, bağımlılıksız bir kesiti:

     "Sürmek kolay, treni bir arada tutmak zor."
     · Kanca gerginliği — yokuşta sert gaz kancayı gerer; eşik aşılınca
       kanca yıpranır, sıfırlanınca kopar ve arkası geride kalır.
     · Yük dökülmesi — tepeyi hızlı geçersen sandıklar uçar.

   Gerçek oyundan doğrudan alınanlar (bilerek aynı):
     · Arazi formülü (TerrainGenerator.raw — üç harmonik, eğim bütçesi
       `freq × (1.88×amp + 5.5×rough)`), mulberry32 seed, düz başlangıç/
       varış ve aralarındaki smoothstep geçiş bandı.
     · Kanca modeli: stress = gerilme / esneme aralığı, 0.62 üstü
       yıpranma (0.9/sn), 1.55 anında kopma, düşük gerginlikte yavaş
       toparlanma (0.1/sn) — GameConfig.COUPLER ile aynı eşikler.
   Sadeleştirilenler: Matter'ın katı gövdeleri yerine ray boyunca 1B
   model (her araç bir x konumu + hız), kancalar yay-sönümleyici.
   Yük fiziği yerine tepe eğriliği × hız² > yerçekimi testi.

   Birimler "tasarım pikseli": görünüm 360 birim yükseklik, çizim
   bunu canvas'a ölçekliyor. Fizik ekran çözünürlüğünden bağımsız.
------------------------------------------------------------------- */

export const TRACK = {
  length: 2600,
  flatStart: 330,
  flatEnd: 300,
  band: 220,
  baseY: 248,
  amp: 22,
  freq: 0.0058,
  rough: 3,
};

/* Ayar notu (tests: scratchpad tune.mjs — dikkatli sürücü kopmadan
   bitirir, sürekli tam gaz kanca koparır/yük döker):
   · Bırakmak FREN DEĞİL, serbest yuvarlanma. Sabit hızla yokuş
     çıkarken kanca kuvveti fizik gereği vagonların ağırlık bileşenine
     eşit — gazla oynayarak azaltılamaz. Tek yol momentum: vadide hız
     topla, yokuşu boşta tırman, gazı sadece tepeye yakın ver. Tepeye
     hızlı varırsan yük uçar. Metroray'ın kendi döngüsü bu.
   · Çekiş düşük hızda en güçlü (gerçek lokomotif çekiş eğrisi); yani
     yavaşlamış trene yokuşta tam gaz = kancaya en büyük yük. */
export const PHYS = {
  g: 320, // birim/sn²
  traction: 400, // lokomotif çekiş ivmesi (lokomotif kütlesine göre), v=0'da
  vmax: 170, // çekişin sıfırlandığı hız
  brake: 90, // istasyonda durma + regülatör freni
  governor: 95, // gaz bırakılınca tren bu hızın üstünde kendini frenler
  roll: 0.05, // yuvarlanma direnci
  k: 260, // kanca yay sertliği
  d: 30, // kanca sönümü (≈0.75 kritik — boşluk oyunu görünsün ama salınmasın)
  gap: 7, // tamponlar arası dinlenme boşluğu
  stretchRange: 1.6, // stress 1.0 = bu kadar gerilme (dik yokuşta tam gaz ≈ 0.97)
  warnStress: 0.62,
  hardBreak: 1.55,
  wearRate: 2.6, // Metroray 0.9 — mini sefer ~25 sn, ritim sıkıştırıldı
  healRate: 0.12,
  spillLift: 0.16, // tepe kaldırması (v²·eğrilik) g'nin bu oranını aşınca sandık uçar
  spillCooldown: 0.4,
  throttleRate: 3.2, // gaz tepkisi (1/sn) — ani tam gaz kancayı sarsmasın
};

export const CARS = [
  { kind: 'loco', len: 64, mass: 2.4 },
  { kind: 'wagon', len: 54, mass: 1, crates: 3 },
  { kind: 'wagon', len: 54, mass: 1, crates: 3 },
  { kind: 'wagon', len: 54, mass: 1, crates: 3 },
];
const CRATE_MASS = 0.12;
const START_SPEED = 62;

/** Deterministik PRNG — Metroray TerrainGenerator ile aynı. */
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function rnd() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const smooth = (t) => t * t * (3 - 2 * t);
const clamp01 = (t) => Math.max(0, Math.min(1, t));

export function makeTerrain(seed = 7) {
  const T = TRACK;
  const rnd = mulberry32(seed);
  const p1 = rnd() * Math.PI * 2;
  const p2 = rnd() * Math.PI * 2;
  const p3 = rnd() * Math.PI * 2;
  const raw = (x) =>
    T.baseY -
    (T.amp * Math.sin(x * T.freq + p1) +
      T.amp * 0.4 * Math.sin(x * T.freq * 2.2 + p2) +
      T.rough * Math.sin(x * T.freq * 5.5 + p3));
  const endX = T.length - T.flatEnd;
  const startY = raw(T.flatStart);
  const endY = raw(endX);

  const heightAt = (x) => {
    if (x <= T.flatStart) return startY;
    if (x >= endX) return endY;
    let y = raw(x);
    if (x < T.flatStart + T.band) {
      const t = smooth(clamp01((x - T.flatStart) / T.band));
      y = startY + (y - startY) * t;
    }
    if (x > endX - T.band) {
      const t = smooth(clamp01((endX - x) / T.band));
      y = endY + (y - endY) * t;
    }
    return y;
  };
  const slopeAt = (x) => (heightAt(x + 4) - heightAt(x - 4)) / 8;
  // İkinci türev — ekran koordinatında (y aşağı) tepe noktasında POZİTİF.
  const curvAt = (x) => (heightAt(x + 10) - 2 * heightAt(x) + heightAt(x - 10)) / 100;
  return { heightAt, slopeAt, curvAt, endX, startY, endY };
}

export function totalCrates() {
  return CARS.reduce((n, c) => n + (c.crates || 0), 0);
}

/** Yeni sefer. Lokomotif en önde; araçlar geriye doğru diziliyor. */
export function createRun(seed = 7) {
  const terrain = makeTerrain(seed);
  const cars = [];
  // Lokomotif 250'de: tren ~190 birim uzun, son vagon x≥20 sınırının
  // içinde başlamalı (yoksa sınıra kenetlenip kancayı ezer, tren fırlar).
  let x = 250;
  CARS.forEach((spec, i) => {
    if (i > 0) x -= CARS[i - 1].len / 2 + PHYS.gap + spec.len / 2;
    cars.push({
      kind: spec.kind,
      len: spec.len,
      baseMass: spec.mass,
      crates: spec.crates || 0,
      x,
      // Tren sahneye yuvarlanarak giriyor: duran treni kaldırmak kancaya
      // en büyük darbeyi (boşluk oyunu) vuruyordu ve herkesin ilk saniyesi
      // kancanın yarısını yiyordu — öğretmeden cezalandırmak.
      v: START_SPEED,
      cooldown: 0,
    });
  });
  const couplers = cars.slice(1).map(() => ({ stress: 0, health: 1, broken: false, peak: 0 }));
  return {
    seed,
    terrain,
    cars,
    couplers,
    throttle: 0,
    time: 0,
    arriving: false,
    finished: false,
    events: [], // { type: 'snap'|'spill'|'finish', ... } — çizim katmanı tüketir
  };
}

const restOf = (cars, i) => cars[i].len / 2 + PHYS.gap + cars[i + 1].len / 2;
const massOf = (c) => c.baseMass + c.crates * CRATE_MASS;

/** Lokomotife hâlâ bağlı mı (araya kopmuş kanca girmemiş mi)? */
export function attachedCount(run) {
  let n = 1;
  for (let i = 0; i < run.couplers.length; i++) {
    if (run.couplers[i].broken) break;
    n++;
  }
  return n;
}

export function deliveredCrates(run) {
  const n = attachedCount(run);
  let c = 0;
  for (let i = 0; i < n; i++) c += run.cars[i].crates;
  return c;
}

/**
 * Bir sabit adım. `input` 0/1 (basılı tut = gaz, bırak = fren).
 * dt sabit (1/120) — değişken dt yay-sönüm sisteminde patlar.
 */
export function step(run, input, dt = 1 / 120) {
  if (run.finished) return;
  const P = PHYS;
  const { cars, couplers, terrain } = run;
  run.time += dt;
  if (run.arriving) input = 0;
  run.throttle += ((input ? 1 : 0) - run.throttle) * Math.min(1, dt * P.throttleRate);
  const attached = attachedCount(run);

  const acc = new Array(cars.length).fill(0);

  for (let i = 0; i < cars.length; i++) {
    const c = cars[i];
    const m = massOf(c);
    const s = terrain.slopeAt(c.x);
    acc[i] += (P.g * s) / Math.sqrt(1 + s * s); // yerçekimi ray boyunca
    acc[i] -= P.roll * c.v;
    if (i === 0) {
      const fade = Math.max(0, 1 - Math.max(0, c.v) / P.vmax);
      acc[i] += (run.throttle * P.traction * fade * CARS[0].mass) / m;
    }
    // Frenler yalnızca lokomotife bağlı araçlarda (kopan kısım frensiz
    // yuvarlanır — kopmanın bedeli geri kayan vagonlar):
    //  · istasyona girince tam fren,
    //  · gaz bırakılmışken regülatör: hız `governor`ü aşarsa yumuşak fren.
    //    Tek tuşla hız kontrolü bu — "bırak" yokuş aşağı da işe yarıyor.
    if (i < attached && Math.abs(c.v) > 0.5) {
      if (run.arriving) acc[i] -= Math.sign(c.v) * P.brake;
      else if (input === 0 && c.v > P.governor) acc[i] -= P.brake * Math.min(1, (c.v - P.governor) / 12);
    }
  }

  for (let i = 0; i < couplers.length; i++) {
    const a = cars[i];
    const b = cars[i + 1];
    const cp = couplers[i];
    const rest = restOf(cars, i);
    const dist = a.x - b.x;
    if (cp.broken) {
      // Kopuk: sadece tampon çarpışması (iç içe geçmesinler).
      if (dist < rest - P.gap) {
        const ma = massOf(a);
        const mb = massOf(b);
        const vAvg = (a.v * ma + b.v * mb) / (ma + mb);
        a.v = vAvg;
        b.v = vAvg;
        const push = (rest - P.gap - dist) / 2;
        a.x += push;
        b.x -= push;
      }
      cp.stress = 0;
      continue;
    }
    const stretch = dist - rest;
    const f = P.k * stretch + P.d * (a.v - b.v);
    acc[i] -= f / massOf(a);
    acc[i + 1] += f / massOf(b);
    cp.stress = Math.max(0, stretch) / P.stretchRange;
    cp.peak = Math.max(cp.peak * 0.995, cp.stress);
    if (cp.stress > P.hardBreak) {
      cp.health = 0;
    } else if (cp.stress > P.warnStress) {
      cp.health -= (cp.stress - P.warnStress) * P.wearRate * dt;
    } else {
      cp.health = Math.min(1, cp.health + P.healRate * dt);
    }
    if (cp.health <= 0) {
      cp.broken = true;
      run.events.push({ type: 'snap', index: i, x: (a.x + b.x) / 2 });
    }
  }

  for (let i = 0; i < cars.length; i++) {
    const c = cars[i];
    c.v += acc[i] * dt;
    c.x += c.v * dt;
    if (c.x < 20) {
      c.x = 20;
      c.v = Math.max(0, c.v);
    }
    // Tepe kaldırması: v² × eğrilik yerçekimini zorlarsa sandık uçar.
    c.cooldown = Math.max(0, c.cooldown - dt);
    if (c.crates > 0 && c.cooldown === 0) {
      const lift = c.v * c.v * terrain.curvAt(c.x);
      if (lift > P.g * P.spillLift) {
        c.crates -= 1;
        c.cooldown = P.spillCooldown;
        run.events.push({ type: 'spill', car: i, x: c.x, v: c.v });
      }
    }
  }

  // İstasyon: son düzlüğe girince gaz kesilir, tren peronda durur.
  if (!run.arriving && cars[0].x >= TRACK.length - TRACK.flatEnd + 40) run.arriving = true;
  if (run.arriving && Math.abs(cars[0].v) < 2) {
    run.finished = true;
    run.events.push({ type: 'finish' });
  }
}

/** Gösteri modu sürücüsü — kimse oynamazken treni dikkatli sürer:
 *  tepe yaklaşırken gazı keser, yokuşta kanca kızarınca bırakır. */
export function autopilot(run) {
  if (run.arriving) return 0;
  const loco = run.cars[0];
  const T = run.terrain;
  const maxStress = Math.max(0, ...run.couplers.map((c) => (c.broken ? 0 : c.stress)));
  // Önümüzdeki 140 birimde tepe var mı (eğrilik pozitif ve belirgin)?
  let crest = 0;
  for (let dx = 20; dx <= 140; dx += 20) crest = Math.max(crest, T.curvAt(loco.x + dx));
  // Önümüz yokuşsa momentumla çık: yalnızca durma tehlikesinde gaz.
  let climb = 0;
  for (let dx = 0; dx <= 60; dx += 20) climb = Math.min(climb, T.slopeAt(loco.x + dx));
  const target = crest > 0.0018 ? 55 : climb < -0.08 ? 38 : 88;
  return loco.v < target && maxStress < 0.55 ? 1 : 0;
}
