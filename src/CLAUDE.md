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

## Konumlandırma (2026-08-19)

Hero rozeti **"Games & Interactive Media"**. Eskiden "Next-Gen Mobile
Gaming" yazıyordu; kullanıcı "sadece mobil oyun yapmıyoruz" diye
değiştirtti ve haklıydı — yayındaki 4 projenin 3'ü web/masaüstü
(Forza Orbit, Apex Shift, REVO) ve **REVO bir oyun bile değil** (sesli
sohbet uygulaması, Web + Windows). Rozet ayrıca Viewport'un OYUN/UYGULAMA
sekmeleriyle ve Hakkımızda'daki "Mobil oyun yapmak değil, deneyim
tasarlamak için buradayız" cümlesiyle de çelişiyordu.

Aynı iddia üç yerdeydi, üçü birlikte güncellendi: `hero.badge`,
`about.p1` (TR+EN) ve `footer.desc` (TR+EN). **Stüdyoyu bir yere
"mobil oyun stüdyosu" diye yazma** — doğrusu "oyun ve etkileşimli medya
stüdyosu", mobil/web/masaüstü.

Bilerek DEĞİŞTİRİLMEYENLER: timeline'daki 2025 "3 farklı mini mobil
oyun" (gerçekten mobildi), gizli projenin "yeni nesil mobil deneyim"i
(o proje özelinde doğru) ve Hakkımızda'nın "mobil oyun yapmak değil..."
alıntısı (zaten yeni konumlandırmayı destekliyor).

### ⚠️ Türkçe büyük harf tuzağı

Belge dili `tr` (varsayılan dil TR, `i18n.jsx` `documentElement.lang`'i
set ediyor). Bu yüzden CSS `text-transform: uppercase` **Türkçe** kuralını
uyguluyor: `i` → `İ`. Türkçe metinde doğru, ama İngilizce marka
ifadelerinde değil — rozet "İNTERACTİVE MEDİA" diye render oluyordu
(eskiden de "MOBİLE GAMİNG" diye çıkıyormuş). Çözüm: İngilizce kalması
gereken uppercase metne `lang="en"` ver. Kaynağı zaten büyük harfle
yazılmış stringler (`IOS · ANDROID` gibi) etkilenmez — sorun sadece küçük `i` içerip CSS ile büyütülen İngilizce
metinlerde.

Site tarandı, etkilenen 20 metnin hepsi elden geçirildi. İki kalıp var:

- **Saf İngilizce eleman → `lang="en"`**: hero rozeti, `Footer`'daki
  "Studios" logotipi, "Made with ♥ in Istanbul" ve telif satırındaki
  "Ardeko Studios" (span'e sarıldı), `Navbar`'ın masaüstü kenar
  çubuğundaki `info@ardekostudios.com`, `RevoScene`'deki
  `SignalR · WebRTC`.
- **Karışık TR+EN metin → İngilizce token'ı kaynakta zaten büyük yaz**
  (markup gerekmez, `Games.jsx`'teki `platforms: 'IOS · ANDROID'`
  deseniyle aynı): `'WINDOWS için indir'`,
  `'WINDOWS 10/11 · 64-BIT · Kurulum dosyası'` ve `previewMeta`'daki
  `'IOS · ANDROID'` / `'WEB · WINDOWS'` / `'WEB · BROWSER'`.

`HoverPreviewList` başlıkları CSS ile büyütülüyor ve çoğu İngilizce ürün
adı, bu yüzden span `lang={item.lang ?? 'en'}` kullanıyor; Türkçe adlar
`Games.jsx`'te `lang: 'tr'` ile işaretli. **Yeni proje eklerken adı
Türkçeyse `lang: 'tr'` koymayı unutma.**

Kasıtlı olarak `İ` ile kalanlar: **TORPİDODAN** (Türkçe ürün adı; EN
sayfada da öyle kalır, özel ad kendi dilini korur) ve **HUKUKİ**.

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

### `src/components/Journey.jsx` — Yolculuk (2026-08-20'de yeniden yazıldı)

`About.jsx` içindeki 6 satırlık almaşık zaman çizelgesinin yerini aldı.
Artık **18 kilometre taşı** var; veri iki dosyaya bölünmüş durumda:

- `src/lib/journey.js` — **yapısal** veri: `id`, `year`, `month`, `category`,
  `tech[]`, `links{}`, `inProgress`/`restricted`/`highlight`. Hiçbiri çevrilmez.
- `i18n-content.js` → `about.journeyItems[id]` — **çevrilen** metin
  (`title`, `desc`). `Games.jsx`'in yapı/metin ayrımıyla aynı desen.

Yeni kilometre taşı eklerken **iki dosyayı da** güncelle; `journey.js`'e
eklenip i18n'e eklenmeyen bir id render sırasında `undefined.title` ile
patlar. Doğrulama tek satır:

```bash
node --input-type=module -e "const {MILESTONES}=await import('./src/lib/journey.js');const {CONTENT}=await import('./src/lib/i18n-content.js');for(const l of ['tr','en'])for(const m of MILESTONES)if(!CONTENT[l].about.journeyItems[m.id])console.log('EKSIK',l,m.id)"
```

Etkileşim: kategori çipleriyle süzme (sayaçlar canlı), karta tıklayınca
açılan detay (tam açıklama + teknoloji + linkler), scroll'a bağlı dolan sol
şerit. **Sürekli çalışan animasyon bilerek YOK** — iOS bellek/boyama
bütçesi yüzünden (bkz. "Görsel bütçesi"). `prefers-reduced-motion` hepsini
kapatır.

⚠️ Teknoloji çiplerine `uppercase` verme: belge dili `tr`, CSS büyütmesi
`iOS` → `İOS` yapar. Rozet ve filtre metinleri kaynakta zaten büyük harf.

⚠️ `About.jsx`'in `<section>`'ı `overflow-hidden`; bu yüzden yıl
başlıklarında `position: sticky` çalışmaz, denenip vazgeçildi.

**Kaynaklar** (hepsi doğrulandı): GitHub `api.github.com/users/Ardeko/repos`
(repo oluşturma tarihleri), ardaguner.com paketinden çıkarılan proje
kataloğu (açıklamalar Arda'nın kendi metinleri), eski sitedeki stüdyo
tarihçesi. Teknofest (2023) ve Renault (2024) tarihleri Arda'ya soruldu —
bu ikisinin repo kaydı yok. *Sarteks Makina* (sarteks.com.tr) tarihi yerel
repodan doğrulandı: `~/Desktop/projects/sarteks/sarteks-web` ilk commit
2026-06-03, son sürüm 2026-08-11 (v2.4). Next.js 16 + TypeScript, 10 dil
(Arapça/Farsça RTL dahil), Adana merkezli tekstil makinesi firması.

### `Games.jsx` → `LoreScene` — hareketlendirildi (2026-08-20)

*LORE: Legend of Rey* kartı tek animasyonsuz karttı (diğerlerinin hepsi elle
çizilmiş CSS/SVG sahne). Anahtar görsel gerçek bir asset olduğu için çizim
yerine **görselin üstüne ışık/parçacık katmanları** bindirildi: iki meşale
alevi (halo + alev dili, farklı sürelerle titriyor), yükselen 2px közler,
sürüklenen sis, gökyüzü nefesi, kılıcın üzerinden geçen parıltı ve 26sn'lik
çok yavaş bir kamera kayması. Hepsi CSS; `filter: blur()` yok (iOS'ta geniş
alanlı blur pahalı), ışıklar `radial-gradient` + `mix-blend-mode: screen`.

**Asıl çözülen problem — hizalama.** Katmanlar görselin belirli piksellerine
çivili (alevler %17.1/%48 ve %80.3/%55, kılıç %50-60 × %58-85). Kart genişliği
327px (mobil) ile 975px (lg altı tek sütun) arasında değişiyor ve
`object-cover` bu aralıkta kâh yanları kâh alt/üstü kırpıyor — yüzdeler sahne
kutusuna göre verilseydi hizalama her ekranda kayardı. `.lr-stage` bu yüzden
cover geometrisini yeniden üretiyor (`width:max(100%,601px)` +
`aspect-ratio:1536/486`, taşanı `.lr` kırpıyor) ve tüm katmanlar onun çocuğu.
**Yeni katman eklerken konumu görselin 1536×486 koordinatından yüzdeye çevir.**
Alev/parıltı şiddetleri bir tur kısıldı: ilk değerlerde meşaleler mor bir
lekeye, kılıç da ışın kılıcına dönüyordu — katman sanat eserinin kendi ışığını
titretmeli, ikinci bir ışık kaynağı gibi durmamalı.

## ⚠️ Favicon — Vite logosu tuzağı (2026-08-20)

Sekmede stüdyonun ikonu yerine **Vite'ın mor şimşeği** çıkıyordu.
`public/favicon.svg`, `npm create vite` iskeletinden kalan Vite logosuydu
(`fill:#863bff`, 48×46) ve ilk commit'ten beri repoda duruyordu.

566a54a'ya kadar `index.html`'de tek bir etiket vardı ve `type` yanlıştı
(`type="image/svg+xml"` derken `href="/favicon.png"`); tarayıcılar hoşgörü
gösterip PNG'yi kullanıyordu. O commit MIME uyuşmazlığını "düzeltirken"
gerçek bir `/favicon.svg` etiketi ekledi — **PNG'den önce**. Tarayıcılar
SVG'yi tercih ettiği için ikon Vite'a geçti.

Çözüm: `public/favicon.svg` silindi, SVG etiketi kaldırıldı. Gerçek ikon
`public/favicon.png` (500×500, mavi D-pad). **Buraya yeniden bir SVG
favicon eklemeden önce dosyayı gözünle aç** — iskeletten kalan dosyalar
doğru isimde olabilir ama yanlış içerikte.

**Bilinen boşluk:** ardaguner.com'daki *Unichain Blockchain İzleme Zinciri*
çizelgede YOK — ne repo ne tarih var, uydurulmuş yıl basmamak için dışarıda
bırakıldı. Yılı öğrenilince `journey.js` + iki i18n bloğuna bir satır.

**Bilinen çelişki:** Eski site *Legend of Rey*'i 2024 (itch.io) diyor, ama
`Legend-Of-Rey` reposu 2025-02'de açılmış. Eski sitenin tarihi korundu
(repo açılışı yayın tarihi olmak zorunda değil) — doğrusu 2025 ise
`journey.js`'te `year` alanını değiştirmek yeterli.

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

## ⚠️ Görsel bütçesi — iPhone'u kilitleyen şey buydu (2026-08-20)

Kullanıcı bildirdi: iOS 17+ Safari'de (normal sekme, gizli sekme, Instagram
uygulama içi tarayıcı — hepsinde) site ya sayacın **"000"**'ında ya da siyah
ekranda kalıyor, "çok uzun süre bekleyince açılıyor". Masaüstünde hiç
görünmüyordu.

Sebep çökme değil, **bellek**. Dosya boyutu değil, **çözülmüş bitmap**
boyutu belirleyici — iOS her görseli `genişlik × yükseklik × 4 bayt` olarak
RAM'e açar ve sekme başına bütçesi masaüstünün çok altında:

| Dosya | Diskte | Piksel | iOS'ta RAM |
|---|---|---|---|
| `games/*.jpg` ×7 | 12 MB | 1536×1024 | 6 MB × 7 = **42 MB** |
| `ardeko.png` | 72 KB | 2490×2490 | **23.7 MB** (32px'te gösteriliyor!) |

Toplam ~66 MB. Sekme indirip kod çözerken ana iş parçacığı doluyor,
`requestAnimationFrame` duruyor (sayaç 000'da donuyor), iş bitince site
açılıyor. `ardeko.png` en sinsisi: 72 KB'lık masum bir dosya ama 2490²
piksel — logo `h-8` (32px) olarak render ediliyor.

Yapılan: hepsi 720px uzun kenara indirildi (`games/` 12 MB → 292 KB,
gerçek JPEG'e yeniden kodlandı — dosyalar `.jpg` uzantılıydı ama içerik
PNG'ydi, bu yüzden kayıpsız ve devasaydılar), logo 512×512'ye düştü.
Dağıtılan site toplamı **13 MB → 0.92 MB**.

**Orijinaller silinmedi**: `assets-src/` altında duruyorlar. Vite sadece
`public/`'i kopyaladığı için oraya taşınmak onları dağıtımdan çıkarır ama
repoda tutar. Yeni key art eklerken **önce `assets-src/`'e tam boyutu koy,
sonra `public/games/`'e 720px sürümünü üret.** `public/`'e 1000px'ten
büyük hiçbir şey koyma.

## Yapılacak

1. `info@ardekostudios.com` adresi gerçekten çalışıyor mu, kontrol et.
2. JS bundle 484 KB (gzip 144 KB); yavaş 3G'de açılışın kalan ~9 sn'si
   bu transferden geliyor. framer-motion kullanımını gözden geçir / kod
   bölme düşün.
3. Lighthouse: LCP, CLS ve mobil kontrast.
