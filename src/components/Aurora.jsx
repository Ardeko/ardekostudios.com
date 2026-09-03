import { useEffect, useRef, useState } from 'react';

/* ------------------------------------------------------------------
   Aurora — Hero'nun arkasında yavaşça sürüklenen WebGL gradyan.

   Kaynak: 21st.dev "Velaris" (simplex-noise gradient shader). Shader'ın
   matematiği upstream'den; etrafındaki her şey bu projeye göre yeniden
   yazıldı. Upstream'den bilerek ayrıldığımız yerler:

   1. **Palet modül sabiti, prop değil.** Upstream `colors` dizisini prop
      alıp `useEffect` deps'ine koyuyor. Dizi literali her render'da yeni
      referans demek — yani effect her render'da yeniden çalışıp WebGL
      context'ini, shader'ları ve buffer'ı BAŞTAN kuruyordu. Renkler
      siteye özel zaten; sabit olarak burada duruyor, bug tanım gereği
      imkânsız hâle geldi. Prop'lar yalnızca skaler (`strength`, `speed`).
   2. **Shader derleme kontrolü var.** Upstream `compileShader`'ın
      sonucuna hiç bakmıyor; shader patlarsa ekran sessizce siyah kalıyor.
      Burada derleme/link başarısızsa bileşen `null` dönüyor ve sitenin
      kendi `#05070F` zemini olduğu gibi kalıyor — yani en kötü durumda
      "hiçbir şey değişmedi", "hero karardı" değil.
   3. **Kenarlar sayfaya karışıyor.** Upstream vignette'i `col * 0.2` ile
      siyaha çekiyor; hero'nun alt kenarı sayfa zemininden (#05070F) koyu
      kalıp görünür bir bant bırakırdı. Vignette ve alt kenar artık
      doğrudan `u_bg`'ye eriyor, ek bir maske/gradient katmanı gerekmiyor.
   4. **Şiddet ayarlanabilir.** Hero'da zaten iki animasyonlu
      radial-gradient glow ve `Particles` var; upstream'in tam güçteki
      karışımı onların üstüne binince çamur oluyor. `u_strength` bütün
      mix ağırlıklarını tek yerden kısıyor.
   5. **Görsel bütçesi.** bkz. CLAUDE.md. rAF yalnızca hero ekrandayken
      ve sekme öndeyken dönüyor (IntersectionObserver + visibilitychange),
      `prefers-reduced-motion`'da tek kare çizilip duruluyor, render
      ölçeği 0.65 (dokunmatikte 0.5) — bulanık bir gradyan için fark
      edilmez, fragment sayısını üçte bire indirir. Kill switch tek satır:
      aşağıdaki `coarse` kontrolünü erken `return`'e çevir.
   6. **Kurulum ertelenmiş.** Bileşen Preloader ile aynı commit'te mount
      oluyor; shader derleme/link ilk boş ana bırakıldı ve o ana kadar
      canvas DOM'a bile girmiyor. Sayacın boyanmasının önüne geçmesin.
   7. **Context kaybı yakalanıyor.** `webglcontextlost` → rAF durur,
      `webglcontextrestored` → `gen` artar, effect her şeyi yeniden kurar.
      Cleanup'ta `loseContext()` ÇAĞIRMA: StrictMode geliştirmede effect'i
      iki kez çalıştırıyor, ikinci kurulum ölü bir context'e düşerdi.
------------------------------------------------------------------- */

const VERT = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
varying vec2 vUv;

uniform vec2  u_resolution;
uniform float u_time;
uniform float u_grain;
uniform float u_strength;
uniform vec3  u_colors[4];
uniform vec3  u_bg;

vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv = vUv;
  float ratio = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 p = uv - 0.5;
  p.x *= ratio;

  float t = u_time * 0.1;

  float n1 = snoise(p * 0.40 + vec2( t * 0.20, -t * 0.30));
  float n2 = snoise(p * 0.55 + vec2(-t * 0.15,  t * 0.25) + n1 * 0.25);
  float n3 = snoise(p * 0.75 + vec2( t * 0.10, -t * 0.20) + n2 * 0.20);

  vec3 col = u_bg;

  col = mix(col, u_colors[0], smoothstep(-0.2, 0.5, n1)      * 0.85 * u_strength);
  col = mix(col, u_colors[1], smoothstep(-0.1, 0.6, n2)      * 0.70 * u_strength);
  col = mix(col, u_colors[2], smoothstep(-0.3, 0.4, n3)      * 0.60 * u_strength);
  col = mix(col, u_colors[3], smoothstep( 0.0, 0.7, n1 * n2) * 0.50 * u_strength);

  float dist = length(p) * 1.5;
  col += u_colors[1] * smoothstep(0.8, 0.0, dist) * 0.22 * u_strength;

  // Kenarlar sayfaya karışsın: vignette siyaha değil zemine eriyor, alt
  // kenar da ayrıca sönüyor — hero burada bitiyor, altındaki bölüm düz
  // #05070F ve arada bant görünmemeli.
  float vignette = 1.0 - smoothstep(0.3, 1.2, dist);
  float floorFade = smoothstep(0.0, 0.34, uv.y);
  col = mix(u_bg, col, vignette * floorFade);

  // Dither. Koyu zeminde bu genişlikte bir gradyan 8-bit'te şeritlenir;
  // piksel başına yarım birimlik gürültü onu dağıtıyor. Sayfadaki
  // /noise.png film grain'inden ayrı bir iş yapıyor, onunla çakışmıyor.
  float grain = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453 + u_time);
  col += (grain - 0.5) * u_grain * 0.1;

  gl_FragColor = vec4(col, 1.0);
}
`;

// Sitenin paleti: indigo-600 / indigo-400 / purple-600 + zeminin kendisi.
// Dördüncü renk zemin: karışımın bir kısmını geri karartıp gradyanın her
// yeri doldurmasını, hero'nun düz koyu alanlarını yutmasını engelliyor.
const BG = '#05070F';
const COLORS = ['#4F46E5', '#818CF8', '#7C3AED', '#05070F'];
const GRAIN = 0.12;

const hexToRgb = (hex) => {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ];
};

export default function Aurora({ className = '', strength = 0.55, speed = 0.45 }) {
  const canvasRef = useRef(null);
  const [gen, setGen] = useState(0); // context restore → yeniden kurulum
  const [off, setOff] = useState(false); // WebGL yok ya da shader patladı
  const [ready, setReady] = useState(false); // kurulum ertelendi mi

  // Shader derleme + link ana thread'i birkaç ms tutuyor ve bu bileşen
  // Preloader ile AYNI React commit'inde mount oluyor. Sayaç boyanırken
  // araya girmesin diye ilk boş ana kadar bekliyoruz; o ana kadar canvas
  // DOM'a da girmiyor. App.jsx'teki Games chunk prefetch'iyle aynı desen
  // (requestIdleCallback yok → setTimeout, Safari).
  useEffect(() => {
    const start = () => setReady(true);
    const idle = window.requestIdleCallback;
    if (idle) {
      const id = idle(start, { timeout: 1500 });
      return () => window.cancelIdleCallback?.(id);
    }
    const timer = setTimeout(start, 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const opts = {
      // alpha:true bilerek: opak bir canvas ilk draw gelene kadar SİYAH
      // boyanır ve hero'da bir kare kararma olarak görünür. Saydam
      // başlayınca o karede sayfanın kendi #05070F zemini duruyor.
      // Shader zaten her pikselde alpha 1.0 yazıyor, sonrasında opak.
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      // Arka plan katmanı için ayrık GPU uyandırmaya değmez.
      powerPreference: 'low-power',
    };
    const gl = canvas.getContext('webgl', opts) || canvas.getContext('experimental-webgl', opts);
    if (!gl) {
      setOff(true);
      return undefined;
    }

    const compile = (type, src) => {
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.warn('[Aurora] shader derlenmedi:', gl.getShaderInfoLog(sh));
        gl.deleteShader(sh);
        return null;
      }
      return sh;
    };

    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = vs && compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) {
      if (vs) gl.deleteShader(vs);
      setOff(true);
      return undefined;
    }

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn('[Aurora] program linklenmedi:', gl.getProgramInfoLog(program));
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteProgram(program);
      setOff(true);
      return undefined;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, 'u_resolution');
    const uTime = gl.getUniformLocation(program, 'u_time');

    // Sabit uniform'lar bir kez. Upstream bunları her karede yeniden set
    // edip her karede hex→rgb parse ediyordu; hiçbiri kare kare değişmiyor.
    gl.uniform1f(gl.getUniformLocation(program, 'u_grain'), GRAIN);
    gl.uniform1f(gl.getUniformLocation(program, 'u_strength'), strength);
    gl.uniform3fv(gl.getUniformLocation(program, 'u_bg'), new Float32Array(hexToRgb(BG)));
    gl.uniform3fv(
      gl.getUniformLocation(program, 'u_colors[0]'),
      new Float32Array(COLORS.flatMap(hexToRgb))
    );

    const mq = (q) =>
      typeof window.matchMedia === 'function' ? window.matchMedia(q).matches : false;
    const reduce = mq('(prefers-reduced-motion: reduce)');
    const coarse = mq('(pointer: coarse)');

    // Bulanık bir gradyan tam çözünürlük istemiyor. dPR=3 bir iPhone'da
    // 0.5 ölçek, tam çözünürlüğün otuz altıda biri kadar fragment demek.
    const SCALE = coarse ? 0.5 : 0.65;

    const draw = (seconds) => {
      gl.uniform1f(uTime, seconds);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    let clock = 0; // duraklamalarda donan sahne saati
    let last = 0;
    let raf = 0;
    let onScreen = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2) * SCALE;
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width === w && canvas.height === h) return;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
      if (!raf) draw(clock); // durmuşken de yeni boyutta bir kare çiz
    };

    const frame = (now) => {
      if (!last) last = now;
      clock += ((now - last) / 1000) * speed;
      last = now;
      draw(clock);
      raf = requestAnimationFrame(frame);
    };

    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      last = 0; // sonraki başlangıçta zaman sıçramasın
    };

    const sync = () => {
      const shouldRun = onScreen && !document.hidden && !reduce;
      if (shouldRun && !raf) raf = requestAnimationFrame(frame);
      else if (!shouldRun) stop();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    // Hero ekrandan çıkınca kare çizmenin anlamı yok; sayfanın geri kalanı
    // uzun ve kullanıcı orada dolaşırken GPU boşa dönmesin.
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { rootMargin: '120px' }
    );
    io.observe(canvas);

    const onVisibility = () => sync();
    document.addEventListener('visibilitychange', onVisibility);

    const onLost = (e) => {
      e.preventDefault(); // preventDefault olmadan restore olayı hiç gelmez
      stop();
    };
    const onRestored = () => setGen((g) => g + 1);
    canvas.addEventListener('webglcontextlost', onLost);
    canvas.addEventListener('webglcontextrestored', onRestored);

    if (reduce) draw(0);
    else sync();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      // loseContext() YOK — bkz. dosya başı, StrictMode notu.
    };
  }, [gen, ready, strength, speed]);

  if (off || !ready) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
