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
`purple-600` vurgular), yuvarlak köşeli camsı kartlar (`rounded-card`,
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
  `'WINDOWS 10/11 · 64-BIT · Kurulum dosyası'` (eskiden `previewMeta`'daki
  `'IOS · ANDROID'` vb. de vardı — `previewMeta`, HoverPreviewList ile
  birlikte 2026-11-25'te silindi).

Kural genel: **CSS ile büyütülen bir ürün adı İngilizceyse `lang="en"`,
Türkçeyse `lang="tr"`.** (Bu kuralın en çok kullanıldığı yer olan
`HoverPreviewList` 2026-11-25'te kaldırıldı, bkz. "Arayüz yükseltmesi".)
Canvas'a çizilen metin CSS uppercase bilmez — Metroray Mini'nin HUD
etiketleri i18n'de zaten büyük harf (`YÜK`, `KANCA`).

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
kaydırılıyor) → `main`: `Hero` (hero bölümü + altında `#engine` sahnesinde
lazy `Viewport`) → `Games` (lazy) → `About` → `Contact` → `Footer`.
`SmoothScroll`/`lenis` ve `scrollVelocity.js` scroll hızını `Marquee`'ye
besliyor (şu an Marquee hiçbir yerde render edilmiyor — kullanılmıyor
ama silinmedi, eski koddan kalma).

### `src/components/Viewport.jsx` — "neler yapıyoruz"un canlı örneği

Hero'nun ALTINDA, kendi sahnesinde (`#engine`; eskiden hero'nun içindeydi
ve hero'nun scroll'a bağlı solmasıyla birlikte soluyordu). `Hero.jsx`'te
`lazy` — ayrı chunk (~12 KB gzip), perde kalkınca boşta önceden iniyor;
chunk inene kadar aynı ölçülerde `ViewportShell` duruyor (CLS yok).

Kabuk: sıvı cam monitör (`.lg`), GooeyTabs, ilk görünüşte **CRT açılışı**
(yatay ışık çizgisi → dikey açılış, clip-path), altta künye + fps HUD'u.
İki sekme — 2026-11-25'te soyut çizimlerden stüdyonun KENDİ işlerine
geçti (kullanıcı "daha iyi örnekler" istedi):

- **OYUN → `MetrorayMini.jsx`** — geliştirilmekte olan yük treni oyunu
  Metroray'ın (`~/Desktop/projects/metroray`, Phaser + Matter) oynanabilir
  çekirdek mekaniği. Oyunun kendisi DEĞİL (≈1 MB, hero'ya girmez); aynı
  arazi formülü, aynı kanca eşikleri, aynı palet. Tek tuş: basılı tut =
  gaz, bırak = regülatör. Kimse oynamazken otopilot sürer. Fizik saf
  modülde: `src/lib/metrorayMini.js` (DOM yok) — ayar notları dosyanın
  başında. **Sayı değiştirince Node'da politikaları yeniden koştur**:
  dikkatli sürücü 9/9, sürekli tam gaz 0/9 teslim etmeli (hız ↔ yük
  takası oyunun kendisi). ⚠️ Tren yuvarlanarak başlar (v=62): duran treni
  kaldırmak kancaya en büyük darbeyi vuruyordu, herkesin ilk saniyesi
  kancanın yarısını yiyordu. ⚠️ Lokomotif x=250'de başlar: son vagon x≥20
  sınırının içinde olmalı, yoksa sınıra kenetlenip kancayı ezer ve tren
  fırlar (ilk sürümde oldu).
- **UYGULAMA → `RevoMini.jsx`** — yayındaki REVO'nun etkileşimli mini
  odası: bas-konuş, gürültü engelleme anahtarı, kişi başı ses kaydırıcısı,
  E2E/gecikme rozeti, "REVO'yu aç" (ardekostudios.xyz). Mikrofon izni
  istenmez, seviyeler benzetim. Diğer üç kişi açık takma ad (nova/hermes/
  rey) — gerçek kişi gibi durmasın.

İkisi de döngüsünü `stageRef`'i (kırpılmayan dış kap) izleyerek durdurur/
başlatır — bkz. "Arayüz yükseltmesi"ndeki clip-path + IntersectionObserver
tuzağı. Canvas'ta `touch-pan-y` korunur (mobil scroll tuzağı, bkz. Mobil
#2); oyun dışındayken basış 140 ms gecikmeli başlatır ki kaydırmak isteyen
parmak yanlışlıkla oyunu başlatmasın.

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

### `Games.jsx` → `TorpidodanScene` — oyundan birebir (2026-09-27)

Eski sahne (bej kâğıt, karikatür mavi araba, büyüteç) kullanıcıya göre
"oyuna hiç uymuyordu" — haklıydı. Oyun `~/Desktop/projects/torpidodan`
koyu gece galerisi + galeri sarısı + TR evrak estetiği kullanıyor. Yeni
sahne oyunun tezinin 12 sn'lik hâli: göz kararı ±%51 → tarama → temel
±%22 → tarama → tam ±%7 → gizli kusur → "pahalı duruyor" → pazarlık →
el sıkışma → ışıklar söner, sıradaki araç. Bu sahneye dokunmadan önce
oyunun kendisine bak; kaynak orası.

- **Görsel dil oyunun token'larından**: `src/styles/tokens.css` (ink
  rampası, `--sari #f7bd3f`, plaka mavisi, kaporta skalası
  orijinal/lokal/boyalı/değişen, `--kar`, `--zarar`, `--amber`). Bant
  oyundaki `UncertaintyBar`/`NegoEstimate`, lekeler `ArtWear`, B/D rozeti
  `art__marks` (lokal boya B saymaz — oyundaki `isRepainted`), tarama
  `BodyDiagram` taramasının karşılığı.
- **Dokuz araç döner, kullanıcının seçimi**: Klior gibiler (Renohut
  Klior 2020, DasVolk Kroket, Yota Yarışır), Fulanya gibiler (Renohut
  Fulanya 2012 beyaz, Fiyat DeGea, Yota Kolalara), Porsen gibiler (Porsen
  Dokuzbirlik, BMB M8.5, Honto Sivil R). Plaka hepsinde **34 ARDO 95**.
  Görseller oyunun `public/arac/*.webp` dosyaları → `public/games/
  torpidodan/` (orijinaller `assets-src/games/torpidodan/`). Klior'un
  kırmızısı mercan turuncuya, Fulanya'nın gümüşü beyaza çevrildi —
  yalnızca sitedeki kopyalar. Adlar oyunun güncel katalog adları
  (Clio → Klior, Fluence → Fulanya); motor kodu (TCe, dCi) yazılmıyor,
  oyun gerçek marka/motor adı kullanmıyor.
- **Hasar çokgenleri her görsele elle oturtuldu** (`TD_CARS[].panels`,
  640×427 görsel koordinatı). Görsel değişirse çokgen de değişmeli.
  `op-korsa.webp`'nin altında dosya adı yazısı kalmış, o yüzden seçilmedi.
- **Sayılar uydurma değil**: her araç oyunun domain koduyla üretilmiş
  gerçek bir ilan (`seed` = `createRng` tohumu, `generateListing(model
  tier'ı, gün 30)`, beceriler 0, üç seviyede `inspect()` +
  `estimateHint()`). Pazarlık da oyunun `openNegotiation` +
  `makeOffer`'ıyla oynandı: tam tahminin %3 altından yuvarlak teklif,
  satıcı kabul ediyor. ⚠️ Satıcının gizli tabanı **gerçek değer ×
  açgözlülük** (`openNegotiation`) — ilandaki fiyatın türediği görünen
  değer değil; ilk Şahan sürümünde bu yanlış hesaplanmıştı. İki kapılı
  görsellerde (Porsen, M8.5) arka kapısı hasarsız ilan seçildi, yoksa
  leke fotoğrafa oturmaz. Arama şartları: göz/temel bant içi, tam bant
  dışı (pahalı), gizli kusur var, anlaşma bant içi, görünen yüzde bir
  değişen + en az bir boyalı/lokal.
- **Araç değişimi React'te, zamanlama CSS'te**: `tdDim` her tur bittiğinde
  `animationiteration` atıyor; o an ışık sönük ve ilana ait her şey
  (`.td-hold`) gizli, değişim görünmüyor. Sıradaki görsel bir tur önceden
  `decode()` ediliyor; hepsi birden yüklenmiyor (iOS bellek bütçesi).
- **Hareket azaltma = son kare**: animasyonlar kalkınca ilk araç ve TABAN
  stiller (el sıkışma anı) kalır; keyframe'ler öbür hâlleri tanımlıyor.
  Yeni öğe eklerken taban stilini buna göre yaz.
- Geniş kartta (`@container` ≥440px) araç kutusu büyüyor; `.td`
  `container-type:inline-size`. Kartın vurgusu ve Spotlight da artık
  oyunun galeri sarısı.
- Önizleme listesinin görseli (`public/games/torpidodan.webp`) oyunun
  ana menü key art'ından kırpıldı; tam boyu `assets-src/games/
  torpidodan-menu.png` (dosya `.webp` uzantılıydı ama içeriği PNG).

### React Bits bileşenleri — üçü alındı, beşi reddedildi (2026-08-27)

Kullanıcı sekiz React Bits / shadcn bileşeni için entegrasyon promptu
getirdi. **Sekizinin de promptu "shadcn + TypeScript + `/components/ui`"
varsayıyor; bu proje düz JSX ve shadcn kurulu değil.** Bir daha böyle bir
prompt gelirse:

- `/components/ui` klasörü AÇMA — düzen `src/components/` düz.
- Promptların içindeki CSS bloklarını **yapıştırma**. İkinci bir
  `@import "tailwindcss"` `index.css`'i bozar; hero-scrub'ınki ayrıca
  bozuk (`var(----ease-out-back)`, dört tire).

**Alınanlar:**

- **`Spotlight.jsx`** (ibelick) — `Games.jsx`'te oyun kartlarında.
  Konumlanmış+kırpan bir kabın doğrudan çocuğu olarak bırakılır, kabı
  kendi bulur; **içerik sarmalayıcısına `relative z-10` vermeyi unutma**,
  yoksa ışık metnin üstüne biner. Kart rengi `SPOTLIGHT_COLORS`'tan.
  Dokunmatikte ve reduced-motion'da `null` döner (hiç mount olmaz).
  `filter: blur()` bilerek yok — yumuşaklık gradient'in kendisinden.
- **`GooeyTabs.jsx`** (React Bits GooeyNav'dan) — `Viewport.jsx`
  sekmelerinde. **Navbar'a KOYMA**: nav dikey sidebar ve aktif bölüm
  scroll-spy'dan geliyor, GooeyNav ise yatay ve aktif indeksi kendi
  tutuyor. Kontrollü yazıldı, parçacıklar React'ten çıkıyor, goo filtre
  katmanı **sadece patlama süresince** mount (boştayken maliyet sıfır —
  hero'da duruyor, bkz. "Görsel bütçesi"). Orijinaldeki
  `var(--color-1..4)` bu projede tanımsız, renk `tabs[].color`'dan.
  ⚠️ **Goo SVG filtresiyle yapılıyor, CSS `contrast()` ile değil**
  (2026-09-02'de değişti). Orijinalin `blur()+contrast(100)` numarası opak
  zemin ister ve altına `inset:-48px` siyah bir plaka koyup
  `mix-blend-mode:lighten` ile gizler; `Viewport` kartı `backdrop-blur-sm`
  taşıdığı için kendi izole karışım grubunu açıyor, lighten kartın
  arkasındaki içeriğe inemiyor ve plaka görünür kalıyordu — sekmeye her
  basışta arka taraf siyah bir dikdörtgen oluyordu. SVG goo (blur → alfa
  eşiği) şeffaf zeminde çalışır. `contrast()` tabanlı goo'yu geri getirme.
- **`Folder.jsx` + `Folder.css`** — sadece `Games.jsx`'teki **gizli
  proje** kartında, oradaki 🔒 emojisinin yerine. Diğer kartlara yayma:
  hepsinde projeye özel elle çizilmiş sahne var, genel bir klasör ikonu
  onların yanında yavan kalır. Kâğıtlar koyu (beyaz olsa kartın en parlak
  öğesi olurdu). Klasör açılınca kâğıtlar ~60px yukarı savruluyor, o
  yüzden kartta `h-[150px]` sabit bir yuva ayrıldı. Upstream'de
  `--magnet-x/y` JS'te set edilip CSS'te hiç okunmuyor (ölü kod); burada
  transform zincirine eklendi.

### `Aurora.jsx` — hero arka planı (2026-09-03)

21st.dev **"Velaris"** (simplex-noise WebGL gradyan) uyarlandı;
`Hero.jsx`'te en arkadaki zemin katmanı.
Kullanıcı dört arka plan adayı getirdi, bu seçildi: tek tam ekran quad +
piksel başına üç noise, yani dördünün en ucuzu ve renkleri prop.

Diğer üçü neden reddedildi:

| Aday | Neden |
|---|---|
| beams-background | Kare başına **üç tam ekran blur** (canvas `ctx.filter:blur(35px)` + CSS `blur(15px)` + animasyonlu `backdropFilter:blur(50px)`) — WebKit'te büyük ölçüde CPU, `feTurbulence` vakasının aynısı. Ayrıca `ctx.scale(dpr,dpr)` her resize'da transform sıfırlanmadan çağrılıyor (iOS adres çubuğu → ölçek birikiyor) ve ışınlar cihaz pikseliyle üretilip CSS pikseliyle çiziliyor. `motion` paketi istiyor, sende `framer-motion` var — aynı kütüphanenin iki adı. |
| atc-shader | Piksel başına 50 iterasyonlu ray döngüsü, prop yok, renk kontrolü yok (sabit camgöbeği tünel — indigo paletle çakışıyor), sadece WebGL2, ekranda `<pre>` debug katmanı bırakıyor. |
| blackhole-hero-section | Piksel başına 300 adım ray-marching + temporal accumulation + bright-pass + iki geçiş blur + composite = kare başına 5 geçiş. Ayrıca arka plan değil, kendi scrim'i olan komple bir hero — Hero başlığı ve `Viewport` ile yarışır. |

Upstream'de düzeltilenler (dosya başındaki yorumda madde madde): `colors`
dizisi prop + deps olduğu için **her render'da WebGL context'i baştan
kuruluyordu**; shader derleme kontrolü yoktu (patlarsa sessiz siyah ekran,
şimdi `null` dönüp sitenin zeminini bırakıyor); vignette siyaha eriyip
hero'nun altında bant bırakıyordu, artık `u_bg`'ye eriyor.

Bütçe önlemleri: rAF sadece hero ekrandayken + sekme öndeyken
(IntersectionObserver + visibilitychange), `prefers-reduced-motion`'da tek
kare, render ölçeği 0.65 / dokunmatikte 0.5, kurulum `requestIdleCallback`
ile Preloader'ın dışına ertelenmiş, `webglcontextlost/restored` ele
alınmış. Cleanup'ta **`loseContext()` çağırma** — StrictMode effect'i iki
kez çalıştırıyor, ikinci kurulum ölü context'e düşer.

⚠️ Hero'nun içerik sarmalayıcısına `relative z-10` verildi. Aurora opak
çiziyor ve konumlanmış bir kardeş; `z-10` olmadan statik metnin üstüne
biner. `Spotlight` ile birebir aynı kural.

Şiddet/hız tek yerden: `<Aurora strength={0.55} speed={0.45} />`.

**Reddedilenler ve nedenleri** (tekrar gündeme gelirse):

| Bileşen | Neden |
|---|---|
| scroll-locked-video-hero | `body.position=fixed` kuruyor ve **hiç bırakmıyor** — Games/About/Contact erişilemez olur. Ayrıca `window` wheel/touch'ı `passive:false` ile eziyor → Lenis'le kavga; `video.currentTime` scrub'ı iOS'ta çalışmaz; hero'ya üçüncü şahsın imzası gömülü. |
| hero-scrub (GSAP) | 300 kareyi `new Image()` ile RAM'e alıyor ≈ 1 GB çözülmüş bitmap. "Görsel bütçesi"nin aynısı. + GSAP/ScrollTrigger ~70 KB ve Lenis'e bağlanmadığı için scrub desenkron. |
| mac-book-neo-hero | Aynısının ağırı (`eagerCount=140`, sonra hepsi), üstelik canvas yerine `<img src>` takas ediyor. Kendi loader'ı ve nav'ı `Preloader`/`Navbar` ile çakışıyor. |
| progressive-hero | `fixed inset-0` + `autoPlay loop` = sayfa açık oldukça çözülen video. Pexels'ten hotlink (stok — lisansımız yok), kırmızı tema. Tek fikri dönen başlık, karşılığı Hero'da `TypewriterWords` olarak zaten var. |
| Spline 3D | `@splinetool/runtime` tek başına bundle'dan büyük + `.splinecode` 3–10 MB + telefonda WebGL. Elde sahne de yok. |

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
Orbit, Apex Shift (ardaguner.com), Kafa Kafaya ("yakında"). **Decoy**
(yedi ulusun hileli savaşı, web/online, repo `~/Desktop/projects/decoy`)
sitenin içinde `/decoy/` altında yayında.

**2026-09-27'de yayına çıkanlar**: Torpidodan, Rushville, Skyline Swinger
(App Store + Google Play) ve LORE: Legend of Rey (itch.io,
`ardeko.itch.io/legend-of-rey`). Mağaza linkleri kartta `appStore` /
`googlePlay` / `itch` alanlarında; butonlar `STORES` dizisinden, logolar
`StoreIcons.jsx`'ten (Simple Icons yolları, elle çizme). Vitrin sırası
kullanıcının seçimi: Torpidodan → LORE → Rushville → Skyline → Switch →
REVO → Apex → Decoy → Forza, sonra Kafa Kafaya + gizli proje.
Hero'daki "Yayında" sayısı (`hero.stats`)
elle yazılıyor — yeni oyun çıkınca onu da artır. Mağaza puanları
**App Store 5★, Google Play 4,6★** (TR ve EN aynı; kullanıcı 2026-11-25'te
söyledi). Eskiden bilerek 4,8★ / 4,7★ yazıyordu — o not artık geçersiz;
puanı kullanıcı söylemeden değiştirme. v4.0.2'de yalnız EN güncellenmişti,
TR geride kalmıştı: puan değişince iki dili birlikte güncelle.
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

## UX/UI + tipografi geçişi (2026-09-23)

Kullanıcı "siteyi daha minimal yapabilir miyiz" diye sordu. **Redesign
YAPILMADI** — yukarıdaki 2026-08-18 kararı duruyor, minimalist redesign
bir kez reddedildi. Onun yerine "aynı tasarım, ama disiplinli" turu
atıldı. Bulgular ölçümle çıkarıldı, aşağıdakiler yapıldı.

### ⚠️ Inter artık gerçekten yükleniyor — sakın geri alma

Site aylarca `font-family: 'Inter', sans-serif` yazıp Inter'i **hiç
yüklemedi**: ne `<link>`, ne `@font-face`, ne paket. Inter kurulu
olmayan herkes siteyi **Arial/Roboto** ile gördü; yani bütün
`font-black` (900) başlıklar tasarlandıkları fontla değil, tarayıcının
bulduğu fontla çizildi. Geliştirme makinesinde Inter kurulu olduğu için
yıllarca fark edilmedi.

Şimdi `public/fonts/` altında iki woff2 var (latin 47 KB + latin-ext
83 KB), `@font-face`'leri `index.css`'in başında. Detay ve güncelleme
komutları orada yorumda. **İki alt küme de gerekli**: ı (U+0131) latin'de
ama ğ/İ/ş latin-ext'te — sadece latin yüklersen Türkçe kelimeler kelime
ortasında font değiştirir. `preload` bilerek yok, `font-display: swap`
var (130 KB'ı kritik yola koymak Preloader'ı geciktirir).

### Kontrast — `text-gray-600` ve `text-gray-700` yasak

`#05070F` zemin üzerinde ölçülen değerler:

| Sınıf | Kontrast | Kural |
|---|---|---|
| `text-gray-700` | **1.97:1** | Kullanma |
| `text-gray-600` | **2.66:1** | Kullanma |
| `text-gray-500` | 4.16:1 | Sadece bilerek soluk: placeholder, pasif durum |
| `text-gray-400` | 7.92:1 | Bilgi metninin varsayılanı |

20 yerde `gray-600`, 3 yerde `gray-700` vardı ve çoğu 9–10px uppercase
metindeydi — en zor okunan boyutta en düşük kontrast. Hepsi geçildi.
Navbar'daki stüdyo e-postası `gray-700` idi, yani pratikte görünmüyordu.

### Etiket harf aralığı ölçeği

Tek bir iş (küçük + uppercase + seyrek etiket) sekiz farklı değerle
yazılmıştı. Ölçek artık **0.1 / 0.2 / 0.3 / 0.4**: `tracking-widest`,
`tracking-label`, `tracking-label-wide`, `tracking-label-x` —
token'lar `index.css`'teki `@theme` içinde. Yeni etikette bu dördünün
dışına çıkma. `tracking-tight/tighter` ayrı bir eksen (display
başlıkları), karıştırma.

⚠️ `Preloader` wordmark'ı 0.5em'den 0.4em'e indi; `index.html`'deki
statik boot wordmark'ı da **aynı anda** indirildi. İkisi birebir aynı
kalmalı, yoksa React devralırken harfler kayar.

### Köşe yarıçapı ölçeği + hover yumuşaklığı

Tracking'le aynı mantık, bu sefer köşelerde. Altı farklı değer vardı
(`md`, `lg`, `xl`, `2xl`, `3xl`, `[4px]`) ve hangisinin nerede
kullanılacağına dair kural yoktu. Artık **role göre** dört token, hepsi
4px'in katı — `index.css`'teki `@theme` içinde:

| Token | Değer | Nerede |
|---|---|---|
| `rounded-inset` | 4px | kutuya gömülü minik görsel (dil bayrağı) |
| `rounded-chip` | 8px | rozet, etiket, küçük bağlantı hapı |
| `rounded-control` | 12px | buton, input, nav öğesi |
| `rounded-card` | 16px | kart ve panel |

`rounded-full` ayrı kalır (hap/nokta), ölçeğe dahil değil. Ham
`rounded-*` sınıfı yazma; kartların köşesini değiştirmek isteyen tek
satır token'ı değiştirir.

⚠️ Oyun kartları eskiden `rounded-3xl` (24px) idi, sitenin geri
kalanındaki kartlar 16px. İkisi `rounded-card`ta birleşti — yani oyun
kartlarının köşesi bir tık sertleşti. Bilinçli: tek kart dili.

**`--ease-soft`** (`cubic-bezier(0.4, 0, 0.2, 1)`) da aynı blokta.
Kart hover'ı önce `duration-300 ease-out` idi ve kullanıcı "yukarı mı
kalkıyor büyüyor mu anlamıyorum" dedi — haklıydı: `ease-out` tam hızda
başlar, 4px'lik hareket okunmadan biter. Şimdi `duration-500 ease-soft`
+ 6px kalkma; iki ucu da yumuşak, hareket "yükselme" olarak okunuyor.
Yeni bir hover/geçiş yazarken bu eğriyi kullan.

⚠️ **Ama 2026-11-25'e kadar bu geçiş HİÇ çalışmadı.** Tailwind v4'te
`translate-*`/`scale-*` sınıfları `transform` değil ayrı `translate` /
`scale` CSS özelliklerini yazıyor; kartta `transition-[transform,…]`
vardı, yani 6px'lik kalkma anında sıçrıyordu (canlı derlenmiş CSS'te
doğrulandı). Artık `transition-[translate,border-color,box-shadow]`.
**Keyfi transition listesi yazarken `translate`/`scale`/`rotate` adını
kullan**; hazır `transition-transform` v4'te üçünü de kapsıyor, o güvenli.

### Mıknatıs butonlar kaldırıldı

`Hero.MagneticLink`, `Contact.MagneticButton` ve `Games.MagneticButton`
(→ `CtaLink`, `SubmitButton`, `ActionLink`) imleç üzerindeyken fareye
doğru kayıyordu. Tıklama hedefinin tam tıklanacağı anda yer değiştirmesi
hedefi küçültmekten başka bir şey yapmıyordu ve dokunmatikte zaten hiç
çalışmıyordu. Vurgu artık renk + glow'da. `CustomCursor`'daki
`data-cursor-magnet` dalı da gitti (hiçbir eleman kullanmıyordu).
`Games.MagneticButton` `export` ediliyordu ama hiçbir yer import
etmiyordu; export da kaldırıldı.

**Bilerek KALAN**: `Folder.jsx`'in kâğıtları (tıklama hedefi değil).
`Viewport`'un manyetik uygulama iskeleti 2026-11-25'te REVO Mini ile
değişti.

### Hero katman sayısı 7 → 5

`Aurora` gelince hero'da yedi dekoratif katman üst üste binmişti.
`Particles` (20 DOM düğümü, her biri sonsuz döngüde) ve mor radial glow
kaldırıldı — ikisinin de yaptığı işi Aurora zaten yapıyor. Kalan indigo
glow bilerek duruyor: Aurora sürükleniyor, o nefes alıyor, ikisi farklı
ritim.

### Games sahneleri ekran dışındayken duruyor

`Games.jsx`'te 85 adet CSS `infinite` animasyon var ve hepsi aynı anda
dönüyordu. `useSceneIdle()` + tek CSS kuralı (`.gc-idle` →
`animation-play-state: paused`) ile kart görünür alandan çıkınca
sahnesi duruyor, geri gelince kaldığı yerden devam ediyor. Durdurmak
sıfırlamak değil, bakarken hiçbir fark yok. `Journey.jsx`'teki
"sürekli çalışan animasyon bilerek yok" kuralının Games karşılığı.

### Kartlardaki 3B tilt kaldırıldı — geri koyma

Oyun kartları imlece göre ±6° dönüyordu (`useTilt`). Kullanıcı "bir oyun
stüdyosu sitesi için acemi mi duruyor" diye sordu; değerler zaten
ölçülüydü, sorun abartı değildi. Gerçek gerekçeler:

- **Çerçeve, içindeki işi sallıyordu.** Kartların içinde stüdyonun asıl
  zanaatı var (elle çizilmiş sahneler); tilt onların çerçevesini
  döndürünce göz sanat eserine değil kutuya gidiyordu.
- **Tek imlece üç tepki**: Spotlight + sahne animasyonu + kart dönüşü.
- **Jenerik.** Sayfadaki diğer bütün hareket bu stüdyoya ait; tilt
  herhangi bir portföy şablonundan kopyalanmış olabilecek tek parçaydı
  ve en önemli içeriğin üstündeydi.
- Implementasyon "lastik" hissi veriyordu: her `mousemove`'da
  `transition: transform .1s` yazıldığı için kart imleci takip etmiyor,
  kovalıyordu.

Yerine saf CSS hover geldi: 4px kalkma + kenar aydınlanması + indigo
glow. `will-change-transform` de gitti — eskiden 11 kart hover olmasa
da sayfa boyunca ayrı compositor katmanındaydı.

Konuşulan ama seçilmeyen alternatif, ileride gündeme gelirse: çerçeveyi
döndürmek yerine **kartın içindeki sahneyi** katman katman farklı hızda
kaydırmak (parallax). Bir oyun motoru deyimi, şablonlarda yok; maliyeti
11 sahnenin ayrı ayrı elle ayarlanması (`LoreScene`'in hizalama notları
gibi bir iş).

### Semantik / erişilebilirlik

- **İki `<h1>` vardı.** `Navbar`'daki "ARDEKO" logotipi `<h1>`'di ve
  Hero'nun asıl başlığıyla yarışıyordu → `<p>` oldu.
- **Form label'ları hiçbir input'a bağlı değildi** (`htmlFor`/`id` yok).
  Bağlandı; ayrıca `autoComplete`, `aria-invalid`,
  `aria-describedby` ve hata mesajlarında `role="alert"` eklendi.
- Mobil açılır menü düz `<div>`'di → `<nav aria-label="Mobil menü">`.
  Masaüstü sidebar zaten `<motion.nav>`'dı, ona da ad verildi.
- `App.jsx`'e **"İçeriğe atla"** linki, `<main id="main">`.
- `ardeko.png` `h-8 w-auto` olarak basılan 3 yerde `width/height` yoktu
  → CLS. Eklendi (512×512).
- `Games.jsx`'te `font-family: Impact` vardı (Android/Linux'ta yok).
- Hero `<h1>`'inde `select-none` vardı — sitenin ana cümlesi
  kopyalanamıyordu. Gradyanın bittiği ton da `gray-600` → `gray-400`.
- `App.jsx`'te hiç okunmayan `cursorVariant` state'i silindi.

Sonuç: eslint hatası 18 → 2. Bundle gzip 137.6 → 137.1 KB. Font ayrıca 130 KB
(cache'lenir, kritik yolda değil).

## Arayüz yükseltmesi (2026-11-25)

Kullanıcı: "arayüzü en kaliteli hâle getir" — verdiği 40'lık stil
listesinden uygun olanları uygun yerlere koy, rareui.com / 21st.dev'den
ilham al, GitHub'daki popüler skill'leri kullan, Codex imagegen kullan.
Ardından: "profesyonel, ilgi çekici, modern elit dursun; kendini tekrar
eden yapıları ayıkla."

**Redesign DEĞİL** — 2026-08-18 kararı (minimalist yeniden tasarım
reddedildi) duruyor. Koyu indigo/mor, camsı kartlar, font-black
etiketler, sidebar, cursor, preloader aynı; üstüne malzeme + hareket
katmanı eklendi (`index.css` sonundaki "MALZEME KATMANI").

Kaynaklar: projede kurulu `ui-ux-pro-max` skill'i; Anthropic
`frontend-design` (anthropics/skills — "cesaretini tek yerde harca",
"her bölüme fade-in serpiştirme"); `pbakaus/impeccable` animate/polish/
bolder ("hover'da eleman değil çocuğu hareket eder", "çıkış girişten
hızlı", "ekran dışı döngüler durur"). 21st.dev'in popüler desenleri
(Spotlight Card, Liquid Glass Button, kayan cam hap, metin reveal)
uyarlandı. **rareui.com otomatik erişimi engelliyor** (429; tarayıcıyla
denemek de reddedildi) — oradan bir şey alınmadı.

### Stil haritası — hangi stil nerede

| Stil | Nerede | Neden orada |
|---|---|---|
| Dark Mode / OLED | Zemin `#05070F` (değişmedi) | Sitenin DNA'sı |
| Aurora UI | Hero arkası (WebGL, vardı) + Contact altında statik "final ışığı" | Sayfayı aynı ışıkla açıp kapatıyor |
| Liquid Glass | `.lg` / `.lg-primary`: sidebar, header, CTA, dil anahtarı, rozet, Viewport monitörü | Yalnızca KROM; içerik camın arkasında kalmaz |
| Neumorphic Glass | `.well`: dil anahtarı rayı, form alanları, REVO gürültü anahtarı | Fiziksel "içine bir şey oturur" kontrolleri |
| Glassmorphism (sade) | `.card-glass`: oyun / journey / bento / iletişim kartları | İçerik yüzeyi; halka yok, blur yok |
| Spotlight rim | Spotlight'ın kenar halkası — oyun kartları + bento | Aynı ışığın kenara vurması (ayrı tepki değil) |
| Kinetic Typography | Hero `KineticWord` + harf harf başlık; bölüm başlıkları `SplitWords`; footer'da dev ARDEKO | Stüdyonun sesi tipografide |
| Spatial UI | Viewport: yüzen cam monitör + CRT açılışı + zemin ışığı | Motor ekranı metaforu |
| Bento Grid | About: manifesto + İstanbul + 4 değer | "Stüdyoya bir bakışta" |
| Pixel Art | About'taki İstanbul döşemesi (Codex) | LORE'un dili + "Made in Istanbul" |
| Line Art / Monoline | lucide ikonlar, çizilerek beliren onay işareti | Emoji yerine tek ikon ailesi |
| Cyberpunk (mikro) | Gizli proje: çözülen kod adı + tarama çizgileri | "Gizli dosya" hissi, tek yerde |
| Editorial | Journey'de kontur yıl başlıkları | Zaman çizelgesi gerçekten bir dizi |

Seçilmeyenler (Brutalism, Y2K, Vaporwave, Memphis, Art Deco, Bauhaus,
Japandi, Wabi-Sabi, Grunge, Pop Art, Low Poly, Claymorphism, Skeuo-,
Material, Flat, Anti-Design…) bu markanın karanlık-cam dünyasıyla
çelişiyor ya da bir şey söylemeden gürültü ekliyordu.

### Tek orkestre an — açılış
`lib/intro.js`: Preloader panjurları kaldırırken `markIntroOpened()`,
Hero `useIntroOpened()` ile bekliyor. Eskiden hero'nun giriş animasyonu
perdenin ARKASINDA, kimse bakmazken oynuyordu. Artık başlık harf harf
panjurların arasından yükseliyor, istatistikler sayarak doluyor
(`NumberTicker`). Güvenlik ağı: 6 sn sonra her koşulda açılır.

### Kaldırılanlar — geri getirme
- **HoverPreviewList** (oyun kartlarının altındaki dev yazılı liste):
  aynı 10 oyunu ikinci kez gösteriyordu; kullanıcı "kendini tekrar eden
  anlamsız bir yapı" dedi. Oyunlar sayfada BİR kez, kartlarda.
  `public/games/*.jpg` key art'ları artık sayfada kullanılmıyor ama
  silinmedi (OG görseli vb. için).
- Typewriter → `KineticWord`: sabit yükseklikli yuva, kelime genişliğe
  sığdırılır (`scale`) — satır asla zıplamaz.
- Viewport'un soyut mesh/iskelet çizimleri → Metroray Mini / REVO Mini.
- Değer kartlarındaki emoji → Codex cam ikonları; iletişimdeki emoji → lucide.
- Konum kartının `href="#"`'i (tıklayınca sayfanın başına zıplatıyordu).
- Games başlığındaki "9 proje yayında" çipi (aynı sayı hero ve Journey'de
  zaten var — sayfada üç kez tekrar ediyordu).

### Tuzaklar (bu turda yaşandı)
1. **Tamamen kırpılmış elemanda whileInView tetiklenmez** — SplitWords
   #7'nin aynısı, bu sefer clip-path ile. Ayrıca Chrome ATANIN
   clip-path'ini IntersectionObserver kesişimine katıyor: CRT kabının
   içindeki canvas'ı izleyen döngü açılıştan önce hiç başlamıyordu.
   Tetikleyici ve gözlemci hep kırpılmayan dış kapta (`stageRef`).
2. Tailwind v4 `translate` özelliği — bkz. "Köşe yarıçapı ölçeği"ndeki not.
3. Footer wordmark'ı sayfanın en dibinde: negatif alt marjlı viewport
   ile hiç kesişmiyordu (mobilde görünmüyordu) → `amount: 0.25`.
4. `NumberTicker`/`ScrambleText` kare başına `textContent` DEĞİL metin
   düğümünün `nodeValue`'sunu yazıyor — textContent React'in düğüm
   referansını koparır, dil değişince ekran güncellenmez.
5. React 19: ref callback'i değer döndürürse temizleme fonksiyonu
   sanılır — `ref={(el) => (x = el)}` yazma, blok gövde kullan.
6. Yeni malzeme sınıflarında `backdrop-filter` YOK (iOS bütçesi); App'teki
   imleç bulutunun `blur-[100px]`'i de radial-gradient'e çevrildi.

### Codex imagegen — asset hattı
Codex CLI PATH'te yok; VS Code eklentisinin içinde:
`~/.vscode/extensions/openai.chatgpt-<sürüm>/bin/windows-x86_64/codex.exe`
(`codex features list` → `image_generation stable true`). Çalıştırma:
`codex exec --skip-git-repo-check -s workspace-write -C <klasör> -c
model_reasoning_effort="low" -` ve stdin'e "görsel aracıyla üret, X.png
olarak bu klasöre kaydet" promptu. Kopyası `~/.codex/generated_images/`.
- **Değer ikonları**: TEK görselde 2×2 set istendi (tutarlı ışık ve
  malzeme), saf siyah zemin. Çeyreklere bölündü, siyah → alfa (alfa = en
  büyük kanal, renk ön-çarpımsız), 192px webp. Kaynak
  `assets-src/about/values-icons.png`.
- **İstanbul**: 1536×1024 "16-bit pixel art" istendi; 4px ızgaraya
  (384×256) BOX ile indirildi, 256 renge (FASTOCTREE) kuantize edildi
  (22 KB). ⚠️ 48 renk median-cut amber pencere ışıklarını yok etti — az
  renk kullanma. `.pixelated` ile BÜYÜTÜLEREK basılıyor; döşeme hiçbir
  ekranda görselden küçük değil (min-h ≥ 300px).
Yeni görsel: önce `assets-src/`'e tam boyut, `public/`'e ≤1000px sürüm.

## Yapılacak

1. `info@ardekostudios.com` adresi gerçekten çalışıyor mu, kontrol et.
2. Ana JS bundle 451 KB (gzip 145 KB; 2026-11-25). Viewport (12 KB gzip)
   ve Games (26 KB gzip) zaten ayrı chunk. Sıradaki aday framer-motion'ın
   ağırlığı — `LazyMotion` + `m` bileşenlerine geçiş ayrı bir iş.
3. Lighthouse'u yeniden çalıştır (kontrast ve logo CLS'i düzeltildi,
   LCP ölçülmedi).
4. Kalan 1 eslint hatası: `i18n.jsx`'in react-refresh uyarısı (bilerek
   böyle, bkz. i18n bölümü). `TypewriterWords`'ün effect-içi setState
   hatası bileşenle birlikte gitti (yerine `KineticWord`).
5. Metroray Mini'nin metni "geliştiriliyor" diyor — Metroray yayına
   çıkınca `viewport.game.caption`'ı ve Games/Journey listelerini güncelle.
