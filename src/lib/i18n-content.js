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
      timeline: [
        { year: '2023', event: 'Ardeko Studios kuruldu', sub: '1 geliştirici, 0 ödün.' },
        { year: '2024', event: 'Legend of Rey', sub: 'Itch.io\'da ilk oyunumuz yayınlandı.' },
        { year: '2025', event: 'Wordeko, Protocol ve Nebula - Bubble Shooter', sub: '3 farklı mini mobil oyun ardaguner.com\'da yayınlandı.' },
        { year: '2026', event: 'Switch Master: Railway', sub: 'İlk oyun Google Play ve App Store\'da yayına girdi.' },
        { year: '2026', event: 'Yeni projelere başlandı', sub: 'Yeni nesil mekanikler geliştiriliyor.' },
        { year: '2026', event: 'Büyüme dönemi', sub: 'Ekip genişliyor, vizyon büyüyor.' },
      ],
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
          linkSecondary: 'Windows için indir',
          linkSecondaryNote: 'Windows 10/11 · 64-bit · Kurulum dosyası',
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
        switch: 'iOS · Android',
        revo: 'Web · Windows',
        forza: 'Web · Browser',
        apex: 'Web · Browser',
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
      timeline: [
        { year: '2023', event: 'Ardeko Studios founded', sub: '1 developer, 0 compromises.' },
        { year: '2024', event: 'Legend of Rey', sub: 'Our first game shipped on itch.io.' },
        { year: '2025', event: 'Wordeko, Protocol and Nebula - Bubble Shooter', sub: '3 different mini mobile games shipped on ardaguner.com.' },
        { year: '2026', event: 'Switch Master: Railway', sub: 'Our first game launched on Google Play and the App Store.' },
        { year: '2026', event: 'New projects underway', sub: 'Next-gen mechanics in development.' },
        { year: '2026', event: 'Growth phase', sub: 'The team is expanding, the vision is growing.' },
      ],
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
        switch: 'iOS · Android',
        revo: 'Web · Windows',
        forza: 'Web · Browser',
        apex: 'Web · Browser',
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
