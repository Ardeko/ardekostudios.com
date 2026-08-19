# Ardeko Studios — proje bağlamı

Bu dosya repo kökünde durur ve Claude Code her oturumda otomatik okur.
Yeni kararlar aldıkça buraya ekle; sohbet geçmişi kaybolur, bu dosya kalmaz.

## Proje

`ardekostudios.com` — Ardeko Studios'un kendi sitesi. GitHub'daki gerçek
canlı repo: `github.com/Ardeko/ardekostudios.com` (bu çalışma kopyasıyla
aynı git geçmişi). Stüdyo **oyun ve mobil uygulama** geliştiriyor.

## ⚠️ Tasarım kararı (2026-08-18)

2026-08 başında site tamamen minimalist/editoryal bir tasarıma geçirildi
(tek sütun, `void`/`panel` renk token'ları, Unbounded/Manrope/JetBrains,
kart yok/gölge yok, bilingual `i18n.js`). Kullanıcı bunu **reddetti** —
"eski site çok daha iyiydi" diyip klasik/maksimalist tasarıma tam geri
dönüş istedi. O redesign'ın tüm dosyaları (`App.jsx`, `i18n.js`,
`index.css`, `index.html`, `tailwind.config.js`, tüm bileşenler) `git
checkout HEAD` ile eski commit'ten geri yüklendi ve `i18n.js` silindi.
**Yeni bir "minimalist redesign" denemesi başlatmadan önce bu geçmişi
bil — kullanıcı bir kez bunu istemedi.**

Şu an canonical olan: koyu indigo/mor (`#05070F` zemin, `indigo-400/500/600`,
`purple-600` vurgular), yuvarlak köşeli camsı kartlar (`rounded-2xl`,
`bg-white/[0.02-0.05]`, `border-white/8-10`), glow/blur efektler,
`font-black`/`tracking-widest`/`uppercase` etiketler, emoji ikonlar
(About.jsx'teki değer kartları gibi), sabit sol sidebar nav (`Navbar.jsx`),
`CustomCursor`, `Preloader`. Site **TR + EN** bilingual — bkz. i18n bölümü.

## i18n (2026-08-18'de eklendi)

`src/lib/i18n-content.js` — tüm TR/EN metin (Hero, Viewport, About, Games,
Contact, Footer). `src/lib/i18n.jsx` — `LanguageProvider` + `useLang()`
context/hook (içerik ayrı dosyada, react-refresh sadece component/hook
export eden dosyaları sever). `App.jsx` her şeyi `<LanguageProvider>` ile
sarıyor. Her bileşen `const { t } = useLang()` çekip `t.section.key` okur.

Nav etiketleri (GAMES/ABOUT/CONTACT), kurucu adı, "FOUNDER", App Store /
Google Play, "Made with ♥ in Istanbul" gibi zaten İngilizce/marka olan
şeyler bilerek `CONTENT` dışında — bileşenin kendi içinde sabit, iki dilde
de aynı. Dil tercihi `localStorage` (`ardeko-lang`) ile kalıcı, varsayılan
`tr`, `document.documentElement.lang` ile senkron.

**`src/components/LanguageSwitch.jsx`** — dil değiştirici. Standart bir
dropdown/bayrak değil: TR/EN her zaman görünür bir capsule'da, aktif
olanın altında spring fizikle kayan bir glow nokta (Navbar'daki
`active-bar`/`active-dot` ile aynı motion dili), tıklayınca merkezden
dışa patlayan bir "radar ping" halkası, ve yanında her değişimde
scramble-decode olan bir dil kodu (`TR`/`EN`) — Hero'daki
`TypewriterWords` ile aynı "kod çözülüyor" hissi. Navbar'da hem masaüstü
sidebar'da (logo altında) hem mobil header'da (hamburger'in solunda) var.

## Stack

- React 19 + Vite 8
- Tailwind **v4** (PostCSS üzerinden, `@tailwindcss/postcss`)
- framer-motion 12, lucide-react, lenis (SmoothScroll için)
- Düz JSX, TypeScript yok, shadcn/ui kurulu değil

`tailwind.config.js` var ama v4'te `index.css` bir `@config` direktifiyle
bağlamadığı sürece okunmaz — pratikte etkisiz, sadece legacy. Gerçek
tema `src/index.css` içinde: birkaç `@theme` rengi (indigo/emerald/purple
tonları) + çoğu stil doğrudan Tailwind'in varsayılan paletiyle
(`bg-indigo-600`, `text-gray-400` vb.) satır içi yazılıyor.

## Bileşen ağacı (App.jsx)

`CustomCursor` → `Navbar` (sabit sol sidebar, `lg:pl-64` ile içerik
kaydırılıyor) → `main`: `Hero` → `Games` → `About` → `Contact` → `Footer`.
`SmoothScroll`/`lenis` ve `scrollVelocity.js` scroll hızını `Marquee`'ye
besliyor (şu an Marquee hiçbir yerde render edilmiyor — kullanılmıyor
ama silinmedi, eski koddan kalma).

### `src/components/Viewport.jsx` — Hero'ya eklenen imza öğesi

Minimalist redesign'dan kalan tek parça, bilinçli olarak tutuldu ve eski
tasarıma göre yeniden derlendi (indigo/emerald renk, `rounded-2xl` camsı
kart, `font-black`/`tracking-widest` etiketler — artık `t` prop'una ya da
i18n'e bağımlı değil, string'ler dosyanın içinde sabit).

`Hero.jsx` içinde CTA butonlarının altında, STATS satırının üstünde
render ediliyor. İki sekme:
- **OYUN** — wireframe mesh, imleç yüzeyi fiziksel olarak deforme eder.
- **UYGULAMA** — kendini kuran arayüz iskeleti; elemanlar imlece doğru
  *manyetik* şekilde çekilip üzerinden geçince parlıyor (`Hero`/`Contact`
  içindeki `MagneticLink`/`MagneticButton` diliyle bilerek aynı).

Altında gerçek fps/frame HUD'u var. `prefers-reduced-motion`'a saygı
duyar (tek kare, pointer etkisi kapalı). Stok video/görsel kullanmıyor —
stüdyonun görsel asset'i yok, bu yüzden canvas'ta canlı çiziliyor.

## Gerçek içerik — uydurma, kaynağı kontrol et

`Games.jsx` ve `About.jsx`'teki proje adları, tarihler ve linkler
**gerçek** (eski canlı siteden): Switch Master: Railway (App Store +
Google Play, 2026), REVO (ardekostudios.xyz + GitHub release), Forza
Orbit, Apex Shift (ardaguner.com), Kafa Kafaya / Rushville / Skyline
Swinger ("yakında"). 2026-08-19'da eklenen **Decoy** (yedi ulusun hileli
savaşı — gerçek zamanlı alan hakimiyeti stratejisi, web/online, repo
`~/Desktop/projects/decoy`) ve **Torpidodan** (ikinci el araba alım-satım
simülasyonu, React+Capacitor mobil, repo `~/Desktop/projects/torpidodan`)
da "yakında" durumunda — ikisinin de henüz canlı adresi ya da mağaza
linki yok, çıkınca `status: 'live'` + `links` eklenmeli.
`About.jsx`'teki tarihçe: 2023 kuruluş → Legend of
Rey (2024, itch.io) → Wordeko/Protocol/Nebula - Bubble Shooter (2025,
ardaguner.com) → Switch Master (2026). İletişim: `info@ardekostudios.com`,
Instagram `@ardekostudios`, kurucu Arda Güner (ardaguner.com). Yeni bir
proje eklerken bu listeleri güncelle, uydurma placeholder yazma.

## Mobil uyumluluk (2026-08-19)

"Site mobilden açılmıyor" şikayeti üzerine gerçek cihaz profilinde
(iPhone 12, 320–430px, yavaş 3G) ölçülüp düzeltilenler. **Bu tuzaklara
tekrar düşme:**

1. **`Preloader` açılışı kilitliyordu.** Sayaç `window.load` + *tüm*
   `document.images` tamamlanmasını bekliyordu; `public/games/` 12 MB
   olduğu için yavaş 3G'de intro 60 sn'de bile kapanmıyordu — kullanıcının
   gördüğü "açılmıyor" tam olarak buydu. Artık `MAX_DURATION` (3200ms)
   tavanı var ve **`loading="lazy"` görseller orana dahil edilmiyor**
   (dahil edilirse oran asla 1 olmaz, her açılış tavana dayanır).
2. **`Viewport` canvas'ı scroll tuzağıydı.** `touch-none` yüzünden
   hero'daki 260px'lik alanda parmakla kaydırma hiç çalışmıyordu.
   `touch-pan-y` oldu. Canvas'a bir daha `touch-none` verme.
3. **Hero sabit header'ın altında kalıyordu.** `min-h-screen` +
   `justify-center` içerik ekrandan uzun olunca üstü 64px'lik mobil
   header'a giriyordu. `pt-28 pb-20 lg:py-0` eklendi; yükseklik
   `.adk-vh-screen` sınıfıyla (`100svh`, adres çubuğu hesaba katılır).
4. **Mobil menü açıkken arka sayfa kayıyordu** — `Navbar` artık Lenis'i
   `stop()`/`start()` ile kilitliyor (`Preloader` ile aynı desen).
5. **Anchor'lar header'ın altına düşüyordu.** Lenis `scroll-margin-top`
   okumaz; `SmoothScroll` içinde `anchors: { offset: -80 }` verildi
   (CSS'teki `scroll-margin-top` Lenis devre dışıyken yedek).
6. **iOS form zoom'u** — 16px altındaki alana odaklanınca Safari sayfayı
   yakınlaştırıyor. `Contact` input'ları `text-base sm:text-sm`.
7. **`SplitWords` başlığı hiç görünmüyordu** (mobil/masaüstü fark etmez):
   kelime `y:115%` ile kendi `overflow-hidden` maskesinin tamamen dışında
   başladığı için IntersectionObserver onu asla "görünür" saymıyor,
   `whileInView` tetiklenmiyordu. Tetikleyici maskeye taşındı, kelime
   variant'la sürülüyor. Maskeli reveal yazarken bunu unutma.
8. Eski Safari (<16) `overflow: clip` bilmiyor; `index.css`'te
   `@supports not (overflow: clip)` ile `hidden`'a düşülüyor.

## Yapılacak

1. `info@ardekostudios.com` adresi gerçekten çalışıyor mu, kontrol et.
2. **`public/games/` 12 MB** — tek tek 1.4–2.2 MB'lık JPEG'ler, oysa en
   büyük kullanım yeri 320×220 (masaüstü hover kartı), mobilde 80×56
   thumbnail. Yeniden boyutlandır (≈640px genişlik + WebP) — mobil veri
   için en büyük kazanç burada. Şimdilik sadece `loading="lazy"` ile
   açılış yolundan çıkarıldı.
3. JS bundle 484 KB (gzip 144 KB); yavaş 3G'de açılışın kalan ~9 sn'si
   bu transferden geliyor. framer-motion kullanımını gözden geçir / kod
   bölme düşün.
4. Lighthouse: LCP, CLS ve mobil kontrast.
