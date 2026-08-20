/* ------------------------------------------------------------------
   i18n içerik verisi — TR / EN.

   `i18n.jsx`'ten ayrı: o dosya sadece component/hook export ediyor
   (react-refresh/fast-refresh bunu ister), içerik burada.
------------------------------------------------------------------- */

export const CONTENT = {
  tr: {
    hero: {
      badge: 'Games & Interactive Media',
      lead: 'WE CRAFT',
      desc: 'Ardeko Studios olarak, fizik tabanlı mekanikleri ve bağımlılık yaratan minimalist bulmacaları sıra dışı görsellikle harmanlıyoruz.',
      primary: 'Oyunları Keşfet',
      secondary: 'Hakkımızda',
      stats: [
        { value: '4', label: 'Yayında' },
        { value: '5★', label: 'App Store Puanı' },
        { value: '5★', label: 'Google Play Puanı' },
      ],
      scroll: 'Kaydır',
    },

    viewport: {
      tabs: { game: 'OYUN', app: 'UYGULAMA' },
      hint: 'Sekmeyi değiştir',
    },

    about: {
      eyebrow: 'KİM OLDUĞUMUZ',
      title: 'Hakkımızda',
      quotePre: '"Mobil oyun yapmak değil, ',
      quoteHighlight: 'deneyim tasarlamak',
      quotePost: ' için buradayız."',
      p1: 'Ardeko Studios, İstanbul merkezli bağımsız bir oyun ve etkileşimli medya stüdyosudur. Mobil, web ve masaüstünde; fizik tabanlı mekanikler, minimalist estetik ve bağımlılık yaratan döngüler üzerine uzmanlaşıyoruz.',
      p2: 'Küçük ama odaklıyız. Her projede "bu gerçekten gerekli mi?" sorusunu soruyoruz ve cevap hayır ise çıkarıyoruz. Geri kalan her şeyi mükemmelleştiriyoruz.',
      values: [
        { icon: '⚡', title: 'Hız & Yalınlık', desc: 'Her mekanik sezgisel, her piksel kasıtlı. Gürültüyü çıkar, özü bırak.' },
        { icon: '🎮', title: 'Oyuncu Odaklı', desc: 'Her kararı gerçek oyuncularla test ederiz. Eğlence asla pazarlamaya kurban edilmez.' },
        { icon: '🔬', title: 'AR-GE Kültürü', desc: 'Kanıtlanmış kalıpları kırarız. Her proje bir deney, her hata bir ders.' },
        { icon: '🌍', title: 'Küresel Vizyon', desc: 'İstanbul\'dan dünyanın her köşesine ulaşan oyunlar kodluyoruz.' },
      ],
      journey: 'Yolculuğumuz',
      journeyLead: '2023\'ten bugüne yayınlanan oyunlar, uygulamalar, kurumsal işler ve AR-GE projeleri. Listeyi süz, detay için bir karta dokun.',
      journeyStatProjects: 'kilometre taşı',
      journeyStatYears: 'yıl',
      journeyStatShipped: 'yayında',
      journeyExpand: 'Detay',
      months: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
      journeyFilters: {
        all: 'TÜMÜ',
        studio: 'STÜDYO',
        game: 'OYUN',
        app: 'UYGULAMA',
        corporate: 'KURUMSAL',
        rnd: 'AR-GE',
      },
      journeyBadges: {
        studio: 'STÜDYO',
        game: 'OYUN',
        app: 'UYGULAMA',
        web: 'WEB',
        corporate: 'KURUMSAL',
        rnd: 'AR-GE',
      },
      journeyLinks: {
        github: 'Kaynak kodu',
        live: 'Canlı',
        appStore: 'App Store',
        googlePlay: 'Google Play',
        restricted: 'Telif nedeniyle paylaşılmıyor',
        inProgress: 'Geliştiriliyor',
      },
      journeyItems: {
        studioFounded: {
          title: 'Ardeko Studios kuruldu',
          desc: 'Bağımsız bir oyun ve etkileşimli medya stüdyosu olarak yola çıkıldı — 1 geliştirici, 0 ödün.',
        },
        protocol: {
          title: 'Protocol',
          desc: 'Heyecan dolu bir hız ve strateji yarışı. Stüdyonun ilk oyun denemelerinden biri.',
        },
        ardobot: {
          title: 'Ardobot',
          desc: 'Yapay zeka destekli, özelleştirilebilir bir Discord botu.',
        },
        teknofest: {
          title: 'Teknofest Otonom Su Altı Dronu',
          desc: 'Otonom görüntü işleme teknolojisiyle tasarlanan su altı dronu. Yazılım tarafı gerçek zamanlı görüntü analizi üzerine kuruldu.',
        },
        wordeko: {
          title: 'Wordeko',
          desc: 'Eğlenceli bir kelime tahmin oyunu.',
        },
        legendOfRey: {
          title: 'Legend of Rey',
          desc: 'Python tabanlı macera platform oyunu. itch.io\'da yayınlanan ilk oyunumuz.',
        },
        renault: {
          title: 'Renault Randevu & Muayene',
          desc: 'Renault MAIS için geliştirilen randevu ve muayene uygulaması.',
        },
        ardaguner: {
          title: 'ardaguner.com',
          desc: 'Kurucunun kişisel portfolyo sitesi yayına alındı — projeler, yetenekler ve iletişim tek adreste.',
        },
        stok: {
          title: 'Stok Ekstresi Web Uygulaması',
          desc: 'MSSQL veritabanı ile çalışan, filtrelenebilir ASP.NET Core MVC tabanlı stok takibi uygulaması.',
        },
        revo: {
          title: 'REVO',
          desc: 'SignalR ve WebRTC ile geliştirilen, tarayıcı üzerinden sesli ve yazılı iletişim sağlayan uygulama. Uçtan uca şifreli, düşük gecikmeli.',
        },
        nebula: {
          title: 'Nebula — Balon Patlatma',
          desc: '50 seviyelik ve sonsuz modlu, kozmik temalı bir bubble shooter. React, Phaser 3, FastAPI ve MongoDB ile geliştirildi.',
        },
        switchMaster: {
          title: 'Switch Master: Railway',
          desc: 'İlk oyun App Store ve Google Play\'de yayına girdi. Demiryolu makaslarını doğru zamanda çevirmeye dayanan minimalist bulmaca.',
        },
        ardekostudios: {
          title: 'ardekostudios.com',
          desc: 'Stüdyonun kendi sitesi yayına alındı — React 19, Vite 8 ve Tailwind v4 üzerine kurulu, TR/EN iki dilli.',
        },
        sarteks: {
          title: 'Sarteks Makina',
          desc: 'Adana merkezli, 50 yılı aşkın süredir Türk iplik sektörüne tekstil makinesi, sarfiyat ve satış sonrası servis sağlayan Sarteks Makina\'nın kurumsal sitesi. Next.js 16 üzerine kurulu; RTL desteğiyle birlikte 10 dilde yayında.',
        },
        dny: {
          title: 'DNY Bilişim',
          desc: 'DNY Bilişim için kurumsal web sitesi: hizmetler, referanslar, SSS ve uzaktan destek sayfaları.',
        },
        decoy: {
          title: 'Decoy',
          desc: 'Yedi ulusun hileli savaşı. Gerçek zamanlı alan hakimiyeti stratejisi: bir bölgenin yayınladığı güç ile gerçek gücü aynı şey değildir.',
        },
        torpidodan: {
          title: 'Torpidodan',
          desc: 'İkinci el araba alım-satım simülasyonu. Aracın gerçek değerini asla göremezsin — ekspertize öde, gürültüyü azalt.',
        },
        growth: {
          title: 'Büyüme dönemi',
          desc: 'Ekip genişliyor, vizyon büyüyor. Decoy ve Torpidodan geliştirme aşamasında, yeni nesil mekanikler test ediliyor.',
        },
      },
    },

    games: {
      eyebrow: 'Neler Yapıyoruz?',
      title: 'PROJELERİMİZ',
      statusLive: '● Yayında',
      statusSoon: 'Çok Yakında',
      hintBrowser: 'Tarayıcıda aç ya da masaüstüne kur',
      hintOneClick: 'Tek tıkla bağlan, kurulum gerekmez',
      comingToStores: 'Mağazalarda çok yakında',
      reviewsSuffix: 'değerlendirme',
      secret: {
        codename: 'Project Codename: Unknown',
        title: 'YENİ PROJE',
        desc: 'Sınırları zorlayan yeni nesil bir mobil deneyim için AR-GE süreçlerimiz devam ediyor. Çok yakında burada listelenecek — takipte kal.',
        soon: 'Yakında...',
      },
      items: {
        switch: {
          desc: 'Demiryolu makaslarını doğru zamanda değiştir, trenleri kazasız hedeflerine ulaştır. Refleks ve stratejiyi birleştiren minimalist bir bulmaca deneyimi.',
          rating: '5 · 10+',
        },
        revo: {
          subtitle: 'Arkadaşlarınla aynı frekansta buluş',
          desc: 'Uçtan uca şifreli, düşük gecikmeli sesli sohbet. Odanı saniyeler içinde kur ve linki paylaş; gürültü engelleme, ekran paylaşımı ve kişi başı ses kontrolü hazır gelir.',
          linkPrimary: 'SOHBETE BAŞLA',
          linkSecondary: 'WINDOWS için indir',
          linkSecondaryNote: 'WINDOWS 10/11 · 64-BIT · Kurulum dosyası',
        },
        forza: {
          desc: 'Halkadan halkaya fırla, tam kenarda \'Perfect\' yakala. Zamanlama üzerine kurulu minimalist, hipnotik bir arcade.',
          linkPrimary: 'OYNA',
        },
        apex: {
          desc: 'Sınırları zorlayan, yüksek tempoya ve anlık kararlara dayanan yeni nesil arcade deneyimi.',
          linkPrimary: 'OYNA',
        },
        kafa: {
          desc: 'İki oyuncunun kıyasıya çarpıştığı, fizik tabanlı hızlı bir kafa topu oyunu. Kupalar, yetenek kartları ve çevrimiçi sıralamayla rekabetçi mobil deneyim.',
        },
        rushville: {
          desc: 'Büyüyen şehrin trafiğini akışta tut. Renk renk mahalleleri yollarla bağla, tıkanıklığı çöz — sade ama derin bir şehir-bulmaca.',
        },
        skyline: {
          desc: 'Alacakaranlık şehrinde ağdan ağa savrul. Sarkaç fiziğiyle çalışan, refleks odaklı sonsuz koşu.',
        },
        decoy: {
          subtitle: 'Gücünü gizle, düşmanını yanılt',
          desc: 'Yedi ulus, tek harita. Bir bölgenin yayınladığı güç ile gerçek gücü aynı şey değildir. Kazanmak için düşmanını kuşatman ve yalanı doğru anda yakalaman gerekir — gerçek zamanlı alan hakimiyeti stratejisi.',
        },
        torpidodan: {
          subtitle: 'Gerçek değeri asla göremezsin',
          desc: 'İkinci el araba alım-satım simülasyonu. Bir aracın gerçek değeri sana kapalı; elinde sadece gürültülü bir tahmin var. Ekspertize öde, gürültüyü azalt — ya da riske gir ve pazarlık masasında öde.',
        },
      },
      scenes: {
        decoy: { broadcast: 'YAYINLANAN', real: 'GERÇEK' },
        torpidodan: { inspect: 'EKSPERTİZ', tramer: 'TRAMER', stamp: 'İKİNCİ EL' },
      },
      previewMeta: {
        switch: 'IOS · ANDROID',
        revo: 'WEB · WINDOWS',
        forza: 'WEB · BROWSER',
        apex: 'WEB · BROWSER',
        kafa: 'Yakında · Mobil',
        rushville: 'Yakında · Mobil',
        skyline: 'Yakında · Mobil',
        decoy: 'Yakında · Web',
        torpidodan: 'Yakında · Mobil',
      },
    },

    contact: {
      eyebrow: 'Ulaşın',
      title: 'İLETİŞİM',
      lead: 'İş birliği fırsatları, basın sorguları veya sadece merhaba demek için — her türlü mesajı bekliyoruz.',
      cards: [
        { icon: '✉️', label: 'E-posta', value: 'info@ardekostudios.com', href: 'mailto:info@ardekostudios.com' },
        { icon: '📸', label: 'INSTAGRAM', value: '@ardekostudios', href: 'https://www.instagram.com/ardekostudios/' },
        { icon: '📍', label: 'Konum', value: 'İstanbul, Türkiye', href: '#' },
      ],
      responseNote: 'Genellikle 24 saat içinde yanıt veriyoruz',
      form: {
        nameLabel: 'Adınız',
        namePlaceholder: 'Arda GÜNER',
        emailLabel: 'E-posta',
        emailPlaceholder: 'info@ardekostudios.com',
        messageLabel: 'Mesajınız',
        messagePlaceholder: 'Merhaba, sizinle iletişime geçmek istiyorum...',
        send: 'Gönder →',
        sending: 'Gönderiliyor...',
        serverError: 'Bir hata oluştu. Lütfen tekrar deneyin veya direkt e-posta gönderin.',
        errors: {
          name: 'Ad gerekli',
          email: 'E-posta gerekli',
          emailInvalid: 'Geçerli bir e-posta girin',
          message: 'Mesaj gerekli',
        },
        successTitle: 'Mesajınız ulaştı!',
        successBody: 'En kısa sürede geri dönüş yapacağız.',
        sendAnother: 'Yeni mesaj gönder',
      },
    },

    footer: {
      desc: 'İstanbul merkezli bağımsız oyun ve etkileşimli medya stüdyosu. Minimalist mekanikler, maksimum eğlence.',
      social: 'Sosyal',
      legal: 'Hukuki',
      privacy: 'Gizlilik Politikası',
      rights: 'Tüm hakları saklıdır.',
    },
  },

  en: {
    hero: {
      badge: 'Games & Interactive Media',
      lead: 'WE CRAFT',
      desc: 'At Ardeko Studios, we blend physics-based mechanics and addictive minimalist puzzles with visuals that stand out.',
      primary: 'Explore Games',
      secondary: 'About Us',
      stats: [
        { value: '4', label: 'Live' },
        { value: '5★', label: 'App Store Rating' },
        { value: '5★', label: 'Google Play Rating' },
      ],
      scroll: 'Scroll',
    },

    viewport: {
      tabs: { game: 'GAME', app: 'APP' },
      hint: 'Switch tab',
    },

    about: {
      eyebrow: 'WHO WE ARE',
      title: 'About Us',
      quotePre: '"We\'re not here to make mobile games, we\'re here to ',
      quoteHighlight: 'design experiences',
      quotePost: '."',
      p1: 'Ardeko Studios is an independent games and interactive media studio based in Istanbul. Across mobile, web and desktop we specialize in physics-based mechanics, minimalist aesthetics, and addictive loops.',
      p2: 'We\'re small but focused. On every project we ask "is this actually necessary?" — if the answer is no, it goes. We polish everything that\'s left.',
      values: [
        { icon: '⚡', title: 'Speed & Simplicity', desc: 'Every mechanic intuitive, every pixel deliberate. Cut the noise, keep the core.' },
        { icon: '🎮', title: 'Player First', desc: 'We test every decision with real players. Fun is never sacrificed for marketing.' },
        { icon: '🔬', title: 'R&D Culture', desc: 'We break proven patterns. Every project is an experiment, every failure a lesson.' },
        { icon: '🌍', title: 'Global Vision', desc: 'We code games that travel from Istanbul to every corner of the world.' },
      ],
      journey: 'Our Journey',
      journeyLead: 'Games, apps, client work and R&D shipped from 2023 to today. Filter the list, tap a card for the details.',
      journeyStatProjects: 'milestones',
      journeyStatYears: 'years',
      journeyStatShipped: 'shipped',
      journeyExpand: 'Details',
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      journeyFilters: {
        all: 'ALL',
        studio: 'STUDIO',
        game: 'GAME',
        app: 'APP',
        corporate: 'CLIENT WORK',
        rnd: 'R&D',
      },
      journeyBadges: {
        studio: 'STUDIO',
        game: 'GAME',
        app: 'APP',
        web: 'WEB',
        corporate: 'CLIENT WORK',
        rnd: 'R&D',
      },
      journeyLinks: {
        github: 'Source',
        live: 'Live',
        appStore: 'App Store',
        googlePlay: 'Google Play',
        restricted: 'Not shared due to copyright',
        inProgress: 'In development',
      },
      journeyItems: {
        studioFounded: {
          title: 'Ardeko Studios founded',
          desc: 'Started out as an independent game and interactive media studio — 1 developer, 0 compromises.',
        },
        protocol: {
          title: 'Protocol',
          desc: 'An exciting race of speed and strategy. One of the studio\'s earliest game experiments.',
        },
        ardobot: {
          title: 'Ardobot',
          desc: 'An AI-powered, fully customizable Discord bot.',
        },
        teknofest: {
          title: 'Teknofest Autonomous Underwater Drone',
          desc: 'An underwater drone built around autonomous computer vision. The software side centred on real-time image analysis.',
        },
        wordeko: {
          title: 'Wordeko',
          desc: 'A fun word guessing game.',
        },
        legendOfRey: {
          title: 'Legend of Rey',
          desc: 'A Python-based adventure platformer. Our first game shipped on itch.io.',
        },
        renault: {
          title: 'Renault Appointment & Inspection',
          desc: 'An appointment and vehicle inspection app built for Renault MAIS.',
        },
        ardaguner: {
          title: 'ardaguner.com',
          desc: 'The founder\'s personal portfolio site went live — projects, skills and contact in one place.',
        },
        stok: {
          title: 'Stock Statement Web App',
          desc: 'A filterable stock tracking application on ASP.NET Core MVC, backed by an MSSQL database.',
        },
        revo: {
          title: 'REVO',
          desc: 'Browser-based voice and text communication built with SignalR and WebRTC. End-to-end encrypted, low latency.',
        },
        nebula: {
          title: 'Nebula — Bubble Shooter',
          desc: 'A cosmic-themed bubble shooter with 50 levels and an endless mode. Built with React, Phaser 3, FastAPI and MongoDB.',
        },
        switchMaster: {
          title: 'Switch Master: Railway',
          desc: 'Our first game launched on the App Store and Google Play. A minimalist puzzle built on flipping railway switches at the right moment.',
        },
        ardekostudios: {
          title: 'ardekostudios.com',
          desc: 'The studio\'s own site went live — built on React 19, Vite 8 and Tailwind v4, bilingual TR/EN.',
        },
        sarteks: {
          title: 'Sarteks Makina',
          desc: 'The corporate site for Sarteks Makina — Adana-based, supplying the world\'s leading textile machinery, consumables and after-sales service to the Turkish spinning industry for over 50 years. Built on Next.js 16, shipped in 10 languages with RTL support.',
        },
        dny: {
          title: 'DNY Bilişim',
          desc: 'A corporate website for DNY Bilişim: services, references, FAQ and remote support pages.',
        },
        decoy: {
          title: 'Decoy',
          desc: 'The deceitful war of seven nations. Real-time area control strategy: what a region broadcasts is not what it actually holds.',
        },
        torpidodan: {
          title: 'Torpidodan',
          desc: 'A used-car trading simulation. You never see a car\'s true value — pay for an inspection to cut the noise.',
        },
        growth: {
          title: 'Growth phase',
          desc: 'The team is expanding, the vision is growing. Decoy and Torpidodan are in development, next-gen mechanics in testing.',
        },
      },
    },

    games: {
      eyebrow: 'What We Do',
      title: 'OUR PROJECTS',
      statusLive: '● Live',
      statusSoon: 'Coming Soon',
      hintBrowser: 'Open in browser or install on desktop',
      hintOneClick: 'One-click connect, no install needed',
      comingToStores: 'Coming soon to app stores',
      reviewsSuffix: 'reviews',
      secret: {
        codename: 'Project Codename: Unknown',
        title: 'NEW PROJECT',
        desc: 'We\'re deep in R&D on a boundary-pushing, next-gen mobile experience. It\'ll be listed here soon — stay tuned.',
        soon: 'Coming soon...',
      },
      items: {
        switch: {
          desc: 'Flip railway switches at just the right moment and get every train to its destination without a crash. A minimalist puzzle that blends reflex and strategy.',
          rating: '5 · 10+',
        },
        revo: {
          subtitle: 'Meet your friends on the same frequency',
          desc: 'End-to-end encrypted, low-latency voice chat. Spin up a room in seconds and share the link — noise suppression, screen sharing, and per-person volume come built in.',
          linkPrimary: 'START CHATTING',
          linkSecondary: 'Download for Windows',
          linkSecondaryNote: 'Windows 10/11 · 64-bit · Installer',
        },
        forza: {
          desc: 'Launch from ring to ring, land a \'Perfect\' right on the edge. A minimalist, hypnotic arcade built on timing.',
          linkPrimary: 'PLAY',
        },
        apex: {
          desc: 'A next-gen arcade experience built on pushing limits, high tempo, and split-second decisions.',
          linkPrimary: 'PLAY',
        },
        kafa: {
          desc: 'A fast, physics-based head-to-head ball game where two players collide head-on. A competitive mobile experience with trophies, skill cards, and online ranking.',
        },
        rushville: {
          desc: 'Keep a growing city\'s traffic flowing. Connect colorful neighborhoods with roads and untangle the jams — a simple yet deep city puzzle.',
        },
        skyline: {
          desc: 'Swing from web to web across a twilight city. A reflex-driven endless runner built on pendulum physics.',
        },
        decoy: {
          subtitle: 'Hide your strength, mislead your enemy',
          desc: 'Seven nations, one map. What a region broadcasts is never what it actually holds. To win you have to surround your enemy and call the bluff at exactly the right moment — real-time area control strategy.',
        },
        torpidodan: {
          subtitle: 'You never see the true value',
          desc: 'A used-car trading simulation. A car\'s real worth stays hidden from you; all you get is a noisy estimate. Pay for an inspection to cut the noise — or take the risk and pay for it at the negotiating table.',
        },
      },
      scenes: {
        decoy: { broadcast: 'BROADCAST', real: 'ACTUAL' },
        torpidodan: { inspect: 'INSPECTION', tramer: 'DAMAGE', stamp: 'USED CAR' },
      },
      previewMeta: {
        switch: 'IOS · ANDROID',
        revo: 'WEB · WINDOWS',
        forza: 'WEB · BROWSER',
        apex: 'WEB · BROWSER',
        kafa: 'Coming soon · Mobile',
        rushville: 'Coming soon · Mobile',
        skyline: 'Coming soon · Mobile',
        decoy: 'Coming soon · Web',
        torpidodan: 'Coming soon · Mobile',
      },
    },

    contact: {
      eyebrow: 'Reach Out',
      title: 'CONTACT',
      lead: 'For collaboration opportunities, press inquiries, or just to say hello — we\'re open to any kind of message.',
      cards: [
        { icon: '✉️', label: 'Email', value: 'info@ardekostudios.com', href: 'mailto:info@ardekostudios.com' },
        { icon: '📸', label: 'INSTAGRAM', value: '@ardekostudios', href: 'https://www.instagram.com/ardekostudios/' },
        { icon: '📍', label: 'Location', value: 'Istanbul, Turkey', href: '#' },
      ],
      responseNote: 'We usually reply within 24 hours',
      form: {
        nameLabel: 'Your name',
        namePlaceholder: 'Arda GÜNER',
        emailLabel: 'Email',
        emailPlaceholder: 'info@ardekostudios.com',
        messageLabel: 'Your message',
        messagePlaceholder: 'Hi, I\'d like to get in touch...',
        send: 'Send →',
        sending: 'Sending...',
        serverError: 'Something went wrong. Please try again or email us directly.',
        errors: {
          name: 'Name is required',
          email: 'Email is required',
          emailInvalid: 'Enter a valid email',
          message: 'Message is required',
        },
        successTitle: 'Message received!',
        successBody: 'We\'ll get back to you as soon as possible.',
        sendAnother: 'Send another message',
      },
    },

    footer: {
      desc: 'Independent games and interactive media studio based in Istanbul. Minimalist mechanics, maximum fun.',
      social: 'Social',
      legal: 'Legal',
      privacy: 'Privacy Policy',
      rights: 'All rights reserved.',
    },
  },
};

export const LANGS = ['tr', 'en'];
